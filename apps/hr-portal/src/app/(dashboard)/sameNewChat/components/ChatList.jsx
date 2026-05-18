'use client';

import React from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  CircularProgress,
  styled,
  Badge,
  Chip
} from '@mui/material'

const ChatListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: 12,
  marginBottom: 8,
  padding: '12px 16px',
  cursor: 'pointer',
  backgroundColor: selected ? '#f0f0fa' : 'transparent',
  '&:hover': {
    backgroundColor: '#f8f8fb'
  },
  position: 'relative'
}))

const OnlineIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 2,
  right: 2,
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: '#4caf50',
  border: '2px solid white',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
}))

const UnreadBadge = styled(Box)(({ theme, count }) => ({
  backgroundColor: count > 0 ? '#8c7ae6' : 'transparent',
  color: 'white',
  borderRadius: '50%',
  minWidth: count > 99 ? 28 : 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: count > 99 ? 10 : 12,
  fontWeight: 600,
  padding: count > 99 ? '0 4px' : '0',
  animation: count > 0 ? 'pulse 2s infinite' : 'none',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.1)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  }
}))

const ChatList = ({
  chatList,
  loadingChatList,
  pageHeight,
  selectedConversationId,
  onChatSelect,
  userInfo,
  tabValue,
  onlineUsers = new Set(),
  notifications = [],
  connectionStatus = 'disconnected',
  getConversationUnreadCount = () => 0
}) => {
  const formatLastMessageTime = (timestamp) => {
    const now = new Date()
    const msgDate = new Date(timestamp)

    if (msgDate.toDateString() === now.toDateString()) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const daysDiff = (now - msgDate) / (1000 * 60 * 60 * 24)
    if (daysDiff < 7) {
      return msgDate.toLocaleDateString([], { weekday: 'short' })
    }

    return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId)
  }

  // Get latest notification time for a conversation
  const getLatestNotificationTime = (conversationId) => {
    const convNotifications = notifications.filter(n =>
      n.conversationId === conversationId
    )
    if (convNotifications.length === 0) return null

    return Math.max(...convNotifications.map(n => new Date(n.timestamp).getTime()))
  }

  if (loadingChatList) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (chatList.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No conversations yet</Typography>
        {connectionStatus !== 'connected' && (
          <Chip
            label="Offline"
            size="small"
            color="error"
            sx={{ mt: 1 }}
          />
        )}
      </Box>
    )
  }

  // Filter chats based on tab
  const filteredChats = chatList.filter(chat => {
    if (tabValue === 0) {
      // Individual chats
      return !chat.isGroup && chat.type !== 'group'
    } else {
      // Group chats
      return chat.isGroup || chat.type === 'group'
    }
  })

  // Sort chats by latest activity (including notifications)
  const sortedChats = [...filteredChats].sort((a, b) => {
    const aNotificationTime = getLatestNotificationTime(a.id) || 0
    const bNotificationTime = getLatestNotificationTime(b.id) || 0
    const aUpdatedAt = new Date(a.updatedAt).getTime()
    const bUpdatedAt = new Date(b.updatedAt).getTime()

    const aLatestTime = Math.max(aNotificationTime, aUpdatedAt)
    const bLatestTime = Math.max(bNotificationTime, bUpdatedAt)

    // Pinned chats always come first
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1

    return bLatestTime - aLatestTime
  })

  return (
    <List sx={{ height: pageHeight - 310, overflow: 'auto', px: 2 }}>

      {sortedChats.map((chat) => {
        const isOnline = isUserOnline(chat.recipient?.id || chat.recipient?._id)
        const notificationCount = getConversationUnreadCount(chat.id)
        const totalUnreadCount = (chat.unreadCount || 0) + notificationCount
        const hasNewActivity = totalUnreadCount > 0 || getLatestNotificationTime(chat.id)

        return (
          <ChatListItem
            key={chat.id}
            selected={selectedConversationId === chat.id}
            onClick={() => onChatSelect(chat)}
            sx={{
              borderLeft: hasNewActivity ? '3px solid #8c7ae6' : '3px solid transparent',
              backgroundColor: selectedConversationId === chat.id
                ? '#f0f0fa'
                : hasNewActivity
                  ? '#fafafa'
                  : 'transparent'
            }}
          >

            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  isOnline && !chat.isGroup && chat.type !== 'group' ? (
                    <OnlineIndicator />
                  ) : null
                }
              >
                <Avatar
                  src={chat.recipient?.employeePhoto || chat.recipient?.groupPhoto}
                  alt={chat.recipient?.name}
                  sx={{
                    border: isOnline && !chat.isGroup && chat.type !== 'group'
                      ? '2px solid #4caf50'
                      : '2px solid transparent',
                    transition: 'border-color 0.3s ease'
                  }}
                >
                  {!chat.recipient?.employeePhoto && !chat.recipient?.groupPhoto && chat.recipient?.name?.charAt(0)}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={hasNewActivity ? 700 : 600}
                    sx={{
                      color: hasNewActivity ? '#333' : 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    {chat.recipient?.name}
                    {isOnline && !chat.isGroup && chat.type !== 'group' && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#4caf50',
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 },
                          }
                        }}
                      />
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatLastMessageTime(chat.updatedAt)}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{
                      maxWidth: 200,
                      fontWeight: hasNewActivity ? 600 : 400,
                      color: hasNewActivity ? '#555' : 'text.secondary'
                    }}
                  >
                    {chat.lastMessage?.content || 'No messages yet'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    {totalUnreadCount > 0 && (
                      <UnreadBadge count={totalUnreadCount}>
                        {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                      </UnreadBadge>
                    )}
                    {chat.isPinned && (
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: '#ff9800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          color: 'white'
                        }}
                      >
                        📌
                      </Box>
                    )}
                  </Box>
                </Box>
              }
            />
          </ChatListItem>
        )
      })}

      {/* Connection Status Footer */}
      {/* <Box sx={{
        p: 2,
        textAlign: 'center',
        borderTop: '1px solid #f0f0f0',
        backgroundColor: '#fafafa'
      }}>
        <Chip
          label={connectionStatus === 'connected' ? 'Online' : 'Offline'}
          size="small"
          color={connectionStatus === 'connected' ? 'success' : 'error'}
          variant="outlined"
          sx={{ fontSize: '11px' }}
        />
      </Box> */}
    </List>
  )
}

export default ChatList
