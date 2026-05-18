"use client"

import { useEffect, useState } from "react"
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  TextField,
  IconButton,
  Divider,
  Badge,
  Grid,
  InputAdornment,
  Chip,
  Tooltip,
  Button,
  Snackbar,
  Alert
} from "@mui/material"
import {
  Edit,
  Save,
  Cancel,
  Person,
  PhotoCamera,
  Security,
  AdminPanelSettings,
} from "@mui/icons-material"
import { styled, alpha, useTheme } from "@mui/material/styles"
import axios from "axios"
import { useAuth } from "../../../context/AuthContext"

const ProfileContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
}))

const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  boxShadow: theme.shadows[4],
  padding: theme.spacing(4),
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.common.white}`,
  boxShadow: theme.shadows[3],
}))

const RoleChip = styled(Chip)(({ theme }) => ({
  borderRadius: "12px",
  fontWeight: 600,
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}))

export default function Profile() {
  const theme = useTheme()
  const { userData } = useAuth()
  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [empData, setEmpData] = useState([])
  const [photoEditMode, setPhotoEditMode] = useState(false)
  const [passwordEditMode, setPasswordEditMode] = useState(false)

  const [formData, setFormData] = useState({
    employeePhoto: "",
    password: "",
    confirmPassword: "",
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const getEmpData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/Auth/getEmployeeById/${userData?.empID}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      })
      setEmpData(res.data.items)
    } catch (error) {
      console.error('Error fetching employee data:', error)
    }
  }

  useEffect(() => {
    getEmpData()
  }, [userData])

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    const uploadForm = new FormData()
    uploadForm.append('file', file)

    try {
      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, uploadForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: token,
        },
      })
      setFormData((prev) => ({ ...prev, employeePhoto: res.data.url }))
      if(res.data.url){
        setSnackbar({
          severity:"success",
          open:true,
          message:"Profile Photo Uploaded"
        })
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
    }
  }

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setSnackbar({
        severity:"error",
        open:true,
        message:"Passwords did not match"
      })
      return
    }

    try {
      const payload = {
        ...(formData.employeePhoto && { employeePhoto: formData.employeePhoto }),
        ...(formData.password && { password: formData.password }),
      }

      const res = await axios.post(`${baseUrl}/v1/api/Auth/employee/update`, payload, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      })

      if (res.data.status) {
        setSnackbar({
          severity:"success",
          open:true,
          message:"Employee Updated Successfully"
        })
        setPhotoEditMode(false)
        setPasswordEditMode(false)
        getEmpData()
        setFormData(
          {
            employeePhoto:"",
            password: "",
            confirmPassword: "",
          }
        )
      }
    } catch (error) {
      console.error("Update error:", error)
    }
  }

  useEffect(() => {
    if (empData?.employeePhoto) {
      setFormData((prev) => ({
        ...prev,
        employeePhoto: empData.employeePhoto,
      }))
    }
  }, [empData])

  return (
    <>
        <ProfileContainer maxWidth="md">
      <Typography variant="h4" gutterBottom fontWeight={700}>My Profile</Typography>

      <ProfileCard>
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={

                <label htmlFor="upload-photo">
                  <input
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                  />
                  <IconButton component="span" sx={{ bgcolor: "white", border: `1px solid ${alpha(theme.palette.grey[400], 0.3)}` }}>
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </label>
            }
          >
            <StyledAvatar src={formData.employeePhoto}>
              {!formData.employeePhoto && <Person />}
            </StyledAvatar>
          </Badge>

          <Box>
            <Typography variant="h5" fontWeight={600}>{empData.employeName}</Typography>
            <Typography color="text.secondary">{empData.userName}</Typography>
            <Typography color="text.secondary">Emp ID: {empData.employeUniqueId}</Typography>
          </Box>

          <Box marginLeft="auto">
            <Tooltip title="Save Changes">
            <Button
              onClick={handleSave}
              startIcon={ <Save color="primary"/>}
              variant="outlined"
              size="small"
              disabled={!formData.employeePhoto || formData.employeePhoto === empData.employeePhoto}
            >
              Save
            </Button>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><Typography fontWeight={600}>Department</Typography><Typography>{empData.departmentId?.name || "-"}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography fontWeight={600}>Designation</Typography><Typography>{empData.designationId?.name || "-"}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography fontWeight={600}>Location</Typography><Typography>{empData.workLocationId?.name || "-"}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography fontWeight={600}>Employment Type</Typography><Typography>{empData.employementTypeId?.title || "-"}</Typography></Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="body2" fontWeight={600}>Roles</Typography>
          <Box display="flex" gap={1} mt={1}>
            {empData?.roleId?.map((role, idx) => (
              <RoleChip key={idx} label={role.roleName.toUpperCase()} icon={<AdminPanelSettings fontSize="small" />} />
            ))}
          </Box>
        </Box>

        <Box mt={4}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" fontWeight={600}>Change Password</Typography>
            <Tooltip title={passwordEditMode ? "Cancel" : "Change Password"}>
              <IconButton onClick={() => setPasswordEditMode((prev) => !prev)}>
                {passwordEditMode ? <Cancel /> : <Edit />}
              </IconButton>
            </Tooltip>
          </Box>

          {passwordEditMode && (
            <>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start"><Security /></InputAdornment> }}
              />

              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                helperText={formData.confirmPassword && formData.password !== formData.confirmPassword && "Passwords do not match"}
                InputProps={{ startAdornment: <InputAdornment position="start"><Security /></InputAdornment> }}
              />

              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={!formData.password || formData.password !== formData.confirmPassword}
                >Save</Button>
                <Button variant="outlined" onClick={() => setPasswordEditMode(false)}>Cancel</Button>
              </Box>
            </>
          )}
        </Box>
      </ProfileCard>
    </ProfileContainer>
     <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                sx={{
                  width: '100%',
                  borderRadius: 1.5,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }}
                variant='filled'
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
    </>
  )
}
