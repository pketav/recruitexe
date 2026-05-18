'use client'

import { Container, Typography, Box, IconButton, Modal,Chip,FormControl, InputLabel,Switch,FormControlLabel, Select, MenuItem , Button, Checkbox, ListItemText, Grid, Snackbar, Alert, Divider} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import {
    EditOutlined as EditIcon,
    DeleteOutlineOutlined as DeleteIcon,
    VisibilityOutlined as VisibilityIcon
  } from '@mui/icons-material'
  import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

  import CustomTextField from '../../../@core/components/mui/TextField'

import axios from 'axios'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../../context/AuthContext'
import AllJobPosts from '../allJobPosts/page'
import { Stepper, Step, StepLabel } from '@mui/material';



export default function VacancyRequest() {
    const [vacancies, setVacancies] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalItems, setTotalItems] = useState(0)
    const token = window.localStorage.getItem("authToken")
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const [jobPostModal, setJobPostModal] = useState(false)
    const [vacancySelected, setVacancySelected] = useState({})
    const [employmentTypes, setemploymentTypes] = useState([])
    const [jobDescription, setJobDescription] = useState([])
    const steps = ['Basic Details', 'Position & Budget', 'AI Screening', 'Job Description'];
    const { userData } = useAuth();
    const [jobDesc, setJobDesc] = useState("")
    const [openAdd, setOpenAdd] = useState(false);
    const [departments, setDepartments] = useState([])
    const [branches, setBranches] = useState([])
    const [mode, setMode] = useState("")
    const [editVacancy, setEditVacancy] = useState({})
    const [desc, setDesc] = useState("")
    const [openDesc, setOpenDesc] = useState(false)
    const [designation, setDesignation] = useState([])
    const [Budget, setBudget] = useState(0)
    const [organizations, setOrganizations] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [employeeTypes, setEmployeeTypes] = useState([])
    const [status, setStatus] = useState("active")
    const [activeStep, setActiveStep] = useState(0)
    const [getJd, setGetJD] = useState(false)
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success'
    })
    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false })
    }

    const handleDesc = (value) => {
        setDesc(value)
        setOpenDesc(true)
    }

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
      };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };



