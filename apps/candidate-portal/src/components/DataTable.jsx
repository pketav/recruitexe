'use client';
import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  IconButton,
} from '@mui/material';
import {
  VisibilityOutlined as VisibilityIcon,
  DeleteOutlineOutlined as DeleteIcon,
  EditOutlined as EditIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const DataTable = ({
  rows = [],
  handleOpen,
  handleView,
  handleDelete,
  page,
  rowsPerPage,
  totalItems,
  handleChangePage,
  handleChangeRowsPerPage,
  columns,
  extraActions = () => null,
}) => {
  const theme = useTheme();
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(rows.map(row => row._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, rowId) => {
    if (event.target.checked) {
      setSelectedRows(prev => [...prev, rowId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== rowId));
    }
  };

  const isAllSelected = rows.length > 0 && selectedRows.length === rows.length;

  return (
    <Box sx={{ overflowX: 'auto', width: '100%', color: theme.palette.text.primary }}>
      <TableContainer sx={{ backgroundColor: theme.palette.background.default }}>
        <Table stickyHeader sx={{ minWidth: 1000 }}>
          <TableHead
            sx={{
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(100deg, rgba(40, 44, 52, 1) 0%, rgba(50, 54, 62, 1) 82%, rgba(40, 44, 52, 1) 100%)'
                : 'linear-gradient(100deg, rgba(249, 251, 251, 1) 0%, rgba(246, 232, 252, 1) 82%, rgba(246, 233, 251, 1) 100%)',
            }}
          >
            <TableRow>
              <TableCell
                padding="checkbox"
                sx={{
                  position: 'sticky',
                  left: 0,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(40, 44, 52, 1)' : '#FFFFFF', // Match other columns
                  zIndex: 1000,
                  minWidth: 40,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: theme.palette.text.primary,
                }}
              >
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#B0BEC5' : '#B0BEC5',
                    '&.Mui-checked': {
                      color: theme.palette.mode === 'dark' ? '#66BB6A' : '#66BB6A',
                    },
                    '&:hover': {
                      color: theme.palette.mode === 'dark' ? '#90A4AE' : '#90A4AE',
                    },
                  }}
                />
              </TableCell>
              {columns.map(
                column =>
                  column.field !== 'action' && (
                    <TableCell
                      key={column.field}
                      sx={{
                        width: column.minWidth,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(40, 44, 52, 1)' : '#FFFFFF', // Match checkbox column
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: theme.palette.text.primary,
                        textAlign: column.align
                      }}
                    >
                      {column.headerName}
                    </TableCell>
                  )
              )}
              <TableCell
                sx={{
                  position: 'sticky',
                  right: 0,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(40, 44, 52, 1)' : '#FFFFFF',
                  zIndex: 1000,
                  minWidth: 100,
                  display: 'flex',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: theme.palette.text.primary,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map(row => (
                <TableRow key={row._id}>
                  <TableCell
                    padding="checkbox"
                    sx={{
                      position: 'sticky',
                      left: 0,
                      boxShadow: '4px 0 8px rgba(0,0,0,0.05)',
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(40, 44, 52, 1)' : '#FFFFFF', 
                      zIndex: 1000,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: theme.palette.text.primary,
                    }}
                  >
                    <Checkbox
                      checked={selectedRows.includes(row._id)}
                      onChange={event => handleSelectRow(event, row._id)}
                      sx={{
                        color: theme.palette.mode === 'dark' ? '#B0BEC5' : '#B0BEC5',
                        '&.Mui-checked': {
                          color: theme.palette.mode === 'dark' ? '#66BB6A' : '#66BB6A',
                        },
                        '&:hover': {
                          color: theme.palette.mode === 'dark' ? '#90A4AE' : '#90A4AE',
                        },
                      }}
                    />
                  </TableCell>
                  {columns.map(
                    column =>
                      column.field !== 'action' && (
                        <TableCell
                          key={column.field}
                          sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(40, 44, 52, 0.6)' : '#FFFFFF',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: theme.palette.text.primary,
                            textAlign:column.align
                          }}
                        >
                        {column.renderCell ? column.renderCell(row) : row[column.field] || 'N/A'}
                      </TableCell>
                    )
                  )}
                  <TableCell
                    sx={{
                      position: 'sticky',
                      right: 0,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(40, 44, 52, 1)' : '#FFFFFF', // Match other columns
                      zIndex: 1000,
                      boxShadow: '-4px 0 8px rgba(0,0,0,0.05)',
                      display: 'flex',
                      justifyContent: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: theme.palette.text.primary,
                    }}
                  >
                    {extraActions(row)}
                    {row.edit && (
                      <IconButton color="primary" onClick={() => handleOpen(row)}>
                        <EditIcon />
                      </IconButton>
                    )}
                    {row.delete && (
                      <IconButton color="secondary" onClick={() => handleDelete(row)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                    {row.view && (
                      <IconButton color="primary" onClick={() => handleView(row)}>
                        <VisibilityIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor:"white",
          color: theme.palette.text.primary,
          '& .MuiTablePagination-selectLabel': { color: theme.palette.text.primary },
          '& .MuiTablePagination-displayedRows': { color: theme.palette.text.primary },
          '& .MuiTablePagination-actions': { color: theme.palette.text.primary },
        }}
      />
    </Box>
  );
};

export default DataTable;