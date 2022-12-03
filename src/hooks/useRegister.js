import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { apiUrl } from './api';

function useRegister({
  module,
  next = () => {
    return false;
  },
}) {
  const { enqueueSnackbar } = useSnackbar();
  const register = useMutation(
    [module],
    (values) => {
      axios
        .post(`${apiUrl}${module}`, { ...values })
        .then((res) => {
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
