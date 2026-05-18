"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Dialog, 
  Grid, 
  CircularProgress, 
  Alert, 
  Snackbar,
  Card,
  CardContent,
  Chip,
  Avatar,
  Fade,
  Grow
} from "@mui/material"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid"
import {
  Add,
  AirplanemodeActive,
  DirectionsCar,
  LocalGasStation,
  Computer,
  Work,
  AttachMoney,
  Restaurant,
  ShoppingCart,
  MoreHoriz,
  LocalParking,
  Engineering,
  Call,
  MonetizationOn,
  ArrowBack,
  Edit,
  Category,
  Refresh,
  TrendingUp,
  Assessment,
  AutoAwesome,
  Palette,
} from "@mui/icons-material"
import AddCategoryForm from "./addCategoryForm"
import { fetchAllCategories } from "../../api/category-service"

// Map of icon names to icon components with light colors
const iconMap = {
  ShoppingCart: { icon: ShoppingCart, color: '#E8F5E8', iconColor: '#4CAF50' },
  AirplanemodeActive: { icon: AirplanemodeActive, color: '#E3F2FD', iconColor: '#2196F3' },
  AttachMoney: { icon: AttachMoney, color: '#FFF3E0', iconColor: '#FF9800' },
  Computer: { icon: Computer, color: '#F3E5F5', iconColor: '#9C27B0' },
  DirectionsCar: { icon: DirectionsCar, color: '#FFEBEE', iconColor: '#F44336' },
  LocalGasStation: { icon: LocalGasStation, color: '#E0F2F1', iconColor: '#009688' },
  Work: { icon: Work, color: '#FFF8E1', iconColor: '#FFC107' },
  Restaurant: { icon: Restaurant, color: '#FCE4EC', iconColor: '#E91E63' },
  MoreHoriz: { icon: MoreHoriz, color: '#F1F8E9', iconColor: '#8BC34A' },
  LocalParking: { icon: LocalParking, color: '#E8EAF6', iconColor: '#3F51B5' },
  Engineering: { icon: Engineering, color: '#EFEBE9', iconColor: '#795548' },
  Call: { icon: Call, color: '#E1F5FE', iconColor: '#03A9F4' },
  MonetizationOn: { icon: MonetizationOn, color: '#E8F5E8', iconColor: '#4CAF50' },
}

// Get icon component by name or return default
const getIconByName = (iconName) => {
  return iconMap[iconName] || { icon: ShoppingCart, color: '#E8F5E8', iconColor: '#4CAF50' }
}

