import { useState, useEffect, useRef } from 'react';
import TagOverlay from './TagOverlay';

export default function PhotoCard({ photo, onFlip }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const thumbnailRef = useRef(null);

  // Derive the physical folder name from the filename
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

  const handleThumbnailClick = () => {
    if (document.startViewTransition) {
      if (thumbnailRef.current) thumbnailRef.current.style.viewTransitionName = `card-${photo.id}`;
      
      const transition = document.startViewTransition(() => {
        setIsExpanded(true);
        if (onFlip) onFlip(photo.id);
      });
      // Wait for the expansion view-transition to finish before starting the 3D flip
      transition.finished.then(() => {
        setIsFlipped(true);
      });
    } else {
      // Fallback for older browsers
      setIsExpanded(true);
      setTimeout(() => setIsFlipped(true), 50);
      if (onFlip) onFlip(photo.id);
    }
  };

  const handleModalClose = (e) => {
    if (e) e.stopPropagation();
    // 1. Flip the card back to the front face
    setIsFlipped(false);
    
    // 2. Wait for the 3D flip animation (600ms) to complete
    setTimeout(() => {
      // 3. Smoothly animate it shrinking back into the grid
      if (document.startViewTransition) {
        if (thumbnailRef.current) thumbnailRef.current.style.viewTransitionName = `card-${photo.id}`;
        
        const transition = document.startViewTransition(() => {
          setIsExpanded(false);
        });
        
        transition.finished.then(() => {
          if (thumbnailRef.current) thumbnailRef.current.style.viewTransitionName = 'none';
        });
      } else {
        setIsExpanded(false);
      }
    }, 600); 
  };

  // Add escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        handleModalClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  return (
    <>
      {/* Thumbnail Card */}
      <div 
        ref={thumbnailRef}
        className={`group relative rounded-xl overflow-hidden bg-slate-900 shadow-md transition-all duration-300 cursor-pointer border border-white/10 aspect-[4/3] ${isExpanded ? 'opacity-0 pointer-events-none' : 'hover:scale-[1.02] hover:border-violet-400/40'}`}
        onClick={handleThumbnailClick}
        style={{ viewTransitionName: 'none' }}
      >
        <div className="relative w-full h-full">
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
      </div>

      {/* Pop-out Modal */}
      {isExpanded && (
        <div 
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${isFlipped ? 'bg-black/50 backdrop-blur-md' : 'bg-transparent'}`}
          onClick={handleModalClose}
        >
          {/* 3D Perspective Container acts as the FLIP destination */}
          <div 
            className="relative w-[70%] max-w-xs aspect-[4/5] perspective-1000 cursor-pointer"
            onClick={handleModalClose}
            style={{ viewTransitionName: `card-${photo.id}` }}
          >
            {/* Flipping Card */}
            <div className={`relative w-full h-full transition-transform duration-600 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* FRONT FACE (Enlarged Photo) */}
              <div className="absolute inset-0 backface-hidden w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src={imageSrc}
                  alt={photo.alt_text}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* BACK FACE (Tags & Story) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-violet-400/50 shadow-[0_12px_40px_-6px_rgba(139,92,246,0.4)]">
                <TagOverlay photo={photo} />
              </div>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
}
