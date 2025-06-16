import { Typography, Box, Container, Grid } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  AppConversionRates,
  AppCurrentSubject,
  AppCurrentVisits,
  AppWebsiteVisits,
} from '../../../sections/@dashboard/app';
import ContainerCard from '../../../components/ContainerCard';
import AppTotalStudentByMajorAnual from '../../../sections/@dashboard/app/DEV/AppTotalStudentByMajorAnual';
import useQueryFetch from '../../../hooks/useQueryFetch';

function DashboardDev() {
  const theme = useTheme();
  const { itemsNoPagination, isLoading } = useQueryFetch({
    module: 'dashboard-dev',
  });
  const majorList = Object.keys(itemsNoPagination?.data?.analytics ?? {});
  const dataAnalytics = itemsNoPagination?.data?.analytics || [];
  const tahunAngkatan = itemsNoPagination?.data?.tahun_angkatan || [];
  return (
    <ContainerCard>
      <Box>
        <Container>
          <Grid item xs={12} md={6} lg={8}>
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
                  name: majorList[1],
                  type: 'area',
                  fill: 'gradient',
                  data: dataAnalytics[majorList[1]] || [],
                },
                {
                  name: majorList[2],
                  type: 'line',
                  fill: 'solid',
                  data: dataAnalytics[majorList[2]] || [],
                },
              ]}
            />
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
        </Container>
      </Box>
    </ContainerCard>
  );
}

export default DashboardDev;
