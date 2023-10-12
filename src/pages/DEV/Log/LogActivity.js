import { Box, TextField } from '@mui/material';
import React from 'react';
import { range } from 'lodash';
import { JsonView, allExpanded, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import DatePicker from 'react-datepicker';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import 'react-datepicker/dist/react-datepicker.css';
import { months } from '../../Laporan/transaksi/ReportTransaksi';

import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import { LabelField } from '../../../components/Commons';

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
      id: 'author',
      label: 'Author',
    },
    {
      id: 'data',
      label: 'Data',
    },
  ];
  const years = range(2000, getYear(new Date()) + 1, 1);
  const itemsRebuild = React.useMemo(() => {
    return items?.map((item) => ({
      action: item?.action,
      data: <JsonView data={item?.data} shouldExpandNode={allExpanded} style={darkStyles} />,
      author: item?.author?.namaStaff,
    }));
  }, [items]);
  const handleCalenderClose = () => {
    console.log(new Date(startDate).toISOString(), endDate);
  };
  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <LabelField title="Filter tanggal" />
        <DatePicker
          selectsRange
          onCalendarClose={handleCalenderClose}
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => {
            const disabledNextBtn = getMonth(date) === 11 && getYear(date) === getYear(new Date());
            const disabledPrevBtn = getMonth(date) === 0 && getYear(date) === 2000;
            return (
              <div
                style={{
                  margin: 10,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled || disabledPrevBtn}>
                  {'<'}
                </button>
                <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)}>
                  {years.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <select
                  value={months[getMonth(date)]}
                  onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                >
                  {months.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled || disabledNextBtn}>
                  {'>'}
                </button>
              </div>
            );
          }}
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          isClearable
          onChange={onChangeDate}
          customInput={
            <TextField
              InputProps={{
                readOnly: true,
              }}
              size="small"
            />
          }
        />
      </Box>
      <TableComponen
        hideOption
        colorHead="blue"
        count={totalPage}
        pageOnchange={(x, y) => {
          setPage(y);
        }}
        page={page}
        tableBody={itemsRebuild}
        tableHead={head}
        totalRows={totalRows}
        totalData={totalData}
        isLoading={isLoading}
      />
    </Box>
  );
}

export default LogActivity;
