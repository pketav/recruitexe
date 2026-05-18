"use client"
import { Box, Typography, Button, IconButton, useTheme, useMediaQuery } from "@mui/material"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import AudioFileIcon from "@mui/icons-material/AudioFile"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import DownloadIcon from "@mui/icons-material/Download"
import ImageIcon from "@mui/icons-material/Image"
import { getMessageText } from "@/utils/messageUtils"

const MessageContent = ({ message }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Handle deleted messages
  if (message.isDeleted || (message.deletedFor && message.deletedFor.includes(message.currentUserId))) {
    return (
      <Typography
        variant="body2"
        sx={{
          fontStyle: "italic",
          opacity: 0.7,
          color: "#ef4444",
          fontWeight: 500,
        }}
      >
        🚫 This message was deleted
      </Typography>
    )
  }

  const { content } = message
  console.log("content", content)

  if (!content) return null

  // For text messages
  if (!message.type || message.type === "text") {
    return (
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          lineHeight: 1.4,
          fontSize: { xs: "14px", sm: "15px" },
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {getMessageText(content)}
      </Typography>
    )
  }

  // For animated emoji messages
  if (message.type === "animatedEmoji") {
    return (
      <Box
        sx={{
          maxWidth: "100%",
          textAlign: "center",
          p: { xs: 1, sm: 1.5 },
        }}
      >
        <Box
          component="img"
          src={content.url}
          alt={content.alt || "Animated emoji"}
          sx={{
            maxWidth: { xs: 80, sm: 100, md: 120 },
            maxHeight: { xs: 80, sm: 100, md: 120 },
            objectFit: "contain",
            borderRadius: 2,
          }}
        />
      </Box>
    )
  }

  // For image messages
  if (message.type === "image") {
    const imageUrl = content?.media?.url || content.url
    const fileName = content?.media?.fileName || content.fileName
    const fileSize = content?.media?.fileSize || content.fileSize
    console.log("image content", imageUrl, fileName, fileSize)

    // Format file size
    const formatFileSize = (bytes) => {
      if (!bytes) return ""
      const sizes = ["Bytes", "KB", "MB", "GB"]
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
    }

    return (
      <Box
        sx={{
          maxWidth: "100%",
          position: "relative",
          width: "fit-content",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            width: "fit-content",
            maxWidth: "100%",
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={fileName || "Image"}
            onError={(e) => {
              e.target.style.display = "none"
              console.error("Image failed to load:", imageUrl)
            }}
            sx={{
              maxWidth: "100%",
              width: "auto",
              height: "auto",
              maxHeight: { xs: "200px", sm: "250px", md: "300px" },
              minWidth: { xs: "150px", sm: "200px" },
              borderRadius: 2,
              mb: fileName ? 1 : 0,
              display: "block",
              objectFit: "cover",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            loading="lazy"
          />

          {/* Download button overlay */}
          <IconButton
            component="a"
            href={imageUrl}
            download={fileName || "image"}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              position: "absolute",
              top: { xs: 4, sm: 8 },
              right: { xs: 4, sm: 8 },
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
              backdropFilter: "blur(4px)",
            }}
          >
            <DownloadIcon fontSize={isSmallMobile ? "small" : "medium"} />
          </IconButton>
        </Box>

        {fileName && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 0.5, sm: 1 },
              mt: 1,
              px: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: message.isMine ? "black" : "#64748b",
                fontWeight: 500,
                fontSize: { xs: "11px", sm: "12px" },
                wordBreak: "break-word",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <ImageIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
              {fileName}
            </Typography>
            {fileSize && (
              <Typography
                variant="caption"
                sx={{
                  color: message.isMine ? "rgba(255, 255, 255, 0.7)" : "#94a3b8",
                  fontSize: { xs: "10px", sm: "11px" },
                  fontWeight: 400,
                }}
              >
                {formatFileSize(fileSize)}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    )
  }

  // For audio messages
  if (message.type === "audio" || message.type === "voice") {
    const audioUrl = content.url || content.media?.url

    return (
      <Box
        sx={{
          width: "100%",
          minWidth: { xs: "200px", sm: "250px" },
          maxWidth: { xs: "280px", sm: "350px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1.5,
            px: 1,
          }}
        >
          <AudioFileIcon
            sx={{
              mr: 1,
              color: message.isMine ? "rgba(255, 255, 255, 0.9)" : "#3b82f6",
              fontSize: { xs: 20, sm: 24 },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: message.isMine ? "rgba(255, 255, 255, 0.9)" : "#374151",
              fontWeight: 500,
              fontSize: { xs: "13px", sm: "14px" },
            }}
          >
            Voice Message
          </Typography>
        </Box>
        <audio
          controls
          src={audioUrl}
          style={{
            width: "100%",
            maxWidth: "100%",
            height: isMobile ? "36px" : "40px",
            borderRadius: "8px",
            outline: "none",
          }}
          preload="metadata"
        />
      </Box>
    )
  }

  // For other file types (including PDFs)
  const fileUrl = content.url || content.media?.url
  const fileName = content.fileName || content.media?.fileName
  const fileSize = content.fileSize || content.media?.fileSize
  const mimeType = content.mimeType || content.media?.mimeType

  const isPdf = mimeType?.includes("pdf") || fileName?.toLowerCase().endsWith(".pdf")

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return ""
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Box
      sx={{
        backgroundColor: message.isMine ? "rgba(255, 255, 255, 0.15)" : "rgba(59, 130, 246, 0.05)",
        borderRadius: 3,
        p: { xs: 1.5, sm: 2 },
        minWidth: { xs: "200px", sm: "250px" },
        maxWidth: { xs: "280px", sm: "350px" },
        border: message.isMine ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(59, 130, 246, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          mb: { xs: 1, sm: 1.5 },
          gap: { xs: 1, sm: 1.5 },
        }}
      >
        {isPdf ? (
          <PictureAsPdfIcon
            sx={{
              fontSize: { xs: 32, sm: 40 },
              color: message.isMine ? "black" : "#ef4444",
              flexShrink: 0,
            }}
          />
        ) : (
          <InsertDriveFileIcon
            sx={{
              fontSize: { xs: 32, sm: 40 },
              color: message.isMine ? "rgba(255, 255, 255, 0.9)" : "#64748b",
              flexShrink: 0,
            }}
          />
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              color: message.isMine ? "black" : "#1f2937",
              fontWeight: 600,
              wordBreak: "break-word",
              fontSize: { xs: "13px", sm: "14px" },
              lineHeight: 1.3,
              mb: fileSize ? 0.5 : 0,
            }}
          >
            {fileName || "File"}
          </Typography>
          {fileSize && (
            <Typography
              variant="caption"
              sx={{
                color: message.isMine ? "black" : "#64748b",
                fontSize: { xs: "11px", sm: "12px" },
                fontWeight: 400,
              }}
            >
              {formatFileSize(fileSize)}
            </Typography>
          )}
        </Box>
      </Box>

      {fileUrl && (
        <Button
          component="a"
          href={fileUrl}
          download={fileName || "file"}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          startIcon={<DownloadIcon fontSize={isMobile ? "small" : "medium"} />}
          fullWidth
          sx={{
            color: message.isMine ? "black" : "#3b82f6",
            borderColor: message.isMine ? "black" : "#3b82f6",
            fontSize: { xs: "12px", sm: "13px" },
            fontWeight: 600,
            py: { xs: 0.75, sm: 1 },
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: message.isMine ? "rgba(255, 255, 255, 0.2)" : "rgba(59, 130, 246, 0.1)",
              borderColor: message.isMine ? "rgba(255, 255, 255, 0.8)" : "#2563eb",
              transform: "translateY(-1px)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            },
            transition: "all 0.2s ease",
          }}
        >
          Download {isPdf ? "PDF" : "File"}
        </Button>
      )}
    </Box>
  )
}

export default MessageContent
