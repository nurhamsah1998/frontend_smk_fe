import React from 'react';
import ScreenDialog from '../../../components/ScreenDialog';

function Create({ openModalCreate, setOpenModalCreate }) {
  return (
    <div>
      <ScreenDialog
        labelClose="Batal"
        handleClose={() => setOpenModalCreate(false)}
        handleSubmit={() => console.log('hai')}
        labelSubmit="Tambah"
        title="Tambah Siswa Secara Masal"
        open={openModalCreate}
      >
        asdasdasd
      </ScreenDialog>
    </div>
  );
}

export default Create;
