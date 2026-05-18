"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Container,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Snackbar,
  AlertTitle,
} from "@mui/material"
import {
  AutoAwesome,
  Schedule,
  CheckCircle,
  Cancel,
  LinkedIn,
  Search as SearchIcon,
  Visibility,
  Delete,
  CalendarToday,
  Refresh,
  Close,
  Warning,
  Error as ErrorIcon,
  WifiOff,
  Settings,
} from "@mui/icons-material"
import DraftsIcon from "@mui/icons-material/Drafts"
import { styled } from "@mui/material/styles"
import { format, formatDistanceToNow } from "date-fns"
import { useApi } from "@core/hooks/useApi"

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
  padding: theme.spacing(3),
}))

const StatsCard = styled(Card)(({ theme, bgcolor }) => ({
  borderRadius: theme.spacing(2),
  border: "none",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  backgroundColor: bgcolor || theme.palette.background.paper,
  transition: theme.transitions.create(["transform", "box-shadow"]),
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
}))

const PostCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: "none",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create(["transform", "box-shadow"]),
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },
  position: "relative",
  minHeight: 320,
  display: "flex",
  flexDirection: "column",
}))

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "posted":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
          "& .MuiChip-icon": { color: "#166534" },
        }
      case "scheduled":
        return {
          backgroundColor: "#fef3c7",
          color: "#92400e",
          "& .MuiChip-icon": { color: "#92400e" },
        }
      case "cancelled":
        return {
          backgroundColor: "#f3f4f6",
          color: "#6b7280",
          "& .MuiChip-icon": { color: "#6b7280" },
        }
      case "draft":
        return {
          backgroundColor: "#dbeafe",
          color: "#1d4ed8",
          "& .MuiChip-icon": { color: "#1d4ed8" },
        }
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#6b7280",
          "& .MuiChip-icon": { color: "#6b7280" },
        }
    }
  }

  return {
    ...getStatusStyles(status),
    fontWeight: 600,
    fontSize: "0.75rem",
    border: "none",
  }
})

const ActionButtonsContainer = styled(Box)({
  position: "absolute",
  top: 16,
  right: 16,
  display: "flex",
  gap: 8,
})

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
)

// Error Types
const ERROR_TYPES = {
  NETWORK: "network",
  LINKEDIN_NOT_CONNECTED: "linkedin_not_connected",
  PERMISSION_DENIED: "permission_denied",
  SERVER_ERROR: "server_error",
  NOT_FOUND: "not_found",
  RATE_LIMIT: "rate_limit",
  UNKNOWN: "unknown",
}

