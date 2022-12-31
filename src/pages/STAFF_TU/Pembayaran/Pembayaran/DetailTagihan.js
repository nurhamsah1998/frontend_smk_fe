import React from 'react';
import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import TableComponen from '../../../../components/TableComponent';
import useFetchById from '../../../../hooks/useFetchById';
import useFetch from '../../../../hooks/useFetch';
import FormPembayaran from './FormPembayaran';
import { PROFILE } from '../../../../hooks/useHelperContext';
import { tableHeadTagihanSiswa, tableHeadPembayaranSiswa } from './tableConfig';
import { FormatCurrency } from '../../../../components/FormatCurrency';

function DetailTagihan() {
  const { itemsNoPagination } = React.useContext(PROFILE);
  const navigate = useNavigate();
  const location = useLocation();
  const idCode = queryString.parse(location.search);
  const { items: studentProfile } = useFetchById({
    module: 'siswa',
    idCode: `${idCode['student-id']}`,
  });
  const { itemsNoPagination: tagihanPermanent } = useFetch({
    module: `tagihan-permanent-siswa?tahun_angkatan=${studentProfile?.angkatan}`,
  });
  const {
    itemsNoPagination: paymentHistory,
    isFetched,
    isLoading,
    refetch: refetchInvoice,
  } = useFetch({
    isCustom: true,
    module: `invoice?kode_tagihan=${studentProfile?.kode_siswa}`,
  });
  const dataTextField = tagihanPermanent?.map((x) => {
    delete x?.id;
    delete x?.updatedAt;
    delete x?.createdAt;
    delete x?.tahun_angkatan;
    return Object.entries(x);
  });
  const itemsRebuild = dataTextField
    ?.map((i) => i?.map((o) => ({ name: o[0].replace(/_/g, ' '), value: o[1] })))[0]
    ?.filter((y) => y?.value !== 0);
  const data = {
    student: studentProfile,
    staff: itemsNoPagination,
  };

  const detailSiswaLeft = [
    {
      value: studentProfile?.nama,
      label: 'Student name',
    },
    {
      value: studentProfile?.jurusan?.nama,
      label: 'Major',
    },
    {
      value: studentProfile?.kelas,
      label: 'Class',
    },
    {
      value: studentProfile?.noHP,
      label: 'Phone number',
    },
  ];
  const detailSiswaRight = [
    {
      value: studentProfile?.nama_ayah,
      label: 'Father name',
    },
    {
      value: studentProfile?.nama_ibu,
      label: 'Mother name',
    },
    {
      value: studentProfile?.alamat,
      label: 'Address',
    },
    {
      value: studentProfile?.angkatan,
      label: 'Force',
    },
  ];

  const totalBillPaymentHistory =
    paymentHistory?.length <= 0 ? 0 : paymentHistory?.map((i) => i?.uang_diterima)?.reduce((x, y) => x + y);
  const totalBillStudent = itemsRebuild?.length <= 0 ? 0 : itemsRebuild?.map((i) => i?.value)?.reduce((x, y) => x + y);

  const detailBill = [
    {
      label: 'Total bill',
      value: totalBillStudent,
    },
    {
      label: 'Paid off',
      value: totalBillPaymentHistory,
    },
    {
      label: 'excess money',
      value: totalBillPaymentHistory - totalBillStudent <= 0 ? 0 : totalBillPaymentHistory - totalBillStudent,
    },
    {
      label: 'Deficiency',
      value: totalBillStudent - totalBillPaymentHistory <= 0 ? 0 : totalBillStudent - totalBillPaymentHistory,
    },
  ];
  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Student Profiles</Typography>
          <Button variant="contained" disabled>
            Edit student profile
          </Button>
        </Box>
        <Grid container>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            {detailSiswaLeft.map((x, y) => (
              <Box key={y} sx={{ display: 'flex' }}>
                <Typography sx={{ width: '120px' }}>{x?.label}</Typography>:
                <Typography variant="subtitle2" ml={1} textTransform="capitalize">
                  {x?.value}
                </Typography>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            {detailSiswaRight.map((x, y) => (
              <Box key={y} sx={{ display: 'flex' }}>
                <Typography sx={{ width: '120px' }}>{x?.label}</Typography>:
                <Typography variant="subtitle2" ml={1} textTransform="capitalize">
                  {x?.value}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box>
        <Typography variant="h5" mb={2}>
          Student Bills
        </Typography>
        <TableComponen
          isLoading={isLoading}
          emptyTag="still no bill"
          isTotal
          hideOption
          totalBill={totalBillStudent}
          tableHead={tableHeadTagihanSiswa}
          disablePagination
          colorHead="blue"
          tableBody={itemsRebuild}
        />
      </Box>
      <Divider />
      <Box>
        <Typography variant="h5" mb={2}>
          Payment history
        </Typography>
        <TableComponen
          isLoading={isLoading}
          emptyTag="there seems to be no transaction"
          hideOption
          isTotal
          totalBill={totalBillPaymentHistory}
          tableHead={tableHeadPembayaranSiswa}
          disablePagination
          colorHead="blue"
          tableBody={paymentHistory}
        />
      </Box>
      <Divider />
      <Box>
        <Typography variant="h5">Payment</Typography>
        <Box>
          {detailBill?.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Typography sx={{ width: '30%' }}>{item?.label}</Typography>
              <Typography>: {FormatCurrency(item?.value)}</Typography>
            </Box>
          ))}
        </Box>
        <FormPembayaran refetchInvoice={refetchInvoice} data={data} />
      </Box>
    </Box>
  );
}

export default DetailTagihan;
