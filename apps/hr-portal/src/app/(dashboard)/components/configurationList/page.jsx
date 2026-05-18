"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  Switch,
  Grid,
  Avatar,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  FormControl,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import ApartmentIcon from "@mui/icons-material/Apartment"
import AssignmentIcon from "@mui/icons-material/Assignment"
import CategoryIcon from "@mui/icons-material/Category"
import PersonIcon from "@mui/icons-material/Person"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import { useRouter } from "next/navigation"
import configurationService from "../../api/configuration-service"

const ConfigurationList = () => {
  const router = useRouter()
  const [activeConfig, setActiveConfig] = useState(null)
  const [activeConfigId, setActiveConfigId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [showApproverRemitter, setShowApproverRemitter] = useState(false)
  const [approverLevel, setApproverLevel] = useState("")
  const [remitterLevel, setRemitterLevel] = useState("")

  const configurations = [
    {
      key: "Department",
      label: "Department",
      description: "Enable department-based categorization for better organization and reporting",
      icon: <ApartmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
    },
    {
      key: "Non-Department",
      label: "Non Department",
      description: "Allow categorization without department assignment for flexible expense tracking",
      icon: <AssignmentIcon sx={{ fontSize: 40, color: "#ec407a" }} />,
    },
    {
      key: "ExpenseType",
      label: "Expense Type",
      description: "Configure expense types to standardize and categorize different types of expenses",
      icon: <CategoryIcon sx={{ fontSize: 40, color: "#26a69a" }} />,
    },
  ]

  // Fetch current configuration on component mount
  useEffect(() => {
    fetchCurrentConfig()
  }, [])

  const fetchCurrentConfig = async () => {
    try {
      setLoading(true)
      const response = await configurationService.getConfigList()

      if (response && response.items && response.items.length > 0) {
        const currentConfig = response.items[0]
        setActiveConfig(currentConfig.fromWhere)
        setActiveConfigId(currentConfig._id)

        // Set existing approver and remitter levels if they exist
        if (currentConfig.approverLevel) {
          setApproverLevel(currentConfig.approverLevel)
        }
        if (currentConfig.remitterLevel) {
          setRemitterLevel(currentConfig.remitterLevel)
        }

        // Show approver/remitter section if either exists or if config is selected
        if (currentConfig.approverLevel || currentConfig.remitterLevel || currentConfig.fromWhere) {
          setShowApproverRemitter(true)
        }
      }
    } catch (error) {
      showSnackbar("Failed to fetch current configuration", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (key) => {
    if (activeConfig === key) {
      return
    }

    setActiveConfig(key)
    setShowApproverRemitter(true)
    showSnackbar(`${key} configuration selected`, "success")
  }

  const handleApproverChange = (event) => {
    setApproverLevel(event.target.value)
  }

  const handleRemitterChange = (event) => {
    setRemitterLevel(event.target.value)
  }

  const handleSubmit = async () => {
    if (!activeConfig) {
      showSnackbar("Please select a configuration first", "warning")
      return
    }

    if (!approverLevel && !remitterLevel) {
      showSnackbar("Please select at least one approver or remitter level", "warning")
      return
    }

    try {
      setLoading(true)
      const configData = {
        fromWhere: activeConfig,
        approverLevel,
        remitterLevel,
        id: activeConfigId,
      }

      await configurationService.toggleConfiguration(configData)
      showSnackbar(`${activeConfig} configuration submitted successfully`, "success")

      // Refresh the configuration after successful submission
      await fetchCurrentConfig()
    } catch (error) {
      showSnackbar("Failed to submit configuration", "error")
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <Paper elevation={3} sx={{ p: 4, m: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => router.back()} size="large" sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Configuration Settings
        </Typography>
        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </Box>

      <Typography color="text.secondary" mb={3}>
        Manage your system configurations below. Only one configuration can be active at a time.
      </Typography>

      <Grid container spacing={2}>
        {configurations.map((config) => (
          <Grid item xs={12} key={config.key}>
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                opacity: loading ? 0.7 : 1,
                border: activeConfig === config.key ? "2px solid #1976d2" : "1px solid #e0e0e0",
              }}
            >
              <Avatar sx={{ bgcolor: "transparent", mr: 2 }}>{config.icon}</Avatar>
              <Box flexGrow={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {config.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {config.description}
                </Typography>
              </Box>
              <Switch
                checked={activeConfig === config.key}
                onChange={() => handleToggle(config.key)}
                disabled={loading}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Approver and Remitter Section */}
      {showApproverRemitter && activeConfig && (
        <Box mt={3}>
          <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
            Configure {activeConfig}
          </Typography>

          <Grid container spacing={2}>
            {/* Approver Card */}
            <Grid item xs={12}>
              <Card
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  opacity: loading ? 0.7 : 1,
                  border: approverLevel ? "2px solid #1976d2" : "1px solid #e0e0e0",
                }}
              >
                <Avatar sx={{ bgcolor: "transparent", mr: 2 }}>
                  <PersonIcon sx={{ fontSize: 40, color: "#ff9800" }} />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Approver
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select the approver level for this configuration
                  </Typography>
                </Box>
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    value={approverLevel}
                    onChange={handleApproverChange}
                    displayEmpty
                    disabled={loading}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="L1">L1</MenuItem>
                    <MenuItem value="L2">L2</MenuItem>
                    <MenuItem value="L3">L3</MenuItem>
                  </Select>
                </FormControl>
              </Card>
            </Grid>

            {/* Remitter Card */}
            <Grid item xs={12}>
              <Card
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  opacity: loading ? 0.7 : 1,
                  border: remitterLevel ? "2px solid #1976d2" : "1px solid #e0e0e0",
                }}
              >
                <Avatar sx={{ bgcolor: "transparent", mr: 2 }}>
                  <AccountBalanceIcon sx={{ fontSize: 40, color: "#4caf50" }} />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Remitter
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select the remitter level for this configuration
                  </Typography>
                </Box>
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    value={remitterLevel}
                    onChange={handleRemitterChange}
                    displayEmpty
                    disabled={loading}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="R1">R1</MenuItem>
                    <MenuItem value="R2">R2</MenuItem>
                    <MenuItem value="R3">R3</MenuItem>
                  </Select>
                </FormControl>
              </Card>
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || (!approverLevel && !remitterLevel)}
            >
              {loading ? <CircularProgress size={24} /> : "Submit Configuration"}
            </Button>
          </Box>
        </Box>
      )}

      <Box mt={3} p={2} bgcolor="#e3f2fd" borderRadius={2} display="flex" alignItems="center">
        <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          <strong>Configuration Rules:</strong> Only one configuration can be active at a time. Select your preferred
          configuration and choose the appropriate approver and remitter levels, then submit to save your changes.
        </Typography>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  )
}

export default ConfigurationList
