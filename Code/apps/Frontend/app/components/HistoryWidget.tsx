'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { Loader2, AlertCircle, Swords } from 'lucide-react';

const getTimeAgo = (dateString: any) => {
    const now: any = new Date();
    const past: any = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.round(diffMs / 60000);
    const diffHrs = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
};

export const HistoryWidget = () => {
    const { userId, getToken } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!userId) return;

            try {
                const token = await getToken();

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/battle/history/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const formattedData = res.data.data.map((battle: any) => {
                    const isWinner = battle.winnerId === userId;

                    const opponent = battle.playerAId === userId
                        ? battle.playerB
                        : battle.playerA;

                    const opponentName = opponent?.name || "Unknown";

                    return {
                        res: isWinner ? 'WIN' : 'LOSS',
                        time: getTimeAgo(battle.startTime),
                        opp: opponentName
                    };
                });

                setHistory(formattedData);
            } catch (err) {
                console.error("Failed to fetch battle history:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId, getToken]);

    if (loading) {
        return (
            <div className="mt-10 flex justify-center py-4">
                <Loader2 className="animate-spin text-orange-500" size={24} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-10 flex items-center justify-center gap-2 text-red-500 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle size={14} /> Failed to load history
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="mt-10 flex flex-col items-center justify-center py-8 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                <Swords className="text-zinc-600 mb-2" size={24} />
                <span className="text-zinc-500 text-sm font-medium">No battles recorded yet.</span>
            </div>
        );
    }

   
    return <div className="mt-8 space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
    {history.map((match: any, i) => (
        <div 
            key={i} 
            className="group flex justify-between items-center p-3.5 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-orange-500/30 hover:bg-zinc-900/80 transition-all duration-300 mr-1" // Added mr-1 for spacing from scrollbar
        >
            {/* Result & Time */}
            <div className="flex flex-col gap-1">
                <span className={`text-xs font-black tracking-widest uppercase ${
                    match.res === 'WIN' 
                        ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]' 
                        : 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                }`}>
                    {match.res}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono font-medium group-hover:text-zinc-400 transition-colors">
                    {match.time}
                </span>
            </div>

            {/* Opponent Info */}
            <div className="text-right flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider">VS</span>
                <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors truncate max-w-[120px]">
                    {match.opp}
                </span>
            </div>
        </div>
    ))}
</div>
};