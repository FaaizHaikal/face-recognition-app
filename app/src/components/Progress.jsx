import React from 'react';
import { Box, LinearProgress, styled, Typography } from '@mui/material';

function Progress({ value }) {
  const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'lightgrey',
    '& .MuiLinearProgress-bar': {
      backgroundColor: 'green',
    },
  }));

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <CustomLinearProgress
          variant="determinate"
          value={clamp(value, 0, 100)}
        />
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`Detecting ${Math.round(clamp(value, 0, 100))}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default Progress;
