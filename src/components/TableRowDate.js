import React, { memo } from 'react';
import { grey, green, red, blue, orange } from '@mui/material/colors';
import { Box, TableCell, Typography } from '@mui/material';
import moment from 'moment/moment';
import { FormatCurrency } from './FormatCurrency';

function TableRowDate({ head, body }) {
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
  const isDate = head?.isDate ? moment(body[head.id]).format('DD MMM YYYY H:mm') : isCurrency;
  return (
    <TableCell
      sx={{
        px: 2,
        py: 0,
        textTransform: 'capitalize',
      }}
    >
      {isDate || '-'}
    </TableCell>
  );
}

export default memo(TableRowDate);
