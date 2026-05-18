"use client"
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  CircularProgress,
  InputAdornment,
  TextField,
  Stack,
  Modal,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@mui/material"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid"
import {
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Groups as GroupsIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedIcon,
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Apps as AppsIcon,
  Edit as EditIcon,
  Payment as PaymentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material"
import { useEffect, useState, useMemo, useCallback, memo } from "react"
import { createPortal } from "react-dom"
// import { useAuth } from "../../../../context/AuthContext" // Commented out due to missing context
import { useRouter } from "next/navigation"
import { useApi } from "@core/hooks/useApi"

// Professional Toolbar Component
const ProfessionalToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{
        p: 2,
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        gap: 1,
      }}
    >
      <GridToolbarColumnsButton
        sx={{
          color: "#7367F0",
          "&:hover": { backgroundColor: "#7367F0", color: "white" },
        }}
      />
      <GridToolbarDensitySelector
        sx={{
          color: "#7367F0",
          "&:hover": { backgroundColor: "#7367F0", color: "white" },
        }}
      />
      <GridToolbarExport
        csvOptions={{
          disableToolbarButton: false,
        }}
        printOptions={{
          disableToolbarButton: true,
        }}
        sx={{
          color: "#7367F0",
          "&:hover": { backgroundColor: "#7367F0", color: "white" },
        }}
      />
    </GridToolbarContainer>
  )
}

