import { useState, useEffect, memo, Suspense } from 'react';

import { Navigate, Outlet, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Box, Button } from '@mui/material';
import jwtDecode from 'jwt-decode';
import { grey } from '@mui/material/colors';
// eslint-disable-next-line import/no-unresolved
import SuspenseLoading from 'src/components/SuspenseLoading';
//
import { PROFILE } from '../../hooks/useHelperContext';
import useFetch from '../../hooks/useFetch';
import Header from '../dashboard/header';
import Nav from '../dashboard/nav';
import { navConfigTU } from '../navConfig/navConfig';
import LoadingPageReload from '../ProgresPage/LoadingPageReload';
import LockPage from '../ProgresPage/LockPage';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

export const StyledRootWraper = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

export const MainWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  backgroundColor: '#f7f7f7',
  paddingTop: APP_BAR_MOBILE,
  // paddingTop: '10px',
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.up('xs')]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

const ComponentAccountValidation = memo(({ itemsNoPagination, navigate, setOpen, open, isError }) => {
  const handleLogOut = () => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('current_page_tagihan');
    window.localStorage.removeItem('current_tab_tagihan');
    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  return (
    <>
      {isError && (
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h4" textTransform="uppercase" color={grey[700]}>
              saat ini server mengalami kegagalan saat memproses data
            </Typography>

            <Box mt={2}>
              <strong>Internal server error :</strong>
              <ul style={{ marginLeft: '20px' }}>
                <li>Periksa jaringan anda</li>
                <li>Pastikan alamat URL yang anda tuju sudah benar</li>
                <li>server kemungkinan down</li>
                <li>hubungi developer jika masalah belum terselesaikan</li>
              </ul>
            </Box>
            <Button sx={{ mt: 3 }} onClick={() => window.location.reload()} variant="contained">
              Muat ulang
            </Button>
          </Box>
        </Box>
      )}
      {itemsNoPagination?.role === 'ANONIM' && (
        <LockPage
          customHandleLogOut={() => {
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('current_page_tagihan');
            window.localStorage.removeItem('current_tab_tagihan');
            navigate('/');
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }}
          title="MAAF, AKUN ANDA DITAHAN"
          tag="silahkan hubungi developer"
        />
      )}
      {itemsNoPagination?.role === 'ADMINISTRASI' && !isError && (
        <StyledRootWraper>
          <Header navConfigMenu={navConfigTU} onOpenNav={() => setOpen(true)} />
          <Nav openNav={open} navConfig={navConfigTU} onCloseNav={() => setOpen(false)} />
          <MainWrapper>
            <Suspense fallback={<SuspenseLoading />}>
              <Outlet />
            </Suspense>
          </MainWrapper>
        </StyledRootWraper>
      )}
      {itemsNoPagination?.role === 'DEV' && !isError && (
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h4" textTransform="uppercase" color={grey[700]}>
              Ups! Anda Tidak Bisa Mengakses!
            </Typography>

            <Box mt={2}>
              <strong>Penyebab kemungkinan :</strong>
              <ul style={{ marginLeft: '20px' }}>
                <li>Ada perubahan data di database</li>
              </ul>
            </Box>
            <Box mt={2}>
              <strong>Solusi :</strong>
              <ul style={{ marginLeft: '20px' }}>
                <li>Cobalah untuk Log Out lalu Login lagi</li>
                <li>hubungi developer jika masalah belum terselesaikan</li>
              </ul>
            </Box>
            <Button sx={{ mt: 3 }} onClick={handleLogOut} variant="contained">
              Log Out
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
});

export default function DashboardLayoutStaff() {
  const [open, setOpen] = useState(false);
  const { itemsNoPagination, data, isLoading, isError } = useFetch({
    module: 'staff-profile',
  });
  const navigate = useNavigate();
  const token = window.localStorage.getItem('accessToken');
  const localToken = token ? jwtDecode(token || {}) : {};
  /// JIKA TERJADI PERUBAHAN PADA AKUN DI DB YANG MENGHASILKAN NULL JIKA GET PROFILE
  useEffect(() => {
    if (data?.data === null) {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('current_page_tagihan');
      window.localStorage.removeItem('current_tab_tagihan');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    if (localToken?.roleStaff === 'ADMINISTRASI') {
      console.log('');
    } else {
      navigate('/loading');
    }
  }, []);
  if (!token) return <Navigate to="/staff-login" replace />;
  return (
    <>
      <PROFILE.Provider value={{ itemsNoPagination, isLoading }}>
        <>
          {isLoading ? (
            <LoadingPageReload />
          ) : (
            <ComponentAccountValidation
              itemsNoPagination={itemsNoPagination}
              navigate={navigate}
              setOpen={setOpen}
              isError={isError}
              open={open}
            />
          )}
        </>
      </PROFILE.Provider>
    </>
  );
}
