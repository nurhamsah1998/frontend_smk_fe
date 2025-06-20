/* eslint-disable camelcase */
/* eslint-disable no-return-assign */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-unresolved */
import React, { useContext, useEffect, useRef } from 'react';
import { Grid, Typography, Box, Paper, Divider, Skeleton, Avatar, Button, TextField, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import useQueryFetch from 'src/hooks/useQueryFetch';
import CircularProgress from '@mui/material/CircularProgress';
import { fDateTime } from 'src/utils/formatTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { apiUrl } from 'src/hooks/api';
import { Editor } from '@wangeditor/editor-for-react';
import { useQueryClient } from '@tanstack/react-query';
import { grey, pink } from '@mui/material/colors';
import useMutationPost from 'src/hooks/useMutationPost';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getInitialName, randomColorInitialName } from 'src/utils/getInitialName';
import { LoadingButton } from '@mui/lab';
import useInfinityFetch from 'src/hooks/useInfinityFetch';
import { PROFILE } from 'src/hooks/useHelperContext';
import ListCommentItem from './ListCommentItem';
import '@wangeditor/editor/dist/css/style.css';
import RecommendedNews from './RecommendedNews';

export const styleImageHeader = {
  width: '100%',
  borderRadius: 2,
  mb: 2,
  bgcolor: '#f0f0f0',
  height: '400px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
export default function PrivateNewsDetail() {
  const { itemsNoPagination: itemProfile } = useContext(PROFILE);
  const { id } = useParams();
  const client = useQueryClient();
  const inputCommentRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
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
    itemData: commentList,
    fetchNextPage,
    isLoading: isLoadingComment,
    refetch: refetchComment,
    hasNextPage,
  } = useInfinityFetch({ api: `news-comment/${id}`, enabled: !isLoading });
  const { title, thumbnail, up_vote, down_vote, html, staf, createdAt } = itemsNoPagination?.data || {};
  const { is_already_comment, is_reacted } = itemsNoPagination || {};
  const mutationPostComment = useMutationPost({
    module: 'news-comment',
    disabledNotif: true,
    next: () => {
      refetchNews();
      refetchComment();
    },
  });

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
        <Grid item xs={12} md={12} lg={8}>
          <Paper sx={{ p: { xs: 1, md: 3 }, borderRadius: 2 }}>
            {isLoading ? (
              <Skeleton sx={{ height: 30 }} animation="wave" />
            ) : (
              <Typography variant="h4" textTransform="capitalize" lineHeight={1.2}>
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
            <Box sx={{ display: 'flex', mb: 3, mt: 1, alignItems: 'center', justifyContent: 'flex-start', gap: 0.5 }}>
              {isLoading ? (
                <Skeleton sx={{ height: 30, width: 20 }} animation="wave" />
              ) : (
                <IconButton
                  onClick={() => handleReaction('up_vote')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    p: 0.5,
                  }}
                >
                  <FavoriteIcon sx={{ width: 20, color: is_reacted === 'up_vote' ? pink[500] : 'inherit' }} />
                  <Typography variant="caption">{up_vote}</Typography>
                </IconButton>
              )}
              {isLoading ? (
                <Skeleton sx={{ height: 30, width: 20 }} animation="wave" />
              ) : (
                <IconButton
                  onClick={() => handleReaction('down_vote')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    p: 0.5,
                  }}
                >
                  <ThumbDownAltIcon sx={{ width: 20, color: is_reacted === 'down_vote' ? pink[500] : 'inherit' }} />
                  <Typography variant="caption">{down_vote}</Typography>
                </IconButton>
              )}
            </Box>
            {isLoading ? (
              <Box sx={styleImageHeader}>
                <CircularProgress />
              </Box>
            ) : !thumbnail ? (
              <Box sx={styleImageHeader}>
                <img
                  src="/assets/logo_pgri.png"
                  style={{
                    height: '200px',
                    opacity: '0.3',
                  }}
                  alt="logo_pic"
                />
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
                  style={{ overflowY: 'hidden' }}
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
              ) : commentList?.length !== 0 ? (
                commentList?.map((item, idx) => (
                  <ListCommentItem refetchComment={refetchComment} refetchNews={refetchNews} item={item} key={idx} />
                ))
              ) : (
                <Box>
                  <Typography sx={{ color: grey[600], textAlign: 'center' }}>
                    Belum ada komentar. jadilah yang pertama.
                  </Typography>
                </Box>
              )}
              {commentList.length !== 0 && (
                <LoadingButton
                  loading={isLoadingComment}
                  onClick={fetchNextPage}
                  variant="text"
                  sx={{
                    mt: 3,
                    display: hasNextPage ? 'block' : 'none',
                  }}
                >
                  Lihat komentar lainnya
                </LoadingButton>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Rekomendasi Berita */}
        <Grid
          item
          xs={12}
          md={12}
          lg={4}
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
              <RecommendedNews news_id={id} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
