import { Box, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScreenDialog from '../../../components/ScreenDialog';
import TabScreen from './TabScreen';

function DetailTagihanSiswa() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabList = [
    {
      label: 'Kelas I',
      class: '01',
    },
    {
      label: 'Kelas II',
      class: '02',
    },
    {
      label: 'Kelas III',
      class: '03',
    },
  ];
  return (
    <Box>
      <ScreenDialog
        // isLoading={isLoading}
        open={location.search?.includes('?open-student-bill')}
        title="Daftar tagihan siswa"
        handleClose={() => navigate(-1)}
        labelClose="tutup"
        labelSubmit="buat"
      >
        <TabScreen tabList={tabList} />
      </ScreenDialog>
    </Box>
  );
}

export default DetailTagihanSiswa;
