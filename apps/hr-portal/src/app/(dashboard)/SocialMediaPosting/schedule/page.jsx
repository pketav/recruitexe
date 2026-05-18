"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Skeleton,
  Alert,
  AlertTitle,
  Grid,
  Divider,
  Paper,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  Tooltip,
  Fade,
  CircularProgress,
  InputAdornment,
} from "@mui/material"
import {
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Visibility as PreviewIcon,
  Search as SearchIcon,
  LinkedIn,
  AccessTime,
  CheckCircle,
  Cancel,
  Pending,
  Business,
  Clear,
  Update as UpdateIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { formatDistanceToNow, format } from "date-fns"
import { useApi } from "@core/hooks/useApi"

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["transform", "box-shadow", "border-color"]),
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.light,
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
    },
  },
}))

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1, 2),
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.875rem",
  minHeight: 36,
  transition: theme.transitions.create(["transform", "box-shadow"]),
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[4],
  },
}))

const ImagePreview = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  position: "relative",
  maxWidth: 200,
  cursor: "pointer",
  transition: theme.transitions.create(["transform", "box-shadow"]),
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[8],
  },
}))

const CustomChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  fontWeight: 500,
  fontSize: "0.75rem",
}))

// Helper function to get status styles
const getStatusStyles = (status, theme) => {
  switch (status) {
    case "scheduled":
      return {
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.dark,
      }
    case "posted":
      return {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.dark,
      }
    case "cancelled":
      return {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.grey[700],
      }
    default:
      return {
        backgroundColor: theme.palette.grey[200],
        color: theme.palette.grey[600],
      }
  }
}

