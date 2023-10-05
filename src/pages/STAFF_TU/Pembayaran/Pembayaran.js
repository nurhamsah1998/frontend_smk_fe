import React, { useMemo, useState } from 'react';
import { Box, MenuItem, Select, TextField } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { debounce } from 'lodash';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { jsPDF as JSPDF } from 'jspdf';

import useFetch from '../../../hooks/useFetch';
import TableComponen from '../../../components/TableComponent';
import DetailTagihanSiswa from './Modal/DetailTagihanSiswa';
import { LabelField } from '../../../components/Commons';
import StudentDetail from './Modal/StudentDetail';
/// https://stackoverflow.com/a/45526690/18038473
import imgs from './avatar_1.jpg';

function Pembayaran() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bill, setBill] = useState('');
  const [inputView, setInputView] = useState('');
  const [kelas, setKelas] = useState('');
  const [modalDetailStudent, setModalDetailStudent] = useState({ data: {}, isOpen: false });
  const [limitView, setLimitView] = useState('40');
  const [jurusan, setJurusan] = useState('');
  const [jurusanId, setJurusanId] = React.useState('');
  const { items, totalPage, setPage, search, totalData, totalRows, setSearch, page, isLoading, setLimit, limit } =
    useFetch({
      module: `siswa`,
      params: `&current_bill=${bill}&kelas=${kelas}&jurusanId=${jurusanId}`,
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
  const handlePrintTagihan = (i) => {
    const img = new Image();
    img.src = imgs;
    const doc = new JSPDF();
    doc.text('Hello world!', 100, 100);
    doc.addImage(img, 'jpg', 0, 0);
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
  return (
    <Box>
      <StudentDetail
        openModal={modalDetailStudent.isOpen}
        itemStudent={modalDetailStudent?.data}
        setModalDetailStudent={setModalDetailStudent}
      />

      <Box sx={{ display: location.pathname?.includes('/detail-tagihan') ? 'none' : 'grid' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'grid', gap: 1 }}>
            <Box sx={{ display: 'grid' }}>
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
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
              }}
            >
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
