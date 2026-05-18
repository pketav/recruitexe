"use client"
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Card,
  Paper,
  Chip,
  Tab,
  Tabs,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardContent,
  Drawer,
  CardActionArea,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"
import { useEffect, useState } from "react"
import { keyframes } from "@emotion/react"
import { styled } from "@mui/material/styles"
import { useAuth } from "../../../../context/AuthContext"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined"
import {
  PictureAsPdf,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Visibility as VisibilityIcon,
  CheckCircle,
  Cancel,
  WhatsApp,
  Email,
  Settings,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { useApi } from "@core/hooks/useApi"
import DataTable from "@/components/DataTable"
import EmailForm from "./sendMail"
import axios from "axios"
import { GraduationCap } from "lucide-react"

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`portal-tabpanel-${index}`}
      aria-labelledby={`portal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  )
}

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }`

const ScoreChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "scoreColor",
})(({ scoreColor }) => ({
  background: `linear-gradient(135deg, ${scoreColor.bg}, ${scoreColor.color}15)`,
  color: scoreColor.color,
  fontWeight: "700",
  fontSize: "0.875rem",
  height: "32px",
  minWidth: "50px",
  border: `1px solid ${scoreColor.color}30`,
  boxShadow: `0 2px 4px ${scoreColor.color}20`,
}))

const getScoreColor = (score) => {
  if (score >= 85) return { color: "#10b981", bg: "#d1fae5" }
  if (score >= 75) return { color: "#3b82f6", bg: "#dbeafe" }
  if (score >= 60) return { color: "#f59e0b", bg: "#fef3c7" }
  return { color: "#ef4444", bg: "#fee2e2" }
}

