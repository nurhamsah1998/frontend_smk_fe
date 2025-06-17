/* eslint-disable import/no-unresolved */
import React from 'react';
import useQueryFetch from 'src/hooks/useQueryFetch';

function News() {
  const { items } = useQueryFetch({
    module: 'news',
  });
  console.log(items);
  return <div>News</div>;
}

export default News;
