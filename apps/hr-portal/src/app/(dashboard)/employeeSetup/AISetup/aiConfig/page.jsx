'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar
} from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SettingsIcon from '@mui/icons-material/Settings'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import axios from 'axios'
import { useApi } from "@core/hooks/useApi"
const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '70vh',
      gap: 3
    }}
  >
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Avatar
        sx={{
          width: 60,
          height: 60,
          bgcolor: '#78c1f5',
          boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)'
        }}
      >
        <SmartToyIcon sx={{ fontSize: 30 }} />
      </Avatar>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '3px solid',
            borderColor: '#78c1f5',
            borderTopColor: 'transparent',
            animation: 'spin 1.5s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        />
      </Box>
    </Box>
    <Typography variant='h6' color='#78c1f5' fontWeight='medium'>
      Loading AI Configuration...
    </Typography>
  </Box>
)

// Icons as simple components
const ExpandMoreIcon = () => <span style={{ fontSize: '16px' }}>▼</span>
const AddIcon = () => <span style={{ fontSize: '16px' }}>➕</span>
const EditIcon = () => <span style={{ fontSize: '16px' }}>✏️</span>
const DeleteIcon = () => <span style={{ fontSize: '16px' }}>🗑️</span>
const RuleIcon = () => <span style={{ fontSize: '16px' }}>📏</span>
const AutoIcon = () => <span style={{ fontSize: '16px' }}>🔄</span>

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AIConfigPage() {
  const [loading, setLoading] = useState(true)
  const [autoMode, setAutoMode] = useState(true)
  const [smartFiltering, setSmartFiltering] = useState(true)
  const [adaptiveLearning, setAdaptiveLearning] = useState(false)
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState(null)
  const [rules, setRules] = useState([])
  const token = window.localStorage.getItem('authToken')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [configId, setConfigId] = useState('')
  const { callApi } = useApi()
  const [rulesData, setRulesData] = useState({
    AutomaticScreening: true,
    AI_Screening: [
      {
        name: '',
        description: '',
        priority: '',
        category: '',
        isActive: true
      }
    ]
  })
  const [editingRule, setEditingRule] = useState(null)
  const [autoScreeningMode, setAutoScreeningMode] = useState(true)
  const [autoResumeShortlisting, setAutoResumeShortlisting] = useState(false);


  // AI Screening Rules
  const [screeningRules, setScreeningRules] = useState([
    {
      id: 1,
      name: 'Technical Skills Validation',
      description: 'Automatically validate technical skills mentioned in resume',
      category: 'Skills',
      priority: 'High',
      enabled: true,
      conditions: [
        { field: 'skills', operator: 'contains', value: 'programming languages' },
        { field: 'experience', operator: 'gte', value: '2 years' }
      ],
      action: 'boost_score',
      boost: 15,
      confidence: 92
    },
    {
      id: 2,
      name: 'Education Requirements',
      description: 'Check minimum education requirements for the position',
      category: 'Education',
      priority: 'Medium',
      enabled: true,
      conditions: [{ field: 'education', operator: 'contains', value: "Bachelor's|Master's|PhD" }],
      action: 'require',
      boost: 0,
      confidence: 88
    },
    {
      id: 3,
      name: 'Communication Score',
      description: 'Evaluate communication skills based on cover letter and resume quality',
      category: 'Communication',
      priority: 'Medium',
      enabled: true,
      conditions: [
        { field: 'cover_letter_quality', operator: 'gte', value: '7/10' },
        { field: 'grammar_score', operator: 'gte', value: '85' }
      ],
      action: 'boost_score',
      boost: 10,
      confidence: 85
    }
  ])

  // Real-time metrics
  const realtimeMetrics = {
    candidatesProcessed: 1247,
    avgProcessingTime: 2.3,
    rulesTriggered: 3456,
    autoDecisions: 89.2,
    accuracyTrend: [
      { time: '09:00', accuracy: 87.2 },
      { time: '10:00', accuracy: 87.8 },
      { time: '11:00', accuracy: 88.1 },
      { time: '12:00', accuracy: 87.9 },
      { time: '13:00', accuracy: 88.3 },
      { time: '14:00', accuracy: 88.7 }
    ]
  }

  const pieChartData = [
    { name: 'Skills', value: 35 },
    { name: 'Education', value: 25 },
    { name: 'Experience', value: 20 },
    { name: 'Communication', value: 15 },
    { name: 'Other', value: 5 }
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
    }
    fetchData()
  }, [])

  const getPriorityColor = priority => {
    switch (priority) {
      case 'High':
        return 'error'
      case 'Medium':
        return 'warning'
      case 'Low':
        return 'info'
      default:
        return 'default'
    }
  }

  const getRules = async () => {
    try {
      const res = await callApi({
        endpoint: `/v1/api/AISetUp/get-ai-rules`,
        disableSnackbar: true
      })
      if (res.data.status) {
        setRules(res.data?.items[0]?.AI_Screening)
        setConfigId(res.data?.items[0]?._id)
        setAutoScreeningMode(res.data?.items[0]?.AutomaticScreening)
        setAutoResumeShortlisting(res.data?.items[0]?.AutoResumeShortlisting);
      }
    } catch (error) {
      console.error('Error adding job description:', error)
    }
  }

  const [categories, setCategories] = useState([])
  const getCategories = async () => {
    try {
      const res = await callApi({
        endpoint: `/v1/api/AISetUp/get-categories`,
        disableSnackbar: true
      })
      if (res.data.status) {
        setCategories(res.data?.items)
      }
    } catch (error) {
      console.error('Error adding job description:', error)
    }
  }

  useEffect(() => {
    getRules()
    getCategories()
  }, [])


  const handleAddRules = async () => {
    try {
      const isEditing = Boolean(editingRule)
      const url = isEditing ? `/v1/api/AISetUp/update-ai-rule/${configId}` : `/v1/api/AISetUp/create-ai-rule`

      let payload

      if (isEditing) {
        const finalRules = rules.map(rule => {
          if (rule._id === editingRule) {
            return {
              ...rule,
              ...rulesData.AI_Screening[0],
              category: rulesData.AI_Screening[0].category // assuming it's already an ID
            }
          } else {
            return {
              name: rule.name,
              description: rule.description,
              priority: rule.priority,
              category: rule.category[0]?.screeningCriteria._id,
              isActive: rule.isActive
            }
          }
        })

        payload = {
          AutomaticScreening: true,
          AI_Screening: finalRules
        }
      } else {
        // Only send the new rule when creating
        payload = {
          AutomaticScreening: true,
          AI_Screening: [rulesData.AI_Screening[0]]
        }
      }

      const res = await callApi({
        endpoint: url,
        method: 'POST',
        data: payload,
        disableSnackbar: false,
        successMessage: `Rule Added Successfully`
      })
      if (res.data.status) {
        setRuleDialogOpen(false)
        setEditingRule(null)
        setRulesData({
          AutomaticScreening: true,
          AI_Screening: [
            {
              name: '',
              description: '',
              priority: '',
              category: '',
              isActive: true
            }
          ]
        })
        getRules()
      }
    } catch (error) {
      console.error('Error saving rule:', error)
    }
  }

  const handleRuleToggle = async (rule, checked, index) => {
    try {
      // Create a new AI_Screening array, updating only the selected rule
      const updatedScreening = rules.map((r, i) => ({
        name: r.name,
        description: r.description,
        priority: r.priority,
        category: r.category[0]?.screeningCriteria._id,
        isActive: i === index ? checked : r.isActive // toggle only the clicked index
      }))

      const res = await callApi({
        endpoint: `/v1/api/AISetUp/update-ai-rule/${configId}`,
        method: 'POST',
        data: {
          AutomaticScreening: 'true',
          AI_Screening: updatedScreening
        },
        disableSnackbar: false
      })
      if (res.data.status) {
        getRules()
      }
    } catch (error) {
      console.error('Error updating rule status:', error)
    }
  }
  const handleToggle = async (checked, key) => {
    try {
      const updatedScreening = rules.map((r) => ({
        name: r.name,
        description: r.description,
        priority: r.priority,
        category: r.category[0]?.screeningCriteria._id,
        isActive: r.isActive
      }));

      const res = await callApi({
        endpoint: `/v1/api/AISetUp/update-ai-rule/${configId}`,
        method: 'POST',
        data: {
          [key]: String(checked),
          AI_Screening: updatedScreening
        },
        disableSnackbar: false,
        successMessage: `${key === 'AutomaticScreening' ? 'Auto Screening' : 'Auto Resume Shortlisting'} ${checked ? 'turned on' : 'turned off'}`
      });

      if (res.data.status) {
        if (key === 'AutomaticScreening') {
          setAutoScreeningMode(checked);
        } else {
          setAutoResumeShortlisting(checked);
        }
        getRules();
      }
    } catch (error) {
      console.error('Error updating rule status:', error);
    }
  };

  const handleAIScreeningChange = (index, field, value) => {
    const updated = [...rulesData.AI_Screening]
    updated[index][field] = value
    setRulesData(prev => ({
      ...prev,
      AI_Screening: updated
    }))
  }

  const handleCloseDialog = () => {
    setRuleDialogOpen(false)
    setEditingRule(null)
    setRulesData({
      AutomaticScreening: true,
      AI_Screening: [
        {
          name: '',
          description: '',
          priority: '',
          category: '',
          isActive: true
        }
      ]
    })
  }

  const handleAutoScreeningToggle = async checked => {
    try {
      const updatedScreening = rules.map((r, i) => ({
        name: r.name,
        description: r.description,
        priority: r.priority,
        category: r.category[0]?.screeningCriteria._id,
        isActive: r.isActive
      }))

      const res = await callApi({
        endpoint: `/v1/api/AISetUp/update-ai-rule/${configId}`,
        method: 'POST',
        data: {
          AutomaticScreening: String(checked),
          AI_Screening: updatedScreening
        },
        disableSnackbar: false,
        successMessage: `Auto Screening ${checked ? 'turned on' : 'turned off'}`
      })

      if (res.data.status) {
        getRules()
      }
    } catch (error) {
      console.error('Error updating rule status:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Container maxWidth='xl'>
      {/* <Box sx={{ mb: 4, display:"flex", gap:3 ,alignItems:"center"}}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: "#78c1f5",
          boxShadow: "0 8px 16px rgba(25, 118, 210, 0.2)",
        }}
      >
        <SmartToyIcon sx={{ fontSize: 20 }} />
      </Avatar>
      <Box>
      <Typography fontSize={17} fontWeight={700} mt={1} color="black" component="h1" gutterBottom>
          AI Configuration & Settings
        </Typography>
        <Typography fontSize={14} color="text.secondary" mt={-1}>
          Configure AI model parameters, screening criteria, and automation settings
        </Typography>
      </Box>
      </Box> */}

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
              <SmartToyIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography fontSize={19} color='white' fontWeight='bold' gutterBottom mt={1}>
                AI Configuration & Settings
              </Typography>
              <Typography fontSize={15} color='white' sx={{ opacity: 0.9, my: -1.5 }}>
                Configure AI model parameters, screening criteria, and automation settings
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
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

      {/* AI Control Panel */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          boxShadow: 3,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)'
          },
          bgcolor: 'background.paper'
        }}
      >
        <Typography
          variant='h6'
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontFamily: '"Roboto", sans-serif'
          }}
        >
          <SettingsIcon sx={{ color: 'primary.main', fontSize: 24 }} />
          AI Control Panel
        </Typography>

        <Grid container spacing={3}>
          {/* Automatic Screening Mode */}
          <Grid item xs={12} >
            <FormControlLabel
              control={
                <Switch
                  checked={autoScreeningMode}
                  onChange={(e) => handleToggle(e.target.checked, 'AutomaticScreening')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        opacity: 0.8
                      }
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      opacity: 1
                    },
                    '& .MuiSwitch-track': {
                      bgcolor: 'grey.300',
                      opacity: 0.5
                    },
                    '& .MuiSwitch-switchBase': {
                      transition: 'all 0.2s ease'
                    }
                  }}
                />
              }
              label={
                <Typography variant='subtitle1' sx={{ fontWeight: 500, color: 'text.primary' }}>
                  Automatic Screening Mode
                </Typography>
              }
              sx={{
                mb: 1,
                '&:hover': {
                  '& .MuiFormControlLabel-label': {
                    color: 'primary.main'
                  }
                }
              }}
            />
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                pl: 1,
                fontFamily: '"Roboto", sans-serif'
              }}
            >
              Enable fully automated candidate screening
            </Typography>
          </Grid>

          {/* Automatic Resume Shortlisting */}
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoResumeShortlisting}
                  onChange={(e) => handleToggle(e.target.checked, 'AutoResumeShortlisting')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        opacity: 0.8
                      }
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      opacity: 1
                    },
                    '& .MuiSwitch-track': {
                      bgcolor: 'grey.300',
                      opacity: 0.5
                    },
                    '& .MuiSwitch-switchBase': {
                      transition: 'all 0.2s ease'
                    }
                  }}
                />
              }
              label={
                <Typography variant='subtitle1' sx={{ fontWeight: 500, color: 'text.primary' }}>
                  Automatic Resume Shortlisting
                </Typography>
              }
              sx={{
                mb: 1,
                '&:hover': {
                  '& .MuiFormControlLabel-label': {
                    color: 'primary.main'
                  }
                }
              }}
            />
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                pl: 1,
                fontFamily: '"Roboto", sans-serif'
              }}
            >
              Enable AI-powered resume shortlisting
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Real-time Performance */}
        <Grid item xs={12}>
          {/* Screening Rules */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)'
              },
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontFamily: '"Roboto", sans-serif'
                }}
              >
                <RuleIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                AI Screening Rules
              </Typography>
              <Button
                variant='contained'
                disabled={!autoScreeningMode}
                startIcon={<AddIcon />}
                onClick={() => setRuleDialogOpen(true)}
                sx={{
                  py: 1,
                  px: 2,
                  fontWeight: 500,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    transform: 'scale(1.02)'
                  },
                  '&:disabled': {
                    bgcolor: 'grey.400',
                    color: 'grey.600',
                    boxShadow: 'none'
                  }
                }}
              >
                Add Rule
              </Button>
            </Box>

            {rules?.map((rule, index) => (
              <Accordion
                key={rule._id}
                sx={{
                  mb: 2,
                  borderRadius: 1,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:before': { display: 'none' },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                  sx={{
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      py: 1
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <RuleIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {rule.name}
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        {rule.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={rule.priority}
                      color={getPriorityColor(rule.priority)}
                      size='small'
                      sx={{
                        fontWeight: 500,
                        bgcolor: getPriorityColor(rule.priority) === 'default' ? 'grey.200' : undefined,
                        color: getPriorityColor(rule.priority) === 'default' ? 'text.primary' : undefined
                      }}
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        size='small'
                        startIcon={<EditIcon />}
                        disabled={!autoScreeningMode}
                        onClick={() => {
                          setRulesData({
                            AutomaticScreening: true,
                            AI_Screening: [
                              {
                                name: rule.name,
                                description: rule.description,
                                priority: rule.priority,
                                category: rule.category[0]?.screeningCriteria._id,
                                isActive: rule.isActive
                              }
                            ]
                          })
                          setEditingRule(rule._id)
                          setRuleDialogOpen(true)
                        }}
                        sx={{
                          color: 'primary.main',
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: 'primary.light',
                            color: 'common.white'
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size='small'
                        disabled={!autoScreeningMode}
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRuleToggle(rule, false, index)}
                        color='error'
                        sx={{
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: 'error.light',
                            color: 'common.white'
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: 'background.paper', p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
                        <strong>Categories:</strong>
                      </Typography>
                      <List dense>
                        {rule.category.map((item, index) => (
                          <ListItem
                            key={`${item.screeningCriteria?._id || index}`}
                            sx={{
                              py: 0.5,
                              borderLeft: '3px solid',
                              borderColor: 'primary.main',
                              pl: 2,
                              mb: 0.5,
                              borderRadius: 1
                            }}
                          >
                            <ListItemText
                              primary={`${item.screeningCriteria?.name} should carry a weightage of "${item.screeningCriteria?.weight}%".`}
                              secondary={`Confidence: ${item.screeningCriteria?.confidence}%`}
                              primaryTypographyProps={{
                                fontWeight: 500,
                                color: 'text.primary'
                              }}
                              secondaryTypographyProps={{
                                color: 'text.secondary',
                                fontStyle: 'italic'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={4}></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Rule Editor Dialog */}
      <Dialog open={ruleDialogOpen} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        <DialogTitle>{editingRule ? '✏️ Edit Screening Rule' : '➕ Add New Screening Rule'}</DialogTitle>

        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Rule Name'
                variant='outlined'
                sx={{ mb: 2 }}
                size='small'
                value={rulesData.AI_Screening[0].name}
                onChange={e => handleAIScreeningChange(0, 'name', e.target.value)}
              />
              <TextField
                fullWidth
                label='Description'
                multiline
                rows={3}
                variant='outlined'
                sx={{ mb: 2 }}
                size='small'
                value={rulesData.AI_Screening[0].description}
                onChange={e => handleAIScreeningChange(0, 'description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }} size='small'>
                <InputLabel>Category</InputLabel>
                <Select
                  label='Category'
                  value={rulesData.AI_Screening[0].category}
                  onChange={e => handleAIScreeningChange(0, 'category', e.target.value)}
                >
                  {categories.map(i => (
                    <MenuItem value={i.id}>{i.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }} size='small'>
                <InputLabel>Priority</InputLabel>
                <Select
                  label='Priority'
                  value={rulesData.AI_Screening[0].priority}
                  onChange={e => handleAIScreeningChange(0, 'priority', e.target.value)}
                >
                  <MenuItem value='High'>High</MenuItem>
                  <MenuItem value='Medium'>Medium</MenuItem>
                  <MenuItem value='Low'>Low</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }} size='small'>
                <InputLabel>Activity Status</InputLabel>
                <Select
                  label='Activity Status'
                  value={rulesData.AI_Screening[0].isActive}
                  onChange={e => handleAIScreeningChange(0, 'isActive', e.target.value)}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Alert severity='info'>
                💡 Rules are processed in priority order. High priority rules are evaluated first.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant='contained' onClick={handleAddRules}>
            {editingRule ? 'Update Rule' : 'Create Rule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
