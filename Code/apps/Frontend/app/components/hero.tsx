'use client'
import { useRouter } from "next/navigation";
import {  Award, Play } from 'lucide-react';

export const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black/90 py-32 px-6">
      <div className="absolute inset-0 bg-[url('/dark-grid.png')] bg-repeat opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black/95 to-black/95"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-12">
        
        {/* Left Side: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tighter">
            Battle the Best. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">Code Like a Gladiator.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Enter the ultimate competitive coding arena. Solve timed challenges, climb the leaderboard, and prove your logic in real-time battles.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-lg transition transform hover:scale-105 shadow-lg shadow-orange-500/30 text-lg uppercase tracking-wider w-full sm:w-auto" 
              onClick={() => router.push('/home')}
            >
              <Play className="w-5 h-5" />
              <span>Enter the Arena</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 border-2 border-orange-500/50 hover:border-orange-500 hover:bg-orange-500/10 text-white font-bold py-4 px-8 rounded-lg transition text-lg uppercase tracking-wider w-full sm:w-auto">
              <Award className="w-5 h-5" />
              <span>View Leaderboard</span>
            </button>
          </div>
        </div>
        
        {/* Right Side: Code Graphic */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none">
          <div className="relative bg-[#1a1a1a] rounded-2xl p-1 shadow-2xl border border-orange-900/30 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
            <div className="bg-[#0a0a0a] rounded-xl p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-gray-500 text-sm font-mono">battle_arena.py</div>
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 h-full w-1 bg-orange-500/20"></div>
                <pre className="text-sm md:text-base text-gray-300 font-mono p-4 pl-6 bg-black/50 rounded-lg overflow-x-auto leading-relaxed">
                  <code className="block">
                    <span className="text-blue-400">class</span> <span className="text-yellow-400">Gladiator</span>:
                    {"\n  "}<span className="text-blue-400">def</span> <span className="text-green-400">fight</span>(<span className="text-purple-400">self</span>):
                    {"\n    "}# <span className="text-gray-500 italic">Preparing environment...</span>
                    {"\n    "}<span className="text-blue-400">if</span> <span className="text-purple-400">skill</span> &gt; <span className="text-orange-400">9000</span>:
                    {"\n      "}<span className="text-blue-400">return</span> <span className="text-green-400">"VICTORY"</span>
                    {"\n    "}<span className="text-blue-400">else</span>:
                    {"\n      "}<span className="text-red-400">train_harder()</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};