// "use client"

// import { useState, useEffect, useRef, useMemo } from "react"
// import {
//   Box,
//   Grid,
//   TextField,
//   Typography,
//   Paper,
//   Button,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Switch,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Snackbar,
//   Alert,
//   FormControlLabel,
//   Input,
//   RadioGroup,
//   Radio,
//   FormLabel,
//   FormHelperText,
// } from "@mui/material"
// import CategoryIcon from "@mui/icons-material/Category"
// import CloudUploadIcon from "@mui/icons-material/CloudUpload"
// import { DataGrid } from "@mui/x-data-grid"
// import axios from "axios"
// import AddIcon from "@mui/icons-material/Add"
// import CloseIcon from "@mui/icons-material/Close"
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
// import { DatePicker } from "@mui/x-date-pickers/DatePicker"
// import dayjs from "dayjs"
// import { CreditCard, DateRange, Flag, FolderOpen, Person } from "@mui/icons-material"

// export default function Expense() {
//   const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
//   const [allExpense, setAllExpense] = useState([])
//   const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState(false)
//   const [newExpenseData, setNewExpenseData] = useState({
//     expenseTypeId: "",
//     workflowId: "",
//     currency: "INR",
//     department: "",
//     project: "",
//     priority: "Normal",
//   })

//   const [expenses, setExpenses] = useState([])
//   const [workflows, setWorkflows] = useState([])
//   const [dynamicFormFields, setDynamicFormFields] = useState([])
//   const [dynamicFormData, setDynamicFormData] = useState({})
//   const [dynamicFieldErrors, setDynamicFieldErrors] = useState({})
//   const [fileUploadLoading, setFileUploadLoading] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const fileInputRefs = useRef({})

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   })

//   const formatDate = (isoString) => {
//     if (!isoString) return ""
//     return new Date(isoString).toLocaleDateString()
//   }

// //   const columns = [
// //     { field: "name", headerName: "Project", flex: 1, minWidth: 150 },
// //     { field: "subcategoryName", headerName: "Expense Type", flex: 1, minWidth: 150 },
// //     { field: "systemCategoryName", headerName: "Submitted By", flex: 1, minWidth: 150 },
// //     { field: "priority", headerName: "Priority", flex: 1, minWidth: 150 },
// //     { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 150 },
// //   ]

// const columns = useMemo(
//   () => [
//     {
//       field: "name",
//       headerName: "Project",
//       flex: 1,
//       minWidth: 150,

//       renderHeader: () => (
//         <Box display='flex' alignItems='center' gap={1}>
//           <FolderOpen sx={{ fontSize: 18, color: '#fff' }} />
//           Project
//         </Box>
//       ),
//       renderCell: ({ value }) => <Typography variant='body2'>{value || 'N/A'}</Typography>
//     },
//     {
//       field: "subcategoryName",
//       headerName: "Expense Type",
//       flex: 1,
//       minWidth: 150,
//       renderHeader: () => (
//         <Box display='flex' alignItems='center' gap={1}>
//           <CreditCard sx={{ fontSize: 18, color: '#fff' }} />
//           Expense Type
//         </Box>
//       ),
//       renderCell: ({ value }) => <Typography variant='body2'>{value || 'N/A'}</Typography>
//     },
//     {
//       field: "systemCategoryName",
//       headerName: "Submitted By",
//       flex: 1,
//       minWidth: 150,
//       renderHeader: () => (
//         <Box display='flex' alignItems='center' gap={1}>
//           <Person sx={{ fontSize: 18, color: '#fff' }} />
//           Submitted By
//         </Box>
//       ),
//       renderCell: ({ value }) => <Typography variant='body2'>{value || 'N/A'}</Typography>
//     },
//     {
//       field: "priority",
//       headerName: "Priority",
//       flex: 1,
//       minWidth: 150,
//       renderHeader: () => (
//         <Box display='flex' alignItems='center' gap={1}>
//           <Flag sx={{ fontSize: 18, color: '#fff' }} />
//           Priority
//         </Box>
//       ),
//       renderCell: ({ value }) => <Typography variant='body2'>{value || 'N/A'}</Typography>
//     },
//     {
//       field: "createdAt",
//       headerName: "Created At",
//       flex: 1,
//       minWidth: 150,
//       renderHeader: () => (
//         <Box display='flex' alignItems='center' gap={1}>
//           <DateRange sx={{ fontSize: 18, color: '#fff' }} />
//           Created At
//         </Box>
//       ),
//       renderCell: ({ value }) => <Typography variant='body2'>{value || 'N/A'}</Typography>
//     },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       flex: 1,
//       minWidth: 150,
//       sortable: false,
//       renderHeader: () => (
//         <Box display='flex' alignItems='center' gap={1}>
//           <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'white' }}>
//             Actions
//           </Typography>
//         </Box>
//       ),
//       renderCell: ({ row }) => (
//         <Button
//           variant='contained'
//           size='small'
//           onClick={() => handleViewExpense(row)}
//           sx={{
//             bgcolor: '#3b82f6',
//             '&:hover': { bgcolor: '#2563eb' },
//             textTransform: 'none',
//             borderRadius: '8px',
//             boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
//           }}
//           aria-label={`View expense details`}
//         >
//           View
//         </Button>
//       )
//     }
//   ],
//   []
// )

//   const getAllSubmissions = async () => {
//     if (!token) {
//       console.error("Authentication token not found.")
//       return
//     }
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/expenseSubmission/employee`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Fetched all submissions:", res.data)
//       const expenses = res.data?.items?.submissions || []
//       const formatted = expenses.map((item, index) => ({
//         id: item._id || index,
//         name: item.project,
//         subcategoryName: item.expenseTypeId?.name || "N/A",
//         systemCategoryName: item.submittedBy?.employeName || "N/A",
//         priority: item.priority || "N/A",
//         formData: item.formData || {},
//         createdAt: formatDate(item.createdAt),
//       }))
//       setAllExpense(formatted)
//     } catch (error) {
//       console.error("Error fetching submit expenses:", error)
//       setSnackbar({ open: true, message: "Error fetching expense submissions.", severity: "error" })
//     }
//   }

//   const getAllExpenseTypes = async () => {
//     if (!token) {
//       console.error("Authentication token not found.")
//       return
//     }
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/expenseType`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Fetched all expense types:", res.data)
//       const expenseTypes = res.data?.items?.expenseTypes || []
//       setExpenses(expenseTypes)
//     } catch (error) {
//       console.error("Error fetching expense types:", error)
//       setSnackbar({ open: true, message: "Error fetching expense types.", severity: "error" })
//     }
//   }

