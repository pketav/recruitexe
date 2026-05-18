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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Grid,
  FormHelperText,
  Divider,
  Snackbar,
  Alert,
  Tab,
  Tabs,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  HourglassFull,
  Close,
  Inventory,
  Computer,
  PhoneAndroid,
  Tablet,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  DevicesOther,
} from "@mui/icons-material"
// import AssetsRequestForm from "../../assetsRequestForm"
// Asset icon mapping
const getAssetIcon = (assetType) => {
  switch (assetType) {
    case "Laptop":
    case "Desktop":
      return <Computer />
    case "Mobile":
      return <PhoneAndroid />
    case "Tablet":
      return <Tablet />
    case "Monitor":
      return <Monitor />
    case "Keyboard":
      return <Keyboard />
    case "Mouse":
      return <Mouse />
    case "Headset":
      return <Headphones />
    default:
      return <DevicesOther />
  }
}

const AssetsAndExpense = () => {
  const router = useRouter()
  const [assetRequests, setAssetRequests] = useState([])
  const [approvedAssets, setApprovedAssets] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [approvalData, setApprovalData] = useState({
    vendor: "",
    quantity: 1,
    remarks: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [tabValue, setTabValue] = useState(0)

  // Mock data for initial load
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        employeeName: "John Doe",
        employeeId: "EMP001",
        assetType: "Laptop",
        assetModel: "MacBook Pro",
        reason: "My current laptop is slow and outdated",
        requestDate: "2023-05-15",
        status: "Pending",
      },
      {
        id: 2,
        employeeName: "Jane Smith",
        employeeId: "EMP002",
        assetType: "Mobile",
        assetModel: "iPhone 13",
        reason: "Need a mobile device for testing our mobile app",
        requestDate: "2023-05-16",
        status: "Pending",
      },
      {
        id: 3,
        employeeName: "Mike Johnson",
        employeeId: "EMP003",
        assetType: "Monitor",
        assetModel: "Dell 27-inch 4K",
        reason: "Need a larger monitor for design work",
        requestDate: "2023-05-14",
        status: "Approved",
      },
      {
        id: 4,
        employeeName: "Sarah Williams",
        employeeId: "EMP004",
        assetType: "Headset",
        assetModel: "Jabra Evolve 75",
        reason: "For better audio quality during client calls",
        requestDate: "2023-05-17",
        status: "Rejected",
      },
      {
        id: 5,
        employeeName: "David Brown",
        employeeId: "EMP005",
        assetType: "Tablet",
        assetModel: "iPad Pro",
        reason: "Need for presentations and client demos",
        requestDate: "2023-05-18",
        status: "Pending",
      },
    ]

    const mockApproved = [
      {
        id: 101,
        employeeName: "Mike Johnson",
        employeeId: "EMP003",
        assetType: "Monitor",
        assetModel: "Dell 27-inch 4K",
        vendor: "TechSupplies Inc.",
        quantity: 1,
        purchaseDate: "2023-05-20",
        status: "Delivered",
      },
      {
        id: 102,
        employeeName: "Alex Turner",
        employeeId: "EMP008",
        assetType: "Laptop",
        assetModel: "Dell XPS 15",
        vendor: "CompTech Solutions",
        quantity: 1,
        purchaseDate: "2023-05-19",
        status: "Ordered",
      },
    ]

    setAssetRequests(mockRequests)
    setApprovedAssets(mockApproved)
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleOpenDialog = (request) => {
    setSelectedRequest(request)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedRequest(null)
  }

  const handleOpenApprovalDialog = (request) => {
    setSelectedRequest(request)
    setApprovalData({
      vendor: "",
      quantity: 1,
      remarks: "",
    })
    setErrors({})
    setOpenApprovalDialog(true)
  }

  const handleCloseApprovalDialog = () => {
    setOpenApprovalDialog(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setApprovalData({
      ...approvalData,
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

  const validateApprovalForm = () => {
    const newErrors = {}

    if (!approvalData.vendor) {
      newErrors.vendor = "Vendor is required"
    }

    if (!approvalData.quantity || approvalData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleApprove = () => {
    if (!validateApprovalForm()) return

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update the request status
      const updatedRequests = assetRequests.map((req) => {
        if (req.id === selectedRequest.id) {
          return {
            ...req,
            status: "Approved",
          }
        }
        return req
      })

      // Add to approved assets
      const newApprovedAsset = {
        id: Date.now(),
        employeeName: selectedRequest.employeeName,
        employeeId: selectedRequest.employeeId,
        assetType: selectedRequest.assetType,
        assetModel: selectedRequest.assetModel,
        vendor: approvalData.vendor,
        quantity: approvalData.quantity,
        purchaseDate: new Date().toISOString().split("T")[0],
        status: "Ordered",
      }

      setAssetRequests(updatedRequests)
      setApprovedAssets([...approvedAssets, newApprovedAsset])

      setLoading(false)
      handleCloseApprovalDialog()

      // Show success message
      setSnackbar({
        open: true,
        message: "Asset request approved successfully!",
        severity: "success",
      })
    }, 1000)
  }

  const handleReject = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update the request status
      const updatedRequests = assetRequests.map((req) => {
        if (req.id === selectedRequest.id) {
          return {
            ...req,
            status: "Rejected",
          }
        }
        return req
      })

      setAssetRequests(updatedRequests)
      setLoading(false)
      handleCloseDialog()

      // Show success message
      setSnackbar({
        open: true,
        message: "Asset request rejected",
        severity: "info",
      })
    }, 1000)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  // Render status chip with appropriate color and icon
  const renderStatusChip = (status) => {
    switch (status) {
      case "Approved":
      case "Delivered":
        return (
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label={status}
            color="success"
            size="small"
            sx={{ minWidth: 90 }}
          />
        )
      case "Rejected":
        return (
          <Chip icon={<Cancel fontSize="small" />} label={status} color="error" size="small" sx={{ minWidth: 90 }} />
        )
      case "Ordered":
        return (
          <Chip icon={<Inventory fontSize="small" />} label={status} color="info" size="small" sx={{ minWidth: 90 }} />
        )
      case "Pending":
      default:
        return (
          <Chip
            icon={<HourglassFull fontSize="small" />}
            label={status}
            color="warning"
            size="small"
            variant="outlined"
            sx={{ minWidth: 90 }}
          />
        )
    }
  }

  // Define columns for the requests data grid
  const requestColumns = [
    {
      field: "assetType",
      headerName: "Asset Type",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 1, color: "#7c4dff" }}>{getAssetIcon(params.value)}</Box>
          {params.value}
        </Box>
      ),
    },
    { field: "assetModel", headerName: "Model", flex: 1 },
    { field: "employeeName", headerName: "Employee", flex: 1 },
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { field: "requestDate", headerName: "Request Date", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => renderStatusChip(params.value),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        // Only show approve button for pending requests
        if (params.row.status === "Pending") {
          return (
            <Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleOpenApprovalDialog(params.row)}
                sx={{
                  bgcolor: "#7c4dff",
                  "&:hover": { bgcolor: "#6a1ee8" },
                  textTransform: "none",
                  borderRadius: "8px",
                  mr: 1,
                }}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleOpenDialog(params.row)}
                sx={{
                  borderColor: "#f44336",
                  color: "#f44336",
                  "&:hover": { bgcolor: "rgba(244, 67, 54, 0.08)" },
                  textTransform: "none",
                  borderRadius: "8px",
                }}
              >
                Reject
              </Button>
            </Box>
          )
        }
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            sx={{
              color: "#7c4dff",
              borderColor: "#7c4dff",
              "&:hover": { bgcolor: "rgba(124, 77, 255, 0.08)" },
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            View
          </Button>
        )
      },
    },
  ]

  // Define columns for the approved assets data grid
  const approvedColumns = [
    {
      field: "assetType",
      headerName: "Asset Type",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 1, color: "#7c4dff" }}>{getAssetIcon(params.value)}</Box>
          {params.value}
        </Box>
      ),
    },
    { field: "assetModel", headerName: "Model", flex: 1 },
    { field: "employeeName", headerName: "Employee", flex: 1 },
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { field: "vendor", headerName: "Vendor", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 0.5 },
    { field: "purchaseDate", headerName: "Purchase Date", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => renderStatusChip(params.value),
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

      <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: "#333" }}>
              Asset Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Review and manage asset requests and inventory
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Inventory />}
            onClick={() => router.push("/components/assetsRequestForm")}
            sx={{
              bgcolor: "#7c4dff",
              "&:hover": { bgcolor: "#6a1ee8" },
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            New Request
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="asset management tabs">
            <Tab label="Asset Requests" />
            <Tab label="Approved Assets" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={assetRequests}
              columns={requestColumns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
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
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                },
              }}
            />
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={approvedAssets}
              columns={approvedColumns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
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
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* View/Reject Request Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#7c4dff",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h6">Asset Request Details</Typography>
          <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, mt: 1 }}>
          {selectedRequest && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Employee
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedRequest.employeeName} ({selectedRequest.employeeId})
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Request Date
                </Typography>
                <Typography variant="body1">{selectedRequest.requestDate}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Asset Type
                </Typography>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ mr: 1, color: "#7c4dff" }}>{getAssetIcon(selectedRequest.assetType)}</Box>
                  {selectedRequest.assetType}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Asset Model
                </Typography>
                <Typography variant="body1">{selectedRequest.assetModel || "Not specified"}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ mt: 1 }}>{renderStatusChip(selectedRequest.status)}</Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Reason for Request
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, mt: 1, bgcolor: "#f9f9f9", borderRadius: "8px", borderColor: "#e0e0e0" }}
                >
                  <Typography variant="body1">{selectedRequest.reason}</Typography>
                </Paper>
              </Grid>

              {selectedRequest.status === "Approved" && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Approval Details
                    </Typography>
                  </Grid>

                  {/* Show approval details if available */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Vendor
                    </Typography>
                    <Typography variant="body1">
                      {approvedAssets.find((asset) => asset.employeeId === selectedRequest.employeeId)?.vendor ||
                        "Not specified"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Quantity
                    </Typography>
                    <Typography variant="body1">
                      {approvedAssets.find((asset) => asset.employeeId === selectedRequest.employeeId)?.quantity || 1}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} color="inherit" sx={{ textTransform: "none" }}>
            Close
          </Button>
          {selectedRequest && selectedRequest.status === "Pending" && (
            <>
              <Button
                onClick={() => {
                  handleCloseDialog()
                  handleOpenApprovalDialog(selectedRequest)
                }}
                variant="contained"
                color="primary"
                sx={{
                  bgcolor: "#7c4dff",
                  "&:hover": { bgcolor: "#6a1ee8" },
                  textTransform: "none",
                  borderRadius: "8px",
                  mr: 1,
                }}
              >
                Approve
              </Button>
              <Button
                onClick={handleReject}
                variant="contained"
                color="error"
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                }}
                disabled={loading}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Approval Form Dialog */}
      <Dialog
        open={openApprovalDialog}
        onClose={handleCloseApprovalDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#7c4dff",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h6">Approve Asset Request</Typography>
          <IconButton onClick={handleCloseApprovalDialog} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, mt: 1 }}>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Request Details
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box sx={{ mr: 1, color: "#7c4dff" }}>{getAssetIcon(selectedRequest.assetType)}</Box>
                  <Typography>
                    {selectedRequest.assetType} - {selectedRequest.assetModel || "Not specified"}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Requested by {selectedRequest.employeeName} ({selectedRequest.employeeId}) on{" "}
                  {selectedRequest.requestDate}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Approval Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.vendor} required>
                  <InputLabel id="vendor-label">Vendor</InputLabel>
                  <Select
                    labelId="vendor-label"
                    id="vendor"
                    name="vendor"
                    value={approvalData.vendor}
                    onChange={handleInputChange}
                    label="Vendor"
                  >
                    <MenuItem value="">Select Vendor</MenuItem>
                    <MenuItem value="TechSupplies Inc.">TechSupplies Inc.</MenuItem>
                    <MenuItem value="CompTech Solutions">CompTech Solutions</MenuItem>
                    <MenuItem value="Office Depot">Office Depot</MenuItem>
                    <MenuItem value="Amazon Business">Amazon Business</MenuItem>
                    <MenuItem value="Best Buy Business">Best Buy Business</MenuItem>
                  </Select>
                  {errors.vendor && <FormHelperText>{errors.vendor}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={approvalData.quantity}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 1 } }}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  multiline
                  rows={3}
                  value={approvalData.remarks}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes or instructions"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseApprovalDialog} color="inherit" sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              bgcolor: "#7c4dff",
              "&:hover": { bgcolor: "#6a1ee8" },
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            {loading ? "Processing..." : "Approve Request"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AssetsAndExpense
