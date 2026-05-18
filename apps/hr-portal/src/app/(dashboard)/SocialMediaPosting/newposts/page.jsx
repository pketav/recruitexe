"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  Grid,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  Stack,
  Alert,
  OutlinedInput,
  FormHelperText,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material"
import {
  PhotoCamera,
  Schedule,
  Send,
  Save,
  AutoAwesome,
  TextFields,
  Image,
  LinkedIn,
  Work,
  Business,
  LocationOn,
  CheckCircle,
  Delete,
  ExpandMore,
  Person,
  Email,
  CloudUpload,
  AccessTime,
  CalendarToday,
  Add as AddIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { useApi } from "@core/hooks/useApi"
import axios from "axios"

// Enhanced Styled Components with better proportions
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  overflow: "visible",
  position: "relative",
  border: `1px solid ${theme.palette.divider}`,
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
  "& .MuiInputLabel-root": {
    fontWeight: 500,
  },
  "& .MuiFormHelperText-root": {
    marginLeft: theme.spacing(1),
    fontWeight: 400,
  },
  marginBottom: theme.spacing(2),
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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
  "& .MuiInputLabel-root": {
    fontWeight: 500,
  },
  "& .MuiFormHelperText-root": {
    marginLeft: theme.spacing(1),
    fontWeight: 400,
  },
  marginBottom: theme.spacing(2),
}))

// Redesigned Action Button with better proportions
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.95rem",
  minHeight: 44,
  transition: theme.transitions.create(["transform", "box-shadow", "background-color"]),
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[4],
  },
  "&:disabled": {
    transform: "none",
    boxShadow: "none",
  },
}))

// Compact Upload Button - UPDATED TO RESTRICT FILE TYPES
const UploadButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.9rem",
  minHeight: 48,
  border: `2px dashed ${theme.palette.primary.main}`,
  backgroundColor: `${theme.palette.primary.main}08`,
  color: theme.palette.primary.main,
  transition: theme.transitions.create(["all"]),
  "&:hover": {
    backgroundColor: `${theme.palette.primary.main}15`,
    borderColor: theme.palette.primary.dark,
    transform: "translateY(-1px)",
  },
}))

