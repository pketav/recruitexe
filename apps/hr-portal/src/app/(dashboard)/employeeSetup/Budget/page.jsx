'use client'

import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Popover,
  List,
  ListItem,
  Switch,
  Divider,
  Tooltip,
  FormControlLabel,
  Chip,
  Avatar,
  LinearProgress,
  Fade,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  Search,
  AttachMoney,
  Business,
  People,
  Edit,
  FilterList,
  CurrencyRupee,
  ViewColumn,
  GetApp,
  Refresh,
  KeyboardArrowDown,
  KeyboardArrowUp,
  TrendingUp,
  Assessment,
  AccountBalance,
  ExpandMore,
  Analytics,
  PieChart,
  BarChart,
  Timeline,
  Work,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridOverlay
} from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

import SecurityIcon from '@mui/icons-material/Security'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

// Custom loading overlay with modern design
function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.1)', opacity: 0.7 },
              '100%': { transform: 'scale(1)', opacity: 1 }
            }
          }}
        >
          <Analytics sx={{ color: 'white', fontSize: 30 }} />
        </Box>
        <Typography variant='body1' color='text.secondary' fontWeight='medium'>
          Loading budget data...
        </Typography>
      </Box>
    </GridOverlay>
  )
}

const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{ p: 1, gap: 1 }}>
      <GridToolbarColumnsButton startIcon={<ViewColumnIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarFilterButton startIcon={<FilterIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarDensitySelector startIcon={<SettingsIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarExport
        startIcon={<DownloadIcon />}
        sx={{ color: 'primary.main' }}
        csvOptions={{
          disableToolbarButton: false
        }}
        printOptions={{
          disableToolbarButton: true
        }}
      />
    </GridToolbarContainer>
  )
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  fontFamily: '"Inter", "Roboto", sans-serif',
  '& .MuiDataGrid-main': {
    borderRadius: '12px'
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontWeight: 600,
    fontSize: '14px',
    borderBottom: '2px solid #e2e8f0',
    borderRadius: '12px 12px 0 0'
  },
  '& .MuiDataGrid-columnHeader': {
    '&:focus': {
      outline: 'none'
    },
    '&:focus-within': {
      outline: 'none'
    }
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none'
  },
  '& .MuiDataGrid-row': {
    borderBottom: '1px solid #f1f5f9',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8fafc',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    '&.even': {
      backgroundColor: '#ffffff'
    },
    '&.odd': {
      backgroundColor: '#fafbfc'
    }
  },
  '& .MuiDataGrid-cell': {
    borderBottom: 'none',
    fontSize: '14px',
    color: '#334155',
    padding: theme.spacing(1.5),
    '&:focus': {
      outline: 'none'
    },
    '&:focus-within': {
      outline: 'none'
    }
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: '0 0 12px 12px'
  }
}))

// Custom no rows overlay
function CustomNoRowsOverlay() {
  return (
    <Box sx={{ py: 8, width: '100%', textAlign: 'center' }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(33, 150, 243, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2
        }}
      >
        <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />
      </Box>
      <Typography variant='h6' gutterBottom color='text.secondary'>
        No budget records found
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 400, mx: 'auto' }}>
        Try adjusting your filters or check back later for updated budget information.
      </Typography>
    </Box>
  )
}

