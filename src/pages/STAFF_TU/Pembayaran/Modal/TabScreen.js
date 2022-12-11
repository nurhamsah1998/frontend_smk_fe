import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { AppBar, ListItemText, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import queryString from 'query-string';
import { grey } from '@mui/material/colors';
import jwtDecode from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import AccordionList from '../../../../components/AccordionList';
import TableComponen from '../../../../components/TableComponent';
import useFetchById from '../../../../hooks/useFetchById';
import useMutationPost from '../../../../hooks/useMutationPost';
import ScreenDialog from '../../../../components/ScreenDialog';
import { FormatCurrency } from '../../../../components/FormatCurrency';
import TagihanSpp from './SPP/TagihanSpp';
import TagihanNonSpp from './NonSPP/TagihanNonSpp';

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

export default function TabScreen({ tabList, studentProfile }) {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [moneyAccepted, setMoneyAccepted] = React.useState(0);
  const [note, setNote] = React.useState('');
  const [openModalTransaction, setOpenModalTransaction] = React.useState({ data: {}, open: false });
  const { items, refetch } = useFetchById({
    module: 'tagihan',
    /// get tagihan by kode_siswa
    idCode: `${studentProfile?.angkatan}${studentProfile?.jurusan?.nama}0${value + 1}?kode_tagihan=${
      /// this for get invoice from backend to compare with tagihan
      studentProfile?.kode_siswa
    }`,
  });
  const { mutationPost } = useMutationPost({
    module: 'invoice',
    next: () => {
      setOpenModalTransaction({ data: null, open: false });
      refetch();
    },
  });

  const localToken = window.localStorage.getItem('accessToken');
  const token = jwtDecode(localToken || '');

  const handleTransaction = (item) => {
    setOpenModalTransaction({ data: item, open: true });
  };

  const handleSubmit = () => {
    const body = {
      nama: studentProfile?.nama,
      total: Number(openModalTransaction?.data?.total),
      kode_tagihan: studentProfile?.kode_siswa,
      kode_pembayaran: openModalTransaction?.data?.kode_bulan,
      note,
      uang_diterima: Number(moneyAccepted),
      petugas: token?.namaStaff,
    };
    mutationPost.mutate(body);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleInvoice = (event) => {
    console.log(event);
  };
  console.log(items);
  return (
    <Box sx={{ width: '100%' }}>
      <ScreenDialog
        open={openModalTransaction.open}
        title="Daftar tagihan siswa"
        handleSubmit={handleSubmit}
        handleClose={() => setOpenModalTransaction({ data: null, open: false })}
        labelClose="cancel"
        labelSubmit="bayar"
      >
        <Box>
          <ListItemText primary="Total tagihan" secondary={FormatCurrency(openModalTransaction?.data?.total)} />
          <TextField
            onChange={(i) => setMoneyAccepted(i.target.value)}
            value={moneyAccepted}
            sx={{ mt: 2 }}
            type="number"
            label="Uang diterima"
            fullWidth
          />
          <TextField onChange={(i) => setNote(i.target.value)} value={note} sx={{ mt: 2 }} label="Catatan" fullWidth />
        </Box>
      </ScreenDialog>
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
      <Box sx={{ border: `${grey[300]} 1px solid`, width: '100%' }}>
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
                            <TagihanSpp
                              handleTransaction={handleTransaction}
                              handleInvoice={handleInvoice}
                              item={item}
                            />
                          </>
                        ) : (
                          <Box>
                            <TagihanNonSpp item={item} studentProfile={studentProfile} />
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
