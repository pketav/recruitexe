"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Checkbox,
  Chip,
  Badge,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Stack,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
  Container,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material"
import {
  Assessment,
  List as ListIcon,
  Save,
  Search,
  Add,
  VerifiedUser,
  InfoOutlined,
  ArrowBack,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Security, // Added for category icon
  AccountBalance, // Added for category icon
  Business, // Added for category icon
  Fingerprint, // Added for category icon
} from "@mui/icons-material"
import { useApi } from "@core/hooks/useApi"
import { useRouter } from "next/navigation"

const TabbedVerificationSuite = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedApis, setSelectedApis] = useState([]) // Stores API IDs
  const [createReportDialog, setCreateReportDialog] = useState(false)
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [apiCategories, setApiCategories] = useState([])
  const [allApis, setAllApis] = useState([]) // Flattened list of all APIs
  const [apiError, setApiError] = useState(null)
  const [fetchedReports, setFetchedReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportsError, setReportsError] = useState(null)
  const [serviceNameToApiNameMap, setServiceNameToApiNameMap] = useState({}) // New state for mapping
  const [expandedReports, setExpandedReports] = useState({})

  // States for Stage Management
  const [stages, setStages] = useState([])
  const [stagesLoading, setStagesLoading] = useState(false)
  const [stagesError, setStagesError] = useState(null)
  const [newStageName, setNewStageName] = useState("")
  const newStageUsedBy = "HR" // Fixed value for new stage creation
  const [newStageStatus, setNewStageStatus] = useState("active")
  const [newStageNameError, setNewStageNameError] = useState(false) // New state for validation error

  // New states for Editing Stage
  const [editStageDialog, setEditStageDialog] = useState(false)
  const [currentEditingStage, setCurrentEditingStage] = useState(null)
  const [editedStageName, setEditedStageName] = useState("")
  const [editedStageStatus, setEditedStageStatus] = useState("")

  // State for Add Qualification Dialog
  const [addQualificationDialog, setAddQualificationDialog] = useState(false)

  const { callApi, loading } = useApi()
  const router = useRouter()

  // Utility function to format API names for better readability
  const formatApiName = (name) => {
    if (!name) return ""
    return name
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/([A-Z])/g, " $1") // Add space before capital letters (for camelCase)
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
      .join(" ")
  }

  // Utility function to get description for a category
  const getDescriptionForCategory = (categoryName) => {
    switch (categoryName) {
      case "Government ID Verification":
        return "Verify government IDs such as passports and driving licenses."
      case "Background & Due Diligence":
        return "Check background information and perform due diligence."
      case "Biometric & Address Verification":
        return "Verify biometric data and addresses."
      case "Financial Verification":
        return "Verify financial information and credit scores."
      default:
        return "No description available."
    }
  }

  // Transform API data to match component structure
  const transformApiData = (items) => {
    const categoryIcons = {
      "Government ID Verification": Security,
      "Background & Due Diligence": Business,
      "Biometric & Address Verification": Fingerprint,
      "Financial Verification": AccountBalance,
    }
    return items.map((item, index) => {
      const categoryName = item.category?.name || "Uncategorized APIs"
      const categoryId = item.category?._id || `uncategorized-${index}`
      return {
        id: categoryId,
        name: categoryName,
        icon: categoryIcons[categoryName] || Security,
        totalApis: item.apis.length,
        description: getDescriptionForCategory(categoryName),
        apis: item.apis.map((api) => ({
          id: api._id,
          apiId: api.apiId,
          name: api.apiName,
          code: `API_${api.apiId}`,
          inputParams: "Dynamic based on API",
          output: "Verification Result",
          credit: api.defaultLimit ? Math.floor(api.defaultLimit / 100) : 5, // Estimate credits
          responseTime: "2-3 seconds",
          accuracy: "99%",
          status: api.status,
          description: api.description,
          serviceName: api.serviceName,
          servicePath: api.servicePath,
          requiredFields: api.requiredFields || [],
        })),
      }
    })
  }

  // Function to fetch stages (reusable)
  const fetchStages = async () => {
    setStagesLoading(true)
    try {
      const stagesResult = await callApi({
        endpoint: "/v1/api/verifyDocs/stage",
        method: "GET",
        disableSnackbar: true,
      })
      if (stagesResult.success && stagesResult.data.items) {
        setStages(stagesResult.data.items)
        setStagesError(null)
      } else {
        setStagesError("Failed to load stages")
      }
    } catch (error) {
      setStagesError("Error fetching stages")
      console.error("Stages fetch error:", error)
    } finally {
      setStagesLoading(false)
    }
  }

  // Fetch APIs, Saved Reports, and Stages on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch API categories
      try {
        const apiResult = await callApi({
          endpoint: "/v1/api/Auth/getApisByCategory",
          method: "GET",
          disableSnackbar: true,
        })
        if (apiResult.success && apiResult.data.items) {
          const transformedCategories = transformApiData(apiResult.data.items)
          setApiCategories(transformedCategories)
          const flattenedApis = transformedCategories.flatMap((cat) => cat.apis)
          setAllApis(flattenedApis)
          setApiError(null)
        } else {
          setApiError("Failed to load APIs")
        }
      } catch (error) {
        setApiError("Error fetching APIs")
        console.error("API fetch error:", error)
      }

      // Fetch saved reports
      setReportsLoading(true)
      try {
        const reportsResult = await callApi({
          endpoint: "/v1/api/verifyDocs/GetCategoryReport",
          method: "GET",
          disableSnackbar: true,
        })
        if (reportsResult.success && reportsResult.data.items) {
          setFetchedReports(reportsResult.data.items)
          setReportsError(null)
        } else {
          setReportsError("Failed to load saved reports")
        }
      } catch (error) {
        setReportsError("Error fetching saved reports")
        console.error("Reports fetch error:", error)
      } finally {
        setReportsLoading(false)
      }

      // Fetch stages
      await fetchStages()
    }
    fetchData()
  }, [])

  // Effect to create the serviceName to apiName map
  useEffect(() => {
    if (allApis.length > 0) {
      const map = {}
      allApis.forEach((api) => {
        map[api.serviceName] = formatApiName(api.name)
      })
      setServiceNameToApiNameMap(map)
    }
  }, [allApis])

  // API Catalog functions
  const handleApiToggle = (apiId) => {
    setSelectedApis((prev) => {
      if (prev.includes(apiId)) {
        return prev.filter((id) => id !== apiId)
      } else {
        return [...prev, apiId]
      }
    })
  }

  const getTotalSelectedApis = () => selectedApis.length

  const clearSelection = () => {
    setSelectedApis([])
  }

  const handleCreateReport = () => {
    if (getTotalSelectedApis() === 0) {
      return
    }
    setCreateReportDialog(true)
    setReportName(`verification_suite_${new Date().getTime()}`)
  }

  const submitCreateReport = async () => {
    const selectedServiceNames = [
      ...new Set(
        selectedApis
          .map((apiId) => {
            const api = allApis.find((a) => a.id === apiId)
            return api ? api.serviceName : null
          })
          .filter(Boolean),
      ),
    ]
    const payload = {
      reportName: reportName,
      categories: selectedServiceNames,
    }
    try {
      const result = await callApi({
        endpoint: "/v1/api/verifyDocs/UpdateCategoryReport",
        method: "POST",
        data: payload,
      })
      if (result.success) {
        console.log("Report created successfully:", result.data)
        setCreateReportDialog(false)
        setReportName("")
        setReportDescription("")
        setSelectedApis([]) // Clear selection after report creation
        // Re-fetch reports to update the list
        setReportsLoading(true)
        const reportsResult = await callApi({
          endpoint: "/v1/api/verifyDocs/GetCategoryReport",
          method: "GET",
          disableSnackbar: true,
        })
        if (reportsResult.success && reportsResult.data.items) {
          setFetchedReports(reportsResult.data.items)
          setReportsError(null)
        } else {
          setReportsError("Failed to load saved reports after creation")
        }
        setReportsLoading(false)
      } else {
        setApiError(result.message || "Failed to create report.")
      }
    } catch (error) {
      setApiError("Error creating report.")
      console.error("Create report error:", error)
    }
  }

  // Stage Management functions
  const handleAddStage = async () => {
    if (!newStageName.trim()) {
      setNewStageNameError(true)
      return
    }
    setNewStageNameError(false) // Clear error if valid

    const payload = {
      stageName: newStageName,
      usedBy: newStageUsedBy,
      status: newStageStatus,
    }

    setStagesLoading(true)
    try {
      const result = await callApi({
        endpoint: "/v1/api/verifyDocs/stage",
        method: "POST",
        data: payload,
      })
      if (result.success) {
        setNewStageName("") // Clear form
        await fetchStages() // Re-fetch stages
      } else {
        setStagesError(result.message || "Failed to add stage.")
      }
    } catch (error) {
      setStagesError("Error adding stage.")
      console.error("Add stage error:", error)
    } finally {
      setStagesLoading(false)
    }
  }

  const handleEditStageClick = (stage) => {
    setCurrentEditingStage(stage)
    setEditedStageName(stage.stageName)
    setEditedStageStatus(stage.status)
    setEditStageDialog(true)
  }

  const submitUpdateStage = async () => {
    if (!currentEditingStage || !editedStageName) {
      return
    }

    const payload = {
      stageName: editedStageName,
      usedBy: newStageUsedBy, // Keep fixed as HR for update payload
      status: editedStageStatus,
    }

    setStagesLoading(true)
    try {
      const result = await callApi({
        endpoint: `/v1/api/verifyDocs/Updatestage/${currentEditingStage._id}`,
        method: "POST",
        data: payload,
      })
      if (result.success) {
        setEditStageDialog(false)
        setCurrentEditingStage(null)
        setEditedStageName("")
        setEditedStageStatus("")
        await fetchStages() // Re-fetch stages
      } else {
        setStagesError(result.message || "Failed to update stage.")
      }
    } catch (error) {
      setStagesError("Error updating stage.")
      console.error("Update stage error:", error)
    } finally {
      setStagesLoading(false)
    }
  }

  const tabItems = [
    { id: 0, label: "API Catalog", icon: ListIcon },
    { id: 1, label: "Saved Reports", icon: Save, badge: fetchedReports.length },
    { id: 2, label: "Settings", icon: SettingsIcon },
  ]

  // Filter APIs based on search term and category filter for flat display
  const getFilteredApis = () => {
    let filteredApis = allApis
    if (categoryFilter !== "all") {
      const selectedCategory = apiCategories.find((cat) => cat.id === categoryFilter)
      if (selectedCategory) {
        filteredApis = selectedCategory.apis
      } else {
        filteredApis = [] // No APIs if category not found
      }
    }
    if (searchTerm.trim()) {
      filteredApis = filteredApis.filter(
        (api) =>
          api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          api.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          api.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    return filteredApis
  }

  const renderApiCatalog = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}>
          API Catalog
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Select verification APIs to create custom validation workflows
        </Typography>
        {/* Search and Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search APIs by name, code, or functionality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />
            </Grid>
     
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Add />}
                onClick={handleCreateReport}
                disabled={getTotalSelectedApis() === 0}
                sx={{
                  bgcolor: getTotalSelectedApis() > 0 ? "primary.main" : "action.disabledBackground",
                  color: getTotalSelectedApis() > 0 ? "primary.contrastText" : "action.disabled",
                  borderRadius: 1,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    bgcolor: getTotalSelectedApis() > 0 ? "primary.dark" : "action.disabledBackground",
                  },
                }}
              >
                Create Report ({getTotalSelectedApis()})
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {/* Selection Info */}
        {getTotalSelectedApis() > 0 && (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              borderRadius: 1,
              "& .MuiAlert-message": { fontSize: "1rem" },
            }}
            action={
              <Button color="inherit" size="small" onClick={clearSelection} sx={{ fontWeight: "bold" }}>
                CLEAR ALL
              </Button>
            }
          >
            <strong>{getTotalSelectedApis()} APIs selected</strong> • Ready to create verification report
          </Alert>
        )}
      </Box>
      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {/* Error State */}
      {apiError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {apiError}
        </Alert>
      )}
      {/* API List - Redesigned with Cards */}
      {!loading && !apiError && (
        <Grid container spacing={3}>
          {getFilteredApis().length > 0 ? (
            getFilteredApis().map((api) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={api.id}>
                <Card
                  elevation={1} // Default elevation
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 6, // Enhanced shadow on hover
                      transform: "translateY(-5px)", // More pronounced lift
                    },
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: selectedApis.includes(api.id) ? "2px solid" : "2px solid transparent",
                    borderColor: selectedApis.includes(api.id) ? "primary.main" : "transparent", // Blue border for selected
                  }}
                  onClick={() => handleApiToggle(api.id)} // Toggle selection on card click
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                      <Checkbox
                        size="small"
                        checked={selectedApis.includes(api.id)}
                        onChange={(e) => {
                          e.stopPropagation() // Prevent card click from firing
                          handleApiToggle(api.id)
                        }}
                        sx={{
                          color: "action.active",
                          "&.Mui-checked": { color: "primary.main" }, // Use primary blue for checked
                        }}
                      />
                      <Chip
                        label={api.status}
                        size="small"
                        sx={{
                          bgcolor:
                            api.status === "active"
                              ? "success.light"
                              : api.status === "maintenance"
                                ? "warning.light"
                                : "error.light",
                          color:
                            api.status === "active"
                              ? "success.dark"
                              : api.status === "maintenance"
                                ? "warning.dark"
                                : "error.dark",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
                      {formatApiName(api.name)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                      {api.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 3, pt: 0, display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
                      ₹{api.credit}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No APIs found matching your criteria
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  )

  const renderSavedReports = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}>
          Saved Reports
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage and monitor your verification report configurations
        </Typography>
      </Box>
      {reportsLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {reportsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {reportsError}
        </Alert>
      )}
      {!reportsLoading && !reportsError && fetchedReports.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No saved reports found. Create one from the API Catalog!
          </Typography>
        </Box>
      )}
      {!reportsLoading && !reportsError && fetchedReports.length > 0 && (
        <Grid container spacing={3}>
          {fetchedReports.map((report) => {
            // Calculate total APIs and estimated credits for the report
            const reportApiCount = report.categories ? report.categories.length : 0
            const estimatedCredits = report.categories.reduce((total, serviceName) => {
              const api = allApis.find((a) => a.serviceName === serviceName)
              return total + (api?.credit || 0)
            }, 0)
            return (
              <Grid item xs={12} md={6} lg={4} key={report._id}>
                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          bgcolor: report.isActive ? "#4CAF50" : "#FF9800", // Green for active, Orange for paused
                          width: 48,
                          height: 48,
                          borderRadius: "50%", // Make it circular like an Avatar
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Assessment sx={{ color: "white" }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
                          {report.reportName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Created: {new Date(report.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Chip
                          label={`${reportApiCount} APIs`}
                          sx={{ bgcolor: "#E0F7FA", color: "#00BCD4", fontWeight: "bold" }} // Light Cyan / Cyan
                        />
                        <Chip
                          label={`₹${estimatedCredits} Credits`}
                          sx={{ bgcolor: "#E8F5E8", color: "#4CAF50", fontWeight: "bold" }} // Light Green / Green
                        />
                      </Box>
                      {report.categories && report.categories.length > 0 && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: "medium" }}>
                            Included APIs:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {(expandedReports[report._id] ? report.categories : report.categories.slice(0, 2)).map(
                              (serviceName, index) => (
                                <Chip
                                  key={index}
                                  label={serviceNameToApiNameMap[serviceName] || serviceName}
                                  size="small"
                                  sx={{ bgcolor: "#EDE7F6", color: "#673AB7", fontWeight: "medium" }}
                                />
                              ),
                            )}
                            {report.categories.length > 2 && (
                              <Button
                                size="small"
                                onClick={() => toggleReportApis(report._id)}
                                sx={{
                                  textTransform: "none",
                                  fontWeight: "bold",
                                  color: "primary.main",
                                  minWidth: 0,
                                  px: 1,
                                  py: 0.5,
                                }}
                              >
                                {expandedReports[report._id] ? "Show Less" : `+${report.categories.length - 2} More`}
                              </Button>
                            )}
                          </Stack>
                        </Box>
                      )}
                 
                    </Stack>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                      <Chip
                        label={report.isActive ? "active" : "paused"}
                        size="small"
                        sx={{
                          bgcolor: report.isActive ? "#E8F5E8" : "#FFF3E0", // Light Green / Light Orange
                          color: report.isActive ? "#2E7D32" : "#F57C00", // Dark Green / Dark Orange
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      />
                      {/* Removed action buttons as per request */}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Container>
  )

  const toggleReportApis = (reportId) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }))
  }

  const renderSettingsTab = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}>
          Verification Stages Settings
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Manage the stages for verification workflows
        </Typography>
      </Box>

      {/* Conditionally render Add New Stage Form or message */}
      {stages.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Add New Stage
          </Typography>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={newStageNameError}>
                <InputLabel id="stage-name-label">Stage Name</InputLabel>
                <Select
                  labelId="stage-name-label"
                  value={newStageName}
                  onChange={(e) => {
                    setNewStageName(e.target.value)
                    setNewStageNameError(false) // Clear error on change
                  }}
                  label="Stage Name"
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="">
                    <em>Select a Stage</em>
                  </MenuItem>
                  <MenuItem value="Resume Shortlisting">Resume Shortlisting</MenuItem>
                  <MenuItem value="Offer Letter">Offer Letter</MenuItem>
                </Select>
                {newStageNameError && (
                  <Typography color="error" variant="caption">
                    Stage Name is required
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="stage-status-label">Status</InputLabel>
                <Select
                  labelId="stage-status-label"
                  value={newStageStatus}
                  onChange={(e) => setNewStageStatus(e.target.value)}
                  label="Status"
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddStage}
                disabled={stagesLoading}
                sx={{
                  borderRadius: 1,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {stagesLoading ? <CircularProgress size={24} color="inherit" /> : "Add Stage"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
          A verification stage has already been configured. Only one stage is allowed.
        </Alert>
      )}

      {/* Display Existing Stages */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "text.primary" }}>
        Existing Stages
      </Typography>
      {stagesLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {stagesError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {stagesError}
        </Alert>
      )}
      {!stagesLoading && !stagesError && stages.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No stages found. Add a new one above!
          </Typography>
        </Box>
      )}
      {!stagesLoading && !stagesError && stages.length > 0 && (
        <Grid container spacing={3}>
          {stages.map((stage) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={stage._id}>
              <Card elevation={1} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {stage.stageName}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleEditStageClick(stage)}
                      disabled={stagesLoading}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Chip
                    label={stage.status}
                    size="small"
                    sx={{
                      bgcolor: stage.status === "active" ? "success.light" : "error.light",
                      color: stage.status === "active" ? "success.dark" : "error.dark",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  />
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 2, display: "block" }}>
                    Created: {new Date(stage.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )

  const renderCreateReportDialog = () => (
    <Dialog
      open={createReportDialog}
      onClose={() => setCreateReportDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Create Verification Report
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Report Name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
          <TextField
            fullWidth
            label="Description (Optional)"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            multiline
            rows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
          <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Report Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Selected APIs
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {getTotalSelectedApis()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Estimated Credits
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  ₹
                  {selectedApis.reduce((total, apiId) => {
                    const api = allApis.find((a) => a.id === apiId)
                    return total + (api?.credit || 0)
                  }, 0)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setCreateReportDialog(false)} sx={{ borderRadius: 1 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={submitCreateReport}
          disabled={!reportName.trim()}
          sx={{
            bgcolor: "primary.main",
            borderRadius: 1,
            px: 3,
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Create Report
        </Button>
      </DialogActions>
    </Dialog>
  )

  const renderEditStageDialog = () => (
    <Dialog
      open={editStageDialog}
      onClose={() => setEditStageDialog(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Edit Verification Stage
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="edit-stage-name-label">Stage Name</InputLabel>
            <Select
              labelId="edit-stage-name-label"
              value={editedStageName}
              onChange={(e) => setEditedStageName(e.target.value)}
              label="Stage Name"
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value="Resume Shortlisting">Resume Shortlisting</MenuItem>
              <MenuItem value="Offer Letter">Offer Letter</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="edit-stage-status-label">Status</InputLabel>
            <Select
              labelId="edit-stage-status-label"
              value={editedStageStatus}
              onChange={(e) => setEditedStageStatus(e.target.value)}
              label="Status"
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setEditStageDialog(false)} sx={{ borderRadius: 1 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={submitUpdateStage}
          disabled={!editedStageName || stagesLoading}
          sx={{
            bgcolor: "primary.main",
            borderRadius: 1,
            px: 3,
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          {stagesLoading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  )



  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          // Keyframes for the float animation
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VerifiedUser sx={{ fontSize: 30, color: "white" }} /> {/* Original icon */}
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: "white", mb: 0.5 }}>
                Verification Suite {/* Original text */}
              </Typography>
              <Tooltip title="Manage verification APIs and reports.">
                <InfoOutlined sx={{ color: "#ffffff", fontSize: 24, cursor: "pointer" }} />
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
        
            <Button
              variant="outlined"
              sx={{
                borderRadius: "25px",
                color: "white",
                borderColor: "white",
              }}
              onClick={() => router.push("/employeeSetup")}
            >
              <ArrowBack />
            </Button>
          </Box>
        </Box>
      </Paper>
      {/* Tab Navigation */}
      <Box sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="xl">
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "medium",
                fontSize: "1rem",
                minHeight: 64,
              },
            }}
          >
            {tabItems.map((item) => (
              <Tab
                key={item.id}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <item.icon />
                    {item.label}
                    {item.badge > 0 && <Badge badgeContent={item.badge} color="primary" />}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Container>
      </Box>
      {/* Tab Content */}
      {currentTab === 0 && renderApiCatalog()}
      {currentTab === 1 && renderSavedReports()}
      {currentTab === 2 && renderSettingsTab()}
      {/* Dialogs */}
      {renderCreateReportDialog()}
      {renderEditStageDialog()}
    </Box>
  )
}

export default TabbedVerificationSuite
