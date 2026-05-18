// 'use client'
// import React, { useEffect, useState } from 'react'

// const ExpenseUpdate = ({ params }) => {

//     const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

//     const [expenseId, setExpenseId] = useState('')

//     useEffect(() => {
//     const getParams = async () => {
//       try {
//         const resolvedParams = await Promise.resolve(params)
//         const { updateExpense } = resolvedParams
//         setExpenseId(updateExpense)
//       } catch (error) {
//         console.error('Error resolving params:', error)
//       }
//     }
//     getParams()
//   }, [params])

//     const fetchExpenseTypes = async (expenseId) => {
//         try {
//             const response = await fetch(`${baseUrl}/v1/api/expenseType/${expenseId}`, {
//                 headers: {
//                     Authorization: token
//                 }
//             })
//             const data = await response.json()
//         } catch (error) {
//             console.error('Error fetching expense types:', error)
//         }
//     }

//     useEffect(() => {
//         if (expenseId) {
//             fetchExpenseTypes(expenseId)
//         }
//     }, [expenseId])
//   return (
//     <div>
//       <h1>Update Expense</h1>
//     </div>
//   )
// }

// export default ExpenseUpdate


// "use client"

// import { useState, useEffect } from "react"
// import {
//   Box,
//   Grid,
//   TextField,
//   Typography,
//   Paper,
//   Button,
//   MenuItem,
//   Select,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   Switch,
//   FormControlLabel,
//   Chip,
//   IconButton,
//   Stack,
//   Card,
//   CardContent,
//   Divider,
//   Alert,
//   Snackbar,
//   CircularProgress,
//   ListItemIcon,
//   ListItemText,
//   InputLabel,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Skeleton,
// } from "@mui/material"
// import {
//   KeyboardBackspace,
//   Save,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Close as CloseIcon,
//   TextFields as TextIcon,
//   Subject as TextAreaIcon,
//   ArrowDropDown as DropdownIcon,
//   RadioButtonChecked as RadioIcon,
//   CheckBox as CheckboxIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   AttachMoney as CurrencyIcon,
//   DateRange as DateIcon,
//   Schedule as DateTimeIcon,
//   AttachFile as FileIcon,
//   ExpandMore as ExpandMoreIcon,
//   Numbers as NumberIcon,
// } from "@mui/icons-material"
// import { useRouter } from "next/navigation"
// import axios from "axios"

// const fieldTypeIcons = {
//   text: { icon: TextIcon, color: "#555", label: "Text Field" },
//   textarea: { icon: TextAreaIcon, color: "#555", label: "Text Area" },
//   select: { icon: DropdownIcon, color: "#555", label: "Select Dropdown" },
//   multiselect: { icon: DropdownIcon, color: "#555", label: "Multi Select" },
//   radio: { icon: RadioIcon, color: "#555", label: "Radio Buttons" },
//   checkbox: { icon: CheckboxIcon, color: "#555", label: "Checkbox" },
//   email: { icon: EmailIcon, color: "#555", label: "Email Field" },
//   phone: { icon: PhoneIcon, color: "#555", label: "Phone Field" },
//   number: { icon: NumberIcon, color: "#555", label: "Number Field" },
//   currency: { icon: CurrencyIcon, color: "#555", label: "Currency Field" },
//   date: { icon: DateIcon, color: "#555", label: "Date Field" },
//   datetime: { icon: DateTimeIcon, color: "#555", label: "Date Time Field" },
//   file: { icon: FileIcon, color: "#555", label: "File Upload" },
// }

// const conditionalOperators = [
//   { value: "equals", label: "Equals" },
//   { value: "not_equals", label: "Not Equals" },
//   { value: "greater_than", label: "Greater Than" },
//   { value: "less_than", label: "Less Than" },
//   { value: "greater_than_equal", label: "Greater Than or Equal" },
//   { value: "less_than_equal", label: "Less Than or Equal" },
//   { value: "contains", label: "Contains" },
//   { value: "not_contains", label: "Does Not Contain" },
// ]

// export default function ExpenseTypeUpdate({ params }) {
//   const router = useRouter()
//   const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

//   // Loading states
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [expenseId, setExpenseId] = useState("")

//   // Data states
//   const [categories, setCategories] = useState([])
//   const [subCategoriesFilter, setSubCategoriesFilter] = useState([])
//   const [workflows, setWorkflows] = useState([])

//   // Form states
//   const [ExpenseForm, setExpenseForm] = useState({
//     expenseTypeId: "",
//     systemCategoryId: "",
//     subcategoryId: "",
//     name: "",
//     description: "",
//     formId: "",
//     workflowId: "",
//     autoApproveConfig: false,
//   })

//   // Form Builder States
//   const [openFormDialog, setOpenFormDialog] = useState(false)
//   const [openFieldDialog, setOpenFieldDialog] = useState(false)
//   const [editingField, setEditingField] = useState(null)
//   const [editingFieldIndex, setEditingFieldIndex] = useState(-1)
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
//   const [hasCustomForm, setHasCustomForm] = useState(false)
//   const [createdFormName, setCreatedFormName] = useState("")

//   // Form Builder Data
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     fields: [],
//   })

//   // Field Form State
//   const [fieldForm, setFieldForm] = useState({
//     fieldName: "",
//     fieldType: "text",
//     label: "",
//     placeholder: "",
//     isRequired: false,
//     validation: {
//       minLength: "",
//       maxLength: "",
//       min: "",
//       max: "",
//       pattern: "",
//       customValidation: "",
//     },
//     displayOrder: 1,
//     defaultValue: "",
//     helpText: "",
//     options: [],
//     conditionalLogic: {
//       enabled: false,
//       showIf: {
//         displayOrder: "",
//         operator: "equals",
//         value: "",
//       },
//     },
//   })

//   // Extract expense ID from params
//   useEffect(() => {
//     const getParams = async () => {
//       try {
//         const resolvedParams = await Promise.resolve(params)
//         const { updateExpense } = resolvedParams
//         setExpenseId(updateExpense)
//       } catch (error) {
//         console.error("Error resolving params:", error)
//         showSnackbar("Error loading expense data", "error")
//       }
//     }
//     getParams()
//   }, [params])

//   // Fetch expense details
//   const fetchExpenseDetails = async (expenseId) => {
//     try {
//       setLoading(true)
//       const response = await axios.get(`${baseUrl}/v1/api/expenseType/${expenseId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })

//       const expenseData = response.data.items

//       // Set expense form data
//       setExpenseForm({
//         expenseTypeId: expenseData.expenseTypeId,
//         systemCategoryId: expenseData.systemCategoryId?.systemCategoryId || "",
//         subcategoryId: expenseData.subcategoryId?.subcategoryId || "",
//         name: expenseData.name,
//         description: expenseData.description,
//         formId: expenseData.formId?.formId || "",
//         workflowId: expenseData.workflowId?.workflowId || "",
//         autoApproveConfig: expenseData.autoApproveConfig || false,
//       })

//       // If there's a custom form, fetch its details
//       if (expenseData.formId?.formId) {
//         setHasCustomForm(true)
//         setCreatedFormName(expenseData.formId.name)
//         await fetchCustomFormDetails(expenseData.formId.formId)
//       }

//       // Load subcategories for the selected system category
//       if (expenseData.systemCategoryId?.systemCategoryId) {
//         await getAllSubCategoryFilter(expenseData.systemCategoryId.systemCategoryId)
//       }
//     } catch (error) {
//       console.error("Error fetching expense details:", error)
//       showSnackbar("Error loading expense details", "error")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fetch custom form details
//   const fetchCustomFormDetails = async (formId) => {
//     try {
//       const response = await axios.get(`${baseUrl}/v1/api/dynamicForm/${formId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })

//       const formDetails = response.data.items

//       setFormData({
//         name: formDetails.name || "",
//         description: formDetails.description || "",
//         fields: formDetails.fields || [],
//       })
//     } catch (error) {
//       console.error("Error fetching custom form details:", error)
//       showSnackbar("Error loading custom form details", "error")
//     }
//   }

//   // Fetch all categories
//   const getAllCategory = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/systemCategory`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       setCategories(res.data.items || [])
//     } catch (error) {
//       console.error("Error fetching categories:", error)
//     }
//   }

//   // Fetch subcategories based on system category
//   const getAllSubCategoryFilter = async (id) => {
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/subCategory?systemCategoryId=${id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       setSubCategoriesFilter(res.data.items?.subcategories || [])
//     } catch (error) {
//       console.error("Error fetching subcategories:", error)
//     }
//   }

//   // Handle form field changes
//   const handleExpenseFormChange = (field, value) => {
//     setExpenseForm((prev) => ({ ...prev, [field]: value }))
//   }

//   // Update expense
//   const handleUpdateExpense = async () => {
//     try {
//       setSaving(true)
//       const updateData = {
//         systemCategoryId: ExpenseForm.systemCategoryId,
//         subcategoryId: ExpenseForm.subcategoryId,
//         name: ExpenseForm.name,
//         description: ExpenseForm.description,
//         formId: ExpenseForm.formId,
//         workflowId: ExpenseForm.workflowId,
//         autoApproveConfig: ExpenseForm.autoApproveConfig,
//       }

//       await axios.put(`${baseUrl}/v1/api/expenseType/${ExpenseForm.expenseTypeId}`, updateData, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })

//       showSnackbar("Expense type updated successfully!")
//       setTimeout(() => {
//         router.push("/categories")
//       }, 1500)
//     } catch (error) {
//       console.error("Error updating expense:", error)
//       showSnackbar("Error updating expense type", "error")
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Snackbar functions
//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity })
//   }

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false })
//   }

//   // Form dialog functions
//   const handleOpenFormDialog = () => {
//     setOpenFormDialog(true)
//   }

//   const handleCloseFormDialog = (shouldReset = false) => {
//     setOpenFormDialog(false)
//     if (shouldReset && !hasCustomForm) {
//       setFormData({ name: "", description: "", fields: [] })
//     }
//   }

//   // Field dialog functions
//   const handleOpenFieldDialog = (field = null, index = -1) => {
//     if (field) {
//       setEditingField(field)
//       setEditingFieldIndex(index)
//       setFieldForm({
//         ...field,
//         validation: {
//           minLength: field.validation?.minLength || "",
//           maxLength: field.validation?.maxLength || "",
//           min: field.validation?.min || "",
//           max: field.validation?.max || "",
//           pattern: field.validation?.pattern || "",
//           customValidation: field.validation?.customValidation || "",
//           ...field.validation,
//         },
//         conditionalLogic: field.conditionalLogic || {
//           enabled: false,
//           showIf: {
//             displayOrder: "",
//             operator: "equals",
//             value: "",
//           },
//         },
//         options: field.options || [],
//         placeholder: field.placeholder || "",
//         helpText: field.helpText || "",
//         defaultValue: field.defaultValue || "",
//       })
//     } else {
//       setEditingField(null)
//       setEditingFieldIndex(-1)
//       setFieldForm({
//         fieldName: "",
//         fieldType: "text",
//         label: "",
//         placeholder: "",
//         isRequired: false,
//         validation: {
//           minLength: "",
//           maxLength: "",
//           min: "",
//           max: "",
//           pattern: "",
//           customValidation: "",
//         },
//         displayOrder: formData.fields.length + 1,
//         defaultValue: "",
//         helpText: "",
//         options: [],
//         conditionalLogic: {
//           enabled: false,
//           showIf: {
//             displayOrder: "",
//             operator: "equals",
//             value: "",
//           },
//         },
//       })
//     }
//     setOpenFieldDialog(true)
//   }

//   const handleCloseFieldDialog = () => {
//     setOpenFieldDialog(false)
//     setEditingField(null)
//     setEditingFieldIndex(-1)
//   }

//   // Field form change handlers
//   const handleFieldFormChange = (field, value) => {
//     if (field.includes(".")) {
//       const [parent, child] = field.split(".")
//       setFieldForm((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value,
//         },
//       }))
//     } else {
//       setFieldForm((prev) => ({ ...prev, [field]: value }))
//     }
//   }

//   const handleValidationChange = (validationType, value) => {
//     setFieldForm((prev) => ({
//       ...prev,
//       validation: {
//         ...prev.validation,
//         [validationType]: value,
//       },
//     }))
//   }

//   const handleConditionalLogicChange = (field, value) => {
//     if (field.includes(".")) {
//       const [parent, child] = field.split(".")
//       setFieldForm((prev) => ({
//         ...prev,
//         conditionalLogic: {
//           ...prev.conditionalLogic,
//           [parent]: {
//             ...prev.conditionalLogic[parent],
//             [child]: value,
//           },
//         },
//       }))
//     } else {
//       setFieldForm((prev) => ({
//         ...prev,
//         conditionalLogic: {
//           ...prev.conditionalLogic,
//           [field]: value,
//         },
//       }))
//     }
//   }

//   // Clean field data before saving
//   const cleanFieldData = (field) => {
//     const cleanedField = { ...field }

//     if (!cleanedField.fieldName && cleanedField.label) {
//       cleanedField.fieldName = cleanedField.label
//         .toLowerCase()
//         .replace(/\s+/g, "")
//         .replace(/[^a-zA-Z0-9]/g, "")
//     }

//     const cleanedValidation = {}
//     Object.entries(cleanedField.validation || {}).forEach(([key, value]) => {
//       if (value !== "" && value !== null && value !== undefined) {
//         cleanedValidation[key] = value
//       }
//     })
//     if (Object.keys(cleanedValidation).length > 0) {
//       cleanedField.validation = cleanedValidation
//     } else {
//       delete cleanedField.validation
//     }

//     if (!["text", "textarea", "email", "phone"].includes(cleanedField.fieldType)) {
//       delete cleanedField.placeholder
//     }

//     if (!["select", "multiselect", "radio"].includes(cleanedField.fieldType)) {
//       delete cleanedField.options
//     }

//     if (cleanedField.conditionalLogic?.enabled) {
//       cleanedField.conditionalLogic = {
//         showIf: {
//           displayOrder: Number.parseInt(cleanedField.conditionalLogic.showIf.displayOrder),
//           operator: cleanedField.conditionalLogic.showIf.operator,
//           value: cleanedField.conditionalLogic.showIf.value,
//         },
//       }
//     } else {
//       delete cleanedField.conditionalLogic
//     }

//     cleanedField.displayOrder = Number.parseInt(cleanedField.displayOrder)

//     if (cleanedField.fieldType === "multiselect" && typeof cleanedField.defaultValue === "string") {
//       cleanedField.defaultValue = cleanedField.defaultValue.split(",").map((v) => v.trim())
//     }

//     return cleanedField
//   }

//   // Save field
//   const handleSaveField = () => {
//     const cleanedField = cleanFieldData(fieldForm)

//     if (editingFieldIndex >= 0) {
//       const updatedFields = [...formData.fields]
//       updatedFields[editingFieldIndex] = cleanedField
//       setFormData((prev) => ({ ...prev, fields: updatedFields }))
//     } else {
//       setFormData((prev) => ({ ...prev, fields: [...prev.fields, cleanedField] }))
//     }

//     handleCloseFieldDialog()
//     showSnackbar(editingFieldIndex >= 0 ? "Field updated successfully" : "Field added successfully")
//   }

//   // Delete field
//   const handleDeleteField = (index) => {
//     const updatedFields = formData.fields.filter((_, i) => i !== index)
//     const reorderedFields = updatedFields.map((field, idx) => ({
//       ...field,
//       displayOrder: idx + 1,
//     }))
//     setFormData((prev) => ({ ...prev, fields: reorderedFields }))
//     showSnackbar("Field deleted successfully")
//   }

//   // Save form
//   const handleSaveForm = async () => {
//     if (!formData.name.trim()) {
//       showSnackbar("Please enter a form name", "error")
//       return
//     }
//     if (formData.fields.length === 0) {
//       showSnackbar("Please add at least one field to the form", "error")
//       return
//     }

