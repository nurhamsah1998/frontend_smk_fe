import { useMutation, onlineManager } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

function useLogin({ module }) {
  const isOnline = onlineManager.isOnline();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const traficRole = [
    {
      role: 'ADMINISTRASI',
      path: '/staff-tu/tagihan',
    },
    {
      role: 'GURU',
      path: '/staff-guru/app',
    },
  ];
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
          window.localStorage.setItem('accessToken', res.data?.accessToken);
          // window.location.reload();
          const token = jwt_decode(window.localStorage.getItem('accessToken'));
          if (token) {
            const findRole = traficRole?.find((i) => i.role === token.roleStaff);
            navigate(findRole.path);
          }
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
