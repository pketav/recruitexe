'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    IconButton,
    FormControlLabel,
    Checkbox,
    FormControl,
    Select,
    MenuItem,
    Paper,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    Tooltip,
    Fade,
    Avatar,
    Switch,
  } from "@mui/material"
  import {
    Close as CloseIcon,
    Settings as SettingsIcon,
    Timeline as TimelineIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    AccountTree as AccountTreeIcon,
    Schedule as ScheduleIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    KeyboardBackspace,
    Edit,
  } from "@mui/icons-material"
  import { styled, keyframes } from "@mui/material/styles"
import { WalletCards, Workflow } from 'lucide-react'
  
  // Animations
  const slideIn = keyframes`
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `
  
  const pulse = keyframes`
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  `
  
  // Styled Components
  const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      borderRadius: "16px",
      maxWidth: "900px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "hidden",
    },
  }))
  
  const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: '#1976d2',
    color: "#fff",
    padding: theme.spacing(3),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  }))
  
  const SectionCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    borderRadius: "12px",
    border: "1px solid rgba(99, 102, 241, 0.1)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    animation: `${slideIn} 0.5s ease-out`,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(99, 102, 241, 0.15)",
      transform: "translateY(-2px)",
    },
  }))
  
  const StageCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: "12px",
    border: "2px solid transparent",
    background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea, #764ba2) border-box",
    position: "relative",
    transition: "all 0.3s ease",
    // "&:hover": {
    //   animation: `${pulse} 2s infinite`,
    // },
  }))
  
  const ConditionRow = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f1f5f9",
      borderColor: "#cbd5e1",
    },
  }))

