"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  Stack,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TablePagination,
  LinearProgress,
  Divider,
  Tooltip,
  CircularProgress
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import { Email, DocumentScanner, PictureAsPdf, CalendarToday, Visibility, Category, Business, SecurityTwoTone, WhatsApp } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import {
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  X,
  Star,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  StopCircle
} from "lucide-react"
import { useApi } from "@core/hooks/useApi"

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  border: "1px solid #E5E7EB",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transform: "translateY(-2px)",
  },
}))


const StyledScreenedCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "scoreColor",
})(({ theme, scoreColor }) => ({
  height: "100%",
  cursor: "pointer",
  borderLeft: `3px solid ${scoreColor}`, // Made it even thicker and more visible
  background: "linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "60px",
    height: "60px",
    background: `linear-gradient(135deg, ${scoreColor}15, ${scoreColor}05)`,
    borderRadius: "0 0 0 60px",
    zIndex: 0,
  },
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
    borderColor: "#d1d5db",
    borderLeft: `4px solid ${scoreColor}`,
    "& .candidate-avatar": {
      transform: "scale(1.05)",
    },
    "& .view-button": {
      borderColor: scoreColor,
      color: "black",
      transform: "translateY(-1px)",
      boxShadow: `0 4px 12px ${scoreColor}40`,
    },
  },
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  fontSize: "1rem",
  fontWeight: "700",
  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  border: "3px solid white",
  transition: "transform 0.3s ease",
}))

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 0),
  borderRadius: "6px",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#f8fafc",
  },
}))

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

const ConfidenceProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "scoreColor",
})(({ scoreColor }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: "#f1f5f9",
  "& .MuiLinearProgress-bar": {
    background: `linear-gradient(90deg, ${scoreColor}80, ${scoreColor})`,
    borderRadius: 4,
    boxShadow: `0 2px 4px ${scoreColor}40`,
  },
}))

const ViewButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "scoreColor",
})(({ scoreColor }) => {
  return {
    textTransform: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.875rem",
    padding: "8px 24px",
    border: `2px solid ${scoreColor}30`,
    color: scoreColor,
    backgroundColor: "transparent",
    transition: "all 0.3s ease",
  };
});

const CandidateCard = styled(Card)(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "shortlisted":
        return "#4caf50"; // Green
      case "notshortlisted":
        return "#f44336"; // Red
      case "under_review":
        return "#1976d2"; // Blue
      case "active":
        return "#ff9800"; // Orange
      default:
        return "#9e9e9e"; // Grey
    }
  }

  return {
    borderLeft: `4px solid ${getStatusColor()}`,
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      transform: "translateY(-2px)",
    },
  }
})

const StatusChip = styled(Chip)(({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "shortlisted":
        return { backgroundColor: "#D1FAE5", color: "#065F46", fontWeight: 600 }
      case "notshortlisted":
        return { backgroundColor: "#FEE2E2", color: "#991B1B", fontWeight: 600 }
      case "under_review":
        return { backgroundColor: "#FEF3C7", color: "#92400E", fontWeight: 600 }
      case "active":
        return { backgroundColor: "#DBEAFE", color: "#1E40AF", fontWeight: 600 }
      default:
        return { backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 600 }
    }
  }

  return {
    ...getStatusStyles(),
    fontSize: "0.75rem",
    height: "24px",
  }
})

const ViewMoreButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderColor: "#D1D5DB",
  color: "#374151",
  "&:hover": {
    borderColor: "#9CA3AF",
    backgroundColor: "#F9FAFB",
  },
  transition: "all 0.2s ease",
}))

const MetricCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <StyledCard>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Icon size={20} color="#6B7280" />
        <Typography variant="body2" color="#6B7280" fontWeight={500}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="h2" fontWeight="bold" color={color} sx={{ mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="#6B7280">
        {subtitle}
      </Typography>
    </CardContent>
  </StyledCard>
)



function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

const ResumeModal = ({ open, onClose, candidate }) => {
  if (!candidate) return null

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return !url.includes("blob:")
    } catch {
      return false
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            {candidate.name} - Resume
          </Typography>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Paper sx={{ p: 3, bgcolor: "#F9FAFB" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="#6B7280">
                  Email
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {candidate.emailId}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="#6B7280">
                  Phone
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {candidate.mobileNumber}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="#6B7280">
                  Position
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {candidate.position}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="#6B7280">
                  Department
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {candidate.department?.name}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {isValidUrl(candidate.resume) ? (
            <Box sx={{ height: "600px", border: "1px solid #E5E7EB", borderRadius: 2 }}>
              <iframe
                src={candidate.resume}
                width="100%"
                height="100%"
                style={{ border: "none", borderRadius: "8px" }}
                title="Resume"
              />
            </Box>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#F9FAFB" }}>
              <Typography variant="h6" color="#6B7280" sx={{ mb: 2 }}>
                Resume Preview Not Available
              </Typography>
              <Typography variant="body2" color="#6B7280" sx={{ mb: 3 }}>
                The resume file cannot be previewed directly. This might be a blob URL or unsupported format.
              </Typography>
              {candidate.resume && (
                <Button
                  variant="outlined"
                  startIcon={<ExternalLink size={16} />}
                  onClick={() => window.open(candidate.resume, "_blank")}
                >
                  Open Resume Link
                </Button>
              )}
            </Paper>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {isValidUrl(candidate.resume) && (
          <Button
            variant="contained"
            startIcon={<Download size={16} />}
            onClick={() => window.open(candidate.resume, "_blank")}
          >
            Download
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

const CandidateManagement = ({ candidates,fetchCandidates }) => {
  // const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [resumeModalOpen, setResumeModalOpen] = useState(false)
  const [totalItems, setTotalItems] = useState("")
  const [totalShortlisted, setTotalShortlisted] = useState("")
  const [totalRejected, setTotalRejected] = useState("")
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const { callApi } = useApi()
  const router = useRouter()

  // State to track expanded positions
  const [expandedPositions, setExpandedPositions] = useState({})

  // State to track expanded positions for job openings
  const [expandedJobPositions, setExpandedJobPositions] = useState({})

  // Number of job positions to show initially
  const INITIAL_POSITIONS_TO_SHOW = 3

  // Number of candidates to show initially per position
  const INITIAL_CANDIDATES_TO_SHOW = 4

  // Fetch candidates data
  // const fetchCandidates = async () => {
  //   setLoading(true)
  //   setError(null)
  //   try {
  //     const response = await callApi({
  //       endpoint: `/v1/api/job/getAll?page=${page+1}&limit=${rowsPerPage}`,
  //       disableSnackbar: true,
  //     })

  //     if (response.success && response.data?.items) {
  //       setCandidates(response.data.items.data || [])
  //       setTotalItems(response.data.items.totalCount)
  //       setTotalShortlisted(response.data.items.totalShortlisted)
  //       setTotalRejected(response.data.items.totalRejected)

  //     } else {
  //       setError("Failed to load candidates data")
  //     }
  //   } catch (err) {
  //     setError("Error fetching candidates: " + err.message)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   fetchCandidates()
  // }, [page, rowsPerPage])

  // Generate mock AI scores and confidence for demonstration
  const generateMockScore = (name) => {
    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return Math.abs(hash % 40) + 60 // Score between 60-100
  }

  const generateConfidence = (score) => {
    return Math.max(30, score - 10 + Math.random() * 20) // Confidence related to score
  }

  // Process candidates with mock data
  const processedCandidates = useMemo(() => {
    return candidates?.map((candidate) => {
      const aiScore = generateMockScore(candidate.name)
      const confidence = generateConfidence(aiScore)

      // Map status to match the design
      let status = candidate.candidateStatus || "new"
      if (status === "new") status = "new"
      else if (status === "approved") status = "approved"
      else if (status === "rejected") status = "rejected"
      else status = "under_review"

      return {
        ...candidate,
        aiScore,
        confidence: Math.round(confidence),
        processedStatus: status,
        skills: ["React", "JavaScript", "TypeScript", "Node.js"], // Mock skills
        experience: `${Math.floor(Math.random() * 8) + 1} years`, // Mock experience
      }
    })
  }, [candidates])

  const [analyzerLoadingId, setAnalyzerLoadingId] = useState(null);

  // // Group candidates by position
  // const candidatesByPosition = useMemo(() => {
  //   const grouped = {}
  //   processedCandidates.forEach((candidate) => {
  //     const position = candidate.position
  //     if (!grouped[position]) {
  //       grouped[position] = []
  //     }
  //     grouped[position].push(candidate)
  //   })
  //   return grouped
  // }, [processedCandidates])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = processedCandidates.length
    const highScorers = processedCandidates.filter((c) => c.aiScore >= 90).length
    const underReview = processedCandidates.filter((c) => c.processedStatus === "under_review").length
    const avgScore = total > 0 ? Math.round(processedCandidates.reduce((sum, c) => sum + c.aiScore, 0) / total) : 0

    return { total, highScorers, underReview, avgScore }
  }, [processedCandidates])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "shortlisted":
        return "#4caf50"; // Green
      case "notshortlisted":
        return "#f44336"; // Red
      case "under_review":
        return "#1976d2"; // Blue
      case "active":
        return "#ff9800"; // Orange
      case "Completed":
        return "#4caf50"
      case "Pending":
        return "#1976d2"
      default:
        return "#9e9e9e"; // Grey
    }
  };


  const getStatusLabel = (status) => {
    switch (status) {
      case "shortlisted":
        return "Approved"
      case "notshortlisted":
        return "Rejected"
      case "under_review":
        return "Under Review"
      case "active":
        return "Pending"
      case "Completed":
        return "Analysed"
      case "Pending":
        return "Analyse"
      default:
        return "New"
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name) => {
    const colors = ["#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#6366F1", "#8B5A2B"]
    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return colors[Math.abs(hash) % colors.length]
  }

  const getScoreColor = (score) => {
    if (score >= 85) return { color: "#10b981", bg: "#d1fae5" }
    if (score >= 75) return { color: "#3b82f6", bg: "#dbeafe" }
    if (score >= 60) return { color: "#f59e0b", bg: "#fef3c7" }
    return { color: "#ef4444", bg: "#fee2e2" } // Red
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "#10B981"
    if (confidence >= 60) return "#F59E0B"
    return "#EF4444"
  }

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate)
    setResumeModalOpen(true)
  }

  // Toggle expanded state for a position
  const togglePositionExpand = (position) => {
    setExpandedPositions((prev) => ({
      ...prev,
      [position]: !prev[position],
    }))
  }

  // Toggle expanded state for job positions listing
  const toggleJobPositionsExpand = () => {
    setExpandedJobPositions((prev) => ({ showAll: !prev.showAll }))
  }


  // Get visible job positions based on expanded state
  const getVisibleJobPositions = () => {
    const positions = Object.entries(candidatesByPosition)
    if (expandedJobPositions.showAll) {
      return positions
    }
    return positions.slice(0, INITIAL_POSITIONS_TO_SHOW)
  }

  // Get candidates to display based on expanded state
  const getVisibleCandidates = (position, candidates) => {
    if (expandedPositions[position]) {
      return candidates
    }
    return candidates.slice(0, INITIAL_CANDIDATES_TO_SHOW)
  }

  const [analyzerLoading, setAnalyzerLoading] = useState(false)
  const handleRunAnalyzer = async (id, resume, candidateId) => {
    setAnalyzerLoading(true)
    try {
      const response = await callApi({
        endpoint: `/v1/api/AISetUp/screen-candidate`,
        method: "POST",
        data: {
          "jobPostId": id,
          "resume": resume,
          "candidateId": candidateId
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


  // if (loading) {
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
  //       <Typography>Loading candidates...</Typography>
  //     </Box>
  //   )
  // }

  // if (error) {
  //   return (
  //     <Box sx={{ p: 3 }}>
  //       <Typography color="error">{error}</Typography>
  //     </Box>
  //   )
  // }

  //   const handlePageChange = (event, newPage) => {
  //     setPage(newPage);
  //   };

  //   const handleRowsPerPageChange = (event) => {
  //     setRowsPerPage(parseInt(event.target.value, 10));
  //     setPage(0); // Reset to first page
  //   };

  //   const PaginationComponent = ({
  //     page,
  //     rowsPerPage,
  //     rowsPerPageOptions = [30,40, 50],
  //     count,
  //     onPageChange,
  //     onRowsPerPageChange,
  //   }) => {
  //     return (
  //       <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
  // <TablePagination
  //   component="div"
  //   count={count}
  //   page={page}
  //   onPageChange={onPageChange}
  //   rowsPerPage={rowsPerPage}
  //   onRowsPerPageChange={onRowsPerPageChange}
  //   rowsPerPageOptions={[30,40,50]}
  //   labelRowsPerPage="Cards per page:"
  //   sx={{
  //     '.MuiTablePagination-toolbar': {
  //       pl: 2,
  //       pr: 1,
  //       borderRadius: 2,
  //       backgroundColor: '#f1f5f9',
  //       boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  //     },
  //     '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
  //       fontSize: '0.85rem',
  //       color: '#475569',
  //     },
  //     '.MuiInputBase-root': {
  //       fontSize: '0.85rem',
  //     },
  //   }}
  // />
  // </Box>

  //     );
  //   };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Summary Cards */}
      {/* <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Candidates"
            value={totalItems}
            subtitle="Across all positions"
            icon={Users}
            color="#1F2937"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Shortlisted"
            value={totalShortlisted}
            subtitle="Shortlisted"
            icon={Check}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Rejected"
            value={totalRejected}
            subtitle="Rejected"
            icon={StopCircle}
            color="#cf261d"
          />
        </Grid>
      </Grid> */}

      {/* Candidates by Position */}
      {/* {getVisibleJobPositions().map(([position, positionCandidates]) => (
        <Box key={position} sx={{ mb: 5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="#1F2937">
              {position}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="#6B7280">
                {positionCandidates.length} candidates
              </Typography>
            </Stack>
          </Stack> */}

      <Grid container spacing={8}>
        {candidates.map((candidate) => {
          const scoreColor = getScoreColor(candidate.AI_Score)
          return (
            <Grid item xs={12} sm={6} md={3} key={candidate._id}>
              {candidate.AI_Screeing_Status !== "Completed" ?
                <CandidateCard status={candidate.resumeShortlisted}>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(candidate.name),
                          color: "white",
                          fontWeight: "bold",
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getInitials(candidate.name)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap color="#1F2937">
                          {candidate.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={(e) => {
                          e.stopPropagation();

                          const width = 600;
                          const height = 700;
                          const left = window.innerWidth / 2 - width / 2 + window.screenX;
                          const top = window.innerHeight / 2 - height / 2 + window.screenY;

                          const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${candidate.emailId}&tf=1`;

                          window.open(
                            url,
                            "gmailComposeWindow",
                            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                          );
                        }}>
                          <Email sx={{ fontSize: 16, color: "info.main", animation: `${bounce} 0.6s ease-in-out infinite`, }} />
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{ cursor: "pointer", textDecoration: "underline" }}
                          >
                            {candidate.emailId}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={(e) => {
                          e.stopPropagation();

                          const width = 500;
                          const height = 600;
                          const left = window.innerWidth / 2 - width / 2 + window.screenX;
                          const top = window.innerHeight / 2 - height / 2 + window.screenY;

                          const url = `https://wa.me/${candidate.mobileNumber}`;

                          window.open(
                            url,
                            "whatsappPopup",
                            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                          );
                        }}>
                          <WhatsApp
                            sx={{ fontSize: 16, color: "success.main", animation: `${bounce} 0.6s ease-in-out infinite` }}
                          />
                          <Typography variant="body2">
                            {candidate.mobileNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>

                    <InfoRow sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Business fontSize="small" />
                        Job Type
                      </Typography>
                      <Typography variant="body2" color="black" fontWeight={500}>
                        {candidate?.JobType}
                      </Typography>
                    </InfoRow>

                    <InfoRow sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Category fontSize="small" />
                        Status
                      </Typography>
                      <StatusChip
                        size="small"
                        label={getStatusLabel(candidate.resumeShortlisted)}
                        status={candidate.resumeShortlisted}
                        sx={{
                          backgroundColor: getStatusColor(candidate.resumeShortlisted),
                          color: '#fff',
                          fontWeight: 500,
                        }}
                      />

                    </InfoRow>



                    <InfoRow sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DocumentScanner fontSize="small" />
                        Resume
                      </Typography>
                      <IconButton onClick={() => {
                        if (candidate?.resume) {
                          window.open(candidate?.resume, '_blank', 'noopener,noreferrer');
                        }
                      }}
                        sx={{ display: "flex", alignItems: "center", gap: 2, cursor: 'pointer' }}
                      >
                        <PictureAsPdf color="error" fontSize="medium" />

                      </IconButton>

                    </InfoRow>



                    <InfoRow sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarToday fontSize="small" />
                        Applied
                      </Typography>
                      <Typography variant="body2" color="black" fontWeight={500}>
                        {new Date(candidate.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Typography>
                    </InfoRow>

                    <InfoRow sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <SecurityTwoTone fontSize="small" />
                        Department
                      </Typography>
                      <Typography variant="body2" color="black" fontWeight={500}>
                        {candidate?.department?.name}
                      </Typography>
                    </InfoRow>

                            
                    <InfoRow sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Category fontSize="small" />
                        AI Screening Status
                      </Typography>

                      <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        setAnalyzerLoadingId(candidate._id);

                        setTimeout(async () => {
                          try {
                            await handleRunAnalyzer(candidate.jobPostId, candidate.resume, candidate._id);
                          } finally {
                            setAnalyzerLoadingId(null);
                          }
                        }, 0);
                      }}
                      disabled={analyzerLoadingId === candidate._id}
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        fontWeight: 500,
                        textTransform: "none",
                        borderRadius: "16px",
                        padding: "5px 10px",
                        minWidth: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        opacity: 0.9,
                        position: "relative",
                      }}
                    >

                     {getStatusLabel(candidate.AI_Screeing_Status)}
                      {analyzerLoadingId === candidate._id && <CircularProgress size={16} sx={{ mr: 1, color: "white" }} /> }
                    </Button>

                    </InfoRow>


                    <InfoRow sx={{ mb: 2 }}>
                      <Chip
                        label={candidate.position}
                        variant="outlined"
                        sx={{
                          color: getStatusColor(candidate.resumeShortlisted),
                          borderColor: getStatusColor(candidate.resumeShortlisted),
                          fontWeight: 600,
                        }}
                      />
                    </InfoRow>

                    {/* Actions */}

                    <Stack direction="row" spacing={1}>
                      <ViewButton
                        className="view-button"
                        scoreColor={getStatusColor(candidate.resumeShortlisted)}
                        fullWidth
                        startIcon={<Visibility fontSize="small" />}
                        onClick={() => router.push(`/JobApplications/aiScreening/aiScreenedCandidate/candidatesProfile?id=${candidate._id}`)}
                      >
                        View Profile
                      </ViewButton>
                    </Stack>
                  </CardContent>
                </CandidateCard> : <StyledScreenedCard scoreColor={scoreColor.color}>
                  <Box sx={{ p: 3, position: "relative", zIndex: 1 }}>
                    {/* Enhanced Avatar and Name Section */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <StyledAvatar className="candidate-avatar">{getInitials(candidate.name)}</StyledAvatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight="600" noWrap sx={{ color: "#1e293b", mb: 0.5 }}>
                          {candidate.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={(e) => {
                          e.stopPropagation();

                          const width = 600;
                          const height = 700;
                          const left = window.innerWidth / 2 - width / 2 + window.screenX;
                          const top = window.innerHeight / 2 - height / 2 + window.screenY;

                          const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${candidate.emailId}&tf=1`;

                          window.open(
                            url,
                            "gmailComposeWindow",
                            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                          );
                        }}>
                          <Email sx={{ fontSize: 16, color: "info.main", animation: `${bounce} 0.6s ease-in-out infinite`, }} />
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{ cursor: "pointer", textDecoration: "underline" }}
                          >
                            {candidate.emailId}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={(e) => {
                          e.stopPropagation();

                          const width = 500;
                          const height = 600;
                          const left = window.innerWidth / 2 - width / 2 + window.screenX;
                          const top = window.innerHeight / 2 - height / 2 + window.screenY;

                          const url = `https://wa.me/${candidate.mobileNumber}`;

                          window.open(
                            url,
                            "whatsappPopup",
                            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                          );
                        }}>
                          <WhatsApp
                            sx={{ fontSize: 16, color: "success.main", animation: `${bounce} 0.6s ease-in-out infinite` }}
                          />
                          <Typography variant="body2">
                            {candidate.mobileNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2, opacity: 0.6 }} />

                    {/* Enhanced AI Score */}
                    <InfoRow sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Star fontSize="small" sx={{ color: scoreColor.color }} />
                        AI Score
                      </Typography>
                      <ScoreChip scoreColor={scoreColor} label={candidate.AI_Score} size="small" />
                    </InfoRow>

                    <InfoRow sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Category fontSize="small" />
                        Status
                      </Typography>
                      <StatusChip
                        size="small"
                        label={getStatusLabel(candidate.resumeShortlisted)}
                        status={candidate.resumeShortlisted}
                        sx={{
                          backgroundColor: getStatusColor(candidate.resumeShortlisted),
                          color: '#fff',
                          fontWeight: 500,
                        }}
                      />

                    </InfoRow>

                    {/* Enhanced AI Confidence */}
                    {/* <InfoRow sx={{ mb: 2 }}>
                              <Typography variant="body2" fontWeight="600">
                                AI Confidence
                              </Typography>
                              <Typography variant="body2" fontWeight="600" sx={{ color: scoreColor.color }}>
                                {candidate.AI_Confidence}%
                              </Typography>
                            </InfoRow> */}

                    {/* Enhanced Experience */}
                    <InfoRow sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DocumentScanner fontSize="small" />
                        Resume
                      </Typography>
                      <IconButton onClick={() => {
                        if (candidate?.resume) {
                          window.open(candidate?.resume, '_blank', 'noopener,noreferrer');
                        }
                      }}
                        sx={{ display: "flex", alignItems: "center", gap: 2, cursor: 'pointer' }}
                      >
                        <PictureAsPdf color="error" fontSize="medium" />

                      </IconButton>

                    </InfoRow>

                    {/* Enhanced Applied Date */}
                    <InfoRow sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarToday fontSize="small" />
                        Applied
                      </Typography>
                      <Typography variant="body2" color="black" fontWeight={500}>
                        {new Date(candidate.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Typography>
                    </InfoRow>

                    <InfoRow sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <SecurityTwoTone fontSize="small" />
                        Department
                      </Typography>
                      <Typography variant="body2" color="black" fontWeight={500}>
                        {candidate?.department?.name}
                      </Typography>
                    </InfoRow>

                  
                    <InfoRow sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Category fontSize="small" />
                        AI Screening Status
                      </Typography>

                      <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        setAnalyzerLoadingId(candidate._id);

                        setTimeout(async () => {
                          try {
                            await handleRunAnalyzer(candidate.jobPostId, candidate.resume, candidate._id);
                          } finally {
                            setAnalyzerLoadingId(null);
                          }s
                        }, 0);
                      }}
                      disabled={analyzerLoadingId === candidate._id}
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        fontWeight: 500,
                        textTransform: "none",
                        borderRadius: "16px",
                        padding: "5px 10px",
                        minWidth: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        opacity: 0.9,
                        position: "relative",
                      }}
                    >

                     {getStatusLabel(candidate.AI_Screeing_Status)}
                      {analyzerLoadingId === candidate._id && <CircularProgress size={16} sx={{ mr: 1, color: "white" }} /> }
                    </Button>

                    </InfoRow>

                    <InfoRow sx={{ mb: 2 }}>
                      <Chip
                        label={candidate.position}
                        variant="outlined"
                        sx={{
                          color: scoreColor.color,
                          borderColor: scoreColor.color,
                          fontWeight: 600,
                        }}
                      />
                    </InfoRow>

                    {/* Enhanced Confidence Progress Bar */}
                    {/* <Box sx={{ mb: 3 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" fontWeight="600" color="text.secondary">
                                  Confidence Level
                                </Typography>
                                <Typography variant="body2" fontWeight="700" sx={{ color: scoreColor.color }}>
                                  {candidate.AI_Confidence}%
                                </Typography>
                              </Box>
                              <ConfidenceProgress
                                variant="determinate"
                                value={candidate.AI_Confidence}
                                scoreColor={scoreColor.color}
                              />
                            </Box> */}

                    {/* Enhanced Action Buttons */}
                    <Stack direction="row" spacing={1}>
                      <ViewButton
                        className="view-button"
                        scoreColor={scoreColor.color}
                        fullWidth
                        startIcon={<Visibility fontSize="small" />}
                        onClick={() => router.push(`/JobApplications/aiScreening/aiScreenedCandidate/candidatesProfile?id=${candidate?._id}`)}
                      >
                        View Profile
                      </ViewButton>
                    </Stack>
                  </Box>
                </StyledScreenedCard>}
            </Grid>)
        })}
      </Grid>

      {/* View More / View Less Button for candidates within position */}
      {/* {positionCandidates.length > INITIAL_CANDIDATES_TO_SHOW && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ViewMoreButton
                variant="outlined"
                onClick={() => togglePositionExpand(position)}
                endIcon={expandedPositions[position] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              >
                {expandedPositions[position]
                  ? "View Less"
                  : `View ${positionCandidates.length - INITIAL_CANDIDATES_TO_SHOW} More`}
              </ViewMoreButton>
            </Box>
          )} */}
      {/* </Box>
      ))} */}

      {/* View More / View Less Button for job positions */}
      {/* {Object.entries(candidatesByPosition).length > INITIAL_POSITIONS_TO_SHOW && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <ViewMoreButton
            variant="outlined"
            onClick={toggleJobPositionsExpand}
            endIcon={expandedJobPositions.showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            sx={{
              fontSize: "1rem",
              py: 1.5,
              px: 3,
              fontWeight: 600,
            }}
          >
            {expandedJobPositions.showAll
              ? "View Less Job Openings"
              : `View ${Object.entries(candidatesByPosition).length - INITIAL_POSITIONS_TO_SHOW} More Job Openings`}
          </ViewMoreButton>
        </Box>
      )} */}

      {/* <PaginationComponent
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[30,40, 50]}
              count={totalItems}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            /> */}

      {/* Resume Modal */}
      <ResumeModal open={resumeModalOpen} onClose={() => setResumeModalOpen(false)} candidate={selectedCandidate} />
    </Container>
  )
}

export default CandidateManagement