// Professional Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  return (
    <Card
      sx={{
        height: "100%",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(115, 103, 240, 0.15)",
          borderColor: color,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: "#1e293b",
                fontWeight: 700,
                lineHeight: 1,
                mb: 0.5,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: color,
              width: 56,
              height: 56,
              boxShadow: `0 8px 16px ${color}30`,
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </Avatar>
        </Box>
        {trend && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 16, color: "#10b981" }} />
            <Typography variant="body2" sx={{ color: "#10b981", fontWeight: 600 }}>
              {trend}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// Permission Management Modal Component
const PermissionModal = memo(
  ({
    permissionModalOpen,
    selectedOrgForPermission,
    permissions,
    loadingPermissions,
    updatingPermissions,
    handleClosePermissionModal,
    handlePermissionChange,
    handleUpdatePermissions,
  }) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
    }, [])
    if (!mounted || !permissionModalOpen) return null
    const permissionLabels = {
      RecruitmentHiring: "Recruitment & Hiring",
      InterviewManagement: "Interview Management",
      fileManager: "File Manager",
      CommandExe: "Command Exe",
      LeadExe: "Lead Exe",
      notes: "Notes",
      chat: "Chat",
      expenseManagement: "Expense Management",
      assetManagement: "Asset Management",
      managementFeatures: "Management Features",
      verificationSuite : 'Verification Suite'
    }
    const modalContent = (
      <Modal
        open={permissionModalOpen}
        onClose={handleClosePermissionModal}
        aria-labelledby="permission-modal-title"
        aria-describedby="permission-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
        }}
      >
        <Fade in={permissionModalOpen}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: 4,
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.15)",
              p: 4,
              width: 600,
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              border: "1px solid #e2e8f0",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#00bad1",
                    width: 48,
                    height: 48,
                  }}
                >
                  <AdminPanelSettingsIcon sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography id="permission-modal-title" variant="h5" fontWeight={700} color="#1e293b">
                    Manage Permissions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure access permissions for {selectedOrgForPermission?.name || "this organization"}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleClosePermissionModal}
                sx={{
                  color: "#64748b",
                  "&:hover": {
                    bgcolor: "#f1f5f9",
                    color: "#1e293b",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Organization Info Card */}
            <Card
              sx={{
                mb: 3,
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#7367F0",
                      color: "white",
                      width: 48,
                      height: 48,
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedOrgForPermission?.name?.charAt(0)?.toUpperCase() || "O"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} color="#1e293b">
                      {selectedOrgForPermission?.name || "Unnamed Organization"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrgForPermission?.userId?.email || "No email provided"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            {/* Permissions Section */}
            <Card
              sx={{
                mb: 3,
                border: "1px solid #e2e8f0",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <SecurityIcon sx={{ color: "#7367F0" }} />
                  Access Permissions
                </Typography>
                {loadingPermissions ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                    <CircularProgress size={32} sx={{ color: "#7367F0" }} />
                    <Typography variant="body2" sx={{ ml: 2, color: "#64748b" }}>
                      Loading permissions...
                    </Typography>
                  </Box>
                ) : (
                  <FormGroup>
                    <Grid container spacing={2}>
                      {Object.entries(permissionLabels).map(([key, label]) => (
                        <Grid item xs={12} sm={6} key={key}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={permissions[key] || false}
                                onChange={(e) => handlePermissionChange(key, e.target.checked)}
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "#7367F0",
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                    backgroundColor: "#7367F0",
                                  },
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {permissions[key] ? "Enabled" : "Disabled"}
                                </Typography>
                              </Box>
                            }
                            sx={{
                              width: "100%",
                              m: 0,
                              p: 2,
                              border: "1px solid #e2e8f0",
                              borderRadius: 2,
                              "&:hover": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                )}
              </CardContent>
            </Card>
            {/* Modal Actions */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClosePermissionModal}
                sx={{
                  borderColor: "#64748b",
                  color: "#64748b",
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    borderColor: "#475569",
                    color: "#475569",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdatePermissions}
                disabled={updatingPermissions || loadingPermissions}
                startIcon={updatingPermissions ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
                sx={{
                  bgcolor: "#00bad1",
                  borderRadius: 2,
                  px: 4,
                  "&:hover": {
                    bgcolor: "#00a0b4",
                  },
                  "&:disabled": {
                    bgcolor: "#94a3b8",
                  },
                }}
              >
                {updatingPermissions ? "Updating..." : "Update Permissions"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    )
    return createPortal(modalContent, document.body)
  },
)
PermissionModal.displayName = "PermissionModal"

// Memoized Modal Component using Portal to prevent re-renders
const AdminModal = memo(
  ({
    modalOpen,
    isEditMode,
    adminFormData,
    showPassword,
    showConfirmPassword,
    allocatedModules,
    loadingModules,
    passwordsMatch,
    loading,
    handleCloseModal,
    handleInputChange,
    handleTogglePasswordVisibility,
    handleToggleConfirmPasswordVisibility,
    handleAllocatedModuleChange,
    handleSaveAdmin,
  }) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
    }, [])
    if (!mounted || !modalOpen) return null
    const modalContent = (
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="admin-modal-title"
        aria-describedby="admin-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: 4,
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.15)",
              p: 4,
              width: 500,
              maxWidth: "90vw",
              border: "1px solid #e2e8f0",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#28c76f",
                    width: 48,
                    height: 48,
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography id="admin-modal-title" variant="h5" fontWeight={700} color="#1e293b">
                    {isEditMode ? "Edit Admin User" : "Add Admin User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isEditMode ? "Update administrator account details" : "Create a new administrator account"}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  color: "#64748b",
                  "&:hover": {
                    bgcolor: "#f1f5f9",
                    color: "#1e293b",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Modal Content */}
            <Stack spacing={3} sx={{ mb: 4 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  htmlFor="userName-input"
                  sx={{
                    color: "#64748b",
                    "&.Mui-focused": {
                      color: "#7367F0",
                    },
                  }}
                >
                  User Name
                </InputLabel>
                <OutlinedInput
                  id="userName-input"
                  value={adminFormData.userName}
                  onChange={handleInputChange("userName")}
                  label="User Name"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#7367F0" }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7367F0",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7367F0",
                    },
                  }}
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  htmlFor="email-input"
                  sx={{
                    color: "#64748b",
                    "&.Mui-focused": {
                      color: "#7367F0",
                    },
                  }}
                >
                  Email Address
                </InputLabel>
                <OutlinedInput
                  id="email-input"
                  type="email"
                  value={adminFormData.email}
                  onChange={handleInputChange("email")}
                  label="Email Address"
                  startAdornment={
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#7367F0" }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7367F0",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7367F0",
                    },
                  }}
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  htmlFor="password-input"
                  sx={{
                    color: "#64748b",
                    "&.Mui-focused": {
                      color: "#7367F0",
                    },
                  }}
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={adminFormData.password}
                  onChange={handleInputChange("password")}
                  label="Password"
                  startAdornment={
                    <InputAdornment position="start">
                      <SecurityIcon sx={{ color: "#7367F0" }} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        sx={{ color: "#64748b" }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7367F0",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7367F0",
                    },
                  }}
                />
                {isEditMode && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      mt: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Leave blank to keep current password
                  </Typography>
                )}
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  htmlFor="confirm-password-input"
                  sx={{
                    color: "#64748b",
                    "&.Mui-focused": {
                      color: "#7367F0",
                    },
                  }}
                >
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="confirm-password-input"
                  type={showConfirmPassword ? "text" : "password"}
                  value={adminFormData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  label="Confirm Password"
                  startAdornment={
                    <InputAdornment position="start">
                      <SecurityIcon sx={{ color: "#7367F0" }} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleToggleConfirmPasswordVisibility}
                        edge="end"
                        sx={{ color: "#64748b" }}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: !passwordsMatch ? "#f56565" : "#7367F0",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: !passwordsMatch ? "#f56565" : "#7367F0",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: !passwordsMatch ? "#f56565" : undefined,
                    },
                  }}
                />
                {!passwordsMatch && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#f56565",
                      mt: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Passwords do not match
                  </Typography>
                )}
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  id="allocated-modules-label"
                  sx={{
                    color: "#64748b",
                    "&.Mui-focused": {
                      color: "#7367F0",
                    },
                  }}
                >
                  Allocated Modules
                </InputLabel>
                <Select
                  labelId="allocated-modules-label"
                  id="allocated-modules-select"
                  multiple
                  value={adminFormData.allocatedModule}
                  onChange={handleAllocatedModuleChange}
                  label="Allocated Modules"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const module = allocatedModules.find((mod) => mod._id === value)
                        return (
                          <Chip
                            key={value}
                            label={module?.Name || value}
                            size="small"
                            sx={{
                              bgcolor: "#7367F0",
                              color: "white",
                              fontSize: "0.75rem",
                            }}
                          />
                        )
                      })}
                    </Box>
                  )}
                  startAdornment={
                    <InputAdornment position="start">
                      <AppsIcon sx={{ color: "#7367F0", ml: 1 }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7367F0",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7367F0",
                    },
                    "& .MuiSelect-select": {
                      pl: 6,
                      minHeight: "56px", // Ensure minimum height
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        borderRadius: 8,
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    sx: {
                      zIndex: 99999, // Higher z-index to ensure it appears above modal
                    },
                  }}
                  disabled={loadingModules}
                  open={undefined} // Let MUI handle the open state
                >
                  {loadingModules ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading modules...
                    </MenuItem>
                  ) : (
                    allocatedModules.map((module) => (
                      <MenuItem key={module._id} value={module._id}>
                        <Checkbox
                          checked={adminFormData.allocatedModule.indexOf(module._id) > -1}
                          sx={{
                            color: "#7367F0",
                            "&.Mui-checked": {
                              color: "#7367F0",
                            },
                          }}
                        />
                        <ListItemText
                          primary={module.Name}
                          secondary={`Cost: ${module.Cost}`}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontWeight: 500,
                            },
                            "& .MuiListItemText-secondary": {
                              fontSize: "0.75rem",
                              color: "#64748b",
                            },
                          }}
                        />
                      </MenuItem>
                    ))
                  )}
                </Select>
                {adminFormData.allocatedModule.length === 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      mt: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Select at least one module for the admin user
                  </Typography>
                )}
              </FormControl>
            </Stack>
            {/* Modal Actions */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{
                  borderColor: "#64748b",
                  color: "#64748b",
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    borderColor: "#475569",
                    color: "#475569",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveAdmin}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
                sx={{
                  bgcolor: "#28c76f",
                  borderRadius: 2,
                  px: 4,
                  "&:hover": {
                    bgcolor: "#25b865",
                  },
                  "&:disabled": {
                    bgcolor: "#94a3b8",
                  },
                }}
              >
                {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Admin" : "Create Admin"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    )
    return createPortal(modalContent, document.body)
  },
)
AdminModal.displayName = "AdminModal"

