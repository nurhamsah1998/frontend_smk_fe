import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { Formik, Form } from 'formik';
import { useSnackbar } from 'notistack';

// components
import Iconify from '../../../../components/iconify';

import useLogin from '../../../../hooks/useLogin';

// ----------------------------------------------------------------------

export default function FormLogin() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      navigate('/siswa/app');
    }
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={async (values) => {
          axios({
            method: 'post',
            url: `http://localhost:5000/login-siswa`,
            data: { ...values },
          })
            .then((res) => {
              enqueueSnackbar(res?.data?.msg, { variant: 'success' });
              window.localStorage.setItem('accessToken', res.data?.accessToken);
              navigate('/siswa/app');
            })
            .catch((error) => {
              console.log(error, 'ini');
              enqueueSnackbar(error?.response?.data?.msg, { variant: 'error' });
            });
        }}
      >
        {({ getFieldProps, values, dirty }) => (
          <Form>
            <Stack spacing={3}>
              <TextField name="username" {...getFieldProps('username')} label="Username" />
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

            <LoadingButton fullWidth size="large" type="submit" variant="contained" disabled={!dirty}>
              Login
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </>
  );
}
