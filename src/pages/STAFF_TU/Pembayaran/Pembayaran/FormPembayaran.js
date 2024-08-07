import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Autocomplete, TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import PaymentsIcon from '@mui/icons-material/Payments';

import TextFieldNumberFormat from '../../../../components/TextFieldNumberFormat';
import formatNumberChange from '../../../../components/formatNumberChange';
import useMutationPatch from '../../../../hooks/useMutationPatch';
import { apiUrl } from '../../../../hooks/api';
import ModalSuccessPayment from './ModalSuccessPayment';

function FormPembayaran({ data, refetchInvoice, totalBillPaymentHistory }) {
  const formRef = React.useRef();
  const [openModalSuccess, setOpenModalSuccess] = React.useState(false);
  const [isLoading, setIsloading] = React.useState(false);
  const [dataAfterSuccess, setDataAfterSuccess] = React.useState({});
  const mutationPatch = useMutationPatch({
    module: 'siswa',
    next: (res) => {
      formRef.current?.resetForm();
      refetchInvoice();
      setOpenModalSuccess(true);
      setIsloading(false);
    },
    successMessage: 'Transaksi berhasil',
  });
  const { enqueueSnackbar } = useSnackbar();
  const options = [
    { label: 'Bebas', value: 'bebas' },
    { label: 'Spp', value: 'spp' },
    { label: 'Seragam', value: 'seragam' },
    { label: 'Bagunan', value: 'bagunan' },
    { label: 'Buku LKS', value: 'buku_lks' },
    { label: 'Prakerin', value: 'prakerin' },
    { label: 'Kunjungan industri', value: 'kunjungan_industri' },
    { label: 'Jobsheet', value: 'jobsheet' },
    { label: 'Pengembangan', value: 'pengembangan' },
    { label: 'Ujian akhir kelas', value: 'ujian_akhir_kelas' },
    { label: 'Pas smt', value: 'pas_smt' },
    { label: 'Pts smt', value: 'pts_smt' },
  ];
  return (
    <>
      <ModalSuccessPayment
        open={openModalSuccess}
        data={dataAfterSuccess}
        handleClose={() => setOpenModalSuccess(false)}
      />
      <Formik
        innerRef={formRef}
        initialValues={{
          uang_diterima: '',
          tahun_angkatan: '',
          note: '',
          kode_tagihan: '',
          kode_pembayaran: '',
          nama: '',
          petugas: '',
        }}
        onSubmit={async (values) => {
          setIsloading(true);
          const body = {
            ...values,
            tahun_angkatan: data?.student?.angkatan,
            nama: data?.student?.nama,
            petugas: data?.staff?.nama,
            kode_tagihan: data?.student?.kode_siswa,
            jurusan: data?.student?.jurusan?.kode_jurusan,
            sub_kelas: data?.student?.sub_kelas,
            kelas: data?.student?.kelas,
          };
          try {
            await axios
              .post(
                `${apiUrl}invoice-in`,
                { ...body },
                {
                  headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
                  },
                }
              )
              .then((res) => {
                setDataAfterSuccess(res?.data?.data);
                const statusBill = data?.student?.current_bill - values?.uang_diterima;
                mutationPatch.mutate({
                  id: data?.student?.id,
                  current_bill: data?.student?.current_bill - values?.uang_diterima,
                  total_payment: Number(totalBillPaymentHistory) + Number(values?.uang_diterima),
                  status_bill: statusBill === 0 ? 'paid' : statusBill < 0 ? 'deposit' : 'not_paid',
                });
              })
              .catch((error) => {
                console.log(error);
                enqueueSnackbar(error?.response?.data?.msg || error?.response?.data || 'Internal server error !', {
                  variant: 'error',
                });
                setIsloading(false);
              });
          } catch (error) {
            setIsloading(false);
          }
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
                  freeSolo
                  onChange={(x, y) => {
                    setFieldValue('kode_pembayaran', y?.label || '');
                  }}
                  value={values?.kode_pembayaran}
                  options={options}
                  renderInput={(params) => <TextField {...params} label="Pembayaran" />}
                />
                <TextFieldNumberFormat
                  onChange={(i) => {
                    setFieldValue('uang_diterima', formatNumberChange(i.target.value));
                  }}
                  label="Nominal"
                  value={values?.uang_diterima}
                  fullWidth
                />
                <TextField {...getFieldProps('note')} label="Keterangan" fullWidth />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  disabled={values?.uang_diterima <= 1000 || !Boolean(values?.kode_pembayaran) || isLoading}
                  type="submit"
                  variant="contained"
                  startIcon={isLoading ? <CircularProgress size={20} /> : <PaymentsIcon />}
                >
                  Bayar
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default FormPembayaran;
