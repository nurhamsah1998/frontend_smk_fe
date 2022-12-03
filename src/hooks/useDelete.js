import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Dialog } from './useContextHook';

function useDelete({ module, isCloseAfterConfirmDelete }) {
  const { setDialog } = React.useContext(Dialog);
  const client = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const destroy = useMutation(
    [module],
    (values) => {
      axios
        .delete(`http://127.0.0.1:5000/${module}/${values}`)
        .then((res) => {
          if (isCloseAfterConfirmDelete) {
            enqueueSnackbar(res?.data?.msg, { variant: 'success' });
            client.invalidateQueries([module]);
            setDialog((i) => ({
              do: null,
              title: i.title,
              content: i.content,
            }));
          } else {
            enqueueSnackbar(res?.data?.msg, { variant: 'success' });
            client.invalidateQueries([module]);
          }
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
