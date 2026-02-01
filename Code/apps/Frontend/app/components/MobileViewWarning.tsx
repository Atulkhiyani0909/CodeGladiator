import { MonitorX, Terminal } from 'lucide-react';

export const MobileWarningOverlay = () => (
  <div className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col items-center justify-center p-8 text-center lg:hidden overflow-hidden">
    
   
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

  
    <div className="relative mb-8 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative w-24 h-24 bg-[#0a0a0a] border border-white/5 rounded-full flex items-center justify-center shadow-2xl">
            <MonitorX className="w-10 h-10 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
        </div>
    </div>

   
    <h2 className="relative text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 mb-4 tracking-tighter uppercase">
      Desktop Environment<br/>Required
    </h2>

   
    <p className="relative text-zinc-500 max-w-xs mx-auto leading-relaxed text-sm font-medium">
      To ensure the optimal Coding experience and interface integrity, please access this platform via a larger display.
    </p>

   
    <div className="relative mt-10 flex items-center gap-2 px-5 py-2.5 bg-zinc-900/50 border border-white/5 rounded-lg text-orange-500/80 text-xs font-mono">
      <Terminal size={12} />
      <span>ERR_DISPLAY_WIDTH_LOW</span>
      <span className="w-1.5 h-4 bg-orange-500/50 animate-pulse ml-1" />
    </div>

  </div>
);