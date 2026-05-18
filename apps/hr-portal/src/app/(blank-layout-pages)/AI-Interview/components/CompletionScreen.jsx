import { Box, Container, Card, CardContent, Grid, Typography, Paper, Chip, Avatar } from "@mui/material"
import {
  CheckCircle,
  Assessment,
  Schedule,
  ContactSupport,
  Psychology,
  Mic,
  Keyboard,
  Person,
} from "@mui/icons-material"
import InterviewHeader from "./InterviewHeader"

export default function CompletionScreen({ interviewData, messages }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <InterviewHeader timeElapsed={0} isComplete={true} />

        {/* Completion Status */}
        <Card sx={{ mb: 3, bgcolor: "#f0fdf4", boxShadow: 2, border: "2px solid #10b981" }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: "#10b981", mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" color="#1e293b" gutterBottom>
              Interview Successfully Completed!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Thank you for participating in the RecruitExe AI interview process.
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2, maxWidth: 800, mx: "auto" }}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: "center", bgcolor: "white", border: "1px solid #e2e8f0" }}>
                  <Assessment sx={{ fontSize: 40, color: "#3b82f6", mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="#1e293b">
                    Evaluation Complete
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your responses have been analyzed
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: "center", bgcolor: "white", border: "1px solid #e2e8f0" }}>
                  <Schedule sx={{ fontSize: 40, color: "#f59e0b", mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="#1e293b">
                    Results Processing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Feedback within 2-3 business days
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: "center", bgcolor: "white", border: "1px solid #e2e8f0" }}>
                  <ContactSupport sx={{ fontSize: 40, color: "#8b5cf6", mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="#1e293b">
                    Support Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact HR for any questions
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Interview History */}
        <Card sx={{ bgcolor: "white", boxShadow: 2, border: "1px solid #e2e8f0" }}>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#1e293b"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Psychology color="primary" />
              Interview Conversation History
            </Typography>
            <Box sx={{ maxHeight: "60vh", overflowY: "auto", mt: 2 }}>
              {messages.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                            <Chip
                              label={message.inputMethod}
                              size="small"
                              sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                            />
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
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No conversation history available.
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
