// 'use client'

// import React, { useState, useEffect } from 'react'
// import {
//   DataGrid,
//   GridToolbarContainer,
//   GridToolbarColumnsButton,
//   GridToolbarFilterButton,
//   GridToolbarDensitySelector
// } from '@mui/x-data-grid'
// import {
//   Avatar,
//   Box,
//   Typography,
//   Grid,
//   CardContent,
//   FormControl,
//   Select,
//   MenuItem,
//   Button,
//   TextField,
//   Paper,
//   TablePagination,
//   CircularProgress,
//   useMediaQuery,
//   Chip,
//   Tooltip,
//   useTheme,
//   alpha,
//   Card,
//   Snackbar,
//   Alert,
//   IconButton,
//   Stack,
//   Switch,
//   LinearProgress,
//   Divider,
//   DialogContent,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   Dialog,
//   DialogTitle,
//   DialogActions
// } from '@mui/material'
// import Icon from '../../home/DynamicIcon'
// import {
//   generatePDFApi,
//   getAiDataAPI,
//   getAllEmployeeApi,
//   getAllLocationsAPI,
//   getAllPDFtemplateById,
//   getAllServicesApi,
//   getAllUnfilteredInitCasesApi,
//   getInitDashBoardCount,
//   getMyPartnersAPI,
//   getpartnerproduct,
//   updateAddCasesApi,
//   uploadImageApi,
//   uploadMultiImageApi
// } from '@/services/apiService'
// import {
//   Person2Rounded,
//   InsertDriveFileOutlined,
//   CloudUploadOutlined,
//   DeleteOutlined,
//   AutoAwesomeOutlined,
//   Settings,
//   CheckCircleOutlined,
//   ImageOutlined,
//   DescriptionOutlined
// } from '@mui/icons-material'

// import CustomTextField from '@/@core/components/mui/TextField'
// import Modal from '@/app/(dashboard)/commandexe/components/modal'

// import { LocalizationProvider } from '@mui/lab'
// import AdapterDateFns from '@mui/lab/AdapterDateFns'
// import DatePicker from '@mui/lab/DatePicker'

// const getFileNameFromUrl = url => {
//   try {
//     const urlParts = url.split('/')
//     const lastPart = urlParts[urlParts.length - 1]
//     // Remove timestamp prefix if present (like "1748695223694_")
//     const cleanName = lastPart.replace(/^\d+_/, '')
//     return cleanName || 'Unknown File'
//   } catch (error) {
//     return 'Unknown File'
//   }
// }

// const MultiUploadComponent = ({ value }) => {
//   const [dialogOpen, setDialogOpen] = useState(false)

//   const handleOpenDialog = e => {
//     e.stopPropagation()
//     setDialogOpen(true)
//   }

//   const handleCloseDialog = () => {
//     setDialogOpen(false)
//   }

//   const handleViewFile = (url, e) => {
//     e.stopPropagation()
//     window.open(url, '_blank')
//   }

//   const fileCount = Array.isArray(value) ? value.length : 0

//   return (
//     <>
//       {/* Main display component */}
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//         <Typography variant='body2'>{fileCount > 0 ? `${fileCount} file(s)` : '0 files'}</Typography>
//         {fileCount > 0 && (
//           <IconButton size='small' onClick={handleOpenDialog} sx={{ p: 0.25 }} title='View all files'>
//             <Icon icon='tabler:eye' fontSize='small' color='#0082c6' />
//           </IconButton>
//         )}
//       </Box>

//       {/* Dialog for displaying files */}
//       <Dialog
//         open={dialogOpen}
//         onClose={handleCloseDialog}
//         maxWidth='sm'
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 2
//           }
//         }}
//       >
//         <DialogTitle sx={{ pb: 1 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Icon icon='tabler:files' fontSize='medium' color='#0082c6' />
//             <Typography variant='h6'>Uploaded Files ({fileCount})</Typography>
//           </Box>
//         </DialogTitle>

//         <DialogContent sx={{ px: 0, py: 1 }}>
//           <List sx={{ width: '100%' }}>
//             {Array.isArray(value) &&
//               value.map((url, index) => (
//                 <React.Fragment key={index}>
//                   <ListItem sx={{ px: 3, py: 1.5 }}>
//                     <ListItemText
//                       primary={
//                         <Typography variant='body1' sx={{ fontWeight: 500 }}>
//                           {getFileNameFromUrl(url)}
//                         </Typography>
//                       }
//                       secondary={
//                         <Typography variant='caption' color='text.secondary'>
//                           Click view to open in new tab
//                         </Typography>
//                       }
//                     />
//                     <ListItemSecondaryAction>
//                       <IconButton
//                         edge='end'
//                         onClick={e => handleViewFile(url, e)}
//                         size='small'
//                         sx={{
//                           bgcolor: 'primary.main',
//                           color: 'white',
//                           '&:hover': {
//                             bgcolor: 'primary.dark'
//                           },
//                           borderRadius: 1,
//                           px: 1.5,
//                           py: 0.5
//                         }}
//                       >
//                         <Icon icon='tabler:external-link' fontSize='small' />
//                         <Typography variant='caption' sx={{ ml: 0.5 }}>
//                           View
//                         </Typography>
//                       </IconButton>
//                     </ListItemSecondaryAction>
//                   </ListItem>
//                   {index < value.length - 1 && <Divider />}
//                 </React.Fragment>
//               ))}
//           </List>
//         </DialogContent>

//         <DialogActions sx={{ px: 3, pb: 2 }}>
//           <Button onClick={handleCloseDialog} variant='outlined' startIcon={<Icon icon='tabler:x' />}>
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   )
// }

// // Main component
// const InitDashboard = ({ title = 'BACKOFFICE DASHBOARD' }) => {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'))

//   const [selectedEmployee, setSelectedEmployee] = useState('all') // Fixed naming
//   const [partners, setPartners] = useState([])
//   const [counts, setCounts] = useState({})
//   const [startDateFilter, setStartDateFilter] = useState('')
//   const [endDateFilter, setEndDateFilter] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [status, setStatus] = useState('all') // Fixed to single value
//   const [page, setPage] = useState(1)
//   const [pageLimit, setPageLimit] = useState(100)
//   const [totalCount, setTotalCount] = useState(0)
//   const [rows, setRows] = useState([])
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   })

//   const [selectedService, setSelectedService] = useState('')

//   const [loading, setLoading] = useState(false)
//   const [openAddModal, setOpenAddModal] = useState(false)
//   const [partnerName, setPartnerName] = useState(null)
//   const [serviceId, setServiceId] = useState(null)
//   const [serviceName, setServiceName] = useState(null)
//   const [requestId, setRequestId] = useState(null)
//   const [initId, setInitId] = useState(null)
//   const [partnerProducts, setPartnerProducts] = useState([])
//   const [formVisibility, setFormVisibility] = useState({})
//   const [productFields, setProductFields] = useState({})
//   const [uploadingFiles, setUploadingFiles] = useState({})
//   const [fieldErrors, setFieldErrors] = useState({})
//   const [aiProcessing, setAiProcessing] = useState({})
//   const [locations, setLocations] = useState([])
//   const [pId, setPId] = useState(null)
//   const [services, setServices] = useState([])
//   const [aiResponseData, setAiResponseData] = useState({})

//   const [templates, setTemplates] = useState([])
//   const [selectedTemplate, setSelectedTemplate] = useState('')
//   const [reportOpen, setReportOpen] = useState(false)
//   const [selectedReport, setSelectedReport] = useState(null)
//   const [isGenerating, setIsGenerating] = useState(false)

//   const handleOpenReportModal = row => {
//     setReportOpen(true)
//     setSelectedReport(row._id)
//     fetchTemplates(row.reportType._id)
//   }

//   const handleCloseReportModal = () => {
//     setReportOpen(false)
//     setSelectedReport(null)
//   }

//   const fetchTemplates = async productId => {
//     console.log('Fetching templates for productId:', productId)

//     try {
//       const response = await getAllPDFtemplateById(productId)

//       console.log('Templates:', response)

