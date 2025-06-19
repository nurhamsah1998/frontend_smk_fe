/* eslint-disable react/jsx-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import { Box, IconButton, Link, Typography } from '@mui/material';
import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import useQueryFetch from 'src/hooks/useQueryFetch';
import { fDateTime } from 'src/utils/formatTime';
import { grey } from '@mui/material/colors';

function PublicRecommendedNews({ news_id }) {
  const { items } = useQueryFetch({
    module: `news-public-recommended/${news_id}`,
    invalidateKey: `news-public-recommended/${news_id}`,
    disabledParamInit: true,
  });

  return (
    <Box>
      {items?.length !== 0 ? (
        items?.map((item, index) => (
          <Box key={index} sx={{ mb: 2, display: 'grid' }}>
            <Link href={`/news/${item?.id}`} underline="hover">
              <Typography variant="subtitle1" lineHeight={1}>
                {item?.title}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: 'primary', mt: 0.5 }} lineHeight={1}>
                {item?.html}
              </Typography>
            </Link>
            <Box sx={{ display: 'grid' }}>
              <Typography mt={1} variant="caption" color="text.secondary">
                {fDateTime(item?.createdAt)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    alignItems: 'center',
                  }}
                  size="small"
                  disabled
                >
                  <FavoriteIcon
                    sx={{
                      color: grey[500],
                    }}
                    fontSize="small"
                  />
                  <Typography variant="caption">{item?.up_vote}</Typography>
                </IconButton>
                <IconButton
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    alignItems: 'center',
                  }}
                  size="small"
                  disabled
                >
                  <ThumbDownAltIcon
                    sx={{
                      color: grey[500],
                    }}
                    fontSize="small"
                  />
                  <Typography variant="caption">{item?.down_vote}</Typography>
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Box py={3}>
          <Typography sx={{ color: grey[600], textAlign: 'center' }}>Belum ada berita rekomendasi</Typography>
        </Box>
      )}
    </Box>
  );
}

export default PublicRecommendedNews;
