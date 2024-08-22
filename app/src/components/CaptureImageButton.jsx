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
    setCapturedImage,
  } = useContext(AppContext);

  const handleClick = () => {
    const image = new Image();
    image.src = cameraRef.current.getScreenshot();

    image.onload = () => {
      setCapturedImage(cropImageWithOvalShape(image, faceWidth, faceHeight));
      setIsPhotoTaken(true);
    };
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      {'Capture Image'}
    </Button>
  );
}

export default CaptureImageButton;
