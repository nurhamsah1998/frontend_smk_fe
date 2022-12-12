import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import TableComponen from '../../../../components/TableComponent';
import useFetchById from '../../../../hooks/useFetchById';

function DetailTagihan() {
  const navigate = useNavigate();
  const location = useLocation();
  const idCode = queryString.parse(location.search);
  const { items: studentProfile } = useFetchById({
    module: 'siswa',
    idCode: `${idCode['student-id']}`,
  });
  const { items, refetch } = useFetchById({
    module: 'tagihan',
    /// get tagihan by kode_siswa
    idCode: `${studentProfile?.angkatan}${studentProfile?.jurusan?.nama}${studentProfile?.kelas}?kode_tagihan=${
      /// this for get invoice from backend to compare with tagihan
      studentProfile?.kode_siswa
    }`,
  });
  console.log(studentProfile);
  const tableHead = [
    {
      id: 'nama',
      label: 'Nama tagihan',
    },
    {
      id: 'total',
      label: 'Jumlah',
      isCurrency: true,
    },
  ];

  const detailSiswa = [
    {
      value: studentProfile?.nama,
      label: 'Nama siswa',
    },
    {
      value: studentProfile?.jurusan?.nama,
      label: 'Jurusan',
    },
    {
      value: studentProfile?.kelas,
      label: 'Kelas',
    },
    {
      value: studentProfile?.noHP,
      label: 'Nomor Hp',
    },
  ];
  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box>
        <Typography variant="h5">Profile Siswa</Typography>
        <Box>
          {detailSiswa.map((x, y) => (
            <Box key={y} sx={{ display: 'flex' }}>
              <Typography sx={{ width: '120px' }}>{x?.label}</Typography>:
              <Typography variant="subtitle2" ml={1}>
                {x?.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box>
        <Typography variant="h5">Tagihan Siswa</Typography>
        <TableComponen hideOption tableHead={tableHead} disablePagination colorHead="blue" tableBody={items} />
      </Box>
    </Box>
  );
}

export default DetailTagihan;
