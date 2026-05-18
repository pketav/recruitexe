'use client'

import { Container, Box, Typography, Modal, Button,Grid, IconButton ,Snackbar,Alert, TextField, MenuItem} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios';

export default function AllScheduledInterviews() {
    const [interviews, setInterviews] = useState([]);
    const token = window.localStorage.getItem("authToken")
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const [timeline, setTimeline] = useState("all")
    const [interviewStatus, setinterviewStatus] = useState('all')
    const getAllInterviews = async () =>{ 
        try {
            const res = await axios.get(`${baseUrl}/v1/api/candidate/checkscheduleInterview?type=${timeline}&status=${interviewStatus}`, {
              headers: {
                'Content-Type': 'application/json',
                authorization: token
              }
            });
            setInterviews(res.data.items);
          } catch (error) {
            console.error('Error fetching companies:', error);
          }
    }

    useEffect(()=>{
     getAllInterviews()
    },[timeline,interviewStatus])

    const columns = [
        {
          field: 'name',
          headerName: 'Candidate Name',
          width: 200,
        },
        {
          field: 'emailId',
          headerName: 'Email',
          width: 220,
        },
        {
          field: 'interviewRound',
          headerName: 'Round',
          width: 120,
          type: 'number',
          align:"center",
          headerAlign:'center',
          renderCell: (params) => params?.row?.interview?.interviewRound || '-',
        },
        {
          field: 'interviewDate',
          headerName: 'Interview Date',
          width: 150,
          renderCell: (params) => {
            const date = params?.row?.interview?.interviewDate;
            return date ? new Date(date).toLocaleDateString() : '-';
          },
        },
        {
          field: 'interviewTime',
          headerName: 'Interview Time',
          width: 150,
          renderCell: (params) => params?.row?.interview?.interviewTime || '-',
        },
        {
          field: 'mode',
          headerName: 'Mode',
          width: 110,
          align:"center",
          headerAlign:'center',
          renderCell: (params) => params?.row?.interview?.mode.toUpperCase() || '-',
        },
        {
          field: 'status',
          headerName: 'Interview Status',
          width: 145,
          align:"center",
          headerAlign:'center',
          renderCell: (params) => params?.row?.interview?.interviewTaken==='yes' ? 'Taken' : 'Not Taken',
        }
      ];
      
  return (
    <Container>
         <Box sx={{ my: 4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Typography fontSize={20} fontWeight={600}>All Scheduled Interviews</Typography>
                <Box sx={{width:"30%",display:'flex', gap:3}}>
                <TextField
                    select
                    fullWidth
                    label="Interview Timeline"
                    size="small"
                    value={timeline}
                    onChange={(e)=>setTimeline(e.target.value)}
                    SelectProps={{ native: false }}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="future">Future Interviews</MenuItem>
                    <MenuItem value="past">Past Interviews</MenuItem>
                </TextField>
                <TextField
                    select
                    fullWidth
                    label="Interview Status"
                    size="small"
                    value={interviewStatus}
                    onChange={(e)=>setinterviewStatus(e.target.value)}
                    SelectProps={{ native: false }}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="yes">Taken</MenuItem>
                    <MenuItem value="no">Not Taken</MenuItem>
                </TextField>
                </Box>
        </Box>
        <Box sx={{ width: '100%', height: 600 }}>
        <DataGrid
        rows={interviews?.map((item) => ({
            ...item,
            id: item.interview?._id || item.jobApplyFormId 
        }))}
        columns={columns}
        pageSize={10}
        />
    </Box>
    </Container>
  )
}
