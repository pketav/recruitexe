"use client"
import { useRef, useEffect, useState } from "react"
import { Box, Typography, CircularProgress, styled, IconButton, Chip, Paper } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AddReactionIcon from "@mui/icons-material/AddReaction"
import EditIcon from "@mui/icons-material/Edit"
import TypingIndicator from "./TypingIndicator"
import ReactionPicker from "./ReactionPicker"
import DeleteMessageMenu from "./DeleteMessageMenu"
import MessageContent from "./MessageContent"
import EditMessage from "./EditMessage"
import { getMessageText } from "@/utils/messageUtils"

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isOwnMessage" && prop !== "isLongMessage",
})(({ isOwnMessage, isLongMessage }) => ({
  width: "fit-content",
  maxWidth: isLongMessage ? "65%" : "100%",
  minWidth: "auto",
  padding: "12px 16px",
  borderRadius: isOwnMessage ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
  background: isOwnMessage ? "linear-gradient(120deg, #c0dcfa, #9dbff7)" : "#ffffff",
  color: isOwnMessage ? "#ffffff" : "black",
  alignSelf: isOwnMessage ? "flex-end" : "flex-start",
  margin: "4px 0",
  wordBreak: "break-word",
  fontWeight: 500,
  position: "relative",
  transition: "all 0.2s ease",
  border: isOwnMessage ? "none" : "1px solid #e2e8f0",
  boxShadow: isOwnMessage ? "0 2px 8px rgba(59, 130, 246, 0.3)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: isOwnMessage
      ? "0 4px 12px rgba(59, 130, 246, 0.4)"
      : "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
}))


const MessageActions = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: -32,
  right: 0,
  display: "flex",
  gap: 2,
  backgroundColor: "#ffffff",
  borderRadius: 16,
  padding: 4,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  border: "1px solid #e2e8f0",
  opacity: 0,
  transition: "all 0.2s ease",
  pointerEvents: "none",
  transform: "translateY(2px)",
}))

const MessageWrapper = styled(Box)(() => ({
  position: "relative",
  "&:hover .message-actions": {
    opacity: 1,
    pointerEvents: "auto",
    transform: "translateY(0)",
  },
}))

const ReactionChip = styled(Chip)(({ theme, isUserReaction }) => ({
  height: 24,
  fontSize: "0.75rem",
  backgroundColor: isUserReaction ? "rgba(59, 130, 246, 0.15)" : "#f8fafc",
  color: isUserReaction ? "#3b82f6" : "#374151",
  border: isUserReaction ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid #e2e8f0",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: isUserReaction ? "rgba(59, 130, 246, 0.25)" : "#e2e8f0",
  },
}))

