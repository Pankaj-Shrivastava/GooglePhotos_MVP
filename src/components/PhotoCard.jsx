import { useState } from 'react';
import TagOverlay from './TagOverlay';

export default function PhotoCard({ photo, onFlip }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Derive the physical folder name from the filename (e.g. "travel_utility_012.jpg" -> "Travel_Utility")
  const getFolder = (filename) => {
    if (!filename) return '';
    const prefix = filename.replace(/_\d{3}\.jpg$/i, '').toLowerCase();
    const map = {
      'goa': 'Goa',
      'hampi': 'Hampi',
      'jaipur': 'Jaipur',
      'manali': 'Manali',
      'travel_utility': 'Travel_Utility',
      'udaipur': 'Udaipur'
    };
    return map[prefix] || prefix;
  };

  const imageSrc = `/photos/${getFolder(photo.filename)}/${photo.filename}`;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && onFlip) {
      onFlip(photo.id);
    }
  };

  return (
    <div 
      className="group relative rounded-xl overflow-hidden bg-slate-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-violet-400/40 cursor-pointer perspective-1000 border border-white/10 aspect-[4/3]"
      onClick={handleFlip}
    >
      <div className={`relative w-full h-full transition-transform duration-600 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* FRONT FACE (Photo) */}
        <div className="absolute inset-0 backface-hidden w-full h-full">
          <img 
            src={imageSrc}
            alt={photo.alt_text}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0 scale-105 blur-sm'}`}
          />
          {/* Subtle gradient overlay at bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2 pointer-events-none">
            <p className="text-[10px] text-white font-medium truncate">{photo.alt_text}</p>
          </div>
        </div>

        {/* BACK FACE (Tags & Story) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full border border-violet-400/50 shadow-[0_12px_28px_-6px_rgba(139,92,246,0.28)] rounded-xl overflow-hidden">
          <TagOverlay photo={photo} />
        </div>

      </div>
    </div>
  );
}
