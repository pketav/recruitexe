import React, { useState } from 'react'
import {
  IconButton,
  Badge,
  Tooltip,
  Box,
  useTheme
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material'
import { useNotifications } from './NotificationContext'
import NotificationDisplay from './NotificationDisplay'

const NotificationButton = ({ 
  size = 'medium',
  color = 'inherit',
  showPanel = true,
  animated = true,
  ...props 
}) => {
  const theme = useTheme()
  const [panelOpen, setPanelOpen] = useState(false)
  
  const {
    getUnreadCount,
    notifications
  } = useNotifications()

  const unreadCount = getUnreadCount()
  const hasUnread = unreadCount > 0

  const handleTogglePanel = () => {
    if (showPanel) {
      setPanelOpen(!panelOpen)
    }
  }

  return (
    <>
      <Tooltip title={`${unreadCount} unread notifications`}>
        <IconButton
          size={size}
          color={color}
          onClick={handleTogglePanel}
          sx={{
            position: 'relative',
            animation: hasUnread && animated ? 'notification-pulse 2s infinite' : 'none',
            '@keyframes notification-pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
              '100%': { transform: 'scale(1)' }
            },
            '&:hover': {
              animation: 'none'
            }
          }}
          {...props}
        >
          <Badge 
            badgeContent={unreadCount > 99 ? '99+' : unreadCount} 
            color="error"
            max={99}
            overlap="circular"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiBadge-badge': {
                animation: hasUnread && animated ? 'badge-bounce 1s ease-in-out' : 'none',
                '@keyframes badge-bounce': {
                  '0%, 20%, 50%, 80%, 100%': {
                    transform: 'translateY(0)',
                  },
                  '40%': {
                    transform: 'translateY(-3px)',
                  },
                  '60%': {
                    transform: 'translateY(-1px)',
                  },
                }
              }
            }}
          >
            {hasUnread ? (
              <NotificationsActiveIcon 
                sx={{ 
                  color: hasUnread ? theme.palette.warning.main : 'inherit',
                  filter: hasUnread && animated ? 'drop-shadow(0 0 2px rgba(255,152,0,0.5))' : 'none'
                }} 
              />
            ) : (
              <NotificationsIcon />
            )}
          </Badge>
        </IconButton>
      </Tooltip>

      {showPanel && (
        <NotificationDisplay
          showPanel={panelOpen}
          onTogglePanel={handleTogglePanel}
        />
      )}
    </>
  )
}

export default NotificationButton
