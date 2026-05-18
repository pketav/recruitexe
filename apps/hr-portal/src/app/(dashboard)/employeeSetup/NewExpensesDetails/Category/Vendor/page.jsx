// 'use client'
// import { Box, IconButton } from '@mui/material'
// import EditIcon from '@mui/icons-material/Edit'
// import DeleteIcon from '@mui/icons-material/Delete'
// import { Chip } from '@mui/material'
// import { DataGrid } from '@mui/x-data-grid'
// import React from 'react'
// import { Delete, Edit } from 'lucide-react'

// export default function Vendor() {
//   const columns = [
//     { field: 'vendor', headerName: 'Vendor', width: 200 },
//     { field: 'gst', headerName: 'GST No.', width: 180 },
//     {
//       field: 'category',
//       headerName: 'Default Category',
//       width: 220,
//       renderCell: params => (
//         <Chip
//           label={params.value}
//           variant='outlined'
//           size='small'
//           sx={{
//             borderColor: params.value === 'Accommodation' ? '#4CAF50' : '#673AB7',
//             color: params.value === 'Accommodation' ? '#2E7D32' : '#5E35B1',
//             fontWeight: 500,
//             fontSize: '0.75rem',
//             height: 35,
//             borderRadius: '20px'
//           }}
//         />
//       )
//     },
//     { field: 'email', headerName: 'Contact', width: 220 },
//     { field: 'phone', headerName: 'Contact', width: 155 },
//     {
//       field: 'status',
//       headerName: 'Status',
//       width: 150,
//       renderCell: params => (
//         <Chip
//           label={params.value}
//           size='small'
//           sx={{
//             backgroundColor: params.value === 'Active' ? '#624BFF' : '#E0E0E0',
//             color: params.value === 'Active' ? '#fff' : '#666',
//             fontWeight: 500,
//             fontSize: '0.75rem',
//             height: 35,
//             borderRadius: '20px'
//           }}
//         />
//       )
//     },
//     {
//       field: 'action',
//       headerName: 'Action',
//       width: 120,
//       sortable: false,
//       renderCell: () => (
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <IconButton color='secondary' size='small'>
//             <Edit fontSize='small' />
//           </IconButton>
//           <IconButton sx={{ color: 'red' }} size='small'>
//             <Delete fontSize='small' />
//           </IconButton>
//         </Box>
//       )
//     }
//   ]
//   const rows = [
//     {
//       id: 1,
//       vendor: 'Hotel Taj Mahal',
//       gst: 'GSTIN55600',
//       category: 'Accommodation',
//       email: 'Booking@gmail.com',
//       phone: '9768990186',
//       status: 'Active'
//     },
//     {
//       id: 2,
//       vendor: 'Food',
//       gst: 'GSTIN55600',
//       category: 'Meals and Entertainment',
//       email: 'Booking@gmail.com',
//       phone: '8898990186',
//       status: 'Inactive'
//     },
//     {
//       id: 3,
//       vendor: 'Cab Services',
//       gst: 'GSTIN88776',
//       category: 'Travel',
//       email: 'cab@gmail.com',
//       phone: '9876543210',
//       status: 'Active'
//     },
//     {
//       id: 4,
//       vendor: 'Office Supplies',
//       gst: 'GSTIN33445',
//       category: 'Stationery',
//       email: 'supply@office.com',
//       phone: '9123456789',
//       status: 'Inactive'
//     },
//     {
//       id: 5,
//       vendor: 'Flight Booking',
//       gst: 'GSTIN22334',
//       category: 'Travel',
//       email: 'flights@travel.com',
//       phone: '8881234567',
//       status: 'Active'
//     },
//     {
//       id: 6,
//       vendor: 'Catering Services',
//       gst: 'GSTIN99887',
//       category: 'Meals and Entertainment',
//       email: 'catering@events.com',
//       phone: '9090909090',
//       status: 'Inactive'
//     },
//     {
//       id: 7,
//       vendor: 'Conference Hall',
//       gst: 'GSTIN66554',
//       category: 'Accommodation',
//       email: 'hall@booking.com',
//       phone: '9988776655',
//       status: 'Active'
//     },
//     {
//       id: 8,
//       vendor: 'Team Outing',
//       gst: 'GSTIN77889',
//       category: 'Employee Engagement',
//       email: 'events@funzone.com',
//       phone: '9870001122',
//       status: 'Inactive'
//     },
//     {
//       id: 9,
//       vendor: 'Internet Services',
//       gst: 'GSTIN44112',
//       category: 'Utilities',
//       email: 'support@netpro.com',
//       phone: '9001112233',
//       status: 'Active'
//     },
//     {
//       id: 10,
//       vendor: 'Taxi For Office',
//       gst: 'GSTIN12345',
//       category: 'Travel',
//       email: 'driver@ridepro.com',
//       phone: '7776665544',
//       status: 'Active'
//     }
//   ]

