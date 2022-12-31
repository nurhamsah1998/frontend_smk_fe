import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Tabs, Tab, AppBar, ListItemText, Divider } from '@mui/material';
import { grey } from '@mui/material/colors';
import useFetch from '../../../hooks/useFetch';
import AccordionList from '../../../components/AccordionList';
import TableComponen from '../../../components/TableComponent';
import useFetchById from '../../../hooks/useFetchById';
import { PROFILE } from '../../../hooks/useHelperContext';
import ListItemComponent from '../../../components/ListItemComponent';
import { FormatCurrency } from '../../../components/FormatCurrency';
import TagihanNonSpp from '../../STAFF_TU/Pembayaran/Modal/NonSPP/TagihanNonSpp';

function Tagihan() {
  const [value, setValue] = React.useState(0);
  const { itemsNoPagination: studentProfile } = React.useContext(PROFILE);
  const { itemsNoPagination, isLoading } = React.useContext(PROFILE);
  const { itemsNoPagination: tagihanPermanent } = useFetch({
    module: `tagihan-permanent-siswa?tahun_angkatan=${studentProfile?.angkatan}`,
  });
  const { itemsNoPagination: paymentHistory } = useFetch({
    isCustom: true,
    module: `invoice?kode_tagihan=${studentProfile?.kode_siswa}`,
  });
  const dataRaw = tagihanPermanent?.map((x) => {
    delete x?.id;
    delete x?.updatedAt;
    delete x?.createdAt;
    delete x?.tahun_angkatan;
    return Object.entries(x);
  });
  const itemsRebuild = dataRaw
    ?.map((i) => i?.map((o) => ({ name: o[0].replace(/_/g, ' '), value: o[1] })))[0]
    ?.filter((y) => y?.value !== 0);
  const totalBillPaymentHistory =
    paymentHistory?.length <= 0 ? 0 : paymentHistory?.map((i) => i?.uang_diterima)?.reduce((x, y) => x + y);
  const totalBillStudent = itemsRebuild?.length <= 0 ? 0 : itemsRebuild?.map((i) => i?.value)?.reduce((x, y) => x + y);
  console.log(totalBillStudent);
  const tableHeadTagihanSiswa = [
    {
      id: 'name',
      label: 'Bill name',
    },
    {
      id: 'value',
      label: 'Amount',
      isCurrency: true,
    },
  ];
  const tableHeadPembayaranSiswa = [
    {
      id: 'invoice',
      label: 'No Invoice',
    },
    {
      id: 'createdAt',
      label: 'Pay date',
      isDate: true,
    },
    {
      id: 'kode_pembayaran',
      label: 'Bill name',
    },
    {
      id: 'uang_diterima',
      label: 'Amount',
      isCurrency: true,
    },
  ];
  const detailBill = [
    {
      label: 'Total bill',
      value: totalBillStudent || 0,
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
    <Box>
      <Box mb={2}>
        <Typography variant="h5">Summary</Typography>
        {detailBill?.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Typography sx={{ width: '30%' }}>{item?.label}</Typography>
            <Typography>: {FormatCurrency(item?.value)}</Typography>
          </Box>
        ))}
      </Box>
      <Divider />
      <Box sx={{ my: 2 }}>
        <Typography variant="h5">Student Bills</Typography>
        <TableComponen
          isLoading={isLoading}
          isTotal
          emptyTag="still no bill"
          hideOption
          totalBill={totalBillStudent}
          tableHead={tableHeadTagihanSiswa}
          disablePagination
          colorHead="blue"
          tableBody={itemsRebuild}
        />
      </Box>
      <Divider />
      <Box sx={{ my: 2 }}>
        <Typography variant="h5">Payment history</Typography>
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
    </Box>
  );
}

export default Tagihan;
