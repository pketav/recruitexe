"use client"
import { useState, useEffect, useCallback } from "react"
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Modal,
  TextField,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Container,
  Fade,
  Alert,
  Checkbox,
  Backdrop,
  Switch,
  Tooltip
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import CancelIcon from "@mui/icons-material/Cancel"
import { LinkedIn, Email, CheckCircle, Error } from "@mui/icons-material"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { DataGrid } from "@mui/x-data-grid"

// LinkedIn Connect Modal
const LinkedInConnectModal = ({ open, onClose, orgId, onConnected }) => {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    if (!open || !orgId || !token) return

    let interval = null
    let popup = null

    const startPolling = () => {
      popup = window.open(`${baseUrl}/v1/api/linkedin/auth/linkedin?orgId=${orgId}`, "_blank", "width=600,height=600")

      interval = setInterval(async () => {
        try {
          if (popup?.closed) {
            clearInterval(interval)
            onClose()
            return
          }

          const res = await axios.get(`${baseUrl}/v1/api/organizations/${orgId}`, {
            headers: { authorization: token },
          })

          if (res.data?.data?.accessToken) {
            clearInterval(interval)
            popup?.close()
            onConnected()
            onClose()
          }
        } catch (error) {
          console.error("Error checking LinkedIn connection", error)
        }
      }, 2000)
    }

    startPolling()

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval)
      }
      if (popup && !popup.closed) {
        popup.close()
      }
    }
  }, [open, orgId, token, baseUrl, onClose, onConnected])

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "relative",
            m: { xs: 2, sm: "auto" },
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: 3, sm: 4 },
            bgcolor: "background.paper",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.15)",
            width: { xs: "95%", sm: 450 },
            maxWidth: "90vw",
            textAlign: "center",
            backdropFilter: "blur(15px)",
            background: "rgba(255, 255, 255, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <CircularProgress size={isMobile ? 36 : 48} sx={{ color: theme.palette.primary.main }} />
          <Typography
            sx={{
              mt: 3,
              fontSize: { xs: "1rem", sm: "1.15rem" },
              fontWeight: 500,
              color: theme.palette.text.primary,
            }}
          >
            Waiting for LinkedIn connection...
          </Typography>
        </Box>
      </Fade>
    </Modal>
  )
}

