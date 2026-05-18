'use client';

import React from 'react'
import { Box, Typography, Avatar } from '@mui/material'

const TypingIndicator = ({ typingUsers = [], chatList = [] }) => {
  if (typingUsers.length === 0) return null

  // Get user names from the typing user IDs
  const getTypingUserNames = () => {
    return typingUsers.map(userId => {
      // Try to find the user in chat list first
      const chat = chatList.find(chat => 
        chat.recipient?.id === userId || chat.recipient?._id === userId
      )
      
      if (chat) {
        return chat.recipient.name || chat.recipient.employeName || 'Someone'
      }
      
      // Fallback to userId if name not found
      return `User ${userId.slice(-4)}`
    })
  }

  const typingUserNames = getTypingUserNames()
  
  const getTypingText = () => {
    if (typingUserNames.length === 1) {
      return `${typingUserNames[0]} is typing...`
    } else if (typingUserNames.length === 2) {
      return `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`
    } else {
      return `${typingUserNames[0]} and ${typingUserNames.length - 1} others are typing...`
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        margin: '8px 16px',
        animation: 'fadeIn 0.3s ease-in',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      {/* Typing Animation Dots */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          marginRight: 2
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 6,
              height: 6,
              backgroundColor: '#666',
              borderRadius: '50%',
              animation: 'typingBounce 1.4s infinite ease-in-out',
              animationDelay: `${index * 0.16}s`,
              '@keyframes typingBounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                  opacity: 0.5
                },
                '40%': {
                  transform: 'scale(1)',
                  opacity: 1
                }
              }
            }}
          />
        ))}
      </Box>

      {/* Typing Text */}
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          fontStyle: 'italic',
          fontSize: '13px'
        }}
      >
        {getTypingText()}
      </Typography>
    </Box>
  )
}

export default TypingIndicator
