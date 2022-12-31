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

// ----------------------------------------------------------------------

export default function FormRegisterStaff() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useRegister({
    module: 'staff-register',
    next: () => navigate('/staff-login'),
  });
  return (
    <>
      <Formik
        initialValues={{
          nama: '',
          username: '',
          password: '',
          noHP: '',
        }}
        onSubmit={(values) => {
          register.mutate({ ...values, jurusanId: values?.values?.id });
        }}
      >
        {({ getFieldProps, setFieldValue, values }) => (
          <Form>
            <Stack spacing={3}>
              <TextField name="nama" {...getFieldProps('nama')} label="Full name" />
              <TextField name="username" {...getFieldProps('username')} label="Username / email" />
              <TextField name="noHP" {...getFieldProps('noHP')} type="number" label="Phone number" />
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
            {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
              <Checkbox name="remember" label="Remember me" />
              <Link variant="subtitle2" underline="hover">
                Forgot password?
              </Link>
            </Stack> */}
            <LoadingButton sx={{ mt: 2 }} fullWidth size="large" type="submit" loading={isLoading} variant="contained">
              Register
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </>
  );
}
