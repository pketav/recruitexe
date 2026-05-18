'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Divider,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  RadioGroup,
  Radio,
  FormGroup,
  Checkbox,
  Stack,
  Container,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  TextFields as TextIcon,
  Subject as TextAreaIcon,
  ArrowDropDown as DropdownIcon,
  RadioButtonChecked as RadioIcon,
  CheckBox as CheckboxIcon,
  ToggleOn as ToggleIcon,
  AttachFile as FileIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import { useApi } from "@core/hooks/useApi"

const fieldTypeIcons = {
  text: { icon: TextIcon, color: '#555', label: 'Text Field' },
  textarea: { icon: TextAreaIcon, color: '#555', label: 'Text Area' },
  dropdown: { icon: DropdownIcon, color: '#555', label: 'Dropdown' },
  radio: { icon: RadioIcon, color: '#555', label: 'Radio Buttons' },
  checkbox: { icon: CheckboxIcon, color: '#555', label: 'Checkboxes' },
  toggle: { icon: ToggleIcon, color: '#555', label: 'Toggle Switch' },
  file: { icon: FileIcon, color: '#555', label: 'File Upload' },
  multifile: { icon: FileIcon, color: '#555', label: 'Multiple Files' },
  daterange: { icon: DateRangeIcon, color: '#555', label: 'Date Range' }
}

const CustomToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{
        p: 2,
        bgcolor: '#FAFBFF',
        borderRadius: '12px 12px 0 0',
        borderBottom: '1px solid #E5E7EB'
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <GridToolbarColumnsButton
          sx={{
            color: '#6366F1',
            '&:hover': { bgcolor: '#F0F4FF' },
            borderRadius: '8px'
          }}
        />
        <GridToolbarDensitySelector
          sx={{
            color: '#6366F1',
            '&:hover': { bgcolor: '#F0F4FF' },
            borderRadius: '8px'
          }}
        />
        <GridToolbarExport
          csvOptions={{
            disableToolbarButton: false
          }}
          printOptions={{
            disableToolbarButton: true
          }}
          sx={{
            color: '#6366F1',
            '&:hover': { bgcolor: '#F0F4FF' },
            borderRadius: '8px'
          }}
        />
        <GridToolbarFilterButton
          sx={{
            color: '#6366F1',
            '&:hover': { bgcolor: '#F0F4FF' },
            borderRadius: '8px'
          }}
        />
      </Box>
    </GridToolbarContainer>
  )
}

