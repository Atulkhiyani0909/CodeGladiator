import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { LANGUAGE_CONFIG } from '../utils/languageConfig.js';

const TEMP_DIR = path.join(process.cwd(), 'temp');
const PROBLEM_DIR = path.join(process.cwd(), 'problems');
const TIMEOUT_MS = 5000;

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

    return new Promise(async (resolve) => {

        const config = LANGUAGE_CONFIG[language];
        if (!config || !config.fileName) {
            return resolve({
                success: false,
                error: `Invalid language configuration for '${language}'`
            });
        }

        const uniqueId = `job_${jobId}`;

        // 🔥 IMPORTANT: Java file name must be CONSTANT
        const hostCodeFilename =
            language === 'java'
                ? config.fileName          // Run.java
                : `${uniqueId}_${config.fileName}`;

        const codeFilePath = path.join(TEMP_DIR, hostCodeFilename);
        const inputFilePath = path.join(TEMP_DIR, `${uniqueId}_input.txt`);

        try {
            const extension = getExtension(language);

            const specificDriverPath = path.join(
                PROBLEM_DIR,
                slug,
                'drivers',
                language,
                config.fileName
            );

            const genericDriverPath = path.join(
                PROBLEM_DIR,
                slug,
                'drivers',
                language,
                `driver.${extension}`
            );

            let driverCode = '';

            if (fs.existsSync(specificDriverPath)) {
                driverCode = fs.readFileSync(specificDriverPath, 'utf-8');
            } else if (fs.existsSync(genericDriverPath)) {
                driverCode = fs.readFileSync(genericDriverPath, 'utf-8');
            } else {
                return resolve({
                    success: false,
                    error: `Driver not found for problem '${slug}'`
                });
            }

            // 🧠 JAVA-SPECIFIC FIXES
            if (language === 'java') {
                // Force class name to Run
                userCode = userCode.replace(
                    /public\s+class\s+\w+/,
                    'public class Run'
                );

                if (!driverCode.includes('//_USER_CODE_HERE_')) {
                    return resolve({
                        success: false,
                        error: 'Java driver missing //_USER_CODE_HERE_ placeholder'
                    });
                }

                driverCode = driverCode.replace('//_USER_CODE_HERE_', userCode);
            }

            const finalCode =
                language === 'java'
                    ? driverCode
                    : `${userCode}\n\n${driverCode}`;

            fs.writeFileSync(codeFilePath, finalCode);
            fs.writeFileSync(inputFilePath, fullInputs);

            const dockerArgs = [
                'run',
                '--name', uniqueId,
                '--rm',
                '--network', 'none',
                '--memory', '256m',
                '--cpus', '0.5',
                '-v', `${codeFilePath}:/app/${config.fileName}`,
                '-v', `${inputFilePath}:/app/input.txt`,
                '-w', '/app',
                config.image,
                'sh', '-c',
                language === 'java'
                    ? `javac ${config.fileName} && java -Xmx128m Run`
                    : config.runCommand(config.fileName)
            ];

            const dockerProcess = spawn('docker', dockerArgs);

            let stdoutData = '';
            let stderrData = '';
            let isTimedOut = false;

            const timer = setTimeout(() => {
                isTimedOut = true;
                spawn('docker', ['kill', uniqueId]);
                cleanupFiles(codeFilePath, inputFilePath);
                resolve({ success: false, error: 'Time Limit Exceeded' });
            }, TIMEOUT_MS);

            dockerProcess.stdout.on('data', d => stdoutData += d.toString());
            dockerProcess.stderr.on('data', d => stderrData += d.toString());

            dockerProcess.on('close', (code) => {
                clearTimeout(timer);
                if (isTimedOut) return;

                cleanupFiles(codeFilePath, inputFilePath);

                if (code !== 0) {
                    resolve({
                        success: false,
                        error: stderrData || 'Runtime Error'
                    });
                } else {
                    resolve({
                        success: true,
                        output: stdoutData.trim()
                    });
                }
            });

            dockerProcess.on('error', (err) => {
                clearTimeout(timer);
                cleanupFiles(codeFilePath, inputFilePath);
                resolve({
                    success: false,
                    error: `Docker Error: ${err.message}`
                });
            });

        } catch (err: any) {
            cleanupFiles(codeFilePath, inputFilePath);
            resolve({
                success: false,
                error: `Internal Error: ${err.message}`
            });
        }
    });
};

const getExtension = (lang: string) => {
    switch (lang) {
        case 'javascript': return 'js';
        case 'python': return 'py';
        case 'cpp': return 'cpp';
        case 'java': return 'java';
        default: return 'txt';
    }
};

const cleanupFiles = (...paths: string[]) => {
    paths.forEach(p => {
        try {
            if (fs.existsSync(p)) fs.unlinkSync(p);
        } catch {}
    });
};
