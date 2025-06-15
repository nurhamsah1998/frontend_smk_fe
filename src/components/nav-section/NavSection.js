import PropTypes from 'prop-types';
import { memo, useContext, useMemo } from 'react';
import { NavLink as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// @mui
import { Box, Button, List, ListItemText } from '@mui/material';
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
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogOut = () => {
    setDialog((i) => ({
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
    }));
  };
  const titleHead = useMemo(() => data.find((item) => item?.path === location.pathname), [location.pathname]);
  return (
    <Box {...other}>
      <Helmet>
        <title>{titleHead?.title || ''} | SMK Kras Kediri</title>
        <link rel="canonical" href="/" />
      </Helmet>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item, index) => {
          if (item?.path?.includes('/log-out')) {
            return (
              <Button
                key={index}
                onClick={handleLogOut}
                color="error"
                startIcon={item.icon}
                variant="outlined"
                sx={{ mt: 5 }}
                fullWidth
              >
                {item.title}
              </Button>
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
