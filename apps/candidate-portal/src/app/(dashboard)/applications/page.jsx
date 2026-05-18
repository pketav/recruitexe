"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import {
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  InputAdornment,
  Stack,
  Link,
  IconButton,
  Avatar,
  useTheme,
  alpha,
  Tooltip,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Collapse,
  Skeleton,
  useMediaQuery,
  Menu,
  Tabs,
  Tab,
} from "@mui/material"

import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  Description as FileTextIcon,
  EmojiEvents as AwardIcon,
  Cancel as XIcon,
  Download as DownloadIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Group as GroupIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HourglassEmpty as HourglassEmptyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Dashboard as DashboardIcon,
  WorkOutline as WorkOutlineIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"

export default function JobApplicationTracker() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))
  
  const [applications, setApplications] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [expandedApplicationId, setExpandedApplicationId] = useState(null)
  const [bookmarkedJobs, setBookmarkedJobs] = useState([])
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null)
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Function to fetch job applications
  const fetchApplications = async (page = 1) => {
    setLoading(true)
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("authToken") || "your-auth-token"
      
      // Define baseUrl from environment variable
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

      const response = await axios.get(`${baseUrl}/v1/api/job/myAppliedJobs?page=${page}`, {
        headers: {
          Authorization: token,
        },
      })

      const data = response.data

      if (data.status) {
        setApplications(data.items.jobs)
        setPagination(data.items.pagination)
      } else {
        setError(data.error || "Failed to fetch applications")
      }
    } catch (err) {
      setError("An error occurred while fetching your applications")
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
      // Simulate page load completion
      setTimeout(() => setPageLoaded(true), 500)
    }
  }

  // Function to refresh data
  const refreshData = () => {
    setRefreshing(true)
    fetchApplications(pagination?.page || 1)
  }

  useEffect(() => {
    // Fetch applications from API
    fetchApplications()
  }, [])

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "primary"
      case "shortlisted":
        return "success"
      case "rejected":
        return "error"
      case "interview scheduled":
        return "secondary"
      case "offer extended":
        return "warning"
      default:
        return "default"
    }
  }

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return <ClockIcon fontSize="small" />
      case "shortlisted":
        return <CheckCircleIcon fontSize="small" />
      case "rejected":
        return <XIcon fontSize="small" />
      case "interview scheduled":
        return <CalendarIcon fontSize="small" />
      case "offer extended":
        return <AwardIcon fontSize="small" />
      default:
        return <FileTextIcon fontSize="small" />
    }
  }

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Function to handle pagination
  const handlePageChange = (event, newPage) => {
    if (pagination && newPage > 0 && newPage <= pagination.totalPages) {
      fetchApplications(newPage)
    }
  }

  // Function to toggle bookmark
  const toggleBookmark = (applicationId) => {
    if (bookmarkedJobs.includes(applicationId)) {
      setBookmarkedJobs(bookmarkedJobs.filter((id) => id !== applicationId))
    } else {
      setBookmarkedJobs([...bookmarkedJobs, applicationId])
    }
  }

  // Function to handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    setSortMenuAnchorEl(null)
  }

  // Function to filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateUniqueId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.department?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

      let matchesFilter;
      
      if (activeTab === 5) { // Bookmarked tab
        matchesFilter = bookmarkedJobs.includes(app._id);
      } else {
        matchesFilter = filterStatus === "all" || app.candidateStatus?.toLowerCase() === filterStatus.toLowerCase();
      }

      return matchesSearch && matchesFilter;
    });
  }, [applications, searchTerm, filterStatus, bookmarkedJobs, activeTab]);

  // Function to sort applications
  const sortedApplications = useMemo(() => {
    return [...filteredApplications].sort((a, b) => {
      let valueA, valueB

      switch (sortField) {
        case "position":
          valueA = a.position || ""
          valueB = b.position || ""
          break
        case "department":
          valueA = a.department?.name || ""
          valueB = b.department?.name || ""
          break
        case "status":
          valueA = a.candidateStatus || ""
          valueB = b.candidateStatus || ""
          break
        case "matchPercentage":
          valueA = a.matchPercentage || 0
          valueB = b.matchPercentage || 0
          break
        case "createdAt":
        default:
          valueA = new Date(a.createdAt || 0).getTime()
          valueB = new Date(b.createdAt || 0).getTime()
          break
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredApplications, sortField, sortDirection])

  // Function to determine application lifecycle stage
  const getLifecycleStage = (application) => {
    if (application.candidateStatus === "new") return "Application received"
    if (application.isEligible === "true") return "Under review"
    if (application.interviewSchedule === "scheduled") return "Interview scheduled"
    if (application.feedbackByHr === "rejected") return "Rejected"
    if (application.feedbackByHr === "selected") return "Offer extended"
    return "Under review"
  }

  // Function to get lifecycle progress percentage
  const getLifecycleProgress = (application) => {
    const stage = getLifecycleStage(application)
    switch (stage) {
      case "Application received":
        return 20
      case "Under review":
        return 40
      case "Interview scheduled":
        return 60
      case "Offer extended":
        return 100
      case "Rejected":
        return 100
      default:
        return 40
    }
  }

  // Function to view application details
  const viewApplicationDetails = (application) => {
    setSelectedApplication(application)
    setDetailsOpen(true)
  }

  // Function to close application details
  const closeApplicationDetails = () => {
    setDetailsOpen(false)
  }

  // Function to toggle expanded view
  const toggleExpanded = (applicationId) => {
    setExpandedApplicationId(expandedApplicationId === applicationId ? null : applicationId)
  }

  // Function to handle sort menu
  const handleSortMenuOpen = (event) => {
    setSortMenuAnchorEl(event.currentTarget)
  }

  const handleSortMenuClose = () => {
    setSortMenuAnchorEl(null)
  }

  // Function to handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchorEl(event.currentTarget)
  }

  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null)
  }

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Apply any filtering based on tab selection
    switch(newValue) {
      case 0: // All Applications
        setFilterStatus("all");
        break;
      case 1: // Active
        setFilterStatus("new");
        break;
      case 2: // Interviews
        setFilterStatus("interview scheduled");
        break;
      case 3: // Offers
        setFilterStatus("offer extended");
        break;
      case 4: // Rejected
        setFilterStatus("rejected");
        break;
      case 5: // Bookmarked
        // Keep current filter status but only show bookmarked jobs
        // This will be handled in the filteredApplications logic
        break;
      default:
        setFilterStatus("all");
    }
  };

  // Function to get interview round status color
  const getInterviewRoundStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success"
      case "scheduled":
        return "primary"
      case "pending":
        return "warning"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  // Function to get interview round status icon
  const getInterviewRoundStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircleOutlineIcon fontSize="small" />
      case "scheduled":
        return <EventAvailableIcon fontSize="small" />
      case "pending":
        return <HourglassEmptyIcon fontSize="small" />
      case "cancelled":
        return <EventBusyIcon fontSize="small" />
      default:
        return <EventIcon fontSize="small" />
    }
  }

  // Function to render interview rounds
  const renderInterviewRounds = (application) => {
    const rounds = application?.interviewDetails || []
    
    if (rounds.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No interview rounds scheduled yet
          </Typography>
        </Box>
      )
    }

    return (
      <Stepper orientation="vertical" sx={{ mt: 2 }}>
        {rounds.map((round, index) => (
          <Step key={index} active={true} completed={round.status === "Completed"}>
            <StepLabel
              StepIconComponent={() => (
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: alpha(theme.palette[getInterviewRoundStatusColor(round.status)].main, 0.1),
                    color: theme.palette[getInterviewRoundStatusColor(round.status)].main,
                  }}
                >
                  {getInterviewRoundStatusIcon(round.status)}
                </Avatar>
              )}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Typography variant="subtitle2" fontWeight="600">
                  Round {round.round}: {round.type}
                </Typography>
                <Chip
                  size="small"
                  label={round.status}
                  color={getInterviewRoundStatusColor(round.status)}
                  sx={{ ml: 1 }}
                />
              </Box>
            </StepLabel>
            <StepContent>
              <Box sx={{ ml: 1 }}>
                {round.date && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, color: "text.secondary", fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      {round.date} {round.time && `at ${round.time}`}
                    </Typography>
                  </Box>
                )}
                
                {round.interviewer && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <GroupIcon fontSize="small" sx={{ mr: 1, color: "text.secondary", fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      Interviewer: {round.interviewer}
                    </Typography>
                  </Box>
                )}
                
                {round.feedback && (
                  <Box sx={{ mt: 1, p: 1, bgcolor: alpha(theme.palette.background.default, 0.5), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="500">
                      Feedback:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {round.feedback}
                    </Typography>
                  </Box>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    )
  }

  // Loading skeleton for applications
  const renderApplicationSkeleton = () => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="30%" height={24} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="50%" height={20} sx={{ mt: 1 }} />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Skeleton variant="rectangular" width={120} height={36} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={8} sx={{ mt: 2, borderRadius: 5 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Skeleton variant="text" width="15%" />
              <Skeleton variant="text" width="15%" />
              <Skeleton variant="text" width="15%" />
              <Skeleton variant="text" width="15%" />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ bgcolor: "#5E5BEF", color: "white" }}>
        <Container maxWidth="xl" sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
              My Job Applications
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton color="inherit" size="medium">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton color="inherit" size="medium">
                <SettingsIcon />
              </IconButton>
              
              <Avatar sx={{ width: 36, height: 36, bgcolor: "white", color: "#5E5BEF" }}>
                <PersonIcon />
              </Avatar>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Navigation Bar */}
      <Box sx={{ borderBottom: "1px solid #e0e0e0", bgcolor: "white" }}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DashboardIcon sx={{ color: "#6D6DFF" }} />
                <Typography component={Link} href="/dashboard" sx={{ 
                  color: "text.primary", 
                  textDecoration: "none",
                  fontWeight: 500,
                  display: { xs: "none", sm: "block" }
                }}>
                  Dashboard
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <WorkOutlineIcon sx={{ color: "#6D6DFF" }} />
                <Typography component={Link} href="/applications" sx={{ 
                  color: "#6D6DFF", 
                  textDecoration: "none",
                  fontWeight: 500 
                }}>
                  Job Applications
                </Typography>
              </Box>
            </Box>
            
            <Tooltip title="Refresh">
              <IconButton onClick={refreshData} disabled={refreshing}>
                <RefreshIcon sx={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3, 
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="600" color="text.primary">
              Track Your Applications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor the status of all your job applications in one place
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: "1px solid #e0e0e0", mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#5E5BEF",
                  height: 3
                }
              }}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  minHeight: "48px",
                  px: 3,
                  color: "text.primary",
                  "&.Mui-selected": {
                    color: "#5E5BEF",
                    fontWeight: 600
                  },
                }
              }}
            >
              <Tab label="All Applications" />
              <Tab label="Active" />
              <Tab label="Interviews" />
              <Tab label="Offers" />
              <Tab label="Rejected" />
              <Tab label="Bookmarked" />
            </Tabs>
          </Box>

          {/* Filters and Search */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search by position, ID, or department"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#fff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleFilterMenuOpen}
                sx={{
                  height: "100%",
                  borderRadius: "10px",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  color: "text.primary",
                  borderColor: "divider",
                }}
              >
                Filter
              </Button>
              <Menu
                anchorEl={filterMenuAnchorEl}
                open={Boolean(filterMenuAnchorEl)}
                onClose={handleFilterMenuClose}
                PaperProps={{
                  sx: {
                    width: 200,
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <MenuItem 
                  onClick={() => {
                    setFilterStatus("all")
                    handleFilterMenuClose()
                  }}
                  selected={filterStatus === "all"}
                >
                  All Statuses
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    setFilterStatus("new")
                    handleFilterMenuClose()
                  }}
                  selected={filterStatus === "new"}
                >
                  <Chip 
                    size="small" 
                    label="New" 
                    color="primary" 
                    sx={{ mr: 1 }} 
                  />
                  New
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    setFilterStatus("shortlisted")
                    handleFilterMenuClose()
                  }}
                  selected={filterStatus === "shortlisted"}
                >
                  <Chip 
                    size="small" 
                    label="Shortlisted" 
                    color="success" 
                    sx={{ mr: 1 }} 
                  />
                  Shortlisted
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    setFilterStatus("interview scheduled")
                    handleFilterMenuClose()
                  }}
                  selected={filterStatus === "interview scheduled"}
                >
                  <Chip 
                    size="small" 
                    label="Interview" 
                    color="secondary" 
                    sx={{ mr: 1 }} 
                  />
                  Interview
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    setFilterStatus("offer extended")
                    handleFilterMenuClose()
                  }}
                  selected={filterStatus === "offer extended"}
                >
                  <Chip 
                    size="small" 
                    label="Offer" 
                    color="warning" 
                    sx={{ mr: 1 }} 
                  />
                  Offer
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    setFilterStatus("rejected")
                    handleFilterMenuClose()
                  }}
                  selected={filterStatus === "rejected"}
                >
                  <Chip 
                    size="small" 
                    label="Rejected" 
                    color="error" 
                    sx={{ mr: 1 }} 
                  />
                  Rejected
                </MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={handleSortMenuOpen}
                sx={{
                  height: "100%",
                  borderRadius: "10px",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  color: "text.primary",
                  borderColor: "divider",
                }}
              >
                Sort
              </Button>
              <Menu
                anchorEl={sortMenuAnchorEl}
                open={Boolean(sortMenuAnchorEl)}
                onClose={handleSortMenuClose}
                PaperProps={{
                  sx: {
                    width: 200,
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <MenuItem 
                  onClick={() => handleSort("createdAt")}
                  selected={sortField === "createdAt"}
                >
                  Date Applied
                  {sortField === "createdAt" && (
                    sortDirection === "asc" ? 
                    <ArrowUpwardIcon fontSize="small" sx={{ ml: 1 }} /> : 
                    <ArrowDownwardIcon fontSize="small" sx={{ ml: 1 }} />
                  )}
                </MenuItem>
                <MenuItem 
                  onClick={() => handleSort("position")}
                  selected={sortField === "position"}
                >
                  Position
                  {sortField === "position" && (
                    sortDirection === "asc" ? 
                    <ArrowUpwardIcon fontSize="small" sx={{ ml: 1 }} /> : 
                    <ArrowDownwardIcon fontSize="small" sx={{ ml: 1 }} />
                  )}
                </MenuItem>
                <MenuItem 
                  onClick={() => handleSort("department")}
                  selected={sortField === "department"}
                >
                  Department
                  {sortField === "department" && (
                    sortDirection === "asc" ? 
                    <ArrowUpwardIcon fontSize="small" sx={{ ml: 1 }} /> : 
                    <ArrowDownwardIcon fontSize="small" sx={{ ml: 1 }} />
                  )}
                </MenuItem>
                <MenuItem 
                  onClick={() => handleSort("status")}
                  selected={sortField === "status"}
                >
                  Status
                  {sortField === "status" && (
                    sortDirection === "asc" ? 
                    <ArrowUpwardIcon fontSize="small" sx={{ ml: 1 }} /> : 
                    <ArrowDownwardIcon fontSize="small" sx={{ ml: 1 }} />
                  )}
                </MenuItem>
                <MenuItem 
                  onClick={() => handleSort("matchPercentage")}
                  selected={sortField === "matchPercentage"}
                >
                  Match Percentage
                  {sortField === "matchPercentage" && (
                    sortDirection === "asc" ? 
                    <ArrowUpwardIcon fontSize="small" sx={{ ml: 1 }} /> : 
                    <ArrowDownwardIcon fontSize="small" sx={{ ml: 1 }} />
                  )}
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>

          {/* Error State */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: "10px",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && !pageLoaded && (
            <>
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ mb: 3 }}>
                  {renderApplicationSkeleton()}
                </Box>
              ))}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && sortedApplications.length === 0 && (
            <Box 
              sx={{ 
                textAlign: "center", 
                py: 5,
                bgcolor: "#fff",
                borderRadius: "10px",
                border: "1px dashed #e0e0e0",
              }}
            >
              <FileTextIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" fontWeight="500">No applications found</Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't applied to any jobs yet"}
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2,
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 3,
                }}
              >
                Browse Jobs
              </Button>
            </Box>
          )}

          {/* Application List */}
          {!loading && !error && sortedApplications.length > 0 && (
            <Stack spacing={2}>
              {sortedApplications.map((application) => (
                <Card 
                  key={application._id} 
                  variant="outlined"
                  sx={{
                    borderRadius: "10px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                              mr: 1,
                              fontWeight: 600,
                              fontSize: { xs: "1rem", sm: "1.25rem" }
                            }}
                          >
                            {application.position}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(application.candidateStatus)}
                            label={application.candidateStatus}
                            color={getStatusColor(application.candidateStatus)}
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              borderRadius: "16px",
                              height: "24px",
                            }}
                          />
                          {application.candidateStatus === "new" && (
                            <Chip
                              label="New"
                              color="primary"
                              size="small"
                              sx={{ 
                                ml: 1,
                                fontWeight: 500,
                                borderRadius: "16px",
                                height: "24px",
                                bgcolor: "#6366f1",
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <BusinessIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {application.department?.name || "Department not specified"}
                            {application.branches && " • "}
                            {application.branches && application.branches.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <CalendarIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Applied on {formatDate(application.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Application ID: {application.candidateUniqueId}
                          {application.matchPercentage && (
                            <span style={{ marginLeft: 8 }}>
                              Match:{" "}
                              <span style={{ color: "#2e7d32", fontWeight: 500 }}>{application.matchPercentage}%</span>
                            </span>
                          )}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        sx={{ 
                          display: "flex", 
                          flexDirection: "column", 
                          justifyContent: "space-between",
                          alignItems: { xs: "flex-start", sm: "flex-end" }
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton 
                            color={bookmarkedJobs.includes(application._id) ? "primary" : "default"}
                            onClick={() => toggleBookmark(application._id)}
                            sx={{ mr: 1 }}
                          >
                            {bookmarkedJobs.includes(application._id) ? (
                              <BookmarkIcon />
                            ) : (
                              <BookmarkBorderIcon />
                            )}
                          </IconButton>
                          <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={() => viewApplicationDetails(application)}
                            sx={{
                              borderRadius: "20px",
                              textTransform: "none",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              bgcolor: "#6366f1",
                              "&:hover": {
                                bgcolor: "#4f46e5",
                              },
                            }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom fontWeight="500">
                        Application Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={getLifecycleProgress(application)}
                        sx={{ 
                          height: 8, 
                          borderRadius: 5, 
                          mb: 1,
                          bgcolor: alpha(theme.palette.grey[300], 0.5),
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            bgcolor: getLifecycleStage(application) === "Rejected" 
                              ? theme.palette.error.main 
                              : "#6366f1",
                          }
                        }}
                      />
                      <Grid container justifyContent="space-between">
                        <Grid item>
                          <Typography
                            variant="caption"
                            color={
                              getLifecycleStage(application) === "Application received" 
                                ? "#6366f1" 
                                : "text.secondary"
                            }
                            fontWeight={getLifecycleStage(application) === "Application received" ? 600 : 400}
                          >
                            Received
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="caption"
                            color={
                              getLifecycleStage(application) === "Under review" 
                                ? "#6366f1" 
                                : "text.secondary"
                            }
                            fontWeight={getLifecycleStage(application) === "Under review" ? 600 : 400}
                          >
                            Review
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="caption"
                            color={
                              getLifecycleStage(application) === "Interview scheduled" 
                                ? "#6366f1" 
                                : "text.secondary"
                            }
                            fontWeight={getLifecycleStage(application) === "Interview scheduled" ? 600 : 400}
                          >
                            Interview
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="caption"
                            color={
                              getLifecycleStage(application) === "Offer extended"
                                ? "#6366f1"
                                : getLifecycleStage(application) === "Rejected"
                                  ? "error"
                                  : "text.secondary"
                            }
                            fontWeight={
                              getLifecycleStage(application) === "Offer extended" || 
                              getLifecycleStage(application) === "Rejected" 
                                ? 600 
                                : 400
                            }
                          >
                            {getLifecycleStage(application) === "Rejected" ? "Rejected" : "Offer"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Expandable Interview Rounds */}
                    {application.interviewDetails && application.interviewDetails.length > 0 && (
                      <>
                        <Box 
                          sx={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            mt: 2,
                            pt: 2,
                            borderTop: "1px solid #f0f0f0",
                            cursor: "pointer",
                          }}
                          onClick={() => toggleExpanded(application._id)}
                        >
                          <Typography variant="body2" fontWeight="500" color="primary">
                            Interview Rounds ({application.interviewDetails.length})
                          </Typography>
                          <IconButton size="small">
                            {expandedApplicationId === application._id ? (
                              <ExpandLessIcon fontSize="small" />
                            ) : (
                              <ExpandMoreIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                        <Collapse in={expandedApplicationId === application._id}>
                          {renderInterviewRounds(application)}
                        </Collapse>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>
          )}
        </Paper>
      </Container>

      {/* Application Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={closeApplicationDetails} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          }
        }}
      >
        {selectedApplication && (
          <>
            <DialogTitle 
              sx={{ 
                bgcolor: "#6366f1",
                color: "#fff",
                py: 2,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    Application Details
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mt: 0.5, opacity: 0.9 }}>
                    {selectedApplication.position} - {selectedApplication.candidateUniqueId}
                  </Typography>
                </Box>
                <Chip
                  label={selectedApplication.candidateStatus}
                  color={getStatusColor(selectedApplication.candidateStatus)}
                  sx={{ 
                    fontWeight: 500,
                    color: "#fff",
                    borderRadius: "16px",
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        height: "100%",
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom fontWeight="600">
                        Personal Information
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <PersonIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Full Name" secondary={selectedApplication.name} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Email" secondary={selectedApplication.emailId} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PhoneIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Mobile" secondary={selectedApplication.mobileNumber} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <LocationIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Location"
                            secondary={`${selectedApplication.city}, ${selectedApplication.state}`}
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        height: "100%",
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom fontWeight="600">
                        Application Information
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <WorkIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Position" secondary={selectedApplication.position} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <BusinessIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Department"
                            secondary={selectedApplication.department?.name || "Not specified"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <LocationIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Branch"
                            secondary={selectedApplication.branches?.name || "Not specified"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CalendarIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Applied On" secondary={formatDate(selectedApplication.createdAt)} />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom fontWeight="600">
                        Application Status
                      </Typography>
                      <Box sx={{ display: "flex",lay: "flex", alignItems: "center", mb: 2 }}>
                        <Chip
                          icon={getStatusIcon(selectedApplication.candidateStatus)}
                          label={getLifecycleStage(selectedApplication)}
                          color={getStatusColor(selectedApplication.candidateStatus)}
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" gutterBottom>
                          Application Progress
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={getLifecycleProgress(selectedApplication)}
                          sx={{ 
                            height: 10, 
                            borderRadius: 5, 
                            mb: 1,
                            bgcolor: alpha(theme.palette.grey[300], 0.5),
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 5,
                              bgcolor: getLifecycleStage(selectedApplication) === "Rejected" 
                                ? theme.palette.error.main 
                                : "#6366f1",
                          }
                        }}
                      />
                      <Grid container justifyContent="space-between">
                        <Grid item>
                          <Typography
                            variant="caption"
                            color={
                              getLifecycleStage(selectedApplication) === "Application received"
                                  ? "#6366f1"
                                  : "text.secondary"
                            }
                            fontWeight={getLifecycleStage(selectedApplication) === "Application received" ? 600 : 400}
                          >
                            Application received
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="caption"
                            color={
                              getLifecycleStage(selectedApplication) === "Under review"
                                  ? "#6366f1"
                                  : "text.secondary"
                            }
                            fontWeight={getLifecycleStage(selectedApplication) === "Under review" ? 600 : 400}
                          >
                            Under review
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="caption"
                            color={
                              getLifecycleStage(selectedApplication) === "Interview scheduled"
                                  ? "#6366f1"
                                  : "text.secondary"
                            }
                            fontWeight={getLifecycleStage(selectedApplication) === "Interview scheduled" ? 600 : 400}
                          >
                            Interview scheduled
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="caption"
                            color={
                              getLifecycleStage(selectedApplication) === "Offer extended"
                                  ? "#6366f1"
                                  : getLifecycleStage(selectedApplication) === "Rejected"
                                      ? "error"
                                      : "text.secondary"
                            }
                            fontWeight={
                              getLifecycleStage(selectedApplication) === "Offer extended" ||
                              getLifecycleStage(selectedApplication) === "Rejected"
                                  ? 600
                                  : 400
                            }
                          >
                            {getLifecycleStage(selectedApplication) === "Rejected" ? "Rejected" : "Offer extended"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    </Paper>
                  </Grid>

                  {/* Interview Rounds */}
                  {selectedApplication.interviewDetails && selectedApplication.interviewDetails.length > 0 && (
                    <Grid item xs={12}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: "10px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom fontWeight="600">
                          Interview Rounds
                        </Typography>
                        {renderInterviewRounds(selectedApplication)}
                      </Paper>
                    </Grid>
                  )}

                  {selectedApplication.matchPercentage && (
                      <Grid item xs={12}>
                        <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: "10px",
                              border: "1px solid #e0e0e0",
                            }}
                        >
                          <Typography variant="subtitle1" gutterBottom fontWeight="600">
                            Match Analysis
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Typography variant="body1" fontWeight="600" color="success.main" sx={{ mr: 2 }}>
                              {selectedApplication.matchPercentage}% Match
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={selectedApplication.matchPercentage}
                                color="success"
                                sx={{
                                  height: 8,
                                  borderRadius: 5,
                                  flexGrow: 1,
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 5,
                                  }
                                }}
                            />
                          </Box>
                          {selectedApplication.summary && (
                              <Paper
                                  variant="outlined"
                                  sx={{
                                    p: 2,
                                    bgcolor: "#f8f9fa",
                                    borderRadius: "8px",
                                  }}
                              >
                                <Typography variant="body2">{selectedApplication.summary}</Typography>
                              </Paper>
                          )}
                        </Paper>
                      </Grid>
                  )}

                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom fontWeight="600">
                        Education & Skills
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <SchoolIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Highest Qualification"
                            secondary={`${selectedApplication.highestQualification} (${selectedApplication.graduationYear})`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <SchoolIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="University" secondary={selectedApplication.university} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <AssignmentTurnedInIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="CGPA/Percentage" secondary={`${selectedApplication.cgpa}%`} />
                        </ListItem>
                      </List>

                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                        Skills
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedApplication.skills?.split(",").map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill.trim()}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: "16px",
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              borderColor: alpha(theme.palette.primary.main, 0.2),
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom fontWeight="600">
                        Documents
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        component={Link}
                        href={selectedApplication.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderRadius: "20px",
                          textTransform: "none",
                        }}
                      >
                        Download Resume
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={closeApplicationDetails}
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  bgcolor: "#6366f1",
                  "&:hover": {
                    bgcolor: "#4f46e5",
                  },
                }}
              >
                Contact Recruiter
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box> 
  )
}
