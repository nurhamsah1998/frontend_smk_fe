/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import { Avatar, Box, Chip, IconButton, Typography } from '@mui/material';
import React, { memo, useContext } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CreateIcon from '@mui/icons-material/Create';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import { getInitialName, randomColorInitialName } from 'src/utils/getInitialName';
import { PROFILE } from 'src/hooks/useHelperContext';
import axios from 'axios';
import { apiUrl } from 'src/hooks/api';
import { useSnackbar } from 'notistack';
import useMutationDelete from 'src/hooks/useMutationDelete';
import { Dialog } from 'src/hooks/useContextHook';
import { grey, pink } from '@mui/material/colors';
import { fDateTime } from 'src/utils/formatTime';

function ListCommentItem({ item, refetchComment = () => {}, refetchNews = () => {} }) {
  const { setDialog } = useContext(Dialog);
  const { itemsNoPagination } = useContext(PROFILE);
  const { text, staf, siswa, up_vote, down_vote, is_author, createdAt } = item || {};
  const { enqueueSnackbar } = useSnackbar();
  const commentProfileName = siswa?.nama || staf?.nama || '';
  const mutationDelete = useMutationDelete({
    module: 'news-comment',
    next: () => {
      refetchComment();
      refetchNews();
    },
  });
  const isAuthor = itemsNoPagination?.id === (siswa?.id || staf?.id);
  const handleReaction = async (type) => {
    if (!itemsNoPagination?.id) return;
    const token = window.localStorage.getItem('accessToken');
    try {
      await axios.get(`${apiUrl}news-comment-reaction/${item?.id}/${type}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      refetchComment();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.msg || error?.message || 'Gagal', { variant: 'error' });
    }
  };

  const handleDeleteComment = (params) => {
    setDialog(() => ({
      helperText: `Apakah kamu yakin ingin menghapus komentar?`,
      title: 'Hapus',
      labelClose: 'Batal',
      variant: 'error',
      labelSubmit: 'Hapus',
      fullWidth: false,
      do: () => {
        mutationDelete.mutate({ id: item?.id });
      },
      isCloseAfterSubmit: true,
    }));
  };
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar
          sx={{
            border: () => `solid 2px #fff`,
            bgcolor: randomColorInitialName(commentProfileName),
            textTransform: 'capitalize',
          }}
        >
          {getInitialName(commentProfileName)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="subtitle2" textTransform="capitalize">
              {commentProfileName}
            </Typography>
            {is_author && <Chip size="small" sx={{ fontSize: '12px' }} label="Penulis" color="primary" />}
          </Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {text}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon sx={{ color: grey[500], width: 18 }} />
            <Typography variant="caption" color={grey[500]}>
              {fDateTime(createdAt)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              sx={{
                display: 'flex',
                gap: 0.5,
                alignItems: 'center',
              }}
              onClick={() => handleReaction('up_vote')}
              size="small"
              disabled={!itemsNoPagination?.id}
            >
              <FavoriteIcon
                sx={{
                  color: item?.is_reacted === 'up_vote' ? pink[500] : 'inherit',
                }}
                fontSize="small"
              />
              <Typography variant="caption">{up_vote}</Typography>
            </IconButton>
            <IconButton
              sx={{
                display: 'flex',
                gap: 0.5,
                alignItems: 'center',
              }}
              onClick={() => handleReaction('down_vote')}
              size="small"
              disabled={!itemsNoPagination?.id}
            >
              <ThumbDownAltIcon
                sx={{
                  color: item?.is_reacted === 'down_vote' ? pink[500] : 'inherit',
                }}
                fontSize="small"
              />
              <Typography variant="caption">{down_vote}</Typography>
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box>
        {/* {itemsNoPagination?.id && (
          <IconButton disabled color="success" size="small">
            <CreateIcon fontSize="small" />
          </IconButton>
        )} */}

        {isAuthor && itemsNoPagination?.id && (
          <IconButton disabled={!itemsNoPagination?.id} onClick={handleDeleteComment} color="error" size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default memo(ListCommentItem);
