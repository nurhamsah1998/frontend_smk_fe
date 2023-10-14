import React from 'react';
import { Box, Grid } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ReceiptIcon from '@mui/icons-material/Receipt';

import { AppWidgetSummary } from '../../sections/@dashboard/app';
import useFetch from '../../hooks/useFetch';
import { FormatCurrency } from '../../components/FormatCurrency';

function AppStaffTU() {
  const { items, isLoading } = useFetch({
    module: 'dashboard-report',
  });
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            color="secondary"
            icon={<ReceiptIcon />}
            title={
              Boolean(items?.today_profit?.total_student === 0)
                ? `Belum ada transaksi masuk`
                : `Transaksi hari ini dari ${isLoading ? 0 : items?.today_profit?.total_student} siswa`
            }
            total={FormatCurrency(isLoading ? 0 : items?.today_profit?.amount)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            icon={<SchoolIcon />}
            title="Total siswa"
            total={isLoading ? 0 : items?.total_student}
            color="error"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppStaffTU;
