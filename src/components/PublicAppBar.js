import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import React from 'react';

function PublicAppBar() {
  const handleClickLogo = () => {
    window.location.href = '/news';
  };
  return (
    <AppBar position="sticky" top={0} color="primary">
      <Toolbar sx={{ gap: 1 }}>
        <Box>
          <img
            src="/assets/logo_pgri.png"
            style={{
              height: '50px',
            }}
            alt="logo_pic"
          />
        </Box>

        <Box
          sx={{
            cursor: 'pointer',
          }}
          onClick={handleClickLogo}
        >
          <Typography variant="h6" lineHeight={1} component="div">
            SMK PGRI KRASS
          </Typography>
          <Typography variant="caption" lineHeight={1} component="div">
            official news
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default PublicAppBar;
