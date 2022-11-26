import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

function index() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: grey[300],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: '80%' }}>
        <Typography variant="h4">Mohon Ditunggu.</Typography>
        <Typography mt={-1}>Data diri anda dalam pengecekan petugas kami.</Typography>
        <LinearProgress color="inherit" sx={{ height: 15, borderRadius: '100px', mt: 1 }} />
      </Box>
    </Box>
  );
}

export default index;
