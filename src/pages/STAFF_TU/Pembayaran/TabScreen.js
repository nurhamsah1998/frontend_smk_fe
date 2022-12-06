import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { AppBar } from '@mui/material';
import Box from '@mui/material/Box';
import AccordionList from '../../../components/AccordionList';
import TableComponen from '../../../components/TableComponent';
import useFetchById from '../../../hooks/useFetchById';

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

export default function TabScreen({ tabList }) {
  const { items } = useFetchById({
    module: 'tagihan',
    queryParam: 'open-student-bill-id',
  });
  const [value, setValue] = React.useState(0);
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
      id: 'isPaid',
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
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log(`0${value + 1}`);
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="inherit"
            aria-label="full width tabs example"
          >
            {tabList?.map((item, index) => (
              <Tab key={index} label={item?.label} {...a11yProps(index)} />
            ))}
          </Tabs>
        </AppBar>
      </Box>
      <Box>
        {tabList?.map((item, index) => (
          <TabPanel key={index} value={value} index={index}>
            <Box sx={{ display: 'grid', gap: 2 }}>
              {items?.map((item, index) => (
                <Box key={index}>
                  <AccordionList
                    title={item.nama}
                    content={
                      item?.periode ? (
                        <>
                          <Box>
                            <Box mt={2}>
                              <TableComponen
                                disablePagination
                                colorHead="cyan"
                                hideOption
                                tableBody={item?.periode}
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
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
}
