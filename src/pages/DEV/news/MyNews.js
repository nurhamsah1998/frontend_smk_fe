/* eslint-disable import/no-unresolved */
import { Box, Button } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import TableComponen from 'src/components/TableComponent';
import { Dialog } from 'src/hooks/useContextHook';
import useQueryFetch from 'src/hooks/useQueryFetch';
import { green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import useMutationDelete from 'src/hooks/useMutationDelete';

function MyNews() {
  const { setDialog } = useContext(Dialog);
  const { data, totalPage, setPage, page, search, totalRows, totalData, isLoading, refetch } = useQueryFetch({
    module: 'my-news',
  });
  const mutationDelete = useMutationDelete({
    module: 'my-news',
    next: () => {
      refetch();
    },
  });
  const itemRebuild = useMemo(() => data?.data?.data, [data]);
  const nav = useNavigate();
  const tableHead = [
    {
      id: 'title',
      label: 'Judul',
    },
    {
      id: 'like',
      label: 'Reaksi suka',
    },
    {
      id: 'down_like',
      label: 'Reaksi tidak suka',
    },
    {
      id: 'createdAt',
      label: 'Dibuat',
      isDate: true,
    },
  ];
  const handleCustomOnClickRow = (i) => {
    nav(`/dev/news/update-news/${i?.id}`);
  };
  const handleDelete = (i) => {
    setDialog(() => ({
      helperText: `Apakah anda yakin ingin menghapus berita ${i?.title}?`,
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
  };
  const handleClickCreate = () => {
    nav(`/dev/news/create-news`);
  };
  return (
    <Box>
      <Box sx={{ my: 2 }}>
        <Button onClick={handleClickCreate} variant="contained">
          Buat kabar berita
        </Button>
      </Box>
      <TableComponen
        colorHead="cyan"
        count={totalPage}
        pageOnchange={(x, y) => {
          setPage(y);
        }}
        page={page}
        tableBody={itemRebuild || []}
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
  );
}

export default MyNews;
