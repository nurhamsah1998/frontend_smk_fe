import { Box } from '@mui/material';
import React from 'react';
import useFetch from '../../../hooks/useFetch';

function LogActivity() {
  const { items } = useFetch({
    module: 'log',
    initialLimit: 10,
  });
  console.log(items);
  return <Box>LogActivity</Box>;
}

export default LogActivity;
