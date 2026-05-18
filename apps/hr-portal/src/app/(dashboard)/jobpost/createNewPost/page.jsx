"use client"
import { useState, useEffect, useMemo } from "react"
import {
  Container,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  ListItemText,
  Grid,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  LinearProgress,
  Fade,
  Grow,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material"
import {
  Business as BusinessIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  Groups as GroupsIcon,
  Schedule as ScheduleIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  PersonOutline as PersonOutlineIcon,
  ListAlt as ListAltIcon,
  Description as DescriptionIcon,
  SmartToy as SmartToyIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material"
import { styled, alpha } from "@mui/material/styles"
import axios from "axios"
import { useRouter } from "next/navigation"

// Helper functions for safe data handling
const safeArray = (value) => {
  if (Array.isArray(value)) return value
  if (value === null || value === undefined) return []
  return []
}
const safeString = (value) => {
  if (typeof value === "string") return value
  if (value === null || value === undefined) return ""
  return String(value)
}
const safeObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value
  return {}
}

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
  },
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: "12px",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}))

const BudgetCard = styled(Card)(({ theme }) => ({
  color: "black",
  borderRadius: "16px",
  marginBottom: theme.spacing(3),
  "& .MuiCardContent-root": {
    padding: theme.spacing(3),
  },
}))

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: "20px",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: "translateY(-2px)",
  },
}))

const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& .MuiStepConnector-line": {
    borderColor: "#e0e7ff",
    borderWidth: "3px",
    borderRadius: "2px",
  },
  "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
    borderColor: theme.palette.primary.main,
  },
  "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
    borderColor: theme.palette.primary.main,
  },
  "& .MuiStepLabel-label": {
    fontWeight: 600,
    fontSize: "1rem",
  },
  "& .MuiStepLabel-label.Mui-active": {
    color: theme.palette.primary.main,
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: theme.palette.success.main,
  },
}))

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  },
}))