// Create Organization Modal (for Gmail and Outlook only)
const CreateOrganizationModal = ({ open, onClose, onCreate, loading, platform }) => {
  const theme = useTheme()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const getPlatformConfig = (platform) => {
    switch (platform) {
      case "gmail":
        return {
          title: "Connect Gmail Account",
          subtitle: "Create a new entry for your Gmail account.",
          icon: <Email sx={{ fontSize: 36, color: "#EA4335" }} />,
        }
      case "outlook":
        return {
          title: "Connect Outlook Account",
          subtitle: "Create a new entry for your Outlook account.",
          icon: <Email sx={{ fontSize: 36, color: "#0078D4" }} />,
        }
      default:
        return {
          title: "New Account",
          subtitle: "Create a new account and configure integration",
          icon: <AddIcon sx={{ fontSize: 36, color: theme.palette.primary.main }} />,
        }
    }
  }

  const platformConfig = getPlatformConfig(platform || "default")

  const handleSubmit = () => {
    onCreate({ name, description, platform })
    setName("")
    setDescription("")
  }

  const handleClose = () => {
    onClose()
    setName("")
    setDescription("")
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { backdropFilter: "blur(8px)" },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "0 28px 56px rgba(0, 0, 0, 0.25)",
            p: { xs: 3, sm: 4 },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(102, 126, 234, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                }}
              >
                {platformConfig.icon}
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                >
                  {platformConfig.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}>
                  {platformConfig.subtitle}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} disabled={loading} sx={{ color: theme.palette.text.secondary }}>
              <CancelIcon />
            </IconButton>
          </Box>

          <Stack spacing={3}>
            <TextField
              label={`${platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Account"} Name`}
              fullWidth
              value={name}
              onChange={(e) => {
                const value = e.target.value
                if (/^[a-zA-Z0-9\s'-]*$/.test(value) || value === "") {
                  setName(value)
                }
              }}
              disabled={loading}
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => {
                let value = e.target.value
                value = value.replace(/\s{2,}/g, " ")
                const wordCount = value.trim().split(/\s+/).filter(Boolean).length
                if (wordCount <= 100) {
                  setDescription(value)
                }
              }}
              disabled={loading}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={loading || !name}
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 600,
                color: "white",
                boxShadow: "0 4px 15px rgba(118, 75, 162, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  boxShadow: "0 6px 20px rgba(118, 75, 162, 0.6)",
                },
                "&:disabled": {
                  background: theme.palette.grey[300],
                  color: theme.palette.grey[500],
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Create ${platformConfig.title.split(" ")[0]}`
              )}
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  )
}

// Create And Connect LinkedIn
const createAndConnectLinkedInOrg = async ({
  clientId,
  clientSecret,
  redirectUri,
  onConnected,
  onClose,
  showAlert,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null

  if (!token) {
    showAlert("Please log in to continue", "error")
    onClose()
    return
  }

  let orgId = null
  try {
    // Step 1: Create organization
    const res = await axios.post(
      `${baseUrl}/v1/api/organizations`,
      {
        linkedinClientId: clientId,
        linkedinClientSecret: clientSecret,
        linkedinRedirectUri: redirectUri,
      },
      {
        headers: { Authorization: token },
      },
    )

    if (!res.data?.status || !res.data?.items?._id) {
      throw new Error("Organization creation failed")
    }

    orgId = res.data.items._id

    // Delay before opening LinkedIn popup
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Step 2: Open LinkedIn auth popup
    const popup = window.open(
      `${baseUrl}/v1/api/linkedin/auth/linkedin?orgId=${orgId}`,
      "_blank",
      "width=600,height=600",
    )

    let hasResolved = false

    const interval = setInterval(async () => {
      try {
        if (popup?.closed) {
          clearInterval(interval)
          if (!hasResolved) {
            hasResolved = true
            // Cleanup if user closed popup
            if (orgId) {
              try {
                await axios.delete(`${baseUrl}/v1/api/organizations/${orgId}`, {
                  headers: { Authorization: token },
                })
              } catch (delErr) {
                showAlert("Failed to clean up organization.", "error")
              }
            }
            onClose()
          }
          return
        }

        // Poll for accessToken
        const orgRes = await axios.get(`${baseUrl}/v1/api/organizations/${orgId}`, {
          headers: { Authorization: token },
        })

        if (orgRes.data?.items?.accessToken) {
          clearInterval(interval)
          popup.close()
          hasResolved = true
          onConnected()
          onClose()
        }
      } catch (err) {
        console.error("Polling error:", err)
        clearInterval(interval)
        if (!hasResolved) {
          hasResolved = true
          if (orgId) {
            try {
              await axios.delete(`${baseUrl}/v1/api/organizations/${orgId}`, {
                headers: { Authorization: token },
              })
              console.log("Organization deleted: Polling error.")
            } catch (delErr) {
              console.error("Cleanup failed:", delErr)
              showAlert("Error cleaning up organization after failure.", "error")
            }
          }
          onClose()
        }
      }
    }, 2000) // poll every 2s
  } catch (error) {
    console.error("Setup error:", error)
    showAlert(`Failed to connect LinkedIn: ${error.message}`, "error")
    if (orgId) {
      try {
        await axios.delete(`${baseUrl}/v1/api/organizations/${orgId}`, {
          headers: { Authorization: token },
        })
        console.log("Organization deleted: Setup failed.")
      } catch (delErr) {
        console.error("Cleanup failed:", delErr)
        showAlert("Failed to clean up organization after setup error.", "error")
      }
    }
    onClose()
  }
}

// Main Organizations Component
function Organizations() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [openModal, setOpenModal] = useState(false)
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState({ linkedin: false, gmail: false, outlook: false })
  const [alert, setAlert] = useState({ show: false, message: "", severity: "success" })
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  // State for Gmail accounts
  const [accounts, setAccounts] = useState([]);
  const [linkedinModalOpen, setLinkedinModalOpen] = useState(false)
  const [selectedOrgId, setSelectedOrgId] = useState(null)
  const [accountLoading, setAccountLoading] = useState({})

  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUri = `${baseUrl}/v1/api/linkedin/auth/linkedin/callback`

  const [defaultEmailId, setDefaultEmailId] = useState(null);


  const showAlert = useCallback((message, severity = "success") => {
    setAlert({ show: true, message, severity })
    setTimeout(() => setAlert({ show: false, message: "", severity: "success" }), 5000)
  }, [])

  const fetchOrganizations = useCallback(async () => {
    if (!token) {
      showAlert("Please log in to continue", "error")
      return
    }

    try {
      const response = await axios.get(`${baseUrl}/v1/api/organizations/test`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      const data = response.data?.items || []

      // Check if any LinkedIn organization is already connected
      const alreadyConnectedOrg = data.find((org) => org.platform === "linkedin" && !!org.accessToken)

      if (alreadyConnectedOrg) {
        showAlert(
          `The LinkedIn account "${alreadyConnectedOrg.linkedinName || "Unnamed"}" is already connected.`,
          "info",
        )
      }

      const validOrganizations = data
        .filter((org) => !!org.linkedinName)
        .map((org) => ({
          name: org.linkedinName,
          linkedInStatus: org.accessToken ? "connected" : "disconnected",
          _id: org._id,
          platform: org.platform || "linkedin",
        }))

      setOrganizations(validOrganizations)
    } catch (error) {
      console.error("Error fetching organizations:", error)
      showAlert("Failed to fetch organizations", "error")
    }
  }, [token, baseUrl, showAlert])



  const fetchGmailAccounts = useCallback(async () => {
    if (!token) {
      console.error("No auth token found. Please log in first.");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/v1/api/mail/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await res.json();
      console.log("Fetched Gmail Users:", data);

      if (!res.ok) {
        console.error("API Error:", data.message || "Unknown error");
        return;
      }

      const accounts = data.items || [];
      setAccounts(accounts);

      // ✅ Set default email from isDefault
      const defaultAccount = data.items?.find((acc) => acc.isDefault);
      if (defaultAccount) {
        console.log("Resolved defaultEmail:", defaultAccount._id);
        setDefaultEmailId(defaultAccount?._id || null);
      } else {
        console.log("No default email found");
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    }
  }, [token, baseUrl]);







  // Initial data fetch
  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  useEffect(() => {
    fetchGmailAccounts()
  }, [fetchGmailAccounts])

  // Handle URL parameters
  useEffect(() => {
    const orgId = searchParams.get("orgId")
    const error = searchParams.get("error")
    const gmailSuccess = searchParams.get("gmail")

    if (orgId) {
      showAlert("LinkedIn connected successfully!", "success")
      router.replace("/employeeSetup/Linkedin")
    } else if (error) {
      showAlert(`LinkedIn connection failed: ${searchParams.get("error_description") || "Unknown error"}`, "error")
      router.replace("/employeeSetup/Linkedin")
    } else if (gmailSuccess === "success") {
      showAlert("Gmail account connected successfully!", "success")
      fetchOrganizations()
      router.replace("/employeeSetup/Linkedin")
    }
  }, [searchParams, router, showAlert, fetchOrganizations])

  const connectLinkedIn = useCallback((orgId) => {
    setAccountLoading((l) => ({ ...l, [orgId]: true }))
    setSelectedOrgId(orgId)
    setLinkedinModalOpen(true)
  }, [])

  // Disconnect Linkedin
  const disconnectLinkedIn = useCallback(
    async (orgId) => {
      if (!token) {
        showAlert("Please log in to continue", "error")
        return
      }

      setAccountLoading((l) => ({ ...l, [orgId]: true }))

      try {
        await axios.delete(`${baseUrl}/v1/api/organizations/${orgId}/linkedin`, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })

        fetchOrganizations()
        showAlert("Disconnected from LinkedIn", "success")
      } catch (error) {
        console.error("Error disconnecting:", error)
        showAlert("Failed to disconnect", "error")
      } finally {
        setAccountLoading((l) => ({ ...l, [orgId]: false }))
      }
    },
    [token, baseUrl, fetchOrganizations, showAlert],
  )

  // Add Account Function
  const handleAddAccount = useCallback(
    (platform) => {
      if (platform === "linkedin") {
        setLoading((l) => ({ ...l, linkedin: true }))
        createAndConnectLinkedInOrg({
          clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
          clientSecret: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET,
          redirectUri,
          onConnected: () => {
            fetchOrganizations()
            showAlert("LinkedIn account created and connected!", "success")
            setLoading((l) => ({ ...l, linkedin: false }))
          },
          onClose: () => {
            setLoading((l) => ({ ...l, linkedin: false }))
          },
          showAlert,
        })
      } else if (platform === "gmail") {
        handleAddGmailAccount()
      } else if (platform === "outlook") {
        setLoading((l) => ({ ...l, outlook: true }))
        setSelectedPlatform(platform)
        setOpenModal(true)
      }
    },
    [redirectUri, fetchOrganizations, showAlert],
  )

  // Redirect user to Gmail login with token
  const handleAddGmailAccount = useCallback(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      showAlert("Please log in to continue", "error")
      return
    }

    try {
      window.location.href = `${baseUrl}/v1/api/google/gmail?token=${token}`
    } catch (error) {
      console.error("Error redirecting to Gmail:", error)
      showAlert("Failed to connect Gmail account", "error")
    }
  }, [baseUrl, showAlert])

  // Handle Gmail connect/disconnect
  const handleConnectGmail = useCallback(
    async (accountId) => {
      const token = localStorage.getItem("authToken")
      if (!token) {
        showAlert("Please log in to continue", "error")
        return
      }

      try {
        window.location.href = `${baseUrl}/v1/api/google/gmail?token=${token}&accountId=${accountId}`
      } catch (error) {
        console.error("Error redirecting to Gmail:", error)
        showAlert("Failed to connect Gmail account", "error")
      }
    },
    [baseUrl, showAlert],
  )

  // Disconnect Gmail
  const handleDisconnectGmail = useCallback(
    async (accountId) => {
      const token = localStorage.getItem("authToken")
      if (!token) {
        showAlert("Please log in to continue", "error")
        return
      }

      try {
        const response = await fetch(`${baseUrl}/v1/api/mail/disconnect/${accountId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to disconnect Gmail account")
        }

        // Update local state immediately
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account._id === accountId || account.id === accountId ? { ...account, accessToken: null } : account,
          ),
        )

        showAlert("Gmail account disconnected successfully!", "success")
        fetchGmailAccounts()
      } catch (error) {
        console.error("Error disconnecting Gmail:", error)
        showAlert(error.message || "Failed to disconnect Gmail account", "error")
      }
    },
    [baseUrl, showAlert, fetchGmailAccounts],
  )

  // Handler to set default Gmail account
  const handleToggleDefaultGmail = async (accountId, isCurrentlyDefault) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      showAlert("Please log in to continue", "error");
      return;
    }

    try {
      // This single endpoint is used for both setting and unsetting the default.
      const res = await axios.post(
        `${baseUrl}/v1/api/mail/set-default/${accountId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Optimistically update the UI based on the toggle action.
      if (isCurrentlyDefault) {
        // If it was the default, the action is to UNSET it.
        setAccounts((prev) =>
          prev.map((acc) =>
            acc._id === accountId ? { ...acc, isDefault: false } : acc
          )
        );
        showAlert(res.data.message || "Default removed successfully", "success");
      } else {
        setAccounts((prev) =>
          prev.map((acc) => ({
            ...acc,
            isDefault: acc._id === accountId,
          }))
        );
        showAlert(res.data.message || "Default set successfully", "success");
      }

    } catch (error) {
      const action = isCurrentlyDefault ? "remove" : "set";
      showAlert(error.response?.data?.message || `Failed to ${action} default`, "error");
    }
  };


  const linkedinAccounts = organizations.filter((org) => org.platform === "linkedin")

  // LinkedIn DataGrid columns
  const linkedinColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {params.value}
        </Box>
      ),
      headerClassName: "gradient-header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            bgcolor: params.row.linkedInStatus === "connected" ? "rgba(76, 175, 80, 0.12)" : "transparent",
            borderRadius: 1,
            px: 1.5,
            py: 1,
            color: params.row.linkedInStatus === "connected" ? theme.palette.success.main : theme.palette.error.main,
            textAlign: "center",
            m: 0,
          }}
        >
          {params.row.linkedInStatus === "connected" ? (
            <>
              <CheckCircle sx={{ fontSize: 18, mr: 0.5 }} />
              <span>Connected</span>
            </>
          ) : (
            <>
              <Error sx={{ fontSize: 18, mr: 0.5 }} />
              <span>Disconnected</span>
            </>
          )}
        </Box>
      ),
      align: "center",
      headerAlign: "center",
      headerClassName: "gradient-header",
      disableColumnMenu: true,
      disableReorder: true,
      sortable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {params.row.linkedInStatus === "connected" ? (
            <Button
              startIcon={<LinkedIn sx={{ color: "#fff" }} />}
              onClick={() => disconnectLinkedIn(params.row._id)}
              disabled={!!accountLoading[params.row._id]}
              variant="contained"
              sx={{
                borderRadius: 20,
                minWidth: 100,
                backgroundColor: "#D32F2F",
                "&:hover": {
                  backgroundColor: "#9A2323",
                },
              }}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              startIcon={<LinkedIn sx={{ color: "#fff" }} />}
              onClick={() => connectLinkedIn(params.row._id)}
              disabled={params.row.linkedInStatus === "connecting" || !!accountLoading[params.row._id]}
              variant="contained"
              sx={{
                borderRadius: 20,
                minWidth: 100,
                backgroundColor: "#0A66C2",
                "&:hover": {
                  backgroundColor: "#004182",
                },
              }}
            >
              Connect
            </Button>
          )}
        </Box>
      ),
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      headerClassName: "gradient-header",
      disableColumnMenu: true,
      disableReorder: true,
    },
  ]

  // Gmail DataGrid columns
  //   const gmailColumns = [
  //   {
  //     field: "email",
  //     headerName: "Gmail",
  //     flex: 1,
  //     minWidth: 180,
  //     headerClassName: "gmail-gradient-header",
  //     align: "center",
  //     headerAlign: "center",
  //     sortable: false,
  //     filterable: false,
  //     disableColumnMenu: true,
  //     renderCell: (params) => (
  //       <Box sx={{ width: "100%", textAlign: "center" }}>{params.value}</Box>
  //     ),
  //   },
  //   {
  //     field: "status",
  //     headerName: "Status",
  //     flex: 1,
  //     minWidth: 120,
  //     renderCell: (params) =>
  //       params.row.isConnected ? (
  //         <Box
  //           sx={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             width: "100%",
  //             height: "100%",
  //             color: theme.palette.success.main,
  //             textAlign: "center",
  //           }}
  //         >
  //           <CheckCircle sx={{ fontSize: 18, mr: 0.5 }} />
  //           Connected
  //         </Box>
  //       ) : (
  //         <Box
  //           sx={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             width: "100%",
  //             height: "100%",
  //             color: theme.palette.error.main,
  //             textAlign: "center",
  //           }}
  //         >
  //           <Error sx={{ fontSize: 18, mr: 0.5 }} />
  //           Disconnected
  //         </Box>
  //       ),
  //     align: "center",
  //     headerAlign: "center",
  //     headerClassName: "gmail-gradient-header",
  //     disableColumnMenu: true,
  //     disableReorder: true,
  //     sortable: false,
  //   },
  //   {
  //     field: "actions",
  //     headerName: "Actions",
  //     flex: 1,
  //     minWidth: 180,
  //     renderCell: (params) => (
  //       <Box
  //         sx={{
  //           display: "flex",
  //           gap: 4,
  //           alignItems: "center",
  //           justifyContent: "center",
  //           width: "100%",
  //           minHeight: 48,
  //         }}
  //       >
  //         <Button
  //           startIcon={<Email sx={{ color: "#fff" }} />}
  //           onClick={() =>
  //             params.row.isConnected
  //               ? handleDisconnectGmail(params.row._id || params.row.id)
  //               : handleConnectGmail(params.row._id || params.row.id)
  //           }
  //           disabled={loading.gmail}
  //           variant="contained"
  //           sx={{
  //             borderRadius: 20,
  //             minWidth: 140,
  //             maxWidth: 140,
  //             height: 40,
  //             backgroundColor: params.row.isConnected ? "#D32F2F" : "#0A66C2",
  //             "&:hover": {
  //               backgroundColor: params.row.isConnected ? "#9A2323" : "#004182",
  //             },
  //           }}
  //         >
  //           {params.row.isConnected ? "Disconnect" : "Connect"}
  //         </Button>
  //       </Box>
  //     ),
  //     align: "center",
  //     headerAlign: "center",
  //     sortable: false,
  //     filterable: false,
  //     headerClassName: "gmail-gradient-header",
  //     disableColumnMenu: true,
  //     disableReorder: true,
  //   },
  //   {
  //     field: "setDefault",
  //     headerName: "Set Default",
  //     flex: 1,
  //     minWidth: 150,
  //     headerClassName: "gmail-gradient-header",
  //     align: "center",
  //     headerAlign: "center",
  //     sortable: false,
  //     filterable: false,
  //     disableColumnMenu: true,
  //     renderCell: (params) => (
  //       <Box
  //         sx={{
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           width: "100%",
  //         }}
  //       >
  //         <Switch
  //           checked={!!params.row.isDefault}
  //           color="success"
  //           disabled={!params.row.isConnected || loading.gmail}
  //           onChange={() => {
  //             if (!params.row.isDefault) {
  //               handleSetDefaultGmail(params.row._id || params.row.id);
  //             }
  //           }}
  //           inputProps={{ "aria-label": "Set as default" }}
  //         />
  //         {/* <span
  //           style={{
  //             fontWeight: 500,
  //             marginLeft: 6,
  //             color: params.row.isDefault ? "#388e3c" : "#888",
  //           }}
  //         >
  //           {params.row.isDefault ? "Default" : ""}
  //         </span> */}
  //       </Box>
  //     ),
  //   },
  // ];
  const gmailColumns = [
    {
      field: "email",
      headerName: "Gmail",
      flex: 1,
      minWidth: 180,
      headerClassName: "gmail-gradient-header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ width: "100%", textAlign: "center" }}>{params.value}</Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) =>
        params.row.isConnected ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              color: theme.palette.success.main,
              textAlign: "center",
            }}
          >
            <CheckCircle sx={{ fontSize: 18, mr: 0.5 }} />
            Connected
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              color: theme.palette.error.main,
              textAlign: "center",
            }}
          >
            <Error sx={{ fontSize: 18, mr: 0.5 }} />
            Disconnected
          </Box>
        ),
      align: "center",
      headerAlign: "center",
      headerClassName: "gmail-gradient-header",
      disableColumnMenu: true,
      disableReorder: true,
      sortable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: 48,
          }}
        >
          <Button
            startIcon={<Email sx={{ color: "#fff" }} />}
            onClick={() =>
              params.row.isConnected
                ? handleDisconnectGmail(params.row._id || params.row.id)
                : handleConnectGmail(params.row._id || params.row.id)
            }
            disabled={loading.gmail}
            variant="contained"
            sx={{
              borderRadius: 20,
              minWidth: 140,
              maxWidth: 140,
              height: 40,
              backgroundColor: params.row.isConnected ? "#D32F2F" : "#0A66C2",
              "&:hover": {
                backgroundColor: params.row.isConnected ? "#9A2323" : "#004182",
              },
            }}
          >
            {params.row.isConnected ? "Disconnect" : "Connect"}
          </Button>
        </Box>
      ),
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      headerClassName: "gmail-gradient-header",
      disableColumnMenu: true,
      disableReorder: true,
    },
    {
      field: "setDefault",
      headerName: "Set Default",
      flex: 1,
      minWidth: 150,
      headerClassName: "gmail-gradient-header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // Determine the tooltip text based on the account's state
        const getTooltipTitle = () => {
          if (!params.row.isConnected) {
            return "Connect account to set as default";
          }
          return params.row.isDefault ? "Unset as default" : "Set as default";
        };

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Tooltip title={getTooltipTitle()} arrow>
              {/* A span wrapper is needed for the tooltip to work on a disabled element */}
              <span>
                <Switch
                  checked={!!params.row.isDefault}
                  color="success"
                  disabled={!params.row.isConnected || loading.gmail}
                  onChange={() => {
                    handleToggleDefaultGmail(
                      params.row._id || params.row.id,
                      params.row.isDefault
                    );
                  }}
                  inputProps={{ "aria-label": "Toggle default account" }}
                />
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 10px 30px rgba(118, 75, 162, 0.4)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0) translateX(0)" },
              "25%": { transform: "translateY(-15px) translateX(10px)" },
              "50%": { transform: "translateY(-30px) translateX(-10px)" },
              "75%": { transform: "translateY(-15px) translateX(10px)" },
            },
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 3,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddIcon sx={{ fontSize: { xs: 28, sm: 36 }, color: "white" }} />
          </Box>
          <Box>
            <Typography fontSize={{ xs: 18, sm: 22 }} color="white" fontWeight="bold" gutterBottom mt={1}>
              Social Media Accounts
            </Typography>
            <Typography fontSize={{ xs: 14, sm: 16 }} color="white" sx={{ opacity: 0.9, my: -1.5 }}>
              Manage your social media account connections
            </Typography>
          </Box>
        </Box>
      </Paper>

      {alert.show && (
        <Box sx={{ p: { xs: 2, md: 3 }, pb: 0 }}>
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ show: false, message: "", severity: "success" })}
            sx={{ borderRadius: 2, mb: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            {alert.message}
          </Alert>
        </Box>
      )}

      <Box sx={{ p: { xs: 0, sm: 1, md: 2 } }}>
        {/* LinkedIn Accounts */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem" }, fontWeight: 600, color: theme.palette.text.primary }}
          >
            LinkedIn Accounts
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleAddAccount("linkedin")}
            disabled={loading.linkedin}
            sx={{
              background: "linear-gradient(135deg, #0A66C2 0%, #004182 100%)",
              borderRadius: 25,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              py: { xs: 0.8, sm: 1 },
              px: { xs: 2, sm: 2.5 },
              boxShadow: "0 4px 15px rgba(10, 102, 194, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #0959A8 0%, #00366D 100%)",
                boxShadow: "0 6px 20px rgba(10, 102, 194, 0.5)",
              },
            }}
          >
            Add Account
          </Button>
        </Box>

        <Box sx={{ width: "100%", mb: 4 }}>
          <DataGrid
            autoHeight
            rows={linkedinAccounts.map((org) => ({ id: org._id, ...org }))}
            columns={linkedinColumns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                "&:hover": {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                },
              },
              "& .gradient-header": {
                background: "#1976d2",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "white",
                fontWeight: 700,
                fontSize: "1rem",
              },
              "& .MuiDataGrid-cell": {
                py: 1,
                fontSize: 13,
              },
              "& .MuiDataGrid-row": {
                cursor: "pointer",
              },
              "& .MuiDataGrid-footerContainer": {
                background: "rgba(245,245,255,0.95)",
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
              },
              "& .MuiDataGrid-columnSeparator": {
                color: "white",
                "&:hover": {
                  color: "white",
                  background: "transparent",
                },
              },
            }}
          />
        </Box>
        {/* Gmail Accounts */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem" }, fontWeight: 600, color: theme.palette.text.primary }}
          >
            Gmail Accounts
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleAddAccount("gmail")}
            disabled={loading.gmail}
            sx={{
              background: "linear-gradient(135deg, #0A66C2 0%, #004182 100%)",
              borderRadius: 25,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              py: { xs: 0.8, sm: 1 },
              px: { xs: 2, sm: 2.5 },
              boxShadow: "0 4px 15px rgba(10, 102, 194, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #0959A8 0%, #00366D 100%)",
                boxShadow: "0 6px 20px rgba(10, 102, 194, 0.5)",
              },
              "&.Mui-disabled": {
                background: "rgba(10, 102, 194, 0.7)",
              },
            }}
          >
            {loading.gmail ? "Connecting..." : "Add Account"}
          </Button>
        </Box>

        <Box sx={{ width: "100%", mb: 4 }}>
          <DataGrid
            autoHeight
            rows={accounts.map((account) => ({
              id: account._id || account.id,
              email: account.email || account.name || "Unnamed Account",
              isConnected: !!account.accessToken,
              _id: account._id || account.id,
              isDefault: account.isDefault,
            }))}
            columns={gmailColumns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                "&:hover": {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                },
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "white",
                fontWeight: 700,
                fontSize: "1rem",
              },
              "& .gmail-gradient-header": {
                background: "#1976d2",
              },
              "& .MuiDataGrid-cell": { py: 1, fontSize: 13 },
              "& .MuiDataGrid-row": {
                cursor: "pointer",
              },
              "& .MuiDataGrid-footerContainer": {
                background: "rgba(245,245,255,0.95)",
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
              },
              "& .MuiDataGrid-columnSeparator": {
                color: "white",
                "&:hover": {
                  color: "white",
                  background: "transparent",
                },
              },
            }}
          />
        </Box>
      </Box>

      <LinkedInConnectModal
        open={linkedinModalOpen}
        onClose={() => {
          setLinkedinModalOpen(false)
          if (selectedOrgId) setAccountLoading((l) => ({ ...l, [selectedOrgId]: false }))
        }}
        orgId={selectedOrgId}
        onConnected={() => {
          fetchOrganizations()
          if (selectedOrgId) setAccountLoading((l) => ({ ...l, [selectedOrgId]: false }))
        }}
      />

      <CreateOrganizationModal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          setLoading((l) => ({ ...l, outlook: false }))
        }}
        onCreate={() => { }}
        loading={loading.outlook}
        platform={selectedPlatform}
      />
    </Container>
  )
}

export default Organizations
