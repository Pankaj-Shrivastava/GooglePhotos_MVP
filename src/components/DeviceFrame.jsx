export default function DeviceFrame({ children }) {
  return (
    <div className="min-h-screen w-full font-sans select-none antialiased">
      
      {/* Desktop/Tablet Presentation Area (Background + Phone Frame) */}
      <div className="w-full min-h-screen hidden md:flex items-center justify-center p-6 sm:p-12 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 52%, #0f172a 100%)' }}>
        
        {/* Atmospheric background glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none"></div>

        {/* PHONE FRAME */}
        <div className="relative w-[375px] h-[812px] rounded-[48px] p-[10px] bg-[#090b10] phone-shadow shrink-0 border border-slate-700/60 ring-1 ring-white/10 z-10">
          <div className="absolute inset-0 rounded-[48px] border border-white/10 pointer-events-none"></div>
          {/* Side Buttons */}
          <div className="absolute -left-[12px] top-28 w-[3px] h-8 bg-slate-700 rounded-l-sm"></div>
          <div className="absolute -left-[12px] top-40 w-[3px] h-12 bg-slate-700 rounded-l-sm"></div>
          <div className="absolute -left-[12px] top-56 w-[3px] h-12 bg-slate-700 rounded-l-sm"></div>
          <div className="absolute -right-[12px] top-36 w-[3px] h-16 bg-slate-700 rounded-r-sm"></div>

          {/* Inner Phone Screen */}
          <div className="relative w-full h-full rounded-[38px] bg-[#0f172a] overflow-hidden flex flex-col justify-between border border-slate-800 shadow-inner">
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-3 h-[25px] w-[110px] bg-black rounded-full ring-1 ring-white/10 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111827] ring-1 ring-slate-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-950"></div>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#111827] ring-1 ring-slate-800"></div>
            </div>

            {/* Status Bar */}
            <div className="relative z-40 pt-3 pb-1 px-7 flex items-center justify-between text-[13px] font-semibold text-slate-200">
              <span className="tracking-tight">9:41</span>
              <div className="flex items-center gap-1.5 text-slate-200">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="16" width="3" height="6" rx="1"/><rect x="8" y="12" width="3" height="10" rx="1"/><rect x="14" y="8" width="3" height="14" rx="1"/><rect x="20" y="4" width="3" height="18" rx="1"/></svg>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98A16.88 16.88 0 0012 4zm0 4c3.42 0 6.54 1.34 8.87 3.53L12 19.5 3.13 11.53A12.83 12.83 0 0112 8z"/></svg>
                <div className="flex items-center ml-0.5">
                  <div className="w-5 h-2.5 border border-slate-300 rounded-[3px] p-[1px] flex items-center">
                    <div className="h-full w-[80%] bg-slate-200 rounded-[1px]"></div>
                  </div>
                  <div className="w-[1.5px] h-1 bg-slate-400 rounded-r-sm ml-[0.5px]"></div>
                </div>
              </div>
            </div>

            {/* Scrollable Phone Content View */}
            <div className="relative z-10 flex-1 overflow-y-auto hide-scrollbar px-4 pt-1 pb-16 flex flex-col">
              <div className="text-center pt-1 pb-3">
                <h1 className="text-sm font-light text-[#e2e8f0] tracking-wider uppercase">
                  Priya's Memories
                </h1>
              </div>
              {children}
            </div>
            
            {/* Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/40 rounded-full z-50 pointer-events-none"></div>
          </div>
        </div>
      </div>
      
      {/* Mobile Only: No bezel, just the content filling the screen */}
      <div className="md:hidden relative w-full min-h-screen bg-[#0f172a] flex flex-col pt-4 pb-16 px-4">
         <div className="text-center pt-1 pb-3 shrink-0">
          <h1 className="text-sm font-light text-[#e2e8f0] tracking-wider uppercase">
            Priya's Memories
          </h1>
        </div>
        {children}
      </div>

    </div>
  );
}
