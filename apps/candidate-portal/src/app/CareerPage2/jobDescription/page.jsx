// "use client"

// import { useEffect, useState } from "react"
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   Chip,
//   IconButton,
//   Paper,
//   Stack,
//   Avatar,
//   Container,
//   Breadcrumbs,
//   Link,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   FormControlLabel,
//   Checkbox
// } from "@mui/material"
// import { useRouter } from "next/navigation"
// import { formatDistanceToNow } from 'date-fns'
// import {
//   ArrowBack,
//   LocationOn,
//   Work,
//   Business,
//   School,
//   AttachMoney,
//   Group,
//   Schedule,
//   CheckCircle,
//   Star,
//   Share,
//   Bookmark,
//   AccessTime,
//   Person,
// } from "@mui/icons-material"
// import { styled } from "@mui/material/styles"
// import { Close, Upload } from "@mui/icons-material"

// // Styled Components with refined typography
// const StyledContainer = styled(Container)(({ theme }) => ({
//   backgroundColor: "#fafbfc",
//   minHeight: "100vh",
//   paddingTop: theme.spacing(2),
//   paddingBottom: theme.spacing(4),
//   fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
// }))

// const HeaderCard = styled(Card)(({ theme }) => ({
//   background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
//   color: "white",
//   borderRadius: "8px",
//   marginBottom: theme.spacing(3),
//   boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
//   border: "1px solid #e5e7eb",
// }))

// const InfoCard = styled(Card)(({ theme }) => ({
//   borderRadius: "8px",
//   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//   border: "1px solid #e5e7eb",
//   backgroundColor: "#ffffff",
//   transition: "box-shadow 0.2s ease",
//   "&:hover": {
//     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//   },
// }))

// const DetailItem = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   borderRadius: "6px",
//   backgroundColor: "#f9fafb",
//   border: "1px solid #f3f4f6",
//   transition: "all 0.2s ease",
//   "&:hover": {
//     backgroundColor: "#f3f4f6",
//     borderColor: "#e5e7eb",
//   },
// }))

// const ApplyButton = styled(Button)(({ theme }) => ({
//   backgroundColor: "#2563eb",
//   borderRadius: "6px",
//   padding: theme.spacing(1, 3),
//   fontSize: "14px",
//   fontWeight: 600,
//   textTransform: "none",
//   boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
//   "&:hover": {
//     backgroundColor: "#1d4ed8",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
//   },
// }))

// const BackButton = styled(IconButton)(({ theme }) => ({
//   backgroundColor: "white",
//   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//   marginBottom: theme.spacing(2),
//   width: 36,
//   height: 36,
//   "&:hover": {
//     backgroundColor: "#f9fafb",
//   },
// }))

// const SectionTitle = styled(Typography)(({ theme }) => ({
//   fontWeight: 600,
//   color: "#111827",
//   marginBottom: theme.spacing(2),
//   fontSize: "18px",
//   fontFamily: '"Inter", sans-serif',
// }))

// const SkillChip = styled(Chip)(({ theme }) => ({
//   backgroundColor: "#eff6ff",
//   color: "#1e40af",
//   fontWeight: 500,
//   fontSize: "12px",
//   height: "28px",
//   borderRadius: "6px",
//   "&:hover": {
//     backgroundColor: "#dbeafe",
//   },
// }))

// export default function JobDescription({ row, setJd }) {
//   const [jobDesc, setJobDesc] = useState({})
//   const token = window.localStorage.getItem("authToken")
//   const router = useRouter()
//   const [openApply, setOpenApply] = useState(false)

//   useEffect(() => {
//     setJobDesc(row)
//   }, [row])

//   const jobDetails = [
//     {
//       label: "Job Type",
//       value: jobDesc?.employeeType?.title || jobDesc?.employeeTypeId?.title || "-",
//       icon: <Work fontSize="small" />,
//     },
//     {
//       label: "Department",
//       value: jobDesc?.department?.name || jobDesc?.departmentId?.name || "-",
//       icon: <Business fontSize="small" />,
//     },
//     {
//       label: "Experience",
//       value: jobDesc?.experience || "-",
//       icon: <Schedule fontSize="small" />,
//     },
//     {
//       label: "Qualification",
//       value: jobDesc?.qualification?.map((i) => i.name).join(", ") || "-",
//       icon: <School fontSize="small" />,
//     },
//     {
//       label: "Package",
//       value: jobDesc?.package && jobDesc?.package !== "0" ? `${jobDesc?.package} LPA` : "-",
//       icon: <AttachMoney fontSize="small" />,
//     },
//     {
//       label: "Employment Type",
//       value: jobDesc?.employmentType?.title?.toUpperCase() || jobDesc?.employmentTypeId?.title?.toUpperCase() || "-",
//       icon: <Work fontSize="small" />,
//     },
//     {
//       label: "No. of Positions",
//       value: jobDesc?.noOfPosition || "-",
//       icon: <Group fontSize="small" />,
//     },
//   ]

