import React, { useMemo, useState } from 'react';
import { Box, Button, FormHelperText, Menu, MenuItem, Select, TextField } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { debounce } from 'lodash';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { jsPDF as JSPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import moment from 'moment';
import { uid } from 'uid';
import DatePicker from 'react-datepicker';
import { purple } from '@mui/material/colors';
import 'react-datepicker/dist/react-datepicker.css';
import DownloadIcon from '@mui/icons-material/Download';

import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import DetailTagihanSiswa from './Modal/DetailTagihanSiswa';
import { LabelField } from '../../../components/Commons';

/// https://stackoverflow.com/a/45526690/18038473
import { apiUrl } from '../../../hooks/api';
import { FormatCurrency } from '../../../components/FormatCurrency';
import { PROFILE } from '../../../hooks/useHelperContext';
import ScreenDialog from '../../../components/ScreenDialog';
import { KopPdf } from '../../Laporan/transaksi/ReportTransaksi';

function Pembayaran() {
  const { itemsNoPagination } = React.useContext(PROFILE);
  const navigate = useNavigate();
  const location = useLocation();
  const [bill, setBill] = useState('');
  const [inputView, setInputView] = useState('');
  const [kelas, setKelas] = useState('');
  const [subKelas, setSubKelasKelas] = React.useState('');
  const [limitView, setLimitView] = useState('40');
  const [jurusan, setJurusan] = useState('');
  const [jurusanId, setJurusanId] = React.useState('');
  const [startUjian, setStartUjian] = React.useState('');
  const [expiredDate, setExpiredDate] = React.useState('');
  const { items, totalPage, setPage, search, totalData, totalRows, setSearch, page, isLoading, setLimit, limit } =
    useFetch({
      module: `siswa`,
      params: `&current_bill=${bill}&kelas=${kelas}&jurusanId=${jurusanId}&sub_kelas=${subKelas}`,
    });
  const { data } = useFetch({
    module: 'jurusan',
  });
  const itemsRebuild = items?.map((i) => ({
    ...i,
    jurusan: i?.jurusan?.nama,
    kelas_student: `${i?.kelas} ${i?.['jurusan.kode_jurusan']} ${i?.sub_kelas}`,
    status_bill:
      i?.current_bill < 0
        ? 'deposit'
        : i?.current_bill > 0
        ? 'not_paid'
        : i?.status_bill?.includes('not_paid_yet')
        ? 'not_paid_yet'
        : 'paid',
  }));
  const handleSeeBill = (item) => {
    navigate(`detail-tagihan?student-id=${item?.id}`);
  };
  const handleChangesJurusan = (event, value) => {
    setPage(1);
    setJurusan(String(event.target.value));
  };
  const tableHead = [
    {
      id: 'nama',
      label: 'Nama siswa',
    },
    {
      id: 'gender',
      label: 'Gender',
    },
    {
      id: 'kelas_student',
      label: 'Kelas',
    },
    {
      id: 'angkatan',
      label: 'Angkatan',
    },
    {
      id: 'status_bill',
      label: 'Status',
      variantStatusColor: [
        {
          variant: 'success',
          label: 'Lunas',
          value: 'paid',
        },
        {
          variant: 'error',
          label: 'Belum Lunas',
          value: 'not_paid',
        },
        {
          variant: 'grey',
          label: 'Belum Ada Tagihan',
          value: 'not_paid_yet',
        },
        {
          variant: 'warning',
          label: 'Deposit',
          value: 'deposit',
        },
      ],
    },
    {
      id: 'current_bill',
      label: 'Kekurangan',
      isCurrency: true,
    },
  ];
  const handleChangeSubKelas = (event) => {
    setPage(1);
    setSubKelasKelas(event.target.value);
  };
  const dataFIlePDF = React.useMemo(() => {
    return items
      ?.map((item) => ({
        nama: item?.nama,
        gender: item?.gender,
        kelas: `${item?.kelas} ${item?.['jurusan.kode_jurusan']} ${item?.sub_kelas}`,
        angkatan: item?.angkatan,
        status_bill:
          item?.current_bill < 0
            ? 'DEPOSIT'
            : item?.current_bill > 0
            ? 'BELUM LUNAS'
            : item?.status_bill?.includes('BELUM ADA TAGIHAN')
            ? 'BELUM ADA TAGIHAN'
            : 'LUNAS',
        /// https://stackoverflow.com/a/4652112/18038473
        current_bill:
          item?.current_bill < 0
            ? `+ ${FormatCurrency(Math.abs(item?.current_bill))}`
            : FormatCurrency(item?.current_bill),
      }))
      ?.map((item) => {
        return Object.values(item);
      });
  }, [items]);
  const pdfSuratTagihan = (doc, data) => {
    const img = new Image();
    img.src = '/assets/logo_pgri.png';
    autoTable(doc, {
      html: '#my-table',
      margin: { top: 70 },
    });
    KopPdf(doc);
    doc.text(`Kepada : `, doc.internal.pageSize.width - 90, 59, {
      align: 'left',
    });
    doc.setFont('', '', 700);
    doc.text(data?.nama?.toUpperCase(), doc.internal.pageSize.width / 1.31, 69 + 2, {
      align: 'center',
    });
    doc.setFont('', '', '', '');
    doc.setFontSize(10);
    doc.text(
      `${data?.kelas} / ${data?.['jurusan.nama']} / ${data?.sub_kelas}`,
      doc.internal.pageSize.width / 1.31,
      73 + 2,
      {
        align: 'center',
      }
    );
    doc.setFont('', '', 700);
    doc.text(`${data?.kode_siswa}`, doc.internal.pageSize.width / 1.31, 77 + 2, {
      align: 'center',
    });

    doc.roundedRect(doc.internal.pageSize.width - 90, 62, 80, 25, 5, 5);
    doc.setFontSize(15);

    doc.text(`SURAT PENAGIHAN`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 3 + 10, {
      align: 'center',
    });
    doc.setFontSize(8);
    doc.setFont('', '', '', '');
    doc.text(
      `TAHUN PELAJARAN ${moment().add(-1, 'year').format('YYYY')} / ${moment().format('YYYY')}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height / 3 + 14,
      {
        align: 'center',
      }
    );
    doc.setFontSize(12);
    doc.text(`YTH. Orang tua/wali,`, 10, doc.internal.pageSize.height / 3 + 34, {
      align: 'left',
    });
    doc.text(
      `Berkaitan dengan akan datangnya hari ujian sekolah, kami selaku staff pihak sekolahan memberitahukan bahwa `,
      10,
      doc.internal.pageSize.height / 3 + 45,
      {
        align: 'left',
      }
    );
    doc.text(
      `semua tagihan  siswa yang belum lunas harus  segera dilunasi sebelum memasuki hari ujian sekolah yang akan`,
      10,
      doc.internal.pageSize.height / 3 + 50,
      {
        align: 'left',
      }
    );
    doc.text(
      `diselenggarakan pada tanggal ${moment(startUjian).format('Do MMMM YYYY')}.`,
      10,
      doc.internal.pageSize.height / 3 + 55,
      {
        align: 'left',
      }
    );
    doc.text(
      `Berikut total tagihan ananda ${data?.nama} tahun ajaran ${moment()
        .add(-1, 'year')
        .format('YYYY')} / ${moment().format('YYYY')}`,
      10,
      doc.internal.pageSize.height / 3 + 60,
      {
        align: 'left',
      }
    );
    const lenghtAmountText = `sebesar : `;
    doc.text(lenghtAmountText, 10, doc.internal.pageSize.height / 3 + 65, {
      align: 'left',
    });
    doc.setFont('', '', 700);
    doc.text(
      `${FormatCurrency(data?.current_bill || 0)}`,
      10 + lenghtAmountText?.length + 6,
      doc.internal.pageSize.height / 3 + 65,
      {
        align: 'left',
      }
    );
    doc.setFont('', '', '');
    doc.text(
      `Surat tagihan ini kami maksutkan agar orang tua/wali siswa bisa melunasi tagihan sebelum datangnya hari ujian.`,
      10,
      doc.internal.pageSize.height / 3 + 75,
      {
        align: 'left',
      }
    );
    doc.text(
      `Siswa harus melakukan pembayaran sebelum  jatuh tempo pada tanggal ${moment(expiredDate).format(
        'Do MMMM YYYY'
      )}.`,
      10,
      doc.internal.pageSize.height / 3 + 80,
      {
        align: 'left',
      }
    );
    doc.text(
      `kecuali jika dirasa tagihan ini memberatkan,  orang tua/wali siswa bisa datang langsung ke sekolah untuk`,
      10,
      doc.internal.pageSize.height / 3 + 90,
      {
        align: 'left',
      }
    );
    doc.text(
      `mediasi batas waktu pembayaran yang ditentukan. Sekian surat tagihan ini kami buat, jika dirasa ada yang salah`,
      10,
      doc.internal.pageSize.height / 3 + 95,
      {
        align: 'left',
      }
    );
    doc.text(
      `dalam penulisan surat tagihan ini kami meminta maaf sebesar-besarnya.`,
      10,
      doc.internal.pageSize.height / 3 + 100,
      {
        align: 'left',
      }
    );
    doc.text(
      `Kediri, ${moment().format('Do MMMM YYYY')}`,
      doc.internal.pageSize.width - 90 / 2,
      doc.internal.pageSize.height / 3 + 130,
      {
        align: 'center',
      }
    );
    doc.text(
      `${itemsNoPagination?.nama} (Petugas TU)`,
      doc.internal.pageSize.width - 90 / 2,
      doc.internal.pageSize.height / 3 + 150,
      {
        align: 'center',
      }
    );
    doc.setFont('', 'italic');
    doc.text(
      `Surat tagihan ini dicetak secara otomatis menggunakan sistem aplikasi sekolah.`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 20,
      {
        align: 'center',
      }
    );
    doc.text(
      `Jika dirasa ada yang tidak sesuai berkaitan dengan nominal tagihan dll, bisa lapor ke petugas.`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 15,
      {
        align: 'center',
      }
    );
    doc.text(`Terimakasih`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
      align: 'center',
    });
  };
  const handlePrintTagihan = (i) => {
    const doc = new JSPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });
    pdfSuratTagihan(doc, i);
    window.open(URL.createObjectURL(doc.output('blob')));
  };
  const handleChangeStatusTagihan = (i) => {
    setPage(1);
    setBill(i.target.value);
  };

  const handleChangeDebounce = debounce((i) => {
    setSearch(i);
  }, 500);
  const handleChangeDebounceLimit = debounce((i) => {
    setLimit(i);
  }, 500);
  const inputChange = useMemo(() => handleChangeDebounce, []);
  const inputChangeLimit = useMemo(() => handleChangeDebounceLimit, []);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModalInputDate, setOpenModalInputDate] = React.useState({ isBulk: false, openModal: false, data });
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDownloadFile = async (event) => {
    setAnchorEl(null);
    if (event === 'xlsx') {
      await axios
        .get(
          `${apiUrl}download/report-bill?page=${page}&limit=${limit}&search=${search}&current_bill=${bill}&kelas=${kelas}&jurusanId=${jurusanId}`,
          {
            responseType: 'blob',
            headers: {
              authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((res) => {
          /// https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
          const url = URL.createObjectURL(new Blob([res?.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `tagihan-${moment().format('MMMM-Do-YYYY-h-mm-ss')}.xlsx`);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    } else {
      const img = new Image();
      img.src = '/assets/logo_pgri.png';
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
      doc.text(`Laporan Tagihan`, 10, 60, {
        align: 'left',
      });
      doc.setFont('', '', '');
      doc.setFontSize(12);
      if (Boolean(kelas) && Boolean(jurusan) && Boolean(subKelas))
        doc.text(`Kelas: ${kelas} ${jurusan} ${subKelas}`, doc.internal.pageSize.width - 10, 60, {
          align: 'right',
        });
      doc.setFontSize(10);
      doc.setFont('', '', '');
      doc.text(itemsNoPagination?.role?.toUpperCase(), 10, 65, {
        align: 'left',
      });
      doc.setFontSize(10);
      doc.text(`Kode download : TGH/CODE-${uid(7).toUpperCase()}/${itemsNoPagination?.nama?.toUpperCase()}`, 10, 69, {
        align: 'left',
      });
      doc.text(`Tanggal dibuat : ${moment().format('Do MMM YYYY hh:mm a')}`, 10, 73, {
        align: 'left',
      });
      autoTable(doc, {
        margin: { horizontal: 10 },
        head: [tableHead?.map((item) => item?.label)],
        body: dataFIlePDF,
      });
      doc.text(`SMK PGRI KRAS`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 7, {
        align: 'center',
      });
      window.open(URL.createObjectURL(doc.output('blob')));
    }
  };
  const handlePrintMassalTagihan = () => {
    const doc = new JSPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });
    for (let index = 0; index < items.length; index += 1) {
      pdfSuratTagihan(doc, items[index]);
      if (index < items?.length - 1) {
        doc.addPage();
      }
    }
    window.open(URL.createObjectURL(doc.output('blob')));
  };
  return (
    <Box>
      <ScreenDialog
        title="Masukkan tanggal hari ujian dan jatuh tempo"
        labelClose="Batal"
        labelSubmit="Generate"
        open={openModalInputDate.openModal}
        handleClose={() => {
          setOpenModalInputDate((prev) => ({ ...prev, openModal: false }));
          setExpiredDate('');
          setStartUjian('');
        }}
        handleSubmit={
          openModalInputDate.isBulk ? handlePrintMassalTagihan : () => handlePrintTagihan(openModalInputDate.data)
        }
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box>
            <FormHelperText>Masukan tanggal ujian</FormHelperText>
            <DatePicker
              customInput={
                <TextField
                  size="small"
                  sx={{
                    mt: 1,
                    mb: 3,
                  }}
                />
              }
              selected={startUjian}
              onChange={(date) => setStartUjian(date)}
            />

            <FormHelperText>Masukan tanggal jatuh tempo pembayaran</FormHelperText>
            <DatePicker
              customInput={
                <TextField
                  size="small"
                  sx={{
                    mt: 1,
                    mb: 3,
                  }}
                />
              }
              selected={expiredDate}
              onChange={(date) => setExpiredDate(date)}
            />
          </Box>
        </Box>
      </ScreenDialog>
      <Box sx={{ display: location.pathname?.includes('/detail-tagihan') ? 'none' : 'grid' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
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
            {Boolean(bill === 'not_paid') &&
              Boolean(jurusan) &&
              Boolean(kelas) &&
              Boolean(subKelas) &&
              Boolean(itemsRebuild?.length !== 0) && (
                <Button
                  onClick={() => setOpenModalInputDate((prev) => ({ isBulk: true, openModal: true }))}
                  color="warning"
                  variant="contained"
                >
                  Print Tagihan Massal
                </Button>
              )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ display: 'grid', width: '100%' }}>
                  <LabelField
                    clearIcon={Boolean(search)}
                    onClickClearIcon={() => {
                      setSearch('');
                      setInputView('');
                    }}
                    title="Masukan nama siswa / kode siswa"
                  />
                  <TextField
                    value={inputView}
                    onChange={(i) => {
                      inputChange(i.target.value);
                      setInputView(i.target.value);
                    }}
                    size="small"
                    fullWidth
                  />
                </Box>
                <Box>
                  <LabelField
                    clearIcon={Boolean(bill)}
                    onClickClearIcon={() => {
                      setBill('');
                    }}
                    title="Sort Status Pembayaran"
                  />
                  <Select
                    sx={{
                      minWidth: '200px',
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={bill || ''}
                    size="small"
                    onChange={handleChangeStatusTagihan}
                  >
                    <MenuItem value={'paid'}>Lunas</MenuItem>
                    <MenuItem value={'not_paid'}>Belum Lunas</MenuItem>
                    <MenuItem value={'deposit'}>Deposit</MenuItem>
                    <MenuItem value={'not_paid_yet'}>Belum Ada Tagihan</MenuItem>
                  </Select>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Box>
                  <LabelField
                    title="Sort Jurusan"
                    clearIcon={Boolean(jurusan)}
                    onClickClearIcon={() => {
                      setJurusanId('');
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
                      <MenuItem key={index} onClick={() => setJurusanId(item?.id)} value={item?.nama}>
                        {item?.nama}
                      </MenuItem>
                    ))}
                  </Select>
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
                    onChange={(event) => setKelas(event.target.value)}
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
                      minWidth: '100px',
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
        </Box>
        <Box>
          <TableComponen
            hideOption
            customIconSecondary={<LocalPrintshopIcon sx={{ color: purple[500] }} />}
            colorHead="cyan"
            count={totalPage}
            pageOnchange={(x, y) => {
              setPage(y);
            }}
            page={page}
            handleSeeBill={handleSeeBill}
            handlePrint={(i) => setOpenModalInputDate((prev) => ({ isBulk: false, openModal: true, data: i }))}
            tooltipHandlePrint="Print Surat Tagihan"
            emptyTag="( sepertinya tidak ada siswa )"
            tableBody={itemsRebuild}
            tableHead={tableHead}
            totalRows={Boolean(jurusanId) || Boolean(kelas) || Boolean(search) || Boolean(bill) ? totalRows : null}
            totalData={totalData}
            isLoading={isLoading}
          />
        </Box>
      </Box>
      <DetailTagihanSiswa />
      <Outlet />
    </Box>
  );
}

export default Pembayaran;
