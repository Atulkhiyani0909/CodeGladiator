import express from 'express';
import { loadProblemData } from './utils/problemLoader.js';
import { executeDocker } from './utils/dockerRunner.js';
import axios from 'axios';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import BoilerPlateRoutes from './routes/index.js';
import client from './Redis/index.js';

const app = express();

app.use(cors({ origin: ["http://localhost:3001", "http://localhost:8080"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 1. Register Routes
app.use('/boilerplate', BoilerPlateRoutes);

async function startServer() {
    try {
        // 2. Connect to Redis FIRST
        await client.connect();
        console.log(" Connected to Redis");

        // 3. Start Express Server (Listen for requests)
        app.listen(3000, () => {
            console.log(' Worker listening on port 3000');
            console.log('Routes available at http://localhost:3000/boilerplate');
        });

        // 4. Start the Background Worker Loop
       

    } catch (err) {
        console.error(" Failed to start server:", err);
    }
}

// Separate the worker logic so it doesn't block startup
async function runWorker() {
    console.log("Worker loop started...");
    
    while (true) {
        try {
            // blocking pop - waits 0 seconds (forever) for a job
            const submission = await client.brPop('Execution', 0);
            
            // @ts-ignore
            const job = JSON.parse(submission.element);
            console.log(" Processing Job:", job.id);

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
            console.log(" Docker Execution Success:", executionResult.success);

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

                if (isCorrect) {
                    console.log(` Job ${job.id} Passed!`);
                } else {
                    console.log(` Job ${job.id} Failed (Wrong Answer)`);
                }
            } else {
                console.log(` Job ${job.id} Failed (Runtime Error)`);
                finalOutput = executionResult.error || "";
            }

            await saveStatus(job.id, isCorrect, finalOutput);

        } catch (error:any) {
            console.error(` Worker Error:`, error.message);
            // Safety pause to prevent infinite loop crashes
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

const MAIN_SERVER_URL = 'http://localhost:8080';
//@ts-ignore
const saveStatus = async (jobId, isSuccess, outputMessage) => {
    try {
        await axios.post(`${MAIN_SERVER_URL}/api/v1/webhook/save/status/${jobId}`, {
            success: isSuccess,
            output: outputMessage
        });
        console.log(` Status sent to Main Server for ${jobId}`);
    } catch (err:any) {
        console.error(` Failed to update Main Server: ${err.message}`);
    }
}

 runWorker();
startServer();