'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Container,
  Paper,
  OutlinedInput,
  Tooltip,
} from '@mui/material'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import ViewComfyIcon from '@mui/icons-material/ViewComfy'
import { Filter, User2 } from 'lucide-react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { Delete, Edit, ToggleOff, ToggleOn } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { Add as AddIcon } from '@mui/icons-material'
import { useApi } from '@core/hooks/useApi'

const GradientBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
  padding: theme.spacing(3)
}))

const CustomToolbar = () => (
  <GridToolbarContainer sx={{ p: 1, gap: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: '#6366f1' }}>
      <ViewColumnIcon sx={{ fontSize: 18 }} />
      <Typography variant='body2'>Columns</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: '#6366f1' }}>
      <Filter size={18} />
      <Typography variant='body2'>Filters</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: '#6366f1' }}>
      <ViewComfyIcon sx={{ fontSize: 18 }} />
      <Typography variant='body2'>Density</Typography>
    </Box>
  </GridToolbarContainer>
)

export default function AgentCreationPage() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    product: '',
    mobile: '',
    employeeId: ''
  })
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [mobileError, setMobileError] = useState('')
  const { callApi } = useApi()

  const [isLoading, setIsLoading] = useState(false)

  const [agentAll, setAgentAll] = useState([])

  const getAgentAll = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${baseUrl}/v1/api/airphone/saved-agents`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      const agents = response.data?.items // ✅ FIXED HERE
      setAgentAll(Array.isArray(agents) ? agents : [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = field => e => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const [addAgent, setAddAgent] = useState([])
  // Get empID from localStorage (ensure it's saved there on login)
  const empID = typeof window !== 'undefined' ? localStorage.getItem('empID') : null

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        employeeId: formData.employeeId._id,
        name: formData.employeeId.employeName
      }

      await axios.post(`${baseUrl}/v1/api/airphone/add-agent`, payload, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      setOpen(false)
      setFormData({
        employeeId: '',
        product: '',
        mobile: ''
      })

      getAgentAll() // Refresh agent list
    } catch (error) {
      console.error('Error saving Agent:', error)
    }
  }
  const [employees, setEmployees] = useState([])

  const getAllEmployees = async () => {
    try {
      const response = await callApi({
        endpoint: `/v1/api/interview/getAllEmployee`,
        disableSnackbar: true
      })

      if (response.success && response.data?.items) {
        setEmployees(response.data.items.employees)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleActivity = async (vnm, mobile, status) => {
    try {
      const res = await callApi({
        endpoint: `/v1/api/airphone/updateStatus`,
        disableSnackbar: false,
        data: {
          mobile: mobile,
          status: status,
          virtual_number: vnm
        },
        method: 'POST'
      })
      if (res.success) {
        getAgentAll()
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  useEffect(() => {
    getAgentAll()
    getAllEmployees()
  }, [])

  const columns = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'product', headerName: 'Product', width: 250 },
    { field: 'mobile', headerName: 'Phone Number', width: 250 },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => {
        const isActive = params.value === 'Active';

        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              bgcolor: isActive ? '#e8f5e9' : '#ffebee',
              color: isActive ? '#2e7d32' : '#c62828',
              fontWeight: 500,
            }}
          />
        );
      }
    },

    { field: 'virtual_number', headerName: 'Virtual Number', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <Stack direction='row' spacing={1}>
          <Tooltip title={params.row.status === 'Active' ? 'Deactivate' : 'Activate'} placement='top'>
            <IconButton
              size='small'
              sx={{
                width: 28,
                height: 28,
                background:
                  params.row.status !== 'Active'
                    ? 'linear-gradient(135deg, #f44336, #d32f2f)'
                    : 'linear-gradient(135deg, #4caf50, #388e3c)',
                color: 'white',
                // '&:hover': {
                //   background:
                //     params.row.status == 'Active'
                //       ? 'linear-gradient(135deg, #d32f2f, #c62828)'
                //       : 'linear-gradient(135deg, #388e3c, #2e7d32)'
                // }
              }}
              onClick={e => {
                e.stopPropagation()
                handleActivity(
                  params.row.virtual_number,
                  params.row.mobile,
                  params.row.status === 'Active' ? 'Inactive' : 'Active'
                )
              }}
            >
              {params.row.status === 'Active' ? (
                <ToggleOff sx={{ fontSize: 18 }} />
              ) : (
                <ToggleOn sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>
          {/* <IconButton size='small'>
            <Delete fontSize='small' color='error' />
          </IconButton> */}
        </Stack>
      )
    }
  ]

  return (
    <GradientBox>
      <Container maxWidth='xl'>
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
                  justifyContent: 'center'
                }}
              >
                <User2 sx={{ fontSize: 30, color: 'white' }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant='h4' fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
                  Authorization to Call
                </Typography>
                {/* <Tooltip title='Manage educational qualifications and degrees that can be assigned to employees.'>
                       <InfoOutlinedIcon sx={{ color: '#ffffff', fontSize: 24, cursor: 'pointer' }} />
                     </Tooltip> */}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                color='white'
                variant='outlined'
                startIcon={<AddIcon />}
                onClick={() => {
                  setOpen(true)
                  setFormData({
                    employeeId: '',
                    product: '',
                    mobile: ''
                  })
                }}
                sx={{
                  borderRadius: '25px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                }}
              >
                {' '}
                Add
              </Button>
              {/* <Button variant="outlined" startIcon={<RefreshIcon />} onClick={getOrganizations} disabled={loading}>
                               Refresh
                             </Button> */}
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

        {/* <Paper
            elevation={0}
            sx={{
              py: 2,
              px: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <User2 size={28} color='#ffb86c' />
                </Box>
                <Typography variant='h5' fontWeight={700}>
                  Authorization to Call
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={() => setOpen(true)}
                  sx={{ borderRadius: '25px', px: 3, py: 1, fontWeight: 600 }}
                >
                  Add Agent
                </Button>
                <Button variant='outlined' sx={{ borderRadius: '25px' }} onClick={() => router.push('/employeeSetup')}>
                  <KeyboardBackspaceIcon />
                </Button>
              </Box>
            </Box>
          </Paper>
       */}

        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={Array.isArray(agentAll) ? agentAll.map(item => ({ id: item._id, ...item })) : []}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: () => <Typography sx={{ p: 3 }}>No agents found</Typography>
            }}
            disableRowSelectionOnClick
            loading={isLoading}
            sx={{
              minWidth: '1000px',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#1976d2',
                color: '#fff',
                fontWeight: 600
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#1976d2',
                color: '#fff'
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                color: '#fff'
              },
              '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
                color: '#fff'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                display: 'flex',
                alignItems: 'center'
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  cursor: 'pointer'
                }
              },
              '& .MuiDataGrid-toolbarContainer': {
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e0e0e0'
              }
            }}
          />
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='md'>
          <DialogTitle>Add +</DialogTitle>
          <DialogContent sx={{ mt: 1 }}>
            <Grid container spacing={1} mt={0.5}>
              {/* Select Employee */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Employee</InputLabel>
                  <Select
                    name='selectedEmployee'
                    value={formData.employeeId}
                    onChange={handleChange('employeeId')}
                    input={
                      <OutlinedInput
                        label='Select Employee'
                        startAdornment={
                          <InputAdornment position='start'>{/* <Person sx={{ color: '#64748b' }} /> */}</InputAdornment>
                        }
                      />
                    }
                  >
                    {employees.map(employee => (
                      <MenuItem value={employee}>{employee.employeName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label='Mobile Number'
                  fullWidth
                  value={formData.mobile}
                  onChange={e => {
                    const value = e.target.value

                    // Allow only digits and max 10 characters
                    if (/^\d{0,10}$/.test(value)) {
                      setFormData(prev => ({ ...prev, mobile: value }))

                      if (value.length === 10) {
                        setMobileError('')
                      } else {
                        setMobileError('Mobile number must be 10 digits')
                      }
                    }
                  }}
                  error={Boolean(mobileError)}
                  helperText={mobileError}
                />
              </Grid>
              {/* <TextField label='Name' fullWidth value={formData.employeeId.employeName} /> */}
              <Grid item xs={12} md={12} mt={2}>
                <TextField label='Product' fullWidth value={formData.product} onChange={handleChange('product')} />
              </Grid>
              {/* <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={formData.status} onChange={handleChange('status')} label='Status'>
                  <MenuItem value='Active'>Active</MenuItem>
                  <MenuItem value='Inactive'>Inactive</MenuItem>
                </Select>
              </FormControl> */}

              {/* <TextField
                label='Virtual Number'
                fullWidth
                value={formData.virtual_number}
                onChange={handleChange('virtual_number')}
              /> */}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant='contained' onClick={handleSave} sx={{ background: '#5e35b1' }}>
              Add Agent
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </GradientBox>
  )
}
