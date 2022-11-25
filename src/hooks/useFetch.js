import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function useFetch({ module, select = '*', enabled = true }) {
  const token = window.localStorage.getItem('accessToken');
  const query = useQuery(
    [module, enabled],
    () =>
      axios.get(`http://localhost:5000/${module}`, {
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
