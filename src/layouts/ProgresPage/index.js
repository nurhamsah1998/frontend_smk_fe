import React from 'react';
import { Box, LinearProgress, Typography, Button } from '@mui/material';
import { grey } from '@mui/material/colors';

function index() {
  const handleLogOut = () => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('current_page_tagihan');
    window.localStorage.removeItem('current_tab_tagihan');
    window.location.reload();
  };
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
      <Box sx={{ width: { xs: '80%', sm: '80%', md: '50%', lg: '50%' } }}>
        <Typography variant="h4">Mohon Ditunggu.</Typography>
        <Typography mt={-1}>Data diri anda dalam pengecekan petugas kami.</Typography>
        <LinearProgress color="inherit" sx={{ height: 15, borderRadius: '100px', mt: 1 }} />
        <Button sx={{ mt: 2 }} color="error" onClick={handleLogOut} variant="contained">
          Log Out
        </Button>
      </Box>
    </Box>
  );
}

export default index;
