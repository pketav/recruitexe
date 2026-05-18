'use client'

import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import {
  InfoOutlined as InfoOutlinedIcon,
  Business as BusinessIcon,
  AccountTree as DepartmentIcon,
  WorkOutline as DesignationIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Delete as DeleteIcon,
  AutoAwesome as AIIcon,
  GroupWork as BulkIcon,
  CheckCircle as StatusIcon,
  Close as CloseIcon,
  Delete
} from '@mui/icons-material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import WorkIcon from '@mui/icons-material/Work'

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

// Empty state components
const NoRowsOverlay = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 4,
        color: '#666'
      }}
    >
      <DesignationIcon sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
      <Typography variant='h6' gutterBottom>
        No Designations Found
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        There are currently no designations to display. Create your first designation to get started.
      </Typography>
    </Box>
  )
}

const EmptyDepartmentsState = ({ message = 'No departments available' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      color: '#666'
    }}
  >
    <BusinessIcon sx={{ fontSize: 40, mb: 2, color: '#ccc' }} />
    <Typography variant='body1' gutterBottom>
      {message}
    </Typography>
    <Typography variant='body2' color='text.secondary'>
      Please ensure departments are created first.
    </Typography>
  </Box>
)

export default function Designation() {
  // Safe token initialization
  const [token, setToken] = useState('')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const [designations, setDesignations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // Initialize token on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authToken = window.localStorage.getItem('authToken')
      setToken(authToken || '')
    }
  }, [])

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // States for bulk designation with safe initialization
  const [openBulkDesignation, setBulkDesignationOpen] = useState(false)
  const [depts, setDepts] = useState([])
  const [subDepts, setSubDepts] = useState([])
  const [aiDesignations, setAiDesignations] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [newDesignation, setNewDesignation] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedSubDepartment, setSelectedSubDept] = useState('')

  const getDesignations = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${baseUrl}/v1/api/designation/getAll`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      if (res.data && res.data.items && Array.isArray(res.data.items)) {
        const formatted = res.data.items.map((item, index) => ({
          id: item?._id || `designation-${index}`,
          name: item?.name || 'Unknown Designation',
          createdAt: item?.createdAt || null,
          departmentId: item?.departmentId?._id || null,
          departmentName: item?.departmentId?.name?.toUpperCase() || 'Unknown Department',
          isActive: Boolean(item?.isActive),
          subDepartment: item?.subDepartment?.name || 'No Sub Department',
          subDepartmentId: item?.subDepartmentId || null
        }))

        setDesignations(formatted)
        setTotalItems(formatted.length)
      } else {
        setDesignations([])
        setTotalItems(0)
        // setError("No designations data available")
      }
    } catch (error) {
      console.error('Error fetching designations:', error)
      setDesignations([])
      setTotalItems(0)
      setError('Failed to load designations')
      setSnackbar({
        open: true,
        message: 'Error fetching designations',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const getDepartment = async () => {
    if (!token) return

    try {
      const res = await axios.get(`${baseUrl}/v1/api/newdepartment/newdeparment`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      if (res.data && res.data.items && Array.isArray(res.data.items)) {
        setDepts(res.data.items)
      } else {
        setDepts([])
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      setDepts([])
      setSnackbar({
        open: true,
        message: 'Error fetching departments',
        severity: 'error'
      })
    }
  }

  const getSubDepartment = async id => {
    if (!token || !id) {
      setSubDepts([])
      return
    }

    try {
      const res = await axios.get(`${baseUrl}/v1/api/newdepartment/sub/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      if (res.data && res.data.items && Array.isArray(res.data.items)) {
        setSubDepts(res.data.items)
      } else {
        setSubDepts([])
      }
    } catch (error) {
      console.error('Error fetching sub-departments:', error)
      setSubDepts([])
      setSnackbar({
        open: true,
        message: 'Error fetching sub-departments',
        severity: 'error'
      })
    }
  }

  useEffect(() => {
    if (token) {
      getDesignations()
      getDepartment()
    }
  }, [token])

  useEffect(() => {
    if (selectedDepartment) {
      getSubDepartment(selectedDepartment)
    } else {
      setSubDepts([])
    }
  }, [selectedDepartment])

  const handleActivity = async (id, isChecked) => {
    if (!token || !id) return

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/designation/update`,
        {
          Id: id,
          isActive: isChecked
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data && res.data.status) {
        setSnackbar({
          open: true,
          severity: 'success',
          message: 'Status updated successfully'
        })
        getDesignations()
      } else {
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'Failed to update status'
        })
      }
    } catch (error) {
      console.error('Error updating status:', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error updating status'
      })
    }
  }

  const handleDelete = async id => {
    if (!token || !id) return

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/designation/deleteDesignations`,
        {
          designationIds: [id]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )

      if (res.data && res.data.message) {
        const notDeleted = res.data.message.notDeleted || []
        if (notDeleted.length === 0) {
          setSnackbar({
            open: true,
            severity: 'success',
            message: res.data.message.message || 'Designation deleted successfully'
          })
        } else {
          setSnackbar({
            open: true,
            severity: 'error',
            message: notDeleted[0]?.reason || 'Failed to delete designation'
          })
        }
      }
      getDesignations()
    } catch (error) {
      console.error('Error deleting designation:', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error deleting designation'
      })
    }
  }

  const [editData, setEditData] = useState({})
  const [addDesignation, setAddDesignation] = useState(false)
  const [editDesignation, setEditDesignation] = useState(false)
  const [designName, setDesignName] = useState({ departmentId: '', name: '', subDepartmentId: '' })
  const [useAi, setUseAi] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [aiLoading2, setAiloading2] = useState(false)

  const handleEdit = row => {
    if (!row) return

    setEditData({
      Id: row.id || '',
      departmentId: row.departmentId || '',
      name: row.name || '',
      subDepartmentId: row.subDepartmentId || ''
    })
    setEditDesignation(true)
  }

  const handleUseAI = async () => {
    if (!token || !selectedDepartment) return

    setAiLoading(true)
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/designation/generateDesignationFromAI`,
        {
          departmentId: selectedDepartment,
          subDepartmentId: selectedSubDepartment || null
        },
        {
          headers: {
            authorization: token
          }
        }
      )

      if (res.data.status) {
        setAiDesignations(res.data.items.designations)
        setSnackbar({
          open: true,
          message: 'AI suggestions loaded successfully',
          severity: 'success'
        })
      } else {
        setAiDesignations([])
        setSnackbar({
          open: true,
          message: res.data.message,
          severity: 'warning'
        })
      }
    } catch (error) {
      console.error('AI fetch failed', error)
      setAiDesignations([])
      setSnackbar({
        message: 'Failed to load AI suggestions',
        severity: 'error',
        open: true
      })
    } finally {
      setAiLoading(false)
    }
  }

  const handleAddCustomDesignation = () => {
    if (!newDesignation.trim()) return

    const newDesignationObj = { name: newDesignation.trim() }
    setAiDesignations(prev => [...prev, newDesignationObj])
    setNewDesignation('')
  }

  const handleRemoveDesignation = index => {
    if (index < 0 || index >= aiDesignations.length) return

    const updated = [...aiDesignations]
    updated.splice(index, 1)
    setAiDesignations(updated)
  }

  const handleBulkDesignation = async () => {
    if (!token || !selectedDepartment || !Array.isArray(aiDesignations) || aiDesignations.length === 0) return

    try {
      const response = await axios.post(
        `${baseUrl}/v1/api/designation/createBulkDesignations`,
        {
          departmentId: selectedDepartment,
          designations: aiDesignations,
          subDepartmentId: selectedSubDepartment || null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )

      if (response.data && response.data.status) {
        setSnackbar({
          open: true,
          message: response.data.message || 'Bulk designations created successfully',
          severity: 'success'
        })
        getDesignations()
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to create bulk designations',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to add bulk designations', error)
      setSnackbar({
        message: 'Failed to add bulk designations',
        severity: 'error',
        open: true
      })
    } finally {
      setBulkDesignationOpen(false)
      setAiDesignations([])
      setNewDesignation('')
      setSelectedDepartment('')
      setSelectedSubDept('')
    }
  }

  const fetchAiSuggestions = async () => {
    if (!token || !designName.departmentId) return

    setAiloading2(true)
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/designation/generateDesignationFromAI`,
        {
          departmentId: designName.departmentId,
          subDepartmentId: designName.subDepartmentId || null
        },
        {
          headers: {
            authorization: token
          }
        }
      )

      if (res.data && res.data.items && Array.isArray(res.data.items.designations)) {
        setAiSuggestions(res.data.items.designations)
        setUseAi(true)
        setSnackbar({
          open: true,
          message: res.data.message || 'AI suggestions generated successfully',
          severity: 'success'
        })
      } else {
        setAiSuggestions([])
        setSnackbar({
          open: true,
          severity: 'warning',
          message: 'No AI suggestions available'
        })
      }
    } catch (error) {
      console.error('AI fetch failed', error)
      setAiSuggestions([])
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Failed to generate AI suggestions'
      })
    } finally {
      setAiloading2(false)
    }
  }

  const handleSubmit = async () => {
    if (!token || !designName.name.trim() || !designName.departmentId) return

    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/designation/add`,
        {
          name: designName.name.trim(),
          departmentId: designName.departmentId,
          subDepartmentId: designName.subDepartmentId || null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )

      if (res.data && res.data.status) {
        setSnackbar({
          open: true,
          severity: 'success',
          message: res.data.message || 'Designation added successfully'
        })
        getDesignations()
        setAddDesignation(false)
        setDesignName({ departmentId: '', name: '', subDepartmentId: '' })
      } else {
        setSnackbar({
          open: true,
          severity: 'error',
          message: res.data.message || 'Failed to add designation'
        })
      }
    } catch (error) {
      console.error('Error adding designation:', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error adding designation'
      })
    }
  }

  const handleSubmitEdit = async () => {
    if (!token || !editData.Id || !editData.name.trim()) return

    try {
      const res = await axios.post(`${baseUrl}/v1/api/designation/update`, editData, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      if (res.data && res.data.status) {
        setSnackbar({
          open: true,
          message: res.data.message || 'Designation updated successfully',
          severity: 'success'
        })
        getDesignations()
        setEditDesignation(false)
        setEditData({})
      } else {
        setSnackbar({
          open: true,
          severity: 'error',
          message: res.data.message || 'Failed to update designation'
        })
      }
    } catch (error) {
      console.error('Error updating designation:', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error updating designation'
      })
    }
  }

  useEffect(() => {
    if (designName.departmentId) {
      getSubDepartment(designName.departmentId)
    }
  }, [designName.departmentId])

  const columns = [
    {
      field: 'departmentName',
      headerName: 'Department',
      flex: 1.2,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Department where this designation belongs'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <BusinessIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Department
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => (
        <Tooltip title={`Department: ${params.value || 'Unknown'}`} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
            <BusinessIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography
              variant='body2'
              fontWeight={500}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {params.value || 'Unknown'}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'subDepartment',
      headerName: 'Sub-Department',
      flex: 1.5,
      minWidth: 140,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Sub-department under which this designation falls'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <DepartmentIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Sub-Department
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => (
        <Tooltip title={`Sub-Department: ${params.value || 'None'}`} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
            <DepartmentIcon sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography
              variant='body2'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {params.value || 'None'}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'name',
      headerName: 'Designation',
      flex: 1.8,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => (
        <Tooltip title='Job title or position designation'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <DesignationIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Designation
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => (
        <Tooltip title={`Designation: ${params.value || 'Unknown'}`} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
            <DesignationIcon sx={{ fontSize: 16, color: 'info.main' }} />
            <Typography
              variant='body2'
              fontWeight={500}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {params.value || 'Unknown'}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 110,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Date when the designation was created'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <CalendarIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Created Date
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => {
        const dateStr = params.row?.createdAt
        if (!dateStr) {
          return (
            <Tooltip title='Created Date: Not available' placement='top'>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant='body2'>-</Typography>
              </Box>
            </Tooltip>
          )
        }

        const date = new Date(dateStr)
        const formattedDate = isNaN(date.getTime())
          ? "-"
          : date.toLocaleString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })

        return (
          <Tooltip title={`Created Date: ${formattedDate}`} placement='top'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant='body2'>{formattedDate}</Typography>
            </Box>
          </Tooltip>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Current status of the designation'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <StatusIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Status
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => {
        const isActive = Boolean(params.row.isActive)
        const statusColor = isActive ? 'success' : 'error'
        const statusLabel = isActive ? 'Active' : 'Inactive'

        return (
          <Tooltip title={`Current Status: ${statusLabel}`} placement='top'>
            <Chip
              label={statusLabel}
              color={statusColor}
              sx={{
                borderRadius: '20px',
                fontSize: '0.75rem',
                height: 28,
                minWidth: 70,
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </Tooltip>
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 90,
      headerAlign: 'center',
      renderHeader: () => (
        <Tooltip title='Available actions for this designation'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <SettingsIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Actions
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => {
        const isActive = Boolean(params.row.isActive)

        return (
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <Tooltip title={isActive ? 'Deactivate this designation' : 'Activate this designation'} placement='top'>
              <Button
                variant='contained'
                size='small'
                sx={{
                  minWidth: 'auto',
                  width: 32,
                  height: 32,
                  p: 0,
                  background: isActive
                    ? 'linear-gradient(135deg, #f44336, #d32f2f)'
                    : 'linear-gradient(135deg, #4caf50, #388e3c)',
                  color: 'white',
                  borderRadius: '50%',
                  boxShadow: isActive ? '0 3px 8px rgba(244, 67, 54, 0.3)' : '0 3px 8px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, #d32f2f, #c62828)'
                      : 'linear-gradient(135deg, #388e3c, #2e7d32)',
                    boxShadow: isActive ? '0 4px 12px rgba(244, 67, 54, 0.4)' : '0 4px 12px rgba(76, 175, 80, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={e => {
                  e.stopPropagation()
                  handleActivity(params.row.id, !isActive)
                }}
              >
                {isActive ? <ToggleOffIcon sx={{ fontSize: 14 }} /> : <ToggleOnIcon sx={{ fontSize: 14 }} />}
              </Button>
            </Tooltip>
            <Tooltip title='Delete this designation' placement='top'>
              <IconButton
                size='small'
                onClick={e => {
                  e.stopPropagation()
                  handleDelete(params.row.id)
                }}
                sx={{
                  color: 'error.main',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'white'
                  }
                }}
              >
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  // Show loading state
  if (loading && designations.length === 0) {
    return (
      <Container maxWidth='xl'>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth='xl' sx={{ maxWidth: '100vw', overflow: 'hidden', px: { xs: 1, sm: 2, md: 3 } }}>
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
              <WorkIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant='h4' fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
                Designation management
              </Typography>
              {/* <Tooltip title='Job titles and positions within departments (e.g., Manager, Developer, Analyst)'>
                <InfoOutlinedIcon sx={{ color: '#ffffff', fontSize: 24, cursor: 'pointer' }} />
              </Tooltip> */}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color='white'
              variant='outlined'
              startIcon={<BulkIcon />}
              onClick={() => setBulkDesignationOpen(true)}
              disabled={!Array.isArray(depts) || depts.length === 0}
              sx={{
                borderRadius: '25px',
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Add Bulk Designation
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

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Enhanced DataGrid */}
      <Paper sx={{ p: 2, width: '100%', overflow: 'hidden' }}>
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          <DataGrid
            rows={designations || []}
            columns={columns}
            loading={loading}
            pagination
            getRowId={row => row.id || Math.random().toString()}
            paginationModel={{ page, pageSize: rowsPerPage }}
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page)
              setRowsPerPage(pageSize)
            }}
            rowCount={totalItems}
            pageSizeOptions={[5, 10, 20, 50]}
            disableRowSelectionOnClick
            disableColumnResize
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: NoRowsOverlay
            }}
            sx={{
              width: '100%',
              overflow: 'hidden',
              '& .MuiDataGrid-main': {
                overflow: 'hidden'
              },
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'hidden auto'
              },
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
                alignItems: 'center',
                px: 1
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
      </Paper>

      {/* Enhanced Bulk Designation Modal */}
      <Dialog
        open={openBulkDesignation}
        onClose={() => setBulkDesignationOpen(false)}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            fontSize: 20,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1976d2, #1565c0)',
            color: 'white',
            py: 2.5,
            px: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <BulkIcon sx={{ fontSize: 24 }} />
            Bulk Designation Manager
          </Box>
          <IconButton
            onClick={() => setBulkDesignationOpen(false)}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, backgroundColor: '#f8fafc' }}>
          <Box sx={{ p: 4 }}>
            {/* Enhanced Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-start', mb: 2 }}>
              <Button
                variant='contained'
                startIcon={<AIIcon />}
                onClick={handleUseAI}
                disabled={aiLoading || !selectedDepartment}
                sx={{
                  borderRadius: '25px',
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                  boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f57c00, #ef6c00)',
                    boxShadow: '0 12px 35px rgba(255, 152, 0, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: 'rgba(241, 159, 36, 0.3)',
                    color: 'rgba(255,255,255,0.7)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {aiLoading ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                    Generating...
                  </>
                ) : (
                  '✨ Generate'
                )}
              </Button>
            </Box>

            {/* Department Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <BusinessIcon color='primary' sx={{ fontSize: 20 }} />
                Department Selection
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required size='small'>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={selectedDepartment}
                      onChange={e => {
                        setSelectedDepartment(e.target.value)
                        setSelectedSubDept('')
                        setAiDesignations([])
                      }}
                      label='Department'
                      sx={{
                        borderRadius: 2,
                        backgroundColor: 'white'
                      }}
                    >
                      {Array.isArray(depts) && depts.length > 0 ? (
                        depts.map(dept => (
                          <MenuItem key={dept._id || dept.name} value={dept._id || ''}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                              {dept.name || 'Unknown Department'}
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          <Typography variant='body2' color='text.secondary'>
                            No departments available
                          </Typography>
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Sub Department (Optional)</InputLabel>
                    <Select
                      value={selectedSubDepartment}
                      onChange={e => {
                        setSelectedSubDept(e.target.value)
                        setAiDesignations([])
                      }}
                      label='Sub Department (Optional)'
                      sx={{
                        borderRadius: 2,
                        backgroundColor: 'white'
                      }}
                    >
                      <MenuItem value=''>
                        <em>No Sub Department</em>
                      </MenuItem>
                      {Array.isArray(subDepts) && subDepts.length > 0 ? (
                        subDepts.map(dept => (
                          <MenuItem key={dept._id || dept.name} value={dept._id || ''}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DepartmentIcon sx={{ fontSize: 16, color: 'success.main' }} />
                              {dept.name || 'Unknown Sub Department'}
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          <Typography variant='body2' color='text.secondary'>
                            No sub departments available
                          </Typography>
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Designations List */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <DesignationIcon color='primary' sx={{ fontSize: 20 }} />
                Designations ({Array.isArray(aiDesignations) ? aiDesignations.length : 0})
              </Typography>

              {aiLoading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 120,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : !Array.isArray(aiDesignations) || aiDesignations.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 4,
                    border: '2px dashed #e0e7ff',
                    borderRadius: 3,
                    backgroundColor: '#f8faff'
                  }}
                >
                  <DesignationIcon sx={{ fontSize: 48, color: '#a5b4fc', mb: 2 }} />
                  <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
                    No designations added yet
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Select a department and use AI or add manually
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    maxHeight: 300,
                    overflowY: 'auto'
                  }}
                >
                  <List dense disablePadding>
                    {aiDesignations.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem
                          sx={{
                            px: 2,
                            py: 1,
                            '&:hover': { backgroundColor: '#f8fafc' }
                          }}
                          secondaryAction={
                            <IconButton
                              edge='end'
                              onClick={() => handleRemoveDesignation(index)}
                              size='small'
                              sx={{
                                color: '#ef4444',
                                '&:hover': {
                                  backgroundColor: '#fef2f2',
                                  color: '#dc2626'
                                }
                              }}
                            >
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          }
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DesignationIcon sx={{ fontSize: 16, color: 'info.main' }} />
                            <ListItemText primary={item?.name || 'Unknown Designation'} />
                          </Box>
                        </ListItem>
                        {index < aiDesignations.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}
            </Box>

            {/* Add Custom Designation */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <AddIcon color='primary' sx={{ fontSize: 20 }} />
                Add Custom Designation
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  fullWidth
                  size='small'
                  label='Designation Name'
                  value={newDesignation}
                  onChange={e => setNewDesignation(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white'
                    }
                  }}
                />
                <Button
                  variant='contained'
                  onClick={handleAddCustomDesignation}
                  disabled={!newDesignation.trim()}
                  sx={{
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    minWidth: 'auto',
                    background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #388e3c, #2e7d32)'
                    }
                  }}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 4,
            backgroundColor: 'white',
            borderTop: '1px solid #e2e8f0',
            gap: 2
          }}
        >
          <Button
            variant='outlined'
            onClick={() => {
              setBulkDesignationOpen(false)
              setAiDesignations([])
              setNewDesignation('')
              setSelectedDepartment('')
              setSelectedSubDept('')
            }}
            sx={{
              borderRadius: '25px',
              px: 6,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#64748b',
              color: '#64748b',
              fontSize: '1rem',
              '&:hover': {
                borderColor: '#475569',
                backgroundColor: '#f8fafc'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleBulkDesignation}
            disabled={!selectedDepartment || !Array.isArray(aiDesignations) || aiDesignations.length === 0}
            sx={{
              borderRadius: '25px',
              px: 6,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #1976d2, #1565c0)',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8',
                boxShadow: 'none'
              },
              transition: 'all 0.3s ease'
            }}
            startIcon={<BulkIcon />}
          >
            Create {Array.isArray(aiDesignations) ? aiDesignations.length : 0} Designation
            {Array.isArray(aiDesignations) && aiDesignations.length !== 1 ? 's' : ''}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} variant='filled' severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
