import React from 'react';
import { Box, FormHelperText, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import DetailTagihanSiswa from './DetailTagihanSiswa';
import useFetchById from '../../../hooks/useFetchById';

function Pembayaran() {
  const navigate = useNavigate();

  const { items, totalPage, setPage, search, setSearch } = useFetch({
    module: 'siswa',
  });
  const { items: data } = useFetchById({
    module: 'siswa',
    queryParam: 'open-student-bill-id',
  });
  console.log(data);

  const itemsRebuild = items?.map((i) => ({ ...i, jurusan: i?.jurusan?.nama }));
  const handleSeeBill = (item) => {
    navigate(`?open-student-bill-id=${item.id}`);
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
    <Box sx={{ display: 'grid' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'grid' }}>
          <TextField value={search} onChange={(i) => setSearch(i.target.value)} size="small" label="Kode siswa" />
          <FormHelperText>Masukan kode siswa</FormHelperText>
        </Box>
      </Box>
      <Box>
        <TableComponen
          count={totalPage}
          pageOnchange={(x, y) => {
            setPage(y - 1);
          }}
          handleSeeBill={handleSeeBill}
          tableBody={itemsRebuild}
          tableHead={tableHead}
        />
      </Box>
      <DetailTagihanSiswa />
    </Box>
  );
}

export default Pembayaran;
