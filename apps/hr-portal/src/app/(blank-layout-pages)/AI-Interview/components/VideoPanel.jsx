"use client"
import { Card, CardContent, Typography, Box, Button, Chip, CircularProgress } from "@mui/material"
import {
  Videocam,
  VideocamOff,
  Schedule,
  Warning,
  Psychology,
  CheckCircle,
  Error,
  ContactSupport,
  ExitToApp,
  VolumeUp,
  VolumeOff,
  Refresh,
} from "@mui/icons-material"

export default function VideoPanel({
  videoRef,
  cameraPermission,
  currentStep,
  scheduleValidation,
  interviewStarted,
  isInterviewComplete,
  recognitionSupported,
  recognitionError,
  loading,
  isVideoRecording,
  uploadingVideo,
  videoUploadProgress,
  isCompletingInterview,
  isSpeaking,
  isProcessingAnswer,
  isRecording,
  inputTab,
  timeElapsed,
  durationMinutes,
  onSetupPermissions,
  onStartInterview,
  onCompleteInterview,
  onStopSpeaking,
  onResetRecognition,
}) {
  const getStatusChip = () => {
    if (isCompletingInterview) return { label: "Completing Interview...", color: "warning" }
    if (uploadingVideo) return { label: `Uploading Video ${videoUploadProgress}%`, color: "info" }
    if (isSpeaking) return { label: "AI Speaking", color: "primary" }
    if (isProcessingAnswer) return { label: "Processing Answer", color: "secondary" }
    if (isRecording) return { label: "Recording Your Voice", color: "error" }
    if (inputTab === 0) return { label: "Ready to Listen", color: "success" }
    return { label: "Ready to Type", color: "success" }
  }
  const statusChip = getStatusChip()
  return (
    <Card sx={{ mb: 3, bgcolor: "white", boxShadow: 2, border: "1px solid #e2e8f0" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, color: "#1e293b" }}>
          <Videocam color="primary" />
          Candidate Video
        </Typography>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 300,
            bgcolor: "#1e293b",
            borderRadius: 2,
            overflow: "hidden",
            border: "2px solid #e2e8f0",
            mb: 3,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {!cameraPermission && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(30, 41, 59, 0.9)",
                color: "white",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <VideocamOff sx={{ fontSize: 48 }} />
              <Typography>Camera access required</Typography>
            </Box>
          )}
        </Box>
        {/* Interview Status */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom color="#1e293b">
            Interview Status
          </Typography>
          {currentStep === 0 && (
            <Box>
              <Schedule color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom color="#1e293b">
                Ready to Begin
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Welcome to your AI interview. Click below to start the process.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={onSetupPermissions}
                sx={{ borderRadius: 3, bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}
              >
                Start Interview Process
              </Button>
            </Box>
          )}
          {currentStep === 1 && (
            <Box>
              <Warning color="warning" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom color="#1e293b">
                Setup Required
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please allow camera and microphone access to continue.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={onSetupPermissions}
                sx={{ borderRadius: 3, bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}
              >
                Setup Camera & Mic
              </Button>
            </Box>
          )}
          {currentStep === 2 && !interviewStarted && (
            <Box>
              {scheduleValidation.isLate && !scheduleValidation.canStart ? (
                <>
                  <Error color="error" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom color="#dc2626">
                    Interview Time Expired
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    The interview time has passed beyond the allowed buffer. Please reschedule.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ContactSupport />}
                    sx={{ borderRadius: 3, bgcolor: "#dc2626", "&:hover": { bgcolor: "#b91c1c" } }}
                    onClick={() => {
                      window.location.href = "mailto:hr@company.com?subject=Interview Reschedule Request"
                    }}
                  >
                    Contact HR to Reschedule
                  </Button>
                </>
              ) : (
                <>
                  <Psychology color="success" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom color="#1e293b">
                    Ready to Interview
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Everything is set up. Click to begin your AI interview.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onStartInterview}
                    disabled={loading || !scheduleValidation.canStart}
                    sx={{ borderRadius: 3, bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Begin Interview"}
                  </Button>
                </>
              )}
            </Box>
          )}
          {currentStep === 2 && interviewStarted && !isInterviewComplete && (
            <Box>
              <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={(timeElapsed / (durationMinutes * 60)) * 100}
                  size={80}
                  thickness={4}
                  sx={{ color: "#3b82f6" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="#1e293b">
                    {Math.round((timeElapsed / (durationMinutes * 60)) * 100)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" gutterBottom color="#1e293b">
                Interview in Progress
              </Typography>
              {isVideoRecording && <Chip label="🔴 Recording" color="error" sx={{ mb: 1, fontWeight: "bold" }} />}
              <Chip label={statusChip.label} color={statusChip.color} sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={isSpeaking ? onStopSpeaking : () => {}}
                  disabled={!isSpeaking}
                  sx={{ minWidth: 40 }}
                >
                  {isSpeaking ? <VolumeOff /> : <VolumeUp />}
                </Button>
                <Button
                  variant="outlined"
                  onClick={onResetRecognition}
                  disabled={isProcessingAnswer}
                  sx={{ minWidth: 40 }}
                >
                  <Refresh />
                </Button>
              </Box>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<ExitToApp />}
                onClick={onCompleteInterview}
                disabled={isCompletingInterview || uploadingVideo}
                sx={{
                  borderColor: "#f59e0b",
                  color: "#f59e0b",
                  "&:hover": { borderColor: "#d97706", bgcolor: "#fef3c7" },
                }}
              >
                Complete Interview Early
              </Button>
            </Box>
          )}
          {currentStep === 3 && (
            <Box>
              <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom color="#1e293b">
                Interview Complete
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thank you for completing the interview. Your responses have been recorded.
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}