/* eslint-disable import/no-unresolved */
import { Box, SpeedDial, SpeedDialAction } from '@mui/material';
import React, { useContext } from 'react';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import ContainerCard from 'src/components/ContainerCard';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PROFILE } from 'src/hooks/useHelperContext';

const actions = [
  { icon: <AddToQueueIcon />, name: 'Buat kabar berita', path: '/create-news' },
  { icon: <NewspaperIcon />, name: 'List beritaku', path: '/my-news' },
];

function News() {
  const { itemsNoPagination } = useContext(PROFILE);
  const permissions = Boolean(itemsNoPagination?.id)
    ? typeof itemsNoPagination?.permissions === 'string'
      ? JSON.parse(itemsNoPagination?.permissions)
      : itemsNoPagination?.permissions
    : [];
  const enableSpeedDial = Boolean(permissions?.find((item) => item === 'cud_news'));
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const nav = useNavigate();
  const location = useLocation();
  const handleClickSpeedDialAction = (action) => {
    nav(`${location.pathname}${action?.path}`);
  };
  return (
    <ContainerCard>
      <Outlet />
      {(location.pathname === '/dev/news' || location.pathname === '/staff-tu/news') && enableSpeedDial && (
        <SpeedDial
          ariaLabel="SpeedDial controlled open example"
          sx={{ position: 'fixed', bottom: 28, right: 28 }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleClickSpeedDialAction(action)}
            />
          ))}
        </SpeedDial>
      )}
    </ContainerCard>
  );
}

export default News;
