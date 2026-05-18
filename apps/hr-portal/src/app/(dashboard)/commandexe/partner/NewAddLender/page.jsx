"use client"
import { useEffect, useState, useCallback, useMemo, memo, useRef } from "react"

import { useRouter } from "next/navigation"

import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete,
  Stack,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  StepConnector,
  stepConnectorClasses,
  styled,
  Chip,
  FormControlLabel,
  Switch, // Add this import
} from "@mui/material"

import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CheckIcon from "@mui/icons-material/Check"
import EditIcon from "@mui/icons-material/EditOutlined"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import SettingsIcon from "@mui/icons-material/Settings"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import VideoLabelIcon from "@mui/icons-material/VideoLabel"
import PersonIcon from "@mui/icons-material/Person"

import {
  addAllDocAPI,
  deleteUserProductApi,
  getAllDocAPI,
  getAllEmployeeApi,
  getAllFormAPI,
  getAllServicesApi,
  getAllUserApi,
  getAllUserProductsAPI,
  getMyPartnersAPI,
  getPartnerProductsAPI,
  getUserFormProductApi,
  postClientDataApi,
  postUserAddProductApi,
  postUserProductEditApi,
  removeAllDocAPI,
  UpdatePartnerProductAPI,
  uploadImageApi,
} from "@/services/apiService"
import CustomTextField from "@/@core/components/mui/TextField"

// Custom styled components for enhanced stepper
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #3B82F6 0%, #2563EB 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #3B82F6 0%, #2563EB 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}))

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: "linear-gradient(136deg, #3B82F6 0%, #2563EB 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage: "linear-gradient(136deg, #3B82F6 0%, #2563EB 100%)",
  }),
}))

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props

  const icons = {
    1: <GroupAddIcon />,
    2: <VideoLabelIcon />,
    3: <CheckIcon />,
    4: <PersonIcon />,
    5: <SettingsIcon />,
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  )
}

const ThrottledTextField = memo(({ value, onChange, onChangeImmediate, delay = 300, ...props }) => {
  const [localValue, setLocalValue] = useState(value || "")
  const timeoutRef = useRef(null)

  // Update local value when prop value changes
  useEffect(() => {
    // Only update if the value is different to avoid loops
    if (value !== undefined && value !== localValue) {
      setLocalValue(value)
    }
  }, [value])

  const handleChange = (e) => {
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
  ({
    field,
    fieldIndex,
    productId,
    fieldType,
    onFieldChange,
    onRemoveField,
    formOptions = [],
    supportingDocs = [],
  }) => {
    // Track if a selection has been made and maintain it
    const [selectedField, setSelectedField] = useState(() => {
      if (field.fieldId) {
        return formOptions.find((option) => option._id === field.fieldId) || null
      } else if (field._id === "other") {
        return { _id: "other", fieldName: "Other (Custom Field)" }
      } else if (field.fieldName) {
        // Handle pre-loaded custom fields
        return { _id: "other", fieldName: "Other (Custom Field)" }
      }

      return null
    })

    // Generate stable id for component
    const fieldId = `${productId}-${fieldType}-${fieldIndex}`

    // Determine if custom fields should be shown
    const showCustomFields = selectedField && (selectedField._id === "other" || (!field.fieldId && field.fieldName))

    useEffect(() => {
      if (field.fieldId) {
        setSelectedField(formOptions.find((option) => option._id === field.fieldId) || null)
      } else if (field._id === "other") {
        setSelectedField({ _id: "other", fieldName: "Other (Custom Field)" })
      } else if (field.fieldName && !field.fieldId) {
        // This is for handling pre-loaded custom fields
        setSelectedField({ _id: "other", fieldName: "Other (Custom Field)" })

        // Ensure the field has _id="other" for consistency
        if (!field._id) {
          onFieldChange(productId, fieldType, fieldIndex, "_id", "other")
        }
      } else if (!field.fieldId && !field._id && !field.fieldName) {
        setSelectedField(null)
      }
    }, [field, formOptions, onFieldChange, productId, fieldType, fieldIndex])

    // Handle the autocomplete change
    const handleFormFieldChange = (event, newValue) => {
      // Set the local state immediately to prevent UI flickering
      setSelectedField(newValue)

      if (newValue && newValue._id === "other") {
        // Handle selecting "Other"
        onFieldChange(productId, fieldType, fieldIndex, "_id", "other")
        onFieldChange(productId, fieldType, fieldIndex, "fieldId", null)

        // Initialize or maintain custom field values
        if (!field.fieldName) {
          onFieldChange(productId, fieldType, fieldIndex, "fieldName", "")
        }

        if (!field.dataType) {
          onFieldChange(productId, fieldType, fieldIndex, "dataType", "string")
        }
      } else if (newValue) {
        // Handle selecting a predefined field
        onFieldChange(productId, fieldType, fieldIndex, "fieldId", newValue._id)
        onFieldChange(productId, fieldType, fieldIndex, "_id", null)

        // Clear custom field values
        onFieldChange(productId, fieldType, fieldIndex, "fieldName", null)
        onFieldChange(productId, fieldType, fieldIndex, "dataType", null)
      } else {
        // Handle clearing selection
        onFieldChange(productId, fieldType, fieldIndex, "fieldId", null)
        onFieldChange(productId, fieldType, fieldIndex, "_id", null)
        onFieldChange(productId, fieldType, fieldIndex, "fieldName", null)
        onFieldChange(productId, fieldType, fieldIndex, "dataType", null)
      }
    }

    // Create a deduplicated options array with unique keys for rendering
    const uniqueOptions = useMemo(() => {
      // Create a map to track seen options
      const seen = new Map()

      // Process form options
      const processed = formOptions.map((option) => {
        // Generate a unique key based on id and name
        const uniqueKey = `${option._id}-${option.fieldName}`

        // Mark this option as seen
        seen.set(uniqueKey, true)

        // Return option with unique key for rendering
        return {
          ...option,
          uniqueKey,
        }
      })

      // Add "Other" option
      const otherOption = { _id: "other", fieldName: "Other (Custom Field)", uniqueKey: "other-custom" }

      return [...processed, otherOption]
    }, [formOptions])

    return (
      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <Autocomplete
            fullWidth
            id={`form-field-select-${fieldId}`}
            options={uniqueOptions}
            getOptionLabel={(option) => option?.fieldName || ""}
            value={selectedField}
            onChange={handleFormFieldChange}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Select Verification Field"
                required
                error={!selectedField}
                helperText={!selectedField ? "Please select a field" : ""}
              />
            )}
            isOptionEqualToValue={(option, value) => {
              if (!option || !value) return false

              return option._id === value._id
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.uniqueKey}>
                {option.fieldName} {option.dataType && option._id !== "other" ? `(${option.dataType})` : ""}
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
                label="Custom Field Name"
                value={field.fieldName || ""}
                onChange={(value) => onFieldChange(productId, fieldType, fieldIndex, "fieldName", value)}
                fullWidth
                required
                error={!field.fieldName}
                helperText={!field.fieldName ? "Field name is required" : ""}
              />
              <FormControl fullWidth required>
                <ThrottledTextField
                  value={field.dataType || "string"}
                  onChange={(value) => onFieldChange(productId, fieldType, fieldIndex, "dataType", value)}
                  label="Data Type"
                  select
                  fullWidth
                >
                  <MenuItem value="string">String</MenuItem>
                  <MenuItem value="file">File</MenuItem>
                  <MenuItem value="textarea">Textarea</MenuItem>
                  <MenuItem value="multiUpload">MultiUpload</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                </ThrottledTextField>
              </FormControl>
            </>
          )}

           {/* Add supporting document dropdown for each field */}
        <FormControl fullWidth sx={{ mt: 1 }}>
          <ThrottledTextField
            value={field.supportingDoc || ""}
            onChange={(value) => onFieldChange(productId, fieldType, fieldIndex, "supportingDoc", value)}
            label="Required Supporting Document"
            select
            fullWidth
            size="small"
          >
            <MenuItem value="">None</MenuItem>
            {supportingDocs[productId]?.map((doc) => (
              <MenuItem key={doc._id} value={doc.documentName}>
                {doc.documentName}
              </MenuItem>
            ))}
          </ThrottledTextField>
        </FormControl>

         <FormControl fullWidth sx={{ mt: 1 }}>
            {/* Add isRequired toggle for each field */}
            <FormControlLabel
              control={
                <Switch
                  checked={field.isRequired || false}
                  onChange={(e) => onFieldChange(productId, fieldType, fieldIndex, "isRequired", e.target.checked)}
                />
              }
              label={field.isRequired ? "Required" : "Optional"}
              sx={{ mt: 1 }}
            />
          </FormControl>

        <IconButton
            color="error"
            onClick={() => onRemoveField(productId, fieldType, fieldIndex)}
            size="small"
            aria-label="Remove field"
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Stack>
      </Stack>
    )
  },
)