//       if (response.status) {
//         setTemplates(response.items)
//       }
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const generatePDF = async event => {
//     event.preventDefault()
//     try {
//       setIsGenerating(true)
//       const payload = {
//         tempId: selectedTemplate,
//         initId: selectedReport
//       }

//       const response = await generatePDFApi(payload)
//       console.log('PDF generation response:', response)
//       if (response.status) {
//         setSnackbar({
//           open: true,
//           message: 'PDF generated successfully!',
//           severity: 'success'
//         })
//       }
//       // Open the generated PDF in a new tab
//       else {
//         setSnackbar({
//           open: true,
//           message: 'Failed to generate PDF',
//           severity: 'error'
//         })
//       }
//     } catch (error) {
//       console.error(error)
//       setSnackbar({
//         open: true,
//         message: 'Error generating PDF',
//         severity: 'error'
//       })
//     } finally {
//       setIsGenerating(false)
//       handleCloseReportModal()
//       fetchAddCases()
//     }
//   }

//   const handleChangeRowsPerPage = event => {
//     const newPageLimit = Number.parseInt(event.target.value, 10)
//     setPageLimit(newPageLimit)
//     setPage(1)
//   }

//   const [emps, setEmps] = useState([])
//   const [dateRange, setDateRange] = useState('')

//   const fetchEmps = async () => {
//     try {
//       const data = await getAllEmployeeApi()
//       if (data.status && Array.isArray(data.items)) {
//         setEmps(data.items)
//       } else {
//         setEmps([])
//       }
//     } catch (err) {
//       console.error(err)
//       setEmps([])
//     }
//   }

//   useEffect(() => {
//     fetchDashBoardCount()
//     fetchPartners()
//     fetchEmps()
//   }, [])

//   // Fixed useEffect for fetching cases with proper dependencies
//   useEffect(() => {
//     fetchAddCases()
//   }, [selectedService, selectedEmployee, dateRange, startDateFilter, endDateFilter])

//   const fetchPartners = async () => {
//     try {
//       const data = await getMyPartnersAPI()

//       if (data.status) {
//         setPartners(data.items)
//         console.log('partners', data.items)
//       } else {
//         console.error('Failed to fetch partners:', data)
//       }
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const fetchDashBoardCount = async () => {
//     try {
//       setIsLoading(true)

//       const res = await getInitDashBoardCount()
//       console.log('Dashboard counts response:', res)

//       if (res && res.status) {
//         setCounts({
//           totalCases: res.items.all || 0,
//           wipCases: res.items.wip || 0,
//           pendingCases: res.items.pending || 0,
//           generatedCases: res.items.generated || 0
//           //  totalCases: res.items.totalCases || 0,
//           // pendingCases: res.items.pendingRequests || 0,
//           // accepted: res.items.acceptedRequests || 0,
//           // allocated: res.items.allocatedJobs || 0,
//           // final: res.items.finalReviewJobs || 0
//         })
//       } else {
//         console.error('Failed to fetch dashboard counts:', res.message || 'Unknown error')
//       }
//     } catch (error) {
//       console.error('Error fetching dashboard counts:', error)
//       setSnackbar({
//         open: true,
//         message: 'Failed to load dashboard counts',
//         severity: 'error'
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Fixed fetchAddCases function with proper parameter handling
//   const fetchAddCases = async () => {
//     try {
//       setIsLoading(true)

//       // Prepare filter parameters
//       const statusParam = status === 'all' ? 'all' : status
//       const partnerParam = selectedEmployee === 'all' ? '' : selectedEmployee

//       console.log('Fetching cases with filters:', {
//         status: statusParam,
//         partner: partnerParam,
//         range: dateRange,
//         startDate: startDateFilter,
//         endDate: endDateFilter
//       })

//       const data = await getAllUnfilteredInitCasesApi(
//         selectedService,
//         partnerParam,
//         dateRange,
//         startDateFilter,
//         endDateFilter
//       )

//       console.log('All INIT cases data:', data)

//       if (data?.items) {
//         setRows(
//           data.items.map(item => ({
//             _id: item._id,
//             fileNo: item.fileNo,
//             partnerName: item.partnerId?.name || 'N/A',
//             partnerId: item.partnerId?._id || 'N/A',
//             pId: item.partnerId?._id || 'N/A',
//             customerName: item.customerName,
//             fatherName: item.fatherName,
//             contactNo: item.contactNo,
//             address: item.address,
//             initFields: item.initFields || [],
//             serviceId: item.referServiceId._id || 'N/A',
//             doneBy: item.doneBy?.employeName || 'N/A',
//             officeEmp: item.allocatedOfficeEmp?.employeName || 'N/A',
//             createdAt: item.createdAt || 'N/A',
//             customerId: item.customerId || item._id,
//             requestData: item.requestData || {},
//             serviceName: item.referServiceId.serviceName || 'N/A',
//             workStatus: item.workStatus || 'N/A',
//             reportType: item.reportType || 'N/A',
//             wordUrl: item.wordUrl || [],
//             reportUrl: item.reportUrl || [],
//             reportStatus: item.reportStatus || 'N/A',
//             reportDate: item.reportDate || 'N/A',
//             reportTAT: item.reportTAT || '0',
//             edit: true,
//             delete: false,
//             view: false
//           }))
//         )
//         setTotalCount(data.totalCount || data.items.length)
//       } else {
//         console.error('Failed to fetch cases:', data?.message)
//         setRows([])
//       }
//     } catch (err) {
//       console.error('Error fetching cases:', err)
//       setSnackbar({
//         open: true,
//         message: 'Failed to load cases data',
//         severity: 'error'
//       })
//     } finally {
//       setIsLoading(false)
//       fetchDashBoardCount()
//     }
//   }

//   // Close snackbar
//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false })
//   }

//   // Fixed employee selection handler
//   const handleEmployeeSelectChange = event => {
//     const selectedValue = event.target.value
//     console.log('Employee selection changed:', selectedValue)
//     setSelectedEmployee(selectedValue)
//     setPage(1) // Reset to first page when filter changes
//   }

//   const handleServiceSelectChange = event => {
//     const selectedValue = event.target.value
//     console.log('Service selection changed:', selectedValue)
//     setSelectedService(selectedValue)
//     setPage(1) // Reset to first page when filter changes
//   }

//   // Fixed status change handler
//   const handleStatusChange = event => {
//     const selectedValue = event.target.value
//     console.log('Status change event:', selectedValue)
//     setStatus(selectedValue)
//     setPage(1) // Reset to first page when filter changes
//   }

//   const handleDateRangeChange = event => {
//     const selectedValue = event.target.value
//     console.log('Date range change event:', selectedValue)
//     setDateRange(selectedValue)
//     setPage(1) // Reset to first page when filter changes
//   }

//   // Function to generate string-based colors
//   const stringToColor = string => {
//     if (!string) return '#1976d2'

//     let hash = 0
//     for (let i = 0; i < string.length; i++) {
//       hash = string.charCodeAt(i) + ((hash << 5) - hash)
//     }

//     let color = '#'
//     for (let i = 0; i < 3; i++) {
//       const value = (hash >> (i * 8)) & 0xff
//       color += `00${value.toString(16)}`.slice(-2)
//     }

//     return color
//   }

//   // Stats cards data
//   const stats = [
//     {
//       label: 'Total Cases',
//       value: counts.totalCases || 0,
//       icon: <Icon icon='tabler:clipboard-list' fontSize={24} />,
//       textColor: '#1A237E',
//       bgColor: '#E3F2FD',
//       borderColor: '#90CAF9'
//     },
//     {
//       label: 'Pending cases',
//       value: counts.pendingCases || 0,
//       icon: <Icon icon='tabler:hourglass' fontSize={24} />,
//       textColor: '#6A1B9A',
//       bgColor: '#F3E5F5',
//       borderColor: '#CE93D8'
//     },
//     {
//       label: 'WiP Cases',
//       value: counts.wipCases || 0,
//       icon: <Icon icon='tabler:hourglass' fontSize={24} />,
//       textColor: '#FF6F00',
//       bgColor: '#FFF3E0',
//       borderColor: '#FFCC80'
//     },
//     {
//       label: 'Generated Cases',
//       value: counts.generatedCases || 0,
//       icon: <Icon icon='tabler:file-check' fontSize={24} />,
//       textColor: '#1B5E20',
//       bgColor: '#E8F5E9',
//       borderColor: '#A5D6A7'
//     }
//   ]

//   const generateDynamicColumns = sampleRow => {
//     if (!sampleRow?.initFields || !Array.isArray(sampleRow.initFields)) {
//       return []
//     }

//     return sampleRow.initFields.map((field, index) => ({
//       field: `initField_${index}`, // Unique field identifier
//       headerName: `${field.fieldName.replace(/_/g, ' ')}`,
//       minWidth: 150,
//       flex: 1,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon={getIconForDataType(field.dataType)} fontSize='small' />
//           <Typography variant='subtitle2'>{field.fieldName.replace(/_/g, ' ')}</Typography>
//         </Box>
//       ),
//       renderCell: params => {
//         const fieldValue = params.row.initFields?.[index]?.value
//         return (
//           <Tooltip title={formatFieldValue(fieldValue, field.dataType) || 'N/A'}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
//               <Icon icon={getIconForDataType(field.dataType)} fontSize='small' color='#0082c6' />
//               <Typography variant='body2' noWrap sx={{ flex: 1 }}>
//                 {renderFieldValue(fieldValue, field.dataType)}
//               </Typography>
//             </Box>
//           </Tooltip>
//         )
//       }
//     }))
//   }

//   // Helper function to get appropriate icon based on data type
//   const getIconForDataType = dataType => {
//     switch (dataType) {
//       case 'string':
//         return 'tabler:user-circle'
//       case 'file':
//         return 'tabler:file'
//       case 'multiUpload':
//         return 'tabler:files'
//       case 'textarea':
//         return 'tabler:info-circle'
//       default:
//         return 'tabler:info-circle'
//     }
//   }

//   // Helper function to format field values for display
//   const formatFieldValue = (value, dataType) => {
//     if (!value || (Array.isArray(value) && value.length === 0)) {
//       return 'N/A'
//     }

//     switch (dataType) {
//       case 'multiUpload':
//         return Array.isArray(value) ? `${value.length} file(s)` : 'N/A'
//       case 'file':
//         return value ? 'File uploaded' : 'N/A'
//       case 'textarea':
//       case 'string':
//       default:
//         return String(value)
//     }
//   }
//   // Helper function to extract filename from URL
//   const getFileNameFromUrl = url => {
//     try {
//       const urlParts = url.split('/')
//       const lastPart = urlParts[urlParts.length - 1]
//       // Remove timestamp prefix if present (like "1748695223694_")
//       const cleanName = lastPart.replace(/^\d+_/, '')
//       return cleanName || 'Unknown File'
//     } catch (error) {
//       return 'Unknown File'
//     }
//   }

//   // Helper function to handle file download/open
//   const handleDownload = (url, fileName) => {
//     // Simply open in new tab - most reliable approach
//     window.open(url, '_blank')
//   }

//   // Helper function to open multiple files
//   const handleMultipleDownload = urls => {
//     // Open all URLs immediately in the same click event to avoid popup blocker
//     urls.forEach(url => {
//       window.open(url, '_blank')
//     })
//   }

//   // Helper function to render field values with appropriate styling
//   const renderFieldValue = (value, dataType) => {
//     if (!value || (Array.isArray(value) && value.length === 0)) {
//       return (
//         <Typography variant='body2' color='text.secondary' noWrap>
//           N/A
//         </Typography>
//       )
//     }

//     switch (dataType) {
//       case 'multiUpload':
//         return <MultiUploadComponent value={value} />

//       case 'file':
//         if (!value || (Array.isArray(value) && value.length === 0)) {
//           return (
//             <Typography variant='body2' color='textSecondary'>
//               No file
//             </Typography>
//           )
//         }

//         const fileUrl = Array.isArray(value) ? value[0] : value
//         const fileName = getFileNameFromUrl(fileUrl)

//         return (
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             {/* <Icon icon="tabler:file" fontSize="small" color="#0082c6" /> */}
//             <Typography
//               variant='body2'
//               sx={{
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 whiteSpace: 'nowrap',
//                 maxWidth: '150px'
//               }}
//               title={fileName}
//             >
//               {fileName}
//             </Typography>
//             <IconButton
//               size='small'
//               onClick={e => {
//                 e.stopPropagation()
//                 handleDownload(fileUrl, fileName)
//               }}
//               sx={{ p: 0.25 }}
//               title='Download file'
//             >
//               <Icon icon='tabler:download' fontSize='small' color='#0082c6' />
//             </IconButton>
//           </Box>
//         )
//       case 'textarea':
//         return (
//           <Typography
//             variant='body2'
//             noWrap
//             sx={{
//               maxWidth: '100%',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis'
//             }}
//           >
//             {String(value)}
//           </Typography>
//         )

//       case 'string':
//       default:
//         return (
//           <Typography variant='body2' noWrap>
//             {String(value)}
//           </Typography>
//         )
//     }
//   }

//   // DataGrid columns
//   const columns = [
//     {
//       field: 'partnerName',
//       headerName: 'Client Name',
//       minWidth: 180,
//       flex: 1,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:user-circle' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => (
//         <Tooltip title={params.row.partnerName || 'N/A'}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Avatar
//               sx={{
//                 width: 28,
//                 height: 28,
//                 fontSize: '0.875rem',
//                 bgcolor: stringToColor(params.row.partnerName || '')
//               }}
//             >
//               {params.row.partnerName ? params.row.partnerName.charAt(0).toUpperCase() : '?'}
//             </Avatar>
//             <Typography variant='body2' noWrap>
//               {params.row.partnerName || 'N/A'}
//             </Typography>
//           </Box>
//         </Tooltip>
//       )
//     },
//     {
//       field: 'serviceName',
//       headerName: 'Service Name',
//       minWidth: 180,
//       flex: 1,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:file' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => (
//         <Tooltip title={params.row.serviceName || 'N/A'}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Avatar
//               sx={{
//                 width: 28,
//                 height: 28,
//                 fontSize: '0.875rem',
//                 bgcolor: stringToColor(params.row.serviceName || '')
//               }}
//             >
//               {params.row.serviceName ? params.row.serviceName.charAt(0).toUpperCase() : '?'}
//             </Avatar>
//             <Typography variant='body2' noWrap>
//               {params.row.serviceName || 'N/A'}
//             </Typography>
//           </Box>
//         </Tooltip>
//       )
//     },
//     ...(rows.length > 0 ? generateDynamicColumns(rows[0]) : []),
//     {
//       field: 'createdAt',
//       headerName: 'Initiation Date',
//       minWidth: 130,
//       flex: 0.8,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:calendar-check' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => {
//         const dateStr = params.row.createdAt || ''
//         let formattedDate = 'N/A'
//         if (dateStr) {
//           try {
//             const date = new Date(dateStr.replace(/ (AM|PM)$/, ''))
//             formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString('en-GB') : 'Invalid Date'
//           } catch (e) {
//             formattedDate = 'Invalid Date'
//           }
//         }
//         return (
//           <Tooltip title={formattedDate}>
//             <Typography variant='body2' noWrap>
//               {formattedDate}
//             </Typography>
//           </Tooltip>
//         )
//       }
//     },
//     {
//       field: 'doneBy',
//       headerName: 'Cases Added By',
//       minWidth: 150,
//       flex: 1,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:user-check' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => (
//         <Tooltip title={params.row.doneBy || 'N/A'}>
//           <Typography variant='body2' noWrap>
//             {params.row.doneBy || 'N/A'}
//           </Typography>
//         </Tooltip>
//       )
//     },
//     {
//       field: 'officeEmp',
//       headerName: 'Allocated To',
//       minWidth: 150,
//       flex: 1,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:user-check' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => (
//         <Tooltip title={params.row.officeEmp || 'N/A'}>
//           <Typography variant='body2' noWrap>
//             {params.row.officeEmp || 'N/A'}
//           </Typography>
//         </Tooltip>
//       )
//     },
//     {
//       field: 'reportStatus',
//       headerName: 'Report Status',
//       minWidth: 150,
//       flex: 1,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:file' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => (
//         <Tooltip title={params.row.reportStatus || 'N/A'}>
//           <Typography variant='body2' noWrap>
//             {params.row.reportStatus || 'N/A'}
//           </Typography>
//         </Tooltip>
//       )
//     },
//     {
//       field: 'reportDate',
//       headerName: 'Report Date',
//       minWidth: 130,
//       flex: 0.8,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:calendar-check' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => {
//         const dateStr = params.row.reportDate || ''
//         let formattedDate = 'N/A'
//         if (dateStr) {
//           try {
//             const date = new Date(dateStr.replace(/ (AM|PM)$/, ''))
//             formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString('en-GB') : 'N/A'
//           } catch (e) {
//             formattedDate = 'N/A'
//           }
//         }
//         return (
//           <Tooltip title={formattedDate}>
//             <Typography variant='body2' noWrap>
//               {formattedDate}
//             </Typography>
//           </Tooltip>
//         )
//       }
//     },
//     {
//       field: 'reportTAT',
//       headerName: 'Report TAT',
//       minWidth: 150,
//       flex: 1,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:file' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => (
//         <Tooltip title={params.row.reportTAT || 'N/A'}>
//           <Typography variant='body2' noWrap>
//             {params.row.reportTAT || 'N/A'}
//           </Typography>
//         </Tooltip>
//       )
//     },
//     {
//       field: 'action',
//       headerName: 'Action',
//       minWidth: 120,
//       flex: 0.7,
//       align: 'center',
//       headerAlign: 'center',
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:edit' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => {
//         return (
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               height: '100%'
//             }}
//           >
//             <Button
//               size='small'
//               color='primary'
//               variant='contained'
//               onClick={e => {
//                 e.stopPropagation()
//                 handleOpenAddModal(params.row)
//               }}
//             >
//               <Icon icon='tabler:edit' fontSize='small' />
//               Update
//             </Button>
//           </Box>
//         )
//       }
//     },
//     {
//       field: 'report',
//       headerName: 'Report Generation',
//       minWidth: 180,
//       flex: 1,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:report' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => {
//         return (
//           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <Button
//               size='small'
//               color='primary'
//               variant='contained'
//               disabled={params.row.workStatus !== 'completed'}
//               onClick={e => {
//                 e.stopPropagation()
//                 handleOpenReportModal(params.row)
//               }}
//             >
//               <Icon icon='tabler:report' fontSize='small' />
//               Generate Report
//             </Button>
//           </Box>
//         )
//       }
//     },
//     {
//       field: 'Pdf',
//       headerName: 'PDF Url',
//       minWidth: 180,
//       flex: 1,
//       renderHeader: params => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Icon icon='tabler:report' fontSize='small' />
//           <Typography variant='subtitle2'>{params.colDef.headerName}</Typography>
//         </Box>
//       ),
//       renderCell: params => {
//         return (
//           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <Button
//               size='small'
//               color='primary'
//               variant='contained'
//               disabled={params.row.workStatus !== 'reportgenerated'}
//               onClick={e => {
//                 e.stopPropagation()
//                 handleDownloadPDF(params.row.reportUrl)
//               }}
//             >
//               <Icon icon='tabler:report' fontSize='small' />
//               View PDF
//             </Button>
//           </Box>
//         )
//       }
//     }
//   ]

//   const handleDownloadPDF = urls => {
//     console.log('Downloading PDF with URLs:', urls)

//     if (!urls || !Array.isArray(urls) || urls.length === 0) {
//       setSnackbar({ open: true, message: 'No PDF available for this case', severity: 'warning' })
//       return
//     }

//     // Get the last URL from the array
//     const lastUrl = urls[urls.length - 1]

//     if (!lastUrl) {
//       setSnackbar({ open: true, message: 'Invalid PDF URL', severity: 'error' })
//       return
//     }

//     try {
//       const link = document.createElement('a')
//       link.href = lastUrl
//       link.download = '' // Browser will use filename from URL or default name
//       link.target = '_blank' // Fallback for some browsers

//       // Make the link invisible
//       link.style.display = 'none'

//       document.body.appendChild(link)
//       link.click()

//       // Clean up
//       setTimeout(() => {
//         document.body.removeChild(link)
//       }, 100)

//       setSnackbar({ open: true, message: 'PDF download started', severity: 'success' })
//     } catch (error) {
//       console.error('Download failed:', error)
//       setSnackbar({ open: true, message: 'Failed to download PDF', severity: 'error' })
//     }
//   }

//   const handleOpenAddModal = async row => {
//     console.log('Opening add modal for row:', row)
//     setOpenAddModal(true)
//     const requestId = row.requestData._id
//     const initId = row._id
//     setServiceId(row.serviceId)
//     setServiceName(row.serviceName)
//     setRequestId(requestId)
//     setPartnerName(row.partnerName)
//     setInitId(initId)
//     // setPId(row.pId)
//     if (row.serviceId) {
//       try {
//         const response = await getpartnerproduct(requestId, row.serviceId, initId)
//         console.log('Fetched partner products:', response)

//         if (response && response.items) {
//           setPartnerProducts(response.items)
//         }
//       } catch (error) {
//         console.error('Error fetching partner products:', error)
//         setSnackbar({ open: true, message: 'Failed to fetch partner products', severity: 'error' })
//       }
//     }
//   }

//   const isImageFile = filename => {
//     if (!filename) return false
//     const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
//     const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'))
//     return imageExtensions.includes(extension)
//   }

//   // Fetch services on component mount
//   useEffect(() => {
//     fetchServices()
//   }, [])

//   useEffect(() => {
//     if (partnerProducts && partnerProducts[0]?.productForm) {
//       const initialProductFields = {}

//       partnerProducts[0].productForm.forEach(product => {
//         if (product?.submitFields?.isActive && product?.submitFields?.fields) {
//           // if (product?.initFields?.isActive && product?.initFields?.fields) {
//           initialProductFields[product._id] = {}

//           // Initialize each field with its existing value
//           product.submitFields.fields.forEach(field => {
//             // Use existing value if available, otherwise use empty string
//             initialProductFields[product._id][field.fieldName] = field.value || ''
//           })
//         }
//       })

//       // Only set if we have initial data and productFields is empty
//       if (Object.keys(initialProductFields).length > 0 && Object.keys(productFields).length === 0) {
//         setProductFields(initialProductFields)
//       }
//     }
//   }, [partnerProducts])

//   // Fetch locations when partner products change
//   useEffect(() => {
//     if (partnerProducts.length > 0) {
//       fetchLocations()
//     }
//   }, [partnerProducts])

//   const fetchServices = async () => {
//     try {
//       setLoading(true)
//       const response = await getAllServicesApi()
//       console.log('services', response)

//       if (response?.items) {
//         setServices(response.items)
//       }
//     } catch (err) {
//       console.error('Failed to fetch services:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchLocations = async () => {
//     try {
//       const data = await getAllLocationsAPI()

//       if (data?.items) {
//         setLocations(data.items)
//       }
//     } catch (err) {
//       console.error('Failed to fetch locations:', err)
//     }
//   }

//   const handleCloseAddModal = () => {
//     setOpenAddModal(false)
//     resetForm()
//   }

//   const handleToggleProduct = productId => {
//     setFormVisibility(prev => {
//       // If the product is being turned on, turn off all others
//       if (!prev[productId]) {
//         const newVisibility = {}
//         // Turn off all products
//         Object.keys(prev).forEach(id => {
//           newVisibility[id] = false
//         })
//         // Turn on only the selected product
//         newVisibility[productId] = true
//         return newVisibility
//       } else {
//         // If turning off, just toggle this product
//         return {
//           ...prev,
//           [productId]: false
//         }
//       }
//     })
//   }

//   const handleProductFieldChange = (productId, fieldName, value) => {
//     setProductFields(prev => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         [fieldName]: value
//       }
//     }))

//     // Clear error when user starts typing
//     if (fieldErrors[`${productId}_${fieldName}`]) {
//       setFieldErrors(prev => ({
//         ...prev,
//         [`${productId}_${fieldName}`]: undefined
//       }))
//     }
//   }

//   const handleFileUpload = async (file, productId, fieldName) => {
//     if (!file) return

//     setUploadingFiles(prev => ({
//       ...prev,
//       [`${productId}_${fieldName}`]: true
//     }))

//     try {
//       const response = await uploadImageApi(file)

//       if (response.status && response.items?.fileUrl) {
//         handleProductFieldChange(productId, fieldName, response.items.fileUrl)
//         handleProductFieldChange(productId, `${fieldName}_filename`, file.name)

//         // Make AI button visible for ANY file upload (images or documents)
//         // setAiButtonVisible((prev) => ({
//         //   ...prev,
//         //   [productId]: true,
//         // }))
//       } else {
//         console.error('File upload failed:', response)
//         showSnackbar('File upload failed', 'error')
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error)
//       showSnackbar('Error uploading file', 'error')
//     } finally {
//       setUploadingFiles(prev => ({
//         ...prev,
//         [`${productId}_${fieldName}`]: false
//       }))
//     }
//   }

//   const handleMultiFileUpload = async (files, productId, fieldName) => {
//     if (!files || files.length === 0) return

//     // Initialize upload progress indicators for each file
//     const uploadItems = files.map(file => ({
//       filename: file.name,
//       size: file.size,
//       progress: 0,
//       status: 'uploading'
//     }))

//     setUploadingFiles(prev => ({
//       ...prev,
//       [`${productId}_${fieldName}_items`]: uploadItems
//     }))

//     try {
//       const formData = new FormData()
//       files.forEach(file => {
//         formData.append('images', file)
//       })

//       const response = await uploadMultiImageApi(formData)

//       if (response.status && response.items?.files) {
//         // Update progress to 100% for all files
//         setUploadingFiles(prev => ({
//           ...prev,
//           [`${productId}_${fieldName}_items`]: prev[`${productId}_${fieldName}_items`].map(item => ({
//             ...item,
//             progress: 100,
//             status: 'completed'
//           }))
//         }))

//         // Get existing files if any
//         const existingFiles = Array.isArray(productFields[productId]?.[fieldName])
//           ? [...productFields[productId][fieldName]]
//           : []

//         // Combine with new files
//         const updatedFiles = [...existingFiles, ...response.items.files].flat()

//         // Store the file URLs array
//         handleProductFieldChange(productId, fieldName, updatedFiles)

//         // Get existing filenames if any
//         const existingFilenames = Array.isArray(productFields[productId]?.[`${fieldName}_filenames`])
//           ? [...productFields[productId][`${fieldName}_filenames`]]
//           : []

//         // Store filenames for display purposes - combine with existing
//         const filenames = [...existingFilenames, ...files.map(file => file.name)]
//         handleProductFieldChange(productId, `${fieldName}_filenames`, filenames)

//         // Make AI button visible for ANY file upload (images or documents)
//         // setAiButtonVisible((prev) => ({
//         //   ...prev,
//         //   [productId]: true,
//         // }))

//         // Clear the temporary uploading files state after a delay
//         setTimeout(() => {
//           setUploadingFiles(prev => {
//             const newState = { ...prev }
//             delete newState[`${productId}_${fieldName}_items`]
//             return newState
//           })
//         }, 2000)
//       } else {
//         console.error('Multi-file upload failed:', response)
//         showSnackbar('Multi-file upload failed', 'error')

//         // Update status to show error
//         setUploadingFiles(prev => ({
//           ...prev,
//           [`${productId}_${fieldName}_items`]: prev[`${productId}_${fieldName}_items`].map(item => ({
//             ...item,
//             status: 'error'
//           }))
//         }))
//       }
//     } catch (error) {
//       console.error('Error uploading multiple files:', error)
//       showSnackbar('Error uploading multiple files', 'error')

//       // Update status to show error
//       setUploadingFiles(prev => ({
//         ...prev,
//         [`${productId}_${fieldName}_items`]:
//           prev[`${productId}_${fieldName}_items`]?.map(item => ({
//             ...item,
//             status: 'error'
//           })) || []
//       }))
//     }
//   }

//   const handleRemoveFile = (productId, fieldName, index) => {
//     // For single file upload
//     if (index === undefined) {
//       handleProductFieldChange(productId, fieldName, '')
//       handleProductFieldChange(productId, `${fieldName}_filename`, '')

//       // Check if we should hide AI button after removing file
//       // updateAiButtonVisibility(productId)
//       return
//     }

//     // For multi-file upload
//     const newFiles = [...productFields[productId][fieldName]]
//     newFiles.splice(index, 1)

//     // Update the files array
//     handleProductFieldChange(productId, fieldName, newFiles)

//     // Update filenames array if exists
//     if (productFields[productId]?.[`${fieldName}_filenames`]) {
//       const newFilenames = [...productFields[productId][`${fieldName}_filenames`]]
//       newFilenames.splice(index, 1)
//       handleProductFieldChange(productId, `${fieldName}_filenames`, newFilenames)
//     }
//   }

//   const runAIDataExtraction = async productId => {
//     setAiProcessing(prev => ({
//       ...prev,
//       [productId]: true
//     }))

//     try {
//       // Find the current product
//       const currentProduct = partnerProducts[0]?.productForm?.find(p => p._id === productId)

//       if (!currentProduct) {
//         console.error('Product information not found')
//         return
//       }

//       // Create initFields array from current form data
//       const initFields = []

//       // Add submitFields data
//       if (currentProduct?.submitFields?.fields) {
//         currentProduct.submitFields.fields.forEach(field => {
//           const fieldValue = productFields[productId]?.[field.fieldName] || ''
//           initFields.push({
//             fieldName: field.fieldName,
//             dataType: field.dataType,
//             value: fieldValue
//           })
//         })
//       }

//       // Add initFields data if available
//       if (currentProduct?.initFields?.fields) {
//         currentProduct.initFields.fields.forEach(field => {
//           initFields.push({
//             fieldName: field.fieldName,
//             dataType: field.dataType,
//             value: field.value || ''
//           })
//         })
//       }

//       const payload = {
//         reqId: requestId,
//         userProductId: currentProduct.userProductId,
//         initFields: initFields
//       }
//       console.log('AI Extraction Payload:', payload)

//       const response = await getAiDataAPI(payload)
//       console.log('ai data', response)

//       if (response.status && response.items) {
//         // Update the form fields with the extracted data
//         const extractedData = response.items

//         // Create updated product fields
//         const updatedFields = {
//           ...productFields[productId]
//         }

//         // Loop through all the extracted fields and update corresponding form fields
//         Object.keys(extractedData).forEach(fieldName => {
//           // Only update if the field has a value and it matches a submit field
//           if (extractedData[fieldName] !== null && extractedData[fieldName] !== undefined) {
//             // Check if this field exists in submitFields
//             const matchingField = currentProduct?.submitFields?.fields?.find(field => field.fieldName === fieldName)
//             if (matchingField) {
//               updatedFields[fieldName] = extractedData[fieldName]
//             }
//           }
//         })

//         // Update the product fields state with new data
//         setProductFields(prev => ({
//           ...prev,
//           [productId]: updatedFields
//         }))

//         setSnackbar({ open: true, message: 'AI data extraction completed successfully', severity: 'success' })
//       } else {
//         const errorMessage = response.message || 'Failed to extract data from files'
//         console.error('AI Extraction Error:', errorMessage)
//         setSnackbar({ open: true, message: errorMessage, severity: 'error' })
//       }
//     } catch (error) {
//       console.error('Error in AI data extraction:', error)
//       setSnackbar({ open: true, message: 'Error processing files', severity: 'error' })
//     } finally {
//       setAiProcessing(prev => ({
//         ...prev,
//         [productId]: false
//       }))
//     }
//   }

//   const validateForm = () => {
//   const errors = {}
//   let isValid = true
//   const errorMessages = []

//   // Get the single selected product
//   const selectedProductId = Object.keys(formVisibility).find(productId => formVisibility[productId])

//   if (!selectedProductId) {
//     errorMessages.push('Please select a product to proceed')
//     isValid = false
//     setFieldErrors(errors)
//     if (errorMessages.length > 0) {
//       setSnackbar({ open: true, message: errorMessages[0], severity: 'error' })
//     }
//     return isValid
//   }

//   // Find the product to access its field definitions
//   const product = partnerProducts[0]?.productForm?.find(p => p._id === selectedProductId)
//   if (!product) {
//     errorMessages.push('Selected product not found')
//     isValid = false
//     setFieldErrors(errors)
//     if (errorMessages.length > 0) {
//       setSnackbar({ open: true, message: errorMessages[0], severity: 'error' })
//     }
//     return isValid
//   }

//   // Check if product exists in productFields
//   if (!productFields[selectedProductId]) {
//     errors[`${selectedProductId}_general`] = 'Product data is missing'
//     errorMessages.push(`${product.productName}: Product data is missing`)
//     isValid = false
//     setFieldErrors(errors)
//     if (errorMessages.length > 0) {
//       setSnackbar({ open: true, message: errorMessages[0], severity: 'error' })
//     }
//     return isValid
//   }

//   const fields = productFields[selectedProductId] || {}
//   const todayDate = new Date().toISOString().split("T")[0]

//   product?.submitFields?.fields?.forEach(field => {
//     const fieldValue = fields[field.fieldName]

//     // Only validate fields that are required (isRequired: true)
//     if (field.isRequired) {
//       let isEmpty = false

//       // Check if field is empty based on its data type
//       switch (field.dataType) {
//         case 'string':
//         case 'textarea':
//           isEmpty = fieldValue === undefined || fieldValue === null || fieldValue === ''
//           break
//         case 'date':
//           // For date fields, consider today's date as valid if no value is set
//           isEmpty = fieldValue === undefined || fieldValue === null || fieldValue === ''
//           // Don't mark as error since we'll use today's date as default
//           isEmpty = false
//           break
//         case 'file':
//           isEmpty = fieldValue === undefined || fieldValue === null || fieldValue === ''
//           break
//         case 'multiUpload':
//           isEmpty = !Array.isArray(fieldValue) || fieldValue.length === 0
//           break
//         default:
//           isEmpty = fieldValue === undefined || fieldValue === null || fieldValue === ''
//       }

//       if (isEmpty) {
//         const fieldDisplayName = field.fieldName.replace(/_/g, ' ')
//         errors[`${selectedProductId}_${field.fieldName}`] = `${fieldDisplayName} is required`
//         errorMessages.push(`${product.productName}: ${fieldDisplayName} is required`)
//         isValid = false
//       }
//     }
//   })

//   // Set field errors to update UI
//   setFieldErrors(errors)

//   // Show validation errors in snackbar if any
//   if (errorMessages.length > 0) {
//     setSnackbar({ open: true, message: errorMessages[0], severity: 'error' })
//   }

//   return isValid
// }

// const handleFormSubmit = async e => {
//   e.preventDefault()
//   const todayDate = new Date().toISOString().split("T")[0]

//   // Run validation first
//   const isValid = validateForm()
//   if (!isValid) return

//   // Get the single selected product (since only one can be open at a time)
//   const selectedProductId = Object.keys(formVisibility).find(productId => formVisibility[productId])

//   if (!selectedProductId) {
//     setSnackbar({
//       open: true,
//       message: 'Please select a product to proceed.',
//       severity: 'error'
//     })
//     return
//   }

//   // Find the selected product
//   const selectedProduct = partnerProducts[0]?.productForm?.find(p => p._id === selectedProductId)
//   const fields = productFields[selectedProductId] || {}

//   if (!selectedProduct) {
//     setSnackbar({
//       open: true,
//       message: 'Selected product not found.',
//       severity: 'error'
//     })
//     return
//   }

//   // Structure submitFields according to the required format
//   const submitFields =
//     selectedProduct?.submitFields?.fields?.map(field => {
//       let fieldValue = fields[field.fieldName]

//       // Handle default values based on field type
//       if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
//         switch (field.dataType) {
//           case 'date':
//             // For date fields, use today's date as default if no value is set
//             fieldValue = todayDate
//             break
//           case 'string':
//           case 'textarea':
//             // Use the field's default value or empty string
//             fieldValue = field.value || ''
//             break
//           case 'file':
//             fieldValue = ''
//             break
//           case 'multiUpload':
//             fieldValue = []
//             break
//           default:
//             fieldValue = field.value || ''
//         }
//       }

//       return {
//         fieldName: field.fieldName,
//         dataType: field.dataType,
//         value: fieldValue
//       }
//     }) || []

//   // Create the payload with the correct structure
//   const payload = {
//     reportType: selectedProduct.userProductId, // userProductId
//     id: initId, // initId
//     workStatus: 'completed',
//     reportStatus: 'wip',
//     submitFields: submitFields,
//     charge: selectedProduct?.charge || 0 // Add charge field
//   }

//   console.log('Properly structured payload:', payload)

//   try {
//     const data = await updateAddCasesApi(payload)
//     console.log('submit response', data)

//     if (data.status) {
//       setSnackbar({ open: true, message: 'Case successfully submitted', severity: 'success' })
//       handleCloseAddModal()
//       fetchAddCases() // Refresh case list after submission
//     } else {
//       setSnackbar({ open: true, message: data.message || 'Failed to submit case', severity: 'error' })
//     }
//   } catch (error) {
//     console.error('Error submitting case:', error)
//     setSnackbar({ open: true, message: 'Failed to submit case', severity: 'error' })
//   }
// }

//   const resetForm = () => {
//     setFormVisibility({})
//     setProductFields({})
//     setFieldErrors({})
//     setAiResponseData({})
//     // setAiButtonVisible({})
//     setAiProcessing({})
//     setUploadingFiles({})
//     setPId(null)
//     setServiceId(null)
//     setServiceName('')
//     setRequestId(null)
//     setPartnerProducts([])
//   }

//   // Helper functions for file fields
//   const getFileTypeFieldsCount = productId => {
//     const currentProduct = partnerProducts[0]?.productForm?.find(p => p._id === productId)

//     if (!currentProduct?.submitFields?.fields) {
//       return 0
//     }

//     return currentProduct.submitFields.fields.filter(
//       field => field.dataType !== 'string' && field.dataType !== 'textarea'
//     ).length
//   }

//   const getPopulatedFileFieldsCount = productId => {
//     const currentProduct = partnerProducts[0]?.productForm?.find(p => p._id === productId)

//     if (!currentProduct?.submitFields?.fields) {
//       return 0
//     }

//     let count = 0

//     currentProduct.submitFields.fields.forEach(field => {
//       if (field.dataType !== 'string' && field.dataType !== 'textarea' && productFields[productId]?.[field.fieldName]) {
//         count++
//       }
//     })

//     return count
//   }

//   // Helper function to get total uploaded files count for AI processing
//   const getUploadedFilesCount = productId => {
//     const currentProduct = partnerProducts[0]?.productForm?.find(p => p._id === productId)

//     if (!currentProduct?.submitFields?.fields) {
//       return 0
//     }

//     let count = 0

//     currentProduct.submitFields.fields.forEach(field => {
//       if (field.dataType !== 'string' && field.dataType !== 'textarea') {
//         const fieldValue = productFields[productId]?.[field.fieldName]

//         if (fieldValue) {
//           if (Array.isArray(fieldValue)) {
//             // Multi-file upload - count all files
//             count += fieldValue.length
//           } else {
//             // Single file upload - count if exists
//             count += 1
//           }
//         }
//       }
//     })

//     return count
//   }

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage + 1)
//   }

