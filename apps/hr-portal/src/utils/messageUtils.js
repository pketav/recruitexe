// Utility functions for message content handling

/**
 * Safely extract text from message content
 * @param {string|object} content - Message content (can be string or object)
 * @returns {string} - The text content
 */
export const getMessageText = (content) => {
  if (!content) return ''
  
  if (typeof content === 'string') {
    return content
  }
  
  if (typeof content === 'object') {
    return content.text || ''
  }
  
  return ''
}

/**
 * Normalize message content to always be an object
 * @param {string|object} content - Message content
 * @returns {object} - Normalized content object
 */
export const normalizeMessageContent = (content) => {
  if (!content) {
    return { text: '' }
  }
  
  if (typeof content === 'string') {
    return { text: content }
  }
  
  return content
}

/**
 * Check if message has media content
 * @param {object} message - Message object
 * @returns {boolean} - True if message has media
 */
export const hasMediaContent = (message) => {
  if (!message) return false
  
  // Check message type
  if (message.type && ['image', 'audio', 'video', 'file'].includes(message.type)) {
    return true
  }
  
  // Check content type
  if (message.content?.type && ['image', 'audio', 'video', 'file'].includes(message.content.type)) {
    return true
  }
  
  // Check for media object
  if (message.content?.media?.url) {
    return true
  }
  
  return false
}

/**
 * Get media URL from message
 * @param {object} message - Message object
 * @returns {string|null} - Media URL or null
 */
export const getMediaUrl = (message) => {
  if (!message) return null
  
  // Direct URL
  if (message.content?.url) {
    return message.content.url
  }
  
  // Media object URL
  if (message.content?.media?.url) {
    return message.content.media.url
  }
  
  return null
}

/**
 * Format message for display
 * @param {object} message - Raw message object
 * @param {string} currentUserId - Current user's ID
 * @returns {object} - Formatted message
 */
export const formatMessage = (message, currentUserId) => {
  return {
    ...message,
    content: normalizeMessageContent(message.content),
    isMine: message.isMine || 
            (typeof message.sender === 'object' && message.sender._id === currentUserId) ||
            message.sender === currentUserId,
    reactions: message.reactions || [],
    deletedFor: message.deletedFor || [],
    isDeleted: message.isDeleted || false
  }
}
