import express from 'express'
import { saveStatusTODB } from '../../controllers/webHook/index.js';
const router = express.Router();



router.post('/save/status/:jobId',saveStatusTODB)



export default router;
