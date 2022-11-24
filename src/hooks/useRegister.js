import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function useRegister({ module }) {
  const { enqueueSnackbar } = useSnackbar();
  const register = useMutation(
    [module],
    (values) => {
      axios
        .post(`http://localhost:5000/${module}`, { ...values })
        .then((res) => {
          enqueueSnackbar(res?.data?.msg, { variant: 'success' });
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
