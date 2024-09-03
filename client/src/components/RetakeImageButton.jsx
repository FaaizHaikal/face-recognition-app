import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

function CaptureImageButton() {
  const { setIsPhotoTaken, setCapturedImage, cameraWidth } =
    useContext(AppContext);

  const handleClick = () => {
    setIsPhotoTaken(false);
    setCapturedImage(null);
  };

  return (
    <Button
      variant="contained"
      color="warning"
      onClick={handleClick}
      style={{ width: cameraWidth }}
    >
      <ReplayIcon />
    </Button>
  );
}

export default CaptureImageButton;
