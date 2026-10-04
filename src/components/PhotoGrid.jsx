import PhotoCard from './PhotoCard';

export default function PhotoGrid({ photos = [], totalCount = 0, isSearching = false, searchQuery = '', onSuggestionClick, onPhotoFlip }) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center text-center px-4 mt-6">
        <svg className="w-10 h-10 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6M9 9h.01" />
        </svg>
        <h3 className="text-slate-300 font-medium text-sm mb-2">
          {searchQuery ? `No memories matched "${searchQuery}"` : "No memories matched your search"}
        </h3>
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

  if (isSearching) {
    const spotOnPhotos = photos.slice(0, 6);
    const neighborhoodPhotos = photos.slice(6);

    return (
      <div className="flex flex-col pb-6">
        <div className="flex items-center gap-2.5 mb-6 mt-2">
          <span className="text-[11px] font-semibold tracking-widest text-indigo-400 uppercase">
            Search Results
          </span>
          <div className="flex-1 h-[1px] bg-indigo-500/20"></div>
          <span className="text-[10px] text-indigo-400 font-medium">{photos.length} / {totalCount} photos</span>
        </div>
        
        {spotOnPhotos.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[11px] font-semibold tracking-widest text-emerald-400 uppercase">
                Spot On
              </span>
              <div className="flex-1 h-[1px] bg-emerald-900/30"></div>
              <span className="text-[10px] text-emerald-500/70 font-medium">{spotOnPhotos.length} {spotOnPhotos.length === 1 ? 'photo' : 'photos'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {spotOnPhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} onFlip={onPhotoFlip} />
              ))}
            </div>
          </div>
        )}

        {neighborhoodPhotos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[11px] font-semibold tracking-widest text-amber-400 uppercase">
                In the Neighborhood
              </span>
              <div className="flex-1 h-[1px] bg-amber-900/30"></div>
              <span className="text-[10px] text-amber-500/70 font-medium">{neighborhoodPhotos.length} {neighborhoodPhotos.length === 1 ? 'photo' : 'photos'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {neighborhoodPhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} onFlip={onPhotoFlip} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Group photos by city (default view when not searching)
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
        <div key={city} className="mb-6 mt-2">
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
