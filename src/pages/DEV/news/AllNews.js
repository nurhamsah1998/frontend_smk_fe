/* eslint-disable import/no-unresolved */
import { Box, CircularProgress, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react';
import useQueryFetch from 'src/hooks/useQueryFetch';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { useLocation, useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';

import CardNews from './CardNews';

export const ViewAllNews = ({ isLoading, items = [], handleClickCard = () => {} }) => (
  <Box>
    <Grid container spacing={2}>
      {isLoading ? (
        <Grid xs={12} item>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CircularProgress />
          </Box>
        </Grid>
      ) : items?.length !== 0 ? (
        items?.map((item, index) => (
          <Grid item key={index}>
            <CardNews handleClickCard={() => handleClickCard(item)} item={item} />
          </Grid>
        ))
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '100%', md: 'fit-content' },
          }}
        >
          <NewspaperIcon sx={{ width: 80, height: 80, color: grey[700] }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography lineHeight={1.5} variant="h6" color={grey[700]}>
              Tidak ada berita terbaru hari ini
            </Typography>
            <Typography width="100%" lineHeight={1} textAlign="center" color={grey[600]} variant="caption">
              periksa secara berkala
            </Typography>
          </Box>
        </Box>
      )}
    </Grid>
  </Box>
);
function AllNews() {
  const { items, isLoading } = useQueryFetch({
    module: 'news',
    invalidateKey: 'news',
  });
  const nav = useNavigate();
  const location = useLocation();
  const handleClickCard = (item) => {
    nav(`${location.pathname}/detail/${item?.id}`);
  };
  return <ViewAllNews isLoading={isLoading} handleClickCard={handleClickCard} items={items} />;
}

export default AllNews;
