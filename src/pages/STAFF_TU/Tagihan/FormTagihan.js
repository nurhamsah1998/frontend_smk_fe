import React from 'react';
import { Form } from 'formik';
import { TextField, Box, Button, FormHelperText } from '@mui/material';
import { grey } from '@mui/material/colors';
import SelectComponent from '../../../components/SelectComponent';
import AutoCompleteAsync from '../../../components/Core/AutoCompleteAsync';
import TextFieldNumberFormat from '../../../components/TextFieldNumberFormat';
import formatNumberChange from '../../../components/formatNumberChange';

function FormTagihan({ values, setFieldValue, getFieldProps }) {
  const handleClickAddBill = () => {
    const valuePeriode = [...values?.periode];
    valuePeriode.push({ bulan: '', total: '', kode_bulan: '' });
    setFieldValue('periode', valuePeriode);
  };

  /// Disabled button when form reach 12 form
  const isDisabled = values?.periode?.length >= 12;
  return (
    <Form>
      <Box sx={{ display: 'grid', gap: 2 }}>
        {[
          {
            name: 'nama',
            label: 'Bill name',
            type: 'text',
          },
          {
            name: 'categori',
            label: 'Kategori pembayaran',
            isSelect: true,
            option: [
              {
                value: 'spp',
                label: 'SPP',
              },
              {
                value: 'non_spp',
                label: 'NON SPP',
              },
            ],
          },
          {
            name: 'periode',
            label: 'Jangka waktu pembayaran',
            disable: Boolean(values.categori?.includes('spp')),
            isMultipleForm: !Boolean(values.categori?.includes('non_spp')),
            option: [
              {
                value: 'januari',
                label: 'Januari',
              },
              {
                value: 'februari',
                label: 'Februari',
              },
              {
                value: 'maret',
                label: 'Maret',
              },
              {
                value: 'april',
                label: 'April',
              },
              {
                value: 'mei',
                label: 'Mei',
              },
              {
                value: 'juni',
                label: 'Juni',
              },
              {
                value: 'juli',
                label: 'Juli',
              },
              {
                value: 'agustus',
                label: 'Agustus',
              },
              {
                value: 'september',
                label: 'September',
              },
              {
                value: 'oktober',
                label: 'Oktober',
              },
              {
                value: 'november',
                label: 'November',
              },
              {
                value: 'desember',
                label: 'Desember',
              },
            ],
          },
          {
            name: 'deskripsi',
            label: 'Diskripsi tagihan',
            type: 'text',
          },
          {
            name: 'total',
            label: 'Total tagihan',
            disable: !Boolean(values.categori?.includes('non_spp')),
            type: 'number',
          },
          {
            name: 'kelas',
            label: 'Untuk kelas',
            isSelect: true,
            option: [
              {
                value: '01',
                label: 'Kelas I',
              },
              {
                value: '02',
                label: 'Kelas II',
              },
              {
                value: '03',
                label: 'Kelas III',
              },
            ],
          },
          {
            name: 'angkatan',
            label: 'Untuk angkatan',
            type: 'number',
            helperText: 'Contoh: 2022',
          },

          {
            name: 'jurusanId',
            label: 'Untuk jurusan',
            isAutoComplete: true,
            option: [
              {
                value: 'TKJ',
                label: 'Jurusan TKJ',
              },
              {
                value: 'TKR',
                label: 'Jurusan TKR',
              },
              {
                value: 'AKT',
                label: 'Jurusan AKT',
              },
            ],
          },
        ].map((item, index) => {
          if (item.isAutoComplete) {
            return (
              <AutoCompleteAsync
                key={index}
                module="jurusan"
                label="Choose a major"
                onChange={(x, y) => {
                  setFieldValue(item.name, y);
                }}
              />
            );
          }
          if (item.isSelect) {
            return (
              <SelectComponent
                value={values[item.name]}
                onChange={(i) => setFieldValue(item.name, i.target.value)}
                placeholder={item.label}
                listSelect={item.option}
                key={index}
              />
            );
          }
          if (item.isMultipleForm) {
            return (
              <Box
                key={index}
                sx={{
                  border: `solid 1px ${grey[400]}`,
                  p: 2,
                  display: values?.categori?.includes('spp') ? 'block' : 'none',
                }}
              >
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {values.periode?.map((month, x) => (
                    <Box key={x} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <SelectComponent
                        onChange={(i) => {
                          setFieldValue(`periode[${x}].bulan`, i.target.value);
                        }}
                        value={values.periode[x].bulan}
                        fullWidth
                        size="small"
                        placeholder="Bulan"
                        listSelect={item.option}
                      />
                      <TextFieldNumberFormat
                        onChange={(i) => {
                          setFieldValue(`periode[${x}].total`, formatNumberChange(i.target.value));
                        }}
                        size="small"
                        label="Total"
                        fullWidth
                      />
                    </Box>
                  ))}
                </Box>
                <Button disabled={isDisabled} onClick={handleClickAddBill} sx={{ mt: 2 }} variant="contained" fullWidth>
                  Tambah periode pembayaran
                </Button>
              </Box>
            );
          }
          return (
            <Box key={index}>
              <TextField
                {...getFieldProps(item.name)}
                type={item.type}
                disabled={item.disable}
                fullWidth
                label={item.label}
              />
              <FormHelperText>{item.helperText}</FormHelperText>
            </Box>
          );
        })}
      </Box>
    </Form>
  );
}

export default FormTagihan;
