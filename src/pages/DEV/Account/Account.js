/* eslint-disable array-callback-return */
/* eslint-disable no-extra-boolean-cast */
import { Box, TextField, Typography, Checkbox } from '@mui/material';
import { debounce } from 'lodash';
import React from 'react';
import moment from 'moment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { blue, green, grey, red } from '@mui/material/colors';
import TableComponen from '../../../components/TableComponent';
import { LabelField } from '../../../components/Commons';
import useMutationPatch from '../../../hooks/useMutationPatch';
import ScreenDialog from '../../../components/ScreenDialog';
import { themeAppColors } from '../../../theme/themeAppColor';
import useQueryFetch from '../../../hooks/useQueryFetch';

function Account() {
  const [inputView, setInputView] = React.useState('');
  const [modalPermissions, setModalPermissions] = React.useState({
    isOpen: false,
    data: [],
    user_id: '',
    user_name: '',
  });
  const { items, totalPage, setPage, setSearch, page, search, totalRows, totalData, isLoading } = useQueryFetch({
    module: `staff`,
    invalidateKey: 'staff',
  });
  const permissions = [
    {
      title: 'Daftar Siswa',
      permission: false,
      desc: 'Hak admin untuk bisa mengakses halaman "Daftar Siswa". Akses ini mencakup menambah siswa baru secara manual, menambah siswa dengan upload file, mengedit profile siswa, perubahan status siswa dan configurasi kelas siswa.',
      name: 'daftar_siswa',
    },
    {
      title: 'Tagihan',
      permission: false,
      desc: 'Hak admin untuk bisa mengakses halaman "Tagihan". Admin bisa melakukan penambahan tahun ajaran untuk tagihan dan mengedit tagihan.',
      name: 'tagihan',
    },
    {
      title: 'Pembayaran',
      permission: false,
      desc: `Hak Admin untuk bisa mengakses halaman "Pembayaran". Akses ini mencakup list tagihan siswa dan download file laporan tagihan.`,
      name: 'pembayaran',
    },
    {
      title: 'Transaksi Masuk',
      permission: false,
      desc: 'Hak Admin untuk melakukan transaksi siswa. fitur ini hanya bisa digunakan dengan mengaktifkan akses "Pembayaran" terlebih dahulu.',
      name: 'transaksi_masuk',
    },
    {
      title: 'Transaksi Keluar',
      permission: false,
      desc: 'Hak Admin untuk melakukan transaksi keluar. fitur ini hanya bisa digunakan dengan mengaktifkan akses "Pembayaran" terlebih dahulu.',
      name: 'transaksi_keluar',
    },
    {
      title: 'Laporan Transaksi Masuk',
      permission: false,
      desc: 'Hak Admin untuk mengakses "Laporan Transaksi Masuk" dan juga download laporan.',
      name: 'laporan_transaksi_masuk',
    },
    {
      title: 'Laporan Transaksi Keluar',
      permission: false,
      desc: 'Hak Admin untuk mengakses "Laporan Transaksi Keluar" dan juga download laporan.',
      name: 'laporan_transaksi_keluar',
    },
    {
      title: 'Surat Tagihan Siswa',
      permission: false,
      desc: 'Hak Admin untuk melakukan proses pembuatan surat tagihan. fitur ini hanya bisa digunakan dengan mengaktifkan akses "Pembayaran".',
      name: 'student_bill_letter',
    },
    {
      title: 'Pengumuman',
      permission: false,
      desc: 'Hak Admin untuk mengakses halaman Pengumuman, baik membuat, mengedit dan menghapus pengumuman',
      name: 'pengumuman',
    },
  ];
  const itemsRebuild = React.useMemo(
    () =>
      items?.map((item) => ({
        ...item,
        createdAt: moment(item?.createdAt).format('DD MMM YYYY H:mm'),
        role: (
          <Typography
            sx={{
              bgcolor: item?.role === 'ANONIM' ? red[100] : green[100],
              px: 1.5,
              borderRadius: '9px',
              textAlign: 'center',
              fontSize: '13px',
              color: item?.role === 'ANONIM' ? red[700] : green[700],
            }}
          >
            {item?.role === 'ANONIM' ? 'Tidak Aktif' : 'Aktif'}
          </Typography>
        ),
      })),
    [items]
  );
  const { mutationPatch } = useMutationPatch({
    module: 'staff',
    next: () => {
      setModalPermissions({ isOpen: false, data: [], user_id: '', user_name: '' });
    },
  });
  const handleChangeDebounce = debounce((i) => {
    setSearch(i);
  }, 500);
  const inputChange = React.useMemo(() => handleChangeDebounce, []);
  const tableHead = [
    {
      id: 'nama',
      label: 'Nama',
    },
    {
      id: 'username',
      label: 'Username',
    },
    {
      id: 'role',
      label: 'Status',
    },
    {
      id: 'createdAt',
      label: 'Tanggal register',
    },
  ];
  const handleAcceptAccount = (i) => {
    mutationPatch.mutate({ id: i?.id, role: 'ADMINISTRASI' });
  };
  const handleHoldAccount = (i) => {
    mutationPatch.mutate({ id: i?.id, role: 'ANONIM' });
  };
  const handleCustomOnClickRow = (i) => {
    // eslint-disable-next-line prefer-const
    let clonePermissions = [...permissions];
    // eslint-disable-next-line prefer-const
    let permissionsUser = typeof i?.permissions === 'string' ? JSON.parse(i?.permissions) : i?.permissions;
    for (let index = 0; index < clonePermissions.length; index += 1) {
      for (let Pindex = 0; Pindex < permissionsUser.length; Pindex += 1) {
        if (clonePermissions[index].name === permissionsUser[Pindex]) clonePermissions[index].permission = true;
      }
    }
    setModalPermissions({ isOpen: true, data: clonePermissions, user_id: i?.id, user_name: i?.nama });
  };
  const handleSubmitPermissions = () => {
    const data = modalPermissions.data?.filter((item) => item.permission)?.map((item) => item.name);
    mutationPatch.mutate({
      id: modalPermissions.user_id,
      permissions: data,
    });
  };
  const handleChangeCheckbox = (i, c) => {
    // eslint-disable-next-line arrow-body-style
    setModalPermissions((prev) => {
      // eslint-disable-next-line prefer-const
      let data = [...prev.data];
      for (let index = 0; index < data.length; index += 1) {
        if (data[index]?.name === i?.name) {
          data[index].permission = c;
        }
      }
      return { ...prev, data };
    });
  };
  return (
    <Box>
      <ScreenDialog
        handleSubmit={handleSubmitPermissions}
        open={modalPermissions.isOpen}
        handleClose={() => setModalPermissions({ isOpen: false, data: [], user_id: '', user_name: '' })}
        labelClose="Tutup"
        isLoading={modalPermissions.isLoading}
        labelSubmit="Simpan"
        title={`Hak Akses ${modalPermissions?.user_name}`}
      >
        <Box display="grid" gap={1}>
          {modalPermissions.data.map((item, index) => (
            <Box
              bgcolor={themeAppColors.light}
              display="flex"
              width="100%"
              justifyContent="space-between"
              alignItems="flex-start"
              gap={3}
              key={index}
              padding={2.5}
            >
              <Box maxWidth={{ xs: '80%', sm: '80%', md: '70%', lg: '70%' }}>
                <Typography color={themeAppColors.dark} variant="h6">
                  {item.title}
                </Typography>
                <Typography variant="subtitle2" lineHeight={1} fontWeight={400} color={grey[600]} mt={-0.5}>
                  {item.desc}
                </Typography>
              </Box>
              <Checkbox onChange={(e, i) => handleChangeCheckbox(item, i)} checked={item.permission} />
            </Box>
          ))}
        </Box>
      </ScreenDialog>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'end',
          mb: 2,
        }}
      >
        <Box>
          <LabelField
            title="Cari nama / username"
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
      </Box>
      <TableComponen
        colorHead="cyan"
        handleAccount
        handleAcceptAccount={handleAcceptAccount}
        handleHoldAccount={handleHoldAccount}
        disabledBlokir
        disabledLock
        tooltipCustom="Hak Akses"
        count={totalPage}
        pageOnchange={(x, y) => {
          setPage(y);
        }}
        page={page}
        tableBody={itemsRebuild}
        tableHead={tableHead}
        totalRows={Boolean(search) ? totalRows : null}
        emptyTag={Boolean(search) ? `( tidak bisa menemukan "${search}")` : '( sepertinya tidak ada akun )'}
        handleCustomOnClickRow={handleCustomOnClickRow}
        customIcon={<AssignmentIcon sx={{ color: blue[500] }} />}
        isLoading={isLoading}
        totalData={totalData}
      />
    </Box>
  );
}

export default Account;
