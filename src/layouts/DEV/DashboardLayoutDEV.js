import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import jwtDecode from 'jwt-decode';
//
import { PROFILE } from '../../hooks/useHelperContext';
import useFetch from '../../hooks/useFetch';
import Header from '../dashboard/header';
import Nav from '../dashboard/nav';
import { navConfigDEV } from '../navConfig/navConfig';

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

export default function DashboardLayoutDEV() {
  const [open, setOpen] = useState(false);
  const { itemsNoPagination, isLoading, isFetched } = useFetch({
    module: 'staff-profile',
  });
  const navigate = useNavigate();
  const token = window.localStorage.getItem('accessToken');
  const localToken = jwtDecode(token || '');
  useEffect(() => {
    if (!token) {
      navigate('/staff-login');
    }
  }, []);
  useEffect(() => {
    if (localToken?.roleStaff === 'DEV') {
      console.log('i am DEV');
    } else {
      navigate('/loading');
    }
  }, []);

  return (
    <>
      <PROFILE.Provider value={{ itemsNoPagination, isLoading }}>
        <StyledRoot>
          <Header navConfigMenu={navConfigDEV} onOpenNav={() => setOpen(true)} />
          <Nav openNav={open} navConfig={navConfigDEV} onCloseNav={() => setOpen(false)} />
          <Main>
            <Outlet />
          </Main>
        </StyledRoot>
      </PROFILE.Provider>
    </>
  );
}
