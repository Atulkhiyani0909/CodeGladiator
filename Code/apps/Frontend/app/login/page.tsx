'use client'

import React, { useState } from 'react';
import { 
  Sword, 
  Mail, 
  Lock, 
  Github, 
  ArrowRight, 
  Code2, 
  Terminal, 
  Cpu 
} from 'lucide-react';
import { logIn } from '../services/service';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    console.log(email , password);

    await logIn(email,password);
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white font-sans selection:bg-orange-500/30">
      
      
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative overflow-hidden">
        
   
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="w-full max-w-md z-10 space-y-8">
          
        
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-500 mb-4 animate-pulse">
              <Sword size={24} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Code<span className="text-orange-500">Gladiator</span>
            </h1>
            <p className="text-zinc-400">
              Enter the arena. Prove your logic.
            </p>
          </div>

          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-orange-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="warrior@codegladiator.com"
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

           
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <a href="#" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
                  Forgot secret?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-orange-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            
            <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] shadow-lg shadow-orange-900/20 group" onClick={handleLogin}>
              <span>Enter Arena</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

          
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-500">Or deploy with</span>
              </div>
            </div>

           
            <button className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
              <Github size={20} />
              <span>Continue with GitHub</span>
            </button>
          </form>

         
          <div className="text-center text-sm text-zinc-500">
            New to the battlefield?{' '}
            <a href="/signup" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Draft your profile
            </a>
          </div>
        </div>
      </div>

    
      <div className="hidden lg:flex w-1/2 bg-zinc-900 relative flex-col justify-center items-center overflow-hidden border-l border-zinc-800">
        
     
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.05),transparent_50%)]"></div>
        
        
        <div className="relative z-10 w-[80%] max-w-lg bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
          
         
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <Terminal size={12} />
              <span>battle_log.py</span>
            </div>
          </div>

          
          <div className="space-y-2 font-mono text-sm">
            <div className="flex gap-2">
              <span className="text-zinc-600">01</span>
              <span className="text-purple-400">class</span>
              <span className="text-yellow-200">Gladiator</span>:
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-600">02</span>
              <span className="pl-4 text-blue-400">def</span>
              <span className="text-yellow-200">fight</span>(self):
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-600">03</span>
              <span className="pl-8 text-zinc-400"># Preparing environment...</span>
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-600">04</span>
              <span className="pl-8 text-purple-400">if</span>
              <span className="text-white">skill</span> &gt; <span className="text-orange-500">9000</span>:
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-600">05</span>
              <span className="pl-12 text-green-400">return</span>
              <span className="text-orange-300">"VICTORY"</span>
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-600">06</span>
              <span className="pl-8 text-purple-400">else</span>:
            </div>
            <div className="flex gap-2 animate-pulse">
              <span className="text-zinc-600">07</span>
              <span className="pl-12 text-red-400">train_harder()</span>
              <span className="w-2 h-4 bg-orange-500 ml-1 inline-block"></span>
            </div>
          </div>
        </div>

       
        <div className="mt-12 grid grid-cols-2 gap-6 w-[80%] max-w-lg">
          <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50 backdrop-blur-sm">
            <div className="text-orange-500 mb-2"><Cpu size={20} /></div>
            <h3 className="text-white font-medium text-sm">Real-time Execution</h3>
            <p className="text-zinc-500 text-xs mt-1">Docker-isolated containers running in milliseconds.</p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50 backdrop-blur-sm">
            <div className="text-orange-500 mb-2"><Code2 size={20} /></div>
            <h3 className="text-white font-medium text-sm">Battle Mode</h3>
            <p className="text-zinc-500 text-xs mt-1">1v1 competitive coding with live rank updates.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;