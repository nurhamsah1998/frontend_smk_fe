/* eslint-disable import/no-unresolved */
import { Box, Grid } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useQueryFetch from 'src/hooks/useQueryFetch';
import CardNews from 'src/pages/DEV/news/CardNews';

function AllNews() {
  const { items } = useQueryFetch({
    module: 'news',
    invalidateKey: 'news',
  });
  const nav = useNavigate();
  const handleClickCard = (item) => {
    nav(`/siswa/news/detail/${item?.id}`);
  };
  return (
    <Box>
      <Grid container spacing={2}>
        {items?.map((item, index) => (
          <Grid item key={index}>
            <CardNews handleClickCard={handleClickCard} item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AllNews;
