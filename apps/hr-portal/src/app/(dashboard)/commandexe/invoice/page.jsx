'use client'

import { useState, useEffect } from 'react'
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
  Divider
} from '@mui/material'
import {
  generatePDFApi,
  getAiDataAPI,
  getAllEmailtemplatesAPI,
  getAllEmployeeApi,
  getAllLocationsAPI,
  getAllPDFtemplateById,
  getAllServicesApi,
  getInvoiceDashBoardCount,
  getInvoiceDataApi,
  getMyPartnersAPI,
  sendEmailAPI,
  updateAddCasesApi,
} from '@/services/apiService'
import {
  Payment
} from '@mui/icons-material'

import CustomTextField from '@/@core/components/mui/TextField'
import Modal from '@/app/(dashboard)/commandexe/components/modal'
import Icon from '../home/DynamicIcon'

// Main component
const InvoiceDashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const [selectedEmployee, setSelectedEmployee] = useState('all') // Fixed naming
  const [partners, setPartners] = useState([])
  const [counts, setCounts] = useState({})
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('unpaid') // Fixed to single value
  const [page, setPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(100)
  const [totalCount, setTotalCount] = useState(0)
  const [rows, setRows] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false)
  const [partnerProducts, setPartnerProducts] = useState([])
  const [productFields, setProductFields] = useState({})
  const [locations, setLocations] = useState([])
  const [pId, setPId] = useState(null)
  const [services, setServices] = useState([])
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [invoiceData, setInvoiceData] = useState({
    taxper:'',
    discountper:'',
  })
  const [emailData,setEmailData] = useState({
    subject:'',
    to:'',
    tempId:'',
    initId:''
  })
  const [templates,setTemplates] = useState([])

  const handleChangeRowsPerPage = event => {
    const newPageLimit = Number.parseInt(event.target.value, 10)
    setPageLimit(newPageLimit)
    setPage(1)
  }
  
  const handleInvoiceModalOpen = () => {
    setIsInvoiceModalOpen(true)
  }
  const handleInvoiceModalClose = () => {
    setIsInvoiceModalOpen(false)
    setInvoiceData({
      taxper: '',
      discountper: ''
    })
  }
  const [emps, setEmps] = useState([])
  const [dateRange, setDateRange] = useState('')
  const [openMail,setOpenMail] = useState(false)

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
  }, [status,selectedEmployee, dateRange, startDateFilter, endDateFilter])

  const fetchPartners = async () => {
    try {
      const data = await getMyPartnersAPI()

      if (data.status) {
        setPartners(data.items)
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

      const res = await getInvoiceDashBoardCount()

      if (res && res.status) {
        setCounts({
          totalCases: res.items.totalCount || 0,
          wipCases: res.items.paidCount || 0,
          pendingCases: res.items.unpaidCount || 0
          //  totalCases: res.items.totalCases || 0,
          // pendingCases: res.items.pendingRequests || 0,
          // accepted: res.items.acceptedRequests || 0,
          // allocated: res.items.allocatedJobs || 0,
          // final: res.items.finalReviewJobs || 0
        })
      } else {
        console.error('Failed to fetch invoice dashboard counts:', res.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Error fetching invoice dashboard counts:', error)
      setSnackbar({
        open: true,
        message: 'Failed to load invoice dashboard counts',
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


      const data = await getInvoiceDataApi(statusParam, partnerParam, dateRange, startDateFilter, endDateFilter)


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
            serviceId: item.referServiceId?._id || 'N/A',
            doneBy: item.doneBy?.employeName || 'N/A',
            officeEmp: item.allocatedOfficeEmp?.employeName || 'N/A',
            createdAt: item.createdAt || 'N/A',
            customerId: item.customerId || item._id,
            requestData: item.requestData || {},
            serviceName: item.referServiceId?.serviceName || 'N/A',
            workStatus: item.workStatus || 'N/A',
            reportType: item.reportType || 'N/A',
            wordUrl: item.wordUrl || [],
            reportUrl: item.reportUrl || [],
            charge: item.charge || 0,
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
    setSelectedEmployee(selectedValue)
    setPage(1) // Reset to first page when filter changes
  }

  // Fixed status change handler
  const handleStatusChange = event => {
    const selectedValue = event.target.value
    setStatus(selectedValue)
    setPage(1) // Reset to first page when filter changes
  }

  const handleDateRangeChange = event => {
    const selectedValue = event.target.value
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

  // Stats cards data
  const stats = [
    {
      label: 'Total Cases',
      value: counts.totalCases || 0,
      icon: <Icon icon='tabler:clipboard-list' fontSize={24} />,
      textColor: '#1A237E',
      bgColor: '#E3F2FD',
      borderColor: '#90CAF9'
    },
    {
      label: 'Paid Cases',
      value: counts.wipCases || 0,
      icon: <Icon icon='tabler:check' fontSize={24} />,
      textColor: '#FF6F00',
      bgColor: '#FFF3E0',
      borderColor: '#FFCC80'
    },
    {
      label: 'Unpaid Cases',
      value: counts.pendingCases || 0,
      icon: <Icon icon='tabler:hourglass' fontSize={24} />,
      textColor: '#6A1B9A',
      bgColor: '#F3E5F5',
      borderColor: '#CE93D8'
    }
  ]

  // Function to generate dynamic columns from initFields
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
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* <Icon icon="tabler:files" fontSize="small" color="#0082c6" /> */}
            <Typography variant='body2' noWrap>
              {Array.isArray(value) ? `${value.length} file(s)` : 'N/A'}
            </Typography>
          </Box>
        )

      case 'file':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* <Icon icon="tabler:file" fontSize="small" color="#0082c6" /> */}
            <Typography variant='body2' noWrap>
              {value ? 'File uploaded' : 'N/A'}
            </Typography>
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
    {
      field: 'charge',
      headerName: 'Charge',
      minWidth: 120,
      flex: 1,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:currency-rupee' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => (
        <Tooltip title={params.row.charge || 'N/A'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`Charge: ${params.row.charge || '0'}`}>
              <Icon icon='tabler:currency-rupee' fontSize='small' />
            </Tooltip>
            <Typography variant='body2' noWrap>
              {params.row.charge || '0'}
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
    ...status === 'unpaid' ? [ {
      field: 'action',
      headerName: 'Action',
      minWidth: 150,
      flex: 0.7,
      renderHeader: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon icon='tabler:edit' fontSize='small' />
          <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Button
            size='small'
            color='primary'
            variant='contained'
            onClick={e => {
              e.stopPropagation()
              handleMarkAsPaid(params.row._id)
            }}
            startIcon={<Payment />}
          >
            {/* <Icon icon='tabler:payment' fontSize='small' /> */}
            Mark as Paid
          </Button>
          </Box>
        )
      }
    }] : [], // Only show action column for unpaid status
    // {
    // field: 'mail',
    //   headerName: 'Send Mail',
    //   minWidth: 150,
    //   flex: 0.7,
    //   renderHeader: params => (
    //     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    //       <Icon icon='tabler:mail' fontSize='small' />
    //       <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
    //     </Box>
    //   ),
    //   renderCell: params => {
    //     return (
    //       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
    //       <Button
    //         size='small'
    //         color='primary'
    //         variant='contained'
    //         onClick={e => {
    //           e.stopPropagation()
    //           handleSendMail(params.row)
    //         }}
    //       >
    //         {/* <Icon icon='tabler:payment' fontSize='small' /> */}
    //         Send Email
    //       </Button>
    //       </Box>
    //   )}}
  ]

  const handleInvoiceSubmit = async () => {
    try {
      // setIsLoading(true)
      const payload = {
        // id: invoiceData._id,
        taxper: invoiceData.taxper,
        discountper: invoiceData.discountper
      }
      // const response = await updateAddCasesApi(payload)

      if (response.status) {
        setSnackbar({
          open: true,
          message: 'Invoice updated successfully',
          severity: 'success'
        })
        handleInvoiceModalClose()
        fetchAddCases() // Refresh the data after updating
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to update invoice',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error updating invoice:', error)
      setSnackbar({
        open: true,
        message: 'Failed to update invoice',
        severity: 'error'
      })
    } finally {
      // setIsLoading(false)
    }
  }

  const handleMarkAsPaid = async (id) => {
    try {
        const payload ={
            id: id,
            paymentStatus: 'paid'
        }
        const response = await updateAddCasesApi(payload)
        if (response.status) {
            setSnackbar({
                open: true,
                message: 'Invoice marked as paid successfully',
                severity: 'success'
            })
            // fetchAddCases() // Refresh the data after marking as paid
        } else {
            setSnackbar({
                open: true,
                message: response.message || 'Failed to mark invoice as paid',
                severity: 'error'
            })
        }
    } catch (error) {
        console.error('Error marking invoice as paid:', error)
        setSnackbar({
            open: true,
            message: 'Failed to mark invoice as paid',
            severity: 'error'
        })
    }
    finally {
        setIsLoading(false)
        fetchAddCases() // Refresh the data after marking as paid
        fetchDashBoardCount()
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

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await getAllServicesApi()

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

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1)
  }

    const handleCustomCsvExport = () => {
    try {
      // Get all visible columns
      const visibleColumns = columns.filter(col => col.field !== 'action'); // Exclude action column
      
      // Create CSV headers
      const headers = visibleColumns.map(col => col.headerName || col.field);
      
      // Create CSV data
      const csvData = rows.map(row => {
        return visibleColumns.map(col => {
          if (col.field.startsWith('initField_')) {
            // Handle dynamic fields
            const index = parseInt(col.field.split('_')[1]);
            return row.initFields?.[index]?.value || "N/A";
          } else {
            // Handle static fields
            return row[col.field] || "N/A";
          }
        });
      });
      
      // Combine headers and data
      const csvContent = [headers, ...csvData];
      
      // Convert to CSV string
      const csvString = csvContent.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      
      // Download CSV
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `cases_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const CustomToolbar = () => {
    const theme = useTheme()
  
    return (
      <GridToolbarContainer
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          gap: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    )
  }

   // Handler for selection change
  const handleSelectionModelChange = newSelection => {
    setSelectedRowIds(newSelection)
// Optional: for debugging
  }

const handleSendMail = (data) => {
  setOpenMail(true);
  setEmailData(prevEmailData => ({
    ...prevEmailData, 
    initId: data._id
  }));
}

const closeEmailModal = () => {
  setOpenMail(false)
  setEmailData({
    subject:'',
    to:'',
    tempId:'',
    initId:''
  })
}

const validate = () => {
    const errs = {};
    if (!emailData.subject) errs.subject = 'Subject is required';
    if (!emailData.to) {
    errs.to = 'Recipient email is required';
    } else if (!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(emailData.to)) {
    errs.to = 'Enter a valid email address';
    }
    if (!emailData.tempId) errs.tempId = 'Please select a template';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

const handleSubmitEmail = async () => {
if (!validate()) return;
try {
  const res = await sendEmailAPI(emailData);
  
  if (res?.status) {
    setSnackbar({
      open: true,
      message: res.message || 'Email sent successfully',
      severity: 'success',
    });
    setEmailData({ subject: '', to: '', tempId: '' });
    setErrors({});
  } else {
    setSnackbar({
      open: true,
      message: res.message || 'Failed to send email',
      severity: 'error',
    });
  }
} catch (error) {
  console.error('Send email error:', error);
  setSnackbar({
    open: true,
    message: 'Something went wrong. Please try again.',
    severity: 'error',
  });
}
};

    useEffect(() => {
      fetchVariables()
    }, [])
  
    const fetchVariables = async () => {
      try {
        const res = await getAllEmailtemplatesAPI()
  
  
        if (res && res.items) {
          setTemplates(res.items)
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
      }
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
        <Card
          elevation={3}
          sx={{
            width: '100%',
            background: 'linear-gradient(135deg, #9180ff, rgb(63, 194, 255))',
            borderRadius: 2,
            padding: { xs: '16px 12px', sm: '20px 16px' },
            boxShadow: '0 4px 20px rgba(0, 130, 198, 0.25)',
            mb: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              opacity: 0.1,
              backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 3px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Title */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'space-between' },
              width: '100%',
              gap: 2
            }}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textAlign: { xs: 'center', md: 'left' },
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.5px',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              INVOICE DASHBOARD
            </Typography>
          </Box>
        </Card>

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
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
                Status
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
                    value={status}
                    onChange={handleStatusChange}
                    displayEmpty
                    renderValue={selected => {
                      if (selected === 'unpaid') return 'Unpaid Invoices'
                      if (selected === 'paid') return 'Paid Invoices'
                        if (selected === '') return 'Select Status'
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
                    <MenuItem value='unpaid' sx={{ fontWeight: 500 }}>
                      Unpaid Invoices
                    </MenuItem>
                    <MenuItem value='paid' sx={{ fontWeight: 500 }}>
                      Paid Invoices
                    </MenuItem>
                    
                  </Select>
                </FormControl>
              </Box>
            </Grid>

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
                      const partner = partners.find(p => p.partnerId === selected)
                      return partner?.partner?.name || 'Select Clients'
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

        {/* Stats Section */}
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            p: 3,
            gap: 3,
            flexWrap: 'nowrap'
          }}
        >
          {stats.map((stat, index) => (
            <Box key={index} sx={{ flex: 1 }}>
              <Card
                elevation={0}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: { xs: 1, sm: 1.5, md: 2 },
                  borderRadius: { xs: 1, sm: 2 },
                  backgroundColor: stat.bgColor,
                  border: `1px solid ${stat.borderColor}`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  width: '100%',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                  }
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: alpha(stat.textColor, 0.2),
                    color: stat.textColor,
                    width: { xs: 36, sm: 42, md: 48 },
                    height: { xs: 36, sm: 42, md: 48 },
                    mr: { xs: 1.5, sm: 2 },
                    flexShrink: 0
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 'bold',
                      color: stat.textColor,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                    noWrap
                  >
                    {stat.label || 'Stats'}
                  </Typography>
                  <Typography
                    variant='h5'
                    sx={{
                      color: stat.textColor,
                      fontWeight: 600,
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                    }}
                    noWrap
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Data Grid Section */}
        <Card
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontWeight: 600,
              color: '#0082c6',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Icon icon='tabler:report' fontSize='1.25rem' />
            Reporting ({rows.length} records)
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* <TextField
              placeholder='Search cases...'
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='tabler:search' />
                  </InputAdornment>
                ),
                sx: { borderRadius: '8px' }
              }}
              sx={{ width: { xs: '100%', sm: 200 } }}
            /> */}
            { selectedRowIds.length > 0 && (
              <Button
                variant='outlined'
                startIcon={<Icon icon='tabler:invoice' />}
                onClick={handleInvoiceModalOpen}
                sx={{
                  whiteSpace: 'nowrap',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.12)'
                  }
                }}
              >
                Raise Invoice
              </Button>
            )}
            <Button
              variant='contained'
              startIcon={<Icon icon='tabler:download' />}
              onClick={handleCustomCsvExport}
              sx={{
                whiteSpace: 'nowrap',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.12)'
                }
              }}
            >
              {isMobile ? '' : 'Export'}
            </Button>
          </Box>
        </Card>

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
            checkboxSelection={selectedEmployee !== 'all'}
            rowSelectionModel={selectedRowIds}
            onRowSelectionModelChange={handleSelectionModelChange}
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

      {/* Invoice Raise Modal */}
      <Modal
        open={isInvoiceModalOpen}
        handleClose={handleInvoiceModalClose}
        handleSubmit={handleInvoiceSubmit}
        maxWidth='sm'
      >
        <Box sx={{ p: 3 }}>
          <Typography variant='h6'>Raise Invoice</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Tax %'
                  placeholder='Enter tax percentage'
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  value={invoiceData.taxper || ''}
                  onChange={e => setInvoiceData({ ...invoiceData, taxper: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Discount %'
                  placeholder='Enter discount percentage'
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  value={invoiceData.discountper || ''}
                  onChange={e => setInvoiceData({...invoiceData, discountper:e.target.value})}
                />
              </Grid>
            </Grid>
        </Box>
      </Modal>

      <Modal
        open={openMail}
        handleClose={closeEmailModal}
        handleSubmit={handleSubmitEmail}
        saveButtonText='Send'
        maxWidth='sm'
      >
        <Box sx={{ p: 3 }}>
          <Typography variant='h6'>Send EMail</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Subject'
                  placeholder='Enter Subject'
                  fullWidth
                  margin='normal'
                  value={emailData.subject || ''}
                  onChange={e => setEmailData({ ...emailData, subject: e.target.value })}
                   error={!!errors.subject}
                  helperText={errors.subject}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Sending To'
                  placeholder='Enter Receivers email...'
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  value={emailData.to || ''}
                  onChange={e => setEmailData({...emailData, to:e.target.value})}
                  error={!!errors.to}
                  helperText={errors.to}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Select Email Template'
                  select
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  value={emailData.tempId || ''}
                  onChange={e => setEmailData({...emailData, tempId:e.target.value})}
                >
                  {templates.map ((temp)=>(
                    <MenuItem key={temp._id} value={temp._id}>
                      {temp?.templateName}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
            </Grid>
        </Box>
      </Modal>

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

export default InvoiceDashboard;