import React, { Fragment } from 'react';
import { Box, Typography } from '@mui/material';
import useFetch from '../../../hooks/useFetch';
import AccordionList from '../../../components/AccordionList';
import TableComponen from '../../../components/TableComponent';

function Tagihan() {
  const { items } = useFetch({
    module: 'tagihan-siswa',
  });
  const itemRebuild = items?.map((i) => ({
    ...i,
    periode: i?.periode ? JSON.parse(i?.periode) : i?.periode,
    status: false,
  }));
  console.log(itemRebuild);
  const tableHead = [
    {
      id: 'bulan',
      label: 'Bulan',
    },
    {
      id: 'total',
      label: 'Nominal',
    },
    {
      id: 'status',
      label: 'Status',
      variantStatusColor: [
        {
          variant: 'success',
          label: 'Lunas',
          value: true,
        },
        {
          variant: 'error',
          label: 'Belum lunas',
          value: false,
        },
      ],
    },
  ];

  /// LAB
  // const x = [
  //   {
  //     name: 'A',
  //     code: 'A1',
  //   },
  //   {
  //     name: 'B',
  //     code: 'B1',
  //   },
  //   {
  //     name: 'C',
  //     code: 'C1',
  //   },
  //   {
  //     name: 'D',
  //     code: 'D1',
  //   },
  //   {
  //     name: 'E',
  //     code: 'E1',
  //   },
  // ];
  // const code = [
  //   {
  //     code: 'C1',
  //     class: '009',
  //   },
  //   {
  //     code: 'A1',
  //     class: '606',
  //   },
  // ];
  // const result = x.map((i) => {
  //   const labX = code.find((o) => o.code === i.code);
  //   if (labX) {
  //     return { ...i, isMatch: true };
  //   }
  //   if (!labX) {
  //     return { ...i, isMatch: false };
  //   }
  //   return labX;
  // });

  // console.log(result);

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {itemRebuild?.map((item, index) => (
        <Box key={index}>
          <AccordionList
            title={item.nama}
            content={
              item?.periode ? (
                <>
                  <Box>
                    <Box mt={2}>
                      <TableComponen
                        colorHead="cyan"
                        hideOption
                        tableBody={[{ bulan: 'Januari', total: '20000', status: false }]}
                        tableHead={tableHead}
                      />
                    </Box>
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
