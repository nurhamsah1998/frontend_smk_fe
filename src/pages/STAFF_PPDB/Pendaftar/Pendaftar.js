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
  const tableHead = [
    {
      id: 'nama',
      label: 'Nama tagihan',
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
          label: 'Siswa',
          value: 'accepted',
        },
        {
          variant: 'error',
          label: 'Calon siswa',
          value: 'checking',
        },
      ],
    },
  ];
  return (
    <Box>
      <Box>
        <TableComponen
          handleSwitch
          checked={checked}
          handleChangeSwitch={handleChangeSwitch}
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
