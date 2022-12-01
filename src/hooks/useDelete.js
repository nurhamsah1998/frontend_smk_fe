import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function useDelete({ module }) {
  const client = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const destroy = useMutation(
    [module],
    (values) => {
      axios
        .delete(`http://localhost:5000/${module}/${values}`)
        .then((res) => {
          enqueueSnackbar(res?.data?.msg, { variant: 'success' });
          client.invalidateQueries([module]);
        })
        .catch((error) => {
          enqueueSnackbar(error?.response?.data?.msg, { variant: 'error' });
        });
    },
    { networkMode: 'always' }
  );
  return { destroy, ...destroy };
}

export default useDelete;
