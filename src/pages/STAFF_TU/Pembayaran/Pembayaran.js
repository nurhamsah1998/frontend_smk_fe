import React from 'react';
import { Box, FormHelperText, TextField } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import DetailTagihanSiswa from './Modal/DetailTagihanSiswa';

function Pembayaran() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPage, setPage, search, setSearch } = useFetch({
    module: 'siswa',
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
  return (
    <Box>
      <Box sx={{ display: location.pathname?.includes('/detail-tagihan') ? 'none' : 'grid' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'grid' }}>
            <FormHelperText>Masukan nama siswa / kode siswa</FormHelperText>
            <TextField value={search} onChange={(i) => setSearch(i.target.value)} size="small" />
          </Box>
        </Box>
        <Box>
          <TableComponen
            hideOption
            colorHead="blue"
            count={totalPage}
            pageOnchange={(x, y) => {
              setPage(y - 1);
            }}
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
