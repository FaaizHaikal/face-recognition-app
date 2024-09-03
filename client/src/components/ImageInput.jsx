import { useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
import { Grid } from '@mui/material';
import Camera from './Camera';
import CaptureImageButton from './CaptureImageButton';
import RetakeImageButton from './RetakeImageButton';

function ImageInput() {
  const { capturedImage, isPhotoTaken } = useContext(AppContext);

  return (
    <Grid container direction="column" justifyContent="center">
      <Grid item>
        {isPhotoTaken ? (
          <img src={capturedImage} style={{ borderRadius: 30 }} />
        ) : (
          <Camera />
        )}
      </Grid>
      <Grid item>
        {isPhotoTaken ? <RetakeImageButton /> : <CaptureImageButton />}
      </Grid>
    </Grid>
  );
}

export default ImageInput;