//   return (
//     <StyledContainer maxWidth="lg">
//       <BackButton onClick={() => setJd(false)}>
//         <ArrowBack sx={{ color: "#6b7280", fontSize: 20 }} />
//       </BackButton>

//       {/* Breadcrumbs */}
//       <Breadcrumbs sx={{ mb: 2, fontSize: "14px" }}>
//         <Link
//           underline="hover"
//           color="#6b7280"
//           sx={{ cursor: "pointer", fontSize: "14px" }}
//           onClick={() => setJd(false)}
//         >
//           Careers
//         </Link>
//         <Typography color="#111827" fontWeight={500} fontSize="14px">
//           Job Details
//         </Typography>
//       </Breadcrumbs>

//       {/* Header Section */}
//       <HeaderCard>
//         <CardContent sx={{ p: 3 }}>
//           <Grid container spacing={3} alignItems="center">
//             <Grid item xs={12} md={8}>
//               <Typography variant="h5" fontWeight="600" sx={{ mb: 1, fontSize: "24px" }}>
//                 {jobDesc?.position || "Position Title"}
//               </Typography>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
//                 <LocationOn sx={{ fontSize: 16 }} />
//                 <Typography variant="body1" sx={{ opacity: 0.9, fontSize: "14px" }}>
//                   {jobDesc?.branch
//                     ? jobDesc?.branch?.map((b) => b.name).join(", ")
//                     : jobDesc?.branchId
//                       ? jobDesc?.branchId?.map((b) => b.name).join(", ")
//                       : "Location"}
//                 </Typography>
//               </Box>
//               <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//                 <Chip
//                   label="Full Time"
//                   size="small"
//                   sx={{
//                     bgcolor: "rgba(255,255,255,0.2)",
//                     color: "white",
//                     fontSize: "12px",
//                     height: "24px",
//                   }}
//                 />
//                 <Chip
//                   label="Remote Friendly"
//                   size="small"
//                   sx={{
//                     bgcolor: "rgba(255,255,255,0.2)",
//                     color: "white",
//                     fontSize: "12px",
//                     height: "24px",
//                   }}
//                 />
//                 <Chip
//                   label="Benefits Included"
//                   size="small"
//                   sx={{
//                     bgcolor: "rgba(255,255,255,0.2)",
//                     color: "white",
//                     fontSize: "12px",
//                     height: "24px",
//                   }}
//                 />
//               </Stack>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 2,
//                   alignItems: { xs: "flex-start", md: "flex-end" },
//                 }}
//               >
//                 <Stack direction="row" spacing={1}>
//                   <IconButton
//                     size="small"
//                     sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}
//                   >
//                     <Share fontSize="small" />
//                   </IconButton>
//                   <IconButton
//                     size="small"
//                     sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}
//                   >
//                     <Bookmark fontSize="small" />
//                   </IconButton>
//                 </Stack>
//                 <ApplyButton
//                   variant="contained"
//                   startIcon={<CheckCircle fontSize="small" />}
//                   onClick={() => {
//                     // const selectionData = {
//                     //   jobPostId: jobDesc?._id,
//                     //   branchId: jobDesc.branch?.[0]?._id,
//                     //   departmentId: jobDesc.department?._id,
//                     // }
//                     // localStorage.setItem("selectedJobData", JSON.stringify(selectionData))
//                     // router.push("/login")
//                     setOpenApply(true)
//                   }}
//                   sx={{
//                     bgcolor: "white",
//                     color: "#2563eb",
//                     "&:hover": {
//                       bgcolor: "#f9fafb",
//                     },
//                   }}
//                 >
//                   Apply Now
//                 </ApplyButton>
//               </Box>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </HeaderCard>

