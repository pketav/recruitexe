"use client"
import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  CircularProgress,
  Fade,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material"
import {
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  Apps as AppsIcon,
  Close as CloseIcon,
  Psychology as AIIcon,
  AutoAwesome as SparkleIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Rule as RuleIcon,
} from "@mui/icons-material"
import { useApi } from "@core/hooks/useApi"

// Credit Rule Form Modal Component
const CreditRuleFormModal = ({ open, onClose, editingRule, onSave, loading }) => {
  const [formData, setFormData] = useState({
    actionType: "",
    creditsRequired: "",
    description: "",
  })
  const [errors, setErrors] = useState({})
  const actionTypes = [
    { value: "DESIGNATION_AI", label: "Designation AI Analysis" },
    { value: "AI_SCREENING", label: "AI Resume Screening" },
    { value: "DEPARTMENT_AI", label: "Department AI Analysis" },
    { value: "LINKEDIN_AI", label: "Linkedin AI Analysis" },
    { value: "JOBDESCRIPTION_AI", label: "Job Description AI Analysis" },
    // { value: "JOB_MATCHING", label: "Job Matching" },
    // { value: "RESUME_PARSING", label: "Resume Parsing" },
    // { value: "INTERVIEW_ANALYSIS", label: "Interview Analysis" },
  ]
  useEffect(() => {
    if (editingRule) {
      setFormData({
        actionType: editingRule.actionType || "",
        creditsRequired: editingRule.creditsRequired || "",
        description: editingRule.description || "",
      })
    } else {
      setFormData({
        actionType: "",
        creditsRequired: "",
        description: "",
      })
    }
    setErrors({})
  }, [editingRule, open])
  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }
  const validateForm = () => {
    const newErrors = {}
    if (!formData.actionType.trim()) newErrors.actionType = "Action type is required"
    if (!formData.creditsRequired || formData.creditsRequired <= 0)
      newErrors.creditsRequired = "Valid credit amount is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        creditsRequired: Number(formData.creditsRequired),
      }
      onSave(submitData)
    }
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <RuleIcon />
          <Typography variant="h6" fontWeight={600}>
            {editingRule ? "Edit Credit Rule" : "Create New Credit Rule"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.actionType}>
              <InputLabel>Action Type</InputLabel>
              <Select value={formData.actionType} onChange={handleInputChange("actionType")} label="Action Type">
                {actionTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.actionType && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.actionType}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Credits Required"
              type="number"
              value={formData.creditsRequired}
              onChange={handleInputChange("creditsRequired")}
              error={!!errors.creditsRequired}
              helperText={errors.creditsRequired}
              InputProps={{
                startAdornment: <InputAdornment position="start">🪙</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange("description")}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Describe what this credit rule is used for..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            bgcolor: "#ff6b35",
            borderRadius: 2,
            "&:hover": { bgcolor: "#e55a2b" },
          }}
        >
          {loading ? "Saving..." : editingRule ? "Update Rule" : "Create Rule"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const CreditPlanFormModal = ({ open, onClose, editingPlan, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    NumberofCredit: "",
    pricePerCredit: "",
    PriceofCredit: ""
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingPlan) {
      const calculatedPricePerCredit = editingPlan.PriceofCredit && editingPlan.NumberofCredit
        ? Number(editingPlan.PriceofCredit) / Number(editingPlan.NumberofCredit)
        : ""
      setFormData({
        name: editingPlan.name || "",
        description: editingPlan.description || "",
        NumberofCredit: editingPlan.NumberofCredit || "",
        pricePerCredit: calculatedPricePerCredit || "",
        PriceofCredit: editingPlan.PriceofCredit || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        NumberofCredit: "",
        pricePerCredit: "",
        PriceofCredit: ""
      })
    }
    setErrors({})
  }, [editingPlan, open])

  const handleInputChange = (field) => (event) => {
    const value = event.target.value
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-calculate pricePerCredit
      if ((field === "PriceofCredit" || field === "NumberofCredit") &&
        updated.PriceofCredit && updated.NumberofCredit) {
        const price = parseFloat(updated.PriceofCredit)
        const credits = parseFloat(updated.NumberofCredit)
        if (!isNaN(price) && !isNaN(credits) && credits > 0) {
          updated.pricePerCredit = (price / credits).toFixed(2)
        } else {
          updated.pricePerCredit = ""
        }
      }

      return updated
    })

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Plan name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.PriceofCredit || formData.PriceofCredit <= 0) newErrors.PriceofCredit = "Valid price is required"
    if (!formData.NumberofCredit || formData.NumberofCredit <= 0) newErrors.NumberofCredit = "Valid number of credits is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        NumberofCredit: Number(formData.NumberofCredit),
        pricePerCredit: Number(formData.pricePerCredit),
        PriceofCredit: Number(formData.PriceofCredit),
      }
      onSave(submitData)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3, background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" } }}
    >
      <DialogTitle sx={{
        background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
        color: "white", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AIIcon />
          <Typography variant="h6" fontWeight={600}>
            {editingPlan ? "Edit Credit Plan" : "Create New Credit Plan"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth label="Plan Name" variant="outlined"
              value={formData.name} onChange={handleInputChange("name")}
              error={!!errors.name} helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth label="Total Price" type="number"
              value={formData.PriceofCredit}
              onChange={handleInputChange("PriceofCredit")}
              error={!!errors.PriceofCredit} helperText={errors.PriceofCredit}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth label="Number Of Credits" type="number"
              value={formData.NumberofCredit}
              onChange={handleInputChange("NumberofCredit")}
              error={!!errors.NumberofCredit} helperText={errors.NumberofCredit}
              InputProps={{ startAdornment: <InputAdornment position="start">#</InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth label="Price per Credit"
              value={formData.pricePerCredit}
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth label="Plan Description" multiline rows={3}
              value={formData.description}
              onChange={handleInputChange("description")}
              error={!!errors.description} helperText={errors.description}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            bgcolor: "#10b981",
            borderRadius: 2,
            "&:hover": { bgcolor: "#059669" },
          }}
        >
          {loading ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Regular Plan Form Modal Component
const PlanFormModal = ({ open, onClose, editingPlan, onSave, loading }) => {
  const [formData, setFormData] = useState({
    planName: "",
    planDescription: "",
    planPrice: "",
    planDurationInDays: "",
    planCreditLimit: "",
    NumberOfJobPosts: "",
    NumberOfUsers: "",
    NumberofAnalizers: "",
  })
  const [errors, setErrors] = useState({})
  useEffect(() => {
    if (editingPlan) {
      setFormData({
        planName: editingPlan.planName || "",
        planDescription: editingPlan.planDescription || "",
        planPrice: editingPlan.planPrice || "",
        planDurationInDays: editingPlan.planDurationInDays || "",
        planCreditLimit: editingPlan.planCreditLimit || "",
        NumberOfJobPosts: editingPlan.NumberOfJobPosts || "",
        NumberOfUsers: editingPlan.NumberOfUsers || "",
        NumberofAnalizers: editingPlan.NumberofAnalizers || "",
      })
    } else {
      setFormData({
        planName: "",
        planDescription: "",
        planPrice: "",
        planDurationInDays: "",
        planCreditLimit: "",
        NumberOfJobPosts: "",
        NumberOfUsers: "",
        NumberofAnalizers: "",
      })
    }
    setErrors({})
  }, [editingPlan, open])
  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }
  const validateForm = () => {
    const newErrors = {}
    if (!formData.planName.trim()) newErrors.planName = "Plan name is required"
    if (!formData.planDescription.trim()) newErrors.planDescription = "Description is required"
    if (!formData.planPrice || formData.planPrice <= 0) newErrors.planPrice = "Valid price is required"
    if (!formData.planDurationInDays || formData.planDurationInDays <= 0)
      newErrors.planDurationInDays = "Valid duration is required"
    // if (!formData.planCreditLimit || formData.planCreditLimit <= 0)
    //   newErrors.planCreditLimit = "Valid credit limit is required"
    if (!formData.NumberOfJobPosts || formData.NumberOfJobPosts <= 0)
      newErrors.NumberOfJobPosts = "Valid job posts number is required"
    if (!formData.NumberOfUsers || formData.NumberOfUsers <= 0)
      newErrors.NumberOfUsers = "Valid users number is required"
    if (!formData.NumberofAnalizers || formData.NumberofAnalizers <= 0)
      newErrors.NumberofAnalizers = "Valid analyzers number is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        planPrice: Number(formData.planPrice),
        planDurationInDays: Number(formData.planDurationInDays),
        planCreditLimit: Number(formData.planCreditLimit),
        NumberOfJobPosts: Number(formData.NumberOfJobPosts),
        NumberOfUsers: Number(formData.NumberOfUsers),
        NumberofAnalizers: Number(formData.NumberofAnalizers),
      }
      onSave(submitData)
    }
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #7367F0 0%, #9C88FF 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {editingPlan ? "Edit Plan" : "Create New Plan"}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Plan Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Plan Name"
              value={formData.planName}
              onChange={handleInputChange("planName")}
              error={!!errors.planName}
              helperText={errors.planName}
              variant="outlined"
            />
          </Grid>
          {/* Plan Price */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Plan Price"
              type="number"
              value={formData.planPrice}
              onChange={handleInputChange("planPrice")}
              error={!!errors.planPrice}
              helperText={errors.planPrice}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
          {/* Plan Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Plan Description"
              multiline
              rows={3}
              value={formData.planDescription}
              onChange={handleInputChange("planDescription")}
              error={!!errors.planDescription}
              helperText={errors.planDescription}
            />
          </Grid>
          {/* Plan Duration */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Duration (Days)"
              type="number"
              value={formData.planDurationInDays}
              onChange={handleInputChange("planDurationInDays")}
              error={!!errors.planDurationInDays}
              helperText={errors.planDurationInDays}
            />
          </Grid>
          {/* Number of Job Posts */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Number of Job Posts"
              type="number"
              value={formData.NumberOfJobPosts}
              onChange={handleInputChange("NumberOfJobPosts")}
              error={!!errors.NumberOfJobPosts}
              helperText={errors.NumberOfJobPosts}
            />
          </Grid>
          {/* Number of Users */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Number of Users"
              type="number"
              value={formData.NumberOfUsers}
              onChange={handleInputChange("NumberOfUsers")}
              error={!!errors.NumberOfUsers}
              helperText={errors.NumberOfUsers}
            />
          </Grid>
          {/* Number of Analyzers */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Number of Analyzers"
              type="number"
              value={formData.NumberofAnalizers}
              onChange={handleInputChange("NumberofAnalizers")}
              error={!!errors.NumberofAnalizers}
              helperText={errors.NumberofAnalizers}
            />
          </Grid>
          {/* Optional: Uncomment if needed */}
          {/* <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Credit Limit"
              type="number"
              value={formData.planCreditLimit}
              onChange={handleInputChange("planCreditLimit")}
              error={!!errors.planCreditLimit}
              helperText={errors.planCreditLimit}
            />
          </Grid> */}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            bgcolor: "#7367F0",
            borderRadius: 2,
            "&:hover": { bgcolor: "#675DD8" },
          }}
        >
          {loading ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Credit Plan Card Component
const CreditPlanCard = ({ plan, isPopular = false, onEdit }) => {
  const totalValue = plan.NumberofCredit * plan.pricePerCredit
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        background: isPopular
          ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
        border: isPopular ? "none" : "2px solid #10b981",
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: isPopular ? "0 20px 40px rgba(16, 185, 129, 0.3)" : "0 20px 40px rgba(16, 185, 129, 0.2)",
        },
      }}
    >
      {isPopular && (
        <Box
          sx={{
            position: "absolute",
            top: -1,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "#ff9f43",
            color: "white",
            px: 3,
            py: 0.5,
            borderRadius: "0 0 12px 12px",
            fontSize: "0.75rem",
            fontWeight: 700,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <SparkleIcon sx={{ fontSize: 14 }} />
          BEST VALUE
        </Box>
      )}
      <CardContent sx={{ p: 4, color: isPopular ? "white" : "inherit" }}>
        {/* Plan Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: isPopular ? "rgba(255, 255, 255, 0.2)" : "#10b981",
              color: isPopular ? "white" : "white",
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              backdropFilter: isPopular ? "blur(10px)" : "none",
            }}
          >
            <AIIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: isPopular ? "white" : "#1e293b" }}>
            {plan.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: isPopular ? 0.9 : 0.7,
              fontSize: "1rem",
              color: isPopular ? "white" : "#64748b",
            }}
          >
            {plan.description}
          </Typography>
        </Box>
        {/* Pricing */}
        
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="body2"
            sx={{
              opacity: isPopular ? 0.8 : 0.6,
              fontWeight: 500,
              color: isPopular ? "white" : "#64748b",
            }}
          >
            Credits • ₹{plan.pricePerCredit} per credit
          </Typography>
        </Box>
        {/* Features List */}
        <List sx={{ mb: 3 }}>
          {[`${plan.PriceofCredit || ''} Plan Price`,`${plan.NumberofCredit || ''} Number Of Credits`, `₹${plan.pricePerCredit} per Credit`, "AI Resume Analysis", "AI Job Matching", "24/7 Support"].map(
            (feature, index) => (
              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon
                    sx={{
                      fontSize: 20,
                      color: isPopular ? "rgba(255, 255, 255, 0.9)" : "#10b981",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={feature}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: isPopular ? "rgba(255, 255, 255, 0.9)" : "#475569",
                    },
                  }}
                />
              </ListItem>
            ),
          )}
        </List>
        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => onEdit(plan)}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
            fontSize: "0.875rem",
            mb: 1,
            ...(isPopular
              ? {
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                },
              }
              : {
                bgcolor: "#10b981",
                "&:hover": {
                  bgcolor: "#059669",
                },
              }),
          }}
        >
          Edit Credit Plan
        </Button>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: isPopular ? "rgba(255, 255, 255, 0.7)" : "#64748b",
            fontSize: "0.75rem",
          }}
        >
          AI Credit Package
        </Typography>
      </CardContent>
    </Card>
  )
}

