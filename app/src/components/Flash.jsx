import React from 'react';
import { Box } from '@mui/material';

function Flash() {
  return (
    <Box
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        opacity: 0.8,
      }}
    >
    </Box>
  );
}

export default Flash;