// "use client"

// import { useState, useEffect } from "react"
// import {
//   Box,
//   Grid,
//   TextField,
//   Typography,
//   Tabs,
//   Tab,
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
//   Fade,
// } from "@mui/material"
// import CategoryIcon from "@mui/icons-material/Category"
// import { Delete, KeyboardBackspace } from "@mui/icons-material"
// import { DataGrid } from "@mui/x-data-grid"
// import Vendor from "./Vendor/page"
// import { Edit } from "lucide-react"
// import axios from "axios"
// import AddIcon from "@mui/icons-material/Add"
// import { Visibility } from '@mui/icons-material';
// import CloseIcon from "@mui/icons-material/Close"
// import { useRouter } from "next/navigation"
// import { keyframes } from "@mui/material/styles"
// import ViewFormDialog from "./viewFormDialog"

// const fadeIn = keyframes`
//   from { opacity: 0; transform: translateY(20px); } 
//   to { opacity: 1; transform: translateY(0); }
// `

// const TabPanel = ({ children, value, index, ...other }) => (
//   <Box role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
//     {value === index && (
//       <Fade in timeout={300}>
//         <Box>{children}</Box>
//       </Fade>
//     )}
//   </Box>
// )

// export default function SubCategoryUI() {
//   const [tab, setTab] = useState(0)
//   const [activeSwitches, setActiveSwitches] = useState({})
//   const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
//   const router = useRouter()

//   // Remove expense dialog states
//   const [open, setOpen] = useState(false)
//   const handleOpen = () => setOpen(true)
//   const handleClose = () => setOpen(false)
//   const [color, setColor] = useState("#000000")
//   const [icon, setIcon] = useState("🎨")

//   const [openSub, setOpenSub] = useState(false)
//   const handleOpenSub = () => setOpenSub(true)
//   const handleCloseSub = () => setOpenSub(false)

//   const formatDate = (isoString) => {
//     if (!isoString) return ""
//     return new Date(isoString).toLocaleDateString()
//   }

//  const [viewDialogOpen, setViewDialogOpen] = useState(false);
//   const [selectedFormId, setSelectedFormId] = useState(null);
//   const [categories, setCategories] = useState([])

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

//   const handleToggle = (id) => {
//     setActiveSwitches((prev) => ({ ...prev, [id]: !prev[id] }))
//   }

//   const renderConfigPanel = (logicConfig = {}) => {
//     const textFields = []
//     const toggleFields = []

//     Object.entries(logicConfig).forEach(([key, value]) => {
//       if (key === "mandatoryFields" || key === "additionalRules") return
//       if (typeof value === "boolean") {
//         toggleFields.push([key, value])
//       } else {
//         textFields.push([key, value])
//       }
//     })

//     return (
//       <Paper
//         elevation={0}
//         sx={{
//           mt: 2,
//           p: 2,
//           borderRadius: 2,
//           bgcolor: "white",
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//           animation: `${fadeIn} 0.5s ease-in forwards`,
//         }}
//       >
//         <Grid container spacing={2}>
//           {textFields.map(([key, value]) => {
//             const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
//             return (
//               <Grid item xs={12} md={6} key={key}>
//                 <Box display="flex" flexDirection="column" gap={1}>
//                   <Typography fontWeight={600}>{label}</Typography>
//                   <TextField fullWidth defaultValue={value} />
//                 </Box>
//               </Grid>
//             )
//           })}
//           {toggleFields.map(([key, value]) => {
//             const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
//             return (
//               <Grid item xs={12} key={key}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center" p={1.5} borderRadius={1}>
//                   <Typography fontWeight={600}>{label}</Typography>
//                   <Switch
//                     checked={value}
//                     sx={{
//                       transform: "scale(1.2)",
//                       "& .MuiSwitch-thumb": { backgroundColor: "#fff" },
//                       "& .Mui-checked + .MuiSwitch-track": { backgroundColor: "primary" },
//                     }}
//                   />
//                 </Box>
//               </Grid>
//             )
//           })}
//         </Grid>
//       </Paper>
//     )
//   }

//   const [subCategories, setSubCategories] = useState([])

//   const getAllSubCategory = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/subCategory`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       setSubCategories(res.data.items?.subcategories || [])
//     } catch (error) {
//       console.error("Error fetching subcategories:", error)
//     }
//   }

//   const [subCategoryForm, setSubCategoryForm] = useState({
//     systemCategoryId: "",
//     name: "",
//     description: "",
//     icon: "",
//     color: "#000000",
//   })

//   const handleAddSubCategory = async () => {
//     try {
//       const res = await axios.post(`${baseUrl}/v1/api/subCategory`, subCategoryForm, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       handleCloseSub()
//       getAllSubCategory()
//     } catch (error) {
//       console.error("Error adding subcategory:", error)
//     } finally {
//       setSubCategoryForm({
//         systemCategoryId: "",
//         name: "",
//         description: "",
//         icon: "",
//         color: "#000000",
//       })
//     }
//   }

//   const handleFormChange = (field, value) => {
//     setSubCategoryForm((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleDeleteSubCategory = async (id) => {
//     try {
//       const res = await axios.delete(`${baseUrl}/v1/api/subCategory/${id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       getAllSubCategory()
//     } catch (error) {
//       console.error("Error fetching subcategories:", error)
//     }
//   }

//   const handleUpdateSubCategory = async (id) => {
//     try {
//       await axios.put(`${baseUrl}/v1/api/subCategory/${id}`, subCategoryForm, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       getAllSubCategory()
//       handleCloseSub()
//     } catch (error) {
//       console.error("Error updating subcategory:", error)
//     }
//   }

//   const handleEditClick = (subCategory) => {
//     setSubCategoryForm(subCategory)
//     setOpenSub(true)
//   }

//   const handleSubmit = () => {
//     if (subCategoryForm._id) {
//       handleUpdateSubCategory(subCategoryForm.subcategoryId)
//     } else {
//       handleAddSubCategory()
//     }
//   }

