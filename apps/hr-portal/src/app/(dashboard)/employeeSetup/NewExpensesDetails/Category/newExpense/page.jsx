// "use client"

// import { useState, useEffect } from "react"
// import { Box, Grid, TextField, Typography, Paper, Button, MenuItem, Select } from "@mui/material"
// import { KeyboardBackspace, Save } from "@mui/icons-material"
// import { useRouter } from "next/navigation"
// import axios from "axios"

// export default function ExpenseTypeForm() {
//   const router = useRouter()
//   const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

//   const [categories, setCategories] = useState([])
//   const [subCategoriesFilter, setSubCategoriesFilter] = useState([])
//   const [ExpenseForm, setExpenseForm] = useState({
//     systemCategoryId: "",
//     subcategoryId: "",
//     name: "",
//     description: "",
//     formId: "",
//     workflowId: "",
//   })

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

//   const handleExpenseFormChange = (field, value) => {
//     setExpenseForm((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleAddExpense = async () => {
//     try {
//       const res = await axios.post(`${baseUrl}/v1/api/expenseType`, ExpenseForm, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Expense added:", res.data)
//       router.push("/categories") // Navigate back to categories page
//     } catch (error) {
//       console.error("Error adding expense:", error)
//     }
//   }

//   const handleUpdateExpense = async (id) => {
//     try {
//       await axios.put(`${baseUrl}/v1/api/expenseType/${id}`, ExpenseForm, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       router.push("/categories") // Navigate back to categories page
//     } catch (error) {
//       console.error("Error updating Expense:", error)
//     }
//   }

//   const handleSubmit = () => {
//     if (ExpenseForm.id) {
//       handleUpdateExpense(ExpenseForm.expenseTypeId)
//     } else {
//       handleAddExpense()
//     }
//   }

//   useEffect(() => {
//     getAllCategory()
//   }, [])

//   useEffect(() => {
//     if (ExpenseForm?.systemCategoryId) {
//       getAllSubCategoryFilter(ExpenseForm.systemCategoryId)
//     }
//   }, [ExpenseForm?.systemCategoryId])

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
//               Create Expense Type
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
//               Add a new expense type under a sub category
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

//            {/* Approval Flow */}
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

//           {/* Form ID */}
//           {/* <Grid item xs={12} sm={6}>
//             <Typography fontWeight={600} color="#262E3D" mb={2}>
//               Form ID (Optional)
//             </Typography>
//             <TextField
//               fullWidth
//               placeholder="Enter Form ID"
//               value={ExpenseForm.formId}
//               onChange={(e) => handleExpenseFormChange("formId", e.target.value)}
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
//             onClick={handleSubmit}
//             startIcon={<Save />}
//             sx={{
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               minWidth: 120,
//             }}
//           >
//             {ExpenseForm.id ? "Update Expense" : "Add Expense"}
//           </Button>
//         </Box>
//       </Paper>
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

// export default function ExpenseTypeForm() {
//   const router = useRouter()
//   const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

//   const [categories, setCategories] = useState([])
//   const [subCategoriesFilter, setSubCategoriesFilter] = useState([])
//   const [ExpenseForm, setExpenseForm] = useState({
//     systemCategoryId: "",
//     subcategoryId: "",
//     name: "",
//     description: "",
//     formId: "",
//     workflowId: "",
//   })

//   // Form Builder States
//   const [openFormDialog, setOpenFormDialog] = useState(false)
//   const [openFieldDialog, setOpenFieldDialog] = useState(false)
//   const [editingField, setEditingField] = useState(null)
//   const [editingFieldIndex, setEditingFieldIndex] = useState(-1)
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
//   const [saving, setSaving] = useState(false)
//   const [hasCustomForm, setHasCustomForm] = useState(false)
//   const [createdFormName, setCreatedFormName] = useState("")
//   const [Workflows, setWorkflows] = useState([])

//   // Form Builder Data
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     fields: [],
//   })

//   // Field Form State with complete structure
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
//   const getAllWorkflows = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/workFlow/all`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       setWorkflows(res.data.items.workflows || [])
//     } catch (error) {
//       console.error("Error fetching workflows:", error)
//     }
//   }

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

//   const handleExpenseFormChange = (field, value) => {
//     setExpenseForm((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleAddExpense = async () => {
//     try {
//       const res = await axios.post(`${baseUrl}/v1/api/expenseType`, ExpenseForm, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Expense added:", res.data)
//       showSnackbar("Expense type created successfully!")
//       router.push("/categories")
//     } catch (error) {
//       console.error("Error adding expense:", error)
//       showSnackbar("Error creating expense type", "error")
//     }
//   }

//   const handleUpdateExpense = async (id) => {
//     try {
//       await axios.put(`${baseUrl}/v1/api/expenseType/${id}`, ExpenseForm, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       showSnackbar("Expense type updated successfully!")
//       router.push("/categories")
//     } catch (error) {
//       console.error("Error updating Expense:", error)
//       showSnackbar("Error updating expense type", "error")
//     }
//   }

//   const handleSubmit = () => {
//     if (ExpenseForm.id) {
//       handleUpdateExpense(ExpenseForm.expenseTypeId)
//     } else {
//       handleAddExpense()
//     }
//   }

//   // Form Builder Functions
//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity })
//   }

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false })
//   }

//   const handleOpenFormDialog = () => {
//     // If we have a custom form, ensure we have the latest data
//     if (hasCustomForm) {
//       // If form data is empty but we have a custom form, reload it
//       if (formData.fields.length === 0 && ExpenseForm.formId) {
//         loadExistingForm(ExpenseForm.formId)
//       }
//       setOpenFormDialog(true)
//     } else {
//       // Create new form with default values
//     //   const defaultFormName = ExpenseForm.name ? `${ExpenseForm.name} Form` : "Custom Expense Form"
//       setFormData({
//         name: '',
//         description: '',
//         fields: [],
//       })
//       setOpenFormDialog(true)
//     }
//   }

//   const handleCloseFormDialog = (shouldReset = null) => {
//     setOpenFormDialog(false)

//     // Only reset form data in specific cases:
//     // 1. If explicitly told to reset (shouldReset === true)
//     // 2. If we don't have a custom form AND we're creating a new form (not editing)
//     if (shouldReset === true && !hasCustomForm) {
//       // Only reset if we're creating a new form, not editing existing one
//       setFormData({ name: "", description: "", fields: [] })
//     }
//     // If we're editing an existing form, never reset the data on cancel
//   }

//   const handleOpenFieldDialog = (field = null, index = -1) => {
//     if (field) {
//       setEditingField(field)
//       setEditingFieldIndex(index)
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
//         conditionalLogic: field.conditionalLogic || {
//           enabled: false,
//           showIf: {
//             displayOrder: "",
//             operator: "equals",
//             value: "",
//           },
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
//         ...prev.validation, // Spread existing validation
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

//   const cleanFieldData = (field) => {
//     const cleanedField = { ...field }

//     // Generate fieldName from label if not provided
//     if (!cleanedField.fieldName && cleanedField.label) {
//       cleanedField.fieldName = cleanedField.label
//         .toLowerCase()
//         .replace(/\s+/g, "")
//         .replace(/[^a-zA-Z0-9]/g, "")
//     }

//     // Clean validation object - remove empty values
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

//     // Clean placeholder for non-text fields
//     if (!["text", "textarea", "email", "phone"].includes(cleanedField.fieldType)) {
//       delete cleanedField.placeholder
//     }

//     // Clean options for non-option fields
//     if (!["select", "multiselect", "radio"].includes(cleanedField.fieldType)) {
//       delete cleanedField.options
//     }

//     // Handle conditional logic
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

//     // Convert displayOrder to number
//     cleanedField.displayOrder = Number.parseInt(cleanedField.displayOrder)

//     // Handle defaultValue based on field type
//     if (cleanedField.fieldType === "multiselect" && typeof cleanedField.defaultValue === "string") {
//       cleanedField.defaultValue = cleanedField.defaultValue.split(",").map((v) => v.trim())
//     }

//     return cleanedField
//   }

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

//   const handleDeleteField = (index) => {
//     const updatedFields = formData.fields.filter((_, i) => i !== index)
//     // Update display orders
//     const reorderedFields = updatedFields.map((field, idx) => ({
//       ...field,
//       displayOrder: idx + 1,
//     }))
//     setFormData((prev) => ({ ...prev, fields: reorderedFields }))
//     showSnackbar("Field deleted successfully")
//   }

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

