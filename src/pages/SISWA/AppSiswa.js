import React from 'react';
import { Box, Button, Link, Skeleton, Typography } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import moment from 'moment';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CampaignIcon from '@mui/icons-material/Campaign';

import { PROFILE } from '../../hooks/useHelperContext';
import { themeAppColors } from '../../theme/themeAppColor';
import ResponseCampaign from './ResponseCampaign';
import PreviewResponCampaign from './PreviewResponCampaign';
import ContainerCard from '../../components/ContainerCard';

function AppSiswa() {
  const { itemsNoPagination, campaignList, isLoadingCampaign } = React.useContext(PROFILE);
  const [campaign, setCampaign] = React.useState({ isOpen: false, data: {} });
  const [previewResponCampaign, setPreviewResponCampaign] = React.useState({ isOpen: false, data: [] });
  return (
    <ContainerCard>
      <Box>
        <ResponseCampaign open={campaign} setOpen={setCampaign} />
        <PreviewResponCampaign open={previewResponCampaign} setOpen={setPreviewResponCampaign} />
        <Box sx={{ mt: 4 }}>
          <Typography sx={{ textAlign: 'center', color: grey[700], mb: 3 }} variant="h4">
            Pengumuman
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {isLoadingCampaign ? (
              <Box>
                <Skeleton height={170} />
              </Box>
            ) : campaignList?.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 3, display: 'grid' }}>
                <Typography variant="h6" color={grey[600]}>
                  Tidak ada pengumuman
                </Typography>
                <Typography variant="body" color={grey[600]}>
                  Kamu bisa cek secara berkala untuk melihat pengumuman terbaru dari sekolah.
                </Typography>
              </Box>
            ) : (
              campaignList?.map((item, index) => {
                const disabledResponse = item?.response_campaigns?.find(
                  (item) => item?.siswa_id === itemsNoPagination?.id
                );
                return (
                  <Box
                    sx={{
                      bgcolor: item?.status === 'umum' ? themeAppColors.light : red[50],
                      p: 2,
                      minHeight: '200px',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    key={index}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <Box sx={{ position: 'absolute', top: -50, right: 0, zIndex: 1 }}>
                        <CampaignIcon
                          sx={{
                            width: 300,
                            height: 300,
                            rotate: '-30deg',
                            color: item?.status === 'umum' ? themeAppColors.dark : red[800],
                            opacity: 0.1,
                          }}
                        />
                      </Box>
                      <Box
                        zIndex={2}
                        position="relative"
                        color={item?.status === 'umum' ? themeAppColors.dark : red[800]}
                      >
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
                          <Typography fontSize={12}>Penulis : {`${item?.staf?.nama}`}</Typography>
                          <Box
                            sx={{
                              width: '1px',
                              bgcolor: grey[600],
                              height: '12px',
                            }}
                          />
                          <Typography fontSize={12}>{moment(item?.createdAt).format('DD MMM YYYY H:mm')}</Typography>
                          {item?.response_campaigns?.length !== 0 && (
                            <Box
                              sx={{
                                width: '1px',
                                bgcolor: grey[600],
                                height: '12px',
                              }}
                            />
                          )}

                          {item?.response_campaigns?.length !== 0 && (
                            <Typography fontSize={12}>{`${item?.response_campaigns?.length} respon`}</Typography>
                          )}
                        </Box>
                      </Box>
                      <Box zIndex={2} position="relative">
                        <Typography fontSize={13} mt={1} fontStyle="italic">
                          "{item?.text}""
                        </Typography>
                        {item?.response_campaigns?.length !== 0 && (
                          <Link
                            onClick={() => setPreviewResponCampaign({ isOpen: true, data: item?.response_campaigns })}
                            fontSize={12}
                            sx={{ cursor: 'pointer', color: item?.status === 'umum' ? themeAppColors.dark : red[800] }}
                          >
                            click disini untuk melihat respon siswa
                          </Link>
                        )}
                      </Box>
                    </Box>
                    {item?.is_response && !Boolean(disabledResponse) && (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          mt: 2,
                          zIndex: 2,
                        }}
                      >
                        <Button
                          disabled={Boolean(disabledResponse)}
                          onClick={() => setCampaign({ isOpen: true, data: item })}
                          size="small"
                          startIcon={Boolean(disabledResponse) ? null : <RecordVoiceOverIcon />}
                          sx={{ minWidth: 0 }}
                          variant="contained"
                        >
                          {Boolean(disabledResponse) ? 'Kamu sudah merespon pengumuman ini' : 'Respon'}
                        </Button>
                      </Box>
                    )}
                    {Boolean(disabledResponse) && (
                      <Box mt={2} zIndex={2}>
                        <Box sx={{ width: '100%', bgcolor: grey[400], height: '1px', mb: 1 }} />
                        <Typography sx={{ color: grey[700], fontSize: '13px' }}>Responmu :</Typography>
                        <Typography fontSize={12}>
                          {moment(disabledResponse?.createdAt).format('DD MMM YYYY H:mm')}
                        </Typography>
                        <Typography mt={1} fontStyle="italic">
                          "{disabledResponse?.text}"
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Box>
    </ContainerCard>
  );
}

export default AppSiswa;
