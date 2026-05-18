'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  Container,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import format from 'date-fns/format'
import { styled } from '@mui/material/styles'
import {
  Work as WorkIcon,
  Warning as AlertTriangleIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  Description as FileTextIcon,
  CurrencyRupee,
  Dashboard,
  WorkOffOutlined,
  AddCircleOutline,
  Cancel,
  HourglassEmpty,
  WorkOutline,
  WarningAmber,
  Business
} from '@mui/icons-material'
import { Briefcase, Star, Activity, Clock, Calendar, Filter } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import Reporting from './Reporting/page'
import Graphs from './Graphs/page'
import Budget from './Budget/page'
import { useSearchParams, useRouter } from 'next/navigation'

// Styled components
const GradientBox = styled(Box)(({ theme }) => ({
  background: '#f8fafc',
  minHeight: '100vh',
  padding: theme.spacing(3)
}))

const TabsContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5),
  marginBottom: theme.spacing(3)
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  color: 'white',
  fontWeight: 500,
  minHeight: 48,
  textTransform: 'none',
  '&.Mui-selected': {
    backgroundColor: 'white',
    color: '#2196F3',
    borderRadius: theme.spacing(0.5)
  },
  '&:hover': {
    color: 'white',
    borderRadius: theme.spacing(1)
  },
  '&.MuiTab-root:hover': {
    color: '#0b0303'
  }
}))

