import React from 'react';
import { Box, Divider, ListItemText, Typography } from '@mui/material';
import { FormatCurrency } from '../../../../components/FormatCurrency';

function TagihanNonSpp({ item }) {
  return (
    <Box>
      <ListItemText secondary={item?.deskripsi} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'space-between', sm: 'space-between', md: 'flex-end', lg: 'flex-end' },
        }}
      >
        <Box mt={2} sx={{ width: { xs: '100%', sm: '100%', md: '50%', lg: '50%' }, display: 'grid', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Total tagihan</Typography>
            <Typography variant="subtitle2">{FormatCurrency(item?.total)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Terbayar</Typography>
            <Typography variant="subtitle2">Rp.300.000</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Kekurangan</Typography>
            <Typography variant="subtitle2">Rp.0</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TagihanNonSpp;
