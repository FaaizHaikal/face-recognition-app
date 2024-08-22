import { useEffect, useRef, useState, useContext } from 'react';
import Webcam from 'react-webcam';
import AppContext from '../context/AppContext';
import { Box, Grid, Typography } from '@mui/material';
import CaptureImageButton from './CaptureImageButton';
import RetakeImageButton from './RetakeImageButton';
import createOvalHole from '../utils/CreateOvalHole';
import base64ToBlob from '../utils/Base64ToBlob';

function CameraFrame() {
  const {
    apiKey,
    cameraWidth,
    cameraHeight,
    faceWidth,
    faceHeight,
    cameraRef,
    capturedImage,
    isPhotoTaken,
  } = useContext(AppContext);

  const canvasRef = useRef(null);

  const videoConstraints = {
    width: cameraWidth,
    height: cameraHeight,
    facingMode: 'user',
  };

  const requestFaceRecognition = async () => {
    const imageBlob = base64ToBlob(
      cameraRef.current.getScreenshot(),
      'image/jpeg'
    );

    const request = new FormData();
    request.append('file', imageBlob, 'image.jpeg');

    fetch('http://localhost:8000/api/v1/recognition/recognize', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: request,
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
          });
        } else {
          console.error('Failed to recognize face:', response);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    if (isPhotoTaken) {
      return;
    }

    const canvas = canvasRef.current;
    createOvalHole(canvas, cameraWidth, cameraHeight, faceWidth, faceHeight);

    const interval = setInterval(() => {
      requestFaceRecognition();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [canvasRef, isPhotoTaken]);

  return (
        <Grid container direction="column" justifyContent="center">
          <Grid item>
            {isPhotoTaken ? (
              <img src={capturedImage} />
            ) : (
              <Box>
                <Webcam
                  ref={cameraRef}
                  mirrored={true}
                  audio={false}
                  videoConstraints={videoConstraints}
                  screenshotFormat="image/jpeg"
                  style={{ zIndex: -1, position: 'absolute' }}
                />
                <canvas ref={canvasRef} />
              </Box>
            )}
          </Grid>
          <Grid item>
            {isPhotoTaken ? <RetakeImageButton /> : <CaptureImageButton />}
          </Grid>
        </Grid>
  );
}

export default CameraFrame;
