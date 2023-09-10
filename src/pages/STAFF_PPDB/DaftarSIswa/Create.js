import React from 'react';
import { Formik, Form } from 'formik';
import { uid } from 'uid';
import { TextField, InputAdornment, IconButton, Box, Select, MenuItem, InputLabel } from '@mui/material';

import ScreenDialog from '../../../components/ScreenDialog';
import useRegister from '../../../hooks/useRegister';
import AutoCompleteAsync from '../../../components/Core/AutoCompleteAsync';
import Iconify from '../../../components/iconify';
import useFetch from '../../../hooks/useFetch';

function Create({ openModalCreate, setOpenModalCreate }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const formRef = React.useRef();
  const { data } = useFetch({
    module: `total-tagihan-permanent?tahun_angkatan=${new Date().getFullYear()}`,
  });
  const { register, isLoading } = useRegister({
    module: 'register-siswa',
    next: () => formRef.current?.resetForm(),
  });
  const [gender, setGender] = React.useState('');

  const handleChange = (event) => {
    setGender(event.target.value);
  };
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
            gender: '',
          }}
          onSubmit={(values) => {
            const body = {
              ...values,
              gender,
              status_bill: data?.data === 0 ? 'not_paid_yet' : 'not_paid',
              jurusanId: values?.jurusanId?.id,
              code_jurusan: values?.jurusanId?.code,
              current_bill: data?.data,
              kode_siswa: `CODE-${uid(7).toUpperCase()}`,
            };
            console.log(body);
            register.mutate(body);
          }}
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
