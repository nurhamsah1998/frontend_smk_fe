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
import TextFieldNumberFormat from '../../../components/TextFieldNumberFormat';

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
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const dataTextField = itemsNoPagination?.map((x) => {
    delete x?.id;
    delete x?.updatedAt;
    delete x?.createdAt;

    return Object.entries(x);
  });
  console.log(dataTextField);
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
          // eslint-disable-next-line react/jsx-key
          <TabPanel value={value} index={y} key={y}>
            <Box key={y} sx={{ display: 'grid', gap: 2 }}>
              {dataTextField[y]?.map((item, index) => {
                if (item?.includes('tahun_angkatan')) {
                  return;
                }
                // eslint-disable-next-line consistent-return
                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography width="35%" textTransform="capitalize">
                      {item[0].replace(/_/g, ' ')}
                    </Typography>
                    <TextFieldNumberFormat width="50%" size="small" label="Nominal" value={item[1]} fullWidth />
                  </Box>
                );
              })}
            </Box>
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
}
