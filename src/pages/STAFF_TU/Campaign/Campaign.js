import { Box, Button, Skeleton, Typography } from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { grey, red } from '@mui/material/colors';

import { themeAppColors } from '../../../theme/themeAppColor';
import MutationCampaign from './MutationCampaign';
import useFetch from '../../../hooks/useFetch';
import useMutationDelete from '../../../hooks/useMutationDelete';
import { Dialog } from '../../../hooks/useContextHook';

function Campaign() {
  const { setDialog } = React.useContext(Dialog);
  const [openModal, setOpenModal] = React.useState(false);
  const [dataEdit, setDataEdit] = React.useState({});
  const { items, isLoading } = useFetch({
    module: 'campaign',
    isCustom: true,
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
    <Box>
      <MutationCampaign
        setDataEdit={setDataEdit}
        dataEdit={dataEdit}
        openModalCreate={openModal}
        setOpenModalCreate={setOpenModal}
      />
      <Box>
        <Button onClick={() => setOpenModal(true)} variant="contained">
          Buat pengumuman
        </Button>
      </Box>
      <Box display="grid" gap={2} mt={3}>
        {isLoading ? (
          <Box>
            <Skeleton height={170} />
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
                    <Typography sx={{ fontSize: 14, textTransform: 'uppercase' }}>{item?.status}</Typography>
                  </Box>
                  <Box display="flex" gap={3}>
                    <Typography
                      fontSize={12}
                    >{`${item?.kelas} ${item?.jurusan?.kode_jurusan} ${item?.sub_kelas} / ${item?.angkatan}`}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography fontSize={13} mt={1}>
                    {item?.text}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Button
                  disabled={mutationDelete.isLoading}
                  onClick={() => handleDelete(item)}
                  size="small"
                  sx={{ minWidth: 0 }}
                  variant="contained"
                  color="error"
                >
                  <DeleteIcon />
                </Button>
                <Button
                  onClick={() => {
                    setDataEdit(item);
                    setOpenModal(true);
                  }}
                  color="info"
                  size="small"
                  sx={{ minWidth: 0 }}
                  variant="contained"
                >
                  <ModeEditOutlineIcon />
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

export default Campaign;
