import type { Request, Response } from "express"
import prisma from "../../DB/db.js";
import client from "../../Redis/index.js";
import { getAuth } from "@clerk/express";



export default class Problems {
  getProblemById = async (req: Request, res: Response) => {
    const { id } = req.params;
     
    try {
      if (!id) {
        return res.status(404).json({ msg: "Id is not Provided" })
      }

      const problemCached = await client.get(`problem:${id}`);

      if (problemCached) {
        return res.status(200).json({
          msg: 'Problem Found',
          res: JSON.parse(problemCached)
        })
      }

      const problem = await prisma.problem.findUnique({
        where: {
          id: id
        }
      })

      await client.set(`problem:${id}`, JSON.stringify(problem));
      client.expire(`problem:${id}`, 10000);

      if (!problem) {
        return res.status(400).json({ msg: "Problem with this Id not found" });
      }

      return res.status(200).json({
        msg: 'Problem Found',
        res: problem
      })
    } catch (error) {
      return res.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  getProblems = async (req: Request, res: Response) => {
    try {

     
      const problemsCached = await client.get('problems');
      if (problemsCached) {
        return res.status(200).json({
          msg: "All Problems",
          data: JSON.parse(problemsCached)
        })
      }
      const problems = await prisma.problem.findMany();

      await client.set('problems', JSON.stringify(problems));
      client.expire('problems', 10000);

      return res.status(200).json({
        msg: "All Problems",
        data: problems
      })
    } catch (error) {
      return res.status(500).json({
        msg: "Internal Server Error"
      })
    }
  }
}