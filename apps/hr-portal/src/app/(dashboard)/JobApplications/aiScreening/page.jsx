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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
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
  Layers,
  Rocket,
  Coffee,
  Whatshot as Flame,
  AcUnit as Snowflake,
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

const COLORS = ["#FF9800", "#2196F3", "#9C27B0", "#4CAF50", "#F44336", "#00BCD4", "#673AB7", "#009688", "#E91E63", "#3F51B5"]


const getScoreColor = (score) => {
    if (score >= 90) return { color: "#10b981", bg: "#d1fae5" } // Green
    if (score >= 80) return { color: "#3b82f6", bg: "#dbeafe" } // Blue
    if (score >= 60) return { color: "#f59e0b", bg: "#fef3c7" } // Yellow/Orange
    return { color: "#ef4444", bg: "#fee2e2" } // Red
  }


function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const MetricCard = ({ title, value, subtitle, icon: Icon, bgColor, textColor, trend }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        background: bgColor || '#fff', // Fallback to white if bgColor is not provided
        color: textColor || '#000', // Fallback to black if textColor is not provided
        minWidth: 200,
        flexShrink: 0,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <CardHeader
        sx={{ pb: 1 }}
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="body2"
              sx={{ opacity: 0.8, fontWeight: 500, color: textColor || '#000' }} // Explicitly set color
            >
              {title}
            </Typography>
            <Icon sx={{ opacity: 0.7, fontSize: 20, color: textColor || '#000' }} /> {/* Explicitly set color */}
          </Box>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography
          variant="h3"
          component="div"
          fontWeight="bold"
          sx={{ color: textColor || '#000' }} // Explicitly set color
        >
          {value}
        </Typography>
        {trend && (
          <Box display="flex" alignItems="center" mt={1}>
            <trend.icon
              sx={{ fontSize: 16, mr: 0.5, opacity: 0.7, color: textColor || '#000' }} // Explicitly set color
            />
            <Typography
              variant="caption"
              sx={{ opacity: 0.8, color: textColor || '#000' }} // Explicitly set color
            >
              {trend.text}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default function AIScreeningDashboard() {
  const [tabValue, setTabValue] = useState(0)
  const theme = useTheme()

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }  

  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [dayCount, setDayCount] = useState("7d")
  const router = useRouter()
    const [dashboardData, setDashboardData] = useState({})
    const getDashboardData = async () => {
        try {
            const res = await  axios.get(`${baseUrl}/v1/api/job/AIDashboard?period=${dayCount}`, {
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
            })
            if(res.data.status){
            setDashboardData(res.data.items)
            } 
        } catch (error) {
            console.error("Error adding job description:", error)
        }
    }

    const [screeningResults, setScreeningResults] = useState({})
    const [volumes, setVolumes] = useState([])
    const getScreeningResults = async () => {
        try {
            const res = await  axios.get(`${baseUrl}/v1/api/job/getScreeningAnalytics?period=${dayCount} `, {
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
            })
            if(res.data.status){
            setScreeningResults(res.data.items)
            setVolumes([
                ...(res.data.items.dashboard?.positionMatrix?.highVolume || []),
                ...(res.data.items.dashboard?.positionMatrix?.lowVolume || [])
              ]);                          } 
        } catch (error) {
            console.error("Error adding job description:", error)
        }
    }

    const [positionsWithCandidates, setPositionsWithCandidates] = useState([])
    const [candidatesStats, setCandidatesStat] = useState({})
    const getPositionsWithCandidates = async () => {
        try {
            const res = await  axios.get(`${baseUrl}/v1/api/job/analizedCandidate `, {
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
    getDashboardData()
    getScreeningResults()
    getPositionsWithCandidates()
    },[dayCount])

    const confidenceDistribution =
  screeningResults?.confidenceDistribution?.map((entry, index) => ({
    ...entry,
    color: COLORS[index % COLORS.length],
  })) || [];

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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        p: 3,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  background: "linear-gradient(135deg,rgb(111, 241, 239) 0%,rgb(46, 226, 94) 100%)",
                  width: 48,
                  height: 48,
                }}
              >
                <Brain />
              </Avatar>
              <Box sx={{ml:2}}>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  AI Screening Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Monitor and analyze AI-powered candidate screening results
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    backgroundColor: "#f8fafc",
                  },
                }}
                onClick={()=>setDayCount("7d")}
              >
                Last 7 Days
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    backgroundColor: "#f8fafc",
                  },
                }}
                onClick={()=>setDayCount("30d")}
              >
                Last 30 Days
              </Button>
            </Stack>
          </Box>
          {/* // background: "linear-gradient(135deg,rgb(40, 156, 223) 0%,rgb(127, 28, 227) 100%)", */}

          {/* Navigation Tabs */}
          <Paper
          sx={{
            mb: 3,
            background: "linear-gradient(135deg,rgb(153, 108, 237) 0%,rgb(123, 88, 189) 100%)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  minHeight: 58,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    color: "rgba(255, 255, 255, 1)", 
                    transition: "color 0.3s ease", 
                  },
                  "&.Mui-selected": {
                    color: "white",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "white",
                  height: 3,
                },
              }}
            >
              <Tab icon={<BarChart3 />} label="Overview" iconPosition="start" />
              <Tab icon={<Users />} label="All Candidates" iconPosition="start" />
            </Tabs>
          </Paper>

          <TabPanel value={tabValue} index={0}>
            {/* Overview Tab */}
            <Stack spacing={6}>
              {/* Primary Metrics Section */}
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #3b82f6, #8b5cf6)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    Key Performance Metrics
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
                    pb: 2,
                    "&::-webkit-scrollbar": {
                      height: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: alpha(theme.palette.grey[300], 0.3),
                      borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: alpha(theme.palette.grey[500], 0.5),
                      borderRadius: 3,
                    },
                  }}
                >
                   <Grid container spacing={3} sx={{ mb: 3 }}>
                   <Grid item xs={12} sm={6} lg={3}>
                   <MetricCard
                  title="Total Applications"
                  value={dashboardData?.keyMetrics?.totalApplications}
                  icon={Users}
                  bgColor="#e0f2fe"
                  textColor="#0277bd"
