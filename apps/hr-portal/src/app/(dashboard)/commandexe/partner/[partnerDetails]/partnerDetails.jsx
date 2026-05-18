import {
  fetchPartnerDetailsAPI,
  getPartnerDetailsAPI,
  getPartnerProductsAPI,
  updatePartnerDetailsAPI,
  uploadImageApi
} from '@/services/apiService'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
  Avatar,
  Paper,
  Alert
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SaveIcon from '@mui/icons-material/Save'
import { styled } from '@mui/material/styles'
import CustomTextField from '@/@core/components/mui/TextField'
import { compareAsc } from 'date-fns'

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const LogoPlaceholder = styled(Paper)(({ theme }) => ({
  width: 100,
  height: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  border: `2px dashed ${theme.palette.grey[300]}`,
  color: theme.palette.text.secondary
}))

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 100,
  height: 100,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden'
}))

const PartnerDetails = (activeStep, setActiveStep) => {
  const { partnerDetails } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPartner, setSelectedPartner] = useState('')
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phone: '',
    password: ''
  })
  const [companyData, setCompanyData] = useState({
    companyName: '',
    registeredAddress: '',
    corporateAddress: '',
    communicationTo: '',
    communicationCC: [],
    reportingCommunicationCC: {},
    invoiceCommunicationCC: {},
    physicalReportCommunicationCC: {},
    cinNumber: '',
    gstin: '',
    companyLogo: '',
    invoiceRaise: '',
    invoiceCycle: '',
    invoiceStartDate: '',
    invoiceEndDate: '',
    enach: ''
  })
  const [logoPreview, setLogoPreview] = useState('')
  const [newLogo, setNewLogo] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [loading, setLoading] = useState(false)

  // Company type options
  const companyTypes = [
    { value: 'limited', label: 'Limited' },
    { value: 'private', label: 'Private' },
    { value: 'private-limited', label: 'Private-limited' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      if (!partnerDetails) {
        setError('No partner details provided')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await getPartnerDetailsAPI(partnerDetails)

        if (response.items) {
          const { employee, partner } = response.items
          setSelectedPartner(response.items.partner._id)
          setUserData({
            fullName: employee?.employeName || '',
            userName: employee?.userName || '',
            email: employee?.email || '',
            password: employee?.password || '',
            phone: employee?.mobileNo || ''
          })

          setCompanyData({
            companyName: partner.name || '',
            cinNumber: partner.cinNumber || '',
            corporateAddress: partner.corporateAddress || '',
            registeredAddress: partner.registeredAddress || '',
            gstin: partner.gstin || '',
            companyLogo: partner.logo || '',
            // communicationTo: partner.communicationTo || '',
            // communicationCC:company.communicationCC ? company.communicationCC.split(',').map(email => email.trim()) : [],
            reportingCommunicationCC: partner?.reportingCommunication || {},
            invoiceCommunicationCC: partner?.invoiceCommunication || {},
            physicalReportCommunicationCC: partner?.physicalReportCommunication || {},
            //       communicationCC: Array.isArray(company?.communicationCC)
            // ? company.communicationCC
            // : company?.communicationCC ? company.communicationCC.split(',').map(email => email.trim()) : [],
            enach: partner.enach || '',
            invoiceCycle: partner.invoiceCycle || '',
            invoiceStartDate: partner.invoiceStartDate
              ? new Date(partner.invoiceStartDate).toISOString().split('T')[0]
              : '',
            invoiceEndDate: partner.invoiceEndDate ? new Date(partner.invoiceEndDate).toISOString().split('T')[0] : '',
            invoiceRaise: partner.invoiceRaise || ''
          })

          if (partner.logo) {
            setLogoPreview(partner.logo)
          }
        }
      } catch (error) {
        console.error('Error fetching partner details:', error)
        setError('Failed to load partner details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPartnerDetails()
  }, [partnerDetails])

  const handleUserChange = e => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleCompanyChange = e => {
    const { name, value } = e.target
    setCompanyData({ ...companyData, [name]: value })
  }

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0]

    if (file) {
      try {
        const response = await uploadImageApi(file)

        setFormData(prev => ({
          ...prev,
          [fieldName]: response?.items?.fileUrl || ''
        }))
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }
  }

  const handleReportingCommunicationChange = e => {
    const { name, value } = e.target
    const field = name.split('.')[1]

    setCompanyData(prev => ({
      ...prev,
      reportingCommunicationCC: {
        ...prev.reportingCommunicationCC,
        [field]: value
      }
    }))
  }

  const handleInvoiceCommunicationChange = e => {
    const { name, value } = e.target
    const field = name.split('.')[1]

    setCompanyData(prev => ({
      ...prev,
      invoiceCommunicationCC: {
        ...prev.invoiceCommunicationCC,
        [field]: value
      }
    }))
  }
  const handlePhysicalReportCommunicationChange = e => {
    const { name, value } = e.target
    const field = name.split('.')[1]

    setCompanyData(prev => ({
      ...prev,
      physicalReportCommunicationCC: {
        ...prev.physicalReportCommunicationCC,
        [field]: value
      }
    }))
  }

  const handleLogoChange = async e => {
    const file = e.target.files[0]
    if (file) {
      setLoading(true) // Set loading state to true when upload starts
      try {
        // Create object URL for preview
        const objectUrl = URL.createObjectURL(file)

        // Upload the image to the server
        const uploadResult = await uploadImageApi(file)

        // Update state with the uploaded file URL
        setNewLogo(uploadResult.items.fileUrl)
        setLogoPreview(objectUrl)

        // Update company data with the new logo URL
        setCompanyData({ ...companyData, companyLogo: uploadResult.items.fileUrl })
      } catch (error) {
        console.error('Error uploading logo:', error)
        // Handle upload error (you could add error state and display a message)
      } finally {
        setLoading(false) // Set loading state to false when upload completes or fails
      }
    }
  }

  const router = useRouter()

  const handleRemoveLogo = () => {
    setLogoPreview('')
    setNewLogo(null)
    setCompanyData({ ...companyData, companyLogo: '' })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMessage('')

    try {
      // Prepare the data to update
      const updateData = {
        id: selectedPartner,
        companyLogo: newLogo,
        employeName: userData.fullName || '',
        userName: userData.userName || '',
        email: userData.email || '',
        password: userData.password || '',
        mobileNo: userData.phone || '',
        companyName: companyData.companyName || '',
        cinNumber: companyData.cinNumber || '',
        corporateAddress: companyData.corporateAddress || '',
        registeredAddress: companyData.registeredAddress || '',
        gstin: companyData.gstin || '',
        companyLogo: companyData.companyLogo || '',
        // communicationTo: companyData.communicationTo || '',
        // communicationCC: companyData.communicationCC || [],
        reportingCommunication: companyData.reportingCommunicationCC,
        invoiceCommunication: companyData.invoiceCommunicationCC,
        physicalReportCommunication: companyData.physicalReportCommunicationCC,
        enach: companyData.enach || '',
        invoiceCycle: companyData.invoiceCycle || '',
        invoiceStartDate: companyData.invoiceStartDate || '',
        invoiceEndDate: companyData.invoiceEndDate || '',
        invoiceRaise: companyData.invoiceRaise || ''
      }


      // Send the update to the API
      const response = await updatePartnerDetailsAPI(updateData)
      if (response.status) {
        setSuccessMessage('Partner details updated successfully')
        setOpenSnackbar(true)
        // router.push('/partner');
      } else {
        setSuccessMessage(response.message)
        setOpenSnackbar(true)
      }
    } catch (error) {
      console.error('Error updating partner details:', error)
      setError('Failed to update partner details. Please try again.')
    } finally {
      setIsSaving(false)
      fetchPartnerDetailsAPI()
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <CircularProgress />
      </Box>
    )
  }

  if (error && !userData.fullName) {
    return (
      <Container maxWidth='md'>
        <Alert severity='error' sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth='xl'>
      <Box elevation={3} sx={{ mx: '-24px', padding: 2, borderRadius: 2 }}>
        <Box sx={{ py: 4 }}>
          {/* <Typography variant='h4' component='h1' gutterBottom>
            Client Details
          </Typography> */}

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
            {/* Company Information */}
            <Box sx={{ mb: 4 }}>
              {/* Logo Upload Section */}
              {activeStep?.activeStep === 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant='h6' component='h2' sx={{ mb: 3 }}>
                    Company Information
                  </Typography>

                  <Grid item xs={12}>
                    <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                      Company Logo
                    </Typography>
                    {companyData?.companyLogo !== '' ? (
                      <Box display='flex' alignItems='center' gap={2}>
                        <Box
                          component='img'
                          src={companyData?.companyLogo}
                          alt='Company Logo'
                          sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, border: '1px solid #ccc' }}
                        />
                        <IconButton onClick={handleRemoveLogo} color='error' aria-label='Remove Logo'>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Button
                        variant='outlined'
                        component='label'
                        disabled={isLoading}
                        sx={{ width: '180px', border: '1px solid #2F2B3B38', color: '#848484' }}
                      >
                        Upload Logo
                        <input type='file' accept='image/*' hidden onChange={handleLogoChange} />
                      </Button>
                    )}
                  </Grid>
                  <Divider sx={{ mb: 2, mt: 2 }} />
                  <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item xs={12}>
                      <Typography variant='h5' component='h1' fontWeight={'bold'} sx={{ mb: 3 }}>
                        Client Details
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='fullName'
                        name='fullName'
                        label='Full Name'
                        value={userData.fullName}
                        onChange={handleUserChange}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='userName'
                        name='userName'
                        label='User Name'
                        value={userData.userName}
                        onChange={handleUserChange}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='password'
                        name='Password'
                        type='password'
                        label='Password'
                        value={userData.password}
                        onChange={handleUserChange}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='email'
                        name='email'
                        label='Email'
                        type='email'
                        value={userData.email}
                        onChange={handleUserChange}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        required
                        fullWidth
                        id='companyName'
                        name='companyName'
                        label='Company Name'
                        value={companyData.companyName}
                        onChange={handleCompanyChange}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='registeredAddress'
                        name='registeredAddress'
                        label='Registered Address'
                        value={companyData.registeredAddress}
                        onChange={handleCompanyChange}
                        variant='outlined'
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='corporateAddress'
                        name='corporateAddress'
                        label='Corporate Address'
                        value={companyData.corporateAddress}
                        onChange={handleCompanyChange}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='phone'
                        name='phone'
                        label='Phone'
                        value={userData.phone}
                        onChange={handleCompanyChange}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='gstin'
                        name='gstin'
                        label='gstin'
                        value={companyData.gstin}
                        onChange={handleCompanyChange}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='cinNumber'
                        name='cinNumber'
                        label='CIN'
                        value={companyData.cinNumber}
                        onChange={handleCompanyChange}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='invoiceRaise'
                        name='invoiceRaise'
                        label='Invoice Raise'
                        value={companyData.invoiceRaise}
                        onChange={handleCompanyChange}
                        variant='outlined'
                        select
                      >
                        <MenuItem value='Manual'>Manual</MenuItem>
                        <MenuItem value='Automatic'>Automatic</MenuItem>
                      </CustomTextField>
                    </Grid>

                    {companyData.invoiceRaise === 'Automatic' && (
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          fullWidth
                          id='invoiceCycle'
                          name='invoiceCycle'
                          label='Invoice Cycle'
                          value={companyData.invoiceCycle}
                          onChange={handleCompanyChange}
                          variant='outlined'
                          select
                        >
                          <MenuItem value='15 days'>15 days</MenuItem>
                          <MenuItem value='monthly'>Monthly</MenuItem>
                        </CustomTextField>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='invoiceStartDate'
                        name='invoiceStartDate'
                        label='Invoice Start Date'
                        value={companyData.invoiceStartDate}
                        onChange={handleCompanyChange}
                        variant='outlined'
                        type='date'
                      ></CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        id='invoiceEndDate'
                        name='invoiceEndDate'
                        label='Invoice End Date'
                        value={companyData.invoiceEndDate}
                        onChange={handleCompanyChange}
                        variant='outlined'
                        type='date'
                      ></CustomTextField>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep?.activeStep === 1 && (
                <Grid container spacing={4} padding={7}>
                  <Grid item xs={12}>
                    <Typography variant='h5' sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      Reporting Communication
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      id='reportingCommunicationCC.communicationTo'
                      name='reportingCommunicationCC.communicationTo'
                      label='Reporting Communication To'
                      value={companyData?.reportingCommunicationCC?.communicationTo}
                      onChange={handleReportingCommunicationChange}
                      variant='outlined'
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      id='reportingCommunicationCC.communicationCC'
                      name='reportingCommunicationCC.communicationCC'
                      label='Reporting Communication CC'
                      value={companyData?.reportingCommunicationCC?.communicationCC}
                      onChange={handleReportingCommunicationChange}
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h5' sx={{ fontWeight: 600, mb: 2, mt: 3, color: 'primary.main' }}>
                      Invoice Communication
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      id='invoiceCommunicationCC.communicationTo'
                      name='invoiceCommunicationCC.communicationTo'
                      label='Invoice Communication To'
                      value={companyData?.invoiceCommunicationCC?.communicationTo}
                      onChange={handleInvoiceCommunicationChange}
                      variant='outlined'
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      id='invoiceCommunicationCC.communicationCC'
                      name='invoiceCommunicationCC.communicationCC'
                      label='Invoice Communication CC'
                      value={companyData?.invoiceCommunicationCC?.communicationCC}
                      onChange={handleInvoiceCommunicationChange}
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h5' sx={{ fontWeight: 600, mb: 2, mt: 3, color: 'primary.main' }}>
                      Physical Report Communication
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      id='physicalReportCommunicationCC.communicationTo'
                      name='physicalReportCommunicationCC.communicationTo'
                      label='Physical Report Communication To'
                      value={companyData?.physicalReportCommunicationCC?.communicationTo}
                      onChange={handlePhysicalReportCommunicationChange}
                      variant='outlined'
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      id='physicalReportCommunicationCC.communicationCC'
                      name='physicalReportCommunicationCC.communicationCC'
                      label='Physical Report Communication CC'
                      value={companyData?.physicalReportCommunicationCC?.communicationCC}
                      onChange={handlePhysicalReportCommunicationChange}
                      variant='outlined'
                    />
                  </Grid>
                </Grid>
              )}

              {/* {activeStep?.activeStep === 2 && (
                <Grid container spacing={3} sx={{ mt: 4 }}>
                  <Grid item xs={12}>
                               <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
                                 Signature Mode
                               </Typography>
                               <Divider sx={{ mb: 4 }} />
                               <Typography variant="body1" sx={{ mb: 3 }}>
                                 Select how the client will sign documents and agreements.
                               </Typography>
                             </Grid>
                  <Grid item xs={12} sm={4}>
                    <CustomTextField
                      fullWidth
                      id='enach'
                      name='enach'
                      label='Signature Mode'
                      value={companyData.enach}
                      onChange={handleCompanyChange}
                      variant='outlined'
                      select
                    >
                      <MenuItem value='esign'>Esign</MenuItem>
                      <MenuItem value='physical'>Physical</MenuItem>
                      <MenuItem value='upload'>Upload</MenuItem>
                    </CustomTextField>
                  </Grid>

                  {companyData.enach === 'upload' && (
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', mt:4 }}>
                      <Button variant='contained' component='label'>
                        Upload File
                        <input type='file' hidden onChange={e => handleFileUpload(e, 'sign')} />
                      </Button>
                    </Grid>
                  )}
                </Grid>
              )} */}
            </Box>
            {activeStep?.activeStep === 1 && (
              <Box display='flex' justifyContent='flex-end'>
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  onClick={handleSubmit}
                  startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} variant='filled' severity='success' sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default PartnerDetails
