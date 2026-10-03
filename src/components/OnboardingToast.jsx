export default function OnboardingToast() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-lg z-50 flex items-start gap-3">
      <span className="text-xl">✨</span>
      <p className="text-sm text-gray-100 flex-1">
        Tap any photo to reveal the AI-generated story and tags behind it
      </p>
      <button className="text-gray-400 hover:text-white">&times;</button>
    </div>
  );
}
