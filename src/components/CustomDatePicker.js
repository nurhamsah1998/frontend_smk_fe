import './CustomDatePicker.css';

import { Box, TextField } from '@mui/material';
import React from 'react';
import { range } from 'lodash';
import DatePicker, { registerLocale } from 'react-datepicker';
import getMonth from 'date-fns/getMonth';
import { getDay } from 'date-fns';
import getYear from 'date-fns/getYear';
/// https://stackoverflow.com/a/54399915/18038473
import 'react-datepicker/dist/react-datepicker.css';
import id from 'date-fns/locale/id';

registerLocale('id', id);

function CustomDatePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  disabledMultipick = false,
  disabled = false,
}) {
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
  const years = range(2000, getYear(new Date()) + 3, 1);
  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0;
  };
  const onChangeDate = (dates) => {
    if (Boolean(disabledMultipick)) {
      setStartDate(dates);
    } else {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    }
  };
  return (
    <Box>
      <DatePicker
        filterDate={isWeekday}
        selectsRange={!Boolean(disabledMultipick)}
        locale="id"
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => {
          const disabledNextBtn = getMonth(date) === 11 && Number(getYear(date)) === Number(getYear(new Date()) + 2);
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
        startDate={Boolean(disabledMultipick) ? null : startDate}
        endDate={Boolean(disabledMultipick) ? null : endDate}
        isClearable={!Boolean(disabledMultipick)}
        onChange={onChangeDate}
        customInput={
          <TextField
            InputProps={{
              readOnly: true,
              disabled,
            }}
            size="small"
          />
        }
      />
    </Box>
  );
}

export default CustomDatePicker;
