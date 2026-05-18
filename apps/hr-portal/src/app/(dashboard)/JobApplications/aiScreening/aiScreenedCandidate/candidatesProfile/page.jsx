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
  DialogTitle,
  TextField,
  CardContent,
  Divider
} from "@mui/material"
import { useSearchParams, useRouter } from "next/navigation"
import {
  CheckCircle,
  Warning,
  ExpandMore,
  TrendingUp,
  Psychology,
  School,
  Work,
  Code,
  Cancel,
  People,
  Lightbulb,
  Speed,
  Assessment,
  Verified,
  ErrorOutline,
  ArrowUpward,
  Download,
  Print,
  Share,
  Info,
  ArrowForward,
  PictureAsPdf,
  Notes,
  Calculate,
  WhatsApp,
  EmailOutlined,
  Pause,
} from "@mui/icons-material"
import {
  Star,
  Person,
  Email,
  Phone,
  Business,
  AttachMoney,
  Schedule,
} from "@mui/icons-material"
import { ArrowBack, KeyboardReturn } from '@mui/icons-material';
import { styled, keyframes } from "@mui/material/styles"
import Lottie from "lottie-react"
import loader from "./loader.json"
import { useApi } from "@core/hooks/useApi"
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

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
  height: '100%',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

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
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }
}))


const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#111827',
  marginBottom: theme.spacing(2),
  fontSize: '18px',
  fontFamily: '"Inter", sans-serif'
}))

const SkillChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#eff6ff',
  color: '#1e40af',
  fontWeight: 500,
  fontSize: '12px',
  height: '28px',
  borderRadius: '6px',
  '&:hover': {
    backgroundColor: '#dbeafe'
  }
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

