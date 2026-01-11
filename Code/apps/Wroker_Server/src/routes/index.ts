import { Router } from "express";
import BoilerPlate from "../controllers/index.js";

const boilerPlate = new BoilerPlate();

const router = Router();


router.get('/:slug/:language',boilerPlate.getBoilerPlate);


export default router;