"use client"
import { Box, Typography, Avatar, IconButton, Chip, Paper } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import MoreVertIcon from "@mui/icons-material/MoreVert"

const ChatHeader = ({
  selectedEmployee,
  isGroupChat,
  onBackToList,
  onHeaderClick,
  isConnected = false,
  isUserOnline = false,
  isMobile = false,
}) => {
  const getStatusText = () => {
    if (!isConnected) return "Offline"
    if (isGroupChat) return "Group Chat"
    return isUserOnline ? "Online" : "Last seen recently"
  }

  const getStatusColor = () => {
    if (!isConnected) return "#ef4444"
    if (isGroupChat) return "#3b82f6"
    return isUserOnline ? "#10b981" : "#6b7280"
  }

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        position: "relative",
      }}
    >
      {/* Back Button - Always show on mobile */}
      {isMobile && (
        <IconButton
          onClick={onBackToList}
          sx={{
            mr: 2,
            bgcolor: "#f1f5f9",
            "&:hover": {
              bgcolor: "#e2e8f0",
            },
          }}
        >
          <ArrowBackIcon sx={{ color: "#3b82f6" }} />
        </IconButton>
      )}

      {/* Avatar with online indicator */}
      <Box sx={{ position: "relative", mr: 2 }}>
        <Avatar
          src={selectedEmployee?.employeePhoto}
          alt={selectedEmployee?.employeName}
          sx={{
            width: 40,
            height: 40,
            border: isUserOnline && !isGroupChat ? "2px solid #10b981" : "2px solid #e2e8f0",
          }}
        >
          {!selectedEmployee?.employeePhoto && selectedEmployee?.employeName?.charAt(0)}
        </Avatar>

        {/* Online indicator */}
        {isUserOnline && !isGroupChat && isConnected && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              bgcolor: "#10b981",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        )}
      </Box>

      {/* Name and Status */}
      <Box
        onClick={onHeaderClick}
        sx={{
          flex: 1,
          cursor: isGroupChat ? "pointer" : "default",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            color: "#1f2937",
            fontSize: "16px",
          }}
        >
          {selectedEmployee?.employeName}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              color: getStatusColor(),
              fontWeight: isUserOnline ? 600 : 400,
              fontSize: "12px",
            }}
          >
            {getStatusText()}
          </Typography>

          {/* Connection status chip */}
          {!isConnected && (
            <Chip
              label="Disconnected"
              size="small"
              sx={{
                fontSize: "10px",
                height: 18,
                bgcolor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </Box>

      {/* More Options */}
      <IconButton
        sx={{
          bgcolor: "#f1f5f9",
          "&:hover": {
            bgcolor: "#e2e8f0",
          },
        }}
      >
        <MoreVertIcon sx={{ color: "#64748b" }} />
      </IconButton>
    </Paper>
  )
}

export default ChatHeader
