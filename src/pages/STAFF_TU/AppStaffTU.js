import React from 'react';
import { Box, Grid } from '@mui/material';
import { AppWidgetSummary } from '../../sections/@dashboard/app';
import useFetch from '../../hooks/useFetch';
import { FormatCurrency } from '../../components/FormatCurrency';

function AppStaffTU() {
  const { items } = useFetch({
    module: 'dashboard-report',
  });
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            title={`Transaksi hari ini dari ${items?.today_profit?.total_student} siswa`}
            total={FormatCurrency(items?.today_profit?.amount)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary title="Total siswa" total={items?.total_student} color="error" />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppStaffTU;
