import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { LANGUAGE_CONFIG } from '../utils/languageConfig.js'; 

const TEMP_DIR = path.join(process.cwd(), 'temp');
const PROBLEM_DIR = path.join(process.cwd(), 'problems');
const TIMEOUT_MS = 5000; // Reduced to 5s for faster feedback

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

interface ExecutionResult {
    success: boolean;
    output?: string;
    error?: string;
}

export const executeDocker = async (
    jobId: string,
    userCode: string,
    fullInputs: string,
    language: string,
    slug: string
): Promise<ExecutionResult> => {

    return new Promise(async (resolve, reject) => {
        // 1. VALIDATE LANGUAGE CONFIG
        const config = LANGUAGE_CONFIG[language];
        if (!config) {
            return resolve({ success: false, error: `Language '${language}' not supported.` });
        }

        const uniqueId = `job_${jobId}`;
        const codeFilename = config.fileName; 
        const codeFilePath = path.join(TEMP_DIR, `${uniqueId}_${codeFilename}`);
        const inputFilePath = path.join(TEMP_DIR, `${uniqueId}.txt`);

        try {
            // --- FIX 1: Correct Path Logic ---
            // Matches structure: problems/{slug}/drivers/{language}/driver.js
            const driverPath = path.join(PROBLEM_DIR, slug, 'drivers', language, `driver.${getExtension(language)}`);
            
            console.log(`🔍 Looking for driver at: ${driverPath}`);

            if (!fs.existsSync(driverPath)) {
                // If driver is missing, DO NOT RUN. It will just return empty output.
                return resolve({ success: false, error: `System Error: Driver code not found for problem '${slug}'` });
            }

            // Combine User Code + Driver Code
            const driverCode = fs.readFileSync(driverPath, 'utf-8');
            const finalCode = `${userCode}\n\n${driverCode}`;

            // Write files to Host Temp Dir
            fs.writeFileSync(codeFilePath, finalCode);
            fs.writeFileSync(inputFilePath, fullInputs);

            // --- FIX 2: Docker Arguments ---
            const dockerArgs = [
                'run',
                '--rm',               // Remove container after run
                '--network', 'none',  // No internet access
                '--memory', '128m',   // Memory limit
                '--cpus', '0.5',      // CPU limit
                '-v', `${codeFilePath}:/app/${codeFilename}`, // Mount Code
                '-v', `${inputFilePath}:/app/input.txt`,      // Mount Input
                '-w', '/app',         // Set Working Directory (Crucial for relative paths)
                config.image,         // Docker Image Name (e.g., node:18-alpine)
                'sh', '-c', config.runCommand(codeFilename)   // Run Command
            ];

            console.log(`🐳 Spawning Docker: ${language} for Job ${jobId}`);
            
            const dockerProcess = spawn('docker', dockerArgs);

            let stdoutData = '';
            let stderrData = '';
            let isTimedOut = false;

            // Timer to kill infinite loops
            const timer = setTimeout(() => {
                isTimedOut = true;
                console.error(`⏱️ Job ${jobId} Timed Out! Killing container...`);
                dockerProcess.kill();
                cleanupFiles(codeFilePath, inputFilePath);
                resolve({ success: false, error: 'Time Limit Exceeded' });
            }, TIMEOUT_MS);

            // Collect Output
            dockerProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
            });

            dockerProcess.stderr.on('data', (data) => {
                stderrData += data.toString();
            });

            // Handle Process Exit
            dockerProcess.on('close', (code) => {
                clearTimeout(timer);
                if (isTimedOut) return;

                cleanupFiles(codeFilePath, inputFilePath);

                console.log(`🏁 Job ${jobId} finished with code ${code}`);
                
                if (code !== 0) {
                    // Runtime Error (e.g. Syntax Error)
                    console.error(`❌ Docker Error (Code ${code}):`, stderrData);
                    resolve({ success: false, error: stderrData || 'Runtime Error' });
                } else {
                    // Success
                    if (!stdoutData.trim()) {
                        console.warn("⚠️ Container finished successfully but returned NO OUTPUT.");
                    }
                    resolve({ success: true, output: stdoutData });
                }
            });

            dockerProcess.on('error', (err) => {
                clearTimeout(timer);
                cleanupFiles(codeFilePath, inputFilePath);
                resolve({ success: false, error: `Docker Spawn Error: ${err.message}` });
            });

        } catch (error: any) {
            resolve({ success: false, error: `Internal Server Error: ${error.message}` });
        }
    });
};

// Helper: Get extension
const getExtension = (lang: string) => {
    switch (lang) {
        case 'javascript': return 'js';
        case 'python': return 'py';
        case 'cpp': return 'cpp';
        case 'java': return 'java';
        default: return 'txt';
    }
}

// Helper: Delete temp files
const cleanupFiles = (...paths: string[]) => {
    paths.forEach(p => {
        try {
            if (fs.existsSync(p)) fs.unlinkSync(p);
        } catch (e) {
            console.error(`Failed to delete temp file: ${p}`);
        }
    });
}