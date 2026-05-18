'use client'

import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Paper, Typography, IconButton, Snackbar, Alert, Tooltip } from '@mui/material'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Modal from '../components/modal'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  addautovariable,
  addVariablesAPI,
  deleteVariablesAPI,
  getAllVariablesAPI,
  updateVariablesAPI
} from '@/services/apiService'
import { useRouter } from 'next/navigation'

// Custom Toolbar Component
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

const VariablesPage = () => {
  const [open, setOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [variableName, setVariableName] = useState('')
  const [editVariableData, setEditVariableData] = useState({ _id: '', variableName: '' })
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const columns = [
    {
      field: 'variableName',
      headerName: 'Variable Name',
      flex: 1,
      minWidth: 150,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <>
          <Tooltip title='Edit'>
            <IconButton color='primary' onClick={() => handleUpdate(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton color='error' onClick={() => handleDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title='View'>
            <IconButton color='inherit' onClick={() => handleView(params.row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip> */}
        </>
      )
    }
  ]

  useEffect(() => {
    fetchVariables()
  }, [])

  const fetchVariables = async () => {
    setLoading(true)
    try {
      const res = await getAllVariablesAPI()
      if (res && res.items) {
        setRows(
          res.items.map(item => ({
            id: item._id, // Ensure unique 'id' for DataGrid
            _id: item._id,
            variableName: item.variableName
          }))
        )
      }
    } catch (error) {
      console.error('Error fetching variables:', error)
      setSnackbar({ open: true, message: 'Error fetching variables', severity: 'error' })
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setOpen(!open)
  }

  const handleUpdateOpen = () => {
    setUpdateOpen(!updateOpen)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!variableName.trim()) {
      setSnackbar({ open: true, message: 'Variable name cannot be empty', severity: 'error' })
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
      return
    }

    const payload = { variableName }
    try {
      const res = await addVariablesAPI(payload)
      if (res.status) {
        setSnackbar({ open: true, message: 'Variable added successfully', severity: 'success' })
        setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
      }
    } catch (error) {
      console.error('Error adding variable:', error)
      setSnackbar({ open: true, message: 'Error adding variable', severity: 'error' })
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
    } finally {
      setOpen(false)
      setVariableName('')
      fetchVariables()
    }
  }

  const handleAutoAddVariables = async () => {
    try {
      const res = await addautovariable()
      if (res.status) {
        setSnackbar({ open: true, message: 'Auto-added variables successfully', severity: 'success' })
        setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
      }
    } catch (error) {
      console.error('Error auto-adding variables:', error)
      setSnackbar({ open: true, message: 'Error auto-adding variables', severity: 'error' })
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
    } finally {
      fetchVariables()
    }
  }

  const handleUpdateVariable = async e => {
    e.preventDefault()
    if (!editVariableData.variableName.trim()) {
      setSnackbar({ open: true, message: 'Variable name cannot be empty', severity: 'error' })
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
      return
    }

    const payload = {
      varId: editVariableData._id,
      variableName: editVariableData.variableName
    }
    try {
      const res = await updateVariablesAPI(payload)
      if (res.status) {
        setSnackbar({ open: true, message: 'Variable updated successfully', severity: 'success' })
        setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
      }
    } catch (error) {
      console.error('Error updating variable:', error)
      setSnackbar({ open: true, message: 'Error updating variable', severity: 'error' })
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
    } finally {
      setUpdateOpen(false)
      setEditVariableData({ _id: '', variableName: '' })
      fetchVariables()
    }
  }

  const handleUpdate = row => {
    setEditVariableData(row)
    setUpdateOpen(true)
  }

  const handleDelete = async row => {
    try {
      const res = await deleteVariablesAPI(row._id)
      if (res.status) {
        setSnackbar({ open: true, message: 'Variable deleted successfully', severity: 'success' })
        setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
        fetchVariables()
      } else {
        setSnackbar({ open: true, message: 'Error deleting variable', severity: 'error' })
        setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
      }
    } catch (error) {
      console.error('Error deleting variable:', error)
      setSnackbar({ open: true, message: 'Error deleting variable', severity: 'error' })
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
    }
  }

  const handleView = row => {
    console.log('Viewing variable:', row)
    setSnackbar({ open: true, message: `Viewing ${row.variableName}`, severity: 'info' })
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
  }

  const router = useRouter()

  return (
    <>
      <Paper sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 4 }}>
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            Variables
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant='outlined'
              onClick={()=> router.push('/employeeSetup')}
            >
              Back
            </Button>
            <Button variant='contained' color='primary' sx={{ height: 40 }} onClick={handleAutoAddVariables}>
              Auto-add Variables
            </Button>
            <Button variant='contained' color='primary' sx={{ height: 40 }} onClick={handleOpen}>
              Add Variable
            </Button>
          </Box>
        </Box>

        <Box sx={{ height: 550, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialState={{
                pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
            loading={loading}
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
                  <Typography variant='body2'>No Variables found</Typography>
                </Box>
              )
            }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#9180ff',
                fontWeight: 'bold'
              }
            }}
          />
        </Box>
      </Paper>

      <Modal
        open={updateOpen}
        handleClose={handleUpdateOpen}
        title='Update Variable'
        maxWidth='xs'
        fullWidth={true}
        handleSubmit={handleUpdateVariable}
      >
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Variable Name'
              placeholder='Enter Variable Name'
              variant='outlined'
              value={editVariableData.variableName}
              onChange={e => setEditVariableData({ ...editVariableData, variableName: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Modal>

      <Modal
        open={open}
        handleClose={handleOpen}
        title='Add Variable'
        maxWidth='xs'
        fullWidth={true}
        handleSubmit={handleSubmit}
      >
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Variable Name'
              placeholder='Enter Variable Name'
              variant='outlined'
              value={variableName}
              onChange={e => setVariableName(e.target.value)}
              InputLabelProps={{ shrink: true }}
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
        <Alert
          onClose={handleCloseSnackbar}
          variant='filled'
          severity={snackbar.severity}
          sx={{ width: '100%', zIndex: 9999 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default VariablesPage
