export default function SearchBar({ value = '', onChange, onClear }) {
  const isActive = value.trim().length > 0;

  return (
    <div className={`relative ${isActive ? 'mb-3' : 'mb-4'} group z-40 shrink-0`}>
      {/* Glow effect behind the search bar */}
      <div className={`absolute -inset-0.5 rounded-full blur-sm transition duration-300 pointer-events-none ${
        isActive 
          ? 'bg-gradient-to-r from-violet-500/30 to-indigo-500/30 opacity-80' 
          : 'bg-gradient-to-r from-indigo-500/20 to-blue-500/20 opacity-60 group-hover:opacity-100'
      }`}></div>
      
      <div className={`${isActive ? 'glass-search-active' : 'glass-search'} relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full w-full transition-all duration-300`}>
        {/* Search Icon */}
        <svg className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#cbd5e1]' : 'text-[#94a3b8]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2.2" : "2"} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>

        {/* Input Field */}
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Search memories... try 'golden sunset'"
          className={`flex-1 bg-transparent border-none outline-none text-xs font-medium tracking-tight ${
            isActive ? 'text-[#f8fafc]' : 'text-[#f8fafc] placeholder-[#94a3b8]'
          }`}
        />

        {/* Right side elements (Clear button OR AI sparkle) */}
        {isActive ? (
          <button 
            onClick={onClear}
            className="shrink-0 w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-slate-200 text-[10px] leading-none"
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : (
          <div className="ml-auto shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
            <svg className="w-3 h-3 text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zm8-5a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM15.657 4.343a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0zM6.464 13.536a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 01-1.061-1.06l1.06-1.061a.75.75 0 011.061 0zM15.657 15.657a.75.75 0 01-1.06 0l-1.061-1.06a.75.75 0 111.06-1.061l1.061 1.06a.75.75 0 010 1.061zM6.464 6.464a.75.75 0 01-1.06 0L4.343 5.404a.75.75 0 011.06-1.061l1.061 1.06a.75.75 0 010 1.061z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
