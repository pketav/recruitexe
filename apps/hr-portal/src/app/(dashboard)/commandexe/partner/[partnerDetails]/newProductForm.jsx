"use client"

import { useEffect, useState, useCallback, useMemo, memo, useRef } from "react"
import { useParams, useRouter } from "next/navigation"

import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tabs,
  Tab,
  Typography,
  Snackbar,
  Alert,
  Stack,
  Card,
  CardContent,
  CircularProgress,
  Autocomplete,
  Chip,
  FormControlLabel,
  Switch,
} from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import CustomTextField from "@/@core/components/mui/TextField"
import { getAllEmployeeApi, getAllFormAPI, UpdatePartnerProductAPI, getAllFormProductsAPI, getAllDocAPI, removeAllDocAPI, addAllDocAPI } from "@/services/apiService"

// // Import axios and utility functions for API calls
// import axios from "axios"
// import { getAuthToken, baseUrl } from "@/services/utils"

// // API functions for documents
// export async function getAllDocAPI(id) {
//   const token = await getAuthToken()
//   const fullUrl = `${baseUrl}/v1/doc/all?reportId=${id}`

//   try {
//     const res = await axios.get(fullUrl, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     return res.data
//   } catch (error) {
//     console.error("Error fetching documents", error)
//     throw error
//   }
// }

// export async function addAllDocAPI(data) {
//   const token = await getAuthToken()
//   const fullUrl = `${baseUrl}/v1/doc/add`

//   try {
//     const res = await axios.post(fullUrl, data, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     return res.data
//   } catch (error) {
//     console.error("Error adding document", error)
//     throw error
//   }
// }

// export async function deleteDocAPI(id) {
//   const token = await getAuthToken()
//   const fullUrl = `${baseUrl}/v1/doc/remove?id=${id}`

