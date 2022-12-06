import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import React from 'react';
import { apiUrl } from './api';

function useFetchById({ module, enabled = true, queryParam }) {
  const location = useLocation();
  const idCode = queryString.parse(location.search);
  const token = window.localStorage.getItem('accessToken');
  const query = useQuery(
    [module, queryParam],
    () =>
      axios.get(`${apiUrl}${module}/${idCode[queryParam]}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    {
      enabled: Boolean(idCode[queryParam]),
      networkMode: 'always',
    }
  );
  const items = query.data?.data || [];

  return { items, ...query };
}

export default useFetchById;
