import { Router } from "express";
import Languages from "../../controllers/languages/index.js";

const language = new Languages();

const router = Router();

router.get('/all-languages',language.getAllLanguages);


export default router;