const WorkflowModal = () => {
  const [open, setOpen] = useState(false)
  const token = window.localStorage.getItem('authToken')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const employees = ['Team Leader', 'Manager', 'Admin', 'HR', 'Finance']
  const [flowSteps, setFlowSteps] = useState([''])
  const [showCondition, setShowCondition] = useState(true)
  const [conditions, setConditions] = useState([{ id: 1, logic: 'When', min: '', operator: '<', max: '', role: '' }])

  const handleStepChange = (index, value) => {
    const updated = [...flowSteps]
    updated[index] = value
    if (index === flowSteps.length - 1 && value !== '') {
      updated.push('')
    }
    setFlowSteps(updated)
  }




  const [workflow, setWorkflow] = useState([])

  const getAllWorkflow = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/workFlow/all`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      setWorkflow(res.data.items.workflows || [])
    } catch (error) {
      console.error('Error fetching workflows:', error)
    }
  }

  const [addWorkflow, setAddWorkflow] = useState({
    name: '',
    description: '',
    stages: [
      {
        stageName: '',
        stageOrder: 1,
        assignedRoles: '',
        assignedUsers: [],
        isOptional: false,
        conditions: [
          {
            field: '',
            operator: '',
            value: '',
            nextStageId: ''
          }
        ],
        // slaHours: '',
        // escalationRules: {
        //   escalateAfterHours: '',
        //   escalateTo: []
        // }
      }
    ],
    isActive: true
  })

  const handleOpen = () => {setOpen(true); setAddWorkflow(
    {
        name: '',
        description: '',
        stages: [
          {
            stageName: '',
            stageOrder: 1,
            assignedRoles: '',
            assignedUsers: [],
            isOptional: false,
            conditions: [
              {
                field: '',
                operator: '',
                value: '',
                nextStageId: ''
              }
            ],
            // slaHours: '',
            // escalationRules: {
            //   escalateAfterHours: '',
            //   escalateTo: []
            // }
          }
        ],
        isActive: true
      
  })}
  const handleClose = () => setOpen(false)

  const handleAddWorkflow = async () => {
    try {
      const res = await axios.post(`${baseUrl}/v1/api/workFlow`, addWorkflow, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      handleClose()
      getAllWorkflow()
    } catch (error) {
      console.error('Error adding subcategory:', error)
     } 
    finally {
      setAddWorkflow({
        name: '',
        description: '',
        stages: [
          {
            stageName: '',
            stageOrder: 1,
            assignedRoles: '',
            assignedUsers: [],
            isOptional: false,
            conditions: [
              {
                field: '',
                operator: '',
                value: '',
                nextStageId: ''
              }
            ],
            // slaHours: '',
            // escalationRules: {
            //   escalateAfterHours: '',
            //   escalateTo: []
            // }
          }
        ],
        isActive: true
      })
    }
  }

  const handleUpdateWorkflow = async (id) => {
    try {
      const res = await axios.put(`${baseUrl}/v1/api/workFlow/${id}`, addWorkflow, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      handleClose()
      getAllWorkflow()
    } catch (error) {
      console.error('Error adding subcategory:', error)
     } 
    finally {
      setAddWorkflow({
        name: '',
        description: '',
        stages: [
          {
            stageName: '',
            stageOrder: 1,
            assignedRoles: '',
            assignedUsers: [],
            isOptional: false,
            conditions: [
              {
                field: '',
                operator: '',
                value: '',
                nextStageId: ''
              }
            ],
            // slaHours: '',
            // escalationRules: {
            //   escalateAfterHours: '',
            //   escalateTo: []
            // }
          }
        ],
        isActive: true
      })
    }
  }

  const removeStage = (indexToRemove) => {
    setAddWorkflow(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== indexToRemove)
    }))
  }
  

  const handleFormChange = (field, value) => {
    setAddWorkflow(prev => ({ ...prev, [field]: value }))
  }

  const handleDeleteWorkflow = async id => {
    try {
      const res = await axios.delete(`${baseUrl}/v1/api/workFlow/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      getAllWorkflow()
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  useEffect(() => {
    getAllWorkflow()
  }, [])

  const handleStageChange = (index, field, value) => {
    const updatedStages = [...addWorkflow.stages]
    updatedStages[index][field] = value
 
    setAddWorkflow(prev => ({
      ...prev,
      stages: updatedStages
    }))
  }
  
  const handleConditionChange = (stageIndex, condIndex, field, value) => {
    setAddWorkflow(prev => {
      const updatedStages = [...prev.stages]
      const updatedConditions = [...updatedStages[stageIndex].conditions]
      updatedConditions[condIndex] = {
        ...updatedConditions[condIndex],
        [field]: value
      }
      updatedStages[stageIndex].conditions = updatedConditions
      return { ...prev, stages: updatedStages }
    })
  }
  
  const addCondition = (stageIndex) => {
    setAddWorkflow(prev => {
      const updatedStages = [...prev.stages]
        updatedStages[stageIndex] = {
        ...updatedStages[stageIndex],
        conditions: [
          ...(updatedStages[stageIndex].conditions || []),
          {
            field: '',
            operator: '',
            value: '',
            action: ''
          }
        ]
      }
  
      return { ...prev, stages: updatedStages }
    })
  }

  const handleEditClick = workflow => {
    setAddWorkflow({
        workflowId:workflow.workflowId,
        name: workflow?.name,
        workflowId:workflow?.workflowId,
        description: workflow?.description,
        stages: workflow?.stages.map(i=>({
            stageName:i.stageName,
            field:i.field,
            assignedRoles:i.roleRequired?._id,
            slaHours:i.timeoutHours || 0,
            conditions:i.conditions
        })),
        isActive: true 
    })
    setOpen(true)
  }

  const handleSubmit = () => {
    if (addWorkflow.workflowId) {
      handleUpdateWorkflow(addWorkflow.workflowId)
    } else {
        handleAddWorkflow()
    }
  }
  
  
  
  const removeCondition = (stageIndex, condIndex) => {
    setAddWorkflow(prev => {
      const updatedStages = [...prev.stages]
      updatedStages[stageIndex].conditions.splice(condIndex, 1)
      return { ...prev, stages: updatedStages }
    })
  }
  
  const handleEscalationChange = (stageIndex, field, value) => {
    setAddWorkflow(prev => {
      const updatedStages = [...prev.stages]
      const escalationRules = {
        ...(updatedStages[stageIndex].escalationRules || {}),
        [field]: value
      }
      updatedStages[stageIndex].escalationRules = escalationRules
      return { ...prev, stages: updatedStages }
    })
  }
  
  const addStage = () => {
    setAddWorkflow(prev => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          stageName: '',
          stageOrder: prev.stages.length + 1,
          assignedRoles: '',
          assignedUsers: [],
          isOptional: false,
          conditions: [
            { field: '', operator: '', value: '', nextStageId: '' }
          ],
        //   slaHours: '',
        //   escalationRules: {
        //     escalateAfterHours: '',
        //     escalateTo: []
        //   }
        }
      ]
    }))
  }


