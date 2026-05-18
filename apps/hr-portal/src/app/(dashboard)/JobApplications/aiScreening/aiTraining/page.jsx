"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

// Loading Spinner Component
const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    <Typography variant="h6">Loading...</Typography>
  </Box>
)

// Simple icons using emojis
const TrainIcon = () => <span style={{ fontSize: "20px" }}>🚂</span>
const BrainIcon = () => <span style={{ fontSize: "20px" }}>🧠</span>
const DatabaseIcon = () => <span style={{ fontSize: "20px" }}>🗄️</span>
const RocketIcon = () => <span style={{ fontSize: "20px" }}>🚀</span>
const CheckIcon = () => <span style={{ fontSize: "16px" }}>✅</span>
const WarningIcon = () => <span style={{ fontSize: "16px" }}>⚠️</span>
const ErrorIcon = () => <span style={{ fontSize: "16px" }}>❌</span>
const ProcessingIcon = () => <span style={{ fontSize: "16px" }}>⏳</span>

export default function AITrainingPage() {
  const [loading, setLoading] = useState(true)
  const [trainingInProgress, setTrainingInProgress] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [retrainDialogOpen, setRetrainDialogOpen] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState("")
  const [trainingType, setTrainingType] = useState("incremental")

  // Mock data for training history
  const trainingHistory = [
    { id: 1, version: "v2.1.3", date: "2024-01-15", accuracy: 87.3, status: "Active", dataSize: "1.2M" },
    { id: 2, version: "v2.1.2", date: "2024-01-01", accuracy: 85.7, status: "Archived", dataSize: "1.0M" },
    { id: 3, version: "v2.1.1", date: "2023-12-15", accuracy: 84.2, status: "Archived", dataSize: "950K" },
    { id: 4, version: "v2.1.0", date: "2023-12-01", accuracy: 82.8, status: "Archived", dataSize: "900K" },
  ]

  // Mock performance data
  const performanceData = [
    { epoch: 1, accuracy: 72.1, loss: 0.45, valAccuracy: 69.8, valLoss: 0.52 },
    { epoch: 2, accuracy: 78.3, loss: 0.38, valAccuracy: 75.2, valLoss: 0.41 },
    { epoch: 3, accuracy: 82.7, loss: 0.32, valAccuracy: 79.8, valLoss: 0.36 },
    { epoch: 4, accuracy: 85.2, loss: 0.28, valAccuracy: 82.4, valLoss: 0.31 },
    { epoch: 5, accuracy: 87.3, loss: 0.24, valAccuracy: 84.9, valLoss: 0.28 },
  ]

  // Mock dataset information
  const datasets = [
    { id: "main", name: "Main Training Dataset", size: "1.2M candidates", lastUpdated: "2024-01-15", quality: 95 },
    { id: "recent", name: "Recent Applications", size: "250K candidates", lastUpdated: "2024-01-20", quality: 92 },
    { id: "feedback", name: "Human Feedback Data", size: "50K decisions", lastUpdated: "2024-01-18", quality: 98 },
    { id: "balanced", name: "Bias-Balanced Dataset", size: "800K candidates", lastUpdated: "2024-01-10", quality: 94 },
  ]

  // Training steps
  const trainingSteps = [
    "Data Preparation",
    "Model Architecture Setup",
    "Training Execution",
    "Validation & Testing",
    "Model Deployment",
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleStartTraining = () => {
    setTrainingInProgress(true)
    setActiveStep(0)
    setTrainingProgress(0)
    setRetrainDialogOpen(false)

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTrainingInProgress(false)
          setActiveStep(4)
          return 100
        }

        // Update active step based on progress
        const newStep = Math.floor(prev / 20)
        if (newStep !== activeStep && newStep < 5) {
          setActiveStep(newStep)
        }

        return prev + 2
      })
    }, 200)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🤖 AI Model Training & Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Train, manage, and optimize AI models for candidate screening
        </Typography>
      </Box>

      {/* Current Model Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <BrainIcon />
              <Typography variant="h6" gutterBottom>
                Current Model
              </Typography>
              <Typography variant="h4" color="primary">
                v2.1.3
              </Typography>
              <Chip label="Active" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid> */}
        <Grid item xs={12} md={3}>
          <Card sx={{height:"150px"}}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                🎯 Accuracy
              </Typography>
              <Typography variant="h4" color="success.main">
                87.3%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +2.1% from previous
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
        <Card sx={{height:"150px"}}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
               🗄️ Training Data
              </Typography>
              <Typography variant="h4">1.2M</Typography>
              <Typography variant="body2" color="text.secondary">
                candidates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                ⚡ Status
              </Typography>
              <Typography variant="h4" color="success.main">
                {trainingInProgress ? <ProcessingIcon /> : <CheckIcon />}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {trainingInProgress ? "Training..." : "Ready"}
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      {/* Training Progress */}
      {trainingInProgress && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            🚂 Training in Progress
          </Typography>
          <Box sx={{ mb: 2 }}>
            <LinearProgress variant="determinate" value={trainingProgress} sx={{ height: 10, borderRadius: 5 }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Progress: {trainingProgress.toFixed(1)}%
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} orientation="horizontal">
            {trainingSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      {/* Action Buttons */}
      {/* <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          🎮 Model Management
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<TrainIcon />}
              onClick={() => setRetrainDialogOpen(true)}
              disabled={trainingInProgress}
            >
              Retrain Model
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" startIcon={<RocketIcon />} disabled={trainingInProgress}>
              Deploy New Version
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined">📊 A/B Test Models</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined">💾 Export Model</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined">📈 Performance Report</Button>
          </Grid>
        </Grid>
      </Paper> */}

      <Grid container spacing={3}>
        {/* Performance Charts */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              📈 Training Performance History
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#8884d8" strokeWidth={2} name="Training Accuracy" />
                <Line
                  type="monotone"
                  dataKey="valAccuracy"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Validation Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📉 Loss Function
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="loss" stackId="1" stroke="#ff7300" fill="#ff7300" name="Training Loss" />
                <Area
                  type="monotone"
                  dataKey="valLoss"
                  stackId="2"
                  stroke="#00ff00"
                  fill="#00ff00"
                  name="Validation Loss"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Datasets */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              🗄️ Available Datasets
            </Typography>
            <List>
              {datasets.map((dataset) => (
                <ListItem key={dataset.id}>
                  <ListItemIcon>
                    <DatabaseIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={dataset.name}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {dataset.size} • Updated {dataset.lastUpdated}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                          <Typography variant="caption" sx={{ mr: 1 }}>
                            Quality:
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={dataset.quality}
                            sx={{ flexGrow: 1, height: 6 }}
                          />
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            {dataset.quality}%
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ⚙️ Training Configuration
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Learning Rate" secondary="0.001" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Batch Size" secondary="32" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Epochs" secondary="50" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Optimizer" secondary="Adam" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Architecture" secondary="Transformer" />
              </ListItem>
              <ListItem>
                <ListItemText primary="GPU Nodes" secondary="4x NVIDIA A100" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Model History */}
        {/* <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📋 Model Version History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Version</TableCell>
                    <TableCell>Training Date</TableCell>
                    <TableCell>Accuracy</TableCell>
                    <TableCell>Data Size</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trainingHistory.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <BrainIcon />
                          <Typography sx={{ ml: 1 }}>{model.version}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{model.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${model.accuracy}%`}
                          color={model.accuracy > 85 ? "success" : model.accuracy > 80 ? "warning" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{model.dataSize}</TableCell>
                      <TableCell>
                        <Chip
                          label={model.status}
                          color={model.status === "Active" ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                          📊 Details
                        </Button>
                        {model.status !== "Active" && (
                          <Button size="small" variant="outlined">
                            🔄 Rollback
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid> */}
      </Grid>

      {/* Retrain Dialog */}
      <Dialog open={retrainDialogOpen} onClose={() => setRetrainDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>🚂 Retrain AI Model</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Training Type</InputLabel>
                <Select value={trainingType} label="Training Type" onChange={(e) => setTrainingType(e.target.value)}>
                  <MenuItem value="incremental">🔄 Incremental Training</MenuItem>
                  <MenuItem value="full">🎯 Full Retraining</MenuItem>
                  <MenuItem value="transfer">🔀 Transfer Learning</MenuItem>
                  <MenuItem value="finetune">⚡ Fine-tuning</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Primary Dataset</InputLabel>
                <Select
                  value={selectedDataset}
                  label="Primary Dataset"
                  onChange={(e) => setSelectedDataset(e.target.value)}
                >
                  {datasets.map((dataset) => (
                    <MenuItem key={dataset.id} value={dataset.id}>
                      {dataset.name} ({dataset.size})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  Estimated training time: 2-4 hours depending on selected options. Current model will remain active
                  during training.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetrainDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStartTraining} variant="contained" color="primary">
            Start Training
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
