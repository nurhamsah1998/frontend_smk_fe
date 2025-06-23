import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';

import { Navigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
import FormLogin from './FormLogin';
import { themeAppColors } from '../../../../theme/themeAppColor';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: themeAppColors.main,
  position: 'relative',
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------
export const SideAuthBox = () => (
  <StyledSection>
    <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5, color: '#fff', zIndex: 1 }}>
      Aplikasi Management Sekolah - SMK PGRI KRAS
    </Typography>
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        right: 10,
        left: 10,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Typography sx={{ color: '#fff', fontSize: '12px', zIndex: 1 }}>version 2.0.0</Typography>
      <Typography sx={{ color: '#fff', fontSize: '12px', zIndex: 1 }}>&copy; Copyright 2023 | SMK PGRI KRAS</Typography>
    </Box>
    <Box
      sx={{
        position: 'absolute',
        width: '70%',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: '0.2',
      }}
    >
      <img alt="pgri" src="/assets/logo_pgri.png" />
    </Box>
  </StyledSection>
);
export default function LoginStudentPage() {
  const mdUp = useResponsive('up', 'md');
  const token = window.localStorage.getItem('accessToken');
  if (token) return <Navigate to="/" replace />;
  return (
    <>
      <Helmet>
        <title> Login | SMK KRAS </title>
      </Helmet>

      <StyledRoot>
        {mdUp && <SideAuthBox />}
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Login
            </Typography>
            <FormLogin />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
