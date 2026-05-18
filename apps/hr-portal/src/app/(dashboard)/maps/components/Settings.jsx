import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  FormGroup,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Grid,
  Paper,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';

const Settings = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Map appearance settings
  const [mapSettings, setMapSettings] = useState({
    mapType: 'roadmap',
    theme: 'default',
    zoomLevel: 12,
    showTraffic: false,
    showPOI: true,
    clusterRadius: 75,
    maxZoom: 15,
    minZoom: 3
  });

  // Tracking settings
  const [trackingSettings, setTrackingSettings] = useState({
    trackingInterval: 30,
    trackingEnabled: true,
    historySaveEnabled: true,
    keepHistoryDays: 30,
    notifyOutOfBounds: true,
    notifyLowBattery: true,
    privacyMode: false
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailySummary: true,
    alertVolume: 75,
    email: 'admin@example.com',
    phone: '+1 555-123-4567'
  });

  const handleMapSettingChange = (setting, value) => {
    setMapSettings({
      ...mapSettings,
      [setting]: value
    });
  };

  const handleTrackingSettingChange = (setting, value) => {
    setTrackingSettings({
      ...trackingSettings,
      [setting]: value
    });
  };

  const handleNotificationSettingChange = (setting, value) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: value
    });
  };

  const handleSaveSettings = () => {
    // In a real app, this would save settings to the backend
    console.log('Saving settings:', {
      map: mapSettings,
      tracking: trackingSettings,
      notification: notificationSettings
    });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const mapThemes = [
    { value: 'default', label: 'Default' },
    { value: 'silver', label: 'Silver' },
    { value: 'retro', label: 'Retro' },
    { value: 'dark', label: 'Dark' },
    { value: 'night', label: 'Night' },
    { value: 'aubergine', label: 'Aubergine' }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Map & Tracking Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Map Appearance */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SvgIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 24 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7h6"></path>
                  <path d="M3 11h10"></path>
                  <path d="M3 15h12"></path>
                  <circle cx="19" cy="7" r="2"></circle>
                  <circle cx="17" cy="15" r="2"></circle>
                </svg>
              </SvgIcon>
              <Typography variant="h6">Map Appearance</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <FormControl fullWidth sx={{ mb: 3 }} size="small">
              <InputLabel id="map-type-label">Map Type</InputLabel>
              <Select
                labelId="map-type-label"
                id="map-type"
                value={mapSettings.mapType}
                label="Map Type"
                onChange={(e) => handleMapSettingChange('mapType', e.target.value)}
              >
                <MenuItem value="roadmap">Road Map</MenuItem>
                <MenuItem value="satellite">Satellite</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
                <MenuItem value="terrain">Terrain</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }} size="small">
              <InputLabel id="theme-label">Map Theme</InputLabel>
              <Select
                labelId="theme-label"
                id="theme"
                value={mapSettings.theme}
                label="Map Theme"
                onChange={(e) => handleMapSettingChange('theme', e.target.value)}
              >
                {mapThemes.map((theme) => (
                  <MenuItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Default Zoom Level</Typography>
              <Slider
                value={mapSettings.zoomLevel}
                min={1}
                max={20}
                step={1}
                valueLabelDisplay="auto"
                onChange={(_, value) => handleMapSettingChange('zoomLevel', value)}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Cluster Radius</Typography>
              <Slider
                value={mapSettings.clusterRadius}
                min={50}
                max={200}
                step={5}
                valueLabelDisplay="auto"
                onChange={(_, value) => handleMapSettingChange('clusterRadius', value)}
              />
            </Box>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={mapSettings.showTraffic}
                    onChange={(e) => handleMapSettingChange('showTraffic', e.target.checked)}
                  />
                }
                label="Show Traffic"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={mapSettings.showPOI}
                    onChange={(e) => handleMapSettingChange('showPOI', e.target.checked)}
                  />
                }
                label="Show Points of Interest"
              />
            </FormGroup>
          </Paper>
        </Grid>

        {/* Tracking Settings */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SvgIcon sx={{ color: 'secondary.main', mr: 1.5, fontSize: 24 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16"></path>
                  <path d="M2 9c-.303-2.048 0-6 0-6s3.356 0 6 0"></path>
                  <path d="M12 2c6 0 10 4.308 10 10 0 3.419-1.6 6.155-4 8"></path>
                </svg>
              </SvgIcon>
              <Typography variant="h6">Tracking Configuration</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Tracking Interval (seconds)</Typography>
              <Slider
                value={trackingSettings.trackingInterval}
                min={15}
                max={300}
                step={15}
                valueLabelDisplay="auto"
                onChange={(_, value) => handleTrackingSettingChange('trackingInterval', value)}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>History Retention (days)</Typography>
              <Slider
                value={trackingSettings.keepHistoryDays}
                min={7}
                max={90}
                step={1}
                valueLabelDisplay="auto"
                onChange={(_, value) => handleTrackingSettingChange('keepHistoryDays', value)}
                disabled={!trackingSettings.historySaveEnabled}
              />
            </Box>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={trackingSettings.trackingEnabled}
                    onChange={(e) => handleTrackingSettingChange('trackingEnabled', e.target.checked)}
                  />
                }
                label="Enable Tracking"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={trackingSettings.historySaveEnabled}
                    onChange={(e) => handleTrackingSettingChange('historySaveEnabled', e.target.checked)}
                  />
                }
                label="Save History"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={trackingSettings.notifyOutOfBounds}
                    onChange={(e) => handleTrackingSettingChange('notifyOutOfBounds', e.target.checked)}
                  />
                }
                label="Out of Bounds Alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={trackingSettings.notifyLowBattery}
                    onChange={(e) => handleTrackingSettingChange('notifyLowBattery', e.target.checked)}
                  />
                }
                label="Low Battery Alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={trackingSettings.privacyMode}
                    onChange={(e) => handleTrackingSettingChange('privacyMode', e.target.checked)}
                  />
                }
                label="Privacy Mode (Blur Exact Locations)"
              />
            </FormGroup>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SvgIcon sx={{ color: 'error.main', mr: 1.5, fontSize: 24 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
              </SvgIcon>
              <Typography variant="h6">Notification Settings</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => handleNotificationSettingChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) => handleNotificationSettingChange('smsNotifications', e.target.checked)}
                      />
                    }
                    label="SMS Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => handleNotificationSettingChange('pushNotifications', e.target.checked)}
                      />
                    }
                    label="Push Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.dailySummary}
                        onChange={(e) => handleNotificationSettingChange('dailySummary', e.target.checked)}
                      />
                    }
                    label="Daily Summary Reports"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Notification Email"
                  fullWidth
                  margin="normal"
                  value={notificationSettings.email}
                  onChange={(e) => handleNotificationSettingChange('email', e.target.value)}
                  size="small"
                  disabled={!notificationSettings.emailNotifications}
                />
                <TextField
                  label="SMS Number"
                  fullWidth
                  margin="normal"
                  value={notificationSettings.phone}
                  onChange={(e) => handleNotificationSettingChange('phone', e.target.value)}
                  size="small"
                  disabled={!notificationSettings.smsNotifications}
                />
                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>Alert Volume</Typography>
                  <Slider
                    value={notificationSettings.alertVolume}
                    min={0}
                    max={100}
                    step={5}
                    valueLabelDisplay="auto"
                    onChange={(_, value) => handleNotificationSettingChange('alertVolume', value)}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSaveSettings}
          startIcon={
            <SvgIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </SvgIcon>
          }
        >
          Save Settings
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
