import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';

function ErrorPage() {
  const handleReload = () => {
    window.location.reload();
  };
  return (
    <>
      <Helmet>
        <title> Error </title>
      </Helmet>
      <Box
        sx={{
          height: '100dvh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            maxWidth: { xs: '80%', sm: '80%', md: '80%', lg: '50%' },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '22px' }}>Error</Typography>
            <Typography
              sx={{
                lineHeight: '55px',
                fontSize: '60px',
                fontWeight: 800,
              }}
            >
              CRASH!
            </Typography>
            <Typography sx={{ fontSize: '15px', textAlign: 'center', mt: 2 }}>Maaf terjadi kesalahan</Typography>
            <Box>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleReload}>
                Muat Ulang
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ErrorPage;
