"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Stack,
  Tooltip,
  Alert,
  CircularProgress,
  InputAdornment,
  Container,
  Divider,
} from "@mui/material"
import {
  ChevronLeft,
  ChevronRight,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  AccessTime,
  CalendarToday,
  LinkedIn,
  Business,
  Event as EventIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { format, formatDistanceToNow } from "date-fns"
import { useApi } from "@core/hooks/useApi"

// Styled Components
const CalendarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  padding: theme.spacing(3),
}))

const CalendarHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}))

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
}))

const DayHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  fontWeight: 600,
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1),
}))

const CalendarDay = styled(Box)(({ theme, isSelected, hasEvents, isToday }) => ({
  minHeight: 120,
  padding: theme.spacing(1.5),
  cursor: "pointer",
  transition: theme.transitions.create(["background-color", "border-color", "transform", "box-shadow"]),
  border: `2px solid ${
    isSelected ? theme.palette.primary.main : hasEvents ? theme.palette.primary.light : "transparent"
  }`,
  backgroundColor: isToday
    ? theme.palette.primary.light + "10"
    : isSelected
      ? theme.palette.primary.light + "20"
      : theme.palette.background.paper,
  borderRadius: theme.spacing(1.5),
  position: "relative",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  ...(hasEvents && {
    "&::before": {
      content: '""',
      position: "absolute",
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: theme.palette.primary.main,
    },
  }),
}))

const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["transform", "box-shadow"]),
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}))

const SelectedDateSection = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  border: `1px solid ${theme.palette.divider}`,
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
  },
}))

const PostCountChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  bottom: 8,
  left: 8,
  fontSize: "0.7rem",
  height: 20,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
}))

