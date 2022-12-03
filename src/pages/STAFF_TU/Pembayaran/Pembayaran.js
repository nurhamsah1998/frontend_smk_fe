import React from 'react';
import { Box, Button, TextField } from '@mui/material';

function Pembayaran() {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ width: '50%' }}>
          <TextField size="small" label="Kode siswa" fullWidth />
          <Button fullWidth sx={{ mt: 2 }} variant="contained">
            Cari
          </Button>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Box>asd</Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Pembayaran;
