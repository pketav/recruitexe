
"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid"
import {
  Avatar,
  Box,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Button,
  TextField,
  Paper,
  TablePagination,
  CircularProgress,
  useMediaQuery,
  Chip,
  Tooltip,
  useTheme,
  alpha,
  Card,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  Divider, 
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  DialogActions,
} from "@mui/material"
import {
  getAllEmployeeApi,
  getAllServicesApi,
  getAllUnfilteredCasesApi,
  getDashBoardCount,
  getInitDownloadExcelAPI,
  getInitFormApi,
  getMyPartnersAPI,
  postAddCaseForAiApi,
  postAddCasesApi,
  postAllocateApi,
  updateAddCasesApi,
  uploadImageApi,
  uploadMultiImageApi,
  uploadReadExcelAPI,
} from "@/services/apiService"
import Edit from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import ImageIcon from "@mui/icons-material/Image"
import { CloudUpload, Delete, Preview, Image, PictureAsPdf, Description } from "@mui/icons-material"
import CustomTextField from "@/@core/components/mui/TextField"
import Modal from "@/app/(dashboard)/commandexe/components/modal"
import Icon from "../../home/DynamicIcon"

const getFileNameFromUrl = (url) => {
  try {
    const urlParts = url.split("/")
    const lastPart = urlParts[urlParts.length - 1]
    // Remove timestamp prefix if present (like "1748695223694_")
    const cleanName = lastPart.replace(/^\d+_/, "")
    return cleanName || "Unknown File"
  } catch (error) {
    return "Unknown File"
  }
}

const MultiUploadComponent = ({ value }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = (e) => {
    e.stopPropagation()
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleViewFile = (url, e) => {
    e.stopPropagation()
    window.open(url, "_blank")
  }

  const fileCount = Array.isArray(value) ? value.length : 0

  return (
    <>
      {/* Main display component */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2">{fileCount > 0 ? `${fileCount} file(s)` : "0 files"}</Typography>
        {fileCount > 0 && (
          <IconButton size="small" onClick={handleOpenDialog} sx={{ p: 0.25 }} title="View all files">
            <Icon icon="tabler:eye" fontSize="small" color="#0082c6" />
          </IconButton>
        )}
      </Box>

      {/* Dialog for displaying files */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon icon="tabler:files" fontSize="medium" color="#0082c6" />
            <Typography variant="h6">Uploaded Files ({fileCount})</Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 0, py: 1 }}>
          <List sx={{ width: "100%" }}>
            {Array.isArray(value) &&
              value.map((url, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 3, py: 1.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {getFileNameFromUrl(url)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Click view to open in new tab
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => handleViewFile(url, e)}
                        size="small"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                          borderRadius: 1,
                          px: 1.5,
                          py: 0.5,
                        }}
                      >
                        <Icon icon="tabler:external-link" fontSize="small" />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          View
                        </Typography>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < value.length - 1 && <Divider />}
                </React.Fragment>
              ))}
          </List>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" startIcon={<Icon icon="tabler:x" />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