//   const columns = [
//     { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
//     { field: "description", headerName: "Description", flex: 2, minWidth: 250 },
//     { field: "subcategoryName", headerName: "Sub Category", flex: 1, minWidth: 150 },
//     { field: "systemCategoryName", headerName: "System Category", flex: 1, minWidth: 150 },
//     { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 150 },
//     { field: "updatedAt", headerName: "Updated At", flex: 1, minWidth: 150 },
//     {
//       field: "action",
//       headerName: "Action",
//       flex: 1,
//       minWidth: 150,
//       sortable: false,
//       renderCell: (params) => (
//         <Box sx={{ display: "flex", gap: 1 }}>
//           <IconButton
//             onClick={() => {
//               // Navigate to edit expense page with ID
//               router.push(`/employeeSetup/NewExpensesDetails/Category/${params.row.expenseTypeId}`)
//             }}
//             color="secondary"
//             size="small"
//           >
//             <Edit size={16} />
//           </IconButton>
//            <IconButton
//           onClick={() => {
//             setSelectedFormId(params.row.formId);
//             setViewDialogOpen(true);
//           }}
//           color="info"
//           size="small"
//           title="View Form"
//         >
//           <Visibility size={16} />
//         </IconButton>
//           <IconButton onClick={() => handleDeleteExpense(params.row.expenseTypeId)} color="primary" size="small">
//             <Delete fontSize="small" />
//           </IconButton>
//         </Box>
//       ),
//     },
//   ]

//   const [allExpense, setAllExpense] = useState([])

//   const getAllExpense = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/expenseType`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
      
//       const expenses = res.data?.items?.expenseTypes || []
//       const formatted = expenses.map((item, index) => ({
//         id: item._id || index,
//         expenseTypeId: item.expenseTypeId || "",
//         name: item.name,
//         description: item.description,
//         subcategoryId: item.subcategoryId?.subcategoryId || "",
//         systemCategoryId: item.systemCategoryId?.systemCategoryId || "",
//         formId: item.formId.formId || "",
//         subcategoryName: item.subcategoryId?.name || "",
//         systemCategoryName: item.systemCategoryId?.name || "",
//         createdAt: formatDate(item.createdAt),
//         updatedAt: formatDate(item.updatedAt),
//       }))
//       setAllExpense(formatted)
//     } catch (error) {
//       console.error("Error fetching expense types:", error)
//     }
//   }

//   const handleDeleteExpense = async (id) => {
//     try {
//       const res = await axios.delete(`${baseUrl}/v1/api/expenseType/${id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: token,
//         },
//       })
//       getAllExpense()
//     } catch (error) {
//       console.error("Error deleting expense:", error)
//     }
//   }

//   useEffect(() => {
//     getAllCategory()
//     getAllSubCategory()
//     getAllExpense()
//   }, [])

//   return (
//     <Box sx={{ p: 3, bgcolor: "#f9f9fb", minHeight: "100vh" }}>
//       {/* Gradient Header */}
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
//                 Categories
//               </Typography>
//               <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
//                 Define and manage custom categories for organizing data and workflows.
//               </Typography>
//             </Box>
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
//             onClick={() => router.push("/employeeSetup")}
//           >
//             <KeyboardBackspace sx={{ fontSize: 18 }} />
//           </Button>
//         </Box>
//       </Paper>

