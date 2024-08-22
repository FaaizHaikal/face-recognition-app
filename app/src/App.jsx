import React, { useState, useRef } from 'react';
import AppContext from './context/AppContext';
import CameraFrame from './components/CameraFrame';
import SubmitFormButton from './components/SubmitFormButton';
import { Box } from '@mui/material';

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const cameraWidth = Number(import.meta.env.VITE_CAMERA_WIDTH);
  const cameraHeight = Number(import.meta.env.VITE_CAMERA_HEIGHT);
  const faceWidth = Number(import.meta.env.VITE_FACE_WIDTH);
  const faceHeight = Number(import.meta.env.VITE_FACE_HEIGHT);
  
  const photoRef = useRef(null);
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  return (
    <AppContext.Provider value={{ 
      photoRef,
      isPhotoTaken, 
      setIsPhotoTaken,
      photoUrl,
      setPhotoUrl,
      apiKey,
      cameraWidth,
      cameraHeight,
      faceWidth,
      faceHeight
    }}>
      <Box>        
        <CameraFrame />
        <SubmitFormButton />
      </Box>
      
    </AppContext.Provider>
  );
}

export default App;
