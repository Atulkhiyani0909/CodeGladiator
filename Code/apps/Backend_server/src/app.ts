import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'




dotenv.config();

import authRoutes from './routes/auth.js';
import codeExecutionRoutes from './routes/codeExecution/index.js'
import webHookRoutes from './routes/webHook/index.js'
import SubmissionRoutes from './routes/submissions/index.js'
import ProblemsRoutes from './routes/problems/index.js'

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	limit: 4, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
})

const app = express();

app.use(cors({ origin: ["http://localhost:3001","http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());





app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/code-execution',limiter, codeExecutionRoutes);
app.use('/api/v1/webhook', webHookRoutes );
app.use('/api/v1/submission',SubmissionRoutes);
app.use('/api/v1/problem',ProblemsRoutes);


app.listen(8080, () => {
  console.log('Listening on port 8080');
});