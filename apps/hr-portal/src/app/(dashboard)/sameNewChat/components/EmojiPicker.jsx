'use client';

import React from 'react'
import { Box, Typography, Popover, Grid, Tooltip } from '@mui/material'

// Define regular emojis
const regularEmojis = [
  '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊',
  '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂',
  '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣',
  '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜',
  '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️',
  '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨',
  '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵',
  '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇'
]

// Define animated emoji data
const animatedEmojis = [
  {
    id: 'anim_laugh',
    url: 'https://media.tenor.com/images/9ec48e514b0fda58804ccffa4f1e5f01/tenor.gif',
    alt: 'Laughing Face'
  },
  {
    id: 'anim_love',
    url: 'https://media.tenor.com/images/0a3e109296e16e0f7eb2afe18f9eaba5/tenor.gif',
    alt: 'Heart Eyes'
  },
  {
    id: 'anim_sad',
    url: 'https://media.tenor.com/images/ce52606293142a2bd11cda1d3f0dc12c/tenor.gif',
    alt: 'Crying Face'
  },
  {
    id: 'anim_angry',
    url: 'https://media.tenor.com/images/6c77afe4dc605c410994acefd634615c/tenor.gif',
    alt: 'Angry Face'
  },
  {
    id: 'anim_happy',
    url: 'https://media.tenor.com/images/e9ef5c4654d6f56eda2fdcd1c3f915f1/tenor.gif',
    alt: 'Happy Face'
  },
  {
    id: 'anim_thinking',
    url: 'https://media.tenor.com/images/87f6d86db0af72090a78c36b5c4bebcd/tenor.gif',
    alt: 'Thinking Face'
  },
  {
    id: 'anim_dizzy',
    url: 'https://media.tenor.com/images/9417c86e5fc9bc70c2afb9d1e7e7d22e/tenor.gif',
    alt: 'Dizzy Face'
  },
  {
    id: 'anim_cool',
    url: 'https://media.tenor.com/images/f2d6e1e81cfcace8d596458f35064854/tenor.gif',
    alt: 'Cool Face'
  },
  {
    id: 'anim_party',
    url: 'https://media.tenor.com/images/4d05e34c1b05ee141253a56b82a486e3/tenor.gif',
    alt: 'Party Face'
  },
  {
    id: 'anim_sleepy',
    url: 'https://media.tenor.com/images/3e8a707a161b435fc7d9810deec33ca9/tenor.gif',
    alt: 'Sleepy Face'
  },
  {
    id: 'anim_facepalm',
    url: 'https://media.tenor.com/images/c92533c0a50d5dd936df2f9239d5ee9c/tenor.gif',
    alt: 'Facepalm'
  },
  {
    id: 'anim_thumbsup',
    url: 'https://media.tenor.com/images/b2b0ad7058a0feb212abd55aef131422/tenor.gif',
    alt: 'Thumbs Up'
  },
  {
    id: 'anim_eyeroll',
    url: 'https://media.tenor.com/images/bea828d22afae0d10ba49c6c1b924f14/tenor.gif',
    alt: 'Eye Roll'
  },
  {
    id: 'anim_shocked',
    url: 'https://media.tenor.com/images/3e3086309975266ff9053b6ceb6336da/tenor.gif',
    alt: 'Shocked Face'
  },
  {
    id: 'anim_dance',
    url: 'https://media0.giphy.com/media/wGKrkvHxZT6PVpw635/giphy.webp?cid=82a1493bgvmw8z7lcoueflijjv2xwnjl2qwywhz2upq30wg8&ep=v1_gifs_trending&rid=giphy.webp&ct=g',
    alt: 'Happy Birthday'
  },
  {
    id: 'anim_clap',
    url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExamxtN2g5azRkcHczMHdyeTM3MnFkOGk5YW0xN3FsY3VrNmR1dXVzeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUNd9KcJKVZKiPGepq/giphy.gif',
    alt: 'Clapping'
  }
]

const EmojiPicker = ({
  anchorEl,
  open,
  onClose,
  onEmojiClick,
  onAnimatedEmojiClick,
  emojiTab,
  onEmojiTabChange
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      sx={{
        '& .MuiPopover-paper': {
          width: 320,
          p: 2,
          mt: 1,
          maxHeight: 400,
          overflowY: 'auto'
        }
      }}
    >
      <Box>
        {/* Emoji picker tabs */}
        <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              py: 1,
              cursor: 'pointer',
              fontWeight: emojiTab === 0 ? 'bold' : 'normal',
              borderBottom: emojiTab === 0 ? '2px solid #8c7ae6' : 'none',
              color: emojiTab === 0 ? '#8c7ae6' : 'inherit'
            }}
            onClick={() => onEmojiTabChange(0)}
          >
            Emojis
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              py: 1,
              cursor: 'pointer',
              fontWeight: emojiTab === 1 ? 'bold' : 'normal',
              borderBottom: emojiTab === 1 ? '2px solid #8c7ae6' : 'none',
              color: emojiTab === 1 ? '#8c7ae6' : 'inherit'
            }}
            onClick={() => onEmojiTabChange(1)}
          >
            Animated
          </Box>
        </Box>

        {/* Regular emojis */}
        {emojiTab === 0 && (
          <Grid container spacing={1}>
            {regularEmojis.map((emoji, index) => (
              <Grid item key={index} xs={2}>
                <Box
                  sx={{
                    fontSize: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    p: 0.5,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(140, 122, 230, 0.1)'
                    }
                  }}
                  onClick={() => onEmojiClick(emoji)}
                >
                  {emoji}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Animated emojis */}
        {emojiTab === 1 && (
          <Grid container spacing={1}>
            {animatedEmojis.map(emoji => (
              <Grid item key={emoji.id} xs={4}>
                <Tooltip title={emoji.alt} placement='top'>
                  <Box
                    sx={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      p: 0.5,
                      borderRadius: 1,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        backgroundColor: 'rgba(140, 122, 230, 0.1)'
                      }
                    }}
                    onClick={() => onAnimatedEmojiClick(emoji)}
                  >
                    <Box
                      component='img'
                      src={emoji.url}
                      alt={emoji.alt}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Popover>
  )
}

export default EmojiPicker