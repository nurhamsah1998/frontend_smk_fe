import React from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { grey } from '@mui/material/colors';

function TableComponen({ tableHead, tableBody, isImage, handleClickReply, btnLabel = 'balas', emptyTag }) {
  return (
    <Box sx={{ bgcolor: '#fff' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#1BC5BD' }}>
            {tableBody?.length <= 0 ? (
              <TableCell>{null}</TableCell>
            ) : (
              tableHead?.map((head, index) => (
                <TableCell
                  colSpan={index === tableHead?.length - 1 ? 6 : 'false'}
                  sx={{ fontWeight: 600, border: 'none', color: '#fff' }}
                  key={index}
                >
                  {head.label}
                </TableCell>
              ))
            )}
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
                {tableHead?.map((head, index) => (
                  <TableCell sx={{ border: 'none' }} key={index}>
                    {head.isImage ? (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* <Box>
                          <img
                            width="90px"
                            style={{ borderRadius: "12px" }}
                            src={body.image}
                          />
                        </Box> */}
                        <Box>
                          <Typography textTransform="capitalize" fontWeight={600}>
                            {body[head.id]}
                          </Typography>
                          <Typography fontSize={14} color={grey[500]}>
                            NIK : {body.nik}
                          </Typography>
                        </Box>
                      </Box>
                    ) : head.isGrid ? (
                      <Box>
                        <Typography textTransform="capitalize" fontWeight={600}>
                          {body[head.id]}
                        </Typography>
                        <Typography fontSize={14} color={grey[500]}>
                          {body.status}
                        </Typography>
                      </Box>
                    ) : head.isStatus ? (
                      <Box
                        sx={{
                          bgcolor: body.color,
                          width: 'fit-content',
                          p: 1,
                          borderRadius: '5px',
                        }}
                      >
                        <Typography color="#fff" fomtSize={12}>
                          {body[head.id]}
                        </Typography>
                      </Box>
                    ) : (
                      body[head.id]
                    )}
                  </TableCell>
                ))}
                <TableCell sx={{ border: 'none' }}>
                  <Button onClick={() => handleClickReply(body)} variant="contained">
                    {btnLabel}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
}

export default TableComponen;