function UsersManagement() {
  const [organizations, setOrganizations] = useState([])
  const { callApi, loading } = useApi() // Use loading from useApi
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [originalPassword, setOriginalPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [allocatedModules, setAllocatedModules] = useState([])
  const [loadingModules, setLoadingModules] = useState(false)
  const [adminFormData, setAdminFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    allocatedModule: [],
  })
  // Plan Modal States
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [selectedOrgForPlan, setSelectedOrgForPlan] = useState(null)
  const [availablePlans, setAvailablePlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")
  const [assigningPlan, setAssigningPlan] = useState(false)
  // Permission Modal States
  const [permissionModalOpen, setPermissionModalOpen] = useState(false)
  const [selectedOrgForPermission, setSelectedOrgForPermission] = useState(null)
  const [permissions, setPermissions] = useState({
    RecruitmentHiring: false,
    InterviewManagement: false,
    CommandExe: false,
    LeadExe: false,
    expenseManagement: false,
    fileManager: false,
    chat: false,
    notes: false,
    assetManagement: false,
    managementFeatures: false,
    verificationSuite : false,
  })
  const [loadingPermissions, setLoadingPermissions] = useState(false)
  const [updatingPermissions, setUpdatingPermissions] = useState(false)

  // const { userData } = useAuth() // Commented out due to missing context
  const router = useRouter()

  // Memoized password validation to prevent re-renders
  const passwordsMatch = useMemo(() => {
    if (!adminFormData.confirmPassword) return true
    return adminFormData.password === adminFormData.confirmPassword
  }, [adminFormData.password, adminFormData.confirmPassword])

  // Professional statistics
  const [stats, setStats] = useState([
    {
      title: "Total Organizations",
      value: "0",
      icon: BusinessIcon,
      color: "#7367F0",
      trend: "+12%",
      subtitle: "Active companies",
    },
    {
      title: "Active Users",
      value: "0",
      icon: GroupsIcon,
      color: "#28c76f",
      trend: "+8%",
      subtitle: "Registered users",
    },
    {
      title: "Verified Entities",
      value: "0",
      icon: VerifiedIcon,
      color: "#00bad1",
      trend: "+15%",
      subtitle: "With GSTIN",
    },
    {
      title: "Growth Rate",
      value: "127%",
      icon: TrendingUpIcon,
      color: "#ff9f43",
      trend: "+23%",
      subtitle: "This quarter",
    },
  ])

  // Fetch allocated modules
  const fetchAllocatedModules = async () => {
    setLoadingModules(true)
    const result = await callApi({
      endpoint: "/v1/api/allocated/getAllAllocated",
      method: "GET",
      disableSnackbar: true,
    })
    if (result.success && result.data && result.data.items) {
      setAllocatedModules(result.data.items)
    } else {
      console.error("Failed to fetch allocated modules:", result.message)
    }
    setLoadingModules(false)
  }

  // Fetch organizations
  const fetchOrganizations = async () => {
    setError("")
    const result = await callApi({
      endpoint: "/v1/api/org/organization",
      method: "GET",
      disableSnackbar: true,
    })
    if (result.success && result.data && result.data.items) {
      setOrganizations(result.data.items)
      updateStats(result.data.items)
    } else {
      setError(result.message || "Failed to fetch organizations")
      console.error("Error fetching organizations:", result.error)
    }
  }

  const fetchAvailablePlans = async () => {
    setLoadingPlans(true)
    const result = await callApi({
      endpoint: "/v1/api/masterPlan/getAllPlans",
      method: "GET",
      disableSnackbar: true,
    })
    if (result.success && result.data && result.data.items) {
      setAvailablePlans(result.data.items)
    } else {
      setError(result.message || "Failed to fetch plans")
      console.error("Error fetching plans:", result.error)
    }
    setLoadingPlans(false)
  }

  // Fetch current permissions for an organization
  const fetchPermissions = async (organizationData) => {
    setLoadingPermissions(true)
    try {
      // Use the permission data from the organization object
      if (organizationData.permission) {
        setPermissions({
          RecruitmentHiring: organizationData.permission.RecruitmentHiring || false,
          InterviewManagement: organizationData.permission.InterviewManagement || false,
          CommandExe: organizationData.permission.CommandExe || false,
          LeadExe: organizationData.permission.LeadExe || false,
          expenseManagement: organizationData.permission.expenseManagement || false,
          fileManager: organizationData.permission.fileManager || false,
          managementFeatures: organizationData.permission.managementFeatures || false,
          assetManagement: organizationData.permission.assetManagement || false,
          notes: organizationData.permission.notes || false,
          chat: organizationData.permission.chat || false,
          verificationSuite: organizationData.permission.verificationSuite || false,

        })
      } else {
        // Default permissions if none exist
        setPermissions({
          RecruitmentHiring: false,
          InterviewManagement: false,
          CommandExe: false,
          LeadExe: false,
          expenseManagement: false,
          fileManager: false,
          chat: false,
          notes: false,
          assetManagement: false,
          managementFeatures: false,
          verificationSuite : false
        })
      }
    } catch (err) {
      setError(`Error loading permissions: ${err.message}`)
      console.error("Error loading permissions:", err)
    } finally {
      setLoadingPermissions(false)
    }
  }

  // Update statistics
  const updateStats = (orgData) => {
    const totalOrgs = orgData.length
    const activeUsers = orgData.filter((org) => org.userId?.email).length
    const withGSTIN = orgData.filter((org) => org.haveGSTIN).length
    setStats((prevStats) => [
      { ...prevStats[0], value: totalOrgs.toString() },
      { ...prevStats[1], value: activeUsers.toString() },
      { ...prevStats[2], value: withGSTIN.toString() },
      { ...prevStats[3], value: "127%" },
    ])
  }

  useEffect(() => {
    fetchOrganizations()
    fetchAllocatedModules()
  }, [])

  // Handle modal functions
  const handleOpenModal = () => {
    setIsEditMode(false)
    setEditingUserId(null)
    setOriginalPassword("")
    setModalOpen(true)
    if (allocatedModules.length === 0) {
      fetchAllocatedModules()
    }
  }

  const handleOpenEditModal = (rowData) => {
    setIsEditMode(true)
    setEditingUserId(rowData.userId?._id)
    setOriginalPassword(rowData.userId?.password || "")
    setAdminFormData({
      userName: rowData.userId?.userName || "",
      email: rowData.userId?.email || "",
      password: "",
      confirmPassword: "",
      allocatedModule: rowData.allocatedModule.map((data) => data._id) || [],
    })
    setModalOpen(true)
    if (allocatedModules.length === 0) {
      fetchAllocatedModules()
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setIsEditMode(false)
    setEditingUserId(null)
    setOriginalPassword("")
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleOpenPlanModal = (rowData) => {
    setSelectedOrgForPlan(rowData)
    setPlanModalOpen(true)
    setSelectedPlan("")
    if (availablePlans.length === 0) {
      fetchAvailablePlans()
    }
  }

  const handleClosePlanModal = () => {
    setPlanModalOpen(false)
    setSelectedOrgForPlan(null)
    setSelectedPlan("")
  }

  // Permission Modal Handlers
  const handleOpenPermissionModal = (rowData) => {
    setSelectedOrgForPermission(rowData)
    setPermissionModalOpen(true)
    fetchPermissions(rowData) // Pass the actual row data instead of just ID
  }

  const handleClosePermissionModal = () => {
    setPermissionModalOpen(false)
    setSelectedOrgForPermission(null)
    setPermissions({
      RecruitmentHiring: false,
      InterviewManagement: false,
      CommandExe: false,
      LeadExe: false,
      expenseManagement: false,
      fileManager: false,
      chat: false,
      notes: false,
      assetManagement: false,
      managementFeatures: false,
    })
  }

  const handlePermissionChange = (permissionKey, value) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionKey]: value,
    }))
  }

  const handleUpdatePermissions = async () => {
    if (!selectedOrgForPermission) {
      setError("No organization selected for permission update")
      return
    }
    setUpdatingPermissions(true)
    const result = await callApi({
      endpoint: "/v1/api/org/permissionUpdate",
      method: "POST",
      data: {
        organizationId: selectedOrgForPermission._id,
        permission: permissions,
      },
  
    })

    if (result.success) {
      setSuccessMessage(result.message)
      handleClosePermissionModal()
      // Refresh the organizations list to show updated permissions
      await fetchOrganizations()
    } else {
      setError(result.message)
    }
    setUpdatingPermissions(false)
  }

  const PlanAssignmentModal = () => {
    if (!planModalOpen) return null
    const selectedPlanDetails = availablePlans.find((plan) => plan.id === selectedPlan)
    return createPortal(
      <Modal
        open={planModalOpen}
        onClose={handleClosePlanModal}
        aria-labelledby="plan-modal-title"
        aria-describedby="plan-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
        }}
      >
        <Fade in={planModalOpen}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: 4,
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.15)",
              p: 4,
              width: 600,
              maxWidth: "90vw",
              border: "1px solid #e2e8f0",
              position: "relative",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            {/* Modal Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#ff9f43",
                    width: 48,
                    height: 48,
                  }}
                >
                  <PaymentIcon sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography id="plan-modal-title" variant="h5" fontWeight={700} color="#1e293b">
                    Assign Plan
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assign a subscription plan to {selectedOrgForPlan?.name || "this organization"}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleClosePlanModal}
                sx={{
                  color: "#64748b",
                  "&:hover": {
                    bgcolor: "#f1f5f9",
                    color: "#1e293b",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Organization Info Card */}
            <Card
              sx={{
                mb: 3,
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#7367F0",
                      color: "white",
                      width: 48,
                      height: 48,
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedOrgForPlan?.name?.charAt(0)?.toUpperCase() || "O"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} color="#1e293b">
                      {selectedOrgForPlan?.name || "Unnamed Organization"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrgForPlan?.userId?.email || "No email provided"}
                    </Typography>
                    {selectedOrgForPlan?.PlanDetail && (
                      <Chip
                        label={`Current: ${selectedOrgForPlan.PlanDetail.planName}`}
                        size="small"
                        color="primary"
                        sx={{ mt: 1, fontSize: "0.75rem" }}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            {/* Plan Selection */}
            <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
              <InputLabel
                id="plan-select-label"
                sx={{
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#7367F0",
                  },
                }}
              >
                Select Plan
              </InputLabel>
              <Select
                labelId="plan-select-label"
                id="plan-select"
                value={selectedPlan}
                onChange={handlePlanSelection}
                label="Select Plan"
                startAdornment={
                  <InputAdornment position="start">
                    <PaymentIcon sx={{ color: "#7367F0", ml: 1 }} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7367F0",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7367F0",
                  },
                  "& .MuiSelect-select": {
                    pl: 6,
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      borderRadius: 8,
                    },
                  },
                  sx: {
                    zIndex: 999999,
                  },
                }}
                disabled={loadingPlans}
              >
                {loadingPlans ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading plans...
                  </MenuItem>
                ) : (
                  availablePlans
                    .filter((plan) => plan.isActive)
                    .map((plan) => (
                      <MenuItem key={plan.id} value={plan.id}>
                        <Box sx={{ width: "100%" }}>
                          <Typography variant="body1" fontWeight={600}>
                            {plan.planName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {plan.planDescription}
                          </Typography>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" fontWeight={700} color="#28c76f">
                              ₹{plan.planPrice.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {plan.planDurationInDays} days
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))
                )}
              </Select>
            </FormControl>
            {/* Selected Plan Details */}
            {selectedPlanDetails && (
              <Card
                sx={{
                  mb: 3,
                  border: "2px solid #7367F0",
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #7367F0 0%, #675DD8 100%)",
                  color: "white",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    {selectedPlanDetails.planName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    {selectedPlanDetails.planDescription}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Price
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        ₹{selectedPlanDetails.planPrice.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Duration
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedPlanDetails.planDurationInDays} days
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Credit Limit
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedPlanDetails.planCreditLimit.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Job Posts
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedPlanDetails.NumberOfJobPosts.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Users
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedPlanDetails.NumberOfUsers.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Analyzers
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedPlanDetails.NumberofAnalizers.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
            {/* Modal Actions */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClosePlanModal}
                sx={{
                  borderColor: "#64748b",
                  color: "#64748b",
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    borderColor: "#475569",
                    color: "#475569",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAssignPlan}
                disabled={assigningPlan || !selectedPlan}
                startIcon={assigningPlan ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
                sx={{
                  bgcolor: "#ff9f43",
                  borderRadius: 2,
                  px: 4,
                  "&:hover": {
                    bgcolor: "#ff8f20",
                  },
                  "&:disabled": {
                    bgcolor: "#94a3b8",
                  },
                }}
              >
                {assigningPlan ? "Assigning..." : "Assign Plan"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>,
      document.body,
    )
  }

  const handleAssignPlan = async () => {
    if (!selectedPlan || !selectedOrgForPlan) {
      setError("Please select a plan to assign")
      return
    }
    setAssigningPlan(true)
    const result = await callApi({
      endpoint: "/v1/api/masterPlan/assignPlanToOrganization",
      method: "POST",
      data: {
        planId: selectedPlan,
        organizationId: selectedOrgForPlan._id,
      },

    })

    if (result.success) {
      setSuccessMessage(result.message)
      handleClosePlanModal()
      await fetchOrganizations()
    } else {
      setError(result.message)
    }
    setAssigningPlan(false)
  }

  const handlePlanSelection = (event) => {
    setSelectedPlan(event.target.value)
  }

  // Optimized input handlers with useCallback
  const handleInputChange = useCallback(
    (field) => (event) => {
      const value = event.target.value
      setAdminFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }))
    },
    [],
  )

  const handleAllocatedModuleChange = useCallback((event) => {
    const value = event.target.value
    setAdminFormData((prevData) => ({
      ...prevData,
      allocatedModule: typeof value === "string" ? value.split(",") : value,
    }))
  }, [])

  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const handleToggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev)
  }, [])

  const resetForm = () => {
    setAdminFormData({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      allocatedModule: [],
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleSaveAdmin = async () => {
    try {
      setError("")
      setSuccessMessage("")
      if (adminFormData.password && !passwordsMatch) {
        setError("Passwords do not match!")
        return
      }
      if (adminFormData.password && adminFormData.password.length < 6) {
        setError("Password must be at least 6 characters long!")
        return
      }
      const { confirmPassword, ...baseData } = adminFormData
      const apiData = { ...baseData }
      if (isEditMode && !adminFormData.password) {
        delete apiData.password
      }

      const endpoint = isEditMode ? `/v1/api/Auth/superAdminUpdate/${editingUserId}` : `/v1/api/Auth/superAdminRegister`
      const method = "POST" // Both create and update use POST in the original code

      const result = await callApi({
        endpoint,
        method,
        data: apiData,
      })

      if (result.success) {
        handleCloseModal()
        setSuccessMessage(result.message)
        await fetchOrganizations()
        resetForm()
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(`Error ${isEditMode ? "updating" : "creating"} admin: ${err.message}`)
      console.error(`Error ${isEditMode ? "updating" : "creating"} admin:`, err)
    }
  }

  // Professional DataGrid columns
  const columns = [
    {
      field: "avatar",
      headerName: "Logo",
      width: 80,
      renderCell: (params) => (
        <Avatar
          sx={{
            bgcolor: "#7367F0",
            color: "white",
            width: 40,
            height: 40,
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {params.row.name?.charAt(0)?.toUpperCase() || "O"}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Organization",
      width: 250,
      renderCell: (params) => (
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mb: 0.5, lineHeight: 1.2 }}>
            {params.value || "Unnamed Organization"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: "0.75rem",
              lineHeight: 1.2,
            }}
          >
            ID: {params.row.id?.slice(-8) || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "PlanDetail",
      headerName: "Plan Name",
      width: 250,
      renderCell: (params) => (
        <Box sx={{ py: 2 }}>
          {params?.row?.PlanDetail ? (
            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.2 }}>
              {params?.row?.PlanDetail?.planName || "Unnamed Plan"}
            </Typography>
          ) : (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                fontSize: "0.75rem",
                lineHeight: 1.2,
              }}
            >
              No Plan Allocated
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "allocatedModule",
      headerName: "Products",
      width: 250,
      renderCell: (params) => (
        <Box sx={{ py: 2 }}>
          {params.row.allocatedModule[0] ? (
            params.row.allocatedModule.map((data) => {
              return (
                <Typography
                  key={data._id}
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ mb: 0.5, lineHeight: 1.2 }}
                >
                  {data?.Name || "Unnamed Organization"}
                </Typography>
              )
            })
          ) : (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                fontSize: "0.75rem",
                lineHeight: 1.2,
              }}
            >
              No Product Added
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "permissions",
      headerName: "Permissions",
      width: 200,
      renderCell: (params) => {
        const permissions = params.row.permission || {}
        const enabledPermissions = Object.entries(permissions)
          .filter(([key, value]) => value === true)
          .map(([key]) => key)
        return (
          <Box sx={{ py: 2 }}>
            {enabledPermissions.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {enabledPermissions.slice(0, 2).map((permission) => (
                  <Chip
                    key={permission}
                    label={permission.replace(/([A-Z])/g, " $1").trim()}
                    size="small"
                    sx={{
                      bgcolor: "#00bad1",
                      color: "white",
                      fontSize: "0.65rem",
                      height: 20,
                    }}
                  />
                ))}
                {enabledPermissions.length > 2 && (
                  <Chip
                    label={`+${enabledPermissions.length - 2}`}
                    size="small"
                    sx={{
                      bgcolor: "#64748b",
                      color: "white",
                      fontSize: "0.65rem",
                      height: 20,
                    }}
                  />
                )}
              </Box>
            ) : (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                }}
              >
                No permissions set
              </Typography>
            )}
          </Box>
        )
      },
    },
    {
      field: "userDetails",
      headerName: "User Information",
      width: 220,
      renderCell: (params) => {
        const email = params.row.userId?.email
        const name = params.row.userId?.name
        const userName = params.row.userId?.userName
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 0.5, lineHeight: 1.2 }}>
              {name || "No user assigned"}
            </Typography>
            <Typography variant="body2" fontWeight={400} color="text.primary" sx={{ mb: 0.5, lineHeight: 1.2 }}>
              {userName || "No user assigned"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                fontSize: "0.75rem",
                lineHeight: 1.2,
                wordBreak: "break-word",
              }}
            >
              {email || "No email provided"}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: "website",
      headerName: "Website",
      width: 150,
      renderCell: (params) => {
        if (!params.value || params.value === "https://example.com") {
          return (
            <Typography variant="body2" color="text.secondary">
              No website
            </Typography>
          )
        }
        return (
          <Tooltip title="Visit website">
            <Button
              variant="outlined"
              size="small"
              startIcon={<WebsiteIcon />}
              onClick={() => window.open(params.value, "_blank")}
              sx={{
                borderColor: "#7367F0",
                color: "#7367F0",
                fontSize: "0.75rem",
                py: 0.5,
                px: 1,
                "&:hover": {
                  bgcolor: "#7367F0",
                  color: "white",
                },
              }}
            >
              Visit
            </Button>
          </Tooltip>
        )
      },
    },
    {
      field: "contact",
      headerName: "Contact Information",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ py: 2 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5, lineHeight: 1.2 }}>
            {params.row.contactPerson || "No contact person"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: "0.75rem",
              lineHeight: 1.2,
              wordBreak: "break-word",
            }}
          >
            {params.row.contactEmail || "No email"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={<LocationIcon sx={{ fontSize: 16 }} />}
          label={params.row.country || "Unknown"}
          size="small"
          variant="outlined"
          sx={{
            borderColor: "#28c76f",
            color: "#28c76f",
            fontSize: "0.75rem",
            height: 24,
            "& .MuiChip-icon": {
              color: "#28c76f",
              fontSize: 14,
            },
            "& .MuiChip-label": {
              px: 1,
            },
          }}
        />
      ),
    },
    {
      field: "gstinStatus",
      headerName: "GSTIN Status",
      width: 130,
      renderCell: (params) => {
        const hasGSTIN = params.row.haveGSTIN
        return (
          <Chip
            icon={hasGSTIN ? <VerifiedIcon sx={{ fontSize: 16 }} /> : <CancelIcon sx={{ fontSize: 16 }} />}
            label={hasGSTIN ? "Verified" : "Unverified"}
            size="small"
            color={hasGSTIN ? "success" : "default"}
            variant={hasGSTIN ? "filled" : "outlined"}
            sx={{
              fontSize: "0.75rem",
              height: 24,
              "& .MuiChip-icon": {
                fontSize: 14,
              },
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        )
      },
    },
    {
      field: "complianceInfo",
      headerName: "Compliance",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ py: 2 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5, lineHeight: 1.2 }}>
            CIN: {params.row.CINNumber || "Not provided"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: "0.75rem",
              lineHeight: 1.2,
            }}
          >
            PAN: {params.row.Pan || "Not provided"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 120,
      renderCell: (params) => {
        if (!params.value)
          return (
            <Typography variant="body2" color="text.secondary">
              Unknown
            </Typography>
          )
        try {
          const date = new Date(params.value)
          return (
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.875rem",
                lineHeight: 1.2,
              }}
            >
              {date.toLocaleDateString()}
            </Typography>
          )
        } catch {
          return (
            <Typography variant="body2" color="text.secondary">
              Invalid date
            </Typography>
          )
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <Grid>
            <Tooltip title="Edit User">
              <IconButton
                onClick={() => handleOpenEditModal(params.row)}
                size="small"
                sx={{
                  color: "#7367F0",
                  "&:hover": {
                    bgcolor: "#7367F0",
                    color: "white",
                  },
                }}
              >
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Assign Plan">
              <IconButton
                onClick={() => handleOpenPlanModal(params.row)}
                size="small"
                sx={{
                  color: "#ff9f43",
                  "&:hover": {
                    bgcolor: "#ff9f43",
                    color: "white",
                  },
                }}
              >
                <PaymentIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Manage Permissions">
              <IconButton
                onClick={() => handleOpenPermissionModal(params.row)}
                size="small"
                sx={{
                  color: "#00bad1",
                  "&:hover": {
                    bgcolor: "#00bad1",
                    color: "white",
                  },
                }}
              >
                <ManageAccountsIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Grid>
        )
      },
      sortable: false,
      filterable: false,
    },
  ]

  const rows = organizations.map((org, index) => ({
    id: org._id || `org-${index}`,
    ...org,
  }))

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(115,103,240,0.15) 1px, transparent 0)",
        backgroundSize: "20px 20px",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Professional Header */}
        <Fade in={true} timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{
                    color: "#1e293b",
                    mb: 1,
                  }}
                >
                  Organization Management
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem" }}>
                  Manage and monitor all registered organizations in your platform
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: "#7367F0",
                  width: 64,
                  height: 64,
                  boxShadow: "0 8px 16px rgba(115,103,240,0.3)",
                }}
              >
                <BusinessIcon sx={{ fontSize: 32 }} />
              </Avatar>
            </Box>
          </Box>
        </Fade>
        {/* Professional Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Fade in={true} timeout={1000 + index * 200}>
                <div>
                  <StatsCard {...stat} />
                </div>
              </Fade>
            </Grid>
          ))}
        </Grid>
        {/* Professional Control Panel */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <DashboardIcon sx={{ color: "#7367F0", fontSize: 28 }} />
              <Typography variant="h6" fontWeight={600} color="#1e293b">
                Organizations Dashboard
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <TextField
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{
                  width: 300,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                    "&:hover fieldset": {
                      borderColor: "#7367F0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#7367F0",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                onClick={handleOpenModal}
                startIcon={<PersonAddIcon />}
                sx={{
                  borderColor: "#28c76f",
                  color: "#28c76f",
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    bgcolor: "#28c76f",
                    color: "white",
                    borderColor: "#28c76f",
                  },
                }}
              >
                Add Admin
              </Button>
              <Button
                variant="contained"
                onClick={fetchOrganizations}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                sx={{
                  bgcolor: "#7367F0",
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    bgcolor: "#675DD8",
                  },
                }}
              >
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </Stack>
          </Box>
        </Paper>
 
        {/* Professional DataGrid */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          {organizations.length > 0 ? (
            <Box sx={{ height: 700, width: "100%" }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                checkboxSelection
                disableRowSelectionOnClick
                loading={loading}
                rowHeight={72}
                slots={{
                  toolbar: ProfessionalToolbar,
                }}
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f8fafc",
                    borderBottom: "2px solid #e2e8f0",
                    color: "#1e293b",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    minHeight: "56px !important",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    "&:focus": {
                      outline: "none",
                    },
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    "&:focus": {
                      outline: "none",
                    },
                  },
                  "& .MuiDataGrid-row": {
                    minHeight: "72px !important",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      "& .MuiDataGrid-cell": {
                        borderBottomColor: "#e2e8f0",
                      },
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#ede7f6",
                      "&:hover": {
                        backgroundColor: "#e1d5e7",
                      },
                    },
                  },
                  "& .MuiCheckbox-root.Mui-checked": {
                    color: "#7367F0",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #e2e8f0",
                    backgroundColor: "#fafbfc",
                  },
                }}
                getRowId={(row) => row.id}
              />
            </Box>
          ) : (
            !loading && (
              <Box
                sx={{
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  p: 4,
                }}
              >
                <Avatar sx={{ bgcolor: "#e2e8f0", width: 80, height: 80 }}>
                  <BusinessIcon sx={{ fontSize: 40, color: "#64748b" }} />
                </Avatar>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={600} color="text.primary" mb={1}>
                    No Organizations Found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Get started by refreshing the data or check your connection
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={fetchOrganizations}
                    startIcon={<RefreshIcon />}
                    sx={{
                      bgcolor: "#7367F0",
                      "&:hover": { bgcolor: "#675DD8" },
                    }}
                  >
                    Refresh Data
                  </Button>
                </Box>
              </Box>
            )
          )}
        </Paper>
        {/* Professional Footer */}
        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #e2e8f0" }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {filteredRows.length} of {organizations.length} organizations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date().toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Container>
      {/* Portal-based Modals - Rendered outside component tree */}
      <AdminModal
        modalOpen={modalOpen}
        isEditMode={isEditMode}
        adminFormData={adminFormData}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        allocatedModules={allocatedModules}
        loadingModules={loadingModules}
        passwordsMatch={passwordsMatch}
        loading={loading}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        handleTogglePasswordVisibility={handleTogglePasswordVisibility}
        handleToggleConfirmPasswordVisibility={handleToggleConfirmPasswordVisibility}
        handleAllocatedModuleChange={handleAllocatedModuleChange}
        handleSaveAdmin={handleSaveAdmin}
      />
      <PlanAssignmentModal />
      <PermissionModal
        permissionModalOpen={permissionModalOpen}
        selectedOrgForPermission={selectedOrgForPermission}
        permissions={permissions}
        loadingPermissions={loadingPermissions}
        updatingPermissions={updatingPermissions}
        handleClosePermissionModal={handleClosePermissionModal}
        handlePermissionChange={handlePermissionChange}
        handleUpdatePermissions={handleUpdatePermissions}
      />
    </Box>
  )
}

export default UsersManagement
