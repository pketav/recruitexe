import React, { useEffect } from 'react'
import {
  Snackbar,
  Alert,
  Box,
  Avatar,
  Typography,
  IconButton
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'
import { useNotifications } from './NotificationContext'

// Simple auto-displaying notification component
const AutoNotificationDisplay = ({ 
  position = { vertical: 'top', horizontal: 'right' }
}) => {
  const {
    showNotificationSnackbar,
    latestNotification,
    closeSnackbar
  } = useNotifications()

  // Get notification icon based on type
  const getNotificationIcon = (notification) => {
    if (!notification) return null
    
    switch (notification.type) {
      case 'message':
        return notification.senderAvatar ? (
          <Avatar src={notification.senderAvatar} sx={{ width: 32, height: 32 }} />
        ) : (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {notification.senderName?.charAt(0)}
          </Avatar>
        )
      default:
        return null
    }
  }

  // Handle snackbar notification click
  const handleSnackbarClick = () => {
    if (latestNotification) {
      // Mark as read and open conversation if it's a message
      if (latestNotification.conversationId) {
        window.dispatchEvent(new CustomEvent('openConversation', {
          detail: {
            conversationId: latestNotification.conversationId,
            notification: latestNotification
          }
        }))
      }
      closeSnackbar()
    }
  }

  return (
    <Snackbar
      open={showNotificationSnackbar}
      autoHideDuration={4000}
      onClose={closeSnackbar}
      anchorOrigin={position}
    >
      <Alert 
        onClose={closeSnackbar} 
        severity="info" 
        sx={{ 
          width: '100%', 
          cursor: 'pointer',
          '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: '100%'
          }
        }}
        onClick={handleSnackbarClick}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={(e) => {
              e.stopPropagation()
              closeSnackbar()
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {latestNotification && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            {getNotificationIcon(latestNotification)}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {latestNotification.senderName}
              </Typography>
              <Typography variant="body2" sx={{ 
                opacity: 0.9,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {latestNotification.messageContent}
              </Typography>
            </Box>
          </Box>
        )}
      </Alert>
    </Snackbar>
  )
}

export default AutoNotificationDisplay
