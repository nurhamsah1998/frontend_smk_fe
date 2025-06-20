import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from './api';

function useInfinityFetch({ api, enabled = true }) {
  const nav = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [itemData, setItemData] = useState([]);
  const token = window.localStorage.getItem('accessToken');
  const localToken = token ? jwtDecode(token || {}) : {};
  const fetchProjects = async ({ pageParam }) => {
    try {
      const res = await axios.get(`${apiUrl}${api}?limit=10&page=${pageParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res;
    } catch (error) {
      if (error?.response?.status === 403) {
        enqueueSnackbar(error?.response?.data?.msg, { variant: 'error' });
        if (localToken?.roleStaff === 'ADMINISTRASI') {
          nav('/staff-login');
        } else {
          nav('/');
        }
        window.localStorage.clear();
      }
      return [];
    }
  };
  const { data, fetchNextPage, isLoading, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: [`${apiUrl}${api}`],
    queryFn: fetchProjects,
    enabled,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.data?.page;
      const totalPage = lastPage?.data?.totalPage;
      if (currentPage === totalPage) {
        return undefined;
      }
      return currentPage + 1;
    },
  });
  const arrayMerge = (pageParams, pages) => {
    let result = [];
    for (let index = 0; index < pageParams.length; index += 1) {
      result = result.concat(pages[index]?.data?.data);
    }
    return result;
  };

  useEffect(() => {
    if (Boolean(data?.pageParams?.length)) {
      const listCommentUQ = arrayMerge(data?.pageParams, data?.pages);
      setItemData(listCommentUQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return {
    itemData,
    fetchNextPage,
    isLoading,
    hasNextPage,
    refetch,
  };
}

export default useInfinityFetch;
