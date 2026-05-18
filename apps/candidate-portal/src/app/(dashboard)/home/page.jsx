"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../context/AuthContext"
import { useSearchParams } from "next/navigation"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  ListItemIcon,
  IconButton,
  LinearProgress,
} from "@mui/material"
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Assignment as AssignmentIcon,
  AttachFile as AttachFileIcon,
  Business as BusinessIcon,
  CalendarMonth as CalendarIcon,
  CheckCircleOutline as CheckIcon,
  Close as CloseIcon,
  EventAvailable as EventAvailableIcon,
  FilterList as FilterListIcon,
  HourglassEmpty as PendingIcon,
  LocationOn as LocationOnIcon,
  MonetizationOn as MonetizationOnIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Work as WorkIcon,
  VideoCall as VideoCallIcon,
} from "@mui/icons-material"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

const WelcomePage = () => {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { verification, login } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const [timeframeAnchorEl, setTimeframeAnchorEl] = useState(null)
  const [timeframe, setTimeframe] = useState("all")
  const [jobs, setJobs] = useState([])
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    jobTitle: "",
    departmentId: "",
    employmentTypeId: "",
    experienceFrom: "",
    experienceTo: "",
    branchIds: "",
  })

  useEffect(() => {
    fetchDashboardData()
    getAllJobs()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : ""

      const response = await axios.get(`${baseUrl}/v1/api/candidate/getCandidateDashboard`, {
        headers: {
          Authorization: token,
        },
      })

      const data = response.data
      if (data.status) {
        setDashboardData(data.items)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAllJobs = async () => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : ""
      const res = await axios.get(
        `${baseUrl}/v1/api/jobPost/getAllJobPost?jobTitle=${filters.jobTitle}&departmentId=${filters.departmentId}&employmentTypeId=${filters.employmentTypeId}&experienceFrom=${filters.experienceFrom}&experienceTo=${filters.experienceTo}&branchIds=${filters.branchIds}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if (res.data.status) {
        setJobs(res.data.items)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  const handleCompleteProfile = () => {
    router.push("/completeProfile")
  }

  const handleViewAllApplications = () => {
    router.push("/applications")
  }

  const handleNewApplication = () => {
    router.push("/Careers")
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleFilterOpen = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleTimeframeOpen = (event) => {
    setTimeframeAnchorEl(event.currentTarget)
  }

  const handleTimeframeClose = (value) => {
    if (value) {
      setTimeframe(value)
    }
    setTimeframeAnchorEl(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return theme.palette.info.main
      case "shortlisted":
        return theme.palette.success.main
      case "managerReview":
        return theme.palette.warning.main
      case "scheduled":
        return theme.palette.secondary.main
      default:
        return theme.palette.grey[500]
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate application progress
  const calculateProgress = () => {
    if (!dashboardData) return 0

    const shortlisted = dashboardData.overview.statusBreakdown.find((item) => item.status === "shortlisted")?.count || 0
    const total = dashboardData.overview.totalApplications

    return total > 0 ? (shortlisted / total) * 100 : 0
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: theme.palette.grey[50], minHeight: "100vh" }}>
      {/* Top Actions Bar */}
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        {verification.profileCompletionPercentage < 100 && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCompleteProfile}
            startIcon={<PersonIcon />}
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              display: { xs: "none", md: "flex" },
            }}
          >
            Complete Profile ({verification.profileCompletionPercentage}%)
          </Button>
        )}
        <IconButton color="inherit" onClick={handleNotificationOpen}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400, mt: 1 },
          }}
        >
          <MenuItem onClick={handleNotificationClose}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2">Your application for Frontend Developer has been viewed</Typography>
              <Typography variant="caption" color="text.secondary">
                Just now
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationClose}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2">Interview scheduled for UX Designer position</Typography>
              <Typography variant="caption" color="text.secondary">
                2 hours ago
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationClose}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2">You have been shortlisted for Product Manager role</Typography>
              <Typography variant="caption" color="text.secondary">
                Yesterday
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: "center" }}>
            <Typography variant="body2" color="primary">
              View all notifications
            </Typography>
          </MenuItem>
        </Menu>
      </Box>

      {/* Email Verification Alert */}
      {!verification.isEmailVerified && (
        <Paper
          elevation={0}
          sx={{
            mx: 3,
            p: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#fff3cd",
            color: "#856404",
            border: "1px solid #ffeeba",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NotificationsIcon sx={{ mr: 2 }} />
            <Typography>Your email is not verified. Please check your inbox to verify your email.</Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#856404",
              color: "#856404",
              "&:hover": {
                borderColor: "#856404",
                backgroundColor: "rgba(133, 100, 4, 0.04)",
              },
            }}
          >
            Resend Email
          </Button>
        </Paper>
      )}

      {/* Dashboard Content */}
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 10 }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your dashboard...
          </Typography>
        </Box>
      ) : dashboardData ? (
        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Application Overview */}
            <Grid item xs={12}>
              <Paper elevation={1}>
                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="h6">Application Overview</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track your job application progress
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FilterListIcon />}
                      onClick={handleTimeframeOpen}
                    >
                      {timeframe === "all" ? "All Time" : timeframe === "month" ? "This Month" : "This Week"}
                    </Button>
                    <Menu
                      anchorEl={timeframeAnchorEl}
                      open={Boolean(timeframeAnchorEl)}
                      onClose={() => handleTimeframeClose()}
                    >
                      <MenuItem onClick={() => handleTimeframeClose("all")}>All Time</MenuItem>
                      <MenuItem onClick={() => handleTimeframeClose("month")}>This Month</MenuItem>
                      <MenuItem onClick={() => handleTimeframeClose("week")}>This Week</MenuItem>
                    </Menu>
                    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleNewApplication}>
                      Apply for Jobs
                    </Button>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab label="Statistics" />
                    <Tab label="Application Progress" />
                  </Tabs>

                  {tabValue === 0 && (
                    <Box>
                      <Grid container spacing={4}>
                        {[
                          {
                            title: "Total Applications",
                            value: dashboardData.overview.totalApplications,
                            description: `Across ${dashboardData.departmentBreakdown.length} departments`,
                            icon: <AssignmentIcon />,
                            color: theme.palette.primary.main,
                          },
                          {
                            title: "In Review",
                            value:
                              dashboardData.overview.statusBreakdown.find((item) => item.status === "managerReview")
                                ?.count || 0,
                            description: "Awaiting feedback",
                            icon: <PendingIcon />,
                            color: theme.palette.warning.main,
                          },
                          {
                            title: "Shortlisted",
                            value:
                              dashboardData.overview.statusBreakdown.find((item) => item.status === "shortlisted")
                                ?.count || 0,
                            description: `${
                              Math.round(
                                ((dashboardData.overview.statusBreakdown.find((item) => item.status === "shortlisted")
                                  ?.count || 0) /
                                  dashboardData.overview.totalApplications) *
                                  100,
                              ) || 0
                            }% success rate`,
                            icon: <CheckIcon />,
                            color: theme.palette.success.main,
                          },
                          {
                            title: "Rejected",
                            value:
                              dashboardData.overview.statusBreakdown.find((item) => item.status === "rejected")
                                ?.count || 0,
                            description: "0 this month",
                            icon: <CloseIcon />,
                            color: theme.palette.error.main,
                          },
                        ].map((item, i) => (
                          <Grid item xs={12} sm={6} md={3} key={i}>
                            <Paper
                              elevation={1}
                              sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
                            >
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.title}
                                  </Typography>
                                  <Typography variant="h4" sx={{ my: 1, fontWeight: "bold" }}>
                                    {item.value}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.description}
                                  </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: item.color, width: 40, height: 40 }}>{item.icon}</Avatar>
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button endIcon={<ArrowForwardIcon />} onClick={handleViewAllApplications}>
                          View all applications
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {tabValue === 1 && (
                    <Box>
                      <Grid container spacing={4}>
                        {[
                          {
                            title: "Applied",
                            value: dashboardData.overview.totalApplications,
                            icon: <AssignmentIcon />,
                            color: theme.palette.primary.light,
                          },
                          {
                            title: "Screening",
                            value:
                              dashboardData.overview.statusBreakdown.find((item) => item.status === "active")?.count ||
                              0,
                            icon: <VisibilityIcon />,
                            color: theme.palette.secondary.light,
                          },
                          {
                            title: "Interview",
                            value:
                              dashboardData.overview.interviewStatusBreakdown.find(
                                (item) => item.interviewStatus === "scheduled",
                              )?.count || 0,
                            icon: <CalendarIcon />,
                            color: theme.palette.warning.light,
                          },
                          {
                            title: "Offer",
                            value:
                              dashboardData.overview.statusBreakdown.find((item) => item.status === "shortlisted")
                                ?.count || 0,
                            icon: <CheckIcon />,
                            color: theme.palette.success.light,
                          },
                        ].map((stage, i) => (
                          <Grid item xs={12} sm={6} md={3} key={i}>
                            <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2, height: "100%" }}>
                                <Avatar sx={{ bgcolor: stage.color }}>{stage.icon}</Avatar>
                                <Box>
                                  <Typography variant="body2">{stage.title}</Typography>
                                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                    {stage.value}
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>

                      <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2">Application Success Rate</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {Math.round(calculateProgress())}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress()}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            mb: 1,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {dashboardData.overview.statusBreakdown.find((item) => item.status === "shortlisted")
                            ?.count || 0}{" "}
                          out of {dashboardData.overview.totalApplications} applications have been shortlisted
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Main Content Area */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                {/* Upcoming Interviews */}
                <Grid item xs={12}>
                  <Card elevation={1}>
                    <CardHeader
                      sx={{ pb: 1 }}
                      title={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6">Upcoming Interviews</Typography>
                        </Box>
                      }
                      subheader="Your scheduled interviews"
                      action={
                        <Button variant="outlined" size="small" onClick={() => router.push("/interviews")}>
                          View Calendar
                        </Button>
                      }
                    />
                    <Divider />
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        {dashboardData.overview.interviewStatusBreakdown.find(
                          (item) => item.interviewStatus === "scheduled",
                        )?.count > 0 ? (
                          [
                            {
                              id: 1,
                              position: "Senior Frontend Developer",
                              company: "Tech Innovations Inc.",
                              date: "May 20, 2025",
                              time: "10:00 AM",
                              type: "Video",
                              icon: <VideoCallIcon />,
                              link: "https://meet.google.com/abc-defg-hij",
                            },
                            {
                              id: 2,
                              position: "UX Designer",
                              company: "Creative Solutions Ltd.",
                              date: "May 22, 2025",
                              time: "2:30 PM",
                              type: "In-person",
                              icon: <LocationOnIcon />,
                              location: "123 Business Avenue, Suite 400",
                            },
                          ].map((interview) => (
                            <Grid item xs={12} key={interview.id}>
                              <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
                                <Box
                                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                                >
                                  <Box>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                      {interview.position}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {interview.company}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                      <CalendarIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                                      <Typography variant="body2">
                                        {interview.date} at {interview.time}
                                      </Typography>
                                    </Box>
                                    {interview.type === "In-person" && (
                                      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                                        <Typography variant="body2">{interview.location}</Typography>
                                      </Box>
                                    )}
                                  </Box>
                                  <Chip
                                    icon={interview.icon}
                                    label={interview.type}
                                    color={interview.type === "Video" ? "primary" : "default"}
                                    variant={interview.type === "Video" ? "filled" : "outlined"}
                                  />
                                </Box>
                                {interview.type === "Video" && (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    href={interview.link}
                                    target="_blank"
                                  >
                                    Join Meeting
                                  </Button>
                                )}
                              </Paper>
                            </Grid>
                          ))
                        ) : (
                          <Grid item xs={12}>
                            <Box sx={{ p: 4, textAlign: "center" }}>
                              <CalendarIcon sx={{ fontSize: 40, color: "text.secondary", mb: 2 }} />
                              <Typography variant="body1" color="text.secondary">
                                No upcoming interviews scheduled.
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Your scheduled interviews will appear here.
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Recent Applications */}
                <Grid item xs={12}>
                  <Card elevation={1}>
                    <CardHeader
                      sx={{ pb: 1 }}
                      title="Recent Applications"
                      subheader="Your recently submitted job applications"
                      action={
                        <Box>
                          <IconButton size="small">
                            <SearchIcon />
                          </IconButton>
                          <IconButton size="small" onClick={handleFilterOpen}>
                            <FilterListIcon />
                          </IconButton>
                          <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
                            <MenuItem onClick={handleFilterClose}>All Applications</MenuItem>
                            <MenuItem onClick={handleFilterClose}>Active</MenuItem>
                            <MenuItem onClick={handleFilterClose}>Shortlisted</MenuItem>
                            <MenuItem onClick={handleFilterClose}>In Review</MenuItem>
                          </Menu>
                        </Box>
                      }
                    />
                    <Divider />
                    <List
                      sx={{ width: "100%", bgcolor: "background.paper", p: 0, maxHeight: "400px", overflow: "auto" }}
                    >
                      {dashboardData.recentApplications.length > 0 ? (
                        dashboardData.recentApplications.map((application) => (
                          <React.Fragment key={application._id}>
                            <ListItem
                              secondaryAction={
                                <Chip
                                  label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                  sx={{
                                    bgcolor: getStatusColor(application.status),
                                    color: "white",
                                    fontWeight: 500,
                                  }}
                                  size="small"
                                />
                              }
                              sx={{ px: 2, py: 1 }}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="medium"
                                    sx={{
                                      cursor: "pointer",
                                      "&:hover": { color: "primary.main" },
                                    }}
                                    onClick={() => router.push(`/applications/${application._id}`)}
                                  >
                                    {application.position}
                                  </Typography>
                                }
                                secondary={
                                  <React.Fragment>
                                    <Typography component="span" variant="body2" color="text.primary">
                                      {application.department?.name || "Unspecified Department"}
                                    </Typography>
                                    {" — Applied on " + formatDate(application.createdAt)}
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                          </React.Fragment>
                        ))
                      ) : (
                        <Box sx={{ p: 4, textAlign: "center" }}>
                          <Typography variant="body1" color="text.secondary">
                            No recent applications found.
                          </Typography>
                        </Box>
                      )}
                    </List>
                    <Box sx={{ px: 3, pb: 3, pt: 1, display: "flex", justifyContent: "center" }}>
                      <Button endIcon={<ArrowForwardIcon />} onClick={handleViewAllApplications}>
                        View all applications
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={4}>
                {/* Profile Completion */}
                <Grid item xs={12}>
                  <Card elevation={1}>
                    <CardHeader
                      sx={{ pb: 1 }}
                      title={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6">Profile Completion</Typography>
                        </Box>
                      }
                      subheader="Complete your profile to improve job matches"
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2">{verification.profileCompletionPercentage}% Complete</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={verification.profileCompletionPercentage}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <List dense>
                        {[
                          {
                            id: 1,
                            title: "Upload profile picture",
                            completed: verification.profileCompletionPercentage > 20,
                          },
                          {
                            id: 2,
                            title: "Add work experience",
                            completed: verification.profileCompletionPercentage > 40,
                          },
                          {
                            id: 3,
                            title: "Add education details",
                            completed: verification.profileCompletionPercentage > 60,
                          },
                          {
                            id: 4,
                            title: "Upload resume/CV",
                            completed: verification.profileCompletionPercentage > 80,
                          },
                          { id: 5, title: "Add skills", completed: verification.profileCompletionPercentage > 90 },
                          {
                            id: 6,
                            title: "Complete assessment",
                            completed: verification.profileCompletionPercentage === 100,
                          },
                        ].map((task) => (
                          <ListItem key={task.id}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckIcon color={task.completed ? "success" : "disabled"} fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={task.title}
                              sx={{
                                textDecoration: task.completed ? "line-through" : "none",
                                color: task.completed ? "text.secondary" : "text.primary",
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <Box sx={{ px: 3, pb: 3, pt: 1, display: "flex", justifyContent: "center" }}>
                      <Button endIcon={<ArrowForwardIcon />} onClick={handleCompleteProfile}>
                        Complete Profile
                      </Button>
                    </Box>
                  </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12}>
                  <Card elevation={1}>
                    <CardHeader sx={{ pb: 1 }} title="Quick Actions" subheader="Common tasks and shortcuts" />
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        {[
                          {
                            icon: <SearchIcon />,
                            title: "Find Jobs",
                            description: "Search for new opportunities",
                            href: "/Careers",
                          },
                          {
                            icon: <AssignmentIcon />,
                            title: "New Application",
                            description: "Apply for a position",
                            href: "/applications/new",
                          },
                          {
                            icon: <AttachFileIcon />,
                            title: "Upload Resume",
                            description: "Update your CV",
                            href: "/completeProfile",
                          },
                          {
                            icon: <WorkIcon />,
                            title: "Job Alerts",
                            description: "Manage notifications",
                            href: "/settings/alerts",
                          },
                        ].map((action, i) => (
                          <Grid item xs={6} key={i}>
                            <Button
                              variant="outlined"
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                p: 3,
                                textAlign: "left",
                                textTransform: "none",
                                justifyContent: "flex-start",
                              }}
                              fullWidth
                              onClick={() => router.push(action.href)}
                            >
                              <Avatar sx={{ mb: 1, bgcolor: theme.palette.grey[200] }}>{action.icon}</Avatar>
                              <Typography variant="body2" fontWeight="medium">
                                {action.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {action.description}
                              </Typography>
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Job Recommendations */}
                <Grid item xs={12}>
                  <Card elevation={1}>
                    <CardHeader
                      sx={{ pb: 1 }}
                      title={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <WorkIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6">Job Recommendations</Typography>
                        </Box>
                      }
                      subheader="Jobs matching your profile and preferences"
                    />
                    <CardContent sx={{ p: 3 }}>
                      <List>
                        {jobs.length > 0 ? (
                          jobs.slice(0, 2).map((job) => (
                            <Paper key={job._id} elevation={0} variant="outlined" sx={{ p: 3, mb: 2 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight="medium">
                                    {job.jobTitle}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    <BusinessIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                                    {job.department?.name || "Unspecified Department"}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={`${job.matchPercentage || "90"}% Match`}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                />
                              </Box>
                              <Grid container spacing={1} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="text.secondary">
                                    <LocationOnIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                                    {job.branch?.name || "Remote"}{" "}
                                    {job.employmentType?.name ? `(${job.employmentType.name})` : ""}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="text.secondary">
                                    <MonetizationOnIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                                    {job.salaryRange || "Competitive salary"}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Box
                                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  Posted {new Date(job.createdAt).toLocaleDateString()}
                                </Typography>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => router.push(`/Careers/jobDescription?id=${job._id}`)}
                                >
                                  Apply Now
                                </Button>
                              </Box>
                            </Paper>
                          ))
                        ) : (
                          <Box sx={{ p: 4, textAlign: "center" }}>
                            <Typography variant="body1" color="text.secondary">
                              No job recommendations available.
                            </Typography>
                            <Button variant="outlined" onClick={getAllJobs} startIcon={<RefreshIcon />} sx={{ mt: 2 }}>
                              Refresh
                            </Button>
                          </Box>
                        )}
                      </List>
                    </CardContent>
                    <Box sx={{ px: 3, pb: 3, pt: 1, display: "flex", justifyContent: "center" }}>
                      <Button endIcon={<ArrowForwardIcon />} onClick={() => router.push("/Careers")}>
                        View all job listings
                      </Button>
                    </Box>
                  </Card>
                </Grid>

                {/* Recent Activities */}
                <Grid item xs={12}>
                  <Card elevation={1}>
                    <CardHeader
                      sx={{ pb: 1 }}
                      title={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <NotificationsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6">Recent Activities</Typography>
                        </Box>
                      }
                      subheader="Latest updates on your applications"
                    />
                    <CardContent sx={{ p: 3 }}>
                      <List sx={{ maxHeight: "400px", overflow: "auto" }}>
                        {[
                          {
                            id: 1,
                            action: "Application viewed",
                            details: "Your Frontend Developer application was viewed by the hiring manager",
                            time: "2 hours ago",
                            icon: <VisibilityIcon />,
                          },
                          {
                            id: 2,
                            action: "Interview scheduled",
                            details: "Interview for UX Designer position scheduled for May 22",
                            time: "Yesterday",
                            icon: <EventAvailableIcon />,
                          },
                          {
                            id: 3,
                            action: "Application submitted",
                            details: "You applied for Senior Frontend Developer position",
                            time: "3 days ago",
                            icon: <AssignmentIcon />,
                          },
                        ].map((activity) => (
                          <ListItem key={activity.id} alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: theme.palette.grey[200] }}>{activity.icon}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={activity.action}
                              secondary={
                                <React.Fragment>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    {activity.details}
                                  </Typography>
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    {activity.time}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <Box sx={{ px: 3, pb: 3, pt: 1, display: "flex", justifyContent: "center" }}>
                      <Button endIcon={<ArrowForwardIcon />} onClick={() => router.push("/activities")}>
                        View all activities
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ mt: 10, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No dashboard data available. Please try again later.
          </Typography>
          <Button variant="outlined" onClick={fetchDashboardData} startIcon={<RefreshIcon />} sx={{ mt: 2 }}>
            Refresh
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default WelcomePage
