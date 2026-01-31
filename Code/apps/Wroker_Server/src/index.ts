import express from 'express';
import { loadProblemData } from './utils/problemLoader.js';
import { executeDocker } from './utils/dockerRunner.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import BoilerPlateRoutes from './routes/index.js';
import client from './Redis/index.js';

const app = express(); 

app.use(cors({ origin: ["http://localhost:3001"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/boilerplate', BoilerPlateRoutes);

async function startServer() {
    try {
 
        await client.connect();
        console.log("✅ Connected to Redis");

     
        app.listen(3000, () => {
            console.log('🚀 Worker API listening on port 3000');
        });

        runWorker();

    } catch (err) {
        console.error(" Failed to start server:", err);
    }
}

async function runWorker() {
    console.log("👷 Worker loop started...");
    
    while (true) {
        try {
         
            const submission = await client.brPop('Execution', 0);
            
            // @ts-ignore
            const job = JSON.parse(submission.element);
           
            
            console.log("⚙️ Processing Job:", job.id);

         
            const problemFiles = await loadProblemData(job.problem.slug);

           
            
            const { fullInputs, fullOutputs } = problemFiles;

            

            const executionResult = await executeDocker(
                job.id,
                job.code,
                fullInputs,
                job.language.name,
                job.problem.slug
            );

      
            let isCorrect = false;
            let finalOutput = "";

            if (executionResult.success) {
                const DELIMITER = "$$$DELIMITER$$$";
                let userOutput = (executionResult.output || "").trim();
                const expectedOutput = fullOutputs.trim();

              
                

                if (userOutput.endsWith(DELIMITER)) {
                    userOutput = userOutput.slice(0, -DELIMITER.length).trim();
                }

                isCorrect = (userOutput === expectedOutput);
                finalOutput = userOutput;
            } else {
                finalOutput = executionResult.error || "Runtime Error";
            }

            console.log(`Job ${job.id} Finished. Result: ${isCorrect ? "PASS" : "FAIL"}`);

           
            await publishResult(job.id, isCorrect, finalOutput, job.userId, job.problemId);

        } catch (error: any) {
            console.error(` Worker Error:`, error.message);
            // Safety pause
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}


const publishResult = async (jobId: string, isSuccess: boolean, output: string, userId: string, problemId: string) => {
    try {
        const channelName = `submission_result:${jobId}`;
        
        const payload = JSON.stringify({
            submissionId: jobId,
            status: isSuccess ? "ACCEPTED" : "WRONG",
            output: output,
            userId: userId,
            problemId: problemId
        });

       
        await client.publish(channelName, payload);
        
        console.log(` Published result to ${channelName}`);
    } catch (err: any) {
        console.error(` Failed to publish result: ${err.message}`);
    }
}

startServer();