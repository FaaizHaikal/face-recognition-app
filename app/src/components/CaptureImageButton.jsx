import { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { Button } from '@mui/material';


function CaptureImageButton() {
  const { isPhotoTaken, setIsPhotoTaken, photoRef, setPhotoUrl } = useContext(AppContext);

  const handleClick = () => {
    setIsPhotoTaken(!isPhotoTaken);
  }

  useEffect(() => {
    if (isPhotoTaken) {
      setPhotoUrl(photoRef.current.toDataURL('image/png'));
    }
  }, [isPhotoTaken]);

  return (
    <Button
      variant="contained"
      color={isPhotoTaken ? 'warning' : 'primary'}
      onClick={handleClick}
    >
      {isPhotoTaken ? 'Retake Image' : 'Capture Image'}
    </Button>
  );
}

export default CaptureImageButton;
