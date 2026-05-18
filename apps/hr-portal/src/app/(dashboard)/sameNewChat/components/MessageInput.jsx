"use client"
import { useState, useRef } from "react"
import {
  Box,
  TextField,
  IconButton,
  styled,
  Typography,
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import WifiOffIcon from "@mui/icons-material/WifiOff"
import ImageIcon from "@mui/icons-material/Image"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import GifBoxIcon from "@mui/icons-material/GifBox"
import CloseIcon from "@mui/icons-material/Close"
import SearchIcon from "@mui/icons-material/Search"
import axios from "axios"

const MessageInputField = styled(TextField)(({ theme, isConnected }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 24,
    backgroundColor: "#f8fafc",
    border: `1px solid ${isConnected ? "#e2e8f0" : "#fbbf24"}`,
    transition: "all 0.2s ease",
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      backgroundColor: "#ffffff",
      borderColor: isConnected ? "#cbd5e1" : "#f59e0b",
    },
    "&.Mui-focused": {
      backgroundColor: "white",
      borderColor: isConnected ? "#3b82f6" : "#f59e0b",
      boxShadow: isConnected ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "0 0 0 3px rgba(245, 158, 11, 0.1)",
    },
  },
}))

const EmojiGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gap: 4,
  padding: 12,
  maxHeight: 240,
  overflowY: "auto",
})

const EmojiButton = styled(IconButton)({
  fontSize: "1.2rem",
  padding: 6,
  borderRadius: 8,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    transform: "scale(1.1)",
  },
})

const GifGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 8,
  padding: 12,
  maxHeight: 280,
  overflowY: "auto",
})

const GifItem = styled("img")({
  width: "100%",
  height: "auto",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    opacity: 0.8,
    transform: "scale(1.02)",
  },
})

const PreviewContainer = styled(Box)({
  position: "relative",
  display: "inline-block",
  margin: 4,
})

const RemoveButton = styled(IconButton)({
  position: "absolute",
  top: -6,
  right: -6,
  backgroundColor: "#ef4444",
  color: "white",
  padding: 4,
  width: 24,
  height: 24,
  "&:hover": {
    backgroundColor: "#dc2626",
  },
})

const EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
  "🤔",
  "🤭",
  "🤫",
  "🤥",
  "😶",
  "😐",
  "😑",
  "😬",
  "🙄",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "🥱",
  "😴",
  "🤤",
  "😪",
  "😵",
  "🤐",
  "🥴",
  "🤢",
  "🤮",
  "🤧",
  "😷",
  "🤒",
  "🤕",
  "🤑",
  "🤠",
  "😈",
  "👿",
  "👹",
  "👺",
  "🤡",
  "💩",
  "👻",
  "💀",
  "☠️",
  "👽",
  "👾",
  "🤖",
  "🎃",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
  "👋",
  "🤚",
  "🖐",
  "✋",
  "🖖",
  "👌",
  "🤌",
  "🤏",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👈",
  "👉",
  "👆",
  "🖕",
  "👇",
  "☝️",
  "👍",
  "👎",
  "👏",
  "🙌",
  "🤝",
  "🙏",
  "✍️",
  "💅",
  "🤳",
  "💪",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "❣️",
  "💕",
  "💞",
  "💓",
  "💗",
  "💖",
  "💘",
  "💝",
  "💟",
  "☮️",
]

const SAMPLE_GIFS = [
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3og0INyCmHlNylks9O/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif",
  "https://media.giphy.com/media/3o7TKvuOivTe8klxjG/giphy.gif",
]

