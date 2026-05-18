// 'use client'
// import React, { useState } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Grid,
//   Typography,
//   IconButton,
//   Select,
//   MenuItem,
//   Box,
//   Paper,
//   FormControl,
//   FormControlLabel
// } from '@mui/material'
// import AddIcon from '@mui/icons-material/Add'
// import CloseIcon from '@mui/icons-material/Close'
// import DeleteIcon from '@mui/icons-material/Delete'

// const WorkflowModal = () => {
//   const [open, setOpen] = useState(false)

//   const employees = ['Team Leader', 'Manager', 'Admin', 'HR', 'Finance']

//   const [flowSteps, setFlowSteps] = useState([''])

//   const [showCondition, setShowCondition] = useState(false)
//   const [conditions, setConditions] = useState([{ id: 1, logic: 'When', min: '', operator: '<', max: '', role: '' }])

//   const handleStepChange = (index, value) => {
//     const updated = [...flowSteps]
//     updated[index] = value
//     // Only add a new step if current is last and not empty
//     if (index === flowSteps.length - 1 && value !== '') {
//       updated.push('')
//     }
//     setFlowSteps(updated)
//   }

//   const handleConditionChange = (id, field, value) => {
//     const updated = conditions.map(c => (c.id === id ? { ...c, [field]: value } : c))
//     setConditions(updated)
//   }

//   const addCondition = () => {
//     setConditions(prev => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         logic: 'OR',
//         min: '',
//         operator: '<',
//         max: '',
//         role: ''
//       }
//     ])
//   }

//   const removeCondition = id => {
//     setConditions(prev => prev.filter(c => c.id !== id))
//   }
//   const handleOpen = () => setOpen(true)
//   const handleClose = () => setOpen(false)

//   return (
//     <>
//       {/* Add Workflow Button */}
//       <Button
//         variant='contained'
//         startIcon={<AddIcon />}
//         onClick={handleOpen}
//         sx={{
//           textTransform: 'none',
//           borderRadius: 2,
//           bgcolor: '#4E36FF',
//           '&:hover': {
//             bgcolor: '#3f2ccf'
//           }
//         }}
//       >
//         Add Workflow
//       </Button>

//       {/* Modal */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
//         <DialogTitle
//           sx={{
//             bgcolor: '#1976d2',
//             color: 'white',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}
//         >
//           Work Flow Creation
//           <IconButton onClick={handleClose} sx={{ color: 'white' }}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers>
//           <Typography variant='body2' color='text.secondary' mb={3}>
//             Set up a new approval workflow
//           </Typography>

//           <Grid container spacing={2}>
//             {/* Workflow Name & Category */}
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600} color={'#262E3D'} mb={1}>
//                 Work Flow Name
//               </Typography>
//               <TextField fullWidth placeholder='Enter Expense Type' />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600} color={'#262E3D'} mb={1}>
//                 System Category
//               </Typography>
//               <Select fullWidth defaultValue=''>
//                 <MenuItem value='' disabled>
//                   Select System Category
//                 </MenuItem>
//                 <MenuItem value='finance'>Finance</MenuItem>
//                 <MenuItem value='ops'>Operations</MenuItem>
//               </Select>
//             </Grid>

//             {/* Description */}
//             <Grid item xs={12}>
//               <Typography fontWeight={600} color={'#262E3D'} mb={1}>
//                 Description
//               </Typography>
//               <TextField fullWidth multiline rows={2} placeholder='Enter Description' />
//             </Grid>

//             {/* Min & Max Amount */}
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600} color={'#262E3D'} mb={1}>
//                 Minimum Amount
//               </Typography>
//               <TextField fullWidth placeholder='Enter Minimum Amount' />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography fontWeight={600} color={'#262E3D'} mb={1}>
//                 Maximum Amount
//               </Typography>
//               <TextField fullWidth placeholder='Enter Maximum Amount' />
//             </Grid>

//             {/* Flow Map */}

//             <Grid item xs={12}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   bgcolor: '#F9FAFB', // light grey
//                   p: 3,
//                   borderRadius: 2,
//                   border: '1px solid #E0E0E0'
//                 }}
//               >
//                 <Box display='flex' justifyContent='space-between' alignItems='center'>
//                   <Typography fontWeight={600} color={'#262E3D'}>
//                     Create Flow Map
//                   </Typography>
//                   <Typography
//                     color='#4E36FF'
//                     sx={{ cursor: 'pointer', fontWeight: 500 }}
//                     onClick={() => setShowCondition(prev => !prev)}
//                   >
//                     Condition +
//                   </Typography>
//                 </Box>

//                 {showCondition && (
//                   <Box mt={3}>
//                     <Typography fontWeight={600} color={'#262E3D'} mt={2} mb={1}>
//                       Define the criteria (if any)
//                     </Typography>
//                     <Typography variant='body2' color='text.secondary' mb={2}>
//                       Trigger the Approval flow when the following conditions are satisfied.
//                     </Typography>

