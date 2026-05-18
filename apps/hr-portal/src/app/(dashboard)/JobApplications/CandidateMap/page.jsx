"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  Checkbox,
  ListItemIcon,
} from "@mui/material"
import {
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Psychology as AiIcon,
  CheckCircle as CheckIcon,
  Work as WorkIcon,
} from "@mui/icons-material"
import { useApi } from "@core/hooks/useApi"
import PendingIcon from '@mui/icons-material/Pending';

// Modern 2025 theme
const modernTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#ec4899",
      light: "#f472b6",
      dark: "#db2777",
    },
    background: {
      default: "#f8fafc",
      paper: "rgba(255, 255, 255, 0.95)",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "none",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
})

// Dynamically import the map component
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
        borderRadius: 3,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress size={60} sx={{ color: "#6366f1", mb: 2 }} />
        <Typography variant="h6" sx={{ color: "#64748b" }}>
          Loading Map...
        </Typography>
      </Box>
    </Box>
  ),
})

// Filter options to use value and label pairs
const filterOptions = {
  location: [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Chennai", label: "Chennai" },
    { value: "Pune", label: "Pune" },
    { value: "Indore", label: "Indore" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Ahmedabad", label: "Ahmedabad" },
    { value: "Jaipur", label: "Jaipur" },
  ],
  aiStatus: [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Recommended" },
    { value: "Rejected", label: "Not Recommended" },
  ],
  shortlistedStatus: [
    { value: "active", label: "Pending" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "notshortlisted", label: "Not Shortlisted" },
  ],
  experience: [
    { value: "0-1", label: "0-1 Years" },
    { value: "1-3", label: "1-3 Years" },
    { value: "3-5", label: "3-5 Years" },
    { value: "5-8", label: "5-8 Years" },
    { value: "8-12", label: "8-12 Years" },
    { value: "12+", label: "12+ Years" },
  ],
  education: [
    { value: "graduate", label: "Graduate" },
    { value: "postgraduate", label: "Post Graduate" },
    { value: "diploma", label: "Diploma" },
    { value: "certification", label: "Professional Certification" },
    { value: "phd", label: "PhD" },
  ],
}

const SIDEBAR_WIDTH = 380

export default function CandidateMap() {
  const [jobPosts, setJobPosts] = useState([])
  // Change selectedJob to selectedJobs array
  const [selectedJobs, setSelectedJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [filteredCandidates, setFilteredCandidates] = useState([])
  const [locationCounts, setLocationCounts] = useState({})
  const [totalApplications, setTotalApplications] = useState(0)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { callApi, loading } = useApi()
  const [jobPostsLoading, setJobPostsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter states to include education
  const [filters, setFilters] = useState({
    position: "",
    experience: "",
    location: "",
    aiStatus: "",
    shortlistedStatus: "",
    education: "",
  })

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Apply client-side search filtering (for search term only)
  useEffect(() => {
    let filtered = candidates

    // Apply search term filtering on client side
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.mobileNumber?.includes(searchTerm) ||
          candidate.branchNames?.some((branch) => branch.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredCandidates(filtered)
  }, [candidates, searchTerm])

  const fetchJobPosts = async () => {
    setJobPostsLoading(true)
    try {
      const result = await callApi({
        endpoint: `/v1/api/jobPost/getAllJobPostForLocation?status=all`,
        method: "GET",
        disableSnackbar: true,
      })

      if (result.success && result.data && result.data.items) {
        setJobPosts(result.data.items)
      } else {
        setJobPosts([])
      }
    } catch (error) {
      console.error("Error fetching job posts:", error)
      setJobPosts([])
    }
    setJobPostsLoading(false)
  }

  useEffect(() => {
    if (isMounted) {
      fetchJobPosts()
    }
  }, [isMounted])

  // Build query parameters from filters - Updated to handle array of job IDs
  const buildQueryParams = (jobIds, currentFilters) => {
    const params = new URLSearchParams()

    // Handle job IDs as array
    if (Array.isArray(jobIds)) {
      // Pass job IDs as array in the jobPostId parameter
      params.append("jobPostId", JSON.stringify(jobIds))
    } else {
      // Single job ID or "all"
      params.append("jobPostId", jobIds)
    }

    // Add filter parameters to the API call
    if (currentFilters.aiStatus) {
      params.append("AI_Screeing_Status", currentFilters.aiStatus)
    }
    if (currentFilters.shortlistedStatus) {
      params.append("resumeShortlisted", currentFilters.shortlistedStatus)
    }
    if (currentFilters.location) {
      params.append("location", currentFilters.location)
    }
    if (currentFilters.position) {
      params.append("position", currentFilters.position)
    }
    if (currentFilters.experience) {
      params.append("experience", currentFilters.experience)
    }

    return params.toString()
  }

  const fetchCandidates = async (jobId, currentFilters = filters) => {
    if (!jobId) return

    setError("")

    // Build the query string with filters
    const queryString = buildQueryParams(jobId, currentFilters)

    console.log("Fetching candidates with filters:", queryString)

    const result = await callApi({
      endpoint: `/v1/api/jobPost/getApplicantsLocationByJobPost?${queryString}`,
      method: "GET",
      disableSnackbar: true,
    })

    if (result.success) {
      const { data, locationCounts, totalApplications } = result.data.items
      setCandidates(data || [])
      setLocationCounts(locationCounts || {})
      setTotalApplications(totalApplications || 0)

      if (!data || data.length === 0) {
        setError("No candidates found for the selected criteria")
      }
    } else {
      setError(result.message || "Failed to fetch candidates")
      setCandidates([])
      setLocationCounts({})
      setTotalApplications(0)
    }
  }

  // Handle multi-select job changes with checkboxes
  const handleJobChange = (event) => {
    const value = event.target.value
    let newSelectedJobs = typeof value === "string" ? value.split(",") : value

    // Handle "All" selection
    if (newSelectedJobs.includes("all")) {
      if (selectedJobs.includes("all")) {
        // If "All" was already selected and clicked again, deselect all
        newSelectedJobs = []
      } else {
        // Select all jobs
        newSelectedJobs = ["all"]
      }
    } else {
      // Remove "all" if individual jobs are selected
      newSelectedJobs = newSelectedJobs.filter((job) => job !== "all")
    }

    setSelectedJobs(newSelectedJobs)

    if (newSelectedJobs.length > 0) {
      fetchCandidatesForMultipleJobs(newSelectedJobs, filters)
    } else {
      setCandidates([])
      setFilteredCandidates([])
      setLocationCounts({})
      setTotalApplications(0)
      setError("")
    }
  }

  // Handle removing individual job
  const handleJobRemove = (jobIdToRemove) => {
    const newSelectedJobs = selectedJobs.filter((jobId) => jobId !== jobIdToRemove)
    setSelectedJobs(newSelectedJobs)

    if (newSelectedJobs.length > 0) {
      fetchCandidatesForMultipleJobs(newSelectedJobs, filters)
    } else {
      setCandidates([])
      setFilteredCandidates([])
      setLocationCounts({})
      setTotalApplications(0)
      setError("")
    }
  }

  // Fetch candidates for multiple job positions
  const fetchCandidatesForMultipleJobs = async (jobIds, currentFilters = filters) => {
    if (!jobIds || jobIds.length === 0) return

    setError("")

    try {
      // If "all" is selected, pass "all" as jobPostId
      if (jobIds.includes("all")) {
        const queryString = buildQueryParams("all", currentFilters)

        const result = await callApi({
          endpoint: `/v1/api/jobPost/getApplicantsLocationByJobPost?${queryString}`,
          method: "GET",
          disableSnackbar: true,
        })

        if (result.success) {
          const { data, locationCounts, totalApplications } = result.data.items
          setCandidates(data || [])
          setLocationCounts(locationCounts || {})
          setTotalApplications(totalApplications || 0)

          if (!data || data.length === 0) {
            setError("No candidates found for the selected criteria")
          }
        } else {
          setError(result.message || "Failed to fetch candidates")
          setCandidates([])
          setLocationCounts({})
          setTotalApplications(0)
        }
      } else {
        // Handle multiple specific job selections - pass as array
        const queryString = buildQueryParams(jobIds, currentFilters)


        const result = await callApi({
          endpoint: `/v1/api/jobPost/getApplicantsLocationByJobPost?${queryString}`,
          method: "GET",
          disableSnackbar: true,
        })

        if (result.success) {
          const { data, locationCounts, totalApplications } = result.data.items
          setCandidates(data || [])
          setLocationCounts(locationCounts || {})
          setTotalApplications(totalApplications || 0)

          if (!data || data.length === 0) {
            setError("No candidates found for the selected positions and criteria")
          }
        } else {
          setError(result.message || "Failed to fetch candidates for selected positions")
          setCandidates([])
          setLocationCounts({})
          setTotalApplications(0)
        }
      }
    } catch (err) {
      console.error("Error fetching candidates:", err)
      setError("Failed to fetch candidates for selected positions")
      setCandidates([])
      setLocationCounts({})
      setTotalApplications(0)
    }
  }

  // Handle filter changes and refetch data for multiple jobs
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    }

    setFilters(newFilters)

    // If jobs are selected, refetch candidates with new filters
    if (selectedJobs.length > 0) {
      fetchCandidatesForMultipleJobs(selectedJobs, newFilters)
    }
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      position: "",
      experience: "",
      location: "",
      aiStatus: "",
      shortlistedStatus: "",
      education: "",
    }

    setFilters(clearedFilters)

    // If jobs are selected, refetch candidates without filters
    if (selectedJobs.length > 0) {
      fetchCandidatesForMultipleJobs(selectedJobs, clearedFilters)
    }
  }

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate)
  }

  // Group candidates by location for better display
  const groupedCandidates = useMemo(() => {
    const groups = {}
    filteredCandidates.forEach((candidate) => {
      const key = `${candidate.latitude}-${candidate.longitude}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(candidate)
    })
    return groups
  }, [filteredCandidates])

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredCandidatesList = useMemo(() => {
    return filteredCandidates.filter(
      (candidate) =>
        candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.mobileNumber?.includes(searchTerm) ||
        candidate.branchNames?.some((branch) => branch.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [filteredCandidates, searchTerm])

  // Get filter statistics
  const filterStats = useMemo(() => {
    const stats = {
      aiCompleted: candidates.filter((c) => c.AI_Screeing_Status === "Completed").length,
      shortlisted: candidates.filter((c) => c.resumeShortlisted === "active").length,
      notShortlisted: candidates.filter((c) => c.resumeShortlisted === "notshortlisted").length,
    }
    return stats
  }, [candidates])

  if (!isMounted) {
    return (
      <ThemeProvider theme={modernTheme}>
        <CssBaseline />
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
          }}
        >
          <CircularProgress size={60} sx={{ color: "#6366f1" }} />
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <Box sx={{ height: "100vh", background: "#f8fafc", }}>
        <Paper
          elevation={0}
          sx={{
            height: "100%",
            borderRadius: "20px",
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            display: "flex",
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              width: sidebarOpen ? "400px" : "60px",
              transition: "width 0.3s ease",
              borderRight: "1px solid rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              background: "rgba(248, 250, 252, 0.8)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Sidebar Header */}
            <Box sx={{ p: sidebarOpen ? 3 : 2, borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {sidebarOpen ? (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: "linear-gradient(135deg, #6366f1, #ec4899)",
                        }}
                      >
                        <LocationIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                          Candidate Insights
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          Explore the geographic distribution of applicant submissions.
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={() => setSidebarOpen(false)} size="small">
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => setSidebarOpen(true)} size="small" sx={{ mx: "auto" }}>
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>

              {/* Live Stats - Only show when sidebar is open */}
              {sidebarOpen && totalApplications > 0 && (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                  <Chip
                    icon={<PersonIcon />}
                    label={`${totalApplications} Total`}
                    size="small"
                    sx={{
                      background: "linear-gradient(45deg, #2196F3 30%, #2196F3 90%)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<AiIcon />}
                    label={`${filterStats.aiCompleted} AI Screened`}
                    size="small"
                    sx={{
                      background: "linear-gradient(45deg, #2196F3 30%, #2196F3 90%)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<CheckIcon />}
                    label={`${filterStats.shortlisted} Shortlisted`}
                    size="small"
                    sx={{
                      background: "linear-gradient(45deg, #2196F3 30%, #2196F3 90%)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<LocationIcon />}
                    label={`${Object.keys(locationCounts).length} Locations`}
                    size="small"
                    sx={{
                      background: "linear-gradient(45deg, #2196F3 30%, #2196F3 90%)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Sidebar Content - Only show when open */}
            {sidebarOpen && (
              <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
                {/* Job Selection - Multi-select with checkboxes */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                    Job Positions
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Select Job Positions</InputLabel>
                    <Select
                      multiple
                      value={selectedJobs}
                      onChange={handleJobChange}
                      disabled={jobPostsLoading}
                      label="Select Job Positions"
                      renderValue={(selected) => {
                        if (selected.length === 0) return "Select positions"
                        if (selected.includes("all")) return "All Positions"
                        if (selected.length === 1) {
                          const job = jobPosts.find((j) => j._id === selected[0])
                          return job?.designation?.name || "Unknown Position"
                        }
                        return `${selected.length} positions selected`
                      }}
                      sx={{
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(99, 102, 241, 0.2)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6366f1",
                        },
                      }}
                    >
                      {jobPostsLoading ? (
                        <MenuItem disabled>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Loading positions...
                        </MenuItem>
                      ) : (
                        [
                          // All option with checkbox
                          <MenuItem key="all" value="all">
                            <ListItemIcon>
                              <Checkbox
                                checked={selectedJobs.includes("all")}
                                sx={{
                                  color: "#6366f1",
                                  "&.Mui-checked": {
                                    color: "#6366f1",
                                  },
                                }}
                              />
                            </ListItemIcon>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  background: "linear-gradient(135deg, #10b981, #34d399)",
                                  fontSize: 10,
                                }}
                              >
                                ✓
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                  All Positions
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#64748b" }}>
                                  Select all available job positions
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>,
                          ...(Array.isArray(jobPosts)
                            ? jobPosts.map((job) => (
                                <MenuItem key={job._id} value={job._id}>
                                  <ListItemIcon>
                                    <Checkbox
                                      checked={selectedJobs.includes(job._id)}
                                      sx={{
                                        color: "#6366f1",
                                        "&.Mui-checked": {
                                          color: "#6366f1",
                                        },
                                      }}
                                    />
                                  </ListItemIcon>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                                    <Avatar
                                      sx={{
                                        width: 24,
                                        height: 24,
                                        background: "linear-gradient(135deg, #6366f1, #ec4899)",
                                        fontSize: 10,
                                      }}
                                    >
                                      {job.designation?.name?.charAt(0) || "J"}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                        {job.designation?.name || "Unknown Position"}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                                        {job.branches?.map((branch) => branch.name).join(", ") || "Unknown Branch"} •{" "}
                                        {job.totalApplicants || 0} applicants
                                      </Typography>
                                    </Box>
                                  </Box>
                                </MenuItem>
                              ))
                            : []),
                        ]
                      )}
                    </Select>
                  </FormControl>

                  {/* Selected Jobs Display */}
                  {selectedJobs.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" sx={{ color: "#64748b", mb: 1, display: "block" }}>
                        Selected Positions ({selectedJobs.length}):
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedJobs.includes("all") ? (
                          <Chip
                            label="All Positions"
                            size="small"
                            onDelete={() => setSelectedJobs([])}
                            sx={{
                              background: "linear-gradient(135deg, #10b981, #34d399)",
                              color: "white",
                              "& .MuiChip-deleteIcon": {
                                color: "white",
                              },
                            }}
                          />
                        ) : (
                          selectedJobs.map((jobId) => {
                            const job = jobPosts.find((j) => j._id === jobId)
                            return (
                              <Chip
                                key={jobId}
                                label={job?.designation?.name || "Unknown"}
                                size="small"
                                onDelete={() => handleJobRemove(jobId)}
                                sx={{
                                  background: "rgba(99, 102, 241, 0.1)",
                                  color: "#6366f1",
                                  "& .MuiChip-deleteIcon": {
                                    color: "#6366f1",
                                  },
                                }}
                              />
                            )
                          })
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Filters */}
                {selectedJobs.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <FilterIcon sx={{ fontSize: 16 }} />
                        Smart Filters
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#6366f1", cursor: "pointer", fontWeight: 600 }}
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {/* AI Status Filter */}
                      <FormControl fullWidth size="small">
                        <InputLabel>AI Screening Status</InputLabel>
                        <Select
                          value={filters.aiStatus}
                          onChange={(e) => handleFilterChange("aiStatus", e.target.value)}
                          label="AI Screening Status"
                          sx={{ borderRadius: "8px" }}
                        >
                          <MenuItem value="">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <AiIcon sx={{ fontSize: 16, color: "#64748b" }} />
                              All Statuses
                            </Box>
                          </MenuItem>
                          {filterOptions.aiStatus.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <AiIcon
                                  sx={{
                                    fontSize: 16,
                                    color:
                                      option.value === "Completed" || option.value === "Approved"
                                        ? "#10b981"
                                        : option.value === "Rejected" || option.value === "Failed"
                                          ? "#ef4444"
                                          : "#f59e0b",
                                  }}
                                />
                                {option.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Shortlisted Status Filter */}
                      <FormControl fullWidth size="small">
                        <InputLabel>Shortlisted Status</InputLabel>
                        <Select
                          value={filters.shortlistedStatus}
                          onChange={(e) => handleFilterChange("shortlistedStatus", e.target.value)}
                          label="Shortlisted Status"
                          sx={{ borderRadius: "8px" }}
                        >
                          <MenuItem value="">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CheckIcon sx={{ fontSize: 16, color: "#64748b" }} />
                              All Statuses
                            </Box>
                          </MenuItem>
                          {filterOptions.shortlistedStatus.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {option.value === "active"  ? (
                                  <PendingIcon sx={{ fontSize: 16, color: "#10b981" }} />
                                ) : option.value === "Rejected" ? (
                                  <CloseIcon sx={{ fontSize: 16, color: "#ef4444" }} />
                                ) : option.value === "onhold" ? (
                                  <AiIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
                                ) : (
                                  <AiIcon sx={{ fontSize: 16, color: "#64748b" }} />
                                )}
                                {option.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Location Filter */}
                      {/* <FormControl fullWidth size="small">
                        <InputLabel>Location</InputLabel>
                        <Select
                          value={filters.location}
                          onChange={(e) => handleFilterChange("location", e.target.value)}
                          label="Location"
                          sx={{ borderRadius: "8px" }}
                        >
                          <MenuItem value="">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LocationIcon sx={{ fontSize: 16, color: "#64748b" }} />
                              All Locations
                            </Box>
                          </MenuItem>
                          {filterOptions.location.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <LocationIcon sx={{ fontSize: 16, color: "#6366f1" }} />
                                {option.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl> */}

               
                    </Box>

                    {/* Active Filters Display */}
                    {Object.values(filters).some((filter) => filter) && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" sx={{ color: "#64748b", mb: 1, display: "block" }}>
                          Active Filters:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {Object.entries(filters).map(
                            ([key, value]) =>
                              value && (
                                <Chip
                                  key={key}
                                  label={`${
                                    key === "aiStatus"
                                      ? "AI Status"
                                      : key === "shortlistedStatus"
                                        ? "Shortlist"
                                        : key === "location"
                                          ? "Location"
                                          : key === "experience"
                                            ? "Experience"
                                            : key.charAt(0).toUpperCase() + key.slice(1)
                                  }: ${filterOptions[key]?.find((option) => option.value === value)?.label || value}`}
                                  size="small"
                                  onDelete={() => handleFilterChange(key, "")}
                                  sx={{
                                    background: "rgba(99, 102, 241, 0.1)",
                                    color: "#6366f1",
                                    "& .MuiChip-deleteIcon": {
                                      color: "#6366f1",
                                    },
                                  }}
                                />
                              ),
                          )}
                        </Box>
                      </Box>
                    )}

                    {/* Loading indicator for filter changes */}
                    {loading && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 2,
                          p: 2,
                          background: "rgba(99, 102, 241, 0.05)",
                          borderRadius: "8px",
                        }}
                      >
                        <CircularProgress size={16} />
                        <Typography variant="caption" sx={{ color: "#6366f1" }}>
                          Applying filters...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Results Summary */}
                {candidates.length > 0 && (
                  <Box sx={{ mb: 2, p: 2, background: "rgba(99, 102, 241, 0.05)", borderRadius: "8px" }}>
                    <Typography variant="body2" sx={{ color: "#6366f1", fontWeight: 600 }}>
                      Showing {filteredCandidates.length} of {candidates.length} candidates
                    </Typography>
                    {Object.values(filters).some((filter) => filter) && (
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.5 }}>
                        Results filtered by API
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Error Display */}
                {error && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      background: "rgba(239, 68, 68, 0.05)",
                      borderRadius: "8px",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#ef4444", fontWeight: 600 }}>
                      {error}
                    </Typography>
                  </Box>
                )}

                {/* Candidate List */}
                {filteredCandidates.length > 0 && (
                  <Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                      Candidates ({filteredCandidates.length})
                    </Typography>

                    {/* Search */}
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 18, color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />

                    {/* Candidate List */}
                    <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                      <List dense>
                        {filteredCandidatesList.map((candidate, index) => (
                          <ListItem
                            key={index}
                            button
                            onClick={() => handleCandidateSelect(candidate)}
                            sx={{
                              borderRadius: "8px",
                              mb: 1,
                              "&:hover": {
                                backgroundColor: "rgba(99, 102, 241, 0.05)",
                              },
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  background:
                                    candidate.resumeShortlisted === "active"
                                      ? "linear-gradient(135deg, #10b981, #34d399)"
                                      : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                  fontSize: 12,
                                }}
                              >
                                {candidate.name.charAt(0).toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                                  {candidate.name}
                                </Typography>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="caption" sx={{ color: "#6366f1", fontWeight: 500 }}>
                                    {candidate.position || "Position not specified"}
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: "block", color: "#64748b" }}>
                                    {candidate.branchNames.join(", ")}
                                  </Typography>
                                  <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                                    <Chip
                                      size="small"
                                      label={candidate.AI_Screeing_Status}
                                      sx={{
                                        fontSize: "10px",
                                        height: "16px",
                                        background:
                                          candidate.AI_Screeing_Status === "Completed"
                                            ? "rgba(16, 185, 129, 0.1)"
                                            : "rgba(245, 158, 11, 0.1)",
                                        color: candidate.AI_Screeing_Status === "Completed" ? "#10b981" : "#f59e0b",
                                      }}
                                    />
                                    <Chip
                                      size="small"
                                      label={
                                        candidate.resumeShortlisted === "active" ? "Shortlisted" : "Not Shortlisted"
                                      }
                                      sx={{
                                        fontSize: "10px",
                                        height: "16px",
                                        background:
                                          candidate.resumeShortlisted === "active"
                                            ? "rgba(16, 185, 129, 0.1)"
                                            : "rgba(239, 68, 68, 0.1)",
                                        color: candidate.resumeShortlisted === "active" ? "#10b981" : "#ef4444",
                                      }}
                                    />
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Sidebar Footer - Only show when open */}
            {/* {sidebarOpen && (
              <Box sx={{ p: 3, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}>
                <Typography variant="caption" sx={{ color: "#64748b", textAlign: "center", display: "block" }}>
                  Powered by AI • Real-time insights
                </Typography>
              </Box>
            )} */}
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Map Container */}
            <Box sx={{ flex: 1, p: 3, pt: error ? 0 : 3 }}>
              <Box
                sx={{
                  height: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                }}
              >
                <MapComponent
                  candidates={filteredCandidates}
                  groupedCandidates={groupedCandidates}
                  loading={loading}
                  formatDate={formatDate}
                  selectedCandidate={selectedCandidate}
                  onCandidateSelect={handleCandidateSelect}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}
