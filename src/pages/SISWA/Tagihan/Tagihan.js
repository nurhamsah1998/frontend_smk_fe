import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Tabs, Tab, AppBar, ListItemText } from '@mui/material';
import { grey } from '@mui/material/colors';
import useFetch from '../../../hooks/useFetch';
import AccordionList from '../../../components/AccordionList';
import TableComponen from '../../../components/TableComponent';
import useFetchById from '../../../hooks/useFetchById';
import { PROFILE } from '../../../hooks/useHelperContext';

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

function Tagihan() {
  const [value, setValue] = React.useState(0);
  const { itemsNoPagination, isLoading } = React.useContext(PROFILE);
  const { items, refetch } = useFetchById({
    module: 'tagihan',
    idCode: `${itemsNoPagination?.angkatan}${itemsNoPagination?.jurusan?.nama}0${value + 1}?kode_tagihan=${
      itemsNoPagination?.kode_siswa
    }`,
  });
  console.log(items, 'opop');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const tabList = [
    {
      label: 'Kelas I',
      class: '01',
    },
    {
      label: 'Kelas II',
      class: '02',
    },
    {
      label: 'Kelas III',
      class: '03',
    },
  ];

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
  return (
    <Box>
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
      <Box sx={{ border: `${grey[300]} 1px solid` }}>
        {tabList?.map((item, index) => (
          <TabPanel key={index} value={value} index={index}>
            <Box sx={{ display: 'grid', gap: 2 }}>
              {items?.length <= 0 ? (
                <Box>
                  <Typography textAlign="center" variant="h4">
                    Tagihan Belum Tersedia
                  </Typography>
                </Box>
              ) : (
                items?.map((item, index) => (
                  <Box key={index}>
                    <AccordionList
                      title={item.nama}
                      content={
                        item?.periode ? (
                          <>
                            <Box>
                              <Box mt={2}>
                                <TableComponen
                                  hideOption
                                  disablePagination
                                  colorHead="cyan"
                                  tableBody={item?.periode}
                                  tableHead={tableHead}
                                />
                              </Box>
                            </Box>
                          </>
                        ) : (
                          <Box>
                            <ListItemText secondary={item?.deskripsi} />
                          </Box>
                        )
                      }
                    />
                  </Box>
                ))
              )}
            </Box>
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
}

export default Tagihan;
