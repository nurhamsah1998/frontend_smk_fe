import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';
import useFetch from '../../hooks/useFetch';
import ProgresPage from '../ProgresPage';
import { PROFILE } from '../../hooks/useHelperContext';
import LoadingPageReload from '../ProgresPage/LoadingPageReload';
import BannedPage from '../ProgresPage/BannedPage';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 32;
const APP_BAR_DESKTOP = 61;

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

export default function DashboardLayoutStudent() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { itemsNoPagination, isLoading } = useFetch({
    module: 'siswa-profile',
  });
  useEffect(() => {
    const token = window.localStorage.getItem('accessToken');
    if (!token) {
      navigate('/siswa-login');
    }
  }, []);

  const jsxElement = (
    <>
      {itemsNoPagination?.status?.includes('checking') && <ProgresPage />}
      {itemsNoPagination?.status?.includes('lock') && <BannedPage />}
      {itemsNoPagination?.status?.includes('accepted') && (
        <StyledRoot>
          <Header onOpenNav={() => setOpen(true)} />

          <Nav openNav={open} onCloseNav={() => setOpen(false)} />

          <Main>
            <Outlet />
          </Main>
        </StyledRoot>
      )}
    </>
  );
  return (
    <PROFILE.Provider value={{ itemsNoPagination, isLoading }}>
      <>{isLoading ? <LoadingPageReload /> : jsxElement}</>
    </PROFILE.Provider>
  );
}
