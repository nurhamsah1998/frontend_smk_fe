import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { apiUrl } from './api';

function useMutationPatch({
  module,
  next = () => {
    return false;
  },
  fail = () => {
    return false;
  },
  isBulk = false,
  successMessage,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const client = useQueryClient();
  const mutationPatch = useMutation(
    [module],
    async (values) => {
      await axios
        .patch(
          `${apiUrl}${module}${isBulk ? '' : `/${values?.id}`}`,
          { ...values },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((res) => {
          enqueueSnackbar(successMessage || res?.data?.msg, { variant: 'success' });
          client.invalidateQueries([module]);
          next(res);
        })
        .catch((error) => {
          console.log(error, 'ini');
          enqueueSnackbar(error?.response?.data?.msg, { variant: 'error' });
          fail(error);
        });
    },
    { networkMode: 'always' }
  );
  return { mutationPatch, ...mutationPatch };
}

export default useMutationPatch;
