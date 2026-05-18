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
  Alert,
  Stack,Chip,Avatar,Paper,LinearProgress, useTheme
} from '@mui/material';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { styled, keyframes } from '@mui/material/styles'
import {ArrowBack,
  LocationOn,
  Work,
  Business,
  School,
  AttachMoney,
  Group,
  Schedule,
  CheckCircle,
  Star,
  Share,
  Bookmark,
  AccessTime,
  Person,
  Email,
  Phone,
  CloudUpload,
  CurrencyRupee,
  Assessment,
  Psychology,
  People} from '@mui/icons-material';
import { Code, Lightbulb, TrendingUp, Verified } from 'lucide-react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`

const ProgressBar = styled(LinearProgress)(({ value }) => {
  const getProgressColor = (value) => {
    if (value >= 90) return "#10b981" // Green
    if (value >= 70) return "#3b82f6" // Blue
    if (value >= 50) return "#f59e0b" // Yellow/Orange
    return "#ef4444" // Red
  }
})

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
  color: 'white',
  borderRadius: '8px',
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
  border: '1px solid #e5e7eb'
}))

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }
}))

const DetailItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '6px',
  backgroundColor: '#f9fafb',
  border: '1px solid #f3f4f6',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb'
  }
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#111827',
  marginBottom: theme.spacing(2),
  fontSize: '18px',
  fontFamily: '"Inter", sans-serif'
}))

const SkillChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#eff6ff',
  color: '#1e40af',
  fontWeight: 500,
  fontSize: '12px',
  height: '28px',
  overflowX:"hidden",
  borderRadius: '6px',
  '&:hover': {
    backgroundColor: '#dbeafe'
  }
}))

  const getCriteriaIcon = (criteria) => {
    const criteriaLower = criteria?.toLowerCase()
    if (criteriaLower?.includes("skill")) return <Code />
    if (criteriaLower?.includes("experience")) return <Work />
    if (criteriaLower?.includes("education")) return <School />
    if (criteriaLower?.includes("cultural") || criteriaLower?.includes("fit")) return <People />
    if (criteriaLower?.includes("learning")) return <Lightbulb />
    if (criteriaLower?.includes("leadership") || criteriaLower?.includes("initiative")) return <TrendingUp />
    if (criteriaLower?.includes("communication")) return <Assessment />
    if (criteriaLower?.includes("project")) return <Psychology />
    if (criteriaLower?.includes("certification")) return <Verified />
    return <Assessment />
  }

export default function jobDescription() {
  const [jobDesc, setJobDesc] = useState({})
  const token = window.localStorage.getItem("authToken")
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const theme = useTheme()

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    });

    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
      };

  const getAllJobs = async () => {
    try {
        const res = await axios.get(`${baseUrl}/v1/api/jobPost/getDetail?jobPostId=${id}`, {
          headers: {
            'Content-Type': 'application/json',
             authorization: token
          }
        })
        if(res.data.status){
              setJobDesc(res.data.items)
          }
      } catch (error) {
          console.error("error",error)
      }
  }

useEffect(()=>{
  getAllJobs()
},[id])

const jobDetails = [
  {
    label: 'Job Type',
    value: jobDesc?.employeeType?.title || jobDesc?.employeeTypeId?.title || '-',
    icon: <Work fontSize='small' />
  },
  {
    label: 'Department',
    value: jobDesc?.department?.name || jobDesc?.departmentId?.name || '-',
    icon: <Business fontSize='small' />
  },
  {
    label: 'Experience Years',
    value: jobDesc?.experience ? jobDesc?.experience==="0 - 0" ? "Fresher" : `${jobDesc.experience} Years` : '-',
    icon: <Schedule fontSize='small' />
  },
  {
    label: 'Qualification',
    value: jobDesc?.qualification?.map(i => i.name).join(', ') || '-',
    icon: <School fontSize='small' />
  },
  {
    label: 'Package',
    value: jobDesc?.package && jobDesc?.package !== '0' ? `${jobDesc?.package}` : '-',
    icon: <CurrencyRupee fontSize='small' />
  },
  {
    label: 'Employment Type',
    value: jobDesc?.employmentType?.title?.toUpperCase() || jobDesc?.employmentTypeId?.title?.toUpperCase() || '-',
    icon: <Work fontSize='small' />
  },
  {
    label: 'No. of Positions',
    value: jobDesc?.noOfPosition || '-',
    icon: <Group fontSize='small' />
  }
]


