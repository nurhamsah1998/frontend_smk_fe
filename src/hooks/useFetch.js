import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from './api';

function useFetch({ module, enabled = true }) {
  const token = window.localStorage.getItem('accessToken');
  const query = useQuery(
    [module, enabled],
    () =>
      axios.get(`${apiUrl}${module}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    {
      enabled: Boolean(enabled),
      networkMode: 'always',
    }
  );
  const items = query.data?.data || [];
  return { items, ...query };
}

export default useFetch;
