import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { apiUrl } from './api';

function useMutationPost({ module, next = () => false }) {
  const { enqueueSnackbar } = useSnackbar();
  const client = useQueryClient();
  const mutationPost = useMutation(
    [module],
    (values) => {
      axios
        .post(
          `${apiUrl}${module}`,
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
  return { mutationPost, ...mutationPost };
}

export default useMutationPost;
