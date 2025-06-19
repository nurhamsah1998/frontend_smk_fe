/* eslint-disable import/no-unresolved */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContainerCard from 'src/components/ContainerCard';
import useQueryFetch from 'src/hooks/useQueryFetch';
import { ViewAllNews } from 'src/pages/DEV/news/AllNews';

function AllNews() {
  const { items, isLoading } = useQueryFetch({
    module: 'news',
    invalidateKey: 'news',
  });
  const nav = useNavigate();
  const handleClickCard = (item) => {
    nav(`/staff-tu/news/detail/${item?.id}`);
  };
  return (
    <ContainerCard>
      <ViewAllNews isLoading={isLoading} handleClickCard={handleClickCard} items={items} />
    </ContainerCard>
  );
}

export default AllNews;
