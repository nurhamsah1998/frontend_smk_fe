/* eslint-disable consistent-return */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable arrow-body-style */
import React, { useMemo, useRef, useState } from 'react';
import { Box, Button, FormHelperText, Menu, MenuItem, Select, TextField } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { jsPDF as JSPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import moment from 'moment';
import { purple } from '@mui/material/colors';
import DownloadIcon from '@mui/icons-material/Download';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import TableComponen from '../../../components/TableComponent';
import { LabelField } from '../../../components/Commons';

/// https://stackoverflow.com/a/45526690/18038473
import { apiUrl } from '../../../hooks/api';
import { FormatCurrency } from '../../../components/FormatCurrency';
import ScreenDialog from '../../../components/ScreenDialog';
import { KopPdf } from '../Laporan/transaksi_masuk/ReportTransaksi';
import CustomDatePicker from '../../../components/CustomDatePicker';
import AutoCompleteAsync from '../../../components/Core/AutoCompleteAsync';
import { PROFILE } from '../../../hooks/useHelperContext';
import useQueryFetch from '../../../hooks/useQueryFetch';
import ContainerCard from '../../../components/ContainerCard';

export const ClearFilter = ({ handleClear }) => {
  return (
    <Box>
      <Button onClick={handleClear} fullWidth sx={{ minWidth: '100px', minHeight: '40px' }} size="small">
        Clear filter
      </Button>
    </Box>
  );
};
function Pembayaran() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const [bill, setBill] = useState('');
  const searchInputRef = useRef();
  const limitInputRef = useRef();
  const [kelas, setKelas] = useState('');
  const [angkatan, setAngkatan] = React.useState('');
  const [subKelas, setSubKelasKelas] = React.useState('');
  const [limitView, setLimitView] = useState('40');
  const [jurusan, setJurusan] = useState('');
  const [jurusanId, setJurusanId] = React.useState('');
  const [startUjian, setStartUjian] = React.useState('');
  const [expiredDate, setExpiredDate] = React.useState('');
  const { itemsNoPagination } = React.useContext(PROFILE);
  const permissions = Boolean(itemsNoPagination?.id)
    ? typeof itemsNoPagination?.permissions === 'string'
      ? JSON.parse(itemsNoPagination?.permissions)
      : itemsNoPagination?.permissions
    : [];
  const disabledPrintBill = !Boolean(permissions?.find((item) => item === 'student_bill_letter'));
  const { items, totalPage, setPage, search, totalData, totalRows, setSearch, page, isLoading, setLimit, limit } =
    useQueryFetch({
      module: 'siswa',
      invalidateKey: 'siswa',
      query: {
        current_bill: bill,
        type: 'pembayaran',
        jurusanId,
        kelas,
        sub_kelas: subKelas,
        angkatan: angkatan?.tahun_angkatan,
      },
    });
  const { data } = useQueryFetch({
    module: 'jurusan',
    invalidateKey: 'jurusan',
  });
  const billStatus = [
    {
      name: 'deposit',
      title: 'DEPOSIT',
    },
    {
      name: 'not_paid_yet',
      title: 'BELUM ADA TAGIHAN',
    },
    {
      name: 'paid',
      title: 'LUNAS',
    },
    {
      name: 'not_paid',
      title: 'BELUM LUNAS',
    },
  ];
  const jurusanList = useMemo(() => data?.data, [data?.data]);
  const itemsRebuild = useMemo(() => {
    return items?.map((i) => ({
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
  }, [items]);
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
        kelas_student: `${item?.kelas} ${item?.['jurusan.kode_jurusan']} ${item?.sub_kelas}`,
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
  }, [items, jurusan, kelas, subKelas, bill, search, limitInputRef.current?.value, jurusanId, angkatan]);
  const nomorRef = useRef({ value: '' });
  const pdfSuratTagihan = (doc, data) => {
    const stampel = new Image();
    stampel.src = '/assets/stampel.png';

    autoTable(doc, {
      html: '#my-table',
      margin: { top: 70 },
    });
    KopPdf(doc);
    doc.text(`No    : ${nomorRef.current.value}`, 10, 59, {
      align: 'left',
    });
    doc.text(`Hal   : PEMBERITAHUAN`, 10, 65, {
      align: 'left',
    });
    /// KEPADA YTH
    doc.text(`Kepada :`, 10, 75, {
      align: 'left',
    });
    doc.text(`Yth. Bapak / Ibu Wali Murid ${data?.nama?.toUpperCase()}`, 10, 81, {
      align: 'left',
    });
    doc.text(`Kelas ${data?.kelas} ${data['jurusan.kode_jurusan']} ${data?.sub_kelas}`, 10, 87, {
      align: 'left',
    });
    doc.text('Di tempat', 10, 93, {
      align: 'left',
    });
    doc.setFont('', '', 700);
    doc.text('Assalamualaikum Wr. Wb', 10, 113, {
      align: 'left',
    });
    doc.setFont('', '', '');
    doc.text(
      `Diberitahukan dengan hormat bahwa ujian sekolah akan dilaksanakan mulai ${moment(startUjian).format(
        'Do MMMM YYYY'
      )}. Sehubungan `,
      10,
      122,
      {
        align: 'left',
      }
    );
    doc.text(
      `dengan ini maka kami mohon dengan hormat agar Bapak / Ibu / Wali murid segera melunasi tanggungan`,
      10,
      128,
      {
        align: 'left',
      }
    );
    /// https://stackoverflow.com/a/25675981/18038473
    const widthTextOne = doc.getTextWidth('pembayaran Sekolah puta putri bapak ibu yang bernama ');
    doc.text(`pembayaran Sekolah puta putri bapak ibu yang bernama `, 10, 134, {
      align: 'left',
    });
    doc.setFont('', '', 700);
    const lineTextWidth = doc.getTextWidth(data?.nama?.toUpperCase());
    doc.line(widthTextOne + 10, 135, widthTextOne + lineTextWidth + 10, 135);

    doc.text(`${data?.nama?.toUpperCase()}`, widthTextOne + 10, 134, {
      align: 'left',
    });
    doc.setFont('', '', '');
    doc.text(`Paling akhir tanggal ${moment(expiredDate).format('Do MMMM YYYY')} kepada petugas di Sekolah.`, 10, 140, {
      align: 'left',
    });
    const lengthTextBeforeAmount = doc.getTextWidth('Adapun tanggungan yang harus dilunasi adalah sebesar ');
    doc.text(`Adapun tanggungan yang harus dilunasi adalah sebesar`, 10, 146, {
      align: 'left',
    });
    doc.setFont('', '', 700);
    doc.text(`${FormatCurrency(data?.current_bill || 0)}`, lengthTextBeforeAmount + 10, 146, {
      align: 'left',
    });
    doc.setFont('', '', '');
    doc.text(`Demikian atas kerja samanya di ucapkan terima kasih.`, 10, 166, {
      align: 'left',
    });
    doc.text(`Semoga rahmad dan pertolongan Allah selalu dilimpahkan pada kita bersama.`, 10, 172, {
      align: 'left',
    });
    doc.setFont('', '', 700);
    doc.text(`Wassalamu'alaikum Wr. Wb.`, 10, 181, {
      align: 'left',
    });
    doc.setFont('', '', '');
    doc.addImage(stampel, 'jpg', doc.internal.pageSize.width - 135 / 2, doc.internal.pageSize.height / 2 + 69, 38, 38);
    doc.text(
      `Kras, ${moment().format('Do MMMM YYYY')}`,
      doc.internal.pageSize.width - 90 / 2,
      doc.internal.pageSize.height / 3 + 130,
      {
        align: 'center',
      }
    );
    doc.text(`Kepala SMK PGRI Kras`, doc.internal.pageSize.width - 90 / 2, doc.internal.pageSize.height / 3 + 135, {
      align: 'center',
    });
    doc.setFont('', '', 700);
    doc.text(`SUWARNI,S.Pd i`, doc.internal.pageSize.width - 90 / 2, doc.internal.pageSize.height / 3 + 155, {
      align: 'center',
    });
    doc.setFont('', '', '');
    doc.setFontSize(9);
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
      `Jika dirasa ada yang tidak sesuai berkaitan dengan nominal tagihan dll, bisa menghubungi ke petugas.`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 16,
      {
        align: 'center',
      }
    );
    doc.text(`Terimakasih`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 12, {
      align: 'center',
    });
  };
  const handlePrintTagihan = (i) => {
    if (disabledPrintBill)
      return enqueueSnackbar('Akses Ditolak, Anda tidak memiliki akses!', {
        variant: 'error',
      });
    const doc = new JSPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'legal',
    });
    pdfSuratTagihan(doc, i);
    window.open(URL.createObjectURL(doc.output('blob')));
  };
  const handleChangeStatusTagihan = (i) => {
    setPage(1);
    setBill(i.target.value);
  };
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
          `${apiUrl}download/report-bill?page=${page}&limit=${limit}&search=${search}&current_bill=${bill}&kelas=${kelas}&jurusanId=${jurusanId}&sub_kelas=${subKelas}&angkatan=${
            Boolean(angkatan?.tahun_angkatan === 'undefined' || angkatan === '') ? '' : angkatan?.tahun_angkatan
          }`,
          {
            responseType: 'blob',
            headers: {
              authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((res) => {
          const isUserHasFilter = Boolean(kelas) || Boolean(jurusan) || Boolean(subKelas);
          const specifictFilter = `${isUserHasFilter ? '(' : ''}${Boolean(kelas) ? `Kelas ${kelas}` : ''}${
            Boolean(jurusan) ? ` ${data?.data?.find((item) => item?.nama === jurusan)?.kode_jurusan}` : ''
          }${Boolean(subKelas) ? ` ${subKelas}` : ''}${isUserHasFilter ? ')' : ''}`;
          /// https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
          const url = URL.createObjectURL(new Blob([res?.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `Laporan Tagihan ${specifictFilter} ${moment().format('Do-MMMM-YYYY')}.xlsx`);
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
        format: 'legal',
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
      doc.setFontSize(10);
      doc.setFont('', '', '');
      doc.text(
        `Kelas : ${
          Boolean(kelas) && Boolean(jurusan) && Boolean(subKelas)
            ? `${kelas} ${data?.data?.find((item) => item?.nama === jurusan)?.kode_jurusan} ${subKelas} ${
                Boolean(angkatan) ? `/ ${angkatan?.tahun_angkatan}` : ''
              }`
            : '-'
        }`,
        10,
        65,
        {
          align: 'left',
        }
      );
      doc.setFontSize(10);
      doc.text(
        `Status pembayaran : ${Boolean(bill) ? billStatus?.find((item) => item.name === bill)?.title : '-'}`,
        10,
        69,
        {
          align: 'left',
        }
      );
      doc.text(`Tanggal dibuat : ${moment().format('Do MMM YYYY H:mm')}`, 10, 73, {
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
  const handleChangeAngkatan = (x, event) => {
    setPage(1);
    setAngkatan({ tahun_angkatan: String(event?.tahun_angkatan) });
  };
  const handlePrintMassalTagihan = () => {
    if (disabledPrintBill)
      return enqueueSnackbar('Akses Ditolak, Anda tidak memiliki akses!', {
        variant: 'error',
      });
    const doc = new JSPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'legal',
    });
    for (let index = 0; index < items.length; index += 1) {
      pdfSuratTagihan(doc, items[index]);
      if (index < items?.length - 1) {
        doc.addPage();
      }
    }
    window.open(URL.createObjectURL(doc.output('blob')));
  };
  const handlePrint = (i) => {
    if (disabledPrintBill)
      return enqueueSnackbar('Akses Ditolak, Anda tidak memiliki akses!', {
        variant: 'error',
      });
    setOpenModalInputDate(() => ({ isBulk: false, openModal: true, data: i }));
  };
  return (
    <ContainerCard>
      <Box>
        <Helmet>
          <title>Detail Pembayaran | SMK Kras Kediri</title>
          <link rel="canonical" href="/" />
        </Helmet>
        <ScreenDialog
          disabledSubmitButton={!Boolean(startUjian) || !Boolean(expiredDate)}
          title="Masukkan tanggal hari ujian, jatuh tempo dan nomor"
          labelClose="Batal"
          labelSubmit="Generate"
          open={openModalInputDate.openModal}
          handleClose={() => {
            setOpenModalInputDate((prev) => ({ ...prev, openModal: false }));
            setExpiredDate('');
            setStartUjian('');
            nomorRef.current.value = '';
          }}
          handleSubmit={
            openModalInputDate.isBulk ? handlePrintMassalTagihan : () => handlePrintTagihan(openModalInputDate.data)
          }
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormHelperText>Masukan nomor, contoh : 247//104.E8/SMK-PGRI/Krs/IX/2023</FormHelperText>
              <TextField
                ref={nomorRef}
                onChange={(i) => {
                  nomorRef.current.value = i.target.value;
                }}
                sx={{
                  mt: '-15px',
                }}
                size="small"
              />
              <Box>
                <FormHelperText>Masukan tanggal ujian</FormHelperText>
                <CustomDatePicker disabledMultipick startDate={startUjian} setStartDate={setStartUjian} />
              </Box>
              <Box>
                <FormHelperText>Masukan tanggal jatuh tempo pembayaran</FormHelperText>
                <CustomDatePicker disabledMultipick startDate={expiredDate} setStartDate={setExpiredDate} />
              </Box>
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
                Boolean(itemsRebuild?.length !== 0) &&
                !disabledPrintBill && (
                  <Button
                    onClick={() => setOpenModalInputDate(() => ({ isBulk: true, openModal: true }))}
                    color="warning"
                    variant="contained"
                  >
                    Print Tagihan Massal
                  </Button>
                )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <Box sx={{ display: 'grid', width: '100%' }}>
                    <LabelField
                      clearIcon={Boolean(search)}
                      onClickClearIcon={() => {
                        setPage(1);
                        setSearch('');
                        searchInputRef.current.value = '';
                      }}
                      title="Masukan nama siswa / Kode siswa / Username / Nama ayah / Nama ibu"
                    />
                    <TextField
                      inputRef={searchInputRef}
                      fullWidth
                      onChange={debounce((i) => {
                        setPage(1);
                        setSearch(i.target.value);
                      }, 500)}
                      size="small"
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
                  {[
                    Boolean(jurusan),
                    Boolean(kelas),
                    Boolean(subKelas),
                    Boolean(bill),
                    Boolean(search),
                    Boolean(angkatan),
                  ].filter((item) => item)?.length > 2 ? (
                    <ClearFilter
                      handleClear={() => {
                        setJurusanId('');
                        setJurusan('');
                        setSearch('');
                        searchInputRef.current.value = '';
                        setKelas('');
                        setSubKelasKelas('');
                        setBill('');
                        setAngkatan('');
                      }}
                    />
                  ) : null}
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
                      {jurusanList?.map((item, index) => (
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
                  <Box sx={{ minWidth: '100px' }}>
                    <LabelField
                      title="Sort Angkatan"
                      clearIcon={Boolean(angkatan)}
                      onClickClearIcon={() => setAngkatan('')}
                    />
                    <AutoCompleteAsync
                      size="small"
                      keyAttribute="tahun_angkatan"
                      paginateData
                      initialLimit={3}
                      value={angkatan || {}}
                      module="tahun-angkatan"
                      type="number"
                      onChange={(x, y) => handleChangeAngkatan(x, y)}
                    />
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
                      InputProps={{
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
              handlePrint={disabledPrintBill ? null : handlePrint}
              tooltipHandlePrint="Print Surat Tagihan"
              emptyTag="( sepertinya tidak ada siswa )"
              tableBody={itemsRebuild}
              tableHead={tableHead}
              totalRows={
                Boolean(jurusanId) || Boolean(kelas) || Boolean(search) || Boolean(subKelas) || Boolean(bill)
                  ? totalRows
                  : null
              }
              totalData={totalData}
              isLoading={isLoading}
            />
          </Box>
        </Box>
        <Outlet />
      </Box>
    </ContainerCard>
  );
}

export default Pembayaran;
