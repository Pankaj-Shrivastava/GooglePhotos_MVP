import React from 'react';
import DeviceFrame from './components/DeviceFrame';
import SearchBar from './components/SearchBar';
import PhotoGrid from './components/PhotoGrid';
import OnboardingToast from './components/OnboardingToast';

function App() {
  return (
    <DeviceFrame>
      <SearchBar />
      <PhotoGrid />
      <OnboardingToast />
    </DeviceFrame>
  );
}

export default App;
