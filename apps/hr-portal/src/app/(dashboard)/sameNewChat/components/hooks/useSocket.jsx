'use client';

import { useState, useCallback, useRef, useEffect } from 'react'
// import {
//   initSocket,
//   disconnectSocket,
//   startTyping,
//   stopTyping,
//   markMessageAsRead,
//   onMessage,
//   onTyping,
//   onReadReceipt,
//   onConnection,
//   onNotification,
//   onUserStatus,
//   isSocketConnected,
//   getCurrentUserId
// } from '@/utils/messageUtils'
import { initSocket,disconnectSocket,startTyping,stopTyping,markMessageAsRead,onMessage,onTyping,
onReadReceipt,onConnection,onNotification,onUserStatus,isSocketConnected,getCurrentUserId
 } from '@/utils/socketService';

// import { normalizeMessageContent } from '../../../utils/messageUtils'
import { normalizeMessageContent } from '@/utils/messageUtils';

export const useSocket = (userId, selectedConversationId, setChatMessages) => {
  const [socket, setSocket] = useState(null)
  const [typingUsers, setTypingUsers] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const typingTimeoutRef = useRef(null)
  const typingUsersTimeoutRef = useRef(new Map()) // Track typing timeouts for each user

  // Connect socket
  const connectSocket = useCallback(() => {
    if (!userId) return

    console.log('🔌 Initializing socket connection...')
    const socketInstance = initSocket()
    setSocket(socketInstance)

    if (socketInstance) {
      // Handle incoming messages
      const unsubscribeMessage = onMessage((type, data) => {
        switch (type) {
          case 'received':
            handleIncomingMessage(data)
            break
          case 'sent':
            handleMessageSent(data)
            break
          case 'failed':
            handleMessageFailed(data)
            break
          case 'delivered':
            handleMessageDelivered(data)
            break
        }
      })

      // Handle typing indicators - Updated for backend structure
      const unsubscribeTyping = onTyping((type, data) => {
        console.log('⌨️ Typing event received:', type, data)
        
        // Only handle typing for current conversation
        if (data.conversationId === selectedConversationId) {
          const currentUserId = getCurrentUserId()
          
          // Don't show typing indicator for current user
          if (data.userId === currentUserId) {
            return
          }

          switch (type) {
            case 'start':
              handleTypingStart(data)
              break
            case 'stop':
              handleTypingStop(data)
              break
          }
        }
      })

      // Handle read receipts
      const unsubscribeReadReceipt = onReadReceipt((data) => {
        handleMessageRead(data)
      })

      // Handle connection status
      const unsubscribeConnection = onConnection((status, error) => {
        setConnectionStatus(status)
        if (status === 'connected') {
          console.log('✅ Socket connected successfully')
        } else if (status === 'disconnected') {
          console.log('❌ Socket disconnected')
          // Clear typing users on disconnect
          setTypingUsers([])
        } else if (status === 'error') {
          console.error('🔴 Socket connection error:', error)
        }
      })

      // Handle user status changes
      const unsubscribeUserStatus = onUserStatus((statusData) => {
        console.log('👤 User status update in hook:', statusData)
        setOnlineUsers(prev => {
          const newSet = new Set(prev)
          if (statusData.status === 'online') {
            newSet.add(statusData.userId)
          } else {
            newSet.delete(statusData.userId)
            // Remove from typing users if they go offline
            setTypingUsers(prevTyping => prevTyping.filter(user => user !== statusData.userId))
          }
          return newSet
        })
      })

      // Store unsubscribe functions for cleanup
      socketInstance.unsubscribeFunctions = [
        unsubscribeMessage,
        unsubscribeTyping,
        unsubscribeReadReceipt,
        unsubscribeConnection,
        unsubscribeUserStatus
      ]
    }
  }, [userId, selectedConversationId])

  // Handle incoming messages
  const handleIncomingMessage = useCallback((messageData) => {
    console.log('🔥 Processing incoming message:', messageData)
    console.log('🏠 Current selectedConversationId:', selectedConversationId)
    console.log('📍 Message conversationId:', messageData.conversationId)

    // Extract message data from the nested structure
    const message = messageData.message
    console.log('📨 Extracted message:', message)

    // Check if this message is from the current user (to avoid duplicates)
    const currentUserId = userId
    const messageSenderId = message.senderId?._id || message.senderId

    console.log('👤 Message sender ID:', messageSenderId)
    console.log('👤 Current user ID:', currentUserId)

    if (messageSenderId === currentUserId) {
      console.log('⚠️ This is my own message - handling appropriately')
      
      // If this is for the current conversation, update pending message
      if (messageData.conversationId === selectedConversationId) {
        setChatMessages(prev => {
          console.log('📝 Current messages before update:', prev.length)
          const updated = prev.map(msg => {
            // Find pending message with similar content
            if (msg.pending &&
                msg.content?.text === message.content?.text &&
                msg.sender === currentUserId) {
              console.log('🔄 Updating pending message to confirmed')
              return {
                ...msg,
                _id: message._id,
                pending: false,
                timestamp: message.createdAt || message.timestamp || msg.timestamp
              }
            }
            return msg
          })
          console.log('📝 Messages after update:', updated.length)
          return updated
        })
      }
      return
    }

    // This is a message from someone else
    console.log('👥 This is a message from another user')

    const newMessage = {
      _id: message._id,
      id: message._id,
      sender: message.senderId?._id || message.senderId,
      senderName: message.senderId?.name || message.senderId?.email || 'Unknown',
      senderPhoto: message.senderId?.employeePhoto || null,
      content: normalizeMessageContent(message.content),
      timestamp: message.createdAt || message.timestamp || new Date().toISOString(),
      isRead: message.isRead || false,
      isEdited: message.isEdited || false,
      isMine: false,
      type: message.type || 'text',
      reactions: message.reactions || [],
      deletedFor: message.deletedFor || [],
      isDeleted: message.isDeleted || false
    }

    console.log('💬 Formatted new message:', newMessage)

    // Check if this message is for the current conversation
    if (messageData.conversationId === selectedConversationId) {
      console.log('✅ Message is for current conversation - adding to chat')

      setChatMessages(prev => {
        console.log('📊 Current chat messages count:', prev.length)

        // Check if message already exists to prevent duplicates
        const exists = prev.some(msg =>
          (msg._id && msg._id === newMessage._id) ||
          (msg.id && msg.id === newMessage.id)
        )

        if (!exists) {
          console.log('✅ Adding new message to chat - NEW COUNT WILL BE:', prev.length + 1)
          const updated = [...prev, newMessage]
          return updated
        } else {
          console.log('⚠️ Message already exists, skipping')
          return prev
        }
      })

      // Auto-mark message as read if conversation is active
      if (message._id && selectedConversationId) {
        setTimeout(() => {
          markMessageAsRead(selectedConversationId, message._id)
        }, 1000)
      }
    } else {
      console.log('📱 Message for different/no conversation - handling as background message')
      
      // Handle messages for other conversations or when no conversation is selected
      // Emit custom event for the parent component to handle
      if (typeof window !== 'undefined') {
        // If no conversation is selected, emit a force-open event
        const eventType = !selectedConversationId ? 'forceOpenConversation' : 'newMessageReceived'
        
        window.dispatchEvent(new CustomEvent(eventType, {
          detail: {
            conversationId: messageData.conversationId,
            message: newMessage,
            fromUser: {
              id: messageSenderId,
              name: message.senderId?.name || message.senderId?.email || 'Unknown'
            },
            shouldAutoSelect: !selectedConversationId
          }
        }))
        
        console.log(`🔔 Dispatched ${eventType} event for background handling`)
      }
    }
  }, [selectedConversationId, setChatMessages, userId])

  // Handle message sent confirmation
  const handleMessageSent = useCallback((data) => {
    console.log('✅ Message sent confirmation:', data)
    setChatMessages(prev =>
      prev.map(msg =>
        (msg.pending && msg.id === data.localId) || msg.id === data.tempId
          ? {
              ...msg,
              _id: data._id || data.messageId,
              pending: false,
              timestamp: data.timestamp || msg.timestamp
            }
          : msg
      )
    )
  }, [setChatMessages])

  // Handle message failed
  const handleMessageFailed = useCallback((data) => {
    console.log('❌ Message failed:', data)
    setChatMessages(prev =>
      prev.map(msg =>
        msg.id === data.localId || msg.id === data.tempId
          ? { ...msg, error: true, pending: false }
          : msg
      )
    )
  }, [setChatMessages])

  // Handle message delivered
  const handleMessageDelivered = useCallback((data) => {
    console.log('📬 Message delivered:', data)
    setChatMessages(prev =>
      prev.map(msg => {
        if (msg._id === data.messageId || msg.id === data.messageId) {
          return { ...msg, isDelivered: true, deliveredAt: data.deliveredAt }
        }
        return msg
      })
    )
  }, [setChatMessages])

  // Handle message read receipts
  const handleMessageRead = useCallback((data) => {
    console.log('👁️ Message read receipt:', data)
    setChatMessages(prev =>
      prev.map(msg => {
        if (msg._id === data.messageId || msg.id === data.messageId) {
          return { ...msg, isRead: true, readAt: data.readAt }
        }
        return msg
      })
    )
  }, [setChatMessages])

  // Handle typing start - Updated for backend structure
  const handleTypingStart = useCallback((data) => {
    console.log('⌨️ User started typing:', data.userId, 'in conversation:', data.conversationId)
    
    setTypingUsers(prev => {
      if (!prev.includes(data.userId)) {
        const updated = [...prev, data.userId]
        console.log('⌨️ Updated typing users:', updated)
        return updated
      }
      return prev
    })

    // Set timeout to automatically remove typing indicator after 5 seconds
    if (typingUsersTimeoutRef.current.has(data.userId)) {
      clearTimeout(typingUsersTimeoutRef.current.get(data.userId))
    }

    const timeoutId = setTimeout(() => {
      console.log('⏰ Auto-removing typing indicator for user:', data.userId)
      setTypingUsers(prev => prev.filter(user => user !== data.userId))
      typingUsersTimeoutRef.current.delete(data.userId)
    }, 5000)

    typingUsersTimeoutRef.current.set(data.userId, timeoutId)
  }, [])

  // Handle typing stop - Updated for backend structure
  const handleTypingStop = useCallback((data) => {
    console.log('⏹️ User stopped typing:', data.userId, 'in conversation:', data.conversationId)
    
    setTypingUsers(prev => {
      const updated = prev.filter(user => user !== data.userId)
      console.log('⏹️ Updated typing users:', updated)
      return updated
    })

    // Clear the timeout for this user
    if (typingUsersTimeoutRef.current.has(data.userId)) {
      clearTimeout(typingUsersTimeoutRef.current.get(data.userId))
      typingUsersTimeoutRef.current.delete(data.userId)
    }
  }, [])

  // Disconnect socket
  const disconnectSocketConnection = useCallback(() => {
    if (socket?.unsubscribeFunctions) {
      // Clean up event listeners
      socket.unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
    }

    // Clear all timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingUsersTimeoutRef.current.forEach(timeoutId => clearTimeout(timeoutId))
    typingUsersTimeoutRef.current.clear()

    disconnectSocket()
    setSocket(null)
    setConnectionStatus('disconnected')
    setTypingUsers([])
    setOnlineUsers(new Set())
  }, [socket])

  // Handle user typing start
  const handleUserTypingStart = useCallback(() => {
    if (selectedConversationId && !isTyping && isSocketConnected()) {
      console.log('⌨️ Starting typing indicator for conversation:', selectedConversationId)
      setIsTyping(true)
      startTyping(selectedConversationId)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        handleUserTypingStop()
      }, 3000)
    }
  }, [selectedConversationId, isTyping])

  // Handle user typing stop
  const handleUserTypingStop = useCallback(() => {
    if (selectedConversationId && isTyping && isSocketConnected()) {
      console.log('⌨️ Stopping typing indicator for conversation:', selectedConversationId)
      setIsTyping(false)
      stopTyping(selectedConversationId)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    }
  }, [selectedConversationId, isTyping])

  // Clear typing users when conversation changes
  useEffect(() => {
    setTypingUsers([])
    // Clear all typing timeouts when conversation changes
    typingUsersTimeoutRef.current.forEach(timeoutId => clearTimeout(timeoutId))
    typingUsersTimeoutRef.current.clear()
  }, [selectedConversationId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingUsersTimeoutRef.current.forEach(timeoutId => clearTimeout(timeoutId))
      typingUsersTimeoutRef.current.clear()
    }
  }, [])

  return {
    socket,
    typingUsers,
    connectionStatus,
    onlineUsers,
    isConnected: connectionStatus === 'connected',
    handleTypingStart: handleUserTypingStart,
    handleTypingStop: handleUserTypingStop,
    connectSocket,
    disconnectSocketConnection
  }
}

// Default export for build compatibility
export default useSocket