//   const showSnackbar = (message, severity) => {
//     setSnackbar({
//       open: true,
//       message: message,
//       severity: severity
//     })
//   }

//   const handleCustomCsvExport = () => {
//     try {
//       // Get all visible columns
//       const visibleColumns = columns.filter(col => col.field !== 'action') // Exclude action column

//       // Create CSV headers
//       const headers = visibleColumns.map(col => col.headerName || col.field)

//       // Create CSV data
//       const csvData = rows.map(row => {
//         return visibleColumns.map(col => {
//           if (col.field.startsWith('initField_')) {
//             // Handle dynamic fields
//             const index = Number.parseInt(col.field.split('_')[1])
//             return row.initFields?.[index]?.value || 'N/A'
//           } else {
//             // Handle static fields
//             return row[col.field] || 'N/A'
//           }
//         })
//       })

//       // Combine headers and data
//       const csvContent = [headers, ...csvData]

//       // Convert to CSV string
//       const csvString = csvContent
//         .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
//         .join('\n')

//       // Download CSV
//       const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
//       const link = document.createElement('a')
//       const url = URL.createObjectURL(blob)
//       link.setAttribute('href', url)
//       link.setAttribute('download', `cases_export_${new Date().toISOString().split('T')[0]}.csv`)
//       link.style.visibility = 'hidden'
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//     } catch (error) {
//       console.error('Error exporting CSV:', error)
//     }
//   }
//   const CustomToolbar = () => {
//     const theme = useTheme()

//     return (
//       <GridToolbarContainer
//         sx={{
//           p: 2,
//           borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
//           gap: 1,
//           bgcolor: alpha(theme.palette.primary.main, 0.03),
//           display: 'flex',
//           flexWrap: 'wrap'
//         }}
//       >
//         <GridToolbarColumnsButton />
//         <GridToolbarFilterButton />
//         <GridToolbarDensitySelector />
//         {/* <GridToolbarExport /> */}
//         {/* Optional: Add custom export button */}
//         <Button
//           size='small'
//           startIcon={<Icon icon='tabler:download' />}
//           onClick={handleCustomCsvExport}
//           sx={{ color: 'primary.main', fontSize: '0.875rem', '&:hover': { borderColor: 'primary.dark' } }}
//         >
//           CSV Export
//         </Button>
//       </GridToolbarContainer>
//     )
//   }

//   return (
//     <>
//       {/* Loading Overlay */}
//       {isLoading && (
//         <Box
//           display='flex'
//           justifyContent='center'
//           alignItems='center'
//           position='fixed'
//           top={0}
//           left={0}
//           width={'100%'}
//           height={'100%'}
//           bgcolor='rgba(255, 255, 255, 0.8)'
//           zIndex={1300}
//           sx={{
//             backdropFilter: 'blur(4px)'
//           }}
//         >
//           <Paper
//             elevation={3}
//             sx={{
//               p: 3,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               borderRadius: 2
//             }}
//           >
//             <CircularProgress color='primary' size={60} thickness={4} sx={{ mb: 2 }} />
//             <Typography variant='h6' color='primary'>
//               Loading Data...
//             </Typography>
//           </Paper>
//         </Box>
//       )}

//       <Box sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
//         {/* Header */}
//         <Card
//           elevation={3}
//           sx={{
//             width: '100%',
//             background: 'linear-gradient(135deg, #9180ff, rgb(63, 194, 255))',
//             borderRadius: 2,
//             padding: { xs: '16px 12px', sm: '20px 16px' },
//             boxShadow: '0 4px 20px rgba(0, 130, 198, 0.25)',
//             mb: 3,
//             position: 'relative',
//             overflow: 'hidden'
//           }}
//         >
//           {/* Background pattern */}
//           <Box
//             sx={{
//               position: 'absolute',
//               top: 0,
//               right: 0,
//               width: '50%',
//               height: '100%',
//               opacity: 0.1,
//               backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 3px)',
//               backgroundSize: '20px 20px'
//             }}
//           />

//           {/* Title */}
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: 'center',
//               justifyContent: { xs: 'center', md: 'space-between' },
//               width: '100%',
//               gap: 2
//             }}
//           >
//             <Typography
//               variant={isMobile ? 'h5' : 'h4'}
//               sx={{
//                 fontWeight: 'bold',
//                 color: 'white',
//                 textAlign: { xs: 'center', md: 'left' },
//                 textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)',
//                 letterSpacing: '0.5px',
//                 flexShrink: 0,
//                 whiteSpace: 'nowrap'
//               }}
//             >
//               {title}
//             </Typography>
//           </Box>
//         </Card>

//         {/* Filter Content */}
//         <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
//           <Grid
//             container
//             spacing={3}
//             sx={{
//               width: '100%',
//               justifyContent: 'center',
//               marginLeft: '0 auto',
//               flexDirection: { xs: 'column', sm: 'row' }
//             }}
//           >
//             {/* Partner Section */}
//             <Grid item xs={12} sm={6} md={4}>
//               <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
//                 Client
//               </Typography>

//               <Box
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   gap: 2.5,
//                   width: '100%',
//                   maxWidth: { xs: '100%', sm: '400px' }
//                 }}
//               >
//                 <FormControl fullWidth size='small'>
//                   <Select
//                     value={selectedEmployee}
//                     onChange={handleEmployeeSelectChange}
//                     displayEmpty
//                     renderValue={selected => {
//                       if (selected === 'all') return 'All Clients'
//                       if (selected === '') return 'All Clients'
//                       const partner = partners.find(p => p.partner._id === selected)
//                       return partner?.partner?.name || 'Select Clients'
//                     }}
//                     sx={{
//                       height: 42,
//                       borderRadius: 1.5,
//                       '& .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'rgba(0, 0, 0, 0.1)'
//                       },
//                       '& .MuiSelect-select': {
//                         pl: 1.5,
//                         display: 'flex',
//                         alignItems: 'center'
//                       },
//                       '&:hover .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'primary.main'
//                       },
//                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'primary.main'
//                       }
//                     }}
//                     startAdornment={
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           ml: 0.75,
//                           mr: 1
//                         }}
//                       >
//                         <Icon icon='tabler:users' color='#0082c6' fontSize='small' />
//                       </Box>
//                     }
//                     MenuProps={{
//                       PaperProps: {
//                         style: { maxHeight: 300, marginTop: 8 },
//                         elevation: 2,
//                         sx: {
//                           '& .MuiMenuItem-root': {
//                             py: 0.75,
//                             px: 2
//                           }
//                         }
//                       }
//                     }}
//                   >
//                     <MenuItem value='all' sx={{ fontWeight: 500 }}>
//                       All Clients
//                     </MenuItem>
//                     {partners.map(partner => (
//                       <MenuItem key={partner?.partner?._id} value={partner?.partner?._id}>
//                         {partner.partner?.name || 'Client not available'}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Box>
//             </Grid>

//             {/* Service Section*/}
//             <Grid item xs={12} sm={6} md={4}>
//               <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
//                 Service
//               </Typography>

//               <Box
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   gap: 2.5,
//                   width: '100%',
//                   maxWidth: { xs: '100%', sm: '400px' }
//                 }}
//               >
//                 <FormControl fullWidth size='small'>
//                   <Select
//                     value={selectedService}
//                     onChange={handleServiceSelectChange}
//                     displayEmpty
//                     renderValue={selected => {
//                       if (selected === 'all') return 'All Services'
//                       if (selected === '') return 'All Services'
//                       const service = services.find(p => p._id === selected)
//                       return service?.serviceName || 'Select Service'
//                     }}
//                     sx={{
//                       height: 42,
//                       borderRadius: 1.5,
//                       '& .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'rgba(0, 0, 0, 0.1)'
//                       },
//                       '& .MuiSelect-select': {
//                         pl: 1.5,
//                         display: 'flex',
//                         alignItems: 'center'
//                       },
//                       '&:hover .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'primary.main'
//                       },
//                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'primary.main'
//                       }
//                     }}
//                     startAdornment={
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           ml: 0.75,
//                           mr: 1
//                         }}
//                       >
//                         <Icon icon='tabler:report' color='#0082c6' fontSize='small' />
//                       </Box>
//                     }
//                     MenuProps={{
//                       PaperProps: {
//                         style: { maxHeight: 300, marginTop: 8 },
//                         elevation: 2,
//                         sx: {
//                           '& .MuiMenuItem-root': {
//                             py: 0.75,
//                             px: 2
//                           }
//                         }
//                       }
//                     }}
//                   >
//                     <MenuItem value='' sx={{ fontWeight: 500 }}>
//                       All Services
//                     </MenuItem>
//                     {services.map(service => (
//                       <MenuItem key={service._id} value={service._id}>
//                         {service.serviceName || 'Service not available'}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Box>
//             </Grid>

//             {/* Date Section */}
//             <Grid item xs={12} sm={6} md={4}>
//               <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
//                 Date Range
//               </Typography>

//               <Box
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   gap: 2.5,
//                   width: '100%',
//                   maxWidth: { xs: '100%', sm: '400px' }
//                 }}
//               >
//                 <FormControl fullWidth size='small'>
//                   <Select
//                     value={dateRange}
//                     onChange={handleDateRangeChange}
//                     displayEmpty
//                     renderValue={selected => {
//                       if (selected === '') return 'Select Date Range'
//                       if (selected === 'today') return 'Today'
//                       if (selected === 'thisWeek') return 'This Week'
//                       if (selected === 'thisMonth') return 'This Month'
//                       if (selected === 'custom') return 'Custom Range'
//                       return selected
//                     }}
//                     sx={{
//                       height: 42,
//                       borderRadius: 1.5,
//                       '& .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'rgba(0, 0, 0, 0.1)'
//                       },
//                       '& .MuiSelect-select': {
//                         pl: 1.5,
//                         display: 'flex',
//                         alignItems: 'center'
//                       },
//                       '&:hover .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'primary.main'
//                       },
//                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'primary.main'
//                       }
//                     }}
//                     startAdornment={
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           ml: 0.75,
//                           mr: 1
//                         }}
//                       >
//                         <Icon icon='tabler:calendar' color='#0082c6' fontSize='small' />
//                       </Box>
//                     }
//                     MenuProps={{
//                       PaperProps: {
//                         style: { maxHeight: 300, marginTop: 8 },
//                         elevation: 2,
//                         sx: {
//                           '& .MuiMenuItem-root': {
//                             py: 0.75,
//                             px: 2
//                           }
//                         }
//                       }
//                     }}
//                   >
//                     <MenuItem value='today' sx={{ fontWeight: 500 }}>
//                       Today
//                     </MenuItem>
//                     <MenuItem value='thisWeek' sx={{ fontWeight: 500 }}>
//                       This Week
//                     </MenuItem>
//                     <MenuItem value='thisMonth' sx={{ fontWeight: 500 }}>
//                       This Month
//                     </MenuItem>
//                     <MenuItem value='custom' sx={{ fontWeight: 500 }}>
//                       Custom Range
//                     </MenuItem>
//                   </Select>
//                 </FormControl>
//               </Box>
//             </Grid>

//             {/* Custom Date Range Section - Now properly inside the Grid */}
//             {dateRange === 'custom' && (
//               <Grid item xs={12} sm={12} md={4}>
//                 <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
//                   Custom Date Range
//                 </Typography>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: 2.5,
//                     width: '100%',
//                     maxWidth: { xs: '100%', sm: '400px' }
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
//                     <TextField
//                       type='date'
//                       fullWidth
//                       size='small'
//                       placeholder='Start Date'
//                       value={startDateFilter}
//                       onChange={e => {
//                         setStartDateFilter(e.target.value)
//                         setPage(1) // Reset page when filter changes
//                       }}
//                       InputProps={{
//                         startAdornment: (
//                           <Box
//                             sx={{
//                               display: 'flex',
//                               alignItems: 'center',
//                               ml: 0.75,
//                               mr: 1
//                             }}
//                           >
//                             <Icon icon='tabler:calendar' color='#0082c6' fontSize='small' />
//                           </Box>
//                         ),
//                         sx: {
//                           height: 42,
//                           borderRadius: 1.5,
//                           '& .MuiOutlinedInput-notchedOutline': {
//                             borderColor: 'rgba(0, 0, 0, 0.1)'
//                           },
//                           '&:hover .MuiOutlinedInput-notchedOutline': {
//                             borderColor: 'primary.main'
//                           },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                             borderColor: 'primary.main'
//                           }
//                         }
//                       }}
//                     />
//                     <TextField
//                       type='date'
//                       fullWidth
//                       size='small'
//                       placeholder='End Date'
//                       value={endDateFilter}
//                       onChange={e => {
//                         setEndDateFilter(e.target.value)
//                         setPage(1) // Reset page when filter changes
//                       }}
//                       InputProps={{
//                         startAdornment: (
//                           <Box
//                             sx={{
//                               display: 'flex',
//                               alignItems: 'center',
//                               ml: 0.75,
//                               mr: 1
//                             }}
//                           >
//                             <Icon icon='tabler:calendar' color='#0082c6' fontSize='small' />
//                           </Box>
//                         ),
//                         sx: {
//                           height: 42,
//                           borderRadius: 1.5,
//                           '& .MuiOutlinedInput-notchedOutline': {
//                             borderColor: 'rgba(0, 0, 0, 0.1)'
//                           },
//                           '&:hover .MuiOutlinedInput-notchedOutline': {
//                             borderColor: 'primary.main'
//                           },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                             borderColor: 'primary.main'
//                           }
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               </Grid>
//             )}
//           </Grid>

//           {/* Quick date selectors */}
//           <Box
//             sx={{
//               mt: 3.5,
//               mb: 3.5,
//               display: 'flex',
//               alignItems: 'center',
//               flexWrap: 'wrap',
//               gap: 1
//             }}
//           >
//             <Typography variant='body2' sx={{ color: 'text.secondary', mr: 1, fontWeight: 500 }}>
//               Quick filters:
//             </Typography>
//             <Chip
//               label='Today'
//               size='small'
//               onClick={() => {
//                 const today = new Date().toISOString().split('T')[0]
//                 setDateRange('today')
//                 setPage(1)
//               }}
//               sx={{
//                 borderRadius: 1,
//                 bgcolor: alpha('#0082c6', 0.08),
//                 color: '#0082c6',
//                 '&:hover': { bgcolor: alpha('#0082c6', 0.15) }
//               }}
//             />
//             <Chip
//               label='This Week'
//               size='small'
//               onClick={() => {
//                 setDateRange('thisWeek')
//                 setPage(1)
//               }}
//               sx={{
//                 borderRadius: 1,
//                 bgcolor: alpha('#0082c6', 0.08),
//                 color: '#0082c6',
//                 '&:hover': { bgcolor: alpha('#0082c6', 0.15) }
//               }}
//             />
//             <Chip
//               label='This Month'
//               size='small'
//               onClick={() => {
//                 setDateRange('thisMonth')
//                 setPage(1)
//               }}
//               sx={{
//                 borderRadius: 1,
//                 bgcolor: alpha('#0082c6', 0.08),
//                 color: '#0082c6',
//                 '&:hover': { bgcolor: alpha('#0082c6', 0.15) }
//               }}
//             />
//             <Chip
//               label='Clear dates'
//               size='small'
//               variant='outlined'
//               onClick={() => {
//                 setDateRange('')
//                 setStartDateFilter('')
//                 setEndDateFilter('')
//                 setPage(1)
//               }}
//               sx={{
//                 borderRadius: 1,
//                 borderColor: 'divider',
//                 '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
//               }}
//             />
//           </Box>
//         </Box>

//         {/* Stats Section */}
//         <Box
//           sx={{
//             display: 'flex',
//             width: '100%',
//             p: 3,
//             gap: 3,
//             flexWrap: 'nowrap'
//           }}
//         >
//           {stats.map((stat, index) => (
//             <Box key={index} sx={{ flex: 1 }}>
//               <Card
//                 elevation={0}
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   p: { xs: 1, sm: 1.5, md: 2 },
//                   borderRadius: { xs: 1, sm: 2 },
//                   backgroundColor: stat.bgColor,
//                   border: `1px solid ${stat.borderColor}`,
//                   transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//                   width: '100%',
//                   height: '100%',
//                   '&:hover': {
//                     transform: 'translateY(-5px)',
//                     boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
//                   }
//                 }}
//               >
//                 <Avatar
//                   sx={{
//                     bgcolor: alpha(stat.textColor, 0.2),
//                     color: stat.textColor,
//                     width: { xs: 36, sm: 42, md: 48 },
//                     height: { xs: 36, sm: 42, md: 48 },
//                     mr: { xs: 1.5, sm: 2 },
//                     flexShrink: 0
//                   }}
//                 >
//                   {stat.icon}
//                 </Avatar>
//                 <Box sx={{ overflow: 'hidden' }}>
//                   <Typography
//                     variant='body2'
//                     sx={{
//                       fontWeight: 'bold',
//                       color: stat.textColor,
//                       fontSize: { xs: '0.75rem', sm: '0.875rem' }
//                     }}
//                     noWrap
//                   >
//                     {stat.label || 'Stats'}
//                   </Typography>
//                   <Typography
//                     variant='h5'
//                     sx={{
//                       color: stat.textColor,
//                       fontWeight: 600,
//                       fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
//                     }}
//                     noWrap
//                   >
//                     {stat.value}
//                   </Typography>
//                 </Box>
//               </Card>
//             </Box>
//           ))}
//         </Box>

