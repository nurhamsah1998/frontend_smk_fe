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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

import { grey, green } from '@mui/material/colors';

function TableComponen({
  tableHead,
  tableBody,
  emptyTag,
  handleDelete,
  handleUpdate,
  handleDetail,
  hideOption = false,
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
                  sx={{ fontWeight: 600, border: 'none', bgcolor: green[600], color: '#fff', px: 2, py: 1 }}
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
                  <TableCell sx={{ px: 2, py: 1 }} key={index}>
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
                      {handleDetail ? (
                        <MenuItem onClick={handleDetail}>
                          <InfoIcon color="primary" sx={{ mr: 1 }} /> Detail
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
    </Box>
  );
}

export default TableComponen;
