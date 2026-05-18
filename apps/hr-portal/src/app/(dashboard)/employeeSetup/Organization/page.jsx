'use client'

import {
  Container,
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  MenuItem,
  Avatar,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Paper
} from '@mui/material'
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Description as DocumentIcon,
  AccountBalance as BankIcon,
  Public as WebIcon,
  ContactMail as ContactIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../context/AuthContext'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

export default function OrganizationSetup() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const { userData } = useAuth()
  const router = useRouter()

  // State management
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState([])
  const [selectedOrgId, setSelectedOrgId] = useState('')
  const [isNewOrg, setIsNewOrg] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // File refs
  const logoRef = useRef()
  const promoterPhotoRef = useRef()
  const promoterAadharRef = useRef()
  const promoterPanRef = useRef()
  const managementPhotoRef = useRef()
  const managementAadharRef = useRef()
  const managementPanRef = useRef()
  const promoterPassportRef = useRef()
  const managementPassportRef = useRef()

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    typeOfOrganization: null,
    typeOfIndustry: null,
    typeOfSector: null,
    contactPerson: '',
    contactNumber: '',
    contactEmail: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: '',
    country: 'India',
    zipCode: '',
    registeredAddress: '',
    Hirefor:'',
    haveGSTIN: false,
    GSTNumber: '',
    CINNumber: '',
    Pan: '',
    abbreviation: '',
    domain: '',
    defaultCurrency: '',
    incorporationDate: '',
    promoterDetail: {
      passportSizePhoto: '',
      fullName: '',
      fatherOrHusbandName: '',
      dateOfBirth: '',
      languagePreferenceId: null,
      contactNumber: '',
      email: '',
      correspondenceAddress: '',
      aadharNumber: '',
      panCardNumber: '',
      yearsOfExperience: 0,
      qualificationId: null,
      photo: '',
      aadharCard: '',
      panCard: ''
    },
    managementDetail: {
      passportSizePhoto: '',
      fullName: '',
      fatherOrHusbandName: '',
      dateOfBirth: '',
      languagePreferenceId: null,
      contactNumber: '',
      email: '',
      correspondenceAddress: '',
      aadharNumber: '',
      panCardNumber: '',
      yearsOfExperience: 0,
      qualificationId: null,
      photo: '',
      aadharCard: '',
      panCard: ''
    },
    employeeData: {
      employeName: '',
      userName: '',
      password: ''
    }
  })

  // Dropdown options
  const [orgTypes, setOrgTypes] = useState([])
  const [industryTypes, setIndustryTypes] = useState([])
  const [sectorTypes, setSectorTypes] = useState([])
  const [languages, setLanguages] = useState([])
  const [qualifications, setQualifications] = useState([])
  const [currencies, setCurrencies] = useState([])

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  // Get all organizations
  const getOrganizations = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/org/getOrganizations`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      setOrganizations(res.data.items)
      if (res.data.items.length > 0 && !selectedOrgId) {
        setSelectedOrgId(res.data.items[0]._id)
        loadOrganizationData(res.data.items[0])
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      showSnackbar('Error fetching organizations', 'error')
    }
  }

  const getCurrencies = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/org/getCurrency`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      setCurrencies(res.data.items)

      // Set INR as default if no currency is selected
      if (!formData.defaultCurrency && res.data.items.length > 0) {
        const inrCurrency = res.data.items.find(currency => currency.name === 'INR')
        if (inrCurrency) {
          setFormData(prev => ({
            ...prev,
            defaultCurrency: inrCurrency._id
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching currencies:', error)
      showSnackbar('Error fetching currencies', 'error')
    }
  }

  // Load organization data into form
  const loadOrganizationData = data => {
    setFormData({
      name: data.name || '',
      logo: data.logo || '',
      website: data.website || '',
      typeOfOrganization: data?.typeOfOrganization?._id || null,
      typeOfIndustry: data?.typeOfIndustry?._id || null,
      typeOfSector: data?.typeOfSector?._id || null,
      contactPerson: data.contactPerson || '',
      contactNumber: data.contactNumber || '',
      contactEmail: data.contactEmail || '',
      addressLine1: data.addressLine1 || '',
      addressLine2: data.addressLine2 || '',
      city: data.city || '',
      district: data.district || '',
      state: data.state || '',
      country: data.country || 'India',
      zipCode: data.zipCode || '',
      registeredAddress: data.registeredAddress || '',
      Hirefor: data.Hirefor || '',
      haveGSTIN: data.haveGSTIN || false,
      GSTNumber: data.GSTNumber || '',
      CINNumber: data.CINNumber || '',
      Pan: data.Pan || '',
      abbreviation: data.abbreviation || '',
      domain: data.domain || '',
      defaultCurrency: data.defaultCurrency || '',
      incorporationDate: data.incorporationDate || '',
      promoterDetail: {
        passportSizePhoto: data.promoterDetail?.passportSizePhoto || '',
        fullName: data.promoterDetail?.fullName || '',
        fatherOrHusbandName: data.promoterDetail?.fatherOrHusbandName || '',
        dateOfBirth: data.promoterDetail?.dateOfBirth || '',
        languagePreferenceId: data.promoterDetail?.languagePreferenceId?._id || null,
        contactNumber: data.promoterDetail?.contactNumber || '',
        email: data.promoterDetail?.email || '',
        correspondenceAddress: data.promoterDetail?.correspondenceAddress || '',
        aadharNumber: data.promoterDetail?.aadharNumber || '',
        panCardNumber: data.promoterDetail?.panCardNumber || '',
        yearsOfExperience: data.promoterDetail?.yearsOfExperience || 0,
        qualificationId: data.promoterDetail?.qualificationId?._id || null,
        photo: data.promoterDetail?.photo || '',
        aadharCard: data.promoterDetail?.aadharCard || '',
        panCard: data.promoterDetail?.panCard || ''
      },
      managementDetail: {
        passportSizePhoto: data.managementDetail?.passportSizePhoto || '',
        fullName: data.managementDetail?.fullName || '',
        fatherOrHusbandName: data.managementDetail?.fatherOrHusbandName || '',
        dateOfBirth: data.managementDetail?.dateOfBirth || '',
        languagePreferenceId: data.managementDetail?.languagePreferenceId?._id || null,
        contactNumber: data.managementDetail?.contactNumber || '',
        email: data.managementDetail?.email || '',
        correspondenceAddress: data.managementDetail?.correspondenceAddress || '',
        aadharNumber: data.managementDetail?.aadharNumber || '',
        panCardNumber: data.managementDetail?.panCardNumber || '',
        yearsOfExperience: data.managementDetail?.yearsOfExperience || 0,
        qualificationId: data.managementDetail?.qualificationId?._id || null,
        photo: data.managementDetail?.photo || '',
        aadharCard: data.managementDetail?.aadharCard || '',
        panCard: data.managementDetail?.panCard || ''
      },
      employeeData: {
        employeName: data.employeeData?.employeName || '',
        userName: data.employeeData?.userName || '',
        password: data.employeeData?.password || ''
      }
    })
  }

  // Handle organization selection change
  const handleOrgChange = orgId => {
    setSelectedOrgId(orgId)
    const selectedOrg = organizations.find(org => org._id === orgId)
    if (selectedOrg) {
      loadOrganizationData(selectedOrg)
    }
    setEditMode(false)
  }

  const handleChange = async e => {
    const { name, value, type, checked } = e.target
    const keys = name.split('.')

    setFormData(prevState => {
      const updatedState = { ...prevState }
      let currentLevel = updatedState

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        currentLevel[key] = { ...currentLevel[key] }
        currentLevel = currentLevel[key]
      }

      currentLevel[keys[keys.length - 1]] = type === 'checkbox' ? checked : value
      return updatedState
    })

    // Auto-fill city, district and state based on pincode
    if (name === 'zipCode' && value.length === 6) {
      try {
        const res = await axios.get(`${baseUrl}/v1/api/pinCode/fetch?pinCode=${value}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        })

        if (res.data.status && res.data.items) {
          const { taluk, districtName, stateName } = res.data.items
          setFormData(prev => ({
            ...prev,
            city: taluk || '',
            district: districtName || '',
            state: stateName || ''
          }))
          showSnackbar(`Location auto-filled for pincode ${value}`, 'success')
        }
      } catch (err) {
        console.error('Pincode lookup failed', err)
        showSnackbar('Invalid pincode or lookup failed', 'warning')
      }
    }
  }

  const uploadFile = async file => {
    const formDataObj = new FormData()
    formDataObj.append('file', file)

    try {
      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: token
        }
      })
      return res.data.url
    } catch (error) {
      console.error('Error uploading file:', error)
      showSnackbar('Error uploading file', 'error')
      return null
    }
  }

  const handleFileUpload = async (file, fieldPath) => {
    if (file) {
      const url = await uploadFile(file)
      if (url) {
        const keys = fieldPath.split('.')
        setFormData(prev => {
          const updated = { ...prev }
          let current = updated
          for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] }
            current = current[keys[i]]
          }
          current[keys[keys.length - 1]] = url
          return updated
        })
        showSnackbar('File uploaded successfully', 'success')
      }
    }
  }

  const fetchDropdownData = async () => {
    try {
      const [orgTypesRes, industryRes, sectorRes, languagesRes, qualificationsRes] = await Promise.all([
        axios.get(`${baseUrl}/v1/api/masterDropDown/subDropDown/getList?status=active&name=organizationtype`, {
          headers: { authorization: token }
        }),
        axios.get(`${baseUrl}/v1/api/masterDropDown/subDropDown/getList?status=active&name=industry`, {
          headers: { authorization: token }
        }),
        axios.get(`${baseUrl}/v1/api/masterDropDown/subDropDown/getList?status=active&name=sector`, {
          headers: { authorization: token }
        }),
        axios.get(`${baseUrl}/v1/api/masterDropDown/subDropDown/getList?name=language`, {
          headers: { authorization: token }
        }),
        axios.get(`${baseUrl}/v1/api/masterDropDown/subDropDown/getList?name=qualification`, {
          headers: { authorization: token }
        })
      ])

      setOrgTypes(orgTypesRes.data.items)
      setIndustryTypes(industryRes.data.items)
      setSectorTypes(sectorRes.data.items)
      setLanguages(languagesRes.data.items)
      setQualifications(qualificationsRes.data.items)

      // Fetch currencies separately
      getCurrencies()
    } catch (error) {
      console.error('Error fetching dropdown data:', error)
      showSnackbar('Error fetching dropdown data', 'error')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        ...formData,
        userId: userData.empID
      }

      // Update existing organization
      await axios.post(`${baseUrl}/v1/api/org/updateOrganizationType/${selectedOrgId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      showSnackbar('Organization updated successfully!', 'success')

      setEditMode(false)
      setIsNewOrg(false)
      getOrganizations() // Refresh the list
    } catch (error) {
      console.error('Error saving organization:', error)
      showSnackbar('Error saving organization', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await axios.post(
        `${baseUrl}/v1/api/org/deleteOrganizationType/${selectedOrgId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      showSnackbar('Organization deleted successfully!', 'success')
      setDeleteDialog(false)
      getOrganizations() // Refresh the list
      setSelectedOrgId('')
    } catch (error) {
      console.error('Error deleting organization:', error)
      showSnackbar('Error deleting organization', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleNewOrganization = () => {
    // Find INR currency ID
    const inrCurrency = currencies.find(currency => currency.name === 'INR')
    const defaultCurrencyId = inrCurrency ? inrCurrency._id : ''

    setIsNewOrg(true)
    setEditMode(true)
    setSelectedOrgId('')
    // Reset form data
    setFormData({
      name: '',
      logo: '',
      website: '',
      typeOfOrganization: null,
      typeOfIndustry: null,
      typeOfSector: null,
      contactPerson: '',
      contactNumber: '',
      contactEmail: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      state: '',
      country: 'India',
      zipCode: '',
      registeredAddress: '',
      Hirefor: '',
      haveGSTIN: false,
      GSTNumber: '',
      CINNumber: '',
      Pan: '',
      abbreviation: '',
      domain: '',
      defaultCurrency: defaultCurrencyId,
      incorporationDate: '',
      promoterDetail: {
        passportSizePhoto: '',
        fullName: '',
        fatherOrHusbandName: '',
        dateOfBirth: '',
        languagePreferenceId: null,
        contactNumber: '',
        email: '',
        correspondenceAddress: '',
        aadharNumber: '',
        panCardNumber: '',
        yearsOfExperience: 0,
        qualificationId: null,
        photo: '',
        aadharCard: '',
        panCard: ''
      },
      managementDetail: {
        passportSizePhoto: '',
        fullName: '',
        fatherOrHusbandName: '',
        dateOfBirth: '',
        languagePreferenceId: null,
        contactNumber: '',
        email: '',
        correspondenceAddress: '',
        aadharNumber: '',
        panCardNumber: '',
        yearsOfExperience: 0,
        qualificationId: null,
        photo: '',
        aadharCard: '',
        panCard: ''
      },
      employeeData: {
        employeName: '',
        userName: '',
        password: ''
      }
    })
  }

  useEffect(() => {
    fetchDropdownData()
    getOrganizations()
  }, [])

  return (
    <Container maxWidth='xl' sx={{ py: 3 }}>
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
              <BusinessIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
                Organization Setup
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color='white'
              variant={editMode ? 'contained' : 'outlined'}
              startIcon={editMode ? loading ? <CircularProgress size={20} /> : <SaveIcon /> : <EditIcon />}
              onClick={editMode ? handleSave : () => setEditMode(true)}
              disabled={loading || (!selectedOrgId && !isNewOrg)}
              sx={{borderRadius: "25px"}}
            >
              {editMode ? 'Save Changes' : 'Edit'}
            </Button>
            {/* <Button variant="outlined" startIcon={<RefreshIcon />} onClick={getOrganizations} disabled={loading}>
            Refresh
          </Button> */}
            <Button color='white' sx={{borderRadius: "25px"}} variant='outlined' onClick={() => router.push('/employeeSetup')}>
              <KeyboardBackspaceIcon />
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Organization Logo */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                src={formData.logo}
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  border: '4px solid',
                  borderColor: 'primary.light'
                }}
              >
                <BusinessIcon sx={{ fontSize: 60 }} />
              </Avatar>
              {editMode && (
                <>
                  <input
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    ref={logoRef}
                    onChange={e => handleFileUpload(e.target.files[0], 'logo')}
                  />
                  <Button
                    variant='outlined'
                    startIcon={<UploadIcon />}
                    onClick={() => logoRef.current.click()}
                    sx={{ mt: 1 }}
                  >
                    Upload Logo
                  </Button>
                </>
              )}
              <Typography variant='h5' sx={{ mt: 2, fontWeight: 'bold' }}>
                {formData.name || 'Organization Name'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {formData.website || 'www.organization.com'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Basic Information */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              avatar={<BusinessIcon color='primary' />}
              title='Basic Information'
              action={editMode && <Chip label='Editing' color='primary' variant='outlined' size='small' />}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    label='Organization Name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label='Abbreviation'
                    name='abbreviation'
                    value={formData.abbreviation}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Website'
                    name='website'
                    value={formData.website}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <WebIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label='Organization Type'
                    name='typeOfOrganization'
                    value={formData.typeOfOrganization}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputLabelProps={{
                      shrink: true
                    }}>
                    {orgTypes.map(type => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label='Industry Type'
                    name='typeOfIndustry'
                    value={formData.typeOfIndustry}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputLabelProps={{
                      shrink: true
                    }}>
                    {industryTypes.map(type => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label='Sector Type'
                    name='typeOfSector'
                    value={formData.typeOfSector}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputLabelProps={{
                      shrink: true
                    }}>
                    {sectorTypes.map(type => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label='Default Currency'
                    name='defaultCurrency'
                    value={formData.defaultCurrency}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputLabelProps={{
                      shrink: true
                    }}>
                    {currencies.map(currency => (
                      <MenuItem key={currency._id} value={currency._id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant='body2' sx={{ minWidth: 30 }}>
                            {currency.icon}
                          </Typography>
                          <Typography variant='body2'>{currency.name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label='Hiring For'
                    name='Hirefor'
                    value={formData.Hirefor}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputLabelProps={{
                      shrink: true
                    }}>
                      <MenuItem value="YourSelf">Yourself</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Registered Address'
                    name='registeredAddress'
                    value={formData.registeredAddress}
                    onChange={handleChange}
                    disabled={!editMode}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader avatar={<ContactIcon color='primary' />} title='Contact Information' />
            <CardContent sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Contact Person'
                    name='contactPerson'
                    value={formData.contactPerson}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Contact Number'
                    name='contactNumber'
                    value={formData.contactNumber}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Contact Email'
                    name='contactEmail'
                    value={formData.contactEmail}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Address Line 1'
                    name='addressLine1'
                    value={formData.addressLine1}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Address Line 2'
                    name='addressLine2'
                    value={formData.addressLine2}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label='Pin Code'
                    name='zipCode'
                    value={formData.zipCode}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label='City'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='State'
                    name='state'
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                {/* Add empty space to match the height of Basic Information card */}
                <Grid item xs={12} sx={{ minHeight: 56 }}>
                  {/* This empty space ensures both cards have the same height */}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Legal Information */}
        <Grid item xs={12}>
          <Card>
            <CardHeader avatar={<BankIcon color='primary' />} title='Legal & Financial Information' />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.5}>
                  <TextField
                    fullWidth
                    label='PAN Number'
                    name='Pan'
                    value={formData.Pan}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <DocumentIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.5}>
                  <TextField
                    fullWidth
                    label='CIN Number'
                    name='CINNumber'
                    value={formData.CINNumber}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.haveGSTIN}
                        onChange={handleChange}
                        name='haveGSTIN'
                        disabled={!editMode}
                      />
                    }
                    label='Has GSTIN'
                  />
                </Grid>
                {formData.haveGSTIN && (
                  <Grid item xs={12} sm={6} md={2.5}>
                    <TextField
                      fullWidth
                      label='GST Number'
                      name='GSTNumber'
                      value={formData.GSTNumber}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6} md={2.5}>
                  <TextField
                    fullWidth
                    label='Incorporation Date'
                    type='date'
                    name='incorporationDate'
                    value={formData.incorporationDate}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Promoter Details */}
        {/* <Grid item xs={12} md={6}>
          <Card>
            <CardHeader avatar={<PersonIcon color="primary" />} title="Promoter Details" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center", mb: 2 }}>
                  <Avatar src={formData.promoterDetail.photo} sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}>
                    <PersonIcon />
                  </Avatar>
                  {editMode && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={promoterPhotoRef}
                        onChange={(e) => handleFileUpload(e.target.files[0], "promoterDetail.photo")}
                      />
                      <IconButton onClick={() => promoterPhotoRef.current.click()}>
                        <CameraIcon />
                      </IconButton>
                    </>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="promoterDetail.fullName"
                    value={formData.promoterDetail.fullName}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Father/Husband Name"
                    name="promoterDetail.fatherOrHusbandName"
                    value={formData.promoterDetail.fatherOrHusbandName}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="promoterDetail.contactNumber"
                    value={formData.promoterDetail.contactNumber}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="promoterDetail.email"
                    value={formData.promoterDetail.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correspondence Address"
                    name="promoterDetail.correspondenceAddress"
                    value={formData.promoterDetail.correspondenceAddress}
                    onChange={handleChange}
                    disabled={!editMode}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Years of Experience"
                    type="number"
                    name="promoterDetail.yearsOfExperience"
                    value={formData.promoterDetail.yearsOfExperience}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <WorkIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Language Preference"
                    name="promoterDetail.languagePreferenceId"
                    value={formData.promoterDetail.languagePreferenceId || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <LanguageIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang._id} value={lang._id}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Qualification"
                    name="promoterDetail.qualificationId"
                    value={formData.promoterDetail.qualificationId || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <SchoolIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  >
                    {qualifications.map((qual) => (
                      <MenuItem key={qual._id} value={qual._id}>
                        {qual.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Aadhar Number"
                    name="promoterDetail.aadharNumber"
                    value={formData.promoterDetail.aadharNumber}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PAN Card Number"
                    name="promoterDetail.panCardNumber"
                    value={formData.promoterDetail.panCardNumber}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>

                {editMode && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Document Uploads
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Passport Size Photo
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={promoterPassportRef}
                          onChange={(e) => handleFileUpload(e.target.files[0], "promoterDetail.passportSizePhoto")}
                        />
                        <Button
                          variant="outlined"
                          startIcon={<UploadIcon />}
                          onClick={() => promoterPassportRef.current.click()}
                          size="small"
                          fullWidth
                        >
                          Upload
                        </Button>
                        {formData.promoterDetail.passportSizePhoto && (
                          <Box sx={{ mt: 1, textAlign: "center" }}>
                            <img
                              src={formData.promoterDetail.passportSizePhoto || "/placeholder.svg?height=60&width=60"}
                              alt="Passport Size"
                              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Aadhar Card
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={promoterAadharRef}
                          onChange={(e) => handleFileUpload(e.target.files[0], "promoterDetail.aadharCard")}
                        />
                        <Button
                          variant="outlined"
                          startIcon={<UploadIcon />}
                          onClick={() => promoterAadharRef.current.click()}
                          size="small"
                          fullWidth
                        >
                          Upload
                        </Button>
                        {formData.promoterDetail.aadharCard && (
                          <Box sx={{ mt: 1, textAlign: "center" }}>
                            <img
                              src={formData.promoterDetail.aadharCard || "/placeholder.svg?height=40&width=60"}
                              alt="Aadhar Card"
                              style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          PAN Card
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={promoterPanRef}
                          onChange={(e) => handleFileUpload(e.target.files[0], "promoterDetail.panCard")}
                        />
                        <Button
                          variant="outlined"
                          startIcon={<UploadIcon />}
                          onClick={() => promoterPanRef.current.click()}
                          size="small"
                          fullWidth
                        >
                          Upload
                        </Button>
                        {formData.promoterDetail.panCard && (
                          <Box sx={{ mt: 1, textAlign: "center" }}>
                            <img
                              src={formData.promoterDetail.panCard || "/placeholder.svg?height=40&width=60"}
                              alt="PAN Card"
                              style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Management Details */}
        {/* <Grid item xs={12} md={6}>
          <Card>
            <CardHeader avatar={<PersonIcon color="primary" />} title="Management Details" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center", mb: 2 }}>
                  <Avatar src={formData.managementDetail.photo} sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}>
                    <PersonIcon />
                  </Avatar>
                  {editMode && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={managementPhotoRef}
                        onChange={(e) => handleFileUpload(e.target.files[0], "managementDetail.photo")}
                      />
                      <IconButton onClick={() => managementPhotoRef.current.click()}>
                        <CameraIcon />
                      </IconButton>
                    </>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="managementDetail.fullName"
                    value={formData.managementDetail.fullName}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Father/Husband Name"
                    name="managementDetail.fatherOrHusbandName"
                    value={formData.managementDetail.fatherOrHusbandName}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="managementDetail.contactNumber"
                    value={formData.managementDetail.contactNumber}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="managementDetail.email"
                    value={formData.managementDetail.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correspondence Address"
                    name="managementDetail.correspondenceAddress"
                    value={formData.managementDetail.correspondenceAddress}
                    onChange={handleChange}
                    disabled={!editMode}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Years of Experience"
                    type="number"
                    name="managementDetail.yearsOfExperience"
                    value={formData.managementDetail.yearsOfExperience}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <WorkIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Language Preference"
                    name="managementDetail.languagePreferenceId"
                    value={formData.managementDetail.languagePreferenceId || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <LanguageIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang._id} value={lang._id}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Qualification"
                    name="managementDetail.qualificationId"
                    value={formData.managementDetail.qualificationId || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <SchoolIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  >
                    {qualifications.map((qual) => (
                      <MenuItem key={qual._id} value={qual._id}>
                        {qual.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Aadhar Number"
                    name="managementDetail.aadharNumber"
                    value={formData.managementDetail.aadharNumber}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PAN Card Number"
                    name="managementDetail.panCardNumber"
                    value={formData.managementDetail.panCardNumber}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>

                {editMode && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Document Uploads
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Passport Size Photo
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={managementPassportRef}
                          onChange={(e) => handleFileUpload(e.target.files[0], "managementDetail.passportSizePhoto")}
                        />
                        <Button
                          variant="outlined"
                          startIcon={<UploadIcon />}
                          onClick={() => managementPassportRef.current.click()}
                          size="small"
                          fullWidth
                        >
                          Upload
                        </Button>
                        {formData.managementDetail.passportSizePhoto && (
                          <Box sx={{ mt: 1, textAlign: "center" }}>
                            <img
                              src={formData.managementDetail.passportSizePhoto || "/placeholder.svg?height=60&width=60"}
                              alt="Passport Size"
                              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Aadhar Card
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={managementAadharRef}
                          onChange={(e) => handleFileUpload(e.target.files[0], "managementDetail.aadharCard")}
                        />
                        <Button
                          variant="outlined"
                          startIcon={<UploadIcon />}
                          onClick={() => managementAadharRef.current.click()}
                          size="small"
                          fullWidth
                        >
                          Upload
                        </Button>
                        {formData.managementDetail.aadharCard && (
                          <Box sx={{ mt: 1, textAlign: "center" }}>
                            <img
                              src={formData.managementDetail.aadharCard || "/placeholder.svg?height=40&width=60"}
                              alt="Aadhar Card"
                              style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          PAN Card
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={managementPanRef}
                          onChange={(e) => handleFileUpload(e.target.files[0], "managementDetail.panCard")}
                        />
                        <Button
                          variant="outlined"
                          startIcon={<UploadIcon />}
                          onClick={() => managementPanRef.current.click()}
                          size="small"
                          fullWidth
                        >
                          Upload
                        </Button>
                        {formData.managementDetail.panCard && (
                          <Box sx={{ mt: 1, textAlign: "center" }}>
                            <img
                              src={formData.managementDetail.panCard || "/placeholder.svg?height=40&width=60"}
                              alt="PAN Card"
                              style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button variant={'contained'} startIcon={<SaveIcon />} onClick={handleSave} disabled={!editMode}>
          Save Changes
        </Button>
        {/* <Button variant="outlined" startIcon={<RefreshIcon />} onClick={getOrganizations} disabled={loading}>
            Refresh
          </Button> */}
        {/* <Button variant="outlined" onClick={() => router.push("/employeeSetup")}>
            Back
          </Button> */}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }} variant='filled'>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Organization</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this organization? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color='error' disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