/>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                    title="AI Approved"
                    value={dashboardData?.keyMetrics?.aiApproved}
                    icon={UserCheck}
                    bgColor="#e8f5e9" 
                    textColor="#2e7d32" 
                />
                </Grid>
                                <Grid item xs={12} sm={3}>
                <MetricCard
                    title="AI Rejected"
                    value={dashboardData?.keyMetrics?.aiRejected}
                    icon={UserX}
                    bgColor="#ffebee"
                    textColor="#c62828" 
                />
                </Grid>
                 

                  
<Grid item xs={12} sm={3}>
  <MetricCard
    title="Processing Speed"
    value={dashboardData?.keyMetrics?.processingSpeed}
    icon={Zap}
    bgColor="#e3f2fd" // Light blue background to indicate speed/efficiency
    textColor="#1565c0" // Dark blue text for good contrast
  />
</Grid>
                  </Grid>
                 
                </Box>
              </Box>

              {/* Secondary Metrics Section */}
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #f59e0b, #ea580c)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    Operational Insights
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
                    pb: 2,
                    "&::-webkit-scrollbar": {
                      height: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: alpha(theme.palette.grey[300], 0.3),
                      borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: alpha(theme.palette.grey[500], 0.5),
                      borderRadius: 3,
                    },
                  }}
                >

              <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={3}>
                <MetricCard
                  title="Interview Scheduled"
                  value={dashboardData?.insights?.interviewScheduled}
                  icon={Calendar}
                  bgColor="#e6f7fa" 
                  textColor="#00695c" 
                />
              </Grid>

          <Grid item xs={12} sm={3}>
                <MetricCard
                    title="AI Confidence"
                    value={dashboardData?.insights?.aiConfidence}
                    // subtitle="Average score"
                    icon={Brain}
                    bgColor="#cffafe"
                    textColor="#155e75"
                    // trend={{ icon: Star, text: "Average score" }}
                  />
              </Grid>
             <Grid item xs={12} sm={3}>
                <MetricCard
                    title="Active Departments"
                    value={dashboardData?.insights?.activeDepartments}
                    // subtitle="Hiring now"
                    icon={Building}
                    bgColor="#e0e7ff"
                    textColor="#3730a3"
                    // trend={{ icon: Briefcase, text: "Hiring now" }}
                  />
                 </Grid>
                 <Grid item xs={12} sm={3}>
                  <MetricCard
                    title="Top Skill Match"
                    value={dashboardData?.insights?.topSkillMatch}
                    // subtitle="React Development"
                    icon={Award}
                    bgColor="#fce7f3"
                    textColor="#be185d"
                    // trend={{ icon: Rocket, text: "React Development" }}
                  />
             </Grid>
                  </Grid>
                     
                </Box>
              </Box>

              {/* Performance Analytics Section */}
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #14b8a6, #059669)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    Performance Analytics
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
                    pb: 2,
                    "&::-webkit-scrollbar": {
                      height: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: alpha(theme.palette.grey[300], 0.3),
                      borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: alpha(theme.palette.grey[500], 0.5),
                      borderRadius: 3,
                    },
                  }}
                >

                <Grid container spacing={3} sx={{ mb: 3 }}>

                <Grid item xs={12} sm={3}>
                <MetricCard
                title="Accuracy Rate"
                value={dashboardData?.analytics?.accuracyRate}
                icon={Target}
                bgColor="#dcfce7" // Softer light green to align with app's pastel theme
                textColor="#166534" // Keep the dark green for good contrast
                />
                </Grid>
                <Grid item xs={12} sm={3}>
                <MetricCard
                title="High Scorers"
                value={dashboardData?.analytics?.highScorers}
                icon={Star}
                bgColor="#f0fdf4" // Softer light green to align with app's pastel theme
                textColor="#166534" // Slightly darker green for a polished look
                />
                </Grid>
                </Grid>
                 
                  {/* <MetricCard
                    title="False Positives"
                    value="3.8%"
                    subtitle="-0.5% reduction"
                    icon={AlertTriangle}
                    bgColor="#fed7aa"
                    textColor="#c2410c"
                    trend={{ icon: TrendingDown, text: "-0.5% reduction" }}
                  />
                  <MetricCard
                    title="System Uptime"
                    value="99.9%"
                    subtitle="Last 30 days"
                    icon={Activity}
                    bgColor="#f3e8ff"
                    textColor="#7c2d12"
                    trend={{ icon: Shield, text: "Last 30 days" }}
                  /> */}
                 
                </Box>
              </Box>
         
            </Stack>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #3b82f6, #8b5cf6)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    Screening Results
                  </Typography>
                </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={4}>
                <Card
                  sx={{
                    background: "#faf5ff",
                    border: "1px solid #e9d5ff",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <CardHeader
                    sx={{
                      background: "linear-gradient(135deg, #d8b4fe 0%, #c4b5fd 100%)",
                      color: "white",
                    }}
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <PieChartIcon />
                        <Typography variant="h6"
                         sx={{
                          fontWeight: 600,
                          color: '#1e293b',
                          mb: 1, 
                        }}
                        >AI Confidence Distribution</Typography>
                      </Box>
                    }
                    subheader={
                      <Typography variant="body2"  sx={{
                        fontWeight: 400,
                        color: '#1e293b',
                      }}>
                        Confidence scores of AI screening
                      </Typography>
                    }
                  />
                 <CardContent sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={confidenceDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            dataKey="count"
                            label={({ range, count }) => `${range}: ${count}`}
                            labelLine={false}
                        >
                            {confidenceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => {
                            const { payload } = props;
                            return [
                                `${value} candidates (${payload.percentage}%)`,
                                `${payload.range} [Avg Score: ${payload.avgScore}]`,
                            ];
                            }}
                        />
                        </PieChart>
                    </ResponsiveContainer>
                    </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={8}>
                <Card
                  sx={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    height:'390px'
                  }}
                >
                  <CardHeader
                    sx={{
                      background: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)",
                      color: "white",
                    }}
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <BarChart3 />
                        <Typography variant="h6"
                         sx={{
                          fontWeight: 600,
                          color: '#1e293b',
                          mb: 1, 
                        }}>
                          Rejection Reasons Analysis</Typography>
                      </Box>
                    }
                    subheader={
                      <Typography variant="body2"   sx={{
                        fontWeight: 400,
                        color: '#1e293b',
                      }}>
                        Top reasons for AI rejections
                      </Typography>
                    }
                  />
                  <CardContent sx={{mt:3}}>
                    <Stack spacing={3}>
                      {screeningResults?.rejectionReasons?.map((reason, index) => (
                        <Box key={index}>
                          <Box display="flex" justifyContent="space-between" mb={3}>
                            <Typography variant="body2" fontWeight="medium">
                              {reason.reason}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {reason.count} ({reason.percentage}%)
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={reason.percentage}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha(theme.palette.grey[300], 0.3),
                              "& .MuiLinearProgress-bar": {
                                background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    background: "#ecfdf5",
                    border: "1px solid #bbf7d0",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <CardHeader
                    sx={{
                      background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
                      color: "white",
                    }}
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Target />
                        <Typography variant="h6"  
                        sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                  }}>
                    Skills Assessment Radar
                    </Typography>
                      </Box>
                    }
                    subheader={
                      <Typography variant="body2"  
                        sx={{
                        fontWeight: 400,
                        color: '#1e293b',
                      }}
                      >
                        Average skill scores across all candidates
                      </Typography>
                    }
                  />
                <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {screeningResults?.skillsRadar ? (
                    <RadarChart
                        data={Object.entries(screeningResults.skillsRadar).map(([skill, score]) => ({
                        skill,
                        score,
                        }))}
                    >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                        name="Skills"
                        dataKey="score"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                        />
                        <Tooltip
                        formatter={(value, name) => [`${value}/100`, name]}
                        labelFormatter={(label) => `Skill: ${label}`}
                        />
                    </RadarChart>
                    ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography variant="body2" color="text.secondary">No skill data available</Typography>
                    </Box>
                    )}
                </ResponsiveContainer>
                </CardContent>

                </Card>
              </Grid>
            </Grid>
            <Stack spacing={4} mt={5}>
            <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #3b82f6, #8b5cf6)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h5" fontWeight="bold" >
                    Analytics
                  </Typography>
                </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: "#cffafe",
                      border: "1px solid #a5f3fc",
                       height:'190px'
                    }}
                  >
                    <CardHeader
                      sx={{
                        background: "linear-gradient(135deg, #67e8f9 0%, #38bdf8 100%)",
                        color: "white",
                      }}
                      title={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Zap fontSize="small" />
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: '#1e293b',
                              mb: 1, 
                            }}
                          >
                            Processing Speed
                          </Typography>
                   </Box>
                      }
                    />
                    <CardContent>
                      <Typography variant="h3" fontWeight="bold" color="#0891b2">
                        1,247
                      </Typography>
                      <Typography variant="body2" color="#0891b2" gutterBottom>
                        Applications/hour
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <TrendingUp sx={{ fontSize: 16, color: "#059669", mr: 0.5 }} />
                        <Typography variant="caption" color="#059669">
                          +12% from last week
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: "#dcfce7",
                      border: "1px solid #bbf7d0",
                       height:'190px'
                    }}
                  >
                    <CardHeader
                      sx={{
                        background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                        color: "white",
                      }}
                      title={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Target fontSize="small" />
                          <Typography variant="subtitle1"  sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        mb: 1, 
                      }}>Accuracy Rate
                      </Typography>
                                </Box>
                                  }
                    />
                    <CardContent>
                      <Typography variant="h3" fontWeight="bold" color="#15803d">
                        94.2%
                      </Typography>
                      <Typography variant="body2" color="#15803d" gutterBottom>
                        AI vs Human agreement
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <TrendingUp sx={{ fontSize: 16, color: "#059669", mr: 0.5 }} />
                        <Typography variant="caption" color="#059669">
                          +2.1% improvement
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: "#fed7aa",
                      border: "1px solid #fdba74",
                       height:'190px'
                    }}
                  >
                    <CardHeader
                      sx={{
                        background: "linear-gradient(135deg, #fb923c 0%, #fdba74 100%)",
                        color: "white",
                      }}
                      title={
                        <Box display="flex" alignItems="center" gap={1}>
                          <AlertTriangle fontSize="small" />
                          <Typography variant="subtitle1" sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                    mb: 1, 
                  }}>False Positives
                  </Typography>
                    </Box>
                      }
                    />
                    <CardContent>
                      <Typography variant="h3" fontWeight="bold" color="#c2410c">
                        3.8%
                      </Typography>
                      <Typography variant="body2" color="#c2410c" gutterBottom>
                        Incorrectly approved
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <TrendingDown sx={{ fontSize: 16, color: "#dc2626", mr: 0.5 }} />
                        <Typography variant="caption" color="#dc2626">
                          -0.5% reduction
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
            

              <Grid item xs={12}> 
              <Card
                sx={{
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  height:'320px'
                }}
              >
                <CardHeader
                  sx={{
                    background: "linear-gradient(135deg, #818cf8 0%, #a5b4fc 100%)",
                    color: "white",
                  }}
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Building />
                      <Typography variant="h6"
                       sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        mb: 1, 
                      }}>Department Performance Breakdown</Typography>
                    </Box>
                  }
                  subheader={
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                      Detailed analysis by department
                    </Typography>
                  }
                />
                <CardContent sx={{mt:6}}>
                  <Grid container spacing={2}>
                    {dashboardData?.departmentPerformance?.map((dept, index) => (
                      <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card sx={{ p: 2, background: dept.color, border: "1px solid rgba(0, 0, 0, 0.05)" }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight="bold" color="#374151">
                              {dept.department}
                            </Typography>
                            <Chip
                              label={`${dept.totalApps} apps`}
                              variant="outlined"
                              size="small"
                              sx={{
                                backgroundColor: "rgba(99, 102, 241, 0.1)",
                                color: "#6366f1",
                                borderColor: "#6366f1",
                              }}
                            />
                          </Box>
                          <Stack spacing={2}>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color="#059669" fontWeight="medium">
                                Passed: {dept.approved}
                              </Typography>
                              <Typography variant="body2" color="#dc2626" fontWeight="medium">
                                Failed: {dept.Reject}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={Number((dept.passRate || "0").replace("%", ""))}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: alpha(theme.palette.grey[300], 0.3),
                                "& .MuiLinearProgress-bar": {
                                  background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                                  borderRadius: 4,
                                },
                              }}
                            />
                            <Typography variant="caption" fontWeight="medium" color="#374151">
                              {dept?.passRate} pass rate
                            </Typography>
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
              </Grid>
              </Grid>

              <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #3b82f6, #8b5cf6)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h5" fontWeight="bold" >
                    Position Statistics
                  </Typography>
                </Box>
              <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <Card
                  sx={{
                    background: "#fed7aa",
                    border: "1px solid #fdba74",
                  }}
                >
                  <CardHeader
                    sx={{
                        background: "linear-gradient(135deg,rgb(252, 106, 28) 0%,rgb(239, 110, 110) 100%)",
                        color: "white",
                    }}
                    title={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Flame />
                            <Typography variant="h6">Hot Positions</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                            High-demand roles with many applications
                          </Typography>
                        </Box>
                        <Chip
                          label={screeningResults?.dashboard?.hotPositions[0]?.status || "Trending"}
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.3)",
                          }}
                        />
                      </Box>
                    }
                  />
                  <CardContent sx={{mt:5}}>
                    <Stack spacing={2}>
                      {screeningResults?.dashboard?.hotPositions.map((position, index) => (
                        <Card key={index} sx={{ p: 2, border: "1px solid #fdba74", background: "white" }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box flex={1}>
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Typography variant="subtitle1" fontWeight="medium">
                                  {position.position}
                                </Typography>
                                <Chip
                                  label={position.department}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha("#ea580c", 0.1),
                                    color: "#ea580c",
                                  }}
                                />
                              </Box>
                              <Box display="flex" gap={2}>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.applications} apps
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.passRate}% pass rate
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  Avg: {position.avgScore}%
                                </Typography>
                              </Box>
                            </Box>
                            <Box textAlign="right">
                              <Typography variant="h4" fontWeight="bold" color="#ea580c">
                                {position.applications}
                              </Typography>
                              <Typography variant="caption" color="#ea580c" fontWeight="medium">
                                applications
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Card
                  sx={{
                    background: "#cffafe",
                    border: "1px solid #a5f3fc",
                  }}
                >
                  <CardHeader
                    sx={{
                        background: "linear-gradient(135deg,rgb(83, 145, 246) 0%,rgb(25, 206, 238) 100%)",
                        color: "white",
                    }}
                    title={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Snowflake />
                            <Typography variant="h6">Cold Positions</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                            Positions needing attention
                          </Typography>
                        </Box>
                        <Chip
                          label={screeningResults?.dashboard?.coldPositions[0]?.status || "Needs More Attention"}
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.3)",
                          }}
                        />
                      </Box>
                    }
                  />
                  <CardContent sx={{mt:5}}>
                    <Stack spacing={2}>
                      {screeningResults?.dashboard?.coldPositions.map((position, index) => (
                        <Card key={index} sx={{ p: 2, border: "1px solid #a5f3fc", background: "white" }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box flex={1}>
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Typography variant="subtitle1" fontWeight="medium">
                                  {position.position}
                                </Typography>
                                <Chip
                                  label={position.department}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha("#3b82f6", 0.1),
                                    color: "#3b82f6",
                                  }}
                                />
                              </Box>
                              <Box display="flex" gap={2}>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.applications} apps
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.passRate}% pass rate
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  Avg: {position.avgScore}%
                                </Typography>
                              </Box>
                            </Box>
                            <Box textAlign="right">
                              <Typography variant="h4" fontWeight="bold" color="#3b82f6">
                                {position.applications}
                              </Typography>
                              <Typography variant="caption" color="#3b82f6" fontWeight="medium">
                                applications
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    background: "#faf5ff",
                    border: "1px solid #e9d5ff",
                  }}
                >
                  <CardHeader
                    sx={{
                        background: "linear-gradient(135deg,rgb(161, 123, 252) 0%,rgb(255, 96, 175) 100%)",
                        color: "white",
                    }}
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Target />
                        <Typography variant="h6">Position Performance Matrix</Typography>
                      </Box>
                    }
                    subheader={
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        Application volume vs. success rate by position
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      {volumes.map((position, index) => (
                        <Grid item xs={12} md={6} lg={3} key={index}>
                          <Card sx={{ p: 2, background: "white", "&:hover": { boxShadow: theme.shadows[4] } }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                              <Chip
                                label={position.volume}
                                sx={{
                                  backgroundColor: position.applications > 50 ? "#dbeafe" : "#f3f4f6",
                                  color: position.applications > 50 ? "#1d4ed8" : "#6b7280",
                                }}
                                size="small"
                              />
                              <Box>
                                {position.passRate > 70 ? (
                                  <CheckCircle sx={{ color: "#059669" }} />
                                ) : position.passRate > 50 ? (
                                  <Eye sx={{ color: "#d97706" }} />
                                ) : (
                                  <XCircle sx={{ color: "#dc2626" }} />
                                )}
                              </Box>
                            </Box>
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                              {position.position}
                            </Typography>
                            <Stack spacing={1}>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Applications:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.applications}
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Approved:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.approved}
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Pass Rate:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.passRate}%
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Avg Score:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.avgScore}%
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Status:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.status}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={position.passRate}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  my:5,
                                  backgroundColor: alpha(theme.palette.grey[300], 0.3),
                                  "& .MuiLinearProgress-bar": {
                                    background: "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
                                    borderRadius: 4,
                                  },
                                }}
                              />
                            </Stack>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>        
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
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
                                <WorkOutline fontSize="small" />
                                Experience
                              </Typography>
                              <Typography variant="body2" color="text.secondary" fontWeight="500">
                                {Math.floor(candidate.AI_Score / 20)} years
                              </Typography>
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
                                onClick={()=>router.push(`/aiScreening/candidatesProfile?id=${candidate?._id}`)}
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
          </TabPanel>
        </Box>
      </Container>
    </Box>
  )
}