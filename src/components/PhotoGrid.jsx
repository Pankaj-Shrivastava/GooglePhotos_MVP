import PhotoCard from './PhotoCard';

export default function PhotoGrid({ photos = [], onSuggestionClick, onPhotoFlip }) {
  if (photos.length === 0) {
    return (
      <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center text-center px-4 mt-12">
        <svg className="w-10 h-10 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6M9 9h.01" />
        </svg>
        <h3 className="text-slate-300 font-medium text-sm mb-2">No memories matched your search</h3>
        <p className="text-slate-500 text-xs mb-6 max-w-[240px]">Try describing what you remember — a color, a feeling, or a scene</p>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-600 font-medium mb-3 uppercase tracking-wider">Try something like:</span>
          <button 
            onClick={() => onSuggestionClick?.('golden sunset lake')}
            className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs transition-colors"
          >
            golden sunset lake
          </button>
        </div>
      </div>
    );
  }

  // Group photos by city
  const groupedPhotos = photos.reduce((acc, photo) => {
    const city = photo.city || 'Unknown';
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(photo);
    return acc;
  }, {});

  return (
    <div className="flex flex-col pb-6">
      {Object.entries(groupedPhotos).map(([city, cityPhotos]) => (
        <div key={city} className="mb-6">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-[11px] font-semibold tracking-widest text-[#64748b] uppercase">
              {city}
            </span>
            <div className="flex-1 h-[1px] bg-slate-800"></div>
            <span className="text-[10px] text-slate-500 font-medium">{cityPhotos.length} {cityPhotos.length === 1 ? 'photo' : 'photos'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {cityPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} onFlip={onPhotoFlip} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