//       let response
//       if (hasCustomForm && ExpenseForm.formId) {
//         // Update existing form
//         response = await axios.put(`${baseUrl}/v1/api/dynamicForm/${ExpenseForm.formId}`, formData, {
//           headers: {
//             "Content-Type": "application/json",
//             authorization: token,
//           },
//         })
//         console.log("Form updated:", response)
//         showSnackbar("Custom form updated successfully!")
//       } else {
//         // Create new form
//         response = await axios.post(`${baseUrl}/v1/api/dynamicForm`, formData, {
//           headers: {
//             "Content-Type": "application/json",
//             authorization: token,
//           },
//         })
//         console.log("Form created:", response)

//         if (response.data) {
//           const formId = response.data.items?.formId || response.data._id || response.data.id
//           setExpenseForm((prev) => ({ ...prev, formId: formId }))
//           setHasCustomForm(true)
//           setCreatedFormName(formData.name)
//           showSnackbar("Custom form created successfully!")
//         }
//       }

//       // Close dialog without resetting form data since we want to preserve it
//       handleCloseFormDialog(false)
//     } catch (error) {
//       console.error("Error saving form:", error)
//       showSnackbar(hasCustomForm ? "Error updating form" : "Error creating form", "error")
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleRemoveCustomForm = () => {
//     // Show confirmation before removing
//     if (window.confirm("Are you sure you want to remove this custom form? This action cannot be undone.")) {
//       setHasCustomForm(false)
//       setCreatedFormName("")
//       setExpenseForm((prev) => ({ ...prev, formId: "" }))
//       setFormData({ name: "", description: "", fields: [] })
//       showSnackbar("Custom form removed")
//     }
//   }

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

//   const getAvailableFieldsForConditional = () => {
//     return formData.fields
//       .filter((field, index) => index !== editingFieldIndex)
//       .map((field) => ({
//         displayOrder: field.displayOrder,
//         label: field.label,
//         fieldType: field.fieldType,
//       }))
//   }

//   const loadExistingForm = async (formId) => {
//     try {
//       const response = await axios.get(`${baseUrl}/v1/api/dynamicForm/${formId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })

//       if (response.data) {
//         const existingForm = response.data.items || response.data
//         const formDataToSet = {
//           name: existingForm.name || "",
//           description: existingForm.description || "",
//           fields: existingForm.fields || [],
//         }

//         setFormData(formDataToSet)
//         setCreatedFormName(existingForm.name || "")

//         console.log("Loaded existing form:", formDataToSet)
//       }
//     } catch (error) {
//       console.error("Error loading existing form:", error)
//       showSnackbar("Error loading form data", "error")
//     }
//   }

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
//     if (ExpenseForm.formId && !hasCustomForm) {
//       setHasCustomForm(true)
//       loadExistingForm(ExpenseForm.formId)
//     }
//   }, [ExpenseForm.formId])

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
//               Create Expense Type
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
//               Add a new expense type under a sub category
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
//                 <MenuItem key={cat.workflowId} value={cat.workflowId}>
//                   {cat.name}
//                 </MenuItem>
//               ))}
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
//                         ✓ Custom Form Created
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
//                     No custom form created yet
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Create a custom form to collect additional information for this expense type
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={handleOpenFormDialog}
//                     disabled={!ExpenseForm.name}
//                     sx={{
//                       textTransform: "none",
//                       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                     }}
//                   >
//                     Create Custom Form
//                   </Button>
//                   {!ExpenseForm.name && (
//                     <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
//                       Please enter expense type name first
//                     </Typography>
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//           </Grid>
//         </Grid>

//         {/* Action Buttons */}
//         <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
//           <Button variant="outlined" onClick={() => router.push("/categories")} sx={{ minWidth: 120 }}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             startIcon={<Save />}
//             sx={{
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               minWidth: 120,
//             }}
//           >
//             {ExpenseForm.id ? "Update Expense" : "Add Expense"}
//           </Button>
//         </Box>
//       </Paper>

//       {/* Form Builder Dialog */}
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
//           <Grid container spacing={3} marginTop={1}>
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

//       {/* Field Builder Dialog */}
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

// Default Amount field that will be created automatically
const DEFAULT_AMOUNT_FIELD = {
  fieldName: "Amount",
  fieldType: "number",
  label: "Enter Amount",
  placeholder: "Enter Amount",
  isRequired: true,
  validation: null,
  displayOrder: 1,
  defaultValue: "",
  helpText: "",
}

export default function ExpenseTypeForm() {
  const router = useRouter()
  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [categories, setCategories] = useState([])
  const [subCategoriesFilter, setSubCategoriesFilter] = useState([])
  const [workflows, setWorkflows] = useState([])

  const [expenseForm, setExpenseForm] = useState({
    systemCategoryId: "",
    subcategoryId: "",
    name: "",
    description: "",
    formId: "",
    workflowId: "",
    autoApproveConfig: false,
  })

  // Add validation state
  const [validationErrors, setValidationErrors] = useState({
    systemCategoryId: false,
    subcategoryId: false,
    name: false,
    workflowId: false,
  })

  // Auto-approve configuration states
  const [autoApproveData, setAutoApproveData] = useState(null)
  const [configValues, setConfigValues] = useState({})
  const [loadingAutoApprove, setLoadingAutoApprove] = useState(false)

  // Form Builder States
  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [openFieldDialog, setOpenFieldDialog] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [editingFieldIndex, setEditingFieldIndex] = useState(-1)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [saving, setSaving] = useState(false)
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

  // API Functions
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

        // Initialize config values with default values from logicConfig
        const initialConfig = {}
        if (res.data.items.logicConfig) {
          Object.keys(res.data.items.logicConfig).forEach((key) => {
            initialConfig[key] = res.data.items.logicConfig[key]
          })
        }
        setConfigValues(initialConfig)

        showSnackbar("Auto-approve configuration loaded successfully!")
      }
    } catch (error) {
      console.error("Error fetching auto-approve config:", error)
      showSnackbar("Error loading auto-approve configuration", "error")
      setAutoApproveData(null)
      setConfigValues({})
    } finally {
      setLoadingAutoApprove(false)
    }
  }

  const handleExpenseFormChange = (field, value) => {
    setExpenseForm((prev) => ({ ...prev, [field]: value }))

    // Clear validation error for this field when user starts typing/selecting
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: false }))
    }
  }

  const handleAutoApproveToggle = async (checked) => {
    setExpenseForm((prev) => ({ ...prev, autoApproveConfig: checked }))

    if (checked && expenseForm.systemCategoryId) {
      await getAutoApproveConfig(expenseForm.systemCategoryId)
    } else {
      setAutoApproveData(null)
      setConfigValues({})
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

  // Validation function
  const validateForm = () => {
    const errors = {
      systemCategoryId: !expenseForm.systemCategoryId,
      subcategoryId: !expenseForm.subcategoryId,
      name: !expenseForm.name.trim(),
      workflowId: !expenseForm.workflowId,
    }

    setValidationErrors(errors)

    // Check if any errors exist
    const hasErrors = Object.values(errors).some((error) => error)

    if (hasErrors) {
      const errorMessages = []
      if (errors.systemCategoryId) errorMessages.push("System Category")
      if (errors.subcategoryId) errorMessages.push("Sub Category")
      if (errors.name) errorMessages.push("Expense Type Name")
      if (errors.workflowId) errorMessages.push("Approval Flow")

      showSnackbar(`Please fill in the following required fields: ${errorMessages.join(", ")}`, "error")
      return false
    }

    return true
  }

  const handleAddExpense = async () => {
    try {
      const payload = {
        ...expenseForm,
        ...(expenseForm.autoApproveConfig &&
          Object.keys(configValues).length > 0 && {
            config: configValues,
          }),
      }

      const res = await axios.post(`${baseUrl}/v1/api/expenseType`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      console.log("Expense added:", res.data)
      showSnackbar("Expense type created successfully!")
      router.push("/employeeSetup/NewExpensesDetails/Category")
    } catch (error) {
      console.error("Error adding expense:", error)
      showSnackbar("Error creating expense type", "error")
    }
  }

  const handleUpdateExpense = async (id) => {
    try {
      const payload = {
        ...expenseForm,
        ...(expenseForm.autoApproveConfig &&
          Object.keys(configValues).length > 0 && {
            config: configValues,
          }),
      }

      await axios.put(`${baseUrl}/v1/api/expenseType/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      showSnackbar("Expense type updated successfully!")
      router.push("/categories")
    } catch (error) {
      console.error("Error updating Expense:", error)
      showSnackbar("Error updating expense type", "error")
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    if (expenseForm.id) {
      handleUpdateExpense(expenseForm.expenseTypeId)
    } else {
      handleAddExpense()
    }
  }

  // Form Builder Functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleOpenFormDialog = () => {
    if (hasCustomForm) {
      // If we have a custom form, ensure we have the latest data
      if (formData.fields.length === 0 && expenseForm.formId) {
        loadExistingForm(expenseForm.formId)
      }
      setOpenFormDialog(true)
    } else {
      // Create new form with default Amount field
      const defaultFormName = expenseForm.name ? `${expenseForm.name} Form` : ""
      setFormData({
        name: defaultFormName,
        description: "",
        fields: [DEFAULT_AMOUNT_FIELD], // Add default Amount field
      })
      setOpenFormDialog(true)
    }
  }

  const handleCloseFormDialog = (shouldReset = null) => {
    setOpenFormDialog(false)
    if (shouldReset === true && !hasCustomForm) {
      setFormData({ name: "", description: "", fields: [] })
    }
  }

  const handleOpenFieldDialog = (field = null, index = -1) => {
    if (field) {
      setEditingField(field)
      setEditingFieldIndex(index)
      setFieldForm({
        ...field,
        validation: {
          minLength: field.validation?.minLength || "",
          maxLength: field.validation?.maxLength || "",
          min: field.validation?.min || "",
          max: field.validation?.max || "",
          pattern: field.validation?.pattern || "",
          customValidation: field.validation?.customValidation || "",
          ...field.validation,
        },
        conditionalLogic: field.conditionalLogic || {
          enabled: false,
          showIf: {
            displayOrder: "",
            operator: "equals",
            value: "",
          },
        },
        options: field.options || [],
        placeholder: field.placeholder || "",
        helpText: field.helpText || "",
        defaultValue: field.defaultValue || "",
      })
    } else {
      setEditingField(null)
      setEditingFieldIndex(-1)
      // Set display order to be the next available number
      const nextDisplayOrder = formData.fields.length + 1
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
        displayOrder: nextDisplayOrder,
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
  }

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

  const cleanFieldData = (field) => {
    const cleanedField = { ...field }

    if (!cleanedField.fieldName && cleanedField.label) {
      cleanedField.fieldName = cleanedField.label
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
    }

    const cleanedValidation = {}
    Object.entries(cleanedField.validation || {}).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        cleanedValidation[key] = value
      }
    })
    if (Object.keys(cleanedValidation).length > 0) {
      cleanedField.validation = cleanedValidation
    } else {
      cleanedField.validation = null // Set to null instead of deleting
    }

    if (!["text", "textarea", "email", "phone"].includes(cleanedField.fieldType)) {
      delete cleanedField.placeholder
    }

    if (!["select", "multiselect", "radio"].includes(cleanedField.fieldType)) {
      delete cleanedField.options
    }

    if (cleanedField.conditionalLogic?.enabled) {
      cleanedField.conditionalLogic = {
        showIf: {
          displayOrder: Number.parseInt(cleanedField.conditionalLogic.showIf.displayOrder),
          operator: cleanedField.conditionalLogic.showIf.operator,
          value: cleanedField.conditionalLogic.showIf.value,
        },
      }
    } else {
      delete cleanedField.conditionalLogic
    }

    cleanedField.displayOrder = Number.parseInt(cleanedField.displayOrder)

    if (cleanedField.fieldType === "multiselect" && typeof cleanedField.defaultValue === "string") {
      cleanedField.defaultValue = cleanedField.defaultValue.split(",").map((v) => v.trim())
    }

    return cleanedField
  }

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

  const handleDeleteField = (index) => {
    // Prevent deletion of the default Amount field (first field with fieldName "Amount")
    const fieldToDelete = formData.fields[index]
    if (fieldToDelete.fieldName === "Amount" && fieldToDelete.displayOrder === 1) {
      showSnackbar("Cannot delete the default Amount field", "error")
      return
    }

    const updatedFields = formData.fields.filter((_, i) => i !== index)
    // Update display orders
    const reorderedFields = updatedFields.map((field, idx) => ({
      ...field,
      displayOrder: idx + 1,
    }))
    setFormData((prev) => ({ ...prev, fields: reorderedFields }))
    showSnackbar("Field deleted successfully")
  }

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
      let response
      if (hasCustomForm && expenseForm.formId) {
        response = await axios.put(`${baseUrl}/v1/api/dynamicForm/${expenseForm.formId}`, formData, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })
        console.log("Form updated:", response)
        showSnackbar("Custom form updated successfully!")
      } else {
        response = await axios.post(`${baseUrl}/v1/api/dynamicForm`, formData, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })
        console.log("Form created:", response)
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

  const handleRemoveCustomForm = () => {
    if (window.confirm("Are you sure you want to remove this custom form? This action cannot be undone.")) {
      setHasCustomForm(false)
      setCreatedFormName("")
      setExpenseForm((prev) => ({ ...prev, formId: "" }))
      setFormData({ name: "", description: "", fields: [] })
      showSnackbar("Custom form removed")
    }
  }

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

  const getAvailableFieldsForConditional = () => {
    return formData.fields
      .filter((field, index) => index !== editingFieldIndex)
      .map((field) => ({
        displayOrder: field.displayOrder,
        label: field.label,
        fieldType: field.fieldType,
      }))
  }

  const loadExistingForm = async (formId) => {
    try {
      const response = await axios.get(`${baseUrl}/v1/api/dynamicForm/${formId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      if (response.data) {
        const existingForm = response.data.items || response.data
        const formDataToSet = {
          name: existingForm.name || "",
          description: existingForm.description || "",
          fields: existingForm.fields || [],
        }
        setFormData(formDataToSet)
        setCreatedFormName(existingForm.name || "")
        console.log("Loaded existing form:", formDataToSet)
      }
    } catch (error) {
      console.error("Error loading existing form:", error)
      showSnackbar("Error loading form data", "error")
    }
  }

  useEffect(() => {
    getAllCategory()
    getAllWorkflows()
  }, [])

  useEffect(() => {
    if (expenseForm?.systemCategoryId) {
      getAllSubCategoryFilter(expenseForm.systemCategoryId)

      // If auto-approve is enabled, fetch the config
      if (expenseForm.autoApproveConfig) {
        getAutoApproveConfig(expenseForm.systemCategoryId)
      }
    }
  }, [expenseForm?.systemCategoryId])

  useEffect(() => {
    if (expenseForm.formId && !hasCustomForm) {
      setHasCustomForm(true)
      loadExistingForm(expenseForm.formId)
    }
  }, [expenseForm.formId])

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
              Create Expense Type
            </Typography>
            <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
              Add a new expense type under a sub category
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
              value={expenseForm.systemCategoryId}
              onChange={(e) => handleExpenseFormChange("systemCategoryId", e.target.value)}
              displayEmpty
              error={validationErrors.systemCategoryId}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: validationErrors.systemCategoryId ? "error.main" : undefined,
                },
              }}
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
            {validationErrors.systemCategoryId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                System Category is required
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography fontWeight={600} color="#262E3D" mb={2}>
              Select Sub Category
            </Typography>
            <Select
              fullWidth
              value={expenseForm.subcategoryId}
              onChange={(e) => handleExpenseFormChange("subcategoryId", e.target.value)}
              displayEmpty
              disabled={!expenseForm.systemCategoryId}
              error={validationErrors.subcategoryId}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: validationErrors.subcategoryId ? "error.main" : undefined,
                },
              }}
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
            {validationErrors.subcategoryId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                Sub Category is required
              </Typography>
            )}
          </Grid>

          {/* Expense Type Name */}
          <Grid item xs={12} sm={6}>
            <Typography fontWeight={600} color="#262E3D" mb={2}>
              Expense Type Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter Expense Type Name"
              value={expenseForm.name}
              onChange={(e) => handleExpenseFormChange("name", e.target.value)}
              error={validationErrors.name}
              helperText={validationErrors.name ? "Expense Type Name is required" : ""}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: validationErrors.name ? "error.main" : undefined,
                },
              }}
            />
          </Grid>

          {/* Approval Flow */}
          <Grid item xs={12} sm={6}>
            <Typography fontWeight={600} color="#262E3D" mb={2}>
              Select Approval Flow
            </Typography>
            <Select
              fullWidth
              value={expenseForm.workflowId}
              onChange={(e) => handleExpenseFormChange("workflowId", e.target.value)}
              displayEmpty
              error={validationErrors.workflowId}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: validationErrors.workflowId ? "error.main" : undefined,
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Approval Flow
              </MenuItem>
              {workflows.map((cat) => (
                <MenuItem key={cat.workflowId} value={cat.workflowId}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
            {validationErrors.workflowId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                Approval Flow is required
              </Typography>
            )}
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
              value={expenseForm.description}
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
                      checked={expenseForm.autoApproveConfig}
                      onChange={(e) => handleAutoApproveToggle(e.target.checked)}
                      disabled={!expenseForm.systemCategoryId}
                    />
                  }
                  label="Enable Auto Approve Configuration"
                />
                {!expenseForm.systemCategoryId && (
                  <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                    Please select a system category first
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Auto Approve Configuration Fields */}
          {expenseForm.autoApproveConfig && (
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
                  ) : expenseForm.autoApproveConfig && !loadingAutoApprove ? (
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
                        ✓ Custom Form Created
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
                    No custom form created yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Create a custom form to collect additional information for this expense type
                  </Typography>
                  {/* <Alert severity="info" sx={{ mb: 2, textAlign: "left" }}>
                    <Typography variant="body2">
                      <strong>Note:</strong> A default "Amount" field will be automatically added to your custom form.
                    </Typography>
                  </Alert> */}
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenFormDialog}
                    disabled={!expenseForm.name}
                    sx={{
                      textTransform: "none",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    Create Custom Form
                  </Button>
                  {!expenseForm.name && (
                    <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                      Please enter expense type name first
                    </Typography>
                  )}
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
            onClick={handleSubmit}
            startIcon={<Save />}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              minWidth: 120,
            }}
          >
            {expenseForm.id ? "Update Expense" : "Add Expense"}
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
          <Grid container spacing={3} marginTop={1}>
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
                          return (
                            <Card
                              key={index}
                              variant="outlined"
                              sx={{
                                bgcolor: isDefaultAmountField ? "#e8f5e8" : "white",
                                border: isDefaultAmountField ? "2px solid #4caf50" : "1px solid #e0e0e0",
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
                                      bgcolor: isDefaultAmountField ? "success.main" : "primary.main",
                                      color: "white",
                                      fontSize: "0.75rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {field.displayOrder}
                                  </Box>
                                  <IconComponent
                                    sx={{ color: isDefaultAmountField ? "success.main" : "text.secondary" }}
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
                                    <IconButton size="small" onClick={() => handleOpenFieldDialog(field, index)}
                                        disabled={isDefaultAmountField}
                                      sx={{
                                        opacity: isDefaultAmountField ? 0.5 : 1,
                                        cursor: isDefaultAmountField ? "not-allowed" : "pointer",
                                      }}
                                        >
                                      <EditIcon fontSize="small"
                                        color={isDefaultAmountField ? "disabled" : "error"} />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteField(index)}
                                      disabled={isDefaultAmountField}
                                      sx={{
                                        opacity: isDefaultAmountField ? 0.5 : 1,
                                        cursor: isDefaultAmountField ? "not-allowed" : "pointer",
                                      }}
                                    >
                                      <DeleteIcon
                                        fontSize="small"
                                        color={isDefaultAmountField ? "disabled" : "error"}
                                      />
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

      {/* Field Builder Dialog */}
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Field Type
              </Typography>
              <FormControl fullWidth>
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={fieldForm.isRequired}
                    onChange={(e) => handleFieldFormChange("isRequired", e.target.checked)}
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
                        />
                        <TextField
                          placeholder="Value"
                          value={option.value || ""}
                          onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <IconButton color="error" onClick={() => handleDeleteOption(index)} size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddOption}
                      variant="outlined"
                      sx={{ textTransform: "none" }}
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
              <Accordion>
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
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Conditional Logic */}
            <Grid item xs={12}>
              <Accordion>
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
                          <FormControl fullWidth size="small">
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
                          <FormControl fullWidth size="small">
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
          <Button onClick={handleSaveField} variant="contained" disabled={!fieldForm.label}>
            {editingField ? "Update Field" : "Add Field"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
