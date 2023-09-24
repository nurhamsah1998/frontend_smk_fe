import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { red } from '@mui/material/colors';

function LockPage() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: red[600],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'grid' }}>
        <Typography fontSize={25} fontWeight={700} color="#fff" textAlign="center">
          Maaf akun anda dikunci oleh pihak sekolah
        </Typography>
        <Typography color="#fff" textAlign="center">
          Hubungi kantor untuk lebih jelas
        </Typography>
      </Box>
    </Box>
  );
}

export default LockPage;