//     try {
//       setSaving(true)

//       if (hasCustomForm && ExpenseForm.formId) {
//         // Update existing form
//         await axios.put(`${baseUrl}/v1/api/dynamicForm/${ExpenseForm.formId}`, formData, {
//           headers: {
//             "Content-Type": "application/json",
//             authorization: token,
//           },
//         })
//         showSnackbar("Custom form updated successfully!")
//       } else {
//         // Create new form
//         const response = await axios.post(`${baseUrl}/v1/api/dynamicForm`, formData, {
//           headers: {
//             "Content-Type": "application/json",
//             authorization: token,
//           },
//         })

//         if (response.data) {
//           const formId = response.data.items?.formId || response.data._id || response.data.id
//           setExpenseForm((prev) => ({ ...prev, formId: formId }))
//           setHasCustomForm(true)
//           setCreatedFormName(formData.name)
//           showSnackbar("Custom form created successfully!")
//         }
//       }

//       handleCloseFormDialog(false)
//     } catch (error) {
//       console.error("Error saving form:", error)
//       showSnackbar(hasCustomForm ? "Error updating form" : "Error creating form", "error")
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Remove custom form
//   const handleRemoveCustomForm = () => {
//     if (window.confirm("Are you sure you want to remove this custom form? This action cannot be undone.")) {
//       setHasCustomForm(false)
//       setCreatedFormName("")
//       setExpenseForm((prev) => ({ ...prev, formId: "" }))
//       setFormData({ name: "", description: "", fields: [] })
//       showSnackbar("Custom form removed")
//     }
//   }

//   // Option handlers
//   const handleAddOption = () => {
//     setFieldForm((prev) => ({
//       ...prev,
//       options: [...(prev.options || []), { label: "", value: "" }],
//     }))
//   }

//   const handleOptionChange = (index, field, value) => {
//     const newOptions = [...(fieldForm.options || [])]
//     newOptions[index] = { ...newOptions[index], [field]: value }
//     setFieldForm((prev) => ({ ...prev, options: newOptions }))
//   }

//   const handleDeleteOption = (index) => {
//     const newOptions = [...(fieldForm.options || [])]
//     newOptions.splice(index, 1)
//     setFieldForm((prev) => ({ ...prev, options: newOptions }))
//   }

//   // Get available fields for conditional logic
//   const getAvailableFieldsForConditional = () => {
//     return formData.fields
//       .filter((field, index) => index !== editingFieldIndex)
//       .map((field) => ({
//         displayOrder: field.displayOrder,
//         label: field.label,
//         fieldType: field.fieldType,
//       }))
//   }

//   // Initialize data
//   useEffect(() => {
//     getAllCategory()
//   }, [])

//   useEffect(() => {
//     if (ExpenseForm?.systemCategoryId) {
//       getAllSubCategoryFilter(ExpenseForm.systemCategoryId)
//     }
//   }, [ExpenseForm?.systemCategoryId])

//   useEffect(() => {
//     if (expenseId) {
//       fetchExpenseDetails(expenseId)
//     }
//   }, [expenseId])

//   if (loading) {
//     return (
//       <Box sx={{ p: 3, bgcolor: "#f9f9fb", minHeight: "100vh" }}>
//         <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
//           <Skeleton variant="text" width="40%" height={40} />
//           <Skeleton variant="text" width="60%" height={20} />
//         </Paper>
//         <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
//           <Grid container spacing={3}>
//             {[...Array(6)].map((_, index) => (
//               <Grid item xs={12} sm={6} key={index}>
//                 <Skeleton variant="text" width="30%" height={20} />
//                 <Skeleton variant="rectangular" width="100%" height={56} />
//               </Grid>
//             ))}
//           </Grid>
//         </Paper>
//       </Box>
//     )
//   }

//   return (
//     <Box sx={{ p: 3, bgcolor: "#f9f9fb", minHeight: "100vh" }}>
//       {/* Header */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 4,
//           borderRadius: 3,
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           color: "white",
//           position: "relative",
//           overflow: "hidden",
//           border: "1px solid rgba(255, 255, 255, 0.1)",
//         }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Box>
//             <Typography variant="h4" fontWeight={600} sx={{ color: "white", mb: "-5px" }}>
//               Update Expense Type
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
//               Update expense type: {ExpenseForm.name}
//             </Typography>
//           </Box>
//           <Button
//             sx={{
//               borderRadius: "20px",
//               border: "1px solid rgba(255, 255, 255, 0.5)",
//               color: "white",
//               "&:hover": {
//                 borderColor: "rgba(255, 255, 255, 0.7)",
//                 bgcolor: "rgba(255, 255, 255, 0.1)",
//               },
//             }}
//             variant="outlined"
//             onClick={() => router.push("/categories")}
//           >
//             <KeyboardBackspace sx={{ fontSize: 18 }} />
//           </Button>
//         </Box>
//       </Paper>

//       {/* Form Content */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 4,
//           borderRadius: 2,
//           bgcolor: "white",
//           border: "1px solid #EAECF0",
//         }}
//       >
//         <Grid container spacing={3}>
//           {/* System Category & Sub Category */}
//           <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Select System Category
//             </Typography>
//             <Select
//               fullWidth
//               value={ExpenseForm.systemCategoryId}
//               onChange={(e) => handleExpenseFormChange("systemCategoryId", e.target.value)}
//               displayEmpty
//             >
//               <MenuItem value="" disabled>
//                 Select System Category
//               </MenuItem>
//               {categories.map((cat) => (
//                 <MenuItem key={cat._id} value={cat.systemCategoryId}>
//                   {cat.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Select Sub Category
//             </Typography>
//             <Select
//               fullWidth
//               value={ExpenseForm.subcategoryId}
//               onChange={(e) => handleExpenseFormChange("subcategoryId", e.target.value)}
//               displayEmpty
//               disabled={!ExpenseForm.systemCategoryId}
//             >
//               <MenuItem value="" disabled>
//                 Select Sub Category
//               </MenuItem>
//               {subCategoriesFilter.map((cat) => (
//                 <MenuItem key={cat._id} value={cat.subcategoryId}>
//                   {cat.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Grid>

//           {/* Expense Type Name */}
//           <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Expense Type Name
//             </Typography>
//             <TextField
//               fullWidth
//               placeholder="Enter Expense Type Name"
//               value={ExpenseForm.name}
//               onChange={(e) => handleExpenseFormChange("name", e.target.value)}
//             />
//           </Grid>

//           {/* Description */}
//           <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Description
//             </Typography>
//             <TextField
//               fullWidth
//               placeholder="Write Description"
//               multiline
//               rows={3}
//               value={ExpenseForm.description}
//               onChange={(e) => handleExpenseFormChange("description", e.target.value)}
//             />
//           </Grid>

//           {/* Custom Form Section */}
//           <Grid item xs={12}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Custom Form
//             </Typography>
//             {hasCustomForm ? (
//               <Card variant="outlined" sx={{ bgcolor: "#f8f9fa" }}>
//                 <CardContent>
//                   <Stack direction="row" justifyContent="space-between" alignItems="center">
//                     <Box>
//                       <Typography variant="subtitle1" fontWeight={500} color="success.main">
//                         ✓ Custom Form Attached
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {createdFormName} ({formData.fields.length} fields)
//                       </Typography>
//                     </Box>
//                     <Stack direction="row" spacing={1}>
//                       <Button
//                         variant="outlined"
//                         size="small"
//                         onClick={handleOpenFormDialog}
//                         sx={{ textTransform: "none" }}
//                       >
//                         Edit Form
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         size="small"
//                         color="error"
//                         onClick={handleRemoveCustomForm}
//                         sx={{ textTransform: "none" }}
//                       >
//                         Remove
//                       </Button>
//                     </Stack>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card variant="outlined" sx={{ bgcolor: "#f8f9fa" }}>
//                 <CardContent sx={{ textAlign: "center", py: 3 }}>
//                   <Typography variant="body1" color="text.secondary" gutterBottom>
//                     No custom form attached
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Create a custom form to collect additional information for this expense type
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={handleOpenFormDialog}
//                     sx={{
//                       textTransform: "none",
//                       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                     }}
//                   >
//                     Create Custom Form
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </Grid>

//           {/* Approval Flow */}
//           <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Select Approval Flow
//             </Typography>
//             <Select
//               fullWidth
//               value={ExpenseForm.workflowId}
//               onChange={(e) => handleExpenseFormChange("workflowId", e.target.value)}
//               displayEmpty
//             >
//               <MenuItem value="" disabled>
//                 Select Approval Flow
//               </MenuItem>
//               <MenuItem value="flow1">Flow A</MenuItem>
//               <MenuItem value="flow2">Flow B</MenuItem>
//             </Select>
//           </Grid>

//           {/* Auto Approve Config */}
//           <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Auto Approve Configuration
//             </Typography>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={ExpenseForm.autoApproveConfig}
//                   onChange={(e) => handleExpenseFormChange("autoApproveConfig", e.target.checked)}
//                 />
//               }
//               label="Enable auto approval for this expense type"
//             />
//           </Grid>
//         </Grid>

//         {/* Action Buttons */}
//         <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
//           <Button variant="outlined" onClick={() => router.push("/categories")} sx={{ minWidth: 120 }}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleUpdateExpense}
//             startIcon={saving ? <CircularProgress size={16} /> : <Save />}
//             disabled={saving}
//             sx={{
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               minWidth: 120,
//             }}
//           >
//             {saving ? "Updating..." : "Update Expense"}
//           </Button>
//         </Box>
//       </Paper>

//       {/* Form Builder Dialog - Same as create form */}
//       <Dialog open={openFormDialog} onClose={handleCloseFormDialog} maxWidth="lg" fullWidth>
//         <DialogTitle
//           sx={{
//             bgcolor: "grey.50",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6" fontWeight={500}>
//             {hasCustomForm ? "Edit Custom Form" : "Create Custom Form"}
//           </Typography>
//           <IconButton onClick={handleCloseFormDialog}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ p: 3 }}>
//           <Grid container spacing={3}>
//             {/* Left Side - Form Configuration */}
//             <Grid item xs={12} md={8}>
//               <Stack spacing={3}>
//                 <TextField
//                   fullWidth
//                   label="Form Name"
//                   value={formData.name}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   label="Form Description"
//                   value={formData.description}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                   multiline
//                   rows={2}
//                 />
//                 <Divider />
//                 <Box>
//                   <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//                     <Typography variant="h6" fontWeight={500}>
//                       Form Fields ({formData.fields.length})
//                     </Typography>
//                     <Button
//                       variant="outlined"
//                       startIcon={<AddIcon />}
//                       onClick={() => handleOpenFieldDialog()}
//                       sx={{ textTransform: "none" }}
//                     >
//                       Add Field
//                     </Button>
//                   </Stack>
//                   {formData.fields.length > 0 ? (
//                     <Stack spacing={2}>
//                       {formData.fields
//                         .sort((a, b) => a.displayOrder - b.displayOrder)
//                         .map((field, index) => {
//                           const fieldTypeConfig = fieldTypeIcons[field.fieldType]
//                           const IconComponent = fieldTypeConfig?.icon || TextIcon
//                           return (
//                             <Card key={index} variant="outlined">
//                               <CardContent sx={{ p: 2 }}>
//                                 <Stack direction="row" spacing={2} alignItems="center">
//                                   <Box
//                                     sx={{
//                                       display: "flex",
//                                       alignItems: "center",
//                                       justifyContent: "center",
//                                       width: 24,
//                                       height: 24,
//                                       borderRadius: "50%",
//                                       bgcolor: "primary.main",
//                                       color: "white",
//                                       fontSize: "0.75rem",
//                                       fontWeight: "bold",
//                                     }}
//                                   >
//                                     {field.displayOrder}
//                                   </Box>
//                                   <IconComponent sx={{ color: "text.secondary" }} />
//                                   <Box sx={{ flexGrow: 1 }}>
//                                     <Stack direction="row" spacing={1} alignItems="center">
//                                       <Typography variant="subtitle1" fontWeight={500}>
//                                         {field.label}
//                                       </Typography>
//                                       {field.isRequired && (
//                                         <Chip label="Required" size="small" color="error" variant="outlined" />
//                                       )}
//                                       <Chip
//                                         label={fieldTypeConfig?.label}
//                                         size="small"
//                                         variant="outlined"
//                                         sx={{ fontSize: "0.7rem" }}
//                                       />
//                                       {field.conditionalLogic && (
//                                         <Chip label="Conditional" size="small" color="info" variant="outlined" />
//                                       )}
//                                     </Stack>
//                                     {field.helpText && (
//                                       <Typography variant="body2" color="text.secondary">
//                                         {field.helpText}
//                                       </Typography>
//                                     )}
//                                   </Box>
//                                   <Stack direction="row" spacing={1}>
//                                     <IconButton size="small" onClick={() => handleOpenFieldDialog(field, index)}>
//                                       <EditIcon fontSize="small" />
//                                     </IconButton>
//                                     <IconButton size="small" onClick={() => handleDeleteField(index)}>
//                                       <DeleteIcon fontSize="small" color="error" />
//                                     </IconButton>
//                                   </Stack>
//                                 </Stack>
//                               </CardContent>
//                             </Card>
//                           )
//                         })}
//                     </Stack>
//                   ) : (
//                     <Paper variant="outlined" sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
//                       <Typography variant="body1" color="text.secondary" gutterBottom>
//                         No fields added yet
//                       </Typography>
//                       <Button
//                         variant="outlined"
//                         startIcon={<AddIcon />}
//                         onClick={() => handleOpenFieldDialog()}
//                         sx={{ textTransform: "none" }}
//                       >
//                         Add Your First Field
//                       </Button>
//                     </Paper>
//                   )}
//                 </Box>
//               </Stack>
//             </Grid>
//             {/* Right Side - Preview */}
//             <Grid item xs={12} md={4}>
//               <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
//                 <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
//                   Form Preview
//                 </Typography>
//                 <Card variant="outlined">
//                   <CardContent>
//                     <Typography variant="h6" gutterBottom>
//                       {formData.name || "Form Name"}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" gutterBottom>
//                       {formData.description || "Form description will appear here"}
//                     </Typography>
//                     {formData.fields.length > 0 ? (
//                       <Stack spacing={2} sx={{ mt: 2 }}>
//                         {formData.fields
//                           .sort((a, b) => a.displayOrder - b.displayOrder)
//                           .slice(0, 3)
//                           .map((field, index) => (
//                             <Box key={index}>
//                               <Typography variant="subtitle2" gutterBottom>
//                                 {field.displayOrder}. {field.label}
//                                 {field.isRequired && <span style={{ color: "red" }}> *</span>}
//                               </Typography>
//                               <TextField
//                                 fullWidth
//                                 size="small"
//                                 placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
//                                 disabled
//                               />
//                             </Box>
//                           ))}
//                         {formData.fields.length > 3 && (
//                           <Typography variant="body2" color="text.secondary" textAlign="center">
//                             ... and {formData.fields.length - 3} more fields
//                           </Typography>
//                         )}
//                       </Stack>
//                     ) : (
//                       <Typography variant="body2" color="text.secondary">
//                         Add fields to see preview
//                       </Typography>
//                     )}
//                   </CardContent>
//                 </Card>
//               </Box>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
//           <Button onClick={() => handleCloseFormDialog(false)}>Cancel</Button>
//           <Button
//             onClick={handleSaveForm}
//             variant="contained"
//             disabled={!formData.name || formData.fields.length === 0 || saving}
//             startIcon={saving ? <CircularProgress size={16} /> : <Save />}
//           >
//             {saving ? "Saving..." : hasCustomForm ? "Update Form" : "Create Form"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Field Builder Dialog - Same as create form */}
//       <Dialog open={openFieldDialog} onClose={handleCloseFieldDialog} maxWidth="lg" fullWidth>
//         <DialogTitle
//           sx={{
//             bgcolor: "white",
//             borderBottom: "1px solid #f0f0f0",
//             py: 3,
//             px: 3,
//           }}
//         >
//           <Stack direction="row" justifyContent="space-between" alignItems="center">
//             <Box>
//               <Typography variant="h6" fontWeight={600} color="text.primary">
//                 {editingField ? "Edit Field" : "Add New Field"}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                 Configure the field properties, validation rules, and conditional logic
//               </Typography>
//             </Box>
//             <IconButton onClick={handleCloseFieldDialog}>
//               <CloseIcon />
//             </IconButton>
//           </Stack>
//         </DialogTitle>
//         <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto" }}>
//           <Grid container spacing={3}>
//             {/* Basic Information */}
//             <Grid item xs={12}>
//               <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
//                 Basic Information
//               </Typography>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Field Label *
//               </Typography>
//               <TextField
//                 fullWidth
//                 value={fieldForm.label}
//                 onChange={(e) => handleFieldFormChange("label", e.target.value)}
//                 placeholder="Enter field label"
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Field Name
//               </Typography>
//               <TextField
//                 fullWidth
//                 value={fieldForm.fieldName}
//                 onChange={(e) => handleFieldFormChange("fieldName", e.target.value)}
//                 placeholder="Auto-generated from label"
//                 helperText="Used as the field identifier in the form data"
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Field Type
//               </Typography>
//               <FormControl fullWidth>
//                 <Select
//                   value={fieldForm.fieldType}
//                   onChange={(e) => handleFieldFormChange("fieldType", e.target.value)}
//                   renderValue={(selected) => {
//                     const config = fieldTypeIcons[selected]
//                     const IconComponent = config?.icon || TextIcon
//                     return (
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                         <IconComponent sx={{ color: "primary.main", fontSize: 20 }} />
//                         <Typography fontWeight={500}>{config?.label || selected}</Typography>
//                       </Box>
//                     )
//                   }}
//                 >
//                   {Object.entries(fieldTypeIcons).map(([type, config]) => {
//                     const IconComponent = config.icon
//                     return (
//                       <MenuItem key={type} value={type} sx={{ py: 1.5 }}>
//                         <ListItemIcon sx={{ minWidth: 36 }}>
//                           <IconComponent sx={{ color: "primary.main" }} />
//                         </ListItemIcon>
//                         <ListItemText primary={config.label} />
//                       </MenuItem>
//                     )
//                   })}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Display Order
//               </Typography>
//               <TextField
//                 fullWidth
//                 type="number"
//                 value={fieldForm.displayOrder}
//                 onChange={(e) => handleFieldFormChange("displayOrder", Number.parseInt(e.target.value) || 1)}
//                 inputProps={{ min: 1 }}
//                 helperText="Order in which this field appears in the form"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Help Text
//               </Typography>
//               <TextField
//                 fullWidth
//                 value={fieldForm.helpText}
//                 onChange={(e) => handleFieldFormChange("helpText", e.target.value)}
//                 placeholder="Enter help text (optional)"
//                 multiline
//                 rows={2}
//               />
//             </Grid>
//             {["text", "textarea", "email", "phone"].includes(fieldForm.fieldType) && (
//               <Grid item xs={12} md={6}>
//                 <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                   Placeholder Text
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   value={fieldForm.placeholder || ""}
//                   onChange={(e) => handleFieldFormChange("placeholder", e.target.value)}
//                   placeholder="Enter placeholder text"
//                 />
//               </Grid>
//             )}
//             <Grid item xs={12} md={6}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Default Value
//               </Typography>
//               <TextField
//                 fullWidth
//                 value={fieldForm.defaultValue}
//                 onChange={(e) => handleFieldFormChange("defaultValue", e.target.value)}
//                 placeholder="Enter default value (optional)"
//                 helperText={
//                   fieldForm.fieldType === "multiselect"
//                     ? "For multiselect, use comma-separated values"
//                     : "Default value for this field"
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={fieldForm.isRequired}
//                     onChange={(e) => handleFieldFormChange("isRequired", e.target.checked)}
//                   />
//                 }
//                 label="Required field"
//               />
//             </Grid>

