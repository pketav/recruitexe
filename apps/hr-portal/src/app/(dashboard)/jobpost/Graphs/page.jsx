"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Alert,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Line,
  ComposedChart,
} from "recharts"
import { People, Work, Schedule, AccessTime, Assignment, PersonAdd } from "@mui/icons-material"
import { useApi } from "@core/hooks/useApi"

// Helper functions for safe data handling
const safeArray = (value) => {
  if (Array.isArray(value)) return value
  if (value === null || value === undefined) return []
  return []
}

const safeObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value
  return {}
}

const safeNumber = (value) => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

const safeString = (value) => {
  if (typeof value === "string") return value
  if (value === null || value === undefined) return ""
  return String(value)
}

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
  },
}))

// New clean metric card design matching the image
const CleanMetricCard = styled(Card)(({ theme, bgcolor }) => ({
  borderRadius: 16,
  backgroundColor: bgcolor,
  border: "none",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: 20,
  padding: theme.spacing(4),
  color: "white",
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
}))

// Color scheme for clean cards
const cardColors = {
  blue: "#E3F2FD", // Light blue
  purple: "#F3E5F5", // Light purple
  green: "#E8F5E8", // Light green
  pink: "#FFEBEE", // Light pink
  orange: "#FFF3E0", // Light orange
  teal: "#E0F2F1", // Light teal
  indigo: "#E8EAF6", // Light indigo
  lime: "#F1F8E9", // Light lime
}

// Chart colors
const colors = {
  blue: "#2196F3",
  green: "#4CAF50",
  orange: "#FF9800",
  red: "#F44336",
  purple: "#9C27B0",
  teal: "#009688",
  indigo: "#3F51B5",
  pink: "#E91E63",
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, bgcolor: "white", boxShadow: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color }}>
            <strong>{entry.name}:</strong> {entry.value}
          </Typography>
        ))}
      </Paper>
    )
  }
  return null
}

// Dynamic metric calculation functions based on actual API response
const calculateMetrics = (data) => {
  const totalApplicants = safeObject(data.totalApplicants)
  const topPositions = safeArray(data.topPositions?.chartData)

  // Calculate total jobs from topPositions (actual job posts)
  const totalJobs = topPositions.length

  // Calculate total positions (sum of all noOfPosition)
  const totalPositions = topPositions.reduce((sum, pos) => sum + safeNumber(pos.noOfPosition), 0)

  // Calculate average days active
  const avgDaysActive =
    topPositions.length > 0
      ? Math.round(topPositions.reduce((sum, pos) => sum + safeNumber(pos.daysOld), 0) / topPositions.length)
      : 0

  // Calculate positions with applications vs without
  const positionsWithApplications = topPositions.filter((pos) => safeNumber(pos.numberOfApplicant) > 0).length

  return {
    totalApplicants: safeNumber(totalApplicants.count),
    totalJobs,
    totalPositions,
    avgDaysActive,
    positionsWithApplications,
  }
}

// Streamlined card configuration - only essential metrics
const getCardConfig = (metrics) => [
  {
    title: "Total Applicants",
    value: metrics.totalApplicants,
    subtitle: "Applications received",
    icon: People,
    color: cardColors.blue,
    iconColor: "#1976d2",
  },
  {
    title: "Total Job Posts",
    value: metrics.totalJobs,
    subtitle: "Live job postings",
    icon: Work,
    color: cardColors.green,
    iconColor: "#388e3c",
  },
  {
    title: "Total Positions",
    value: metrics.totalPositions,
    subtitle: "Open positions",
    icon: Assignment,
    color: cardColors.purple,
    iconColor: "#7b1fa2",
  },
  {
    title: "Avg Days Active",
    value: metrics.avgDaysActive,
    subtitle: "Days since posted",
    icon: AccessTime,
    color: cardColors.indigo,
    iconColor: "#303f9f",
  },
]

