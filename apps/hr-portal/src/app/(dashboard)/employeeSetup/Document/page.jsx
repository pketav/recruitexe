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

export default function Document() {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const [documents, setDocuments] = useState([])
        const router = useRouter();
        const [editModal, setEditModal] = useState(false);
        const [editId, setEditId] = useState(null);
        const [formData, setFormData] = useState({
            name:'',
            label:'',
            status:'',
        })
        
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
           getDcouments()
        },[])

        const handleEdit = (row) => {
            setEditId(row._id);
            setFormData({
              name:row.name || '',
              label:row.label || '',
              status: row.status || '',
            });
            setEditModal(true);
          };

          const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
              ...prev,
              [name]: value
            }));
          };

          const handleSubmit = async () => {
            try {
                await axios.post(`${baseUrl}/v1/api/verifyDocs/updateDocument/${editId}`, 
               formData, {
                  headers: {
                    'Content-Type': 'application/json',
                    authorization: token
                  }
                });
              getDcouments(); 
              setEditModal(false);
              setIsEdit(false);
              setFormData({
                name:'',
                label:'',
                status: '',
              });
            } catch (error) {
              console.error('Error saving Document:', error);
            }
          };
          
        

        const columns = [
            {
              field: 'label',
              headerName: 'Document Label',
              width:300,
              align: 'center',
              headerAlign: 'center',
            },
            {
                field: 'name',
                headerName: 'Document Name',
                width:240,
                align: 'center',
                headerAlign: 'center',
              },
            {
                field: 'createdAt',
                headerName: 'Created At',
                width: 240,
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
                width: 350,
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
        <Typography fontSize={20} fontWeight={600}>Documents Setup</Typography>
        <Box sx={{ display: 'flex', gap: 4 }}>
            <Button variant="outlined" size="small" onClick={() => router.push('/employeeSetup')}>Back</Button>
        </Box>
        </Box>
        <Box sx={{ height: 600, width: '100%', mt:4 }}>
          <DataGrid
            rows={documents}
            columns={columns}
            pageSize={5}
            disableRowSelectionOnClick
            getRowId={(row) => row._id}
          />
        </Box>
             <Modal
            open={editModal}
            onClose={() => {
                setEditModal(false)
                setEditId(null)
                setFormData({
                    name:'',
                    label:'',
                    status: '',
                })
            }}
            >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>    
            <Grid container spacing={5}>
            <Grid item xs={12}>
            <Typography fontSize={16} fontWeight={500}>
              Edit Document
            </Typography>
          </Grid>

                  <Grid item xs={12} md={6}>
                  <TextField
                    name="name"
                    label="Document Name"
                    fullWidth
                    size='small'
                    value={formData.name}
                    onChange={handleChange}
                    required
                   />
                  </Grid>
                    <Grid item xs={12} md={6}>
                  <TextField
                    name="label"
                    label="Document Label"
                    size='small'
                    disabled={true}
                    required
                    value={formData.label}
                  />
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
                      <MenuItem value={"true"}>
                    Active
                    </MenuItem>
                    <MenuItem value={"false"}>
                    In-Active
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            setEditModal(false)
                            setEditId(null)
                            setFormData({
                                name:'',
                                label:'',
                                status: '',
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
