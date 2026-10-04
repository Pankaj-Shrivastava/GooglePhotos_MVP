export default function TagOverlay({ photo }) {
  if (!photo) return null;

  // Render tag pill with appropriate color class
  const renderPills = (tags, colorClass) => {
    if (!tags || !Array.isArray(tags)) return null;
    return tags.map((tag, idx) => (
      <span key={`${tag}-${idx}`} className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full leading-none ${colorClass}`}>
        {tag}
      </span>
    ));
  };

  // Format date from filename or just use a placeholder for now as per mockups
  const dateStr = "Dec 16, 2023"; // In a real app, this might come from EXIF

  return (
    <div className="flex flex-col justify-between h-full w-full bg-[#0f172a]/95 backdrop-blur-md p-3 select-text overflow-y-auto hide-scrollbar">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-300 tracking-wider uppercase">{photo.city || 'Unknown'}</span>
          <span className="text-[10px] text-slate-500">•</span>
          <span className="text-[9px] text-slate-400">Memory</span>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-300 text-[9px] font-medium">
          <svg className="w-2.5 h-2.5 text-violet-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>AI Story</span>
        </div>
      </div>

      {/* Micro Story */}
      <div className="mb-3 shrink-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <svg className="w-3 h-3 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-[9.5px] font-semibold text-violet-300 tracking-widest uppercase">AI Scene Analysis</span>
        </div>
        <div className="border-l-[1.5px] border-violet-500/30 pl-2.5 ml-1">
          <p className="text-[11.5px] leading-snug italic text-slate-200 font-light">
            "{photo.micro_story}"
          </p>
        </div>
      </div>
      
      <div className="w-full h-[1px] bg-white/10 my-1.5 shrink-0"></div>
      
      {/* Tag Pills */}
      <div className="flex flex-wrap gap-1 pt-0.5 mt-auto">
        {renderPills(photo.primary_subjects, "bg-blue-500/20 text-blue-300 border border-blue-500/30")}
        {renderPills(photo.sensory_cues, "bg-amber-500/20 text-amber-300 border border-amber-500/30")}
        {renderPills(photo.mood_and_tone, "bg-purple-500/20 text-purple-300 border border-purple-500/30")}
        {renderPills(photo.dominant_colors, "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30")}
        {renderPills(photo.descriptive_tags, "bg-slate-700/50 text-slate-300 border border-slate-600/40")}
      </div>
    </div>
  );
}
