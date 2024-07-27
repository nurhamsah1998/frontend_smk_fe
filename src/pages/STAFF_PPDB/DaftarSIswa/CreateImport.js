import React from 'react';
import { Box, Typography } from '@mui/material';
import { cyan, purple, red } from '@mui/material/colors';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { apiUrl } from '../../../hooks/api';

import ScreenDialog from '../../../components/ScreenDialog';

function CreateImport({ openModalCreateImport, setOpenModalCreateImport, refetch }) {
  const [files, setFiles] = React.useState({});
  const token = window.localStorage.getItem('accessToken');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({ open: false, message: [], title: '', type: '' });
  const { enqueueSnackbar } = useSnackbar();
  const handleImport = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('xlsx', files);
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
        refetch();
      })
      .catch((error) => {
        console.log(error);
        setError({
          open: true,
          message: error?.response?.data?.message || error?.response?.data || 'Internal server error !',
          type: error?.response?.data?.code,
          title: 'Gagal upload file',
        });
      })
      .finally(() => {
        setLoading(false);
        setOpenModalCreateImport(false);
        setFiles({});
      });
  };
  const handleDownloadTemplate = async () => {
    /// https://stackoverflow.com/a/64545660/18038473
    window.location.href = `${apiUrl}download/template-import-siswa`;
  };
  return (
    <div>
      <ScreenDialog
        type="error"
        open={error.open}
        labelClose="Tutup"
        handleClose={() => {
          setError({ open: false, message: [], title: '', type: '' });
          setFiles({});
        }}
        title={error.title}
      >
        {error.type === 'error_validation' &&
          error?.message?.map((item, index) => {
            return (
              <Box key={index}>
                <Typography color={red[500]}>
                  Column {item?.row} Row {item?.column}, tidak boleh kosong!
                </Typography>
              </Box>
            );
          })}
        {error.type?.includes('error_validation_no_data') && (
          <Box>
            <Typography color={red[500]}>{error?.message}</Typography>
          </Box>
        )}
        {error.type?.includes('server') && (
          <Box>
            <Typography color={red[500]}>{error?.message}</Typography>
          </Box>
        )}
        {error.message?.includes('Forbidden') && (
          <Box>
            <Typography color={red[500]}>Token issue FORBIDDEN !!</Typography>
          </Box>
        )}
        {error.type?.includes('error_inject_username') &&
          error?.message?.map((item, index) => {
            return (
              <Box key={index}>
                <Typography color={red[500]}>
                  Username{' '}
                  <span
                    style={{
                      color: '#000',
                    }}
                  >
                    {item?.username}
                  </span>{' '}
                  dibagian Column {item?.row} Row {item?.column}, sudah terdaftar di database !
                </Typography>
              </Box>
            );
          })}
        {error.type?.includes('error_inject_username_unique') &&
          error?.message?.map((item, index) => {
            return (
              <Box key={index}>
                <Typography color={red[500]}>
                  Username{' '}
                  <span
                    style={{
                      color: '#000',
                    }}
                  >
                    {item?.username}
                  </span>{' '}
                  dibagian Column {item?.row} Row {item?.column}, Harus unique/berbeda!
                </Typography>
              </Box>
            );
          })}
        {error.type?.includes('error_inject_jurusan') &&
          error?.message?.map((item, index) => {
            return (
              <Box key={index}>
                <Typography color={red[500]}>
                  Jurusan{' '}
                  <span
                    style={{
                      color: '#000',
                    }}
                  >
                    {item?.kode_jurusan}
                  </span>{' '}
                  dibagian Column {item?.row} Row {item?.column}, tidak valid!
                </Typography>
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
        </Box>
      </ScreenDialog>
    </div>
  );
}

export default CreateImport;
