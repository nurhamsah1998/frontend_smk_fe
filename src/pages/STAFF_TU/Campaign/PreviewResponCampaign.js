import * as React from 'react';
import { Box, Button, CircularProgress, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import InfoIcon from '@mui/icons-material/Info';
import { grey, green, red, orange, blue } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import ScreenDialog from '../../../components/ScreenDialog';
import useFetch from '../../../hooks/useFetch';
import useMutationDelete from '../../../hooks/useMutationDelete';

export default function PreviewResponCampaign({ open, setOpen, setDialog, refetchCampaign }) {
  const handleClose = () => {
    setOpen({ isOpen: false, data: {} });
  };
  const { items, refetch, isLoading } = useFetch({
    module: `response-campaign?campaign_id=${open?.data?.id ? open?.data?.id : ''}`,
    isCustom: true,
    enabled: Boolean(open?.data?.id),
  });
  const billStatus = [
    {
      name: 'deposit',
      title: 'DEPOSIT',
      color: orange[700],
      bgcolor: orange[100],
    },
    {
      name: 'not_paid_yet',
      title: 'BELUM ADA TAGIHAN',
      color: grey[700],
      bgcolor: grey[300],
    },
    {
      name: 'paid',
      title: 'LUNAS',
      color: green[700],
      bgcolor: green[100],
    },
    {
      name: 'not_paid',
      title: 'BELUM LUNAS',
      color: red[700],
      bgcolor: red[100],
    },
  ];
  const itemsRebuild = React.useMemo(() => {
    return items?.map((i) => ({
      ...i,
      siswa: {
        ...i?.siswa,
        status_bill:
          i?.siswa?.current_bill < 0
            ? 'deposit'
            : i?.siswa?.current_bill > 0
            ? 'not_paid'
            : i?.siswa?.status_bill?.includes('not_paid_yet')
            ? 'not_paid_yet'
            : 'paid',
      },
    }));
  }, [items]);

  const mutationDelete = useMutationDelete({
    module: 'response-campaign',
    next: () => {
      refetch();
      refetchCampaign();
    },
  });
  const onClickDeleteResponseCampaign = (item) => {
    setDialog((i) => ({
      title: 'Apakah anda yakin ingin menghapus respon ini ?',
      labelClose: 'Batal',
      labelSubmit: 'Ya',
      fullWidth: false,
      do: () => {
        mutationDelete.mutate({ id: item?.id });
      },
      isCloseAfterSubmit: true,
    }));
  };
  React.useEffect(() => {
    if (open?.data?.id) {
      refetch();
    }
  }, [open.isOpen]);
  return (
    <>
      <ScreenDialog labelClose="tutup" handleClose={handleClose} title="Respon Siswa" open={open?.isOpen}>
        <Box display="grid" gap={1}>
          {isLoading ? (
            <Box
              sx={{
                justifyContent: 'center',
                py: 3,
                alignItems: 'center',
                display: 'flex',
                gap: 2,
              }}
            >
              <CircularProgress /> <span>Memuat</span>
            </Box>
          ) : itemsRebuild?.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 3, display: 'grid' }}>
              <Typography variant="h6" color={grey[600]}>
                Tidak ada respon
              </Typography>
              <Typography variant="body" color={grey[600]}>
                sepertinya belum ada yang merespon pengumuman ini
              </Typography>
            </Box>
          ) : (
            itemsRebuild?.map((item, index) => {
              const statusBillStudent = billStatus?.find((status) => status?.name === item?.siswa?.status_bill);
              return (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: grey[100],
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  key={index}
                >
                  <Box>
                    <Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography textTransform="capitalize" variant="h6">
                          {item?.title}
                        </Typography>
                        <Typography sx={{ fontSize: 14, textTransform: 'uppercase', fontWeight: 700 }}>
                          {item?.status}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}
                        gap={1}
                        alignItems="center"
                      >
                        <Typography fontSize={13} fontWeight={700}>{`${item?.siswa?.nama}`}</Typography>
                        <Box
                          sx={{
                            width: '1px',
                            bgcolor: grey[600],
                            height: '12px',
                          }}
                        />

                        <Typography
                          fontSize={13}
                        >{`${item?.siswa?.kelas} ${item?.siswa?.jurusan?.kode_jurusan} ${item?.siswa?.sub_kelas}`}</Typography>
                        <Box>
                          <Tooltip
                            title={
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography fontSize="12px">Status pembayaran : </Typography>
                                  <Box
                                    sx={{
                                      bgcolor: statusBillStudent?.bgcolor,
                                      color: statusBillStudent?.color,
                                      px: 1.5,
                                      borderRadius: '9px',
                                      width: 'fit-content',
                                    }}
                                  >
                                    <Typography fontSize="12px">{statusBillStudent?.title}</Typography>
                                  </Box>
                                </Box>
                              </Box>
                            }
                          >
                            <InfoIcon sx={{ width: 16, color: blue[500], pt: '5px' }} />
                          </Tooltip>
                        </Box>
                      </Box>
                      <Typography mt={-1} fontSize={12}>
                        {moment(item?.createdAt).format('DD MMM YYYY H:mm')}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography fontSize={13} mt={1} fontStyle="italic">
                        "{item?.text}"
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Tooltip title="Hapus">
                      <Button
                        disabled={mutationDelete.isLoading}
                        onClick={() => onClickDeleteResponseCampaign(item)}
                        size="small"
                        sx={{ minWidth: 0, minHeight: 0, p: 0 }}
                        variant="contained"
                        color="error"
                      >
                        <DeleteIcon sx={{ width: 15, height: 15, m: '5px' }} />
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </ScreenDialog>
    </>
  );
}
