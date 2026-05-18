'use client'

import {
  Container, Box, Typography, Card,
  Grid, TextField, MenuItem,
  IconButton,CardContent,Divider, Avatar, useTheme,
  Button
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import axios from 'axios';
import { useRouter } from "next/navigation"
import loader from "./loader.json"
import Lottie from 'lottie-react';


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

export default function JobPostDashboards() {
    const [dashboardData, setDashboardData] = useState({})
    const token = window.localStorage.getItem("authToken")
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const router = useRouter()
    const [loading, setLoading] = useState(false)

const getDashboardData = async () => {
    setLoading(true)
  try {
      const res = await axios.get(`${baseUrl}/v1/api/jobPost/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
           authorization: token
        }
      })
      if(res.data.status){
            setDashboardData(res.data.items)
            setLoading(false)
      }
  } catch (error) {
      console.error("error",error)
  }
}
  useEffect(()=>{
    getDashboardData()
 },[])
  return (
    <Container>
{!loading ? <Box p={3}>
    <Box sx={{display:"flex",justifyContent:"space-between", alignItems:"center",my:3}}>
    <Typography variant="h5" fontWeight={600} mb={2}>
        📊 Job Dashboard
      </Typography>
      <Button variant='outlined' size='small' onClick={()=>router.push("/Careers")}>Back</Button>
    </Box>


      <Grid container spacing={2} mb={1}>
        {dashboardData?.totals &&
          Object.entries(dashboardData.totals).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Card
                sx={{
                  borderRadius: 3,
                  backgroundColor: colors[key] || '#f5f5f5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Avatar sx={{ bgcolor: "white" }}>{icons[key]}</Avatar>
                    <Typography color="text.secondary" fontSize={15} fontWeight={600} textTransform="capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </Typography>
                  </Box>
                  <Box sx={{width:"100%", display:"flex", justifyContent:"center"}}>
                  <Typography variant="h5" fontWeight={700} mt={1}>
                    {value}
                  </Typography>
                  </Box>
              
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

{dashboardData?.departmentStats?.length>0 && <Typography variant="h5" fontWeight={600} mt={6} mb={2} color="primary.dark">
    🏢 Department Stats
  </Typography>}
      <Grid container spacing={2}>
        {dashboardData?.departmentStats?.map((dept) => (
          <Grid item xs={12} sm={6} md={4} key={dept._id}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
            height:"90px"
          }}
        >
          <CardContent>
          <Box display="flex" alignItems="center" gap={3} mb={2}>
          <ApartmentIcon color='warning' />
              <Typography fontWeight={600} fontSize={14} color='black' mb={0.5}>
                {dept.departmentName.toUpperCase()}
              </Typography>
             </Box> 
              <Typography fontSize={14} color="black">
                Total Positions: <b>{dept.totalPositions}</b>
              </Typography>
         </CardContent>
         </Card>
          </Grid>
        ))}
      </Grid>

      {dashboardData?.branchStats?.length>0 && <Typography variant="h5" fontWeight={600} mt={6} mb={2} color="primary.dark">
      🏬 Branch Distribution
  </Typography>}

  <Grid container spacing={2} mb={4}>
    {dashboardData?.branchStats?.map((branch) => (
      <Grid item xs={12} sm={6} md={3} key={branch._id}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={3} mb={2}>
              <BusinessIcon sx={{ color: '#00796B' }} />
              <Typography variant="subtitle2" fontWeight={600} color="#004D40">
                {branch.branchName.toUpperCase()}
              </Typography>
            </Box>
            <Typography textAlign="center" fontSize={15} fontWeight={500} color="text.primary">
              Jobs: <b>{branch.jobCount}</b>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>

  {dashboardData?.employmentTypeStats?.length>0 &&  <Typography variant="h5" fontWeight={600} mt={6} mb={2} color="primary.dark">
    🧾 Employment Types
  </Typography>}

  <Grid container spacing={2}>
    {dashboardData?.employmentTypeStats?.map((type) => (
      <Grid item xs={12} sm={6} md={3} key={type._id}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={3} mb={2}>
              <AssignmentIndOutlinedIcon sx={{ color: '#D32F2F' }} />
              <Typography variant="subtitle2" fontWeight={600} color="#880E4F">
                {type.employmentType.toUpperCase()}
              </Typography>
            </Box>
            <Typography textAlign="center" fontSize={15} fontWeight={500} color="text.primary">
              Jobs: <b>{type.jobCount}</b>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
    </Box> : <Box sx={{width:"100%", height:"100vh", display:"flex", justifyContent:"center"}}>
    <Lottie animationData={loader} style={{ height: 200 }} /></Box>}
    </Container>
  )
}
