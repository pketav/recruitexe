'use client'

import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton
} from "@mui/material"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import {
  InfoOutlined as InfoOutlinedIcon,
  People as PeopleIcon,
  PersonOutline as EmployeeTypeIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  EditOutlined as EditIcon,
  CheckCircle as StatusIcon
} from '@mui/icons-material'
import GroupsIcon from '@mui/icons-material/Groups'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{ p: 1, gap: 1 }}>
      <GridToolbarColumnsButton startIcon={<ViewColumnIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarFilterButton startIcon={<FilterIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarDensitySelector startIcon={<SettingsIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarExport
        startIcon={<DownloadIcon />}
        sx={{ color: 'primary.main' }}
        csvOptions={{
          disableToolbarButton: false
        }}
        printOptions={{
          disableToolbarButton: true
        }}
      />
    </GridToolbarContainer>
  )
}

export default function EmployeeType() {
  const token = window.localStorage.getItem('authToken')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [employeeType, setEmployeeType] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Modal states
  const [addEmployeeType, setAddEmployeeType] = useState(false)
  const [editEmployeeType, setEditEmployeeType] = useState(false)
  const [typeTitle, setTypeTitle] = useState({ name: '' })
  const [editData, setEditData] = useState({})

  const columns = [
    {
      field: 'name',
      headerName: 'Employee Type',
      flex: 2,
      minWidth: 200,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Type or category of employment (e.g., Full-time, Part-time, Contract, Intern)'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <EmployeeTypeIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Employee Type
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => (
        <Tooltip title={`Employee Type: ${params.value}`} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
            <EmployeeTypeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography
              variant='body2'
              fontWeight={500}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {params.value}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1.5,
      minWidth: 150,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Date when the employee type was created'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <CalendarIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Created Date
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => {
        const dateStr = params.row?.createdAt
        if (!dateStr || dateStr === '-')
          return (
            <Tooltip title='Created Date: Not available' placement='top'>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant='body2'>-</Typography>
              </Box>
            </Tooltip>
          )
        const date = new Date(dateStr)
        const formattedDate = isNaN(date.getTime())
          ? "-"
          : date.toLocaleString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        return (
          <Tooltip title={`Created Date: ${formattedDate}`} placement='top'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
              <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant='body2'>{formattedDate}</Typography>
            </Box>
          </Tooltip>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Current status of the employee type'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <StatusIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Status
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => {
        const isActive = params.row.status
        const statusColor = isActive ? 'success' : 'error'
        const statusLabel = isActive ? 'Active' : 'Inactive'

        return (
          <Tooltip title={`Current Status: ${statusLabel}`} placement='top'>
            <Chip
              label={statusLabel}
              color={statusColor}
              sx={{
                borderRadius: '20px',
                fontSize: '0.75rem',
                height: 28,
                minWidth: 70,
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </Tooltip>
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      minWidth: 140,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Tooltip title='Available actions for this employee type'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <SettingsIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Actions
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => {
        const isActive = params.row.status

        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%', justifyContent: 'center', px: 1 }}>
            <Tooltip title='Edit employee type details' placement='top'>
              <Button
                variant='contained'
                size='small'
                sx={{
                  minWidth: 'auto',
                  width: 32,
                  height: 32,
                  p: 0,
                  background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
                  color: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 3px 8px rgba(0, 188, 212, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0097a7, #00838f)',
                    boxShadow: '0 4px 12px rgba(0, 188, 212, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={e => {
                  e.stopPropagation()
                  handleEdit(params.row)
                }}
              >
                <EditIcon sx={{ fontSize: 14 }} />
              </Button>
            </Tooltip>
            <Tooltip title={isActive ? 'Deactivate this employee type' : 'Activate this employee type'} placement='top'>
              <Button
                variant='contained'
                size='small'
                sx={{
                  minWidth: 'auto',
                  width: 32,
                  height: 32,
                  p: 0,
                  background: isActive
                    ? 'linear-gradient(135deg, #f44336, #d32f2f)'
                    : 'linear-gradient(135deg, #4caf50, #388e3c)',
                  color: 'white',
                  borderRadius: '50%',
                  boxShadow: isActive ? '0 3px 8px rgba(244, 67, 54, 0.3)' : '0 3px 8px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, #d32f2f, #c62828)'
                      : 'linear-gradient(135deg, #388e3c, #2e7d32)',
                    boxShadow: isActive ? '0 4px 12px rgba(244, 67, 54, 0.4)' : '0 4px 12px rgba(76, 175, 80, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={e => {
                  e.stopPropagation()
                  handleDelete(params.row.id, !isActive)
                }}
              >
                {isActive ? <ToggleOffIcon sx={{ fontSize: 14 }} /> : <ToggleOnIcon sx={{ fontSize: 14 }} />}
              </Button>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  const getEmployeeType = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${baseUrl}/v1/api/employeType/getAllEmployeType`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      const formatted = res.data.items.map(item => ({
        id: item._id,
        name: item.title,
        createdAt: item.createdAt || '-',
        status: item.status === 'active' ? true : false
      }))

      setEmployeeType(formatted)
      setTotalItems(formatted.length)
    } catch (error) {
      console.error('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getEmployeeType()
  }, [])

  const handleDelete = async (id, checked) => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/employeType/activeOrInactive`,
        {
          id: id,
          status: checked ? 'active' : 'inactive'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data.status) {
        setSnackbar({
          open: true,
          severity: 'success',
          message: 'Status updated successfully'
        })
      }
      getEmployeeType()
    } catch (error) {
      console.error('error', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error updating status'
      })
    }
  }

  const handleEdit = row => {
    setEditData({
      employeeTypeId: row.id,
      name: row.name
    })
    setEditEmployeeType(true)
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/employeType/employeTypeAdd`,
        {
          title: typeTitle.name
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data.status) {
        setSnackbar({
          open: true,
          severity: 'success',
          message: 'Employee type added successfully'
        })
        getEmployeeType()
        setAddEmployeeType(false)
        setTypeTitle({ name: '' })
      } else {
        setSnackbar({
          open: true,
          severity: 'error',
          message: res.data.message || 'Error adding employee type'
        })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error adding employee type'
      })
      console.error('error', error)
    }
  }

  const handleSubmitEdit = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/employeType/updateEmployeType`,
        {
          ...editData,
          title: editData.name
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data.status) {
        setSnackbar({
          open: true,
          severity: 'success',
          message: 'Employee type updated successfully'
        })
      }
      getEmployeeType()
      setEditEmployeeType(false)
    } catch (error) {
      console.error('error', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error updating employee type'
      })
    }
  }

  return (
    <Container
      maxWidth='xl'
      sx={{
        maxWidth: '100vw !important',
        px: { xs: 1, sm: 2, md: 3 },
        overflow: 'hidden'
      }}
    >
      {/* Header Section */}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                 display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* <DashboardIcon sx={{ fontSize: 40, color: "white" }} /> */}
              <GroupsIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant='h4' fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
                Employee Type Management
              </Typography>
              {/* <Tooltip title='Employment categories that define the nature of work relationship (e.g., Full-time, Part-time, Contract, Intern)'>
                <InfoOutlinedIcon sx={{ color: '#ffffff', fontSize: 24, cursor: 'pointer' }} />
              </Tooltip> */}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color='white'
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={() => setAddEmployeeType(true)}
              sx={{
                borderRadius: '25px',
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}
            >
              Add Employee Type
            </Button>
            {/* <Button variant="outlined" startIcon={<RefreshIcon />} onClick={getOrganizations} disabled={loading}>
                                    Refresh
                                  </Button> */}
            <Button
              sx={{ borderRadius: '25px' }}
              color='white'
              variant='outlined'
              onClick={() => router.push('/employeeSetup')}
            >
              <KeyboardBackspaceIcon />
            </Button>
          </Box>
        </Box>
      </Paper>
      {/* Enhanced DataGrid */}
      <Paper
        sx={{
          p: 2,
          width: '100%',
          overflow: 'hidden',
          maxWidth: '100%'
        }}
      >
        <DataGrid
          rows={employeeType}
          columns={columns}
          loading={loading}
          pagination
          getRowId={row => row.id}
          paginationModel={{ page, pageSize: rowsPerPage }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPage(page)
            setRowsPerPage(pageSize)
          }}
          rowCount={totalItems}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          disableColumnResize
          slots={{
            toolbar: CustomToolbar
          }}
          sx={{
            width: '100%',
            overflow: 'hidden',
            '& .MuiDataGrid-main': {
              overflow: 'hidden'
            },
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'hidden auto'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#1976d2',
              color: '#fff',
              fontWeight: 600
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#1976d2',
              color: '#fff',
              borderRight: 'none'
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
              color: '#fff'
            },
            '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
              color: '#fff'
            },
            '& .MuiDataGrid-columnSeparator': {
              display: 'none'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden'
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                cursor: 'pointer'
              }
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e0e0e0'
            }
          }}
        />
      </Paper>

      {/* Add Employee Type Modal */}
      <Dialog
        open={addEmployeeType}
        onClose={() => {
          setAddEmployeeType(false)
          setTypeTitle({ name: '' })
        }}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 18, fontWeight: 600 }}>
          <PeopleIcon color='primary' />
          Add New Employee Type
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Form Header */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant='h6' fontWeight={600} color='primary.main' sx={{ mb: 1 }}>
                Employee Type Information
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Create a new employment category for your organization
              </Typography>
            </Box>

            {/* Form Fields */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <EmployeeTypeIcon color='primary' sx={{ fontSize: 20 }} />
                Type Details
              </Typography>
              <TextField
                fullWidth
                size='small'
                label='Employee Type Name'
                name='name'
                value={typeTitle.name}
                onChange={e =>
                  setTypeTitle(prev => ({
                    ...prev,
                    [e.target.name]: e.target.value
                  }))
                }
                required
                placeholder='e.g., Full-time, Part-time, Contract, Intern'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
          <Button
            variant='outlined'
            onClick={() => {
              setAddEmployeeType(false)
              setTypeTitle({ name: '' })
            }}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#d0d0d0',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #1976d2, #1565c0)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
            startIcon={<AddIcon />}
          >
            Create Employee Type
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Type Modal */}
      <Dialog
        open={editEmployeeType}
        onClose={() => {
          setEditEmployeeType(false)
          setEditData({})
        }}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 18, fontWeight: 600 }}>
          <EditIcon color='primary' />
          Edit Employee Type
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Form Header */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant='h6' fontWeight={600} color='primary.main' sx={{ mb: 1 }}>
                Update Employee Type Information
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Modify the employment category details
              </Typography>
            </Box>

            {/* Form Fields */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <EmployeeTypeIcon color='primary' sx={{ fontSize: 20 }} />
                Type Details
              </Typography>
              <TextField
                fullWidth
                size='small'
                label='Employee Type Name'
                name='name'
                value={editData.name || ''}
                onChange={e =>
                  setEditData(prev => ({
                    ...prev,
                    [e.target.name]: e.target.value
                  }))
                }
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
          <Button
            variant='outlined'
            onClick={() => {
              setEditEmployeeType(false)
              setEditData({})
            }}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#d0d0d0',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmitEdit}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #1976d2, #1565c0)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
            startIcon={<EditIcon />}
          >
            Update Employee Type
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} variant='filled' severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
