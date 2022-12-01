import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import useDelete from '../../../hooks/useDelete';
import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import BuatTagihan from './BuatTagihan';
import { Dialog } from '../../../hooks/useContextHook';

export default function TagihanStaff() {
  const { setDialog } = React.useContext(Dialog);
  const { items } = useFetch({
    module: 'tagihan',
  });

  const { destroy } = useDelete({
    module: 'tagihan',
    isCloseAfterConfirmDelete: true,
  });
  const tableHead = [
    {
      id: 'nama',
      label: 'Nama tagihan',
    },
    {
      id: 'kode_tagihan',
      label: 'Kode tagihan',
    },
    {
      id: 'total',
      label: 'Total tagihan sejumlah',
    },
  ];
  const handleDelete = (item) => {
    setDialog({
      title: 'PERHATIAN!',
      labelClose: 'Batal',
      labelSubmit: 'Hapus',
      content:
        'Tagihan yang dihapus bisa saja mempengaruh pembayaran siswa. Kami menyarankan untuk menyimpan tagihan ini untuk pembukuan data pembayaran siswa. Tagihan yang telah dihapus tidak akan dapat dibackup lagi. Apakah anda yakin ingin tetap menghapus tagihan ini ?',
      do: () => {
        destroy.mutate(item?.id);
      },
    });
  };

  const navigate = useNavigate();
  return (
    <Box>
      <Box>
        <Button startIcon={<AddIcon />} onClick={() => navigate('?create-new-bill')} variant="contained">
          Buat tagihan baru
        </Button>
      </Box>
      <Box mt={2}>
        <TableComponen tableBody={items} handleDelete={handleDelete} tableHead={tableHead} />
      </Box>
      <BuatTagihan />
    </Box>
  );
}
