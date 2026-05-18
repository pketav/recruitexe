'use client'

import { Container, Box, TextField, MenuItem, Typography,Button, Dialog, Grid, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'

export default function ManagerDesk() {
    const [candidates, setCandidates] = useState([])
    const [interviewBy, setInterviewBy] = useState('manager')
    const [interviewTaken, setInterviewTaken] = useState('no')
    const token = window.localStorage.getItem("authToken")
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const [selectedCandidate, setSelectedCandidate] = useState({})
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [openFeedback, setOpenFeedback] = useState(false)
    const [feedbackData, setFeedbackData] = useState({
        jobApplyFormId:"",
        ID:"",
        feedbackBy: "", 
        interviewTaken: "", 
        furtherProcessProfile: "",   
        remark: "",
        candidateReview: "",
        skillReview: "",
        hireCandidate: "", 
        note: "",
        feedbackId:""
    })
    const [totalItems, setTotalItems] = useState(0)

    const columns = [
        { field: 'name', headerName: 'Candidate Name', width: 150},
        { field: 'position', headerName: 'Applied For', width: 150},
        { field: 'emailId', headerName: 'Email', width: 200},
        { field: 'mobileNumber', headerName: 'Conatct Phone', width: 130},
        { field: 'highestQualification', headerName: 'Highest Qualification', width: 150,align: 'center'},
        { field: 'resume', headerName: 'Review Summary', width: 200,align:"center" , headerAlign: 'center',
            renderCell: (params) => (
                <Button variant='outlined' size='small' color='error' onClick={() => window.open(params.row.resume, '_blank')}>Resume</Button>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 160
            ,align:"center" , headerAlign: 'center',
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
                    onClick={() => handleFeedback(params.row)}
                >
                    Feedback
                </Button>
            )
        }
    ]

    const getAllCandidates = async () =>{
        try {
            const res = await axios.get(`${baseUrl}/v1/api/job/viewprofilemanager?sortByInterviewTaken=${interviewTaken}&InterviewBy=${interviewBy}`, {
              headers: {
                'Content-Type': 'application/json',
                 authorization: token
              }
            })
            if(res.data.status){
               setCandidates(res.data.items.data)
               setTotalItems(res.data.items.count)
            }
        } catch (error) {
            console.error("error",error)
        }
    }


    useEffect(()=>{
       getAllCandidates()
    },[interviewBy, interviewTaken])


    const handleFeedback = (row) => {
        setSelectedCandidate(row)
        setOpenFeedback(true)
    }

    const handleSubmitFeedback = async () => {
        try {
            const payload = {
                ...feedbackData,
                jobApplyFormId:selectedCandidate?.InterviewDetailsIds[0].jobApplyFormId,
                ID:selectedCandidate?.InterviewDetailsIds[0]?._id,
            }
           
            const res = await axios.post(`${baseUrl}/v1/api/candidate/feedback`, payload, {
              headers: {
                'Content-Type': 'application/json',
                authorization: token
              }
            });
          } catch (error) {
            console.error("error", error);
          } finally{
            getAllCandidates()
           setFeedbackData({
            jobApplyFormId:"",
            ID:"",
            feedbackBy: "", 
            interviewTaken: "", 
            furtherProcessProfile: "",   
            remark: "",
            candidateReview: "",
            skillReview: "",
            hireCandidate: "", 
            note: "",
            feedbackId:""
           })
           setOpenFeedback(false)
           setSelectedCandidate({})
          }
    }

   return (
    <Container maxWidth='xl'>
          <Box sx={{my:4, display:'flex', justifyContent:"space-between"}}>
        <Typography fontSize={20} fontWeight={600}>Manager Desk</Typography>
        <Box sx={{width:"40%",display:'flex', gap:3}}>
        <TextField
            select
            fullWidth
            label="Interview By"
            size="small"
            value={interviewBy}
            onChange={(e)=>setInterviewBy(e.target.value)}
            SelectProps={{ native: false }}
        >
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
        </TextField>
        <TextField
            select
            fullWidth
            label="Interview Taken"
            size="small"
            value={interviewTaken}
            onChange={(e)=>setInterviewTaken(e.target.value)}
            SelectProps={{ native: false }}
        >
            <MenuItem value="no">Not Taken</MenuItem>
            <MenuItem value="yes">Taken</MenuItem>
        </TextField>
        </Box>
        </Box>
        <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
            rows={candidates}
            columns={columns}
            pageSize={rowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
            rowCount={totalItems}
            pagination
            paginationMode="server"
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
            getRowId={(row) => row._id || row.id}
            />
            </Box>

         <Dialog open={openFeedback} onClose={() => setOpenFeedback(false)} fullWidth maxWidth="sm">
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Feedback By"
                  name="feedbackBy"
                  fullWidth
                  select
                   size='small'
                  value={feedbackData.feedbackBy}
                  onChange={e => setFeedbackData({ ...feedbackData, feedbackBy: e.target.value })}
                > <MenuItem value="hr">HR</MenuItem>
                  <MenuItem value="interviewer">Manager</MenuItem>
                  </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Interview Taken"
                  name="interviewTaken"
                  select
                  fullWidth
                   size='small'
                  value={feedbackData.interviewTaken}
                  onChange={e => setFeedbackData({ ...feedbackData, interviewTaken: e.target.value })}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="notSelected">Not Selected</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Further Process Profile"
                  name="furtherProcessProfile"
                  select
                  fullWidth
                   size='small'
                  value={feedbackData.furtherProcessProfile}
                  onChange={e => setFeedbackData({ ...feedbackData, furtherProcessProfile: e.target.value })}
                >
                   <MenuItem value="yes">Yes</MenuItem>
                   <MenuItem value="no">No</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Remark"
                  name="remark"
                  fullWidth
                   size='small'
                  multiline
                  rows={2}
                  value={feedbackData.remark}
                  onChange={e => setFeedbackData({ ...feedbackData, remark: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Candidate Review"
                  name="candidateReview"
                  fullWidth
                  multiline
                  rows={2}
                   size='small'
                  value={feedbackData.candidateReview}
                  onChange={e => setFeedbackData({ ...feedbackData, candidateReview: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Skill Review"
                  name="skillReview"
                  fullWidth
                  multiline
                   size='small'
                  rows={2}
                  value={feedbackData.skillReview}
                  onChange={e => setFeedbackData({ ...feedbackData, skillReview: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Hire Candidate"
                  name="hireCandidate"
                  select
                  fullWidth
                   size='small'
                  value={feedbackData.hireCandidate}
                  onChange={e => setFeedbackData({ ...feedbackData, hireCandidate: e.target.value })}
                >
                  <MenuItem value="accept">Yes</MenuItem>
                  <MenuItem value="reject">No</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Note"
                  name="note"
                  fullWidth
                   size='small'
                  multiline
                  rows={3}
                  value={feedbackData.note}
                  onChange={e => setFeedbackData({ ...feedbackData, note: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFeedback(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitFeedback} >Submit</Button>
          </DialogActions>
        </Dialog>
        


    </Container>
  )
}
