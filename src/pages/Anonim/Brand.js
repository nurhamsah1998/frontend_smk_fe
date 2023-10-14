import { Box, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Brand() {
  const navigate = useNavigate();
  const handleLogOut = () => {
    window.localStorage.clear();
    setTimeout(() => {
      navigate('/');
    }, 500);
  };
  return (
    <Box>
      <Box>
        <Box
          sx={{
            position: 'absolute',
            width: { xs: '90%', sm: '60%', md: '50%', lg: '40%' },
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <img alt="pgri" src="/assets/logo_pgri.png" />
          <Button onClick={handleLogOut} color="error" sx={{ mt: 2 }} variant="contained">
            Log out
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Brand;
