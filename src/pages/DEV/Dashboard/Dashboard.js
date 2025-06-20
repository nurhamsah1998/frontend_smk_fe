/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
import { Typography, Box, Grid, Skeleton, Card, CardHeader, IconButton } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import SchoolIcon from '@mui/icons-material/School';
import { fDateTime } from 'src/utils/formatTime';
import { grey } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';
import { PROFILE } from 'src/hooks/useHelperContext';
import { themeAppColors } from 'src/theme/themeAppColor';

import {
  AppConversionRates,
  AppCurrentSubject,
  AppCurrentVisits,
  AppOrderTimeline,
  AppWebsiteVisits,
  AppWidgetSummary,
} from '../../../sections/@dashboard/app';
import ContainerCard from '../../../components/ContainerCard';
import AppTotalStudentByMajorAnual from '../../../sections/@dashboard/app/DEV/AppTotalStudentByMajorAnual';
import useQueryFetch from '../../../hooks/useQueryFetch';

function DashboardDev() {
  const { itemsNoPagination: profileData } = useContext(PROFILE);
  const { itemsNoPagination, isLoading } = useQueryFetch({
    module: 'dashboard-dev',
    invalidateKey: 'dashboard-dev',
  });
  const nav = useNavigate();
  const { role } = profileData || {};
  const majorList = Object.keys(itemsNoPagination?.data?.analytics ?? {});
  const dataAnalytics = itemsNoPagination?.data?.analytics || [];
  const tahunAngkatan = itemsNoPagination?.data?.tahun_angkatan || [];
  const { total_siswa_aktif, total_siswa_alumni, log_activity, news_data } = itemsNoPagination?.data || {};
  const dataRebuildLogActivity = useMemo(
    () =>
      log_activity?.map((item, index) => ({
        id: item?.id,
        time: new Date(item?.createdAt),
        type: `order${index + 1}`,
        title: item?.action,
        author_name: item?.staf?.nama,
      })),
    [log_activity]
  );
  const pathNewsRecomended = {
    ADMINISTRASI: '/staff-tu/news/detail',
    DEV: '/dev/news/detail',
  };
  const handleClickNews = (item) => {
    nav(`${pathNewsRecomended[role] ?? '/siswa/news/detail'}/${item?.id}`);
  };
  return (
    <ContainerCard>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              color="primary"
              icon={<SchoolIcon />}
              title={
                isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Skeleton height={30} width="80%" />
                  </Box>
                ) : (
                  <>
                    <Box>{!Boolean(total_siswa_aktif) ? `Belum ada siswa aktif` : `Total siswa aktif`}</Box>
                  </>
                )
              }
              total={total_siswa_aktif || 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              color="secondary"
              icon={<SchoolIcon />}
              title={
                isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Skeleton height={30} width="80%" />
                  </Box>
                ) : (
                  <>
                    <Box>{!Boolean(total_siswa_alumni) ? `Belum ada siswa alumni` : `Total siswa alumni`}</Box>
                  </>
                )
              }
              total={total_siswa_alumni || 0}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppTotalStudentByMajorAnual
              title="Analytic Jurusan Sekolah"
              subheader="Total siswa berdasarkan jurusan tiap tahun"
              chartLabels={tahunAngkatan}
              chartData={[
                {
                  name: majorList[0],
                  type: 'column',
                  fill: 'solid',
                  data: dataAnalytics[majorList[0]] || [],
                },
                {
                  name: majorList[1] || '',
                  type: 'area',
                  fill: 'gradient',
                  data: dataAnalytics[majorList[1]] || [],
                },
                {
                  name: majorList[2] || '',
                  type: 'line',
                  fill: 'solid',
                  data: dataAnalytics[majorList[2]] || [],
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <AppOrderTimeline title="Aktivitas Admin Terakhir" list={dataRebuildLogActivity || []} />
          </Grid>
          <Grid item xs={12} md={6} lg={7}>
            <Card>
              <CardHeader title="Berita menarik" subheader="berita pilihan" />
              <Box sx={{ p: 3 }}>
                {news_data?.length !== 0 ? (
                  news_data?.map((item, index) => (
                    <Box key={index} sx={{ mb: 2, display: 'grid' }}>
                      <Box
                        component="a"
                        onClick={() => handleClickNews(item)}
                        sx={{
                          color: themeAppColors.main,
                          '&:hover': {
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        <Typography variant="subtitle1" lineHeight={1}>
                          {item?.title}
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: 'primary', mt: 0.5 }} lineHeight={1}>
                          {item?.html}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'grid' }}>
                        <Typography mt={1} variant="caption" color="text.secondary">
                          {fDateTime(item?.createdAt)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            sx={{
                              display: 'flex',
                              gap: 0.5,

                              alignItems: 'center',
                            }}
                            size="small"
                            disabled
                          >
                            <FavoriteIcon
                              sx={{
                                color: grey[500],
                                width: 20,
                                height: 20,
                              }}
                              fontSize="small"
                            />
                            <Typography variant="caption">{item?.up_vote}</Typography>
                          </IconButton>
                          <IconButton
                            sx={{
                              display: 'flex',
                              gap: 0.5,

                              alignItems: 'center',
                            }}
                            size="small"
                            disabled
                          >
                            <ThumbDownAltIcon
                              sx={{
                                color: grey[500],
                                width: 20,
                                height: 20,
                              }}
                              fontSize="small"
                            />
                            <Typography variant="caption">{item?.down_vote}</Typography>
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box py={3}>
                    <Typography sx={{ color: grey[600], textAlign: 'center' }}>Belum ada berita rekomendasi</Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid> */}

        {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}
      </Box>
    </ContainerCard>
  );
}

export default DashboardDev;
