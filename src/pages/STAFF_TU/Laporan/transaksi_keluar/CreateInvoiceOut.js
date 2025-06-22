/* eslint-disable import/no-unresolved */
import React, { useContext, useRef } from 'react';
import { Form, Formik } from 'formik';
import { Box, Stack, TextField } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Dialog } from 'src/hooks/useContextHook';

import ScreenDialog from '../../../../components/ScreenDialog';
import TextFieldNumberFormat from '../../../../components/TextFieldNumberFormat';
import formatNumberChange from '../../../../components/formatNumberChange';
import useMutationPost from '../../../../hooks/useMutationPost';

function CreateInvoiceOut({ handleClose, open }) {
  const { setDialog } = useContext(Dialog);
  const refForm = useRef();
  const client = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useMutationPost({
    module: 'invoice-out',
    next: () => {
      handleClose();
      client.invalidateQueries(['get-all-invoice-out']);
    },
  });
  return (
    <Box>
      <ScreenDialog
        handleSubmit={() => refForm.current?.handleSubmit()}
        open={open}
        handleClose={handleClose}
        labelClose="Cancel"
        isLoading={mutation.isLoading}
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
              setDialog(() => ({
                helperText: `Apakah anda telah memeriksa kembali pengeluaran ini ? pengeluaran yang sudah dibuat tidak dapat dihapus atau
          dimodifikasi, apakah anda yakin ingin melanjutkan membuat pengeluaran ?`,
                title: 'Konfirmasi',
                labelClose: 'Batal',
                variant: 'warning',
                labelSubmit: 'Oke',
                fullWidth: false,
                do: () => {
                  mutation.mutate(values);
                },
                isCloseAfterSubmit: true,
              }));
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
