import { Box, Typography } from '@mui/material';
import queryString from 'query-string';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScreenDialog from '../../../../components/ScreenDialog';
import TabScreen from './TabScreen';
import useFetchById from '../../../../hooks/useFetchById';

function DetailTagihanSiswa() {
  const location = useLocation();
  const navigate = useNavigate();
  const idCode = queryString.parse(location.search);
  const { items: studentProfile } = useFetchById({
    module: 'siswa',
    idCode: `${idCode?.id || ''}`,
  });

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
        open={location.search?.includes('?modal-open=true')}
        title="Rincian tagihan"
        handleClose={() => navigate(-1)}
        labelClose="tutup"
      >
        <Box sx={{ display: 'grid' }}>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ width: '70px' }}>Nama</Typography>:
            <Typography variant="subtitle2" ml={1}>
              {studentProfile?.nama}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', my: -0.5 }}>
            <Typography sx={{ width: '70px' }}>Kelas</Typography>:
            <Typography variant="subtitle2" ml={1}>
              {studentProfile?.kelas}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ width: '70px' }}>Jurusan</Typography>:
            <Typography variant="subtitle2" ml={1}>
              {studentProfile?.jurusan?.nama}
            </Typography>
          </Box>
        </Box>
        <TabScreen studentProfile={studentProfile} tabList={tabList} />
      </ScreenDialog>
    </Box>
  );
}

export default DetailTagihanSiswa;
