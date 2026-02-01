"use client"

import React, { useState, useEffect } from 'react';
import {
  Swords,
  Users,
  Copy,
  Check,
  Zap,
  Shield,
  Skull,
  Shuffle,
  MonitorX,
  ChevronRight,
  Globe,
  Lock
} from 'lucide-react';
import { GridBackground } from '../components/GridBackground';
import { MobileWarningOverlay } from '../components/MobileViewWarning';
import { DifficultyCard } from '../components/DiffcultyCard';
import { useSocket } from '../store';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


const DIFFICULTIES = [
  { id: 'EASY', label: 'Easy', icon: Zap, color: 'text-green-500', desc: 'Warmup drills' },
  { id: 'MEDIUM', label: 'Medium', icon: Shield, color: 'text-yellow-500', desc: 'Standard interview' },
  { id: 'HARD', label: 'Hard', icon: Skull, color: 'text-red-500', desc: 'Grandmaster tier' },
  { id: 'MIXED', label: 'Mixed', icon: Shuffle, color: 'text-purple-500', desc: 'Random assortment' },
];

const QUESTION_COUNTS = [1, 3, 5, 7];


const CreateBattleRoom = () => {


  const [questionCount, setQuestionCount] = useState(3);
  const [difficulty, setDifficulty] = useState('medium');
  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [roomId, setRoomId] = useState('');

  const router = useRouter();

  const {  socket } = useSocket();
  const { userId } = useAuth();




  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.msg) {
        case "ROOM_ID":
          setRoomId(data.data);
          setIsCreated(true);
          setIsCreating(false);
          break;
        
        case "ROOM_CREATED":
          console.log(data.data);
          break;
        
      }
    };
  }, [socket]);

  const handleCreate = () => {
    setIsCreating(true);
    if (socket) {
      socket.send(JSON.stringify({ msg: "CREATE", userID: userId, Totalproblems: questionCount, BattleType: 'PRIVATE', difficulty: difficulty }));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/battle/lobby/${roomId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedirect = () => {
    router.push(`/battle/lobby/${roomId}`);
  }



  return (
    <div className=" min-h-screen font-sans text-gray-200 relative bg-[#050505] flex flex-col items-center">
      <GridBackground />
      <MobileWarningOverlay />
      <div className="hidden lg:flex flex-col w-full max-w-6xl px-8 py-12 relative z-10">
        <div className="mt-10 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 font-mono mb-4 uppercase tracking-widest">
            <Lock size={12} /> Private Arena
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
            SETUP <span className="text-orange-500">BATTLE</span>
          </h1>
          <p className="text-gray-500 max-w-xl">
            Configure your private room. Invite a friend. Prove who writes cleaner code under pressure.
          </p>
        </div>

        <div className='w-100 h-100'>
        </div>
        <div className="grid grid-cols-12 gap-8">


          <div className="col-span-7 space-y-8">


            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Swords size={14} /> Select Difficulty
              </label>
              <div className="grid grid-cols-2 gap-4">
                {DIFFICULTIES.map((diff) => (
                  <DifficultyCard
                    key={diff.id}
                    type={diff}
                    selected={difficulty}
                    onClick={setDifficulty}
                  />
                ))}
              </div>
            </div>


            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={14} /> Problem Set Size
              </label>
              <div className="grid grid-cols-4 gap-4">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`h-16 rounded-xl border font-mono text-lg font-bold transition-all
                    ${questionCount === count
                        ? 'bg-white text-black border-white shadow-lg shadow-white/10 scale-105'
                        : 'bg-[#0a0a0a] text-gray-500 border-white/5 hover:border-white/20 hover:text-white'
                      }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>


          <div className="col-span-5">
            <div className="sticky top-8 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col h-full min-h-[400px]">

              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white">Battle Context</h3>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>


              <div className="space-y-6 flex-1">
                <div className="flex justify-between items-center group">
                  <span className="text-sm text-gray-500">Battle Type</span>
                  <span className="text-sm font-mono text-white flex items-center gap-2 bg-[#111] px-3 py-1 rounded-lg border border-white/5">
                    <Lock size={12} className="text-orange-500" /> Private
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Difficulty</span>
                  <span className="text-sm font-mono text-white uppercase">{difficulty}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Problems</span>
                  <span className="text-sm font-mono text-white">{questionCount}</span>
                </div>
              </div>


              <div className="mt-8 pt-6 border-t border-white/5">
                {!isCreated ? (
                  <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="w-full group relative py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg uppercase tracking-wider rounded-xl overflow-hidden transition-all shadow-[0_0_30px_rgba(234,88,12,0.2)] hover:shadow-[0_0_50px_rgba(234,88,12,0.4)]"
                  >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isCreating ? 'Deploying Arena...' : (
                        <>Create Room <ChevronRight size={20} /></>
                      )}
                    </span>
                  </button>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 bg-[#111] border border-orange-500/30 rounded-xl relative group">
                      <label className="text-[10px] text-orange-500 font-bold uppercase tracking-wider mb-1 block">
                        Invite Link Generated
                      </label>
                      <div className="flex items-center gap-3">
                        <Globe size={16} className="text-gray-500" />
                        <input
                          readOnly
                          value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/battle/lobby/${roomId}`}
                          className="bg-transparent text-sm text-white font-mono w-full focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="absolute right-2 top-2 bottom-2 px-4 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded-lg flex items-center justify-center transition-colors"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-white" />}
                      </button>
                    </div>

                    <button className="w-full py-3 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-gray-300 hover:text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all" onClick={handleRedirect}>
                      Enter Lobby
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateBattleRoom;