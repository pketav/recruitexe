"use client"

import React from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Switch,
  Button,
  Chip,
  Divider,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { Add, Settings as SettingsIcon, Delete, Info, CloudDownload } from "@mui/icons-material"

const ModulesPage = () => {
  const [open, setOpen] = React.useState(false)
  const [modules, setModules] = React.useState([
    { id: 1, name: "Analytics Dashboard", enabled: true, version: "1.2.0", status: "active" },
    { id: 2, name: "User Management", enabled: true, version: "2.0.1", status: "active" },
    { id: 3, name: "Report Generator", enabled: false, version: "0.9.5", status: "beta" },
    { id: 4, name: "Email Notifications", enabled: true, version: "1.5.3", status: "active" },
    { id: 5, name: "API Integration", enabled: false, version: "1.1.0", status: "inactive" },
    { id: 6, name: "Data Visualization", enabled: true, version: "2.3.1", status: "active" },
  ])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const toggleModule = (id) => {
    setModules(modules.map((module) => (module.id === id ? { ...module, enabled: !module.enabled } : module)))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "beta":
        return "warning"
      case "inactive":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" component="h2">
          Modules Settings
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleClickOpen}>
          Add Module
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {module.name}
                  </Typography>
                  <Switch checked={module.enabled} onChange={() => toggleModule(module.id)} color="primary" />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Version: {module.version}
                </Typography>
                <Chip label={module.status} size="small" color={getStatusColor(module.status)} sx={{ mt: 1 }} />
              </CardContent>
              <CardActions>
                <IconButton size="small" color="primary">
                  <SettingsIcon />
                </IconButton>
                <IconButton size="small" color="primary">
                  <Info />
                </IconButton>
                <IconButton size="small" color="primary">
                  <CloudDownload />
                </IconButton>
                <IconButton size="small" color="error" sx={{ ml: "auto" }}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Module</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="module-name"
            label="Module Name"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
          />
          <TextField
            margin="dense"
            id="module-description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="module-version"
            label="Version"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue="1.0.0"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} variant="contained" color="primary">
            Add Module
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default ModulesPage
