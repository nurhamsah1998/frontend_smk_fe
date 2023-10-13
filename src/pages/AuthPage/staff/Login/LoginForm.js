import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/iconify';
import useLogin from '../../../../hooks/useLogin';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useLogin({
    module: 'staff-login',
  });

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={async (values) => {
          login.mutate(values);
        }}
      >
        {({ getFieldProps, values }) => (
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

            {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
              <Checkbox name="remember" label="Remember me" />
              <Link variant="subtitle2" underline="hover">
                Forgot password?
              </Link>
            </Stack> */}

            <LoadingButton sx={{ mt: 2 }} fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
              Login
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </>
  );
}
