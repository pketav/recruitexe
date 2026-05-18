'use client'

import { Container, Box, Typography, Modal, Button, IconButton ,Snackbar,Alert, TextField, MenuItem} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios';

export default function AllJobPosts() {
    const [jobPosts, setJobPosts] = useState([]);
    const token = window.localStorage.getItem("authToken")
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const [desc, setDesc] = useState("")
    const [openDesc, setOpenDesc] = useState(false)
    const [status, setStatus] = useState('active')
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success',
      });

    const handleDesc = (value) => {
        setDesc(value)
        setOpenDesc(true)
    }
    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
      };

    const postColumns = [
        { field: 'department', headerName: 'Department', width: 180 },
        { field: 'position', headerName: 'Desingation', width: 140 },
        { field: 'qualification', headerName: 'Qualification', width: 145 },
        { field: 'noOfPosition', headerName: 'Positions', width: 80, align:"center", headerAlign:"center" },
        { field: 'employmentType', headerName: 'Employment Type', width: 130 },
        { field: 'organization', headerName: 'Organization', width: 160 },
        {
          field: 'jobDescription',
          headerName: 'Job Desc',
          width: 80,
          renderCell: (params) => (
            <Box sx={{display:"flex", height:"100%", alignItems:"center"}}>
              <Button
              color='success'
              variant='outlined'
              onClick={() => handleDesc(params.row.jobDescription)}
            >
            View
            </Button>
            </Box>
          )
        },
        {
          field: "createdAt",
          headerName: "Created At",
          width: 100,
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
        {
          field: 'actions',
          headerName: 'Actions',
          width: 100,
          sortable: false,
          headerAlign: 'center', align: 'center',
          filterable: false,
          renderCell: (params) => (
            <Box>
                <Button
              sx={{
                background: 'linear-gradient(135deg,rgb(55, 142, 201) 0%,rgb(61, 180, 180) 100%)',
                borderRadius: '8px',
                px: 2.5,
                py: 1,
                cursor: 'pointer',
                color: '#fff',
                fontWeight: 500,
                fontSize: '0.875rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-2px)',
                  opacity: 0.95,
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                '&.Mui-disabled': {
                  background: '#ccc',
                  color: 'black',
                  cursor: 'not-allowed',
                  boxShadow: 'none',
                  transform: 'none',
                },
              }}
              onClick={() => handleEdit(params.row,status)}
            >
              {status==='active' ? "Inactivate" : "Activate"}
            </Button>
            </Box>
          )
        }
      ];
    const getAllPosts = async() => {
        try {
            const res = await axios.get(`${baseUrl}/v1/api/jobPost/getAllJobPost?status=${status}`)
            if(res.data.status){
                const formattedVacancies = res.data.items.map(item => ({
                    _id: item._id,
                    position: item.position,
                    eligibility: item.eligibility,
                    qualification:item.qualification.name,
                    experience: item.experience,
                    noOfPosition: item.noOfPosition,
                    organization:item.organization?.name,
                    budget: item.budget,
                    status: item.status.toUpperCase(),
                    department: item.department?.name || '',
                    departmentId: item.department?._id || '',
                    branch: item.branch?.map(b => b.name.toUpperCase()).join(', ') || '',
                    branchId: item.branch?.map(b => b._id.toUpperCase()).join(', ') || '',
                    employmentType: item.employmentType?.title.toUpperCase() || '',
                    createdBy: item.createdByHr?.employeName || '',
                    createdAt:item?.createdAt || '',
                    company: item.jobId?.company || '',
                    jobDescription: item.jobDescription?.jobDescription || ''
                  }));                  
                  setJobPosts(formattedVacancies)
               
            }
        } catch (error) {
            console.error("error",error)
        }
    }

    useEffect(()=>{
      getAllPosts()
    },[status])

    const handleEdit = async (row,status) =>{
        try {
            const res = await axios.post(`${baseUrl}/v1/api/jobPost/updatePost/${row._id}`,{
                "status":status==='active' ? 'inactive' : 'active'
            }, {
              headers: {
                'Content-Type': 'application/json',
                authorization: token
              }
            });
            if(res.data.status){
              setSnackbar({
                message:res.data.message,
                severity:'success',
                open:true
              })
            }
            else{
              setSnackbar({
                message:res.data.message,
                severity:'erro',
                open:true
              })
            }
          } catch (error) {
            console.error("error", error);
            setSnackbar({
              message:error.message,
              severity:'erro',
              open:true
            })
          } finally{
            getAllPosts()
          }
    }

  return (
    <Container maxWidth="xl">
         <Box sx={{my:4, display:'flex', justifyContent:"space-between"}}>
        <Typography fontSize={20} fontWeight={600}>All Job Posts</Typography>
        <Box sx={{width:"200px"}}>
        <TextField
            select
            fullWidth
            label="Activity Status"
            size="small"
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            SelectProps={{ native: false }}
        >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">In-Active</MenuItem>
        </TextField>
        </Box>
       
    </Box>
    <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={jobPosts}
          columns={postColumns}
          pageSize={10}
          getRowId={(row)=>row._id}
          rowsPerPageOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#FFFFFF',
              color: '#404653',
              fontWeight: 600,
            },
            '& .MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '& .MuiDataGrid-row.even': {
              backgroundColor: '#FFFFFF' ,
              color:"#484964"
            },
            '& .MuiDataGrid-row.odd': {
              backgroundColor: '#F7F7F9',
              color:"#484964"
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
            }
          }}
        />
      </Box>
        <Modal open={openDesc} onClose={() => {setOpenDesc(false); setDesc("")}}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 480,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ borderBottom: "2px solid rgb(14, 115, 182)", pb: 1, color: "#333" }}
          >
            Job Description
          </Typography>

          {desc && (
            <Typography>{desc}</Typography>
            )}

          <Button
            variant="contained"
            size='small'
            sx={{
              mt: 2,
              alignSelf: "flex-end",
              bgcolor: "#00c65c",
              "&:hover": { bgcolor: "#5ed294" },
            }}
            onClick={() => {setOpenDesc(false); setDesc("")}}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
      <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
      {snackbar.message}
      </Alert>
      </Snackbar>
    </Container>
  )
}
