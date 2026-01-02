"use client"

import React, { useState } from 'react';
import { 
  Swords, 
  Ghost, 
  Code2, 
  Trophy, 
  History, 
  Flame, 
  Map, 
  Zap,
  Terminal,
  Quote,
  ChevronRight
} from 'lucide-react';

// --- UI Primitives ---

const GridBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-[#050505]"></div>
    {/* The CSS Grid Lines */}
    <div className="absolute inset-0" 
         style={{ 
           backgroundImage: `linear-gradient(to right, #1a1a1a 1px, transparent 1px), 
                             linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)`,
           backgroundSize: '40px 40px' 
         }}>
    </div>
    {/* Vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]"></div>
  </div>
);

const BentoCard = ({ children, className = "", title, icon: Icon, action }:any) => (
  <div className={`bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/5 p-5 rounded-2xl flex flex-col relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300 ${className}`}>
    {title && (
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-2 text-gray-400 group-hover:text-orange-500 transition-colors">
          {Icon && <Icon size={16} />}
          <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        </div>
        {action}
      </div>
    )}
    <div className="relative z-10 flex-1">{children}</div>
    {/* Hover Glow */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
  </div>
);



const HistoryWidget = () => (
  <div className="space-y-3 mt-10">
    {[
      { res: 'WIN', time: '12m ago', opp: 'CyberNinja', score: '+25' },
      { res: 'LOSS', time: '2h ago', opp: 'AlgoMaster', score: '-18' },
      { res: 'WIN', time: '5h ago', opp: 'DevKiller', score: '+30' },
    ].map((match, i) => (
      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border-l-2 border-transparent hover:border-orange-500">
        <div className="flex flex-col">
          <span className={`text-xs font-bold ${match.res === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>{match.res}</span>
          <span className="text-[10px] text-gray-500">{match.time}</span>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-300">{match.opp}</div>
          <div className="text-xs text-gray-500">{match.score} LP</div>
        </div>
      </div>
    ))}
  </div>
);

const MotivationWidget = () => (
  <div className="h-full flex flex-col justify-center relative">
    <Quote className="absolute top-0 left-0 text-white/5 w-12 h-12" />
    <p className="text-lg font-medium text-gray-200 italic leading-relaxed relative z-10 pl-4">
      "Talk is cheap. Show me the code."
    </p>
    <div className="mt-4 flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-black">LT</div>
      <span className="text-xs text-gray-500 font-mono">- Linus Torvalds</span>
    </div>
  </div>
);

const JourneyWidget = () => (
  <div className="relative h-full flex items-center justify-between px-2">
    {/* Progress Line */}
    <div className="absolute top-1/2 left-0 w-full h-1 bg-[#1a1a1a] -z-10"></div>
    
    {[
      { lvl: 1, active: true },
      { lvl: 5, active: true },
      { lvl: 10, active: false },
    ].map((step, i) => (
      <div key={i} className="flex flex-col items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all
          ${step.active ? 'bg-orange-500 border-black text-white' : 'bg-[#111] border-[#222] text-gray-700'}`}>
          <span className="text-[10px] font-bold">{step.lvl}</span>
        </div>
        <span className="text-[10px] uppercase text-gray-500 tracking-wider">Lvl {step.lvl}</span>
      </div>
    ))}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-2 text-xs text-gray-500 font-mono">
      NEXT: WARLORD
    </div>
  </div>
);



const BattleDashboard = () => {
  

  return (
    <div className="min-h-screen font-sans text-gray-200 relative flex items-center justify-center p-4 lg:p-8">
      <GridBackground />

      
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-4 h-full md:h-[600px]">
        
        {/* COL 1: User Stats & History (Width: 3/12) */}
        <div className="md:col-span-3 flex flex-col gap-4 h-full">
          <BentoCard title="Recent Battles" icon={History} className="h-2/3">
            <HistoryWidget />
          </BentoCard>
          
          <BentoCard title="Daily Wisdom" icon={Flame} className="h-1/3 bg-gradient-to-br from-orange-900/10 to-[#0a0a0a]">
             <MotivationWidget />
          </BentoCard>
        </div>

        {/* COL 2: Main Battle Arena (Width: 6/12) */}
        <div className="md:col-span-6 flex flex-col gap-4 h-full">
          
          {/* Header Area */}
          <div className="flex flex-col items-center justify-center py-6">
             <h1 className="text-4xl font-black text-white tracking-tighter mb-1">
               CODE<span className="text-orange-500">GLADIATOR</span>
             </h1>
             <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">The Arena Awaits</p>
          </div>

          

          {/* Battle Buttons */}
          <div className="flex-1 grid grid-cols-2 gap-4 mt-2">
            <button className="group relative bg-[#111] border border-white/5 rounded-2xl p-6 text-left hover:border-orange-500 transition-all overflow-hidden flex flex-col justify-end">
              <div className="absolute top-4 right-4 p-3 bg-[#1a1a1a] rounded-xl text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                <Code2 size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">Create Battle</h3>
              <p className="text-xs text-gray-500">Host private room</p>
            </button>

            <button className="group relative bg-orange-600 rounded-2xl p-6 text-left hover:bg-orange-500 transition-all overflow-hidden flex flex-col justify-end shadow-lg shadow-orange-900/20">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="absolute top-4 right-4 p-3 bg-white/10 rounded-xl text-white">
                <Ghost size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 relative z-10 group-hover:translate-x-1 transition-transform">Anonymous</h3>
              <p className="text-xs text-orange-100 relative z-10">Instant 1v1 Queue</p>
            </button>
          </div>
          
          {/* Quick Stats/Travel/Journey */}
          <BentoCard title="Gladiator Journey" icon={Map} className="h-32">
             <JourneyWidget />
          </BentoCard>
        </div>

        {/* COL 3: Leaderboard/Details (Width: 3/12) */}
        <div className="md:col-span-3 flex flex-col gap-4 h-full">
          <BentoCard title="Global Status" icon={Trophy} className="h-full">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/20">
                <div className="text-xs text-orange-400 font-bold uppercase mb-1">Current Rank</div>
                <div className="text-3xl font-black text-white">#420</div>
                <div className="text-[10px] text-gray-400">Top 12% of Gladiators</div>
              </div>

              <div className="space-y-2 mt-6">
                <div className="text-xs text-gray-500 font-bold uppercase px-1">Top Players</div>
                {[1,2,3,4,5].map((i) => (
                   <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                     <span className={`text-xs font-mono font-bold w-4 ${i===1 ? 'text-yellow-500' : 'text-gray-600'}`}>0{i}</span>
                     <div className="w-6 h-6 rounded bg-[#222] border border-white/10"></div>
                     <span className="text-sm text-gray-300 group-hover:text-white">Player_{i}</span>
                   </div>
                ))}
              </div>
            </div>
          </BentoCard>
        </div>

      </div>
    </div>
  );
};

export default BattleDashboard;