//             {/* Options for select, multiselect, radio */}
//             {["select", "multiselect", "radio"].includes(fieldForm.fieldType) && (
//               <>
//                 <Grid item xs={12}>
//                   <Divider sx={{ my: 2 }} />
//                   <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
//                     Options
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Stack spacing={2}>
//                     {(fieldForm.options || []).map((option, index) => (
//                       <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                         <TextField
//                           placeholder="Label"
//                           value={option.label || ""}
//                           onChange={(e) => handleOptionChange(index, "label", e.target.value)}
//                           size="small"
//                           sx={{ flex: 1 }}
//                         />
//                         <TextField
//                           placeholder="Value"
//                           value={option.value || ""}
//                           onChange={(e) => handleOptionChange(index, "value", e.target.value)}
//                           size="small"
//                           sx={{ flex: 1 }}
//                         />
//                         <IconButton color="error" onClick={() => handleDeleteOption(index)} size="small">
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     ))}
//                     <Button
//                       startIcon={<AddIcon />}
//                       onClick={handleAddOption}
//                       variant="outlined"
//                       sx={{ textTransform: "none" }}
//                     >
//                       Add Option
//                     </Button>
//                   </Stack>
//                 </Grid>
//               </>
//             )}

//             {/* Validation Rules */}
//             <Grid item xs={12}>
//               <Divider sx={{ my: 2 }} />
//               <Accordion>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                   <Typography variant="h6" fontWeight={600} color="primary.main">
//                     Validation Rules
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Grid container spacing={2}>
//                     {(fieldForm.fieldType === "text" || fieldForm.fieldType === "textarea") && (
//                       <>
//                         <Grid item xs={6}>
//                           <TextField
//                             fullWidth
//                             label="Min Length"
//                             type="number"
//                             value={fieldForm.validation.minLength}
//                             onChange={(e) => handleValidationChange("minLength", Number.parseInt(e.target.value) || "")}
//                             size="small"
//                           />
//                         </Grid>
//                         <Grid item xs={6}>
//                           <TextField
//                             fullWidth
//                             label="Max Length"
//                             type="number"
//                             value={fieldForm.validation.maxLength}
//                             onChange={(e) => handleValidationChange("maxLength", Number.parseInt(e.target.value) || "")}
//                             size="small"
//                           />
//                         </Grid>
//                       </>
//                     )}
//                     {(fieldForm.fieldType === "number" || fieldForm.fieldType === "currency") && (
//                       <>
//                         <Grid item xs={6}>
//                           <TextField
//                             fullWidth
//                             label="Min Value"
//                             type="number"
//                             value={fieldForm.validation.min}
//                             onChange={(e) => handleValidationChange("min", Number.parseInt(e.target.value) || "")}
//                             size="small"
//                           />
//                         </Grid>
//                         <Grid item xs={6}>
//                           <TextField
//                             fullWidth
//                             label="Max Value"
//                             type="number"
//                             value={fieldForm.validation.max}
//                             onChange={(e) => handleValidationChange("max", Number.parseInt(e.target.value) || "")}
//                             size="small"
//                           />
//                         </Grid>
//                       </>
//                     )}
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         label="Pattern (Regex)"
//                         value={fieldForm.validation.pattern}
//                         onChange={(e) => handleValidationChange("pattern", e.target.value)}
//                         placeholder="^[A-Za-z ]+$"
//                         size="small"
//                         helperText="Regular expression pattern for validation"
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         label="Custom Validation"
//                         value={fieldForm.validation.customValidation}
//                         onChange={(e) => handleValidationChange("customValidation", e.target.value)}
//                         placeholder="return value !== 'Test';"
//                         size="small"
//                         helperText="JavaScript expression for custom validation"
//                         multiline
//                         rows={2}
//                       />
//                     </Grid>
//                   </Grid>
//                 </AccordionDetails>
//               </Accordion>
//             </Grid>

//             {/* Conditional Logic */}
//             <Grid item xs={12}>
//               <Accordion>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                   <Typography variant="h6" fontWeight={600} color="primary.main">
//                     Conditional Logic
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={fieldForm.conditionalLogic.enabled}
//                             onChange={(e) => handleConditionalLogicChange("enabled", e.target.checked)}
//                           />
//                         }
//                         label="Enable conditional logic for this field"
//                       />
//                     </Grid>
//                     {fieldForm.conditionalLogic.enabled && (
//                       <>
//                         <Grid item xs={12}>
//                           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                             Show this field only when the following condition is met:
//                           </Typography>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <FormControl fullWidth size="small">
//                             <InputLabel>Field</InputLabel>
//                             <Select
//                               value={fieldForm.conditionalLogic.showIf.displayOrder}
//                               onChange={(e) => handleConditionalLogicChange("showIf.displayOrder", e.target.value)}
//                               label="Field"
//                             >
//                               {getAvailableFieldsForConditional().map((field) => (
//                                 <MenuItem key={field.displayOrder} value={field.displayOrder}>
//                                   {field.displayOrder}. {field.label}
//                                 </MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <FormControl fullWidth size="small">
//                             <InputLabel>Operator</InputLabel>
//                             <Select
//                               value={fieldForm.conditionalLogic.showIf.operator}
//                               onChange={(e) => handleConditionalLogicChange("showIf.operator", e.target.value)}
//                               label="Operator"
//                             >
//                               {conditionalOperators.map((op) => (
//                                 <MenuItem key={op.value} value={op.value}>
//                                   {op.label}
//                                 </MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <TextField
//                             fullWidth
//                             size="small"
//                             label="Value"
//                             value={fieldForm.conditionalLogic.showIf.value}
//                             onChange={(e) => handleConditionalLogicChange("showIf.value", e.target.value)}
//                             placeholder="Enter comparison value"
//                           />
//                         </Grid>
//                       </>
//                     )}
//                   </Grid>
//                 </AccordionDetails>
//               </Accordion>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
//           <Button onClick={handleCloseFieldDialog} variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={handleSaveField} variant="contained" disabled={!fieldForm.label}>
//             {editingField ? "Update Field" : "Add Field"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import {
//   Box,
//   Grid,
//   TextField,
//   Typography,
//   Paper,
//   Button,
//   MenuItem,
//   Select,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   Switch,
//   FormControlLabel,
//   Chip,
//   IconButton,
//   Stack,
//   Card,
//   CardContent,
//   Divider,
//   Alert,
//   Snackbar,
//   CircularProgress,
//   ListItemIcon,
//   ListItemText,
//   InputLabel,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Skeleton,
// } from "@mui/material"
// import {
//   KeyboardBackspace,
//   Save,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Close as CloseIcon,
//   TextFields as TextIcon,
//   Subject as TextAreaIcon,
//   ArrowDropDown as DropdownIcon,
//   RadioButtonChecked as RadioIcon,
//   CheckBox as CheckboxIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   AttachMoney as CurrencyIcon,
//   DateRange as DateIcon,
//   Schedule as DateTimeIcon,
//   AttachFile as FileIcon,
//   ExpandMore as ExpandMoreIcon,
//   Numbers as NumberIcon,
// } from "@mui/icons-material"
// import { useRouter } from "next/navigation"
// import axios from "axios"

// const fieldTypeIcons = {
//   text: { icon: TextIcon, color: "#555", label: "Text Field" },
//   textarea: { icon: TextAreaIcon, color: "#555", label: "Text Area" },
//   select: { icon: DropdownIcon, color: "#555", label: "Select Dropdown" },
//   multiselect: { icon: DropdownIcon, color: "#555", label: "Multi Select" },
//   radio: { icon: RadioIcon, color: "#555", label: "Radio Buttons" },
//   checkbox: { icon: CheckboxIcon, color: "#555", label: "Checkbox" },
//   email: { icon: EmailIcon, color: "#555", label: "Email Field" },
//   phone: { icon: PhoneIcon, color: "#555", label: "Phone Field" },
//   number: { icon: NumberIcon, color: "#555", label: "Number Field" },
//   currency: { icon: CurrencyIcon, color: "#555", label: "Currency Field" },
//   date: { icon: DateIcon, color: "#555", label: "Date Field" },
//   datetime: { icon: DateTimeIcon, color: "#555", label: "Date Time Field" },
//   file: { icon: FileIcon, color: "#555", label: "File Upload" },
// }

// const conditionalOperators = [
//   { value: "equals", label: "Equals" },
//   { value: "not_equals", label: "Not Equals" },
//   { value: "greater_than", label: "Greater Than" },
//   { value: "less_than", label: "Less Than" },
//   { value: "greater_than_equal", label: "Greater Than or Equal" },
//   { value: "less_than_equal", label: "Less Than or Equal" },
//   { value: "contains", label: "Contains" },
//   { value: "not_contains", label: "Does Not Contain" },
// ]

// export default function ExpenseTypeUpdate({ params }) {
//   const router = useRouter()
//   const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

//   // Loading states
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [expenseId, setExpenseId] = useState("")

//   // Data states
//   const [categories, setCategories] = useState([])
//   const [subCategoriesFilter, setSubCategoriesFilter] = useState([])
//   const [Workflows, setWorkflows] = useState([])

//   // Form states
//   const [ExpenseForm, setExpenseForm] = useState({
//     expenseTypeId: "",
//     systemCategoryId: "",
//     subcategoryId: "",
//     name: "",
//     description: "",
//     formId: "",
//     workflowId: "",
//     autoApproveConfig: false,
//   })

//   // Form Builder States
//   const [openFormDialog, setOpenFormDialog] = useState(false)
//   const [openFieldDialog, setOpenFieldDialog] = useState(false)
//   const [editingField, setEditingField] = useState(null)
//   const [editingFieldIndex, setEditingFieldIndex] = useState(-1)
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
//   const [hasCustomForm, setHasCustomForm] = useState(false)
//   const [createdFormName, setCreatedFormName] = useState("")

//   // Form Builder Data
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     fields: [],
//   })

//   // Field Form State
//   const [fieldForm, setFieldForm] = useState({
//     fieldName: "",
//     fieldType: "text",
//     label: "",
//     placeholder: "",
//     isRequired: false,
//     validation: {
//       minLength: "",
//       maxLength: "",
//       min: "",
//       max: "",
//       pattern: "",
//       customValidation: "",
//     },
//     displayOrder: 1,
//     defaultValue: "",
//     helpText: "",
//     options: [],
//     conditionalLogic: {
//       enabled: false,
//       showIf: {
//         displayOrder: "",
//         operator: "equals",
//         value: "",
//       },
//     },
//   })

//   // Add this state after other state declarations
//   const [originalFieldData, setOriginalFieldData] = useState(null)

//   // Extract expense ID from params
//   useEffect(() => {
//     const getParams = async () => {
//       try {
//         const resolvedParams = await Promise.resolve(params)
//         const { updateExpense } = resolvedParams
//         setExpenseId(updateExpense)
//       } catch (error) {
//         console.error("Error resolving params:", error)
//         showSnackbar("Error loading expense data", "error")
//       }
//     }
//     getParams()
//   }, [params])

//   // Fetch expense details
//   const fetchExpenseDetails = async (expenseId) => {
//     try {
//       setLoading(true)
//       const response = await axios.get(`${baseUrl}/v1/api/expenseType/${expenseId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })

//       const expenseData = response.data.items

//       // Set expense form data
//       setExpenseForm({
//         expenseTypeId: expenseData.expenseTypeId,
//         systemCategoryId: expenseData.systemCategoryId?.systemCategoryId || "",
//         subcategoryId: expenseData.subcategoryId?.subcategoryId || "",
//         name: expenseData.name,
//         description: expenseData.description,
//         formId: expenseData.formId?.formId || "",
//         workflowId: expenseData.workflowId?.workflowId || "",
//         autoApproveConfig: expenseData.autoApproveConfig || false,
//       })

