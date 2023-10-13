import PropTypes from 'prop-types';
import { useContext } from 'react';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';

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
  const handleLogOut = () => {
    setDialog((i) => ({
      title: 'Apakah anda yakin ingin keluar?',
      labelClose: 'Batal',
      labelSubmit: 'Keluar',
      fullWidth: false,
      do: () => {
        window.localStorage.removeItem('accessToken');
        navigate('/');
      },
      isCloseAfterSubmit: true,
    }));
  };
  return (
    <Box {...other}>
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

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

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
      <StyledNavItemIcon sx={{ color: themeAppColors.main }}>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