//       {/* Tab Panels */}
//       <Box sx={{ p: 4, border: "1px solid #EAECF0" }}>
//         <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
//           <Box>
//             <Typography variant="h5" fontWeight={600} color="#262E3D">
//               System Categories
//             </Typography>
//             <Typography variant="body2" sx={{ color: "#667085", fontSize: "0.850rem" }}>
//               Built-in expense categories with unique business logic and features
//             </Typography>
//           </Box>
//           <Box>
//             {tab === 1 ? (
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={() => {
//                   handleOpenSub()
//                   setSubCategoryForm({
//                     systemCategoryId: "",
//                     name: "",
//                     description: "",
//                     icon: "",
//                     color: "#000000",
//                   })
//                 }}
//                 sx={{
//                   textTransform: "none",
//                   borderRadius: 2,
//                   bgcolor: "#667eea",
//                   "&:hover": {
//                     bgcolor: "#764ba2",
//                   },
//                 }}
//               >
//                 Add Sub Category
//               </Button>
//             ) : tab === 2 ? (
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={() => router.push("/employeeSetup/NewExpensesDetails/Category/newExpense")} // Navigate to new page
//                 sx={{
//                   textTransform: "none",
//                   borderRadius: 2,
//                   bgcolor: "#667eea",
//                   "&:hover": {
//                     bgcolor: "#764ba2",
//                   },
//                 }}
//               >
//                 Add Expense
//               </Button>
//             ) : tab === 3 ? (
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleOpen}
//                 sx={{
//                   textTransform: "none",
//                   borderRadius: 2,
//                   bgcolor: "#667eea",
//                   "&:hover": {
//                     bgcolor: "#764ba2",
//                   },
//                 }}
//               >
//                 Add Vendor
//               </Button>
//             ) : null}
//           </Box>
//         </Box>

//         <Paper elevation={0} sx={{ pb: 1, mb: 2, border: "1px solid #EAECF0" }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Tabs
//               value={tab}
//               onChange={(e, val) => setTab(val)}
//               variant="fullWidth"
//               sx={{
//                 width: "100%",
//                 borderBottom: "none",
//                 "& .MuiTabs-indicator": {
//                   display: "none",
//                 },
//                 "& .MuiTab-root": {
//                   flex: 1,
//                   textTransform: "none",
//                   fontWeight: 500,
//                   fontSize: "0.900rem",
//                   color: "#666",
//                   minHeight: 48,
//                   position: "relative",
//                   "&:hover": {
//                     backgroundColor: "transparent",
//                     border: "none",
//                   },
//                   "&.Mui-selected": {
//                     color: "#667eea",
//                     "&::after": {
//                       content: '""',
//                       position: "absolute",
//                       bottom: 0,
//                       left: "25%",
//                       width: "50%",
//                       height: "3px",
//                       backgroundColor: "#667eea",
//                       borderRadius: 2,
//                     },
//                   },
//                 },
//               }}
//             >
//               <Tab label="Categories" disableRipple />
//               <Tab label="Sub Categories" disableRipple />
//               <Tab label="Expense Type" disableRipple />
//               <Tab label="Vendors" disableRipple />
//             </Tabs>
//           </Box>
//         </Paper>

//         <TabPanel index={0} value={tab}>
//           <Box hidden={tab !== 0}>
//             <Box display="flex" flexDirection="column" gap={5}>
//               {categories.map((item) => (
//                 <Box key={item._id}>
//                   <Paper
//                     elevation={3}
//                     sx={{
//                       p: 4,
//                       borderRadius: 2,
//                       bgcolor: "white",
//                       boxShadow: 2,
//                       border: "none",
//                     }}
//                   >
//                     <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
//                       <Box display="flex" alignItems="center" gap={2}>
//                         <Button
//                           sx={{
//                             bgcolor: "#667eea",
//                             width: 45,
//                             height: 45,
//                             borderRadius: "30%",
//                             color: "#ffffff",
//                             minWidth: 0,
//                             p: 0,
//                           }}
//                         >
//                           <CategoryIcon fontSize="medium" sx={{ color: "white" }} />
//                         </Button>
//                         <Box>
//                           <Typography fontWeight={600} fontSize="18px" sx={{ color: "#262E3D" }}>
//                             {item.name}
//                           </Typography>
//                           <Typography fontWeight={400} fontSize="14px" sx={{ color: "#667085" }}>
//                             {item.description}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <Switch
//                         checked={!!activeSwitches[item._id]}
//                         onChange={() => handleToggle(item._id)}
//                         sx={{
//                           transform: "scale(1.3)",
//                           "& .MuiSwitch-thumb": { backgroundColor: "#fff" },
//                           "& .Mui-checked + .MuiSwitch-track": { backgroundColor: "primary" },
//                         }}
//                       />
//                     </Box>
//                     {activeSwitches[item._id] && renderConfigPanel(item.logicConfig)}
//                   </Paper>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         </TabPanel>

//         <TabPanel index={1} value={tab}>
//           <Box display="flex" flexDirection="column" gap={2}>
//             {subCategories.map((item) => (
//               <Paper
//                 key={item._id}
//                 elevation={0}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   p: 3,
//                   borderRadius: 2,
//                   border: "1px solid #e0e0e0",
//                   bgcolor: "white",
//                   "&:hover": {
//                     boxShadow: 1,
//                   },
//                 }}
//               >
//                 <Box display="flex" alignItems="center" gap={2}>
//                   <Button
//                     sx={{
//                       bgcolor: "#667eea",
//                       width: 45,
//                       height: 45,
//                       borderRadius: "30%",
//                       color: "#ffffff",
//                       minWidth: 0,
//                       p: 0,
//                     }}
//                   >
//                     <CategoryIcon fontSize="medium" />
//                   </Button>
//                   <Box>
//                     <Typography fontWeight={600} fontSize="18px" sx={{ color: "#262E3D" }}>
//                       {item.name}
//                     </Typography>
//                     <Typography fontWeight={400} fontSize="14px" sx={{ color: "#667085" }}>
//                       {item.description || "No description"}
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Box display="flex" gap={1}>
//                   <IconButton
//                     onClick={() => {
//                       handleEditClick(item)
//                     }}
//                   >
//                     <Edit fontSize="small" />
//                   </IconButton>
//                   <IconButton
//                     onClick={() => {
//                       handleDeleteSubCategory(item.subcategoryId)
//                     }}
//                   >
//                     <Delete fontSize="small" color="error" />
//                   </IconButton>
//                 </Box>
//               </Paper>
//             ))}
//           </Box>
//         </TabPanel>

//         <TabPanel index={2} value={tab}>
//           <Box sx={{ width: "100%", overflowX: "auto" }}>
//             {/* <Box sx={{ minWidth: "900px" }}> */}
//               <DataGrid
//                 rows={allExpense}
//                 columns={columns}
//                 checkboxSelection
//                 autoHeight
//                 rowHeight={60}
//                 sx={{
//                   "& .MuiDataGrid-columnHeaders": {
//                     backgroundColor: "#667eea",
//                     color: "#fff",
//                     fontWeight: 600,
//                   },
//                   "& .MuiDataGrid-columnHeaderTitle": {
//                     fontWeight: "bold",
//                     color: "#fff",
//                   },
//                   "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
//                     color: "#fff",
//                   },
//                   "& .MuiDataGrid-cell": {
//                     borderBottom: "1px solid rgba(224, 224, 224, 1)",
//                     display: "flex",
//                     alignItems: "center",
//                   },
//                   "& .MuiDataGrid-row": {
//                     "&:hover": {
//                       backgroundColor: "rgba(25, 118, 210, 0.04)",
//                       cursor: "pointer",
//                     },
//                   },
//                   "& .MuiDataGrid-toolbarContainer": {
//                     padding: "12px",
//                     backgroundColor: "#f8f9fa",
//                     borderBottom: "1px solid #e0e0e0",
//                   },
//                 }}
//               />
//             {/* </Box> */}
//           </Box>
//         </TabPanel>

//         <TabPanel index={3} value={tab}>
//           <Vendor />
//         </TabPanel>
//       </Box>

//       {/* Keep only Sub Category Dialog - Remove Expense Dialog */}
//       <Dialog open={openSub} onClose={handleCloseSub} fullWidth maxWidth="md">
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             color: "white",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           Sub Category
//           <IconButton onClick={handleCloseSub} sx={{ color: "white" }}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Grid container spacing={2}>
//             {!subCategoryForm._id && (
//               <Grid item xs={12} sm={6}>
//                 <Typography fontWeight={600} color="#262E3D" mb={2}>
//                   Select System Category
//                 </Typography>
//                 <Select
//                   fullWidth
//                   value={subCategoryForm.systemCategoryId}
//                   onChange={(e) => handleFormChange("systemCategoryId", e.target.value)}
//                   displayEmpty
//                 >
//                   <MenuItem value="" disabled>
//                     Select System Category
//                   </MenuItem>
//                   {categories.map((cat) => (
//                     <MenuItem key={cat._id} value={cat.systemCategoryId}>
//                       {cat.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </Grid>
//             )}
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600} color="#262E3D" mb={2}>
//                 Sub Category Name
//               </Typography>
//               <TextField
//                 fullWidth
//                 placeholder="Enter Sub Category Name"
//                 value={subCategoryForm.name}
//                 onChange={(e) => handleFormChange("name", e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Typography fontWeight={600} color="#262E3D" mt={4} mb={2}>
//                 Description
//               </Typography>
//               <TextField
//                 fullWidth
//                 placeholder="Write Description"
//                 multiline
//                 rows={2}
//                 value={subCategoryForm.description}
//                 onChange={(e) => handleFormChange("description", e.target.value)}
//               />
//             </Grid>
//             {!subCategoryForm._id && (
//               <Grid item xs={12} sm={6}>
//                 <Typography fontWeight={600} color="#262E3D" mt={4} mb={2}>
//                   Select Icon (Emoji)
//                 </Typography>
//                 <Select
//                   fullWidth
//                   value={subCategoryForm.icon}
//                   onChange={(e) => handleFormChange("icon", e.target.value)}
//                   displayEmpty
//                 >
//                   <MenuItem value="" disabled>
//                     Select Icon
//                   </MenuItem>
//                   <MenuItem value="🎨">🎨 Art</MenuItem>
//                   <MenuItem value="📦">📦 Package</MenuItem>
//                   <MenuItem value="🧾">🧾 Invoice</MenuItem>
//                   <MenuItem value="💼">💼 Business</MenuItem>
//                   <MenuItem value="💡">💡 Idea</MenuItem>
//                 </Select>
//               </Grid>
//             )}
//             {!subCategoryForm._id && (
//               <Grid item xs={12} sm={6}>
//                 <Typography fontWeight={600} color="#262E3D" mt={4} mb={2}>
//                   Color
//                 </Typography>
//                 <input
//                   type="color"
//                   value={subCategoryForm.color}
//                   onChange={(e) => handleFormChange("color", e.target.value)}
//                   style={{
//                     width: "100%",
//                     height: "56px",
//                     borderRadius: 8,
//                     border: "1px solid #ccc",
//                     padding: 0,
//                   }}
//                 />
//               </Grid>
//             )}
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2 }}>
//           <Button onClick={handleCloseSub} variant="outlined">
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
//           >
//             {subCategoryForm._id ? "Update Sub Category" : "Add Sub Category"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Keep Vendor Dialog */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
//         <DialogTitle
//           sx={{
//             bgcolor: "#1976d2",
//             color: "white",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           Vendor Creation
//           <IconButton onClick={handleClose} sx={{ color: "white" }}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Typography variant="body2" color="text.secondary" mb={3}>
//             Add a new vendor for expense payments
//           </Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600}>Vendor Name</Typography>
//               <TextField fullWidth placeholder="Enter Vendor name" />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600}>Email</Typography>
//               <TextField fullWidth placeholder="Enter Email" />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600}>Phone</Typography>
//               <TextField fullWidth placeholder="Enter Phone no." />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600}>Category</Typography>
//               <TextField fullWidth value="Monthly" disabled />
//             </Grid>
//             <Grid item xs={12}>
//               <Typography fontWeight={600}>Address</Typography>
//               <TextField fullWidth placeholder="Write Address" multiline rows={2} />
//             </Grid>
//             <Grid item xs={12}>
//               <Typography fontWeight={600} mt={2}>
//                 Bank Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600}>Account Holder Name</Typography>
//               <TextField fullWidth placeholder="Enter Bank Details" />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600}>Bank Name</Typography>
//               <TextField fullWidth placeholder="Enter Bank Details" />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600}>Branch Name</Typography>
//               <TextField fullWidth placeholder="Enter Bank Details" />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600}>Account Number</Typography>
//               <TextField fullWidth placeholder="Enter Bank Details" />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600}>IFSC Code</Typography>
//               <TextField fullWidth placeholder="Enter Bank Details" />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600}>Account Type</Typography>
//               <Select fullWidth displayEmpty defaultValue="">
//                 <MenuItem value="" disabled>
//                   Select Account Type
//                 </MenuItem>
//                 <MenuItem value="savings">Savings</MenuItem>
//                 <MenuItem value="current">Current</MenuItem>
//               </Select>
//             </Grid>
//             <Grid item xs={12}>
//               <Typography fontWeight={600}>Bank Address</Typography>
//               <TextField fullWidth placeholder="Write Bank Address" multiline rows={2} />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2 }}>
//           <Button onClick={handleClose} variant="outlined">
//             Cancel
//           </Button>
//           <Button variant="contained" sx={{ bgcolor: "#1976d2" }}>
//             Update Vendor
//           </Button>
//         </DialogActions>
//       </Dialog>

