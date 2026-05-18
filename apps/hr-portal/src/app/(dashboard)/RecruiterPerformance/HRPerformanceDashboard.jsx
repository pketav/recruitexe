"use client"
import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Paper,
  CircularProgress,
  Fade,
  Grow,
  Slide,
  FormControl,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Zoom,
  Tabs,
  Tab,
  Stack,
  TextField,
  InputAdornment,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  AreaChart,
  Area,
  Tooltip as RechartsTooltip,
} from "recharts"
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  AdsClickOutlined as TargetIcon,
  Business as BusinessIcon,
  LocalActivityOutlined as ActivityIcon,
  EmojiEvents as AwardIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  FilterList as FilterIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
  CurrencyRupeeOutlined as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Percent as PercentIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Visibility as VisibilityIcon,
  DateRange as DateRangeIcon,
  Assignment as AssignmentIcon,
  TrendingDown as TrendingDownIcon,
  Search as SearchIcon,
  Groups,
  CheckCircle,
  PersonAdd,
  Today,
  CalendarToday,
} from "@mui/icons-material"
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { useApi } from "@core/hooks/useApi"

// Helper function to format dates safely
const formatDate = (date) => {
  if (!date) return null
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return null

    // Use local date instead of UTC to avoid timezone shifts
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}` // Returns YYYY-MM-DD format in local timezone
  } catch (error) {
    console.error("Date formatting error:", error)
    return null
  }
}

// Include all the helper components from your original dashboard
const AnimatedCounter = ({ value, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let startTime
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "primary",
  format = "number",
  delay = 0,
}) => {
  const formatValue = (val) => {
    if (format === "currency") return `₹${val.toLocaleString()}`
    if (format === "percentage") return `${val}%`
    if (format === "days") return `${val} days`
    if (format === "rating") return `${val}/5`
    return val.toLocaleString()
  }

  const getColorConfig = (colorName) => {
    const colors = {
      primary: {
        main: "#3b82f6",
        bg: "rgba(59, 130, 246, 0.06)",
        iconBg: "rgba(59, 130, 246, 0.1)",
        border: "rgba(59, 130, 246, 0.15)",
      },
      success: {
        main: "#10b981",
        bg: "rgba(16, 185, 129, 0.06)",
        iconBg: "rgba(16, 185, 129, 0.1)",
        border: "rgba(16, 185, 129, 0.15)",
      },
      warning: {
        main: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.06)",
        iconBg: "rgba(245, 158, 11, 0.1)",
        border: "rgba(245, 158, 11, 0.15)",
      },
      secondary: {
        main: "#8b5cf6",
        bg: "rgba(139, 92, 246, 0.06)",
        iconBg: "rgba(139, 92, 246, 0.1)",
        border: "rgba(139, 92, 246, 0.15)",
      },
      info: {
        main: "#06b6d4",
        bg: "rgba(6, 182, 212, 0.06)",
        iconBg: "rgba(6, 182, 212, 0.1)",
        border: "rgba(6, 182, 212, 0.15)",
      },
      error: {
        main: "#ef4444",
        bg: "rgba(239, 68, 68, 0.06)",
        iconBg: "rgba(239, 68, 68, 0.1)",
        border: "rgba(239, 68, 68, 0.15)",
      },
    }
    return colors[colorName] || colors.primary
  }

  const colorConfig = getColorConfig(color)

  return (
    <Grow in timeout={800 + delay}>
      <Card
        sx={{
          height: "100%",
          background: colorConfig.bg,
          border: `1px solid ${colorConfig.border}`,
          borderRadius: 2,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 8px 25px ${colorConfig.border}`,
            border: `1px solid ${colorConfig.main}`,
          },
          position: "relative",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 3, position: "relative" }}>
          {trend && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                alignItems: "center",
                backgroundColor: trend === "up" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                borderRadius: 1,
                px: 1,
                py: 0.25,
              }}
            >
              {trend === "up" ? (
                <ArrowUpIcon sx={{ fontSize: 12, color: "#10b981", mr: 0.25 }} />
              ) : (
                <ArrowDownIcon sx={{ fontSize: 12, color: "#ef4444", mr: 0.25 }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: trend === "up" ? "#10b981" : "#ef4444",
                  fontWeight: 600,
                  fontSize: "0.65rem",
                }}
              >
                {trendValue}
              </Typography>
            </Box>
          )}
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: colorConfig.main,
                mb: 0.5,
                fontSize: "1.75rem",
                lineHeight: 1.2,
              }}
            >
              <AnimatedCounter
                value={typeof value === "string" ? Number.parseFloat(value) : value}
                suffix={format === "percentage" ? "%" : format === "days" ? " days" : format === "rating" ? "/5" : ""}
              />
              {format === "currency" && "₹"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#374151",
                fontSize: "0.875rem",
                mb: subtitle ? 0.5 : 0,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.75rem",
                  display: "block",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: 1.5,
              backgroundColor: colorConfig.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color: colorConfig.main, fontSize: 18 }} />
          </Box>
        </CardContent>
      </Card>
    </Grow>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        sx={{
          p: 2,
          background: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="caption" sx={{ color: entry.color, display: "block" }}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Paper>
    )
  }
  return null
}

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const HRPerformanceDashboard = ({ selectedRecruiter }) => {
  const [recruiters, setRecruiters] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardSummary, setDashboardSummary] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [apiError, setApiError] = useState(null)

  // Time period filter states (same as RecruiterDashboard)
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ])
  const [appliedCustomDates, setAppliedCustomDates] = useState({
    startDate: null,
    endDate: null,
  })

  const { callApi, loading } = useApi()

  // Period options with icons (same as RecruiterDashboard)
  const periodOptions = [
    { value: "all", label: "All", icon: <ActivityIcon sx={{ fontSize: 16 }} /> },
    { value: "1days", label: "Today", icon: <Today sx={{ fontSize: 16 }} /> },
    { value: "7days", label: "Last 7 Days", icon: <DateRangeIcon sx={{ fontSize: 16 }} /> },
    { value: "30days", label: "Last 30 Days", icon: <CalendarToday sx={{ fontSize: 16 }} /> },
    { value: "custom", label: "Custom", icon: <ScheduleIcon sx={{ fontSize: 16 }} /> },
  ]

  // Use the selected recruiter from props if provided
  const currentRecruiterId = selectedRecruiter?.recruiterId

  useEffect(() => {
    if (!selectedRecruiter) {
      fetchRecruiters()
    }
  }, [selectedRecruiter])

  useEffect(() => {
    if (currentRecruiterId) {
      fetchDashboardData(currentRecruiterId)
    }
  }, [currentRecruiterId, selectedPeriod, appliedCustomDates])

  const fetchRecruiters = async () => {
    try {
      setApiError(null)
      const response = await callApi({
        endpoint: "/v1/api/jobPost/getRecruiterData",
        method: "GET",
        disableSnackbar: true,
      })
      if (response.success && response.data?.items) {
        setRecruiters(response.data.items)
      } else {
        setApiError("Failed to fetch recruiters data")
      }
    } catch (error) {
      setApiError("Error fetching recruiters")
      console.error("Error fetching recruiters:", error)
    }
  }

  const fetchDashboardData = async (recruiterId) => {
    try {
      setApiError(null)
      let endpoint = `/v1/api/jobPost/getRecruiterDashboard?createdByHrId=${recruiterId}&period=${selectedPeriod}`

      if (selectedPeriod === "custom") {
        const startDate = appliedCustomDates.startDate
        const endDate = appliedCustomDates.endDate
        if (startDate && endDate) {
          const customStart = formatDate(startDate)
          const customEnd = formatDate(endDate)
          if (customStart && customEnd) {
            endpoint = `/v1/api/jobPost/getRecruiterDashboard?createdByHrId=${recruiterId}&StartDate=${customStart}&EndDate=${customEnd}`
          }
        }
      }

      const response = await callApi({
        endpoint: endpoint,
        method: "GET",
        disableSnackbar: true,
      })

      if (response.success && response.data?.items) {
        setDashboardData(response.data.items)
        // Create summary from dashboard data
        const summary = {
          totalRecruiters: 1,
          totalJobPosts: response.data.items.overview?.totalPosts || 0,
          totalApplicants: response.data.items.overview?.totalApplicants || 0,
          totalActivePosts: response.data.items.overview?.activePosts || 0,
        }
        setDashboardSummary(summary)
      } else {
        setDashboardData(null)
        setDashboardSummary(null)
        setApiError("Failed to fetch dashboard data")
      }
    } catch (error) {
      setDashboardData(null)
      setDashboardSummary(null)
      setApiError("Error fetching dashboard data")
      console.error("Error fetching dashboard data:", error)
    }
  }

  const handlePeriodSelect = (period) => {
    if (period === "custom") {
      setCustomDialogOpen(true)
    } else {
      setSelectedPeriod(period)
      setAppliedCustomDates({ startDate: null, endDate: null })
    }
  }

  const handleCustomDateApply = () => {
    try {
      const range = tempDateRange[0]
      if (range && range.startDate && range.endDate) {
        const startDate = range.startDate
        const endDate = range.endDate

        setAppliedCustomDates({ startDate, endDate })
        setSelectedPeriod("custom")
      }
      setCustomDialogOpen(false)
    } catch (error) {
      console.error("Error applying custom date range:", error)
      setCustomDialogOpen(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleExportData = async () => {
    try {
      await callApi({
        endpoint: "/v1/api/jobPost/exportDashboardData",
        method: "POST",
        data: { recruiterId: currentRecruiterId, period: selectedPeriod },
        successMessage: "Dashboard data exported successfully!",
      })
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleRefresh = () => {
    if (currentRecruiterId) {
      fetchDashboardData(currentRecruiterId)
    }
    if (!selectedRecruiter) {
      fetchRecruiters()
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "pending":
        return "warning"
      case "inactive":
        return "default"
      case "rejected":
        return "error"
      case "expired":
        return "secondary"
      default:
        return "default"
    }
  }

  const formatDateDisplay = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    return `₹${amount}`
  }

  const selectedRecruiterData = selectedRecruiter || recruiters.find((r) => r.recruiterId === currentRecruiterId)

  if (apiError && !dashboardData && !recruiters.length) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
        <Button variant="contained" onClick={handleRefresh} disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Retry"}
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        <Fade in timeout={1000}>
          <Box>
            {/* Modern Header Design - Same as RecruiterDashboard */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", md: "flex-start" },
                  mb: 3,
                  gap: { xs: 2, md: 0 },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                  <Groups sx={{ color: "#3b82f6", fontSize: { xs: 24, sm: 32 } }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, flexWrap: "wrap" }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.875rem" },
                          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        HR Performance Analytics
                      </Typography>
                      <Chip
                        label="Live"
                        size="small"
                        sx={{
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#64748b",
                        fontSize: { xs: "0.875rem", sm: "0.95rem" },
                        mb: 2,
                      }}
                    >
                      Monitor and track your recruitment performance and hiring metrics
                    </Typography>
                  </Box>
                </Box>
                {/* Time Period Selector - Same as RecruiterDashboard */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: { xs: "100%", md: "auto" },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <FormControl
                    size="small"
                    sx={{
                      minWidth: { xs: "100%", sm: 180 },
                      maxWidth: { xs: "100%", sm: 300 },
                    }}
                  >
                    <InputLabel>Time Period</InputLabel>
                    <Select
                      value={selectedPeriod}
                      label="Time Period"
                      onChange={(e) => handlePeriodSelect(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(99, 102, 241, 0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(99, 102, 241, 0.5)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6366f1",
                        },
                      }}
                    >
                      {periodOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {option.icon}
                            <Typography>{option.label}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* Custom date range display */}
                  {selectedPeriod === "custom" && appliedCustomDates.startDate && appliedCustomDates.endDate && (
                    <Chip
                      label={`${formatDate(appliedCustomDates.startDate)} to ${formatDate(appliedCustomDates.endDate)}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "#3b82f6",
                        color: "#3b82f6",
                        backgroundColor: "#dbeafe",
                        fontWeight: 600,
                        maxWidth: { xs: "100%", sm: 200 },
                        "& .MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      }}
                      onDelete={() => {
                        setSelectedPeriod("all")
                        setAppliedCustomDates({ startDate: null, endDate: null })
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Summary Cards - Same as RecruiterDashboard */}
              {dashboardSummary && (
                <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
                  <Grid item xs={6} sm={6} md={3}>
                    <Card
                      elevation={0}
                      sx={{ backgroundColor: "#dbeafe", border: "1px solid #bfdbfe", borderRadius: 3 }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box>
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 800,
                                color: "#1e40af",
                                fontSize: { xs: "1.5rem", sm: "2rem" },
                                lineHeight: 1,
                                mb: 0.5,
                              }}
                            >
                              {dashboardSummary.totalRecruiters || 0}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#3b82f6",
                                fontWeight: 600,
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              Total Recruiters
                            </Typography>
                          </Box>
                          <PeopleIcon sx={{ color: "#3b82f6", fontSize: { xs: 24, sm: 32 }, opacity: 0.8 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={6} md={3}>
                    <Card
                      elevation={0}
                      sx={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 3 }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box>
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 800,
                                color: "#15803d",
                                fontSize: { xs: "1.5rem", sm: "2rem" },
                                lineHeight: 1,
                                mb: 0.5,
                              }}
                            >
                              {dashboardSummary.totalJobPosts || 0}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#16a34a",
                                fontWeight: 600,
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              Job Posts
                            </Typography>
                          </Box>
                          <WorkIcon sx={{ color: "#16a34a", fontSize: { xs: 24, sm: 32 }, opacity: 0.8 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={6} md={3}>
                    <Card
                      elevation={0}
                      sx={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 3 }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box>
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 800,
                                color: "#dc2626",
                                fontSize: { xs: "1.5rem", sm: "2rem" },
                                lineHeight: 1,
                                mb: 0.5,
                              }}
                            >
                              {dashboardSummary.totalApplicants || 0}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#ef4444",
                                fontWeight: 600,
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              Total Applicants
                            </Typography>
                          </Box>
                          <PersonAdd sx={{ color: "#ef4444", fontSize: { xs: 24, sm: 32 }, opacity: 0.8 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={6} md={3}>
                    <Card
                      elevation={0}
                      sx={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 3 }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box>
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 800,
                                color: "#15803d",
                                fontSize: { xs: "1.5rem", sm: "2rem" },
                                lineHeight: 1,
                                mb: 0.5,
                              }}
                            >
                              {dashboardSummary.totalActivePosts || 0}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#16a34a",
                                fontWeight: 600,
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              Active Posts
                            </Typography>
                          </Box>
                          <CheckCircle sx={{ color: "#16a34a", fontSize: { xs: 24, sm: 32 }, opacity: 0.8 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

            </Box>

            {/* Custom Date Range Dialog - Same as RecruiterDashboard */}
            <Dialog
              open={customDialogOpen}
              onClose={() => setCustomDialogOpen(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  margin: { xs: 1, sm: 2 },
                  width: { xs: "calc(100% - 16px)", sm: "auto" },
                },
              }}
            >
              <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 20 }} />
                  Select Custom Date Range
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                    "& .rdrCalendarWrapper": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                >
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setTempDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={tempDateRange}
                    maxDate={new Date()}
                    showSelectionPreview={true}
                    showDateDisplay={false}
                  />
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button
                  onClick={() => setCustomDialogOpen(false)}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                  fullWidth={window.innerWidth < 600}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCustomDateApply}
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                  }}
                  fullWidth={window.innerWidth < 600}
                >
                  Apply Range
                </Button>
              </DialogActions>
            </Dialog>

            {loading && !dashboardData ? (
              <Card elevation={2}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400, p: 4 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <CircularProgress size={60} sx={{ mb: 3, color: "#1976d2" }} />
                    <Typography variant="h6" color="text.secondary">
                      Loading performance data...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Fetching latest analytics and metrics
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ) : dashboardData ? (
              <Box>
                {/* Tabs */}
                <Paper sx={{ mb: 3, borderRadius: 2, border: "1px solid #e5e7eb" }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                      "& .MuiTab-root": {
                        minHeight: 64,
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      },
                      "& .MuiTabs-indicator": {
                        height: 3,
                        borderRadius: "3px 3px 0 0",
                      },
                    }}
                  >
                    <Tab icon={<BarChartIcon />} iconPosition="start" label="Overview" sx={{ gap: 1 }} />
                    <Tab icon={<TargetIcon />} iconPosition="start" label="Performance" sx={{ gap: 1 }} />
                    <Tab icon={<PieChartIcon />} iconPosition="start" label="Analytics" sx={{ gap: 1 }} />
                    <Tab icon={<ActivityIcon />} iconPosition="start" label="Insights" sx={{ gap: 1 }} />
                  </Tabs>
                </Paper>

                {/* Tab Panels */}
                <TabPanel value={activeTab} index={0}>
                  {/* Key Metrics */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} lg={3}>
                      <MetricCard
                        title="Total Job Posts"
                        value={dashboardData.overview?.totalPosts || 0}
                        subtitle={`${dashboardData.overview?.activePosts || 0} active, ${dashboardData.overview?.pendingPosts || 0} pending`}
                        icon={WorkIcon}
                        trend="up"
                        trendValue="+12%"
                        color="primary"
                        delay={0}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <MetricCard
                        title="Total Applicants"
                        value={dashboardData.overview?.totalApplicants || 0}
                        subtitle={`Avg ${dashboardData.overview?.avgApplicantsPerPost?.toFixed(1) || 0} per post`}
                        icon={PeopleIcon}
                        trend="up"
                        trendValue="+8%"
                        color="success"
                        delay={100}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <MetricCard
                        title="Total Positions"
                        value={dashboardData.overview?.totalPositions || 0}
                        subtitle="Available job positions"
                        icon={AssignmentIcon}
                        trend="up"
                        trendValue="+15%"
                        color="info"
                        delay={200}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <MetricCard
                        title="Success Rate"
                        value={dashboardData.overview?.successRate?.toFixed(1) || 0}
                        subtitle="Job posting success rate"
                        icon={TargetIcon}
                        trend="up"
                        trendValue="+3%"
                        color="success"
                        format="percentage"
                        delay={300}
                      />
                    </Grid>
                  </Grid>

                  {/* Additional Metrics */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} lg={4}>
                      <MetricCard
                        title="Total Budget"
                        value={dashboardData.overview?.totalBudget || 0}
                        subtitle="Allocated recruitment budget"
                        icon={MoneyIcon}
                        trend="up"
                        trendValue="+5%"
                        color="secondary"
                        format="currency"
                        delay={400}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <MetricCard
                        title="Inactive Posts"
                        value={dashboardData.overview?.inactivePosts || 0}
                        subtitle="Posts requiring attention"
                        icon={TrendingDownIcon}
                        trend="down"
                        trendValue="-2"
                        color="warning"
                        delay={500}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <MetricCard
                        title="Expired Posts"
                        value={dashboardData.overview?.expiredPosts || 0}
                        subtitle="Posts that have expired"
                        icon={ScheduleIcon}
                        trend="down"
                        trendValue="-1"
                        color="error"
                        delay={600}
                      />
                    </Grid>
                  </Grid>

                  {/* Charts */}
                  <Grid container spacing={4}>
                    <Grid item xs={12} lg={6}>
                      <Slide direction="up" in timeout={1000}>
                        <Card elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                          <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                              <Box
                                sx={{
                                  p: 1.5,
                                  borderRadius: 2,
                                  backgroundColor: "#e3f2fd",
                                  mr: 2,
                                }}
                              >
                                <PieChartIcon sx={{ color: "#1976d2", fontSize: 24 }} />
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
                                Job Status Distribution
                              </Typography>
                            </Box>
                            <Box sx={{ height: 300 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={dashboardData.charts?.statusDistribution?.map((item) => ({
                                      name: item.status,
                                      value: item.count,
                                      fill:
                                        item.status === "active"
                                          ? "#4caf50"
                                          : item.status === "pending"
                                            ? "#ff9800"
                                            : item.status === "inactive"
                                              ? "#9e9e9e"
                                              : "#f44336",
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                  >
                                    {dashboardData.charts?.statusDistribution?.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          entry.status === "active"
                                            ? "#4caf50"
                                            : entry.status === "pending"
                                              ? "#ff9800"
                                              : entry.status === "inactive"
                                                ? "#9e9e9e"
                                                : "#f44336"
                                        }
                                      />
                                    ))}
                                  </Pie>
                                  <RechartsTooltip content={<CustomTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </Box>
                          </CardContent>
                        </Card>
                      </Slide>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Slide direction="up" in timeout={1200}>
                        <Card elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                          <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                              <Box
                                sx={{
                                  p: 1.5,
                                  borderRadius: 2,
                                  backgroundColor: "#e8f5e8",
                                  mr: 2,
                                }}
                              >
                                <TrendingUpIcon sx={{ color: "#2e7d32", fontSize: 24 }} />
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
                                Monthly Trends
                              </Typography>
                            </Box>
                            <Box sx={{ height: 300 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dashboardData.charts?.monthlyTrends}>
                                  <defs>
                                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3} />
                                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0.05} />
                                    </linearGradient>
                                    <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#4caf50" stopOpacity={0.3} />
                                      <stop offset="95%" stopColor="#4caf50" stopOpacity={0.05} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                  <XAxis dataKey="period" stroke="#666" fontSize={12} />
                                  <YAxis stroke="#666" fontSize={12} />
                                  <RechartsTooltip content={<CustomTooltip />} />
                                  <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#1976d2"
                                    strokeWidth={2}
                                    fill="url(#colorPosts)"
                                    name="Job Posts"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="totalApplicants"
                                    stroke="#4caf50"
                                    strokeWidth={2}
                                    fill="url(#colorApplicants)"
                                    name="Total Applicants"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </Box>
                          </CardContent>
                        </Card>
                      </Slide>
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                  {/* Performance Metrics */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                      <Card elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827" }}>
                              Success Rate
                            </Typography>
                            <PercentIcon sx={{ color: "#1976d2", fontSize: 24 }} />
                          </Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827", mb: 2 }}>
                            {dashboardData.performance?.successRate?.toFixed(1) || 0}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={dashboardData.performance?.successRate || 0}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#f5f5f5",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#1976d2",
                                borderRadius: 4,
                              },
                            }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {dashboardData.performance?.successfulPosts || 0} successful posts
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827" }}>
                              AI Adoption Rate
                            </Typography>
                            <TargetIcon sx={{ color: "#4caf50", fontSize: 24 }} />
                          </Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827", mb: 2 }}>
                            {dashboardData.performance?.aiAdoptionRate || 0}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={dashboardData.performance?.aiAdoptionRate || 0}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#f5f5f5",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#4caf50",
                                borderRadius: 4,
                              },
                            }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            AI screening adoption
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827" }}>
                              Total Budget
                            </Typography>
                            <MoneyIcon sx={{ color: "#9c27b0", fontSize: 24 }} />
                          </Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827", mb: 2 }}>
                            {formatCurrency(dashboardData.performance?.totalBudgetAllocated || 0)}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={75}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#f5f5f5",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#9c27b0",
                                borderRadius: 4,
                              },
                            }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Total budget allocated
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Department Performance */}
                  <Card elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: "#f3e5f5",
                            mr: 2,
                          }}
                        >
                          <BusinessIcon sx={{ color: "#9c27b0", fontSize: 24 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
                          Department Performance Analysis
                        </Typography>
                      </Box>
                      <Box sx={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={dashboardData.charts?.departmentWiseStats?.slice(0, 8)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="departmentName"
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              stroke="#666"
                              fontSize={11}
                            />
                            <YAxis stroke="#666" fontSize={12} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} name="Job Posts" />
                            <Bar
                              dataKey="totalApplicants"
                              fill="#4caf50"
                              radius={[4, 4, 0, 0]}
                              name="Total Applicants"
                            />
                            <Line
                              type="monotone"
                              dataKey="avgApplicantsPerPost"
                              stroke="#ff9800"
                              strokeWidth={2}
                              dot={{ fill: "#ff9800", strokeWidth: 2, r: 4 }}
                              name="Avg Applicants"
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                  {/* Employment Type Stats */}
                  <Card elevation={2} sx={{ mb: 4, border: "1px solid #e5e7eb", borderRadius: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: "#fff3e0",
                            mr: 2,
                          }}
                        >
                          <WorkIcon sx={{ color: "#ed6c02", fontSize: 24 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
                          Employment Type Distribution
                        </Typography>
                      </Box>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashboardData.charts?.employmentTypeStats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="employmentType"
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              stroke="#666"
                              fontSize={10}
                            />
                            <YAxis stroke="#666" fontSize={12} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="#1976d2" name="Job Posts" />
                            <Bar dataKey="totalApplicants" fill="#4caf50" name="Total Applicants" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Designation Stats */}
                  <Card elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: "#e8f5e8",
                            mr: 2,
                          }}
                        >
                          <AssignmentIcon sx={{ color: "#2e7d32", fontSize: 24 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
                          Top Designations by Applications
                        </Typography>
                      </Box>
                      <Box sx={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashboardData.charts?.DesingationWiseStats?.slice(0, 10)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="designationName"
                              angle={-45}
                              textAnchor="end"
                              height={120}
                              stroke="#666"
                              fontSize={10}
                            />
                            <YAxis stroke="#666" fontSize={12} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Bar dataKey="totalApplicants" fill="#4caf50" name="Total Applicants" />
                            <Bar dataKey="count" fill="#1976d2" name="Job Posts" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </TabPanel>

                <TabPanel value={activeTab} index={3}>
                  {/* Recent Activity and Top Performing Posts */}
                  <Grid container spacing={4}>
                    <Grid item xs={12} lg={6}>
                      <Slide direction="up" in timeout={1800}>
                        <Card elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                          <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                              <Box
                                sx={{
                                  p: 1.5,
                                  borderRadius: 2,
                                  backgroundColor: "#fff3e0",
                                  mr: 2,
                                }}
                              >
                                <ScheduleIcon sx={{ color: "#ed6c02", fontSize: 24 }} />
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
                                Recent Activity
                              </Typography>
                            </Box>
                            <List sx={{ maxHeight: 400, overflow: "auto" }}>
                              {dashboardData.recentActivity?.slice(0, 8).map((activity, index) => (
                                <Zoom key={activity._id} in timeout={500 + index * 100}>
                                  <ListItem
                                    sx={{
                                      backgroundColor: "#fafafa",
                                      borderRadius: 2,
                                      mb: 1.5,
                                      border: "1px solid #f0f0f0",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                        transform: "translateX(4px)",
                                      },
                                    }}
                                  >
                                    <ListItemAvatar>
                                      <Avatar sx={{ backgroundColor: "#1976d2", width: 40, height: 40 }}>
                                        {activity.departmentName?.substring(0, 2).toUpperCase()}
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#111827" }}>
                                          {activity.position}
                                        </Typography>
                                      }
                                      secondary={
                                        <Box>
                                          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                                            {activity.departmentName} • {formatDateDisplay(activity.createdAt)}
                                          </Typography>
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                            <Chip
                                              label={activity.status}
                                              color={getStatusColor(activity.status)}
                                              size="small"
                                              sx={{ height: 20, fontSize: "0.7rem" }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                              {activity.totalApplicants} applicants
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              • {formatCurrency(Number(activity.budget))}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                </Zoom>
                              ))}
                            </List>
                          </CardContent>
                        </Card>
                      </Slide>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Slide direction="up" in timeout={2000}>
                        <Card elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                          <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                              <Box
                                sx={{
                                  p: 1.5,
                                  borderRadius: 2,
                                  backgroundColor: "#e8f5e8",
                                  mr: 2,
                                }}
                              >
                                <AwardIcon sx={{ color: "#2e7d32", fontSize: 24 }} />
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
                                Top Performing Posts
                              </Typography>
                            </Box>
                            <List sx={{ maxHeight: 400, overflow: "auto" }}>
                              {dashboardData.topPerformingPosts?.slice(0, 8).map((post, index) => (
                                <Zoom key={post._id} in timeout={700 + index * 100}>
                                  <ListItem
                                    sx={{
                                      backgroundColor: "#f9fdf9",
                                      borderRadius: 2,
                                      mb: 1.5,
                                      border: "1px solid #e8f5e8",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        backgroundColor: "#f1f8e9",
                                        transform: "translateX(4px)",
                                      },
                                    }}
                                  >
                                    <ListItemAvatar>
                                      <Avatar
                                        sx={{
                                          backgroundColor: "#4caf50",
                                          width: 40,
                                          height: 40,
                                          fontWeight: 700,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        #{index + 1}
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#111827" }}>
                                          {post.position}
                                        </Typography>
                                      }
                                      secondary={
                                        <Box>
                                          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                                            {post.departmentName} • {formatDateDisplay(post.createdAt)}
                                          </Typography>
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                              <PeopleIcon sx={{ fontSize: 16, color: "#4caf50" }} />
                                              <Typography variant="body2" sx={{ color: "#4caf50", fontWeight: 700 }}>
                                                {post.totalApplicants}
                                              </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                              applicants • {post.noOfPosition} positions
                                            </Typography>
                                          </Box>
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                </Zoom>
                              ))}
                            </List>
                          </CardContent>
                        </Card>
                      </Slide>
                    </Grid>
                  </Grid>
                </TabPanel>
              </Box>
            ) : (
              <Card elevation={2} sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <VisibilityIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                    No Data Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select a recruiter to view their performance dashboard
                  </Typography>
                </Box>
              </Card>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  )
}

export default HRPerformanceDashboard
