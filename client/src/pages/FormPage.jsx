import React from 'react';
import SubmitFormButton from '../components/SubmitFormButton';
import { Box, Grid } from '@mui/material';
import DataInput from '../components/DataInput';
import ImageInput from '../components/ImageInput';

function FormPage() {
  return (
    <Box
      style={{
        margin: 15,
        padding: 16,
        border: '1px solid #ccc',
        borderRadius: 8,
      }}
    >
      <Grid container>
        <Grid item xs={12} md={6}>
          <DataInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <ImageInput />
        </Grid>
      </Grid>
      <SubmitFormButton />
    </Box>
  );
}

export default FormPage;
