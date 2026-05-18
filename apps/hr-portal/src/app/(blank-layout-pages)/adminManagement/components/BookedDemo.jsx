"use client"
import {
  Business,
  CalendarToday,
  Delete,
  Download,
  Email,
  Filter,
  Person,
  Phone,
  Settings,
  TimeToLeave,
  ViewColumn,
  Work,
} from "@mui/icons-material"
import { Container, Paper, Box, Typography, IconButton, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid"
import { FaIndustry } from "react-icons/fa"
import { GiGiftOfKnowledge } from "react-icons/gi"
import { useApi } from "@core/hooks/useApi" // Import useApi

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton startIcon={<ViewColumn />} sx={{ color: "primary.main" }} />
      <GridToolbarFilterButton startIcon={<Filter />} sx={{ color: "primary.main" }} />
      <GridToolbarDensitySelector startIcon={<Settings />} sx={{ color: "primary.main" }} />
      <GridToolbarExport
        startIcon={<Download />}
        sx={{ color: "primary.main" }}
        csvOptions={{
          disableToolbarButton: false,
        }}
        printOptions={{
          disableToolbarButton: true,
        }}
      />
    </GridToolbarContainer>
  )
}

export default function BookedDemo() {
  const [allDemos, setAllDemos] = useState([])
  const { callApi, loading } = useApi() // Use the useApi hook
  const theme = useTheme()

  const getAllDemos = async () => {
    const result = await callApi({
      endpoint: `/v1/api/demo/getAllBookDemos`,
      method: "GET",

    })

    if (result.success) {
      setAllDemos(result.data.items)
    } else {
      console.error("Error fetching demos:", result.error)
    }
  }

  useEffect(() => {
    getAllDemos()
  }, [])

  const handleDelete = async (id) => {
    const result = await callApi({
      endpoint: `/v1/api/demo/deleteBookDemo/${id}`,
      method: "POST",
      data: {}, // Empty body as per original request
    })

    if (result.success) {
      getAllDemos() // Refresh the list after deletion
    } else {
      console.error("Error deleting demo:", result.error)
    }
  }

  const columns = [
    {
      field: "fullName",
      headerName: "Booked By",
      width: 180,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <Business sx={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            Booked By
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Business sx={{ fontSize: 16, color: "primary.main" }} />
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "workEmail",
      headerName: "Email",
      width: 220,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <Email sx={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            Email
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Email sx={{ fontSize: 16, color: "info.main" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Contact Number",
      width: 170,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <Phone sx={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            Contact Number
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Phone sx={{ fontSize: 16, color: "success.main" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "companyName",
      headerName: "Company Name",
      width: 180,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <Business sx={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            Company Name
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <Business sx={{ fontSize: 16, color: "success.main" }} />
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "jobTitle",
      headerName: "Job Title",
      width: 190,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <Work sx={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            Job Title
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <Work sx={{ fontSize: 16, color: "success.main" }} />
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "industryType",
      headerName: "Industry Type",
      width: 190,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <FaIndustry style={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            Industry Type
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <FaIndustry style={{ fontSize: 16, color: theme.palette.success.main }} />
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "numberOfEmployees",
      headerName: "Employees",
      width: 190,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <Person sx={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            Employees
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <Person sx={{ fontSize: 16, color: "success.main" }} />
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "howDidYouHearAboutUs",
      headerName: "How did you hear about us",
      width: 210,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <GiGiftOfKnowledge style={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            How did you hear about us
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <GiGiftOfKnowledge style={{ fontSize: 16, color: "success.main" }} />
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "preferredDemoTimeSlot",
      headerName: "Preferred Time Slot",
      width: 190,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <TimeToLeave sx={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            Preferred Time Slot
          </Typography>
        </Box>
      ),
      renderCell: (params) => {
        const dateStr = params.row?.preferredDemoTimeSlot
        if (!dateStr)
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2">-</Typography>
            </Box>
          )
        const date = new Date(dateStr)
        const formattedDate = isNaN(date.getTime())
          ? "-"
          : date.toLocaleString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2">{formattedDate}</Typography>
          </Box>
        )
      },
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 140,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <CalendarToday sx={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            Created Date
          </Typography>
        </Box>
      ),
      renderCell: (params) => {
        const dateStr = params.row?.createdAt
        if (!dateStr)
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2">-</Typography>
            </Box>
          )
        const date = new Date(dateStr)
        const formattedDate = isNaN(date.getTime())
          ? "-"
          : date.toLocaleString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2">{formattedDate}</Typography>
          </Box>
        )
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 155,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <Settings sx={{ fontSize: 16, color: "white" }} />
          <Typography variant="body2" fontWeight={600} color="white">
            Actions
          </Typography>
        </Box>
      ),
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: "100%", justifyContent: "center" }}>
            <IconButton onClick={() => handleDelete(params.row._id)}>
              <Delete color="error" />
            </IconButton>
          </Box>
        )
      },
    },
  ]
  return (
    <Container maxWidth="2xl">
      <Paper>
        <DataGrid
          rows={allDemos}
          columns={columns}
          pagination
          getRowId={(row) => row._id}
          disableRowSelectionOnClick
          loading={loading} // Use loading state from useApi
          slots={{
            toolbar: CustomToolbar,
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: 600,
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#7367F0",
              color: "#fff",
              borderRight: "none",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              color: "#fff",
            },
            "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
              color: "#fff",
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
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
      </Paper>
    </Container>
  )
}
