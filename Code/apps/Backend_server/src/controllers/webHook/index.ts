import type { Request, Response } from "express";
import prisma from "../../DB/db.js";


export const saveStatusTODB = async  (req: Request) => {
  const { jobId } = req.params;
  const { success ,output } = req.body;

  
  if (!jobId) throw new Error("JobId  is required");

  const submission = await prisma.submission.update({
    where:{
        id:jobId
    },
    data:{
        status:success ? 'ACCEPTED' : 'WRONG',
        output:output
    }
  })

};
