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

export default function Verification() {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const [verification, setVerification] = useState([])
        const router = useRouter();

        const getVerifications = async () => {
            try {
              const res = await axios.get(`${baseUrl}/v1/api/verifyDocs/getAllVerificationAPIs`, {
                headers: {
                  'Content-Type': 'application/json',
                  authorization: token
                }
              });
              setVerification(res.data.items);
            } catch (error) {
              console.error('Error fetching companies:', error);
            }
          };
  
          useEffect(()=>{
            getVerifications()
          },[])

          const columns = [
            {
              field: 'apiName',
              headerName: 'API Name',
              width:190,
              align: 'center',
              headerAlign: 'center',
            },
            {
                field: 'description',
                headerName: 'Description',
                width:785
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
            // {
            //     field: 'actions',
            //     headerName: 'Actions',
            //     width: 350,
            //     align: 'center',
            //     headerAlign: 'center',
            //     renderCell: (params) => (
            //     <Box>
            //         <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            //         <EditIcon />
            //         </IconButton>
            //     </Box>
            //     )
            // }
          ];
  return (

    <Container maxWidth='xl'>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={600}>Verification Setup</Typography>
                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Button variant="outlined" size="small" onClick={() => router.push('/employeeSetup')}>Back</Button>
                </Box>
                </Box>
                <Box sx={{ height: 600, width: '100%', mt:4 }}>
                  <DataGrid
                    rows={verification}
                    columns={columns}
                    pageSize={5}
                    disableRowSelectionOnClick
                    getRowId={(row) => row._id}
                  />
                </Box>
    </Container>
  )
}
