import {
  Box,
  Button,
  Menu,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Typography,
  TextField,
  ListItemText,
} from '@mui/material';

import React from 'react';
import { debounce } from 'lodash';
import SettingsIcon from '@mui/icons-material/Settings';
import { orange } from '@mui/material/colors';

import useFetch from '../../../hooks/useFetch';
import useMutationPatch from '../../../hooks/useMutationPatch';
import TableComponen from '../../../components/TableComponent';
import Create from './Create';
import CreateImport from './CreateImport';
import ScreenDialog from '../../../components/ScreenDialog';

function Pendaftar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorElChild, setAnchorElChild] = React.useState(null);
  const openChild = Boolean(anchorElChild);
  const handleClickChild = (event) => {
    setAnchorElChild(event.currentTarget);
    console.log('HAI', event.currentTarget);
  };
  const handleCloseChild = () => {
    setAnchorEl(null);
    setAnchorElChild(null);
  };

  const [checked, setChecked] = React.useState(null);
  const [openModalCreate, setOpenModalCreate] = React.useState(false);
  const [openModalCreateImport, setOpenModalCreateImport] = React.useState(false);
  const [kelas, setKelas] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [angkatan, setAngkatan] = React.useState('');
  const [jurusan, setJurusan] = React.useState('');
  const [jurusanId, setJurusanId] = React.useState('');
  const [modal, setModal] = React.useState({ type: '', message: [], title: '', open: false });

  const { items, totalPage, setPage, setSearch, page, setLimit, limit, refetch } = useFetch({
    module: `siswa`,
    params: `&angkatan=${angkatan}&jurusanId=${jurusanId}&kelas=${kelas}&status=${status}`,
  });
  const { data } = useFetch({
    module: 'jurusan',
  });
  const { mutationPatch } = useMutationPatch({
    module: 'siswa',
  });
  const { mutationPatch: mutationChangeStatus } = useMutationPatch({
    module: `bulk-siswa-update/${items?.map((item) => item?.id)}`,
    isBulk: true,
    next: (res) => {
      setModal({ type: 'success', open: true, message: res?.data?.message, title: 'List siswa berhasil diupdate' });
    },
    fail: (err) => {
      setModal({
        type: 'error',
        open: true,
        message: err?.response?.data?.message,
        title: 'List siswa gagal diupdate',
      });
    },
  });

  const itemsRebuild = items?.map((i) => ({
    ...i,
    indicator: i?.status?.includes('accepted'),
    nama_jurusan: `${i?.['jurusan.nama']} / ${i?.sub_kelas}`,
  }));
  console.log(itemsRebuild);
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
      id: 'nama_jurusan',
      label: 'Jurusan',
    },
    {
      id: 'angkatan',
      label: 'Angkatan',
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
  };
  const handleAcceptAccount = (i) => {
    mutationPatch.mutate({ ...i, status: 'accepted' });
  };
  const handleHoldAccount = (i) => {
    mutationPatch.mutate({ ...i, status: 'checking' });
  };
  const handleBlockAccount = (i) => {
    mutationPatch.mutate({ ...i, status: 'blokir' });
  };
  const handleBulkChangeStatus = async (selectedStatus) => {
    mutationChangeStatus.mutate({ status: selectedStatus, users: items });
  };
  const handleCLoseModal = () => {
    if (modal.type?.includes('error')) {
      handleCloseChild();
      setModal({ open: false, message: [], title: '', type: '' });
    } else {
      setKelas('');
      setStatus('');
      setAngkatan('');
      setJurusanId('');
      setJurusan('');
      refetch();
      handleCloseChild();
      setModal({ open: false, message: [], title: '', type: '' });
    }
  };

  return (
    <Box>
      <ScreenDialog
        type={modal.type}
        open={modal.open}
        labelClose="Tutup"
        handleClose={handleCLoseModal}
        title={modal.title}
      >
        {modal?.message?.map((item, index) => {
          return (
            <Box key={index}>
              <ListItemText
                primary={
                  <Typography textTransform="capitalize" variant="h5">
                    {item?.nama}
                  </Typography>
                }
                secondary={item?.kode_siswa}
              />
            </Box>
          );
        })}
      </ScreenDialog>
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
              Tambah
            </Button>
          </Box>
          <Box>
            <Button variant="outlined" onClick={() => setOpenModalCreateImport(true)}>
              Import
            </Button>
          </Box>
          {Boolean(jurusanId) && Boolean(kelas) && Boolean(itemsRebuild?.length > 0) && (
            <Box>
              <Button variant="contained" color="warning" onClick={handleClick} startIcon={<SettingsIcon />}>
                Group
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                sx={{
                  '.css-6hp17o-MuiList-root-MuiMenu-list': {
                    bgcolor: orange[50],
                  },
                }}
              >
                <MenuItem onClick={handleClose}>Kenaikan kelas</MenuItem>
                <MenuItem onClick={handleClickChild}>Status</MenuItem>
                <Menu
                  sx={{
                    '.css-6hp17o-MuiList-root-MuiMenu-list': {
                      bgcolor: orange[100],
                    },
                  }}
                  anchorEl={anchorElChild}
                  open={openChild}
                  onClose={handleCloseChild}
                >
                  <MenuItem onClick={() => handleBulkChangeStatus('checking')}>Calon Siswa</MenuItem>
                  <MenuItem onClick={() => handleBulkChangeStatus('accepted')}>SIswa</MenuItem>
                  <MenuItem onClick={() => handleBulkChangeStatus('lock')}>Terkunci</MenuItem>
                  <MenuItem onClick={() => handleBulkChangeStatus('blokir')}>Blokir</MenuItem>
                </Menu>
              </Menu>
            </Box>
          )}
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
              <FormHelperText>Per page</FormHelperText>
              <TextField
                inputProps={{
                  min: 1,
                  max: 100,
                }}
                size="small"
                type="number"
                placeholder="10"
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
