import React from 'react';
import { TextField, Box, Typography, FormHelperText, Select, MenuItem } from '@mui/material';
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
  item,
  subKelas,
}) {
  const [newJurusanId, setNewJurusanId] = React.useState('');
  const [newKelas, setNewKelas] = React.useState('');
  const [newSubKelas, setNewSubKelas] = React.useState('');
  const { mutationPatch } = useMutationPatch({
    module: `status-kelas/${jurusanId}/${subKelas}/${kelas}`,
    isBulk: true,
  });
  const handleSubmit = () => {
    const body = {
      newJurusanId: newJurusanId || jurusanId,
      newKelas: newKelas || kelas,
      newSubKelas: newSubKelas || subKelas,
    };
    mutationPatch.mutate({ ...body, users: item });
  };
  const handleClose = () => {
    setOpenModalKenaikanKelas(false);
    setNewJurusanId('');
    setNewKelas('');
    setNewSubKelas('');
  };
  return (
    <div>
      <ScreenDialog
        disabledSubmitButton={!Boolean(newSubKelas) && !Boolean(newKelas) && !Boolean(newJurusanId)}
        open={openModalKenaikanKelas}
        labelClose="Batal"
        labelSubmit="Generate"
        handleSubmit={handleSubmit}
        handleClose={handleClose}
        title={`Kenaikan siswa kelas ${kelas} jurusan ${jurusan}`}
      >
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
                <MenuItem value={'01'}>1</MenuItem>
                <MenuItem value={'02'}>2</MenuItem>
                <MenuItem value={'03'}>3</MenuItem>
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
      </ScreenDialog>
    </div>
  );
}

export default KenaikanKelas;
