import React from 'react';
import jwtDecode from 'jwt-decode';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { themeAppColors } from './theme/themeAppColor';

function RouterPath() {
  const navigate = useNavigate();
  const localToken = window.localStorage.getItem('accessToken');

  React.useEffect(() => {
    if (localToken) {
      const token = jwtDecode(localToken || '');
      const traficRole = [
        {
          role: 'DEV',
          path: '/dev/dashboard',
        },
        {
          role: 'ADMINISTRASI',
          path: '/staff-tu/dashboard',
        },
        {
          role: 'GURU',
          path: '/staff-guru/dashboard',
        },
        {
          role: 'PPDB',
          path: '/staff-ppdb/dashboard',
        },
        {
          role: 'ANONIM',
          path: '/brand',
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
        bgcolor: themeAppColors,
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
