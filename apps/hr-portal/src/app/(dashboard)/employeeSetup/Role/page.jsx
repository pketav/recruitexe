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
  Tooltip,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  CircularProgress,
} from "@mui/material"
import { useState, useEffect } from "react"
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
  Security as SecurityIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as StatusIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as RoleIcon,
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Verified as VerifiedIcon,
  EventNote as EventIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon,
} from "@mui/icons-material"
import { useApi } from "@core/hooks/useApi"

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

export default function RoleManagementWithPermissions() {
  const { callApi, loading: apiLoading } = useApi()
  const [employeeType, setEmployeeType] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [isEditMode, setIsEditMode] = useState(false)
  const [addDesignation, setAddDesignation] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Initial permission state
  const initialPermissions = {
    roleName: "",
    organizationSetup: false,
    branchSetup: false,
    workLocationSetup: false,
    departmentTypeSetup: false,
    designationSetup: false,
    employeeTypeSetup: false,
    workModeSetup: false,
    roleAssignment: false,
    budgetSetup: false,
    jobDescriptionSetup: false,
    aiSetup: false,
    careerPageSetting: false,
    qualificationSetup: false,
    idSetup: false,
    roleSetup: false,
    hiringFlowSetup: false,
    candidateProfileSetup: false,
    verificationApiSetup: false,
    verificationStagesSetup: false,
    leaveTypeSetup: false,
    holidaySetup: false,
    costCenterSetup: false,
    masterDropdownSetup: false,
    mailSwitchSetup: false,
    expensePoliciesSetup: false,
    expenseConfigSetup: false,
    expenseCategoriesSetup: false,
    expenseTypesSetup: false,
    expenseRolePermissionSetup: false,
    assetEquipmentSetup: false,
    assetCategoriesSetup: false,
    assetPermissionsSetup: false,
    vendorRegistrationSetup: false,
    industryTypeSetup: false,
    jobPostDashboard: {
      canViewAll: false,
      canViewSelf: false,
      newJobPost: false,
      canToggleStatus: false,
    },
    jobApplications: {
      canViewAll: false,
      canViewSelf: false,
      canApproveReject: false,
    },
  }

  const [permissions, setPermissions] = useState(initialPermissions)
  const [editData, setEditData] = useState({})

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

  const handleEdit = async (row) => {
    setEditData({
      roleId: row.id,
      name: row.name,
    })

    // Fetch existing permissions for the role
    setLoading(true)
    const roleDetails = await getRoleDetails(row.id)

    if (!roleDetails) {
      // Fallback to basic role info if API fails
      setPermissions({
        ...initialPermissions,
        roleName: row.name,
      })
    }

    setLoading(false)
    setIsEditMode(true)
    setAddDesignation(true)
  }

  const columns = [
    {
      field: "name",
      headerName: "Role Name",
      width: 350,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Name of the employee role or position">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <RoleIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Role Name
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Tooltip title={`Role: ${params.value}`} placement="top">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SecurityIcon sx={{ fontSize: 16, color: "primary.main" }} />
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
      width: 290,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Date when the role was created">
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
      width: 190,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Current status of the role">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <StatusIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Status
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => {
        const isActive = params.row.status === "active"
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
        <Tooltip title="Available actions for this role">
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
            <Tooltip title="Edit role details" placement="top">
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
            <Tooltip title="Deactivate this role" placement="top">
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
                  handleDelete(params.row.id)
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

  const getemployeeType = async () => {
    setLoading(true)
    const result = await callApi({
      endpoint: "/v1/api/role/getAllRole",
      method: "GET",
      disableSnackbar: true,
    })

    if (result.success && result.data.items) {
      const formatted = result.data.items.map((item) => ({
        id: item._id,
        name: item.roleName,
        createdAt: formatDate(item.createdAt),
        status: item.status,
      }))

      setEmployeeType(formatted.filter((i) => i.status === "active"))
      setTotalItems(formatted.filter((i) => i.status === "active").length)
    }
    setLoading(false)
  }

  const getRoleDetails = async (roleId) => {
    const result = await callApi({
      endpoint: `/v1/api/role/detail?roleId=${roleId}`,
      method: "GET",
      disableSnackbar: true,
    })

    if (result.success && result.data.items) {
      const roleData = result.data.items

      // Map the API response to our permissions state structure
      const mappedPermissions = {
        roleName: roleData.roleName || "",
        organizationSetup: roleData.organizationSetup || false,
        branchSetup: roleData.branchSetup || false,
        workLocationSetup: roleData.workLocationSetup || false,
        departmentTypeSetup: roleData.departmentTypeSetup || false,
        designationSetup: roleData.designationSetup || false,
        employeeTypeSetup: roleData.employeeTypeSetup || false,
        workModeSetup: roleData.workModeSetup || false,
        roleAssignment: roleData.roleAssignment || false,
        budgetSetup: roleData.budgetSetup || false,
        jobDescriptionSetup: roleData.jobDescriptionSetup || false,
        aiSetup: roleData.aiSetup || false,
        careerPageSetting: roleData.careerPageSetting || false,
        qualificationSetup: roleData.qualificationSetup || false,
        idSetup: roleData.idSetup || false,
        roleSetup: roleData.roleSetup || false,
        hiringFlowSetup: roleData.hiringFlowSetup || false,
        candidateProfileSetup: roleData.candidateProfileSetup || false,
        verificationApiSetup: roleData.verificationApiSetup || false,
        verificationStagesSetup: roleData.verificationStagesSetup || false,
        leaveTypeSetup: roleData.leaveTypeSetup || false,
        holidaySetup: roleData.holidaySetup || false,
        costCenterSetup: roleData.costCenterSetup || false,
        masterDropdownSetup: roleData.masterDropdownSetup || false,
        mailSwitchSetup: roleData.mailSwitchSetup || false,
        expensePoliciesSetup: roleData.expensePoliciesSetup || false,
        expenseConfigSetup: roleData.expenseConfigSetup || false,
        expenseCategoriesSetup: roleData.expenseCategoriesSetup || false,
        expenseTypesSetup: roleData.expenseTypesSetup || false,
        expenseRolePermissionSetup: roleData.expenseRolePermissionSetup || false,
        assetEquipmentSetup: roleData.assetEquipmentSetup || false,
        assetCategoriesSetup: roleData.assetCategoriesSetup || false,
        assetPermissionsSetup: roleData.assetPermissionsSetup || false,
        vendorRegistrationSetup: roleData.vendorRegistrationSetup || false,
        industryTypeSetup: roleData.industryTypeSetup || false,
        jobPostDashboard: {
          canViewAll: roleData.jobPostDashboard?.canViewAll || false,
          canViewSelf: roleData.jobPostDashboard?.canViewSelf || false,
          newJobPost: roleData.jobPostDashboard?.newJobPost || false,
          canToggleStatus: roleData.jobPostDashboard?.canToggleStatus || false,
        },
        jobApplications: {
          canViewAll: roleData.jobApplications?.canViewAll || false,
          canViewSelf: roleData.jobApplications?.canViewSelf || false,
          canApproveReject: roleData.jobApplications?.canApproveReject || false,
        },
      }

      setPermissions(mappedPermissions)
      return mappedPermissions
    }
    return null
  }

  useEffect(() => {
    getemployeeType()
  }, [])

  const handleDelete = async (id) => {
    const result = await callApi({
      endpoint: "/v1/api/role/activeOrInactive",
      method: "POST",
      data: {
        id: id,
        status: "inactive",
      },
      successMessage: "Role deactivated successfully",
      errorMessage: "Error deactivating role",
    })

    if (result.success) {
      getemployeeType()
    }
  }

  const handleSubmit = async () => {
    const result = await callApi({
      endpoint: "/v1/api/role/roleAdd",
      method: "POST",
      data: permissions,
      successMessage: "Role created successfully",
      errorMessage: "Error creating role",
    })

    if (result.success) {
      getemployeeType()
      setAddDesignation(false)
      setPermissions(initialPermissions)
    }
  }

  const handleSubmitEdit = async () => {
    const result = await callApi({
      endpoint: "/v1/api/role/roleUpdate",
      method: "POST",
      data: {
        roleId: editData.roleId,
        ...permissions,
      },
      successMessage: "Role updated successfully",
      errorMessage: "Error updating role",
    })

    if (result.success) {
      getemployeeType()
      setAddDesignation(false)
      setIsEditMode(false)
      setEditData({})
      setPermissions(initialPermissions)
    }
  }

  const handlePermissionChange = (field, value) => {
    setPermissions((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedPermissionChange = (parent, field, value) => {
    setPermissions((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }))
  }

  const handleSelectAll = (section, permissions) => {
    const allSelected = permissions.every((perm) => permissions[perm])
    permissions.forEach((perm) => {
      handlePermissionChange(perm, !allSelected)
    })
  }

  const resetForm = () => {
    setAddDesignation(false)
    setIsEditMode(false)
    setPermissions(initialPermissions)
    setEditData({})
  }

  const permissionSections = [
    {
      title: "Organization Setup",
      icon: <BusinessIcon />,
      permissions: [
        { key: "organizationSetup", label: "Organization Setup" },
        { key: "branchSetup", label: "Branch Setup" },
        { key: "workLocationSetup", label: "Work Location Setup" },
        { key: "departmentTypeSetup", label: "Department Type Setup" },
      ],
    },
    {
      title: "Employee Management",
      icon: <PeopleIcon />,
      permissions: [
        { key: "designationSetup", label: "Designation Setup" },
        { key: "employeeTypeSetup", label: "Employee Type Setup" },
        { key: "workModeSetup", label: "Work Mode Setup" },
        { key: "roleAssignment", label: "Role Assignment" },
        { key: "roleSetup", label: "Role Setup" },
      ],
    },
    {
      title: "Recruitment & Hiring",
      icon: <WorkIcon />,
      permissions: [
        { key: "budgetSetup", label: "Budget Setup" },
        { key: "jobDescriptionSetup", label: "Job Description Setup" },
        { key: "aiSetup", label: "AI Setup" },
        { key: "careerPageSetting", label: "Career Page Setting" },
        { key: "qualificationSetup", label: "Qualification Setup" },
        { key: "hiringFlowSetup", label: "Hiring Flow Setup" },
        { key: "candidateProfileSetup", label: "Candidate Profile Setup" },
      ],
    },
    {
      title: "Verification & Compliance",
      icon: <VerifiedIcon />,
      permissions: [
        { key: "verificationApiSetup", label: "Verification API Setup" },
        { key: "verificationStagesSetup", label: "Verification Stages Setup" },
        { key: "idSetup", label: "ID Setup" },
      ],
    },
    {
      title: "Leave & Holiday Management",
      icon: <EventIcon />,
      permissions: [
        { key: "leaveTypeSetup", label: "Leave Type Setup" },
        { key: "holidaySetup", label: "Holiday Setup" },
      ],
    },
    {
      title: "Financial Management",
      icon: <MoneyIcon />,
      permissions: [
        { key: "costCenterSetup", label: "Cost Center Setup" },
        { key: "expensePoliciesSetup", label: "Expense Policies Setup" },
        { key: "expenseConfigSetup", label: "Expense Config Setup" },
        { key: "expenseCategoriesSetup", label: "Expense Categories Setup" },
        { key: "expenseTypesSetup", label: "Expense Types Setup" },
        { key: "expenseRolePermissionSetup", label: "Expense Role Permission Setup" },
      ],
    },
    {
      title: "Asset Management",
      icon: <InventoryIcon />,
      permissions: [
        { key: "assetEquipmentSetup", label: "Asset Equipment Setup" },
        { key: "assetCategoriesSetup", label: "Asset Categories Setup" },
        { key: "assetPermissionsSetup", label: "Asset Permissions Setup" },
      ],
    },
    {
      title: "Vendor & Industry",
      icon: <StoreIcon />,
      permissions: [
        { key: "vendorRegistrationSetup", label: "Vendor Registration Setup" },
        { key: "industryTypeSetup", label: "Industry Type Setup" },
      ],
    },
    {
      title: "System Configuration",
      icon: <SettingsIcon />,
      permissions: [
        { key: "masterDropdownSetup", label: "Master Dropdown Setup" },
        { key: "mailSwitchSetup", label: "Mail Switch Setup" },
      ],
    },
  ]

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              Role Management
            </Typography>
            <Tooltip title="Manage employee roles and positions that define job responsibilities and access levels.">
              <InfoOutlinedIcon sx={{ color: "#1976d2", fontSize: 24, cursor: "pointer" }} />
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
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
              Add Role
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/employeeSetup")}
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Back
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Enhanced DataGrid */}
      <Paper sx={{ p: 2 }}>
        <DataGrid
          rows={employeeType}
          columns={columns}
          loading={loading || apiLoading}
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

      {/* Add/Edit Role Modal with Permissions */}
      <Dialog
        open={addDesignation}
        onClose={resetForm}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { maxHeight: "90vh" },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 18, fontWeight: 600 }}>
          <SecurityIcon color="primary" />
          {isEditMode ? "Edit Role & Permissions" : "Add New Role & Permissions"}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {loading && isEditMode ? (
            <Box sx={{ p: 4, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Loading role permissions...
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              {/* Form Header */}
              <Box sx={{ mb: 3, p: 2, backgroundColor: "#f8f9fa", borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                  Role Information & Permissions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill in the role details and configure permissions for {isEditMode ? "updating" : "creating"} a role
                </Typography>
              </Box>

              {/* Basic Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <RoleIcon color="primary" sx={{ fontSize: 20 }} />
                  Basic Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Role Name"
                      name="roleName"
                      value={permissions.roleName}
                      onChange={(e) => handlePermissionChange("roleName", e.target.value)}
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Permissions Section */}
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <SecurityIcon color="primary" sx={{ fontSize: 24 }} />
                Role Permissions
              </Typography>

              {/* Permission Sections */}
              {permissionSections.map((section, index) => (
                <Accordion key={index} sx={{ mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: "#f8f9fa",
                      "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {section.icon}
                      <Typography variant="subtitle1" fontWeight={600}>
                        {section.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {section.permissions.map((perm) => (
                        <Grid item xs={12} sm={6} md={4} key={perm.key}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={permissions[perm.key] || false}
                                onChange={(e) => handlePermissionChange(perm.key, e.target.checked)}
                                color="primary"
                              />
                            }
                            label={perm.label}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* Job Post Dashboard Permissions */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: "#f8f9fa",
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <AssignmentIcon />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Job Post Dashboard
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.jobPostDashboard?.canViewAll || false}
                            onChange={(e) =>
                              handleNestedPermissionChange("jobPostDashboard", "canViewAll", e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="Can View All"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.jobPostDashboard?.canViewSelf || false}
                            onChange={(e) =>
                              handleNestedPermissionChange("jobPostDashboard", "canViewSelf", e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="Can View Self"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.jobPostDashboard?.newJobPost || false}
                            onChange={(e) =>
                              handleNestedPermissionChange("jobPostDashboard", "newJobPost", e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="New Job Post"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.jobPostDashboard?.canToggleStatus || false}
                            onChange={(e) =>
                              handleNestedPermissionChange("jobPostDashboard", "canToggleStatus", e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="Can Toggle Status"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Job Applications Permissions */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: "#f8f9fa",
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PeopleIcon />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Job Applications
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.jobApplications?.canViewAll || false}
                            onChange={(e) =>
                              handleNestedPermissionChange("jobApplications", "canViewAll", e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="Can View All"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.jobApplications?.canViewSelf || false}
                            onChange={(e) =>
                              handleNestedPermissionChange("jobApplications", "canViewSelf", e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="Can View Self"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permissions.jobApplications?.canApproveReject || false}
                            onChange={(e) =>
                              handleNestedPermissionChange("jobApplications", "canApproveReject", e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="Can Approve/Reject"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
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
            onClick={isEditMode ? handleSubmitEdit : handleSubmit}
            disabled={apiLoading}
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
            {apiLoading ? "Processing..." : isEditMode ? "Update Role" : "Create Role"}
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
