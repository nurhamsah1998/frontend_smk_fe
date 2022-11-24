import { useMutation, onlineManager } from '@tanstack/react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function useLogin({ module }) {
  const isOnline = onlineManager.isOnline();
  const { enqueueSnackbar } = useSnackbar();
  console.log(isOnline, 'ini');
  const login = useMutation(
    [module],
    (values) => {
      axios({
        method: 'post',
        url: `http://localhost:5000/${module}`,
        data: { ...values },
      })
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
  return { login, ...login };
}

export default useLogin;
