import React from 'react';
import { Box, Button, Typography, Tab, Tabs, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import useDelete from '../../../hooks/useDelete';
import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import BuatTagihan from './BuatTagihan';
import { Dialog } from '../../../hooks/useContextHook';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export default function TagihanStaff() {
  const { setDialog } = React.useContext(Dialog);
  const { itemsNoPagination, data } = useFetch({
    module: 'tagihan-permanent',
  });

  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const clone = [...itemsNoPagination];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log(data, '===');
  const dataTextField = itemsNoPagination?.map((x) => {
    delete x?.id;
    delete x?.updatedAt;
    delete x?.createdAt;

    return Object.entries(x);
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {itemsNoPagination?.map((item, index) => (
            <Tab key={index} label={item?.tahun_angkatan} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      <Box>
        {itemsNoPagination?.map((x, y) => (
          <Box key={y}>
            <TabPanel value={value} index={y}>
              {dataTextField[y]?.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Typography>s</Typography>
                  <TextField size="small" label={item[0]} value={item[1]} />
                </Box>
              ))}
            </TabPanel>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
