"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Add, Edit, Delete, Close, Facebook, Twitter, ArrowBack } from "@mui/icons-material"

const VendorAndMerchants = () => {
  const router = useRouter()
  const [vendors, setVendors] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    salutation: "",
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    workPhone: "",
    mobile: "",
    currency: "INR- Indian Rupee",
    website: "",
    skype: "",
    facebook: "",
    twitter: "",
  })
  const [errors, setErrors] = useState({})

  // Mock data for initial load
  useEffect(() => {
    const mockVendors = [
      {
        id: 1,
        displayName: "Acme Corporation",
        companyName: "Acme Corporation Ltd.",
        email: "contact@acme.com",
        workPhone: "123-456-7890",
        currency: "INR- Indian Rupee",
      },
      {
        id: 2,
        displayName: "Global Supplies",
        companyName: "Global Supplies Inc.",
        email: "info@globalsupplies.com",
        workPhone: "987-654-3210",
        currency: "INR- Indian Rupee",
      },
    ]
    setVendors(mockVendors)
  }, [])

  const handleOpenDialog = (vendor = null) => {
    if (vendor) {
      setFormData({ ...vendor })
    } else {
      setFormData({
        id: null,
        salutation: "",
        firstName: "",
        lastName: "",
        companyName: "",
        displayName: "",
        email: "",
        workPhone: "",
        mobile: "",
        currency: "INR- Indian Rupee",
        website: "",
        skype: "",
        facebook: "",
        twitter: "",
      })
    }
    setErrors({})
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
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

    if (!formData.displayName) {
      newErrors.displayName = "Contact Display Name is required"
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid"
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (formData.id) {
        // Update existing vendor
        setVendors(vendors.map((vendor) => (vendor.id === formData.id ? formData : vendor)))
      } else {
        // Add new vendor
        const newVendor = {
          ...formData,
          id: Date.now(), // Generate a unique ID
        }
        setVendors([...vendors, newVendor])
      }

      setLoading(false)
      handleCloseDialog()
    }, 500)
  }

  const handleDelete = (id) => {
    // In a real app, you would call an API to delete the vendor
    setVendors(vendors.filter((vendor) => vendor.id !== id))
  }

  const handleGoBack = () => {
    router.back()
  }

  // Define columns for the data grid
  const columns = [
    { field: "displayName", headerName: "Vendor Name", flex: 1 },
    { field: "companyName", headerName: "Company", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "workPhone", headerName: "Phone", flex: 1 },
    { field: "currency", headerName: "Currency", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleOpenDialog(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ]

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
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h1">
            Vendors and Merchants
          </Typography>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Add Vendor
          </Button>
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Manage your vendors and merchants. Add, edit, or remove vendor information.
        </Typography>

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={vendors}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Box>
      </Paper>

      {/* Vendor Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: "#1a237e",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h6">New Vendor</Typography>
          <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, mt: 1 }}>
          <Grid container spacing={2}>
            {/* Primary Contact */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  Primary Contact
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  ℹ️
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="salutation-label">Salutation</InputLabel>
                <Select
                  labelId="salutation-label"
                  id="salutation"
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleInputChange}
                  label="Salutation"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Mr.">Mr.</MenuItem>
                  <MenuItem value="Mrs.">Mrs.</MenuItem>
                  <MenuItem value="Ms.">Ms.</MenuItem>
                  <MenuItem value="Dr.">Dr.</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                size="small"
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                size="small"
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
              />
            </Grid>

            {/* Company Name */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Company Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                id="companyName"
                name="companyName"
                variant="outlined"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Contact Display Name */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Contact Display Name <span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth error={!!errors.displayName}>
                <Select
                  size="small"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Select or enter a display name</em>
                    }
                    return selected
                  }}
                >
                  <MenuItem value="">
                    <em>Select or enter a display name</em>
                  </MenuItem>
                  {formData.companyName && <MenuItem value={formData.companyName}>{formData.companyName}</MenuItem>}
                  {formData.firstName && formData.lastName && (
                    <MenuItem value={`${formData.firstName} ${formData.lastName}`}>
                      {`${formData.firstName} ${formData.lastName}`}
                    </MenuItem>
                  )}
                </Select>
                {errors.displayName && <FormHelperText>{errors.displayName}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Email Address */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                size="small"
                id="email"
                name="email"
                variant="outlined"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Phone
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                id="workPhone"
                name="workPhone"
                variant="outlined"
                value={formData.workPhone}
                onChange={handleInputChange}
                placeholder="Work Phone"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                id="mobile"
                name="mobile"
                variant="outlined"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Mobile"
              />
            </Grid>

            {/* Currency */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Currency <span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth error={!!errors.currency}>
                <Select
                  size="small"
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                >
                  <MenuItem value="INR- Indian Rupee">INR- Indian Rupee</MenuItem>
                  <MenuItem value="USD- US Dollar">USD- US Dollar</MenuItem>
                  <MenuItem value="EUR- Euro">EUR- Euro</MenuItem>
                  <MenuItem value="GBP- British Pound">GBP- British Pound</MenuItem>
                </Select>
                {errors.currency && <FormHelperText>{errors.currency}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Website */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Website
              </Typography>
              <TextField
                fullWidth
                size="small"
                id="website"
                name="website"
                variant="outlined"
                value={formData.website}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Social Media */}
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Skype
              </Typography>
              <TextField
                fullWidth
                size="small"
                id="skype"
                name="skype"
                variant="outlined"
                value={formData.skype}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span style={{ color: "#00aff0", fontSize: "20px" }}>S</span>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Facebook
              </Typography>
              <TextField
                fullWidth
                size="small"
                id="facebook"
                name="facebook"
                variant="outlined"
                value={formData.facebook}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Facebook sx={{ color: "#3b5998" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                http://www.facebook.com/
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Twitter
              </Typography>
              <TextField
                fullWidth
                size="small"
                id="twitter"
                name="twitter"
                variant="outlined"
                value={formData.twitter}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Twitter sx={{ color: "#1da1f2" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                http://www.twitter.com/
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? "Saving..." : formData.id ? "Update Vendor" : "Save Vendor"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default VendorAndMerchants
