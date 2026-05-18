"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Button,
  Tabs,
  Tab,
  Grid,
  Avatar,
  LinearProgress,
  Paper,
  Container,
  Stack,
  useTheme,
  alpha,
  Divider,
  IconButton
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  Tooltip,
} from "recharts"
import {
  People as Users,
  PersonAdd as UserCheck,
  PersonOff as UserX,
  Schedule as Clock,
  TrendingUp,
  TrendingDown,
  Psychology as Brain,
  GpsFixed as Target,
  FilterList as Filter,
  CalendarToday as Calendar,
  Business as Building,
  EmojiEvents as Award,
  Warning as AlertTriangle,
  CheckCircle,
  Cancel as XCircle,
  Visibility as Eye,
  Bolt as Zap,
  BarChart as BarChart3,
  PieChart as PieChartIcon,
  Star,
  Timer,
  Work as Briefcase,
  Public as Globe,
  Security as Shield,
  Memory as Cpu,
  Timeline as Activity,
  Whatshot as Flame,
  AcUnit as Snowflake,
  PictureAsPdf,
  DocumentScanner,
} from "@mui/icons-material"
import { Person, Email, CalendarToday, Visibility, WorkOutline } from "@mui/icons-material"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
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

const StyledCard = styled(Card, {
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
        borderColor:scoreColor,
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
  
  
  
  // Helper function to get candidate initials
  const getInitials = (name) => {
    if (!name) return "?"
    const nameParts = name.split(" ")
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    }
    return name[0].toUpperCase()
  }


const getScoreColor = (score) => {
    if (score >= 90) return { color: "#10b981", bg: "#d1fae5" } // Green
    if (score >= 80) return { color: "#3b82f6", bg: "#dbeafe" } // Blue
    if (score >= 60) return { color: "#f59e0b", bg: "#fef3c7" } // Yellow/Orange
    return { color: "#ef4444", bg: "#fee2e2" } // Red
  }


export default function AIScreeningDashboard() {

  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter()
  const [positionsWithCandidates, setPositionsWithCandidates] = useState([]) 
  const [candidatesStats, setCandidatesStat] = useState({})
  const getPositionsWithCandidates = async () => {
        try {
            const res = await  axios.get(`${baseUrl}/v1/api/job/analizedCandidate`, {
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
            })
            if(res.data.status){
            setPositionsWithCandidates(res.data.message.candidates)
            setCandidatesStat(res.data.message.summary)
            } 
        } catch (error) {
            console.error("Error adding job description:", error)
        }
    }


    useEffect(()=>{
    getPositionsWithCandidates()
    },[])

  // State to track expanded positions for job openings
    const [expandedJobPositions, setExpandedJobPositions] = useState({})
  
    // Number of job positions to show initially
    const INITIAL_POSITIONS_TO_SHOW = 3
  
    // Toggle expanded state for job positions listing
    const toggleJobPositionsExpand = () => {
      setExpandedJobPositions((prev) => ({ showAll: !prev.showAll }))
    }

    const getVisibleJobPositions = () => {
      const positions = positionsWithCandidates
      if (expandedJobPositions.showAll) {
        return positions
      }
      return positions.slice(0, INITIAL_POSITIONS_TO_SHOW)
    }


  return (
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  background: "linear-gradient(135deg,rgb(111, 241, 239) 0%,rgb(46, 226, 94) 100%)",
                  width: 30,
                  height: 30,
                }}
              >
                <Brain />
              </Avatar>
              <Box sx={{ml:2}}>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  AI Screening Analytics
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Navigation Tabs */}
          <Paper
          sx={{
            mb: 3,
            background: "linear-gradient(135deg,rgb(153, 108, 237) 0%,rgb(123, 88, 189) 100%)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          
          >
          </Paper>

            {/* Candidates Tab */}
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Card sx={{ background: "#e0e7ff", border: "1px solid #c7d2fe", height:"120px" }}>
                  <CardHeader sx={{height:"30px"}}
                      title={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography fontSize={18} fontWeight={600} color="#3730a3">
                            Total Candidates
                          </Typography>
                          <Users sx={{ color: "#6366f1" }} fontSize="large"/>
                        </Box>
                      }
                    />
                    <CardContent>
                      <Typography fontSize={18} fontWeight="bold" color="#3730a3">
                        {candidatesStats?.totalCandidates}
                      </Typography>
                      <Typography fontSize={15} mt={2}  color="#6366f1">
                        Across all positions
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card sx={{ background: "#dcfce7", border: "1px solid #bbf7d0",height:"120px" }}>
                  <CardHeader sx={{height:"30px"}}
                      title={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography fontSize={18} fontWeight={600} color="#166534">
                            High Scorers
                          </Typography>
                          <Award sx={{ color: "#16a34a" }} fontSize="large"/>
                        </Box>
                      }
                    />
                    <CardContent sx={{ pt: 0 }}>
                      <Typography fontSize={18} fontWeight="bold" color="#166534">
                        {candidatesStats?.highScorers}
                      </Typography>
                      <Typography fontSize={15} mt={2}  color="#16a34a">
                        AI Score ≥ 90
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card sx={{ background: "#fce7f3", border: "1px solidrgb(246, 154, 205)",height:"120px" }}>
                    <CardHeader sx={{height:"30px"}}
                      title={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography color="#be185d" fontSize={18} fontWeight={600}>
                            Avg AI Score
                          </Typography>
                          <Brain sx={{ color: "#ec4899" }} fontSize="large"/>
                        </Box>
                      }
                    />
                    <CardContent sx={{ pt: 0 }}>
                      <Typography fontSize={18} fontWeight="bold" color="#be185d" >
                        {candidatesStats?.avgAIScore}
                      </Typography>
                      <Typography fontSize={15} mt={2} color="#ec4899" >
                        Overall average
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Candidates by Position */}
              <Stack spacing={4}>
      {getVisibleJobPositions().map((positionData) => {
        const { _id, position, applicationsCount, averageScore, candidates } = positionData

        return (
          <Card
            key={_id}
            sx={{
              background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Enhanced Header */}
            <CardHeader
              sx={{ pb: 2 }}
              title={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight="700"
                      sx={{
                        background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 0.5,
                      }}
                    >
                      {position}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Person fontSize="small" />
                        {applicationsCount} candidates
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <TrendingUp fontSize="small" />
                        Avg Score: {averageScore}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`${candidates.length} Active`}
                    sx={{
                      bgcolor: "#f0f9ff",
                      color: "#0369a1",
                      fontWeight: "600",
                      border: "1px solid #0ea5e920",
                    }}
                  />
                </Box>
              }
            />

            <CardContent sx={{ pt: 0 }}>
              {/* Enhanced Grid layout */}
              <Grid container spacing={4}>
                {candidates
                  .sort((a, b) => b.AI_Score - a.AI_Score)
                  .map((candidate) => {
                    const scoreColor = getScoreColor(candidate.AI_Score)

                    return (
                      <Grid item xs={12} sm={6} md={3} key={candidate._id}>
                        {/* Fixed: Pass scoreColor.color as scoreColor prop */}
                        <StyledCard scoreColor={scoreColor.color}>
                          <Box sx={{ p: 3, position: "relative", zIndex: 1 }}>
                            {/* Enhanced Avatar and Name Section */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                              <StyledAvatar className="candidate-avatar">{getInitials(candidate.name)}</StyledAvatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h6" fontWeight="600" noWrap sx={{ color: "#1e293b", mb: 0.5 }}>
                                  {candidate.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  noWrap
                                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                >
                                  <Email fontSize="small" />
                                  {candidate.email || `${candidate.name?.toLowerCase().replace(/\s+/g, ".")}@email.com`}
                                </Typography>
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

                            {/* Enhanced AI Confidence */}
                            <InfoRow sx={{ mb: 2 }}>
                              <Typography variant="body2" fontWeight="600">
                                AI Confidence
                              </Typography>
                              <Typography variant="body2" fontWeight="600" sx={{ color: scoreColor.color }}>
                                {candidate.AI_Confidence}%
                              </Typography>
                            </InfoRow>

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
                              <IconButton  onClick={() => {
                            if (candidate?.resume) {
                                    window.open(candidate?.resume, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                                sx={{ display: "flex", alignItems: "center", gap: 2 ,cursor: 'pointer' }}
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
                              <Typography variant="body2" color="text.secondary" fontWeight="500">
                                {new Date(candidate.appliedDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </Typography>
                            </InfoRow>

                            {/* Enhanced Confidence Progress Bar */}
                            <Box sx={{ mb: 3 }}>
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
                            </Box>

                            {/* Enhanced Action Buttons */}
                            <Stack direction="row" spacing={1}>
                              <ViewButton
                                className="view-button"
                                scoreColor={scoreColor.color}
                                fullWidth
                                startIcon={<Visibility fontSize="small" />}
                                onClick={()=>router.push(`/JobApplications/aiScreening/aiScreenedCandidate/candidatesProfile?id=${candidate?._id}`)}
                              >
                                View Profile
                              </ViewButton>
                              <Tooltip title="Quick Actions">
                                <IconButton
                                  size="small"
                                  sx={{
                                    border: `2px solid ${scoreColor.color}30`,
                                    color: scoreColor.color,
                                    "&:hover": {
                                      backgroundColor: `${scoreColor.color}10`,
                                    },
                                  }}
                                >
                                  <Star fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                        </StyledCard>
                      </Grid>
                    )
                  })}
              </Grid>
            </CardContent>
          </Card>
        )
      })}
    </Stack>
    {positionsWithCandidates.length > INITIAL_POSITIONS_TO_SHOW && (
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
              ? "View Less Positions"
              : `View ${positionsWithCandidates.length - INITIAL_POSITIONS_TO_SHOW} More Positions`}
          </ViewMoreButton>
        </Box>
      )}
            </Stack>

        </Box>
      </Container>

  )
}