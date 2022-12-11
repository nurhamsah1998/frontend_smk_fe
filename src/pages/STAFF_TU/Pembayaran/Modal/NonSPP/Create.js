import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { Box, FormHelperText, TextField } from '@mui/material';
import ScreenDialog from '../../../../../components/ScreenDialog';
import useMutationPost from '../../../../../hooks/useMutationPost';
import TextFieldNumberFormat from '../../../../../components/TextFieldNumberFormat';
import formatNumberChange from '../../../../../components/formatNumberChange';

function Create({ openModalTransaction, setOpenModalTransaction, TableBill, item, studentProfile, refetch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(null);
  const [note, setNote] = React.useState('');
  const { mutationPost } = useMutationPost({
    module: 'invoice',
    next: () => {
      setOpenModalTransaction(false);
      refetch();
      setValue(0);
      setNote('');
    },
  });
  const handleSubmit = () => {
    const localToken = window.localStorage.getItem('accessToken');
    const token = jwtDecode(localToken || '');

    const body = {
      nama: studentProfile?.nama,
      total: Number(item?.total),
      kode_tagihan: studentProfile?.kode_siswa,
      kode_pembayaran: item?.token_tagihan,
      note,
      uang_diterima: formatNumberChange(value),
      petugas: token?.namaStaff,
    };
    mutationPost.mutate(body);
  };
  return (
    <ScreenDialog
      open={openModalTransaction}
      title="Transaksi"
      handleClose={() => setOpenModalTransaction(false)}
      labelClose="batal"
      handleSubmit={handleSubmit}
      labelSubmit="bayar"
    >
      <Box sx={{ mt: -2 }}>
        <TableBill />
        <TextField value={note} onChange={(i) => setNote(i?.target.value)} label="Catatan" sx={{ mt: 3 }} fullWidth />
        <TextFieldNumberFormat
          value={value}
          onChange={(i) => setValue(i?.target.value)}
          label="Uang diterima"
          sx={{ mt: 2 }}
          fullWidth
        />

        <FormHelperText>
          Masukkan nominal uang. jumlah uang yang dimasukan nanti akan secara otomatis menyesuaikan dengan total
          tagihan.
        </FormHelperText>
      </Box>
    </ScreenDialog>
  );
}

export default Create;
