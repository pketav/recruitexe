'use client'
import { useEffect, useState, useCallback, useMemo, memo, useRef } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
  Stack,
  Switch,
  Accordion,
  AccordionSummary,
  Checkbox,
  AccordionDetails,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader
} from '@mui/material'

import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { Filter, Search } from '@mui/icons-material'
import { DataGrid, GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  useGridApiRef } from '@mui/x-data-grid'

import {
  AddClientApi,
  getAllEmployeeApi,
  getAllFormAPI,
  getAllProductsAPI,
  getAllUnselectedProductsAPI,
  getAllUserApi,
  getAllUserProductsAPI,
  getMyPartnersAPI,
  sendRequestApi
} from '@/services/apiService'
import Modal from '../components/modal'

import CustomTextField from '@/@core/components/mui/TextField'

const ThrottledTextField = memo(({ value, onChange, onChangeImmediate, delay = 300, ...props }) => {
  const [localValue, setLocalValue] = useState(value || '')
  const timeoutRef = useRef(null)

  // Update local value when prop value changes
  useEffect(() => {
    // Only update if the value is different to avoid loops
    if (value !== undefined && value !== localValue) {
      setLocalValue(value)
    }
  }, [value])

  const handleChange = e => {
    const newValue = e.target.value

    // Update local state immediately for responsive UI
    setLocalValue(newValue)

    // Call immediate change handler if provided
    if (onChangeImmediate) {
      onChangeImmediate(e)
    }

    // Debounce the actual state update
    if (onChange) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        onChange(newValue)
      }, delay)
    }
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return <CustomTextField {...props} value={localValue} onChange={handleChange} />
})

