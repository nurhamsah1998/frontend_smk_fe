/* eslint-disable camelcase */
/* eslint-disable no-return-assign */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-unresolved */
import React, { useContext, useEffect, useRef } from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
  Avatar,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import { useParams } from 'react-router-dom';
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
import useMutationPost from 'src/hooks/useMutationPost';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getInitialName, randomColorInitialName } from 'src/utils/getInitialName';
import { PROFILE } from 'src/hooks/useHelperContext';
import ListCommentItem from './ListCommentItem';

const beritaRekomendasi = [
  { id: 1, title: 'Lomba 17 Agustus', date: '12 Juni 2025' },
  { id: 2, title: 'Kegiatan Pramuka Mingguan', date: '10 Juni 2025' },
  { id: 3, title: 'Kunjungan Dinas Pendidikan', date: '08 Juni 2025' },
];

export default function PrivateNewsDetail() {
  const theme = useTheme();
  const { itemsNoPagination: itemProfile } = useContext(PROFILE);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const client = useQueryClient();
  const inputCommentRef = useRef(null);
  const {
    itemsNoPagination,
    isLoading,
    refetch: refetchNews,
  } = useQueryFetch({
    module: `private-news/${id}`,
    invalidateKey: `private-news/${id}`,
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
  const { is_already_comment, is_reacted } = itemsNoPagination || {};
  const mutationPostComment = useMutationPost({
    module: 'news-comment',
    next: () => {
      refetchNews();
      refetchComment();
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const onClickComment = () => {
    mutationPostComment.mutate({
      text: inputCommentRef.current?.value || '',
      news_id: id,
    });
  };
  const handleReaction = async (type) => {
    const token = window.localStorage.getItem('accessToken');
    try {
      await axios.get(`${apiUrl}news-reaction/${id}/${type}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      refetchNews();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.msg || error?.message || 'Gagal', { variant: 'error' });
    }
  };
  useEffect(() => {
    return () => {
      client.removeQueries([`private-news/${id}`]);
    };
  }, []);
  return (
    <>
      {/* Konten utama */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
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
            <Box sx={{ display: 'flex', mb: 3, mt: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
              {isLoading ? (
                <Skeleton sx={{ height: 30, width: 20 }} animation="wave" />
              ) : (
                <IconButton
                  onClick={() => handleReaction('up_vote')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <FavoriteIcon sx={{ color: is_reacted === 'up_vote' ? pink[500] : 'inherit' }} />
                  <Typography variant="caption">{up_vote}</Typography>
                </IconButton>
              )}
              {/* {isLoading ? (
                <Skeleton sx={{ height: 30, width: 20 }} animation="wave" />
              ) : (
                <IconButton
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <ChatBubbleIcon sx={{ color: grey[500] }} />
                  <Typography variant="caption">12</Typography>
                </IconButton>
              )} */}
              {isLoading ? (
                <Skeleton sx={{ height: 30, width: 20 }} animation="wave" />
              ) : (
                <IconButton
                  onClick={() => handleReaction('down_vote')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <ThumbDownAltIcon sx={{ color: is_reacted === 'down_vote' ? pink[500] : 'inherit' }} />
                  <Typography variant="caption">{down_vote}</Typography>
                </IconButton>
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
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" gutterBottom>
                Komentar
              </Typography>

              {/* Input Komentar */}
              {!is_already_comment && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        border: () => `solid 2px #fff`,
                        bgcolor: randomColorInitialName(itemProfile?.nama),
                        textTransform: 'capitalize',
                      }}
                    >
                      {getInitialName(itemProfile?.nama)}
                    </Avatar>
                    <TextField
                      ref={inputCommentRef}
                      onChange={(i) => (inputCommentRef.current.value = i.target.value)}
                      fullWidth
                      multiline
                      minRows={3}
                      variant="outlined"
                      placeholder="Tulis komentar Anda..."
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                    <Button
                      disabled={mutationPostComment.isLoading || isLoading}
                      onClick={onClickComment}
                      variant="contained"
                      color="primary"
                    >
                      Kirim
                    </Button>
                  </Box>
                </Box>
              )}

              {/* List Komentar */}
              {isLoadingComment ? (
                <Box>
                  <Skeleton sx={{ height: 50 }} animation="wave" />
                </Box>
              ) : items?.length !== 0 ? (
                items?.map((item, idx) => (
                  <ListCommentItem refetchComment={refetchComment} refetchNews={refetchNews} item={item} key={idx} />
                ))
              ) : (
                <Box>
                  <Typography sx={{ color: grey[600], textAlign: 'center' }}>
                    Belum ada komentar. jadilah yang pertama.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Rekomendasi Berita */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            position: 'sticky',
            top: 0,
          }}
        >
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
                <Typography>Masih Belum didevelopment</Typography>
                <Typography varian="caption" color="gray">
                  Insyaallah next update
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
