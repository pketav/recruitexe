"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  styled,
  Badge,
  IconButton,
  Tooltip,
  Chip,
  Paper,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import NotificationsIcon from "@mui/icons-material/Notifications"
import ClearAllIcon from "@mui/icons-material/ClearAll"
import PersonIcon from "@mui/icons-material/Person"
import GroupsIcon from "@mui/icons-material/Groups"
import WifiIcon from "@mui/icons-material/Wifi"
import WifiOffIcon from "@mui/icons-material/WifiOff"
import ChatList from "./ChatList"
import SearchResults from "./SearchResults"
import GroupModal from "./GroupModal"
import GroupList from "./GroupList"

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: 12,
  padding: "4px",
  minHeight: 40,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  "& .MuiTabs-flexContainer": {
    gap: 4,
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  borderRadius: 8,
  padding: "6px 12px",
  minHeight: 32,
  textTransform: "none",
  fontWeight: 600,
  fontSize: 12,
  color: "#64748b",
  backgroundColor: "transparent",
  transition: "all 0.2s ease",
  "&.Mui-selected": {
    backgroundColor: "#3b82f6",
    color: "white",
    boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
  },
  "&:hover": {
    backgroundColor: "#f1f5f9",
  },
}))

const StyledSearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      backgroundColor: "#ffffff",
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused": {
      backgroundColor: "white",
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
  },
}))

const ConnectionStatusChip = styled(Chip)(({ status }) => ({
  fontSize: "11px",
  height: 22,
  fontWeight: 600,
  "& .MuiChip-label": {
    padding: "0 6px",
  },
  "& .MuiChip-icon": {
    fontSize: 14,
  },
}))

const NotificationBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#ef4444",
    color: "white",
    fontWeight: 600,
    fontSize: "10px",
    minWidth: 16,
    height: 16,
  },
}))

const ChatSidebar = ({
  chatList,
  loadingChatList,
  pageHeight,
  selectedConversationId,
  onChatSelect,
  onEmployeeSelect,
  userInfo,
  employeeIdFromToken,
  onGroupCreated,
  onlineUsers = new Set(),
  notifications = [],
  unreadNotificationsCount = 0,
  onClearNotifications,
  connectionStatus = "disconnected",
}) => {
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [openGroupModal, setOpenGroupModal] = useState(false)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setSearchTerm("")
    setSearchResults([])
  }

  const handleSearchChange = async (e) => {
    const term = e.target.value
    setSearchTerm(term)
    if (term.length > 0) {
      setSearchLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/users/`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        const data = await response.json()
        if (data && data.items.users && Array.isArray(data.items.users)) {
          const filteredEmployees = data.items.users.filter((emp) =>
            emp.employeName?.toLowerCase().includes(term.toLowerCase()),
          )
          setSearchResults(filteredEmployees)
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error("Error searching:", error)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    } else {
      setSearchResults([])
    }
  }

  const handleEmployeeSelectInternal = (employee) => {
    setSearchTerm("")
    setSearchResults([])
    onEmployeeSelect(employee)
  }

  const handleOpenGroupModal = () => {
    setOpenGroupModal(true)
  }

  const handleCloseGroupModal = () => {
    setOpenGroupModal(false)
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#ffffff",
        borderRight: { xs: "none", md: "1px solid #e2e8f0" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          p: 2.5,
          position: "relative",
          borderRadius: 0,
        }}
      >
        {/* Notifications and Status */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Tooltip title={`${unreadNotificationsCount} unread notifications`}>
              <NotificationBadge badgeContent={unreadNotificationsCount} color="error">
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.25)",
                    },
                  }}
                >
                  <NotificationsIcon fontSize="small" />
                </IconButton>
              </NotificationBadge>
            </Tooltip>

            {unreadNotificationsCount > 0 && onClearNotifications && (
              <Tooltip title="Clear all notifications">
                <IconButton
                  size="small"
                  onClick={onClearNotifications}
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                    },
                  }}
                >
                  <ClearAllIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Connection Status */}
          <ConnectionStatusChip
            icon={
              connectionStatus === "connected" ? (
                <WifiIcon sx={{ color: "#ffffff" }} />
              ) : (
                <WifiOffIcon sx={{ color: "#ffffff" }} />
              )
            }
            label={connectionStatus === "connected" ? "Online" : "Offline"}
            color={connectionStatus === "connected" ? "success" : "error"}
            variant="outlined"
            size="small"
            sx={{
              bgcolor: connectionStatus === "connected" ? "#10b981" : "#ef4444",
              borderColor: connectionStatus === "connected" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
              color:  "#ffffff",
            }}
          />
        </Box>

        {/* Online Users Count */}
        {onlineUsers.size > 0 && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`${onlineUsers.size} users online`}
              size="small"
              sx={{
                bgcolor: "rgba(16, 185, 129, 0.15)",
                color: "white",
                fontWeight: 600,
                fontSize: "11px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            />
          </Box>
        )}

        {/* Title and Tabs */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "white",
              fontSize: { xs: "1.25rem", md: "1.5rem" },
            }}
          >
            Messages
          </Typography>

          <StyledTabs value={tabValue} onChange={handleTabChange}>
            <StyledTab icon={<PersonIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Chats" />
            <StyledTab icon={<GroupsIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Groups" />
          </StyledTabs>
        </Box>
      </Paper>

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <StyledSearchField
          fullWidth
          placeholder={`Search ${tabValue === 0 ? "people" : "groups"}...`}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{
                  color: "#94a3b8",
                  mr: 1,
                  fontSize: 18,
                }}
              />
            ),
          }}
          sx={{
            "& .MuiInputBase-root": {
              fontSize: "14px",
              height: 44,
              fontWeight: 500,
            },
          }}
        />
      </Box>

      {/* Create Group Button */}
      {tabValue === 1 && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenGroupModal}
            fullWidth
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "13px",
              py: 1.2,
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
              },
            }}
          >
            Create New Group
          </Button>
          <GroupList tabValue={1} />
        </Box>
      )}

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {searchTerm ? (
          <SearchResults
            results={searchResults}
            loading={searchLoading}
            pageHeight={pageHeight}
            onEmployeeSelect={handleEmployeeSelectInternal}
            tabValue={tabValue}
            sx={{
              px: 1,
              height: "100%",
              overflowY: "auto",
            }}
          />
        ) : (
          <ChatList
            chatList={chatList}
            loadingChatList={loadingChatList}
            pageHeight={pageHeight}
            selectedConversationId={selectedConversationId}
            onChatSelect={onChatSelect}
            userInfo={userInfo}
            tabValue={tabValue}
            onlineUsers={onlineUsers}
            notifications={notifications}
            connectionStatus={connectionStatus}
            sx={{
              px: 1,
              height: "100%",
              overflowY: "auto",
            }}
          />
        )}
      </Box>

      {/* Group Modal */}
      <GroupModal
        open={openGroupModal}
        onClose={handleCloseGroupModal}
        userInfo={userInfo}
        employeeIdFromToken={employeeIdFromToken}
        onGroupCreated={onGroupCreated}
      />
    </Box>
  )
}

export default ChatSidebar
