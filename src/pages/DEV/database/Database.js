/* eslint-disable import/no-unresolved */
import { Box, Button } from '@mui/material';
import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import ContainerCard from 'src/components/ContainerCard';
import useQueryFetch from 'src/hooks/useQueryFetch';

function Database() {
  const {
    refetch: backupDB,
    isLoading: isLoadingDB,
    isFetching: isFetchingDB,
  } = useQueryFetch({
    module: `database-backup`,
    invalidateKey: `database-backup_none`,
    enabled: false,
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
    },
  });
  return (
    <ContainerCard>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
    </ContainerCard>
  );
}

export default Database;
