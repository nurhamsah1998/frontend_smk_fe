import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { Container, Typography, Button, Box } from '@mui/material';
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
export const SideAuthBox = () => {
  return (
    <StyledSection>
      <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5, color: '#fff', zIndex: 1 }}>
        Aplikasi Management Sekolah - SMK PGRI KRAS
      </Typography>
      <Typography sx={{ position: 'absolute', bottom: 20, color: '#fff', right: 10, fontSize: '12px', zIndex: 1 }}>
        ©️ Copyright 2023 | SMK PGRI KRAS
      </Typography>
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
};
export default function LoginStudentPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();
  // const { items } = useFetch({
  //   module: 'tagihan',
  // });
  // console.log(items.map((i) => ({ ...i, periode: JSON.parse(i.periode) })));
  // const { items } = useFetch({
  //   module: 'siswa',
  // });
  // console.log(items);
  return (
    <>
      <Helmet>
        <title> Login | SMK KRAS </title>
      </Helmet>

      <StyledRoot>
        {mdUp && <SideAuthBox />}
        <Box sx={{ position: 'fixed', top: 10, right: 10 }}>
          <Button onClick={() => navigate('/staff-login')} variant="outlined">
            Staff
          </Button>
        </Box>
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Login
            </Typography>
            <FormLogin />
            {/* <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="subtitle2">Belum punya akun ?</Typography>
              <Typography
                onClick={() => navigate('/siswa-register')}
                component="span"
                sx={{ cursor: 'pointer' }}
                fontWeight={700}
                color="#2065D1"
                variant="subtitle2"
              >
                Daftar
              </Typography>
            </Box> */}
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