//                     {conditions.map((c, i) => (
//                       <Grid container spacing={2} alignItems='center' key={c.id} mb={2}>
//                         <Grid item xs={1}>
//                           <Typography>{c.logic}</Typography>
//                         </Grid>
//                         <Grid item xs={2}>
//                           <TextField
//                             fullWidth
//                             value={c.min}
//                             placeholder='Enter Amount'
//                             onChange={e => handleConditionChange(c.id, 'min', e.target.value)}
//                           />
//                         </Grid>
//                         <Grid item xs={1}>
//                           <Select
//                             fullWidth
//                             value={c.operator}
//                             onChange={e => handleConditionChange(c.id, 'operator', e.target.value)}
//                           >
//                             <MenuItem value='<'>{'<'}</MenuItem>
//                             <MenuItem value='>'>{'>'}</MenuItem>
//                             <MenuItem value='-'>-</MenuItem>
//                           </Select>
//                         </Grid>
//                         <Grid item xs={2}>
//                           <TextField
//                             fullWidth
//                             value={c.max}
//                             placeholder='Enter Amount'
//                             onChange={e => handleConditionChange(c.id, 'max', e.target.value)}
//                           />
//                         </Grid>
//                         <Grid item xs={3}>
//                           <Select
//                             fullWidth
//                             value={c.role}
//                             displayEmpty
//                             onChange={e => handleConditionChange(c.id, 'role', e.target.value)}
//                           >
//                             <MenuItem value='' disabled>
//                               Select Role
//                             </MenuItem>
//                             {employees.map(emp => (
//                               <MenuItem key={emp} value={emp}>
//                                 {emp}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </Grid>
//                         <Grid item>
//                           <IconButton onClick={() => removeCondition(c.id)}>
//                             <DeleteIcon />
//                           </IconButton>
//                         </Grid>
//                       </Grid>
//                     ))}

//                     <Typography color='#4E36FF' sx={{ cursor: 'pointer', fontWeight: 500 }} onClick={addCondition}>
//                       Add Criteria +
//                     </Typography>
//                   </Box>
//                 )}
//               </Paper>
//             </Grid>
//           </Grid>
//           <Box mt={4}>
//             {/* Root empty square node */}
//             <Grid container spacing={2} alignItems='center' mb={4}>
//               <Grid item>
//                 <Box
//                   sx={{
//                     width: 28,
//                     height: 28,
//                     border: '2px solid #4E36FF',
//                     borderRadius: 1
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={4}>
//                 <Paper
//                   variant='outlined'
//                   sx={{
//                     px: 2,
//                     py: 1.5,
//                     borderRadius: 3,
//                     fontWeight: 600,
//                     bgcolor: '#F7F8FA',
//                     boxShadow: 'none'
//                   }}
//                 >
//                   {flowSteps[0] ? flowSteps[0] : 'Select Employee'}
//                 </Paper>
//               </Grid>
//             </Grid>

//             {flowSteps.map((role, index) => {
//               if (index === 0) return null // skip root step already handled
//               if (!flowSteps[index - 1]) return null // only show if previous is filled

//               return (
//                 <Grid container spacing={2} alignItems='flex-start' mb={4} key={index}>
//                   <Grid item>
//                     <Box
//                       sx={{
//                         width: 28,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center'
//                       }}
//                     >
//                       <Box sx={{ width: 2, height: 12, bgcolor: '#4E36FF' }} />
//                       <Box
//                         sx={{
//                           width: 28,
//                           height: 28,
//                           borderRadius: 1,
//                           border: '2px solid #4E36FF',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           fontWeight: 600,
//                           color: '#4E36FF'
//                         }}
//                       >
//                         {index}
//                       </Box>
//                       <Box sx={{ width: 2, height: 12, bgcolor: '#4E36FF' }} />
//                     </Box>
//                   </Grid>
//                   <Grid item xs={5}>
//                     <FormControl fullWidth>
//                       <Select
//                         value={role}
//                         displayEmpty
//                         onChange={e => handleStepChange(index, e.target.value)}
//                         sx={{
//                           bgcolor: '#F7F8FA',
//                           borderRadius: 3,
//                           px: 2,
//                           py: 1.5
//                         }}
//                       >
//                         <MenuItem value='' disabled>
//                           Select Employee
//                         </MenuItem>
//                         {employees.map(emp => (
//                           <MenuItem key={emp} value={emp}>
//                             {emp}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 </Grid>
//               )
//             })}

//             {/* Next dynamic step */}
//             {flowSteps[flowSteps.length - 1] === '' && (
//               <Grid container spacing={2} alignItems='center'>
//                 <Grid item>
//                   <Box
//                     sx={{
//                       width: 28,
//                       display: 'flex',
//                       flexDirection: 'column',
//                       alignItems: 'center'
//                     }}
//                   >
//                     <Box sx={{ width: 2, height: 12, bgcolor: '#4E36FF' }} />
//                     <Box
//                       sx={{
//                         width: 28,
//                         height: 28,
//                         borderRadius: 1,
//                         border: '2px solid #4E36FF',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         fontWeight: 600,
//                         color: '#4E36FF'
//                       }}
//                     >
//                       {flowSteps.length}
//                     </Box>
//                   </Box>
//                 </Grid>
//                 <Grid item xs={5}>
//                   <FormControl fullWidth>
//                     <Select
//                       value=''
//                       displayEmpty
//                       onChange={e => handleStepChange(flowSteps.length - 1, e.target.value)}
//                       sx={{
//                         bgcolor: '#F7F8FA',
//                         borderRadius: 3,
//                         px: 2,
//                         py: 1.5
//                       }}
//                     >
//                       <MenuItem value='' disabled>
//                         Select Employee
//                       </MenuItem>
//                       {employees.map(emp => (
//                         <MenuItem key={emp} value={emp}>
//                           {emp}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </Grid>
//             )}
//           </Box>
//         </DialogContent>

//         {/* Footer Buttons */}
//         <DialogActions sx={{ px: 3, pb: 2 }}>
//           <Button onClick={handleClose} variant='outlined'>
//             Cancel
//           </Button>
//           <Button variant='contained' sx={{ bgcolor: '#1976d2' }}>
//             Create Flow
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   )
// }

// export default WorkflowModal
