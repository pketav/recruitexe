'use client'

import {
  Container, Box, Typography, Button, Modal, Card, CardContent,
  Grid, CircularProgress, TextField, MenuItem,
  IconButton, useTheme, useMediaQuery
} from '@mui/material';
import {Tabs, Tab } from '@mui/material'
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import analyzingAnimation from './lottie.json';
import { green, red, grey } from '@mui/material/colors';
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import JobDescription from "../CareerPage/[CareerPage]/jobDescription/page"
import axios from 'axios';

export default function JobPost() {
  const [jobs, setJobs] = useState([])
  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [applyModal, setApplyModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})
  const [isExperienced, setIsExperienced] = useState(false); 
  const [uploading, setUpLoading] = useState(false)
  const [resumeUrl, setResumeUrl] = useState("")
  const [resumeFileName, setResumeFileName] = useState('')
  const router = useRouter();
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [row, setRow] = useState({})
  const [jd, setJd] = useState(false)
  const [eligibilityFail, setEligibilityFail] = useState(undefined)
  const [eligibilityPass, setEligibilityPass] = useState(undefined)


  const [filters, setFilters] = useState({
    jobTitle:"",
    departmentId:"",
    employmentTypeId:"",
    branchIds:""
  })
  const [formData, setFormData] = useState({
      name: '',
      mobileNumber: '',
      emailId: '',
      highestQualification: '',
      university: '',
      // graduationYear: '',
      // cgpa: '',
      address: '',
      state: '',
      city: '',
      pincode: '',
      skills: '',
      resume: '',
      preferedInterviewMode: '',
      position: '',
      // departmentId: '',
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
      internalReferenceName:'',
      // preferredLocation: '',
      gapIfAny: '',
      // employeUniqueId: '',
      jobPostId: '',
      // jobFormType: 'request',
      agreePrivacyPolicy:false,
      immediatejoiner:false
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
    
    
  const getAllJobs = async () => {
      try {
          const res = await axios.get(`${baseUrl}/v1/api/jobPost/getAllJobPost?jobTitle=${filters.jobTitle}&departmentId=${filters.departmentId}&employmentTypeId=${filters.employmentTypeId}&branchIds=${filters.branchIds} `, {
            headers: {
              'Content-Type': 'application/json',
               authorization: token
            }
          })
          if(res.data.status){
                setJobs(res.data.items)
             
          }
      } catch (error) {
          console.error("error",error)
      }
  }

  useEffect(()=>{
     getAllJobs()
  },[filters])


    const [loading, setLoading] = useState(false);

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
        getAllJobs();
      }
    };
    const [depts, setDepts] = useState([])

    const getDepartment = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/newdepartment/newdeparment`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });
          setDepts(res.data.items || []);
        } catch (error) {
          console.error('Error fetching holidays:', error);
        }
      };

      const [branches, setBranches] = useState([])
      const getAllBranch = async () =>{
        try {
            const res = await axios.get(`${baseUrl}/v1/api/branch/getAll`, {
              headers: {
                'Content-Type': 'application/json',
                 authorization: token
              }
            })
            if(res.data.status){
              setBranches(res.data.items)
            }
        } catch (error) {
            console.error("error",error)
        }
      }
      const [employementType, setemploymentType] = useState([])
      const getemploymentTypes = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/employmentType/getAllEmploymentType`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });
          setemploymentType(res.data.items || []);
        } catch (error) {
          console.error('Error fetching holidays:', error);
        }
      };

      useEffect(()=>{
      getDepartment()
      getAllBranch()
      getemploymentTypes()
      },[])

    const columns = [
        {
          field: 'position',
          headerName: 'Job Title',
          width: 200,
          renderCell: (params) => (
            <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
            <Typography fontSize={14}>{params.value}</Typography>
            </Box>
          )
        },
        { field: 'department', headerName: 'Department', width: 200,          
            renderCell: (params) => (
            <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
            <Typography fontSize={14}>{params?.row?.department?.name || "-"}</Typography>
            </Box>
          ) },
        { field: 'branch', headerName: 'Branches', width: 200,
            renderCell: (params) => (
                <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
                <Typography fontSize={14}>{ params.row.branch?.map(b => b.name.toUpperCase()).join(', ') || "-"}</Typography>
                </Box>
              )
         },
         { field: 'experience', headerName: 'Experience', width: 100, align:"center", headerAlign:"center",renderCell: (params) => (
            <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
            <Typography fontSize={14}>{params.row?.experience!=="Fresher" ? `${params.row?.experience} Years`  : params.row?.experience}</Typography>
            </Box>
          ) },
        { field: 'noOfPosition', headerName: 'Positions', width: 110 },
        { field: 'package', headerName: 'Package', width: 110,
            renderCell: (params) => (
                <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
                 <Typography fontSize={14}>{params.row?.package && params.row?.package!=="0" ? `${params.row?.package} (LPA)`  : "-"}</Typography>
                </Box>
              )
          },
        { field: 'employmentType', headerName: 'Employment Type', width: 150,
            renderCell: (params) => (
                <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
                <Typography fontSize={14}>{ params.row?.employmentType?.title.toUpperCase() || "-"}</Typography>
                </Box>
              )
         },
      ];
    const [tab, setTab] = useState(0)

    return (

  <Box>
<Box
  sx={{
    backgroundColor: '#1d1b86',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
  }}
>

  <Box sx={{ display: 'flex', alignItems: 'center', gap: isMdDown ? 1 : 3 }}>
  <img src='/logo.png' alt='company logo' style={{ height: '50px', width: '50px' }} />

  <Tabs
    value={tab}
    onChange={(e, val) => {
      setTab(val)
      if (val === 0) router.push('/CareerPage')
    }}
    textColor='inherit'
    TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
    sx={{
      '& .MuiTab-root': {
        minWidth: isMdDown ? 80 : 140,
        fontSize: isMdDown ? 12 : 14
      }
    }}
  >
    <Tab label='Careers' sx={{ color: 'white', textTransform:"none"  }} />
  </Tabs>
</Box>


</Box>

{!jd ? <Container maxWidth="lg" sx={{ my: 2 }}>
        <Card sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{display:"flex", justifyContent:"space-between",width:"100%", alignItems:"center"}}>
            <Typography fontWeight={600} fontSize={16} mb={2}>Search for jobllls</Typography>
            <IconButton onClick={()=>setFilters({
                   jobTitle:"",
                   departmentId:"",
                   employmentTypeId:"",
                   branchIds:""
            })}><RefreshIcon fontSize="medium" color='primary'/></IconButton>
            </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth label="Search by Job Title" variant="outlined" size="small" value={filters.jobTitle} onChange={(e)=>setFilters((prev)=>({
                ...prev,
                jobTitle:e.target.value
                }))}/>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth select label="Department" size="small" value={filters.departmentId} onChange={(e)=>setFilters((prev)=>({
                ...prev,
                departmentId:e.target.value
                }))}>
                    {Array.isArray(depts) && depts.map((i) => (
                    <MenuItem key={i._id} value={i._id}>
                        {i.name}
                    </MenuItem>
                    ))}              
                    </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth select label="Branch" size="small" value={filters.branchIds} onChange={(e)=>setFilters((prev)=>({
                ...prev,
                branchIds:e.target.value
                }))}>
                {branches.map(i=><MenuItem  key={i._id} value={i._id}>{i.name}</MenuItem>)}
              </TextField>
            </Grid>
            {/* <Grid item xs={6} sm={3} md={2}>
              <TextField fullWidth label="From" type='number' value={filters.experienceFrom} onChange={(e)=>setFilters((prev)=>({
                ...prev,
                experienceFrom:e.target.value
                }))} size="small" />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
                <TextField
                    fullWidth
                    label="To"
                    size="small"
                    type="number"
                    value={filters.experienceTo}
                    onChange={(e) => {
                    const newTo = Number(e.target.value);
                    setFilters((prev) => ({
                        ...prev,
                        experienceTo: newTo,
                    }));
                    }}
                    inputProps={{
                    min: filters.experienceFrom || 0,
                    }}
                />
                </Grid> */}

            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth select label="Employment Type" size="small" value={filters.employmentTypeId} onChange={(e)=>setFilters((prev)=>({
                ...prev,
                employmentTypeId:e.target.value
                }))}>
                {employementType.map(i=><MenuItem  key={i._id} value={i._id}>{i.title}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </Card>

        {/* Jobs Table */}
        <Box sx={{ mt: 2 }}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography fontSize={16} fontWeight={600} sx={{ mb: 1 }}>Current Openings</Typography>
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={jobs}
                columns={columns}
                pageSize={5}
                hideFooterSelectedRowCount
                getRowId={(row)=>row._id}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                  }
                onCellClick={(row)=>{setJd(true); setRow(row)}}
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
          </Card>
        </Box>
      </Container>  : <JobDescription row={row} setJd={setJd}/>}
    
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
    
            <Typography fontSize={14} color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              {selectedJob.jobDescription}
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
              <Card sx={{ mt: 3, backgroundColor: red[50], p: 2 }}>
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
                </CardContent>
              </Card>
            )}
    
            {eligibilityPass && (
              <Card sx={{ mt: 3, backgroundColor: green[50], p: 2 }}>
                <CardContent>
                  <CheckCircleIcon color="success" fontSize="large" />
                  <Typography variant="h6" color={green[700]} fontWeight={700} sx={{ mb: 1 }}>
                    Congratulations! 🎉
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your application has been submitted successfully. We wish you the best in your journey!
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Modal>
      </Box> 
    );
    
}
