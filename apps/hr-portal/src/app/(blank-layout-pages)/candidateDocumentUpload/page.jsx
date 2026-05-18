"use client"
import React, { useRef, useState, useEffect } from "react"
import { useApi } from "@core/hooks/useApi" // Assuming this hook is available
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"
import Fade from "@mui/material/Fade"
import LinearProgress from "@mui/material/LinearProgress"
import { styled, keyframes } from "@mui/material/styles"
import Chip from "@mui/material/Chip"
import { useSearchParams } from "next/navigation"

// Modern animations
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(63, 81, 181, 0.4);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(63, 81, 181, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(63, 81, 181, 0);
  }
`
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`
const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

// Styled components with modern design
const ModernContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  animation: `${slideUp} 0.6s ease-out`,
}))

const GlassmorphismPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: 24,
  transition: "all 0.3s ease",
  width: "100%",
}))

const DocumentCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "uploaded" && prop !== "uploading",
})(({ theme, uploaded, uploading }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  background: uploaded
    ? "linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%)"
    : uploading
      ? "linear-gradient(135deg, #fff3e0 0%, #fff8f0 100%)"
      : "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
  border: uploaded ? "2px solid #4caf50" : uploading ? "2px solid #ff9800" : "2px solid #e3f2fd",
  borderRadius: 20,
  padding: theme.spacing(3),
  minHeight: 200,
  maxWidth: 300,
  width: 240,
  gap: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  animation: `${scaleIn} 0.4s ease-out`,
  "&:hover": {
    transform: "translateY(-8px) scale(1.03)",
    boxShadow: "0 16px 32px rgba(0,0,0,0.15)",
    borderColor: uploaded ? "#4caf50" : "#3f51b5",
  },
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: uploaded
      ? "linear-gradient(90deg, #4caf50, #8bc34a)"
      : uploading
        ? "linear-gradient(90deg, #ff9800, #ffc107)"
        : "linear-gradient(90deg, #3f51b5, #5c6bc0)",
    transform: uploaded || uploading ? "scaleX(1)" : "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.3s ease",
  },
}))

const ModernButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
    background: "linear-gradient(135deg, #5a67d8 0%, #6b4998 100%)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}))

const UploadButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 500,
  padding: theme.spacing(1, 2.5),
  border: "2px solid #e0e7ff",
  background: "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
  color: "#4f46e5",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#4f46e5",
    background: "linear-gradient(135deg, #eef2ff 0%, #f8faff 100%)",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
  },
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  fontSize: 18,
  fontWeight: 700,
  padding: theme.spacing(2, 4),
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 32px rgba(102, 126, 234, 0.5)",
    background: "linear-gradient(135deg, #5a67d8 0%, #6b4998 100%)",
  },
  "&:active": {
    transform: "translateY(-1px)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
    transition: "left 0.5s ease",
  },
  "&:hover::before": {
    left: "100%",
  },
}))

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  background: "rgba(0,0,0,0.1)",
  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  },
}))

const FilePreview = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1),
  background: "linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%)",
  borderRadius: 8,
  border: "1px solid #e0e7ff",
  margin: theme.spacing(1, 0),
  gap: theme.spacing(1),
  transition: "all 0.3s ease",
  minHeight: 40,
  "&:hover": {
    background: "linear-gradient(135deg, #e8f2ff 0%, #dbeafe 100%)",
    transform: "scale(1.02)",
  },
}))

