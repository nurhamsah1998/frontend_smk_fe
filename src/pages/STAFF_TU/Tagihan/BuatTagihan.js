import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { Box } from '@mui/material';

import ScreenDialog from '../../../components/ScreenDialog';
import FormTagihan from './FormTagihan';

export const initialValues = {
  name: '',
  jurusanId: '',
  description: '',
  total: '',
  kelas: '',
  angkatan: '',
  periode: [],
};

function BuatTagihan() {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = React.useRef();

  const handleSubmit = () => {
    formRef.current?.handleSubmit();
  };
  return (
    <ScreenDialog
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
          console.log(values);
        }}
      >
        {(props) => <FormTagihan {...props} />}
      </Formik>
    </ScreenDialog>
  );
}

export default BuatTagihan;
