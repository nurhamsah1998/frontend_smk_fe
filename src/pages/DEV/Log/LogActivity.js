/* eslint-disable import/no-unresolved */
import { Box, Button } from '@mui/material';
import React, { useContext } from 'react';
import { Dialog } from 'src/hooks/useContextHook';
import useQueryFetch from 'src/hooks/useQueryFetch';
import { JsonView, darkStyles, collapseAllNested } from 'react-json-view-lite';
import { useSnackbar } from 'notistack';
import 'react-json-view-lite/dist/index.css';
import 'react-datepicker/dist/react-datepicker.css';

import ContainerCard from '../../../components/ContainerCard';
import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import { LabelField } from '../../../components/Commons';
import CustomDatePicker from '../../../components/CustomDatePicker';

function LogActivity() {
  const { setDialog } = useContext(Dialog);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const { items, setPage, refetch, page, totalData, isLoading, totalRows, totalPage } = useFetch({
    module: 'log',
    initialLimit: 10,
    params: `&startDate=${startDate}&endDate=${endDate}`,
  });
  const head = [
    {
      id: 'action',
      label: 'Action',
    },
    {
      id: 'author_name',
      label: 'Author name',
    },
    {
      id: 'author_username',
      label: 'Author username',
    },
    {
      id: 'data',
      label: 'Data',
    },
  ];
  const itemsRebuild = React.useMemo(
    () =>
      items?.map((item) => ({
        action: item?.action,
        data: (
          <JsonView
            data={item?.data}
            allExpanded={() => false}
            shouldExpandNode={collapseAllNested}
            style={darkStyles}
          />
        ),
        author_name: item?.author_name,
        author_username: item?.author_username,
      })),
    [items]
  );
  const { enqueueSnackbar } = useSnackbar();
  const {
    refetch: clearLog,
    isLoading: isLoadingClearLog,
    isFetching: isFetchingClearLog,
  } = useQueryFetch({
    module: 'clear-log',
    invalidateKey: 'log',
    enabled: false,
    retry: 1,
    next: (res) => {
      enqueueSnackbar(res?.data?.msg, { variant: 'success' });
      refetch();
    },
    fail: (error) => {
      enqueueSnackbar(error?.response?.data?.msg, { variant: 'error' });
    },
  });
  const handleDelete = () => {
    setDialog(() => ({
      helperText: `Apakah anda yakin ingin menghapus semua log aktivitas?`,
      title: 'Hapus',
      labelClose: 'Batal',
      variant: 'error',
      labelSubmit: 'Hapus',
      fullWidth: false,
      do: () => {
        clearLog();
      },
      isCloseAfterSubmit: true,
    }));
  };
  return (
    <ContainerCard>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <LabelField title="Filter tanggal" />
            <CustomDatePicker
              setEndDate={setEndDate}
              setStartDate={setStartDate}
              startDate={startDate}
              endDate={endDate}
            />
          </Box>
          <Button
            disabled={isLoadingClearLog && isFetchingClearLog}
            onClick={handleDelete}
            variant="contained"
            color="error"
          >
            Hapus semua aktivitas
          </Button>
        </Box>
        <TableComponen
          hideOption
          colorHead="cyan"
          count={totalPage}
          pageOnchange={(x, y) => {
            setPage(y);
          }}
          page={page}
          tableBody={itemsRebuild}
          tableHead={head}
          totalRows={Boolean(endDate) ? totalRows : null}
          emptyTag={
            Boolean(endDate)
              ? `( tidak bisa menemukan, mungkin masih belum ada aktivitas diwaktu tersebut )`
              : '( sepertinya belum ada aktivitas )'
          }
          totalData={totalData}
          isLoading={isLoading}
        />
      </Box>
    </ContainerCard>
  );
}

export default LogActivity;
