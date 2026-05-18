"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  CircularProgress,
  Checkbox,
  Paper,
  IconButton as MuiIconButton,
} from "@mui/material"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import DeleteIcon from "@mui/icons-material/Delete"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { addField } from "../../../api/trip-field-service"

const AddFields = ({ open, handleClose, onSave }) => {
  const [newField, setNewField] = useState({
    labelName: "",
    dataType: "",
    mandatory: false,
    showInPdf: true,
    helpText: "",
    restrictDuplicates: false,
    defaultValue: "",
    prefix: "",
    startingNumber: "",
    suffix: "",
    options: ["", "", "", ""],
    fileTypes: {
      allFiles: false,
      image: false,
      document: false,
      pdf: false,
    },
    moduleType: "trips",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDefaultChecked, setIsDefaultChecked] = useState(false)

  // Data types that should show all additional fields (including duplicate restrictions)
  const textBasedTypes = ["Text Box (Single Line)", "Email", "URL", "Phone", "Number", "Decimal", "textBox"]

  // Data types that should show only help text and default value
  const simpleAdditionalFieldTypes = ["Decimal", "Amount", "Percent", "Date", "DateAndTime"]

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNewField({
        labelName: "",
        dataType: "",
        mandatory: false,
        showInPdf: true,
        helpText: "",
        restrictDuplicates: false,
        defaultValue: "",
        prefix: "",
        startingNumber: "",
        suffix: "",
        options: ["", "", "", ""],
        fileTypes: {
          allFiles: false,
          image: false,
          document: false,
          pdf: false,
        },
        moduleType: "trips",
      })
      setIsDefaultChecked(false)
      setError(null)
    }
  }, [open])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewField({
      ...newField,
      [name]: value,
    })
  }

  const handleRadioChange = (e) => {
    const { name, value } = e.target
    setNewField({
      ...newField,
      [name]: value === "true",
    })
  }

  const handleDefaultCheckboxChange = (e) => {
    const isChecked = e.target.checked
    setIsDefaultChecked(isChecked)
    setNewField({
      ...newField,
      defaultValue: isChecked ? "true" : "",
    })
  }

  const handleFileTypeChange = (type) => (e) => {
    const checked = e.target.checked

    if (type === "allFiles" && checked) {
      setNewField({
        ...newField,
        fileTypes: {
          allFiles: true,
          image: true,
          document: true,
          pdf: true,
        },
      })
    } else {
      setNewField({
        ...newField,
        fileTypes: {
          ...newField.fileTypes,
          [type]: checked,
          // If any specific file type is unchecked, also uncheck "All Files"
          ...(type !== "allFiles" && !checked ? { allFiles: false } : {}),
        },
      })
    }
  }

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newField.options]
    updatedOptions[index] = value
    setNewField({
      ...newField,
      options: updatedOptions,
    })
  }

  const handleAddOption = () => {
    setNewField({
      ...newField,
      options: [...newField.options, ""],
    })
  }

  const handleRemoveOption = (index) => {
    const updatedOptions = [...newField.options]
    updatedOptions.splice(index, 1)
    setNewField({
      ...newField,
      options: updatedOptions,
    })
  }

  const handleSave = async () => {
    if (newField.labelName && newField.dataType) {
      try {
        setLoading(true)
        setError(null)

        // Create a base field object with common properties
        const fieldData = {
          labelName: newField.labelName,
          dataType: newField.dataType,
          mandatory: newField.mandatory,
          showInPdf: newField.showInPdf,
          moduleType: "trips",
        }

        // Add properties based on data type
        switch (newField.dataType) {
          case "CheckBox":
            fieldData.helpText = newField.helpText
            fieldData.defaultValue = isDefaultChecked
            break

          case "AutoGenerateNumber":
            fieldData.helpText = newField.helpText
            fieldData.prefix = newField.prefix
            fieldData.startingNumber = newField.startingNumber
            fieldData.suffix = newField.suffix
            break

          case "Dropdown":
          case "MultiSelect":
            fieldData.helpText = newField.helpText
            fieldData.options = newField.options.filter((option) => option.trim() !== "")
            break

          case "Attachment":
            fieldData.helpText = newField.helpText
            fieldData.fileTypes = newField.fileTypes
            break

          default:
            // For text-based types
            if (textBasedTypes.includes(newField.dataType)) {
              fieldData.helpText = newField.helpText
              fieldData.restrictDuplicates = newField.restrictDuplicates
              fieldData.defaultValue = newField.defaultValue
            }
            // For simple additional field types
            else if (simpleAdditionalFieldTypes.includes(newField.dataType)) {
              fieldData.helpText = newField.helpText
              fieldData.defaultValue = newField.defaultValue
            }
        }

        // Call the API to add the new field
        const addedField = await addField(fieldData)

        // Call the parent component's onSave with the response from the API
        onSave(addedField)
      } catch (err) {
        setError("Failed to add field. Please try again.")
        console.error("Error adding field:", err)
      } finally {
        setLoading(false)
      }
    }
  }

  // Check if the current data type should show all additional fields
  const shouldShowAllAdditionalFields = textBasedTypes.includes(newField.dataType)

  // Check if the current data type should show only help text and default value
  const shouldShowSimpleAdditionalFields = simpleAdditionalFieldTypes.includes(newField.dataType)

  // Check if we should show any additional fields
  const shouldShowAnyAdditionalFields = shouldShowAllAdditionalFields || shouldShowSimpleAdditionalFields

  // Render additional fields based on data type
  const renderAdditionalFields = () => {
    switch (newField.dataType) {
      case "CheckBox":
        return (
          <>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2">Help Text</Typography>
                <Tooltip title="Additional information about this field">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                name="helpText"
                value={newField.helpText}
                onChange={handleInputChange}
                placeholder="Enter help text for this field"
                disabled={loading}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2">Default Value</Typography>
                <Tooltip title="The initial value for this field">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={isDefaultChecked}
                  onChange={handleDefaultCheckboxChange}
                  disabled={loading}
                  inputProps={{ "aria-label": "Default value checkbox" }}
                />
                <Typography variant="body2">Set as checked by default</Typography>
              </Box>
            </Box>
          </>
        )

      case "AutoGenerateNumber":
        return (
          <>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2">Help Text</Typography>
                <Tooltip title="Additional information about this field">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                name="helpText"
                value={newField.helpText}
                onChange={handleInputChange}
                placeholder="Enter help text for this field"
                disabled={loading}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2">Prefix</Typography>
                <Tooltip title="Text to appear before the number">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                name="prefix"
                value={newField.prefix}
                onChange={handleInputChange}
                placeholder="Enter prefix"
                disabled={loading}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2">Starting Number</Typography>
                <Tooltip title="The first number in the sequence">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                name="startingNumber"
                value={newField.startingNumber}
                onChange={handleInputChange}
                placeholder="Enter starting number"
                type="number"
                disabled={loading}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2">Suffix</Typography>
                <Tooltip title="Text to appear after the number">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                name="suffix"
                value={newField.suffix}
                onChange={handleInputChange}
                placeholder="Enter suffix"
                disabled={loading}
              />
            </Box>
          </>
        )

      case "Dropdown":
      case "MultiSelect":
        return (
          <>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2">Help Text</Typography>
                <Tooltip title="Additional information about this field">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                name="helpText"
                value={newField.helpText}
                onChange={handleInputChange}
                placeholder="Enter help text for this field"
                disabled={loading}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2">Options *</Typography>
                <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                  ( Sort alphabetically )
                </Typography>
                <Tooltip title="Options for the dropdown">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Paper sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                {newField.options.map((option, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <DragIndicatorIcon sx={{ color: "text.secondary", mr: 1 }} />
                    <TextField
                      fullWidth
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder="Enter option"
                      disabled={loading}
                      size="small"
                    />
                    <MuiIconButton
                      size="small"
                      onClick={() => handleRemoveOption(index)}
                      disabled={loading || newField.options.length <= 1}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </MuiIconButton>
                  </Box>
                ))}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
                  <Button
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddOption}
                    disabled={loading}
                    size="small"
                    color="primary"
                  >
                    Add Option
                  </Button>
                </Box>
              </Paper>
            </Box>
          </>
        )

      case "Attechment":
        return (
          <>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2">File Type *</Typography>
                <Tooltip title="Types of files that can be uploaded">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Checkbox
                    checked={newField.fileTypes.allFiles}
                    onChange={handleFileTypeChange("allFiles")}
                    disabled={loading}
                    inputProps={{ "aria-label": "All files checkbox" }}
                  />
                  <Typography>All Files</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Checkbox
                    checked={newField.fileTypes.image}
                    onChange={handleFileTypeChange("image")}
                    disabled={loading}
                    inputProps={{ "aria-label": "Image files checkbox" }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        bgcolor: "#4285f4",
                        color: "white",
                        width: 20,
                        height: 20,
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      I
                    </Box>
                    <Typography>Image</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Checkbox
                    checked={newField.fileTypes.document}
                    onChange={handleFileTypeChange("document")}
                    disabled={loading}
                    inputProps={{ "aria-label": "Document files checkbox" }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        bgcolor: "#4285f4",
                        color: "white",
                        width: 20,
                        height: 20,
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      D
                    </Box>
                    <Typography>Document</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={newField.fileTypes.pdf}
                    onChange={handleFileTypeChange("pdf")}
                    disabled={loading}
                    inputProps={{ "aria-label": "PDF files checkbox" }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        bgcolor: "#ea4335",
                        color: "white",
                        width: 20,
                        height: 20,
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      P
                    </Box>
                    <Typography>PDF</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2">Help Text</Typography>
                <Tooltip title="Additional information about this field">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                name="helpText"
                value={newField.helpText}
                onChange={handleInputChange}
                placeholder="Enter help text for this field"
                disabled={loading}
              />
            </Box>
          </>
        )

      default:
        if (shouldShowAllAdditionalFields) {
          return (
            <>
              <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 1 }}>
                Remaining Fields: 50
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography variant="subtitle2">Help Text</Typography>
                  <Tooltip title="Additional information about this field">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <TextField
                  fullWidth
                  name="helpText"
                  value={newField.helpText}
                  onChange={handleInputChange}
                  placeholder="Enter help text for this field"
                  disabled={loading}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography variant="subtitle2">Restrict duplicate values</Typography>
                  <Tooltip title="Prevent users from entering the same value multiple times">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <RadioGroup
                  row
                  name="restrictDuplicates"
                  value={newField.restrictDuplicates.toString()}
                  onChange={handleRadioChange}
                  disabled={loading}
                >
                  <FormControlLabel value="true" control={<Radio color="primary" />} label="Yes" disabled={loading} />
                  <FormControlLabel value="false" control={<Radio color="primary" />} label="No" disabled={loading} />
                </RadioGroup>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography variant="subtitle2">Default Value</Typography>
                  <Tooltip title="The initial value for this field">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <TextField
                  fullWidth
                  name="defaultValue"
                  value={newField.defaultValue}
                  onChange={handleInputChange}
                  placeholder="Enter default value"
                  disabled={loading}
                />
              </Box>
            </>
          )
        } else if (simpleAdditionalFieldTypes.includes(newField.dataType)) {
          return (
            <>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography variant="subtitle2">Help Text</Typography>
                  <Tooltip title="Additional information about this field">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <TextField
                  fullWidth
                  name="helpText"
                  value={newField.helpText}
                  onChange={handleInputChange}
                  placeholder="Enter help text for this field"
                  disabled={loading}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography variant="subtitle2">Default Value</Typography>
                  <Tooltip title="The initial value for this field">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <TextField
                  fullWidth
                  name="defaultValue"
                  value={newField.defaultValue}
                  onChange={handleInputChange}
                  placeholder="Enter default value"
                  disabled={loading}
                />
              </Box>
            </>
          )
        }
        return null
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Field</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            id="labelName"
            name="labelName"
            label="Label Name"
            type="text"
            fullWidth
            required
            value={newField.labelName}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <FormControl fullWidth sx={{ mb: 2 }} disabled={loading}>
            <InputLabel id="data-type-label">Data Type *</InputLabel>
            <Select
              labelId="data-type-label"
              id="dataType"
              name="dataType"
              value={newField.dataType}
              label="Data Type *"
              onChange={handleInputChange}
            >
              <MenuItem value="Text Box (Single Line)">Text Box (Single Line)</MenuItem>
              <MenuItem value="Email">Email</MenuItem>
              <MenuItem value="URL">URL</MenuItem>
              <MenuItem value="Phone">Phone</MenuItem>
              <MenuItem value="Number">Number</MenuItem>
              <MenuItem value="Decimal">Decimal</MenuItem>
              <MenuItem value="Date">Date</MenuItem>
              <MenuItem value="Amount">Amount</MenuItem>
              <MenuItem value="Percent">Percent</MenuItem>
              <MenuItem value="DateAndTime">Date And Time</MenuItem>
              <MenuItem value="CheckBox">Check Box</MenuItem>
              <MenuItem value="Dropdown">Dropdown</MenuItem>
              <MenuItem value="AutoGenerateNumber">Auto Generate Number</MenuItem>
              <MenuItem value="MultiSelect">Multi Select</MenuItem>
              <MenuItem value="Lookup">Lookup</MenuItem>
              <MenuItem value="textBox">Text Box</MenuItem>
              <MenuItem value="Attachment">Attachment</MenuItem>
              <MenuItem value="externalLookup">External Lookup</MenuItem>
            </Select>
          </FormControl>

          {newField.dataType && (
            <Box sx={{ mb: 2 }}>
              {newField.dataType === "CheckBox" && (
                <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 1 }}>
                  Remaining Fields: 20
                </Typography>
              )}
              {newField.dataType === "AutoGenerateNumber" && (
                <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 1 }}>
                  Remaining Fields: 1
                </Typography>
              )}
              {newField.dataType === "Dropdown" && (
                <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 1 }}>
                  Remaining Fields: 25
                </Typography>
              )}
              {newField.dataType === "MultiSelect" && (
                <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 1 }}>
                  Remaining Fields: 5
                </Typography>
              )}
              {newField.dataType === "Attechment" && (
                <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 1 }}>
                  Remaining Fields: 10
                </Typography>
              )}

              {renderAdditionalFields()}
            </Box>
          )}

          <FormControl component="fieldset" sx={{ mb: 2 }} disabled={loading}>
            <Typography variant="subtitle2">Is Mandatory</Typography>
            <RadioGroup row name="mandatory" value={newField.mandatory.toString()} onChange={handleRadioChange}>
              <FormControlLabel value="true" control={<Radio color="primary" />} label="Yes" disabled={loading} />
              <FormControlLabel value="false" control={<Radio color="primary" />} label="No" disabled={loading} />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" disabled={loading}>
            <Typography variant="subtitle2">Show in all PDF</Typography>
            <RadioGroup row name="showInPdf" value={newField.showInPdf.toString()} onChange={handleRadioChange}>
              <FormControlLabel value="true" control={<Radio color="primary" />} label="Yes" disabled={loading} />
              <FormControlLabel value="false" control={<Radio color="primary" />} label="No" disabled={loading} />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={!newField.labelName || !newField.dataType || loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddFields
