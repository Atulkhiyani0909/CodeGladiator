import fs from 'fs';
import path from 'path';


const PROBLEMS_DIR = path.join(process.cwd(), 'problems');

export const loadProblemData = (slug: string) => {
    const problemPath = path.join(PROBLEMS_DIR, slug);
    
    
    
    if (!fs.existsSync(problemPath)) {
        throw new Error(`Problem '${slug}' not found on server.`);
    }

    const inputPath = path.join(problemPath, '/input/mount_data.txt');
    const outputPath = path.join(problemPath, '/output/expected_data.txt');

  
    
    try {
        const fullInputs = fs.readFileSync(inputPath, 'utf-8');
        const fullOutputs = fs.readFileSync(outputPath, 'utf-8');

        return { fullInputs, fullOutputs };
    } catch (error) {
        throw new Error(`Missing test files for problem '${slug}'.`);
    }
};