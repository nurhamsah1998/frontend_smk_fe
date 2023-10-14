import { useMutation, onlineManager } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import { apiUrl } from './api';

function useLogin({ module }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const traficRole = [
    {
      role: 'DEV',
      path: '/dev/dashboard',
    },
    {
      role: 'ADMINISTRASI',
      path: '/staff-tu/dashboard',
    },
    {
      role: 'GURU',
      path: '/staff-guru/dashboard',
    },
    {
      role: 'PPDB',
      path: '/staff-ppdb/dashboard',
    },
    {
      role: 'ANONIM',
      path: '/brand',
    },
  ];
  const login = useMutation(
    [module],
    async (values) => {
      await axios({
        method: 'post',
        url: `${apiUrl}${module}`,
        data: { ...values },
      })
        .then((res) => {
          enqueueSnackbar(res?.data?.msg, { variant: 'success' });
          window.localStorage.setItem('accessToken', res.data?.accessToken);

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