const MessageList = ({
  chatMessages,
  loading,
  typingUsers,
  userInfo,
  pageHeight,
  chatList = [],
  selectedConversationId,
  onReactToMessage,
  onRemoveReaction,
  onDeleteMessage,
  onEditMessage,
  onChatRefresh,
}) => {
  const messagesEndRef = useRef(null)
  const [reactionAnchor, setReactionAnchor] = useState(null)
  const [deleteAnchor, setDeleteAnchor] = useState(null)
  const [editAnchor, setEditAnchor] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages, typingUsers])

  const isLongMessage = (msg) => {
    const contentText = getMessageText(msg.content || "")
    return contentText.length > 80 || contentText.includes("\n")
  }
  

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleReactionClick = (event, message) => {
    setReactionAnchor(event.currentTarget)
    setSelectedMessage(message)
  }

  const handleDeleteClick = (event, message) => {
    setDeleteAnchor(event.currentTarget)
    setSelectedMessage(message)
  }

  const handleEditClick = (event, message) => {
    setEditAnchor(event.currentTarget)
    setSelectedMessage(message)
  }

  const handleSelectEmoji = (emoji) => {
    if (selectedMessage && onReactToMessage) {
      onReactToMessage(selectedMessage._id || selectedMessage.id, emoji)
    }
  }

  const handleDeleteForMe = () => {
    if (selectedMessage && onDeleteMessage) {
      onDeleteMessage(selectedMessage._id || selectedMessage.id, false)
    }
  }

  const handleDeleteForEveryone = () => {
    if (selectedMessage && onDeleteMessage) {
      onDeleteMessage(selectedMessage._id || selectedMessage.id, true)
    }
  }

  const handleEditMessage = (newContent) => {
    let newContentType = "unknown"

    if (typeof newContent === "string") {
      newContentType = "text"
    } else if (newContent instanceof File || newContent instanceof Blob) {
      newContentType = newContent.type.startsWith("image/")
        ? "image"
        : newContent.type.startsWith("video/")
          ? "video"
          : "file"
    } else if (typeof newContent === "object" && newContent !== null) {
      if ("type" in newContent) {
        newContentType = newContent.type
      } else if ("url" in newContent && newContent.url.match(/\.(jpg|png|gif|jpeg|webp)$/i)) {
        newContentType = "image"
      } else if ("url" in newContent && newContent.url.match(/\.(mp4|mov|avi)$/i)) {
        newContentType = "video"
      } else {
        newContentType = "structured"
      }
    }

    if (selectedMessage && onEditMessage) {
      onEditMessage(selectedMessage._id || selectedMessage.id, newContent, newContentType)
      setTimeout(() => {
        onChatRefresh()
      }, 2000)
    }
  }

  const handleReactionChipClick = (message, reaction) => {
    if (!userInfo?.id) return
    const isUserReaction = reaction.userId?._id === userInfo.id || reaction.userId === userInfo.id
    if (isUserReaction && onRemoveReaction) {
      onRemoveReaction(message._id || message.id)
    } else if (!isUserReaction && onReactToMessage) {
      onReactToMessage(message._id || message.id, reaction.emoji)
    }
  }

  const getUserReaction = (message) => {
    if (!message.reactions || !userInfo?.id) return null
    const userReaction = message.reactions.find((r) => r.userId?._id === userInfo.id || r.userId === userInfo.id)
    return userReaction?.emoji
  }

  const groupReactions = (reactions) => {
    if (!reactions || reactions.length === 0) return []
    const grouped = reactions.reduce((acc, reaction) => {
      const emoji = reaction.emoji
      if (!acc[emoji]) {
        acc[emoji] = []
      }
      acc[emoji].push(reaction)
      return acc
    }, {})
    return Object.entries(grouped).map(([emoji, reactionList]) => ({
      emoji,
      count: reactionList.length,
      users: reactionList.map((r) => r.userId),
      hasUserReacted: reactionList.some((r) => r.userId?._id === userInfo?.id || r.userId === userInfo?.id),
    }))
  }

  if (loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8fafc",
        }}
      >
        <CircularProgress sx={{ color: "#3b82f6" }} />
      </Box>
    )
  }

  if (chatMessages.length === 0 && typingUsers.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8fafc",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            bgcolor: "white",
            borderRadius: 2,
            border: "1px solid #e2e8f0",
            textAlign: "center",
            maxWidth: 300,
            mx: 2,
          }}
        >
          <Typography color="text.secondary" fontWeight={500}>
            💬 No messages yet. Start a conversation!
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        p: 2,
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {chatMessages.map((msg, index) => {
        const isDeleted = msg.isDeleted || (msg.deletedFor && msg.deletedFor.includes(userInfo?.id))

        if (isDeleted) {
          return (
            <Box
              key={msg._id || msg.id || index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.isMine ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                    color: "#ef4444",
                    fontWeight: 500,
                  }}
                >
                  🚫 This message was deleted
                </Typography>
              </Paper>
            </Box>
          )
        }

        return (
          <MessageWrapper
            key={msg._id || msg.id || index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.isMine ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: msg.isMine ? "flex-end" : "flex-start",
              }}
            >
              <MessageActions className="message-actions">
                <IconButton
                  size="small"
                  onClick={(e) => handleReactionClick(e, msg)}
                  sx={{
                    p: 0.5,
                    "&:hover": {
                      bgcolor: "rgba(59, 130, 246, 0.1)",
                    },
                  }}
                >
                  <AddReactionIcon fontSize="small" sx={{ color: "#3b82f6" }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteClick(e, msg)}
                  sx={{
                    p: 0.5,
                    "&:hover": {
                      bgcolor: "rgba(239, 68, 68, 0.1)",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" sx={{ color: "#ef4444" }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => handleEditClick(e, msg)}
                  sx={{
                    p: 0.5,
                    "&:hover": {
                      bgcolor: "rgba(245, 158, 11, 0.1)",
                    },
                  }}
                >
                  <EditIcon fontSize="small" sx={{ color: "#f59e0b" }} />
                </IconButton>
              </MessageActions>

              <MessageBubble
                  isOwnMessage={msg.isMine}
                  isLongMessage={isLongMessage(msg)}
                  elevation={0}
                >
                {msg.type && msg.type !== "text" ? (
                  <MessageContent message={msg} />
                ) : (
                  <Typography
                    fontSize={14}
                    fontWeight={500}
                    sx={{
                      lineHeight: 1.4,
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      hyphens: "auto",
                    }}
                  >
                    {getMessageText(msg.content)}
                    {msg.content?.media?.url && (
                      <Box mt={1}>
                        {msg.content.media.type?.startsWith("image") ? (
                          <img
                            src={msg.content.media.url || "/placeholder.svg"}
                            alt="attachment"
                            style={{
                              maxWidth: "100%",
                              borderRadius: 8,
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                        ) : msg.content.media.type?.startsWith("video") ? (
                          <video
                            controls
                            style={{
                              maxWidth: "100%",
                              borderRadius: 8,
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <source src={msg.content.media.url} type={msg.content.media.type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            📎 Media attached
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Typography>
                )}

                {msg.isEdited && (
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      fontSize: 11,
                      display: "block",
                      mt: 0.5,
                      color: msg.isMine ? "black" : "text.secondary",
                    }}
                  >
                    (edited)
                  </Typography>
                )}

                {msg.pending && (
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      fontSize: 10,
                      color: msg.isMine ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                    }}
                  >
                    Sending...
                  </Typography>
                )}

                {msg.error && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#ef4444",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    Failed to send
                  </Typography>
                )}
              </MessageBubble>

              {/* Reactions */}
              {msg.reactions && msg.reactions.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    mt: 0.5,
                    flexWrap: "wrap",
                    justifyContent: msg.isMine ? "flex-end" : "flex-start",
                  }}
                >
                  {groupReactions(msg.reactions).map((reactionGroup) => (
                    <ReactionChip
                      key={reactionGroup.emoji}
                      label={`${reactionGroup.emoji} ${reactionGroup.count}`}
                      size="small"
                      isUserReaction={reactionGroup.hasUserReacted}
                      onClick={() => handleReactionChipClick(msg, { emoji: reactionGroup.emoji, userId: userInfo?.id })}
                    />
                  ))}
                </Box>
              )}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  fontSize: 11,
                  fontWeight: 400,
                  opacity: 0.6,
                }}
              >
                {formatTime(msg.timestamp || msg.createdAt)}
              </Typography>
            </Box>
          </MessageWrapper>
        )
      })}

      <TypingIndicator typingUsers={typingUsers} chatList={chatList} />

      <ReactionPicker
        anchorEl={reactionAnchor}
        open={Boolean(reactionAnchor)}
        onClose={() => setReactionAnchor(null)}
        onSelectEmoji={handleSelectEmoji}
        currentUserReaction={selectedMessage ? getUserReaction(selectedMessage) : null}
      />

      <DeleteMessageMenu
        anchorEl={deleteAnchor}
        open={Boolean(deleteAnchor)}
        onClose={() => setDeleteAnchor(null)}
        onDeleteForMe={handleDeleteForMe}
        onDeleteForEveryone={handleDeleteForEveryone}
        isSender={selectedMessage?.isMine || false}
      />

      <EditMessage
        anchorEl={editAnchor}
        open={Boolean(editAnchor)}
        selectedMessage={selectedMessage}
        onClose={() => setEditAnchor(null)}
        onEditMessage={handleEditMessage}
      />

      <div ref={messagesEndRef} />
    </Box>
  )
}

export default MessageList
