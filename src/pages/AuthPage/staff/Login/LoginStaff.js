import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Link, Container, Typography, Divider, Stack, Button, Box } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
import Logo from '../../../../components/logo';
import Iconify from '../../../../components/iconify';
// sections
import { LoginForm } from '../../../../sections/auth/login';

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
  backgroundColor: theme.palette.background.default,
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

export default function LoginStaff() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title> Login </title>
      </Helmet>

      <StyledRoot>
        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              School Staff
            </Typography>
          </StyledSection>
        )}
        <Box sx={{ position: 'fixed', top: 10, right: 10 }}>
          <Button onClick={() => navigate('/siswa-login')}>login as Student</Button>
        </Box>
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Staff Login
            </Typography>
            <LoginForm />
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="subtitle2">Don't have an account yet?</Typography>
              <Typography
                onClick={() => navigate('/staff-register')}
                component="span"
                sx={{ cursor: 'pointer' }}
                fontWeight={700}
                color="#2065D1"
                variant="subtitle2"
              >
                Register
              </Typography>
            </Box>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