const FieldInput = memo(
  ({ field, fieldIndex, productId, fieldType, onFieldChange, onRemoveField, formOptions = [] }) => {
    // Track if a selection has been made and maintain it
    const [selectedField, setSelectedField] = useState(() => {
      if (field.fieldId) {
        return formOptions.find(option => option._id === field.fieldId) || null
      } else if (field._id === 'other') {
        return { _id: 'other', fieldName: 'Other (Custom Field)' }
      }

      return null
    })

    // Generate stable id for component
    const fieldId = `${productId}-${fieldType}-${fieldIndex}`

    // Determine if custom fields should be shown
    const showCustomFields = selectedField && selectedField._id === 'other'

    // Update local state when props change
    useEffect(() => {
      if (field.fieldId) {
        setSelectedField(formOptions.find(option => option._id === field.fieldId) || null)
      } else if (field._id === 'other') {
        setSelectedField({ _id: 'other', fieldName: 'Other (Custom Field)' })
      } else if (!field.fieldId && !field._id) {
        setSelectedField(null)
      }
    }, [field.fieldId, field._id, formOptions])

    // Handle the autocomplete change
    const handleFormFieldChange = (event, newValue) => {
      // Set the local state immediately to prevent UI flickering
      setSelectedField(newValue)

      if (newValue && newValue._id === 'other') {
        // Handle selecting "Other"
        onFieldChange(productId, fieldType, fieldIndex, '_id', 'other')
        onFieldChange(productId, fieldType, fieldIndex, 'fieldId', null)

        // Initialize or maintain custom field values
        if (!field.fieldName) {
          onFieldChange(productId, fieldType, fieldIndex, 'fieldName', '')
        }

        if (!field.dataType) {
          onFieldChange(productId, fieldType, fieldIndex, 'dataType', 'string')
        }
      } else if (newValue) {
        // Handle selecting a predefined field
        onFieldChange(productId, fieldType, fieldIndex, 'fieldId', newValue._id)
        onFieldChange(productId, fieldType, fieldIndex, '_id', null)

        // Clear custom field values
        onFieldChange(productId, fieldType, fieldIndex, 'fieldName', null)
        onFieldChange(productId, fieldType, fieldIndex, 'dataType', null)
      } else {
        // Handle clearing selection (should rarely happen with fixed implementation)
        onFieldChange(productId, fieldType, fieldIndex, 'fieldId', null)
        onFieldChange(productId, fieldType, fieldIndex, '_id', null)
        onFieldChange(productId, fieldType, fieldIndex, 'fieldName', null)
        onFieldChange(productId, fieldType, fieldIndex, 'dataType', null)
      }
    }

    // Create a deduplicated options array with unique keys for rendering
    const uniqueOptions = useMemo(() => {
      // Create a map to track seen options
      const seen = new Map()

      // Process form options
      const processed = formOptions.map(option => {
        // Generate a unique key based on id and name
        const uniqueKey = `${option._id}-${option.fieldName}`

        // Mark this option as seen
        seen.set(uniqueKey, true)

        // Return option with unique key for rendering
        return {
          ...option,
          uniqueKey
        }
      })

      // Add "Other" option
      const otherOption = { _id: 'other', fieldName: 'Other (Custom Field)', uniqueKey: 'other-custom' }

      return [...processed, otherOption]
    }, [formOptions])

    return (
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }} alignItems='center'>
        <Autocomplete
          fullWidth
          id={`form-field-select-${fieldId}`}
          options={uniqueOptions}
          getOptionLabel={option => option?.fieldName || ''}
          value={selectedField}
          onChange={handleFormFieldChange}
          renderInput={params => (
            <CustomTextField
              {...params}
              label='Select Verification Field'
              required
              error={!selectedField}
              helperText={!selectedField ? 'Please select a field' : ''}
            />
          )}
          isOptionEqualToValue={(option, value) => {
            if (!option || !value) return false

            return option._id === value._id
          }}
          renderOption={(props, option) => (
            <li {...props} key={option.uniqueKey}>
              {option.fieldName} {option.dataType && option._id !== 'other' ? `(${option.dataType})` : ''}
            </li>
          )}
          // These properties help prevent the selection from resetting
          disableClearable={!!selectedField}
          blurOnSelect
          selectOnFocus
        />

        {showCustomFields && (
          <>
            <ThrottledTextField
              label='Custom Field Name'
              value={field.fieldName || ''}
              onChange={value => onFieldChange(productId, fieldType, fieldIndex, 'fieldName', value)}
              fullWidth
              required
              error={!field.fieldName}
              helperText={!field.fieldName ? 'Field name is required' : ''}
            />
            <FormControl fullWidth required>
              <ThrottledTextField
                value={field.dataType || 'string'}
                onChange={value => onFieldChange(productId, fieldType, fieldIndex, 'dataType', value)}
                label='Data Type'
                select
                fullWidth
              >
                <MenuItem value='string'>Text</MenuItem>
                <MenuItem value='file'>File</MenuItem>
                <MenuItem value='textarea'>Details</MenuItem>
                <MenuItem value='multiUpload'>MultiUpload</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </ThrottledTextField>
            </FormControl>
          </>
        )}

        <IconButton color='error' onClick={() => onRemoveField(productId, fieldType, fieldIndex)} size='small'>
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    )
  }
)

// Updated FieldSection Component
const FieldSection = memo(
  ({ product, fieldType, title, onSectionToggle, onFieldChange, onRemoveField, onAddField, formOptions = [] }) => {
    const isActive = product[fieldType].isActive
    const productId = product.userProductId

    return (
      <Card variant='outlined' sx={{ mb: 2 }}>
        <CardHeader
          title={
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Typography variant='subtitle1'>{title}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={() => onSectionToggle(productId, fieldType)}
                    color='primary'
                    size='small'
                  />
                }
                label={isActive ? 'Active' : 'Inactive'}
              />
            </Stack>
          }
          sx={{ pb: 0 }}
        />

        {isActive && (
          <CardContent>
            {product[fieldType].fields.length > 0 ? (
              product[fieldType].fields.map((field, index) => (
                <FieldInput
                  key={`${fieldType}-${index}`}
                  field={field}
                  fieldIndex={index}
                  productId={productId}
                  fieldType={fieldType}
                  onFieldChange={onFieldChange}
                  onRemoveField={onRemoveField}
                  formOptions={formOptions}
                />
              ))
            ) : (
              <Typography color='textSecondary' variant='body2' sx={{ mb: 2 }}>
                No fields added yet. Click Add Field to begin.
              </Typography>
            )}

            <Box display='flex' justifyContent='flex-end'>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => onAddField(productId, fieldType)}
                color='primary'
                size='small'
              >
                Add Field
              </Button>
            </Box>
          </CardContent>
        )}
      </Card>
    )
  }
)