const [orgs, setOrgs] = useState([])
  const getOrganization = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/org/organization`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      setOrgs(res.data.items[0]);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

    const getemploymentTypes = async () => {
        try {
            const res = await axios.get(`${baseUrl}/v1/api/employmentType/getAllListEmploymentType`, {
              headers: {
                'Content-Type': 'application/json',
                 authorization: token
              }
            })
            if(res.data.status){
                setemploymentTypes(res.data.items)
            }
        } catch (error) {
            console.error("error",error)
        }
    }

    const getemployeeTypes = async () => {
      try {
          const res = await axios.get(`${baseUrl}/v1/api/employeType/getAllEmployeType`, {
            headers: {
              'Content-Type': 'application/json',
               authorization: token
            }
          })
          if(res.data.status){
              setEmployeeTypes(res.data.items)
          }
      } catch (error) {
          console.error("error",error)
      }
  }


    const getQualification = async () => {
      try {
          const res = await axios.get(`${baseUrl}/v1/api/qualification/getAllQualifications`, {
            headers: {
              'Content-Type': 'application/json',
               authorization: token
            }
          })
          if(res.data.status){
            setQualifications(res.data.items)
          }
      } catch (error) {
          console.error("error",error)
      }
  }

    const getDepartment = async () => {
        try {
            const res = await axios.get(`${baseUrl}/v1/api/newdepartment/newdeparment`, {
              headers: {
                'Content-Type': 'application/json',
                 Authorization: token
              }
            })
            console.log("deprt",res)
            if(res.data.status){
              setDepartments(res.data.items.filter(i=>i.isActive===true) || []);
            }
        } catch (error) {
            console.error("error",error)
        }
    }

    const getDesignation = async (dept) => {
      try {
          const res = await axios.get(`${baseUrl}/v1/api/designation/getDepartmentsWithDesignations`, {
            headers: {
              'Content-Type': 'application/json',
               authorization: token
            }
          })
          if(res.data.status){
              setDesignation(res.data.items.filter(i=>i._id===dept)[0].designations)
              setBudget(res.data.items.filter(i=>i._id===dept)[0].budget[0]?.allocatedBudget || 0)
          }
      } catch (error) {
          console.error("error",error)
      }
   }

    const getBranches = async () => {
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
    const [workLocations, setWorkLocations] = useState([])
    const getWorkLocations = async () => {
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

    const getJobDescription = async (id) => {
        try {
            const res = await axios.get(`${baseUrl}/v1/api/designation/getJobDescriptionsByDesignation/${id}`, {
              headers: {
                'Content-Type': 'application/json',
                 authorization: token
              }
            })
            if(res.data.status){
                setJobDescription(res.data.items.jobDescriptions)
            }
        } catch (error) {
            console.error("error",error)
        }
    }

    const postJob = async () => {
        const payload = {
            employmentTypeId: vacancySelected?.employmentTypeId || "-",
            employeeTypeId:vacancySelected?.employeeTypeId || "-",
            departmentId: vacancySelected.department._id || "",
            branchId: vacancySelected.branchId || [],
            budget:Budget || "-",
            qualificationId: vacancySelected.qualificationDetail._id || "",
            organizationId: vacancySelected.organizationDetail._id || "",
            experience: Number(vacancySelected.experience) || 0,
            noOfPosition: vacancySelected.noOfPosition || 0,
            jobDescriptionId: vacancySelected?.jobDescriptionId || "-",
            vacencyRequestId: vacancySelected._id || ""  ,
            AI_Screening:vacancySelected?.AI_Screening || "false",
            AI_Percentage: vacancySelected?.AI_Percentage || 0,
            designationId:vacancySelected?.designation?._id || "-",
            package:vacancySelected?.package || "-"
        }
        try {
            const res = await axios.post(`${baseUrl}/v1/api/jobPost/jobPostAdd`,payload, {
              headers: {
                'Content-Type': 'application/json',
                authorization:token
              }
            })
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
            console.error("error",error)
            setSnackbar({
              message:error?.message,
              severity:'error',
              open:true
            })
          } finally{
            setJobPostModal(false)
            getAllVacancy()
            setDesignation([])
          }
    }

    console.log("userData",userData)

    const handleApproveReject = async (stat,id) => {
      try {
        const res = await axios.post(`${baseUrl}/v1/api/vacencyRequest/approveReject?status=${stat}&vacancyId=${id}`,{}, {
          headers: {
            'Content-Type': 'application/json',
             authorization: token
          }
        })
        if(res.data.status){
           setSnackbar({
            message:res.data.message,
            severity:"success",
            open:true
           })
           getAllVacancy()
        }
    } catch (error) {
        console.error("error",error)
    }
    }

    const [addVacancy, setAddVacancy] = useState({
      organizationId:orgs?._id,
      departmentId: "",
      designationId:"",
      employmentTypeId: "",
      employeeTypeId:"",
      workLocationId:"",
      branchId: [],
      qualificationId: "",
      organizationId:"",
      experience: "",
      priority: "medium",
      package: "",
      noOfPosition: "",
      jobDescriptionId: "",
      vacancyType:"request",
      status: "active",
      AI_Screening: false,
      AI_Percentage:0
  })




    const columns = [
        { field: 'organizationDetail', headerName: 'Organization', width: 150,renderCell: (params) => (
          <Box sx={{display:"flex", height:"100%", alignItems:"center"}}>
            <Typography
          fontSize={13}
          sx={{color:"#484964"}}
          >
            {params.row.organizationDetail.name}
          </Typography>
          </Box>
        ) },
        { field: 'qualificationDetail', headerName: 'Qualification Required', width: 200,renderCell: (params) => (
          <Box sx={{display:"flex", height:"100%", alignItems:"center"}}>
            <Typography
          fontSize={13}
          sx={{color:"#484964"}}
          >
            {params.row.qualificationDetail.name}
          </Typography>
          </Box>
        )  },
        { field: 'designation', headerName: 'Designation', width: 120,renderCell: (params) => (
          <Box sx={{display:"flex", height:"100%", alignItems:"center"}}>
            <Typography
          fontSize={13}
          sx={{color:"#484964"}}
          >
            {params.row.designation.name}
          </Typography>
          </Box>
        )  },
        { field: 'experience', headerName: 'Experience', width: 90,align:"center", renderCell: (params) => (
          <Box sx={{display:"flex", height:"100%", alignItems:"center",justifyContent:'center'}}>
            <Typography
          fontSize={14}
          sx={{color:"#484964"}}
          >
            {`${params.row.experience} Yrs` }
          </Typography>
          </Box>
        )  },
        { field: 'employeeType', headerName: 'Type', width: 80 },
        { field: 'package', headerName: 'Package', width: 90,renderCell: (params) => (
          <Box sx={{display:"flex", height:"100%", alignItems:"center",justifyContent:'center'}}>
            <Typography
          fontSize={13}
          sx={{color:"#484964"}}
          >
            {`${params.row.package} (LPA)` }
          </Typography>
          </Box>
        )  },
        { field: 'noOfPosition', headerName: 'Positions', width: 75 ,align:"center"},
        {
          field: 'jobDescription',
          headerName: 'Job Desc',
          width:`${status !== "notApproved" ? 95 : 160}`,
          headerAlign:"center",
          align:"center",
          renderCell: (params) => (
            <Box sx={{display:"flex", height:"100%", alignItems:"center", justifyContent:"center"}}>
              <Button
              size='small'
               variant='outlined'
               color='success'
              onClick={() => handleDesc(params.row.jobDesc)}
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
        ...(status !== "notApproved"
          ? [{
          field: 'actions',
          headerName: 'Actions',
          sortable: false,
          headerAlign: 'center', align: 'start',
          width:140,
          renderCell: (params) => (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, height:"100%", alignItems:"center" }}>
              <IconButton color='#B3B3B3' onClick={() => handleEditModal(params.row)} disabled={params.row.jobPostStatus === "Yes"}>
                <DriveFileRenameOutlineIcon />
              </IconButton>
             {status==="active" ? 
            <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              sx={{ backgroundColor: "#2e7d324D", color: "#2E7D32", borderRadius: "50%", p:2}}
              aria-label="Approve"
              onClick={()=>handleApproveReject('approved',params.row._id)}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ backgroundColor: "#d32f2f4D", color: "red", borderRadius: "50%", p: 2}}
              aria-label="Reject"
              onClick={()=>handleApproveReject('notApproved',params.row._id)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box> :status==="approved" ? <Button
                variant="contained"
                sx={{backgroundColor:"#2E7D32", borderRadius:"25px",
                  '&.Mui-disabled': {
                    backgroundColor: "#B3B3B3",
                    color: "#fff"
                  }
                }}
                onClick={() => handleJobPost(params.row)}
                disabled={params.row.jobPostStatus === "Yes"}
              >
                {params.row.jobPostStatus === "Yes" ? "Posted" : "Post Job"}
              </Button> : <Button>
                </Button>}
            </Box>
         )
        }]
      : [])
      ]

    const getAllVacancy = async () => {
        try {
            const res = await axios.get(`${baseUrl}/v1/api/vacencyRequest/getvacancy?vacancyStatus=${status}&page=${page+1}&limit=${rowsPerPage}`, {
              headers: {
                'Content-Type': 'application/json',
                 authorization: token
              }
            })
            if(res.data.status){
                const rows = res.data.items.data.map((item, index) => {
                    const jobPost = item.jobPost;
                    const jobDescription = item.jobDescription?.jobDescription || '-';
                    return {
                      _id: item._id,
                      company: item.company || "-",
                      department: item.department || '—',
                      experience: item.experience || '0',
                      exp:Number(item?.experience) || 0,
                      package: item.package || '—',
                      pkg:Number(item?.package) || 0,
                      qualificationDetail: item.qualificationDetail || '-',
                      organizationDetail:item.organizationDetail || {},
                      noOfPosition: item.noOfPosition || '—',
                      vacancyApproval: item?.vacancyApproval?.toUpperCase() || '—',
                      branchId : item.branch?.map(i=>i._id) || '-',
                      priority: item.priority || '—',
                      branches: item.branch?.map(b => b.name).join(', ') || '—',
                      createdBy: item.createdByManager?.employeName || '—',
                      jobPostStatus: item.jobPostCreated === 'yes' ? 'Yes' : 'No',
                      jobPosition: item.jobDescription?.position || '—',
                      jobDescription: jobDescription.length > 30 ? jobDescription.slice(0, 20) + '...' : jobDescription,
                      jobDesc: jobDescription,
                      jobDescriptionId: item?.jobDescription?._id || "-",
                      Budget:`${item?.Budget || 0} (LPA)` || 0,
                      employmentTypeId:item?.employmentType?._id || "-",
                      employeeTypeId:item?.employeeType?._id || "-",
                      employeeType:item?.employeeType?.title || "-",
                      employmentType: item?.employmentType?.title || "-",
                      vacancyType: item?.vacancyType || "-",
                      status:item?.status || "-",
                      createdAt:item?.createdAt || '',
                      AI_Screening: item?.AI_Screening==="true" ? true : false,
                      AI_Percentage: item?.AI_Percentage || 0,
                      designation: item?.desingnation || "-"
                    };
                  });
                  setVacancies(rows)
                  setTotalItems(res.data.items.pagination.total)
            }
          } catch (error) {
           console.error("error",error)
          }
    }

    useEffect(()=>{
        getAllVacancy()
    },[page,rowsPerPage,status])

    useEffect(() => {
      getemploymentTypes()
      getDepartment()
      getBranches()
      getOrganization()
      getemployeeTypes()
      getQualification()
      getWorkLocations()
    },[])

    useEffect(()=>{
      if(addVacancy.departmentId)
     { getDesignation(addVacancy.departmentId)}
      else if(editVacancy.departmentId){
        getDesignation(editVacancy.departmentId)
      }
    },[addVacancy.departmentId, editVacancy.departmentId])

    useEffect(()=>{
      if(addVacancy.designationId)
     { }
      else if(editVacancy.designationId){
        getJobDescription(editVacancy.designationId)
      }
    },[addVacancy.designationId, editVacancy.designationId])

    const handleJobPost = (row) => {
       setJobPostModal(true)
       setVacancySelected(row)
    }

      const handleEditModal = (row) => {
        console.log("row",row)
        setMode("edit")
        setOpenAdd(true)
        setEditVacancy(
        {
            vacancyRequestId:row?._id || "-",
            departmentId: row?.department?._id || "-",
            employmentTypeId: row?.employmentTypeId || "-",
            employeeTypeId:row?.employeeTypeId || "-",
            branchId: row?.branchId || [],
            qualificationId: row?.qualificationDetail?._id || "",
            organizationId:row?.organizationDetail?._id || "",
            experience: row?.exp || "",
            priority: row?.priority || "",
            package: row?.pkg || "",
            noOfPosition: row?.noOfPosition || 0,
            jobDescriptionId: row?.jobDescriptionId,
            vacancyType:row?.vacancyType || "-",
            status: row?.status || "",
            company: row?.company || "-",
            designationId:row?.designation?._id || "-",
            AI_Screening:row?.AI_Screening || false,
            AI_Percentage: row?.AI_Percentage || 0
        }
        )
      }

      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : name === 'noOfPosition' || name === 'AI_Percentage' ? Number(value) : value;
        if (mode === "add") {
          setAddVacancy(prev => ({ ...prev, [name]: finalValue }));
        } else {
          setEditVacancy(prev => ({ ...prev, [name]: finalValue }));
        }
      }

      const handleVacancyRequest = async () => {
        const finalExperience =
        (mode === "add" ? addVacancy.experience : editVacancy.experience) === "Other"
          ? (mode === "add" ? addVacancy.customExperience : editVacancy.customExperience)
          : (mode === "add" ? addVacancy.experience : editVacancy.experience)
        try {
            const res = await axios.post(`${baseUrl}/v1/api/vacencyRequest/vacancyRequestAdd`,
              {
                ...addVacancy,
                branchId:[addVacancy.branchId],
                jobDescriptionId : jobDescription[0]._id,
                experience:finalExperience

              }, {
              headers: {
                'Content-Type': 'application/json',
                authorization:token
              }
            })
          if(res.data.status){
            setOpenAdd(false)
            setAddVacancy({
              organizationId:orgs?._id,
              departmentId: "",
              designationId:"",
              employmentTypeId: "",
              employeeTypeId:"",
              branchId: [],
              qualificationId: "",
              experience: "",
              priority: "medium",
              package: "",
              noOfPosition: 0,
              jobDescriptionId: "",
              vacancyType:"request",
              status: "active",
              AI_Screening: false,
              AI_Percentage:0
            })
            setDesignation([])
            setJobDescription([])
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
            console.error("error",error)
            setSnackbar({
              message:error?.message,
              severity:'error',
              open:true
            })
          } finally{
            getAllVacancy()
          }
      }

      const handleEditVacancyRequest = async () => {
        try {
            const res = await axios.post(`${baseUrl}/v1/api/vacencyRequest/vacancyRequestUpdate`, editVacancy, {
              headers: {
                'Content-Type': 'application/json',
                authorization:token
              }
            })
          if(res.data.status){
            setOpenAdd(false);
            setSnackbar({
              message:res.data.message,
              severity:'success',
              open:true
            })
          }
          } catch (error) {
            console.error("error",error)
          } finally{
            getAllVacancy()
            setDesignation([])
            setJobDescription([])
          }
      }
console.log("orfs",orgs)
    return (
        <Container maxWidth='xl'>
            <Box sx={{display:'flex', justifyContent:"space-between", alignItems:"center"}}>
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
            Vacancy Internals
            </Typography>
            <Typography variant="body1" color="text.secondary">
            View and manage all vacancy requests in the system.
            </Typography>
        </Box>
        <Box sx={{display:'flex', gap:3, alignItems:"center"}}>
        <FormControl variant="outlined" size="small" sx={{ width: "150px" }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="active">New</MenuItem>

            { (userData?.role?.includes("admin") || userData?.role?.includes("hr")) && 
              [
                <MenuItem key="approved" value="approved">Approved</MenuItem>,
                <MenuItem key="notApproved" value="notApproved">Rejected</MenuItem>
              ]
            }
          </Select>
        </FormControl>

            <Button variant='outlined' onClick={()=>{setOpenAdd(true); setMode("add")}}>Add Request</Button></Box>
            </Box>
         <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={vacancies}
          columns={columns}
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
      {(userData?.role?.includes("admin") || userData?.role?.includes("hr")) &&
        <>
        <Divider sx={{my:6}}/>
        <AllJobPosts/>)
        </>}
      <Modal open={jobPostModal} onClose={() => setJobPostModal(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '90%',  
            sm: '80%',  
            md: 650     
          },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" mb={2}>Create Job Post</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CustomTextField
              label="Department"
              name="departmentId"
              fullWidth
              select
              value={vacancySelected?.department?._id}
              InputProps={{ readOnly: true }}
              >
              {departments.map(dept => (
                  <MenuItem key={dept._id} value={dept._id}>
                  {dept.name}
                  </MenuItem>
              ))}
              </CustomTextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              label="Employment Type"
              name="employmentTypeId"
              fullWidth
              value={vacancySelected.employmentType}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              label="Type of Employee"
              name="employeeTypeId"
              fullWidth
              select
              value={vacancySelected.employeeTypeId}
              InputProps={{ readOnly: true }}
              >
              {employeeTypes.map(type => (
                  <MenuItem key={type._id} value={type._id}>
                  {type.title}
                  </MenuItem>
              ))}
              </CustomTextField>
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label="Branches"
              name="branches"
              fullWidth
              value={vacancySelected?.branches}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              label="Qualification"
              name="eligibility"
              fullWidth
              select
              value={vacancySelected?.qualificationDetail?._id}
              InputProps={{ readOnly: true }}
              >
              {qualifications.map(item => (
               <MenuItem key={item._id} value={item._id}>
               {item.name.toUpperCase()}
               </MenuItem>
           ))}
           </CustomTextField>
          </Grid>
          <Grid item xs={12} md={6}>
          <CustomTextField
            label="Organization"
            name="organizationId"
            fullWidth
            select
            value={vacancySelected?.organizationDetail?._id}
            InputProps={{ readOnly: true }}
          >
            <MenuItem key={orgs._id} value={orgs._id}>
              {orgs.name}
            </MenuItem>
          </CustomTextField>
        </Grid>


          <Grid item xs={12} md={6}>
            <CustomTextField
              label="Experience (years)"
              name="experience"
              fullWidth
              value={vacancySelected.experience}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              label="Budget"
              name="Budget"
              fullWidth
              value={Budget}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
                <CustomTextField
                label="Package (LPA)"
                name="package"
                fullWidth
                 type="number"
                value={vacancySelected?.package}
                InputProps={{ readOnly: true }}
                />
            </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              label="No. of Positions"
              name="noOfPosition"
              fullWidth
              type="number"
              value={vacancySelected.noOfPosition}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label="Job Description"
              name="jobDescriptionId"
              fullWidth
              multiline
              minRows={3}
              value={vacancySelected.jobDesc}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="outlined" color="secondary" sx={{ width: { xs: '50%', sm: 140 } }} onClick={() => setJobPostModal(false)}>Cancel</Button>
            <Button variant="contained" color="primary" sx={{ width: { xs: '50%', sm: 140 } }} onClick={postJob}>Submit</Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>

        <Modal open={openAdd} onClose={() => {setOpenAdd(false); mode==="add" && setBudget(0)} }>
        <Box
  sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }}
>
  <Typography variant="h6" mb={2}>
    {mode === "add" ? "Create Vacancy Request" : "Edit Vacancy Request"}
  </Typography>

  {/* Stepper */}
  <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
    {steps.map((label, index) => (
      <Step key={index}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
  

            <Grid container spacing={4}>
            {activeStep === 0 && (
              <>
                {/* Organization Dropdown (ReadOnly) */}
                <Grid item xs={12}>
                  <CustomTextField
                    select
                    label="Organization"
                    name="organizationId"
                    fullWidth
                    value={mode === "add" ? orgs?._id : editVacancy.organizationId}
                    onChange={handleInputChange}
                    InputProps={{ readOnly: true }}
                  >
                    <MenuItem key={orgs._id} value={orgs._id}>
                      {orgs.name}
                    </MenuItem>
                  </CustomTextField>
                </Grid>

                {/* Department */}
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    select
                    label="Department"
                    name="departmentId"
                    fullWidth
                    value={mode === "add" ? addVacancy.departmentId : editVacancy.departmentId}
                    onChange={(e) => {
                      handleInputChange(e);
                      getDesignation(e.target.value);
                    }}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                {/* Designation */}
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    select
                    label="Designation"
                    name="designationId"
                    fullWidth
                    value={mode === "add" ? addVacancy.designationId : editVacancy.designationId}
                    onChange={(e) => {
                      handleInputChange(e);
                      getJobDescription(e.target.value);
                    }}
                  >
                    {designation.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                {/* Employee Type */}
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    select
                    label="Type of Employee"
                    name="employeeTypeId"
                    fullWidth
                    value={mode === "add" ? addVacancy.employeeTypeId : editVacancy.employeeTypeId}
                    onChange={handleInputChange}
                  >
                    {employeeTypes.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.title}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                {/* Employment Type */}
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    select
                    label="Employment Type"
                    name="employmentTypeId"
                    fullWidth
                    value={mode === "add" ? addVacancy.employmentTypeId : editVacancy.employmentTypeId}
                    onChange={handleInputChange}
                  >
                    {employmentTypes.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.title}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                {/* Branches */}
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    select
                    label="Branches"
                    name="branchId"
                    fullWidth
                    value={mode === "add" ? addVacancy?.branchId : editVacancy?.branchId}
                    onChange={handleInputChange}
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch._id} value={branch._id}>
                        {branch.name.toUpperCase()}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                {/* Work Location */}
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    select
                    label="Work Location"
                    name="workLocationId"
                    fullWidth
                    value={mode === "add" ? addVacancy?.workLocationId : editVacancy?.workLocationId}
                    onChange={handleInputChange}
                  >
                    {workLocations.map((loc) => (
                      <MenuItem key={loc._id} value={loc._id}>
                        {loc.name.toUpperCase()}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                {/* Qualification */}
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    label="Qualification"
                    name="qualificationId"
                    select
                    fullWidth
                    value={mode === "add" ? addVacancy.qualificationId : editVacancy.qualificationId}
                    onChange={handleInputChange}
                  >
                    {qualifications.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name.toUpperCase()}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                {/* Experience */}
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    label="Experience (years)"
                    name="experience"
                    select
                    fullWidth
                    value={mode === "add" ? addVacancy.experience : editVacancy.experience}
                    onChange={handleInputChange}
                  >
                    {["Fresher", "0-1", "1-2", "2-3", "3-4", "Other"].map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                {/* Custom Experience */}
                {(mode === "add" ? addVacancy.experience : editVacancy.experience) === "Other" && (
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Enter Custom Experience"
                      name="customExperience"
                      fullWidth
                      value={mode === "add" ? addVacancy.customExperience : editVacancy.customExperience}
                      onChange={handleInputChange}
                    />
                  </Grid>
                )}
              </>
            )}

           {activeStep===1 &&  <>
            <Grid item xs={12} md={6}>
                <CustomTextField
                label="No. of Positions"
                name="noOfPosition"
                fullWidth
                type="number"
                value={mode==="add" ? addVacancy.noOfPosition : editVacancy.noOfPosition}
                 onChange={handleInputChange }
                />
            </Grid>
          <Grid item xs={12} md={6}>
          <CustomTextField
                label="Budget"
                name="budget"
                fullWidth
                type="number"
                value={mode==="add" ? addVacancy.budget : editVacancy.budget}
                 onChange={handleInputChange }
                />
              </Grid>
           </> 
            }
           {activeStep===2 && <>
            <Grid item xs={12} md={6} sx={{display:"flex", alignItems:"center", mt:4}}>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 'add' ? addVacancy.AI_Screening : editVacancy.AI_Screening}
                  onChange={handleInputChange}
                  name="AI_Screening"
                />
              }
              label="AI Screening"
            />
          </Grid>
           {(addVacancy.AI_Screening || editVacancy.AI_Screening) && 
           <Grid item xs={12} md={6}>
                <CustomTextField
                label="AI Eligibility Percentage"
                name="AI_Percentage"
                fullWidth
                value={mode==="add" ? addVacancy?.AI_Percentage : editVacancy?.AI_Percentage}
                onChange={handleInputChange}
                />
            </Grid>}
            </>}

            {activeStep === 3 && (
          <Grid container spacing={2} sx={{px:4}}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" gutterBottom>
                  Job Description
                </Typography>
                <Button variant="outlined" size='small' onClick={() =>getJobDescription(addVacancy.designationId || editVacancy.designationId)}>
                  Use AI
                </Button>
              </Box>
            </Grid>

            {(addVacancy.designationId || editVacancy.designationId) && jobDescription?.length > 0 ? (
              <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                  {jobDescription.map((desc) => (
                    <Grid item xs={12} key={desc._id}>
                      <Box display="flex" alignItems="center">
                        <input
                          type="radio"
                          name="jobDescriptionId"
                          value={desc._id}
                          checked={
                            (mode === "add" ? addVacancy.jobDescriptionId : editVacancy.jobDescriptionId) === desc._id
                          }
                          onChange={handleInputChange}
                        />
                        <Typography fontSize={12} sx={{ ml: 1, mr: 2 }}>
                          {desc?.position?.toUpperCase()}
                        </Typography>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleDesc(desc.jobDescription)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>No Job Description Found</Typography>
              </Grid>
            )}
          </Grid>
)}

          
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
  <Button
    disabled={activeStep === 0}
    onClick={() => setActiveStep((prev) => prev - 1)}
  >
    Back
  </Button>
 {activeStep !== steps.length - 1 && <Button
    onClick={() => setActiveStep((prev) => prev + 1)}
    variant="contained"
  >
    Next
  </Button>}
 { activeStep === steps.length - 1 && <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-end", gap:3, mt:3}}>
                <Button variant="outlined" color='secondary' sx={{width:"170px"}} onClick={()=> {setOpenAdd(false);  setAddVacancy({
                organizationId:orgs?._id,
                departmentId: "",
                designationId:"",
                employmentTypeId: "",
                employeeTypeId:"",
                branchId: [],
                qualificationId: "",
                experience: "",
                priority: "medium",
                package: "",
                noOfPosition: 0,
                jobDescriptionId: "",
                vacancyType:"request",
                status: "active",
                AI_Screening: false,
                AI_Percentage:0
            });
            setDesignation([])
            setJobDescription([])}}>Cancel</Button>
                <Button variant="contained" color='primary' sx={{width:"170px"}} onClick={mode==="add" ? handleVacancyRequest : handleEditVacancyRequest}>Submit</Button>
            </Grid>}
</Grid>

  </Grid>

</Box>
        </Modal>
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
