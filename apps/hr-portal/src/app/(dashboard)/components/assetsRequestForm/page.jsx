"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material"
import { ArrowBack, Send } from "@mui/icons-material"

const AssetsRequestForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    assetType: "",
    assetModel: "",
    reason: "",
    requestDate: new Date().toISOString().split("T")[0],
  })
  const [errors, setErrors] = useState({})

  const handleGoBack = () => {
    router.back()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const requiredFields = ["employeeName", "employeeId", "assetType", "reason"]

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send the data to your API
      console.log("Submitting asset request:", formData)

      // Show success message
      setSnackbar({
        open: true,
        message: "Asset request submitted successfully!",
        severity: "success",
      })

      // Reset form
      setFormData({
        employeeName: "",
        employeeId: "",
        assetType: "",
        assetModel: "",
        reason: "",
        requestDate: new Date().toISOString().split("T")[0],
      })

      setLoading(false)
    }, 1000)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleGoBack}
        sx={{
          mb: 2,
          color: "#7c4dff",
          "&:hover": { bgcolor: "rgba(124, 77, 255, 0.08)" },
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        Back
      </Button>

      <Paper sx={{ p: 4, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
          Asset Request Form
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Fill out the form below to request a new asset for your work.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee Name"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                error={!!errors.employeeName}
                helperText={errors.employeeName}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                error={!!errors.employeeId}
                helperText={errors.employeeId}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.assetType} required>
                <InputLabel id="asset-type-label">Asset Type</InputLabel>
                <Select
                  labelId="asset-type-label"
                  id="assetType"
                  name="assetType"
                  value={formData.assetType}
                  onChange={handleInputChange}
                  label="Asset Type"
                >
                  <MenuItem value="">Select Asset Type</MenuItem>
                  <MenuItem value="Laptop">Laptop</MenuItem>
                  <MenuItem value="Desktop">Desktop</MenuItem>
                  <MenuItem value="Mobile">Mobile Phone</MenuItem>
                  <MenuItem value="Tablet">Tablet</MenuItem>
                  <MenuItem value="Monitor">Monitor</MenuItem>
                  <MenuItem value="Keyboard">Keyboard</MenuItem>
                  <MenuItem value="Mouse">Mouse</MenuItem>
                  <MenuItem value="Headset">Headset</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.assetType && <FormHelperText>{errors.assetType}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Asset Model"
                name="assetModel"
                value={formData.assetModel}
                onChange={handleInputChange}
                placeholder="e.g., MacBook Pro, Dell XPS, iPhone 13, etc."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Request"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                multiline
                rows={4}
                error={!!errors.reason}
                helperText={errors.reason}
                required
                placeholder="Please explain why you need this asset"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Request Date"
                name="requestDate"
                type="date"
                value={formData.requestDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="button"
                  onClick={handleGoBack}
                  sx={{
                    mr: 2,
                    color: "#7c4dff",
                    "&:hover": { bgcolor: "rgba(124, 77, 255, 0.08)" },
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Send />}
                  disabled={loading}
                  sx={{
                    bgcolor: "#7c4dff",
                    "&:hover": { bgcolor: "#6a1ee8" },
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 4,
                  }}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AssetsRequestForm
