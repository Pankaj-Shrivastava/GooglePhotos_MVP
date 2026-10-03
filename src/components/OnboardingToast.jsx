import { useEffect, useState } from 'react';

export default function OnboardingToast({ onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);

  // Animate in after a slight delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[320px] glass-toast p-3.5 rounded-2xl z-50 flex items-start gap-3 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
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
  );
}
