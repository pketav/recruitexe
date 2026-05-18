"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Switch,
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
  FormControlLabel,
  Checkbox,
  Divider,
  FormHelperText,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Add, Edit, Delete, Upload, Info as InfoIcon } from "@mui/icons-material"

const PoliciesPage = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: "Business Travel Policy",
      description: "Standard policy for business travel",
      admin: "John Doe",
      allowUncategorized: true,
    },
    {
      id: 2,
      name: "Expense Reimbursement",
      description: "Policy for expense reimbursements",
      admin: "Jane Smith",
      allowUncategorized: false,
    },
  ])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    admin: "",
    allowUncategorized: false,
    tripSubmission: false,
  })
  const [surchargeEnabled, setSurchargeEnabled] = useState(false)

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSavePolicy = () => {
    // Add new policy to the list
    const newPolicy = {
      id: policies.length + 1,
      name: formData.name,
      description: formData.description,
      admin: formData.admin,
      allowUncategorized: formData.allowUncategorized,
    }

    setPolicies([...policies, newPolicy])
    setFormData({
      name: "",
      description: "",
      admin: "",
      allowUncategorized: false,
      tripSubmission: false,
    })
    setOpenDialog(false)
  }

  const columns = [
    { field: "name", headerName: "Policy Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
    { field: "admin", headerName: "Admin", flex: 1 },
    {
      field: "allowUncategorized",
      headerName: "Uncategorized Expenses",
      flex: 1,
      renderCell: (params) => (params.value ? "Allowed" : "Not Allowed"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Button color="primary" size="small" startIcon={<Edit />} onClick={() => {}} sx={{ mr: 1 }}>
            Edit
          </Button>
          <Button color="error" size="small" startIcon={<Delete />} onClick={() => {}}>
            Delete
          </Button>
        </Box>
      ),
    },
  ]

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" component="h2">
          Policies Settings
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenDialog}>
          Add Policy
        </Button>
      </Box>

      <Box sx={{ height: 400, width: "100%", mb: 4 }}>
        <DataGrid
          rows={policies}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection={false}
          disableSelectionOnClick
          autoHeight
        />
      </Box>
      <Divider sx={{ my: 3 }} />

      {/* Policy Settings Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Policy Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Provide basic policy details, upload travel policy, and configure other settings.
          </Typography>

          <Box sx={{ mb: 2 }}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
              placeholder="Max 250 characters"
              inputProps={{ maxLength: 250 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="admin-label">Policy Admins</InputLabel>
              <Select
                labelId="admin-label"
                name="admin"
                value={formData.admin}
                label="Policy Admins"
                onChange={handleInputChange}
                endAdornment={<InfoIcon fontSize="small" color="action" sx={{ mr: 2 }} />}
              >
                <MenuItem value="John Doe">John Doe</MenuItem>
                <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                <MenuItem value="Mike Johnson">Mike Johnson</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.allowUncategorized}
                  onChange={handleInputChange}
                  name="allowUncategorized"
                />
              }
              label={
                <Box>
                  <Typography variant="body1">
                    Allow uncategorized expenses to be part of expense reports
                    <InfoIcon fontSize="small" color="action" sx={{ ml: 0.5, verticalAlign: "middle" }} />
                  </Typography>
                  <FormHelperText>Note: Uncategorized expenses are considered as policy violation</FormHelperText>
                </Box>
              }
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox checked={formData.tripSubmission} onChange={handleInputChange} name="tripSubmission" />
              }
              label={
                <Box>
                  <Typography variant="body1">Trip Submission Window</Typography>
                  <FormHelperText>
                    Set the number of days prior to the travel date to submit a trip. Users will receive a warning if
                    they submit trips after the deadline.
                  </FormHelperText>
                </Box>
              }
            />
          </Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your company's travel policy will be displayed on the dashboard for all your employees to view.
          </Typography>
          <Box sx={{ border: "1px dashed #ccc", p: 2, borderRadius: 1, mb: 4, mt: 2 }}>
            <Button startIcon={<Upload />} variant="outlined">
              Upload Travel Policy
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Surcharge on foreign currency expenses</Typography>
            <Switch checked={surchargeEnabled} onChange={(e) => setSurchargeEnabled(e.target.checked)} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSavePolicy} variant="contained" color="primary" disabled={!formData.name}>
            Save and Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default PoliciesPage
