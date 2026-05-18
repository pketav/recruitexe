'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel
} from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { Add, ArrowBack, Edit } from '@mui/icons-material'
import Switch from '@mui/material/Switch'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import BlockIcon from '@mui/icons-material/Block'
import axios from 'axios'

const OrganizationType = () => {
  const router = useRouter()
  const [organizationTypes, setOrganizationTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [active, setActive] = useState('active')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingOrganizationType, setEditingOrganizationType] = useState(null)
  const [newOrganizationType, setNewOrganizationType] = useState({
    name: ''
  })
  const [errors, setErrors] = useState({
    name: false
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token = window.localStorage.getItem('authToken')

  useEffect(() => {
    fetchOrganizationTypes(active)
  }, [active])

  const fetchOrganizationTypes = async status => {
    setLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/v1/api/masterDropDown/organizationType/list?status=${status}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      const organizationTypeData = response.data.items.map(item => ({
        id: item._id,
        name: item.name,
        createit: item.createdBy?.employeName || 'Unknown',
        date: item.updatedAt.slice(0, 10).split('-').reverse().join('-'),
        status: item.status || status
      }))
      setOrganizationTypes(organizationTypeData)
    } catch (error) {
      console.error('Failed to fetch organization types:', error)
      const errorMessage = error.response?.data?.message || 'Failed to fetch organization types. Please try again.'
      setError(errorMessage)
      showSnackbar(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    })
  }

  const handleOpenDialog = (organizationType = null) => {
    setEditingOrganizationType(organizationType)
    if (organizationType) {
      setNewOrganizationType({
        name: organizationType.name
      })
    } else {
      setNewOrganizationType({ name: '' })
    }
    setErrors({ name: false })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingOrganizationType(null)
    setNewOrganizationType({ name: '' })
    setErrors({ name: false })
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setNewOrganizationType(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: !value }))
  }

  const handleSave = async () => {
    const newErrors = {
      name: !newOrganizationType.name
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(error => error)) {
      showSnackbar('Please fill in the required field', 'error')
      return
    }

    const payload = {
      name: newOrganizationType.name
    }
    if (editingOrganizationType) {
      payload.id = editingOrganizationType.id
    }

    try {
      if (editingOrganizationType) {
        await axios.post(`${baseUrl}/v1/api/masterDropDown/organizationType/update`, payload, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        })
        showSnackbar('Organization type updated successfully', 'success')
      } else {
        await axios.post(`${baseUrl}/v1/api/masterDropDown/organizationType/create`, payload, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        })
        showSnackbar('Organization type created successfully', 'success')
      }
      fetchOrganizationTypes(active)
      handleCloseDialog()
    } catch (error) {
      console.error('Failed to save organization type:', error)
      const errorMessage = error.response?.data?.message || 'Failed to save organization type. Please try again.'
      showSnackbar(errorMessage, 'error')
    }
  }

  const handleEdit = row => {
    handleOpenDialog(row)
  }

  const handleSwitchChange = event => {
    setActive(event.target.checked ? 'inactive' : 'active')
  }

  const handleGoBack = () => {
    router.push('/')
  }

  const handleActive = async row => {
    const newStatus = row.status === 'active' ? 'inactive' : 'active'
    try {
      await updateOrganizationStatus(row.id, newStatus)
      showSnackbar(`Organization type set to ${newStatus} successfully`, 'success')
      fetchOrganizationTypes(active)
    } catch (error) {
      console.error('Failed to update organization status:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update organization status. Please try again.'
      showSnackbar(errorMessage, 'error')
    }
  }

  const updateOrganizationStatus = async (id, status) => {
    await axios.post(
      `${baseUrl}/v1/api/masterDropDown/organizationType/activeAndInactive?id=${id}&status=${status}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      }
    )
  }

  const columns = [
    { field: 'name', headerName: 'Organization Type Name', flex: 1 },
    { field: 'createit', headerName: 'Created By', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1 },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: params => (
        <Box>
          <IconButton color='primary' onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          {params?.row?.status === 'active' ? (
            <IconButton color='error' onClick={() => handleActive(params.row)}>
              <BlockIcon />
            </IconButton>
          ) : (
            <IconButton color='success' onClick={() => handleActive(params.row)}>
              <Add />
            </IconButton>
          )}
        </Box>
      )
    }
  ]

  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ justifyContent: 'space-between', p: 1 }}>
        <Box>
          <GridToolbarFilterButton sx={{ mr: 1 }} />
          <GridToolbarExport />
        </Box>
      </GridToolbarContainer>
    )
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f7', minHeight: '100vh', p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleGoBack}
        sx={{
          mb: 2,
          color: '#7c4dff',
          '&:hover': { bgcolor: 'rgba(124, 77, 255, 0.08)' },
          textTransform: 'none',
          fontWeight: 500
        }}
      >
        Back
      </Button>
      <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Grid container spacing={2} alignItems='center' sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant='h5' component='h1' sx={{ fontWeight: 600, color: '#333' }}>
              Organization Types
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              mt: { xs: 2, md: 0 },
              gap: '1rem'
            }}
          >
            <Button
              variant='contained'
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                mr: 2,
                bgcolor: '#7c4dff',
                '&:hover': { bgcolor: '#6a1ee8' },
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(124, 77, 255, 0.2)'
              }}
            >
              Add New
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={active === 'inactive'}
                  onChange={handleSwitchChange}
                  sx={{
                    gap: '1rem',
                    width: 40,
                    height: 20,
                    padding: 0,
                    '& .MuiSwitch-switchBase': {
                      padding: 0,
                      transitionDuration: '100ms',
                      '&.Mui-checked': {
                        transform: 'translateX(28px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#7c4dff',
                          opacity: 1,
                          border: 0
                        }
                      },
                      '&:not(.Mui-checked)': {
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#e0e0e0',
                          opacity: 1
                        }
                      }
                    },
                    '& .MuiSwitch-thumb': {
                      width: 16,
                      height: 16,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 20,
                      backgroundColor: '#e0e0e0',
                      opacity: 1,
                      position: 'relative',
                      '&:before, &:after': {
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '8px',
                        fontWeight: 'bold'
                      },
                      '&:before': {
                        content: '"ON"',
                        left: 4,
                        color: '#fff'
                      },
                      '&:after': {
                        content: '"OFF"',
                        right: 4,
                        color: '#000'
                      }
                    }
                  }}
                />
              }
              label={active === 'active' ? 'Active' : 'Inactive'}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '14px',
                  color: '#666'
                },
                gap: '1rem',
                display: 'flex'
              }}
            />
          </Grid>
        </Grid>

        {error && (
          <Alert severity='error' sx={{ mb: 3, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Box sx={{ height: 500, width: '100%', mt: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress sx={{ color: '#7c4dff' }} />
            </Box>
          ) : (
            <DataGrid
              rows={organizationTypes}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              checkboxSelection
              disableSelectionOnClick
              components={{
                Toolbar: CustomToolbar
              }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f7',
                  borderRadius: '8px 8px 0 0'
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0'
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'rgba(124, 77, 255, 0.04)'
                },
                '& .MuiCheckbox-root': {
                  color: '#7c4dff'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: 'none'
                },
                '& .MuiTablePagination-root': {
                  color: '#666'
                },
                '& .MuiButtonBase-root.MuiIconButton-root': {
                  color: '#7c4dff'
                }
              }}
            />
          )}
        </Box>

        {/* Organization Type Form Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth='sm'
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle>{editingOrganizationType ? 'Edit Organization Type' : 'New Organization Type'}</DialogTitle>
          <DialogContent>
            <Box component='form' sx={{ mt: 2 }}>
              <TextField
                name='name'
                label='Organization Type Name'
                fullWidth
                required
                margin='normal'
                value={newOrganizationType.name}
                onChange={handleInputChange}
                error={errors.name}
                helperText={errors.name ? 'Organization Type Name is required' : ''}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant='contained' color='primary'>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  )
}

export default OrganizationType
