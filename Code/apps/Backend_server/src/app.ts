import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import { v1 as uuidv1 } from 'uuid'
import { clerkMiddleware } from '@clerk/express'

dotenv.config();




import codeExecutionRoutes from './routes/codeExecution/index.js'
import webHookRoutes from './routes/webHook/index.js'
import SubmissionRoutes from './routes/submissions/index.js'
import ProblemsRoutes from './routes/problems/index.js'
import LanguageRoutes from './routes/languages/index.js'



const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 4,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

const app = express();

app.use(cors({ origin: ["http://localhost:3001", "http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(clerkMiddleware());


const server = app.listen(8080, () => {
    console.log('Listening on port 8080');
});


interface Users {
    id: Id
    socket?: WebSocket,
    history: Id[]
}

type Id = string

const users = new Map<Id, Users>();


const users_queue: Id[] = [];

const room_map = new Map<Id, Users[]>();


const wss = new WebSocketServer({ server: server });

function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function haveMet(user1: Id, user2: Id): boolean {
    const history1 = users.get(user1);
    return history1?.history.includes(user2) || false;
}


function findMatch(myUserID: Id): string | null {
    // 1. Shuffle queue first to prevent "sniping"
    shuffleArray(users_queue);

    // 2. Iterate through queue to find a valid match
    for (let i = 0; i < users_queue.length; i++) {
        const potentialOpponent: any = users_queue[i];

        // Don't match with self
        if (potentialOpponent === myUserID) continue;

        // CHECK HISTORY: Have they met?
        if (!haveMet(myUserID, potentialOpponent)) {
            // FOUND ONE! Remove them from the queue
            users_queue.splice(i, 1);
            return potentialOpponent;
        }
    }
    return null;
}





app.use('/api/v1/code-execution' ,limiter, codeExecutionRoutes);
app.use('/api/v1/webhook', webHookRoutes);
app.use('/api/v1/submission' , SubmissionRoutes);
app.use('/api/v1/problem', ProblemsRoutes);
app.use('/api/v1/language', LanguageRoutes);



wss.on('connection', (ws) => {
    console.log('User Connected');

    // assign id to that user 
    const userID: Id = uuidv1();
    const UserData: Users = {
        id: userID,
        socket: ws,
        history: []
    }

    users.set(userID, UserData);
    console.log(users);


    ws.on("message", (msg: any, isBinary) => {
        const utf8String = isBinary
            ? new TextDecoder().decode(msg)
            : msg.toString();

        console.log("Decoded Message:", utf8String);

        let data;
        try {
            data = JSON.parse(utf8String);
        } catch (err) {
            console.error("Invalid JSON message");
            return;
        }

        console.log(data.msg, data.ID);

        switch (data.msg) {
            case "create":
                const roomID = uuidv1();
                console.log(roomID);

                room_map.set(roomID, []);
                console.log(room_map);
                ws.send('Room Created .........');
                break;

            case "join":
                console.log(`Joining Room for the Battle`);
                const room = data.roomID;

                const room_details = room_map.get(room);
                const user = users.get(data.userID);

                if (!user) {
                    ws.send('No user with userID found');
                    return;
                }

                if (room_details) {
                    room_details.push(user);
                    console.log("New ROOM MAP ", room_map);

                } else {
                    console.log('Room not Found');
                    ws.send('No Room Found with this ID ');
                }

                break;

            default:
                console.log(`Wrong Input`);
        }
    });

    ws.on('close', () => {
        console.log('User Disconnected ', ws);
    })


    ws.send('Welcome to Gladiator');
})