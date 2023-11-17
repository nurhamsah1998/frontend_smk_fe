import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Box, FormHelperText, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import ScreenDialog from '../../components/ScreenDialog';
import useMutationPost from '../../hooks/useMutationPost';
import { PROFILE } from '../../hooks/useHelperContext';

export default function ResponseCampaign({ open, setOpen }) {
  const { refetchCampaign } = React.useContext(PROFILE);
  const [textResponse, setTextResponse] = React.useState('');
  const handleClose = () => {
    setOpen({ isOpen: false, data: {} });
    setTextResponse('');
  };

  const mutationPost = useMutationPost({
    module: 'response-campaign',
    next: () => {
      setOpen({ isOpen: false, data: {} });
      setTextResponse('');
      refetchCampaign();
    },
  });
  const handleSubmit = () => {
    mutationPost.mutate({ text: textResponse, campaign_id: open?.data?.id });
  };
  return (
    <>
      <ScreenDialog
        labelClose="Batal"
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        labelSubmit="Respon"
        title="Respon Pengumuman"
        open={open?.isOpen}
      >
        <Box>
          <Typography color={grey[700]} fontSize={14}>
            Kamu hanya bisa merespon sekali disetiap pengumuman dan kamu tidak dapat mengedit maupun menghapus respon
            yang telah kamu buat. Responlah pengumuman dengan baik dan sesuai dengan context. Respon yang telah dikirim
            akan terbaca oleh penulis dan murid yang terkait
          </Typography>
        </Box>
        <Box width="100%" mt={2}>
          <TextField
            fullWidth
            id="outlined-multiline-static"
            multiline
            rows={2}
            inputProps={{
              maxLength: 255,
            }}
            value={textResponse}
            onChange={(i) => setTextResponse(i.target.value)}
            label="Respon disini"
          />
          <FormHelperText
            sx={{
              textAlign: 'right',
            }}
          >
            {textResponse?.length} / 255
          </FormHelperText>
        </Box>
      </ScreenDialog>
    </>
  );
}
