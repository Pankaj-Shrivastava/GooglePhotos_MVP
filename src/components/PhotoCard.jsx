import TagOverlay from './TagOverlay';

export default function PhotoCard() {
  return (
    <div className="relative aspect-square w-full rounded-xl overflow-hidden group [perspective:1000px]">
      <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div className="w-full h-full bg-gray-800"></div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 h-full w-full bg-black/80 backdrop-blur-md px-4 py-3 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <TagOverlay />
        </div>
      </div>
    </div>
  );
}
