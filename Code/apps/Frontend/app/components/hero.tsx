'use client'
import { useRouter } from "next/navigation";
import { Award, Play, Terminal, ChevronRight, Hash, ShieldCheck } from 'lucide-react';

export const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-[#050505] py-20 px-6 overflow-hidden">
      
    
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
      
     
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-16 lg:gap-24">
        
       
        <div className="flex-1 text-center lg:text-left pt-10 lg:pt-0">
          
          

          <h1 className="text-5xl md:text-5xl font-black text-white leading-[0.95] tracking-tighter mb-6">
            FORGE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 drop-shadow-sm">
              LEGACY IN CODE.
            </span>
          </h1>
          
          <p className="text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 font-light">
            Step into the arena where logic meets lethality. Compete in real-time algorithmic battles, climb the  ladder, and earn your title as a Code Gladiator.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button 
              className="group relative flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_50px_rgba(234,88,12,0.5)] hover:-translate-y-1" 
              onClick={() => router.push('/home')}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer overflow-hidden rounded-xl"></span>
              <Play className="w-5 h-5 fill-current" />
              <span>Enter The Arena</span>
            </button>
            
            <button onClick={()=>{
              router.push('/leaderboard');
            }} className="group flex items-center justify-center gap-3 bg-[#111] border border-white/10 hover:border-orange-500/50 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:bg-white/5">
              <Award className="w-5 h-5 text-zinc-500 group-hover:text-orange-500 transition-colors" />
              <span>Leaderboard</span>
              <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-zinc-500 font-mono text-xs">
            
            <div className="flex items-center gap-2">
              <Terminal size={14} /> 4 LANGUAGES
            </div>
           
          </div>
        </div>
        
    
        <div className="flex-1 w-full max-w-xl relative group perspective-1000">
          
         
          <div className="absolute -right-8 -top-8 z-20 bg-[#0a0a0a] border border-orange-500/30 p-4 rounded-xl shadow-2xl shadow-black/50 hidden md:block animate-bounce-slow">
             <div className="flex items-center gap-3">
               <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500">
                 <Award size={24} />
               </div>
               <div>
                 <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">New Rank</div>
                 <div className="text-white font-bold">WARLORD</div>
               </div>
             </div>
          </div>

     
          <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-1 shadow-2xl border border-white/10 group-hover:border-orange-500/30 transition-all duration-500 transform group-hover:rotate-y-2 group-hover:scale-[1.01]">
            
         
            <div className="bg-white/5 rounded-t-xl p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <div className="text-zinc-500 text-xs font-mono tracking-widest flex items-center gap-2">
                <Terminal size={12} />
                <span>ARENA_SERVER.PY</span>
              </div>
            </div>

        
            <div className="relative p-6 font-mono text-sm md:text-base leading-relaxed bg-black/50 rounded-b-xl overflow-hidden">
             
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>
              
              <code className="block text-zinc-300">
                <span className="text-purple-400">class</span> <span className="text-yellow-100">Gladiator</span><span className="text-zinc-500">():</span>
                {"\n"}
                {"\n  "}<span className="text-zinc-500">@battle_ready</span>
                {"\n  "}<span className="text-purple-400">def</span> <span className="text-blue-400">engage</span>(<span className="text-orange-300">self</span>, <span className="text-orange-300">opponent</span>):
                {"\n    "}<span className="text-zinc-500"># Analyze complexity</span>
                {"\n    "}<span className="text-purple-400">if</span> <span className="text-orange-300">self</span>.logic &gt; <span className="text-orange-300">opponent</span>.logic:
                {"\n      "}<span className="text-orange-300">self</span>.rank += <span className="text-green-400">25</span>
                {"\n      "}<span className="text-purple-400">return</span> <span className="text-green-400">"VICTORY"</span>
                {"\n    "}<span className="text-purple-400">else</span>:
                {"\n      "}<span className="text-purple-400">return</span> <span className="text-red-400">"DEFEATED"</span>
                {"\n"}
                {"\n"}<span className="text-zinc-500">&gt;&gt; Compiling strategy...</span><span className="animate-pulse text-orange-500">_</span>
              </code>
            </div>
          </div>
          
        
          <div className="absolute -bottom-10 left-10 right-10 h-20 bg-orange-500/20 blur-[60px] -z-10"></div>
        </div>

      </div>
    </section>
  );
};