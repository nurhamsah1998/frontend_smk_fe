/* eslint-disable import/no-unresolved */
import { Alert, Box, IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import Iconify from 'src/components/iconify';
import ScreenDialog from 'src/components/ScreenDialog';
import useMutationPatch from 'src/hooks/useMutationPatch';
import useMutationPost from 'src/hooks/useMutationPost';
import Typography from 'src/theme/overrides/Typography';

function CreateAccount({ openModal, setOpenModal, refetch }) {
  const [formValue, setFormValue] = useState({ nama: '', username: '', id: '', password: '', noHP: '' });

  //   const { mutationPatch, isLoading: isLoadingPatch } = useMutationPatch({
  //     module: 'staff',
  //     next: () => {
  //       setOpenModal({ isOpen: false, type: '' });
  //       setFormValue({ nama: '', username: '', id: '', password: '', noHP:"" });
  //     },
  //     fail: () => {
  //       setOpenModal({ isOpen: false, type: '' });
  //       setFormValue({ nama: '', username: '', id: '', password: '', noHP:"" });
  //     },
  //   });

  const mutationPost = useMutationPost({
    module: 'staff-register',
    next: () => {
      setOpenModal({ isOpen: false, type: '' });
      setFormValue({ nama: '', username: '', id: '', password: '', noHP: '' });
      refetch();
    },
    fail: () => {
      setOpenModal({ isOpen: false, type: '' });
      setFormValue({ nama: '', username: '', id: '', password: '', noHP: '' });
    },
  });

  const handleSubmitAccount = () => {
    if (openModal.type === 'Edit') {
      //   mutationPatch.mutate({
      //     id: formValue?.id,
      //     nama: formValue?.nama,
      //     username: formValue?.username,
      //   });
      console.log('edit');
    } else if (openModal.type === 'Buat') {
      mutationPost.mutate({
        nama: formValue?.nama,
        username: formValue?.username,
        password: formValue?.password,
        noHP: formValue.noHP,
      });
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <ScreenDialog
      handleSubmit={handleSubmitAccount}
      open={openModal.isOpen}
      handleClose={() => setOpenModal({ isOpen: false, type: '' })}
      labelClose="Tutup"
      isLoading={mutationPost.isLoading}
      labelSubmit={openModal.type === 'Buat' ? 'Buat' : openModal.type === 'Hapus' ? 'Hapus' : 'Simpan'}
      title={`${openModal.type} Akun Staff`}
    >
      {openModal.type === 'Hapus' && <Typography>Apakah anda yakin ingin menghapus {formValue?.nama}</Typography>}
      {(openModal.type === 'Edit' || openModal.type === 'Buat') && (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField
            size="small"
            value={formValue?.nama || ''}
            onChange={(i) => {
              setFormValue((prev) => ({ ...prev, nama: i?.target?.value }));
            }}
            label="Nama"
          />
          <TextField
            size="small"
            value={formValue?.username || ''}
            onChange={(i) => {
              setFormValue((prev) => ({ ...prev, username: i?.target?.value }));
            }}
            label="Username"
          />
          <TextField
            type="number"
            size="small"
            value={formValue?.noHP || ''}
            onChange={(i) => {
              setFormValue((prev) => ({ ...prev, noHP: i?.target?.value }));
            }}
            label="No HP"
          />
          <Box>
            <TextField
              fullWidth
              size="small"
              value={formValue?.password || ''}
              onChange={(i) => {
                setFormValue((prev) => ({ ...prev, password: i?.target?.value }));
              }}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Alert sx={{ mt: 1 }} variant="filled" severity="error">
              Password tidak akan bisa dilihat setelah membuat akun baru.
            </Alert>
          </Box>
        </Box>
      )}
    </ScreenDialog>
  );
}

export default CreateAccount;
