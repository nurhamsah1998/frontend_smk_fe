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

  const itemsRebuild = items?.map((i) => ({ ...i, jurusan: i?.jurusan?.nama }));
  const handleSeeBill = (item) => {
    navigate(`detail-tagihan?student-id=${item?.id}`);
  };

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
      id: 'angkatan',
      label: 'Angkatan',
    },
    {
      id: 'jurusan',
      label: 'Jurusan',
    },
    {
      id: 'kode_siswa',
      label: 'Kode siswa',
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
