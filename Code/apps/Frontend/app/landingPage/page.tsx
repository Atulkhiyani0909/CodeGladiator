'use client'

import React from 'react';
import { Code, Cpu, Terminal, User, Award, Play, ChevronRight, Zap, Shield, Globe } from 'lucide-react';



import { Hero } from '../components/hero';



const BackgroundGrid = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505/80]"></div>
  </div>
);

const SectionHeader = ({ title, subtitle, centered = true }: { title: React.ReactNode, subtitle?: string, centered?: boolean }) => (
  <div className={`mb-16 relative z-10 ${centered ? 'text-center' : 'text-left'}`}>
    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-6 uppercase">
      {title}
    </h2>
    {subtitle && (
      <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
        {subtitle}
      </p>
    )}
  </div>
);



const WhatIs = () => (
  <section className="py-32 px-6 relative z-10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-mono mb-6">
          <Terminal size={12} />
          <span>SYSTEM_INIT: BATTLE_MODE</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter mb-8">
          WHERE CODE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            MEETS GLORY
          </span>
        </h2>
        <p className="text-zinc-400 text-lg leading-relaxed mb-8 border-l-2 border-orange-500/30 pl-6">
          Code Gladiator is not just a platform; it's an arena. A premier battleground for competitive programming where developers face off in skill-based, timed coding challenges. 
          <br /><br />
          Prove your prowess, climb the ranks, and earn your place among the digital elite.
        </p>
      </div>
      
 
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur opacity-20"></div>
        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-10 font-mono text-sm text-zinc-300 shadow-2xl">
          <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <p className="text-green-500 mb-2">$ init_battle --ranked</p>
          <p className="mb-2">Searching for opponents...</p>
          <p className="mb-2 text-yellow-500">[!] Opponent Found: ShadowCoder_99</p>
          <p className="mb-2">Loading Problem: "Binary Tree Inversion"...</p>
          <div className="w-full bg-zinc-800 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  const steps = [
    { title: "Initialize", subtitle: "Sign Up & Login", description: "Create your gladiator profile to enter the arena.", icon: User },
    { title: "Select Mode", subtitle: "Choose Battle", description: "Select a tournament or live challenge that fits your skill.", icon: Play },
    { title: "Execute", subtitle: "Code Under Pressure", description: "Solve complex problems within the time limit.", icon: Code },
    { title: "Dominate", subtitle: "Get Ranked", description: "Your performance determines your gladiator rank.", icon: Award },
  ];

  return (
    <section className="py-24 px-6 relative z-10 border-y border-white/5 bg-[#050505]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title={<>The <span className="text-orange-500">Pipeline</span></>} 
          subtitle="From rookie to legend in four simple steps."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="group relative bg-[#0f0f0f] hover:bg-[#141414] p-8 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all duration-300">
              
              <div className="text-5xl font-black text-white/5 absolute top-4 right-4 group-hover:text-orange-500/10 transition-colors">
                0{index + 1}
              </div>

              <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-black transition-all duration-300">
                <step.icon className="w-6 h-6" />
              </div>

              <div className="text-xs font-mono text-orange-500 mb-2 uppercase tracking-widest">{step.title}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.subtitle}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CoreFeatures = () => {
  const features = [
    { title: "Real-time Battles", desc: "Live websocket connections for instant 1v1 feedback.", icon: Zap, size: "large" },
    { title: "Timed Challenges", desc: "Race against the clock and the compiler.", icon: Cpu, size: "small" },
    { title: "Polyglot Support", desc: "Python, C++, Java, JS - Bring your weapon of choice.", icon: Code, size: "small" },
    { title: "Global Ranking", desc: " Matchmaking system.", icon: Globe, size: "large" },
  ];

  return (
    <section className="py-32 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
           <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Arsenal <span className="text-zinc-600">&</span><br/>
              Features
            </h2>
           </div>
           <p className="text-zinc-500 max-w-sm text-right mt-6 md:mt-0 font-mono text-sm">
             // EVERYTHING YOU NEED TO<br/>
             // DOMINATE THE ARENA
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-orange-500/50 overflow-hidden transition-all duration-300 ${feature.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-orange-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Benefits = () => (
  <section className="py-24 px-6 relative z-10">
    <div className="max-w-7xl mx-auto bg-[#111] rounded-3xl p-8 md:p-16 border border-white/5 relative overflow-hidden">
    
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase">
            Why Enter <br/>The Arena?
          </h2>
          <div className="space-y-6">
            {[
              "Accelerate your problem-solving velocity.",
              "Battle-harden your interview skills.",
              "Compete  with elite Coders.",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 group">
                 <div className="mt-1 min-w-[20px]">
                   <Shield className="w-5 h-5 text-zinc-600 group-hover:text-orange-500 transition-colors" />
                 </div>
                 <p className="text-lg text-zinc-300 group-hover:text-white transition-colors">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/50 rounded-2xl p-8 border border-white/5 font-mono text-sm text-zinc-400">
           <div className="flex justify-between border-b border-white/10 pb-4 mb-4">
             <span>STATS.JS</span>
             <span className="text-green-500">ONLINE</span>
           </div>
           <div className="space-y-4">
             <div className="flex justify-between">
               <span>Growth_Rate:</span>
               <span className="text-white">+140%</span>
             </div>
             <div className="flex justify-between">
               <span>Skill_Acquisition:</span>
               <span className="text-white">LOGARITHMIC</span>
             </div>
             <div className="flex justify-between">
               <span>Network_Value:</span>
               <span className="text-white">HIGH</span>
             </div>
             <div className="mt-4 pt-4 border-t border-white/10 text-center text-orange-500 cursor-pointer hover:underline">
               {`> INITIALIZE_JOIN_SEQUENCE()`}
             </div>
           </div>
        </div>
      </div>
    </div>
  </section>
);

function App() {
  return (
    <div className="font-sans bg-[#050505] text-gray-100 overflow-x-hidden selection:bg-orange-500/30 min-h-screen relative">
      <BackgroundGrid />
      
     
      <div className="relative z-10">
        <Hero />
      </div>

      <WhatIs />
      <HowItWorks />
      <CoreFeatures />
      <Benefits />
      
    </div>
  );
}

export default App;