//       // If there's a custom form, fetch its details
//       if (expenseData.formId?.formId) {
//         setHasCustomForm(true)
//         setCreatedFormName(expenseData.formId.name)
//         await fetchCustomFormDetails(expenseData.formId.formId)
//       }

//       // Load subcategories for the selected system category
//       if (expenseData.systemCategoryId?.systemCategoryId) {
//         await getAllSubCategoryFilter(expenseData.systemCategoryId.systemCategoryId)
//       }
//     } catch (error) {
//       console.error("Error fetching expense details:", error)
//       showSnackbar("Error loading expense details", "error")
//     } finally {
//       setLoading(false)
//     }
//   }

//     const getAllWorkflows = async () => {
//       try {
//         const res = await axios.get(`${baseUrl}/v1/api/workFlow/all`, {
//           headers: {
//             "Content-Type": "application/json",
//             authorization: token,
//           },
//         })
//         setWorkflows(res.data.items.workflows || [])
//       } catch (error) {
//         console.error("Error fetching workflows:", error)
//       }
//     }

//   // Fetch custom form details
//   const fetchCustomFormDetails = async (formId) => {
//     try {
//       const response = await axios.get(`${baseUrl}/v1/api/dynamicForm/${formId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })

//       const formDetails = response.data.items

//       setFormData({
//         name: formDetails.name || "",
//         description: formDetails.description || "",
//         fields: formDetails.fields || [],
//       })
//     } catch (error) {
//       console.error("Error fetching custom form details:", error)
//       showSnackbar("Error loading custom form details", "error")
//     }
//   }

//   // Fetch all categories
//   const getAllCategory = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/systemCategory`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       setCategories(res.data.items || [])
//     } catch (error) {
//       console.error("Error fetching categories:", error)
//     }
//   }

//   // Fetch subcategories based on system category
//   const getAllSubCategoryFilter = async (id) => {
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/subCategory?systemCategoryId=${id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       setSubCategoriesFilter(res.data.items?.subcategories || [])
//     } catch (error) {
//       console.error("Error fetching subcategories:", error)
//     }
//   }

//   // Handle form field changes
//   const handleExpenseFormChange = (field, value) => {
//     setExpenseForm((prev) => ({ ...prev, [field]: value }))
//   }

//   // Update expense
//   const handleUpdateExpense = async () => {
//     try {
//       setSaving(true)
//       const updateData = {
//         systemCategoryId: ExpenseForm.systemCategoryId,
//         subcategoryId: ExpenseForm.subcategoryId,
//         name: ExpenseForm.name,
//         description: ExpenseForm.description,
//         formId: ExpenseForm.formId,
//         workflowId: ExpenseForm.workflowId,
//         autoApproveConfig: ExpenseForm.autoApproveConfig,
//       }

//       await axios.put(`${baseUrl}/v1/api/expenseType/${ExpenseForm.expenseTypeId}`, updateData, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })

//       showSnackbar("Expense type updated successfully!")
//       setTimeout(() => {
//         router.push("/categories")
//       }, 1500)
//     } catch (error) {
//       console.error("Error updating expense:", error)
//       showSnackbar("Error updating expense type", "error")
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Snackbar functions
//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity })
//   }

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false })
//   }

//   // Form dialog functions
//   const handleOpenFormDialog = () => {
//     setOpenFormDialog(true)
//   }

//   const handleCloseFormDialog = (shouldReset = false) => {
//     setOpenFormDialog(false)
//     if (shouldReset && !hasCustomForm) {
//       setFormData({ name: "", description: "", fields: [] })
//     }
//   }

//   // Field dialog functions
//   const handleOpenFieldDialog = (field = null, index = -1) => {
//     if (field) {
//       setEditingField(field)
//       setEditingFieldIndex(index)
//       // Store original field data for comparison
//       setOriginalFieldData(field)

//       setFieldForm({
//         ...field,
//         // Ensure validation object exists with all properties
//         validation: {
//           minLength: field.validation?.minLength || "",
//           maxLength: field.validation?.maxLength || "",
//           min: field.validation?.min || "",
//           max: field.validation?.max || "",
//           pattern: field.validation?.pattern || "",
//           customValidation: field.validation?.customValidation || "",
//           ...field.validation, // Spread any existing validation properties
//         },
//         // Ensure conditionalLogic exists
//         conditionalLogic: {
//           enabled: field.conditionalLogic?.enabled || false,
//           showIf: {
//             displayOrder: field.conditionalLogic?.showIf?.displayOrder || "",
//             operator: field.conditionalLogic?.showIf?.operator || "equals",
//             value: field.conditionalLogic?.showIf?.value || "",
//             ...field.conditionalLogic?.showIf,
//           },
//           ...field.conditionalLogic,
//         },
//         // Ensure options array exists for select/radio fields
//         options: field.options || [],
//         // Ensure other properties have defaults
//         placeholder: field.placeholder || "",
//         helpText: field.helpText || "",
//         defaultValue: field.defaultValue || "",
//       })
//     } else {
//       setEditingField(null)
//       setEditingFieldIndex(-1)
//       setOriginalFieldData(null)
//       setFieldForm({
//         fieldName: "",
//         fieldType: "text",
//         label: "",
//         placeholder: "",
//         isRequired: false,
//         validation: {
//           minLength: "",
//           maxLength: "",
//           min: "",
//           max: "",
//           pattern: "",
//           customValidation: "",
//         },
//         displayOrder: formData.fields.length + 1,
//         defaultValue: "",
//         helpText: "",
//         options: [],
//         conditionalLogic: {
//           enabled: false,
//           showIf: {
//             displayOrder: "",
//             operator: "equals",
//             value: "",
//           },
//         },
//       })
//     }
//     setOpenFieldDialog(true)
//   }

//   const handleCloseFieldDialog = () => {
//     setOpenFieldDialog(false)
//     setEditingField(null)
//     setEditingFieldIndex(-1)
//     setOriginalFieldData(null) // Clear original data
//   }

//   // Field form change handlers
//   const handleFieldFormChange = (field, value) => {
//     if (field.includes(".")) {
//       const [parent, child] = field.split(".")
//       setFieldForm((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value,
//         },
//       }))
//     } else {
//       setFieldForm((prev) => ({ ...prev, [field]: value }))
//     }
//   }

//   const handleValidationChange = (validationType, value) => {
//     setFieldForm((prev) => ({
//       ...prev,
//       validation: {
//         ...prev.validation,
//         [validationType]: value,
//       },
//     }))
//   }

//   const handleConditionalLogicChange = (field, value) => {
//     if (field.includes(".")) {
//       const [parent, child] = field.split(".")
//       setFieldForm((prev) => ({
//         ...prev,
//         conditionalLogic: {
//           ...prev.conditionalLogic,
//           [parent]: {
//             ...prev.conditionalLogic[parent],
//             [child]: value,
//           },
//         },
//       }))
//     } else {
//       setFieldForm((prev) => ({
//         ...prev,
//         conditionalLogic: {
//           ...prev.conditionalLogic,
//           [field]: value,
//         },
//       }))
//     }
//   }

//   // Clean field data before saving
//   const cleanFieldData = (field) => {
//     const cleanedField = { ...field }

//     // Generate fieldName from label if not provided
//     if (!cleanedField.fieldName && cleanedField.label) {
//       cleanedField.fieldName = cleanedField.label
//         .toLowerCase()
//         .replace(/\s+/g, "")
//         .replace(/[^a-zA-Z0-9]/g, "")
//     }

//     // Handle validation object - preserve original structure and only update changed values
//     if (originalFieldData && originalFieldData.validation) {
//       // Start with original validation data
//       const mergedValidation = { ...originalFieldData.validation }

//       // Update only the fields that have actual values or have been explicitly changed
//       Object.entries(cleanedField.validation || {}).forEach(([key, value]) => {
//         if (value !== "" && value !== null && value !== undefined) {
//           mergedValidation[key] = value
//         } else if (originalFieldData.validation[key] !== undefined) {
//           // Keep original value if current is empty but original existed
//           mergedValidation[key] = originalFieldData.validation[key]
//         }
//       })

//       // Only include validation if there are actual validation rules
//       if (
//         Object.keys(mergedValidation).length > 0 &&
//         Object.values(mergedValidation).some((val) => val !== "" && val !== null && val !== undefined)
//       ) {
//         cleanedField.validation = mergedValidation
//       } else if (originalFieldData.validation) {
//         // Preserve original validation structure even if empty
//         cleanedField.validation = originalFieldData.validation
//       } else {
//         delete cleanedField.validation
//       }
//     } else {
//       // For new fields, clean validation normally
//       const cleanedValidation = {}
//       Object.entries(cleanedField.validation || {}).forEach(([key, value]) => {
//         if (value !== "" && value !== null && value !== undefined) {
//           cleanedValidation[key] = value
//         }
//       })
//       if (Object.keys(cleanedValidation).length > 0) {
//         cleanedField.validation = cleanedValidation
//       } else {
//         delete cleanedField.validation
//       }
//     }

//     // Clean placeholder for non-text fields
//     if (!["text", "textarea", "email", "phone"].includes(cleanedField.fieldType)) {
//       delete cleanedField.placeholder
//     }

//     // Clean options for non-option fields
//     if (!["select", "multiselect", "radio"].includes(cleanedField.fieldType)) {
//       delete cleanedField.options
//     }

//     // Handle conditional logic - preserve original structure
//     if (cleanedField.conditionalLogic?.enabled) {
//       cleanedField.conditionalLogic = {
//         showIf: {
//           displayOrder: cleanedField.conditionalLogic.showIf.displayOrder
//             ? Number.parseInt(cleanedField.conditionalLogic.showIf.displayOrder)
//             : originalFieldData?.conditionalLogic?.showIf?.displayOrder || null,
//           operator:
//             cleanedField.conditionalLogic.showIf.operator ||
//             originalFieldData?.conditionalLogic?.showIf?.operator ||
//             "equals",
//           value: cleanedField.conditionalLogic.showIf.value || originalFieldData?.conditionalLogic?.showIf?.value || "",
//         },
//       }
//     } else if (originalFieldData?.conditionalLogic && !cleanedField.conditionalLogic?.enabled) {
//       // If original had conditional logic but now it's disabled, preserve the structure but mark as disabled
//       cleanedField.conditionalLogic = {
//         ...originalFieldData.conditionalLogic,
//         enabled: false,
//       }
//     } else if (!cleanedField.conditionalLogic?.enabled) {
//       delete cleanedField.conditionalLogic
//     }

//     // Convert displayOrder to number
//     cleanedField.displayOrder = Number.parseInt(cleanedField.displayOrder)

//     // Handle defaultValue based on field type
//     if (cleanedField.fieldType === "multiselect" && typeof cleanedField.defaultValue === "string") {
//       cleanedField.defaultValue = cleanedField.defaultValue.split(",").map((v) => v.trim())
//     }

//     // Preserve other original field properties that might exist
//     if (originalFieldData) {
//       // Preserve fieldId if it exists
//       if (originalFieldData.fieldId) {
//         cleanedField.fieldId = originalFieldData.fieldId
//       }

//       // Preserve isActive if it exists
//       if (originalFieldData.isActive !== undefined) {
//         cleanedField.isActive = originalFieldData.isActive
//       }

//       // Preserve any other properties that might be needed
//       Object.keys(originalFieldData).forEach((key) => {
//         if (!cleanedField.hasOwnProperty(key) && !["validation", "conditionalLogic", "options"].includes(key)) {
//           cleanedField[key] = originalFieldData[key]
//         }
//       })
//     }

//     return cleanedField
//   }

//   // Save field
//   const handleSaveField = () => {
//     const cleanedField = cleanFieldData(fieldForm)

//     if (editingFieldIndex >= 0) {
//       const updatedFields = [...formData.fields]
//       updatedFields[editingFieldIndex] = cleanedField
//       setFormData((prev) => ({ ...prev, fields: updatedFields }))
//     } else {
//       setFormData((prev) => ({ ...prev, fields: [...prev.fields, cleanedField] }))
//     }

//     handleCloseFieldDialog()
//     showSnackbar(editingFieldIndex >= 0 ? "Field updated successfully" : "Field added successfully")
//   }

//   // Delete field
//   const handleDeleteField = (index) => {
//     const updatedFields = formData.fields.filter((_, i) => i !== index)
//     const reorderedFields = updatedFields.map((field, idx) => ({
//       ...field,
//       displayOrder: idx + 1,
//     }))
//     setFormData((prev) => ({ ...prev, fields: reorderedFields }))
//     showSnackbar("Field deleted successfully")
//   }

//   // Save form
//   const handleSaveForm = async () => {
//     if (!formData.name.trim()) {
//       showSnackbar("Please enter a form name", "error")
//       return
//     }
//     if (formData.fields.length === 0) {
//       showSnackbar("Please add at least one field to the form", "error")
//       return
//     }

//     try {
//       setSaving(true)

//       if (hasCustomForm && ExpenseForm.formId) {
//         // Update existing form
//         await axios.put(`${baseUrl}/v1/api/dynamicForm/${ExpenseForm.formId}`, formData, {
//           headers: {
//             "Content-Type": "application/json",
//             authorization: token,
//           },
//         })
//         showSnackbar("Custom form updated successfully!")
//       } else {
//         // Create new form
//         const response = await axios.post(`${baseUrl}/v1/api/dynamicForm`, formData, {
//           headers: {
//             "Content-Type": "application/json",
//             authorization: token,
//           },
//         })

//         if (response.data) {
//           const formId = response.data.items?.formId || response.data._id || response.data.id
//           setExpenseForm((prev) => ({ ...prev, formId: formId }))
//           setHasCustomForm(true)
//           setCreatedFormName(formData.name)
//           showSnackbar("Custom form created successfully!")
//         }
//       }

//       handleCloseFormDialog(false)
//     } catch (error) {
//       console.error("Error saving form:", error)
//       showSnackbar(hasCustomForm ? "Error updating form" : "Error creating form", "error")
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Remove custom form
//   const handleRemoveCustomForm = () => {
//     if (window.confirm("Are you sure you want to remove this custom form? This action cannot be undone.")) {
//       setHasCustomForm(false)
//       setCreatedFormName("")
//       setExpenseForm((prev) => ({ ...prev, formId: "" }))
//       setFormData({ name: "", description: "", fields: [] })
//       showSnackbar("Custom form removed")
//     }
//   }

//   // Option handlers
//   const handleAddOption = () => {
//     setFieldForm((prev) => ({
//       ...prev,
//       options: [...(prev.options || []), { label: "", value: "" }],
//     }))
//   }

//   const handleOptionChange = (index, field, value) => {
//     const newOptions = [...(fieldForm.options || [])]
//     newOptions[index] = { ...newOptions[index], [field]: value }
//     setFieldForm((prev) => ({ ...prev, options: newOptions }))
//   }

//   const handleDeleteOption = (index) => {
//     const newOptions = [...(fieldForm.options || [])]
//     newOptions.splice(index, 1)
//     setFieldForm((prev) => ({ ...prev, options: newOptions }))
//   }

//   // Get available fields for conditional logic
//   const getAvailableFieldsForConditional = () => {
//     return formData.fields
//       .filter((field, index) => index !== editingFieldIndex)
//       .map((field) => ({
//         displayOrder: field.displayOrder,
//         label: field.label,
//         fieldType: field.fieldType,
//       }))
//   }

//   // Initialize data
//   useEffect(() => {
//     getAllCategory()
//     getAllWorkflows()
//   }, [])

//   useEffect(() => {
//     if (ExpenseForm?.systemCategoryId) {
//       getAllSubCategoryFilter(ExpenseForm.systemCategoryId)
//     }
//   }, [ExpenseForm?.systemCategoryId])

//   useEffect(() => {
//     if (expenseId) {
//       fetchExpenseDetails(expenseId)
//     }
//   }, [expenseId])

