import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import useFetch from '../../hooks/useFetch';

function AutoCompleteAsync({ onChange, module, label }) {
  const { itemsNoPagination, refetch, isLoading, data } = useFetch({
    module,
    enabled: false,
  });
  return (
    <Box>
      <Autocomplete
        disablePortal
        loading={isLoading}
        onOpen={() => refetch()}
        getOptionLabel={(itemsNoPagination) => itemsNoPagination?.nama || ''}
        options={itemsNoPagination || []}
        fullWidth
        onChange={onChange}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Box>
  );
}

export default AutoCompleteAsync;
