"use client"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Typography,
  Stack,
  Box,
  Divider,
  Rating,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import WarningIcon from "@mui/icons-material/Warning"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useApi } from "@core/hooks/useApi"

export default function AiChatModal({ open, onClose, aiInterviewId, aiVideoUrl }) {
  const { callApi } = useApi()
  const [messages, setMessages] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [videoURL, setVideoURL] = useState("")

  useEffect(() => {
    if (!open || !aiInterviewId) {
      setMessages([])
      setSummary(null)
      setVideoURL("")
      setLoading(false)
      return
    }

    const fetchChatHistory = async () => {
      setLoading(true)
      try {
        const historyRes = await callApi({
          endpoint: `/v1/api/interview/getInterviewHistory?interviewId=${aiInterviewId}`,
          method: "GET",
          auth: true,
          disableSnackbar: true,
        })

        const rawHistory = historyRes?.data?.items?.history || []
        const fetchedSummary = historyRes?.data?.items?.summary
        const url = aiVideoUrl || historyRes?.data?.items?.videoUrl // Prefer prop, fallback to fetched

        const formatted = rawHistory.map((msg) => ({
          role: msg.role === "model" ? "AI" : "user",
          content: msg.role === "model" && typeof msg.content === "object" ? msg.content?.question : msg.content,
        }))

        setMessages(formatted)
        setSummary(fetchedSummary)
        setVideoURL(url)
      } catch (err) {
        console.error("Error fetching data:", err)
        setMessages([])
        setSummary(null)
        setVideoURL("")
      } finally {
        setLoading(false)
      }
    }

    fetchChatHistory()
  }, [open, aiInterviewId, aiVideoUrl]) // Depend on open, aiInterviewId, and aiVideoUrl

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      {summary?.jobFitScore && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 8, md: 12 },
            mt: 3,
            px: 2,
            margin: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <DialogTitle sx={{ fontWeight: 600, p: 0, mb: 1, fontSize: 20 }}>Job Fit Score</DialogTitle>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  backgroundColor: "#8e44ad",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                {summary.jobFitScore}
              </Box>
              <Rating
                name="job-fit"
                value={Number.parseFloat(summary.jobFitScore) / 2}
                precision={0.5}
                readOnly
                size="medium"
              />
            </Box>
          </Box>
          {summary?.status && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "1rem",
                bgcolor: summary.status === "Recommended" ? "#4caf50" : "#f44336",
                color: "#fff",
                height: "fit-content",
                mt: { xs: 1, sm: 5.5 },
                alignSelf: { xs: "flex-start", sm: "center" },
              }}
            >
              {summary.status === "Recommended" ? (
                <CheckCircleIcon fontSize="medium" />
              ) : (
                <WarningIcon fontSize="medium" />
              )}
              {summary.status}
            </Box>
          )}
        </Box>
      )}
      <IconButton aria-label="close" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent
        dividers
        sx={{
          bgcolor: "#f5f5f5",
          minHeight: "500px",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          overflow: "hidden",
        }}
      >
        {/* AI Chat Section */}
        <Box
          flex={2}
          sx={{
            bgcolor: "#f7e1f0",
            borderRadius: 2,
            boxShadow: 1,
            overflowY: "auto",
            pr: 1,
            display: "flex",
            flexDirection: "column",
            maxHeight: { xs: "300px", md: "500px" },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, bgcolor: "white" }}>AI Interview Chat</DialogTitle>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : messages.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No chat found.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user"
                return (
                  <Box
                    key={idx}
                    sx={{
                      padding: 2,
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "75%",
                        px: 2,
                        py: 1,
                        padding: 3,
                        bgcolor: isUser ? "#9C27B0" : "#e3f2fd",
                        color: isUser ? "#fff" : "#000",
                        borderRadius: "20px",
                        borderBottomRightRadius: isUser ? "4px" : "20px",
                        borderBottomLeftRadius: isUser ? "20px" : "4px",
                        fontSize: "0.95rem",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.content}
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          )}
        </Box>
        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />
        {/* Summary Section */}
        <Box
          flex={1.3}
          sx={{
            bgcolor: "#ffffff",
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
            overflowY: "auto",
            maxHeight: { xs: "300px", md: "500px" },
          }}
        >
          <Typography variant="h6" fontWeight={600} fontSize={20} mb={2}>
            Summary
          </Typography>
          {summary ? (
            <Stack spacing={2}>
              {/* Strengths */}
              <Box sx={{ bgcolor: "#e8f5e9", p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Strengths
                </Typography>
                <Stack spacing={0.5}>
                  {summary?.candidateStrengths?.map((s, idx) => (
                    <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontSize="1rem">✅</Typography>
                      <Typography variant="body2">{s}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
              {/* Weaknesses */}
              <Box sx={{ bgcolor: "#fff3e0", p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Weaknesses
                </Typography>
                <Stack spacing={0.5}>
                  {summary?.weaknesses?.map((w, idx) => (
                    <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontSize="1rem">⚠️</Typography>
                      <Typography variant="body2">{w}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
              {/* Final Remarks */}
              <Box sx={{ bgcolor: "#ede7f6", p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Final Remarks
                </Typography>
                <Typography variant="body2" mt={0.5}>
                  {summary.finalRemarks}
                </Typography>
              </Box>
              {/* Candidate Recorded Video */}
              {videoURL && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    Recorded Interview Video
                  </Typography>
                  <video
                    src={videoURL}
                    controls
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      backgroundColor: "#000",
                    }}
                  />
                </Box>
              )}
            </Stack>
          ) : (
            <Typography color="text.secondary">No summary available.</Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
