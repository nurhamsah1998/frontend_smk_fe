import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';

// ----------------------------------------------------------------------

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

export default function Page404() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found | SMK PGRI KRAS </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Maaf, page tidak ditemukan
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Sepertinya apa yang anda cari tidak tersedia, coba periksa link URL. Pastikan menulis dengan benar
          </Typography>

          <Button to="/" size="large" variant="contained" sx={{ mt: 2 }} component={RouterLink}>
            Kembali
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
