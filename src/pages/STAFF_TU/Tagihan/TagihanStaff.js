import React from 'react';
import { Box, Button, Typography, Tab, Tabs, FormHelperText, CircularProgress, Paper, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import { Formik, Form } from 'formik';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import { grey, red } from '@mui/material/colors';

import useFetch from '../../../hooks/useFetch';
import useMutationPatch from '../../../hooks/useMutationPatch';
import { Dialog } from '../../../hooks/useContextHook';
import formatNumberChange from '../../../components/formatNumberChange';
import TextFieldNumberFormat from '../../../components/TextFieldNumberFormat';
import useMutationPost from '../../../hooks/useMutationPost';

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
  const { data, isLoading, setPage, page, totalPage } = useFetch({
    module: `tagihan-permanent`,
    initialLimit: 6,
  });
  const itemsNoPagination = React.useMemo(() => data?.data?.data, [data, page]);
  const mutation = useMutationPatch({
    module: 'tagihan-permanent',
  });
  const createMutation = useMutationPost({
    module: 'tagihan-permanent',
  });

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const dataTextField = itemsNoPagination?.map((x) => {
    delete x?.updatedAt;
    delete x?.createdAt;
    return Object.entries(x);
  });
  const memoix = React.useMemo(() => dataTextField, [itemsNoPagination]);
  const formRef = React.useRef();
  const handleSave = () => {
    formRef.current?.handleSubmit();
  };
  const handleAddTahunTagihan = () => {
    createMutation.mutate({ date: new Date().getFullYear() });
  };
  return (
    <Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <CircularProgress />
            <Typography>Memuat</Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Paper
            elevation={3}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              position: 'fixed',
              top: 60,
              right: 0,
              left: { xs: 0, sm: 0, md: 280, lg: 280 },
              px: 3,
              pb: '12px',
              bgcolor: '#f8fafb',
              zIndex: 1,
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton
                disabled={page === 1}
                onClick={() =>
                  setPage((prev) => {
                    return prev - 1;
                  })
                }
              >
                <NavigateBeforeIcon />
              </IconButton>
              <Tabs
                variant="scrollable"
                scrollButtons="auto"
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                {itemsNoPagination?.map((item, index) => (
                  <Tab key={index} label={item?.tahun_angkatan} {...a11yProps(index)} />
                ))}
              </Tabs>
              <IconButton
                disabled={totalPage === page}
                onClick={() =>
                  setPage((prev) => {
                    return prev + 1;
                  })
                }
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button color="warning" variant="contained" startIcon={<AddIcon />} onClick={handleAddTahunTagihan}>
                Tambah tahun ajaran
              </Button>
              <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSave}>
                Simpan perubahan
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItem: 'flex-start', gap: 1, mt: 1 }}>
              <InfoIcon sx={{ color: red[400] }} />
              <FormHelperText sx={{ color: red[400] }}>
                PENTING : Jika melakukan perubahan tagihan dan ingin berpindah tab tahun ajaran, simpan perubahan
                terlebih dahulu !
              </FormHelperText>
            </Box>
          </Paper>
          <Box sx={{ mt: { xs: '100px', sm: '100px', md: '100px', lg: '100px' } }}>
            <Formik
              initialValues={itemsNoPagination[value]}
              innerRef={formRef}
              enableReinitialize
              onSubmit={(values) => {
                setDialog({
                  title: 'Apakah anda yakin ingin menyimpan perubahan?',
                  labelClose: 'Batal',
                  labelSubmit: 'Simpan',
                  content:
                    'Jumlah tagihan yang dirubah, nantinya akan disinkronisasikan dengan riwayat pembayaran siswa yang mana jika ada uang sisa dari hasil perubahan ini, maka hasil sisa tersebut akan muncul ditampilan siswa.',
                  do: () => {
                    const totalAmountRaw = Object.values(values || {});
                    const totalPreviousAmountRaw = Object.values(itemsNoPagination[value] || {});
                    const keyItemChange = Object.keys(itemsNoPagination[value] || {});
                    const semiTotalAmount = [];
                    const semiTotalPreviousAmount = [];
                    const valueChanged = [];

                    for (let indexChanged = 0; indexChanged < keyItemChange.length; indexChanged += 1) {
                      if (
                        itemsNoPagination[value][keyItemChange[indexChanged]] !== values[keyItemChange[indexChanged]]
                      ) {
                        valueChanged.push({
                          name: keyItemChange[indexChanged],
                          from: itemsNoPagination[value][keyItemChange[indexChanged]],
                          to: values[keyItemChange[indexChanged]],
                          tahun_angkatan: values?.tahun_angkatan,
                        });
                      }
                    }

                    for (let index = 0; index < totalAmountRaw.length; index += 1) {
                      if (typeof totalAmountRaw[index] === 'number') {
                        semiTotalAmount.push(totalAmountRaw[index]);
                      }
                    }
                    for (let indexPrev = 0; indexPrev < totalPreviousAmountRaw.length; indexPrev += 1) {
                      if (typeof totalPreviousAmountRaw[indexPrev] === 'number') {
                        semiTotalPreviousAmount.push(totalPreviousAmountRaw[indexPrev]);
                      }
                    }
                    const finalTotalAmount = semiTotalAmount.reduce((a, b) => a + b, 0) - values?.tahun_angkatan;
                    const finalTotalPreviousAmount =
                      semiTotalPreviousAmount.reduce((a, b) => a + b, 0) - itemsNoPagination[value]?.tahun_angkatan;
                    const body = {
                      ...values,
                      extra: {
                        freq_bill: 0,
                      },
                      history: valueChanged,
                    };
                    body.extra.freq_bill = finalTotalAmount - finalTotalPreviousAmount;
                    mutation.mutate(body);
                  },
                  isCloseAfterSubmit: true,
                });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  {itemsNoPagination?.map((x, y) => (
                    // eslint-disable-next-line react/jsx-key
                    <TabPanel value={value} index={y} key={y}>
                      <Box key={y} sx={{ display: 'grid', gap: 2 }}>
                        {memoix[y]?.map((item, index) => {
                          if (item?.includes('tahun_angkatan') || item?.includes('id')) {
                            return;
                          }
                          // eslint-disable-next-line consistent-return
                          return (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <FormHelperText
                                sx={{
                                  textTransform: 'capitalize',
                                }}
                              >
                                {item[0].replace(/_/g, ' ')}
                              </FormHelperText>
                              <TextFieldNumberFormat
                                onChange={(i) => {
                                  setFieldValue(item[0], formatNumberChange(i?.target?.value));
                                }}
                                width="50%"
                                size="small"
                                placeholder="Nominal"
                                value={item[1]}
                                fullWidth
                                id={item[0]}
                                name={item[0]}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </TabPanel>
                  ))}
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      )}
    </Box>
  );
}
