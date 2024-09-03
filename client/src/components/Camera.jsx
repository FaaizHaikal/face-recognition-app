import { useRef, useContext, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Box, Grid, Typography } from '@mui/material';
import CaptureImageButton from './CaptureImageButton';
import RetakeImageButton from './RetakeImageButton';
import Flash from './Flash';
import AppContext from '../context/AppContext';
import createOvalHole from '../utils/CreateOvalHole';

function Camera() {
  const {
    cameraWidth,
    cameraHeight,
    faceWidth,
    faceHeight,
    cameraRef,
    capturedImage,
    isPhotoTaken,
    isFlashActive,
  } = useContext(AppContext);

  const canvasRef = useRef(null);

  const videoConstraints = {
    width: cameraWidth,
    height: cameraHeight,
    facingMode: 'user',
  };

  useEffect(() => {
    if (isPhotoTaken) {
      return;
    }

    const canvas = canvasRef.current;
    createOvalHole(canvas, cameraWidth, cameraHeight, faceWidth, faceHeight);
  }, [canvasRef, isPhotoTaken]);

  return (
    <Box>
      <Webcam
        ref={cameraRef}
        mirrored={true}
        audio={false}
        videoConstraints={videoConstraints}
        screenshotFormat="image/jpeg"
        style={{ zIndex: -1, position: 'absolute', borderRadius: 30 }}
      />
      {isFlashActive && <Flash />}
      <canvas ref={canvasRef} style={{ borderRadius: 30 }} />
    </Box>
  );
}

export default Camera;
