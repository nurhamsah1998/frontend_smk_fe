import React from 'react';
import { TextField, Box, Typography, FormHelperText, Select, MenuItem, Button, Divider } from '@mui/material';
import { cyan, purple, red } from '@mui/material/colors';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ScreenDialog from '../../../components/ScreenDialog';
import useMutationPatch from '../../../hooks/useMutationPatch';

function KenaikanKelas({
  openModalKenaikanKelas,
  setOpenModalKenaikanKelas,
  listJurusan,
  jurusanId,
  kelas,
  jurusan,
  subKelas,
  handleCloseMenuGroub,
  listSiswaKelasManagement,
  setListSiswaKelasManagement,
  refetch,
}) {
  const [newJurusanId, setNewJurusanId] = React.useState('');
  const [newKelas, setNewKelas] = React.useState('');
  const [newSubKelas, setNewSubKelas] = React.useState('');
  const { mutationPatch } = useMutationPatch({
    module: `status-kelas/${jurusanId}/${subKelas}/${kelas}`,
    isBulk: true,
    next: () => {
      refetch();
      handleClose();
    },
  });
  const handleSubmit = () => {
    const body = {
      newJurusanId: newJurusanId || jurusanId,
      newKelas: newKelas || kelas,
      newSubKelas: newSubKelas || subKelas,
    };
    mutationPatch.mutate({ ...body, users: listSiswaKelasManagement });
  };
  const handleDeleteSiswa = (item) => {
    setListSiswaKelasManagement((prev) => {
      return prev?.filter((list) => list?.id !== item?.id);
    });
  };
  const handleClose = () => {
    setOpenModalKenaikanKelas(false);
    setNewJurusanId('');
    setNewKelas('');
    setNewSubKelas('');
    handleCloseMenuGroub();
    setListSiswaKelasManagement([]);
  };
  return (
    <div>
      <ScreenDialog
        disabledSubmitButton={
          !Boolean(newSubKelas) ||
          !Boolean(newKelas) ||
          !Boolean(newJurusanId) ||
          mutationPatch.isLoading ||
          !Boolean(listSiswaKelasManagement?.length)
        }
        open={openModalKenaikanKelas}
        labelClose="Batal"
        isLoading={mutationPatch.isLoading}
        labelSubmit="Generate"
        handleSubmit={handleSubmit}
        handleClose={handleClose}
        title={`Management kelas`}
      >
        <Box>
          <Typography variant="h5" color="#000">
            Daftar siswa
          </Typography>
          <Box p={1} display="grid" gap={1}>
            {listSiswaKelasManagement?.map((listItem, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    textTransform: 'capitalize',
                  }}
                >
                  {index + 1}. {listItem?.nama}
                </Typography>
                <Button color="error" onClick={() => handleDeleteSiswa(listItem)} variant="outlined" size="small">
                  Hapus dari list
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="h5" color="#000">
            Konfigurasi kelas
          </Typography>
          <Box p={1}>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'end',
                  gap: 3,
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <FormHelperText>Dari Jurusan</FormHelperText>
                  <TextField value={jurusan || ''} fullWidth disabled size="small" />
                </Box>
                <KeyboardDoubleArrowRightIcon sx={{ mb: 1 }} />
                <Box sx={{ width: '100%' }}>
                  <FormHelperText>Ke Jurusan</FormHelperText>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={jurusan || ''}
                    size="small"
                    // onChange={handleChangesJurusan}
                  >
                    {listJurusan?.data?.map((item, index) => (
                      <MenuItem onClick={() => setNewJurusanId(item?.id)} key={index} value={item?.nama}>
                        {item?.nama}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'end',
                  gap: 3,
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <FormHelperText>Dari Kelas</FormHelperText>
                  <TextField value={kelas || ''} fullWidth disabled size="small" />
                </Box>
                <KeyboardDoubleArrowRightIcon sx={{ mb: 1 }} />
                <Box sx={{ width: '100%' }}>
                  <FormHelperText>Ke Kelas</FormHelperText>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size="small"
                    onChange={(event) => setNewKelas(event.target.value)}
                  >
                    <MenuItem value={'10'}>10</MenuItem>
                    <MenuItem value={'11'}>11</MenuItem>
                    <MenuItem value={'12'}>12</MenuItem>
                  </Select>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'end',
                  gap: 3,
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <FormHelperText>Dari Sub Kelas</FormHelperText>
                  <TextField value={subKelas || ''} fullWidth disabled size="small" />
                </Box>
                <KeyboardDoubleArrowRightIcon sx={{ mb: 1 }} />
                <Box sx={{ width: '100%' }}>
                  <FormHelperText>Ke Sub Kelas</FormHelperText>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size="small"
                    onChange={(event) => setNewSubKelas(event.target.value)}
                  >
                    <MenuItem value={'01'}>1</MenuItem>
                    <MenuItem value={'02'}>2</MenuItem>
                    <MenuItem value={'03'}>3</MenuItem>
                    <MenuItem value={'04'}>4</MenuItem>
                    <MenuItem value={'05'}>5</MenuItem>
                    <MenuItem value={'06'}>6</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </ScreenDialog>
    </div>
  );
}

export default KenaikanKelas;