const FormBuilder = () => {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [openFieldDialog, setOpenFieldDialog] = useState(false)
  const [editingForm, setEditingForm] = useState(null)
  const [editingField, setEditingField] = useState(null)
  const [editingFieldIndex, setEditingFieldIndex] = useState(-1)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const { callApi } = useApi()

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    fields: []
  })

  // Field form state
  const [fieldForm, setFieldForm] = useState({
    type: 'text',
    label: '',
    description: '',
    required: false,
    placeholder: '',
    fileTypes: [],
    options: [],
    defaultValue: '',
    maxFiles: 1
  })

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      setLoading(true)
      const response = await callApi({
        endpoint: `/v1/api/form/all`,
        method: 'GET',
        disableSnackbar: true
      })

      if (response?.data?.status) {
        setForms(response.data.items || [])
      } else {
        showSnackbar('Failed to fetch forms', 'error')
      }
    } catch (error) {
      console.error('Error fetching forms:', error)
      showSnackbar('Could not connect to the server', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleOpenFormDialog = (form = null) => {
    if (form) {
      setEditingForm(form)
      setFormData({
        title: form.title,
        fields: form.fields || []
      })
    } else {
      setEditingForm(null)
      setFormData({
        title: '',
        fields: []
      })
    }
    setOpenFormDialog(true)
  }

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false)
    setEditingForm(null)
    setFormData({ title: '', fields: [] })
  }

  const handleOpenFieldDialog = (field = null, index = -1) => {
    if (field) {
      setEditingField(field)
      setEditingFieldIndex(index)
      setFieldForm({ ...field })
    } else {
      setEditingField(null)
      setEditingFieldIndex(-1)
      setFieldForm({
        type: 'text',
        label: '',
        description: '',
        required: false,
        placeholder: '',
        fileTypes: [],
        options: [],
        defaultValue: '',
        maxFiles: 1
      })
    }
    setOpenFieldDialog(true)
  }

  const handleCloseFieldDialog = () => {
    setOpenFieldDialog(false)
    setEditingField(null)
    setEditingFieldIndex(-1)
  }

  const handleFieldFormChange = (field, value) => {
    setFieldForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveField = () => {
    const newField = { ...fieldForm }

    // Clean up field based on type
    if (!['text', 'textarea'].includes(newField.type)) {
      newField.placeholder = ''
    }
    if (!['file', 'multifile'].includes(newField.type)) {
      newField.fileTypes = []
      newField.maxFiles = 1
    }
    if (!['dropdown', 'radio', 'checkbox'].includes(newField.type)) {
      newField.options = []
    }

    if (fieldForm.type === 'daterange' && !newField.defaultValue) {
      newField.defaultValue = {
        from: '',
        to: ''
      }
    }

    if (editingFieldIndex >= 0) {
      // Update existing field
      const updatedFields = [...formData.fields]
      updatedFields[editingFieldIndex] = newField
      setFormData(prev => ({ ...prev, fields: updatedFields }))
    } else {
      // Add new field
      setFormData(prev => ({ ...prev, fields: [...prev.fields, newField] }))
    }

    handleCloseFieldDialog()
    showSnackbar(editingFieldIndex >= 0 ? 'Field updated successfully' : 'Field added successfully')
  }

  const handleDeleteField = index => {
    const updatedFields = formData.fields.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, fields: updatedFields }))
    showSnackbar('Field deleted successfully')
  }

  const handleSaveForm = async () => {
    if (!formData.title.trim()) {
      showSnackbar('Please enter a form title', 'error')
      return
    }

    if (formData.fields.length === 0) {
      showSnackbar('Please add at least one field to the form', 'error')
      return
    }

    try {
      setSaving(true)
      let response

      if (editingForm) {
        // Update existing form
        response = await callApi({
          endpoint: `/v1/api/form/update`,
          method: 'POST',
          data: {
            id: editingForm._id,
            ...formData
          }
        })
      } else {
        // Add new form
        response = await callApi({
          endpoint: `/v1/api/form/add`,
          method: 'POST',
          data: formData
        })
      }

      if (response?.data?.status) {
        showSnackbar(editingForm ? 'Form updated successfully' : 'Form created successfully')
        handleCloseFormDialog()
        await fetchForms()
      } else {
        showSnackbar(response?.data?.error || 'Failed to save form', 'error')
      }
    } catch (error) {
      console.error('Error saving form:', error)
      showSnackbar('Error saving form', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleAddOption = () => {
    setFieldForm(prev => ({
      ...prev,
      options: [...(prev.options || []), '']
    }))
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...(fieldForm.options || [])]
    newOptions[index] = value
    setFieldForm(prev => ({ ...prev, options: newOptions }))
  }

  const handleDeleteOption = index => {
    const newOptions = [...(fieldForm.options || [])]
    newOptions.splice(index, 1)
    setFieldForm(prev => ({ ...prev, options: newOptions }))
  }

  const toggleFileType = type => {
    const fileTypes = fieldForm.fileTypes || []
    if (fileTypes.includes(type)) {
      setFieldForm(prev => ({
        ...prev,
        fileTypes: fileTypes.filter(t => t !== type)
      }))
    } else {
      setFieldForm(prev => ({
        ...prev,
        fileTypes: [...fileTypes, type]
      }))
    }
  }

  const renderFieldPreview = (field, isPreview = false) => {
    const disabled = !isPreview

    switch (field?.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            placeholder={field?.placeholder || `Enter ${field?.label?.toLowerCase()}`}
            disabled={disabled}
            size='small'
            variant='outlined'
          />
        )
      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={field?.placeholder || `Enter ${field?.label?.toLowerCase()}`}
            disabled={disabled}
            size='small'
            variant='outlined'
          />
        )
      case 'dropdown':
        return (
          <FormControl fullWidth size='small' disabled={disabled}>
            <InputLabel>{field?.placeholder || `Select ${field?.label?.toLowerCase()}`}</InputLabel>
            <Select label={field?.placeholder || `Select ${field?.label?.toLowerCase()}`}>
              {field?.options?.map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      case 'radio':
        return (
          <RadioGroup>
            {field?.options?.map((option, idx) => (
              <FormControlLabel key={idx} value={option} control={<Radio disabled={disabled} />} label={option} />
            ))}
          </RadioGroup>
        )
      case 'checkbox':
        return (
          <FormGroup>
            {field?.options?.map((option, idx) => (
              <FormControlLabel key={idx} control={<Checkbox disabled={disabled} />} label={option} />
            ))}
          </FormGroup>
        )
      case 'toggle':
        return (
          <FormControlLabel
            control={<Switch disabled={disabled} defaultChecked={field?.defaultValue} />}
            label={`Toggle ${field?.label}`}
          />
        )
      case 'file':
      case 'multifile':
        return (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <UploadIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
            <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
              {field?.type === 'multifile' ? 'Drop files here or click to upload' : 'Drop file here or click to upload'}
            </Typography>
            {field?.fileTypes && field?.fileTypes.length > 0 && (
              <Stack direction='row' spacing={0.5} justifyContent='center' flexWrap='wrap'>
                {field?.fileTypes.map(type => (
                  <Chip key={type} label={type} size='small' variant='outlined' />
                ))}
              </Stack>
            )}
          </Paper>
        )
      case 'daterange':
        return (
          <Stack direction='row' spacing={2} alignItems='center'>
            <TextField
              type='date'
              label='From'
              size='small'
              disabled={disabled}
              value={field?.defaultValue?.from?.substring(0, 10) || ''}
              InputLabelProps={{ shrink: true }}
            />
            <Typography variant='body2' color='text.secondary'>
              to
            </Typography>
            <TextField
              type='date'
              label='To'
              size='small'
              disabled={disabled}
              value={field?.defaultValue?.to?.substring(0, 10) || ''}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        )
      default:
        return <Typography color='text.secondary'>Unknown field type: {field?.type}</Typography>
    }
  }

  const columns = [
    {
      field: 'title',
      headerName: 'Form Title',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'fieldCount',
      headerName: 'Fields',
      width: 100,
      renderCell: params => <Chip label={params.row.fields?.length || 0} size='small' variant='outlined' />
    },
    {
      field: 'requiredFields',
      headerName: 'Required',
      width: 100,
      renderCell: params => (
        <Chip
          label={params.row.fields?.filter(f => f.required).length || 0}
          size='small'
          color='error'
          variant='outlined'
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: params => (
        <Stack direction='row' spacing={1}>
          <Tooltip title='Edit Form'>
            <IconButton size='small' onClick={() => handleOpenFormDialog(params.row)}>
              <EditIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Preview Form'>
            <IconButton
              size='small'
              onClick={() => {
                setFormData(params.row)
                setPreviewMode(true)
              }}
            >
              <VisibilityIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ]

  return (
    <Box sx={{ bgcolor: '#fafafa' }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <Container maxWidth='xl'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Box>
              <Typography variant='h5' fontWeight={500} color='text.primary'>
                Form Management
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Create and manage multiple forms
              </Typography>
            </Box>

            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={() => handleOpenFormDialog()}
              sx={{ textTransform: 'none' }}
            >
              Add New Form
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth='xl' sx={{ py: 4 }}>
        {/* Forms Table */}
        <Card variant='outlined'>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={forms}
                columns={columns}
                getRowId={row => row._id}
                loading={loading}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } }
                }}
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
                        gap: 2,
                        color: 'text.secondary'
                      }}
                    >
                      <Typography variant='h6' sx={{ fontWeight: 500 }}>
                        No Forms found
                      </Typography>
                    </Box>
                  )
                }}
                disableRowSelectionOnClick
                sx={{
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: "#1976d2",
                          color: "#fff",
                        },
                        "& .MuiDataGrid-columnHeader": {
                          backgroundColor: "#1976d2",
                          color: "#fff",
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          fontWeight: "bold",
                          color: "#fff",
                        },
                        "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
                          color: "#fff",
                        },
                        "& .MuiDataGrid-columnHeader .MuiBox-root": {
                          color: "#fff",
                        },
                        "& .MuiDataGrid-cell": {
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        },
                        "& .MuiDataGrid-toolbarContainer": {
                          padding: "8px",
                          backgroundColor: "#f5f5f5",
                        },
                      }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Form Builder Dialog */}
        <Dialog
          open={openFormDialog}
          onClose={handleCloseFormDialog}
          maxWidth='lg'
          fullWidth
          PaperProps={{ sx: { maxHeight: '95vh' } }}
        >
          <DialogTitle
            sx={{
              bgcolor: 'grey.50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant='h6' fontWeight={500}>
              {editingForm ? 'Edit Form' : 'Create New Form'}
            </Typography>
            <IconButton onClick={handleCloseFormDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Left Side - Form Configuration */}
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label='Form Title'
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        minHeight: '56px' // Ensure adequate height
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '1rem',
                        padding: '16px 14px' // Adequate padding
                      }
                    }}
                  />

                  <Divider />

                  <Box>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
                      <Typography variant='h6' fontWeight={500}>
                        Form Fields ({formData.fields.length})
                      </Typography>
                      <Button
                        variant='outlined'
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenFieldDialog()}
                        sx={{ textTransform: 'none' }}
                      >
                        Add Field
                      </Button>
                    </Stack>

                    {formData.fields.length > 0 ? (
                      <Stack spacing={2}>
                        {formData.fields.map((field, index) => {
                          const fieldTypeConfig = fieldTypeIcons[field.type]
                          const IconComponent = fieldTypeConfig?.icon || TextIcon

                          return (
                            <Card key={index} variant='outlined'>
                              <CardContent sx={{ p: 2 }}>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                  <IconComponent sx={{ color: 'text.secondary' }} />
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Stack direction='row' spacing={1} alignItems='center'>
                                      <Typography variant='subtitle1' fontWeight={500}>
                                        {field.label}
                                      </Typography>
                                      {field.required && (
                                        <Chip label='Required' size='small' color='error' variant='outlined' />
                                      )}
                                      <Chip
                                        label={fieldTypeConfig?.label}
                                        size='small'
                                        variant='outlined'
                                        sx={{ fontSize: '0.7rem' }}
                                      />
                                    </Stack>
                                    {field.description && (
                                      <Typography variant='body2' color='text.secondary'>
                                        {field.description}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Stack direction='row' spacing={1}>
                                    <IconButton size='small' onClick={() => handleOpenFieldDialog(field, index)}>
                                      <EditIcon fontSize='small' />
                                    </IconButton>
                                    <IconButton size='small' onClick={() => handleDeleteField(index)}>
                                      <DeleteIcon fontSize='small' color='error' />
                                    </IconButton>
                                  </Stack>
                                </Stack>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </Stack>
                    ) : (
                      <Paper
                        variant='outlined'
                        sx={{
                          p: 4,
                          textAlign: 'center',
                          bgcolor: 'grey.50'
                        }}
                      >
                        <Typography variant='body1' color='text.secondary' gutterBottom>
                          No fields added yet
                        </Typography>
                        <Button
                          variant='outlined'
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenFieldDialog()}
                          sx={{ textTransform: 'none' }}
                        >
                          Add Your First Field
                        </Button>
                      </Paper>
                    )}
                  </Box>
                </Stack>
              </Grid>

              {/* Right Side - Preview */}
              <Grid item xs={12} md={4}>
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                  <Typography variant='subtitle1' fontWeight={500} sx={{ mb: 2 }}>
                    Form Preview
                  </Typography>
                  <Card variant='outlined'>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        {formData.title || 'Form Title'}
                      </Typography>
                      {formData.fields.length > 0 ? (
                        <Stack spacing={2}>
                          {formData.fields.slice(0, 3).map((field, index) => (
                            <Box key={index}>
                              <Typography variant='subtitle2' gutterBottom>
                                {field.label}
                                {field.required && <span style={{ color: 'red' }}> *</span>}
                              </Typography>
                              {renderFieldPreview(field)}
                            </Box>
                          ))}
                          {formData.fields.length > 3 && (
                            <Typography variant='body2' color='text.secondary' textAlign='center'>
                              ... and {formData.fields.length - 3} more fields
                            </Typography>
                          )}
                        </Stack>
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          Add fields to see preview
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Button onClick={handleCloseFormDialog}>Cancel</Button>
            <Button
              onClick={handleSaveForm}
              variant='contained'
              disabled={!formData.title || formData.fields.length === 0 || saving}
              startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            >
              {saving ? 'Saving...' : editingForm ? 'Update Form' : 'Create Form'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Field Builder Dialog */}
        <Dialog
          open={openFieldDialog}
          onClose={handleCloseFieldDialog}
          maxWidth='md'
          fullWidth
          PaperProps={{
            sx: {
              maxHeight: '90vh',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: 'white',
              borderBottom: '1px solid #f0f0f0',
              py: 3,
              px: 3
            }}
          >
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Box>
                <Typography variant='h6' fontWeight={600} color='text.primary'>
                  {editingField ? 'Edit Field' : 'Add New Field'}
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                  Configure the field properties and validation rules
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseFieldDialog}
                sx={{
                  bgcolor: 'grey.50',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant='body2' fontWeight={500} sx={{ mb: 1, color: 'text.primary' }}>
                      Field Label *
                    </Typography>
                    <TextField
                      fullWidth
                      value={fieldForm.label}
                      onChange={e => handleFieldFormChange('label', e.target.value)}
                      placeholder='Enter field label'
                      variant='outlined'
                      size='medium'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          bgcolor: 'grey.50',
                          '&:hover': {
                            bgcolor: 'white'
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white'
                          }
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant='body2' fontWeight={500} sx={{ mb: 1, color: 'text.primary' }}>
                      Field Type
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={fieldForm.type}
                        onChange={e => handleFieldFormChange('type', e.target.value)}
                        displayEmpty
                        variant='outlined'
                        size='medium'
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: 'grey.50',
                          '&:hover': {
                            bgcolor: 'white'
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white'
                          },
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                          }
                        }}
                        renderValue={selected => {
                          if (!selected) return <Typography color='text.secondary'>Select field type</Typography>
                          const config = fieldTypeIcons[selected]
                          const IconComponent = config?.icon || TextIcon
                          return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <IconComponent sx={{ color: 'primary.main', fontSize: 20 }} />
                              <Typography fontWeight={500}>{config?.label || selected}</Typography>
                            </Box>
                          )
                        }}
                      >
                        {Object.entries(fieldTypeIcons).map(([type, config]) => {
                          const IconComponent = config.icon
                          return (
                            <MenuItem key={type} value={type} sx={{ py: 1.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <IconComponent sx={{ color: 'primary.main' }} />
                              </ListItemIcon>
                              <ListItemText primary={config.label} primaryTypographyProps={{ fontWeight: 500 }} />
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <Typography variant='body2' fontWeight={500} sx={{ mb: 1, color: 'text.primary' }}>
                      Description
                    </Typography>
                    <TextField
                      fullWidth
                      value={fieldForm.description}
                      onChange={e => handleFieldFormChange('description', e.target.value)}
                      placeholder='Enter field description (optional)'
                      multiline
                      rows={3}
                      variant='outlined'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          bgcolor: 'grey.50',
                          '&:hover': {
                            bgcolor: 'white'
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white'
                          }
                        }
                      }}
                    />
                  </Box>
                </Grid>

                {/* Validation Rules */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                    Validation Rules
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 1.5,
                      bgcolor: 'grey.50'
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={fieldForm.required}
                          onChange={e => handleFieldFormChange('required', e.target.checked)}
                          color='primary'
                        />
                      }
                      label={
                        <Box>
                          <Typography variant='body2' fontWeight={500}>
                            Required field
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            Users must fill this field
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </Grid>

                {['text', 'textarea'].includes(fieldForm.type) && (
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant='body2' fontWeight={500} sx={{ mb: 1, color: 'text.primary' }}>
                        Placeholder Text
                      </Typography>
                      <TextField
                        fullWidth
                        value={fieldForm.placeholder || ''}
                        onChange={e => handleFieldFormChange('placeholder', e.target.value)}
                        placeholder='Enter placeholder text'
                        variant='outlined'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            bgcolor: 'grey.50',
                            '&:hover': {
                              bgcolor: 'white'
                            },
                            '&.Mui-focused': {
                              bgcolor: 'white'
                            }
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Advanced Options */}
                {(['dropdown', 'radio', 'checkbox'].includes(fieldForm.type) ||
                  ['file', 'multifile'].includes(fieldForm.type) ||
                  fieldForm.type === 'daterange') && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                        Advanced Options
                      </Typography>
                    </Grid>

                    {['dropdown', 'radio', 'checkbox'].includes(fieldForm.type) && (
                      <Grid item xs={12}>
                        <Box>
                          <Typography variant='body2' fontWeight={500} sx={{ mb: 2, color: 'text.primary' }}>
                            Options
                          </Typography>
                          <Stack spacing={2}>
                            {(fieldForm.options || []).map((option, index) => (
                              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                  fullWidth
                                  placeholder={`Option ${index + 1}`}
                                  value={option}
                                  onChange={e => handleOptionChange(index, e.target.value)}
                                  size='small'
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1,
                                      bgcolor: 'grey.50'
                                    }
                                  }}
                                />
                                <IconButton
                                  color='error'
                                  onClick={() => handleDeleteOption(index)}
                                  size='small'
                                  sx={{
                                    bgcolor: 'error.50',
                                    '&:hover': { bgcolor: 'error.100' }
                                  }}
                                >
                                  <DeleteIcon fontSize='small' />
                                </IconButton>
                              </Box>
                            ))}
                            <Button
                              startIcon={<AddIcon />}
                              onClick={handleAddOption}
                              variant='outlined'
                              sx={{
                                textTransform: 'none',
                                borderRadius: 1,
                                borderStyle: 'dashed',
                                py: 1.5,
                                color: 'primary.main',
                                borderColor: 'primary.main',
                                '&:hover': {
                                  bgcolor: 'primary.50',
                                  borderColor: 'primary.main'
                                }
                              }}
                            >
                              Add Option
                            </Button>
                          </Stack>
                        </Box>
                      </Grid>
                    )}

                    {['file', 'multifile'].includes(fieldForm.type) && (
                      <Grid item xs={12}>
                        <Box>
                          <Typography variant='body2' fontWeight={500} sx={{ mb: 2, color: 'text.primary' }}>
                            Accepted File Types
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'csv', 'xlsx', 'json'].map(
                              type => (
                                <Chip
                                  key={type}
                                  label={type.toUpperCase()}
                                  clickable
                                  color={fieldForm.fileTypes?.includes(type) ? 'primary' : 'default'}
                                  onClick={() => toggleFileType(type)}
                                  variant={fieldForm.fileTypes?.includes(type) ? 'filled' : 'outlined'}
                                  sx={{
                                    fontWeight: 500,
                                    '&:hover': {
                                      transform: 'translateY(-1px)',
                                      boxShadow: 1
                                    }
                                  }}
                                />
                              )
                            )}
                          </Box>
                          {fieldForm.type === 'multifile' && (
                            <TextField
                              fullWidth
                              type='number'
                              label='Maximum Files'
                              value={fieldForm.maxFiles || 1}
                              onChange={e => handleFieldFormChange('maxFiles', Number.parseInt(e.target.value))}
                              inputProps={{ min: 1 }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1.5,
                                  bgcolor: 'grey.50'
                                }
                              }}
                            />
                          )}
                        </Box>
                      </Grid>
                    )}

                    {fieldForm.type === 'daterange' && (
                      <Grid item xs={12}>
                        <Box>
                          <Typography variant='body2' fontWeight={500} sx={{ mb: 2, color: 'text.primary' }}>
                            Default Date Range
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box>
                                <Typography variant='caption' color='text.secondary' sx={{ mb: 0.5, display: 'block' }}>
                                  From Date
                                </Typography>
                                <TextField
                                  fullWidth
                                  type='date'
                                  value={fieldForm.defaultValue?.from || ''}
                                  onChange={e =>
                                    handleFieldFormChange('defaultValue', {
                                      ...(fieldForm.defaultValue || {}),
                                      from: e.target.value
                                    })
                                  }
                                  InputLabelProps={{ shrink: true }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1.5,
                                      bgcolor: 'grey.50',
                                      '&:hover': {
                                        bgcolor: 'white'
                                      },
                                      '&.Mui-focused': {
                                        bgcolor: 'white'
                                      }
                                    }
                                  }}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>
                                <Typography variant='caption' color='text.secondary' sx={{ mb: 0.5, display: 'block' }}>
                                  To Date
                                </Typography>
                                <TextField
                                  fullWidth
                                  type='date'
                                  value={fieldForm.defaultValue?.to || ''}
                                  onChange={e =>
                                    handleFieldFormChange('defaultValue', {
                                      ...(fieldForm.defaultValue || {}),
                                      to: e.target.value
                                    })
                                  }
                                  InputLabelProps={{ shrink: true }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1.5,
                                      bgcolor: 'grey.50',
                                      '&:hover': {
                                        bgcolor: 'white'
                                      },
                                      '&.Mui-focused': {
                                        bgcolor: 'white'
                                      }
                                    }
                                  }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
              bgcolor: 'grey.50',
              borderTop: '1px solid #f0f0f0',
              gap: 2
            }}
          >
            <Button
              onClick={handleCloseFieldDialog}
              variant='outlined'
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
                px: 3,
                py: 1,
                fontWeight: 500
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveField}
              variant='contained'
              disabled={!fieldForm.label}
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
                px: 3,
                py: 1,
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
            >
              {editingField ? 'Update Field' : 'Add Field'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog
          open={previewMode}
          onClose={() => setPreviewMode(false)}
          maxWidth='md'
          fullWidth
          PaperProps={{ sx: { maxHeight: '90vh' } }}
        >
          <DialogTitle
            sx={{
              bgcolor: 'grey.50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant='h6' fontWeight={500}>
              Form Preview
            </Typography>
            <IconButton onClick={() => setPreviewMode(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Typography variant='h5' fontWeight={500} sx={{ mb: 1 }}>
              {formData.title}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Please fill out all the required fields below.
            </Typography>

            {formData.fields?.length > 0 ? (
              <Stack spacing={3}>
                {formData.fields.map((field, index) => (
                  <Box key={index}>
                    <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                      <Typography variant='subtitle1' fontWeight={500}>
                        {field.label}
                      </Typography>
                      {field.required && (
                        <Typography color='error' sx={{ fontSize: '1.2rem' }}>
                          *
                        </Typography>
                      )}
                    </Stack>
                    {field.description && (
                      <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                        {field.description}
                      </Typography>
                    )}
                    {renderFieldPreview(field, true)}
                  </Box>
                ))}

                {/* <Box sx={{ pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
                  <Button fullWidth variant="contained" size="large" sx={{ py: 1.5, textTransform: "none" }}>
                    Submit Form
                  </Button>
                </Box> */}
              </Stack>
            ) : (
              <Typography variant='body1' color='text.secondary' textAlign='center' sx={{ py: 4 }}>
                No fields to preview.
              </Typography>
            )}
          </DialogContent>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant='filled'>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}

export default FormBuilder
