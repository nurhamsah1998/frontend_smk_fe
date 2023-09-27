import React from 'react';
import { Box, Grid } from '@mui/material';
import { AppWidgetSummary } from '../../sections/@dashboard/app';
import useFetch from '../../hooks/useFetch';

function AppStaffTU() {
  const { items } = useFetch({
    module: 'dashboard-report',
  });
  console.log(items, '<-------------');
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Transaksi Hari ini" total={714000000300} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Total pendapatan tahn ini" total={1352831} color="info" />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Total tagihan" total={1723315} color="warning" />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Total siswa" total={234} color="error" />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppStaffTU;
