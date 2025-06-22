/* eslint-disable import/no-unresolved */
/* eslint-disable array-callback-return */
/* eslint-disable no-extra-boolean-cast */
import { Box, Button, TextField } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';

import { green } from '@mui/material/colors';
import CreateIcon from '@mui/icons-material/Create';
import { Dialog } from 'src/hooks/useContextHook';
import TableComponen from '../../../components/TableComponent';
import useMutationPatch from '../../../hooks/useMutationPatch';
import ScreenDialog from '../../../components/ScreenDialog';
import useQueryFetch from '../../../hooks/useQueryFetch';
import useMutationPost from '../../../hooks/useMutationPost';
import useMutationDelete from '../../../hooks/useMutationDelete';
import ContainerCard from '../../../components/ContainerCard';

function Major() {
  const { setDialog } = useContext(Dialog);
  const [openModal, setOpenModal] = React.useState({ isOpen: false, type: '' });
  const { data, totalPage, setPage, page, search, totalRows, totalData, isLoading } = useQueryFetch({
    module: `jurusan`,
    invalidateKey: 'jurusan',
  });
  const [formValue, setFormValue] = useState({ nama: '', kode_jurusan: '', id: '' });
  const itemRebuild = useMemo(() => data?.data, [data]);
  const { mutationPatch, isLoading: isLoadingPatch } = useMutationPatch({
    module: 'jurusan',
    next: () => {
      setOpenModal({ isOpen: false, type: '' });
      setFormValue({ nama: '', kode_jurusan: '', id: '' });
    },
    fail: () => {
      setOpenModal({ isOpen: false, type: '' });
      setFormValue({ nama: '', kode_jurusan: '', id: '' });
    },
  });
  const mutationDelete = useMutationDelete({
    module: 'jurusan',
    next: () => {
      setOpenModal({ isOpen: false, type: '' });
      setFormValue({ nama: '', kode_jurusan: '', id: '' });
    },
    fail: () => {
      setOpenModal({ isOpen: false, type: '' });
      setFormValue({ nama: '', kode_jurusan: '', id: '' });
    },
  });
  const mutationPost = useMutationPost({
    module: 'jurusan',
    next: () => {
      setOpenModal({ isOpen: false, type: '' });
      setFormValue({ nama: '', kode_jurusan: '', id: '' });
    },
    fail: () => {
      setOpenModal({ isOpen: false, type: '' });
      setFormValue({ nama: '', kode_jurusan: '', id: '' });
    },
  });

  const tableHead = [
    {
      id: 'nama',
      label: 'Nama',
    },
    {
      id: 'kode_jurusan',
      label: 'Kode jurusan',
    },
  ];

  const handleCustomOnClickRow = (i) => {
    setOpenModal({ isOpen: true, type: 'Edit' });
    setFormValue({ nama: i?.nama, kode_jurusan: i?.kode_jurusan, id: i?.id });
  };
  const handleDelete = (i) => {
    setDialog(() => ({
      helperText: `Apakah anda yakin ingin menghapus jurusan ${i?.nama}?`,
      title: 'Hapus',
      labelClose: 'Batal',
      variant: 'error',
      labelSubmit: 'Hapus',
      fullWidth: false,
      do: () => {
        mutationDelete.mutate({ id: i?.id });
      },
      isCloseAfterSubmit: true,
    }));
    setFormValue((prev) => ({ ...prev, nama: i?.nama, id: i?.id }));
  };
  const handleSubmitMajor = () => {
    if (openModal.type === 'Edit') {
      mutationPatch.mutate({
        id: formValue?.id,
        nama: formValue?.nama,
        kode_jurusan: formValue?.kode_jurusan,
      });
    } else if (openModal.type === 'Buat') {
      mutationPost.mutate({ nama: formValue?.nama, kode_jurusan: formValue?.kode_jurusan });
    }
  };
  const handleClickCreate = () => {
    setOpenModal({ isOpen: true, type: 'Buat' });
    setFormValue((prev) => ({ ...prev, nama: '', kode_jurusan: '' }));
  };
  return (
    <ContainerCard>
      <Box>
        <ScreenDialog
          handleSubmit={handleSubmitMajor}
          open={openModal.isOpen}
          handleClose={() => setOpenModal({ isOpen: false, type: '' })}
          labelClose="Tutup"
          isLoading={isLoading || mutationPost.isLoading || isLoadingPatch || mutationDelete.isLoading}
          labelSubmit={openModal.type === 'Buat' ? 'Buat' : 'Simpan'}
          title={`${openModal.type} jurusan`}
        >
          {(openModal.type === 'Edit' || openModal.type === 'Buat') && (
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                size="small"
                value={formValue?.nama || ''}
                onChange={(i) => {
                  setFormValue((prev) => ({ ...prev, nama: i?.target?.value }));
                }}
                label="Nama jurusan"
              />
              <TextField
                size="small"
                value={formValue?.kode_jurusan || ''}
                onChange={(i) => {
                  setFormValue((prev) => ({ ...prev, kode_jurusan: i?.target?.value }));
                }}
                label="Kode jurusan"
              />
            </Box>
          )}
        </ScreenDialog>
        <Box sx={{ my: 2 }}>
          <Button onClick={handleClickCreate} variant="contained">
            Buat jurusan baru
          </Button>
        </Box>
        <TableComponen
          colorHead="cyan"
          count={totalPage}
          pageOnchange={(x, y) => {
            setPage(y);
          }}
          page={page}
          tableBody={itemRebuild}
          tableHead={tableHead}
          totalRows={Boolean(search) ? totalRows : null}
          emptyTag={Boolean(search) ? `( tidak bisa menemukan "${search}")` : '( sepertinya belum membuat jurusan )'}
          tooltipCustom="Edit"
          handleCustomOnClickRow={handleCustomOnClickRow}
          handleDelete={handleDelete}
          customIcon={<CreateIcon sx={{ color: green[500] }} />}
          isLoading={isLoading}
          totalData={totalData}
        />
      </Box>
    </ContainerCard>
  );
}

export default Major;
