import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import React from 'react';
import { Box, Stack, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { grey } from '@mui/material/colors';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import { themeAppColors } from '../../../theme/themeAppColor';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 60;

const HEADER_DESKTOP = 60;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav, navConfigMenu }) {
  const location = useLocation();
  const currentPage = React.useMemo(
    () => navConfigMenu?.find((item) => item?.path === location?.pathname),
    [location?.pathname]
  );
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <Box sx={{ position: 'absolute', left: { xs: 70, sm: 70, md: 290, lg: 10 } }}>
            <Typography sx={{ color: themeAppColors.dark }} variant="h4">
              {currentPage?.title || 'Detail Pembayaran'}
            </Typography>
          </Box>
          {/* <LanguagePopover />
          <NotificationsPopover /> */}
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
