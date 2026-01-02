import { Router } from "express";
import Auth from "../controllers/auth.js"; 

const router = Router();
const auth = new Auth(); 


router.post('/signup', auth.signUp);
router.post('/login', auth.login);
router.get('/current-user',auth.currentUser);
export default router;