// Product Accordion Component
const ProductAccordion = memo(
  ({ product, selectedProducts, onProductSelection, onChargeChange, onCheckboxClick, fieldSections }) => {
    return (
      <Accordion
        key={product.userProductId}
        sx={{ mt: 2 }}
        expanded={selectedProducts[product.userProductId] || false}
        onChange={() => onProductSelection(product.userProductId)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`product-${product.userProductId}-content`}
          id={`product-${product.userProductId}-header`}
        >
          <FormControlLabel
            aria-label='Select product'
            control={
              <Checkbox
                checked={selectedProducts[product.userProductId] || false}
                onChange={e => onCheckboxClick(product.userProductId, e)}
                onClick={e => e.stopPropagation()}
              />
            }
            label={<Typography variant='subtitle1'>{product.productName}</Typography>}
            sx={{ width: '100%', m: 0 }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ThrottledTextField
                fullWidth
                label='Charge (₹)'
                type='number'
                value={product.charge}
                onChange={value => onChargeChange(product.userProductId, value)}
                margin='normal'
                InputProps={{ inputProps: { min: 0 } }}
                required
              />
            </Grid>
          </Grid>
          {fieldSections}
        </AccordionDetails>
      </Accordion>
    )
  }
)

 function CustomToolbar() {
    return (
      <GridToolbarContainer 
        sx={{ p: 4 }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport 
          csvOptions={{
            fileName: 'exported-data',
            delimiter: ',',
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }

// Main componen
export default function NewPartner() {
  // Helper function for debounce
  function debounce(func, wait) {
    let timeout

    return function (...args) {
      const context = this

      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(context, args), wait)
    }
  }
  const columns = useMemo(
    () => [
      {
        field: 'partnerName',
        headerName: 'Client Name',
        flex: 1,
        minWidth: 150,
        headerClassName: 'super-app-theme--header',
        headerAlign: 'start',
        align: 'start'
      },
      // {
      //   field: 'userName',
      //   headerName: 'User Name',
      //   flex: 1,
      //   minWidth: 150,
      //   headerClassName: 'super-app-theme--header',
      //   headerAlign: 'start',
      //   align: 'start'
      // },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 150,
        headerClassName: 'super-app-theme--header',
        headerAlign: 'start',
        align: 'start'
      },
      {
        field: 'createdAt',
        headerName: 'Client From',
        flex: 1,
        minWidth: 150,
        headerClassName: 'super-app-theme--header',
        headerAlign: 'start',
        align: 'start'
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        minWidth: 150,
        headerClassName: 'super-app-theme--header',
        headerAlign: 'end',
        align: 'end',
        renderCell: params => {
          return (
            <>
                <Button
                    color='primary'
                    variant='contained'
                    onClick={() => handleOpen(params.row)}
                >
                    View
                </Button>
            </>
          )
        }
      }
    ],
    []
  )

  // State definitions with reduced nesting where possible
  const [partner, setPartner] = useState([])
  const [rows, setRows] = useState([])

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const [openReq, setOpen] = useState(false)
  const [emp, setEmp] = useState([])
  const [productLibrary, setProductsLibrary] = useState([])
  const [clientProductLibrary, setClientProductLibrary] = useState([])
  const [reqAllo, setReqAllo] = useState([])

  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    companyName: '',
    domain: '',
    invoiceRaise: '',
    invoiceCycle: '',
    allocationId: []
  })

  const [selection, setSelection] = useState('')
  const [selectedValue, setSelectedValue] = useState('p')
  const [openCLientAdd, setOpenCLientAdd] = useState(false)
  const [userProducts, setUserProducts] = useState([])
  const [productForms, setProductForms] = useState([])
  const [clientProductForms, setClientProductForms] = useState([])
  const [selectedProducts, setSelectedProducts] = useState({})
  const [clientSelectedProducts, setClientSelectedProducts] = useState({})
  const [forms, setForm] = useState([])

  const handleClientChargeChange = useCallback((productId, value) => {
    setClientProductForms(prevForms =>
      prevForms.map(product => (product.userProductId === productId ? { ...product, charge: Number(value) } : product))
    )
  })

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }, [])
  
  const fetchProductLibrary = useCallback(async () => {
    try {
      const response = await getAllProductsAPI()


      if (response && response.items) {
        setProductsLibrary(response.items)
        setClientProductLibrary(response.items)
      }
    } catch (error) {
      console.error('Error fetching product library:', error)
    }
  }, [])

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await getAllEmployeeApi()

      if (response?.items) {
        setEmp(response.items.employees || [])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }, [])

  // const fetchAllUsers = useCallback(async () => {
  //   try {
  //     const response = await getAllUserApi()

  //     if (!response?.items) {
  //       throw new Error('Invalid response format')
  //     }

  //     setPartner(response.items)
  //   //   setRows(
  //   //     response.items.map(item => ({
  //   //       _id: item._id,
  //   //       fullName: item.fullName,
  //   //       companyName: item.companyData?.companyName,
  //   //       companyDomain: item.companyData?.domain,
  //   //       email: item.email,
  //   //       userName: item.userName,
  //   //       edit: false,
  //   //       delete: false,
  //   //       view: true
  //   //     }))
  //   //   )
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: 'Failed to fetch users: ' + error.message,
  //       severity: 'error'
  //     })
  //   }
  // }, [])

  const fetchAllPartners = useCallback(async () => {
      try {
        const res = await getMyPartnersAPI()
  
  
        if (res && res.items) {
          setRows(
            res.items.map(item => ({
              _id: item?._id, 
              partnerName: item?.employee?.employeName,
              partnerId: item?.partnerId,
              userName: item?.partner?.userName,
              email: item?.employee?.email,
              productForm: item.productForm,
              allocationId: item.allocationId,
              createdAt: item?.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '',
              edit: false,
              delete: false,
              view: false
            }))
          )
        }
      } catch (error) {
        console.error('Error fetching partners:', error)
        setSnackbar({
          open: true,
          message: 'Error fetching partners',
          severity: 'error'
        })
      }
    }, [])

     useEffect(() => {
        fetchAllPartners()
      }, [])

  const fetchAllUserProduct = useCallback(async () => {
    try {
      const response = await getAllUserProductsAPI()

      setUserProducts(response.items || [])
    } catch (error) {
    }
  }, [])

  const fetchAllForm = useCallback(async () => {
    try {
      const response = await getAllFormAPI()


      setForm(response.items || [])
    } catch (error) {
    }
  }, [])

  // =============== MODAL HANDLERS ===============
