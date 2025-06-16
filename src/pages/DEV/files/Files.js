/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
import Grid from '@mui/material/Grid';
import React from 'react';
import { Box, Typography } from '@mui/material';
import useQueryFetch from 'src/hooks/useQueryFetch';
import CardFile from './CardFile';
import ContainerCard from 'src/components/ContainerCard';

function Files() {
  const { itemsNoPagination, isLoading, refetch } = useQueryFetch({
    module: 'files',
    invalidateKey: 'files_none',
  });
  const { files } = itemsNoPagination || {};
  return (
    <ContainerCard>
      <Box sx={{ mb: 3, minHeight: 'calc(100dvh - 245px)' }}>
        <Typography variant="h4">Ini merupakan list file yang berada di server</Typography>

        <Grid
          container
          direction="row"
          spacing={2}
          sx={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {isLoading ? (
            <Grid
              sx={{
                textAlign: 'center',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                mt: 25,
              }}
            >
              <Typography>Memuat file...</Typography>
            </Grid>
          ) : files?.length !== 0 ? (
            files?.map((item, index) => <CardFile refetchFiles={refetch} key={index} item={item} />)
          ) : (
            <Grid
              sx={{
                textAlign: 'center',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                mt: 25,
              }}
            >
              <Typography>Tidak ada file pada server.</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </ContainerCard>
  );
}

export default Files;
