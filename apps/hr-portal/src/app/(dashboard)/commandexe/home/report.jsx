
'use client'

import React, { useState, useEffect } from 'react'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid'
import {
  Avatar,
  Box,
  Typography,
  Grid,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  Button,
  TextField,
  Paper,
  TablePagination,
  CircularProgress,
  useMediaQuery,
  Chip,
  Tooltip,
  InputAdornment,
  useTheme,
  alpha,
  Card,
  Snackbar,
  Alert,
  IconButton,
  Stack,
  Switch,
  LinearProgress,
  Divider,
  Menu,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material'
// import Icon from './icon'
import {
  generatePDFApi,
  getAiDataAPI,
  getAllEmployeeApi,
  getAllLocationsAPI,
  getAllPDFtemplateById,
  getAllServicesApi,
  getAllUnfilteredInitCasesApi,
  getBackOfficeDashBoardCount,
  getConfigs,
  getDashboardReportCasesApi,
  getInitDashBoardCount,
  getMyPartnersAPI,
  getpartnerproduct,
  postJobApi,
  updateAddCasesApi,
  uploadImageApi,
  uploadMultiImageApi
} from '@/services/apiService'
import {
  Person2Rounded,
  InsertDriveFileOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  AutoAwesomeOutlined,
  Settings,
  CheckCircleOutlined,
  ImageOutlined,
  DescriptionOutlined
} from '@mui/icons-material'

import CustomTextField from '@/@core/components/mui/TextField'
import Icon from './DynamicIcon'

const getFileNameFromUrl = url => {
  try {
    const urlParts = url.split('/')
    const lastPart = urlParts[urlParts.length - 1]
    // Remove timestamp prefix if present (like "1748695223694_")
    const cleanName = lastPart.replace(/^\d+_/, '')
    return cleanName || 'Unknown File'
  } catch (error) {
    return 'Unknown File'
  }
}

const MultiUploadComponent = ({ value }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = e => {
    e.stopPropagation()
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleViewFile = (url, e) => {
    e.stopPropagation()
    window.open(url, '_blank')
  }

  const fileCount = Array.isArray(value) ? value.length : 0

  return (
    <>
      {/* Main display component */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant='body2'>{fileCount > 0 ? `${fileCount} file(s)` : '0 files'}</Typography>
        {fileCount > 0 && (
          <IconButton size='small' onClick={handleOpenDialog} sx={{ p: 0.25 }} title='View all files'>
            <Icon icon='tabler:eye' fontSize='small' color='#0082c6' />
          </IconButton>
        )}
      </Box>

      {/* Dialog for displaying files */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon icon='tabler:files' fontSize='medium' color='#0082c6' />
            <Typography variant='h6'>Uploaded Files ({fileCount})</Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 0, py: 1 }}>
          <List sx={{ width: '100%' }}>
            {Array.isArray(value) &&
              value.map((url, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 3, py: 1.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant='body1' sx={{ fontWeight: 500 }}>
                          {getFileNameFromUrl(url)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant='caption' color='text.secondary'>
                          Click view to open in new tab
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge='end'
                        onClick={e => handleViewFile(url, e)}
                        size='small'
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark'
                          },
                          borderRadius: 1,
                          px: 1.5,
                          py: 0.5
                        }}
                      >
                        <Icon icon='tabler:external-link' fontSize='small' />
                        <Typography variant='caption' sx={{ ml: 0.5 }}>
                          View
                        </Typography>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < value.length - 1 && <Divider />}
                </React.Fragment>
              ))}
          </List>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} variant='outlined' startIcon={<Icon icon='tabler:x' />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
// Main component
const Reporting = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const [selectedEmployee, setSelectedEmployee] = useState('all') // Fixed naming
  const [partners, setPartners] = useState([])
  const [counts, setCounts] = useState({})
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('all') // Fixed to single value
  const [page, setPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(100)
  const [totalCount, setTotalCount] = useState(0)
  const [rows, setRows] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const [selectedService, setSelectedService] = useState('')

  const [loading, setLoading] = useState(false)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [partnerName, setPartnerName] = useState(null)
  const [serviceId, setServiceId] = useState(null)
  const [serviceName, setServiceName] = useState(null)
  const [requestId, setRequestId] = useState(null)
  const [initId, setInitId] = useState(null)
  const [partnerProducts, setPartnerProducts] = useState([])
  const [formVisibility, setFormVisibility] = useState({})
  const [productFields, setProductFields] = useState({})
  const [uploadingFiles, setUploadingFiles] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [aiProcessing, setAiProcessing] = useState({})
  const [aiButtonVisible, setAiButtonVisible] = useState({})
  const [aiResponseData, setAiResponseData] = useState({})
  const [locations, setLocations] = useState([])
  const [pId, setPId] = useState(null)
  const [services, setServices] = useState([])

  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  const handleOpenReportModal = row => {
    setReportOpen(true)
    setSelectedReport(row._id)
    fetchTemplates(row.reportType._id)
  }

  const handleCloseReportModal = () => {
    setReportOpen(false)
    setSelectedReport(null)
  }

  const fetchTemplates = async productId => {
    console.log('Fetching templates for productId:', productId)

    try {
      const response = await getAllPDFtemplateById(productId)

      console.log('Templates:', response)

      if (response.status) {
        setTemplates(response.items)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeRowsPerPage = event => {
    const newPageLimit = Number.parseInt(event.target.value, 10)
    setPageLimit(newPageLimit)
    setPage(1)
  }

  const [emps, setEmps] = useState([])
  const [dateRange, setDateRange] = useState('')

  const fetchEmps = async () => {
    try {
      const data = await getAllEmployeeApi()
      if (data.status && Array.isArray(data.items)) {
        setEmps(data.items)
      } else {
        setEmps([])
      }
    } catch (err) {
      console.error(err)
      setEmps([])
    }
  }

  useEffect(() => {
    fetchDashBoardCount()
    fetchPartners()
    fetchEmps()
  }, [])

  // Fixed useEffect for fetching cases with proper dependencies
  useEffect(() => {
    fetchAddCases()
  }, [selectedService, selectedEmployee, dateRange, startDateFilter, endDateFilter])

  const fetchPartners = async () => {
    try {
      const data = await getMyPartnersAPI()

      if (data.status) {
        setPartners(data.items)
        console.log('partners', data.items)
      } else {
        console.error('Failed to fetch partners:', data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchDashBoardCount = async () => {
    try {
      setIsLoading(true)

      const res = await getInitDashBoardCount()
      console.log('Dashboard counts response:', res)

      if (res && res.status) {
        setCounts({
          totalCases: res.items.allCount || 0,
          wipCases: res.items.initaited || 0,
          pendingCases: res.items.uninitiated || 0
          //  totalCases: res.items.totalCases || 0,
          // pendingCases: res.items.pendingRequests || 0,
          // accepted: res.items.acceptedRequests || 0,
          // allocated: res.items.allocatedJobs || 0,
          // final: res.items.finalReviewJobs || 0
        })
      } else {
        console.error('Failed to fetch dashboard counts:', res.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Error fetching dashboard counts:', error)
      setSnackbar({
        open: true,
        message: 'Failed to load dashboard counts',
        severity: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fixed fetchAddCases function with proper parameter handling
  const fetchAddCases = async () => {
    try {
      setIsLoading(true)

      // Prepare filter parameters
      const statusParam = status === 'all' ? 'all' : status
      const partnerParam = selectedEmployee === 'all' ? '' : selectedEmployee

      console.log('Fetching cases with filters:', {
        status: statusParam,
        partner: partnerParam,
        range: dateRange,
        startDate: startDateFilter,
        endDate: endDateFilter
      })

      const data = await getDashboardReportCasesApi(
        selectedService,
        partnerParam,
        dateRange,
        startDateFilter,
        endDateFilter
      )

      console.log('All INIT cases data:', data)

      if (data?.items) {
        setRows(
          data.items.map(item => ({
            _id: item._id,
            fileNo: item.fileNo,
            partnerName: item.partnerId?.name || 'N/A',
            partnerId: item.partnerId?._id || 'N/A',
            pId: item.partnerId?._id || 'N/A',
            customerName: item.customerName,
            fatherName: item.fatherName,
            contactNo: item.contactNo,
            address: item.address,
            initFields: item.initFields || [],
            serviceId: item.referServiceId._id || 'N/A',
            doneBy: item.doneBy?.employeName || 'N/A',
            officeEmp: item.allocatedOfficeEmp?.employeName || 'N/A',
            createdAt: item.createdAt || 'N/A',
            customerId: item.customerId || item._id,
            requestData: item.requestData || {},
            serviceName: item.referServiceId.serviceName || 'N/A',
            workStatus: item.workStatus || 'N/A',
            reportType: item.reportType || 'N/A',
            wordUrl: item.wordUrl || [],
            reportUrl: item.reportUrl || [],
            reportStatus: item.reportStatus || 'N/A',
            reportDate: item.reportDate || 'N/A',
            reportTAT: item.reportTAT || '0',
            edit: true,
            delete: false,
            view: false
          }))
        )
        setTotalCount(data.totalCount || data.items.length)
      } else {
        console.error('Failed to fetch cases:', data?.message)
        setRows([])
      }
    } catch (err) {
      console.error('Error fetching cases:', err)
      setSnackbar({
        open: true,
        message: 'Failed to load cases data',
        severity: 'error'
      })
    } finally {
      setIsLoading(false)
      fetchDashBoardCount()
    }
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Fixed employee selection handler
  const handleEmployeeSelectChange = event => {
    const selectedValue = event.target.value
    console.log('Employee selection changed:', selectedValue)
    setSelectedEmployee(selectedValue)
    setPage(1) // Reset to first page when filter changes
  }

  const handleServiceSelectChange = event => {
    const selectedValue = event.target.value
    console.log('Service selection changed:', selectedValue)
    setSelectedService(selectedValue)
    setPage(1) // Reset to first page when filter changes
  }

  // Fixed status change handler
  const handleStatusChange = event => {
    const selectedValue = event.target.value
    console.log('Status change event:', selectedValue)
    setStatus(selectedValue)
    setPage(1) // Reset to first page when filter changes
  }

  const handleDateRangeChange = event => {
    const selectedValue = event.target.value
    console.log('Date range change event:', selectedValue)
    setDateRange(selectedValue)
    setPage(1) // Reset to first page when filter changes
  }

  // Function to generate string-based colors
  const stringToColor = string => {
    if (!string) return '#1976d2'

    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }

    return color
  }

  const generateDynamicColumns = sampleRow => {
    if (!sampleRow?.initFields || !Array.isArray(sampleRow.initFields)) {
      return []
    }

    return sampleRow.initFields.map((field, index) => ({
      field: `initField_${index}`, // Unique field identifier
      headerName: field.fieldName,
      minWidth: 150,
      flex: 1,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon={getIconForDataType(field.dataType)} fontSize='small' />
          <Typography variant='subtitle2'>{field.fieldName}</Typography>
        </Box>
      ),
      renderCell: params => {
        const fieldValue = params.row.initFields?.[index]?.value
        return (
          <Tooltip title={formatFieldValue(fieldValue, field.dataType) || 'N/A'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Icon icon={getIconForDataType(field.dataType)} fontSize='small' color='#0082c6' />
              <Typography variant='body2' noWrap sx={{ flex: 1 }}>
                {renderFieldValue(fieldValue, field.dataType)}
              </Typography>
            </Box>
          </Tooltip>
        )
      }
    }))
  }

  // Helper function to get appropriate icon based on data type
  const getIconForDataType = dataType => {
    switch (dataType) {
      case 'string':
        return 'tabler:user-circle'
      case 'file':
        return 'tabler:file'
      case 'multiUpload':
        return 'tabler:files'
      case 'textarea':
        return 'tabler:info-circle'
      default:
        return 'tabler:info-circle'
    }
  }

  // Helper function to format field values for display
  const formatFieldValue = (value, dataType) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return 'N/A'
    }

    switch (dataType) {
      case 'multiUpload':
        return Array.isArray(value) ? `${value.length} file(s)` : 'N/A'
      case 'file':
        return value ? 'File uploaded' : 'N/A'
      case 'textarea':
      case 'string':
      default:
        return String(value)
    }
  }
  // Helper function to extract filename from URL
  const getFileNameFromUrl = url => {
    try {
      const urlParts = url.split('/')
      const lastPart = urlParts[urlParts.length - 1]
      // Remove timestamp prefix if present (like "1748695223694_")
      const cleanName = lastPart.replace(/^\d+_/, '')
      return cleanName || 'Unknown File'
    } catch (error) {
      return 'Unknown File'
    }
  }

  const handleDownload = (url, fileName) => {
    // Simply open in new tab - most reliable approach
    window.open(url, '_blank')
  }

  // Helper function to render field values with appropriate styling
  const renderFieldValue = (value, dataType) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return (
        <Typography variant='body2' color='text.secondary' noWrap>
          N/A
        </Typography>
      )
    }

    switch (dataType) {
      case 'multiUpload':
        return <MultiUploadComponent value={value} />

      case 'file':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return (
            <Typography variant='body2' color='textSecondary'>
              No file
            </Typography>
          )
        }

        const fileUrl = Array.isArray(value) ? value[0] : value
        const fileName = getFileNameFromUrl(fileUrl)

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* <Icon icon="tabler:file" fontSize="small" color="#0082c6" /> */}
            <Typography
              variant='body2'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px'
              }}
              title={fileName}
            >
              {fileName}
            </Typography>
            <IconButton
              size='small'
              onClick={e => {
                e.stopPropagation()
                handleDownload(fileUrl, fileName)
              }}
              sx={{ p: 0.25 }}
              title='Download file'
            >
              <Icon icon='tabler:download' fontSize='small' color='#0082c6' />
            </IconButton>
          </Box>
        )
      case 'textarea':
        return (
          <Typography
            variant='body2'
            noWrap
            sx={{
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {String(value)}
          </Typography>
        )

      case 'string':
      default:
        return (
          <Typography variant='body2' noWrap>
            {String(value)}
          </Typography>
        )
    }
  }

  // DataGrid columns
  const columns = [
    {
      field: 'partnerName',
      headerName: 'Client Name',
      minWidth: 180,
      flex: 1,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:user-circle' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => (
        <Tooltip title={params.row.partnerName || 'N/A'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: '0.875rem',
                bgcolor: stringToColor(params.row.partnerName || '')
              }}
            >
              {params.row.partnerName ? params.row.partnerName.charAt(0).toUpperCase() : '?'}
            </Avatar>
            <Typography variant='body2' noWrap>
              {params.row.partnerName || 'N/A'}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'serviceName',
      headerName: 'Service Name',
      minWidth: 180,
      flex: 1,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:file' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => (
        <Tooltip title={params.row.serviceName || 'N/A'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: '0.875rem',
                bgcolor: stringToColor(params.row.serviceName || '')
              }}
            >
              {params.row.serviceName ? params.row.serviceName.charAt(0).toUpperCase() : '?'}
            </Avatar>
            <Typography variant='body2' noWrap>
              {params.row.serviceName || 'N/A'}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    ...(rows.length > 0 ? generateDynamicColumns(rows[0]) : []),
    {
      field: 'createdAt',
      headerName: 'Initiation Date',
      minWidth: 130,
      flex: 0.8,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:calendar-check' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => {
        const dateStr = params.row.createdAt || ''
        let formattedDate = 'N/A'
        if (dateStr) {
          try {
            const date = new Date(dateStr.replace(/ (AM|PM)$/, ''))
            formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString('en-GB') : 'Invalid Date'
          } catch (e) {
            formattedDate = 'Invalid Date'
          }
        }
        return (
          <Tooltip title={formattedDate}>
            <Typography variant='body2' noWrap>
              {formattedDate}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      field: 'doneBy',
      headerName: 'Cases Added By',
      minWidth: 150,
      flex: 1,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:user-check' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => (
        <Tooltip title={params.row.doneBy || 'N/A'}>
          <Typography variant='body2' noWrap>
            {params.row.doneBy || 'N/A'}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'officeEmp',
      headerName: 'Allocated To',
      minWidth: 150,
      flex: 1,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:user-check' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => (
        <Tooltip title={params.row.officeEmp || 'N/A'}>
          <Typography variant='body2' noWrap>
            {params.row.officeEmp || 'N/A'}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'reportStatus',
      headerName: 'Report Status',
      minWidth: 150,
      flex: 1,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:file' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => (
        <Tooltip title={params.row.reportStatus || 'N/A'}>
          <Typography variant='body2' noWrap>
            {params.row.reportStatus || 'N/A'}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'reportDate',
      headerName: 'Report Date',
      minWidth: 130,
      flex: 0.8,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:calendar-check' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => {
        const dateStr = params.row.reportDate || ''
        let formattedDate = 'N/A'
        if (dateStr) {
          try {
            const date = new Date(dateStr.replace(/ (AM|PM)$/, ''))
            formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString('en-GB') : 'N/A'
          } catch (e) {
            formattedDate = 'N/A'
          }
        }
        return (
          <Tooltip title={formattedDate}>
            <Typography variant='body2' noWrap>
              {formattedDate}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      field: 'reportTAT',
      headerName: 'Report TAT',
      minWidth: 150,
      flex: 1,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:file' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => (
        <Tooltip title={params.row.reportTAT || 'N/A'}>
          <Typography variant='body2' noWrap>
            {params.row.reportTAT || 'N/A'}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'Pdf',
      headerName: 'PDF Url',
      minWidth: 180,
      flex: 1,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:report' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size='small'
            color='primary'
            variant='contained'
            disabled={params.row.workStatus !== 'reportgenerated'}
            onClick={e => {
              e.stopPropagation()
              handleDownloadPDF(params.row.reportUrl)
            }}
          >
            <Icon icon='tabler:report' fontSize='small' />
            Download PDF
          </Button>
          </Box>
        )
      }
    }
  ]

  const handleDownloadPDF = urls => {
    console.log('Downloading PDF with URLs:', urls)

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      setSnackbar({ open: true, message: 'No PDF available for this case', severity: 'warning' })
      return
    }

    // Get the last URL from the array
    const lastUrl = urls[urls.length - 1]

    if (!lastUrl) {
      setSnackbar({ open: true, message: 'Invalid PDF URL', severity: 'error' })
      return
    }

    try {
      const link = document.createElement('a')
      link.href = lastUrl
      link.download = '' // Browser will use filename from URL or default name
      link.target = '_blank' // Fallback for some browsers

      // Make the link invisible
      link.style.display = 'none'

      document.body.appendChild(link)
      link.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)

      setSnackbar({ open: true, message: 'PDF download started', severity: 'success' })
    } catch (error) {
      console.error('Download failed:', error)
      setSnackbar({ open: true, message: 'Failed to download PDF', severity: 'error' })
    }
  }

  // Fetch services on component mount
  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    if (partnerProducts && partnerProducts[0]?.productForm) {
      const initialProductFields = {}

      partnerProducts[0].productForm.forEach(product => {
        if (product?.submitFields?.isActive && product?.submitFields?.fields) {
          // if (product?.initFields?.isActive && product?.initFields?.fields) {
          initialProductFields[product._id] = {}

          // Initialize each field with its existing value
          product.submitFields.fields.forEach(field => {
            // Use existing value if available, otherwise use empty string
            initialProductFields[product._id][field.fieldName] = field.value || ''
          })
        }
      })

      // Only set if we have initial data and productFields is empty
      if (Object.keys(initialProductFields).length > 0 && Object.keys(productFields).length === 0) {
        setProductFields(initialProductFields)
      }
    }
  }, [partnerProducts])

  // Fetch locations when partner products change
  useEffect(() => {
    if (partnerProducts.length > 0) {
      fetchLocations()
    }
  }, [partnerProducts])

  const [configs, setConfigs] = useState(null)

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await getConfigs()
      console.log('config', response)

      if (response?.status) {
        setConfigs(response.items)
      }
    } catch (err) {
      console.error('Failed to fetch config:', err)
      setSnackbar({ open: true, message: 'Failed to fetch config', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await getAllServicesApi()
      console.log('services', response)

      if (response?.items) {
        setServices(response.items)
      }
    } catch (err) {
      console.error('Failed to fetch services:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = async () => {
    try {
      const data = await getAllLocationsAPI()

      if (data?.items) {
        setLocations(data.items)
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err)
    }
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    resetForm()
  }

  const handleToggleProduct = productId => {
    setFormVisibility(prev => {
      // If the product is being turned on, turn off all others
      if (!prev[productId]) {
        const newVisibility = {}
        // Turn off all products
        Object.keys(prev).forEach(id => {
          newVisibility[id] = false
        })
        // Turn on only the selected product
        newVisibility[productId] = true
        return newVisibility
      } else {
        // If turning off, just toggle this product
        return {
          ...prev,
          [productId]: false
        }
      }
    })
  }

  const handleProductFieldChange = (productId, fieldName, value) => {
    setProductFields(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [fieldName]: value
      }
    }))

    // Clear error when user starts typing
    if (fieldErrors[`${productId}_${fieldName}`]) {
      setFieldErrors(prev => ({
        ...prev,
        [`${productId}_${fieldName}`]: undefined
      }))
    }
  }

  const handleFileUpload = async (file, productId, fieldName) => {
    if (!file) return

    setUploadingFiles(prev => ({
      ...prev,
      [`${productId}_${fieldName}`]: true
    }))

    try {
      const response = await uploadImageApi(file)

      if (response.status && response.items?.fileUrl) {
        handleProductFieldChange(productId, fieldName, response.items.fileUrl)
        handleProductFieldChange(productId, `${fieldName}_filename`, file.name)

        // Make AI button visible for ANY file upload (images or documents)
        setAiButtonVisible(prev => ({
          ...prev,
          [productId]: true
        }))
      } else {
        console.error('File upload failed:', response)
        showSnackbar('File upload failed', 'error')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      showSnackbar('Error uploading file', 'error')
    } finally {
      setUploadingFiles(prev => ({
        ...prev,
        [`${productId}_${fieldName}`]: false
      }))
    }
  }

  // Update the validateForm function to validate the charge field
  const validateForm = () => {
    const errors = {}
    let isValid = true
    const errorMessages = []

    // Get the single selected product
    const selectedProductId = Object.keys(formVisibility).find(productId => formVisibility[productId])

    if (!selectedProductId) {
      errorMessages.push('Please select a product to proceed')
      isValid = false
      setFieldErrors(errors)
      if (errorMessages.length > 0) {
        setSnackbar({ open: true, message: errorMessages[0], severity: 'error' })
      }
      return isValid
    }

    // Find the product to access its field definitions
    const product = partnerProducts[0]?.productForm?.find(p => p._id === selectedProductId)
    if (!product) {
      errorMessages.push('Selected product not found')
      isValid = false
      setFieldErrors(errors)
      if (errorMessages.length > 0) {
        setSnackbar({ open: true, message: errorMessages[0], severity: 'error' })
      }
      return isValid
    }

    // Check if product exists in productFields
    if (!productFields[selectedProductId]) {
      errors[`${selectedProductId}_general`] = 'Product data is missing'
      errorMessages.push(`${product.productName}: Product data is missing`)
      isValid = false
      setFieldErrors(errors)
      if (errorMessages.length > 0) {
        setSnackbar({ open: true, message: errorMessages[0], severity: 'error' })
      }
      return isValid
    }

    const fields = productFields[selectedProductId] || {}

    // // Validate charge field (required for all products)
    // if (!fields.charge || fields.charge <= 0) {
    //   errors[`${selectedProductId}_charge`] = "Charge is required and must be greater than 0"
    //   errorMessages.push(`${product.productName}: Charge is required and must be greater than 0`)
    //   isValid = false
    // }

    // Validate each custom field based on the product's submitFields
    product?.submitFields?.fields?.forEach(field => {
      const fieldValue = fields[field.fieldName]

      // Only validate fields with dataType "string" (required fields)
      if (field.dataType === 'string') {
        if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
          errors[`${selectedProductId}_${field.fieldName}`] = `${field.fieldName} is required`
          errorMessages.push(`${product.productName}: ${field.fieldName} is required`)
          isValid = false
        }
      }
    })

    // Set field errors to update UI
    setFieldErrors(errors)

    // Show validation errors in snackbar if any
    if (errorMessages.length > 0) {
      setSnackbar({ open: true, message: errorMessages[0], severity: 'error' })
    }

    return isValid
  }

  const handleFormSubmit = async e => {
    e.preventDefault()

    // Run validation first
    const isValid = validateForm()
    if (!isValid) return

    // Get the single selected product (since only one can be open at a time)
    const selectedProductId = Object.keys(formVisibility).find(productId => formVisibility[productId])

    if (!selectedProductId) {
      setSnackbar({
        open: true,
        message: 'Please select a product to proceed.',
        severity: 'error'
      })
      return
    }

    // Find the selected product
    const selectedProduct = partnerProducts[0]?.productForm?.find(p => p._id === selectedProductId)
    const fields = productFields[selectedProductId] || {}

    if (!selectedProduct) {
      setSnackbar({
        open: true,
        message: 'Selected product not found.',
        severity: 'error'
      })
      return
    }

    // Structure submitFields according to the required format
    const submitFields =
      selectedProduct?.submitFields?.fields?.map(field => ({
        fieldName: field.fieldName,
        dataType: field.dataType,
        value: fields[field.fieldName] || ''
      })) || []

    // Create the payload with the correct structure
    const payload = {
      reportType: selectedProduct.userProductId, // userProductId
      id: initId, // initId
      workStatus: 'completed',
      submitFields: submitFields,
      charge: selectedProduct?.charge || 0 // Add charge field
    }

    console.log('Properly structured payload:', payload)

    try {
      const data = await updateAddCasesApi(payload)
      console.log('submit response', data)

      if (data.status) {
        setSnackbar({ open: true, message: 'Case successfully submitted', severity: 'success' })
        handleCloseAddModal()
        fetchAddCases() // Refresh case list after submission
      } else {
        setSnackbar({ open: true, message: data.message || 'Failed to submit case', severity: 'error' })
      }
    } catch (error) {
      console.error('Error submitting case:', error)
      setSnackbar({ open: true, message: 'Failed to submit case', severity: 'error' })
    }
  }

  const resetForm = () => {
    setFormVisibility({})
    setProductFields({})
    setFieldErrors({})
    setAiResponseData({})
    setAiButtonVisible({})
    setAiProcessing({})
    setUploadingFiles({})
    setPId(null)
    setServiceId(null)
    setServiceName('')
    setRequestId(null)
    setPartnerProducts([])
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1)
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message: message,
      severity: severity
    })
  }

  const handleCustomCsvExport = () => {
    try {
      // Get all visible columns
      const visibleColumns = columns.filter(col => col.field !== 'action') // Exclude action column

      // Create CSV headers
      const headers = visibleColumns.map(col => col.headerName || col.field)

      // Create CSV data
      const csvData = rows.map(row => {
        return visibleColumns.map(col => {
          if (col.field.startsWith('initField_')) {
            // Handle dynamic fields
            const index = parseInt(col.field.split('_')[1])
            return row.initFields?.[index]?.value || 'N/A'
          } else {
            // Handle static fields
            return row[col.field] || 'N/A'
          }
        })
      })

      // Combine headers and data
      const csvContent = [headers, ...csvData]

      // Convert to CSV string
      const csvString = csvContent
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n')

      // Download CSV
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `cases_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting CSV:', error)
    }
  }
  const CustomToolbar = () => {
    const theme = useTheme()

    return (
      <GridToolbarContainer
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          gap: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          display: 'flex',
          flexWrap: 'wrap'
        }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        {/* <GridToolbarExport /> */}
        {/* Optional: Add custom export button */}
        <Button
          size='small'
          variant='outlined'
          startIcon={<Icon icon='tabler:download' />}
          onClick={handleCustomCsvExport}
          sx={{ color: 'primary.main', borderColor: 'primary.main', '&:hover': { borderColor: 'primary.dark' } }}
        >
          CSV Export
        </Button>
      </GridToolbarContainer>
    )
  }

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          position='fixed'
          top={0}
          left={0}
          width={'100%'}
          height={'100%'}
          bgcolor='rgba(255, 255, 255, 0.8)'
          zIndex={1300}
          sx={{
            backdropFilter: 'blur(4px)'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2
            }}
          >
            <CircularProgress color='primary' size={60} thickness={4} sx={{ mb: 2 }} />
            <Typography variant='h6' color='primary'>
              Loading Data...
            </Typography>
          </Paper>
        </Box>
      )}

      <Box sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
        {/* Header */}

        {/* Filter Content */}
        <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
          <Grid
            container
            spacing={3}
            sx={{
              width: '100%',
              justifyContent: 'center',
              marginLeft: '0 auto',
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            {/* Partner Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
                Client
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '400px' }
                }}
              >
                <FormControl fullWidth size='small'>
                  <Select
                    value={selectedEmployee}
                    onChange={handleEmployeeSelectChange}
                    displayEmpty
                    renderValue={selected => {
                      if (selected === 'all') return 'All Clients'
                      if (selected === '') return 'All Clients'
                      const partner = partners.find(p => p._id === selected)
                      return partner?.partner?.fullName || 'Select Clients'
                    }}
                    sx={{
                      height: 42,
                      borderRadius: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.1)'
                      },
                      '& .MuiSelect-select': {
                        pl: 1.5,
                        display: 'flex',
                        alignItems: 'center'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      }
                    }}
                    startAdornment={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ml: 0.75,
                          mr: 1
                        }}
                      >
                        <Icon icon='tabler:users' color='#0082c6' fontSize='small' />
                      </Box>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, marginTop: 8 },
                        elevation: 2,
                        sx: {
                          '& .MuiMenuItem-root': {
                            py: 0.75,
                            px: 2
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value='all' sx={{ fontWeight: 500 }}>
                      All Clients
                    </MenuItem>
                    {partners.map(partner => (
                      <MenuItem key={partner._id} value={partner.partnerId}>
                        {partner.partner?.name || 'Client not available'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Service Section*/}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
                Service
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '400px' }
                }}
              >
                <FormControl fullWidth size='small'>
                  <Select
                    value={selectedService}
                    onChange={handleServiceSelectChange}
                    displayEmpty
                    renderValue={selected => {
                      if (selected === 'all') return 'All Services'
                      if (selected === '') return 'All Services'
                      const service = services.find(p => p._id === selected)
                      return service?.serviceName || 'Select Service'
                    }}
                    sx={{
                      height: 42,
                      borderRadius: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.1)'
                      },
                      '& .MuiSelect-select': {
                        pl: 1.5,
                        display: 'flex',
                        alignItems: 'center'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      }
                    }}
                    startAdornment={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ml: 0.75,
                          mr: 1
                        }}
                      >
                        <Icon icon='tabler:report' color='#0082c6' fontSize='small' />
                      </Box>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, marginTop: 8 },
                        elevation: 2,
                        sx: {
                          '& .MuiMenuItem-root': {
                            py: 0.75,
                            px: 2
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value='' sx={{ fontWeight: 500 }}>
                      All Services
                    </MenuItem>
                    {services.map(service => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.serviceName || 'Service not available'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Date Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
                Date Range
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '400px' }
                }}
              >
                <FormControl fullWidth size='small'>
                  <Select
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    displayEmpty
                    renderValue={selected => {
                      if (selected === '') return 'Select Date Range'
                      if (selected === 'today') return 'Today'
                      if (selected === 'thisWeek') return 'This Week'
                      if (selected === 'thisMonth') return 'This Month'
                      if (selected === 'custom') return 'Custom Range'
                      return selected
                    }}
                    sx={{
                      height: 42,
                      borderRadius: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.1)'
                      },
                      '& .MuiSelect-select': {
                        pl: 1.5,
                        display: 'flex',
                        alignItems: 'center'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      }
                    }}
                    startAdornment={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ml: 0.75,
                          mr: 1
                        }}
                      >
                        <Icon icon='tabler:calendar' color='#0082c6' fontSize='small' />
                      </Box>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, marginTop: 8 },
                        elevation: 2,
                        sx: {
                          '& .MuiMenuItem-root': {
                            py: 0.75,
                            px: 2
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value='today' sx={{ fontWeight: 500 }}>
                      Today
                    </MenuItem>
                    <MenuItem value='thisWeek' sx={{ fontWeight: 500 }}>
                      This Week
                    </MenuItem>
                    <MenuItem value='thisMonth' sx={{ fontWeight: 500 }}>
                      This Month
                    </MenuItem>
                    <MenuItem value='custom' sx={{ fontWeight: 500 }}>
                      Custom Range
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Custom Date Range Section - Now properly inside the Grid */}
            {dateRange === 'custom' && (
              <Grid item xs={12} sm={12} md={4}>
                <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
                  Custom Date Range
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '400px' }
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      type='date'
                      fullWidth
                      size='small'
                      placeholder='Start Date'
                      value={startDateFilter}
                      onChange={e => {
                        setStartDateFilter(e.target.value)
                        setPage(1) // Reset page when filter changes
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              ml: 0.75,
                              mr: 1
                            }}
                          >
                            <Icon icon='tabler:calendar' color='#0082c6' fontSize='small' />
                          </Box>
                        ),
                        sx: {
                          height: 42,
                          borderRadius: 1.5,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0, 0, 0, 0.1)'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          }
                        }
                      }}
                    />
                    <TextField
                      type='date'
                      fullWidth
                      size='small'
                      placeholder='End Date'
                      value={endDateFilter}
                      onChange={e => {
                        setEndDateFilter(e.target.value)
                        setPage(1) // Reset page when filter changes
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              ml: 0.75,
                              mr: 1
                            }}
                          >
                            <Icon icon='tabler:calendar' color='#0082c6' fontSize='small' />
                          </Box>
                        ),
                        sx: {
                          height: 42,
                          borderRadius: 1.5,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0, 0, 0, 0.1)'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          }
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Quick date selectors */}
          <Box
            sx={{
              mt: 3.5,
              mb: 3.5,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            <Typography variant='body2' sx={{ color: 'text.secondary', mr: 1, fontWeight: 500 }}>
              Quick filters:
            </Typography>
            <Chip
              label='Today'
              size='small'
              onClick={() => {
                const today = new Date().toISOString().split('T')[0]
                setDateRange('today')
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                bgcolor: alpha('#0082c6', 0.08),
                color: '#0082c6',
                '&:hover': { bgcolor: alpha('#0082c6', 0.15) }
              }}
            />
            <Chip
              label='This Week'
              size='small'
              onClick={() => {
                setDateRange('thisWeek')
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                bgcolor: alpha('#0082c6', 0.08),
                color: '#0082c6',
                '&:hover': { bgcolor: alpha('#0082c6', 0.15) }
              }}
            />
            <Chip
              label='This Month'
              size='small'
              onClick={() => {
                setDateRange('thisMonth')
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                bgcolor: alpha('#0082c6', 0.08),
                color: '#0082c6',
                '&:hover': { bgcolor: alpha('#0082c6', 0.15) }
              }}
            />
            <Chip
              label='Clear dates'
              size='small'
              variant='outlined'
              onClick={() => {
                setDateRange('')
                setStartDateFilter('')
                setEndDateFilter('')
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            />
          </Box>
        </Box>

        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            height: { xs: 500, md: 600 }
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={row => row._id || Math.random().toString()}
            disableSelectionOnClick={false}
            disableColumnMenu={isMobile}
            slots={{
              toolbar: CustomToolbar,
              Footer: () => (
                <TablePagination
                  component='div'
                  count={totalCount}
                  page={page - 1}
                  onPageChange={handlePageChange}
                  rowsPerPage={pageLimit}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[100, 200, 500, 1000, 2000, 5000]}
                />
              ),
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    p: 3
                  }}
                >
                  <Icon icon='tabler:database-off' fontSize={48} sx={{ color: 'text.secondary', mb: 1 }} />
                  <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
                    No Data Available
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Try adjusting your filters or date range
                  </Typography>
                </Box>
              )
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#9180ff',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '8px 8px 0 0'
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                backgroundColor: 'aliceblue'
              },
              '& .MuiDataGrid-cell': {
                fontSize: '14px',
                padding: '8px 16px'
              },
              '& .MuiDataGrid-row:nth-of-type(even)': {
                backgroundColor: alpha('#0082c6', 0.04)
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: alpha('#0082c6', 0.08),
                transition: 'background-color 0.2s ease'
              },
              '& .MuiDataGrid-row.Mui-selected': {
                backgroundColor: alpha('#0082c6', 0.12),
                '&:hover': {
                  backgroundColor: alpha('#0082c6', 0.16)
                }
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid rgba(224, 224, 224, 0.4)',
                backgroundColor: alpha('#0082c6', 0.04)
              },
              '& .MuiTablePagination-root': {
                color: '#0082c6'
              },
              '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                width: '8px',
                height: '8px'
              },
              '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                backgroundColor: alpha('#0082c6', 0.3),
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: alpha('#0082c6', 0.5)
                }
              },
              border: 'none'
            }}
          />
        </Card>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant='filled'>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Reporting