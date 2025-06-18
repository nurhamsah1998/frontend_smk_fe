/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
import React, { memo, useMemo } from 'react';
import {
  Box,
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
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import moment from 'moment/moment';
import 'moment/locale/id';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { grey, green, red, blue, orange, purple } from '@mui/material/colors';
import { FormatCurrency } from './FormatCurrency';
import { themeAppColors } from '../theme/themeAppColor';
import TableRowDate from './TableRowDate';

function TableComponen({
  tableHead,
  tableBody = [],
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
  handleDelete,
  handlePrint,
  tooltipHandlePrint = '',
  tooltipCustom = '',
  disabledBlokir = false,
  disabledLock = false,
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
                  <Row
                    key={bodyIndex}
                    tableHead={tableHead}
                    bodyIndex={bodyIndex}
                    body={body}
                    handleSeeBill={handleSeeBill}
                    setAnchorEl={setAnchorEl}
                    handleCustomOnClickRow={handleCustomOnClickRow}
                    handleDelete={handleDelete}
                    tooltipCustom={tooltipCustom}
                    customIcon={customIcon}
                    handlePrint={handlePrint}
                    tooltipHandlePrint={tooltipHandlePrint}
                    customIconSecondary={customIconSecondary}
                    handleAccount={handleAccount}
                    handleClickAccount={handleClickAccount}
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                    disabledLock={disabledLock}
                    handleLockAccount={handleLockAccount}
                    selectedData={selectedData}
                    disabledBlokir={disabledBlokir}
                    handleBlockAccount={handleBlockAccount}
                    handleAcceptAccount={handleAcceptAccount}
                    handleHoldAccount={handleHoldAccount}
                  />
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
const Row = memo(
  ({
    tableHead,
    handleDelete,
    bodyIndex,
    body = {},
    handleSeeBill,
    setAnchorEl,
    handleCustomOnClickRow,
    tooltipCustom,
    customIcon,
    handlePrint,
    tooltipHandlePrint,
    customIconSecondary,
    handleAccount,
    handleClickAccount,
    anchorEl,
    handleClose,
    disabledLock,
    handleLockAccount,
    selectedData,
    disabledBlokir,
    handleBlockAccount,
    handleAcceptAccount,
    handleHoldAccount,
  }) => {
    const itemRebuildMemo = useMemo(() => tableHead, []);
    return (
      <TableRow
        sx={{
          height: '40px',
          bgcolor: bodyIndex % 2 ? '#a1a1a11f' : '#fff',
        }}
      >
        {itemRebuildMemo?.map((head, headIndex) => (
          <TableRowDate key={headIndex} head={head} body={body} />
        ))}
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
            {handleDelete ? (
              <Tooltip arrow title="Hapus">
                <IconButton sx={{ color: red[500] }} onClick={() => handleDelete(body)}>
                  <DeleteIcon />
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
                    disabled={disabledLock}
                    onClick={() => {
                      handleLockAccount(selectedData);
                      setAnchorEl(null);
                    }}
                  >
                    Kunci akun
                  </MenuItem>
                  <MenuItem
                    disabled={disabledBlokir}
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
    );
  }
);
export default TableComponen;
