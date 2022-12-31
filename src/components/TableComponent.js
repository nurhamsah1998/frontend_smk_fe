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
import moment from 'moment/moment';
import 'moment/locale/id';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { grey, green, red, blue, orange, cyan, purple } from '@mui/material/colors';
import { FormatCurrency } from './FormatCurrency';

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
  handleSeeBill,
  disablePagination = false,
  isTotal = false,
  handleTransaction,
  handleInvoice,
  totalBill = 0,
  isLoading,
}) {
  moment.locale('id');
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
    <Box sx={{ bgcolor: '#fff', width: '100%' }}>
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
        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                Memuat
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {tableBody?.length <= 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ border: 'none', textAlign: 'center' }}>
                  <Typography fontSize={24} color={grey[600]}>
                    Empty
                  </Typography>
                  <Typography color={grey[600]} variant="body">
                    {emptyTag}
                  </Typography>
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
                    const isCurrency = head?.isCurrency ? FormatCurrency(body[head.id]) : isIndicator;
                    const isDate = head?.isDate ? moment(body[head.id]).format('LLLL') : isCurrency;
                    return (
                      <TableCell sx={{ px: 2, py: 1, textTransform: 'capitalize' }} key={index}>
                        {isDate}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Box>
                      {handleSeeBill ? (
                        <IconButton
                          size="small"
                          onClick={() => {
                            handleSeeBill(body);
                            setAnchorEl(null);
                          }}
                        >
                          <RequestQuoteIcon color="primary" />
                        </IconButton>
                      ) : null}
                      {handleSwitch ? (
                        <MenuItem>
                          <Switch
                            checked={body?.indicator}
                            onChange={(i) => handleSwitch(i, body)}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                          <FormHelperText>Status</FormHelperText>
                        </MenuItem>
                      ) : null}
                      {/* <IconButton
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
                    </IconButton> */}
                      {/* <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      sx={{
                        '& .css-1h30a5t-MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper': {
                          boxShadow: '0px 5px 5px -3px rgb(145 158 171 / 20%)',
                        },
                      }}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      {item?.isPaid ? (
                        <MenuItem
                          onClick={() => {
                            handleInvoice(item);
                            setAnchorEl(null);
                          }}
                        >
                          <LocalPrintshopIcon color="primary" sx={{ mr: 1 }} /> Cetak Invoice
                        </MenuItem>
                      ) : null}
                      {handleTransaction ? (
                        <Box>
                          {!item?.isPaid ? (
                            <MenuItem
                              onClick={() => {
                                handleTransaction(item);
                                setAnchorEl(null);
                              }}
                            >
                              <RequestQuoteIcon color="primary" sx={{ mr: 1 }} /> Buat transaksi
                            </MenuItem>
                          ) : null}
                        </Box>
                      ) : null}
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
                          disabled
                          onClick={() => {
                            handleDelete(item);
                            setAnchorEl(null);
                          }}
                        >
                          <DeleteIcon color="error" sx={{ mr: 1 }} />
                          Hapus
                        </MenuItem>
                      ) : null}
                    </Menu> */}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
            {isTotal ? (
              <TableRow>
                {tableHead?.map((x, y) => (
                  <TableCell
                    colSpan={y === tableHead?.length - 1 ? 6 : 'false'}
                    key={y}
                    align={y === tableHead?.length - 2 ? 'right' : 'left'}
                    sx={{
                      color: y === tableHead?.length - 2 || y === tableHead?.length - 1 ? '#000' : grey[300],
                      cursor: y === tableHead?.length - 2 || y === tableHead?.length - 1 ? '' : 'default',
                      bgcolor: grey[300],
                      fontWeight: 700,
                      position: 'relative',
                    }}
                  >
                    {y === tableHead?.length - 2 ? 'Total :' : FormatCurrency(totalBill)}
                    {y === tableHead?.length - 2 || y === tableHead?.length - 1 ? null : (
                      <Box
                        sx={{
                          width: '100%',
                          bgcolor: grey[300],
                          position: 'absolute',
                          height: '100%',
                          top: 0,
                          left: 0,
                        }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ) : null}
          </TableBody>
        )}
      </Table>
      <Box sx={{ py: 2, display: disablePagination ? 'none' : 'flex', justifyContent: 'flex-end' }}>
        <Pagination onChange={pageOnchange} count={count} />
      </Box>
    </Box>
  );
}

export default TableComponen;
