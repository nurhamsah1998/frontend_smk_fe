import React from 'react';
import { Formik, Form } from 'formik';
import { TextField, Box, MenuItem, FormHelperText } from '@mui/material';
import { useSnackbar } from 'notistack';
import useMutationPost from '../../../hooks/useMutationPost';
import ScreenDialog from '../../../components/ScreenDialog';
import AutoCompleteAsync from '../../../components/Core/AutoCompleteAsync';
import { isEmpty } from '../../../utils/helper';
import useMutationPatch from '../../../hooks/useMutationPatch';

function MutationCampaign({ openModalCreate, setOpenModalCreate, dataEdit, setDataEdit }) {
  const formRef = React.useRef();
  const angkatan = () => {
    const result = [];
    const date = new Date();
    result.push(date.getFullYear() - 1);
    result.push(date.getFullYear());
    result.push(date.getFullYear() + 1);
    return result;
  };
  const { enqueueSnackbar } = useSnackbar();
  const mutationPost = useMutationPost({
    module: 'campaign',
    next: () => {
      formRef.current?.resetForm();
      setOpenModalCreate(false);
      setTimeout(() => {
        setDataEdit({});
      }, 100);
    },
  });
  const mutationPatch = useMutationPatch({
    module: 'campaign',
    next: () => {
      formRef.current?.resetForm();
      setOpenModalCreate(false);
      setTimeout(() => {
        setDataEdit({});
      }, 100);
    },
  });
  return (
    <div>
      <ScreenDialog
        labelClose="Batal"
        isLoading={mutationPost.isLoading}
        handleClose={() => {
          setOpenModalCreate(false);
          setTimeout(() => {
            setDataEdit({});
          }, 100);
        }}
        handleSubmit={() => formRef.current?.handleSubmit()}
        labelSubmit={dataEdit?.id ? 'Update' : 'Tambah'}
        title={`${dataEdit?.id ? 'Update' : 'Buat'} Pengumuman Baru`}
        open={openModalCreate}
      >
        <Formik
          innerRef={formRef}
          initialValues={{
            title: dataEdit?.title || '',
            text: dataEdit?.text || '',
            status: dataEdit?.status || '',
            angkatan: dataEdit?.angkatan || '',
            kelas: dataEdit?.kelas || '',
            jurusan_id: dataEdit?.jurusan || '',
            sub_kelas: dataEdit?.sub_kelas || '',
            is_response: !dataEdit?.id ? '' : dataEdit?.is_response ? '1' : '0',
          }}
          onSubmit={(values) => {
            if (isEmpty(values?.title) || isEmpty(values?.text) || isEmpty(values?.status) || values?.angkatan === '') {
              enqueueSnackbar('Judul, Text, Angkatan, dan Status wajib diisi !!!', {
                variant: 'error',
              });
              return;
            }
            if (dataEdit?.id) {
              mutationPatch.mutate({
                ...values,
                id: dataEdit?.id,
                jurusan_id: values?.jurusan_id?.id,
                angkatan: String(values?.angkatan),
              });
            } else {
              mutationPost.mutate({
                ...values,
                is_response: Number(values?.is_response),
                jurusan_id: values?.jurusan_id?.id,
                angkatan: String(values?.angkatan),
              });
            }
          }}
          enableReinitialize
        >
          {({ values, getFieldProps, setFieldValue }) => {
            return (
              <Form>
                <Box display="grid" gap={2}>
                  <Box>
                    <TextField
                      inputProps={{
                        maxLength: 70,
                      }}
                      size="small"
                      fullWidth
                      name="title"
                      {...getFieldProps('title')}
                      label="Judul"
                    />
                    <FormHelperText
                      sx={{
                        textAlign: 'right',
                      }}
                    >
                      {values?.title?.length} / 70
                    </FormHelperText>
                  </Box>
                  <Box width="100%">
                    <TextField
                      fullWidth
                      id="outlined-multiline-static"
                      multiline
                      rows={6}
                      inputProps={{
                        maxLength: 800,
                      }}
                      {...getFieldProps('text')}
                      label="Text"
                    />
                    <FormHelperText
                      sx={{
                        textAlign: 'right',
                      }}
                    >
                      {values?.text?.length} / 800
                    </FormHelperText>
                  </Box>
                  <Box>
                    {/* /// https://stackoverflow.com/a/67068903/18038473 */}
                    <TextField
                      fullWidth
                      size="small"
                      select
                      // onChange={handleChange}
                      //   value={gender}
                      {...getFieldProps('status')}
                      label="Status"
                    >
                      <MenuItem value={'umum'}>Umum</MenuItem>
                      <MenuItem value={'penting'}>Penting</MenuItem>
                    </TextField>
                  </Box>

                  <Box>
                    {/* /// https://stackoverflow.com/a/67068903/18038473 */}
                    <TextField
                      fullWidth
                      size="small"
                      select
                      onChange={(event) => {
                        setFieldValue('angkatan', event.target.value);
                      }}
                      value={values.angkatan}
                      label="Untuk angkatan"
                    >
                      {angkatan()?.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <AutoCompleteAsync
                    size="small"
                    value={values.jurusan_id || {}}
                    module="jurusan"
                    label="Untuk jurusan"
                    onChange={(x, y) => {
                      setFieldValue('jurusan_id', y);
                    }}
                  />
                  <Box>
                    {/* /// https://stackoverflow.com/a/67068903/18038473 */}
                    <TextField
                      fullWidth
                      size="small"
                      select
                      // onChange={handleChange}
                      //   value={gender}
                      {...getFieldProps('is_response')}
                      label="Merespon"
                    >
                      <MenuItem value={'1'}>Siswa dapat merespon pengumuman ini</MenuItem>
                      <MenuItem value={'0'}>Siswa tidak dapat merespon pengumuman ini</MenuItem>
                    </TextField>
                  </Box>
                  <Box>
                    {/* /// https://stackoverflow.com/a/67068903/18038473 */}
                    <TextField
                      fullWidth
                      size="small"
                      select
                      value={values.kelas}
                      //   value={gender}
                      {...getFieldProps('kelas')}
                      label="Untuk kelas"
                    >
                      <MenuItem value={'10'}>10</MenuItem>
                      <MenuItem value={'11'}>11</MenuItem>
                      <MenuItem value={'12'}>12</MenuItem>
                    </TextField>
                  </Box>
                  <Box>
                    {/* /// https://stackoverflow.com/a/67068903/18038473 */}
                    <TextField
                      fullWidth
                      size="small"
                      select
                      value={values.sub_kelas}
                      //   value={gender}
                      {...getFieldProps('sub_kelas')}
                      label="Untuk sub kelas"
                    >
                      <MenuItem value={'1'}>1</MenuItem>
                      <MenuItem value={'2'}>2</MenuItem>
                      <MenuItem value={'3'}>3</MenuItem>
                      <MenuItem value={'4'}>4</MenuItem>
                      <MenuItem value={'5'}>5</MenuItem>
                      <MenuItem value={'6'}>6</MenuItem>
                    </TextField>
                  </Box>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </ScreenDialog>
    </div>
  );
}

export default MutationCampaign;
