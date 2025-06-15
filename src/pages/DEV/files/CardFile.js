/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import React from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { green, red } from '@mui/material/colors';
import { Tooltip } from '@mui/material';
import useQueryFetch from 'src/hooks/useQueryFetch';
import { useSnackbar } from 'notistack';
import { Dialog } from '../../../hooks/useContextHook';

function CardFile({ item, refetchFiles }) {
  const { setDialog } = React.useContext(Dialog);
  const isXlsx = item?.fileName?.includes('.xlsx');
  // const {
  //   refetch: downloadFile,
  //   isLoading: isLoadingDownload,
  //   isFetching: isFetchingDownload,
  // } = useQueryFetch({
  //   module: `download-files?path=${item?.fileLocation}`,
  //   invalidateKey: `download-files?path=${item?.fileLocation}_none`,
  //   enabled: false,
  //   disabledParamInit: true,
  //   next: (res) => {
  /// https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
  //     const url = URL.createObjectURL(new Blob([res?.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', `${item?.fileName}`);
  //     document.body.appendChild(link);
  //     link.click();
  //   },
  // });

  const { enqueueSnackbar } = useSnackbar();
  const {
    refetch: deleteFile,
    isLoading: isLoadingDelete,
    isFetching: isFetchingDelete,
  } = useQueryFetch({
    module: `delete-files?path=${item?.fileLocation}`,
    invalidateKey: `delete-files?path=${item?.fileLocation}_none`,
    enabled: false,
    disabledParamInit: true,
    next: (res) => {
      enqueueSnackbar(res?.data?.msg || 'success', { variant: 'success' });
      refetchFiles();
    },
    fail: (error) => {
      enqueueSnackbar(error?.response?.msg || 'error', { variant: 'error' });
    },
  });
  const handleDeleteFile = () => {
    setDialog(() => ({
      title: 'Apakah anda yakin ingin menghapus file ini?',
      labelClose: 'Batal',
      labelSubmit: 'Ya',
      fullWidth: false,
      do: () => {
        deleteFile();
      },
      isCloseAfterSubmit: true,
    }));
  };
  return (
    <Tooltip title={item?.fileName || ''}>
      <Grid item>
        <Card sx={{ maxWidth: 240 }}>
          <CardContent sx={{ pb: 2 }}>
            {isXlsx ? (
              <InsertDriveFileIcon sx={{ color: green[500], width: 40, height: 40 }} />
            ) : (
              <PictureAsPdfIcon sx={{ color: red[500], width: 40, height: 40 }} />
            )}
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item?.fileName}
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 3, pb: 3 }}>
            <Button
              disabled={isLoadingDelete && isFetchingDelete}
              onClick={handleDeleteFile}
              size="small"
              color="error"
              variant="outlined"
            >
              Hapus
            </Button>
            {/* <Button
              disabled={isLoadingDownload && isFetchingDownload}
              onClick={() => {
                downloadFile();
              }}
              size="small"
              color="info"
              variant="outlined"
            >
              Unduh
            </Button> */}
          </CardActions>
        </Card>
      </Grid>
    </Tooltip>
  );
}

export default React.memo(CardFile);