//   if (loading) {
//     return (
//       <Box sx={{ p: 3, bgcolor: "#f9f9fb", minHeight: "100vh" }}>
//         <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
//           <Skeleton variant="text" width="40%" height={40} />
//           <Skeleton variant="text" width="60%" height={20} />
//         </Paper>
//         <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
//           <Grid container spacing={3}>
//             {[...Array(6)].map((_, index) => (
//               <Grid item xs={12} sm={6} key={index}>
//                 <Skeleton variant="text" width="30%" height={20} />
//                 <Skeleton variant="rectangular" width="100%" height={56} />
//               </Grid>
//             ))}
//           </Grid>
//         </Paper>
//       </Box>
//     )
//   }

//   return (
//     <Box sx={{ p: 3, bgcolor: "#f9f9fb", minHeight: "100vh" }}>
//       {/* Header */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 4,
//           borderRadius: 3,
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           color: "white",
//           position: "relative",
//           overflow: "hidden",
//           border: "1px solid rgba(255, 255, 255, 0.1)",
//         }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Box>
//             <Typography variant="h4" fontWeight={600} sx={{ color: "white", mb: "-5px" }}>
//               Update Expense Type
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
//               Update expense type: {ExpenseForm.name}
//             </Typography>
//           </Box>
//           <Button
//             sx={{
//               borderRadius: "20px",
//               border: "1px solid rgba(255, 255, 255, 0.5)",
//               color: "white",
//               "&:hover": {
//                 borderColor: "rgba(255, 255, 255, 0.7)",
//                 bgcolor: "rgba(255, 255, 255, 0.1)",
//               },
//             }}
//             variant="outlined"
//             onClick={() => router.push("/employeeSetup/NewExpensesDetails/Category")}
//           >
//             <KeyboardBackspace sx={{ fontSize: 18 }} />
//           </Button>
//         </Box>
//       </Paper>

//       {/* Form Content */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 4,
//           borderRadius: 2,
//           bgcolor: "white",
//           border: "1px solid #EAECF0",
//         }}
//       >
//         <Grid container spacing={3}>
//           {/* System Category & Sub Category */}
//           <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Select System Category
//             </Typography>
//             <Select
//               fullWidth
//               value={ExpenseForm.systemCategoryId}
//               onChange={(e) => handleExpenseFormChange("systemCategoryId", e.target.value)}
//               displayEmpty
//             >
//               <MenuItem value="" disabled>
//                 Select System Category
//               </MenuItem>
//               {categories.map((cat) => (
//                 <MenuItem key={cat._id} value={cat.systemCategoryId}>
//                   {cat.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Select Sub Category
//             </Typography>
//             <Select
//               fullWidth
//               value={ExpenseForm.subcategoryId}
//               onChange={(e) => handleExpenseFormChange("subcategoryId", e.target.value)}
//               displayEmpty
//               disabled={!ExpenseForm.systemCategoryId}
//             >
//               <MenuItem value="" disabled>
//                 Select Sub Category
//               </MenuItem>
//               {subCategoriesFilter.map((cat) => (
//                 <MenuItem key={cat._id} value={cat.subcategoryId}>
//                   {cat.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Grid>

//           {/* Expense Type Name */}
//           <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Expense Type Name
//             </Typography>
//             <TextField
//               fullWidth
//               placeholder="Enter Expense Type Name"
//               value={ExpenseForm.name}
//               onChange={(e) => handleExpenseFormChange("name", e.target.value)}
//             />
//           </Grid>

//           {/* Approval Flow */}
//           <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Select Approval Flow
//             </Typography>
//             <Select
//               fullWidth
//               value={ExpenseForm.workflowId}
//               onChange={(e) => handleExpenseFormChange("workflowId", e.target.value)}
//               displayEmpty
//             >
//               <MenuItem value="" disabled>
//                 Select Approval Flow
//               </MenuItem>
//               {Workflows.map((cat) => (
//                   <MenuItem key={cat.workflowId} value={cat.workflowId}>
//                     {cat.name}
//                   </MenuItem>
//                 ))}
//             </Select>
//           </Grid>

//           {/* Description */}
//           <Grid item xs={12} sm={12}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Description
//             </Typography>
//             <TextField
//               fullWidth
//               placeholder="Write Description"
//               multiline
//               rows={3}
//               value={ExpenseForm.description}
//               onChange={(e) => handleExpenseFormChange("description", e.target.value)}
//             />
//           </Grid>

//           {/* Custom Form Section */}
//           <Grid item xs={12}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Custom Form
//             </Typography>
//             {hasCustomForm ? (
//               <Card variant="outlined" sx={{ bgcolor: "#f8f9fa" }}>
//                 <CardContent>
//                   <Stack direction="row" justifyContent="space-between" alignItems="center">
//                     <Box>
//                       <Typography variant="subtitle1" fontWeight={500} color="success.main">
//                         ✓ Custom Form Attached
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {createdFormName} ({formData.fields.length} fields)
//                       </Typography>
//                     </Box>
//                     <Stack direction="row" spacing={1}>
//                       <Button
//                         variant="outlined"
//                         size="small"
//                         onClick={handleOpenFormDialog}
//                         sx={{ textTransform: "none" }}
//                       >
//                         Edit Form
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         size="small"
//                         color="error"
//                         onClick={handleRemoveCustomForm}
//                         sx={{ textTransform: "none" }}
//                       >
//                         Remove
//                       </Button>
//                     </Stack>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card variant="outlined" sx={{ bgcolor: "#f8f9fa" }}>
//                 <CardContent sx={{ textAlign: "center", py: 3 }}>
//                   <Typography variant="body1" color="text.secondary" gutterBottom>
//                     No custom form attached
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Create a custom form to collect additional information for this expense type
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={handleOpenFormDialog}
//                     sx={{
//                       textTransform: "none",
//                       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                     }}
//                   >
//                     Create Custom Form
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </Grid>

//           {/* Auto Approve Config */}
//           {/* <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Auto Approve Configuration
//             </Typography>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={ExpenseForm.autoApproveConfig}
//                   onChange={(e) => handleExpenseFormChange("autoApproveConfig", e.target.checked)}
//                 />
//               }
//               label="Enable auto approval for this expense type"
//             />
//           </Grid> */}
//         </Grid>

//         {/* Action Buttons */}
//         <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
//           <Button variant="outlined" onClick={() => router.push("/categories")} sx={{ minWidth: 120 }}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleUpdateExpense}
//             startIcon={saving ? <CircularProgress size={16} /> : <Save />}
//             disabled={saving}
//             sx={{
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               minWidth: 120,
//             }}
//           >
//             {saving ? "Updating..." : "Update Expense"}
//           </Button>
//         </Box>
//       </Paper>

//       {/* Form Builder Dialog - Same as create form */}
//       <Dialog open={openFormDialog} onClose={handleCloseFormDialog} maxWidth="lg" fullWidth>
//         <DialogTitle
//           sx={{
//             bgcolor: "grey.50",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6" fontWeight={500}>
//             {hasCustomForm ? "Edit Custom Form" : "Create Custom Form"}
//           </Typography>
//           <IconButton onClick={handleCloseFormDialog}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ p: 3 }}>
//           <Grid container spacing={3}>
//             {/* Left Side - Form Configuration */}
//             <Grid item xs={12} md={8}>
//               <Stack spacing={3}>
//                 <TextField
//                   fullWidth
//                   label="Form Name"
//                   value={formData.name}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   label="Form Description"
//                   value={formData.description}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                   multiline
//                   rows={2}
//                 />
//                 <Divider />
//                 <Box>
//                   <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//                     <Typography variant="h6" fontWeight={500}>
//                       Form Fields ({formData.fields.length})
//                     </Typography>
//                     <Button
//                       variant="outlined"
//                       startIcon={<AddIcon />}
//                       onClick={() => handleOpenFieldDialog()}
//                       sx={{ textTransform: "none" }}
//                     >
//                       Add Field
//                     </Button>
//                   </Stack>
//                   {formData.fields.length > 0 ? (
//                     <Stack spacing={2}>
//                       {formData.fields
//                         .sort((a, b) => a.displayOrder - b.displayOrder)
//                         .map((field, index) => {
//                           const fieldTypeConfig = fieldTypeIcons[field.fieldType]
//                           const IconComponent = fieldTypeConfig?.icon || TextIcon
//                           return (
//                             <Card key={index} variant="outlined">
//                               <CardContent sx={{ p: 2 }}>
//                                 <Stack direction="row" spacing={2} alignItems="center">
//                                   <Box
//                                     sx={{
//                                       display: "flex",
//                                       alignItems: "center",
//                                       justifyContent: "center",
//                                       width: 24,
//                                       height: 24,
//                                       borderRadius: "50%",
//                                       bgcolor: "primary.main",
//                                       color: "white",
//                                       fontSize: "0.75rem",
//                                       fontWeight: "bold",
//                                     }}
//                                   >
//                                     {field.displayOrder}
//                                   </Box>
//                                   <IconComponent sx={{ color: "text.secondary" }} />
//                                   <Box sx={{ flexGrow: 1 }}>
//                                     <Stack direction="row" spacing={1} alignItems="center">
//                                       <Typography variant="subtitle1" fontWeight={500}>
//                                         {field.label}
//                                       </Typography>
//                                       {field.isRequired && (
//                                         <Chip label="Required" size="small" color="error" variant="outlined" />
//                                       )}
//                                       <Chip
//                                         label={fieldTypeConfig?.label}
//                                         size="small"
//                                         variant="outlined"
//                                         sx={{ fontSize: "0.7rem" }}
//                                       />
//                                       {field.conditionalLogic && (
//                                         <Chip label="Conditional" size="small" color="info" variant="outlined" />
//                                       )}
//                                     </Stack>
//                                     {field.helpText && (
//                                       <Typography variant="body2" color="text.secondary">
//                                         {field.helpText}
//                                       </Typography>
//                                     )}
//                                   </Box>
//                                   <Stack direction="row" spacing={1}>
//                                     <IconButton size="small" onClick={() => handleOpenFieldDialog(field, index)}>
//                                       <EditIcon fontSize="small" />
//                                     </IconButton>
//                                     <IconButton size="small" onClick={() => handleDeleteField(index)}>
//                                       <DeleteIcon fontSize="small" color="error" />
//                                     </IconButton>
//                                   </Stack>
//                                 </Stack>
//                               </CardContent>
//                             </Card>
//                           )
//                         })}
//                     </Stack>
//                   ) : (
//                     <Paper variant="outlined" sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
//                       <Typography variant="body1" color="text.secondary" gutterBottom>
//                         No fields added yet
//                       </Typography>
//                       <Button
//                         variant="outlined"
//                         startIcon={<AddIcon />}
//                         onClick={() => handleOpenFieldDialog()}
//                         sx={{ textTransform: "none" }}
//                       >
//                         Add Your First Field
//                       </Button>
//                     </Paper>
//                   )}
//                 </Box>
//               </Stack>
//             </Grid>
//             {/* Right Side - Preview */}
//             <Grid item xs={12} md={4}>
//               <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
//                 <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
//                   Form Preview
//                 </Typography>
//                 <Card variant="outlined">
//                   <CardContent>
//                     <Typography variant="h6" gutterBottom>
//                       {formData.name || "Form Name"}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" gutterBottom>
//                       {formData.description || "Form description will appear here"}
//                     </Typography>
//                     {formData.fields.length > 0 ? (
//                       <Stack spacing={2} sx={{ mt: 2 }}>
//                         {formData.fields
//                           .sort((a, b) => a.displayOrder - b.displayOrder)
//                           .slice(0, 3)
//                           .map((field, index) => (
//                             <Box key={index}>
//                               <Typography variant="subtitle2" gutterBottom>
//                                 {field.displayOrder}. {field.label}
//                                 {field.isRequired && <span style={{ color: "red" }}> *</span>}
//                               </Typography>
//                               <TextField
//                                 fullWidth
//                                 size="small"
//                                 placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
//                                 disabled
//                               />
//                             </Box>
//                           ))}
//                         {formData.fields.length > 3 && (
//                           <Typography variant="body2" color="text.secondary" textAlign="center">
//                             ... and {formData.fields.length - 3} more fields
//                           </Typography>
//                         )}
//                       </Stack>
//                     ) : (
//                       <Typography variant="body2" color="text.secondary">
//                         Add fields to see preview
//                       </Typography>
//                     )}
//                   </CardContent>
//                 </Card>
//               </Box>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
//           <Button onClick={() => handleCloseFormDialog(false)}>Cancel</Button>
//           <Button
//             onClick={handleSaveForm}
//             variant="contained"
//             disabled={!formData.name || formData.fields.length === 0 || saving}
//             startIcon={saving ? <CircularProgress size={16} /> : <Save />}
//           >
//             {saving ? "Saving..." : hasCustomForm ? "Update Form" : "Create Form"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Field Builder Dialog - Same as create form */}
//       <Dialog open={openFieldDialog} onClose={handleCloseFieldDialog} maxWidth="lg" fullWidth>
//         <DialogTitle
//           sx={{
//             bgcolor: "white",
//             borderBottom: "1px solid #f0f0f0",
//             py: 3,
//             px: 3,
//           }}
//         >
//           <Stack direction="row" justifyContent="space-between" alignItems="center">
//             <Box>
//               <Typography variant="h6" fontWeight={600} color="text.primary">
//                 {editingField ? "Edit Field" : "Add New Field"}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                 Configure the field properties, validation rules, and conditional logic
//               </Typography>
//             </Box>
//             <IconButton onClick={handleCloseFieldDialog}>
//               <CloseIcon />
//             </IconButton>
//           </Stack>
//         </DialogTitle>
//         <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto" }}>
//           <Grid container spacing={3}>
//             {/* Basic Information */}
//             <Grid item xs={12}>
//               <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
//                 Basic Information
//               </Typography>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Field Label *
//               </Typography>
//               <TextField
//                 fullWidth
//                 value={fieldForm.label}
//                 onChange={(e) => handleFieldFormChange("label", e.target.value)}
//                 placeholder="Enter field label"
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Field Name
//               </Typography>
//               <TextField
//                 fullWidth
//                 value={fieldForm.fieldName}
//                 onChange={(e) => handleFieldFormChange("fieldName", e.target.value)}
//                 placeholder="Auto-generated from label"
//                 helperText="Used as the field identifier in the form data"
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Field Type
//               </Typography>
//               <FormControl fullWidth>
//                 <Select
//                   value={fieldForm.fieldType}
//                   onChange={(e) => handleFieldFormChange("fieldType", e.target.value)}
//                   renderValue={(selected) => {
//                     const config = fieldTypeIcons[selected]
//                     const IconComponent = config?.icon || TextIcon
//                     return (
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                         <IconComponent sx={{ color: "primary.main", fontSize: 20 }} />
//                         <Typography fontWeight={500}>{config?.label || selected}</Typography>
//                       </Box>
//                     )
//                   }}
//                 >
//                   {Object.entries(fieldTypeIcons).map(([type, config]) => {
//                     const IconComponent = config.icon
//                     return (
//                       <MenuItem key={type} value={type} sx={{ py: 1.5 }}>
//                         <ListItemIcon sx={{ minWidth: 36 }}>
//                           <IconComponent sx={{ color: "primary.main" }} />
//                         </ListItemIcon>
//                         <ListItemText primary={config.label} />
//                       </MenuItem>
//                     )
//                   })}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Display Order
//               </Typography>
//               <TextField
//                 fullWidth
//                 type="number"
//                 value={fieldForm.displayOrder}
//                 onChange={(e) => handleFieldFormChange("displayOrder", Number.parseInt(e.target.value) || 1)}
//                 inputProps={{ min: 1 }}
//                 helperText="Order in which this field appears in the form"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Help Text
//               </Typography>
//               <TextField
//                 fullWidth
//                 value={fieldForm.helpText}
//                 onChange={(e) => handleFieldFormChange("helpText", e.target.value)}
//                 placeholder="Enter help text (optional)"
//                 multiline
//                 rows={2}
//               />
//             </Grid>
//             {["text", "textarea", "email", "phone"].includes(fieldForm.fieldType) && (
//               <Grid item xs={12} md={6}>
//                 <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                   Placeholder Text
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   value={fieldForm.placeholder || ""}
//                   onChange={(e) => handleFieldFormChange("placeholder", e.target.value)}
//                   placeholder="Enter placeholder text"
//                 />
//               </Grid>
//             )}
//             <Grid item xs={12} md={6}>
//               <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
//                 Default Value
//               </Typography>
//               <TextField
//                 fullWidth
//                 value={fieldForm.defaultValue}
//                 onChange={(e) => handleFieldFormChange("defaultValue", e.target.value)}
//                 placeholder="Enter default value (optional)"
//                 helperText={
//                   fieldForm.fieldType === "multiselect"
//                     ? "For multiselect, use comma-separated values"
//                     : "Default value for this field"
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={fieldForm.isRequired}
//                     onChange={(e) => handleFieldFormChange("isRequired", e.target.checked)}
//                   />
//                 }
//                 label="Required field"
//               />
//             </Grid>