export function ScheduledPosts() {
  // State Management
  const [scheduledPosts, setScheduledPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isClient, setIsClient] = useState(false) // Fix hydration

  // Preview Dialog States
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [previewPost, setPreviewPost] = useState(null)

  // Delete Confirmation Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [isDeletingPost, setIsDeletingPost] = useState(false)

  // Reschedule Dialog States
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [postToReschedule, setPostToReschedule] = useState(null)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [newScheduleDate, setNewScheduleDate] = useState("")
  const [newScheduleTime, setNewScheduleTime] = useState("")
  const [rescheduleError, setRescheduleError] = useState("")

  // Use the consistent API hook
  const { callApi, loading } = useApi()

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Format date and time to ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
   */
  const formatScheduleTime = (date, time) => {
    if (!date || !time) return null

    try {
      // Create a Date object from the date and time
      const dateTimeString = `${date}T${time}:00`
      const dateObj = new Date(dateTimeString)

      // Convert to ISO string format (UTC)
      return dateObj.toISOString()
    } catch (error) {
      console.error("Error formatting schedule time:", error)
      return null
    }
  }

  /**
   * Extract date and time from ISO string for form inputs
   */
  const extractDateTimeFromISO = (isoString) => {
    if (!isoString) return { date: "", time: "" }

    try {
      const dateObj = new Date(isoString)
      const date = dateObj.toISOString().split("T")[0]
      const time = dateObj.toTimeString().slice(0, 5) // HH:MM format
      return { date, time }
    } catch (error) {
      console.error("Error extracting date/time from ISO:", error)
      return { date: "", time: "" }
    }
  }

  /**
   * Safe date formatting to prevent hydration issues
   */
  const safeFormatDate = (dateString, formatString = "PPP 'at' p") => {
    if (!isClient || !dateString) return "Loading..."

    try {
      return format(new Date(dateString), formatString)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  /**
   * Safe relative time formatting to prevent hydration issues
   */
  const safeFormatDistanceToNow = (dateString) => {
    if (!isClient || !dateString) return "Loading..."

    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      console.error("Error formatting relative time:", error)
      return "Unknown time"
    }
  }

  /**
   * Safe overdue check to prevent hydration issues
   */

  // Fetch Scheduled Posts
  const fetchScheduledPosts = async () => {
    setIsLoadingPosts(true)
    setError(null)

    try {
      const result = await callApi({
        endpoint: "/v1/api/linkedin/scheduled-posts",
        method: "GET",
        disableSnackbar: true,
      })

      if (result.data.status && Array.isArray(result.data.items)) {
        const mappedPosts = result.data.items.map((post) => ({
          id: post._id,
          orgId: post.orgId?._id || post.orgId,
          organizationId: post.organizationId,
          message: post.message || "",
          imageUrls: post.imageUrls || [],
          imageFiles: post.imageFiles || [],
          scheduleTime: post.scheduleTime,
          status: post.status || "scheduled",
          linkedinPostId: post.linkedinPostId,
          jobName: post.jobName || "",
          error: post.error,
          postedAt: post.postedAt,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          // Computed fields will be calculated in render to avoid hydration issues
          wordCount: post.message ? post.message.split(" ").length : 0,
          characterCount: post.message ? post.message.length : 0,
        }))

        setScheduledPosts(mappedPosts)
        setFilteredPosts(mappedPosts)
      } else {
        throw new Error("Invalid scheduled posts response format.")
      }
    } catch (err) {
      console.error("Error fetching scheduled posts:", err)
      setError(err.message || "Failed to load scheduled posts. Please try again later.")
      setScheduledPosts([])
      setFilteredPosts([])
    } finally {
      setIsLoadingPosts(false)
    }
  }

  // Search and Filter
  useEffect(() => {
    let filtered = scheduledPosts

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.jobName && post.jobName.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter)
    }

    setFilteredPosts(filtered)
  }, [searchQuery, statusFilter, scheduledPosts])

  // ==================== PREVIEW HANDLERS ====================

  const handlePreviewClick = (post) => {
    setPreviewPost(post)
    setPreviewDialogOpen(true)
  }

  const handlePreviewDialogClose = () => {
    setPreviewDialogOpen(false)
    setPreviewPost(null)
  }

  // ==================== DELETE HANDLERS ====================

  const handleDeleteClick = (post) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setPostToDelete(null)
    setIsDeletingPost(false)
  }

  const handleConfirmDelete = async () => {
    if (!postToDelete) return

    setIsDeletingPost(true)
    try {
      const result = await callApi({
        endpoint: `/v1/api/linkedin/scheduled-posts/${postToDelete.id}`,
        method: "DELETE",
      })

      if (result.data.status) {
        // Update local state by removing the deleted post
        const updatedPosts = scheduledPosts.filter((p) => p.id !== postToDelete.id)
        setScheduledPosts(updatedPosts)
        handleDeleteDialogClose()
      } else {
        setError("Failed to delete scheduled post. Please try again.")
      }
    } catch (err) {
      console.error("Failed to delete scheduled post:", err)
      setError("Failed to delete scheduled post. Please try again.")
    } finally {
      setIsDeletingPost(false)
    }
  }

  // ==================== RESCHEDULE HANDLERS ====================

  const handleRescheduleClick = (post) => {
    setPostToReschedule(post)

    // Pre-populate the form with current schedule time
    const { date, time } = extractDateTimeFromISO(post.scheduleTime)
    setNewScheduleDate(date)
    setNewScheduleTime(time)
    setRescheduleError("")
    setRescheduleDialogOpen(true)
  }

  const handleRescheduleDialogClose = () => {
    setRescheduleDialogOpen(false)
    setPostToReschedule(null)
    setNewScheduleDate("")
    setNewScheduleTime("")
    setRescheduleError("")
    setIsRescheduling(false)
  }

  const validateRescheduleForm = () => {
    if (!newScheduleDate || !newScheduleTime) {
      setRescheduleError("Please select both date and time")
      return false
    }

    const newDateTime = new Date(`${newScheduleDate}T${newScheduleTime}:00`)
    const now = new Date()

    if (newDateTime <= now) {
      setRescheduleError("Schedule time must be in the future")
      return false
    }

    setRescheduleError("")
    return true
  }

  const handleConfirmReschedule = async () => {
    if (!postToReschedule || !validateRescheduleForm()) return

    setIsRescheduling(true)
    try {
      const newScheduleTimeISO = formatScheduleTime(newScheduleDate, newScheduleTime)

      if (!newScheduleTimeISO) {
        setRescheduleError("Invalid date/time format")
        return
      }

      const result = await callApi({
        endpoint: `/v1/api/linkedin/reschedule/${postToReschedule.id}`,
        method: "PUT",
        data: {
          newScheduleTime: newScheduleTimeISO,
        },
      })

      if (result.data.status) {
        // Update local state with new schedule time
        const updatedPosts = scheduledPosts.map((post) =>
          post.id === postToReschedule.id
            ? {
                ...post,
                scheduleTime: newScheduleTimeISO,
                updatedAt: new Date().toISOString(),
              }
            : post,
        )
        setScheduledPosts(updatedPosts)
        handleRescheduleDialogClose()
      } else {
        setRescheduleError("Failed to reschedule post. Please try again.")
      }
    } catch (err) {
      console.error("Failed to reschedule post:", err)
      setRescheduleError("Failed to reschedule post. Please try again.")
    } finally {
      setIsRescheduling(false)
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const getTimeAgo = (dateString) => {
    return safeFormatDistanceToNow(dateString)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return <Pending fontSize="small" />
      case "posted":
        return <CheckCircle fontSize="small" />
      case "cancelled":
        return <Cancel fontSize="small" />
      default:
        return <Pending fontSize="small" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "warning"
      case "posted":
        return "success"
      case "cancelled":
        return "default"
      default:
        return "default"
    }
  }

  // Get statistics
  const getStats = () => {
    const total = scheduledPosts.length
    const scheduled = scheduledPosts.filter((p) => p.status === "scheduled").length
    const posted = scheduledPosts.filter((p) => p.status === "posted").length

    return { total, scheduled, posted }
  }

  // Initial Load
  useEffect(() => {
    fetchScheduledPosts()
  }, [])

  const stats = getStats()
  const today = new Date().toISOString().split("T")[0]

  // Loading State
  if (isLoadingPosts) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={24} sx={{ mt: 1 }} />
        </Box>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ borderRadius: 3 }}>
                <CardHeader
                  title={<Skeleton variant="text" width="80%" />}
                  subheader={<Skeleton variant="text" width="60%" />}
                  action={<Skeleton variant="rectangular" width={60} height={24} />}
                />
                <CardContent>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2, borderRadius: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  }

  // Error State
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <AlertTitle>Error Loading Scheduled Posts</AlertTitle>
          {error}
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchScheduledPosts}>
              Try Again
            </Button>
          </Box>
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
    

        {/* Search and Filter Bar */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              placeholder="Search posts by content or job name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery("")}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
      
        </Grid>

     
      </Box>

      {/* Empty State */}
      {filteredPosts.length === 0 && !isLoadingPosts && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 4,
            bgcolor: "grey.50",
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <ScheduleIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" fontWeight="600" gutterBottom>
            {searchQuery || statusFilter !== "all" ? "No posts found" : "No scheduled posts yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search terms or filters"
              : "Schedule your first post to get started"}
          </Typography>
          {(searchQuery || statusFilter !== "all") && (
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
              <Button variant="outlined" onClick={() => setStatusFilter("all")}>
                Clear Filters
              </Button>
            </Stack>
          )}
        </Box>
      )}

      {/* Posts Grid */}
      <Grid container spacing={3}>
        {filteredPosts.map((post) => {
          // Calculate dynamic values safely for each post

          const timeUntilPost = safeFormatDistanceToNow(post.scheduleTime)
          const formattedScheduleTime = safeFormatDate(post.scheduleTime)

          return (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <Fade in timeout={300}>
                <StyledCard>
                  <CardHeader
                    title={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LinkedIn color="primary" fontSize="small" />
                        <Typography variant="h6" component="h3" fontWeight="600" noWrap sx={{ flex: 1 }}>
                          LinkedIn Post
                        </Typography>
                      </Stack>
                    }
                    subheader={
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {formattedScheduleTime}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTime sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {timeUntilPost}
                          </Typography>
                        </Stack>
                      </Stack>
                    }
                    action={
                      <CustomChip
                        icon={getStatusIcon(post?.status)}
                        label={post.status.charAt(0).toUpperCase() + post?.status.slice(1)}
                        size="small"
                        sx={(theme) => ({
                          ...getStatusStyles(post?.status, theme),
                          borderRadius: theme.spacing(1.5),
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          "& .MuiChip-icon": {
                            color: getStatusStyles(post?.status, theme).color,
                          },
                        })}
                      />
                    }
                  />

                  <CardContent sx={{ pt: 0 }}>
                    {/* Content Preview */}
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        mb: 2,
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 80,
                      }}
                    >
                      {truncateText(post.message)}
                    </Typography>

                    {/* Image Preview */}
                    {post.imageUrls && post.imageUrls.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <ImagePreview onClick={() => handlePreviewClick(post)}>
                          <img
                            src={post.imageUrls[0] || "/placeholder.svg"}
                            alt="Post preview"
                            style={{
                              width: "100%",
                              height: 120,
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              bgcolor: "rgba(0,0,0,0.6)",
                              color: "white",
                              borderRadius: 1,
                              p: 0.5,
                            }}
                          >
                            <PreviewIcon fontSize="small" />
                          </Box>
                          {post.imageUrls.length > 1 && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 8,
                                left: 8,
                                bgcolor: "rgba(0,0,0,0.6)",
                                color: "white",
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                              }}
                            >
                              <Typography variant="caption">+{post.imageUrls.length - 1} more</Typography>
                            </Box>
                          )}
                        </ImagePreview>
                      </Box>
                    )}

                

                    {/* Error Message */}
                    {post.error && (
                      <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        <Typography variant="caption">{post.error}</Typography>
                      </Alert>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Stats and Actions */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {post.characterCount} chars
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.wordCount} words
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Preview">
                          <IconButton size="small" onClick={() => handlePreviewClick(post)}>
                            <PreviewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {post?.status === "scheduled" && (
                          <>
                            <Tooltip title="Reschedule">
                              <IconButton size="small" color="primary" onClick={() => handleRescheduleClick(post)}>
                                <UpdateIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => handleDeleteClick(post)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </Stack>

                    {/* Posted Information */}
                    {post.postedAt && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "grey.200" }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle fontSize="small" color="success" />
                          <Typography variant="caption" color="success.dark">
                            Posted {getTimeAgo(post.postedAt)}
                          </Typography>
                          {post.linkedinPostId && (
                            <CustomChip label="View on LinkedIn" size="small" color="primary" variant="outlined" />
                          )}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </StyledCard>
              </Fade>
            </Grid>
          )
        })}
      </Grid>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onClose={handlePreviewDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Scheduled Post Preview
          </Typography>
        </DialogTitle>
        <DialogContent>
          {previewPost && (
            <Box sx={{ mt: 1 }}>
              <Stack spacing={2}>
                {/* Schedule Information */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "primary.50",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "primary.200",
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ScheduleIcon color="primary" fontSize="small" />
                      <Typography variant="body2" fontWeight="600">
                        {safeFormatDate(previewPost?.scheduleTime)}
                      </Typography>
                      <CustomChip
                        icon={getStatusIcon(previewPost?.status)}
                        label={previewPost.status.charAt(0).toUpperCase() + previewPost?.status.slice(1)}
                        size="small"
                        sx={(theme) => ({
                          ...getStatusStyles(previewPost?.status, theme),
                          borderRadius: theme.spacing(1.5),
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          "& .MuiChip-icon": {
                            color: getStatusStyles(previewPost?.status, theme).color,
                          },
                        })}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {safeFormatDistanceToNow(previewPost.scheduleTime)}
                    </Typography>
                  </Stack>
                </Box>

                {/* Post Content */}
                <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {previewPost.message}
                </Typography>

                {/* Images */}
                {previewPost.imageUrls && previewPost.imageUrls.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      Images ({previewPost.imageUrls.length})
                    </Typography>
                    <Grid container spacing={1}>
                      {previewPost.imageUrls.map((imageUrl, index) => (
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
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Job Information */}
                {/* {previewPost.jobName && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "grey.50",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Business fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight="600">
                        Job: {previewPost.jobName}
                      </Typography>
                    </Stack>
                  </Box>
                )} */}

                {/* Error Information */}
                {previewPost.error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">{previewPost.error}</Typography>
                  </Alert>
                )}

                <Divider />

                {/* Metadata */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    {previewPost.characterCount} characters
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {previewPost.wordCount} words
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created {getTimeAgo(previewPost.createdAt)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewDialogClose}>Close</Button>
          {previewPost && previewPost?.status === "scheduled" && (
            <ActionButton
              variant="contained"
              startIcon={<UpdateIcon />}
              onClick={() => {
                handlePreviewDialogClose()
                handleRescheduleClick(previewPost)
              }}
            >
              Reschedule
            </ActionButton>
          )}
        </DialogActions>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={rescheduleDialogOpen}
        onClose={handleRescheduleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "primary.50",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UpdateIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600" color="primary.main">
                Reschedule Post
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a new date and time for this post
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          {postToReschedule && (
            <Box>
              {/* Current Schedule Info */}
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  Current Schedule
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {safeFormatDate(postToReschedule.scheduleTime)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {safeFormatDistanceToNow(postToReschedule.scheduleTime)}
                </Typography>
              </Box>

              {/* New Schedule Form */}
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                New Schedule
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <StyledTextField
                    type="date"
                    label="Date"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={newScheduleDate}
                    onChange={(e) => setNewScheduleDate(e.target.value)}
                    inputProps={{ min: today }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <CalendarIcon sx={{ mr: 1, color: "action.active" }} fontSize="small" />,
                    }}
                    sx={{ mb: 0 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StyledTextField
                    type="time"
                    label="Time"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={newScheduleTime}
                    onChange={(e) => setNewScheduleTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <AccessTime sx={{ mr: 1, color: "action.active" }} fontSize="small" />,
                    }}
                    sx={{ mb: 0 }}
                  />
                </Grid>
              </Grid>

              {/* Preview New Schedule */}
              {newScheduleDate && newScheduleTime && isClient && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "success.50",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "success.200",
                    mb: 2,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle fontSize="small" color="success" />
                    <Typography variant="body2" fontWeight="600" color="success.dark">
                      New Schedule: {format(new Date(`${newScheduleDate}T${newScheduleTime}:00`), "PPP 'at' p")}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="success.main">
                    {formatDistanceToNow(new Date(`${newScheduleDate}T${newScheduleTime}:00`), { addSuffix: true })}
                  </Typography>
                </Box>
              )}

              {/* Error Display */}
              {rescheduleError && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  <Typography variant="body2">{rescheduleError}</Typography>
                </Alert>
              )}

              {/* Post Preview */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  Post Content
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {postToReschedule.message || "No content"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleRescheduleDialogClose}
            disabled={isRescheduling}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <ActionButton
            onClick={handleConfirmReschedule}
            variant="contained"
            disabled={isRescheduling || !newScheduleDate || !newScheduleTime}
            startIcon={isRescheduling ? <CircularProgress size={18} /> : <UpdateIcon />}
            sx={{
              background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              color: "white",
            }}
          >
            {isRescheduling ? "Rescheduling..." : "Reschedule Post"}
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "error.50",
                color: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WarningIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600" color="error.main">
                Delete Scheduled Post
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          {postToDelete && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to delete this scheduled post?
              </Typography>

              <Box
                sx={{
                  p: 3,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  Scheduled for: {safeFormatDate(postToDelete.scheduleTime)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {postToDelete.message || "No content"}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {safeFormatDistanceToNow(postToDelete.scheduleTime)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {postToDelete.characterCount} characters
                  </Typography>
                </Stack>
              </Box>

              <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Warning:</strong> This scheduled post will be permanently deleted and will not be posted to
                  LinkedIn.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleDeleteDialogClose}
            disabled={isDeletingPost}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <ActionButton
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isDeletingPost}
            startIcon={isDeletingPost ? <CircularProgress size={18} /> : <DeleteIcon />}
            sx={{
              bgcolor: "error.main",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            {isDeletingPost ? "Deleting..." : "Delete Post"}
          </ActionButton>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