//       <Grid container spacing={3}>
//         {/* Job Details Section */}
//         <Grid item xs={12} md={8}>
//           <InfoCard>
//             <CardContent sx={{ p: 3 }}>
//               <SectionTitle>Job Details</SectionTitle>
//               <Grid container spacing={2}>
//                 {jobDetails.map((detail, index) => (
//                   <Grid item xs={12} sm={6} key={index}>
//                     <DetailItem>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                         <Avatar sx={{ bgcolor: "#eff6ff", color: "#1e40af", width: 32, height: 32 }}>
//                           {detail.icon}
//                         </Avatar>
//                         <Box>
//                           <Typography variant="caption" color="#6b7280" fontWeight={500} sx={{ fontSize: "12px" }}>
//                             {detail.label}
//                           </Typography>
//                           <Typography variant="body2" fontWeight={600} color="#111827" sx={{ fontSize: "14px" }}>
//                             {detail.value}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </DetailItem>
//                   </Grid>
//                 ))}
//                 <Grid item xs={12}>
//                   <DetailItem>
//                     <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
//                       <Avatar sx={{ bgcolor: "#eff6ff", color: "#1e40af", width: 32, height: 32 }}>
//                         <LocationOn fontSize="small" />
//                       </Avatar>
//                       <Box>
//                         <Typography variant="caption" color="#6b7280" fontWeight={500} sx={{ fontSize: "12px" }}>
//                           Address
//                         </Typography>
//                         <Typography variant="body2" fontWeight={600} color="#111827" sx={{ fontSize: "14px" }}>
//                           {jobDesc?.branch
//                             ? jobDesc?.branch?.map((b) => b.address).join(", ")
//                             : jobDesc?.branchId
//                               ? jobDesc?.branchId?.map((b) => b.address).join(", ")
//                               : "Address not specified"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </DetailItem>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </InfoCard>

//           {/* Job Description Section */}
//           <InfoCard sx={{ mt: 3 }}>
//             <CardContent sx={{ p: 3 }}>
//               <SectionTitle>Job Description</SectionTitle>

//               {/* Job Summary */}
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: "#374151", fontSize: "16px" }}>
//                   Job Summary
//                 </Typography>
//                 <Paper sx={{ p: 2.5, bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
//                   <Typography variant="body2" sx={{ lineHeight: 1.6, color: "#4b5563", fontSize: "14px" }}>
//                     {jobDesc?.jobDescription?.jobDescription?.JobSummary || "Job summary not available"}
//                   </Typography>
//                 </Paper>
//               </Box>

//               {/* Roles and Responsibilities */}
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: "#374151", fontSize: "16px" }}>
//                   Roles and Responsibilities
//                 </Typography>
//                 <Paper sx={{ p: 2.5, bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
//                   {(jobDesc?.jobDescription?.jobDescription?.RolesAndResponsibilities || []).length > 0 ? (
//                     <Stack spacing={1.5}>
//                       {jobDesc.jobDescription.jobDescription.RolesAndResponsibilities.map((role, index) => (
//                         <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
//                           <CheckCircle sx={{ color: "#10b981", fontSize: 16, mt: 0.2 }} />
//                           <Typography variant="body2" sx={{ lineHeight: 1.5, color: "#4b5563", fontSize: "14px" }}>
//                             {role}
//                           </Typography>
//                         </Box>
//                       ))}
//                     </Stack>
//                   ) : (
//                     <Typography variant="body2" color="#9ca3af" sx={{ fontSize: "14px" }}>
//                       Roles and responsibilities not specified
//                     </Typography>
//                   )}
//                 </Paper>
//               </Box>

