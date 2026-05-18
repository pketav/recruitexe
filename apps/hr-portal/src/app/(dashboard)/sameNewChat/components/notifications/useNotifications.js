import { useNotifications as useNotificationsContext } from './NotificationContext'

// Re-export the hook with additional utility functions
export const useNotifications = () => {
  const context = useNotificationsContext()
  
  // Add utility functions for common use cases
  const utilities = {
    // Show a simple success notification
    showSuccess: (message, title = 'Success') => {
      return context.addNotification({
        type: 'success',
        title: title,
        message: message,
        senderName: title
      })
    },

    // Show a simple error notification
    showError: (message, title = 'Error') => {
      return context.addNotification({
        type: 'error',
        title: title,
        message: message,
        senderName: title
      })
    },

    // Show a simple info notification
    showInfo: (message, title = 'Info') => {
      return context.addNotification({
        type: 'info',
        title: title,
        message: message,
        senderName: title
      })
    },

    // Show a simple warning notification
    showWarning: (message, title = 'Warning') => {
      return context.addNotification({
        type: 'warning',
        title: title,
        message: message,
        senderName: title
      })
    },

    // Show a custom notification
    showCustom: (config) => {
      return context.addNotification(config)
    },

    // Quick access to common states
    hasUnreadNotifications: context.getUnreadCount() > 0,
    unreadCount: context.getUnreadCount(),
    totalNotifications: context.notifications.length,
    
    // Quick access to online status
    onlineUsersCount: context.onlineUsers.size,
    isAnyoneOnline: context.onlineUsers.size > 0
  }

  return {
    ...context,
    ...utilities
  }
}

// Export individual methods for direct import
export const {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showCustom
} = {}

export default useNotifications
