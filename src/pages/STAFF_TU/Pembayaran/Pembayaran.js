import React, { useMemo, useState } from 'react';
import { Box, Button, Menu, MenuItem, Select, TextField } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { debounce } from 'lodash';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { jsPDF as JSPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import moment from 'moment';
import { uid } from 'uid';

import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import DetailTagihanSiswa from './Modal/DetailTagihanSiswa';
import { LabelField } from '../../../components/Commons';
import StudentDetail from './Modal/StudentDetail';
/// https://stackoverflow.com/a/45526690/18038473
import { apiUrl } from '../../../hooks/api';
import { FormatCurrency } from '../../../components/FormatCurrency';
import { PROFILE } from '../../../hooks/useHelperContext';

function Pembayaran() {
  const { itemsNoPagination } = React.useContext(PROFILE);
  const navigate = useNavigate();
  const location = useLocation();
  const [bill, setBill] = useState('');
  const [inputView, setInputView] = useState('');
  const [kelas, setKelas] = useState('');
  const [subKelas, setSubKelasKelas] = React.useState('');
  const [modalDetailStudent, setModalDetailStudent] = useState({ data: {}, isOpen: false });
  const [limitView, setLimitView] = useState('40');
  const [jurusan, setJurusan] = useState('');
  const [jurusanId, setJurusanId] = React.useState('');
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
  const handleCustomOnClickRow = (i) => {
    setModalDetailStudent({ isOpen: true, data: i });
  };
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
  const pdfSuratTagihan = (doc) => {
    const img = new Image();
    img.src = '/assets/logo_pgri.png';
    autoTable(doc, {
      html: '#my-table',
      margin: { top: 70 },
    });
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
    // doc.addPage();
  };
  const handlePrintTagihan = (i) => {
    const doc = new JSPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });
    pdfSuratTagihan(doc);
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
  return (
    <Box>
      <StudentDetail
        openModal={modalDetailStudent.isOpen}
        itemStudent={modalDetailStudent?.data}
        setModalDetailStudent={setModalDetailStudent}
      />

      <Box sx={{ display: location.pathname?.includes('/detail-tagihan') ? 'none' : 'grid' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
          <Box>
            <Box>
              <Button
                variant="contained"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
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
            customIcon={<AccountBoxIcon />}
            customIconSecondary={<LocalPrintshopIcon />}
            colorHead="blue"
            count={totalPage}
            pageOnchange={(x, y) => {
              setPage(y);
            }}
            page={page}
            handleSeeBill={handleSeeBill}
            handleCustomOnClickRow={handleCustomOnClickRow}
            handlePrint={handlePrintTagihan}
            tooltipHandlePrint="Print Surat Tagihan"
            tooltipCustom="Detail Siswa"
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
