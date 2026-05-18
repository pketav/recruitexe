"use client"
import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import { getMessageText } from "@/utils/messageUtils"
import AutoNotificationDisplay from "./components/notifications/AutoNotificationDisplay"
import NotificationProvider from "./components/notifications/NotificationContext"
import { useNotifications } from "./components/notifications"
import useChatData from "./components/hooks/useChatData"
import useSocket from "./components/hooks/useSocket"
import {
  reactToMessage,
  removeReaction,
  deleteMessage,
  onReaction,
  onDelete,
  updateMessage,
} from "@/utils/socketService"
import { joinRoom, leaveRoom, sendMessage } from "@/utils/socketService"
import { useAuth } from "@/context/AuthContext"

// Enhanced Components
import ChatSidebar from "./components/ChatSidebar"
import ChatArea from "./components/ChatArea"

const ChatWithNotifications = () => {
  const [pageHeight, setPageHeight] = useState(0)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [isGroupChat, setIsGroupChat] = useState(false)
  const [userInfo, setUserInfo] = useState({ id: "" })
  const [employeeIdFromToken, setEmployeeIdFromToken] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const { userData } = useAuth()

  const {
    notifications,
    onlineUsers,
    getUnreadCount,
    getConversationUnreadCount,
    markConversationNotificationsAsRead,
    clearAllNotifications,
    isUserOnline,
  } = useNotifications()

  const {
    chatList,
    chatMessages,
    setChatMessages,
    loading,
    loadingChatList,
    fetchChatList,
    fetchChatHistory,
    sendChatMessage,
    fetchSpecificConversation,
    refreshOnNotification,
    forceRefreshChatList,
    groupInfo,
  } = useChatData(userData.empID, employeeIdFromToken)

  const {
    socket,
    typingUsers,
    connectionStatus,
    isConnected,
    handleTypingStart,
    handleTypingStop,
    connectSocket,
    disconnectSocketConnection,
  } = useSocket(userData.empID, selectedConversationId, setChatMessages)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Get employee ID from token
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const token = localStorage?.getItem("authToken")
        const tokenDecodablePart = token?.split(".")[1]
        const decoded = JSON.parse(atob(tokenDecodablePart))
        const employeeId = decoded?.Id
        if (employeeId) {
          setEmployeeIdFromToken(employeeId)
          setUserInfo({ id: userData.empID })
        }
      } catch (err) {
        console.error("Error decoding token:", err)
      }
    }
    fetchEmployeeId()
  }, [])

  // Get page height
  useEffect(() => {
    setPageHeight(window.innerHeight)
    const handleResize = () => setPageHeight(window.innerHeight)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initialize socket when user is available
  useEffect(() => {
    if (userData.empID) {
      connectSocket()
      fetchChatList()

      const handleNewNotification = () => {
        refreshOnNotification()
      }

      const handleOpenConversation = (event) => {
        const { conversationId, notification } = event.detail
        const conversation = chatList.find((chat) => chat.id === conversationId || chat._id === conversationId)
        if (conversation) {
          handleChatSelect(conversation)
        }
      }

      window.addEventListener("newNotification", handleNewNotification)
      window.addEventListener("openConversation", handleOpenConversation)
      return () => {
        window.removeEventListener("newNotification", handleNewNotification)
        window.removeEventListener("openConversation", handleOpenConversation)
        disconnectSocketConnection()
      }
    }
  }, [userData.empID, refreshOnNotification])

  // Listen for background messages
  useEffect(() => {
    const handleBackgroundMessage = async (event) => {
      const { conversationId, message, fromUser, shouldAutoSelect } = event.detail

      const conversation = chatList.find((chat) => chat.id === conversationId || chat._id === conversationId)

      if (conversation) {
        if (shouldAutoSelect) {
          handleChatSelect(conversation)
          setTimeout(() => {
            setChatMessages((prev) => {
              const exists = prev.some((msg) => msg._id === message._id || msg.id === message._id)
              if (!exists) {
                return [...prev, message]
              }
              return prev
            })
          }, 100)
        } else {
          refreshOnNotification()
        }
      } else {
        if (shouldAutoSelect) {
          try {
            const fetchedConversation = await fetchSpecificConversation(conversationId)
            if (fetchedConversation) {
              handleChatSelect(fetchedConversation)
              setTimeout(() => {
                setChatMessages((prev) => {
                  const exists = prev.some((msg) => msg._id === message._id || msg.id === message._id)
                  if (!exists) {
                    return [...prev, message]
                  }
                  return prev
                })
              }, 100)
            } else {
              refreshOnNotification()
            }
          } catch (error) {
            console.error("Error fetching conversation:", error)
            refreshOnNotification()
          }
        } else {
          refreshOnNotification()
        }
      }
    }

    const handleForceOpenConversation = handleBackgroundMessage

    window.addEventListener("newMessageReceived", handleBackgroundMessage)
    window.addEventListener("forceOpenConversation", handleForceOpenConversation)

    return () => {
      window.removeEventListener("newMessageReceived", handleBackgroundMessage)
      window.removeEventListener("forceOpenConversation", handleForceOpenConversation)
    }
  }, [selectedConversationId, refreshOnNotification, fetchSpecificConversation, setChatMessages])

  // Join/leave rooms when conversation changes
  useEffect(() => {
    if (selectedConversationId && socket) {
      joinRoom(selectedConversationId)
    }
    return () => {
      if (selectedConversationId && socket) {
        leaveRoom(selectedConversationId)
      }
    }
  }, [selectedConversationId, socket])

  // Handle chat selection
  const handleChatSelect = (chat) => {
    if (!chat || (!chat.id && !chat._id)) return
    const conversationId = chat.id || chat._id
    setSelectedConversationId(conversationId)
    setIsGroupChat(chat.isGroup || chat.type === "group")
    const chatRecipient = {
      _id: chat.recipient._id || chat.recipient.id,
      employeName: chat.recipient.name || chat.recipient.employeName,
      employeePhoto: chat.recipient.employeePhoto || chat.recipient.photo,
      conversationId: conversationId,
    }
    setSelectedEmployee(chatRecipient)
    fetchChatHistory(conversationId)
    markConversationNotificationsAsRead(conversationId)
  }

  // Handle employee selection from search
  const handleEmployeeSelect = async (employee) => {
    const existingConversation = chatList.find((chat) => chat.recipient && chat.recipient.id === employee._id)

    if (existingConversation) {
      setSelectedEmployee({
        _id: employee._id,
        employeName: employee.employeName,
        employeePhoto: employee.employeePhoto,
        conversationId: existingConversation.id,
      })
      setIsGroupChat(false)
      setSelectedConversationId(existingConversation.id)
      fetchChatHistory(existingConversation.id)
    } else {
      try {
        setSelectedEmployee({
          _id: employee._id,
          employeName: employee.employeName,
          employeePhoto: employee.employeePhoto,
          conversationId: null,
        })
        setIsGroupChat(false)
        setSelectedConversationId(null)
        setChatMessages([])

        const welcomeMessage = `Hi ${employee.employeName}! 👋`
        const response = await sendChatMessage({
          messageText: welcomeMessage,
          selectedEmployee: {
            _id: employee._id,
            employeName: employee.employeName,
            employeePhoto: employee.employeePhoto,
          },
          conversationId: null,
          isGroupChat: false,
          userInfo: { id: userData?.empID },
        })
        
        if (response.data?.items._id) {
          const newConversationId = response.data.items._id
          setSelectedConversationId(newConversationId)
          setSelectedEmployee((prev) => ({
            ...prev,
            conversationId: newConversationId,
          }))

          const welcomeMessageObj = {
            _id: response.data?.id || `msg-${Date.now()}`,
            id: response.data?.id || `msg-${Date.now()}`,
            sender: userData.empID,
            senderName: "You",
            content: { text: welcomeMessage },
            timestamp: new Date().toISOString(),
            isMine: true,
            pending: false,
          }
          setChatMessages([welcomeMessageObj])

          setTimeout(() => {
            forceRefreshChatList()
          }, 500)

          if (socket) {
            joinRoom(newConversationId)
          }
        }
      } catch (error) {
        console.error("Error creating conversation with employee:", error)
        setSelectedEmployee({
          _id: employee._id,
          employeName: employee.employeName,
          employeePhoto: employee.employeePhoto,
          conversationId: null,
        })
        setIsGroupChat(false)
        setSelectedConversationId(null)
        setChatMessages([])
      }
    }
  }

  const handleRefreshChat = () => {
    fetchChatHistory(selectedConversationId)
  }

  // Handle sending messages
  const handleSendMessage = async (messageData) => {
    const isTextMessage = typeof messageData === "string"
    const messageText = isTextMessage ? messageData : messageData.content || ""

    if (!isTextMessage && !messageData.fileUrl) {
      console.error("No file URL provided for media message")
      return
    }

    if (isTextMessage && !messageText.trim()) return
    if (!selectedEmployee || !userData.empID) return

    const tempId = `temp-${Date.now()}`
    const conversationId = selectedConversationId || selectedEmployee.conversationId

    

    const newMessage = {
      id: tempId,
      _id: null,
      sender: userData.empID,
      senderName: "You",
      content: isTextMessage
        ? { text: messageText }
        : {
            text: messageData.content || "",
            media: {
              url: messageData.fileUrl,
              fileName: messageData.fileName,
              fileSize: messageData.fileSize,
              mimeType: messageData.mimeType,
            },
          },
      type: isTextMessage ? "text" : messageData.contentType,
      timestamp: new Date().toISOString(),
      isMine: true,
      pending: true,
    }

    setChatMessages((prev) => [...prev, newMessage])

    try {
      if (isConnected) {
        const socketMessageData = isTextMessage
          ? {
              localId: tempId,
              conversationId: conversationId,
              recipientId: isGroupChat ? null : selectedEmployee._id,
              content: messageText,
              contentType: "text",
              isGroupChat: isGroupChat,
            }
          : {
              localId: tempId,
              conversationId: conversationId,
              recipientId: isGroupChat ? null : selectedEmployee._id,
              content: messageData.content || "",
              contentType: messageData.contentType,
              fileUrl: messageData.fileUrl,
              fileName: messageData.fileName,
              fileSize: messageData.fileSize,
              mimeType: messageData.mimeType,
              isGroupChat: isGroupChat,
            }

        const sent = sendMessage(socketMessageData)
        if (sent) {
          setChatMessages((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, pending: false } : msg)))
        } else {
          throw new Error("Failed to send via socket")
        }
      } else {
        const response = await sendChatMessage({
          messageText: isTextMessage ? messageText : messageData.content,
          selectedEmployee,
          conversationId,
          isGroupChat,
          userInfo: { id: userData?.empID },
          messageType: isTextMessage ? "text" : messageData.contentType,
          fileData: isTextMessage
            ? null
            : {
                url: messageData.fileUrl,
                fileName: messageData.fileName,
                fileSize: messageData.fileSize,
                mimeType: messageData.mimeType,
              },
        })

        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? {
                  ...msg,
                  _id: response.data?.id || response.data?._id,
                  pending: false,
                }
              : msg,
          ),
        )

        if (response.data?.conversationId) {
          setSelectedConversationId(response.data.conversationId)
          setSelectedEmployee((prev) => ({
            ...prev,
            conversationId: response.data.conversationId,
          }))
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setChatMessages((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, error: true, pending: false } : msg)))
    }
  }

  const handleBackToList = () => {
    setSelectedEmployee(null)
    setSelectedConversationId(null)
    setIsGroupChat(false)
  }

  const handleGroupCreated = () => {
    forceRefreshChatList()
  }

  const handleReactToMessage = (messageId, emoji) => {
    reactToMessage(messageId, emoji)
  }

  const handleRemoveReaction = (messageId) => {
    removeReaction(messageId)
  }

  const handleDeleteMessage = (messageId, forBoth) => {
    if (selectedConversationId) {
      deleteMessage(selectedConversationId, messageId, forBoth)
    }
  }

  const handleEditMessage = (messageId, newContent, newContentType) => {
    if (selectedConversationId) {
      updateMessage(messageId, newContent, newContentType)
    }
  }

  // Listen for reaction events
  useEffect(() => {
    if (!socket) return

    const unsubscribeReaction = onReaction((eventType, data) => {

      if (eventType === "updated" || eventType === "removed") {
        setChatMessages((prev) =>
          prev.map((msg) => {
            if (msg._id === data.messageId || msg.id === data.messageId) {
              return { ...msg, reactions: data.reactions || [] }
            }
            return msg
          }),
        )
      }
    })

    const unsubscribeDelete = onDelete((eventType, data) => {

      if (eventType === "deleted" || eventType === "deletedForEveryone") {
        setChatMessages((prev) =>
          prev.map((msg) => {
            if (msg._id === data.messageId || msg.id === data.messageId) {
              if (data.forBoth) {
                return { ...msg, isDeleted: true }
              } else {
                return { ...msg, deletedFor: [...(msg.deletedFor || []), userData.empID] }
              }
            }
            return msg
          }),
        )
      }
    })

    return () => {
      unsubscribeReaction()
      unsubscribeDelete()
    }
  }, [socket, setChatMessages, userData.empID])

  return (
    <>
      <Box
        sx={{
          height: pageHeight - 128,
          display: "flex",
          bgcolor: "#f8fafc",
          width: "100%",
          alignItems: "stretch",
          borderRadius: { xs: 0, md: 2 },
          overflow: "hidden",
          boxShadow: { xs: "none", md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
          position: "relative",
        }}
      >
        {/* Sidebar - Hidden on mobile when chat is selected */}
        <Box
          sx={{
            display: {
              xs: selectedEmployee ? "none" : "flex",
              md: "flex",
            },
            width: { xs: "100%", md: "380px" },
            flexShrink: 0,
          }}
        >
          <ChatSidebar
            chatList={chatList}
            loadingChatList={loadingChatList}
            pageHeight={pageHeight}
            selectedConversationId={selectedConversationId}
            onChatSelect={handleChatSelect}
            onEmployeeSelect={handleEmployeeSelect}
            userInfo={{ id: userData?.empID }}
            employeeIdFromToken={employeeIdFromToken}
            onGroupCreated={handleGroupCreated}
            onlineUsers={onlineUsers}
            notifications={notifications}
            unreadNotificationsCount={getUnreadCount()}
            onClearNotifications={clearAllNotifications}
            connectionStatus={connectionStatus}
            getConversationUnreadCount={getConversationUnreadCount}
          />
        </Box>

        {/* Chat Area - Full width on mobile when chat is selected */}
        <Box
          sx={{
            display: {
              xs: selectedEmployee ? "flex" : "none",
              md: "flex",
            },
            flex: 1,
            width: { xs: "100%", md: "auto" },
          }}
        >
          <ChatArea
            selectedEmployee={selectedEmployee}
            isGroupChat={isGroupChat}
            chatMessages={chatMessages}
            loading={loading}
            sendingMessage={false}
            typingUsers={typingUsers}
            pageHeight={pageHeight}
            onSendMessage={handleSendMessage}
            onBackToList={handleBackToList}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
            userInfo={{ id: userData?.empID }}
            isConnected={isConnected}
            chatList={chatList}
            onlineUsers={onlineUsers}
            isUserOnline={isUserOnline}
            onReactToMessage={handleReactToMessage}
            onRemoveReaction={handleRemoveReaction}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
            onChatRefresh={handleRefreshChat}
            groupInfo={groupInfo}
            isMobile={isMobile}
            onRefresh={handleRefreshChat}
          />
        </Box>
      </Box>
      <AutoNotificationDisplay />
    </>
  )
}

const NewChat = () => {
  return (
    <NotificationProvider>
      <ChatWithNotifications />
    </NotificationProvider>
  )
}

export default NewChat