const CategorySettings = () => {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllCategories()
      const formattedCategories = data.map((category) => ({
        id: category._id, 
        name: category.name,
        accountCode: category.accountCode || "",
        description: category.description || "",
        parentCategory: category.parentCategory || null,
        isSubCategory: category.isSubCategory || "false",
      }))

      setCategories(formattedCategories)
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("Failed to load categories. Please try again.")
      showSnackbar("Failed to load categories. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingCategory(null)
  }

  const handleSaveCategory = (categoryData) => {
    fetchCategories()
    handleCloseDialog()
    showSnackbar("Category saved successfully!", "success")
  }

  const handleDelete = (id) => {
    setCategories(categories.filter((category) => category.id !== id))
    showSnackbar("Category deleted successfully!", "success")
  }

  const handleNavigateToExpenseType = () => {
    if (router) {
      router.push("/expenseTypeSettings")
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const columns = [
    { 
      field: "name", 
      headerName: "Category Name", 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: getIconByName(params.row.name).color,
              color: getIconByName(params.row.name).iconColor,
            }}
          >
            {React.createElement(getIconByName(params.row.name).icon, { fontSize: 'small' })}
          </Avatar>
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: "accountCode", 
      headerName: "Account Code", 
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value || 'N/A'}
          size="small"
          variant="outlined"
          sx={{
            borderColor: '#E0E7FF',
            color: '#6366F1',
            bgcolor: '#F8FAFF',
            fontWeight: 500,
          }}
        />
      )
    },
    { 
      field: "description", 
      headerName: "Description", 
      flex: 2,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {params.value || 'No description available'}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<Edit />}
          onClick={() => handleOpenDialog(params.row)}
          sx={{
            bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            "&:hover": { 
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            },
            textTransform: "none",
            borderRadius: "10px",
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Edit
        </Button>
      ),
    },
  ]

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ 
        p: 2, 
        bgcolor: '#FAFBFF', 
        borderRadius: '12px 12px 0 0',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <GridToolbarColumnsButton 
            sx={{ 
              color: '#6366F1',
              '&:hover': { bgcolor: '#F0F4FF' },
              borderRadius: '8px',
            }}
          />
          <GridToolbarDensitySelector 
            sx={{ 
              color: '#6366F1',
              '&:hover': { bgcolor: '#F0F4FF' },
              borderRadius: '8px',
            }}
          />
          <GridToolbarExport
            csvOptions={{
              disableToolbarButton: false 
            }}
            printOptions={{
              disableToolbarButton: true 
            }}
            sx={{ 
              color: '#6366F1',
              '&:hover': { bgcolor: '#F0F4FF' },
              borderRadius: '8px',
            }}
          />
          <GridToolbarFilterButton 
            sx={{ 
              color: '#6366F1',
              '&:hover': { bgcolor: '#F0F4FF' },
              borderRadius: '8px',
            }}
          />
        </Box>
      </GridToolbarContainer>
    )
  }

  return (
    <Box sx={{ 
      bgcolor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: "100vh", 
      p: 3 
    }}>
      <Fade in timeout={500}>
        <Box>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{
              mb: 3,
              color: '#6366F1',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              "&:hover": { 
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                transform: 'translateX(-2px)',
              },
              textTransform: "none",
              fontWeight: 500,
              borderRadius: '12px',
              px: 3,
              py: 1,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Back to Dashboard
          </Button>

          {/* Header Card */}
          <Grow in timeout={700}>
            <Card sx={{ 
              mb: 3, 
              borderRadius: "20px", 
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        width: 56, 
                        height: 56 
                      }}>
                        <Category sx={{ fontSize: '2rem' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" component="h1" sx={{ 
                          fontWeight: 700, 
                          color: '#1F2937',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                          Category Management
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                          Organize and manage your expense categories with ease
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Stats Cards */}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6} sm={3}>
                        <Paper sx={{ 
                          p: 2, 
                          borderRadius: '12px',
                          bgcolor: '#FEF3C7',
                          border: '1px solid #FDE68A',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp sx={{ color: '#D97706', fontSize: '1.2rem' }} />
                            <Typography variant="h6" sx={{ color: '#92400E', fontWeight: 600 }}>
                              {categories.length}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#A16207' }}>
                            Total Categories
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Paper sx={{ 
                          p: 2, 
                          borderRadius: '12px',
                          bgcolor: '#DBEAFE',
                          border: '1px solid #BFDBFE',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Assessment sx={{ color: '#1D4ED8', fontSize: '1.2rem' }} />
                            <Typography variant="h6" sx={{ color: '#1E3A8A', fontWeight: 600 }}>
                              {categories.filter(c => c.isSubCategory === 'true').length}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#1E40AF' }}>
                            Sub Categories
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          "&:hover": { 
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                          },
                          textTransform: "none",
                          borderRadius: "12px",
                          px: 3,
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        Add Category
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchCategories}
                        sx={{
                          color: '#6366F1',
                          borderColor: '#6366F1',
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          "&:hover": { 
                            borderColor: '#4F46E5',
                            bgcolor: 'rgba(99, 102, 241, 0.05)',
                            transform: 'translateY(-2px)',
                          },
                          textTransform: "none",
                          borderRadius: "12px",
                          px: 3,
                          py: 1.5,
                          fontWeight: 600,
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        Refresh
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>

          {/* Main Content Card */}
          <Grow in timeout={900}>
            <Card sx={{ 
              borderRadius: "20px", 
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'hidden',
            }}>
              <CardContent sx={{ p: 0 }}>
                {/* Error message */}
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      m: 3, 
                      borderRadius: "12px",
                      bgcolor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      '& .MuiAlert-icon': { color: '#DC2626' },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Data Grid */}
                <Box sx={{ height: 600, width: "100%" }}>
                  {loading ? (
                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: 'column',
                      justifyContent: "center", 
                      alignItems: "center", 
                      height: "100%",
                      gap: 2,
                    }}>
                      <CircularProgress 
                        sx={{ 
                          color: '#6366F1',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          }
                        }} 
                        size={48}
                      />
                      <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                        Loading categories...
                      </Typography>
                    </Box>
                  ) : (
                    <DataGrid
                      rows={categories}
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
                            gap: 2,
                            color: 'text.secondary',
                          }}>
                            <AutoAwesome sx={{ fontSize: '3rem', color: '#D1D5DB' }} />
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                              No categories found
                            </Typography>
                            <Typography variant="body2">
                              Get started by creating your first category
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
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grow>

          {/* Category Form Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
              },
            }}
          >
            <AddCategoryForm
              open={openDialog}
              onClose={handleCloseDialog}
              onSave={handleSaveCategory}
              categories={categories}
              editCategory={editingCategory}
            />
          </Dialog>

          {/* Enhanced Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 500,
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Box>
  )
}

export default CategorySettings