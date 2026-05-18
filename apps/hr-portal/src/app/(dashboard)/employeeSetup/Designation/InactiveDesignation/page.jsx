'use client'

import { Container, Box, Typography, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';


export default function InactiveDesignation() {
      const token = window.localStorage.getItem("authToken");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const [designations, setDesignations] = useState([]);
      const router = useRouter()

      const columns = [
        { field: 'name', headerName: 'Work Location Name', width: 550, align:"center", headerAlign:"center" },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 550,
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

      const getDesignation = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/designation/getAllInactive`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token
            }
          })
          const formatted = res.data.items.map((item) => ({
            id: item._id,
            name: item.name,
            createdAt: item?.createdAt || "-"
          }));
          setDesignations(formatted)
        } catch (error) {
          console.error("error", error);
        }
      }

      useEffect(()=>{
        getDesignation()
    },[])

  return (
    <Container>
        <Box sx={{display:'flex', justifyContent:"space-between", alignItems:"center"}}>
             <Box>
             <Typography fontSize={20} fontWeight={600} sx={{my:3}}>
            In-Active Work Locations
            </Typography>
                        </Box>
            <Button variant='outlined'size='small' onClick={()=>router.push("/employeeSetup/Designation")}>
                Back
            </Button>
        </Box>
            
          <Box style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={designations}  
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.id} 
          rowsPerPageOptions={[5]}
        />
      </Box>
    </Container>
  )
}
