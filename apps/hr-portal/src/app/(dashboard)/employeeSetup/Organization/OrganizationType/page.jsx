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


export default function OrganizationType() {
  const token = window.localStorage.getItem('authToken');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [addOrg, setAddOrg] = useState(false);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef(null);
  const [name, setName] = useState("")
  const router = useRouter();

  const [orgTypes, setOrgTypes] = useState([])
  const getOrganizationTypes = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/org/organizationType`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      setOrgTypes(res.data.items);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    getOrganizationTypes()
  }, [])


  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.post(`${baseUrl}/v1/api/org/updateOrganization/${editId}`, {
          "name": name,
          "status": "active"
        }, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        });
      } else {
        await axios.post(`${baseUrl}/v1/api/org/organizationType`, {
          "name": name
        }, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        });
      }
      getOrganizationTypes();
      setAddOrg(false);
      setEditId(null);
      setName("")
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${baseUrl}/v1/api/org/deleteOrganization/${id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      getOrganizationTypes();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const handleEdit = (data) => {
    setName(data.name);
    setEditId(data._id);
    setAddOrg(true);
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Organization Type',
      width: 350,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 300,
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
      width: 450,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];


  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontSize={20} fontWeight={600}>Organization Type Setup</Typography>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Button variant="contained" size="small" onClick={() => setAddOrg(true)}>Add Organization Type</Button>
          <Button variant="outlined" size="small" onClick={() => router.push('/employeeSetup/Organization')}>Back</Button>
        </Box>
      </Box>

      <Box style={{ height: 650, width: '100%', marginTop: 20 }}>
        <DataGrid
          rows={orgTypes}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id}
          rowsPerPageOptions={[5]}
        />
      </Box>
      <Modal open={addOrg} onClose={() => { setAddOrg(false); setEditId(null); }}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}><Typography fontSize={16} fontWeight={500}>{editId ? 'Edit' : 'Add'} Organization Type</Typography></Grid>
            <Grid item xs={12}><TextField label="Organization Type" name="name" size="small" fullWidth value={name} onChange={(e) => setName(e.target.value)} /></Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setAddOrg(false);
                  setEditId(null);
                  setName("")
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
  )
}
