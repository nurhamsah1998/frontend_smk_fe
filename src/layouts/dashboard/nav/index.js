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
      {/* <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box> */}
      <Toolbar />
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={''} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
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

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        {/* <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          <Box
            component="img"
            src="/assets/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get more?
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $69
            </Typography>
          </Box>

          <Button href="https://material-ui.com/store/itemsNoPagination/minimal-dashboard/" target="_blank" variant="contained">
            Upgrade to Pro
          </Button>
        </Stack> */}
      </Box>
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
