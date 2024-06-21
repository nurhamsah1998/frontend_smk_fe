import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { apiUrl } from './api';

function useRegister({ module, next = () => false }) {
  const { enqueueSnackbar } = useSnackbar();
  const client = useQueryClient();
  const register = useMutation(
    [module],
    async (values) => {
      await axios
        .post(
          `${apiUrl}${module}`,
          { ...values },
          {
            headers: {
              authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((res) => {
          client.invalidateQueries(module);
          enqueueSnackbar(res?.data?.msg, { variant: 'success' });
          next();
        })
        .catch((error) => {
          console.log(error, 'ini');
          enqueueSnackbar(error?.response?.data?.msg, { variant: 'error' });
        });
    },
    { networkMode: 'always' }
  );
  return { register, ...register };
}

export default useRegister;
