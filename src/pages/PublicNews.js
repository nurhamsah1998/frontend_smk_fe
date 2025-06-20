/* eslint-disable import/no-unresolved */
import React from 'react';
import ContainerCard from 'src/components/ContainerCard';
import { Box, Container } from '@mui/material';
import PublicFooter from 'src/components/PublicFooter';
import PublicAppBar from 'src/components/PublicAppBar';
import { LoadingButton } from '@mui/lab';
import useInfinityFetch from 'src/hooks/useInfinityFetch';
import { ViewAllNews } from './DEV/news/AllNews';

function PublicNews() {
  const { itemData: items, fetchNextPage, isLoading, hasNextPage } = useInfinityFetch({ api: 'public-news' });
  const handleClickCard = (item) => {
    window.location.href = `/news/${item?.id}`;
  };
  return (
    <Box>
      <PublicAppBar />
      <Container sx={{ mt: 3, minHeight: 'calc(100dvh - 272px)' }}>
        <ContainerCard>
          <ViewAllNews isLoading={isLoading} handleClickCard={handleClickCard} items={items} />
          {items.length !== 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <LoadingButton
                loading={isLoading}
                onClick={fetchNextPage}
                variant="contained"
                sx={{
                  display: hasNextPage ? 'block' : 'none',
                }}
              >
                Lihat berita lainnya
              </LoadingButton>
            </Box>
          )}
        </ContainerCard>
      </Container>
      <PublicFooter />
    </Box>
  );
}

export default PublicNews;
