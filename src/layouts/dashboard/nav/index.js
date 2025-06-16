import PropTypes from 'prop-types';
import { useEffect, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import SchoolIcon from '@mui/icons-material/School';
import PestControlIcon from '@mui/icons-material/PestControl';
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, LinearProgress } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import { PROFILE } from '../../../hooks/useHelperContext';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import { themeAppColors } from '../../../theme/themeAppColor';
import { getInitialName, randomColorInitialName } from '../../../utils/getInitialName';

//

// ----------------------------------------------------------------------

const NAV_WIDTH = 281;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: themeAppColors.light,
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
const iconStyle = {
  width: 70,
  height: 70,
  color: themeAppColors.hard_light,
  opacity: 0.4,
};
export const LogoApp = () => (
  <Box
    sx={{
      mx: 0.5,
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    }}
  >
    <Box
      sx={{
        width: 50,
        height: 50,
        borderRadius: 1,
        // bgcolor: themeAppColors.main
      }}
    >
      <img src="/assets/logo_pgri.png" alt="logo_pic" />
    </Box>
    <Box>
      <Typography variant="h6" sx={{ lineHeight: 0.5 }}>
        SMK PGRI KRAS
      </Typography>
      <Typography sx={{ lineHeight: 0 }} variant="caption">
        kediri jawa timur
      </Typography>
    </Box>
  </Box>
);
export default function Nav({ openNav, onCloseNav, navConfig }) {
  const { pathname } = useLocation();

  const { itemsNoPagination, isLoading } = useContext(PROFILE);
  // eslint-disable-next-line no-extra-boolean-cast
  const permissionsUser = Boolean(itemsNoPagination?.id)
    ? typeof itemsNoPagination?.permissions === 'string'
      ? JSON.parse(itemsNoPagination?.permissions)
      : itemsNoPagination?.permissions
    : [];
  const permissionsSlicing = useMemo(() => {
    // eslint-disable-next-line no-unused-vars, prefer-const
    let cloneNav = [...navConfig];
    // eslint-disable-next-line no-unreachable-loop
    for (let index = 0; index < cloneNav.length; index += 1) {
      for (let Pindex = 0; Pindex < permissionsUser.length; Pindex += 1) {
        if (permissionsUser[Pindex] === cloneNav[index].name) {
          cloneNav[index].permission = true;
        }
      }
    }
    return cloneNav?.filter((item) => item.permission);
  }, [itemsNoPagination?.permissions]);

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
        bgcolor: '#fff',
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <LogoApp />
      <Box sx={{ mb: 1, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            {!isLoading && (
              <Box sx={{ position: 'absolute', top: 0, right: 5, zIndex: 1 }}>
                {itemsNoPagination?.role === 'DEV' ? <PestControlIcon sx={iconStyle} /> : <SchoolIcon sx={iconStyle} />}
              </Box>
            )}

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

            <Box sx={{ ml: 2, zIndex: 2, position: 'relative' }}>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.primary', lineHeight: 1, textTransform: 'capitalize' }}
              >
                {isLoading ? <LinearProgress /> : itemsNoPagination?.nama}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isLoading ? <LinearProgress /> : itemsNoPagination?.role}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>
      <NavSection data={permissionsSlicing} />
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
    </Box>
  );
}
