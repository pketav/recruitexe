'use client'

import { Container, Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid'
import { PictureAsPdf } from "@mui/icons-material"; 
import { useRouter } from 'next/navigation';

function MyAppliedJobs() {
    const [myJobs, setMyJobs] = useState([])
    const token = window.localStorage.getItem("authToken")
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const router = useRouter();
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalItems, setTotalItems] = useState(0)
    const [view, setView] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState({})

    const applicationColumns = [
        { field: 'position', headerName: 'Position Applied', minWidth:150 },
        { field: 'department', headerName: 'Department', minWidth:150 },
        { field: 'branch', headerName: 'Branch',  minWidth:200 },
        { field: 'preferredLocation', headerName: 'Preferred Location', minWidth:200 },
        {
          field: 'createdAt',
          headerName: 'Applied On',
          minWidth:150
        },
        {
        field: 'actions',
        headerName: 'Actions',
        minWidth: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            onClick={() => handleView(params.row)}
                  sx={{
                    background: 'linear-gradient(135deg,rgb(73, 241, 138) 0%,rgb(27, 172, 172) 100%)',
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
                >
                  View
          </Button>
        ),
      }
    ];
      const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
      };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };

    const getAllJobs = async () => {
        try {
            const res = await axios.get(`${baseUrl}/v1/api/job/myAppliedJobs?page=${page+1}&limit=${rowsPerPage}`, {
              headers: {
                'Content-Type': 'application/json',
                 authorization: token
              }
            })
            if(res.data.status){
                const formattedApplications = res.data.items.jobs.map((item,index) => ({
                    id: item._id,
                    candidateId: item.candidateUniqueId,
                    name: item.name,
                    mobile: item.mobileNumber,
                    email: item.emailId,
                    qualification: item.highestQualification,
                    university: item.university,
                    graduationYear: item.graduationYear,
                    cgpa: item.cgpa,
                    address: item.address,
                    state: item.state,
                    city: item.city,
                    pincode: item.pincode,
                    skills: item.skills,
                    resume: item.resume,
                    interviewMode: item.preferedInterviewMode,
                    position: item.position,
                    source: item.knewaboutJobPostFrom,
                    currentDesignation: item.currentDesignation,
                    lastOrganization: item.lastOrganization,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    reasonForLeaving: item.reasonLeaving,
                    experience: item.totalExperience,
                    currentCTC: item.currentCTC,
                    currentLocation: item.currentLocation,
                    preferredLocation: item.preferredLocation,
                    gap: item.gapIfAny,
                    offerLetterStatus: item.finCooperOfferLetter,
                    offerLetterPath: item.pathofferLetterFinCooper,
                    interviewStatus: item.interviewSchedule,
                    hrFeedback: item.feedbackByHr,
                    candidateStatus: item.candidateStatus,
                    isEligible: item.isEligible,
                    matchPercentage: item.matchPercentage,
                    summary: item.summary,
                    applicationStatus: item.status?.toUpperCase() || '',
                    department: item.department?.name || '',
                    branch: item.branches?.name || '',
                    recruiter: item.employees?.employeName || '',
                    createdAt: new Date(item.createdAt).toLocaleDateString(),
                  }));
                  
                  setMyJobs(formattedApplications)
                  setTotalItems(res.data.items.pagination?.total || 0)
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error)
        }
    }

    useEffect(()=>{
      getAllJobs()
    },[page,rowsPerPage])

    const handleView = (row) => {
        setView(true)
        setSelectedApplication(row)
    }


  return (
    <Container>
          <Box sx={{my:4, display:"flex", justifyContent:"space-between"}}>
        <Typography fontSize={20} fontWeight={600}>My Job Applications</Typography>
        <Button variant="outlined" size='small' onClick={()=>router.push("/jobPosts")}>Back</Button>
    </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={myJobs}
          columns={applicationColumns}
          pagination
          getRowId={(row) => row.id}
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
<Dialog open={view} onClose={() => setView(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Application Details</DialogTitle>
  <DialogContent dividers>
    <Grid container spacing={2}>
      <Grid item xs={6}><strong>Name:</strong> {selectedApplication?.name}</Grid>
      <Grid item xs={6}><strong>Email:</strong> {selectedApplication?.email}</Grid>
      <Grid item xs={6}><strong>Mobile:</strong> {selectedApplication?.mobile}</Grid>
      <Grid item xs={6}><strong>Position:</strong> {selectedApplication?.position}</Grid>
      <Grid item xs={6}><strong>Qualification:</strong> {selectedApplication?.qualification}</Grid>
      <Grid item xs={6}><strong>University:</strong> {selectedApplication?.university}</Grid>
      <Grid item xs={6}><strong>Graduation Year:</strong> {selectedApplication?.graduationYear}</Grid>
      <Grid item xs={6}><strong>CGPA:</strong> {selectedApplication?.cgpa}</Grid>
      <Grid item xs={6}><strong>Experience:</strong> {selectedApplication?.experience} years</Grid>
      <Grid item xs={6}><strong>Current CTC:</strong> ₹{selectedApplication?.currentCTC} LPA</Grid>
      <Grid item xs={6}><strong>Match %:</strong> {selectedApplication?.matchPercentage}%</Grid>
      <Grid item xs={12}><strong>Current Location:</strong> {selectedApplication?.currentLocation}</Grid>
      <Grid item xs={12}><strong>Preferred Location:</strong> {selectedApplication?.preferredLocation}</Grid>
      <Grid item xs={12}><strong>Interview Mode:</strong> {selectedApplication?.interviewMode}</Grid>
      <Grid item xs={12}><strong>Interview Status:</strong> {selectedApplication?.interviewStatus}</Grid>
      {selectedApplication?.resume && (
        <Grid item xs={12} sx={{display:"flex", alignItems:"center", gap:2, justifyContent:"flex-end", mr:2}}>
          <strong>Resume:</strong>{' '}
          <PictureAsPdf sx={{ color: "red", fontSize: 30, cursor: "pointer" }} 
            onClick={() => window.open(selectedApplication?.resume, "_blank")} 
        />
        </Grid>
      )}
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={()=>setView(false)} variant="contained" color="primary">Close</Button>
  </DialogActions>
</Dialog>

    </Container>
  )
}

export default MyAppliedJobs