import { Box } from '@mui/material';
import React from 'react';

function SuspenseLoading() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      Mohon Tunggu...
    </Box>
  );
}

export default SuspenseLoading;
