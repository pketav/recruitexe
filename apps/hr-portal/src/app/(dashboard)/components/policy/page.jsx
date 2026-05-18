'use client';

import { useEffect, useState, useRef } from 'react';
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
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Upload, Info as InfoIcon, ArrowBack } from '@mui/icons-material';
import axios from 'axios';

const page = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    admin: [],
    allowUncategorized: false,
    tripSubmission: false,
  });
  const [surchargeEnabled, setSurchargeEnabled] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const nameInputRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = window.localStorage.getItem('authToken');
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    if (openDialog && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [openDialog]);
  const getAllpolicy = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/v1/api/policy/all`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      if (res.data.status) {
        const allpolicy = res.data.items.map(item => ({
          id: item._id,
          name: item.name || '',
          description: item.description || '',
          admin: item.policyAdmins.map((item) => item.employeName) || '',
          allowUncategorized: item.allowUncategorizedExpenses || false,
          isActive: item.status || false,
        }));
        setPolicies(allpolicy);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      setSnackbar({ open: true, message: 'Failed to fetch policies', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getAllemployee = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/policy/employee`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      if (res.data.status) {
        setEmployee(res.data.items);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setSnackbar({ open: true, message: 'Failed to fetch employees', severity: 'error' });
    }
  };

  useEffect(() => {
    getAllpolicy();
  }, []);

  const handleOpenDialog = () => {
    setIsEditMode(false);
    setFormData({
      name: '',
      description: '',
      admin: [],
      allowUncategorized: false,
      tripSubmission: false,
    });
    setOpenDialog(true);
    getAllemployee();
  };

  const handleOpenEditDialog = (id) => {
    const policy = policies.find((p) => p.id === id);
    if (policy) {
      setIsEditMode(true);
      setSelectedPolicyId(id);
      setFormData({
        name: policy.name || '',
        description: policy.description || '',
        admin: policy.admin ? [policy.admin] : [],
        allowUncategorized: policy.allowUncategorized || false,
        tripSubmission: policy.tripSubmission || false,
      });
      setOpenDialog(true);
      getAllemployee();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      description: '',
      admin: [],
      allowUncategorized: false,
      tripSubmission: false,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === 'admin') {
      setFormData({
        ...formData,
        admin: [value],
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSavePolicy = async () => {
    if (!formData.name || !formData.admin.length) {
      setSnackbar({ open: true, message: 'Name and Admin are required', severity: 'error' });
      return;
    }

    const newPolicy = {
      name: formData.name,
      description: formData.description,
      policyAdmins: formData.admin,
      allowUncategorizedExpenses: formData.allowUncategorized,
      tripSubmissionWindow: formData.tripSubmission,
      submissionDaysBeforeTravel: 6,
      surchargeOnForeignExpenses: surchargeEnabled,
      surchargePercentage: 12,
      isActive: true,
    };

    try {
      const response = await axios.post(`${baseUrl}/v1/api/policy/add`, newPolicy, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });

      const addedPolicy = {
        ...newPolicy,
        id: response.data._id || policies.length + 1,
        admin: employee.find(emp => emp._id === formData.admin[0])?.employeName || '',
      };

      setPolicies([...policies, addedPolicy]);
      setFormData({
        name: '',
        description: '',
        admin: [],
        allowUncategorized: false,
        tripSubmission: false,
      });
      setOpenDialog(false);
      setSnackbar({ open: true, message: 'Policy added successfully', severity: 'success' });
    } catch (error) {
      console.error('Failed to save policy:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to add policy',
        severity: 'error',
      });
    }
  };


  const handleUpdatePolicy = async (id) => {
    // Validate required fields
    if (!formData.name || !formData.admin.length) {
      setSnackbar({ open: true, message: 'Name and Admin are required', severity: 'error' });
      return;
    }

    // Validate authentication token
    if (!token) {
      setSnackbar({ open: true, message: 'Authentication token missing', severity: 'error' });
      return;
    }

    // Prepare the payload matching the API structure
    const updatedPolicy = {
      policyId: id,
      name: formData.name,
      description: formData.description,
      policyAdmins: formData.admin, // Array of admin IDs (e.g., ["67f91dbcdfdfd479bcb46a10"])
      allowUncategorizedExpenses: formData.allowUncategorized,
      tripSubmissionWindow: formData.tripSubmission,
      submissionDaysBeforeTravel: 6, // Hardcoded as per API response
      surchargeOnForeignExpenses: surchargeEnabled,
      surchargePercentage: 12, // Hardcoded as per API response
      status: formData.isActive ? 'active' : 'inactive', // Align with API's string status
    };

    try {
      setLoading(true);
      // Use PUT for update (change to POST if your API requires it)
      const response = await axios.post(`${baseUrl}/v1/api/policy/update`, updatedPolicy, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });

      // Assuming response.data.item contains the updated policy
      const updatedPolicyFromServer = response.data.item || response.data; // Adjust based on actual response structure
      const updatedPolicies = policies.map((policy) =>
        policy.id === id
          ? {
            id: updatedPolicyFromServer._id || id,
            name: updatedPolicyFromServer.name || formData.name,
            description: updatedPolicyFromServer.description || formData.description,
            admin: updatedPolicyFromServer.policyAdmins?.[0]?.employeName ||
              employee.find(emp => emp._id === formData.admin[0])?.employeName || '',
            allowUncategorized: updatedPolicyFromServer.allowUncategorizedExpenses || formData.allowUncategorized,
            isActive: updatedPolicyFromServer.status === 'active',
          }
          : policy
      );

      // Update local state
      setPolicies(updatedPolicies);
      setFormData({
        name: '',
        description: '',
        admin: [],
        allowUncategorized: false,
        tripSubmission: false,
      });
      setOpenDialog(false);
      setSnackbar({ open: true, message: 'Policy updated successfully', severity: 'success' });
    } catch (error) {
      console.error('Failed to update policy:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to update policy',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    if (isEditMode) {
      await handleUpdatePolicy(selectedPolicyId);
    } else {
      await handleSavePolicy();
    }
  };

  const handleToggleActive = (id, currentStatus) => {
    const updatedPolicies = policies.map((policy) =>
      policy.id === id ? { ...policy, isActive: !currentStatus } : policy
    );
    setPolicies(updatedPolicies);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'Action',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          sx={{
            fontSize: '12px',
            backgroundColor: '#7c4dff',
            '&:hover': { backgroundColor: '#6a1ee8' },
          }}
          onClick={() => handleOpenEditDialog(params.id)}
        >
          Update
        </Button>
      ),
    },
    { field: 'name', headerName: 'Policy Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'admin', headerName: 'Admin', width: 150 },
    {
      field: 'allowUncategorized',
      headerName: 'Uncategorized Expenses',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          color={params.row.isActive ? 'success' : 'error'}
          sx={{
            fontSize: '11px',
            textTransform: 'none',
            minWidth: '70px',
          }}
          onClick={() => handleToggleActive(params.row.id, params.row.isActive)}
        >
          {params.row.isActive ? 'Active' : 'Inactive'}
        </Button>
      ),
      valueGetter: (params) => (params?.row?.isActive ? 'Active' : 'Inactive'),
    },
  ];

  return (
    <Box>
      <Box inert={openDialog}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{
            mb: 2,
            color: '#7c4dff',
            '&:hover': { backgroundColor: 'transparent', color: '#6a1ee8' },
          }}
        >
          Back
        </Button>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
              Policies Settings
            </Typography>
            {/* <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
              Manage your policies here. You can create, edit, and delete policies.
            </Typography> */}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenDialog}
              sx={{
                backgroundColor: '#7c4dff',
                '&:hover': { backgroundColor: '#6a1ee8' },
                borderRadius: '50px',
              }}
            >
              Add New
            </Button>
          </Box>

          <Box sx={{ height: 500, width: '100%' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={policies}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25, 100]}
                checkboxSelection
                disableSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0',
                  },
                  '& .MuiDataGrid-cell': {
                    padding: '8px',
                    borderBottom: '1px solid #f0f0f0',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f9f9f9',
                  },
                  '& .MuiCheckbox-root': {
                    color: '#999',
                  },
                  '& .MuiDataGrid-columnSeparator': {
                    display: 'none',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: 'none',
                  },
                }}
              />
            )}
          </Box>
        </Paper>
      </Box>

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
              inputRef={nameInputRef}
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
                multiple={false}
              >
                {employee.map((item, key) => (
                  <MenuItem key={key} value={item._id}>
                    {item.employeName}
                  </MenuItem>
                ))}
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
                    <InfoIcon fontSize="small" color="action" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
                  </Typography>
                  <FormHelperText>Note: Uncategorized expenses are considered as policy violation</FormHelperText>
                </Box>
              }
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.tripSubmission}
                  onChange={handleInputChange}
                  name="tripSubmission"
                />
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
          <Box sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 1, mb: 4, mt: 2 }}>
            <Button startIcon={<Upload />} variant="outlined">
              Upload Travel Policy
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Surcharge on foreign currency expenses</Typography>
            <Switch checked={surchargeEnabled} onChange={(e) => setSurchargeEnabled(e.target.checked)} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#7c4dff',
              '&:hover': { backgroundColor: '#6a1ee8' },
            }}
            disabled={!formData.name || !formData.admin.length}
          >
            {isEditMode ? 'Update' : 'Save and Continue'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default page;