//         {/* Data Grid Section */}
//         <Card
//           elevation={2}
//           sx={{
//             p: 2,
//             borderRadius: 2,
//             mb: 3,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             gap: 1
//           }}
//         >
//           <Typography
//             variant='h6'
//             sx={{
//               fontWeight: 600,
//               color: '#0082c6',
//               display: 'flex',
//               alignItems: 'center',
//               gap: 1
//             }}
//           >
//             <Icon icon='tabler:report' fontSize='1.25rem' />
//             Reporting ({rows.length} records)
//           </Typography>
//         </Card>

//         <Card
//           elevation={2}
//           sx={{
//             borderRadius: 2,
//             overflow: 'hidden',
//             height: { xs: 500, md: 600 }
//           }}
//         >
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             getRowId={row => row._id || Math.random().toString()}
//             disableSelectionOnClick={false}
//             disableColumnMenu={isMobile}
//             slots={{
//               toolbar: CustomToolbar,
//               Footer: () => (
//                 <TablePagination
//                   component='div'
//                   count={totalCount}
//                   page={page - 1}
//                   onPageChange={handlePageChange}
//                   rowsPerPage={pageLimit}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   rowsPerPageOptions={[100, 200, 500, 1000, 2000, 5000]}
//                 />
//               ),
//               noRowsOverlay: () => (
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: '100%',
//                     p: 3
//                   }}
//                 >
//                   <Icon icon='tabler:database-off' fontSize={48} sx={{ color: 'text.secondary', mb: 1 }} />
//                   <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
//                     No Data Available
//                   </Typography>
//                   <Typography variant='body2' color='text.secondary'>
//                     Try adjusting your filters or date range
//                   </Typography>
//                 </Box>
//               )
//             }}
//             sx={{
//               '& .MuiDataGrid-columnHeaders': {
//                 backgroundColor: '#9180ff',
//                 color: '#fff',
//                 fontSize: '14px',
//                 borderRadius: '8px 8px 0 0'
//               },
//               '& .MuiDataGrid-columnHeaderTitle': {
//                 fontWeight: 'bold',
//                 backgroundColor: 'aliceblue'
//               },
//               '& .MuiDataGrid-cell': {
//                 fontSize: '14px',
//                 padding: '8px 16px'
//               },
//               '& .MuiDataGrid-row:nth-of-type(even)': {
//                 backgroundColor: alpha('#0082c6', 0.04)
//               },
//               '& .MuiDataGrid-row:hover': {
//                 backgroundColor: alpha('#0082c6', 0.08),
//                 transition: 'background-color 0.2s ease'
//               },
//               '& .MuiDataGrid-row.Mui-selected': {
//                 backgroundColor: alpha('#0082c6', 0.12),
//                 '&:hover': {
//                   backgroundColor: alpha('#0082c6', 0.16)
//                 }
//               },
//               '& .MuiDataGrid-footerContainer': {
//                 borderTop: '1px solid rgba(224, 224, 224, 0.4)',
//                 backgroundColor: alpha('#0082c6', 0.04)
//               },
//               '& .MuiTablePagination-root': {
//                 color: '#0082c6'
//               },
//               '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
//                 width: '8px',
//                 height: '8px'
//               },
//               '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
//                 backgroundColor: alpha('#0082c6', 0.3),
//                 borderRadius: '4px',
//                 '&:hover': {
//                   backgroundColor: alpha('#0082c6', 0.5)
//                 }
//               },
//               border: 'none'
//             }}
//           />
//         </Card>
//       </Box>

//       <Modal
//         open={openAddModal}
//         handleClose={handleCloseAddModal}
//         showButton={false}
//         title=''
//         maxWidth='lg'
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//             overflow: 'hidden',
//             maxHeight: '90vh'
//           }
//         }}
//       >
//         <Box
//           sx={{
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             color: 'white',
//             p: 4,
//             position: 'relative',
//             overflow: 'hidden'
//           }}
//         >
//           {/* Background decoration */}
//           <Box
//             sx={{
//               position: 'absolute',
//               top: -50,
//               right: -50,
//               width: 200,
//               height: 200,
//               borderRadius: '50%',
//               background: 'rgba(255, 255, 255, 0.1)',
//               backdropFilter: 'blur(10px)'
//             }}
//           />
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: -30,
//               left: -30,
//               width: 150,
//               height: 150,
//               borderRadius: '50%',
//               background: 'rgba(255, 255, 255, 0.05)',
//               backdropFilter: 'blur(10px)'
//             }}
//           />

//           <Box sx={{ position: 'relative', zIndex: 1 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <Box
//                   sx={{
//                     width: 60,
//                     height: 60,
//                     borderRadius: 2,
//                     background: 'rgba(255, 255, 255, 0.2)',
//                     backdropFilter: 'blur(10px)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   <DescriptionOutlined sx={{ fontSize: 30, color: 'white' }} />
//                 </Box>
//                 <Box>
//                   <Typography variant='h4' fontWeight={700} sx={{ mb: 0.5 }}>
//                     Case Management
//                   </Typography>
//                   <Typography variant='body1' sx={{ opacity: 0.9 }}>
//                     Configure and update case details with AI-powered assistance
//                   </Typography>
//                 </Box>
//               </Box>
//               <IconButton
//                 onClick={handleCloseAddModal}
//                 sx={{
//                   color: 'white',
//                   bgcolor: 'rgba(255, 255, 255, 0.1)',
//                   backdropFilter: 'blur(10px)',
//                   '&:hover': {
//                     bgcolor: 'rgba(255, 255, 255, 0.2)'
//                   }
//                 }}
//               >
//                 <Icon icon='tabler:x' />
//               </IconButton>
//             </Box>
//           </Box>
//         </Box>

//         <Box sx={{ p: 4, maxHeight: 'calc(90vh - 140px)', overflowY: 'auto' }}>
//           {/* Partner and Service Information Card */}
//           <Card
//             elevation={0}
//             sx={{
//               mb: 4,
//               border: '1px solid #e5e7eb',
//               borderRadius: 3,
//               background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)'
//             }}
//           >
//             <CardContent sx={{ p: 4 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <Box
//                   sx={{
//                     width: 48,
//                     height: 48,
//                     borderRadius: 2,
//                     background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     mr: 2
//                   }}
//                 >
//                   <Person2Rounded sx={{ color: 'white', fontSize: 24 }} />
//                 </Box>
//                 <Typography variant='h6' fontWeight={600} color='#1f2937'>
//                   Client & Service Information
//                 </Typography>
//               </Box>

//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant='body2' color='text.secondary' sx={{ mb: 1, fontWeight: 500 }}>
//                       Client Name
//                     </Typography>
//                     <Box
//                       sx={{
//                         p: 2,
//                         borderRadius: 2,
//                         bgcolor: 'white',
//                         border: '1px solid #e5e7eb',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 2
//                       }}
//                     >
//                       <Avatar
//                         sx={{
//                           width: 32,
//                           height: 32,
//                           bgcolor: stringToColor(partnerName || ''),
//                           fontSize: '0.875rem'
//                         }}
//                       >
//                         {partnerName ? partnerName.charAt(0).toUpperCase() : '?'}
//                       </Avatar>
//                       <Typography variant='body1' fontWeight={500}>
//                         {partnerName || 'N/A'}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant='body2' color='text.secondary' sx={{ mb: 1, fontWeight: 500 }}>
//                       Service Type
//                     </Typography>
//                     <Box
//                       sx={{
//                         p: 2,
//                         borderRadius: 2,
//                         bgcolor: 'white',
//                         border: '1px solid #e5e7eb',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 2
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: 32,
//                           height: 32,
//                           borderRadius: 1,
//                           bgcolor: '#10b981',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center'
//                         }}
//                       >
//                         <Settings sx={{ color: 'white', fontSize: 18 }} />
//                       </Box>
//                       <Typography variant='body1' fontWeight={500}>
//                         {serviceName || 'N/A'}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>

//           {/* Product Configuration */}
//           {partnerProducts.length > 0 && (
//             <Card
//               elevation={0}
//               sx={{
//                 mb: 4,
//                 border: '1px solid #e5e7eb',
//                 borderRadius: 3,
//                 overflow: 'hidden'
//               }}
//             >
//               <Box
//                 sx={{
//                   background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
//                   color: 'white',
//                   p: 3
//                 }}
//               >
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <Box
//                     sx={{
//                       width: 48,
//                       height: 48,
//                       borderRadius: 2,
//                       background: 'rgba(255, 255, 255, 0.2)',
//                       backdropFilter: 'blur(10px)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <AutoAwesomeOutlined sx={{ color: 'white', fontSize: 24 }} />
//                   </Box>
//                   <Box>
//                     <Typography variant='h6' fontWeight={600}>
//                       AI-Powered Report Configuration
//                     </Typography>
//                     <Typography variant='body2' sx={{ opacity: 0.9 }}>
//                       Select and configure your report type with intelligent data extraction
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Box>

//               <CardContent sx={{ p: 4 }}>
//                 <Stack spacing={4}>
//                   {partnerProducts[0]?.productForm?.map(product => {
//                     const isInitFieldsActive = product?.submitFields?.isActive === true
//                     if (!isInitFieldsActive) return null

//                     const isProductEnabled = formVisibility[product._id] || false
//                     const fileFieldsCount = getFileTypeFieldsCount(product._id)
//                     const populatedFieldsCount = getPopulatedFileFieldsCount(product._id)
//                     const uploadedFilesCount = getUploadedFilesCount(product._id)

//                     return (
//                       <Card
//                         key={product._id}
//                         elevation={0}
//                         sx={{
//                           border: isProductEnabled ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
//                           borderRadius: 3,
//                           overflow: 'hidden',
//                           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                           transform: isProductEnabled ? 'translateY(-2px)' : 'none',
//                           boxShadow: isProductEnabled
//                             ? '0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)'
//                             : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             p: 3,
//                             background: isProductEnabled
//                               ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))'
//                               : '#fafafa',
//                             borderBottom: '1px solid #e5e7eb'
//                           }}
//                         >
//                           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                               <Box
//                                 sx={{
//                                   width: 40,
//                                   height: 40,
//                                   borderRadius: 2,
//                                   background: isProductEnabled
//                                     ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
//                                     : 'linear-gradient(135deg, #6b7280, #4b5563)',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   justifyContent: 'center'
//                                 }}
//                               >
//                                 <DescriptionOutlined sx={{ color: 'white', fontSize: 20 }} />
//                               </Box>
//                               <Box>
//                                 <Typography variant='h6' fontWeight={600} color='#1f2937'>
//                                   {product.productName}
//                                 </Typography>
//                                 <Typography variant='body2' color='text.secondary'>
//                                   {isProductEnabled ? 'Currently active' : 'Click to activate'}
//                                 </Typography>
//                               </Box>
//                               {isProductEnabled && (
//                                 <Chip
//                                   label='Active'
//                                   size='small'
//                                   sx={{
//                                     bgcolor: '#10b981',
//                                     color: 'white',
//                                     fontWeight: 600,
//                                     ml: 1
//                                   }}
//                                 />
//                               )}
//                             </Box>

//                             <Switch
//                               checked={isProductEnabled}
//                               onChange={() => handleToggleProduct(product._id)}
//                               sx={{
//                                 '& .MuiSwitch-switchBase.Mui-checked': {
//                                   color: '#8b5cf6'
//                                 },
//                                 '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                                   backgroundColor: '#8b5cf6'
//                                 }
//                               }}
//                             />
//                           </Box>
//                         </Box>

//                         {isProductEnabled && (
//                           <Box sx={{ p: 4 }}>
//                             {/* AI Extraction Section */}
//                             <Box
//                               sx={{
//                                 mb: 4,
//                                 p: 3,
//                                 borderRadius: 2,
//                                 background:
//                                   'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(124, 58, 237, 0.02))',
//                                 border: '1px solid rgba(139, 92, 246, 0.2)'
//                               }}
//                             >
//                               <Box
//                                 sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
//                               >
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                                   <Box
//                                     sx={{
//                                       width: 36,
//                                       height: 36,
//                                       borderRadius: 2,
//                                       background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
//                                       display: 'flex',
//                                       alignItems: 'center',
//                                       justifyContent: 'center'
//                                     }}
//                                   >
//                                     <AutoAwesomeOutlined sx={{ color: 'white', fontSize: 18 }} />
//                                   </Box>
//                                   <Box>
//                                     <Typography variant='subtitle1' fontWeight={600} color='#1f2937'>
//                                       AI Data Extraction
//                                     </Typography>
//                                     <Typography variant='body2' color='text.secondary'>
//                                       Automatically extract data from uploaded documents
//                                     </Typography>
//                                   </Box>
//                                 </Box>
//                                 <Button
//                                   variant='contained'
//                                   onClick={() => runAIDataExtraction(product._id)}
//                                   disabled={aiProcessing[product._id]}
//                                   startIcon={
//                                     aiProcessing[product._id] ? (
//                                       <CircularProgress size={18} color='inherit' />
//                                     ) : (
//                                       <AutoAwesomeOutlined />
//                                     )
//                                   }
//                                   sx={{
//                                     background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
//                                     '&:hover': {
//                                       background: 'linear-gradient(135deg, #7c3aed, #6d28d9)'
//                                     },
//                                     borderRadius: 2,
//                                     textTransform: 'none',
//                                     fontWeight: 600,
//                                     px: 3,
//                                     py: 1,
//                                     boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)'
//                                   }}
//                                 >
//                                   {aiProcessing[product._id] ? 'Processing...' : 'Extract with AI'}
//                                 </Button>
//                               </Box>

//                               {fileFieldsCount > 0 && (
//                                 <Box>
//                                   <Box
//                                     sx={{
//                                       display: 'flex',
//                                       justifyContent: 'space-between',
//                                       alignItems: 'center',
//                                       mb: 2
//                                     }}
//                                   >
//                                     <Typography variant='body2' color='text.secondary'>
//                                       Upload Progress: {populatedFieldsCount} of {fileFieldsCount} files
//                                     </Typography>
//                                     {uploadedFilesCount > 0 && (
//                                       <Chip
//                                         icon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
//                                         label={`${uploadedFilesCount} file${uploadedFilesCount > 1 ? 's' : ''} uploaded`}
//                                         size='small'
//                                         sx={{
//                                           bgcolor: '#dcfce7',
//                                           color: '#166534',
//                                           fontWeight: 500
//                                         }}
//                                       />
//                                     )}
//                                   </Box>
//                                   <LinearProgress
//                                     variant='determinate'
//                                     value={(populatedFieldsCount / fileFieldsCount) * 100}
//                                     sx={{
//                                       height: 8,
//                                       borderRadius: 4,
//                                       bgcolor: 'rgba(139, 92, 246, 0.1)',
//                                       '& .MuiLinearProgress-bar': {
//                                         background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
//                                         borderRadius: 4
//                                       }
//                                     }}
//                                   />
//                                 </Box>
//                               )}
//                             </Box>

//                             {/* Form Fields */}
//                             <Grid container spacing={3}>
//                               {/* Initial Values Section */}
//                               {product?.initFields?.isActive === true && (
//                                 <Grid item xs={12}>
//                                   <Card
//                                     elevation={0}
//                                     sx={{
//                                       border: '1px solid #e5e7eb',
//                                       borderRadius: 2,
//                                       mb: 3,
//                                       overflow: 'hidden'
//                                     }}
//                                   >
//                                     <Box
//                                       sx={{
//                                         p: 2,
//                                         bgcolor: '#f8fafc',
//                                         borderBottom: '1px solid #e5e7eb'
//                                       }}
//                                     >
//                                       <Typography variant='h6' fontWeight={600} color='#1f2937'>
//                                         📋 Initial Values
//                                       </Typography>
//                                       <Typography variant='body2' color='text.secondary'>
//                                         Pre-filled data from case initiation
//                                       </Typography>
//                                     </Box>
//                                     <Box sx={{ p: 3 }}>
//                                       <Grid container spacing={3}>
//                                         {product?.initFields?.fields?.map((field, idx) => (
//                                           <Grid item xs={12} sm={6} key={field.fieldName}>
//                                             {field.dataType === 'multiUpload' && Array.isArray(field.value) ? (
//                                               <Box sx={{ width: '100%' }}>
//                                                 <Typography
//                                                   variant='body2'
//                                                   color='text.secondary'
//                                                   sx={{ mb: 2, fontWeight: 500 }}
//                                                 >
//                                                   {field.fieldName}
//                                                 </Typography>
//                                                 <Box
//                                                   sx={{
//                                                     border: '1px solid #e5e7eb',
//                                                     borderRadius: 2,
//                                                     p: 2,
//                                                     backgroundColor: '#f9fafb'
//                                                   }}
//                                                 >
//                                                   <Stack spacing={1}>
//                                                     {field.value.map((fileUrl, fileIndex) => {
//                                                       const fileName =
//                                                         fileUrl.split('/').pop() || `File ${fileIndex + 1}`
//                                                       return (
//                                                         <Box
//                                                           key={fileIndex}
//                                                           sx={{
//                                                             display: 'flex',
//                                                             alignItems: 'center',
//                                                             justifyContent: 'space-between',
//                                                             p: 2,
//                                                             bgcolor: 'white',
//                                                             borderRadius: 2,
//                                                             border: '1px solid #e5e7eb',
//                                                             transition: 'all 0.2s ease',
//                                                             '&:hover': {
//                                                               boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                                                               transform: 'translateY(-1px)'
//                                                             }
//                                                           }}
//                                                         >
//                                                           <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
//                                                             <Box
//                                                               sx={{
//                                                                 width: 36,
//                                                                 height: 36,
//                                                                 borderRadius: 2,
//                                                                 bgcolor: isImageFile(fileName) ? '#f59e0b' : '#10b981',
//                                                                 display: 'flex',
//                                                                 alignItems: 'center',
//                                                                 justifyContent: 'center',
//                                                                 mr: 2,
//                                                                 flexShrink: 0
//                                                               }}
//                                                             >
//                                                               {isImageFile(fileName) ? (
//                                                                 <ImageOutlined sx={{ color: 'white', fontSize: 18 }} />
//                                                               ) : (
//                                                                 <InsertDriveFileOutlined
//                                                                   sx={{ color: 'white', fontSize: 18 }}
//                                                                 />
//                                                               )}
//                                                             </Box>
//                                                             <Box sx={{ flex: 1, minWidth: 0 }}>
//                                                               <Typography
//                                                                 variant='body2'
//                                                                 fontWeight={500}
//                                                                 sx={{
//                                                                   overflow: 'hidden',
//                                                                   textOverflow: 'ellipsis',
//                                                                   whiteSpace: 'nowrap'
//                                                                 }}
//                                                               >
//                                                                 {fileName}
//                                                               </Typography>
//                                                               <Typography variant='caption' color='text.secondary'>
//                                                                 {isImageFile(fileName) ? 'Image file' : 'Document file'}
//                                                               </Typography>
//                                                             </Box>
//                                                           </Box>
//                                                           <Button
//                                                             component='a'
//                                                             href={fileUrl}
//                                                             target='_blank'
//                                                             size='small'
//                                                             variant='outlined'
//                                                             startIcon={
//                                                               <Icon icon='tabler:external-link' fontSize='small' />
//                                                             }
//                                                             sx={{
//                                                               borderColor: '#e5e7eb',
//                                                               color: '#6b7280',
//                                                               '&:hover': {
//                                                                 borderColor: '#8b5cf6',
//                                                                 color: '#8b5cf6',
//                                                                 bgcolor: 'rgba(139, 92, 246, 0.05)'
//                                                               },
//                                                               textTransform: 'none',
//                                                               fontWeight: 500
//                                                             }}
//                                                           >
//                                                             View
//                                                           </Button>
//                                                         </Box>
//                                                       )
//                                                     })}
//                                                   </Stack>
//                                                 </Box>
//                                               </Box>
//                                             ) : (
//                                               <Box>
//                                                 <Typography
//                                                   variant='body2'
//                                                   color='text.secondary'
//                                                   sx={{ mb: 1, fontWeight: 500 }}
//                                                 >
//                                                   {field.fieldName}
//                                                 </Typography>
//                                                 <Box
//                                                   sx={{
//                                                     p: 2,
//                                                     borderRadius: 2,
//                                                     bgcolor: '#f9fafb',
//                                                     border: '1px solid #e5e7eb',
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     gap: 2
//                                                   }}
//                                                 >
//                                                   {field.dataType === 'file' && field.value ? (
//                                                     <>
//                                                       <Box
//                                                         sx={{
//                                                           width: 32,
//                                                           height: 32,
//                                                           borderRadius: 1,
//                                                           bgcolor: '#10b981',
//                                                           display: 'flex',
//                                                           alignItems: 'center',
//                                                           justifyContent: 'center'
//                                                         }}
//                                                       >
//                                                         <InsertDriveFileOutlined
//                                                           sx={{ color: 'white', fontSize: 16 }}
//                                                         />
//                                                       </Box>
//                                                       <Typography variant='body2' sx={{ flex: 1 }}>
//                                                         {field.value.split('/').pop() || 'File'}
//                                                       </Typography>
//                                                       <IconButton
//                                                         component='a'
//                                                         href={field.value}
//                                                         target='_blank'
//                                                         size='small'
//                                                         sx={{ color: '#8b5cf6' }}
//                                                       >
//                                                         <Icon icon='tabler:external-link' fontSize='small' />
//                                                       </IconButton>
//                                                     </>
//                                                   ) : (
//                                                     <Typography variant='body2' color='#1f2937'>
//                                                       {field.value || 'N/A'}
//                                                     </Typography>
//                                                   )}
//                                                 </Box>
//                                               </Box>
//                                             )}
//                                           </Grid>
//                                         ))}
//                                       </Grid>
//                                     </Box>
//                                   </Card>
//                                 </Grid>
//                               )}

//                               {/* Submit Fields Section */}
//                               <Grid item xs={12}>
//                                 <Card
//                                   elevation={0}
//                                   sx={{
//                                     border: '1px solid #e5e7eb',
//                                     borderRadius: 2,
//                                     overflow: 'hidden'
//                                   }}
//                                 >
//                                   <Box
//                                     sx={{
//                                       p: 2,
//                                       bgcolor: '#f0f9ff',
//                                       borderBottom: '1px solid #e5e7eb'
//                                     }}
//                                   >
//                                     <Typography variant='h6' fontWeight={600} color='#1f2937'>
//                                       ✏️ Submit Fields
//                                     </Typography>
//                                     <Typography variant='body2' color='text.secondary'>
//                                       Fill in the required information for case submission
//                                     </Typography>
//                                   </Box>
//                                   <Box sx={{ p: 3 }}>
//                                     <Grid container spacing={3}>
//                                      {product?.submitFields?.fields?.map(field => {
//                                       const currentValue = productFields[product._id]?.[field.fieldName] ?? field.value ?? ''
//                                       const fieldKey = `${product._id}_${field.fieldName}`
                                      
//                                       // Only show error if field is required AND has validation error
//                                       const hasError = field.isRequired ? Boolean(fieldErrors[fieldKey]) : false
//                                       const errorMessage = field.isRequired ? fieldErrors[fieldKey] : ''
                                      
//                                       // Show asterisk (*) only for required fields
//                                       const fieldLabel = `${field.fieldName.replace(/_/g, ' ')}${field.isRequired ? ' *' : ''}`

//                                       return (
//                                         <Grid item xs={12} sm={6} key={field.fieldName}>
//                                           {field.dataType === 'string' ? (
//                                             <Box>
//                                               <Typography
//                                                 variant='body2'
//                                                 color='text.secondary'
//                                                 sx={{ mb: 1, fontWeight: 500 }}
//                                               >
//                                                 {fieldLabel}
//                                               </Typography>
//                                               <CustomTextField
//                                                 type='text'
//                                                 value={currentValue}
//                                                 onChange={e =>
//                                                   handleProductFieldChange(
//                                                     product._id,
//                                                     field.fieldName,
//                                                     e.target.value
//                                                   )
//                                                 }
//                                                 fullWidth
//                                                 error={hasError}
//                                                 helperText={errorMessage}
//                                                 placeholder={`Enter ${field.fieldName.toLowerCase()}`}
//                                                 required={field.isRequired}
//                                                 sx={{
//                                                   '& .MuiOutlinedInput-root': {
//                                                     borderRadius: 2,
//                                                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: '#8b5cf6'
//                                                     },
//                                                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: '#8b5cf6'
//                                                     }
//                                                   }
//                                                 }}
//                                               />
//                                             </Box>
//                                           ) : field.dataType === 'textarea' ? (
//                                             <Box>
//                                               <Typography
//                                                 variant='body2'
//                                                 color='text.secondary'
//                                                 sx={{ mb: 1, fontWeight: 500 }}
//                                               >
//                                                 {fieldLabel}
//                                               </Typography>
//                                               <CustomTextField
//                                                 multiline
//                                                 rows={4}
//                                                 value={currentValue}
//                                                 onChange={e =>
//                                                   handleProductFieldChange(
//                                                     product._id,
//                                                     field.fieldName,
//                                                     e.target.value
//                                                   )
//                                                 }
//                                                 fullWidth
//                                                 error={hasError}
//                                                 helperText={errorMessage}
//                                                 placeholder={`Enter ${field.fieldName.toLowerCase()}`}
//                                                 required={field.isRequired}
//                                                 sx={{
//                                                   '& .MuiOutlinedInput-root': {
//                                                     borderRadius: 2,
//                                                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: '#8b5cf6'
//                                                     },
//                                                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: '#8b5cf6'
//                                                     }
//                                                   }
//                                                 }}
//                                               />
//                                             </Box>
//                                           ) : field.dataType === 'date' ? (
//                                             <Box>
//                                               <Typography
//                                                 variant='body2'
//                                                 color='text.secondary'
//                                                 sx={{ mb: 1, fontWeight: 500 }}
//                                               >
//                                                 {fieldLabel}
//                                               </Typography>
//                                               <CustomTextField
//                                                 fullWidth
//                                                 type='date'
//                                                 value={currentValue || new Date().toISOString().split('T')[0]}
//                                                 onChange={e =>
//                                                   handleProductFieldChange(
//                                                     product._id,
//                                                     field.fieldName,
//                                                     e.target.value
//                                                   )
//                                                 }
//                                                 error={hasError}
//                                                 helperText={errorMessage}
//                                                 placeholder={`Select ${field.fieldName.toLowerCase()}`}
//                                                 required={field.isRequired}
//                                                 InputLabelProps={{
//                                                   shrink: true
//                                                 }}
//                                                 sx={{
//                                                   '& .MuiOutlinedInput-root': {
//                                                     borderRadius: 2,
//                                                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: '#8b5cf6'
//                                                     },
//                                                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: '#8b5cf6'
//                                                     }
//                                                   }
//                                                 }}
//                                               />
//                                             </Box>
//                                           ) : field.dataType === 'file' ? (
//                                             <Box sx={{ width: '100%' }}>
//                                               <Typography
//                                                 variant='body2'
//                                                 color='text.secondary'
//                                                 sx={{ mb: 1, fontWeight: 500 }}
//                                               >
//                                                 {fieldLabel}
//                                               </Typography>
//                                               <Box
//                                                 sx={{
//                                                   border: '2px dashed #d1d5db',
//                                                   borderRadius: 3,
//                                                   p: 3,
//                                                   minHeight: 120,
//                                                   backgroundColor: '#fafafa',
//                                                   cursor: 'pointer',
//                                                   display: 'flex',
//                                                   alignItems: 'center',
//                                                   justifyContent: 'center',
//                                                   transition: 'all 0.3s ease',
//                                                   '&:hover': {
//                                                     borderColor: '#8b5cf6',
//                                                     backgroundColor: 'rgba(139, 92, 246, 0.02)',
//                                                     transform: 'translateY(-2px)',
//                                                     boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
//                                                   }
//                                                 }}
//                                                 onClick={() => {
//                                                   if (
//                                                     !productFields[product._id]?.[field.fieldName] &&
//                                                     !uploadingFiles[fieldKey]
//                                                   ) {
//                                                     document.getElementById(`file-input-${fieldKey}`).click()
//                                                   }
//                                                 }}
//                                               >
//                                                 {uploadingFiles[fieldKey] ? (
//                                                   <Box sx={{ textAlign: 'center' }}>
//                                                     <CircularProgress size={40} sx={{ mb: 2, color: '#8b5cf6' }} />
//                                                     <Typography
//                                                       variant='body2'
//                                                       color='text.secondary'
//                                                       fontWeight={500}
//                                                     >
//                                                       Uploading file...
//                                                     </Typography>
//                                                   </Box>
//                                                 ) : productFields[product._id]?.[field.fieldName] ? (
//                                                   <Box
//                                                     sx={{
//                                                       display: 'flex',
//                                                       alignItems: 'center',
//                                                       justifyContent: 'space-between',
//                                                       width: '100%',
//                                                       p: 2,
//                                                       bgcolor: 'white',
//                                                       borderRadius: 2,
//                                                       border: '1px solid #e5e7eb'
//                                                     }}
//                                                   >
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                                                       <Box
//                                                         sx={{
//                                                           width: 48,
//                                                           height: 48,
//                                                           borderRadius: 2,
//                                                           bgcolor: isImageFile(
//                                                             productFields[product._id]?.[
//                                                               `${field.fieldName}_filename`
//                                                             ]
//                                                           )
//                                                             ? '#f59e0b'
//                                                             : '#10b981',
//                                                           display: 'flex',
//                                                           alignItems: 'center',
//                                                           justifyContent: 'center'
//                                                         }}
//                                                       >
//                                                         {isImageFile(
//                                                           productFields[product._id]?.[`${field.fieldName}_filename`]
//                                                         ) ? (
//                                                           <ImageOutlined sx={{ color: 'white', fontSize: 24 }} />
//                                                         ) : (
//                                                           <DescriptionOutlined
//                                                             sx={{ color: 'white', fontSize: 24 }}
//                                                           />
//                                                         )}
//                                                       </Box>
//                                                       <Box>
//                                                         <Typography variant='body1' fontWeight={600}>
//                                                           {productFields[product._id]?.[
//                                                             `${field.fieldName}_filename`
//                                                           ] ||
//                                                             productFields[product._id]?.[field.fieldName]
//                                                               .split('/')
//                                                               .pop() ||
//                                                             'Uploaded file'}
//                                                         </Typography>
//                                                         <Typography variant='caption' color='text.secondary'>
//                                                           {isImageFile(
//                                                             productFields[product._id]?.[
//                                                               `${field.fieldName}_filename`
//                                                             ]
//                                                           )
//                                                             ? 'Image file'
//                                                             : 'Document file'}
//                                                         </Typography>
//                                                       </Box>
//                                                     </Box>
//                                                     <IconButton
//                                                       size='small'
//                                                       onClick={e => {
//                                                         e.stopPropagation()
//                                                         handleRemoveFile(product._id, field.fieldName)
//                                                       }}
//                                                       sx={{
//                                                         color: '#ef4444',
//                                                         bgcolor: 'rgba(239, 68, 68, 0.1)',
//                                                         '&:hover': {
//                                                           bgcolor: 'rgba(239, 68, 68, 0.2)'
//                                                         }
//                                                       }}
//                                                     >
//                                                       <DeleteOutlined />
//                                                     </IconButton>
//                                                   </Box>
//                                                 ) : (
//                                                   <Box sx={{ textAlign: 'center' }}>
//                                                     <CloudUploadOutlined
//                                                       sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }}
//                                                     />
//                                                     <Typography
//                                                       variant='h6'
//                                                       fontWeight={600}
//                                                       color='#1f2937'
//                                                       sx={{ mb: 1 }}
//                                                     >
//                                                       Drop files here or browse
//                                                     </Typography>
//                                                     <Typography variant='body2' color='text.secondary'>
//                                                       Supports all file types
//                                                     </Typography>
//                                                   </Box>
//                                                 )}
//                                                 <input
//                                                   id={`file-input-${fieldKey}`}
//                                                   type='file'
//                                                   style={{ display: 'none' }}
//                                                   disabled={uploadingFiles[fieldKey]}
//                                                   onChange={e => {
//                                                     if (e.target.files?.[0]) {
//                                                       handleFileUpload(
//                                                         e.target.files[0],
//                                                         product._id,
//                                                         field.fieldName
//                                                       )
//                                                     }
//                                                   }}
//                                                 />
//                                               </Box>
//                                               {hasError && (
//                                                 <Typography
//                                                   color='error'
//                                                   variant='caption'
//                                                   sx={{ mt: 1, display: 'block' }}
//                                                 >
//                                                   {errorMessage}
//                                                 </Typography>
//                                               )}
//                                             </Box>
//                                           ) : field.dataType === 'multiUpload' ? (
//                                             <Box sx={{ width: '100%' }}>
//                                               <Typography
//                                                 variant='body2'
//                                                 color='text.secondary'
//                                                 sx={{ mb: 1, fontWeight: 500 }}
//                                               >
//                                                 {fieldLabel}
//                                               </Typography>
//                                               <Box
//                                                 sx={{
//                                                   border: '2px dashed #d1d5db',
//                                                   borderRadius: 3,
//                                                   p: 3,
//                                                   minHeight: 160,
//                                                   backgroundColor: '#fafafa',
//                                                   cursor: 'pointer',
//                                                   transition: 'all 0.3s ease',
//                                                   '&:hover': {
//                                                     borderColor: '#8b5cf6',
//                                                     backgroundColor: 'rgba(139, 92, 246, 0.02)',
//                                                     transform: 'translateY(-2px)',
//                                                     boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
//                                                   }
//                                                 }}
//                                                 onClick={() => {
//                                                   document.getElementById(`multi-file-input-${fieldKey}`).click()
//                                                 }}
//                                               >
//                                                 {/* Upload area */}
//                                                 <Box sx={{ textAlign: 'center', mb: 3 }}>
//                                                   <CloudUploadOutlined
//                                                     sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }}
//                                                   />
//                                                   <Typography
//                                                     variant='h6'
//                                                     fontWeight={600}
//                                                     color='#1f2937'
//                                                     sx={{ mb: 1 }}
//                                                   >
//                                                     Drop multiple files here or browse
//                                                   </Typography>
//                                                   <Typography variant='body2' color='text.secondary'>
//                                                     Upload multiple documents at once
//                                                   </Typography>
//                                                 </Box>

//                                                 {/* File list */}
//                                                 <Stack spacing={2}>
//                                                   {/* Uploading files */}
//                                                   {uploadingFiles[`${fieldKey}_items`]?.map((item, index) => (
//                                                     <Box
//                                                       key={`uploading-${index}`}
//                                                       sx={{
//                                                         p: 3,
//                                                         bgcolor: 'white',
//                                                         borderRadius: 2,
//                                                         border: '1px solid #e5e7eb',
//                                                         boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//                                                       }}
//                                                     >
//                                                       <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                                                         <Box
//                                                           sx={{
//                                                             width: 40,
//                                                             height: 40,
//                                                             borderRadius: 2,
//                                                             bgcolor: item.status === 'error' ? '#ef4444' : '#8b5cf6',
//                                                             display: 'flex',
//                                                             alignItems: 'center',
//                                                             justifyContent: 'center',
//                                                             mr: 2
//                                                           }}
//                                                         >
//                                                           <InsertDriveFileOutlined
//                                                             sx={{ color: 'white', fontSize: 20 }}
//                                                           />
//                                                         </Box>
//                                                         <Box sx={{ flex: 1 }}>
//                                                           <Typography variant='body1' fontWeight={600}>
//                                                             {item.filename}
//                                                           </Typography>
//                                                           <Typography variant='caption' color='text.secondary'>
//                                                             {item.size ? `${Math.round(item.size / 1024)} KB` : ''}
//                                                           </Typography>
//                                                         </Box>
//                                                         <Chip
//                                                           label={
//                                                             item.status === 'error'
//                                                               ? 'Failed'
//                                                               : `${item.progress || 0}%`
//                                                           }
//                                                           size='small'
//                                                           color={item.status === 'error' ? 'error' : 'primary'}
//                                                           sx={{ fontWeight: 500 }}
//                                                         />
//                                                       </Box>
//                                                       <LinearProgress
//                                                         variant='determinate'
//                                                         value={item.progress || 0}
//                                                         sx={{
//                                                           height: 6,
//                                                           borderRadius: 3,
//                                                           bgcolor:
//                                                             item.status === 'error'
//                                                               ? '#fee2e2'
//                                                               : 'rgba(139, 92, 246, 0.1)',
//                                                           '& .MuiLinearProgress-bar': {
//                                                             bgcolor: item.status === 'error' ? '#ef4444' : '#8b5cf6',
//                                                             borderRadius: 3
//                                                           }
//                                                         }}
//                                                       />
//                                                     </Box>
//                                                   ))}

//                                                   {/* Uploaded files */}
//                                                   {Array.isArray(productFields[product._id]?.[field.fieldName]) &&
//                                                     productFields[product._id]?.[field.fieldName].map(
//                                                       (fileUrl, index) => {
//                                                         const filename =
//                                                           productFields[product._id]?.[
//                                                             `${field.fieldName}_filenames`
//                                                           ]?.[index] || fileUrl.split('/').pop()
//                                                         const isImage = isImageFile(filename)

//                                                         return (
//                                                           <Box
//                                                             key={`uploaded-${index}`}
//                                                             sx={{
//                                                               p: 3,
//                                                               bgcolor: 'white',
//                                                               borderRadius: 2,
//                                                               border: '1px solid #e5e7eb',
//                                                               display: 'flex',
//                                                               alignItems: 'center',
//                                                               justifyContent: 'space-between',
//                                                               boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                                                               transition: 'all 0.2s ease',
//                                                               '&:hover': {
//                                                                 boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                                                                 transform: 'translateY(-1px)'
//                                                               }
//                                                             }}
//                                                           >
//                                                             <Box
//                                                               sx={{ display: 'flex', alignItems: 'center', flex: 1 }}
//                                                             >
//                                                               <Box
//                                                                 sx={{
//                                                                   width: 40,
//                                                                   height: 40,
//                                                                   borderRadius: 2,
//                                                                   bgcolor: isImage ? '#f59e0b' : '#10b981',
//                                                                   display: 'flex',
//                                                                   alignItems: 'center',
//                                                                   justifyContent: 'center',
//                                                                   mr: 2
//                                                                 }}
//                                                               >
//                                                                 {isImage ? (
//                                                                   <ImageOutlined
//                                                                     sx={{ color: 'white', fontSize: 20 }}
//                                                                   />
//                                                                 ) : (
//                                                                   <DescriptionOutlined
//                                                                     sx={{ color: 'white', fontSize: 20 }}
//                                                                   />
//                                                                 )}
//                                                               </Box>
//                                                               <Box sx={{ flex: 1, minWidth: 0 }}>
//                                                                 <Typography
//                                                                   variant='body1'
//                                                                   fontWeight={600}
//                                                                   sx={{
//                                                                     overflow: 'hidden',
//                                                                     textOverflow: 'ellipsis',
//                                                                     whiteSpace: 'nowrap'
//                                                                   }}
//                                                                 >
//                                                                   {filename}
//                                                                 </Typography>
//                                                                 <Typography variant='caption' color='text.secondary'>
//                                                                   {isImage ? 'Image file' : 'Document file'}
//                                                                 </Typography>
//                                                               </Box>
//                                                             </Box>
//                                                             <IconButton
//                                                               size='small'
//                                                               onClick={e => {
//                                                                 e.stopPropagation()
//                                                                 handleRemoveFile(product._id, field.fieldName, index)
//                                                               }}
//                                                               sx={{
//                                                                 color: '#ef4444',
//                                                                 bgcolor: 'rgba(239, 68, 68, 0.1)',
//                                                                 '&:hover': {
//                                                                   bgcolor: 'rgba(239, 68, 68, 0.2)'
//                                                                 }
//                                                               }}
//                                                             >
//                                                               <DeleteOutlined />
//                                                             </IconButton>
//                                                           </Box>
//                                                         )
//                                                       }
//                                                     )}
//                                                 </Stack>

//                                                 <input
//                                                   id={`multi-file-input-${fieldKey}`}
//                                                   type='file'
//                                                   multiple
//                                                   style={{ display: 'none' }}
//                                                   onChange={e => {
//                                                     if (e.target.files?.length) {
//                                                       const filesArray = Array.from(e.target.files)
//                                                       handleMultiFileUpload(filesArray, product._id, field.fieldName)
//                                                     }
//                                                   }}
//                                                 />
//                                               </Box>
//                                               {hasError && (
//                                                 <Typography
//                                                   color='error'
//                                                   variant='caption'
//                                                   sx={{ mt: 1, display: 'block' }}
//                                                 >
//                                                   {errorMessage}
//                                                 </Typography>
//                                               )}
//                                             </Box>
//                                           ) : null}
//                                         </Grid>
//                                       )
//                                     })}
//                                     </Grid>
//                                   </Box>
//                                 </Card>
//                               </Grid>
//                             </Grid>
//                           </Box>
//                         )}
//                       </Card>
//                     )
//                   })}
//                 </Stack>
//               </CardContent>
//             </Card>
//           )}
//         </Box>

//         {/* Action Buttons */}
//         <Box
//           sx={{
//             p: 4,
//             borderTop: '1px solid #e5e7eb',
//             background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: 2
//           }}
//         >
//           <Button
//             variant='outlined'
//             onClick={handleCloseAddModal}
//             sx={{
//               borderColor: '#d1d5db',
//               color: '#6b7280',
//               '&:hover': {
//                 borderColor: '#9ca3af',
//                 bgcolor: 'rgba(107, 114, 128, 0.05)'
//               },
//               borderRadius: 2,
//               textTransform: 'none',
//               fontWeight: 600,
//               px: 4,
//               py: 1.5,
//               minWidth: 120
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant='contained'
//             onClick={handleFormSubmit}
//             sx={{
//               background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
//               '&:hover': {
//                 background: 'linear-gradient(135deg, #7c3aed, #6d28d9)'
//               },
//               borderRadius: 2,
//               textTransform: 'none',
//               fontWeight: 600,
//               px: 4,
//               py: 1.5,
//               minWidth: 120,
//               boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
//               '&:hover': {
//                 boxShadow: '0 6px 20px 0 rgba(139, 92, 246, 0.5)',
//                 transform: 'translateY(-1px)'
//               }
//             }}
//           >
//             Update Case
//           </Button>
//         </Box>
//       </Modal>

