'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Paper,
  ListItemText,
  Stack,
  Avatar,
  Container,
  FormControl,
  Breadcrumbs,
  Link,
  Dialog,
  Select,
  InputLabel,
  MenuItem,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  Checkbox,
  Switch,
  Modal,
  Tooltip,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
  ArrowBack,
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
  WorkOutline,
  Cancel
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { Close } from '@mui/icons-material' // Fixed: Changed PersonIcon back to Person
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useApi } from '@/app/api/useApi'
// Styled Components with refined typography
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#fafbfc',
  minHeight: '100vh',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif'
}))

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

// Styled components
const DocumentContainer = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  margin: '40px auto',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: 'Georgia, serif',
  lineHeight: 1.8,
  color: '#333'
}))

const DocTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(4),
  fontFamily: 'Times New Roman, serif',
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1)
}))

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 600,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(1),
  fontFamily: 'Georgia, serif'
}))

const Paragraph = styled(Typography)(({ theme }) => ({
  textAlign: 'justify',
  fontSize: '1rem',
  color: '#444',
  marginBottom: theme.spacing(2),
  whiteSpace: 'pre-line'
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

const ApplyButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  padding: theme.spacing(1, 3),
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: '#1d4ed8',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
  }
}))

const BackButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(2),
  width: 36,
  height: 36,
  '&:hover': {
    backgroundColor: '#f9fafb'
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

export default function JobDescription({ row, setJd, portalData ,organizationId}) {
  const [jobDesc, setJobDesc] = useState({})
  const token = window.localStorage.getItem('authToken')
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [openApply, setOpenApply] = useState(false)
  const [errors, setErrors] = useState({})
  const { callApi } = useApi()
  const [openPrivacy, setOpenPrivacy] = useState(false)
  const [openTandC, setOpenTandC] = useState(false)
  const [structuredContent, setStructuredContent] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    emailId: '',
    highestQualification: '',
    university: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    skills: '',
    resume: '',
    preferedInterviewMode: '',
    position: '',
    branchId: [],
    knewaboutJobPostFrom: '',
    currentDesignation: '',
    lastOrganization: '',
    startDate: '',
    endDate: '',
    reasonLeaving: '',
    totalExperience: 0,
    currentCTC: 0,
    expectedCTC: 0,
    currentLocation: '',
    internalReferenceName: '',
    gapIfAny: '',
    jobPostId: '',
    agreePrivacyPolicy: false,
    immediatejoiner: false,
    branchId:[]
  })
  const [uploading, setUpLoading] = useState(false)
  const [isExperienced, setIsExperienced] = useState(null)
  const [isIntern, setIsIntern] = useState(null)
  const [mode, setMode] = useState('privacy')

  const getAllJobs = async () => {
    try {
        const res = await axios.get(`${baseUrl}/v1/api/jobPost/getDetail?jobPostId=${row._id}`, {
          headers: {
            'Content-Type': 'application/json',
             authorization: token
          }
        })
        if(res.data.status){
              setJobDesc(res.data.items)
              console.log("res",res)
          }
      } catch (error) {
          console.error("error",error)
      }
  }

  useEffect(() => {
   getAllJobs()
  },[row])

  const handleResumeUpload = async file => {
    if (!file) {
      setErrors(prev => ({ ...prev, resume: 'Please upload a resume file.' }))
      return
    }

    const allowedTypes = [
      'application/pdf',
    ]

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        resume: 'Only PDF files are allowed.'
      }))
      return
    }

    setUpLoading(true)

    try {
      const fileFormData = new FormData()
      fileFormData.append('file', file)

      const response = await callApi({
        endpoint: `/v1/api/upload/uploadSingle`,
        method: 'POST',
        data: fileFormData,
        disableSnackbar: false
      })

      if (response.data.success && response?.data?.url) {
        setFormData(prev => ({
          ...prev,
          resume: response.data.url
        }))
        setErrors(prev => ({ ...prev, resume: '' })) // ✅ Clear previous errors
      } else {
        setErrors(prev => ({
          ...prev,
          resume: 'Resume upload failed. Try again.'
        }))
      }
    } catch (error) {
      console.error('❌ Error uploading resume:', error)
      setErrors(prev => ({
        ...prev,
        resume: 'Failed to upload resume. Please try again.'
      }))
    } finally {
      setUpLoading(false)
    }
  }

  useEffect(() => {
    const blocks =
      mode === 'privacy'
        ? portalData?.privacyPolicy
            ?.split('\n')
            .map(str => str.trim())
            .filter(Boolean)
        : portalData?.termsAndConditions
            ?.split('\n')
            .map(str => str.trim())
            .filter(Boolean)

    const structured = []
    let currentSection = { title: null, content: [] }

    blocks?.forEach(line => {
      if (/^[A-Z].*[\.\?\:]?$/.test(line) && line.length < 100) {
        // Treat as heading if it starts with a capital and is short
        if (currentSection.content.length > 0) {
          structured.push({ ...currentSection })
        }
        currentSection = { title: line, content: [] }
      } else {
        currentSection.content.push(line)
      }
    })

    if (currentSection.content.length > 0) {
      structured.push({ ...currentSection })
    }

    setStructuredContent(structured)
  }, [mode, portalData])

  const jobDetails = [
    ...(portalData?.jobApplyDetail?.JobType
      ? [{
          label: 'Job Type',
          value: jobDesc?.employeeType?.title || jobDesc?.employeeTypeId?.title || '-',
          icon: <Work fontSize='small' />
        }]
      : []),
      ...(portalData?.jobApplyDetail?.department
        ? [{
      label: 'Department',
      value: jobDesc?.department?.name || jobDesc?.departmentId?.name || '-',
      icon: <Business fontSize='small' />
    }]
    : []),
    ...(portalData?.jobApplyDetail?.experience
      ? [{
      label: 'Experience Years',
      value: jobDesc?.experience?.toLowerCase() === 'fresher' ? 'Fresher' : `${jobDesc?.experience || 0} Years`,
      icon: <Schedule fontSize='small' />
    }]
    : []),
    ...(portalData?.jobApplyDetail?.qualification
      ? [{
      label: 'Qualification',
      value: jobDesc?.qualification?.map(i => i.name).join(', ') || '-',
      icon: <School fontSize='small' />
    }]
    : []),
    ...(portalData?.jobApplyDetail?.employmentType
      ? [{
      label: 'Employment Type',
      value: jobDesc?.employmentType?.title?.toUpperCase() || jobDesc?.employmentTypeId?.title?.toUpperCase() || '-',
      icon: <Work fontSize='small' />
    }]
    : []),
    ...(portalData?.jobApplyDetail?.package
      ? [{
      label: 'Package(CTC)',
      value: jobDesc?.package && jobDesc?.package !== '0' ? jobDesc?.package : '-',
      icon: <CurrencyRupee fontSize='small' />
    }]
    : []),
    ...(portalData?.jobApplyDetail?.gender
      ? [{
      label: 'Gender Required',
      value: jobDesc?.gender && jobDesc?.gender==="Both" ? "Both (Male, Female)" : jobDesc?.gender || '-',
      icon: <CurrencyRupee fontSize='small' />
    }]
    : []),
    ...(portalData?.jobApplyDetail?.noOfPosition
      ? [{
      label: 'No. of Positions',
      value: jobDesc?.noOfPosition || '-',
      icon: <Group fontSize='small' />
    }]
    : []),
    ...(portalData?.jobApplyDetail?.AgeLimit
      ? [{
      label: 'Age Limit',
      value: `${jobDesc?.AgeLimit || 0} Years` || '-',
      icon: <Group fontSize='small' />
    }]
    : []),
    ...(portalData?.jobApplyDetail?.employeeType
      ? [{
      label: 'Type of Employee',
      value: jobDesc?.employeeType?.title || '-',
      icon: <Group fontSize='small' />
    }]
    : []),
  ]
  
  const handleSave = async () => {
    const newErrors = {}


    // Full Name
    if (!formData.name?.trim()) {
      newErrors.name = 'Full name is required'
    } else if (!/^[a-zA-Z\s]{2,}$/.test(formData.name)) {
      newErrors.name = 'Enter a valid full name'
    }

    // Email
    if (!formData.emailId?.trim()) {
      newErrors.emailId = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = 'Enter a valid email address'
    }

    // Mobile
    if (!formData.mobileNumber?.trim()) {
      newErrors.mobileNumber = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit phone number'
    }

    // Pincode
    if (!formData.pincode?.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode'
    }

    // Privacy Policy
    if (!formData.agreePrivacyPolicy) {
      newErrors.agreePrivacyPolicy = 'You must agree before submitting.'
    }

    // Resume
    if (!formData.resume) {
      newErrors.resume = 'Please upload your resume.'
    }
    if (!formData.branchId || formData.branchId.length === 0) {
      newErrors.branchId = 'At least one location must be selected';
    }

    // Set errors
    setErrors(newErrors)

    // Abort if any errors exist
    if (Object.keys(newErrors).length > 0) return

    // Submit logic
    try {
      const res = await callApi({
        endpoint: `/v1/api/job/jobapply`,
        method: 'POST',
        data: {
          ...formData,
          jobPostId: jobDesc._id
        },
        disableSnackbar: false
      })

      if (res.data.status) {
        console.log('Submitted successfully:', res)
        setFormData({
          name: '',
          mobileNumber: '',
          emailId: '',
          highestQualification: '',
          university: '',
          address: '',
          state: '',
          city: '',
          pincode: '',
          skills: '',
          resume: '',
          preferedInterviewMode: '',
          position: '',
          branchId: '',
          knewaboutJobPostFrom: '',
          currentDesignation: '',
          lastOrganization: '',
          startDate: '',
          endDate: '',
          reasonLeaving: '',
          totalExperience: 0,
          currentCTC: 0,
          expectedCTC: 0,
          currentLocation: '',
          internalReferenceName: '',
          gapIfAny: '',
          jobPostId: '',
          agreePrivacyPolicy: false,
          immediatejoiner: false,
          branchId:[]
        })
      }
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setOpenApply(false)
    }
  }

  const formatIndianNumber = value => {
    const raw = value.replace(/,/g, '')
    if (isNaN(Number(raw))) return value

    const parts = raw.split('.')
    let integer = parts[0]
    const decimal = parts.length > 1 ? '.' + parts[1] : ''

    let lastThree = integer.slice(-3)
    const otherNumbers = integer.slice(0, -3)
    if (otherNumbers !== '') lastThree = ',' + lastThree

    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + decimal

    return formatted
  }

  const [allBranches, setAllBranches] = useState([])

  const getAllBranch = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/branch/getAll?organizationId=${organizationId}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      if (res.data.status) {
        setAllBranches(res.data.items)
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  useEffect(() => {
    getAllBranch()
  }, [])

  const [BranchData, setBranchData] = useState({})
 
    const getAllBranchWorkLocation = async (id) => {
    try {
      const res = await axios.post(`${baseUrl}/v1/api/branch/getBranchByJobPost?organizationId=${organizationId}&jobPostId=${id}`,{}, {
      headers: {
      'Content-Type': 'application/json',
      }
      })
      if (res.data.status) {
        setBranchData(res.data.items)
      }
     } catch (error) {
        console.error('error', error)
    }
    }
        
    useEffect(()=>{
      if(jobDesc._id)
        { getAllBranchWorkLocation(jobDesc._id)}
    },[jobDesc, organizationId])

  return (
    <StyledContainer maxWidth='lg'>
      <BackButton onClick={() => setJd(false)}>
        <ArrowBack sx={{ color: '#6b7280', fontSize: 20 }} />
      </BackButton>

      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2, fontSize: '14px' }}>
        <Link
          underline='hover'
          color='#6b7280'
          sx={{ cursor: 'pointer', fontSize: '14px' }}
          onClick={() => setJd(false)}
        >
          Careers
        </Link>
        <Typography color='#111827' fontWeight={500} fontSize='14px'>
          Job Details
        </Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <HeaderCard>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={12} md={8}>
              <Typography variant='h5' fontWeight='600' sx={{ mb: 1, fontSize: '24px' }}>
                {portalData?.jobApplyDetail?.positionName && (jobDesc?.position || 'Position Title')}
              </Typography>
             {portalData?.jobApplyDetail?.branch && <Tooltip
                followCursor
                title={
                Array.isArray(BranchData)
                ? BranchData.map(i => i.name).join(', ')
                : ''
                }
                >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOn sx={{ fontSize: 16 }} />
                <Typography variant='body1' sx={{ opacity: 0.9, fontSize: '14px' }}>
                {jobDesc?.branch
                ? jobDesc.branch.map(b => b.name).join(', ')
                : 'Location'}
                </Typography>
                </Box>
                </Tooltip>}
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
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  alignItems: { xs: 'flex-start', md: 'flex-end' }
                }}
              >
                {/* <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}
                  >
                    <Share fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}
                  >
                    <Bookmark fontSize="small" />
                  </IconButton>
                </Stack> */}
                <ApplyButton
                  variant='contained'
                  startIcon={<CheckCircle fontSize='small' />}
                  onClick={() => {
                    // const selectionData = {
                    //   jobPostId: jobDesc?._id,
                    //   branchId: jobDesc.branch?.[0]?._id,
                    //   departmentId: jobDesc.department?._id,
                    // }
                    // localStorage.setItem("selectedJobData", JSON.stringify(selectionData))
                    // router.push("/login")
                    setOpenApply(true)
                  }}
                  sx={{
                    bgcolor: 'white',
                    color: '#2563eb',
                    '&:hover': {
                      bgcolor: '#f9fafb'
                    }
                  }}
                >
                  Apply Now
                </ApplyButton>
              </Box>
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
              {portalData?.jobApplyDetail?.JobSummary && <Box sx={{ mb: 3 }}>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Job Summary
                </Typography>
                <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant='body2' sx={{ lineHeight: 1.6, color: '#4b5563', fontSize: '14px' }}>
                    {jobDesc?.jobDescription?.jobDescription?.JobSummary || 'Job summary not available'}
                  </Typography>
                </Paper>
              </Box>}

              {/* Roles and Responsibilities */}
              {portalData?.jobApplyDetail?.rolesAndResponsibilities &&  <Box sx={{ mb: 3 }}>
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
              </Box>}
            </CardContent>
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

          {/* <InfoCard>
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

          {/* Job Stats */}
          <InfoCard sx={{ mt: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant='h6' fontWeight={600} sx={{ mb: 2, color: '#374151', fontSize: '16px' }}>
                Job Statistics
              </Typography>
              <Stack spacing={2}>
              {portalData?.jobApplyDetail?.jobPostTime && <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ color: '#6b7280', fontSize: 16 }} />
                    <Typography variant='body2' color='#6b7280' sx={{ fontSize: '14px' }}>
                      Posted
                    </Typography>
                  </Box>
                  

                  <Typography variant='body2' fontWeight={600} sx={{ fontSize: '14px' }}>
                    {jobDesc?.createdAt
                      ? formatDistanceToNow(new Date(jobDesc.updatedAt), { addSuffix: true })
                      : 'Date unavailable'}
                  </Typography>
                </Box>}

                {portalData?.jobApplyDetail?.expiredDate && <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ color: '#6b7280', fontSize: 16 }} />
                    <Typography variant='body2' color='#6b7280' sx={{ fontSize: '14px' }}>
                      Expiring
                    </Typography>
                  </Box>
                  

                  <Typography variant='body2' fontWeight={600} sx={{ fontSize: '14px' }}>
                    {jobDesc?.expiredDate
                      ? formatDistanceToNow(new Date(jobDesc.expiredDate), { addSuffix: true })
                      : 'Date unavailable'}
                  </Typography>
                </Box>}

                {portalData?.jobApplyDetail?.applicationCount && <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ color: '#6b7280', fontSize: 16 }} />
                    <Typography variant='body2' color='#6b7280' sx={{ fontSize: '14px' }}>
                      Applicants
                    </Typography>
                  </Box>
                  <Typography variant='body2' fontWeight={600} sx={{ fontSize: '14px' }}>
                    {jobDesc.totalApplicants}
                  </Typography>
                </Box>}
              </Stack>
            </CardContent>
          </InfoCard>

         {portalData?.jobApplyDetail?.keySkills && <InfoCard sx={{ mt: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Box>
                <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '16px' }}>
                  Key Skills Required
                </Typography>
                {/* <Paper sx={{ p: 2.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}> */}
                {(jobDesc?.jobDescription?.jobDescription?.KeySkills || []).length > 0 ? (
                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                 {jobDesc.jobDescription.jobDescription.KeySkills.map((skill, index) => (
                   <SkillChip
                     key={index}
                     label={
                       <Typography
                         variant="body2"
                         sx={{
                           whiteSpace: 'normal',  // allow wrapping
                           overflowWrap: 'break-word',
                           wordBreak: 'break-word',
                           maxWidth: '120px', // adjust as needed
                           color:"#1e40af"
                         }}
                       >
                         {skill}
                       </Typography>
                     }
                     icon={<Star sx={{ fontSize: 14, color:"#1e40af" }} />}
                     sx={{
                       maxWidth: '160px', // optional: restrict overall chip size
                       height: 'auto',     // allow multi-line
                       paddingY: '4px',
                     }}
                   />
                 ))}
               </Box>
               
                ) : (
                  <Typography variant='body2' color='#9ca3af' sx={{ fontSize: '14px' }}>
                    Key skills not specified
                  </Typography>
                )}
                {/* </Paper> */}
              </Box>
            </CardContent>
          </InfoCard>}
        </Grid>
      </Grid>
      <Dialog
        open={openApply}
        onClose={() => setOpenApply(false)}
        maxWidth='sm'
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            backgroundColor: '#fff'
          }
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 3,
            px: 3
          }}
        >
          <Box
            sx={{
              bgcolor: '#dbeafe',
              borderRadius: '8px',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1
            }}
          >
            <Person sx={{ color: '#3b82f6', fontSize: 28 }} />
          </Box>
          <Typography variant='h6' sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2937' }}>
            Apply for a Job
          </Typography>
          <Typography variant='body2' sx={{ color: '#6b7280', mt: 0.5 }}>
            Please fill out the form below to submit your application.
          </Typography>
        </DialogTitle>

        {/* Content */}
        <DialogContent
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            bgcolor: '#fff'
          }}
        >
          {/* Full Name */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', color: 'black', fontWeight: 500, mb: 0.5 }}>Full Name *</Typography>
            <TextField
              name='fullName'
              fullWidth
              size='small'
              placeholder='Enter Your Name'
              required
              value={formData.name}
              onChange={e =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
              variant='outlined'
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Person sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiInputBase-root': { borderRadius: '8px', bgcolor: '#f9fafb' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#3b82f6' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
              }}
            />
          </Box>

          {/* Email Address */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', color: 'black', fontWeight: 500, mb: 0.5 }}>
              Email Address *
            </Typography>
            <TextField
              name='email'
              type='email'
              size='small'
              placeholder='Enter Your Email'
              fullWidth
              value={formData.emailId}
              onChange={e => {
                const email = e.target.value
                setFormData({
                  ...formData,
                  emailId: email
                })

                // Live validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
                if (email === '') {
                  setErrors(prev => ({ ...prev, emailId: 'Email is required' }))
                } else if (!emailRegex.test(email)) {
                  setErrors(prev => ({ ...prev, emailId: 'Enter a valid email (e.g., user@example.com)' }))
                } else {
                  setErrors(prev => ({ ...prev, emailId: '' }))
                }
              }}
              required
              error={!!errors.emailId}
              helperText={errors.emailId || ' '}
              variant='outlined'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Email sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiInputBase-root': { borderRadius: '8px', bgcolor: '#f9fafb' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#3b82f6' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
              }}
            />
            <Typography variant='caption' sx={{ color: '#374151', mt: 0.5, display: 'block', fontSize: '0.8rem' }}>
              This email will be used for all future communications regarding your application.
            </Typography>
          </Box>

          {/* Phone Number */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', color: 'black', fontWeight: 500, mb: 0.5 }}>
              Phone Number *
            </Typography>
            <TextField
              name='phone'
              type='tel'
              size='small'
              placeholder='Enter Your Contact no.'
              fullWidth
              value={formData.mobileNumber}
              onChange={e => {
                const input = e.target.value.replace(/\D/g, '') // Remove non-digits
                if (input.length <= 10) {
                  setFormData({
                    ...formData,
                    mobileNumber: input
                  })
                }
              }}
              inputProps={{
                maxLength: 10
              }}
              required
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber}
              variant='outlined'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Phone sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiInputBase-root': { borderRadius: '8px', bgcolor: '#f9fafb' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#3b82f6' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
              }}
            />
          </Box>

          {/* Pincode */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', color: 'black', fontWeight: 500, mb: 0.5 }}>Locations</Typography>

            <FormControl fullWidth error={!!errors.branchId}>
              <Select
                multiple
                size='small'
                value={formData?.branchId || []}
                onChange={e => {
                  const { value } = e.target
                  setFormData(prev => ({
                    ...prev,
                    branchId: value
                  }))
                  setErrors(prev => ({ ...prev, branchId: '' }))
                }}
                renderValue={selected =>
                  jobDesc?.branch?.
                    filter(branch => selected.includes(branch._id))
                    .map(branch => branch.name)
                    .join(', ')
                }
                sx={{
                  bgcolor: '#f9fafb',
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#3b82f6' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }}
              >
                { jobDesc?.branch?.map(item => (
                  <MenuItem key={item._id} value={item._id}>
                    <Checkbox checked={formData?.branchId?.includes(item._id)} />
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Select>

              {/* Helper text for validation */}
              {errors.branchId && (
                <Typography variant='caption' color='error' sx={{ ml: 2, mt: 0.5 }}>
                  {errors.branchId}
                </Typography>
              )}
            </FormControl>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.9rem', color: 'black', fontWeight: 500, mb: 0.5 }}>
              Pincode of Current Address *
            </Typography>
            <TextField
              name='pinCode'
              type='text'
              fullWidth
              size='small'
              required
              inputProps={{
                maxLength: 6,
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
              value={formData.pincode}
              onChange={e => {
                const value = e.target.value
                // Allow only digits and limit to 6
                if (/^\d{0,6}$/.test(value)) {
                  setFormData({ ...formData, pincode: value })

                  if (value.length === 6) {
                    setErrors(prev => ({ ...prev, pincode: '' }))
                  } else {
                    setErrors(prev => ({ ...prev, pincode: 'Pincode must be exactly 6 digits' }))
                  }
                }
              }}
              placeholder='e.g., 123456'
              variant='outlined'
              error={!!errors.pincode}
              helperText={errors.pincode}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <LocationOn sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiInputBase-root': { borderRadius: '8px', bgcolor: '#f9fafb' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#3b82f6' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
              }}
            />
          </Box>
          {/* Are you experienced? */}
          {jobDesc?.department?.name !== 'Internship' && (
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: 'black', fontWeight: 500, mb: 0.5 }}>
                What is your professional status?
              </Typography>
              <FormControl size='small' fullWidth>
                <Select
                  value={
                    isIntern === true
                      ? 'intern'
                      : isExperienced === true
                        ? 'experienced'
                        : isExperienced === false && isIntern === false
                          ? 'fresher'
                          : ''
                  }
                  onChange={e => {
                    const value = e.target.value
                    if (value === 'intern') {
                      setIsIntern(true)
                      setIsExperienced(false)
                    } else if (value === 'experienced') {
                      setIsExperienced(true)
                      setIsIntern(false)
                    } else if (value === 'fresher') {
                      setIsExperienced(false)
                      setIsIntern(false)
                    } else {
                      setIsExperienced(null)
                      setIsIntern(null)
                    }
                  }}
                  sx={{
                    bgcolor: '#f9fafb',
                    borderRadius: '8px',
                    '& fieldset': { borderColor: '#d1d5db' },
                    '&:hover fieldset': { borderColor: '#3b82f6' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  }}
                >
                  <MenuItem value='experienced'>Experienced</MenuItem>
                  <MenuItem value='fresher'>Fresher</MenuItem>
                  <MenuItem value='intern'>Intern</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {!isIntern && jobDesc?.department?.name !== 'Internship' && (
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: 'black', fontWeight: 500, mb: 0.5 }}>
                Expected CTC*
              </Typography>
              <TextField
                name='expectedCTC'
                size='small'
                placeholder='e.g. 2,00,000'
                fullWidth
                value={formData.expectedCTC}
                onChange={e => {
                  const rawValue = e.target.value.replace(/,/g, '')
                  const regex = /^\d{0,9}$/ // Up to 9 digits

                  if (rawValue === '' || regex.test(rawValue)) {
                    const formatted = formatIndianNumber(rawValue)
                    setFormData({ ...formData, expectedCTC: formatted })
                  }
                }}
                required
                error={!!errors.expectedCTC}
                helperText={errors.expectedCTC}
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CurrencyRupee sx={{ color: '#9ca3af', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiInputBase-root': { borderRadius: '8px', bgcolor: '#f9fafb' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#d1d5db' },
                    '&:hover fieldset': { borderColor: '#3b82f6' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  }
                }}
              />
            </Box>
          )}

          {isExperienced && (
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: 'black', fontWeight: 500, mb: 0.5 }}>
                Current CTC*
              </Typography>
              <TextField
                name='currentCTC'
                size='small'
                placeholder='e.g. 2,50,000'
                fullWidth
                value={formData.currentCTC}
                onChange={e => {
                  const rawValue = e.target.value.replace(/,/g, '')
                  const regex = /^\d{0,9}$/

                  if (rawValue === '' || regex.test(rawValue)) {
                    const formatted = formatIndianNumber(rawValue)
                    setFormData({ ...formData, currentCTC: formatted })
                  }
                }}
                required
                error={!!errors.currentCTC}
                helperText={errors.currentCTC}
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CurrencyRupee sx={{ color: '#9ca3af', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiInputBase-root': { borderRadius: '8px', bgcolor: '#f9fafb' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#d1d5db' },
                    '&:hover fieldset': { borderColor: '#3b82f6' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  }
                }}
              />
            </Box>
          )}

          {/* Internal Reference */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', color: 'black', fontWeight: 500, mb: 0.5 }}>
              Internal Reference (Optional)
            </Typography>
            <TextField
              name='internalReference'
              type='text'
              size='small'
              fullWidth
              value={formData.internalReferenceName}
              onChange={e =>
                setFormData({
                  ...formData,
                  internalReferenceName: e.target.value
                })
              }
              variant='outlined'
              error={!!errors.internalReferenceName}
              helperText={errors.internalReferenceName}
              placeholder='Enter the Employee Code'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Group sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiInputBase-root': { borderRadius: '8px', bgcolor: '#f9fafb' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#3b82f6' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
              }}
            />
          </Box>

          {/* Resume Upload */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', color: 'black', mb: 1, fontWeight: 500 }}>
              Upload Resume (only PDFs) *
            </Typography>
            <Button
              variant='outlined'
              component='label'
              size='small'
              startIcon={<CloudUpload sx={{ color: '#9ca3af', fontSize: 20 }} />}
              sx={{
                borderRadius: '8px',
                borderColor: '#d1d5db',
                color: '#6b7280',
                textTransform: 'none',
                bgcolor: '#f9fafb',
                px: 2,
                py: 1,
                width: '100%',
                justifyContent: 'flex-start',
                '&:hover': { borderColor: '#3b82f6', bgcolor: '#f0f7ff' }
              }}
            >
              Choose File
              <input
                type='file'
                accept='.pdf'
                onChange={e => handleResumeUpload(e.target.files[0])}
                hidden
              />
            </Button>

            {/* ✅ Show uploaded file */}
            {formData.resume && (
              <Typography variant='body2' sx={{ mt: 1, color: 'green', wordBreak: 'break-word' }}>
                Uploaded:{' '}
                <a href={formData.resume} target='_blank' rel='noopener noreferrer'>
                  {formData.resume.split('/').pop()}
                </a>
              </Typography>
            )}

            {/* ❌ Show error if missing */}
            {errors.resume && (
              <Typography variant='caption' sx={{ color: 'red', mt: 0.5, display: 'block' }}>
                {errors.resume}
              </Typography>
            )}
          </Box>

          {/* Checkboxes */}
          {/* <FormControlLabel
            control={
              <Checkbox
                sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }}
                value={formData.immediatejoiner}
                onChange={e =>
                  setFormData({
                    ...formData,
                    immediatejoiner: e.target.checked
                  })
                }
              />
            }
            label={<Typography sx={{ fontSize: '0.9rem', color: '#374151' }}>I am an immediate joiner.</Typography>}
          /> */}
          <FormControl error={!!errors.agreePrivacyPolicy} sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreePrivacyPolicy}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      agreePrivacyPolicy: e.target.checked
                    })
                  }
                  sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.9rem', color: '#374151' }}>
                  I agree to the{' '}
                  <Box
                    component='span'
                    onClick={() => {
                      setOpenPrivacy(true)
                      setMode('privacy')
                    }}
                    sx={{
                      color: '#3b82f6',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      display: 'inline'
                    }}
                  >
                    Privacy Policy
                  </Box>{' '}
                  and{' '}
                  <Box
                    component='span'
                    onClick={() => {
                      setOpenTandC(true)
                      setMode('tnc')
                    }}
                    sx={{
                      color: '#3b82f6',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      display: 'inline'
                    }}
                  >
                    Terms of Service
                  </Box>
                  .
                </Typography>
              }
            />
            {!!errors.agreePrivacyPolicy && (
              <Typography variant='caption' sx={{ color: 'red', mt: 0.5 }}>
                {errors.agreePrivacyPolicy}
              </Typography>
            )}
          </FormControl>
        </DialogContent>

        {/* Footer */}
        <DialogActions sx={{ p: 3, bgcolor: '#fff', justifyContent: 'center' }}>
          <Button
            variant='contained'
            sx={{
              bgcolor: '#3b82f6',
              color: '#fff',
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
              '&:hover': {
                bgcolor: '#2563eb',
                boxShadow: '0 3px 10px rgba(59, 130, 246, 0.3)'
              }
            }}
            onClick={handleSave}
            disabled={
              !formData.name ||
              !formData.emailId ||
              !formData.mobileNumber ||
              !formData.pincode ||
              !formData.resume ||
              // !formData.currentCTC ||
              // !formData.expectedCTC ||
              // !formData.immediatejoiner ||
              !formData.agreePrivacyPolicy ||
              !formData.branchId.length===0 ||
              Object.values(errors).some(error => error)
            }
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
      <Modal open={openPrivacy} onClose={() => setOpenPrivacy(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            overflow: 'auto'
          }}
        >
          <Container>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <IconButton sx={{ mt: 3 }} color='error' onClick={() => setOpenPrivacy(false)}>
                <Cancel />
              </IconButton>
            </Box>
            <DocumentContainer>
              <DocTitle>Privacy Policy</DocTitle>
              {structuredContent.length > 0 ? (
                structuredContent.map((section, idx) => (
                  <Box key={idx}>
                    {section.title && <SectionHeading>{section.title}</SectionHeading>}
                    {section.content.map((para, i) => (
                      <Paragraph key={i}>{para}</Paragraph>
                    ))}
                  </Box>
                ))
              ) : (
                <Paragraph>Loading Privacy Policy...</Paragraph>
              )}
            </DocumentContainer>
          </Container>
        </Box>
      </Modal>
      <Modal open={openTandC} onClose={() => setOpenTandC(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            overflow: 'auto'
          }}
        >
          <Container>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <IconButton sx={{ mt: 3 }} color='error' onClick={() => setOpenTandC(false)}>
                <Cancel />
              </IconButton>
            </Box>
            <DocumentContainer>
              <DocTitle>Terms and Conditions</DocTitle>
              {structuredContent.length > 0 ? (
                structuredContent.map((section, idx) => (
                  <Box key={idx}>
                    {section.title && <SectionHeading>{section.title}</SectionHeading>}
                    {section.content.map((para, i) => (
                      <Paragraph key={i}>{para}</Paragraph>
                    ))}
                  </Box>
                ))
              ) : (
                <Paragraph>Loading Terms and Condition...</Paragraph>
              )}
            </DocumentContainer>
          </Container>
        </Box>
      </Modal>
    </StyledContainer>
  )
}
