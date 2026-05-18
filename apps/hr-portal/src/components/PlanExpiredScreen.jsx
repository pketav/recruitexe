"use client"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material"
import {
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
  Logout, // Import Logout icon
} from "@mui/icons-material"
import { useRouter } from "next/navigation" // Use next/navigation for App Router
import { useAuth } from "../context/AuthContext" // Uncomment this line

const PlanExpiredScreen = ({ planName = "Pro Plan", onRetry, isRetrying = false }) => {
  const router = useRouter()
  const { logout } = useAuth() // Uncomment this line

  const handleEmailContact = () => {
    const subject = encodeURIComponent("RecruitExe Plan Renewal Request")
    const body = encodeURIComponent(
      `Hello Administrator,\n\nI am writing to request renewal of my ${planName} for RecruitExe application. My plan has expired and I need to regain access to continue using the platform.\n\nPlease let me know the next steps for plan renewal.\n\nThank you for your assistance.\n\nBest regards`,
    )
    window.location.href = `mailto:recruitexe@fincoopers.in?subject=${subject}&body=${body}`
  }

  const handlePhoneContact = () => {
    window.location.href = "tel:+919713496989"
  }

  const handleLogout = async () => {
    if (logout) {
       logout()
       window.location.reload()
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: 3,
          bgcolor: "#ffffff",
          border: "1px solid #e0e0e0",
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: "#ffebee",
                mx: "auto",
                mb: 3,
                border: "2px solid #ffcdd2",
              }}
            >
              <WarningIcon sx={{ fontSize: 35, color: "#d32f2f" }} />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: "#d32f2f",
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: "1.75rem", md: "2.125rem" },
              }}
            >
              Plan Expired
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#666666",
                fontSize: { xs: "1rem", md: "1.125rem" },
                fontWeight: 400,
              }}
            >
              Your {planName} has expired
            </Typography>
          </Box>
          {/* Access Restricted Alert */}
          <Alert
            severity="error"
            icon={<ScheduleIcon />}
            sx={{
              mb: 4,
              borderRadius: 2,
              bgcolor: "#ffebee",
              border: "1px solid #ffcdd2",
              "& .MuiAlert-message": {
                width: "100%",
              },
              "& .MuiAlert-icon": {
                color: "#d32f2f",
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#d32f2f" }}>
              Access Restricted
            </Typography>
            <Typography variant="body2" sx={{ color: "#c62828", lineHeight: 1.6 }}>
              Your current plan has expired and access to the RecruitExe application has been temporarily restricted. To
              continue using our services and access all features, please contact our administrator for plan renewal.
            </Typography>
          </Alert>
          {/* Contact Administrator Section */}
          <Card
            variant="outlined"
            sx={{
              bgcolor: "#f8f9fa",
              borderColor: "#e9ecef",
              borderRadius: 2,
              p: 3,
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EmailIcon sx={{ color: "#1976d2", mr: 2, fontSize: 24 }} />
              <Typography variant="h6" sx={{ color: "#333333", fontWeight: 600 }}>
                Contact Administrator
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: "#666666", mb: 3, lineHeight: 1.6 }}>
              Reach out to our administrator for immediate assistance with plan renewal and account reactivation.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Button
                variant="contained"
                startIcon={<EmailIcon />}
                onClick={handleEmailContact}
                sx={{
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                  borderRadius: 2,
                  py: 1.5,
                  px: 3,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  flex: 1,
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
                }}
              >
                recruitexe@fincoopers.in
              </Button>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={handlePhoneContact}
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    bgcolor: "#e3f2fd",
                    borderColor: "#1565c0",
                  },
                  borderRadius: 2,
                  py: 1.5,
                  px: 3,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  flex: 1,
                }}
              >
                +91 97134 96989
              </Button>
            </Box>
          </Card>
          {/* Retry Button */}
          {onRetry && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Button
                onClick={onRetry}
                disabled={isRetrying}
                variant="outlined"
                startIcon={isRetrying ? <CircularProgress size={16} /> : <RefreshIcon />}
                sx={{
                  borderColor: "#bdbdbd",
                  color: "#757575",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    borderColor: "#9e9e9e",
                  },
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {isRetrying ? "Checking..." : "Check Plan Status"}
              </Button>
            </Box>
          )}
          {/* Logout Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              onClick={handleLogout}
              size="small"
              startIcon={<Logout sx={{ fontSize: 18 }} />}
              sx={{
                color: 'error.main',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.dark',
                },
              }}
            >
              Logout
            </Button>
          </Box>
          {/* Footer */}
          <Divider sx={{ mb: 3, borderColor: "#e0e0e0" }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#999999" }}>
              Powered by{" "}
              <Typography
                component="span"
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#1976d2",
                  fontSize: "0.875rem",
                }}
              >
                RecruitExe
              </Typography>{" "}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default PlanExpiredScreen
