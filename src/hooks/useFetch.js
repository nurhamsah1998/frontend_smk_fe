import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { apiUrl } from './api';

function useFetch({ module, enabled = true }) {
  const token = window.localStorage.getItem('accessToken');
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [limit, setLimit] = React.useState(10);
  const query = useQuery(
    [module, enabled],
    () =>
      axios.get(`${apiUrl}${module}?page=${page}&search=${search}&limit=${limit}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    {
      enabled: Boolean(enabled),
      networkMode: 'always',
    }
  );
  const items = query.data?.data?.data || [];
  const totalPage = query.data?.data?.totalPage;
  const currentPage = query.data?.data?.page;
  const totalRows = query.data?.data?.totalRows;
  console.log(page);

  React.useEffect(() => {
    query.refetch();
  }, [page]);
  return { items, setPage, search, currentPage, totalRows, totalPage, setSearch, page, ...query };
}

export default useFetch;
