import { Box } from '@mui/material';
import React from 'react';

import useFetch from '../../../hooks/useFetch';
import useMutationPatch from '../../../hooks/useMutationPatch';
import TableComponen from '../../../components/TableComponent';

function Pendaftar() {
  const { items, totalPage, setPage } = useFetch({
    module: 'siswa',
  });
  const { mutationPatch } = useMutationPatch({
    module: 'siswa',
  });
  const itemsRebuild = items?.map((i) => ({ ...i, indicator: i?.status?.includes('accepted') }));
  const [checked, setChecked] = React.useState(null);
  const handleChangeSwitch = (i, data) => {
    const valueSwitch = i.target.checked;
    setChecked(valueSwitch);
    delete data?.indicator;
    mutationPatch.mutate({ ...data, status: valueSwitch ? 'accepted' : 'checking' });
  };
  console.log(itemsRebuild);
  const tableHead = [
    {
      id: 'nama',
      label: 'Student name',
    },
    {
      id: 'username',
      label: 'Username',
    },
    {
      id: 'status',
      label: 'Status',
      variantStatusColor: [
        {
          variant: 'success',
          label: 'Accepted',
          value: 'accepted',
        },
        {
          variant: 'error',
          label: 'Checking',
          value: 'checking',
        },
      ],
    },
  ];
  return (
    <Box>
      <Box>
        <TableComponen
          checked={checked}
          handleSwitch={handleChangeSwitch}
          setChecked={setChecked}
          count={totalPage}
          pageOnchange={(x, y) => {
            setPage(y - 1);
          }}
          tableBody={itemsRebuild}
          tableHead={tableHead}
        />
      </Box>
    </Box>
  );
}

export default Pendaftar;
