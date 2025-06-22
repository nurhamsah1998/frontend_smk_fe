import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import { themeAppColors } from '../../theme/themeAppColor';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  const location = useLocation();
  const titleHead = useMemo(() => data.find((item) => item?.path === location.pathname), [location.pathname]);
  return (
    <Box {...other} sx={{ height: 1 }}>
      <Helmet>
        <title>{titleHead?.title || ''} | SMK Kras Kediri</title>
        <link rel="canonical" href="/" />
      </Helmet>
      <List disablePadding sx={{ p: 1, height: 1 }}>
        {data.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
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
