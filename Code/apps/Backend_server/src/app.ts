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
import SubmissionRoutes from './routes/submissions/index.js'
import ProblemsRoutes from './routes/problems/index.js'
import LanguageRoutes from './routes/languages/index.js'
import { getOrCreateUser } from './utils/userSync.js';
import { verifyToken } from '@clerk/clerk-sdk-node';
import prisma from './DB/db.js';
import client from './Redis/index.js';
import  BattleHistoryRoutes from './routes/battleHistory/index.js'



const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 4,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

const app = express();

app.use(cors({ origin: ["http://localhost:3001", "http://localhost:3000", "https://enemies-partners-defined-clock.trycloudflare.com"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(clerkMiddleware());


const server = app.listen(8080, () => {
    console.log('Listening on port 8080');
});








app.use('/api/v1/code-execution',limiter, codeExecutionRoutes);
app.use('/api/v1/submission', SubmissionRoutes);
app.use('/api/v1/problem', ProblemsRoutes);
app.use('/api/v1/language', LanguageRoutes);
app.use('/api/v1/battle',BattleHistoryRoutes);




enum ProblemStatus {
    PENDING = "PENDING",
    FAILED = "FAILED",
    SOLVED = "SOLVED"
}

interface SubmissionResult {
    status: string;
    [key: string]: any;
}

interface Users {
    id: Id
    socket?: WebSocket,
    history: Id[],
    progress: { [key: string]: ProblemStatus },
    inBattle?: boolean;
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
    BattleType: BattleType,
    durationMins: number,
    startTime?: number
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
        const opponentId = users_queue[i];
        const opponent = users.get(opponentId!);

        if (!opponent) continue;
        if (opponentId === myUserID) continue;
        if (opponent.inBattle) continue;
        if (haveMet(myUserID, opponentId!)) continue;

        users_queue.splice(i, 1);
        return opponentId!;
    }
    return null;
}



const problemsAll = await prisma.problem.findMany({
    select: {
        id: true 
    }
});


const allProblemIds = problemsAll.map(problem => problem.id);

console.log(`Total Problems found: ${allProblemIds.length}`);


const getRandomProblems = (allIds: string[], count: number): string[] => {
  
    if (count >= allIds.length) {
        return allIds;
    }

    const selectedIds = new Set<string>();

   
    while (selectedIds.size < count) {
        const randomIndex = Math.floor(Math.random() * allIds.length);
        selectedIds.add(allIds[randomIndex]!); 
    }

    return Array.from(selectedIds);
}





const subscriber = client.duplicate();
await subscriber.connect();

const getProblemStatus = async (code: string, userId: string, languageId: string, problemId: string): Promise<SubmissionResult | null> => {


    const result = await prisma.submission.create({
        data: { code, languageId, problemId, userId }
    });

    const codeToSend = await prisma.submission.findUnique({
        where: { id: result.id },
        include: { language: true, problem: true }
    });


    await client.lPush('Execution', JSON.stringify(codeToSend));

    const channelName = `submission_result:${result.id}`;
    console.log(` Waiting for result on channel: ${channelName}`);


    const val = await new Promise<SubmissionResult | null>((resolve) => {


        const timeout = setTimeout(() => {
            console.log("Timeout waiting for execution result");
            subscriber.unsubscribe(channelName);
            resolve(null);
        }, 10000);

        subscriber.subscribe(channelName, (message) => {
            clearTimeout(timeout); // Stop the timer
            console.log(" Received execution result:", message);

            const executionResult = JSON.parse(message);

            subscriber.unsubscribe(channelName);
            resolve(executionResult);
        });
    });

    await prisma.submission.update({
        where: {
            id: result.id
        },
        data: {
            status: val?.status == 'ACCEPTED' ? 'ACCEPTED' : "WRONG",
            output: val?.output
        }
    })

    if (!val) {
        return null;
    }
    val.submissionID = result.id;

    console.log(" Final Value:", val);
    return val;
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
            history: [],
            progress: {}
        }

        users.set(userID, UserData);
    } else {

        console.log('User already exists Updating the Socket only for that User');

        user.socket = ws;


    }



    ws.on("message", async (msg: any, isBinary: any) => {
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

                let time ;
                switch(data.difficulty){
                    case "HARD":
                        time=10
                        break;
                    
                    case "MEDIUM":
                        time=15   
                        break;
                     
                        
                    case "EASY":
                        time=20
                        break;
                        
                    default:
                        time=12
                        break;    
                }

                room_map.set(roomID, {
                    Users: [],
                    battleInfo: {
                        Totalproblems: data.Totalproblems,
                        problemsId: [],
                        status: Status.CREATED,
                        BattleType: data.BattleType,
                        difficulty: data.difficulty,
                        durationMins: time
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
                    console.log(` User ${user.id} re-connected to active room.`);

                    isAlreadyInRoom.socket = user.socket!;

                    if (room_details.battleInfo.problemsId && room_details.Users.length === 2) {
                        user.socket?.send(JSON.stringify({
                            msg: "GAME_STARTED",
                            data: {
                                problems: room_details.battleInfo.problemsId,
                                isRejoin: true,
                                duration: room_details.battleInfo.durationMins,
                                startTime: room_details.battleInfo.startTime
                            }
                        }));
                    } else {
                        user.socket?.send(JSON.stringify({
                            msg: "READY",
                            data: "Welcome back! Waiting for opponent..."
                        }));
                    }

                    room_details?.Users.forEach((e) => {
                        e.socket?.send(JSON.stringify({
                            msg: "ROOM_CURRENT_STATUS",
                            data: room_details.Users,
                            startTime: room_details.battleInfo.startTime,
                            duration: room_details.battleInfo.durationMins
                        }));
                    })
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
                    const problemsToSend = getRandomProblems(allProblemIds, problemCount);


                    room_details.battleInfo.problemsId = problemsToSend;

                    room_details.battleInfo.startTime = Date.now();

                    room_details.Users.forEach((u) => {
                        u.socket?.send(JSON.stringify({
                            msg: "GAME_STARTED",
                            data: {
                                problems: problemsToSend,
                                startTime: Date.now(),
                                duration: room_details.battleInfo.durationMins
                            }
                        }));
                    });

                    room_details?.Users.forEach((e) => {
                        e.socket?.send(JSON.stringify({
                            msg: "ROOM_CURRENT_STATUS",
                            data: room_details.Users,
                            startTime: room_details.battleInfo.startTime,
                            duration: room_details.battleInfo.durationMins
                        }));
                    })

                }
                break;

            case "SUBMIT_CODE":
                const room_ = room_map.get(data.data.roomID);
                const { code, userId, languageId, problemId } = data.data;

                if (!room_) {
                    console.log("Room not found for submission");
                    return;
                }

                console.log(`Processing submission for User ${userId} on Problem ${problemId}`);


                const submissionResult = await getProblemStatus(code, userId, languageId, problemId);
                console.log(submissionResult, 'this is the submission resutl ');

                if (!submissionResult) {
                    console.log("Submission failed or timed out");
                    return;
                }


                const isSuccess = submissionResult.status === "ACCEPTED";




                const currentUser = room_.Users.find((u) => u.id === userId);
                if (currentUser) {
                    currentUser.progress[problemId] = isSuccess ? ProblemStatus.SOLVED : ProblemStatus.FAILED;
                }

                room_.Users.map((e) => {
                    if (e.id == userId) {
                        e.socket?.send(JSON.stringify({ msg: "SUBMISSION_ID", submissionID: submissionResult.submissionID }))
                    }
                })




                room_.Users.forEach((e) => {
                    e.socket?.send(JSON.stringify({
                        msg: "ROOM_CURRENT_STATUS",
                        data: room_.Users,
                        startTime: room_.battleInfo.startTime,
                        duration: room_.battleInfo.durationMins
                    }));
                });


                const totalProblems = room_.battleInfo.problemsId.length;
                const solvedCount = Object.values(currentUser?.progress || {}).filter(s => s === ProblemStatus.SOLVED).length;

                if (solvedCount === totalProblems) {
                    room_.Users.forEach((e) => {
                        e.socket?.send(JSON.stringify({
                            msg: "GAME_OVER_WINNER",
                            data: { winner: userId }
                        }));
                    });

                    await prisma.battle.create({
                        data: {
                            status: 'FINISHED',
                            startTime: new Date(room_.battleInfo.startTime || Date.now()),
                            endTime: new Date(),
                            playerAId: room_.Users[0]!.id,
                            playerBId: room_.Users[1]!.id,
                            winnerId: userId
                        }
                    });
                }
                break;

            case "ROOM_CURRENT_STATUS":
                let room_identity = room_map.get(data.roomID);

                room_identity?.Users.forEach((e) => {
                    e.socket?.send(JSON.stringify({
                        msg: "ROOM_CURRENT_STATUS",
                        data: room_identity.Users,
                        startTime: room_identity.battleInfo.startTime,
                        duration: room_identity.battleInfo.durationMins
                    }));
                })
                break;

            case 'GAME_OVER':

                const { roomId } = data;
                let winnerId = null;
                let maxSolved = -1;

                let _room_ = room_map.get(roomId);

                if (!_room_) return;

                _room_.Users.forEach((user: Users) => {

                    const solvedCount = Object.values(user.progress).filter(status => status === "SOLVED").length;

                    if (solvedCount > maxSolved) {
                        maxSolved = solvedCount;
                        winnerId = user.id;
                    }
                });

                if (!winnerId) {
                    return;
                }
                _room_.battleInfo.winner = winnerId;

                console.log(`🏆 Winner is User: ${winnerId} with ${maxSolved} problems solved.`);

                _room_.Users.map((e) => {
                    e.socket?.send(JSON.stringify({ msg: "GAME_OVER_WINNER", data: { winner: _room_.battleInfo.winner } }));
                })

                _room_.Users.map((e) => {
                    e.inBattle = false;
                })

                await prisma.battle.create({
                    data: {
                        status: 'FINISHED',
                        startTime: new Date(_room_.battleInfo.startTime || Date.now()),
                        endTime: new Date(),
                        playerAId: _room_.Users[0]!.id,
                        playerBId: _room_.Users[1]!.id,
                        winnerId: winnerId
                    }
                });

                break;
            case 'OPPONENT_LEAVING':
                const _room = room_map.get(data.roomId);
                const user_ = users.get(data.userId);

                if (!_room) {
                    return;
                }

                let winnerID = null;
                _room?.Users.map((e) => {
                    if (e.id != user_?.id) {
                        winnerID = e.id;
                    }
                })

                if (!winnerID) {
                    return;
                }

                _room.battleInfo.winner = winnerID;

                _room.Users.map((e) => {
                    e.socket?.send(JSON.stringify({ msg: "GAME_OVER_WINNER", data: { winner: _room.battleInfo.winner } }));
                })

                _room.Users.map((e) => {
                    e.inBattle = false;
                })

                await prisma.battle.create({
                    data: {
                        status: 'FINISHED',
                        startTime: new Date(_room.battleInfo.startTime || Date.now()),
                        endTime: new Date(),
                        playerAId: _room.Users[0]!.id,
                        playerBId: _room.Users[1]!.id,
                        winnerId: winnerID
                    }
                });

                break;

            case 'TIME_OVER':

                let room_status = room_map.get(data.data);

                let winnerId_ = null;
                let maxSolved_ = -1;



                if (!room_status) return;

                room_status.Users.forEach((user: Users) => {

                    const solvedCount = Object.values(user.progress).filter(status => status === "SOLVED").length;

                    if (solvedCount > maxSolved_) {
                        maxSolved_ = solvedCount;
                        winnerId_ = user.id;
                    }
                });

                if (!winnerId_) {
                    return;
                }
                room_status.battleInfo.winner = winnerId_;

                console.log(`🏆 Winner is User: ${winnerId_} with ${maxSolved_} problems solved.`);

                room_status.Users.map((e) => {
                    e.inBattle = false;
                })

                room_status.Users.map((e) => {
                    e.socket?.send(JSON.stringify({ msg: "GAME_OVER_WINNER", data: { winner: room_status.battleInfo.winner } }));
                })

                await prisma.battle.create({
                    data: {
                        status: 'FINISHED',
                        startTime: new Date(room_status.battleInfo.startTime || Date.now()),
                        endTime: new Date(),
                        playerAId: room_status?.Users[0]!.id,
                        playerBId: room_status?.Users[1]!.id,
                        winnerId: winnerId_
                    }
                });

                break;


            case 'ANONYMOUS_BATTLE': {
                const userid = data.data;
                if (!userid) return;

                const user_find = users.get(userid);
                if (!user_find) return;


                if (user_find.inBattle) {
                    return;
                }

                const partnerID = findMatch(userid);

                if (!partnerID) {

                    if (!users_queue.includes(userid)) {
                        users_queue.push(userid);
                    }

                    user_find.socket?.send(JSON.stringify({
                        msg: "WAITING_FOR_THE_OPPONENT"
                    }));
                    return;
                }

                const partnerUser = users.get(partnerID);
                if (!partnerUser) return;


                user_find.inBattle = true;
                partnerUser.inBattle = true;


                const myIndex = users_queue.indexOf(userid);
                if (myIndex !== -1) users_queue.splice(myIndex, 1);

                const newRoom = uuidv1();

                user_find.history.push(partnerID);
                partnerUser.history.push(userid);

                const problems_ID = getRandomProblems(allProblemIds, 3);

                room_map.set(newRoom, {
                    Users: [user_find, partnerUser],
                    battleInfo: {
                        Totalproblems: 3,
                        problemsId: problems_ID,
                        status: Status.CREATED,
                        BattleType: BattleType.PUBLIC,
                        difficulty: Difficulty.MIXED,
                        durationMins: 15
                    }
                });

                const gameRoom = room_map.get(newRoom);
                if (!gameRoom) return;

                gameRoom.battleInfo.startTime = Date.now();

                [user_find, partnerUser].forEach(u => {
                    u.socket?.send(JSON.stringify({
                        msg: "ROOM_DETAILS",
                        firstProblem: gameRoom.battleInfo.problemsId[0],
                        roomId: newRoom
                    }));
                });

                break;
            }

            default:
                console.log(`Wrong Input`);
        }
    });

    ws.on('close', () => {
        console.log('User Disconnected ');
    })



})