'use client'

import React from 'react';
import {
  Sword,
  Terminal,
  ShieldCheck,
  Database
} from 'lucide-react';
import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const Page = () => {

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white font-sans selection:bg-orange-500/30">

    
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative overflow-hidden">

       <br /><br />
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

         
          <div className="flex justify-center">
            <SignUp 
              appearance={{
                baseTheme: dark,
                variables: {
                  colorPrimary: '#ea580c', 
                  colorBackground: '#18181b', 
                  colorText: 'white',
                  colorInputBackground: '#27272a', 
                  colorInputText: 'white',
                  borderRadius: '0.5rem',
                },
                elements: {
                  card: "shadow-none bg-transparent w-full",
                  headerTitle: "hidden", 
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white text-black hover:bg-zinc-200 border-none",
                  socialButtonsBlockButtonText: "font-medium",
                  formButtonPrimary: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 border-none shadow-lg shadow-orange-900/20",
                  footerActionLink: "text-orange-500 hover:text-orange-400"
                }
              }}
              signInUrl="/login"
            />
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
            <p className="text-zinc-500 text-xs mt-1">Encrypted credentials with Clerk.</p>
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