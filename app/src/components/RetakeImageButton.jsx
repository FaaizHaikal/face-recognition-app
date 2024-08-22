import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { Button } from '@mui/material';

function CaptureImageButton() {
  const { setIsPhotoTaken, setCapturedImage } = useContext(AppContext);

  const handleClick = () => {
    setIsPhotoTaken(false);
    setCapturedImage(null);
  };

  return (
    <Button variant="contained" color="warning" onClick={handleClick}>
      {'Retake Image'}
    </Button>
  );
}

export default CaptureImageButton;
