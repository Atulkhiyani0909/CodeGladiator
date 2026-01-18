'use client'

import { Swords } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const Navbar = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="bg-black/50 backdrop-blur-md py-4 px-6 fixed w-full z-50 border-b border-orange-900/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <div 
          className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter hover:cursor-pointer transition-opacity hover:opacity-80" 
          onClick={() => router.push('/')}
        >
          <div className="bg-orange-500 p-1.5 rounded-lg shadow-[0_0_10px_rgba(234,88,12,0.5)]">
            <Swords size={20} className="text-black" />
          </div>
          <span>CODE<span className="text-orange-500">GLADIATOR</span></span>
        </div>

       
        <div className="flex items-center gap-4">
          {!isLoaded ? (
            
            <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse"></div>
          ) : isSignedIn ? (
         <UserButton 
              appearance={{
                baseTheme: dark,
                elements: {
                  avatarBox: "w-9 h-9 border border-orange-500/50"
                }
              }}
            />
          ) : (
            <button 
              onClick={() => router.push('/login')}
              className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold border border-orange-500/30 rounded-full transition-all hover:border-orange-500 hover:shadow-[0_0_15px_rgba(234,88,12,0.2)]"
            >
              Login
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};