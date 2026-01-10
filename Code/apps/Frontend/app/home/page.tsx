"use client"

import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Brain 
} from 'lucide-react';
import { GridBackground } from '../components/GridBackground';
import { HistoryWidget } from '../components/HistoryWidget';
import { BentoCard } from '../components/BentoCards';
import { MotivationWidget } from '../components/MotivationWidget';
import { JourneyWidget } from '../components/JourneryWidget';
import useAuth from '../store';
import { useRouter } from 'next/navigation';

const BattleDashboard = () => {
  const { user, isLoading, error, getUserData }: any = useAuth();
  const router = useRouter();

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [router, isLoading, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-orange-500 font-mono animate-pulse">
        Initializing Arena...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen font-sans text-gray-200 relative flex items-center justify-center p-4 lg:p-8">
      <GridBackground />

      <div className="mt-12 relative z-10 w-full max-w-9xl grid grid-cols-1 md:grid-cols-12 gap-4 h-full md:h-[650px]"> {/* Increased height slightly to accommodate new row */}

        <div className="md:col-span-3 flex flex-col gap-4 h-full">
          <BentoCard title="Recent Battles" icon={History} className="h-2/3">
            <HistoryWidget />
          </BentoCard>

          <BentoCard title="Daily Wisdom" icon={Flame} className="h-1/3 bg-gradient-to-br from-orange-900/10 to-[#0a0a0a]">
            <MotivationWidget />
          </BentoCard>
        </div>

     
        <div className="md:col-span-6 flex flex-col gap-4 h-full">

          
          <div className="flex flex-col items-center justify-center py-4">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-1">
              CODE<span className="text-orange-500">GLADIATOR</span>
            </h1>
            <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">The Arena Awaits</p>
          </div>

        
          <div className="grid grid-cols-2 gap-4 h-48"> 
            <button 
              className="group relative bg-[#111] border border-white/5 rounded-2xl p-6 text-left hover:border-orange-500 transition-all overflow-hidden flex flex-col justify-end" 
              onClick={() => router.push('/codeBattle')}
            >
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

          
          <button 
            className="group relative w-full bg-[#111] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-orange-500/50 hover:bg-[#161616] transition-all"
            onClick={() => router.push('/all-problems')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <Brain size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Training Ground</h3>
                <p className="text-xs text-gray-500">Solve DSA Problems & Master Algorithms</p>
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-2 rounded-full text-gray-500 group-hover:text-white transition-colors">
              <ChevronRight size={20} />
            </div>
          </button>

         
          <BentoCard title="Gladiator Journey" icon={Map} className="flex-1 min-h-[120px]">
            <JourneyWidget />
          </BentoCard>
        </div>

       
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
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                    <span className={`text-xs font-mono font-bold w-4 ${i === 1 ? 'text-yellow-500' : 'text-gray-600'}`}>0{i}</span>
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