export default function JobPost() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter()

  const [employmentTypes, setEmploymentTypes] = useState([])
  const [jobDescription, setJobDescription] = useState({})
  const steps = [
    {
      label: "Basic Details",
      description: "Organization and candidate eligibility information",
      icon: <PersonOutlineIcon />,
    },
    {
      label: "Opening Details",
      description: "Job type, responsibilities, and requirements",
      icon: <ListAltIcon />,
    },
    {
      label: "Screening Criteria",
      description: "Define evaluation criteria and weights for candidate assessment",
      icon: <AssessmentIcon />,
    },
  ]
  const [departments, setDepartments] = useState([])
  const [subDepartments, setSubDepartments] = useState([])
  const [branches, setBranches] = useState([])
  const [designation, setDesignation] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [qualifications, setQualifications] = useState([])
  const [employeeTypes, setEmployeeTypes] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [ailoading, setAiLoading] = useState(false)
  const [skillInput, setSkillInput] = useState("")
  const [selectedDesignation, setSelectedDesignation] = useState("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  // State to hold validation errors
  const [errors, setErrors] = useState({})
  const [addVacancy, setAddVacancy] = useState({
    organizationId: "",
    departmentId: "",
    subDepartmentId: "",
    designationId: "",
    employmentTypeId: "",
    employeeTypeId: "",
    branchId: [],
    qualificationId: [],
    experience: [0, 0],
    AgeLimit: [18, 18],
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
    ReportId: "", // New field for report name
    screeningCriteria: [
      {
        name: "Technical Skills",
        description: "Assessment of key technical skills relevant to the job.",
        weight: 0,
      },
      {
        name: "Communication Skills",
        description: "Evaluation of verbal, written, and interpersonal communication abilities.",
        weight: 0,
      },
      {
        name: "Certification",
        description: "Verification of certifications that demonstrate domain expertise.",
        weight: 0,
      },
      {
        name: "Leadership",
        description: "Assessment of leadership qualities and team management capabilities.",
        weight: 0,
      },
      {
        name: "Project Management",
        description: "Ability to manage project scope, timelines, and deliverables efficiently.",
        weight: 0,
      },
      {
        name: "Cultural Fit",
        description: "Alignment with the organization's values, work culture, and ethics.",
        weight: 0,
      },
      {
        name: "Learning Ability",
        description: "Capacity to learn quickly, adapt, and embrace new technologies or practices.",
        weight: 0,
      },
      {
        name: "Experience",
        description: "Relevant past roles and hands-on exposure to industry practices.",
        weight: 0,
      },
      {
        name: "Education",
        description: "Academic qualifications and relevance to the job domain.",
        weight: 0,
      },
      {
        name: "Stability",
        description:
          "Evaluates candidate’s history of staying at previous companies. Indicates reliability and likelihood of long-term commitment.",
        weight: 0,
      },
    ],
  })
  const [budgetInfo, setBudgetInfo] = useState({
    allocatedBudget: 0,
    usedBudget: 0,
    allocatedBudgetLPA: "0.00",
    usedBudgetLPA: "0.00",
    numberOfEmployees: 0,
    remainingBudget: 0,
    remainingBudgetLPA: "0.00",
    perEmployee: 0,
  })
  const [budgetLoading, setBudgetLoading] = useState(false)
  const [budgetError, setBudgetError] = useState("")
  const [jdLoading, setJdLoading] = useState(false)
  const [orgs, setOrgs] = useState({})

  const [fetchedReports, setFetchedReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportsError, setReportsError] = useState(null)

  // States for role permissions
  const [permissions, setPermissions] = useState(null)
  const [permissionsLoading, setPermissionsLoading] = useState(true)
  const [permissionsError, setPermissionsError] = useState(null)
  const [permissionsLoaded, setPermissionsLoaded] = useState(false)

  // Helper to get user role ID from localStorage
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

  // Function to fetch role permissions
  const fetchRolePermissions = async () => {
    setPermissionsLoading(true)
    setPermissionsError(null)
    const roleId = getUserRoleId()
    if (!roleId) {
      setPermissionsError("No role ID found")
      setPermissionsLoading(false)
      setPermissionsLoaded(true)
      return
    }
    try {
      // Assuming callApi is available or using axios directly
      const result = await axios.get(`${baseUrl}/v1/api/role/detail?roleId=${roleId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      const responseData = safeObject(result.data)
      if (responseData.status && responseData.items) {
        setPermissions(responseData.items)
      } else {
        setPermissionsError("Failed to fetch permissions: " + (responseData.message || "Unknown error"))
        console.error("API Error:", responseData.message)
      }
    } catch (err) {
      setPermissionsError("Error fetching permissions: " + err.message)
      console.error("Error fetching role permissions:", err)
    } finally {
      setPermissionsLoading(false)
      setPermissionsLoaded(true)
    }
  }

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
        perEmployee: 0,
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
          perEmployee: items.perEmployee || 0,
        })
        setAddVacancy((prev) => ({
          ...prev,
          package: items.perEmployee,
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
  const [designationSearch, setDesignationSearch] = useState("")
  const filteredDesignations = useMemo(() => {
    return safeArray(designation).filter((item) =>
      safeObject(item).name.toLowerCase().includes(designationSearch.toLowerCase()),
    )
  }, [designationSearch, designation])

  // Budget Info Display Component
  const BudgetInfoDisplay = () => {
    if (budgetLoading) {
      return (
        <BudgetCard>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={24} sx={{ color: "white" }} />
              <Typography variant="h6" color="inherit">
                Loading budget information...
              </Typography>
            </Box>
          </CardContent>
        </BudgetCard>
      )
    }
    if (budgetError) {
      return (
        <StyledCard>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <WarningIcon color="error" />
              <Typography color="error" variant="h6">
                {budgetError}
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      )
    }
    if (budgetInfo.allocatedBudget === 0) {
      return null
    }
    const budgetUtilization = (budgetInfo.usedBudget / budgetInfo.allocatedBudget) * 100
    const isOverBudget = budgetInfo.remainingBudget < 0
    return (
      <BudgetCard>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, color: "black" }}>
            <AccountBalanceIcon />
            Budget Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "black" }}>
                  ₹{budgetInfo.allocatedBudget.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Allocated Budget ({budgetInfo.allocatedBudgetLPA} LPA)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#FFD700" }}>
                  ₹{budgetInfo.usedBudget.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Used Budget ({budgetInfo.usedBudgetLPA})
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: isOverBudget ? "#FF6B6B" : "#4ECDC4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  {isOverBudget ? <WarningIcon /> : <TrendingUpIcon />}₹
                  {Math.abs(budgetInfo.remainingBudget).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {isOverBudget ? "Over Budget" : "Remaining"} ({budgetInfo.remainingBudgetLPA} LPA)
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
              Budget Utilization: {budgetUtilization.toFixed(1)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(budgetUtilization, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255,255,255,0.3)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: budgetUtilization > 90 ? "#FF6B6B" : budgetUtilization > 70 ? "#FFD700" : "#4ECDC4",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon />
            <Typography variant="body1">Open Positions: {budgetInfo.numberOfEmployees}</Typography>
          </Box>
        </CardContent>
      </BudgetCard>
    )
  }
  // API functions
  const getOrganization = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${baseUrl}/v1/api/org/getOrganizations`, {
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
  const getEmploymentTypes = async () => {
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
        setEmploymentTypes(items.filter((i) => safeObject(i).status === "active"))
      }
    } catch (error) {
      console.error("error", error)
    }
  }
  const getEmployeeTypes = async () => {
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
  const getDesignation = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${baseUrl}/v1/api/designation/getAll`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      const responseData = safeObject(res.data)
      if (responseData.status) {
        const items = safeArray(responseData.items)
        setDesignation(items.filter((i) => i.isActive))
        setAddVacancy((prev) => ({
          ...prev,
          departmentId: items.filter((i) => i._id === selectedDesignation)[0]?.departmentId?._id,
          subDepartmentId: items.filter((i) => i._id === selectedDesignation)[0]?.subDepartmentId || "-",
        }))
        setErrors((prev) => ({ ...prev, departmentId: "", subDepartmentId: "" }))
      }
    } catch (error) {
      console.error("Error fetching designations:", error)
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

  const getSavedReports = async () => {
    setReportsLoading(true)
    try {
      const res = await axios.get(`${baseUrl}/v1/api/verifyDocs/GetCategoryReport`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      const responseData = safeObject(res.data)
      if (responseData.status && responseData.items) {
        setFetchedReports(safeArray(responseData.items))
        setReportsError(null)
      } else {
        setReportsError("Failed to load saved reports")
      }
    } catch (error) {
      setReportsError("Error fetching saved reports")
      console.error("Reports fetch error:", error)
    } finally {
      setReportsLoading(false)
    }
  }

  const AutoGenerateJD = async () => {
    if (!token) return
    setAiLoading(true)
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/jobdescription/AIgeneratedJd`,
        {
          designationId: safeObject(addVacancy).designationId,
          subdeparmentId: addVacancy?.subDepartmentId === "-" ? null : safeObject(addVacancy).subDepartmentId,
          departmentId: safeObject(addVacancy).departmentId,
          // specialSkills: safeArray(addVacancy.specialSkills),
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
  // Event handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const finalValue =
      type === "checkbox" ? checked : name === "noOfPosition" || name === "AI_Percentage" ? Number(value) : value
    setAddVacancy((prev) => ({
      ...prev,
      [name]: finalValue,
    }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }
  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.trim()
      const currentSkills = safeArray(addVacancy.specialSkills)
      if (!currentSkills.includes(newSkill)) {
        setAddVacancy((prev) => ({
          ...prev,
          specialSkills: [...currentSkills, newSkill],
        }))
      }
      setSkillInput("")
      setErrors((prev) => ({ ...prev, specialSkills: "" }))
    }
  }
  const handleSkillDelete = (skillToDelete) => {
    const currentSkills = safeArray(addVacancy.specialSkills)
    setAddVacancy((prev) => ({
      ...prev,
      specialSkills: currentSkills.filter((skill) => skill !== skillToDelete),
    }))
  }
  // Screening Criteria handlers
  const handleCriteriaWeightChange = (criteriaIndex, newWeight) => {
    const weight = Number(newWeight) || 0
    if (weight < 0 || weight > 100) return

    setAddVacancy((prev) => ({
      ...prev,
      screeningCriteria: prev.screeningCriteria.map((criteria, index) =>
        index === criteriaIndex ? { ...criteria, weight: weight } : criteria,
      ),
    }))

    // Clear weight error if total becomes valid
    const newTotal = addVacancy.screeningCriteria.reduce(
      (sum, criteria, index) => sum + (index === criteriaIndex ? weight : criteria.weight),
      0,
    )
    if (newTotal === 100) {
      setErrors((prev) => ({ ...prev, screeningCriteria: "" }))
    }
  }
  const getTotalWeight = () => {
    return safeArray(addVacancy.screeningCriteria).reduce((sum, criteria) => sum + (criteria.weight || 0), 0)
  }
  const resetScreeningWeights = () => {
    setAddVacancy((prev) => ({
      ...prev,
      screeningCriteria: prev.screeningCriteria.map((criteria) => ({
        ...criteria,
        weight: 0,
      })),
    }))
  }
  const distributeWeightsEvenly = () => {
    const criteriaCount = addVacancy.screeningCriteria.length
    const evenWeight = Math.floor(100 / criteriaCount)
    const remainder = 100 % criteriaCount

    setAddVacancy((prev) => ({
      ...prev,
      screeningCriteria: prev.screeningCriteria.map((criteria, index) => ({
        ...criteria,
        weight: evenWeight + (index < remainder ? 1 : 0),
      })),
    }))
  }
  const handleSubmitAdd = async () => {
    if (!token) return
    setJdLoading(true)
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
          designationId: safeObject(addVacancy).designationId,
          subdeparmentId: addVacancy?.subDepartmentId === "-" ? null : safeObject(addVacancy).subDepartmentId,
          departmentId: safeObject(addVacancy).departmentId,
          specialSkills: safeArray(addVacancy.specialSkills),
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
        setSnackbar({
          open: true,
          severity: "success",
          message: "Job Description Confirmed",
        })
      }
    } catch (error) {
      console.error("Error adding job description:", error)
    } finally {
      setJdLoading(false)
    }
  }
  const handleVacancyRequest = async () => {
    const validationErrors = validateForm(activeStep) // Validate current step
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setSnackbar({
        message: "Please fill out all required fields correctly before submitting.",
        severity: "error",
        open: true,
      })
      return
    }
    if (!token) return
    const currentVacancy = safeObject(addVacancy)
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/jobPost/jobPostAddDirect`,
        {
          employmentTypeId: currentVacancy.employmentTypeId,
          employeeTypeId: currentVacancy.employeeTypeId,
          departmentId: currentVacancy.departmentId,
          designationId: currentVacancy.designationId,
          subDepartmentId: currentVacancy.subDepartmentId,
          branchId: currentVacancy.branchId,
          eligibility: currentVacancy.eligibility,
          experience: `${currentVacancy.experience?.[0] ?? 0} - ${currentVacancy.experience?.[1] ?? 10}`,
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
          AgeLimit: `${currentVacancy.AgeLimit?.[0] ?? 18} - ${currentVacancy.AgeLimit?.[1] ?? 50}`,
          gender: currentVacancy.gender,
          screeningCriteria: currentVacancy.screeningCriteria,
          ReportId: currentVacancy.ReportId, // Add the new field
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
        // Reset form
        setAddVacancy({
          organizationId: safeObject(orgs)._id || "",
          departmentId: "",
          subDepartmentId: "",
          designationId: "",
          employmentTypeId: "",
          employeeTypeId: "",
          branchId: [],
          qualificationId: [],
          experience: [0, 0],
          AgeLimit: [18, 18],
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
          ReportId: "", // Reset new field
          screeningCriteria: [
            {
              name: "Technical Skills",
              description: "Assessment of key technical skills relevant to the job.",
              weight: 0,
            },
            {
              name: "Communication Skills",
              description: "Evaluation of verbal, written, and interpersonal communication abilities.",
              weight: 0,
            },
            {
              name: "Certification",
              description: "Verification of certifications that demonstrate domain expertise.",
              weight: 0,
            },
            {
              name: "Leadership",
              description: "Assessment of leadership qualities and team management capabilities.",
              weight: 0,
            },
            {
              name: "Project Management",
              description: "Ability to manage project scope, timelines, and deliverables efficiently.",
              weight: 0,
            },
            {
              name: "Cultural Fit",
              description: "Alignment with the organization's values, work culture, and ethics.",
              weight: 0,
            },
            {
              name: "Learning Ability",
              description: "Capacity to learn quickly, adapt, and embrace new technologies or practices.",
              weight: 0,
            },
            {
              name: "Experience",
              description: "Relevant past roles and hands-on exposure to industry practices.",
              weight: 0,
            },
            {
              name: "Education",
              description: "Academic qualifications and relevance to the job domain.",
              weight: 0,
            },
            {
              name: "Stability",
              description:
                "Evaluates candidate’s history of staying at previous companies. Indicates reliability and likelihood of long-term commitment.",
              weight: 0,
            },
          ],
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
        setErrors({})
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
    }
  }
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }
  useEffect(() => {
    if (Number(addVacancy.package * addVacancy.noOfPosition) <= budgetInfo?.remainingBudget) {
      setAddVacancy((prev) => ({
        ...prev,
        budget: Number(addVacancy.package * addVacancy.noOfPosition),
      }))
    } else {
      setErrors((prev) => ({
        ...prev,
        budget: `Budget must be under ₹${budgetInfo?.remainingBudget?.toLocaleString(
          "en-IN",
        )}, please adjust your package or no of positions`,
      }))
      setAddVacancy((prev) => ({
        ...prev,
        budget: Number(addVacancy.package * addVacancy.noOfPosition),
      }))
      return
    }
    setErrors((prev) => ({ ...prev, budget: "" }))
  }, [addVacancy.noOfPosition, addVacancy.package, budgetInfo?.remainingBudget])
  // Effects
  useEffect(() => {
    if (token) {
      getEmploymentTypes()
      getDepartment()
      getBranches()
      getOrganization()
      getEmployeeTypes()
      getQualification()
      getSavedReports() // Fetch saved reports
      fetchRolePermissions() // Fetch role permissions
    }
  }, [token])
  useEffect(() => {
    if (safeObject(orgs)._id) {
      setAddVacancy((prev) => ({
        ...prev,
        organizationId: orgs._id,
      }))
    }
  }, [orgs])
  useEffect(() => {
    if (safeObject(addVacancy).departmentId) {
      getSubDepartments(addVacancy.departmentId)
    } else {
      setSubDepartments([])
    }
  }, [addVacancy.departmentId])
  useEffect(() => {
    getDesignation(selectedDesignation)
  }, [selectedDesignation])
  useEffect(() => {
    if (addVacancy.designationId && addVacancy.subDepartmentId) {
      verifyBudget(addVacancy.designationId, addVacancy.subDepartmentId)
    }
  }, [addVacancy.designationId, addVacancy.subDepartmentId, token])
  const validateForm = (step) => {
    const errors = {}
    // Step 0: Basic Details
    if (step === 0) {
      if (!safeObject(addVacancy).organizationId) errors.organizationId = "Organization is required"
      if (!safeObject(addVacancy).designationId) errors.designationId = "Designation is required"
      if (!safeObject(addVacancy).departmentId) errors.departmentId = "Department is required"
      if (!safeObject(addVacancy).subDepartmentId) errors.subDepartmentId = "Sub-department is required"
      if (!safeObject(addVacancy).employeeTypeId) errors.employeeTypeId = "Employee Type is required"
      if (!safeObject(addVacancy).employmentTypeId) errors.employmentTypeId = "Employment Type is required"
      if (!safeArray(addVacancy.branchId)?.length) errors.branchId = "At least one branch is required"
      if (!safeArray(addVacancy.qualificationId)?.length)
        errors.qualificationId = "At least one qualification is required"
      if (!Array.isArray(addVacancy.experience) || addVacancy.experience.length !== 2)
        errors.experience = "Experience range is required"
      if (!Array.isArray(addVacancy.AgeLimit) || addVacancy.AgeLimit.length !== 2)
        errors.AgeLimit = "Age range is required"
      if (!safeObject(addVacancy).gender) errors.gender = "Gender is required"
    }
    // Step 1: Opening Details
    if (step === 1) {
      if (!safeObject(addVacancy).JobType) errors.JobType = "Job Type is required"
      if (!safeObject(addVacancy).noOfPosition || safeObject(addVacancy).noOfPosition <= 0)
        errors.noOfPosition = "Number of positions must be greater than 0"
      if (!safeObject(addVacancy).budget || safeObject(addVacancy).budget > budgetInfo?.remainingBudget)
        errors.budget =
          safeObject(addVacancy).budget > budgetInfo?.remainingBudget
            ? `Budget must be under ₹${budgetInfo?.remainingBudget?.toLocaleString(
                "en-IN",
              )}, please adjust your package or no of positions`
            : "Budget must be greater than 0"
      if (!safeObject(addVacancy).package || safeObject(addVacancy).package <= 0)
        errors.package = "Package must be greater than 0 and less than or equal to budget"
      if (!safeObject(addVacancy).expiredDate) errors.expiredDate = "Expiry date is required"
      if (!safeObject(addVacancy).numberOfApplicant || safeObject(addVacancy).numberOfApplicant <= 0)
        errors.numberOfApplicant = "Number of applicants must be greater than 0"
      if (!safeObject(jobDescription).JobSummary) errors.JobSummary = "Job Summary is required"
      if (!safeArray(safeObject(jobDescription).RolesAndResponsibilities).length)
        errors.RolesAndResponsibilities = "At least one role/responsibility is required"
      if (!safeArray(safeObject(jobDescription).KeySkills).length)
        errors.KeySkills = "At least one key skill is required"
      // Only validate ReportId if verificationSuite.setup permission is true
      if (permissionsLoaded && permissions?.permissions?.verificationSuite && !safeObject(addVacancy).ReportId) {
        errors.ReportId = "Report Type is required"
      }
    }
    // Step 2: Screening Criteria
    if (step === 2) {
      const totalWeight = safeArray(addVacancy.screeningCriteria).reduce(
        (sum, criteria) => sum + (criteria.weight || 0),
        0,
      )
      if (totalWeight !== 100) {
        errors.screeningCriteria = `Total weight must equal 100%. Current total: ${totalWeight}%`
      }
    }
    return errors
  }
  const handleNextStep = () => {
    const validationErrors = validateForm(activeStep)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0) {
      setActiveStep((prev) => prev + 1)
    } else {
      setSnackbar({
        message: "Please fill out all required fields correctly before proceeding.",
        severity: "error",
        open: true,
      })
    }
  }
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                🚀 Create Job Posting
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem" }}>
                Set up your job posting with our intelligent form system
              </Typography>
            </Box>
            {/* Stepper */}
            <StyledStepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel icon={step.icon}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {step.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {step.description}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </StyledStepper>
            {/* Budget Information Display */}
            {activeStep === 1 && <BudgetInfoDisplay />}
            {/* Step Content */}
            <Box sx={{ minHeight: "400px" }}>
              {activeStep === 0 && (
                <Grow in timeout={600}>
                  <Box>
                    <SectionHeader>
                      <BusinessIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Organization & Position Details
                      </Typography>
                    </SectionHeader>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" size="small" error={!!errors.organizationId}>
                          <InputLabel>Organization</InputLabel>
                          <Select
                            name="organizationId"
                            value={safeObject(orgs)._id || ""}
                            onChange={handleInputChange}
                            label="Organization"
                            disabled
                            IconComponent={() => null}
                          >
                            {safeObject(orgs)._id && (
                              <MenuItem key={safeObject(orgs)._id} value={safeObject(orgs)._id}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <BusinessIcon fontSize="small" color="primary" />
                                  {safeObject(orgs).name}
                                </Box>
                              </MenuItem>
                            )}
                          </Select>
                          {errors.organizationId && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.organizationId}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          // disabled={!safeArray(designation).length}
                          error={!!errors.designationId}
                        >
                          <InputLabel>Designation</InputLabel>
                          <Select
                            name="designationId"
                            value={safeObject(addVacancy).designationId}
                            onChange={(e) => {
                              handleInputChange(e)
                              setSelectedDesignation(e.target.value)
                            }}
                            label="Designation"
                            renderValue={(selected) => {
                              const selectedItem = safeArray(designation).find(
                                (item) => safeObject(item)._id === selected,
                              )
                              return safeObject(selectedItem)?.name || ""
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 300,
                                  width: 150,
                                },
                              },
                            }}
                          >
                            <MenuItem disabled>
                              <TextField
                                placeholder="Search..."
                                size="small"
                                fullWidth
                                value={designationSearch}
                                onChange={(e) => setDesignationSearch(e.target.value)}
                              />
                            </MenuItem>
                            {filteredDesignations.map((item) => (
                              <MenuItem key={safeObject(item)._id} value={safeObject(item)._id}>
                                <Checkbox
                                  checked={safeObject(addVacancy).designationId === safeObject(item)._id}
                                  sx={{ p: 0.5, mr: 1 }}
                                />
                                <PersonIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                                <ListItemText primary={safeObject(item).name} />
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.designationId && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.designationId}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" size="small" error={!!errors.departmentId}>
                          <InputLabel>Department</InputLabel>
                          <Select
                            name="departmentId"
                            value={safeObject(addVacancy).departmentId}
                            disabled={!safeObject(addVacancy).designationId}
                            onChange={handleInputChange}
                            label="Department"
                            IconComponent={() => null}
                            sx={{
                              pointerEvents: "none",
                              backgroundColor: "background.paper",
                              color: "text.primary",
                            }}
                          >
                            {safeArray(departments).map((dept) => (
                              <MenuItem key={safeObject(dept)._id} value={safeObject(dept)._id}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <WorkIcon fontSize="small" color="primary" />
                                  {safeObject(dept).name}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.departmentId && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.departmentId}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          error={!!errors.subDepartmentId}
                          disabled={!safeObject(addVacancy).designationId}
                        >
                          <InputLabel>Sub-Department</InputLabel>
                          <Select
                            name="subDepartmentId"
                            value={safeObject(addVacancy).subDepartmentId}
                            onChange={handleInputChange}
                            label="Sub-Department"
                            IconComponent={() => null}
                            sx={{
                              pointerEvents: "none",
                              backgroundColor: "background.paper",
                              color: "text.primary",
                            }}
                          >
                            {safeArray(subDepartments).map((subDept) => (
                              <MenuItem key={safeObject(subDept)._id} value={safeObject(subDept)._id}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <BadgeIcon fontSize="small" color="primary" />
                                  {safeObject(subDept).name}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.subDepartmentId && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.subDepartmentId}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" size="small" error={!!errors.employeeTypeId}>
                          <InputLabel>Type of Employee</InputLabel>
                          <Select
                            name="employeeTypeId"
                            value={safeObject(addVacancy).employeeTypeId}
                            onChange={handleInputChange}
                            label="Employee Type"
                          >
                            {safeArray(employeeTypes).map((type) => (
                              <MenuItem key={safeObject(type)._id} value={safeObject(type)._id}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <GroupsIcon fontSize="small" color="primary" />
                                  {safeObject(type).title}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.employeeTypeId && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.employeeTypeId}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" size="small" error={!!errors.employmentTypeId}>
                          <InputLabel>Employment Type</InputLabel>
                          <Select
                            name="employmentTypeId"
                            value={safeObject(addVacancy).employmentTypeId}
                            onChange={handleInputChange}
                            label="Employment Type"
                          >
                            {safeArray(employmentTypes).map((type) => (
                              <MenuItem key={safeObject(type)._id} value={safeObject(type)._id}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <ScheduleIcon fontSize="small" color="primary" />
                                  {safeObject(type).title}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.employmentTypeId && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.employmentTypeId}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" size="small" error={!!errors.branchId}>
                          <InputLabel>Branches</InputLabel>
                          <Select
                            name="branchId"
                            multiple
                            value={safeArray(addVacancy.branchId)}
                            onChange={handleInputChange}
                            label="Branches"
                            renderValue={(selected) => (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected.map((value) => {
                                  const branch = safeArray(branches).find((b) => safeObject(b)._id === value)
                                  return (
                                    <Chip
                                      key={value}
                                      label={safeString(safeObject(branch).name).toUpperCase()}
                                      size="small"
                                      icon={<LocationIcon fontSize="small" />}
                                    />
                                  )
                                })}
                              </Box>
                            )}
                          >
                            {safeArray(branches).map((branch) => (
                              <MenuItem key={safeObject(branch)._id} value={safeObject(branch)._id}>
                                <Checkbox
                                  checked={safeArray(addVacancy.branchId).indexOf(safeObject(branch)._id) > -1}
                                />
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <LocationIcon fontSize="small" color="primary" />
                                      {safeString(safeObject(branch).name).toUpperCase()}
                                    </Box>
                                  }
                                />
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.branchId && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.branchId}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                    <SectionHeader sx={{ mt: 4 }}>
                      <SchoolIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Candidate Requirements
                      </Typography>
                    </SectionHeader>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" size="small" error={!!errors.qualificationId}>
                          <InputLabel>Qualification</InputLabel>
                          <Select
                            name="qualificationId"
                            multiple
                            value={safeArray(addVacancy.qualificationId).map(String)}
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
                                  checked={safeArray(addVacancy.qualificationId).includes(safeObject(item)._id)}
                                />
                                <ListItemText primary={safeString(safeObject(item).name).toUpperCase()} />
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.qualificationId && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.qualificationId}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ width: "100%", px: 3 }}>
                          <Typography fontWeight={500} gutterBottom>
                            <TimelineIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                            Experience
                          </Typography>
                          <Slider
                            value={Array.isArray(addVacancy.experience) ? addVacancy.experience : [0, 40]}
                            onChange={(e, newValue) =>
                              handleInputChange({
                                target: {
                                  name: "experience",
                                  value: newValue,
                                },
                              })
                            }
                            valueLabelDisplay="auto"
                            step={1}
                            min={0}
                            max={40}
                            disableSwap
                            sx={{ mt: 2 }}
                          />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Selected: {(() => {
                              const experience = Array.isArray(addVacancy.experience) ? addVacancy.experience : [0, 40]
                              const [minExp, maxExp] = experience
                              if (minExp === 0 && maxExp === 0) return "Fresher"
                              if (minExp === 0) return `Fresher - ${maxExp} Years`
                              if (minExp === maxExp) return `${minExp} year${minExp === 1 ? "" : "s"}`
                              return `${minExp} - ${maxExp} years`
                            })()}
                          </Typography>
                          {errors.experience && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.experience}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ width: "100%", px: 3 }}>
                          <Typography fontWeight={500} gutterBottom>
                            <TimelineIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                            Age
                          </Typography>
                          <Slider
                            value={Array.isArray(addVacancy.AgeLimit) ? addVacancy.AgeLimit : [18, 65]}
                            onChange={(e, newValue) =>
                              handleInputChange({
                                target: {
                                  name: "AgeLimit",
                                  value: newValue,
                                },
                              })
                            }
                            valueLabelDisplay="auto"
                            step={1}
                            min={18}
                            max={65}
                            disableSwap
                            sx={{ mt: 2 }}
                          />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Selected: {addVacancy.AgeLimit?.[0] ?? 18} - {addVacancy.AgeLimit?.[1] ?? 65} years
                          </Typography>
                          {errors.AgeLimit && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.AgeLimit}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl component="fieldset" fullWidth sx={{ mt: 1 }} error={!!errors.gender}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Gender
                          </Typography>
                          <RadioGroup
                            row
                            name="gender"
                            value={safeObject(addVacancy).gender || ""}
                            onChange={handleInputChange}
                          >
                            {["Male", "Female", "Both"].map((item) => (
                              <FormControlLabel
                                key={item}
                                value={item}
                                control={<Radio color="primary" />}
                                label={item}
                              />
                            ))}
                          </RadioGroup>
                          {errors.gender && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.gender}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Grow>
              )}
              {activeStep === 1 && (
                <Grow in timeout={600}>
                  <Box>
                    <SectionHeader>
                      <WorkIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Job Opening Information
                      </Typography>
                    </SectionHeader>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" size="small" error={!!errors.JobType}>
                          <InputLabel>Job Type</InputLabel>
                          <Select
                            name="JobType"
                            value={safeObject(addVacancy).JobType}
                            onChange={handleInputChange}
                            label="Job Type"
                          >
                            <MenuItem value="Internship">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <SchoolIcon fontSize="small" color="primary" />
                                Internship
                              </Box>
                            </MenuItem>
                            <MenuItem value="Regular">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <WorkIcon fontSize="small" color="primary" />
                                Regular
                              </Box>
                            </MenuItem>
                          </Select>
                          {errors.JobType && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                              {errors.JobType}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Number of Positions"
                          name="noOfPosition"
                          fullWidth
                          size="small"
                          type="number"
                          value={safeObject(addVacancy).noOfPosition}
                          onChange={handleInputChange}
                          error={!!errors.noOfPosition}
                          helperText={errors.noOfPosition}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Budget"
                          name="budget"
                          fullWidth
                          size="small"
                          type="text"
                          value={addVacancy?.budget ? `₹${Number(addVacancy.budget).toLocaleString("en-IN")}` : ""}
                          onChange={handleInputChange}
                          disabled
                          error={!!errors.budget}
                          helperText={errors.budget}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Package (₹)"
                          name="package"
                          fullWidth
                          size="small"
                          type="text"
                          value={
                            safeObject(addVacancy).package
                              ? Number(safeObject(addVacancy).package).toLocaleString("en-IN")
                              : ""
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, "") // Remove commas
                            handleInputChange({
                              ...e,
                              target: {
                                ...e.target,
                                value: rawValue,
                                name: "package",
                              },
                            })
                          }}
                          error={!!errors.package}
                          inputProps={{ min: 0, max: budgetInfo?.remainingBudget }}
                          helperText={
                            errors.package ||
                            (budgetInfo?.remainingBudget
                              ? `Max allowed: ₹${budgetInfo.remainingBudget.toLocaleString("en-IN")}`
                              : "")
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Expiry Date"
                          name="expiredDate"
                          fullWidth
                          size="small"
                          type="date"
                          value={safeObject(addVacancy).expiredDate}
                          onChange={(e) => {
                            const value = e.target.value
                            const today = new Date().setHours(0, 0, 0, 0)
                            const selected = new Date(value).setHours(0, 0, 0, 0)

                            if (selected < today) {
                              // Optional: clear the invalid value
                              handleInputChange({
                                target: {
                                  name: "expiredDate",
                                  value: "",
                                },
                              })

                              setErrors((prev) => ({
                                ...prev,
                                expiredDate: "Expiry date cannot be in the past",
                              }))
                            } else {
                              handleInputChange(e)

                              setErrors((prev) => ({
                                ...prev,
                                expiredDate: "",
                              }))
                            }
                          }}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                            min: new Date().toISOString().split("T")[0],
                          }}
                          error={!!errors.expiredDate}
                          helperText={errors.expiredDate}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Number of Applicants"
                          name="numberOfApplicant"
                          size="small"
                          fullWidth
                          type="number"
                          value={safeObject(addVacancy).numberOfApplicant}
                          onChange={handleInputChange}
                          inputProps={{ min: 1 }}
                          error={!!errors.numberOfApplicant}
                          helperText={errors.numberOfApplicant}
                        />
                      </Grid>
                      {permissionsLoaded && permissions?.permissions.verificationSuite && (
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth variant="outlined" size="small" error={!!errors.ReportId}>
                            <InputLabel>Report Type</InputLabel>
                            <Select
                              name="ReportId"
                              value={safeObject(addVacancy).ReportId}
                              onChange={handleInputChange}
                              label="Report Type"
                              disabled={reportsLoading}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {reportsLoading ? (
                                <MenuItem disabled>
                                  <CircularProgress size={20} /> Loading Reports...
                                </MenuItem>
                              ) : reportsError ? (
                                <MenuItem disabled>Error loading reports</MenuItem>
                              ) : (
                                safeArray(fetchedReports).map((report) => (
                                  <MenuItem key={safeObject(report)._id} value={safeObject(report)._id}>
                                    {safeObject(report).reportName}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                            {errors.ReportId && (
                              <Typography variant="caption" sx={{ mt: 0.5, color: "red" }}>
                                {errors.ReportId}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                      )}
                    </Grid>
                    <SectionHeader sx={{ mt: 4 }}>
                      <DescriptionIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Job Description
                      </Typography>
                      <Box sx={{ ml: "auto" }}>
                        <ActionButton
                          onClick={AutoGenerateJD}
                          variant="contained"
                          disabled={ailoading || !safeObject(addVacancy).designationId}
                          startIcon={ailoading ? <CircularProgress size={20} color="inherit" /> : <SmartToyIcon />}
                          sx={{
                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                            "&:hover": {
                              background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                            },
                          }}
                        >
                          {ailoading ? "Generating..." : "AI Generate"}
                        </ActionButton>
                      </Box>
                    </SectionHeader>
                    <Grid container spacing={3}>
                      {/* <Grid item xs={12}>
                        <TextField
                          label="Special Skills (Press Enter to add)"
                          fullWidth
                          size="small"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleSkillKeyDown}
                          placeholder="Type a skill and press Enter"
                          error={!!errors.specialSkills}
                          helperText={errors.specialSkills}
                        />
                        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {safeArray(addVacancy.specialSkills).map((skill, index) => (
                            <SkillChip
                              key={index}
                              label={skill}
                              onDelete={() => handleSkillDelete(skill)}
                              icon={<StarIcon fontSize="small" />}
                            />
                          ))}
                        </Box>
                      </Grid> */}
                      <Grid item xs={12}>
                        <TextField
                          label="Job Summary"
                          fullWidth
                          size="small"
                          multiline
                          rows={4}
                          value={safeObject(jobDescription).JobSummary || ""}
                          onChange={(e) =>
                            setJobDescription((prev) => ({
                              ...prev,
                              JobSummary: e.target.value,
                            }))
                          }
                          placeholder="Provide a brief overview of the job role..."
                          error={!!errors.JobSummary}
                          helperText={errors.JobSummary}
                          onBlur={() => {
                            if (!safeObject(jobDescription).JobSummary) {
                              setErrors((prev) => ({ ...prev, JobSummary: "Job Summary is required" }))
                            } else {
                              setErrors((prev) => ({ ...prev, JobSummary: "" }))
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Roles and Responsibilities"
                          fullWidth
                          size="small"
                          multiline
                          rows={8}
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
                          placeholder="List the key responsibilities (one per line)..."
                          error={!!errors.RolesAndResponsibilities}
                          helperText={errors.RolesAndResponsibilities}
                          onBlur={() => {
                            if (!safeArray(safeObject(jobDescription).RolesAndResponsibilities).length) {
                              setErrors((prev) => ({
                                ...prev,
                                RolesAndResponsibilities: "At least one role/responsibility is required",
                              }))
                            } else {
                              setErrors((prev) => ({ ...prev, RolesAndResponsibilities: "" }))
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Key Skills Required"
                          fullWidth
                          size="small"
                          multiline
                          rows={8}
                          value={safeArray(safeObject(jobDescription).KeySkills).join("\n")}
                          onChange={(e) =>
                            setJobDescription((prev) => ({
                              ...prev,
                              KeySkills: e.target.value
                                .split("\n")
                                .map((item) => item.trim())
                                .filter((item) => item),
                            }))
                          }
                          placeholder="List the required skills (one per line)..."
                          error={!!errors.KeySkills}
                          helperText={errors.KeySkills}
                          onBlur={() => {
                            if (!safeArray(safeObject(jobDescription).KeySkills).length) {
                              setErrors((prev) => ({ ...prev, KeySkills: "At least one key skill is required" }))
                            } else {
                              setErrors((prev) => ({ ...prev, KeySkills: "" }))
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <ActionButton
                          variant="outlined"
                          onClick={handleSubmitAdd}
                          disabled={jdLoading}
                          startIcon={jdLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                        >
                          {jdLoading ? "Confirming..." : "Confirm Job Description"}
                        </ActionButton>
                      </Grid>
                    </Grid>
                  </Box>
                </Grow>
              )}
              {activeStep === 2 && (
                <Grow in timeout={600}>
                  <Box>
                    <SectionHeader>
                      <AssessmentIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Screening Criteria Configuration
                      </Typography>
                      <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
                        <ActionButton
                          onClick={resetScreeningWeights}
                          variant="outlined"
                          size="small"
                          startIcon={<SpeedIcon />}
                        >
                          Reset All
                        </ActionButton>
                        <ActionButton
                          onClick={distributeWeightsEvenly}
                          variant="outlined"
                          size="small"
                          startIcon={<BarChartIcon />}
                        >
                          Distribute Evenly
                        </ActionButton>
                      </Box>
                    </SectionHeader>
                    {/* Total Weight Display */}
                    <StyledCard sx={{ mb: 3 }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <SpeedIcon color="primary" />
                            Total Weight Distribution
                          </Typography>
                          <Chip
                            label={`${getTotalWeight()}%`}
                            color={getTotalWeight() === 100 ? "success" : "error"}
                            variant="filled"
                            sx={{ fontWeight: 600, fontSize: "1.1rem", px: 2 }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(getTotalWeight(), 100)}
                          sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: "rgba(0,0,0,0.1)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor:
                                getTotalWeight() === 100 ? "#4caf50" : getTotalWeight() > 100 ? "#f44336" : "#ff9800",
                              borderRadius: 6,
                            },
                          }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            0%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Target: 100%
                          </Typography>
                        </Box>
                        {errors.screeningCriteria && (
                          <Typography
                            variant="body2"
                            color="error.main"
                            sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <WarningIcon fontSize="small" />
                            {errors.screeningCriteria}
                          </Typography>
                        )}
                      </CardContent>
                    </StyledCard>
                    {/* Screening Criteria Cards */}
                    <Grid container spacing={3}>
                      {safeArray(addVacancy.screeningCriteria).map((criteria, index) => {
                        const weight = criteria.weight || 0
                        return (
                          <Grid item xs={12} md={6} lg={4} key={index}>
                            <StyledCard
                              sx={{
                                height: "100%",
                                transition: "all 0.3s ease",
                                border: weight > 0 ? "2px solid #4caf50" : "1px solid rgba(0,0,0,0.1)",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                                },
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}>
                                    {criteria.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    {criteria.description}
                                  </Typography>
                                </Box>
                                <Box sx={{ mt: 3 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      mb: 2,
                                    }}
                                  >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      Weight (%)
                                    </Typography>
                                    <Chip
                                      label={`${weight}%`}
                                      size="small"
                                      color={weight > 0 ? "primary" : "default"}
                                      variant={weight > 0 ? "filled" : "outlined"}
                                    />
                                  </Box>
                                  <TextField
                                    type="number"
                                    value={weight}
                                    onChange={(e) => handleCriteriaWeightChange(index, e.target.value)}
                                    fullWidth
                                    size="small"
                                    inputProps={{
                                      min: 0,
                                      max: 100,
                                      step: 1,
                                    }}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        "&.Mui-focused": {
                                          "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "primary.main",
                                            borderWidth: "2px",
                                          },
                                        },
                                      },
                                    }}
                                  />
                                  {weight > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                      <LinearProgress
                                        variant="determinate"
                                        value={weight}
                                        sx={{
                                          height: 6,
                                          borderRadius: 3,
                                          backgroundColor: "rgba(0,0,0,0.1)",
                                          "& .MuiLinearProgress-bar": {
                                            backgroundColor: "primary.main",
                                            borderRadius: 3,
                                          },
                                        }}
                                      />
                                    </Box>
                                  )}
                                </Box>
                              </CardContent>
                            </StyledCard>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Box>
                </Grow>
              )}
            </Box>
            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: activeStep !== 0 ? "space-between" : "flex-end",
                mt: 4,
                pt: 3,
                borderTop: "1px solid #e0e7ff",
              }}
            >
              {activeStep !== 0 && (
                <ActionButton
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  variant="outlined"
                >
                  ← Back
                </ActionButton>
              )}
              {activeStep !== steps.length - 1 ? (
                <ActionButton
                  onClick={handleNextStep}
                  variant="contained"
                  sx={{
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                    },
                  }}
                >
                  Next →
                </ActionButton>
              ) : (
                <ActionButton
                  variant="contained"
                  onClick={handleVacancyRequest}
                  disabled={!safeObject(addVacancy).designationId || !safeObject(addVacancy).jobDescriptionId}
                  sx={{
                    background: "linear-gradient(45deg, #10b981, #059669)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #059669, #047857)",
                    },
                  }}
                  startIcon={<CheckCircleIcon />}
                >
                  🚀 Create Job Posting
                </ActionButton>
              )}
            </Box>
          </CardContent>
        </StyledCard>
      </Fade>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} variant="filled" severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
