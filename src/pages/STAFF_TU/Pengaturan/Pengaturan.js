/* eslint-disable no-return-assign */
import React from 'react';
import { LoadingButton } from '@mui/lab';
import { Box, TextField } from '@mui/material';
import ContainerCard from '../../../components/ContainerCard';
import { PROFILE } from '../../../hooks/useHelperContext';
import useMutationPatch from '../../../hooks/useMutationPatch';

export default function Pengaturan() {
  const {
    itemsNoPagination: { nama, id },
  } = React.useContext(PROFILE);

  const { mutationPatch } = useMutationPatch({
    module: 'staff-profile',
    // next: () => {
    //   setModalPermissions({ isOpen: false, data: [], user_id: '', user_name: '' });
    // },
  });
  const [formValue, setFormValues] = React.useState({
    nama: nama || '',
  });
  const handleSaveName = async () => {
    mutationPatch.mutate({
      id,
      nama: formValue.nama,
    });
  };
  return (
    <ContainerCard>
      <Box>
        <TextField
          onChange={(i) => setFormValues((prev) => ({ ...prev, nama: i.target.value }))}
          value={formValue?.nama}
          label="Nama"
          fullWidth
          size="small"
        />
        <LoadingButton loading={mutationPatch.isLoading} onClick={handleSaveName} variant="contained" sx={{ mt: 2 }}>
          Simpan
        </LoadingButton>
      </Box>
    </ContainerCard>
  );
}
