import React, { useEffect } from 'react'
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  Chip,
  Card,
  CardContent 
} from '@mui/material'
import { 
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Check as CheckIcon 
} from '@mui/icons-material'
import { useBrowserNotifications } from './useBrowserNotifications'
import { useNotifications } from './useNotifications'

const BrowserNotificationManager = () => {
  const {
    isSupported,
    permission,
    hasPermission,
    requestPermission,
    showChatNotification
  } = useBrowserNotifications()

  const { notifications } = useNotifications()

  // Auto-request permission on mount if not decided
  useEffect(() => {
    if (isSupported && permission === 'default') {
      // Show a prompt after 2 seconds
      const timer = setTimeout(() => {
        requestPermission()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [isSupported, permission, requestPermission])

  const testNotification = () => {
    showChatNotification(
      'Test Notification',
      'This is a test browser notification! 🎉',
      {
        avatar: '/default-avatar.png',
        conversationId: 'test-123'
      }
    )
  }

  const getStatusColor = () => {
    if (!isSupported) return 'error'
    if (hasPermission) return 'success'
    if (permission === 'denied') return 'error'
    return 'warning'
  }

  const getStatusText = () => {
    if (!isSupported) return 'Not Supported'
    if (hasPermission) return 'Enabled'
    if (permission === 'denied') return 'Blocked'
    return 'Disabled'
  }

  const getStatusIcon = () => {
    if (hasPermission) return <CheckIcon />
    return <NotificationsOffIcon />
  }

  return (
    <Card sx={{ m: 2, maxWidth: 400 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Browser Notifications</Typography>
        </Box>

        {/* Status */}
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={getStatusIcon()}
            label={getStatusText()}
            color={getStatusColor()}
            variant="outlined"
            sx={{ mb: 1 }}
          />
          
          <Typography variant="body2" color="text.secondary">
            {isSupported 
              ? `Permission: ${permission}` 
              : 'Your browser does not support notifications'
            }
          </Typography>
        </Box>

        {/* Alerts */}
        {!isSupported && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Your browser doesn't support desktop notifications.
          </Alert>
        )}

        {permission === 'denied' && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Notifications are blocked. Please enable them in your browser settings.
          </Alert>
        )}

        {permission === 'default' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Click "Enable Notifications" to receive messages when the browser is minimized.
          </Alert>
        )}

        {hasPermission && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ You'll receive notifications even when the browser is minimized!
          </Alert>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {permission === 'default' && (
            <Button
              variant="contained"
              onClick={requestPermission}
              startIcon={<NotificationsIcon />}
            >
              Enable Notifications
            </Button>
          )}

          {hasPermission && (
            <Button
              variant="outlined"
              onClick={testNotification}
            >
              Test Notification
            </Button>
          )}

          {permission === 'denied' && (
            <Button
              variant="outlined"
              onClick={() => {
                alert(`To enable notifications:
1. Click the 🔒 lock icon in your address bar
2. Change "Notifications" to "Allow"
3. Refresh the page`)
              }}
            >
              How to Enable
            </Button>
          )}
        </Box>

        {/* Statistics */}
        {hasPermission && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Total notifications: {notifications.length}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default BrowserNotificationManager
