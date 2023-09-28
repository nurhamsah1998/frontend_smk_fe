import React from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { red } from '@mui/material/colors';

function BannedPage() {
  const handleLogOut = () => {
    window.localStorage.removeItem('accessToken');
    window.location.reload();
  };
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
          Maaf akun anda diblokir oleh pihak sekolah
        </Typography>
        <Typography color="#fff" textAlign="center">
          anda sudah tidak bisa mengakses situs sekolahan ini
        </Typography>
        <Button sx={{ mt: 2 }} color="error" onClick={handleLogOut} variant="contained">
          Log Out
        </Button>
      </Box>
    </Box>
  );
}

export default BannedPage;
