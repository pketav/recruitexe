"use client"
import { useState, useEffect, useCallback } from "react"
import {
  Container,
  Typography,
  Box,
  IconButton,
  Modal,
  Chip,
  FormControl,
  InputLabel,
  Switch,
  Select,
  MenuItem,
  Button,
  Checkbox,
  ListItemText,
  Grid,
  Snackbar,
  Divider,
  Alert,
  Stack,
  Paper,
  Avatar,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  Pagination,
} from "@mui/material"
import {
  Add as AddIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon,
  Groups as GroupsIcon,
  Schedule as ScheduleIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Close,
  FileUpload,
  PictureAsPdf as PdfIcon,
  CloudUpload,
} from "@mui/icons-material"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import { styled, alpha } from "@mui/material/styles"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import axios from "axios"
import { useRouter } from "next/navigation"
import InputAdornment from "@mui/material/InputAdornment"
import { useApi } from "@core/hooks/useApi"
import { CloudUploadIcon } from 'lucide-react'

// Helper function to safely handle arrays
const safeArray = (value) => {
  if (Array.isArray(value)) return value
  if (value === null || value === undefined) return []
  return []
}

// Helper function to safely get string values
const safeString = (value) => {
  if (typeof value === "string") return value
  if (value === null || value === undefined) return ""
  return String(value)
}

// Helper function to safely get object properties
const safeObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value
  return {}
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 600 },
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  p: 0,
  outline: "none",
}

// Enhanced styled components for better visual design
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  fontFamily: '"Inter", "Roboto", sans-serif',
  "& .MuiDataGrid-main": {
    borderRadius: "12px",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f8fafc",
    color: "#475569",
    fontWeight: 600,
    fontSize: "14px",
    borderBottom: "2px solid #e2e8f0",
    borderRadius: "12px 12px 0 0",
  },
  "& .MuiDataGrid-columnHeader": {
    "&:focus": {
      outline: "none",
    },
    "&:focus-within": {
      outline: "none",
    },
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-row": {
    borderBottom: "1px solid #f1f5f9",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f8fafc",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    "&.even": {
      backgroundColor: "#ffffff",
    },
    "&.odd": {
      backgroundColor: "#fafbfc",
    },
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    fontSize: "14px",
    color: "#334155",
    padding: theme.spacing(1.5),
    "&:focus": {
      outline: "none",
    },
    "&:focus-within": {
      outline: "none",
    },
  },
  // "& .MuiDataGrid-footerContainer": {
  //   borderTop: "2px solid #e2e8f0",
  //   backgroundColor: "#f8fafc",
  //   borderRadius: "0 0 12px 12px",
  // },
}))

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderRadius: "8px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#e2e8f0",
    transform: "scale(1.1)",
  },
}))

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: "20px",
  fontWeight: 600,
  fontSize: "12px",
  textTransform: "capitalize",
  minWidth: "80px",
  ...(status === "active" && {
    backgroundColor: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
  }),
  ...(status === "inactive" && {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  }),
}))

// Clean Dashboard-Style Header Component
const DashboardHeader = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: "0px",
}))

// Dashboard-Style Metric Card
const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  textAlign: "left",
  transition: "all 0.2s ease",
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
}))

// Budget Info Card Component
const BudgetInfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
}))

// Enhanced filter button with animation
const FilterButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 600,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
  transition: "all 0.2s ease",
}))

