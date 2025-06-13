import { Box, Button, CircularProgress, Link, Tooltip, Typography } from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { grey, red } from '@mui/material/colors';
import { themeAppColors } from '../../../theme/themeAppColor';
import MutationCampaign from './MutationCampaign';
import useMutationDelete from '../../../hooks/useMutationDelete';
import { Dialog } from '../../../hooks/useContextHook';
import PreviewResponCampaign from './PreviewResponCampaign';
import useQueryFetch from '../../../hooks/useQueryFetch';
import ContainerCard from '../../../components/ContainerCard';

function Campaign() {
  const { setDialog } = React.useContext(Dialog);
  const [openModal, setOpenModal] = React.useState(false);
  const [previewResponCampaign, setPreviewResponCampaign] = React.useState({ isOpen: false, data: {} });
  const [dataEdit, setDataEdit] = React.useState({});
  const {
    items,
    isLoading,
    refetch: refetchCampaign,
  } = useQueryFetch({
    module: 'campaign',
    invalidateKey: 'campaign',
  });
  const mutationDelete = useMutationDelete({
    module: 'campaign',
  });
  const handleDelete = (item) => {
    setDialog((i) => ({
      title: 'Apakah anda yakin ingin menghapus pengumuman ini?',
      labelClose: 'Batal',
      labelSubmit: 'Ya',
      fullWidth: false,
      do: () => {
        mutationDelete.mutate({ id: item?.id });
      },
      isCloseAfterSubmit: true,
    }));
  };

  return (
    <ContainerCard>
      <Box>
        <MutationCampaign
          setDataEdit={setDataEdit}
          dataEdit={dataEdit}
          openModalCreate={openModal}
          setOpenModalCreate={setOpenModal}
        />
        <PreviewResponCampaign
          refetchCampaign={refetchCampaign}
          setDialog={setDialog}
          open={previewResponCampaign}
          setOpen={setPreviewResponCampaign}
        />
        {!isLoading && (
          <Box>
            <Button onClick={() => setOpenModal(true)} variant="contained">
              Buat pengumuman
            </Button>
          </Box>
        )}

        <Box display="grid" gap={2} mt={3}>
          {isLoading ? (
            <Box
              sx={{
                justifyContent: 'center',
                py: 3,
                alignItems: 'center',
                display: 'flex',
                gap: 2,
                mt: 10,
              }}
            >
              <CircularProgress /> <span>Memuat</span>
            </Box>
          ) : items?.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 3, display: 'grid' }}>
              <Typography variant="h6" color={grey[600]}>
                Tidak ada pengumuman
              </Typography>
              <Typography variant="body" color={grey[600]}>
                sepertinya anda belum membuat pengumuman
              </Typography>
              <Typography variant="body" mt="-5px" color={grey[600]}>
                admin hanya bisa membuat 5 pengumuman
              </Typography>
            </Box>
          ) : (
            items?.map((item, index) => (
              <Box
                sx={{
                  bgcolor: item?.status === 'umum' ? themeAppColors.light : red[50],
                  p: 2,
                  minHeight: '200px',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                key={index}
              >
                <Box>
                  <Box color={item?.status === 'umum' ? themeAppColors.dark : red[800]}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography textTransform="capitalize" variant="h6">
                        {item?.title}
                      </Typography>
                      <Typography sx={{ fontSize: 14, textTransform: 'uppercase', fontWeight: 700 }}>
                        {item?.status}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography fontSize={12}>{`${item?.kelas || ''} ${item?.jurusan?.kode_jurusan || ''} ${
                        item?.sub_kelas || ''
                      } ${
                        !Boolean(item?.kelas) && !Boolean(item?.jurusan?.kode_jurusan) && !Boolean(item?.sub_kelas)
                          ? ''
                          : '/'
                      } ${item?.angkatan}`}</Typography>
                      {item?.is_response && <Box sx={{ width: '1px', bgcolor: grey[600], height: '12px' }} />}
                      {item?.is_response && (
                        <Typography fontSize={12}>
                          {item?.response_campaigns?.length === 0
                            ? 'tidak ada yang merespon'
                            : `${item?.response_campaigns?.length} siswa merespon`}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Typography fontStyle="italic" fontSize={13} mt={1}>
                      "{item?.text}""
                    </Typography>
                    {item?.is_response && (
                      <Link
                        onClick={() => setPreviewResponCampaign({ isOpen: true, data: item })}
                        fontSize={12}
                        sx={{ cursor: 'pointer', color: item?.status === 'umum' ? themeAppColors.dark : red[800] }}
                      >
                        click disini untuk melihat respon siswa
                      </Link>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Tooltip title="Hapus">
                    <Button
                      disabled={mutationDelete.isLoading}
                      onClick={() => handleDelete(item)}
                      size="small"
                      sx={{ minWidth: 0, minHeight: 0, p: 0 }}
                      variant="contained"
                      color="error"
                    >
                      <DeleteIcon sx={{ width: 15, height: 15, m: '5px' }} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <Button
                      onClick={() => {
                        setDataEdit(item);
                        setOpenModal(true);
                      }}
                      color="info"
                      size="small"
                      sx={{ minWidth: 0, minHeight: 0, p: 0 }}
                      variant="contained"
                    >
                      <ModeEditOutlineIcon sx={{ width: 15, height: 15, m: '5px' }} />
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </ContainerCard>
  );
}

export default Campaign;