const [animationVisible, setAnimationVisible] = useState(false)
useEffect(() => {
  setAnimationVisible(true)
}, [])

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <IconButton sx={{mt:-2, mb:2}} onClick={()=>router.push("/jobpost?stage=1")}>
      <ArrowBack fontSize='medium' color='#66b2ff' fontWeight={600}/>
      </IconButton>
      <HeaderCard>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={12} md={8}>
              <Typography color='white' variant='h5' fontWeight='600' sx={{ mb: 1, fontSize: '24px' }}>
                {jobDesc?.position || 'Position Title'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color:"white" }}>
                <LocationOn sx={{ fontSize: 16 }} />
                <Typography variant='body1' color='white' sx={{ opacity: 0.9, fontSize: '14px' }}>
                  {jobDesc?.branch
                    ? jobDesc?.branch?.map(b => b.name).join(', ')
                    : jobDesc?.branchId
                      ? jobDesc?.branchId?.map(b => b.name).join(', ')
                      : 'Location'}
                </Typography>
              </Box>
              {/* <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                <Chip
                  label='Full Time'
                  size='small'
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '12px',
                    height: '24px'
                  }}
                />
                <Chip
                  label='Remote Friendly'
                  size='small'
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '12px',
                    height: '24px'
                  }}
                />
                <Chip
                  label='Benefits Included'
                  size='small'
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '12px',
                    height: '24px'
                  }}
                />
              </Stack> */}
            </Grid>
          </Grid>
        </CardContent>
      </HeaderCard>

      <Grid container spacing={3}>
        {/* Job Details Section */}
        <Grid item xs={12} md={8}>
          <InfoCard>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle>Job Details</SectionTitle>
              <Grid container spacing={2}>
                {jobDetails.map((detail, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <DetailItem>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#eff6ff', color: '#1e40af', width: 32, height: 32 }}>
                          {detail.icon}
                        </Avatar>
                        <Box>
                          <Typography variant='caption' color='#6b7280' fontWeight={500} sx={{ fontSize: '12px' }}>
                            {detail.label}
                          </Typography>
                          <Typography variant='body2' fontWeight={600} color='#111827' sx={{ fontSize: '14px' }}>
                            {detail.value}
                          </Typography>
                        </Box>
                      </Box>
                    </DetailItem>
                  </Grid>
                ))}
                {/* <Grid item xs={12}>
                  <DetailItem>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#eff6ff', color: '#1e40af', width: 32, height: 32 }}>
                        <LocationOn fontSize='small' />
                      </Avatar>
                      <Box>
                        <Typography variant='caption' color='#6b7280' fontWeight={500} sx={{ fontSize: '12px' }}>
                          Address
                        </Typography>
                        <Typography variant='body2' fontWeight={600} color='#111827' sx={{ fontSize: '14px' }}>
                          {jobDesc?.branch
                            ? jobDesc?.branch?.map(b => b.address).join(', ')
                            : jobDesc?.branchId
                              ? jobDesc?.branchId?.map(b => b.address).join(', ')
                              : 'Address not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </DetailItem>
                </Grid> */}
              </Grid>
            </CardContent>
          </InfoCard>

          {/* Job Description Section */}
          <InfoCard sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle>Job Description</SectionTitle>

              {/* Job Summary */}
              <Box sx={{ mb: 3 }}>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Job Summary
                </Typography>
                <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant='body2' sx={{ lineHeight: 1.6, color: '#4b5563', fontSize: '14px' }}>
                    {jobDesc?.jobDescription?.jobDescription?.JobSummary || 'Job summary not available'}
                  </Typography>
                </Paper>
              </Box>

              {/* Roles and Responsibilities */}
              <Box sx={{ mb: 3 }}>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Roles and Responsibilities
                </Typography>
                <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  {(jobDesc?.jobDescription?.jobDescription?.RolesAndResponsibilities || []).length > 0 ? (
                    <Stack spacing={1.5}>
                      {jobDesc.jobDescription.jobDescription.RolesAndResponsibilities.map((role, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 16, mt: 0.2 }} />
                          <Typography variant='body2' sx={{ lineHeight: 1.5, color: '#4b5563', fontSize: '14px' }}>
                            {role}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant='body2' color='#9ca3af' sx={{ fontSize: '14px' }}>
                      Roles and responsibilities not specified
                    </Typography>
                  )}
                </Paper>
              </Box>

            </CardContent>
          </InfoCard>
          <InfoCard sx={{ p : 3, mt:2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
            <Typography sx={{
                fontWeight: 600,
                color: '#111827',
                fontSize: '18px',
                fontFamily: '"Inter", sans-serif'
              }}>Screening Criteria</Typography>
            </Grid>
            {jobDesc?.screeningCriteria
              ?.filter(criterion => criterion.weight > 0)
              .map((criterion, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                      height: "100%",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      },
                      animation: `${fadeIn} 0.5s ease-out forwards ${index * 0.1}s`,
                      opacity: animationVisible ? 1 : 0,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor:
                            criterion.weight >= 90
                              ? "#dcfce7"
                              : criterion.weight >= 70
                              ? "#dbeafe"
                              : criterion.weight >= 50
                              ? "#fef3c7"
                              : "#fee2e2",
                          color:
                            criterion.weight >= 90
                              ? "#10b981"
                              : criterion.weight >= 70
                              ? "#3b82f6"
                              : criterion.weight >= 50
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      >
                        {getCriteriaIcon(criterion.name)}
                      </Avatar>
                      <Typography variant="h6" fontWeight="600">
                        {criterion.name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Weight
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {criterion.weight}%
                        </Typography>
                      </Box>
                      <ProgressBar variant="determinate" value={criterion.weight} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {criterion.description}
                    </Typography>
                  </Paper>
                </Grid>
            ))}
          </Grid>
          </InfoCard>

        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* <InfoCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#374151", fontSize: "16px" }}>
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  startIcon={<Share fontSize="small" />}
                  sx={{
                    borderColor: "#e5e7eb",
                    color: "#6b7280",
                    fontSize: "14px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#2563eb",
                      color: "#2563eb",
                      bgcolor: "#f9fafb",
                    },
                  }}
                >
                  Share Job
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  startIcon={<Bookmark fontSize="small" />}
                  sx={{
                    borderColor: "#e5e7eb",
                    color: "#6b7280",
                    fontSize: "14px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#2563eb",
                      color: "#2563eb",
                      bgcolor: "#f9fafb",
                    },
                  }}
                >
                  Save for Later
                </Button>
              </Stack>
            </CardContent>
          </InfoCard> */}

          {/* <InfoCard sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant='h6' fontWeight={600} sx={{ mb: 2, color: '#374151', fontSize: '16px' }}>
                Company Benefits
              </Typography>
              <Stack spacing={1.5}>
                {[
                  'Health Insurance',
                  'Flexible Working Hours',
                  'Professional Development',
                  'Performance Bonuses',
                  'Team Building Activities'
                ].map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
                    <Typography variant='body2' color='#6b7280' sx={{ fontSize: '14px' }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </InfoCard> */}

          <InfoCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant='h6' fontWeight={600} sx={{ mb: 2, color: '#374151', fontSize: '16px' }}>
                Job Statistics
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ color: '#6b7280', fontSize: 16 }} />
                    <Typography variant='body2' color='#6b7280' sx={{ fontSize: '14px' }}>
                      Posted
                    </Typography>
                  </Box>

                  <Typography variant='body2' fontWeight={600} sx={{ fontSize: '14px' }}>
                    {jobDesc?.createdAt
                      ? formatDistanceToNow(new Date(jobDesc.createdAt), { addSuffix: true })
                      : 'Date unavailable'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ color: '#6b7280', fontSize: 16 }} />
                    <Typography variant='body2' color='#6b7280' sx={{ fontSize: '14px' }}>
                      Applicants
                    </Typography>
                  </Box>
                  <Typography variant='body2' fontWeight={600} sx={{ fontSize: '14px' }}>
                    {jobDesc?.totalApplicants}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </InfoCard>

          <InfoCard sx={{ mt: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Box>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Key Skills Required
                </Typography>
                {/* <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}> */}
                {(jobDesc?.jobDescription?.jobDescription?.KeySkills || []).length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {jobDesc.jobDescription.jobDescription.KeySkills.map((skill, index) => (
                      <SkillChip
                     key={index}
                     label={
                       <Typography
                         fontSize={13}
                         fontWeight={500}
                         sx={{
                           whiteSpace: 'normal',  
                           overflowWrap: 'break-word',
                           wordBreak: 'break-word',
                           maxWidth: '120px', 
                         }}
                       >
                         {skill}
                       </Typography>
                     }
                     icon={<Star sx={{ fontSize: 14 }} />}
                     sx={{
                       maxWidth: '160px', // optional: restrict overall chip size
                       height: 'auto',     // allow multi-line
                       paddingY: '4px',
                       color:"#1e40af"
                     }}
                   />                    ))}
                  </Box>
                ) : (
                  <Typography variant='body2' color='#9ca3af' sx={{ fontSize: '14px' }}>
                    Key skills not specified
                  </Typography>
                )}
                {/* </Paper> */}
              </Box>
            </CardContent>
          </InfoCard>

        </Grid>
      </Grid>
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
