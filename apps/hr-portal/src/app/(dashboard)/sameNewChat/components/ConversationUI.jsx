'use client';

import React, { useState, useRef } from 'react'
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Popover,
  Grid,
  Tooltip,
  Divider,
  styled
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import { RiAttachment2 } from 'react-icons/ri'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ForwardIcon from '@mui/icons-material/Forward'
import MessageContent from './MessageContent'
import EmojiPicker from './EmojiPicker'

const MessageInputField = styled(TextField)(({ theme }) => ({
  backgroundColor: '#f0f0fa',
  borderRadius: 25,
  '& .MuiOutlinedInput-root': {
    borderRadius: 25,
    '& fieldset': {
      border: 'none'
    }
  }
}))

const MessageBubble = styled(Box)(({ isOwnMessage }) => ({
  maxWidth: '70%',
  padding: '10px 16px',
  borderRadius: isOwnMessage ? '16px 16px 0 16px' : '16px 16px 16px 0',
  backgroundColor: isOwnMessage ? '#8c7ae6' : '#6b6bff0d',
  color: isOwnMessage ? 'white' : '#001075',
  alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
  margin: '8px 0',
  wordBreak: 'break-word',
  fontWeight: '700',
  position: 'relative',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: isOwnMessage ? '#7c6ad6' : '#5b5bef0d'
  }
}))

const MessageActions = styled(Box)(({ isOwnMessage }) => ({
  position: 'absolute',
  ...(isOwnMessage ? { right: 10 } : { left: 10 }),
  top: -30,
  background: 'white',
  borderRadius: 20,
  padding: '2px 2px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  zIndex: 100
}))

