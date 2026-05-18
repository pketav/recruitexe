"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import AddFieldForm from "./addFields"
import { getAllFields, updateField, updateMultipleFields } from "../../../api/trip-field-service"

const Fields = () => {
  const [fields, setFields] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" })

  // Fetch fields on component mount
  useEffect(() => {
    fetchFields()
  }, [])

  const fetchFields = async () => {
    try {
      setLoading(true)
      const data = await getAllFields()
      console.log("Fetched fields:", data)
      // Ensure data is an array before setting it to state
      setFields(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError("Failed to load fields. Please try again.")
      console.error("Error fetching fields:", err)
      // Set fields to empty array on error
      setFields([])
    } finally {
      setLoading(false)
    }
  }

  const handleToggleEnable = async (id) => {
    try {
      const fieldToUpdate = fields.find((field) => field.id === id)
      if (!fieldToUpdate) return

      const updatedField = { ...fieldToUpdate, enabled: !fieldToUpdate.enabled }

      // Update in UI first for better UX
      setFields(fields.map((field) => (field.id === id ? updatedField : field)))

      // Then update in backend
      await updateField(updatedField)

      showNotification("Field updated successfully", "success")
    } catch (err) {
      // Revert UI change on error
      fetchFields() // Refresh fields from server on error
      showNotification("Failed to update field", "error")
      console.error("Error updating field:", err)
    }
  }

  const handleToggleMandatory = async (id) => {
    try {
      const fieldToUpdate = fields.find((field) => field.id === id)
      if (!fieldToUpdate) return

      const updatedField = { ...fieldToUpdate, isMandatory: !fieldToUpdate.isMandatory }

      // Update in UI first
      setFields(fields.map((field) => (field.id === id ? updatedField : field)))

      // Then update in backend
      await updateField(updatedField)

      showNotification("Field updated successfully", "success")
    } catch (err) {
      // Revert UI change on error
      fetchFields() // Refresh fields from server on error
      showNotification("Failed to update field", "error")
      console.error("Error updating field:", err)
    }
  }

  const handleToggleShowInPdf = async (id) => {
    try {
      const fieldToUpdate = fields.find((field) => field.id === id)
      if (!fieldToUpdate) return

      const updatedField = { ...fieldToUpdate, showInPdf: !fieldToUpdate.showInPdf }

      // Update in UI first
      setFields(fields.map((field) => (field.id === id ? updatedField : field)))

      // Then update in backend
      await updateField(updatedField)

      showNotification("Field updated successfully", "success")
    } catch (err) {
      // Revert UI change on error
      fetchFields() // Refresh fields from server on error
      showNotification("Failed to update field", "error")
      console.error("Error updating field:", err)
    }
  }

  const openForm = () => {
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
  }

  const handleSaveNewField = async (newFieldData) => {
    try {
      // The addField function will be called from the AddFieldForm component
      // We'll just update our local state with the returned field from the API
      closeForm()
      // Refresh the fields list to include the new field
      await fetchFields()
      showNotification("New field added successfully", "success")
    } catch (err) {
      showNotification("Failed to add new field", "error")
      console.error("Error adding new field:", err)
    }
  }

  const handleSaveList = async () => {
    try {
      setLoading(true)
      // Save all fields at once
      await updateMultipleFields(fields)
      showNotification("All fields saved successfully", "success")
    } catch (err) {
      showNotification("Failed to save fields", "error")
      console.error("Error saving fields:", err)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  if (loading && fields.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
        <CircularProgress />
      </Box>
    )
  }

  // Ensure fields is an array before rendering
  const fieldsArray = Array.isArray(fields) ? fields : []

  return (
    <Box sx={{ width: "100%", maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" component="h1">
          Fields Management
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openForm} disabled={loading}>
          Add
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ENABLE</TableCell>
              <TableCell>FIELD</TableCell>
              <TableCell align="center">MANDATORY</TableCell>
              <TableCell align="center">SHOW IN PDF</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fieldsArray.map((field) => (
              <TableRow key={field.id}>
                <TableCell align="center">
                  <Checkbox
                    checked={field.enabled}
                    onChange={() => handleToggleEnable(field.id)}
                    color="primary"
                    disabled={loading}
                  />
                </TableCell>
                <TableCell>
                  {field.labelName || field.name}
                  {field.helpText && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      {field.helpText}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={field.isMandatory}
                    onChange={() => handleToggleMandatory(field.id)}
                    color="primary"
                    disabled={loading}
                  />
                  {field.defaultValue && (
                    <Typography variant="caption" display="block">
                      ( Default Value )
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={field.showInPdf}
                    onChange={() => handleToggleShowInPdf(field.id)}
                    color="primary"
                    disabled={loading}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openForm}
          sx={{ mr: 1 }}
          disabled={loading}
        >
          Add New Field
        </Button>
        <Button variant="contained" color="primary" onClick={handleSaveList} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </Box>

      {/* Import and use the AddFieldForm component */}
      <AddFieldForm open={isFormOpen} handleClose={closeForm} onSave={handleSaveNewField} />

      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Fields