//   const getAllWorkflow = async () => {
//     if (!token) {
//       console.error("Authentication token not found.")
//       return
//     }
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/workflow/all`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Fetched all workflows:", res.data)
//       const workflows = res.data?.items?.workflows || []
//       setWorkflows(workflows)
//     } catch (error) {
//       console.error("Error fetching workflows:", error)
//       setSnackbar({ open: true, message: "Error fetching workflows.", severity: "error" })
//     }
//   }

//   const getExpenseDetails = async (expenseId) => {
//     if (!token) {
//       console.error("Authentication token not found.")
//       return
//     }
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/expenseType/${expenseId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Fetched expense details by ID:", res.data)
//       const formFields = res.data?.items?.formId?.fields || []
//       setDynamicFormFields(formFields)

//       const initialDynamicData = {}
//       formFields.forEach((field) => {
//         if (field.fieldType === "checkbox") {
//           initialDynamicData[field.fieldId] = field.defaultValue === true
//         } else if (field.fieldType === "date") {
//           initialDynamicData[field.fieldId] = field.defaultValue ? dayjs(field.defaultValue) : null
//         } else {
//           initialDynamicData[field.fieldId] = field.defaultValue || ""
//         }
//       })
//       setDynamicFormData(initialDynamicData)
//       setDynamicFieldErrors({})

//       setSnackbar({ open: true, message: "Expense details loaded successfully!", severity: "success" })
//     } catch (error) {
//       console.error("Error fetching expense details by ID:", error)
//       setSnackbar({ open: true, message: "Error fetching expense details. Please try again.", severity: "error" })
//       setDynamicFormFields([])
//       setDynamicFormData({})
//       setDynamicFieldErrors({})
//     }
//   }

//   useEffect(() => {
//     getAllSubmissions()
//     getAllExpenseTypes()
//     getAllWorkflow()
//   }, [])

//   const handleOpenAddExpenseDialog = () => {
//     setOpenAddExpenseDialog(true)
//   }

//   const handleCloseAddExpenseDialog = () => {
//     setOpenAddExpenseDialog(false)
//     setNewExpenseData({
//       expenseTypeId: "",
//       workflowId: "",
//       currency: "INR",
//       department: "",
//       project: "",
//       priority: "Normal",
//     })
//     setDynamicFormFields([])
//     setDynamicFormData({})
//     setDynamicFieldErrors({})
//   }

//   const validateField = (field, value) => {
//     let error = ""
//     if (
//       field.isRequired &&
//       (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0))
//     ) {
//       error = `${field.label} is required.`
//       return error
//     }

//     if (field.validation) {
//       const { minLength, maxLength, min, max, pattern, customValidation } = field.validation

//       if (minLength && typeof value === "string" && value.length < minLength) {
//         error = `${field.label} must be at least ${minLength} characters.`
//       }
//       if (maxLength && typeof value === "string" && value.length > maxLength) {
//         error = `${field.label} must be at most ${maxLength} characters.`
//       }
//       if (min !== null && value !== null && typeof value === "number" && value < min) {
//         error = `${field.label} must be at least ${min}.`
//       }
//       if (max !== null && value !== null && typeof value === "number" && value > max) {
//         error = `${field.label} must be at most ${max}.`
//       }
//       if (pattern && typeof value === "string" && !new RegExp(pattern).test(value)) {
//         error = `${field.label} format is invalid.`
//       }
//       if (customValidation && typeof value === "string") {
//         try {
//           const customValidationFunc = new Function("value", `return ${customValidation}`)
//           if (!customValidationFunc(value)) {
//             error = `${field.label} failed custom validation.`
//           }
//         } catch (e) {
//           console.error("Error evaluating custom validation:", e)
//           error = `${field.label} has an invalid custom validation rule.`
//         }
//       }
//     }
//     return error
//   }

//   const handleNewExpenseChange = async (e) => {
//     const { name, value } = e.target
//     setNewExpenseData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }))

//     if (name === "expenseTypeId") {
//       if (value) {
//         await getExpenseDetails(value)
//       } else {
//         setDynamicFormFields([])
//         setDynamicFormData({})
//         setDynamicFieldErrors({})
//       }
//     }
//   }

//   const uploadFiles = async (fieldId, files) => {
//     if (!token) {
//       setSnackbar({ open: true, message: "Authentication token not found for file upload.", severity: "error" })
//       return
//     }
//     if (files.length === 0) return

//     setFileUploadLoading(true)
//     const formData = new FormData()
//     for (let i = 0; i < files.length; i++) {
//       formData.append("files", files[i])
//     }

//     try {
//       const res = await axios.post(`${baseUrl}/v1/api/upload/uploadMultiple`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           authorization: token,
//         },
//       })
//       console.log("Files uploaded successfully:", res.data)
//       const uploadedUrls = res.data?.items || []

//       setDynamicFormData((prevData) => ({
//         ...prevData,
//         [fieldId]: uploadedUrls,
//       }))
//       setSnackbar({ open: true, message: "Files uploaded successfully!", severity: "success" })
//     } catch (error) {
//       console.error("Error uploading files:", error)
//       setSnackbar({ open: true, message: "Error uploading files. Please try again.", severity: "error" })
//     } finally {
//       setFileUploadLoading(false)
//     }
//   }

//   const handleDynamicFieldChange = async (fieldId, value, fieldType, fieldDefinition) => {
//     let newValue = value
//     if (fieldType === "checkbox") {
//       newValue = !dynamicFormData[fieldId]
//     } else if (fieldType === "file") {
//       if (value && value.length > 0) {
//         await uploadFiles(fieldId, value)
//       }
//       return
//     } else if (fieldType === "date") {
//       newValue = value ? value.toISOString() : ""
//     }

//     setDynamicFormData((prevData) => {
//       const updatedData = {
//         ...prevData,
//         [fieldId]: newValue,
//       }
//       const newErrors = { ...dynamicFieldErrors }
//       dynamicFormFields.forEach((field) => {
//         if (field.conditionalLogic && field.conditionalLogic.showIf.fieldId === fieldId) {
//           const dependentFieldValue = updatedData[field.fieldId]
//           newErrors[field.fieldId] = validateField(field, dependentFieldValue)
//         }
//       })
//       setDynamicFieldErrors(newErrors)
//       return updatedData
//     })

//     const error = validateField(fieldDefinition, newValue)
//     setDynamicFieldErrors((prevErrors) => ({
//       ...prevErrors,
//       [fieldId]: error,
//     }))
//   }

//   const shouldRenderField = (field) => {
//     if (!field.conditionalLogic) {
//       return true
//     }
//     const { showIf } = field.conditionalLogic
//     const dependentFieldValue = dynamicFormData[showIf.fieldId]

//     switch (showIf.operator) {
//       case "equals":
//         return dependentFieldValue === showIf.value
//       case "notEquals":
//         return dependentFieldValue !== showIf.value
//       default:
//         return true
//     }
//   }

//   const handleAddExpenseSubmit = async () => {
//     if (!token) {
//       console.error("Authentication token not found.")
//       setSnackbar({ open: true, message: "Authentication required to submit expense.", severity: "error" })
//       return
//     }

//     let hasErrors = false
//     const newErrors = {}
//     dynamicFormFields.forEach((field) => {
//       if (shouldRenderField(field)) {
//         const value = dynamicFormData[field.fieldId]
//         const error = validateField(field, value)
//         if (error) {
//           newErrors[field.fieldId] = error
//           hasErrors = true
//         }
//       }
//     })
//     setDynamicFieldErrors(newErrors)

//     if (hasErrors) {
//       setSnackbar({ open: true, message: "Please correct the errors in the form.", severity: "error" })
//       return
//     }

//     setIsSubmitting(true)

//     const payload = {
//       expenseTypeId: newExpenseData.expenseTypeId,
//       workflowId: newExpenseData.workflowId,
//       currency: newExpenseData.currency,
//       department: newExpenseData.department,
//       project: newExpenseData.project,
//       priority: newExpenseData.priority,
//       formData: dynamicFormData,
//     }

//     console.log("Submitting new expense payload:", payload)

//     try {
//       const res = await axios.post(`${baseUrl}/v1/api/expenseSubmission`, payload, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Expense submitted successfully:", res.data)
//       setSnackbar({ open: true, message: "Expense submitted successfully!", severity: "success" })
//       handleCloseAddExpenseDialog()
//       getAllSubmissions()
//     } catch (error) {
//       console.error("Error submitting expense:", error)
//       setSnackbar({ open: true, message: "Error submitting expense. Please try again.", severity: "error" })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === "clickaway") {
//       return
//     }
//     setSnackbar({ ...snackbar, open: false })
//   }

//   const handleViewExpense = (row) => {
//     console.log("Viewing expense:", row)
//   }

//   return (
//     <Box sx={{ width: "100%", overflowX: "auto" }}>
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
//         <Box
//           sx={{
//             position: "absolute",
//             top: -50,
//             right: -50,
//             width: "150px",
//             height: "150px",
//             background: "rgba(255, 255, 255, 0.1)",
//             borderRadius: "50%",
//             animation: "float 6s ease-in-out infinite",
//             "@keyframes float": {
//               "0%, 100%": { transform: "translateY(0px)" },
//               "50%": { transform: "translateY(-20px)" },
//             },
//           }}
//         />
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Box
//               sx={{
//                 p: 1.5,
//                 borderRadius: "50%",
//                 background: "rgba(255, 255, 255, 0.15)",
//                 backdropFilter: "blur(5px)",
//                 border: "1px solid rgba(255, 255, 255, 0.2)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <CategoryIcon sx={{ fontSize: 32, color: "white" }} />
//             </Box>
//             <Box>
//               <Typography variant="h4" fontWeight={600} sx={{ color: "white", mb: "-5px" }}>
//                 Expense
//               </Typography>
//               <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
//                 Add and manage expense for organizing data and workflows.
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Paper>
//       <Box sx={{ p: 4, border: "1px solid #EAECF0" }}>
//         <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
//           <Box>
//             <Typography variant="h5" fontWeight={600} color="#262E3D">
//               Expenses
//             </Typography>
//             <Typography variant="body2" sx={{ color: "#667085", fontSize: "0.850rem" }}>
//               Built-in expense with unique business logic and features
//             </Typography>
//           </Box>
//           <Box>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               sx={{
//                 textTransform: "none",
//                 borderRadius: 2,
//                 bgcolor: "#667eea",
//                 "&:hover": {
//                   bgcolor: "#764ba2",
//                 },
//               }}
//               onClick={handleOpenAddExpenseDialog}
//             >
//               Add Expense
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//       <Box sx={{ width: "100%", overflowX: "auto", p: 4 }}>
//         <DataGrid
//           rows={allExpense}
//           columns={columns}
//           autoHeight
//           rowHeight={60}
//           sx={{
//             "& .MuiDataGrid-columnHeaders": {
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               color: "#fff",
//               fontWeight: 600,
//             },
//             "& .MuiDataGrid-columnHeaderTitle": {
//               fontWeight: "bold",
//               color: "#fff",
//             },
//             "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
//               color: "#fff",
//             },
//             "& .MuiDataGrid-cell": {
//               borderBottom: "1px solid rgba(224, 224, 224, 1)",
//               display: "flex",
//               alignItems: "center",
//             },
//             "& .MuiDataGrid-row": {
//               "&:hover": {
//                 backgroundColor: "rgba(25, 118, 210, 0.04)",
//                 cursor: "pointer",
//               },
//             },
//             "& .MuiDataGrid-toolbarContainer": {
//               padding: "12px",
//               backgroundColor: "#f8f9fa",
//               borderBottom: "1px solid #e0e0e0",
//             },
//           }}
//         />
//       </Box>

//       {/* Add Expense Dialog */}
//       <Dialog open={openAddExpenseDialog} onClose={handleCloseAddExpenseDialog} fullWidth maxWidth="md">
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             color: "white",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h4" component="div" sx={{ color: "white" }}>
//             Add New Expense
//           </Typography>
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseAddExpenseDialog}
//             sx={{
//               color: "white",
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth margin="normal" size="medium">
//                 <InputLabel id="expense-type-label">Expense Type</InputLabel>
//                 <Select
//                   labelId="expense-type-label"
//                   id="expenseTypeId"
//                   name="expenseTypeId"
//                   value={newExpenseData.expenseTypeId}
//                   label="Expense Type"
//                   onChange={handleNewExpenseChange}
//                 >
//                   {expenses.map((expense) => (
//                     <MenuItem key={expense.expenseTypeId} value={expense.expenseTypeId}>
//                       {expense.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth margin="normal" size="medium">
//                 <InputLabel id="workflow-label">Work-Flow</InputLabel>
//                 <Select
//                   labelId="workflow-label"
//                   id="workflowId"
//                   name="workflowId"
//                   value={newExpenseData.workflowId}
//                   label="Work-Flow"
//                   onChange={handleNewExpenseChange}
//                 >
//                   {workflows.map((workflow) => (
//                     <MenuItem key={workflow.workflowId} value={workflow.workflowId}>
//                       {workflow.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Currency"
//                 name="currency"
//                 value={newExpenseData.currency}
//                 onChange={handleNewExpenseChange}
//                 margin="normal"
//                 size="medium"
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Department"
//                 name="department"
//                 value={newExpenseData.department}
//                 onChange={handleNewExpenseChange}
//                 margin="normal"
//                 size="medium"
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Project"
//                 name="project"
//                 value={newExpenseData.project}
//                 onChange={handleNewExpenseChange}
//                 margin="normal"
//                 size="medium"
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth margin="normal" size="medium">
//                 <InputLabel id="priority-label">Priority</InputLabel>
//                 <Select
//                   labelId="priority-label"
//                   id="priority"
//                   name="priority"
//                   value={newExpenseData.priority}
//                   label="Priority"
//                   onChange={handleNewExpenseChange}
//                 >
//                   <MenuItem value="Low">Low</MenuItem>
//                   <MenuItem value="Normal">Normal</MenuItem>
//                   <MenuItem value="High">High</MenuItem>
//                   <MenuItem value="Urgent">Urgent</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Dynamic Form Fields */}
//             {dynamicFormFields.length > 0 && (
//               <Grid item xs={12}>
//                 <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
//                   Additional Details
//                 </Typography>
//               </Grid>
//             )}
//             {dynamicFormFields.map((field) =>
//               shouldRenderField(field) ? (
//                 <Grid item xs={12} sm={6} key={field.fieldId}>
//                   {field.fieldType === "text" || field.fieldType === "number" ? (
//                     <TextField
//                       fullWidth
//                       label={field.label}
//                       name={field.fieldId}
//                       type={field.fieldType === "number" ? "number" : "text"}
//                       value={dynamicFormData[field.fieldId] || ""}
//                       onChange={(e) => handleDynamicFieldChange(field.fieldId, e.target.value, field.fieldType, field)}
//                       margin="normal"
//                       size="medium"
//                       required={field.isRequired}
//                       placeholder={field.placeholder}
//                       InputLabelProps={{ shrink: true }}
//                       error={!!dynamicFieldErrors[field.fieldId]}
//                       helperText={dynamicFieldErrors[field.fieldId] || field.helpText}
//                     />
//                   ) : field.fieldType === "date" ? (
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                       <DatePicker
//                         label={field.label}
//                         value={dynamicFormData[field.fieldId] ? dayjs(dynamicFormData[field.fieldId]) : null}
//                         onChange={(newValue) =>
//                           handleDynamicFieldChange(field.fieldId, newValue, field.fieldType, field)
//                         }
//                         slotProps={{
//                           textField: {
//                             fullWidth: true,
//                             margin: "normal",
//                             size: "medium",
//                             required: field.isRequired,
//                             error: !!dynamicFieldErrors[field.fieldId],
//                             helperText: dynamicFieldErrors[field.fieldId] || field.helpText,
//                             InputLabelProps: { shrink: true },
//                           },
//                         }}
//                       />
//                     </LocalizationProvider>
//                   ) : field.fieldType === "select" ? (
//                     <FormControl
//                       fullWidth
//                       margin="normal"
//                       size="medium"
//                       required={field.isRequired}
//                       error={!!dynamicFieldErrors[field.fieldId]}
//                     >
//                       <InputLabel id={`${field.fieldId}-label`}>{field.label}</InputLabel>
//                       <Select
//                         labelId={`${field.fieldId}-label`}
//                         id={field.fieldId}
//                         name={field.fieldId}
//                         value={dynamicFormData[field.fieldId] || ""}
//                         label={field.label}
//                         onChange={(e) =>
//                           handleDynamicFieldChange(field.fieldId, e.target.value, field.fieldType, field)
//                         }
//                       >
//                         {field.options?.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                       {(dynamicFieldErrors[field.fieldId] || field.helpText) && (
//                         <FormHelperText error={!!dynamicFieldErrors[field.fieldId]}>
//                           {dynamicFieldErrors[field.fieldId] || field.helpText}
//                         </FormHelperText>
//                       )}
//                     </FormControl>
//                   ) : field.fieldType === "radio" ? (
//                     <FormControl
//                       component="fieldset"
//                       margin="normal"
//                       size="medium"
//                       required={field.isRequired}
//                       error={!!dynamicFieldErrors[field.fieldId]}
//                     >
//                       <FormLabel component="legend">{field.label}</FormLabel>
//                       <RadioGroup
//                         row
//                         name={field.fieldId}
//                         value={dynamicFormData[field.fieldId] || ""}
//                         onChange={(e) =>
//                           handleDynamicFieldChange(field.fieldId, e.target.value, field.fieldType, field)
//                         }
//                       >
//                         {field.options?.map((option) => (
//                           <FormControlLabel
//                             key={option.value}
//                             value={option.value}
//                             control={<Radio size="medium" />}
//                             label={option.label}
//                           />
//                         ))}
//                       </RadioGroup>
//                       {(dynamicFieldErrors[field.fieldId] || field.helpText) && (
//                         <FormHelperText error={!!dynamicFieldErrors[field.fieldId]}>
//                           {dynamicFieldErrors[field.fieldId] || field.helpText}
//                         </FormHelperText>
//                       )}
//                     </FormControl>
//                   ) : field.fieldType === "checkbox" ? (
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={dynamicFormData[field.fieldId] || false}
//                           onChange={() => handleDynamicFieldChange(field.fieldId, null, field.fieldType, field)}
//                           name={field.fieldId}
//                         />
//                       }
//                       label={field.label}
//                       sx={{ mt: 2, mb: 1 }}
//                     />
//                   ) : field.fieldType === "file" ? (
//                     <Box sx={{ marginY: 0.5 }}>
//                       {" "}
//                       {/* Use "normal" to match other fields' margin */}
//                       <fieldset
//                         style={{
//                           border: `2px dashed ${dynamicFieldErrors[field.fieldId] ? "#f44336" : "#ccc"}`,
//                           borderRadius: "4px",
//                           padding: "8px 8px", // Reduced vertical padding
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           cursor: "pointer",
//                           minHeight: "46px", // Adjusted minHeight to match TextField/Select height
//                           position: "relative",
//                           opacity: fileUploadLoading ? 0.7 : 1,
//                           pointerEvents: fileUploadLoading ? "none" : "auto",
//                         }}
//                         onClick={() => fileInputRefs.current[field.fieldId]?.click()}
//                       >
//                         <legend
//                           style={{
//                             padding: "0 8px",
//                             marginLeft: "10px",
//                             color: dynamicFieldErrors[field.fieldId] ? "#f44336" : "rgba(0, 0, 0, 0.6)",
//                             fontSize: "0.75rem",
//                             fontWeight: 400,
//                           }}
//                         >
//                           {field.label} {field.isRequired && "*"}
//                         </legend>
//                         <CloudUploadIcon sx={{ fontSize: 24, color: "#667eea", mb: 0.5 }} /> {/* Smaller icon */}
//                         <Typography variant="caption" color="textSecondary">
//                           {" "}
//                           {/* Smaller text */}
//                           {fileUploadLoading ? "Uploading..." : "Upload files"}
//                         </Typography>
//                         {dynamicFormData[field.fieldId] &&
//                           Array.isArray(dynamicFormData[field.fieldId]) &&
//                           dynamicFormData[field.fieldId].length > 0 && (
//                             <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
//                               Uploaded: {dynamicFormData[field.fieldId].length} file(s)
//                             </Typography>
//                           )}
//                       </fieldset>
//                       <Input
//                         id={field.fieldId}
//                         name={field.fieldId}
//                         type="file"
//                         inputRef={(el) => (fileInputRefs.current[field.fieldId] = el)}
//                         onChange={(e) =>
//                           handleDynamicFieldChange(field.fieldId, e.target.files, field.fieldType, field)
//                         }
//                         inputProps={{ accept: field.validation?.allowedFileTypes || "*", multiple: true }}
//                         sx={{ display: "none" }}
//                         disabled={fileUploadLoading}
//                       />
//                       {(dynamicFieldErrors[field.fieldId] || field.helpText) && (
//                         <FormHelperText error={!!dynamicFieldErrors[field.fieldId]}>
//                           {dynamicFieldErrors[field.fieldId] || field.helpText}
//                         </FormHelperText>
//                       )}
//                     </Box>
//                   ) : null}
//                 </Grid>
//               ) : null,
//             )}
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseAddExpenseDialog} color="primary" disabled={isSubmitting || fileUploadLoading}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleAddExpenseSubmit}
//             color="primary"
//             variant="contained"
//             disabled={isSubmitting || fileUploadLoading}
//           >
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar for feedback */}
//       <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }

// "use client"

// import { useState, useEffect, useRef, useMemo } from "react"
// import {
//   Box,
//   Grid,
//   TextField,
//   Typography,
//   Paper,
//   Button,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Switch,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Snackbar,
//   Alert,
//   FormControlLabel,
//   Input,
//   RadioGroup,
//   Radio,
//   FormLabel,
//   FormHelperText,
//   Link, // Added for clickable links in view dialog
// } from "@mui/material"
// import CategoryIcon from "@mui/icons-material/Category"
// import CloudUploadIcon from "@mui/icons-material/CloudUpload"
// import { DataGrid } from "@mui/x-data-grid"
// import axios from "axios"
// import AddIcon from "@mui/icons-material/Add"
// import CloseIcon from "@mui/icons-material/Close"
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
// import { DatePicker } from "@mui/x-date-pickers/DatePicker"
// import dayjs from "dayjs"
// import { CreditCard, DateRange, Flag, FolderOpen, Person } from "@mui/icons-material"

// export default function Expense() {
//   const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
//   const [allExpense, setAllExpense] = useState([])
//   const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState(false)
//   const [newExpenseData, setNewExpenseData] = useState({
//     expenseTypeId: "",
//     workflowId: "",
//     currency: "INR",
//     department: "",
//     project: "",
//     priority: "Normal",
//   })

//   const [expenses, setExpenses] = useState([])
//   const [workflows, setWorkflows] = useState([])
//   const [dynamicFormFields, setDynamicFormFields] = useState([])
//   const [dynamicFormData, setDynamicFormData] = useState({})
//   const [dynamicFieldErrors, setDynamicFieldErrors] = useState({})
//   const [fileUploadLoading, setFileUploadLoading] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const [openViewExpenseDialog, setOpenViewExpenseDialog] = useState(false) // New state for view dialog
//   const [selectedExpenseDetails, setSelectedExpenseDetails] = useState(null) // New state for selected expense data

//   // New states for static field validation errors
//   const [expenseTypeError, setExpenseTypeError] = useState(false)
//   const [workflowError, setWorkflowError] = useState(false)

//   const fileInputRefs = useRef({})

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   })

//   const formatDate = (isoString) => {
//     if (!isoString) return ""
//     return new Date(isoString).toLocaleDateString()
//   }

//   const columns = useMemo(
//     () => [
//       {
//         field: "name",
//         headerName: "Project",
//         flex: 1,
//         minWidth: 150,
//         renderHeader: () => (
//           <Box display="flex" alignItems="center" gap={1}>
//             <FolderOpen sx={{ fontSize: 18, color: "#fff" }} />
//             Project
//           </Box>
//         ),
//         renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
//       },
//       {
//         field: "subcategoryName",
//         headerName: "Expense Type",
//         flex: 1,
//         minWidth: 150,
//         renderHeader: () => (
//           <Box display="flex" alignItems="center" gap={1}>
//             <CreditCard sx={{ fontSize: 18, color: "#fff" }} />
//             Expense Type
//           </Box>
//         ),
//         renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
//       },
//       {
//         field: "systemCategoryName",
//         headerName: "Submitted By",
//         flex: 1,
//         minWidth: 150,
//         renderHeader: () => (
//           <Box display="flex" alignItems="center" gap={1}>
//             <Person sx={{ fontSize: 18, color: "#fff" }} />
//             Submitted By
//           </Box>
//         ),
//         renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
//       },
//       {
//         field: "priority",
//         headerName: "Priority",
//         flex: 1,
//         minWidth: 150,
//         renderHeader: () => (
//           <Box display="flex" alignItems="center" gap={1}>
//             <Flag sx={{ fontSize: 18, color: "#fff" }} />
//             Priority
//           </Box>
//         ),
//         renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
//       },
//       {
//         field: "createdAt",
//         headerName: "Created At",
//         flex: 1,
//         minWidth: 150,
//         renderHeader: () => (
//           <Box display="flex" alignItems="center" gap={1}>
//             <DateRange sx={{ fontSize: 18, color: "#fff" }} />
//             Created At
//           </Box>
//         ),
//         renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
//       },
//       {
//         field: "actions",
//         headerName: "Actions",
//         flex: 1,
//         minWidth: 150,
//         sortable: false,
//         renderHeader: () => (
//           <Box display="flex" alignItems="center" gap={1}>
//             <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
//               Actions
//             </Typography>
//           </Box>
//         ),
//         renderCell: ({ row }) => (
//           <Button
//             variant="contained"
//             size="small"
//             onClick={() => handleViewExpense(row)}
//             sx={{
//               bgcolor: "#3b82f6",
//               "&:hover": { bgcolor: "#2563eb" },
//               textTransform: "none",
//               borderRadius: "8px",
//               boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)",
//             }}
//             aria-label={`View expense details`}
//           >
//             View
//           </Button>
//         ),
//       },
//     ],
//     [],
//   )

//   const getAllSubmissions = async () => {
//     if (!token) {
//       console.error("Authentication token not found.")
//       return
//     }
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/expenseSubmission/employee`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Fetched all submissions:", res.data)
//       const expenses = res.data?.items?.submissions || []
//       const formatted = expenses.map((item, index) => ({
//         id: item._id || index,
//         name: item.project,
//         subcategoryName: item.expenseTypeId?.name || "N/A",
//         systemCategoryName: item.submittedBy?.employeName || "N/A",
//         priority: item.priority || "N/A",
//         formData: item.formData || {}, // Ensure formData is included
//         createdAt: formatDate(item.createdAt),
//       }))
//       setAllExpense(formatted)
//     } catch (error) {
//       console.error("Error fetching submit expenses:", error)
//       setSnackbar({ open: true, message: "Error fetching expense submissions.", severity: "error" })
//     }
//   }

