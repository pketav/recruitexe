"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Snackbar,
  TextField,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  CardHeader,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  MenuItem,
  Tabs,
  Tab,
  Grid,
  Paper,
  Avatar,
  Stack,
  CircularProgress,
  Alert,
  Drawer,
} from "@mui/material"
import { formatDistanceToNow } from "date-fns"
import { TablePagination } from "@mui/material"

import {
  LocationOn,
  Schedule,
  AttachMoney,
  Favorite,
  FlashOn,
  EmojiEvents,
  ChevronRight,
  Work,
  Star,
  TrendingUp,
  People,
  Close as CloseIcon,
  FilterList,
  Search,
  LocationCity,
  PeopleAlt,
  BookmarkBorder,
} from "@mui/icons-material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import RefreshIcon from "@mui/icons-material/Refresh"
import axios from "axios"
import JobDescription from "./jobDescription/page"
import PortalInfo from "@/components/PortalInfo"

const benefits = [
  {
    icon: Favorite,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance plus wellness programs",
    color: "#e91e63",
  },
  {
    icon: FlashOn,
    title: "Flexible Work",
    description: "Remote-first culture with flexible hours and unlimited PTO",
    color: "#ff9800",
  },
  {
    icon: EmojiEvents,
    title: "Growth & Learning",
    description: "$3,000 annual learning budget and mentorship programs",
    color: "#9c27b0",
  },
  {
    icon: AttachMoney,
    title: "Competitive Pay",
    description: "Market-leading salaries, equity, and performance bonuses",
    color: "#4caf50",
  },
]

