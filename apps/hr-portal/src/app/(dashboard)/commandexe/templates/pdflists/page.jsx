'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  Snackbar,
  Alert
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { getAllPDFtemplatesAPI, getDeletePDFtemplatesAPI } from '@/services/apiService'

// import Modal from '../../components/modal'

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid'
import Modal from '../../components/modal'

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ p: 4 }}>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        csvOptions={{
          fileName: 'exported-data',
          delimiter: ',',
          utf8WithBom: true
        }}
      />
    </GridToolbarContainer>
  )
}

export default function PDFLists() {
  const [templates, setTemplates] = useState([])
  const [rows, setRows] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [queryParams, setQueryParams] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const columns = [
    {
      field: 'templateName',
      headerName: 'Template Name',
      flex: 1,
      minWidth: 150,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'productName',
      headerName: 'Report Type',
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
      renderCell: params => {
        return (
          <Button 
            variant='contained' 
            color='success' 
            size='small'
            onClick={() => handlePreview(params.row)}
          >
            Preview
          </Button>
        )
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.5,
      minWidth: 100,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      renderCell: params => {
        return (
          <IconButton 
            color='error' 
            onClick={() => handleDeleteClick(params.row)}
            sx={{ 
              backgroundColor: '#ffebee',
              '&:hover': {
                backgroundColor: '#ffcdd2'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        )
      }
    }
  ]

  useEffect(() => {
    fetchVariables()
  }, [])

  const fetchVariables = async () => {
    try {
      const res = await getAllPDFtemplatesAPI()


      if (res && res.items) {
        setRows(
          res.items.map(item => ({
            _id: item?._id,
            id: item?._id,
            htmlContent: item.htmlContent,
            productName: item.userProductId?.productName || 'N/A',
            templateName: item.templateName || 'N/A'
          }))
        )
      }
    } catch (error) {
      console.error('Error fetching variables:', error)
      showSnackbar('Error fetching templates', 'error')
    }
  }

  const handlePreview = row => {

    setPreviewContent(row.htmlContent)
    setQueryParams(row)
    setPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setPreviewOpen(false)
    setPreviewContent('')
    setQueryParams({})
  }

  const handleDeleteClick = (row) => {
    setTemplateToDelete(row)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return

    setLoading(true)
    try {
      const response = await getDeletePDFtemplatesAPI(templateToDelete._id)

      if (response.status) {
        // Remove the deleted template from the rows
        // setRows(prevRows => prevRows.filter(row => row._id !== templateToDelete._id))
        showSnackbar('Template deleted successfully', 'success')
        handleDeleteCancel()
        fetchVariables() // Refresh the list after deletion
      } else {
        showSnackbar(response.message || 'Failed to delete template', 'error')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      showSnackbar(error.message || 'Error deleting template', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setTemplateToDelete(null)
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const handleUpdate = row => {
    // Your existing update logic
  }

  const handleNavigate = row => {

    if (queryParams) {
      // Navigate to update page with template data from modal
      localStorage.setItem(
        'templateData',
        JSON.stringify({
          _id: queryParams._id,
          htmlContent: queryParams.htmlContent,
          templateName: queryParams.templateName,
          productName: queryParams.productName
        })
      )

      router.push('/commandexe/templates/updatetemplate')
    }
  }

  const handleOpen = () => {
    router.push('/commandexe/templates/pdftemplates')
  }

  return (
    <>
      <Paper sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 4 }}>
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            Templates
          </Typography>
           <Box>
                   <Button
                      variant='outlined'
                      onClick={()=> router.push('/employeeSetup')}
                      sx={{ marginRight : '10px'}}
                    >
                      Back
                    </Button>
          <Button variant='contained' color='primary' onClick={handleOpen}>
            Create Template
          </Button>
          </Box>
        </Box>

        <div style={{ height: 540, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10,25,50,100]}
            getRowId={row => row._id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
              }
            }}
            rowHeight={50}
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
                  <Typography variant='body2'>No Templates found</Typography>
                </Box>
              )
            }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#9180ff',
                color: '#ffffff',
                fontWeight: 'bold'
              }
            }}
          />
        </div>
      </Paper>

      {/* HTML Preview Dialog */}
      <Modal
        open={previewOpen}
        handleClose={handleClosePreview}
        maxWidth='lg'
        fullWidth={true}
        title='HTML Preview'
        showButton={false}
      >
        <div dangerouslySetInnerHTML={{ __html: previewContent }} style={{ margin: '20px 0' }} />
        <DialogActions>
          <Button onClick={handleClosePreview} color='primary'>
            Close
          </Button>
          <Button variant='contained' onClick={handleNavigate} color='success'>
            Update
          </Button>
        </DialogActions>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: '#ffebee', 
          color: '#d32f2f',
          fontWeight: 'bold'
        }}>
          Delete Template
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant='body1'>
            Are you really want to delete this template: 
            <strong> "{templateToDelete?.templateName || 'N/A'}"</strong>?
          </Typography>
          <Typography variant='body2' sx={{ mt: 1, color: 'text.secondary' }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleDeleteCancel} 
            variant='outlined'
            color='inherit'
            disabled={loading}
          >
            Discard
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant='contained'
            color='error'
            disabled={loading}
            startIcon={loading ? null : <DeleteIcon />}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}