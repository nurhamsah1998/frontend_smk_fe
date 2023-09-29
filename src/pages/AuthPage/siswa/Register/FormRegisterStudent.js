import React from 'react';
import { Formik, Form } from 'formik';
// @mui
import { Link, Stack, Box, IconButton, InputAdornment, TextField, MenuItem, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { uid } from 'uid';
import { useNavigate } from 'react-router-dom';
// components
import Iconify from '../../../../components/iconify';
import AutoCompleteAsync from '../../../../components/Core/AutoCompleteAsync';
import useRegister from '../../../../hooks/useRegister';
import useFetch from '../../../../hooks/useFetch';

// ----------------------------------------------------------------------

export default function FormRegisterStudent() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [gender, setGender] = React.useState('');
  const formRef = React.useRef();
  const { data } = useFetch({
    module: `total-tagihan-permanent?tahun_angkatan=${new Date().getFullYear()}`,
  });
  const register = useRegister({
    module: 'register-siswa',
    next: () => {
      formRef.current?.resetForm();
      formRef.current?.setFieldValue('jurusanId', '');
      setGender('');
      navigate('/siswa-login');
    },
  });
  const handleChange = (event) => {
    setGender(event.target.value);
  };
  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          nama: '',
          username: '',
          password: '',
          noHP: '',
          jurusanId: '',
          gender: '',
        }}
        onSubmit={(values) => {
          const body = {
            ...values,
            gender,
            isAdminCreation: false,
            status_bill: data?.data === 0 ? 'not_paid_yet' : 'not_paid',
            jurusanId: values?.jurusanId?.id,
            code_jurusan: values?.jurusanId?.code,
            current_bill: data?.data,
            kode_siswa: `CODE-${uid(7).toUpperCase()}`,
          };
          register.mutate(body);
        }}
        enableReinitialize
      >
        {({ values, getFieldProps, setFieldValue }) => {
          return (
            <Form>
              <Box display="grid" gap={2}>
                <TextField size="small" fullWidth name="nama" {...getFieldProps('nama')} label="Nama lengkap" />
                <TextField size="small" fullWidth name="username" {...getFieldProps('username')} label="Username" />
                <Box>
                  {/* /// https://stackoverflow.com/a/67068903/18038473 */}
                  <TextField fullWidth size="small" select onChange={handleChange} value={gender} label="Gender">
                    <MenuItem value={'L'}>Laki - Laki</MenuItem>
                    <MenuItem value={'P'}>Perempuan</MenuItem>
                  </TextField>
                </Box>
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
                  value={values.jurusanId || {}}
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

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <Checkbox name="remember" label="Remember me" />
                <Link variant="subtitle2" underline="hover">
                  Forgot password?
                </Link>
              </Stack>
              <LoadingButton fullWidth size="large" type="submit" loading={register.isLoading} variant="contained">
                Register
              </LoadingButton>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
