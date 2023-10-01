import { Box, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { debounce, range } from 'lodash';
import DatePicker from 'react-datepicker';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import 'react-datepicker/dist/react-datepicker.css';

import { LabelField } from '../../../components/Commons';
import TableComponen from '../../../components/TableComponent';
import useFetch from '../../../hooks/useFetch';

function ReportTransaksi() {
  const [limitView, setLimitView] = React.useState('40');
  const [startDate, setStartDate] = React.useState(null);
  const [kelas, setKelas] = React.useState('');
  const [subKelas, setSubKelasKelas] = React.useState('');
  const [jurusan, setJurusan] = React.useState('');
  const [endDate, setEndDate] = React.useState(null);

  const years = range(2000, getYear(new Date()) + 1, 1);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const { data } = useFetch({
    module: 'jurusan',
  });
  const { items, totalData, totalPage, totalRows, setPage, page, isLoading, setLimit, limit } = useFetch({
    module: 'get-all-invoice',
    params: `&startDate=${startDate}&endDate=${endDate}&kelas=${kelas}&jurusan=${jurusan}&sub_kelas=${subKelas}`,
  });

  const tableHead = [
    {
      id: 'nama',
      label: 'Nama siswa',
    },
    {
      id: 'kelas',
      label: 'Kelas',
    },
    {
      id: 'uang_diterima',
      label: 'Tunai',
      isCurrency: true,
    },
    {
      id: 'invoice',
      label: 'No Invoice',
    },
    {
      id: 'kode_pembayaran',
      label: 'Keterangan',
    },
  ];
  const itemsRebuild = React.useMemo(() => {
    return items?.map((i) => ({
      ...i,
      kelas: `${i?.kelas} ${i?.jurusan} ${i?.sub_kelas}`,
    }));
  }, [items]);
  const handleChangeDebounceLimit = debounce((i) => {
    setLimit(i);
  }, 500);
  const inputChangeLimit = React.useMemo(() => handleChangeDebounceLimit, []);
  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const handleCalenderClose = () => {
    console.log(new Date(startDate).toISOString(), endDate);
  };
  const handleChangesJurusan = (event, value) => {
    setPage(1);
    setJurusan(String(event.target.value));
  };
  const handleChangeSubKelas = (event) => {
    setPage(1);
    setSubKelasKelas(event.target.value);
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: '4px' }}>
            <Box>
              <LabelField
                title="Sort Jurusan"
                clearIcon={Boolean(jurusan)}
                onClickClearIcon={() => {
                  setJurusan('');
                }}
              />
              <Select
                sx={{
                  minWidth: '270px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={jurusan || ''}
                size="small"
                onChange={handleChangesJurusan}
              >
                {data?.data?.map((item, index) => (
                  <MenuItem key={index} onClick={() => setJurusan(item?.nama)} value={item?.nama}>
                    {item?.nama}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Box>
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
            <Box>
              <LabelField title="Sort Kelas" onClickClearIcon={() => setKelas('')} clearIcon={Boolean(kelas)} />
              <Select
                sx={{
                  minWidth: '100px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={kelas}
                size="small"
                onChange={(event) => {
                  setPage(1);
                  setKelas(event.target.value);
                }}
              >
                <MenuItem value={'10'}>10</MenuItem>
                <MenuItem value={'11'}>11</MenuItem>
                <MenuItem value={'12'}>12</MenuItem>
              </Select>
            </Box>
            <Box>
              <LabelField
                title="Sort Sub Kelas"
                onClickClearIcon={() => setSubKelasKelas('')}
                clearIcon={Boolean(subKelas)}
              />

              <Select
                sx={{
                  minWidth: '130px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subKelas}
                size="small"
                onChange={handleChangeSubKelas}
              >
                <MenuItem value={'1'}>1</MenuItem>
                <MenuItem value={'2'}>2</MenuItem>
                <MenuItem value={'3'}>3</MenuItem>
                <MenuItem value={'4'}>4</MenuItem>
                <MenuItem value={'5'}>5</MenuItem>
                <MenuItem value={'6'}>6</MenuItem>
              </Select>
            </Box>

            <Box>
              <LabelField
                title="/Page"
                onClickClearIcon={() => {
                  setLimit(40);
                  setLimitView('');
                }}
                clearIcon={Boolean(limit !== 40)}
              />
              <TextField
                inputProps={{
                  min: 1,
                  max: 100,
                }}
                size="small"
                type="number"
                placeholder="40"
                value={limitView || ''}
                onChange={(i) => {
                  inputChangeLimit(i.target.value);
                  setLimitView(i.target.value);
                }}
                sx={{
                  width: '100px',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <TableComponen
        colorHead="blue"
        count={totalPage}
        pageOnchange={(x, y) => {
          setPage(y);
        }}
        page={page}
        tableBody={itemsRebuild}
        tableHead={tableHead}
        totalRows={Boolean(endDate) ? totalRows : null}
        totalData={totalData}
        isLoading={isLoading}
      />
    </Box>
  );
}

export default ReportTransaksi;
