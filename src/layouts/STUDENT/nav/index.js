/* eslint-disable import/no-unresolved */
/* eslint-disable eqeqeq */
import PropTypes from 'prop-types';
import { useEffect, useContext, useState } from 'react';
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
  LinearProgress,
  ListItemText,
  TextField,
} from '@mui/material';
// hooks
import { useQueryClient } from '@tanstack/react-query';
import { LogoApp } from 'src/layouts/dashboard/nav';
import useResponsive from '../../../hooks/useResponsive';
// components
import Scrollbar from '../../../components/scrollbar';
import { PROFILE } from '../../../hooks/useHelperContext';
import NavSection from '../../../components/nav-section';
import ScreenDialog from '../../../components/ScreenDialog';
//
import navConfig from './config';
import useMutationPatch from '../../../hooks/useMutationPatch';
import { getInitialName, randomColorInitialName } from '../../../utils/getInitialName';

// ----------------------------------------------------------------------

const NAV_WIDTH = 281;

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
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const client = useQueryClient();
  const { itemsNoPagination, isLoading } = useContext(PROFILE);
  const isDesktop = useResponsive('up', 'md');
  const mutation = useMutationPatch({
    module: 'siswa',
    next: () => {
      client.invalidateQueries(['siswa-profile']);
      setEdit(false);
    },
  });
  const handleSave = () => {
    mutation.mutate({ id: itemsNoPagination?.id, noHP: value });
  };
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
        bgcolor: '#fff',
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <LogoApp />
      <Box sx={{ mb: 1, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar
              src={''}
              sx={{
                border: () => `solid 2px #fff`,
                bgcolor: randomColorInitialName(itemsNoPagination?.nama),
                textTransform: 'capitalize',
              }}
              alt="photoURL"
            >
              {getInitialName(itemsNoPagination?.nama)}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary', textTransform: 'capitalize' }}>
                {isLoading ? <LinearProgress /> : itemsNoPagination?.nama}
              </Typography>
              {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isLoading ? <LinearProgress /> : `${itemsNoPagination?.username}`}
              </Typography> */}
              <Stack>
                <Button
                  onClick={() => navigate(`?profile-id=${itemsNoPagination.id}`)}
                  variant="contained"
                  size="small"
                >
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
              borderRight: 'none',
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
            sx: { width: NAV_WIDTH, borderRight: 'none' },
          }}
        >
          {renderContent}
        </Drawer>
      )}
      <ScreenDialog
        isLoading={isLoading}
        open={search?.includes('?profile-id=')}
        title="Profile Siswa"
        handleClose={() => navigate(-1)}
        labelClose="tutup"
      >
        <ListItemText primary="Nama" secondary={itemsNoPagination?.nama || '-'} />
        <ListItemText primary="Username" secondary={itemsNoPagination?.username || '-'} />
        <ListItemText
          primary="Kelas"
          secondary={
            `${itemsNoPagination?.kelas} ${itemsNoPagination?.jurusan?.nama} ${itemsNoPagination?.sub_kelas}` || '-'
          }
        />
        <ListItemText primary="Angkatan" secondary={itemsNoPagination?.angkatan || '-'} />
        <Box>
          {edit ? (
            <Box>
              <Typography>No Hp</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  type="number"
                  placeholder="contoh: 81213221343 "
                  defaultValue={itemsNoPagination?.noHP || ''}
                  onChange={(i) => setValue(i.target.value)}
                  size="small"
                />
                <Button disabled={mutation.isLoading} color="success" onClick={handleSave} variant="contained">
                  Save
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemText
                primary="No Hp"
                secondary={`${itemsNoPagination?.noHP == 0 ? '-' : itemsNoPagination?.noHP}` || '-'}
              />
              <Button onClick={() => setEdit(true)} variant="contained">
                Edit
              </Button>
            </Box>
          )}
        </Box>
        <ListItemText primary="Kode siswa" secondary={itemsNoPagination?.kode_siswa || '-'} />
        <ListItemText primary="Nama ayah" secondary={itemsNoPagination?.nama_ayah || '-'} />
        <ListItemText primary="Nama ibu" secondary={itemsNoPagination?.nama_ibu || '-'} />
      </ScreenDialog>
    </Box>
  );
}
