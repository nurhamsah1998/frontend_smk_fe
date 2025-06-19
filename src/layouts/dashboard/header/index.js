import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import React from 'react';
import { Box, Stack, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
// utils
// components
import Iconify from '../../../components/iconify';
//
import AccountPopover from './AccountPopover';
import { themeAppColors } from '../../../theme/themeAppColor';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 60;

const HEADER_DESKTOP = 60;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
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
  const currentPage = React.useMemo(() => {
    const isUpdateNewsPage = location?.pathname?.includes('/dev/news/update-news/');
    const isDetailNewsPage = location?.pathname?.includes('/news/detail/');
    try {
      const isMatch = navConfigMenu.find((item) => item.path === location.pathname);
      return isMatch.title;
    } catch (error) {
      return isUpdateNewsPage ? 'Edit Kabar Berita' : isDetailNewsPage ? 'Konten Berita' : 'Detail Pembayaran';
    }
  }, [location?.pathname]);
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
          <Box sx={{ position: 'absolute', left: { xs: 70, sm: 70, md: 290, lg: 20 } }}>
            <Typography sx={{ color: themeAppColors.dark }} variant="h6">
              {currentPage}
            </Typography>
          </Box>
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
