'use client'

import {
  Container,
  Box,
  IconButton,
  Button,
  Typography,
  Modal,
  TextField,
  Grid,
  FormControl,
  FormControlLabel,
  Switch,
  MenuItem
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';

export default function Company() {
  const token = window.localStorage.getItem('authToken');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [companies, setCompanies] = useState([]);
  const [addCompany, setAddCompany] = useState(false);
  const [editId, setEditId] = useState(null);
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    organizationId:'',
    companyName: '',
    companyLogo: '',
    timezone: 'IST',
    status: 'active',
    workWeekStart: 0,
    defaultShiftDuration: 0,
    maxConsecutiveWorkDays: 0,
    minBreakBetweenShifts: 0,
    enableNotifications: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleEdit = (data) => {
    setFormData(data);
    setEditId(data._id);
    setAddCompany(true);
  };

  const getCompany = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/company/get`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      setCompanies(res.data.items);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const [orgs, setOrgs] = useState([])
  const getOrganization = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/org/organization`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      setOrgs(res.data.items);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    getCompany();
    getOrganization()
  }, []);

  const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: token
        }
      });
  
      return res.data.url;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };
  

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.post(`${baseUrl}/v1/api/company/update/${editId}`, formData, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        });
      } else {
        await axios.post(`${baseUrl}/v1/api/company/create`, formData, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        });
      }
      getCompany();
      setAddCompany(false);
      setEditId(null);
      setFormData({
        organizationId:'',
        companyName: '',
        companyLogo: '',
        timezone: 'IST',
        status: 'active',
        workWeekStart: 0,
        defaultShiftDuration: 0,
        maxConsecutiveWorkDays: 0,
        minBreakBetweenShifts: 0,
        enableNotifications: false
      });
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${baseUrl}/v1/api/company/delete/${id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      getCompany();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const columns = [
    {
      field: 'companyName',
      headerName: 'Company Name',
      width: 180
    },
    {
        field: 'companyLogo',
        headerName: 'Company Photo',
        width: 180,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Box sx={{ width: '100%',height:"100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={params.value}
              alt="emp"
              style={{ width: 40, height: 40, borderRadius: '50%' }}
            />
          </Box>
        )
    },      
    {
        field: 'organization',
        headerName: 'Organization',
        width: 180,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <Box sx={{ width: '100%',height:"100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <Typography fontSize={12} color='secondary'>{[params.row.organizationId?.name.toUpperCase() || "-"]}</Typography></Box>
        )
      },
    {
      field: 'timezone',
      headerName: 'Timezone',
      width: 120,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'maxConsecutiveWorkDays',
      headerName: 'Working Days',
      width: 120,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const dateStr = params.row?.createdAt;
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return isNaN(date.getTime())
          ? '-'
          : date.toLocaleString('en-IN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          {/* <IconButton color="primary" onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton> */}
        </Box>
      )
    }
  ];

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontSize={20} fontWeight={600}>Company Setup</Typography>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Button variant="contained" size="small" onClick={() => setAddCompany(true)}>Add Company</Button>
          <Button variant="outlined" size="small" onClick={() => router.push('/employeeSetup')}>Back</Button>
        </Box>
      </Box>

      <Box style={{ height: 650, width: '100%', marginTop: 20 }}>
        <DataGrid
          rows={companies}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id}
          rowsPerPageOptions={[5]}
        />
      </Box>

      <Modal open={addCompany} onClose={() => { setAddCompany(false); setEditId(null); }}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}><Typography fontSize={16} fontWeight={500}>{editId ? 'Edit' : 'Add'} Company</Typography></Grid>
            <Grid item xs={12} sm={6}>
            <TextField
            label="Organization"
            fullWidth
            required
            select
            size="small"
            name="organizationId"
            value={formData.organizationId}
            onChange={handleChange}
        >
            {orgs.map((i) => (
            <MenuItem key={i._id} value={i._id}>{i.name}</MenuItem>
            ))}
        </TextField>
            </Grid>
            <Grid item xs={12} sm={6}><TextField label="Company Name" name="companyName" size="small" fullWidth value={formData.companyName} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Work Week Start" name="workWeekStart" type="number" size="small" fullWidth value={formData.workWeekStart} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Default Shift Duration" name="defaultShiftDuration" type="number" size="small" fullWidth value={formData.defaultShiftDuration} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Max Consecutive Work Days" name="maxConsecutiveWorkDays" type="number" size="small" fullWidth value={formData.maxConsecutiveWorkDays} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Min Break Between Shifts" name="minBreakBetweenShifts" type="number" size="small" fullWidth value={formData.minBreakBetweenShifts} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><FormControlLabel control={<Switch name="enableNotifications" checked={formData.enableNotifications} onChange={handleSwitchChange} />} label="Enable Notifications" /></Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography variant="body2" sx={{ mb: 1 }}>Company Logo</Typography>
                <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                    const url = await uploadLogo(file);
                    if (url) {
                        setFormData((prev) => ({ ...prev, companyLogo: url }));
                    }
                    }
                }}
                />

                <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => fileInputRef.current.click()}>
                  Upload Logo
                </Button>
                {formData.companyLogo && (
                  <img src={formData.companyLogo} alt="Company Logo Preview" style={{ marginTop: '1rem', maxWidth: '100%', maxHeight: 150, borderRadius: 8, border: '1px solid #ddd' }} />
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                    setAddCompany(false);
                    setEditId(null);
                    setFormData({
                        organizationId:'',
                        companyName: '',
                        companyLogo: '',
                        timezone: 'IST',
                        status: 'active',
                        workWeekStart: 0,
                        defaultShiftDuration: 0,
                        maxConsecutiveWorkDays: 0,
                        minBreakBetweenShifts: 0,
                        enableNotifications: false
                    });
                    }}
                >
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
                </Grid>
          </Grid>
        </Box>
      </Modal>
    </Container>
  );
}