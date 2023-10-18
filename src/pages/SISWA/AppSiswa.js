import React from 'react';
import { Box, Typography } from '@mui/material';

import { PROFILE } from '../../hooks/useHelperContext';

function AppSiswa() {
  const { itemsNoPagination } = React.useContext(PROFILE);
  const word = [
    'Semangat Bosku 💪',
    'Bagaimana kabarmu hari ini? Tetap semangat ya 😊',
    'Aku yakin kamu bisa. 😇',
    'Gak perlu kata-kata, yang penting bukti nyata!, iya nggak bosku 😁',
    'Yok! Bisa Yok! 🥳',
    'SEMANGAT!!!! 😎',
    'Gimana pelajaran hari ini? 😀',
  ];
  const kataKata = React.useMemo(() => word[Number(Math.ceil(Math.random() * word.length))], []);
  return (
    <Box>
      <Box>
        <Typography variant="h5">Hai 👋 {itemsNoPagination?.nama}, </Typography>
        <Typography>{kataKata}</Typography>
      </Box>
    </Box>
  );
}

export default AppSiswa;
