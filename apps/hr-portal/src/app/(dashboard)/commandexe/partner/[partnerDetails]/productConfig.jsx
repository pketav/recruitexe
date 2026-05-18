import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Typography
} from '@mui/material'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  useGridApiRef
} from '@mui/x-data-grid'
import {
  getPartnerProductsAPI,
  postAddProductApi,
  postModuleApi,
  updateProductApi,
  deleteProductApi,
  getAllProductsAPI,
  getAllFormProductsAPI,
  getAllServicesApi
} from '@/services/apiService'
import CustomTextField from '@/@core/components/mui/TextField'

import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'

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

const ProductConfig = () => {
  const { partnerDetails } = useParams()
  const [data, setData] = useState([])
  const [rows, setRows] = useState([])
  const [openProductAdd, setOpenProductAdd] = useState(false)
  const [openProductEdit, setOpenProductEdit] = useState(false)
  const [openProductDelete, setOpenProductDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }, [])

  const [modules, setModules] = useState([])

  const [formData, setFormData] = useState({
    productName: '',
    isActive: false,
    status: 'approved',
    moduleId: ''
  })

  const [editFormData, setEditFormData] = useState({
    productName: '',
    productId: ''
  })

  const handleOpenEditDialog = product => {
    console.log('product',product);
    
    setSelectedProduct(product)
    setEditFormData({
      productName: product.productName,
      productId: product._id
    })
    setOpenProductEdit(true)
  }

  const handleOpenDeleteDialog = product => {
    setSelectedProduct(product)
    setOpenProductDelete(true)
  }

  const columns = [
    {
      field: 'productName',
      headerName: 'Product Name',
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
          <>
            <IconButton color='primary' onClick={() => handleOpenEditDialog(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton color='error' onClick={() => handleOpenDeleteDialog(params.row)}>
              <DeleteIcon />
            </IconButton>
          </>
        )
      }
    }
  ]

  console.log('partnerDetails', partnerDetails)

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await getAllServicesApi() // Adjust based on API response
        setModules(res?.items || [])
      } catch (err) {
        console.error('Failed to fetch modules:', err)
      }
    }

    fetchModules()
  }, [])
 
  useEffect(() => {
    fetchProduct(partnerDetails)
  }, [partnerDetails])

  const fetchProduct = async id => {
    try {
      const res = await getPartnerProductsAPI(id)
      console.log('products', res)
      const response =  await getAllFormProductsAPI(id)
      console.log('form products',response);
      
      if (res.status) {
        setData(res.items)
        setRows(
          res.items.map(item => ({
            _id: item._id,
            id: item._id,
            productName: item.productName || ''
          }))
        )
      } else {
        console.log('res', res.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const dataToSend = {
      requestId: partnerDetails,
      productName: formData?.productName,
      // isActive: formData.isActive,
      // status: formData.status,
      referId: formData.moduleId
    }

    try {
      setLoading(true)
      const response = await postAddProductApi(dataToSend)
      console.log('Product added successfully:', response)

      if (response.status) {
        setSnackbar({
          open: true,
          message: 'Product added successfully!',
          severity: 'success'
        })

        setTimeout(() => {
          setSnackbar(prev => ({ ...prev, open: false }))
        }, 5000)

        fetchProduct(partnerDetails)

        // Reset form
        setFormData({
          productName: '',
          isActive: false,
          status: 'pending',
          moduleId: ''
        })
      }
    } catch (error) {
      console.error('Failed to add product:', error.message)

      setSnackbar({
        open: true,
        message: error.message || 'Something went wrong',
        severity: 'error'
      })

      setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }))
      }, 5000)
    } finally {
      setLoading(false)
      setOpenProductAdd(false)
    }
  }

  const handleEditSubmit = async event => {
    event.preventDefault()

    const dataToSend = {
      prId: editFormData.productId,
      productName: editFormData.productName
    }

    try {
      setLoading(true)
      const response = await updateProductApi(dataToSend)
      console.log('Product updated successfully:', response)

      if (response.status) {
        setSnackbar({
          open: true,
          message: 'Product updated successfully!',
          severity: 'success'
        })

        setTimeout(() => {
          setSnackbar(prev => ({ ...prev, open: false }))
        }, 5000)

        fetchProduct(partnerDetails)
      }
    } catch (error) {
      console.error('Failed to update product:', error.message)

      setSnackbar({
        open: true,
        message: error.message || 'Something went wrong',
        severity: 'error'
      })

      setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }))
      }, 5000)
    } finally {
      setLoading(false)
      setOpenProductEdit(false)
    }
  }

  const handleDeleteSubmit = async () => {
    try {
      setLoading(true)
      const response = await deleteProductApi({ productId: selectedProduct._id })
      console.log('Product deleted successfully:', response)

      if (response.status) {
        setSnackbar({
          open: true,
          message: 'Product deleted successfully!',
          severity: 'success'
        })

        setTimeout(() => {
          setSnackbar(prev => ({ ...prev, open: false }))
        }, 5000)

        fetchProduct(partnerDetails)
      }
    } catch (error) {
      console.error('Failed to delete product:', error.message)

      setSnackbar({
        open: true,
        message: error.message || 'Something went wrong',
        severity: 'error'
      })

      setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }))
      }, 5000)
    } finally {
      setLoading(false)
      setOpenProductDelete(false)
    }
  }

  return (
    <Container maxWidth={'xl'}>
      <Box elevation={3} sx={{ mx: '-24px', padding: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: 4 }}>
          <Typography variant='h4' component='h2' gutterBottom>
            Report Type
          </Typography>
          <Button variant='outlined' onClick={() => setOpenProductAdd(true)}>
            Add Report
          </Button>
        </Box>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5]}
            getRowId={row => row._id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 }
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
                  <Typography variant='body2'>No Report found</Typography>
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
        </div>
      </Box>

      <Dialog open={openProductAdd} onClose={() => setOpenProductAdd(false)} aria-labelledby='add-product-dialog-title'>
        <DialogTitle id='add-product-dialog-title'>Add Report</DialogTitle>
        <DialogContent>
          <CustomTextField
            fullWidth
            select
            label='Select Services'
            variant='outlined'
            margin='normal'
            value={formData.moduleId}
            onChange={e => setFormData({ ...formData, moduleId: e.target.value })}
          >
            {modules.map(m => (
              <MenuItem key={m._id} value={m._id}>
                {m.serviceName}
              </MenuItem>
            ))}
          </CustomTextField>

          <CustomTextField
            fullWidth
            label='Report Name'
            variant='outlined'
            margin='normal'
            value={formData?.productName}
            onChange={e => setFormData({ ...formData, productName: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductAdd(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color='primary' autoFocus disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={openProductEdit}
        onClose={() => setOpenProductEdit(false)}
        aria-labelledby='edit-product-dialog-title'
      >
        <DialogTitle id='edit-product-dialog-title'>Edit Report Type</DialogTitle>
        <DialogContent>
          <CustomTextField
            fullWidth
            label='Product Name'
            variant='outlined'
            margin='normal'
            value={editFormData?.productName}
            onChange={e => setEditFormData({ ...editFormData, productName: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductEdit(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color='primary' autoFocus disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openProductDelete}
        onClose={() => setOpenProductDelete(false)}
        aria-labelledby='delete-product-dialog-title'
      >
        <DialogTitle id='delete-product-dialog-title'>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{selectedProduct?.productName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDelete(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteSubmit} color='error' autoFocus disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ProductConfig
