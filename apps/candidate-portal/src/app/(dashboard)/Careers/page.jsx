'use client'

import {
  Container, Box, Typography, Card,
  Grid, TextField, MenuItem,
  IconButton,CardContent,Divider, Avatar, useTheme, Tooltip
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import JobDescription from './jobDescription/page';
import { ExpandMore, ExpandLess, DashboardCustomizeRounded, DashboardTwoTone } from '@mui/icons-material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from "next/navigation"
import DashboardIcon from "@mui/icons-material/Dashboard"

const colors = {
  totalJobs: '#DCEEFF',           
  activeJobs: '#C8E6C9',      
  inactiveJobs: '#FFCDD2',        
  totalPositions: '#FFE0B2',      
};

const icons = {
  totalJobs: <WorkOutlineIcon color="primary" fontSize='large'/>,
  activeJobs: <CheckCircleOutlineIcon color="success" fontSize='large'/>,
  inactiveJobs: <DoDisturbOnOutlinedIcon color="error" fontSize='large'/>,
  totalPositions: <PeopleOutlineIcon sx={{ color: '#FB8C00' }} fontSize='large'/>,
};

export default function JobPost() {
  const [jobs, setJobs] = useState([])
  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [row, setRow] = useState({})
  const [jd, setJd] = useState(false)
  const theme = useTheme();
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [jobsType, setJobsType] = useState("all");
  const [filters, setFilters] = useState({
    jobTitle:"",
    departmentId:"",
    employmentTypeId:"",
    branchIds:""
  })

  const { verification } = useAuth()
  const [savedJobs, setSavedJobs] = useState([])

  const [activeIndex, setActiveIndex] = useState(0);   
  const getAllJobs = async () => {
      try {
          const res = await axios.get(`${baseUrl}/v1/api/jobPost/getAllJobPost?jobTitle=${filters.jobTitle}&departmentId=${filters.departmentId}&employmentTypeId=${filters.employmentTypeId}&branchIds=${filters.branchIds}`, {
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
  const getSavedJobs = async () => {
    try {
        const res = await axios.get(`${baseUrl}/v1/api/jobSave/get?userId=${verification?._id}`, {
          headers: {
            'Content-Type': 'application/json',
             authorization: token
          }
        })
        if(res.data.status){
              setSavedJobs(res.data.items.map(i=>i.jobPostId))
        }
    } catch (error) {
        console.error("error",error)
    }
}

//   const getProfile = async () => {
//     try {
//         const res = await axios.get(`${baseUrl}/v1/api/Auth/viewprofile`, {
//           headers: {
//             'Content-Type': 'application/json',
//              authorization: token
//           }
//         })

//               if (res.data.status) {
//                 const data = res.data.items;
          
//                 setFormData({
//                   name: data.userName || '',
//                   mobileNumber: data.mobileNumber || '',
//                   emailId: data.email || '',
//                   highestQualification: data.education?.[0]?.degree || '',
//                   university: data.education?.[0]?.university || '',
//                   graduationYear: data.education?.[0]?.yearOfPassing || '',
//                   cgpa: data.education?.[0]?.finalScore || '',
//                   address: `${data.profile_Info?.address1 || ''} ${data.profile_Info?.address2 || ''}`.trim(),
//                   state: data.profile_Info?.state || '',
//                   city: data.profile_Info?.city || '',
//                   pincode: data.profile_Info?.pincode || '',
//                   skills: data.skills?.join(', ') || '',
//                   resume: data.resume || '',
//                   preferedInterviewMode: data.jobPreferences?.jobType || '',
//                   position: data.professional_Experience?.[0]?.title || '',
//                   departmentId: '', // No mapping found in response
//                   branchId: '',     // No mapping found in response
//                   knewaboutJobPostFrom: data.jobAlerts?.[0] || '',
//                   currentDesignation: data.professional_Experience?.[0]?.currentEmployer || '',
//                   lastOrganization: data.professional_Experience?.[0]?.organization || '',
//                   startDate: data.professional_Experience?.[0]?.startDate?.slice(0, 10) || '',
//                   endDate: data.professional_Experience?.[0]?.endDate?.slice(0, 10) || '',
//                   reasonLeaving: data.professional_Experience?.[0]?.description || '',
//                   totalExperience: 0, 
//                   currentCTC: data.currentCTC || 0,
//                   currentLocation: data.professional_Experience?.[0]?.city || '',
//                   preferredLocation: data.jobPreferences?.preferredLocations?.[0] || '',
//                   gapIfAny: '', // Not found in response
//                   employeUniqueId: data._id || '',
//                   jobPostId: '', // Not found in response
//                   jobFormType: 'request'
//                 });
              
//         }
//     } catch (error) {
//         console.error("error",error)
//     }
// }


  useEffect(()=>{
     getAllJobs()
  },[filters])
  useEffect(()=>{
    getSavedJobs()
 },[verification])

  
    const [depts, setDepts] = useState([])

    const getDepartment = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/newdepartment/newdeparmentList`, {
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

      const cards = [
        { label: 'All jobs', count: jobs.length},
        { label: 'Saved jobs', count: savedJobs.length },
      ];

    const columns = [
        {
          field: 'position',
          headerName: 'Job Title',
          width: 210,
          renderCell: (params) => (
            <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
            <Typography fontSize={14}>{params.value}</Typography>
            </Box>
          )
        },
        { field: 'department', headerName: 'Department', width: 210,          
            renderCell: (params) => (
            <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
            <Typography fontSize={14}>{params?.row?.department?.name || "-"}</Typography>
            </Box>
          ) },
        { field: 'branch', headerName: 'Branches', width: 170,
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
        { field: 'noOfPosition', headerName: 'Positions', width: 100 , align:"center" , headerAlign:"center" },
        { field: 'package', headerName: 'Package', width: 120,
          renderCell: (params) => (
              <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
              <Typography fontSize={14}>{params.row?.package && params.row?.package!=="0" ? `${params.row?.package}`  : "-"}</Typography>
              </Box>
            )
        },
        { field: 'employmentType', headerName: 'Employment Type', width: 170,
            renderCell: (params) => (
                <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
                <Typography fontSize={14}>{ params.row?.employmentType?.title.toUpperCase() || "-"}</Typography>
                </Box>
              )
         },
      ];
    
      const SavedColumns = [
        {
          field: 'position',
          headerName: 'Job Title',
          width: 220,
          renderCell: (params) => (
            <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
            <Typography fontSize={14}>{params.value}</Typography>
            </Box>
          )
        },
        { field: 'departmentId', headerName: 'Department', width: 220,          
            renderCell: (params) => (
            <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
            <Typography fontSize={14}>{params?.row?.departmentId?.name || "-"}</Typography>
            </Box>
          ) },
        { field: 'branchId', headerName: 'Branches', width: 220,
            renderCell: (params) => (
                <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
                <Typography fontSize={14}>{ params.row.branchId?.map(b => b.name.toUpperCase()).join(', ') || "-"}</Typography>
                </Box>
              )
         },
        { field: 'noOfPosition', headerName: 'Positions', width: 130 },
        { field: 'employmentTypeId', headerName: 'Employment Type', width: 180,
            renderCell: (params) => (
                <Box sx={{height:"100%", display:"flex", alignItems:"center"}}> 
                <Typography fontSize={14}>{ params.row?.employmentTypeId?.title.toUpperCase() || "-"}</Typography>
                </Box>
              )
         },
        { field: 'experience', headerName: 'Experience on', width: 140 },

      ];

    return (
    <Box>
         {!jd && <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-around',
        backgroundColor: '#f8f9fc',
        alignItems:"center",
        py: 2,
        mb: 2,
      }}
    >
           {cards.map((card, index) => (
        <Box
          key={index}
          onClick={() => {setActiveIndex(index);
            if(index===0){
              setJobsType("all")
            }
            else if(index===1){
              setJobsType("saved")
            }
          }}
          sx={{
            backgroundColor: '#e6d6f3',
            width: '30%',
            textAlign: 'center',
            py: 3,
            borderRadius: 2,
            cursor: 'pointer',
            boxShadow: activeIndex === index ? '0px 2px 8px rgba(0,0,0,0.08)' : 'none',
            borderBottom: activeIndex === index ? '4px solid #1d1b86' : '4px solid transparent',
          }}>
            <Typography fontSize={24} fontWeight={700} color="#1d1b86">
            {card.count}
          </Typography>
          <Typography fontSize={14} mt={0.5} color="#374151">
            {card.label}
          </Typography>
        </Box>
      ))}
    <Tooltip title="Go to Dashboard" arrow>
      <Avatar sx={{ bgcolor: '#1976d2', width: 50, height: 50 }}>
          <IconButton onClick={() => router.push("/Careers/jobPostDashboard")}>
            <DashboardIcon sx={{ color: 'white' }} />
          </IconButton>
        </Avatar>
    </Tooltip>   
     </Box>}
    {jobsType==="all" ? 
    (!jd ? <Container maxWidth="lg"> 

       <Card sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{display:"flex", justifyContent:"space-between",width:"100%", alignItems:"center"}}>
            <Typography fontWeight={600} fontSize={16} mb={2}>Search for jobs</Typography>
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
                {depts?.map(i=><MenuItem  key={i._id} value={i._id}>{i.name}</MenuItem>)}
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
            <Typography fontSize={12} color="text.secondary" mb={2}>
              Thanks for checking out our job openings. If you don’t see any open positions, please submit your resume & we will get back to you if there are any suitable openings that match your profile. <a href="#" style={{ color: '#1d1b86' }}>apply here</a>
            </Typography>
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
                  onCellClick={(row) => {router.push(`/Careers/jobDescription?id=${row.id}`)}}
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
      </Container>  : <JobDescription row={row} setJd={setJd} id={verification._id} activeIndex={activeIndex} setActiveIndex={setActiveIndex} jobsType={jobsType} setJobsType={setJobsType}/>):<Box>
      <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography fontSize={16} fontWeight={600} sx={{ mb: 1 }}>Saved Jobs</Typography>
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={savedJobs}
                columns={SavedColumns}
                pageSize={5}
                hideFooterSelectedRowCount
                getRowId={(row)=>row._id}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                  }
                onCellClick={(row) => {router.push(`/Careers/jobDescription?id=${row.id}`)}}
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
        </Box>}
      </Box> 
    );
    
}
