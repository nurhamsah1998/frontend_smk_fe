import React from 'react';
import { Formik, Form } from 'formik';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';

import ScreenDialog from '../../../components/ScreenDialog';
import useRegister from '../../../hooks/useRegister';
import AutoCompleteAsync from '../../../components/Core/AutoCompleteAsync';
import Iconify from '../../../components/iconify';

function Create({ openModalCreate, setOpenModalCreate }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const formRef = React.useRef();
  const { register, isLoading } = useRegister({
    module: 'register-siswa',
    next: () => formRef.current?.resetForm(),
  });
  return (
    <div>
      <ScreenDialog
        labelClose="Batal"
        handleClose={() => setOpenModalCreate(false)}
        handleSubmit={() => formRef.current?.handleSubmit()}
        labelSubmit="Tambah"
        title="Tambah Siswa Baru"
        open={openModalCreate}
      >
        <Formik
          innerRef={formRef}
          initialValues={{
            nama: '',
            username: '',
            password: '',
            noHP: '',
            jurusanId: '',
          }}
          onSubmit={(values) => {
            register.mutate({ ...values, jurusanId: values?.jurusanId?.id });
          }}
        >
          {({ values, getFieldProps, setFieldValue }) => {
            return (
              <Form>
                <Box display="grid" gap={2}>
                  <TextField size="small" fullWidth name="nama" {...getFieldProps('nama')} label="Nama lengkap" />
                  <TextField size="small" fullWidth name="username" {...getFieldProps('username')} label="Username" />
                  <TextField
                    size="small"
                    fullWidth
                    name="noHP"
                    {...getFieldProps('noHP')}
                    type="number"
                    label="Nomor Telpon/Wa"
                  />
                  <AutoCompleteAsync
                    size="small"
                    module="jurusan"
                    label="Pilih jurusan"
                    onChange={(x, y) => {
                      setFieldValue('jurusanId', y);
                    }}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    name="password"
                    label="Password"
                    {...getFieldProps('password')}
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
                </Box>
              </Form>
            );
          }}
        </Formik>
      </ScreenDialog>
    </div>
  );
}

export default Create;
