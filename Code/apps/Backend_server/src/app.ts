import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import { v1 as uuidv1 } from 'uuid'
import { clerkMiddleware, getAuth } from '@clerk/express'

dotenv.config();




import codeExecutionRoutes from './routes/codeExecution/index.js'
import webHookRoutes from './routes/webHook/index.js'
import SubmissionRoutes from './routes/submissions/index.js'
import ProblemsRoutes from './routes/problems/index.js'
import LanguageRoutes from './routes/languages/index.js'
import { getOrCreateUser } from './utils/userSync.js';
import { verifyToken } from '@clerk/clerk-sdk-node';




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








app.use('/api/v1/code-execution', limiter, codeExecutionRoutes);
app.use('/api/v1/webhook', webHookRoutes);
app.use('/api/v1/submission', SubmissionRoutes);
app.use('/api/v1/problem', ProblemsRoutes);
app.use('/api/v1/language', LanguageRoutes);


//WEBSOCKETS 

interface Users {
    id: Id
    socket?: WebSocket,
    history: Id[]
}

type Id = string

const users = new Map<Id, Users>();


const users_queue: Id[] = [];

enum Status {
    COMPLETED,
    ONGOING,
    DISCARDED,
    CREATED
}

enum Difficulty {
    EASY,
    MEDIUM,
    HARD,
    MIXED
}

enum BattleType {
    PUBLIC,
    PRIVATE
}

interface battleInfo {
    Totalproblems: number,
    winner?: string,
    problemsId: string[],
    status: Status,
    difficulty: Difficulty,
    BattleType: BattleType
}



interface battleDetails {
    Users: Users[],
    battleInfo: battleInfo
}
const room_map = new Map<Id, battleDetails>();


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

    shuffleArray(users_queue);
    for (let i = 0; i < users_queue.length; i++) {
        const potentialOpponent: any = users_queue[i];
        if (potentialOpponent === myUserID) continue;
        if (!haveMet(myUserID, potentialOpponent)) {
            users_queue.splice(i, 1);
            return potentialOpponent;
        }
    }
    return null;
}

const problems = [
    "1364fc28-307f-45d7-933b-a39fcc166546",
    "215766eb-7d19-4d07-977b-1f58c7b4de5d",
    "7188a325-0370-475d-a163-997b8f10c20d",
    "72f7622e-6fea-40f3-92f3-0648f25457ec",
    "933a8a7b-2902-48eb-ada9-723f52d3506a",
    "9ac2bbcc-d24b-4fee-a19e-d9d77b6a78f2",
    "9ac2bbcc-d24b-4fee-a19e-d9d77b6a78f2"
]

const getRandomProblems = (problems: string[], numOfProblems: number): string[] => {
    let ans = [];
    for (let i = 1; i <= numOfProblems; i++) {
        const val = Math.floor(Math.random() * problems.length);
        ans.push(problems[val]);
    }

    //@ts-ignore
    return ans;
}




wss.on('connection', async (ws, req: Request) => {
    console.log('User Connected');


    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const requesterId = url.searchParams.get('userId');

    if (!requesterId) {
        console.log(" No Id provided");
        ws.close();
        return;
    }




    const userId = requesterId;


    const userID: Id = userId;



    let user = users.get(userId);

    if (!user) {
        const UserData: Users = {
            id: userID,
            socket: ws,
            history: []
        }

        users.set(userID, UserData);
    } else {

        console.log('User already exists Updating the Socket only for that User');

        user.socket = ws;


    }



    ws.on("message", (msg: any, isBinary: any) => {
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

        console.log(data.msg, data.data);




        switch (data.msg) {
            case "CREATE":
                const roomID = uuidv1();
                console.log(roomID);

                room_map.set(roomID, {
                    Users: [],
                    battleInfo: {
                        Totalproblems: data.Totalproblems,
                        problemsId: [],
                        status: Status.CREATED,
                        BattleType: data.BattleType,
                        difficulty: data.difficulty
                    }
                });

                console.log(room_map);
                const userDetails = users.get(data.userID);

                userDetails?.socket?.send(JSON.stringify({ msg: "ROOM_ID", data: roomID }));

                userDetails?.socket?.send(JSON.stringify({ msg: "ROOM_CREATED", data: `Room Created Succesfully ${roomID}` }))
                break;

            case "JOIN":
                console.log(`[JOIN] Request for Room: ${data.roomID}`);
                const room = data.roomID;
                const room_details = room_map.get(room);
                const user = users.get(data.userID);

                if (!user) {
                    ws.send(JSON.stringify({ msg: "ERROR", data: 'User not found' }));
                    return;
                }

                if (!room_details) {
                    ws.send(JSON.stringify({ msg: "NOTIFY_ROOM_NOT_FOUND", data: "Room doesn't exist" }));
                    return;
                }

                const isAlreadyInRoom = room_details.Users.find((u) => u.id === user.id);

                if (isAlreadyInRoom) {
                    console.log(`🔄 User ${user.id} re-connected to active room.`);

                    isAlreadyInRoom.socket = user.socket!;

                    if (room_details.battleInfo.problemsId && room_details.Users.length === 2) {
                        user.socket?.send(JSON.stringify({
                            msg: "GAME_STARTED",
                            data: {
                                problems: room_details.battleInfo.problemsId,
                                isRejoin: true
                            }
                        }));
                    } else {
                        user.socket?.send(JSON.stringify({
                            msg: "READY",
                            data: "Welcome back! Waiting for opponent..."
                        }));
                    }
                    return;
                }

                if (room_details.Users.length >= 2) {
                    user.socket?.send(JSON.stringify({ msg: 'ROOM_FULL_WARNING', data: 'Room is Full' }));
                    return;
                }

                room_details.Users.push(user);
                console.log(`User ${user.id} added. Total: ${room_details.Users.length}`);

                room_details.Users.forEach((u) => {
                    if (u.id !== user.id) {
                        u.socket?.send(JSON.stringify({
                            msg: "USER_NOTIFY_NEW_PLAYER",
                            data: `User ${user.id} joined`
                        }));
                    }
                });

                if (room_details.Users.length === 2) {
                    console.log("Room Full -> Starting Game");

                    const problemCount = room_details.battleInfo?.Totalproblems || 3;
                    const problemsToSend = getRandomProblems(problems, problemCount);


                    room_details.battleInfo.problemsId = problemsToSend;



                    room_details.Users.forEach((u) => {
                        u.socket?.send(JSON.stringify({
                            msg: "GAME_STARTED",
                            data: {
                                problems: problemsToSend
                            }
                        }));
                    });
                }
                break;

            default:
                console.log(`Wrong Input`);
        }
    });

    ws.on('close', () => {
        console.log('User Disconnected ');
    })


    ws.send('Welcome to Gladiator');
})