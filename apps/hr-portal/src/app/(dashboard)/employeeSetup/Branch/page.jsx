'use client'

import {
  Box,
  Container,
  Button,
  Typography,
  Grid,
  TextField,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Tooltip,
  Select,
  MenuItem,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton
} from '@mui/material'
import * as XLSX from 'xlsx'
import { useState, useEffect } from 'react'
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
  EditOutlined as EditIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Category as CategoryIcon,
  AccountTree as MappingIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  CheckCircle as StatusIcon
} from '@mui/icons-material'

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export default function Branch() {
  const token = window.localStorage.getItem('authToken')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [branches, setBranches] = useState([])
  const [branchTypes, setBranchTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [isEditMode, setIsEditMode] = useState(false)
  const [editID, setEditId] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const [uploadSheet, setUploadSheet] = useState(false)

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const [states, setStates] = useState([
    { name: 'Andhra Pradesh', abbreviation: 'AP' },
    { name: 'Arunachal Pradesh', abbreviation: 'AR' },
    { name: 'Assam', abbreviation: 'AS' },
    { name: 'Bihar', abbreviation: 'BR' },
    { name: 'Chhattisgarh', abbreviation: 'CG' },
    { name: 'Goa', abbreviation: 'GA' },
    { name: 'Gujarat', abbreviation: 'GJ' },
    { name: 'Haryana', abbreviation: 'HR' },
    { name: 'Himachal Pradesh', abbreviation: 'HP' },
    { name: 'Jharkhand', abbreviation: 'JH' },
    { name: 'Karnataka', abbreviation: 'KA' },
    { name: 'Kerala', abbreviation: 'KL' },
    { name: 'Madhya Pradesh', abbreviation: 'MP' },
    { name: 'Maharashtra', abbreviation: 'MH' },
    { name: 'Manipur', abbreviation: 'MN' },
    { name: 'Meghalaya', abbreviation: 'ML' },
    { name: 'Mizoram', abbreviation: 'MZ' },
    { name: 'Nagaland', abbreviation: 'NL' },
    { name: 'Odisha', abbreviation: 'OR' },
    { name: 'Punjab', abbreviation: 'PB' },
    { name: 'Rajasthan', abbreviation: 'RJ' },
    { name: 'Sikkim', abbreviation: 'SK' },
    { name: 'Tamil Nadu', abbreviation: 'TN' },
    { name: 'Telangana', abbreviation: 'TG' },
    { name: 'Tripura', abbreviation: 'TR' },
    { name: 'Uttar Pradesh', abbreviation: 'UP' },
    { name: 'Uttarakhand', abbreviation: 'UK' },
    { name: 'West Bengal', abbreviation: 'WB' },
    { name: 'Andaman and Nicobar Islands', abbreviation: 'AN' },
    { name: 'Chandigarh', abbreviation: 'CH' },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', abbreviation: 'DN' },
    { name: 'Lakshadweep', abbreviation: 'LD' },
    { name: 'Delhi', abbreviation: 'DL' },
    { name: 'Puducherry', abbreviation: 'PY' },
    { name: 'Ladakh', abbreviation: 'LA' },
    { name: 'Jammu and Kashmir', abbreviation: 'JK' }
  ])

  const [addBranch, setAddBranch] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    branchType: '',
    pincode: '',
    branchMaping: [],
    location: {
      coordinates: ['', '']
    }
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlebranchMapingChange = event => {
    const { value } = event.target
    setFormData(prev => ({
      ...prev,
      branchMaping: Array.isArray(value) ? value : [value]
    }))
  }

  const handleCoordinateChange = (index, value) => {
    const newCoords = [...formData.location.coordinates]
    newCoords[index] = value
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: newCoords
      }
    }))
  }

  const handleEdit = row => {
    setEditId(row.id)
    setFormData({
      name: row.name || '',
      address: row.address || '',
      city: row.city || '',
      state: row.state || '',
      branchType: row.branchType?._id || '',
      pincode: row.pincode || '',
      branchMaping: row.branchMaping?.map(b => b._id || b.id) || [],
      location: {
        coordinates: row.location?.coordinates || ['', '']
      }
    })
    setIsEditMode(true)
    setAddBranch(true)
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Branch Name',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Name of the branch office'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <BusinessIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Branch Name
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => (
        <Tooltip title={`Branch Name: ${params.value}`} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant='body2' fontWeight={500}>
              {params.value}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Physical address of the branch'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <LocationIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Address
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => (
        <Tooltip title={`Address: ${params.value}`} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon sx={{ fontSize: 16, color: 'info.main' }} />
            <Typography
              variant='body2'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '130px'
              }}
            >
              {params.value}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'city',
      headerName: 'City',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='City where the branch is located'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <LocationIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              City
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => (
        <Tooltip title={`City: ${params.value}`} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant='body2'>{params.value}</Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'state',
      headerName: 'State',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='State/Province of the branch'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <BusinessIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              State
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => (
        <Tooltip title={`State: ${params.value}`} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon sx={{ fontSize: 16, color: 'warning.main' }} />
            <Typography variant='body2'>{params.value}</Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'pincode',
      headerName: 'Pincode',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Postal/ZIP code of the branch'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <PhoneIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Pincode
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => (
        <Tooltip title={`Pincode: ${params.value}`} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant='body2'>{params.value}</Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'branchType',
      headerName: 'Branch Type',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Type/Category of the branch (e.g., Main Office, Regional Office)'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <CategoryIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Branch Type
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => (
        <Tooltip title={`Branch Type: ${params.row?.branchType?.name || 'Not specified'}`} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CategoryIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
            <Typography variant='body2'>{params.row?.branchType?.name || '-'}</Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'branchMaping',
      headerName: 'Branch Mapping',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Connected/Mapped branches under this branch'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <MappingIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Branch Mapping
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => {
        const mappingText =
          Array.isArray(params.row.branchMaping) && params.row.branchMaping.length > 0
            ? params.row.branchMaping?.map(i => i.name).join(', ')
            : 'No Mapping'

        return (
          <Tooltip title={`Branch Mapping: ${mappingText}`} placement='top'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MappingIcon sx={{ fontSize: 16, color: 'info.main' }} />
              <Typography
                variant='body2'
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '110px'
                }}
              >
                {mappingText}
              </Typography>
            </Box>
          </Tooltip>
        )
      }
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Date when the branch was created'>
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
        if (!dateStr)
          return (
            <Tooltip title='Created Date: Not available' placement='top'>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant='body2'>-</Typography>
              </Box>
            </Tooltip>
          )
        const date = new Date(dateStr)
        const formattedDate = isNaN(date.getTime())
          ? '-'
          : date.toLocaleString('en-IN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })
        return (
          <Tooltip title={`Created Date: ${formattedDate}`} placement='top'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Current status of the branch'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <StatusIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Status
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => {
        const isActive = params.row.isActive
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
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Tooltip title='Available actions for this branch'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <SettingsIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant='body2' fontWeight={600} color='white'>
              Actions
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: params => {
        const isActive = params.row.isActive

        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <Tooltip title='Edit branch details' placement='top'>
              <Button
                variant='contained'
                size='small'
                sx={{
                  minWidth: 'auto',
                  width: 36,
                  height: 36,
                  p: 0,
                  background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
                  color: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 3px 8px rgba(0, 188, 212, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0097a7, #00838f)',
                    boxShadow: '0 4px 12px rgba(0, 188, 212, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={e => {
                  e.stopPropagation()
                  handleEdit(params.row)
                }}
              >
                <EditIcon sx={{ fontSize: 16 }} />
              </Button>
            </Tooltip>
            <Tooltip title={isActive ? 'Deactivate this branch' : 'Activate this branch'} placement='top'>
              <Button
                variant='contained'
                size='small'
                sx={{
                  minWidth: 'auto',
                  width: 36,
                  height: 36,
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
                {isActive ? <ToggleOffIcon sx={{ fontSize: 16 }} /> : <ToggleOnIcon sx={{ fontSize: 16 }} />}
              </Button>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ p: 1, gap: 1, display:"flex",justifyContent:"space-between" }}>
        <Box>
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
        </Box>
          <Button
                color='white'
                variant='outlined'
                onClick={() => setUploadSheet(true)}
                sx={{
                  borderRadius: '25px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                }}
              >
                Upload Sheet
              </Button>
      </GridToolbarContainer>
    )
  }

  const getBranchTypes = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/v1/api/masterDropDown/subDropDown/getList?status=active&name=branchtype`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data.status) {
        setBranchTypes(res.data.items)
      }
    } catch (error) {
      console.error('Error fetching branch types:', error)
    }
  }

  const getAllBranch = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${baseUrl}/v1/api/branch/getList`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      if (res.data.status) {
        const formattedBranches = res.data.items.map(branch => ({
          id: branch._id,
          name: branch.name,
          address: branch.address,
          city: branch.city,
          state: branch.state,
          pincode: branch.pincode,
          branchType: branch.branchType,
          status: branch.status,
          totalEmployees: branch.totalEmployees,
          loginFees: branch.loginFees,
          guarantorRequired: branch.guarantorRequired,
          paymentGateway: branch.PaymentGateway,
          location: branch.location || [],
          createdBy: branch.createdBy || {},
          updatedBy: branch.updatedBy || {},
          createdAt: branch.createdAt,
          updatedAt: branch.updatedAt,
          isActive: branch.isActive,
          branchMaping: branch.branchMaping || []
        }))
        setBranches(formattedBranches)
        setTotalItems(formattedBranches.length)
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivity = async (id, isChecked) => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/branch/delete/${id}`,
        {
          isActive: isChecked
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
          message: res.data.message,
          severity: 'success',
          open: true
        })
      } else {
        setSnackbar({
          message: res.data.message,
          severity: 'error',
          open: true
        })
      }
      getAllBranch()
    } catch (error) {
      console.error('error', error)
      setSnackbar({
        message: error?.message,
        severity: 'error',
        open: true
      })
    }
  }

  useEffect(() => {
    getAllBranch()
    getBranchTypes()
  }, [])

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        const res = await axios.post(
          `${baseUrl}/v1/api/branch/update`,
          {
            ...formData,
            Id: editID
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
            message: res.data.message,
            severity: 'success',
            open: true
          })
          getAllBranch()
          setAddBranch(false)
          setFormData({
            name: '',
            address: '',
            city: '',
            state: '',
            branchType: '',
            branchMaping: [],
            pincode: '',
            location: { coordinates: ['', ''] }
          })
          setEditId('')
          setIsEditMode(false)
        }
      } else {
        const res = await axios.post(`${baseUrl}/v1/api/branch/add`, formData, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        })
        if (res.data.status) {
          setSnackbar({
            message: res.data.message,
            severity: 'success',
            open: true
          })
          getAllBranch()
          setAddBranch(false)
          setFormData({
            name: '',
            address: '',
            city: '',
            state: '',
            branchType: '',
            branchMaping: [],
            pincode: '',
            location: { coordinates: ['', ''] }
          })
          setEditId('')
          setIsEditMode(false)
        }
      }
    } catch (error) {
      console.error('error', error)
      setSnackbar({
        message: error?.message,
        severity: 'error',
        open: true
      })
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href =
      'https://cdn.fincooper.in/STAGE/HRMS/OTHERS/1750623176484_GoogleSheetStyle_BranchUpload%20(2)%20(1).xlsx';
    link.download = 'Sample_Branch_Upload.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleUploadSheet = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
  
      if (!json.length) {
        return setSnackbar({
          message: 'Sheet is empty.',
          severity: 'error',
          open: true
        });
      }
  
      // Map normalized header keys (remove space, lowercase) to expected field names
      const headerMap = {
        "branchname": "name",
        "address": "address",
        "city": "city",
        "state": "state",
        "pincode": "pincode",
        "latitude": "latitude",
        "longitude": "longitude",
        "branchtype": "branchType"
      };
  
      const requiredKeys = Object.keys(headerMap);
  
      const firstRowRawKeys = Object.keys(json[0]);
      const normalizedKeys = firstRowRawKeys.map(key => key.toLowerCase().replace(/\s/g, ''));
  
      const hasAllHeaders = requiredKeys.every(key => normalizedKeys.includes(key));
  
      if (!hasAllHeaders) {
        return setSnackbar({
          message: 'Invalid format. Please download the sample sheet and refer to it.',
          severity: 'error',
          open: true
        });
      }
  
      const branches = json.map(row => {
        const formatted = {};
        for (const [key, value] of Object.entries(row)) {
          const normalizedKey = key.toLowerCase().replace(/\s/g, '');
          const mappedKey = headerMap[normalizedKey];
          if (mappedKey) {
            formatted[mappedKey] = value;
          }
        }
        return formatted;
      });
  
      const res = await axios.post(
        `${baseUrl}/v1/api/branch/UploadBranches`,
        { branches },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      );
  
      setSnackbar({
        message: res.data.message,
        severity: res.data.status ? 'success' : 'error',
        open: true
      });
  
      if (res.data.status) {
        getAllBranch();
        setUploadSheet(false)
      }
  
    } catch (error) {
      console.error('Upload Error:', error);
      setSnackbar({
        message: error?.message || 'Something went wrong.',
        severity: 'error',
        open: true
      });
    }
  };
  
  return (
    <Container maxWidth='xl'>
      {/* Header Section */}
      {/* <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <IconButton
              onClick={() => router.push("/employeeSetup")}
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                color: "primary.main",
                width: 40,
                height: 40,
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              Branch Management
            </Typography>
            <Tooltip title="Physical or regional office locations of your organization (e.g., Mumbai Office, Delhi Branch).">
              <InfoOutlinedIcon sx={{ color: "#1976d2", fontSize: 24, cursor: "pointer" }} />
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddBranch(true)}
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              }}
            >
              Add Branch
            </Button>

          </Box>
        </Box>
      </Box> */}

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
              <AccountTreeIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant='h4' fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
                Branch Management
              </Typography>
              {/* <Tooltip title='Physical or regional office locations of your organization (e.g., Mumbai Office, Delhi Branch).'>
                <InfoOutlinedIcon sx={{ color: '#ffffff', fontSize: 24, cursor: 'pointer' }} />
              </Tooltip> */}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color='white'
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={() => setAddBranch(true)}
              sx={{
                borderRadius: '25px',
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}
            >
              Add Branch
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

      <Paper sx={{ p: 2 }}>
        <DataGrid
          rows={branches}
          columns={columns}
          loading={loading}
          pagination
          getRowId={row => row.id}
          paginationModel={{ page, pageSize: rowsPerPage }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPage(page)
            setRowsPerPage(pageSize)
          }}
          rowCount={totalItems}
          pageSizeOptions={[5, 10, 20, 50,100]}
          disableRowSelectionOnClick
          slots={{
            toolbar: CustomToolbar
          }}
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
      </Paper>

      {/* Add/Edit Branch Modal */}
      <Dialog
        open={addBranch}
        onClose={() => {
          setAddBranch(false)
          setEditId('')
          setIsEditMode(false)
          setFormData({
            name: '',
            address: '',
            city: '',
            state: '',
            branchType: '',
            branchMaping: [],
            pincode: '',
            location: { coordinates: ['', ''] }
          })
        }}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 18, fontWeight: 600 }}>
          <BusinessIcon color='primary' />
          {isEditMode ? 'Edit Branch' : 'Add New Branch'}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Form Header */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant='h6' fontWeight={600} color='primary.main' sx={{ mb: 1 }}>
                Branch Information
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Fill in the details below to {isEditMode ? 'update' : 'create'} a branch
              </Typography>
            </Box>

            {/* Basic Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <BusinessIcon color='primary' sx={{ fontSize: 20 }} />
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Branch Name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant='outlined' required size='small'>
                    <InputLabel>Branch Type</InputLabel>
                    <Select
                      name='branchType'
                      value={formData.branchType}
                      onChange={handleChange}
                      label='Branch Type'
                      MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                      sx={{
                        borderRadius: 2
                      }}
                    >
                      {branchTypes.map(branchType => (
                        <MenuItem key={branchType._id} value={branchType._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CategoryIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            {branchType.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Location Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <LocationIcon color='primary' sx={{ fontSize: 20 }} />
                Location Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Address'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='City'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl variant='outlined' fullWidth size='small'>
                    <InputLabel id='state-label'>State</InputLabel>
                    <Select
                      MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                      labelId='state-label'
                      name='state'
                      value={formData.state}
                      onChange={handleChange}
                      label='State'
                      required
                      sx={{
                        borderRadius: 2
                      }}
                    >
                      {states.map(state => (
                        <MenuItem key={state.abbreviation} value={state.name}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Pincode'
                    name='pincode'
                    value={formData.pincode}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Branch Mapping Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <MappingIcon color='primary' sx={{ fontSize: 20 }} />
                Branch Mapping
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant='outlined' size='small'>
                    <InputLabel>
                      {formData.branchType === 'Regional Office' ? 'Branch Mapping' : 'Regional Branch Mapping'}
                    </InputLabel>
                    <Select
                      multiple
                      name='branchMaping'
                      value={formData.branchMaping || []}
                      onChange={handlebranchMapingChange}
                      label={formData.branchType === 'Regional Office' ? 'Branch Mapping' : 'Regional Branch Mapping'}
                      MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                      sx={{
                        borderRadius: 2
                      }}
                    >
                      {branches.map(branch => (
                        <MenuItem key={branch.id} value={branch.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            {branch.name} - {branch.city}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Coordinates Section */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <LocationIcon color='primary' sx={{ fontSize: 20 }} />
                Geographic Coordinates
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Latitude'
                    value={formData.location.coordinates[0]}
                    onChange={e => handleCoordinateChange(0, e.target.value)}
                    placeholder='e.g., 19.0760'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Longitude'
                    value={formData.location.coordinates[1]}
                    onChange={e => handleCoordinateChange(1, e.target.value)}
                    placeholder='e.g., 72.8777'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
          <Button
            variant='outlined'
            onClick={() => {
              setAddBranch(false)
              setEditId('')
              setIsEditMode(false)
              setFormData({
                name: '',
                address: '',
                city: '',
                state: '',
                branchType: '',
                branchMaping: [],
                pincode: '',
                location: { coordinates: ['', ''] }
              })
            }}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#d0d0d0',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #1976d2, #1565c0)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
            startIcon={isEditMode ? <EditIcon /> : <AddIcon />}
          >
            {isEditMode ? 'Update Branch' : 'Create Branch'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={uploadSheet} onClose={()=>setUploadSheet(false)}>
      <DialogContent>
        <Box sx={{width:"100%", px:4,pt:4}}> 
        <Typography variant="h6">
          You can upload a data sheet or download a sample template to start with.
        </Typography>
        <Box sx={{display:"flex", gap:5, alignItems:"center",my:5, justifyContent:"center", width:"100%"}}>
        <input
          accept=".xlsx, .xls"
          type="file"
          id="upload-branch-sheet"
          onChange={handleUploadSheet}
          style={{ display: 'none' }}
        />
        <label htmlFor="upload-branch-sheet">
          <Button
            variant="contained"
            sx={{ backgroundColor: '#667eea' }}
            component="span"
          >
            Upload Sheet
          </Button>
        </label>
        <Button variant="outlined" sx={{color:'#667eea'}} onClick={handleDownload}>
          Download Sample Sheet
        </Button>
        </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{pb: 2,mt:-4 }}>
         <Button variant='outlined' size='small' onClick={()=>setUploadSheet(false)}>Close</Button>
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
