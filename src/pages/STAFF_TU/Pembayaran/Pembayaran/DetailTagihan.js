import React from 'react';
import { Box, Typography } from '@mui/material';
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

  const detailSiswa = [
    {
      value: studentProfile?.nama,
      label: 'Nama siswa',
    },
    {
      value: studentProfile?.jurusan?.nama,
      label: 'Jurusan',
    },
    {
      value: studentProfile?.kelas,
      label: 'Kelas',
    },
    {
      value: studentProfile?.noHP,
      label: 'Nomor Hp',
    },
  ];

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
  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box>
        <Typography variant="h5">Profile Siswa</Typography>
        <Box>
          {detailSiswa.map((x, y) => (
            <Box key={y} sx={{ display: 'flex' }}>
              <Typography sx={{ width: '120px' }}>{x?.label}</Typography>:
              <Typography variant="subtitle2" ml={1}>
                {x?.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" mb={2}>
          Tagihan Siswa
        </Typography>
        <TableComponen
          isLoading={isLoading}
          isTotal
          hideOption
          totalBill={totalBillStudent}
          tableHead={tableHeadTagihanSiswa}
          disablePagination
          colorHead="blue"
          tableBody={itemsRebuild}
        />
      </Box>
      <Box>
        <Typography variant="h5" mb={2}>
          Riwayat pembayaran
        </Typography>
        <TableComponen
          isLoading={isLoading}
          emptyTag="sepertinya belum ada transaksi"
          hideOption
          isTotal
          totalBill={totalBillPaymentHistory}
          tableHead={tableHeadPembayaranSiswa}
          disablePagination
          colorHead="blue"
          tableBody={paymentHistory}
        />
      </Box>
      <Box>
        <Typography variant="h5">Pembayaran</Typography>
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
