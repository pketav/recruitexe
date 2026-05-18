"use client"
import { useState, useEffect } from "react"
import {
  Container,
  Paper,
  Typography,
  Box,
  MenuItem,
  Switch,
  Button,
  Slider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from "@mui/material"
import axios from "axios"
import { useApi } from "@core/hooks/useApi"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import SettingsIcon from "@mui/icons-material/Settings"
import GpsFixedIcon from "@mui/icons-material/GpsFixed"
import { useRouter } from "next/navigation"
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace"

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ai-tabpanel-${index}`}
      aria-labelledby={`ai-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [tabValue, setTabValue] = useState(0)
  const [aiThreshold, setAiThreshold] = useState(50)
  const [autoScreening, setAutoScreening] = useState(true)
  const [confidenceThreshold, setConfidenceThreshold] = useState(50)
  const { callApi, loading } = useApi()
  const [screeningCriteria, setScreeningCriteria] = useState([])
  const [criteriaDialogOpen, setCriteriaDialogOpen] = useState(false)
  const [newCriteriaName, setNewCriteriaName] = useState("")
  const [newCriteriaWeight, setNewCriteriaWeight] = useState(0)
  const [newCriteriaConfidence, setNewCriteriaConfidence] = useState(50)
  const [newCriteriaDescription, setNewCriteriaDescription] = useState("")
  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [coreSetting, setCoreSetting] = useState({})
  const [totalWeight, setTotalWeight] = useState(100)
  const [autoScreeningMode, setAutoScreeningMode] = useState(false)
  const [autoResumeShortlisting, setAutoResumeShortlisting] = useState(false)

  const getCoreSetting = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/AISetUp/get-ai-screening`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      if (res.data.status) {
        setCoreSetting(res.data.items[0])
        setAiThreshold(res.data.items[0]?.coreSettings?.qualificationThreshold)
        setConfidenceThreshold(res.data.items[0]?.coreSettings?.confidenceThreshold)
        setAutoScreening(res.data.items[0]?.coreSettings?.automaticScreening)
        setScreeningCriteria(res.data.items[0]?.screeningCriteria)
        setTotalWeight(
          res.data.items[0]?.screeningCriteria.filter((c) => c.isActive).reduce((sum, c) => sum + c.weight, 0),
        )
        setAutoScreeningMode(res.data.items[0].autoScreening)
        setAutoResumeShortlisting(res.data.items[0].autoResumeShortlisting || false)
      }
    } catch (error) {
      console.error("Error fetching core settings:", error)
    }
  }

  // const getRules = async () => {
  //   try {
  //     const res = await callApi({
  //       endpoint: `/v1/api/AISetUp/get-ai-rules`,
  //       disableSnackbar: true
  //     })
  //     if (res.data.status) {
  //       setAutoScreeningMode(res.data?.items[0]?.AutomaticScreening)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching rules:', error)
  //   }
  // }

  useEffect(() => {
    getCoreSetting()
  }, [])

  const handleSave = async (updatedCriteria, checkedScreening, checkedShortlisting) => {
    try {
      const res = await callApi({
        endpoint: `/v1/api/AISetUp/update-ai-screening/${coreSetting.id}`,
        method: "POST",
        data: {
          name: "AI Configuration & Settings",
          description: "Configure AI model parameters, screening criteria, and automation settings",
          coreSettings: {
            qualificationThreshold: aiThreshold,
            confidenceThreshold: confidenceThreshold,
          },
          screeningCriteria: updatedCriteria,
          isActive: true,
          autoScreening: checkedScreening,
          autoResumeShortlisting: checkedShortlisting,
        },
        disableSnackbar: false,
      })
      if (res.data.status) {
        getCoreSetting()
      }
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    const activeTotal = screeningCriteria.filter((c) => c.isActive).reduce((sum, c) => sum + c.weight, 0)
    setTotalWeight(activeTotal)
  }, [screeningCriteria])

  const updateCriteriaWeight = (id, newValue) => {
    const current = screeningCriteria.find((c) => c.id === id)
    if (!current) return
    const weightDiff = newValue - current.weight
    const newTotal = totalWeight + weightDiff
    if (newTotal > 100) return
    const updated = screeningCriteria.map((c) => (c.id === id ? { ...c, weight: newValue } : c))
    setScreeningCriteria(updated)
  }

  const handleAddCriteria = () => {
    if (totalWeight + newCriteriaWeight > 100) return
    const newCriteria = {
      name: newCriteriaName,
      description: newCriteriaDescription,
      weight: newCriteriaWeight,
      isActive: true,
      confidence: newCriteriaConfidence,
    }
    const updatedCriteria = [...screeningCriteria, newCriteria]
    setScreeningCriteria(updatedCriteria)
    setNewCriteriaName("")
    setNewCriteriaDescription("")
    setNewCriteriaWeight(0)
    setCriteriaDialogOpen(false)
    handleSave(updatedCriteria, autoScreeningMode, autoResumeShortlisting)
  }

  const remainingWeight = (id) => {
    const current = screeningCriteria.find((c) => c.id === id)?.weight || 0
    return 100 - totalWeight
  }

  const handleDeleteCriteria = (id) => {
    const updatedCriteria = screeningCriteria.filter((criteria) => criteria.id !== id)
    setScreeningCriteria(updatedCriteria)
    handleSave(updatedCriteria, autoScreeningMode, autoResumeShortlisting)
  }

  const handleToggleCriteria = (id) => {
    const updatedCriteria = screeningCriteria.map((criteria) =>
      criteria.id === id ? { ...criteria, isActive: !criteria.isActive } : criteria,
    )
    setScreeningCriteria(updatedCriteria)
    handleSave(updatedCriteria, autoScreeningMode, autoResumeShortlisting)
  }

  const ToggleScreeningFunction = (e) => {
    setAutoScreeningMode(e.target.checked)
    handleSave(screeningCriteria, e.target.checked, autoResumeShortlisting)
  }

  const ToggleShortlistingFunction = (e) => {
    setAutoResumeShortlisting(e.target.checked)
    handleSave(screeningCriteria, autoScreeningMode, e.target.checked)
  }

  return (
    <Container maxWidth="xl" sx={{ px: 0 }}>
      {/* Header Section - Matching Figma Design */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
              {/* <DashboardIcon sx={{ fontSize: 40, color: "white" }} /> */}
              <SmartToyIcon sx={{ fontSize: 30, color: "white" }} />
            </Box>
            <Box>
              <Typography fontSize={19} color="white" fontWeight="bold" gutterBottom mt={1}>
                AI Configuration & Settings
              </Typography>
              <Typography fontSize={15} color="white" sx={{ opacity: 0.9, my: -1.5 }}>
                Configure AI model parameters, screening criteria, and automation settings
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              sx={{ borderRadius: "25px" }}
              color="white"
              variant="outlined"
              onClick={() => router.push("/employeeSetup")}
            >
              <KeyboardBackspaceIcon />
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* AI Control Panel - Matching Figma Design */}
      <Paper
        sx={{
          mx: 3,
          mb: 4,
          p: 3,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          bgcolor: "white",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <SettingsIcon sx={{ color: "#6366f1", fontSize: 22 }} />
          <Typography variant="h6" fontWeight={600} color="#1e293b">
            AI Control Panel
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Automatic Screening Mode */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                "&:hover": { bgcolor: "#f9fafb" },
                transition: "background 0.2s ease-in-out",
              }}
            >
              <Box sx={{ maxWidth: "75%" }}>
                <Typography variant="subtitle1" fontWeight={600} color="#1e293b">
                  Automatic Screening Mode
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ fontSize: "13px", mt: 0.5 }}>
                  Enable fully automated candidate screening
                </Typography>
              </Box>
              <Switch
                checked={autoScreeningMode}
                onChange={(e) => ToggleScreeningFunction(e)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "white",
                    "& + .MuiSwitch-track": { bgcolor: "#6366f1" },
                  },
                  "& .MuiSwitch-track": { bgcolor: "#d1d5db" },
                }}
              />
            </Box>
          </Grid>

          {/* Auto Resume Shortlisting */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                "&:hover": { bgcolor: "#f9fafb" },
                transition: "background 0.2s ease-in-out",
              }}
            >
              <Box sx={{ maxWidth: "75%" }}>
                <Typography variant="subtitle1" fontWeight={600} color="#1e293b">
                  Auto Resume Shortlisting
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ fontSize: "13px", mt: 0.5 }}>
                  Automatically shortlist resumes based on AI analysis
                </Typography>
              </Box>
              <Switch
                checked={autoResumeShortlisting}
                onChange={(e) => ToggleShortlistingFunction(e)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "white",
                    "& + .MuiSwitch-track": { bgcolor: "#10b981" },
                  },
                  "& .MuiSwitch-track": { bgcolor: "#d1d5db" },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>



      {/* AI Qualification Threshold - Matching Figma Design */}
      <Paper
        sx={{
          mx: 3,
          mb: 4,
          p: 4,
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          bgcolor: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <GpsFixedIcon sx={{ color: "#ef4444", fontSize: 20 }} />
          <Typography variant="h6" fontWeight={600} color="#1e293b">
            AI Qualification Threshold:
          </Typography>
        </Box>
        <Typography variant="body2" color="#64748b" sx={{ mb: 4, fontSize: "14px" }}>
          Candidates scoring above this threshold are automatically qualified
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            disabled={!autoScreeningMode}
            value={aiThreshold}
            onChange={(_, value) => setAiThreshold(value)}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            marks={[
              { value: 0, label: "0%" },
              { value: 30, label: "30%" },
              { value: 40, label: "40%" },
              { value: 60, label: "60%" },
              { value: 100, label: "100%" },
            ]}
            sx={{
              color: "#6366f1",
              height: 4,
              "& .MuiSlider-thumb": {
                bgcolor: "#6366f1",
                border: "none",
                boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
                width: 16,
                height: 16,
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                },
                "&:before": {
                  display: "none",
                },
              },
              "& .MuiSlider-rail": {
                bgcolor: "#e2e8f0",
                opacity: 1,
                height: 4,
              },
              "& .MuiSlider-track": {
                bgcolor: "#6366f1",
                border: "none",
                height: 4,
              },
              "& .MuiSlider-markLabel": {
                fontSize: "12px",
                color: "#64748b",
                fontWeight: 500,
                marginTop: "8px",
              },
              "& .MuiSlider-mark": {
                display: "none",
              },
              "& .MuiSlider-valueLabel": {
                bgcolor: "#6366f1",
                color: "white",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                "&:before": {
                  borderTopColor: "#6366f1",
                },
              },
            }}
          />
        </Box>
      </Paper>

      {/* <Paper
        sx={{
          mx: 3,
          mb: 4,
          p: 4,
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          bgcolor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TuneIcon sx={{ color: '#6366f1', fontSize: 20 }} />
            <Typography variant='h6' fontWeight={600} color='#1e293b'>
              Custom Screening Criteria
            </Typography>
          </Box>
                 
        <Alert
          severity='warning'
          sx={{
            mb: 4,
            bgcolor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            '& .MuiAlert-icon': {
              color: '#f59e0b'
            },
            '& .MuiAlert-message': {
              color: '#92400e',
              fontWeight: 500
            }
          }}
        >
          Total Weight: {totalWeight}% ⚠️ Weights should Total 100%
        </Alert>
        <Grid container spacing={3}>
          {screeningCriteria.map((criteria, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  bgcolor: 'white',
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant='h6' fontWeight={600} color='#1e293b' sx={{ fontSize: '16px' }}>
                      {criteria.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={criteria.isActive}
                        onChange={() => handleToggleCriteria(criteria.id)}
                        disabled={!autoScreeningMode || (!criteria.isActive && totalWeight + criteria.weight > 100)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: 'white',
                            '& + .MuiSwitch-track': {
                              bgcolor: '#6366f1',
                              opacity: 1
                            }
                          },
                          '& .MuiSwitch-track': {
                            bgcolor: '#d1d5db',
                            opacity: 1
                          }
                        }}
                      />
                                        
                    </Box>
                  </Box>
                  <Typography variant='body2' color='#64748b' sx={{ mb: 3, fontSize: '14px' }}>
                    {criteria.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                                      
                    <Typography variant='body2' color='#6366f1' fontWeight={500} sx={{ mb: 2 }}>
                      Weight: {criteria.weight}
                    </Typography>
                  </Box>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      disabled={!autoScreeningMode || !criteria.isActive}
                      value={criteria.weight}
                      onChange={(_, value) => updateCriteriaWeight(criteria.id, value)}
                      min={0}
                      max={100}
                      valueLabelDisplay='auto'
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 30, label: '30%' },
                        { value: 40, label: '40%' },
                        { value: 60, label: '60%' },
                        { value: 100, label: '100%' }
                      ]}
                      sx={{
                        color: '#6366f1',
                        height: 4,
                        '& .MuiSlider-thumb': {
                          bgcolor: '#6366f1',
                          border: 'none',
                          boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)',
                          width: 14,
                          height: 14,
                          '&:before': {
                            display: 'none'
                          }
                        },
                        '& .MuiSlider-rail': {
                          bgcolor: '#e2e8f0',
                          opacity: 1,
                          height: 4
                        },
                        '& .MuiSlider-track': {
                          bgcolor: '#6366f1',
                          border: 'none',
                          height: 4
                        },
                        '& .MuiSlider-markLabel': {
                          fontSize: '10px',
                          color: '#64748b',
                          fontWeight: 500,
                          marginTop: '6px'
                        },
                        '& .MuiSlider-mark': {
                          display: 'none'
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            variant='contained'
            onClick={() => handleSave(screeningCriteria, autoScreeningMode, autoResumeShortlisting)}
            disabled={!autoScreeningMode}
            sx={{
              bgcolor: '#6366f1',
              color: 'white',
              borderRadius: '8px',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                bgcolor: '#5b5bf6',
                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)'
              },
              '&:disabled': {
                bgcolor: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
          >
            Setup All Data
          </Button>
        </Box>
      </Paper> */}

      <Dialog open={criteriaDialogOpen} onClose={() => setCriteriaDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Screening Criteria</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Criteria Name"
            fullWidth
            select
            variant="outlined"
            value={newCriteriaName}
            onChange={(e) => setNewCriteriaName(e.target.value)}
            sx={{ mb: 2 }}
            error={screeningCriteria.some((c) => c.name === newCriteriaName)}
            helperText={
              screeningCriteria.some((c) => c.name === newCriteriaName) ? "This criteria already exists." : ""
            }
          >
            {[
              "Technical Skills",
              "Education",
              "Experience",
              "Communication",
              "Leadership",
              "Problem Solving",
              "Teamwork",
              "Adaptability",
              "Creativity",
              "Cultural Fit",
              "Time Management",
              "Analytical Thinking",
              "Decision Making",
              "Work Ethic",
              "Motivation",
              "Project Management",
              "Attention to Detail",
              "Learning Ability",
              "Negotiation Skills",
              "Client Handling",
            ].map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={newCriteriaDescription}
            onChange={(e) => setNewCriteriaDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography gutterBottom>Remaining Weight: {100 - totalWeight}%</Typography>
          <Typography gutterBottom>Weight: {newCriteriaWeight}%</Typography>
          <Slider
            value={newCriteriaWeight}
            onChange={(_, value) => {
              const remaining = 100 - totalWeight
              if (value <= remaining) {
                setNewCriteriaWeight(value)
              }
            }}
            min={0}
            max={100}
            marks={[
              { value: 20, label: "20%" },
              { value: 50, label: "50%" },
              { value: 85, label: "85%" },
              { value: 100, label: "100%" },
            ]}
            valueLabelDisplay="auto"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCriteriaDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddCriteria}
            disabled={
              !newCriteriaName ||
              !newCriteriaDescription ||
              newCriteriaConfidence === 0 ||
              screeningCriteria.some((c) => c.name === newCriteriaName) ||
              totalWeight + newCriteriaWeight > 100
            }
          >
            Add Criteria
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
