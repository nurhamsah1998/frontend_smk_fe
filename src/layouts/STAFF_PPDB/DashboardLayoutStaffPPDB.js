import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from '../dashboard/header';
import Nav from '../dashboard/nav';
import { navConfigPPDB } from '../navConfig/navConfig';
import { PROFILE } from '../../hooks/useHelperContext';
import useFetch from '../../hooks/useFetch';

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
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.up('xs')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayoutStaffPPDB() {
  const [open, setOpen] = useState(false);
  const { itemsNoPagination, isLoading } = useFetch({
    module: 'staff-profile',
  });
  const navigate = useNavigate();
  useEffect(() => {
    const token = window.localStorage.getItem('accessToken');
    if (!token) {
      navigate('/staff-login');
    }
  }, []);
  return (
    <>
      <PROFILE.Provider value={{ itemsNoPagination, isLoading }}>
        <StyledRoot>
          <Header onOpenNav={() => setOpen(true)} />
          <Nav navConfig={navConfigPPDB} openNav={open} onCloseNav={() => setOpen(false)} />
          <Main>
            <Outlet />
          </Main>
        </StyledRoot>
      </PROFILE.Provider>
    </>
  );
}
