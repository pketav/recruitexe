"use client"

import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material"
import { useState, useEffect } from "react"
import axios from "axios"
import * as XLSX from 'xlsx'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid"
import { useRouter } from "next/navigation"
import {
  InfoOutlined as InfoOutlinedIcon,
  Business as BusinessIcon,
  AccountTree as DepartmentIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AutoAwesome as AIIcon,
  GroupWork as BulkIcon,
  CheckCircle as StatusIcon,
  Close as CloseIcon,
  Delete,
  Warning as WarningIcon,
  Save as SaveIcon,
} from "@mui/icons-material"

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace"



export default function Department() {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [depts, setDepts] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Delete confirmation dialog states
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleteType, setDeleteType] = useState("department") // "department" or "subdepartment"
  const [selectedRow, setSelectedRow] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Edit dialog states
  const [editDialog, setEditDialog] = useState(false)
  const [editType, setEditType] = useState("department") // "department" or "subdepartment"
  const [editLoading, setEditLoading] = useState(false)
  const [editFormData, setEditFormData] = useState({
    departmentName: "",
    subDepartmentName: "",
  })
  const [uploadSheet, setUploadSheet] = useState(false)

  // Responsive breakpoints
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const isLaptop = useMediaQuery(theme.breakpoints.down("lg"))

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Bulk Department States
  const [bulkDeptOpen, setBulkDeptOpen] = useState(false)
  const [departments, setDepartments] = useState([])
  const [loadingAI, setLoadingAI] = useState(false)

  // Open delete confirmation dialog
  const openDeleteDialog = (row) => {
    setSelectedRow(row)
    setDeleteType("department") // Default to department
    setDeleteDialog(true)
  }

  // Open edit dialog
  const openEditDialog = (row) => {
    setSelectedRow(row)
    setEditType("department") // Default to department
    setEditFormData({
      departmentName: row.name || "",
      subDepartmentName: row.subDepartment !== "No Sub-Department" ? row.subDepartment : "",
    })
    setEditDialog(true)
  }

  // Handle edit form changes
  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle edit confirmation
  const handleEditConfirm = async () => {
    if (!selectedRow) return

    setEditLoading(true)
    try {
      let payload = {}

      if (editType === "department") {
        // Edit department name
        payload = {
          departmentId: selectedRow.departmentId,
          name: editFormData.departmentName.trim(),
        }

        // If there's a sub-department, include its current data
        if (selectedRow.subDepartmentId && selectedRow.subDepartment !== "No Sub-Department") {
          payload.subDepartmentId = selectedRow.subDepartmentId
          payload.subDepartmentName = selectedRow.subDepartment
        }
      } else {
        // Edit sub-department name
        payload = {
          departmentId: selectedRow.departmentId,
          name: selectedRow.name, // Keep department name same
          subDepartmentId: selectedRow.subDepartmentId,
          subDepartmentName: editFormData.subDepartmentName.trim(),
        }
      }

      const res = await axios.post(`${baseUrl}/v1/api/newdepartment/updateDepartmentOrSubdepartment`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      if (res.data.status) {
        setSnackbar({
          open: true,
          severity: "success",
          message:
            editType === "department" ? "Department updated successfully" : "Sub-department updated successfully",
        })
        getDepts() // Refresh the data
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: res.data.message || "Failed to update",
        })
      }
    } catch (error) {
      console.error("Edit error:", error)
      setSnackbar({
        open: true,
        severity: "error",
        message: error.response?.data?.message || "Error updating item",
      })
    } finally {
      setEditLoading(false)
      setEditDialog(false)
      setSelectedRow(null)
      setEditFormData({ departmentName: "", subDepartmentName: "" })
    }
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedRow) return

    setDeleteLoading(true)
    try {
      let payload = {}

      if (deleteType === "department") {
        // Delete entire department
        payload = {
          departmentIds: [selectedRow.departmentId],
        }
      } else {
        // Delete sub-department
        payload = {
          departmentIds: [selectedRow.departmentId],
          subDepartmentId: selectedRow.subDepartmentId,
        }
      }

      // Use the single endpoint for both types of deletion
      const res = await axios.post(`${baseUrl}/v1/api/newdepartment/deleteDepartmentOrSubdepartment`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      if (!res.data.message.notDeleted?.length > 0) {
        setSnackbar({
          open: true,
          severity: "success",
          message:
            deleteType === "department" ? "Department deleted successfully" : "Sub-department deleted successfully",
        })
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: res.data.message?.notDeleted[0].reason,
        })
      }
      getDepts()
    } catch (error) {
      console.error("Delete error:", error)
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error deleting item",
      })
    } finally {
      setDeleteLoading(false)
      setDeleteDialog(false)
      setSelectedRow(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/newdepartment/deleteDepartmentOrSubdepartment`,
        {
          departmentIds: [id],
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if (!res.data.message.notDeleted.length > 0) {
        setSnackbar({
          open: true,
          severity: "success",
          message: res.data.message.message,
        })
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: res.data.message?.notDeleted[0].reason,
        })
      }
      getDepts()
    } catch (error) {
      console.error("error", error)
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error updating status",
      })
    }
  }

  // Responsive column configuration with full width coverage
  const getColumns = () => {
    const baseColumns = [
      {
        field: "name",
        headerName: "Department",
        flex: isMobile ? 1.2 : 1,
        minWidth: isMobile ? 120 : 150,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Tooltip title="Name of the department or organizational unit">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <BusinessIcon sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                {isMobile ? "Dept" : "Department"}
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => (
          <Tooltip title={`Department: ${params.value}`} placement="top">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.2, width: "100%", overflow: "hidden" }}>
              {/* <BusinessIcon sx={{ fontSize: 16, color: "primary.main", flexShrink: 0 }} /> */}
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {params.value}
              </Typography>
            </Box>
          </Tooltip>
        ),
      },
      {
        field: "subDepartment",
        headerName: "Sub-Department",
        flex: isMobile ? 1.5 : 1.8,
        minWidth: isMobile ? 140 : 180,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Tooltip title="Sub-departments under this main department">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <DepartmentIcon sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                {isMobile ? "Sub-Dept" : "Sub-Department"}
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => (
          <Tooltip title={`Sub-Department: ${params.value}`} placement="top">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.2, width: "100%", overflow: "hidden" }}>
              {/* <DepartmentIcon sx={{ fontSize: 16, color: "success.main", flexShrink: 0 }} /> */}
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {params.value}
              </Typography>
            </Box>
          </Tooltip>
        ),
      },
      ...(!isMobile
        ? [
            {
              field: "createdAt",
              headerName: "Created",
              flex: 0.8,
              minWidth: 100,
              headerAlign: "center",
              align: "center",
              renderHeader: () => (
                <Tooltip title="Date when the department was created">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                    <CalendarIcon sx={{ fontSize: 16, color: "white" }} />
                    <Typography variant="body2" fontWeight={600} color="white" noWrap>
                      Created
                    </Typography>
                  </Box>
                </Tooltip>
              ),
              renderCell: (params) => {
                const dateStr = params.row?.createdAt
                if (!dateStr || dateStr === "-")
                  return (
                    <Tooltip title="Created Date: Not available" placement="top">
                      <Typography variant="body2" sx={{ textAlign: "center", width: "100%" }}>
                        -
                      </Typography>
                    </Tooltip>
                  )
                const date = new Date(dateStr)
                const formattedDate = isNaN(date.getTime())
                  ? "-"
                  : date.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                return (
                  <Tooltip title={`Created Date: ${formattedDate}`} placement="top">
                    <Typography variant="body2" sx={{ textAlign: "center", width: "100%" }} noWrap>
                      {formattedDate}
                    </Typography>
                  </Tooltip>
                )
              },
            },
          ]
        : []),
      {
        field: "status",
        headerName: "Status",
        flex: isMobile ? 0.8 : 0.7,
        minWidth: isMobile ? 80 : 100,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Tooltip title="Current status of the department">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <StatusIcon sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                Status
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => {
          const isActive = params.row.isActive
          const statusColor = isActive ? "success" : "error"
          const statusLabel = isActive ? "Active" : "Inactive"

          return (
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <Chip
                label={statusLabel}
                color={statusColor}
                size="small"
                sx={{
                  borderRadius: "20px",
                  fontSize: "0.7rem",
                  height: 24,
                  minWidth: 60,
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          )
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: isMobile ? 1.2 : 0.8,
        minWidth: isMobile ? 100 : 120,
        headerAlign: "center",
        sortable: false,
        filterable: false,
        renderHeader: () => (
          <Tooltip title="Available actions for this department">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <SettingsIcon sx={{ fontSize: 16, color: "white" }} />
              <Typography variant="body2" fontWeight={600} color="white" noWrap>
                Actions
              </Typography>
            </Box>
          </Tooltip>
        ),
        renderCell: (params) => {
          const isActive = params.row.isActive

          return (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", width: "100%", justifyContent: "center" }}>
              <Tooltip title="Edit" placement="top">
                <IconButton
                  size="small"
                  sx={{
                    width: 28,
                    height: 28,
                    background: "linear-gradient(135deg, #2196f3, #1976d2)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1976d2, #1565c0)",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditDialog(params.row)
                  }}
                >
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={isActive ? "Deactivate" : "Activate"} placement="top">
                <IconButton
                  size="small"
                  sx={{
                    width: 28,
                    height: 28,
                    background: isActive
                      ? "linear-gradient(135deg, #f44336, #d32f2f)"
                      : "linear-gradient(135deg, #4caf50, #388e3c)",
                    color: "white",
                    "&:hover": {
                      background: isActive
                        ? "linear-gradient(135deg, #d32f2f, #c62828)"
                        : "linear-gradient(135deg, #388e3c, #2e7d32)",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleActivity(params.row.departmentId, params.row.subDepartmentId, !isActive)
                  }}
                >
                  {isActive ? <ToggleOffIcon sx={{ fontSize: 14 }} /> : <ToggleOnIcon sx={{ fontSize: 14 }} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    openDeleteDialog(params.row)
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "error.light",
                      color: "white",
                    },
                  }}
                >
                  <Delete sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )
        },
      },
    ]

    return baseColumns
  }

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ p: 1, gap: 1, display:"flex",justifyContent:"space-between" }}>
        <Box>
        <GridToolbarColumnsButton startIcon={<ViewColumnIcon />} sx={{ color: 'primary.main' }} />
        <GridToolbarFilterButton startIcon={<FilterIcon />} sx={{ color: 'primary.main' }} />
        <GridToolbarDensitySelector startIcon={<SettingsIcon />} sx={{ color: 'primary.main' }} />
        <GridToolbarExport
          startIcon={<DownloadIcon />}
          sx={{ color: 'primary.main' }}
          csvOptions={{
            disableToolbarButton: false
          }}
          printOptions={{
            disableToolbarButton: true
          }}
        />
        </Box>
          <Button
                color='white'
                variant='outlined'
                onClick={() => setUploadSheet(true)}
                sx={{
                  borderRadius: '25px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                }}
              >
                Upload Sheet
              </Button>
      </GridToolbarContainer>
    )
  }

  const getDepts = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${baseUrl}/v1/api/newdepartment`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const formatted = res.data.items.map((item, index) => {
        const uniqueId = item.subDepartmentId || `dept-${item.departmentId}-${index}`

        return {
          id: uniqueId,
          departmentId: item.departmentId,
          name: item.departmentName,
          subDepartment: item.subDepartmentName || "No Sub-Department",
          subDepartmentId: item.subDepartmentId,
          createdAt: item.createdAt || "-",
          isActive: item.isActive !== undefined ? item.isActive : true,
          isSubDepartment: item.isSubDepartment,
          subDepartments: item.subDepartments || [],
        }
      })

      setDepts(formatted)
      setTotalItems(formatted.length)
    } catch (error) {
      console.error("error", error)
      setDepts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      getDepts()
    }
  }, [token])

  const handleActivity = async (departmentId, subdeparmentId, isChecked) => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/newdepartment/toggleSubDepartmentStatus?departmentId=${departmentId}&subDepartmentId=${subdeparmentId}&isActive=${isChecked}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if (res.data.status) {
        setSnackbar({
          message: "Status updated successfully",
          severity: "success",
          open: true,
        })
      }
      getDepts()
    } catch (error) {
      console.error("error", error)
      setSnackbar({
        message: "Error updating status",
        severity: "error",
        open: true,
      })
    }
  }

  const handleUseAI = async () => {
    setLoadingAI(true)
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/newdepartment/deparmentGemini`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if(res.data.status)
      {setDepartments(res.data.items || [])
      setSnackbar({
        message: "AI suggestions loaded successfully",
        severity: "success",
        open: true,
      })}
      else{
        setSnackbar({
          message: res.data.message,
          severity: "warning",
          open: true,
        })}
    } catch (error) {
      console.error("Failed to fetch AI departments", error)
      setSnackbar({
        message: "Failed to load AI suggestions",
        severity: "error",
        open: true,
      })
    } finally {
      setLoadingAI(false)
    }
  }

  const handleDeptChange = (index, newName) => {
    const updated = [...departments]
    updated[index].name = newName
    setDepartments(updated)
  }

  const handleSubDeptChange = (deptIndex, subIndex, newName) => {
    const updated = [...departments]
    updated[deptIndex].subDepartments[subIndex].name = newName
    setDepartments(updated)
  }

  const addSubDept = (deptIndex) => {
    const updated = [...departments]
    updated[deptIndex].subDepartments.push({ name: "" })
    setDepartments(updated)
  }

  const removeSubDept = (deptIndex, subIndex) => {
    const updated = [...departments]
    updated[deptIndex].subDepartments.splice(subIndex, 1)
    setDepartments(updated)
  }

  const addDepartment = () => {
    setDepartments([...departments, { name: "", subDepartments: [{ name: "" }] }])
  }

  const removeDepartment = (index) => {
    const updated = [...departments]
    updated.splice(index, 1)
    setDepartments(updated)
  }

  const handleBulkDept = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/v1/api/newdepartment/addDepartmentsBulk`,
        { departments: departments },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if (response.data.status) {
        getDepts()
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "success",
        })
      }
    } catch (error) {
      console.error("Failed to add bulk departments", error)
      setSnackbar({
        message: "Failed to add bulk departments",
        severity: "error",
        open: true,
      })
    } finally {
      setDepartments([])
      setBulkDeptOpen(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href =
      'https://cdn.fincooper.in/STAGE/HRMS/OTHERS/1750625171728_Departments_Upload_Template.xlsx';
    link.download = 'Sample_Department_Upload.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
    const handleUploadSheet = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
      
        try {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data);
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
      
          if (!json.length) {
            return setSnackbar({
              message: 'Sheet is empty.',
              severity: 'error',
              open: true,
            });
          }
      
          // Flexible header map: normalize header names
          const headerMap = {
            departmentname: 'name',
            subdepartmentname: 'subDepartment'
          };
      
          const normalizeKey = key => key.toLowerCase().replace(/[\s-_]/g, '');
      
          const firstRowKeys = Object.keys(json[0]).map(k => normalizeKey(k));
          const requiredHeaders = Object.keys(headerMap);
      
          const hasAllHeaders = requiredHeaders.every(header =>
            firstRowKeys.includes(header)
          );
      
          if (!hasAllHeaders) {
            return setSnackbar({
              message: 'Invalid format. Please refer to the sample sheet.',
              severity: 'error',
              open: true,
            });
          }
      
          // Map headers to fields
          const depts = json.map(row => {
            const mapped = {};
            for (const [key, value] of Object.entries(row)) {
              const normalized = normalizeKey(key);
              const mappedKey = headerMap[normalized];
              if (mappedKey) mapped[mappedKey] = value.trim();
            }
            return mapped;
          });
      
          // Normalize helper
          const normalize = str => str.toLowerCase().replace(/\s+/g, '');
      
          // Group into department format
          const groupedDepartments = depts.reduce((acc, curr) => {
            const departmentName = curr.name?.trim();
            const subDepartmentName = curr.subDepartment?.trim();
      
            if (!departmentName) return acc;
      
            let existingDept = acc.find(d => d.name === departmentName);
            if (!existingDept) {
              existingDept = {
                name: departmentName,
                subDepartments: [],
              };
              acc.push(existingDept);
            }
      
            if (subDepartmentName) {
              const normalizedSubDept = normalize(subDepartmentName);
              const alreadyExists = existingDept.subDepartments.some(
                sd => normalize(sd.name) === normalizedSubDept
              );
      
              if (!alreadyExists) {
                const code = subDepartmentName
                  .split(' ')
                  .map(w => w[0])
                  .join('')
                  .toUpperCase();
                existingDept.subDepartments.push({
                  name: `${subDepartmentName} (${code})`,
                });
              }
            }
      
            return acc;
          }, []);
      
          const res = await axios.post(
            `${baseUrl}/v1/api/newdepartment/addDepartmentsBulk`,
            { departments: groupedDepartments },
            {
              headers: {
                'Content-Type': 'application/json',
                authorization: token,
              },
            }
          );
      
          setSnackbar({
            message: res.data.message,
            severity: res.data.status ? 'success' : 'error',
            open: true,
          });
      
          if (res.data.status) {
            getDepts()
            setUploadSheet(false)
          }
      
        } catch (error) {
          console.error('Upload Error:', error);
          setSnackbar({
            message: error?.message || 'Something went wrong.',
            severity: 'error',
            open: true,
          });
        }
      };
      

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <BusinessIcon sx={{ fontSize: 30, color: "white" }} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: "white", mb: 0.5 }}>
                Department Management
              </Typography>
              <Tooltip title="Organizational units that group employees by function or role (e.g., HR, Finance, Engineering)">
                <InfoOutlinedIcon sx={{ color: "#ffffff", fontSize: 24, cursor: "pointer" }} />
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="white"
              variant="outlined"
              startIcon={<BulkIcon />}
              onClick={() => setBulkDeptOpen(true)}
              size={isMobile ? "small" : "medium"}
              sx={{
                borderRadius: "25px",
                px: { xs: 2, sm: 3 },
                py: 1,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Add Bulk Department
            </Button>
            <Button
              sx={{ borderRadius: "25px" }}
              color="white"
              variant="outlined"
              onClick={() => router.push("/employeeSetup")}
            >
              <KeyboardBackspaceIcon />
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Enhanced DataGrid */}
      <Paper sx={{ p: { xs: 1, sm: 2 }, width: "100%", overflow: "hidden" }}>
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            "& .MuiDataGrid-root": {
              width: "100%",
              maxWidth: "100%",
            },
          }}
        >
          <DataGrid
            rows={depts}
            columns={getColumns()}
            loading={loading}
            pagination
            getRowId={(row) => row.id || `fallback-${Math.random()}`}
            paginationModel={{ page, pageSize: rowsPerPage }}
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page)
              setRowsPerPage(pageSize)
            }}
            rowCount={totalItems}
            pageSizeOptions={[5, 10, 20, 50, totalItems]}
            disableRowSelectionOnClick
            slots={{
              toolbar: CustomToolbar,
            }}
            sx={{
              width: "100%",
              maxWidth: "100%",
              minHeight: 400,
              border: "none",
              "& .MuiDataGrid-main": {
                overflow: "hidden",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflow: "auto",
                maxWidth: "100%",
              },
              "& .MuiDataGrid-virtualScrollerContent": {
                width: "100% !important",
                maxWidth: "100% !important",
              },
              "& .MuiDataGrid-virtualScrollerRenderZone": {
                width: "100% !important",
                maxWidth: "100% !important",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1976d2",
                color: "#fff",
                fontWeight: 600,
                minHeight: { xs: 40, sm: 56 },
                maxWidth: "100%",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#1976d2",
                color: "#fff",
                borderRight: "none",
                padding: { xs: "0 8px", sm: "0 16px" },
                overflow: "hidden",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                color: "#fff",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
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
                padding: { xs: "0 8px", sm: "0 16px" },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                overflow: "hidden",
              },
              "& .MuiDataGrid-row": {
                minHeight: { xs: 40, sm: 52 },
                maxWidth: "100%",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                  cursor: "pointer",
                },
              },
              "& .MuiDataGrid-toolbarContainer": {
                padding: { xs: "8px", sm: "12px" },
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #e0e0e0",
                flexWrap: "wrap",
                gap: 1,
                maxWidth: "100%",
                overflow: "hidden",
              },
              "& .MuiDataGrid-footerContainer": {
                minHeight: { xs: 40, sm: 52 },
                maxWidth: "100%",
              },
              // Force no horizontal scroll
              overflowX: "hidden !important",
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-horizontal": {
                display: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflowX: "hidden !important",
              },
            }}
            autoHeight
            disableColumnResize
            disableColumnMenu={isMobile}
            hideFooterSelectedRowCount
          />
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: 20,
            fontWeight: 700,
            background: "linear-gradient(135deg, #2196f3, #1976d2)",
            color: "white",
            py: 2.5,
            px: 3,
          }}
        >
          <EditIcon sx={{ fontSize: 24 }} />
          Edit Department
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
              What would you like to edit?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Selected item: <strong>{selectedRow?.name}</strong>
              {selectedRow?.subDepartment !== "No Sub-Department" && (
                <>
                  {" "}
                  → <strong>{selectedRow?.subDepartment}</strong>
                </>
              )}
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                Choose what to edit:
              </FormLabel>
              <RadioGroup value={editType} onChange={(e) => setEditType(e.target.value)} sx={{ gap: 1 }}>
                <FormControlLabel
                  value="department"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Edit department name
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Change the main department name
                      </Typography>
                    </Box>
                  }
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    p: 2,
                    m: 0,
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
                {selectedRow?.subDepartmentId && selectedRow?.subDepartment !== "No Sub-Department" && (
                  <FormControlLabel
                    value="subdepartment"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          Edit sub-department name
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Change only the sub-department name: {selectedRow?.subDepartment}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                      m: 0,
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  />
                )}
              </RadioGroup>
            </FormControl>

            {/* Edit Form Fields */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {editType === "department" && (
                <TextField
                  fullWidth
                  label="Department Name"
                  value={editFormData.departmentName}
                  onChange={(e) => handleEditFormChange("departmentName", e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}

              {editType === "subdepartment" && selectedRow?.subDepartmentId && (
                <TextField
                  fullWidth
                  label="Sub-Department Name"
                  value={editFormData.subDepartmentName}
                  onChange={(e) => handleEditFormChange("subDepartmentName", e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setEditDialog(false)}
            disabled={editLoading}
            sx={{
              borderRadius: "25px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              borderColor: "#64748b",
              color: "#64748b",
              "&:hover": {
                borderColor: "#475569",
                backgroundColor: "#f8fafc",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditConfirm}
            disabled={
              editLoading ||
              (editType === "department" && !editFormData.departmentName.trim()) ||
              (editType === "subdepartment" && !editFormData.subDepartmentName.trim())
            }
            sx={{
              borderRadius: "25px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              background: "linear-gradient(135deg, #2196f3, #1976d2)",
              "&:hover": {
                background: "linear-gradient(135deg, #1976d2, #1565c0)",
              },
            }}
            startIcon={editLoading ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            {editLoading ? "Saving..." : `Save ${editType === "department" ? "Department" : "Sub-Department"}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: 20,
            fontWeight: 700,
            background: "linear-gradient(135deg, #f44336, #d32f2f)",
            color: "white",
            py: 2.5,
            px: 3,
          }}
        >
          <WarningIcon sx={{ fontSize: 24 }} />
          Delete Confirmation
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
              What would you like to delete?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Selected item: <strong>{selectedRow?.name}</strong>
              {selectedRow?.subDepartment !== "No Sub-Department" && (
                <>
                  {" "}
                  → <strong>{selectedRow?.subDepartment}</strong>
                </>
              )}
            </Typography>

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                Choose deletion type:
              </FormLabel>
              <RadioGroup value={deleteType} onChange={(e) => setDeleteType(e.target.value)} sx={{ gap: 1 }}>
                <FormControlLabel
                  value="department"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Delete entire department
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This will delete the department and all its sub-departments
                      </Typography>
                    </Box>
                  }
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    p: 2,
                    m: 0,
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
                {selectedRow?.subDepartmentId && selectedRow?.subDepartment !== "No Sub-Department" && (
                  <FormControlLabel
                    value="subdepartment"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          Delete only sub-department
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This will only delete the selected sub-department: {selectedRow?.subDepartment}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                      m: 0,
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  />
                )}
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialog(false)}
            disabled={deleteLoading}
            sx={{
              borderRadius: "25px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              borderColor: "#64748b",
              color: "#64748b",
              "&:hover": {
                borderColor: "#475569",
                backgroundColor: "#f8fafc",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
            sx={{
              borderRadius: "25px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              background: "linear-gradient(135deg, #f44336, #d32f2f)",
              "&:hover": {
                background: "linear-gradient(135deg, #d32f2f, #c62828)",
              },
            }}
            startIcon={deleteLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deleteLoading ? "Deleting..." : `Delete ${deleteType === "department" ? "Department" : "Sub-Department"}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Bulk Department Modal */}
      <Dialog
        open={bulkDeptOpen}
        onClose={() => setBulkDeptOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            fontSize: { xs: 18, sm: 20 },
            fontWeight: 700,
            background: "linear-gradient(135deg, #1976d2, #1565c0)",
            color: "white",
            py: { xs: 2, sm: 2.5 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <BulkIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            Bulk Department Manager
          </Box>
          <IconButton
            onClick={() => setBulkDeptOpen(false)}
            sx={{
              color: "white",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, backgroundColor: "#f8fafc" }}>
          <Box sx={{ p: { xs: 2, sm: 4 } }}>
            {/* Enhanced Header Section */}
            <Box sx={{ display: "flex", justifyContent: "end", alignItems: "flex-start", mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AIIcon />}
                onClick={handleUseAI}
                disabled={loadingAI}
                size={isMobile ? "small" : "medium"}
                sx={{
                  borderRadius: "25px",
                  px: { xs: 2, sm: 4 },
                  py: 1.5,
                  background: "linear-gradient(135deg, #ff9800, #f57c00)",
                  boxShadow: "0 8px 25px rgba(255, 152, 0, 0.3)",
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", sm: "0.95rem" },
                  textTransform: "none",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(135deg, #f57c00, #ef6c00)",
                    boxShadow: "0 12px 35px rgba(255, 152, 0, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                  background: 'rgba(244, 157, 27, 0.3)',
                    color: "rgba(255,255,255,0.7)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loadingAI ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1, color: "white" }} />
                    Generating...
                  </>
                ) : (
                  "✨ Generate"
                )}
              </Button>
            </Box>

            {/* Departments Container */}
            <Box
              sx={{
                maxHeight: { xs: "60vh", sm: "65vh" },
                overflowY: "auto",
                pr: 1,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1",
                  borderRadius: "10px",
                  "&:hover": {
                    background: "#a8a8a8",
                  },
                },
              }}
            >
              {departments.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: { xs: 4, sm: 8 },
                    px: { xs: 2, sm: 4 },
                    border: "2px dashed #e0e7ff",
                    borderRadius: 3,
                    backgroundColor: "#f8faff",
                  }}
                >
                  <BusinessIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: "#a5b4fc", mb: 2 }} />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1, fontSize: { xs: "1rem", sm: "1.25rem" } }}
                  >
                    No departments added yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Click "Add Department" below or use AI to get started
                  </Typography>
                </Box>
              ) : (
                departments.map((dept, deptIndex) => (
                  <Box
                    key={deptIndex}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 3,
                      p: { xs: 2, sm: 3 },
                      mb: 3,
                      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      position: "relative",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {/* Department Header */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        gap: 2,
                        mb: 3,
                        pb: 2,
                        borderBottom: "2px solid #f1f5f9",
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          alignSelf: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <BusinessIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <TextField
                        fullWidth
                        label="Department Name"
                        value={dept.name}
                        onChange={(e) => handleDeptChange(deptIndex, e.target.value)}
                        size={isMobile ? "small" : "medium"}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "white",
                            "& fieldset": {
                              borderColor: "#e2e8f0",
                            },
                            "&:hover fieldset": {
                              borderColor: "#3b82f6",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#3b82f6",
                              borderWidth: "2px",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: 500,
                          },
                        }}
                      />
                      <Tooltip title="Remove Department" placement="top">
                        <IconButton
                          onClick={() => removeDepartment(deptIndex)}
                          sx={{
                            p: 1.5,
                            color: "white",
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            borderRadius: 2,
                            alignSelf: { xs: "flex-end", sm: "center" },
                            "&:hover": {
                              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                              transform: "scale(1.05)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Sub-Departments Section */}
                    <Box sx={{ pl: { xs: 0, sm: 2 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                          color: "#64748b",
                        }}
                      >
                        <DepartmentIcon sx={{ fontSize: 18 }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Sub-Departments ({dept.subDepartments.length})
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {dept.subDepartments.map((sub, subIndex) => (
                          <Box
                            key={subIndex}
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              alignItems: { xs: "stretch", sm: "center" },
                              gap: 2,
                              p: 2,
                              backgroundColor: "#f8fafc",
                              borderRadius: 2,
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "#3b82f6",
                                flexShrink: 0,
                                alignSelf: { xs: "flex-start", sm: "center" },
                              }}
                            />
                            <TextField
                              fullWidth
                              label={`Sub-department ${subIndex + 1}`}
                              value={sub.name}
                              onChange={(e) => handleSubDeptChange(deptIndex, subIndex, e.target.value)}
                              size="small"
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  backgroundColor: "white",
                                  "& fieldset": {
                                    borderColor: "#e2e8f0",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#3b82f6",
                                  },
                                },
                              }}
                            />
                            <Tooltip title="Remove Sub-Department" placement="top">
                              <IconButton
                                onClick={() => removeSubDept(deptIndex, subIndex)}
                                size="small"
                                sx={{
                                  color: "#ef4444",
                                  alignSelf: { xs: "flex-end", sm: "center" },
                                  "&:hover": {
                                    backgroundColor: "#fef2f2",
                                    color: "#dc2626",
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ))}
                      </Box>

                      <Button
                        variant="text"
                        onClick={() => addSubDept(deptIndex)}
                        startIcon={<AddIcon />}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          mt: 2,
                          borderRadius: "20px",
                          textTransform: "none",
                          fontWeight: 600,
                          color: "#3b82f6",
                          "&:hover": {
                            backgroundColor: "#eff6ff",
                          },
                        }}
                      >
                        Add Sub-department
                      </Button>
                    </Box>
                  </Box>
                ))
              )}
            </Box>

            {/* Add Department Button */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="outlined"
                onClick={addDepartment}
                startIcon={<AddIcon />}
                size={isMobile ? "small" : "medium"}
                sx={{
                  borderRadius: "25px",
                  px: { xs: 3, sm: 4 },
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  borderColor: "#3b82f6",
                  color: "#3b82f6",
                  borderWidth: "2px",
                  "&:hover": {
                    borderColor: "#1d4ed8",
                    backgroundColor: "#eff6ff",
                    borderWidth: "2px",
                  },
                }}
              >
                Add New Department
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: { xs: 2, sm: 4 },
            backgroundColor: "white",
            borderTop: "1px solid #e2e8f0",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setBulkDeptOpen(false)
              setDepartments([])
            }}
            fullWidth={isMobile}
            sx={{
              borderRadius: "25px",
              px: { xs: 4, sm: 6 },
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              borderColor: "#64748b",
              color: "#64748b",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              "&:hover": {
                borderColor: "#475569",
                backgroundColor: "#f8fafc",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBulkDept}
            disabled={departments.length === 0}
            fullWidth={isMobile}
            sx={{
              borderRadius: "25px",
              px: { xs: 4, sm: 6 },
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              background: "linear-gradient(135deg, #1976d2, #1565c0)",
              boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0, #0d47a1)",
                boxShadow: "0 12px 35px rgba(25, 118, 210, 0.4)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "#e2e8f0",
                color: "#94a3b8",
                boxShadow: "none",
              },
              transition: "all 0.3s ease",
            }}
            startIcon={<BulkIcon />}
          >
            Submit {departments.length} Department{departments.length !== 1 ? "s" : ""}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={uploadSheet} onClose={()=>setUploadSheet(false)}>
      <DialogContent>
        <Box sx={{width:"100%", px:4,pt:4}}> 
        <Typography variant="h6">
          You can upload a data sheet or download a sample template to start with.
        </Typography>
        <Box sx={{display:"flex", gap:5, alignItems:"center",my:5, justifyContent:"center", width:"100%"}}>
        <input
          accept=".xlsx, .xls"
          type="file"
          id="upload-branch-sheet"
          onChange={handleUploadSheet}
          style={{ display: 'none' }}
        />
        <label htmlFor="upload-branch-sheet">
          <Button
            variant="contained"
            sx={{ backgroundColor: '#667eea' }}
            component="span"
          >
            Upload Sheet
          </Button>
        </label>
        <Button variant="outlined" sx={{color:'#667eea'}} onClick={handleDownload}>
          Download Sample Sheet
        </Button>
        </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{pb: 2,mt:-4 }}>
         <Button variant='outlined' size='small' onClick={()=>setUploadSheet(false)}>Close</Button>
      </DialogActions>
    </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
