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
import { useRouter } from "next/navigation"
import axios from "axios"

const COLORS = ["#FF9800", "#2196F3", "#9C27B0", "#4CAF50", "#F44336", "#00BCD4", "#673AB7", "#009688", "#E91E63", "#3F51B5"]

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

export default function AIScreeningDashboard({selectedPeriod}) {
  const theme = useTheme()
  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [dayCount, setDayCount] = useState("7d")
  const [dashboardData, setDashboardData] = useState({})
  const getDashboardData = async () => {
        try {
            const res = await  axios.get(`${baseUrl}/v1/api/job/AIDashboard?period=${selectedPeriod==="30days" ? "30d" : "7d"}`, {
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

    useEffect(()=>{
    getDashboardData()
    getScreeningResults()
    },[selectedPeriod])

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
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
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
            {/* <Stack direction="row" spacing={1}>
            <Button
                variant={dayCount === "7d" ? "contained" : "outlined"}
                size="small"
                sx={{
                borderColor: dayCount === "7d" ? "#64748b" : "#e2e8f0",
                color: dayCount === "7d" ? "#ffffff" : "#64748b",
                backgroundColor: dayCount === "7d" ? "#64748b" : "transparent",
                "&:hover": {
                    borderColor: "#cbd5e1",
                    backgroundColor: dayCount === "7d" ? "#475569" : "#f8fafc",
                },
                }}
                onClick={() => setDayCount("7d")}
            >
                Last 7 Days
            </Button>

            <Button
                variant={dayCount === "30d" ? "contained" : "outlined"}
                size="small"
                sx={{
                borderColor: dayCount === "30d" ? "#64748b" : "#e2e8f0",
                color: dayCount === "30d" ? "#ffffff" : "#64748b",
                backgroundColor: dayCount === "30d" ? "#64748b" : "transparent",
                "&:hover": {
                    borderColor: "#cbd5e1",
                    backgroundColor: dayCount === "30d" ? "#475569" : "#f8fafc",
                },
                }}
                onClick={() => setDayCount("30d")}
            >
                Last 30 Days
            </Button>
            </Stack> */}
          </Box>

          <Paper
          sx={{
            mb: 3,
            background: "linear-gradient(135deg,rgb(153, 108, 237) 0%,rgb(123, 88, 189) 100%)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}>

          </Paper>
          <Stack spacing={6} mt={2}>
              {/* Primary Metrics Section */}
              <Paper sx={{p:2}}>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #3b82f6, #8b5cf6)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Key Performance Metrics
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
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
                   <Grid container spacing={3}>
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
              </Paper>

              {/* Secondary Metrics Section */}
              {/* <Paper sx={{p:2}}>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #f59e0b, #ea580c)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Operational Insights
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
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

              <Grid container spacing={3}>
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
              </Paper> */}

              {/* Performance Analytics Section */}
              <Paper sx={{p:2}}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #f59e0b, #ea580c)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                  Performance Analytics
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
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

                <Grid container spacing={3}>

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
              </Paper>
              <Paper sx={{p:2}}>
                            
                            
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #f59e0b, #ea580c)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                  Screening Results
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
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
            <Grid container spacing={3}>
              {/* <Grid item xs={12} lg={4}>
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
              </Grid> */}

              <Grid item xs={12}>
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
                    skill: skill
                      .replace(/([a-z])([A-Z])/g, '$1 $2')
                      .replace(/\b\w/g, (char) => char.toUpperCase()), 
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
                    <Typography variant="body2" color="text.secondary">
                      No skill data available
                    </Typography>
                  </Box>
                )}
              </ResponsiveContainer>
            </CardContent>


                </Card>
              </Grid>
            </Grid>
            </Box>
            </Paper>
            <Paper sx={{p:2}}>
             <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #3b82f6, #8b5cf6)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Analytics
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
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
              <Grid container spacing={3}>
                {/* <Grid item xs={12} md={4}>
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
                </Grid> */}
            

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
              </Box>
            </Paper>

            <Paper sx={{p:2}}>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      background: "linear-gradient(to bottom, #3b82f6, #8b5cf6)",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold" >
                    Position Statistics
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
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
            </Box> 
            </Paper>
            </Stack>
        </Box>
      </Container>

  )
}