import { Box, MenuItem, Select, TextField, Menu, Button } from '@mui/material';
import React from 'react';
import { debounce, range } from 'lodash';
import DatePicker from 'react-datepicker';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { jsPDF as JSPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';
import { uid } from 'uid';

import { LabelField } from '../../../components/Commons';
import TableComponen from '../../../components/TableComponent';
import useFetch from '../../../hooks/useFetch';
import { apiUrl } from '../../../hooks/api';
import { PROFILE } from '../../../hooks/useHelperContext';
import { FormatCurrency } from '../../../components/FormatCurrency';

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const KopPdf = (doc) => {
  const img = new Image();
  img.src = '/assets/logo_pgri.png';
  doc.addImage(img, 'jpg', 10, 5, 30, 30);
  /// https://stackoverflow.com/a/64022128/18038473
  doc.setFontSize(14);
  doc.setFont('', '', 700);
  doc.text('YAYASAN PEMBINA LEMBAGA PENDIDIKAN', doc.internal.pageSize.width / 1.7, 15, { align: 'center' });
  doc.text('PERSATUAN GURU REPUBLIK INDONESIA (YPLP PGRI) KEDIRI', doc.internal.pageSize.width / 1.7, 22, {
    align: 'center',
  });
  doc.text('SEKOLAH MENENGAH KEJURUAN PGRI KRAS KEDIRI', doc.internal.pageSize.width / 1.7, 29, {
    align: 'center',
  });
  doc.setFontSize(12);
  doc.setFont('', '', '', '');
  doc.text('Jalan Raya Desa Kras Kec. Kras Kab. Kediri', doc.internal.pageSize.width / 1.7, 38, {
    align: 'center',
  });
  doc.text('Telp. 0354-479487 e-mail: smk_pgri_kras007@yahoo.co.id', doc.internal.pageSize.width / 1.7, 43, {
    align: 'center',
  });
  /// https://stackoverflow.com/a/53360710/18038473
  doc.setLineWidth(1.0);
  doc.line(10, 50, 201, 50, 'FD');
  doc.setLineWidth(0);
  doc.line(10, 51, 201, 51, 'FD');
};
function ReportTransaksi() {
  const { itemsNoPagination } = React.useContext(PROFILE);
  const [limitView, setLimitView] = React.useState('40');
  const [startDate, setStartDate] = React.useState(null);
  const [kelas, setKelas] = React.useState('');
  const [subKelas, setSubKelasKelas] = React.useState('');
  const [jurusan, setJurusan] = React.useState('');
  const [jurusanFullName, setJurusanFullName] = React.useState('');
  const [typeFile, setTypeFile] = React.useState('');
  const [endDate, setEndDate] = React.useState(null);

  const years = range(2000, getYear(new Date()) + 1, 1);

  const { data } = useFetch({
    module: 'jurusan',
  });
  const { items, totalData, totalPage, totalRows, setPage, page, isLoading, setLimit, limit } = useFetch({
    module: 'get-all-invoice',
    params: `&startDate=${startDate}&endDate=${endDate}&kelas=${kelas}&jurusan=${jurusan}&sub_kelas=${subKelas}`,
  });

  const tableHead = [
    {
      id: 'nama',
      label: 'Nama siswa',
    },
    {
      id: 'kelas',
      label: 'Kelas',
    },
    {
      id: 'uang_diterima',
      label: 'Tunai',
      isCurrency: true,
    },
    {
      id: 'invoice',
      label: 'No Invoice',
    },
    {
      id: 'kode_pembayaran',
      label: 'Keterangan',
    },
  ];
  const itemsRebuild = React.useMemo(() => {
    return items?.map((i) => ({
      ...i,
      kelas: `${i?.kelas} ${i?.jurusan} ${i?.sub_kelas}`,
    }));
  }, [items]);
  const handleChangeDebounceLimit = debounce((i) => {
    setLimit(i);
  }, 500);
  const inputChangeLimit = React.useMemo(() => handleChangeDebounceLimit, []);
  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const handleCalenderClose = () => {
    console.log(new Date(startDate).toISOString(), endDate);
  };
  const handleChangesJurusan = (event, value) => {
    setPage(1);
    setJurusan(String(event.target.value));
  };
  const handleChangeSubKelas = (event) => {
    setPage(1);
    setSubKelasKelas(event.target.value);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dataFIlePDF = React.useMemo(() => {
    return items
      ?.map((item) => ({
        nama: item?.nama,
        kelas: `${item?.kelas} ${item?.jurusan} ${item?.sub_kelas}`,
        uang_diterima: FormatCurrency(item?.uang_diterima),
        invoice: item?.invoice,
        kode_pembayaran: item?.kode_pembayaran,
        createdAt: moment(item?.createdAt).format('Do MMM YYYY hh:mm a'),
      }))
      ?.map((item) => {
        return Object.values(item);
      });
  }, [items]);

  const handleDownloadFile = async (event) => {
    setAnchorEl(null);
    if (event === 'xlsx') {
      await axios
        .get(
          `${apiUrl}download/report-transaction?page=${page}&limit=${
            limit || 10
          }&startDate=${startDate}&endDate=${endDate}&kelas=${kelas}&jurusan=${jurusan}&sub_kelas=${subKelas}&type_file=${typeFile}`,
          {
            headers: {
              authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((res) => {
          /// https://stackoverflow.com/a/64545660/18038473
          window.location.href = `${apiUrl}download/report-transaction/${res?.data?.data}`;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    } else {
      const doc = new JSPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });
      autoTable(doc, {
        html: '#my-table',
        margin: { top: 70 },
      });
      KopPdf(doc);
      doc.setFontSize(14);
      doc.setFont('', '', 700);
      doc.text(`Laporan Transaksi`, 10, 60, {
        align: 'left',
      });
      doc.setFont('', '', '');
      doc.setFontSize(12);
      const isSingleFilterDate = moment(startDate).format('Do MMMM YYYY') === moment(endDate).format('Do MMMM YYYY');
      if (Boolean(endDate))
        doc.text(
          `Transaksi dari : ${
            Boolean(isSingleFilterDate)
              ? moment(startDate).format('Do MMMM YYYY')
              : `${moment(startDate).format('Do MMMM YYYY')} - ${moment(endDate).format('Do MMMM YYYY')}`
          }`,
          doc.internal.pageSize.width - 10,
          60,
          {
            align: 'right',
          }
        );
      if (Boolean(kelas) && Boolean(jurusan) && Boolean(subKelas))
        doc.text(
          `Kelas: ${kelas} ${jurusanFullName} ${subKelas}`,
          doc.internal.pageSize.width - 10,
          !Boolean(endDate) ? 60 : 65,
          {
            align: 'right',
          }
        );

      doc.setFontSize(10);
      doc.setFont('', '', '');
      doc.text(itemsNoPagination?.role?.toUpperCase(), 10, 65, {
        align: 'left',
      });
      doc.setFontSize(10);
      doc.text(`Kode download : TGH/CODE-${uid(7).toUpperCase()}/${itemsNoPagination?.nama?.toUpperCase()}`, 10, 69, {
        align: 'left',
      });
      doc.text(`Tanggal dibuat : ${moment().format('Do MMMM YYYY hh:mm a')}`, 10, 73, {
        align: 'left',
      });
      const tableHeadPdf = [...tableHead];
      tableHeadPdf.push({
        id: 'createdAt',
        label: 'Tanggal',
      });
      autoTable(doc, {
        margin: { horizontal: 10 },
        head: [tableHeadPdf?.map((item) => item?.label)],
        body: dataFIlePDF,
      });
      doc.text(`SMK PGRI KRAS`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 7, {
        align: 'center',
      });
      window.open(URL.createObjectURL(doc.output('blob')));
    }
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, gap: 1 }}>
        <Box>
          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            disabled={Boolean(itemsRebuild?.length === 0)}
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            Download File
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => handleDownloadFile('pdf')}>Download PDF</MenuItem>
            <MenuItem onClick={() => handleDownloadFile('xlsx')}>Download XLSX</MenuItem>
          </Menu>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: '4px' }}>
            <Box>
              <LabelField
                title="Sort Jurusan"
                clearIcon={Boolean(jurusan)}
                onClickClearIcon={() => {
                  setJurusan('');
                }}
              />
              <Select
                sx={{
                  minWidth: '270px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={jurusan || ''}
                size="small"
                onChange={handleChangesJurusan}
              >
                {data?.data?.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      setJurusan(item?.kode_jurusan);
                      setJurusanFullName(item?.nama);
                    }}
                    value={item?.kode_jurusan}
                  >
                    {item?.nama}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Box>
              <LabelField title="Filter tanggal" />
              <DatePicker
                selectsRange
                onCalendarClose={handleCalenderClose}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => {
                  const disabledNextBtn = getMonth(date) === 11 && getYear(date) === getYear(new Date());
                  const disabledPrevBtn = getMonth(date) === 0 && getYear(date) === 2000;
                  return (
                    <div
                      style={{
                        margin: 10,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled || disabledPrevBtn}>
                        {'<'}
                      </button>
                      <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)}>
                        {years.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <select
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                      >
                        {months.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled || disabledNextBtn}>
                        {'>'}
                      </button>
                    </div>
                  );
                }}
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                isClearable
                onChange={onChangeDate}
                customInput={
                  <TextField
                    InputProps={{
                      readOnly: true,
                    }}
                    size="small"
                  />
                }
              />
            </Box>
            <Box>
              <LabelField title="Sort Kelas" onClickClearIcon={() => setKelas('')} clearIcon={Boolean(kelas)} />
              <Select
                sx={{
                  minWidth: '100px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={kelas}
                size="small"
                onChange={(event) => {
                  setPage(1);
                  setKelas(event.target.value);
                }}
              >
                <MenuItem value={'10'}>10</MenuItem>
                <MenuItem value={'11'}>11</MenuItem>
                <MenuItem value={'12'}>12</MenuItem>
              </Select>
            </Box>
            <Box>
              <LabelField
                title="Sort Sub Kelas"
                onClickClearIcon={() => setSubKelasKelas('')}
                clearIcon={Boolean(subKelas)}
              />

              <Select
                sx={{
                  minWidth: '130px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subKelas}
                size="small"
                onChange={handleChangeSubKelas}
              >
                <MenuItem value={'1'}>1</MenuItem>
                <MenuItem value={'2'}>2</MenuItem>
                <MenuItem value={'3'}>3</MenuItem>
                <MenuItem value={'4'}>4</MenuItem>
                <MenuItem value={'5'}>5</MenuItem>
                <MenuItem value={'6'}>6</MenuItem>
              </Select>
            </Box>

            <Box>
              <LabelField
                title="/Page"
                onClickClearIcon={() => {
                  setLimit(40);
                  setLimitView('');
                }}
                clearIcon={Boolean(limit !== 40)}
              />
              <TextField
                inputProps={{
                  min: 1,
                  max: 100,
                }}
                size="small"
                type="number"
                placeholder="40"
                value={limitView || ''}
                onChange={(i) => {
                  inputChangeLimit(i.target.value);
                  setLimitView(i.target.value);
                }}
                sx={{
                  width: '100px',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <TableComponen
        colorHead="cyan"
        count={totalPage}
        pageOnchange={(x, y) => {
          setPage(y);
        }}
        page={page}
        tableBody={itemsRebuild}
        tableHead={tableHead}
        emptyTag="( sepertinya belum ada transaksi )"
        totalRows={Boolean(endDate) || Boolean(kelas) || Boolean(subKelas) || Boolean(jurusan) ? totalRows : null}
        totalData={totalData}
        isLoading={isLoading}
      />
    </Box>
  );
}

export default ReportTransaksi;
