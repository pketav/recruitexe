'use client'

import { Container, Box, Button, Modal, Typography, Grid, TextField, MenuItem,Paper,Stack , Dialog, DialogActions, DialogContent, DialogTitle, Divider, Link, Chip, Snackbar, Alert} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'


export default function RecruitmentPipeline() {
    const [candidates, setCandidates] = useState([])
    const token = window.localStorage.getItem("authToken")
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const [desc, setDesc] = useState("")
    const [openDesc, setOpenDesc] = useState(false)
    const [selectedCandidate, setSelectedCandidate] = useState({})
    const [scheduleModal,setScheduleModal] = useState(false)
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalItems, setTotalItems] = useState(0)
    const [employees, setEmployees] = useState([])
    const [department, setDepartment] = useState([])
    const [status, setStatus] = useState("managerReview")
    const [remarkModal, setRemarkModal] = useState(false)
    const [statusData, setStatusData] = useState({
        ids:[],
        status:"",
        reason:""
    })

    const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success',
      });
    const [profileCandidate, setProfileCandidate] = useState(null);
    const [openProfileModal, setOpenProfileModal] = useState(false);

    const handleViewProfile = (rowData) => {
      setProfileCandidate(rowData);
      setOpenProfileModal(true);
    };

    const [offerLetterModal, setOfferLetterModal] = useState(false)
    const [candidateForOffer, setCandidateForOffer] = useState({
      jobId: "",
      package: 0,
      dateOfJoining: "",
      company: "",
      position: "",
      PF: "no",      
      ESIC: "no"   
    })
    const [offerLetterChoice, setOfferLetterChoice] = useState(1)
    const [CTC, setCTC] = useState("0")
    const [sendOfferData, setSendOfferData] = useState({
      Id: "",               
      sendTo: "",                       
      reportingManagerId: "",   
      branchId: "",
      company: "",
      constCenterId: "",
      designationId: "",
      employeeTypeId: "",
      employementTypeId: "",
      roleId: ["681ce870eebde2ec5f5e4d39"],
      workLocationId: "",                
      departmentId: "",
      subDepartmentId: "",
      secondaryDepartmentId: "",
      seconSubDepartmentId:""
    })
    const [sendOfferLetterModal,setSendOfferLetterModal] = useState(false)

    const handleDesc = (value) => {
        setDesc(value)
        setOpenDesc(true)
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return '-';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    };
    
    const InfoBlock = ({ label, value }) => (
      <Grid item xs={6}>
        <Typography variant="subtitle2" fontWeight={600}>{label}</Typography>
        <Typography sx={{ fontSize: '0.95rem' }} color="text.secondary">{value || '-'}</Typography>
      </Grid>
    );
    
    const Section = ({ title, children }) => (
      <>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" fontWeight={700}>{title}</Typography>
          <Divider sx={{ mb: 1 }} />
        </Grid>
        {children}
      </>
    );
        
    
    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
      };

    const [companies, setCompanies] = useState([]);
    const getCompany = async () => {
      try {
        const res = await axios.get(`${baseUrl}/v1/api/company/get`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        });
        setCompanies(res.data.items);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

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
    const getAllDepartment = async () =>{
      try {
          const res = await axios.get(`${baseUrl}/v1/api/newdepartment`, {
            headers: {
              'Content-Type': 'application/json',
               authorization: token
            }
          })
          if(res.data.status){
              setDepartment(res.data.items.filter(i=>i.isActive===true) || []);

          }
      } catch (error) {
          console.error("error",error)
      }
  }
  const [subDepts, setSubDepts] = useState([])
  const getSubDepartment = async (id) =>{
    try {
        const res = await axios.get(`${baseUrl}/v1/api/newdepartment/sub/${id}`, {
          headers: {
            'Content-Type': 'application/json',
             authorization: token
          }
        })
        if(res.data.status){
            setSubDepts(res.data.items)
        }
    } catch (error) {
        console.error("error",error)
    }
}
const [branches, setBranches] = useState([])
const getAllBranch = async () =>{
  try {
      const res = await axios.get(`${baseUrl}/v1/api/branch/getList`, {
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

const [costCenters, setCostCenters] = useState([])
const getAllCostCenter = async () =>{
  try {
      const res = await axios.get(`${baseUrl}/v1/api/costcenter/getAllCostCenter`, {
        headers: {
          'Content-Type': 'application/json',
           authorization: token
        }
      })
      if(res.data.status){
        setCostCenters(res.data.items)
      }
  } catch (error) {
      console.error("error",error)
  }
}
const [designations, setDesignations] = useState([])
const getDesignation = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/designation/getAll`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      setDesignations(res.data.items || []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };
  const [employeeType, setEmployeeType] = useState([])
const getemployeeType = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/employeType/getAllEmployeType`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      setEmployeeType(res.data.items || []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  const [employementType, setemploymentType] = useState([])
  const getemploymentTypes = async () => {
      try {
        const res = await axios.get(`${baseUrl}/v1/api/employmentType/getAllListEmploymentType`, {
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

    const [workLocations, setWorkLocations] = useState([])
    const getAllWorkLocations = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/workLocation/getAll`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });
          setWorkLocations(res.data.items || []);
        } catch (error) {
          console.error('Error fetching holidays:', error);
        }
      };


    const [roles, setRoles] = useState([])
    const getAllRoles = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/role/getAllRole`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });
          setRoles(res.data.items || []);
        } catch (error) {
          console.error('Error fetching holidays:', error);
        }
      };

      const [positions, setPositions] = useState([])
      const getPositions = async () => {
          try {
            const res = await axios.get(`${baseUrl}/v1/api/jobdescription/getAll`, {
              headers: {
                'Content-Type': 'application/json',
                authorization: token,
              },
            });
            setPositions(res.data.items || []);
          } catch (error) {
            console.error('Error fetching holidays:', error);
          }
        };


    useEffect(()=>{
        getCompany()
        getAllEmployee()
        getAllDepartment()
        getAllBranch()
        getAllCostCenter()
        getDesignation()
        getemployeeType()
        getemploymentTypes()
        getAllWorkLocations()
        getAllRoles()
        getPositions()
    },[])

    const handleSchedule = (row) => {
        setSelectedCandidate((prev)=>({
            ...prev,
            jobFormId: row?._id,
            mode: "",
            interviewDate: "",
            interviewTime: "",
            location: "",
            interviewer: "",
            interviewBy:"manager",
            managerId:"",
            status:"managerReview",
       }));
       setScheduleModal(true)
        setScheduleModal(true)
    }

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
      };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };

    const candidateColumns = [
        { field: 'candidateUniqueId', headerName: 'Candidate ID', width: 180 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'emailId', headerName: 'Email', width: 200 },
        { field: 'mobileNumber', headerName: 'Phone', width: 140 },
        {
          field: 'viewProfile',
          headerName: 'View Profile',
          width: 100,
          headerAlign: 'center',
          align: 'center',
          renderCell: (params) => (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, height:"100%", alignItems:"center" }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleViewProfile(params.row)}
              >
                View Profile
              </Button>
            </Box>
          ),
        },
        {
          field: 'actions',
          headerName: 'Actions',
          width: 380,
          headerAlign: 'center', align: 'center',
          renderCell: (params) => (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, height:"100%", alignItems:"center" }}>
              <Button
                sx={actionButtonStyle('#0c4870', 'rgb(43, 140, 232)')}
                onClick={() =>
                  status === 'managerReview'
                    ? handleSchedule(params.row)
                    : handlePreOffer(params.row._id)
                }
                disabled={params.row.preOffer === 'generated'}
              >
                {params.row.preOffer === 'generated'
                  ? 'Generated'
                  : status === 'managerReview'
                  ? 'Schedule'
                  : 'Pre-Offer'}
              </Button>
              <Button
                sx={actionButtonStyle('rgb(38, 227, 104)', 'rgb(20, 185, 86)')}
                onClick={() =>
                  status === 'managerReview'
                    ? handleAction(params.row._id, 'shortlisted')
                    : handleOfferLetter(params.row)
                }
              >
                {status === 'managerReview'
                  ? 'Shortlist'
                  : !params.row.pathofferLetterFinCooper ? 'Create Offer Letter' : "Recreate Offer Letter"}
              </Button>
                <Button
                  sx={actionButtonStyle('rgb(210, 56, 29)', 'rgb(196, 99, 20)')}
                  onClick={() =>   status === 'managerReview'
                    ? handleAction(params.row._id, 'reject')  :
                    handleSendOfferLetter(params.row)}
                    disabled={status !== "managerReview" && params.row.postOffer==="generated"}
                >
                 {status === 'managerReview'
                  ? 'Reject'
                : 'Send Offer Letter'}
                </Button>
            </Box>
          ),
        },
      ]

    const getAllCandidates = async () => {
        try {
            const res = await axios.get(`${baseUrl}/v1/api/job/RecruitmentPipeline?page=${page+1}&limit=${rowsPerPage}0&status=${status}`, {
              headers: {
                'Content-Type': 'application/json',
                 authorization: token
              }
            })
            if(res.data.status){
               setCandidates(res.data.items.data)
               setTotalItems(res.data.items.totalCount)
            }
        } catch (error) {
            console.error("error",error)
        }
    }

    useEffect(()=>{
        getAllCandidates()
    },[page, rowsPerPage, status])



    const handleChange = (e) => {
        const {name,value} = e.target
        setSelectedCandidate((prev)=>({
            ...prev,
         [name] : value
        }))
    }

    const handleScheduleInterview = async () => {
        try {
            const payload = {
                ...selectedCandidate,
                managerId:selectedCandidate?.interviewer,
                interviewTime:`${Number(selectedCandidate?.interviewTime.split(":")[0])>11 ? `${selectedCandidate?.interviewTime} P.M` : `${selectedCandidate?.interviewTime} A.M`}`
            }
            const res = await axios.post(`${baseUrl}/v1/api/candidate/scheduleInterview`, payload, {
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

    const handleChangeStatus = async () => {
        try {
            const res = await axios.post(`${baseUrl}/v1/api/candidate/jobApplyFormStatusChange`,statusData, {
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
                severity:'error',
                open:true
              })
            }
          } catch (error) {
            console.error("error", error);
            setSnackbar({
              message:error.message,
              severity:'error',
              open:true
            })
          } finally{
           getAllCandidates()
           setRemarkModal(false)
          }
    }

    const handleAction = (id,stat) =>{
        setRemarkModal(true)
        setStatusData((prev)=>({
            ...prev,
            ids:[id],
            status:stat
        }))
    }

    const handlePreOffer = async (id) => {
      try {
        const res = await axios.post(`${baseUrl}/v1/api/candidate/preofferletter`,{"Id":id}, {
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
            severity:'error',
            open:true
          })
        }
      } catch (error) {
        console.error("error", error);
        setSnackbar({
          message:error.message,
          severity:'error',
          open:true
        })
      } finally{
       getAllCandidates()
      }
    }

    const handleOfferLetter = async (params) => {
      setOfferLetterModal(true)
      setCandidateForOffer({
        jobId: params._id,
        package: 0,
        dateOfJoining: "",
        company: "",
        position: "",
        PF: "",
        ESIC: ""
      })
    }

    const generateOfferLetter = async () => {
      try {
        const res = await axios.post(`${baseUrl}/v1/api/candidate/generateofferletter${offerLetterChoice}`,candidateForOffer, {
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
            severity:'error',
            open:true
          })
        }
      } catch (error) {
        console.error("error", error);
        setSnackbar({
          message:error.message,
          severity:'error',
          open:true
        })
      } finally{
       getAllCandidates()
       setOfferLetterModal(false)
    }
  }

  const generatePF = async () => {
    try {
      const res = await axios.post(`${baseUrl}/v1/api/candidate/calculate`,{
          package:candidateForOffer?.package ,
          PF: candidateForOffer?.PF,   
          ESIC: candidateForOffer?.ESIC 
      }, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      setCTC(res.data.items.costOfCompany)
    } catch (error) {
      console.error("error", error);
    } 
  }

  const handleSendOfferLetter = (value) => {
    setSendOfferData((prev)=>({
      ...prev,
      Id:value._id
    }))
    setSendOfferLetterModal(true)
  }

  const sendOfferLetter = async () => {
    try {
      const res = await axios.post(`${baseUrl}/v1/api/candidate/sendOfferletter`,sendOfferData, {
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
          severity:'error',
          open:true
        })
      }
    } catch (error) {
      console.error("error", error);
      setSnackbar({
        message:error.message,
        severity:'error',
        open:true
      })
    } finally{
     getAllCandidates()
     setSendOfferLetterModal(false)
  }
  }


  return (
    <Container>
         <Box sx={{my:4, display:'flex', justifyContent:"space-between"}}>
        <Typography fontSize={20} fontWeight={600}>Recruitment Pipeline</Typography>
         <Box sx={{width:"200px"}}>
            <TextField
                select
                fullWidth
                label="Status"
                size="small"
                value={status}
                onChange={(e)=>setStatus(e.target.value)}
                SelectProps={{ native: false }}
            >
                <MenuItem value="managerReview">Manager Review</MenuItem>
                <MenuItem value="shortlisted">Shortlisted</MenuItem>
            </TextField>
            </Box>
            </Box>
         <DataGrid
          rows={candidates}
          columns={candidateColumns}
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
            sx={{ borderBottom: "2px solid #00c65c", pb: 1, color: "#333" }}
          >
            Resume Summary
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
      <Modal open={remarkModal} onClose={() => setRemarkModal(false)}>
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
          >
            Remark
          </Typography>

          <TextField
            label="Remark"
            name="reason"
            fullWidth
            size='small'
            multiline
            rows={2}
            value={status.reason}
            onChange={e => setStatusData({ ...statusData, reason: e.target.value })}
            />

        <Box sx={{display:"flex", gap:3, justifyContent:"flex-end"}}>
        <Button
            variant="contained"
            size='small'
            color='secondary'
            sx={{
              mt: 2,
              alignSelf: "flex-end",
            }}
            onClick={() => setRemarkModal(false)}
          >
            Close
          </Button>
          <Button
            variant="contained"
            size='small'
            sx={{
              mt: 2,
              alignSelf: "flex-end",
            }}
            onClick={handleChangeStatus}
          >
            Submit
          </Button>
        </Box>
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
            value={selectedCandidate?.mode}
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
            value={selectedCandidate?.location}
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
      <Dialog open={offerLetterModal} onClose={()=>setOfferLetterModal(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Employment Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Package"
              fullWidth
              size='small'
              value={candidateForOffer.package}
              onChange={(e) => setCandidateForOffer({ ...candidateForOffer, package: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Joining"
              type="date"
              size='small'
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={candidateForOffer.dateOfJoining}
              onChange={(e) => setCandidateForOffer({ ...candidateForOffer, dateOfJoining: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company"
              fullWidth
              size='small'
              select
              value={candidateForOffer.company}
              onChange={(e) => setCandidateForOffer({ ...candidateForOffer, company: e.target.value })}>
               {companies.map(company => (
                  <MenuItem key={company._id} value={company._id}>
                  {company.companyName}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Position"
              fullWidth
              select
              size='small'
              value={candidateForOffer.position}
              onChange={(e) => setCandidateForOffer({ ...candidateForOffer, position: e.target.value })}
            >
                 {positions.map(pos => (
                  <MenuItem key={pos._id} value={pos._id}>
                  {pos.position}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="PF"
              fullWidth
              size='small'
              value={candidateForOffer.PF}
              onChange={(e) => setCandidateForOffer({ ...candidateForOffer, PF: e.target.value })}>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ESIC"
              fullWidth
              select
              size='small'
              value={candidateForOffer.ESIC}
              onChange={(e) => setCandidateForOffer({ ...candidateForOffer, ESIC: e.target.value })}>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
            </TextField>
          </Grid>  
          <Grid item xs={12} sx={{my:3, display:"flex", gap:4, alignItems:"center"}}>
          <Button onClick={generatePF} variant="contained">Generate PF</Button>
          <Typography fontSize={15} fontWeight={600}>Cost To Company: {CTC}</Typography>
          </Grid> 
          <Grid item xs={12} sm={6}>
            <TextField
              label="Offer Format"
              fullWidth
              select
              size='small'
              value={offerLetterChoice}
              onChange={(e) => setOfferLetterChoice(e.target.value)}>
                <MenuItem value={1}>Format 1</MenuItem>
                <MenuItem value={2}>Format 2</MenuItem>
                <MenuItem value={3}>Format 3</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>{setOfferLetterModal(false); setCandidateForOffer({
           jobId: "",
           package: 0,
           dateOfJoining: "",
           company: "",
           position: "",
           PF: "no",      
           ESIC: "no"   
        }); setCTC("0")}} sx={{mt:3}}>Cancel</Button>
        <Button onClick={generateOfferLetter} variant="contained" sx={{mt:3}}>Generate</Button>
      </DialogActions>
    </Dialog>
    <Dialog open={sendOfferLetterModal} onClose={() => setSendOfferLetterModal(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Send Offer Letter</DialogTitle>
  <DialogContent dividers>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Send To"
          fullWidth
          size="small"
          select
          value={sendOfferData.sendTo}
          onChange={(e) => setSendOfferData({ ...sendOfferData, sendTo: e.target.value })}
        >
         <MenuItem value={"candidate"}>Candidate</MenuItem>
        <MenuItem value={"manager"}>Manager</MenuItem>
      </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Reporting Manager ID"
          fullWidth
          select
          size="small"
          value={sendOfferData.reportingManagerId}
          onChange={(e) => setSendOfferData({ ...sendOfferData, reportingManagerId: e.target.value })}
        >
          {employees?.map(i=>
             <MenuItem value={i._id}>{i.employeName}</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
          <TextField
            label="Company"
            fullWidth
            size='small'
            select
            value={sendOfferData.company}
            onChange={(e) => setSendOfferData({ ...sendOfferData, company: e.target.value })}>
              {companies.map(company => (
                  <MenuItem key={company._id} value={company._id}>
                  {company.companyName}
                  </MenuItem>
                ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
        <TextField
          label="Branch"
          fullWidth
          select
          size="small"
          value={sendOfferData.branchId}
          onChange={(e) => setSendOfferData({ ...sendOfferData, branchId: e.target.value })}
          >
          {branches?.map(i=>
             <MenuItem value={i._id}>{i.name}</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Cost Center"
          fullWidth
          select
          size="small"
          value={sendOfferData.constCenterId}
          onChange={(e) => setSendOfferData({ ...sendOfferData, constCenterId: e.target.value })}
          >
          {costCenters?.map(i=>
             <MenuItem value={i._id}>{i.title}</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Designation"
          fullWidth
          select
          size="small"
          value={sendOfferData.designationId}
          onChange={(e) => setSendOfferData({ ...sendOfferData, designationId: e.target.value })}
          >
          {designations?.map(i=>
             <MenuItem value={i._id}>{i.name}</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Employee Type"
          fullWidth
          select
          size="small"
          value={sendOfferData.employeeTypeId}
          onChange={(e) => setSendOfferData({ ...sendOfferData, employeeTypeId: e.target.value })}
          >
          {employeeType?.map(i=>
             <MenuItem value={i._id}>{i.title}</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Employment Type"
          fullWidth
          select
          size="small"
          value={sendOfferData.employementTypeId}
          onChange={(e) => setSendOfferData({ ...sendOfferData, employementTypeId: e.target.value })}
          >
          {employementType?.map(i=>
             <MenuItem value={i._id}>{i.title}</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Work Location"
          fullWidth
          select
          size="small"
          value={sendOfferData.workLocationId}
          onChange={(e) => setSendOfferData({ ...sendOfferData, workLocationId: e.target.value })}
          >
          {workLocations?.map(i=>
             <MenuItem value={i._id}>{i.name}</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
      <TextField
        label="Roles"
        fullWidth
        select
        size="small"
        SelectProps={{
          multiple: true,
          renderValue: (selected) =>
            roles
              ?.filter(role => selected.includes(role._id))
              .map(role => role.roleName)
              .join(', ')
        }}
        value={sendOfferData.roleId || []}
        onChange={(e) => {
          const selectedRoles = e.target.value;
          setSendOfferData({
            ...sendOfferData,
            roleId: selectedRoles,
          });
        }}
      >
        {roles?.map((i) => (
          <MenuItem key={i._id} value={i._id}>
            {i.roleName}
          </MenuItem>
        ))}
      </TextField>
    </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Department"
          fullWidth
          select
          size="small"
          value={sendOfferData.departmentId}
          onChange={(e) => {setSendOfferData({ ...sendOfferData, departmentId: e.target.value }); getSubDepartment(e.target.value)}}
          >
          {department?.map(i=>
             <MenuItem value={i._id}>{i.name}</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Sub Department"
          fullWidth
          select
          size="small"
          value={sendOfferData.subDepartmentId}
          onChange={(e) => setSendOfferData({ ...sendOfferData, subDepartmentId: e.target.value })}
          >
          {subDepts?.map(i=>
             <MenuItem value={i._id}>{i.name}</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Secondary Department"
          fullWidth
          select
          size="small"
          value={sendOfferData.secondaryDepartmentId}
          onChange={(e) => {setSendOfferData({ ...sendOfferData, secondaryDepartmentId: e.target.value }); getSubDepartment(e.target.value)}}
          >
          {department?.map(i=>
             <MenuItem value={i._id}>{i.name}</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Secondary Sub Department"
          fullWidth
          size="small"
          select
          value={sendOfferData.seconSubDepartmentId}
          onChange={(e) => setSendOfferData({ ...sendOfferData, seconSubDepartmentId: e.target.value })}
          >
          {subDepts?.map(i=>
             <MenuItem value={i._id}>{i.name}</MenuItem>
          )}
        </TextField>
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setSendOfferLetterModal(false)} color="inherit">Cancel</Button>
    <Button variant="contained" onClick={sendOfferLetter}>Save</Button>
  </DialogActions>
</Dialog>
<Dialog open={openProfileModal} onClose={() => setOpenProfileModal(false)} maxWidth={"md"} fullWidth>
    <DialogTitle>Candidate Profile</DialogTitle>
    <DialogContent dividers sx={{ backgroundColor: '#fafafa' }}>
      <Grid container spacing={2}>
        {/* Personal Information */}
        <Section title="Personal Information">
          <InfoBlock label="Candidate ID" value={profileCandidate?.candidateUniqueId} />
          <InfoBlock label="Email" value={profileCandidate?.emailId} />
          <InfoBlock label="Mobile" value={profileCandidate?.mobileNumber} />
          <InfoBlock label="Current Location" value={profileCandidate?.currentLocation} />
          <InfoBlock label="Preferred Location" value={profileCandidate?.preferredLocation} />
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight={600}>Address</Typography>
            <Typography variant="body2" color="text.secondary">
              {profileCandidate?.address}, {profileCandidate?.city}, {profileCandidate?.state} - {profileCandidate?.pincode}
            </Typography>
          </Grid>
        </Section>

        {/* Education */}
        <Section title="Education">
          <InfoBlock label="Qualification" value={profileCandidate?.highestQualification} />
          <InfoBlock label="University" value={profileCandidate?.university} />
          <InfoBlock label="Graduation Year" value={profileCandidate?.graduationYear} />
          <InfoBlock label="CGPA" value={profileCandidate?.cgpa} />
        </Section>

        {/* Experience */}
        <Section title="Experience">
          <InfoBlock label="Current Designation" value={profileCandidate?.currentDesignation} />
          <InfoBlock label="Last Organization" value={profileCandidate?.lastOrganization} />
          <InfoBlock label="Experience" value={`${profileCandidate?.totalExperience} years`} />
          <InfoBlock label="Current CTC" value={`₹${profileCandidate?.currentCTC} LPA`} />
          <InfoBlock label="Start Date" value={formatDate(profileCandidate?.startDate)} />
          <InfoBlock label="End Date" value={formatDate(profileCandidate?.endDate)} />
          <InfoBlock label="Reason for Leaving" value={profileCandidate?.reasonLeaving} />
          <InfoBlock label="Gap (if any)" value={profileCandidate?.gapIfAny} />
        </Section>

        {/* Application Details */}
        <Section title="Application Details">
          <InfoBlock label="Position" value={profileCandidate?.position} />
          <InfoBlock label="Interview Mode" value={profileCandidate?.preferedInterviewMode} />
          <InfoBlock label="Source" value={profileCandidate?.knewaboutJobPostFrom} />
          <InfoBlock label="Department" value={profileCandidate?.department?.name} />
          <InfoBlock label="Branch" value={profileCandidate?.branches?.name} />
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight={600}>Resume</Typography>
            <Link href={profileCandidate?.resume} target="_blank" rel="noopener" underline="hover">
              View Resume
            </Link>
          </Grid>
        </Section>

        <Section title="Status & Tracking">
          <InfoBlock label="Shortlist" value={<Chip label={profileCandidate?.resumeShortlisted} size="small" />} />
          <InfoBlock label="HR Interview" value={<Chip label={profileCandidate?.hrInterviewSchedule} size="small" />} />
          <InfoBlock label="Offer Letter" value={<Chip label={profileCandidate?.finCooperOfferLetter} size="small" />} />
          <InfoBlock label="Eligibility" value={profileCandidate?.isEligible} />
          <InfoBlock label="Status" value={profileCandidate?.status} />
          <InfoBlock label="Candidate Status" value={profileCandidate?.candidateStatus} />
          <InfoBlock label="Match %" value={`${profileCandidate?.matchPercentage}%`} />
          <InfoBlock
            label="Pre-Offer Status"
            value={<Chip label={profileCandidate?.preOffer || 'N/A'} size="small" color={profileCandidate?.preOffer === 'generated' ? 'success' : 'default'} />}
          />
          <InfoBlock
            label="Offer Letter Status"
            value={<Chip label={profileCandidate?.finCooperOfferLetter || 'N/A'} size="small" color={profileCandidate?.finCooperOfferLetter === 'generated' ? 'success' : 'default'} />}
          />
          {profileCandidate?.pathofferLetterFinCooper && (
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={600}>Offer Letter</Typography>
              <Link href={profileCandidate?.pathofferLetterFinCooper} target="_blank" rel="noopener" underline="hover">
                View Offer Letter
              </Link>
            </Grid>
          )}
        </Section>

        {/* Summary */}
        <Section title="Summary">
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">{profileCandidate?.summary || 'No summary available.'}</Typography>
          </Grid>
        </Section>

        {/* Interview Rounds */}
        {profileCandidate?.interviewDetails?.length > 0 && (
          <Section title="Interview Rounds">
            {profileCandidate?.interviewDetails.map((intv, idx) => (
              <Grid key={intv._id || idx} item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, mb: 1, borderRadius: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={600}>Round {intv.interviewRound}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {formatDate(intv.interviewDate)}</Typography>
                    <Typography variant="body2"><strong>Time:</strong> {intv.interviewTime}</Typography>
                    <Typography variant="body2"><strong>Mode:</strong> {intv.mode}</Typography>
                    <Typography variant="body2"><strong>Location:</strong> {intv.location}</Typography>
                    <Typography variant="body2"><strong>Status:</strong> <Chip label={intv.status} size="small" /></Typography>
                    <Typography variant="body2"><strong>Interviewer:</strong> {intv?.HrinterviewName?.employeName || '-'}</Typography>
                    <Typography variant="body2"><strong>Interview Taken:</strong> {intv.interviewTaken}</Typography>
                    <Typography variant="body2"><strong>Hire Decision:</strong> {intv.hireCandidate}</Typography>
                    <Typography variant="body2"><strong>Remark:</strong> {intv.remark}</Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Section>
        )}
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenProfileModal(false)} variant="outlined">Close</Button>
    </DialogActions>
  </Dialog>

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

function actionButtonStyle(startColor, endColor) {
  return {
    background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
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
  }
}
