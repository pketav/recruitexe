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
  RadioGroup,
  FormControlLabel,
  Radio,
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
  CheckCircle,
  Delete,
  Person,
  CloudUpload,
  Add as AddIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  PostAdd,
  Category,
  Timer,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { useApi } from "@core/hooks/useApi"
import axios from "axios"

// Enhanced Styled Components with better proportions
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: "visible",
  position: "relative",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
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
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
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
}))

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.2, 2.5),
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
  minHeight: 42,
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

const CompactButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.8, 1.5),
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.8rem",
  minHeight: 36,
}))

const UploadButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.85rem",
  minHeight: 44,
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

const ImageTemplateCard = styled(Paper)(({ theme, selected }) => ({
  borderRadius: theme.spacing(1.5),
  overflow: "hidden",
  cursor: "pointer",
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["transform", "box-shadow", "border-color"]),
  position: "relative",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[6],
    borderColor: selected ? theme.palette.primary.main : theme.palette.primary.light,
  },
}))

const CustomChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  fontWeight: 500,
  fontSize: "0.75rem",
  height: 28,
  "& .MuiChip-deleteIcon": {
    fontSize: "0.9rem",
  },
}))

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
}))

const ScheduleItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.success.light + "15",
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  border: `1px solid ${theme.palette.success.light}40`,
  minHeight: 48,
}))

const FullScreenDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    maxWidth: "90vw",
    maxHeight: "90vh",
    margin: theme.spacing(2),
  },
}))

