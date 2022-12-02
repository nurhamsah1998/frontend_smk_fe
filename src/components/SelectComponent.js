import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectComponent({ placeholder, onChange, value, listSelect, size }) {
  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{placeholder}</InputLabel>
        <Select size={size} value={value} label={placeholder} onChange={onChange}>
          {listSelect?.map((item, index) => (
            <MenuItem key={index} value={item?.value}>
              {item?.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
