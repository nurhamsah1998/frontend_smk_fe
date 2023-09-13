import React, { useMemo, useRef, useState } from 'react';
import { Box, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { debounce } from 'lodash';

import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import DetailTagihanSiswa from './Modal/DetailTagihanSiswa';
import { LabelField } from '../../STAFF_PPDB/DaftarSIswa/DaftarSiswa';

function Pembayaran() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bill, setBill] = useState('');
  const [inputView, setInputView] = useState('');
  const { items, totalPage, setPage, search, setSearch, page } = useFetch({
    module: `siswa`,
    params: `&current_bill=${bill}`,
  });
  const itemsRebuild = items?.map((i) => ({
    ...i,
    jurusan: i?.jurusan?.nama,
    status_bill:
      i?.current_bill < 0
        ? 'deposit'
        : i?.current_bill > 0
        ? 'not_paid'
        : i?.status_bill?.includes('not_paid_yet')
        ? 'not_paid_yet'
        : 'paid',
  }));
  const handleSeeBill = (item) => {
    navigate(`detail-tagihan?student-id=${item?.id}`);
  };
  const tableHead = [
    {
      id: 'nama',
      label: 'Nama siswa',
    },
    {
      id: 'gender',
      label: 'Gender',
    },
    {
      id: 'kelas',
      label: 'Kelas',
    },
    {
      id: 'angkatan',
      label: 'Angkatan',
    },
    {
      id: 'jurusan.nama',
      label: 'Jurusan',
    },
    {
      id: 'status_bill',
      label: 'Status',
      variantStatusColor: [
        {
          variant: 'success',
          label: 'Lunas',
          value: 'paid',
        },
        {
          variant: 'error',
          label: 'Belum Lunas',
          value: 'not_paid',
        },
        {
          variant: 'grey',
          label: 'Belum Ada Tagihan',
          value: 'not_paid_yet',
        },
        {
          variant: 'warning',
          label: 'Deposit',
          value: 'deposit',
        },
      ],
    },
    {
      id: 'current_bill',
      label: 'Kekurangan',
      isCurrency: true,
    },
  ];
  const handleChangeStatusTagihan = (i) => {
    setPage(1);
    setBill(i.target.value);
  };
  const handleChangeDebounce = debounce((i) => {
    setSearch(i);
  }, 500);
  const inputChange = useMemo(() => handleChangeDebounce, []);
  return (
    <Box>
      <Box sx={{ display: location.pathname?.includes('/detail-tagihan') ? 'none' : 'grid' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'grid' }}>
              <LabelField
                clearIcon={Boolean(search)}
                onClickClearIcon={() => {
                  setSearch('');
                  setInputView('');
                }}
                title="Masukan nama siswa / kode siswa"
              />
              <TextField
                value={inputView}
                onChange={(i) => {
                  inputChange(i.target.value);
                  setInputView(i.target.value);
                }}
                size="small"
              />
            </Box>
            <Box>
              <LabelField
                clearIcon={Boolean(bill)}
                onClickClearIcon={() => {
                  setBill('');
                }}
                title="Sort Status Pembayaran"
              />
              <Select
                sx={{
                  minWidth: '200px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={bill || ''}
                size="small"
                onChange={handleChangeStatusTagihan}
              >
                <MenuItem value={'paid'}>Lunas</MenuItem>
                <MenuItem value={'not_paid'}>Belum Lunas</MenuItem>
                <MenuItem value={'deposit'}>Deposit</MenuItem>
                <MenuItem value={'not_paid_yet'}>Belum Ada Tagihan</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>
        <Box>
          <TableComponen
            hideOption
            colorHead="blue"
            count={totalPage}
            pageOnchange={(x, y) => {
              setPage(y);
            }}
            page={page}
            handleSeeBill={handleSeeBill}
            tableBody={itemsRebuild}
            tableHead={tableHead}
          />
        </Box>
      </Box>
      <DetailTagihanSiswa />
      <Outlet />
    </Box>
  );
}

export default Pembayaran;
