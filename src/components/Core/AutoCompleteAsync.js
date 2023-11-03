import React from 'react';
import { Autocomplete, TextField, Box, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import useFetch from '../../hooks/useFetch';

function AutoCompleteAsync({
  onChange,
  module,
  label,
  size,
  value,
  initialLimit = 10,
  keyAttribute = 'nama',
  paginateData = false,
  type = 'text',
}) {
  const { itemsNoPagination, refetch, isFetching, setSearch } = useFetch({
    module,
    enabled: false,
    initialLimit,
  });
  const items = Boolean(paginateData)
    ? itemsNoPagination?.data?.map((item) => ({ ...item, [keyAttribute]: String(item[keyAttribute]) }))
    : itemsNoPagination;
  return (
    <Box>
      <Autocomplete
        disablePortal
        loading={isFetching}
        onOpen={() => refetch()}
        freeSolo
        value={value}
        isOptionEqualToValue={(item, value) => item[keyAttribute] === value[keyAttribute]}
        getOptionLabel={(item) => item[keyAttribute] || ''}
        options={items || []}
        fullWidth
        disableClearable
        onKeyDownCapture={debounce((i) => {
          setSearch(String(i.target.value));
        }, 500)}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            type={type}
            size={size}
            label={label}
          />
        )}
      />
    </Box>
  );
}

export default AutoCompleteAsync;
