import { useState, useEffect, useCallback } from 'react'

export const useBrowserNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if browser supports notifications
    setIsSupported('Notification' in window)
    setPermission(Notification.permission)
  }, [])

  // Request permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.error('Browser does not support notifications')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      console.log('🔔 Notification permission:', result)
      return result === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }, [isSupported])

  // Show notification
  const showNotification = useCallback((title, options = {}) => {
    if (!isSupported) {
      console.warn('Browser notifications not supported')
      return null
    }

    if (permission !== 'granted') {
      console.warn('Notification permission not granted')
      return null
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/notification-badge.png',
        requireInteraction: false,
        silent: false,
        tag: 'chat-notification',
        ...options
      })

      // Auto close after 7 seconds
      setTimeout(() => {
        notification.close()
      }, 7000)

      return notification
    } catch (error) {
      console.error('Error showing notification:', error)
      return null
    }
  }, [isSupported, permission])

  // Show chat notification specifically
  const showChatNotification = useCallback((senderName, message, options = {}) => {
    const notification = showNotification(senderName, {
      body: message,
      icon: options.avatar || '/default-avatar.png',
      tag: options.conversationId || 'chat',
      data: {
        conversationId: options.conversationId,
        senderId: options.senderId,
        type: 'chat'
      },
      actions: [
        {
          action: 'reply',
          title: 'Reply'
        },
        {
          action: 'view',
          title: 'View Chat'
        }
      ],
      ...options
    })

    if (notification) {
      // Handle notification click
      notification.onclick = () => {
        window.focus()
        
        // Dispatch event to open conversation
        if (options.conversationId) {
          window.dispatchEvent(new CustomEvent('openConversation', {
            detail: {
              conversationId: options.conversationId,
              from: 'notification'
            }
          }))
        }
        
        notification.close()
      }
    }

    return notification
  }, [showNotification])

  return {
    isSupported,
    permission,
    hasPermission: permission === 'granted',
    requestPermission,
    showNotification,
    showChatNotification
  }
}