//       <Modal
//         open={reportOpen}
//         handleClose={handleCloseReportModal}
//         aria-labelledby='report-modal-title'
//         title='Report Generation'
//         maxWidth='sm'
//         showButton={false}
//       >
//         <Grid container spacing={2} padding={'12px'}>
//           <Grid item xs={12} sm={6}>
//             <CustomTextField
//               label='Select Product Template'
//               select
//               value={selectedTemplate}
//               onChange={e => setSelectedTemplate(e.target.value)}
//               fullWidth
//             >
//               {templates.map(template => (
//                 <MenuItem key={template._id} value={template._id}>
//                   {template.templateName}
//                 </MenuItem>
//               ))}
//             </CustomTextField>
//           </Grid>
//           {selectedTemplate && (
//             <Grid item xs={12} sm={6} mt={2}>
//               <Button
//                 variant='contained'
//                 color='primary'
//                 onClick={generatePDF}
//                 disabled={isGenerating}
//                 startIcon={isGenerating ? <CircularProgress size={20} color='inherit' /> : null}
//               >
//                 Generate PDF
//               </Button>
//             </Grid>
//           )}
//         </Grid>
//       </Modal>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant='filled'>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   )
// }

// export default InitDashboard

"use client"
import React, { useState, useEffect } from "react"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid"
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
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material"
import Icon from "../../home/DynamicIcon"
// import {
//   generatePDFApi,
//   getAllEmployeeApi,
//   getAllPDFtemplateById,
//   getAllUnfilteredInitCasesApi,
//   getInitDashBoardCount,
//   getMyPartnersAPI,
//   getpartnerproduct,
// } from "@/services/apiService"
import {
  generatePDFApi,
  getAiDataAPI,
  getAllEmployeeApi,
  getAllLocationsAPI,
  getAllPDFtemplateById,
  getAllServicesApi,
  getAllUnfilteredInitCasesApi,
  getInitDashBoardCount,
  getMyPartnersAPI,
  getpartnerproduct,
  updateAddCasesApi,
  uploadImageApi,
  uploadMultiImageApi
} from '@/services/apiService'
import {
  CloudUploadOutlined,
  DeleteOutlined,
  AutoAwesomeOutlined,
  DescriptionOutlined,
  ImageOutlined,
} from "@mui/icons-material"
import CustomTextField from "@/@core/components/mui/TextField"
import Modal from "@/app/(dashboard)/commandexe/components/modal"

const getFileNameFromUrl = (url) => {
  try {
    const urlParts = url.split("/")
    const lastPart = urlParts[urlParts.length - 1]
    const cleanName = lastPart.replace(/^\d+_/, "")
    return cleanName || "Unknown File"
  } catch (error) {
    return "Unknown File"
  }
}

