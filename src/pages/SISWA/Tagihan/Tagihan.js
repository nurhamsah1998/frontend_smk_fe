import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import { PROFILE } from '../../../hooks/useHelperContext';
import { FormatCurrency } from '../../../components/FormatCurrency';
import ContainerCard from '../../../components/ContainerCard';

function Tagihan() {
  const { isLoading } = React.useContext(PROFILE);
  const { itemsNoPagination: tagihanPermanent } = useFetch({
    module: `tagihan-permanent-siswa-me`,
  });
  const { itemsNoPagination: paymentHistory } = useFetch({
    isCustom: true,
    module: `invoice-me`,
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
  const tableHeadTagihanSiswa = [
    {
      id: 'name',
      label: 'Nama tagihan',
    },
    {
      id: 'value',
      label: 'Jumlah',
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
      label: 'Tanggal bayar',
      isDate: true,
    },
    {
      id: 'petugas',
      label: 'Petugas',
    },
    {
      id: 'kode_pembayaran',
      label: 'Nama tagihan',
    },
    {
      id: 'uang_diterima',
      label: 'Jumlah',
      isCurrency: true,
    },
    {
      id: 'note',
      label: 'Catatan',
    },
  ];
  const detailBill = [
    {
      label: 'Total tagihan',
      value: totalBillStudent || 0,
    },
    {
      label: 'Terbayar',
      value: totalBillPaymentHistory,
    },
    {
      label: 'Uang lebih',
      value: totalBillPaymentHistory - totalBillStudent <= 0 ? 0 : totalBillPaymentHistory - totalBillStudent || 0,
    },
    {
      label: 'Kekurangan',
      value: totalBillStudent - totalBillPaymentHistory <= 0 ? 0 : totalBillStudent - totalBillPaymentHistory || 0,
    },
  ];
  return (
    <ContainerCard>
      <Box>
        <Box mb={2}>
          <Typography variant="h5">Ringkasan tagihanmu</Typography>
          {detailBill?.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Typography sx={{ width: '30%' }}>{item?.label}</Typography>
              <Typography>: {FormatCurrency(item?.value)}</Typography>
            </Box>
          ))}
        </Box>
        <Divider />
        <Box sx={{ my: 2 }}>
          <Typography variant="h5">Tagihan mu</Typography>
          <TableComponen
            isLoading={isLoading}
            isTotal
            emptyTag="masih belum ada tagihan"
            hideOption
            totalBill={totalBillStudent}
            tableHead={tableHeadTagihanSiswa}
            disablePagination
            colorHead="cyan"
            tableBody={itemsRebuild}
          />
        </Box>
        <Divider />
        <Box sx={{ my: 2 }}>
          <Typography variant="h5">Riwayat pembayaranmu</Typography>
          <TableComponen
            isLoading={isLoading}
            emptyTag="sepertinya belum ada transaksi"
            hideOption
            isTotal
            totalBill={totalBillPaymentHistory}
            tableHead={tableHeadPembayaranSiswa}
            disablePagination
            colorHead="cyan"
            tableBody={paymentHistory}
          />
        </Box>
      </Box>
    </ContainerCard>
  );
}

export default Tagihan;
