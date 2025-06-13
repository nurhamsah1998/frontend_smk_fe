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

function DashboardDev() {
  const theme = useTheme();
  return (
    <ContainerCard>
      <Box>
        <Container>
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Rata rata jurusan tiap tahun"
              subheader="INI HANYA CONTOH. BELUM TERINTEGRASI"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'TKJ',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'TKR',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'AKT',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
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
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
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