const MultiUploadComponent = ({ value }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = (e) => {
    e.stopPropagation()
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleViewFile = (url, e) => {
    e.stopPropagation()
    window.open(url, "_blank")
  }

  const fileCount = Array.isArray(value) ? value.length : 0

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2">{fileCount > 0 ? `${fileCount} file(s)` : "0 files"}</Typography>
        {fileCount > 0 && (
          <IconButton size="small" onClick={handleOpenDialog} sx={{ p: 0.25 }} title="View all files">
            <Icon icon="tabler:eye" fontSize="small" color="#0082c6" />
          </IconButton>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon icon="tabler:files" fontSize="medium" color="#0082c6" />
            <Typography variant="h6">Uploaded Files ({fileCount})</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 0, py: 1 }}>
          <List sx={{ width: "100%" }}>
            {Array.isArray(value) &&
              value.map((url, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 3, py: 1.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {getFileNameFromUrl(url)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Click view to open in new tab
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => handleViewFile(url, e)}
                        size="small"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                          borderRadius: 1,
                          px: 1.5,
                          py: 0.5,
                        }}
                      >
                        <Icon icon="tabler:external-link" fontSize="small" />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
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
          <Button onClick={handleCloseDialog} variant="outlined" startIcon={<Icon icon="tabler:x" />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const InitDashboard = ({ title = "BACKOFFICE DASHBOARD" }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [partners, setPartners] = useState([])
  const [counts, setCounts] = useState({})
  const [startDateFilter, setStartDateFilter] = useState("")
  const [endDateFilter, setEndDateFilter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(100)
  const [totalCount, setTotalCount] = useState(0)
  const [rows, setRows] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [selectedService, setSelectedService] = useState("")
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
  const [locations, setLocations] = useState([])
  const [pId, setPId] = useState(null)
  const [services, setServices] = useState([])
  const [aiResponseData, setAiResponseData] = useState({})
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [reportOpen, setReportOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [emps, setEmps] = useState([])
  const [dateRange, setDateRange] = useState("")

  // New state for sign upload
  const [signFile, setSignFile] = useState("")
  const [signFileName, setSignFileName] = useState("")
  const [uploadingSign, setUploadingSign] = useState(false)
  const [partnerData, setPartnerData] = useState(null)
  const [existingSignUrl, setExistingSignUrl] = useState("")

  const handleOpenReportModal = (row) => {
    setReportOpen(true)
    setSelectedReport(row._id)
    fetchTemplates(row.reportType._id)
  }

  const handleCloseReportModal = () => {
    setReportOpen(false)
    setSelectedReport(null)
  }

  const fetchTemplates = async (productId) => {
    console.log("Fetching templates for productId:", productId)
    try {
      const response = await getAllPDFtemplateById(productId)
      console.log("Templates:", response)
      if (response.status) {
        setTemplates(response.items)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const generatePDF = async (event) => {
    event.preventDefault()
    try {
      setIsGenerating(true)
      const payload = {
        tempId: selectedTemplate,
        initId: selectedReport,
      }
      const response = await generatePDFApi(payload)
      console.log("PDF generation response:", response)
      if (response.status) {
        setSnackbar({
          open: true,
          message: "PDF generated successfully!",
          severity: "success",
        })
      } else {
        setSnackbar({
          open: true,
          message: "Failed to generate PDF",
          severity: "error",
        })
      }
    } catch (error) {
      console.error(error)
      setSnackbar({
        open: true,
        message: "Error generating PDF",
        severity: "error",
      })
    } finally {
      setIsGenerating(false)
      handleCloseReportModal()
      fetchAddCases()
    }
  }

  const handleChangeRowsPerPage = (event) => {
    const newPageLimit = Number.parseInt(event.target.value, 10)
    setPageLimit(newPageLimit)
    setPage(1)
  }

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

  useEffect(() => {
    fetchAddCases()
  }, [selectedService, selectedEmployee, dateRange, startDateFilter, endDateFilter])

  const fetchPartners = async () => {
    try {
      const data = await getMyPartnersAPI()
      if (data.status) {
        setPartners(data.items)
        console.log("partners", data.items)
      } else {
        console.error("Failed to fetch partners:", data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchDashBoardCount = async () => {
    try {
      setIsLoading(true)
      const res = await getInitDashBoardCount()
      console.log("Dashboard counts response:", res)
      if (res && res.status) {
        setCounts({
          totalCases: res.items.all || 0,
          wipCases: res.items.wip || 0,
          pendingCases: res.items.pending || 0,
          generatedCases: res.items.generated || 0,
        })
      } else {
        console.error("Failed to fetch dashboard counts:", res.message || "Unknown error")
      }
    } catch (error) {
      console.error("Error fetching dashboard counts:", error)
      setSnackbar({
        open: true,
        message: "Failed to load dashboard counts",
        severity: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAddCases = async () => {
    try {
      setIsLoading(true)
      const statusParam = status === "all" ? "all" : status
      const partnerParam = selectedEmployee === "all" ? "" : selectedEmployee
      console.log("Fetching cases with filters:", {
        status: statusParam,
        partner: partnerParam,
        range: dateRange,
        startDate: startDateFilter,
        endDate: endDateFilter,
      })
      const data = await getAllUnfilteredInitCasesApi(
        selectedService,
        partnerParam,
        dateRange,
        startDateFilter,
        endDateFilter,
      )
      console.log("All INIT cases data:", data)
      if (data?.items) {
        setRows(
          data.items.map((item) => ({
            _id: item._id,
            fileNo: item.fileNo,
            partnerName: item.partnerId?.name || "N/A",
            partnerId: item.partnerId?._id || "N/A",
            pId: item.partnerId?._id || "N/A",
            customerName: item.customerName,
            fatherName: item.fatherName,
            contactNo: item.contactNo,
            address: item.address,
            initFields: item.initFields || [],
            serviceId: item.referServiceId._id || "N/A",
            doneBy: item.doneBy?.employeName || "N/A",
            officeEmp: item.allocatedOfficeEmp?.employeName || "N/A",
            createdAt: item.createdAt || "N/A",
            customerId: item.customerId || item._id,
            requestData: item.requestData || {},
            serviceName: item.referServiceId.serviceName || "N/A",
            workStatus: item.workStatus || "N/A",
            reportType: item.reportType || "N/A",
            wordUrl: item.wordUrl || [],
            reportUrl: item.reportUrl || [],
            reportStatus: item.reportStatus || "N/A",
            reportDate: item.reportDate || "N/A",
            reportTAT: item.reportTAT || "0",
            edit: true,
            delete: false,
            view: false,
          })),
        )
        setTotalCount(data.totalCount || data.items.length)
      } else {
        console.error("Failed to fetch cases:", data?.message)
        setRows([])
      }
    } catch (err) {
      console.error("Error fetching cases:", err)
      setSnackbar({
        open: true,
        message: "Failed to load cases data",
        severity: "error",
      })
    } finally {
      setIsLoading(false)
      fetchDashBoardCount()
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleEmployeeSelectChange = (event) => {
    const selectedValue = event.target.value
    console.log("Employee selection changed:", selectedValue)
    setSelectedEmployee(selectedValue)
    setPage(1)
  }

  const handleServiceSelectChange = (event) => {
    const selectedValue = event.target.value
    console.log("Service selection changed:", selectedValue)
    setSelectedService(selectedValue)
    setPage(1)
  }

  const handleStatusChange = (event) => {
    const selectedValue = event.target.value
    console.log("Status change event:", selectedValue)
    setStatus(selectedValue)
    setPage(1)
  }

  const handleDateRangeChange = (event) => {
    const selectedValue = event.target.value
    console.log("Date range change event:", selectedValue)
    setDateRange(selectedValue)
    setPage(1)
  }

  const stringToColor = (string) => {
    if (!string) return "#1976d2"
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = "#"
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    return color
  }

  const stats = [
    {
      label: "Total Cases",
      value: counts.totalCases || 0,
      icon: <Icon icon="tabler:clipboard-list" fontSize={24} />,
      textColor: "#1A237E",
      bgColor: "#E3F2FD",
      borderColor: "#90CAF9",
    },
    {
      label: "Pending cases",
      value: counts.pendingCases || 0,
      icon: <Icon icon="tabler:hourglass" fontSize={24} />,
      textColor: "#6A1B9A",
      bgColor: "#F3E5F5",
      borderColor: "#CE93D8",
    },
    {
      label: "WiP Cases",
      value: counts.wipCases || 0,
      icon: <Icon icon="tabler:hourglass" fontSize={24} />,
      textColor: "#FF6F00",
      bgColor: "#FFF3E0",
      borderColor: "#FFCC80",
    },
    {
      label: "Generated Cases",
      value: counts.generatedCases || 0,
      icon: <Icon icon="tabler:file-check" fontSize={24} />,
      textColor: "#1B5E20",
      bgColor: "#E8F5E9",
      borderColor: "#A5D6A7",
    },
  ]

  const generateDynamicColumns = (sampleRow) => {
    if (!sampleRow?.initFields || !Array.isArray(sampleRow.initFields)) {
      return []
    }
    return sampleRow.initFields.map((field, index) => ({
      field: `initField_${index}`,
      headerName: `${field.fieldName.replace(/_/g, " ")}`,
      minWidth: 150,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon={getIconForDataType(field.dataType)} fontSize="small" />
          <Typography variant="subtitle2">{field.fieldName.replace(/_/g, " ")}</Typography>
        </Box>
      ),
      renderCell: (params) => {
        const fieldValue = params.row.initFields?.[index]?.value
        return (
          <Tooltip title={formatFieldValue(fieldValue, field.dataType) || "N/A"}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
              <Icon icon={getIconForDataType(field.dataType)} fontSize="small" color="#0082c6" />
              <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                {renderFieldValue(fieldValue, field.dataType)}
              </Typography>
            </Box>
          </Tooltip>
        )
      },
    }))
  }

  const getIconForDataType = (dataType) => {
    switch (dataType) {
      case "string":
        return "tabler:user-circle"
      case "file":
        return "tabler:file"
      case "multiUpload":
        return "tabler:files"
      case "textarea":
        return "tabler:info-circle"
      default:
        return "tabler:info-circle"
    }
  }

  const formatFieldValue = (value, dataType) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return "N/A"
    }
    switch (dataType) {
      case "multiUpload":
        return Array.isArray(value) ? `${value.length} file(s)` : "N/A"
      case "file":
        return value ? "File uploaded" : "N/A"
      case "textarea":
      case "string":
      default:
        return String(value)
    }
  }

  const handleDownload = (url, fileName) => {
    window.open(url, "_blank")
  }

  const handleMultipleDownload = (urls) => {
    urls.forEach((url) => {
      window.open(url, "_blank")
    })
  }

  const renderFieldValue = (value, dataType) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return (
        <Typography variant="body2" color="text.secondary" noWrap>
          N/A
        </Typography>
      )
    }
    switch (dataType) {
      case "multiUpload":
        return <MultiUploadComponent value={value} />
      case "file":
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return (
            <Typography variant="body2" color="textSecondary">
              No file
            </Typography>
          )
        }
        const fileUrl = Array.isArray(value) ? value[0] : value
        const fileName = getFileNameFromUrl(fileUrl)
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "150px",
              }}
              title={fileName}
            >
              {fileName}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                handleDownload(fileUrl, fileName)
              }}
              sx={{ p: 0.25 }}
              title="Download file"
            >
              <Icon icon="tabler:download" fontSize="small" color="#0082c6" />
            </IconButton>
          </Box>
        )
      case "textarea":
        return (
          <Typography
            variant="body2"
            noWrap
            sx={{
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {String(value)}
          </Typography>
        )
      case "string":
      default:
        return (
          <Typography variant="body2" noWrap>
            {String(value)}
          </Typography>
        )
    }
  }

  const columns = [
    {
      field: "partnerName",
      headerName: "Client Name",
      minWidth: 180,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:user-circle" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.row.partnerName || "N/A"}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: "0.875rem",
                bgcolor: stringToColor(params.row.partnerName || ""),
              }}
            >
              {params.row.partnerName ? params.row.partnerName.charAt(0).toUpperCase() : "?"}
            </Avatar>
            <Typography variant="body2" noWrap>
              {params.row.partnerName || "N/A"}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      minWidth: 180,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:file" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.row.serviceName || "N/A"}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: "0.875rem",
                bgcolor: stringToColor(params.row.serviceName || ""),
              }}
            >
              {params.row.serviceName ? params.row.serviceName.charAt(0).toUpperCase() : "?"}
            </Avatar>
            <Typography variant="body2" noWrap>
              {params.row.serviceName || "N/A"}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    ...(rows.length > 0 ? generateDynamicColumns(rows[0]) : []),
    {
      field: "createdAt",
      headerName: "Initiation Date",
      minWidth: 130,
      flex: 0.8,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:calendar-check" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => {
        const dateStr = params.row.createdAt || ""
        let formattedDate = "N/A"
        if (dateStr) {
          try {
            const date = new Date(dateStr.replace(/ (AM|PM)$/, ""))
            formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "Invalid Date"
          } catch (e) {
            formattedDate = "Invalid Date"
          }
        }
        return (
          <Tooltip title={formattedDate}>
            <Typography variant="body2" noWrap>
              {formattedDate}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      field: "doneBy",
      headerName: "Cases Added By",
      minWidth: 150,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:user-check" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.row.doneBy || "N/A"}>
          <Typography variant="body2" noWrap>
            {params.row.doneBy || "N/A"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "officeEmp",
      headerName: "Allocated To",
      minWidth: 150,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:user-check" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.row.officeEmp || "N/A"}>
          <Typography variant="body2" noWrap>
            {params.row.officeEmp || "N/A"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "reportStatus",
      headerName: "Report Status",
      minWidth: 150,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:file" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.row.reportStatus || "N/A"}>
          <Typography variant="body2" noWrap>
            {params.row.reportStatus || "N/A"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "reportDate",
      headerName: "Report Date",
      minWidth: 130,
      flex: 0.8,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:calendar-check" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => {
        const dateStr = params.row.reportDate || ""
        let formattedDate = "N/A"
        if (dateStr) {
          try {
            const date = new Date(dateStr.replace(/ (AM|PM)$/, ""))
            formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "N/A"
          } catch (e) {
            formattedDate = "N/A"
          }
        }
        return (
          <Tooltip title={formattedDate}>
            <Typography variant="body2" noWrap>
              {formattedDate}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      field: "reportTAT",
      headerName: "Report TAT",
      minWidth: 150,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:file" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.row.reportTAT || "N/A"}>
          <Typography variant="body2" noWrap>
            {params.row.reportTAT || "N/A"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 120,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:edit" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenAddModal(params.row)
              }}
            >
              <Icon icon="tabler:edit" fontSize="small" />
              Update
            </Button>
          </Box>
        )
      },
    },
    {
      field: "report",
      headerName: "Report Generation",
      minWidth: 180,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:report" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              disabled={params.row.workStatus !== "completed"}
              onClick={(e) => {
                e.stopPropagation()
                handleOpenReportModal(params.row)
              }}
            >
              <Icon icon="tabler:report" fontSize="small" />
              Generate Report
            </Button>
          </Box>
        )
      },
    },
    {
      field: "Pdf",
      headerName: "PDF Url",
      minWidth: 180,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:report" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              disabled={params.row.workStatus !== "reportgenerated"}
              onClick={(e) => {
                e.stopPropagation()
                handleDownloadPDF(params.row.reportUrl)
              }}
            >
              <Icon icon="tabler:report" fontSize="small" />
              View PDF
            </Button>
          </Box>
        )
      },
    },
  ]

  const handleDownloadPDF = (urls) => {
    console.log("Downloading PDF with URLs:", urls)
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      setSnackbar({ open: true, message: "No PDF available for this case", severity: "warning" })
      return
    }
    const lastUrl = urls[urls.length - 1]
    if (!lastUrl) {
      setSnackbar({ open: true, message: "Invalid PDF URL", severity: "error" })
      return
    }
    try {
      const link = document.createElement("a")
      link.href = lastUrl
      link.download = ""
      link.target = "_blank"
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
      setSnackbar({ open: true, message: "PDF download started", severity: "success" })
    } catch (error) {
      console.error("Download failed:", error)
      setSnackbar({ open: true, message: "Failed to download PDF", severity: "error" })
    }
  }

  const handleOpenAddModal = async (row) => {
    console.log("Opening add modal for row:", row)
    setOpenAddModal(true)
    const requestId = row.requestData._id
    const initId = row._id
    setServiceId(row.serviceId)
    setServiceName(row.serviceName)
    setRequestId(requestId)
    setPartnerName(row.partnerName)
    setInitId(initId)

    // Reset sign file state
    setSignFile("")
    setSignFileName("")
    setExistingSignUrl("")

    if (row.serviceId) {
      try {
        const response = await getpartnerproduct(requestId, row.serviceId, initId)
        console.log("Fetched partner products:", response)
        if (response && response.items) {
          setPartnerProducts(response.items)
          // Set partner data to access each field
          setPartnerData(response.items[0].partner)
          // Check if there's an existing sign URL in response.items[1]
          if (response.items[1]) {
            setExistingSignUrl(response.items[1])
          }
        }
      } catch (error) {
        console.error("Error fetching partner products:", error)
        setSnackbar({ open: true, message: "Failed to fetch partner products", severity: "error" })
      }
    }
  }

  const isImageFile = (filename) => {
    if (!filename) return false
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"]
    const extension = filename.toLowerCase().substring(filename.lastIndexOf("."))
    return imageExtensions.includes(extension)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    if (partnerProducts && partnerProducts[0]?.productForm) {
      const initialProductFields = {}
      partnerProducts[0].productForm.forEach((product) => {
        if (product?.submitFields?.isActive && product?.submitFields?.fields) {
          initialProductFields[product._id] = {}
          product.submitFields.fields.forEach((field) => {
            initialProductFields[product._id][field.fieldName] = field.value || ""
          })
        }
      })
      if (Object.keys(initialProductFields).length > 0 && Object.keys(productFields).length === 0) {
        setProductFields(initialProductFields)
      }
    }
  }, [partnerProducts])

  // useEffect(() => {
  //   if (partnerProducts.length > 0) {
  //     fetchLocations()
  //   }
  // }, [partnerProducts])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await getAllServicesApi()
      console.log("services", response)
      if (response?.items) {
        setServices(response.items)
      }
    } catch (err) {
      console.error("Failed to fetch services:", err)
    } finally {
      setLoading(false)
    }
  }

  // const fetchLocations = async () => {
  //   try {
  //     const data = await getAllLocationsAPI()
  //     if (data?.items) {
  //       setLocations(data.items)
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch locations:", err)
  //   }
  // }

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    resetForm()
  }

  const handleToggleProduct = (productId) => {
    setFormVisibility((prev) => {
      if (!prev[productId]) {
        const newVisibility = {}
        Object.keys(prev).forEach((id) => {
          newVisibility[id] = false
        })
        newVisibility[productId] = true
        return newVisibility
      } else {
        return {
          ...prev,
          [productId]: false,
        }
      }
    })
  }

  const handleProductFieldChange = (productId, fieldName, value) => {
    setProductFields((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [fieldName]: value,
      },
    }))
    if (fieldErrors[`${productId}_${fieldName}`]) {
      setFieldErrors((prev) => ({
        ...prev,
        [`${productId}_${fieldName}`]: undefined,
      }))
    }
  }

  const handleFileUpload = async (file, productId, fieldName) => {
    if (!file) return
    setUploadingFiles((prev) => ({
      ...prev,
      [`${productId}_${fieldName}`]: true,
    }))
    try {
      const response = await uploadImageApi(file)
      if (response.status && response.items?.fileUrl) {
        handleProductFieldChange(productId, fieldName, response.items.fileUrl)
        handleProductFieldChange(productId, `${fieldName}_filename`, file.name)
      } else {
        console.error("File upload failed:", response)
        showSnackbar("File upload failed", "error")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      showSnackbar("Error uploading file", "error")
    } finally {
      setUploadingFiles((prev) => ({
        ...prev,
        [`${productId}_${fieldName}`]: false,
      }))
    }
  }

  const handleMultiFileUpload = async (files, productId, fieldName) => {
    if (!files || files.length === 0) return
    const uploadItems = files.map((file) => ({
      filename: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
    }))
    setUploadingFiles((prev) => ({
      ...prev,
      [`${productId}_${fieldName}_items`]: uploadItems,
    }))
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("images", file)
      })
      const response = await uploadMultiImageApi(formData)
      if (response.status && response.items?.files) {
        setUploadingFiles((prev) => ({
          ...prev,
          [`${productId}_${fieldName}_items`]: prev[`${productId}_${fieldName}_items`].map((item) => ({
            ...item,
            progress: 100,
            status: "completed",
          })),
        }))
        const existingFiles = Array.isArray(productFields[productId]?.[fieldName])
          ? [...productFields[productId][fieldName]]
          : []
        const updatedFiles = [...existingFiles, ...response.items.files].flat()
        handleProductFieldChange(productId, fieldName, updatedFiles)
        const existingFilenames = Array.isArray(productFields[productId]?.[`${fieldName}_filenames`])
          ? [...productFields[productId][`${fieldName}_filenames`]]
          : []
        const filenames = [...existingFilenames, ...files.map((file) => file.name)]
        handleProductFieldChange(productId, `${fieldName}_filenames`, filenames)
        setTimeout(() => {
          setUploadingFiles((prev) => {
            const newState = { ...prev }
            delete newState[`${productId}_${fieldName}_items`]
            return newState
          })
        }, 2000)
      } else {
        console.error("Multi-file upload failed:", response)
        showSnackbar("Multi-file upload failed", "error")
        setUploadingFiles((prev) => ({
          ...prev,
          [`${productId}_${fieldName}_items`]: prev[`${productId}_${fieldName}_items`].map((item) => ({
            ...item,
            status: "error",
          })),
        }))
      }
    } catch (error) {
      console.error("Error uploading multiple files:", error)
      showSnackbar("Error uploading multiple files", "error")
      setUploadingFiles((prev) => ({
        ...prev,
        [`${productId}_${fieldName}_items`]:
          prev[`${productId}_${fieldName}_items`]?.map((item) => ({
            ...item,
            status: "error",
          })) || [],
      }))
    }
  }

  const handleRemoveFile = (productId, fieldName, index) => {
    if (index === undefined) {
      handleProductFieldChange(productId, fieldName, "")
      handleProductFieldChange(productId, `${fieldName}_filename`, "")
      return
    }
    const newFiles = [...productFields[productId][fieldName]]
    newFiles.splice(index, 1)
    handleProductFieldChange(productId, fieldName, newFiles)
    if (productFields[productId]?.[`${fieldName}_filenames`]) {
      const newFilenames = [...productFields[productId][`${fieldName}_filenames`]]
      newFilenames.splice(index, 1)
      handleProductFieldChange(productId, `${fieldName}_filenames`, newFilenames)
    }
  }

  // Handle sign file upload
  const handleSignFileUpload = async (file) => {
    if (!file) return
    setUploadingSign(true)
    try {
      const response = await uploadImageApi(file)
      if (response.status && response.items?.fileUrl) {
        setSignFile(response.items.fileUrl)
        setSignFileName(file.name)
        setExistingSignUrl("") // Clear existing sign when new one is uploaded
        setSnackbar({ open: true, message: "Sign file uploaded successfully", severity: "success" })
      } else {
        console.error("Sign file upload failed:", response)
        setSnackbar({ open: true, message: "Sign file upload failed", severity: "error" })
      }
    } catch (error) {
      console.error("Error uploading sign file:", error)
      setSnackbar({ open: true, message: "Error uploading sign file", severity: "error" })
    } finally {
      setUploadingSign(false)
    }
  }

  // Handle delete existing sign
  const handleDeleteExistingSign = () => {
    setExistingSignUrl("")
    setSignFile("")
    setSignFileName("")
  }

  const runAIDataExtraction = async (productId) => {
    setAiProcessing((prev) => ({
      ...prev,
      [productId]: true,
    }))
    try {
      const currentProduct = partnerProducts[0]?.productForm?.find((p) => p._id === productId)
      if (!currentProduct) {
        console.error("Product information not found")
        return
      }
      const initFields = []
      if (currentProduct?.submitFields?.fields) {
        currentProduct.submitFields.fields.forEach((field) => {
          const fieldValue = productFields[productId]?.[field.fieldName] || ""
          initFields.push({
            fieldName: field.fieldName,
            dataType: field.dataType,
            value: fieldValue,
          })
        })
      }
      if (currentProduct?.initFields?.fields) {
        currentProduct.initFields.fields.forEach((field) => {
          initFields.push({
            fieldName: field.fieldName,
            dataType: field.dataType,
            value: field.value || "",
          })
        })
      }
      const payload = {
        reqId: requestId,
        userProductId: currentProduct.userProductId,
        initFields: initFields,
      }
      console.log("AI Extraction Payload:", payload)
      const response = await getAiDataAPI(payload)
      console.log("ai data", response)
      if (response.status && response.items) {
        const extractedData = response.items
        const updatedFields = {
          ...productFields[productId],
        }
        Object.keys(extractedData).forEach((fieldName) => {
          if (extractedData[fieldName] !== null && extractedData[fieldName] !== undefined) {
            const matchingField = currentProduct?.submitFields?.fields?.find((field) => field.fieldName === fieldName)
            if (matchingField) {
              updatedFields[fieldName] = extractedData[fieldName]
            }
          }
        })
        setProductFields((prev) => ({
          ...prev,
          [productId]: updatedFields,
        }))
        setSnackbar({ open: true, message: "AI data extraction completed successfully", severity: "success" })
      } else {
        const errorMessage = response.message || "Failed to extract data from files"
        console.error("AI Extraction Error:", errorMessage)
        setSnackbar({ open: true, message: errorMessage, severity: "error" })
      }
    } catch (error) {
      console.error("Error in AI data extraction:", error)
      setSnackbar({ open: true, message: "Error processing files", severity: "error" })
    } finally {
      setAiProcessing((prev) => ({
        ...prev,
        [productId]: false,
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    let isValid = true
    const errorMessages = []
    const selectedProductId = Object.keys(formVisibility).find((productId) => formVisibility[productId])
    if (!selectedProductId) {
      errorMessages.push("Please select a product to proceed")
      isValid = false
      setFieldErrors(errors)
      if (errorMessages.length > 0) {
        setSnackbar({ open: true, message: errorMessages[0], severity: "error" })
      }
      return isValid
    }
    const product = partnerProducts[0]?.productForm?.find((p) => p._id === selectedProductId)
    if (!product) {
      errorMessages.push("Selected product not found")
      isValid = false
      setFieldErrors(errors)
      if (errorMessages.length > 0) {
        setSnackbar({ open: true, message: errorMessages[0], severity: "error" })
      }
      return isValid
    }
    if (!productFields[selectedProductId]) {
      errors[`${selectedProductId}_general`] = "Product data is missing"
      errorMessages.push(`${product.productName}: Product data is missing`)
      isValid = false
      setFieldErrors(errors)
      if (errorMessages.length > 0) {
        setSnackbar({ open: true, message: errorMessages[0], severity: "error" })
      }
      return isValid
    }
    const fields = productFields[selectedProductId] || {}
    const todayDate = new Date().toISOString().split("T")[0]
    product?.submitFields?.fields?.forEach((field) => {
      const fieldValue = fields[field.fieldName]
      if (field.isRequired) {
        let isEmpty = false
        switch (field.dataType) {
          case "string":
          case "textarea":
            isEmpty = fieldValue === undefined || fieldValue === null || fieldValue === ""
            break
          case "date":
            isEmpty = false
            break
          case "file":
            isEmpty = fieldValue === undefined || fieldValue === null || fieldValue === ""
            break
          case "multiUpload":
            isEmpty = !Array.isArray(fieldValue) || fieldValue.length === 0
            break
          default:
            isEmpty = fieldValue === undefined || fieldValue === null || fieldValue === ""
        }
        if (isEmpty) {
          const fieldDisplayName = field.fieldName.replace(/_/g, " ")
          errors[`${selectedProductId}_${field.fieldName}`] = `${fieldDisplayName} is required`
          errorMessages.push(`${product.productName}: ${fieldDisplayName} is required`)
          isValid = false
        }
      }
    })
    setFieldErrors(errors)
    if (errorMessages.length > 0) {
      setSnackbar({ open: true, message: errorMessages[0], severity: "error" })
    }
    return isValid
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const todayDate = new Date().toISOString().split("T")[0]
    const isValid = validateForm()
    if (!isValid) return
    const selectedProductId = Object.keys(formVisibility).find((productId) => formVisibility[productId])
    if (!selectedProductId) {
      setSnackbar({
        open: true,
        message: "Please select a product to proceed.",
        severity: "error",
      })
      return
    }
    const selectedProduct = partnerProducts[0]?.productForm?.find((p) => p._id === selectedProductId)
    const fields = productFields[selectedProductId] || {}
    if (!selectedProduct) {
      setSnackbar({
        open: true,
        message: "Selected product not found.",
        severity: "error",
      })
      return
    }
    const submitFields =
      selectedProduct?.submitFields?.fields?.map((field) => {
        let fieldValue = fields[field.fieldName]
        if (fieldValue === undefined || fieldValue === null || fieldValue === "") {
          switch (field.dataType) {
            case "date":
              fieldValue = todayDate
              break
            case "string":
            case "textarea":
              fieldValue = field.value || ""
              break
            case "file":
              fieldValue = ""
              break
            case "multiUpload":
              fieldValue = []
              break
            default:
              fieldValue = field.value || ""
          }
        }
        return {
          fieldName: field.fieldName,
          dataType: field.dataType,
          value: fieldValue,
        }
      }) || []

    // Create the payload with the correct structure
    const payload = {
      reportType: selectedProduct.userProductId,
      id: initId,
      workStatus: "completed",
      reportStatus: "wip",
      submitFields: submitFields,
      charge: selectedProduct?.charge || 0,
    }

    // Add sign field if file is uploaded (new upload takes priority over existing)
    if (signFile) {
      payload.sign = signFile
    } else if (existingSignUrl) {
      payload.sign = existingSignUrl
    }

    console.log("Properly structured payload:", payload)
    try {
      const data = await updateAddCasesApi(payload)
      console.log("submit response", data)
      if (data.status) {
        setSnackbar({ open: true, message: "Case successfully submitted", severity: "success" })
        handleCloseAddModal()
        fetchAddCases()
      } else {
        setSnackbar({ open: true, message: data.message || "Failed to submit case", severity: "error" })
      }
    } catch (error) {
      console.error("Error submitting case:", error)
      setSnackbar({ open: true, message: "Failed to submit case", severity: "error" })
    }
  }

  const resetForm = () => {
    setFormVisibility({})
    setProductFields({})
    setFieldErrors({})
    setAiResponseData({})
    setAiProcessing({})
    setUploadingFiles({})
    setPId(null)
    setServiceId(null)
    setServiceName("")
    setRequestId(null)
    setPartnerProducts([])
    setSignFile("")
    setSignFileName("")
    setPartnerData(null)
    setExistingSignUrl("")
  }

  const getFileTypeFieldsCount = (productId) => {
    const currentProduct = partnerProducts[0]?.productForm?.find((p) => p._id === productId)
    if (!currentProduct?.submitFields?.fields) {
      return 0
    }
    return currentProduct.submitFields.fields.filter(
      (field) => field.dataType !== "string" && field.dataType !== "textarea",
    ).length
  }

  const getPopulatedFileFieldsCount = (productId) => {
    const currentProduct = partnerProducts[0]?.productForm?.find((p) => p._id === productId)
    if (!currentProduct?.submitFields?.fields) {
      return 0
    }
    let count = 0
    currentProduct.submitFields.fields.forEach((field) => {
      if (field.dataType !== "string" && field.dataType !== "textarea" && productFields[productId]?.[field.fieldName]) {
        count++
      }
    })
    return count
  }

  const getUploadedFilesCount = (productId) => {
    const currentProduct = partnerProducts[0]?.productForm?.find((p) => p._id === productId)
    if (!currentProduct?.submitFields?.fields) {
      return 0
    }
    let count = 0
    currentProduct.submitFields.fields.forEach((field) => {
      if (field.dataType !== "string" && field.dataType !== "textarea") {
        const fieldValue = productFields[productId]?.[field.fieldName]
        if (fieldValue) {
          if (Array.isArray(fieldValue)) {
            count += fieldValue.length
          } else {
            count += 1
          }
        }
      }
    })
    return count
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1)
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message: message,
      severity: severity,
    })
  }

  const handleCustomCsvExport = () => {
    try {
      const visibleColumns = columns.filter((col) => col.field !== "action")
      const headers = visibleColumns.map((col) => col.headerName || col.field)
      const csvData = rows.map((row) => {
        return visibleColumns.map((col) => {
          if (col.field.startsWith("initField_")) {
            const index = Number.parseInt(col.field.split("_")[1])
            return row.initFields?.[index]?.value || "N/A"
          } else {
            return row[col.field] || "N/A"
          }
        })
      })
      const csvContent = [headers, ...csvData]
      const csvString = csvContent
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n")
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `cases_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting CSV:", error)
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
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <Button
          size="small"
          startIcon={<Icon icon="tabler:download" />}
          onClick={handleCustomCsvExport}
          sx={{ color: "primary.main", fontSize: "0.875rem", "&:hover": { borderColor: "primary.dark" } }}
        >
          CSV Export
        </Button>
      </GridToolbarContainer>
    )
  }

  return (
    <>
      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="fixed"
          top={0}
          left={0}
          width={"100%"}
          height={"100%"}
          bgcolor="rgba(255, 255, 255, 0.8)"
          zIndex={1300}
          sx={{
            backdropFilter: "blur(4px)",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
            }}
          >
            <CircularProgress color="primary" size={60} thickness={4} sx={{ mb: 2 }} />
            <Typography variant="h6" color="primary">
              Loading Data...
            </Typography>
          </Paper>
        </Box>
      )}
      <Box sx={{ width: "100%", p: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Card
          elevation={3}
          sx={{
            width: "100%",
            background: "linear-gradient(135deg, #9180ff, rgb(63, 194, 255))",
            borderRadius: 2,
            padding: { xs: "16px 12px", sm: "20px 16px" },
            boxShadow: "0 4px 20px rgba(0, 130, 198, 0.25)",
            mb: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              opacity: 0.1,
              backgroundImage: "radial-gradient(circle, #ffffff 2px, transparent 3px)",
              backgroundSize: "20px 20px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: { xs: "center", md: "space-between" },
              width: "100%",
              gap: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: "bold",
                color: "white",
                textAlign: { xs: "center", md: "left" },
                textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)",
                letterSpacing: "0.5px",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Typography>
          </Box>
        </Card>

        {/* Filter Content */}
        <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
          <Grid
            container
            spacing={3}
            sx={{
              width: "100%",
              justifyContent: "center",
              marginLeft: "0 auto",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {/* Partner Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}>
                Client
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  width: "100%",
                  maxWidth: { xs: "100%", sm: "400px" },
                }}
              >
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedEmployee}
                    onChange={handleEmployeeSelectChange}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected === "all") return "All Clients"
                      if (selected === "") return "All Clients"
                      const partner = partners.find((p) => p.partner._id === selected)
                      return partner?.partner?.name || "Select Clients"
                    }}
                    sx={{
                      height: 42,
                      borderRadius: 1.5,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiSelect-select": {
                        pl: 1.5,
                        display: "flex",
                        alignItems: "center",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    startAdornment={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ml: 0.75,
                          mr: 1,
                        }}
                      >
                        <Icon icon="tabler:users" color="#0082c6" fontSize="small" />
                      </Box>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, marginTop: 8 },
                        elevation: 2,
                        sx: {
                          "& .MuiMenuItem-root": {
                            py: 0.75,
                            px: 2,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="all" sx={{ fontWeight: 500 }}>
                      All Clients
                    </MenuItem>
                    {partners.map((partner) => (
                      <MenuItem key={partner?.partner?._id} value={partner?.partner?._id}>
                        {partner.partner?.name || "Client not available"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Service Section*/}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}>
                Service
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  width: "100%",
                  maxWidth: { xs: "100%", sm: "400px" },
                }}
              >
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedService}
                    onChange={handleServiceSelectChange}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected === "all") return "All Services"
                      if (selected === "") return "All Services"
                      const service = services.find((p) => p._id === selected)
                      return service?.serviceName || "Select Service"
                    }}
                    sx={{
                      height: 42,
                      borderRadius: 1.5,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiSelect-select": {
                        pl: 1.5,
                        display: "flex",
                        alignItems: "center",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    startAdornment={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ml: 0.75,
                          mr: 1,
                        }}
                      >
                        <Icon icon="tabler:report" color="#0082c6" fontSize="small" />
                      </Box>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, marginTop: 8 },
                        elevation: 2,
                        sx: {
                          "& .MuiMenuItem-root": {
                            py: 0.75,
                            px: 2,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontWeight: 500 }}>
                      All Services
                    </MenuItem>
                    {services.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.serviceName || "Service not available"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Date Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}>
                Date Range
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  width: "100%",
                  maxWidth: { xs: "100%", sm: "400px" },
                }}
              >
                <FormControl fullWidth size="small">
                  <Select
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected === "") return "Select Date Range"
                      if (selected === "today") return "Today"
                      if (selected === "thisWeek") return "This Week"
                      if (selected === "thisMonth") return "This Month"
                      if (selected === "custom") return "Custom Range"
                      return selected
                    }}
                    sx={{
                      height: 42,
                      borderRadius: 1.5,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiSelect-select": {
                        pl: 1.5,
                        display: "flex",
                        alignItems: "center",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    startAdornment={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ml: 0.75,
                          mr: 1,
                        }}
                      >
                        <Icon icon="tabler:calendar" color="#0082c6" fontSize="small" />
                      </Box>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, marginTop: 8 },
                        elevation: 2,
                        sx: {
                          "& .MuiMenuItem-root": {
                            py: 0.75,
                            px: 2,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="today" sx={{ fontWeight: 500 }}>
                      Today
                    </MenuItem>
                    <MenuItem value="thisWeek" sx={{ fontWeight: 500 }}>
                      This Week
                    </MenuItem>
                    <MenuItem value="thisMonth" sx={{ fontWeight: 500 }}>
                      This Month
                    </MenuItem>
                    <MenuItem value="custom" sx={{ fontWeight: 500 }}>
                      Custom Range
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Custom Date Range Section */}
            {dateRange === "custom" && (
              <Grid item xs={12} sm={12} md={4}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}>
                  Custom Date Range
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "400px" },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}>
                    <TextField
                      type="date"
                      fullWidth
                      size="small"
                      placeholder="Start Date"
                      value={startDateFilter}
                      onChange={(e) => {
                        setStartDateFilter(e.target.value)
                        setPage(1)
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ml: 0.75,
                              mr: 1,
                            }}
                          >
                            <Icon icon="tabler:calendar" color="#0082c6" fontSize="small" />
                          </Box>
                        ),
                        sx: {
                          height: 42,
                          borderRadius: 1.5,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.1)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    />
                    <TextField
                      type="date"
                      fullWidth
                      size="small"
                      placeholder="End Date"
                      value={endDateFilter}
                      onChange={(e) => {
                        setEndDateFilter(e.target.value)
                        setPage(1)
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ml: 0.75,
                              mr: 1,
                            }}
                          >
                            <Icon icon="tabler:calendar" color="#0082c6" fontSize="small" />
                          </Box>
                        ),
                        sx: {
                          height: 42,
                          borderRadius: 1.5,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.1)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                        },
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
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary", mr: 1, fontWeight: 500 }}>
              Quick filters:
            </Typography>
            <Chip
              label="Today"
              size="small"
              onClick={() => {
                const today = new Date().toISOString().split("T")[0]
                setDateRange("today")
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                bgcolor: alpha("#0082c6", 0.08),
                color: "#0082c6",
                "&:hover": { bgcolor: alpha("#0082c6", 0.15) },
              }}
            />
            <Chip
              label="This Week"
              size="small"
              onClick={() => {
                setDateRange("thisWeek")
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                bgcolor: alpha("#0082c6", 0.08),
                color: "#0082c6",
                "&:hover": { bgcolor: alpha("#0082c6", 0.15) },
              }}
            />
            <Chip
              label="This Month"
              size="small"
              onClick={() => {
                setDateRange("thisMonth")
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                bgcolor: alpha("#0082c6", 0.08),
                color: "#0082c6",
                "&:hover": { bgcolor: alpha("#0082c6", 0.15) },
              }}
            />
            <Chip
              label="Clear dates"
              size="small"
              variant="outlined"
              onClick={() => {
                setDateRange("")
                setStartDateFilter("")
                setEndDateFilter("")
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                borderColor: "divider",
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
            />
          </Box>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            p: 3,
            gap: 3,
            flexWrap: "nowrap",
          }}
        >
          {stats.map((stat, index) => (
            <Box key={index} sx={{ flex: 1 }}>
              <Card
                elevation={0}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: { xs: 1, sm: 1.5, md: 2 },
                  borderRadius: { xs: 1, sm: 2 },
                  backgroundColor: stat.bgColor,
                  border: `1px solid ${stat.borderColor}`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  width: "100%",
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: alpha(stat.textColor, 0.2),
                    color: stat.textColor,
                    width: { xs: 36, sm: 42, md: 48 },
                    height: { xs: 36, sm: 42, md: 48 },
                    mr: { xs: 1.5, sm: 2 },
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box sx={{ overflow: "hidden" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: stat.textColor,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                    noWrap
                  >
                    {stat.label || "Stats"}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: stat.textColor,
                      fontWeight: 600,
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#0082c6",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon icon="tabler:report" fontSize="1.25rem" />
            Reporting ({rows.length} records)
          </Typography>
        </Card>

        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            height: { xs: 500, md: 600 },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row._id || Math.random().toString()}
            disableSelectionOnClick={false}
            disableColumnMenu={isMobile}
            slots={{
              toolbar: CustomToolbar,
              Footer: () => (
                <TablePagination
                  component="div"
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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    p: 3,
                  }}
                >
                  <Icon icon="tabler:database-off" fontSize={48} sx={{ color: "text.secondary", mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Data Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or date range
                  </Typography>
                </Box>
              ),
            }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#9180ff",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "8px 8px 0 0",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                backgroundColor: "aliceblue",
              },
              "& .MuiDataGrid-cell": {
                fontSize: "14px",
                padding: "8px 16px",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: alpha("#0082c6", 0.04),
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: alpha("#0082c6", 0.08),
                transition: "background-color 0.2s ease",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: alpha("#0082c6", 0.12),
                "&:hover": {
                  backgroundColor: alpha("#0082c6", 0.16),
                },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid rgba(224, 224, 224, 0.4)",
                backgroundColor: alpha("#0082c6", 0.04),
              },
              "& .MuiTablePagination-root": {
                color: "#0082c6",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                backgroundColor: alpha("#0082c6", 0.3),
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: alpha("#0082c6", 0.5),
                },
              },
              border: "none",
            }}
          />
        </Card>
      </Box>

      {/* Modal */}
      <Modal
        open={openAddModal}
        handleClose={handleCloseAddModal}
        showButton={false}
        title=""
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            maxHeight: "90vh",
          },
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            p: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DescriptionOutlined sx={{ fontSize: 24, color: "white" }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Case Management
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Configure and update case details
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleCloseAddModal}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
              >
                <Icon icon="tabler:x" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 3, maxHeight: "calc(90vh - 140px)", overflowY: "auto" }}>
          {/* Client & Service Info */}
          <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Client & Service Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Client Name
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: stringToColor(partnerName || "") }}>
                      {partnerName ? partnerName.charAt(0).toUpperCase() : "?"}
                    </Avatar>
                    <Typography variant="body1">{partnerName || "N/A"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Service Type
                  </Typography>
                  <Typography variant="body1">{serviceName || "N/A"}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Product Configuration */}
          {partnerProducts.length > 0 && (
            <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: 2 }}>
              <Box sx={{ background: "#f8fafc", p: 2, borderBottom: "1px solid #e5e7eb" }}>
                <Typography variant="h6" fontWeight={600}>
                  Report Configuration
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {partnerProducts[0]?.productForm?.map((product) => {
                    const isInitFieldsActive = product?.submitFields?.isActive === true
                    if (!isInitFieldsActive) return null
                    const isProductEnabled = formVisibility[product._id] || false
                    const fileFieldsCount = getFileTypeFieldsCount(product._id)
                    const populatedFieldsCount = getPopulatedFileFieldsCount(product._id)
                    const uploadedFilesCount = getUploadedFilesCount(product._id)

                    return (
                      <Card
                        key={product._id}
                        elevation={0}
                        sx={{
                          border: isProductEnabled ? "2px solid #8b5cf6" : "1px solid #e5e7eb",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <Box sx={{ p: 2, background: isProductEnabled ? "#f0f9ff" : "#fafafa" }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 2,
                                  bgcolor: isProductEnabled ? "#8b5cf6" : "#6b7280",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <DescriptionOutlined sx={{ color: "white", fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="h6" fontWeight={600}>
                                  {product.productName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {isProductEnabled ? "Currently active" : "Click to activate"}
                                </Typography>
                              </Box>
                            </Box>
                            <Switch
                              checked={isProductEnabled}
                              onChange={() => handleToggleProduct(product._id)}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": { color: "#8b5cf6" },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#8b5cf6",
                                },
                              }}
                            />
                          </Box>
                        </Box>

                        {isProductEnabled && (
                          <Box sx={{ p: 3 }}>
                            {/* Digital Signature Section - Show only when enach is "upload" and product is active */}
                            {partnerData?.enach === "upload" && (
                              <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                    Signature
                                  </Typography>
                                  <Box
                                    sx={{
                                      border: "2px dashed #d1d5db",
                                      borderRadius: 2,
                                      p: 3,
                                      minHeight: 120,
                                      backgroundColor: "#fafafa",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      "&:hover": {
                                        borderColor: "#8b5cf6",
                                        backgroundColor: "rgba(139, 92, 246, 0.02)",
                                      },
                                    }}
                                    onClick={() => {
                                      if (!signFile && !existingSignUrl && !uploadingSign) {
                                        document.getElementById("sign-file-input").click()
                                      }
                                    }}
                                  >
                                    {uploadingSign ? (
                                      <Box sx={{ textAlign: "center" }}>
                                        <CircularProgress size={40} sx={{ mb: 2, color: "#8b5cf6" }} />
                                        <Typography variant="body2" color="text.secondary">
                                          Uploading signature...
                                        </Typography>
                                      </Box>
                                    ) : signFile ? (
                                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                          <Box
                                            sx={{
                                              width: 48,
                                              height: 48,
                                              borderRadius: 2,
                                              bgcolor: "#10b981",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                            }}
                                          >
                                            <DescriptionOutlined sx={{ color: "white", fontSize: 24 }} />
                                          </Box>
                                          <Box>
                                            <Typography variant="body1" fontWeight={600}>
                                              {signFileName || "New signature file"}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              New digital signature uploaded
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <IconButton
                                          size="small"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setSignFile("")
                                            setSignFileName("")
                                          }}
                                          sx={{ color: "#ef4444" }}
                                        >
                                          <DeleteOutlined />
                                        </IconButton>
                                      </Box>
                                    ) : existingSignUrl ? (
                                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                          <Box
                                            sx={{
                                              width: 48,
                                              height: 48,
                                              borderRadius: 2,
                                              bgcolor: "#3b82f6",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                            }}
                                          >
                                            <ImageOutlined sx={{ color: "white", fontSize: 24 }} />
                                          </Box>
                                          <Box>
                                            <Typography variant="body1" fontWeight={600}>
                                              Existing Signature
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              Click to view existing signature
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                          <IconButton
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              window.open(existingSignUrl, "_blank")
                                            }}
                                            sx={{ color: "#3b82f6" }}
                                          >
                                            <Icon icon="tabler:eye" />
                                          </IconButton>
                                          <IconButton
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleDeleteExistingSign()
                                            }}
                                            sx={{ color: "#ef4444" }}
                                          >
                                            <DeleteOutlined />
                                          </IconButton>
                                        </Box>
                                      </Box>
                                    ) : (
                                      <Box sx={{ textAlign: "center" }}>
                                        <CloudUploadOutlined sx={{ fontSize: 48, color: "#8b5cf6", mb: 2 }} />
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                          Upload Digital Signature
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          Click to upload signature file
                                        </Typography>
                                      </Box>
                                    )}
                                    <input
                                      id="sign-file-input"
                                      type="file"
                                      style={{ display: "none" }}
                                      disabled={uploadingSign}
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          handleSignFileUpload(e.target.files[0])
                                        }
                                      }}
                                    />
                                  </Box>
                                </CardContent>
                              </Card>
                            )}

                            {/* AI Extraction Section */}
                            <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: "#f0f9ff", border: "1px solid #e0e7ff" }}>
                              <Box
                                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  <AutoAwesomeOutlined sx={{ color: "#8b5cf6" }} />
                                  <Box>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                      AI Data Extraction
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Extract data from uploaded documents
                                    </Typography>
                                  </Box>
                                </Box>
                                <Button
                                  variant="contained"
                                  onClick={() => runAIDataExtraction(product._id)}
                                  disabled={aiProcessing[product._id]}
                                  startIcon={
                                    aiProcessing[product._id] ? (
                                      <CircularProgress size={18} color="inherit" />
                                    ) : (
                                      <AutoAwesomeOutlined />
                                    )
                                  }
                                  sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" } }}
                                >
                                  {aiProcessing[product._id] ? "Processing..." : "Extract with AI"}
                                </Button>
                              </Box>
                              {fileFieldsCount > 0 && (
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Upload Progress: {populatedFieldsCount} of {fileFieldsCount} files
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={(populatedFieldsCount / fileFieldsCount) * 100}
                                    sx={{
                                      height: 6,
                                      borderRadius: 3,
                                      bgcolor: "rgba(139, 92, 246, 0.1)",
                                      "& .MuiLinearProgress-bar": { bgcolor: "#8b5cf6", borderRadius: 3 },
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>

                            {/* Form Fields */}
                            <Grid container spacing={2}>
                              {/* Initial Values */}
                              {product?.initFields?.isActive === true && (
                                <Grid item xs={12}>
                                  <Card elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 2, mb: 2 }}>
                                    <Box sx={{ p: 2, bgcolor: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
                                      <Typography variant="h6" fontWeight={600}>
                                        Initial Values
                                      </Typography>
                                    </Box>
                                    <Box sx={{ p: 2 }}>
                                      <Grid container spacing={2}>
                                        {product?.initFields?.fields?.map((field, idx) => (
                                          <Grid item xs={12} sm={6} key={field.fieldName}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                              {field.fieldName}
                                            </Typography>
                                            <Box
                                              sx={{
                                                p: 1.5,
                                                borderRadius: 1,
                                                bgcolor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                              }}
                                            >
                                              <Typography variant="body2">{field.value || "N/A"}</Typography>
                                            </Box>
                                          </Grid>
                                        ))}
                                      </Grid>
                                    </Box>
                                  </Card>
                                </Grid>
                              )}

                              {/* Submit Fields */}
                              <Grid item xs={12}>
                                <Card elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                                  <Box sx={{ p: 2, bgcolor: "#f0f9ff", borderBottom: "1px solid #e5e7eb" }}>
                                    <Typography variant="h6" fontWeight={600}>
                                      Submit Fields
                                    </Typography>
                                  </Box>
                                  <Box sx={{ p: 2 }}>
                                    <Grid container spacing={2}>
                                      {product?.submitFields?.fields?.map((field) => {
                                        const currentValue =
                                          productFields[product._id]?.[field.fieldName] ?? field.value ?? ""
                                        const fieldKey = `${product._id}_${field.fieldName}`
                                        const hasError = field.isRequired ? Boolean(fieldErrors[fieldKey]) : false
                                        const errorMessage = field.isRequired ? fieldErrors[fieldKey] : ""
                                        const fieldLabel = `${field.fieldName.replace(/_/g, " ")}${field.isRequired ? " *" : ""}`

                                        return (
                                          <Grid item xs={12} sm={6} key={field.fieldName}>
                                            {field.dataType === "string" ? (
                                              <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                  {fieldLabel}
                                                </Typography>
                                                <CustomTextField
                                                  type="text"
                                                  value={currentValue}
                                                  onChange={(e) =>
                                                    handleProductFieldChange(
                                                      product._id,
                                                      field.fieldName,
                                                      e.target.value,
                                                    )
                                                  }
                                                  fullWidth
                                                  error={hasError}
                                                  helperText={errorMessage}
                                                  placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                                                  required={field.isRequired}
                                                  size="small"
                                                />
                                              </Box>
                                            ) : field.dataType === "textarea" ? (
                                              <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                  {fieldLabel}
                                                </Typography>
                                                <CustomTextField
                                                  multiline
                                                  rows={3}
                                                  value={currentValue}
                                                  onChange={(e) =>
                                                    handleProductFieldChange(
                                                      product._id,
                                                      field.fieldName,
                                                      e.target.value,
                                                    )
                                                  }
                                                  fullWidth
                                                  error={hasError}
                                                  helperText={errorMessage}
                                                  placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                                                  required={field.isRequired}
                                                  size="small"
                                                />
                                              </Box>
                                            ) : field.dataType === "date" ? (
                                              <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                  {fieldLabel}
                                                </Typography>
                                                <CustomTextField
                                                  fullWidth
                                                  type="date"
                                                  value={currentValue || new Date().toISOString().split("T")[0]}
                                                  onChange={(e) =>
                                                    handleProductFieldChange(
                                                      product._id,
                                                      field.fieldName,
                                                      e.target.value,
                                                    )
                                                  }
                                                  error={hasError}
                                                  helperText={errorMessage}
                                                  required={field.isRequired}
                                                  size="small"
                                                  InputLabelProps={{ shrink: true }}
                                                />
                                              </Box>
                                            ) : field.dataType === "file" ? (
                                              <Box sx={{ width: "100%" }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                  {fieldLabel}
                                                </Typography>
                                                <Box
                                                  sx={{
                                                    border: "2px dashed #d1d5db",
                                                    borderRadius: 2,
                                                    p: 2,
                                                    minHeight: 80,
                                                    backgroundColor: "#fafafa",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    "&:hover": { borderColor: "#8b5cf6" },
                                                  }}
                                                  onClick={() => {
                                                    if (
                                                      !productFields[product._id]?.[field.fieldName] &&
                                                      !uploadingFiles[fieldKey]
                                                    ) {
                                                      document.getElementById(`file-input-${fieldKey}`).click()
                                                    }
                                                  }}
                                                >
                                                  {uploadingFiles[fieldKey] ? (
                                                    <Box sx={{ textAlign: "center" }}>
                                                      <CircularProgress size={30} sx={{ mb: 1 }} />
                                                      <Typography variant="caption">Uploading...</Typography>
                                                    </Box>
                                                  ) : productFields[product._id]?.[field.fieldName] ? (
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        width: "100%",
                                                      }}
                                                    >
                                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <DescriptionOutlined sx={{ color: "#10b981" }} />
                                                        <Typography variant="body2">
                                                          {productFields[product._id]?.[
                                                            `${field.fieldName}_filename`
                                                          ] || "File uploaded"}
                                                        </Typography>
                                                      </Box>
                                                      <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                          e.stopPropagation()
                                                          handleRemoveFile(product._id, field.fieldName)
                                                        }}
                                                        sx={{ color: "#ef4444" }}
                                                      >
                                                        <DeleteOutlined />
                                                      </IconButton>
                                                    </Box>
                                                  ) : (
                                                    <Box sx={{ textAlign: "center" }}>
                                                      <CloudUploadOutlined
                                                        sx={{ fontSize: 32, color: "#8b5cf6", mb: 1 }}
                                                      />
                                                      <Typography variant="body2">Click to upload file</Typography>
                                                    </Box>
                                                  )}
                                                  <input
                                                    id={`file-input-${fieldKey}`}
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    disabled={uploadingFiles[fieldKey]}
                                                    onChange={(e) => {
                                                      if (e.target.files?.[0]) {
                                                        handleFileUpload(
                                                          e.target.files[0],
                                                          product._id,
                                                          field.fieldName,
                                                        )
                                                      }
                                                    }}
                                                  />
                                                </Box>
                                                {hasError && (
                                                  <Typography
                                                    color="error"
                                                    variant="caption"
                                                    sx={{ mt: 1, display: "block" }}
                                                  >
                                                    {errorMessage}
                                                  </Typography>
                                                )}
                                              </Box>
                                            ) : field.dataType === "multiUpload" ? (
                                              <Box sx={{ width: "100%" }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                  {fieldLabel}
                                                </Typography>
                                                <Box
                                                  sx={{
                                                    border: "2px dashed #d1d5db",
                                                    borderRadius: 2,
                                                    p: 2,
                                                    minHeight: 100,
                                                    backgroundColor: "#fafafa",
                                                    cursor: "pointer",
                                                    "&:hover": { borderColor: "#8b5cf6" },
                                                  }}
                                                  onClick={() => {
                                                    document.getElementById(`multi-file-input-${fieldKey}`).click()
                                                  }}
                                                >
                                                  <Box sx={{ textAlign: "center", mb: 2 }}>
                                                    <CloudUploadOutlined
                                                      sx={{ fontSize: 32, color: "#8b5cf6", mb: 1 }}
                                                    />
                                                    <Typography variant="body2">
                                                      Drop multiple files or browse
                                                    </Typography>
                                                  </Box>

                                                  {/* File list */}
                                                  <Stack spacing={1}>
                                                    {Array.isArray(productFields[product._id]?.[field.fieldName]) &&
                                                      productFields[product._id]?.[field.fieldName].map(
                                                        (fileUrl, index) => {
                                                          const filename =
                                                            productFields[product._id]?.[
                                                              `${field.fieldName}_filenames`
                                                            ]?.[index] || fileUrl.split("/").pop()
                                                          return (
                                                            <Box
                                                              key={`uploaded-${index}`}
                                                              sx={{
                                                                p: 1.5,
                                                                bgcolor: "white",
                                                                borderRadius: 1,
                                                                border: "1px solid #e5e7eb",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                              }}
                                                            >
                                                              <Box
                                                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                                              >
                                                                <DescriptionOutlined
                                                                  sx={{ color: "#10b981", fontSize: 20 }}
                                                                />
                                                                <Typography variant="body2">{filename}</Typography>
                                                              </Box>
                                                              <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                  e.stopPropagation()
                                                                  handleRemoveFile(product._id, field.fieldName, index)
                                                                }}
                                                                sx={{ color: "#ef4444" }}
                                                              >
                                                                <DeleteOutlined />
                                                              </IconButton>
                                                            </Box>
                                                          )
                                                        },
                                                      )}
                                                  </Stack>

                                                  <input
                                                    id={`multi-file-input-${fieldKey}`}
                                                    type="file"
                                                    multiple
                                                    style={{ display: "none" }}
                                                    onChange={(e) => {
                                                      if (e.target.files?.length) {
                                                        const filesArray = Array.from(e.target.files)
                                                        handleMultiFileUpload(filesArray, product._id, field.fieldName)
                                                      }
                                                    }}
                                                  />
                                                </Box>
                                                {hasError && (
                                                  <Typography
                                                    color="error"
                                                    variant="caption"
                                                    sx={{ mt: 1, display: "block" }}
                                                  >
                                                    {errorMessage}
                                                  </Typography>
                                                )}
                                              </Box>
                                            ) : null}
                                          </Grid>
                                        )
                                      })}
                                    </Grid>
                                  </Box>
                                </Card>
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </Card>
                    )
                  })}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            p: 3,
            borderTop: "1px solid #e5e7eb",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button variant="outlined" onClick={handleCloseAddModal} sx={{ borderColor: "#d1d5db", color: "#6b7280" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" } }}
          >
            Update Case
          </Button>
        </Box>
      </Modal>

      {/* Report Modal */}
      <Modal
        open={reportOpen}
        handleClose={handleCloseReportModal}
        title="Report Generation"
        maxWidth="sm"
        showButton={false}
      >
        <Grid container spacing={2} padding={"12px"}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Select Product Template"
              select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              fullWidth
            >
              {templates.map((template) => (
                <MenuItem key={template._id} value={template._id}>
                  {template.templateName}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
          {selectedTemplate && (
            <Grid item xs={12} sm={6} mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={generatePDF}
                disabled={isGenerating}
                startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
              >
                Generate PDF
              </Button>
            </Grid>
          )}
        </Grid>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default InitDashboard
