import { Box } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScreenDialog from '../../../components/ScreenDialog';

function DetailTagihanSiswa() {
  const location = useLocation();
  const navigate = useNavigate();
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
        sad
      </ScreenDialog>
    </Box>
  );
}

export default DetailTagihanSiswa;
