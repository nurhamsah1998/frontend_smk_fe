import { Box, TextField, Typography } from '@mui/material';
import { debounce } from 'lodash';
import React from 'react';
import moment from 'moment';
import { green, red } from '@mui/material/colors';

import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import { LabelField } from '../../../components/Commons';
import useMutationPatch from '../../../hooks/useMutationPatch';

function Account() {
  const [inputView, setInputView] = React.useState('');
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
    module: `staff`,
    enabled: true,
  });
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
  return (
    <Box>
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
        count={totalPage}
        pageOnchange={(x, y) => {
          setPage(y);
        }}
        page={page}
        tableBody={itemsRebuild}
        tableHead={tableHead}
        totalRows={Boolean(search) ? totalRows : null}
        emptyTag={Boolean(search) ? `( tidak bisa menemukan "${search}")` : '( sepertinya tidak ada akun )'}
        isLoading={isLoading}
        totalData={totalData}
      />
    </Box>
  );
}

export default Account;