export function CalendarView({ onPostScheduled }) {
  // State Management
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [scheduledPosts, setScheduledPosts] = useState([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [error, setError] = useState(null)

  // Schedule Dialog States
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleError, setScheduleError] = useState("")
  const [newPost, setNewPost] = useState({
    message: "",
    scheduleDate: "",
    scheduleTime: "",
    jobName: "",
  })

  // Delete Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [isDeletingPost, setIsDeletingPost] = useState(false)

  // Use the API hook
  const { callApi, loading } = useApi()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

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
          scheduleTime: post.scheduleTime,
          status: post.status || "scheduled",
          linkedinPostId: post.linkedinPostId,
          jobName: post.jobName || "",
          error: post.error,
          postedAt: post.postedAt,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          wordCount: post.message ? post.message.split(" ").length : 0,
          characterCount: post.message ? post.message.length : 0,
        }))

        setScheduledPosts(mappedPosts)
      } else {
        throw new Error("Invalid scheduled posts response format.")
      }
    } catch (err) {
      console.error("Error fetching scheduled posts:", err)
      setError(err.message || "Failed to load scheduled posts. Please try again later.")
      setScheduledPosts([])
    } finally {
      setIsLoadingPosts(false)
    }
  }

  // Initial Load
  useEffect(() => {
    fetchScheduledPosts()
  }, [])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getPostsForDate = (date) => {
    return scheduledPosts.filter((post) => {
      if (!post.scheduleTime) return false
      const postDate = new Date(post.scheduleTime)
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleSchedulePost = () => {
    const today = new Date()
    const todayString = today.toISOString().split("T")[0]
    const currentTime = today.toTimeString().slice(0, 5)

    setNewPost({
      message: "",
      scheduleDate: selectedDate ? selectedDate.toISOString().split("T")[0] : todayString,
      scheduleTime: currentTime,
      jobName: "",
    })
    setScheduleError("")
    setScheduleDialogOpen(true)
  }

  const handleScheduleDialogClose = () => {
    setScheduleDialogOpen(false)
    setNewPost({
      message: "",
      scheduleDate: "",
      scheduleTime: "",
      jobName: "",
    })
    setScheduleError("")
    setIsScheduling(false)
  }

  const validateScheduleForm = () => {
    if (!newPost.message.trim()) {
      setScheduleError("Post message is required")
      return false
    }

    if (!newPost.scheduleDate || !newPost.scheduleTime) {
      setScheduleError("Please select both date and time")
      return false
    }

    const scheduleDateTime = new Date(`${newPost.scheduleDate}T${newPost.scheduleTime}:00`)
    const now = new Date()

    if (scheduleDateTime <= now) {
      setScheduleError("Schedule time must be in the future")
      return false
    }

    setScheduleError("")
    return true
  }

  const handleConfirmSchedule = async () => {
    if (!validateScheduleForm()) return

    setIsScheduling(true)
    try {
      const scheduleTimeISO = new Date(`${newPost.scheduleDate}T${newPost.scheduleTime}:00`).toISOString()

      const result = await callApi({
        endpoint: "/v1/api/linkedin/schedule-post",
        method: "POST",
        data: {
          message: newPost.message,
          scheduleTime: scheduleTimeISO,
          jobName: newPost.jobName || undefined,
        },
      })

      if (result.data.status) {
        await fetchScheduledPosts()
        handleScheduleDialogClose()
        if (onPostScheduled) {
          onPostScheduled()
        }
      } else {
        setScheduleError("Failed to schedule post. Please try again.")
      }
    } catch (err) {
      console.error("Failed to schedule post:", err)
      setScheduleError("Failed to schedule post. Please try again.")
    } finally {
      setIsScheduling(false)
    }
  }

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
        await fetchScheduledPosts()
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

  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
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

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const days = getDaysInMonth(currentDate)
  const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : []
  const today = new Date().toISOString().split("T")[0]

  if (isLoadingPosts) {
    return (
      <CalendarContainer>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
          <CircularProgress size={48} />
        </Box>
      </CalendarContainer>
    )
  }

  if (error) {
    return (
      <CalendarContainer>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
          <Button variant="outlined" onClick={fetchScheduledPosts} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Alert>
      </CalendarContainer>
    )
  }

  return (
    <CalendarContainer>
      <Container maxWidth="xl">
        {/* Header Section */}
        <CalendarHeader>
          {/* <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <EventIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                Calendar View
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Visual overview of your scheduled content
              </Typography>
            </Box>
          </Stack> */}

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight="600" color="text.primary">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<ChevronLeft />}
                onClick={() => navigateMonth("prev")}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  borderColor: "divider",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "primary.light",
                    color: "primary.main",
                  },
                }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                endIcon={<ChevronRight />}
                onClick={() => navigateMonth("next")}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  borderColor: "divider",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "primary.light",
                    color: "primary.main",
                  },
                }}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        </CalendarHeader>

        {/* Calendar Grid */}
        <CalendarGrid>
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}

          {/* Calendar Days */}
          {days.map((day, index) => {
            if (!day) {
              return <Box key={index} sx={{ minHeight: 120 }} />
            }

            const dayPosts = getPostsForDate(day)
            const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
            const isTodayDate = isToday(day)

            return (
              <CalendarDay
                key={day.toISOString()}
                isSelected={isSelected}
                hasEvents={dayPosts.length > 0}
                isToday={isTodayDate}
                onClick={() => setSelectedDate(day)}
              >
                <Typography
                  variant="body1"
                  fontWeight={isTodayDate ? "bold" : "medium"}
                  color={isTodayDate ? "primary.main" : "text.primary"}
                  sx={{ mb: 1 }}
                >
                  {day.getDate()}
                </Typography>
                {dayPosts.length > 0 && (
                  <PostCountChip size="small" label={`${dayPosts.length} post${dayPosts.length > 1 ? "s" : ""}`} />
                )}
              </CalendarDay>
            )
          })}
        </CalendarGrid>

        {/* Selected Date Posts */}
        {selectedDate && (
          <SelectedDateSection>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 0.5 }}>
                    Posts for{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedDatePosts.length} scheduled post{selectedDatePosts.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>
    
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {selectedDatePosts.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    bgcolor: "grey.50",
                    borderRadius: 3,
                    border: "2px dashed",
                    borderColor: "grey.300",
                  }}
                >
                  <ScheduleIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" fontWeight="600" gutterBottom color="text.secondary">
                    No posts scheduled for this date
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Click the "Schedule Post" button to create your first post for this day
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={3}>
                  {selectedDatePosts.map((post) => (
                    <PostCard key={post.id} elevation={0}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <LinkedIn sx={{ color: "#0077B5", fontSize: 24 }} />
                            <Chip
                              label="Scheduled"
                              size="small"
                              sx={{
                                backgroundColor: "#FFF3CD",
                                color: "#856404",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                              }}
                            />
                          </Stack>
                          {/* <Stack direction="row" spacing={1}>
                            <Tooltip title="Edit">
                              <IconButton size="small" sx={{ color: "primary.main" }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                sx={{ color: "error.main" }}
                                onClick={() => handleDeleteClick(post)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack> */}
                        </Stack>

                        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: "text.primary" }}>
                          {truncateText(post.message, 200)}
                        </Typography>

                        {/* {post.jobName && (
                          <Box
                            sx={{
                              mb: 2,
                              p: 2,
                              bgcolor: "primary.50",
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "primary.200",
                            }}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Business fontSize="small" color="primary" />
                              <Typography variant="body2" color="primary.dark" fontWeight="600">
                                Job: {post.jobName}
                              </Typography>
                            </Stack>
                          </Box>
                        )} */}

                        <Stack direction="row" spacing={3} alignItems="center" sx={{ color: "text.secondary" }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <AccessTime sx={{ fontSize: 16 }} />
                            <Typography variant="body2">{format(new Date(post.scheduleTime), "h:mm a")}</Typography>
                          </Stack>
                          <Typography variant="body2">{post.characterCount} chars</Typography>
                          <Typography variant="body2">{post.wordCount} words</Typography>
                        </Stack>
                      </CardContent>
                    </PostCard>
                  ))}
                </Stack>
              )}
            </CardContent>
          </SelectedDateSection>
        )}

        {/* Schedule Post Dialog */}
        <Dialog
          open={scheduleDialogOpen}
          onClose={handleScheduleDialogClose}
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
                <ScheduleIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="600" color="primary.main">
                  Schedule New Post
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create and schedule a new LinkedIn post
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ pb: 2 }}>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <StyledTextField
                label="Post Content"
                multiline
                rows={4}
                fullWidth
                value={newPost.message}
                onChange={(e) => setNewPost({ ...newPost, message: e.target.value })}
                placeholder="What would you like to share on LinkedIn?"
                inputProps={{ maxLength: 3000 }}
                helperText={`${newPost.message.length}/3000 characters`}
              />

              <StyledTextField
                label="Job Name (Optional)"
                fullWidth
                value={newPost.jobName}
                onChange={(e) => setNewPost({ ...newPost, jobName: e.target.value })}
                placeholder="Associate this post with a job"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StyledTextField
                    type="date"
                    label="Schedule Date"
                    fullWidth
                    value={newPost.scheduleDate}
                    onChange={(e) => setNewPost({ ...newPost, scheduleDate: e.target.value })}
                    inputProps={{ min: today }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StyledTextField
                    type="time"
                    label="Schedule Time"
                    fullWidth
                    value={newPost.scheduleTime}
                    onChange={(e) => setNewPost({ ...newPost, scheduleTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {newPost.scheduleDate && newPost.scheduleTime && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "success.50",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "success.200",
                  }}
                >
                  <Typography variant="body2" fontWeight="600" color="success.dark">
                    Scheduled for:{" "}
                    {format(new Date(`${newPost.scheduleDate}T${newPost.scheduleTime}:00`), "PPP 'at' p")}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {formatDistanceToNow(new Date(`${newPost.scheduleDate}T${newPost.scheduleTime}:00`), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Box>
              )}

              {scheduleError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {scheduleError}
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleScheduleDialogClose}
              disabled={isScheduling}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSchedule}
              variant="contained"
              disabled={isScheduling || !newPost.message.trim() || !newPost.scheduleDate || !newPost.scheduleTime}
              startIcon={isScheduling ? <CircularProgress size={18} /> : <ScheduleIcon />}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              }}
            >
              {isScheduling ? "Scheduling..." : "Schedule Post"}
            </Button>
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
                <DeleteIcon />
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
                    p: 2,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                    Scheduled for: {format(new Date(postToDelete.scheduleTime), "PPP 'at' p")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {truncateText(postToDelete.message, 150)}
                  </Typography>
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
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              disabled={isDeletingPost}
              startIcon={isDeletingPost ? <CircularProgress size={18} /> : <DeleteIcon />}
              sx={{ borderRadius: 2 }}
            >
              {isDeletingPost ? "Deleting..." : "Delete Post"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </CalendarContainer>
  )
}