const FieldSection = memo(
  ({ product, fieldType, title, onFieldChange, onRemoveField, onAddField, formOptions = [], supportingDocs = {} }) => {
    const productId = product.userProductId
    const hasFields = product[fieldType]?.fields && product[fieldType].fields.length > 0
    if (!product[fieldType]) {
      return null
    }
    const handleAddField = () => {
      // Create a new empty field
      const newField = { fieldName: "", dataType: "string" }
      onAddField(productId, fieldType, newField)
    }

    return (
      <Card variant="outlined" sx={{ mb: 3, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            {title}
          </Typography>

          {hasFields ? (
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
                supportingDocs={supportingDocs}
              />
            ))
          ) : (
            <Typography color="textSecondary" variant="body2" sx={{ mb: 2 }}>
              No fields added yet. Click Add Field to begin.
            </Typography>
          )}

          {fieldType === "submitFields" && (
            <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddField}
                color="primary"
                size="small"
                variant="outlined"
              >
                Add Fields
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    )
  },
)

const ProductTabs = ({
  products,
  forms,
  fieldSections,
  handleChargeChange,
  handleUpdateField,
  handleRemoveField,
  handleAddField,
  // Add these new props
  supportingDocs,
  docInputs,
  handleDocInputChange,
  handleAddDoc,
  handleDeleteDoc,
  requestId,
  loading,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }
  return (
    <Box sx={{ width: "100%" }}>
      {/* <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 500,
              textTransform: "none",
              minHeight: 48,
            },
            "& .Mui-selected": {
              color: "primary.main",
              fontWeight: 600,
            },
          }}
        >
          {products.map((product, index) => (
            <Tab key={product.userProductId} label={product.productName} />
          ))}
        </Tabs>
      </Box> */}

      <Box 
            sx={{ 
              borderBottom: 'none',
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.25)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{
                style: {
                  display: 'none', // Hide default indicator
                },
              }}
              sx={{
                minHeight: 60,
                '& .MuiTabs-flexContainer': {
                  gap: '8px',
                  padding: '8px',
                },
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '14px',
                  minHeight: 44,
                  borderRadius: '8px',
                  padding: '12px 20px',
                  margin: 0,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.9)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                },
                '& .Mui-selected': {
                  color: '#ffffff !important',
                  fontWeight: 600,
                  background: 'rgba(255, 255, 255, 0.25) !important',
                  border: '1px solid rgba(255, 255, 255, 0.3) !important',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-1px)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '24px',
                    height: '2px',
                    background: '#ffffff',
                    borderRadius: '2px',
                  },
                },
                '& .MuiTabs-scrollButtons': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                },
              }}
            >
              {products.map((product, index) => (
                <Tab 
                  key={product.userProductId} 
                  label={product.productName}
                  sx={{
                    '&.MuiTab-root': {
                      minWidth: 'auto',
                      whiteSpace: 'nowrap',
                    }
                  }}
                />
              ))}
            </Tabs>
            
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          </Box>

      {products.map((product, index) => (
        <Box key={product.userProductId} role="tabpanel" hidden={selectedTab !== index} sx={{ mt: 2 }}>
          {selectedTab === index && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  {product.productName}
                </Typography>
                <TextField
                  label="Charge (₹)"
                  type="text"
                  value={product.charge}
                  onChange={(e) => {
                    const value = e.target.value
                    const sanitized = value.replace(/^0+(?=\d)/, "").replace(/[^0-9]/g, "")
                    handleChargeChange(product.userProductId, sanitized)
                  }}
                  size="small"
                  sx={{ width: "150px" }}
                />
              </Box>

              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  Supporting Documents
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <CustomTextField
                    // label="Supporting DOCS"
                    value={docInputs[product.userProductId] || ""}
                    onChange={(e) => handleDocInputChange(product.userProductId, e.target.value)}
                    fullWidth
                    placeholder="Enter document name"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddDoc(product.userProductId)}
                    disabled={loading}
                    sx={{ minWidth: "100px" }}
                  >
                    {loading ? <CircularProgress size={20} /> : "Add"}
                  </Button>
                </Box>

                {/* Display existing documents as chips */}
                {supportingDocs[product.userProductId] && supportingDocs[product.userProductId].length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {supportingDocs[product.userProductId].map((doc) => (
                      <Chip
                        key={doc._id}
                        label={doc.documentName}
                        onDelete={() => handleDeleteDoc(doc._id, product.userProductId)}
                        color="primary"
                        variant="outlined"
                        sx={{
                          "& .MuiChip-deleteIcon": {
                            color: "error.main",
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 3 }}>
                {fieldSections.map(
                  (section) =>
                    product[section.id] && (
                      <FieldSection
                        key={`${product.userProductId}-section-${section.id}`}
                        product={product}
                        fieldType={section.id}
                        title={section.label}
                        onFieldChange={handleUpdateField}
                        onRemoveField={handleRemoveField}
                        onAddField={handleAddField}
                        formOptions={forms}
                        supportingDocs={supportingDocs}
                      />
                    ),
                )}
              </Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

// Main component
export default function NewPartner() {
  // Add these state variables near the other state declarations

  const [snackbar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Supporting documents state
  const [supportingDocs, setSupportingDocs] = useState({}) // Store docs for each product
  const [docInputs, setDocInputs] = useState({}) // Store input values for each product

  const [emp, setEmp] = useState([])
  const [clientProductLibrary, setClientProductLibrary] = useState([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Form validation states
  const [formErrors, setFormErrors] = useState({
    fullName: false,
    userName: false,
    email: false,
    password: false,
    companyName: false,
    phone: false,
  })

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    companyName: "",
    domain: "",
    invoiceRaise: "",
    invoiceCycle: "",
    invoiceStartDate: "",
    invoiceEndDate: "",
    allocationId: [],
    phone: "",
    cinNumber: "",
    gstin: "",
    corporateAddress: "",
    registeredAddress: "",
    companyLogo: null,
    enach: "physical",
    reportingCommunication: {
      reportingCommunicationTo: "",
      reportingCommunicationCC: [],
    },
    invoiceCommunication: {
      invoiceCommunicationTo: "",
      invoiceCommunicationCC: [],
    },
    physicalReportCommunication: {
      physicalReportCommunicationTo: "",
      physicalReportCommunicationCC: [],
    },
  })

  const [employees, setEmployees] = useState([])

  const [ProductFormData, setProductFormData] = useState({
    productName: "",
    isActive: false,
    status: "approved",
    moduleId: "",
  })

  // Product form validation
  const [productFormErrors, setProductFormErrors] = useState({
    productName: false,
    moduleId: false,
  })

  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openCLientAdd, setOpenCLientAdd] = useState(false)
  const [userProducts, setUserProducts] = useState([])
  const [productForms, setProductForms] = useState([])
  const [allocationId, setAllocationId] = useState([])
  const [clientProductForms, setClientProductForms] = useState({})
  const [selectedProducts, setSelectedProducts] = useState({})
  const [clientSelectedProducts, setClientSelectedProducts] = useState({})
  const [forms, setForms] = useState([])

  const [openProductAdd, setOpenProductAdd] = useState(false)

  const handleCloseSnackbar = useCallback(() => {
    setSnackBar((prev) => ({ ...prev, open: false }))
  }, [])

  const fetchProductLibrary = useCallback(async (id) => {
    try {
      setLoading(true)
      const response = await getPartnerProductsAPI(id)

      if (response && response.items) {
        setClientProductLibrary(response.items)
      }
    } catch (error) {
      console.error("Error fetching product library:", error)
      setSnackBar({
        open: true,
        message: "Failed to fetch product library: " + (error.message || "Unknown error"),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllEmployeeApi()

      if (response?.items) {
        setEmp(response.items.employees)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      setSnackBar({
        open: true,
        message: "Failed to fetch employees: " + (error.message || "Unknown error"),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0]

    if (file) {
      try {
        const response = await uploadImageApi(file)
        console.log("image res--", response)

        setFormData((prev) => ({
          ...prev,
          [fieldName]: response?.items?.fileUrl || "",
        }))
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
  }

  // const fetchAllUsers = useCallback(async () => {
  //   try {
  //     setLoading(true)
  //     const response = await getAllUserApi()

  //     if (!response?.items) {
  //       throw new Error("Invalid response format")
  //     }
  //   } catch (error) {
  //     console.log("error", error)
  //     setSnackBar({
  //       open: true,
  //       message: "Failed to fetch users: " + (error.message || "Unknown error"),
  //       severity: "error",
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [])

  const fetchAllPartners = useCallback(async () => {
    // const userId = session?.user?.id

    // if (!userId) return

    try {
      setLoading(true)
      const res = await getMyPartnersAPI()

      if (res && res.items) {
        setRows(
          res.items.map((item) => ({
            _id: item?._id,
            partnerName: item?.partner?.fullName,
            partnerId: item?.partnerId,
            userName: item?.partner?.userName,
            email: item?.partner?.email,
            productForm: item.productForm,
            allocationId: item.allocationId,
            communicationTo: item.communicationTo,
            communicationCC: item.communicationCC,
            enach: item.enach,
            phone: item.phone,
            cinNumber: item.cinNumber,
            gstin: item.gstin,
            corporateAddress: item.corporateAddress,
            companyLogo: item.companyLogo,
            registeredAddress: item.registeredAddress,
            createdAt: item?.createdAt ? new Date(item.createdAt).toISOString().split("T")[0] : "",
            edit: false,
            delete: false,
            view: false,
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching partners:", error)
      setSnackBar({
        open: true,
        message: "Error fetching partners: " + (error.message || "Unknown error"),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const [requestId, setRequestId] = useState("")

  // Validate client form data
  const validateClientForm = () => {
    const errors = {
      fullName: !formData.fullName,
      userName: !formData.userName,
      email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      password: !formData.password,
      companyName: !formData.companyName,
      phone: !formData.phone || !/^\d{10}$/.test(formData.phone),
    }

    setFormErrors(errors)

    return !Object.values(errors).some((error) => error)
  }

  const handleSaveStep = async () => {
    try {
      setLoading(true)

      // Validate form before submitting
      if (!validateClientForm()) {
        setSnackBar({
          open: true,
          message: "Please fill all required fields correctly",
          severity: "error",
        })
        setLoading(false)
        return false
      }

      const payload = {
        employeName: formData.fullName,
        mobileNo: formData.phone,
        ...formData,
      }

      const res = await postClientDataApi(payload)
      console.log("client add response--", res)

      if (res.status) {
        setRequestId(res.items._id)
        fetchProductLibrary(res.items._id)
        setSnackBar({
          open: true,
          message: "Client data saved successfully!",
          severity: "success",
        })
        return true
      } else {
        setSnackBar({
          open: true,
          message: res.message || "Failed to save client data",
          severity: "error",
        })
        return false
      }
    } catch (err) {
      console.error("Failed to save client data:", err)
      setSnackBar({
        open: true,
        message: "Failed to save client data: " + (err.message || "Unknown error"),
        severity: "error",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const [allUserProduct, setAllUserProduct] = useState([])
  const [updateId, setUpdateId] = useState(null)

  // Fix the getUserProducts function to properly handle the response structure
  const getUserProducts = async () => {
    try {
      setLoading(true)
      const res = await getUserFormProductApi(requestId)

      if (res.status && res.items && res.items.productForm) {
        // Set all user products from the productForm array
        setAllUserProduct(res.items.productForm)
        console.log("AllUserProduct", res.items)
        console.log("update ID", res.items._id)

        setUpdateId(res.items._id)

        // Create a map of selected products
        const selectedMap = {}
        res.items.productForm.forEach((product) => {
          selectedMap[product.userProductId] = true
        })

        setClientSelectedProducts(selectedMap)

        // Set product forms for configuration
        setProductForms(res.items.productForm)
      } else {
        console.warn("Invalid response format or empty product form:", res.items)
        // Don't show warning if it's just empty
        if (res.items && !res.items.productForm) {
          setSnackBar({
            open: true,
            message: "No products found. Please add products in the next step.",
            severity: "info",
          })
        }
      }
    } catch (err) {
      console.error("Failed to fetch products:", err)
      setSnackBar({
        open: true,
        message: "Failed to fetch products: " + (err.message || "Unknown error"),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (requestId) {
      getUserProducts()
    }
  }, [requestId])

  const handleRemoveProduct = async (product) => {
    console.log("delete product", product)

    try {
      setLoading(true)
      const payload = {
        productId: product._id,
      }

      const res = await deleteUserProductApi(payload)
      console.log("delete res", res)

      if (res.status) {
        setSnackBar({
          open: true,
          message: "Product removed successfully!",
          severity: "success",
        })
        getUserProducts() // refresh the list after deletion
        fetchProductLibrary(requestId)
      } else {
        setSnackBar({
          open: true,
          message: res.message || "Failed to remove product",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      setSnackBar({
        open: true,
        message: "Error removing product: " + (error.message || "Unknown error"),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const [editingProductId, setEditingProductId] = useState(null)
  const [editedName, setEditedName] = useState("")

  // Replace the existing handleSaveEdit function with this improved version
  const handleSaveEdit = async () => {
    try {
      if (!editingProduct || !editedName.trim()) {
        setSnackBar({
          open: true,
          message: "Product name cannot be empty",
          severity: "error",
        })
        return
      }

      const payload = {
        prId: editingProduct._id,
        productName: editedName,
      }

      setLoading(true)
      const res = await postUserProductEditApi(payload)

      if (res.status) {
        setSnackBar({
          open: true,
          message: "Product name updated successfully!",
          severity: "success",
        })
        getUserProducts() // Refresh list
        fetchProductLibrary(requestId)
      } else {
        setSnackBar({
          open: true,
          message: res.message || "Failed to update product name",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Error updating product:", error)
      setSnackBar({
        open: true,
        message: "Error updating product: " + (error.message || "Unknown error"),
        severity: "error",
      })
    } finally {
      setLoading(false)
      setEditDialogOpen(false)
      setEditingProduct(null)
      setEditedName("")
    }
  }

  const [modules, setModules] = useState([])
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true)
        const res = await getAllServicesApi()
        setModules(res?.items || [])
      } catch (err) {
        console.error("Failed to fetch modules:", err)
        setSnackBar({
          open: true,
          message: "Failed to fetch modules: " + (err.message || "Unknown error"),
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  // Validate product form
  const validateProductForm = () => {
    const errors = {
      productName: !ProductFormData.productName,
      moduleId: !ProductFormData.moduleId,
    }

    setProductFormErrors(errors)

    return !Object.values(errors).some((error) => error)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validate form before submitting
    if (!validateProductForm()) {
      setSnackBar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      })
      return
    }

    // const userId = session?.user?.id
    const dataToSend = {
      productName: ProductFormData?.productName,
      referId: ProductFormData.moduleId,
      requestId: requestId,
    }

    try {
      setLoading(true)
      const response = await postUserAddProductApi(dataToSend)

      if (response.status) {
        setSnackBar({
          open: true,
          message: "Product added successfully!",
          severity: "success",
        })

        // Reset form
        setClientSelectedProducts((prev) => ({
          ...prev,
          [response.items._id]: true,
        }))
        setProductFormData({
          productName: "",
          isActive: false,
          status: "pending",
          moduleId: "",
        })
        setProductFormErrors({
          productName: false,
          moduleId: false,
        })
        setOpenProductAdd(false)
        getUserProducts()
        fetchProductLibrary(requestId)
      } else {
        setSnackBar({
          open: true,
          message: response.message || "Failed to add product",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Failed to add product:", error.message)
      setSnackBar({
        open: true,
        message: error.message || "Something went wrong",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPartners()
  }, [])

  const fetchAllUserProduct = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllUserProductsAPI()
      setUserProducts(response.items || [])
    } catch (error) {
      console.log("error", error)
      setSnackBar({
        open: true,
        message: "Failed to fetch user products: " + (error.message || "Unknown error"),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAllForm = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllFormAPI()
      setForms(response.items || [])
    } catch (error) {
      console.log("Error fetching forms:", error)
      setSnackBar({
        open: true,
        message: "Error fetching forms: " + (error.message || "Unknown error"),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // =============== MODAL HANDLERS ===============
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = async () => {
    if (activeStep === 1) {
      const success = await handleSaveStep()
      if (!success) return
    }

    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleCloseClientAdd = useCallback(() => {
    setOpenCLientAdd(false)
    setClientProductForms([])
    setClientSelectedProducts({})
    setFormData({
      fullName: "",
      userName: "",
      email: "",
      password: "",
      companyName: "",
      communicationTo: "",
      communicationCC: "",
      enach: "",
      phone: "",
      cinNumber: "",
      gstin: "",
      corporateAddress: "",
      companyLogo: "",
      registeredAddress: "",
      domain: "",
      allocationId: [],
    })
  }, [])

  const handleChargeChange = useCallback((productId, value) => {
    setProductForms((prev) =>
      prev.map((product) => (product.userProductId === productId ? { ...product, charge: Number(value) } : product)),
    )
  }, [])

  // Handle add field - FIXED: Now properly adds a new field
  const handleAddField = useCallback((productId, section, newField) => {
    setProductForms((prev) =>
      prev.map((product) => {
        if (product.userProductId === productId && product[section]) {
          // Create a new field with proper structure
          let fieldToAdd = {}

          // If newField has a fieldId, it's a predefined field
          if (newField.fieldId || (newField._id && newField._id !== "other")) {
            fieldToAdd = { fieldId: newField.fieldId || newField._id }
          }
          // If it's a custom field (either from "Other" selection or empty field)
          else {
            fieldToAdd = {
              _id: "other",
              fieldName: newField.fieldName || "",
              dataType: newField.dataType || "string",
            }
          }

          return {
            ...product,
            [section]: {
              ...product[section],
              fields: [...(product[section].fields || []), fieldToAdd],
            },
          }
        }
        return product
      }),
    )
  }, [])

  // Handle add custom field
  const handleAddCustomField = useCallback((productId, section, fieldName, dataType) => {
    if (!fieldName) return

    setProductForms((prev) =>
      prev.map((product) => {
        if (product.userProductId === productId && product[section]) {
          const updatedFields = [...(product[section]?.fields || [])]
          updatedFields.push({
            _id: "other", // Mark as custom field
            fieldName: fieldName,
            dataType: dataType || "string",
          })

          return {
            ...product,
            [section]: {
              ...product[section],
              fields: updatedFields,
            },
          }
        }
        return product
      }),
    )
  }, [])

  // Handle remove field
  const handleRemoveField = useCallback((productId, section, index) => {
    setProductForms((prev) =>
      prev.map((product) => {
        if (product.userProductId === productId && product[section]) {
          const updatedFields = [...(product[section]?.fields || [])]
          updatedFields.splice(index, 1)

          return {
            ...product,
            [section]: {
              ...product[section],
              fields: updatedFields,
            },
          }
        }
        return product
      }),
    )
  }, [])

  // Handle update field
  const handleUpdateField = useCallback((productId, section, index, key, value) => {
    setProductForms((prev) =>
      prev.map((product) => {
        if (product.userProductId === productId && product[section]) {
          // Create a new array with the existing fields or an empty array
          const updatedFields = [...(product[section]?.fields || [])]

          // Ensure the field exists at the specified index
          while (updatedFields.length <= index) {
            updatedFields.push({})
          }

          // Create a new field object with the updated value
          updatedFields[index] = {
            ...updatedFields[index],
            [key]: value,
          }

          return {
            ...product,
            [section]: {
              ...product[section],
              fields: updatedFields,
            },
          }
        }
        return product
      }),
    )
  }, [])

  useEffect(() => {
    fetchAllForm()
    fetchAllUserProduct()
    fetchEmployees()
  }, [fetchAllUserProduct, fetchEmployees, fetchAllForm])

  // Initialize clientProductForms
  useEffect(() => {
    if (allUserProduct?.length > 0) {
      const initialProductForms = allUserProduct.map((product) => ({
        userProductId: product?._id,
        productName: product?.productName,
        charge: "",
        initFields: {
          isActive: true,
          fields: [{ fieldName: "", dataType: "string" }],
        },
        submitFields: {
          isActive: true,
          fields: [{ fieldName: "", dataType: "string" }],
        },
        agentFields: {
          isActive: true,
          fields: [{ fieldName: "", dataType: "string" }],
        },
        allocationFields: {
          isActive: true,
          fields: [{ fieldName: "", dataType: "string" }],
        },
      }))

      setClientProductForms(initialProductForms)

      // Initialize all products as unselected
      const initialSelectedState = {}

      allUserProduct?.forEach((product) => {
        initialSelectedState[product._id] = true
      })
      setClientSelectedProducts(initialSelectedState)
    }
  }, [allUserProduct])

  const handleFormChange = (key, value) => {
    console.log("name,value", key, value)
    setFormData((prev) => ({ ...prev, [key]: value }))

    // Clear error for this field if it exists
    if (formErrors[key]) {
      setFormErrors((prev) => ({ ...prev, [key]: false }))
    }
  }
  console.log("for", formData)

  const handleCommunicationChange = (communicationType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [communicationType]: {
        ...prev[communicationType],
        [field]:
          field.includes("CC") && typeof value === "string"
            ? value
                .split(",")
                .map((email) => email.trim())
                .filter((email) => email)
            : value,
      },
    }))
  }

  const [partner, setPartner] = useState([])
  const [rows, setRows] = useState([])

  const steps = [
    "Client Details",
    "Communication Detail",
    "Select Report Type",
    "Employee Allocation",
    "Configure Report Forms",
  ]

  const fieldSections = [
    // { id: "initFields", label: "Initial Fields" },
    { id: "allocationFields", label: "Allocation Fields" },
    { id: "agentFields", label: "Agent Fields" },
    { id: "submitFields", label: "Submit Fields" },
  ]

  // Validate product forms
  const validateProductForms = () => {
    let isValid = true
    let errorMessage = ""

    productForms.forEach((product) => {
      if (!product.charge && product.charge !== 0) {
        errorMessage = `Please enter charge for ${product.productName}`
        isValid = false
      }
      // Validate fields for each field type
      ;["submitFields", "agentFields", "allocationFields"].forEach((fieldType) => {
        if (product[fieldType] && product[fieldType].fields) {
          product[fieldType].fields.forEach((field, index) => {
            if (!field.fieldId && field._id === "other") {
              if (!field.fieldName) {
                errorMessage = `Please enter field name for custom field in ${fieldType} of ${product.productName}`
                isValid = false
              }
            }
          })
        }
      })
    })

    if (!isValid) {
      setSnackBar({
        open: true,
        message: errorMessage,
        severity: "error",
      })
    }

    return isValid
  }

  // Add the missing handleUpdateProducts function
  const handleUpdateProducts = async () => {
    try {
      setLoading(true)
      // Format the product forms to ensure proper structure for API
      const formattedProductForms = productForms.map((product) => {
        // Create a new product object with the same basic properties
        const formattedProduct = {
          userProductId: product.userProductId,
          productName: product.productName,
          charge: Number(product.charge || 0),
        }

        // Only include field sections that actually exist in the product
        Object.keys(product).forEach((key) => {
          // Check if this is a field section (initFields, submitFields, etc.)
          if (
            ["allocationFields", "agentFields", "submitFields"].includes(key) &&
            product[key] &&
            typeof product[key] === "object"
          ) {
            // Create the section with its fields
            formattedProduct[key] = {
              isActive: product[key].isActive !== false, // Default to true if not specified
              fields: (product[key].fields || []).map((field) => {
                // Create base field object that will include supportingDoc if present
                const baseField = {}

                // Add supportingDoc if it exists
                if (field.supportingDoc) {
                  baseField.supportingDoc = field.supportingDoc
                }
                // Add isRequired field
                baseField.isRequired = field.isRequired || false

                // For custom fields (with _id="other" or with fieldName but no fieldId)
                if ((field._id === "other" || (!field.fieldId && field.fieldName)) && field.fieldName) {
                  return {
                    ...baseField,
                    fieldName: field.fieldName,
                    dataType: field.dataType || "string",
                  }
                }
                // For predefined fields (with fieldId)
                else if (field.fieldId) {
                  return {
                    ...baseField,
                    fieldId: field.fieldId,
                  }
                }
                // Return the field as is if it doesn't match either case
                return { ...baseField, ...field }
              }),
            }
          }
        })

        return formattedProduct
      })

      // Send all products data with properly formatted fields
      const payload = {
        id: requestId,
        productForm: formattedProductForms,
        allocationId: allocationId,
      }
      console.log("Updating products with payload:", payload)

      // Simulate API response for now
      const response = await UpdatePartnerProductAPI(payload)
      console.log("UpdatePartnerProductAPI", response)

      if (response.status) {
        setSnackBar({
          open: true,
          message: "Product configurations saved successfully!",
          severity: "success",
        })

        // Refresh products
        getUserProducts()
      } else {
        setSnackBar({
          open: true,
          message: "Failed to save product configurations",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Error updating products:", error)
      setSnackBar({
        open: true,
        message: "Error updating products: " + (error.message || "Unknown error"),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function to check if a step is completed
  const isStepCompleted = (step) => {
    switch (step) {
      case 0: // Client Details
        return formData.fullName && formData.userName && formData.email && formData.password && formData.companyName
      case 1: // Communication Detail
        return formData.reportingCommunication.communicationTo && formData.invoiceCommunication.communicationTo
      case 2: // Signature Mode
        return clientProductLibrary && clientProductLibrary.length > 0
      case 3: // Select Report Type
        return allocationId.length > 0
      // case 4: // Select Report Type
      //   return clientProductLibrary && clientProductLibrary.length > 0
      default:
        return false
    }
  }

  // Document management functions
  const handleDocInputChange = useCallback((productId, value) => {
    setDocInputs((prev) => ({
      ...prev,
      [productId]: value,
    }))
  }, [])

  const handleAddDoc = useCallback(
    async (productId) => {
      const docName = docInputs[productId]
      if (!docName || !docName.trim()) {
        setSnackBar({
          open: true,
          message: "Please enter a document name",
          severity: "warning",
        })
        return
      }

      try {
        setIsLoading(true)
        const payload = {
          requestId: requestId,
          reportId: productId,
          documentName: docName.trim(),
        }

        const response = await addAllDocAPI(payload)

        if (response.status) {
          setSnackBar({
            open: true,
            message: "Document added successfully!",
            severity: "success",
          })

          // Clear the input
          setDocInputs((prev) => ({
            ...prev,
            [productId]: "",
          }))

          // Fetch updated documents
          fetchDocuments(productId)
        } else {
          setSnackBar({
            open: true,
            message: response.message || "Failed to add document",
            severity: "error",
          })
        }
      } catch (error) {
        console.error("Error adding document:", error)
        setSnackBar({
          open: true,
          message: "Error adding document: " + (error.message || "Unknown error"),
          severity: "error",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [docInputs, requestId],
  )

  const fetchDocuments = useCallback(async (productId) => {
    try {
      const response = await getAllDocAPI(productId)
      if (response.status && response.items) {
        setSupportingDocs((prev) => ({
          ...prev,
          [productId]: response.items,
        }))
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    }
  }, [])

  const handleDeleteDoc = useCallback(async (docId, productId) => {
    try {
      setLoading(true)
      const response = await removeAllDocAPI(docId)

      if (response.status) {
        setSnackBar({
          open: true,
          message: "Document deleted successfully!",
          severity: "success",
        })

        // Fetch updated documents
        fetchDocuments(productId)
      } else {
        setSnackBar({
          open: true,
          message: response.message || "Failed to delete document",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      setSnackBar({
        open: true,
        message: "Error deleting document: " + (error.message || "Unknown error"),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (productForms.length > 0) {
      productForms.forEach((product) => {
        fetchDocuments(product.userProductId)
      })
    }
  }, [productForms, fetchDocuments])

  return (
    <>
      <Paper sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 2 }}>
        <Box sx={{ width: "100%" }}>
          {/* Enhanced Stepper with custom styling */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<ColorlibConnector />}
            sx={{
              mb: 4,
              p: 5,
              "& .MuiStepLabel-label": {
                mt: 1,
                fontWeight: 500,
              },
              "& .MuiStepLabel-completed": {
                color: "success.main",
              },
            }}
          >
            {steps.map((label, index) => (
              <Step
                key={label}
                completed={activeStep > index || isStepCompleted(index)}
                onClick={() => setActiveStep(index)}
                sx={{
                  cursor: "pointer", // Make the step look clickable
                  "& .MuiStepLabel-root": {
                    pointerEvents: "auto", // Ensure clicks go through
                  },
                }}
              >
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Loading overlay */}
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 1000,
              }}
            >
              <CircularProgress size={60} />
            </Box>
          )}

          {/* Step Content Rendering */}
          {activeStep === 0 && (
            <Grid container spacing={4} padding={7}>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}>
                  Client Information
                </Typography>
                <Divider sx={{ mb: 4 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Company Logo
                </Typography>

                {formData.companyLogo ? (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      component="img"
                      src={formData.companyLogo}
                      alt="Company Logo"
                      sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1, border: "1px solid #ccc" }}
                    />
                    <IconButton
                      onClick={() => handleFormChange("companyLogo", "")}
                      color="error"
                      aria-label="Remove Logo"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ width: "180px", border: "1px solid #2F2B3B38", color: "#848484" }}
                  >
                    Upload Logo
                    <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, "companyLogo")} />
                  </Button>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="Full Name"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(value) => handleFormChange("fullName", value)}
                  required
                  error={formErrors.fullName}
                  helperText={formErrors.fullName ? "Full name is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="User Name"
                  placeholder="Enter username"
                  value={formData.userName}
                  onChange={(value) => handleFormChange("userName", value)}
                  required
                  error={formErrors.userName}
                  helperText={formErrors.userName ? "Username is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(value) => handleFormChange("email", value)}
                  required
                  error={formErrors.email}
                  helperText={formErrors.email ? "Valid email is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder="**********"
                  value={formData.password}
                  onChange={(value) => handleFormChange("password", value)}
                  required
                  error={formErrors.password}
                  helperText={formErrors.password ? "Password must be at least 6 characters" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" sx={{ mt: 2, mb: 3, fontWeight: 600, color: "primary.main" }}>
                  Company Information
                </Typography>
                <Divider sx={{ mb: 4 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="Company Name"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(value) => handleFormChange("companyName", value)}
                  required
                  error={formErrors.companyName}
                  helperText={formErrors.companyName ? "Company name is required" : ""}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="Corporate Address"
                  placeholder="Enter corporate address"
                  value={formData.corporateAddress}
                  onChange={(value) => handleFormChange("corporateAddress", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="Registered Address"
                  placeholder="Enter registered address"
                  value={formData.registeredAddress}
                  onChange={(value) => handleFormChange("registeredAddress", value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="GSTIN"
                  placeholder="Enter GSTIN"
                  value={formData.gstin}
                  onChange={(value) => handleFormChange("gstin", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="CIN Number"
                  placeholder="Enter CIN number"
                  value={formData.cinNumber}
                  onChange={(value) => handleFormChange("cinNumber", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  type="number"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(value) => handleFormChange("phone", value)}
                  required
                  error={formErrors.phone}
                  helperText={formErrors.phone ? "Valid 10-digit phone number is required" : ""}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="Invoice Raise"
                  value={formData.invoiceRaise}
                  onChange={(value) => handleFormChange("invoiceRaise", value)}
                  select
                >
                  <MenuItem value="Manual">Manual</MenuItem>
                  <MenuItem value="Automatic">Automatic</MenuItem>
                </ThrottledTextField>
              </Grid>

              {formData?.invoiceRaise === "Automatic" && (
                <Grid item xs={12} sm={6}>
                  <ThrottledTextField
                    fullWidth
                    label="Invoice Cycle"
                    value={formData.invoiceCycle}
                    onChange={(value) => handleFormChange("invoiceCycle", value)}
                    select
                  >
                    <MenuItem value="15days">15 Days</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quaterly">Quarterly</MenuItem>
                  </ThrottledTextField>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  id="invoiceStartDate"
                  name="invoiceStartDate"
                  label="Invoice Start Date"
                  value={formData.invoiceStartDate}
                  onChange={(value) => handleFormChange("invoiceStartDate", value)}
                  variant="outlined"
                  type="date"
                ></ThrottledTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  id="invoiceEndDate"
                  name="invoiceEndDate"
                  label="Invoice End Date"
                  value={formData.invoiceEndDate}
                  onChange={(value) => handleFormChange("invoiceEndDate", value)}
                  variant="outlined"
                  type="date"
                ></ThrottledTextField>
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button onClick={()=>router.push("/commandexe/partner")} sx={{ mr: 2 }} disabled={loading}>
                  Back To List
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{
                    minWidth: "120px",
                    py: 1,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Next"}
                </Button>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={4} padding={7}>
              {/* Reporting Communication */}
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
                  Reporting Communication
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="TO"
                  placeholder="Enter email address"
                  value={formData?.reportingCommunication?.reportingCommunicationTo}
                  onChange={(value) =>
                    handleCommunicationChange("reportingCommunication", "reportingCommunicationTo", value)
                  }
                  required
                  error={!formData?.reportingCommunication?.reportingCommunicationTo}
                  helperText={
                    !formData?.reportingCommunication?.reportingCommunicationTo ? "Primary email is required" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="CC"
                  placeholder="Enter email addresses separated by commas"
                  value={formData?.reportingCommunication?.reportingCommunicationCC.join(", ")}
                  onChange={(value) =>
                    handleCommunicationChange("reportingCommunication", "reportingCommunicationCC", value)
                  }
                  helperText="Separate multiple emails with commas"
                />
              </Grid>

              {/* Invoice Communication */}
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "primary.main" }}>
                  Invoice Communication
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="TO"
                  placeholder="Enter email address"
                  value={formData?.invoiceCommunication?.invoiceCommunicationTo}
                  onChange={(value) =>
                    handleCommunicationChange("invoiceCommunication", "invoiceCommunicationTo", value)
                  }
                  required
                  error={!formData?.invoiceCommunication?.invoiceCommunicationTo}
                  helperText={
                    !formData?.invoiceCommunication?.invoiceCommunicationTo ? "Primary email is required" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="CC"
                  placeholder="Enter email addresses separated by commas"
                  value={formData?.invoiceCommunication?.invoiceCommunicationCC.join(", ")}
                  onChange={(value) =>
                    handleCommunicationChange("invoiceCommunication", "invoiceCommunicationCC", value)
                  }
                  helperText="Separate multiple emails with commas"
                />
              </Grid>

              {/* Physical Report Communication */}
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "primary.main" }}>
                  Physical Report Communication
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="TO"
                  placeholder="Enter email address"
                  value={formData?.physicalReportCommunication?.physicalReportCommunicationTo}
                  onChange={(value) =>
                    handleCommunicationChange("physicalReportCommunication", "physicalReportCommunicationTo", value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThrottledTextField
                  fullWidth
                  label="CC"
                  placeholder="Enter email addresses separated by commas"
                  value={formData?.physicalReportCommunication?.physicalReportCommunicationCC.join(", ")}
                  onChange={(value) =>
                    handleCommunicationChange("physicalReportCommunication", "physicalReportCommunicationCC", value)
                  }
                  helperText="Separate multiple emails with commas"
                />
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button onClick={handleBack} sx={{ mr: 2 }} disabled={loading}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{
                    minWidth: "120px",
                    py: 1,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Next"}
                </Button>
              </Grid>
            </Grid>
          )}
          {activeStep === 2 && (
            <Box sx={{ padding: 7 }}>
              <Box display={"flex"} justifyContent={"space-between"} alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
                  Select Report Types
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setOpenProductAdd(true)}
                  startIcon={<AddCircleOutlineIcon />}
                  disabled={loading}
                >
                  Add Report
                </Button>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Typography variant="body1" sx={{ mb: 3 }}>
                Select the report types that will be available to this client. You can add, edit, or remove reports as
                needed.
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
                  <CircularProgress />
                </Box>
              ) : clientProductLibrary?.length > 0 ? (
                <Box sx={{ maxHeight: "400px", overflowY: "auto", pr: 2 }}>
                  {clientProductLibrary?.map((product) => (
                    <Paper
                      key={product._id}
                      elevation={3}
                      sx={{
                        p: 3,
                        my: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: 2,
                        width: "100%",
                        maxWidth: "800px",
                        background: "linear-gradient(to right, #F0F7FF, #FFFFFF)",
                        border: "1px solid #E0E0E0",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
                        <CheckCircleIcon sx={{ color: "#4CAF50" }} />
                        <Typography variant="subtitle1" fontWeight={500} color="#333">
                          {product?.productName}
                        </Typography>
                      </Box>

                      <Box display="flex" gap={1}>
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setEditingProduct(product)
                            setEditedName(product.productName)
                            setEditDialogOpen(true)
                          }}
                          aria-label="Edit"
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>

                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemoveProduct(product)}
                          aria-label="Remove Product"
                          variant="outlined"
                          color="error"
                          size="small"
                        >
                          Remove
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 2,
                    backgroundColor: "#F9FAFC",
                    border: "1px dashed #CBD5E1",
                  }}
                >
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    No reports added yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Click the "Add Report" button to add your first report type
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setOpenProductAdd(true)}
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Add Your First Report
                  </Button>
                </Paper>
              )}

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button onClick={handleBack} sx={{ mr: 2 }} disabled={loading}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (clientProductLibrary?.length === 0) {
                      setSnackBar({
                        open: true,
                        message: "Please add at least one report type",
                        severity: "warning",
                      })
                      return
                    }
                    setActiveStep(3)
                  }}
                  disabled={loading}
                  sx={{
                    minWidth: "120px",
                    py: 1,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Next"}
                </Button>
              </Grid>
            </Box>
          )}

          {activeStep === 3 && (
            <Grid container spacing={4} padding={7}>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4} sx={{ ml:'7%'}}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
                    Employee Allocation
                  </Typography>

                  <CustomTextField
                    fullWidth
                    label="Allocation"
                    value={allocationId}
                    onChange={(e) => setAllocationId(e.target.value)}
                    select
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      },
                    }}
                  >
                    {emp.length > 0 ? (
                      emp.map((employee) => (
                        <MenuItem
                          key={employee._id}
                          value={employee._id}
                          sx={{
                            my: 1,
                            "&.Mui-selected": {
                              bgcolor: "#3B8AE5",
                              color: "#fff",
                              "&:hover": {
                                bgcolor: "primary.main",
                              },
                            },
                          }}
                        >
                          {employee.employeName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        No Employees Available
                      </MenuItem>
                    )}
                  </CustomTextField>
                </Grid>
              </Grid>

              {formData.enach === "upload" && (
                <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center" }}>
                  <Button variant="contained" component="label">
                    Upload File
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, "sign")} />
                  </Button>
                </Grid>
              )}

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button onClick={handleBack} sx={{ mr: 2 }} disabled={loading}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{
                    minWidth: "120px",
                    py: 1,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Next"}
                </Button>
              </Grid>
            </Grid>
          )}

          {activeStep === 4 && (
            <Box sx={{ padding: 7 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
                Configure Report Forms
              </Typography>
              <Divider sx={{ mb: 4 }} />

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {productForms.length > 0 ? (
                    <Card sx={{ p: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", borderRadius: 2 }}>
                      <Divider sx={{ mb: 4 }} />

                      <ProductTabs
                        products={productForms}
                        forms={forms}
                        fieldSections={fieldSections}
                        handleChargeChange={handleChargeChange}
                        handleUpdateField={handleUpdateField}
                        handleRemoveField={handleRemoveField}
                        handleAddField={handleAddField}
                        handleAddCustomField={handleAddCustomField}
                        // Add these new props
                        supportingDocs={supportingDocs}
                        docInputs={docInputs}
                        handleDocInputChange={handleDocInputChange}
                        handleAddDoc={handleAddDoc}
                        handleDeleteDoc={handleDeleteDoc}
                        requestId={requestId}
                        loading={isLoading}
                      />
                    </Card>
                  ) : (
                    <Card sx={{ p: 4, textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", borderRadius: 2 }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        No products found. Please add products in the previous step.
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(3)}
                        sx={{ mt: 2 }}
                        startIcon={<AddCircleOutlineIcon />}
                      >
                        Go Back to Add Products
                      </Button>
                    </Card>
                  )}
                </>
              )}

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button onClick={handleBack} sx={{ mr: 2 }} disabled={loading}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    handleUpdateProducts()
                    setSnackBar({
                      open: true,
                      message: "Partner setup completed successfully!",
                      severity: "success",
                    })
                    // Here you would typically redirect to a success page or partner list
                    router.push("/partner")
                  }}
                  disabled={productForms.length === 0 || loading}
                  sx={{
                    minWidth: "120px",
                    py: 1,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Complete Setup"}
                </Button>
              </Grid>
            </Box>
          )}
        </Box>

        {/* Add Product Dialog */}
        <Dialog
          open={openProductAdd}
          onClose={() => setOpenProductAdd(false)}
          aria-labelledby="add-product-dialog-title"
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle id="add-product-dialog-title" sx={{ pb: 1, pt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Add Report
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              select
              label="Select Services"
              variant="outlined"
              margin="normal"
              value={ProductFormData.moduleId}
              onChange={(e) => {
                setProductFormData({ ...ProductFormData, moduleId: e.target.value })
                setProductFormErrors((prev) => ({ ...prev, moduleId: false }))
              }}
              required
              error={productFormErrors.moduleId}
              helperText={productFormErrors.moduleId ? "Module is required" : ""}
            >
              {modules.map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.serviceName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Report Type"
              variant="outlined"
              margin="normal"
              value={ProductFormData?.productName}
              onChange={(e) => {
                setProductFormData({ ...ProductFormData, productName: e.target.value })
                setProductFormErrors((prev) => ({ ...prev, productName: false }))
              }}
              required
              error={productFormErrors.productName}
              helperText={productFormErrors.productName ? "Report name is required" : ""}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenProductAdd(false)} color="inherit" disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Add Report"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          aria-labelledby="edit-product-dialog-title"
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle id="edit-product-dialog-title" sx={{ pb: 1, pt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Edit Report
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Report Name"
              type="text"
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              variant="outlined"
              sx={{ mt: 2 }}
              error={!editedName.trim()}
              helperText={!editedName.trim() ? "Report name is required" : ""}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setEditDialogOpen(false)} color="inherit" disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              color="primary"
              variant="contained"
              disabled={!editedName.trim() || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      {/* Snackbar to show success/fail message */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
