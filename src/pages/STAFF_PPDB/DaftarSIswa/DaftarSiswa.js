import { Box, Button, Menu, MenuItem, Select, Typography, TextField, ListItemText } from '@mui/material';

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
import KenaikanKelas from './KenaikanKelas';
import { LabelField } from '../../../components/Commons';

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
  };
  const handleCloseChild = () => {
    setAnchorEl(null);
    setAnchorElChild(null);
  };

  const [checked, setChecked] = React.useState(null);
  const [openModalCreate, setOpenModalCreate] = React.useState(false);
  const [openModalCreateImport, setOpenModalCreateImport] = React.useState(false);
  const [openModalKenaikanKelas, setOpenModalKenaikanKelas] = React.useState(false);
  const [kelas, setKelas] = React.useState('');
  const [subKelas, setSubKelasKelas] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [angkatan, setAngkatan] = React.useState('');
  const [jurusan, setJurusan] = React.useState('');
  const [jurusanId, setJurusanId] = React.useState('');
  const [inputView, setInputView] = React.useState('');
  const [limitView, setLimitView] = React.useState('40');
  const [listSiswaKelasManagement, setListSiswaKelasManagement] = React.useState([]);
  const [modal, setModal] = React.useState({ type: '', message: [], title: '', open: false });

  const {
    items,
    totalPage,
    setPage,
    setSearch,
    page,
    setLimit,
    limit,
    refetch,
    search,
    totalRows,
    totalData,
    isLoading,
  } = useFetch({
    module: `siswa`,
    params: `&angkatan=${angkatan}&jurusanId=${jurusanId}&kelas=${kelas}&status=${status}&sub_kelas=${subKelas}`,
    enabled: true,
  });
  const { data } = useFetch({
    module: 'jurusan',
  });
  const { mutationPatch, isIdle } = useMutationPatch({
    module: 'siswa',
  });
  const { mutationPatch: mutationChangeStatus } = useMutationPatch({
    module: `bulk-siswa-update/${items?.map((item) => item?.id)}`,
    isBulk: true,
    next: (res) => {
      setSubKelasKelas('');
      setModal({ type: 'success', open: true, message: res?.data?.message, title: 'List siswa berhasil diupdate' });
      refetch();
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

  const itemsRebuild = React.useMemo(() => {
    return items?.map((i) => ({
      ...i,
      indicator: i?.status?.includes('accepted'),
      kelas: `${i?.kelas} ${i?.['jurusan.kode_jurusan']} ${i?.sub_kelas}`,
    }));
  }, [items]);
  const handleChange = (event) => {
    setPage(1);
    setKelas(event.target.value);
  };
  const handleChangeSubKelas = (event) => {
    setPage(1);
    setSubKelasKelas(event.target.value);
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
    mutationPatch.mutate({ id: i?.id, status: 'lock' });
  };
  const handleAcceptAccount = (i) => {
    mutationPatch.mutate({ id: i?.id, status: 'accepted' });
  };
  const handleHoldAccount = (i) => {
    mutationPatch.mutate({ id: i?.id, status: 'checking' });
  };
  const handleBlockAccount = (i) => {
    mutationPatch.mutate({ id: i?.id, status: 'blokir' });
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
  const handleChangeDebounce = debounce((i) => {
    setSearch(i);
  }, 500);
  const handleChangeDebounceLimit = debounce((i) => {
    setLimit(i);
  }, 500);
  const inputChange = React.useMemo(() => handleChangeDebounce, []);
  const inputChangeLimit = React.useMemo(() => handleChangeDebounceLimit, []);
  return (
    <Box>
      <KenaikanKelas
        listJurusan={data}
        jurusanId={jurusanId}
        kelas={kelas}
        item={itemsRebuild}
        subKelas={subKelas}
        jurusan={jurusan}
        refetch={refetch}
        handleCloseMenuGroub={handleClose}
        openModalKenaikanKelas={openModalKenaikanKelas}
        setOpenModalKenaikanKelas={setOpenModalKenaikanKelas}
        listSiswaKelasManagement={listSiswaKelasManagement}
        setListSiswaKelasManagement={setListSiswaKelasManagement}
      />
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
      <CreateImport
        refetch={refetch}
        openModalCreateImport={openModalCreateImport}
        setOpenModalCreateImport={setOpenModalCreateImport}
      />
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
                {Boolean(subKelas) && Boolean(limit) && (
                  <MenuItem
                    onClick={() => {
                      setOpenModalKenaikanKelas(true);
                      setListSiswaKelasManagement(itemsRebuild);
                    }}
                  >
                    Management kelas
                  </MenuItem>
                )}
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
              <LabelField
                title="Cari siswa / Kode siswa / Username"
                onClickClearIcon={() => {
                  setSearch('');
                  setInputView('');
                }}
                clearIcon={Boolean(search)}
              />
              <TextField
                fullWidth
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
                title="Sort Jurusan"
                clearIcon={Boolean(jurusan)}
                onClickClearIcon={() => {
                  setJurusanId('');
                  setJurusan('');
                }}
              />
              <Select
                sx={{
                  minWidth: '270px',
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
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 0.5,
            }}
          >
            <Box>
              <LabelField title="Sort Kelas" onClickClearIcon={() => setKelas('')} clearIcon={Boolean(kelas)} />
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
                <MenuItem value={'10'}>10</MenuItem>
                <MenuItem value={'11'}>11</MenuItem>
                <MenuItem value={'12'}>12</MenuItem>
              </Select>
            </Box>
            <Box>
              <LabelField
                title="Sort Sub Kelas"
                onClickClearIcon={() => setSubKelasKelas('')}
                clearIcon={Boolean(subKelas)}
              />

              <Select
                sx={{
                  minWidth: '130px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subKelas}
                size="small"
                onChange={handleChangeSubKelas}
              >
                <MenuItem value={'1'}>1</MenuItem>
                <MenuItem value={'2'}>2</MenuItem>
                <MenuItem value={'3'}>3</MenuItem>
                <MenuItem value={'4'}>4</MenuItem>
                <MenuItem value={'5'}>5</MenuItem>
                <MenuItem value={'6'}>6</MenuItem>
              </Select>
            </Box>

            <Box>
              <LabelField
                title="Sort Angkatan"
                clearIcon={Boolean(angkatan)}
                onClickClearIcon={() => setAngkatan('')}
              />
              <Select
                sx={{
                  minWidth: '130px',
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
              <LabelField title="Sort Status" clearIcon={Boolean(status)} onClickClearIcon={() => setStatus('')} />
              <Select
                sx={{
                  minWidth: '150px',
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
          totalRows={
            Boolean(jurusanId) ||
            Boolean(kelas) ||
            Boolean(subKelas) ||
            Boolean(angkatan) ||
            Boolean(status) ||
            Boolean(search)
              ? totalRows
              : null
          }
          isLoading={isLoading}
          totalData={totalData}
        />
      </Box>
    </Box>
  );
}

export default Pendaftar;
