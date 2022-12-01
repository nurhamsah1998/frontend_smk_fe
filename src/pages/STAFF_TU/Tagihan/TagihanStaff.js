import React from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import useDelete from '../../../hooks/useDelete';
import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';

export default function TagihanStaff() {
  const { items } = useFetch({
    module: 'tagihan',
  });

  const { destroy } = useDelete({
    module: 'tagihan',
  });
  const tableHead = [
    {
      id: 'nama',
      label: 'Nama tagihan',
    },
    {
      id: 'kode_tagihan',
      label: 'Kode tagihan',
    },
    {
      id: 'total',
      label: 'Total tagihan sejumlah',
    },
  ];
  const handleDelete = (item) => {
    destroy.mutate(item?.id);
  };
  return (
    <Box>
      <Box>
        <Button startIcon={<AddIcon />} variant="contained">
          Buat tagihan baru
        </Button>
      </Box>
      <Box mt={2}>
        <TableComponen tableBody={items} handleDelete={handleDelete} tableHead={tableHead} />
      </Box>
    </Box>
  );
}
