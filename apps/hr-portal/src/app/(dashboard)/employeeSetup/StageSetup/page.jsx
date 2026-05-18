'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Grid,Modal
  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function StageSetup() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [stages, setStages] = useState([])
    const [addStage, setAddStage] = useState(false)
    const router = useRouter();
    const [formData, setFormData] = useState({
        organizationId: "",
        stageName: "",
        api_connection: [],
        usedBy: "",
        status: "",
        sequence:0
    })
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);


    const getAllStages = async () => {
        try {
            const res = await axios.get(`${baseUrl}/v1/api/verifyDocs/stage`, {
              headers: {
                'Content-Type': 'application/json',
                authorization: token,
              },
            });
            setStages(res.data.items || []);
          } catch (error) {
            console.error('Error fetching holidays:', error);
          }
    }

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

    const [apis, setapis] = useState([])
    const getApis = async () => {
      try {
        const res = await axios.get(`${baseUrl}/v1/api/verifyDocs/getAllVerificationAPIs`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        });
        setapis(res.data.items);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    
    const [documents, setDocuments] = useState([])
    const getDcouments = async () => {
      try {
        const res = await axios.get(`${baseUrl}/v1/api/verifyDocs/getDocuments`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        });
        setDocuments(res.data.items);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    useEffect(()=>{
       getAllStages()
       getApis()
       getOrganization()
       getDcouments()
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };
    
      const handleApiChange = (e) => {
        const selectedApis = e.target.value; 
        setFormData(prev => ({
          ...prev,
          api_connection: selectedApis
        }));
      };

      const handleDocuments = (e) => {
        const selectedApis = e.target.value; 
        setFormData(prev => ({
          ...prev,
          Document: selectedApis
        }));
      };

    const handleEdit = (row) => {
        setIsEdit(true);
        setEditId(row._id);
        setFormData({
          organizationId: row.organizationId?._id || row.organizationId || '',
          stageName: row.stageName,
          api_connection: row.api_connection?.map(api => api._id),
          usedBy: row.usedBy || '',
          status: row.status || '',
          sequence: row.sequence || 0,
          Document:row.Document?.map(api=>api._id)
        });
        setAddStage(true);
      };

      const handleSubmit = async () => {
        try {
          if (editId) {
            await axios.post(`${baseUrl}/v1/api/verifyDocs/Updatestage/${editId}`, 
            {
                ...formData,
                sequence:Number(formData.sequence)
            } , {
              headers: {
                'Content-Type': 'application/json',
                authorization: token
              }
            });
          } else {
            await axios.post(`${baseUrl}/v1/api/verifyDocs/stage`, {
                ...formData,
                sequence:Number(formData.sequence)
            } , {
              headers: {
                'Content-Type': 'application/json',
                authorization: token
              }
            });
          }
          getAllStages(); 
          setAddStage(false);
          setIsEdit(false);
          setFormData({
            organizationId: '',
            stageName: '',
            api_connection: [],
            usedBy: '',
            status: '',
            sequence: 0
          });
        } catch (error) {
          console.error('Error saving company:', error);
        }
      };
      
    const columns = [
        {
          field: 'stageName',
          headerName: 'Stage Name',
          width:200
        },
        {
            field: 'sequence',
            headerName: 'No. of Stages',
            width: 130,
            align:"center",
            headerAlign:"center"
          },
        {
          field: 'api_connection',
          headerName: 'APIs Used',
          width:280,
          renderCell: (params) =>
            params.value.map((api) => api.apiName).join(', '),
        },
        {
          field: 'Document',
          headerName: 'Documents',
          width: 180,
          renderCell: (params) =>
            params.value.map((api) => api.label).join(', '),
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 150,
            align: 'center',
            headerAlign: 'center',
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
            width: 180,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
            <Box>
                <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                <EditIcon />
                </IconButton>
            </Box>
            )
        }
      ];
      

  return (
    <Container maxWidth="xl">
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography fontSize={20} fontWeight={600}>Verification Stages Setup</Typography>
    <Box sx={{ display: 'flex', gap: 4 }}>
        <Button variant="outlined" size="small" onClick={() => router.push('/employeeSetup')}>Back</Button>
    </Box>
    </Box>
    <Box sx={{ height: 600, width: '100%', mt:4 }}>
      <DataGrid
        rows={stages}
        columns={columns}
        pageSize={5}
        disableRowSelectionOnClick
        getRowId={(row) => row._id}
      />
    </Box>
     <Modal
    open={addStage}
    onClose={() => {
        setAddStage(false);
        setIsEdit(false);
        setFormData({
        organizationId: '',
        stageName: '',
        api_connection: [],
        usedBy: '',
        status: '',
        sequence: 0
        });
    }}
    >
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>    
    <Grid container spacing={5}>
    <Grid item xs={12}>
    <Typography fontSize={16} fontWeight={500}>
      {isEdit ? 'Edit' : 'Add'} Recruitment Stage
    </Typography>
  </Grid>
    <Grid item xs={12} md={6}>
          <TextField
            name="organizationId"
            label="Organization"
            fullWidth
            size='small'
            select
            value={formData.organizationId}
            onChange={handleChange}
            disabled={isEdit}
            required
            >
            {orgs.map((org) => (
                <MenuItem key={org._id} value={org._id}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
          <TextField
            name="stageName"
            label="Stage Name"
            fullWidth
            disabled={isEdit}
            size='small'
            value={formData.stageName}
            onChange={handleChange}
            required
           />
          </Grid>
          <Grid item xs={12}>
            <TextField
                select
                label="Select APIs"
                fullWidth
                size='small'
                SelectProps={{
                multiple: true
                }}
                value={formData.api_connection}
                onChange={handleApiChange}
            >
                {apis.map((api) => (
                <MenuItem key={api._id} value={api._id}>
                    {api.apiName.toUpperCase()}
                </MenuItem>
                ))}
            </TextField>
            </Grid>
            <Grid item xs={12}>
            <TextField
                select
                label="Select Documents"
                fullWidth
                size='small'
                SelectProps={{
                multiple: true
                }}
                value={formData.Document}
                onChange={handleDocuments}
            >
                {documents.map((api) => (
                <MenuItem key={api._id} value={api._id}>
                    {api.label.toUpperCase()}
                </MenuItem>
                ))}
            </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
          <TextField
            name="sequence"
            label="Sequence"
            type="number"
            size='small'
            disabled={isEdit}
            fullWidth
            value={formData.sequence}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            name="usedBy"
            label="Used By"
            fullWidth
            size='small'
            value={formData.usedBy}
            onChange={handleChange}
            required
          >
            {["HR", "Manager"].map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            name="status"
            label="Status"
            fullWidth
            size='small'
            value={formData.status}
            onChange={handleChange}
            required
          >
            {["active", "inactive"].map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                    setAddStage(false);
                    setIsEdit(false);
                    setFormData({
                      organizationId: '',
                      stageName: '',
                      api_connection: [],
                      usedBy: '',
                      status: '',
                      sequence: 0
                    })
                }}>
                Cancel
            </Button>
          <Button onClick={handleSubmit} variant="contained" >
            Submit
          </Button>
        </Grid>
      </Grid>
      </Box>
    </Modal>
    </Container>
  )
}
