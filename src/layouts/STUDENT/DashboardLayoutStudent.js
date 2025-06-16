import { useState, useEffect, memo, useMemo, Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
//
// eslint-disable-next-line import/no-unresolved
import SuspenseLoading from 'src/components/SuspenseLoading';
import Header from './header';
import Nav from './nav';
import useFetch from '../../hooks/useFetch';
import ProgresPage from '../ProgresPage';
import { PROFILE } from '../../hooks/useHelperContext';
import LoadingPageReload from '../ProgresPage/LoadingPageReload';
import BannedPage from '../ProgresPage/BannedPage';
import LockPage from '../ProgresPage/LockPage';
import { MainWrapper, StyledRootWraper } from '../STAFF_TU/DashboardLayoutStaffTU';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
const ComponentAccountValidationStudent = memo(({ itemsNoPagination, setOpen, open, isError }) => (
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
              <li>hubungi developer jika masalah belum terselesaikan</li>
            </ul>
          </Box>
          <Button sx={{ mt: 3 }} onClick={() => window.location.reload()} variant="contained">
            Muat ulang
          </Button>
        </Box>
      </Box>
    )}
    {itemsNoPagination?.status?.includes('checking') && <ProgresPage />}
    {itemsNoPagination?.status?.includes('lock') && <LockPage />}
    {itemsNoPagination?.status?.includes('blokir') && <BannedPage />}
    {itemsNoPagination?.status?.includes('accepted') && (
      <StyledRootWraper>
        <Header onOpenNav={() => setOpen(true)} />

        <Nav openNav={open} onCloseNav={() => setOpen(false)} />

        <MainWrapper>
          <Suspense fallback={<SuspenseLoading />}>
            <Outlet />
          </Suspense>
        </MainWrapper>
      </StyledRootWraper>
    )}
  </>
));

export default function DashboardLayoutStudent() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { itemsNoPagination, isLoading, isError } = useFetch({
    module: 'siswa-profile',
  });
  const {
    itemsNoPagination: items,
    refetch: refetchCampaign,
    isLoading: isLoadingCampaign,
  } = useFetch({
    module: `campaign-me`,
    enabled: Boolean(itemsNoPagination?.id),
  });

  const campaignList = useMemo(() => items?.data, [items?.data]);
  useEffect(() => {
    const token = window.localStorage.getItem('accessToken');
    if (!token) {
      navigate('/siswa-login');
    }
  }, []);
  return (
    <PROFILE.Provider value={{ itemsNoPagination, isLoading, campaignList, refetchCampaign, isLoadingCampaign }}>
      <>
        {isLoading ? (
          <LoadingPageReload />
        ) : (
          <ComponentAccountValidationStudent
            itemsNoPagination={itemsNoPagination}
            setOpen={setOpen}
            isError={isError}
            open={open}
          />
        )}
      </>
    </PROFILE.Provider>
  );
}
