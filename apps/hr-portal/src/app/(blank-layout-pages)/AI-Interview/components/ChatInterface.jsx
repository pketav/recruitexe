import { Card, CardContent, Box, Avatar, Typography, Paper, CircularProgress, Grid, Chip } from "@mui/material"
import { Person, Mic, Keyboard, Schedule, Block } from "@mui/icons-material"

export default function ChatInterface({
  messages,
  loading,
  isProcessingAnswer,
  currentStep,
  durationMinutes,
  messagesEndRef,
}) {
  return (
    <Card
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        boxShadow: 2,
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Header */}
      <CardContent sx={{ pb: 2, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: "#3b82f6" }}>
            <Person sx={{ color: "white" }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600" color="#1e293b">
              RecruitExe AI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isProcessingAnswer
                ? "Processing your answer..."
                : loading
                  ? "Generating response..."
                  : "Your AI Interview Assistant"}
            </Typography>
          </Box>
          {(loading || isProcessingAnswer) && <CircularProgress size={20} sx={{ ml: "auto", color: "#3b82f6" }} />}
        </Box>
      </CardContent>

      {/* Messages Area */}
      <CardContent sx={{ flex: 1, overflow: "hidden", p: 0 }}>
        <Box sx={{ height: "100%", overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          {currentStep < 2 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#3b82f6",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Person sx={{ fontSize: 50, color: "white" }} />
              </Avatar>
              <Typography variant="h5" gutterBottom fontWeight="bold" color="#1e293b">
                Welcome to RecruitExe AI
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: "auto", mb: 3 }}>
                I'm your AI interview assistant. I'll be conducting your interview today using advanced voice
                recognition and natural conversation.
              </Typography>
              <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", bgcolor: "#eff6ff", border: "1px solid #bfdbfe" }}>
                <Typography variant="h6" gutterBottom color="#1e40af">
                  Interview Instructions:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Mic color="primary" />
                      <Typography variant="body2" color="#1e293b">
                        <strong>Voice input</strong> - Hold button to speak
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Keyboard color="primary" />
                      <Typography variant="body2" color="#1e293b">
                        <strong>Text input</strong> - Type your responses
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Block color="error" />
                      <Typography variant="body2" color="#1e293b">
                        <strong>No pasting</strong> - Type only, no copy-paste
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Schedule color="primary" />
                      <Typography variant="body2" color="#1e293b">
                        <strong>Duration:</strong> {durationMinutes} minutes
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          ) : (
            <>
              {messages.map((message) => (
                <Box key={message.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: message.type === "user" ? "#10b981" : "#3b82f6",
                      }}
                    >
                      {message.type === "user" ? (
                        message.inputMethod === "voice" ? (
                          <Mic sx={{ fontSize: 18, color: "white" }} />
                        ) : (
                          <Keyboard sx={{ fontSize: 18, color: "white" }} />
                        )
                      ) : (
                        <Person sx={{ fontSize: 18, color: "white" }} />
                      )}
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="600" color="#1e293b">
                      {message.type === "user" ? "You" : "RecruitExe AI"}
                      {message.type === "user" && message.inputMethod && (
                        <Chip label={message.inputMethod} size="small" sx={{ ml: 1, height: 20, fontSize: "0.7rem" }} />
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ ml: "auto" }}>
                      {message.timestamp}
                    </Typography>
                  </Box>
                  <Paper
                    sx={{
                      p: 3,
                      ml: 5,
                      bgcolor: message.type === "user" ? "#ecfdf5" : "#f8fafc",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: message.type === "user" ? "#a7f3d0" : "#e2e8f0",
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.6, color: "#1e293b" }}>
                      {message.content}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              {(loading || isProcessingAnswer) && (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#3b82f6" }}>
                      <Person sx={{ fontSize: 18, color: "white" }} />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="600" color="#1e293b">
                      RecruitExe AI
                    </Typography>
                  </Box>
                  <Paper sx={{ p: 3, ml: 5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CircularProgress size={20} sx={{ color: "#3b82f6" }} />
                      <Typography variant="body1" color="#1e293b">
                        {isProcessingAnswer ? "Processing your complete answer..." : "Generating response..."}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
