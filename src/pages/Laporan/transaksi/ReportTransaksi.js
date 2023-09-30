import { Box, TextField } from '@mui/material';
import React from 'react';
import { debounce } from 'lodash';

import { LabelField } from '../../../components/Commons';
import TableComponen from '../../../components/TableComponent';
import useFetch from '../../../hooks/useFetch';

function ReportTransaksi() {
  const [limitView, setLimitView] = React.useState('40');
  const { items, data, totalData, totalPage, totalRows, setPage, page, isLoading, setLimit, limit } = useFetch({
    module: 'get-all-invoice',
  });
  console.log(data);
  const tableHead = [
    {
      id: 'nama',
      label: 'Nama siswa',
    },
    {
      id: 'kelas',
      label: 'Kelas',
    },
    {
      id: 'uang_diterima',
      label: 'Tunai',
      isCurrency: true,
    },
    {
      id: 'invoice',
      label: 'No Invoice',
    },
    {
      id: 'kode_pembayaran',
      label: 'Keterangan',
    },
  ];
  const handleChangeDebounceLimit = debounce((i) => {
    setLimit(i);
  }, 500);
  const inputChangeLimit = React.useMemo(() => handleChangeDebounceLimit, []);
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Box>
          <LabelField
            title="/Page"
            onClickClearIcon={() => {
              setLimit(40);
              setLimitView('');
            }}
            clearIcon={Boolean(limit !== 40)}
          />
          <TextField
            inputProps={{
              min: 1,
              max: 100,
            }}
            size="small"
            type="number"
            placeholder="40"
            value={limitView || ''}
            onChange={(i) => {
              inputChangeLimit(i.target.value);
              setLimitView(i.target.value);
            }}
            sx={{
              width: '100px',
            }}
          />
        </Box>
      </Box>
      <TableComponen
        colorHead="blue"
        count={totalPage}
        pageOnchange={(x, y) => {
          setPage(y);
        }}
        page={page}
        tableBody={items}
        tableHead={tableHead}
        totalRows={totalRows}
        totalData={totalData}
        isLoading={isLoading}
      />
    </Box>
  );
}

export default ReportTransaksi;
