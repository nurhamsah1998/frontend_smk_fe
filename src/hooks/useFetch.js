import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { apiUrl } from './api';

function useFetch({ module, enabled = true, isCustom = false }) {
  const token = window.localStorage.getItem('accessToken');
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [limit, setLimit] = React.useState(5);
  const query = useQuery(
    [module, enabled, isCustom],
    () =>
      axios.get(`${apiUrl}${module}${isCustom ? '' : `?page=${page}&search=${search}&limit=${limit}`}`, {
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
  const itemsNoPagination = query.data?.data || [];
  const totalPage = query.data?.data?.totalPage;
  const currentPage = query.data?.data?.page;
  const totalRows = query.data?.data?.totalRows;

  React.useEffect(() => {
    query.refetch();
    if (search) {
      setPage(0);
    }
  }, [page, search]);
  return { items, setPage, search, currentPage, totalRows, totalPage, setSearch, itemsNoPagination, page, ...query };
}

export default useFetch;
