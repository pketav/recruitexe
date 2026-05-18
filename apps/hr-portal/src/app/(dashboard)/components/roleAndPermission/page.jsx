"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Paper, Button, CircularProgress, Alert, Snackbar, Chip, Divider } from "@mui/material"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid"
import { Add, ArrowBack, Refresh, Assignment } from "@mui/icons-material"
import AddRolePermissionForm from "./addRolePermissionForm"
import { rolePermissionService } from "../../api/rolePermission-service"

// Custom toolbar for DataGrid
const CustomToolbar = () => (
  <GridToolbarContainer sx={{ p: 2, backgroundColor: "#f8f9fa", borderRadius: "8px 8px 0 0" }}>
    <GridToolbarColumnsButton sx={{ color: "#7c4dff" }} />
    <GridToolbarDensitySelector sx={{ color: "#7c4dff" }} />
    <GridToolbarExport
      csvOptions={{ disableToolbarButton: false }}
      printOptions={{ disableToolbarButton: true }}
      sx={{ color: "#7c4dff" }}
    />
    <GridToolbarFilterButton sx={{ color: "#7c4dff" }} />
  </GridToolbarContainer>
)

const RoleAndPermission = () => {
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const [roleAssignments, setRoleAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" })
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState(null)

  const handleGoBack = () => {
    router.back()
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  // Transform the API response to match our component structure
  const transformRoleAssignmentsData = (data) => {
    console.log("check  transform function", data)
    if (!data || !data.items || !Array.isArray(data.items)) {
      console.error("Invalid role assignments data:", data)
      return []
    }

    const safeString = (value) => {
      if (typeof value === "string") return value
      if (typeof value === "object" && value !== null) {
        return value.name || value._id || value.toString() || "Unknown"
      }
      return String(value || "Unknown")
    }

    const getEmployeeInfo = (employee) => ({
      id: safeString(employee?._id),
      name: safeString(employee?.employeName),
      email: safeString(employee?.email),
    })

    const getDepartmentName = (department) => {
      if (!department) return "Unknown"

      // If department is an array, map through and get names
      if (Array.isArray(department)) {
        return department
          .map((dept) => {
            if (typeof dept === "object" && dept !== null) {
              return dept.name || dept._id || "Unknown"
            }
            return safeString(dept)
          })
          .join(", ")
      }

      // Handle single department object
      if (typeof department === "object" && department !== null) {
        return department.name || department._id || "Unknown"
      }

      return safeString(department)
    }

    const transformedData = data.items.flatMap((item) => {
      const assignments = []

      // Get the top-level departments (IT, HR) as fallback
      const topLevelDepartments = getDepartmentName(item.departmentId)

      // Role Approver
      if (item.roleApprover) {
        Object.entries(item.roleApprover).forEach(([levelKey, levelData]) => {
          const level = levelData?.level || levelKey

          // Handle employeeId
          if (levelData?.employeeId) {
            // Check if employeeId is an array
            const employeeIds = Array.isArray(levelData.employeeId) ? levelData.employeeId : [levelData.employeeId]

            employeeIds.forEach((emp, index) => {
              const empInfo = getEmployeeInfo(emp)

              // Get department from employee's departmentId first, then fallback to top-level
              let deptName = "Unknown"
              if (emp?.departmentId) {
                deptName = getDepartmentName(emp.departmentId)
              } else {
                deptName = topLevelDepartments
              }

              assignments.push({
                id: `${item._id}_approver_${level}_${index}`,
                employeeId: empInfo.id,
                employeeName: empInfo.name,
                email: empInfo.email,
                department: deptName,
                level: level,
                role: "Approver",
                isActive: true,
                expenseType: Array.isArray(item.expenseType)
                  ? item.expenseType.map((et) => safeString(et.name || et)).join(", ")
                  : safeString(item.expenseType),
                fromWhere: safeString(item.fromWhere),
                organizationId: safeString(item.organizationId),
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              })
            })
          }
        })
      }

      // Role Remitter
      if (item.roleRemitter) {
        Object.entries(item.roleRemitter).forEach(([levelKey, levelData]) => {
          if (!levelData?.employeeId) return

          const empInfo = getEmployeeInfo(levelData.employeeId)

          // Get department from employee's departmentId first, then fallback to top-level
          let deptName = "Unknown"
          if (levelData.employeeId?.departmentId) {
            deptName = getDepartmentName(levelData.employeeId.departmentId)
          } else {
            deptName = topLevelDepartments
          }

          const level = levelData.level || levelKey

          assignments.push({
            id: `${item._id}_remitter_${levelKey}`,
            employeeId: empInfo.id,
            employeeName: empInfo.name,
            email: empInfo.email,
            department: deptName,
            level,
            role: "Remitter",
            isActive: levelData.isActive ?? true,
            expenseType: Array.isArray(item.expenseType)
              ? item.expenseType.map((et) => safeString(et.name || et)).join(", ")
              : safeString(item.expenseType),
            fromWhere: safeString(item.fromWhere),
            organizationId: safeString(item.organizationId),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })
        })
      }

      // Role Submitter
      if (item.roleSubmitter?.employeeId) {
        const submitterEmployees = Array.isArray(item.roleSubmitter.employeeId)
          ? item.roleSubmitter.employeeId
          : [item.roleSubmitter.employeeId]

        submitterEmployees.forEach((emp, index) => {
          const empInfo = getEmployeeInfo(emp)

          // Get department from employee's departmentId first, then fallback to top-level
          let deptName = "Unknown"
          if (emp?.departmentId) {
            deptName = getDepartmentName(emp.departmentId)
          } else {
            deptName = topLevelDepartments
          }

          assignments.push({
            id: `${item._id}_submitter_${index}`,
            employeeId: empInfo.id,
            employeeName: empInfo.name,
            email: empInfo.email,
            department: deptName,
            level: "-",
            role: "Submitter",
            isActive: true,
            expenseType: Array.isArray(item.expenseType)
              ? item.expenseType.map((et) => safeString(et.name || et)).join(", ")
              : safeString(item.expenseType),
            fromWhere: safeString(item.fromWhere),
            organizationId: safeString(item.organizationId),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })
        })
      }

      return assignments
    })

    console.log("✅ Transformed role assignments:", transformedData)
    return transformedData
  }

  const loadRoleAssignments = async () => {
    try {
      setLoading(true)
      setError(null)
      const rawData = await rolePermissionService.getAllRoleAssignments()

      // Transform the data in the component
      const transformedData = transformRoleAssignmentsData(rawData)
      setRoleAssignments(transformedData)
    } catch (error) {
      console.error("Error loading role assignments:", error)
      setError(error.message || "Failed to load role assignments")
      showSnackbar("Failed to load role assignments", "error")
    } finally {
      setLoading(false)
    }
  }

  const loadEmployees = async () => {
    try {
      const data = await rolePermissionService.getAllEmployees()
      setEmployees(data?.items || data || [])
    } catch (error) {
      console.error("Error loading employees:", error)
      setEmployees([])
    }
  }

  const handleRefresh = async () => {
    await loadRoleAssignments()
    showSnackbar("Data refreshed successfully", "success")
  }

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const handleFormSubmit = async (formData) => {
    try {
      // Submit the form data to the API
      await rolePermissionService.addRolePermission(formData)

      // Reload the role assignments to get the updated data
      await loadRoleAssignments()

      showSnackbar("Role assignment added successfully", "success")
      handleCloseDialog()
    } catch (error) {
      console.error("Error adding role assignment:", error)
      showSnackbar("Failed to add role assignment", "error")
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadRoleAssignments()
    loadEmployees()
  }, [])

  // Calculate summary statistics
  const totalAssignments = roleAssignments?.length || 0
  const activeAssignments = roleAssignments?.filter((assignment) => assignment.isActive).length || 0
  const approverCount = roleAssignments?.filter((assignment) => assignment.role === "Approver").length || 0
  const submitterCount = roleAssignments?.filter((assignment) => assignment.role === "Submitter").length || 0
  const remitterCount = roleAssignments?.filter((assignment) => assignment.role === "Remitter").length || 0

  const columns = [
    // {
    //   field: "employeeId",
    //   headerName: "Employee ID",
    //   width: 120,
    //   renderCell: (params) => (
    //     <Typography variant="body2" sx={{ fontWeight: 600 }}>
    //       {String(params.value || "Unknown")}
    //     </Typography>
    //   ),
    // },
    {
      field: "employeeName",
      headerName: "Employee Name",
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {String(params.value || "Unknown")}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {String(params.value || "N/A")}
        </Typography>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      width: 130,
      renderCell: (params) => (
        <Chip label={String(params.value || "Unknown")} size="small" variant="outlined" sx={{ fontSize: "11px" }} />
      ),
    },
    {
      field: "expenseType",
      headerName: "Expense Type",
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: "12px" }}>
          {String(params.value || "Unknown")}
        </Typography>
      ),
    },
    {
      field: "level",
      headerName: "Level",
      width: 80,
      renderCell: (params) => (
        <Chip
          label={String(params.value || "-")}
          size="small"
          color={params.value !== "-" ? "info" : "default"}
          sx={{ fontSize: "10px", fontWeight: 600 }}
        />
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={String(params.value || "Unknown")}
          color={
            params.value === "Approver"
              ? "success"
              : params.value === "Submitter"
                ? "primary"
                : params.value === "Remitter"
                  ? "warning"
                  : "default"
          }
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.isActive ? "Active" : "Inactive"}
          color={params.row.isActive ? "success" : "error"}
          size="small"
          variant={params.row.isActive ? "filled" : "outlined"}
          sx={{ fontWeight: 600 }}
        />
      ),
      valueGetter: (params) => (params?.row?.isActive ? "Active" : "Inactive"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => console.log("Edit assignment:", params.row)}
          sx={{
            fontSize: "12px",
            backgroundColor: "#7c4dff",
            "&:hover": { backgroundColor: "#6a1ee8" },
            textTransform: "none",
            borderRadius: "6px",
            fontWeight: 600,
          }}
        >
          Edit
        </Button>
      ),
    },
  ]

  const rows = roleAssignments.map((assignment, index) => ({
    ...assignment,
    id: assignment.id || `assignment_${index}`,
    status: assignment.isActive ? "Active" : "Inactive",
  }))

  if (error && !loading) {
    return (
      <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh", p: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{
            mb: 3,
            color: "#7c4dff",
            "&:hover": { backgroundColor: "rgba(124, 77, 255, 0.08)" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back
        </Button>

        <Paper sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", p: 4 }}>
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={loadRoleAssignments}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh", p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleGoBack}
        sx={{
          mb: 3,
          color: "#7c4dff",
          "&:hover": { backgroundColor: "rgba(124, 77, 255, 0.08)" },
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Back
      </Button>

      <Paper sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        {/* Header Section */}
        <Box sx={{ p: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Assignment sx={{ mr: 2, fontSize: 36 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                Role and Permission Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Organize and manage user roles and permissions with ease
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Summary Cards */}
          {/* <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {totalAssignments}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Assignments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white" }}>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <People sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {activeAssignments}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Assignments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: "#e8f5e8", border: "2px solid #4caf50" }}>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Assignment sx={{ fontSize: 40, mb: 1, color: "#4caf50" }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "#2e7d32" }}>
                    {approverCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#2e7d32" }}>
                    Approvers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: "#e3f2fd", border: "2px solid #2196f3" }}>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <People sx={{ fontSize: 40, mb: 1, color: "#2196f3" }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "#1565c0" }}>
                    {submitterCount + remitterCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1565c0" }}>
                    Submitters & Remitters
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid> */}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
              Role Assignments ({totalAssignments})
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  borderColor: "#7c4dff",
                  color: "#7c4dff",
                  "&:hover": { borderColor: "#6a1ee8", backgroundColor: "rgba(124, 77, 255, 0.04)" },
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                {loading ? <CircularProgress size={20} /> : "Refresh"}
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenDialog}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": { background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)" },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 15px rgba(124, 77, 255, 0.3)",
                }}
              >
                Add Assignment
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Data Grid */}
          <Box sx={{ height: 600, width: "100%" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress sx={{ color: "#7c4dff" }} />
                <Typography sx={{ ml: 2, color: "#7c4dff" }}>Loading role assignments...</Typography>
              </Box>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25, 100]}
                checkboxSelection
                disableSelectionOnClick
                components={{
                  Toolbar: CustomToolbar,
                  NoRowsOverlay: () => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        color: "text.secondary",
                      }}
                    >
                      <Assignment sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No role assignments found
                      </Typography>
                      <Typography variant="body2">
                        Click "Add Assignment" to create your first role assignment
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
        </Box>

        <AddRolePermissionForm
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleFormSubmit}
          // employees={employees}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  )
}

export default RoleAndPermission
