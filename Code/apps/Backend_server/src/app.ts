import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config();

import authRoutes from './routes/auth.js'; 

const app = express();

app.use(cors({ origin: "http://localhost:3001",credentials:true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/v1/auth', authRoutes);

app.listen(8080, () => {
  console.log('Listening on port 8080');
});