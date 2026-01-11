import type { Request, Response } from "express";
import prisma from "../../DB/db.js";


export default class Languages{
    getAllLanguages = async (req:Request,res:Response) =>{
          try {
            const data = await prisma.languages.findMany({});

            return res.status(200).json({msg:"All Languages",data:data});
          } catch (error) {
             return res.status(500).json({msg:"Internal Server Error"});
          }
    }
}