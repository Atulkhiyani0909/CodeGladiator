import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import { LANGUAGE_CONFIG } from '../utils/languageConfig.js';

// 🔧 DEBUGGING: Set to TRUE if you want to inspect files after run
const KEEP_FILES = false; 

const TEMP_DIR = path.resolve(process.cwd(), 'temp');
const TIMEOUT_MS = 15000;

const GITHUB_RAW_BASE =
    'https://raw.githubusercontent.com/Atulkhiyani0909/CodeGladiator/main/Code/apps/problems_directory/problems';

const GITHUB_LANG_MAP: Record<string, string> = {
    java: 'java',
    javascript: 'javascript',
    python: 'python',
    cpp: 'cpp'
};

// Ensure temp dir exists at startup
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

interface ExecutionResult {
    success: boolean;
    output?: string;
    error?: string;
}

const getExtension = (lang: string) => {
    switch (lang) {
        case 'javascript': return 'js';
        case 'python': return 'py';
        case 'cpp': return 'cpp';
        case 'java': return 'java';
        default: return 'txt';
    }
};

async function fetchDriverCode(
    slug: string,
    language: string,
    remoteFileName: string
): Promise<string> {
    const langFolder = GITHUB_LANG_MAP[language];
    if (!langFolder) throw new Error(`Unsupported language: ${language}`);

    const url = `${GITHUB_RAW_BASE}/${slug}/drivers/${langFolder}/${remoteFileName}`;
    console.log(`🌐 Fetching driver: ${url}`);

    try {
        const res = await axios.get(url, { timeout: 15000 });
        if (typeof res.data !== 'string') {
            throw new Error('Invalid driver content received');
        }
        return res.data;
    } catch (err: any) {
        throw new Error(`Failed to fetch driver: ${err.message}`);
    }
}

export async function executeDocker(
    jobId: string,
    userCode: string,
    fullInputs: string,
    language: string,
    slug: string
): Promise<ExecutionResult> {

    // 1. Validation
    const config = LANGUAGE_CONFIG[language];
    if (!config) {
        return { success: false, error: `Invalid language config for '${language}'` };
    }

    if (!fullInputs || typeof fullInputs !== 'string') {
        return { success: false, error: "System Error: Inputs must be a valid string." };
    }

    console.log(fullInputs);
    
    // 2. Setup Unique Job Directory
    const uniqueId = `job_${jobId}_${crypto.randomUUID()}`;
    const jobDir = path.join(TEMP_DIR, uniqueId);
    
    console.log(jobDir);
    
    // Create the specific folder for this job
    fs.mkdirSync(jobDir, { recursive: true });

    const codeFileName = config.fileName; // e.g., Run.java or run.js
    const codeFilePath = path.join(jobDir, codeFileName);
    const inputFilePath = path.join(jobDir, 'input.txt');

    // Helper to Clean Up specifically this job's folder
    const cleanupJob = () => {
        if (KEEP_FILES) {
            console.log(`⚠️ Debug Mode: Keeping files in ${jobDir}`);
            return;
        }
        try {
            if (fs.existsSync(jobDir)) {
                fs.rmSync(jobDir, { recursive: true, force: true });
            }
        } catch (e) {
            console.error(`Failed to clean up job ${uniqueId}`, e);
        }
    };

    try {
        // 3. Fetch Driver & Prepare Code
        const extension = getExtension(language);
        const remoteFileName = language === 'java' ? 'Run.java' : `driver.${extension}`;

        let driverCode = await fetchDriverCode(slug, language, remoteFileName);

        if (language === 'java') {
            userCode = userCode.replace(/public\s+class\s+\w+/, 'public class Run');
            if (!driverCode.includes('//_USER_CODE_HERE_')) {
                throw new Error('Java driver missing placeholder //_USER_CODE_HERE_');
            }
            driverCode = driverCode.replace('//_USER_CODE_HERE_', userCode);
        }

        const finalCode = language === 'java'
            ? driverCode
            : `${userCode}\n\n${driverCode}`;

        // 4. Write Files (CRITICAL STEP)
        console.log(`📂 Writing files to: ${jobDir}`);
        fs.writeFileSync(codeFilePath, finalCode);
        fs.writeFileSync(inputFilePath, fullInputs);

        // 5. Run Docker
        // Mount the entire jobDir to /app
        const dockerArgs = [
            'run',
            '--name', uniqueId,
            '--rm',               // Auto-remove container after run
            '--network', 'none',
            '--memory', '256m',
            '--cpus', '0.5',
            '-v', `${jobDir}:/app`, // Mount host folder to container folder
            '-w', '/app',
            config.image,
            'sh', '-c',
            language === 'java'
                ? `javac ${codeFileName} && java -Xmx128m Run`
                : config.runCommand(codeFileName)
        ];

        return await new Promise<ExecutionResult>((resolve) => {
            const docker = spawn('docker', dockerArgs);

            let stdout = '';
            let stderr = '';
            let isTimedOut = false;

            // Timeout Logic
            const timeoutTimer = setTimeout(() => {
                isTimedOut = true;
                console.error(`⏱️ Job ${uniqueId} Timed Out`);
                spawn('docker', ['kill', uniqueId]); // Kill container
                // Cleanup handled in 'close'
            }, TIMEOUT_MS);

            docker.stdout.on('data', (d) => stdout += d.toString());
            docker.stderr.on('data', (d) => stderr += d.toString());

            docker.on('close', (code) => {
                clearTimeout(timeoutTimer);
                
                // Remove the job folder now
                cleanupJob();


                console.log(code , "this clod");
                

                if (isTimedOut) {
                    resolve({ success: false, error: 'Time Limit Exceeded' });
                } else if (code !== 0) {
                    resolve({ success: false, error: stderr || 'Runtime Error' });
                } else {
                    resolve({ success: true, output: stdout.trim() });
                }
            });

            docker.on('error', (err) => {
                console.log(err, "this is erro r");
                
                clearTimeout(timeoutTimer);
                cleanupJob();
                resolve({ success: false, error: `Docker Start Error: ${err.message}` });
            });
        });

    } catch (err: any) {
        cleanupJob();
        console.error(`🔥 Internal Error Job ${uniqueId}:`, err);
        return { success: false, error: `Internal Server Error: ${err.message}` };
    }
}

