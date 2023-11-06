import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { red } from '@mui/material/colors';

function LockPage({
  title = 'Maaf akun anda dikunci oleh pihak sekolah',
  tag = 'Hubungi kantor untuk lebih jelas',
  customHandleLogOut = false,
}) {
  const handleLogOut = () => {
    if (!Boolean(customHandleLogOut)) {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('current_page_tagihan');
      window.localStorage.removeItem('current_tab_tagihan');
      window.location.reload();
    } else {
      customHandleLogOut();
    }
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
          {title}
        </Typography>
        <Typography color="#fff" textAlign="center">
          {tag}
        </Typography>
        <Button sx={{ mt: 2 }} color="error" onClick={handleLogOut} variant="contained">
          Log Out
        </Button>
      </Box>
    </Box>
  );
}

export default LockPage;
