import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { apiUrl } from './api';

function useMutationPatch({
  module,
  next = () => {
    return false;
  },
}) {
  const { enqueueSnackbar } = useSnackbar();
  const client = useQueryClient();
  const mutationPatch = useMutation(
    [module],
    (values) => {
      axios
        .patch(
          `${apiUrl}${module}/${values?.id}`,
          { ...values },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((res) => {
          enqueueSnackbar(res?.data?.msg, { variant: 'success' });
          client.invalidateQueries([module]);

          next();
        })
        .catch((error) => {
          console.log(error, 'ini');
          enqueueSnackbar(error?.response?.data?.msg, { variant: 'error' });
        });
    },
    { networkMode: 'always' }
  );
  return { mutationPatch, ...mutationPatch };
}

export default useMutationPatch;
