import React, { useState, useRef } from 'react';
import AppContext from './context/AppContext';
import CameraFrame from './components/CameraFrame';
import SubmitFormButton from './components/SubmitFormButton';
import LoggerProvider from './components/LoggerProvider';
import { Box, Grid } from '@mui/material';
import DataInput from './components/DataInput';

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const cameraWidth = Number(import.meta.env.VITE_CAMERA_WIDTH);
  const cameraHeight = Number(import.meta.env.VITE_CAMERA_HEIGHT);
  const faceWidth = Number(import.meta.env.VITE_FACE_WIDTH);
  const faceHeight = Number(import.meta.env.VITE_FACE_HEIGHT);
  const recognitionThreshold = Number(import.meta.env.VITE_RECOGNITION_THRESHOLD);

  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [formData, setFormData] = useState({
    Nama: '',
    NIK: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  return (
    <AppContext.Provider
      value={{
        apiKey,
        cameraWidth,
        cameraHeight,
        faceWidth,
        faceHeight,
        recognitionThreshold,
        cameraRef,
        capturedImage,
        setCapturedImage,
        isPhotoTaken,
        setIsPhotoTaken,
        formData,
        setFormData,
        isFormValid,
        setIsFormValid,
      }}
    >
      <Box
        style={{
          padding: 16,
          border: '1px solid #ccc',
          borderRadius: 8,
        }}
      >
        <LoggerProvider>
          <Grid container>
            <Grid item xs={12} md={6}>
              <DataInput />
            </Grid>
            <Grid item xs={12} md={6}>
              <CameraFrame />
            </Grid>
          </Grid>
          <SubmitFormButton />
        </LoggerProvider>
      </Box>
    </AppContext.Provider>
  );
}

export default App;
