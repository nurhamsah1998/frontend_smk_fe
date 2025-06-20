/* eslint-disable import/no-unresolved */
import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import ContainerCard from 'src/components/ContainerCard';
import useQueryFetch from 'src/hooks/useQueryFetch';
import { useSnackbar } from 'notistack';
import { themeAppColors } from 'src/theme/themeAppColor';

function Database() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    refetch: backupDB,
    isLoading: isLoadingDB,
    isFetching: isFetchingDB,
  } = useQueryFetch({
    module: `database-backup`,
    invalidateKey: `database-backup_none`,
    enabled: false,
    retry: false,
    disabledParamInit: true,
    next: (res) => {
      /// https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
      const url = URL.createObjectURL(new Blob([res?.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `backup-smk-payment-app-${new Date().toLocaleDateString()?.replaceAll('/', '_')}.sql`
      );
      document.body.appendChild(link);
      link.click();
      enqueueSnackbar('Backup berhasil', { variant: 'success' });
    },
    fail: () => {
      enqueueSnackbar('Backup gagal. ada kesalahan server', { variant: 'error' });
    },
  });

  const { itemsNoPagination, isLoading } = useQueryFetch({
    module: 'server-info',
    invalidateKey: 'server-info',
    // next: () => {
    //   setProgress(60);
    // },
  });
  // const [progress, setProgress] = useState(60);
  // useEffect(() => {
  //   const timeInterval = setTimeout(() => {
  //     if (progress === 0 && !isLoading) {
  //       refetch();
  //     } else if (!isLoading) {
  //       // eslint-disable-next-line no-return-assign
  //       setProgress((prev) => (prev -= 1));
  //     }
  //   }, 1000);
  //   return () => {
  //     clearTimeout(timeInterval);
  //   };
  // }, [progress, isLoading]);

  return (
    <ContainerCard>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 5 }}>
        <Button
          disabled={isLoadingDB && isFetchingDB}
          startIcon={<DownloadIcon />}
          onClick={() => {
            backupDB();
          }}
          variant="contained"
        >
          Backup Database
        </Button>
      </Box>
      {/* <Box
        sx={{
          width: '100%',
          height: 30,
          borderRadius: 1,
          bgcolor: '#cdcdcd',
          position: 'relative',
          overflow: 'hidden',
          mb: 3,
        }}
      >
        {progress === 0 && (
          <Typography
            sx={{
              position: 'absolute',
              top: 5,
              left: 10,
              color: 'gray',
            }}
            variant="caption"
          >
            Memuat ulang...
          </Typography>
        )}

        <Box
          sx={{
            width: `${Math.ceil(1.66 * progress)}%`,
            height: 30,
            borderRadius: 1,
            bgcolor: themeAppColors.main,
            transition: '0.5s all',
            display: 'flex',
            justifyContent: 'flex-end',
            pr: 1,
            alignItems: 'center',
            color: '#fff',
          }}
        >
          <Typography variant="subtitle2">{progress}</Typography>
        </Box>
      </Box> */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h4" color={themeAppColors.main}>
            CPU
          </Typography>
          {isLoading ? (
            <Typography variant="subtitle2">Memuat...</Typography>
          ) : (
            <Box component="ul" sx={{ listStyleType: 'none' }}>
              <Box component="li">
                Brand : {itemsNoPagination?.cpu?.manufacturer} {itemsNoPagination?.cpu?.brand}
              </Box>
              <Box component="li">Cores : {itemsNoPagination?.cpu?.cores}</Box>
              <Box component="li">Waktu server berjalan : {itemsNoPagination?.up_time}</Box>
            </Box>
          )}
        </Box>
        <Box>
          <Typography variant="h4" color={themeAppColors.main}>
            MEMORY
          </Typography>
          {isLoading ? (
            <Typography variant="subtitle2">Memuat...</Typography>
          ) : (
            <Box component="ul" sx={{ listStyleType: 'none' }}>
              <Box component="li">Total : {itemsNoPagination?.memory?.total}</Box>
              <Box component="li">Used : {itemsNoPagination?.memory?.used}</Box>
              <Box component="li">Free : {itemsNoPagination?.memory?.free}</Box>
            </Box>
          )}
        </Box>
      </Box>
    </ContainerCard>
  );
}

export default Database;
