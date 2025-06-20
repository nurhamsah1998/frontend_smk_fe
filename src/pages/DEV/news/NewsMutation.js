/* eslint-disable import/no-unresolved */
import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState, useTransition } from 'react';
import { cyan } from '@mui/material/colors';
import PhotoIcon from '@mui/icons-material/Photo';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from 'src/hooks/api';
import { useSnackbar } from 'notistack';
import SelectComponent from 'src/components/SelectComponent';
import useQueryFetch from 'src/hooks/useQueryFetch';
import WangTextEditor from './WangTextEditor';

function NewsMutation() {
  const [html, setHtml] = useState('');
  const [files, setFiles] = React.useState({});
  const [transition, onTransition] = useTransition();
  const { enqueueSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState({
    title: '',
    isPublish: true,
    isPrivate: false,
    thumbnail: null,
  });
  const { id } = useParams();
  const { isLoading, refetch, isFetching } = useQueryFetch({
    module: `my-news/${id}`,
    invalidateKey: `my-news/${id}`,
    disabledParamInit: true,
    enabled: false,
    next: (res) => {
      const { html, title, isPublish, isPrivate, thumbnail } = res?.data?.data;
      setFormValues({ title, isPublish, isPrivate, thumbnail });
      setHtml(html);
    },
  });
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);
  const nav = useNavigate();
  const location = useLocation();
  const handleCancel = (params) => {
    setFormValues({ title: '', isPublish: false, isPrivate: true, thumbnail: null });
    nav(-1);
  };
  const handleSave = () => {
    onTransition(async () => {
      try {
        const token = window.localStorage.getItem('accessToken');
        const formData = new FormData();
        if (files?.name) {
          formData.append('thumbnail', files);
        }
        formData.append('html', html ?? null);
        formData.append('title', formValues.title ?? null);
        formData.append('isPublish', formValues.isPublish);
        formData.append('isPrivate', formValues.isPrivate);
        const res = await axios[id ? 'patch' : 'post'](`${apiUrl}my-news${id ? `/${id}` : ''}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${token}`,
          },
        });
        setHtml('');
        setFormValues({ title: '', isPublish: false, isPrivate: true, thumbnail: null });
        nav(`${location.pathname?.replace(`/${id}`, '').replace(id ? 'update-news' : 'create-news', '')}my-news`);

        enqueueSnackbar(res?.data?.msg || 'Berhasil', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(error?.response?.data?.msg || error?.message || 'Gagal', { variant: 'error' });
      }
    });
  };
  return (
    <Box>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField
          value={formValues.title}
          onChange={(i) => setFormValues((prev) => ({ ...prev, title: i.target.value }))}
          size="small"
          label="Judul berita"
          fullWidth
        />
        {/* THUMBNAIL */}
        <Box
          sx={{
            bgcolor: cyan[100],
            p: 1,
            minHeight: '210px',
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
            accept=".png,.jpg"
          />
          {formValues?.thumbnail && id && !files?.name ? (
            <Box>
              <img
                src={`${apiUrl}news-thumbnail/${formValues?.thumbnail}`}
                style={{
                  height: '200px',
                }}
                alt="thumbnail"
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: `dashed 1px ${cyan[700]}`,
                p: '20px 60px',
                borderRadius: '10px',
              }}
            >
              {files?.name && (
                <img
                  src={files?.name ? URL.createObjectURL(files) : '/'}
                  style={{
                    height: '200px',
                  }}
                  alt="thumbnail"
                />
              )}

              <Typography
                sx={{
                  color: cyan[800],
                }}
              >
                {files?.name || 'Import file berformat .png atau .jpg'}
              </Typography>
            </Box>
          )}
        </Box>

        <WangTextEditor html={html} setHtml={setHtml} />
        <SelectComponent
          size="small"
          value={formValues.isPublish}
          onChange={(i) => setFormValues((prev) => ({ ...prev, isPublish: i.target.value }))}
          placeholder="Langsung publish?"
          listSelect={[
            {
              value: true,
              label: 'Tampilkan',
            },
            {
              value: false,
              label: 'Sembuyikan',
            },
          ]}
        />
        <SelectComponent
          size="small"
          value={formValues.isPrivate}
          onChange={(i) => setFormValues((prev) => ({ ...prev, isPrivate: i.target.value }))}
          placeholder="Mode"
          listSelect={[
            {
              value: true,
              label: 'Private (hanya siswa dan staff yang bisa akses)',
            },
            {
              value: false,
              label: 'Public (bisa diakses semua orang)',
            },
          ]}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          sx={{ mt: 4 }}
          disabled={transition || (isLoading && isFetching)}
          variant="outlined"
          onClick={handleCancel}
          color="error"
        >
          Batal
        </Button>
        <Button
          fullWidth
          sx={{ mt: 4 }}
          disabled={transition || (isLoading && isFetching)}
          variant="contained"
          onClick={handleSave}
        >
          Simpan
        </Button>
      </Box>
    </Box>
  );
}

export default NewsMutation;