// Main component
const PDDashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState("all") // Fixed naming
  const [partners, setPartners] = useState([])
  const [addCases, setAddCases] = useState([])
  const [counts, setCounts] = useState({})
  const [startDateFilter, setStartDateFilter] = useState("")
  const [endDateFilter, setEndDateFilter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [previewType, setPreviewType] = useState("overview")
  const [status, setStatus] = useState("all") // Fixed to single value
  const [paiProductList, setPaiProductList] = useState([])
  const [page, setPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(100)
  const [totalCount, setTotalCount] = useState(0)
  const [rows, setRows] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [tabValue, setTabValue] = useState(0)
  // Add state to manage selected row IDs
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [openExcel, setOpenExcel] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [editFormErrors, setEditFormErrors] = useState({})
  const [openAdd, setOpenAdd] = useState(false)

  // Add ref for the upload area
  const uploadAreaRef = useRef(null)

  const handleAdd = () => {
    setOpenAdd(true)
  }

  const handleCloseAdd = () => {
    setOpenAdd(false)
    setFormData({
      partnerId: "",
      fileNo: "",
      customerName: "",
      fatherName: "",
      contactNo: "",
      date: "",
      address: "",
    })
    setUploadedFile(null) // Reset uploaded file state
    setFieldValues({}) // Reset field values
  }

  const [selectedService, setSelectedService] = useState("")

  const [excelData, setExcelData] = useState({
    partnerId: "",
    fileNo: "",
    customerName: "",
    fatherName: "",
    contactNo: "",
    date: "",
    address: "",
    documents: null,
  })

  const handleOpenExcel = () => {
    fetchPartners()
    setOpenExcel(true)
  }

  const handleCloseExcel = () => {
    setOpenExcel(false)
    setExcelData({
      partnerId: "",
      reportType: "",
      documents: null,
    })
  }

  const handleExcelSubmit = async (event) => {
    console.log("Submitting Excel data:", excelData)

    event.preventDefault()
    try {
      const response = await uploadReadExcelAPI(excelData.partnerId, excelData.serviceId, excelData.documents)

      console.log("Excel data submitted successfully:", response)

      if (response.status) {
        setSnackbar({
          open: true,
          message: response.message || "Excel data submitted successfully",
          severity: "success",
        })
      } else {
        setSnackbar({
          open: true,
          message: response.message || "Excel data submission failed",
          severity: "error",
        })
      }
    } catch (err) {
      console.error("Error submitting Excel data:", err)
      setSnackbar({
        open: true,
        message: response.message || "Failed to submit Excel data",
        severity: "error",
      })
    } finally {
      setExcelData({
        partnerId: "",
        serviceId: "",
      })
      fetchAddCases()
      setOpenExcel(false)
    }
  }

  const handleDownloadSampleExcel = async (partnerId) => {
    if (!partnerId) {
      setSnackbar({
        open: true,
        message: "Please select a partner first",
        severity: "warning",
      })

      return
    }

    try {
      const response = await getInitDownloadExcelAPI(partnerId)

      console.log("Sample Excel response:", response)

      if (response && response.items) {
        const excelUrl = response.items

        const downloadLink = document.createElement("a")

        downloadLink.href = excelUrl
        downloadLink.download = "sample-excel-template.xlsx"

        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      } else {
        console.error("No sample Excel URL found in the response")

        setSnackbar({
          open: true,
          message: "Sample template not available",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Error downloading sample Excel:", error)

      setSnackbar({
        open: true,
        message: "Failed to download sample Excel",
        severity: "error",
      })
    }
  }

  const handleRemoveFile = () => {
    setExcelData({ ...excelData, documents: null })
  }

  const [opneAllocate, setOpenAllocate] = useState(false)
  const [selectedEmp, setSelectedEmp] = useState("")

  const handleAllocateEmp = async (event) => {
    const dataToSend = {
      allocatedEmp: selectedEmp,
      initId: selectedRowIds,
    }

    try {
      const response = await postAllocateApi(dataToSend)

      if (response.status) {
        setSnackbar({
          open: true,
          message: "Case allocated successfully!",
          severity: "success",
        })

        fetchAddCases()
        setSelectedEmp("")
        setSelectedRowIds([])
      } else {
        setSnackbar({
          open: true,
          message: response.message || "Failed to allocate case",
          severity: "error",
        })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Something went wrong",
        severity: "error",
      })
    } finally {
      setOpenAllocate(false)
    }
  }

  const [dragActive, setDragActive] = useState(false)
  const [pasteActive, setPasteActive] = useState(false)

  // const handleSubmit = async (event) => {
  //   event.preventDefault()

  //   // Validate required fields
  //   const errors = {}
  //   let hasErrors = false
  //   const todayDate = new Date().toISOString().split("T")[0]

  //   initFields.forEach((field, index) => {
  //     const fieldKey = field.fieldName || `field_${index}`
  //     const fieldValue = fieldValues[fieldKey] || (field.dataType === "multiUpload" ? [] : "")

  //        // For date fields, if no value is set, use today's date
  //   if (field.dataType === "date" && (!fieldValue || fieldValue === "")) {
  //     fieldValue = todayDate
  //     // Update the fieldValues state to include this date
  //     setFieldValues((prev) => ({
  //       ...prev,
  //       [fieldKey]: todayDate,
  //     }))
  //   }

  //     if (field.isRequired && (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0))) {
  //       errors[fieldKey] = true
  //       hasErrors = true
  //     }
  //   })

  //   if (!formData.partnerId) {
  //     errors.partnerId = true
  //     hasErrors = true
  //   }

  //   if (!formData.serviceId) {
  //     errors.serviceId = true
  //     hasErrors = true
  //   }

  //   setFormErrors(errors)

  //   if (hasErrors) {
  //     setSnackbar({
  //       open: true,
  //       message: "Please fill all required fields",
  //       severity: "error",
  //     })
  //     return
  //   }

  //   const initFieldsData = initFields.map((field, index) => {
  //     const fieldKey = field.fieldName || `field_${index}`
  //     return {
  //       fieldName: field.fieldName,
  //       dataType: field.dataType,
  //       value: fieldValues[fieldKey] || (field.dataType === "multiUpload" ? [] : ""),
  //     }
  //   })

  //   const dataToSend = {
  //     partnerId: formData.partnerId,
  //     referServiceId: formData.serviceId,
  //     initFields: initFieldsData,
  //   }

  //   try {
  //     const response = await postAddCasesApi(dataToSend)
  //     if (response.status) {
  //       setSnackbar({
  //         open: true,
  //         message: "Case added successfully!",
  //         severity: "success",
  //       })
  //       fetchAddCases()
  //       fetchDashBoardCount()
  //       setFormData({
  //         partnerId: "",
  //         serviceId: "",
  //       })
  //       // Reset field values
  //       const resetValues = {}
  //       initFields.forEach((field, index) => {
  //         const fieldKey = field.fieldName || `field_${index}`
  //         resetValues[fieldKey] = field.dataType === "multiUpload" ? [] : ""
  //       })
  //       setFieldValues(resetValues)
  //       setFormErrors({})
  //     } else {
  //       setSnackbar({
  //         open: true,
  //         message: response.message || "Failed to add case",
  //         severity: "error",
  //       })
  //     }
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: error.message || "Something went wrong",
  //       severity: "error",
  //     })
  //   } finally {
  //     handleCloseAdd()
  //     fetchAddCases()
  //   }
  // }

  const handleSubmit = async (event) => {
  event.preventDefault()

  // Validate required fields
  const errors = {}
  let hasErrors = false
  const todayDate = new Date().toISOString().split("T")[0]

  initFields.forEach((field, index) => {
    const fieldKey = field.fieldName || `field_${index}`
    let fieldValue = fieldValues[fieldKey]

    // For date fields, if no value is set, use today's date
    if (field.dataType === "date" && (!fieldValue || fieldValue === "")) {
      fieldValue = todayDate
      // Update the fieldValues state to include this date
      setFieldValues((prev) => ({
        ...prev,
        [fieldKey]: todayDate,
      }))
    }

    // Handle multiUpload arrays
    if (field.dataType === "multiUpload" && !Array.isArray(fieldValue)) {
      fieldValue = []
    }

    if (field.isRequired && (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0))) {
      errors[fieldKey] = true
      hasErrors = true
    }
  })

  if (!formData.partnerId) {
    errors.partnerId = true
    hasErrors = true
  }

  if (!formData.serviceId) {
    errors.serviceId = true
    hasErrors = true
  }

  setFormErrors(errors)

  if (hasErrors) {
    setSnackbar({
      open: true,
      message: "Please fill all required fields",
      severity: "error",
    })
    return
  }

  // Prepare initFields data with proper date handling
  const initFieldsData = initFields.map((field, index) => {
    const fieldKey = field.fieldName || `field_${index}`
    let fieldValue = fieldValues[fieldKey]

    // Ensure date fields have a value
    if (field.dataType === "date" && (!fieldValue || fieldValue === "")) {
      fieldValue = todayDate
    }

    // Ensure multiUpload fields are arrays
    if (field.dataType === "multiUpload" && !Array.isArray(fieldValue)) {
      fieldValue = []
    }

    return {
      fieldName: field.fieldName,
      dataType: field.dataType,
      value: fieldValue,
    }
  })

  const dataToSend = {
    partnerId: formData.partnerId,
    referServiceId: formData.serviceId,
    initFields: initFieldsData,
  }

  console.log("Submitting data:", dataToSend) // Debug log to verify date is included

  try {
    const response = await postAddCasesApi(dataToSend)
    if (response.status) {
      setSnackbar({
        open: true,
        message: "Case added successfully!",
        severity: "success",
      })
      fetchAddCases()
      fetchDashBoardCount()
      setFormData({
        partnerId: "",
        serviceId: "",
      })

      // Reset field values
      const resetValues = {}
      initFields.forEach((field, index) => {
        const fieldKey = field.fieldName || `field_${index}`
        if (field.dataType === "multiUpload") {
          resetValues[fieldKey] = []
        } else if (field.dataType === "date") {
          resetValues[fieldKey] = todayDate
        } else {
          resetValues[fieldKey] = ""
        }
      })
      setFieldValues(resetValues)
      setFormErrors({})
    } else {
      setSnackbar({
        open: true,
        message: response.message || "Failed to add case",
        severity: "error",
      })
    }
  } catch (error) {
    setSnackbar({
      open: true,
      message: error.message || "Something went wrong",
      severity: "error",
    })
  } finally {
    handleCloseAdd()
    fetchAddCases()
  }
}

  const [uploadedFile, setUploadedFile] = useState(null)

  const handleFileUpload = async (file) => {
    if (!file) return

    try {
      const response = await uploadImageApi(file)

      if (response?.status && response?.items?.fileUrl) {
        setUploadedFile({
          name: file.name,
          url: response.items.fileUrl,
          type: file.type,
        })
      } else {
        console.error("Upload failed or fileUrl missing:", response)
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  const handleFileRemove = () => {
    setUploadedFile(null)
  }

  const handleFileInputChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileUpload(file)
    }
  }

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      // Check if file type is allowed
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"]
      if (allowedTypes.includes(file.type)) {
        await handleFileUpload(file)
      } else {
        setSnackbar({
          open: true,
          message: "Please upload only images or PDF files",
          severity: "error",
        })
      }
    }
  }

  // Updated paste handler - only handle paste when in upload area or when no file is uploaded
  const handlePaste = async (e) => {
    // Check if the paste event is happening in a text input field
    const activeElement = document.activeElement
    const isTextInput =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.contentEditable === "true" ||
        activeElement.closest(".MuiInputBase-input")) // MUI input fields

    // If pasting in a text field, allow normal paste behavior
    if (isTextInput) {
      return
    }

    // Only handle image paste when in upload area or when modal is open and no file uploaded
    if (!openAdd || uploadedFile) {
      return
    }

    e.preventDefault()
    setPasteActive(true)

    const items = e.clipboardData?.items
    if (!items) {
      setPasteActive(false)
      return
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      // Check if the item is an image
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile()
        if (file) {
          await handleFileUpload(file)
          setSnackbar({
            open: true,
            message: "Image pasted successfully!",
            severity: "success",
          })
        }
        break
      }
    }

    setTimeout(() => setPasteActive(false), 500)
  }

  // Updated useEffect for paste handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only show visual feedback when not in a text input and modal is open
      if ((e.ctrlKey || e.metaKey) && e.key === "v" && !uploadedFile && openAdd) {
        const activeElement = document.activeElement
        const isTextInput =
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.contentEditable === "true" ||
            activeElement.closest(".MuiInputBase-input"))

        if (!isTextInput) {
          setPasteActive(true)
          setTimeout(() => setPasteActive(false), 200)
        }
      }
    }

    // Only add paste listener when add modal is open
    if (openAdd) {
      document.addEventListener("keydown", handleKeyDown)
      document.addEventListener("paste", handlePaste)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("paste", handlePaste)
    }
  }, [uploadedFile, openAdd])

  const [formData, setFormData] = useState({
    partnerId: "",
    serviceId: "",
    fileNo: "",
    customerName: "",
    fatherName: "",
    contactNo: "",
    date: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSendToAi = async (fileUrl) => {
    try {
      // Collect all uploaded files
      const allFiles = []

      // Add main uploaded file if exists
      if (fileUrl) {
        allFiles.push(fileUrl)
      }

      // Collect files from initFields with file and multiUpload dataTypes
      initFields.forEach((field, index) => {
        const fieldKey = field.fieldName || `field_${index}`
        const fieldValue = fieldValues[fieldKey]

        if (field.dataType === "file" && fieldValue) {
          allFiles.push(fieldValue)
        } else if (field.dataType === "multiUpload" && Array.isArray(fieldValue) && fieldValue.length > 0) {
          allFiles.push(...fieldValue)
        }
      })

      if (allFiles.length === 0) {
        setSnackbar({
          open: true,
          message: "No files found to process with AI",
          severity: "warning",
        })
        return
      }

      const payload = {
        doc: allFiles,
      }

      const aiResponse = await postAddCaseForAiApi(payload)
      console.log("AI Response:", aiResponse)

      // Auto-populate form fields based on AI response
      if (aiResponse?.items) {
        // Update form data fields
        const updatedFormData = { ...formData }

        // Map common fields directly
        const directMappings = {
          fileNo: "fileNo",
          customerName: "customerName",
          fatherName: "fatherName",
          contactNo: "contactNo",
          date: "date",
          address: "address",
        }

        Object.entries(directMappings).forEach(([responseKey, formKey]) => {
          if (aiResponse.items[responseKey]) {
            updatedFormData[formKey] = aiResponse.items[responseKey]
          }
        })

        setFormData(updatedFormData)

        // Update dynamic fields
        const updatedFieldValues = { ...fieldValues }

        // Map AI response to dynamic form fields
        initFields.forEach((field, index) => {
          const fieldKey = field.fieldName || `field_${index}`

          // Try to match by fieldName or fieldNamesAttachment
          const matchingResponseKey = Object.keys(aiResponse.items).find(
            (key) =>
              key.toLowerCase() === field.fieldName?.toLowerCase() ||
              key.toLowerCase() === field.fieldNamesAttachment?.toLowerCase(),
          )

          if (matchingResponseKey && aiResponse.items[matchingResponseKey]) {
            updatedFieldValues[fieldKey] = aiResponse.items[matchingResponseKey]
          }
        })

        setFieldValues(updatedFieldValues)

        setSnackbar({
          open: true,
          message: "AI extraction completed successfully!",
          severity: "success",
        })
      }
    } catch (error) {
      console.error("Failed to process AI data:", error)
      setSnackbar({
        open: true,
        message: "AI extraction failed. Please try again.",
        severity: "error",
      })
    }
  }

  const handleRunAiExtraction = async () => {
    try {
      setLoading(true)

      // Check if there are any files to process
      const hasMainFile = uploadedFile?.url
      const hasFieldFiles = initFields.some((field, index) => {
        const fieldKey = field.fieldName || `field_${index}`
        const fieldValue = fieldValues[fieldKey]
        return (
          (field.dataType === "file" && fieldValue) ||
          (field.dataType === "multiUpload" && Array.isArray(fieldValue) && fieldValue.length > 0)
        )
      })

      if (!hasMainFile && !hasFieldFiles) {
        setSnackbar({
          open: true,
          message: "Please upload at least one file before running AI extraction",
          severity: "warning",
        })
        return
      }
      const res = await handleSendToAi(uploadedFile?.url)
      if(res.status){
        setSnackbar({
          open: true,
          message: "AI extraction completed successfully!",
          severity: "success",
        })
      } else{
        setSnackbar({
          open: true,
          message: res.message || "AI extraction failed. Please try again.",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("AI extraction failed", error)
      setSnackbar({
        open: true,
        message: "AI extraction failed. Please try again.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
    setSelectedRow(null)
    setSelectedRowIds([])
  }
  const [selectedAddCases, setSelectedAddCases] = useState({})

  const [editFieldValues, setEditFieldValues] = useState({})
  const [editUploadingFields, setEditUploadingFields] = useState({})

  const renderEditField = (field, index) => {
    const fieldKey = field.fieldName || `field_${index}`
    const fieldValue = editFieldValues[fieldKey] !== undefined ? editFieldValues[fieldKey] : field.value

    switch (field.dataType) {
      case "string":
        return (
          <CustomTextField
            fullWidth
            label={field.fieldName.replace(/_/g, ' ')}
            placeholder={`Enter ${field.fieldName}`}
            value={fieldValue || ""}
            onChange={(e) =>
              setEditFieldValues((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        )

      case "textarea":
        return (
          <CustomTextField
            fullWidth
            multiline
            rows={4}
            label={field.fieldName.replace(/_/g, ' ')}
            placeholder={`Enter ${field.fieldName.replace(/_/g, ' ')}`}
            value={fieldValue || ""}
            onChange={(e) =>
              setEditFieldValues((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        )

      case "date":
      // Handle date field properly - use existing value or default to today
      const dateValue = fieldValue || new Date().toISOString().split("T")[0]

      return (
        <Box>
          <CustomTextField
            fullWidth
            type="date"
            label={field.fieldName.replace(/_/g, " ")}
            placeholder={`Select ${field.fieldName}`}
            value={dateValue}
            onChange={(e) =>
              setEditFieldValues((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            // helperText={isError ? `${field.fieldName} is required` : ""}
            // error={!!isError}
            required={field.isRequired}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>
      )        

      case "file":
        return (
          <Box>
            {fieldValue ? (
              <Box>
                {/* File Display - matches text field height */}
                <Box
                  sx={{
                    minHeight: "56px",
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    borderRadius: "8px",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    "&:hover": {
                      borderColor: "rgba(0, 0, 0, 0.87)",
                    },
                  }}
                >
                  {(() => {
                    const fileInfo = getFileInfo(fieldValue)
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                        <Box sx={{ flexShrink: 0 }}>{fileInfo.icon}</Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "1rem",
                            }}
                          >
                            {fileInfo.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => previewFile(fieldValue)}
                            sx={{ color: "primary.main" }}
                          >
                            <Preview fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setEditFieldValues((prev) => ({ ...prev, [fieldKey]: "" }))}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    )
                  })()}
                </Box>

                {/* Image Preview - separate from main field */}
                {(() => {
                  const fileInfo = getFileInfo(fieldValue)
                  return fileInfo.type === "image" ? (
                    <Box
                      sx={{
                        mt: 1,
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => previewFile(fieldValue)}
                    >
                      <img
                        src={fieldValue || "/placeholder.svg"}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid #ddd",
                        }}
                      />
                    </Box>
                  ) : null
                })()}
              </Box>
            ) : (
              /* Upload Button - matches text field height */
              <Box
                sx={{
                  minHeight: "56px",
                  border: "2px dashed rgba(0, 0, 0, 0.23)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <input
                  type="file"
                  id={`edit-file-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) handleEditSingleFileUpload(file, fieldKey)
                  }}
                  accept="*/*"
                />
                <label
                  htmlFor={`edit-file-${index}`}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  {editUploadingFields[fieldKey] ? (
                    <>
                      <CircularProgress size={20} />
                      <Typography variant="body1" color="text.secondary">
                        Uploading...
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CloudUpload color="primary" />
                      <Typography variant="body1" color="text.secondary">
                        Upload {field.fieldName}
                      </Typography>
                    </>
                  )}
                </label>
              </Box>
            )}
          </Box>
        )

      case "multiUpload":
        return (
          <Box>
            {Array.isArray(fieldValue) && fieldValue.length > 0 && (
              <Box sx={{ mb: 1 }}>
                {fieldValue.map((fileUrl, fileIndex) => {
                  const fileInfo = getFileInfo(fileUrl)
                  return (
                    <Box
                      key={fileIndex}
                      sx={{
                        minHeight: "56px",
                        border: "1px solid rgba(0, 0, 0, 0.23)",
                        borderRadius: "8px",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        mb: 1,
                        "&:hover": {
                          borderColor: "rgba(0, 0, 0, 0.87)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                        <Box sx={{ flexShrink: 0 }}>{fileInfo.icon}</Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "1rem",
                            }}
                          >
                            {fileInfo.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton size="small" onClick={() => previewFile(fileUrl)} sx={{ color: "primary.main" }}>
                            <Preview fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => removeEditFile(fieldKey, fileIndex)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}

                {/* Image Previews Row */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                  {fieldValue.map((fileUrl, fileIndex) => {
                    const fileInfo = getFileInfo(fileUrl)
                    return fileInfo.type === "image" ? (
                      <Box
                        key={`preview-${fileIndex}`}
                        sx={{
                          cursor: "pointer",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #ddd",
                        }}
                        onClick={() => previewFile(fileUrl)}
                      >
                        <img
                          src={fileUrl || "/placeholder.svg"}
                          alt={`Preview ${fileIndex + 1}`}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ) : null
                  })}
                </Box>
              </Box>
            )}

            {/* Upload Button - matches text field height */}
            <Box
              sx={{
                minHeight: "56px",
                border: "2px dashed rgba(0, 0, 0, 0.23)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fafafa",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
            >
              <input
                type="file"
                id={`edit-multi-file-${index}`}
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = e.target.files
                  if (files && files.length > 0) {
                    handleEditMultiFileUpload(files, fieldKey)
                  }
                }}
                accept="*/*"
              />
              <label
                htmlFor={`edit-multi-file-${index}`}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {editUploadingFields[fieldKey] ? (
                  <>
                    <CircularProgress size={20} />
                    <Typography variant="body1" color="text.secondary">
                      Uploading...
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudUpload color="action" />
                    <Typography variant="body1" color="text.secondary">
                      {Array.isArray(fieldValue) && fieldValue.length > 0
                        ? "Add More Files"
                        : `Upload ${field.fieldName}`}
                    </Typography>
                  </>
                )}
              </label>
            </Box>
          </Box>
        )

      default:
        return <Alert severity="warning">Unsupported field type: {field.dataType}</Alert>
    }
  }

  // Handle single file upload for edit mode
  const handleEditSingleFileUpload = async (file, fieldName) => {
    setEditUploadingFields((prev) => ({ ...prev, [fieldName]: true }))

    try {
      const response = await uploadImageApi(file)
      console.log("Edit single upload response:", response)
      if (response?.items?.fileUrl) {
        setEditFieldValues((prev) => ({
          ...prev,
          [fieldName]: response.items.fileUrl,
        }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setSnackbar({
        open: true,
        message: "File upload failed. Please try again.",
        severity: "error",
      })
    } finally {
      setEditUploadingFields((prev) => ({ ...prev, [fieldName]: false }))
    }
  }

  // Handle multiple file upload for edit mode
  const handleEditMultiFileUpload = async (files, fieldName) => {
    setEditUploadingFields((prev) => ({ ...prev, [fieldName]: true }))

    try {
      let fileArray

      if (Array.isArray(files)) {
        fileArray = files
      } else if (files && typeof files === "object") {
        fileArray = Object.values(files)
      } else {
        throw new Error("Invalid files parameter")
      }

      fileArray = fileArray.filter((file) => file != null)

      if (fileArray.length === 0) {
        throw new Error("No valid files to upload")
      }

      const formData = new FormData()
      fileArray.forEach((file) => {
        formData.append("images", file)
      })

      const response = await uploadMultiImageApi(formData)
      console.log("Edit multi upload response:", response)

      if (response?.items?.files) {
        setEditFieldValues((prev) => ({
          ...prev,
          [fieldName]: [...(prev[fieldName] || []), ...response.items.files],
        }))
      }
    } catch (error) {
      console.error("Multi upload failed:", error)
      setSnackbar({
        open: true,
        message: "Multiple file upload failed. Please try again.",
        severity: "error",
      })
    } finally {
      setEditUploadingFields((prev) => ({ ...prev, [fieldName]: false }))
    }
  }

  // Remove file from multi-upload in edit mode
  const removeEditFile = (fieldName, fileIndex) => {
    setEditFieldValues((prev) => {
      const updatedFiles = Array.isArray(prev[fieldName])
        ? prev[fieldName].filter((_, index) => index !== fileIndex)
        : []

      return {
        ...prev,
        [fieldName]: updatedFiles,
      }
    })
  }

  // Update the handleOpen function to initialize edit field values
  const handleOpen = (addCases) => {
    console.log("Opening edit cases dialog with:", addCases)
    setSelectedAddCases(addCases)

    // Initialize edit field values from the selected case's initFields
    if (addCases.initFields && Array.isArray(addCases.initFields)) {
      const initialValues = {}
      addCases.initFields.forEach((field, index) => {
        const fieldKey = field.fieldName || `field_${index}`
        initialValues[fieldKey] = field.value
      })
      setEditFieldValues(initialValues)
    } else {
      setEditFieldValues({})
    }

    setOpen(true)
  }

  // const handleUpdate = async () => {
  //   try {
  //     if (!selectedAddCases?._id) {
  //       setSnackbar({
  //         open: true,
  //         message: "Case ID not found",
  //         severity: "error",
  //       })
  //       return
  //     }

  //     // Validate required fields
  //     const errors = {}
  //     let hasErrors = false

  //     selectedAddCases.initFields?.forEach((field, index) => {
  //       const fieldKey = field.fieldName || `field_${index}`
  //       const fieldValue = editFieldValues[fieldKey] !== undefined ? editFieldValues[fieldKey] : field.value

  //       if (field.isRequired && (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0))) {
  //         errors[fieldKey] = true
  //         hasErrors = true
  //       }
  //     })

  //     if (!selectedAddCases.partnerId) {
  //       errors.partnerId = true
  //       hasErrors = true
  //     }

  //     if (!selectedAddCases.serviceId) {
  //       errors.serviceId = true
  //       hasErrors = true
  //     }

  //     setEditFormErrors(errors)

  //     if (hasErrors) {
  //       setSnackbar({
  //         open: true,
  //         message: "Please fill all required fields",
  //         severity: "error",
  //       })
  //       return
  //     }

  //     const updatedInitFields =
  //       selectedAddCases.initFields?.map((field, index) => {
  //         const fieldKey = field.fieldName || `field_${index}`
  //         return {
  //           ...field,
  //           value: editFieldValues[fieldKey] !== undefined ? editFieldValues[fieldKey] : field.value,
  //         }
  //       }) || []

  //     const updatedData = {
  //       id: selectedAddCases._id,
  //       partnerId: selectedAddCases.partnerId,
  //       referseviceId: selectedAddCases.serviceId,
  //       initFields: updatedInitFields,
  //     }

  //     console.log("Updating case with data:", updatedData)
  //     const res = await updateAddCasesApi(updatedData)

  //     if (res?.status) {
  //       setSnackbar({
  //         open: true,
  //         message: "Case updated successfully!",
  //         severity: "success",
  //       })
  //       handleClose()
  //       fetchAddCases()
  //       setEditFormErrors({})
  //     } else {
  //       setSnackbar({
  //         open: true,
  //         message: res?.message || "Update failed",
  //         severity: "error",
  //       })
  //     }
  //   } catch (error) {
  //     console.error("Error updating case:", error)
  //     setSnackbar({
  //       open: true,
  //       message: "Unexpected error during update",
  //       severity: "error",
  //     })
  //   }
  // }
  // Pagination handlers
 
  const handleUpdate = async () => {
  try {
    if (!selectedAddCases?._id) {
      setSnackbar({
        open: true,
        message: "Case ID not found",
        severity: "error",
      })
      return
    }

    // Validate required fields
    const errors = {}
    let hasErrors = false
    const todayDate = new Date().toISOString().split("T")[0]

    selectedAddCases.initFields?.forEach((field, index) => {
      const fieldKey = field.fieldName || `field_${index}`
      let fieldValue = editFieldValues[fieldKey] !== undefined ? editFieldValues[fieldKey] : field.value

      // For date fields, ensure we have a value
      if (field.dataType === "date" && (!fieldValue || fieldValue === "")) {
        fieldValue = todayDate
        // Update the editFieldValues state
        setEditFieldValues((prev) => ({
          ...prev,
          [fieldKey]: todayDate,
        }))
      }

      if (field.isRequired && (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0))) {
        errors[fieldKey] = true
        hasErrors = true
      }
    })

    if (!selectedAddCases.partnerId) {
      errors.partnerId = true
      hasErrors = true
    }

    if (!selectedAddCases.serviceId) {
      errors.serviceId = true
      hasErrors = true
    }

    setEditFormErrors(errors)

    if (hasErrors) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      })
      return
    }

    const updatedInitFields =
      selectedAddCases.initFields?.map((field, index) => {
        const fieldKey = field.fieldName || `field_${index}`
        let fieldValue = editFieldValues[fieldKey] !== undefined ? editFieldValues[fieldKey] : field.value

        // Ensure date fields have a value
        if (field.dataType === "date" && (!fieldValue || fieldValue === "")) {
          fieldValue = todayDate
        }

        return {
          ...field,
          value: fieldValue,
        }
      }) || []

    const updatedData = {
      id: selectedAddCases._id,
      partnerId: selectedAddCases.partnerId,
      referseviceId: selectedAddCases.serviceId,
      initFields: updatedInitFields,
    }

    console.log("Updating case with data:", updatedData) // Debug log
    const res = await updateAddCasesApi(updatedData)

    if (res?.status) {
      setSnackbar({
        open: true,
        message: "Case updated successfully!",
        severity: "success",
      })
      handleClose()
      fetchAddCases()
      setEditFormErrors({})
    } else {
      setSnackbar({
        open: true,
        message: res?.message || "Update failed",
        severity: "error",
      })
    }
  } catch (error) {
    console.error("Error updating case:", error)
    setSnackbar({
      open: true,
      message: "Unexpected error during update",
      severity: "error",
    })
  }
}
 
  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1)
  }

  const handleChangeRowsPerPage = (event) => {
    const newPageLimit = Number.parseInt(event.target.value, 10)
    setPageLimit(newPageLimit)
    setPage(1)
  }

  const [emps, setEmps] = useState([])
  const [services, setServices] = useState([])
  const [dateRange, setDateRange] = useState("")
  const [initFields, setInitFields] = useState([])
  const [fieldValues, setFieldValues] = useState({})
  const [uploadingFields, setUploadingFields] = useState({})

  // Handle single file upload
  const handleSingleFileUpload = async (file, fieldName) => {
    setUploadingFields((prev) => ({ ...prev, [fieldName]: true }))

    try {
      //   const formData = new FormData();
      //   formData.append('file', file);

      const response = await uploadImageApi(file) // Your single upload API
      console.log("Single upload response:", response)
      if (response?.items?.fileUrl) {
        setFieldValues((prev) => ({
          ...prev,
          [fieldName]: response.items.fileUrl,
        }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
      // Handle error - show snackbar
    } finally {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: false }))
    }
  }
  // Handle multiple file upload
  const handleMultiFileUpload = async (files, fieldName) => {
    setUploadingFields((prev) => ({ ...prev, [fieldName]: true }))
    console.log("Uploading files:", files, "for field:", fieldName)

    try {
      let fileArray

      if (Array.isArray(files)) {
        fileArray = files
      } else if (files && typeof files === "object") {
        // Handle FileList or object with numeric keys
        fileArray = Object.values(files)
      } else {
        throw new Error("Invalid files parameter")
      }

      // Filter out any null/undefined values
      fileArray = fileArray.filter((file) => file != null)

      if (fileArray.length === 0) {
        throw new Error("No valid files to upload")
      }

      const formData = new FormData()
      fileArray.forEach((file) => {
        formData.append("images", file)
      })

      const response = await uploadMultiImageApi(formData) // Your multi upload API
      console.log("Multi upload response:", response)

      if (response?.items?.files) {
        setFieldValues((prev) => ({
          ...prev,
          [fieldName]: [...(prev[fieldName] || []), ...response.items.files],
        }))
      }
    } catch (error) {
      console.error("Multi upload failed:", error)
      // Handle error - show snackbar
    } finally {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: false }))
    }
  }

  // Remove file from multi-upload
  const removeFile = (fieldName, fileIndex) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, index) => index !== fileIndex),
    }))
  }
  // Get file icon and info based on file type
  const getFileInfo = (url, fileName = "") => {
    const extension = url?.split(".").pop()?.toLowerCase() || fileName?.split(".").pop()?.toLowerCase()
    const name = fileName || url?.split("/").pop() || "Unknown file"

    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff"].includes(extension)) {
      return { icon: <Image color="primary" />, type: "image", name, extension }
    } else if (extension === "pdf") {
      return { icon: <PictureAsPdf color="error" />, type: "pdf", name, extension }
    } else if (["doc", "docx"].includes(extension)) {
      return { icon: <Description color="info" />, type: "document", name, extension }
    } else if (["xls", "xlsx"].includes(extension)) {
      return { icon: <Description color="success" />, type: "spreadsheet", name, extension }
    } else if (["txt", "rtf"].includes(extension)) {
      return { icon: <Description color="action" />, type: "text", name, extension }
    } else if (["zip", "rar", "7z"].includes(extension)) {
      return { icon: <Description color="warning" />, type: "archive", name, extension }
    } else if (["mp4", "avi", "mov", "wmv", "flv"].includes(extension)) {
      return { icon: <Description color="secondary" />, type: "video", name, extension }
    } else if (["mp3", "wav", "flac", "aac"].includes(extension)) {
      return { icon: <Description color="primary" />, type: "audio", name, extension }
    }
    return { icon: <Description />, type: "unknown", name, extension }
  }

  // Preview file with proper handling
  const previewFile = (url, fileName = "") => {
    const fileInfo = getFileInfo(url, fileName)

    if (fileInfo.type === "image") {
      // Create image preview modal
      const img = new Image()
      img.src = url
      img.onload = () => {
        const newWindow = window.open("", "_blank")
        newWindow.document.write(`
          <html>
            <head><title>Image Preview - ${fileInfo.name}</title></head>
            <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh;">
              <img src="${url}" style="max-width:100%; max-height:100%; object-fit:contain;" alt="${fileInfo.name}"/>
            </body>
          </html>
        `)
      }
    } else {
      // Open other file types in new tab
      window.open(url, "_blank")
    }
  }

  const renderField = (field, index) => {
    const fieldKey = field.fieldName || `field_${index}`
    const fieldValue = fieldValues[fieldKey] || (field.dataType === "multiUpload" ? [] : "")
    const isError = formErrors[fieldKey]

    const getFieldProps = () => ({
      fullWidth: true,
      label: `${field.fieldName.replace(/_/g, ' ')}`,
      placeholder: `Enter ${field.fieldName}`,
      value: fieldValue,
      onChange: (e) =>
        setFieldValues((prev) => ({
          ...prev,
          [fieldKey]: e.target.value,
        })),
      error: !!isError,
      helperText: isError ? `${field.fieldName} is required` : "",
      required: field.isRequired,
      sx: {
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
        "& .MuiFormLabel-root": {
          color: isError ? "error.main" : undefined,
        },
      },
    })

    switch (field.dataType) {
      case "string":
        return <CustomTextField {...getFieldProps()} />

      case "textarea":
        return <CustomTextField {...getFieldProps()} multiline rows={4} />

    //    case "date":
    // return (
    //   <Box>
    //     <CustomTextField
    //       fullWidth
    //       type="date"
    //       label={field.fieldName}
    //       placeholder={`Select ${field.fieldName}`}
    //       value={fieldValue || new Date().toISOString().split('T')[0]}
    //       onChange={(e) =>
    //         setFieldValues((prev) => ({
    //           ...prev,
    //           [fieldKey]: e.target.value,
    //         }))
    //       }
    //       InputLabelProps={{
    //         shrink: true,
    //       }}
    //       sx={{
    //         "& .MuiOutlinedInput-root": {
    //           borderRadius: "8px",
    //         },
    //       }}
    //     />
    //     {isError && (
    //       <Typography variant="caption" color="error.main" sx={{ mt: 1 }}>
    //         {field.fieldName} is required
    //       </Typography>
    //     )}
    //   </Box>
    // )

     case "date":
      // Get current date value or default to today
      const dateValue = fieldValue || new Date().toISOString().split("T")[0]

      return (
        <Box>
          <CustomTextField
            fullWidth
            type="date"
            label={field.fieldName.replace(/_/g, " ")}
            placeholder={`Select ${field.fieldName}`}
            value={dateValue}
            onChange={(e) =>
              setFieldValues((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            error={!!isError}
            helperText={isError ? `${field.fieldName} is required` : ""}
            required={field.isRequired}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              "& .MuiFormLabel-root": {
                color: isError ? "error.main" : undefined,
              },
            }}
          />
        </Box>
      )

      case "file":
        return (
          <Box>
            {fieldValue ? (
              <Box>
                <Box
                  sx={{
                    minHeight: "56px",
                    border: `1px solid ${isError ? theme.palette.error.main : "rgba(0, 0, 0, 0.23)"}`,
                    borderRadius: "8px",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    "&:hover": {
                      borderColor: isError ? theme.palette.error.main : "rgba(0, 0, 0, 0.87)",
                    },
                  }}
                >
                  {(() => {
                    const fileInfo = getFileInfo(fieldValue)
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                        <Box sx={{ flexShrink: 0 }}>{fileInfo.icon}</Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "1rem",
                            }}
                          >
                            {fileInfo.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => previewFile(fieldValue)}
                            sx={{ color: "primary.main" }}
                          >
                            <Preview fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setFieldValues((prev) => ({ ...prev, [fieldKey]: "" }))}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    )
                  })()}
                </Box>
                {(() => {
                  const fileInfo = getFileInfo(fieldValue)
                  return fileInfo.type === "image" ? (
                    <Box sx={{ mt: 1, textAlign: "center", cursor: "pointer" }} onClick={() => previewFile(fieldValue)}>
                      <img
                        src={fieldValue || "/placeholder.svg"}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid #ddd",
                        }}
                      />
                    </Box>
                  ) : null
                })()}
                {isError && (
                  <Typography variant="caption" color="error.main" sx={{ mt: 1 }}>
                    {field.fieldName} is required
                  </Typography>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  minHeight: "56px",
                  border: `2px dashed ${isError ? theme.palette.error.main : "rgba(0, 0, 0, 0.23)"}`,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: isError ? theme.palette.error.main : "primary.main",
                  },
                }}
              >
                <input
                  type="file"
                  id={`file-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) handleSingleFileUpload(file, fieldKey)
                  }}
                  accept="*/*"
                />
                <label
                  htmlFor={`file-${index}`}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  {uploadingFields[fieldKey] ? (
                    <>
                      <CircularProgress size={20} />
                      <Typography variant="body1" color="text.secondary">
                        Uploading...
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CloudUpload color={isError ? "error" : "primary"} />
                      <Typography variant="body1" color={isError ? "error.main" : "text.secondary"}>
                        Upload {field.fieldName}
                      </Typography>
                    </>
                  )}
                </label>
                {isError && (
                  <Typography variant="caption" color="error.main" sx={{ mt: 1 }}>
                    {field.fieldName} is required
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )

        

      case "multiUpload":
        return (
          <Box>
            {fieldValue.length > 0 && (
              <Box sx={{ mb: 1 }}>
                {fieldValue.map((fileUrl, fileIndex) => {
                  const fileInfo = getFileInfo(fileUrl)
                  return (
                    <Box
                      key={fileIndex}
                      sx={{
                        minHeight: "56px",
                        border: `1px solid ${isError ? theme.palette.error.main : "rgba(0, 0, 0, 0.23)"}`,
                        borderRadius: "8px",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        mb: 1,
                        "&:hover": {
                          borderColor: isError ? theme.palette.error.main : "rgba(0, 0, 0, 0.87)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                        <Box sx={{ flexShrink: 0 }}>{fileInfo.icon}</Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "1rem",
                            }}
                          >
                            {fileInfo.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton size="small" onClick={() => previewFile(fileUrl)} sx={{ color: "primary.main" }}>
                            <Preview fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => removeFile(fieldKey, fileIndex)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                  {fieldValue.map((fileUrl, fileIndex) => {
                    const fileInfo = getFileInfo(fileUrl)
                    return fileInfo.type === "image" ? (
                      <Box
                        key={`preview-${fileIndex}`}
                        sx={{ cursor: "pointer", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }}
                        onClick={() => previewFile(fileUrl)}
                      >
                        <img
                          src={fileUrl || "/placeholder.svg"}
                          alt={`Preview ${fileIndex + 1}`}
                          style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                      </Box>
                    ) : null
                  })}
                </Box>
              </Box>
            )}
            <Box
              sx={{
                minHeight: "56px",
                border: `2px dashed ${isError ? theme.palette.error.main : "rgba(0, 0, 0, 0.23)"}`,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fafafa",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: isError ? theme.palette.error.main : "primary.main",
                },
              }}
            >
              <input
                type="file"
                id={`multi-file-${index}`}
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = e.target.files
                  if (files && files.length > 0) {
                    handleMultiFileUpload(files, fieldKey)
                  }
                }}
                accept="*/*"
              />
              <label
                htmlFor={`multi-file-${index}`}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {uploadingFields[fieldKey] ? (
                  <>
                    <CircularProgress size={20} />
                    <Typography variant="body1" color="text.secondary">
                      Uploading...
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudUpload color={isError ? "error" : "action"} />
                    <Typography variant="body1" color={isError ? "error.main" : "text.secondary"}>
                      {fieldValue.length === 0 ? `Upload ${field.fieldName}` : "Add More Files"}
                    </Typography>
                  </>
                )}
              </label>
            </Box>
            {isError && (
              <Typography variant="caption" color="error.main" sx={{ mt: 1 }}>
                {field.fieldName} is required
              </Typography>
            )}
          </Box>
        )

      default:
        return <Alert severity="warning">Unsupported field type: {field.dataType}</Alert>
    }
  }

  const fetchEmps = async () => {
    try {
      const data = await getAllEmployeeApi()
      if (data.status && Array.isArray(data.items)) {
        setEmps(data.items)
      } else {
        setEmps([])
      }
    } catch (err) {
      console.error(err)
      setEmps([])
    }
  }

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await getAllServicesApi()
      console.log("services", response)

      if (response?.items) {
        setServices(response.items)
      }
    } catch (err) {
      console.error("Failed to fetch services:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchInitFields = async () => {
    try {
      const response = await getInitFormApi()
      console.log("Init fields", response)

      if (response?.status) {
        setInitFields(response.items)
        // Initialize field values
        const initialValues = {}
        response?.items?.forEach((field, index) => {
          initialValues[field.fieldName || `field_${index}`] = field.dataType === "multiUpload" ? [] : ""
        })
        setFieldValues(initialValues)
      } else {
        console.error("Failed to fetch init fields:", response?.message || "Unknown error")
        setSnackbar({
          open: true,
          message: response?.message || "Failed to load initial fields",
          severity: "error",
        })
        setTimeout(() => {
          setSnackbar({ ...snackbar, open: false })
        }, 3000)
      }
    } catch (err) {
      console.error("Failed to fetch init fields:", err)
      setSnackbar({
        open: true,
        message: "Failed to load initial fields",
        severity: "error",
      })
      setTimeout(() => {
        setSnackbar({ ...snackbar, open: false })
      }, 3000)
    }
  }

  useEffect(() => {
    fetchDashBoardCount()
    fetchPartners()
    fetchEmps()
    fetchServices()
    fetchInitFields()
  }, [])

  // Fixed useEffect for fetching cases with proper dependencies
  useEffect(() => {
    fetchAddCases()
  }, [selectedService, selectedEmployee, dateRange, startDateFilter, endDateFilter])

  const fetchPartners = async () => {
    try {
      const data = await getMyPartnersAPI()

      if (data.status) {
        setPartners(data.items)
        console.log("partners", data.items)
      } else {
        console.error("Failed to fetch partners:", data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchDashBoardCount = async () => {
    try {
      setIsLoading(true)

      const res = await getDashBoardCount()
      console.log("Dashboard counts response:", res)

      if (res && res.status) {
        setCounts({
          totalCases: res.items.all || 0,
          wipCases: res.items.allocated || 0,
          pendingCases: res.items.unAllocated || 0,
        })
      } else {
        console.error("Failed to fetch dashboard counts:", res.message || "Unknown error")
      }
    } catch (error) {
      console.error("Error fetching dashboard counts:", error)
      setSnackbar({
        open: true,
        message: "Failed to load dashboard counts",
        severity: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fixed fetchAddCases function with proper parameter handling
  const fetchAddCases = async () => {
    try {
      setIsLoading(true)

      // Prepare filter parameters
      const statusParam = status === "all" ? "all" : status
      const partnerParam = selectedEmployee === "all" ? "" : selectedEmployee

      console.log("Fetching cases with filters:", {
        status: statusParam,
        partner: partnerParam,
        range: dateRange,
        startDate: startDateFilter,
        endDate: endDateFilter,
      })

      const data = await getAllUnfilteredCasesApi(
        selectedService,
        partnerParam,
        dateRange,
        startDateFilter,
        endDateFilter,
      )

      console.log("All cases data:", data)

      if (data?.items) {
        setRows(
          data.items.map((item) => ({
            _id: item._id,
            fileNo: item.fileNo,
            partnerName: item.partnerId?.name || "N/A",
            partnerId: item.partnerId?._id || "N/A",
            customerName: item.customerName,
            fatherName: item.fatherName,
            contactNo: item.contactNo,
            date: item.date || "N/A",
            address: item.address,
            initFields: item.initFields || [],
            serviceId: item.referServiceId._id || "N/A",
            doneBy: item.doneBy?.employeName || "N/A",
            officeEmp: item.allocatedOfficeEmp?.employeName || "N/A",
            createdAt: item.createdAt || "N/A",
            customerId: item.customerId || item._id,
            serviceName: item.referServiceId.serviceName || "N/A",
            edit: true,
            delete: false,
            view: false,
          })),
        )
        setTotalCount(data.totalCount || data.items.length)
      } else {
        console.error("Failed to fetch cases:", data?.message)
        setRows([])
      }
    } catch (err) {
      console.error("Error fetching cases:", err)
      setSnackbar({
        open: true,
        message: "Failed to load cases data",
        severity: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handler for selection change
  const handleSelectionModelChange = (newSelection) => {
    setSelectedRowIds(newSelection)
    console.log("Selected IDs:", newSelection) // Optional: for debugging
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Fixed employee selection handler
  const handleEmployeeSelectChange = (event) => {
    const selectedValue = event.target.value
    console.log("Employee selection changed:", selectedValue)
    setSelectedEmployee(selectedValue)
    setPage(1) // Reset to first page when filter changes
  }
  const handleServiceSelectChange = (event) => {
    const selectedValue = event.target.value
    console.log("Service selection changed:", selectedValue)
    setSelectedService(selectedValue)
    setPage(1) // Reset to first page when filter changes
  }

  // Fixed status change handler
  const handleStatusChange = (event) => {
    const selectedValue = event.target.value
    console.log("Status change event:", selectedValue)
    setStatus(selectedValue)
    setPage(1) // Reset to first page when filter changes
  }
  const handleDateRangeChange = (event) => {
    const selectedValue = event.target.value
    console.log("Date range change event:", selectedValue)
    setDateRange(selectedValue)
    setPage(1) // Reset to first page when filter changes
  }

  // Function to generate string-based colors
  const stringToColor = (string) => {
    if (!string) return "#1976d2"

    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = "#"
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }

    return color
  }

  // Stats cards data
  const stats = [
    {
      label: "Total Cases",
      value: counts.totalCases || 0,
      icon: <Icon icon="tabler:clipboard-list" fontSize={24} />,
      textColor: "#1A237E",
      bgColor: "#E3F2FD",
      borderColor: "#90CAF9",
    },
    {
      label: "UnAllocated Cases",
      value: counts.pendingCases || 0,
      icon: <Icon icon="tabler:hourglass" fontSize={24} />,
      textColor: "#6A1B9A",
      bgColor: "#F3E5F5",
      borderColor: "#CE93D8",
    },
    {
      label: "Allocated Cases",
      value: counts.wipCases || 0,
      icon: <Icon icon="tabler:message-question" fontSize={24} />,
      textColor: "#FF6F00",
      bgColor: "#FFF3E0",
      borderColor: "#FFCC80",
    },
  ]

  // Function to generate dynamic columns from initFields
  const generateDynamicColumns = (sampleRow) => {
    if (!sampleRow?.initFields || !Array.isArray(sampleRow.initFields)) {
      return []
    }

    return sampleRow.initFields.map((field, index) => ({
      field: `initField_${index}`, // Unique field identifier
      headerName: `${field.fieldName.replace(/_/g, ' ')}`,
      minWidth: 150,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon={getIconForDataType(field.dataType)} fontSize="small" />
          <Typography variant="subtitle2">{field.fieldName.replace(/_/g, ' ')}</Typography>
        </Box>
      ),
      renderCell: (params) => {
        const fieldValue = params.row.initFields?.[index]?.value
        return (
          <Tooltip title={formatFieldValue(fieldValue, field.dataType) || "N/A"}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
              <Icon icon={getIconForDataType(field.dataType)} fontSize="small" color="#0082c6" />
              <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                {renderFieldValue(fieldValue, field.dataType)}
              </Typography>
            </Box>
          </Tooltip>
        )
      },
    }))
  }

  // Helper function to get appropriate icon based on data type
  const getIconForDataType = (dataType) => {
    switch (dataType) {
      case "string":
        return "tabler:user-circle"
      case "file":
        return "tabler:file"
      case "multiUpload":
        return "tabler:files"
      case "textarea":
        return "tabler:info-circle"
      default:
        return "tabler:info-circle"
    }
  }

  // Helper function to format field values for display
  const formatFieldValue = (value, dataType) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return "N/A"
    }

    switch (dataType) {
      case "multiUpload":
        return Array.isArray(value) ? `${value.length} file(s)` : "N/A"
      case "file":
        return value ? "File uploaded" : "N/A"
      case "textarea":
      case "string":
      default:
        return String(value)
    }
  }

  // Helper function to render field values with appropriate styling
  const renderFieldValue = (value, dataType) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return (
        <Typography variant="body2" color="text.secondary" noWrap>
          N/A
        </Typography>
      )
    }

    switch (dataType) {
      case "multiUpload":
        return <MultiUploadComponent value={value} />

      case "file":
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {/* <Icon icon="tabler:file" fontSize="small" color="#0082c6" /> */}
            <Typography variant="body2" noWrap>
              {value ? "File uploaded" : "N/A"}
            </Typography>
          </Box>
        )

      case "textarea":
        return (
          <Typography
            variant="body2"
            noWrap
            sx={{
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {String(value)}
          </Typography>
        )

      case "string":
      default:
        return (
          <Typography variant="body2" noWrap>
            {String(value)}
          </Typography>
        )
    }
  }

  // DataGrid columns
  const columns = [
    {
      field: "partnerName",
      headerName: "Client Name",
      minWidth: 180,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:user-circle" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.row.partnerName || "N/A"}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: "0.875rem",
                bgcolor: stringToColor(params.row.partnerName || ""),
              }}
            >
              {params.row.partnerName ? params.row.partnerName.charAt(0).toUpperCase() : "?"}
            </Avatar>
            <Typography variant="body2" noWrap>
              {params.row.partnerName || "N/A"}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      minWidth: 180,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:file" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.row.serviceName || "N/A"}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: "0.875rem",
                bgcolor: stringToColor(params.row.serviceName || ""),
              }}
            >
              {params.row.serviceName ? params.row.serviceName.charAt(0).toUpperCase() : "?"}
            </Avatar>
            <Typography variant="body2" noWrap>
              {params.row.serviceName || "N/A"}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    ...(rows.length > 0 ? generateDynamicColumns(rows[0]) : []),
    {
      field: "createdAt",
      headerName: "Initiation Date",
      minWidth: 130,
      flex: 0.8,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:calendar-check" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => {
        const dateStr = params.row.createdAt || ""
        let formattedDate = "N/A"
        if (dateStr) {
          try {
            const date = new Date(dateStr.replace(/ (AM|PM)$/, ""))
            formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "Invalid Date"
          } catch (e) {
            formattedDate = "Invalid Date"
          }
        }
        return (
          <Tooltip title={formattedDate}>
            <Typography variant="body2" noWrap>
              {formattedDate}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      field: "doneBy",
      headerName: "Cases Added By",
      minWidth: 150,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:user-check" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.row.doneBy || "N/A"}>
          <Typography variant="body2" noWrap>
            {params.row.doneBy || "N/A"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "officeEmp",
      headerName: "Allocated To",
      minWidth: 150,
      flex: 1,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:user-check" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.row.officeEmp || "N/A"}>
          <Typography variant="body2" noWrap>
            {params.row.officeEmp || "N/A"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 120,
      flex: 0.7,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="tabler:edit" fontSize="small" />
          <Typography variant="subtitle2">{params.colDef.headerName}</Typography>
        </Box>
      ),
      renderCell: (params) => {
        return (
          <IconButton
            size="small"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation()
              handleOpen(params.row)
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        )
      },
    },
  ]

  const handleCustomCsvExport = () => {
    try {
      // Get all visible columns
      const visibleColumns = columns.filter((col) => col.field !== "action") // Exclude action column

      // Create CSV headers
      const headers = visibleColumns.map((col) => col.headerName || col.field)

      // Create CSV data
      const csvData = rows.map((row) => {
        return visibleColumns.map((col) => {
          if (col.field.startsWith("initField_")) {
            // Handle dynamic fields
            const index = Number.parseInt(col.field.split("_")[1])
            return row.initFields?.[index]?.value || "N/A"
          } else {
            // Handle static fields
            return row[col.field] || "N/A"
          }
        })
      })

      // Combine headers and data
      const csvContent = [headers, ...csvData]

      // Convert to CSV string
      const csvString = csvContent
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n")

      // Download CSV
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `cases_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting CSV:", error)
    }
  }

  const CustomToolbar = () => {
    const theme = useTheme()

    return (
      <GridToolbarContainer
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          gap: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        {/* <GridToolbarExport /> */}
        {/* Optional: Add custom export button */}
        <Button
          size="small"
          variant="outlined"
          startIcon={<Icon icon="tabler:download" />}
          onClick={handleCustomCsvExport}
          sx={{ color: "primary.main", borderColor: "primary.main", "&:hover": { borderColor: "primary.dark" } }}
        >
          CSV Export
        </Button>
      </GridToolbarContainer>
    )
  }

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="fixed"
          top={0}
          left={0}
          width={"100%"}
          height={"100%"}
          bgcolor="rgba(255, 255, 255, 0.8)"
          zIndex={1300}
          sx={{
            backdropFilter: "blur(4px)",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
            }}
          >
            <CircularProgress color="primary" size={60} thickness={4} sx={{ mb: 2 }} />
            <Typography variant="h6" color="primary">
              Loading Data...
            </Typography>
          </Paper>
        </Box>
      )}

      <Box sx={{ width: "100%", p: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Card
          elevation={3}
          sx={{
            width: "100%",
            background: "linear-gradient(135deg, #9180ff, rgb(63, 194, 255))",
            borderRadius: 2,
            padding: { xs: "16px 12px", sm: "20px 16px" },
            boxShadow: "0 4px 20px rgba(0, 130, 198, 0.25)",
            mb: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              opacity: 0.1,
              backgroundImage: "radial-gradient(circle, #ffffff 2px, transparent 3px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Title */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: { xs: "center", md: "space-between" },
              width: "100%",
              gap: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: "bold",
                color: "white",
                textAlign: { xs: "center", md: "left" },
                textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)",
                letterSpacing: "0.5px",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              ADD CASES DASHBOARD
            </Typography>
          </Box>
        </Card>

        {/* Filter Content */}
        <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
          <Grid
            container
            spacing={3}
            sx={{
              width: "100%",
              justifyContent: "center",
              marginLeft: "0 auto",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {/* Partner Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}>
                Client
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  width: "100%",
                  maxWidth: { xs: "100%", sm: "400px" },
                }}
              >
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedEmployee}
                    onChange={handleEmployeeSelectChange}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected === "all") return "All Clients"
                      if (selected === "") return "All clients"
                      const partner = partners.find((p) => p.partnerId === selected)
                      return partner?.partner?.name || "Select Client"
                    }}
                    sx={{
                      height: 42,
                      borderRadius: 1.5,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiSelect-select": {
                        pl: 1.5,
                        display: "flex",
                        alignItems: "center",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    startAdornment={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ml: 0.75,
                          mr: 1,
                        }}
                      >
                        <Icon icon="tabler:users" color="#0082c6" fontSize="small" />
                      </Box>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, marginTop: 8 },
                        elevation: 2,
                        sx: {
                          "& .MuiMenuItem-root": {
                            py: 0.75,
                            px: 2,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="all" sx={{ fontWeight: 500 }}>
                      All Clients
                    </MenuItem>
                    {partners.map((partner) => (
                      <MenuItem key={partner._id} value={partner.partnerId}>
                        {partner.partner?.name || "Client not available"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Service Section*/}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}>
                Service
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  width: "100%",
                  maxWidth: { xs: "100%", sm: "400px" },
                }}
              >
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedService}
                    onChange={handleServiceSelectChange}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected === "all") return "All Services"
                      if (selected === "") return "All Services"
                      const service = services.find((p) => p._id === selected)
                      return service?.serviceName || "Select Service"
                    }}
                    sx={{
                      height: 42,
                      borderRadius: 1.5,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiSelect-select": {
                        pl: 1.5,
                        display: "flex",
                        alignItems: "center",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    startAdornment={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ml: 0.75,
                          mr: 1,
                        }}
                      >
                        <Icon icon="tabler:report" color="#0082c6" fontSize="small" />
                      </Box>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, marginTop: 8 },
                        elevation: 2,
                        sx: {
                          "& .MuiMenuItem-root": {
                            py: 0.75,
                            px: 2,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontWeight: 500 }}>
                      All Services
                    </MenuItem>
                    {services.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.serviceName || "Service not available"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Date Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}>
                Date Range
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  width: "100%",
                  maxWidth: { xs: "100%", sm: "400px" },
                }}
              >
                <FormControl fullWidth size="small">
                  <Select
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected === "") return "Select Date Range"
                      if (selected === "today") return "Today"
                      if (selected === "thisWeek") return "This Week"
                      if (selected === "thisMonth") return "This Month"
                      if (selected === "custom") return "Custom Range"
                      return selected
                    }}
                    sx={{
                      height: 42,
                      borderRadius: 1.5,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiSelect-select": {
                        pl: 1.5,
                        display: "flex",
                        alignItems: "center",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    startAdornment={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ml: 0.75,
                          mr: 1,
                        }}
                      >
                        <Icon icon="tabler:calendar" color="#0082c6" fontSize="small" />
                      </Box>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, marginTop: 8 },
                        elevation: 2,
                        sx: {
                          "& .MuiMenuItem-root": {
                            py: 0.75,
                            px: 2,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="today" sx={{ fontWeight: 500 }}>
                      Today
                    </MenuItem>
                    <MenuItem value="thisWeek" sx={{ fontWeight: 500 }}>
                      This Week
                    </MenuItem>
                    <MenuItem value="thisMonth" sx={{ fontWeight: 500 }}>
                      This Month
                    </MenuItem>
                    <MenuItem value="custom" sx={{ fontWeight: 500 }}>
                      Custom Range
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Custom Date Range Section - Now properly inside the Grid */}
            {dateRange === "custom" && (
              <Grid item xs={12} sm={12} md={4}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}>
                  Custom Date Range
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "400px" },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}>
                    <TextField
                      type="date"
                      fullWidth
                      size="small"
                      placeholder="Start Date"
                      value={startDateFilter}
                      onChange={(e) => {
                        setStartDateFilter(e.target.value)
                        setPage(1) // Reset page when filter changes
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ml: 0.75,
                              mr: 1,
                            }}
                          >
                            <Icon icon="tabler:calendar" color="#0082c6" fontSize="small" />
                          </Box>
                        ),
                        sx: {
                          height: 42,
                          borderRadius: 1.5,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.1)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    />
                    <TextField
                      type="date"
                      fullWidth
                      size="small"
                      placeholder="End Date"
                      value={endDateFilter}
                      onChange={(e) => {
                        setEndDateFilter(e.target.value)
                        setPage(1) // Reset page when filter changes
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ml: 0.75,
                              mr: 1,
                            }}
                          >
                            <Icon icon="tabler:calendar" color="#0082c6" fontSize="small" />
                          </Box>
                        ),
                        sx: {
                          height: 42,
                          borderRadius: 1.5,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.1)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Quick date selectors */}
          <Box
            sx={{
              mt: 3.5,
              mb: 3.5,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary", mr: 1, fontWeight: 500 }}>
              Quick filters:
            </Typography>
            <Chip
              label="Today"
              size="small"
              onClick={() => {
                const today = new Date().toISOString().split("T")[0]
                setDateRange("today")
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                bgcolor: alpha("#0082c6", 0.08),
                color: "#0082c6",
                "&:hover": { bgcolor: alpha("#0082c6", 0.15) },
              }}
            />
            <Chip
              label="This Week"
              size="small"
              onClick={() => {
                setDateRange("thisWeek")
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                bgcolor: alpha("#0082c6", 0.08),
                color: "#0082c6",
                "&:hover": { bgcolor: alpha("#0082c6", 0.15) },
              }}
            />
            <Chip
              label="This Month"
              size="small"
              onClick={() => {
                setDateRange("thisMonth")
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                bgcolor: alpha("#0082c6", 0.08),
                color: "#0082c6",
                "&:hover": { bgcolor: alpha("#0082c6", 0.15) },
              }}
            />
            <Chip
              label="Clear dates"
              size="small"
              variant="outlined"
              onClick={() => {
                setDateRange("")
                setStartDateFilter("")
                setEndDateFilter("")
                setPage(1)
              }}
              sx={{
                borderRadius: 1,
                borderColor: "divider",
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
            />
          </Box>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            p: 3,
            gap: 3,
            flexWrap: "nowrap",
          }}
        >
          {stats.map((stat, index) => (
            <Box key={index} sx={{ flex: 1 }}>
              <Card
                elevation={0}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: { xs: 1, sm: 1.5, md: 2 },
                  borderRadius: { xs: 1, sm: 2 },
                  backgroundColor: stat.bgColor,
                  border: `1px solid ${stat.borderColor}`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  width: "100%",
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: alpha(stat.textColor, 0.2),
                    color: stat.textColor,
                    width: { xs: 36, sm: 42, md: 48 },
                    height: { xs: 36, sm: 42, md: 48 },
                    mr: { xs: 1.5, sm: 2 },
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box sx={{ overflow: "hidden" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: stat.textColor,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                    noWrap
                  >
                    {stat.label || "Stats"}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: stat.textColor,
                      fontWeight: 600,
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                    }}
                    noWrap
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Data Grid Section */}
        <Card
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#0082c6",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon icon="tabler:report" fontSize="1.25rem" />
            Reporting ({rows.length} records)
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              size="large"
              variant="outlined"
              startIcon={<Icon icon="tabler:upload" />}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "500",
              }}
              onClick={handleOpenExcel}
            >
              Upload Excel
            </Button>
            <Button size="large" variant="outlined" onClick={handleAdd} color="primary" startIcon={<AddIcon />}>
              Add Cases
            </Button>
          </Box>
        </Card>

        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            height: { xs: 500, md: 600 },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row._id || Math.random().toString()}
            disableSelectionOnClick={false}
            disableColumnMenu={isMobile}
            slots={{
              toolbar: CustomToolbar,
              Footer: () => (
                <TablePagination
                  component="div"
                  count={totalCount}
                  page={page - 1}
                  onPageChange={handlePageChange}
                  rowsPerPage={pageLimit}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[100, 200, 500, 1000, 2000, 5000]}
                />
              ),
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    p: 3,
                  }}
                >
                  <Icon icon="tabler:database-off" fontSize={48} sx={{ color: "text.secondary", mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Data Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or date range
                  </Typography>
                </Box>
              ),
            }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#9180ff",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "8px 8px 0 0",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                backgroundColor: "aliceblue",
              },
              "& .MuiDataGrid-cell": {
                fontSize: "14px",
                padding: "8px 16px",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: alpha("#0082c6", 0.04),
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: alpha("#0082c6", 0.08),
                transition: "background-color 0.2s ease",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: alpha("#0082c6", 0.12),
                "&:hover": {
                  backgroundColor: alpha("#0082c6", 0.16),
                },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid rgba(224, 224, 224, 0.4)",
                backgroundColor: alpha("#0082c6", 0.04),
              },
              "& .MuiTablePagination-root": {
                color: "#0082c6",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                backgroundColor: alpha("#0082c6", 0.3),
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: alpha("#0082c6", 0.5),
                },
              },
              border: "none",
            }}
          />
        </Card>

        {/* Excel Upload Modal */}
        <Modal
          open={openExcel}
          handleClose={handleCloseExcel}
          title="Upload Excel"
          maxWidth="xs"
          fullWidth={true}
          handleSubmit={handleExcelSubmit}
          submitButtonText="Upload"
        >
          <Grid container spacing={2} sx={{ p: 3 }}>
            <Grid item xs={12}>
              <CustomTextField
                label="Select Client"
                name="partner"
                fullWidth
                value={excelData.partnerId || ""}
                onChange={(e) => {
                  setExcelData({ ...excelData, partnerId: e.target.value })
                }}
                select
                variant="outlined"
                sx={{ background: "#fff" }}
              >
                {partners?.map((partner) => (
                  <MenuItem key={partner?.partner?._id} value={partner?.partner?._id}>
                    {partner?.partner?.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label="Select Service"
                name="service"
                fullWidth
                value={excelData.serviceId || ""}
                onChange={(e) => {
                  setExcelData({ ...excelData, serviceId: e.target.value })
                }}
                select
                variant="outlined"
                sx={{ background: "#fff" }}
              >
                {services?.map((service) => (
                  <MenuItem key={service?._id} value={service?._id}>
                    {service?.serviceName}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "2px dashed #6366F1",
                  borderRadius: 1,
                  p: 4,
                  textAlign: "center",
                  backgroundColor: "#F5F7FF",
                  my: 2,
                }}
              >
                <input
                  accept=".xlsx,.xls,.csv"
                  id="excel-file-upload"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0]

                    if (file) {
                      const fileExt = file.name.split(".").pop().toLowerCase()

                      if (fileExt === "xlsx" || fileExt === "xls" || fileExt === "csv") {
                        console.log("File selected:", file)
                        setExcelData({ ...excelData, documents: file })
                      } else {
                        e.target.value = ""
                        alert("Please select only Excel files (.xlsx or .xls)")
                        setSnackbar({
                          open: true,
                          message: "Please select only Excel files (.xlsx or .xls)",
                          severity: "error",
                        })
                        setTimeout(() => {
                          setSnackbar({ ...snackbar, open: false })
                        }, 3000)
                      }
                    }
                  }}
                  style={{ display: "none" }}
                />

                {!excelData.documents ? (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "#E0E7FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#6366F1",
                        }}
                      >
                        <CloudUploadIcon />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Drag your file to upload
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      OR
                    </Typography>

                    <label htmlFor="excel-file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        color="primary"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          px: 2,
                          py: 0.5,
                          textTransform: "none",
                          borderColor: "#6366F1",
                          color: "#6366F1",
                        }}
                      >
                        Browse files
                      </Button>
                    </label>
                  </>
                ) : (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      File selected: <strong>{excelData.documents.name}</strong>
                    </Typography>
                    <Button variant="outlined" color="error" size="small" onClick={handleRemoveFile} sx={{ mt: 1 }}>
                      Remove
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                {excelData.partnerId
                  ? "Please ensure the Excel file is in the correct format."
                  : "Please select a partner to enable the download Excel."}
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => (excelData.partnerId ? handleDownloadSampleExcel(excelData.partnerId) : null)}
                disabled={!excelData.partnerId && !excelData.serviceId}
                sx={{ mt: 2, mr: 2 }}
              >
                Download Sample Excel
              </Button>
            </Grid>
          </Grid>
        </Modal>

        {/* Add new cases Modal */}
        <Modal open={openAdd} handleClose={handleCloseAdd} handleSubmit={handleSubmit} title="Add New Case">
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: "#64748b", mb: 3, fontSize: "16px", fontWeight: "400" }}>
              Enter details to create a new case record.
            </Typography>

            {/* File Upload Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "500", color: "#374151" }}>
                Document Upload
              </Typography>

              {!uploadedFile ? (
                <Box
                  ref={uploadAreaRef}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  sx={{
                    border: dragActive || pasteActive ? "2px dashed #3b82f6" : "2px dashed #d1d5db",
                    borderRadius: "12px",
                    p: 4,
                    textAlign: "center",
                    backgroundColor: dragActive || pasteActive ? "#eff6ff" : "#f9fafb",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#3b82f6",
                      backgroundColor: "#eff6ff",
                    },
                    ...(pasteActive && {
                      transform: "scale(1.02)",
                      boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
                    }),
                  }}
                >
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    id="upload-input"
                    onChange={handleFileInputChange}
                    style={{ display: "none" }}
                  />

                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundColor: pasteActive ? "#dbeafe" : "#e0f2fe",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0284c7",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: 24 }} />
                    </Box>

                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: "500", color: "#374151", mb: 0.5 }}>
                        {pasteActive ? "Pasting image..." : "Drag and drop your file here"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                        or click to browse files
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#8b5cf6", fontWeight: "500", mb: 2 }}>
                        or press Ctrl+V to paste an image
                      </Typography>

                      <label htmlFor="upload-input">
                        <Button
                          variant="outlined"
                          component="span"
                          sx={{
                            borderRadius: "8px",
                            px: 3,
                            py: 1,
                            textTransform: "none",
                            fontWeight: "500",
                            borderColor: "#3b82f6",
                            color: "#3b82f6",
                            "&:hover": {
                              backgroundColor: "#3b82f6",
                              color: "#fff",
                            },
                          }}
                        >
                          Choose File
                        </Button>
                      </label>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                        Supports: JPG, PNG, PDF (Max 10MB)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    p: 3,
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {uploadedFile?.type?.includes("pdf") ? (
                        <PictureAsPdfIcon sx={{ color: "#dc2626", fontSize: 32 }} />
                      ) : (
                        <ImageIcon sx={{ color: "#2563eb", fontSize: 32 }} />
                      )}

                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#374151" }}>
                          {uploadedFile.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          File uploaded successfully
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => window.open(uploadedFile.url, "_blank")}
                        sx={{ color: "#3b82f6" }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small" onClick={handleFileRemove} sx={{ color: "#dc2626" }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              )}

              {(uploadedFile ||
                initFields?.some((field, index) => {
                  const fieldKey = field.fieldName || `field_${index}`
                  const fieldValue = fieldValues[fieldKey]
                  return (
                    (field.dataType === "file" && fieldValue) ||
                    (field.dataType === "multiUpload" && Array.isArray(fieldValue) && fieldValue.length > 0)
                  )
                })) && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    onClick={handleRunAiExtraction}
                    disabled={loading}
                    sx={{
                      borderRadius: "8px",
                      px: 4,
                      py: 1.5,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      textTransform: "none",
                      fontWeight: "500",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                      "&:hover": {
                        boxShadow: "0 6px 16px rgba(102, 126, 234, 0.6)",
                      },
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={16} sx={{ color: "#fff" }} />
                        Processing...
                      </Box>
                    ) : (
                      "💡Extract with AI"
                    )}
                  </Button>
                </Box>
              )}
            </Box>

            {pasteActive && (
              <Box
                sx={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(59, 130, 246, 0.9)",
                  color: "white",
                  px: 3,
                  py: 2,
                  borderRadius: "8px",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: "500" }}>
                  Processing pasted image...
                </Typography>
              </Box>
            )}

            {/* Form Fields */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  select
                  label="Client Name"
                  placeholder="Select Client"
                  value={formData.partnerId}
                  onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  {partners?.map((partner) => (
                    <MenuItem key={partner.partner?._id } value={partner.partner?._id}>
                      {partner.partner?.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  select
                  label="Select Service"
                  placeholder="Select Service"
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  {services?.map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.serviceName}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              {initFields.map((field, index) => (
                <Grid item xs={12} sm={field.sm || 6} key={index}>
                  {renderField(field, index)}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Modal>

        {/* Update Cases Modal */}
        <Modal open={open} handleClose={handleClose} handleSubmit={handleUpdate} title="Update Case">
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: "#64748b", mb: 3, fontSize: "16px", fontWeight: "400" }}>
              Update case record details.
            </Typography>

            {/* Form Fields */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  select
                  label="Client Name"
                  placeholder="Select Client"
                  value={selectedAddCases.partnerId || ""}
                  onChange={(e) => setSelectedAddCases({ ...selectedAddCases, partnerId: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  {partners?.map((partner) => (
                    <MenuItem
                      key={partner.partner?._id || partner?._id}
                      value={partner.partner?._id || partner.partnerId}
                    >
                      {partner.partner?.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  select
                  label="Select Service"
                  placeholder="Select Service"
                  value={selectedAddCases.serviceId || ""}
                  onChange={(e) =>
                    setSelectedAddCases({
                      ...selectedAddCases,
                      serviceId: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  {services?.map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.serviceName}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              {/* Render dynamic fields from initFields */}
              {selectedAddCases.initFields &&
                selectedAddCases.initFields.map((field, index) => (
                  <Grid item xs={12} sm={field.sm || 6} key={index}>
                    {renderEditField(field, index)}
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Modal>
      </Box>
      {/* Snackbar for notifications */}
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
    </>
  )
}

export default PDDashboard
