'use client'

import React, { useState } from 'react';
import { 
  Sword, 
  Mail, 
  Lock, 
  User, 
  Github, 
  ArrowRight, 
  Terminal, 
  ShieldCheck,
  Database
} from 'lucide-react';
import Link from 'next/link';
import {signUp} from '../services/service';

const Page = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignup(){
        console.log(username , email , password);
        await signUp(email,username,password);
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white font-sans selection:bg-orange-500/30">
      
 
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative overflow-hidden">
        
      
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="w-full max-w-md z-10 space-y-8">
          
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-500 mb-4 shadow-[0_0_15px_rgba(234,88,12,0.3)]">
              <Sword size={24} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Join the <span className="text-orange-500">Ranks</span>
            </h1>
            <p className="text-zinc-400">
              Initialize your warrior profile.
            </p>
          </div>

         
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
           
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Gladiator Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-orange-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Neo_Anderson"
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

           
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
              <label className="text-sm font-medium text-zinc-300 ml-1">Secret Key</label>
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
              
              <div className="flex gap-1 mt-2 px-1">
                <div className="h-1 flex-1 rounded-full bg-red-500/50"></div>
                <div className="h-1 flex-1 rounded-full bg-orange-500/50"></div>
                <div className="h-1 flex-1 rounded-full bg-zinc-800"></div>
                <div className="h-1 flex-1 rounded-full bg-zinc-800"></div>
              </div>
            </div>

            
            <button className="w-full mt-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] shadow-lg shadow-orange-900/20 group" onClick={handleSignup}>
              <span>Deploy Profile</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-500">Or join with</span>
              </div>
            </div>

          
            <button className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
              <Github size={20} />
              <span>Sign up with GitHub</span>
            </button>
          </form>

          
          <div className="text-center text-sm text-zinc-500">
            Already have a profile?{' '}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Access Arena
            </Link>
          </div>
        </div>
      </div>

    
      <div className="hidden lg:flex w-1/2 bg-zinc-900 relative flex-col justify-center items-center overflow-hidden border-l border-zinc-800">
        
        
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(234,88,12,0.1),transparent_50%)]"></div>
        
        
        <div className="relative z-10 w-[80%] max-w-lg bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl p-6">
          
       
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <Terminal size={12} />
              <span>init_warrior.sh</span>
            </div>
          </div>

         
          <div className="space-y-2 font-mono text-sm">
            <div className="flex gap-2 text-zinc-500">
              <span>&gt;</span>
              <span className="text-white">allocating_resources...</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-500">✔</span>
              <span className="text-zinc-400">Memory Block:</span>
              <span className="text-orange-400">OK</span>
            </div>
             <div className="flex gap-2">
              <span className="text-green-500">✔</span>
              <span className="text-zinc-400">Network Interface:</span>
              <span className="text-orange-400">CONNECTED</span>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="text-purple-400">const</span>
              <span className="text-yellow-200">player</span>
              <span className="text-zinc-300">=</span>
              <span className="text-purple-400">new</span>
              <span className="text-blue-300">Gladiator</span>({'{'}
            </div>
            <div className="pl-6 text-zinc-300">
              id: <span className="text-orange-400">"user_0x99"</span>,
            </div>
            <div className="pl-6 text-zinc-300">
              rank: <span className="text-orange-400">"ROOKIE"</span>,
            </div>
            <div className="pl-6 text-zinc-300">
              skills: [<span className="text-green-300">"Not Found"</span>]
            </div>
            <div className="text-zinc-300">{'}'});</div>
            
            <div className="flex gap-2 mt-4 animate-pulse">
              <span className="text-orange-500">root@arena:~$</span>
              <span className="w-2 h-4 bg-zinc-500 inline-block"></span>
            </div>
          </div>
        </div>

        
        <div className="mt-12 grid grid-cols-2 gap-6 w-[80%] max-w-lg">
          <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50 backdrop-blur-sm">
            <div className="text-orange-500 mb-2"><ShieldCheck size={20} /></div>
            <h3 className="text-white font-medium text-sm">Secure Identity</h3>
            <p className="text-zinc-500 text-xs mt-1">Encrypted credentials with JWT authentication.</p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50 backdrop-blur-sm">
            <div className="text-orange-500 mb-2"><Database size={20} /></div>
            <h3 className="text-white font-medium text-sm">Persistent Stats</h3>
            <p className="text-zinc-500 text-xs mt-1">Track every win, loss, and code submission.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;