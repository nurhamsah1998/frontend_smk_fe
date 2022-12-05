import React from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Pagination,
  Switch,
  FormHelperText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

import { grey, green, red, blue, orange, cyan, purple } from '@mui/material/colors';

function TableComponen({
  tableHead,
  tableBody,
  emptyTag,
  handleDelete,
  handleUpdate,
  handleDetail,
  hideOption = false,
  colorHead = 'green',
  count,
  page,
  pageOnchange,
  handleSwitch,
  setChecked,
  checked,
  handleChangeSwitch,
  handleSeeBill,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [item, setItem] = React.useState({});
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const variantColorTableHead = [
    {
      variant: 'green',
      color: green[600],
    },
    {
      variant: 'red',
      color: red[600],
    },
    {
      variant: 'blue',
      color: blue[600],
    },
    {
      variant: 'orange',
      color: orange[600],
    },
    {
      variant: 'cyan',
      color: cyan[600],
    },
    {
      variant: 'purple',
      color: purple[600],
    },
  ].find((i) => i.variant === colorHead);
  return (
    <Box sx={{ bgcolor: '#fff' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#1BC5BD' }}>
            {tableHead?.map((head, index) => (
              <TableCell
                colSpan={index === tableHead?.length - 1 ? 6 : 'false'}
                sx={{
                  fontWeight: 600,
                  border: 'none',
                  bgcolor: variantColorTableHead?.color,
                  color: '#fff',
                  px: 2,
                  py: 1,
                }}
                key={index}
              >
                {head.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableBody?.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ border: 'none', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={grey[600]}>
                  " Kosong "
                </Typography>
                <Typography color={grey[600]}>{emptyTag}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            tableBody?.map((body, index) => (
              <TableRow key={index}>
                {tableHead?.map((head, index) => {
                  const Status = (params) => {
                    const isVariantStatusColor = head?.variantStatusColor?.find((i) => i?.value === params);
                    const colorVariant = [
                      {
                        variant: 'success',
                        color: green[700],
                        bgcolor: green[100],
                      },
                      {
                        variant: 'error',
                        color: red[700],
                        bgcolor: red[100],
                      },
                    ].find((i) => i?.variant === isVariantStatusColor?.variant);
                    if (isVariantStatusColor) {
                      return (
                        <Box
                          sx={{
                            bgcolor: colorVariant?.bgcolor,
                            color: colorVariant?.color,
                            width: 'fit-content',
                            px: 1.5,
                            borderRadius: '9px',
                          }}
                        >
                          <Typography>{isVariantStatusColor?.label}</Typography>
                        </Box>
                      );
                    }
                    return false;
                  };
                  const isIndicator = head?.variantStatusColor ? Status(body[head.id]) : body[head.id];
                  return (
                    <TableCell sx={{ px: 2, py: 1 }} key={index}>
                      {isIndicator}
                    </TableCell>
                  );
                })}
                <TableCell>
                  <Box>
                    <IconButton
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={(event) => {
                        handleClick(event);
                        setItem(body);
                        if (handleSwitch) {
                          setChecked(body?.indicator);
                        }
                      }}
                    >
                      {hideOption ? null : <MoreVertIcon />}
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
                      {handleSeeBill ? (
                        <MenuItem
                          onClick={() => {
                            handleSeeBill(item);
                            setAnchorEl(null);
                          }}
                        >
                          <RequestQuoteIcon color="primary" sx={{ mr: 1 }} /> Lihat tagihan
                        </MenuItem>
                      ) : null}
                      {handleDetail ? (
                        <MenuItem onClick={handleDetail}>
                          <InfoIcon color="primary" sx={{ mr: 1 }} /> Detail
                        </MenuItem>
                      ) : null}
                      {handleSwitch ? (
                        <MenuItem>
                          <Switch
                            checked={checked}
                            onChange={(i) => handleChangeSwitch(i, item)}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                          <FormHelperText>Status</FormHelperText>
                        </MenuItem>
                      ) : null}
                      {handleUpdate ? (
                        <MenuItem onClick={handleUpdate}>
                          <EditIcon color="success" sx={{ mr: 1 }} />
                          Edit
                        </MenuItem>
                      ) : null}
                      {handleDelete ? (
                        <MenuItem
                          onClick={() => {
                            handleDelete(item);
                            setAnchorEl(null);
                          }}
                        >
                          <DeleteIcon color="error" sx={{ mr: 1 }} />
                          Hapus
                        </MenuItem>
                      ) : null}
                    </Menu>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Box sx={{ py: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination onChange={pageOnchange} count={count} />
      </Box>
    </Box>
  );
}

export default TableComponen;
