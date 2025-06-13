import PropTypes from 'prop-types';
import { useEffect, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, Toolbar, LinearProgress } from '@mui/material';
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

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: themeAppColors.light,
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

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
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Toolbar />
      <Box sx={{ mb: 5, mx: 2.5 }}>
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
              <Typography variant="subtitle2" sx={{ color: 'text.primary', lineHeight: 1 }}>
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
    </Box>
  );
}
