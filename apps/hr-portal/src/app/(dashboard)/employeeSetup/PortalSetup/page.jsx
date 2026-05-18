'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Link,
  Tooltip,
  IconButton,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Fade,
  Stack,
  Tabs,
  TextField,
  Typography,Checkbox, FormGroup,
} from '@mui/material'
import {
  ArrowBack,
  Edit,
  Public,
  Description,
  Settings,
  People,
  Security,
  Image,
  CheckCircle,
  Cancel,
  CloudUpload,
  ContentCopy,
  ViewModule,
  Visibility
} from '@mui/icons-material'
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`portal-tabpanel-${index}`}
      aria-labelledby={`portal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function StatusCard({ title, icon, children, color = "primary" }) {
  return (
 <Card
 elevation={0}
 sx={{
 height: "100%",
 borderRadius: 3,
 background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)",
 backdropFilter: "blur(10px)",
 border: "1px solid rgba(0,0,0,0.08)",
 transition: "all 0.3s ease",
 "&:hover": {
 transform: "translateY(-4px)",
 boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  },
  }}
 >
 <CardHeader
 title={
 <Box display="flex" alignItems="center" gap={2}>
 <Box
 sx={{
 p: 1.5,
 borderRadius: 2,
 background: `linear-gradient(135deg, ${color === "primary" ? "#1976d2" : color === "success" ? "#4caf50" : color === "warning" ? "#ff9800" : "#9c27b0"}15 0%, ${color === "primary" ? "#1976d2" : color === "success" ? "#4caf50" : color === "warning" ? "#ff9800" : "#9c27b0"}05 100%)`,
 color:
 color === "primary"
  ? "#1976d2"
  : color === "success"
  ? "#4caf50"
  : color === "warning"
  ? "#ff9800"
  : "#9c27b0",
  }}
 >
 {icon}
 </Box>
 <Typography variant="h6" fontWeight={600} color="text.primary">
 {title}
 </Typography>
 </Box>
 }
 sx={{ pb: 1 }}
 />
 <CardContent sx={{ pt: 0 }}>{children}</CardContent>
 </Card>
  )
 }

 const toProperCase = (str) =>
  str
    .replace(/([A-Z])/g, ' $1')        
    .replace(/^./, (char) => char.toUpperCase()) 
    .trim()

export default function PortalSetup() {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter()
  const [portalData, setPortalData] = useState([])
  const [editOpen, setEditOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [editData, setEditData] = useState({
    PortalName: '',
    header: '',
    footer: '',
    Portallogo: '',
    organizationId: '',
    termsAndConditions: '',
    privacyPolicy: '',
    bannerPhoto: '',
    mainHeaderText: '',
    headerText: '',
    tipsForApplying: false,
    whyJoinOrganization: false,
    appliGuidelinesTitle: '',
    proTipTitle: '',
    maxApplicationsPerEmployee: 0,
    minDaysBetweenApplications: 0,
    resumeTemplate: '',
    PortalNameFont: {
      fontSize: 16,
      fontColor: "#000000"
    },
    headerFont: {
      fontSize: 16,
      fontColor: "#000000"
    },
    footerFont: {
      fontSize: 16,
      fontColor: "#000000"
    },  
    mainHeaderTextFont: {
      fontSize: 16,
      fontColor: "#000000"
    },
    headerTextFont: {
      fontSize: 16,
      fontColor: "#000000"
    },
    proTip: {
      proTipTitleFont: {
        fontSize: 16,
        fontColor: "#000000"
      }
    }
  })

  const [errors, setErrors] = useState({
    PortalName: false,
    organizationId: false,
    headerText: false,
    mainHeaderText: false,
    proTipTitle: false,
    privacyPolicy: false,
    termsAndConditions: false,
  })

  // Add state to track form validity
  const [isFormValid, setIsFormValid] = useState(false)

  // Function to validate all mandatory fields without setting state
  const checkFieldsValidity = () => {
    const newErrors = {
      PortalName: !editData.PortalName.trim(),
      organizationId: !editData.organizationId,
      headerText: !editData.headerText.trim(),
      mainHeaderText: !editData.mainHeaderText.trim(),
      proTipTitle: !editData.proTipTitle.trim(),
      privacyPolicy: !editData.privacyPolicy.trim(),
      termsAndConditions: !editData.termsAndConditions.trim(),
    }
    return {
      errors: newErrors,
      isValid: !Object.values(newErrors).some(error => error)
    }
  }


  useEffect(() => {
    if (hasSubmitted) {
      const { errors, isValid } = checkFieldsValidity();
      setErrors(errors);
      setIsFormValid(isValid);
    }
  }, [editData, hasSubmitted]);
  

  // Function to validate on submission
  const validateFields = () => {
    const { errors, isValid } = checkFieldsValidity()
    setErrors(errors)
    return isValid
  }


  const [loading, setLoading] = useState(false)
  const [orgsLoading, setOrgsLoading] = useState(true)
  const [uploading, setUploading] = useState({ logo: false, banner: false, resume: false })
  const [originalData, setOriginalData] = useState({})
  const [isEdited, setIsEdited] = useState(false)
  const [config, setConfig] = useState()

  const handleJobPostChange = (key) => (eventOrValue) => {
    const isEvent = eventOrValue && eventOrValue.target !== undefined;
    const checked = isEvent ? eventOrValue.target.checked : !editData?.jobListCard?.[key];
  
    setEditData((prev) => ({
      ...prev,
      jobListCard: {
        ...prev?.jobListCard,
        [key]: checked
      }
    }));
  };
  

  const handleJobDetailChange = (key) => (eventOrValue) => {
    const isEvent = eventOrValue && eventOrValue.target !== undefined;
    const checked = isEvent ? eventOrValue.target.checked : !editData?.jobApplyDetail?.[key];
  
    setEditData((prev) => ({
      ...prev,
      jobApplyDetail: {
        ...prev?.jobApplyDetail,
        [key]: checked
      }
    }));
  };

  const handleEditOpen = () => {
    if (!portal) return
    setEditData({
      organizationId: portal?.organizationId?._id || '',
      PortalName: portal?.PortalName || '',
      header: portal?.header || '',
      footer: portal?.footer || '',
      Portallogo: portal?.Portallogo || '',
      termsAndConditions: portal?.termsAndConditions || '',
      privacyPolicy: portal?.privacyPolicy || '',
      bannerPhoto: portal?.bannerPhoto || '',
      mainHeaderText: portal?.mainHeaderText || '',
      headerText: portal?.headerText || '',
      tipsForApplying: portal?.tipsForApplying || false,
      whyJoinOrganization: portal?.whyJoinOrganization || false,
      appliGuidelinesTitle: portal?.proTip?.appliGuidelinesTitle || '',
      proTipTitle: portal?.proTip?.proTipTitle || '',
      maxApplicationsPerEmployee: portal?.maxApplicationsPerEmployee || 0,
      minDaysBetweenApplications: portal?.minDaysBetweenApplications || 0,
      resumeTemplate: portal?.resumeTemplate || '',
      PortalNameFont: {
        fontSize: portal?.PortalNameFont?.fontSize || "20px",
        fontColor: portal?.PortalNameFont?.fontColor || "#000000"
        },
        headerFont: {
            fontSize: portal?.headerFont?.fontSize,
            fontColor: portal?.headerFont?.fontColor || "#000000"
        },
        footerFont: {
          fontSize: portal?.footerFont?.fontSize,
          fontColor: portal?.footerFont?.fontColor || "#000000"
        },  
        mainHeaderTextFont: {
          fontSize: portal?.mainHeaderTextFont?.fontSize || "24px",
          fontColor: portal?.mainHeaderTextFont?.fontColor || "#000000"
        },
        headerTextFont: {
          fontSize: portal?.headerTextFont?.fontSize || "44px",
          fontColor: portal?.headerTextFont?.fontColor || "#000000"
        },
        proTip: {
            proTipTitleFont: {
              fontSize: portal?.proTip?.proTipTitleFont?.fontSize || "16px",
              fontColor: portal?.proTip?.proTipTitleFont?.fontColor || "#000000"
            }},
        jobListCard:portal?.jobListCard || {},
        jobApplyDetail: portal?.jobApplyDetail || {}
    })
    setOriginalData({
      organizationId: portal?.organizationId?._id || '',
      PortalName: portal?.PortalName || '',
      header: portal?.header || '',
      footer: portal?.footer || '',
      Portallogo: portal?.Portallogo || '',
      termsAndConditions: portal?.termsAndConditions || '',
      privacyPolicy: portal?.privacyPolicy || '',
      bannerPhoto: portal?.bannerPhoto || '',
      mainHeaderText: portal?.mainHeaderText || '',
      headerText: portal?.headerText || '',
      tipsForApplying: portal?.tipsForApplying || false,
      whyJoinOrganization: portal?.whyJoinOrganization || false,
      appliGuidelinesTitle: portal?.proTip?.appliGuidelinesTitle || '',
      proTipTitle: portal?.proTip?.proTipTitle || '',
      maxApplicationsPerEmployee: portal?.maxApplicationsPerEmployee || 0,
      minDaysBetweenApplications: portal?.minDaysBetweenApplications || 0,
      resumeTemplate: portal?.resumeTemplate || '',
      PortalNameFont: {
        fontSize: portal?.PortalNameFont?.fontSize || "20px",
        fontColor: portal?.PortalNameFont?.fontColor || "#000000"
        },
        headerFont: {
            fontSize: portal?.headerFont?.fontSize,
            fontColor: portal?.headerFont?.fontColor || "#000000"
        },
        footerFont: {
          fontSize: portal?.footerFont?.fontSize,
          fontColor: portal?.footerFont?.fontColor || "#000000"
        },  
        mainHeaderTextFont: {
          fontSize: portal?.mainHeaderTextFont?.fontSize || "24px",
          fontColor: portal?.mainHeaderTextFont?.fontColor || "#000000"
        },
        headerTextFont: {
          fontSize: portal?.headerTextFont?.fontSize || "44px",
          fontColor: portal?.headerTextFont?.fontColor || "#000000"
        },
        proTip: {
            proTipTitleFont: {
              fontSize: portal?.proTip?.proTipTitleFont?.fontSize || "16px",
              fontColor: portal?.proTip?.proTipTitleFont?.fontColor || "#000000"
            }},
      jobListCard:portal?.jobListCard || {},
      jobApplyDetail: portal?.jobApplyDetail || {}
    })
    setEditOpen(true)
  }

  useEffect(() => {
    const isEqual = JSON.stringify(editData) === JSON.stringify(originalData)
    setIsEdited(!isEqual)
  }, [editData, originalData])
  

  const uploadFile = async (file, type) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploading(prev => ({ ...prev, [type]: true }))
      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: token
        }
      })
      return res.data.url
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      return null
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  const handleFileUpload = async (e, field, type) => {
    const file = e.target.files[0]
    if (!file) return

    const url = await uploadFile(file, type)
    if (url) {
      setEditData(prev => ({ ...prev, [field]: url }))
    }
  }


  const [orgs, setOrgs] = useState([])

  const getOrganizations = async () => {
    try {
      setOrgsLoading(true)
      const res = await axios.get(`${baseUrl}/v1/api/org/organization`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      setOrgs(res.data.items || [])
    } catch (error) {
      console.error('Error fetching organizations:', error)
      setOrgs([])
    } finally {
      setOrgsLoading(false)
    }
  }

  const getPortalInfo = async id => {
    try {
      setLoading(true)
      const res = await axios.get(`${baseUrl}/v1/api/PortalsetUp/getPortalDetail`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      setPortalData(res.data.items || [])
    } catch (error) {
      console.error('Error fetching portal data:', error)
      setPortalData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orgs.length > 0 && orgs[0]._id) getPortalInfo(orgs[0]._id)
  }, [orgs])

  useEffect(() => {
    getOrganizations()
  }, [])

  const handleEditSubmit = async () => {
    if (!portal) return;
  
    setHasSubmitted(true); 
  
    const isValid = validateFields();
    if (!isValid) return;

    try {
      const payload = {
        ...editData,
        proTip: {
          ...editData.proTip,
          appliGuidelinesTitle: editData.appliGuidelinesTitle,
          proTipTitle: editData.proTipTitle
        }
      }

      const res = await axios.post(`${baseUrl}/v1/api/PortalsetUp/updatePortal/${portal._id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      if (res.data.status) {
        setEditOpen(false)
        getPortalInfo(orgs[0]._id)
        setHasSubmitted(false); 
        setTabValue(0)
      }
    } catch (err) {
      console.error('Update error:', err)
    }
  }

