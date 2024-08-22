import { useEffect, useRef, useContext } from 'react';
import AppContext from '../context/AppContext';
import { Box, Grid, Typography } from '@mui/material';
import CaptureImageButton from './CaptureImageButton';

function CameraFrame() {
  const { cameraWidth, cameraHeight, faceWidth, faceHeight, photoRef, photoUrl, isPhotoTaken } = useContext(AppContext);

  const videoRef = useRef(null);

  const fetchImage = async () => {
    navigator.mediaDevices.getUserMedia({ 
      video:  { width: cameraWidth, height: cameraHeight, frameRate: 30 },
    }).then((stream) => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play();
    }).catch((error) => {
      console.error('Failed to fetch images:', error);
    });
  };

  const drawFaceShape = () => {
    const canvas = photoRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = cameraWidth;
    canvas.height = cameraHeight;
  
    // Clear previous drawings
    ctx.drawImage(videoRef.current, 0, 0, cameraWidth, cameraHeight);

    // Crop the frame to an oval shape
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.ellipse(
      cameraWidth / 2,   // X-coordinate of the center
      cameraHeight / 2,  // Y-coordinate of the center
      faceWidth / 2,   // Horizontal radius
      faceHeight / 2,  // Vertical radius
      0,           // Rotation angle
      0,           // Start angle
      2 * Math.PI  // End angle (full circle)
    );
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over'; 
    ctx.stroke();
  };

  useEffect (() => {
    if (!isPhotoTaken) {
      fetchImage();
      // drawFaceShape();
      const intervalId = setInterval(drawFaceShape, 1000 / 30); // Roughly 60fps
  
      // Clean up
      return () => clearInterval(intervalId);
    }
  });

  return (
    <Box>
      {videoRef ? (
        <Grid container
          direction="column"
          justifyContent="center"
        >
          <Grid item>
           {!isPhotoTaken && <video
              ref={videoRef}
              width={cameraWidth}
              height={cameraHeight}
              style={{ display: 'none' }}
            />
           }
            <canvas
              ref={photoRef}
              width={cameraWidth}
              height={cameraHeight}
            />
            <img
              src={photoUrl}
            />
          </Grid>
          <Grid item>
            <CaptureImageButton />
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6">Loading camera...</Typography>
      )}
    </Box>
  );
}

export default CameraFrame;