const [roles, setRoles] = useState([])
 
const getAllRole = async () => {
  try {
    const res = await axios.get(`${baseUrl}/v1/api/role/getRoleDropDown`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token
      }
    })

    if (res?.data?.items?.length) {
      setRoles(res.data.items) // <-- store role list in state
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

useEffect(() => {
  getAllRole()
}, [])
  

  return (
    <Box sx={{ p: 3, bgcolor: '#f9f9fb', minHeight: '100vh' }}>
      {/* Gradient Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          // background: 'linear-gradient(135deg, #4E36FF 0%, #9C27B0 100%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Workflow sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant='h4' fontWeight={600} sx={{ color: 'white', mb: '-5px' }}>
                Workflow
              </Typography>
              <Typography variant='caption' sx={{ color: '#ffffff', fontSize: '0.85rem' }}>
                Set up and manage automated workflows and approval hierarchies efficiently.
              </Typography>
            </Box>
          </Box>
          <Button
            sx={{
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
            variant='outlined'
            onClick={() => router.push('/employeeSetup')}
          >
            <KeyboardBackspace sx={{ fontSize: 18 }} />
          </Button>
        </Box>
      </Paper>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant='h4' color='#262E3D' mb={2}>
            Workflow Management
          </Typography>
          <Typography variant='body2' color='##667085'>
            Set up automated processes and approval hierarchies for efficient operations.
          </Typography>
        </Box>
        <Box>
          <Button variant='contained' startIcon={<AddIcon />} onClick={handleOpen}>
            Add Workflow
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {workflow.map(item => (
          <Grid item xs={12} sm={6} key={item._id}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 1, position: 'relative' }}>
              <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          flexWrap='wrap'
          gap={2}
        >
          <Box display='flex' alignItems='center' gap={2}>
          <Button
                sx={{
                    bgcolor: '#4E36FF',
                    width: 45,
                    height: 45,
                    borderRadius: '30%',
                    color: '#ffffff',
                    minWidth: 0,
                    p: 0,
                }}
                >
                <WalletCards />
                </Button>
            <Box>
            <Typography fontWeight={600} fontSize='18px'  sx={{color:"#262E3D"}}>
              {item.name}
              </Typography>
              <Typography fontWeight={400} fontSize='14px' sx={{ color: '#667085' }}>
              {item.description} 
              </Typography>
            </Box>
          </Box>

          <Switch defaultChecked={item.isActive} />
        </Box>
<Box sx={{padding:3, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
    <Box sx={{paddingX:5, mx:5}}>
    <Typography variant='body2' color='text.secondary'>
                  Type – {item.workflowType || 'N/A'}
                </Typography>
                <Typography variant='body2' fontWeight='bold' mt={2}>
                  Approval Flow:
                </Typography>
                <Typography variant='body2' fontWeight='bold' sx={{ color: '#667eea' }}>
                  {item?.stages.map(stage => stage.roleRequired?.roleName).join(' → ')}
                </Typography>
      </Box>
      <Box >
                <IconButton onClick={()=>{
                    handleEditClick(item)
                }}>
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleDeleteWorkflow(item.workflowId)
                  }}
                  sx={{ color: '#ef4444' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
</Box>
             

           

            </Paper>
          </Grid>
        ))}
      </Grid>

      <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <StyledDialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
          <AccountTreeIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography color='#FFFFFF' variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Workflow Creation
            </Typography>
            <Typography  color='#FFFFFF' variant="body2" sx={{ opacity: 0.9 }}>
              Set up a new approval workflow
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: "#fafbfc" }}>
        <Box sx={{ p: 4 }}>
          {/* Basic Information Section */}
          <SectionCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <SettingsIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
                    Basic Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure the fundamental workflow details
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1.5 }}>Workflow Name *</Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter workflow name"
                    value={addWorkflow?.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#667eea" },
                        "&.Mui-focused fieldset": { borderColor: "#667eea" },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1.5 }}>Description</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Describe the workflow purpose and process"
                    value={addWorkflow?.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#667eea" },
                        "&.Mui-focused fieldset": { borderColor: "#667eea" },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </SectionCard>

          {/* Workflow Stages Section */}
          <SectionCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                    }}
                  >
                    <TimelineIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
                      Workflow Stages
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Define the approval flow and stage configurations
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`${addWorkflow.stages?.length || 0} Stages`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              {/* Stages */}
            {addWorkflow.stages?.map((stage, index) => (
            <Fade in={true} timeout={300 * (index + 1)} key={index}>
                <StageCard elevation={0}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, justifyContent: 'space-between' }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                        sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        }}
                    >
                        {index + 1}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
                        {stage.stageName || `Stage ${index + 1}`}
                    </Typography>
                    {stage.isOptional && <Chip label="Optional" size="small" color="warning" variant="outlined" />}
                    </Box>
                    {index>0 && <Tooltip title="Remove Stage">
                    <IconButton onClick={() => removeStage(index)} sx={{ color: '#ef4444' }}>
                        <DeleteIcon />
                    </IconButton>
                    </Tooltip>}
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                    <Typography fontWeight={600} color='#262E3D' mb={1}>
                                       Stage Name
                    </Typography>
                    <TextField
                        fullWidth
                        label="Stage Name"
                        value={stage.stageName}
                        onChange={(e) => handleStageChange(index, "stageName", e.target.value)}
                    />
                    </Grid>
                    <Grid item xs={12} md={6}>
                                    <Typography fontWeight={600} color='#262E3D' mb={1}>
                                        Select Assigned Role
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        select
                                        value={stage.assignedRoles}
                                        onChange={e => handleStageChange(index, 'assignedRoles', e.target.value)}
                                    >
                                        {roles.map(role => (
                                        <MenuItem key={role._id} value={role._id}>
                                            {role.roleName}
                                        </MenuItem>
                                        ))}
                                    </TextField>
                                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="SLA Hours"
                        type="number"
                        value={stage.slaHours}
                        onChange={(e) => handleStageChange(index, "slaHours", e.target.value)}
                        InputProps={{
                        endAdornment: <ScheduleIcon sx={{ color: "#9ca3af", mr: 1 }} />,
                        }}
                        sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                        },
                        }}
                    />
                    </Grid> */}
                    <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={stage.isOptional}
                            onChange={(e) => handleStageChange(index, "isOptional", e.target.checked)}
                            sx={{ color: "#667eea" }}
                        />
                        }
                        label="Optional Stage"
                        sx={{ mt: 2 }}
                    />
                    </Grid>
                </Grid>

                {/* Conditions Accordion */}
                <Accordion sx={{ mt: 3, borderRadius: 2 }} elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <WarningIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                        <Typography sx={{ fontWeight: 600 }}>Conditions ({stage.conditions?.length || 1})</Typography>
                    </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                    {(stage.conditions).map((cond, cIdx) => (
                        <ConditionRow key={cIdx}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Field"
                                value={cond.field}
                                onChange={(e) => handleConditionChange(index, cIdx, "field", e.target.value)}
                            />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                            <FormControl fullWidth size="small">
                                <Select
                                value={cond.operator==="greater_than" ? ">" : cond.operator==="less_equal" ? "<=" : cond.operator==="not_equals" ? "!=" : cond.operator=== "greater_equal" ? ">=" : cond.operator}
                                onChange={(e) => handleConditionChange(index, cIdx, "operator", e.target.value)}
                                >
                                <MenuItem value=">">{">"}</MenuItem>
                                <MenuItem value="<=">{"<="}</MenuItem>
                                <MenuItem value=">=">{">="}</MenuItem>
                                <MenuItem value="!=">!=</MenuItem>
                                </Select>
                            </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Value"
                                value={cond.value}
                                onChange={(e) => handleConditionChange(index, cIdx, "value", e.target.value)}
                            />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Action"
                                value={cond.nextStageId}
                                onChange={(e) => handleConditionChange(index, cIdx, "nextStageId", e.target.value)}
                            />
                            </Grid>
                            <Grid item xs={12} sm={1}>
                            <Tooltip title="Remove condition">
                                <IconButton onClick={() => removeCondition(index, cIdx)} sx={{ color: "#ef4444" }}>
                                <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            </Grid>
                        </Grid>
                        </ConditionRow>
                    ))}
                    <Button
                        startIcon={<AddIcon />}
                        onClick={() => addCondition(index)}
                        sx={{
                        mt: 2,
                        color: "#667eea",
                        fontWeight: 600,
                        borderRadius: 2,
                        "&:hover": { backgroundColor: "rgba(102, 126, 234, 0.1)" },
                        }}
                    >
                        Add Condition
                    </Button>
                    </AccordionDetails>
                </Accordion>

                {/* Escalation Rules */}
                {/* <Box sx={{ mt: 3, p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2}}>
                    Escalation Rules
                    </Typography>
                    <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                        fullWidth
                        size="small"
                        label="Escalate After (hours)"
                        type="number"
                        value={stage.escalationRules?.escalateAfterHours || ""}
                        onChange={(e) => handleEscalationChange(index, "escalateAfterHours", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                        fullWidth
                        size="small"
                        label="Escalate To (comma separated)"
                        value={(stage.escalationRules?.escalateTo || []).join(", ")}
                        onChange={(e) =>
                            handleEscalationChange(
                            index,
                            "escalateTo",
                            e.target.value.split(",").map((v) => v.trim()),
                            )
                        }
                        />
                    </Grid>
                    </Grid>
                </Box> */}
                </StageCard>
            </Fade>
            ))}


              {/* Add Stage Button */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addStage}
                  sx={{
                    borderColor: "#667eea",
                    color: "#667eea",
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "#5b5bd6",
                      backgroundColor: "rgba(102, 126, 234, 0.1)",
                    },
                  }}
                >
                  Add New Stage
                </Button>
              </Box>
            </CardContent>
          </SectionCard>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          borderTop: "1px solid #e2e8f0",
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            borderColor: "#d1d5db",
            color: "#6b7280",
            "&:hover": { borderColor: "#9ca3af" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          startIcon={<CheckCircleIcon />}
          sx={{
            backgroundColor:"#1976d2",
            color: "white",
            textTransform: "none",
            borderRadius: 2,
            px: 4,
            py: 2,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            // "&:hover": {
            //   background: "linear-gradient(135deg, #5b5bd6 0%, #6d42a0 100%)",
            //   boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
            // },
          }}
        >
         {addWorkflow.name ?  'Update Workflow' : 'Create Workflow'}
        </Button>
      </DialogActions>
    </StyledDialog>
    </Box>
  )
}

export default WorkflowModal