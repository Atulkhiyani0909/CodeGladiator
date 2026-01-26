'use client'

import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../../../store';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useBattleStore } from '../../../store/battleStore';


export default function LobbyPage() {
    const { id: roomId } = useParams();
    const { socket } = useSocket();
    const { userId } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState("Connecting...");

    const { setProblems } = useBattleStore();


    useEffect(() => {
        if (!socket || !userId) return;

        const sendJoinRequest = () => {


            console.log(" Sending Join Request...");
            socket.send(JSON.stringify({
                msg: "JOIN",
                roomID: roomId,
                userID: userId
            }));
        };


        if (socket.readyState === WebSocket.OPEN) {
            sendJoinRequest();
        } else {

            socket.addEventListener('open', sendJoinRequest);
        }

        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);

            switch (data.msg) {
                case "USER_NOTIFY_NEW_PLAYER":
                    setStatus(`Opponent Joined! Starting...`);
                    break;
                case "ROOM_FULL_WARNING":
                    alert("Room is full!");
                    router.push('/');
                    break;
                case "GAME_STARTED":
                    console.log("⚔️ Battle Starting!");
                    console.log(data , "Problems ");
                    
                    const problemList = data.data.problems;
                   
                    console.log(problemList , "This is the list of the problems ");
                    
                    setProblems(problemList);


                    const firstProblemId = problemList[0];
                     router.push(`/problems/${firstProblemId}?battleId=${roomId}`);
                    break;
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => {

            socket.removeEventListener('message', handleMessage);
            socket.removeEventListener('open', sendJoinRequest);
        };

    }, [socket, userId, roomId, router, setProblems]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

            <h1 className="text-4xl font-bold mb-4">Lobby: {roomId}</h1>
            <p className="text-zinc-500">{status}</p>
        </div>
    );
}