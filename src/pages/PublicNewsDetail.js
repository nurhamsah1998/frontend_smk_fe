/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  CssBaseline,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
  Avatar,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import { themeAppColors } from 'src/theme/themeAppColor';
import useQueryFetch from 'src/hooks/useQueryFetch';
import CircularProgress from '@mui/material/CircularProgress';
import { fDateTime } from 'src/utils/formatTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { apiUrl } from 'src/hooks/api';
import { Editor } from '@wangeditor/editor-for-react';
import { useQueryClient } from '@tanstack/react-query';
import { grey, pink } from '@mui/material/colors';
import ListCommentItem from './DEV/news/ListCommentItem';

const beritaRekomendasi = [
  { id: 1, title: 'Lomba 17 Agustus', date: '12 Juni 2025' },
  { id: 2, title: 'Kegiatan Pramuka Mingguan', date: '10 Juni 2025' },
  { id: 3, title: 'Kunjungan Dinas Pendidikan', date: '08 Juni 2025' },
];

export default function PublicNewsDetail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const client = useQueryClient();
  const { itemsNoPagination, isLoading } = useQueryFetch({
    module: `public-news/${id}`,
    invalidateKey: `public-news/${id}`,
    disabledParamInit: true,
  });
  const {
    items,
    isLoading: isLoadingComment,
    refetch: refetchComment,
  } = useQueryFetch({
    module: `news-comment/${id}`,
    invalidateKey: `news-comment/${id}`,
    disabledParamInit: true,
  });
  const { title, thumbnail, up_vote, down_vote, html, staf, createdAt } = itemsNoPagination?.data || {};
  useEffect(() => {
    return () => {
      client.removeQueries([`public-news/${id}`]);
    };
  }, []);
  if (!title && !isLoading) return <Navigate to="/404" replace />;
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box>
            <img
              src="/assets/logo_pgri.png"
              style={{
                height: '50px',
              }}
              alt="logo_pic"
            />
          </Box>

          <Typography variant="h6" component="div">
            SMK PGRI KRASS
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Breadcrumb */}
      <Box sx={{ bgcolor: '#f9f9f9', py: 1, px: 2 }}>
        <Typography variant="body2">
          <Link href="/">Beranda</Link> &gt; <Link href="/berita">Berita</Link> &gt;
          <strong>{title}</strong>
        </Typography>
      </Box>

      {/* Konten utama */}
      <Container sx={{ mt: 3, minHeight: 'calc(100dvh - 272px)' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              {isLoading ? (
                <Skeleton sx={{ height: 30 }} animation="wave" />
              ) : (
                <Typography variant="h4" textTransform="capitalize">
                  {title}
                </Typography>
              )}
              {isLoading ? (
                <Skeleton sx={{ height: 20, width: '70%', mb: 2 }} animation="wave" />
              ) : (
                <Typography variant="subtitle1" color="text.secondary">
                  Dipublikasikan pada {fDateTime(createdAt)} oleh {staf?.nama}
                </Typography>
              )}
              <Box sx={{ display: 'flex', mb: 3, mt: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                {isLoading ? (
                  <Skeleton sx={{ height: 30, width: 20 }} animation="wave" />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <FavoriteIcon sx={{ color: grey[500] }} />
                    <Typography variant="caption">{up_vote}</Typography>
                  </Box>
                )}
                {/* {isLoading ? (
                  <Skeleton sx={{ height: 30, width: 20 }} animation="wave" />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <ChatBubbleIcon sx={{ color: grey[500] }} />
                    <Typography variant="caption">12</Typography>
                  </Box>
                )} */}
                {isLoading ? (
                  <Skeleton sx={{ height: 30, width: 20 }} animation="wave" />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <ThumbDownAltIcon sx={{ color: grey[500] }} />
                    <Typography variant="caption">{down_vote}</Typography>
                  </Box>
                )}
              </Box>
              {isLoading && !thumbnail ? (
                <Box
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    mb: 2,
                    bgcolor: '#f0f0f0',
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <img
                      src="/assets/logo_pgri.png"
                      style={{
                        height: '200px',
                        opacity: '0.3',
                      }}
                      alt="logo_pic"
                    />
                  )}
                </Box>
              ) : (
                <Box
                  component="img"
                  src={`${apiUrl}news-thumbnail/${thumbnail}`}
                  alt="Hero Image"
                  sx={{ width: '100%', borderRadius: 2, mb: 2 }}
                />
              )}

              {/* Ini konten yang ditampilkan dari WangEditor secara read-only */}
              <Box>
                {isLoading ? (
                  <Box
                    sx={{
                      py: 5,
                    }}
                  >
                    {Array(5)
                      .fill(1)
                      .map((_, index) => (
                        <Skeleton key={index} sx={{ height: 30 }} animation="wave" />
                      ))}
                  </Box>
                ) : (
                  <Editor
                    defaultConfig={{ readOnly: true }}
                    value={html || ''}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                  />
                )}
              </Box>
              <Box sx={{ my: 10 }}>
                <Typography variant="h6" gutterBottom>
                  Komentar
                </Typography>
                {/* List Komentar */}
                {isLoadingComment ? (
                  <Box>
                    <Skeleton sx={{ height: 50 }} animation="wave" />
                  </Box>
                ) : items?.length !== 0 ? (
                  items?.map((item, idx) => <ListCommentItem refetchComment={refetchComment} item={item} key={idx} />)
                ) : (
                  <Box>
                    <Typography sx={{ color: grey[600], textAlign: 'center' }}>Belum ada komentar.</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Rekomendasi Berita */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Berita Rekomendasi
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {isLoading ? (
                <Box>
                  <Skeleton sx={{ height: 60 }} animation="wave" />
                  <Skeleton sx={{ height: 60 }} animation="wave" />
                  <Skeleton sx={{ height: 60 }} animation="wave" />
                </Box>
              ) : (
                // beritaRekomendasi.map((item) => (
                //   <Box key={item.id} sx={{ mb: 2 }}>
                //     <Link href={`/berita/${item.id}`} underline="hover">
                //       <Typography variant="subtitle1">{item.title}</Typography>
                //     </Link>
                //     <Typography variant="caption" color="text.secondary">
                //       {item.date}
                //     </Typography>
                //   </Box>
                // ))
                <Box>
                  <Typography>Under development</Typography>
                  <Typography varian="caption" color="gray">
                    -
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: themeAppColors.main, color: 'white', mt: 4, py: 3 }}>
        <Container>
          <Typography variant="h6">SMK NEGERI CONTOH</Typography>
          <Typography variant="body2">Jl. Pendidikan No. 123, Jakarta</Typography>
          <Typography variant="body2">Telp: (021) 12345678 | Email: info@smkcontoh.sch.id</Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            &copy; 2025 SMK NEGERI CONTOH. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
