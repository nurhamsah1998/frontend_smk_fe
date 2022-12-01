import React from 'react';
import { Form } from 'formik';
import { TextField, Box } from '@mui/material';

function FormTagihan() {
  return (
    <Form>
      <Box sx={{ display: 'grid', gap: 2 }}>
        {[
          {
            name: 'nama',
            label: 'Nama tagihan',
            type: 'text',
          },
          {
            name: 'description',
            label: 'Diskripsi tagihan',
            type: 'text',
          },
          {
            name: 'total',
            label: 'Total tagihan',
            type: 'text',
          },
          {
            name: 'kelas',
            label: 'Untuk kelas',
            type: 'text',
          },
          {
            name: 'angkatan',
            label: 'Untuk angkatan',
            type: 'text',
          },
          {
            name: 'periode',
            label: 'Jangka waktu pembayaran',
            type: 'text',
          },
          {
            name: 'jurusanId',
            label: 'Untuk jurusan',
            type: 'text',
          },
        ].map((item, index) => {
          return (
            <Box key={index}>
              <TextField fullWidth label={item.label} />
            </Box>
          );
        })}
      </Box>
    </Form>
  );
}

export default FormTagihan;
