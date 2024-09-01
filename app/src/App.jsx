import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContext from './context/AppContext';
import LoggerProvider from './components/LoggerProvider';
import FormPage from './pages/FormPage';
import DetectSubjectPage from './pages/DetectSubjectPage';

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const cameraWidth = Number(import.meta.env.VITE_CAMERA_WIDTH);
  const cameraHeight = Number(import.meta.env.VITE_CAMERA_HEIGHT);
  const faceWidth = Number(import.meta.env.VITE_FACE_WIDTH);
  const faceHeight = Number(import.meta.env.VITE_FACE_HEIGHT);
  const scoreThreshold = Number(import.meta.env.VITE_SCORE_THRESHOLD);

  const cameraRef = useRef(null);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    nomorAntrian: '',
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
        scoreThreshold,
        cameraRef,
        isFlashActive,
        setIsFlashActive,
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
      <Router>
        <LoggerProvider>
          <Routes>
            <Route path="/" element={<DetectSubjectPage />} />
            <Route path="/form" element={<FormPage />} />
          </Routes>
        </LoggerProvider>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