//   const getAllExpenseTypes = async () => {
//     if (!token) {
//       console.error("Authentication token not found.")
//       return
//     }
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/expenseType`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Fetched all expense types:", res.data)
//       const expenseTypes = res.data?.items?.expenseTypes || []
//       setExpenses(expenseTypes)
//     } catch (error) {
//       console.error("Error fetching expense types:", error)
//       setSnackbar({ open: true, message: "Error fetching expense types.", severity: "error" })
//     }
//   }

//   const getAllWorkflow = async () => {
//     if (!token) {
//       console.error("Authentication token not found.")
//       return
//     }
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/workflow/all`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Fetched all workflows:", res.data)
//       const workflows = res.data?.items?.workflows || []
//       setWorkflows(workflows)
//     } catch (error) {
//       console.error("Error fetching workflows:", error)
//       setSnackbar({ open: true, message: "Error fetching workflows.", severity: "error" })
//     }
//   }

//   const getExpenseDetails = async (expenseId) => {
//     if (!token) {
//       console.error("Authentication token not found.")
//       return
//     }
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/expenseType/${expenseId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Fetched expense details by ID:", res.data)
//       const formFields = res.data?.items?.formId?.fields || []
//       setDynamicFormFields(formFields)

//       const initialDynamicData = {}
//       formFields.forEach((field) => {
//         if (field.fieldType === "checkbox") {
//           initialDynamicData[field.fieldId] = field.defaultValue === true
//         } else if (field.fieldType === "date") {
//           initialDynamicData[field.fieldId] = field.defaultValue ? dayjs(field.defaultValue) : null
//         } else {
//           initialDynamicData[field.fieldId] = field.defaultValue || ""
//         }
//       })
//       setDynamicFormData(initialDynamicData)
//       setDynamicFieldErrors({})

//       setSnackbar({ open: true, message: "Expense details loaded successfully!", severity: "success" })
//     } catch (error) {
//       console.error("Error fetching expense details by ID:", error)
//       setSnackbar({ open: true, message: "Error fetching expense details. Please try again.", severity: "error" })
//       setDynamicFormFields([])
//       setDynamicFormData({})
//       setDynamicFieldErrors({})
//     }
//   }

//   useEffect(() => {
//     getAllSubmissions()
//     getAllExpenseTypes()
//     getAllWorkflow()
//   }, [])

//   const handleOpenAddExpenseDialog = () => {
//     setOpenAddExpenseDialog(true)
//     // Reset static field errors when opening the dialog
//     setExpenseTypeError(false)
//     setWorkflowError(false)
//   }

//   const handleCloseAddExpenseDialog = () => {
//     setOpenAddExpenseDialog(false)
//     setNewExpenseData({
//       expenseTypeId: "",
//       workflowId: "",
//       currency: "INR",
//       department: "",
//       project: "",
//       priority: "Normal",
//     })
//     setDynamicFormFields([])
//     setDynamicFormData({})
//     setDynamicFieldErrors({})
//     // Reset static field errors when closing the dialog
//     setExpenseTypeError(false)
//     setWorkflowError(false)
//   }

//   const validateField = (field, value) => {
//     let error = ""
//     if (
//       field.isRequired &&
//       (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0))
//     ) {
//       error = `${field.label} is required.`
//       return error
//     }

//     if (field.validation) {
//       const { minLength, maxLength, min, max, pattern, customValidation } = field.validation

//       if (minLength && typeof value === "string" && value.length < minLength) {
//         error = `${field.label} must be at least ${minLength} characters.`
//       }
//       if (maxLength && typeof value === "string" && value.length > maxLength) {
//         error = `${field.label} must be at most ${maxLength} characters.`
//       }
//       if (min !== null && value !== null && typeof value === "number" && value < min) {
//         error = `${field.label} must be at least ${min}.`
//       }
//       if (max !== null && value !== null && typeof value === "number" && value > max) {
//         error = `${field.label} must be at most ${max}.`
//       }
//       if (pattern && typeof value === "string" && !new RegExp(pattern).test(value)) {
//         error = `${field.label} format is invalid.`
//       }
//       if (customValidation && typeof value === "string") {
//         try {
//           const customValidationFunc = new Function("value", `return ${customValidation}`)
//           if (!customValidationFunc(value)) {
//             error = `${field.label} failed custom validation.`
//           }
//         } catch (e) {
//           console.error("Error evaluating custom validation:", e)
//           error = `${field.label} has an invalid custom validation rule.`
//         }
//       }
//     }
//     return error
//   }

//   const handleNewExpenseChange = async (e) => {
//     const { name, value } = e.target
//     setNewExpenseData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }))

//     // Clear specific errors when the user interacts with the fields
//     if (name === "expenseTypeId") {
//       setExpenseTypeError(false)
//       if (value) {
//         await getExpenseDetails(value)
//       } else {
//         setDynamicFormFields([])
//         setDynamicFormData({})
//         setDynamicFieldErrors({})
//       }
//     } else if (name === "workflowId") {
//       setWorkflowError(false)
//     }
//   }

//   const uploadFiles = async (fieldId, files) => {
//     if (!token) {
//       setSnackbar({ open: true, message: "Authentication token not found for file upload.", severity: "error" })
//       return
//     }
//     if (files.length === 0) return

//     setFileUploadLoading(true)
//     const formData = new FormData()
//     for (let i = 0; i < files.length; i++) {
//       formData.append("files", files[i])
//     }

//     try {
//       const res = await axios.post(`${baseUrl}/v1/api/upload/uploadMultiple`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           authorization: token,
//         },
//       })
//       console.log("Files uploaded successfully:", res.data)
//       const uploadedUrls = res.data?.items || []

//       setDynamicFormData((prevData) => ({
//         ...prevData,
//         [fieldId]: uploadedUrls,
//       }))
//       setSnackbar({ open: true, message: "Files uploaded successfully!", severity: "success" })
//     } catch (error) {
//       console.error("Error uploading files:", error)
//       setSnackbar({ open: true, message: "Error uploading files. Please try again.", severity: "error" })
//     } finally {
//       setFileUploadLoading(false)
//     }
//   }

//   const handleDynamicFieldChange = async (fieldId, value, fieldType, fieldDefinition) => {
//     let newValue = value
//     if (fieldType === "checkbox") {
//       newValue = !dynamicFormData[fieldId]
//     } else if (fieldType === "file") {
//       if (value && value.length > 0) {
//         await uploadFiles(fieldId, value)
//       }
//       return
//     } else if (fieldType === "date") {
//       newValue = value ? value.toISOString() : ""
//     }

//     setDynamicFormData((prevData) => {
//       const updatedData = {
//         ...prevData,
//         [fieldId]: newValue,
//       }
//       const newErrors = { ...dynamicFieldErrors }
//       dynamicFormFields.forEach((field) => {
//         if (field.conditionalLogic && field.conditionalLogic.showIf.fieldId === fieldId) {
//           const dependentFieldValue = updatedData[field.fieldId]
//           newErrors[field.fieldId] = validateField(field, dependentFieldValue)
//         }
//       })
//       setDynamicFieldErrors(newErrors)
//       return updatedData
//     })

//     const error = validateField(fieldDefinition, newValue)
//     setDynamicFieldErrors((prevErrors) => ({
//       ...prevErrors,
//       [fieldId]: error,
//     }))
//   }

//   const shouldRenderField = (field) => {
//     if (!field.conditionalLogic) {
//       return true
//     }
//     const { showIf } = field.conditionalLogic
//     const dependentFieldValue = dynamicFormData[showIf.fieldId]

//     switch (showIf.operator) {
//       case "equals":
//         return dependentFieldValue === showIf.value
//       case "notEquals":
//         return dependentFieldValue !== showIf.value
//       default:
//         return true
//     }
//   }

//   const handleAddExpenseSubmit = async () => {
//     if (!token) {
//       console.error("Authentication token not found.")
//       setSnackbar({ open: true, message: "Authentication required to submit expense.", severity: "error" })
//       return
//     }

//     let hasErrors = false
//     const newErrors = {}

//     // Validate static fields
//     if (!newExpenseData.expenseTypeId) {
//       setExpenseTypeError(true)
//       hasErrors = true
//     } else {
//       setExpenseTypeError(false)
//     }

//     if (!newExpenseData.workflowId) {
//       setWorkflowError(true)
//       hasErrors = true
//     } else {
//       setWorkflowError(false)
//     }

//     // Validate dynamic fields
//     dynamicFormFields.forEach((field) => {
//       if (shouldRenderField(field)) {
//         const value = dynamicFormData[field.fieldId]
//         const error = validateField(field, value)
//         if (error) {
//           newErrors[field.fieldId] = error
//           hasErrors = true
//         }
//       }
//     })
//     setDynamicFieldErrors(newErrors)

//     if (hasErrors) {
//       setSnackbar({ open: true, message: "Please correct the errors in the form.", severity: "error" })
//       return
//     }

//     setIsSubmitting(true)

//     const payload = {
//       expenseTypeId: newExpenseData.expenseTypeId,
//       workflowId: newExpenseData.workflowId,
//       currency: newExpenseData.currency,
//       department: newExpenseData.department,
//       project: newExpenseData.project,
//       priority: newExpenseData.priority,
//       formData: dynamicFormData,
//     }

//     console.log("Submitting new expense payload:", payload)

//     try {
//       const res = await axios.post(`${baseUrl}/v1/api/expenseSubmission`, payload, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       console.log("Expense submitted successfully:", res.data)
//       setSnackbar({ open: true, message: "Expense submitted successfully!", severity: "success" })
//       handleCloseAddExpenseDialog()
//       getAllSubmissions()
//     } catch (error) {
//       console.error("Error submitting expense:", error)
//       setSnackbar({ open: true, message: "Error submitting expense. Please try again.", severity: "error" })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === "clickaway") {
//       return
//     }
//     setSnackbar({ ...snackbar, open: false })
//   }

//   const handleViewExpense = (row) => {
//     setSelectedExpenseDetails(row)
//     setOpenViewExpenseDialog(true)
//   }

//   const handleCloseViewExpenseDialog = () => {
//     setOpenViewExpenseDialog(false)
//     setSelectedExpenseDetails(null)
//   }

//   return (
//     <Box sx={{ width: "100%", overflowX: "auto" }}>
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
//         <Box
//           sx={{
//             position: "absolute",
//             top: -50,
//             right: -50,
//             width: "150px",
//             height: "150px",
//             background: "rgba(255, 255, 255, 0.1)",
//             borderRadius: "50%",
//             animation: "float 6s ease-in-out infinite",
//             "@keyframes float": {
//               "0%, 100%": { transform: "translateY(0px)" },
//               "50%": { transform: "translateY(-20px)" },
//             },
//           }}
//         />
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Box
//               sx={{
//                 p: 1.5,
//                 borderRadius: "50%",
//                 background: "rgba(255, 255, 255, 0.15)",
//                 backdropFilter: "blur(5px)",
//                 border: "1px solid rgba(255, 255, 255, 0.2)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <CategoryIcon sx={{ fontSize: 32, color: "white" }} />
//             </Box>
//             <Box>
//               <Typography variant="h4" fontWeight={600} sx={{ color: "white", mb: "-5px" }}>
//                 Expense
//               </Typography>
//               <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
//                 Add and manage expense for organizing data and workflows.
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Paper>
//       <Box sx={{ p: 4, border: "1px solid #EAECF0" }}>
//         <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
//           <Box>
//             <Typography variant="h5" fontWeight={600} color="#262E3D">
//               Expenses
//             </Typography>
//             <Typography variant="body2" sx={{ color: "#667085", fontSize: "0.850rem" }}>
//               Built-in expense with unique business logic and features
//             </Typography>
//           </Box>
//           <Box>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               sx={{
//                 textTransform: "none",
//                 borderRadius: 2,
//                 bgcolor: "#667eea",
//                 "&:hover": {
//                   bgcolor: "#764ba2",
//                 },
//               }}
//               onClick={handleOpenAddExpenseDialog}
//             >
//               Add Expense
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//       <Box sx={{ width: "100%", overflowX: "auto", p: 4 }}>
//         <DataGrid
//           rows={allExpense}
//           columns={columns}
//           autoHeight
//           rowHeight={60}
//           sx={{
//             "& .MuiDataGrid-columnHeaders": {
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               color: "#fff",
//               fontWeight: 600,
//             },
//             "& .MuiDataGrid-columnHeaderTitle": {
//               fontWeight: "bold",
//               color: "#fff",
//             },
//             "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
//               color: "#fff",
//             },
//             "& .MuiDataGrid-cell": {
//               borderBottom: "1px solid rgba(224, 224, 224, 1)",
//               display: "flex",
//               alignItems: "center",
//             },
//             "& .MuiDataGrid-row": {
//               "&:hover": {
//                 backgroundColor: "rgba(25, 118, 210, 0.04)",
//                 cursor: "pointer",
//               },
//             },
//             "& .MuiDataGrid-toolbarContainer": {
//               padding: "12px",
//               backgroundColor: "#f8f9fa",
//               borderBottom: "1px solid #e0e0e0",
//             },
//           }}
//         />
//       </Box>

//       {/* Add Expense Dialog */}
//       <Dialog open={openAddExpenseDialog} onClose={handleCloseAddExpenseDialog} fullWidth maxWidth="md">
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             color: "white",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6" component="div" sx={{ color: "white" }}>
//             Add New Expense
//           </Typography>
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseAddExpenseDialog}
//             sx={{
//               color: "white",
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <FormControl
//                 fullWidth
//                 margin="normal"
//                 size="medium"
//                 required
//                 error={expenseTypeError} // Bind error state
//               >
//                 <InputLabel id="expense-type-label">Expense Type</InputLabel>
//                 <Select
//                   labelId="expense-type-label"
//                   id="expenseTypeId"
//                   name="expenseTypeId"
//                   value={newExpenseData.expenseTypeId}
//                   label="Expense Type"
//                   onChange={handleNewExpenseChange}
//                 >
//                   {expenses.map((expense) => (
//                     <MenuItem key={expense.expenseTypeId} value={expense.expenseTypeId}>
//                       {expense.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {expenseTypeError && <FormHelperText>Expense Type is required.</FormHelperText>}
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl
//                 fullWidth
//                 margin="normal"
//                 size="medium"
//                 required
//                 error={workflowError} // Bind error state
//               >
//                 <InputLabel id="workflow-label">Work-Flow</InputLabel>
//                 <Select
//                   labelId="workflow-label"
//                   id="workflowId"
//                   name="workflowId"
//                   value={newExpenseData.workflowId}
//                   label="Work-Flow"
//                   onChange={handleNewExpenseChange}
//                 >
//                   {workflows.map((workflow) => (
//                     <MenuItem key={workflow.workflowId} value={workflow.workflowId}>
//                       {workflow.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {workflowError && <FormHelperText>Work-Flow is required.</FormHelperText>}
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Currency"
//                 name="currency"
//                 value={newExpenseData.currency}
//                 onChange={handleNewExpenseChange}
//                 margin="normal"
//                 size="medium"
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Department"
//                 name="department"
//                 value={newExpenseData.department}
//                 onChange={handleNewExpenseChange}
//                 margin="normal"
//                 size="medium"
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Project"
//                 name="project"
//                 value={newExpenseData.project}
//                 onChange={handleNewExpenseChange}
//                 margin="normal"
//                 size="medium"
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth margin="normal" size="medium">
//                 <InputLabel id="priority-label">Priority</InputLabel>
//                 <Select
//                   labelId="priority-label"
//                   id="priority"
//                   name="priority"
//                   value={newExpenseData.priority}
//                   label="Priority"
//                   onChange={handleNewExpenseChange}
//                 >
//                   <MenuItem value="Low">Low</MenuItem>
//                   <MenuItem value="Normal">Normal</MenuItem>
//                   <MenuItem value="High">High</MenuItem>
//                   <MenuItem value="Urgent">Urgent</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Dynamic Form Fields */}
//             {dynamicFormFields.length > 0 && (
//               <Grid item xs={12}>
//                 <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
//                   Additional Details
//                 </Typography>
//               </Grid>
//             )}
//             {dynamicFormFields.map((field) =>
//               shouldRenderField(field) ? (
//                 <Grid item xs={12} sm={6} key={field.fieldId}>
//                   {field.fieldType === "text" || field.fieldType === "number" ? (
//                     <TextField
//                       fullWidth
//                       label={field.label}
//                       name={field.fieldId}
//                       type={field.fieldType === "number" ? "number" : "text"}
//                       value={dynamicFormData[field.fieldId] || ""}
//                       onChange={(e) => handleDynamicFieldChange(field.fieldId, e.target.value, field.fieldType, field)}
//                       margin="normal"
//                       size="medium"
//                       required={field.isRequired}
//                       placeholder={field.placeholder}
//                       InputLabelProps={{ shrink: true }}
//                       error={!!dynamicFieldErrors[field.fieldId]}
//                       helperText={dynamicFieldErrors[field.fieldId] || field.helpText}
//                     />
//                   ) : field.fieldType === "date" ? (
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                       <DatePicker
//                         label={field.label}
//                         value={dynamicFormData[field.fieldId] ? dayjs(dynamicFormData[field.fieldId]) : null}
//                         onChange={(newValue) =>
//                           handleDynamicFieldChange(field.fieldId, newValue, field.fieldType, field)
//                         }
//                         slotProps={{
//                           textField: {
//                             fullWidth: true,
//                             margin: "normal",
//                             size: "medium",
//                             required: field.isRequired,
//                             error: !!dynamicFieldErrors[field.fieldId],
//                             helperText: dynamicFieldErrors[field.fieldId] || field.helpText,
//                             InputLabelProps: { shrink: true },
//                           },
//                         }}
//                       />
//                     </LocalizationProvider>
//                   ) : field.fieldType === "select" ? (
//                     <FormControl
//                       fullWidth
//                       margin="normal"
//                       size="medium"
//                       required={field.isRequired}
//                       error={!!dynamicFieldErrors[field.fieldId]}
//                     >
//                       <InputLabel id={`${field.fieldId}-label`}>{field.label}</InputLabel>
//                       <Select
//                         labelId={`${field.fieldId}-label`}
//                         id={field.fieldId}
//                         name={field.fieldId}
//                         value={dynamicFormData[field.fieldId] || ""}
//                         label={field.label}
//                         onChange={(e) =>
//                           handleDynamicFieldChange(field.fieldId, e.target.value, field.fieldType, field)
//                         }
//                       >
//                         {field.options?.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                       {(dynamicFieldErrors[field.fieldId] || field.helpText) && (
//                         <FormHelperText error={!!dynamicFieldErrors[field.fieldId]}>
//                           {dynamicFieldErrors[field.fieldId] || field.helpText}
//                         </FormHelperText>
//                       )}
//                     </FormControl>
//                   ) : field.fieldType === "radio" ? (
//                     <FormControl
//                       component="fieldset"
//                       margin="normal"
//                       size="medium"
//                       required={field.isRequired}
//                       error={!!dynamicFieldErrors[field.fieldId]}
//                     >
//                       <FormLabel component="legend">{field.label}</FormLabel>
//                       <RadioGroup
//                         row
//                         name={field.fieldId}
//                         value={dynamicFormData[field.fieldId] || ""}
//                         onChange={(e) =>
//                           handleDynamicFieldChange(field.fieldId, e.target.value, field.fieldType, field)
//                         }
//                       >
//                         {field.options?.map((option) => (
//                           <FormControlLabel
//                             key={option.value}
//                             value={option.value}
//                             control={<Radio size="medium" />}
//                             label={option.label}
//                           />
//                         ))}
//                       </RadioGroup>
//                       {(dynamicFieldErrors[field.fieldId] || field.helpText) && (
//                         <FormHelperText error={!!dynamicFieldErrors[field.fieldId]}>
//                           {dynamicFieldErrors[field.fieldId] || field.helpText}
//                         </FormHelperText>
//                       )}
//                     </FormControl>
//                   ) : field.fieldType === "checkbox" ? (
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={dynamicFormData[field.fieldId] || false}
//                           onChange={() => handleDynamicFieldChange(field.fieldId, null, field.fieldType, field)}
//                           name={field.fieldId}
//                         />
//                       }
//                       label={field.label}
//                       sx={{ mt: 2, mb: 1 }}
//                     />
//                   ) : field.fieldType === "file" ? (
//                     <Box sx={{ marginY: "normal" }}>
//                       <fieldset
//                         style={{
//                           border: `2px dashed ${dynamicFieldErrors[field.fieldId] ? "#f44336" : "#ccc"}`,
//                           borderRadius: "4px",
//                           padding: "8px 16px",
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           cursor: "pointer",
//                           minHeight: "56px",
//                           position: "relative",
//                           opacity: fileUploadLoading ? 0.7 : 1,
//                           pointerEvents: fileUploadLoading ? "none" : "auto",
//                         }}
//                         onClick={() => fileInputRefs.current[field.fieldId]?.click()}
//                       >
//                         <legend
//                           style={{
//                             padding: "0 8px",
//                             marginLeft: "10px",
//                             color: dynamicFieldErrors[field.fieldId] ? "#f44336" : "rgba(0, 0, 0, 0.6)",
//                             fontSize: "0.75rem",
//                             fontWeight: 400,
//                           }}
//                         >
//                           {field.label} {field.isRequired && "*"}
//                         </legend>
//                         <CloudUploadIcon sx={{ fontSize: 24, color: "#667eea", mb: 0.5 }} />
//                         <Typography variant="caption" color="textSecondary">
//                           {fileUploadLoading ? "Uploading..." : "Upload files"}
//                         </Typography>
//                         {dynamicFormData[field.fieldId] &&
//                           Array.isArray(dynamicFormData[field.fieldId]) &&
//                           dynamicFormData[field.fieldId].length > 0 && (
//                             <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
//                               Uploaded: {dynamicFormData[field.fieldId].length} file(s)
//                             </Typography>
//                           )}
//                       </fieldset>
//                       <Input
//                         id={field.fieldId}
//                         name={field.fieldId}
//                         type="file"
//                         inputRef={(el) => (fileInputRefs.current[field.fieldId] = el)}
//                         onChange={(e) =>
//                           handleDynamicFieldChange(field.fieldId, e.target.files, field.fieldType, field)
//                         }
//                         inputProps={{ accept: field.validation?.allowedFileTypes || "*", multiple: true }}
//                         sx={{ display: "none" }}
//                         disabled={fileUploadLoading}
//                       />
//                       {(dynamicFieldErrors[field.fieldId] || field.helpText) && (
//                         <FormHelperText error={!!dynamicFieldErrors[field.fieldId]}>
//                           {dynamicFieldErrors[field.fieldId] || field.helpText}
//                         </FormHelperText>
//                       )}
//                     </Box>
//                   ) : null}
//                 </Grid>
//               ) : null,
//             )}
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseAddExpenseDialog} color="primary" disabled={isSubmitting || fileUploadLoading}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleAddExpenseSubmit}
//             color="primary"
//             variant="contained"
//             disabled={isSubmitting || fileUploadLoading}
//           >
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* View Expense Dialog */}
//       <Dialog open={openViewExpenseDialog} onClose={handleCloseViewExpenseDialog} fullWidth maxWidth="md">
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             color: "white",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6" component="div" sx={{ color: "white" }}>
//             Expense Details
//           </Typography>
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseViewExpenseDialog}
//             sx={{
//               color: "white",
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           {selectedExpenseDetails && (
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Project"
//                   value={selectedExpenseDetails.name || "N/A"}
//                   margin="normal"
//                   size="medium"
//                   InputProps={{ readOnly: true }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Expense Type"
//                   value={selectedExpenseDetails.subcategoryName || "N/A"}
//                   margin="normal"
//                   size="medium"
//                   InputProps={{ readOnly: true }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Submitted By"
//                   value={selectedExpenseDetails.systemCategoryName || "N/A"}
//                   margin="normal"
//                   size="medium"
//                   InputProps={{ readOnly: true }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Priority"
//                   value={selectedExpenseDetails.priority || "N/A"}
//                   margin="normal"
//                   size="medium"
//                   InputProps={{ readOnly: true }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Created At"
//                   value={selectedExpenseDetails.createdAt || "N/A"}
//                   margin="normal"
//                   size="medium"
//                   InputProps={{ readOnly: true }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>

//               {Object.keys(selectedExpenseDetails.formData).length > 0 && (
//                 <Grid item xs={12}>
//                   <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
//                     Custom Fields
//                   </Typography>
//                 </Grid>
//               )}
//               {Object.entries(selectedExpenseDetails.formData).map(([key, fieldData]) => (
//                 <Grid item xs={12} sm={6} key={key}>
//                   {fieldData.type === "text" || fieldData.type === "number" ? (
//                     <TextField
//                       fullWidth
//                       label={fieldData.name}
//                       value={fieldData.value || "N/A"}
//                       margin="normal"
//                       size="medium"
//                       InputProps={{ readOnly: true }}
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   ) : fieldData.type === "date" ? (
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                       <DatePicker
//                         label={fieldData.name}
//                         value={fieldData.value ? dayjs(fieldData.value) : null}
//                         readOnly
//                         slotProps={{
//                           textField: {
//                             fullWidth: true,
//                             margin: "normal",
//                             size: "medium",
//                             InputLabelProps: { shrink: true },
//                           },
//                         }}
//                       />
//                     </LocalizationProvider>
//                   ) : fieldData.type === "select" || fieldData.type === "radio" ? (
//                     <TextField
//                       fullWidth
//                       label={fieldData.name}
//                       value={fieldData.value || "N/A"}
//                       margin="normal"
//                       size="medium"
//                       InputProps={{ readOnly: true }}
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   ) : fieldData.type === "checkbox" ? (
//                     <FormControlLabel
//                       control={<Switch checked={fieldData.value || false} readOnly />}
//                       label={fieldData.name}
//                       sx={{ mt: 2, mb: 1 }}
//                     />
//                   ) : fieldData.type === "file" ? (
//                     <TextField
//                       fullWidth
//                       label={fieldData.name}
//                       value={
//                         Array.isArray(fieldData.value) && fieldData.value.length > 0
//                           ? fieldData.value.map((url, index) => `File ${index + 1}`).join(", ")
//                           : "No files uploaded"
//                       }
//                       margin="normal"
//                       size="medium"
//                       InputProps={{
//                         readOnly: true,
//                         endAdornment:
//                           Array.isArray(fieldData.value) && fieldData.value.length > 0 ? (
//                             <Box sx={{ display: "flex", gap: 1 }}>
//                               {fieldData.value.map((url, index) => (
//                                 <Link href={url} target="_blank" rel="noopener noreferrer" key={index}>
//                                   <CloudUploadIcon sx={{ fontSize: 20, color: "#667eea" }} />
//                                 </Link>
//                               ))}
//                             </Box>
//                           ) : null,
//                       }}
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   ) : null}
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseViewExpenseDialog} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar for feedback */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }

