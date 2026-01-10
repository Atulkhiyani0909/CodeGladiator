import type { Request, Response } from "express";
import prisma from "../../DB/db.js";

export default class Submission{
    getSubmissionStatus = async (req:Request,res:Response) =>{
        const {userId} = req.body;
        const {problemId}=req.params;

        if(!userId || !problemId){
            return res.status(404).json({msg:"No found any User Id"})
        }
        const result = await prisma.submission.findMany({
            where:{
                userId:userId,
                problemId:problemId
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        return res.status(200).json({msg:"Your Submission",data:result});
    }
}