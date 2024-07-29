import { useState, useEffect, memo, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
//
import Header from './header';
import Nav from './nav';
import useFetch from '../../hooks/useFetch';
import ProgresPage from '../ProgresPage';
import { PROFILE } from '../../hooks/useHelperContext';
import LoadingPageReload from '../ProgresPage/LoadingPageReload';
import BannedPage from '../ProgresPage/BannedPage';
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
      <StyledRoot>
        <Header onOpenNav={() => setOpen(true)} />

        <Nav openNav={open} onCloseNav={() => setOpen(false)} />

        <Main>
          <Outlet />
        </Main>
      </StyledRoot>
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
    module: `campaign-me?angkatan=${itemsNoPagination?.angkatan ? itemsNoPagination?.angkatan : ''}`,
    isCustom: true,
    enabled: Boolean(itemsNoPagination?.id),
  });
  const itemRebuild = (item = []) => {
    const result = [];
    for (let index = 0; index < item.length; index += 1) {
      if (
        item[index]?.jurusan_id === itemsNoPagination?.jurusanId &&
        item[index]?.kelas === itemsNoPagination?.kelas &&
        item[index]?.sub_kelas === itemsNoPagination?.sub_kelas
      ) {
        result.push(item[index]);
      }
      if (
        item[index]?.jurusan_id === null &&
        item[index]?.kelas === itemsNoPagination?.kelas &&
        item[index]?.sub_kelas === itemsNoPagination?.sub_kelas
      ) {
        result.push(item[index]);
      }
      if (
        item[index]?.jurusan_id === itemsNoPagination?.jurusanId &&
        item[index]?.kelas === '' &&
        item[index]?.sub_kelas === itemsNoPagination?.sub_kelas
      ) {
        result.push(item[index]);
      }
      if (
        item[index]?.jurusan_id === itemsNoPagination?.jurusanId &&
        item[index]?.kelas === itemsNoPagination?.kelas &&
        item[index]?.sub_kelas === ''
      ) {
        result.push(item[index]);
      }
      if (
        item[index]?.jurusan_id === null &&
        item[index]?.kelas === itemsNoPagination?.kelas &&
        item[index]?.sub_kelas === ''
      ) {
        result.push(item[index]);
      }
      if (
        item[index]?.jurusan_id === itemsNoPagination?.jurusanId &&
        item[index]?.kelas === '' &&
        item[index]?.sub_kelas === ''
      ) {
        result.push(item[index]);
      }
      if (
        item[index]?.jurusan_id === null &&
        item[index]?.kelas === '' &&
        item[index]?.sub_kelas === itemsNoPagination?.sub_kelas
      ) {
        result.push(item[index]);
      }
      if (item[index]?.jurusan_id === null && item[index]?.kelas === '' && item[index]?.sub_kelas === '') {
        result.push(item[index]);
      }
    }
    return result;
  };
  const campaignList = useMemo(() => itemRebuild(items?.data), [items?.data]);
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