const router = useRouter()
const [activeStep, setActiveStep] = useState(0)

const handleNext = () => {
  if (activeStep === 0) {
    setActiveStep(1)
  } else {
    handleAddSubmit()
  }
}

const handleBack = () => {
  setActiveStep(prev => prev - 1)
}

  const handleOpen = useCallback(data => {
    router.push(`/commandexe/partner/${data._id}`)
  }, [])

  const handleOpenClientAdd = useCallback(() => {
    setOpenCLientAdd(true)
  }, [])

  const handleCloseClientAdd = useCallback(() => {
    setOpenCLientAdd(false)
    setClientProductForms([])
    setClientSelectedProducts({})
    setFormData({
      fullName: '',
      userName: '',
      email: '',
      password: '',
      companyName: '',
      domain: '',
      allocationId: []
    })
  }, [])

  const handleClientCheckboxClick = useCallback((productId, e) => {
    e.stopPropagation()
    setClientSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }, [])

  const handleClientProductSelection = useCallback(productId => {
    setClientSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }, [])

  const handleCLientSectionToggle = useCallback((productId, fieldType) => {
    setClientProductForms(prevForms =>
      prevForms.map(product =>
        product.userProductId === productId
          ? {
              ...product,
              [fieldType]: {
                ...product[fieldType],
                isActive: !product[fieldType].isActive
              }
            }
          : product
      )
    )
  }, [])

  const handleClientFieldChange = useCallback((productId, fieldType, index, fieldKey, value) => {
    // Update state immediately for better UI responsiveness
    setClientProductForms(prevForms => {
      return prevForms.map(product => {
        if (product.userProductId === productId) {
          // Make sure the fields array exists and has enough elements
          const fields = [...(product[fieldType].fields || [])]

          // Create or update the field at the specified index
          while (fields.length <= index) {
            fields.push({})
          }

          // Update the specific field with a new object to ensure React detects the change
          fields[index] = {
            ...fields[index],
            [fieldKey]: value
          }

          // Return a new product object with the updated fields
          return {
            ...product,
            [fieldType]: {
              ...product[fieldType],
              fields
            }
          }
        }

        return product
      })
    })
    // Skip the debounce for better responsiveness
    // We could add it back if performance becomes an issue
  }, [])

  const handleClientAddField = useCallback((productId, fieldType) => {
    setClientProductForms(prevForms => {
      return prevForms.map(product => {
        if (product.userProductId === productId) {
          // Add a new field with empty values
          const newField = {
            // Don't set fieldId or _id initially, let user select from dropdown
            fieldName: null,
            dataType: null
          }

          return {
            ...product,
            [fieldType]: {
              ...product[fieldType],
              fields: [...(product[fieldType].fields || []), newField]
            }
          }
        }

        return product
      })
    })
  }, [])

  const handleClientRemoveField = useCallback((productId, fieldType, index) => {
    setClientProductForms(prevForms =>
      prevForms.map(product => {
        if (product.userProductId === productId) {
          const updatedFields = [...product[fieldType].fields]

          updatedFields.splice(index, 1)

          return {
            ...product,
            [fieldType]: {
              ...product[fieldType],
              fields: updatedFields
            }
          }
        }

        return product
      })
    )

  }, [])

  const handleAddSubmit = useCallback(
    async e => {
      e.preventDefault()

      // Validate required fields
      if (!formData.fullName || !formData.userName || !formData.email || !formData.password) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          severity: 'error'
        })

        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailRegex.test(formData.email)) {
        setSnackbar({
          open: true,
          message: 'Please enter a valid email address',
          severity: 'error'
        })

        return
      }

      const selectedProductForms = clientProductForms.filter(product => clientSelectedProducts[product.userProductId])

      // Only proceed if at least one product is selected
      if (selectedProductForms.length === 0) {
        setSnackbar({
          open: true,
          message: 'Please select at least one product',
          severity: 'error'
        })

        return
      }

      // Validate each selected product
      let isValid = true

      selectedProductForms.forEach(product => {
        if (!product.charge) {
          setSnackbar({
            open: true,
            message: `Please enter charge for ${product.productName}`,
            severity: 'error'
          })
          isValid = false
        }

        // Validate fields for each field type
        ;['initFields', 'submitFields', 'agentFields', 'allocationFields'].forEach(fieldType => {
          if (product[fieldType].isActive) {
            product[fieldType].fields.forEach((field, index) => {
              if (!field.fieldId && field._id === 'other') {
                if (!field.fieldName) {
                  setSnackbar({
                    open: true,
                    message: `Please enter field name for custom field in ${fieldType} of ${product.productName}`,
                    severity: 'error'
                  })
                  isValid = false
                }
              } else if (!field.fieldId && !field._id) {
                setSnackbar({
                  open: true,
                  message: `Please select a field or "Other" for ${fieldType} of ${product.productName}`,
                  severity: 'error'
                })
                isValid = false
              }
            })
          }
        })
      })

      if (!isValid) return

      const formattedProductForms = selectedProductForms.map(product => {
        const formattedProduct = {
          userProductId: product.userProductId,
          productName: product.productName,
          charge: Number(product.charge)
        }

        // Format each field type
        ;['initFields', 'submitFields', 'agentFields', 'allocationFields'].forEach(fieldType => {
          formattedProduct[fieldType] = {
            isActive: product[fieldType].isActive,
            fields: product[fieldType].fields.map(field => {
              if (field.fieldId) {
                // If a form field was selected
                return { fieldId: field.fieldId }
              } else if (field._id === 'other') {
                // If custom field was created
                return {
                  fieldName: field.fieldName,
                  dataType: field.dataType || 'string'
                }
              }

              return field // Should not reach here if validation is proper
            })
          }
        })

        return formattedProduct
      })

      const payload = {
        fullName: formData.fullName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        allocationId: formData.allocationId,
        companyName: formData.companyName,
        domain: formData.domain,
        invoiceRaise: formData.invoiceRaise,
        invoiceCycle: formData.invoiceCycle,
        productForm: formattedProductForms
      }


      try {
        const res = await AddClientApi(payload)

        if (res.status) {
          setSnackbar({
            open: true,
            message: 'Client Added successfully!',
            severity: 'success'
          })
          // fetchAllUsers() // Refresh the user list
        } else {
          setSnackbar({
            open: true,
            message: res.message || 'Failed to add client',
            severity: 'error'
          })
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'An error occurred while adding client',
          severity: 'error'
        })
      } finally {
        handleCloseClientAdd()
      }
    },
    [formData, clientProductForms, clientSelectedProducts, handleCloseClientAdd]
  )

  // =============== EFFECTS ===============

  // Initial data loading
  useEffect(() => {
    fetchAllForm()
    fetchAllUserProduct()
    fetchProductLibrary()
    fetchEmployees()
  }, [ fetchAllUserProduct, fetchProductLibrary, fetchEmployees, fetchAllForm])

  // Initialize clientProductForms
  useEffect(() => {
    if (clientProductLibrary.length > 0 && openCLientAdd) {
      const initialProductForms = clientProductLibrary.map(product => ({
        userProductId: product._id,
        productName: product.productId.productName,
        charge: '',
        initFields: {
          isActive: true,
          fields: [{ fieldName: '', dataType: 'string' }]
        },
        submitFields: {
          isActive: true,
          fields: [{ fieldName: '', dataType: 'string' }]
        },
        agentFields: {
          isActive: true,
          fields: [{ fieldName: '', dataType: 'string' }]
        },
        allocationFields: {
          isActive: true,
          fields: [{ fieldName: '', dataType: 'string' }]
        }
      }))

      setClientProductForms(initialProductForms)

      // Initialize all products as unselected
      const initialSelectedState = {}

      clientProductLibrary.forEach(product => {
        initialSelectedState[product._id] = false
      })
      setClientSelectedProducts(initialSelectedState)
    }

  }, [clientProductLibrary, openCLientAdd])


  // Memoize product accordions for the client add form
  const clientProductAccordions = useMemo(() => {
    return clientProductForms.map(product => {
      // Memoize field sections for each product
      const fieldSections = (
        <>
          <FieldSection
            product={product}
            fieldType='initFields'
            title='Initial Fields'
            onSectionToggle={handleCLientSectionToggle}
            onFieldChange={handleClientFieldChange}
            onRemoveField={handleClientRemoveField}
            onAddField={handleClientAddField}
            formOptions={forms}
          />
          <FieldSection
            product={product}
            fieldType='submitFields'
            title='Submit Fields'
            onSectionToggle={handleCLientSectionToggle}
            onFieldChange={handleClientFieldChange}
            onRemoveField={handleClientRemoveField}
            onAddField={handleClientAddField}
            formOptions={forms}
          />
          <FieldSection
            product={product}
            fieldType='agentFields'
            title='Agent Fields'
            onSectionToggle={handleCLientSectionToggle}
            onFieldChange={handleClientFieldChange}
            onRemoveField={handleClientRemoveField}
            onAddField={handleClientAddField}
            formOptions={forms}
          />
          <FieldSection
            product={product}
            fieldType='allocationFields'
            title='Allocation Fields'
            onSectionToggle={handleCLientSectionToggle}
            onFieldChange={handleClientFieldChange}
            onRemoveField={handleClientRemoveField}
            onAddField={handleClientAddField}
            formOptions={forms}
          />
        </>
      )

      return (
        <ProductAccordion
          key={product.userProductId}
          product={product}
          selectedProducts={clientSelectedProducts}
          onProductSelection={handleClientProductSelection}
          onChargeChange={handleClientChargeChange}
          onCheckboxClick={handleClientCheckboxClick}
          fieldSections={fieldSections}
        />
      )
    })
  }, [
    clientProductForms,
    clientSelectedProducts,
    handleCLientSectionToggle,
    handleClientFieldChange,
    handleClientRemoveField,
    handleClientAddField,
    handleClientProductSelection,
    handleClientChargeChange,
    handleClientCheckboxClick,
    forms
  ])

  return (
    <>
      <Paper fullWidth sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 4 }}>
          <Typography variant='h5'>Client</Typography>
           <Box>
                   <Button
                              variant='outlined'
                              onClick={()=> router.push('/employeeSetup')}
                              sx={{ marginRight : '10px'}}
                            >
                             Back
                            </Button>
          <Button
            variant='contained'
            color='primary'
          //  onClick={handleOpenClientAdd}
            onClick={()=>router.push('/commandexe/partner/NewAddLender')}
            sx={{ marginLeft: 2 }}
            // disabled={session?.user?.userType === 'client'}
          >
            {/* {session?.user?.userType === 'client' ? 'client cant add' : 'Add Client'} */}
           { 'Add Client'}
          </Button>
        </Box>
        </Box>
        {/* <Paper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <DataTable
          rows={rows}
          columns={columns}
          page={0}
          rowsPerPage={10}
          totalItems={50}
          extraActions={row => (
            <>
              <Button
                variant='contained'
                color='success'
                onClick={() => handleOpen(row)}
                // disabled={session?.user?.userType === 'client'}
              >
                View
              </Button>
            </>
          )}
        />
        </Paper> */}
        <div style={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5,10,20]}
                    getRowId={(row) => row._id}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                slots={{
                  toolbar: CustomToolbar,
                  noRowsOverlay: () => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  height: '100%',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                  
                                }}
                              >
                                <Typography variant="body2">No Partner found</Typography>
                              </Box>
                            )
                }}
                disableRowSelectionOnClick
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#9180ff',
                    fontWeight: 'bold',
                  },
                }}
              />
            </div>
      </Paper>
      <Modal
      open={openCLientAdd}
      handleClose={handleCloseClientAdd}
      title='Add Client'
      maxWidth='md'
    >
      <Stepper activeStep={activeStep} orientation='vertical' sx={{ p: 2 }}>
        {/* Step 1: Client Details */}
        <Step>
          <StepLabel>Client Details</StepLabel>
          <StepContent>
            <Grid container spacing={4} padding='10px 12px'>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label='Full Name'
                  placeholder='Fullname...'
                  value={formData.fullName}
                  onChange={value => handleFormChange('fullName', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label='User Name'
                  placeholder='Username...'
                  value={formData.userName}
                  onChange={value => handleFormChange('userName', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label='Email'
                  type='email'
                  placeholder='john@example.com'
                  value={formData.email}
                  onChange={value => handleFormChange('email', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label='Password'
                  placeholder='**********'
                  value={formData.password}
                  onChange={value => handleFormChange('password', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label='Company Name'
                  placeholder='Company Name...'
                  value={formData.companyName}
                  onChange={value => handleFormChange('companyName', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label='Company Domain'
                  placeholder='example.com'
                  value={formData.domain}
                  onChange={value => handleFormChange('domain', value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label='Invoice Raise'
                  value={formData.invoiceRaise}
                  onChange={value => handleFormChange('invoiceRaise', value)}
                  select
                >
                  <MenuItem value='Manual'>Manual</MenuItem>
                  <MenuItem value='Automatic'>Automatic</MenuItem>
                </ThrottledTextField>
              </Grid>
              {formData.invoiceRaise === 'Automatic' && (
                <Grid item xs={12} sm={6}>
                  <ThrottledTextField
                    fullWidth
                    label='Invoice Cycle'
                    value={formData.invoiceCycle}
                    onChange={value => handleFormChange('invoiceCycle', value)}
                    select
                  >
                    <MenuItem value='15days'>15 Days</MenuItem>
                    <MenuItem value='monthly'>Monthly</MenuItem>
                    <MenuItem value='quaterly'>Quarterly</MenuItem>
                  </ThrottledTextField>
                </Grid>
              )}
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  select
                  label='Allocate'
                  value={formData.allocationId || []}
                  SelectProps={{
                    multiple: true,
                    renderValue: selected =>
                      Array.isArray(selected)
                        ? `${selected.length} employee${selected.length !== 1 ? 's' : ''} selected`
                        : '',
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 300
                        }
                      }
                    }
                  }}
                  onChange={e => {
                    if (e.target.value.includes('select-all-option')) {
                      if (formData.allocationId?.length === emp.length) {
                        handleFormChange('allocationId', [])
                      } else {
                        handleFormChange(
                          'allocationId',
                          emp.map(employee => employee._id)
                        )
                      }
                    } else {
                      handleFormChange('allocationId', e.target.value)
                    }
                  }}
                >
                  <MenuItem
                    value='select-all-option'
                    sx={{
                      bgcolor:
                        formData.allocationId?.length === emp.length ? 'primary.light' : 'inherit',
                      '&.Mui-selected': {
                        bgcolor: '#3B8AE5',
                        color: '#fff',
                        '&:hover': {
                          bgcolor: 'primary.main'
                        }
                      }
                    }}
                  >
                    <em>
                      {formData.allocationId?.length === emp.length ? 'Unselect All' : 'Select All'}
                    </em>
                  </MenuItem>
                  <Divider />
                  {emp.map(allocation => (
                    <MenuItem
                      key={allocation._id}
                      value={allocation._id}
                      sx={{
                        my: 1,
                        '&.Mui-selected': {
                          bgcolor: '#3B8AE5',
                          color: '#fff',
                          '&:hover': {
                            bgcolor: 'primary.main'
                          }
                        }
                      }}
                    >
                      {allocation.employeName}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Button variant='contained' onClick={handleNext}>
                Next
              </Button>
            </Box>
          </StepContent>
        </Step>

        {/* Step 2: Configure Products */}
        <Step>
          <StepLabel>Configure Products</StepLabel>
          <StepContent>
            <Box>
              <Typography variant='subtitle1' gutterBottom>
                Configure Products:
              </Typography>
              {clientProductAccordions}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button variant='contained' onClick={handleNext}>
                Add
              </Button>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
    </Modal>

      {/* Snackbar to show success/fail message */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} variant="filled" severity={snackbar.severity} sx={{ width: '100%', zIndex: '9999' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