//             {/* Options for select, multiselect, radio */}
//             {["select", "multiselect", "radio"].includes(fieldForm.fieldType) && (
//               <>
//                 <Grid item xs={12}>
//                   <Divider sx={{ my: 2 }} />
//                   <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
//                     Options
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Stack spacing={2}>
//                     {(fieldForm.options || []).map((option, index) => (
//                       <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                         <TextField
//                           placeholder="Label"
//                           value={option.label || ""}
//                           onChange={(e) => handleOptionChange(index, "label", e.target.value)}
//                           size="small"
//                           sx={{ flex: 1 }}
//                         />
//                         <TextField
//                           placeholder="Value"
//                           value={option.value || ""}
//                           onChange={(e) => handleOptionChange(index, "value", e.target.value)}
//                           size="small"
//                           sx={{ flex: 1 }}
//                         />
//                         <IconButton color="error" onClick={() => handleDeleteOption(index)} size="small">
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     ))}
//                     <Button
//                       startIcon={<AddIcon />}
//                       onClick={handleAddOption}
//                       variant="outlined"
//                       sx={{ textTransform: "none" }}
//                     >
//                       Add Option
//                     </Button>
//                   </Stack>
//                 </Grid>
//               </>
//             )}

//             {/* Validation Rules */}
//             <Grid item xs={12}>
//               <Divider sx={{ my: 2 }} />
//               <Accordion>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                   <Typography variant="h6" fontWeight={600} color="primary.main">
//                     Validation Rules
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Grid container spacing={2}>
//                     {(fieldForm.fieldType === "text" || fieldForm.fieldType === "textarea") && (
//                       <>
//                         <Grid item xs={6}>
//                           <TextField
//                             fullWidth
//                             label="Min Length"
//                             type="number"
//                             value={fieldForm.validation.minLength}
//                             onChange={(e) => handleValidationChange("minLength", Number.parseInt(e.target.value) || "")}
//                             size="small"
//                           />
//                         </Grid>
//                         <Grid item xs={6}>
//                           <TextField
//                             fullWidth
//                             label="Max Length"
//                             type="number"
//                             value={fieldForm.validation.maxLength}
//                             onChange={(e) => handleValidationChange("maxLength", Number.parseInt(e.target.value) || "")}
//                             size="small"
//                           />
//                         </Grid>
//                       </>
//                     )}
//                     {(fieldForm.fieldType === "number" || fieldForm.fieldType === "currency") && (
//                       <>
//                         <Grid item xs={6}>
//                           <TextField
//                             fullWidth
//                             label="Min Value"
//                             type="number"
//                             value={fieldForm.validation.min}
//                             onChange={(e) => handleValidationChange("min", Number.parseInt(e.target.value) || "")}
//                             size="small"
//                           />
//                         </Grid>
//                         <Grid item xs={6}>
//                           <TextField
//                             fullWidth
//                             label="Max Value"
//                             type="number"
//                             value={fieldForm.validation.max}
//                             onChange={(e) => handleValidationChange("max", Number.parseInt(e.target.value) || "")}
//                             size="small"
//                           />
//                         </Grid>
//                       </>
//                     )}
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         label="Pattern (Regex)"
//                         value={fieldForm.validation.pattern}
//                         onChange={(e) => handleValidationChange("pattern", e.target.value)}
//                         placeholder="^[A-Za-z ]+$"
//                         size="small"
//                         helperText="Regular expression pattern for validation"
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         label="Custom Validation"
//                         value={fieldForm.validation.customValidation}
//                         onChange={(e) => handleValidationChange("customValidation", e.target.value)}
//                         placeholder="return value !== 'Test';"
//                         size="small"
//                         helperText="JavaScript expression for custom validation"
//                         multiline
//                         rows={2}
//                       />
//                     </Grid>
//                   </Grid>
//                 </AccordionDetails>
//               </Accordion>
//             </Grid>

//             {/* Conditional Logic */}
//             <Grid item xs={12}>
//               <Accordion>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                   <Typography variant="h6" fontWeight={600} color="primary.main">
//                     Conditional Logic
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={fieldForm.conditionalLogic.enabled}
//                             onChange={(e) => handleConditionalLogicChange("enabled", e.target.checked)}
//                           />
//                         }
//                         label="Enable conditional logic for this field"
//                       />
//                     </Grid>
//                     {fieldForm.conditionalLogic.enabled && (
//                       <>
//                         <Grid item xs={12}>
//                           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                             Show this field only when the following condition is met:
//                           </Typography>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <FormControl fullWidth size="small">
//                             <InputLabel>Field</InputLabel>
//                             <Select
//                               value={fieldForm.conditionalLogic.showIf.displayOrder}
//                               onChange={(e) => handleConditionalLogicChange("showIf.displayOrder", e.target.value)}
//                               label="Field"
//                             >
//                               {getAvailableFieldsForConditional().map((field) => (
//                                 <MenuItem key={field.displayOrder} value={field.displayOrder}>
//                                   {field.displayOrder}. {field.label}
//                                 </MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <FormControl fullWidth size="small">
//                             <InputLabel>Operator</InputLabel>
//                             <Select
//                               value={fieldForm.conditionalLogic.showIf.operator}
//                               onChange={(e) => handleConditionalLogicChange("showIf.operator", e.target.value)}
//                               label="Operator"
//                             >
//                               {conditionalOperators.map((op) => (
//                                 <MenuItem key={op.value} value={op.value}>
//                                   {op.label}
//                                 </MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <TextField
//                             fullWidth
//                             size="small"
//                             label="Value"
//                             value={fieldForm.conditionalLogic.showIf.value}
//                             onChange={(e) => handleConditionalLogicChange("showIf.value", e.target.value)}
//                             placeholder="Enter comparison value"
//                           />
//                         </Grid>
//                       </>
//                     )}
//                   </Grid>
//                 </AccordionDetails>
//               </Accordion>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
//           <Button onClick={handleCloseFieldDialog} variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={handleSaveField} variant="contained" disabled={!fieldForm.label}>
//             {editingField ? "Update Field" : "Add Field"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }

