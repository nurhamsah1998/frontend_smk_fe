import { Box, MenuItem, Select, TextField, Menu, Button } from '@mui/material';
import React, { useRef } from 'react';
import { debounce } from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { jsPDF as JSPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';

import { LabelField } from '../../../components/Commons';
import TableComponen from '../../../components/TableComponent';
import { apiUrl } from '../../../hooks/api';
import { FormatCurrency } from '../../../components/FormatCurrency';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { ClearFilter } from '../../STAFF_TU/Pembayaran/Pembayaran';
import useQueryFetch from '../../../hooks/useQueryFetch';

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
  const [startDate, setStartDate] = React.useState(null);
  const [kelas, setKelas] = React.useState('');
  const [filterTanggal, setFilterTanggal] = React.useState('day');
  const [filteraTanggalOption, setFilteraTanggalOption] = React.useState({
    start: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  });
  const [subKelas, setSubKelasKelas] = React.useState('');
  const [jurusan, setJurusan] = React.useState('');
  const limitInputRef = useRef();
  const [typeFile, setTypeFile] = React.useState('');
  const [endDate, setEndDate] = React.useState(null);
  const { data } = useQueryFetch({
    module: 'jurusan',
    invalidateKey: 'jurusan',
  });
  const { items, totalData, totalPage, totalRows, setPage, page, isLoading, setLimit, limit } = useQueryFetch({
    module: 'get-all-invoice',
    invalidateKey: 'get-all-invoice',
    query: {
      startDate: startDate || filteraTanggalOption.start,
      endDate: endDate || filteraTanggalOption.end,
      kelas,
      jurusan,
      sub_kelas: subKelas,
    },
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
    {
      id: 'createdAt',
      label: 'Tanggal',
    },
  ];
  const itemsRebuild = React.useMemo(() => {
    return items?.map((i) => ({
      ...i,
      kelas: `${i?.kelas} ${i?.jurusan} ${i?.sub_kelas}`,
      createdAt: moment(i?.createdAt).format('Do MMM YYYY H:mm'),
    }));
  }, [items]);
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
        createdAt: moment(item?.createdAt).format('Do MMM YYYY H:mm'),
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
          `${apiUrl}download/report-transaction?page=${page}&limit=${limit || 10}&startDate=${
            startDate || filteraTanggalOption.start
          }&endDate=${
            endDate || filteraTanggalOption.end
          }&kelas=${kelas}&jurusan=${jurusan}&sub_kelas=${subKelas}&type_file=${typeFile}`,
          {
            responseType: 'blob',
            headers: {
              authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((res) => {
          const isUserHasFilter = Boolean(kelas) || Boolean(jurusan) || Boolean(subKelas);
          const specifictFilter = ` ${isUserHasFilter ? '(' : ''} ${Boolean(kelas) ? `Kelas ${kelas}` : ''} ${
            Boolean(jurusan) ? `Jurusan ${jurusan}` : ''
          } ${Boolean(subKelas) ? `${subKelas}` : ''} ${isUserHasFilter ? ')' : ''}`;
          /// https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
          const url = URL.createObjectURL(new Blob([res?.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `Laporan Transaksi${specifictFilter} ${moment().format('Do-MMMM-YYYY')}.xlsx`);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    } else {
      const doc = new JSPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'legal',
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
      doc.setFontSize(10);
      doc.setFont('', '', '');
      if (Boolean(filteraTanggalOption.start)) {
        doc.text(
          `Tanggal : ${
            filterTanggal === 'day'
              ? moment(filteraTanggalOption.start).format('DD MMMM YYYY')
              : filterTanggal === ''
              ? '-'
              : `${moment(filteraTanggalOption.start).format('DD MMMM YYYY')} - ${moment(
                  filteraTanggalOption.end
                ).format('DD MMMM YYYY')}`
          }`,
          10,
          65,
          {
            align: 'left',
          }
        );
      }
      if (Boolean(startDate)) {
        doc.text(
          `Tanggal : ${moment(startDate).format('DD MMMM YYYY')} - ${moment(endDate).format('DD MMMM YYYY')}`,
          10,
          65,
          {
            align: 'left',
          }
        );
      }
      if (!Boolean(startDate) && !Boolean(filteraTanggalOption.start)) {
        doc.text(`Tanggal : -`, 10, 65, {
          align: 'left',
        });
      }

      doc.setFontSize(10);
      doc.text(
        `Kelas : ${Boolean(kelas) && Boolean(jurusan) && Boolean(subKelas) ? `${kelas} ${jurusan} ${subKelas}` : '-'}`,
        10,
        69,
        {
          align: 'left',
        }
      );
      /// https://stackoverflow.com/a/12970385/18038473
      doc.text(`Tanggal dibuat : ${moment().format('Do MMMM YYYY H:mm')}`, 10, 73, {
        align: 'left',
      });
      const tableHeadPdf = [...tableHead];
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 1, mb: '4px' }}>
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
                      // setJurusanFullName(item?.nama);
                    }}
                    value={item?.kode_jurusan}
                  >
                    {item?.nama}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <LabelField
                title="Filter tanggal"
                onClickClearIcon={() => {
                  setFilterTanggal('');
                  setFilteraTanggalOption({ start: null, end: null });
                }}
                clearIcon={Boolean(filterTanggal)}
              />
              <Select
                sx={{
                  minWidth: '140px',
                }}
                disabled={Boolean(startDate)}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterTanggal}
                size="small"
                onChange={(event) => {
                  const type = event.target.value;
                  const date = new Date();
                  setPage(1);
                  if (type === 'day') {
                    /// https://stackoverflow.com/a/12970385/18038473
                    setFilteraTanggalOption({
                      start: moment(date).startOf('day').format('YYYY-MM-DD H:mm:ss'),
                      end: moment(date).endOf('day').format('YYYY-MM-DD H:mm:ss'),
                    });
                  }
                  if (type === 'week') {
                    /// https://stackoverflow.com/a/12970385/18038473
                    setFilteraTanggalOption({
                      start: moment(date).startOf('week').format('YYYY-MM-DD H:mm:ss'),
                      end: moment(date).endOf('week').format('YYYY-MM-DD H:mm:ss'),
                    });
                  }
                  if (type === 'month') {
                    /// https://stackoverflow.com/a/12970385/18038473
                    setFilteraTanggalOption({
                      start: moment(date).startOf('month').format('YYYY-MM-DD H:mm:ss'),
                      end: moment(date).endOf('month').format('YYYY-MM-DD H:mm:ss'),
                    });
                  }
                  if (type === 'year') {
                    /// https://stackoverflow.com/a/12970385/18038473
                    setFilteraTanggalOption({
                      start: moment(date).startOf('year').format('YYYY-MM-DD H:mm:ss'),
                      end: moment(date).endOf('year').format('YYYY-MM-DD H:mm:ss'),
                    });
                  }
                  setFilterTanggal(event.target.value);
                }}
              >
                <MenuItem value={`day`}>Hari ini</MenuItem>
                <MenuItem value={'week'}>Minggu ini</MenuItem>
                <MenuItem value={'month'}>Bulan ini</MenuItem>
                <MenuItem value={'year'}>Tahun ini</MenuItem>
              </Select>
            </Box>
            {[Boolean(jurusan), Boolean(kelas), Boolean(subKelas), Boolean(filterTanggal), Boolean(startDate)].filter(
              (item) => item
            )?.length > 2 ? (
              <ClearFilter
                handleClear={() => {
                  setJurusan('');
                  setKelas('');
                  setSubKelasKelas('');
                  setFilterTanggal('');
                  setFilteraTanggalOption({ start: null, end: null });
                  setEndDate(null);
                  setStartDate(null);
                }}
              />
            ) : null}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Box>
              <LabelField title="Custom filter tanggal" />
              <CustomDatePicker
                disabled={Boolean(filteraTanggalOption.start)}
                setEndDate={setEndDate}
                endDate={endDate}
                setStartDate={setStartDate}
                startDate={startDate}
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
                  setPage(1);
                  setLimit(40);
                  limitInputRef.current.value = '';
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
                inputRef={limitInputRef}
                onChange={debounce((i) => {
                  setPage(1);
                  setLimit(i.target.value);
                }, 500)}
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
        emptyTag="( sepertinya belum ada transaksi di hari ini )"
        totalRows={Boolean(endDate) || Boolean(kelas) || Boolean(subKelas) || Boolean(jurusan) ? totalRows : null}
        totalData={totalData}
        isLoading={isLoading}
      />
    </Box>
  );
}

export default ReportTransaksi;
