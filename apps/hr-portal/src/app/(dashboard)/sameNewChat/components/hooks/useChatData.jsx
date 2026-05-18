'use client'
import { useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { formatMessage } from '@/utils/messageUtils'

export const useChatData = (userId, employeeIdFromToken) => {
  const [chatList, setChatList] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChatList, setLoadingChatList] = useState(false)
  const refreshTimeoutRef = useRef(null)
  const lastRefreshRef = useRef(0) // Track last refresh time
  const [groupInfo, setGroupInfo] = useState()

  const baseUrl = process.env.NEXT_PUBLIC_CHAT_SOCKET_URL

  // Fetch chat list
  const fetchChatList = useCallback(async (silent = false) => {
    if (!userId) return

    // Prevent too frequent refreshes (minimum 1 second between refreshes)
    const now = Date.now()
    const timeSinceLastRefresh = now - lastRefreshRef.current
    if (timeSinceLastRefresh < 1000 && silent) {
      return
    }

    try {
      if (!silent) setLoadingChatList(true)

      const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/chat/getChatListByUserId`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (response.data && Array.isArray(response.data.items)) {
        const sortedChats = [...response.data.items].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          return new Date(b.updatedAt) - new Date(a.updatedAt)
        })

        setChatList(sortedChats)
        lastRefreshRef.current = now // Update last refresh time
      } else {
        setChatList([])
      }
    } catch (error) {
      console.error('Error fetching chat list:', error)
      setChatList([])
    } finally {
      if (!silent) setLoadingChatList(false)
    }
  }, [userId, employeeIdFromToken])

  // Debounced refresh to prevent too many API calls
  const debouncedRefreshChatList = useCallback((delay = 1000) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    refreshTimeoutRef.current = setTimeout(() => {
      fetchChatList(true) // Silent refresh
    }, delay)
  }, [fetchChatList])

  // Force immediate refresh (for when user sends a message) - with throttling
  const forceRefreshChatList = useCallback(() => {
    const now = Date.now()
    const timeSinceLastRefresh = now - lastRefreshRef.current

    if (timeSinceLastRefresh < 500) {
      // If last refresh was less than 500ms ago, use debounced refresh instead
      debouncedRefreshChatList(500)
    } else {
      fetchChatList(true) // Silent refresh
    }
  }, [fetchChatList, debouncedRefreshChatList])

  // Notification-triggered refresh (only for actual notifications)
  const refreshOnNotification = useCallback(() => {
    debouncedRefreshChatList(800) // Use debounced refresh with slightly longer delay
  }, [debouncedRefreshChatList])

  // Fetch chat messages for a conversation
  const fetchChatHistory = useCallback(async (conversationId) => {
    if (!conversationId || !userId) {
      setChatMessages([])
      return
    }

    try {
      // setLoading(true)

      const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/chat/getChatMessages`, {
        params: {
          userId: userId,
          conversationId: conversationId,
          limit: 50,
          page: 1
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (response.data && response.data.items && Array.isArray(response.data.items.messages)) {
        const formattedMessages = response.data.items.messages.map(msg => {
          const baseMessage = {
            _id: msg._id,
            id: msg._id,
            sender: typeof msg.sender === 'object' ? msg.sender._id : msg.sender,
            senderName: typeof msg.sender === 'object' ? msg.sender.name : 'Unknown',
            senderPhoto: typeof msg.sender === 'object' ? msg.sender.employeePhoto : null,
            content: msg.content,
            timestamp: msg.createdAt || msg.timestamp,
            isRead: msg.isRead,
            isEdited: msg.isEdited,
            isDelivered: msg.isDelivered || false,
            deliveredAt: msg.deliveredAt || null,
            readAt: msg.readAt || null,
            type: msg.type,
            reactions: msg.reactions || [],
            deletedFor: msg.deletedFor || [],
            isDeleted: msg.isDeleted || false
          }
          return formatMessage(baseMessage, userId)
        })

        setGroupInfo(response.data.items.conversationDetails)


        // Clear existing messages first to prevent duplicates on refresh
        setChatMessages(formattedMessages)
      } else {
        setChatMessages([])
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error)
      setChatMessages([])
    } finally {
      setLoading(false)
    }
  }, [userId, employeeIdFromToken])

  // Send chat message
  const sendChatMessage = useCallback(async ({
    messageText,
    selectedEmployee,
    conversationId,
    isGroupChat,
    userInfo,
    messageType = 'text',
    fileData = null
  }) => {

    let endpoint, payload

    if (isGroupChat) {
      endpoint = `${baseUrl}/v1/chat/group/sendMessageToGroup`
      payload = {
        userId: userId,
        conversationId: conversationId,
        oneSignalId: 'fd5de1b0-abd9-467e-b540-b1ff2b630f85',
        messageType: messageType,
        content: messageType === 'text' ? { text: messageText } : {
          text: messageText || '',
          media: fileData ? {
            url: fileData.url,
            fileName: fileData.fileName,
            fileSize: fileData.fileSize,
            mimeType: fileData.mimeType
          } : null
        }
      }
    } else {
      endpoint = `${baseUrl}/api/rooms`
      payload = {
        "participants": [selectedEmployee._id],
        "type": "individual"
        }
    }
    
    const response = await axios.post(endpoint, payload, {
      headers: { Authorization:`Bearer ${localStorage.getItem('authToken')}` }
    })

    // Schedule a chat list refresh after message is sent (longer delay for sending)
    debouncedRefreshChatList(1500)

    return response
  }, [baseUrl, debouncedRefreshChatList])

  // Fetch specific conversation by ID (for when we receive a message for an unknown conversation)
  const fetchSpecificConversation = useCallback(async (conversationId) => {
    if (!conversationId || !userId) return null

    try {

      // This would be a new API endpoint to get conversation details by ID
      // For now, we'll refresh the chat list and find it
      await fetchChatList(true) // Silent refresh

      // Return the conversation if found
      return chatList.find(chat =>
        (chat.id === conversationId || chat._id === conversationId)
      )
    } catch (error) {
      console.error('Error fetching specific conversation:', error)
      return null
    }
  }, [userId, fetchChatList, chatList])

  // Update unread count for a specific conversation
  const updateUnreadCount = useCallback((conversationId, increment = true) => {
    setChatList(prev =>
      prev.map(chat => {
        if (chat.id === conversationId || chat._id === conversationId) {
          const currentCount = chat.unreadCount || 0
          return {
            ...chat,
            unreadCount: increment ? currentCount + 1 : Math.max(0, currentCount - 1)
          }
        }
        return chat
      })
    )
  }, [])

  // Mark conversation as read
  const markConversationAsRead = useCallback((conversationId) => {
    setChatList(prev =>
      prev.map(chat => {
        if (chat.id === conversationId || chat._id === conversationId) {
          return {
            ...chat,
            unreadCount: 0
          }
        }
        return chat
      })
    )
  }, [])

  // Update last message for a conversation
  const updateLastMessage = useCallback((conversationId, messageContent, timestamp) => {
    setChatList(prev =>
      prev.map(chat => {
        if (chat.id === conversationId || chat._id === conversationId) {
          return {
            ...chat,
            lastMessage: { content: messageContent },
            updatedAt: timestamp
          }
        }
        return chat
      }).sort((a, b) => {
        // Re-sort after updating
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
    )
  }, [])

  return {
    chatList,
    chatMessages,
    setChatMessages,
    loading,
    loadingChatList,
    fetchChatList,
    fetchChatHistory,
    sendChatMessage,
    fetchSpecificConversation,
    debouncedRefreshChatList,
    forceRefreshChatList,
    refreshOnNotification, // New method specifically for notifications
    updateUnreadCount,
    markConversationAsRead,
    updateLastMessage,
    groupInfo
  }
}

// Default export for build compatibility
export default useChatData