//   return (
//     <Box>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         checkboxSelection
//         rowHeight={60}
//         sx={{
//           minWidth: '1000px',
//           '& .MuiDataGrid-columnHeaders': {
//             backgroundColor: '#1976d2',
//             color: '#fff',
//             fontWeight: 600
//           },
//           '& .MuiDataGrid-columnHeader': {
//             backgroundColor: '#1976d2',
//             color: '#fff'
//           },
//           '& .MuiDataGrid-columnHeaderTitle': {
//             fontWeight: 'bold',
//             color: '#fff'
//           },
//           '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
//             color: '#fff'
//           },
//           '& .MuiDataGrid-cell': {
//             borderBottom: '1px solid rgba(224, 224, 224, 1)',
//             display: 'flex',
//             alignItems: 'center'
//           },
//           '& .MuiDataGrid-row': {
//             '&:hover': {
//               backgroundColor: 'rgba(25, 118, 210, 0.04)',
//               cursor: 'pointer'
//             }
//           },
//           '& .MuiDataGrid-toolbarContainer': {
//             padding: '12px',
//             backgroundColor: '#f8f9fa',
//             borderBottom: '1px solid #e0e0e0'
//           }
//         }}
//       />
//     </Box>
//   )
// }




"use client"
import { Box, IconButton } from "@mui/material"
import { Chip } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Delete, Edit } from "lucide-react"

export default function Vendor({ vendors = [], onEdit, onDelete }) {
  const columns = [
    {
      field: "vendorName",
      headerName: "Vendor",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => <Box sx={{ fontWeight: 500 }}>{params.value || "N/A"}</Box>,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          variant="outlined"
          size="small"
          sx={{
            borderColor: params.value === "Accommodation" ? "#4CAF50" : "#673AB7",
            color: params.value === "Accommodation" ? "#2E7D32" : "#5E35B1",
            fontWeight: 500,
            fontSize: "0.75rem",
            height: 35,
            borderRadius: "20px",
          }}
        />
      ),
    },
    {
      field: "email",
      headerName: "Email",
       flex: 1,
      minWidth: 200,
      renderCell: (params) => <Box sx={{ color: "#1976d2" }}>{params.value || "N/A"}</Box>,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 155,
      renderCell: (params) => <Box sx={{ fontFamily: "monospace" }}>{params.value || "N/A"}</Box>,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          label={params.value || "Active"}
          size="small"
          sx={{
            backgroundColor: (params.value || "Active") === "Active" ? "#667eea" : "#E0E0E0",
            color: (params.value || "Active") === "Active" ? "#fff" : "#666",
            fontWeight: 500,
            fontSize: "0.75rem",
            height: 35,
            borderRadius: "20px",
          }}
        />
      ),
    },
    { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 150 },
    { field: "updatedAt", headerName: "Updated At", flex: 1, minWidth: 150 },
    {
      field: "action",
      headerName: "Action",
       flex: 1,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton color="secondary" size="small" onClick={() => onEdit && onEdit(params.row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton sx={{ color: "red" }} size="small" onClick={() => onDelete && onDelete(params.row.vendorId)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  // Format vendors data for DataGrid
  const formattedVendors = vendors.map((vendor, index) => ({
    id: vendor._id || index,
    vendorId: vendor.vendorId,
    vendorName: vendor.vendorName,
    email: vendor.email,
    phone: vendor.phone,
    category: vendor.category,
    address: vendor.address,
    bankDetails: vendor.bankDetails,
    status: "Active", // Default status since it's not in API response
    createdAt: vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    updatedAt: vendor.updatedAt ? new Date(vendor.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
  }))

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <DataGrid 
        rows={formattedVendors}
        columns={columns}
        checkboxSelection
        autoHeight
        disableRowSelectionOnClick
        rowHeight={60}
        sx={{
          minWidth: "1000px",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#667eea",
            color: "#fff",
            fontWeight: 600,
          },
          // "& .MuiDataGrid-columnHeader": {
          //   backgroundColor: "#1976d2",
          //   color: "#fff",
          // },
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
  )
}
