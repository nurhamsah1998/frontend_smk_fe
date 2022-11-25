import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import AutoCompleteAsync from '../../../components/Core/AutoCompleteAsync';
import useRegister from '../../../hooks/useRegister';

// ----------------------------------------------------------------------

export default function FormRegisterStudent() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useRegister({
    module: 'register-siswa',
  });
  return (
    <>
      <Formik
        initialValues={{
          nama: '',
          nisn: '',
          password: '',
          noHP: '',
          jurusanId: '',
        }}
        onSubmit={(values) => {
          register.mutate({ ...values, jurusanId: values?.values?.id });
        }}
      >
        {({ getFieldProps, setFieldValue, values }) => (
          <Form>
            <Stack spacing={3}>
              <TextField name="nama" {...getFieldProps('nama')} label="Nama lengkap" />
              <TextField name="nisn" {...getFieldProps('nisn')} label="Nomor NISN" />
              <TextField name="noHP" {...getFieldProps('noHP')} type="number" label="Nomor Telpon/Wa" />
              <AutoCompleteAsync
                module="jurusan"
                label="Pilih jurusan"
                onChange={(x, y) => {
                  setFieldValue('jurusanId', y);
                }}
              />
              <TextField
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
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
              <Checkbox name="remember" label="Remember me" />
              <Link variant="subtitle2" underline="hover">
                Forgot password?
              </Link>
            </Stack>
            <LoadingButton fullWidth size="large" type="submit" loading={isLoading} variant="contained">
              Register
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </>
  );
}