function Reporting({ formattedCandidates, fetchCandidates, filters, setFilters, agentDetail, modeToSet }) {
  // State Management
  const [allApplications, setAllApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { userData } = useAuth()
  const { callApi } = useApi()
  const [selectedSummary, setSelectedSummary] = useState("")
  const [openSummary, setOpenSummary] = useState(false)
  // const [selectedCandidate, setSelectedCandidate] = useState({})
  const [scheduleModal, setScheduleModal] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [employees, setEmployees] = useState([])
  const router = useRouter()
  const [openStatusModal, setOpenStatusModal] = useState(false)
  const [statusForm, setStatusForm] = useState({ status: "", remark: "" })
  const [currentApplicationId, setCurrentApplicationId] = useState(null)
  const [remark, setRemark] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [tableTabValue, setTableTabValue] = useState(0)
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState("")
  const [accounts, setAccounts] = useState([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selected, setSelected] = useState("Multiple")
  const today = new Date().toISOString().split("T")[0]
  const [selectedType, setSelectedType] = useState("HUMAN")
  const [selectedMode, setSelectedMode] = useState("Call")
  const [date, setDate] = useState("2025-06-28")
  const [time, setTime] = useState("01:05 PM")
  const [interviewer, setInterviewer] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)
  const [openDrawerFeedback, setOpenDrawerFeedback] = useState(false)
  const [dateFeedBack, setDateFeedBack] = useState("2025-06-30")
  const [timeFeedBack, setTimeFeedBack] = useState("12:18 PM")
  const [comments, setComments] = useState("")
  const [durationError, setDurationError] = useState("")
  const [roundError, setRoundError] = useState("")
  const [openOfferLetterModal, setOpenOfferLetterModal] = useState(false)
  const [offerLetterTemplates, setOfferLetterTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState("")
  const [selectedCandidateForOffer, setSelectedCandidateForOffer] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [selectedDocs, setSelectedDocs] = useState([])
  const [openTableSetting, setOpenTableSetting] = useState(false)
  const [applicationColumns, setApplicationColumns] = useState([])
  const [checkboxSetting, setCheckBoxSetting] = useState({ visible: true, sticky: false })
  const [visibleConfig, setvisibleConfig] = useState([])
  const [stickyConfig, setStickyConfig] = useState([])
  const [visibleConfigState, setVisibleConfigState] = useState([])
  const [stickyConfigState, setStickyConfigState] = useState([])
  const [viewMode, setViewMode] = useState("table") // State for Table/Cards toggle
  const [mode, setMode] = useState("resume")
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [openInterviewDialog, setOpenInterviewDialog] = useState(false)

  const handleViewInterview = (row) => {
    setSelectedCandidate(row)
    setOpenInterviewDialog(true)
  }


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen])

  const [desicionMode, setDesicionMode] = useState("single")
  const [summaryCounts, setSummaryCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [filterStatus, setFilterStatus] = useState("all")
  const [open, setOpen] = useState(false)
  const [selectedBranches, setSelectedBranches] = useState([])
  const [selectedGap, setSelectedGap] = useState("")
  const [SelectedRound, setSelectedRound] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("")
  const [dateError, setDateError] = useState(false)
  const [timeError, setTimeError] = useState("")
  const [defaultColumns, setDefaultColumns] = useState([])
  const [permissions, setPermissions] = useState([])

  const fetchRolePermissions = async () => {
    const roleId = userData.roleId
    try {
      const result = await callApi({
        endpoint: `/v1/api/role/detail?roleId=${roleId}`,
        method: "GET",
        disableSnackbar: true,
      })
      if (result.success && result.data.items) {
        setPermissions(result.data.items)
      } else {
        console.error("API Error:", result.message)
      }
    } catch (err) {
      console.error("Error fetching role permissions:", err)
    }
  }

  // useEffect(() => {
  //   if (modeToSet && modeToSet === "interview") {
  //     setFilters((prev) => ({
  //       ...prev,
  //       resumeShortlisted: "shortlisted",
  //     }))
  //   }
  // }, [modeToSet, setFilters])

  useEffect(() => {
    fetchRolePermissions()
  }, [])

  const handleClose = () => setOpen(false)
  const toProperCase = (str) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())

  const apiService = {
    fetchEmployees: async () => {
      try {
        const response = await callApi({
          endpoint: `/v1/api/interview/getAllEmployee`,
          disableSnackbar: true,
        })
        if (response.success && response.data?.items) {
          setEmployees(response.data.items.employees)
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
      }
    },
    scheduleInterview: async (payload) => {
      try {
        const response = await callApi({
          endpoint: `/v1/api/candidate/scheduleInterview`,
          method: "POST",
          data: payload,
          disableSnackbar: false,
        })
        if (response.success) {
          fetchCandidates()
        }
      } catch (error) {
        console.error("Error scheduling interview:", error)
      } finally {
        setScheduleModal(false)
        // setSelectedCandidate({})
      }
    },
    updateStatus: async (payload) => {
      try {
        const response = await callApi({
          endpoint: `/v1/api/candidate/jobApplyFormStatusChange`,
          method: "POST",
          data: payload,
          disableSnackbar: false,
        })
        if (response.success) {
          fetchCandidates()
        }
      } catch (error) {
        console.error("Error updating status:", error)
      }
    },
  }

  const [analyzerLoading, setAnalyzerLoading] = useState(false)
  const [analyzerLoadingId, setAnalyzerLoadingId] = useState(null)

  const handleRunAnalyzer = async (id, resume, candidateId) => {
    setAnalyzerLoading(true)
    try {
      const response = await callApi({
        endpoint: `/v1/api/AISetUp/screen-candidate`,
        method: "POST",
        data: {
          jobPostId: id,
          resume: resume,
          candidateId: candidateId,
        },
        disableSnackbar: false,
      })
      if (response.success) {
        fetchCandidates()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setAnalyzerLoading(false)
    }
  }

  const [agentAll, setAgentAll] = useState([])
  const getAgentAll = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/api/airphone/saved-agents`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      const agents = response.data?.items
      setAgentAll(Array.isArray(agents) ? agents : [])
    } catch (error) {
      console.error("Fetch error:", error)
    }
  }

  const initiateCall = async (caller) => {
    try {
      const response = await axios.post(
        `${baseUrl}/v1/api/airphone/initiate-c2c`,
        {
          vnm: agentDetail?.virtual_number,
          agent: agentDetail?.mobile,
          caller: caller,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        },
      )
      const result = response.data
    } catch (error) {
      console.error("API error:", error)
    }
  }

  const [selectedCaller, setSelectedCaller] = useState([])
  const [selectedCandidateCheck, setSelectedCandidateCheck] = useState([])

  const initiateScheduleCall = async (
    localAgent,
    localInterviewer,
    localDate,
    localGap,
    localTime,
    localMode,
    localRound,
    localType,
    localRoundDesc,
    localLanguage,
  ) => {
    const [year, month, day] = localDate.split("-").map(Number)
    const [hours, minutes] = localTime.split(":").map(Number)
    const localDateObj = new Date()
    localDateObj.setFullYear(year)
    localDateObj.setMonth(month - 1)
    localDateObj.setDate(day)
    localDateObj.setHours(hours)
    localDateObj.setMinutes(minutes)
    localDateObj.setSeconds(0)
    localDateObj.setMilliseconds(0)
    const scheduleDate = localDateObj.toISOString()

    try {
      const payload =
        localType === "HUMAN"
          ? {
            candidateId: selectedIds,
            interviewerId: localMode === "Call" ? localAgent.employeeId : localInterviewer._id,
            interviewType: localMode,
            interviewModel: localType,
            roundName: localRound,
            scheduleDate: scheduleDate,
            status: "schedule",
            durationMinutes: Number(localGap),
            meetingSchedule: localMode === "Online" ? true : false,
            description: localRoundDesc,
          }
          : {
            candidateId: selectedIds,
            interviewModel: localType,
            scheduleDate: scheduleDate,
            status: "schedule",
            durationMinutes: Number(localGap),
            language: localLanguage,
          }

      const response = await callApi({
        endpoint: `/v1/api/interview/add`,
        method: "POST",
        data: payload,
        disableSnackbar: false,
      })
    } catch (error) {
      console.error("❌ Schedule API error:", error)
    } finally {
      setOpen(false)
      setOpenDrawer(false)
      setSelectedAgent("")
      setSelectedDate("")
      setSelectedGap("")
      setSelectedMode("Call")
      setSelectedType("HUMAN")
      setSelectedIds("")
      setInterviewer("")
      setSelectedRound("")
      fetchCandidates()
    }
  }

  const [statusChangeModal, setStatusChangeModal] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState("")
  const [updatedStatus, setUpdatedStatus] = useState("")

  const handleCandidateDocumentRequest = async (candidateId, organizationId) => {
    try {
      const updatePayload = { documentRequest: "requested" }
      const updateResponse = await callApi({
        endpoint: `/v1/api/job/updateJobAppliedById/${candidateId}`,
        method: "POST",
        data: updatePayload,
        disableSnackbar: true,
      })

      if (updateResponse.data.status) {
        const mailPayload = {
          templateName: "Candidate Document Request Mail",
          modelId: candidateId,
          organizationId: organizationId,
        }
        const mailResponse = await callApi({
          endpoint: `/v1/api/mail/content/sendMailTemplate`,
          method: "POST",
          data: mailPayload,
          disableSnackbar: false,
        })
        if (mailResponse.data.status) {
          fetchCandidates()
        }
      }
    } catch (error) {
      console.error("handleCandidateDocumentRequest error:", error)
    }
  }

  const handleResumeShorlisted = async () => {
    try {
      const response = await callApi({
        endpoint: `/v1/api/candidate/resumeShortlisted `,
        method: "POST",
        data: {
          ids: desicionMode === "bulk" ? selectedIds : [selectedCandidateId],
          resumeShortlisted: updatedStatus,
          Remark: remark,
        },
        disableSnackbar: false,
      })
      if (response.success) {
        fetchCandidates()
        setSelectedCandidateId("")
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setSelectedCandidateId("")
      setStatusChangeModal(false)
      setUpdatedStatus("")
      setRemark("")
      setSelectedIds([])
    }
  }

  // Full column definitions
  const fullColumnDefs = [
    {
      field: "candidateId",
      headerName: "ID",
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/JobApplications/aiScreening/aiScreenedCandidate/candidatesProfile?id=${params.row.id}`)
          }}
        >
          <PersonIcon sx={{ fontSize: 16, color: "primary.main" }} />
          <Typography variant="body2" sx={{ textDecoration: "underline" }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Candidate Name",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon sx={{ fontSize: 16, color: "success.main" }} />
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "mobile",
      headerName: "Contact",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WhatsApp
            sx={{
              fontSize: 20,
              color: "success.main",
              cursor: "pointer",
              animation: `${bounce} 0.6s ease-in-out infinite`,
            }}
            onClick={(e) => {
              e.stopPropagation()
              const width = 500
              const height = 600
              const left = window.innerWidth / 2 - width / 2 + window.screenX
              const top = window.innerHeight / 2 - height / 2 + window.screenY
              const url = `https://wa.me/${params.value}`
              window.open(
                url,
                "whatsappPopup",
                `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`,
              )
            }}
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedEmail(params.value)
            setEmailModalOpen(true)
          }}
        >
          <Email sx={{ fontSize: 16, color: "info.main", animation: `${bounce} 0.6s ease-in-out infinite` }} />
          <Typography variant="body2" color="primary" sx={{ cursor: "pointer", textDecoration: "underline" }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "branches",
      headerName: "Locations",
      width: 140,
      renderCell: (params) => (
        <Tooltip title="Click to view all branches">
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation()
              setOpen(true)
              setSelectedBranches(params.value)
            }}
          >
            <LocationIcon sx={{ fontSize: 16, color: "warning.main" }} />
            <Typography variant="body2" noWrap maxWidth={100}>
              {params.value.map((i) => i.name).join(", ")}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BusinessIcon sx={{ fontSize: 16, color: "warning.main" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "subDepartment",
      headerName: "Sub-Department",
      width: 170,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BusinessIcon sx={{ fontSize: 16, color: "warning.main" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "position",
      headerName: "Position",
      width: 280,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WorkIcon sx={{ fontSize: 16, color: "secondary.main" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "qualificationDetails",
      headerName: "Qualification",
      width: 270,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GraduationCap size={18} />
          <Typography variant="body2">{params.value[0]?.name}</Typography>
        </Box>
      ),
    },
    {
      field: "lastOrganization",
      headerName: "Last Organisation",
      width: 270,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BusinessIcon sx={{ fontSize: 16, color: "secondary.main" }} />
          <Typography variant="body2">{params.value[0]}</Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Applied Date",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "resume",
      headerName: "Resume",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            window.open(params.row.resume, "_blank")
          }}
        >
          <PictureAsPdf sx={{ fontSize: 18 }} />
        </IconButton>
      ),
    },
    {
      field: "expectedCTC",
      headerName: "Expected CTC",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Typography fontSize={14} color="black">
              {params.row.expectedCTC || "-"}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: "analysisButton",
      headerName: "Analyzer",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const status = params.row?.AI_Screeing_Status
        const isLoading = analyzerLoadingId === params.row.id
        let buttonLabel = "Not Found"
        let color = "default"
        if (status === "Pending") {
          buttonLabel = "Analyse"
          color = "info"
        } else if (status) {
          buttonLabel = "Analysed"
          color = "primary"
        }
        return (
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button
              variant="contained"
              color={color}
              size="small"
              disabled={isLoading}
              onClick={async () => {
                setAnalyzerLoadingId(params.row.id)
                try {
                  await handleRunAnalyzer(params.row.jobPostId, params.row.resume, params.row.id)
                } finally {
                  setAnalyzerLoadingId(null)
                }
              }}
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                fontWeight: 500,
                gap: 1,
                minWidth: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {buttonLabel}
              {isLoading && <CircularProgress size={16} sx={{ mr: 1, color: "white" }} />}
            </Button>
          </Box>
        )
      },
    },
    {
      field: "AI_Screeing",
      headerName: "AI Screening Result",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const statusMap = {
          Approved: "Recommended",
          Rejected: "Not Recommended",
          Pending: "Pending",
        }
        const status = statusMap[params.row?.AI_Screeing_Result] || "Pending"
        const colorMap = {
          Pending: "warning",
          Approved: "success",
          Rejected: "error",
        }
        return (
          <Chip
            label={status}
            color={colorMap[params.row?.AI_Screeing_Result]}
            sx={{ borderRadius: "20px", height: 27 }}
          />
        )
      },
    },
    {
      field: "AI_ScreeingScore",
      headerName: "AI Screening Score",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const scoreColor = getScoreColor(params.row?.AI_Score)
        return <ScoreChip scoreColor={scoreColor} label={params.row?.AI_Score} size="small" />
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const colorMap = {
          pending: "primary",
          approved: "success",
          rejected: "error",
          hold: "warning",
          Selected: "success",
          "Not Selected": "error",
        }
        const formatCase = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "Unknown")
        const status =
          params.row.resumeShortlisted === "active"
            ? "pending"
            : params.row.resumeShortlisted === "notshortlisted"
              ? "rejected"
              : params.row.resumeShortlisted === "shortlisted"
                ? "approved"
                : params.row.resumeShortlisted === "approve"
                  ? "Selected"
                  : "Not Selected"
        const chipColor = colorMap[status] || "default"
        return (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Chip
              label={formatCase(status)}
              color={chipColor}
              sx={{
                borderRadius: "10px",
                fontSize: "0.75rem",
                height: 27,
                minWidth: 120,
                textAlign: "center",
                px: 1.5,
              }}
            />
          </Box>
        )
      },
    },
    {
      field: "action",
      headerName: "Resume Decision",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Tooltip title="Approve">
              <span>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCandidateId(params.row.id)
                    setStatusChangeModal(true)
                    setUpdatedStatus("shortlisted")
                    setDesicionMode("single")
                  }}
                  disabled={params.row.resumeShortlisted === "shortlisted"}
                  sx={{
                    color: "white",
                    backgroundColor: "success.main",
                  }}
                >
                  <CheckCircle fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Reject">
              <span>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCandidateId(params.row.id)
                    setStatusChangeModal(true)
                    setUpdatedStatus("notshortlisted")
                    setDesicionMode("single")
                  }}
                  disabled={
                    params.row.resumeShortlisted === "notshortlisted" || params.row.interviewScheduleDetail?.length > 0
                  }
                  sx={{
                    color: "white",
                    backgroundColor: "error.main",
                  }}
                >
                  <Cancel fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )
      },
    },
    {
      field: "Remark",
      headerName: "Remark",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Typography fontSize={14} color="black">
              {params.row.Remark || "-"}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: "schedule",
      headerName: "Schedule",
      width: 160,
      headerAlign: "center",
      align: "center",
      visible: permissions?.permissions?.InterviewManagement,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={
                (params?.row?.interviewScheduleDetail?.length > 0 &&
                  params?.row?.interviewScheduleDetail[params.row.interviewScheduleDetail?.length - 1].status ===
                  "schedule") ||
                params.row.resumeShortlisted !== "shortlisted"
              }
              onClick={(e) => {
                e.stopPropagation()
                setOpenDrawer(true)
                setDateError(false)
                setSelectedIds(params.row.id)
                setSelectedCandidateCheck(params.row.name)
                setSelectedCaller(params.row.mobile)
              }}
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                fontWeight: 500,
                gap: 1,
                minWidth: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              Schedule Interview
            </Button>
          </Box>
        )
      },
    },
    {
      field: "interviewScheduleDetail",
      headerName: "Interview Rounds",
      width: 180,
      headerAlign: "center",
      headerAlign: "center",
      align: "center",

      renderCell: (params) => {
        const rounds = params.row.interviewScheduleDetail || [];

        if (rounds.length === 0) {
          return <Typography fontSize={14}>No Interviews</Typography>;
        }

        return (
          <Tooltip title="View Interview Rounds">
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                handleViewInterview(params.row)
              }}
              color="primary"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      },
    },

    {
      field: "interviewScheduleDetail", // New field for Interview Decision
      headerName: "Interview Decision",
      width: 180,
      headerAlign: "center",
      align: "center",
      visible: permissions?.permissions?.InterviewManagement,
      renderCell: (params) => {
        const latestInterview = params.row.interviewScheduleDetail[params.row.interviewScheduleDetail.length - 1]
        const interviewStatus = latestInterview?.status
        return (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Tooltip title="Approve Interview">
              <span>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleInterviewDecision(params.row.id, "approve")
                  }}
                  disabled={interviewStatus !== "schedule"}
                  sx={{
                    color: "white",
                    backgroundColor: "success.main",
                  }}
                >
                  <CheckCircle fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Reject Interview">
              <span>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleInterviewDecision(params.row.id, "reject")
                  }}
                  disabled={interviewStatus !== "schedule"}
                  sx={{
                    color: "white",
                    backgroundColor: "error.main",
                  }}
                >
                  <Cancel fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )
      },
    },
    {
      field: "documentRequest",
      headerName: "Document Status",
      width: 180,
      headerAlign: "center",
      align: "center",
      visible: permissions?.permissions?.InterviewManagement,
      renderCell: (params) => {
        const status = params.row.documentRequest || "notRequested"
        const getStatusChipProps = (status) => {
          switch (status) {
            case "requested":
              return { label: "Requested", color: "warning" }
            case "submitted":
              return { label: "Submitted", color: "success" }
            case "notRequested":
            default:
              return { label: "Not Requested", color: "default" }
          }
        }
        const { label, color } = getStatusChipProps(status)
        return <Chip label={label} color={color} variant="outlined" sx={{ fontWeight: 500 }} />
      },
    },
    {
      field: "requestAction",
      headerName: "Request Document",
      width: 190,
      headerAlign: "center",
      align: "center",
      visible: permissions?.permissions?.InterviewManagement,
      renderCell: (params) => {
        const status = params.row.documentRequest
        const handleClick = async () => {
          await handleCandidateDocumentRequest(params.row.id, params.row.orgId)
        }
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={status !== "notRequested"}
            onClick={handleClick}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              minWidth: 140,
            }}
          >
            {status === "notRequested" ? "Request Document" : "Already Requested"}
          </Button>
        )
      },
    },
    {
      field: "viewDocuments",
      headerName: "View Documents",
      width: 150,
      headerAlign: "center",
      align: "center",
      visible: permissions?.permissions?.InterviewManagement,
      renderCell: (params) => {
        const status = params.row.documentRequest
        if (status !== "submitted") {
          return "N/A"
        }
        const handleViewClick = async () => {
          try {
            const response = await callApi({
              endpoint: `/v1/api/documentValueTemplate/detail?candidateId=${params.row.id}`,
              method: "GET",
              disableSnackbar: true,
            })
            setSelectedDocs(response.data.items?.values || [])
            setOpenModal(true)
          } catch (error) {
            console.error("Error fetching documents:", error)
          }
        }
        return (
          <IconButton color="primary" onClick={handleViewClick}>
            <VisibilityIcon />
          </IconButton>
        )
      },
    },
    {
      field: "offerLetterStatus",
      headerName: "Offer Letter Status",
      width: 180,
      headerAlign: "center",
      align: "center",
      visible: permissions?.permissions?.InterviewManagement,
      renderCell: (params) => (
        <Typography variant="body2" color={params.row.OfferLetterStatus === "generated" ? "green" : "textSecondary"}>
          {params.row.OfferLetterStatus || "Not Generated"}
        </Typography>
      ),
    },
    {
      field: "offerLetter",
      headerName: "Offer Letter",
      width: 200,
      headerAlign: "center",
      align: "center",
      visible: permissions?.permissions?.InterviewManagement,
      renderCell: (params) => {
        const offerLink = params.row.offerLetter
        const isGenerated = params.row.OfferLetterStatus === "generated"
        return isGenerated && offerLink ? (
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              window.open(offerLink, "_blank")
            }}
          >
            <PictureAsPdf sx={{ fontSize: 18 }} />
          </IconButton>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Not Available
          </Typography>
        )
      },
    },
    {
      field: "generateOfferLetter",
      headerName: "Generate Offer Letter",
      width: 200,
      headerAlign: "center",
      align: "center",
      visible: permissions?.permissions?.InterviewManagement,
      renderCell: (params) => {
        const isShortlisted = params.row.resumeShortlisted === "shortlisted"
        return (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={!isShortlisted}
              onClick={() => {
                setSelectedCandidateForOffer(params.row)
                setOpenOfferLetterModal(true)
              }}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                minWidth: 140,
              }}
            >
              Generate Offer Letter
            </Button>
          </Box>
        )
      },
    },
    {
      field: "ReportRequest",
      headerName: "Verification Status",
      width: 180,
      headerAlign: "center",
      align: "center",
      visible: permissions?.permissions?.verificationSuite,
      renderCell: (params) => (
        <Typography variant="body2" color={params.row.ReportRequest === "submitted" ? "green" : "textSecondary"}>
          {params.row.ReportRequest || "Not Requested"}
        </Typography>
      ),
    },
    {
      field: "Reporturl",
      headerName: "Verification Report",
      width: 200,
      headerAlign: "center",
      align: "center",
      visible: permissions?.permissions?.verificationSuite,
      renderCell: (params) => {
        const ReportUrl = params.row.Reporturl
        const isSubmitted = params.row.ReportRequest === "submitted"
        return isSubmitted && ReportUrl ? (
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              window.open(ReportUrl, "_blank")
            }}
          >
            <PictureAsPdf sx={{ fontSize: 18 }} />
          </IconButton>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Not Available
          </Typography>
        )
      },
    },
    {
      field: "view",
      headerName: "View Profile",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                const candidateId = params?.row?.id
                if (!candidateId) return
                router.push(`/JobApplications/aiScreening/aiScreenedCandidate/candidatesProfile?id=${candidateId}`)
              }}
              sx={{
                color: "#3b82f6",
                backgroundColor: "#eff6ff",
                "&:hover": { backgroundColor: "#dbeafe" },
              }}
            >
              View Profile
            </Button>
          </Box>
        )
      },
    },
  ]

  // Key to field mapping for table settings
  const keyToFieldMap = {
    "Checkbox selection": "__checkbox__",
    ID: "candidateId",
    "Candidate Name": "name",
    Contact: "mobile",
    Email: "email",
    Locations: "branches",
    Department: "department",
    "Sub-Department": "subDepartment",
    Position: "position",
    Qualification: "qualificationDetails",
    "Last Organisation": "lastOrganization",
    "Applied Date": "createdAt",
    Resume: "resume",
    "Expected CTC": "expectedCTC",
    Remark: "Remark",
    // "Document Status": "documentRequest",
    // "Request Document": "requestAction",
    // "Offer Letter Status": "offerLetterStatus",
    // "Offer Letter": "offerLetter",
    // "Generate Offer Letter": "generateOfferLetter",
    // "Verification Status": "ReportRequest",
    // "Verification Report": "Reporturl",
    // "Interview Decision": "interviewDecision", // Add to map
  }

  const indianLanguages = [
    "English",
    "Hindi",
    "Bengali",
    "Telugu",
    "Marathi",
    "Tamil",
    "Urdu",
    "Gujarati",
    "Kannada",
    "Odia",
    "Malayalam",
    "Punjabi",
    "Assamese",
    "Maithili",
    "Sanskrit",
    "Konkani",
    "Manipuri",
    "Nepali",
    "Sindhi",
    "Dogri",
    "Kashmiri",
    "Santhali",
    "Bodo",
    "Tulu",
    "Bhili",
    "Gondi",
    "Rajasthani",
    "Chhattisgarhi",
    "Haryanvi",
    "Magahi",
    "Lepcha",
    "Mizo",
  ]

  const handleInterviewDecision = async (id, status) => {
    try {
      const response = await callApi({
        endpoint: `/v1/api/interview/approveByHr?id=${id}&status=${status}`,
        method: "POST",
        data: {},
        disableSnackbar: false,
      })
      if (response) {
        setFilters((prev) => ({
          ...prev,
          resumeShortlisted: "shortlisted",
        }));
        fetchCandidates()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleModeChange = (newMode) => {
    if (!newMode) return;

    setMode(newMode);

    let resumeShortlisted = "";
    switch (newMode) {
      case "interview":
        resumeShortlisted = "shortlisted";
        break;
      case "selected":
        resumeShortlisted = "approve";
        break;
      default:
        resumeShortlisted = "";
    }

    setFilters((prev) => ({
      ...prev,
      resumeShortlisted,
    }));
  };


  // Get columns configuration from API
  const getColumnsConfig = async () => {
    try {
      const response = await callApi({
        endpoint: `/v1/api/userConfig/user-table-config`,
        disableSnackbar: true,
      })
      if (response.success) {
        setvisibleConfig(response.data?.items.column?.config || [])
        setStickyConfig(response.data?.items.freeze?.config || [])
        setVisibleConfigState(response.data?.items.column?.config || [])
        setStickyConfigState(response.data?.items.freeze?.config || [])
        setCheckBoxSetting((prev) => ({
          ...prev,
          visible: response.data?.items.column?.config.find((item) => item.key === "Checkbox selection")?.active,
          sticky: response.data?.items.freeze?.config.find((item) => item.key === "Checkbox selection")?.active,
        }))

        const activeVisibleFields = response.data?.items.column?.config
          .filter((col) => col.active && keyToFieldMap[col.key])
          .map((col) => keyToFieldMap[col.key])

        const stickyFields = response.data?.items.freeze?.config
          .filter((col) => col.active && keyToFieldMap[col.key])
          .map((col) => keyToFieldMap[col.key])

        const updatedColumns = fullColumnDefs.map((col) => {
          const isConfigurable = Object.values(keyToFieldMap).includes(col.field)
          const hasPermission = col.visible !== false

          if (isConfigurable && hasPermission) {
            return {
              ...col,
              visible: activeVisibleFields.includes(col.field),
              sticky: stickyFields.includes(col.field),
            }
          }
          return col
        })

        setApplicationColumns(updatedColumns)
        setDefaultColumns(updatedColumns)
      }
    } catch (error) {
      console.error("Error fetching column config:", error)
    }
  }

  useEffect(() => {
    if (permissions) {
      getColumnsConfig()
    }
    getAgentAll()
  }, [permissions, analyzerLoadingId])

  const handleToggleConfig = (targetKey) => {
    setVisibleConfigState((prev) =>
      prev.map((item) => (item.key === targetKey ? { ...item, active: !item.active } : item)),
    )
  }

  const handleToggleStickyConfig = (targetKey) => {
    setStickyConfigState((prev) =>
      prev.map((item) => (item.key === targetKey ? { ...item, active: !item.active } : item)),
    )
  }

  const handleColumnsConfig = async (value) => {
    try {
      const response = await callApi({
        endpoint: `/v1/api/userConfig/user-table-config`,
        disableSnackbar: false,
        method: "POST",
        data: {
          type: value === 0 ? "column" : "freeze",
          updates: value === 0 ? visibleConfigState : stickyConfigState,
        },
      })
      if (response.success) {
        setOpenTableSetting(false)
        getColumnsConfig()
      }
    } catch (error) {
      console.error("Error fetching column config:", error)
    }
  }

  // Get columns based on active tab with applied settings
  const getColumnsForTab = (tabIndex) => {
    let baseColumns = []

    // Define tab-specific column sets
    const resumeAnalyzingFields = [
      "candidateId",
      "name",
      "mobile",
      "email",
      "branches",
      "department",
      "position",
      "lastOrganization",
      "resume",
      "analysisButton",
      "AI_Screeing",
      "AI_ScreeingScore",
      "status",
      "action",
      "Remark",
    ]

    const interviewStatusFields = [
      "candidateId",
      "name",
      "mobile",
      "email",
      "branches",
      "department",
      "position",
      "lastOrganization",
      "resume",
      "schedule",
      "interviewScheduleDetail", // Added to interview status tab
    ]

    const documentVerificationFields = [
      "candidateId",
      "name",
      "mobile",
      "email",
      "branches",
      "department",
      "position",
      "lastOrganization",
      "resume",
      "documentRequest",
      "requestAction",
      "viewDocuments",
      "ReportRequest",
      "Reporturl",
      "offerLetterStatus",
      "offerLetter",
      "generateOfferLetter",
    ]

    // const candidateOnboardingFields = [
    //   "candidateId",
    //   "name",
    //   "mobile",
    //   "email",
    //   "branches",
    //   "department",
    //   "position",
    //   "lastOrganization",
    //   "resume",

    // ]

    let fieldsForTab = []
    switch (tabIndex) {
      case 0:
        fieldsForTab = resumeAnalyzingFields
        break
      case 1:
        fieldsForTab = interviewStatusFields
        break
      case 2:
        fieldsForTab = documentVerificationFields
        break
      // case 3:
      //   fieldsForTab = candidateOnboardingFields
      //   break
      default:
        fieldsForTab = resumeAnalyzingFields
    }

    // Filter columns based on tab and apply settings
    baseColumns = applicationColumns
      .filter((col) => fieldsForTab.includes(col.field))
      .filter((col) => col.visible !== false)

    return baseColumns
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const fetchOfferLetterTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const response = await callApi({
        endpoint: "/v1/api/templete/listTemplates",
        method: "GET",
        disableSnackbar: true,
      })
      if (Array.isArray(response.data.items)) {
        const filteredTemplates = response.data.items.filter((template) => template.modelType === "jobPostAndApply")
        setOfferLetterTemplates(filteredTemplates)
      } else {
        setOfferLetterTemplates([])
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
      setOfferLetterTemplates([])
    } finally {
      setLoadingTemplates(false)
    }
  }

  const handleGenerateOfferLetter = async () => {
    if (!selectedTemplateId || !selectedCandidateForOffer) return
    const selectedTemplate = offerLetterTemplates.find((t) => t._id === selectedTemplateId)
    if (!selectedTemplate) {
      console.error("Selected template not found.")
      return
    }
    try {
      const payload = {
        templateName: selectedTemplate.title,
        jobId: selectedCandidateForOffer.id,
        generatePdf: true,
      }
      const response = await callApi({
        endpoint: `/v1/api/templete/generateLinkedInPostAndPdf`,
        method: "POST",
        data: payload,
        disableSnackbar: false,
      })
      if (response.data.status) {
        if (response.data.items && response.data.items.pdfUrl) {
          window.open(response.data.items.pdfUrl, "_blank")
        }
        setOpenOfferLetterModal(false)
        setSelectedTemplateId("")
        setSelectedCandidateForOffer(null)
      } else {
        console.error("Failed to generate offer letter:", response.data.message)
      }
    } catch (error) {
      console.error("Error generating offer letter:", error)
    }
  }

  useEffect(() => {
    apiService.fetchEmployees()
  }, [])

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setLoadingAccounts(false)
        return
      }
      try {
        const res = await axios.get(`${baseUrl}/v1/api/mail/users`, {
          headers: { Authorization: token },
        })
        setAccounts(res.data.items || [])
      } catch (err) {
        setAccounts([])
      } finally {
        setLoadingAccounts(false)
      }
    }
    fetchAccounts()
  }, [baseUrl])

  useEffect(() => {
    if (openOfferLetterModal) {
      fetchOfferLetterTemplates()
    } else {
      setOfferLetterTemplates([])
      setSelectedTemplateId("")
    }
  }, [openOfferLetterModal])

  const CustomToolbar = ({
    selectedIds = [],
    setStatusChangeModal,
    setUpdatedStatus,
    setDesicionMode,
    isFullscreen,
    setIsFullscreen,
  }) => {
    return (
      <Box sx={{ py: 3, px: 1, gap: 1, display: "flex", justifyContent: "space-between", height: "50px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={() => setOpenTableSetting(true)}>
            <Settings color="primary" />
          </IconButton>
          <IconButton onClick={() => setIsFullscreen((prev) => !prev)} color="primary">
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Box>
        {selectedIds.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={() => {
                setStatusChangeModal(true)
                setUpdatedStatus("shortlisted")
                setDesicionMode("bulk")
              }}
              sx={{
                py: 1,
                px: 2,
                fontWeight: 500,
                textTransform: "none",
                background: "linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  transform: "scale(1.02)",
                  bgcolor: "success.dark",
                },
              }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => {
                setStatusChangeModal(true)
                setUpdatedStatus("notshortlisted")
                setDesicionMode("bulk")
              }}
              sx={{
                py: 1,
                px: 2,
                fontWeight: 500,
                textTransform: "none",
                background: "linear-gradient(45deg, #d32f2f 30%, #ef5350 90%)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  transform: "scale(1.02)",
                  bgcolor: "error.dark",
                },
              }}
            >
              Reject
            </Button>
          </Box>
        )}
      </Box>
    )
  }

  // DrawerComponent and other components remain the same as in original code...
  const DrawerComponent = ({ openDrawer, setOpenDrawer }) => {
    const [localGap, setLocalGap] = useState("")
    const [localDate, setLocalDate] = useState("")
    const [localTime, setLocalTime] = useState("")
    const [localRound, setLocalRound] = useState("")
    const [localRoundDesc, setLocalRoundDesc] = useState("")
    const [localMode, setLocalMode] = useState("Call")
    const [localType, setLocalType] = useState("HUMAN")
    const [localAgent, setLocalAgent] = useState("")
    const [localInterviewer, setLocalInterviewer] = useState("")
    const [localLanguage, setLocalLanguage] = useState("")
    const [selectedDateISO, setSelectedDateISO] = useState("")
    const [dateError, setDateError] = useState(false)
    const [timeError, setTimeError] = useState("")
    const [openLocal, setLocalOpen] = useState(false)

    useEffect(() => {
      if (openDrawer) {
        setLocalOpen(true)
        setLocalGap("")
        setLocalDate("")
        setLocalTime("")
        setLocalRound("")
        setLocalMode("Call")
        setLocalType("HUMAN")
        setLocalAgent("")
        setLocalInterviewer("")
        setSelectedDateISO("")
        setLocalRoundDesc("")
        setDateError(false)
        setTimeError("")
        setLocalLanguage("English")
      }
    }, [openDrawer])

    const handleDateChange = (selected) => {
      const today = new Date().toLocaleDateString("en-CA")
      if (selected < today) {
        setDateError(true)
        return
      }
      setDateError(false)
      setLocalDate(selected)
      const [year, month, day] = selected.split("-").map(Number)
      const [hour, minute] = localTime.split(":")
      const localDateObj = new Date()
      localDateObj.setFullYear(Number(year))
      localDateObj.setMonth(Number(month) - 1)
      localDateObj.setDate(Number(day))
      localDateObj.setHours(Number(hour || 0))
      localDateObj.setMinutes(Number(minute || 0))
      localDateObj.setSeconds(0)
      setSelectedDateISO(localDateObj.toISOString())
    }

    const handleTimeChange = (timeStr) => {
      const [hour, minute] = timeStr.split(":").map(Number)
      const now = new Date()
      const selected = new Date(selectedDateISO || new Date())
      selected.setHours(hour)
      selected.setMinutes(minute)
      selected.setSeconds(0)
      const isToday = selected.toDateString() === now.toDateString()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      const selectedMinutes = hour * 60 + minute
      if (isToday && selectedMinutes < currentMinutes) {
        setTimeError("Please select a future time for Today's Date")
        return
      }
      setTimeError("")
      setLocalTime(timeStr)
      setSelectedDateISO(selected.toISOString())
    }

    return (
      <Drawer
        anchor="right"
        open={openLocal}
        onClose={() => {
          setLocalOpen(false)
          setOpenDrawer(false)
        }}
        PaperProps={{ sx: { width: 550, padding: 5, background: "#FFFFFF" } }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <IconButton
            onClick={() => {
              setLocalOpen(false)
              setOpenDrawer(false)
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" color="#101828" fontWeight={700}>
            Schedule Interview
          </Typography>
        </Box>
        <Typography variant="h6" color="#101828" fontWeight={600} mb={1}>
          Candidate
        </Typography>
        <Paper variant="outlined" sx={{ padding: 1, mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {(Array.isArray(selectedCandidateCheck) ? selectedCandidateCheck : [selectedCandidateCheck]).map(
            (name, index) => (name ? <Chip key={index} label={name} sx={{ margin: "2px" }} /> : null),
          )}
        </Paper>
        <Typography variant="h6" color="#101828" fontWeight={600} my={4}>
          *Who will take the interview
        </Typography>
        <Box display="flex" gap={1} mb={2}>
          <Button
            fullWidth
            variant={localType === "HUMAN" ? "contained" : "outlined"}
            onClick={() => setLocalType("HUMAN")}
            sx={{
              backgroundColor: localType === "HUMAN" ? "#5A4BFF" : "#F7F7F7",
              color: localType === "HUMAN" ? "#FFF" : "#000",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 8,
              textTransform: "none",
            }}
          >
            Human Interview
          </Button>
          <Button
            fullWidth
            variant={localType === "AI" ? "contained" : "outlined"}
            onClick={() => setLocalType("AI")}
            sx={{
              backgroundColor: localType === "AI" ? "#5A4BFF" : "#F7F7F7",
              color: localType === "AI" ? "#FFF" : "#000",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 8,
              textTransform: "none",
            }}
          >
            AI Interview
          </Button>
        </Box>
        {localType === "HUMAN" && (
          <>
            <Typography variant="h6" color="#101828" fontWeight={600} my={4}>
              * Select interview Mode
            </Typography>
            <Box display="flex" gap={5} mb={2}>
              {["Call", "Walk-In", "Online"].map((mode) => {
                const displayLabel =
                  mode === "Call" ? "Telephonic" : mode === "Online" ? "Online Interview" : "Face to Face"
                return (
                  <Card
                    key={mode}
                    sx={{
                      width: "33%",
                      borderRadius: 2,
                      backgroundColor: localMode === mode ? "#F5F3FF" : "#F7F7F7",
                      border: localMode === mode ? "2px solid #624BFF" : "2px solid transparent",
                      boxShadow: localMode === mode ? "0 0 0 2px rgba(98, 75, 255, 0.1)" : "none",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => setLocalMode(mode)}
                  >
                    <CardActionArea>
                      <CardContent sx={{ p: 6, textAlign: "center" }}>
                        <img
                          src={mode === "Call" ? "/telephonic.png" : mode === "Online" ? "/meet.png" : "/walkin.png"}
                          alt={displayLabel}
                          style={{ width: 45, height: 45, marginBottom: 8 }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {displayLabel}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )
              })}
            </Box>
          </>
        )}
        <Typography variant="h6" color="#101828" fontWeight={600} my={4}>
          Schedule Details
        </Typography>
        <Box display="flex" gap={2} mb={3}>
          <TextField
            fullWidth
            type="date"
            label="Select Date"
            InputLabelProps={{ shrink: true }}
            value={localDate}
            onChange={(e) => handleDateChange(e.target.value)}
            inputProps={{ min: new Date().toLocaleDateString("en-CA") }}
            error={dateError}
            helperText={dateError ? "Past dates are not allowed." : ""}
            sx={{ background: "#FFF" }}
          />
          <TextField
            fullWidth
            type="time"
            label="Select Time"
            InputLabelProps={{ shrink: true }}
            value={localTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            inputProps={{ step: 60 }}
            error={!!timeError}
            helperText={timeError}
            sx={{ background: "#FFF" }}
          />
        </Box>
        <Box display="flex" gap={2} mb={3}>
          <TextField
            fullWidth
            type="number"
            label="Interview Duration (Minutes)"
            value={localGap}
            onChange={(e) => {
              const inputValue = e.target.value
              if (!/^\d*$/.test(inputValue)) return
              if (localGap === "0") {
                setLocalGap(inputValue[inputValue.length - 1])
              } else {
                setLocalGap(inputValue)
              }
            }}
            onFocus={() => {
              if (localGap === "0") {
                setLocalGap("")
              }
            }}
            onBlur={(e) => {
              const value = Number(e.target.value)
              if (isNaN(value) || value <= 0) {
                setLocalGap("0")
              }
            }}
            sx={{ background: "#FFF" }}
            InputProps={{
              inputProps: { min: 0 },
            }}
            InputLabelProps={{ shrink: true }}
          />
          {localType === "HUMAN" && (
            <TextField
              fullWidth
              label="Round Name"
              value={localRound}
              onChange={(e) => setLocalRound(e.target.value)}
              sx={{ background: "#FFF" }}
              InputLabelProps={{ shrink: true }}
            />
          )}
          {localType === "AI" && (
            <TextField
              fullWidth
              label="Select Language"
              value={localLanguage}
              select
              onChange={(e) => setLocalLanguage(e.target.value)}
              sx={{ background: "#FFF", mb: 3 }}
            >
              {indianLanguages.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>
        {localType === "HUMAN" && (
          <>
            <TextField
              fullWidth
              label="Round Description (Optional)"
              value={localRoundDesc}
              multiline
              rows={2}
              onChange={(e) => setLocalRoundDesc(e.target.value)}
              sx={{ background: "#FFF", mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Select Interviewer"
              value={localMode === "Call" ? localAgent : localInterviewer}
              select
              onChange={(e) => {
                localMode === "Call" ? setLocalAgent(e.target.value) : setLocalInterviewer(e.target.value)
              }}
              sx={{ background: "#FFF", mb: 3 }}
            >
              {(localMode === "Call" ? agentAll : employees).map((item) => (
                <MenuItem key={item._id} value={item}>
                  {localMode === "Call" ? item.name : item.employeName}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 600,
            minHeight: 190,
            py: 5,
            px: 4,
            mt: 3,
            background: "#4E36FF0D",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#101828" mb={2}>
            Interviewer Summary
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2" color="#101828">
                Mode
              </Typography>
              <Typography variant="body2" fontWeight={500} color="##667085">
                {localType} Interview
              </Typography>
            </Grid>
            {localType === "HUMAN" && (
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="#101828">
                  Type
                </Typography>
                <Typography variant="body2" fontWeight={500} color="#667085">
                  {localMode === "Walk-In" ? "Face to Face" : localMode}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="#101828">
                Date & Time
              </Typography>
              <Typography variant="body2" fontWeight={500} color="#667085">
                {localDate && localTime
                  ? (() => {
                    const [year, month, day] = localDate.split("-").map(Number)
                    const [hours, minutes] = localTime.split(":").map(Number)
                    const fullDate = new Date(year, month - 1, day, hours, minutes)
                    const datePart = fullDate.toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                    const timePart = fullDate.toLocaleTimeString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    return `${datePart} at ${timePart}`
                  })()
                  : "-"}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2" color="#101828">
                Duration
              </Typography>
              <Typography variant="body2" fontWeight={500} color="#667085">
                {localGap} Minutes
              </Typography>
            </Grid>
            {localType === "HUMAN" && (
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="#101828">
                  Interviewer
                </Typography>
                <Typography variant="body2" fontWeight={500} color="#667085">
                  {localMode === "Call" ? localAgent.name : localInterviewer.employeName || "-"}
                </Typography>
              </Grid>
            )}
            {localType === "AI" && (
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="#101828">
                  Language
                </Typography>
                <Typography variant="body2" fontWeight={500} color="#667085">
                  {localLanguage}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="#101828">
                Candidate
              </Typography>
              <Typography variant="body2" fontWeight={500} color="#667085">
                {selectedCandidateCheck}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Box display="flex" justifyContent={"space-around"} my={5}>
          <Tooltip
            title={
              localType === "HUMAN"
                ? !localMode
                  ? "Select Interview Mode"
                  : !localDate
                    ? "Select Date & time"
                    : !localGap
                      ? "Enter Duration"
                      : !localRound
                        ? "Select Round"
                        : localMode === "Call" && !localAgent
                          ? "Select Interviewer"
                          : localMode !== "Call" && !localInterviewer
                            ? "Select Interviewer"
                            : "Schedule"
                : !localDate
                  ? "Select Date & time"
                  : !localGap
                    ? "Enter Duration"
                    : !localLanguage
                      ? "Select Language"
                      : "Schedule"
            }
            arrow
          >
            <span>
              <Button
                onClick={() => {
                  setOpenDrawer(false)
                  initiateScheduleCall(
                    localAgent,
                    localInterviewer,
                    localDate,
                    localGap,
                    localTime,
                    localMode,
                    localRound,
                    localType,
                    localRoundDesc,
                    localLanguage,
                  )
                }}
                disabled={
                  localType === "HUMAN"
                    ? !localMode ||
                    !localGap ||
                    !localRound ||
                    !localDate ||
                    (localMode === "Call" ? !localAgent : !localInterviewer)
                    : !localGap || !localDate || !localLanguage
                }
                variant="contained"
                color="success"
                sx={{ textTransform: "none", minWidth: "200px" }}
              >
                Schedule
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Drawer>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      {/* Gradient Bar at the very top */}
      <Box
        sx={{
          height: "8px",
          width: "100%",
          background: "linear-gradient(90deg, #8A2BE2 0%, #4B0082 100%)", // Purple gradient
          borderRadius: "8px 8px 0 0",
          mb: 2,
          mx: -2, // Adjust to span full width of Paper
          mt: -2, // Adjust to sit at the very top of Paper
        }}
      />
      <Box
        sx={{
          width: "100%",
          height: isFullscreen ? "100vh" : "800px",
          position: isFullscreen ? "fixed" : "relative",
          top: isFullscreen ? 0 : "auto",
          left: isFullscreen ? 0 : "auto",
          zIndex: isFullscreen ? 1300 : "auto",
          backgroundColor: "#fff",
          padding: isFullscreen ? 2 : 0,
          overflow: "auto",
        }}
      >
        {/* Tab Navigation and Top Controls */}
        <Box
          sx={{
            // borderBottom: 1,
            // borderColor: "divider",
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                minWidth: 160,
                px: 3,
                py: 2,
              },
              "& .Mui-selected": {
                color: "#1976d2",
              },
            }}
          >
            <Tab
              label="Resume Analyzing"
              sx={{
                background: tabValue === 0 ? "#e3f2fd" : "transparent",
                borderRadius: "8px 8px 0 0",
                mr: 1,
              }}
              onClick={(e) => handleModeChange("other")}

            />
            {permissions?.permissions?.InterviewManagement && (
              <Tab
                label="Interview Status"
                sx={{
                  background: tabValue === 1 ? "#e8f5e8" : "transparent",
                  borderRadius: "8px 8px 0 0",
                  mr: 1,
                }}
                onClick={() => handleModeChange("interview")}
              />
            )}

            {permissions?.permissions?.InterviewManagement && (
              <Tab
                label="Document Verification"
                sx={{
                  background: tabValue === 2 ? "#fff3e0" : "transparent",
                  borderRadius: "8px 8px 0 0",
                  mr: 1,
                }}
                onClick={() => handleModeChange("selected")}
              />
            )}
            {/* <Tab
              label="Candidate Onboarding"
              sx={{
                background: tabValue === 3 ? "#f3e5f5" : "transparent",
                borderRadius: "8px 8px 0 0",
              }}
              onClick={(e) => handleModeChange("interview")}

            /> */}
          </Tabs>

          <CustomToolbar
            selectedIds={selectedIds}
            setStatusChangeModal={setStatusChangeModal}
            setUpdatedStatus={setUpdatedStatus}
            setDesicionMode={setDesicionMode}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        </Box>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          {applicationColumns.length > 0 ? (
            <DataTable
              rows={formattedCandidates}
              columns={getColumnsForTab(0)}
              checkboxSetting={checkboxSetting}
              selected={selectedIds}
              selectedCaller={selectedCaller}
              setSelectedCaller={setSelectedCaller}
              setSelectedCandidateCheck={setSelectedCandidateCheck}
              selectedCandidateCheck={selectedCandidateCheck}
              setSelected={setSelectedIds}
            />
          ) : (
            <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {applicationColumns.length > 0 ? (
            <DataTable
              rows={formattedCandidates}
              columns={getColumnsForTab(1)}
              checkboxSetting={checkboxSetting}
              selected={selectedIds}
              selectedCaller={selectedCaller}
              setSelectedCaller={setSelectedCaller}
              setSelectedCandidateCheck={setSelectedCandidateCheck}
              selectedCandidateCheck={selectedCandidateCheck}
              setSelected={setSelectedIds}
            />
          ) : (
            <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {applicationColumns.length > 0 ? (
            <DataTable
              rows={formattedCandidates}
              columns={getColumnsForTab(2)}
              checkboxSetting={checkboxSetting}
              selected={selectedIds}
              selectedCaller={selectedCaller}
              setSelectedCaller={setSelectedCaller}
              setSelectedCandidateCheck={setSelectedCandidateCheck}
              selectedCandidateCheck={selectedCandidateCheck}
              setSelected={setSelectedIds}
            />
          ) : (
            <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {applicationColumns.length > 0 ? (
            <DataTable
              rows={formattedCandidates}
              columns={getColumnsForTab(3)}
              checkboxSetting={checkboxSetting}
              selected={selectedIds}
              selectedCaller={selectedCaller}
              setSelectedCaller={setSelectedCaller}
              setSelectedCandidateCheck={setSelectedCandidateCheck}
              selectedCandidateCheck={selectedCandidateCheck}
              setSelected={setSelectedIds}
            />
          ) : (
            <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </TabPanel>
      </Box>

      {/* Status Update Dialog */}
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
                startIcon={<CheckCircleIcon />}
                sx={{ textTransform: "none" }}
              >
                Submit
              </Button>
            </span>
          </Tooltip>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Branches</DialogTitle>
        <DialogContent dividers>
          <List sx={{ mt: -3 }}>
            {selectedBranches.map((branch, idx) => (
              <ListItem key={idx}>
                <ListItemIcon>
                  <LocationIcon sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText primary={toProperCase(branch.name)} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="primary" sx={{ mt: 2, mb: -3 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Settings Dialog - Your Exact Implementation */}
      <Dialog
        open={openTableSetting}
        onClose={() => setOpenTableSetting(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight={600}>
            Table Setting
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={tableTabValue}
              onChange={(e, newValue) => setTableTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Column Visibility Setting" />
              <Tab label="Column Mobility Setting" />
            </Tabs>
          </Box>
          <TabPanel value={tableTabValue} index={0}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Settings sx={{ fontSize: 24, color: "white" }} />
                  </Box>
                  Column Visiblity Setting
                </Typography>
              </Box>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    {visibleConfigState.map(({ key, active }) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            border: active ? "2px solid #6366F1" : "2px solid #E5E7EB",
                            backgroundColor: active ? "#F0F9FF" : "#FAFAFA",
                            transition: "all 0.2s ease-in-out",
                            cursor: "pointer",
                            "&:hover": {
                              borderColor: active ? "#5B5BD6" : "#9CA3AF",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Checkbox
                              checked={active}
                              onChange={() => handleToggleConfig(key)}
                              sx={{
                                color: "#9CA3AF",
                                "&.Mui-checked": {
                                  color: "#6366F1",
                                },
                                "& .MuiSvgIcon-root": {
                                  fontSize: 24,
                                },
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 500,
                                  color: active ? "#1F2937" : "#6B7280",
                                  mb: 0.5,
                                }}
                              >
                                {key}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: active ? "#6366F1" : "#9CA3AF",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {active ? "Visible" : "Hidden"}
                              </Typography>
                            </Box>
                            {active && <CheckCircle sx={{ color: "#10B981", fontSize: 20 }} />}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  <Box
                    sx={{
                      mt: 4,
                      pt: 3,
                      borderTop: "1px solid #E5E7EB",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setVisibleConfigState((prev) => prev.map((item) => ({ ...item, active: true })))}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          setVisibleConfigState((prev) => prev.map((item) => ({ ...item, active: false })))
                        }
                      >
                        Clear All
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
          <TabPanel value={tableTabValue} index={1}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Settings sx={{ fontSize: 24, color: "white" }} />
                  </Box>
                  Column Mobility Setting
                </Typography>
              </Box>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    {stickyConfigState.map(({ key, active }) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            border: active ? "2px solid #6366F1" : "2px solid #E5E7EB",
                            backgroundColor: active ? "#F0F9FF" : "#FAFAFA",
                            transition: "all 0.2s ease-in-out",
                            cursor: "pointer",
                            "&:hover": {
                              borderColor: active ? "#5B5BD6" : "#9CA3AF",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Checkbox
                              checked={active}
                              onChange={() => handleToggleStickyConfig(key)}
                              sx={{
                                color: "#9CA3AF",
                                "&.Mui-checked": {
                                  color: "#6366F1",
                                },
                                "& .MuiSvgIcon-root": {
                                  fontSize: 24,
                                },
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 500,
                                  color: active ? "#1F2937" : "#6B7280",
                                  mb: 0.5,
                                }}
                              >
                                {key}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: active ? "#6366F1" : "#9CA3AF",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {active ? "Freezed" : "Movable"}
                              </Typography>
                            </Box>
                            {active && <CheckCircle sx={{ color: "#10B981", fontSize: 20 }} />}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  <Box
                    sx={{
                      mt: 4,
                      pt: 3,
                      borderTop: "1px solid #E5E7EB",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setStickyConfigState((prev) => prev.map((item) => ({ ...item, active: true })))}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setStickyConfigState((prev) => prev.map((item) => ({ ...item, active: false })))}
                      >
                        Clear All
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setOpenTableSetting(false)
              setTableTabValue(0)
            }}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleColumnsConfig(tableTabValue)}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Box>
        <DrawerComponent openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      </Box>

      <Modal open={emailModalOpen} onClose={() => setEmailModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 400,
            maxWidth: 600,
          }}
        >
          <EmailForm
            to={selectedEmail}
            onClose={() => setEmailModalOpen(false)}
            fromEmails={accounts.map((acc) => acc.email)}
            accounts={accounts}
            loadingAccounts={loadingAccounts}
          />
        </Box>
      </Modal>

      {/* Offer Letter Template Selection Dialog */}
      <Dialog open={openOfferLetterModal} onClose={() => setOpenOfferLetterModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Offer Letter Template</DialogTitle>
        <DialogContent dividers>
          {loadingTemplates ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : offerLetterTemplates.length > 0 ? (
            <RadioGroup value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)}>
              {offerLetterTemplates.map((template) => (
                <FormControlLabel key={template._id} value={template._id} control={<Radio />} label={template.title} />
              ))}
            </RadioGroup>
          ) : (
            <Typography>No offer letter templates found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOfferLetterModal(false)}>Cancel</Button>
          <Button
            onClick={handleGenerateOfferLetter}
            disabled={!selectedTemplateId || loadingTemplates}
            variant="contained"
            color="primary"
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Uploaded Documents</DialogTitle>
        <DialogContent dividers>
          {selectedDocs.length === 0 ? (
            <Typography>No documents uploaded</Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {selectedDocs.map((doc, index) => {
                const url = doc.document.toLowerCase()
                const isImage =
                  url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".gif")
                const isPDF = url.endsWith(".pdf")
                const isWord = url.endsWith(".doc") || url.endsWith(".docx")
                const isExcel = url.endsWith(".xls") || url.endsWith(".xlsx")
                let filePreview
                if (isImage) {
                  filePreview = (
                    <img
                      src={doc.document || "/placeholder.svg"}
                      alt={`Doc ${index + 1}`}
                      style={{ width: "100%", borderRadius: 4, cursor: "pointer" }}
                    />
                  )
                } else if (isPDF) {
                  filePreview = <PictureAsPdf sx={{ fontSize: 60, color: "red" }} />
                } else if (isWord) {
                  filePreview = <DescriptionOutlinedIcon sx={{ fontSize: 60, color: "blue" }} />
                } else if (isExcel) {
                  filePreview = <GridOnOutlinedIcon sx={{ fontSize: 60, color: "green" }} />
                } else {
                  filePreview = <InsertDriveFileOutlinedIcon sx={{ fontSize: 60, color: "grey" }} />
                }
                return (
                  <Box key={index} sx={{ width: 120, textAlign: "center" }}>
                    <a href={doc.document} target="_blank" rel="noopener noreferrer">
                      {filePreview}
                    </a>
                    <Typography variant="body2" noWrap>
                      {doc.fieldName || `Document ${index + 1}`}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openInterviewDialog} onClose={() => setOpenInterviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Interview Rounds - {selectedCandidate?.name}</DialogTitle>
        <DialogContent dividers>
          {selectedCandidate?.interviewScheduleDetail?.map((round, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Round {round.roundNumber}: {round.roundName}</Typography>
              <Typography>Date: {new Date(round.scheduleDate).toLocaleString()}</Typography>
              <Typography>Status: {round.status}</Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInterviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

    </Paper>
  )
}

export default Reporting
