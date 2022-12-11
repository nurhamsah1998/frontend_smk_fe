import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { Box } from '@mui/material';

import ScreenDialog from '../../../components/ScreenDialog';
import useMutationPost from '../../../hooks/useMutationPost';
import FormTagihan from './FormTagihan';

export const initialValues = {
  nama: '',
  jurusanId: '',
  categori: '',
  deskripsi: '',
  total: '',
  kelas: '',
  angkatan: '',
  periode: [],
};
function BuatTagihan() {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = React.useRef();
  const { mutationPost, isLoading } = useMutationPost({
    module: 'tagihan',
    next: () => navigate(-1),
  });

  const handleSubmit = () => {
    formRef.current?.handleSubmit();
  };
  return (
    <ScreenDialog
      isLoading={isLoading}
      open={location.search?.includes('?create-new-bill')}
      title="Buat tagihan baru"
      handleClose={() => navigate(-1)}
      labelClose="tutup"
      labelSubmit="buat"
      handleSubmit={handleSubmit}
    >
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        onSubmit={(values) => {
          const spp = values?.periode?.map((i) => ({
            ...i,
            kode_bulan: `${i.bulan?.slice(0, 3)?.toUpperCase()}${values?.kelas}${values?.jurusanId?.nama}${
              values?.angkatan
            }`,
          }));
          const ifNotSpp = !values?.categori?.includes('spp') ? false : spp;
          const data = {
            ...values,
            periode: ifNotSpp,
            jurusanId: values?.jurusanId?.id || '',
            total: Boolean(values?.periode?.length <= 0)
              ? values?.total
              : values?.periode.map((i) => parseFloat(i.total)).reduce((a, b) => a + b),
          };
          mutationPost.mutate(data);
        }}
        enableReinitialize
      >
        {(props) => <FormTagihan {...props} />}
      </Formik>
    </ScreenDialog>
  );
}

export default BuatTagihan;
