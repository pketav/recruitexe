"use client"

import React, { useState, useEffect } from "react"
import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  Alert,
  Snackbar,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  InputAdornment,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  useTheme,
  useMediaQuery,
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
  Person,
  Group,
  People,
  Search,
  Assignment,
  PersonAdd,
  Business,
  Work,
  Email,
  Phone,
  Lock,
  Close,
  Security,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  CheckCircle as StatusIcon,
  AdminPanelSettings as RoleIcon,
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  EditOutlined as EditIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Dashboard as DashboardIcon,
  Share as ShareIcon,
} from "@mui/icons-material"
import StarsRoundedIcon from "@mui/icons-material/StarsRounded"
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { useApi } from "@core/hooks/useApi"
import { useRouter } from "next/navigation"
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace"
import { Presentation } from "lucide-react"

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Something went wrong displaying the data
          </Typography>
          <Button variant="contained" onClick={() => this.setState({ hasError: false, error: null })} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  )
}

const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{ p: 1, gap: 1 }}>
      <GridToolbarColumnsButton startIcon={<ViewColumnIcon />} sx={{ color: "#1976d2" }} />
      <GridToolbarFilterButton startIcon={<FilterIcon />} sx={{ color: "#1976d2" }} />
      <GridToolbarDensitySelector startIcon={<SettingsIcon />} sx={{ color: "#1976d2" }} />
      <GridToolbarExport
        startIcon={<DownloadIcon />}
        sx={{ color: "#1976d2" }}
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

