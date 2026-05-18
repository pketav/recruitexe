"use client"
import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  Switch,
  Alert,
  Snackbar,
  Card,
  CardContent,
  FormControlLabel,
  Paper,
  CircularProgress,
  Tooltip,
} from "@mui/material"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApi } from "@core/hooks/useApi"
import {
  MailOutline as MailOutlineIcon,
  Settings as SettingsIcon,
  KeyboardBackspace as KeyboardBackspaceIcon, // Add this import
  InfoOutlined as InfoOutlinedIcon, // Add this import
} from "@mui/icons-material"

export default function MasterMailSetup() {
  const router = useRouter()
  const { callApi, loading } = useApi()

  const [mailSettings, setMailSettings] = useState({
    masterMailStatus: true,
    hrmsMail: {
      hrmsMail: true,
      jobApplyMail: true,
      interviewSchedule: true,
      reInterviewSchedule: true,
      leaveMailToEmployee: true,
      leaveMailToManager: true,
      leaveApprovelMail: true,
      sendPreOfferMail: true,
      sendPreOfferLetterMail: true,
      sendPreOfferLetterFinexe: true,
    },
  })
  const [hasData, setHasData] = useState(false)

  const getMailSettings = async () => {
    const result = await callApi({
      endpoint: "/v1/api/mail/switch/get",
      method: "GET",
      disableSnackbar: true,
      errorMessage: "Failed to fetch mail settings",
    })

    if (result.success && result.data && result.data.items) {
      setMailSettings({
        masterMailStatus: result.data.items.masterMailStatus,
        hrmsMail: result.data.items.hrmsMail,
      })
      setHasData(true)
    } else {
      setHasData(false)

    }
  }

  useEffect(() => {
    getMailSettings()
  }, [])

  const handleMasterMailToggle = (checked) => {
    setMailSettings((prev) => ({
      ...prev,
      masterMailStatus: checked,
    }))
  }

  const handleHrmsMailToggle = (field, checked) => {
    setMailSettings((prev) => ({
      ...prev,
      hrmsMail: {
        ...prev.hrmsMail,
        [field]: checked,
      },
    }))
  }

  const handleSaveSettings = async () => {
    const result = await callApi({
      endpoint: "/v1/api/mail/switch/addUpdate",
      method: "POST",
      data: mailSettings,
      successMessage: "Mail settings updated successfully",
      errorMessage: "Failed to update mail settings",
    })

    if (result.success) {

      setHasData(true)
      getMailSettings()
    } else {
    
    }
  }

  const hrmsMailLabels = {
    jobApplyMail: "Job Apply Mail",
    interviewSchedule: "Interview Schedule",
    reInterviewSchedule: "Re-Interview Schedule",
    leaveMailToEmployee: "Leave Mail to Employee",
    leaveMailToManager: "Leave Mail to Manager",
    leaveApprovelMail: "Leave Approval Mail",
    sendPreOfferMail: "Send Pre Offer Mail",
    sendPreOfferLetterMail: "Send Pre Offer Letter Mail",
    sendPreOfferLetterFinexe: "Send Pre Offer Letter Finexe",
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 3,
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 8px 16px rgba(115,103,240,0.3)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MailOutlineIcon sx={{ fontSize: 30, color: "white" }} />
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: "white", mb: 0.5 }}>
              Mail Communication Settings
            </Typography>
            <Tooltip title="Manage mail communication settings for various modules.">
              <InfoOutlinedIcon sx={{ color: "#ffffff", fontSize: 24, cursor: "pointer" }} />
            </Tooltip>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="white"
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handleSaveSettings}
            disabled={loading}
            sx={{
              borderRadius: "25px",
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(40, 199, 111, 0.3)",
              borderColor: "white", // Ensure white border for outlined
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)", // Subtle hover for outlined
                borderColor: "white",
              },
            }}
          >
            Save Settings
          </Button>
          <Button
                sx={{ borderRadius: '25px' }}
                color='white'
                variant='outlined'
                onClick={() => router.push('/employeeSetup')}
              >
                <KeyboardBackspaceIcon />
              </Button>
        </Box>
      </Box>

      {!hasData && !loading && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <Box
            sx={{
              bgcolor: "#e2e8f0",
              width: 80,
              height: 80,
              mx: "auto",
              mb: 3,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SettingsIcon sx={{ fontSize: 40, color: "#64748b" }} />
          </Box>
          <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
            No mail configuration found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Configure your mail settings to get started
          </Typography>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            disabled={loading}
            sx={{
              bgcolor: "#7367F0",
              borderRadius: 2,
              px: 3,
              py: 1,
              "&:hover": { bgcolor: "#675DD8" },
            }}
          >
            {loading ? "Creating..." : "Create Mail Configuration"}
          </Button>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Master Mail Status Card */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              background: "white", // Solid white background
              border: "1px solid #e2e8f0",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Master Mail Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enable or disable all mail notifications across the platform.
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mailSettings.masterMailStatus}
                      onChange={(e) => handleMasterMailToggle(e.target.checked)}
                      color="primary"
                      size="medium"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#7367F0", // Purple when checked
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#7367F0", // Purple track when checked
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      {mailSettings.masterMailStatus ? "Enabled" : "Disabled"}
                    </Typography>
                  }
                  labelPlacement="start"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* HRMS Mail Settings Card */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              background: "white", // Solid white background
              border: "1px solid #e2e8f0",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                HRMS Mail Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure individual mail notifications for HRMS modules.
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(hrmsMailLabels).map(([key, label], index) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        border: "1px solid",
                        borderColor: mailSettings.hrmsMail[key] ? "#7367F0" : "#e2e8f0", // Purple border when enabled
                        borderRadius: 2, // Very rounded corners
                        backgroundColor: mailSettings.hrmsMail[key]
                          ? "linear-gradient(135deg, #ede7f6 0%, #e1d5e7 100%)" // Light purple gradient when enabled
                          : "white", // White background when disabled
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: "0 2px 8px rgba(115,103,240,0.1)",
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#1e293b" }}>
                        {label}
                      </Typography>
                      <Switch
                        checked={mailSettings.hrmsMail[key]}
                        onChange={(e) => handleHrmsMailToggle(key, e.target.checked)}
                        color="primary"
                        size="small"
                        disabled={!mailSettings.masterMailStatus}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#7367F0", // Purple when checked
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#7367F0", // Purple track when checked
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {!mailSettings.masterMailStatus && (
                <Alert severity="info" sx={{ mt: 3, borderRadius: 2, bgcolor: "#e3f2fd", color: "#1976d2" }}>
                  Enable Master Mail Status to configure individual mail settings.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Container>
  )
}
