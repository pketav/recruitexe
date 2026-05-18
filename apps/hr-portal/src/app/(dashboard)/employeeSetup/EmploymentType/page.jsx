"use client"

import {
  Container,
  Box,
  IconButton,
  Button,
  Switch,
  Typography,
  Modal,
  Snackbar,
  Alert,
  TextField,
  Grid,
  Tooltip,
  Paper,
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
import EditIcon from "@mui/icons-material/Edit"
import {
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Add,
  KeyboardBackspace,
} from "@mui/icons-material"
import WorkHistoryIcon from "@mui/icons-material/WorkHistory"

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

export default function EmploymentType() {
  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [employeeType, setEmployeeType] = useState([])
  const router = useRouter()
  const [addDesignation, setAddDesignation] = useState(false)
  const [typeTitle, settypeTitle] = useState({ name: "" })
  const [editDesignation, setEditDesignation] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const getemployeeType = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/employmentType/getAllListEmploymentType`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const formatted = res.data.items.map((item) => ({
        id: item._id,
        name: item.title,
        createdAt: item.createdAt || "-",
        status: item.status === "active" ? true : false,
      }))

      setEmployeeType(formatted)

      // Add success snackbar for data loading
      // setSnackbar({
      //   severity: "success",
      //   open: true,
      //   message: "Employment types loaded successfully",
      // })
    } catch (error) {
      console.error("error", error)
      // Add error snackbar for failed data loading
      setSnackbar({
        severity: "error",
        open: true,
        message: "Failed to load employment types. Please try again.",
      })
    }
  }

  useEffect(() => {
    // Load data without showing success message on initial load
    const loadInitialData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/v1/api/employmentType/getAllListEmploymentType`, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })

        const formatted = res.data.items.map((item) => ({
          id: item._id,
          name: item.title,
          createdAt: item.createdAt || "-",
          status: item.status === "active" ? true : false,
        }))

        setEmployeeType(formatted)
      } catch (error) {
        console.error("error", error)
        setSnackbar({
          severity: "error",
          open: true,
          message: "Failed to load employment types. Please refresh the page.",
        })
      }
    }

    loadInitialData()
  }, [])

  const handleDelete = async (id, checked) => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/employmentType/activeOrInactive`,
        {
          id: id,
          status: checked ? "active" : "inactive",
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if (res.data.status === true) {
        setSnackbar({
          severity: "success",
          open: true,
          message: res.data.message || `Employment type ${checked ? "activated" : "deactivated"} successfully`,
        })
        getemployeeType()
      } else {
        setSnackbar({
          severity: "error",
          open: true,
          message: res.data.message || "Failed to update employment type status",
        })
      }
    } catch (error) {
      console.error("error", error)
      setSnackbar({
        severity: "error",
        open: true,
        message: "Network error. Please check your connection and try again.",
      })
    }
  }
  const [editData, setEditData] = useState({})
  const handleEdit = (row) => {
    setEditData({
      employementTypeId: row.id,
      name: row.name,
    })
    setEditDesignation(true)
  }

  const columns = [
    {
      field: "name",
      headerName: "Employment Type",
      flex: 1.5,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: true,
      renderHeader: () => (
        <Tooltip title="Type of work arrangement or employment mode">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <WorkIcon sx={{ fontSize: 14, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Employment Type
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Tooltip title={`Employment Type: ${params.value}`} placement="top">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, overflow: "hidden" }}>
            <WorkIcon sx={{ fontSize: 14, color: "primary.main", flexShrink: 0 }} />
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {params.value}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Creation Date",
      flex: 1.2,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      sortable: true,
      renderHeader: () => (
        <Tooltip title="Date when the employment type was created">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <CalendarIcon sx={{ fontSize: 14, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Creation Date
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => {
        const dateStr = params.row?.createdAt
        if (!dateStr) return "-"
        const date = new Date(dateStr)
        const formattedDate = isNaN(date.getTime())
          ? "-"
          : date.toLocaleString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
        return (
          <Tooltip title={`Created Date: ${formattedDate}`} placement="top">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, overflow: "hidden" }}>
              <CalendarIcon sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }} />
              <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {formattedDate}
              </Typography>
            </Box>
          </Tooltip>
        )
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Tooltip title="Available actions for this employment type">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <SettingsIcon sx={{ fontSize: 14, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Actions
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => {
        const isActive = params.row.status
        return (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "center", px: 1 }}>
            <Tooltip title="Edit employment type" placement="top">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleEdit(params.row)}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.2)",
                  },
                }}
              >
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={isActive ? "Deactivate" : "Activate"} placement="top">
              <Switch
                checked={params.row.status}
                onChange={(e) => handleDelete(params.row.id, e.target.checked)}
                color="primary"
                size="small"
              />
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/employmentType/employmentTypeAdd`,
        {
          title: typeTitle.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if (res.data.status) {
        getemployeeType()
        setAddDesignation(false)
        settypeTitle({ name: "" })
        setSnackbar({
          severity: "success",
          open: true,
          message: res.data.message || "Employment type added successfully",
        })
      } else {
        setSnackbar({
          severity: "error",
          open: true,
          message: res.data.message || "Failed to add employment type",
        })
      }
    } catch (error) {
      setSnackbar({
        severity: "error",
        open: true,
        message: "Network error. Please check your connection and try again.",
      })
      console.error("error", error)
    }
  }

  const handleSubmitEdit = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/employmentType/updateEmploymentType`,
        {
          employementTypeId: editData.employementTypeId,
          title: editData.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )

      if (res.data.status) {
        setSnackbar({
          severity: "success",
          open: true,
          message: res.data.message || "Employment type updated successfully",
        })
        getemployeeType()
        setEditDesignation(false)
        setEditData({})
      } else {
        setSnackbar({
          severity: "error",
          open: true,
          message: res.data.message || "Failed to update employment type",
        })
      }
    } catch (error) {
      console.error("error", error)
      setSnackbar({
        severity: "error",
        open: true,
        message: "Network error. Please check your connection and try again.",
      })
    }
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        maxWidth: "100vw !important",
        overflow: "hidden",
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
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
              {/* <DashboardIcon sx={{ fontSize: 40, color: "white" }} /> */}
              <WorkHistoryIcon sx={{ fontSize: 30, color: "white" }} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: "white", mb: 0.5 }}>
                Employment Type Management
              </Typography>
              {/* <Tooltip title='Employment categories that define the nature of work relationship (e.g., Full-time, Part-time, Contract, Intern)'>
                <InfoOutlinedIcon sx={{ color: '#ffffff', fontSize: 24, cursor: 'pointer' }} />
              </Tooltip> */}
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="white"
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setAddDesignation(true)}
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              }}
            >
              Add Employment Type
            </Button>
            {/* <Button variant="outlined" startIcon={<RefreshIcon />} onClick={getOrganizations} disabled={loading}>
                                    Refresh
                                  </Button> */}
            <Button
              sx={{ borderRadius: "25px" }}
              color="white"
              variant="outlined"
              onClick={() => router.push("/employeeSetup")}
            >
              <KeyboardBackspace />
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Enhanced DataGrid */}
      <Paper sx={{ p: 2, overflow: "hidden", maxWidth: "100%" }}>
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <DataGrid
            rows={employeeType}
            columns={columns}
            paginationModel={{ page: 0, pageSize: 10 }}
            pageSizeOptions={[5, 10, 20, 50]}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            disableColumnResize
            slots={{
              toolbar: CustomToolbar,
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
        </Box>
      </Paper>

      {/* Add Modal */}
      <Modal
        open={addDesignation}
        onClose={() => {
          setAddDesignation(false)
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            gap: 2,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography fontSize={16} fontWeight={500}>
                Add Employment Type
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employment Type"
                name="name"
                size="small"
                value={typeTitle.name}
                onChange={(e) =>
                  settypeTitle((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                fullWidth
                required
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required size="small">
                <InputLabel>Punch Outside Branch</InputLabel>
                <Select
                  name="punchOutsideBranch"
                  value={typeTitle.punchOutsideBranch}
                  onChange={(e) =>
                    settypeTitle((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  label="Office Type"
                >
                  <MenuItem value="allowed">Allowed</MenuItem>
                  <MenuItem value="notAllowed">Non Allowed</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}

            <Grid item xs={12} sx={{ display: "flex", gap: 3, justifyContent: "flex-end" }}>
              <Button variant="outlined" color="secondary" onClick={() => setAddDesignation(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editDesignation}
        onClose={() => {
          setEditDesignation(false)
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            gap: 2,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography fontSize={16} fontWeight={500}>
                Edit Designation
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employment Type"
                name="name"
                size="small"
                value={editData.name}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                fullWidth
                required
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required size="small">
                <InputLabel>Punch Outside Branch</InputLabel>
                <Select
                  name="punchOutsideBranch"
                  value={editData.punchOutsideBranch}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  label="Office Type"
                >
                  <MenuItem value="allowed">Allowed</MenuItem>
                  <MenuItem value="notAllowed">Non Allowed</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}

            <Grid item xs={12} sx={{ display: "flex", gap: 3, justifyContent: "flex-end" }}>
              <Button variant="outlined" color="secondary" onClick={() => setEditDesignation(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" onClick={handleSubmitEdit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

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
