"use client"

import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Tooltip,
  Select,
  MenuItem,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid"
import { useRouter } from "next/navigation"
import {
  InfoOutlined as InfoOutlinedIcon,
  EditOutlined as EditIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as StatusIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{ p: 1, gap: 1 }}>
      <GridToolbarColumnsButton startIcon={<ViewColumnIcon />} sx={{ color: "primary.main" }} />
      <GridToolbarFilterButton startIcon={<FilterIcon />} sx={{ color: "primary.main" }} />
      <GridToolbarDensitySelector startIcon={<SettingsIcon />} sx={{ color: "primary.main" }} />
      <GridToolbarExport
        startIcon={<DownloadIcon />}
        sx={{ color: "primary.main" }}
        csvOptions={{
          disableToolbarButton: false,
        }}
        printOptions={{
          disableToolbarButton: true,
        }}
      />
    </GridToolbarContainer>
  )
}

export default function Qualification() {
  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [qualifications, setQualifications] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  const [addQualification, setAddQualification] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const [editData, setEditData] = useState({
    name: "",
    isActive: "",
  })

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const formatDate = (datetimeStr) => {
    if (!datetimeStr) return ""
    const date = new Date(datetimeStr)
    return isNaN(date.getTime())
      ? "-"
      : date.toLocaleString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
  }

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditData({
      name: row.name || "",
      isActive: row.isActive ? "true" : "false",
    })
    setIsEditMode(true)
    setAddQualification(true)
  }

  const columns = [
    {
      field: "name",
      headerName: "Qualification Name",
      width: 340,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Name of the qualification or educational degree">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <SchoolIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Qualification Name
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Tooltip title={`Qualification: ${params.value}`} placement="top">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SchoolIcon sx={{ fontSize: 16, color: "primary.main" }} />
            <Typography variant="body2" fontWeight={500}>
              {params.value}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 280,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Date when the qualification was created">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <CalendarIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Created Date
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Tooltip title={`Created Date: ${params.value}`} placement="top">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 220,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Current status of the qualification">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <StatusIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Status
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => {
        const isActive = params.row.isActive
        const statusColor = isActive ? "success" : "error"
        const statusLabel = isActive ? "Active" : "Inactive"

        return (
          <Tooltip title={`Current Status: ${statusLabel}`} placement="top">
            <Chip
              label={statusLabel}
              color={statusColor}
              sx={{
                borderRadius: "20px",
                fontSize: "0.75rem",
                height: 28,
                minWidth: 70,
                fontWeight: 600,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </Tooltip>
        )
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      headerAlign: "center",
      renderHeader: () => (
        <Tooltip title="Available actions for this qualification">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <SettingsIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Actions
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: "100%", justifyContent: "center" }}>
            <Tooltip title="Edit qualification details" placement="top">
              <Button
                variant="contained"
                size="small"
                sx={{
                  minWidth: "auto",
                  width: 36,
                  height: 36,
                  p: 0,
                  background: "linear-gradient(135deg, #00bcd4, #0097a7)",
                  color: "white",
                  borderRadius: "50%",
                  boxShadow: "0 3px 8px rgba(0, 188, 212, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0097a7, #00838f)",
                    boxShadow: "0 4px 12px rgba(0, 188, 212, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit(params.row)
                }}
              >
                <EditIcon sx={{ fontSize: 16 }} />
              </Button>
            </Tooltip>
            <Tooltip title="Delete this qualification" placement="top">
              <Button
                variant="contained"
                size="small"
                sx={{
                  minWidth: "auto",
                  width: 36,
                  height: 36,
                  p: 0,
                  background: "linear-gradient(135deg, #f44336, #d32f2f)",
                  color: "white",
                  borderRadius: "50%",
                  boxShadow: "0 3px 8px rgba(244, 67, 54, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #d32f2f, #c62828)",
                    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(params.row.id, params.row.name)
                }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </Button>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const getQualifications = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${baseUrl}/v1/api/qualification/getAllQualifications`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      if (res.data.items) {
        const formatted = res.data.items.map((item) => ({
          id: item._id,
          name: item.name,
          isActive: item.isActive !== false, // Default to true if not specified
          createdAt: formatDate(item.createdAt),
        }))
        setQualifications(formatted)
        setTotalItems(formatted.length)
      }
    } catch (error) {
      console.error("Error fetching qualifications:", error)
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to fetch qualifications",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getQualifications()
  }, [])

  const handleDelete = async (id, name) => {
    try {
      await axios.post(
        `${baseUrl}/v1/api/qualification/deleteQualification/${id}`,
        {
          name: name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      setSnackbar({
        open: true,
        severity: "success",
        message: "Qualification deleted successfully",
      })
      getQualifications()
    } catch (error) {
      console.error("Error deleting qualification:", error)
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error deleting qualification",
      })
    }
  }

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.post(
          `${baseUrl}/v1/api/qualification/updateQualification/${editId}`,
          {
            name: editData.name,
            status: editData.isActive,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
          },
        )
        setSnackbar({
          open: true,
          severity: "success",
          message: "Qualification updated successfully",
        })
      } else {
        await axios.post(
          `${baseUrl}/v1/api/qualification/createQualification`,
          {
            name: editData.name,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
          },
        )
        setSnackbar({
          open: true,
          severity: "success",
          message: "Qualification created successfully",
        })
      }

      getQualifications()
      setAddQualification(false)
      setEditId(null)
      setEditData({ name: "", isActive: "" })
      setIsEditMode(false)
    } catch (error) {
      console.error("Error saving qualification:", error)
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error saving qualification",
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Container maxWidth="xl">
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
              <SchoolIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant='h4' fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
                Qualification Management
              </Typography>
              <Tooltip title='Manage educational qualifications and degrees that can be assigned to employees.'>
                <InfoOutlinedIcon sx={{ color: '#ffffff', fontSize: 24, cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
            color="white"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setAddQualification(true)}
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              }}
            >
              Add Qualification
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
      <Paper sx={{ p: 2 }}>
        <DataGrid
          rows={qualifications}
          columns={columns}
          loading={loading}
          pagination
          getRowId={(row) => row.id}
          paginationModel={{ page, pageSize: rowsPerPage }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPage(page)
            setRowsPerPage(pageSize)
          }}
          rowCount={totalItems}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          slots={{
            toolbar: CustomToolbar,
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: 600,
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1976d2",
              color: "#fff",
              borderRight: "none",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              color: "#fff",
            },
            "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
              color: "#fff",
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid rgba(224, 224, 224, 1)",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
                cursor: "pointer",
              },
            },
            "& .MuiDataGrid-toolbarContainer": {
              padding: "12px",
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #e0e0e0",
            },
          }}
        />
      </Paper>

      {/* Add/Edit Qualification Modal */}
      <Dialog
        open={addQualification}
        onClose={() => {
          setAddQualification(false)
          setEditId(null)
          setIsEditMode(false)
          setEditData({
            name: "",
            isActive: "",
          })
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 18, fontWeight: 600 }}>
          <SchoolIcon color="primary" />
          {isEditMode ? "Edit Qualification" : "Add New Qualification"}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Form Header */}
            {/* <Box sx={{ mb: 3, p: 2, backgroundColor: "#f8f9fa", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                Qualification Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fill in the details below to {isEditMode ? "update" : "create"} a qualification
              </Typography>
            </Box> */}

            {/* Basic Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <SchoolIcon color="primary" sx={{ fontSize: 20 }} />
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Qualification Name"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                {isEditMode && (
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" required size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="isActive"
                        value={editData.isActive}
                        onChange={handleChange}
                        label="Status"
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        <MenuItem value="true">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <StatusIcon sx={{ fontSize: 16, color: "success.main" }} />
                            Active
                          </Box>
                        </MenuItem>
                        <MenuItem value="false">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <StatusIcon sx={{ fontSize: 16, color: "error.main" }} />
                            Inactive
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#f8f9fa", borderTop: "1px solid #e0e0e0" }}>
          <Button
            variant="outlined"
            onClick={() => {
              setAddQualification(false)
              setEditId(null)
              setIsEditMode(false)
              setEditData({
                name: "",
                isActive: "",
              })
            }}
            sx={{
              borderRadius: "25px",
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              borderColor: "#d0d0d0",
              color: "#666",
              "&:hover": {
                borderColor: "#999",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              borderRadius: "25px",
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              background: "linear-gradient(135deg, #1976d2, #1565c0)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0, #0d47a1)",
                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
            startIcon={isEditMode ? <EditIcon /> : <AddIcon />}
          >
            {isEditMode ? "Update Qualification" : "Create Qualification"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
