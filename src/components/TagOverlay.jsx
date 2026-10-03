export default function TagOverlay() {
  return (
    <div className="flex flex-col h-full justify-between">
      <p className="text-sm italic text-gray-200 line-clamp-3">
        Placeholder micro-story goes here...
      </p>
      <div className="flex flex-wrap gap-1 mt-2">
        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">tag 1</span>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">tag 2</span>
      </div>
    </div>
  );
}