export default function DashboardAnalytics({ period }) {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [apiDataPermissions, setApiDataPermissions] = useState(null) // Changed to null initially
  const [permissionsLoaded, setPermissionsLoaded] = useState(false) // New state to track loading
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { callApi } = useApi()
  
  // Use refs to track ongoing requests and prevent duplicate calls
  const abortControllerRef = useRef(null)
  const currentRequestRef = useRef(null)

  const getUserRoleId = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData) {
        try {
          const parsedData = JSON.parse(userData)
          return parsedData?.roleId || null
        } catch (e) {
          console.error("Error parsing user data:", e)
          return null
        }
      }
    }
    return null
  }

  // Fetch role permissions - runs once on mount
  useEffect(() => {
    const fetchRolePermissions = async () => {
      const roleId = getUserRoleId()

      if (!roleId) {
        setError("No role ID found")
        setPermissionsLoaded(true)
        return
      }

      try {
        const result = await callApi({
          endpoint: `/v1/api/role/detail?roleId=${roleId}`,
          method: "GET",
          disableSnackbar: true,
        })

        if (result.success && result.data.items) {
          const ShowAllData = result.data.items.jobPostDashboard.canViewAll
          setApiDataPermissions(ShowAllData ? "all" : "limited") // Set to meaningful value
        } else {
          setApiDataPermissions("limited") // Default fallback
          console.error("Failed to fetch permissions")
        }
      } catch (err) {
        console.error("Error fetching role permissions:", err)
        setApiDataPermissions("limited") // Default fallback on error
      } finally {
        setPermissionsLoaded(true)
      }
    }

    fetchRolePermissions()
  }, []) // Only runs once on mount

  // Memoized fetch function to prevent recreation on every render
  const fetchAnalytics = useCallback(async () => {
    // Don't fetch if permissions aren't loaded yet
    if (!permissionsLoaded || apiDataPermissions === null) {
      return
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Prevent multiple simultaneous requests for the same period
    const requestKey = `analytics-${period}-${apiDataPermissions}`
    if (currentRequestRef.current === requestKey) {
      return
    }

    currentRequestRef.current = requestKey
    abortControllerRef.current = new AbortController()

    setError(null)
    setIsLoading(true)

    try {
      const result = await callApi({
        endpoint: `/v1/api/jobPost/getDashboardAnalytics?period=${period}&showAllDashbBoardData=${apiDataPermissions}`,
        disableSnackbar: true, // Disable automatic snackbar to prevent spam
      })

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return
      }

      if (result.success) {
        const responseData = safeObject(result.data.items?.data)
        console.log("Analytics API Response:", responseData)
        setAnalyticsData(responseData)
      } else {
        console.error("API Error:", result.message)
        setError(result.message)
        setAnalyticsData(null)
      }
    } catch (error) {
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return
      }
      
      console.error("Fetch Error:", error)
      setError("Failed to fetch analytics data")
      setAnalyticsData(null)
    } finally {
      // Only update loading state if this is still the current request
      if (currentRequestRef.current === requestKey) {
        setIsLoading(false)
        currentRequestRef.current = null
      }
    }
  }, [period, apiDataPermissions, permissionsLoaded, callApi]) // Dependencies for useCallback

  useEffect(() => {
    fetchAnalytics()

    // Cleanup function to cancel request when component unmounts or period changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      currentRequestRef.current = null
    }
  }, [fetchAnalytics]) // Now safe to include fetchAnalytics since it's memoized

  // Show loading while permissions are being fetched or data is loading
  if (!permissionsLoaded || isLoading) {
    return <DashboardSkeleton />
  }

  // Show error state
  if (error && !analyticsData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button 
            onClick={() => fetchAnalytics()} 
            sx={{ ml: 2 }}
            variant="contained"
            size="small"
          >
            Retry
          </Button>
        </Alert>
      </Box>
    )
  }

  if (!analyticsData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          No data available. Please check your API connection and try again.
        </Alert>
      </Box>
    )
  }

  // Calculate dynamic metrics
  const metrics = calculateMetrics(analyticsData)
  const cardConfig = getCardConfig(metrics)

  // Extract data for charts
  const data = safeObject(analyticsData)
  const monthlyData = safeArray(data.applicationsByMonth?.chartData)
  const departmentData = safeArray(data.applicationsByDepartment?.chartData)
  const topPositions = safeArray(data.topPositions?.chartData)
  const workflowData = safeArray(data.workflowStatistics?.chartData)

  // Filter data for active months
  const activeMonthlyData = monthlyData.filter(
    (month) => safeNumber(month.totalApplicants) > 0 || safeNumber(month.totalJobs) > 0,
  )

  const activeDepartmentData = departmentData.filter(
    (dept) => safeNumber(dept.totalApplicants) > 0 || safeNumber(dept.totalJobs) > 0,
  )

  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          API Warning: {error}
        </Alert>
      )}

      {/* Streamlined Metric Cards - Single row of 4 essential metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cardConfig.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <CleanMetricCard bgcolor={card.color}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1, fontWeight: 500 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: card.iconColor, mb: 0.5 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                      {card.subtitle}
                    </Typography>
                  </Box>
                  <card.icon sx={{ fontSize: 28, color: card.iconColor, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </CleanMetricCard>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Monthly Applications & Jobs Trend */}
        <Grid item xs={12} lg={7}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                📅 Monthly Applications & Jobs Trend
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {activeMonthlyData.length > 0
                  ? `Showing data for ${activeMonthlyData.length} active months`
                  : "No activity in the selected period"}
              </Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="monthName" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="totalJobs" fill={colors.green} name="Jobs Posted" radius={[4, 4, 0, 0]} />
                    <Line
                      type="monotone"
                      dataKey="totalApplicants"
                      stroke={colors.blue}
                      strokeWidth={3}
                      dot={{ fill: colors.blue, strokeWidth: 2, r: 6 }}
                      name="Applications"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Recruitment Pipeline */}
        <Grid item xs={12} lg={5}>
          <StyledCard>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                🔄 Recruitment Pipeline
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Current status of all applications
              </Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workflowData}
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      dataKey="count"
                      label={({ stage, count }) => `${stage}: ${count}`}
                      labelLine={false}
                    >
                      {workflowData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || colors.blue} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Department Performance */}
        <Grid item xs={12} lg={6}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                🏢 Department Performance
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Applications and jobs by department ({activeDepartmentData.length} active)
              </Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="departmentName"
                      stroke="#666"
                      fontSize={11}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <Paper
                              sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, bgcolor: "white", boxShadow: 2 }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                              <strong>Department:</strong>  {label}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.blue }}>
                                <strong>Applications:</strong> {payload[0]?.value || 0}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.green }}>
                                <strong>Jobs Posted:</strong> {payload[1]?.value || 0}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.purple }}>
                                <strong>Total Positions:</strong> {payload[0]?.payload?.totalPositions || 0}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.orange }}>
                                <strong>Avg per Job:</strong> {payload[0]?.payload?.avgApplicantsPerJob || 0}
                              </Typography>
                            </Paper>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="totalApplicants" fill={colors.blue} name="Applications" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="totalJobs" fill={colors.green} name="Jobs Posted" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              {/* Department Summary Cards */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                  📋 Department Summary:
                </Typography>
                <Grid container spacing={2}>
                  {departmentData.slice(0, 4).map((dept, index) => (
                    <Grid item xs={6} sm={3} key={dept.departmentName}>
                      <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                          {dept.departmentName}
                        </Typography>
                        <Typography variant="h6" sx={{ color: colors.blue, fontWeight: 700 }}>
                          {dept.totalApplicants}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          applications
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.green, fontWeight: 600, fontSize: "0.75rem" }}>
                          {dept.totalJobs} jobs
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.purple, fontWeight: 500, fontSize: "0.7rem" }}>
                          {dept.totalPositions} positions
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Top Performing Positions */}
        <Grid item xs={12} lg={6}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                🎯 Job Positions Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                All job positions with application metrics ({topPositions.length} total)
              </Typography>
              <Stack spacing={2} sx={{ maxHeight: 501, overflow: "auto" }}>
                {topPositions.map((position, index) => (
                  <Paper
                    key={position._id}
                    sx={{
                      p: 2,
                      bgcolor: position.numberOfApplicant > 0 ? "#f0f9ff" : "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderLeft: `4px solid ${
                        position.numberOfApplicant > 0 ? (index === 0 ? colors.green : colors.blue) : colors.red
                      }`,
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {position.position}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {position.departmentName} • {position.noOfPosition} opening
                          {position.noOfPosition !== 1 ? "s" : ""}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {position.daysOld} days active
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.blue }}>
                          {position.numberOfApplicant}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          applications
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              position.applicantsPerPosition > 1
                                ? colors.green
                                : position.applicantsPerPosition > 0.5
                                  ? colors.orange
                                  : colors.red,
                            fontWeight: 600,
                          }}
                        >
                          {position.applicantsPerPosition.toFixed(1)} ratio
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Detailed Job Performance Table */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                📊 Complete Job Performance Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Detailed breakdown of all {topPositions.length} job positions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Applications
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Open Positions
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Applications/Position
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Days Active
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Performance
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topPositions.map((position, index) => (
                      <TableRow key={position._id} hover>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {position.position}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {position.designationName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={position.departmentName}
                            size="small"
                            variant="outlined"
                            sx={{
                              bgcolor:
                                position.departmentName === "Engineering"
                                  ? "#e3f2fd"
                                  : position.departmentName === "Finance"
                                    ? "#f3e5f5"
                                    : "#f1f8e9",
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: position.numberOfApplicant > 0 ? colors.blue : colors.red,
                            }}
                          >
                            {position.numberOfApplicant}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {position.noOfPosition}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color:
                                position.applicantsPerPosition > 1
                                  ? colors.green
                                  : position.applicantsPerPosition > 0.5
                                    ? colors.orange
                                    : colors.red,
                            }}
                          >
                            {position.applicantsPerPosition.toFixed(1)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                            <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2">{position.daysOld}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={
                              position.applicantsPerPosition > 1
                                ? "Excellent"
                                : position.applicantsPerPosition > 0.5
                                  ? "Good"
                                  : position.numberOfApplicant > 0
                                    ? "Fair"
                                    : "Poor"
                            }
                            size="small"
                            color={
                              position.applicantsPerPosition > 1
                                ? "success"
                                : position.applicantsPerPosition > 0.5
                                  ? "primary"
                                  : position.numberOfApplicant > 0
                                    ? "warning"
                                    : "error"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  )
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2, mb: 3 }} />
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[...Array(4)].map((_, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        {[...Array(4)].map((_, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}