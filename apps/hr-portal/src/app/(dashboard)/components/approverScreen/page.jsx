'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Chip,
  Grid,
  FormHelperText,
  Divider,
  CircularProgress,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid'
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  HourglassFull,
  ThumbUp,
  ThumbDown,
  Close,
  Person,
  CreditCard,
  AccountBalance
} from '@mui/icons-material'
import { getApproverScreen, addApproverScreen } from '../../api/approverScreen-service'
import { FileText } from 'lucide-react'
import dayjs from 'dayjs';


const STATUS = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUBMITTED: 'Submitted'
}

const ApproverScreen = () => {
  const router = useRouter()
  const [expenses, setExpenses] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [columns, setColumns] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [approvalData, setApprovalData] = useState({
    status: '',
    comments: '',
    approvedAmount: 0
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // New state for formData dialog
  const [openFormDataDialog, setOpenFormDataDialog] = useState(false)
  const [viewedFormData, setViewedFormData] = useState(null)

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }, [])

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }, [])

  const renderStatusChip = useCallback(status => {
    switch (status?.toLowerCase()) {
      case STATUS.APPROVED:
        return (
          <Chip
            icon={<CheckCircle fontSize='small' />}
            label='Approved'
            color='success'
            size='small'
            sx={{ minWidth: 100 }}
          />
        )
      case STATUS.REJECTED:
        return (
          <Chip icon={<Cancel fontSize='small' />} label='Rejected' color='error' size='small' sx={{ minWidth: 100 }} />
        )
      case STATUS.SUBMITTED:
      default:
        return (
          <Chip
            icon={<HourglassFull fontSize='small' />}
            label='Submitted'
            color='warning'
            size='small'
            variant='outlined'
            sx={{ minWidth: 100 }}
          />
        )
    }
  }, [])

  const allColumns = useMemo(
    () => [
      {
        field: 'employeeName',
        headerName: 'Employee Name',
        flex: 1,
        renderHeader: () => (
          <Box display='flex' alignItems='center' gap={1}>
            <Person sx={{ fontSize: 18, color: '#fff' }} />
            Employee Name
          </Box>
        ),
        // renderCell: ({ value }) => <Typography variant='body2'>{value || 'N/A'}</Typography>
        renderCell: ({ value }) => (
          <Box display='flex' alignItems='center'>
            <Typography variant='body2' sx={{ fontWeight: 500, color: '#1f2937' }}>
              {value || 'N/A'}
            </Typography>
          </Box>
        )
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        renderHeader: () => (
          <Box display='flex' alignItems='center' gap={1}>
            <Person sx={{ fontSize: 18, color: '#fff' }} />
            Email
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant='body2'>{value || 'N/A'}</Typography>
      },
      {
        field: 'expenseType',
        headerName: 'Expense Type',
        flex: 1,
        renderHeader: () => (
          <Box display='flex' alignItems='center' gap={1}>
            <CreditCard sx={{ fontSize: 18, color: '#fff' }} />
            Expense Type
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant='body2'>{value || 'N/A'}</Typography>
      },
      {
        field: 'department',
        headerName: 'Department',
        flex: 1,
        renderHeader: () => (
          <Box display='flex' alignItems='center' gap={1}>
            <Person sx={{ fontSize: 18, color: '#fff' }} />
            Department
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant='body2'>{value || 'N/A'}</Typography>
      },
      {
        field: 'project',
        headerName: 'Project',
        flex: 1,
        renderHeader: () => (
          <Box display='flex' alignItems='center' gap={1}>
            <Person sx={{ fontSize: 18, color: '#fff' }} />
            Project
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant='body2'>{value || 'N/A'}</Typography>
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderHeader: () => (
          <Box display='flex' alignItems='center'>
            <CheckCircle sx={{ fontSize: 18, color: '#fff' }} />
            Status
          </Box>
        ),
        // renderCell: ({ value }) => renderStatusChip(value),
        renderCell: ({ value }) => (
          <Box display='flex' alignItems='center' >
            {renderStatusChip(value)}
          </Box>
        )
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        sortable: false,
        renderHeader: () => (
          <Box display='flex' alignItems='center' gap={1}>
            <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'white' }}>
              Actions
            </Typography>
          </Box>
        ),
        renderCell: ({ row }) => {
          const canApprove = row.status === STATUS.SUBMITTED
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant='contained'
                size='small'
                onClick={() => handleOpenDialog(row)}
                disabled={!canApprove}
                sx={{
                  bgcolor: '#3b82f6',
                  '&:hover': { bgcolor: '#2563eb' },
                  textTransform: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
                }}
                aria-label={`Approve expense for ${row.employeeName}`}
              >
                Approve
              </Button>
              <Button
                variant='outlined'
                size='small'
                onClick={() => handleOpenFormDataDialog(row)}
                sx={{
                  borderColor: '#64748b',
                  color: '#64748b',
                  '&:hover': { borderColor: '#475569', color: '#475569', bgcolor: 'rgba(100, 116, 139, 0.04)' },
                  textTransform: 'none',
                  borderRadius: '8px'
                }}
                aria-label={`View details for ${row.employeeName}`}
              >
                View
              </Button>
            </Box>
          )
        }
      }
    ],
    [renderStatusChip]
  )

  const getAllApprovers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getApproverScreen()
      if (response.message && !response.items?.submissions) {
        showSnackbar(response.message, 'info')
        setExpenses([])
        setColumns(allColumns)
        return
      }
      const newData = response.map(item => ({
        id: item._id || '',
        employeeName: item.submittedBy?.employeName || item.submittedByName || 'N/A',
        submissionId: item.submissionId || 'N/A',
        expenseType: item.expenseTypeId?.name || 'N/A',
        email: item.submittedBy?.email || 'N/A',
        expenseTypeId: item.expenseTypeId?.expenseTypeId || '',
        department: item.department || 'N/A',
        project: item.project || 'N/A',
        amount: item.totalAmount || item.formData?.FORMFIELD_MD9VOFMYNFIIQE || 0,
        status: item.status || STATUS.SUBMITTED,
        comments: item.internalNotes || item.rejectionReason || 'N/A',
        formData: item.formData || {} // Ensure formData is always present
      }))
      setColumns(allColumns)
      setExpenses(newData)
    } catch (error) {
      console.error('Error fetching expenses:', error)
      if (error.message === 'Authentication token is missing') {
        showSnackbar('Please log in to continue', 'error')
        router.push('/login')
      } else {
        showSnackbar(error.message || 'Failed to load expenses', 'error')
      }
    } finally {
      setLoading(false)
    }
  }, [allColumns, router, showSnackbar])

  useEffect(() => {
    console.log('Fetching approvers...')
    getAllApprovers()
  }, [getAllApprovers])

  const handleOpenDialog = useCallback(
    expense => {
      if (!expense?.id) {
        showSnackbar('Invalid expense data', 'error')
        return
      }
      setSelectedExpense(expense)
      setApprovalData({
        status: '',
        comments: ''
      })
      setErrors({})
      setOpenDialog(true)
    },
    [showSnackbar]
  )

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false)
    setSelectedExpense(null)
  }, [])

  // Handlers for formData dialog
  const handleOpenFormDataDialog = useCallback(
    expense => {
      if (!expense?.formData || Object.keys(expense.formData).length === 0) {
        showSnackbar('No form data available for this expense', 'info')
        return
      }
      setViewedFormData(expense.formData)
      setOpenFormDataDialog(true)
    },
    [showSnackbar]
  )

  const handleCloseFormDataDialog = useCallback(() => {
    setOpenFormDataDialog(false)
    setViewedFormData(null)
  }, [])

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target
    setApprovalData(prev => ({
      ...prev,
      [name]: value
    }))
    setErrors(prev => ({
      ...prev,
      [name]: null
    }))
  }, [])

  const validateForm = useCallback(() => {
    const newErrors = {}
    if (!approvalData.status) {
      newErrors.status = 'Status is required'
    }
    if (!approvalData.comments) {
      newErrors.comments = 'Comments are required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [approvalData])

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return
    if (!selectedExpense?.id) {
      showSnackbar('Invalid expense selected', 'error')
      return
    }
    setLoading(true)
    try {
      const payload = {
        comments: approvalData.comments,
        status: approvalData.status.charAt(0).toUpperCase() + approvalData.status.slice(1).toLowerCase(),
        ...(approvalData.status === STATUS.APPROVED && {
          approvedAmount: approvalData.approvedAmount
        }) // Conditionally add approvedAmount
      }
      const response = await addApproverScreen(selectedExpense.submissionId, payload)
      if (response.status) {
        showSnackbar(response.message || 'Approval submitted successfully', 'success')
        await getAllApprovers()
      } else {
        showSnackbar(response.message || 'Failed to submit approval', 'error')
      }
    } catch (error) {
      console.error('Error submitting approval:', error)
      showSnackbar(error.message || 'Failed to submit approval', 'error')
    } finally {
      setLoading(false)
      if (!errors.status && !errors.comments) {
        handleCloseDialog()
      }
    }
  }, [validateForm, selectedExpense, approvalData, showSnackbar, getAllApprovers, handleCloseDialog, errors])

  const filteredRows = useMemo(
    () =>
      expenses.filter(row =>
        Object.values(row).some(value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [expenses, searchTerm]
  )

  const CustomToolbar = useCallback(
    () => (
      <GridToolbarContainer
        sx={{
          padding: '12px 16px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <GridToolbarColumnsButton sx={{ color: '#64748b', fontSize: '0.875rem' }} />
        <GridToolbarDensitySelector sx={{ color: '#64748b', fontSize: '0.875rem' }} />
        <GridToolbarExport
          csvOptions={{ disableToolbarButton: false }}
          printOptions={{ disableToolbarButton: true }}
          sx={{ color: '#64748b', fontSize: '0.875rem' }}
        />
      </GridToolbarContainer>
    ),
    []
  )

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', p: 3 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <Grid container spacing={3} alignItems="center" justifyContent="space-between">
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    backgroundColor: "#3b82f6",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <Person sx={{ fontSize: 28 }} />   
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#1f2937", mb: 0.5 }}>
                    Expense Approvals
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#6b7280" }}>
                    Review and approve expense requests submitted by employees
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              aria-label='Expense approval dashboard'
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 50 }
                }
              }}
              pageSizeOptions={[50, 100, 200]}
              getRowId={row => row.id}
              slots={{
                toolbar: CustomToolbar,
                noRowsOverlay: () => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      color: '#9ca3af',
                      gap: 2
                    }}
                  >
                    <Person sx={{ fontSize: 48, color: '#d1d5db' }} />
                    <Typography variant='h6' sx={{ color: '#6b7280' }}>
                      {searchTerm ? 'No matching expenses found' : 'No expenses found'}
                    </Typography>
                    <Typography variant='body2' sx={{ color: '#9ca3af' }}>
                      {searchTerm ? 'Try adjusting your search term' : 'Try adjusting your search criteria'}
                    </Typography>
                  </Box>
                )
              }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  borderRadius: 0,
                  fontSize: '0.95rem',
                  fontWeight: 600
                },
                '& .MuiDataGrid-columnHeader': {
                  color: '#fff'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600,
                  color: '#fff'
                },
                '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
                  color: '#fff'
                },
                '& .MuiDataGrid-row': {
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.04)',
                    cursor: 'pointer'
                  },
                  '&:nth-of-type(even)': {
                    bgcolor: 'rgba(248, 250, 252, 0.5)'
                  }
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #F1F5F9',
                  py: 2
                },
                '& .MuiDataGrid-footerContainer': {
                  bgcolor: '#FAFBFF',
                  borderTop: '1px solid #E5E7EB'
                }
              }}
              loading={loading}
            />
          </Box>
        </Paper>

        {/* Approval Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth='md'
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }
          }}
          aria-labelledby='approval-dialog-title'
        >
          <DialogTitle
            id='approval-dialog-title'
            sx={{
              p: 4,
              pb: 2,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderBottom: '1px solid #e2e8f0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ backgroundColor: '#3b82f6', width: 40, height: 40 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant='h5' sx={{ fontWeight: 700, color: '#1f2937' }}>
                  Expense Approval
                </Typography>
                <Typography variant='body2' sx={{ color: '#6b7280', mt: 0.5 }}>
                  Review and submit your decision
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDialog} sx={{ ml: 'auto', color: '#64748b' }} aria-label='Close dialog'>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            {selectedExpense && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant='h6' sx={{ fontWeight: 600, color: '#1f2937', p: '0.5rem' }}>
                    Expense Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Employee
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500, color: '#1f2937' }}>
                    {selectedExpense.employeeName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Amount
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500, color: '#1f2937' }}>
                    ₹{selectedExpense.amount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Expense Type
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#1f2937' }}>
                    {selectedExpense.expenseType}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 3, borderColor: '#e2e8f0' }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h6' sx={{ fontWeight: 600, color: '#1f2937', mb: 2 }}>
                    Your Decision
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.status} sx={{ mb: 3 }}>
                    <InputLabel id='status-label'>Approval Status</InputLabel>
                    <Select
                      labelId='status-label'
                      id='status'
                      name='status'
                      value={approvalData.status}
                      onChange={handleInputChange}
                      label='Approval Status'
                      sx={{
                        backgroundColor: '#f9fafb',
                        '&:hover': { backgroundColor: '#f3f4f6' },
                        '&.Mui-focused': { backgroundColor: 'white' }
                      }}
                      startAdornment={
                        approvalData.status === STATUS.APPROVED ? (
                          <ThumbUp sx={{ color: 'green', mr: 1 }} />
                        ) : approvalData.status === STATUS.REJECTED ? (
                          <ThumbDown sx={{ color: 'red', mr: 1 }} />
                        ) : null
                      }
                      aria-describedby='status-error-text'
                    >
                      <MenuItem value={STATUS.APPROVED}>Approved</MenuItem>
                      <MenuItem value={STATUS.REJECTED}>Rejected</MenuItem>
                    </Select>
                    {errors.status && <FormHelperText id='status-error-text'>{errors.status}</FormHelperText>}
                  </FormControl>
                </Grid>
                {approvalData.status === STATUS.APPROVED && (
                  <Grid item xs={12}>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                      Approved Amount
                    </Typography>
                    <TextField
                      fullWidth
                      value={`₹${approvalData.approvedAmount || 0}`}
                      onChange={e =>
                        setApprovalData(prev => ({
                          ...prev,
                          approvedAmount: e.target.value.replace(/[^\d]/g, '')
                        }))
                      }
                      InputProps={{
                        startAdornment: <AccountBalance sx={{ color: '#3b82f6', mr: 1 }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f9fafb',
                          '&:hover': { backgroundColor: '#f3f4f6' },
                          '&.Mui-focused': { backgroundColor: 'white' }
                        }
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.comments}>
                    <TextField
                      id='comments'
                      name='comments'
                      label='Comments'
                      multiline
                      rows={4}
                      value={approvalData.comments}
                      onChange={handleInputChange}
                      placeholder='Enter your comments or reasons for approval/rejection'
                      error={!!errors.comments}
                      helperText={errors.comments}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f9fafb',
                          '&:hover': {
                            backgroundColor: '#f3f4f6'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white'
                          }
                        }
                      }}
                      aria-describedby='comments-error-text'
                    />
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 4, pt: 0 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                textTransform: 'none',
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}
              aria-label='Cancel approval'
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant='contained'
              disabled={loading}
              sx={{
                bgcolor: '#3b82f6',
                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  bgcolor: '#2563eb',
                  boxShadow: '0 6px 8px rgba(59, 130, 246, 0.4)'
                },
                textTransform: 'none',
                borderRadius: '8px'
              }}
              aria-label='Submit approval'
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Form Data View Dialog */}
        <Dialog
          open={openFormDataDialog}
          onClose={handleCloseFormDataDialog}
          maxWidth='sm'
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }
          }}
          aria-labelledby='form-data-dialog-title'
        >
          <DialogTitle
            id='form-data-dialog-title'
            sx={{
              p: 4,
              pb: 2,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderBottom: '1px solid #e2e8f0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ backgroundColor: '#3b82f6', width: 40, height: 40 }}>
                <FileText />
              </Avatar>
              <Box>
                <Typography variant='h5' sx={{ fontWeight: 700, color: '#1f2937' }}>
                  Expense Form Details
                </Typography>
                <Typography variant='body2' sx={{ color: '#6b7280', mt: 0.5 }}>
                  Submitted form data for this expense
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseFormDataDialog}
                sx={{ ml: 'auto', color: '#64748b' }}
                aria-label='Close form data dialog'
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 4, mt: 5 }}>
            {viewedFormData ? (
              <Box component="form" noValidate>
                <Grid container spacing={3}>
                  {Object.entries(viewedFormData).map(([key, field]) => {
                    const isFile = field.type === "file";
                    const isCheckbox = field.type === "checkbox";
                    const isDate = field.type === "date";
                    const value = field.value;

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={isFile ? 12 : 6}
                        key={key}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "#9ca3af", fontWeight: 500, mb: 0.5 }}
                        >
                          {field.name || key}
                        </Typography>

                        {isFile && Array.isArray(value) ? (
                          value.length > 0 ? (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              {value.map((url, index) => (
                                <Box key={index} sx={{ maxWidth: 150 }}>
                                  {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                    <Box
                                      component="img"
                                      src={url}
                                      alt={`File ${index + 1}`}
                                      sx={{
                                        width: "100%",
                                        borderRadius: 2,
                                        border: "1px solid #e5e7eb",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <Button
                                      component="a"
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      variant="outlined"
                                      size="small"
                                      sx={{
                                        textTransform: "none",
                                        color: "#3b82f6",
                                        borderColor: "#cbd5e1",
                                        "&:hover": {
                                          backgroundColor: "#f1f5f9",
                                        },
                                      }}
                                    >
                                      View File {index + 1}
                                    </Button>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body1" sx={{ fontWeight: 500, color: "#6b7280" }}>
                              No file uploaded
                            </Typography>
                          )
                        ) : isCheckbox ? (
                          <TextField
                            fullWidth
                            disabled
                            value={value ? "Yes" : "No"}
                            variant="outlined"
                            size="small"
                          />
                        ) : isDate ? (
                          <TextField
                            fullWidth
                            disabled
                            value={value ? dayjs(value).format("DD MMMM YYYY") : "N/A"}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <TextField
                            fullWidth
                            disabled
                            value={
                              value !== null && value !== undefined && value !== ""
                                ? value.toString()
                                : "N/A"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: "#6b7280" }}>
                No form data to display.
              </Typography>
            )}
          </DialogContent>



          <DialogActions sx={{ p: 4, pt: 0 }}>
            <Button
              onClick={handleCloseFormDataDialog}
              sx={{
                textTransform: 'none',
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}
              aria-label='Close form data dialog'
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              backgroundColor: snackbar.severity === 'success' ? '#d1fae5' : '#fee2e2',
              color: '#1f2937'
            }}
            aria-live='polite'
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}

export default ApproverScreen
