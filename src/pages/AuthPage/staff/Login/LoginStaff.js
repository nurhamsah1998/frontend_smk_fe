import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
// sections
import LoginForm from './LoginForm';
import { SideAuthBox } from '../../siswa/Login/LoginStudentPage';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
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
        <title> Login | SMK KRAS </title>
      </Helmet>

      <StyledRoot>
        {mdUp && <SideAuthBox />}
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Staff Login
            </Typography>
            <LoginForm />
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="subtitle2">Belum punya akun ?</Typography>
              <Typography
                onClick={() => navigate('/staff-register')}
                component="span"
                sx={{ cursor: 'pointer' }}
                fontWeight={700}
                color="#2065D1"
                variant="subtitle2"
              >
                Daftar
              </Typography>
            </Box>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