"use client"
import { useState, useEffect } from "react"
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Button,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Stack,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material"
import {
  KeyboardBackspace,
  Save,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  TextFields as TextIcon,
  Subject as TextAreaIcon,
  ArrowDropDown as DropdownIcon,
  RadioButtonChecked as RadioIcon,
  CheckBox as CheckboxIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AttachMoney as CurrencyIcon,
  DateRange as DateIcon,
  Schedule as DateTimeIcon,
  AttachFile as FileIcon,
  ExpandMore as ExpandMoreIcon,
  Numbers as NumberIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import axios from "axios"

const fieldTypeIcons = {
  text: { icon: TextIcon, color: "#555", label: "Text Field" },
  textarea: { icon: TextAreaIcon, color: "#555", label: "Text Area" },
  select: { icon: DropdownIcon, color: "#555", label: "Select Dropdown" },
  multiselect: { icon: DropdownIcon, color: "#555", label: "Multi Select" },
  radio: { icon: RadioIcon, color: "#555", label: "Radio Buttons" },
  checkbox: { icon: CheckboxIcon, color: "#555", label: "Checkbox" },
  email: { icon: EmailIcon, color: "#555", label: "Email Field" },
  phone: { icon: PhoneIcon, color: "#555", label: "Phone Field" },
  number: { icon: NumberIcon, color: "#555", label: "Number Field" },
  currency: { icon: CurrencyIcon, color: "#555", label: "Currency Field" },
  date: { icon: DateIcon, color: "#555", label: "Date Field" },
  datetime: { icon: DateTimeIcon, color: "#555", label: "Date Time Field" },
  file: { icon: FileIcon, color: "#555", label: "File Upload" },
}

const conditionalOperators = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  { value: "greater_than_equal", label: "Greater Than or Equal" },
  { value: "less_than_equal", label: "Less Than or Equal" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does Not Contain" },
]

export default function ExpenseTypeUpdate({ params }) {
  const router = useRouter()
  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  // Loading states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expenseId, setExpenseId] = useState("")

  // Data states
  const [categories, setCategories] = useState([])
  const [subCategoriesFilter, setSubCategoriesFilter] = useState([])
  const [Workflows, setWorkflows] = useState([])

  // Auto-approve configuration states
  const [autoApproveData, setAutoApproveData] = useState(null)
  const [configValues, setConfigValues] = useState({})
  const [loadingAutoApprove, setLoadingAutoApprove] = useState(false)

  // Form states
  const [ExpenseForm, setExpenseForm] = useState({
    expenseTypeId: "",
    systemCategoryId: "",
    subcategoryId: "",
    name: "",
    description: "",
    formId: "",
    workflowId: "",
    autoApproveConfig: false,
  })

  // Form Builder States
  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [openFieldDialog, setOpenFieldDialog] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [editingFieldIndex, setEditingFieldIndex] = useState(-1)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [hasCustomForm, setHasCustomForm] = useState(false)
  const [createdFormName, setCreatedFormName] = useState("")

  // Form Builder Data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fields: [],
  })

  // Field Form State
  const [fieldForm, setFieldForm] = useState({
    fieldName: "",
    fieldType: "text",
    label: "",
    placeholder: "",
    isRequired: false,
    validation: {
      minLength: "",
      maxLength: "",
      min: "",
      max: "",
      pattern: "",
      customValidation: "",
    },
    displayOrder: 1,
    defaultValue: "",
    helpText: "",
    options: [],
    conditionalLogic: {
      enabled: false,
      showIf: {
        displayOrder: "",
        operator: "equals",
        value: "",
      },
    },
  })

  // Add this state after other state declarations
  const [originalFieldData, setOriginalFieldData] = useState(null)

  // Extract expense ID from params
  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await Promise.resolve(params)
        const { updateExpense } = resolvedParams
        setExpenseId(updateExpense)
      } catch (error) {
        console.error("Error resolving params:", error)
        showSnackbar("Error loading expense data", "error")
      }
    }
    getParams()
  }, [params])

  // New function to fetch auto-approve configuration
  const getAutoApproveConfig = async (categoryId) => {
    try {
      setLoadingAutoApprove(true)
      const res = await axios.get(`${baseUrl}/v1/api/systemCategory/${categoryId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      if (res.data.status && res.data.items) {
        setAutoApproveData(res.data.items)
        showSnackbar("Auto-approve configuration loaded successfully!")
      }
    } catch (error) {
      console.error("Error fetching auto-approve config:", error)
      showSnackbar("Error loading auto-approve configuration", "error")
      setAutoApproveData(null)
    } finally {
      setLoadingAutoApprove(false)
    }
  }

  const handleConfigValueChange = (key, value) => {
    setConfigValues((prev) => ({ ...prev, [key]: value }))
  }

  const renderConfigField = (configItem) => {
    const { key, type, options = [] } = configItem
    const value = configValues[key] || ""

    switch (type.toLowerCase()) {
      case "number":
        return (
          <TextField
            fullWidth
            type="number"
            label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            value={value}
            onChange={(e) => handleConfigValueChange(key, Number.parseInt(e.target.value) || 0)}
            size="small"
          />
        )

      case "boolean":
        return (
          <FormControlLabel
            control={
              <Switch checked={Boolean(value)} onChange={(e) => handleConfigValueChange(key, e.target.checked)} />
            }
            label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
          />
        )

      case "checkbox":
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </FormLabel>
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={Array.isArray(value) ? value.includes(option) : false}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : []
                      if (e.target.checked) {
                        handleConfigValueChange(key, [...currentValues, option])
                      } else {
                        handleConfigValueChange(
                          key,
                          currentValues.filter((v) => v !== option),
                        )
                      }
                    }}
                  />
                }
                label={option}
              />
            ))}
          </FormControl>
        )

      case "radio":
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </FormLabel>
            <RadioGroup value={value} onChange={(e) => handleConfigValueChange(key, e.target.value)}>
              {options.map((option, index) => (
                <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
          </FormControl>
        )

      case "dropdown":
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleConfigValueChange(key, e.target.value)}
              label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            >
              {options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )

      default:
        return (
          <TextField
            fullWidth
            label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            value={value}
            onChange={(e) => handleConfigValueChange(key, e.target.value)}
            size="small"
          />
        )
    }
  }

  const handleAutoApproveToggle = async (checked) => {
    setExpenseForm((prev) => ({ ...prev, autoApproveConfig: checked }))

    if (checked && ExpenseForm.systemCategoryId) {
      await getAutoApproveConfig(ExpenseForm.systemCategoryId)
    } else {
      setAutoApproveData(null)
      setConfigValues({})
    }
  }

  // Fetch expense details
  const fetchExpenseDetails = async (expenseId) => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/v1/api/expenseType/${expenseId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      const expenseData = response.data.items

      // Set expense form data
      setExpenseForm({
        expenseTypeId: expenseData.expenseTypeId,
        systemCategoryId: expenseData.systemCategoryId?.systemCategoryId || "",
        subcategoryId: expenseData.subcategoryId?.subcategoryId || "",
        name: expenseData.name,
        description: expenseData.description,
        formId: expenseData.formId?.formId || "",
        workflowId: expenseData.workflowId?.workflowId || "",
        autoApproveConfig: expenseData.autoApproveConfig || false,
      })

      // Set config values if auto-approve is enabled
      if (expenseData.autoApproveConfig && expenseData.config) {
        setConfigValues(expenseData.config)
      }

      // If auto-approve is enabled, fetch the configuration schema
      if (expenseData.autoApproveConfig && expenseData.systemCategoryId?.systemCategoryId) {
        await getAutoApproveConfig(expenseData.systemCategoryId.systemCategoryId)
      }

      // If there's a custom form, fetch its details
      if (expenseData.formId?.formId) {
        setHasCustomForm(true)
        setCreatedFormName(expenseData.formId.name)
        await fetchCustomFormDetails(expenseData.formId.formId)
      }

      // Load subcategories for the selected system category
      if (expenseData.systemCategoryId?.systemCategoryId) {
        await getAllSubCategoryFilter(expenseData.systemCategoryId.systemCategoryId)
      }
    } catch (error) {
      console.error("Error fetching expense details:", error)
      showSnackbar("Error loading expense details", "error")
    } finally {
      setLoading(false)
    }
  }

  const getAllWorkflows = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/workFlow/all`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setWorkflows(res.data.items.workflows || [])
    } catch (error) {
      console.error("Error fetching workflows:", error)
    }
  }

  // Fetch custom form details
  const fetchCustomFormDetails = async (formId) => {
    try {
      const response = await axios.get(`${baseUrl}/v1/api/dynamicForm/${formId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      const formDetails = response.data.items
      setFormData({
        name: formDetails.name || "",
        description: formDetails.description || "",
        fields: formDetails.fields || [],
      })
    } catch (error) {
      console.error("Error fetching custom form details:", error)
      showSnackbar("Error loading custom form details", "error")
    }
  }

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/systemCategory`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setCategories(res.data.items || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  // Fetch subcategories based on system category
  const getAllSubCategoryFilter = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/subCategory?systemCategoryId=${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setSubCategoriesFilter(res.data.items?.subcategories || [])
    } catch (error) {
      console.error("Error fetching subcategories:", error)
    }
  }

  // Handle form field changes
  const handleExpenseFormChange = (field, value) => {
    setExpenseForm((prev) => ({ ...prev, [field]: value }))
  }

  // Update expense
  const handleUpdateExpense = async () => {
    try {
      setSaving(true)
      const updateData = {
        systemCategoryId: ExpenseForm.systemCategoryId,
        subcategoryId: ExpenseForm.subcategoryId,
        name: ExpenseForm.name,
        description: ExpenseForm.description,
        formId: ExpenseForm.formId,
        workflowId: ExpenseForm.workflowId,
        autoApproveConfig: ExpenseForm.autoApproveConfig,
        ...(ExpenseForm.autoApproveConfig &&
          Object.keys(configValues).length > 0 && {
            config: configValues,
          }),
      }

      await axios.put(`${baseUrl}/v1/api/expenseType/${ExpenseForm.expenseTypeId}`, updateData, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      showSnackbar("Expense type updated successfully!")
      setTimeout(() => {
        router.push("/categories")
      }, 1500)
    } catch (error) {
      console.error("Error updating expense:", error)
      showSnackbar("Error updating expense type", "error")
    } finally {
      setSaving(false)
    }
  }

  // Snackbar functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Form dialog functions
  const handleOpenFormDialog = () => {
    setOpenFormDialog(true)
  }

  const handleCloseFormDialog = (shouldReset = false) => {
    setOpenFormDialog(false)
    if (shouldReset && !hasCustomForm) {
      setFormData({ name: "", description: "", fields: [] })
    }
  }

  // Field dialog functions
  const handleOpenFieldDialog = (field = null, index = -1) => {
    if (field) {
      setEditingField(field)
      setEditingFieldIndex(index)
      // Store original field data for comparison
      setOriginalFieldData(field)
      setFieldForm({
        ...field,
        // Ensure validation object exists with all properties
        validation: {
          minLength: field.validation?.minLength || "",
          maxLength: field.validation?.maxLength || "",
          min: field.validation?.min || "",
          max: field.validation?.max || "",
          pattern: field.validation?.pattern || "",
          customValidation: field.validation?.customValidation || "",
          ...field.validation, // Spread any existing validation properties
        },
        // Ensure conditionalLogic exists
        conditionalLogic: {
          enabled: field.conditionalLogic?.enabled || false,
          showIf: {
            displayOrder: field.conditionalLogic?.showIf?.displayOrder || "",
            operator: field.conditionalLogic?.showIf?.operator || "equals",
            value: field.conditionalLogic?.showIf?.value || "",
            ...field.conditionalLogic?.showIf,
          },
          ...field.conditionalLogic,
        },
        // Ensure options array exists for select/radio fields
        options: field.options || [],
        // Ensure other properties have defaults
        placeholder: field.placeholder || "",
        helpText: field.helpText || "",
        defaultValue: field.defaultValue || "",
      })
    } else {
      setEditingField(null)
      setEditingFieldIndex(-1)
      setOriginalFieldData(null)
      setFieldForm({
        fieldName: "",
        fieldType: "text",
        label: "",
        placeholder: "",
        isRequired: false,
        validation: {
          minLength: "",
          maxLength: "",
          min: "",
          max: "",
          pattern: "",
          customValidation: "",
        },
        displayOrder: formData.fields.length + 1,
        defaultValue: "",
        helpText: "",
        options: [],
        conditionalLogic: {
          enabled: false,
          showIf: {
            displayOrder: "",
            operator: "equals",
            value: "",
          },
        },
      })
    }
    setOpenFieldDialog(true)
  }

  const handleCloseFieldDialog = () => {
    setOpenFieldDialog(false)
    setEditingField(null)
    setEditingFieldIndex(-1)
    setOriginalFieldData(null) // Clear original data
  }

  // Field form change handlers
  const handleFieldFormChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFieldForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFieldForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleValidationChange = (validationType, value) => {
    setFieldForm((prev) => ({
      ...prev,
      validation: {
        ...prev.validation,
        [validationType]: value,
      },
    }))
  }

  const handleConditionalLogicChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFieldForm((prev) => ({
        ...prev,
        conditionalLogic: {
          ...prev.conditionalLogic,
          [parent]: {
            ...prev.conditionalLogic[parent],
            [child]: value,
          },
        },
      }))
    } else {
      setFieldForm((prev) => ({
        ...prev,
        conditionalLogic: {
          ...prev.conditionalLogic,
          [field]: value,
        },
      }))
    }
  }

  // Clean field data before saving
  const cleanFieldData = (field) => {
    const cleanedField = { ...field }
    // Generate fieldName from label if not provided
    if (!cleanedField.fieldName && cleanedField.label) {
      cleanedField.fieldName = cleanedField.label
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
    }

    // Handle validation object - preserve original structure and only update changed values
    if (originalFieldData && originalFieldData.validation) {
      // Start with original validation data
      const mergedValidation = { ...originalFieldData.validation }
      // Update only the fields that have actual values or have been explicitly changed
      Object.entries(cleanedField.validation || {}).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          mergedValidation[key] = value
        } else if (originalFieldData.validation[key] !== undefined) {
          // Keep original value if current is empty but original existed
          mergedValidation[key] = originalFieldData.validation[key]
        }
      })
      // Only include validation if there are actual validation rules
      if (
        Object.keys(mergedValidation).length > 0 &&
        Object.values(mergedValidation).some((val) => val !== "" && val !== null && val !== undefined)
      ) {
        cleanedField.validation = mergedValidation
      } else if (originalFieldData.validation) {
        // Preserve original validation structure even if empty
        cleanedField.validation = originalFieldData.validation
      } else {
        cleanedField.validation = null
      }
    } else {
      // For new fields, clean validation normally
      const cleanedValidation = {}
      Object.entries(cleanedField.validation || {}).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          cleanedValidation[key] = value
        }
      })
      if (Object.keys(cleanedValidation).length > 0) {
        cleanedField.validation = cleanedValidation
      } else {
        cleanedField.validation = null
      }
    }

    // Clean placeholder for non-text fields
    if (!["text", "textarea", "email", "phone"].includes(cleanedField.fieldType)) {
      delete cleanedField.placeholder
    }

    // Clean options for non-option fields
    if (!["select", "multiselect", "radio"].includes(cleanedField.fieldType)) {
      delete cleanedField.options
    }

    // Handle conditional logic - preserve original structure
    if (cleanedField.conditionalLogic?.enabled) {
      cleanedField.conditionalLogic = {
        showIf: {
          displayOrder: cleanedField.conditionalLogic.showIf.displayOrder
            ? Number.parseInt(cleanedField.conditionalLogic.showIf.displayOrder)
            : originalFieldData?.conditionalLogic?.showIf?.displayOrder || null,
          operator:
            cleanedField.conditionalLogic.showIf.operator ||
            originalFieldData?.conditionalLogic?.showIf?.operator ||
            "equals",
          value: cleanedField.conditionalLogic.showIf.value || originalFieldData?.conditionalLogic?.showIf?.value || "",
        },
      }
    } else if (originalFieldData?.conditionalLogic && !cleanedField.conditionalLogic?.enabled) {
      // If original had conditional logic but now it's disabled, preserve the structure but mark as disabled
      cleanedField.conditionalLogic = {
        ...originalFieldData.conditionalLogic,
        enabled: false,
      }
    } else if (!cleanedField.conditionalLogic?.enabled) {
      cleanedField.conditionalLogic = null
    }

    // Convert displayOrder to number
    cleanedField.displayOrder = Number.parseInt(cleanedField.displayOrder)

    // Handle defaultValue based on field type
    if (cleanedField.fieldType === "multiselect" && typeof cleanedField.defaultValue === "string") {
      cleanedField.defaultValue = cleanedField.defaultValue.split(",").map((v) => v.trim())
    }

    // Preserve other original field properties that might exist
    if (originalFieldData) {
      // Preserve fieldId if it exists
      if (originalFieldData.fieldId) {
        cleanedField.fieldId = originalFieldData.fieldId
      }
      // Preserve isActive if it exists
      if (originalFieldData.isActive !== undefined) {
        cleanedField.isActive = originalFieldData.isActive
      }
      // Preserve isEdited if it exists
      if (originalFieldData.isEdited !== undefined) {
        cleanedField.isEdited = originalFieldData.isEdited
      }
      // Preserve any other properties that might be needed
      Object.keys(originalFieldData).forEach((key) => {
        if (!cleanedField.hasOwnProperty(key) && !["validation", "conditionalLogic", "options"].includes(key)) {
          cleanedField[key] = originalFieldData[key]
        }
      })
    }

    return cleanedField
  }

  // Save field
  const handleSaveField = () => {
    const cleanedField = cleanFieldData(fieldForm)
    if (editingFieldIndex >= 0) {
      const updatedFields = [...formData.fields]
      updatedFields[editingFieldIndex] = cleanedField
      setFormData((prev) => ({ ...prev, fields: updatedFields }))
    } else {
      setFormData((prev) => ({ ...prev, fields: [...prev.fields, cleanedField] }))
    }
    handleCloseFieldDialog()
    showSnackbar(editingFieldIndex >= 0 ? "Field updated successfully" : "Field added successfully")
  }

  // Delete field
  const handleDeleteField = (index) => {
    const fieldToDelete = formData.fields[index]

    // Check if field can be deleted based on isEdited property
    if (fieldToDelete.isEdited === false) {
      showSnackbar("This field cannot be deleted", "error")
      return
    }

    // Prevent deletion of the default Amount field (first field with fieldName "Amount")
    if (fieldToDelete.fieldName === "Amount" && fieldToDelete.displayOrder === 1) {
      showSnackbar("Cannot delete the default Amount field", "error")
      return
    }

    const updatedFields = formData.fields.filter((_, i) => i !== index)
    const reorderedFields = updatedFields.map((field, idx) => ({
      ...field,
      displayOrder: idx + 1,
    }))
    setFormData((prev) => ({ ...prev, fields: reorderedFields }))
    showSnackbar("Field deleted successfully")
  }

  // Save form
  const handleSaveForm = async () => {
    if (!formData.name.trim()) {
      showSnackbar("Please enter a form name", "error")
      return
    }
    if (formData.fields.length === 0) {
      showSnackbar("Please add at least one field to the form", "error")
      return
    }

    try {
      setSaving(true)
      if (hasCustomForm && ExpenseForm.formId) {
        // Update existing form
        await axios.put(`${baseUrl}/v1/api/dynamicForm/${ExpenseForm.formId}`, formData, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })
        showSnackbar("Custom form updated successfully!")
      } else {
        // Create new form
        const response = await axios.post(`${baseUrl}/v1/api/dynamicForm`, formData, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })
        if (response.data) {
          const formId = response.data.items?.formId || response.data._id || response.data.id
          setExpenseForm((prev) => ({ ...prev, formId: formId }))
          setHasCustomForm(true)
          setCreatedFormName(formData.name)
          showSnackbar("Custom form created successfully!")
        }
      }
      handleCloseFormDialog(false)
    } catch (error) {
      console.error("Error saving form:", error)
      showSnackbar(hasCustomForm ? "Error updating form" : "Error creating form", "error")
    } finally {
      setSaving(false)
    }
  }

  // Remove custom form
  const handleRemoveCustomForm = () => {
    if (window.confirm("Are you sure you want to remove this custom form? This action cannot be undone.")) {
      setHasCustomForm(false)
      setCreatedFormName("")
      setExpenseForm((prev) => ({ ...prev, formId: "" }))
      setFormData({ name: "", description: "", fields: [] })
      showSnackbar("Custom form removed")
    }
  }

  // Option handlers
  const handleAddOption = () => {
    setFieldForm((prev) => ({
      ...prev,
      options: [...(prev.options || []), { label: "", value: "" }],
    }))
  }

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...(fieldForm.options || [])]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setFieldForm((prev) => ({ ...prev, options: newOptions }))
  }

  const handleDeleteOption = (index) => {
    const newOptions = [...(fieldForm.options || [])]
    newOptions.splice(index, 1)
    setFieldForm((prev) => ({ ...prev, options: newOptions }))
  }

  // Get available fields for conditional logic
  const getAvailableFieldsForConditional = () => {
    return formData.fields
      .filter((field, index) => index !== editingFieldIndex)
      .map((field) => ({
        displayOrder: field.displayOrder,
        label: field.label,
        fieldType: field.fieldType,
      }))
  }

  // Initialize data
  useEffect(() => {
    getAllCategory()
    getAllWorkflows()
  }, [])

  useEffect(() => {
    if (ExpenseForm?.systemCategoryId) {
      getAllSubCategoryFilter(ExpenseForm.systemCategoryId)
    }
  }, [ExpenseForm?.systemCategoryId])

  useEffect(() => {
    if (expenseId) {
      fetchExpenseDetails(expenseId)
    }
  }, [expenseId])

  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: "#f9f9fb", minHeight: "100vh" }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" height={20} />
        </Paper>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="rectangular" width="100%" height={56} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#f9f9fb", minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" fontWeight={600} sx={{ color: "white", mb: "-5px" }}>
              Update Expense Type
            </Typography>
            <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
              Update expense type: {ExpenseForm.name}
            </Typography>
          </Box>
          <Button
            sx={{
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              color: "white",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.7)",
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            variant="outlined"
            onClick={() => router.push("/employeeSetup/NewExpensesDetails/Category")}
          >
            <KeyboardBackspace sx={{ fontSize: 18 }} />
          </Button>
        </Box>
      </Paper>

      {/* Form Content */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          bgcolor: "white",
          border: "1px solid #EAECF0",
        }}
      >
        <Grid container spacing={3}>
          {/* System Category & Sub Category */}
          <Grid item xs={12} sm={6}>
            <Typography fontWeight={600} color="#262E3D" mb={2}>
              Select System Category
            </Typography>
            <Select
              fullWidth
              value={ExpenseForm.systemCategoryId}
              onChange={(e) => handleExpenseFormChange("systemCategoryId", e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select System Category
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat.systemCategoryId}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography fontWeight={600} color="#262E3D" mb={2}>
              Select Sub Category
            </Typography>
            <Select
              fullWidth
              value={ExpenseForm.subcategoryId}
              onChange={(e) => handleExpenseFormChange("subcategoryId", e.target.value)}
              displayEmpty
              disabled={!ExpenseForm.systemCategoryId}
            >
              <MenuItem value="" disabled>
                Select Sub Category
              </MenuItem>
              {subCategoriesFilter.map((cat) => (
                <MenuItem key={cat._id} value={cat.subcategoryId}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Expense Type Name */}
          <Grid item xs={12} sm={6}>
            <Typography fontWeight={600} color="#262E3D" mb={2}>
              Expense Type Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter Expense Type Name"
              value={ExpenseForm.name}
              onChange={(e) => handleExpenseFormChange("name", e.target.value)}
            />
          </Grid>

          {/* Approval Flow */}
          <Grid item xs={12} sm={6}>
            <Typography fontWeight={600} color="#262E3D" mb={2}>
              Select Approval Flow
            </Typography>
            <Select
              fullWidth
              value={ExpenseForm.workflowId}
              onChange={(e) => handleExpenseFormChange("workflowId", e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Approval Flow
              </MenuItem>
              {Workflows.map((cat) => (
                <MenuItem key={cat.workflowId} value={cat.workflowId}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography fontWeight={600} color="#262E3D" mb={2}>
              Description
            </Typography>
            <TextField
              fullWidth
              placeholder="Write Description"
              multiline
              rows={3}
              value={ExpenseForm.description}
              onChange={(e) => handleExpenseFormChange("description", e.target.value)}
            />
          </Grid>

          {/* Auto Approve Configuration Toggle */}
          <Grid item xs={12}>
            <Typography fontWeight={600} color="#262E3D" mb={2}>
              Auto Approve Configuration
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: "#f8f9fa" }}>
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={ExpenseForm.autoApproveConfig}
                      onChange={(e) => handleAutoApproveToggle(e.target.checked)}
                      disabled={!ExpenseForm.systemCategoryId}
                    />
                  }
                  label="Enable Auto Approve Configuration"
                />
                {!ExpenseForm.systemCategoryId && (
                  <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                    Please select a system category first
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Auto Approve Configuration Fields */}
          {ExpenseForm.autoApproveConfig && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                    <SettingsIcon color="primary" />
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      Configuration Settings
                    </Typography>
                    {loadingAutoApprove && <CircularProgress size={20} />}
                  </Stack>

                  {autoApproveData && autoApproveData.overRideConfig ? (
                    <Grid container spacing={3}>
                      {autoApproveData.overRideConfig.map((configItem, index) => (
                        <Grid item xs={12} sm={6} md={4} key={configItem._id || index}>
                          {renderConfigField(configItem)}
                        </Grid>
                      ))}
                    </Grid>
                  ) : ExpenseForm.autoApproveConfig && !loadingAutoApprove ? (
                    <Alert severity="info">No configuration fields available for this category.</Alert>
                  ) : null}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Custom Form Section */}
          <Grid item xs={12}>
            <Typography fontWeight={600} color="#262E3D" mb={2}>
              Custom Form
            </Typography>
            {hasCustomForm ? (
              <Card variant="outlined" sx={{ bgcolor: "#f8f9fa" }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500} color="success.main">
                        ✓ Custom Form Attached
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {createdFormName} ({formData.fields.length} fields)
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleOpenFormDialog}
                        sx={{ textTransform: "none" }}
                      >
                        Edit Form
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={handleRemoveCustomForm}
                        sx={{ textTransform: "none" }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Card variant="outlined" sx={{ bgcolor: "#f8f9fa" }}>
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No custom form attached
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Create a custom form to collect additional information for this expense type
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenFormDialog}
                    sx={{
                      textTransform: "none",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    Create Custom Form
                  </Button>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => router.push("/categories")} sx={{ minWidth: 120 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateExpense}
            startIcon={saving ? <CircularProgress size={16} /> : <Save />}
            disabled={saving}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              minWidth: 120,
            }}
          >
            {saving ? "Updating..." : "Update Expense"}
          </Button>
        </Box>
      </Paper>

      {/* Form Builder Dialog */}
      <Dialog open={openFormDialog} onClose={handleCloseFormDialog} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: "grey.50",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={500}>
            {hasCustomForm ? "Edit Custom Form" : "Create Custom Form"}
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
                  label="Form Name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Form Description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={2}
                />
                <Divider />
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={500}>
                      Form Fields ({formData.fields.length})
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenFieldDialog()}
                      sx={{ textTransform: "none" }}
                    >
                      Add Field
                    </Button>
                  </Stack>
                  {formData.fields.length > 0 ? (
                    <Stack spacing={2}>
                      {formData.fields
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map((field, index) => {
                          const fieldTypeConfig = fieldTypeIcons[field.fieldType]
                          const IconComponent = fieldTypeConfig?.icon || TextIcon
                          const isDefaultAmountField = field.fieldName === "Amount" && field.displayOrder === 1
                          const canEdit = field.isEdited !== false
                          const canDelete = field.isEdited !== false && !isDefaultAmountField

                          return (
                            <Card
                              key={index}
                              variant="outlined"
                              sx={{
                                bgcolor: isDefaultAmountField ? "#e8f5e8" : canEdit ? "white" : "#f5f5f5",
                                border: isDefaultAmountField
                                  ? "2px solid #4caf50"
                                  : canEdit
                                    ? "1px solid #e0e0e0"
                                    : "1px solid #ccc",
                                opacity: canEdit ? 1 : 0.7,
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 24,
                                      height: 24,
                                      borderRadius: "50%",
                                      bgcolor: isDefaultAmountField
                                        ? "success.main"
                                        : canEdit
                                          ? "primary.main"
                                          : "grey.500",
                                      color: "white",
                                      fontSize: "0.75rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {field.displayOrder}
                                  </Box>
                                  <IconComponent
                                    sx={{
                                      color: isDefaultAmountField
                                        ? "success.main"
                                        : canEdit
                                          ? "text.secondary"
                                          : "grey.500",
                                    }}
                                  />
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Typography variant="subtitle1" fontWeight={500}>
                                        {field.label}
                                      </Typography>
                                      {field.isRequired && (
                                        <Chip label="Required" size="small" color="error" variant="outlined" />
                                      )}
                                      <Chip
                                        label={fieldTypeConfig?.label}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: "0.7rem" }}
                                      />
                                      {isDefaultAmountField && (
                                        <Chip label="Default" size="small" color="success" variant="outlined" />
                                      )}
                                      {!canEdit && (
                                        <Chip label="Protected" size="small" color="warning" variant="outlined" />
                                      )}
                                      {field.conditionalLogic && (
                                        <Chip label="Conditional" size="small" color="info" variant="outlined" />
                                      )}
                                    </Stack>
                                    {field.helpText && (
                                      <Typography variant="body2" color="text.secondary">
                                        {field.helpText}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Stack direction="row" spacing={1}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenFieldDialog(field, index)}
                                      disabled={!canEdit}
                                      sx={{
                                        opacity: canEdit ? 1 : 0.5,
                                        cursor: canEdit ? "pointer" : "not-allowed",
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteField(index)}
                                      disabled={!canDelete}
                                      sx={{
                                        opacity: canDelete ? 1 : 0.5,
                                        cursor: canDelete ? "pointer" : "not-allowed",
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" color={canDelete ? "error" : "disabled"} />
                                    </IconButton>
                                  </Stack>
                                </Stack>
                              </CardContent>
                            </Card>
                          )
                        })}
                    </Stack>
                  ) : (
                    <Paper variant="outlined" sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        No fields added yet
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenFieldDialog()}
                        sx={{ textTransform: "none" }}
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
              <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
                  Form Preview
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {formData.name || "Form Name"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {formData.description || "Form description will appear here"}
                    </Typography>
                    {formData.fields.length > 0 ? (
                      <Stack spacing={2} sx={{ mt: 2 }}>
                        {formData.fields
                          .sort((a, b) => a.displayOrder - b.displayOrder)
                          .slice(0, 3)
                          .map((field, index) => (
                            <Box key={index}>
                              <Typography variant="subtitle2" gutterBottom>
                                {field.displayOrder}. {field.label}
                                {field.isRequired && <span style={{ color: "red" }}> *</span>}
                              </Typography>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                disabled
                                type={field.fieldType === "number" ? "number" : "text"}
                              />
                            </Box>
                          ))}
                        {formData.fields.length > 3 && (
                          <Typography variant="body2" color="text.secondary" textAlign="center">
                            ... and {formData.fields.length - 3} more fields
                          </Typography>
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Add fields to see preview
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
          <Button onClick={() => handleCloseFormDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveForm}
            variant="contained"
            disabled={!formData.name || formData.fields.length === 0 || saving}
            startIcon={saving ? <CircularProgress size={16} /> : <Save />}
          >
            {saving ? "Saving..." : hasCustomForm ? "Update Form" : "Create Form"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Field Builder Dialog - Same as create form but with edit restrictions */}
      <Dialog open={openFieldDialog} onClose={handleCloseFieldDialog} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: "white",
            borderBottom: "1px solid #f0f0f0",
            py: 3,
            px: 3,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                {editingField ? "Edit Field" : "Add New Field"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Configure the field properties, validation rules, and conditional logic
              </Typography>
              {editingField && editingField.isEdited === false && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  This field has restricted editing capabilities
                </Alert>
              )}
            </Box>
            <IconButton onClick={handleCloseFieldDialog}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto" }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Field Label *
              </Typography>
              <TextField
                fullWidth
                value={fieldForm.label}
                onChange={(e) => handleFieldFormChange("label", e.target.value)}
                placeholder="Enter field label"
                disabled={editingField && editingField.isEdited === false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Field Name
              </Typography>
              <TextField
                fullWidth
                value={fieldForm.fieldName}
                onChange={(e) => handleFieldFormChange("fieldName", e.target.value)}
                placeholder="Auto-generated from label"
                helperText="Used as the field identifier in the form data"
                disabled={editingField && editingField.isEdited === false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Field Type
              </Typography>
              <FormControl fullWidth disabled={editingField && editingField.isEdited === false}>
                <Select
                  value={fieldForm.fieldType}
                  onChange={(e) => handleFieldFormChange("fieldType", e.target.value)}
                  renderValue={(selected) => {
                    const config = fieldTypeIcons[selected]
                    const IconComponent = config?.icon || TextIcon
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <IconComponent sx={{ color: "primary.main", fontSize: 20 }} />
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
                          <IconComponent sx={{ color: "primary.main" }} />
                        </ListItemIcon>
                        <ListItemText primary={config.label} />
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Display Order
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={fieldForm.displayOrder}
                onChange={(e) => handleFieldFormChange("displayOrder", Number.parseInt(e.target.value) || 1)}
                inputProps={{ min: 1 }}
                helperText="Order in which this field appears in the form"
                disabled={editingField && editingField.isEdited === false}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Help Text
              </Typography>
              <TextField
                fullWidth
                value={fieldForm.helpText}
                onChange={(e) => handleFieldFormChange("helpText", e.target.value)}
                placeholder="Enter help text (optional)"
                multiline
                rows={2}
                disabled={editingField && editingField.isEdited === false}
              />
            </Grid>
            {["text", "textarea", "email", "phone"].includes(fieldForm.fieldType) && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                  Placeholder Text
                </Typography>
                <TextField
                  fullWidth
                  value={fieldForm.placeholder || ""}
                  onChange={(e) => handleFieldFormChange("placeholder", e.target.value)}
                  placeholder="Enter placeholder text"
                  disabled={editingField && editingField.isEdited === false}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Default Value
              </Typography>
              <TextField
                fullWidth
                value={fieldForm.defaultValue}
                onChange={(e) => handleFieldFormChange("defaultValue", e.target.value)}
                placeholder="Enter default value (optional)"
                helperText={
                  fieldForm.fieldType === "multiselect"
                    ? "For multiselect, use comma-separated values"
                    : "Default value for this field"
                }
                disabled={editingField && editingField.isEdited === false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={fieldForm.isRequired}
                    onChange={(e) => handleFieldFormChange("isRequired", e.target.checked)}
                    disabled={editingField && editingField.isEdited === false}
                  />
                }
                label="Required field"
              />
            </Grid>

            {/* Options for select, multiselect, radio */}
            {["select", "multiselect", "radio"].includes(fieldForm.fieldType) && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Options
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={2}>
                    {(fieldForm.options || []).map((option, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <TextField
                          placeholder="Label"
                          value={option.label || ""}
                          onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                          disabled={editingField && editingField.isEdited === false}
                        />
                        <TextField
                          placeholder="Value"
                          value={option.value || ""}
                          onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                          disabled={editingField && editingField.isEdited === false}
                        />
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteOption(index)}
                          size="small"
                          disabled={editingField && editingField.isEdited === false}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddOption}
                      variant="outlined"
                      sx={{ textTransform: "none" }}
                      disabled={editingField && editingField.isEdited === false}
                    >
                      Add Option
                    </Button>
                  </Stack>
                </Grid>
              </>
            )}

            {/* Validation Rules */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Accordion disabled={editingField && editingField.isEdited === false}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight={600} color="primary.main">
                    Validation Rules
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {(fieldForm.fieldType === "text" || fieldForm.fieldType === "textarea") && (
                      <>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Min Length"
                            type="number"
                            value={fieldForm.validation.minLength}
                            onChange={(e) => handleValidationChange("minLength", Number.parseInt(e.target.value) || "")}
                            size="small"
                            disabled={editingField && editingField.isEdited === false}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Max Length"
                            type="number"
                            value={fieldForm.validation.maxLength}
                            onChange={(e) => handleValidationChange("maxLength", Number.parseInt(e.target.value) || "")}
                            size="small"
                            disabled={editingField && editingField.isEdited === false}
                          />
                        </Grid>
                      </>
                    )}
                    {(fieldForm.fieldType === "number" || fieldForm.fieldType === "currency") && (
                      <>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Min Value"
                            type="number"
                            value={fieldForm.validation.min}
                            onChange={(e) => handleValidationChange("min", Number.parseInt(e.target.value) || "")}
                            size="small"
                            disabled={editingField && editingField.isEdited === false}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Max Value"
                            type="number"
                            value={fieldForm.validation.max}
                            onChange={(e) => handleValidationChange("max", Number.parseInt(e.target.value) || "")}
                            size="small"
                            disabled={editingField && editingField.isEdited === false}
                          />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Pattern (Regex)"
                        value={fieldForm.validation.pattern}
                        onChange={(e) => handleValidationChange("pattern", e.target.value)}
                        placeholder="^[A-Za-z ]+$"
                        size="small"
                        helperText="Regular expression pattern for validation"
                        disabled={editingField && editingField.isEdited === false}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Custom Validation"
                        value={fieldForm.validation.customValidation}
                        onChange={(e) => handleValidationChange("customValidation", e.target.value)}
                        placeholder="return value !== 'Test';"
                        size="small"
                        helperText="JavaScript expression for custom validation"
                        multiline
                        rows={2}
                        disabled={editingField && editingField.isEdited === false}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Conditional Logic */}
            <Grid item xs={12}>
              <Accordion disabled={editingField && editingField.isEdited === false}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight={600} color="primary.main">
                    Conditional Logic
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={fieldForm.conditionalLogic.enabled}
                            onChange={(e) => handleConditionalLogicChange("enabled", e.target.checked)}
                            disabled={editingField && editingField.isEdited === false}
                          />
                        }
                        label="Enable conditional logic for this field"
                      />
                    </Grid>
                    {fieldForm.conditionalLogic.enabled && (
                      <>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Show this field only when the following condition is met:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl
                            fullWidth
                            size="small"
                            disabled={editingField && editingField.isEdited === false}
                          >
                            <InputLabel>Field</InputLabel>
                            <Select
                              value={fieldForm.conditionalLogic.showIf.displayOrder}
                              onChange={(e) => handleConditionalLogicChange("showIf.displayOrder", e.target.value)}
                              label="Field"
                            >
                              {getAvailableFieldsForConditional().map((field) => (
                                <MenuItem key={field.displayOrder} value={field.displayOrder}>
                                  {field.displayOrder}. {field.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl
                            fullWidth
                            size="small"
                            disabled={editingField && editingField.isEdited === false}
                          >
                            <InputLabel>Operator</InputLabel>
                            <Select
                              value={fieldForm.conditionalLogic.showIf.operator}
                              onChange={(e) => handleConditionalLogicChange("showIf.operator", e.target.value)}
                              label="Operator"
                            >
                              {conditionalOperators.map((op) => (
                                <MenuItem key={op.value} value={op.value}>
                                  {op.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Value"
                            value={fieldForm.conditionalLogic.showIf.value}
                            onChange={(e) => handleConditionalLogicChange("showIf.value", e.target.value)}
                            placeholder="Enter comparison value"
                            disabled={editingField && editingField.isEdited === false}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
          <Button onClick={handleCloseFieldDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveField}
            variant="contained"
            disabled={!fieldForm.label || (editingField && editingField.isEdited === false)}
          >
            {editingField ? "Update Field" : "Add Field"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
