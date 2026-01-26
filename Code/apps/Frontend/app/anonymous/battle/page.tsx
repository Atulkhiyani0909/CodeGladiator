'use client'

import React, { useEffect, useState } from 'react'
import { useSocket } from '../../store';
import { useAuth } from '@clerk/nextjs';
import { useBattleStore } from '../../store/battleStore';
import { useRouter } from 'next/navigation';
import { Loader2, Swords, User, ShieldAlert } from 'lucide-react';

function Page() {
    const [status, setStatus] = useState('CONNECTING');
    const { userId } = useAuth();
    const { socket } = useSocket();
    
    const router = useRouter();

    useEffect(() => {
        if (!socket || !userId) return;

       
        setStatus('WAITING');
        socket?.send(JSON.stringify({ msg: 'ANONYMOUS_BATTLE', data: userId }));

        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);

            switch (data.msg) {
                case "ROOM_DETAILS":
                    
                    router.push(`/problems/${data.firstProblem}?battleId=${data.roomId}`)
                    break;
            }
        };

        socket?.addEventListener('message', handleMessage);

        return () => {
            socket?.removeEventListener('message', handleMessage);
        }
    }, [socket, userId, router]);

    
    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
            
         
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black opacity-50" />
            <div className="absolute w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl animate-pulse" />

            <div className="z-10 flex flex-col items-center gap-8 max-w-md w-full px-6">
                
               
                <div className="relative">
                    {status === 'WAITING' && (
                        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20" />
                    )}
                    <div className="w-24 h-24 bg-zinc-900 border-2 border-orange-500/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                        {status === 'FOUND' ? (
                            <Swords size={40} className="text-orange-500 animate-bounce" />
                        ) : (
                            <Loader2 size={40} className="text-orange-500 animate-spin" />
                        )}
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                        {status === 'FOUND' ? 'Opponent Found!' : 'Searching for Battle'}
                    </h2>
                    <p className="text-zinc-500 font-medium">
                        {status === 'FOUND' 
                            ? 'Preparing the arena...' 
                            : 'Matching you with a worthy opponent...'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page