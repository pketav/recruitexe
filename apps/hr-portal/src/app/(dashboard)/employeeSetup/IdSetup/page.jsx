"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Button,
  MenuItem,
  Box,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material"
import axios from "axios"
import { useRouter } from "next/navigation"
import TagIcon from '@mui/icons-material/Tag';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const dateFormats = ["YYYYMM", "YYMM", "YYYY-MM", "YY-MM"]


export default function IDSetup() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)

  const [orgs, setOrgs] = useState([])
  const getOrganization = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/org/getOrganizations`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setOrgs(res.data.items[0]);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  // Employee ID state
  const [empId, setEmpId] = useState({
    employeIdPrefix: "",
    employeIdSuffix: "",
    employeIdCounter: 0,
    employeIdUseDate: false,
    employeIdDateFormat: "YYYYMM",
    employeIdUseRandom: false,
    employeIdRandomLength: 3,
    employeIdPadLength: 5,
  })

  // Candidate ID state
  const [candidateId, setCandidateID] = useState({
    candidateIdPrefix: "",
    candidateIdSuffix: "",
    candidateIdCounter: 0,
    candidateIdUseDate: false,
    candidateIdDateFormat: "YYYYMM",
    candidateIdUseRandom: false,
    candidateIdRandomLength: 3,
    candidateIdPadLength: 5,
  })

  // Job Post ID state
  const [jobPostId, setJobPostID] = useState({
    PostIdPrefix: "",
    PostIdSuffix: "",
    PostIdCounter: 0,
    PostIdUseDate: false,
    PostIdDateFormat: "YYYYMM",
    PostIdUseRandom: false,
    PostIdRandomLength: 3,
    PostIdPadLength: 5,
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  })

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return
    setSnackbar({ ...snackbar, open: false })
  }

  // Get Employee ID Setup
  const getEmpIdSetup = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/setting/get`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setEmpId(res.data.items)
    } catch (error) {
      console.error("Error fetching Employee ID setup:", error)
    }
  }

  // Get Candidate ID Setup
  const getCandidateIdSetup = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/setting/getcandidate`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setCandidateID(res.data.items)
    } catch (error) {
      console.error("Error fetching Candidate ID setup:", error)
    }
  }

  // Get Job Post ID Setup
  const getJobPostIdSetup = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/setting/getJobPostSettings`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setJobPostID(res.data.items)
    } catch (error) {
      console.error("Error fetching Job Post ID setup:", error)
    }
  }

  // Handle Employee ID Update
  const handleEmpUpdate = async () => {
    try {
      const { _id, __v, ...sanitizedPayload } = empId

      if (empId?.employeIdUseRandom) {
        sanitizedPayload.employeIdCounter = 0
      }
  
      await axios.post(`${baseUrl}/v1/api/setting/update`, sanitizedPayload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
  
      getEmpIdSetup()
      showSnackbar("Employee ID settings updated successfully!")
    } catch (error) {
      console.error("Error updating Employee ID setup:", error)
      showSnackbar("Failed to update Employee ID settings.", "error")
    }
  }
  

  // Handle Candidate ID Update
  const handleCandidateUpdate = async () => {
    try {
      const { _id, __v, ...sanitizedPayload } = candidateId

      if (candidateId?.candidateIdUseRandom) {
        sanitizedPayload.candidateIdCounter = 0
      }
      await axios.post(`${baseUrl}/v1/api/setting/updatesetting`, sanitizedPayload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      getCandidateIdSetup()
      showSnackbar("Candidate ID settings updated successfully!")
    } catch (error) {
      console.error("Error updating Candidate ID setup:", error)
      showSnackbar("Failed to update Candidate ID settings.", "error")
    }
  }

  // Handle Job Post ID Update
  const handleJobPostUpdate = async () => {
    try {
      const payload = {
        "organizationId": orgs._id,
        ...jobPostId,
      }
      if (jobPostId?.PostIdUseRandom) {
        payload.PostIdCounter = 0
      }
      await axios.post(`${baseUrl}/v1/api/setting/updateJobPostSettings`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      getJobPostIdSetup()
      showSnackbar("Job Post ID settings updated successfully!")
    } catch (error) {
      console.error("Error updating Job Post ID setup:", error)
      showSnackbar("Failed to update Job Post ID settings.", "error")
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  useEffect(() => {
    getEmpIdSetup()
    getCandidateIdSetup()
    getJobPostIdSetup()
    getOrganization()
  }, [])


  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
         <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                 display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* <DashboardIcon sx={{ fontSize: 40, color: "white" }} /> */}
              <TagIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography fontSize={19} color='white' fontWeight='bold' gutterBottom mt={1}>
                ID Setup Configuration
              </Typography>
            
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              sx={{ borderRadius: '25px' }}
              color='white'
              variant='outlined'
              onClick={() => router.push('/employeeSetup')}
            >
              <KeyboardBackspaceIcon />
            </Button>
          </Box>
        </Box>
      </Paper>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="ID setup tabs">
              <Tab label="Employee ID Setup" />
              <Tab label="Candidate ID Setup" />
              <Tab label="Job Post ID Setup" />
            </Tabs>
          </Box>

          {activeTab === 0 && 
              <>
              <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
              <TextField
                    fullWidth
                    label="Prefix"
                    value={empId.employeIdPrefix}
                    onChange={(e) =>
                      setEmpId(prev => ({
                        ...prev,
                        employeIdPrefix: e.target.value
                      }))
                    }
                  />
              </Grid>
        
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Suffix"
                  value={empId.employeIdSuffix}
                  onChange={(e) =>
                    setEmpId(prev => ({
                      ...prev,
                      employeIdSuffix: e.target.value
                    }))
                  }
                />
              </Grid>
        
              <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Starting Counter"
                disabled={empId?.employeIdUseRandom}
                value={empId.employeIdCounter ?? ''}
                onChange={(e) =>
                  setEmpId(prev => ({
                    ...prev,
                    employeIdCounter: e.target.value // keep as string
                  }))
                }
              />
              </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Pad Length"
                    value={empId.employeIdPadLength}
                    onChange={(e) => setEmpId({ ...empId, employeIdPadLength: Number(e.target.value) })}
                  />
                </Grid> */}
                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={empId.employeIdUseDate}
                        onChange={(e) => setEmpId({ ...empId, employeIdUseDate: e.target.checked })}
                      />
                    }
                    label="Use Date in ID"
                  />
                </Grid>
                {empId.employeIdUseDate && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Date Format"
                      value={empId.employeIdDateFormat}
                      onChange={(e) => setEmpId({ ...empId, employeIdDateFormat: e.target.value })}
                    >
                      {dateFormats.map((format) => (
                        <MenuItem key={format} value={format}>
                          {format}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )} */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={empId.employeIdUseRandom}
                        onChange={(e) => setEmpId({ ...empId, employeIdUseRandom: e.target.checked })}
                      />
                    }
                    label="Use Random Numbers"
                  />
                </Grid>
                {empId.employeIdUseRandom && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Random Length"
                      value={empId.employeIdRandomLength}
                      onChange={(e) => setEmpId({ ...empId, employeIdRandomLength: Number(e.target.value) })}
                    />
                  </Grid>
                )}
              </Grid>
              <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleEmpUpdate}>
                Save Employee ID Settings
              </Button>
            </>
          }
          {activeTab === 1 && 
              <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prefix"
                    value={candidateId.candidateIdPrefix}
                    onChange={(e) => setCandidateID({ ...candidateId, candidateIdPrefix: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Suffix"
                    value={candidateId.candidateIdSuffix}
                    onChange={(e) => setCandidateID({ ...candidateId, candidateIdSuffix: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Starting Counter"
                    value={candidateId.candidateIdCounter}
                    disabled={candidateId?.candidateIdUseRandom}
                    onChange={(e) => setCandidateID({ ...candidateId, candidateIdCounter: Number(e.target.value) })}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Pad Length"
                    value={candidateId.candidateIdPadLength}
                    onChange={(e) => setCandidateID({ ...candidateId, candidateIdPadLength: Number(e.target.value) })}
                  />
                </Grid> */}
                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={candidateId.candidateIdUseDate}
                        onChange={(e) => setCandidateID({ ...candidateId, candidateIdUseDate: e.target.checked })}
                      />
                    }
                    label="Use Date in ID"
                  />
                </Grid>
                {candidateId.candidateIdUseDate && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Date Format"
                      value={candidateId.candidateIdDateFormat}
                      onChange={(e) => setCandidateID({ ...candidateId, candidateIdDateFormat: e.target.value })}
                    >
                      {dateFormats.map((format) => (
                        <MenuItem key={format} value={format}>
                          {format}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )} */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={candidateId.candidateIdUseRandom}
                        onChange={(e) => setCandidateID({ ...candidateId, candidateIdUseRandom: e.target.checked })}
                      />
                    }
                    label="Use Random Numbers"
                  />
                </Grid>
                {candidateId.candidateIdUseRandom && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Random Length"
                      value={candidateId.candidateIdRandomLength}
                      onChange={(e) => setCandidateID({ ...candidateId, candidateIdRandomLength: Number(e.target.value) })}
                    />
                  </Grid>
                )}
              </Grid>
              <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleCandidateUpdate}>
                Save Candidate ID Settings
              </Button>
            </>
          }
          {activeTab === 2 &&    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Prefix"
            value={jobPostId.PostIdPrefix}
            onChange={(e) => setJobPostID({ ...jobPostId, PostIdPrefix: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Suffix"
            value={jobPostId.PostIdSuffix}
            onChange={(e) => setJobPostID({ ...jobPostId, PostIdSuffix: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Starting Counter"
            disabled={jobPostId?.PostIdUseRandom}
            value={jobPostId.PostIdCounter}
            onChange={(e) => setJobPostID({ ...jobPostId, PostIdCounter: Number(e.target.value) })}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Pad Length"
            value={jobPostId.PostIdPadLength}
            onChange={(e) => setJobPostID({ ...jobPostId, PostIdPadLength: Number(e.target.value) })}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={jobPostId.PostIdUseDate}
                onChange={(e) => setJobPostID({ ...jobPostId, PostIdUseDate: e.target.checked })}
              />
            }
            label="Use Date in ID"
          />
        </Grid>
        {jobPostId.PostIdUseDate && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Date Format"
              value={jobPostId.PostIdDateFormat}
              onChange={(e) => setJobPostID({ ...jobPostId, PostIdDateFormat: e.target.value })}
            >
              {dateFormats.map((format) => (
                <MenuItem key={format} value={format}>
                  {format}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )} */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={jobPostId.PostIdUseRandom}
                onChange={(e) => setJobPostID({ ...jobPostId, PostIdUseRandom: e.target.checked })}
              />
            }
            label="Use Random Numbers"
          />
        </Grid>
        {jobPostId.PostIdUseRandom && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Random Length"
              value={jobPostId.PostIdRandomLength}
              onChange={(e) => setJobPostID({ ...jobPostId, PostIdRandomLength: Number(e.target.value) })}
            />
          </Grid>
        )}
      </Grid>
      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleJobPostUpdate}>
        Save Job Post ID Settings
      </Button>
    </>}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
    </Container>
  )
}