const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop, sendingMessage, isConnected = true }) => {
  const [message, setMessage] = useState("")
  const [emojiAnchor, setEmojiAnchor] = useState(null)
  const [attachmentAnchor, setAttachmentAnchor] = useState(null)
  const [emojiTab, setEmojiTab] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null)
  const [gifSearch, setGifSearch] = useState("")
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const baseUrl = process.env.NEXT_PUBLIC_CHAT_SOCKET_URL

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
    if (e.target.value.trim() && isConnected) {
      onTypingStart()
    } else {
      onTypingStop()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji)
    if (isConnected) {
      onTypingStart()
    }
  }

  const handleGifClick = (gifUrl) => {
    handleSendWithMedia(gifUrl, "image", "gif.gif")
    setEmojiAnchor(null)
  }

  const handleFileSelect = async (event, type) => {
    const file = event.target.files[0]
    if (!file) return

    if (type === "image" && !file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }
    if (type === "pdf" && file.type !== "application/pdf") {
      alert("Please select a PDF file")
      return
    }

    setSelectedFile(file)
    setAttachmentAnchor(null)
    await uploadFile(file)
  }

  const uploadFile = async (file) => {
    setUploadingFile(true)
    try {
      const formData = new FormData()
      formData.append("files", file)

      const response = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (response.data?.status && response.data?.items) {
        const uploadedUrl = response.data.items[0]
        setUploadedFileUrl(uploadedUrl)

        const fileType = file.type.startsWith("image/") ? "image" : file.type === "application/pdf" ? "file" : "file"

        handleSendWithMedia(uploadedUrl, fileType, file.name, file.size)
      } else {
        alert("Upload failed: " + (response.data?.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Failed to upload file. Please try again.")
    } finally {
      setUploadingFile(false)
      setSelectedFile(null)
      setUploadedFileUrl(null)
    }
  }

  const handleSendWithMedia = (fileUrl, fileType, fileName, fileSize = 0) => {
    onTypingStop()
    const messageData = {
      content: message.trim() || "",
      contentType: fileType,
      fileUrl: fileUrl,
      fileName: fileName,
      fileSize: fileSize,
      mimeType: fileType === "image" ? "image/jpeg" : "application/pdf",
    }
    onSendMessage(messageData)
    setMessage("")
    setSelectedFile(null)
    setUploadedFileUrl(null)
  }

  const handleSend = () => {
    if (!message.trim() || sendingMessage) return
    onTypingStop()

    if (!uploadedFileUrl) {
      onSendMessage(message.trim())
    } else {
      handleSendWithMedia(uploadedFileUrl, "file", selectedFile?.name || "file")
    }
    setMessage("")
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    setUploadedFileUrl(null)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        background: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        position: "relative",
      }}
    >
      {/* File Preview */}
      {selectedFile && (
        <Box sx={{ mb: 2 }}>
          <PreviewContainer>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
              }}
            >
              {selectedFile.type.startsWith("image/") ? (
                <ImageIcon sx={{ color: "#3b82f6" }} />
              ) : (
                <PictureAsPdfIcon sx={{ color: "#ef4444" }} />
              )}
              <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                {selectedFile.name}
              </Typography>
              {uploadingFile && <CircularProgress size={16} sx={{ color: "#3b82f6" }} />}
            </Paper>
            <RemoveButton size="small" onClick={removeSelectedFile}>
              <CloseIcon fontSize="small" />
            </RemoveButton>
          </PreviewContainer>
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {/* Emoji Button */}
        <IconButton
          size="medium"
          onClick={(e) => setEmojiAnchor(e.currentTarget)}
          sx={{
            bgcolor: "#f1f5f9",
            border: "1px solid #e2e8f0",
            "&:hover": {
              bgcolor: "#e2e8f0",
            },
          }}
        >
          <EmojiEmotionsIcon sx={{ color: "#3b82f6" }} />
        </IconButton>

        {/* Attachment Button */}
        <IconButton
          size="medium"
          onClick={(e) => setAttachmentAnchor(e.currentTarget)}
          disabled={uploadingFile}
          sx={{
            bgcolor: "#f1f5f9",
            border: "1px solid #e2e8f0",
            "&:hover": {
              bgcolor: "#e2e8f0",
            },
            "&:disabled": {
              bgcolor: "#f8fafc",
              borderColor: "#e2e8f0",
            },
          }}
        >
          <AttachFileIcon sx={{ color: uploadingFile ? "#9ca3af" : "#3b82f6" }} />
        </IconButton>

        {/* Message Input */}
        <MessageInputField
          fullWidth
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={4}
          isConnected={isConnected}
          disabled={uploadingFile}
          sx={{
            "& .MuiInputBase-root": {
              fontSize: "14px",
              fontWeight: 500,
              minHeight: 44,
            },
          }}
        />

        {/* Send Button */}
        <IconButton
          onClick={handleSend}
          disabled={(!message.trim() && !uploadedFileUrl) || uploadingFile}
          sx={{
            width: 44,
            height: 44,
            background:
              (message.trim() || uploadedFileUrl) && isConnected
                ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                : "#e2e8f0",
            color: (message.trim() || uploadedFileUrl) && isConnected ? "white" : "#9ca3af",
            transition: "all 0.2s ease",
            "&:hover": {
              background:
                (message.trim() || uploadedFileUrl) && isConnected
                  ? "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
                  : "#cbd5e1",
              transform: (message.trim() || uploadedFileUrl) && isConnected ? "scale(1.05)" : "none",
            },
            "&:disabled": {
              background: "#e2e8f0",
              color: "#9ca3af",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>

      {/* Emoji/GIF Picker Menu */}
      <Menu
        anchorEl={emojiAnchor}
        open={Boolean(emojiAnchor)}
        onClose={() => setEmojiAnchor(null)}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            borderRadius: 2,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
          },
        }}
      >
        <Tabs
          value={emojiTab}
          onChange={(e, v) => setEmojiTab(v)}
          sx={{
            borderBottom: 1,
            borderColor: "#e2e8f0",
            "& .MuiTab-root": {
              fontWeight: 600,
              "&.Mui-selected": {
                color: "#3b82f6",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#3b82f6",
            },
          }}
        >
          <Tab icon={<EmojiEmotionsIcon />} label="Emojis" />
          <Tab icon={<GifBoxIcon />} label="GIFs" />
        </Tabs>

        {emojiTab === 0 ? (
          <EmojiGrid>
            {EMOJIS.map((emoji, index) => (
              <EmojiButton key={index} onClick={() => handleEmojiClick(emoji)}>
                {emoji}
              </EmojiButton>
            ))}
          </EmojiGrid>
        ) : (
          <Box>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search GIFs..."
                value={gifSearch}
                onChange={(e) => setGifSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#3b82f6" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "#e2e8f0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                    },
                  },
                }}
              />
            </Box>
            <GifGrid>
              {SAMPLE_GIFS.map((gif, index) => (
                <GifItem key={index} src={gif} alt={`GIF ${index}`} onClick={() => handleGifClick(gif)} />
              ))}
            </GifGrid>
          </Box>
        )}
      </Menu>

      {/* Attachment Menu */}
      <Menu
        anchorEl={attachmentAnchor}
        open={Boolean(attachmentAnchor)}
        onClose={() => setAttachmentAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
          },
        }}
      >
        <MenuItem
          onClick={() => imageInputRef.current?.click()}
          sx={{
            gap: 2,
            py: 1.5,
            px: 3,
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#f1f5f9",
            },
          }}
        >
          <ImageIcon sx={{ color: "#3b82f6" }} />
          Image
        </MenuItem>
        <MenuItem
          onClick={() => fileInputRef.current?.click()}
          sx={{
            gap: 2,
            py: 1.5,
            px: 3,
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#f1f5f9",
            },
          }}
        >
          <PictureAsPdfIcon sx={{ color: "#ef4444" }} />
          PDF
        </MenuItem>
      </Menu>

      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFileSelect(e, "image")}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={(e) => handleFileSelect(e, "pdf")}
      />

      {/* Status Text */}
      {!isConnected && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
            gap: 1,
          }}
        >
          <Chip
            icon={<WifiOffIcon />}
            label="Connecting..."
            size="small"
            sx={{
              bgcolor: "rgba(245, 158, 11, 0.1)",
              color: "#f59e0b",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              fontWeight: 600,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              textAlign: "center",
              fontSize: "11px",
              fontWeight: 500,
              maxWidth: 350,
            }}
          >
            Real-time chat is off. Messages will be seen only when the recipient opens the chat—no instant notifications
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default MessageInput
