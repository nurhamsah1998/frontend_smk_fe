import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Typography,
  TextField,
} from '@mui/material';

import React from 'react';
import { debounce } from 'lodash';

import useFetch from '../../../hooks/useFetch';
import useMutationPatch from '../../../hooks/useMutationPatch';
import TableComponen from '../../../components/TableComponent';
import Create from './Create';
import CreateImport from './CreateImport';

function Pendaftar() {
  const [checked, setChecked] = React.useState(null);
  const [openModalCreate, setOpenModalCreate] = React.useState(false);
  const [openModalCreateImport, setOpenModalCreateImport] = React.useState(false);
  const [kelas, setKelas] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [angkatan, setAngkatan] = React.useState('');
  const [jurusan, setJurusan] = React.useState('');
  const [jurusanId, setJurusanId] = React.useState('');

  const { items, totalPage, setPage, setSearch, page, setLimit } = useFetch({
    module: `siswa`,
    params: `&angkatan=${angkatan}&jurusanId=${jurusanId}&kelas=${kelas}&status=${status}`,
  });
  const { data } = useFetch({
    module: 'jurusan',
  });
  const { mutationPatch } = useMutationPatch({
    module: 'siswa',
  });
  const itemsRebuild = items?.map((i) => ({
    ...i,
    indicator: i?.status?.includes('accepted'),
    nama_jurusan: i?.jurusan?.nama,
  }));
  const handleChange = (event) => {
    setKelas(event.target.value);
  };
  const handleChangesJurusan = (event, value) => {
    setPage(1);
    setJurusan(String(event.target.value));
  };
  const handleChangeAngkatan = (event) => {
    setPage(1);
    setAngkatan(String(event.target.value));
  };
  const handleChangeStatus = (event) => {
    setPage(1);
    setStatus(String(event.target.value));
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
      id: 'jurusan.nama',
      label: 'Jurusan',
    },
    {
      id: 'angkatan',
      label: 'Angkatan',
    },
    {
      id: 'username',
      label: 'Username',
    },
    {
      id: 'status',
      label: 'Status',
      variantStatusColor: [
        {
          variant: 'success',
          label: 'Siswa',
          value: 'accepted',
        },
        {
          variant: 'error',
          label: 'Blokir',
          value: 'blokir',
        },
        {
          variant: 'warning',
          label: 'Terkunci',
          value: 'lock',
        },
        {
          variant: 'grey',
          label: 'Calon siswa',
          value: 'checking',
        },
      ],
    },
  ];
  const handleLockAccount = (i) => {
    mutationPatch.mutate({ ...i, status: 'lock' });
    console.log(i);
  };
  const handleAcceptAccount = (i) => {
    mutationPatch.mutate({ ...i, status: 'accepted' });
    console.log(i);
  };
  const handleHoldAccount = (i) => {
    mutationPatch.mutate({ ...i, status: 'checking' });
    console.log(i);
  };
  const handleBlockAccount = (i) => {
    mutationPatch.mutate({ ...i, status: 'blokir' });
    console.log(i);
  };
  return (
    <Box>
      <CreateImport openModalCreateImport={openModalCreateImport} setOpenModalCreateImport={setOpenModalCreateImport} />
      <Create openModalCreate={openModalCreate} setOpenModalCreate={setOpenModalCreate} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Box>
            <Button variant="contained" onClick={() => setOpenModalCreate(true)}>
              Tambah siswa baru
            </Button>
          </Box>
          <Box>
            <Button variant="outlined" onClick={() => setOpenModalCreateImport(true)}>
              Tambah siswa secara masal
            </Button>
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box width="100%">
              <FormHelperText>Cari siswa / Kode siswa / Username</FormHelperText>
              <TextField
                fullWidth
                onChangeCapture={debounce((e) => {
                  setSearch(e.target.value);
                }, 500)}
                size="small"
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
            }}
          >
            <Box>
              <FormHelperText>Sort Kelas</FormHelperText>
              <Select
                sx={{
                  minWidth: '100px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={kelas}
                size="small"
                onChange={handleChange}
              >
                <MenuItem value={'01'}>1</MenuItem>
                <MenuItem value={'02'}>2</MenuItem>
                <MenuItem value={'03'}>3</MenuItem>
              </Select>
            </Box>
            <Box>
              <FormHelperText>Sort Jurusan</FormHelperText>
              <Select
                sx={{
                  minWidth: '100px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={jurusan || ''}
                size="small"
                onChange={handleChangesJurusan}
              >
                {data?.data?.map((item, index) => (
                  <MenuItem key={index} onClick={() => setJurusanId(item?.id)} value={item?.nama}>
                    {item?.nama}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <FormHelperText>Sort Angkatan</FormHelperText>
              <Select
                sx={{
                  minWidth: '100px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={angkatan || ''}
                size="small"
                onChange={handleChangeAngkatan}
              >
                <MenuItem value={2021}>2021</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
                <MenuItem value={2023}>2023</MenuItem>
              </Select>
            </Box>
            <Box>
              <FormHelperText>Sort Status</FormHelperText>
              <Select
                sx={{
                  minWidth: '100px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status || ''}
                size="small"
                onChange={handleChangeStatus}
              >
                <MenuItem value={'checking'}>Calon siswa</MenuItem>
                <MenuItem value={'accepted'}>Siswa</MenuItem>
                <MenuItem value={'lock'}>Terkunci</MenuItem>
                <MenuItem value={'blokir'}>Terblokir</MenuItem>
              </Select>
            </Box>
            <Box>
              <FormHelperText>Sort Status</FormHelperText>
              <TextField
                inputProps={{
                  min: 1,
                  max: 100,
                }}
                size="small"
                type="number"
                onChange={debounce((i) => {
                  setLimit(i.target.value);
                }, 500)}
                sx={{
                  width: '100px',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <TableComponen
          checked={checked}
          handleAccount
          handleLockAccount={handleLockAccount}
          handleAcceptAccount={handleAcceptAccount}
          handleHoldAccount={handleHoldAccount}
          handleBlockAccount={handleBlockAccount}
          setChecked={setChecked}
          count={totalPage}
          pageOnchange={(x, y) => {
            setPage(y);
          }}
          page={page}
          tableBody={itemsRebuild}
          tableHead={tableHead}
        />
      </Box>
    </Box>
  );
}

export default Pendaftar;
