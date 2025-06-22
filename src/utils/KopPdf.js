export default function KopPdf(doc) {
  const img = new Image();
  img.src = '/assets/logo_pgri.png';
  doc.addImage(img, 'jpg', 10, 10, 35, 30);
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
}
