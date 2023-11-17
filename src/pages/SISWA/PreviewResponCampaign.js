import * as React from 'react';
import { Box, Typography } from '@mui/material';
import moment from 'moment';
import { grey } from '@mui/material/colors';

import ScreenDialog from '../../components/ScreenDialog';

export default function PreviewResponCampaign({ open, setOpen }) {
  const handleClose = () => {
    setOpen({ isOpen: false, data: [] });
  };
  return (
    <>
      <ScreenDialog labelClose="tutup" handleClose={handleClose} title="Respon Siswa" open={open?.isOpen}>
        <Box display="grid" gap={1}>
          {open?.data?.map((item, index) => {
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
                    </Box>
                    <Typography fontSize={12}>{moment(item?.createdAt).format('DD MMM YYYY H:mm')}</Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={13} mt={1} fontStyle="italic">
                      "{item?.text}"
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </ScreenDialog>
    </>
  );
}
