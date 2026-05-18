// 'use client'
// import { Box, IconButton } from '@mui/material'
// import { DataGrid } from '@mui/x-data-grid'
// import React, { useEffect, useState } from 'react'
// import { Edit } from 'lucide-react'
// import { Visibility } from '@mui/icons-material'
// import axios from 'axios'

// export default function Expense() {
//   const token = window.localStorage.getItem('authToken')
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

//   const [allExpense, setAllExpense] = useState([])

//   const formatDate = (isoString) => {
//     if (!isoString) return ''
//     return new Date(isoString).toLocaleDateString()
//   }

//   const columns = [
//     { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
//     { field: 'description', headerName: 'Description', flex: 2, minWidth: 250 },
//     { field: 'subcategoryName', headerName: 'Sub Category', flex: 1, minWidth: 150 },
//     { field: 'systemCategoryName', headerName: 'System Category', flex: 1, minWidth: 150 },
//     { field: 'createdAt', headerName: 'Created At', flex: 1, minWidth: 150 },
//     { field: 'updatedAt', headerName: 'Updated At', flex: 1, minWidth: 150 },
//     {
//       field: 'action',
//       headerName: 'Action',
//       flex: 1,
//       minWidth: 150,
//       sortable: false,
//       renderCell: () => (
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <IconButton color='secondary' size='small'>
//             <Edit size={16} />
//           </IconButton>
//           <IconButton color='primary' size='small'>
//             <Visibility fontSize='small' />
//           </IconButton>
//         </Box>
//       )
//     }
//   ]

//   const getAllExpense = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/v1/api/expenseType`, {
//         headers: {
//           'Content-Type': 'application/json',
//           authorization: token
//         }
//       })

//       const expenses = res.data?.items?.expenseTypes || []

//       const formatted = expenses.map((item, index) => ({
//         id: item._id || index,
//         name: item.name,
//         description: item.description,
//         subcategoryName: item.subcategoryId?.name || '',
//         systemCategoryName: item.systemCategoryId?.name || '',
//         createdAt: formatDate(item.createdAt),
//         updatedAt: formatDate(item.updatedAt)
//       }))
//       setAllExpense(formatted)
//     } catch (error) {
//       console.error('Error fetching expense types:', error)
//     }
//   }

//   useEffect(() => {
//     getAllExpense()
//   }, [])

//   return (
//     <Box sx={{ width: '100%', overflowX: 'auto' }}>
//       <Box sx={{ minWidth: '900px' }}>
//         <DataGrid
//           rows={allExpense}
//           columns={columns}
//           checkboxSelection
//           autoHeight
//           rowHeight={60}
//           sx={{
//             "& .MuiDataGrid-columnHeaders": {
//               backgroundColor: "#1976d2",
//               color: "#fff",
//               fontWeight: 600,
//             },
//             "& .MuiDataGrid-columnHeader": {
//               background: "#1976d2",
//               color: "#fff",
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
//     </Box>
//   )
// }
