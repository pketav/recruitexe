"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Breadcrumbs,
  Link,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
  Divider,
  Stack,
  Avatar
} from "@mui/material"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid"
import { 
  Add, 
  Edit, 
  Delete, 
  ArrowBack, 
  Search,
  Settings,
  Assessment,
  CheckCircle,
  Cancel,
  Person,
  Description,
  CalendarToday,
  Category,
  AccountBalance
} from "@mui/icons-material"
import {
  fetchAllExpenseTypes,
  fetchCategoryDropdown,
  addExpenseType,
  updateExpenseType,
  deleteExpenseType
} from "../api/expense-type-service"

const ExpenseTypeSettings = () => {
  const [expenseTypes, setExpenseTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  })
  const [newExpenseType, setNewExpenseType] = useState({
    id: null,
    name: "",
    description: "",
    category: "" 
  })
  const [errors, setErrors] = useState({
    name: false,
    category: false
  })

  useEffect(() => {
    fetchExpenseTypes()
    fetchCategories()
  }, [])

  const fetchExpenseTypes = async () => {
    try {
      setLoading(true)
      const data = await fetchAllExpenseTypes()
      setExpenseTypes(data)
    } catch (error) {
      console.error("Error in component:", error)
      showSnackbar("Failed to load expense types", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const data = await fetchCategoryDropdown()
      const formattedData = data.map(item => ({
        id: item._id || item.id || "", 
        name: item.name || "Unknown"
      })).filter(cat => cat.id) 
      setCategories(formattedData)
    } catch (error) {
      console.error("Error fetching categories:", error)
      showSnackbar("Failed to load categories", "error")
    } finally {
      setLoadingCategories(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('-')
  }

  const getCategoryName = (categoryIds) => {
    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) return "N/A"
    const category = categories.find(cat => categoryIds.includes(cat.id))
    return category ? category.name : "Unknown"
  }

  const totalExpenseTypes = expenseTypes.length
  const activeExpenseTypes = expenseTypes.filter(e => e.isActive).length

  const filteredExpenseTypes = expenseTypes.filter(expense => {
    const categoryName = getCategoryName(expense.categoriesIds)
    return (
      expense.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.approver?.join(", ")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.remitter?.join(", ")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const columns = [
    { 
      field: "name", 
      headerName: "Expense Type", 
      flex: 1,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description sx={{ fontSize: 18, color: '#6366f1' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
            Expense Type
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: "description", 
      headerName: "Description", 
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#6b7280', maxWidth: 200 }} noWrap>
          {params.value}
        </Typography>
      )
    },
    {
      field: "categoriesIds",
      headerName: "Category",
      flex: 1,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Category sx={{ fontSize: 18, color: '#10b981' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
            Category
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Chip
          label={getCategoryName(params.value)}
          size="small"
          sx={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            fontWeight: 500,
            '& .MuiChip-label': { px: 1 }
          }}
        />
      )
    },
    // {
    //   field: "approver",
    //   headerName: "Approver",
    //   flex: 1,
    //   renderHeader: () => (
    //     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    //       <Person sx={{ fontSize: 18, color: '#3b82f6' }} />
    //       <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
    //         Approver
    //       </Typography>
    //     </Box>
    //   ),
    //   renderCell: (params) => (
    //     <Chip
    //       label={params.value?.join(", ") || "N/A"}
    //       size="small"
    //       sx={{
    //         backgroundColor: '#e0f2fe',
    //         color: '#0277bd',
    //         fontWeight: 500,
    //         '& .MuiChip-label': { px: 1 }
    //       }}
    //     />
    //   )
    // },
    // {
    //   field: "remitter",
    //   headerName: "Remitter",
    //   flex: 1,
    //   renderHeader: () => (
    //     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    //       <AccountBalance sx={{ fontSize: 18, color: '#10b981' }} />
    //       <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
    //         Remitter
    //       </Typography>
    //     </Box>
    //   ),
    //   renderCell: (params) => (
    //     <Chip
    //       label={params.value?.join(", ") || "N/A"}
    //       size="small"
    //       sx={{
    //         backgroundColor: '#d1fae5',
    //         color: '#065f46',
    //         fontWeight: 500,
    //         '& .MuiChip-label': { px: 1 }
    //       }}
    //     />
    //   )
    // },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          icon={params?.value ? <CheckCircle sx={{ fontSize: 16 }} /> : <Cancel sx={{ fontSize: 16 }} />}
          label={params?.value ? "Active" : "Inactive"}
          color={params?.value ? "success" : "default"}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      )
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarToday sx={{ fontSize: 18, color: '#6b7280' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
            Created At
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
          {formatDate(params.value)}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small"
            onClick={() => handleEdit(params?.row)}
            sx={{
              color: '#3b82f6',
              backgroundColor: '#eff6ff',
              '&:hover': {
                backgroundColor: '#dbeafe',
                color: '#1d4ed8'
              }
            }}
          >
            <Edit fontSize="small" />
          </IconButton>

        </Stack>
      ),
    },
  ]

  const handleEdit = (row) => {
    setIsEditing(true)
    const category = Array.isArray(row.categoriesIds) && row.categoriesIds.length > 0 
      ? row.categoriesIds[0] 
      : ""
    setNewExpenseType({
      id: row.id || null,
      name: row.name || "",
      description: row.description || "",
      category: category
    })
    setErrors({ name: false, category: !category })
    setOpenDialog(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense type?")) {
      try {
        await deleteExpenseType(id)
        await fetchExpenseTypes()
        showSnackbar("Expense type deleted successfully", "success")
      } catch (error) {
        showSnackbar("Failed to delete expense type", "error")
      }
    }
  }

  const handleOpenDialog = () => {
    setIsEditing(false)
    setNewExpenseType({
      id: null,
      name: "",
      description: "",
      category: "" 
    })
    setErrors({ name: false, category: false })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setErrors({ name: false, category: false })
    setNewExpenseType({ id: null, name: "", description: "", category: "" }) 
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewExpenseType(prev => ({
      ...prev,
      [name]: value
    }))
    setErrors(prev => ({
      ...prev,
      [name]: value === ""
    }))
  }
  
  const showSnackbar = (message, severity = "success") => {
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

  const handleSave = async () => {
    const newErrors = {
      name: !newExpenseType.name.trim(),
      category: !newExpenseType.category
    }

    setErrors(newErrors)

    if (newErrors.name || newErrors.category) {
      showSnackbar("Please fill all required fields", "error")
      return
    }

    const isValidCategory = categories.some(cat => cat.id === newExpenseType.category)
    if (!isValidCategory) {
      setErrors(prev => ({ ...prev, category: true }))
      showSnackbar("Please select a valid category", "error")
      return
    }

    try {
      const expenseTypeData = {
        id: newExpenseType.id,
        name: newExpenseType.name.trim(),
        description: newExpenseType.description.trim(),
        categoriesIds: [newExpenseType.category],
        approverLevels: [], 
        remitterLevels: []
      }
      
      if (isEditing) {
        const response = await updateExpenseType(expenseTypeData)
        if (!response.status) {
          showSnackbar(response.message || "Failed to update expense type", "error")
          return
        }
        showSnackbar("Expense type updated successfully")
      } else {
        const response = await addExpenseType(expenseTypeData)
        if (!response.status) {
          showSnackbar(response.message || "Failed to add expense type", "error")
          return
        }
        showSnackbar("Expense type added successfully")
      }

      await fetchExpenseTypes()
      handleCloseDialog()
    } catch (error) {
      console.error("Save error:", error)
      showSnackbar(error.message || "Failed to save expense type", "error")
    }
  }
  
  const handleGoBack = () => {
    window.history.back()
  }

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ 
        padding: '12px 16px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <GridToolbarColumnsButton sx={{ color: '#64748b', fontSize: '0.875rem' }} />
        <GridToolbarDensitySelector sx={{ color: '#64748b', fontSize: '0.875rem' }} />
        <GridToolbarExport
          csvOptions={{
            disableToolbarButton: false 
          }}
          printOptions={{
            disableToolbarButton: true 
          }}
          sx={{ color: '#64748b', fontSize: '0.875rem' }}
        />
      </GridToolbarContainer>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', p: 3 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        {/* Header Section */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <Button 
                variant="outlined" 
                startIcon={<ArrowBack />} 
                onClick={handleGoBack}
                sx={{ 
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    backgroundColor: '#f1f5f9'
                  }
                }}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Add />} 
                onClick={handleOpenDialog}
                sx={{ 
                  backgroundColor: '#3b82f6',
                  boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                    boxShadow: '0 6px 8px rgba(59, 130, 246, 0.4)'
                  }
                }}
              >
                Add Expense Type
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ 
                  backgroundColor: '#3b82f6', 
                  width: 48, 
                  height: 48,
                  boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                }}>
                  <Settings sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
                    Expense Type Management
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6b7280' }}>
                    Organize and manage your expense types with ease
                  </Typography>
                </Box>
              </Box>
              
              <Breadcrumbs 
                aria-label="breadcrumb" 
                sx={{ 
                  '& .MuiBreadcrumbs-separator': { color: '#cbd5e1' },
                  '& .MuiBreadcrumbs-li': { color: '#64748b' }
                }}
              >
                <Link
                  color="inherit"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  sx={{ textDecoration: 'none', '&:hover': { color: '#3b82f6' } }}
                >
                  Settings
                </Link>
                <Typography sx={{ color: '#1f2937', fontWeight: 500 }}>Expense Types</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Expense Types
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {totalExpenseTypes}
                    </Typography>
                  </Box>
                  <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <Assessment sx={{ fontSize: 32 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Active Types
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {activeExpenseTypes}
                    </Typography>
                  </Box>
                  <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <CheckCircle sx={{ fontSize: 32 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Controls */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search expense types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f9fafb',
                    '&:hover': {
                      backgroundColor: '#f3f4f6'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Data Grid */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={filteredExpenseTypes}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: rowsPerPage }
                }
              }}
              pageSizeOptions={[50, 100, 200]}
              onPaginationModelChange={(model) => setRowsPerPage(model.pageSize)}
              getRowId={(row) => row.id}
              slots={{
                toolbar: CustomToolbar,
                noRowsOverlay: () => (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    color: '#9ca3af',
                    gap: 2
                  }}>
                    <Assessment sx={{ fontSize: 48, color: '#d1d5db' }} />
                    <Typography variant="h6" sx={{ color: '#6b7280' }}>
                      No expense types found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                      Try adjusting your search criteria
                    </Typography>
                  </Box>
                ),
              }}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeader .MuiBox-root": {
                  color: "#fff",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                },
                "& .MuiDataGrid-toolbarContainer": {
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                },
              }}
              loading={loading}
            />
          </Box>
        </Paper>

        {/* Add/Edit Expense Type Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          fullWidth 
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <DialogTitle sx={{ 
            p: 4, 
            pb: 2,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                backgroundColor: isEditing ? '#f59e0b' : '#3b82f6',
                width: 40,
                height: 40
              }}>
                {isEditing ? <Edit /> : <Add />}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                  {isEditing ? "Edit Expense Type" : "New Expense Type"}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
                  {isEditing ? "Update the expense type details" : "Create a new expense type for your organization"}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Expense Type Name"
                  fullWidth
                  required
                  value={newExpenseType.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  helperText={errors.name ? "Name is required" : "Enter a descriptive name for the expense type"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: errors.name ? '#fef2f2' : '#f9fafb',
                      '&:hover': {
                        backgroundColor: errors.name ? '#fee2e2' : '#f3f4f6'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={newExpenseType.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description (max 500 characters)"
                  inputProps={{ maxLength: 500 }}
                  helperText={`${newExpenseType.description.length}/500 characters`}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f9fafb',
                      '&:hover': {
                        backgroundColor: '#f3f4f6'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth error={errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={newExpenseType.category || ""} 
                    onChange={handleInputChange}
                    label="Category"
                    disabled={loadingCategories}
                    sx={{
                      backgroundColor: errors.category ? '#fef2f2' : '#f9fafb',
                      '&:hover': {
                        backgroundColor: errors.category ? '#fee2e2' : '#f3f4f6'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    {categories.length === 0 && (
                      <MenuItem value="" disabled>
                        {loadingCategories ? "Loading categories..." : "No categories available"}
                      </MenuItem>
                    )}
                    {categories.map(option => (
                      <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <Typography variant="caption" color="error">
                      Please select a valid category
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          
          <Divider />
          
          <DialogActions sx={{ p: 4, backgroundColor: '#f8fafc' }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{ 
                color: '#6b7280',
                '&:hover': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={loadingCategories || !newExpenseType.name.trim() || !newExpenseType.category}
              sx={{ 
                backgroundColor: isEditing ? '#f59e0b' : '#3b82f6',
                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
                px: 4,
                '&:hover': {
                  backgroundColor: isEditing ? '#d97706' : '#2563eb',
                  boxShadow: '0 6px 8px rgba(59, 130, 246, 0.4)'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#e2e8f0',
                  color: '#9ca3af'
                }
              }}
            >
              {isEditing ? "Update" : "Create"} Expense Type
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}

export default ExpenseTypeSettings
