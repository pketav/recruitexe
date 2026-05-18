"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  MenuItem,
  Select,
  Stack,
  Divider,
  InputAdornment,
} from "@mui/material"
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import {
  Add,
  AirplanemodeActive,
  DirectionsCar,
  LocalGasStation,
  Computer,
  Work,
  AttachMoney,
  Restaurant,
  ShoppingCart,
  MoreHoriz,
  LocalParking,
  Engineering,
  Call,
  MonetizationOn,
  ArrowBack,
} from "@mui/icons-material"
// import { SkypeFilled, FacebookFilled, TwitterOutlined } from "@ant-design/icons"
import FacebookFilled from '@mui/icons-material/Facebook';
import TwitterOutlined from '@mui/icons-material/Twitter';
// import { SkypeFilled } from 'react-icons/fa';

// import SkypeFilled from '@mui/icons-material/Skype'; 


// Map of icon names to icon components
const iconMap = {
  ShoppingCart: ShoppingCart,
  AirplanemodeActive: AirplanemodeActive,
  AttachMoney: AttachMoney,
  Computer: Computer,
  DirectionsCar: DirectionsCar,
  LocalGasStation: LocalGasStation,
  Work: Work,
  Restaurant: Restaurant,
  MoreHoriz: MoreHoriz,
  LocalParking: LocalParking,
  Engineering: Engineering,
  Call: Call,
  MonetizationOn: MonetizationOn,
}

// Get icon component by name or return default
const getIconByName = (iconName) => {
  return iconMap[iconName] || ShoppingCart
}

