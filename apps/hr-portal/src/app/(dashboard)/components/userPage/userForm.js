"use client"

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  Card,
  CardContent,
  Tooltip,
  InputAdornment,
  FormHelperText,
} from "@mui/material"
import {
  Save,
  Person,
  Email,
  Phone,
  Work,
  Badge,
  CalendarMonth,
  Wc,
  Business,
  Policy,
  Info,
  SupervisorAccount,
  CheckCircle,
  ArrowBack,
} from "@mui/icons-material"

const UserForm = ({ onCancel, userData = {} }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, backgroundColor: "#ffffff", borderRadius: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Person sx={{ mr: 1, color: "#3f51b5" }} />
          <Typography variant="h5" component="h2" sx={{ color: "#3f51b5", fontWeight: 500 }}>
            {userData.id ? "Edit User" : "Add New User"}
          </Typography>
        </Box>
        <Button startIcon={<ArrowBack />} onClick={onCancel} variant="outlined">
          Back to List
        </Button>
      </Box>

      <Box component="form" noValidate autoComplete="off">
        {/* Personal Information Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: "#3f51b5", mb: 2, fontWeight: 500 }}>
            Personal Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="First Name"
                required
                variant="outlined"
                defaultValue={userData.firstName || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#3f51b5" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Middle Name" variant="outlined" defaultValue={userData.middleName || ""} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Last Name" variant="outlined" defaultValue={userData.lastName || ""} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Display Name"
                variant="outlined"
                defaultValue={userData.displayName || ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Name displayed to other users">
                        <Info fontSize="small" sx={{ color: "#757575" }} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                variant="outlined"
                defaultValue={userData.employeeId || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: "#3f51b5" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Contact Information Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: "#3f51b5", mb: 2, fontWeight: 500 }}>
            Contact Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                required
                variant="outlined"
                defaultValue={userData.email || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#3f51b5" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile"
                variant="outlined"
                defaultValue={userData.mobile || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: "#3f51b5" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Role Information Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: "#3f51b5", mb: 2, fontWeight: 500 }}>
            Role Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  defaultValue={userData.role || "Submitter"}
                  label="Role"
                  startAdornment={<Work sx={{ color: "#3f51b5", mr: 1 }} />}
                >
                  <MenuItem value="Submitter">Submitter</MenuItem>
                  <MenuItem value="Approver">Approver</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="submits-to-label">Submits To</InputLabel>
                <Select
                  labelId="submits-to-label"
                  id="submits-to"
                  label="Submits To"
                  defaultValue={userData.submitsTo || ""}
                  displayEmpty
                  startAdornment={<SupervisorAccount sx={{ color: "#3f51b5", mr: 1 }} />}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="manager1">Jane Smith</MenuItem>
                  <MenuItem value="manager2">Michael Johnson</MenuItem>
                </Select>
                <FormHelperText>
                  <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                    <Info fontSize="small" sx={{ mr: 0.5 }} />
                    Select who this user reports to
                  </Box>
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  id="department"
                  label="Department"
                  defaultValue={userData.department || ""}
                  displayEmpty
                  startAdornment={<Business sx={{ color: "#3f51b5", mr: 1 }} />}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="hr">Human Resources</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="policy-label">Policy</InputLabel>
                <Select
                  labelId="policy-label"
                  id="policy"
                  defaultValue={userData.policy || "fincoopers"}
                  label="Policy"
                  startAdornment={<Policy sx={{ color: "#3f51b5", mr: 1 }} />}
                >
                  <MenuItem value="fincoopers">fincoopers</MenuItem>
                  <MenuItem value="policy2">Corporate Policy</MenuItem>
                  <MenuItem value="policy3">Standard Policy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Additional Information Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: "#3f51b5", mb: 2, fontWeight: 500 }}>
            Additional Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of birth"
                variant="outlined"
                placeholder="eg: 31/01/2020"
                defaultValue={userData.dateOfBirth || "eg: 31/01/2020"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth sx={{ color: "#3f51b5" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  label="Gender"
                  defaultValue={userData.gender || ""}
                  displayEmpty
                  startAdornment={<Wc sx={{ color: "#3f51b5", mr: 1 }} />}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of joining"
                variant="outlined"
                placeholder="eg: 31/01/2020"
                defaultValue={userData.dateOfJoining || "eg: 31/01/2020"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth sx={{ color: "#3f51b5" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="designation-label">Designation</InputLabel>
                <Select
                  labelId="designation-label"
                  id="designation"
                  label="Designation"
                  defaultValue={userData.designation || ""}
                  displayEmpty
                >
                  <MenuItem value="">Select or type to add</MenuItem>
                  <MenuItem value="software-engineer">Software Engineer</MenuItem>
                  <MenuItem value="product-manager">Product Manager</MenuItem>
                  <MenuItem value="designer">Designer</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox defaultChecked={userData.skipInvitation || false} />}
                label="Skip invitation email"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Permissions Section */}
        <Box sx={{ mb: 4 }}>
          <Card variant="outlined" sx={{ backgroundColor: "#f0f4ff", maxWidth: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5", fontWeight: 500 }}>
                Submitter Permissions
              </Typography>
              <FormControlLabel
                control={<Checkbox defaultChecked={userData.permissions?.recordExpenses || true} />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CheckCircle color="success" sx={{ mr: 1 }} />
                    Record Expenses
                  </Box>
                }
              />
              <FormControlLabel
                control={<Checkbox defaultChecked={userData.permissions?.submitReports || true} />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CheckCircle color="success" sx={{ mr: 1 }} />
                    Submit Reports
                  </Box>
                }
              />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            size="large"
            sx={{
              backgroundColor: "#3f51b5",
              "&:hover": { backgroundColor: "#303f9f" },
              px: 4,
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default UserForm
