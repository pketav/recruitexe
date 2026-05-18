'use client'

import { Container, Box, Typography, Modal, Button,Grid ,Snackbar,Alert, TextField, MenuItem} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios';

export default function RejectedCandidate() {
        const [candidates, setCandidates] = useState([]);
        const token = window.localStorage.getItem("authToken")
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        const [selectedSummary, setSelectedSummary] = useState("")
        const [openSummary, setOpenSummary] = useState(false)
        const [selectedCandidate, setSelectedCandidate] = useState({})
        const [scheduleModal,setScheduleModal] = useState(false)
        const [page,setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(10)
        const [totalItems, setTotalItems] = useState(0)
        const [employees, setEmployees] = useState([])
        const [snackbar, setSnackbar] = useState({
            open: false,
            message: '',
            severity: 'success',
            });
    
        const handleSummary = (value) =>{
            setSelectedSummary(value)
            setOpenSummary(true)
        }

        const handleCloseSnackbar = () => {
            setSnackbar({ ...snackbar, open: false });
            };

        const getAllCandidates = async () =>{ 
            try {
                const res = await axios.get(`${baseUrl}/v1/api/candidate/rejectjobforms`, {
                  headers: {
                    'Content-Type': 'application/json',
                    authorization: token
                  }
                });
                setCandidates(res.data.items.jobApplications);
                setTotalItems(res.data.items.pagination.totalItems)
              } catch (error) {
                console.error('Error fetching companies:', error);
              }
        }

        const getAllEmployee = async () =>{
            try {
                const res = await axios.get(`${baseUrl}/v1/api/candidate/employee`, {
                  headers: {
                    'Content-Type': 'application/json',
                     authorization: token
                  }
                })
                if(res.data.status){
                    setEmployees(res.data.items.employees)
                }
            } catch (error) {
                console.error("error",error)
            }
        }

        useEffect(()=>{
          getAllCandidates()
          getAllEmployee()
        },[])

        const handleChange = (e) => {
            const {name,value} = e.target
            setSelectedCandidate((prev)=>({
                ...prev,
             [name] : value
            }))
        }

        const handleSchedule = (row) => {
            setSelectedCandidate((prev)=>({
                 ...prev,
                 jobFormId: row?._id,
                 mode: "",
                 interviewDate: "",
                 interviewTime: "",
                 location: "",
                 interviewer: "",
            }));
            setScheduleModal(true)
         }
     
         const handleScheduleInterview = async () => {
             try {
                 const payload = {
                     ...selectedCandidate,
                     interviewTime:`${Number(selectedCandidate.interviewTime.split(":")[0])>11 ? `${selectedCandidate.interviewTime} P.M` : `${selectedCandidate.interviewTime} A.M`}`,
                 }
                 const res = await axios.post(`${baseUrl}/v1/api/candidate/rescheduleInterview`, payload, {
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
                      severity:'success',
                      open:true
                    })
                  }
      
                } catch (error) {
                  console.error("error", error);
                  setSnackbar({
                    open: false,
                    message: error.message,
                    severity: 'error',
                  })
               } finally{
                 getAllCandidates()
                 setScheduleModal(false)
                 setSelectedCandidate({})
               }
         }

        const colums = [
         { field: 'name', headerName: 'Candidate Name', width: 160},
        { field: 'position', headerName: 'Position Applied', width: 130 },
        { field: 'lastOrganization', headerName: 'Last Organization', width: 130, align:"center",headerAlign:"center" },
        {
            field: 'resume',
            headerName: 'Resume',
            width: 150,
            renderCell: (params) => (
            <Button variant='outlined' size='small' color='error' onClick={() => window.open(params.row.resume, '_blank')}>Resume</Button>
            )
        },
        { field: 'isCandiateEligible', headerName: 'Eligibility', width: 140, renderCell:(params)=>(<Box sx={{height:"100%", display:"flex",alignItems:"center"}}><Typography fontSize={13}>{params.row.isEligible==="false" ? "Not Eligible" : "Eligible"}</Typography></Box>) },
        { field: 'matchPercentage', headerName: 'Eligibility %', width: 130, headerAlign: 'center', align: 'center'},
        {
            field: 'summary',
            headerName: 'Review Summary',
            width: 140,
            align:"center",
            renderCell: (params) => (
            <Button variant='outlined' size='small' color='success' onClick={() => handleSummary(params.row.summary)}>View</Button>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 160,
            headerAlign: 'center', align: 'center',
            renderCell: (params) => (
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
                }}
                onClick={() => handleSchedule(params.row)}
            >
                Re-Schedule
            </Button>
            )
        },
        ]

  return (
    <Container>
              <Box sx={{ my: 4 }}>
                <Typography fontSize={20} fontWeight={600}>All Rejected Applications</Typography>
              </Box>
              <Box sx={{ width: '100%', height: 600 }}>
                <DataGrid
                  rows={candidates}
                  columns={colums}
                  pagination
                  getRowId={(row)=>row._id}
                  paginationModel={{ page, pageSize: rowsPerPage }}
                  onPaginationModelChange={({ page, pageSize }) => {
                    setPage(page);
                    setRowsPerPage(pageSize);
                  }}
                  rowCount={totalItems}
                  pageSizeOptions={[5, 10, 20]}
                  paginationMode="server"
                  disableRowSelectionOnClick
                />
              </Box>
                 <Modal open={openSummary} onClose={() => {setOpenSummary(false); setSelectedSummary("")}}>
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
                    sx={{ borderBottom: "2px solid #00c65c", pb: 1, color: "#333" }}
                  >
                    Candidate Eligibility Summary
                  </Typography>
        
                  {selectedSummary && (
                    <ul style={{ paddingLeft: '1.2rem', color: '#555', lineHeight: 1.6, paddingRight:"1rem" }}>
                        {selectedSummary
                        .split('.')
                        .map((sentence, index) =>
                            sentence.trim() ? (
                            <li key={index} style={{ marginBottom: '0.5rem', textAlign: 'justify' }}>
                                {sentence.trim()}.
                            </li>
                            ) : null
                        )}
                    </ul>
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
                    onClick={() => {setOpenSummary(false); setSelectedSummary("")}}
                  >
                    Close
                  </Button>
                </Box>
              </Modal>
              <Modal open={scheduleModal} onClose={() => {setScheduleModal(false); setSelectedCandidate({})}}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: 600 },
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
        }}
        >
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            sx={{my:3}}
          >
            Schedule Interview
          </Typography>

       <Grid container spacing={5}>
       <Grid item xs={12} sm={6} >
        <TextField
            fullWidth
            select
            name="mode"
            label="Interview Mode"
            size="small"
            value={selectedCandidate.mode}
            onChange={handleChange}
            SelectProps={{ native: false }}
        >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="offline">Offline</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
        </TextField>
        </Grid>
        <Grid item xs={12} sm={6} >
            <TextField
              fullWidth
              type="date"
              name="interviewDate"
              label="Interview Date"
              size='small'
              InputLabelProps={{ shrink: true }}
              value={selectedCandidate?.interviewDate}
              onChange={handleChange}
            />
            </Grid>  
            <Grid item xs={12} sm={6} >
              <TextField
              label='Interview Time'
              name='interviewTime'
              type='time'
              size='small'
              value={selectedCandidate?.interviewTime}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>   
          <Grid item xs={12} sm={6} >
        <TextField
            fullWidth
            select
            name="location"
            label="Interview Venue"
            size="small"
            value={selectedCandidate.location}
            onChange={handleChange}
            SelectProps={{ native: false }}
        >
            <MenuItem value="Fincoopers Capital">Fincoopers Capital</MenuItem>
            <MenuItem value="Fincoopers Tech India">Fincoopers Tech India</MenuItem>
        </TextField>
        </Grid> 
        <Grid item xs={12} sm={6} >
        <TextField
            fullWidth
            select
            name="interviewer"
            label="Interviewer"
            size="small"
            value={selectedCandidate?.interviewer}
            onChange={handleChange}
            SelectProps={{ native: false }}
        >
            {employees?.map((i,index)=>
                 <MenuItem value={i._id} key={`${i._id}${index}`}>{i.employeName}</MenuItem>
            )}
        </TextField>
        </Grid> 
      <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-end", gap:3, mt:3}}>
        <Button
            variant="contained"
            color='secondary'
            onClick={() => {setScheduleModal(false); setSelectedCandidate({})}}
        >
            Close
        </Button>
        <Button
            variant="contained"
            
            onClick={handleScheduleInterview}
        >
            Schedule
        </Button>
            </Grid>
    </Grid>   

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
