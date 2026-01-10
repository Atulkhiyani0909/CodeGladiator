import type { Request, Response } from "express"
import prisma from "../../DB/db.js";


export default class Problems{
    getProblemById = async (req:Request,res:Response) =>{
         const {id} = req.params;
           
         try {
            if(!id){
                return res.status(404).json({msg:"Id is not Provided"})
            }
              const problem = await prisma.problem.findUnique({
                where:{
                    id:id
                }
              })

              if(!problem){
                return res.status(400).json({msg:"Problem with this Id not found"});
              }

              return res.status(200).json({
                msg:'Problem Found',
                res:problem
              })
         } catch (error) {
             return res.status(500).json({
                msg:'Internal Server Error'
              })
         }
    }

    getProblems  = async (req:Request,res:Response) =>{
            try {
              const problems = await prisma.problem.findMany({});

              return res.status(200).json({
                msg:"All Problems",
                data:problems
              })
            } catch (error) {
               return res.status(500).json({
                msg:"Internal Server Error"
              })
            }
    }
}