const BannerWORD_LIMIT1 = 30;
const BANNER_DESC_CHAR_LIMIT = 150
const PORTAL_NAME_CHAR_LIMIT = 20
const PRO_TIP_CHAR_LIMIT = 600

  const portal = portalData ? portalData : null

  if (loading) {
    return (
      <Box
        minHeight='100vh'
        sx={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          p: 4
        }}
      >
        <Box maxWidth='lg' mx='auto'>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            minHeight='400px'
            gap={3}
          >
            <CircularProgress size={60} sx={{ color: '#1976d2' }} />
            <Box textAlign='center'>
              <Typography variant='h5' fontWeight={600} gutterBottom>
                Loading Portal Configuration
              </Typography>
              <Typography color='text.secondary'>Please wait while we fetch your settings...</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Container maxWidth='xl'>
      <Box maxWidth='xl' mx='auto'>
        {/* Header */}

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
                <PictureInPictureAltIcon sx={{ fontSize: 30, color: 'white' }} />
              </Box>
              <Box>
                <Typography fontSize={19} color='white' fontWeight='bold' gutterBottom mt={1}>
                  Career Portal Settings
                </Typography>
                <Typography fontSize={15} color='white' sx={{ opacity: 0.9, my: -1.5 }}>
                  Configure your career page settings and branding
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

        {/* Portal Overview Card */}
        <Card
  elevation={8}
  sx={{
    mb: 4,
    borderRadius: 2,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    p: 3,
  }}
>
  <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
    {/* Left: Avatar + Info + Link */}
    <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
    {portal?.Portallogo ? (
      <img
        src={portal.Portallogo}
        alt={portal.PortalName || 'Portal'}
        style={{
          width: 80,
          height: 80,
          border: '3px solid white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          objectFit: 'cover',
        }}
      />
    ) : (
      <div
        style={{
          width: 80,
          height: 80,
          border: '3px solid white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 700,
          color: 'white',
        }}
      >
        {portal?.PortalName?.charAt(0) || 'P'}
      </div>
    )}


      <Stack spacing={1}>
        <Typography variant="h5" fontWeight={600}>
          {portal?.PortalName || 'Portal Name'}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Public fontSize="small" color="disabled" />
          <Typography variant="body2" color="text.secondary">
            {portal?.organizationId?.name || 'Organization'}
          </Typography>
        </Box>

        {portal?.organizationId?.carrierlink && (
          <Paper
            variant="outlined"
            sx={{
              mt: 1,
              p: 1.5,
              bgcolor: '#f8f9fa',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              maxWidth: '100%',
            }}
          >
            <Link
              href={portal.organizationId.carrierlink}
              target="_blank"
              underline="hover"
              color="primary"
              sx={{ fontSize: 13, fontWeight: 500, wordBreak: 'break-word', flex: 1 }}
            >
              {portal.organizationId.carrierlink}
            </Link>
            <Tooltip title="Copy Link">
              <IconButton
                size="small"
                onClick={() => navigator.clipboard.writeText(portal.organizationId.carrierlink)}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Paper>
        )}
      </Stack>
    </Box>

    {/* Right: Edit Button */}
    <Button
      variant="contained"
      startIcon={<Edit />}
      onClick={handleEditOpen}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1.5,
        mt: { xs: 2, md: 0 },
        '&:hover': {
          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
        },
      }}
    >
      Edit Portal
    </Button>
  </Box>
      </Card>

        {/* Content Grid */}
        <Grid container spacing={3} mb={4}>
          {/* Banner & Media */}
          <Grid item xs={12} lg={12}>
            <Card
              elevation={6}
              sx={{
                height: '100%',
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <CardHeader
                title={
                  <Box display='flex' alignItems='center' gap={2}>
                    <Image sx={{ color: '#4caf50' }} />
                    <Typography variant='h6' fontWeight={600}>
                      Banner & Media
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Grid container spacing={4}>
                  {/* Banner Image */}
                  <Grid item xs={12}>
                    <Typography variant='subtitle2' fontWeight={600} color='text.primary' gutterBottom>
                      Banner Image
                    </Typography>
                    {portal?.bannerPhoto ? (
                      <Paper
                        variant='outlined'
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          height: 140
                        }}
                      >
                        <img
                          src={portal.bannerPhoto || '/placeholder.svg'}
                          alt='Banner'
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Paper>
                    ) : (
                      <Paper
                        variant='outlined'
                        sx={{
                          height: 140,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#f5f5f5',
                          borderStyle: 'dashed',
                          borderRadius: 2
                        }}
                      >
                        <Typography color='text.secondary'>No banner image</Typography>
                      </Paper>
                    )}
                  </Grid>

                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Banner Content */}
        <Card
          elevation={6}
          sx={{
            mb: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardHeader
            title={
              <Typography variant='h6' fontWeight={600}>
                Banner Content
              </Typography>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant='subtitle2' fontWeight={600} color='text.primary' gutterBottom>
                  Banner Title
                </Typography>
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    minHeight: 100
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    {portal?.headerText || 'No banner title configured'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant='subtitle2' fontWeight={600} color='text.primary' gutterBottom>
                  Banner Description
                </Typography>
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    minHeight: 100
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    {portal?.mainHeaderText || 'No banner description configured'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
  {/* Application Limits */}
  <Grid item xs={12} lg={4}>
    <Fade in timeout={1600}>
      <Box height="100%" display="flex" flexDirection="column">
        <StatusCard
          title="Application Limits"
          icon={<People />}
          color="warning"
          sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                  borderRadius: 2,
                  border: "1px solid rgba(255, 152, 0, 0.2)",
                }}
              >
                <Typography variant="h4" fontWeight={700} color="#ff9800">
                  {portal?.maxApplicationsPerEmployee || 0}
                </Typography>
                <Typography variant="caption" color="#e65100" fontWeight={500}>
                  Max Applications per Candidate
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                  borderRadius: 2,
                  border: "1px solid rgba(25, 118, 210, 0.2)",
                }}
              >
                <Typography variant="h4" fontWeight={700} color="#1976d2">
                  {portal?.minDaysBetweenApplications || 0}
                </Typography>
                <Typography variant="caption" color="#0d47a1" fontWeight={500}>
                  Min Days Between Applications
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </StatusCard>
      </Box>
    </Fade>
  </Grid>

  {/* Features */}
  <Grid item xs={12} lg={4}>
    <Fade in timeout={1600}>
      <Box height="100%" display="flex" flexDirection="column">
        <StatusCard
          title="Features"
          icon={<CheckCircle />}
          color="success"
          sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <Stack spacing={2} flexGrow={1} justifyContent="center">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight={600}>
                Tips for Applying
              </Typography>
              <Chip
                icon={portal?.tipsForApplying ? <CheckCircle /> : <Cancel />}
                label={portal?.tipsForApplying ? "Enabled" : "Disabled"}
                color={portal?.tipsForApplying ? "success" : "error"}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 500 }}
              />
            </Box>
            {/* <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight={600}>
                Company Benefits
              </Typography>
              <Chip
                icon={portal?.whyJoinOrganization ? <CheckCircle /> : <Cancel />}
                label={portal?.whyJoinOrganization ? "Enabled" : "Disabled"}
                color={portal?.whyJoinOrganization ? "success" : "error"}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 500 }}
              />
            </Box> */}
          </Stack>
        </StatusCard>
      </Box>
    </Fade>
  </Grid>

  {/* Compliance */}
  <Grid item xs={12} lg={4}>
    <Fade in timeout={1600}>
      <Box height="100%" display="flex" flexDirection="column">
        <StatusCard
          title="Compliance"
          icon={<Security />}
          color="#9c27b0"
          sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <Stack spacing={2} flexGrow={1} justifyContent="center">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight={600}>
                Privacy Policy
              </Typography>
              <Chip
                icon={portal?.privacyPolicy ? <CheckCircle /> : <Cancel />}
                label={portal?.privacyPolicy ? "Set" : "Missing"}
                color={portal?.privacyPolicy ? "success" : "warning"}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 500 }}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight={600}>
                Terms & Conditions
              </Typography>
              <Chip
                icon={portal?.termsAndConditions ? <CheckCircle /> : <Cancel />}
                label={portal?.termsAndConditions ? "Set" : "Missing"}
                color={portal?.termsAndConditions ? "success" : "warning"}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </Stack>
        </StatusCard>
      </Box>
    </Fade>
  </Grid>
      </Grid>

        {/* Guidelines */}
        <Card
          elevation={6}
          sx={{
            mb: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant='subtitle2' fontWeight={600} color='text.primary' gutterBottom>
                  Pro Tips
                </Typography>
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    minHeight: 200,
                    overflow: 'auto'
                  }}
                >
                  <Typography
                    variant='h6'
                    fontWeight={400}
                    fontSize={15}
                    color='text.secondary'
                    sx={{ whiteSpace: 'pre-line' }}
                  >
                    {portal?.proTip?.proTipTitle || 'No pro tips configured'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Legal Documents */}
        <Card
          elevation={6}
          sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardHeader
            title={
              <Typography variant='h6' fontWeight={600}>
                Legal Documents
              </Typography>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant='subtitle2' fontWeight={600} color='text.primary' gutterBottom>
                  Privacy Policy
                </Typography>
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    height: 300,
                    overflow: 'auto'
                  }}
                >
                  <Typography
                    variant='h6'
                    fontWeight={400}
                    fontSize={15}
                    color='text.secondary'
                    sx={{ whiteSpace: 'pre-line' }}
                  >
                    {portal?.privacyPolicy || 'No privacy policy configured'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant='subtitle2' fontWeight={600} color='text.primary' gutterBottom>
                  Terms and Conditions
                </Typography>
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    height: 300,
                    overflow: 'auto'
                  }}
                >
                  <Typography
                    variant='h6'
                    fontWeight={400}
                    fontSize={15}
                    color='text.secondary'
                    sx={{ whiteSpace: 'pre-line' }}
                  >
                    {portal?.termsAndConditions || 'No terms and conditions configured'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          maxWidth='lg'
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2
              // maxHeight: "90vh",
            }
          }}
        >
          <DialogTitle>
            <Typography variant='h5' fontWeight={600}>
              Edit Portal Configuration
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Update your portal settings and branding information
            </Typography>
          </DialogTitle>
          <DialogContent >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                variant='scrollable'
                scrollButtons='auto'
              >
                {/* <Tab label="Basic" /> */}
                <Tab label='Content' />
                <Tab label='Media' />
                <Tab label='Settings' />
                <Tab label='Job Card Layout' />
                <Tab label='Job Detail Layout' />
                <Tab label='Legal' />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={8}>
              <Box display='flex' alignItems='center' gap={2}>
              <TextField
                sx={{ flex: 1 }}
                label="Portal Name"
                value={editData.PortalName}
                onChange={e => {
                  let value = e.target.value

                  if (value.length === 1 && value === " ") return

                  if (value.length <= PORTAL_NAME_CHAR_LIMIT) {
                    setEditData({ ...editData, PortalName: value })
                  }
                }}
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  maxLength: PORTAL_NAME_CHAR_LIMIT,
                  style: {
                    fontSize: `${editData.PortalNameFont.fontSize}px`,
                    color: "black",
                  },
                }}
                error={!!errors.PortalName}
                helperText={
                  errors.PortalName
                    ? "Portal Name is required"
                    : `${editData.PortalName.length}/${PORTAL_NAME_CHAR_LIMIT} characters`
                }
              />
            <FormControl size='small' sx={{ width: '120px' }}>
              <InputLabel>Font Size</InputLabel>
              <Select
                value={editData.PortalNameFont.fontSize}
                onChange={e =>
                  setEditData({
                    ...editData,
                    PortalNameFont: {
                      ...editData.PortalNameFont,
                      fontSize: Number(e.target.value)
                    }
                  })
                }
                label='Font Size'
              >
                {[12, 14, 16, 18, 20, 24, 28].map(size => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2'>Color:</Typography>
              <input
                type='color'
                value={editData.PortalNameFont.fontColor}
                onChange={e =>
                  setEditData({
                    ...editData,
                    PortalNameFont: {
                      ...editData.PortalNameFont,
                      fontColor: e.target.value
                    }
                  })
                }
                style={{
                  width: '30px',
                  height: '30px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              />
            </Box>
          </Box>
              </Grid>
            </Grid>
            <Box display='flex' flexDirection='column' gap={3}>

          <Box display='flex' alignItems='center' gap={2}>
      <TextField
        sx={{ flex: 1 }}
        multiline
        rows={3}
        label='Banner Title'
        value={editData.headerText}
        onChange={e => {
          const value = e.target.value;

          if (value.length === 1 && value === " ") return

          if (value.length <= BannerWORD_LIMIT1) {
            setEditData({ ...editData, headerText: value });
          }
        }}
        size='small'
        InputLabelProps={{ shrink: true }}
        inputProps={{
          maxLength: BannerWORD_LIMIT1,
          style: {
            fontSize: `${editData.headerTextFont.fontSize}px`,
            color:'black'
          }
        }}
        error={!!errors.headerText}
        helperText={
          errors.headerText
            ? "Banner Title is required"
            : `${editData.headerText.length}/${BannerWORD_LIMIT1} characters`
        }
      />

      <FormControl size='small' sx={{ width: '120px' }}>
        <InputLabel>Font Size</InputLabel>
        <Select
          value={editData.headerTextFont.fontSize}
          onChange={e =>
            setEditData({
              ...editData,
              headerTextFont: {
                ...editData.headerTextFont,
                fontSize: Number(e.target.value)
              }
            })
          }
          label='Font Size'
        >
          {[24, 34, 44, 48, 54, 60].map(size => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box display='flex' alignItems='center' gap={1}>
        <Typography variant='body2'>Color:</Typography>
        <input
          type='color'
          value={editData.headerTextFont.fontColor}
          onChange={e =>
            setEditData({
              ...editData,
              headerTextFont: {
                ...editData.headerTextFont,
                fontColor: e.target.value
              }
            })
          }
          style={{
            width: '30px',
            height: '30px',
            border: 'none',
            cursor: 'pointer'
          }}
        />
      </Box>
    </Box>
    <Box display='flex' alignItems='center' gap={2}>
  <TextField
    sx={{ flex: 1 }}
    multiline
    rows={4}
    label='Banner Description'
    value={editData.mainHeaderText}
    onChange={e => {
      const value = e.target.value;

      if (value.length === 1 && value === " ") return

      if (value.length <= BANNER_DESC_CHAR_LIMIT) {
        setEditData({ ...editData, mainHeaderText: value });
      }
    }}
    size='small'
    InputLabelProps={{ shrink: true }}
    inputProps={{
      maxLength: BANNER_DESC_CHAR_LIMIT,
      style: {
        fontSize: `${editData.mainHeaderTextFont.fontSize}px`,
        color: 'black'
      }
    }}
    error={!!errors.mainHeaderText}
    helperText={
      errors.mainHeaderText
        ? 'Banner Description is required'
        : `${editData.mainHeaderText.length}/${BANNER_DESC_CHAR_LIMIT} characters`
    }
  />

  <FormControl size='small' sx={{ width: '120px' }}>
    <InputLabel>Font Size</InputLabel>
    <Select
      value={editData.mainHeaderTextFont.fontSize}
      onChange={e =>
        setEditData({
          ...editData,
          mainHeaderTextFont: {
            ...editData.mainHeaderTextFont,
            fontSize: Number(e.target.value)
          }
        })
      }
      label='Font Size'
    >
      {[12, 18,20,22, 24,26].map(size => (
        <MenuItem key={size} value={size}>
          {size}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <Box display='flex' alignItems='center' gap={1}>
    <Typography variant='body2'>Color:</Typography>
    <input
      type='color'
      value={editData.mainHeaderTextFont.fontColor}
      onChange={e =>
        setEditData({
          ...editData,
          mainHeaderTextFont: {
            ...editData.mainHeaderTextFont,
            fontColor: e.target.value
          }
        })
      }
      style={{
        width: '30px',
        height: '30px',
        border: 'none',
        cursor: 'pointer'
      }}
    />
  </Box>
</Box>
  </Box>
</TabPanel>
            {/* Media Tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={4}>
                {/* Portal Logo */}
                <Grid item xs={12} sx={{display:"flex", justifyContent:"center"}}>
                  <Box display='flex' flexDirection='column' gap={2}>
                    <Typography variant='subtitle1' fontWeight={600}>
                      Portal Logo
                    </Typography>
                    {editData?.Portallogo && (
                      <Box>
                          <img
                        src={editData.Portallogo}
                        alt={editData.PortalName || 'Portal'}
                        style={{
                          width: 80,
                          height: 80,
                          border: '3px solid white',
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                          objectFit: 'cover',
                        }}
                      />
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid container>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant='outlined'
                      component='label'
                      startIcon={uploading.logo ? <CircularProgress size={20} /> : <CloudUpload />}
                      disabled={uploading.logo}
                    >
                      Upload Logo
                      <input
                        type='file'
                        hidden
                        accept='image/*'
                        onChange={e => handleFileUpload(e, 'Portallogo', 'logo')}
                      />
                    </Button>
                  </Grid>
                </Grid>

                {/* Divider */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box display='flex' flexDirection='column' gap={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type='number'
                      label='Max Applications per Candidate'
                      value={editData.maxApplicationsPerEmployee}
                      onChange={e =>
                        setEditData({ ...editData, maxApplicationsPerEmployee: Number.parseInt(e.target.value) })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type='number'
                      label='Min Days Between Applications'
                      value={editData.minDaysBetweenApplications}
                      onChange={e =>
                        setEditData({ ...editData, minDaysBetweenApplications: Number.parseInt(e.target.value) })
                      }
                    />
                  </Grid>
                </Grid>

                {/* <Divider /> */}

                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editData.tipsForApplying}
                        onChange={e => setEditData({ ...editData, tipsForApplying: e.target.checked })}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body1'>Tips for Applying</Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Show application tips to candidates
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
          <Box display='flex' alignItems='center' gap={2}>
            <TextField
              sx={{ flex: 1 }}
              multiline
              rows={6}
              label='Pro Tips'
              value={editData.proTipTitle}
              onChange={e => {
                const value = e.target.value;

                if (value.length === 1 && value === " ") return

                if (value.length <= PRO_TIP_CHAR_LIMIT) {
                  setEditData({ ...editData, proTipTitle: value });
                }
              }}
              size='small'
              InputLabelProps={{ shrink: true }}
              inputProps={{
                maxLength: PRO_TIP_CHAR_LIMIT,
                style: {
                  fontSize: `${editData.proTip.proTipTitleFont.fontSize}px`,
                  color: editData.proTip.proTipTitleFont.fontColor
                }
              }}
              error={errors.proTipTitle}
              helperText={
                errors.proTipTitle
                  ? "Pro Tips is required"
                  : `${editData.proTipTitle.length}/${PRO_TIP_CHAR_LIMIT} characters`
              }
            />

        <FormControl size='small' sx={{ width: '120px' }}>
          <InputLabel>Font Size</InputLabel>
          <Select
            value={editData.proTip.proTipTitleFont.fontSize}
            onChange={e => setEditData({
              ...editData,
              proTip: {
                ...editData.proTip,
                proTipTitleFont: {
                  ...editData.proTip.proTipTitleFont,
                  fontSize: Number(e.target.value),
                },
              },
            })}
            label='Font Size'
          >
            {[12, 14, 16, 18, 20].map(size => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display='flex' alignItems='center' gap={1}>
          <Typography variant='body2'>Color:</Typography>
          <input
            type='color'
            value={editData.proTip.proTipTitleFont.fontColor}
            onChange={e => setEditData({
              ...editData,
              proTip: {
                ...editData.proTip,
                proTipTitleFont: {
                  ...editData.proTip.proTipTitleFont,
                  fontColor: e.target.value,
                },
              },
            })}
            style={{
              width: '30px',
              height: '30px',
              border: 'none',
              cursor: 'pointer',
            }}
          />
        </Box>
      </Box>

              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 2 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#1F2937",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ViewModule sx={{ fontSize: 24, color: "white" }} />
            </Box>
            Job Card Display Settings
          </Typography>
        </Box>

        {/* Settings Grid */}
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              {Object.entries(editData?.jobListCard || {})
              .filter(([key]) => !['JobType', 'experience','AgeLimit','gender','expiredDate','qualification','employmentType','employeeType','noOfPosition'].includes(key)) 
              .map(([key, value], index) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: value ? "2px solid #6366F1" : "2px solid #E5E7EB",
                      backgroundColor: value ? "#F0F9FF" : "#FAFAFA",
                      transition: "all 0.2s ease-in-out",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: value ? "#5B5BD6" : "#9CA3AF",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    onClick={() => handleJobPostChange(key)()}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Checkbox
                        checked={value}
                        onChange={handleJobPostChange(key)}
                        sx={{
                          color: "#9CA3AF",
                          "&.Mui-checked": {
                            color: "#6366F1",
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: 24,
                          },
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            color: value ? "#1F2937" : "#6B7280",
                            mb: 0.5,
                          }}
                        >
                          {toProperCase(key)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: value ? "#6366F1" : "#9CA3AF",
                            fontSize: "0.75rem",
                          }}
                        >
                          {value ? "Visible" : "Hidden"}
                        </Typography>
                      </Box>
                      {value && (
                        <CheckCircle
                          sx={{
                            color: "#10B981",
                            fontSize: 20,
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Summary Section */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid #E5E7EB",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {Object.values(editData?.jobListCard || {}).filter(Boolean).length} of{" "}
                  {Object.keys(editData?.jobListCard || {}).length} fields enabled
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    // Select all fields
                    Object.keys(editData?.jobListCard || {}).forEach((key) => {
                      if (!editData.jobListCard[key]) {
                        handleJobPostChange(key)()
                      }
                    })
                  }}
                  sx={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                    "&:hover": {
                      borderColor: "#9CA3AF",
                      backgroundColor: "#F9FAFB",
                    },
                  }}
                >
                  Select All
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    // Deselect all fields
                    Object.keys(editData?.jobListCard || {}).forEach((key) => {
                      if (editData.jobListCard[key]) {
                        handleJobPostChange(key)()
                      }
                    })
                  }}
                  sx={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                    "&:hover": {
                      borderColor: "#9CA3AF",
                      backgroundColor: "#F9FAFB",
                    },
                  }}
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

      </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
            <Box sx={{ p: 2 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#1F2937",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ViewModule sx={{ fontSize: 24, color: "white" }} />
            </Box>
            Job Detail Display Settings
          </Typography>
        </Box>

        {/* Settings Grid */}
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              {Object.entries(editData?.jobApplyDetail || {}).map(([key, value], index) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: value ? "2px solid #6366F1" : "2px solid #E5E7EB",
                      backgroundColor: value ? "#F0F9FF" : "#FAFAFA",
                      transition: "all 0.2s ease-in-out",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: value ? "#5B5BD6" : "#9CA3AF",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    onClick={() => handleJobDetailChange(key)()}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Checkbox
                        checked={value}
                        onChange={handleJobDetailChange(key)}
                        sx={{
                          color: "#9CA3AF",
                          "&.Mui-checked": {
                            color: "#6366F1",
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: 24,
                          },
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            color: value ? "#1F2937" : "#6B7280",
                            mb: 0.5,
                          }}
                        >
                          {toProperCase(key)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: value ? "#6366F1" : "#9CA3AF",
                            fontSize: "0.75rem",
                          }}
                        >
                          {value ? "Visible" : "Hidden"}
                        </Typography>
                      </Box>
                      {value && (
                        <CheckCircle
                          sx={{
                            color: "#10B981",
                            fontSize: 20,
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid #E5E7EB",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {Object.values(editData?.jobApplyDetail || {}).filter(Boolean).length} of{" "}
                  {Object.keys(editData?.jobApplyDetail || {}).length} fields enabled
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    Object.keys(editData?.jobApplyDetail || {}).forEach((key) => {
                      if (!editData.jobApplyDetail[key]) {
                        handleJobDetailChange(key)()
                      }
                    })
                  }}
                  sx={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                    "&:hover": {
                      borderColor: "#9CA3AF",
                      backgroundColor: "#F9FAFB",
                    },
                  }}
                >
                  Select All
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    Object.keys(editData?.jobApplyDetail || {}).forEach((key) => {
                      if (editData.jobApplyDetail[key]) {
                        handleJobDetailChange(key)()
                      }
                    })
                  }}
                  sx={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                    "&:hover": {
                      borderColor: "#9CA3AF",
                      backgroundColor: "#F9FAFB",
                    },
                  }}
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

      </Box>
            </TabPanel>
            {/* Legal Tab */}
            <TabPanel value={tabValue} index={5}>
              <Box display='flex' flexDirection='column' gap={3}>
              <TextField
                fullWidth
                multiline
                rows={8}
                label='Privacy Policy'
                value={editData.privacyPolicy}
                onChange={e => {
                  const value = e.target.value.replace(/^\s+/, '') // remove leading spaces
                  setEditData({ ...editData, privacyPolicy: value })
                }}
                error={errors.privacyPolicy}
                helperText={errors.privacyPolicy ? "Privacy Policy is required" : ""}
              />

              <TextField
                fullWidth
                multiline
                rows={8}
                label='Terms and Conditions'
                value={editData.termsAndConditions}
                onChange={e => {
                  const value = e.target.value.replace(/^\s+/, '') // remove leading spaces
                  setEditData({ ...editData, termsAndConditions: value })
                }}
                error={errors.termsAndConditions}
                helperText={errors.termsAndConditions ? "Terms and Conditions is required" : ""}
              />

              </Box>
            </TabPanel>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => {setEditOpen(false); setErrors({
              PortalName: false,
              organizationId: false,
              headerText: false,
              mainHeaderText: false,
              proTipTitle: false,
              privacyPolicy: false,
              termsAndConditions: false,
            }); setIsEdited(false); setTabValue(0)}} variant='outlined' sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              variant='contained'
              disabled={(!isFormValid && hasSubmitted) || !isEdited} 
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}