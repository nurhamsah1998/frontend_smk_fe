/* eslint-disable arrow-body-style */
import React from 'react';
import { Box, Typography } from '@mui/material';
import { cyan, purple, red } from '@mui/material/colors';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { apiUrl } from '../../../hooks/api';

import ScreenDialog from '../../../components/ScreenDialog';
import { LabelField } from '../../../components/Commons';
import AutoCompleteAsync from '../../../components/Core/AutoCompleteAsync';

function CreateImport({ openModalCreateImport, setOpenModalCreateImport, refetch }) {
  const [files, setFiles] = React.useState({});
  const token = window.localStorage.getItem('accessToken');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState([]);
  const [angkatan, setAngkatan] = React.useState('');
  const { enqueueSnackbar } = useSnackbar();
  const handleImport = async () => {
    if (!angkatan?.tahun_angkatan) {
      enqueueSnackbar('Siswa untuk angkatan tidak boleh kosong', { variant: 'error' });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('xlsx', files);
    formData.append('tahun_angkatan', angkatan?.tahun_angkatan ?? null);
    await axios
      .post(`${apiUrl}import-akun-siswa`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFiles({});
        enqueueSnackbar('Import berhasil', { variant: 'success' });
        setError([]);
        refetch();
      })
      .catch((error) => {
        console.log(error);
        setError(error?.response?.data?.message || []);
      })
      .finally(() => {
        setLoading(false);
        setOpenModalCreateImport(false);
        setFiles({});
        setAngkatan('');
      });
  };
  const handleChangeAngkatan = (x, event) => {
    setAngkatan({ tahun_angkatan: String(event?.tahun_angkatan) });
  };

  const handleDownloadTemplate = async () => {
    /// https://stackoverflow.com/a/64545660/18038473
    window.location.href = `${apiUrl}download/template-import-siswa`;
  };
  return (
    <div>
      <ScreenDialog
        variant="error"
        open={Boolean(error?.length)}
        labelClose="Tutup"
        handleClose={() => {
          setError([]);
          setFiles({});
        }}
        title="Upload dibatalkan"
      >
        {error?.map((item, index) => {
          return (
            <Box key={index}>
              <Typography color={red[500]}>{item}</Typography>
            </Box>
          );
        })}
      </ScreenDialog>
      <ScreenDialog
        labelClose="Batal"
        labelSubmit="Import File"
        handleSubmit={handleImport}
        isLoading={loading}
        handleClose={() => {
          setOpenModalCreateImport(false);
          setFiles({});
        }}
        title="Tambah Siswa Secara Masal"
        open={openModalCreateImport}
      >
        <Box display="grid" gap={2}>
          <Box
            onClick={handleDownloadTemplate}
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: `dashed 1px ${purple[800]}`,
                p: '20px 60px',
                borderRadius: '10px',
              }}
            >
              <FileDownloadIcon
                sx={{
                  color: purple[800],
                }}
              />
              <Typography
                sx={{
                  color: purple[800],
                }}
              >
                Unduh file template import siswa
              </Typography>
            </Box>
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
              name="xlsx"
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
              accept=".xlsx"
              type="file"
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: `dashed 1px ${cyan[800]}`,
                p: '20px 60px',
                borderRadius: '10px',
              }}
            >
              <InsertDriveFileIcon
                sx={{
                  color: cyan[800],
                }}
              />
              <Typography
                sx={{
                  color: cyan[800],
                }}
              >
                {files?.name || 'Import file berformat .xlsx'}
              </Typography>
            </Box>
          </Box>
          {files?.name && (
            <Box sx={{ minWidth: '100px' }}>
              <LabelField
                title="Siswa untuk angkatan ?"
                clearIcon={Boolean(angkatan)}
                onClickClearIcon={() => setAngkatan('')}
              />
              <AutoCompleteAsync
                size="small"
                keyAttribute="tahun_angkatan"
                paginateData
                initialLimit={5}
                value={angkatan || {}}
                module="tahun-angkatan"
                type="number"
                onChange={(x, y) => handleChangeAngkatan(x, y)}
              />
            </Box>
          )}
        </Box>
      </ScreenDialog>
    </div>
  );
}

export default CreateImport;
