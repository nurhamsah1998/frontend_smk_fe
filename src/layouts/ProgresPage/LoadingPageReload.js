import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { orange } from '@mui/material/colors';

function LoadingPageReload() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: orange[600],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <CircularProgress sx={{ color: '#fff' }} />
        <Typography fontSize={25} color="#fff">
          Memuat
        </Typography>
      </Box>
    </Box>
  );
}

export default LoadingPageReload;
