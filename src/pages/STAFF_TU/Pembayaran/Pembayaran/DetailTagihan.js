import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import TableComponen from '../../../../components/TableComponent';
import useFetchById from '../../../../hooks/useFetchById';
import useFetch from '../../../../hooks/useFetch';

function DetailTagihan() {
  const navigate = useNavigate();
  const location = useLocation();
  const idCode = queryString.parse(location.search);
  const { items: studentProfile } = useFetchById({
    module: 'siswa',
    idCode: `${idCode['student-id']}`,
  });
  const { itemsNoPagination, data } = useFetch({
    module: `tagihan-permanent-siswa?tahun_angkatan=${studentProfile?.angkatan}`,
  });
  const dataTextField = itemsNoPagination?.map((x) => {
    delete x?.id;
    delete x?.updatedAt;
    delete x?.createdAt;
    delete x?.tahun_angkatan;

    return Object.entries(x);
  });
  const itemsRebuild = dataTextField
    ?.map((i) => i?.map((o) => ({ name: o[0], value: o[1] })))[0]
    ?.filter((y) => y?.value !== 0);
  const tableHead = [
    {
      id: 'name',
      label: 'Nama tagihan',
    },
    {
      id: 'value',
      label: 'Jumlah',
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
        <TableComponen hideOption tableHead={tableHead} disablePagination colorHead="blue" tableBody={itemsRebuild} />
      </Box>
    </Box>
  );
}

export default DetailTagihan;