const dashboard = () => {
  // State Management
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [error, setError] = useState(null)
  const [errorType, setErrorType] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [retryCount, setRetryCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [isDeletingPost, setIsDeletingPost] = useState(false)

  // Notification states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  // Use the consistent API hook
  const { callApi, loading } = useApi()

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Enhanced error classification
  const classifyError = (error, response) => {
    if (!isOnline) {
      return ERROR_TYPES.NETWORK
    }

    if (response?.status === 401 || response?.status === 403) {
      return ERROR_TYPES.PERMISSION_DENIED
    }

    if (response?.status === 404) {
      return ERROR_TYPES.NOT_FOUND
    }

    if (response?.status === 429) {
      return ERROR_TYPES.RATE_LIMIT
    }

    if (response?.status >= 500) {
      return ERROR_TYPES.SERVER_ERROR
    }

    // Check for LinkedIn-specific errors
    if (
      error?.message?.toLowerCase().includes("linkedin") ||
      error?.message?.toLowerCase().includes("not connected") ||
      response?.data?.message?.toLowerCase().includes("linkedin not connected")
    ) {
      return ERROR_TYPES.LINKEDIN_NOT_CONNECTED
    }

    if (error?.name === "TypeError" && error?.message?.includes("fetch")) {
      return ERROR_TYPES.NETWORK
    }

    return ERROR_TYPES.UNKNOWN
  }

  // Enhanced error message generation
  const getErrorMessage = (errorType, originalError) => {
    switch (errorType) {
      case ERROR_TYPES.NETWORK:
        return {
          title: "Connection Problem",
          message: isOnline
            ? "Unable to connect to the server. Please check your internet connection and try again."
            : "You appear to be offline. Please check your internet connection.",
          action: "Retry",
          severity: "warning",
        }
      case ERROR_TYPES.LINKEDIN_NOT_CONNECTED:
        return {
          title: "LinkedIn Not Connected",
          message:
            "Your LinkedIn account is not connected to this organization. Please contact your administrator to set up LinkedIn integration.",
          action: "Setup LinkedIn",
          severity: "warning",
        }
      case ERROR_TYPES.PERMISSION_DENIED:
        return {
          title: "Access Denied",
          message: "You don't have permission to access this resource. Please contact your administrator.",
          action: "Contact Support",
          severity: "error",
        }
      case ERROR_TYPES.SERVER_ERROR:
        return {
          title: "Server Error",
          message: "Our servers are experiencing issues. Please try again in a few minutes.",
          action: "Retry",
          severity: "error",
        }
      case ERROR_TYPES.NOT_FOUND:
        return {
          title: "Resource Not Found",
          message: "The requested data could not be found. It may have been moved or deleted.",
          action: "Refresh",
          severity: "info",
        }
      case ERROR_TYPES.RATE_LIMIT:
        return {
          title: "Too Many Requests",
          message: "You've made too many requests. Please wait a moment before trying again.",
          action: "Wait & Retry",
          severity: "warning",
        }
      default:
        return {
          title: "Something Went Wrong",
          message: originalError?.message || "An unexpected error occurred. Please try again.",
          action: "Retry",
          severity: "error",
        }
    }
  }

  // Show notification
//   const showNotification = (message, severity = "info") => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     })
//   }

  // Enhanced fetch dashboard data with better error handling
  const fetchDashboardData = async (isRetry = false) => {
    if (isRetry) {
      setRetryCount((prev) => prev + 1)
    } else {
      setRetryCount(0)
    }

    setIsLoadingPosts(true)
    setError(null)
    setErrorType(null)

    try {
      console.log("Fetching dashboard data...")

      const result = await callApi({
        endpoint: `/v1/api/post/AllPost?postStatus=${statusFilter}`,
        method: "GET",
        disableSnackbar: true,
      })

      console.log("API Response:", result.data)

      if (result.data?.status && result.data?.items) {
        setDashboardData(result.data)
        setError(null)
        setErrorType(null)
        if (isRetry) {
          showNotification("Dashboard data loaded successfully!", "success")
        }
      } else {
        throw new Error(result.data?.message || "Invalid API response format")
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      const type = classifyError(err, err.response)
      setErrorType(type)
      setError(err)
      setDashboardData(null)

      // Don't show snackbar for initial load, but show for retries
      if (isRetry) {
        const errorInfo = getErrorMessage(type, err)
        showNotification(`Failed to load data: ${errorInfo.message}`, errorInfo.severity)
      }
    } finally {
      setIsLoadingPosts(false)
    }
  }

  // Enhanced delete post with better error handling
  const deletePost = async (post) => {
    if (!post || !post.orgIds?.[0]) {
      showNotification("Invalid post data. Cannot delete.", "error")
      return
    }

    const Payload = {
      orgId: post.orgIds[0].orgId,
    }

    setIsDeletingPost(true)
    try {
      const ID = post.linkedinPostId?.split("urn:li:share:")?.[1]
      if (!ID) {
        throw new Error("Invalid LinkedIn post ID")
      }

      const result = await callApi({
        endpoint: `/v1/api/linkedin/posts/${ID}`,
        method: "DELETE",
        data: Payload,
      })

      console.log("Delete response:", result.data)

      if (result.data?.status) {
        // Update local state by removing the deleted post
        setDashboardData((prevData) => ({
          ...prevData,
          items: {
            scheduledPosts: prevData.items.scheduledPosts.filter((p) => p._id !== post._id),
            postedContents: prevData.items.postedContents.filter((p) => p._id !== post._id),
          },
        }))

        setDeleteDialogOpen(false)
        setPostToDelete(null)
        showNotification("Post deleted successfully from LinkedIn!", "success")
      } else {
        throw new Error(result.data?.message || "Failed to delete post")
      }
    } catch (err) {
      console.error("Failed to delete post:", err)
      const type = classifyError(err, err.response)
      const errorInfo = getErrorMessage(type, err)
      showNotification(`Delete failed: ${errorInfo.message}`, errorInfo.severity)
    } finally {
      setIsDeletingPost(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [statusFilter])

  // Calculate statistics
  const getStatistics = () => {
    if (!dashboardData) return {}

    const allPosts = [...dashboardData.items.scheduledPosts, ...dashboardData.items.postedContents]

    const stats = {
      total: allPosts.length,
      posted: allPosts.filter((p) => p.status === "posted").length,
      scheduled: allPosts.filter((p) => p.status === "scheduled").length,
      cancelled: allPosts.filter((p) => p.status === "cancelled").length,
      draft: allPosts.filter((p) => p.status === "draft").length,
      TotalJob: dashboardData.items.counts?.totals?.job || 0,
      TotalOther: dashboardData.items.counts?.totals?.other || 0,
    }
    return stats
  }

  // Filter posts
  const getFilteredPosts = (posts) => {
    let filtered = posts
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.position && post.position.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter)
    }
    return filtered
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "posted":
        return <CheckCircle fontSize="small" />
      case "scheduled":
        return <Schedule fontSize="small" />
      case "cancelled":
        return <Cancel fontSize="small" />
      case "draft":
        return <DraftsIcon fontSize="small" />
      default:
        return <Schedule fontSize="small" />
    }
  }

  // Action handlers
  const handleView = (post) => {
    setSelectedPost(post)
    setViewDialogOpen(true)
  }

  const handleEdit = (post) => {
    console.log("Edit post:", post._id)
    // Add edit functionality here
  }

  const handleDelete = (post) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!postToDelete) return
    console.log("postToDelete==>", postToDelete)
    await deletePost(postToDelete)
  }

  const handleShare = (post) => {
    if (post.linkedinPostId) {
      const linkedinUrl = `https://www.linkedin.com/feed/update/${post.linkedinPostId}/`
      window.open(linkedinUrl, "_blank")
    }
  }

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Enhanced error action handler
  const handleErrorAction = () => {
    switch (errorType) {
      case ERROR_TYPES.LINKEDIN_NOT_CONNECTED:
        // Redirect to LinkedIn setup page
        window.location.href = "/employeeSetup/Linkedin"
        break
      case ERROR_TYPES.PERMISSION_DENIED:
        // Redirect to contact support or admin
        showNotification("Please contact your administrator for access.", "info")
        break
      case ERROR_TYPES.RATE_LIMIT:
        // Wait and retry after delay
        setTimeout(() => {
          fetchDashboardData(true)
        }, 5000)
        showNotification("Retrying in 5 seconds...", "info")
        break
      default:
        // Default retry action
        fetchDashboardData(true)
        break
    }
  }

  // Loading State
  if (isLoadingPosts && !dashboardData) {
    return (
      <DashboardContainer>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={48} />
              <Typography variant="h6" color="text.secondary">
                Loading dashboard data...
              </Typography>
              {!isOnline && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WifiOff fontSize="small" />
                    <Typography variant="body2">You appear to be offline</Typography>
                  </Stack>
                </Alert>
              )}
            </Stack>
          </Box>
        </Container>
      </DashboardContainer>
    )
  }

  // Enhanced Error State
  if (error && !dashboardData) {
    const errorInfo = getErrorMessage(errorType, error)

    return (
      <DashboardContainer>
        <Container maxWidth="xl">
          {/* Network Status Indicator */}
          {!isOnline && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <WifiOff />
                <Box>
                  <AlertTitle>No Internet Connection</AlertTitle>
                  <Typography variant="body2">Please check your internet connection and try again.</Typography>
                </Box>
              </Stack>
            </Alert>
          )}

          <Alert severity={errorInfo.severity} sx={{ borderRadius: 2 }}>
            <Stack spacing={2}>
              <Box>
                <AlertTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {errorInfo.severity === "error" && <ErrorIcon />}
                  {errorInfo.severity === "warning" && <Warning />}
                  {errorInfo.title}
                </AlertTitle>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {errorInfo.message}
                </Typography>
                {retryCount > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Retry attempt: {retryCount}
                  </Typography>
                )}
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={handleErrorAction}
                  startIcon={errorType === ERROR_TYPES.LINKEDIN_NOT_CONNECTED ? <Settings /> : <Refresh />}
                  disabled={loading}
                >
                  {loading ? "Loading..." : errorInfo.action}
                </Button>

                {errorType === ERROR_TYPES.LINKEDIN_NOT_CONNECTED && (
                  <Button variant="text" onClick={() => fetchDashboardData(true)} disabled={loading}>
                    Try Anyway
                  </Button>
                )}
              </Stack>
            </Stack>
          </Alert>

          {/* Show partial data if available */}
          {dashboardData && (
            <Box sx={{ mt: 3, opacity: 0.7 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing cached data (may be outdated):
              </Typography>
              {/* Render dashboard with cached data */}
            </Box>
          )}
        </Container>
      </DashboardContainer>
    )
  }

  // No Data State
  if (!dashboardData) {
    return (
      <DashboardContainer>
        <Container maxWidth="xl">
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "white",
              borderRadius: 2,
              border: "2px dashed #e2e8f0",
            }}
          >
            <LinkedIn sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
            <Typography variant="h6" fontWeight="600" gutterBottom color="#64748b">
              No data available
            </Typography>
            <Typography variant="body2" color="#94a3b8" sx={{ mb: 3 }}>
              Unable to load dashboard data
            </Typography>
            <Button variant="outlined" onClick={() => fetchDashboardData(true)} startIcon={<Refresh />}>
              Retry
            </Button>
          </Box>
        </Container>
      </DashboardContainer>
    )
  }

  const stats = getStatistics()
  const allPosts = [...dashboardData.items.scheduledPosts, ...dashboardData.items.postedContents]
  const filteredPosts = getFilteredPosts(allPosts)

  return (
    <DashboardContainer>
      <Container maxWidth="xl">
        {/* Network Status Warning */}
        {!isOnline && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <WifiOff />
              <Typography variant="body2">
                You're offline. Data may be outdated. Connection will resume automatically.
              </Typography>
            </Stack>
          </Alert>
        )}

        {/* LinkedIn Connection Warning */}
        {errorType === ERROR_TYPES.LINKEDIN_NOT_CONNECTED && (
          <Alert
            severity="warning"
            sx={{ mb: 2, borderRadius: 2 }}
            action={
              <Stack direction="row" spacing={1}>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => (window.location.href = "/employeeSetup/Linkedin")}
                  startIcon={<Settings />}
                >
                  Setup
                </Button>
                <IconButton color="inherit" size="small" onClick={() => setErrorType(null)}>
                  <Close fontSize="small" />
                </IconButton>
              </Stack>
            }
          >
            <AlertTitle>LinkedIn not connected for this organization</AlertTitle>
            <Typography variant="body2">
              Some features may not work properly. Please set up LinkedIn integration.
            </Typography>
          </Alert>
        )}

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <AutoAwesome sx={{ fontSize: 32, color: "#6366f1" }} />
            <Typography variant="h4" fontWeight="bold" color="#1e293b">
              LinkedIn Posting Analytics
            </Typography>
            {!isOnline && <WifiOff sx={{ color: "#ef4444" }} />}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="body1" color="#64748b">
              Monitor and track your job posting performance
            </Typography>
            <Chip
              label={isOnline ? "Live Data" : "Offline"}
              size="small"
              sx={{
                backgroundColor: isOnline ? "#dbeafe" : "#fecaca",
                color: isOnline ? "#1d4ed8" : "#dc2626",
                fontWeight: 600,
              }}
            />
          </Stack>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <StatsCard bgcolor="#dbeafe">
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h3" fontWeight="bold" color="#1d4ed8" sx={{ mb: 1 }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="#64748b" fontWeight={500}>
                  Total Posts
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatsCard bgcolor="#dbeafe">
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h3" fontWeight="bold" color="#1d4ed8" sx={{ mb: 1 }}>
                  {stats.TotalJob || 0}
                </Typography>
                <Typography variant="body2" color="#64748b" fontWeight={500}>
                  Total Job Posts
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatsCard bgcolor="#dbeafe">
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h3" fontWeight="bold" color="#1d4ed8" sx={{ mb: 1 }}>
                  {stats.TotalOther || 0}
                </Typography>
                <Typography variant="body2" color="#64748b" fontWeight={500}>
                  Total Other Posts
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <StatsCard bgcolor="#dcfce7">
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h3" fontWeight="bold" color="#166534" sx={{ mb: 1 }}>
                  {stats.posted}
                </Typography>
                <Typography variant="body2" color="#64748b" fontWeight={500}>
                  Posted
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <StatsCard bgcolor="#fef3c7">
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h3" fontWeight="bold" color="#92400e" sx={{ mb: 1 }}>
                  {stats.scheduled}
                </Typography>
                <Typography variant="body2" color="#64748b" fontWeight={500}>
                  Scheduled
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <StatsCard bgcolor="#f3f4f6">
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h3" fontWeight="bold" color="#6b7280" sx={{ mb: 1 }}>
                  {stats.draft}
                </Typography>
                <Typography variant="body2" color="#64748b" fontWeight={500}>
                  Drafts
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        {/* Search and Filter */}
        <Grid container spacing={2} sx={{ mb: 3, display: "flex", justifyContent: "end" }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search posts by content or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                },
              }}
            >
              <option value="all">All Status</option>
              <option value="posted">Posted</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
              <option value="draft">Draft</option>
            </TextField>
          </Grid>
        </Grid>

        {/* All Posts Tab */}
        <TabPanel value={tabValue} index={0}>
          {filteredPosts.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                bgcolor: "white",
                borderRadius: 2,
                border: "2px dashed #e2e8f0",
              }}
            >
              <LinkedIn sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
              <Typography variant="h6" fontWeight="600" gutterBottom color="#64748b">
                No posts found
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search terms or filters"
                  : "No posts available"}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredPosts.map((post) => (
                <Grid item xs={12} md={6} lg={4} key={post._id}>
                  <PostCard>
                    {/* Action Buttons */}
                    <ActionButtonsContainer>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(post)}
                          sx={{
                            backgroundColor: "white",
                            boxShadow: 1,
                            "&:hover": { backgroundColor: "#f8fafc" },
                          }}
                        >
                          <Visibility fontSize="small" sx={{ color: "#64748b" }} />
                        </IconButton>
                      </Tooltip>
                      {post.status == "posted" ? (
                        <Tooltip title="Delete Linkedin Post">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(post)}
                            sx={{
                              backgroundColor: "white",
                              boxShadow: 1,
                              "&:hover": { backgroundColor: "#fef2f2" },
                            }}
                          >
                            <Delete fontSize="small" sx={{ color: "#ef4444" }} />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </ActionButtonsContainer>

                    <CardContent sx={{ p: 3, pr: 7, flex: 1, display: "flex", flexDirection: "column" }}>
                      {/* Header with LinkedIn icon and status */}
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <LinkedIn sx={{ color: "#0077B5", fontSize: 20 }} />
                        <StatusChip
                          icon={getStatusIcon(post.status)}
                          label={post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          size="small"
                          status={post.status}
                        />
                      </Stack>

                      {/* Content */}
                      <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6, color: "#374151", flex: 1 }}>
                        {truncateText(post.message)}
                      </Typography>

                      {/* Position */}
                      {post.position && (
                        <Chip
                          label={post.position}
                          size="small"
                          sx={{
                            backgroundColor: "#f0f9ff",
                            color: "#0369a1",
                            fontWeight: 600,
                            mb: 2,
                            alignSelf: "flex-start",
                          }}
                        />
                      )}

                      {/* Enhanced Image Preview with Placeholder */}
                      {post.imageUrls && post.imageUrls.length > 0 && post.imageUrls[0] ? (
                        <Box sx={{ mb: 2, position: "relative", overflow: "hidden" }}>
                          <img
                            src={post.imageUrls[0] || "/placeholder.svg"}
                            alt="Post preview"
                            style={{
                              width: "100%",
                              height: 140,
                              objectFit: "cover",
                              borderRadius: 8,
                              display: "block",
                            }}
                            onError={(e) => {
                              // Replace broken image with placeholder
                              e.target.src = "/placeholder.svg?height=140&width=300&text=Image+Not+Available"
                              e.target.style.backgroundColor = "#f3f4f6"
                              e.target.style.border = "2px dashed #d1d5db"
                            }}
                          />
                        </Box>
                      ) : (
                        // Show placeholder when no image is available
                        <Box
                          sx={{
                            mb: 2,
                            height: 140,
                            backgroundColor: "#f8fafc",
                            border: "2px dashed #e2e8f0",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <LinkedIn sx={{ fontSize: 32, color: "#cbd5e1", mb: 1 }} />
                          <Typography variant="caption" color="#94a3b8" textAlign="center">
                            No image attached
                          </Typography>
                        </Box>
                      )}

                      {/* Footer - pushed to bottom */}
                      <Box sx={{ mt: "auto" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarToday sx={{ fontSize: 14, color: "#94a3b8" }} />
                            <Typography variant="caption" color="#94a3b8">
                              {post.postedAt
                                ? formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })
                                : post.scheduleTime
                                  ? format(new Date(post.scheduleTime), "MMM dd, yyyy")
                                  : "No date"}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Typography variant="body2" color="#94a3b8">
                          Linkedin Account: {post.linkedinOrganizations?.linkedinName}
                        </Typography>
                      </Box>
                    </CardContent>
                  </PostCard>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Post Details</Typography>
              <IconButton onClick={() => setViewDialogOpen(false)}>
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedPost && (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <LinkedIn sx={{ color: "#0077B5", fontSize: 24 }} />
                  <StatusChip
                    icon={getStatusIcon(selectedPost.status)}
                    label={selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                    size="small"
                    status={selectedPost.status}
                  />
                </Stack>
                <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
                  {selectedPost.message}
                </Typography>
                {selectedPost.position && (
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#4f46e5" }}>
                    Position: {selectedPost.position}
                  </Typography>
                )}
                {selectedPost.imageUrls && selectedPost.imageUrls.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      Images ({selectedPost.imageUrls.length})
                    </Typography>
                    <Grid container spacing={1}>
                      {selectedPost.imageUrls.map(
                        (imageUrl, index) =>
                          imageUrl && (
                            <Grid item xs={6} key={index}>
                              <img
                                src={imageUrl || "/placeholder.svg"}
                                alt={`Post image ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  borderRadius: 8,
                                  maxHeight: 200,
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.style.display = "none"
                                }}
                              />
                            </Grid>
                          ),
                      )}
                    </Grid>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="#94a3b8">
                  Linkedin Account: {selectedPost.linkedinOrganizations?.linkedinName}
                </Typography>
                <Typography variant="body2" color="#94a3b8">
                  {selectedPost.postedAt
                    ? `Posted: ${format(new Date(selectedPost.postedAt), "PPP 'at' p")}`
                    : selectedPost.scheduleTime
                      ? `Scheduled: ${format(new Date(selectedPost.scheduleTime), "PPP 'at' p")}`
                      : "No date available"}
                </Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            {postToDelete && (
              <Box>
                <Typography sx={{ mb: 2 }}>
                  Are you sure you want to delete this post? This Will Delete Post From Linkedin Account
                </Typography>

                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                    Post Details:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {truncateText(postToDelete.message, 100)}
                  </Typography>
                </Box>

                {isDeletingPost && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Deleting post...
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeletingPost}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
              disabled={isDeletingPost}
              startIcon={isDeletingPost ? <CircularProgress size={16} /> : <Delete />}
            >
              {isDeletingPost ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </DashboardContainer>
  )
}

export default dashboard
