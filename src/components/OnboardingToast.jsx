import { useEffect, useState } from 'react';

export default function OnboardingToast({ onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = 6000; // 6 seconds

  useEffect(() => {
    // 1. Animate in
    const timerIn = setTimeout(() => {
      setIsVisible(true);
      // 2. Start shrinking the bar shortly after it appears
      setTimeout(() => setProgress(0), 50);
    }, 500);
    
    // 3. Auto dismiss when timer finishes
    const timerOut = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 500);
    }, duration + 500);

    return () => {
      clearTimeout(timerIn);
      clearTimeout(timerOut);
    };
  }, [onDismiss]);

  return (
    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[320px] glass-toast pt-3.5 px-3.5 pb-3 rounded-2xl z-50 flex flex-col gap-2.5 transition-all duration-500 transform overflow-hidden ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      
      {/* Toast Content */}
      <div className="flex items-start gap-3 w-full">
        <span className="text-lg leading-none mt-0.5">✨</span>
        <p className="text-[11.5px] text-slate-200 font-medium leading-relaxed flex-1">
          Tap any photo to reveal the AI-generated story and tags behind it
        </p>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 500); // wait for animation
          }}
          className="text-slate-400 hover:text-white shrink-0 p-1 mt-[-2px] transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Diminishing Progress Bar */}
      <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-violet-400 rounded-full transition-all ease-linear"
          style={{ 
            width: `${progress}%`,
            transitionDuration: progress === 0 ? `${duration}ms` : '0ms'
          }}
        ></div>
      </div>

    </div>
  );
}