//               {/* Key Skills */}
//               <Box>
//                 <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: "#374151", fontSize: "16px" }}>
//                   Key Skills Required
//                 </Typography>
//                 <Paper sx={{ p: 2.5, bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
//                   {(jobDesc?.jobDescription?.jobDescription?.KeySkills || []).length > 0 ? (
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                       {jobDesc.jobDescription.jobDescription.KeySkills.map((skill, index) => (
//                         <SkillChip key={index} label={skill} icon={<Star sx={{ fontSize: 14 }} />} />
//                       ))}
//                     </Box>
//                   ) : (
//                     <Typography variant="body2" color="#9ca3af" sx={{ fontSize: "14px" }}>
//                       Key skills not specified
//                     </Typography>
//                   )}
//                 </Paper>
//               </Box>
//             </CardContent>
//           </InfoCard>
//         </Grid>

//         {/* Sidebar */}
//         <Grid item xs={12} md={4}>
//           <InfoCard>
//             <CardContent sx={{ p: 3 }}>
//               <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#374151", fontSize: "16px" }}>
//                 Quick Actions
//               </Typography>
//               <Stack spacing={1.5}>
//                 <Button
//                   variant="outlined"
//                   fullWidth
//                   size="small"
//                   startIcon={<Share fontSize="small" />}
//                   sx={{
//                     borderColor: "#e5e7eb",
//                     color: "#6b7280",
//                     fontSize: "14px",
//                     textTransform: "none",
//                     "&:hover": {
//                       borderColor: "#2563eb",
//                       color: "#2563eb",
//                       bgcolor: "#f9fafb",
//                     },
//                   }}
//                 >
//                   Share Job
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   fullWidth
//                   size="small"
//                   startIcon={<Bookmark fontSize="small" />}
//                   sx={{
//                     borderColor: "#e5e7eb",
//                     color: "#6b7280",
//                     fontSize: "14px",
//                     textTransform: "none",
//                     "&:hover": {
//                       borderColor: "#2563eb",
//                       color: "#2563eb",
//                       bgcolor: "#f9fafb",
//                     },
//                   }}
//                 >
//                   Save for Later
//                 </Button>
//               </Stack>
//             </CardContent>
//           </InfoCard>

//           <InfoCard sx={{ mt: 3 }}>
//             <CardContent sx={{ p: 3 }}>
//               <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#374151", fontSize: "16px" }}>
//                 Company Benefits
//               </Typography>
//               <Stack spacing={1.5}>
//                 {[
//                   "Health Insurance",
//                   "Flexible Working Hours",
//                   "Professional Development",
//                   "Performance Bonuses",
//                   "Team Building Activities",
//                 ].map((benefit, index) => (
//                   <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                     <CheckCircle sx={{ color: "#10b981", fontSize: 16 }} />
//                     <Typography variant="body2" color="#6b7280" sx={{ fontSize: "14px" }}>
//                       {benefit}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Stack>
//             </CardContent>
//           </InfoCard>

//           {/* Job Stats */}
//           <InfoCard sx={{ mt: 3 }}>
//             <CardContent sx={{ p: 3 }}>
//               <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#374151", fontSize: "16px" }}>
//                 Job Statistics
//               </Typography>
//               <Stack spacing={2}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <AccessTime sx={{ color: "#6b7280", fontSize: 16 }} />
//                     <Typography variant="body2" color="#6b7280" sx={{ fontSize: "14px" }}>
//                       Posted
//                     </Typography>
//                   </Box>

// <Typography variant="body2" fontWeight={600} sx={{ fontSize: "14px" }}>
//   {jobDesc?.createdAt ? (
//     formatDistanceToNow(new Date(jobDesc.createdAt), { addSuffix: true })
//   ) : (
//     'Date unavailable'
//   )}
// </Typography>

//                 </Box>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <Person sx={{ color: "#6b7280", fontSize: 16 }} />
//                     <Typography variant="body2" color="#6b7280" sx={{ fontSize: "14px" }}>
//                       Applicants
//                     </Typography>
//                   </Box>
//                   <Typography variant="body2" fontWeight={600} sx={{ fontSize: "14px" }}>
//                     {jobDesc.noOfPosition}
//                   </Typography>
//                 </Box>
//               </Stack>
//             </CardContent>
//           </InfoCard>
//         </Grid>
//       </Grid>

//       {/* Bottom CTA */}
//       <Box sx={{ mt: 4 }}>
//         <Paper sx={{ p: 3, bgcolor: "#f9fafb", border: "1px solid #f3f4f6", textAlign: "center" }}>
//           <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: "#374151", fontSize: "18px" }}>
//             Ready to Join Our Team?
//           </Typography>
//           <Typography variant="body2" color="#6b7280" sx={{ mb: 2, fontSize: "14px" }}>
//             Take the next step in your career and apply for this exciting opportunity.
//           </Typography>
//           <ApplyButton
//             variant="contained"
//             startIcon={<CheckCircle fontSize="small" />}
//             onClick={() => {
//               const selectionData = {
//                 jobPostId: jobDesc?._id,
//                 branchId: jobDesc.branch?.[0]?._id,
//                 departmentId: jobDesc.department?._id,
//               }
//               localStorage.setItem("selectedJobData", JSON.stringify(selectionData))
//               router.push("/login")
//             }}
//           >
//             Apply for This Position
//           </ApplyButton>
//         </Paper>
//       </Box>
//       <Dialog
//         open={openApply}
//         onClose={()=>setOpenApply(false)}
//         maxWidth="sm"
//         fullWidth
//         sx={{
//           '& .MuiDialog-paper': {
//             borderRadius: '16px',
//             boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
//             overflow: 'hidden',
//             animation: 'slideIn 0.3s ease-out',
//           },
//         }}
//       >
//         {/* Modal Header */}
//         <DialogTitle
//           sx={{
//             bgcolor: 'linear-gradient(45deg, #2563eb, #7c3aed)',
//             color: 'white',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             py: 2,
//             px: 3,
//           }}
//         >
//           <Typography variant="h6" fontWeight="bold">
//             Apply for {jobDesc?.position}
//           </Typography>
//           <IconButton onClick={()=>setOpenApply(false)} sx={{ color: 'white' }}>
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         {/* Modal Content */}
//         <DialogContent
//           sx={{
//             bgcolor: 'rgba(255,255,255,0.95)',
//             p: 4,
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 3,
//           }}
//         >
//           <TextField
//             label="Full Name"
//             name="fullName"
//             // value={formData.fullName}
//             // onChange={handleInputChange}
//             fullWidth
//             required
//             sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
//           />
//           <TextField
//             label="Email Address"
//             name="email"
//             type="email"
//             // value={formData.email}
//             // onChange={handleInputChange}
//             fullWidth
//             required
//             sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
//           />
//           <TextField
//             label="Phone Number"
//             name="phone"
//             type="number"
//             // value={formData.phone}
//             // onChange={handleInputChange}
//             fullWidth
//             required
//             sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
//           />

//        <TextField
//             label="Pin Code Of Current Address"
//             name="Pin Code"
//             type="number"
//             // value={formData.phone}
//             // onChange={handleInputChange}
//             fullWidth
//             required
//             sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
//           />


//         <TextField
//             label="Name of Employee Who Referred You"
//             name="Internal Refrence(Optional)"
//             type="text"
//             // value={formData.phone}
//             // onChange={handleInputChange}
//             fullWidth
//             required
//             sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
//           />
//           <Box>
//             <Typography sx={{ fontSize: '0.875rem', color: '#374151', mb: 1 }}>
//               Upload Resume *
//             </Typography>
//             <Box
//               sx={{
//                 border: '2px dashed #d1d5db',
//                 borderRadius: '8px',
//                 p: 4,
//                 textAlign: 'center',
//                 '&:hover': { borderColor: '#2563eb', bgcolor: '#eff6ff' },
//                 transition: 'all 0.2s ease',
//                 position: 'relative',
//               }}
//             >
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 // onChange={handleFileChange}
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: '100%',
//                   height: '100%',
//                   opacity: 0,
//                   cursor: 'pointer',
//                 }}
//               />
//               <Upload size={32} color="#9ca3af" style={{ margin: '0 auto 8px' }} />
//               <Typography sx={{ fontSize: '0.875rem', color: '#4b5563' }}>
//                 {/* {fileName || ( */}
//                   <>
//                     <Box component="span" sx={{ color: '#2563eb', fontWeight: 'medium' }}>
//                       Click to upload
//                     </Box>{' '}
//                     or drag and drop
//                   </>
//                 {/* )} */}
//               </Typography>
//               {/* {!fileName && ( */}
//                 <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mt: 1 }}>
//                   PDF, DOC, DOCX files only
//                 </Typography>
//               {/* )} */}
//             </Box>
//           </Box>
         
//           <FormControlLabel
//             control={
//               <Checkbox
//                 // checked={agreedToTerms}
//                 // onChange={(e) => setAgreedToTerms(e.target.checked)}
//                 sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }}
//               />
//             }
//             label={
//               <Typography sx={{ fontSize: '0.875rem', color: '#4b5563' }}>
//                 I agree to the terms and conditions
//               </Typography>
//             }
//           />
//         </DialogContent>

//         {/* Modal Actions */}
//         <DialogActions sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.95)', gap: 2 }}>
//           <Button
//             onClick={()=>setOpenApply(false)}
//             variant="outlined"
//             sx={{
//               borderColor: '#2563eb',
//               color: '#2563eb',
//               borderRadius: '8px',
//               px: 4,
//               py: 1,
//               textTransform: 'none',
//               '&:hover': {
//                 bgcolor: '#eff6ff',
//                 borderColor: '#1d4ed8',
//               },
//               transition: 'all 0.2s ease',
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             // onClick={handleSubmit}
//             variant="contained"
//             // disabled={!isFormValid}
//             sx={{
//               bgcolor: 'linear-gradient(45deg, #2563eb, #7c3aed)',
//               color: 'white',
//               borderRadius: '8px',
//               px: 4,
//               py: 1,
//               textTransform: 'none',
//               boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
//               '&:hover': {
//                 bgcolor: 'linear-gradient(45deg, #1d4ed8, #6d28d9)',
//                 boxShadow: '0 6px 16px rgba(37, 99, 235, 0.5)',
//                 transform: 'scale(1.05)',
//               },
//               '&.Mui-disabled': {
//                 bgcolor: '#bdbdbd',
//                 color: '#fff',
//               },
//               transition: 'all 0.3s ease',
//             }}
//           >
//             Submit Application
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </StyledContainer>
//   )
// }