const getRandomColor = (name) => {
  const colors = ['#8c7ae6', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
  const index = name ? name.charCodeAt(0) % colors.length : 0
  return colors[index]
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getMessageDateLabel = (timestamp) => {
  const messageDate = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate())
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterdayDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

  if (messageDay.getTime() === todayDay.getTime()) {
    return 'Today'
  } else if (messageDay.getTime() === yesterdayDay.getTime()) {
    return 'Yesterday'
  } else {
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
}

const getMessagesWithDateHeaders = (messages) => {
  if (!messages.length) return []

  const sortedMessages = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  const result = []
  let currentDateLabel = null

  sortedMessages.forEach(message => {
    const messageDateLabel = getMessageDateLabel(message.timestamp)

    if (messageDateLabel !== currentDateLabel) {
      currentDateLabel = messageDateLabel
      result.push({
        isDateHeader: true,
        date: messageDateLabel,
        id: `date-${message.timestamp}`,
        timestamp: message.timestamp
      })
    }

    result.push(message)
  })

  return result
}

const ConversationUI = ({
  selectedEmployee,
  isGroupChat,
  conversationDetails,
  chatMessages,
  loading,
  message,
  setMessage,
  sendingMessage,
  onSendMessage,
  onBackToList,
  onMessageChange,
  onKeyDown,
  pageHeight,
  messagesEndRef,
  userInfo,
  typingUsers,
  // Message actions
  hoveredMessageId,
  setHoveredMessageId,
  messageMenuAnchorEl,
  setMessageMenuAnchorEl,
  selectedMessage,
  setSelectedMessage,
  onMessageMenuOpen,
  onMessageMenuClose,
  onDeleteForMe,
  onDeleteForAll,
  onForwardMessage,
  deleteLoading,
  // Emoji picker
  anchorEmoji,
  setAnchorEmoji,
  emojiTab,
  setEmojiTab,
  onEmojiClick,
  onAnimatedEmojiClick,
  // File upload
  isRecording,
  recordingDuration,
  onStartRecording,
  onStopRecording,
  fileInputRef,
  onFileSelect,
  uploadingFile,
  // Quick reactions
  onQuickReaction,
  quickReactionEmojis = ['👍', '❤️', '😂', '😮', '😢', '👏']
}) => {
  const handleMessageMouseEnter = (messageId) => {
    setHoveredMessageId(messageId)
  }

  const handleMessageMouseLeave = () => {
    setHoveredMessageId(null)
    if (!messageMenuAnchorEl) {
      setSelectedMessage(null)
    }
  }

  const renderTypingIndicator = () => {
    if (typingUsers.length === 0) return null

    return (
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
        <Typography variant="caption">
          {typingUsers.length === 1 
            ? 'Someone is typing...' 
            : `${typingUsers.length} people are typing...`
          }
        </Typography>
        <Box sx={{ ml: 1, display: 'flex', gap: 0.5 }}>
          {[0, 1, 2].map((dot) => (
            <Box
              key={dot}
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: 'text.secondary',
                animation: 'typing 1.5s infinite',
                animationDelay: `${dot * 0.2}s`,
                '@keyframes typing': {
                  '0%, 80%, 100%': { opacity: 0.3 },
                  '40%': { opacity: 1 }
                }
              }}
            />
          ))}
        </Box>
      </Box>
    )
  }

  const renderMessage = (msg) => {
    const isOwnMessage = msg.isMine || msg.sender === userData.empID
    const isHovered = hoveredMessageId === (msg._id || msg.id)

    return (
      <Box
        key={msg._id || msg.id}
        data-message-id={msg._id || msg.id}
        sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}
        onMouseEnter={() => handleMessageMouseEnter(msg._id || msg.id)}
        onMouseLeave={handleMessageMouseLeave}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
          alignItems: 'flex-end',
          gap: 1
        }}>
          {!isOwnMessage && (
            <Avatar 
              src={msg.senderPhoto} 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: getRandomColor(msg.senderName || 'Unknown')
              }}
            >
              {!msg.senderPhoto && (msg.senderName?.charAt(0) || 'U')}
            </Avatar>
          )}

          <MessageBubble isOwnMessage={isOwnMessage}>
            {!isOwnMessage && isGroupChat && (
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, opacity: 0.8 }}>
                {msg.senderName || 'Unknown'}
              </Typography>
            )}
            
            <MessageContent message={msg} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                {formatTime(msg.timestamp)}
              </Typography>
              
              {isOwnMessage && (
                <Box sx={{ ml: 1 }}>
                  {msg.pending ? (
                    <CircularProgress size={12} sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  ) : msg.error ? (
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>!</Typography>
                  ) : (
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {msg.isRead ? '✓✓' : '✓'}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {/* Message Actions on Hover */}
            {isHovered && (
              <MessageActions isOwnMessage={isOwnMessage}>
                {quickReactionEmojis.map(emoji => (
                  <IconButton
                    key={emoji}
                    size="small"
                    onClick={() => onQuickReaction(emoji, msg)}
                    sx={{ fontSize: '16px', p: 0.5 }}
                  >
                    {emoji}
                  </IconButton>
                ))}
                <IconButton
                  size="small"
                  onClick={(e) => onMessageMenuOpen(e, msg)}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </MessageActions>
            )}

            {/* Message Reactions */}
            {msg.reactions && msg.reactions.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {Object.entries(
                  msg.reactions.reduce((acc, reaction) => {
                    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1
                    return acc
                  }, {})
                ).map(([emoji, count]) => (
                  <Box
                    key={emoji}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      px: 0.5,
                      py: 0.2,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.2
                    }}
                  >
                    {emoji} {count > 1 && count}
                  </Box>
                ))}
              </Box>
            )}
          </MessageBubble>
        </Box>
      </Box>
    )
  }

  if (!selectedEmployee) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Select a conversation to start chatting
        </Typography>
      </Box>
    )
  }

  const messagesWithHeaders = getMessagesWithDateHeaders(chatMessages)

  return (
    <>
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: 'white' 
      }}>
        <IconButton onClick={onBackToList} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        
        <Avatar 
          src={selectedEmployee.employeePhoto} 
          sx={{ mr: 2, bgcolor: getRandomColor(selectedEmployee.employeName) }}
        >
          {!selectedEmployee.employeePhoto && selectedEmployee.employeName?.charAt(0)}
        </Avatar>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {selectedEmployee.employeName}
          </Typography>
          {isGroupChat && conversationDetails?.participants && (
            <Typography variant="caption" color="text.secondary">
              {conversationDetails.participants.length} members
            </Typography>
          )}
        </Box>
      </Box>

      {/* Messages Area */}
      <Box 
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }} 
        id="messageContainer"
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : messagesWithHeaders.length > 0 ? (
          messagesWithHeaders.map((item) => {
            if (item.isDateHeader) {
              return (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: 'background.paper',
                      px: 2,
                      py: 0.5,
                      borderRadius: '20px',
                      color: 'text.secondary',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    {item.date}
                  </Typography>
                </Box>
              )
            }
            return renderMessage(item)
          })
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1,
            flexDirection: 'column',
            gap: 1
          }}>
            <Typography variant="body1" color="text.secondary">
              No messages yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start the conversation by sending a message
            </Typography>
          </Box>
        )}

        {/* Typing Indicator */}
        {renderTypingIndicator()}

        {/* Messages end reference */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: 'white' }}>
        <MessageInputField
          fullWidth
          placeholder="Type a messagekkkkkk..."
          value={message}
          onChange={onMessageChange}
          onKeyDown={onKeyDown}
          disabled={sendingMessage}
          multiline
          maxRows={4}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileSelect}
                  style={{ display: 'none' }}
                  accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
                />
                <IconButton 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                >
                  {uploadingFile ? <CircularProgress size={20} /> : <RiAttachment2 />}
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={(e) => setAnchorEmoji(e.currentTarget)}>
                  <EmojiEmotionsIcon />
                </IconButton>
                
                {isRecording ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="error">
                      {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                    </Typography>
                    <IconButton onClick={onStopRecording} color="error">
                      <StopIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton 
                    onClick={message.trim() ? onSendMessage : onStartRecording}
                    disabled={sendingMessage}
                    color="primary"
                  >
                    {sendingMessage ? (
                      <CircularProgress size={20} />
                    ) : message.trim() ? (
                      <SendIcon />
                    ) : (
                      <MicIcon />
                    )}
                  </IconButton>
                )}
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Message Menu */}
      <Menu
        anchorEl={messageMenuAnchorEl}
        open={Boolean(messageMenuAnchorEl)}
        onClose={onMessageMenuClose}
      >
        <MenuItem onClick={onDeleteForMe} disabled={deleteLoading}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete for me
        </MenuItem>
        {selectedMessage?.isMine && (
          <MenuItem onClick={onDeleteForAll} disabled={deleteLoading}>
            <ListItemIcon>
              <DeleteForeverIcon fontSize="small" />
            </ListItemIcon>
            Delete for everyone
          </MenuItem>
        )}
        <MenuItem onClick={onForwardMessage}>
          <ListItemIcon>
            <ForwardIcon fontSize="small" />
          </ListItemIcon>
          Forward
        </MenuItem>
      </Menu>

      {/* Emoji Picker */}
      <EmojiPicker
        anchorEl={anchorEmoji}
        open={Boolean(anchorEmoji)}
        onClose={() => setAnchorEmoji(null)}
        onEmojiClick={onEmojiClick}
        onAnimatedEmojiClick={onAnimatedEmojiClick}
        emojiTab={emojiTab}
        onEmojiTabChange={setEmojiTab}
      />
    </>
  )
}

export default ConversationUI