import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Link, Container, Typography, Divider, Stack, Button, Box } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
import { themeAppColors } from '../../../../theme/themeAppColor';
import FormRegister from './FormRegisterStaff';

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

export default function RegisterStaffPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title> Login | SMK KRAS </title>
      </Helmet>

      <StyledRoot>
        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5, color: '#fff' }}>
              Aplikasi Management Sekolah - SMK PGRI KRAS
            </Typography>
            <Typography sx={{ position: 'absolute', bottom: 20, color: '#fff', right: 10 }}>
              ©️ Copyright | SMK PGRI KRAS
            </Typography>
          </StyledSection>
        )}
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Staff Register
            </Typography>
            <FormRegister />
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="subtitle2">Sudah punya akun ?</Typography>
              <Typography
                onClick={() => navigate('/staff-login')}
                component="span"
                sx={{ cursor: 'pointer' }}
                fontWeight={700}
                color="#2065D1"
                variant="subtitle2"
              >
                Login
              </Typography>
            </Box>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
