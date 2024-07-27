import React, { useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import ScreenDialog from '../../../../components/ScreenDialog';
import TextFieldNumberFormat from '../../../../components/TextFieldNumberFormat';
import formatNumberChange from '../../../../components/formatNumberChange';
import useMutationPost from '../../../../hooks/useMutationPost';

function CreateInvoiceOut({ handleClose, open }) {
  const refForm = useRef();
  const client = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirm, setOpenConfirm] = useState({ isOpen: false, data: {} });
  const mutation = useMutationPost({
    module: 'invoice-out',
    next: () => {
      setOpenConfirm({ isOpen: false, data: {} });
      handleClose();
      client.invalidateQueries(['get-all-invoice-out']);
    },
  });
  const handleSubmit = () => {
    mutation.mutate(openConfirm.data);
  };
  return (
    <Box>
      <ScreenDialog
        handleSubmit={handleSubmit}
        open={openConfirm.isOpen}
        handleClose={() => setOpenConfirm({ isOpen: false, data: {} })}
        labelClose="Cancel"
        isLoading={mutation.isLoading}
        labelSubmit="Ok"
        title="Konfirmasi Pengeluaran"
      >
        <Typography>
          Apakah anda telah memeriksa kembali pengeluaran ini ? pengeluaran yang sudah dibuat tidak dapat dihapus atau
          dimodifikasi, apakah anda yakin ingin melanjutkan membuat pengeluaran ?
        </Typography>
      </ScreenDialog>
      <ScreenDialog
        handleSubmit={() => refForm.current?.handleSubmit()}
        open={open}
        handleClose={handleClose}
        labelClose="Cancel"
        //   isLoading={modalPermissions.isLoading}
        labelSubmit="Simpan"
        title="Pengeluaran"
      >
        <Box>
          <Formik
            innerRef={refForm}
            enableReinitialize
            initialValues={{
              nama: '',
              note: '',
              uang_keluar: '',
            }}
            onSubmit={async (values) => {
              if (!values?.uang_keluar || !values?.nama) {
                enqueueSnackbar('Input nama dan input uang keluar wajib diisi', { variant: 'error' });
                return;
              }
              setOpenConfirm({ isOpen: true, data: values });
            }}
          >
            {({ getFieldProps, values, setFieldValue }) => (
              <Form>
                <Stack spacing={3}>
                  <TextField name="nama" {...getFieldProps('nama')} label="Nama" />
                  <TextField name="note" multiline rows={4} {...getFieldProps('note')} label="Note" />
                  <TextFieldNumberFormat
                    onChange={(i) => {
                      setFieldValue('uang_keluar', formatNumberChange(i.target.value));
                    }}
                    label="Uang keluar"
                    value={values?.uang_keluar}
                    fullWidth
                  />
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </ScreenDialog>
    </Box>
  );
}

export default CreateInvoiceOut;
