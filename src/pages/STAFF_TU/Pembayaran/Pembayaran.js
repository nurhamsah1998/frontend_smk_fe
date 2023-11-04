import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { Helmet } from 'react-helmet-async';

import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import { LabelField } from '../../../components/Commons';

/// https://stackoverflow.com/a/45526690/18038473
import { apiUrl } from '../../../hooks/api';
import { FormatCurrency } from '../../../components/FormatCurrency';
import { PROFILE } from '../../../hooks/useHelperContext';
import ScreenDialog from '../../../components/ScreenDialog';
import { KopPdf } from '../../Laporan/transaksi/ReportTransaksi';
import CustomDatePicker from '../../../components/CustomDatePicker';
import AutoCompleteAsync from '../../../components/Core/AutoCompleteAsync';

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
  const { itemsNoPagination } = React.useContext(PROFILE);
  const navigate = useNavigate();
  const location = useLocation();
  const [bill, setBill] = useState('');
  const [inputView, setInputView] = useState('');
  const [kelas, setKelas] = useState('');
  const [angkatan, setAngkatan] = React.useState('');
  const [subKelas, setSubKelasKelas] = React.useState('');
  const [limitView, setLimitView] = useState('40');
  const [jurusan, setJurusan] = useState('');
  const [jurusanId, setJurusanId] = React.useState('');
  const [startUjian, setStartUjian] = React.useState('');
  const [expiredDate, setExpiredDate] = React.useState('');
  const { items, totalPage, setPage, search, totalData, totalRows, setSearch, page, isLoading, setLimit, limit } =
    useFetch({
      module: `siswa`,
      params: `&current_bill=${bill}&angkatan=${
        Boolean(angkatan?.tahun_angkatan === 'undefined' || angkatan === '') ? '' : angkatan?.tahun_angkatan
      }&kelas=${kelas}&jurusanId=${jurusanId}&sub_kelas=${subKelas}`,
    });
  const { data } = useFetch({
    module: 'jurusan',
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
  const nomorRef = useRef({ value: '' });
  const pdfSuratTagihan = (doc, data) => {
    const img = new Image();
    img.src = '/assets/logo_pgri.png';
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

  return (
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
            {Boolean(bill === 'not_paid') && Boolean(jurusan) && Boolean(kelas) && Boolean(itemsRebuild?.length !== 0) && (
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
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
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
                      setInputView('');
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
                    initialLimit={5}
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
  );
}

export default Pembayaran;
