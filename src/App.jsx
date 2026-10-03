import { useState, useEffect, useMemo } from 'react';
import DeviceFrame from './components/DeviceFrame';
import SearchBar from './components/SearchBar';
import PhotoGrid from './components/PhotoGrid';
import OnboardingToast from './components/OnboardingToast';
import tagsData from './data/tags.json';

function App() {
  const [allPhotos, setAllPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize photos on load
  useEffect(() => {
    if (tagsData && tagsData.photos) {
      setAllPhotos(tagsData.photos);
    }
  }, []);

  // Simple in-memory search for now (Full engine in M4)
  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return allPhotos;
    const query = searchQuery.toLowerCase();
    return allPhotos.filter(photo => {
      // Very basic substring search across a few fields for M3
      const text = [
        ...(photo.primary_subjects || []),
        ...(photo.descriptive_tags || []),
        ...(photo.sensory_cues || []),
        ...(photo.mood_and_tone || []),
        photo.alt_text,
        photo.city
      ].join(' ').toLowerCase();
      
      return text.includes(query);
    });
  }, [allPhotos, searchQuery]);

  // Toast state
  const [toastDismissed, setToastDismissed] = useState(() => {
    return localStorage.getItem('onboarding_toast_dismissed') === 'true';
  });

  const dismissToast = () => {
    setToastDismissed(true);
    localStorage.setItem('onboarding_toast_dismissed', 'true');
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
