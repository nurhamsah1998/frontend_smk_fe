/* eslint-disable import/no-unresolved */
import React from 'react';
import ContainerCard from 'src/components/ContainerCard';
import { Box, Container } from '@mui/material';
import useQueryFetch from 'src/hooks/useQueryFetch';
import PublicFooter from 'src/components/PublicFooter';
import PublicAppBar from 'src/components/PublicAppBar';
import { ViewAllNews } from './DEV/news/AllNews';

function PublicNews() {
  const { items, isLoading } = useQueryFetch({
    module: 'public-news',
    invalidateKey: 'public-news',
  });
  const handleClickCard = (item) => {
    window.location.href = `/news/${item?.id}`;
  };
  return (
    <Box>
      <PublicAppBar />
      <Container sx={{ mt: 3, minHeight: 'calc(100dvh - 272px)' }}>
        <ContainerCard>
          <ViewAllNews isLoading={isLoading} handleClickCard={handleClickCard} items={items} />
        </ContainerCard>
      </Container>
      <PublicFooter />
    </Box>
  );
}

export default PublicNews;