export function NewPostForm({ onSubmit, initialData, onSavePost, getAllDraft }) {
  // ==================== STATE MANAGEMENT ====================
  const [postType, setPostType] = useState("job")
  const [otherPostTitle, setOtherPostTitle] = useState("")
  const [otherPostTitleError, setOtherPostTitleError] = useState("")

  const [content, setContent] = useState(initialData?.content || "")
  const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl || "")
  const [mediaFile, setMediaFile] = useState(null)

  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [scheduledTimes, setScheduledTimes] = useState([])
  const [recurrence, setRecurrence] = useState(initialData?.recurrenceType || "none")

  const [error, setError] = useState(null)
  const [scheduleError, setScheduleError] = useState("")
  const [dateError, setDateError] = useState("")
  const [timeError, setTimeError] = useState("")

  const [accounts, setAccounts] = useState([])
  const [selectedAccounts, setSelectedAccounts] = useState([])
  const [selectedAccountObjects, setSelectedAccountObjects] = useState([])

  const [jobs, setJobs] = useState([])
  const [selectedJobs, setSelectedJobs] = useState([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)

  const [generatedImages, setGeneratedImages] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedSavedJob, setSelectedSavedJob] = useState("")
  const [expandedImage, setExpandedImage] = useState(null)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isSavingPost, setIsSavingPost] = useState(false)
  const [isPublishingPost, setIsPublishingPost] = useState(false)

  const [contentError, setContentError] = useState("")
  const [accountError, setAccountError] = useState("")
  const [jobError, setJobError] = useState("")

  // Current date/time helpers
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0")
  const currentDay = String(now.getDate()).padStart(2, "0")
  const currentHours = String(now.getHours()).padStart(2, "0")
  const currentMinutes = String(now.getMinutes()).padStart(2, "0")

  const today = `${currentYear}-${currentMonth}-${currentDay}`
  const currentTime = `${currentHours}:${currentMinutes}`
  const currentDateTime = new Date()

  const { callApi, loading } = useApi()

  // ==================== UTILITY FUNCTIONS ====================
  const uploadFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed. Please select a valid image file (JPG, PNG, GIF, etc.)")
      return null
    }

    const maxSize = 10 * 1024 * 1024
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

  const formatScheduleTime = (date, time) => {
    if (!date || !time) return null
    try {
      const dateTimeString = `${date}T${time}:00`
      const dateObj = new Date(dateTimeString)
      return dateObj.toISOString()
    } catch (error) {
      console.error("Error formatting schedule time:", error)
      return null
    }
  }

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

  const validateScheduleDateTime = (date, time) => {
    if (!date || !time) {
      return {
        isValid: false,
        error: "Both date and time are required",
      }
    }

    try {
      const selectedDateTime = new Date(`${date}T${time}:00`)
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

  // ==================== HANDLERS ====================
  const handlePostTypeChange = (event) => {
    const newPostType = event.target.value
    setPostType(newPostType)

    if (newPostType === "other") {
      setSelectedJobs([])
      setJobError("")
      setOtherPostTitle("")
      setOtherPostTitleError("")
    } else {
      setOtherPostTitle("")
      setOtherPostTitleError("")
    }

    setContent("")
    setGeneratedImages([])
    setSelectedTemplate(null)
    setMediaUrl("")
    setContentError("")
  }

  const handleOtherPostTitleChange = (event) => {
    const value = event.target.value
    setOtherPostTitle(value)

    if (!value.trim()) {
      setOtherPostTitleError("Post title is required for other posts")
    } else if (value.length > 200) {
      setOtherPostTitleError("Title exceeds maximum length of 200 characters")
    } else {
      setOtherPostTitleError("")
    }
  }

  const handleTemplateSelect = (imageUrl) => {
    if (selectedTemplate === imageUrl) {
      setSelectedTemplate(null)
      setMediaUrl("")
    } else {
      setSelectedTemplate(imageUrl)
      setMediaUrl(imageUrl)
    }
  }

  const handleImageExpand = (imageUrl, event) => {
    event.stopPropagation()
    setExpandedImage(imageUrl)
    setIsImageDialogOpen(true)
  }

  const handleCloseImageDialog = () => {
    setIsImageDialogOpen(false)
    setExpandedImage(null)
  }

  const addSchedule = () => {
    setScheduleError("")

    const validation = validateScheduleDateTime(scheduleDate, scheduleTime)

    if (!validation.isValid) {
      setScheduleError(validation.error)
      return
    }

    const scheduleDateTime = `${scheduleDate}T${scheduleTime}:00`
    const isDuplicate = scheduledTimes.some((schedule) => schedule.dateTime === scheduleDateTime)

    if (isDuplicate) {
      setScheduleError("This schedule time already exists")
      return
    }

    const newSchedule = {
      id: Date.now(),
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

  const removeSchedule = (scheduleId) => {
    setScheduledTimes((prev) => prev.filter((schedule) => schedule.id !== scheduleId))
  }

  const handleAccountSelection = (event) => {
    const selectedAccountIds = event.target.value
    setSelectedAccounts(selectedAccountIds)

    if (selectedAccountIds.length === 0) {
      setAccountError("Please select at least one LinkedIn account")
    } else {
      setAccountError("")
    }

    const selectedAccountObjs = accounts.filter((account) => selectedAccountIds.includes(account._id))
    setSelectedAccountObjects(selectedAccountObjs)
  }

  const handleJobSelection = (event) => {
    const selectedJobIds = event.target.value
    setSelectedJobs(selectedJobIds)

    if (postType === "job" && selectedJobIds.length === 0) {
      setJobError("Please select at least one job post")
    } else {
      setJobError("")
    }
  }

  const handleContentChange = (event) => {
    const value = event.target.value
    setContent(value)

    if (!value.trim()) {
      setContentError("Post content is required")
    } else if (value.length > 3000) {
      setContentError("Content exceeds maximum length of 3000 characters")
    } else {
      setContentError("")
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed. Please select a valid image file (JPG, PNG, GIF, etc.)")
        event.target.value = ""
        return
      }

      setMediaFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaUrl(e.target.result)
      }
      reader.readAsDataURL(file)

      try {
        const uploadedUrl = await uploadFile(file)
        if (uploadedUrl) {
          setMediaUrl(uploadedUrl)
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
    setSelectedTemplate(null)
  }

  const handleAIGenerate = async () => {
    if (postType === "job" && selectedJobs.length === 0) {
      setJobError("Please select at least one job post")
      return
    }

    if (postType === "other" && !otherPostTitle.trim()) {
      setOtherPostTitleError("Post title is required for other posts")
      return
    }

    setIsGeneratingContent(true)
    setError(null)

    try {
      let initResult

      if (postType === "job") {
        initResult = await callApi({
          endpoint: `/v1/api/linkedin/generate-post/${selectedJobs.join(",")}`,
          method: "GET",
          disableSnackbar: true,
        })
          if (initResult.data.status && initResult.data.items) {
        // Wait for processing (keep existing wait time)
        await new Promise((resolve) => setTimeout(resolve, 15000))

        // Fetch generated content using the same status endpoint
        const statusResult = await callApi({
          endpoint: `/v1/api/linkedin/status/${initResult.data.items.id}`,
          method: "GET",
          disableSnackbar: true,
        })

        if (statusResult.data.status && statusResult.data.items) {
          const generatedContent = statusResult.data.items.message || ""
          setContent(generatedContent)

          if (!generatedContent.trim()) {
            setContentError("Post content is required")
          } else {
            setContentError("")
          }

          setGeneratedImages(statusResult.data.items.imageUrls || [])

          if (postType === "job") {
            setSelectedSavedJob(statusResult.data.items.jobId || "")
          } else {
            setSelectedSavedJob("") // Clear for other posts
          }
        } else {
          setError("Failed to retrieve generated content. Please try again.")
        }
      } else {
        setError("Failed to initiate AI content generation. Please try again.")
      }
      } else {
        // Updated API call for other posts using the new endpoint
        initResult = await callApi({
          endpoint: `/v1/api/linkedin/other/post?title=${encodeURIComponent(otherPostTitle)}`,
          method: "GET",
          disableSnackbar: true,
        })
          if (initResult.data.status && initResult.data.items) {
        // Wait for processing (keep existing wait time)
          const generatedContent = initResult.data.items.message || ""
          setContent(generatedContent)

          if (!generatedContent.trim()) {
            setContentError("Post content is required")
          } else {
            setContentError("")
          }

          setGeneratedImages(statusResult.data.items.imageUrls || [])

          if (postType === "job") {
            setSelectedSavedJob(statusResult.data.items.jobId || "")
          } else {
            setSelectedSavedJob("") // Clear for other posts
          }
        
      } else {
        setError("Failed to initiate AI content generation. Please try again.")
      }
      }

    
    } catch (err) {
      console.error("Error generating content:", err)
      setError("Failed to generate AI content. Please try again.")
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const clearForm = () => {
    setPostType("job")
    setOtherPostTitle("")
    setOtherPostTitleError("")
    setContent("")
    setMediaUrl("")
    setMediaFile(null)
    setScheduleDate("")
    setScheduleTime("")
    setScheduledTimes([])
    setRecurrence("none")
    setSelectedAccounts([])
    setSelectedAccountObjects([])
    setSelectedJobs([])
    setGeneratedImages([])
    setSelectedTemplate(null)
    setSelectedSavedJob("")
    setContentError("")
    setAccountError("")
    setJobError("")
    setScheduleError("")
    setDateError("")
    setTimeError("")
    setError(null)
  }

  const handlePostNow = async () => {
    const isContentValid = content.trim() && !contentError
    const isAccountsValid = selectedAccounts.length > 0
    const isJobsValid = postType === "other" || selectedJobs.length > 0
    const isOtherPostValid = postType === "job" || otherPostTitle.trim()

    if (!isContentValid || !isAccountsValid || !isJobsValid || !isOtherPostValid) {
      if (!isContentValid) setContentError("Post content is required")
      if (!isAccountsValid) setAccountError("Please select at least one LinkedIn account")
      if (!isJobsValid) setJobError("Please select at least one job post")
      if (!isOtherPostValid) setOtherPostTitleError("Post title is required for other posts")
      return
    }

    setIsPublishingPost(true)
    try {
      const orgsArray = selectedAccountObjects.map((account) => {
        const orgData = {
          orgId: account._id,
        }

        if (scheduledTimes.length > 0) {
          orgData.scheduleTimes = scheduledTimes.map((schedule) => schedule.isoString).filter(Boolean)
        }

        return orgData
      })

      const publishPayload = {
        message: content,
        imageUrls: [mediaUrl],
        orgs: orgsArray,
        postType: postType,
        ...(postType === "job" && { jobIds: selectedJobs }),
        ...(postType === "other" && { title: otherPostTitle }),
      }

      const publishResult = await callApi({
        endpoint: "/v1/api/linkedin/post/publish",
        method: "POST",
        data: publishPayload,
        disableSnackbar: false,
      })

      if (publishResult.data.status) {
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
    const isContentValid = content.trim() && !contentError
    const isAccountsValid = selectedAccounts.length > 0
    const isJobsValid = postType === "other" || selectedJobs.length > 0
    const isOtherPostValid = postType === "job" || otherPostTitle.trim()

    if (!isContentValid || !isAccountsValid || !isJobsValid || !isOtherPostValid) {
      if (!isContentValid) setContentError("Post content is required")
      if (!isAccountsValid) setAccountError("Please select at least one LinkedIn account")
      if (!isJobsValid) setJobError("Please select at least one job post")
      if (!isOtherPostValid) setOtherPostTitleError("Post title is required for other posts")
      return
    }

    setIsPublishingPost(true)
    try {
      const orgsArray = selectedAccountObjects.map((account) => ({
        orgId: account._id,
      }))

      const savePayload = [
        {
          jobId: postType === "job" ? selectedSavedJob : null,
          message: content,
          imageUrls: [mediaUrl],
          orgs: orgsArray,
          postType: postType,
          ...(postType === "other" && { title: otherPostTitle }),
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

  // ==================== DATA FETCHING EFFECTS ====================
  useEffect(() => {
    if (postType !== "job") {
      setJobs([])
      return
    }

    const fetchJobPosts = async () => {
      setIsLoadingJobs(true)
      setError(null)

      try {
        const result = await callApi({
          endpoint: `/v1/api/jobPost/getAllJobPostBypermission?status=active`,
          method: "GET",
          disableSnackbar: true,
        })

        if (result.data.status && result.data.items && Array.isArray(result.data.items.data)) {
          const mappedJobs = result.data.items.data.map((job) => ({
            id: job._id,
            title: job.position,
            company: job.organization ? job.organization.name : "N/A",
            location: job.Worklocation && job.Worklocation.length > 0 ? job.Worklocation[0].name : "N/A",
          }))
          setJobs(mappedJobs)
        } else {
          setError("Failed to load job posts")
          setJobs([])
        }
      } catch (err) {
        console.error("Failed to fetch job posts:", err)
        setError("Failed to load job posts. Please try again later.")
        setJobs([])
      } finally {
        setIsLoadingJobs(false)
      }
    }

    fetchJobPosts()
  }, [postType])

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const result = await callApi({
          endpoint: "/v1/api/organizations/test",
          method: "GET",
          disableSnackbar: true,
        })

        if (result.data.status && Array.isArray(result.data.items)) {
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

  const getAccountStatus = (account) => {
    if (!account.accessToken || !account.memberId) {
      return { status: "disconnected", message: "Account needs reconnection" }
    }
    return { status: "connected", message: "Ready to post" }
  }

  // ==================== RENDER COMPONENT ====================
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa", p: 2 }}>
      <Stack spacing={3}  mx="auto">
        {/* Error Display */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Post Type Selection */}
        <SectionCard>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <PostAdd color="primary" />
            <Typography variant="h6" fontWeight="600" color="primary.main">
              Post Type
            </Typography>
          </Stack>

          <FormControl component="fieldset">
            <RadioGroup row value={postType} onChange={handlePostTypeChange} sx={{ gap: 4 }}>
              <FormControlLabel
                value="job"
                control={<Radio />}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Work fontSize="small" />
                    <Typography fontWeight="500">Job Post</Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Category fontSize="small" />
                    <Typography fontWeight="500">Other Post</Typography>
                  </Stack>
                }
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 2, p: 2, bgcolor: "info.50", borderRadius: 1.5 }}>
            <Typography variant="body2" color="info.main">
              {postType === "job"
                ? "💼 Create posts related to job openings. Select from available job posts to generate AI content."
                : "✨ Create general posts about any topic. Provide a title to generate AI content and images."}
            </Typography>
          </Box>
        </SectionCard>

        {/* Other Post Title (6/6 layout when visible) */}
        {postType === "other" && (
          <SectionCard>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <TextFields color="primary" />
              <Typography variant="h6" fontWeight="600">
                Post Title
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Enter your post title"
                  placeholder="e.g., 'Tips for Remote Work Productivity', 'Latest Tech Trends 2024'"
                  value={otherPostTitle}
                  onChange={handleOtherPostTitleChange}
                  error={!!otherPostTitleError}
                  helperText={otherPostTitleError || `${otherPostTitle.length}/200 characters`}
                />
              </Grid>
            </Grid>
          </SectionCard>
        )}

        {/* Account and Job Selection (6/6 layout) */}
        <SectionCard>
          <Grid container spacing={4}>
            {/* LinkedIn Accounts - 6/12 */}
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <LinkedIn color="primary" />
                <Typography variant="h6" fontWeight="600">
                  LinkedIn Accounts
                </Typography>
                {selectedAccounts.length > 0 && (
                  <CustomChip
                    label={`${selectedAccounts.length} selected`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Stack>

              <StyledFormControl fullWidth error={!!accountError}>
                <InputLabel>Select Accounts</InputLabel>
                <Select
                  multiple
                  value={selectedAccounts}
                  onChange={handleAccountSelection}
                  input={<OutlinedInput label="Select Accounts" />}
                  disabled={loading || accounts.length === 0}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.slice(0, 2).map((accountId) => {
                        const account = accounts.find((acc) => acc._id === accountId)
                        return (
                          <CustomChip
                            key={accountId}
                            label={account ? account.linkedinName : accountId}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )
                      })}
                      {selected.length > 2 && (
                        <CustomChip
                          label={`+${selected.length - 2} more`}
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
                      if (accountStatus.status === "connected") {
                        return (
                          <MenuItem key={account._id} value={account._id}>
                            <Checkbox checked={selectedAccounts.includes(account._id)} />
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                              <Avatar
                                sx={{ width: 28, height: 28, bgcolor: "primary.main" }}
                                src={account.linkedinProfilePic || undefined}
                              >
                                {account.linkedinProfilePic ? null : <Person fontSize="small" />}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography fontWeight="500" fontSize="0.9rem">
                                  {account.linkedinName}
                                </Typography>
                                {account.linkedinEmail && (
                                  <Typography variant="caption" color="text.secondary">
                                    {account.linkedinEmail}
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          </MenuItem>
                        )
                      }
                      return null
                    })
                  )}
                </Select>
                {accountError && <FormHelperText>{accountError}</FormHelperText>}
              </StyledFormControl>
            </Grid>

            {/* Job Posts - 6/12 (only for job posts) */}
            {postType === "job" && (
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Work color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    Job Posts
                  </Typography>
                  {selectedJobs.length > 0 && (
                    <CustomChip
                      label={`${selectedJobs.length} selected`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Stack>

                <StyledFormControl fullWidth error={!!jobError}>
                  <InputLabel>Select Jobs</InputLabel>
                  <Select
                    multiple
                    value={selectedJobs}
                    onChange={handleJobSelection}
                    input={<OutlinedInput label="Select Jobs" />}
                    disabled={isLoadingJobs}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.slice(0, 2).map((jobId) => {
                          const job = jobs.find((j) => j.id === jobId)
                          return (
                            <CustomChip
                              key={jobId}
                              label={job ? job.title : jobId}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )
                        })}
                        {selected.length > 2 && (
                          <CustomChip
                            label={`+${selected.length - 2} more`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    )}
                  >
                    {jobs.length === 0 ? (
                      <MenuItem disabled>
                        <Typography color="text.secondary">
                          {isLoadingJobs ? "Loading jobs..." : "No job posts available"}
                        </Typography>
                      </MenuItem>
                    ) : (
                      jobs.map((job) => (
                        <MenuItem key={job.id} value={job.id}>
                          <Checkbox checked={selectedJobs.includes(job.id)} />
                          <ListItemText
                            primary={
                              <Typography fontWeight="500" fontSize="0.9rem">
                                {job.title}
                              </Typography>
                            }
                            secondary={
                              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                <Typography variant="caption">{job.company}</Typography>
                                <Typography variant="caption">•</Typography>
                                <Typography variant="caption">{job.location}</Typography>
                              </Stack>
                            }
                          />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {jobError && <FormHelperText>{jobError}</FormHelperText>}
                </StyledFormControl>
              </Grid>
            )}
          </Grid>
        </SectionCard>

        {/* Post Content Section */}
        <SectionCard>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <TextFields color="primary" />
            <Typography variant="h6" fontWeight="600">
              Post Content
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12}>
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
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
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
              startIcon={isGeneratingContent ? <CircularProgress size={16} /> : <AutoAwesome />}
              onClick={handleAIGenerate}
              disabled={
                isGeneratingContent ||
                (postType === "job" && selectedJobs.length === 0) ||
                (postType === "other" && !otherPostTitle.trim())
              }
              sx={{
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                color: "white",
              }}
            >
              {isGeneratingContent ? "Generating..." : "AI Generate"}
            </ActionButton>
          </Stack>
        </SectionCard>

        {/* AI Generated Image Templates */}
        {generatedImages.length > 0 && (
          <SectionCard sx={{ bgcolor: "primary.50" }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <Image color="primary" />
              <Typography variant="h6" fontWeight="600">
                Select Template
              </Typography>
              {selectedTemplate && (
                <CustomChip
                  label="Selected"
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
                          height: 100,
                          objectFit: "cover",
                        }}
                      />

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

                      {selectedTemplate === imageUrl && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "primary.main",
                            color: "white",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CheckCircle fontSize="small" />
                        </Box>
                      )}
                    </Box>
                  </ImageTemplateCard>
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        )}

        {/* Media Upload and Scheduling (6/6 layout) */}
    <Grid container spacing={1}>
  {/* Media Upload */}
  <Grid item xs={12} md={6}>
    <SectionCard sx={{ height: "100%" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <CloudUpload color="primary" />
        <Typography variant="h6" fontWeight="600">
          Image Upload
        </Typography>
        <CustomChip label="Images Only" size="small" color="info" variant="outlined" />
      </Stack>

      <Stack spacing={2}>
        <UploadButton component="label" startIcon={<PhotoCamera />} fullWidth>
          Upload Image
          <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
        </UploadButton>

        <Box sx={{ p: 1.5, bgcolor: "info.50", borderRadius: 1 }}>
          <Typography variant="caption" color="info.main" textAlign="center" display="block">
            Supported: JPG, PNG, GIF, WebP, SVG (Max: 10MB)
          </Typography>
        </Box>

        {mediaFile && (
          <Box sx={{ p: 2, bgcolor: "success.50", borderRadius: 1.5 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 6, height: 6, bgcolor: "success.main", borderRadius: "50%" }} />
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
    </SectionCard>
  </Grid>

  {/* Scheduling */}
  <Grid item xs={12} md={6}>
    <SectionCard sx={{ height: "100%" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Schedule color="primary" />
        <Typography variant="h6" fontWeight="600">
          Schedule
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
        {/* Schedule Form */}
        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "grey.300",
          }}
        >
          <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
            Add Schedule
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                type="date"
                label="Date"
                variant="outlined"
                fullWidth
                size="small"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                inputProps={{ min: today }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                type="time"
                label="Time"
                variant="outlined"
                fullWidth
                size="small"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <CompactButton
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={addSchedule}
              disabled={!scheduleDate || !scheduleTime}
              sx={{ flex: 1 }}
            >
              Add
            </CompactButton>
            <CompactButton
              variant="outlined"
              size="small"
              onClick={() => {
                setScheduleDate("")
                setScheduleTime("")
              }}
              disabled={!scheduleDate && !scheduleTime}
            >
              Reset
            </CompactButton>
          </Stack>

          {scheduleError && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
              {scheduleError}
            </Typography>
          )}
        </Box>

        {/* Scheduled Times List */}
        {scheduledTimes.length > 0 && (
          <Box sx={{ maxHeight: 150, overflow: "auto" }}>
            <List dense sx={{ p: 0 }}>
              {scheduledTimes.map((schedule) => (
                <ScheduleItem key={schedule.id}>
                  <ListItemIcon>
                    <Timer color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="500">
                        {schedule.displayText?.full || `${schedule.date} ${schedule.time}`}
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
      </Stack>
    </SectionCard>
  </Grid>
</Grid>

        {/* Action Buttons */}
        <SectionCard>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <ActionButton
              variant="outlined"
              startIcon={isSavingPost ? <CircularProgress size={16} /> : <Save />}
              onClick={handleDraftPost}
              disabled={
                !content?.trim() ||
                (postType === "job" && !selectedJobs.length) ||
                (postType === "other" && !otherPostTitle.trim()) ||
                selectedAccountObjects.length === 0 ||
                isSavingPost ||
                !!contentError ||
                !!accountError ||
                !!jobError ||
                !!otherPostTitleError
              }
              sx={{ minWidth: 120 }}
            >
              {isSavingPost ? "Saving..." : "Save Draft"}
            </ActionButton>

            <ActionButton
              variant="contained"
              startIcon={
                isPublishingPost ? <CircularProgress size={16} /> : scheduledTimes.length > 0 ? <Schedule /> : <Send />
              }
              onClick={handlePostNow}
              disabled={
                !content.trim() ||
                selectedAccountObjects.length === 0 ||
                (postType === "job" && selectedJobs.length === 0) ||
                (postType === "other" && !otherPostTitle.trim()) ||
                isPublishingPost ||
                !!contentError ||
                !!accountError ||
                !!jobError ||
                !!otherPostTitleError
              }
              sx={{
                minWidth: 160,
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                color: "white",
              }}
            >
              {isPublishingPost
                ? `Publishing...`
                : scheduledTimes.length > 0
                  ? `Schedule (${scheduledTimes.length})`
                  : `Publish (${selectedAccountObjects.length})`}
            </ActionButton>
          </Stack>
        </SectionCard>
      </Stack>

      {/* Full Screen Image Preview Dialog */}
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
              {selectedTemplate === expandedImage ? "Deselect" : "Select"}
            </ActionButton>
          )}
        </DialogActions>
      </FullScreenDialog>
    </Box>
  )
}
