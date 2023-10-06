import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Box, FormHelperText } from '@mui/material';

export const ButtonClear = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      size="small"
      sx={{
        width: '25px',
        height: '25px',
      }}
      aria-label="closeicon"
      color="error"
    >
      <CloseIcon
        sx={{
          width: '20px',
          height: '20px',
        }}
      />
    </IconButton>
  );
};

export const LabelField = ({ title, onClickClearIcon, clearIcon }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        mb: 0.5,
      }}
    >
      <FormHelperText>{title}</FormHelperText>
      {clearIcon && <ButtonClear onClick={onClickClearIcon} />}
    </Box>
  );
};
