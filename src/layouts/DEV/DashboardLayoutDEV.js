/* eslint-disable import/no-unresolved */
import { useState, useEffect, Suspense, useContext } from 'react';
import Cookies from 'universal-cookie';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Dialog } from 'src/hooks/useContextHook';
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
  const { setDialog } = useContext(Dialog);
  const [open, setOpen] = useState(false);
  const { itemsNoPagination, isLoading, data } = useFetch({
    module: 'staff-profile',
  });
  const navigate = useNavigate();
  const token = window.localStorage.getItem('accessToken');
  const localToken = token ? jwtDecode(token || {}) : {};
  const cookie = new Cookies();
  /// NOTIF UNTUK MELAKUKAN BACKUP PER 7 HARI
  const hasReminded = cookie.get('backup_remainder');
  useEffect(() => {
    if (!hasReminded) {
      setTimeout(() => {
        setDialog(() => ({
          helperText: `Sangat direkomendasikan untuk melakukan backup database per 7 hari, untuk meminimalisir kejadian yang tidak diinginkan. Pesan ini diharapkan akan terus muncul per 7 hari sebagai pengingat. 👀`,
          title: 'Perhatian',
          labelClose: 'Tutup, ingatkan nanti.',
          variant: 'info',
          labelSubmit: 'Oke',
          fullWidth: false,
          do: () => {
            const dateTime = new Date();
            cookie.set('backup_remainder', 1, {
              path: '/',
              expires: new Date(dateTime.setDate(dateTime.getDate() + 7)),
            });
          },
          isCloseAfterSubmit: true,
        }));
      }, 5000);
    }
  }, []);
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
