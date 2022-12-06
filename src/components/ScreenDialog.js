import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';

export default function ScreenDialog({
  children,
  title,
  open,
  handleClose,
  labelClose,
  labelSubmit,
  handleSubmit,
  isLoading,
  fullWidth = true,
}) {
  const navigate = useNavigate();

  const handleCloseDefault = () => {
    navigate(-1);
  };
  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        sx={{
          '& .css-4ygzoj-MuiPaper-root-MuiDialog-paper': {
            maxWidth: '777px',
          },
        }}
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        <DialogContent dividers={fullWidth}>
          <DialogContentText component={Box} sx={{ width: '100%' }}>
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton variant="contained" color="error" onClick={handleClose || handleCloseDefault}>
            {labelClose}
          </LoadingButton>
          {handleSubmit ? (
            <LoadingButton loading={isLoading} variant="contained" onClick={handleSubmit}>
              {labelSubmit}
            </LoadingButton>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
}
