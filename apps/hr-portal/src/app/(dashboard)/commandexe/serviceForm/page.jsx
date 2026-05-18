
'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import ViewComfyIcon from '@mui/icons-material/ViewComfy'
import DownloadIcon from '@mui/icons-material/Download'

import CustomTextField from '@/@core/components/mui/TextField'
import Modal from '../components/modal'
import SubmitButton from '../components/SubmitButton'
import CancelButton from '../components/CancelButton'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  getIdByServicesApi,
  getServicesApi,
  postServicesApi,
  RemoveServicesAPI,
  updateServicesApi
} from '@/services/apiService'
import { useRouter } from 'next/navigation'

// CustomToolbar component (same as in CompanyForm)
function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        p: 1,
        display: 'flex',
        gap: 1,
        backgroundColor: '#f8f8f8',
        borderRadius: '8px 8px 0 0'
      }}
    >
      <GridToolbarColumnsButton
        startIcon={<ViewColumnIcon sx={{ fontSize: 16 }} />}
        sx={{
          backgroundColor: '#f0f0ff',
          color: '#6366f1',
          fontSize: '0.8rem',
          padding: '4px 8px',
          '&:hover': { backgroundColor: '#e0e0ff' }
        }}
      />
      <GridToolbarDensitySelector
        startIcon={<ViewComfyIcon sx={{ fontSize: 16 }} />}
        sx={{
          backgroundColor: '#f0f0ff',
          color: '#6366f1',
          fontSize: '0.8rem',
          padding: '4px 8px',
          '&:hover': { backgroundColor: '#e0e0ff' }
        }}
      />
      <GridToolbarExport
        startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
        sx={{
          backgroundColor: '#f0f0ff',
          color: '#6366f1',
          fontSize: '0.8rem',
          padding: '4px 8px',
          '&:hover': { backgroundColor: '#e0e0ff' }
        }}
        csvOptions={{
          fileName: 'exported-services',
          delimiter: ',',
          utf8WithBom: true
        }}
      />
    </GridToolbarContainer>
  )
}