// Professional Plan Card Component
const PlanCard = ({ plan, isPopular = false, onEdit }) => {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        background: isPopular
          ? "linear-gradient(135deg, #7367F0 0%, #9C88FF 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: isPopular ? "none" : "1px solid #e2e8f0",
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: isPopular ? "0 20px 40px rgba(115, 103, 240, 0.3)" : "0 20px 40px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {isPopular && (
        <Box
          sx={{
            position: "absolute",
            top: -1,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "#ff9f43",
            color: "white",
            px: 3,
            py: 0.5,
            borderRadius: "0 0 12px 12px",
            fontSize: "0.75rem",
            fontWeight: 700,
            zIndex: 1,
          }}
        >
          MOST POPULAR
        </Box>
      )}
      <CardContent sx={{ p: 4, color: isPopular ? "white" : "inherit" }}>
        {/* Plan Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: isPopular ? "rgba(255, 255, 255, 0.2)" : "#7367F0",
              color: isPopular ? "white" : "white",
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              backdropFilter: isPopular ? "blur(10px)" : "none",
            }}
          >
            <PaymentIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: isPopular ? "white" : "#1e293b" }}>
            {plan.planName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: isPopular ? 0.9 : 0.7,
              fontSize: "1rem",
            }}
          >
            {plan.planDescription}
          </Typography>
        </Box>
        {/* Pricing */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 1 }}>
            <Typography variant="h3" fontWeight={700} sx={{ color: isPopular ? "white" : "#1e293b" }}>
              ₹{plan.planPrice?.toLocaleString()}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: isPopular ? 0.8 : 0.6,
                fontWeight: 500,
              }}
            >
              /month
            </Typography>
          </Box>
        </Box>
        {/* Features List */}
        <List sx={{ mb: 3 }}>
          {[
            `${plan.NumberOfJobPosts?.toLocaleString()} Job Posts`,
            `${plan.NumberOfUsers?.toLocaleString()} Users`,
            `${plan.NumberofAnalizers?.toLocaleString()} Analyzers`,
            `${plan.planCreditLimit?.toLocaleString()} Credits`,
            `${plan.planDurationInDays} Days Duration`,
            "24/7 Support",
          ].map((feature, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleIcon
                  sx={{
                    fontSize: 20,
                    color: isPopular ? "rgba(255, 255, 255, 0.9)" : "#28c76f",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={feature}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: isPopular ? "rgba(255, 255, 255, 0.9)" : "#475569",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
        {/* Stats */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: isPopular ? "white" : "#1e293b" }}>
                  {plan.NumberOfUsers?.toLocaleString()}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: isPopular ? 0.8 : 0.6,
                    fontSize: "0.75rem",
                  }}
                >
                  Max Users
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: isPopular ? "white" : "#1e293b" }}>
                  {plan.planDurationInDays}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: isPopular ? 0.8 : 0.6,
                    fontSize: "0.75rem",
                  }}
                >
                  Days
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => onEdit(plan)}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
            fontSize: "0.875rem",
            mb: 1,
            ...(isPopular
              ? {
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                },
              }
              : {
                bgcolor: "#7367F0",
                "&:hover": {
                  bgcolor: "#675DD8",
                },
              }),
          }}
        >
          Edit Plan
        </Button>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: isPopular ? "rgba(255, 255, 255, 0.7)" : "#64748b",
            fontSize: "0.75rem",
          }}
        >
          Status: {plan.isActive ? "Active" : "Inactive"}
        </Typography>
      </CardContent>
    </Card>
  )
}

