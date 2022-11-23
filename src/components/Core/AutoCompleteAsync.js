import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import useFetch from '../../hooks/useFetch';

function AutoCompleteAsync({ onChange, module, label }) {
  const { items, refetch, isLoading } = useFetch({
    module,
    enabled: false,
  });
  return (
    <Box>
      <Autocomplete
        disablePortal
        loading={isLoading}
        onOpen={() => refetch()}
        getOptionLabel={(items) => items?.nama || ''}
        options={items || []}
        fullWidth
        onChange={onChange}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Box>
  );
}

export default AutoCompleteAsync;
