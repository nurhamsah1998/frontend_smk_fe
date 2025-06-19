/* eslint-disable no-return-assign */
import React from 'react';
import { LoadingButton } from '@mui/lab';
import { Box, TextField } from '@mui/material';
import ContainerCard from '../../../components/ContainerCard';
import { PROFILE } from '../../../hooks/useHelperContext';
import useMutationPatch from '../../../hooks/useMutationPatch';

export default function Pengaturan() {
  const {
    itemsNoPagination: { nama, id, noHP, username },
  } = React.useContext(PROFILE);

  const { mutationPatch } = useMutationPatch({
    module: 'staff-profile',
    // next: () => {
    //   setModalPermissions({ isOpen: false, data: [], user_id: '', user_name: '' });
    // },
  });
  const [formValue, setFormValues] = React.useState({
    nama: nama || '',
    noHP: noHP || '',
    username: username || '',
  });
  const handleSaveName = async () => {
    mutationPatch.mutate({
      id,
      nama: formValue.nama,
      username: formValue.username,
      noHP: formValue.noHP,
    });
  };
  return (
    <ContainerCard>
      <Box>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField
            onChange={(i) => setFormValues((prev) => ({ ...prev, nama: i.target.value }))}
            value={formValue?.nama}
            label="Nama"
            fullWidth
            size="small"
          />
          <TextField
            onChange={(i) => setFormValues((prev) => ({ ...prev, noHP: i.target.value }))}
            value={formValue?.noHP}
            label="No HP"
            type="number"
            fullWidth
            size="small"
          />
          <TextField
            onChange={(i) => setFormValues((prev) => ({ ...prev, username: i.target.value }))}
            value={formValue?.username}
            label="Username / Email"
            fullWidth
            size="small"
          />
        </Box>
        <LoadingButton loading={mutationPatch.isLoading} onClick={handleSaveName} variant="contained" sx={{ mt: 2 }}>
          Simpan
        </LoadingButton>
      </Box>
    </ContainerCard>
  );
}
