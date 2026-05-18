import React from 'react'
import {
  Snackbar,
  Alert,
  Box,
  Avatar,
  Typography,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Chip
} from '@mui/material'
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Clear as ClearIcon,
  DoneAll as DoneAllIcon,
  Circle as CircleIcon
} from '@mui/icons-material'
import { useNotifications } from './NotificationContext'

const NotificationDisplay = ({ 
  showPanel = false, 
  onTogglePanel,
  position = { vertical: 'top', horizontal: 'right' }
}) => {
  const {
    notifications,
    showNotificationSnackbar,
    latestNotification,
    getUnreadCount,
    markNotificationAsRead,
    markAllAsRead,
    clearAllNotifications,
    clearNotification,
    closeSnackbar
  } = useNotifications()

  const unreadCount = getUnreadCount()

  // Format notification time
  const formatTime = (timestamp) => {
    const now = new Date()
    const notifTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return notifTime.toLocaleDateString()
  }

  // Get notification icon based on type
  const getNotificationIcon = (notification) => {
    switch (notification.type) {
      case 'message':
        return notification.senderAvatar ? (
          <Avatar src={notification.senderAvatar} sx={{ width: 32, height: 32 }} />
        ) : (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {notification.senderName?.charAt(0)}
          </Avatar>
        )
      case 'status':
        return (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main' }}>
            <CircleIcon fontSize="small" />
          </Avatar>
        )
      default:
        return (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'info.main' }}>
            <NotificationsIcon fontSize="small" />
          </Avatar>
        )
    }
  }

  // Handle notification click
  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id)
    
    // Trigger custom event for opening conversation
    if (notification.conversationId) {
      window.dispatchEvent(new CustomEvent('openConversation', {
        detail: {
          conversationId: notification.conversationId,
          notification: notification
        }
      }))
    }
  }

  // Handle snackbar notification click
  const handleSnackbarClick = () => {
    if (latestNotification) {
      handleNotificationClick(latestNotification)
      closeSnackbar()
    }
  }

  return (
    <>
      {/* Snackbar Notification */}
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

      {/* Notification Panel */}
      <Drawer
        anchor="right"
        open={showPanel}
        onClose={onTogglePanel}
        PaperProps={{
          sx: { width: 400, maxWidth: '90vw' }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {unreadCount > 0 && (
                <Chip 
                  label={`${unreadCount} unread`} 
                  size="small" 
                  color="primary" 
                />
              )}
              <IconButton onClick={onTogglePanel} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  startIcon={<DoneAllIcon />}
                  onClick={markAllAsRead}
                  sx={{ textTransform: 'none' }}
                >
                  Mark all read
                </Button>
              )}
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={clearAllNotifications}
                color="error"
                sx={{ textTransform: 'none' }}
              >
                Clear all
              </Button>
            </Box>
          )}
        </Box>

        {/* Notifications List */}
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: 200,
              color: 'text.secondary'
            }}>
              <NotificationsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
              <Typography variant="body2">No notifications yet</Typography>
            </Box>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected'
                    },
                    borderLeft: notification.isRead ? 'none' : '3px solid',
                    borderLeftColor: 'primary.main'
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      variant="dot"
                      color="primary"
                      invisible={notification.isRead}
                    >
                      {getNotificationIcon(notification)}
                    </Badge>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: notification.isRead ? 400 : 600,
                          color: notification.isRead ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {notification.senderName}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: notification.isRead ? 'text.secondary' : 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {notification.messageContent}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(notification.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearNotification(notification.id)
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Drawer>
    </>
  )
}

export default NotificationDisplay
