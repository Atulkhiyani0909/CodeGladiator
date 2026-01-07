import express from 'express';
import { createClient } from 'redis';
import { loadProblemData } from './utils/problemLoader.js';
import { executeDocker } from './utils/dockerRunner.js';
import axios from 'axios';

const client = createClient();
const app = express();

const MAIN_SERVER_URL = 'http://localhost:8080';

async function main() {
    try {
        await client.connect();
        console.log("✅ Connected to Redis");

        while (true) {
            try {
                
                const submission = await client.brPop('Execution', 0);
                
                // @ts-ignore
                const job = JSON.parse(submission.element);
                console.log("📨 Processing Job:", job.id);

                
                const problemFiles = await loadProblemData(job.problem.slug); 
                const { fullInputs, fullOutputs } = problemFiles;

              
                const executionResult = await executeDocker(
                    job.id, 
                    job.code, 
                    fullInputs, 
                    job.language.name, 
                    job.problem.slug
                );

                console.log("---------------------------------");
                console.log("🤖 Docker Execution Success:", executionResult.success);

                let isCorrect = false;

                if (executionResult.success) {
                    const DELIMITER = "$$$DELIMITER$$$";
                    
                
                    let userOutput = (executionResult.output || "").trim();
                    const expectedOutput = fullOutputs.trim();

                    if (userOutput.endsWith(DELIMITER)) {
                        userOutput = userOutput.slice(0, -DELIMITER.length).trim();
                    }

                    console.log("---------------------------------");
             
                    
                    isCorrect = (userOutput === expectedOutput);
                    
                    console.log("Match Status:", isCorrect);
                    console.log("---------------------------------");

                    if (isCorrect) {
                        console.log(`✅ Job ${job.id} Passed!`);
                    } else {
                        console.log(`❌ Job ${job.id} Failed (Wrong Answer)`);
                    }
                } else {
                    console.log(`❌ Job ${job.id} Failed (Runtime/Compilation Error)`);
                    console.log("Error Log:", executionResult.error);
                }

              
                await saveStatus(job.id, isCorrect, executionResult);

            } catch (jobError: any) {
                console.error(`⚠️ Error processing specific job:`, jobError.message);
             
            }
        }
    } catch (connectionError: any) {
        console.error("❌ Fatal Redis/Worker Error:", connectionError.message);
    }
}


const saveStatus = async (jobId: string, isSuccess: boolean, executionResult: any) => {
    try {
        await axios.post(`${MAIN_SERVER_URL}/api/v1/webhook/save/status/${jobId}`, {
            success: isSuccess,
           
            output: isSuccess ? executionResult.output : executionResult.error
        });
        console.log(`📡 Status sent to Main Server for ${jobId}`);
    } catch (err: any) {
        console.error(`❌ Failed to update Main Server: ${err.message}`);
    }
}


main();


app.listen(3000, () => {
    console.log('🚀 Worker listening on port 3000');
});