import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import moment from 'moment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

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
            icon={<TodayIcon />}
            title={
              <>
                <Box>
                  {Boolean(items?.profit?.total_student_daily === 0)
                    ? `Belum ada transaksi masuk dihari ini`
                    : `Transaksi hari ini dari ${isLoading ? 0 : items?.profit?.total_student_daily} siswa`}
                </Box>
                <Typography sx={{ fontSize: '12px' }}>{moment().format('DD MMMM YYYY')}</Typography>
              </>
            }
            total={FormatCurrency(isLoading ? 0 : items?.profit?.amount_daily)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            color="error"
            icon={<DateRangeIcon />}
            title={
              <>
                <Box>
                  {Boolean(items?.profit?.total_student_monthly === 0)
                    ? `Belum ada transaksi masuk dibulan ini`
                    : `Transaksi bulan ini dari ${isLoading ? 0 : items?.profit?.total_student_monthly} siswa`}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: '12px' }}>{moment().startOf('month').format('DD MMMM YYYY')}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>-</Typography>
                  <Typography sx={{ fontSize: '12px' }}>{moment().endOf('month').format('DD MMMM YYYY')}</Typography>
                </Box>
              </>
            }
            total={FormatCurrency(isLoading ? 0 : items?.profit?.amount_monthly)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            color="primary"
            icon={<CalendarMonthIcon />}
            title={
              <>
                <Box>
                  {Boolean(items?.profit?.total_student_annual === 0)
                    ? `Belum ada transaksi masuk ditahun ini`
                    : `Transaksi tahun ini dari ${isLoading ? 0 : items?.profit?.total_student_annual} siswa`}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: '12px' }}>{moment().startOf('year').format('DD MMMM YYYY')}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>-</Typography>
                  <Typography sx={{ fontSize: '12px' }}>{moment().endOf('year').format('DD MMMM YYYY')}</Typography>
                </Box>
              </>
            }
            total={FormatCurrency(isLoading ? 0 : items?.profit?.amount_annual)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            color="info"
            icon={<ReceiptLongIcon />}
            title={
              <>
                <Box>
                  {Boolean(items?.profit?.total_student_annual === 0)
                    ? `Tidak ada tagihan dibulan ini`
                    : `Total tagihan tahun ini`}
                </Box>
                <Typography sx={{ fontSize: '12px' }}>{moment().format('YYYY')}</Typography>
              </>
            }
            total={FormatCurrency(isLoading ? 0 : items?.bill?.total_bill_annual)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppStaffTU;
