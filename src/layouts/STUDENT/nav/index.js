import PropTypes from 'prop-types';
import { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
  Toolbar,
  LinearProgress,
  ListItemText,
} from '@mui/material';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import { PROFILE } from '../../../hooks/useHelperContext';
import NavSection from '../../../components/nav-section';
import ScreenDialog from '../../../components/ScreenDialog';
//
import navConfig from './config';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { items, isLoading } = useContext(PROFILE);
  const isDesktop = useResponsive('up', 'md');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Toolbar />
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary', textTransform: 'capitalize' }}>
                {isLoading ? <LinearProgress /> : items?.nama}
              </Typography>
              {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isLoading ? <LinearProgress /> : `${items?.username}`}
              </Typography> */}
              <Stack>
                <Button onClick={() => navigate(`?profile-id=${items.id}`)} variant="contained" size="small">
                  lihat profil
                </Button>
              </Stack>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        width: { md: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
      <ScreenDialog
        isLoading={isLoading}
        open={search?.includes('?profile-id=')}
        title="Buat tagihan baru"
        handleClose={() => navigate(-1)}
        labelClose="tutup"
        labelSubmit="buat"
      >
        <ListItemText primary="Nama" secondary={items?.nama} />
        <ListItemText primary="Jurusan" secondary={items?.jurusan?.nama} />
        <ListItemText primary="Kelas" secondary={items?.kelas} />
        <ListItemText primary="Angkatan" secondary={items?.angkatan} />
      </ScreenDialog>
    </Box>
  );
}
