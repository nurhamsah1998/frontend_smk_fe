import PropTypes from 'prop-types';
import { memo, useContext, useMemo } from 'react';
import { NavLink as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import jwtDecode from 'jwt-decode';

// @mui
import { red } from '@mui/material/colors';
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import { Dialog } from '../../hooks/useContextHook';
import { themeAppColors } from '../../theme/themeAppColor';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  const { setDialog } = useContext(Dialog);
  const token = window.localStorage.getItem('accessToken');
  const localToken = token ? jwtDecode(token || {}) : {};
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogOut = () => {
    setDialog((i) => ({
      helperText: 'Apakah anda yakin ingin keluar?',
      title: 'Keluar',
      labelClose: 'Batal',
      variant: 'error',
      labelSubmit: 'Keluar',
      fullWidth: false,
      do: () => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('current_page_tagihan');
        window.localStorage.removeItem('current_tab_tagihan');
        if (localToken?.roleStaff === 'ADMINISTRASI') {
          navigate('/staff-login');
        } else {
          navigate('/');
        }
      },
      isCloseAfterSubmit: true,
    }));
  };
  const titleHead = useMemo(() => data.find((item) => item?.path === location.pathname), [location.pathname]);
  return (
    <Box {...other} sx={{ height: 1 }}>
      <Helmet>
        <title>{titleHead?.title || ''} | SMK Kras Kediri</title>
        <link rel="canonical" href="/" />
      </Helmet>
      <List disablePadding sx={{ p: 1, height: 1 }}>
        {data.map((item, index) => {
          if (item?.path?.includes('/log-out')) {
            return (
              <Box
                key={index}
                onClick={handleLogOut}
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 8,
                  left: 8,
                }}
              >
                <StyledNavItem
                  component={RouterLink}
                  to={null}
                  sx={{
                    width: '100%',
                    '&.active': {
                      color: red[500],
                      bgcolor: red[50],
                      fontWeight: 'fontWeightBold',
                    },
                  }}
                >
                  <StyledNavItemIcon
                    sx={{
                      color: red[500],
                    }}
                  >
                    {item?.icon && item?.icon}
                  </StyledNavItemIcon>

                  <ListItemText disableTypography sx={{ fontSize: '13px' }} primary={item?.title} />
                </StyledNavItem>
              </Box>
            );
          }
          return <NavItem key={index} item={item} />;
        })}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

const NavItem = memo(({ item }) => {
  const { title, path, icon, info } = item;
  const location = useLocation();
  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: themeAppColors.main,
          bgcolor: themeAppColors.light,
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon
        sx={{
          color: location?.pathname?.includes(path) ? themeAppColors.main : 'grey',
        }}
      >
        {icon && icon}
      </StyledNavItemIcon>

      <ListItemText disableTypography sx={{ fontSize: '13px' }} primary={title} />

      {info && info}
    </StyledNavItem>
  );
});

NavItem.propTypes = {
  item: PropTypes.object,
};