export default function BudgetDashboard() {
  const theme = useTheme()
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter()

  // States for filters
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [selectedSubDepartments, setSelectedSubDepartments] = useState([])
  const [selectedDesignations, setSelectedDesignations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Favorite filters
  const [favoriteFilters, setFavoriteFilters] = useState([])
  const [saveFilterDialog, setSaveFilterDialog] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [updatedRowId, setUpdatedRowId] = useState(null)

  // Column visibility
  const [columnVisibility, setColumnVisibility] = useState({
    department: true,
    subDepartment: true,
    designation: true,
    employeeCount: true,
    perEmployeeLPA: true,
    allocatedBudget: true,
    action: true
  })
  const [columnAnchorEl, setColumnAnchorEl] = useState(null)

  // States for budget data
  const [budgetData, setBudgetData] = useState({
    totalEmployees: 0,
    totalAllocatedBudget: 0,
    totalDepartments: 0,
    averageAllocatedBudget: 0,
    records: []
  })

  // UI states
  const [loading, setLoading] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editData, setEditData] = useState({
    id: '',
    allocatedBudget: 0,
    numberOfEmployees: 0,
    departmentName: '',
    subDepartmentName: '',
    desingationName: ''
  })
  const [originalData, setOriginalData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const [showTable, setShowTable] = useState(true)
  const [subDepartments, setSubDepartments] = useState([])
  const [showFilters, setShowFilters] = useState(true)
  const [showAdvancedStats, setShowAdvancedStats] = useState(false)
  const [expanded, setExpanded] = useState(true);

  // API functions (keeping the same logic but with error handling)
  const getDepartments = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${baseUrl}/v1/api/newdepartment/dropDown`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      if (res.data.status && res.data.items) {
        setDepartments(res.data.items)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Failed to fetch departments'
      })
    }
  }

  const getDesignations = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${baseUrl}/v1/api/designation/getAll`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      if (res.data.status && res.data.items) {
        setDesignations(res.data.items)
      }
    } catch (error) {
      console.error('Error fetching designations:', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Failed to fetch designations'
      })
    }
  }

  const getBudgetData = async () => {
    if (!token) return
    try {
      setLoading(true)
      const subDepartmentIds = selectedSubDepartments.length > 0 ? selectedSubDepartments.join(',') : ''
      const designationIds = selectedDesignations.length > 0 ? selectedDesignations.join(',') : ''

      let url = `${baseUrl}/v1/api/Budged/budgetDashboard?search=${debouncedSearchTerm}`
      if (subDepartmentIds) url += `&departmentId=${subDepartmentIds}`
      if (designationIds) url += `&desingationId=${designationIds}`
      if (startDate) url += `&startDate=${startDate}`
      if (endDate) url += `&endDate=${endDate}`

      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      if (res.data.status && res.data.items && res.data.items.data) {
        setBudgetData(res.data.items.data)
      } else {
        setBudgetData({
          totalEmployees: 0,
          totalAllocatedBudget: 0,
          totalDepartments: 0,
          averageAllocatedBudget: 0,
          records: []
        })
      }
    } catch (error) {
      console.error('Error fetching budget data:', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Failed to fetch budget data'
      })
    } finally {
      setLoading(false)
    }
  }

  // Event handlers
  const handleDepartmentChange = event => {
    const value = event.target.value
    setSelectedDepartments(value)
    setSelectedSubDepartments([])
    getSubDepartments(value, true)
  }

  const handleSubDepartmentChange = event => {
    setSelectedSubDepartments(event.target.value)
  }

  const handleDesignationChange = event => {
    setSelectedDesignations(event.target.value)
  }

  const handleSearchChange = event => {
    setSearchTerm(event.target.value)
  }

  const isChanged = originalData && JSON.stringify(editData) !== JSON.stringify(originalData);

  const handleEditClick = record => {
    setEditData({
      id: record._id,
      allocatedBudget: record.allocatedBudget,
      numberOfEmployees: record.numberOfEmployees,
      remainingBudget : record.remainingBudget,
      departmentName: record.departmentName,
      subDepartmentName: record.subDepartmentName,
      desingationName: record.desingationName
    })
    setOriginalData({
      id: record._id,
      allocatedBudget: record.allocatedBudget,
      numberOfEmployees: record.numberOfEmployees,
      departmentName: record.departmentName,
      subDepartmentName: record.subDepartmentName,
      desingationName: record.desingationName
    }); 
    setEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
  }

  const handleEditInputChange = e => {
    const { name, value } = e.target
    let processedValue = value
    if (name === 'numberOfEmployees') {
      processedValue = Math.floor(Math.max(0, Number.parseInt(value) || 0))
    }
    setEditData(prev => ({ ...prev, [name]: processedValue }))
  }

  const handleUpdateBudget = async () => {
    if (editData.numberOfEmployees < 0 || editData.allocatedBudget < 0) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Number of employees and budget cannot be negative'
      })
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(
        `${baseUrl}/v1/api/Budged/updateDepartmentBudget/${editData.id}`,
        {
          allocatedBudget: Number(editData.allocatedBudget),
          numberOfEmployees: Number(editData.numberOfEmployees)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )

      if (res.data.status) {
        setSnackbar({
          open: true,
          severity: 'success',
          message: 'Budget updated successfully'
        })
        setEditDialogOpen(false)
        setUpdatedRowId(editData.id)
        getBudgetData()
      } else {
        setSnackbar({
          open: true,
          severity: 'error',
          message: res.data.message || 'Failed to update budget'
        })
      }
    } catch (error) {
      console.error('Error updating budget:', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: error.response?.data?.message || 'Error updating budget'
      })
    } finally {
      setLoading(false)
    }
  }

  const getSubDepartments = async (departmentIds, autoSelectAll = false) => {
    if (!token || departmentIds.length === 0) {
      setSubDepartments([])
      return
    }

    try {
      let allSubDepartments = []
      for (const deptId of departmentIds) {
        const res = await axios.get(`${baseUrl}/v1/api/newdepartment/sub/${deptId}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        })
        if (res.data.status && res.data.items) {
          const activeSubDepts = res.data.items.filter(item => item.isActive === true)
          allSubDepartments = [...allSubDepartments, ...activeSubDepts]
        }
      }
      setSubDepartments(allSubDepartments)
      if (autoSelectAll && allSubDepartments.length > 0) {
        setSelectedSubDepartments(allSubDepartments.map(subDept => subDept._id))
      }
    } catch (error) {
      console.error('Error fetching subdepartments:', error)
      setSubDepartments([])
    }
  }

  // Utility functions
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatNumber = number => {
    if (number === null || number === undefined || isNaN(number)) return '0'
    const num = Number.parseFloat(number)
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num)
  }

  const clearAllFilters = () => {
    setSelectedDepartments([])
    setSelectedSubDepartments([])
    setSelectedDesignations([])
    setSearchTerm('')
    setStartDate('')
    setEndDate('')
    setSubDepartments([])
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    clearAllFilters()
    setTimeout(() => {
      getBudgetData()
      setRefreshing(false)
    }, 300)
  }

  const handleColumnToggle = columnKey => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }))
  }

  const exportToCSV = () => {
    const headers = 'Department,Sub Department,Designation,Employee Count,Per Employee LPA,Allocated Budget'
    const csvData = budgetData.records
      .map(record => {
        return [
          record.departmentName || '',
          record.subDepartmentName || '',
          record.desingationName || '',
          formatNumber(record.numberOfEmployees || 0),
          `${(record.perEmployeeLPA || 0).toFixed(2)} LPA`,
          formatNumber(record.allocatedBudget || 0)
        ]
          .map(value => `"${value}"`)
          .join(',')
      })
      .join('\n')

    const csv = `${headers}\n${csvData}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `budget-dashboard-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    setSnackbar({
      open: true,
      severity: 'success',
      message: 'Data exported successfully'
    })
  }

  // DataGrid columns
  const columns = [
    {
      field: 'serial',
      headerName: 'Sr. No.',
      width: 80,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const rowIndex = params.api
          ?.getSortedRowIds?.()
          ?.indexOf(params.id);
    
        return (
          <Typography variant="body2" fontWeight="medium">
            {rowIndex > -1 ? rowIndex + 1 : '-'}
          </Typography>
        );
      }
    },    
    {
      field: 'departmentName',
      headerName: 'Department',
      width: 180,
      hide: !columnVisibility.department,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: '#f0f9ff', color: '#0369a1' }}>
            <Business fontSize='small' />
          </Avatar>
          <Typography variant='body2' fontWeight='medium'>
            {params.value || '-'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'subDepartmentName',
      headerName: 'Sub Department',
      width: 200,
      hide: !columnVisibility.subDepartment,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: '#f0f9ff', color: '#0369a1' }}>
            <Business fontSize='small' />
          </Avatar>
          <Typography variant='body2' fontWeight='medium'>
            {params.value || '-'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'desingationName',
      headerName: 'Designation',
      width: 270,
      hide: !columnVisibility.designation,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: '#e0e7ff', color: '#3730a3' }}>
            <Work fontSize='small' />
          </Avatar>
          <Chip
            label={params.value || '-'}
            size='small'
            variant='outlined'
            sx={{ borderRadius: 2, fontWeight: 'medium' }}
          />
        </Box>
      )
    },
    {
      field: 'allocatedBudget',
      headerName: 'Allocated Budget',
      width: 180,
      hide: !columnVisibility.allocatedBudget,
      renderCell: params => {
        const formattedValue = new Intl.NumberFormat('en-IN').format(params.value || 0);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
            <CurrencyRupee fontSize='small' color='primary' />
            <Typography variant='body2' fontWeight='bold' color='primary.main'>
              {formattedValue}
            </Typography>
          </Box>
        );
      }
    },    
    {
      field: 'numberOfEmployees',
      headerName: 'Employee Count',
      width: 130,
      hide: !columnVisibility.employeeCount,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1 }}>
          <People fontSize='small' color='action' />
          <Typography variant='body2' fontWeight='medium'>
            {formatNumber(params.value || 0)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'perEmployeeLPA',
      headerName: 'Per Employee',
      width: 150,
      hide: !columnVisibility.perEmployeeLPA,
      renderCell: params => {
        const formattedValue = new Intl.NumberFormat('en-IN').format(params.value || 0);
        return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <CurrencyRupee fontSize='small' color='success' />
          <Typography variant='body2' fontWeight='bold' color='success.main'>
            {formattedValue || 0}
          </Typography>
        </Box>
        )
      }
    },
    {
      field: 'jobPostForNumberOfEmployees',
      headerName: 'Allocated on Employees',
      width: 180,
      hide: !columnVisibility.jobPostForNumberOfEmployees,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
            <People fontSize='small' color='action' />
          <Typography variant='body2' fontWeight='bold' color='primary.main'>
            {params.value || 0}
          </Typography>
        </Box>
      )
    },
    {
      field: 'usedBudget',
      headerName: 'Budget Used',
      width: 180,
      hide: !columnVisibility.usedBudget,
      renderCell: params => {
        const formattedValue = new Intl.NumberFormat('en-IN').format(params.value || 0);
        return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <CurrencyRupee fontSize='small' color='primary' />
          <Typography variant='body2' fontWeight='bold' color='primary.main'>
            {formattedValue || 0}
          </Typography>
        </Box>)
      }
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      hide: !columnVisibility.action,
      renderCell: params => (
        <Tooltip title='Edit Budget'>
          <IconButton
            color='primary'
            size='small'
            onClick={() => handleEditClick(params.row)}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s'
            }}
          >
            <Edit fontSize='small' />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  // Effects
  useEffect(() => {
    if (token) {
      getDepartments()
      getDesignations()
    }
  }, [token])

  useEffect(() => {
    if (token) {
      getBudgetData()
    }
  }, [selectedSubDepartments, selectedDesignations, debouncedSearchTerm, startDate, endDate, token])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (updatedRowId) {
      const timer = setTimeout(() => {
        setUpdatedRowId(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [updatedRowId])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Container maxWidth='xl' sx={{ py: 3 }}>
        {/* Header Section */}

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
                <AccountBalanceWalletIcon sx={{ fontSize: 30, color: 'white' }} />
              </Box>
              <Box>
                <Typography fontSize={19} color='white' fontWeight='bold' gutterBottom mt={1}>
                  Hiring Budget Dashboard
                </Typography>
                {/* <Typography fontSize={15} color='white' sx={{ opacity: 0.9, my: -1.5 }}>
                  Comprehensive budget tracking and management system
                </Typography> */}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
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

        {/* Advanced Filters */}
        <Card sx={{ mb: 3, borderRadius: 1.5, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 0 }}>
            {/* <Box
              sx={{
                p: 2,
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                borderRadius:1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#efa2f5" }}>
                  <FilterList />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Smart Filters
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Refine your budget analysis
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title="Refresh Data">
                  <IconButton
                    onClick={handleRefresh}
                    disabled={refreshing}
                    sx={{
                      bgcolor: refreshing ? "action.disabled" : "#78c1f5",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    <Refresh
                      sx={{
                        animation: refreshing ? "spin 1s linear infinite" : "none",
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box> */}
                    {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(76, 175, 80, 0.2)'
                }
              }}
            >
              <Box sx={{ height: 4, bgcolor: '#4CAF50' }} />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha('#4CAF50', 0.1),
                      color: '#4CAF50',
                      width: 42,
                      height: 42
                    }}
                  >
                    <CurrencyRupee sx={{ fontSize: 28 }} />
                  </Avatar>

                  <Typography variant='h5' fontWeight='bold' color='text.primary' gutterBottom mt={2.5}>
                    {formatCurrency(budgetData.totalAllocatedBudget || 0)}
                  </Typography>
                </Box>
                <Typography variant='body2' color='text.secondary' fontWeight='medium'>
                  Total Allocated Budget
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(33, 150, 243, 0.2)'
                }
              }}
            >
              <Box sx={{ height: 4, bgcolor: '#2196F3' }} />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha('#2196F3', 0.1),
                      color: '#2196F3',
                      width: 42,
                      height: 42
                    }}
                  >
                    <Business sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography variant='h5' fontWeight='bold' color='text.primary' gutterBottom mt={2.5}>
                    {budgetData.totalDepartments || 0}
                  </Typography>
                </Box>
                <Typography variant='body2' color='text.secondary' fontWeight='medium'>
                  Live Departments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(255, 152, 0, 0.2)'
                }
              }}
            >
              <Box sx={{ height: 4, bgcolor: '#FF9800' }} />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha('#FF9800', 0.1),
                      color: '#FF9800',
                      width: 42,
                      height: 42
                    }}
                  >
                    <People sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography variant='h5' fontWeight='bold' color='text.primary' gutterBottom mt={2.5}>
                    {budgetData.totalEmployees || 0}
                  </Typography>
                </Box>

                <Typography variant='body2' color='text.secondary' fontWeight='medium'>
                  Hiring Targets Employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(156, 39, 176, 0.2)'
                }
              }}
            >
              <Box sx={{ height: 4, bgcolor: '#9C27B0' }} />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha('#9C27B0', 0.1),
                      color: '#9C27B0',
                      width: 42,
                      height: 42
                    }}
                  >
                    <Timeline sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography variant='h5' fontWeight='bold' color='text.primary' gutterBottom mt={2.5}>
                    {formatCurrency(budgetData.totalUsedBudget|| 0)}
                  </Typography>
                </Box>

                <Typography variant='body2' color='text.secondary' fontWeight='medium'>
                  Used Budget
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

            <Fade in={showFilters}>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Typography variant='subtitle2' color='text.secondary' gutterBottom fontWeight='medium'>
                      Search
                    </Typography>
                    <TextField
                      fullWidth
                      size='small'
                      placeholder='Search departments, designations...'
                      value={searchTerm}
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Search color='action' />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          bgcolor: 'background.paper'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant='subtitle2' color='text.secondary' gutterBottom fontWeight='medium'>
                      Departments
                    </Typography>
                    <FormControl fullWidth size='small'>
                      <Select
                        value={selectedDepartments}
                        multiple
                        onChange={handleDepartmentChange}
                        displayEmpty
                        renderValue={selected => {
                          if (selected.length === 0) return 'All Departments'
                          if (selected.length === 1) {
                            const dept = departments.find(d => d._id === selected[0])
                            return dept ? dept.name : 'Department'
                          }
                          return `${selected.length} departments selected`
                        }}
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: 'background.paper'
                        }}
                      >
                        {departments.map(dept => (
                          <MenuItem key={dept._id} value={dept._id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 20, height: 20, fontSize: '0.7rem' }}>{dept.name?.charAt(0)}</Avatar>
                              {dept.name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant='subtitle2' color='text.secondary' gutterBottom fontWeight='medium'>
                      Sub Departments
                    </Typography>
                    <FormControl fullWidth size='small'>
                      <Select
                        value={selectedSubDepartments}
                        multiple
                        onChange={handleSubDepartmentChange}
                        displayEmpty
                        disabled={selectedDepartments.length === 0}
                        renderValue={selected => {
                          if (selected.length === 0) return 'All Sub Departments'
                          if (selected.length === 1) {
                            const subDept = subDepartments.find(sd => sd._id === selected[0])
                            return subDept ? subDept.name : 'Sub Department'
                          }
                          return `${selected.length} sub departments selected`
                        }}
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: 'background.paper'
                        }}
                      >
                        {subDepartments.map(subDept => (
                          <MenuItem key={subDept._id} value={subDept._id}>
                            {subDept.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant='subtitle2' color='text.secondary' gutterBottom fontWeight='medium'>
                      Designations
                    </Typography>
                    <FormControl fullWidth size='small'>
                      <Select
                        value={selectedDesignations}
                        multiple
                        onChange={handleDesignationChange}
                        displayEmpty
                        renderValue={selected => {
                          if (selected.length === 0) return 'All Designations'
                          if (selected.length === 1) {
                            const desig = designations.find(d => d._id === selected[0])
                            return desig ? desig.name : 'Designation'
                          }
                          return `${selected.length} designations selected`
                        }}
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: 'background.paper'
                        }}
                      >
                        {designations.map(desig => (
                          <MenuItem key={desig._id} value={desig._id}>
                            <Chip label={desig.name} size='small' variant='outlined' />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          </CardContent>
        </Card>


        {/* Data Table */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box
            sx={{
              p: 3,
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Assessment />
              </Avatar>
              <Box>
                <Typography variant='h6' fontWeight='bold'>
                  Budget Setup
                </Typography>
                {/* <Typography variant='body2' sx={{ opacity: 0.9 }}>
                  Detailed budget breakdown by department
                </Typography> */}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title='Column Visibility'>
                <IconButton
                  onClick={e => setColumnAnchorEl(e.currentTarget)}
                  sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
                >
                  <ViewColumn />
                </IconButton>
              </Tooltip>
              <Tooltip title='Export Data'>
                <IconButton onClick={exportToCSV} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                  <GetApp />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ height: 600 }}>
            <StyledDataGrid
              rows={budgetData.records || []}
              columns={columns}
              getRowId={row => row._id}
              loading={loading}
              components={{
                LoadingOverlay: CustomLoadingOverlay,
                NoRowsOverlay: CustomNoRowsOverlay
              }}
              slots={{
                toolbar: CustomToolbar
              }}
              getRowClassName={params =>
                updatedRowId === params.row._id
                  ? 'row-updated'
                  : params.indexRelativeToCurrentPage % 2 === 0
                    ? 'row-even'
                    : 'row-odd'
              }
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  fontWeight: 600
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  borderRight: 'none'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  color: '#fff'
                },
                '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
                  color: '#fff'
                },
                '& .MuiDataGrid-columnSeparator': {
                  display: 'none'
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
        </Card>

        {/* Column Visibility Popover */}
        <Popover
          open={Boolean(columnAnchorEl)}
          anchorEl={columnAnchorEl}
          onClose={() => setColumnAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          PaperProps={{
            sx: {
              borderRadius: 1.5,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              mt: 1
            }
          }}
        >
          <Box sx={{ p: 3, width: 280 }}>
            <Typography variant='h6' fontWeight='bold' gutterBottom>
              Column Visibility
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              {Object.entries(columnVisibility).map(([key, visible]) => (
                <ListItem key={key} sx={{ px: 0 }}>
                  <FormControlLabel
                    control={
                      <Switch checked={visible} onChange={() => handleColumnToggle(key)} size='small' color='primary' />
                    }
                    label={
                      <Typography variant='body2' fontWeight='medium'>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </Typography>
                    }
                    sx={{ width: '100%', margin: 0 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Popover>

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          maxWidth='md'
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
            }
          }}
        >
          <DialogTitle
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <Edit />
            </Avatar>
            <Box>
              <Typography variant='h6' fontWeight='bold'>
                Update Budget Details
              </Typography>
              <Typography variant='body2' sx={{ opacity: 0.9 }}>
                Modify budget allocation and employee count
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
          <Accordion
              expanded={expanded}
              onChange={() => setExpanded(prev => !prev)}
              sx={{ mb: 3, boxShadow: 'none', border: '1px solid #e0e0e0' }}
            >
           <AccordionSummary
              expandIcon={
                <ExpandMore
                  sx={{
                    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                />
              }
              sx={{ bgcolor: alpha('#f5f5f5', 0.5) }}
            >

                <Typography variant='subtitle1' fontWeight='bold'>
                  Department Information
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant='body2' color='text.secondary' gutterBottom>
                      Department
                    </Typography>
                    <Chip label={editData.departmentName || '-'} variant='outlined' sx={{ fontWeight: 'medium' }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant='body2' color='text.secondary' gutterBottom>
                      Sub Department
                    </Typography>
                    <Chip label={editData.subDepartmentName || '-'} variant='outlined' sx={{ fontWeight: 'medium' }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant='body2' color='text.secondary' gutterBottom>
                      Designation
                    </Typography>
                    <Chip label={editData.desingationName || '-'} variant='outlined' sx={{ fontWeight: 'medium' }} />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Typography variant='h6' fontWeight='bold' gutterBottom color='primary'>
              Update Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' color='text.secondary' gutterBottom fontWeight='medium'>
                  Number of Employees
                </Typography>
                <TextField
                  fullWidth
                  name='numberOfEmployees'
                  type='number'
                  value={editData.numberOfEmployees}
                  onChange={handleEditInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <People color='primary' />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, step: 1 }
                  }}
                  error={editData.numberOfEmployees < 0}
                  helperText={editData.numberOfEmployees < 0 ? 'Value cannot be negative' : ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' color='text.secondary' gutterBottom fontWeight='medium'>
                  Allocated Budget (₹)
                </Typography>
                <TextField
                  fullWidth
                  name='allocatedBudget'
                  type='number'
                  value={editData.allocatedBudget}
                  onChange={handleEditInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CurrencyRupee color='primary' />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, step: 1000 }
                  }}
                  error={editData.allocatedBudget < 0}
                  helperText={editData.allocatedBudget < 0 ? 'Value cannot be negative' : ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={handleEditDialogClose}
              variant='outlined'
              sx={{
                borderRadius: 1.5,
                px: 3,
                borderColor: alpha('#9e9e9e', 0.5),
                '&:hover': {
                  borderColor: '#9e9e9e',
                  bgcolor: alpha('#9e9e9e', 0.05)
                }
              }}
            >
              Cancel
            </Button>
            <Button
                onClick={handleUpdateBudget}
                variant='contained'
                disabled={!isChanged || loading || editData.numberOfEmployees < 0 || editData.allocatedBudget < 0}
                sx={{
                  borderRadius: 1.5,
                  px: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                  }
                }}
              >
                {loading ? 'Updating...' : 'Update Budget'}
              </Button>

          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              borderRadius: 1.5,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }}
            variant='filled'
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}