// Enhanced Period Filter Component
const PeriodFilterDropdown = ({
  selectedPeriod,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomDateChange
}) => {
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState([
    {
      startDate: customStartDate || new Date(),
      endDate: customEndDate || new Date(),
      key: 'selection'
    }
  ])

  const periodOptions = [
    { value: 'all', label: 'All', icon: <Activity size={16} /> },
    { value: '1days', label: 'Today', icon: <Clock size={16} /> },
    { value: '7days', label: 'Last 7 Days', icon: <Calendar size={16} /> },
    { value: '30days', label: 'Last 30 Days', icon: <Calendar size={16} /> },
    { value: 'custom', label: 'Custom', icon: <Filter size={16} /> }
  ]

  const handlePeriodSelect = period => {
    if (period === 'custom') {
      setCustomDialogOpen(true)
    } else {
      onPeriodChange(period)
    }
  }

  const handleCustomDateApply = () => {
    const startDate = format(tempDateRange[0].startDate, 'yyyy-MM-dd')
    const endDate = format(tempDateRange[0].endDate, 'yyyy-MM-dd')

    onCustomDateChange(tempDateRange[0].startDate, tempDateRange[0].endDate)
    onPeriodChange('custom', startDate, endDate)
    setCustomDialogOpen(false)
  }

  return (
    <>
      <FormControl size='small' sx={{ minWidth: 180 }}>
        <InputLabel>Time Period</InputLabel>
        <Select
          value={selectedPeriod}
          label='Time Period'
          onChange={e => handlePeriodSelect(e.target.value)}
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(99, 102, 241, 0.3)'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(99, 102, 241, 0.5)'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6366f1'
            }
          }}
        >
          {periodOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {option.icon}
                <Typography>{option.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Custom Date Range Dialog */}
      <Dialog open={customDialogOpen} onClose={() => setCustomDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={20} />
            Select Custom Date Range
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <DateRange
              editableDateInputs={true}
              onChange={item => setTempDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={tempDateRange}
              maxDate={new Date()}
              showSelectionPreview={true}
              showDateDisplay={false}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={() => setCustomDialogOpen(false)} variant='outlined' sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleCustomDateApply}
            variant='contained'
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)'
            }}
          >
            Apply Range
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function TabPanel({ children, value, index }) {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon: Icon, bgcolor, iconColor }) {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        p: 2,
        backgroundColor: bgcolor,
        border: '1px solid rgba(0,0,0,0.08)',
        minHeight: 120,
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <CardContent sx={{ p: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant='body2' sx={{ color: '#6b7280', fontWeight: 500, mb: 1 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
          <Box>
            <Typography variant='h3' sx={{ fontWeight: 'bold', color: iconColor, mb: 0.5, lineHeight: 1 }}>
              {value}
            </Typography>
            <Typography variant='body2' sx={{ color: '#6b7280' }}>
              {subtitle}
            </Typography>
          </Box>

          <Icon sx={{ fontSize: 24, color: iconColor, opacity: 0.8, mb: 5 }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default function JobMetricsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [customStartDate, setCustomStartDate] = useState(null)
  const [customEndDate, setCustomEndDate] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [dashboardData, setDashboardData] = useState(null)
  const [apiDataPermissions, setApiDataPermissions] = useState(null)
  const [permissionsLoaded, setPermissionsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const { callApi, loading } = useApi()
  const router = useRouter()

  // Department color mapping
  const departmentColors = {
    Engineering: {
      bgcolor: '#ecfdf5',
      iconColor: '#10b981',
      textColor: '#10b981',
      borderColor: 'rgba(16, 185, 129, 0.1)'
    },
    Marketing: {
      bgcolor: '#f3e8ff',
      iconColor: '#6d28d9',
      textColor: '#6d28d9',
      borderColor: 'rgba(109, 40, 217, 0.1)'
    },
    Finance: { bgcolor: '#fef2f2', iconColor: '#ef4444', textColor: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.1)' },
    HR: { bgcolor: '#fff7ed', iconColor: '#f97316', textColor: '#f97316', borderColor: 'rgba(249, 115, 22, 0.1)' },
    Product: { bgcolor: '#fce7f3', iconColor: '#db2777', textColor: '#db2777', borderColor: 'rgba(219, 39, 119, 0.1)' },
    'Quality Assurance': {
      bgcolor: '#ffedd5',
      iconColor: '#ea580c',
      textColor: '#ea580c',
      borderColor: 'rgba(234, 88, 12, 0.1)'
    },
    Legal: { bgcolor: '#e0f2fe', iconColor: '#1e88e5', textColor: '#1e88e5', borderColor: 'rgba(30, 136, 229, 0.1)' },
    Design: { bgcolor: '#f0fdfa', iconColor: '#0d9488', textColor: '#0d9488', borderColor: 'rgba(13, 148, 136, 0.1)' },
    Sales: { bgcolor: '#fce7f3', iconColor: '#db2777', textColor: '#db2777', borderColor: 'rgba(219, 39, 119, 0.1)' },
    Operations: {
      bgcolor: '#f5f3ff',
      iconColor: '#4f46e5',
      textColor: '#4f46e5',
      borderColor: 'rgba(79, 70, 229, 0.1)'
    }
  }

  const defaultDeptColor = {
    bgcolor: '#dee9ff',
    iconColor: '#2268f2',
    textColor: '#2268f2',
    borderColor: 'hsla(220, 88.90%, 54.10%, 0.10)'
  }

  const searchParams = useSearchParams()
  const stage = searchParams.get('stage')

  useEffect(() => {
    if (stage === '1') {
      setActiveTab(1)
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete('stage')

      const newUrl = `/jobpost?${newParams.toString()}`
      router.replace(newUrl)
    }
  }, [stage])

  const getUserRoleId = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData')
      if (userData) {
        try {
          const parsedData = JSON.parse(userData)
          return parsedData?.roleId || null
        } catch (e) {
          console.error('Error parsing user data:', e)
          return null
        }
      }
    }
    return null
  }

  // Fetch role permissions - runs once on mount
  useEffect(() => {
    const fetchRolePermissions = async () => {
      const roleId = getUserRoleId()

      if (!roleId) {
        setError('No role ID found')
        setPermissionsLoaded(true)
        return
      }

      try {
        const result = await callApi({
          endpoint: `/v1/api/role/detail?roleId=${roleId}`,
          method: 'GET',
          disableSnackbar: true
        })

        if (result.success && result.data.items) {
          const ShowAllData = result.data.items.RecruitmentHiring.jobPostDashboard.canViewAll

          setApiDataPermissions(ShowAllData ? 'all' : 'limited')
        } else {
          setApiDataPermissions('limited')
          console.error('Failed to fetch permissions')
        }
      } catch (err) {
        console.error('Error fetching role permissions:', err)
        setApiDataPermissions('limited')
      } finally {
        setPermissionsLoaded(true)
      }
    }

    fetchRolePermissions()
  }, [])

  const fetchDashboardData = async (period, permissions) => {
    try {
      let endpoint = `/v1/api/jobPost/manDashboard?showAllDashbBoardData=${permissions}`

      if (period === 'custom' && customStartDate && customEndDate) {
        const startDate = format(customStartDate, 'yyyy-MM-dd')
        const endDate = format(customEndDate, 'yyyy-MM-dd')
        endpoint += `&period=${period}&startDate=${startDate}&endDate=${endDate}`
      } else {
        endpoint += `&period=${period}`
      }

      const response = await callApi({
        endpoint,
        disableSnackbar: true
      })

      if (response.success && response.data?.items?.data) {
        setDashboardData(response.data.items.data)
        setError(null)
      } else {
        setError('Failed to load dashboard data')
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    }
  }

  // Fetch dashboard data when permissions are loaded or period changes
  useEffect(() => {
    if (permissionsLoaded && apiDataPermissions !== null) {
      fetchDashboardData(selectedPeriod, apiDataPermissions)
    }
  }, [selectedPeriod, apiDataPermissions, permissionsLoaded, customStartDate, customEndDate])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handlePeriodChange = (period, customStart = null, customEnd = null) => {
    setSelectedPeriod(period)
    if (period === 'custom' && customStart && customEnd) {
      // Custom dates are already set in the parent component
    }
  }

  const handleCustomDateChange = (startDate, endDate) => {
    setCustomStartDate(startDate)
    setCustomEndDate(endDate)
  }

  // Create filter props object to pass to all tabs
  const filterProps = {
    period: selectedPeriod,
    customStartDate,
    customEndDate,
    customDateRange: selectedPeriod === 'custom' ? { customStartDate, customEndDate } : null
  }

  // Show loading while permissions are being fetched or dashboard data is loading
  if (!permissionsLoaded || (loading && !dashboardData)) {
    return (
      <GradientBox>
        <Container maxWidth='xl'>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading dashboard...</Typography>
          </Box>
        </Container>
      </GradientBox>
    )
  }

  // Show error state
  if (error && !dashboardData) {
    return (
      <GradientBox>
        <Container maxWidth='xl'>
          <Alert severity='error' sx={{ mt: 4 }}>
            {error}
            <Button
              onClick={() => fetchDashboardData(selectedPeriod, apiDataPermissions)}
              sx={{ ml: 2 }}
              variant='contained'
              size='small'
            >
              Retry
            </Button>
          </Alert>
        </Container>
      </GradientBox>
    )
  }

  const DashboardContent = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Job Post */}
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title='Total Job Post'
            value={dashboardData?.totalJobs?.count || 0}
            subtitle='All created job listings'
            icon={WorkOffOutlined}
            bgcolor='#e3f2fd'
            iconColor='#1e88e5'
            textColor='#1e88e5'
            sx={{
              borderRadius: '12px',
              border: '1px solid rgba(30, 136, 229, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
              }
            }}
          />
        </Grid>

        {/* Active Jobs */}
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title='Active Jobs'
            value={dashboardData?.totalActiveJobs?.count || 0}
            subtitle='Currently live positions'
            icon={WorkIcon}
            bgcolor='#ecfdf5'
            iconColor='#10b981'
            textColor='#10b981'
            sx={{
              borderRadius: '12px',
              border: '1px solid rgba(109, 40, 217, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
              }
            }}
          />
        </Grid>

        {/* Inactive Jobs */}
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title='Jobs Inactive'
            value={dashboardData?.totalInActiveJobs?.count || 0}
            subtitle='Not currently visible'
            icon={AddCircleOutline}
            bgcolor='#f3e8ff'
            textColor='#6d28d9'
            iconColor='#6d28d9'
            sx={{
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
              }
            }}
          />
        </Grid>

        {/* Pending Jobs */}
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title='Pending Jobs'
            value={dashboardData?.totalJobsPending?.count || 0}
            subtitle='Awaiting approval'
            icon={Cancel}
            bgcolor='#fef2f2'
            iconColor='#ef4444'
            textColor='#ef4444'
            sx={{
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
              }
            }}
          />
        </Grid>

        {/* Nearly Expire */}
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title='Nearly Expire'
            value={dashboardData?.nearingExpiry?.count || 0}
            subtitle='Expiring soon'
            icon={HourglassEmpty}
            bgcolor='#f5f3ff'
            textColor='#4f46e5'
            iconColor='#4f46e5'
            sx={{
              borderRadius: '12px',
              border: '1px solid rgba(79, 70, 229, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
              }
            }}
          />
        </Grid>

        {/* Total Open Positions */}
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title={dashboardData?.totalOpenPositions?.label || 'Total Open Positions'}
            value={dashboardData?.totalOpenPositions?.count || 0}
            subtitle='Currently available seats'
            icon={WorkOutline}
            bgcolor='#f0fdf4'
            textColor='#16a34a'
            iconColor='#16a34a'
            sx={{
              borderRadius: '12px',
              border: '1px solid rgba(22, 163, 74, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
              }
            }}
          />
        </Grid>

        {/* Departments */}
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title={dashboardData?.activeDepartments?.label || 'Departments'}
            value={dashboardData?.activeDepartments?.count || 0}
            subtitle={dashboardData?.activeDepartments?.status || 'Departments with jobs'}
            icon={Business}
            bgcolor='#f0fdfa'
            iconColor='#0d9488'
            textColor='#0d9488'
            sx={{
              borderRadius: '12px',
              border: '1px solid rgba(13, 148, 136, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
              }
            }}
          />
        </Grid>
      </Grid>

      {/* Department Cards */}
      <Box sx={{ mb: 4 }}>
        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 3 }}>
          <Business sx={{ color: '#4b5563' }} />
          <Typography variant='h5' fontWeight='600' color='#1f2937'>
            Department Breakdown
          </Typography>
          <Chip
            label='Live'
            size='small'
            sx={{
              bgcolor: '#e0f2fe',
              color: '#1e88e5',
              border: '1px solid #bbdefb',
              '& .MuiChip-label': {
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#1e88e5',
                  marginRight: 0.5,
                  animation: 'pulse 2s infinite'
                }
              }
            }}
          />
        </Stack>

        <Grid container spacing={3}>
          {dashboardData?.departmentBreakdown?.map(dept => {
            const deptStyle = departmentColors[dept.departmentName] || defaultDeptColor
            return (
              <Grid item xs={12} sm={6} lg={3} key={dept.departmentName}>
                <Card
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    p: 2,
                    backgroundColor: deptStyle.bgcolor,
                    border: `1px solid ${deptStyle.borderColor || 'rgba(0,0,0,0.05)'}`,
                    minHeight: 120,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='body2' sx={{ color: '#6b7280', fontWeight: 500, mb: 1 }}>
                      {dept.departmentName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                      <Box>
                        <Typography
                          variant='h3'
                          sx={{ fontWeight: '700', color: deptStyle.iconColor, mb: 0.5, lineHeight: 1 }}
                        >
                          {dept.positions}
                        </Typography>
                        <Typography variant='body2' sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
                          {dept.jobCount} Jobs
                        </Typography>
                      </Box>
                      <Business sx={{ fontSize: 28, color: deptStyle.iconColor, opacity: 0.9 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Hot Positions */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              bgcolor: 'white',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#FFF3E0', color: '#F57C00' }}>
                  <Star size={20} />
                </Avatar>
                <Typography variant='h5' fontWeight='bold'>
                  Hot Positions
                </Typography>
                <Chip label='Trending' size='small' sx={{ bgcolor: '#FFF3E0', color: '#F57C00' }} />
              </Stack>
              <Stack spacing={2}>
                {dashboardData?.hotVacancies?.map((job, index) => {
                  return (
                    <Paper
                      key={job.position}
                      sx={{
                        p: 2,
                        border: '1px solid #FFE0B2',
                        '&:hover': { borderColor: '#FFB74D' },
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Stack direction='row' alignItems='center' spacing={2}>
                          <Avatar sx={{ bgcolor: '#FFF3E0', color: '#F57C00' }}>
                            <Briefcase size={20} />
                          </Avatar>
                          <Box>
                            <Typography variant='body1' fontWeight='medium'>
                              {job.position}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              {job.department}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant='body1' fontWeight='bold' sx={{ color: '#F57C00' }}>
                            {job.applicants} Applicants
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            Posted {job.daysOld} days ago
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            Open Positions {job.daysOld}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  )
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Cold Positions */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              bgcolor: 'white',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}>
                  <AlertTriangleIcon size={20} />
                </Avatar>
                <Typography variant='h5' fontWeight='bold'>
                  Cold Positions
                </Typography>
                <Chip label='Needs Attention' size='small' sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }} />
              </Stack>
              <Stack spacing={2}>
                {dashboardData?.coldVacancies?.map((job, index) => {
                  return (
                    <Paper
                      key={job.position}
                      sx={{
                        p: 2,
                        border: '1px solid #BBDEFB',
                        '&:hover': { borderColor: '#64B5F6' },
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Stack direction='row' alignItems='center' spacing={2}>
                          <Avatar sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}>
                            <Briefcase size={20} />
                          </Avatar>
                          <Box>
                            <Typography variant='body1' fontWeight='medium'>
                              {job.position}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              {job.department}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant='body1' fontWeight='bold' sx={{ color: '#1976D2' }}>
                            {job.applicants} applicants
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            Posted {job.daysOld} days ago
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            Open Positions {job.daysOld}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  )
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )

  const ReportsContent = () => (
    <Box sx={{ mt: 2 }}>
      <Reporting {...filterProps} />
    </Box>
  )

  const ChartsContent = () => (
    <Box sx={{ mt: 2 }}>
      <Graphs {...filterProps} />
    </Box>
  )

  const BudgetContent = () => (
    <Box sx={{ mt: 2 }}>
      <Budget {...filterProps} />
    </Box>
  )

  return (
    <GradientBox>
      <Container maxWidth='xl'>
        <Box sx={{ mb: 4 }}>
          <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 1 }}>
            <Typography
              variant='h4'
              fontWeight='bold'
              sx={{
                background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              ✨ Job Posting Analytics
            </Typography>

            {/* Enhanced Period Filter */}
            {activeTab == 0 || activeTab == 1 ? (
              <PeriodFilterDropdown
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
                onCustomDateChange={handleCustomDateChange}
              />
            ) : null}
          </Stack>

          <Stack direction='row' alignItems='center' spacing={1}>
            <WorkIcon fontSize='small' color='primary' />
            <Typography variant='body1' color='text.secondary'>
              Monitor and track your job posting performance
            </Typography>
            {selectedPeriod === 'custom' && customStartDate && customEndDate && (
              <Chip
                label={`${format(customStartDate, 'MMM dd')} - ${format(customEndDate, 'MMM dd, yyyy')}`}
                size='small'
                sx={{
                  bgcolor: '#f3e5f5',
                  color: '#7b1fa2',
                  border: '1px solid #ce93d8'
                }}
              />
            )}
            <Chip
              label='Live'
              size='small'
              sx={{
                bgcolor: '#E3F2FD',
                color: '#1976D2',
                border: '1px solid #BBDEFB',
                '& .MuiChip-label': {
                  display: 'flex',
                  alignItems: 'center',
                  '&::before': {
                    content: '""',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#2196F3',
                    marginRight: 0.5,
                    animation: 'pulse 2s infinite'
                  }
                }
              }}
            />
          </Stack>
        </Box>

        {/* Main Navigation Tabs */}
        <TabsContainer>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant='fullWidth'
            TabIndicatorProps={{ style: { display: 'none' } }}
          >
            <StyledTab icon={<Dashboard size={16} />} label='Dashboard' iconPosition='start' />
            <StyledTab icon={<FileTextIcon size={16} />} label='Reports' iconPosition='start' />
            <StyledTab icon={<BarChartIcon size={16} />} label='Charts' iconPosition='start' />
            <StyledTab icon={<CurrencyRupee size={16} />} label='Budget' iconPosition='start' />
          </Tabs>
        </TabsContainer>

        {!dashboardData && !error ? (
          <Alert severity='info'>No dashboard data available.</Alert>
        ) : (
          <>
            <TabPanel value={activeTab} index={0}>
              <DashboardContent />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <ReportsContent />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <ChartsContent />
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <BudgetContent />
            </TabPanel>
          </>
        )}
      </Container>
    </GradientBox>
  )
}
