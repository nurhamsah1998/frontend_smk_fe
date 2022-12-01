import React, { Fragment } from 'react';
import { Box, Typography } from '@mui/material';
import useFetch from '../../../hooks/useFetch';
import AccordionList from '../../../components/AccordionList';

function Tagihan() {
  const { items } = useFetch({
    module: 'tagihan-siswa',
  });
  console.log(items);
  return (
    <Box>
      {items?.map((item, index) => (
        <Box key={index}>
          <AccordionList
            title={item.nama}
            content={
              item?.periode ? (
                <>
                  <Box>
                    {JSON.parse(item?.periode)?.map((x, y) => (
                      <Box key={y}>
                        <Typography>{x.bulan}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Box>
                  <Typography>{item.nama} Bukan periode</Typography>
                </Box>
              )
            }
          />
        </Box>
      ))}
    </Box>
  );
}

export default Tagihan;
