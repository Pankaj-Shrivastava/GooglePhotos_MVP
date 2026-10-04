import { useState, useEffect, useMemo } from 'react';
import DeviceFrame from './components/DeviceFrame';
import SearchBar from './components/SearchBar';
import PhotoGrid from './components/PhotoGrid';
import OnboardingToast from './components/OnboardingToast';
import tagsData from './data/tags.json';
import { searchPhotos } from './utils/search';

function App() {
  const [allPhotos, setAllPhotos] = useState(tagsData?.photos || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query to avoid excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use the search engine to filter and rank photos
  const filteredPhotos = useMemo(() => {
    return searchPhotos(debouncedQuery, allPhotos);
  }, [debouncedQuery, allPhotos]);

  // Toast state
  const [toastDismissed, setToastDismissed] = useState(false);

  const dismissToast = () => {
    setToastDismissed(true);
  };

  return (
    <DeviceFrame>
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />
      
      <PhotoGrid 
        photos={filteredPhotos}
        totalCount={allPhotos.length}
        isSearching={debouncedQuery.trim().length > 0}
        searchQuery={debouncedQuery}
        onSuggestionClick={setSearchQuery}
        onPhotoFlip={dismissToast}
      />
      
      {!toastDismissed && (
        <OnboardingToast onDismiss={dismissToast} />
      )}
    </DeviceFrame>
  );
}

export default App;
