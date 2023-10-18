import React from 'react';
import { Box, TextField, Typography, Select, MenuItem } from '@mui/material';
import { Form, Formik } from 'formik';

import ScreenDialog from '../../../../components/ScreenDialog';
import useFetch from '../../../../hooks/useFetch';
import useMutationPatch from '../../../../hooks/useMutationPatch';

function StudentDetail({ openModal, itemStudent, setModalDetailStudent }) {
  const inputRef = React.useRef();
  const [edit, setEdit] = React.useState(true);
  const { data } = useFetch({
    module: 'jurusan',
  });
  const mutation = useMutationPatch({
    module: `siswa`,
    next: () => {
      setModalDetailStudent(false);
      setEdit(true);
    },
  });
  const initialForm = [
    {
      name: 'nama',
      label: 'Nama',
    },
    {
      name: 'username',
      label: 'Username',
    },
    {
      name: 'password',
      label: 'Password',
    },
    {
      name: 'kelas',
      label: 'Kelas',
      isSelect: true,
      option: [
        {
          nama: '10',
          id: '10',
        },
        {
          nama: '11',
          id: '11',
        },
        {
          nama: '12',
          id: '12',
        },
      ],
    },
    {
      name: 'jurusanId',
      label: 'Jurusan',
      isSelect: true,
      option: data?.data,
    },
    {
      name: 'sub_kelas',
      label: 'Sub kelas',
      isSelect: true,
      option: [
        {
          nama: '1',
          id: '1',
        },
        {
          nama: '2',
          id: '2',
        },
        {
          nama: '3',
          id: '3',
        },
        {
          nama: '4',
          id: '4',
        },
        {
          nama: '5',
          id: '5',
        },
        {
          nama: '6',
          id: '6',
        },
      ],
    },
    {
      name: 'alamat',
      label: 'Alamat',
    },
    {
      name: 'noHP',
      label: 'noHP',
      type: 'number',
    },
    {
      name: 'genderId',
      label: 'Gender',
      isSelect: true,
      option: [
        {
          nama: 'Laki Laki',
          id: 'L',
        },
        {
          nama: 'Perempuan',
          id: 'P',
        },
      ],
    },
    {
      name: 'nama_ayah',
      label: 'Nama ayah',
    },
    {
      name: 'nama_ibu',
      label: 'Nama ibu',
    },
  ];
  const handleClose = () => {
    setModalDetailStudent(false);
    setEdit(true);
  };

  return (
    <div>
      <ScreenDialog
        handleSubmit={() => inputRef?.current?.handleSubmit()}
        open={Boolean(openModal)}
        handleTopBtn={() => setEdit(false)}
        labelClose="Tutup"
        isLoading={mutation.isLoading}
        labelTopBtn={!edit ? null : 'Edit'}
        labelSubmit={!edit ? 'Simpan' : null}
        handleClose={handleClose}
        title={`Detail siswa`}
      >
        <Formik
          initialValues={{
            nama: itemStudent?.nama || '',
            kelas: itemStudent?.kelas || '',
            username: itemStudent?.username || '',
            password: itemStudent?.password || '',
            jurusanId: itemStudent?.['jurusan.id'] || '',
            jurusan: itemStudent?.['jurusan.nama'] || '',
            sub_kelas: itemStudent?.sub_kelas || '',
            alamat: itemStudent?.alamat || '',
            noHP: itemStudent?.noHP || '',
            gender: itemStudent?.gender?.includes('P') ? 'Perempuan' : 'Laki Laki' || '',
            genderId: itemStudent?.gender || '',
            nama_ayah: itemStudent?.nama_ayah || '',
            nama_ibu: itemStudent?.nama_ibu || '',
          }}
          innerRef={inputRef}
          onSubmit={(values) => {
            const body = { ...values, id: itemStudent?.id };
            body.gender = values?.genderId;
            delete body.jurusan;
            delete body.genderId;
            mutation.mutate(body);
          }}
          enableReinitialize
        >
          {({ getFieldProps, setFieldValue, values }) => (
            <Form>
              <Box sx={{ display: 'grid', gap: 1 }}>
                {initialForm.map((item, index) => {
                  if (item?.isSelect) {
                    return (
                      <Box key={index}>
                        <Typography>{item?.label}</Typography>
                        <Select
                          disabled={edit}
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={values[item?.name] || ''}
                          size="small"
                          onChange={(event) => {
                            setFieldValue(item?.name, event.target.value);
                          }}
                        >
                          {item?.option?.map((form, indexForm) => (
                            <MenuItem
                              key={indexForm}
                              onClick={() => setFieldValue(values?.item?.name, item?.id)}
                              value={form?.id}
                            >
                              {form?.nama}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    );
                  }
                  return (
                    <Box key={index}>
                      <Typography>{item?.label}</Typography>
                      <TextField
                        type={Boolean(item?.type) ? 'number' : 'text'}
                        disabled={edit}
                        size="small"
                        fullWidth
                        {...getFieldProps(item?.name)}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Form>
          )}
        </Formik>
      </ScreenDialog>
    </div>
  );
}

export default StudentDetail;
