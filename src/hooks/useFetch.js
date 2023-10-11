import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { apiUrl } from './api';

function useFetch({ module, enabled = true, isCustom = false, params = '', initialLimit = 40 }) {
  const token = window.localStorage.getItem('accessToken');
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [limit, setLimit] = React.useState(initialLimit);
  const query = useQuery(
    [module, enabled, isCustom],
    () =>
      axios.get(`${apiUrl}${module}${isCustom ? '' : `?page=${page}&search=${search}&limit=${limit || 10}${params}`}`, {
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
  const totalData = query.data?.data?.totalData;
  React.useEffect(() => {
    query.refetch();
    if (search) {
      setPage(1);
    }
  }, [page, search, params, limit]);
  return {
    items,
    setPage,
    search,
    currentPage,
    totalRows,
    totalPage,
    totalData,
    setSearch,
    itemsNoPagination,
    setLimit,
    page,
    limit,
    ...query,
  };
}

export default useFetch;
