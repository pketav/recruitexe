"use client"
import { useState, useEffect, useMemo } from "react"
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Fade,
  Skeleton,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Stack,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
} from "@mui/material"
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  People as PeopleIcon,
  BusinessCenter,
  PersonAdd,
  ArrowBack,
  Groups,
  CheckCircle,
  ViewModule,
  GridView,
  ViewCarousel,
  LocalActivityOutlined as Activity,
  Schedule,
  Today,
  DateRange as DateRangeIcon,
  CalendarToday,
} from "@mui/icons-material"
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import RecruiterCard from "./RecruiterCard"
import RecruiterSlider from "./RecruiterSlider"
import HRPerformanceDashboard from "./HRPerformanceDashboard"
import { useApi } from "@core/hooks/useApi"

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96]

// Fixed helper function to format dates safely without timezone issues
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

// Fixed helper function to check if a date is within range
const isDateInRange = (dateToCheck, startDate, endDate) => {
  if (!dateToCheck || !startDate || !endDate) return false
  try {
    // Create dates and normalize to local timezone
    const checkDate = new Date(dateToCheck)
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Normalize all dates to start of day in local timezone
    const normalizeDate = (date) => {
      const normalized = new Date(date)
      normalized.setHours(0, 0, 0, 0)
      return normalized
    }

    const normalizedCheck = normalizeDate(checkDate)
    const normalizedStart = normalizeDate(start)
    const normalizedEnd = normalizeDate(end)

    // Set end date to end of day for inclusive comparison
    normalizedEnd.setHours(23, 59, 59, 999)

    return normalizedCheck >= normalizedStart && normalizedCheck <= normalizedEnd
  } catch (error) {
    console.error("Date comparison error:", error)
    return false
  }
}

