import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { apiUrl } from './api';

function useMutationPatch({
  module,
  next = () => false,
  fail = () => false,
  isBulk = false,
  successMessage,
  disabledAfterMutation = false,
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
          if (disabledAfterMutation) return;
          enqueueSnackbar(successMessage || res?.data?.msg, { variant: 'success' });
          client.invalidateQueries([module]);
          next(res);
        })
        .catch((error) => {
          if (disabledAfterMutation) return;
          console.log(error, 'ini');
          enqueueSnackbar(error?.response?.data?.msg || error?.response?.data || 'Internal server error !', {
            variant: 'error',
          });
          fail(error);
        });
    },
    { networkMode: 'always' }
  );
  return { mutationPatch, ...mutationPatch };
}

export default useMutationPatch;
