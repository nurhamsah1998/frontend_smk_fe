import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';

function Pembayaran() {
  const { items, page, totalPage, setPage } = useFetch({
    module: 'siswa',
  });
  const tableHead = [
    {
      id: 'nama',
      label: 'Nama tagihan',
    },
    {
      id: 'username',
      label: 'Username',
    },
  ];
  return (
    <Box sx={{ display: 'grid' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <TextField size="small" label="Kode siswa" />
      </Box>
      <Box>
        <TableComponen
          count={totalPage}
          pageOnchange={(x, y) => {
            setPage(y - 1);
          }}
          hideOption
          tableBody={items}
          tableHead={tableHead}
        />
      </Box>
    </Box>
  );
}

export default Pembayaran;
