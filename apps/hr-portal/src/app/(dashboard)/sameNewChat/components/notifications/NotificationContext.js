import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
//// import { onNotification, onUserStatus } from '../../utils/socketService'
import { useBrowserNotifications } from './useBrowserNotifications'
import { onNotification,onUserStatus } from '@/utils/socketService'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [showNotificationSnackbar, setShowNotificationSnackbar] = useState(false)
  const [latestNotification, setLatestNotification] = useState(null)
  const [notificationSettings, setNotificationSettings] = useState({
    browserNotifications: true,
    soundNotifications: true,
    showSnackbar: true,
    maxNotifications: 50
  })

  // Use enhanced browser notifications
  const {
    isSupported: browserSupported,
    hasPermission: browserPermission,
    requestPermission,
    showChatNotification
  } = useBrowserNotifications()

  // Auto-request notification permission on mount
  useEffect(() => {
    if (browserSupported && !browserPermission) {
      // Request permission after a short delay
      const timer = setTimeout(() => {
        requestPermission()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [browserSupported, browserPermission, requestPermission])

  // Set up notification listeners
  useEffect(() => {
    // Handle socket notifications
    const unsubscribeNotification = onNotification((notificationData) => {
      console.log('🔔 New notification received:', notificationData)
      handleNewNotification(notificationData)
    })

    // Handle user status changes
    const unsubscribeUserStatus = onUserStatus((statusData) => {
      console.log('👤 User status changed:', statusData)
      handleUserStatusChange(statusData)
    })

    return () => {
      unsubscribeNotification()
      unsubscribeUserStatus()
    }
  }, [])

  // Handle new notification
  const handleNewNotification = useCallback((notificationData) => {
    // Create notification object
    const notification = {
      id: notificationData.messageId || `notification-${Date.now()}`,
      conversationId: notificationData.conversationId,
      senderName: notificationData.senderName,
      senderAvatar: notificationData.senderAvatar,
      messageContent: notificationData.messageContent,
      messageType: notificationData.messageType,
      roomName: notificationData.roomName,
      timestamp: notificationData.timestamp,
      isRead: false,
      type: 'message' // Can be 'message', 'system', 'alert', etc.
    }

    // Add to notifications list (keep only latest maxNotifications)
    setNotifications(prev => [notification, ...prev.slice(0, notificationSettings.maxNotifications - 1)])

    // Show snackbar if enabled
    if (notificationSettings.showSnackbar) {
      setLatestNotification(notification)
      setShowNotificationSnackbar(true)
    }

    // Show enhanced browser notification if permission granted and enabled
    if (notificationSettings.browserNotifications && browserPermission) {
      console.log('🔔 Showing enhanced browser notification')
      showChatNotification(
        notification.senderName,
        notification.messageContent,
        {
          avatar: notification.senderAvatar,
          conversationId: notification.conversationId,
          senderId: notificationData.senderId,
          requireInteraction: true, // Keep notification visible until user interacts
          silent: false
        }
      )
    } else if (notificationSettings.browserNotifications && !browserPermission) {
      console.warn('🔔 Browser notifications not permitted, requesting permission...')
      requestPermission()
    }

    // Play sound if enabled
    if (notificationSettings.soundNotifications) {
      playNotificationSound()
    }

    // Trigger custom event for other components
    window.dispatchEvent(new CustomEvent('newNotification', {
      detail: notification
    }))

  }, [notificationSettings, browserPermission, showChatNotification, requestPermission])

  // Handle user status change
  const handleUserStatusChange = useCallback((statusData) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev)
      if (statusData.status === 'online') {
        newSet.add(statusData.userId)
      } else {
        newSet.delete(statusData.userId)
      }
      return newSet
    })

    // Create status notification if needed
    if (statusData.showNotification) {
      const statusNotification = {
        id: `status-${statusData.userId}-${Date.now()}`,
        type: 'status',
        senderName: statusData.userName || 'User',
        messageContent: `User is now ${statusData.status}`,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      setNotifications(prev => [statusNotification, ...prev.slice(0, notificationSettings.maxNotifications - 1)])
    }
  }, [notificationSettings.maxNotifications])

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/notification-sound.mp3') // Add your sound file to public folder
      audio.volume = 0.3
      audio.play().catch(e => console.log('Could not play notification sound:', e))
    } catch (error) {
      console.log('Notification sound not available')
    }
  }, [])

  // Add custom notification
  const addNotification = useCallback((notificationData) => {
    const notification = {
      id: notificationData.id || `custom-${Date.now()}`,
      type: notificationData.type || 'custom',
      senderName: notificationData.title || notificationData.senderName || 'Notification',
      messageContent: notificationData.message || notificationData.messageContent,
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notificationData
    }

    setNotifications(prev => [notification, ...prev.slice(0, notificationSettings.maxNotifications - 1)])

    if (notificationSettings.showSnackbar) {
      setLatestNotification(notification)
      setShowNotificationSnackbar(true)
    }

    // Show browser notification for custom notifications too
    if (notificationSettings.browserNotifications && browserPermission) {
      showChatNotification(
        notification.senderName,
        notification.messageContent,
        {
          avatar: notification.senderAvatar,
          conversationId: notification.conversationId,
          requireInteraction: false
        }
      )
    }

    return notification.id
  }, [notificationSettings, browserPermission, showChatNotification])

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    )
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    )
  }, [])

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
    setShowNotificationSnackbar(false)
    setLatestNotification(null)
  }, [])

  // Clear specific notification
  const clearNotification = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    )
  }, [])

  // Mark conversation notifications as read
  const markConversationNotificationsAsRead = useCallback((conversationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.conversationId === conversationId
          ? { ...notif, isRead: true }
          : notif
      )
    )
  }, [])

  // Get unread count
  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.isRead).length
  }, [notifications])

  // Get unread notifications for specific conversation
  const getConversationUnreadCount = useCallback((conversationId) => {
    return notifications.filter(n => 
      n.conversationId === conversationId && !n.isRead
    ).length
  }, [notifications])

  // Close snackbar
  const closeSnackbar = useCallback(() => {
    setShowNotificationSnackbar(false)
  }, [])

  // Update notification settings
  const updateSettings = useCallback((newSettings) => {
    setNotificationSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  // Check if user is online
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId)
  }, [onlineUsers])

  const value = {
    // State
    notifications,
    onlineUsers,
    showNotificationSnackbar,
    latestNotification,
    notificationSettings,
    
    // Browser notification info
    browserSupported,
    browserPermission,
    requestPermission,
    
    // Getters
    getUnreadCount,
    getConversationUnreadCount,
    isUserOnline,
    
    // Actions
    addNotification,
    markNotificationAsRead,
    markAllAsRead,
    clearAllNotifications,
    clearNotification,
    markConversationNotificationsAsRead,
    closeSnackbar,
    updateSettings,
    
    // Internal handlers (for advanced usage)
    handleNewNotification,
    showChatNotification,
    playNotificationSound
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
