import React from 'react';
import jwtDecode from 'jwt-decode';
import { Box, CircularProgress, Typography } from '@mui/material';
import { orange } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

function RouterPath() {
  const navigate = useNavigate();
  const localToken = window.localStorage.getItem('accessToken');

  React.useEffect(() => {
    if (localToken) {
      const token = jwtDecode(localToken || '');
      const traficRole = [
        {
          role: 'ADMINISTRASI',
          path: '/staff-tu/dashboard',
        },
        {
          role: 'GURU',
          path: '/staff-guru/app',
        },
      ];
      const findRole = traficRole.find((i) => i.role === token.roleStaff);
      if (findRole) {
        navigate(findRole.path);
      } else {
        navigate('/siswa/app');
      }
    }
    if (!localToken) {
      navigate('/siswa-login');
    }
  }, []);

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress sx={{ color: '#fff' }} />
        <Typography fontSize={25} fontWeight={300} color="#fff" textAlign="center">
          Memuat
        </Typography>
      </Box>
    </Box>
  );
}

export default RouterPath;