// ENHANCED ImageTemplateCard with better interaction
const ImageTemplateCard = styled(Paper)(({ theme, selected }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  cursor: "pointer",
  border: selected ? `3px solid ${theme.palette.primary.main}` : `2px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["transform", "box-shadow", "border-color"]),
  position: "relative",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[8],
    borderColor: selected ? theme.palette.primary.main : theme.palette.primary.light,
  },
}))

const CustomChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  fontWeight: 500,
  fontSize: "0.8rem",
  "& .MuiChip-deleteIcon": {
    fontSize: "1rem",
  },
}))

const ScheduleItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.success.light + "20",
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  border: `1px solid ${theme.palette.success.light}`,
}))

// NEW: Full Screen Image Dialog
const FullScreenDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    maxWidth: "90vw",
    maxHeight: "90vh",
    margin: theme.spacing(2),
  },
}))

export function NewPostForm({ onSubmit, initialData, onSavePost, getAllDraft }) {
  // ==================== STATE MANAGEMENT ====================

  // Post content and media states
  const [content, setContent] = useState(initialData?.content || "")
  const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl || "")
  const [mediaFile, setMediaFile] = useState(null)

  // Enhanced scheduling states - UPDATED FOR MULTIPLE SCHEDULES
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [scheduledTimes, setScheduledTimes] = useState([]) // Array to store multiple schedules
  const [recurrence, setRecurrence] = useState(initialData?.recurrenceType || "none")

  // UI and notification states
  const [error, setError] = useState(null)
  const [scheduleError, setScheduleError] = useState("")
  const [dateError, setDateError] = useState("")
  const [timeError, setTimeError] = useState("")

  // Account and job selection states - UPDATED FOR MULTI-ACCOUNT
  const [accounts, setAccounts] = useState([])
  const [selectedAccounts, setSelectedAccounts] = useState([]) // Changed to array for multi-select
  const [selectedAccountObjects, setSelectedAccountObjects] = useState([]) // Store full account objects

  const [selectedJobs, setSelectedJobs] = useState([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)

  // AI-generated content states - ENHANCED WITH EXPAND/DESELECT
  const [generatedImages, setGeneratedImages] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedSavedJob, setSelectedSavedJob] = useState("")
  const [expandedImage, setExpandedImage] = useState(null) // NEW: For full-screen preview
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false) // NEW: Dialog state

  // API loading states
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isSavingPost, setIsSavingPost] = useState(false)
  const [isPublishingPost, setIsPublishingPost] = useState(false)

  // Form validation states
  const [contentError, setContentError] = useState("")
  const [accountError, setAccountError] = useState("")
  const [jobError, setJobError] = useState("")

  // Current date/time helpers - ENHANCED FOR BETTER VALIDATION
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0")
  const currentDay = String(now.getDate()).padStart(2, "0")
  const currentHours = String(now.getHours()).padStart(2, "0")
  const currentMinutes = String(now.getMinutes()).padStart(2, "0")

  const today = `${currentYear}-${currentMonth}-${currentDay}`
  const currentTime = `${currentHours}:${currentMinutes}`
  const currentDateTime = new Date()

  // Use the consistent API hook
  const { callApi, loading } = useApi()

  // ENHANCED: Add the uploadFile function with image-only restriction
  const uploadFile = async (file) => {
    // Validate file type - ONLY IMAGES ALLOWED
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed. Please select a valid image file (JPG, PNG, GIF, etc.)")
      return null
    }

    // Validate file size (optional - 10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError("Image file is too large. Please select an image smaller than 10MB.")
      return null
    }

    const formDataObj = new FormData()
    formDataObj.append("file", file)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null

      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token,
        },
      })
      return res.data.url
    } catch (error) {
      console.error("Error uploading file:", error)
      setError("Error uploading image. Please try again.")
      return null
    }
  }

  // ==================== ENHANCED UTILITY FUNCTIONS ====================

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
   * Get formatted schedule time for display
   */
  const getFormattedScheduleDisplay = (date, time) => {
    if (!date || !time) return null

    try {
      const dateTimeString = `${date}T${time}:00`
      const dateObj = new Date(dateTimeString)

      return {
        date: dateObj.toLocaleDateString(),
        time: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        full: dateObj.toLocaleString(),
      }
    } catch (error) {
      console.error("Error formatting display time:", error)
      return null
    }
  }

  /**
   * ENHANCED: Validate if the selected date is not in the past
   */
  const validateScheduleDate = (selectedDate) => {
    if (!selectedDate) {
      setDateError("Date is required")
      return false
    }

    const selected = new Date(selectedDate)
    const todayDate = new Date(today)

    if (selected < todayDate) {
      setDateError("Cannot schedule posts for past dates")
      return false
    }

    setDateError("")
    return true
  }

  /**
   * ENHANCED: Validate if the selected time is not in the past (for today's date)
   */
  const validateScheduleTime = (selectedDate, selectedTime) => {
    if (!selectedTime) {
      setTimeError("Time is required")
      return false
    }

    if (!selectedDate) {
      setTimeError("Please select a date first")
      return false
    }

    // If the selected date is today, check if time is in the future
    if (selectedDate === today) {
      const [selectedHours, selectedMinutes] = selectedTime.split(":").map(Number)
      const [currentHours, currentMinutes] = currentTime.split(":").map(Number)

      const selectedTimeInMinutes = selectedHours * 60 + selectedMinutes
      const currentTimeInMinutes = currentHours * 60 + currentMinutes

      if (selectedTimeInMinutes <= currentTimeInMinutes) {
        setTimeError("Cannot schedule posts for past time. Please select a future time.")
        return false
      }
    }

    setTimeError("")
    return true
  }

  /**
   * ENHANCED: Comprehensive validation for date and time combination
   */
  const validateScheduleDateTime = (date, time) => {
    if (!date || !time) {
      return {
        isValid: false,
        error: "Both date and time are required",
      }
    }

    try {
      const selectedDateTime = new Date(`${date}T${time}:00`)

      // Add 1 minute buffer to current time to avoid edge cases
      const currentDateTimeWithBuffer = new Date(currentDateTime.getTime() + 60000)

      if (selectedDateTime <= currentDateTimeWithBuffer) {
        return {
          isValid: false,
          error: "Schedule time must be at least 1 minute in the future",
        }
      }

      return { isValid: true, error: "" }
    } catch (error) {
      return {
        isValid: false,
        error: "Invalid date or time format",
      }
    }
  }

  /**
   * Reset current date and time inputs
   */
  const resetCurrentDateTime = () => {
    setScheduleDate("")
    setScheduleTime("")
    setDateError("")
    setTimeError("")
    setScheduleError("")
  }

  // ==================== NEW: IMAGE TEMPLATE HANDLERS ====================

  /**
   * NEW: Handle template selection with deselect capability
   */
  const handleTemplateSelect = (imageUrl) => {
    // If clicking the same template, deselect it
    if (selectedTemplate === imageUrl) {
      setSelectedTemplate(null)
      setMediaUrl("")
    } else {
      // Select new template
      setSelectedTemplate(imageUrl)
      setMediaUrl(imageUrl)
    }
  }

  /**
   * NEW: Handle image expansion for full-screen preview
   */
  const handleImageExpand = (imageUrl, event) => {
    event.stopPropagation() // Prevent template selection
    setExpandedImage(imageUrl)
    setIsImageDialogOpen(true)
  }

  /**
   * NEW: Close expanded image dialog
   */
  const handleCloseImageDialog = () => {
    setIsImageDialogOpen(false)
    setExpandedImage(null)
  }

  // ==================== ENHANCED SCHEDULE MANAGEMENT FUNCTIONS ====================

  /**
   * ENHANCED: Handle date change with validation
   */
  const handleDateChange = (selectedDate) => {
    setScheduleDate(selectedDate)

    // Clear previous errors
    setDateError("")
    setTimeError("")
    setScheduleError("")

    // Validate the selected date
    const isDateValid = validateScheduleDate(selectedDate)

    // If date is valid and time is selected, validate time as well
    if (isDateValid && scheduleTime) {
      validateScheduleTime(selectedDate, scheduleTime)
    }

    // If date is today and time is selected, check if time needs to be reset
    if (selectedDate === today && scheduleTime) {
      const [selectedHours, selectedMinutes] = scheduleTime.split(":").map(Number)
      const [currentHours, currentMinutes] = currentTime.split(":").map(Number)

      const selectedTimeInMinutes = selectedHours * 60 + selectedMinutes
      const currentTimeInMinutes = currentHours * 60 + currentMinutes

      if (selectedTimeInMinutes <= currentTimeInMinutes) {
        setScheduleTime("")
        setTimeError("Previous time was in the past. Please select a future time.")
      }
    }
  }

  /**
   * ENHANCED: Handle time change with validation
   */
  const handleTimeChange = (selectedTime) => {
    setScheduleTime(selectedTime)

    // Clear previous errors
    setTimeError("")
    setScheduleError("")

    // Validate the selected time
    if (scheduleDate) {
      validateScheduleTime(scheduleDate, selectedTime)
    }
  }

  /**
   * ENHANCED: Add a new schedule to the list with comprehensive validation
   */
  const addSchedule = () => {
    // Clear previous errors
    setScheduleError("")

    // Validate date and time individually first
    const isDateValid = validateScheduleDate(scheduleDate)
    const isTimeValid = validateScheduleTime(scheduleDate, scheduleTime)

    if (!isDateValid || !isTimeValid) {
      return
    }

    // Comprehensive validation
    const validation = validateScheduleDateTime(scheduleDate, scheduleTime)

    if (!validation.isValid) {
      setScheduleError(validation.error)
      return
    }

    // Check if this exact schedule already exists
    const scheduleDateTime = `${scheduleDate}T${scheduleTime}:00`
    const isDuplicate = scheduledTimes.some((schedule) => schedule.dateTime === scheduleDateTime)

    if (isDuplicate) {
      setScheduleError("This schedule time already exists")
      return
    }

    const newSchedule = {
      id: Date.now(), // Simple ID for React keys
      date: scheduleDate,
      time: scheduleTime,
      dateTime: scheduleDateTime,
      isoString: formatScheduleTime(scheduleDate, scheduleTime),
      displayText: getFormattedScheduleDisplay(scheduleDate, scheduleTime),
    }

    setScheduledTimes((prev) => [...prev, newSchedule])
    setScheduleDate("")
    setScheduleTime("")
    setScheduleError("")
    setDateError("")
    setTimeError("")
  }

  /**
   * Remove a schedule from the list
   */
  const removeSchedule = (scheduleId) => {
    setScheduledTimes((prev) => prev.filter((schedule) => schedule.id !== scheduleId))
  }

  /**
   * Clear all schedules
   */
  const clearAllSchedules = () => {
    setScheduledTimes([])
    setScheduleError("")
    setDateError("")
    setTimeError("")
  }

  // ==================== DATA FETCHING EFFECTS ====================

  /**
   * Fetch available job posts from API using new response structure
   */
  // useEffect(() => {
  //   const fetchJobPosts = async () => {
  //     setIsLoadingJobs(true)
  //     setError(null)

  //     try {
  //       const result = await callApi({
  //         endpoint: `/v1/api/jobPost/getAllJobPostBypermission?status=active`,
  //         method: "GET",
  //         disableSnackbar: true,
  //       })

  //       if (result.data.status && result.data.items && Array.isArray(result.data.items.data)) {
  //         const mappedJobs = result.data.items.data.map((job) => ({
  //           id: job._id,
  //           title: job.position,
  //           company: job.organization ? job.organization.name : "N/A",
  //           location: job.Worklocation && job.Worklocation.length > 0 ? job.Worklocation[0].name : "N/A",
  //         }))
  //         setJobs(mappedJobs)
  //       } else {
  //         setError("Failed to load job posts")
  //         setJobs([])
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch job posts:", err)
  //       setError("Failed to load job posts. Please try again later.")
  //       setJobs([])
  //     } finally {
  //       setIsLoadingJobs(false)
  //     }
  //   }

  //   fetchJobPosts()
  // }, [])

  /**
   * Fetch available LinkedIn accounts using new response structure
   */
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const result = await callApi({
          endpoint: "/v1/api/organizations/test",
          method: "GET",
          disableSnackbar: true,
        })

        if (result.data.status && Array.isArray(result.data.items)) {
          // Filter out accounts with null linkedinName and map to usable format
          const validAccounts = result.data.items
            .filter((account) => account.linkedinName && account.linkedinName.trim() !== "")
            .map((account) => ({
              _id: account._id,
              linkedinName: account.linkedinName,
              linkedinEmail: account.linkedinEmail,
              linkedinProfilePic: account.linkedinProfilePic,
              accessToken: account.accessToken,
              memberId: account.memberId,
              organizationId: account.organizationId,
            }))

          setAccounts(validAccounts)
          // Show warning if no valid accounts found
          if (validAccounts.length === 0) {
            setError("No connected LinkedIn accounts found. Please connect a LinkedIn account first.")
          }
        } else {
          setAccounts([])
          setError("Failed to load LinkedIn accounts")
        }
      } catch (error) {
        console.error("Error fetching LinkedIn accounts:", error)
        setAccounts([])
        setError("Failed to load LinkedIn accounts. Please try again later.")
      }
    }

    fetchAccounts()
  }, [])

  // ==================== UTILITY FUNCTIONS ====================

  const getAccountStatus = (account) => {
    if (!account.accessToken || !account.memberId) {
      return { status: "disconnected", message: "Account needs reconnection" }
    }
    return { status: "connected", message: "Ready to post" }
  }

  // ==================== VALIDATION FUNCTIONS ====================

  const validateContent = (value) => {
    if (!value.trim()) {
      setContentError("Post content is required")
      return false
    }
    if (value.length > 3000) {
      setContentError("Content exceeds maximum length of 3000 characters")
      return false
    }
    setContentError("")
    return true
  }

  const validateAccounts = (selectedAccountIds) => {
    if (selectedAccountIds.length === 0) {
      setAccountError("Please select at least one LinkedIn account")
      return false
    }
    setAccountError("")
    return true
  }

  const validateJobs = (selectedJobIds) => {
    if (selectedJobIds.length === 0) {
      setJobError("Please select at least one job post")
      return false
    }
    setJobError("")
    return true
  }

  // ==================== MULTI-ACCOUNT HANDLERS ====================

  /**
   * Handle multi-account selection
   */
  const handleAccountSelection = (event) => {
    const selectedAccountIds = event.target.value
    setSelectedAccounts(selectedAccountIds)
    validateAccounts(selectedAccountIds)

    // Store full account objects for API calls
    const selectedAccountObjs = accounts.filter((account) => selectedAccountIds.includes(account._id))
    setSelectedAccountObjects(selectedAccountObjs)
  }

  /**
   * Remove a specific account from selection
   */
  const removeAccount = (accountId) => {
    const updatedAccounts = selectedAccounts.filter((id) => id !== accountId)
    setSelectedAccounts(updatedAccounts)
    validateAccounts(updatedAccounts)

    const updatedAccountObjects = selectedAccountObjects.filter((account) => account._id !== accountId)
    setSelectedAccountObjects(updatedAccountObjects)
  }

  const handleJobSelection = (event) => {
    const selectedJobIds = event.target.value
    setSelectedJobs(selectedJobIds)
    validateJobs(selectedJobIds)
  }

  const handleContentChange = (event) => {
    const value = event.target.value
    setContent(value)
    validateContent(value)
  }

  // ==================== AI CONTENT GENERATION ====================

  /**
   * Generate AI content and images using new API response structure
   */
  const handleAIGenerate = async () => {
    if (!validateJobs(selectedJobs)) {
      return
    }

    setIsGeneratingContent(true)
    setError(null)

    try {
      // Step 1: Initiate AI generation
      const initResult = await callApi({
        endpoint: `/v1/api/linkedin/generate-post/${selectedJobs.join(",")}`,
        method: "GET",
        disableSnackbar: true,
      })

      if (initResult.data.status && initResult.data.items?.id) {
        // Step 2: Wait for processing
        await new Promise((resolve) => setTimeout(resolve, 15000))

        // Step 3: Fetch generated content using new response structure
        const statusResult = await callApi({
          endpoint: `/v1/api/linkedin/status/${initResult.data.items.id}`,
          method: "GET",
          disableSnackbar: true,
        })

        if (statusResult.data.status && statusResult.data.items) {
          const generatedContent = statusResult.data.items.message || ""
          setContent(generatedContent)
          validateContent(generatedContent)

          setGeneratedImages(statusResult.data.items.imageUrls || [])
          setSelectedSavedJob(statusResult.data.items.jobId || "")
        } else {
          setError("Failed to retrieve generated content. Please try again.")
        }
      } else {
        setError("Failed to initiate AI content generation. Please try again.")
      }
    } catch (err) {
      console.error("Error generating content:", err)
      setError("Failed to generate AI content. Please try again.")
    } finally {
      setIsGeneratingContent(false)
    }
  }

  // ==================== FORM SUBMISSION HANDLERS ====================

  const clearForm = () => {
    setContent("")
    setMediaUrl("")
    setMediaFile(null)
    setScheduleDate("")
    setScheduleTime("")
    setScheduledTimes([]) // Clear multiple schedules
    setRecurrence("none")
    setSelectedAccounts([])
    setSelectedAccountObjects([])
    setSelectedJobs([])
    setGeneratedImages([])
    setSelectedTemplate(null) // Clear selected template
    setSelectedSavedJob("")
    setContentError("")
    setAccountError("")
    setJobError("")
    setScheduleError("")
    setDateError("")
    setTimeError("")
    setError(null)
  }

  /**
   * Handle post publishing/scheduling with multi-account support and multiple schedules
   */
  const handlePostNow = async () => {
    // Enhanced validation for multi-account posting
    const isContentValid = validateContent(content)
    const isAccountsValid = validateAccounts(selectedAccounts)

    if (!isContentValid || !isAccountsValid) {
      return
    }

    setIsPublishingPost(true)
    try {
      // Create orgs array with all selected accounts
      const orgsArray = selectedAccountObjects.map((account) => {
        const orgData = {
          orgId: account._id,
        }

        // Add scheduleTimes array if there are scheduled times
        if (scheduledTimes.length > 0) {
          orgData.scheduleTimes = scheduledTimes.map((schedule) => schedule.isoString).filter(Boolean)
        }

        return orgData
      })

      const publishPayload = {
        message: content,
        imageUrls: [mediaUrl],
        orgs: orgsArray, // Multi-account support with proper scheduleTime format
        // Additional metadata
        // jobId : selectedJobs
      }

      const publishResult = await callApi({
        endpoint: "/v1/api/linkedin/post/publish",
        method: "POST",
        data: publishPayload,
        disableSnackbar: false,
      })

      if (publishResult.data.status) {
        // Clear form on successful publish
        clearForm()
        setError(null)
      } else {
        setError("Failed to publish post. Please check your account connections and try again.")
      }
    } catch (err) {
      console.error("Error during publish:", err)
      setError("Failed to publish post. Please try again.")
    } finally {
      setIsPublishingPost(false)
    }
  }

  const handleDraftPost = async () => {
    // Enhanced validation
    const isContentValid = validateContent(content)
    const isAccountsValid = validateAccounts(selectedAccounts)

    if (!isContentValid || !isAccountsValid) {
      return
    }

    setIsPublishingPost(true)
    try {
      // Create orgs array with all selected accounts for draft
      const orgsArray = selectedAccountObjects.map((account) => ({
        orgId: account._id,
      }))

      const savePayload = [
        {
          jobId: selectedSavedJob,
          message: content,
          imageUrls: [mediaUrl],
          orgs: orgsArray, // Multi-account support for drafts
        },
      ]

      const saveResult = await callApi({
        endpoint: "/v1/api/linkedin/save-posts",
        method: "POST",
        data: savePayload,
        disableSnackbar: false,
      })

      if (saveResult.data.status) {
        clearForm()
        setError(null)

        // Call parent callback if provided
        if (getAllDraft) {
          getAllDraft()
        }
      } else {
        setError("Failed to save draft. Please try again.")
      }
    } catch (err) {
      console.error("Error during save:", err)
      setError("Failed to save draft. Please try again.")
    } finally {
      setIsPublishingPost(false)
    }
  }

  // ==================== ENHANCED FILE HANDLING - IMAGE ONLY ====================

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type before processing
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed. Please select a valid image file (JPG, PNG, GIF, etc.)")
        // Clear the input
        event.target.value = ""
        return
      }

      setMediaFile(file)

      // Show immediate preview for images
      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaUrl(e.target.result) // Show preview immediately
      }
      reader.readAsDataURL(file)

      // Upload file to get URL
      try {
        const uploadedUrl = await uploadFile(file)
        if (uploadedUrl) {
          setMediaUrl(uploadedUrl) // Replace preview with actual URL
        }
      } catch (error) {
        console.error("Failed to upload file:", error)
        setError("Failed to upload image. Please try again.")
      }
    }
  }

  const removeMedia = () => {
    setMediaUrl("")
    setMediaFile(null)
    setSelectedTemplate(null) // Also clear selected template
  }

  // ==================== RENDER COMPONENT ====================

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Box sx={{ p: 4, backgroundColor: "#ffffff" }}>
        <Stack spacing={4}>
          {/* Error Display */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Account and Job Selection Row */}
          <Box sx={{ p: 3, borderRadius: 2, bgcolor: "grey.50", border: "1px solid", borderColor: "grey.200" }}>
            <Grid container spacing={3}>
              {/* Multi-LinkedIn Account Selection */}
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <LinkedIn color="primary" />
                  <Typography variant="h6" fontWeight="600" color="#1a1a1a">
                    LinkedIn Accounts
                  </Typography>



                  {/* Filter accounts that have accessToken */}
                  {accounts.filter((acc) => acc.accessToken).length > 0 && (
                    <CustomChip
                      label={`${selectedAccounts.filter((acc) => acc.accessToken).length}/${accounts.filter((acc) => acc.accessToken).length} selected`}
                      size="small"
                      color={
                        selectedAccounts.filter((acc) => acc.accessToken).length > 0
                          ? "success"
                          : "default"
                      }
                      variant="outlined"
                    />
                  )}
                </Stack>

                <StyledFormControl fullWidth error={!!accountError}>
                  <InputLabel>Select Accounts (Multi-select)</InputLabel>
                  <Select
                    multiple
                    value={selectedAccounts}
                    onChange={handleAccountSelection}
                    input={<OutlinedInput label="Select Accounts (Multi-select)" />}
                    disabled={loading || accounts.length === 0}
                    IconComponent={ExpandMore}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.slice(0, 3).map((accountId) => {
                          const account = accounts.find((acc) => acc._id === accountId)
                          return (
                            <CustomChip
                              key={accountId}
                              label={account ? account.linkedinName : accountId}
                              size="small"
                              color="primary"
                              variant="outlined"
                              onDelete={(e) => {
                                e.stopPropagation()
                                removeAccount(accountId)
                              }}
                              deleteIcon={<Delete />}
                            />
                          )
                        })}
                        {selected.length > 3 && (
                          <CustomChip
                            label={`+${selected.length - 3} more`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    )}
                  >
                    {accounts.length === 0 ? (
                      <MenuItem disabled>
                        <Typography color="text.secondary">
                          {loading ? "Loading accounts..." : "No LinkedIn accounts available"}
                        </Typography>
                      </MenuItem>
                    ) : (
                      accounts.map((account) => {
                        const accountStatus = getAccountStatus(account)
                        if (accountStatus.status == 'connected') {
                          return (
                            <MenuItem key={account._id} value={account._id}>
                              <Checkbox checked={selectedAccounts.includes(account._id)} />
                              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                                <Avatar
                                  sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                                  src={account.linkedinProfilePic || undefined}
                                >
                                  {account.linkedinProfilePic ? null : <Person fontSize="small" />}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography fontWeight="500">{account.linkedinName}</Typography>
                                  {account.linkedinEmail && (
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                      <Email fontSize="small" color="action" />
                                      <Typography variant="caption" color="text.secondary">
                                        {account.linkedinEmail}
                                      </Typography>
                                    </Stack>
                                  )}
                                </Box>
                                <CustomChip
                                  label={accountStatus.status}
                                  size="small"
                                  color={accountStatus.status === "connected" ? "success" : "warning"}
                                  variant="outlined"
                                />
                              </Stack>
                            </MenuItem>
                          )
                        }
                      })
                    )}
                  </Select>
                  {accountError && <FormHelperText>{accountError}</FormHelperText>}
                </StyledFormControl>

                {/* Show connection help if no accounts */}
                {accounts.length === 0 && !loading && (
                  <Box
                    sx={{
                      p: 2,
                      mt: 2,
                      bgcolor: "warning.50",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "warning.200",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LinkedIn color="warning" />
                      <Typography variant="body2" color="warning.dark">
                        No LinkedIn accounts connected. Please connect your LinkedIn account in settings.
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Grid>


            </Grid>
          </Box>

          {/* Post Content Section */}
          <Box sx={{ p: 3, borderRadius: 2, bgcolor: "grey.50", border: "1px solid", borderColor: "grey.200" }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <TextFields color="primary" />
              <Typography variant="h6" fontWeight="600" color="#1a1a1a">
                Post Content
              </Typography>
            </Stack>

            <StyledTextField
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              label="What's on your mind?"
              placeholder="Share your story, insights, or updates..."
              value={content}
              onChange={handleContentChange}
              error={!!contentError}
              helperText={contentError || `${content.length}/3000 characters`}
              sx={{ mb: 2 }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                variant="body2"
                color={content.length > 2800 ? "warning.main" : content.length > 3000 ? "error" : "text.secondary"}
                fontWeight="500"
              >
                {content.length > 2800 && content.length <= 3000 && "Approaching character limit"}
                {content.length > 3000 && "Character limit exceeded"}
              </Typography>

              <ActionButton
                variant="contained"
                startIcon={isGeneratingContent ? <CircularProgress size={18} /> : <AutoAwesome />}
                onClick={handleAIGenerate}
                disabled={isGeneratingContent || selectedJobs.length === 0}
                sx={{
                  background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  color: "white",
                }}
              >
                {isGeneratingContent ? "Generating..." : "AI Generate"}
              </ActionButton>
            </Stack>
          </Box>

          {/* ENHANCED AI Generated Image Templates - WITH EXPAND AND DESELECT */}
          {generatedImages.length > 0 && (
            <Box sx={{ p: 3, bgcolor: "primary.50", borderRadius: 2, border: "1px solid", borderColor: "primary.200" }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Image color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Select a Template
                </Typography>
                {selectedTemplate && (
                  <CustomChip
                    label="Template Selected"
                    size="small"
                    color="success"
                    variant="outlined"
                    onDelete={() => {
                      setSelectedTemplate(null)
                      setMediaUrl("")
                    }}
                    deleteIcon={<CloseIcon />}
                  />
                )}
              </Stack>

              <Grid container spacing={2}>
                {generatedImages.map((imageUrl, index) => (
                  <Grid item xs={6} sm={4} md={2.4} key={index}>
                    <ImageTemplateCard
                      selected={selectedTemplate === imageUrl}
                      onClick={() => handleTemplateSelect(imageUrl)}
                    >
                      <Box sx={{ position: "relative" }}>
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Template ${index + 1}`}
                          style={{
                            width: "100%",
                            height: 120,
                            objectFit: "cover",
                          }}
                        />

                        {/* ENHANCED: Expand Button */}
                        <IconButton
                          size="small"
                          onClick={(e) => handleImageExpand(imageUrl, e)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            bgcolor: "rgba(0,0,0,0.7)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
                          }}
                        >
                          <ZoomInIcon fontSize="small" />
                        </IconButton>

                        {/* Selection Indicator */}
                        {selectedTemplate === imageUrl && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "primary.main",
                              color: "white",
                              borderRadius: "50%",
                              width: 28,
                              height: 28,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CheckCircle fontSize="small" />
                          </Box>
                        )}

                        {/* Deselect Button for Selected Template */}
                        {selectedTemplate === imageUrl && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTemplate(null)
                              setMediaUrl("")
                            }}
                            sx={{
                              position: "absolute",
                              bottom: 4,
                              right: 4,
                              bgcolor: "error.main",
                              color: "white",
                              "&:hover": { bgcolor: "error.dark" },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </ImageTemplateCard>
                  </Grid>
                ))}
              </Grid>

              {/* Template Selection Help Text */}
              <Box
                sx={{ mt: 2, p: 2, bgcolor: "info.50", borderRadius: 2, border: "1px solid", borderColor: "info.200" }}
              >
                <Typography variant="body2" color="info.main" textAlign="center">
                  💡 Click on a template to select it, click again to deselect. Use the zoom icon to preview in full
                  screen.
                </Typography>
              </Box>
            </Box>
          )}

          {/* Media Upload and Scheduling Row - ENHANCED WITH IMAGE-ONLY RESTRICTION */}
          <Grid container spacing={3}>
            {/* ENHANCED Media Upload Section - IMAGE ONLY */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200",
                  height: "100%",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <CloudUpload color="primary" />
                  <Typography variant="h6" fontWeight="600" color="#1a1a1a">
                    Image Attachment
                  </Typography>
                  <CustomChip label="Images Only" size="small" color="info" variant="outlined" />
                </Stack>

                <Stack spacing={2}>
                  <UploadButton component="label" startIcon={<PhotoCamera />} fullWidth>
                    Upload Image
                    <input
                      type="file"
                      accept="image/*" // RESTRICTED TO IMAGES ONLY
                      onChange={handleFileUpload}
                      hidden
                    />
                  </UploadButton>

                  {/* File Type Information */}
                  <Box
                    sx={{ p: 1.5, bgcolor: "info.50", borderRadius: 1, border: "1px solid", borderColor: "info.200" }}
                  >
                    <Typography variant="caption" color="info.main" textAlign="center" display="block">
                      Supported formats: JPG, PNG, GIF, WebP, SVG
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                      Maximum file size: 10MB
                    </Typography>
                  </Box>

                  {mediaFile && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "success.50",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "success.200",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 8, height: 8, bgcolor: "success.main", borderRadius: "50%" }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="600" color="success.dark" noWrap>
                            {mediaFile.name}
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            ({(mediaFile.size / 1024 / 1024).toFixed(2)} MB)
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={removeMedia} color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Grid>

            {/* Scheduling Section - Same as before */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200",
                  height: "100%",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Schedule color="primary" />
                  <Typography variant="h6" fontWeight="600" color="#1a1a1a">
                    Schedule Options
                  </Typography>
                  {scheduledTimes.length > 0 && (
                    <CustomChip
                      label={`${scheduledTimes.length} scheduled`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Stack>

                <Stack spacing={2}>
                  {/* Add New Schedule Form - ENHANCED WITH VALIDATION */}
                  <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2, border: "1px solid", borderColor: "grey.300" }}>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                      Add Schedule Time
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <StyledTextField
                          type="date"
                          label="Date"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={scheduleDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          inputProps={{
                            min: today,
                            max: `${currentYear + 1}-12-31`, // Prevent selecting dates too far in future
                          }}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: <CalendarToday sx={{ mr: 1, color: "action.active" }} fontSize="small" />,
                          }}
                          error={!!dateError}
                          helperText={dateError || "Select a future date"}
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
                          value={scheduleTime}
                          onChange={(e) => handleTimeChange(e.target.value)}
                          inputProps={
                            scheduleDate === today
                              ? {
                                min: currentTime,
                                step: 60, // 1 minute steps
                              }
                              : {
                                step: 60, // 1 minute steps
                              }
                          }
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: <AccessTime sx={{ mr: 1, color: "action.active" }} fontSize="small" />,
                          }}
                          error={!!timeError}
                          helperText={
                            timeError ||
                            (scheduleDate === today ? `Select time after ${currentTime}` : "Select any time")
                          }
                          sx={{ mb: 0 }}
                        />
                      </Grid>
                    </Grid>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <ActionButton
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={addSchedule}
                        disabled={!scheduleDate || !scheduleTime || !!dateError || !!timeError || !!scheduleError}
                        sx={{ flex: 1 }}
                      >
                        Add Schedule
                      </ActionButton>

                      <ActionButton
                        variant="outlined"
                        size="small"
                        startIcon={<CloseIcon />}
                        onClick={() => {
                          setScheduleDate("")
                          setScheduleTime("")
                          setDateError("")
                          setTimeError("")
                          setScheduleError("")
                        }}
                        disabled={!scheduleDate && !scheduleTime}
                        color="secondary"
                        sx={{ minWidth: 100 }}
                      >
                        Reset
                      </ActionButton>

                      {scheduledTimes.length > 0 && (
                        <ActionButton
                          variant="outlined"
                          size="small"
                          startIcon={<Delete />}
                          onClick={clearAllSchedules}
                          color="error"
                          sx={{ minWidth: 100 }}
                        >
                          Clear All
                        </ActionButton>
                      )}
                    </Stack>
                  </Box>

                  {/* Display Scheduled Times */}
                  {scheduledTimes.length > 0 && (
                    <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                      <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                        Scheduled Times ({scheduledTimes.length})
                      </Typography>
                      <List dense sx={{ p: 0 }}>
                        {scheduledTimes.map((schedule) => (
                          <ScheduleItem key={schedule.id}>
                            <ListItemIcon>
                              <Schedule color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" fontWeight="500">
                                  {schedule.displayText?.full || `${schedule.date} ${schedule.time}`}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  ISO: {schedule.isoString}
                                </Typography>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton size="small" onClick={() => removeSchedule(schedule.id)} color="error">
                                <Delete fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ScheduleItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Schedule Summary */}
                  {scheduledTimes.length > 0 && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "info.50",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "info.200",
                        textAlign: "center",
                      }}
                    >
                      <Stack spacing={1} alignItems="center">
                        <CustomChip
                          icon={<Schedule />}
                          label={`${scheduledTimes.length} schedule${scheduledTimes.length > 1 ? "s" : ""} set`}
                          color="info"
                          variant="outlined"
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Posts will be published at the scheduled times
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Box>

      {/* Action Buttons - UPDATED FOR MULTIPLE SCHEDULES */}
      <Box sx={{ p: 3, bgcolor: "#ffffff", borderTop: "1px solid", borderColor: "grey.200" }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <ActionButton
            variant="outlined"
            startIcon={isSavingPost ? <CircularProgress size={18} /> : <Save />}
            onClick={handleDraftPost}
            disabled={
              !content?.trim() ||
              !selectedJobs.length ||
              selectedAccountObjects.length === 0 ||
              isSavingPost ||
              !!contentError ||
              !!accountError ||
              !!jobError
            }
            sx={{
              minWidth: 140,
              borderWidth: 2,
              "&:hover": { borderWidth: 2 },
            }}
          >
            {isSavingPost ? "Saving..." : "Save Draft"}
          </ActionButton>

          <ActionButton
            variant="contained"
            startIcon={
              isPublishingPost ? <CircularProgress size={18} /> : scheduledTimes.length > 0 ? <Schedule /> : <Send />
            }
            onClick={handlePostNow}
            disabled={
              !content.trim() ||
              selectedAccountObjects.length === 0 ||
              isPublishingPost ||
              !!contentError ||
              !!accountError ||
              !!dateError ||
              !!timeError ||
              !!scheduleError
            }
            sx={{
              minWidth: 180,
              background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              color: "white",
            }}
          >
            {isPublishingPost
              ? `Publishing to ${selectedAccountObjects.length} account${selectedAccountObjects.length > 1 ? "s" : ""}...`
              : scheduledTimes.length > 0
                ? `Schedule ${scheduledTimes.length} Post${scheduledTimes.length > 1 ? "s" : ""} (${selectedAccountObjects.length} account${selectedAccountObjects.length > 1 ? "s" : ""})`
                : `Publish to ${selectedAccountObjects.length} account${selectedAccountObjects.length > 1 ? "s" : ""}`}
          </ActionButton>
        </Stack>
      </Box>

      {/* NEW: Full Screen Image Preview Dialog */}
      <FullScreenDialog open={isImageDialogOpen} onClose={handleCloseImageDialog} maxWidth={false} fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Template Preview</Typography>
          <IconButton onClick={handleCloseImageDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, textAlign: "center" }}>
          {expandedImage && (
            <img
              src={expandedImage || "/placeholder.svg"}
              alt="Template Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <ActionButton variant="outlined" onClick={handleCloseImageDialog} startIcon={<CloseIcon />}>
            Close
          </ActionButton>
          {expandedImage && (
            <ActionButton
              variant="contained"
              onClick={() => {
                handleTemplateSelect(expandedImage)
                handleCloseImageDialog()
              }}
              startIcon={selectedTemplate === expandedImage ? <CloseIcon /> : <CheckCircle />}
              color={selectedTemplate === expandedImage ? "error" : "primary"}
            >
              {selectedTemplate === expandedImage ? "Deselect Template" : "Select Template"}
            </ActionButton>
          )}
        </DialogActions>
      </FullScreenDialog>
    </Box>
  )
}
