"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Chip,
  Avatar,
  Stack,
  LinearProgress,
  Paper,
  Button,
  Drawer,
  Fade,
  Zoom,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  CardContent,
  Divider,
  Rating,
} from "@mui/material"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Warning,
  ExpandMore,
  TrendingUp,
  Psychology,
  School,
  Work,
  Code,
  People,
  Lightbulb,
  Speed,
  Assessment,
  Verified,
  ArrowUpward,
  Monitor,
  CoPresent,
  CalendarToday,
  Feedback,
  FeedbackOutlined,
  WorkspacePremium,
  Reviews,
  ContentCopy,
  StarBorder,
  CurrencyRupee,
  EmailOutlined,
  WhatsApp,
  Info,
  ArrowBack,
  Notes,
  PictureAsPdf,
  Calculate,
  Pause,
} from "@mui/icons-material"
import { Star, Person, Phone, Business, Schedule } from "@mui/icons-material"
import { KeyboardReturn } from "@mui/icons-material"
import { styled, keyframes } from "@mui/material/styles"
import Lottie from "lottie-react"
import loader from "./loader.json"
import { useApi } from "@core/hooks/useApi"
import AiChatModal from "./AiChatHistory"
import { CheckCircle, Clock, Hourglass } from "lucide-react"

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`

const GradientBox = styled(Box)(() => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "20px",
  padding: "24px",
  color: "white",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
    borderRadius: "inherit",
  },
}))

const InfoItem = ({ icon, label, value, color = "primary" }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
    <Avatar
      sx={{
        width: 37,
        height: 37,
        bgcolor: "#2a73e8",
        color: `white`,
      }}
    >
      {icon}
    </Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
        {value || "Not specified"}
      </Typography>
    </Box>
  </Box>
)

const StyledCard1 = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
  animation: `${fadeIn} 0.5s ease-out forwards`,
}))

const TabPanel = ({ children, value, index, ...other }) => (
  <Box role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
    {value === index && (
      <Fade in timeout={300}>
        <Box>{children}</Box>
      </Fade>
    )}
  </Box>
)

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
  transition: "box-shadow 0.2s ease",
  "&:hover": {
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  animation: `${fadeIn} 0.5s ease-out forwards`,
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "#111827",
  marginBottom: theme.spacing(2),
  fontSize: "18px",
  fontFamily: '"Inter", sans-serif',
}))

const SkillChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#eff6ff",
  color: "#1e40af",
  fontWeight: 500,
  fontSize: "12px",
  height: "28px",
  borderRadius: "6px",
  "&:hover": {
    backgroundColor: "#dbeafe",
  },
}))

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  animation: `${fadeIn} 0.5s ease-out forwards`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
  },
}))

const toTitleCase = (str = "") =>
  str.replace(/_/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())

const ScoreCircle = styled(Box)(({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return "#10b981" // Green
    if (score >= 70) return "#3b82f6" // Blue
    if (score >= 50) return "#f59e0b" // Yellow/Orange
    return "#ef4444" // Red
  }
  return {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: `conic-gradient(${getScoreColor(score)} ${score}%, #e2e8f0 0%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 0 15px ${getScoreColor(score)}40`,
    "&::before": {
      content: '""',
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: "50%",
      background: "#ffffff",
    },
    "&:hover": {
      animation: `${pulse} 1s ease infinite`,
    },
  }
})

const ProgressBar = styled(LinearProgress)(({ value }) => {
  const getProgressColor = (value) => {
    if (value >= 90) return "#10b981" // Green
    if (value >= 70) return "#3b82f6" // Blue
    if (value >= 50) return "#f59e0b" // Yellow/Orange
    return "#ef4444" // Red
  }
  return {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f1f5f9",
    "& .MuiLinearProgress-bar": {
      backgroundColor: getProgressColor(value),
      borderRadius: 5,
    },
  }
})