//   try {
//     const res = await axios.delete(fullUrl, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     return res.data
//   } catch (error) {
//     console.error("Error deleting document", error)
//     throw error
//   }
// }

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
            disabled={fieldType === "initFields" ? true : false}
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
                disabled={fieldType === "initFields" ? true : false}
                error={!field.fieldName}
                helperText={!field.fieldName ? "Field name is required" : ""}
              />
              <FormControl fullWidth required>
                <ThrottledTextField
                  value={field.dataType || "string"}
                  onChange={(value) => onFieldChange(productId, fieldType, fieldIndex, "dataType", value)}
                  label="Data Type"
                  select
                  disabled={fieldType === "initFields" ? true : false}
                  fullWidth
                >
                  <MenuItem value="string">Text</MenuItem>
                  <MenuItem value="file">File</MenuItem>
                  <MenuItem value="textarea">Details</MenuItem>
                  <MenuItem value="multiUpload">MultiUpload</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                </ThrottledTextField>
              </FormControl>
            </>
          )}
 {/* Add supporting document dropdown for each field */}
        { fieldType !== "initFields" && 
        <FormControl fullWidth sx={{ mt: 1 }}>
          <ThrottledTextField
            value={field.supportingDoc || ""}
            onChange={(value) => onFieldChange(productId, fieldType, fieldIndex, "supportingDoc", value)}
            label="Required Supporting Document"
            select
            fullWidth
            size="small"
            // disabled={fieldType === "initFields" ? true : false}
          >
            <MenuItem value="">None</MenuItem>
            {supportingDocs[productId]?.map((doc) => (
              <MenuItem key={doc._id} value={doc.documentName}>
                {doc.documentName}
              </MenuItem>
            ))}
          </ThrottledTextField>
        </FormControl>}

         {/* Add Required heading and switch section */}
    {fieldType !== "initFields" && (
      <FormControl fullWidth sx={{ mt: 1 }}>
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
    )}

          <IconButton
            color="error"
            disabled={fieldType === "initFields" ? true : false}
            onClick={() => onRemoveField(productId, fieldType, fieldIndex)}
            size="small"
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

    // Simplify this condition to just check if there are fields in the array
    const hasFields = product[fieldType]?.fields && product[fieldType].fields.length > 0

    // If this field type doesn't exist for this product, don't render anything
    if (!product[fieldType] || product[fieldType].isActive === false) {
      return null
    }

    // Fixed: Add a new empty field when Add Field button is clicked
    const handleAddField = () => {
      // Create a new empty field
      const newField = { fieldName: "", dataType: "string" }

      // Call the onAddField function with the new field
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
  handleAddCustomField,
  supportingDocs,
  docInputs,
  handleDocInputChange,
  handleAddDoc,
  handleDeleteDoc,
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
                  type="text" // Use text instead of number to avoid arrows and leading zeros
                  value={product.charge}
                  onChange={(e) => {
                    const value = e.target.value
                    // Allow only digits and remove leading zeros
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
                    // Only render sections that exist for this product
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

export default function NewProductForm(activeStep, setActiveStep) {
  const { partnerDetails } = useParams()
  const router = useRouter()

  // State definitions
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [forms, setForms] = useState([])
  const [productForms, setProductForms] = useState([])
  const [allocationId, setAllocationId] = useState([])
  const [employees, setEmployees] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Supporting documents state
  const [supportingDocs, setSupportingDocs] = useState({}) // Store docs for each product
  const [docInputs, setDocInputs] = useState({}) // Store input values for each product

  // Handle snackbar close
  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }, [])

  // Fetch all forms
  const fetchAllForm = useCallback(async () => {
    try {
      const response = await getAllFormAPI()
      setForms(response.items || [])
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching forms",
        severity: "error",
      })
    }
  }, [])

  // Fetch partner products
  const fetchPartnerProducts = useCallback(async (id) => {
    try {
      setLoading(true)
      const response = await getAllFormProductsAPI(id)

      if (response && response.items) {
        setAllocationId(response.items.allocationId || [])

        // Initialize the product forms from partner products
        if (response.items.productForm && Array.isArray(response.items.productForm)) {
          setProductForms(response.items.productForm)

          // Fetch supporting documents for each product
          response.items.productForm.forEach((product) => {
            fetchDocuments(product.userProductId)
          })
        }
      }
    } catch (error) {
      console.error("Error fetching partner products:", error)
      setSnackbar({
        open: true,
        message: "Error fetching partner products",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await getAllEmployeeApi()
      if (res.status) {
        setEmployees(res.items.employees || [])
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching employees",
        severity: "error",
      })
    }
  }, [])

  // Initialize data
  const handleOpen = useCallback(
    async (partnerId) => {
      setLoading(true)
      try {
        await fetchPartnerProducts(partnerId)
        await fetchAllForm()
      } catch (error) {
        console.error("Error loading data:", error)
        setSnackbar({
          open: true,
          message: "Error loading data",
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    },
    [fetchPartnerProducts, fetchAllForm],
  )

  // Load data on component mount
  useEffect(() => {
    if (partnerDetails) {
      handleOpen(partnerDetails)
    }
  }, [partnerDetails, handleOpen])

  // Load employees
  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // Handle charge change
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
        setSnackbar({
          open: true,
          message: "Please enter a document name",
          severity: "warning",
        })
        return
      }

      try {
        setIsLoading(true)
        const payload = {
          requestId: partnerDetails,
          reportId: productId,
          documentName: docName.trim(),
        }

        const response = await addAllDocAPI(payload)

        if (response.status) {
          setSnackbar({
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
          setSnackbar({
            open: true,
            message: response.message || "Failed to add document",
            severity: "error",
          })
        }
      } catch (error) {
        console.error("Error adding document:", error)
        setSnackbar({
          open: true,
          message: "Error adding document: " + (error.message || "Unknown error"),
          severity: "error",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [docInputs, partnerDetails],
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

  const handleDeleteDoc = useCallback(
    async (docId, productId) => {
      try {
        setLoading(true)
        const response = await removeAllDocAPI(docId)

        if (response.status) {
          setSnackbar({
            open: true,
            message: "Document deleted successfully!",
            severity: "success",
          })

          // Fetch updated documents
          fetchDocuments(productId)
        } else {
          setSnackbar({
            open: true,
            message: response.message || "Failed to delete document",
            severity: "error",
          })
        }
      } catch (error) {
        console.error("Error deleting document:", error)
        setSnackbar({
          open: true,
          message: "Error deleting document: " + (error.message || "Unknown error"),
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    },
    [fetchDocuments],
  )

  // Handle update products - FIXED: Now properly formats the payload for custom fields
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
            ["initFields", "allocationFields", "agentFields", "submitFields"].includes(key) &&
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

                // For custom fields (with _id="other" or with fieldName but no fieldId)
                if ((field._id === "other" || (!field.fieldId && field.fieldName)) && field.fieldName) {
                  return {
                    ...baseField,
                    fieldName: field.fieldName,
                    dataType: field.dataType || "string",
                    isRequired: field.isRequired || false,
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
        id: partnerDetails,
        productForm: formattedProductForms,
        allocationId: allocationId,
      }


      const response = await UpdatePartnerProductAPI(payload)

      if (response.status) {
        setSnackbar({
          open: true,
          message: "Products updated successfully",
          severity: "success",
        })
        // router.push("/partner")
        fetchPartnerProducts(partnerDetails)
      } else {
        throw new Error("Failed to update products")
      }
    } catch (error) {
      console.error("Error updating products:", error)
      setSnackbar({
        open: true,
        message: "Failed to update products",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }


  const fieldSections = [
    { id: "initFields", label: "Initial Fields" },
    { id: "allocationFields", label: "Allocation Fields" },
    { id: "agentFields", label: "Agent Fields" },
    { id: "submitFields", label: "Submit Fields" },
  ]

  return (
    <>
      <Box sx={{ p: { xs: 4, md: 6 }, mx: "-24px", borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeStep?.activeStep === 3 && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid container spacing={4} padding={7}>
                  <Grid item xs={12}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
                      Employee Allocation
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4} sx={{ ml: 4 }}>
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
                        {employees.length > 0 ? (
                          employees.map((employee) => (
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
                </Grid>
              </Grid>
            )}

            {/* Products Tabs */}
            {activeStep?.activeStep === 4 && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", ml: 5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: "text.primary" }}>
                    Report Forms
                  </Typography>
                </Box>
                {productForms.length > 0 ? (
                  <Box sx={{ p: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <ProductTabs
                      products={productForms}
                      forms={forms}
                      fieldSections={fieldSections}
                      handleChargeChange={handleChargeChange}
                      handleUpdateField={handleUpdateField}
                      handleRemoveField={handleRemoveField}
                      handleAddField={handleAddField}
                      handleAddCustomField={handleAddCustomField}
                      supportingDocs={supportingDocs}
                      docInputs={docInputs}
                      handleDocInputChange={handleDocInputChange}
                      handleAddDoc={handleAddDoc}
                      handleDeleteDoc={handleDeleteDoc}
                      loading={isLoading}
                    />
                    <Box display="flex" justifyContent="flex-end" sx={{ mt: 4 }}>
                      <Button variant="contained" onClick={handleUpdateProducts} size="large">
                        Update Products
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Card sx={{ p: 4, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <Typography variant="h6" color="text.secondary">
                      No products found for this partner.
                    </Typography>
                  </Card>
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
