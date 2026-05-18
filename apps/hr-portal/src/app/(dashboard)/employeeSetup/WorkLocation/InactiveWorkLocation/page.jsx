'use client'

import { Container, Box, Typography, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';


export default function InActiveWorkLocations() {
      const token = window.localStorage.getItem("authToken");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const [workLocations, setWorkLocations] = useState([]);
      const router = useRouter()

      const columns = [
        { field: 'name', headerName: 'Work Location Name', width: 230, align:"center", headerAlign:"center" },
        { field: 'branchName', headerName: 'Branch Name', width: 250 , align:"center", headerAlign:"center" },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 120,
            headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                const dateStr = params.row?.createdAt;
                if (!dateStr) return "-";
                const date = new Date(dateStr);
                return isNaN(date.getTime()) ? "-" : date.toLocaleString('en-IN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                });
            }
          },
      ];

      const getAllWorkLocations = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/workLocation/getAllInactive`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token
            }
          })
          const formatted = res.data.items.map((item) => ({
            id: item._id,
            name: item.name,
            branchName:item.branchId?.name || "-",
            createdAt: item?.createdAt || "-"
          }));
          setWorkLocations(formatted)
        } catch (error) {
          console.error("error", error);
        }
      }

      useEffect(()=>{
        getAllWorkLocations()
    },[])

  return (
    <Container>
        <Box sx={{display:'flex', justifyContent:"space-between", alignItems:"center"}}>
             <Box>
             <Typography fontSize={20} fontWeight={600} sx={{my:3}}>
            In-Active Work Locations
            </Typography>
                        </Box>
            <Button variant='outlined'size='small' onClick={()=>router.push("/employeeSetup/WorkLocation")}>
                Back
            </Button>
        </Box>
            
          <Box style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={workLocations}  
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.id} 
          rowsPerPageOptions={[5]}
        />
      </Box>
    </Container>
  )
}
