"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Button,
  Grid,
  Radio,
  RadioGroup,
  Alert,
  IconButton,
  Divider,
  Container,
} from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import ClearIcon from "@mui/icons-material/Clear"

export default function Preference() {
  const [customStatuses, setCustomStatuses] = useState([{ name: "", considerAs: "Approved" }])
  const [enableChatlets, setEnableChatlets] = useState(true)
  const [chatletPermission, setChatletPermission] = useState("admins")

  const handleAddStatus = () => {
    setCustomStatuses([...customStatuses, { name: "", considerAs: "Approved" }])
  }

  const handleStatusChange = (index, field, value) => {
    const updatedStatuses = [...customStatuses]
    updatedStatuses[index][field] = value
    setCustomStatuses(updatedStatuses)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const formValues = Object.fromEntries(formData.entries())

    // Add multi-value and complex fields
    formValues.customStatuses = customStatuses
    formValues.enableChatlets = enableChatlets
    formValues.chatletPermission = chatletPermission

    alert("Preferences saved successfully!")
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Auto-generate Trip Number */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              Auto-generate Trip Number
              <HelpOutlineIcon fontSize="small" sx={{ ml: 1, color: "text.secondary" }} />
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="prefix"
                  name="prefix"
                  label="Prefix"
                  defaultValue="TRIP-"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="startWith"
                  name="startWith"
                  label="Start With"
                  defaultValue="00001"
                  margin="normal"
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={<Checkbox name="associateExpenses" />}
              label="Associate expenses incurred only within the trip's duration."
              sx={{ display: "block", mt: 2 }}
            />

            <FormControlLabel
              control={<Checkbox name="createAdvance" />}
              label="Create an advance for the trip's budget amount and associate it with the trip when it is approved."
              sx={{ display: "block", mt: 1 }}
            />

            <Box display="flex" alignItems="center" mt={1}>
              <FormControlLabel control={<Checkbox name="restrictReport" />} label="Restrict report creation for" />
              <FormControl sx={{ minWidth: 120, mx: 1 }} size="small">
                <Select defaultValue="Cancelled" name="restrictReportType">
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Typography>trips</Typography>
            </Box>
          </Box>

          <Divider />

          {/* Travel Profile */}
          <Box my={4}>
            <Typography variant="h6" gutterBottom>
              Travel Profile
            </Typography>

            <FormControlLabel
              control={<Checkbox name="mandateProfile" />}
              label="Mandate travel profile for users to create trips"
            />
          </Box>

          <Divider />

          {/* Trip Allowance */}
          <Box my={4}>
            <Typography variant="h6" gutterBottom>
              Trip Allowance
            </Typography>

            <Box display="flex" alignItems="center">
              <Typography mr={2}>Auto create Trip allowance for</Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <Select defaultValue="None" name="tripAllowance">
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="All">All trips</MenuItem>
                  <MenuItem value="International">International trips</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              Note: Allowances will be calculated using the duration of the trip and the default per diem rate. It will
              be automatically added to the associated expense report.
            </Alert>
          </Box>

          <Divider />

          {/* Custom Status */}
          <Box my={4}>
            <Typography variant="h6" gutterBottom>
              Custom Status
            </Typography>

            <Box mb={2} display="flex" alignItems="center">
              <Typography>Do you have intermediate statuses for your trip? Configure them!</Typography>
              <HelpOutlineIcon fontSize="small" sx={{ ml: 1, color: "text.secondary" }} />
            </Box>

            <Paper variant="outlined" sx={{ mb: 2 }}>
              <Box display="flex" bgcolor="#f5f5f5" p={1}>
                <Typography fontWeight="medium" color="text.secondary" sx={{ width: "50%" }}>
                  NAME
                </Typography>
                <Typography fontWeight="medium" color="text.secondary" sx={{ width: "50%" }}>
                  CONSIDER AS
                </Typography>
              </Box>

              {customStatuses.map((status, index) => (
                <Box key={index} display="flex" p={1} borderTop="1px solid #eee">
                  <Box sx={{ width: "50%", pr: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={status.name}
                      onChange={(e) => handleStatusChange(index, "name", e.target.value)}
                    />
                  </Box>
                  <Box sx={{ width: "50%", pl: 1, position: "relative" }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={status.considerAs}
                        onChange={(e) => handleStatusChange(index, "considerAs", e.target.value)}
                        endAdornment={
                          <IconButton
                            size="small"
                            sx={{ position: "absolute", right: 24 }}
                            onClick={() => handleStatusChange(index, "considerAs", "")}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        }
                      >
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              ))}
            </Paper>

            <Button startIcon={<AddCircleIcon />} onClick={handleAddStatus} sx={{ color: "#2196f3" }}>
              New
            </Button>
          </Box>

          <Divider />

          {/* Submission Preferences */}
          <Box my={4}>
            <Typography variant="h6" gutterBottom>
              Submission Preferences
            </Typography>

            <FormControlLabel
              control={<Checkbox name="attachPdf" />}
              label="Attach trip as a PDF file to the notification email"
              sx={{ display: "block", mb: 1 }}
            />

            <FormControlLabel
              control={<Checkbox name="receiveCopy" />}
              label={
                <Box display="flex" alignItems="center">
                  Receive a copy of the trip.
                  <HelpOutlineIcon fontSize="small" sx={{ ml: 1, color: "text.secondary" }} />
                </Box>
              }
              sx={{ display: "block", mb: 1 }}
            />

            <FormControlLabel
              control={<Checkbox name="displayTerms" />}
              label={
                <Box display="flex" alignItems="center">
                  Display Terms & Conditions
                  <HelpOutlineIcon fontSize="small" sx={{ ml: 1, color: "text.secondary" }} />
                </Box>
              }
            />
          </Box>

          <Divider />

          {/* Approval Preferences */}
          <Box my={4}>
            <Typography variant="h6" gutterBottom>
              Approval Preferences
            </Typography>

            <FormControlLabel
              control={<Checkbox name="allowApprovers" defaultChecked />}
              label="Allow approvers to approve their own trips"
              sx={{ display: "block", mb: 1 }}
            />

            <FormControlLabel
              control={<Checkbox name="receiveCopyApproval" />}
              label={
                <Box display="flex" alignItems="center">
                  Receive a copy of the trip upon its approval
                  <HelpOutlineIcon fontSize="small" sx={{ ml: 1, color: "text.secondary" }} />
                </Box>
              }
            />
          </Box>

          <Divider />

          {/* Send Notifications When */}
          <Box my={4}>
            <Typography variant="h6" gutterBottom>
              Send Notifications When
            </Typography>

            <FormControlLabel
              control={<Checkbox name="notifyApproved" defaultChecked />}
              label="Trips are approved"
              sx={{ display: "block", mb: 1 }}
            />

            <FormControlLabel
              control={<Checkbox name="notifySubmitted" defaultChecked />}
              label="Trips are submitted"
              sx={{ display: "block", mb: 1 }}
            />

            <FormControlLabel control={<Checkbox name="notifyCanceled" defaultChecked />} label="Trips are canceled" />
          </Box>

          <Divider />

          {/* Chatlet Preferences */}
          <Box my={4}>
            <Typography variant="h6" gutterBottom>
              Chatlet Preferences
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  name="enableChatlets"
                  checked={enableChatlets}
                  onChange={(e) => setEnableChatlets(e.target.checked)}
                  defaultChecked
                />
              }
              label="Enable Chatlets"
            />

            {enableChatlets && (
              <Box ml={4} mt={1}>
                <RadioGroup value={chatletPermission} onChange={(e) => setChatletPermission(e.target.value)}>
                  <FormControlLabel
                    value="admins"
                    control={<Radio />}
                    label="Allow only admins and approvers to create chatlets"
                  />
                  <FormControlLabel value="all" control={<Radio />} label="Allow all users to create chatlets" />
                </RadioGroup>
              </Box>
            )}
          </Box>

          {/* Submit Button */}
          <Box mt={4}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
