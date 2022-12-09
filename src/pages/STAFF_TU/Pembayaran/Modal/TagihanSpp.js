import React from 'react';
import { Box } from '@mui/material';
import TableComponen from '../../../../components/TableComponent';

function TagihanSpp({ handleTransaction, handleInvoice, item }) {
  const tableHead = [
    {
      id: 'bulan',
      label: 'Bulan',
    },
    {
      id: 'total',
      label: 'Nominal',
    },
    {
      id: 'isPaid',
      label: 'Status',
      variantStatusColor: [
        {
          variant: 'success',
          label: 'Lunas',
          value: true,
        },
        {
          variant: 'error',
          label: 'Belum lunas',
          value: false,
        },
      ],
    },
  ];
  return (
    <Box>
      <Box mt={2}>
        <TableComponen
          handleTransaction={handleTransaction}
          handleInvoice={handleInvoice}
          disablePagination
          colorHead="cyan"
          tableBody={item?.periode}
          tableHead={tableHead}
        />
      </Box>
    </Box>
  );
}

export default TagihanSpp;