export default function JobBoard() {
  // Organization validation states
  const [orgValidation, setOrgValidation] = useState({
    loading: true,
    valid: null,
    error: null,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [activeTab1, setActiveTab1] = useState(0)
  const [openGuidelines, setOpenGuidelines] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedFilters, setExpandedFilters] = useState(false)

  const [jobs, setJobs] = useState([])
  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [applyModal, setApplyModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})
  const [isExperienced, setIsExperienced] = useState(false)
  const [uploading, setUpLoading] = useState(false)
  const [resumeUrl, setResumeUrl] = useState("")
  const [resumeFileName, setResumeFileName] = useState("")
  const router = useRouter()
  const params = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [row, setRow] = useState({})
  const [jd, setJd] = useState(false)
  const [eligibilityFail, setEligibilityFail] = useState(undefined)
  const [eligibilityPass, setEligibilityPass] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(30)
  const [totalItems, setTotalItems] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)


  // Get organization ID from router params
  const organizationId = params?.CareerPage

  const SkillChip = ({ label, icon }) => (
    <Chip
      label={label}
      icon={icon}
      size={isSmallMobile ? "small" : "medium"}
      variant="outlined"
      sx={{
        backgroundColor: "#eff6ff",
        color: "#1e40af",
        fontWeight: 500,
        borderRadius: "6px",
        fontSize: isSmallMobile ? "0.7rem" : "0.8rem",
        height: isSmallMobile ? "24px" : "32px",
        "&:hover": {
          backgroundColor: "#dbeafe",
        },
      }}
    />
  )

  const [filters, setFilters] = useState({
    jobTitle: "",
    departmentId: "",
    employmentTypeId: "",
    branchIds: "",
  })

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    emailId: "",
    highestQualification: "",
    university: "",
    graduationYear: "",
    cgpa: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    skills: "",
    resume: "",
    preferedInterviewMode: "",
    position: "",
    departmentId: "",
    branchId: "",
    knewaboutJobPostFrom: "",
    currentDesignation: "",
    lastOrganization: "",
    startDate: "",
    endDate: "",
    reasonLeaving: "",
    totalExperience: 0,
    currentCTC: 0,
    currentLocation: "",
    preferredLocation: "",
    gapIfAny: "",
    employeUniqueId: "",
    jobPostId: "",
    jobFormType: "request",
  })

  const [portalData, setPortalData] = useState([])

  // Organization validation function
  const validateOrganization = async (orgId) => {
    if (!orgId) {
      setOrgValidation({
        loading: false,
        valid: false,
        error: "Organization ID is required",
      })
      return
    }

    try {
      setOrgValidation((prev) => ({ ...prev, loading: true, error: null }))

      const response = await axios.get(`${baseUrl}/v1/api/org/checkOrganizationValid/${orgId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      if (response.data.status && response.data.items?.valid) {
        setOrgValidation({
          loading: false,
          valid: true,
          error: null,
        })
      } else {
        setOrgValidation({
          loading: false,
          valid: false,
          error: "Invalid organization ID",
        })
      }
    } catch (error) {
      console.error("Organization validation error:", error)
      setOrgValidation({
        loading: false,
        valid: false,
        error: error.response?.data?.message || "Failed to validate organization",
      })
    }
  }

  // Validate organization on component mount
  useEffect(() => {
    if (organizationId) {
      validateOrganization(organizationId)
    } else {
      setOrgValidation({
        loading: false,
        valid: false,
        error: "Organization ID not found in URL",
      })
    }
  }, [organizationId, baseUrl, token])

  const getPortalInfo = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${baseUrl}/v1/api/PortalsetUp/getAllPortals?organizationId=${organizationId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setPortalData(res.data.items || [])
    } catch (error) {
      console.error("Error fetching companies:", error)
      setPortalData([])
    } finally {
      setLoading(false)
    }
  }
  // useEffect(() => {
  //   if (orgValidation.valid) {
  //     setShowSuccess(true)

  //     const timer = setTimeout(() => {
  //       setShowSuccess(false)
  //     }, 7000)

  //     return () => clearTimeout(timer)
  //   }
  // }, [orgValidation.valid])

  useEffect(() => {
    // Only fetch portal data if organization is valid
    if (orgValidation.valid) {
      getPortalInfo()
    }
  }, [orgValidation.valid])

  const handleResumeUpload = async (file) => {
    if (!file) {
      console.error("❌ Resume file is missing.")
      return
    }

    setUpLoading(true)

    try {
      const fileFormData = new FormData()
      fileFormData.append("file", file)

      const response = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, fileFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const resumeUrl = response?.data?.url

      if (response.data.success) {
        setResumeUrl(resumeUrl)
        return resumeUrl
      } else {
        console.error("❌ Resume upload failed: Invalid response.")
      }
    } catch (error) {
      console.error("❌ Error uploading resume:", error)
    } finally {
      setUpLoading(false)
    }
  }

  const getAllJobs = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/v1/api/jobPost/getAllJobPost?jobTitle=${filters.jobTitle}&employmentTypeId=${filters.employmentTypeId}&branchIds=${filters.branchIds}&page=${page + 1}&limit=${rowsPerPage}&organizationId=${organizationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if (res.data.status) {
        setJobs(res.data.items.data)
        setTotalItems(res.data.items.totalCount)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    // Only fetch jobs if organization is valid
    if (orgValidation.valid) {
      getAllJobs()
    }
  }, [filters, page, rowsPerPage, orgValidation.valid])

  const handleSubmit = async () => {
    setLoading(true)
    setEligibilityFail(undefined)
    setEligibilityPass(undefined)
    try {
      const { isOtherKnewAbout, isOtherQualification, isOtherExperience, ...sanitizedData } = formData

      const res = await axios.post(`${baseUrl}/v1/api/job/jobapply`, sanitizedData, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      if (res.data.status) {
        setEligibilityPass(res.data.items)
      } else {
        setEligibilityFail(res.data.message)
      }
    } catch (error) {
      console.error("error", error)
    } finally {
      setLoading(false)
      getAllJobs()
    }
  }

  const [depts, setDepts] = useState([])

  const getDepartment = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/newdepartment/newdeparmentList?organizationId=${organizationId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setDepts(res.data.items || [])
    } catch (error) {
      console.error("Error fetching holidays:", error)
    }
  }

  const [branches, setBranches] = useState([])
  const getAllBranch = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/branch/getAll?organizationId=${organizationId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      if (res.data.status) {
        setBranches(res.data.items)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const [employementType, setemploymentType] = useState([])
  const getemploymentTypes = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/v1/api/employmentType/getAllEmploymentType/jobPost?organizationId=${organizationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      setemploymentType(res.data.items || [])
    } catch (error) {
      console.error("Error fetching holidays:", error)
    }
  }

  useEffect(() => {
    // Only fetch additional data if organization is valid
    if (orgValidation.valid) {
      getDepartment()
      getAllBranch()
      getemploymentTypes()
    }
  }, [orgValidation.valid])

  const downloadFile = async () => {
    try {
      const response = await fetch("/api/download-resume")
      if (!response.ok) throw new Error("Download failed")
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.setAttribute("download", "ResumeTemplate.pdf")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs)
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
    } else {
      newSavedJobs.add(jobId)
    }
    setSavedJobs(newSavedJobs)
  }

  // Memoize tab items: "All" + departments
  const tabItems = useMemo(() => {
    return [{ label: "All Positions", id: "all" }, ...depts.map((d) => ({ label: d.name, id: d._id }))]
  }, [depts])

  // When a tab is clicked, update both the tab and filters
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    const selected = tabItems[newValue]
    if (selected.id === "all") {
      setFilters((prev) => ({ ...prev, departmentId: "" }))
    } else {
      setFilters((prev) => ({ ...prev, departmentId: selected.id }))
    }
  }

  const departmentJobMap = jobs.reduce((acc, job) => {
    const deptId = job.department?._id
    if (!deptId) return acc
    if (!acc[deptId]) acc[deptId] = []
    acc[deptId].push(job)
    return acc
  }, {})

  const filteredTabItems = [
    { id: "all", label: "All Positions" },
    ...tabItems.filter((item) => item.id !== "all" && departmentJobMap[item.id]?.length > 0),
  ]

  const filteredJobs = activeTab === "all" ? jobs : jobs.filter((job) => job.department?._id === activeTab)

  useEffect(() => {
    if (filters.departmentId) {
      setActiveTab(filters.departmentId)
    } else {
      setActiveTab("all")
    }
  }, [filters.departmentId])

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0) // Reset to first page
  }

  const PaginationComponent = ({
    page,
    rowsPerPage,
    rowsPerPageOptions = [10,25,50],
    count,
    onPageChange,
    onRowsPerPageChange,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-end",
          alignItems: "center",
          mt: 1,
          width: "100%",
        }}
      >
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[10,25,50]}
          labelRowsPerPage={isMobile ? "Per page:" : "Cards per page:"}
          sx={{
            ".MuiTablePagination-toolbar": {
              pl: isMobile ? 1 : 2,
              pr: 1,
              borderRadius: 2,
              backgroundColor: "#f1f5f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              minHeight: isMobile ? "48px" : "52px",
            },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              fontSize: isMobile ? "0.75rem" : "0.85rem",
              color: "#475569",
            },
            ".MuiInputBase-root": {
              fontSize: isMobile ? "0.75rem" : "0.85rem",
            },
            ".MuiTablePagination-actions": {
              ml: isMobile ? 0.5 : 1,
            },
          }}
        />
      </Box>
    )
  }

  // Mobile Filter Drawer Component
  const MobileFilterDrawer = () => (
    <Drawer
      anchor="bottom"
      open={mobileFiltersOpen}
      onClose={() => setMobileFiltersOpen(false)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: "80vh",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Filter Jobs
          </Typography>
          <IconButton onClick={() => setMobileFiltersOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Search by Job Title"
            variant="outlined"
            value={filters.jobTitle}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                jobTitle: e.target.value,
              }))
            }
          />

          <TextField
            fullWidth
            select
            label="Branch"
            value={filters.branchIds}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                branchIds: e.target.value,
              }))
            }
          >
            {branches.map((i) => (
              <MenuItem key={i._id} value={i._id}>
                {i.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Employment Type"
            value={filters.employmentTypeId}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                employmentTypeId: e.target.value,
              }))
            }
          >
            {employementType.map((i) => (
              <MenuItem key={i._id} value={i._id}>
                {i.title}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                setFilters({
                  jobTitle: "",
                  departmentId: "",
                  employmentTypeId: "",
                  branchIds: "",
                })
              }
            >
              Clear All
            </Button>
            <Button fullWidth variant="contained" onClick={() => setMobileFiltersOpen(false)}>
              Apply Filters
            </Button>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  )

  // Show loading state while validating organization
  if (orgValidation.loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          p: 2,
        }}
      >
        <Paper sx={{ p: 4, textAlign: "center", maxWidth: 400, width: "100%" }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Validating Organization
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we verify the organization...
          </Typography>
        </Paper>
      </Box>
    )
  }

  // Show error state if organization is invalid
  if (!orgValidation.valid) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          p: 2,
        }}
      >
        <Paper sx={{ p: 4, textAlign: "center", maxWidth: 500, width: "100%" }}>
          <ErrorIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, fontWeight: "bold" }}>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            {orgValidation.error || "Invalid organization. You cannot access this page."}
          </Typography>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => validateOrganization(organizationId)}
              startIcon={<RefreshIcon />}
              fullWidth={isMobile}
            >
              Retry
            </Button>
            <Button variant="outlined" onClick={() => router.push("/")} fullWidth={isMobile}>
              Go Home
            </Button>
          </Stack>
        </Paper>
      </Box>
    )
  }

const showSuccessIndicator = (
  <Snackbar
    // open={showSuccess}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <Alert
      severity="success"
      icon={<CheckCircleIcon />}
      sx={{
        minWidth: 300,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      Organization validated successfully
    </Alert>
  </Snackbar>
)

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
         {/* <PortalInfo /> */}
      {showSuccessIndicator}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#ffffff",
          boxShadow: 1,
          width: "100%",
          left: 0,
          right: 0,
        }}
      >
       <Toolbar
  sx={{
    px: { xs: 1, sm: 2, md: 3 },
    justifyContent: "flex-start",
  }}
>
  <Container
    maxWidth="lg"
    disableGutters
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      px: { xs: 0, sm: 2 }, // optional internal spacing
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, sm: 2 },
        flexWrap: "wrap",
      }}
    >
      {/* Logo Box */}
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "4px" : "5px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          maxWidth: isMobile ? "110px" : "130px",
          backgroundColor: "#fff", // optional background
        }}
      >
        <img
          src={portalData?.Portallogo || "/placeholder.svg"}
          alt="Company Logo"
          style={{
            maxHeight: isMobile ? "30px" : "30px",
            maxWidth: "100%",
            objectFit: "contain",
            backgroundColor: "transparent",
          }}
        />
      </Box>

      {/* Portal Name */}
      <Typography
        variant={isMobile ? "subtitle1" : "body1"} 
        sx={{
          fontSize: isMobile ? undefined : `${portalData?.PortalNameFont?.fontSize || 20}px`, 
          color: portalData?.PortalNameFont?.fontColor || "inherit",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          ml: -1,
          textTransform: "none",
        }}
      >
        {portalData?.PortalName}
      </Typography>


      {/* Tabs (hidden on small screens) */}
      {!isMobile && (
        <Tabs value={activeTab1 ?? 0}>
          <Tab
            label="Careers"
            component={Link}
            href="/CareerPage"
            sx={{
              color: "primary.main",
              textTransform: "none",
              fontWeight: "medium",
              ml: 2,
            }}
          />
        </Tabs>
      )}
    </Box>
  </Container>
</Toolbar>

      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${portalData?.bannerPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
          py: { xs: 6, sm: 8, md: 7},
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="xl" sx={{ textAlign: "center", position: "relative", px: { xs: 2, sm: 3 } }}>
          <Typography
            variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
            component="h1"
            sx={{
              fontWeight: "bold",
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: portalData?.headerTextFont?.fontSize },
              color: portalData?.headerTextFont?.fontColor || "white"
            }}
          >
            {portalData?.headerText}
          </Typography>

          <Typography
            variant={isMobile ? "body1" : "h5"}
            sx={{
              color: portalData?.mainHeaderTextFont?.fontColor,
              mb: 4,
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.25rem", md: `${portalData?.mainHeaderTextFont?.fontSize}px` },
              lineHeight: { xs: 1.4, sm: 1.5 },
            }}
          >
            {portalData?.mainHeaderText}
          </Typography>

        </Container>
      </Box>

      {/* Job Search & Filters */}
      {!jd ? (
        <>
          <Box sx={{ py: { xs: 2, sm: 3 },background: "linear-gradient(90deg, #f5f5f5 0%, #e3f2fd 100%)" }}>
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", md: "center" },
                  mx: { xs: 1, sm: 3 },
                  gap: { xs: 2, md: 0 },
                  
                }}
              >

{/* <Box sx={{ py: { xs: 6, sm: 8 }, background: "linear-gradient(90deg, #f5f5f5 0%, #e3f2fd 100%)" }}> */}

                <Box sx={{ display: "flex", alignItems: "center", justifyContent:'space-between',width:'100%'}}>
                  {/* <TrendingUp color="primary" sx={{ fontSize: { xs: 24, sm: 32 } }} /> */}
                  <Typography variant={isMobile ? "h5" : "h4"} component="h2" sx={{ fontWeight: "bold" }}>
                    Open Positions
                  </Typography>
                  <Chip
                    label={`${totalItems} positions`}
                    sx={{
                      bgcolor: "primary.50",
                      color: "primary.main",
                      px: { xs: 1, sm: 2 },
                      py: 1,
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    }}
                  />
                </Box>

            
              </Box>

              {/* Desktop Filters */}
              {!isMobile ? (
                <Card sx={{ py: 2.2, px:2.2,mt: 2,width:'1150px' }}>
                  <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Grid item xs={12} md={6.5}>
                      <TextField
                        fullWidth
                        label="Search by Job Title"
                        variant="outlined"
                        size="small"
                        value={filters.jobTitle}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            jobTitle: e.target.value,
                          }))
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search/>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2.5}>
                      <TextField
                        fullWidth
                        select
                        label="All Locations"
                        size="small"
                        value={filters.branchIds}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            branchIds: e.target.value,
                          }))
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationCity />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {branches.map((i) => (
                          <MenuItem key={i._id} value={i._id}>
                            {i.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={2.5}>
                      <TextField
                        fullWidth
                        select
                        label="Employment Type"
                        size="small"
                        value={filters.employmentTypeId}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            employmentTypeId: e.target.value,
                          }))
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PeopleAlt />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {employementType.map((i) => (
                          <MenuItem key={i._id} value={i._id}>
                            {i.title}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={0.5}>
                      <IconButton
                        onClick={() =>
                          setFilters({
                            jobTitle: "",
                            departmentId: "",
                            employmentTypeId: "",
                            branchIds: "",
                          })
                        }
                      >
                        <RefreshIcon fontSize="medium" color="primary" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                /* Mobile Filter Button */
                <Box sx={{ mt: 2, px: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setMobileFiltersOpen(true)}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "medium",
                    }}
                  >
                    Filter Jobs
                  </Button>
                </Box>
              )}

              {/* Mobile Pagination */}
              {isMobile && (
                <PaginationComponent
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[5, 10, 20, 50]}
                  count={totalItems}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              )}
            </Container>
          </Box>

          {/* Job Listings with Tabs */}
          <Box sx={{ py: 2 }}>
            <Container maxWidth="lg">
              {/* Department Tabs */}
              <Paper
                sx={{
                  mb: 4,
                  bgcolor: "#f5f6f7", // light gray background
                  borderRadius: 2,
                  px: 2,
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTabs-indicator": {
                      display: "none", 
                    },
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 600,
                      minHeight: 44,
                      borderRadius: 3,
                      mr: 1,
                      px: 2,
                      py: 1,
                      color: "#6b7280", 
                      transition: "all 0.3s ease",
                      "&.Mui-selected": {
                        color: "white",
                        background: "linear-gradient(135deg,rgb(34, 116, 246) 0%,rgb(110, 54, 243) 100%)", // blue-purple
                      },
                    },
                  }}
                >
                  {filteredTabItems.map((item) => (
                    <Tab
                      key={item.id}
                      value={item.id}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {item.id === "all" ? (
                            <>
                              <Work sx={{ fontSize: 18 }} />
                              <Typography variant="body2" fontWeight={600}>
                                All Positions
                              </Typography>
                              <Chip
                                size="small"
                                label={totalItems}
                                sx={{
                                  bgcolor: item.id === activeTab ? "rgba(255,255,255,0.3)" : "#f0f0f0",
                                  color: item.id === activeTab ? "white" : "black",
                                  fontWeight: 700,
                                  fontSize: "0.75rem",
                                  height: 24,
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <Typography variant="body2" fontWeight={600}>
                                {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                              </Typography>
                              <Chip
                                size="small"
                                label={departmentJobMap[item.id]?.length || 0}
                                sx={{
                                  bgcolor: item.id === activeTab ? "rgba(255,255,255,0.3)" : "#f0f0f0",
                                  color: item.id === activeTab ? "white" : "black",
                                  fontWeight: 700,
                                  fontSize: "0.75rem",
                                  height: 24,
                                }}
                              />
                            </>
                          )}
                        </Box>
                      }
                    />
                  ))}
                </Tabs>
              </Paper>

              {/* Job Cards */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => (
                    <Card
                    key={job._id}
                    elevation={1}
                    sx={{
                      position: "relative",
                      borderRadius: 3,
                      px: { xs: 2, sm: 3 },
                      py: { xs: 2, sm: 3 },
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                      borderLeft: { xs: "3px solid #3b82f6", sm: "4px solid #3b82f6" },
                      bgcolor: "#fffefb",
                      transition: "0.3s ease",
                      "&:hover": {
                        transform: isMobile ? "none" : "translateY(-4px)",
                        borderLeftWidth: "6px",
                        color: "#3b82f6",
                      },
                    }}
                  >
                    {/* Featured badge on alternate cards */}
                    {/* {index % 2 === 0 && (
                      <Chip
                        icon={
                          <Star
                            sx={{ color: "#fff", fontSize: 16, marginLeft: "4px" }}
                          />
                        }
                        label="Featured"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 12,
                          background: "linear-gradient(to right, #facc15, #f97316)",
                          color: "#fff",
                          fontWeight: 600,
                          px: 1.5,
                          borderRadius: "16px",
                        }}
                      />
                    )} */}
                    {/* Header */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      flexDirection={{ xs: "column", sm: "row" }}
                      gap={2}
                    >
                      <Box flex={1}>
                       {portalData?.jobListCard?.positionName && <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ cursor: "pointer", fontSize: { xs: "1rem", sm: "1.2rem" } }}
                        >
                          {job.position}
                        </Typography>}
                  
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                         {portalData?.jobListCard?.department && <Chip
                            label={job?.department?.name}
                            size="small"
                            sx={{
                              bgcolor: "#eef2ff",
                              color: "#4338ca",
                              fontWeight: 600,
                              borderRadius: 2,
                              cursor: "pointer",
                            }}
                          />}
                          {/* {job?.branch.map((data)=>{
                            return (
                              <Chip
                                icon={<LocationOn sx={{ fontSize: 16 }} />}
                                label={data.name}
                                size="small"
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 600,
                                  bgcolor: "#f9fafb",
                                  cursor: "pointer",
                                }}
                              />
                            )
                          })
                          } */}
   
                         {portalData?.jobListCard?.employeeType && <Chip
                            icon={<Schedule sx={{ fontSize: 16 }} />}
                            label={job?.employeeType?.title}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              bgcolor: "#f9fafb",
                              cursor: "pointer",
                            }}
                          />}
                          {/* <Chip
                            label={job?.package ? `₹ ${job?.package}` : "-"}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              bgcolor: "#f9fafb",
                              cursor: "pointer",
                            }}
                          /> */}
                        </Stack>
                        {portalData?.jobListCard?.branch && <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',        
                            gap: 1,                   
                            alignItems: 'center',    
                            borderRadius: 2,
                            py: 1,
                            mt: 1,
                            maxWidth: '100%',
                            overflow: 'hidden'        
                          }}
                        >
                          {job?.branch.map((data)=>{
                            return (
                              <Chip
                                icon={<LocationOn sx={{ fontSize: 16 }} />}
                                label={data.name}
                                key={data._id}
                                size="small"
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 600,
                                  bgcolor: "#eef2ff",
                                  color: "#4338ca",
                                  cursor: "pointer",
                                  mr:.5,
                                }}
                              />
                            )
                          })
                          }
                        </Box>}
                        {/* Summary */}
                       {portalData?.jobListCard?.JobSummary && <Typography
                          variant="body2"
                          mt={2}
                          color="text.secondary"
                          sx={{
                            maxWidth: "90%",
                            fontSize: { xs: "0.85rem", sm: "0.9rem" },
                          }}
                        >
                          {job?.jobDescription?.jobDescription?.JobSummary}
                        </Typography>}
                  
                        {/* Key Requirements */}
                      {portalData?.jobListCard?.keySkills && <> <Typography
                          variant="subtitle2"
                          mt={2}
                          mb={1}
                          color="text.primary"
                          fontWeight={500}
                          sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}
                        >
                          Key Requirements:
                        </Typography>
                  
                        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                          {(job?.jobDescription?.jobDescription?.KeySkills || [])
                            .slice(0, 4)
                            .map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="small"
                                sx={{
                                  bgcolor: "#f3f4f6",
                                  fontWeight: 600,
                                  fontSize: "0.8rem",
                                  borderRadius: 2,
                                  cursor: "pointer",
                                }}
                              />
                            ))}
                        </Stack></> }
                      </Box>
                  
                      {/* Side Info */}
                      <Box display="flex" flexDirection="column" alignItems={{ xs: "flex-start", sm: "flex-end" }} gap={1}>
                        {portalData?.jobListCard?.jobPostTime &&<Chip
                          label={formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true })}
                          size="small"
                          sx={{
                            bgcolor: "#f3f4f6",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                          }}
                        />}
                        {portalData?.jobListCard?.applicationCount && <Box display="flex" alignItems="center" gap={0.5}>
                          <People sx={{ fontSize: 16, color: "#6b7280" }} />
                          <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                            {job.totalApplicants} applicants
                          </Typography>
                        </Box>}
                      </Box>
                    </Box>
                  
                    {/* Actions */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={3}
                      flexDirection={{ xs: "column", sm: "row" }}
                      gap={2}
                    >
                    <Button
                      variant="contained"
                      onClick={() => {
                        setJd(true);
                        setRow(job);
                      }}
                      endIcon={<ChevronRight />}
                      fullWidth={isMobile}
                      sx={{
                        px: 3,
                        py: 1.25,
                        fontWeight: 500,
                        textTransform: "none", // <-- Add this line
                        borderRadius: 2,
                        background: "linear-gradient(90deg,rgb(75, 78, 242),rgb(125, 72, 249))",
                        "&:hover": {
                          background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      View Detail
                    </Button>
                    </Box>
                  </Card>      
                  ))
                ) : (
                  <Paper
                    sx={{
                      textAlign: "center",
                      py: { xs: 6, sm: 8 },
                      background: "linear-gradient(90deg, #f5f5f5 0%, #e3f2fd 100%)",
                      borderRadius: 4,
                    }}
                  >
                    <Work sx={{ fontSize: { xs: 36, sm: 48 }, color: "text.secondary", mb: 2 }} />
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "medium", mb: 1 }}>
                      No positions found
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                      Try adjusting your search or filters to find what you're looking for.
                    </Typography>
                  </Paper>
                )}
              </Box>
                  {!isMobile && (
                  <PaginationComponent
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    count={totalItems}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                )}
            </Container>
          </Box>

          {/* Benefits Section */}
          {/* {portalData?.whyJoinOrganization && (
            <Box sx={{ py: { xs: 6, sm: 8 }, background: "linear-gradient(90deg, #f5f5f5 0%, #e3f2fd 100%)" }}>
              <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 6 } }}>
                  <Typography variant={isMobile ? "h5" : "h4"} component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                    Why Join FinCoopersTech?
                  </Typography>
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    color="text.secondary"
                    sx={{
                      maxWidth: "800px",
                      mx: "auto",
                      px: { xs: 2, sm: 0 },
                    }}
                  >
                    We believe in taking care of our team so they can do their best work and grow their careers.
                  </Typography>
                </Box>

                <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
                  {benefits.map((benefit, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                      <Card
                        sx={{
                          textAlign: "center",
                          height: "100%",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: isMobile ? "none" : "translateY(-8px)",
                            boxShadow: 8,
                          },
                        }}
                      >
                        <CardContent sx={{ pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
                          <Avatar
                            sx={{
                              width: { xs: 48, sm: 64 },
                              height: { xs: 48, sm: 64 },
                              bgcolor: benefit.color,
                              mx: "auto",
                              mb: 2,
                              transition: "transform 0.3s ease",
                              "&:hover": { transform: isMobile ? "none" : "scale(1.1)" },
                            }}
                          >
                            <benefit.icon sx={{ fontSize: { xs: 24, sm: 32 } }} />
                          </Avatar>
                          <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", mb: 1 }}>
                            {benefit.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                          >
                            {benefit.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>
          )} */}

          {/* Application Tips Section */}
          {portalData?.tipsForApplying && (
            <Box sx={{ py: { xs: 6, sm: 8 } }}>
              <Container maxWidth="lg">
                {/* <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 6 } }}>
                  <Typography variant={isMobile ? "h5" : "h4"} component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                    Tips for Applying
                  </Typography>
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    color="text.secondary"
                    sx={{
                      maxWidth: "800px",
                      mx: "auto",
                      px: { xs: 2, sm: 0 },
                    }}
                  >
                    Stand out from the crowd with these expert tips to make your application shine.
                  </Typography>
                </Box>

                <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
                  {[
                    { title: "Tailor Your Resume", color: "#1976d2" },
                    { title: "Showcase Your Projects", color: "#9c27b0" },
                    { title: "Research Our Company", color: "#4caf50" },
                    { title: "Prepare for Technical Interviews", color: "#ff9800" },
                    { title: "Ask Thoughtful Questions", color: "#3f51b5" },
                  ].map((tip, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
                     <Card
  sx={{
    height: "100%", // Make each card fill the grid cell height
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderLeft: `4px solid ${tip.color}`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: isMobile ? "none" : "translateY(-8px)",
      boxShadow: 8,
    },
  }}
>
  <CardContent
    sx={{
      textAlign: "center",
      pt: { xs: 2, sm: 3 },
      px: { xs: 2, sm: 3 },
      flexGrow: 1, // Allow content to stretch within the card
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", // Center vertically
    }}
  >
    <Avatar
      sx={{
        width: { xs: 36, sm: 48 },
        height: { xs: 36, sm: 48 },
        bgcolor: tip.color,
        mx: "auto",
        mb: 2,
        fontWeight: "bold",
        fontSize: { xs: 14, sm: 18 },
      }}
    >
      {index + 1}
    </Avatar>
    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold" }}>
      {tip.title}
    </Typography>
  </CardContent>
</Card>

                    </Grid>
                  ))}
                </Grid> */}

                <Paper
                  sx={{
                    mt: { xs: 4, sm: 6 },
                    p: { xs: 3, sm: 4 },
                    background: "linear-gradient(90deg, #e3f2fd 0%, #f3e5f5 100%)",
                    borderRadius: 4,
                    border: "1px solid #1976d2",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: "bold", mb: 2 }}>
                      💡 Pro Tip
                    </Typography>
                    <Typography
                      // variant="body1"
                      sx={{
                        mb: 3,
                        maxWidth: "800px",
                        mx: "auto",
                        fontSize: { xs: "0.9rem", sm: portalData?.proTip?.proTipTitleFont?.fontSize },
                        color:portalData?.proTip?.proTipTitleFont?.fontColor
                      }}
                    >
                      {portalData?.proTip?.proTipTitle}
                    </Typography>
                  </Box>
                </Paper>
              </Container>
            </Box>
          )}
        </>
      ) : (
        <JobDescription row={row} setJd={setJd} portalData={portalData}  organizationId={organizationId}/>
      )}

      <Dialog
        open={openGuidelines}
        onClose={() => setOpenGuidelines(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            m: isMobile ? 0 : 2,
            maxHeight: isMobile ? "100%" : "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant={isMobile ? "h6" : "h5"}>Application Guidelines</Typography>
          {isMobile && (
            <IconButton onClick={() => setOpenGuidelines(false)}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
          {portalData?.proTip?.appliGuidelinesTitle ? (
            <ul style={{ paddingLeft: "1.5rem", marginTop: 0 }}>
              {portalData.proTip.appliGuidelinesTitle
                .split(/\.\s+(?=[A-Z])/)
                .filter((item) => item.trim() !== "")
                .map((point, index) => (
                  <li key={index}>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                      {point.trim()}.
                    </Typography>
                  </li>
                ))}
            </ul>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No guidelines available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button
            onClick={() => setOpenGuidelines(false)}
            variant="contained"
            fullWidth={isMobile}
            sx={{
              background: "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
              color: "#fff",
              fontWeight: 600,
              px: 4,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0 30%, #7b1fa2 90%)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer />

      {/* Footer */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #212121 0%, #1976d2 100%)",
          color: "white",
          py: { xs: 2, sm: 3 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center', py: 2 }}>
          <Typography sx={{fontSize:portalData?.footerFont?.fontSize, color:"white"}}>
            © {new Date().getFullYear()} <a href={process.env.NEXT_PUBLIC_SITE_URL || "/"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', opacity: 0.8 }}>
              Recruitexe
            </a>. All rights reserved.
          </Typography>
        </Container>
      </Box>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </Box>
  )
}
