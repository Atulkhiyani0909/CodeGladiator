import { Router } from "express";
import Problems from "../../controllers/problems/index.js";

const router = Router();

const problem = new Problems();


router.get('/all',problem.getProblems)
router.get('/:id',problem.getProblemById)




export default router;