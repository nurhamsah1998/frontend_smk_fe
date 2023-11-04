import { useState, useEffect, memo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Box, Button } from '@mui/material';
import jwtDecode from 'jwt-decode';
import { grey } from '@mui/material/colors';
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

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE,
  // paddingTop: '10px',
  paddingBottom: theme.spacing(10),
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
  return (
    <>
      {isError && (
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h5" color={grey[700]}>
              Internal server error
            </Typography>
            <Typography color={grey[600]}>saat ini server mengalami kegagal saat memproses data</Typography>
            <Button sx={{ mt: 2 }} onClick={() => window.location.reload()} variant="contained">
              Muat ulang
            </Button>
          </Box>
        </Box>
      )}
      {itemsNoPagination?.role === 'ANONIM' && (
        <LockPage
          customHandleLogOut={() => {
            window.localStorage.removeItem('accessToken');
            navigate('/');
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }}
          title="MAAF, AKUN ANDA DITAHAN"
          tag="silahkan hubungi developer"
        />
      )}
      {itemsNoPagination?.role === 'ADMINISTRASI' && (
        <StyledRoot>
          <Header onOpenNav={() => setOpen(true)} />
          <Nav openNav={open} navConfig={navConfigTU} onCloseNav={() => setOpen(false)} />
          <Main>
            <Outlet />
          </Main>
        </StyledRoot>
      )}
    </>
  );
});

export default function DashboardLayoutStaff() {
  const [open, setOpen] = useState(false);
  const { itemsNoPagination, isLoading, isFetched, isError } = useFetch({
    module: 'staff-profile',
  });
  const navigate = useNavigate();
  const token = window.localStorage.getItem('accessToken');
  const localToken = jwtDecode(token || {});
  useEffect(() => {
    if (!token) {
      navigate('/staff-login');
    }
  }, []);
  useEffect(() => {
    if (localToken?.roleStaff === 'ADMINISTRASI') {
      console.log('');
    } else {
      navigate('/loading');
    }
  }, []);

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
