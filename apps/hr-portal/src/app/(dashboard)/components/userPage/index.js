"use client"

import { useState } from "react"
import { Box, Typography, Paper, Button, IconButton, Tooltip, Chip } from "@mui/material"
import { Add, Edit, Delete, Visibility, Person } from "@mui/icons-material"
import { DataGrid } from "@mui/x-data-grid"
import UserForm from "../userPage/userForm"

// Sample user data
const sampleUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "Submitter",
    department: "engineering",
    employeeId: "EMP001",
    mobile: "+1 (555) 123-4567",
    status: "active",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: "Approver",
    department: "finance",
    employeeId: "EMP002",
    mobile: "+1 (555) 987-6543",
    status: "active",
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    role: "Admin",
    department: "hr",
    employeeId: "EMP003",
    mobile: "+1 (555) 456-7890",
    status: "inactive",
  },
  {
    id: 4,
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.williams@example.com",
    role: "Submitter",
    department: "marketing",
    employeeId: "EMP004",
    mobile: "+1 (555) 234-5678",
    status: "active",
  },
  {
    id: 5,
    firstName: "Robert",
    lastName: "Brown",
    email: "robert.brown@example.com",
    role: "Submitter",
    department: "engineering",
    employeeId: "EMP005",
    mobile: "+1 (555) 876-5432",
    status: "pending",
  },
]

const UserPage = () => {
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [users] = useState(sampleUsers)

  const handleAddNew = () => {
    setSelectedUser(null)
    setShowForm(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleBackToList = () => {
    setShowForm(false)
    setSelectedUser(null)
  }

  // Define columns for the data grid
  const columns = [
    { field: "employeeId", headerName: "Employee ID", width: 130 },
    { field: "firstName", headerName: "First Name", width: 130 },
    { field: "lastName", headerName: "Last Name", width: 130 },
    { field: "email", headerName: "Email", width: 220 },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Admin" ? "primary" : params.value === "Approver" ? "secondary" : "default"}
          size="small"
        />
      ),
    },
    { field: "department", headerName: "Department", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "active" ? "success" : params.value === "inactive" ? "error" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small" color="primary">
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  if (showForm) {
    return <UserForm onCancel={handleBackToList} userData={selectedUser || {}} />
  }

  return (
    <Paper elevation={0} sx={{ p: 3, backgroundColor: "#ffffff", borderRadius: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Person sx={{ mr: 1, color: "#3f51b5" }} />
          <Typography variant="h5" component="h2" sx={{ color: "#3f51b5", fontWeight: 500 }}>
            User Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddNew}
          sx={{
            backgroundColor: "#3f51b5",
            "&:hover": { backgroundColor: "#303f9f" },
          }}
        >
          Add New
        </Button>
      </Box>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection
          disableSelectionOnClick
          sx={{
            border: "1px solid #e0e0e0",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
            },
          }}
        />
      </Box>
    </Paper>
  )
}

export default UserPage
