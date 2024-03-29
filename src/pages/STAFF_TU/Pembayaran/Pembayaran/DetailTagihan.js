import React from 'react';
import { Box, Button, Paper, CircularProgress, Divider, FormHelperText, Grid, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { blue } from '@mui/material/colors';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';

import TableComponen from '../../../../components/TableComponent';
import useFetchById from '../../../../hooks/useFetchById';
import useFetch from '../../../../hooks/useFetch';
import FormPembayaran from './FormPembayaran';
import { PROFILE } from '../../../../hooks/useHelperContext';
import { tableHeadTagihanSiswa, tableHeadPembayaranSiswa } from './tableConfig';
import { FormatCurrency } from '../../../../components/FormatCurrency';
import { PrintTemplateInvoice } from './ModalSuccessPayment';

function DetailTagihan() {
  const { itemsNoPagination } = React.useContext(PROFILE);
  const printRef = React.useRef();
  const location = useLocation();
  const [selectedDataForPrint, setSelectedDataForPrint] = React.useState({});
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
  const itemsRebuild =
    dataTextField
      ?.map((i) => i?.map((o) => ({ name: o[0].replace(/_/g, ' '), value: o[1] })))[0]
      ?.filter((y) => y?.value !== 0) || [];
  const data = {
    student: studentProfile,
    staff: itemsNoPagination,
  };

  const totalBillPaymentHistory =
    paymentHistory?.length <= 0 ? 0 : paymentHistory?.map((i) => i?.uang_diterima)?.reduce((x, y) => x + y);
  const totalBillStudent = itemsRebuild?.length <= 0 ? 0 : itemsRebuild?.map((i) => i?.value)?.reduce((x, y) => x + y);

  const detailBill = [
    {
      label: 'Total tagihan',
      value: totalBillStudent,
    },
    {
      label: 'Terbayar',
      value: totalBillPaymentHistory,
    },
    {
      label: 'Uang lebih',
      value: totalBillPaymentHistory - totalBillStudent <= 0 ? 0 : totalBillPaymentHistory - totalBillStudent,
    },
    {
      label: 'Kekurangan',
      value: totalBillStudent - totalBillPaymentHistory <= 0 ? 0 : totalBillStudent - totalBillPaymentHistory,
    },
  ];
  const print = useReactToPrint({
    content: () => printRef.current,
  });

  const handleCustomOnClickRow = (i) => {
    setSelectedDataForPrint(i);
    setTimeout(() => {
      print();
    }, 1);
  };
  return (
    <Box sx={{ display: 'grid', gap: 4, position: 'relative' }}>
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          left: { xs: 0, sm: 0, md: 280 },
          right: 0,
          top: 60,
          bgcolor: '#f9fafb',
          zIndex: 99,
          pt: '10px',
          px: '10px',
          pb: '20px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Profile Siswa</Typography>
          <Button variant="contained" disabled>
            Edit profil siswa
          </Button>
        </Box>
        <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
          <Grid item xs={6}>
            <Box sx={{ display: 'flex' }}>
              <Typography sx={{ width: '120px' }}>Nama siswa</Typography>:
              <Typography variant="subtitle2" ml={1} textTransform="capitalize">
                {studentProfile?.nama}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex' }}>
              <Typography sx={{ width: '120px' }}>Jurusan</Typography>:
              <Typography variant="subtitle2" ml={1} textTransform="capitalize">
                {studentProfile?.jurusan?.nama}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex' }}>
              <Typography sx={{ width: '120px' }}>Kelas</Typography>:
              <Typography variant="subtitle2" ml={1} textTransform="capitalize">
                {studentProfile?.kelas}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex' }}>
              <Typography sx={{ width: '120px' }}>No. HP</Typography>:
              <Typography variant="subtitle2" ml={1} textTransform="capitalize">
                {studentProfile?.noHP}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Box mt={'177px'}>
        <Box mb={2}>
          <Typography variant="h5"> Tagihan Siswa</Typography>
          <FormHelperText sx={{ mt: '-5px', color: blue[500] }}>
            Total ada {itemsRebuild?.length || 0} tagihan
          </FormHelperText>
        </Box>
        <TableComponen
          stickyHeader="432px"
          isLoading={isLoading}
          emptyTag="masih belum ada tagihan"
          isTotal
          hideOption
          totalBill={totalBillStudent}
          tableHead={tableHeadTagihanSiswa}
          disablePagination
          colorHead="cyan"
          tableBody={itemsRebuild}
        />
      </Box>
      <Divider />
      <Box>
        <Box mb={2}>
          <Typography variant="h5">Riwayat pembayaran</Typography>
          <FormHelperText sx={{ mt: '-5px', color: blue[500] }}>
            Total ada {paymentHistory?.length || 0} riwayat pembayaran
          </FormHelperText>
        </Box>
        <TableComponen
          stickyHeader="432px"
          isLoading={isLoading}
          emptyTag="sepertinya belum ada transaksi"
          hideOption
          handleCustomOnClickRow={handleCustomOnClickRow}
          isTotal
          customIcon={<PrintIcon />}
          totalBill={totalBillPaymentHistory}
          tableHead={tableHeadPembayaranSiswa}
          disablePagination
          colorHead="cyan"
          tableBody={paymentHistory}
        />
      </Box>
      <Divider />
      <Box>
        <Typography variant="h5">Pembayaran</Typography>
        <Box>
          {detailBill?.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Typography sx={{ width: '30%' }}>{item?.label}</Typography>
              {isLoading ? <CircularProgress size={20} /> : <Typography>: {FormatCurrency(item?.value)}</Typography>}
            </Box>
          ))}
        </Box>
        <FormPembayaran totalBillPaymentHistory={totalBillPaymentHistory} refetchInvoice={refetchInvoice} data={data} />
        <PrintTemplateInvoice printRef={printRef} data={selectedDataForPrint} />
      </Box>
    </Box>
  );
}

export default DetailTagihan;
