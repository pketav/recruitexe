"use client"
import { useState } from "react"
import { Box, Paper, Typography } from "@mui/material"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import GroupInfoPanel from "./GroupInfoPanel"

const ChatArea = ({
  selectedEmployee,
  isGroupChat,
  chatMessages,
  loading,
  sendingMessage,
  typingUsers,
  pageHeight,
  onSendMessage,
  onBackToList,
  onTypingStart,
  onTypingStop,
  userInfo,
  isConnected,
  chatList = [],
  onlineUsers = new Set(),
  isUserOnline = true,
  onReactToMessage,
  onRemoveReaction,
  onDeleteMessage,
  onEditMessage,
  onChatRefresh,
  onRefresh,
  groupInfo,
  isMobile = false,
}) => {
  const [showGroupInfo, setShowGroupInfo] = useState(false)

  if (!selectedEmployee) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          position: "relative",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            p: 4,
            bgcolor: "white",
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            color: "#64748b",
            fontSize: "16px",
            fontWeight: 500,
            maxWidth: 400,
            mx: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: "#334155" }}>
            💬 Welcome to Messages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a conversation to start messaging
          </Typography>
        </Paper>
      </Box>
    )
  }

  const isChatUserOnline = () => {
    if (isUserOnline && typeof isUserOnline === "function") {
      return isUserOnline(selectedEmployee?._id)
    }
    return onlineUsers.has(selectedEmployee?._id)
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        height: "100%",
        width: "100%",
      }}
    >
      <ChatHeader
        selectedEmployee={selectedEmployee}
        isGroupChat={isGroupChat}
        onBackToList={onBackToList}
        isConnected={isConnected}
        isUserOnline={isChatUserOnline()}
        onHeaderClick={() => {
          if (isGroupChat) setShowGroupInfo(true)
        }}
        isMobile={isMobile}
      />

      <GroupInfoPanel onRefresh={onRefresh} open={showGroupInfo} onClose={() => setShowGroupInfo(false)} groupInfo={groupInfo} onChatRefresh={onChatRefresh} />

      <MessageList
        chatMessages={chatMessages}
        typingUsers={typingUsers}
        userInfo={userInfo}
        pageHeight={pageHeight}
        chatList={chatList}
        selectedConversationId={selectedEmployee?.conversationId}
        onReactToMessage={onReactToMessage}
        onRemoveReaction={onRemoveReaction}
        onDeleteMessage={onDeleteMessage}
        onEditMessage={onEditMessage}
        onChatRefresh={onChatRefresh}
      />

      <MessageInput
        onSendMessage={onSendMessage}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
        sendingMessage={sendingMessage}
        isConnected={isConnected}
      />
    </Box>
  )
}

export default ChatArea
