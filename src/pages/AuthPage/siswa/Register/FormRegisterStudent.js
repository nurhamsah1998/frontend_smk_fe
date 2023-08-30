import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/iconify';
import AutoCompleteAsync from '../../../../components/Core/AutoCompleteAsync';
import useRegister from '../../../../hooks/useRegister';
import useFetch from '../../../../hooks/useFetch';

// ----------------------------------------------------------------------

export default function FormRegisterStudent() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const { itemsNoPagination, isError } = useFetch({
    module: `tagihan-permanent-siswa?tahun_angkatan=${new Date().getFullYear()}`,
  });
  const isErrorGetBill = Boolean(itemsNoPagination?.length === 0) || isError;
  delete itemsNoPagination?.[0]?.tahun_angkatan;
  const listBill = Object.values(itemsNoPagination?.[0] || {});
  const handleCountTotalBill = (arg) => {
    let result = 0;
    for (let index = 0; index < arg.length; index += 1) {
      if (typeof arg[index] === 'number') {
        result += arg[index];
      }
    }
    return result;
  };
  const currentTotalBill = handleCountTotalBill(listBill);
  const { register, isLoading } = useRegister({
    module: 'register-siswa',
    // next: () => navigate('/siswa-login'),
  });
  return (
    <>
      <Formik
        initialValues={{
          nama: '',
          username: '',
          password: '',
          noHP: '',
          jurusanId: '',
        }}
        onSubmit={(values) => {
          console.log(currentTotalBill);
          register.mutate({ ...values, jurusanId: values?.jurusanId?.id, current_bill: currentTotalBill });
        }}
      >
        {({ getFieldProps, setFieldValue, values }) => (
          <Form>
            <Stack spacing={3}>
              <TextField name="nama" {...getFieldProps('nama')} label="Nama lengkap" />
              <TextField name="username" {...getFieldProps('username')} label="username" />
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
            <LoadingButton
              disabled={isErrorGetBill}
              fullWidth
              size="large"
              type="submit"
              loading={isLoading}
              variant="contained"
            >
              Register
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </>
  );
}
