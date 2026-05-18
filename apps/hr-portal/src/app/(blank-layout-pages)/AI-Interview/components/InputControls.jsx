"use client"
import {
  CardContent,
  Box,
  Tabs,
  Tab,
  Alert,
  Paper,
  Typography,
  Button,
  LinearProgress,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  Divider,
  Fab,
} from "@mui/material"
import { Mic, Keyboard, HourglassEmpty, Stop, Send, MicOff, FiberManualRecord, Refresh } from "@mui/icons-material"

export default function InputControls({
  interviewStarted,
  isInterviewComplete,
  inputTab,
  setInputTab,
  isProcessingAnswer,
  isSpeaking,
  recognitionSupported,
  recognitionError,
  transcript,
  isRecording,
  textInput,
  setTextInput,
  loading,
  onSpeakStart,
  onSpeakEnd,
  onSendTextMessage,
  onManualSend,
  onResetRecognition,
  onCompleteInterview,
  isCompletingInterview,
}) {
  if (!interviewStarted || isInterviewComplete) return null

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value)
  }

  const handleTextInputPaste = (event) => {
    event.preventDefault()
  }

  const handleTextInputKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onSendTextMessage()
    }
  }

  const getStatusMessage = () => {
    if (isProcessingAnswer) return "Processing your complete answer..."
    if (inputTab === 0) {
      if (isRecording) return "Recording... Speak your complete answer, then release the button"
      if (isSpeaking) return "AI is speaking... Please wait"
      return "Ready to listen - Hold the microphone button to record your answer"
    }
    return "Type your response below (pasting is disabled)"
  }

  const getStatusSeverity = () => {
    if (isProcessingAnswer) return "info"
    if (isRecording) return "success"
    if (isSpeaking) return "warning"
    return "info"
  }

  return (
    <Card sx={{ mt: 2, bgcolor: "white", boxShadow: 2, border: "1px solid #e2e8f0" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header with Tabs and Microphone Button */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Tabs
            value={inputTab}
            onChange={(e, newValue) => setInputTab(newValue)}
            sx={{
              minHeight: 48,
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                px: 3,
              },
            }}
          >
            <Tab
              icon={<Mic />}
              label="Voice Input"
              disabled={!recognitionSupported || isSpeaking}
              sx={{ color: "#1e293b" }}
            />
            <Tab icon={<Keyboard />} label="Text Input" disabled={isSpeaking} sx={{ color: "#1e293b" }} />
          </Tabs>

          {/* Microphone Button in Header - Only show on Voice Input tab */}
          {inputTab === 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={onResetRecognition}
                disabled={isProcessingAnswer || isRecording}
                startIcon={<Refresh />}
                sx={{
                  borderColor: "#6b7280",
                  color: "#6b7280",
                  "&:hover": { borderColor: "#374151", bgcolor: "#f9fafb" },
                }}
              >
                Reset
              </Button>

              <Fab
                size="medium"
                color={isRecording ? "error" : "primary"}
                disabled={isSpeaking || loading || !recognitionSupported || isProcessingAnswer}
                onMouseDown={onSpeakStart}
                onMouseUp={onSpeakEnd}
                onMouseLeave={onSpeakEnd}
                onTouchStart={onSpeakStart}
                onTouchEnd={onSpeakEnd}
                onContextMenu={(e) => e.preventDefault()}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: isRecording ? "#ef4444" : "#3b82f6",
                  boxShadow: isRecording ? "0 0 20px rgba(239, 68, 68, 0.5)" : "0 4px 15px rgba(59, 130, 246, 0.3)",
                  transform: isRecording ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: isRecording ? "scale(1.1)" : "scale(1.05)",
                    bgcolor: isRecording ? "#dc2626" : "#2563eb",
                    boxShadow: isRecording ? "0 0 25px rgba(239, 68, 68, 0.7)" : "0 6px 20px rgba(59, 130, 246, 0.4)",
                  },
                  "&:disabled": {
                    bgcolor: "#94a3b8",
                    transform: "scale(1)",
                    boxShadow: "none",
                  },
                }}
              >
                {isRecording ? (
                  <Stop sx={{ fontSize: 24, color: "white" }} />
                ) : (
                  <Mic sx={{ fontSize: 24, color: "white" }} />
                )}
              </Fab>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Status Alert */}
        <Alert
          severity={getStatusSeverity()}
          sx={{
            mb: 3,
            borderRadius: 2,
            bgcolor: isProcessingAnswer ? "#e0f2fe" : isRecording ? "#e8f5e8" : isSpeaking ? "#fef3c7" : "#eff6ff",
            border: "1px solid",
            borderColor: isProcessingAnswer ? "#0288d1" : isRecording ? "#4caf50" : isSpeaking ? "#f59e0b" : "#3b82f6",
            "& .MuiAlert-icon": {
              color: isProcessingAnswer ? "#0288d1" : isRecording ? "#4caf50" : isSpeaking ? "#f59e0b" : "#3b82f6",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isProcessingAnswer ? (
              <HourglassEmpty />
            ) : inputTab === 0 ? (
              isRecording ? (
                <FiberManualRecord />
              ) : (
                <MicOff />
              )
            ) : (
              <Keyboard />
            )}
            <Typography variant="body2" fontWeight="500" color="#1e293b">
              {getStatusMessage()}
            </Typography>
          </Box>
        </Alert>

        {/* Recognition Error */}
        {recognitionError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              bgcolor: "#fee2e2",
              border: "1px solid #ef4444",
              "& .MuiAlert-icon": { color: "#ef4444" },
            }}
            action={
              <Button size="small" onClick={onResetRecognition} sx={{ color: "#ef4444" }}>
                Reset
              </Button>
            }
          >
            <Typography variant="body2" color="#1e293b">
              {recognitionError}
            </Typography>
          </Alert>
        )}

        {/* Voice Input Tab */}
        {inputTab === 0 && (
          <Box>
            {/* Transcript Display */}
            {transcript && (
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: isRecording ? "#e8f5e8" : isProcessingAnswer ? "#e0f2fe" : "#ecfdf5",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: isRecording ? "#4caf50" : isProcessingAnswer ? "#0288d1" : "#10b981",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color={isRecording ? "#2e7d32" : isProcessingAnswer ? "#0277bd" : "#065f46"}
                    fontWeight="600"
                  >
                    {isRecording
                      ? "Recording your answer:"
                      : isProcessingAnswer
                        ? "Processing response:"
                        : "Answer ready:"}
                  </Typography>
                  {!isRecording && !isProcessingAnswer && transcript && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Send />}
                      onClick={onManualSend}
                      disabled={loading}
                      sx={{
                        bgcolor: "#10b981",
                        "&:hover": { bgcolor: "#059669" },
                        color: "white",
                      }}
                    >
                      Send Answer
                    </Button>
                  )}
                </Box>
                <Typography variant="body1" sx={{ fontStyle: "italic", color: "#1e293b", lineHeight: 1.6 }}>
                  "{transcript}"
                </Typography>
              </Paper>
            )}

            {/* Recording Progress */}
            {isRecording && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "#e8f5e8",
                    "& .MuiLinearProgress-bar": { bgcolor: "#4caf50" },
                  }}
                />
                <Typography variant="caption" color="#4caf50" sx={{ mt: 1, display: "block", textAlign: "center" }}>
                  🔴 Recording in progress... Speak clearly and release when finished
                </Typography>
              </Box>
            )}

            {/* Voice Input Instructions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                bgcolor: "#f8fafc",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
              }}
            >
              <Box sx={{ textAlign: "center", maxWidth: 400 }}>
                <Typography variant="h6" color="#1e293b" gutterBottom fontWeight="600">
                  {isRecording ? "Recording Your Answer" : "Ready to Record"}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {isRecording
                    ? "Keep holding the microphone button and speak clearly. Release when you're finished."
                    : "Click and hold the microphone button in the top right to start recording your answer."}
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  {isRecording ? "🔴 Recording..." : "💡 Tip: Speak clearly and at a normal pace"}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Text Input Tab */}
        {inputTab === 1 && (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={textInput}
              onChange={handleTextInputChange}
              onPaste={handleTextInputPaste}
              onKeyPress={handleTextInputKeyPress}
              placeholder="Type your complete response here... (Press Enter to send, Shift+Enter for new line)"
              disabled={isSpeaking || loading || isProcessingAnswer}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                  fontSize: "1rem",
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={onSendTextMessage}
                      disabled={!textInput.trim() || loading || isProcessingAnswer}
                      sx={{
                        color: "#3b82f6",
                        "&:disabled": { color: "#94a3b8" },
                      }}
                    >
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary">
                Type your complete response. Pasting is disabled to ensure authenticity.
              </Typography>
              <Button
                variant="contained"
                onClick={onSendTextMessage}
                disabled={!textInput.trim() || loading || isProcessingAnswer}
                sx={{
                  bgcolor: "#10b981",
                  "&:hover": { bgcolor: "#059669" },
                  "&:disabled": { bgcolor: "#94a3b8" },
                }}
              >
                Send Answer
              </Button>
            </Box>
          </Box>
        )}

        {!recognitionSupported && inputTab === 0 && (
          <Alert severity="error" sx={{ mt: 2, bgcolor: "#fee2e2", border: "1px solid #ef4444" }}>
            <Typography variant="body2" color="#1e293b">
              Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or switch to text
              input.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
