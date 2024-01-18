import { useState, useContext } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Typography, MenuItem, Avatar, IconButton, Popover, LinearProgress } from '@mui/material';
import { PROFILE } from '../../../hooks/useHelperContext';
import { Dialog } from '../../../hooks/useContextHook';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const { setDialog } = useContext(Dialog);
  const navigate = useNavigate();
  const { itemsNoPagination, isLoading } = useContext(PROFILE);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleLogOut = () => {
    setDialog({
      title: 'Apakah anda yakin ingin keluar?',
      labelClose: 'Batal',
      labelSubmit: 'Keluar',
      fullWidth: false,
      do: () => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('current_page_tagihan');
        window.localStorage.removeItem('current_tab_tagihan');
        navigate('/');
      },
      isCloseAfterSubmit: true,
    });
  };
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={''} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <LinearProgress /> : itemsNoPagination?.nama}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <MenuItem onClick={handleLogOut} sx={{ m: 1 }}>
          Keluar
        </MenuItem>
      </Popover>
    </>
  );
}