const RecruiterDashboard = ({
  onPeriodChange = () => {},
  onCustomDateChange = () => {},
  customStartDate = null,
  customEndDate = null,
}) => {
  const [recruiters, setRecruiters] = useState([])
  const [filteredRecruiters, setFilteredRecruiters] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [selectedRecruiter, setSelectedRecruiter] = useState(null)
  const [dashboardSummary, setDashboardSummary] = useState(null)
  const [viewMode, setViewMode] = useState("cards")
  const [activeTab, setActiveTab] = useState(0)

  // Time period filter states
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState([
    {
      startDate: customStartDate || new Date(),
      endDate: customEndDate || new Date(),
      key: "selection",
    },
  ])

  // Add this new state to track applied custom dates
  const [appliedCustomDates, setAppliedCustomDates] = useState({
    startDate: customStartDate,
    endDate: customEndDate,
  })

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [viewType, setViewType] = useState("slider") // slider, grid, list, compact

  const { callApi, loading } = useApi()

  // Period options with icons
  const periodOptions = [
    { value: "all", label: "All", icon: <Activity sx={{ fontSize: 16 }} /> },
    { value: "1days", label: "Today", icon: <Today sx={{ fontSize: 16 }} /> },
    { value: "7days", label: "Last 7 Days", icon: <DateRangeIcon sx={{ fontSize: 16 }} /> },
    { value: "30days", label: "Last 30 Days", icon: <CalendarToday sx={{ fontSize: 16 }} /> },
    { value: "custom", label: "Custom", icon: <Schedule sx={{ fontSize: 16 }} /> },
  ]

  useEffect(() => {
    fetchRecruiters()
  }, [selectedPeriod, appliedCustomDates])

  useEffect(() => {
    filterAndSortRecruiters()
  }, [recruiters, searchTerm, sortBy, selectedPeriod, appliedCustomDates])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy, itemsPerPage, selectedPeriod])

  const fetchRecruiters = async () => {
    try {
      let endpoint = `/v1/api/jobPost/getALLRecruiterData?period=${selectedPeriod}`

      if (selectedPeriod === "custom") {
        const startDate = appliedCustomDates.startDate || customStartDate
        const endDate = appliedCustomDates.endDate || customEndDate

        if (startDate && endDate) {
          const customStart = formatDate(startDate)
          const customEnd = formatDate(endDate)

          if (customStart && customEnd) {
            endpoint = `/v1/api/jobPost/getALLRecruiterData?startDate=${customStart}&endDate=${customEnd}`
// Debug log
// Debug log
          }
        }
      }

      const response = await callApi({
        endpoint: endpoint,
        method: "GET",
        disableSnackbar: true,
      })

      if (response.success && response.data?.items?.items?.recruiters) {
        setRecruiters(response.data.items.items.recruiters)
        setDashboardSummary(response.data.items.items.summary)
      } else {
        console.error("Failed to fetch recruiter data:", response.message || "Unknown error")
        setRecruiters([])
        setDashboardSummary(null)
      }
    } catch (error) {
      console.error("Error fetching recruiters:", error)
      setRecruiters([])
      setDashboardSummary(null)
    }
  }

  const isWithinDateRange = (recruiterData) => {
    if (selectedPeriod === "all") return true

    const now = new Date()
    const recruiterDate = new Date(recruiterData.createdAt || recruiterData.lastActivity || now)

    if (selectedPeriod === "custom") {
      const customStart = appliedCustomDates.startDate || customStartDate
      const customEnd = appliedCustomDates.endDate || customEndDate

      if (customStart && customEnd) {
        return isDateInRange(recruiterDate, customStart, customEnd)
      }
      return true
    } else {
      // Handle predefined periods
      let days = 0
      switch (selectedPeriod) {
        case "1days":
          days = 1
          break
        case "7days":
          days = 7
          break
        case "30days":
          days = 30
          break
        default:
          return true
      }

      const startDate = new Date()
      startDate.setDate(now.getDate() - days)
      startDate.setHours(0, 0, 0, 0)

      return recruiterDate >= startDate
    }
  }

  const filterAndSortRecruiters = () => {
    const filtered = recruiters.filter((recruiter) => {
      const matchesSearch = recruiter.recruiterName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDateRange = isWithinDateRange(recruiter)
      return matchesSearch && matchesDateRange
    })

    filtered.sort((a, b) => {
      const aOverview = a.items?.overview || {}
      const bOverview = b.items?.overview || {}

      switch (sortBy) {
        case "name":
          return a.recruiterName.localeCompare(b.recruiterName)
        case "posts":
          return (bOverview.totalPosts || 0) - (aOverview.totalPosts || 0)
        case "applicants":
          return (bOverview.totalApplicants || 0) - (aOverview.totalApplicants || 0)
        case "success":
          return (bOverview.successRate || 0) - (aOverview.successRate || 0)
        default:
          return 0
      }
    })

    setFilteredRecruiters(filtered)
  }

  const handlePeriodSelect = (period) => {
    if (period === "custom") {
      setCustomDialogOpen(true)
    } else {
      setSelectedPeriod(period)
      // Clear custom dates when selecting other periods
      setAppliedCustomDates({ startDate: null, endDate: null })
      if (typeof onPeriodChange === "function") {
        onPeriodChange(period)
      }
    }
  }

  const handleCustomDateApply = () => {
    try {
      const range = tempDateRange[0]
      if (range && range.startDate && range.endDate) {
        const startDate = range.startDate
        const endDate = range.endDate

        // Debug logs

        // Update applied custom dates state
        setAppliedCustomDates({ startDate, endDate })

        if (typeof onCustomDateChange === "function") {
          onCustomDateChange(startDate, endDate)
        }

        if (typeof onPeriodChange === "function") {
          onPeriodChange("custom", formatDate(startDate), formatDate(endDate))
        }

        setSelectedPeriod("custom")
      }
      setCustomDialogOpen(false)
    } catch (error) {
      console.error("Error applying custom date range:", error)
      setCustomDialogOpen(false)
    }
  }

  // Get top performers for slider
  const topPerformers = useMemo(() => {
    return [...filteredRecruiters]
      .sort((a, b) => {
        const aRate = a.items?.overview?.successRate || 0
        const bRate = b.items?.overview?.successRate || 0
        return bRate - aRate
      })
      .slice(0, 9) // Top 9 for slider
  }, [filteredRecruiters])

  // Pagination logic
  const paginatedRecruiters = useMemo(() => {
    if (viewType === "slider") return filteredRecruiters
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredRecruiters.slice(startIndex, endIndex)
  }, [filteredRecruiters, currentPage, itemsPerPage, viewType])

  const totalPages = Math.ceil(filteredRecruiters.length / itemsPerPage)

  const handleRecruiterClick = (recruiter) => {
    setSelectedRecruiter(recruiter)
    setViewMode("dashboard")
  }

  const handleBackToCards = () => {
    setViewMode("cards")
    setSelectedRecruiter(null)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
  }

  const handleRefresh = () => {
    fetchRecruiters()
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value)
    setCurrentPage(1)
  }

  const handleViewTypeChange = (event, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType)
    }
  }

  const getGridColumns = () => {
    switch (viewType) {
      case "compact":
        return { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }
      case "list":
        return { xs: 12 }
      default: // grid
        return { xs: 12, sm: 6, lg: 4 }
    }
  }

  const LoadingSkeleton = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={400} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={600} height={28} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 3 }} />
        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={600} sx={{ borderRadius: 3 }} />
    </Container>
  )

  // If viewing dashboard mode, render the detailed dashboard
  if (viewMode === "dashboard" && selectedRecruiter) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            py: 2,
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBackToCards}
                sx={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                    borderColor: "#cbd5e1",
                  },
                }}
              >
                Back to Recruiters
              </Button>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  {selectedRecruiter.recruiterName} - Performance Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  Detailed analytics and performance metrics
                </Typography>
              </Box>
            </Box>
          </Container>
        </Paper>
        <HRPerformanceDashboard selectedRecruiter={selectedRecruiter} />
      </Box>
    )
  }

  if (loading && recruiters.length === 0) {
    return <LoadingSkeleton />
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        <Fade in timeout={1000}>
          <Box>
            {/* Modern Header Design - Mobile Responsive */}
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
                        Recruiter Performance Analytics
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
                {/* Time Period Selector - Mobile Responsive */}
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
                        if (typeof onPeriodChange === "function") {
                          onPeriodChange("all")
                        }
                      }}
                    />
                  )}
                </Box>
              </Box>
              {/* Summary Cards - Mobile Responsive */}
              {dashboardSummary && (
                <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
                  <Grid item xs={6} sm={6} md={3}>
                    <Card
                      elevation={0}
                      sx={{ backgroundColor: "#dbeafe", border: "1px solid #bfdbfe", borderRadius: 3 , p : 5}}
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
                      sx={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 3 , p : 5}}
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
                          <BusinessCenter sx={{ color: "#16a34a", fontSize: { xs: 24, sm: 32 }, opacity: 0.8 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={6} md={3}>
                    <Card
                      elevation={0}
                      sx={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 3, p : 5 }}
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
                      sx={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 3, p : 5 }}
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
              {/* Enhanced Controls with View Options - Mobile Responsive */}
              <Card
                elevation={0}
                sx={{ mb: 4, border: "1px solid #e2e8f0", borderRadius: 3, backgroundColor: "#ffffff" }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", md: "center" }}
                  >
                    <TextField
                      placeholder="Search recruiters..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      size="small"
                      sx={{ minWidth: { xs: "100%", md: 300 } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#64748b", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 200 } }}>
                      <Select value={sortBy} onChange={handleSortChange}>
                        <MenuItem value="name">Sort by Name</MenuItem>
                        <MenuItem value="posts">Sort by Job Posts</MenuItem>
                        <MenuItem value="applicants">Sort by Applications</MenuItem>
                        <MenuItem value="success">Sort by Success Rate</MenuItem>
                      </Select>
                    </FormControl>
                    {/* Enhanced View Type Toggle */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "space-between", md: "flex-start" },
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <ToggleButtonGroup
                        value={viewType}
                        exclusive
                        onChange={handleViewTypeChange}
                        size="small"
                        sx={{ height: 40 }}
                      >
                        <ToggleButton value="slider" aria-label="slider view">
                          <ViewCarousel sx={{ fontSize: 18 }} />
                        </ToggleButton>
                        <ToggleButton value="grid" aria-label="grid view">
                          <GridView sx={{ fontSize: 18 }} />
                        </ToggleButton>
                        <ToggleButton value="compact" aria-label="compact view">
                          <ViewModule sx={{ fontSize: 18 }} />
                        </ToggleButton>
                      </ToggleButtonGroup>
                      <Chip
                        icon={<FilterIcon sx={{ fontSize: 16 }} />}
                        label={`${filteredRecruiters.length} Recruiters`}
                        variant="outlined"
                        sx={{
                          borderColor: "#cbd5e1",
                          color: "#475569",
                          fontWeight: 600,
                          height: 40,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
            {/* Custom Date Range Dialog */}
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
            {/* Conditional Rendering Based on View Type */}
            {viewType === "slider" ? (
              <Box>
                {/* Top Performers Slider */}
                {topPerformers.length > 0 && (
                  <RecruiterSlider
                    recruiters={topPerformers}
                    onRecruiterClick={handleRecruiterClick}
                    title="🏆 Top Performing Recruiters"
                  />
                )}
                <Divider sx={{ my: 4 }} />
                {/* All Recruiters Slider */}
                <RecruiterSlider
                  recruiters={filteredRecruiters}
                  onRecruiterClick={handleRecruiterClick}
                  title="📋 All Recruiters"
                />
              </Box>
            ) : (
              <Box>
                {/* Traditional Grid/List View */}
                <Grid container spacing={viewType === "compact" ? 2 : 3}>
                  {paginatedRecruiters.map((recruiter, index) => (
                    <Grid item {...getGridColumns()} key={recruiter.recruiterId}>
                      <Fade in timeout={300 + index * 50}>
                        <Box>
                          <RecruiterCard recruiter={recruiter} onClick={handleRecruiterClick} index={index} />
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
                {/* Pagination for Grid/List Views */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 6,
                      gap: 3,
                    }}
                  >
                    <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 120 } }}>
                      <Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option} per page
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size={window.innerWidth < 600 ? "small" : "large"}
                      showFirstButton
                      showLastButton
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: 2,
                          fontWeight: 600,
                          "&.Mui-selected": {
                            backgroundColor: "#3b82f6",
                            color: "white",
                            "&:hover": { backgroundColor: "#2563eb" },
                          },
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        minWidth: { xs: "100%", sm: 120 },
                        textAlign: "center",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      Showing {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, filteredRecruiters.length)} of {filteredRecruiters.length}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            {/* Empty State */}
            {filteredRecruiters.length === 0 && !loading && (
              <Fade in>
                <Card
                  elevation={0}
                  sx={{ border: "1px solid #e2e8f0", borderRadius: 3, backgroundColor: "#ffffff", mt: 4 }}
                >
                  <CardContent sx={{ textAlign: "center", py: 8, px: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        backgroundColor: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      <PeopleIcon sx={{ fontSize: 40, color: "#94a3b8" }} />
                    </Paper>
                    <Typography variant="h6" sx={{ color: "#475569", mb: 1, fontWeight: 600 }}>
                      No recruiters found
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
                      Try adjusting your search criteria or time period filter
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedPeriod("all")
                        setAppliedCustomDates({ startDate: null, endDate: null })
                        if (typeof onPeriodChange === "function") {
                          onPeriodChange("all")
                        }
                      }}
                      sx={{
                        borderColor: "#cbd5e1",
                        color: "#475569",
                        textTransform: "none",
                        "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f8fafc" },
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  )
}

export default RecruiterDashboard