// Main Component
export default function AiScreeningDashboard({ screeningData }) {
  const [tabValue, setTabValue] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"))
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const router = useRouter()

  const [candidateData, setCandidateData] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState("")
  const [updatedStatus, setUpdatedStatus] = useState("")
  const [remark, setRemark] = useState("")
  const [statusChangeModal,setStatusChangeModal] = useState(false)
  const { callApi } = useApi()
  const [cardMode, setCardMode] = useState("normal")
  const [resumeStatus, setResumeStatus] = useState("")


const getcandidateData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${baseUrl}/v1/api/job/getJobAppliedById/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
        setCandidateData(res.data.items)
        setResumeStatus(res.data.items?.resumeShortlisted)
        setCardMode("normal")
        if(res.data.items.AI_Screeing_Status==="Completed"){
          const res = await axios.get(`${baseUrl}/v1/api/job/viewAnalizedata/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });
          setCardMode("ai")
          setCandidateData(res.data.items)
        }
      } catch (error) {
        console.error('Error fetching ID setup:', error);
      } finally{
        setLoading(false)
      }
}

useEffect(()=>{
  getcandidateData()
},[id])
 
  // Animation delay for staggered entrance
  const [animationVisible, setAnimationVisible] = useState(false)
  useEffect(() => {
    setAnimationVisible(true)
  }, [])

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // or return "-" or any placeholder
  
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  

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

  // Check if sections exist
  const hasAcceptReasons = candidateData?.acceptReason && candidateData?.acceptReason?.length > 0
  const hasRejectReasons = candidateData?.rejectReason && candidateData?.rejectReason?.length > 0
  const hasImprovementSuggestions = candidateData?.improvementSuggestions && candidateData?.improvementSuggestions?.length > 0
  const hasRiskFactors = candidateData?.riskFactors && candidateData?.riskFactors.length > 0

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
          "resumeShortlisted":updatedStatus,
          "Remark":remark
        },
        disableSnackbar: false,
      })

      if (response.success) {
        getcandidateData()
        setSelectedCandidateId("")
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally{
      setSelectedCandidateId("")
      setStatusChangeModal(false)
      setUpdatedStatus("")
      setRemark("")
    }
  }

  const NavigationButtons = ({ onBack, onPrevious, onNext,previousDisabled,nextDisabled }) => {
    return (
      <Box display="flex" justifyContent="space-between" mt={4} gap={2} flexWrap="wrap">
        {/* Back Button */}
        <Button
          variant="outlined"
          startIcon={<KeyboardReturn />}
          onClick={onBack}
          sx={{
            color: '#374151',
            borderColor: '#cbd5e1',
            '&:hover': {
              borderColor: '#94a3b8',
              backgroundColor: '#f1f5f9',
            },
          }}
        >
          Back
        </Button>
  
        <Box display="flex" gap={2} ml="auto">
          {/* Previous Button */}
      {previousDisabled && <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={onPrevious}
            sx={{
              backgroundColor: '#e0f2f1',
              color: '#00695c',
              '&:hover': {
                backgroundColor: '#b2dfdb',
              },
            }}
          >
            Previous
          </Button>}
  
          {/* Next Button */}
        {nextDisabled && <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={onNext}
            sx={{
              backgroundColor: '#4ecdc4',
              color: 'white',
              '&:hover': {
                backgroundColor: '#38b2ac',
              },
            }}
          >
            Next
          </Button>}
        </Box>
      </Box>
    );
  };
  

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      {loading ? <Box>
        <Lottie animationData={loader} style={{ height: 200 }} />
      </Box> : 
     (cardMode==="ai" ? 
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
          <Box sx={{width:"100%"}}>
            <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
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
        {/* <IconButton onClick={()=>router.push("/JobApplications?stage=3")}><ArrowForward/></IconButton>       */}
            <NavigationButtons
              onBack={() =>router.push("/JobApplications?stage=2")}
              onPrevious={() =>router.push(`/JobApplications/aiScreening/aiScreenedCandidate/candidatesProfile?id=${candidateData?.previousCandidateId}`)}
              onNext={() => router.push(`/JobApplications/aiScreening/aiScreenedCandidate/candidatesProfile?id=${candidateData?.nextCandidateId}`)}
              previousDisabled={candidateData?.previousCandidateId}
              nextDisabled={candidateData?.nextCandidateId}
            />
            </Box>
            <Typography variant="body1" color="text.secondary">
              {candidateData?.position} • {candidateData?.department} • Analyzed {formatDate(candidateData?.createdAt)}
            </Typography>
          </Box>

          {/* <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" startIcon={<Download />} size={isMobile ? "small" : "medium"}>
              Export
            </Button>
            <Button variant="outlined" startIcon={<Print />} size={isMobile ? "small" : "medium"}>
              Print
            </Button>
            <Button variant="outlined" startIcon={<Share />} size={isMobile ? "small" : "medium"}>
              Share
            </Button>
          </Box> */}
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
                <Typography
                  variant="h3"
                  fontWeight="800"
                  color="primary"
                >
                  {candidateData?.overallScore}%
                </Typography>
              </Box>
            </ScoreCircle>
          </Box>
          <Typography
            variant="h6"
            my={3}
            fontWeight={600}
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
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
                icon={
                  candidateData?.decision === "Approved" ? (
                    <CheckCircle />
                  ) : (
                    <Warning />
                  )
                }
                label={
                  candidateData?.decision === "Approved"
                    ? "Recommended"
                    : "Not Recommended"
                }
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 4 },
              mb: { xs: 1, md: 2 },
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="500"
              sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            >
              Change Decision:
            </Typography>
            <Box sx={{ display: "flex", gap: { xs: 1, md: 2 } }}>
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCandidateId(candidateData?.candidateId);
                    setStatusChangeModal(true);
                    setUpdatedStatus("shortlisted");
                  }}
                  sx={{
                    color: "white",
                    backgroundColor: "success.main",
                    "&:disabled": { backgroundColor: "grey.400" },
                  }}
                  disabled={resumeStatus === "shortlisted"}
                >
                  <CheckCircle fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  size="small"
                  disabled={resumeStatus === "notshortlisted"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCandidateId(candidateData?.candidateId);
                    setStatusChangeModal(true);
                    setUpdatedStatus("notshortlisted");
                  }}
                  sx={{
                    color: "white",
                    backgroundColor: "error.main",
                    "&:disabled": { backgroundColor: "grey.400" },
                  }}
                >
                  <Cancel fontSize="small" />
                </IconButton>
              </Tooltip>
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
            color: '#1e1b4b', // Deep indigo for elegance
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            textAlign: 'center',
            fontSize: '1.1rem',
            background: 'linear-gradient(to right, #1e1b4b, #3b82f6)', // Gradient text
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Candidate Profile
        </Typography>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, md: 4 },
            bgcolor: 'rgba(230, 244, 255, 0.8)', // Soft slate background
            borderRadius: 3,
            border: '1px solid #3b67df', 
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#3b67df', 
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: '#173a9a' }}>Name:</Box>
              {candidateData?.userInfo?.name || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#3b67df',
                fontSize: '0.9rem',
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                '&:hover .email-icon': {
                  color: '#3b82f6', // Blue on hover
                  transform: 'scale(1.2)', // Slight icon zoom
                  transition: 'all 0.2s ease',
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                const width = 600;
                const height = 700;
                const left = window.innerWidth / 2 - width / 2 + window.screenX;
                const top = window.innerHeight / 2 - height / 2 + window.screenY;
                const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${candidateData?.userInfo?.email}&tf=1`;
                window.open(
                  url,
                  'gmailComposeWindow',
                  `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                );
              }}
            >
              <EmailOutlined
                className="email-icon"
                sx={{ fontSize: 18, color: '#173a9a' }}
              />
              <Box component="span" sx={{ color: '#173a9a' }}>Email:</Box>
              {candidateData?.userInfo?.email || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#3b67df',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                '&:hover .whatsapp-icon': {
                  color: '#22c55e', // Green on hover
                  transform: 'scale(1.2)',
                  transition: 'all 0.2s ease',
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                const width = 500;
                const height = 600;
                const left = window.innerWidth / 2 - width / 2 + window.screenX;
                const top = window.innerHeight / 2 - height / 2 + window.screenY;
                const url = `https://wa.me/${candidateData?.userInfo?.mobile}`;
                window.open(
                  url,
                  'whatsappPopup',
                  `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                );
              }}
            >
              <WhatsApp
                className="whatsapp-icon"
                sx={{ fontSize: 18, color: '#173a9a' }}
              />
              <Box component="span" sx={{ color: '#173a9a' }}>Mobile:</Box>
              {candidateData?.userInfo?.mobile || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#3b67df',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: '#173a9a' }}>Position:</Box>
              {candidateData?.userInfo?.position || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#3b67df',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: '#173a9a' }}>
                Experience By AI:
              </Box>
              {candidateData?.CandidateAIExperince <= 0
                ? 'Fresher'
                : candidateData?.CandidateAIExperince
                ? `${candidateData?.CandidateAIExperince} Years`
                : 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#3b67df',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: '#173a9a' }}>Job Type:</Box>
              {candidateData?.userInfo?.JobType || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#3b67df',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: '#173a9a' }}>
                Current CTC:
              </Box>
              {candidateData?.userInfo?.currentCTC || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#3b67df',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: '#173a9a' }}>
                Expected CTC:
              </Box>
              {candidateData?.userInfo?.expectedCTC || 'N/A'}
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
                  {/* <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      AI Confidence
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {candidateData?.AI_Confidence}%
                    </Typography>
                  </Box> */}
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
              <Typography variant="h6" fontWeight="600" sx={{ mt: 5,mb:3 }}>
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
            {/* {hasAcceptReasons && status==="Completed" && <Tab icon={<CheckCircle />} label="Strengths" iconPosition="start" />}
            {(hasRejectReasons || hasImprovementSuggestions) && status==="Completed" &&(
              <Tab icon={<Warning />} label="Focus Areas & Suggestions" iconPosition="start" />
            )}
            {hasRiskFactors && status==="Completed"  && <Tab icon={<ErrorOutline />} label="Risk Factors" iconPosition="start" />} */}
            <Tab icon={<Notes />} label="Job Description" iconPosition="start" />
            <Tab icon={<PictureAsPdf />} label="Resume" iconPosition="start" />
            {cardMode==="ai"  && <Tab icon={<Assessment />} label="Criteria Breakdown" iconPosition="start" />}
            {cardMode==="ai"  && <Tab icon={<Calculate />} label="Diagnostics" iconPosition="start" />}

          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={2}>
          <StyledCard>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
                Evaluation Criteria Breakdown
              </Typography>
              <Grid container spacing={3}>
                {candidateData?.criteria && candidateData?.criteria.map((criterion, index) => (
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
        {hasAcceptReasons && (
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
            </StyledCard>    )}
            {(hasRejectReasons || hasImprovementSuggestions) && (
            <Grid container spacing={3} sx={{mt:3}}>
              {/* Improvement Suggestions */}
              {hasImprovementSuggestions && (
                <Grid item xs={12} md={hasRejectReasons ? 6 : 12}>
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
              {hasRejectReasons && (
                <Grid item xs={12} md={hasImprovementSuggestions ? 6 : 12}>
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
              {!hasRejectReasons && !hasImprovementSuggestions && (
                <Grid item xs={12}>
                  <Alert severity="info" icon={<Info />}>
                    No improvement areas or suggestions have been identified for this candidate.
                  </Alert>
                </Grid>
              )}
            </Grid>
                )}

        {hasRiskFactors && (
           <StyledCard sx={{mt:3}}>
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
                                    risk.level === "High" ? "#fee2e2" : risk.level === "Medium" ? "#fef3c7" : "#f1f5f9",
                                  color:
                                    risk.level === "High" ? "#ef4444" : risk.level === "Medium" ? "#f59e0b" : "#64748b",
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
            </StyledCard>)}
          </TabPanel>
    

         <TabPanel
          value={tabValue}
          index={0}
        >       
         <InfoCard sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              {/* Job Summary */}
              <Box sx={{ mb: 5 }}>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Job Summary
                </Typography>
                <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant='body2' sx={{ lineHeight: 1.6, color: '#4b5563', fontSize: '14px' }}>
                    {candidateData?.jobdescription?.JobSummary || 'Job summary not available'}
                  </Typography>
                </Paper>
              </Box>

              {/* Roles and Responsibilities */}
              <Box sx={{ mb: 5 }}>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Roles and Responsibilities
                </Typography>
                <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  {(candidateData?.jobdescription?.responsibilities || []).length > 0 ? (
                    <Stack spacing={1.5}>
                      {candidateData?.jobdescription?.responsibilities.map((role, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 16, mt: 0.2 }} />
                          <Typography variant='body2' sx={{ lineHeight: 1.5, color: '#4b5563', fontSize: '14px' }}>
                            {role}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant='body2' color='#9ca3af' sx={{ fontSize: '14px' }}>
                      Roles and responsibilities not specified
                    </Typography>
                  )}
                </Paper>
              </Box>
              <Box>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Key Skills Required
                </Typography>
                <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                {(candidateData?.jobdescription?.keySkills || []).length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {candidateData?.jobdescription?.keySkills.map((skill, index) => (
                      <SkillChip key={index} label={skill} icon={<Star sx={{ fontSize: 14 }} />} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant='body2' color='#9ca3af' sx={{ fontSize: '14px' }}>
                    Key skills not specified
                  </Typography>
                )}
                </Paper>
              </Box>
            </CardContent>
          </InfoCard>
        </TabPanel>

        <TabPanel
          value={tabValue}
          index={1}
        >          {candidateData?.resume ? (
                    <Box sx={{ height: '700px', border: '1px solid #ccc'}}>
                      <iframe
                        src={candidateData.resume}
                        title="Resume PDF"
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No Resume Available
                    </Typography>
                  )}
        </TabPanel>


        {/* Skills Breakdown */}
        {/* <Box sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
            Skills & Attributes Breakdown
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(candidateData.breakdown).map(([key, value], index) => {
              // Format the key for display
              const formattedKey = key
                .replace(/_/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")

              // Determine color based on score
              const getColor = (score) => {
                if (score >= 90) return "#10b981"
                if (score >= 70) return "#3b82f6"
                if (score >= 50) return "#f59e0b"
                return "#ef4444"
              }

              const color = getColor(value)

              return (
                <Grid item xs={12} sm={6} md={3} key={key}>
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
                        boxShadow: `0 10px 25px ${color}20`,
                      },
                      animation: `${fadeIn} 0.5s ease-out forwards ${index * 0.05}s`,
                      opacity: animationVisible ? 1 : 0,
                    }}
                  >
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                      {formattedKey}
                    </Typography>
                    <Box sx={{ position: "relative", mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={value}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "#f1f5f9",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: color,
                            borderRadius: 4,
                          },
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          right: 0,
                          top: -20,
                          bgcolor: color,
                          color: "white",
                          borderRadius: "12px",
                          px: 1,
                          py: 0.5,
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        {value}%
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        </Box> */}
      </Container> :    
     <Container maxWidth="xl">
     {/* Header Section */}
     <Fade in timeout={500}>
       <Box sx={{width:"100%", mb:3}}>
            <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
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
        {/* <IconButton onClick={()=>router.push("/JobApplications?stage=3")}><ArrowForward/></IconButton>      */}
        <NavigationButtons
              onBack={() =>router.push("/JobApplications?stage=2")}
              onPrevious={() =>router.push(`/JobApplications/aiScreening/aiScreenedCandidate/candidatesProfile?id=${candidateData?.previousCandidateId}`)}
              onNext={() => router.push(`/JobApplications/aiScreening/aiScreenedCandidate/candidatesProfile?id=${candidateData?.nextCandidateId}`)}
              previousDisabled={candidateData?.previousCandidateId}
              nextDisabled={candidateData?.nextCandidateId}
            />       
            </Box>
            <Typography fontSize={15} color="text.secondary" >
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
                     <InfoItem icon={<Email />} label="Email Address" value={candidateData?.emailId} />
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
                       icon={<AttachMoney />}
                       label="Current CTC"
                       value={candidateData?.currentCTC}
                       color="secondary"
                     />
                     <InfoItem
                       icon={<AttachMoney />}
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
           </Tabs>
         </Paper>
       </Box>
     </Fade>

     <TabPanel
          value={tabValue}
          index={0}
        >       
         <InfoCard sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              {/* Job Summary */}
              <Box sx={{ mb: 5 }}>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Job Summary
                </Typography>
                <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant='body2' sx={{ lineHeight: 1.6, color: '#4b5563', fontSize: '14px' }}>
                    {candidateData?.jobDescriptionDetail?.jobDescription?.JobSummary || 'Job summary not available'}
                  </Typography>
                </Paper>
              </Box>

              {/* Roles and Responsibilities */}
              <Box sx={{ mb: 5 }}>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Roles and Responsibilities
                </Typography>
                <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  {(candidateData?.jobDescriptionDetail?.jobDescription?.RolesAndResponsibilities || []).length > 0 ? (
                    <Stack spacing={1.5}>
                      {candidateData?.jobDescriptionDetail?.jobDescription?.RolesAndResponsibilities.map((role, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 16, mt: 0.2 }} />
                          <Typography variant='body2' sx={{ lineHeight: 1.5, color: '#4b5563', fontSize: '14px' }}>
                            {role}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant='body2' color='#9ca3af' sx={{ fontSize: '14px' }}>
                      Roles and responsibilities not specified
                    </Typography>
                  )}
                </Paper>
              </Box>
              <Box>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Key Skills Required
                </Typography>
                <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                {(candidateData?.jobDescriptionDetail?.jobDescription?.KeySkills || []).length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {candidateData?.jobDescriptionDetail?.jobDescription?.KeySkills.map((skill, index) => (
                      <SkillChip key={index} label={skill} icon={<Star sx={{ fontSize: 14 }} />} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant='body2' color='#9ca3af' sx={{ fontSize: '14px' }}>
                    Key skills not specified
                  </Typography>
                )}
                </Paper>
              </Box>
            </CardContent>
          </InfoCard>
        </TabPanel>

        <TabPanel
          value={tabValue}
          index={1}
        >          {candidateData?.resume ? (
                    <Box sx={{ height: '700px', border: '1px solid #ccc'}}>
                      <iframe
                        src={candidateData.resume}
                        title="Resume PDF"
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No Resume Available
                    </Typography>
                  )}
        </TabPanel>
   </Container>)}
       <Dialog open={statusChangeModal} onClose={()=>{setStatusChangeModal(false); setSelectedCandidateId(""); setUpdatedStatus(""); setRemark("")}} maxWidth="xs" fullWidth>
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
                      onChange={(e)=>setRemark(e.target.value)}
                      SelectProps={{ native: false }}
                    >
                    </TextField>
                  </Grid>
                 
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={()=>{setSelectedCandidateId(""); setStatusChangeModal(false);  setUpdatedStatus(""); setRemark("")}} size="small" color="secondary" variant="outlined">
                  Cancel
                </Button>
                <Tooltip title={'Please Add Remark'} arrow>
                <span>
                  <Button
                    onClick={handleResumeShorlisted}
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={!remark}
                    startIcon={<CheckCircle />}
                    sx={{ textTransform: 'none' }}
                  >
                    Submit
                  </Button>
                </span>
              </Tooltip>

              </DialogActions>
            </Dialog>
    </Box>
    
  )
}
