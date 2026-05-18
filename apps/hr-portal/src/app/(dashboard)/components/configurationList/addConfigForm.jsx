import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  fetchDepartments, 
  fetchExpenseTypes,
  fetchApprovals,
  fetchRemitters,
  fetchEmployees,
  submitConfiguration
} from '../../api/configuration-service';

const AddConfigForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    source: '',
    department: '',
    expenseType: '',
    designation: '',
    submitter: '',
    approval: [],
    remitter: [],
    employee: ''
  });

  const [departments, setDepartments] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [remitters, setRemitters] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState({
    departments: false,
    expenseTypes: false,
    approvals: false,
    remitters: false,
    employees: false,
    submitting: false
  });

  const [submitStatus, setSubmitStatus] = useState({
    type: '', // 'success' | 'error'
    message: ''
  });

  useEffect(() => {
    const loadAllData = async () => {
      setLoading({
        departments: true,
        expenseTypes: true,
        approvals: true,
        remitters: true,
        employees: false,
        submitting: false
      });

      try {
        const [
          departmentsData,
          expenseTypesData,
          approvalsData,
          remittersData,
        ] = await Promise.all([
          fetchDepartments(),
          fetchExpenseTypes(),
          fetchApprovals(),
          fetchRemitters(),
        ]);

        
        setDepartments(departmentsData);
        setExpenseTypes(expenseTypesData);
        setApprovals(approvalsData);
        setRemitters(remittersData);
      } catch (error) {
        console.error('Error loading form data:', error);
        setSubmitStatus({
          type: 'error',
          message: 'Failed to load form data. Please refresh and try again.'
        });
      } finally {
        setLoading({
          departments: false,
          expenseTypes: false,
          approvals: false,
          remitters: false,
          employees: false,
          submitting: false
        });
      }
    };

    loadAllData();
  }, []);

  // Effect to load employees when department changes
  useEffect(() => {
    const loadEmployees = async () => {
      if (formData.department) {
        setLoading(prev => ({ ...prev, employees: true }));
        try {
          const selectedDept = departments.find(dept => dept._id === formData.department);
          if (selectedDept) {
            const employeesData = await fetchEmployees(selectedDept.name);
            setEmployees(employeesData);
          }
        } catch (error) {
          console.error('Error loading employees:', error);
        } finally {
          setLoading(prev => ({ ...prev, employees: false }));
        }
      } else {
        setEmployees([]);
      }
    };

    loadEmployees();
  }, [formData.department, departments]);

  // Effect to filter designations when department changes
  useEffect(() => {
    if (formData.department) {
      const selectedDept = departments.find(dept => dept._id === formData.department);
      if (selectedDept && selectedDept.designations) {
        setDesignations(selectedDept.designations);
      } else {
        setDesignations([]);
      }
      
      // Reset designation when department changes
      setFormData(prev => ({
        ...prev,
        designation: ''
      }));
    } else {
      setDesignations([]);
    }
  }, [formData.department, departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any previous submit status when user makes changes
    if (submitStatus.message) {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(prev => ({ ...prev, submitting: true }));
    setSubmitStatus({ type: '', message: '' });
    
    try {
      
      // Validate required fields
      if (!formData.source) {
        throw new Error('Please select "From Where"');
      }
      
      if (formData.source === 'Department' && !formData.department) {
        throw new Error('Please select a department');
      }
      
      if (!formData.expenseType) {
        throw new Error('Please select an expense type');
      }
      
      if (formData.approval.length === 0) {
        throw new Error('Please select at least one approval level');
      }
      
      if (formData.remitter.length === 0) {
        throw new Error('Please select at least one remitter');
      }
      
      // Submit to API
      const response = await submitConfiguration(formData);
      
      setSubmitStatus({
        type: 'success',
        message: 'Configuration saved successfully!'
      });
      
      // Call parent onSubmit callback
      if (onSubmit) {
        onSubmit(response);
      }
      
      // Close dialog after successful submission
      setTimeout(() => {
        onCancel();
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting configuration:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to save configuration. Please try again.'
      });
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const isDepartmentSelected = formData.source === 'Department';
  const isNonDepartmentSelected = formData.source === 'Non-Department';

  return (
    <Dialog open onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Add Configuration</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          {submitStatus.message && (
            <Alert 
              severity={submitStatus.type} 
              sx={{ mb: 2 }}
              onClose={() => setSubmitStatus({ type: '', message: '' })}
            >
              {submitStatus.message}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="From Where"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={loading.submitting}
                >
                  <MenuItem value="Department">Department</MenuItem>
                  <MenuItem value="Non-Department">Non-Department</MenuItem>
                </TextField>
              </Grid>

              {isDepartmentSelected && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={loading.departments || loading.submitting}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              {(isDepartmentSelected || isNonDepartmentSelected) && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Expense Type"
                      name="expenseType"
                      value={formData.expenseType}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading.expenseTypes || loading.submitting}
                    >
                      {expenseTypes.map((type) => (
                        <MenuItem key={type._id} value={type._id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      fullWidth
                      disabled={(!formData.department && isDepartmentSelected) || loading.submitting}
                      helperText={
                        isDepartmentSelected && !formData.department 
                          ? "Please select a department first" 
                          : ""
                      }
                    >
                      {designations.map((designation) => (
                        <MenuItem key={designation._id} value={designation._id}>
                          {designation.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Submitter"
                      name="submitter"
                      value={formData.submitter}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading.submitting}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  </Grid> */}

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required disabled={loading.approvals || loading.submitting}>
                      <InputLabel>Approval Level</InputLabel>
                      <Select
                        multiple
                        name="approval"
                        value={formData.approval}
                        onChange={handleChange}
                        input={<OutlinedInput label="Approval Level" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((val) => (
                              <Chip key={val} label={val} />
                            ))}
                          </Box>
                        )}
                      >
                        {approvals.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required disabled={loading.remitters || loading.submitting}>
                      <InputLabel>Remitter</InputLabel>
                      <Select
                        multiple
                        name="remitter"
                        value={formData.remitter}
                        onChange={handleChange}
                        input={<OutlinedInput label="Remitter" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((val) => (
                              <Chip key={val} label={val} />
                            ))}
                          </Box>
                        )}
                      >
                        {remitters.map((r) => (
                          <MenuItem key={r} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  sx={{ mr: 1 }}
                  disabled={loading.submitting}
                  startIcon={loading.submitting ? <CircularProgress size={20} /> : null}
                >
                  {loading.submitting ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  onClick={onCancel}
                  disabled={loading.submitting}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddConfigForm;