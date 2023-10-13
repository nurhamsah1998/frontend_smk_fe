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
  TableContainer,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import moment from 'moment/moment';
import 'moment/locale/id';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { grey, green, red, blue, orange, cyan, purple } from '@mui/material/colors';
import { FormatCurrency } from './FormatCurrency';
import { themeAppColors } from '../theme/themeAppColor';

function TableComponen({
  tableHead,
  tableBody,
  emptyTag,
  colorHead = 'green',
  count,
  page,
  pageOnchange,
  handleCustomOnClickRow,
  handleSeeBill,
  disablePagination = false,
  isTotal = false,
  totalBill = 0,
  isLoading,
  stickyHeader = 0,
  handleAccount = false,
  handleLockAccount,
  handleHoldAccount,
  handleAcceptAccount,
  handleBlockAccount,
  totalRows,
  totalData,
  customIcon,
  customIconSecondary,
  handlePrint,
  tooltipHandlePrint = '',
  tooltipCustom = '',
}) {
  moment.locale('id');
  const [selectedData, setSelectedData] = React.useState({});
  /// https://stackoverflow.com/a/72384851/18038473
  const [anchorEl, setAnchorEl] = React.useState(
    Array(tableBody?.length)
      .fill(1)
      .map((item, index) => ({ [`set_anchorEl_${index}`]: null }))
  );

  const handleClickAccount = (event, body, bodyIndex) => {
    setAnchorEl((prev) => ({ ...prev, [`set_anchorEl_${bodyIndex}`]: event.currentTarget }));
    setSelectedData(body);
  };
  const handleClose = (bodyIndex) => {
    setAnchorEl((prev) => ({ ...prev, [`set_anchorEl_${bodyIndex}`]: null }));
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
      color: themeAppColors.main,
    },
    {
      variant: 'purple',
      color: purple[600],
    },
  ].find((i) => i.variant === colorHead);
  return (
    <Box sx={{ bgcolor: '#fff', width: '100%' }}>
      <TableContainer sx={Boolean(stickyHeader) ? { maxHeight: stickyHeader } : {}}>
        <Table padding="none" stickyHeader={Boolean(stickyHeader)}>
          <TableHead>
            <TableRow>
              {tableHead?.map((head, index) => (
                <TableCell
                  colSpan={index === tableHead?.length - 1 ? 6 : 'false'}
                  sx={{
                    fontWeight: 600,
                    border: 'none',
                    color: '#fff',
                    px: 2,
                    bgcolor: variantColorTableHead?.color,
                    py: 1,
                    textAlign: head?.align || 'left',
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
                <TableCell align="center" colSpan={6} sx={{ height: '200px' }}>
                  <Box
                    sx={{
                      justifyContent: 'center',
                      py: 3,
                      alignItems: 'center',
                      display: 'flex',
                      gap: 2,
                    }}
                  >
                    <CircularProgress /> <span>Memuat</span>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody
              sx={{
                position: 'relative',
              }}
            >
              {tableBody?.length <= 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ border: 'none', textAlign: 'center', height: '200px' }}>
                    <Typography fontSize={24} color={grey[600]}>
                      Tidak ada yang ditampilkan
                    </Typography>
                    <Typography color={grey[600]} variant="body">
                      {emptyTag}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tableBody?.map((body, bodyIndex) => (
                  <TableRow
                    key={bodyIndex}
                    sx={{
                      height: '40px',
                    }}
                  >
                    {tableHead?.map((head, headIndex) => {
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
                          {
                            variant: 'warning',
                            color: orange[700],
                            bgcolor: orange[100],
                          },
                          {
                            variant: 'grey',
                            color: grey[700],
                            bgcolor: grey[300],
                          },
                          {
                            variant: 'blue',
                            color: blue[700],
                            bgcolor: blue[200],
                          },
                        ].find((i) => i?.variant === isVariantStatusColor?.variant);
                        if (isVariantStatusColor) {
                          return (
                            <Box
                              sx={{
                                bgcolor: colorVariant?.bgcolor,
                                color: colorVariant?.color,
                                width: '100%',
                                px: 1.5,
                                borderRadius: '9px',
                                textAlign: 'center',
                              }}
                            >
                              <Typography fontSize="14px">{isVariantStatusColor?.label}</Typography>
                            </Box>
                          );
                        }
                        return false;
                      };
                      const isIndicator = head?.variantStatusColor ? Status(body[head.id]) : body[head.id];
                      const isCurrency = head?.isCurrency ? (
                        /// https://stackoverflow.com/a/4652112/18038473
                        <>
                          {body[head?.id] < 0 ? (
                            <Typography fontSize="14px" color={green[400]}>
                              +{FormatCurrency(Math.abs(body[head.id]))}
                            </Typography>
                          ) : (
                            FormatCurrency(body[head.id])
                          )}
                        </>
                      ) : (
                        isIndicator
                      );
                      const isDate = head?.isDate ? moment(body[head.id]).format('LLLL') : isCurrency;

                      return (
                        <TableCell sx={{ px: 2, py: 0, textTransform: 'capitalize' }} key={headIndex}>
                          {isDate || '-'}
                        </TableCell>
                      );
                    })}
                    <TableCell sx={{ py: 0 }}>
                      <Box sx={{ display: 'flex' }}>
                        {handleSeeBill ? (
                          <Tooltip arrow title="Detail Pembayaran">
                            <IconButton
                              size="small"
                              onClick={() => {
                                handleSeeBill(body);
                                setAnchorEl(null);
                              }}
                            >
                              <RequestQuoteIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                        {handleCustomOnClickRow ? (
                          <Tooltip arrow title={tooltipCustom}>
                            <IconButton onClick={() => handleCustomOnClickRow(body)}>{customIcon}</IconButton>
                          </Tooltip>
                        ) : null}
                        {handlePrint && !Boolean(body?.status_bill !== 'not_paid') ? (
                          <Tooltip arrow title={tooltipHandlePrint}>
                            <IconButton onClick={() => handlePrint(body)}>{customIconSecondary}</IconButton>
                          </Tooltip>
                        ) : null}
                        {Boolean(handleAccount) && (
                          <Box>
                            <IconButton onClick={(event) => handleClickAccount(event, body, bodyIndex)}>
                              <Tooltip arrow title={'Status akun'}>
                                <AccountBoxIcon sx={{ color: red[500] }} />
                              </Tooltip>
                            </IconButton>

                            <Menu
                              id="basic-menu"
                              anchorEl={anchorEl?.[`set_anchorEl_${bodyIndex}`]}
                              sx={{
                                '& .css-6hp17o-MuiList-root-MuiMenu-list': {
                                  boxShadow:
                                    '0px 5px 5px -3px rgb(145 158 171 / 0%), 0px 8px 10px 1px rgb(145 158 171 / 0%), 0px 3px 14px 2px rgb(145 158 171 / 5%)',
                                },
                              }}
                              open={Boolean(anchorEl?.[`set_anchorEl_${bodyIndex}`])}
                              onClose={() => handleClose(bodyIndex)}
                            >
                              <MenuItem
                                onClick={() => {
                                  handleLockAccount(selectedData);
                                  setAnchorEl(null);
                                }}
                              >
                                Kunci akun
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  handleBlockAccount(selectedData);
                                  setAnchorEl(null);
                                }}
                              >
                                Blokir akun
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  handleAcceptAccount(selectedData);
                                  setAnchorEl(null);
                                }}
                              >
                                Terima akun
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  handleHoldAccount(selectedData);
                                  setAnchorEl(null);
                                }}
                              >
                                Tahan akun
                              </MenuItem>
                            </Menu>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {isTotal ? (
                <TableRow
                  sx={{
                    position: 'sticky',
                    bottom: 0,
                  }}
                >
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
                        height: '40px',
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
      </TableContainer>
      <Box
        sx={{ py: 2, display: disablePagination ? 'none' : 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
      >
        <span>
          {Boolean(totalRows) && (
            <span>
              <strong>{totalRows || 0}</strong> data ditampilkan, dari{' '}
            </span>
          )}
          <strong>{totalData || 0}</strong> total data
        </span>{' '}
        <Pagination page={page} onChange={pageOnchange} count={count} />
      </Box>
    </Box>
  );
}

export default TableComponen;
