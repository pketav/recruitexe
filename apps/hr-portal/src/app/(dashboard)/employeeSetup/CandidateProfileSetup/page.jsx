"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
  Grid,
  Chip,
  Switch,
  Alert,
  Snackbar,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import {
  ExpandMore,
  Refresh,
  Info,
  People,
  School,
  Work,
  AccountBalance,
  Description,
  VerifiedUser,
  Assignment,
  Settings,
  TrendingUp,
  AutoAwesome,
  ViewModule,
  Save,
  PowerSettingsNew,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material"
import axios from "axios"

// Enhanced form tabs configuration with consistent purple theme
const FORM_TAB_CONFIG = {
  basic_info: {
    icon: <Info />,
    color: "#62afdc",
    gradient: "linear-gradient(135deg, #62afdc 0%, #7c3aed 100%)",
    title: "Basic Information",
    description: "Personal details, contact info, and addresses",
    category: "Personal",
  },
  family_info: {
    icon: <People />,
    color: "#62afdc",
    gradient: "linear-gradient(135deg, #62afdc 0%, #7c3aed 100%)",
    title: "Family Information",
    description: "Family members, emergency contacts, and relationships",
    category: "Personal",
  },
  education: {
    icon: <School />,
    color: "#62afdc",
    gradient: "linear-gradient(135deg, #62afdc 0%, #7c3aed 100%)",
    title: "Education",
    description: "Academic qualifications, degrees, and certifications",
    category: "Academic",
  },
  professional_Experience: {
    icon: <Work />,
    color: "#62afdc",
    gradient: "linear-gradient(135deg, #62afdc 0%, #7c3aed 100%)",
    title: "Work Experience",
    description: "Employment history, job roles, and responsibilities",
    category: "Professional",
  },
  professional_experience: {
    icon: <Work />,
    color: "#62afdc",
    gradient: "linear-gradient(135deg, #62afdc 0%, #7c3aed 100%)",
    title: "Work Experience",
    description: "Employment history, job roles, and responsibilities",
    category: "Professional",
  },
  Bank_verification: {
    icon: <AccountBalance />,
    color: "#62afdc",
    gradient: "linear-gradient(135deg, #62afdc 0%, #7c3aed 100%)",
    title: "Banking Details",
    description: "Bank account information and financial details",
    category: "Financial",
  },
  KYC_Details: {
    icon: <VerifiedUser />,
    color: "#62afdc",
    gradient: "linear-gradient(135deg, #62afdc 0%, #7c3aed 100%)",
    title: "KYC Documents",
    description: "Identity verification and compliance documents",
    category: "Verification",
  },
  Personal_Documents: {
    icon: <Description />,
    color: "#62afdc",
    gradient: "linear-gradient(135deg, #62afdc 0%, #7c3aed 100%)",
    title: "Personal Documents",
    description: "ID proofs, certificates, and personal files",
    category: "Documents",
  },
  OtherDocument: {
    icon: <Assignment />,
    color: "#62afdc",
    gradient: "linear-gradient(135deg, #62afdc 0%, #7c3aed 100%)",
    title: "Other Documents",
    description: "Additional documents and miscellaneous files",
    category: "Documents",
  },
}

const CandidateProfileSetup = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.example.com"

  // Get token from localStorage
  const [token, setToken] = useState("")
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(window.localStorage.getItem("authToken") || "")
    }
  }, [])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stagesData, setStagesData] = useState([])
  const [selectedStageIndex, setSelectedStageIndex] = useState(0)
  const [expandedSections, setExpandedSections] = useState({})
  const [showAllTab, setShowAllTab] = useState(false)
  const [stageSelectionPopup, setStageSelectionPopup] = useState({
    open: false,
    stageKey: null,
    anchorEl: null,
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Fetch all form stages
  const fetchFormStages = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/v1/api/formStageset/getAllFormStages`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      if (response.data.status) {
        setStagesData(response.data.items)
        setSnackbar({
          open: true,
          message: "Form stages loaded successfully!",
          severity: "success",
        })
      }
    } catch (error) {
      console.error("Error fetching form stages:", error)
      setSnackbar({
        open: true,
        message: "Failed to load form stages. Please try again.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Toggle field enabled state
  const toggleFieldEnabled = (stageIndex, stageKey, fieldId) => {

    setStagesData((prevStagesData) => {
      const newStagesData = JSON.parse(JSON.stringify(prevStagesData)) // Deep clone
      const stage = newStagesData[stageIndex]

      if (stage && stage.stages) {
        const stageKeyIndex = stage.stages.findIndex((s) => s.stageKey === stageKey)
        if (stageKeyIndex !== -1) {
          const stageKeyData = stage.stages[stageKeyIndex]
          if (stageKeyData && stageKeyData.fields) {
            const fieldIndex = stageKeyData.fields.findIndex((f) => f._id === fieldId)
            if (fieldIndex !== -1) {
              stageKeyData.fields[fieldIndex].enabled = !stageKeyData.fields[fieldIndex].enabled
            }
          }
        }
      }

      return newStagesData
    })
  }

  // Toggle field required state
  const toggleFieldRequired = (stageIndex, stageKey, fieldId) => {
    setStagesData((prevStagesData) => {
      const newStagesData = JSON.parse(JSON.stringify(prevStagesData)) // Deep clone
      const stage = newStagesData[stageIndex]

      if (stage && stage.stages) {
        const stageKeyIndex = stage.stages.findIndex((s) => s.stageKey === stageKey)
        if (stageKeyIndex !== -1) {
          const stageKeyData = stage.stages[stageKeyIndex]
          if (stageKeyData && stageKeyData.fields) {
            const fieldIndex = stageKeyData.fields.findIndex((f) => f._id === fieldId)
            if (fieldIndex !== -1) {
              stageKeyData.fields[fieldIndex].required = !stageKeyData.fields[fieldIndex].required
            }
          }
        }
      }

      return newStagesData
    })
  }

  // Bulk toggle all fields in a stageKey
  const bulkToggleStageKeyFields = (stageIndex, stageKey, enabled) => {
    setStagesData((prevStagesData) => {
      const newStagesData = JSON.parse(JSON.stringify(prevStagesData)) // Deep clone
      const stage = newStagesData[stageIndex]

      if (stage && stage.stages) {
        const stageKeyIndex = stage.stages.findIndex((s) => s.stageKey === stageKey)
        if (stageKeyIndex !== -1) {
          const stageKeyData = stage.stages[stageKeyIndex]
          if (stageKeyData && stageKeyData.fields) {
            stageKeyData.fields = stageKeyData.fields.map((field) => ({
              ...field,
              enabled: enabled,
            }))
          }
        }
      }

      return newStagesData
    })
  }

  // Save configuration for a specific stageKey
  const saveStageKeyConfiguration = async (stageIndex, stageKey) => {
    setSaving(true)
    try {
      const stage = stagesData[stageIndex]
      const stageKeyData = stage.stages.find((s) => s.stageKey === stageKey)

      if (stageKeyData) {
        const payload = {
          fields: stageKeyData.fields.map((field) => ({
            fieldPath: field.fieldPath,
            enabled: field.enabled,
            required: field.required,
          })),
          stageName: stage.stageName,
          isActive: stageKeyData.isActive, // Ensure isActive is included
        }

// Debug log

        await axios.post(`${baseUrl}/v1/api/formStageset/toggleFieldAttributes?stageKey=${stageKey}`, payload, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })

        setSnackbar({
          open: true,
          message: `${stageKey} configuration saved successfully!`,
          severity: "success",
        })

        // Refresh data
        await fetchFormStages()
      }
    } catch (error) {
      console.error("Error updating configuration:", error)
      setSnackbar({
        open: true,
        message: "Failed to save configuration. Please try again.",
        severity: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  // Updated toggle stage key active function
  const toggleStageKeyActive = async (stageIndex, stageKey) => {
    // Get current state before toggling
    const currentStageKeyData = getStageKeyData(stageIndex, stageKey)
    const newActiveState = !currentStageKeyData.isActive

    setStagesData((prevStagesData) => {
      const newStagesData = JSON.parse(JSON.stringify(prevStagesData)) // Deep clone
      const stage = newStagesData[stageIndex]

      if (stage && stage.stages) {
        const stageKeyIndex = stage.stages.findIndex((s) => s.stageKey === stageKey)
        if (stageKeyIndex !== -1) {
          const stageKeyData = stage.stages[stageKeyIndex]
          if (stageKeyData) {
            stageKeyData.isActive = newActiveState

            // If deactivating, disable all fields
            if (!newActiveState && stageKeyData.fields) {
              stageKeyData.fields = stageKeyData.fields.map((field) => ({
                ...field,
                enabled: false,
              }))
            }

// Debug log
          }
        }
      }

      return newStagesData
    })

    // Save the activation status immediately to API with correct state
    try {
      const stage = stagesData[stageIndex]
      const stageKeyData = stage.stages.find((s) => s.stageKey === stageKey)

      if (stageKeyData) {
        const payload = {
          fields: stageKeyData.fields.map((field) => ({
            fieldPath: field.fieldPath,
            enabled: newActiveState ? field.enabled : false, // Disable all fields if deactivating
            required: field.required,
          })),
          stageName: stage.stageName,
          isActive: newActiveState, // Use the NEW state, not the old one
        }

// Debug log

        await axios.post(`${baseUrl}/v1/api/formStageset/toggleFieldAttributes?stageKey=${stageKey}`, payload, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })

        setSnackbar({
          open: true,
          message: `Stage key ${stageKey} ${newActiveState ? "activated" : "deactivated"} successfully!`, // Use correct state for message
          severity: "success",
        })
      }
    } catch (error) {
      console.error("Error saving stage key activation:", error)
      setSnackbar({
        open: true,
        message: "Failed to save stage key activation. Please try again.",
        severity: "error",
      })
    }
  }

  // Helper function to get stage key data
  const getStageKeyData = (stageIndex, stageKey) => {
    const stage = stagesData[stageIndex]
    if (!stage) return null
    return stage.stages.find((s) => s.stageKey === stageKey)
  }

  // Get all unique stage keys across all stages
  const getAllStageKeys = () => {
    const allStageKeys = new Map()

    stagesData.forEach((stage, stageIndex) => {
      stage.stages.forEach((stageKeyData) => {
        const key = stageKeyData.stageKey
        if (!allStageKeys.has(key)) {
          allStageKeys.set(key, {
            stageKey: key,
            instances: [],
          })
        }
        allStageKeys.get(key).instances.push({
          stageIndex,
          stageName: stage.stageName,
          isActive: stageKeyData.isActive,
          fields: stageKeyData.fields,
        })
      })
    })

    return Array.from(allStageKeys.values())
  }

  // Handle stage key activation from All tab
  const handleStageKeyActivationFromAll = (stageKey, targetStageIndex) => {
    // Check if the stage key is already active in any stage
    const stageKeyGroup = getAllStageKeys().find((group) => group.stageKey === stageKey)
    const isActiveInAnyStage = stageKeyGroup?.instances.some((instance) => instance.isActive)

    if (isActiveInAnyStage) {
      setSnackbar({
        open: true,
        message: `${stageKey} is already active in another stage and cannot be activated again.`,
        severity: "error",
      })
      setStageSelectionPopup({ open: false, stageKey: null, anchorEl: null })
      return
    }

    toggleStageKeyActive(targetStageIndex, stageKey)
    setStageSelectionPopup({ open: false, stageKey: null, anchorEl: null })
  }

  // Open stage selection popup
  const openStageSelectionPopup = (stageKey, event) => {
    setStageSelectionPopup({
      open: true,
      stageKey: stageKey,
      anchorEl: event.currentTarget,
    })
  }

  // Load data on component mount
  useEffect(() => {
    if (token) {
      fetchFormStages()
    }
  }, [token])

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Get statistics for a stageKey in a specific stage
  const getStageKeyStats = (stageIndex, stageKey) => {
    const stage = stagesData[stageIndex]
    if (!stage) return { total: 0, enabled: 0, required: 0 }

    const stageKeyData = stage.stages.find((s) => s.stageKey === stageKey)
    if (!stageKeyData) return { total: 0, enabled: 0, required: 0 }

    const fields = stageKeyData.fields
    return {
      total: fields.length,
      enabled: fields.filter((f) => f.enabled).length,
      required: fields.filter((f) => f.required).length,
    }
  }

  // Get overall statistics for a stage
  const getStageStats = (stageIndex) => {
    const stage = stagesData[stageIndex]
    if (!stage) return { totalFields: 0, enabledFields: 0, totalStageKeys: 0, activeStageKeys: 0 }

    let totalFields = 0
    let enabledFields = 0
    let activeStageKeys = 0

    stage.stages.forEach((stageKeyData) => {
      totalFields += stageKeyData.fields.length
      enabledFields += stageKeyData.fields.filter((f) => f.enabled).length
      if (stageKeyData.isActive) {
        activeStageKeys++
      }
    })

    return {
      totalFields,
      enabledFields,
      totalStageKeys: stage.stages.length,
      activeStageKeys,
    }
  }

  // Toggle section expansion
  const toggleSectionExpansion = (stageKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [stageKey]: !prev[stageKey],
    }))
  }

  // Theme colors
  const themeColors = {
    primary: "#62afdc", // Purple
    primaryLight: "#a78bfa",
    primaryDark: "#5e4191",
    secondary: "#c084fc", // Light purple
    success: "#10b981", // Green
    error: "#ef4444", // Red
    warning: "#f59e0b", // Amber
    info: "#3b82f6", // Blue
    background: "#f8f9ff", // Light purple tinted background
    paper: "#ffffff",
    text: "#1f2937",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    headerGradient: "linear-gradient(135deg, #62afdc 0%, #6d28d9 100%)",
  }

  if (loading) {
    return (
      <Box sx={{ bgcolor: themeColors.background, minHeight: "100vh" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(139, 92, 246, 0.1)",
            }}
          >
            <Box sx={{ p: 6, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "500px" }}>
              <Box sx={{ textAlign: "center" }}>
                <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
                  <CircularProgress size={60} thickness={4} sx={{ color: themeColors.primary }} />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Settings sx={{ fontSize: 24, color: themeColors.primary }} />
                  </Box>
                </Box>
                <Typography variant="h5" color={themeColors.text} fontWeight={600} sx={{ mb: 1 }}>
                  Loading Configuration
                </Typography>
                <Typography variant="body1" color={themeColors.textSecondary}>
                  Please wait while we fetch your form settings
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: themeColors.background, minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Enhanced Header */}
        <Zoom in={true} timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 4,
              background: themeColors.headerGradient,
              color: "white",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Animated Background Elements */}
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
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-20px)" },
                },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, zIndex: 1 }}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <Settings sx={{ fontSize: 32, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight={700} sx={{ color: "white", mb: 0.5 }}>
                      Form Configuration
                    </Typography>
                    <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 400 }}>
                      Configure form sections for each stage
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchFormStages}
                  disabled={loading}
                  sx={{
                    borderColor: "rgba(255,255,255,0.4)",
                    color: "white",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.6)",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            {/* Stage Selection Tabs */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: "white", fontWeight: 600 }}>
                Select Stage to Configure
              </Typography>
              <Tabs
                value={selectedStageIndex === -1 ? -1 : selectedStageIndex}
                onChange={(e, newValue) => {
                  if (newValue === -1) {
                    setSelectedStageIndex(-1)
                    setShowAllTab(true)
                  } else {
                    setSelectedStageIndex(newValue)
                    setShowAllTab(false)
                  }
                }}
                sx={{
                  "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    minHeight: 60,
                    "&.Mui-selected": {
                      color: "white",
                      fontWeight: 700,
                    },
                    "&:hover": {
                      color: "rgba(255,255,255,0.95)",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "white",
                    height: 3,
                    borderRadius: 2,
                  },
                }}
              >
                <Tab
                  value={-1}
                  label={
                    <Box sx={{ textAlign: "left", py: 1 }}>
                      <Typography variant="subtitle1" fontWeight="inherit" sx={{ color: "inherit" }}>
                        All Sections
                      </Typography>
                      <Typography variant="caption" sx={{ color: "inherit", opacity: 0.8 }}>
                        View all stage keys across stages
                      </Typography>
                    </Box>
                  }
                />
                {stagesData.map((stage, index) => {
                  const stats = getStageStats(index)
                  return (
                    <Tab
                      key={index}
                      value={index}
                      label={
                        <Box sx={{ textAlign: "left", py: 1 }}>
                          <Typography variant="subtitle1" fontWeight="inherit" sx={{ color: "inherit" }}>
                            {stage.stageName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "inherit", opacity: 0.8 }}>
                            {stats.activeStageKeys}/{stats.totalStageKeys} sections active
                          </Typography>
                        </Box>
                      }
                    />
                  )
                })}
              </Tabs>
            </Box>
          </Paper>
        </Zoom>

        {/* Instructions Panel */}
        <Fade in={true} timeout={1000}>
          <Alert
            severity="info"
            sx={{
              mb: 4,
              borderRadius: 3,
              border: `1px solid ${themeColors.primary}`,
              bgcolor: "#f5f3ff",
              color: themeColors.primaryDark,
              "& .MuiAlert-icon": {
                color: themeColors.primary,
              },
            }}
            icon={<AutoAwesome />}
          >
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: themeColors.primaryDark }}>
              Configuration Guide
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: themeColors.primaryDark }}>
              • Select a stage from the tabs above • Use the power button to activate/deactivate sections • Toggle
              individual fields with switches • Use bulk operations for efficiency • Save changes to persist
              configuration
            </Typography>
          </Alert>
        </Fade>

        {/* Current Stage Configuration or All View */}
        {showAllTab ? (
          // All Stages View
          <Fade in={true} timeout={1200}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
                border: "1px solid rgba(139, 92, 246, 0.1)",
                bgcolor: "white",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} sx={{ color: themeColors.text, mb: 1 }}>
                    All Form Sections
                  </Typography>
                  <Typography variant="body1" color={themeColors.textSecondary} sx={{ fontSize: "1.1rem" }}>
                    Overview of all stage keys across all stages. Click the power button to activate inactive sections.
                  </Typography>
                </Box>
              </Box>

              {/* All Stage Keys Grid */}
              <Grid container spacing={3}>
                {getAllStageKeys().map((stageKeyGroup) => {
                  const config = FORM_TAB_CONFIG[stageKeyGroup.stageKey] || {
                    icon: <Assignment />,
                    color: themeColors.primary,
                    gradient: themeColors.headerGradient,
                    title: stageKeyGroup.stageKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                    description: "Form section configuration",
                    category: "Other",
                  }

                  // Find if this stage key is active in any stage
                  const activeInstances = stageKeyGroup.instances.filter((instance) => instance.isActive)
                  const hasActiveInstances = activeInstances.length > 0

                  return (
                    <Grid item xs={12} md={6} lg={4} key={stageKeyGroup.stageKey}>
                      <Zoom in={true} timeout={600}>
                        <Card
                          elevation={0}
                          sx={{
                            border: hasActiveInstances ? `2px solid ${themeColors.primary}` : "2px solid #e5e7eb",
                            borderRadius: 4,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            height: "100%",
                            minHeight: "320px",
                            position: "relative",
                            background: hasActiveInstances
                              ? `linear-gradient(135deg, ${themeColors.primary}08 0%, ${themeColors.primary}15 100%)`
                              : "#fafafa",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: `0 12px 24px ${themeColors.primary}20`,
                              borderColor: themeColors.primary,
                            },
                          }}
                        >
                          {/* Status Badge */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 16,
                              right: 16,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Chip
                              icon={hasActiveInstances ? <Visibility /> : <VisibilityOff />}
                              label={hasActiveInstances ? `Active in ${activeInstances[0].stageName}` : "Inactive"}
                              size="small"
                              sx={{
                                bgcolor: hasActiveInstances ? "#f0fdf4" : "#fef2f2",
                                color: hasActiveInstances ? "#166534" : "#dc2626",
                                fontWeight: 600,
                                "& .MuiChip-icon": {
                                  color: hasActiveInstances ? themeColors.success : themeColors.error,
                                },
                              }}
                            />
                            {!hasActiveInstances && (
                              <IconButton
                                onClick={(event) => openStageSelectionPopup(stageKeyGroup.stageKey, event)}
                                sx={{
                                  bgcolor: "#fef2f2",
                                  color: themeColors.error,
                                  width: 36,
                                  height: 36,
                                  "&:hover": {
                                    bgcolor: "#fecaca",
                                  },
                                }}
                              >
                                <PowerSettingsNew fontSize="small" />
                              </IconButton>
                            )}
                          </Box>

                          <CardContent sx={{ p: 3, height: "100%" }}>
                            {/* Section Header */}
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 1 }}>
                              <Box
                                sx={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: 3,
                                  background: config.gradient,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  mr: 2,
                                  boxShadow: `0 8px 24px ${themeColors.primary}30`,
                                }}
                              >
                                {config.icon}
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ color: themeColors.text, mb: 0.5 }}>
                                  {config.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: themeColors.textSecondary, fontWeight: 500 }}
                                >
                                  {stageKeyGroup.stageKey}
                                </Typography>
                              </Box>
                            </Box>

                            <Typography
                              variant="body2"
                              color={themeColors.textSecondary}
                              sx={{ mb: 3, lineHeight: 1.6 }}
                            >
                              {config.description}
                            </Typography>

                            {/* Active Stage Info */}
                            {hasActiveInstances && (
                              <Box sx={{ mb: 3 }}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                  sx={{ mb: 2, color: themeColors.text }}
                                >
                                  Active in Stage:
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                  {activeInstances.map((instance, idx) => {
                                    const stats = getStageKeyStats(instance.stageIndex, stageKeyGroup.stageKey)
                                    return (
                                      <Box
                                        key={idx}
                                        sx={{
                                          p: 2,
                                          borderRadius: 2,
                                          bgcolor: "#f5f3ff",
                                          border: `1px solid ${themeColors.primaryLight}`,
                                        }}
                                      >
                                        <Typography variant="body2" fontWeight={600} sx={{ color: themeColors.text }}>
                                          {instance.stageName}
                                        </Typography>
                                        <Typography variant="caption" color={themeColors.textSecondary}>
                                          {stats.enabled}/{stats.total} fields enabled
                                        </Typography>
                                      </Box>
                                    )
                                  })}
                                </Box>
                              </Box>
                            )}

                            {!hasActiveInstances && (
                              <Box sx={{ textAlign: "center", py: 3 }}>
                                <Typography variant="body2" color={themeColors.textSecondary} sx={{ mb: 2 }}>
                                  This section is not active in any stage
                                </Typography>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={(event) => openStageSelectionPopup(stageKeyGroup.stageKey, event)}
                                  sx={{
                                    borderColor: themeColors.primary,
                                    color: themeColors.primary,
                                    "&:hover": {
                                      borderColor: themeColors.primaryDark,
                                      backgroundColor: `${themeColors.primary}10`,
                                    },
                                  }}
                                >
                                  Activate in Stage
                                </Button>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  )
                })}
              </Grid>
            </Paper>
          </Fade>
        ) : (
          // Regular Stage View (existing code)
          stagesData[selectedStageIndex] && (
            <Fade in={true} timeout={1200}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
                  border: "1px solid rgba(139, 92, 246, 0.1)",
                  bgcolor: "white",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ color: themeColors.text, mb: 1 }}>
                      {stagesData[selectedStageIndex].stageName}
                    </Typography>
                    <Typography variant="body1" color={themeColors.textSecondary} sx={{ fontSize: "1.1rem" }}>
                      Configure which form sections and fields are active in this stage
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    {(() => {
                      const stats = getStageStats(selectedStageIndex)
                      return (
                        <>
                          <Chip
                            icon={<TrendingUp />}
                            label={`${stats.enabledFields}/${stats.totalFields} Fields Active`}
                            sx={{
                              bgcolor: "#f5f3ff",
                              color: themeColors.primaryDark,
                              fontWeight: 600,
                              "& .MuiChip-icon": { color: themeColors.primary },
                            }}
                          />
                          <Chip
                            icon={<ViewModule />}
                            label={`${stats.activeStageKeys}/${stats.totalStageKeys} Sections Active`}
                            sx={{
                              bgcolor: "#f0fdf4",
                              color: "#166534",
                              fontWeight: 600,
                              "& .MuiChip-icon": { color: themeColors.success },
                            }}
                          />
                        </>
                      )
                    })()}
                  </Box>
                </Box>

                {/* Form Sections Grid - existing code continues here */}
                <Grid container spacing={3}>
                  {stagesData[selectedStageIndex].stages
                    .filter((stageKeyData) => stageKeyData.isActive) // Only show active stage keys
                    .map((stageKeyData, index) => {
                      const stats = getStageKeyStats(selectedStageIndex, stageKeyData.stageKey)
                      const config = FORM_TAB_CONFIG[stageKeyData.stageKey] || {
                        icon: <Assignment />,
                        color: themeColors.primary,
                        gradient: themeColors.headerGradient,
                        title: stageKeyData.stageKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                        description: "Form section configuration",
                        category: "Other",
                      }

                      const isStageKeyActive = stageKeyData.isActive
                      const isExpanded = expandedSections[stageKeyData.stageKey]

                      return (
                        <Grid item xs={12} md={6} lg={4} key={stageKeyData.stageKey}>
                          <Zoom in={true} timeout={600 + index * 100}>
                            <Card
                              elevation={0}
                              sx={{
                                border: isStageKeyActive ? `2px solid ${themeColors.primary}` : "2px solid #e5e7eb",
                                borderRadius: 4,
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                height: "100%",
                                minHeight: "420px",
                                position: "relative",
                                background: isStageKeyActive
                                  ? `linear-gradient(135deg, ${themeColors.primary}08 0%, ${themeColors.primary}15 100%)`
                                  : "#fafafa",
                                "&:hover": {
                                  transform: "translateY(-8px)",
                                  boxShadow: `0 20px 40px ${themeColors.primary}20`,
                                  borderColor: themeColors.primary,
                                },
                              }}
                            >
                              {/* Status Badge */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 16,
                                  right: 16,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  icon={isStageKeyActive ? <Visibility /> : <VisibilityOff />}
                                  label={isStageKeyActive ? "Active" : "Inactive"}
                                  size="small"
                                  sx={{
                                    bgcolor: isStageKeyActive ? "#f0fdf4" : "#fef2f2",
                                    color: isStageKeyActive ? "#166534" : "#dc2626",
                                    fontWeight: 600,
                                    "& .MuiChip-icon": {
                                      color: isStageKeyActive ? themeColors.success : themeColors.error,
                                    },
                                  }}
                                />
                                <IconButton
                                  onClick={() => toggleStageKeyActive(selectedStageIndex, stageKeyData.stageKey)}
                                  sx={{
                                    bgcolor: isStageKeyActive ? "#f0fdf4" : "#fef2f2",
                                    color: isStageKeyActive ? themeColors.success : themeColors.error,
                                    width: 36,
                                    height: 36,
                                    "&:hover": {
                                      bgcolor: isStageKeyActive ? "#dcfce7" : "#fecaca",
                                    },
                                  }}
                                >
                                  <PowerSettingsNew fontSize="small" />
                                </IconButton>
                              </Box>

                              <CardContent sx={{ p: 3, height: "100%" }}>
                                {/* Rest of the card content remains the same */}
                                {/* Section Header */}
                                <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 1 }}>
                                  <Box
                                    sx={{
                                      width: 56,
                                      height: 56,
                                      borderRadius: 3,
                                      background: config.gradient,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "white",
                                      mr: 2,
                                      boxShadow: `0 8px 24px ${themeColors.primary}30`,
                                    }}
                                  >
                                    {config.icon}
                                  </Box>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ color: themeColors.text, mb: 0.5 }}>
                                      {config.title}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ color: themeColors.textSecondary, fontWeight: 500 }}
                                    >
                                      {stageKeyData.stageKey}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Typography
                                  variant="body2"
                                  color={themeColors.textSecondary}
                                  sx={{ mb: 3, lineHeight: 1.6 }}
                                >
                                  {config.description}
                                </Typography>

                                {/* Statistics */}
                                <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
                                  <Chip
                                    label={`${stats.enabled}/${stats.total} Enabled`}
                                    size="small"
                                    sx={{
                                      bgcolor: stats.enabled > 0 ? "#f5f3ff" : "#f3f4f6",
                                      color: stats.enabled > 0 ? themeColors.primaryDark : themeColors.textSecondary,
                                      fontWeight: 600,
                                    }}
                                  />
                                  <Chip
                                    label={`${stats.required} Required`}
                                    size="small"
                                    sx={{
                                      bgcolor: "#fef3c7",
                                      color: "#92400e",
                                      fontWeight: 600,
                                    }}
                                  />
                                </Box>

                                {/* Progress Bar */}
                                <Box sx={{ mb: 3 }}>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="caption" color={themeColors.textSecondary} fontWeight={600}>
                                      Configuration Progress
                                    </Typography>
                                    <Typography variant="caption" color={themeColors.textSecondary} fontWeight={600}>
                                      {stats.total > 0 ? Math.round((stats.enabled / stats.total) * 100) : 0}%
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={stats.total > 0 ? (stats.enabled / stats.total) * 100 : 0}
                                    sx={{
                                      height: 8,
                                      borderRadius: 4,
                                      bgcolor: "#f3f4f6",
                                      "& .MuiLinearProgress-bar": {
                                        borderRadius: 4,
                                        background: config.gradient,
                                      },
                                    }}
                                  />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Action Buttons */}
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() =>
                                      bulkToggleStageKeyFields(selectedStageIndex, stageKeyData.stageKey, true)
                                    }
                                    disabled={!isStageKeyActive}
                                    sx={{
                                      fontSize: "0.75rem",
                                      textTransform: "none",
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      borderColor: themeColors.primary,
                                      color: themeColors.primary,
                                      "&:hover": {
                                        borderColor: themeColors.primaryDark,
                                        backgroundColor: `${themeColors.primary}10`,
                                      },
                                    }}
                                  >
                                    Enable All
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() =>
                                      bulkToggleStageKeyFields(selectedStageIndex, stageKeyData.stageKey, false)
                                    }
                                    disabled={!isStageKeyActive}
                                    sx={{
                                      fontSize: "0.75rem",
                                      textTransform: "none",
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      borderColor: themeColors.primary,
                                      color: themeColors.primary,
                                      "&:hover": {
                                        borderColor: themeColors.primaryDark,
                                        backgroundColor: `${themeColors.primary}10`,
                                      },
                                    }}
                                  >
                                    Disable All
                                  </Button>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={saving ? <CircularProgress size={12} color="inherit" /> : <Save />}
                                    onClick={() => saveStageKeyConfiguration(selectedStageIndex, stageKeyData.stageKey)}
                                    disabled={saving}
                                    sx={{
                                      fontSize: "0.75rem",
                                      textTransform: "none",
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      background: config.gradient,
                                      "&:hover": {
                                        background: config.gradient,
                                        filter: "brightness(1.1)",
                                      },
                                    }}
                                  >
                                    Save Changes
                                  </Button>
                                </Box>

                                {/* Fields List */}
                                <Accordion
                                  expanded={isExpanded}
                                  onChange={() => toggleSectionExpansion(stageKeyData.stageKey)}
                                  elevation={0}
                                  sx={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 2,
                                    "&:before": { display: "none" },
                                  }}
                                  disabled={!isStageKeyActive}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    sx={{
                                      bgcolor: "#f9fafb",
                                      borderRadius: "8px 8px 0 0",
                                      minHeight: 48,
                                    }}
                                  >
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: themeColors.text }}>
                                      Field Details ({stageKeyData.fields.length} fields)
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails sx={{ p: 2, bgcolor: "white" }}>
                                    <Box sx={{ maxHeight: 280, overflowY: "auto" }}>
                                      {stageKeyData.fields.map((field) => (
                                        <Box
                                          key={field._id}
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            py: 2,
                                            px: 3,
                                            borderRadius: 3,
                                            mb: 1,
                                            bgcolor: field.enabled ? "#f5f3ff" : "#fef2f2",
                                            border: field.enabled
                                              ? `1px solid ${themeColors.primaryLight}`
                                              : "1px solid #fecaca",
                                            transition: "all 0.2s ease",
                                          }}
                                        >
                                          <Box sx={{ flexGrow: 1 }}>
                                            <Typography
                                              variant="body2"
                                              fontWeight={600}
                                              sx={{ color: themeColors.text }}
                                            >
                                              {field.label}
                                            </Typography>
                                          </Box>
                                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                            {field.required && (
                                              <Chip
                                                label="Required"
                                                size="small"
                                                sx={{
                                                  bgcolor: "#fef3c7",
                                                  color: "#92400e",
                                                  fontSize: "0.7rem",
                                                  fontWeight: 600,
                                                }}
                                              />
                                            )}
                                            <Switch
                                              checked={field.enabled}
                                              onChange={() =>
                                                toggleFieldEnabled(selectedStageIndex, stageKeyData.stageKey, field._id)
                                              }
                                              size="small"
                                              disabled={!isStageKeyActive}
                                              sx={{
                                                "& .MuiSwitch-switchBase.Mui-checked": {
                                                  color: themeColors.primary,
                                                },
                                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                  backgroundColor: themeColors.primary,
                                                },
                                              }}
                                            />
                                          </Box>
                                        </Box>
                                      ))}
                                    </Box>
                                  </AccordionDetails>
                                </Accordion>
                              </CardContent>
                            </Card>
                          </Zoom>
                        </Grid>
                      )
                    })}
                </Grid>
              </Paper>
            </Fade>
          )
        )}

        {/* Stage Selection Popup */}
        <Dialog
          open={stageSelectionPopup.open}
          onClose={() => setStageSelectionPopup({ open: false, stageKey: null, anchorEl: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: themeColors.text }}>
              Activate Section: {stageSelectionPopup.stageKey}
            </Typography>
            <Typography variant="body2" color={themeColors.textSecondary} sx={{ mt: 1 }}>
              Select which stage this section should be activated in
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 2 }}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Stage</InputLabel>
              <Select
                label="Select Stage"
                defaultValue=""
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                {stagesData.map((stage, index) => (
                  <MenuItem
                    key={index}
                    value={index}
                    onClick={() => handleStageKeyActivationFromAll(stageSelectionPopup.stageKey, index)}
                    sx={{
                      py: 2,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        bgcolor: `${themeColors.primary}10`,
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ color: themeColors.text }}>
                        {stage.stageName}
                      </Typography>
                      <Typography variant="caption" color={themeColors.textSecondary}>
                        {stage.stages.filter((s) => s.isActive).length} sections active
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setStageSelectionPopup({ open: false, stageKey: null, anchorEl: null })}
              sx={{
                color: themeColors.textSecondary,
                "&:hover": {
                  bgcolor: "#f3f4f6",
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          TransitionComponent={Slide}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              width: "100%",
              fontWeight: 600,
              ...(snackbar.severity === "success" && {
                bgcolor: "#f0fdf4",
                color: "#166534",
                "& .MuiAlert-icon": { color: themeColors.success },
              }),
              ...(snackbar.severity === "error" && {
                bgcolor: "#fef2f2",
                color: "#dc2626",
                "& .MuiAlert-icon": { color: themeColors.error },
              }),
              ...(snackbar.severity === "info" && {
                bgcolor: "#f5f3ff",
                color: themeColors.primaryDark,
                "& .MuiAlert-icon": { color: themeColors.primary },
              }),
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}

export default CandidateProfileSetup