export default function UnifiedEmployeeRoleManagement() {
  const { callApi, loading: apiLoading } = useApi()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // Main tab state
  const [mainTabValue, setMainTabValue] = useState(0)

  // Role Management States
  const [roles, setRoles] = useState([])
  const [roleLoading, setRoleLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [addRoleDialog, setAddRoleDialog] = useState(false)
  const [editData, setEditData] = useState({})

  // Employee Management States
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [employeeLoading, setEmployeeLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("active")
  const [addEmployeeDialog, setAddEmployeeDialog] = useState(false)
  const [departments, setDepartments] = useState([])
  const [subDepartments, setSubDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [tabVisibility, setTabVisibility] = useState(null)

  // Role Assignment States
  const [assignmentData, setAssignmentData] = useState({
    selectedRole: "",
    selectedEmployee: "",
  })
  const [formErrors, setFormErrors] = useState({})

  // New Employee Form States
  const [newEmployeeData, setNewEmployeeData] = useState({
    userName: "",
    email: "",
    mobileNo: "",
    employeName: "",
    departmentId: "",
    subDepartmentId: "",
    designationId: "",
    roleId: "",
    password: "",
  })
  const [newEmployeeErrors, setNewEmployeeErrors] = useState({})
  const [addEmployeeLoading, setAddEmployeeLoading] = useState(false)

  // Employee Edit States
  const [editEmployeeDialog, setEditEmployeeDialog] = useState(false)
  const [editEmployeeData, setEditEmployeeData] = useState({})
  const [editEmployeeLoading, setEditEmployeeLoading] = useState(false)

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Updated initial permission state based on API response structure
  const initialPermissions = {
    roleName: "",
    // Main permission categories from permissions object
    CommandExe: {
      addCase: false,
      backOffice: false,
      invoice: false,
      client: false,
      pdfTemplate: false,
      initField: false,
      variable: false,
      addAdmin: false,
      service: false
    },
    verificationSuite: {
      setup: false
    },
    InterviewManagement: false,
    LeadExe: false,
    RecruitmentHiring: false,
    chat: false,
    expenseManagement: false,
    fileManager: false,
    notes: false,
    assetManagement: false,
    managementFeatures: false,
    // Organization Setup (nested under organizationSetup)
    organizationSetup: {
      organizationSetup: false,
      branchSetup: false,
      workLocationSetup: false,
      departmentTypeSetup: false,
      designationSetup: false,
      employeeTypeSetup: false,
      employeeAndRoleManagement: false,
      workModeSetup: false,
    },
    // Recruitment Hiring (nested permissions)
    RecruitmentHiring: {
      budgetSetup: false,
      aiSetup: false,
      careerPageSetting: false,
      idSetup: false,
      qualificationSetup: false,
      linkedin: {
        setup: false,
        dashboard: false,
        createPost: false,
      },
      targetCompany: false,
      agencySetup: false,
      jobDescriptionSetup: false,
      hiringFlowSetup: false,
      CandidateDocumentCollection: false,
      jobPostDashboard: {
        canViewAll: false,
        canViewSelf: false,
        newJobPost: false,
        canToggleStatus: false,
        jobPostApprove: false,
      },
      jobApplications: {
        canViewAll: false,
        canViewSelf: false,
        canApproveReject: false,
        candidateMap: false,
      },
    },
    // Interview Management (nested permissions)
    InterviewManagement: {
      callingAgentCreation: false,
      interviewCanViewSelf: false,
      interviewCanViewAll: false,
      callingLogDashboard: false
    },
    // Asset Management (nested permissions)
    assetManagement: {
      assetEquipmentSetup: false,
      assetCategoriesSetup: false,
      assetPermissionsSetup: false,
    },
    // Expense Management (nested permissions)
    expenseManagement: {
      expensePoliciesSetup: false,
      expenseConfigSetup: false,
      expenseCategoriesSetup: false,
      expenseTypesSetup: false,
      expenseRolePermissionSetup: false,
    },
    // Management Features (nested permissions)
    managementFeatures: {
      CustomPdfTemplate: false,
      masterDropdownSetup: false,
      mailSwitchSetup: false,
    },
  }

  const [permissions, setPermissions] = useState(initialPermissions)

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleMainTabChange = (event, newValue) => {
    setMainTabValue(newValue)
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

  // Role Management Functions
  const getRoles = async () => {
    setRoleLoading(true)
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
      setRoles(formatted.filter((i) => i.status === "active"))
    }
    setRoleLoading(false)
  }

  // Updated getRoleDetails function with permission-based tab visibility
  const getRoleDetails = async (roleId) => {
    const result = await callApi({
      endpoint: `/v1/api/role/detail?roleId=${roleId}`,
      method: "GET",
      disableSnackbar: true,
    })

    if (result.success && result.data.items) {
      const roleData = result.data.items

      // Extract permissions object for tab visibility
      const apiPermissions = roleData.permissions || {}

      // Map the API response to our permission structure
      const mappedPermissions = {
        roleName: roleData.roleName || "",
        // Main categories from permissions object AND direct properties
        CommandExe: {
          addCase: roleData.CommandExe?.addCase || false,
          backOffice: roleData.CommandExe?.backOffice || false,
          invoice: roleData.CommandExe?.invoice || false,
          client: roleData.CommandExe?.client || false,
          pdfTemplate: roleData.CommandExe?.pdfTemplate || false,
          initField: roleData.CommandExe?.initField || false,
          variable: roleData.CommandExe?.variable || false,
          addAdmin: roleData.CommandExe?.addAdmin || false,
          service: roleData.CommandExe?.service || false
        },
        verificationSuite: {
          setup: roleData.verificationSuite?.setup || false,
        },
        InterviewManagement: roleData.permissions?.InterviewManagement || roleData.InterviewManagement || false,
        LeadExe: roleData.permissions?.LeadExe || false,
        RecruitmentHiring: roleData.permissions?.RecruitmentHiring || roleData.RecruitmentHiring || false,
        chat: roleData.permissions?.chat || roleData.chat || false,
        expenseManagement: roleData.permissions?.expenseManagement || roleData.expenseManagement || false,
        fileManager: roleData.permissions?.fileManager || roleData.fileManager || false,
        notes: roleData.permissions?.notes || roleData.notes || false,
        assetManagement: roleData.permissions?.assetManagement || roleData.assetManagement || false,
        managementFeatures: roleData.permissions?.managementFeatures || roleData.managementFeatures || false,
        // Organization Setup
        organizationSetup: {
          organizationSetup: roleData.organizationSetup?.organizationSetup || false,
          branchSetup: roleData.organizationSetup?.branchSetup || false,
          workLocationSetup: roleData.organizationSetup?.workLocationSetup || false,
          departmentTypeSetup: roleData.organizationSetup?.departmentTypeSetup || false,
          designationSetup: roleData.organizationSetup?.designationSetup || false,
          employeeTypeSetup: roleData.organizationSetup?.employeeTypeSetup || false,
          employeeAndRoleManagement: roleData.organizationSetup?.employeeAndRoleManagement || false,
          workModeSetup: roleData.organizationSetup?.workModeSetup || false,
        },
        // Recruitment Hiring
        RecruitmentHiring: {
          budgetSetup: roleData.RecruitmentHiring?.budgetSetup || false,
          aiSetup: roleData.RecruitmentHiring?.aiSetup || false,
          careerPageSetting: roleData.RecruitmentHiring?.careerPageSetting || false,
          idSetup: roleData.RecruitmentHiring?.idSetup || false,
          qualificationSetup: roleData.RecruitmentHiring?.qualificationSetup || false,
          linkedin: {
            setup: roleData.RecruitmentHiring?.linkedin?.setup || false,
            dashboard: roleData.RecruitmentHiring?.linkedin?.dashboard || false,
            createPost: roleData.RecruitmentHiring?.linkedin?.createPost || false,
          },
          targetCompany: roleData.RecruitmentHiring?.targetCompany || false,
          agencySetup: roleData.RecruitmentHiring?.agencySetup || false,
          jobDescriptionSetup: roleData.RecruitmentHiring?.jobDescriptionSetup || false,
          hiringFlowSetup: roleData.RecruitmentHiring?.hiringFlowSetup || false,
          CandidateDocumentCollection: roleData.RecruitmentHiring?.CandidateDocumentCollection || false,

          jobPostDashboard: {
            canViewAll: roleData.RecruitmentHiring?.jobPostDashboard?.canViewAll || false,
            canViewSelf: roleData.RecruitmentHiring?.jobPostDashboard?.canViewSelf || false,
            newJobPost: roleData.RecruitmentHiring?.jobPostDashboard?.newJobPost || false,
            canToggleStatus: roleData.RecruitmentHiring?.jobPostDashboard?.canToggleStatus || false,
            jobPostApprove: roleData.RecruitmentHiring?.jobPostDashboard?.jobPostApprove || false,
          },
          jobApplications: {
            canViewAll: roleData.RecruitmentHiring?.jobApplications?.canViewAll || false,
            canViewSelf: roleData.RecruitmentHiring?.jobApplications?.canViewSelf || false,
            canApproveReject: roleData.RecruitmentHiring?.jobApplications?.canApproveReject || false,
            candidateMap: roleData.RecruitmentHiring?.jobApplications?.candidateMap || false,
          },
        },
        // Interview Management
        InterviewManagement: {
          callingAgentCreation: roleData.InterviewManagement?.callingAgentCreation || false,
          interviewCanViewSelf: roleData.InterviewManagement?.interviewCanViewSelf || false,
          interviewCanViewAll: roleData.InterviewManagement?.interviewCanViewAll || false,
          callingLogDashboard: roleData.InterviewManagement?.callingLogDashboard || false,
        },
        // Asset Management
        assetManagement: {
          assetEquipmentSetup: roleData.assetManagement?.assetEquipmentSetup || false,
          assetCategoriesSetup: roleData.assetManagement?.assetCategoriesSetup || false,
          assetPermissionsSetup: roleData.assetManagement?.assetPermissionsSetup || false,
        },
        // Expense Management
        expenseManagement: {
          expensePoliciesSetup: roleData.expenseManagement?.expensePoliciesSetup || false,
          expenseConfigSetup: roleData.expenseManagement?.expenseConfigSetup || false,
          expenseCategoriesSetup: roleData.expenseManagement?.expenseCategoriesSetup || false,
          expenseTypesSetup: roleData.expenseManagement?.expenseTypesSetup || false,
          expenseRolePermissionSetup: roleData.expenseManagement?.expenseRolePermissionSetup || false,
        },
        // Management Features
        managementFeatures: {
          CustomPdfTemplate: roleData.managementFeatures?.CustomPdfTemplate || false,
          masterDropdownSetup: roleData.managementFeatures?.masterDropdownSetup || false,
          mailSwitchSetup: roleData.managementFeatures?.mailSwitchSetup || false,
        },
      }

      setPermissions(mappedPermissions)

      // Set tab visibility based on permissions
      setTabVisibility(apiPermissions)

      return mappedPermissions
    }
    return null
  }

  const handleEditRole = async (row) => {
    setEditData({
      roleId: row.id,
      name: row.name,
    })
    setRoleLoading(true)
    const roleDetails = await getRoleDetails(row.id)
    if (!roleDetails) {
      setPermissions({
        ...initialPermissions,
        roleName: row.name,
      })
    }
    setRoleLoading(false)
    setIsEditMode(true)
    setAddRoleDialog(true)
  }

  const handleDeleteRole = async (id) => {
    const result = await callApi({
      endpoint: "/v1/api/role/activeOrInactive",
      method: "POST",
      data: {
        id: id,
        status: "inactive",
      },
    })
    if (result.success) {
      getRoles()
    }
  }

  const handleSubmitRole = async () => {
    const result = await callApi({
      endpoint: "/v1/api/role/roleAdd",
      method: "POST",
      data: permissions,
    })
    if (result.success) {
      getRoles()
      setAddRoleDialog(false)
      setPermissions(initialPermissions)
    }
  }

  const handleSubmitEditRole = async () => {
    const result = await callApi({
      endpoint: "/v1/api/role/roleUpdate",
      method: "POST",
      data: {
        roleId: editData.roleId,
        ...permissions,
      },
    })
    if (result.success) {
      getRoles()
      setAddRoleDialog(false)
      setIsEditMode(false)
      setEditData({})
      setPermissions(initialPermissions)
    }
  }

  // Employee Management Functions
  const getEmployees = async (search = "", status = "active") => {
    try {
      setEmployeeLoading(true)
      let url = `/v1/api/Auth/getAllEmployeeInfodata?search=${search}`
      if (status === "inactive") {
        url += `&status=inactive`
      }
      const result = await callApi({
        endpoint: url,
        method: "GET",
        disableSnackbar: true,
      })
      if (result.success && result.data.items) {
        const employees = result.data.items.map((employee, index) => {
          const processedEmployee = {
            _id: employee?._id || `emp-${index}`,
            employeUniqueId: employee?.employeUniqueId || "",
            userName: employee?.userName || "",
            employeName: employee?.employeName || "",
            email: employee?.email || "",
            departmentId: employee?.department?._id || employee?.departmentId || "",
            subDepartmentId: employee?.subDepartment?._id || employee?.subDepartmentId || "",
            designationId: employee?.designation?._id || employee?.designationId || "",
            department: employee?.department?.name || employee?.department || "-",
            subDepartment: employee?.subDepartment?.name || employee?.subDepartment || "",
            designation: employee?.designation?.name || employee?.designation || "-",
            roleName: employee?.roleName?.roleName || employee?.roleName || "",
            status: employee?.status || "active",
          }
          return processedEmployee
        })
        setEmployees(employees)
        setFilteredEmployees(employees)
      } else {
        setEmployees([])
        setFilteredEmployees([])
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to fetch employees",
      })
      setEmployees([])
      setFilteredEmployees([])
    } finally {
      setEmployeeLoading(false)
    }
  }

  const getDepartments = async () => {
    try {
      const result = await callApi({
        endpoint: "/v1/api/newdepartment/newdeparment",
        method: "GET",
        disableSnackbar: true,
      })
      setDepartments(result.data?.items || [])
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const getSubDepartments = async (departmentId) => {
    try {
      const result = await callApi({
        endpoint: `/v1/api/newdepartment/sub/${departmentId}`,
        method: "GET",
        disableSnackbar: true,
      })
      setSubDepartments(result.data?.items || [])
    } catch (error) {
      console.error("Error fetching sub-departments:", error)
      setSubDepartments([])
    }
  }

  const getDesignations = async () => {
    try {
      const result = await callApi({
        endpoint: "/v1/api/designation/getAll",
        method: "GET",
        disableSnackbar: true,
      })
      const formatted = result.data.items.map((item, index) => ({
        id: item._id || `designation-${index}`,
        name: item.name || "",
        departmentId: item.departmentId?._id || "-",
        departmentName: item.departmentId?.name?.toUpperCase() || "-",
        subDepartmentId: item.subDepartmentId || null,
      }))
      setDesignations(formatted)
    } catch (error) {
      console.error("Error fetching designations:", error)
    }
  }

  // Role Assignment Functions
  const handleAssignmentChange = (e) => {
    const { name, value } = e.target
    setAssignmentData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
    if (name === "selectedEmployee" && value && assignmentData.selectedRole) {
      setFormErrors((prev) => ({
        ...prev,
        selectedRole: "",
      }))
    }
    if (name === "selectedRole" && value && assignmentData.selectedEmployee) {
      setFormErrors((prev) => ({
        ...prev,
        selectedEmployee: "",
      }))
    }
  }

  const handleAssignRole = async (e) => {
    e.preventDefault()
    setFormErrors({})
    const errors = {}
    if (!assignmentData.selectedRole || assignmentData.selectedRole === "") {
      errors.selectedRole = "Please select a role"
    }
    if (!assignmentData.selectedEmployee || assignmentData.selectedEmployee === "") {
      errors.selectedEmployee = "Please select an employee"
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please fix the validation errors before proceeding",
      })
      return
    }

    const result = await callApi({
      endpoint: `/v1/api/role/roleAssignToEmployee?roleId=${assignmentData.selectedRole}&employeeId=${assignmentData.selectedEmployee}`,
      method: "POST",
      data: {},
    })
    if (result.success) {
      setAssignmentData({
        selectedRole: "",
        selectedEmployee: "",
      })
      setFormErrors({})
      getEmployees(searchTerm, statusFilter)
    }
  }

  const hasPermission = (permissionKey) => {
    if (!permissions) return false
    return permissions[permissionKey] === true
  }

  // New Employee Functions
  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target
    if (name === "mobileNo") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10)
      setNewEmployeeData((prev) => ({
        ...prev,
        [name]: numericValue,
      }))
    } else {
      setNewEmployeeData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    if (newEmployeeErrors[name]) {
      setNewEmployeeErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateNewEmployee = () => {
    const errors = {}
    if (!newEmployeeData.userName.trim()) {
      errors.userName = "Username is required"
    } else if (newEmployeeData.userName.length < 3) {
      errors.userName = "Username must be at least 3 characters"
    }
    if (!newEmployeeData.employeName.trim()) {
      errors.employeName = "Employee name is required"
    }
    if (!newEmployeeData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployeeData.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (!newEmployeeData.mobileNo.trim()) {
      errors.mobileNo = "Mobile number is required"
    } else if (!/^\d{10}$/.test(newEmployeeData.mobileNo)) {
      errors.mobileNo = "Mobile number must be exactly 10 digits"
    }
    if (!newEmployeeData.departmentId) {
      errors.departmentId = "Please select a department"
    }
    if (!newEmployeeData.designationId) {
      errors.designationId = "Please select a designation"
    }
    if (!newEmployeeData.roleId) {
      errors.roleId = "Please select a role"
    }
    if (!newEmployeeData.password.trim()) {
      errors.password = "Password is required"
    } else if (newEmployeeData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }
    setNewEmployeeErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateEmployee = async (e) => {
    e.preventDefault()
    if (!validateNewEmployee()) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please fill in all required fields before proceeding",
      })
      return
    }

    try {
      setAddEmployeeLoading(true)
      const payload = {
        userName: newEmployeeData.userName,
        email: newEmployeeData.email,
        mobileNo: Number.parseInt(newEmployeeData.mobileNo),
        employeName: newEmployeeData.employeName,
        departmentId: newEmployeeData.departmentId,
        subDepartmentId: newEmployeeData.subDepartmentId || undefined,
        designationId: newEmployeeData.designationId,
        roleId: newEmployeeData.roleId,
        password: newEmployeeData.password,
      }

      const result = await callApi({
        endpoint: "/v1/api/Auth/createNewEmployee",
        method: "POST",
        data: payload,
      })
      if (result.success) {
        if (newEmployeeData.roleId && result.data?.items?._id) {
          const roleAssignResult = await callApi({
            endpoint: `/v1/api/role/roleAssignToEmployee?roleId=${newEmployeeData.roleId}&employeeId=${result.data.items._id}`,
            method: "POST",
            data: {},
          })
          if (!roleAssignResult.success) {
            setSnackbar({
              open: true,
              severity: "warning",
              message: "Employee created but role assignment failed. Please assign role manually.",
            })
          }
        }
        setNewEmployeeData({
          userName: "",
          email: "",
          mobileNo: "",
          employeName: "",
          departmentId: "",
          subDepartmentId: "",
          designationId: "",
          roleId: "",
          password: "",
        })
        setAddEmployeeDialog(false)
        getEmployees(searchTerm, statusFilter)
        if (!newEmployeeData.roleId) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Employee created successfully with role assigned!",
          })
        }
      }
    } catch (error) {
      console.error("Error creating employee:", error)
    } finally {
      setAddEmployeeLoading(false)
    }
  }

  // Employee Status and Update Functions
  const handleEmployeeStatusToggle = async (employeeId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      const result = await callApi({
        endpoint: "/v1/api/Auth/employee/adminByUpdate",
        method: "POST",
        data: {
          employeeId: employeeId,
          status: newStatus,
        },
      })
      if (result.success) {
        getEmployees(searchTerm, statusFilter)
      }
    } catch (error) {
      console.error("Error updating employee status:", error)
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to update employee status",
      })
    }
  }

  const handleEditEmployee = (employee) => {
    // Find the role ID by name if only the name is present
    let roleId = "";
    if (employee.roleName?._id) {
      roleId = employee.roleName._id;
    } else if (employee.roleId) {
      roleId = employee.roleId;
    } else if (employee.roleName) {
      // Find the role in the roles array by name
      const foundRole = roles.find(r => r.name === employee.roleName);
      if (foundRole) {
        roleId = foundRole.id;
      }
    }
    setEditEmployeeData({
      _id: employee._id,
      userName: employee.userName,
      employeName: employee.employeName,
      email: employee.email,
      departmentId: employee.departmentId || "",
      subDepartmentId: employee.subDepartmentId || "",
      designationId: employee.designationId || "",
      status: employee.status,
      roleId, // Use the resolved roleId
    });
    if (employee.departmentId) {
      getSubDepartments(employee.departmentId);
    }
    setEditEmployeeDialog(true);
  }

  const handleEditEmployeeChange = (e) => {
    const { name, value } = e.target
    setEditEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name === "departmentId") {
      setEditEmployeeData((prev) => ({
        ...prev,
        subDepartmentId: "",
        designationId: "",
      }))
      if (value) {
        getSubDepartments(value)
      }
    }
  }

  const handleUpdateEmployee = async (e) => {
    e.preventDefault()
    setEditEmployeeLoading(true)
    try {
      const payload = {
        employeeId: editEmployeeData._id,
        userName: editEmployeeData.userName,
        employeName: editEmployeeData.employeName,
        email: editEmployeeData.email,
        departmentId: editEmployeeData.departmentId,
        designationId: editEmployeeData.designationId,
      }
      if (editEmployeeData.subDepartmentId) {
        payload.subDepartmentId = editEmployeeData.subDepartmentId
      }

      const result = await callApi({
        endpoint: "/v1/api/Auth/employee/adminByUpdate",
        method: "POST",
        data: payload,
      })
      if (result.success) {
        // Assign role if changed
        if (editEmployeeData.roleId && editEmployeeData.roleId !== (employees.find(emp => emp._id === editEmployeeData._id)?.roleId || "")) {
          await callApi({
            endpoint: `/v1/api/role/roleAssignToEmployee?roleId=${editEmployeeData.roleId}&employeeId=${editEmployeeData._id}`,
            method: "POST",
            data: {},
          })
        }
        getEmployees(searchTerm, statusFilter)
        setEditEmployeeDialog(false)
        setEditEmployeeData({})
      }
    } catch (error) {
      console.error("Error updating employee:", error)
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to update employee",
      })
    } finally {
      setEditEmployeeLoading(false)
    }
  }

  // Permission handling functions
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

  const handleDoubleNestedPermissionChange = (parent, child, field, value) => {
    setPermissions((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: {
          ...prev[parent][child],
          [field]: value,
        },
      },
    }))
  }

  // Utility functions
  const truncateText = (text, maxLength = 30) => {
    if (!text) return "-"
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const getFilteredDesignations = () => {
    if (!newEmployeeData.departmentId) return []
    return designations.filter((designation) => designation.departmentId === newEmployeeData.departmentId)
  }

  const getFilteredDesignationsForEdit = () => {
    if (!editEmployeeData.departmentId) return []
    return designations.filter((designation) => designation.departmentId === editEmployeeData.departmentId)
  }

  const resetRoleForm = () => {
    setAddRoleDialog(false)
    setIsEditMode(false)
    setPermissions(initialPermissions)
    setEditData({})
  }

  const resetEmployeeForm = () => {
    setNewEmployeeData({
      userName: "",
      email: "",
      mobileNo: "",
      employeName: "",
      departmentId: "",
      subDepartmentId: "",
      designationId: "",
      roleId: "",
      password: "",
    })
    setNewEmployeeErrors({})
  }

  // Effects
  useEffect(() => {
    getRoles()
    getEmployees()
    getDepartments()
    getDesignations()
  }, [])

  useEffect(() => {
    getEmployees(searchTerm, statusFilter)
  }, [searchTerm, statusFilter])

  useEffect(() => {
    if (newEmployeeData.departmentId) {
      getSubDepartments(newEmployeeData.departmentId)
      setNewEmployeeData((prev) => ({
        ...prev,
        subDepartmentId: "",
        designationId: "",
      }))
    }
  }, [newEmployeeData.departmentId])

  useEffect(() => {
    if (editEmployeeData.departmentId) {
      getSubDepartments(editEmployeeData.departmentId)
    }
  }, [editEmployeeData.departmentId])

  // Role DataGrid columns
  const roleColumns = [
    {
      field: "serialNo",
      headerName: "S.No",
      width: 80,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderHeader: () => (
        <Tooltip title="Serial Number">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <Typography variant="body2" fontWeight={600} color="white">
              S.No
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textAlign: "center", width: "100%", fontWeight: 500 }}>
          {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Role Name",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Tooltip title="Name of the employee role or position">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <RoleIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography variant="body2" fontWeight={600} color="white">
              Role Name
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Tooltip title={`Role: ${params.value}`} placement="top">
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "flex-start",
                width: "100%",
                maxWidth: 180,
              }}
            >
              <Security sx={{ fontSize: 16, color: "#1976d2" }} />
              <Typography variant="body2" fontWeight={500} sx={{ textAlign: "left" }}>
                {params.value}
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 0.8,
      minWidth: 150,
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", width: "100%" }}>
            <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      minWidth: 120,
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
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
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
          </Box>
        )
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
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
        const isActive = params.row.status === "active"
        return (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: "100%", justifyContent: "center" }}>
            <Tooltip title="Edit role details" placement="top">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditRole(params.row)
                }}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={isActive ? "Deactivate Role" : "Activate Role"} placement="top">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteRole(params.row.id)
                }}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: isActive ? "#d32f2f" : "#2e7d32",
                  color: "white",
                  "&:hover": {
                    backgroundColor: isActive ? "#c62828" : "#1b5e20",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {isActive ? <ToggleOffIcon sx={{ fontSize: 16 }} /> : <ToggleOnIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  // Employee DataGrid columns
  const getEmployeeColumns = () => {
    const baseColumns = [
      {
        field: "employeUniqueId",
        headerName: "Employee ID",
        flex: isMobile ? 1 : 0.8,
        minWidth: isMobile ? 120 : 140,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Tooltip title="Unique employee identification number">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <Person sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                {isMobile ? "ID" : "Employee ID"}
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => (
          <Tooltip title={`Employee ID: ${params.value || "Not assigned"}`} placement="top">
            <Typography variant="body2" sx={{ textAlign: "center", width: "100%" }} noWrap>
              {truncateText(params.value || "N/A", 15)}
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: "employeName",
        headerName: "Name",
        flex: isMobile ? 1.2 : 1,
        minWidth: isMobile ? 160 : 200,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Tooltip title="Employee full name and username">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              <Person sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                Name
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography variant="body2" sx={{ fontWeight: 500, textTransform: "capitalize" }} noWrap>
              {truncateText(params.value, 20) || "-"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "userName",
        headerName: "User Name",
        flex: isMobile ? 1.2 : 1,
        minWidth: isMobile ? 160 : 200,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Tooltip title="Employee User Name">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              <Person sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                User Name
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            {params.row.userName && (
              <Typography variant="caption" sx={{ color: "#64748b" }} noWrap>
                {params.row.userName}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: "email",
        headerName: "Email",
        flex: isMobile ? 1.5 : 1.2,
        minWidth: isMobile ? 160 : 200,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Tooltip title="Employee email address">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <Email sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                Email
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => (
          <Tooltip title={`Email: ${params.value}`} placement="top">
            <Typography variant="body2" sx={{ textAlign: "center", width: "100%" }} noWrap>
              {truncateText(params.value, 25)}
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: "department",
        headerName: "Department",
        flex: isMobile ? 1.2 : 1,
        minWidth: isMobile ? 140 : 160,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Tooltip title="Employee department and sub-department">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <BusinessIcon sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                Department
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography variant="body2" noWrap>
              {params.value}
            </Typography>
            {params.row.subDepartment && params.row.subDepartment !== "" && (
              <Typography variant="caption" sx={{ color: "#64748b" }} noWrap>
                {params.row.subDepartment}
              </Typography>
            )}
          </Box>
        ),
      },
      ...(!isMobile
        ? [
          {
            field: "designation",
            headerName: "Designation",
            flex: 0.8,
            minWidth: 120,
            headerAlign: "center",
            align: "center",
            renderHeader: () => (
              <Tooltip title="Employee job designation">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                  <WorkIcon sx={{ fontSize: 16, color: "white" }} />
                  <Typography variant="body2" fontWeight={600} color="white" noWrap>
                    Designation
                  </Typography>
                </Box>
              </Tooltip>
            ),
            renderCell: (params) => (
              <Tooltip title={`Designation: ${params.value}`} placement="top">
                <Typography variant="body2" sx={{ textAlign: "center", width: "100%" }} noWrap>
                  {params.value}
                </Typography>
              </Tooltip>
            ),
          },
        ]
        : []),
      {
        field: "roleName",
        headerName: "Role",
        flex: isMobile ? 1 : 0.8,
        minWidth: isMobile ? 100 : 120,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Tooltip title="Assigned role">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <RoleIcon sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                Role
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => (
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            {params.value && params.value !== "" ? (
              <Chip
                label={truncateText(params.value, 15)}
                size="small"
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontSize: "0.7rem",
                  height: 24,
                  fontWeight: 500,
                }}
              />
            ) : (
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                No role
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        flex: isMobile ? 0.8 : 0.7,
        minWidth: isMobile ? 80 : 100,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Tooltip title="Employee status">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <StatusIcon sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
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
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <Chip
                label={statusLabel}
                color={statusColor}
                size="small"
                sx={{
                  borderRadius: "20px",
                  fontSize: "0.7rem",
                  height: 24,
                  minWidth: 60,
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          )
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: isMobile ? 1 : 0.8,
        minWidth: 100,
        headerAlign: "center",
        sortable: false,
        filterable: false,
        renderHeader: () => (
          <Tooltip title="Available actions">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <SettingsIcon sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                Actions
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => {
          const isActive = params.row.status === "active"
          return (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", width: "100%", justifyContent: "center" }}>
              <Tooltip title={isActive ? "Deactivate Employee" : "Activate Employee"} placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEmployeeStatusToggle(params.row._id, params.row.status)
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: isActive ? "#d32f2f" : "#2e7d32",
                    color: "white",
                    "&:hover": {
                      backgroundColor: isActive ? "#c62828" : "#1b5e20",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {isActive ? <ToggleOffIcon sx={{ fontSize: 14 }} /> : <ToggleOnIcon sx={{ fontSize: 14 }} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Employee" placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditEmployee(params.row)
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: "#1976d2",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )
        },
      },
    ]
    return baseColumns
  }

  // Updated permission sections - always show all sections when in dialog
  const getFilteredPermissionSections = (apiPermissions) => {
    const permissionSections = [
      {
        title: "Organization Setup",
        icon: <BusinessIcon />,
        visibility: true, // Organization setup is always visible
        permissionKey: null, // No specific permission key needed
        permissions: [
          { key: "organizationSetup.organizationSetup", label: "Organization Setup", parent: "organizationSetup" },
          { key: "organizationSetup.branchSetup", label: "Branch Setup", parent: "organizationSetup" },
          { key: "organizationSetup.workLocationSetup", label: "Work Location Setup", parent: "organizationSetup" },
          { key: "organizationSetup.departmentTypeSetup", label: "Department Type Setup", parent: "organizationSetup" },
          { key: "organizationSetup.designationSetup", label: "Designation Setup", parent: "organizationSetup" },
          { key: "organizationSetup.employeeTypeSetup", label: "Employee Type Setup", parent: "organizationSetup" },
          {
            key: "organizationSetup.employeeAndRoleManagement",
            label: "Employee & Role Management",
            parent: "organizationSetup",
          },
          { key: "organizationSetup.workModeSetup", label: "Work Mode Setup", parent: "organizationSetup" },
        ],
      },
      {
        title: "Recruitment & Hiring",
        icon: <WorkIcon />,
        visibility: apiPermissions?.RecruitmentHiring || false,
        permissionKey: "RecruitmentHiring",
        permissions: [
          { key: "RecruitmentHiring.budgetSetup", label: "Budget Setup", parent: "RecruitmentHiring" },
          { key: "RecruitmentHiring.aiSetup", label: "AI Setup", parent: "RecruitmentHiring" },
          { key: "RecruitmentHiring.careerPageSetting", label: "Career Page Setting", parent: "RecruitmentHiring" },
          { key: "RecruitmentHiring.idSetup", label: "ID Setup", parent: "RecruitmentHiring" },
          { key: "RecruitmentHiring.qualificationSetup", label: "Qualification Setup", parent: "RecruitmentHiring" },
          { key: "RecruitmentHiring.targetCompany", label: "Target Company", parent: "RecruitmentHiring" },
          { key: "RecruitmentHiring.agencySetup", label: "Agency Setup", parent: "RecruitmentHiring" },
          { key: "RecruitmentHiring.jobDescriptionSetup", label: "Job Description Setup", parent: "RecruitmentHiring" },
          { key: "RecruitmentHiring.CandidateDocumentCollection", label: "Candidate Document Collection Setup", parent: "RecruitmentHiring" },
        ],
      },
      {
        title: "Interview Management",
        icon: <Presentation />,
        visibility: apiPermissions?.InterviewManagement || false,
        permissionKey: "InterviewManagement",
        permissions: [
          {
            key: "InterviewManagement.callingAgentCreation",
            label: "Authorization to Call",
            parent: "InterviewManagement",
          },
          {
            key: "InterviewManagement.interviewCanViewSelf",
            label: "Interview Can View Self",
            parent: "InterviewManagement",
          },
          {
            key: "InterviewManagement.interviewCanViewAll",
            label: "Interview Can View All",
            parent: "InterviewManagement",
          },
          {
            key: "InterviewManagement.callingLogDashboard",
            label: "Call Logs Dashboard",
            parent: "InterviewManagement",
          },
        ],
      },
      {
        title: "Asset Management",
        icon: <BusinessIcon />,
        visibility: apiPermissions?.assetManagement || false,
        permissionKey: "assetManagement",
        permissions: [
          { key: "assetManagement.assetEquipmentSetup", label: "Asset Equipment Setup", parent: "assetManagement" },
          { key: "assetManagement.assetCategoriesSetup", label: "Asset Categories Setup", parent: "assetManagement" },
          { key: "assetManagement.assetPermissionsSetup", label: "Asset Permissions Setup", parent: "assetManagement" },
        ],
      },
      {
        title: "Expense Management",
        icon: <BusinessIcon />,
        visibility: apiPermissions?.expenseManagement || false,
        permissionKey: "expenseManagement",
        permissions: [
          { key: "expenseManagement.expensePoliciesSetup", label: "Expense Policies Setup", parent: "expenseManagement" },
          { key: "expenseManagement.expenseConfigSetup", label: "Expense Config Setup", parent: "expenseManagement" },
          {
            key: "expenseManagement.expenseCategoriesSetup",
            label: "Expense Categories Setup",
            parent: "expenseManagement",
          },
          { key: "expenseManagement.expenseTypesSetup", label: "Expense Types Setup", parent: "expenseManagement" },
          {
            key: "expenseManagement.expenseRolePermissionSetup",
            label: "Expense Role Permission Setup",
            parent: "expenseManagement",
          },
        ],
      },
      {
        title: "Management Features",
        icon: <SettingsIcon />,
        visibility: apiPermissions?.managementFeatures || false,
        permissionKey: "managementFeatures",
        permissions: [
          { key: "managementFeatures.CustomPdfTemplate", label: "Custom PDF Template", parent: "managementFeatures" },
          { key: "managementFeatures.masterDropdownSetup", label: "Master Dropdown Setup", parent: "managementFeatures" },
          { key: "managementFeatures.mailSwitchSetup", label: "Mail Switch Setup", parent: "managementFeatures" },
        ],
      },
      {
        title: "Additional Features",
        icon: <StarsRoundedIcon />,
        visibility: apiPermissions?.fileManager || apiPermissions?.notes || apiPermissions?.chat || false,
        permissionKey: null, // Multiple keys, so we handle visibility with custom logic
        permissions: [
          { key: "fileManager", label: "File Manager", show: apiPermissions?.fileManager },
          { key: "notes", label: "Notes", show: apiPermissions?.notes },
          { key: "chat", label: "Chat", show: apiPermissions?.chat },
        ].filter(permission => permission.show), // Filter out permissions that shouldn't show
      },
      {
        title: "System Operations",
        icon: <SettingsIcon />,
        visibility: apiPermissions?.CommandExe || apiPermissions?.LeadExe || false,
        permissionKey: null, // Multiple keys
        permissions: [
          { key: "CommandExe", label: "Command Execution", show: apiPermissions?.CommandExe },
          { key: "LeadExe", label: "Lead Execution", show: apiPermissions?.LeadExe },
        ].filter(permission => permission.show),
      },
      {
        title: "CommandExe Setup",
        icon: <BusinessIcon />,
        visibility: apiPermissions?.CommandExe || false,
        permissionKey: "CommandExe",
        permissions: [
          { key: "commandExeSetup.addCase", label: "Add cases Setup", parent: "CommandExe" },
          { key: "commandExeSetup.backOffice", label: "BackOffice Cases", parent: "CommandExe" },
          { key: "commandExeSetup.invoice", label: "Invoice Setup", parent: "CommandExe" },
          { key: "commandExeSetup.client", label: "Client Setup", parent: "CommandExe" },
          { key: "commandExeSetup.pdfTemplate", label: "Template Setup", parent: "CommandExe" },
          { key: "commandExeSetup.initField", label: "InitField Setup", parent: "CommandExe" },
          { key: "commandExeSetup.variable", label: "Variable Setup", parent: "CommandExe" },
          { key: "commandExeSetup.addAdmin", label: "Add Admin Setup", parent: "CommandExe" },
          { key: "commandExeSetup.service", label: "Service Setup", parent: "CommandExe" },
        ],
      },
      {
        title: "Verification Suite",
        icon: <VerifiedOutlinedIcon />,
        visibility: apiPermissions?.verificationSuite || false,
        permissionKey: "verificationSuite",
        permissions: [
          { key: "verificationSuite.setup", label: "Setup", parent: "verificationSuite" },
        ],
      },
    ]

    // Filter sections based on visibility
    return permissionSections.filter(section => section.visibility)
  }

  return (
    <Container maxWidth="xl" sx={{ minHeight: "100vh", py: 3, backgroundColor: "#f8fafc" }}>
      {/* Streamlined Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <DashboardIcon sx={{ fontSize: 24, color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: "white", mb: 0.5 }}>
                Employee & Role Management
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, color: "white" }}>
                Comprehensive management system for employees, roles, and permissions
              </Typography>
            </Box>
          </Box>
          <Button
            sx={{
              borderRadius: "20px",
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.25)",
              },
            }}
            variant="outlined"
            onClick={() => router.push("/employeeSetup")}
          >
            <KeyboardBackspaceIcon />
          </Button>
        </Box>
      </Paper>

      {/* Main Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <Tabs
          value={mainTabValue}
          onChange={handleMainTabChange}
          sx={{
            backgroundColor: "#ffffff",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              minHeight: 64,
              color: "#64748b",
              "&.Mui-selected": {
                color: "#1976d2",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1976d2",
              height: 3,
            },
          }}
        >
          <Tab icon={<Security />} label="Role Management" iconPosition="start" />
          <Tab icon={<People />} label="Employee Management" iconPosition="start" />
          {/* <Tab icon={<Assignment />} label="Role Assignment" iconPosition="start" /> */}
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={mainTabValue} index={0}>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Security sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Role Management
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Customize access based on role hierarchy
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddRoleDialog(true)}
              sx={{
                borderRadius: "20px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#1976d2",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Add Role
            </Button>
          </Box>
          <DataGrid
            rows={roles}
            columns={roleColumns}
            loading={roleLoading || apiLoading}
            pagination
            pageSizeOptions={[5, 10, 20, 50]}
            disableRowSelectionOnClick
            autoHeight
            slots={{
              toolbar: CustomToolbar,
            }}
            sx={{
              width: "100%",
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
      </TabPanel>

      <TabPanel value={mainTabValue} index={1}>
        {/* Employee Management with DataGrid */}
        <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Box
            sx={{
              color: "black",
              p: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <People sx={{ fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Employee Management
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Manage employee information, status, and assignments
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => {
                  resetEmployeeForm()
                  setAddEmployeeDialog(true)
                }}
                sx={{
                  color: "white",
                  borderRadius: "20px",
                  px: 3,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Add Employee
              </Button>
            </Box>
          </Box>
          <CardContent sx={{ p: 3, backgroundColor: "white" }}>
            {/* Search and Filter Controls */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search employees by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status Filter</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    input={<OutlinedInput label="Status Filter" />}
                    sx={{
                      borderRadius: "20px",
                    }}
                  >
                    <MenuItem value="active">Active Employees</MenuItem>
                    <MenuItem value="inactive">Inactive Employees</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* Employee DataGrid */}
            <ErrorBoundary>
              <DataGrid
                rows={filteredEmployees}
                columns={getEmployeeColumns()}
                getRowId={(row) => row._id}
                loading={employeeLoading}
                pagination
                pageSizeOptions={[10, 25, 50, 100]}
                disableRowSelectionOnClick
                slots={{
                  toolbar: CustomToolbar,
                }}
                sx={{
                  minHeight: 400,
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
            </ErrorBoundary>
          </CardContent>
        </Paper>
      </TabPanel>

      <TabPanel value={mainTabValue} index={2}>
        {/* Role Assignment */}
        {/* <Paper
          sx={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: 2,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              color: "black",
              p: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Assignment sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Assign Role to Employee
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Select a role and employee to create the assignment
                </Typography>
              </Box>
            </Box>
          </Box>
          <CardContent sx={{ p: 4, backgroundColor: "white" }}>
            <form onSubmit={handleAssignRole}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.selectedRole}>
                    <InputLabel>Select Role</InputLabel>
                    <Select
                      name="selectedRole"
                      value={assignmentData.selectedRole}
                      onChange={handleAssignmentChange}
                      input={
                        <OutlinedInput
                          label="Select Role"
                          startAdornment={
                            <InputAdornment position="start">
                              <Group sx={{ color: "#64748b" }} />
                            </InputAdornment>
                          }
                        />
                      }
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.selectedRole && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {formErrors.selectedRole}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!assignmentData.selectedRole} error={!!formErrors.selectedEmployee}>
                    <InputLabel>Select Employee</InputLabel>
                    <Select
                      name="selectedEmployee"
                      value={assignmentData.selectedEmployee}
                      onChange={handleAssignmentChange}
                      input={
                        <OutlinedInput
                          label="Select Employee"
                          startAdornment={
                            <InputAdornment position="start">
                              <Person sx={{ color: "#64748b" }} />
                            </InputAdornment>
                          }
                        />
                      }
                    >
                      {filteredEmployees.map((employee) => (
                        <MenuItem key={employee._id} value={employee._id}>
                          {employee.employeName}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.selectedEmployee && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {formErrors.selectedEmployee}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setAssignmentData({
                          selectedRole: "",
                          selectedEmployee: "",
                        })
                      }
                      disabled={apiLoading}
                      sx={{
                        borderRadius: "20px",
                        px: 3,
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={apiLoading || !assignmentData.selectedRole || !assignmentData.selectedEmployee}
                      sx={{
                        minWidth: 140,
                        backgroundColor: "#1976d2",
                        "&:hover": {
                          backgroundColor: "#1565c0",
                        },
                        borderRadius: "20px",
                        px: 3,
                      }}
                    >
                      {apiLoading ? "Assigning..." : "Assign Role"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Paper> */}
      </TabPanel>

      {/* Add/Edit Role Dialog */}
      <Dialog
        open={addRoleDialog}
        onClose={resetRoleForm}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Security sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
              {isEditMode ? "Edit Role" : "Create New Role"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: "white" }}>
              {isEditMode ? "Update role permissions and settings" : "Define role permissions and access levels"}
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <IconButton onClick={resetRoleForm} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="Role Name"
              value={permissions.roleName}
              onChange={(e) => handlePermissionChange("roleName", e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security sx={{ color: "#64748b" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="h6" sx={{ mb: 2, color: "#1f2937", fontWeight: 600 }}>
              Permission Settings
            </Typography>

            {/* Use filtered permission sections */}
            {getFilteredPermissionSections(tabVisibility || {}).map((section, index) => (
              <Accordion key={index} sx={{ mb: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {section.icon}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {section.permissions.map((permission) => (
                      <Grid item xs={12} sm={6} md={4} key={permission.key}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                permission.parent
                                  ? permissions[permission.parent]?.[permission.key.split(".")[1]] || false
                                  : permissions[permission.key] || false
                              }
                              onChange={(e) => {
                                if (permission.parent) {
                                  handleNestedPermissionChange(
                                    permission.parent,
                                    permission.key.split(".")[1],
                                    e.target.checked,
                                  )
                                } else {
                                  handlePermissionChange(permission.key, e.target.checked)
                                }
                              }}
                              sx={{
                                color: "#1976d2",
                                "&.Mui-checked": {
                                  color: "#1976d2",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                              {permission.label}
                            </Typography>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* Conditional LinkedIn Permissions */}
            {(tabVisibility?.RecruitmentHiring) && (
              <Accordion sx={{ mb: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <ShareIcon />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      LinkedIn Management
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {[
                      { key: "setup", label: "LinkedIn Setup" },
                      { key: "dashboard", label: "Dashboard" },
                      { key: "createPost", label: "Create Post" },
                    ].map((permission) => (
                      <Grid item xs={12} sm={6} md={4} key={permission.key}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={permissions.RecruitmentHiring?.linkedin?.[permission.key] || false}
                              onChange={(e) =>
                                handleDoubleNestedPermissionChange(
                                  "RecruitmentHiring",
                                  "linkedin",
                                  permission.key,
                                  e.target.checked,
                                )
                              }
                              sx={{
                                color: "#1976d2",
                                "&.Mui-checked": {
                                  color: "#1976d2",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                              {permission.label}
                            </Typography>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Conditional Job Post Dashboard Permissions */}
            {(tabVisibility?.RecruitmentHiring) && (
              <Accordion sx={{ mb: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <AssignmentIcon />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Job Post Dashboard
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {[
                      { key: "canViewAll", label: "Can View All" },
                      { key: "canViewSelf", label: "Can View Self" },
                      { key: "newJobPost", label: "New Job Post" },
                      { key: "canToggleStatus", label: "Can Toggle Status" },
                      { key: "jobPostApprove", label: "Job Post Approve" },
                    ].map((permission) => (
                      <Grid item xs={12} sm={6} md={4} key={permission.key}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={permissions.RecruitmentHiring?.jobPostDashboard?.[permission.key] || false}
                              onChange={(e) =>
                                handleDoubleNestedPermissionChange(
                                  "RecruitmentHiring",
                                  "jobPostDashboard",
                                  permission.key,
                                  e.target.checked,
                                )
                              }
                              sx={{
                                color: "#1976d2",
                                "&.Mui-checked": {
                                  color: "#1976d2",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                              {permission.label}
                            </Typography>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Conditional Job Applications Permissions */}
            {(tabVisibility?.RecruitmentHiring) && (
              <Accordion sx={{ mb: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PeopleIcon />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Job Applications
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {[
                      { key: "canViewAll", label: "Can View All" },
                      { key: "canViewSelf", label: "Can View Self" },
                      { key: "canApproveReject", label: "Can Approve/Reject" },
                      { key: "candidateMap", label: "Candidate Map" },
                    ].map((permission) => (
                      <Grid item xs={12} sm={6} md={4} key={permission.key}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={permissions.RecruitmentHiring?.jobApplications?.[permission.key] || false}
                              onChange={(e) =>
                                handleDoubleNestedPermissionChange(
                                  "RecruitmentHiring",
                                  "jobApplications",
                                  permission.key,
                                  e.target.checked,
                                )
                              }
                              sx={{
                                color: "#1976d2",
                                "&.Mui-checked": {
                                  color: "#1976d2",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                              {permission.label}
                            </Typography>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3, backgroundColor: "#f8fafc" }}>
          <Button onClick={resetRoleForm} disabled={roleLoading} sx={{ borderRadius: "20px" }}>
            Cancel
          </Button>
          <Button
            onClick={isEditMode ? handleSubmitEditRole : handleSubmitRole}
            variant="contained"
            disabled={roleLoading || !permissions.roleName.trim()}
            sx={{
              minWidth: 120,
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
              borderRadius: "20px",
            }}
          >
            {roleLoading ? <CircularProgress size={20} color="inherit" /> : isEditMode ? "Update Role" : "Create Role"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog
        open={addEmployeeDialog}
        onClose={() => setAddEmployeeDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <PersonAdd sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
              Add New Employee
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: "white" }}>
              Create a new employee account with basic information and assign role
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <IconButton onClick={() => setAddEmployeeDialog(false)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleCreateEmployee}>
            <Grid container spacing={3} sx={{ paddingTop: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="userName"
                  value={newEmployeeData.userName}
                  onChange={handleNewEmployeeChange}
                  error={!!newEmployeeErrors.userName}
                  helperText={newEmployeeErrors.userName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  name="employeName"
                  value={newEmployeeData.employeName}
                  onChange={handleNewEmployeeChange}
                  error={!!newEmployeeErrors.employeName}
                  helperText={newEmployeeErrors.employeName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newEmployeeData.email}
                  onChange={handleNewEmployeeChange}
                  error={!!newEmployeeErrors.email}
                  helperText={newEmployeeErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobileNo"
                  value={newEmployeeData.mobileNo}
                  onChange={handleNewEmployeeChange}
                  error={!!newEmployeeErrors.mobileNo}
                  helperText={newEmployeeErrors.mobileNo}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!newEmployeeErrors.departmentId}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="departmentId"
                    value={newEmployeeData.departmentId}
                    onChange={handleNewEmployeeChange}
                    input={
                      <OutlinedInput
                        label="Department"
                        startAdornment={
                          <InputAdornment position="start">
                            <Business sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        }
                      />
                    }
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {newEmployeeErrors.departmentId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {newEmployeeErrors.departmentId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={!newEmployeeData.departmentId}>
                  <InputLabel>Sub Department (Optional)</InputLabel>
                  <Select
                    name="subDepartmentId"
                    value={newEmployeeData.subDepartmentId}
                    onChange={handleNewEmployeeChange}
                    input={
                      <OutlinedInput
                        label="Sub Department (Optional)"
                        startAdornment={
                          <InputAdornment position="start">
                            <Business sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        }
                      />
                    }
                  >
                    {subDepartments.map((subDept) => (
                      <MenuItem key={subDept._id} value={subDept._id}>
                        {subDept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!newEmployeeErrors.designationId}>
                  <InputLabel>Designation</InputLabel>
                  <Select
                    name="designationId"
                    value={newEmployeeData.designationId}
                    onChange={handleNewEmployeeChange}
                    disabled={!newEmployeeData.departmentId}
                    input={
                      <OutlinedInput
                        label="Designation"
                        startAdornment={
                          <InputAdornment position="start">
                            <Work sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        }
                      />
                    }
                  >
                    {getFilteredDesignations().map((designation) => (
                      <MenuItem key={designation.id} value={designation.id}>
                        {designation.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {newEmployeeErrors.designationId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {newEmployeeErrors.designationId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!newEmployeeErrors.roleId}>
                  <InputLabel>Assign Role</InputLabel>
                  <Select
                    name="roleId"
                    value={newEmployeeData.roleId}
                    onChange={handleNewEmployeeChange}
                    input={
                      <OutlinedInput
                        label="Assign Role"
                        startAdornment={
                          <InputAdornment position="start">
                            <RoleIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        }
                      />
                    }
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {newEmployeeErrors.roleId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {newEmployeeErrors.roleId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={newEmployeeData.password}
                  onChange={handleNewEmployeeChange}
                  error={!!newEmployeeErrors.password}
                  helperText={newEmployeeErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3, backgroundColor: "#f8fafc" }}>
          <Button
            onClick={() => setAddEmployeeDialog(false)}
            disabled={addEmployeeLoading}
            sx={{ borderRadius: "20px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateEmployee}
            variant="contained"
            disabled={addEmployeeLoading}
            sx={{
              minWidth: 140,
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              borderRadius: "20px",
            }}
          >
            {addEmployeeLoading ? <CircularProgress size={20} color="inherit" /> : "Create Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog
        open={editEmployeeDialog}
        onClose={() => setEditEmployeeDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <EditIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
              Edit Employee
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: "white" }}>
              Update employee information and assignments
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <IconButton onClick={() => setEditEmployeeDialog(false)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleUpdateEmployee}>
            <Grid container spacing={3} sx={{ paddingTop: 4 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="userName"
                  value={editEmployeeData.userName || ""}
                  onChange={handleEditEmployeeChange}
                  disabled={true}
                  helperText="Username cannot be changed after creation"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#9e9e9e",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  name="employeName"
                  value={editEmployeeData.employeName || ""}
                  onChange={handleEditEmployeeChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={editEmployeeData.email || ""}
                  onChange={handleEditEmployeeChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="departmentId"
                    value={editEmployeeData.departmentId || ""}
                    onChange={handleEditEmployeeChange}
                    input={
                      <OutlinedInput
                        label="Department"
                        startAdornment={
                          <InputAdornment position="start">
                            <Business sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        }
                      />
                    }
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!editEmployeeData.departmentId}>
                  <InputLabel>Sub Department (Optional)</InputLabel>
                  <Select
                    name="subDepartmentId"
                    value={editEmployeeData.subDepartmentId || ""}
                    onChange={handleEditEmployeeChange}
                    input={
                      <OutlinedInput
                        label="Sub Department (Optional)"
                        startAdornment={
                          <InputAdornment position="start">
                            <Business sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        }
                      />
                    }
                  >
                    {subDepartments.map((subDept) => (
                      <MenuItem key={subDept._id} value={subDept._id}>
                        {subDept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!editEmployeeData.departmentId}>
                  <InputLabel>Designation</InputLabel>
                  <Select
                    name="designationId"
                    value={editEmployeeData.designationId || ""}
                    onChange={handleEditEmployeeChange}
                    input={
                      <OutlinedInput
                        label="Designation"
                        startAdornment={
                          <InputAdornment position="start">
                            <Work sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        }
                      />
                    }
                  >
                    {getFilteredDesignationsForEdit().map((designation) => (
                      <MenuItem key={designation.id} value={designation.id}>
                        {designation.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Role</InputLabel>
                  <Select
                    name="roleId"
                    value={editEmployeeData.roleId || ""}
                    onChange={handleEditEmployeeChange}
                    input={
                      <OutlinedInput
                        label="Assign Role"
                        startAdornment={
                          <InputAdornment position="start">
                            <RoleIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        }
                      />
                    }
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3, backgroundColor: "#f8fafc" }}>
          <Button
            onClick={() => setEditEmployeeDialog(false)}
            disabled={editEmployeeLoading}
            sx={{ borderRadius: "20px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateEmployee}
            variant="contained"
            disabled={editEmployeeLoading}
            sx={{
              minWidth: 120,
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
              borderRadius: "20px",
            }}
          >
            {editEmployeeLoading ? <CircularProgress size={20} color="inherit" /> : "Update Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} variant="filled" severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
