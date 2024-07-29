import React from 'react';
import { Box, Card, Grid, Skeleton, Typography } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import moment from 'moment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { purple } from '@mui/material/colors';

import { AppWidgetSummary } from '../../sections/@dashboard/app';
import useFetch from '../../hooks/useFetch';
import { FormatCurrency } from '../../components/FormatCurrency';

function AppStaffTU() {
  const { items, isLoading } = useFetch({
    module: 'dashboard-report',
  });
  const getYear = moment().format('YYYY');
  const firstGrade = Number(getYear);
  const secondGrade = Number(getYear) - 1;
  const thirhGrade = Number(getYear) - 2;
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            color="secondary"
            icon={<TodayIcon />}
            title={
              isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Skeleton height={30} width="80%" />
                </Box>
              ) : (
                <>
                  <Box>
                    {Boolean(items?.profit?.total_student_daily === 0)
                      ? `Belum ada transaksi masuk dihari ini`
                      : `Transaksi hari ini dari ${items?.profit?.total_student_daily} siswa`}
                  </Box>
                  <Typography sx={{ fontSize: '12px' }}>{moment().format('DD MMMM YYYY')}</Typography>
                </>
              )
            }
            total={
              isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Skeleton height={30} width="80%" />
                </Box>
              ) : (
                FormatCurrency(items?.profit?.amount_daily)
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            color="error"
            icon={<DateRangeIcon />}
            title={
              isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Skeleton height={30} width="80%" />
                </Box>
              ) : (
                <>
                  <Box>
                    {Boolean(items?.profit?.total_student_monthly === 0)
                      ? `Belum ada transaksi masuk dibulan ini`
                      : `Transaksi bulan ini dari ${items?.profit?.total_student_monthly} siswa`}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '12px' }}>
                      {moment().startOf('month').format('DD MMMM YYYY')}
                    </Typography>
                    <Typography sx={{ fontSize: '12px' }}>-</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{moment().endOf('month').format('DD MMMM YYYY')}</Typography>
                  </Box>
                </>
              )
            }
            total={
              isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Skeleton height={30} width="80%" />
                </Box>
              ) : (
                FormatCurrency(items?.profit?.amount_monthly)
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            color="primary"
            icon={<CalendarMonthIcon />}
            title={
              isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Skeleton height={30} width="80%" />
                </Box>
              ) : (
                <>
                  <Box>
                    {Boolean(items?.profit?.total_student_annual === 0)
                      ? `Belum ada transaksi masuk ditahun ini`
                      : `Transaksi tahun ini dari ${items?.profit?.total_student_annual} siswa`}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '12px' }}>{moment().startOf('year').format('DD MMMM YYYY')}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>-</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{moment().endOf('year').format('DD MMMM YYYY')}</Typography>
                  </Box>
                </>
              )
            }
            total={
              isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Skeleton height={30} width="80%" />
                </Box>
              ) : (
                FormatCurrency(items?.profit?.amount_annual)
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ height: '100%', display: 'flex', bgcolor: purple[100], alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                height: '100%',
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ color: purple[800] }}>
                  Total tagihan tiap siswa kelas 10 :{' '}
                </Typography>
                <Typography variant="h6" sx={{ color: purple[800], mt: -0.3 }}>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Skeleton height={30} width="80%" />
                    </Box>
                  ) : (
                    FormatCurrency(items?.total_bill?.[firstGrade])
                  )}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ color: purple[800] }}>
                  Total tagihan tiap siswa kelas 11 :{' '}
                </Typography>
                <Typography variant="h6" sx={{ color: purple[800], mt: -0.3 }}>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Skeleton height={30} width="80%" />
                    </Box>
                  ) : (
                    FormatCurrency(items?.total_bill?.[secondGrade])
                  )}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ color: purple[800] }}>
                  Total tagihan tiap siswa kelas 12 :{' '}
                </Typography>
                <Typography variant="h6" sx={{ color: purple[800], mt: -0.3 }}>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Skeleton height={30} width="80%" />
                    </Box>
                  ) : (
                    FormatCurrency(items?.total_bill?.[thirhGrade])
                  )}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppStaffTU;
