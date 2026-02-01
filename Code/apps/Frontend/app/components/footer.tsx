'use client'

import React from 'react';
import { 
  Swords, 
  Github, 
  Linkedin
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bg-[#050505] border-t border-white/10 relative overflow-hidden pt-20 pb-10">
      
     
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1800px] mx-auto px-6 relative z-10">
        
      
        <div className="flex flex-col md:flex-row items-center justify-between bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden mb-20 group">
        
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tighter">
              Ready to <span className="text-orange-500">Ascend?</span>
            </h2>
            <p className="text-gray-400 max-w-lg text-lg">
              The arena is open. Competing for glory. Logic is your weapon.
            </p>
          </div>

          <div className="relative z-10 flex gap-4">
             <button 
               onClick={() => router.push('/home')} 
               className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-all transform hover:scale-105"
             >
               Join for Free
             </button>
             <button 
               onClick={() => router.push('/leaderboard')} 
               className="px-8 py-4 bg-[#1a1a1a] text-white border border-white/10 font-bold uppercase tracking-wider rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all"
             >
               View Ranks
             </button>
          </div>
        </div>

        
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-8 mb-16 border-b border-white/5 pb-16">
           
         
           <div className="max-w-sm space-y-6">
              <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter">
                <div className="bg-orange-500 p-1.5 rounded-lg">
                  <Swords size={20} className="text-black" />
                </div>
                <span>CODE<span className="text-orange-500">GLADIATOR</span></span>
              </div>
              <p className="text-gray-500 leading-relaxed">
                The ultimate competitive coding platform designed to test your algorithms, data structures, and nerves under pressure.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com/Atulkhiyani0909" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-all">
                  <Github size={18} />
                </a>
                <a href="https://www.linkedin.com/in/atul-khiyani-880b382a5/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-all">
                  <Linkedin size={18} />
                </a>
              </div>
           </div>

           
           <div className="space-y-4">
              <h4 className="text-white font-bold uppercase tracking-wider text-sm">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                {['Battle Arena', 'Global Leaderboard', 'Tournaments', 'Practice Problems'].map((item) => (
                  <li key={item}>
                    <a href="/home" className="hover:text-orange-500 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
           </div>

        </div>

        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-mono">
           <p>© {new Date().getFullYear()} Code Gladiator.</p>
        </div>

      </div>
    </footer>
  );
};