export default function CandidateDocumentUpload() {
  const searchParams = useSearchParams()
  const candidateId = searchParams.get("candidateId")
  const organizationId = searchParams.get("organizationId")

  console.log("organization id--", organizationId)
  console.log("candidate id -- ", candidateId)

  const [templateId, setTemplateId] = useState("")
  const { callApi, loading } = useApi() // Assuming useApi is correctly implemented
  const [documentOptions, setDocumentOptions] = useState([])
  const [fieldMap, setFieldMap] = useState({})
  const [files, setFiles] = useState({})
  const [uploading, setUploading] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [alert, setAlert] = useState({ open: false, type: "success", message: "" })

  // Use a Map to store refs, keyed by document name for stable access
  const fileInputRefs = useRef(new Map())

  const [uploadedDocuments, setUploadedDocuments] = useState([])

  // Create a reverse map: fieldId -> fieldName
  const fieldIdToName = React.useMemo(() => {
    const map = {}
    Object.entries(fieldMap).forEach(([name, id]) => {
      map[id] = name
    })
    return map
  }, [fieldMap])

  // Map uploaded documents by fieldId for quick lookup
  const uploadedByFieldId = React.useMemo(() => {
    const map = {}
    uploadedDocuments.forEach((doc) => {
      if (doc.fieldId) map[doc.fieldId] = doc
    })
    return map
  }, [uploadedDocuments])

  // Fetches document options and template ID for the candidate from the API
  useEffect(() => {
    const fetchDocumentOptions = async () => {
      const result = await callApi({
        endpoint: `/v1/api/documentFormTemplate/candidatDocumentForm?candidateId=${candidateId}`,
        method: "GET",
        disableSnackbar: true,
      })
      console.log("get Document", result)
      if (result.success && result.data?.items?.fields) {
        setTemplateId(result.data.items._id)
        const activeFields = Array.isArray(result.data.items.fields)
          ? result.data.items.fields.filter((field) => field.isActive)
          : []
        setDocumentOptions(activeFields.map((field) => field.fieldName))
        const map = {}
        activeFields.forEach((field) => {
          map[field.fieldName] = field._id
        })
        setFieldMap(map)
      }
    }
    fetchDocumentOptions()
  }, [callApi, candidateId])

  // Triggers file input click for a specific document
  const handleIconClick = (docName) => {
    const inputElement = fileInputRefs.current.get(docName)
    if (inputElement) {
      inputElement.click()
    } else {
      console.warn(`File input ref for document '${docName}' is not available.`)
    }
  }

  // Handles file selection for a document
  const handleFileChange = (docName, e) => {
    const file = e.target.files[0]
    if (file) {
      setFiles((prev) => ({ ...prev, [docName]: file }))
      setUploadedFiles((prev) => ({ ...prev, [docName]: false }))
    }
  }

  // Removes a selected file and resets the file input
  const handleFileRemove = (docName) => {
    setFiles((prev) => {
      const newFiles = { ...prev }
      delete newFiles[docName]
      return newFiles
    })
    setUploadedFiles((prev) => {
      const newUploaded = { ...prev }
      delete newUploaded[docName]
      return newUploaded
    })
    // Reset the file input value so the same file can be selected again
    const inputElement = fileInputRefs.current.get(docName)
    if (inputElement) {
      inputElement.value = ""
    }
  }

  // Uploads a single file to the server and returns the file URL
  const uploadFile = async (file, type) => {
    const formData = new FormData()
    formData.append("file", file)
    try {
      setUploading((prev) => ({ ...prev, [type]: true }))
      const result = await callApi({
        endpoint: "/v1/api/upload/uploadSingle",
        method: "POST",
        data: formData,
        disableSnackbar: true,
        headers: {
          // authorization: token // Uncomment if token is needed
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploading((prev) => ({ ...prev, [`${type}Progress`]: percentCompleted }))
        },
      })
      if (result.success && result.data?.url) {
        setUploadedFiles((prev) => ({ ...prev, [type]: true }))
        return result.data.url
      } else {
        return null
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      return null
    } finally {
      setUploading((prev) => {
        const newState = { ...prev }
        delete newState[type]
        delete newState[`${type}Progress`]
        return newState
      })
    }
  }

  // Fetch uploaded documents for the candidate
  const fetchUploadedDocuments = async () => {
    if (!candidateId) return
    const result = await callApi({
      endpoint: `/v1/api/documentValueTemplate/detail?candidateId=${candidateId}`,
      method: "GET",
      disableSnackbar: true,
    })
    console.log("uploaded doc", result)
    // Try to extract documents from result
    if (result.success && result.data?.items?.values) {
      setUploadedDocuments(result.data.items.values)
    } else {
      setUploadedDocuments([])
    }
  }

  // Fetch on mount and when candidateId changes
  useEffect(() => {
    fetchUploadedDocuments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId])

  // Handles form submission: uploads all files and submits document values
  const handleSubmit = async (e) => {
    e.preventDefault()
    setAlert({ open: false, type: "success", message: "" })
    const filesToUpload = Object.keys(files)

    // Check if all required documents are selected
    const missingDocs = documentOptions.filter((doc) => !files[doc])

    // If all documents are already uploaded and no new files are selected, show error
    const allUploaded = documentOptions.every((doc) => {
      const fieldId = fieldMap[doc]
      return fieldId && uploadedByFieldId[fieldId] && !files[doc]
    })

    if (allUploaded && filesToUpload.length === 0) {
      // Added check for no new files selected
      setAlert({
        open: true,
        type: "error",
        message: "All documents are already uploaded. No new files to upload.",
      })
      return
    }

    if (missingDocs.length > 0 && filesToUpload.length < documentOptions.length) {
      // Refined condition
      setAlert({
        open: true,
        type: "error",
        message: `Please upload all required documents: ${missingDocs.join(", ")}`,
      })
      return
    }

    const values = []
    const failedDocs = []
    for (const doc of documentOptions) {
      const file = files[doc]
      // Only attempt to upload if a new file is selected for this document
      if (file) {
        const url = await uploadFile(file, doc)
        if (!url) {
          failedDocs.push(doc)
        } else {
          values.push({
            fieldId: fieldMap[doc],
            document: url,
          })
        }
      } else if (fieldMap[doc] && uploadedByFieldId[fieldMap[doc]]) {
        // If no new file is selected, but a document was already uploaded, include its existing URL
        values.push({
          fieldId: fieldMap[doc],
          document: uploadedByFieldId[fieldMap[doc]].document,
        })
      }
    }

    if (failedDocs.length > 0) {
      setAlert({
        open: true,
        type: "error",
        message: `Failed to upload files for: ${failedDocs.join(", ")}. Please try again.`,
      })
      return
    }

    const payload = {
      templateId,
      candidateId,
      organizationId,
      values,
    }
    console.log("payload 12", payload)

    // Add the documents
    const result = await callApi({
      endpoint: "/v1/api/documentValueTemplate/add",
      method: "POST",
      data: payload,
    })

    console.log("resultadf", result)

    if (result.success) {
      setFiles({})
      setUploading({})
      setUploadedFiles({})
      setAlert({ open: true, type: "success", message: "Documents uploaded successfully!" }) // Success alert
      // Fetch uploaded documents after successful upload
      fetchUploadedDocuments()
    } else {
      setAlert({ open: true, type: "error", message: result.message || "Failed to upload documents." })
    }
  }

  const totalFiles = Object.keys(files).length
  const uploadedCount = Object.values(uploadedFiles).filter(Boolean).length

  return (
    <ModernContainer>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 2,
            letterSpacing: "-0.02em",
          }}
        >
          Documentation
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#64748b",
            fontWeight: 400,
            mb: 4,
          }}
        >
          To complete your job application, please upload the documents requested by our recruitment team.
        </Typography>
        {totalFiles > 0 && (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}>
            <Chip
              label={`${totalFiles} Selected`}
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                background: "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
              }}
            />
            <Chip
              label={`${uploadedCount} Uploaded`}
              color="success"
              variant="outlined"
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                background: "linear-gradient(135deg, #f0f9f0 0%, #ffffff 100%)",
              }}
            />
          </Box>
        )}
      </Box>
      <GlassmorphismPaper>
        <Box component="form" onSubmit={handleSubmit} sx={{ height: "75vh" }}>
          {alert.open && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Fade in={alert.open}>
                <Alert
                  severity={alert.type === "error" ? "warning" : alert.type}
                  onClose={() => setAlert({ ...alert, open: false })}
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    maxWidth: 400,
                    minWidth: 250,
                    backgroundColor: alert.type === "error" ? "#fdecea" : undefined,
                    color: alert.type === "error" ? "#b71c1c" : undefined,
                    "& .MuiAlert-icon": {
                      color: alert.type === "error" ? "#b71c1c" : undefined,
                      fontSize: 24,
                    },
                  }}
                >
                  {alert.message}
                </Alert>
              </Fade>
            </Box>
          )}
          {loading && documentOptions.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
              <CircularProgress size={40} sx={{ color: "#667eea" }} />
              <Typography sx={{ ml: 3, color: "#64748b", fontSize: 16 }}>Loading document requirements...</Typography>
            </Box>
          ) : documentOptions.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <InsertDriveFileIcon sx={{ fontSize: 60, color: "#cbd5e1", mb: 2 }} />
              <Typography sx={{ color: "#64748b", fontSize: 18, fontStyle: "italic" }}>
                No documents currently required
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(5, 1fr)",
                  xl: "repeat(6, 1fr)",
                },
                gap: 3,
                mb: 4,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {documentOptions.map((doc) => (
                <DocumentCard
                  key={doc}
                  uploaded={uploadedFiles[doc] ? true : undefined}
                  uploading={uploading[doc] ? true : undefined}
                >
                  {/* Document Icon */}
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: uploadedFiles[doc]
                        ? "linear-gradient(135deg, #4caf50, #8bc34a)"
                        : uploading[doc]
                          ? "linear-gradient(135deg, #ff9800, #ffc107)"
                          : "linear-gradient(135deg, #667eea, #764ba2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                    }}
                  >
                    {uploadedFiles[doc] ? (
                      <CheckCircleIcon sx={{ color: "white", fontSize: 30 }} />
                    ) : (
                      <InsertDriveFileIcon sx={{ color: "white", fontSize: 30 }} />
                    )}
                  </Box>
                  {/* Document Title */}
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#1e293b",
                      mb: 2,
                      lineHeight: 1.2,
                      textAlign: "center",
                    }}
                  >
                    {doc}
                  </Typography>

                  <input
                    type="file"
                    ref={(el) => {
                      if (el) {
                        fileInputRefs.current.set(doc, el)
                      } else {
                        fileInputRefs.current.delete(doc)
                      }
                    }}
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(doc, e)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />

                  {/* Upload Button: only show if no uploaded doc or user is selecting a new file */}
                  {(!fieldMap[doc] || !uploadedByFieldId[fieldMap[doc]] || files[doc]) && (
                    <UploadButton
                      onClick={() => handleIconClick(doc)}
                      startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
                      disabled={uploading[doc]}
                      size="small"
                      sx={{
                        fontSize: 12,
                        py: 1,
                        px: 2,
                        minWidth: "auto",
                        mb: 1,
                      }}
                    >
                      {files[doc] ? "Change" : "Choose"}
                    </UploadButton>
                  )}
                  {/* File Preview (selected for upload) */}
                  {files[doc] && (
                    <FilePreview>
                      <Typography
                        sx={{
                          color: "#1e293b",
                          fontSize: 11,
                          fontWeight: 500,
                          cursor: "pointer",
                          maxWidth: "120px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          "&:hover": { color: "#4f46e5" },
                        }}
                        onClick={() => {
                          const fileUrl = URL.createObjectURL(files[doc])
                          window.open(fileUrl, "_blank", "noopener,noreferrer")
                        }}
                        title={files[doc].name}
                      >
                        {files[doc].name}
                      </Typography>
                      <IconButton
                        onClick={() => handleFileRemove(doc)}
                        size="small"
                        sx={{
                          color: "#ef4444",
                          p: 0.5,
                          "&:hover": { backgroundColor: "#fef2f2" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </FilePreview>
                  )}
                  {/* Uploaded Document Preview (if exists and not currently selected for upload) */}
                  {!files[doc] && fieldMap[doc] && uploadedByFieldId[fieldMap[doc]] && (
                    <FilePreview>
                      <Typography
                        sx={{
                          color: "#1e293b",
                          fontSize: 11,
                          fontWeight: 500,
                          maxWidth: "120px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={uploadedByFieldId[fieldMap[doc]].document?.split("/").pop()}
                      >
                        {uploadedByFieldId[fieldMap[doc]].document?.split("/").pop() || "View Document"}
                      </Typography>
                      <IconButton
                        component="a"
                        href={uploadedByFieldId[fieldMap[doc]].document}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{ color: "#4f46e5", p: 0.5, ml: 0.5 }}
                      >
                        <InsertDriveFileIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </FilePreview>
                  )}
                  {/* Upload Progress */}
                  {uploading[doc] && (
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <ProgressBar variant="determinate" value={uploading[`${doc}Progress`] || 0} sx={{ height: 6 }} />
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          color: "#4f46e5",
                          fontWeight: 600,
                          display: "block",
                          fontSize: 11,
                        }}
                      >
                        {uploading[`${doc}Progress`] || 0}%
                      </Typography>
                    </Box>
                  )}
                </DocumentCard>
              ))}
            </Box>
          )}
          <Box sx={{ textAlign: "center" }}>
            <SubmitButton
              type="submit"
              variant="contained"
              disabled={loading || Object.keys(uploading).some((key) => uploading[key] === true)}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                minWidth: 200,
                animation: totalFiles > 0 ? `${pulseGlow} 2s infinite` : "none",
              }}
            >
              {loading ? "Submitting..." : "Upload All Documents"}
            </SubmitButton>
          </Box>
        </Box>
      </GlassmorphismPaper>
    </ModernContainer>
  )
}
