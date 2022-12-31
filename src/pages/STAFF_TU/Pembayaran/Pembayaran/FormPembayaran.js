import React from 'react';
import { Formik, Form } from 'formik';
import { Typography, Box, Autocomplete, TextField, Button } from '@mui/material';
import TextFieldNumberFormat from '../../../../components/TextFieldNumberFormat';
import useMutationPost from '../../../../hooks/useMutationPost';
import formatNumberChange from '../../../../components/formatNumberChange';

function FormPembayaran({ data, refetchInvoice }) {
  const formRef = React.useRef();
  const mutation = useMutationPost({
    module: 'invoice',
    next: () => {
      formRef.current?.resetForm();
      refetchInvoice();
    },
  });
  const options = [
    { label: 'All', value: 'bebas' },
    { label: 'Spp', value: 'spp' },
    { label: 'Uniform', value: 'seragam' },
    { label: 'Building', value: 'bagunan' },
    { label: 'Books', value: 'buku_lks' },
    { label: 'Prakerin', value: 'prakerin' },
    { label: 'Industrial visits', value: 'kunjungan_industri' },
    { label: 'Jobsheet', value: 'jobsheet' },
    { label: 'Development', value: 'pengembangan' },
  ];
  return (
    <Formik
      innerRef={formRef}
      initialValues={{
        uang_diterima: '',
        total: '',
        note: '',
        kode_tagihan: '',
        kode_pembayaran: '',
        nama: '',
        petugas: '',
      }}
      onSubmit={(values) => {
        const body = {
          ...values,
          nama: data?.student?.nama,
          petugas: data?.staff?.nama,
          kode_tagihan: data?.student?.kode_siswa,
        };
        mutation.mutate(body);
      }}
      enableReinitialize
    >
      {({ getFieldProps, setFieldValue, values }) => (
        <Form>
          <Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Autocomplete
                disablePortal
                fullWidth
                onChange={(x, y) => {
                  setFieldValue('kode_pembayaran', y.label);
                }}
                value={values?.kode_pembayaran}
                options={options}
                renderInput={(params) => <TextField {...params} label="Payment" />}
              />
              <TextFieldNumberFormat
                onChange={(i) => {
                  setFieldValue('uang_diterima', formatNumberChange(i.target.value));
                }}
                label="Nominal"
                value={values?.uang_diterima}
                fullWidth
              />
              <TextField {...getFieldProps('note')} label="Note" fullWidth />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button disabled={values?.uang_diterima <= 1000} type="submit" variant="contained">
                Pay
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default FormPembayaran;
