'use client'

import { Container, Box, Typography, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';


export default function InActiveBranches() {
      const token = window.localStorage.getItem("authToken");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const [branches, setBranches] = useState([]);
      const router = useRouter()

      const columns = [
        { field: 'name', headerName: 'Branch Name', width: 180 },
        { field: 'address', headerName: 'Address', width: 220 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'state', headerName: 'State', width: 180 },
        { field: 'pincode', headerName: 'Pincode', width: 130 },
        { field: 'type', headerName: 'Branch Type', width: 150 },
      ];

      const getBranch = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/branch/getAllInactive`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token
            }
          })
          setBranches(res.data.items)
        } catch (error) {
          console.error("error", error);
        }
      }

      useEffect(()=>{
        getBranch()
    },[])

  return (
    <Container>
        <Box sx={{display:'flex', justifyContent:"space-between", alignItems:"center"}}>
             <Box>
             <Typography fontSize={20} fontWeight={600} sx={{my:3}}>
            In-Active Branches
            </Typography>
                        </Box>
            <Button variant='outlined'size='small' onClick={()=>router.push("/employeeSetup/Branch")}>
                Back
            </Button>
        </Box>
            
          <Box style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={branches}  
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id} 
          rowsPerPageOptions={[5]}
        />
      </Box>
    </Container>
  )
}
