'use client';

import React from 'react'
import { Box, IconButton, Popover } from '@mui/material'
import { styled } from '@mui/material/styles'

const EmojiButton = styled(IconButton)(({ theme }) => ({
  fontSize: '1.5rem',
  padding: 4,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.2)',
  },
  transition: 'transform 0.2s',
}))

const ReactionPicker = ({ anchorEl, open, onClose, onSelectEmoji, currentUserReaction }) => {
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '👏', '🔥', '🎉', '😍']

  const handleEmojiClick = (emoji) => {
    onSelectEmoji(emoji)
    onClose()
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: {
          p: 1,
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {emojis.map((emoji) => (
          <EmojiButton
            key={emoji}
            onClick={() => handleEmojiClick(emoji)}
            sx={{
              backgroundColor: currentUserReaction === emoji ? 'action.selected' : 'transparent',
            }}
          >
            {emoji}
          </EmojiButton>
        ))}
      </Box>
    </Popover>
  )
}

export default ReactionPicker
