import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { Button } from '@mui/material';
import cropImageWithOvalShape from '../utils/CropImageWithOvalShape';

function CaptureImageButton() {
  const {
    faceWidth,
    faceHeight,
    setIsPhotoTaken,
    cameraRef,
    setIsFlashActive,
    setCapturedImage,
  } = useContext(AppContext);

  const captureImage = () => {
    const image = new Image();
    image.src = cameraRef.current.getScreenshot();

    image.onload = () => {
      setCapturedImage(cropImageWithOvalShape(image, faceWidth, faceHeight));
      setIsPhotoTaken(true);
    };
  }

  const handleClick = () => {
    setIsFlashActive(true);
    setTimeout(() => {
      setIsFlashActive(false);
      captureImage();
    }, 200);
    
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      {'Capture Image'}
    </Button>
  );
}

export default CaptureImageButton;
