import React from 'react';
import { Box, Button, Typography, Tab, Tabs, TextField, FormHelperText } from '@mui/material';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';

import useFetch from '../../../hooks/useFetch';
import useMutationPatch from '../../../hooks/useMutationPatch';
import { Dialog } from '../../../hooks/useContextHook';
import formatNumberChange from '../../../components/formatNumberChange';
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
  const { itemsNoPagination, isLoading } = useFetch({
    module: 'tagihan-permanent',
  });
  const mutation = useMutationPatch({
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
  return (
    <Box>
      {isLoading ? (
        <Box>
          <Typography textAlign="center">Memuat</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
          </Box>
          <Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleSave}>
                Simpan perubahan
              </Button>
            </Box>
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