export default function ServicesForm() {
  // Updated columns for DataGrid, styled similarly to CompanyForm
  const columns = [
    {
      field: 'serviceName',
      headerName: 'Service Name',
      flex: 1,
      minWidth: 150,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <MiscellaneousServicesIcon sx={{ fontSize: '1rem' }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 'normal' }}>Service Name</Typography>
        </Box>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 100,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
          <SettingsIcon sx={{ fontSize: '1rem' }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 'normal' }}>ACTION</Typography>
        </Box>
      ),
      renderCell: params => (
        <>
          {params.row.edit && (
            <IconButton color='inherit' size='small' onClick={() => handleOpen(params.row)}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
          {params.row.view && (
            <IconButton color='primary' size='small' onClick={() => handleView(params.row)}>
              <VisibilityIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </>
      )
    }
  ]

  const [open, setOpen] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const [formData, setFormData] = useState({ serviceName: '' })
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState([])
  const [selectedServices, setSelectedServices] = useState({})

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleOpen = services => {
    setSelectedServices(services)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAdd = () => {
    setOpenAdd(true)
  }

  const handleCloseAdd = () => {
    setOpenAdd(false)
      setFormData({
      serviceName:''
    })
  }

  const fetchServices = async () => {
    try {
      const data = await getServicesApi()
      setServices(data)

      if (data?.items) {
        setRows(
          data.items.map(item => ({
            _id: item._id || 'N/A',
            serviceName: item.serviceName || 'N/A',
            edit: true,
            delete: true,
            view: false
          }))
        )
      } else {
        console.error('Failed to fetch services:', data.message)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleSubmit = async event => {
    event.preventDefault()

    const dataToSend = {
      serviceName: formData.serviceName
    }

    try {
      setLoading(true)
      const response = await postServicesApi(dataToSend)

      if (response.status) {
        setSnackbar({
          open: true,
          message: 'Service added successfully!',
          severity: 'success'
        })
        fetchServices()
        setFormData({ serviceName: '' })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add service',
        severity: 'error'
      })
    } finally {
      setLoading(false)
      handleCloseAdd()
    }
  }

  const isValidObjectId = id => /^[a-fA-F0-9]{24}$/.test(id)

  const handleUpdate = async () => {

    const id = selectedServices?._id

    if (!isValidObjectId(id)) {
      setSnackbar({
        open: true,
        message: 'Invalid Service ID',
        severity: 'error'
      })
      return
    }

    try {
      const fetchRes = await getIdByServicesApi(id)

      if (!fetchRes?.status || !fetchRes?.items?._id) {
        setSnackbar({
          open: true,
          message: 'Service not found',
          severity: 'error'
        })
        return
      }

      const updatedData = {
        id: selectedServices._id,
        serviceName: selectedServices?.serviceName,
      }

      const res = await updateServicesApi(updatedData)

      if (res?.status) {
        setSnackbar({
          open: true,
          message: 'Service updated successfully!',
          severity: 'success'
        })
        handleClose()
        fetchServices()
      } else {
        setSnackbar({
          open: true,
          message: res?.message || 'Update failed',
          severity: 'error'
        })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Unexpected error',
        severity: 'error'
      })
    }
  }

  const handleDelete = async row => {

    try {
      const res = await RemoveServicesAPI(row._id)

      if (res?.status) {
        setSnackbar({
          open: true,
          message: 'Service deleted successfully!',
          severity: 'success'
        })
        fetchServices()
      } else {
        setSnackbar({
          open: true,
          message: res?.message || 'Delete failed',
          severity: 'error'
        })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Unexpected error while deleting service.',
        severity: 'error'
      })
    }
  }

  const handleView = row => {
    alert(`View service: ${row.serviceName}`)
  }

  const router = useRouter()

  return (
    <>
      <Paper sx={{ p: 5, height: '90vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 4 }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Services</Typography>
          <Box>
            <Button
                onClick={()=> router.push('/employeeSetup')}
                sx={{
                    backgroundColor: '#9c8cfc',
                    color: '#ffffff',
                    mr: 1,
                    '&:hover': {
                    backgroundColor: '#7a6de0',
                    color: '#ffffff',
                    }
                }}
            >
                Back
            </Button>
            <Button
            onClick={handleAdd}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: 'transparent',
              color: '#9c8cfc',
              border: '1px solid #9c8cfc',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                borderColor: '#9c8cfc'
              }
            }}
          >
            Add Service
          </Button>
          </Box>
        </Box>

        <div style={{ height: 550, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            getRowId={row => row._id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
              }
            }}
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant='body2' sx={{ fontSize: '0.8rem' }}>
                    No services found
                  </Typography>
                </Box>
              )
            }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#9c8cfc',
                color: '#ffffff',
                fontWeight: 'normal',
                fontSize: '0.8rem'
              },
              '& .MuiDataGrid-cell': {
                padding: '8px 16px',
                fontSize: '0.8rem'
              },
              '& .MuiDataGrid-row:nth-of-type(even)': {
                backgroundColor: '#f9f9f9'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f0f7ff'
              },
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#f8f8f8'
              },
              '& .MuiTablePagination-root': {
                fontSize: '0.8rem'
              }
            }}
          />
        </div>
      </Paper>

      <Dialog
        open={openAdd}
        onClose={handleCloseAdd}
        maxWidth='xs'
        fullWidth
        BackdropProps={{ style: { backgroundColor: '#00000045' } }}
      >
        <DialogTitle>Add Service</DialogTitle>
        <DialogContent>
          <Typography variant='h6' className='text-slate-500 pb-3'>
            New Services to organize teams and establish reporting structures.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                margin='dense'
                label='Service Name'
                placeholder='Enter Service Name'
                value={formData.serviceName}
                onChange={e => {
                  const value = e.target.value
                  if (/^[A-Za-z0-9\s]*$/.test(value)) {
                    setFormData({ ...formData, serviceName: value })
                  }
                }}
                error={formData.serviceName !== '' && !/^[A-Za-z0-9\s]+$/.test(formData.serviceName)}
                helperText={
                  formData.serviceName !== '' && !/^[A-Za-z0-9\s]+$/.test(formData.serviceName)
                    ? 'Only letters, numbers and spaces are allowed.'
                    : ''
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleCloseAdd} color='primary'>
            Cancel
          </CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={formData.serviceName.trim() === ''}>
            Add
          </SubmitButton>
        </DialogActions>
      </Dialog>

      <Modal open={open} handleClose={handleClose} handleSubmit={handleUpdate} maxWidth='xs' title='Update Service'>
        <Grid container spacing={3} padding='12px'>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              margin='dense'
              label='Service Name'
              placeholder='Enter Service Name'
              value={selectedServices.serviceName || ''}
              onChange={e => {
                const value = e.target.value
                if (/^[A-Za-z0-9\s]*$/.test(value)) {
                  setSelectedServices({ ...selectedServices, serviceName: value })
                }
              }}
              error={selectedServices.serviceName !== '' && !/^[A-Za-z0-9\s]+$/.test(selectedServices.serviceName)}
              helperText={
                selectedServices.serviceName !== '' && !/^[A-Za-z0-9\s]+$/.test(selectedServices.serviceName)
                  ? 'Only letters, numbers and spaces are allowed.'
                  : ''
              }
            />
          </Grid>
        </Grid>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} variant='filled' severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}