// Stats Card for Plans Overview
const PlansStatsCard = ({ title, value, icon: Icon, color, subtitle }) => {
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
      </CardContent>
    </Card>
  )
}

// Credit Rules Table Component
const CreditRulesTable = ({ rules, onEdit, loading }) => {
  const getActionTypeColor = (actionType) => {
    if (!actionType) return "#64748b"
    const colors = {
      DESIGNATION_AI: "#10b981",
      AI_SCREENING: "#7367F0",
      DEPARTMENT_AI: "#e91e63",
      SKILL_MATCHING: "#ff6b35",
      PERSONALITY_ANALYSIS: "#00bad1",
      JOB_MATCHING: "#28c76f",
      RESUME_PARSING: "#ff9f43",
      INTERVIEW_ANALYSIS: "#8b5cf6",
    }
    return colors[actionType] || "#64748b"
  }
  const formatActionType = (actionType) => {
    if (!actionType) return "Unknown Action"
    return actionType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
        <CircularProgress sx={{ color: "#ff6b35" }} />
      </Box>
    )
  }
  if (rules.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
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
          <Avatar sx={{ bgcolor: "#fff7ed", width: 80, height: 80 }}>
            <RuleIcon sx={{ fontSize: 40, color: "#ff6b35" }} />
          </Avatar>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={600} color="text.primary" mb={1}>
              No Credit Rules Found
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Create credit rules to define AI action costs
            </Typography>
          </Box>
        </Box>
      </Paper>
    )
  }
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f8fafc" }}>
            <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>Action Type</TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>Credits Required</TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#1e293b", textAlign: "center" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rules.map((rule, index) => (
            <TableRow
              key={rule._id || index}
              sx={{
                "&:hover": { bgcolor: "#f8fafc" },
                transition: "background-color 0.2s ease",
              }}
            >
              <TableCell>
                <Chip
                  label={formatActionType(rule.actionType)}
                  sx={{
                    bgcolor: getActionTypeColor(rule.actionType),
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h6" fontWeight={600} color="#1e293b">
                    {rule.creditsRequired}
                  </Typography>
                  <Typography variant="body2" color="#64748b">
                    credits
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="#475569" sx={{ maxWidth: 300 }}>
                  {rule.description}
                </Typography>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <IconButton
                  onClick={() => onEdit(rule)}
                  sx={{
                    color: "#ff6b35",
                    "&:hover": {
                      bgcolor: "#fff7ed",
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const PlansManagement = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [plans, setPlans] = useState([])
  const [creditPlans, setCreditPlans] = useState([])
  const [creditRules, setCreditRules] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [creditModalOpen, setCreditModalOpen] = useState(false)
  const [creditRuleModalOpen, setCreditRuleModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [editingCreditPlan, setEditingCreditPlan] = useState(null)
  const [editingCreditRule, setEditingCreditRule] = useState(null)
  const { callApi, loading } = useApi()

  // Fetch all subscription plans
  const fetchPlans = async () => {
    const result = await callApi({
      endpoint: "/v1/api/masterPlan/getAllPlans",
      method: "GET",
      disableSnackbar: true,
    })
    if (result.success && result.data && result.data.items) {
      setPlans(result.data.items)
    }
  }

  // Fetch all credit AI plans
  const fetchCreditPlans = async () => {
    const result = await callApi({
      endpoint: "/v1/api/masterPlan/aiplans",
      method: "GET",
      disableSnackbar: true,
    })
    if (result.data && result.data.items) {
      const creditPlansData = Array.isArray(result.data.items) ? result.data.items : [result.data.items]
      setCreditPlans(creditPlansData)
    }
  }

  // Fetch all credit rules
  const fetchCreditRules = async () => {
    const result = await callApi({
      endpoint: "/v1/api/masterPlan/getAllCreditRules",
      method: "GET",
      disableSnackbar: true,
    })
    // Handle the response structure properly
    if (result.success && result.data && result.data.items) {
      const rulesData = Array.isArray(result.data.items) ? result.data.items : [result.data.items]
      setCreditRules(rulesData)
    } else if (result.data && result.data.status && result.data.items) {
      // Handle direct API response structure
      const rulesData = Array.isArray(result.data.items) ? result.data.items : [result.data.items]
      setCreditRules(rulesData)
    } else if (result.status && result.items) {
      // Handle direct response without nested data
      const rulesData = Array.isArray(result.items) ? result.items : [result.items]
      setCreditRules(rulesData)
    }
  }

  // Create or update subscription plan
  const handleSavePlan = async (planData) => {
    const endpoint = editingPlan ? `/v1/api/masterPlan/updatePlan/${editingPlan.id}` : "/v1/api/masterPlan/createPlan"
    const result = await callApi({
      endpoint,
      method: "POST",
      data: planData,
      disableSnackbar: false,
    })
    if (result.success) {
      setModalOpen(false)
      setEditingPlan(null)
      fetchPlans()
    }
  }

  // Create or update credit plan
  const handleSaveCreditPlan = async (planData) => {
    const endpoint = editingCreditPlan
      ? `/v1/api/masterPlan/aiplans/${editingCreditPlan._id}`
      : "/v1/api/masterPlan/creditaiplans"
    const callMethod = editingCreditPlan ? "PUT" : "POST"
    const result = await callApi({
      endpoint,
      method: callMethod,
      data: planData,
      disableSnackbar: false,
    })
    if (result.success) {
      setCreditModalOpen(false)
      setEditingCreditPlan(null)
      fetchCreditPlans()
    }
  }

  // Create or update credit rule
  const handleSaveCreditRule = async (ruleData) => {
    const endpoint = editingCreditRule
      ? `/v1/api/masterPlan/updateCreditRule/${editingCreditRule._id}`
      : "/v1/api/masterPlan/createCreditRule"
    const result = await callApi({
      endpoint,
      method: "POST",
      data: ruleData,
      disableSnackbar: false,
    })
    if (result.success) {
      setCreditRuleModalOpen(false)
      setEditingCreditRule(null)
      fetchCreditRules()
    }
  }

  // Handle edit plan
  const handleEditPlan = (plan) => {
    setEditingPlan(plan)
    setModalOpen(true)
  }

  // Handle edit credit plan
  const handleEditCreditPlan = (plan) => {
    setEditingCreditPlan(plan)
    setCreditModalOpen(true)
  }

  // Handle edit credit rule
  const handleEditCreditRule = (rule) => {
    setEditingCreditRule(rule)
    setCreditRuleModalOpen(true)
  }

  // Handle add new plan
  const handleAddPlan = () => {
    setEditingPlan(null)
    setModalOpen(true)
  }

  // Handle add new credit plan
  const handleAddCreditPlan = () => {
    setEditingCreditPlan(null)
    setCreditModalOpen(true)
  }

  // Handle add new credit rule
  const handleAddCreditRule = () => {
    setEditingCreditRule(null)
    setCreditRuleModalOpen(true)
  }

  // Handle close modals
  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingPlan(null)
  }
  const handleCloseCreditModal = () => {
    setCreditModalOpen(false)
    setEditingCreditPlan(null)
  }
  const handleCloseCreditRuleModal = () => {
    setCreditRuleModalOpen(false)
    setEditingCreditRule(null)
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Get most popular plan index
  const getMostPopularIndex = (plansList) => {
    if (plansList.length === 0) return -1
    return plansList.reduce((maxIndex, plan, index, array) => {
      const currentPrice = plan.planPrice || plan.pricePerCredit * plan.NumberofCredit || 0
      const maxPrice = array[maxIndex].planPrice || array[maxIndex].pricePerCredit * array[maxIndex].NumberofCredit || 0
      return currentPrice > maxPrice ? index : maxIndex
    }, 0)
  }

  // Calculate statistics
  const calculateStats = () => {
    const totalRevenue = plans.reduce((sum, plan) => sum + (plan.planPrice || 0), 0)
    const totalCreditRevenue = creditPlans.reduce(
      (sum, plan) => sum + (plan.pricePerCredit * plan.NumberofCredit || 0),
      0,
    )
    const totalSubscribers = plans.reduce((sum, plan) => sum + (plan.NumberOfUsers || 0), 0)
    const totalCredits = creditPlans.reduce((sum, plan) => sum + (plan.NumberofCredit || 0), 0)
    const totalCreditRulesValue = creditRules.reduce((sum, rule) => sum + (rule.creditsRequired || 0), 0)
    return {
      totalRevenue: `₹${((totalRevenue + totalCreditRevenue) / 1000).toFixed(1)}K`,
      activePlans: plans.length + creditPlans.length,
      subscriptions: totalSubscribers.toLocaleString(),
      totalCredits: totalCredits.toLocaleString(),
      creditRules: creditRules.length,
      avgCreditsPerRule: creditRules.length > 0 ? Math.round(totalCreditRulesValue / creditRules.length) : 0,
    }
  }
  const stats = calculateStats()

  // Load data on component mount
  useEffect(() => {
    fetchPlans()
    fetchCreditPlans()
    fetchCreditRules()
  }, [])

  const statsData = [
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      icon: MoneyIcon,
      color: "#28c76f",
      subtitle: "Combined plans",
    },
    {
      title: "Active Plans",
      value: stats.activePlans,
      icon: AppsIcon,
      color: "#7367F0",
      subtitle: "Available plans",
    },
    {
      title: "Credit Rules",
      value: stats.creditRules,
      icon: RuleIcon,
      color: "#ff6b35",
      subtitle: `Avg ${stats.avgCreditsPerRule} credits`,
    },
    {
      title: "AI Credits",
      value: stats.totalCredits,
      icon: AIIcon,
      color: "#10b981",
      subtitle: "Available credits",
    },
  ]

  return (
    <Box>
      {/* Plans Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Fade in={true} timeout={800 + index * 200}>
              <div>
                <PlansStatsCard {...stat} />
              </div>
            </Fade>
          </Grid>
        ))}
      </Grid>
      {/* Plans Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PaymentIcon sx={{ color: "#7367F0", fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600} color="#1e293b">
              Plans Management System
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                fetchPlans()
                fetchCreditPlans()
                fetchCreditRules()
              }}
              disabled={loading}
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
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </Stack>
        </Box>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
            },
            "& .Mui-selected": {
              color: "#7367F0 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#7367F0",
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PaymentIcon />
                Subscription Plans ({plans.length})
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AIIcon />
                AI Credit Plans ({creditPlans.length})
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <RuleIcon />
                Credit Rules ({creditRules.length})
              </Box>
            }
          />
        </Tabs>
      </Paper>
      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {/* Subscription Plans Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight={600} color="#1e293b">
              Subscription Plans
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPlan}
              sx={{
                bgcolor: "#7367F0",
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  bgcolor: "#675DD8",
                },
              }}
            >
              Add New Plan
            </Button>
          </Box>
          {/* Subscription Plans Grid */}
          {plans.length > 0 ? (
            <Grid container spacing={4}>
              {plans.map((plan, index) => (
                <Grid item xs={12} md={6} lg={4} key={plan.id}>
                  <Fade in={true} timeout={1000 + index * 200}>
                    <div>
                      <PlanCard plan={plan} isPopular={index === getMostPopularIndex(plans)} onEdit={handleEditPlan} />
                    </div>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          ) : (
            !loading && (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                }}
              >
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
                    <PaymentIcon sx={{ fontSize: 40, color: "#64748b" }} />
                  </Avatar>
                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight={600} color="text.primary" mb={1}>
                      No Subscription Plans Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                      Get started by creating your first subscription plan
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleAddPlan}
                      startIcon={<AddIcon />}
                      sx={{
                        bgcolor: "#7367F0",
                        "&:hover": { bgcolor: "#675DD8" },
                      }}
                    >
                      Create First Plan
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )
          )}
        </Box>
      )}
      {activeTab === 1 && (
        <Box>
          {/* Credit Plans Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight={600} color="#1e293b">
              AI Credit Plans
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCreditPlan}
              sx={{
                bgcolor: "#10b981",
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  bgcolor: "#059669",
                },
              }}
            >
              Add Credit Plan
            </Button>
          </Box>
          {/* Credit Plans Grid */}
          {creditPlans.length > 0 ? (
            <Grid container spacing={4}>
              {creditPlans.map((plan, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Fade in={true} timeout={1000 + index * 200}>
                    <div>
                      <CreditPlanCard
                        plan={plan}
                        isPopular={index === getMostPopularIndex(creditPlans)}
                        onEdit={handleEditCreditPlan}
                      />
                    </div>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          ) : (
            !loading && (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                }}
              >
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
                  <Avatar sx={{ bgcolor: "#dcfce7", width: 80, height: 80 }}>
                    <AIIcon sx={{ fontSize: 40, color: "#10b981" }} />
                  </Avatar>
                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight={600} color="text.primary" mb={1}>
                      No AI Credit Plans Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                      Create AI credit packages for your users
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleAddCreditPlan}
                      startIcon={<AddIcon />}
                      sx={{
                        bgcolor: "#10b981",
                        "&:hover": { bgcolor: "#059669" },
                      }}
                    >
                      Create First Credit Plan
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )
          )}
        </Box>
      )}
      {activeTab === 2 && (
        <Box>
          {/* Credit Rules Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight={600} color="#1e293b">
              AI Credit Rules
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCreditRule}
              sx={{
                bgcolor: "#ff6b35",
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  bgcolor: "#e55a2b",
                },
              }}
            >
              Add Credit Rule
            </Button>
          </Box>
          {/* Credit Rules Table */}
          <CreditRulesTable rules={creditRules} onEdit={handleEditCreditRule} loading={loading} />
        </Box>
      )}
      {/* Loading State */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <CircularProgress sx={{ color: "#7367F0" }} />
        </Box>
      )}
      {/* Plan Form Modal */}
      <PlanFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        editingPlan={editingPlan}
        onSave={handleSavePlan}
        loading={loading}
      />
      {/* Credit Plan Form Modal */}
      <CreditPlanFormModal
        open={creditModalOpen}
        onClose={handleCloseCreditModal}
        editingPlan={editingCreditPlan}
        onSave={handleSaveCreditPlan}
        loading={loading}
      />
      {/* Credit Rule Form Modal */}
      <CreditRuleFormModal
        open={creditRuleModalOpen}
        onClose={handleCloseCreditRuleModal}
        editingRule={editingCreditRule}
        onSave={handleSaveCreditRule}
        loading={loading}
      />
    </Box>
  )
}

export default PlansManagement
