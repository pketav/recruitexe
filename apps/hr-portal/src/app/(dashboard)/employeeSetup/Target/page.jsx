"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Chip,
  Stack,
  TextField,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  alpha,
  Fade,
  Zoom,
  Paper,
} from "@mui/material"
import { BusinessCenter, Add, ThumbUp, ThumbDown, Refresh, Info, CheckCircle, Cancel, Close } from "@mui/icons-material"
import { useApi } from "@core/hooks/useApi"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import { useRouter } from "next/navigation"

const API_GET = "http://localhost:4000/"
const API_ADD = "http://localhost:4000/v1/api/targetCompany/add"

export default function Target() {
  const router = useRouter()
  const [prioritized, setPrioritized] = useState([])
  const [deprioritized, setDeprioritized] = useState([])
  const [newPrioritized, setNewPrioritized] = useState("")
  const [newDeprioritized, setNewDeprioritized] = useState("")
  const { callApi, loading } = useApi()

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

  const fetchCompanyList = async () => {
    try {
      const response = await callApi({
        endpoint: `/v1/api/targetCompany/get?targetCompanyId=68482b26ed80c0ff90828499`,
        disableSnackbar: true,
      })

      if (response.success && response.data?.items) {
        const data = response?.data?.items?.data
        setPrioritized(data?.prioritizedCompanies || [])
        setDeprioritized(data?.deprioritizedCompanies || [])
      }
    } catch (error) {
      console.error("Error fetching company list:", error)
    }
  }

  useEffect(() => {
    fetchCompanyList()
  }, [])

  const handleAddCompanies = async () => {
    const updatedPrioritized = newPrioritized
      ? [...prioritized, capitalize(newPrioritized)]
      : prioritized
    const updatedDeprioritized = newDeprioritized
      ? [...deprioritized, capitalize(newDeprioritized)]
      : deprioritized

    try {
      const res = await callApi({
        endpoint: `/v1/api/targetCompany/add`,
        method: "POST",
        data: {
          prioritizedCompanies: updatedPrioritized,
          deprioritizedCompanies: updatedDeprioritized,
        },
        disableSnackbar: false,
      })

      if (res.success) {
        fetchCompanyList()
        setNewPrioritized("")
        setNewDeprioritized("")
      }
    } catch (error) {
      console.error("Error adding companies:", error)
    }
  }

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(to bottom, #f8fafc, #f1f5f9)",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
     

           <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
          
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                 display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* <DashboardIcon sx={{ fontSize: 40, color: "white" }} /> */}
              <AdsClickIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography fontSize={19} color='white' fontWeight='bold' gutterBottom mt={1}>
                Target Companies
              </Typography>
              <Typography fontSize={15} color='white' sx={{ opacity: 0.9, my: -1.5 }}>
                Manage your prioritized and deprioritized company lists
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
              {/* <Tooltip title="Refresh lists" arrow>
            <IconButton
            color="white"
              onClick={fetchCompanyList}
              variant="outlined"
              sx={{
                ml: "auto",
                transition: "transform 0.3s ease",
                color: "white",
                borderColor: "white",
                "&:hover": {
                  transform: "rotate(180deg)",
                  color: "white",
                  borderRadius: "50%",
                },
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip> */}
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
      </Paper>

        {/* Cards Section */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, mb: 4 }}>
          {/* Prioritized Companies */}
          <Card elevation={2} sx={{ flex: 1, borderRadius: 2, overflow: "hidden", position: "relative" }}>
            <Box
              sx={{
                height: "4px",
                background: "linear-gradient(to right, #4ade80, #22c55e)",
              }}
            />
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ThumbUp sx={{ color: "#22c55e", mr: 1.5 }} />
                  <Typography variant="h6" fontWeight="600">
                    Prioritized Companies
                  </Typography>
                </Box>
              }
              action={
                <Chip
                  label={`${prioritized.length} companies`}
                  size="small"
                  sx={{
                    bgcolor: alpha("#22c55e", 0.1),
                    color: "#22c55e",
                    fontWeight: 500,
                  }}
                />
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ minHeight: 100, mb: 3 }}>
                {prioritized.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {prioritized.map((company, i) => (
                      <Zoom in key={i} style={{ transitionDelay: `${i * 50}ms` }}>
                        <Chip
                          label={capitalize(company)}
                          icon={<CheckCircle fontSize="small" color="success" />}
                          onDelete={() => {
                            const updated = prioritized.filter((_, index) => index !== i)
                            setPrioritized(updated)
                          }}
                          deleteIcon={<Close sx={{ color: "#dc2626" }} />}
                          sx={{
                            bgcolor: alpha("#22c55e", 0.1),
                            color: "#166534",
                            fontWeight: 500,
                            border: "1px solid",
                            borderColor: alpha("#22c55e", 0.3),
                            "&:hover": {
                              bgcolor: alpha("#22c55e", 0.2),
                            },
                          }}
                        />
                      </Zoom>
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                      bgcolor: alpha("#f1f5f9", 0.5),
                      borderRadius: 2,
                      border: "1px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <Typography color="text.secondary">No prioritized companies added yet</Typography>
                  </Box>
                )}
              </Box>

              <TextField
                label="Add Prioritized Company"
                size="small"
                fullWidth
                value={newPrioritized}
                onChange={(e) => setNewPrioritized(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessCenter sx={{ color: "#22c55e" }} />
                    </InputAdornment>
                  ),
                  endAdornment: newPrioritized && (
                    <InputAdornment position="end">
                      <Tooltip title="Add to list" arrow>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setPrioritized([...prioritized, capitalize(newPrioritized)])
                            setNewPrioritized("")
                          }}
                          sx={{ color: "#22c55e" }}
                        >
                          <Add />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#22c55e",
                    },
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Deprioritized Companies */}
          <Card elevation={2} sx={{ flex: 1, borderRadius: 2, overflow: "hidden", position: "relative" }}>
            <Box
              sx={{
                height: "4px",
                background: "linear-gradient(to right, #f87171, #ef4444)",
              }}
            />
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ThumbDown sx={{ color: "#ef4444", mr: 1.5 }} />
                  <Typography variant="h6" fontWeight="600">
                    Deprioritized Companies
                  </Typography>
                </Box>
              }
              action={
                <Chip
                  label={`${deprioritized.length} companies`}
                  size="small"
                  sx={{
                    bgcolor: alpha("#ef4444", 0.1),
                    color: "#ef4444",
                    fontWeight: 500,
                  }}
                />
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ minHeight: 100, mb: 3 }}>
                {deprioritized.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {deprioritized.map((company, i) => (
                      <Zoom in key={i} style={{ transitionDelay: `${i * 50}ms` }}>
                        <Chip
                          label={capitalize(company)}
                          icon={<Cancel fontSize="small" color="error" />}
                          onDelete={() => {
                            const updated = deprioritized.filter((_, index) => index !== i)
                            setDeprioritized(updated)
                          }}
                          deleteIcon={<Close sx={{ color: "#dc2626" }} />}
                          sx={{
                            bgcolor: alpha("#ef4444", 0.1),
                            color: "#991b1b",
                            fontWeight: 500,
                            border: "1px solid",
                            borderColor: alpha("#ef4444", 0.3),
                            "&:hover": {
                              bgcolor: alpha("#ef4444", 0.2),
                            },
                          }}
                        />
                      </Zoom>
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                      bgcolor: alpha("#f1f5f9", 0.5),
                      borderRadius: 2,
                      border: "1px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <Typography color="text.secondary">No deprioritized companies added yet</Typography>
                  </Box>
                )}
              </Box>

              <TextField
                label="Add Deprioritized Company"
                size="small"
                fullWidth
                value={newDeprioritized}
                onChange={(e) => setNewDeprioritized(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessCenter sx={{ color: "#ef4444" }} />
                    </InputAdornment>
                  ),
                  endAdornment: newDeprioritized && (
                    <InputAdornment position="end">
                      <Tooltip title="Add to list" arrow>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setDeprioritized([...deprioritized, capitalize(newDeprioritized)])
                            setNewDeprioritized("")
                          }}
                          sx={{ color: "#ef4444" }}
                        >
                          <Add />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ef4444",
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Action Button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleAddCompanies}
              // disabled={(!newPrioritized && !newDeprioritized) || loading}
              startIcon={<Add />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                background: "linear-gradient(to right, #3b82f6, #60a5fa)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>

        </Box>

        {/* Info Note */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 2,
            bgcolor: alpha("#3b82f6", 0.05),
            border: "1px solid",
            borderColor: alpha("#3b82f6", 0.2),
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Info sx={{ color: "#3b82f6", mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, color: "#1e40af" }}>
              About Target Companies
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Prioritized companies will be given preference in candidate sourcing and job matching. Deprioritized
              companies will be filtered out from candidate recommendations. Changes will take effect immediately after
              saving.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
