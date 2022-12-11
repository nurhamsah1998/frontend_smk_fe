import React from 'react';
import { Box, Button, Divider, ListItemText, Typography } from '@mui/material';
import { FormatCurrency } from '../../../../../components/FormatCurrency';
import Create from './Create';

function TagihanNonSpp({ item, studentProfile }) {
  const [openModalTransaction, setOpenModalTransaction] = React.useState(false);

  const TableBill = () => {
    const sumCicilan =
      item?.cicilan?.length <= 0 ? 0 : item?.cicilan?.map((i) => i?.uang_diterima)?.reduce((a, b) => a + b);
    return (
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
            <Typography variant="subtitle2">{FormatCurrency(sumCicilan)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Kekurangan</Typography>
            <Typography variant="subtitle2">Rp.0</Typography>
          </Box>
        </Box>
      </Box>
    );
  };
  return (
    <Box>
      <ListItemText secondary={item?.deskripsi} />
      <TableBill />
      <Box sx={{ mt: 2 }}>
        <Button onClick={() => setOpenModalTransaction(true)} variant="contained">
          Buat transaksi
        </Button>
      </Box>
      <Create
        studentProfile={studentProfile}
        item={item}
        openModalTransaction={openModalTransaction}
        setOpenModalTransaction={setOpenModalTransaction}
        TableBill={TableBill}
      />
    </Box>
  );
}

export default TagihanNonSpp;
