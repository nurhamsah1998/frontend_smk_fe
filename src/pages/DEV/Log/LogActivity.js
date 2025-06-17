import { Box } from '@mui/material';
import React from 'react';
import { JsonView, darkStyles, collapseAllNested } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import 'react-datepicker/dist/react-datepicker.css';

import ContainerCard from '../../../components/ContainerCard';
import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import { LabelField } from '../../../components/Commons';
import CustomDatePicker from '../../../components/CustomDatePicker';

function LogActivity() {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const { items, setPage, page, totalData, isLoading, totalRows, totalPage } = useFetch({
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
  const itemsRebuild = React.useMemo(() => {
    return items?.map((item) => ({
      action: item?.action,
      data: (
        <JsonView data={item?.data} allExpanded={() => false} shouldExpandNode={collapseAllNested} style={darkStyles} />
      ),
      author_name: item?.author_name,
      author_username: item?.author_username,
    }));
  }, [items]);

  return (
    <ContainerCard>
      <Box>
        <Box sx={{ mb: 3 }}>
          <LabelField title="Filter tanggal" />
          <CustomDatePicker
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
          />
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
