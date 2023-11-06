import React from 'react';
import { Button } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import 'moment/locale/id';
import { jsPDF as JSPDF } from 'jspdf';

import ScreenDialog from '../../../../components/ScreenDialog';
import { FormatCurrency } from '../../../../components/FormatCurrency';
import { KopPdf } from '../../../Laporan/transaksi/ReportTransaksi';

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
          padding: '10px 55px 10px 55px',
          width,
        }}
        ref={printRef}
      >
        <p style={{ textAlign: 'center', fontSize: '14px', marginBottom: '-20px', fontWeight: 500, margin: 0 }}>
          SMK PGRI KRAS
        </p>
        <p
          style={{
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 500,
            margin: 0,
          }}
        >
          Jl. Raya Desa Kras Kec.Kras Kab.Kediri
        </p>
        <p
          style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 700,
            margin: 0,
            marginTop: '-5px',
            borderBottom: 'dashed 4px #ccc',
            marginBottom: '10px',
            paddingBottom: '10px',
          }}
        >
          BUKTI PEMBAYARAN
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0, width: '75px' }}>Nama</p>
              <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0, textTransform: 'capitalize' }}>
                : {data?.nama}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0, width: '75px' }}>Kelas</p>
              <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0 }}>
                : {data?.kelas} {data?.jurusan} {data?.sub_kelas}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0, width: '75px' }}>Waktu</p>
              <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0 }}>
                : {moment(data?.createdAt).format('DD MMMM YYYY H:mm')}
              </p>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0, width: '75px' }}>Kode siswa</p>
              <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0 }}>: {data?.kode_tagihan}</p>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0, width: '75px' }}>No. INVOICE</p>
              <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0 }}>: {data?.invoice}</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0, width: '75px', fontWeight: 700 }}>
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
            <p style={{ whiteSpace: 'nowrap', margin: 0, fontSize: '12px' }}>{data?.kode_pembayaran}</p>
            <div style={{ borderBottom: 'dotted 2px #ccc', width: '100%' }} />
            <p style={{ whiteSpace: 'nowrap', margin: 0, fontFamily: 'monospace' }}>
              {FormatCurrency(data?.uang_diterima)}
            </p>
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <p style={{ whiteSpace: 'nowrap', fontSize: '12px', margin: 0, width: '95px', fontWeight: 700 }}>
            Catatan :{' '}
          </p>
          <div>
            <p style={{ margin: 0, fontSize: '12px' }}>{data?.note}</p>
          </div>
        </div>
        <div
          style={{
            marginTop: '15px',
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: '20px',
          }}
        >
          <div>
            <p style={{ margin: 0, textAlign: 'center', fontSize: '12px' }}>Kasir</p>
            <p style={{ margin: 0, marginTop: '15px', textAlign: 'center', fontSize: '12px' }}>{data?.petugas}</p>
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

  const handleDownloadPdf = () => {
    const doc = new JSPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'legal',
    });
    KopPdf(doc);
    const globalPosition = 10;
    doc.setFontSize(14);
    doc.setFont('', '', 700);
    doc.text(`Nota Pembayaran`, 10, 69 - globalPosition, {
      align: 'left',
    });
    doc.setFontSize(12);
    doc.setFont('', '', '');
    doc.text(`Note : ${data?.note || '-'}`, 10, 74 - globalPosition, {
      align: 'left',
    });
    doc.setFont('', '', '');
    ///
    doc.text(`Nama : ${data?.nama?.toUpperCase()}`, 10, 84 - globalPosition, {
      align: 'left',
    });
    doc.text(
      `Kelas :${data?.kelas} ${data?.jurusan} ${data?.sub_kelas}/${data?.tahun_angkatan}`,
      10,
      89 - globalPosition,
      {
        align: 'left',
      }
    );
    doc.text(`No. Invoice : ${data?.invoice}`, 10, 94 - globalPosition, {
      align: 'left',
    });
    /// right section
    doc.text(`Pembayaran : ${data?.kode_pembayaran}`, doc.internal.pageSize.width - 10, 84 - globalPosition, {
      align: 'right',
    });
    doc.text(
      `Nominal : ${FormatCurrency(data?.uang_diterima)}`,
      doc.internal.pageSize.width - 10,
      89 - globalPosition,
      {
        align: 'right',
      }
    );
    doc.text(
      `Tanggal dibuat : ${moment(data?.createdAt).format('Do MMMM YYYY')}`,
      doc.internal.pageSize.width - 10,
      94 - globalPosition,
      {
        align: 'right',
      }
    );
    doc.text(
      `Kediri, ${moment().format('Do MMMM YYYY')}`,
      doc.internal.pageSize.width - 90 / 2,
      doc.internal.pageSize.height - 310 + 130,
      {
        align: 'center',
      }
    );
    doc.text(
      `${data?.petugas} (Petugas TU)`,
      doc.internal.pageSize.width - 90 / 2,
      doc.internal.pageSize.height - 310 + 150,
      {
        align: 'center',
      }
    );
    doc.save(
      `invoice_pembayaran_siswa_${data?.nama}-${data?.kelas}-${data?.jurusan}-${data?.sub_kelas}-${data?.tahun_angkatan}.pdf`
    );
  };
  const HandlePrint = () => {
    print();
    handleDownloadPdf();
  };
  return (
    <ScreenDialog
      disabledSubmitButton
      labelClose="Tutup"
      type="success"
      title="Pembayaran berhasil"
      open={Boolean(open)}
      handleClose={handleClose}
    >
      <div>
        <p style={{ textAlign: 'center', fontSize: '17px', marginBottom: '-20px', fontWeight: 500, margin: 0 }}>
          SMK PGRI KRAS
        </p>
        <p
          style={{
            textAlign: 'center',
            fontSize: '17px',
            fontWeight: 500,
            margin: 0,
          }}
        >
          Jl. Raya Desa Kras Kec.Kras Kab.Kediri
        </p>
        <p
          style={{
            textAlign: 'center',
            fontSize: '19px',
            fontWeight: 700,
            margin: 0,
            marginTop: '-5px',
            borderBottom: 'dashed 4px #ccc',
            marginBottom: '10px',
            paddingBottom: '10px',
          }}
        >
          BUKTI PEMBAYARAN
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0, width: '75px' }}>Nama</p>
              <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0, textTransform: 'capitalize' }}>
                : {data?.nama}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0, width: '75px' }}>Kelas</p>
              <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0 }}>
                : {data?.kelas} {data?.jurusan} {data?.sub_kelas}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0, width: '75px' }}>Waktu</p>
              <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0 }}>
                : {moment(data?.createdAt).format('DD MMMM YYYY H:mm')}
              </p>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0, width: '75px' }}>Kode siswa</p>
              <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0 }}>: {data?.kode_tagihan}</p>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0, width: '75px' }}>No. INVOICE</p>
              <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0 }}>: {data?.invoice}</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0, width: '75px', fontWeight: 700 }}>
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
            <p style={{ whiteSpace: 'nowrap', margin: 0, fontSize: '15px' }}>{data?.kode_pembayaran}</p>
            <div style={{ borderBottom: 'dotted 2px #ccc', width: '100%' }} />
            <p style={{ whiteSpace: 'nowrap', margin: 0, fontFamily: 'monospace' }}>
              {FormatCurrency(data?.uang_diterima)}
            </p>
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <p style={{ whiteSpace: 'nowrap', fontSize: '15px', margin: 0, width: '95px', fontWeight: 700 }}>
            Catatan :{' '}
          </p>
          <div>
            <p style={{ margin: 0, fontSize: '15px' }}>{data?.note}</p>
          </div>
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
        <Button onClick={HandlePrint} variant="outlined" color="success">
          Print Invoice
        </Button>
      </div>
      <PrintTemplateInvoice data={data} printRef={printRef} />
    </ScreenDialog>
  );
}

export default ModalSuccessPayment;
