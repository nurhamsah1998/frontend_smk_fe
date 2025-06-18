import { useState, useEffect, Suspense } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
// @mui
import jwtDecode from 'jwt-decode';
//
// eslint-disable-next-line import/no-unresolved
import SuspenseLoading from 'src/components/SuspenseLoading';
import { PROFILE } from '../../hooks/useHelperContext';
import useFetch from '../../hooks/useFetch';
import Header from '../dashboard/header';
import Nav from '../dashboard/nav';
import { navConfigDEV } from '../navConfig/navConfig';
import { MainWrapper, StyledRootWraper } from '../STAFF_TU/DashboardLayoutStaffTU';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function DashboardLayoutDEV() {
  const [open, setOpen] = useState(false);
  const { itemsNoPagination, isLoading, isFetched } = useFetch({
    module: 'staff-profile',
  });
  const navigate = useNavigate();
  const token = window.localStorage.getItem('accessToken');
  const localToken = token ? jwtDecode(token || {}) : {};
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
  if (!token) return <Navigate to="/staff-login" replace />;
  return (
    <>
      <PROFILE.Provider value={{ itemsNoPagination, isLoading }}>
        <StyledRootWraper>
          <Header navConfigMenu={navConfigDEV} onOpenNav={() => setOpen(true)} />
          <Nav openNav={open} navConfig={navConfigDEV} onCloseNav={() => setOpen(false)} />
          <MainWrapper>
            <Suspense fallback={<SuspenseLoading />}>
              <Outlet />
            </Suspense>
          </MainWrapper>
        </StyledRootWraper>
      </PROFILE.Provider>
    </>
  );
}