"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  FormControlLabel,
  Input,
  RadioGroup,
  Radio,
  FormLabel,
  FormHelperText,
  Link, // Added for clickable links in view dialog
  CircularProgress, // Added for loading indicator
} from "@mui/material"
import CategoryIcon from "@mui/icons-material/Category"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { DataGrid } from "@mui/x-data-grid"
import axios from "axios"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"
import { CreditCard, DateRange, Flag, FolderOpen, Person } from "@mui/icons-material"

export default function Expense() {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [allExpense, setAllExpense] = useState([])
  const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState(false)
  const [newExpenseData, setNewExpenseData] = useState({
    expenseTypeId: "",
    workflowId: "",
    currency: "INR",
    department: "",
    project: "",
    priority: "Normal",
  })

  const [expenses, setExpenses] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [dynamicFormFields, setDynamicFormFields] = useState([])
  const [dynamicFormData, setDynamicFormData] = useState({})
  const [dynamicFieldErrors, setDynamicFieldErrors] = useState({})
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [openViewExpenseDialog, setOpenViewExpenseDialog] = useState(false) // New state for view dialog
  const [selectedExpenseDetails, setSelectedExpenseDetails] = useState(null) // New state for selected expense data

  // New states for static field validation errors
  const [expenseTypeError, setExpenseTypeError] = useState(false)
  const [workflowError, setWorkflowError] = useState(false)
  const [isLoadingExpenseDetails, setIsLoadingExpenseDetails] = useState(false) // New state for loading dynamic fields

  const fileInputRefs = useRef({})

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const formatDate = (isoString) => {
    if (!isoString) return ""
    return new Date(isoString).toLocaleDateString()
  }

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Project",
        flex: 1,
        minWidth: 150,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <FolderOpen sx={{ fontSize: 18, color: "#fff" }} />
            Project
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
      },
      {
        field: "subcategoryName",
        headerName: "Expense Type",
        flex: 1,
        minWidth: 150,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <CreditCard sx={{ fontSize: 18, color: "#fff" }} />
            Expense Type
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
      },
      {
        field: "systemCategoryName",
        headerName: "Submitted By",
        flex: 1,
        minWidth: 150,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <Person sx={{ fontSize: 18, color: "#fff" }} />
            Submitted By
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
      },
      {
        field: "priority",
        headerName: "Priority",
        flex: 1,
        minWidth: 150,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <Flag sx={{ fontSize: 18, color: "#fff" }} />
            Priority
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
      },
      {
        field: "createdAt",
        headerName: "Created At",
        flex: 1,
        minWidth: 150,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <DateRange sx={{ fontSize: 18, color: "#fff" }} />
            Created At
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 150,
        sortable: false,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
              Actions
            </Typography>
          </Box>
        ),
        renderCell: ({ row }) => (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleViewExpense(row)}
            sx={{
              bgcolor: "#3b82f6",
              "&:hover": { bgcolor: "#2563eb" },
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)",
            }}
            aria-label={`View expense details`}
          >
            View
          </Button>
        ),
      },
    ],
    [],
  )

  const getAllSubmissions = async () => {
    if (!token) {
      console.error("Authentication token not found.")
      return
    }
    try {
      const res = await axios.get(`${baseUrl}/v1/api/expenseSubmission/employee`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      console.log("Fetched all submissions:", res.data)
      const expenses = res.data?.items?.submissions || []
      const formatted = expenses.map((item, index) => ({
        id: item._id || index,
        name: item.project,
        subcategoryName: item.expenseTypeId?.name || "N/A",
        systemCategoryName: item.submittedBy?.employeName || "N/A",
        priority: item.priority || "N/A",
        formData: item.formData || {}, // Ensure formData is included
        createdAt: formatDate(item.createdAt),
      }))
      setAllExpense(formatted)
    } catch (error) {
      console.error("Error fetching submit expenses:", error)
      setSnackbar({ open: true, message: "Error fetching expense submissions.", severity: "error" })
    }
  }

  const getAllExpenseTypes = async () => {
    if (!token) {
      console.error("Authentication token not found.")
      return
    }
    try {
      const res = await axios.get(`${baseUrl}/v1/api/expenseType`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      console.log("Fetched all expense types:", res.data)
      const expenseTypes = res.data?.items?.expenseTypes || []
      setExpenses(expenseTypes)
    } catch (error) {
      console.error("Error fetching expense types:", error)
      setSnackbar({ open: true, message: "Error fetching expense types.", severity: "error" })
    }
  }

  const getAllWorkflow = async () => {
    if (!token) {
      console.error("Authentication token not found.")
      return
    }
    try {
      const res = await axios.get(`${baseUrl}/v1/api/workflow/all`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      console.log("Fetched all workflows:", res.data)
      const workflows = res.data?.items?.workflows || []
      setWorkflows(workflows)
    } catch (error) {
      console.error("Error fetching workflows:", error)
      setSnackbar({ open: true, message: "Error fetching workflows.", severity: "error" })
    }
  }

  const getExpenseDetails = async (expenseId) => {
    if (!token) {
      console.error("Authentication token not found.")
      return
    }
    setIsLoadingExpenseDetails(true) // Set loading true
    try {
      const res = await axios.get(`${baseUrl}/v1/api/expenseType/${expenseId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      console.log("Fetched expense details by ID:", res.data)
      const formFields = res.data?.items?.formId?.fields || []
      setDynamicFormFields(formFields)

      const initialDynamicData = {}
      formFields.forEach((field) => {
        if (field.fieldType === "checkbox") {
          initialDynamicData[field.fieldId] = field.defaultValue === true
        } else if (field.fieldType === "date") {
          initialDynamicData[field.fieldId] = field.defaultValue ? dayjs(field.defaultValue) : null
        } else {
          initialDynamicData[field.fieldId] = field.defaultValue || ""
        }
      })
      setDynamicFormData(initialDynamicData)
      setDynamicFieldErrors({})

      setSnackbar({ open: true, message: "Expense details loaded successfully!", severity: "success" })
    } catch (error) {
      console.error("Error fetching expense details by ID:", error)
      setSnackbar({ open: true, message: "Error fetching expense details. Please try again.", severity: "error" })
      setDynamicFormFields([])
      setDynamicFormData({})
      setDynamicFieldErrors({})
    } finally {
      setIsLoadingExpenseDetails(false) // Set loading false
    }
  }

  useEffect(() => {
    getAllSubmissions()
    getAllExpenseTypes()
    getAllWorkflow()
  }, [])

  const handleOpenAddExpenseDialog = () => {
    setOpenAddExpenseDialog(true)
    // Reset static field errors and dynamic fields when opening the dialog
    setExpenseTypeError(false)
    setWorkflowError(false)
    setDynamicFormFields([])
    setDynamicFormData({})
    setDynamicFieldErrors({})
  }

  const handleCloseAddExpenseDialog = () => {
    setOpenAddExpenseDialog(false)
    setNewExpenseData({
      expenseTypeId: "",
      workflowId: "",
      currency: "INR",
      department: "",
      project: "",
      priority: "Normal",
    })
    setDynamicFormFields([])
    setDynamicFormData({})
    setDynamicFieldErrors({})
    // Reset static field errors when closing the dialog
    setExpenseTypeError(false)
    setWorkflowError(false)
  }

  const validateField = (field, value) => {
    let error = ""
    if (
      field.isRequired &&
      (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0))
    ) {
      error = `${field.label} is required.`
      return error
    }

    if (field.validation) {
      const { minLength, maxLength, min, max, pattern, customValidation } = field.validation

      if (minLength && typeof value === "string" && value.length < minLength) {
        error = `${field.label} must be at least ${minLength} characters.`
      }
      if (maxLength && typeof value === "string" && value.length > maxLength) {
        error = `${field.label} must be at most ${maxLength} characters.`
      }
      if (min !== null && value !== null && typeof value === "number" && value < min) {
        error = `${field.label} must be at least ${min}.`
      }
      if (max !== null && value !== null && typeof value === "number" && value > max) {
        error = `${field.label} must be at most ${max}.`
      }
      if (pattern && typeof value === "string" && !new RegExp(pattern).test(value)) {
        error = `${field.label} format is invalid.`
      }
      if (customValidation && typeof value === "string") {
        try {
          const customValidationFunc = new Function("value", `return ${customValidation}`)
          if (!customValidationFunc(value)) {
            error = `${field.label} failed custom validation.`
          }
        } catch (e) {
          console.error("Error evaluating custom validation:", e)
          error = `${field.label} has an invalid custom validation rule.`
        }
      }
    }
    return error
  }

  const handleNewExpenseChange = async (e) => {
    const { name, value } = e.target
    setNewExpenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    // Clear specific errors when the user interacts with the fields
    if (name === "expenseTypeId") {
      setExpenseTypeError(false)
      if (value) {
        // Clear dynamic fields and data immediately to show loading state
        setDynamicFormFields([])
        setDynamicFormData({})
        setDynamicFieldErrors({})
        await getExpenseDetails(value)
      } else {
        setDynamicFormFields([])
        setDynamicFormData({})
        setDynamicFieldErrors({})
      }
    } else if (name === "workflowId") {
      setWorkflowError(false)
    }
  }

  const uploadFiles = async (fieldId, files) => {
    if (!token) {
      setSnackbar({ open: true, message: "Authentication token not found for file upload.", severity: "error" })
      return
    }
    if (files.length === 0) return

    setFileUploadLoading(true)
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
    }

    try {
      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadMultiple`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token,
        },
      })
      console.log("Files uploaded successfully:", res.data)
      const uploadedUrls = res.data?.items || []

      setDynamicFormData((prevData) => ({
        ...prevData,
        [fieldId]: uploadedUrls,
      }))
      setSnackbar({ open: true, message: "Files uploaded successfully!", severity: "success" })
    } catch (error) {
      console.error("Error uploading files:", error)
      setSnackbar({ open: true, message: "Error uploading files. Please try again.", severity: "error" })
    } finally {
      setFileUploadLoading(false)
    }
  }

  const handleDynamicFieldChange = async (fieldId, value, fieldType, fieldDefinition) => {
    let newValue = value
    if (fieldType === "checkbox") {
      newValue = !dynamicFormData[fieldId]
    } else if (fieldType === "file") {
      if (value && value.length > 0) {
        await uploadFiles(fieldId, value)
      }
      return
    } else if (fieldType === "date") {
      newValue = value ? value.toISOString() : ""
    }

    setDynamicFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [fieldId]: newValue,
      }
      const newErrors = { ...dynamicFieldErrors }
      dynamicFormFields.forEach((field) => {
        if (field.conditionalLogic && field.conditionalLogic.showIf.fieldId === fieldId) {
          const dependentFieldValue = updatedData[field.fieldId]
          newErrors[field.fieldId] = validateField(field, dependentFieldValue)
        }
      })
      setDynamicFieldErrors(newErrors)
      return updatedData
    })

    const error = validateField(fieldDefinition, newValue)
    setDynamicFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldId]: error,
    }))
  }

  const shouldRenderField = (field) => {
    if (!field.conditionalLogic) {
      return true
    }
    const { showIf } = field.conditionalLogic
    const dependentFieldValue = dynamicFormData[showIf.fieldId]

    switch (showIf.operator) {
      case "equals":
        return dependentFieldValue === showIf.value
      case "notEquals":
        return dependentFieldValue !== showIf.value
      default:
        return true
    }
  }

  const handleAddExpenseSubmit = async () => {
    if (!token) {
      console.error("Authentication token not found.")
      setSnackbar({ open: true, message: "Authentication required to submit expense.", severity: "error" })
      return
    }

    let hasErrors = false
    const newErrors = {}

    // Validate static fields
    if (!newExpenseData.expenseTypeId) {
      setExpenseTypeError(true)
      hasErrors = true
    } else {
      setExpenseTypeError(false)
    }

    if (!newExpenseData.workflowId) {
      setWorkflowError(true)
      hasErrors = true
    } else {
      setWorkflowError(false)
    }

    // Validate dynamic fields
    dynamicFormFields.forEach((field) => {
      if (shouldRenderField(field)) {
        const value = dynamicFormData[field.fieldId]
        const error = validateField(field, value)
        if (error) {
          newErrors[field.fieldId] = error
          hasErrors = true
        }
      }
    })
    setDynamicFieldErrors(newErrors)

    if (hasErrors) {
      setSnackbar({ open: true, message: "Please correct the errors in the form.", severity: "error" })
      return
    }

    setIsSubmitting(true)

    const payload = {
      expenseTypeId: newExpenseData.expenseTypeId,
      workflowId: newExpenseData.workflowId,
      currency: newExpenseData.currency,
      department: newExpenseData.department,
      project: newExpenseData.project,
      priority: newExpenseData.priority,
      formData: dynamicFormData,
    }

    console.log("Submitting new expense payload:", payload)

    try {
      const res = await axios.post(`${baseUrl}/v1/api/expenseSubmission`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      console.log("Expense submitted successfully:", res.data)
      setSnackbar({ open: true, message: "Expense submitted successfully!", severity: "success" })
      handleCloseAddExpenseDialog()
      getAllSubmissions()
    } catch (error) {
      console.error("Error submitting expense:", error)
      setSnackbar({ open: true, message: "Error submitting expense. Please try again.", severity: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbar({ ...snackbar, open: false })
  }

  const handleViewExpense = (row) => {
    setSelectedExpenseDetails(row)
    setOpenViewExpenseDialog(true)
  }

  const handleCloseViewExpenseDialog = () => {
    setOpenViewExpenseDialog(false)
    setSelectedExpenseDetails(null)
  }

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      {/* <Paper
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
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: "150px",
            height: "150px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CategoryIcon sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={600} sx={{ color: "white", mb: "-5px" }}>
                Expense
              </Typography>
              <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                Add and manage expense for organizing data and workflows.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper> */}
      <Box sx={{ p: 4, border: "1px solid #EAECF0" }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" fontWeight={600} color="#262E3D">
              Expenses
            </Typography>
            <Typography variant="body2" sx={{ color: "#667085", fontSize: "0.850rem" }}>
              Built-in expense with unique business logic and features
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                bgcolor: "#667eea",
                "&:hover": {
                  bgcolor: "#764ba2",
                },
              }}
              onClick={handleOpenAddExpenseDialog}
            >
              Add Expense
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%", overflowX: "auto", p: 4 }}>
        <DataGrid
          rows={allExpense}
          columns={columns}
          autoHeight
          rowHeight={60}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              fontWeight: 600,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              color: "#fff",
            },
            "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
              color: "#fff",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid rgba(224, 224, 224, 1)",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
                cursor: "pointer",
              },
            },
            "& .MuiDataGrid-toolbarContainer": {
              padding: "12px",
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #e0e0e0",
            },
          }}
        />
      </Box>

      {/* Add Expense Dialog */}
      <Dialog open={openAddExpenseDialog} onClose={handleCloseAddExpenseDialog} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div" sx={{ color: "white" }}>
            Add New Expense
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseAddExpenseDialog}
            sx={{
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                size="medium"
                required
                error={expenseTypeError} // Bind error state
              >
                <InputLabel id="expense-type-label">Expense Type</InputLabel>
                <Select
                  labelId="expense-type-label"
                  id="expenseTypeId"
                  name="expenseTypeId"
                  value={newExpenseData.expenseTypeId}
                  label="Expense Type"
                  onChange={handleNewExpenseChange}
                >
                  {expenses.map((expense) => (
                    <MenuItem key={expense.expenseTypeId} value={expense.expenseTypeId}>
                      {expense.name}
                    </MenuItem>
                  ))}
                </Select>
                {expenseTypeError && <FormHelperText>Expense Type is required.</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                size="medium"
                required
                error={workflowError} // Bind error state
              >
                <InputLabel id="workflow-label">Work-Flow</InputLabel>
                <Select
                  labelId="workflow-label"
                  id="workflowId"
                  name="workflowId"
                  value={newExpenseData.workflowId}
                  label="Work-Flow"
                  onChange={handleNewExpenseChange}
                >
                  {workflows.map((workflow) => (
                    <MenuItem key={workflow.workflowId} value={workflow.workflowId}>
                      {workflow.name}
                    </MenuItem>
                  ))}
                </Select>
                {workflowError && <FormHelperText>Work-Flow is required.</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Currency"
                name="currency"
                value={newExpenseData.currency}
                onChange={handleNewExpenseChange}
                margin="normal"
                size="medium"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={newExpenseData.department}
                onChange={handleNewExpenseChange}
                margin="normal"
                size="medium"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project"
                name="project"
                value={newExpenseData.project}
                onChange={handleNewExpenseChange}
                margin="normal"
                size="medium"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" size="medium">
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={newExpenseData.priority}
                  label="Priority"
                  onChange={handleNewExpenseChange}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Dynamic Form Fields Section */}
            <Grid item xs={12}>
              {newExpenseData.expenseTypeId ? (
                isLoadingExpenseDetails ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "100px",
                      border: "1px dashed #ccc",
                      borderRadius: "8px",
                      mt: 2,
                      p: 2,
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: "#667eea", mb: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      Loading custom fields...
                    </Typography>
                  </Box>
                ) : dynamicFormFields.length > 0 ? (
                  <>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                      Additional Details
                    </Typography>
                    <Grid container spacing={2}>
                      {dynamicFormFields.map((field) =>
                        shouldRenderField(field) ? (
                          <Grid item xs={12} sm={6} key={field.fieldId}>
                            {field.fieldType === "text" || field.fieldType === "number" ? (
                              <TextField
                                fullWidth
                                label={field.label}
                                name={field.fieldId}
                                type={field.fieldType === "number" ? "number" : "text"}
                                value={dynamicFormData[field.fieldId] || ""}
                                onChange={(e) =>
                                  handleDynamicFieldChange(field.fieldId, e.target.value, field.fieldType, field)
                                }
                                margin="normal"
                                size="medium"
                                required={field.isRequired}
                                placeholder={field.placeholder}
                                InputLabelProps={{ shrink: true }}
                                error={!!dynamicFieldErrors[field.fieldId]}
                                helperText={dynamicFieldErrors[field.fieldId] || field.helpText}
                              />
                            ) : field.fieldType === "date" ? (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  label={field.label}
                                  value={dynamicFormData[field.fieldId] ? dayjs(dynamicFormData[field.fieldId]) : null}
                                  onChange={(newValue) =>
                                    handleDynamicFieldChange(field.fieldId, newValue, field.fieldType, field)
                                  }
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      margin: "normal",
                                      size: "medium",
                                      required: field.isRequired,
                                      error: !!dynamicFieldErrors[field.fieldId],
                                      helperText: dynamicFieldErrors[field.fieldId] || field.helpText,
                                      InputLabelProps: { shrink: true },
                                    },
                                  }}
                                />
                              </LocalizationProvider>
                            ) : field.fieldType === "select" ? (
                              <FormControl
                                fullWidth
                                margin="normal"
                                size="medium"
                                required={field.isRequired}
                                error={!!dynamicFieldErrors[field.fieldId]}
                              >
                                <InputLabel id={`${field.fieldId}-label`}>{field.label}</InputLabel>
                                <Select
                                  labelId={`${field.fieldId}-label`}
                                  id={field.fieldId}
                                  name={field.fieldId}
                                  value={dynamicFormData[field.fieldId] || ""}
                                  label={field.label}
                                  onChange={(e) =>
                                    handleDynamicFieldChange(field.fieldId, e.target.value, field.fieldType, field)
                                  }
                                >
                                  {field.options?.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {(dynamicFieldErrors[field.fieldId] || field.helpText) && (
                                  <FormHelperText error={!!dynamicFieldErrors[field.fieldId]}>
                                    {dynamicFieldErrors[field.fieldId] || field.helpText}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            ) : field.fieldType === "radio" ? (
                              <FormControl
                                component="fieldset"
                                margin="normal"
                                size="medium"
                                required={field.isRequired}
                                error={!!dynamicFieldErrors[field.fieldId]}
                              >
                                <FormLabel component="legend">{field.label}</FormLabel>
                                <RadioGroup
                                  row
                                  name={field.fieldId}
                                  value={dynamicFormData[field.fieldId] || ""}
                                  onChange={(e) =>
                                    handleDynamicFieldChange(field.fieldId, e.target.value, field.fieldType, field)
                                  }
                                >
                                  {field.options?.map((option) => (
                                    <FormControlLabel
                                      key={option.value}
                                      value={option.value}
                                      control={<Radio size="medium" />}
                                      label={option.label}
                                    />
                                  ))}
                                </RadioGroup>
                                {(dynamicFieldErrors[field.fieldId] || field.helpText) && (
                                  <FormHelperText error={!!dynamicFieldErrors[field.fieldId]}>
                                    {dynamicFieldErrors[field.fieldId] || field.helpText}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            ) : field.fieldType === "checkbox" ? (
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={dynamicFormData[field.fieldId] || false}
                                    onChange={() =>
                                      handleDynamicFieldChange(field.fieldId, null, field.fieldType, field)
                                    }
                                    name={field.fieldId}
                                  />
                                }
                                label={field.label}
                                sx={{ mt: 2, mb: 1 }}
                              />
                            ) : field.fieldType === "file" ? (
                              <Box sx={{ marginY: "normal" }}>
                                <fieldset
                                  style={{
                                    border: `2px dashed ${dynamicFieldErrors[field.fieldId] ? "#f44336" : "#ccc"}`,
                                    borderRadius: "4px",
                                    padding: "8px 16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    minHeight: "56px",
                                    position: "relative",
                                    opacity: fileUploadLoading ? 0.7 : 1,
                                    pointerEvents: fileUploadLoading ? "none" : "auto",
                                  }}
                                  onClick={() => fileInputRefs.current[field.fieldId]?.click()}
                                >
                                  <legend
                                    style={{
                                      padding: "0 8px",
                                      marginLeft: "10px",
                                      color: dynamicFieldErrors[field.fieldId] ? "#f44336" : "rgba(0, 0, 0, 0.6)",
                                      fontSize: "0.75rem",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {field.label} {field.isRequired && "*"}
                                  </legend>
                                  <CloudUploadIcon sx={{ fontSize: 24, color: "#667eea", mb: 0.5 }} />
                                  <Typography variant="caption" color="textSecondary">
                                    {fileUploadLoading ? "Uploading..." : "Upload files"}
                                  </Typography>
                                  {dynamicFormData[field.fieldId] &&
                                    Array.isArray(dynamicFormData[field.fieldId]) &&
                                    dynamicFormData[field.fieldId].length > 0 && (
                                      <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                                        Uploaded: {dynamicFormData[field.fieldId].length} file(s)
                                      </Typography>
                                    )}
                                </fieldset>
                                <Input
                                  id={field.fieldId}
                                  name={field.fieldId}
                                  type="file"
                                  inputRef={(el) => (fileInputRefs.current[field.fieldId] = el)}
                                  onChange={(e) =>
                                    handleDynamicFieldChange(field.fieldId, e.target.files, field.fieldType, field)
                                  }
                                  inputProps={{ accept: field.validation?.allowedFileTypes || "*", multiple: true }}
                                  sx={{ display: "none" }}
                                  disabled={fileUploadLoading}
                                />
                                {(dynamicFieldErrors[field.fieldId] || field.helpText) && (
                                  <FormHelperText error={!!dynamicFieldErrors[field.fieldId]}>
                                    {dynamicFieldErrors[field.fieldId] || field.helpText}
                                  </FormHelperText>
                                )}
                              </Box>
                            ) : null}
                          </Grid>
                        ) : null,
                      )}
                    </Grid>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "100px",
                      border: "1px dashed #ccc",
                      borderRadius: "8px",
                      mt: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      No additional fields for this expense type.
                    </Typography>
                  </Box>
                )
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100px",
                    border: "1px dashed #ccc",
                    borderRadius: "8px",
                    mt: 2,
                    p: 2,
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    Select an Expense Type to see additional details.
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddExpenseDialog} color="primary" disabled={isSubmitting || fileUploadLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddExpenseSubmit}
            color="primary"
            variant="contained"
            disabled={isSubmitting || fileUploadLoading}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Expense Dialog */}
      <Dialog open={openViewExpenseDialog} onClose={handleCloseViewExpenseDialog} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div" sx={{ color: "white" }}>
            Expense Details
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseViewExpenseDialog}
            sx={{
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedExpenseDetails && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Project"
                  value={selectedExpenseDetails.name || "N/A"}
                  margin="normal"
                  size="medium"
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expense Type"
                  value={selectedExpenseDetails.subcategoryName || "N/A"}
                  margin="normal"
                  size="medium"
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Submitted By"
                  value={selectedExpenseDetails.systemCategoryName || "N/A"}
                  margin="normal"
                  size="medium"
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Priority"
                  value={selectedExpenseDetails.priority || "N/A"}
                  margin="normal"
                  size="medium"
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Created At"
                  value={selectedExpenseDetails.createdAt || "N/A"}
                  margin="normal"
                  size="medium"
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {Object.keys(selectedExpenseDetails.formData).length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Custom Fields
                  </Typography>
                </Grid>
              )}
              {Object.entries(selectedExpenseDetails.formData).map(([key, fieldData]) => (
                <Grid item xs={12} sm={6} key={key}>
                  {fieldData.type === "text" || fieldData.type === "number" ? (
                    <TextField
                      fullWidth
                      label={fieldData.name}
                      value={fieldData.value || "N/A"}
                      margin="normal"
                      size="medium"
                      InputProps={{ readOnly: true }}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : fieldData.type === "date" ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label={fieldData.name}
                        value={fieldData.value ? dayjs(fieldData.value) : null}
                        readOnly
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: "normal",
                            size: "medium",
                            InputLabelProps: { shrink: true },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  ) : fieldData.type === "select" || fieldData.type === "radio" ? (
                    <TextField
                      fullWidth
                      label={fieldData.name}
                      value={fieldData.value || "N/A"}
                      margin="normal"
                      size="medium"
                      InputProps={{ readOnly: true }}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : fieldData.type === "checkbox" ? (
                    <FormControlLabel
                      control={<Switch checked={fieldData.value || false} readOnly />}
                      label={fieldData.name}
                      sx={{ mt: 2, mb: 1 }}
                    />
                  ) : fieldData.type === "file" ? (
                    <TextField
                      fullWidth
                      label={fieldData.name}
                      value={
                        Array.isArray(fieldData.value) && fieldData.value.length > 0
                          ? fieldData.value.map((url, index) => `File ${index + 1}`).join(", ")
                          : "No files uploaded"
                      }
                      margin="normal"
                      size="medium"
                      InputProps={{
                        readOnly: true,
                        endAdornment:
                          Array.isArray(fieldData.value) && fieldData.value.length > 0 ? (
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {fieldData.value.map((url, index) => (
                                <Link href={url} target="_blank" rel="noopener noreferrer" key={index}>
                                  <CloudUploadIcon sx={{ fontSize: 20, color: "#667eea" }} />
                                </Link>
                              ))}
                            </Box>
                          ) : null,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : null}
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewExpenseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
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
    </Box>
  )
}
