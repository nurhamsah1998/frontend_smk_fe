import {
  Box,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Avatar,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { green, red } from '@mui/material/colors';

function ListItemComponent({ isVerified, primary, secondary }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <ListItem
        disablePadding
        secondaryAction={
          <>
            <IconButton edge="end" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>Download Invoice</MenuItem>
              <MenuItem onClick={handleClose}>Cetak Invoice</MenuItem>
            </Menu>
          </>
        }
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: isVerified ? green[400] : red[400] }}>
            {isVerified ? <CheckIcon /> : <CloseIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Typography sx={{ textTransform: 'capitalize' }}>{primary}</Typography>
            </>
          }
          secondary={secondary}
        />
      </ListItem>
    </Box>
  );
}

export default ListItemComponent;
