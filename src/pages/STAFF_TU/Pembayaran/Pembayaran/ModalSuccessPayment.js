import React from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';

import ScreenDialog from '../../../../components/ScreenDialog';
import { FormatCurrency } from '../../../../components/FormatCurrency';

export const PrintTemplateInvoice = ({ data, printRef, width = '100%' }) => {
  return (
    <div>
      <style>{`
@media screen {
	.print {
		display: none;
	}
}
      `}</style>
      <div
        className="print"
        style={{
          padding: '10px',
          width,
        }}
        ref={printRef}
      >
        <p style={{ textAlign: 'center', fontSize: '24px', fontWeight: 700, margin: 0 }}>INVOICE PEMBAYARAN</p>
        <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: 500, margin: 0 }}>SMK PGRI KRAS</p>
        <p
          style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 500,
            margin: 0,
            marginTop: '-5px',
            marginBottom: '20px',
            borderBottom: 'dashed 4px #ccc',
            paddingBottom: '20px',
          }}
        >
          Jl. Raya Desa Kras Kec.Kras Kab.Kediri
        </p>
        <div style={{ display: 'flex', gap: '5px' }}>
          <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, width: '95px' }}>Nama</p>
          <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, textTransform: 'capitalize' }}>
            : {data?.nama}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, width: '95px' }}>Kelas</p>
          <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0 }}>: {data?.kelas}</p>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, width: '95px' }}>No. INVOICE</p>
          <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0 }}>: {data?.invoice}</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, width: '95px', fontWeight: 700 }}>
            DETAIL PEMBAYARAN :{' '}
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '5px',
            }}
          >
            <p style={{ whiteSpace: 'nowrap', margin: 0, fontSize: '14px' }}>{data?.kode_pembayaran}</p>
            <div style={{ borderBottom: 'dotted 2px #ccc', width: '100%' }} />
            <p style={{ whiteSpace: 'nowrap', margin: 0, fontFamily: 'monospace' }}>
              {FormatCurrency(data?.uang_diterima)}
            </p>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, width: '95px', fontWeight: 700 }}>NOTE : </p>
          <div>
            <p style={{ margin: 0, fontSize: '14px', maxWidth: '400px' }}>{data?.note}</p>
          </div>
        </div>
        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div>
            <p style={{ margin: 0 }}>Kediri, {moment(data?.createdAt).format('DD MMM YYYY')}</p>
            <p style={{ margin: 0, marginTop: '30px', textAlign: 'center' }}>{data?.petugas}</p>
            <p style={{ margin: 0, marginTop: '-5px', textAlign: 'center' }}>(Petugas TU)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
function ModalSuccessPayment({ open, handleClose, data }) {
  const printRef = React.useRef();
  const print = useReactToPrint({
    content: () => printRef.current,
  });
  const HandlePrint = () => {
    print();
  };
  return (
    <ScreenDialog
      labelClose="Tutup"
      type="success"
      title="Pembayaran berhasil"
      open={Boolean(open)}
      handleClose={handleClose}
    >
      <p style={{ textAlign: 'center', fontSize: '24px', fontWeight: 700, margin: 0 }}>INVOICE PEMBAYARAN</p>
      <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: 500, margin: 0 }}>SMK PGRI KRAS</p>
      <p
        style={{
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 500,
          margin: 0,
          marginTop: '-5px',
          marginBottom: '20px',
          borderBottom: 'dashed 4px #ccc',
          paddingBottom: '20px',
        }}
      >
        Jl. Raya Desa Kras Kec.Kras Kab.Kediri
      </p>
      <div style={{ display: 'flex', gap: '5px' }}>
        <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, width: '95px' }}>Nama</p>
        <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, textTransform: 'capitalize' }}>: {data?.nama}</p>
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, width: '95px' }}>Kelas</p>
        <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0 }}>: {data?.kelas}</p>
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, width: '95px' }}>No. INVOICE</p>
        <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0 }}>: {data?.invoice}</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, width: '95px', fontWeight: 700 }}>
          DETAIL PEMBAYARAN :{' '}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '5px',
          }}
        >
          <p style={{ whiteSpace: 'nowrap', margin: 0, fontSize: '14px' }}>{data?.kode_pembayaran}</p>
          <div style={{ borderBottom: 'dotted 2px #ccc', width: '100%' }} />
          <p style={{ whiteSpace: 'nowrap', margin: 0, fontFamily: 'monospace' }}>
            {FormatCurrency(data?.uang_diterima)}
          </p>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <p style={{ whiteSpace: 'nowrap', fontSize: '14px', margin: 0, width: '95px', fontWeight: 700 }}>NOTE : </p>
        <div>
          <p style={{ margin: 0, fontSize: '14px', maxWidth: '400px' }}>{data?.note}</p>
        </div>
      </div>
      <div
        style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
        }}
      >
        <Button variant="contained" color="warning">
          Download PDF
        </Button>
        <Button onClick={HandlePrint} variant="outlined" color="success">
          Print Invoice
        </Button>
      </div>
      <PrintTemplateInvoice width="40%" data={data} printRef={printRef} />
    </ScreenDialog>
  );
}

export default ModalSuccessPayment;
