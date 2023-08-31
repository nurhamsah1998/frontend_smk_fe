import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { cyan, purple } from '@mui/material/colors';

import ScreenDialog from '../../../components/ScreenDialog';

function CreateImport({ openModalCreateImport, setOpenModalCreateImport }) {
  const [files, setFiles] = React.useState({});
  return (
    <div>
      <ScreenDialog
        labelClose="Batal"
        handleClose={() => setOpenModalCreateImport(false)}
        title="Tambah Siswa Secara Masal"
        open={openModalCreateImport}
      >
        <Box display="grid" gap={2}>
          <Box
            sx={{
              bgcolor: purple[100],
              height: '150px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: purple[800],
              }}
            >
              Unduh Template
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: cyan[100],
              height: '150px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <input
              onChange={(i) => {
                setFiles(i.target.files[0]);
              }}
              style={{
                position: 'absolute',
                opacity: '0',
                height: '100%',
                width: '100%',
                cursor: 'pointer',
              }}
              type="file"
            />
            <Typography
              variant="h4"
              sx={{
                color: cyan[800],
              }}
            >
              {files?.name || 'Import File.xlsx'}
            </Typography>
          </Box>
        </Box>
      </ScreenDialog>
    </div>
  );
}

export default CreateImport;
