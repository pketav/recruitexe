import React from 'react'
import NotificationProvider from './NotificationContext'
import NotificationDisplay from './NotificationDisplay'

/**
 * Complete Notification Manager Component
 * 
 * This component provides a complete notification system that can be 
 * dropped into any part of your application.
 * 
 * Usage:
 * 1. Wrap your app with NotificationManager
 * 2. Use useNotifications hook anywhere in your app
 * 3. Add NotificationButton to your header/navbar
 */
const NotificationManager = ({ 
  children, 
  defaultSettings = {},
  position = { vertical: 'top', horizontal: 'right' }
}) => {
  return (
    <NotificationProvider>
      {children}
      {/* This will handle the snackbar notifications globally */}
      <NotificationDisplay position={position} />
    </NotificationProvider>
  )
}

export default NotificationManager
