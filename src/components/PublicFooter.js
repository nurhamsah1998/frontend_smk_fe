/* eslint-disable import/no-unresolved */
import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import { themeAppColors } from 'src/theme/themeAppColor';

function PublicFooter() {
  return (
    <Box sx={{ bgcolor: themeAppColors.main, color: 'white', mt: 4, py: 3 }}>
      <Container>
        <Typography variant="h6">SMK PGRI KRAS</Typography>
        <Typography variant="body2">Jalan Raya Desa Kras Kec. Kras Kab. Kediri</Typography>
        <Typography variant="body2">Telp: 0354-479487 | Email: smk_pgri_kras007@yahoo.co.id</Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          &copy; 2023 SMK PGRI KRAS. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default PublicFooter;