//        {/* View Form Dialog */}
//       <ViewFormDialog
//         open={viewDialogOpen}
//         onClose={() => {
//           setViewDialogOpen(false);
//           setSelectedFormId(null);
//         }}
//         formId={selectedFormId}
//         baseUrl={baseUrl}
//         token={token}
//       />
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
  Tabs,
  Tab,
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
  Fade,
  FormControl,
  Snackbar,
  Alert
} from "@mui/material"
import CategoryIcon from "@mui/icons-material/Category"
import { Delete, KeyboardBackspace } from "@mui/icons-material"
import { DataGrid } from "@mui/x-data-grid"
import Vendor from "./Vendor/page"
import { Edit } from "lucide-react"
import axios from "axios"
import AddIcon from "@mui/icons-material/Add"
import { Visibility } from "@mui/icons-material"
import CloseIcon from "@mui/icons-material/Close"
import { useRouter } from "next/navigation"
import { keyframes } from "@mui/material/styles"
import ViewFormDialog from "./viewFormDialog"

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const TabPanel = ({ children, value, index, ...other }) => (
  <Box role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
    {value === index && (
      <Fade in timeout={300}>
        <Box>{children}</Box>
      </Fade>
    )}
  </Box>
)

export default function SubCategoryUI() {
  const [tab, setTab] = useState(0)
  const [activeSwitches, setActiveSwitches] = useState({})
  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter()

  // Vendor states
  const [vendors, setVendors] = useState([])
  const [openVendor, setOpenVendor] = useState(false)
  const [vendorForm, setVendorForm] = useState({
    vendorName: "",
    email: "",
    phone: "",
    category: "",
    address: "",
    bankDetails: {
      accountHolderName: "",
      bankName: "",
      ifscCode: "",
      accountNumber: "",
      branchName: "",
      accountType: "",
      bankAddress: "",
    },
  })
  const [editingVendor, setEditingVendor] = useState(null)
  const [vendorErrors, setVendorErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Category options
  const categoryOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
    { value: "One-time", label: "One-time" },
  ]

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\s+/g, ""))
  }

  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
    return ifscRegex.test(ifsc)
  }

  const validateAccountNumber = (accountNumber) => {
    return accountNumber.length >= 9 && accountNumber.length <= 18 && /^[0-9]+$/.test(accountNumber)
  }

  const validateVendorForm = () => {
    const errors = {}

    // Required field validations
    if (!vendorForm.vendorName.trim()) {
      errors.vendorName = "Vendor name is required"
    }

    if (!vendorForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!validateEmail(vendorForm.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!vendorForm.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!validatePhone(vendorForm.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number"
    }

    if (!vendorForm.category) {
      errors.category = "Category is required"
    }

    if (!vendorForm.address.trim()) {
      errors.address = "Address is required"
    }

    // Bank details validations
    if (!vendorForm.bankDetails.accountHolderName.trim()) {
      errors.accountHolderName = "Account holder name is required"
    }

    if (!vendorForm.bankDetails.bankName.trim()) {
      errors.bankName = "Bank name is required"
    }

    if (!vendorForm.bankDetails.ifscCode.trim()) {
      errors.ifscCode = "IFSC code is required"
    } else if (!validateIFSC(vendorForm.bankDetails.ifscCode)) {
      errors.ifscCode = "Please enter a valid IFSC code (e.g., HDFC0001234)"
    }

    if (!vendorForm.bankDetails.accountNumber.trim()) {
      errors.accountNumber = "Account number is required"
    } else if (!validateAccountNumber(vendorForm.bankDetails.accountNumber)) {
      errors.accountNumber = "Please enter a valid account number (9-18 digits)"
    }

    setVendorErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Remove expense dialog states
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [color, setColor] = useState("#000000")
  const [icon, setIcon] = useState("🎨")

  const [openSub, setOpenSub] = useState(false)
  const handleOpenSub = () => setOpenSub(true)
  const handleCloseSub = () => setOpenSub(false)

  const formatDate = (isoString) => {
    if (!isoString) return ""
    return new Date(isoString).toLocaleDateString()
  }

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState(null)
  const [categories, setCategories] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

   // Form Builder Functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }


  // Vendor API functions
  const getAllVendors = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/vendor/all`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setVendors(res.data.items?.vendors || [])
    } catch (error) {
      console.error("Error fetching vendors:", error)
    }
  }

  const handleAddVendor = async () => {
    if (!validateVendorForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        vendorName: vendorForm.vendorName.trim(),
        email: vendorForm.email.trim(),
        phone: vendorForm.phone.trim(),
        category: vendorForm.category,
        address: vendorForm.address.trim(),
        bankDetails: {
          accountHolderName: vendorForm.bankDetails.accountHolderName.trim(),
          bankName: vendorForm.bankDetails.bankName.trim(),
          ifscCode: vendorForm.bankDetails.ifscCode.trim().toUpperCase(),
          accountNumber: vendorForm.bankDetails.accountNumber.trim(),
        },
      }

      await axios.post(`${baseUrl}/v1/api/vendor`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      handleCloseVendor()
      getAllVendors()
      setSnackbar({ open: true, message: "Vendor added successfully!", severity: "success" })
    } catch (error) {
      console.error("Error adding vendor:", error)
      setSnackbar({ open: true, message: "Error adding vendor. Please try again.", severity: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateVendor = async () => {
    if (!validateVendorForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        vendorName: vendorForm.vendorName.trim(),
        email: vendorForm.email.trim(),
        phone: vendorForm.phone.trim(),
        category: vendorForm.category,
        address: vendorForm.address.trim(),
        bankDetails: {
          accountHolderName: vendorForm.bankDetails.accountHolderName.trim(),
          bankName: vendorForm.bankDetails.bankName.trim(),
          ifscCode: vendorForm.bankDetails.ifscCode.trim().toUpperCase(),
          accountNumber: vendorForm.bankDetails.accountNumber.trim(),
        },
      }

      await axios.put(`${baseUrl}/v1/api/vendor/${editingVendor.vendorId}`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      handleCloseVendor()
      getAllVendors()
      setSnackbar({ open: true, message: "Vendor updated successfully!", severity: "success" })
      setEditingVendor(null)
    } catch (error) {
      console.error("Error updating vendor:", error)
      setSnackbar({ open: true, message: "Error updating vendor. Please try again.", severity: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVendor = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await axios.delete(`${baseUrl}/v1/api/vendor/${vendorId}`, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })
        getAllVendors()
        setSnackbar({ open: true, message: "Vendor deleted successfully!", severity: "success" })
      } catch (error) {
        console.error("Error deleting vendor:", error)
        setSnackbar({ open: true, message: "Error deleting vendor. Please try again.", severity: "error" })
      }
    }
  }

  const handleOpenVendor = (vendor = null) => {
    if (vendor) {
      setEditingVendor(vendor)
      setVendorForm({
        vendorName: vendor.vendorName,
        email: vendor.email,
        phone: vendor.phone,
        category: vendor.category,
        address: vendor.address,
        bankDetails: {
          accountHolderName: vendor.bankDetails?.accountHolderName || "",
          bankName: vendor.bankDetails?.bankName || "",
          ifscCode: vendor.bankDetails?.ifscCode || "",
          accountNumber: vendor.bankDetails?.accountNumber || "",
          branchName: "",
          accountType: "",
          bankAddress: "",
        },
      })
    } else {
      setEditingVendor(null)
      setVendorForm({
        vendorName: "",
        email: "",
        phone: "",
        category: "",
        address: "",
        bankDetails: {
          accountHolderName: "",
          bankName: "",
          ifscCode: "",
          accountNumber: "",
          branchName: "",
          accountType: "",
          bankAddress: "",
        },
      })
    }
    setVendorErrors({})
    setOpenVendor(true)
  }

  const handleCloseVendor = () => {
    setOpenVendor(false)
    setEditingVendor(null)
    setVendorForm({
      vendorName: "",
      email: "",
      phone: "",
      category: "",
      address: "",
      bankDetails: {
        accountHolderName: "",
        bankName: "",
        ifscCode: "",
        accountNumber: "",
        branchName: "",
        accountType: "",
        bankAddress: "",
      },
    })
    setVendorErrors({})
    setIsSubmitting(false)
  }

  const handleVendorFormChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setVendorForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setVendorForm((prev) => ({ ...prev, [field]: value }))
    }

    // Clear error when user starts typing
    if (vendorErrors[field] || vendorErrors[field.split(".")[1]]) {
      const newErrors = { ...vendorErrors }
      delete newErrors[field]
      delete newErrors[field.split(".")[1]]
      setVendorErrors(newErrors)
    }
  }

  const handleVendorSubmit = () => {
    if (editingVendor) {
      handleUpdateVendor()
    } else {
      handleAddVendor()
    }
  }

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

  const handleToggle = (id) => {
    setActiveSwitches((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const renderConfigPanel = (logicConfig = {}) => {
    const textFields = []
    const toggleFields = []

    Object.entries(logicConfig).forEach(([key, value]) => {
      if (key === "mandatoryFields" || key === "additionalRules") return
      if (typeof value === "boolean") {
        toggleFields.push([key, value])
      } else {
        textFields.push([key, value])
      }
    })

    return (
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          animation: `${fadeIn} 0.5s ease-in forwards`,
        }}
      >
        <Grid container spacing={2}>
          {textFields.map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
            return (
              <Grid item xs={12} md={6} key={key}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography fontWeight={600}>{label}</Typography>
                  <TextField fullWidth defaultValue={value} />
                </Box>
              </Grid>
            )
          })}
          {toggleFields.map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
            return (
              <Grid item xs={12} key={key}>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={1.5} borderRadius={1}>
                  <Typography fontWeight={600}>{label}</Typography>
                  <Switch
                    checked={value}
                    sx={{
                      transform: "scale(1.2)",
                      "& .MuiSwitch-thumb": { backgroundColor: "#fff" },
                      "& .Mui-checked + .MuiSwitch-track": { backgroundColor: "primary" },
                    }}
                  />
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Paper>
    )
  }

  const [subCategories, setSubCategories] = useState([])

  const getAllSubCategory = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/subCategory`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setSubCategories(res.data.items?.subcategories || [])
    } catch (error) {
      console.error("Error fetching subcategories:", error)
    }
  }

  const [subCategoryForm, setSubCategoryForm] = useState({
    systemCategoryId: "",
    name: "",
    description: "",
    icon: "",
    color: "#000000",
  })

  const handleAddSubCategory = async () => {
    try {
      const res = await axios.post(`${baseUrl}/v1/api/subCategory`, subCategoryForm, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      handleCloseSub()
      getAllSubCategory()
    } catch (error) {
      console.error("Error adding subcategory:", error)
    } finally {
      setSubCategoryForm({
        systemCategoryId: "",
        name: "",
        description: "",
        icon: "",
        color: "#000000",
      })
    }
  }

  const handleFormChange = (field, value) => {
    setSubCategoryForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleDeleteSubCategory = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/v1/api/subCategory/${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      getAllSubCategory()
    } catch (error) {
      console.error("Error fetching subcategories:", error)
    }
  }

  const handleUpdateSubCategory = async (id) => {
    try {
      await axios.put(`${baseUrl}/v1/api/subCategory/${id}`, subCategoryForm, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      getAllSubCategory()
      handleCloseSub()
    } catch (error) {
      console.error("Error updating subcategory:", error)
    }
  }

  const handleEditClick = (subCategory) => {
    setSubCategoryForm(subCategory)
    setOpenSub(true)
  }

  const handleSubmit = () => {
    if (subCategoryForm._id) {
      handleUpdateSubCategory(subCategoryForm.subcategoryId)
    } else {
      handleAddSubCategory()
    }
  }

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "description", headerName: "Description", flex: 2, minWidth: 250 },
    { field: "subcategoryName", headerName: "Sub Category", flex: 1, minWidth: 150 },
    { field: "systemCategoryName", headerName: "System Category", flex: 1, minWidth: 150 },
    { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 150 },
    { field: "updatedAt", headerName: "Updated At", flex: 1, minWidth: 150 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => {
              router.push(`/employeeSetup/NewExpensesDetails/Category/${params.row.expenseTypeId}`)
            }}
            color="secondary"
            size="small"
          >
            <Edit size={16} />
          </IconButton>

          <IconButton
            onClick={() => {
              setSelectedFormId(params.row.formId)
              setViewDialogOpen(true)
            }}
            color="info"
            size="small"
            title="View Form"
          >
            <Visibility size={16} />
          </IconButton>

          <IconButton onClick={() => handleDeleteExpense(params.row.expenseTypeId)} color="primary" size="small">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  const [allExpense, setAllExpense] = useState([])

  const getAllExpense = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/expenseType`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const expenses = res.data?.items?.expenseTypes || []
      const formatted = expenses.map((item, index) => ({
        id: item._id || index,
        expenseTypeId: item.expenseTypeId || "",
        name: item.name,
        description: item.description,
        subcategoryId: item.subcategoryId?.subcategoryId || "",
        systemCategoryId: item.systemCategoryId?.systemCategoryId || "",
        formId: item.formId?.formId || "",
        subcategoryName: item.subcategoryId?.name || "",
        systemCategoryName: item.systemCategoryId?.name || "",
        createdAt: formatDate(item.createdAt),
        updatedAt: formatDate(item.updatedAt),
      }))
      setAllExpense(formatted)
    } catch (error) {
      console.error("Error fetching expense types:", error)
    }
  }

  const handleDeleteExpense = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/v1/api/expenseType/${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      getAllExpense()
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  useEffect(() => {
    getAllCategory()
    getAllSubCategory()
    getAllExpense()
    getAllVendors()
  }, [])

  return (
    <Box sx={{ p: 3, bgcolor: "#f9f9fb", minHeight: "100vh" }}>
      {/* Gradient Header */}
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
                Categories
              </Typography>
              <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                Define and manage custom categories for organizing data and workflows.
              </Typography>
            </Box>
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
            onClick={() => router.push("/employeeSetup")}
          >
            <KeyboardBackspace sx={{ fontSize: 18 }} />
          </Button>
        </Box>
      </Paper>

      {/* Tab Panels */}
      <Box sx={{ p: 4, border: "1px solid #EAECF0" }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" fontWeight={600} color="#262E3D">
              System Categories
            </Typography>
            <Typography variant="body2" sx={{ color: "#667085", fontSize: "0.850rem" }}>
              Built-in expense categories with unique business logic and features
            </Typography>
          </Box>
          <Box>
            {tab === 1 ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  handleOpenSub()
                  setSubCategoryForm({
                    systemCategoryId: "",
                    name: "",
                    description: "",
                    icon: "",
                    color: "#000000",
                  })
                }}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: "#667eea",
                  "&:hover": {
                    bgcolor: "#764ba2",
                  },
                }}
              >
                Add Sub Category
              </Button>
            ) : tab === 2 ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/employeeSetup/NewExpensesDetails/Category/newExpense")}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: "#667eea",
                  "&:hover": {
                    bgcolor: "#764ba2",
                  },
                }}
              >
                Add Expense
              </Button>
            ) : tab === 3 ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenVendor()}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: "#667eea",
                  "&:hover": {
                    bgcolor: "#764ba2",
                  },
                }}
              >
                Add Vendor
              </Button>
            ) : null}
          </Box>
        </Box>

        <Paper elevation={0} sx={{ pb: 1, mb: 2, border: "1px solid #EAECF0" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Tabs
              value={tab}
              onChange={(e, val) => setTab(val)}
              variant="fullWidth"
              sx={{
                width: "100%",
                borderBottom: "none",
                "& .MuiTabs-indicator": {
                  display: "none",
                },
                "& .MuiTab-root": {
                  flex: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.900rem",
                  color: "#666",
                  minHeight: 48,
                  position: "relative",
                  "&:hover": {
                    backgroundColor: "transparent",
                    border: "none",
                  },
                  "&.Mui-selected": {
                    color: "#667eea",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "25%",
                      width: "50%",
                      height: "3px",
                      backgroundColor: "#667eea",
                      borderRadius: 2,
                    },
                  },
                },
              }}
            >
              <Tab label="Categories" disableRipple />
              <Tab label="Sub Categories" disableRipple />
              <Tab label="Expense Type" disableRipple />
              <Tab label="Vendors" disableRipple />
            </Tabs>
          </Box>
        </Paper>

        <TabPanel index={0} value={tab}>
          <Box hidden={tab !== 0}>
            <Box display="flex" flexDirection="column" gap={5}>
              {categories.map((item) => (
                <Box key={item._id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      borderRadius: 2,
                      bgcolor: "white",
                      boxShadow: 2,
                      border: "none",
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Button
                          sx={{
                            bgcolor: "#667eea",
                            width: 45,
                            height: 45,
                            borderRadius: "30%",
                            color: "#ffffff",
                            minWidth: 0,
                            p: 0,
                          }}
                        >
                          <CategoryIcon fontSize="medium" sx={{ color: "white" }} />
                        </Button>
                        <Box>
                          <Typography fontWeight={600} fontSize="18px" sx={{ color: "#262E3D" }}>
                            {item.name}
                          </Typography>
                          <Typography fontWeight={400} fontSize="14px" sx={{ color: "#667085" }}>
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Switch
                        checked={!!activeSwitches[item._id]}
                        onChange={() => handleToggle(item._id)}
                        sx={{
                          transform: "scale(1.3)",
                          "& .MuiSwitch-thumb": { backgroundColor: "#fff" },
                          "& .Mui-checked + .MuiSwitch-track": { backgroundColor: "primary" },
                        }}
                      />
                    </Box>
                    {activeSwitches[item._id] && renderConfigPanel(item.logicConfig)}
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        </TabPanel>

        <TabPanel index={1} value={tab}>
          <Box display="flex" flexDirection="column" gap={2}>
            {subCategories.map((item) => (
              <Paper
                key={item._id}
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  bgcolor: "white",
                  "&:hover": {
                    boxShadow: 1,
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    sx={{
                      bgcolor: "#667eea",
                      width: 45,
                      height: 45,
                      borderRadius: "30%",
                      color: "#ffffff",
                      minWidth: 0,
                      p: 0,
                    }}
                  >
                    <CategoryIcon fontSize="medium" />
                  </Button>
                  <Box>
                    <Typography fontWeight={600} fontSize="18px" sx={{ color: "#262E3D" }}>
                      {item.name} - <span style={{ color: "#667085",fontSize: "14px" }}>{item.systemCategoryId?.name || "No category"}</span>
                    </Typography>
                    <Typography fontWeight={400} fontSize="14px" sx={{ color: "#667085" }}>
                      {item.description || "No description"}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1}>
                  <IconButton
                    onClick={() => {
                      handleEditClick(item)
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handleDeleteSubCategory(item.subcategoryId)
                    }}
                  >
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </TabPanel>

        <TabPanel index={2} value={tab}>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <DataGrid
              rows={allExpense}
              columns={columns}
              checkboxSelection
              autoHeight
              rowHeight={60}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#667eea",
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
        </TabPanel>

        <TabPanel index={3} value={tab}>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Vendor vendors={vendors} onEdit={handleOpenVendor} onDelete={handleDeleteVendor} />
          </Box>
        </TabPanel>
      </Box>

      {/* Keep only Sub Category Dialog */}
      <Dialog open={openSub} onClose={handleCloseSub} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Sub Category
          <IconButton onClick={handleCloseSub} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {!subCategoryForm._id && (
              <Grid item xs={12} sm={6}>
                <Typography fontWeight={600} color="#262E3D" mb={2}>
                  Select System Category
                </Typography>
                <Select
                  fullWidth
                  value={subCategoryForm.systemCategoryId}
                  onChange={(e) => handleFormChange("systemCategoryId", e.target.value)}
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
            )}
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} color="#262E3D" mb={2}>
                Sub Category Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Sub Category Name"
                value={subCategoryForm.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={600} color="#262E3D" mt={4} mb={2}>
                Description
              </Typography>
              <TextField
                fullWidth
                placeholder="Write Description"
                multiline
                rows={2}
                value={subCategoryForm.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
              />
            </Grid>
            {!subCategoryForm._id && (
              <Grid item xs={12} sm={6}>
                <Typography fontWeight={600} color="#262E3D" mt={4} mb={2}>
                  Select Icon (Emoji)
                </Typography>
                <Select
                  fullWidth
                  value={subCategoryForm.icon}
                  onChange={(e) => handleFormChange("icon", e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Icon
                  </MenuItem>
                  <MenuItem value="🎨">🎨 Art</MenuItem>
                  <MenuItem value="📦">📦 Package</MenuItem>
                  <MenuItem value="🧾">🧾 Invoice</MenuItem>
                  <MenuItem value="💼">💼 Business</MenuItem>
                  <MenuItem value="💡">💡 Idea</MenuItem>
                </Select>
              </Grid>
            )}
            {!subCategoryForm._id && (
              <Grid item xs={12} sm={6}>
                <Typography fontWeight={600} color="#262E3D" mt={4} mb={2}>
                  Color
                </Typography>
                <input
                  type="color"
                  value={subCategoryForm.color}
                  onChange={(e) => handleFormChange("color", e.target.value)}
                  style={{
                    width: "100%",
                    height: "56px",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    padding: 0,
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseSub} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            {subCategoryForm._id ? "Update Sub Category" : "Add Sub Category"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Vendor Dialog with Validations */}
      <Dialog open={openVendor} onClose={handleCloseVendor} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {editingVendor ? "Update Vendor" : "Add Vendor"}
          <IconButton onClick={handleCloseVendor} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {editingVendor ? "Update vendor information" : "Add a new vendor for expense payments"}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} mb={1}>
                Vendor Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Vendor name"
                value={vendorForm.vendorName}
                onChange={(e) => handleVendorFormChange("vendorName", e.target.value)}
                error={!!vendorErrors.vendorName}
                helperText={vendorErrors.vendorName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} mb={1}>
                Email *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Email"
                type="email"
                value={vendorForm.email}
                onChange={(e) => handleVendorFormChange("email", e.target.value)}
                error={!!vendorErrors.email}
                helperText={vendorErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} mb={1}>
                Phone *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter 10-digit phone number"
                value={vendorForm.phone}
                onChange={(e) => handleVendorFormChange("phone", e.target.value)}
                error={!!vendorErrors.phone}
                helperText={vendorErrors.phone}
                required
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} mb={1}>
                Category *
              </Typography>
              <FormControl fullWidth error={!!vendorErrors.category}>
                <Select
                  value={vendorForm.category}
                  onChange={(e) => handleVendorFormChange("category", e.target.value)}
                  displayEmpty
                  required
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {vendorErrors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {vendorErrors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={600} mb={1}>
                Address *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter complete address"
                multiline
                rows={2}
                value={vendorForm.address}
                onChange={(e) => handleVendorFormChange("address", e.target.value)}
                error={!!vendorErrors.address}
                helperText={vendorErrors.address}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={600} mt={2} mb={2} sx={{ color: "#1976d2" }}>
                Bank Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} mb={1}>
                Account Holder Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Account Holder Name"
                value={vendorForm.bankDetails.accountHolderName}
                onChange={(e) => handleVendorFormChange("bankDetails.accountHolderName", e.target.value)}
                error={!!vendorErrors.accountHolderName}
                helperText={vendorErrors.accountHolderName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} mb={1}>
                Bank Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Bank Name"
                value={vendorForm.bankDetails.bankName}
                onChange={(e) => handleVendorFormChange("bankDetails.bankName", e.target.value)}
                error={!!vendorErrors.bankName}
                helperText={vendorErrors.bankName}
                required
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} mb={1}>
                Branch Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Branch Name"
                value={vendorForm.bankDetails.branchName}
                onChange={(e) => handleVendorFormChange("bankDetails.branchName", e.target.value)}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} mb={1}>
                Account Number *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Account Number (9-18 digits)"
                value={vendorForm.bankDetails.accountNumber}
                onChange={(e) => handleVendorFormChange("bankDetails.accountNumber", e.target.value)}
                error={!!vendorErrors.accountNumber}
                helperText={vendorErrors.accountNumber}
                required
                inputProps={{ maxLength: 18 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} mb={1}>
                IFSC Code *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter IFSC Code (e.g., HDFC0001234)"
                value={vendorForm.bankDetails.ifscCode}
                onChange={(e) => handleVendorFormChange("bankDetails.ifscCode", e.target.value.toUpperCase())}
                error={!!vendorErrors.ifscCode}
                helperText={vendorErrors.ifscCode}
                required
                inputProps={{ maxLength: 11 }}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} mb={1}>
                Account Type *
              </Typography>
              <FormControl fullWidth error={!!vendorErrors.accountType}>
                <Select
                  value={vendorForm.bankDetails.accountType}
                  onChange={(e) => handleVendorFormChange("bankDetails.accountType", e.target.value)}
                  displayEmpty
                  required
                >
                  <MenuItem value="" disabled>
                    Select Account Type
                  </MenuItem>
                  <MenuItem value="savings">Savings</MenuItem>
                  <MenuItem value="current">Current</MenuItem>
                </Select>
                {vendorErrors.accountType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {vendorErrors.accountType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={600} mb={1}>
                Bank Address
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Bank Address"
                multiline
                rows={2}
                value={vendorForm.bankDetails.bankAddress}
                onChange={(e) => handleVendorFormChange("bankDetails.bankAddress", e.target.value)}
              />
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseVendor} variant="outlined" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="contained" sx={{ bgcolor: "#1976d2" }} onClick={handleVendorSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : editingVendor ? "Update Vendor" : "Add Vendor"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Form Dialog */}
      <ViewFormDialog
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false)
          setSelectedFormId(null)
        }}
        formId={selectedFormId}
        baseUrl={baseUrl}
        token={token}
      />

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
