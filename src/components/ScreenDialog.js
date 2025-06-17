/* eslint-disable import/no-unresolved */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DangerousIcon from '@mui/icons-material/Dangerous';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { blue, green, grey, orange, red } from '@mui/material/colors';
import { themeAppColors } from 'src/theme/themeAppColor';

function ScreenDialog({
  children,
  title,
  open,
  handleClose,
  labelClose,
  labelSubmit,
  handleSubmit,
  isLoading,
  fullWidth = true,
  variant = '',
  type = 'modal',
  disabledSubmitButton,
  labelTopBtn,
  handleTopBtn,
  helperText,
}) {
  const navigate = useNavigate();
  const variantColor = {
    error: {
      color: red[500],
      icon: <DangerousIcon sx={{ height: 40, width: 40 }} />,
    },
    success: {
      color: green[500],
      icon: <CheckCircleIcon sx={{ height: 40, width: 40 }} />,
    },
    info: {
      color: blue[500],
      icon: <InfoIcon sx={{ height: 40, width: 40 }} />,
    },
    warning: {
      color: orange[500],
      icon: <ReportProblemIcon sx={{ height: 40, width: 40 }} />,
    },
  };
  const handleCloseDefault = () => {
    navigate(-1);
  };
  const isModal = type === 'modal';
  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        sx={{
          '& .css-4ygzoj-MuiPaper-root-MuiDialog-paper': {
            maxWidth: '777px',
            overflowY: 'unset !important',
          },
          '& .css-1yenlpl': {
            overflowY: 'unset !important',
          },
        }}
        open={open}
        scroll="paper"
      >
        <Box
          sx={
            isModal && !helperText
              ? {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  position: 'relative',
                }
              : {}
          }
        >
          <DialogTitle
            sx={{
              bgcolor: variantColor[variant]?.color ?? '#fff',
              color: variant ? '#fff' : grey[800],
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: variantColor[variant]?.color ? 1 : 2,
            }}
            id="scroll-dialog-title"
          >
            {isModal && variantColor[variant]?.icon}

            <Typography
              sx={{ fontWeight: 600, fontSize: { xs: '1px', sm: '15px', md: '17px', lg: '19px', xl: '19px' } }}
            >
              {title}
            </Typography>
          </DialogTitle>
          {helperText && (
            <DialogContent sx={{ mt: 1, px: 2 }}>
              <Typography
                sx={{
                  color: grey[600],
                }}
              >
                {helperText}
              </Typography>
            </DialogContent>
          )}

          {labelTopBtn && (
            <Button
              onClick={handleTopBtn}
              sx={{ mr: 1, position: 'absolute', right: 0, boxShadow: 'none' }}
              variant="contained"
              color="secondary"
            >
              {labelTopBtn}
            </Button>
          )}
        </Box>
        {children && (
          <DialogContent dividers={fullWidth}>
            <DialogContentText component={Box} sx={{ width: '100%' }}>
              {children}
            </DialogContentText>
          </DialogContent>
        )}

        <DialogActions
          sx={{
            px: 2,
            py: 1,
          }}
        >
          <LoadingButton variant="outlined" color="error" onClick={handleClose || handleCloseDefault}>
            {labelClose}
          </LoadingButton>
          {labelSubmit ? (
            <LoadingButton
              color={variant || 'primary'}
              sx={{
                color: '#fff',
                bgcolor: variantColor[variant]?.color ?? themeAppColors.main,
              }}
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

export default React.memo(ScreenDialog);
