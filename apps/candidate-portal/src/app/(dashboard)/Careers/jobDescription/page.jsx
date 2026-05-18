'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  Button,
  Modal,
  CardContent,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import Lottie from 'lottie-react';
import analyzingAnimation from '../lottie.json';
import { green, red, grey } from '@mui/material/colors';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowBack } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';

export default function jobDescription() {
  const [jobDesc, setJobDesc] = useState({})
  const token = window.localStorage.getItem("authToken")
  const router = useRouter();
  const [eligibilityFail, setEligibilityFail] = useState(undefined)
  const [eligibilityPass, setEligibilityPass] = useState(undefined)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [applyModal, setApplyModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})
  const [isExperienced, setIsExperienced] = useState(false); 
  const [uploading, setUpLoading] = useState(false)
  const [resumeUrl, setResumeUrl] = useState("")
  const [resumeFileName, setResumeFileName] = useState('')
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const {verification} = useAuth();
  const [saved, setSaved] = useState(false)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    });

    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
      };

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    emailId: '',
    highestQualification: '',
    university: '',
    graduationYear: '',
    cgpa: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    skills: '',
    resume: '',
    preferedInterviewMode: '',
    position: '',
    departmentId: '',
    branchId: '',
    knewaboutJobPostFrom: '',
    currentDesignation: '',
    lastOrganization: '',
    startDate: '',
    endDate: '',
    reasonLeaving: '',
    totalExperience: 0,
    currentCTC: 0,
    currentLocation: '',
    preferredLocation: '',
    gapIfAny: '',
    employeUniqueId: '',
    jobPostId: '',
    jobFormType: 'request'
  });

  const handleResumeUpload = async (file) => {
    if (!file) {
      console.error("❌ Resume file is missing.");
      return;
    }
  
    setUpLoading(true);
  
    try {
      const fileFormData = new FormData();
      fileFormData.append("file", file); 
  
      const response = await axios.post(
        `${baseUrl}/v1/api/upload/uploadSingle`,
        fileFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      const resumeUrl = response?.data?.url;
  
      if (response.data.success) {
        setResumeUrl(resumeUrl);
        return resumeUrl;
      } else {
        console.error("❌ Resume upload failed: Invalid response.");
      }
    } catch (error) {
      console.error("❌ Error uploading resume:", error);
    } finally {
      setUpLoading(false);
    }
  };
  

  const getProfile = async () => {
    try {
        const res = await axios.get(`${baseUrl}/v1/api/Auth/viewprofile`, {
          headers: {
            'Content-Type': 'application/json',
             authorization: token
          }
        })

              if (res.data.status) {
                const data = res.data.items;
          
                setFormData({
                  name: data.userName || '',
                  mobileNumber: data.mobileNumber || '',
                  emailId: data.email || '',
                  highestQualification: data.education?.[0]?.degree || '',
                  university: data.education?.[0]?.university || '',
                  graduationYear: data.education?.[0]?.yearOfPassing || '',
                  cgpa: data.education?.[0]?.finalScore || '',
                  address: `${data.profile_Info?.address1 || ''} ${data.profile_Info?.address2 || ''}`.trim(),
                  state: data.profile_Info?.state || '',
                  city: data.profile_Info?.city || '',
                  pincode: data.profile_Info?.pincode || '',
                  skills: data.skills?.join(', ') || '',
                  resume: data.resume || '',
                  preferedInterviewMode: data.jobPreferences?.jobType || '',
                  position: data.professional_Experience?.[0]?.title || '',
                  departmentId: '', 
                  branchId: '',     
                  knewaboutJobPostFrom: data.jobAlerts?.[0] || '',
                  currentDesignation: data.professional_Experience?.[0]?.currentEmployer || '',
                  lastOrganization: data.professional_Experience?.[0]?.organization || '',
                  startDate: data.professional_Experience?.[0]?.startDate?.slice(0, 10) || '',
                  endDate: data.professional_Experience?.[0]?.endDate?.slice(0, 10) || '',
                  reasonLeaving: data.professional_Experience?.[0]?.description || '',
                  totalExperience: 0, 
                  currentCTC: data.currentCTC || 0,
                  currentLocation: data.professional_Experience?.[0]?.city || '',
                  preferredLocation: data.jobPreferences?.preferredLocations?.[0] || '',
                  gapIfAny: '', // Not found in response
                  employeUniqueId: data._id || '',
                  jobPostId: '', // Not found in response
                  jobFormType: 'request'
                });
              
        }
    } catch (error) {
        console.error("error",error)
    }
}

  const getAllJobs = async () => {
    try {
        const res = await axios.get(`${baseUrl}/v1/api/jobPost/getAllJobPost`, {
          headers: {
            'Content-Type': 'application/json',
             authorization: token
          }
        })
        if(res.data.status){
              setJobDesc(res.data.items.filter(i=>i._id===id)[0])
          }
      } catch (error) {
          console.error("error",error)
      }
  }

// const getSavedStatus = async () => {
//   try {
//     const res = await axios.get(`${baseUrl}/v1/api/jobSave/get?userId=${verification?._id}`, {
//       headers: {
//         'Content-Type': 'application/json',
//          authorization: token
//       }
//     })
//     if(res.data.status){
//       setSaved(res.data.items.some(i => i.jobPostId._id === id));
//     }
// } catch (error) {
//     console.error("error",error)
// }
// }

useEffect(()=>{
  getProfile()
  getAllJobs()
},[id])

  const handleApply = (row) => {
    setApplyModal(true);
    setSelectedJob(row);
    setFormData(prev => ({
      ...prev,
      position: row.position || '',
      departmentId: row.department?._id || '',
      branchId: row.branch.map(i=>i._id) || '',
      jobPostId: row._id || '',
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setEligibilityFail(undefined);
    setEligibilityPass(undefined);
    try {
      const { isOtherKnewAbout, isOtherQualification, isOtherExperience, ...sanitizedData } = formData;
  
      const res = await axios.post(`${baseUrl}/v1/api/job/jobapply`, sanitizedData, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      if(res.data.status){
        setEligibilityPass(res.data.items)
      }
      else{
        setEligibilityFail(res.data.message)
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (row) => {
    try {
      const payload = {
      userId:verification._id,
      jobPostId:row._id
      }
      const res = await axios.post(`${baseUrl}/v1/api/jobSave/addAndRemove`, payload, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      if(res.data.status){
        getSavedStatus()
        getAllJobs()
        setSnackbar({
          open:true,
          message:res.data.message,
          severity:"success"
        })
      }
    } catch (error) {
      console.error("error", error);
    } 
  }

  console.log("jobDesc",jobDesc)

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <IconButton sx={{mt:-2, mb:2}} onClick={()=>router.push("/Careers")}>
      <ArrowBack fontSize='medium' color='#66b2ff' fontWeight={600}/>
      </IconButton>
    <Box sx={{ mb: 3, display:"flex", justifyContent:"space-between", width:"100%" }}>
      <Card sx={{ p: 4, width:"100%", display:'flex', justifyContent:"space-between", alignItems:"center" }}>
        <Box>
        <Typography variant="h5" fontWeight="bold">{jobDesc?.position || "-"}</Typography>
        <Typography>{jobDesc?.branch ? jobDesc?.branch?.map(b => b.name.toUpperCase()).join(', ') : jobDesc?.branchId ? jobDesc?.branchId?.map(b => b.name.toUpperCase()).join(', ') : "-"}</Typography>
        </Box>
     
      <Box sx={{display:"flex", gap:3}}>
        <Button variant="contained" size="medium" sx={{bgcolor:"#66b2ff",  "&.Mui-disabled": {bgcolor: "#bdbdbd", color: "#fff"}}}  onClick={()=>handleApply(jobDesc)}>
          Apply for this job
        </Button>
       <Button variant="contained" size="medium" color={saved ? "error" : "success"} onClick={()=>handleSave(jobDesc)}>
         {saved ? "Remove Job" : "Save Job"}
        </Button>
      </Box>
      </Card>
      {/* <Button variant='outlined' size='small' sx={{width:"70px", height:"40px"}} onClick={()=>router.push("/Careers")}>Back</Button> */}
    </Box>

    {/* jobDesc Card */}
    <Card sx={{ p: 4 }}>
      <Grid container spacing={4}>
      <Grid item xs={6} sm={4}>
          <Typography fontWeight="bold">Job Type</Typography>
          <Typography>{jobDesc?.employeeType ? jobDesc?.employeeType?.title : jobDesc?.employeeTypeId ? jobDesc?.employeeTypeId?.title : "-"}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography fontWeight="bold">Department</Typography>
          <Typography>{jobDesc?.department ? jobDesc?.department?.name : jobDesc?.departmentId ? jobDesc?.departmentId?.name : "-"}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography fontWeight="bold">Experience</Typography>
          <Typography>{jobDesc?.experience || "-"}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography fontWeight="bold">Qualification</Typography>
          <Typography>{jobDesc?.qualification?.map(i=> i.name).join(" , ") || "-"}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography fontWeight="bold">Package</Typography>
          <Typography>{jobDesc?.package && jobDesc?.package!=="0" ? `${jobDesc?.package} (LPA)`  : "-"}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography fontWeight="bold">Employment Type</Typography>
          <Typography>{jobDesc?.employmentType ? jobDesc?.employmentType.title.toUpperCase() : jobDesc?.employmentTypeId ? jobDesc?.employmentTypeId.title.toUpperCase() : "-"}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography fontWeight="bold">No. of Positions</Typography>
          <Typography>{jobDesc?.noOfPosition || "-"}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography fontWeight="bold">Address</Typography>
          <Typography>{jobDesc?.branch ? jobDesc?.branch?.map(b => b.address.toUpperCase()).join(', ') : jobDesc?.branchId ? jobDesc?.branchId?.map(b => b.address.toUpperCase()).join(', ') :  "-"}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Box>
        <Typography variant="h6" fontWeight="bold">Job Description</Typography>

        {/* Job Summary */}
        <Box mt={2}>
          <Typography fontWeight="medium">Job Summary</Typography>
          <Typography mt={0.5}>
            {jobDesc?.jobDescription?.jobDescription?.JobSummary || 'N/A'}
          </Typography>
        </Box>

                {/* Roles and Responsibilities */}
                <Box mt={2}>
          <Typography fontWeight="medium">Roles and Responsibilities</Typography>
          <ul style={{ marginTop: 4, paddingLeft: 20 }}>
            {(jobDesc?.jobDescription?.jobDescription?.RolesAndResponsibilities || []).map((role, index) => (
              <li key={index}>
                <Typography component="span">{role}</Typography>
              </li>
            ))}
          </ul>
        </Box>

        {/* Key Skills */}
        <Box mt={2}>
          <Typography fontWeight="medium">Key Skills</Typography>
          <ul style={{ marginTop: 4, paddingLeft: 20 }}>
            {(jobDesc?.jobDescription?.jobDescription?.KeySkills || []).map((skill, index) => (
              <li key={index}>
                <Typography component="span">{skill}</Typography>
              </li>
            ))}
          </ul>
        </Box>
      </Box>

    </Card>
            {/* Modal */}
            <Modal open={applyModal} onClose={() => setApplyModal(false)}>
          <Box sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#fff',
            p: 4,
            borderRadius: 3,
            width: { xs: '90%', sm: 600 },
            boxShadow: 24,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <Typography variant="h6" fontWeight={700} align="center" sx={{ mb: 2 }}>
              Apply for: <span style={{ color: '#1976d2' }}>{selectedJob.position}</span>
            </Typography>
    
    
            <Grid container justifyContent="center" sx={{ mb: 2 }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{ px: 5, py: 1.5, borderRadius: 2, backgroundColor: '#2e7d32' }}
              >
                Check Eligibility
              </Button>
            </Grid>
    
            {loading && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Lottie animationData={analyzingAnimation} style={{ height: 100 }} />
                <Typography variant="body2" sx={{ mt: -2, color: grey[600] }}>
                  Analyzing your eligibility...
                </Typography>
              </Box>
            )}
    
            {eligibilityFail && (
              <Card sx={{ mt: 3, backgroundColor: red[50], p: 2, textAlign: "center" }}>
                <CardContent>
                  <ErrorIcon color="error" fontSize="large" />
                  <Typography variant="h6" color={red[700]} fontWeight={700} sx={{ mb: 1 }}>
                    {eligibilityFail === "You can reapply for any job only after 2 months from your last application." ?
                      "Application Temporarily Restricted" : "Oops! You're not eligible"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {eligibilityFail === "You can reapply for any job only after 2 months from your last application." ?
                      "In accordance with our policy, you may reapply for job opportunities after a waiting period of two months from your last application." :
                      eligibilityFail.replace(/^AI screening failed:\s*/i, '')}
                  </Typography>
                  <Button sx={{mt:2, borderRadius:"18px"}} variant='outlined' color='error' onClick={()=>{setApplyModal(false); setEligibilityFail(undefined)}}>Close</Button>
                </CardContent>
              </Card>
            )}
    
            {eligibilityPass && (
              <Card sx={{ mt: 3, backgroundColor: green[50], p: 2 ,textAlign: "center" }}>
                <CardContent>
                  <CheckCircleIcon color="success" fontSize="large" />
                  <Typography variant="h6" color={green[700]} fontWeight={700} sx={{ mb: 1 }}>
                    Congratulations! 🎉
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your application has been submitted successfully. We wish you the best in your journey!
                  </Typography>
                  <Button sx={{mt:2, borderRadius:"18px"}} variant='outlined' color='success' onClick={()=>{setApplyModal(false); setEligibilityPass(undefined)}}>Close</Button>
                </CardContent>
              </Card>
            )}
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
  </Box>
  )
}
