import type { Request, Response } from "express";
import z from 'zod'
import prisma from "../../DB/db.js";
import client from "../../Redis/index.js";
import { getAuth } from "@clerk/express";
import { getOrCreateUser } from "../../utils/userSync.js";

await client.connect();

const codeSchema = z.object({
    code: z.string(),
    languageId: z.string(),
    problemId: z.string()
})

interface SubmissionResult {
    status: string;
    [key: string]: any;
}

const statusListener = client.duplicate();
await statusListener.connect();


class CodeExecution {
    executeCode = async (req: Request, res: Response) => {
        console.log('Getting response via api ');
        
        try {
            const { userId } = getAuth(req);

            if (!userId) {
                return res.status(401).json({ msg: "Unauthenticated" });
            }

            const details = await getOrCreateUser(userId);

            if (!details) {
                return res.status(401).json({ msg: "Unauthenticated" })
            }

            const validation = codeSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({ msg: "Invalid Details", error: validation.error });
            }

            const { code, languageId, problemId } = validation.data;

            const result = await prisma.submission.create({
                data: {
                    code: code,
                    languageId: languageId,
                    problemId: problemId,
                    userId: details.id
                }
            })


            if (!result) {
                return res.status(500).json({ msg: "Unable to submit try again" })
            }

            const codeTOSend = await prisma.submission.findUnique({
                where: {
                    id: result.id
                },
                include: {
                    language: true,
                    problem: true
                }
            })

            const response = await client.lPush('Execution', JSON.stringify(codeTOSend));
            const channelName = `submission_result:${result.id}`;
            const val = await new Promise<SubmissionResult | null>((resolve) => {


                const timeout = setTimeout(() => {
                    console.log("Timeout waiting for execution result");
                    statusListener.unsubscribe(channelName);
                    resolve(null);
                }, 10000);

                statusListener.subscribe(channelName, (message) => {
                    clearTimeout(timeout);
                    console.log(" Received execution result:", message);

                    const executionResult = JSON.parse(message);

                    statusListener.unsubscribe(channelName);
                    resolve(executionResult);
                });
            });

            await prisma.submission.update({
                where: {
                    id: result.id
                },
                data: {
                    status: val?.status == 'ACCEPTED' ? 'ACCEPTED' : "WRONG",
                    output: val?.output
                }
            })

            if (!response) {
                return res.status(500).json({ msg: "Unable to Send the Code to the Execution Server" });
            }

            return res.status(200).json({ msg: "Code is Send for execution wait", result: codeTOSend });
        } catch (error) {
            return res.status(500).json({ msg: "Internal Server Error", error: error });
        }
    }
}

export default CodeExecution;