const InterviewCard = ({
  candidate,
  setOpenDrawerFeedback,
  setSelectedCandidate,
  setSelectedInterview,
  handleShowChat,
}) => {
  let formattedDate = ""
  let formattedTime = ""
  if (candidate.roundName === "AI Round") {
    // Parse ISO string and avoid timezone conversion
    const rawDate = candidate?.scheduleDate || ""
    const [datePart, timePart] = rawDate.split("T")
    const [year, month, day] = datePart.split("-")
    const [hour, minute] = timePart.split(":")
    const monthShort = new Date(rawDate).toLocaleString("en-IN", { month: "short" })
    formattedDate = `${day}-${monthShort}-${year}`
    formattedTime = new Date(`1970-01-01T${hour}:${minute}:00`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  } else {
    const schedule = new Date(candidate?.scheduleDate || "")
    formattedDate = schedule.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    formattedTime = schedule.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    if (candidate?.scheduleLink) {
      navigator.clipboard.writeText(candidate.scheduleLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500) // Reset after 1.5s
    }
  }

  return (
    <Card sx={{ width: "100%", borderRadius: "12px", border: "1px solid #e0e0e0", mb: 4, boxShadow: "none" }}>
      <CardContent sx={{ padding: "20px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CheckCircle color="#037847" size={26} />
            <Stack>
              <Typography
                fontSize={20}
                fontWeight={600}
                sx={{ display: "flex", alignItems: "center", color: "#101828" }}
              >
                Round {candidate?.roundNumber} {toTitleCase(candidate?.roundName)}
              </Typography>
              <Typography fontSize={14} fontWeight={500} sx={{ color: "#667085" }} gutterBottom>
                {toTitleCase(candidate?.candidateId?.name)} - {toTitleCase(candidate?.candidateId?.position)}
              </Typography>
            </Stack>
          </Box>
          <Typography
            fontSize={16}
            fontWeight={600}
            sx={{ backgroundColor: "#037847", color: "#FFFFFF", padding: "6px 10px", borderRadius: "20px" }}
          >
            {toTitleCase(candidate?.status)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <Stack>
            <Typography fontSize={16} fontWeight={500} sx={{ color: "#667085" }} display="flex" alignItems="center">
              Interviewer Name
            </Typography>
            <Typography
              fontSize={15}
              fontWeight={600}
              sx={{ color: "#344054" }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <CoPresent size={20} sx={{ color: "#757575" }} /> {toTitleCase(candidate?.interviewerId?.employeName)}
            </Typography>
          </Stack>
          <Stack>
            <Typography fontSize={16} fontWeight={500} sx={{ color: "#667085" }} display="flex" alignItems="center">
              Date
            </Typography>
            <Typography
              fontSize={15}
              fontWeight={600}
              sx={{ color: "#344054" }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <CalendarToday fontSize="small" sx={{ color: "#757575" }} /> {formattedDate}
            </Typography>
          </Stack>
          <Stack>
            <Typography fontSize={16} fontWeight={500} sx={{ color: "#667085" }} display="flex" alignItems="center">
              Time
            </Typography>
            <Typography
              fontSize={15}
              fontWeight={600}
              sx={{ color: "#344054" }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Clock size={20} sx={{ color: "#757575" }} /> {formattedTime}
            </Typography>
          </Stack>
          <Stack>
            <Typography fontSize={16} fontWeight={500} sx={{ color: "#667085" }} display="flex" alignItems="center">
              Duration
            </Typography>
            <Typography
              fontSize={15}
              fontWeight={600}
              sx={{ color: "#344054" }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Hourglass size={20} sx={{ color: "#757575" }} /> {candidate?.durationMinutes} Minutes
            </Typography>
          </Stack>
          <Stack>
            <Typography fontSize={16} fontWeight={500} sx={{ color: "#667085" }}>
              Interview Type
            </Typography>
            <Typography
              fontSize={15}
              fontWeight={600}
              sx={{ color: "#344054" }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <CoPresent size={20} sx={{ color: "#757575" }} /> {candidate?.interviewType}
            </Typography>
          </Stack>
          <Stack>
            <Typography fontSize={16} fontWeight={500} sx={{ color: "#667085" }}>
              Interview Mode
            </Typography>
            <Typography
              fontSize={15}
              fontWeight={600}
              sx={{ color: "#344054" }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <CoPresent size={20} sx={{ color: "#757575" }} />
              {candidate?.interviewModel}
              {candidate?.interviewModel?.toLowerCase() === "ai" && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleShowChat(candidate.AIInterviewId, candidate.videoUrl)}
                  sx={{
                    ml: 2,
                    px: 2.5,
                    py: 1,
                    fontWeight: 600,
                    borderRadius: "12px",
                    // textTransform: "none",
                    borderColor: "black",
                    background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                    color: "white",
                    "&:hover": {
                     background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                    //   color: "black",
                      borderColor: "black",
                    },
                  }}
                >
                  Show Details
                </Button>
              )}
            </Typography>
          </Stack>
        </Box>
        <Divider sx={{ color: "#DDDDDD" }} />
        {candidate?.interviewType === "Online" && (
          <>
            <Box sx={{ my: 2, width: "40%" }}>
              <Stack>
                <Typography fontSize={15} fontWeight={500} sx={{ color: "#667085" }} display="flex" alignItems="center">
                  Meet Link
                </Typography>
                <Stack sx={{ display: "flex", alignItems: "center", gap: 1, flexDirection: "row" }}>
                  <Typography
                    fontSize={14}
                    fontWeight={600}
                    sx={{ color: candidate?.scheduleLink ? "#1976d2" : "#e57373", wordBreak: "break-all", flex: 1 }}
                  >
                    {candidate?.scheduleLink || "Meet Link Not Found"}
                  </Typography>
                  {candidate?.scheduleLink && (
                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                      <IconButton onClick={handleCopy} size="small">
                        {copied ? (
                          <CheckCircle fontSize="small" sx={{ color: "green" }} />
                        ) : (
                          <ContentCopy fontSize="small" sx={{ color: "#757575" }} />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>
            </Box>
            <Divider sx={{ color: "#DDDDDD" }} />
          </>
        )}
        {candidate?.interviewType === "Call" && (
          <>
            <Box sx={{ my: 2, width: "100%" }}>
              <Stack spacing={1}>
                <Typography fontSize={15} fontWeight={500} sx={{ color: "#667085" }}>
                  Call Detail
                </Typography>
                {candidate?.callResult ? (
                  <Stack spacing={1}>
                    <Typography fontSize={14} fontWeight={500} sx={{ color: "#667085" }}>
                      Call Status –{" "}
                      {candidate?.callResult?.callStatus === "caller_no_answer"
                        ? "Caller didn't answer"
                        : candidate?.callResult?.callStatus === "agent_no_answer"
                          ? "Agent didn't Answer"
                          : candidate?.callResult?.callStatus === "Answered"
                            ? "Answered"
                            : "Not Found"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Typography fontSize={14} fontWeight={500} sx={{ color: "#667085", mb: 0.5 }}>
                        Call Recording:
                      </Typography>
                      {candidate?.callResult?.recordingUrl ? (
                        <audio
                          controls
                          src={candidate?.callResult?.recordingUrl}
                          style={{ width: "30%", height: "30px" }}
                        />
                      ) : (
                        <Typography fontSize={14} fontWeight={500} sx={{ color: "#667085" }}>
                          Recording Not Found
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                ) : (
                  <Typography fontSize={15} fontWeight={500} sx={{ color: "#667085" }}>
                    Call Pending
                  </Typography>
                )}
              </Stack>
            </Box>
            <Divider sx={{ color: "#DDDDDD" }} />
          </>
        )}
        {candidate?.status === "complete" ? (
          <Box sx={{ mt: 3 }}>
            <Typography
              fontSize={18}
              fontWeight={600}
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 2, color: "#101828" }}
            >
              <Feedback size={20} sx={{ color: "#FFD700" }} /> Interview Feedback
            </Typography>
            {/* Feedback Container */}
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {/* Left Column: Comments */}
              <Stack sx={{ minWidth: "200px", flex: "1 1 25%" }}>
                <Typography fontSize={15} fontWeight={500} sx={{ color: "#101828" }}>
                  Details Comment
                </Typography>
                <Typography fontSize={14} fontWeight={500} sx={{ color: "#667085" }}>
                  {toTitleCase(candidate?.feedback) || "Not Found"}
                </Typography>
              </Stack>
              {/* Right Column: Grid layout for skills */}
              <Grid container spacing={2} sx={{ flex: "1 1 70%" }}>
                {candidate?.skillsFeedback?.length > 0 &&
                  candidate?.skillsFeedback.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                      <Stack>
                        <Typography fontSize={14} fontWeight={500} sx={{ color: "#667085" }}>
                          {item?.criteria}
                        </Typography>
                        <Typography
                          fontSize={17}
                          fontWeight={600}
                          gutterBottom
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color:
                              item?.score >= 4 ? "#4caf50" : item?.score === 3 || item?.score === 2 ? "#F3BB1B" : "red",
                          }}
                        >
                          <StarBorder
                            sx={{
                              color:
                                item?.score >= 4
                                  ? "#4caf50"
                                  : item?.score === 3 || item?.score === 2
                                    ? "#F3BB1B"
                                    : "red",
                            }}
                          />
                          {item?.score}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Typography
              fontSize={18}
              fontWeight={600}
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 2, color: "#101828" }}
            >
              <Feedback size={20} sx={{ color: "#FFD700" }} /> Interview Feedback
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                padding: 1,
                borderRadius: 2,
                backgroundColor: "#f9fafb",
              }}
            >
              <Typography fontSize={16} fontWeight={600} sx={{ color: "#1f2937" }}>
                Provide Feedback
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FeedbackOutlined />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 500,
                  paddingX: 3,
                  color: "blue",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDrawerFeedback(true)
                  setSelectedCandidate(candidate?.candidateId)
                  setSelectedInterview(candidate)
                }}
              >
                Feedback
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// Main Component
export default function AiScreeningDashboard({ screeningData }) {
  const [tabValue, setTabValue] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"))
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const mode = searchParams.get("mode")
  const status = searchParams.get("status")
  const router = useRouter()
  const [candidateData, setCandidateData] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState("")
  const [updatedStatus, setUpdatedStatus] = useState("")
  const [remark, setRemark] = useState("")
  const [statusChangeModal, setStatusChangeModal] = useState(false)
  const { callApi } = useApi()
  const [cardMode, setCardMode] = useState("normal")
  const [resumeStatus, setResumeStatus] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState()
  const [openDrawerFeedback, setOpenDrawerFeedback] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedChatAIInterviewId, setSelectedChatAIInterviewId] = useState(null)
  const [selectedChatVideoUrl, setSelectedChatVideoUrl] = useState(null)

  const handleShowChat = (aiInterviewId, videoUrl) => {
    setSelectedChatAIInterviewId(aiInterviewId)
    setSelectedChatVideoUrl(videoUrl)
    setChatOpen(true)
  }
  const handleCloseChat = () => setChatOpen(false)

  const [feedback, setFeedBack] = useState({
    feedback: "",
    skillsFeedback: "",
    interviewfeedbackStatus: "",
  })
  const [selectInterview, setSelectedInterview] = useState("")
  const [candidateInterviewData, setCandidateInterviewData] = useState({})

  const getcandidateData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${baseUrl}/v1/api/job/getJobAppliedById/${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setCandidateData(res.data.items)
      setResumeStatus(res.data.items?.resumeShortlisted)
      setCardMode("normal")
      if (res.data.items.AI_Screeing_Status === "Completed") {
        const res = await axios.get(`${baseUrl}/v1/api/job/viewAnalizedata/${id}`, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })
        setCardMode("ai")
        setCandidateData(res.data.items)
      }
    } catch (error) {
      console.error("Error fetching ID setup:", error)
    } finally {
      setLoading(false)
    }
  }

  // Animation delay for staggered entrance
  const [animationVisible, setAnimationVisible] = useState(false)
  useEffect(() => {
    setAnimationVisible(true)
  }, [])

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A" // or return "-" or any placeholder
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getScheduledCanidates = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/interview/allInterViewDetail?candidateId=${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setCandidateInterviewData(res.data.items?.interviewDetails)
    } catch (error) {
      console.error("Error fetching ID setup:", error)
    }
  }

  useEffect(() => {
    getcandidateData()
    getScheduledCanidates()
  }, [id])

  const getSkillsCriteria = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/jobPost/getDetail?jobPostId=${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      if (res.data.status) {
        setFeedBack((prev) => ({
          ...prev,
          skillsFeedback: res.data.items?.screeningCriteria
            ? res.data.items.screeningCriteria
                .filter((item) => item.weight > 0)
                .map((i) => ({
                  criteria: i.name,
                  score: 0,
                }))
            : [],
        }))
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    getSkillsCriteria(selectedCandidate?.jobPostId)
  }, [selectedCandidate])

  const handleRatingChange = (newValue, criteria) => {
    setFeedBack((prev) => ({
      ...prev,
      skillsFeedback: prev.skillsFeedback.map((item) =>
        item.criteria === criteria
          ? {
              ...item,
              score: newValue,
            }
          : item,
      ),
    }))
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/interview/update?id=${selectInterview?._id}`,
        {
          ...feedback,
          status: "complete",
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if (res.data.status) {
        setSelectedCandidate({})
        setFeedBack({
          feedback: "",
          skillsFeedback: "",
        })
        setOpenDrawerFeedback(false)
        getScheduledCanidates()
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  // Get icon for criteria
  const getCriteriaIcon = (criteria) => {
    const criteriaLower = criteria?.toLowerCase()
    if (criteriaLower?.includes("skill")) return <Code />
    if (criteriaLower?.includes("experience")) return <Work />
    if (criteriaLower?.includes("education")) return <School />
    if (criteriaLower?.includes("cultural") || criteriaLower?.includes("fit")) return <People />
    if (criteriaLower?.includes("learning")) return <Lightbulb />
    if (criteriaLower?.includes("leadership") || criteriaLower?.includes("initiative")) return <TrendingUp />
    if (criteriaLower?.includes("communication")) return <Assessment />
    if (criteriaLower?.includes("project")) return <Psychology />
    if (criteriaLower?.includes("certification")) return <Verified />
    return <Assessment />
  }

  // Determine decision color
  const getDecisionColor = (decision) => {
    if (decision === "Approved") return "success"
    if (decision === "Rejected") return "error"
    if (decision === "shortlisted") return "success"
    if (decision === "notshortlisted") return "error"
    return "warning" // For "Under Review" or other statuses
  }

  const handleResumeShorlisted = async () => {
    try {
      const response = await callApi({
        endpoint: `/v1/api/candidate/resumeShortlisted `,
        method: "POST",
        data: {
          ids: [selectedCandidateId],
          resumeShortlisted: updatedStatus,
          Remark: remark,
        },
        disableSnackbar: false,
      })
      if (response.success) {
        getcandidateData()
        setSelectedCandidateId("")
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setSelectedCandidateId("")
      setStatusChangeModal(false)
      setUpdatedStatus("")
      setRemark("")
    }
  }

  const NavigationButtons = ({ onBack }) => {
    return (
      <Box display="flex" justifyContent="space-between" mt={4} gap={2} flexWrap="wrap">
        {/* Back Button */}
        <Button
          variant="outlined"
          startIcon={<KeyboardReturn />}
          onClick={onBack}
          sx={{
            color: "#374151",
            borderColor: "#cbd5e1",
            "&:hover": {
              borderColor: "#94a3b8",
              backgroundColor: "#f1f5f9",
            },
          }}
        >
          Back
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      {loading ? (
        <Box>
          <Lottie animationData={loader} style={{ height: 200 }} />
        </Box>
      ) : cardMode === "ai" ? (
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mb: 4,
              gap: 2,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  fontWeight="800"
                  sx={{
                    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}
                >
                  AI Screening Analysis
                </Typography>
                <NavigationButtons
                  onBack={() => {
                    mode === "app"
                      ? router.push("/JobApplications?stage=2&mode=interview")
                      : router.push("/InterviewMonitor")
                  }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary">
                {candidateData?.position} • {candidateData?.department} • Analyzed{" "}
                {formatDate(candidateData?.createdAt)}
              </Typography>
            </Box>
          </Box>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Overall Score Card */}
            <Grid item xs={12} md={4}>
              <StyledCard sx={{ p: { xs: 2, md: 3 }, height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ mb: { xs: 1, md: 2 }, fontSize: { xs: "1rem", md: "1.25rem" } }}
                  >
                    Overall Match Score
                  </Typography>
                  <Box sx={{ position: "relative", mb: { xs: 1, md: 2 } }}>
                    <ScoreCircle score={candidateData?.overallScore}>
                      <Box sx={{ position: "relative", zIndex: 1 }}>
                        <Typography variant="h3" fontWeight="800" color="primary">
                          {candidateData?.overallScore}%
                        </Typography>
                      </Box>
                    </ScoreCircle>
                  </Box>
                  <Typography variant="h6" my={3} fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                    Qualification Threshold: {candidateData?.qualificationThreshold}%
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      alignItems: "center",
                      justifyContent: "center",
                      gap: { xs: 2, md: 4 },
                      width: "100%",
                      mb: { xs: 2, md: 4 },
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        fontWeight="500"
                        sx={{ mb: { xs: 1, md: 2 }, fontSize: { xs: "0.875rem", md: "1rem" } }}
                      >
                        AI Screening Result
                      </Typography>
                      <Chip
                        icon={candidateData?.decision === "Approved" ? <CheckCircle /> : <Warning />}
                        label={candidateData?.decision === "Approved" ? "Recommended" : "Not Recommended"}
                        color={getDecisionColor(candidateData?.decision)}
                        sx={{ fontWeight: "bold", px: 1, fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                      />
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        fontWeight="500"
                        sx={{ mb: { xs: 1, md: 2 }, fontSize: { xs: "0.875rem", md: "1rem" } }}
                      >
                        Resume Status
                      </Typography>
                      <Chip
                        icon={
                          resumeStatus === "shortlisted" ? (
                            <CheckCircle />
                          ) : resumeStatus === "active" ? (
                            <Pause />
                          ) : (
                            <Warning />
                          )
                        }
                        label={
                          resumeStatus === "shortlisted"
                            ? "Approved"
                            : resumeStatus === "active"
                              ? "Pending"
                              : "Rejected"
                        }
                        color={getDecisionColor(resumeStatus)}
                        sx={{ fontWeight: "bold", px: 1, fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                      />
                    </Box>
                  </Box>
                </Box>
              </StyledCard>
            </Grid>
            {/* Candidate Info Card */}
            <Grid item xs={12} md={4}>
              <StyledCard1>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 2, md: 3 },
                    color: "#1e1b4b", // Deep indigo for elegance
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    textAlign: "center",
                    fontSize: "1.1rem",
                    background: "linear-gradient(to right, #1e1b4b, #3b82f6)", // Gradient text
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Candidate Profile
                </Typography>
                <Paper
                  elevation={2}
                  sx={{
                    p: { xs: 2, md: 4 },
                    bgcolor: "rgba(230, 244, 255, 0.8)", // Soft slate background
                    borderRadius: 3,
                    border: "1px solid #3b67df",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3b67df",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box component="span" sx={{ color: "#173a9a" }}>
                        Name:
                      </Box>
                      {candidateData?.userInfo?.name || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3b67df",
                        fontSize: "0.9rem",
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        "&:hover .email-icon": {
                          color: "#3b82f6", // Blue on hover
                          transform: "scale(1.2)", // Slight icon zoom
                          transition: "all 0.2s ease",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        const width = 600
                        const height = 700
                        const left = window.innerWidth / 2 - width / 2 + window.screenX
                        const top = window.innerHeight / 2 - height / 2 + window.screenY
                        const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${candidateData?.userInfo?.email}&tf=1`
                        window.open(
                          url,
                          "gmailComposeWindow",
                          `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`,
                        )
                      }}
                    >
                      <EmailOutlined className="email-icon" sx={{ fontSize: 18, color: "#173a9a" }} />
                      <Box component="span" sx={{ color: "#173a9a" }}>
                        Email:
                      </Box>
                      {candidateData?.userInfo?.email || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3b67df",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        "&:hover .whatsapp-icon": {
                          color: "#22c55e", // Green on hover
                          transform: "scale(1.2)",
                          transition: "all 0.2s ease",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        const width = 500
                        const height = 600
                        const left = window.innerWidth / 2 - width / 2 + window.screenX
                        const top = window.innerHeight / 2 - height / 2 + window.screenY
                        const url = `https://wa.me/${candidateData?.userInfo?.mobile}`
                        window.open(
                          url,
                          "whatsappPopup",
                          `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`,
                        )
                      }}
                    >
                      <WhatsApp className="whatsapp-icon" sx={{ fontSize: 18, color: "#173a9a" }} />
                      <Box component="span" sx={{ color: "#173a9a" }}>
                        Mobile:
                      </Box>
                      {candidateData?.userInfo?.mobile || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3b67df",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box component="span" sx={{ color: "#173a9a" }}>
                        Position:
                      </Box>
                      {candidateData?.userInfo?.position || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3b67df",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box component="span" sx={{ color: "#173a9a" }}>
                        Experience By AI:
                      </Box>
                      {candidateData?.CandidateAIExperince <= 0
                        ? "Fresher"
                        : candidateData?.CandidateAIExperince
                          ? `${candidateData?.CandidateAIExperince} Years`
                          : "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3b67df",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box component="span" sx={{ color: "#173a9a" }}>
                        Job Type:
                      </Box>
                      {candidateData?.userInfo?.JobType || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3b67df",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box component="span" sx={{ color: "#173a9a" }}>
                        Current CTC:
                      </Box>
                      {candidateData?.userInfo?.currentCTC || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3b67df",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box component="span" sx={{ color: "#173a9a" }}>
                        Expected CTC:
                      </Box>
                      {candidateData?.userInfo?.expectedCTC || "N/A"}
                    </Typography>
                  </Box>
                </Paper>
              </StyledCard1>
            </Grid>
            {/* AI Metrics Card */}
            <Grid item xs={12} md={4}>
              <StyledCard sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  AI Analysis Metrics
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <ProgressBar variant="determinate" value={candidateData?.AI_Confidence} />
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Analysis Accuracy
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {candidateData?.Accuracy}%
                      </Typography>
                    </Box>
                    <ProgressBar variant="determinate" value={candidateData?.Accuracy} />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Speed color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Processing Speed:
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {candidateData?.AI_Processing_Speed} seconds
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="h6" fontWeight="600" sx={{ mt: 5, mb: 3 }}>
                  AI Recommendation
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "#f0f9ff",
                    borderRadius: 2,
                    border: "1px solid #bae6fd",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontStyle: "italic", color: "#0369a1" }}>
                    "{candidateData?.recommendation}"
                  </Typography>
                </Paper>
              </StyledCard>
            </Grid>
          </Grid>
          {/* Tabs Navigation */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                },
              }}
            >
              <Tab icon={<Notes />} label="Job Description" iconPosition="start" />
              <Tab icon={<PictureAsPdf />} label="Resume" iconPosition="start" />
              {!candidateData.AI_Screeing_Status && (
                <Tab icon={<Assessment />} label="Criteria Breakdown" iconPosition="start" />
              )}
              {!candidateData.AI_Screeing_Status && (
                <Tab icon={<Calculate />} label="Diagnostics" iconPosition="start" />
              )}
              <Tab icon={<Monitor />} iconPosition="start" label="Interviews" />
            </Tabs>
          </Box>
          {/* Tab Content */}
          <TabPanel value={tabValue} index={0}>
            <InfoCard sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                {/* Job Summary */}
                <Box sx={{ mb: 5 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: "#374151", fontSize: "16px" }}>
                    Job Summary
                  </Typography>
                  <Paper sx={{ p: 2.5, bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6, color: "#4b5563", fontSize: "14px" }}>
                      {candidateData?.jobdescription?.JobSummary || "Job summary not available"}
                    </Typography>
                  </Paper>
                </Box>
                {/* Roles and Responsibilities */}
                <Box sx={{ mb: 5 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: "#374151", fontSize: "16px" }}>
                    Roles and Responsibilities
                  </Typography>
                  <Paper sx={{ p: 2.5, bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
                    {(candidateData?.jobdescription?.responsibilities || []).length > 0 ? (
                      <Stack spacing={1.5}>
                        {candidateData?.jobdescription?.responsibilities.map((role, index) => (
                          <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                            <CheckCircle sx={{ color: "#10b981", fontSize: 16, mt: 0.2 }} />
                            <Typography variant="body2" sx={{ lineHeight: 1.5, color: "#4b5563", fontSize: "14px" }}>
                              {role}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="#9ca3af" sx={{ fontSize: "14px" }}>
                        Roles and responsibilities not specified
                      </Typography>
                    )}
                  </Paper>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: "#374151", fontSize: "16px" }}>
                    Key Skills Required
                  </Typography>
                  <Paper sx={{ p: 2.5, bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
                    {(candidateData?.jobdescription?.keySkills || []).length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {candidateData?.jobdescription?.keySkills.map((skill, index) => (
                          <SkillChip key={index} label={skill} icon={<Star sx={{ fontSize: 14 }} />} />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="#9ca3af" sx={{ fontSize: "14px" }}>
                        Key skills not specified
                      </Typography>
                    )}
                  </Paper>
                </Box>
              </CardContent>
            </InfoCard>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {candidateData?.resume ? (
              <Box sx={{ height: "700px", border: "1px solid #ccc" }}>
                <iframe
                  src={candidateData.resume}
                  title="Resume PDF"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No Resume Available
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <StyledCard>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
                  Evaluation Criteria Breakdown
                </Typography>
                <Grid container spacing={3}>
                  {candidateData?.criteria &&
                    candidateData?.criteria.map((criterion, index) => (
                      <Grid item xs={12} md={6} lg={4} key={index}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            border: "1px solid #e2e8f0",
                            height: "100%",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                            },
                            animation: `${fadeIn} 0.5s ease-out forwards ${index * 0.1}s`,
                            opacity: animationVisible ? 1 : 0,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor:
                                  criterion.score >= 90
                                    ? "#dcfce7"
                                    : criterion.score >= 70
                                      ? "#dbeafe"
                                      : criterion.score >= 50
                                        ? "#fef3c7"
                                        : "#fee2e2",
                                color:
                                  criterion.score >= 90
                                    ? "#10b981"
                                    : criterion.score >= 70
                                      ? "#3b82f6"
                                      : criterion.score >= 50
                                        ? "#f59e0b"
                                        : "#ef4444",
                              }}
                            >
                              {getCriteriaIcon(criterion.criteria)}
                            </Avatar>
                            <Typography variant="h6" fontWeight="600">
                              {criterion.criteria}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Score
                              </Typography>
                              <Typography variant="body2" fontWeight="600">
                                {criterion.score}%
                              </Typography>
                            </Box>
                            <ProgressBar variant="determinate" value={criterion.score} />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {criterion.reason}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </StyledCard>
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Paper sx={{ bgcolor: "white", px: 3, animation: `${fadeIn} 0.5s ease-out forwards` }}>
              {candidateData?.acceptReason && candidateData?.acceptReason?.length > 0 && (
                <StyledCard>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
                      Candidate Strengths
                    </Typography>
                    <Grid container spacing={3}>
                      {candidateData.acceptReason.map((reason, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              borderRadius: 2,
                              border: "1px solid #e2e8f0",
                              borderLeft: "4px solid #10b981",
                              height: "100%",
                              animation: `${fadeIn} 0.5s ease-out forwards ${index * 0.1}s`,
                              opacity: animationVisible ? 1 : 0,
                            }}
                          >
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                              <Typography variant="h6" fontWeight="600">
                                {reason.point}
                              </Typography>
                              <Chip
                                label={reason.weight}
                                size="small"
                                sx={{
                                  bgcolor:
                                    reason.weight === "High"
                                      ? "#dcfce7"
                                      : reason.weight === "Medium"
                                        ? "#dbeafe"
                                        : "#f1f5f9",
                                  color:
                                    reason.weight === "High"
                                      ? "#10b981"
                                      : reason.weight === "Medium"
                                        ? "#3b82f6"
                                        : "#64748b",
                                  fontWeight: "600",
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {reason.description}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <ArrowUpward sx={{ color: "#10b981", fontSize: 18 }} />
                              <Typography variant="body2" fontWeight="600" color="#10b981">
                                {reason.percentage} Match
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </StyledCard>
              )}
              {(candidateData?.rejectReason && candidateData?.rejectReason?.length > 0) ||
              (candidateData?.improvementSuggestions && candidateData?.improvementSuggestions?.length > 0) ? (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                  {/* Improvement Suggestions */}
                  {candidateData?.improvementSuggestions && candidateData?.improvementSuggestions?.length > 0 && (
                    <Grid item xs={12} md={candidateData?.rejectReason?.length > 0 ? 6 : 12}>
                      <StyledCard>
                        <Box sx={{ p: 3 }}>
                          <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
                            Improvement Suggestions
                          </Typography>
                          <Stack spacing={2}>
                            {candidateData.improvementSuggestions.map((suggestion, index) => (
                              <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  border: "1px solid #e2e8f0",
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 2,
                                  animation: `${fadeIn} 0.5s ease-out forwards ${index * 0.1}s`,
                                  opacity: animationVisible ? 1 : 0,
                                }}
                              >
                                <Lightbulb sx={{ color: "#f59e0b", mt: 0.5 }} />
                                <Typography variant="body1">{suggestion}</Typography>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      </StyledCard>
                    </Grid>
                  )}
                  {/* Reject Reasons */}
                  {candidateData?.rejectReason && candidateData?.rejectReason?.length > 0 && (
                    <Grid item xs={12} md={candidateData?.improvementSuggestions?.length > 0 ? 6 : 12}>
                      <StyledCard>
                        <Box sx={{ p: 3 }}>
                          <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
                            Focus Areas
                          </Typography>
                          <Stack spacing={2}>
                            {candidateData.rejectReason.map((reason, index) => (
                              <Accordion
                                key={index}
                                elevation={0}
                                sx={{
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "8px !important",
                                  "&:before": { display: "none" },
                                  mb: 1,
                                  animation: `${fadeIn} 0.5s ease-out forwards ${index * 0.1}s`,
                                  opacity: animationVisible ? 1 : 0,
                                }}
                              >
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Chip
                                      label={reason.impact || "Medium"}
                                      size="small"
                                      sx={{
                                        bgcolor:
                                          reason.impact === "High"
                                            ? "#fee2e2"
                                            : reason.impact === "Medium"
                                              ? "#fef3c7"
                                              : "#f1f5f9",
                                        color:
                                          reason.impact === "High"
                                            ? "#ef4444"
                                            : reason.impact === "Medium"
                                              ? "#f59e0b"
                                              : "#64748b",
                                        fontWeight: "600",
                                      }}
                                    />
                                    <Typography variant="subtitle1" fontWeight="600">
                                      {reason.point}
                                    </Typography>
                                  </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {reason.description}
                                  </Typography>
                                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body2" fontWeight="600">
                                      Match: {reason.percentage}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="600">
                                      Weight: {reason.weight}
                                    </Typography>
                                  </Box>
                                </AccordionDetails>
                              </Accordion>
                            ))}
                          </Stack>
                        </Box>
                      </StyledCard>
                    </Grid>
                  )}
                  {/* Show message if neither exists */}
                  {!(
                    (candidateData?.rejectReason && candidateData?.rejectReason?.length > 0) ||
                    (candidateData?.improvementSuggestions && candidateData?.improvementSuggestions?.length > 0)
                  ) && (
                    <Grid item xs={12}>
                      <Alert severity="info" icon={<Info />}>
                        No improvement areas or suggestions have been identified for this candidate.
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info" icon={<Info />}>
                    No improvement areas or suggestions have been identified for this candidate.
                  </Alert>
                </Grid>
              )}
              {candidateData?.riskFactors && candidateData?.riskFactors.length > 0 && (
                <StyledCard sx={{ mt: 3 }}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
                      Risk Assessment
                    </Typography>
                    <Grid container spacing={3}>
                      {candidateData.riskFactors.map((risk, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              borderRadius: 2,
                              border: "1px solid #e2e8f0",
                              borderLeft: `4px solid ${
                                risk.level === "High" ? "#ef4444" : risk.level === "Medium" ? "#f59e0b" : "#64748b"
                              }`,
                              animation: `${fadeIn} 0.5s ease-out forwards ${index * 0.1}s`,
                              opacity: animationVisible ? 1 : 0,
                            }}
                          >
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ mb: { xs: 2, md: 0 } }}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Risk Factor
                                  </Typography>
                                  <Typography variant="h6" fontWeight="600">
                                    {risk.factor}
                                  </Typography>
                                  <Chip
                                    label={risk.level}
                                    size="small"
                                    sx={{
                                      mt: 1,
                                      bgcolor:
                                        risk.level === "High"
                                          ? "#fee2e2"
                                          : risk.level === "Medium"
                                            ? "#fef3c7"
                                            : "#f1f5f9",
                                      color:
                                        risk.level === "High"
                                          ? "#ef4444"
                                          : risk.level === "Medium"
                                            ? "#f59e0b"
                                            : "#64748b",
                                      fontWeight: "600",
                                    }}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Description
                                </Typography>
                                <Typography variant="body2">{risk.description}</Typography>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Mitigation Strategy
                                </Typography>
                                <Typography variant="body2">{risk.mitigation}</Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </StyledCard>
              )}
            </Paper>
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <Paper sx={{ bgcolor: "white", p: 4, animation: `${fadeIn} 0.5s ease-out forwards` }}>
              {Array.isArray(candidateInterviewData) &&
                candidateInterviewData?.map((item, index) => (
                  <InterviewCard
                    key={index}
                    candidate={item}
                    setOpenDrawerFeedback={setOpenDrawerFeedback}
                    setSelectedCandidate={setSelectedCandidate}
                    setSelectedInterview={setSelectedInterview}
                    handleShowChat={handleShowChat}
                  />
                ))}
            </Paper>
          </TabPanel>
        </Container>
      ) : (
        <Container maxWidth="xl">
          {/* Header Section */}
          <Fade in timeout={500}>
            <Box sx={{ width: "100%", mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  fontWeight="700"
                  sx={{
                    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}
                >
                  Candidate Profile
                </Typography>
                <NavigationButtons onBack={() => router.push("/JobApplications?stage=2")} />
              </Box>
              <Typography fontSize={15} color="text.secondary">
                {candidateData?.position} • {candidateData?.department?.name} • Applied on{" "}
                {formatDate(candidateData?.createdAt)}
              </Typography>
            </Box>
          </Fade>
          {/* Enhanced Candidate Info Card */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Zoom in timeout={600}>
                <StyledCard sx={{ overflow: "hidden" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                      {/* Personal Information */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 3, color: "#2a73e8", fontWeight: 600 }}>
                          Personal Details
                        </Typography>
                        <Stack spacing={2}>
                          <InfoItem icon={<Person />} label="Full Name" value={candidateData?.name} />
                          <InfoItem icon={<EmailOutlined />} label="Email Address" value={candidateData?.emailId} />
                          <InfoItem icon={<Phone />} label="Mobile Number" value={candidateData?.mobileNumber} />
                          <InfoItem icon={<Work />} label="Position" value={candidateData?.position} />
                        </Stack>
                      </Grid>
                      {/* Professional Information */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 3, color: "secondary.main", fontWeight: 600 }}>
                          Professional Details
                        </Typography>
                        <Stack spacing={2}>
                          <InfoItem
                            icon={<Business />}
                            label="Last Organization"
                            value={candidateData?.lastOrganization?.join(", ")}
                            color="success"
                          />
                          <InfoItem
                            icon={<Schedule />}
                            label="Job Type"
                            value={candidateData?.JobType}
                            color="secondary"
                          />
                          <InfoItem
                            icon={<CurrencyRupee />}
                            label="Current CTC"
                            value={candidateData?.currentCTC}
                            color="secondary"
                          />
                          <InfoItem
                            icon={<CurrencyRupee />}
                            label="Expected CTC"
                            value={candidateData?.expectedCTC}
                            color="secondary"
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                    {/* Status Section */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Selection Status
                      </Typography>
                      <Chip
                        label={
                          candidateData?.resumeShortlisted === "active"
                            ? "Pending Review"
                            : candidateData?.resumeShortlisted
                        }
                        color={candidateData?.resumeShortlisted === "active" ? "warning" : "success"}
                        size="large"
                        sx={{ fontWeight: 600, px: 2 }}
                      />
                    </Box>
                  </CardContent>
                </StyledCard>
              </Zoom>
            </Grid>
          </Grid>
          {/* Enhanced Tabs Navigation */}
          <Fade in timeout={800}>
            <Box sx={{ mb: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 1,
                  bgcolor: "white",
                  borderRadius: 3,
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={(e, newValue) => setTabValue(newValue)}
                  variant={isMobile ? "scrollable" : "fullWidth"}
                  scrollButtons={isMobile ? "auto" : false}
                  sx={{
                    "& .MuiTabs-indicator": {
                      display: "none",
                    },
                  }}
                >
                  <Tab icon={<Notes />} label="Job Description" iconPosition="start" sx={{ flex: 1, py: 2 }} />
                  <Tab icon={<PictureAsPdf />} label="Resume" iconPosition="start" sx={{ flex: 1, py: 2 }} />
                  <Tab icon={<Monitor />} iconPosition="start" label="Interviews" />
                </Tabs>
              </Paper>
            </Box>
          </Fade>
          <TabPanel value={tabValue} index={0}>
            <InfoCard sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                {/* Job Summary */}
                <Box sx={{ mb: 5 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: "#374151", fontSize: "16px" }}>
                    Job Summary
                  </Typography>
                  <Paper sx={{ p: 2.5, bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6, color: "#4b5563", fontSize: "14px" }}>
                      {candidateData?.jobDescriptionDetail?.jobDescription?.JobSummary || "Job summary not available"}
                    </Typography>
                  </Paper>
                </Box>
                {/* Roles and Responsibilities */}
                <Box sx={{ mb: 5 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: "#374151", fontSize: "16px" }}>
                    Roles and Responsibilities
                  </Typography>
                  <Paper sx={{ p: 2.5, bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
                    {(candidateData?.jobDescriptionDetail?.jobDescription?.RolesAndResponsibilities || []).length >
                    0 ? (
                      <Stack spacing={1.5}>
                        {candidateData?.jobDescriptionDetail?.jobDescription?.RolesAndResponsibilities.map(
                          (role, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                              <CheckCircle sx={{ color: "#10b981", fontSize: 16, mt: 0.2 }} />
                              <Typography variant="body2" sx={{ lineHeight: 1.5, color: "#4b5563", fontSize: "14px" }}>
                                {role}
                              </Typography>
                            </Box>
                          ),
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="#9ca3af" sx={{ fontSize: "14px" }}>
                        Roles and responsibilities not specified
                      </Typography>
                    )}
                  </Paper>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: "#374151", fontSize: "16px" }}>
                    Key Skills Required
                  </Typography>
                  <Paper sx={{ p: 2.5, bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
                    {(candidateData?.jobDescriptionDetail?.jobDescription?.KeySkills || []).length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {candidateData?.jobDescriptionDetail?.jobDescription?.KeySkills.map((skill, index) => (
                          <SkillChip key={index} label={skill} icon={<Star sx={{ fontSize: 14 }} />} />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="#9ca3af" sx={{ fontSize: "14px" }}>
                        Key skills not specified
                      </Typography>
                    )}
                  </Paper>
                </Box>
              </CardContent>
            </InfoCard>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {candidateData?.resume ? (
              <Box sx={{ height: "700px", border: "1px solid #ccc" }}>
                <iframe
                  src={candidateData.resume}
                  title="Resume PDF"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No Resume Available
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Paper sx={{ bgcolor: "white", p: 4, animation: `${fadeIn} 0.5s ease-out forwards` }}>
              {Array.isArray(candidateInterviewData) &&
                candidateInterviewData?.map((item) => (
                  <InterviewCard
                    key={item._id}
                    candidate={item}
                    setOpenDrawerFeedback={setOpenDrawerFeedback}
                    setSelectedCandidate={setSelectedCandidate}
                    setSelectedInterview={setSelectedInterview}
                    handleShowChat={handleShowChat}
                  />
                ))}
            </Paper>
          </TabPanel>
        </Container>
      )}
      <Dialog
        open={statusChangeModal}
        onClose={() => {
          setStatusChangeModal(false)
          setSelectedCandidateId("")
          setUpdatedStatus("")
          setRemark("")
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="Remark"
                label="Add Remark"
                multiline
                rows={3}
                size="small"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                SelectProps={{ native: false }}
              ></TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setSelectedCandidateId("")
              setStatusChangeModal(false)
              setUpdatedStatus("")
              setRemark("")
            }}
            size="small"
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Tooltip title={"Please Add Remark"} arrow>
            <span>
              <Button
                onClick={handleResumeShorlisted}
                variant="contained"
                color="primary"
                size="small"
                disabled={!remark}
                startIcon={<CheckCircle />}
                sx={{ textTransform: "none" }}
              >
                Submit
              </Button>
            </span>
          </Tooltip>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor="right"
        open={openDrawerFeedback}
        onClose={() => setOpenDrawerFeedback(false)}
        PaperProps={{
          sx: {
            width: 550,
            // px:6,
            // my:5,
            padding: 6,
            background: "#FFFFFF",
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={4}>
          <IconButton onClick={() => setOpenDrawerFeedback(false)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" color="#101828" fontWeight={700}>
            Candidate Feedback
          </Typography>
        </Box>
        <Typography variant="h6" color="#101828" fontWeight={600} my={1}>
          *Candidate
        </Typography>
        <Paper variant="outlined" sx={{ padding: 1, mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip label={selectedCandidate?.name} sx={{ margin: "2px" }} />
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 600,
            minHeight: 200,
            maxHeight: 500,
            // py: 5,
            // px: 4,
            my: 3,
            background: "#fff", // ⬅ solid background to fix overlay issue
            borderRadius: 3,
            textAlign: "center",
            overflow: "auto",
            position: "relative",
          }}
        >
          {/* Fixed Header */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              position: "sticky",
              top: 0,
              background: "#fff", // ⬅ must match Paper background
              zIndex: 1,
              p: 4,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                fontSize: 10,
              }}
            >
              <WorkspacePremium />
            </Box>
            <Typography variant="subtitle1" fontWeight={600} color="#101828">
              Candidate Feedback
            </Typography>
          </Box>
          <Box p={3}>
            {Array.isArray(feedback?.skillsFeedback) && feedback.skillsFeedback.length > 0 ? (
              feedback.skillsFeedback.map((item) => (
                <Box
                  key={item.criteria}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={3}
                  borderBottom="1px solid #E5E7EB"
                  sx={{ "&:last-child": { borderBottom: "none" } }}
                >
                  <Typography variant="h6" color="#101828">
                    {item.criteria}
                  </Typography>
                  <Rating
                    value={item.score}
                    max={5}
                    onChange={(_, newValue) => handleRatingChange(newValue, item.criteria)}
                    icon={<Star fontSize="medium" />}
                    emptyIcon={<Star fontSize="medium" style={{ color: "#E4E7EC" }} />}
                    sx={{
                      "& .MuiRating-icon": {
                        fontSize: 30,
                        mx: 3,
                      },
                      "& .MuiRating-iconFilled": {
                        color: item.score === 1 ? "#EF4444" : item.score <= 3 ? "#FACC15" : "#22C55E",
                      },
                    }}
                  />
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No skills Criteria available.
              </Typography>
            )}
          </Box>
        </Paper>
        <Typography variant="h6" color="#101828" fontWeight={600} my={4}>
          *Comments
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Add comment on this candidate"
          value={feedback?.feedback}
          onChange={(e) => setFeedBack((prev) => ({ ...prev, feedback: e.target.value }))}
          variant="outlined"
          sx={{ mb: 4, background: "#FFF" }}
        />
        <Typography variant="h6" color="#101828" fontWeight={600} my={2} display={"flex"} align="center" gap={2}>
          <Reviews sx={{ color: "#FFD700" }} />
          Feedback Review
        </Typography>
        <Box display="flex" gap={2} mb={4}>
          <Button
            variant={feedback.interviewfeedbackStatus === "positive" ? "contained" : "outlined"}
            onClick={() => setFeedBack((prev) => ({ ...prev, interviewfeedbackStatus: "positive" }))}
            sx={{
              textTransform: "none",
              backgroundColor: feedback.interviewfeedbackStatus === "positive" ? "#4CAF50" : "#FFF",
              color: feedback.interviewfeedbackStatus === "positive" ? "#FFF" : "#4CAF50",
              borderColor: "#4CAF50",
              fontWeight: 600,
            }}
            size="small"
          >
            👍 Positive Feedback
          </Button>
          <Button
            size="small"
            variant={feedback.interviewfeedbackStatus === "negative" ? "contained" : "outlined"}
            onClick={() => setFeedBack((prev) => ({ ...prev, interviewfeedbackStatus: "negative" }))}
            sx={{
              textTransform: "none",
              backgroundColor: feedback.interviewfeedbackStatus === "negative" ? "#F44336" : "#FFF",
              color: feedback.interviewfeedbackStatus === "negative" ? "#FFF" : "#F44336",
              borderColor: "#F44336",
              fontWeight: 600,
            }}
          >
            👎 Negative Feedback
          </Button>
        </Box>
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Button
            variant="outlined"
            sx={{ textTransform: "none", color: "#344054", borderColor: "#D0D5DD" }}
            onClick={() => setOpenDrawerFeedback(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#5A4BFF", color: "#FFF", textTransform: "none" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Drawer>
      <AiChatModal
        open={chatOpen}
        onClose={handleCloseChat}
        aiInterviewId={selectedChatAIInterviewId}
        aiVideoUrl={selectedChatVideoUrl}
      />
    </Box>
  )
}