export default function JobPost(filterProps) {
  const TimePeriod = filterProps.period
  // Convert to 'YYYY-MM-DD' string format
  const startDate = filterProps.customStartDate
    ? new Date(filterProps.customStartDate).toISOString().split("T")[0]
    : ""
  const endDate = filterProps.customEndDate
    ? new Date(filterProps.customEndDate).toISOString().split("T")[0]
    : ""

  const [vacancies, setVacancies] = useState([])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [totalItems, setTotalItems] = useState(0)
  const [allCounts, setAllCounts] = useState({
    totalJobPosts: 0,
    totalActivePosts: 0,
    totalInactivePosts: 0,
    totalPositions: 0,
    totalPending: 0
  })

  const [token, setToken] = useState(null)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter()
  const [jobPostModal, setJobPostModal] = useState(false)
  const [vacancySelected, setVacancySelected] = useState({})
  const [employmentTypes, setemploymentTypes] = useState([])
  const [jobDescription, setJobDescription] = useState({})
  const steps = ["Basic Details", "Job Opening Info", "Job Description"]
  const [jobDesc, setJobDesc] = useState("")
  const [openAdd, setOpenAdd] = useState(false)
  const [departments, setDepartments] = useState([])
  const [subDepartments, setSubDepartments] = useState([])
  const [branches, setBranches] = useState([])
  const [mode, setMode] = useState("")
  const [editVacancy, setEditVacancy] = useState({})
  const [desc, setDesc] = useState("")
  const [openDesc, setOpenDesc] = useState(false)
  const [designation, setDesignation] = useState([])
  const [Budget, setBudget] = useState(0)
  const [organizations, setOrganizations] = useState([])
  const [qualifications, setQualifications] = useState([])
  const [employeeTypes, setEmployeeTypes] = useState([])
  const [status, setStatus] = useState("all")
  const [activeStep, setActiveStep] = useState(0)
  const [getJd, setGetJD] = useState(false)
  const [ailoading, setAiLoading] = useState(false)
  const [skillInput, setSkillInput] = useState("")
  const [enableExpiry, setEnableExpiry] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  const [apiDataPermissions, setApiDataPermissions] = useState(null) // Changed to null initially
  const [permissionsLoaded, setPermissionsLoaded] = useState(false) // New state to track loading
  const [apiDataTogglePermissions, setApiDataTogglePermissions] = useState(false) // New state to track loading
  const [approvalModal, setApprovalModal] = useState(false)
  const [approvalAction, setApprovalAction] = useState("") // 'approve' or 'reject'
  const [approvalRemark, setApprovalRemark] = useState("")
  const [selectedJobPosts, setSelectedJobPosts] = useState([])
  const [jobPostApprovePermission, setJobPostApprovePermission] = useState(false)
  const [uploadBulk, setUploadBulk] = useState(false)
  const [pdfFiles, setPdfFiles] = useState([])
  const [resumeBulkIds, setResumeBulkIds] = useState({
    jobPostId: "",
    branchId: [],
  })

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || [])
    const validPdfs = files.filter((file) => file.type === "application/pdf")

    if (validPdfs.length !== files.length) {
      setSnackbar({
        message: "Only PDF files are allowed.",
        severity: "error",
        open: true,
      })
    }

    if (validPdfs.length === 0) return

    const formData = new FormData()
    validPdfs.forEach((file) => formData.append("files", file))

    try {
      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadMultiple`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token,
        },
      })

      const uploadedUrls = res.data.items || []
      setPdfFiles((prev) => [...prev, ...uploadedUrls])
    } catch (error) {
      console.error("Upload error:", error)
      setSnackbar({
        message: error?.response?.data?.message || "Upload failed.",
        severity: "error",
        open: true,
      })
    }
  }

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ p: 1, gap: 1, display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <GridToolbarColumnsButton startIcon={<ViewColumnIcon />} sx={{ color: "primary.main" }} />
          <GridToolbarFilterButton startIcon={<FilterIcon />} sx={{ color: "primary.main" }} />
          <GridToolbarDensitySelector startIcon={<SettingsIcon />} sx={{ color: "primary.main" }} />
        </Box>
        {jobPostApprovePermission && status == "pending" && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircleIcon />}
              onClick={handleApproveSelected}
              disabled={selectedJobPosts.length === 0}
            >
              Approve ({selectedJobPosts.length})
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<CancelIcon />}
              onClick={handleRejectSelected}
              disabled={selectedJobPosts.length === 0}
            >
              Reject ({selectedJobPosts.length})
            </Button>
          </Box>
        )}
      </GridToolbarContainer>
    )
  }

  const [error, setError] = useState(null)
  const { callApi, loading } = useApi()
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const [orgs, setOrgs] = useState({})

  const getUserRoleId = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData) {
        try {
          const parsedData = JSON.parse(userData)
          return parsedData?.roleId || null
        } catch (e) {
          console.error("Error parsing user data:", e)
          return null
        }
      }
    }
    return null
  }

  // Initialize token on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authToken = window.localStorage.getItem("authToken")
      setToken(authToken)
    }
  }, [])

  // Fetch role permissions - runs once on mount
  useEffect(() => {
    const fetchRolePermissions = async () => {
      const roleId = getUserRoleId()
      if (!roleId) {
        setError("No role ID found")
        setPermissionsLoaded(true)
        return
      }

      try {
        const result = await callApi({
          endpoint: `/v1/api/role/detail?roleId=${roleId}`,
          method: "GET",
          disableSnackbar: true,
        })

        if (result.success && result.data.items) {
          const ShowAllData = result.data.items.RecruitmentHiring.jobPostDashboard.canViewAll
          const ToggleStatus = result.data.items.RecruitmentHiring.jobPostDashboard.canToggleStatus
          const JobPostApprovePermission = result.data.items.RecruitmentHiring.jobPostDashboard.jobPostApprove

          setApiDataPermissions(ShowAllData ? "all" : "limited") // Set to meaningful value
          setApiDataTogglePermissions(ToggleStatus ? true : false)
          setJobPostApprovePermission(JobPostApprovePermission)
        } else {
          setApiDataPermissions("limited") // Default fallback
          setSnackbar({
            message: "Failed to fetch permissions",
            severity: "warning",
            open: true,
          })
        }
      } catch (err) {
        console.error("Error fetching role permissions:", err)
        setApiDataPermissions("limited") // Default fallback on error
      } finally {
        setPermissionsLoaded(true)
      }
    }

    fetchRolePermissions()
  }, []) // Only runs once on mount

  // Budget verification API call
  const verifyBudget = async (designationId, subDepartmentId) => {
    if (!designationId || !subDepartmentId || !token) {
      setBudgetInfo({
        allocatedBudget: 0,
        usedBudget: 0,
        allocatedBudgetLPA: "0.00",
        usedBudgetLPA: "0.00",
        numberOfEmployees: 0,
        remainingBudget: 0,
        remainingBudgetLPA: "0.00",
      })
      return
    }

    setBudgetLoading(true)
    setBudgetError("")

    try {
      const response = await axios.get(
        `${baseUrl}/v1/api/Budged/budgetVerify?desingationId=${designationId}&subDepartmentId=${subDepartmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )

      const responseData = safeObject(response.data)

      if (responseData.status && responseData.items) {
        const items = safeObject(responseData.items)
        const remainingBudget = items.allocatedBudget - items.usedBudget
        const remainingBudgetLPA = (
          Number.parseFloat(items.allocatedBudgetLPA) - Number.parseFloat(items.usedBudgetLPA)
        ).toFixed(2)

        setBudgetInfo({
          allocatedBudget: items.allocatedBudget || 0,
          usedBudget: items.usedBudget || 0,
          allocatedBudgetLPA: items.allocatedBudgetLPA || "0.00",
          usedBudgetLPA: items.usedBudgetLPA || "0.00",
          numberOfEmployees: items.numberOfEmployees || 0,
          remainingBudget: remainingBudget,
          remainingBudgetLPA: remainingBudgetLPA,
        })

        setAddVacancy((prev) => ({
          ...prev,
          budget: remainingBudgetLPA,
        }))
      } else {
        setBudgetError(`${responseData.message}`)
      }
    } catch (error) {
      console.error("Budget verification error:", error)
      setBudgetError(`${error.message}`)
      setBudgetInfo({
        allocatedBudget: 0,
        usedBudget: 0,
        allocatedBudgetLPA: "0.00",
        usedBudgetLPA: "0.00",
        numberOfEmployees: 0,
        remainingBudget: 0,
        remainingBudgetLPA: "0.00",
      })
    } finally {
      setBudgetLoading(false)
    }
  }

  // Budget Info Display Component
  const BudgetInfoDisplay = () => {
    if (budgetLoading) {
      return (
        <BudgetInfoCard>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={20} />
              <Typography>Loading budget information...</Typography>
            </Box>
          </CardContent>
        </BudgetInfoCard>
      )
    }

    if (budgetError) {
      return (
        <BudgetInfoCard>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <WarningIcon color="error" />
              <Typography color="error">{budgetError}</Typography>
            </Box>
          </CardContent>
        </BudgetInfoCard>
      )
    }

    if (budgetInfo.allocatedBudget === 0) {
      return null
    }

    const budgetUtilization = (budgetInfo.usedBudget / budgetInfo.allocatedBudget) * 100
    const isOverBudget = budgetInfo.remainingBudget < 0

    return (
      <BudgetInfoCard>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccountBalanceIcon color="primary" />
            Budget Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Allocated Budget
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{budgetInfo.allocatedBudget.toLocaleString()} ({budgetInfo.allocatedBudgetLPA} LPA)
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Used Budget
                </Typography>
                <Typography variant="h6" color="warning.main">
                  ₹{budgetInfo.usedBudget.toLocaleString()} ({budgetInfo.usedBudgetLPA} LPA)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Remaining Budget
                </Typography>
                <Typography
                  variant="h6"
                  color={isOverBudget ? "error.main" : "success.main"}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {isOverBudget ? <WarningIcon fontSize="small" /> : <TrendingUpIcon fontSize="small" />}₹
                  {Math.abs(budgetInfo.remainingBudget).toLocaleString()} ({budgetInfo.remainingBudgetLPA} LPA)
                  {isOverBudget && " (Over Budget)"}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Current Employees
                </Typography>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon fontSize="small" />
                  {budgetInfo.numberOfEmployees}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Budget Utilization: {budgetUtilization.toFixed(1)}%
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: 8,
                backgroundColor: "#f0f0f0",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${Math.min(budgetUtilization, 100)}%`,
                  height: "100%",
                  backgroundColor: budgetUtilization > 90 ? "#f44336" : budgetUtilization > 70 ? "#ff9800" : "#4caf50",
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </BudgetInfoCard>
    )
  }

  // Enhanced column definitions with better icons and styling
  const postColumns = [
    {
      field: "jobPostId",
      headerName: "Job ID",
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#e0e7ff", color: "#3730a3" }}>
            <WorkIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {params.value || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "position",
      headerName: "Position",
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#e0e7ff", color: "#3730a3" }}>
            <WorkIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {safeString(params.value) || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: "#f0f9ff", color: "#0369a1" }}>
            <BusinessIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight={500}>
            {safeString(params.value) || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "subDepartment",
      headerName: "Sub Department",
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: "#f0f9ff", color: "#0369a1" }}>
            <BusinessIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {safeString(params.value) || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "experience",
      headerName: "Experience",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
          <BadgeIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value === "Fresher" ? "Fresher" : `${params.value} year`}</Typography>
        </Box>
      ),
    },
    {
      field: "noOfPosition",
      headerName: "Positions",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, height: "100%" }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: "#f0fdf4", color: "#16a34a" }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight={600} color="primary">
            {params.value || 0}
          </Typography>
        </Box>
      ),
    },
    {
      field: "employmentType",
      headerName: "Employment Type",
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Chip
            icon={<WorkIcon fontSize="small" />}
            label={safeString(params.value) || "N/A"}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: "12px",
              fontWeight: 500,
              backgroundColor: "#f1f5f9",
              borderColor: "#cbd5e1",
            }}
          />
        </Box>
      ),
    },
    {
      field: "employeeType",
      headerName: "Employee Type",
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Chip
            icon={<AccessTimeIcon fontSize="small" />}
            label={safeString(params.value) || "N/A"}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: "12px",
              fontWeight: 500,
              backgroundColor: "#fef3c7",
              borderColor: "#fbbf24",
              color: "#92400e",
            }}
          />
        </Box>
      ),
    },
    {
      field: "branch",
      headerName: "Locations",
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {safeString(params.value)
              ?.split(",")
              .map((s) => s.trim())
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
              .join(", ") || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "package",
      headerName: "Package",
      width: 100,
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography variant="body2" fontWeight={500} color="success.main">
            {params.value ? `₹${params.value}` : "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Creation Date",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const dateStr = safeObject(params.row)?.createdAt
        if (!dateStr) return <Typography variant="body2">-</Typography>
        const date = new Date(dateStr)
        const formattedDate = isNaN(date.getTime())
          ? "-"
          : date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2">{formattedDate}</Typography>
          </Box>
        )
      },
    },
    {
      field: "JobType",
      headerName: "Job Type",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%", justifyContent: "center" }}>
            {params.row.JobType && <BusinessIcon fontSize="small" color="action" />}
            <Typography variant="body2">{params.row.JobType || "-"}</Typography>
          </Box>
        )
      },
    },
    {
      field: "numberOfApplicant",
      headerName: "Number of Applicants",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%", justifyContent: "center" }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2">{params.row.numberOfApplicant}</Typography>
          </Box>
        )
      },
    },
    {
      field: "totalApplicants",
      headerName: "Applicants Applied",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%", justifyContent: "center" }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2">{params.row.totalApplicants}</Typography>
          </Box>
        )
      },
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const dateStr = safeObject(params.row)?.expiryDate
        if (!dateStr) return <Typography variant="body2">-</Typography>
        const date = new Date(dateStr)
        const formattedDate = isNaN(date.getTime())
          ? "-"
          : date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2">{formattedDate}</Typography>
          </Box>
        )
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <StatusChip
            icon={
              safeObject(params.row).status === "active" ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <CancelIcon fontSize="small" />
              )
            }
            label={
              safeObject(params.row).status?.charAt(0).toUpperCase() +
              safeObject(params.row).status?.slice(1).toLowerCase() || "Unknown"
            }
            status={safeObject(params.row).status}
          />
        </Box>
      ),
    },
    {
      field: "bulkResume",
      headerName: "Upload Resumes",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Tooltip title="Upload Bulk Resumes" arrow>
            <Button
              disabled={params.row.status !== "active"}
              size="small"
              onClick={() => {
                setUploadBulk(true)
                setResumeBulkIds((prev) => ({
                  jobPostId: params.row._id,
                  branchId: params.row.branches.map((i) => i._id),
                }))
                setPdfFiles([])
              }}
              sx={{
                color: "#064e3b",
                backgroundColor: "rgba(188, 255, 220, 0.6)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgb(84, 241, 210)",
              }}
            >
              Upload Resumes
            </Button>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "view",
      headerName: "View JD",
      width: 100,
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Tooltip title="View Details" arrow>
            <Button
              size="small"
              onClick={() => router.push(`/jobpost/Reporting/jobpostDetail?id=${safeObject(params.row)._id}`)}
              sx={{
                color: "#3b82f6",
                backgroundColor: "#eff6ff",
                "&:hover": { backgroundColor: "#dbeafe" },
              }}
            >
              View
            </Button>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      align: "center",
      filterable: false,
      renderCell: (params) => (
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}
        >
          <Tooltip
            title={!apiDataTogglePermissions ? "You don't have permission to do this" : ""}
            arrow
            disableHoverListener={apiDataTogglePermissions} // Only show tooltip when disabled
          >
            <span>
              {" "}
              {/* Wrapper span needed for disabled elements */}
              <Switch
                disabled={!apiDataTogglePermissions || status === "pending"}
                checked={safeObject(params.row).status === "active"}
                onChange={(e) => {
                  handleEdit(safeObject(params.row)._id, e.target.checked)
                }}
                size="small"
                color="primary"
              />
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const getOrganization = async () => {
    if (!token) return

    try {
      const res = await axios.get(`${baseUrl}/v1/api/org/organization`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const responseData = safeObject(res.data)
      const items = safeArray(responseData.items)

      if (items.length > 0) {
        setOrgs(safeObject(items[0]))
      }
    } catch (error) {
      console.error("Error fetching organizations:", error)
    }
  }

  const getemploymentTypes = async () => {
    if (!token) return

    try {
      const res = await axios.get(`${baseUrl}/v1/api/employmentType/getAllListEmploymentType`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const items = safeArray(responseData.items)
        setemploymentTypes(items.filter((i) => safeObject(i).status === "active"))
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const getemployeeTypes = async () => {
    if (!token) return

    try {
      const res = await axios.get(`${baseUrl}/v1/api/employeType/getAllEmployeType`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const items = safeArray(responseData.items)
        setEmployeeTypes(items.filter((i) => safeObject(i).status === "active"))
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const getQualification = async () => {
    if (!token) return

    try {
      const res = await axios.get(`${baseUrl}/v1/api/qualification/getAllQualifications`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const items = safeArray(responseData.items)
        setQualifications(items)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const getDepartment = async () => {
    if (!token) return

    try {
      const res = await axios.get(`${baseUrl}/v1/api/newdepartment/newdeparment`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const items = safeArray(responseData.items)
        setDepartments(items.filter((i) => safeObject(i).isActive === true))
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const getSubDepartments = async (departmentId) => {
    if (!departmentId || !token) {
      setSubDepartments([])
      return
    }

    try {
      const res = await axios.get(`${baseUrl}/v1/api/newdepartment/sub/${departmentId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const items = safeArray(responseData.items)
        setSubDepartments(items.filter((i) => safeObject(i).isActive === true))
      }
    } catch (error) {
      console.error("Error fetching sub-departments:", error)
      setSubDepartments([])
    }
  }

  const getDesignation = async (departmentId, subDepartmentId) => {
    if (!departmentId || !subDepartmentId || !token) {
      setDesignation([])
      return
    }

    try {
      const res = await axios.get(
        `${baseUrl}/v1/api/designation/getDepartmentsWithDesignations?departmentId=${departmentId}&subDepartmentId=${subDepartmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const items = safeArray(responseData.items)
        setDesignation(items)
      }
    } catch (error) {
      console.error("error", error)
      setDesignation([])
    }
  }

  const getBranches = async () => {
    if (!token) return

    try {
      const res = await axios.get(`${baseUrl}/v1/api/branch/getList`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const items = safeArray(responseData.items)
        setBranches(items)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const [workLocations, setWorkLocations] = useState([])

  const getWorkLocations = async (id) => {
    if (!id || !token) return

    try {
      const res = await axios.get(`${baseUrl}/v1/api/branch/getList`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const items = safeArray(responseData.items)
        const branch = items.find((i) => safeObject(i)._id === id)
        const locations = safeArray(safeObject(branch).workLocations)
        setWorkLocations(locations)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const [deptBudget, setDeptBudget] = useState({})

  const getDeptBudget = async () => {
    if (!token) return

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/Budged/getBudgetDetail`,
        {
          desingationId: safeObject(addVacancy).designationId,
          subDepartmentId: safeObject(addVacancy).subDepartmentId,
          organizationId: safeObject(orgs)._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const budgetData = safeObject(responseData.items?.data)
        setDeptBudget(budgetData)
        setAddVacancy((prev) => ({
          ...prev,
          budget: budgetData.allocatedBudget,
          noOfPosition: budgetData.numberOfEmployees,
        }))
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const AutoGenerateJD = async () => {
    if (!token) return

    setAiLoading(true)

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/jobdescription/AIgeneratedJd`,
        {
          designationId: mode === "add" ? safeObject(addVacancy).designationId : safeObject(editVacancy).designationId,
          subdeparmentId:
            mode === "add" ? safeObject(addVacancy).subDepartmentId : safeObject(editVacancy).subDepartmentId,
          departmentId: mode === "add" ? safeObject(addVacancy).departmentId : safeObject(editVacancy).departmentId,
          specialSkills: mode === "add" ? safeArray(addVacancy.specialSkills) : safeArray(editVacancy.specialSkills),
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const roles = safeObject(responseData.items?.jobDescription)
        setJobDescription(roles)
      }
    } catch (error) {
      console.error("Error generating job description:", error)
    } finally {
      setAiLoading(false)
    }
  }

  const postJob = async () => {
    if (!token) return

    const selectedVacancy = safeObject(vacancySelected)

    const payload = {
      employmentTypeId: selectedVacancy.employmentTypeId || "-",
      employeeTypeId: selectedVacancy.employeeTypeId || "-",
      departmentId: safeObject(selectedVacancy.department)._id || "",
      subDepartmentId: selectedVacancy.subDepartmentId || "",
      branchId: selectedVacancy.branchId || [],
      budget: Budget || "-",
      qualificationId: safeObject(selectedVacancy.qualificationDetail)._id || "",
      organizationId: safeObject(selectedVacancy.organizationDetail)._id || "",
      experience: Number(selectedVacancy.experience) || 0,
      numberOfApplicant: selectedVacancy.numberOfApplicant || 0,
      expiredDate: selectedVacancy.expiredDate || 0,
      //   noOfPosition: selectedVacancy.noOfPosition || 0,
      jobDescriptionId: selectedVacancy.jobDescriptionId || "-",
      vacencyRequestId: selectedVacancy._id || "",
      AI_Screening: selectedVacancy.AI_Screening || "false",
      AI_Percentage: selectedVacancy.AI_Percentage || 0,
      designationId: safeObject(selectedVacancy.designation)._id || "-",
      package: selectedVacancy.package || "-",
    }

    try {
      const res = await axios.post(`${baseUrl}/v1/api/jobPost/jobPostAdd`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const responseData = safeObject(res.data)

      if (responseData.status) {
        setSnackbar({
          message: responseData.message,
          severity: "success",
          open: true,
        })
      } else {
        setSnackbar({
          message: responseData.message,
          severity: "error",
          open: true,
        })
      }
    } catch (error) {
      console.error("error", error)
      setSnackbar({
        message: error?.message,
        severity: "error",
        open: true,
      })
    } finally {
      setJobPostModal(false)
      getAllVacancy()
      setDesignation([])
    }
  }

  const handleJobPostApproval = async () => {
    if (!token || selectedJobPosts.length === 0) return

    try {
      const payload = {
        status: approvalAction,
        jobPostIds: selectedJobPosts,
        remark: approvalRemark,
      }

      const res = await axios.post(`${baseUrl}/v1/api/jobPost/jobPostapproveAndReject`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const responseData = safeObject(res.data)

      if (responseData.status) {
        setSnackbar({
          message: `Job posts ${approvalAction}d successfully`,
          severity: "success",
          open: true,
        })
        setApprovalModal(false)
        setApprovalRemark("")
        setSelectedJobPosts([])
        setSelectedIds([])
        getAllVacancy() // Refresh the data
      } else {
        setSnackbar({
          message: responseData.message || `Failed to ${approvalAction} job posts`,
          severity: "error",
          open: true,
        })
      }
    } catch (error) {
      console.error(`Error ${approvalAction}ing job posts:`, error)
      setSnackbar({
        message: error?.response?.data?.message || `Error ${approvalAction}ing job posts`,
        severity: "error",
        open: true,
      })
    }
  }

  const getAllVacancy = async () => {
    if (!token || !permissionsLoaded || apiDataPermissions === null) return

    try {
      // Manually construct query string
      let query = `showAllDashbBoardData=${apiDataPermissions}`

      if (TimePeriod !== "custom") {
        query += `&period=${TimePeriod}`
      }

      if (TimePeriod == "custom" && (startDate && endDate)) {
        query += `&startDate=${startDate}&endDate=${endDate}`
      }

      query += `&page=${page}&limit=${rowsPerPage}`

      const finalUrl = `${baseUrl}/v1/api/jobPost/getAllJobPostBypermission?${query}`

      const res = await axios.get(finalUrl, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const items = safeArray(responseData.items.data)

        const rows = items.map((item) => {
          const safeItem = safeObject(item)
          const designation = safeArray(safeItem.desingnation)
          const branch = safeArray(safeItem.branch)
          const workLocation = safeArray(safeItem.Worklocation)

          return {
            _id: safeItem._id,
            position: safeItem.position,
            jobPostId: safeItem.jobPostId,
            designation: designation.length > 0 ? safeObject(designation[0]).name : safeItem.position,
            qualification: safeItem.qualification,
            experience: safeItem.experience,
            noOfPosition: safeItem.noOfPosition,
            organization: safeObject(safeItem.organization).name,
            budget: safeItem.budget,
            package: safeItem.package,
            status: safeItem.status,
            department: safeObject(safeItem.department).name || "",
            subDepartment: safeObject(safeItem.subDepartment).name || "",
            departmentId: safeObject(safeItem.department)._id || "",
            branch: branch.map((b) => safeObject(b).name).join(", ") || "",
            branchId: branch.map((b) => safeObject(b)._id).join(", ") || "",
            branches: branch || [],
            workLocation: workLocation.map((w) => safeObject(w).name).join(", ") || "",
            employmentType: safeObject(safeItem.employmentType).title || "",
            employeeType: safeObject(safeItem.employeeType).title || "",
            createdByHr: safeObject(safeItem.createdByHr).employeName || "",
            createdAt: safeItem.createdAt || "",
            jobDescription: safeObject(safeItem.jobDescription).jobDescription || "",
            AgeLimit: safeItem.AgeLimit || "",
            gender: safeItem.gender || "",
            AI_Screening: safeItem.AI_Screening || "false",
            AI_Percentage: safeItem.AI_Percentage || 0,
            totalApplicants: safeItem.totalApplicants || 0,
            numberOfApplicant: safeItem.numberOfApplicant || 0,
            expiryDate: safeItem.expiryDate || "",
            JobType: safeItem.JobType || "",
          }
        })

        setVacancies(rows)
        setTotalItems(responseData.items.totalCount)
        setAllCounts({
          totalJobPosts: responseData?.items?.totalJobPost || 0,
          totalActivePosts: responseData?.items?.totalActiveJobs || 0,
          totalInactivePosts: responseData?.items?.totalInactiveJobs || 0,
          totalPositions: responseData?.items?.totalPositions[0]?.totalPositions || 0,
          totalPending: responseData?.items?.totalPending || 0
        })
        setError(null)
      }
    } catch (error) {
      console.error("Error fetching vacancies:", error)
      setError("Failed to load job posts")
    }
  }

  const handleApproveSelected = () => {
    if (selectedJobPosts.length === 0) {
      setSnackbar({
        message: "Please select job posts to approve",
        severity: "warning",
        open: true,
      })
      return
    }

    setApprovalAction("approve")
    setApprovalModal(true)
  }

  const handleRejectSelected = () => {
    if (selectedJobPosts.length === 0) {
      setSnackbar({
        message: "Please select job posts to reject",
        severity: "warning",
        open: true,
      })
      return
    }

    setApprovalAction("reject")
    setApprovalModal(true)
  }

  // Fetch data when permissions are loaded and other dependencies change
  useEffect(() => {
    if (token && permissionsLoaded && apiDataPermissions !== null) {
      getAllVacancy()
    }
  }, [page, rowsPerPage, status, token, permissionsLoaded, apiDataPermissions, TimePeriod, startDate, endDate])

  useEffect(() => {
    if (token) {
      getemploymentTypes()
      getDepartment()
      getBranches()
      getOrganization()
      getemployeeTypes()
      getQualification()
    }
  }, [token])

  const [addVacancy, setAddVacancy] = useState({
    organizationId: "",
    departmentId: "",
    subDepartmentId: "",
    designationId: "",
    employmentTypeId: "",
    employeeTypeId: "",
    workLocationId: "",
    branchId: [],
    qualificationId: [],
    experience: "",
    AgeLimit: "",
    expiredDate: "",
    numberOfApplicant: "",
    gender: "",
    priority: "medium",
    package: "",
    budget: "",
    noOfPosition: "",
    JobType: "",
    jobDescription: "",
    jobDescriptionId: "",
    vacancyType: "request",
    status: "active",
    AI_Screening: false,
    AI_Percentage: 0,
    specialSkills: [],
  })

  useEffect(() => {
    if (safeObject(orgs)._id) {
      setAddVacancy((prev) => ({
        ...prev,
        organizationId: orgs._id,
      }))
    }
  }, [orgs, setAddVacancy])

  useEffect(() => {
    if (safeObject(addVacancy).departmentId || safeObject(editVacancy).departmentId) {
      getSubDepartments(mode === "add" ? addVacancy.departmentId : editVacancy.departmentId)
    } else {
      setSubDepartments([])
    }
  }, [addVacancy.departmentId, editVacancy.departmentId, mode, addVacancy.subDepartmentId, editVacancy.departmentId])

  useEffect(() => {
    if (safeObject(addVacancy).departmentId && safeObject(addVacancy).subDepartmentId) {
      getDesignation(addVacancy.departmentId, addVacancy.subDepartmentId)
    } else if (safeObject(editVacancy).departmentId && safeObject(editVacancy).subDepartmentId) {
      getDesignation(editVacancy.departmentId, editVacancy.subDepartmentId)
    } else {
      setDesignation([])
    }
  }, [
    addVacancy.departmentId,
    addVacancy.subDepartmentId,
    editVacancy.departmentId,
    editVacancy.subDepartmentId,
    mode,
    addVacancy.branchId,
    editVacancy.branchId,
  ])

  useEffect(() => {
    if (safeObject(addVacancy).branchId) {
      getWorkLocations(addVacancy.branchId)
    } else if (safeObject(editVacancy).branchId) {
      getWorkLocations(editVacancy.branchId)
    }
  }, [addVacancy.branchId, editVacancy.branchId])

  // Budget verification effect
  useEffect(() => {
    const currentVacancy = mode === "add" ? addVacancy : editVacancy
    if (currentVacancy.designationId && currentVacancy.subDepartmentId) {
      verifyBudget(currentVacancy.designationId, currentVacancy.subDepartmentId)
    }
  }, [
    addVacancy.designationId,
    addVacancy.subDepartmentId,
    editVacancy.designationId,
    editVacancy.subDepartmentId,
    mode,
    token,
  ])

  const handleJobPost = (row) => {
    setJobPostModal(true)
    setVacancySelected(safeObject(row))
  }

  const handleEditModal = (row) => {
    const safeRow = safeObject(row)
    setMode("edit")
    setOpenAdd(true)
    setEditVacancy({
      vacancyRequestId: safeRow._id || "-",
      departmentId: safeObject(safeRow.department)._id || "-",
      subDepartmentId: safeRow.subDepartmentId || "",
      employmentTypeId: safeRow.employmentTypeId || "-",
      employeeTypeId: safeRow.employeeTypeId || "-",
      branchId: safeRow.branchId || [],
      qualificationId: safeObject(safeRow.qualificationDetail)._id || "",
      organizationId: safeObject(safeRow.organizationDetail)._id || "",
      experience: safeRow.exp || "",
      priority: safeRow.priority || "",
      package: safeRow.pkg || "",
      noOfPosition: safeRow.noOfPosition || 0,
      JobType: safeRow.JobType || "",
      jobDescriptionId: safeRow.jobDescriptionId,
      jobDescription: safeRow.jobDescription || "",
      vacancyType: safeRow.vacancyType || "-",
      status: safeRow.status || "",
      company: safeRow.company || "-",
      designationId: safeObject(safeRow.designation)._id || "-",
      AI_Screening: safeRow.AI_Screening || false,
      AI_Percentage: safeRow.AI_Percentage || 0,
      specialSkills: safeArray(safeRow.specialSkills),
    })
    getSubDepartments(safeObject(safeRow.department)._id)
    getDesignation(safeObject(safeRow.department)._id, safeRow.subDepartmentId)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const finalValue =
      type === "checkbox" ? checked : name === "noOfPosition" || name === "AI_Percentage" ? Number(value) : value

    if (mode === "add") {
      setAddVacancy((prev) => ({
        ...prev,
        [name]: finalValue,
        ...(name === "departmentId" && { subDepartmentId: "", designationId: "" }),
        ...(name === "subDepartmentId" && { designationId: "" }),
        ...(name === "budget" && { package: 0 }),
      }))
    } else {
      setEditVacancy((prev) => ({
        ...prev,
        [name]: finalValue,
        ...(name === "departmentId" && { subDepartmentId: "", designationId: "" }),
        ...(name === "subDepartmentId" && { designationId: "" }),
      }))
    }
  }

  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.trim()

      if (mode === "edit") {
        const currentSkills = safeArray(editVacancy.specialSkills)
        if (!currentSkills.includes(newSkill)) {
          setEditVacancy((prev) => ({
            ...prev,
            specialSkills: [...currentSkills, newSkill],
          }))
        }
      } else {
        const currentSkills = safeArray(addVacancy.specialSkills)
        if (!currentSkills.includes(newSkill)) {
          setAddVacancy((prev) => ({
            ...prev,
            specialSkills: [...currentSkills, newSkill],
          }))
        }
      }

      setSkillInput("")
    }
  }

  const handleSkillDelete = (skillToDelete) => {
    if (mode === "edit") {
      const currentSkills = safeArray(editVacancy.specialSkills)
      setEditVacancy((prev) => ({
        ...prev,
        specialSkills: currentSkills.filter((skill) => skill !== skillToDelete),
      }))
    } else {
      const currentSkills = safeArray(addVacancy.specialSkills)
      setAddVacancy((prev) => ({
        ...prev,
        specialSkills: currentSkills.filter((skill) => skill !== skillToDelete),
      }))
    }
  }

  const handleVacancyRequest = async () => {
    if (!token) return

    const currentVacancy = safeObject(addVacancy)
    const finalExperience =
      currentVacancy.experience === "Other" ? currentVacancy.customExperience : currentVacancy.experience

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/jobPost/jobPostAddDirect`,
        {
          employmentTypeId: currentVacancy.employmentTypeId || "-",
          employeeTypeId: currentVacancy.employeeTypeId || "-",
          departmentId: safeObject(currentVacancy.department)._id || "",
          subDepartmentId: currentVacancy.subDepartmentId || "",
          branchId: [currentVacancy.branchId],
          Worklocation: currentVacancy.workLocationId,
          eligibility: currentVacancy.eligibility,
          experience: finalExperience,
          noOfPosition: currentVacancy.noOfPosition,
          JobType: currentVacancy.JobType,
          expiredDate: currentVacancy.expiredDate,
          numberOfApplicant: currentVacancy.numberOfApplicant,
          budget: currentVacancy.budget,
          package: currentVacancy.package,
          jobDescriptionId: currentVacancy.jobDescriptionId,
          qualificationId: currentVacancy.qualificationId,
          AI_Screening: currentVacancy.AI_Screening,
          AI_Percentage: currentVacancy.AI_Percentage,
          AgeLimit: currentVacancy.AgeLimit,
          gender: currentVacancy.gender,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )

      const responseData = safeObject(res.data)

      if (responseData.status) {
        setOpenAdd(false)
        setAddVacancy({
          organizationId: safeObject(orgs)._id || "",
          departmentId: "",
          subDepartmentId: "",
          designationId: "",
          employmentTypeId: "",
          employeeTypeId: "",
          branchId: [],
          qualificationId: [],
          experience: "",
          priority: "medium",
          package: "",
          noOfPosition: 0,
          JobType: "",
          jobDescription: "",
          jobDescriptionId: "",
          vacancyType: "request",
          status: "active",
          AI_Screening: false,
          AI_Percentage: 0,
          specialSkills: [],
        })
        setDesignation([])
        setJobDescription({})
        setSubDepartments([])
        setActiveStep(0)
        setBudgetInfo({
          allocatedBudget: 0,
          usedBudget: 0,
          allocatedBudgetLPA: "0.00",
          usedBudgetLPA: "0.00",
          numberOfEmployees: 0,
          remainingBudget: 0,
          remainingBudgetLPA: "0.00",
        })
        setSnackbar({
          message: responseData.message,
          severity: "success",
          open: true,
        })
      } else {
        setSnackbar({
          message: responseData.message,
          severity: "error",
          open: true,
        })
      }
    } catch (error) {
      console.error("error", error)
      setSnackbar({
        message: error?.message,
        severity: "error",
        open: true,
      })
    } finally {
      getAllVacancy()
    }
  }

  const handleEditVacancyRequest = async () => {
    if (!token) return

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/vacencyRequest/vacancyRequestUpdate`,
        {
          ...editVacancy,
          subDepartmentId: safeObject(editVacancy).subDepartmentId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )

      const responseData = safeObject(res.data)

      if (responseData.status) {
        setOpenAdd(false)
        setSnackbar({
          message: responseData.message,
          severity: "success",
          open: true,
        })
      }
    } catch (error) {
      console.error("error", error)
    } finally {
      getAllVacancy()
      setDesignation([])
      setJobDescription({})
      setSubDepartments([])
      setBudgetInfo({
        allocatedBudget: 0,
        usedBudget: 0,
        allocatedBudgetLPA: "0.00",
        usedBudgetLPA: "0.00",
        numberOfEmployees: 0,
        remainingBudget: 0,
        remainingBudgetLPA: "0.00",
      })
    }
  }

  const [uploadLoading, setUploadLoading] = useState(false)

  const handleUploadBulkResume = async () => {
    setUploadLoading(true)

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/job/bulkJobApplyWithResumeExtraction`,
        {
          ...resumeBulkIds,
          resumes: pdfFiles,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )

      const responseData = safeObject(res.data)

      if (responseData.status) {
        const items = responseData.items || []

        const failedCount = items.filter((item) => item.status === "failed").length
        const skippedCount = items.filter((item) => item.status === "skipped").length

        // Show failed snackbar if any
        if (failedCount > 0) {
          setSnackbar({
            message: `Parsing failed resumes: ${failedCount}`,
            severity: "error",
            open: true,
          })
        }

        // Show skipped snackbar if any
        if (skippedCount > 0) {
          setSnackbar({
            message: `Skipped resumes: ${skippedCount}, as the email already exists`,
            severity: "warning",
            open: true,
          })
        }

        // Show success if no failures or skips
        if (failedCount === 0 && skippedCount === 0) {
          setSnackbar({
            message: responseData.message || "Upload successful.",
            severity: "success",
            open: true,
          })
        }
      }
    } catch (error) {
      console.error("Error adding job description:", error)
      setSnackbar({
        message: error?.message || "Something went wrong during upload.",
        severity: "error",
        open: true,
      })
    } finally {
      setUploadLoading(false)
      setUploadBulk(false)
      setPdfFiles([])
      setResumeBulkIds({
        jobPostId: "",
        branchId: [],
      })
      getAllVacancy()
    }
  }

  const [jdLoading, setjdLoading] = useState(false)

  const handleSubmitAdd = async () => {
    if (!token) return

    setjdLoading(true)

    const currentJobDescription = safeObject(jobDescription)
    const cleanedJD = {
      JobSummary: currentJobDescription.JobSummary,
      RolesAndResponsibilities: currentJobDescription.RolesAndResponsibilities,
      KeySkills: currentJobDescription.KeySkills,
    }

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/jobdescription/Add`,
        {
          designationId: mode === "add" ? safeObject(addVacancy).designationId : safeObject(editVacancy).designationId,
          subdeparmentId:
            mode === "add" ? safeObject(addVacancy).subDepartmentId : safeObject(editVacancy).subDepartmentId,
          departmentId: mode === "add" ? safeObject(addVacancy).departmentId : safeObject(editVacancy).departmentId,
          specialSkills: mode === "add" ? safeArray(addVacancy.specialSkills) : safeArray(editVacancy.specialSkills),
          jobDescription: cleanedJD,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )

      const responseData = safeObject(res.data)

      if (responseData.status) {
        setAddVacancy((prev) => ({
          ...prev,
          jobDescriptionId: safeObject(responseData.items)._id,
        }))
      }
    } catch (error) {
      console.error("Error adding job description:", error)
    } finally {
      setjdLoading(false)
    }
  }

  const handleEdit = async (id, isChecked) => {
    if (!token) return

    const updatedStatus = isChecked ? "active" : "inactive"

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/jobPost/updatePost/${id}`,
        {
          status: updatedStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )

      const responseData = safeObject(res.data)

      if (responseData.status) {
        setSnackbar({
          message: responseData.message,
          severity: "success",
          open: true,
        })
      } else {
        setSnackbar({
          message: responseData.message,
          severity: "error",
          open: true,
        })
      }
    } catch (error) {
      console.error("error", error)
      setSnackbar({
        message: error.message,
        severity: "error",
        open: true,
      })
    } finally {
      getAllVacancy()
    }
  }

  // Filter vacancies based on search term and status
  const filteredVacancies = safeArray(vacancies).filter((vacancy) => {
    const safeVacancy = safeObject(vacancy)

    // Status filter
    const statusMatch = status === "all" || safeVacancy.status === status

    // Search filter
    if (!searchTerm) return statusMatch

    const searchLower = searchTerm.toLowerCase()

    const searchMatch =
      (safeVacancy.position && safeString(safeVacancy.position).toLowerCase().includes(searchLower)) ||
      (safeVacancy.department && safeString(safeVacancy.department).toLowerCase().includes(searchLower)) ||
      (safeVacancy.subDepartment && safeString(safeVacancy.subDepartment).toLowerCase().includes(searchLower)) ||
      (safeVacancy.designation && safeString(safeVacancy.designation).toLowerCase().includes(searchLower)) ||
      (safeVacancy.employmentType && safeString(safeVacancy.employmentType).toLowerCase().includes(searchLower)) ||
      (safeVacancy.employeeType && safeString(safeVacancy.employeeType).toLowerCase().includes(searchLower)) ||
      (safeVacancy.workLocation && safeString(safeVacancy.workLocation).toLowerCase().includes(searchLower))

    return statusMatch && searchMatch
  })

  // Calculate metrics
  const totalPosts = safeArray(vacancies).length
  const activePosts = safeArray(vacancies).filter((v) => safeObject(v).status === "active").length
  const openPositions = safeArray(vacancies).reduce((sum, v) => sum + (safeObject(v).noOfPosition || 0), 0)

  // Show loading while permissions are being fetched or data is loading
  if (!permissionsLoaded || (loading && !vacancies.length)) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading job posts...</Typography>
        </Box>
      </Container>
    )
  }

  // Show error state
  if (error && !vacancies.length) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
          <Button onClick={() => getAllVacancy()} sx={{ ml: 2 }} variant="contained" size="small">
            Retry
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Dashboard-Style Header Section */}
          {/* Metrics Cards Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard elevation={0} sx={{ bgcolor: "#dbeafe" 
           }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2" color="#6b7280" fontWeight={500}>
                    Total Posts
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <WorkIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight={700} color="#1e88e5" sx={{ mb: 0.5 }}>
                  {totalItems}
                </Typography>
                <Typography variant="body2" color="#6b7280">
                  All job postings created
                </Typography>
              </MetricCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard elevation={0} sx={{ bgcolor: "#dcfce7" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2" color="#6b7280" fontWeight={500}>
                    Active Posts
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 20, color: "#10b981" }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight={700} color="#10b981" sx={{ mb: 0.5 }}>
                  {allCounts.totalActivePosts}
                </Typography>
                <Typography variant="body2" color="#6b7280">
                  Currently published and visible
                </Typography>
              </MetricCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard elevation={0} sx={{ bgcolor: "#fef2f2" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2" color="#6b7280" fontWeight={500}>
                    Total Pending Posts
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      backgroundColor: "#fef2f2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GroupsIcon sx={{ fontSize: 20, color: "#ef4444" }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight={700} color="#ef4444" sx={{ mb: 0.5 }}>
                  {allCounts.totalPending}
                </Typography>
                <Typography variant="body2" color="#6b7280">
                  Awaiting admin review
                </Typography>
              </MetricCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard elevation={0} sx={{ bgcolor: "#f1f5f9" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2" color="#6b7280" fontWeight={500}>
                    Inactive Posts
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      backgroundColor: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ScheduleIcon sx={{ fontSize: 20, color: "#4f46e5" }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight={700} color="#4f46e5" sx={{ mb: 0.5 }}>
                  {allCounts.totalInactivePosts}
                </Typography>
                <Typography variant="body2" color="#6b7280">
                  Unpublished or expired posts
                </Typography>
              </MetricCard>
            </Grid>
          </Grid>

        {/* Search and Filter Bar */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search job posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Data Grid Section */}
          <Box sx={{ height: 650, width: "100%" }}>
            <StyledDataGrid
              rows={filteredVacancies}
              columns={postColumns}
              pagination
              getRowId={(row) => safeObject(row)._id}
              paginationModel={{ page: page - 1, pageSize: rowsPerPage }}
              onPaginationModelChange={({ page, pageSize }) => {
                setPage(page + 1)
                setRowsPerPage(pageSize)
              }}
              rowCount={totalItems}
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => {
                setSelectedIds(newSelection)
                setSelectedJobPosts(newSelection)
              }}
              slots={{
                toolbar: CustomToolbar,
              }}
              pageSizeOptions={[50, 100, totalItems]}
              paginationMode="server"
              getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
              disableRowSelectionOnClick
              sx={{
                minWidth: "1000px",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: 600,
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
          </Box>

        {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(totalItems / rowsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box> */}
      </Box>

      <Modal
        open={jobPostModal}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return // Do nothing
          }
          setJobPostModal(false) // Only manually close
        }}
        disableEscapeKeyDown
        hideBackdrop={false}
        BackdropProps={{
          sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%",
              sm: "80%",
              md: 650,
            },
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={2} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WorkIcon color="primary" /> Create Job Post
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                name="departmentId"
                fullWidth
                select
                value={safeObject(safeObject(vacancySelected).department)._id || ""}
                InputProps={{ readOnly: true }}
              >
                {safeArray(departments).map((dept) => (
                  <MenuItem key={safeObject(dept)._id} value={safeObject(dept)._id}>
                    {safeObject(dept).name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Sub Department"
                name="subDepartmentId"
                fullWidth
                select
                value={safeObject(vacancySelected).subDepartmentId || ""}
                InputProps={{ readOnly: true }}
              >
                {safeArray(subDepartments).map((subDept) => (
                  <MenuItem key={safeObject(subDept)._id} value={safeObject(subDept)._id}>
                    {safeObject(subDept).name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Designation"
                name="designationId"
                fullWidth
                select
                value={safeObject(safeObject(vacancySelected).designation)._id || ""}
                InputProps={{ readOnly: true }}
              >
                {safeArray(designation).map((item) => (
                  <MenuItem key={safeObject(item)._id} value={safeObject(item)._id}>
                    {safeObject(item).name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Employment Type"
                name="employmentTypeId"
                fullWidth
                value={safeObject(vacancySelected).employmentType || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Type of Employee"
                name="employeeTypeId"
                fullWidth
                select
                value={safeObject(vacancySelected).employeeTypeId || ""}
                InputProps={{ readOnly: true }}
              >
                {safeArray(employeeTypes).map((type) => (
                  <MenuItem key={safeObject(type)._id} value={safeObject(type)._id}>
                    {safeObject(type).title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Branches"
                name="branches"
                fullWidth
                value={safeObject(vacancySelected).branches || ""}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Qualification"
                name="eligibility"
                fullWidth
                select
                value={safeObject(safeObject(vacancySelected).qualificationDetail)._id || ""}
                InputProps={{ readOnly: true }}
              >
                {safeArray(qualifications).map((item) => (
                  <MenuItem key={safeObject(item)._id} value={safeObject(item)._id}>
                    {safeString(safeObject(item).name).toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Organization"
                name="organizationId"
                fullWidth
                select
                value={safeObject(safeObject(vacancySelected).organizationDetail)._id || ""}
                InputProps={{ readOnly: true }}
              >
                {safeObject(orgs)._id && (
                  <MenuItem key={safeObject(orgs)._id} value={safeObject(orgs)._id}>
                    {safeObject(orgs).name}
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Experience (years)"
                name="experience"
                fullWidth
                value={safeObject(vacancySelected).experience || ""}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Budget"
                name="Budget"
                fullWidth
                value={Budget}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Package (LPA)"
                name="package"
                fullWidth
                type="number"
                value={safeObject(vacancySelected).package || ""}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="No. of Positions"
                name="noOfPosition"
                fullWidth
                type="number"
                value={safeObject(vacancySelected).noOfPosition || ""}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Job Description"
                name="jobDescriptionId"
                fullWidth
                multiline
                minRows={3}
                value={safeObject(vacancySelected).jobDesc || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ width: { xs: "50%", sm: 140 } }}
                onClick={() => setJobPostModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: { xs: "50%", sm: 140 } }}
                onClick={postJob}
                startIcon={<CheckCircleIcon />}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Add New Post Modal with Stepper */}
      <Modal
        open={openAdd}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return
          }
          setOpenAdd(false)
          mode === "add" && setBudget(0)
          setBudgetInfo({
            allocatedBudget: 0,
            usedBudget: 0,
            allocatedBudgetLPA: "0.00",
            usedBudgetLPA: "0.00",
            numberOfEmployees: 0,
            remainingBudget: 0,
            remainingBudgetLPA: "0.00",
          })
        }}
        disableEscapeKeyDown
        hideBackdrop={false}
        BackdropProps={{
          sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={2} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon color="primary" />
            {mode === "add" ? "Create Job Request" : "Edit Job Request"}
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Budget Information Display */}
          {activeStep === 1 && <BudgetInfoDisplay />}

          <Grid container spacing={4}>
            {activeStep === 0 && (
              <>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={16} fontWeight={600} color="black" gutterBottom>
                      Recruitment Details
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Organization</InputLabel>
                    <Select
                      name="organizationId"
                      value={mode === "add" ? safeObject(orgs)._id || "" : safeObject(editVacancy).organizationId || ""}
                      onChange={handleInputChange}
                      label="Organization"
                      inputProps={{ readOnly: true }}
                    >
                      {safeObject(orgs)._id && (
                        <MenuItem key={safeObject(orgs)._id} value={safeObject(orgs)._id}>
                          {safeObject(orgs).name}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="departmentId"
                      value={
                        mode === "add" ? safeObject(addVacancy).departmentId : safeObject(editVacancy).departmentId
                      }
                      onChange={handleInputChange}
                      label="Department"
                    >
                      {safeArray(departments).map((dept) => (
                        <MenuItem key={safeObject(dept)._id} value={safeObject(dept)._id}>
                          {safeObject(dept).name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    required
                    size="small"
                    disabled={!safeArray(subDepartments).length}
                  >
                    <InputLabel>Sub-Department</InputLabel>
                    <Select
                      name="subDepartmentId"
                      value={
                        mode === "add"
                          ? safeObject(addVacancy).subDepartmentId
                          : safeObject(editVacancy).subDepartmentId
                      }
                      onChange={handleInputChange}
                      label="Sub-Department"
                    >
                      {safeArray(subDepartments).map((subDept) => (
                        <MenuItem key={safeObject(subDept)._id} value={safeObject(subDept)._id}>
                          {safeObject(subDept).name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    required
                    size="small"
                    disabled={!safeArray(designation).length}
                  >
                    <InputLabel>Designation</InputLabel>
                    <Select
                      name="designationId"
                      value={
                        mode === "add" ? safeObject(addVacancy).designationId : safeObject(editVacancy).designationId
                      }
                      onChange={handleInputChange}
                      label="Designation"
                    >
                      {safeArray(designation).map((item) => (
                        <MenuItem key={safeObject(item)._id} value={safeObject(item)._id}>
                          {safeObject(item).name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Type of Employee</InputLabel>
                    <Select
                      name="employeeTypeId"
                      value={
                        mode === "add" ? safeObject(addVacancy).employeeTypeId : safeObject(editVacancy).employeeTypeId
                      }
                      onChange={handleInputChange}
                      label="Type of Employee"
                    >
                      {safeArray(employeeTypes).map((type) => (
                        <MenuItem key={safeObject(type)._id} value={safeObject(type)._id}>
                          {safeObject(type).title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Employment Type</InputLabel>
                    <Select
                      name="employmentTypeId"
                      value={
                        mode === "add"
                          ? safeObject(addVacancy).employmentTypeId
                          : safeObject(editVacancy).employmentTypeId
                      }
                      onChange={handleInputChange}
                      label="Employment Type"
                    >
                      {safeArray(employmentTypes).map((type) => (
                        <MenuItem key={safeObject(type)._id} value={safeObject(type)._id}>
                          {safeObject(type).title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Branches</InputLabel>
                    <Select
                      name="branchId"
                      value={
                        mode === "add" ? safeObject(addVacancy).branchId || "" : safeObject(editVacancy).branchId || ""
                      }
                      onChange={handleInputChange}
                      label="Branches"
                    >
                      {safeArray(branches).map((branch) => (
                        <MenuItem key={safeObject(branch)._id} value={safeObject(branch)._id}>
                          {safeString(safeObject(branch).name).toUpperCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Work Location</InputLabel>
                    <Select
                      name="workLocationId"
                      value={
                        mode === "add"
                          ? safeObject(addVacancy).workLocationId || ""
                          : safeObject(editVacancy).workLocationId || ""
                      }
                      onChange={handleInputChange}
                      label="Work Location"
                    >
                      {safeArray(workLocations).map((loc) => (
                        <MenuItem key={safeObject(loc)._id} value={safeObject(loc)._id}>
                          {safeString(safeObject(loc).name).toUpperCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Qualification</InputLabel>
                    <Select
                      name="qualificationId"
                      multiple
                      value={safeArray(mode === "add" ? addVacancy.qualificationId : editVacancy.qualificationId).map(
                        String,
                      )}
                      onChange={handleInputChange}
                      label="Qualification"
                      renderValue={(selected) =>
                        safeArray(selected)
                          .map((id) =>
                            safeString(safeArray(qualifications).find((q) => safeObject(q)._id === id)?.name),
                          )
                          .join(", ")
                      }
                    >
                      {safeArray(qualifications).map((item) => (
                        <MenuItem key={safeObject(item)._id} value={safeObject(item)._id}>
                          <Checkbox
                            checked={safeArray(
                              mode === "add" ? addVacancy.qualificationId : editVacancy.qualificationId,
                            ).includes(safeObject(item)._id)}
                          />
                          <ListItemText primary={safeString(safeObject(item).name).toUpperCase()} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Experience (years)</InputLabel>
                    <Select
                      name="experience"
                      value={mode === "add" ? safeObject(addVacancy).experience : safeObject(editVacancy).experience}
                      onChange={handleInputChange}
                      label="Experience (years)"
                    >
                      {["Fresher", "0-1", "1-2", "2-3", "3-4", "Other"].map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {(mode === "add" ? safeObject(addVacancy).experience : safeObject(editVacancy).experience) ===
                  "Other" && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Enter Custom Experience"
                        name="customExperience"
                        fullWidth
                        value={
                          mode === "add"
                            ? safeObject(addVacancy).customExperience || ""
                            : safeObject(editVacancy).customExperience || ""
                        }
                        onChange={handleInputChange}
                      />
                    </Grid>
                  )}

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Age Limit</InputLabel>
                    <Select
                      name="AgeLimit"
                      value={mode === "add" ? safeObject(addVacancy).AgeLimit : safeObject(editVacancy).AgeLimit}
                      onChange={handleInputChange}
                      label="Age Limit"
                    >
                      {[
                        "18-21 years",
                        "22-25 years",
                        "26-30 years",
                        "31-35 years",
                        "36-40 years",
                        "41-45 years",
                        "46-50 years",
                        "51+ years",
                        "No age limit",
                      ].map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={mode === "add" ? safeObject(addVacancy).gender : safeObject(editVacancy).gender}
                      onChange={handleInputChange}
                      label="Gender"
                    >
                      {["Male", "Female", "Both"].map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {activeStep === 1 && (
              <>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={16} fontWeight={600} color="black" gutterBottom>
                      Job Opening Info
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Job Type"
                    select
                    size="small"
                    name="JobType"
                    fullWidth
                    type="number"
                    value={mode === "add" ? safeObject(addVacancy).JobType : safeObject(editVacancy).JobType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value={"Internship"}>Internship</MenuItem>
                    <MenuItem value={"Regular"}>Regular</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="No. of Positions"
                    name="noOfPosition"
                    fullWidth
                    size="small"
                    type="number"
                    value={mode === "add" ? safeObject(addVacancy).noOfPosition : safeObject(editVacancy).noOfPosition}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Budget (LPA)"
                    name="budget"
                    fullWidth
                    size="small"
                    type="number"
                    value={mode === "add" ? safeObject(addVacancy).budget : safeObject(editVacancy).budget}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Package (LPA)"
                    type="number"
                    size="small"
                    name="package"
                    value={
                      mode === "add" ? safeObject(addVacancy).package || "" : safeObject(editVacancy).package || ""
                    }
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      const max = Number(addVacancy.budget)

                      if (value <= max) {
                        handleInputChange({
                          target: { name: "package", value },
                        })
                      }
                    }}
                    inputProps={{
                      min: 0,
                      max: Number(addVacancy.budget),
                      step: 0.1,
                    }}
                    placeholder={`Max ${addVacancy.budget} LPA`}
                    sx={{ ml: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Expiry Date"
                    name="expiredDate"
                    fullWidth
                    size="small"
                    type="date"
                    value={mode === "add" ? safeObject(addVacancy).expiredDate : safeObject(editVacancy).expiredDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Number of Applicants"
                    name="numberOfApplicant"
                    size="small"
                    fullWidth
                    value={
                      mode === "add"
                        ? safeObject(addVacancy).numberOfApplicant
                        : safeObject(editVacancy).numberOfApplicant
                    }
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}

            {activeStep === 2 && (
              <Grid container spacing={2} sx={{ px: 4 }}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={16} fontWeight={600} color="black" gutterBottom>
                      Job Description
                    </Typography>

                    <Button
                      onClick={AutoGenerateJD}
                      variant="contained"
                      disabled={
                        ailoading ||
                        !(mode === "add" ? safeObject(addVacancy).designationId : safeObject(editVacancy).designationId)
                      }
                      startIcon={ailoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <SmartToyIcon />}
                      size="small"
                      sx={{
                        background: "linear-gradient(to right, #6a11cb, #2575fc)",
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: "bold",
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        "&:hover": {
                          background: "linear-gradient(to right, #5a01b0, #1a63e0)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                        },
                      }}
                    >
                      {ailoading ? "Generating..." : "Generate Job Description"}
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="Special Skills"
                      fullWidth
                      size="small"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Type a skill and press Enter"
                    />

                    <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {safeArray(mode === "add" ? addVacancy.specialSkills : editVacancy.specialSkills).map(
                        (skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            onDelete={() => handleSkillDelete(skill)}
                            color="primary"
                            size="small"
                          />
                        ),
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Job Summary"
                    fullWidth
                    size="small"
                    multiline
                    rows={3}
                    value={safeObject(jobDescription).JobSummary || ""}
                    onChange={(e) =>
                      setJobDescription((prev) => ({
                        ...prev,
                        JobSummary: e.target.value,
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Roles and Responsibilities"
                    fullWidth
                    size="small"
                    multiline
                    rows={7}
                    value={safeArray(safeObject(jobDescription).RolesAndResponsibilities).join("\n")}
                    onChange={(e) =>
                      setJobDescription((prev) => ({
                        ...prev,
                        RolesAndResponsibilities: e.target.value
                          .split("\n")
                          .map((item) => item.trim())
                          .filter((item) => item),
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Key Skills"
                    fullWidth
                    size="small"
                    multiline
                    rows={7}
                    value={safeArray(safeObject(jobDescription).KeySkills).join("\n")}
                    onChange={(e) =>
                      setJobDescription((prev) => ({
                        ...prev,
                        KeySkills: e.target.value
                          .split("\n")
                          .map((item) => item.trim())
                          .filter((item) => item), // Remove empty lines
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                  <Button size="small" variant="outlined" onClick={handleSubmitAdd}>
                    {jdLoading ? <CircularProgress size={20} sx={{ color: "blue" }} /> : "Confirm JD"}
                  </Button>
                </Grid>
              </Grid>
            )}

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 2, gap: 3 }}>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => {
                  setOpenAdd(false)
                  setActiveStep(0)
                  setAddVacancy({
                    organizationId: safeObject(orgs)._id || "",
                    departmentId: "",
                    subDepartmentId: "",
                    designationId: "",
                    employmentTypeId: "",
                    employeeTypeId: "",
                    branchId: [],
                    qualificationId: "",
                    experience: "",
                    priority: "medium",
                    package: "",
                    noOfPosition: 0,
                    AgeLimit: "",
                    expiredDate: "",
                    numberOfApplicant: "",
                    gender: "",
                    jobDescription: "",
                    jobDescriptionId: "",
                    vacancyType: "request",
                    status: "active",
                    AI_Screening: false,
                    AI_Percentage: 0,
                    specialSkills: [],
                  })
                  setDesignation([])
                  setJobDescription({})
                  setSubDepartments([])
                  setBudgetInfo({
                    allocatedBudget: 0,
                    usedBudget: 0,
                    allocatedBudgetLPA: "0.00",
                    usedBudgetLPA: "0.00",
                    numberOfEmployees: 0,
                    remainingBudget: 0,
                    remainingBudgetLPA: "0.00",
                  })
                }}
              >
                Cancel
              </Button>

              <Box display={"flex"} gap={3}>
                <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>
                  Back
                </Button>

                {activeStep !== steps.length - 1 ? (
                  <Button onClick={() => setActiveStep((prev) => prev + 1)} variant="contained">
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "170px" }}
                    onClick={mode === "add" ? handleVacancyRequest : handleEditVacancyRequest}
                    disabled={
                      !(
                        (mode === "add"
                          ? safeObject(addVacancy).designationId
                          : safeObject(editVacancy).designationId) &&
                        (mode === "add"
                          ? safeObject(addVacancy).jobDescriptionId
                          : safeObject(editVacancy).jobDescriptionId)
                      )
                    }
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Job Description Modal */}
      <Modal
        open={openDesc}
        onClose={() => {
          setOpenDesc(false)
          setDesc("")
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 480,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ borderBottom: "2px solid rgb(14, 115, 182)", pb: 1, color: "#333" }}
          >
            Job Description
          </Typography>

          {desc ? (
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {desc.split("\n").map((item, index) => (
                <Typography component="li" key={index} sx={{ mb: 1 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography>No description available</Typography>
          )}

          <Button
            variant="contained"
            size="small"
            sx={{
              mt: 2,
              alignSelf: "flex-end",
              bgcolor: "#00c65c",
              "&:hover": { bgcolor: "#5ed294" },
            }}
            onClick={() => {
              setOpenDesc(false)
              setDesc("")
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
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

      {/* Approval Modal */}
      <Modal
        open={approvalModal}
        onClose={() => {
          setApprovalModal(false)
          setApprovalRemark("")
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
          }}
        >
          <Typography variant="h6" mb={3} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {approvalAction === "approve" ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
            {approvalAction === "approve" ? "Approve" : "Reject"} Job Posts
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            You are about to {approvalAction} {selectedJobPosts.length} job post(s).
            {approvalAction === "reject" && " Please provide a reason for rejection."}
          </Typography>

          <TextField
            label={approvalAction === "approve" ? "Approval Remarks (Optional)" : "Rejection Reason"}
            multiline
            rows={3}
            fullWidth
            value={approvalRemark}
            onChange={(e) => setApprovalRemark(e.target.value)}
            required={approvalAction === "reject"}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setApprovalModal(false)
                setApprovalRemark("")
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color={approvalAction === "approve" ? "success" : "error"}
              onClick={handleJobPostApproval}
              disabled={approvalAction === "reject" && !approvalRemark.trim()}
            >
              {approvalAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={uploadBulk} onClose={() => setUploadBulk(false)}>
        <Box sx={modalStyle}>
          {/* Header */}
          <Box
            sx={{
              p: 3,
              background: "linear-gradient(135deg,rgb(162, 151, 253) 0%,rgb(200, 146, 253) 100%)",
              color: "white",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileUpload sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Upload Resume Files
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setUploadBulk(false)}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <Close />
              </IconButton>
            </Stack>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            {/* Upload Area */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: "2px dashed #D1D5DB",
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: "#F9FAFB",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "#6366F1",
                  backgroundColor: "#F0F9FF",
                },
              }}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: 48,
                  color: "#9CA3AF",
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 500, color: "#374151", mb: 1 }}>
                Choose Resume Files
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select one or more PDF files from your device
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: "#6366F1",
                  "&:hover": {
                    backgroundColor: "#5B5BD6",
                  },
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                }}
              >
                Browse Files
                <input type="file" accept="application/pdf" multiple hidden onChange={handleFileChange} />
              </Button>
            </Paper>

            {/* File List */}
            {pdfFiles.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#374151" }}>
                    Selected Files
                  </Typography>
                  <Chip
                    label={`${pdfFiles.length} file${pdfFiles.length > 1 ? "s" : ""}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    border: "1px solid #E5E7EB",
                    borderRadius: 2,
                    maxHeight: 200,
                    overflow: "auto",
                  }}
                >
                  <List dense sx={{ p: 0 }}>
                    {pdfFiles.map((file, index) => (
                      <Box key={index}>
                        <ListItem
                          component="a"
                          href={typeof file === "string" ? file : URL.createObjectURL(file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            py: 1.5,
                            px: 2,
                            "&:hover": {
                              backgroundColor: "#F9FAFB",
                            },
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <PdfIcon sx={{ color: "#EF4444", fontSize: 24 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Document {index + 1}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                PDF File • Click to preview
                              </Typography>
                            }
                          />
                          <CheckCircleIcon sx={{ color: "#10B981", fontSize: 20, mr: 1 }} />
                          <IconButton
                            size="small"
                            edge="end"
                            aria-label="remove"
                            onClick={(e) => {
                              e.preventDefault()
                              setPdfFiles((prev) => prev.filter((_, i) => i !== index))
                            }}
                          >
                            <Close fontSize="small" sx={{ color: "#EF4444" }} />
                          </IconButton>
                        </ListItem>
                        {index < pdfFiles.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 3,
              borderTop: "1px solid #E5E7EB",
              backgroundColor: "#F9FAFB",
              borderRadius: "0 0 12px 12px",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {pdfFiles.length > 0 ? `${pdfFiles.length} file(s) ready to upload` : "No files selected"}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setUploadBulk(false)
                    setPdfFiles([])
                    setResumeBulkIds({
                      jobPostId: "",
                      branchId: [],
                    })
                  }}
                  sx={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                    "&:hover": {
                      borderColor: "#9CA3AF",
                      backgroundColor: "#F3F4F6",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUploadBulkResume}
                  disabled={pdfFiles.length === 0 || uploadLoading}
                  sx={{
                    backgroundColor: "#10B981",
                    "&:hover": {
                      backgroundColor: "#059669",
                    },
                    "&:disabled": {
                      backgroundColor: "#D1D5DB",
                      color: "#9CA3AF",
                    },
                    borderRadius: 2,
                    px: 3,
                  }}
                  startIcon={uploadLoading ? <CircularProgress size={20} color="inherit" /> : <FileUpload />}
                >
                  {uploadLoading
                    ? "Uploading..."
                    : `Upload ${pdfFiles.length > 0 ? `${pdfFiles.length} File${pdfFiles.length > 1 ? "s" : ""}` : "Files"}`}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Container>
  )
}