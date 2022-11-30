import React from 'react';
import useFetch from '../../../hooks/useFetch';

function Tagihan() {
  const { items } = useFetch({
    module: 'tagihan',
  });
  console.log(items);
  return <div>Tagihan</div>;
}

export default Tagihan;
