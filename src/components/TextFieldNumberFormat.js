import React from 'react';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

function TextFieldNumberFormat({ value, onChange, label, fullWidth, sx, size }) {
  return (
    <NumericFormat
      prefix="Rp"
      thousandSeparator
      customInput={TextField}
      value={value}
      onChange={onChange}
      label={label}
      sx={{ ...sx }}
      size={size}
      fullWidth={fullWidth}
    />
  );
}

export default TextFieldNumberFormat;