// NewVendorForm component
const NewVendorForm = ({ onClose, onSave, editVendor }) => {
  const [formData, setFormData] = useState(
    editVendor || {
      id: Date.now(),
      salutation: "",
      firstName: "",
      lastName: "",
      companyName: "",
      contactDisplayName: "",
      email: "",
      workPhone: "",
      mobilePhone: "",
      currency: "INR - Indian Rupee",
      website: "",
      skype: "",
      facebook: "",
      twitter: "",
    }
  )

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.companyName) {
      alert("Please fill in required fields (First Name and Company Name).")
      return
    }
    onSave(formData)
  }

  return (
    <Box p={4} maxWidth="800px" mx="auto">
      <Typography variant="h6" gutterBottom>
        {editVendor ? "Edit Vendor" : "New Vendor"}
      </Typography>
      <Divider sx={{ borderBottomWidth: "2px", borderColor: "black", borderStyle: "solid" }} />
      <form onSubmit={handleSubmit}>
        <Typography component="p" sx={{ fontWeight: 600, paddingTop: "3px" }}>
          Primary Contact
        </Typography>
        <Stack direction="row" spacing={2} mb={2} pt={1}>
          <Box flex={1}>
            <Select
              fullWidth
              name="salutation"
              value={formData.salutation}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Salutation
              </MenuItem>
              <MenuItem value="Mr.">Mr.</MenuItem>
              <MenuItem value="Ms.">Ms.</MenuItem>
              <MenuItem value="Mrs.">Mrs.</MenuItem>
            </Select>
          </Box>
          <Box flex={1}>
            <TextField
              fullWidth
              placeholder="Enter first name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Box>
          <Box flex={1}>
            <TextField
              fullWidth
              placeholder="Enter last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Box>
        </Stack>
        <Box mb={2}>
          <Typography variant="body2" fontWeight={500} mb={0.5}>
            Company Name
          </Typography>
          <TextField
            fullWidth
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2" fontWeight={500} mb={0.5}>
            Contact Display Name
          </Typography>
          <Select
            fullWidth
            name="contactDisplayName"
            value={formData.contactDisplayName}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Display Name
            </MenuItem>
            <MenuItem value="Company Name">Company Name</MenuItem>
            <MenuItem value="Full Name">Full Name</MenuItem>
          </Select>
        </Box>
        <Box mb={2}>
          <Typography variant="body2" fontWeight={500} mb={0.5}>
            Email Address
          </Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Box>
        <Stack direction="row" spacing={2} mb={2} alignItems="flex-end">
          <Box flex={1}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              Phone
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter work phone"
              name="workPhone"
              value={formData.workPhone}
              onChange={handleChange}
            />
          </Box>
          <Box flex={1}>
            <TextField
              fullWidth
              placeholder="Enter mobile number"
              name="mobilePhone"
              value={formData.mobilePhone}
              onChange={handleChange}
            />
          </Box>
        </Stack>
        <Box mb={2}>
          <Typography variant="body2" fontWeight={500} mb={0.5}>
            Currency
          </Typography>
          <Select
            fullWidth
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="INR - Indian Rupee">INR - Indian Rupee</MenuItem>
            <MenuItem value="USD - US Dollar">USD - US Dollar</MenuItem>
            <MenuItem value="EUR - Euro">EUR - Euro</MenuItem>
          </Select>
        </Box>
        <Box mb={2}>
          <Typography variant="body2" fontWeight={500} mb={0.5}>
            Website
          </Typography>
          <TextField
            fullWidth
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </Box>
        <Stack direction="row" spacing={2} mb={2}>
          <Box flex={1}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              Skype
            </Typography>
            {/* <TextField
              fullWidth
              name="skype"
              value={formData.skype}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SkypeFilled style={{ color: "#00aff0" }} />
                  </InputAdornment>
                ),
              }}
            /> */}
          </Box>
          <Box flex={1}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              Facebook
            </Typography>
            <TextField
              fullWidth
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FacebookFilled style={{ color: "#3b5998" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              Twitter
            </Typography>
            <TextField
              fullWidth
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TwitterOutlined style={{ color: "#1da1f2" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: "#7c4dff", "&:hover": { bgcolor: "#6a1ee8" } }}>
            Save
          </Button>
        </Box>
      </form>
    </Box>
  )
}

const NewVenderFrom = () => {
  const router = useRouter()
  const [vendors, setVendors] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingVendor, setEditingVendor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors()
  }, [])

  // Function to fetch vendors (mocked for now, replace with actual API)
  const fetchVendors = async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call (replace with actual fetchAllVendors API)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const data = [
        {
          id: "1",
          salutation: "Mr.",
          firstName: "John",
          lastName: "Doe",
          companyName: "Doe Enterprises",
          contactDisplayName: "Full Name",
          email: "john@doe.com",
          workPhone: "1234567890",
          mobilePhone: "0987654321",
          currency: "INR - Indian Rupee",
          website: "https://doe.com",
          skype: "john_doe",
          facebook: "doe.enterprises",
          twitter: "@DoeEnt",
        },
        {
          id: "2",
          salutation: "Ms.",
          firstName: "Jane",
          lastName: "Smith",
          companyName: "Smith Solutions",
          contactDisplayName: "Company Name",
          email: "jane@smith.com",
          workPhone: "1112223333",
          mobilePhone: "4445556666",
          currency: "USD - US Dollar",
          website: "https://smith.com",
          skype: "jane_smith",
          facebook: "smith.solutions",
          twitter: "@SmithSol",
        },
      ]

      // Transform API data to match DataGrid format
      const formattedVendors = data.map((vendor) => ({
        id: vendor.id,
        salutation: vendor.salutation,
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        companyName: vendor.companyName,
        contactDisplayName: vendor.contactDisplayName,
        email: vendor.email,
        workPhone: vendor.workPhone,
        mobilePhone: vendor.mobilePhone,
        currency: vendor.currency,
        website: vendor.website,
        skype: vendor.skype,
        facebook: vendor.facebook,
        twitter: vendor.twitter,
      }))

      setVendors(formattedVendors)
    } catch (err) {
      console.error("Error fetching vendors:", err)
      setError("Failed to load vendors. Please try again.")
      showSnackbar("Failed to load vendors. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({
      open: true,
      // message-plant,
      severity,
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  const handleOpenDialog = (vendor = null) => {
    setEditingVendor(vendor)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingVendor(null)
  }

  const handleSaveVendor = (vendorData) => {
    // Simulate saving vendor (replace with actual API call)
    setVendors((prev) => {
      const exists = prev.find((v) => v.id === vendorData.id)
      if (exists) {
        return prev.map((v) => (v.id === vendorData.id ? vendorData : v))
      } else {
        return [...prev, vendorData]
      }
    })
    handleCloseDialog()
    showSnackbar("Vendor saved successfully!", "success")
  }

  const handleDelete = (id) => {
    // Simulate deleting vendor (replace with actual API call)
    setVendors(vendors.filter((vendor) => vendor.id !== id))
    showSnackbar("Vendor deleted successfully!", "success")
  }

  // const handleNavigateToExpenseType = () => {
  //   if (router) {
  //     router.push("/expenseTypeSettings")
  //   }
  // }

  const handleGoBack = () => {
    router.back()
  }

  // Define columns for the data gridex
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "salutation", headerName: "Salutation", width: 100 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "companyName", headerName: "Company Name", width: 200 },
    { field: "contactDisplayName", headerName: "Contact Display Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "workPhone", headerName: "Work Phone", width: 150 },
    { field: "mobilePhone", headerName: "Mobile Phone", width: 150 },
    { field: "currency", headerName: "Currency", width: 150 },
    { field: "website", headerName: "Website", width: 200 },
    { field: "skype", headerName: "Skype", width: 150 },
    { field: "facebook", headerName: "Facebook", width: 150 },
    { field: "twitter", headerName: "Twitter", width: 150 },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            sx={{
              bgcolor: "#7c4dff",
              "&:hover": { bgcolor: "#6a1ee8" },
              textTransform: "none",
              borderRadius: "8px",
              mr: 1,
            }}
          >
            Update
          </Button>
        </Box>
      ),
    },
  ]

  // Custom toolbar with Add Vendor button
  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between", p: 1 }}>
        <Box>
          <GridToolbarFilterButton sx={{ mr: 1 }} />
          <GridToolbarExport />
        </Box>
      </GridToolbarContainer>
    )
  }

  return (
    <Box sx={{ bgcolor: "#f5f5f7", minHeight: "100vh", p: 3 }}>
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
        {/* Header with title and buttons */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: "#333" }}>
              Vendor Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Manage your vendors here. You can create, edit, and delete vendors.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" }, mt: { xs: 2, md: 0 } }}
          >
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                mr: 2,
                bgcolor: "#7c4dff",
                "&:hover": { bgcolor: "#6a1ee8" },
                textTransform: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(124, 77, 255, 0.2)",
              }}
            >
              Add New
            </Button>
            {/* <Button
              variant="outlined"
              startIcon={<MonetizationOn />}
              onClick={handleNavigateToExpenseType}
              sx={{
                mr: 2,
                color: "#7c4dff",
                borderColor: "#7c4dff",
                "&:hover": { borderColor: "#6a1ee8", bgcolor: "rgba(124, 77, 255, 0.08)" },
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              Expense Types
            </Button> */}
            <Button
              variant="outlined"
              onClick={fetchVendors}
              sx={{
                color: "#7c4dff",
                borderColor: "#7c4dff",
                "&:hover": { borderColor: "#6a1ee8", bgcolor: "rgba(124, 77, 255, 0.08)" },
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}

        {/* Data Grid */}
        <Box sx={{ height: 500, width: "100%", mt: 3 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress sx={{ color: "#7c4dff" }} />
            </Box>
          ) : (
            <DataGrid
              rows={vendors}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              checkboxSelection
              disableSelectionOnClick
              components={{
                Toolbar: CustomToolbar,
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f7",
                  borderRadius: "8px 8px 0 0",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f0f0f0",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgba(124, 77, 255, 0.04)",
                },
                "& .MuiCheckbox-root": {
                  color: "#7c4dff",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                },
                "& .MuiTablePagination-root": {
                  color: "#666",
                },
                "& .MuiButtonBase-root.MuiIconButton-root": {
                  color: "#7c4dff",
                },
              }}
            />
          )}
        </Box>

        {/* Vendor Form Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            },
          }}
        >
          <NewVendorForm
            onClose={handleCloseDialog}
            onSave={handleSaveVendor}
            editVendor={editingVendor}
          />
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  )
}

export default NewVenderFrom