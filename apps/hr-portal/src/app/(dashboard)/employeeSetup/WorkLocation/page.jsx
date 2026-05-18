"use client"

import {
  Box,
  Container,
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
  CircularProgress,
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
  EditOutlined as EditIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  WorkOutline as WorkIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  CheckCircle as StatusIcon,
} from "@mui/icons-material"

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace"
import LocationOnIcon from "@mui/icons-material/LocationOn"

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

// Empty state component
const NoRowsOverlay = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: 4,
        color: "#666",
      }}
    >
      <WorkIcon sx={{ fontSize: 48, mb: 2, color: "#ccc" }} />
      <Typography variant="h6" gutterBottom>
        No Work Locations Found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        There are currently no work locations to display.
      </Typography>
    </Box>
  )
}

export default function WorkLocation() {
  // States
  const [token, setToken] = useState("")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
  const [workLocations, setWorkLocations] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [isEditMode, setIsEditMode] = useState(false)
  const [editID, setEditId] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [addWorkLocation, setAddWorkLocation] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    branchId: "",
    location: {
      coordinates: ["", ""],
    },
  })

  // Initialize token on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authToken = window.localStorage.getItem("authToken")
      setToken(authToken || "")
    }
  }, [])

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle coordinate changes
  const handleCoordinateChange = (index, value) => {
    const newCoords = [...formData.location.coordinates]
    newCoords[index] = value
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: newCoords,
      },
    }))
  }

  // Format date helper
  const formatDate = (datetimeStr) => {
    if (!datetimeStr) return ""
    try {
      const [date] = datetimeStr.split("T")
      const [year, month, day] = date.split("-")
      return `${day}-${month}-${year}`
    } catch (error) {
      return ""
    }
  }

  // Handle edit action
  const handleEdit = (row) => {
    if (!row) return

    setEditId(row.id || "")
    setFormData({
      name: row.name || "",
      branchId: row.branchId || "",
      location: {
        coordinates: Array.isArray(row.coordinates) ? row.coordinates : ["", ""],
      },
    })
    setIsEditMode(true)
    setAddWorkLocation(true)
  }

  // DataGrid columns definition - Updated to use flex like employee type table
  const columns = [
    {
      field: "name",
      headerName: "Work Location Name",
      flex: 2,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Name of the work location or site">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <WorkIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Work Location Name
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Tooltip title={`Work Location: ${params.value || "N/A"}`} placement="top">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
            <WorkIcon sx={{ fontSize: 16, color: "primary.main" }} />
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {params.value || "N/A"}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "branchName",
      headerName: "Branch Name",
      flex: 1.8,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Associated branch for this work location">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <BusinessIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Branch Name
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Tooltip title={`Branch: ${params.value || "N/A"}`} placement="top">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
            <BusinessIcon sx={{ fontSize: 16, color: "success.main" }} />
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {params.value || "N/A"}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "coordinates",
      headerName: "Location Coordinates",
      flex: 1.5,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Geographic coordinates (Latitude, Longitude)">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <LocationIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Coordinates
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => {
        const coords = params.value
        const coordsText =
          Array.isArray(coords) && coords.length === 2 && coords[0] && coords[1]
            ? `${coords[0]}, ${coords[1]}`
            : "Not set"
        return (
          <Tooltip title={`Coordinates: ${coordsText}`} placement="top">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
              <LocationIcon sx={{ fontSize: 16, color: "info.main" }} />
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {coordsText}
              </Typography>
            </Box>
          </Tooltip>
        )
      },
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1.5,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Date when the work location was created">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <CalendarIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Created Date
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Tooltip title={`Created Date: ${params.value || "N/A"}`} placement="top">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
            <CalendarIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="body2">{params.value || "N/A"}</Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Current status of the work location">
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
      flex: 1.2,
      minWidth: 140,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Tooltip title="Available actions for this work location">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <SettingsIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Actions
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => {
        const isActive = params.row.isActive

        return (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: "100%", justifyContent: "center", px: 1 }}>
            <Tooltip title="Edit work location details" placement="top">
              <Button
                variant="contained"
                size="small"
                sx={{
                  minWidth: "auto",
                  width: 32,
                  height: 32,
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
                <EditIcon sx={{ fontSize: 14 }} />
              </Button>
            </Tooltip>
            <Tooltip title={isActive ? "Deactivate this work location" : "Activate this work location"} placement="top">
              <Button
                variant="contained"
                size="small"
                sx={{
                  minWidth: "auto",
                  width: 32,
                  height: 32,
                  p: 0,
                  background: isActive
                    ? "linear-gradient(135deg, #f44336, #d32f2f)"
                    : "linear-gradient(135deg, #4caf50, #388e3c)",
                  color: "white",
                  borderRadius: "50%",
                  boxShadow: isActive ? "0 3px 8px rgba(244, 67, 54, 0.3)" : "0 3px 8px rgba(76, 175, 80, 0.3)",
                  "&:hover": {
                    background: isActive
                      ? "linear-gradient(135deg, #d32f2f, #c62828)"
                      : "linear-gradient(135deg, #388e3c, #2e7d32)",
                    boxShadow: isActive ? "0 4px 12px rgba(244, 67, 54, 0.4)" : "0 4px 12px rgba(76, 175, 80, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(params.row.id, !isActive)
                }}
              >
                {isActive ? <ToggleOffIcon sx={{ fontSize: 14 }} /> : <ToggleOnIcon sx={{ fontSize: 14 }} />}
              </Button>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  // Fetch branches
  const getBranch = async () => {
    if (!token) return

    try {
      const res = await axios.get(`${baseUrl}/v1/api/branch/getList`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      // Handle empty or invalid response
      if (res.data && res.data.items && Array.isArray(res.data.items)) {
        setBranches(res.data.items)
      } else {
        setBranches([])
      }
    } catch (error) {
      console.error("Error fetching branches:", error)
      setBranches([])
      setSnackbar({
        message: "Error fetching branches",
        severity: "error",
        open: true,
      })
    }
  }

  // Handle status toggle
  const handleDelete = async (id, checked) => {
    if (!token || !id) return

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/workLocation/toggleStatus/${id}`,
        {
          isActive: checked,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if (res.data && res.data.status) {
        setSnackbar({
          message: "Status updated successfully",
          severity: "success",
          open: true,
        })
        getAllWorkLocations()
      }
    } catch (error) {
      console.error("Error updating status:", error)
      setSnackbar({
        message: "Error updating status",
        severity: "error",
        open: true,
      })
    }
  }

  // Fetch all work locations
  const getAllWorkLocations = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await axios.get(`${baseUrl}/v1/api/workLocation/getAll`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      if (res.data && res.data.status && res.data.items && Array.isArray(res.data.items)) {
        const formatted = res.data.items.map((item) => ({
          id: item._id || "",
          name: item.name || "",
          branchName: item.branchId?.name || "-",
          status: item.status || "",
          branchId: item.branchId?._id || "",
          isActive: Boolean(item.isActive),
          coordinates: Array.isArray(item.location?.coordinates) ? item.location.coordinates : [],
          createdAt: formatDate(item.createdAt),
          updatedAt: formatDate(item.updatedAt),
        }))
        setWorkLocations(formatted)
      } else {
        // Set empty array if no valid data
        setWorkLocations([])
      }
    } catch (error) {
      console.error("Error fetching work locations:", error)
      setWorkLocations([])
      setSnackbar({
        message: "Error fetching work locations",
        severity: "error",
        open: true,
      })
    } finally {
      setLoading(false)
    }
  }

  // Load data when token is available
  useEffect(() => {
    if (token) {
      getAllWorkLocations()
      getBranch()
    }
  }, [token])

  // Handle form submission
  const handleSubmit = async () => {
    if (!token) return

    try {
      if (isEditMode && editID) {
        const res = await axios.post(
          `${baseUrl}/v1/api/workLocation/update`,
          {
            ...formData,
            Id: editID,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
          },
        )
        if (res.data && res.data.status) {
          setSnackbar({
            message: "Work location updated successfully",
            severity: "success",
            open: true,
          })
        }
      } else {
        const res = await axios.post(`${baseUrl}/v1/api/workLocation/add`, formData, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })
        if (res.data && res.data.status) {
          setSnackbar({
            message: "Work location added successfully",
            severity: "success",
            open: true,
          })
        }
      }
      getAllWorkLocations()
      setAddWorkLocation(false)
      setFormData({
        name: "",
        branchId: "",
        location: {
          coordinates: ["", ""],
        },
      })
      setEditId("")
      setIsEditMode(false)
    } catch (error) {
      console.error("Error saving work location:", error)
      setSnackbar({
        message: "Error saving work location",
        severity: "error",
        open: true,
      })
    }
  }

  // Reset form
  const resetForm = () => {
    setAddWorkLocation(false)
    setEditId("")
    setIsEditMode(false)
    setFormData({
      name: "",
      branchId: "",
      location: {
        coordinates: ["", ""],
      },
    })
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        maxWidth: "100vw !important",
        px: { xs: 1, sm: 2, md: 3 },
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LocationOnIcon sx={{ fontSize: 30, color: "white" }} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: "white", mb: 0.5 }}>
                Work Location Management
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="white"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setAddWorkLocation(true)}
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              }}
            >
              Add Work Location
            </Button>
            <Button
              sx={{ borderRadius: "25px" }}
              color="white"
              variant="outlined"
              onClick={() => router.push("/employeeSetup")}
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
          width: "100%",
          overflow: "hidden",
          maxWidth: "100%",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={workLocations || []}
            columns={columns}
            loading={loading}
            pagination
            getRowId={(row) => row.id || Math.random().toString()}
            paginationModel={{ page, pageSize: rowsPerPage }}
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page)
              setRowsPerPage(pageSize)
            }}
            rowCount={workLocations.length}
            pageSizeOptions={[5, 10, 20, 50]}
            disableRowSelectionOnClick
            disableColumnResize
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: NoRowsOverlay,
            }}
            sx={{
              width: "100%",
              overflow: "hidden",
              "& .MuiDataGrid-main": {
                overflow: "hidden",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflow: "hidden auto",
              },
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
                overflow: "hidden",
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
        )}
      </Paper>

      {/* Add/Edit Work Location Modal */}
      <Dialog open={addWorkLocation} onClose={resetForm} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 18, fontWeight: 600 }}>
          <WorkIcon color="primary" />
          {isEditMode ? "Edit Work Location" : "Add New Work Location"}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Form Header */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: "#f8f9fa", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                Work Location Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fill in the details below to {isEditMode ? "update" : "create"} a work location
              </Typography>
            </Box>

            {/* Basic Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <WorkIcon color="primary" sx={{ fontSize: 20 }} />
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Work Location Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Branch</InputLabel>
                    <Select
                      name="branchId"
                      value={formData.branchId}
                      onChange={handleChange}
                      label="Branch"
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      {Array.isArray(branches) && branches.length > 0 ? (
                        branches.map((branch, index) => (
                          <MenuItem key={branch._id || index} value={branch._id || ""}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <BusinessIcon sx={{ fontSize: 16, color: "primary.main" }} />
                              {branch.name || "Unnamed Branch"}
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          <Typography variant="body2" color="text.secondary">
                            No branches available
                          </Typography>
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Coordinates Section */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <LocationIcon color="primary" sx={{ fontSize: 20 }} />
                Geographic Coordinates
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Latitude"
                    value={formData.location.coordinates[0] || ""}
                    onChange={(e) => handleCoordinateChange(0, e.target.value)}
                    placeholder="e.g., 19.0760"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Longitude"
                    value={formData.location.coordinates[1] || ""}
                    onChange={(e) => handleCoordinateChange(1, e.target.value)}
                    placeholder="e.g., 72.8777"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#f8f9fa", borderTop: "1px solid #e0e0e0" }}>
          <Button
            variant="outlined"
            onClick={resetForm}
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
            {isEditMode ? "Update Work Location" : "Create Work Location"}
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
