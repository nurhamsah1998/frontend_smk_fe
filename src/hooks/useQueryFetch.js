import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import queryString from 'query-string';
import React from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { apiUrl } from './api';

function useQueryFetch({ invalidateKey, module, enabled = true, query, initialLimit = 40 }) {
  const token = window.localStorage.getItem('accessToken');
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [limit, setLimit] = React.useState(initialLimit);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryParams = queryString.stringify(
    { ...query, page, limit, search },
    { skipNull: true, skipEmptyString: true }
  );
  const fetch = useQuery({
    queryKey: [invalidateKey, queryParams],
    queryFn: async () => {
      const data = await axios.get(`${apiUrl}${module}?${queryParams}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    enabled: Boolean(enabled),
    networkMode: 'always',
    onError: (error) => {
      if (error?.response?.status === 403) {
        enqueueSnackbar(error?.response?.data?.msg, { variant: 'error' });
        window.localStorage.clear();
        navigate('/');
      }
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
  const items = fetch.data?.data?.data || [];
  const itemsNoPagination = fetch.data?.data || [];
  const totalPage = fetch.data?.data?.totalPage;
  const currentPage = fetch.data?.data?.page;
  const totalRows = fetch.data?.data?.totalRows;
  const totalData = fetch.data?.data?.totalData;
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
    ...fetch,
  };
}

export default useQueryFetch;
