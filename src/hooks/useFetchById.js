import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from './api';

function useFetchById({ module, idCode = false }) {
  const token = window.localStorage.getItem('accessToken');
  const query = useQuery(
    [module, idCode],
    () =>
      axios.get(`${apiUrl}${module}/${idCode}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    {
      enabled: Boolean(idCode),
      networkMode: 'always',
    }
  );
  const items = query.data?.data || [];

  return { items, ...query };
}

export default useFetchById;
