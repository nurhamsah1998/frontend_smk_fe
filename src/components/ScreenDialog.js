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
import { green, red } from '@mui/material/colors';

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
  type = '',
  disabledSubmitButton,
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
        scroll="paper"
      >
        <DialogTitle
          sx={{
            bgcolor: type?.includes('error') ? red[500] : type?.includes('success') ? green[500] : '#fff',
            color: Boolean(type) ? '#fff' : '#000',
          }}
          id="scroll-dialog-title"
        >
          {title}
        </DialogTitle>
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
            <LoadingButton
              disabled={disabledSubmitButton}
              loading={isLoading}
              variant="contained"
              onClick={handleSubmit}
            >
              {labelSubmit}
            </LoadingButton>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
}
