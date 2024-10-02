import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContext from './context/AppContext';
import LoggerProvider from './components/LoggerProvider';
import FormPage from './pages/FormPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import DetectSubjectPage from './pages/DetectSubjectPage';
import TrackRouteChange from './components/TrackRouteChange';

function App() {
  const COMPRE_API_KEY = import.meta.env.VITE_COMPRE_API_KEY;
  const COMPRE_HOST = import.meta.env.VITE_COMPRE_HOST;
  const COMPRE_PORT = import.meta.env.VITE_COMPRE_PORT;
  const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
  const SERVER_PORT = import.meta.env.VITE_SERVER_PORT;
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
        COMPRE_API_KEY,
        COMPRE_HOST,
        COMPRE_PORT,
        SERVER_HOST,
        SERVER_PORT,
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
        <TrackRouteChange />
        <LoggerProvider>
          <Routes>
            <Route path="/" element={<DetectSubjectPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </LoggerProvider>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
