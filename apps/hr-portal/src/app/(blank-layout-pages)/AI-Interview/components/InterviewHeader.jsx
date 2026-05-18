import { Card, CardContent, Grid, Box, Avatar, Typography, Chip } from "@mui/material"
import { Business, CheckCircle } from "@mui/icons-material"
import { formatTime } from "@core/utils/timeUtils"

export default function InterviewHeader({ timeElapsed, isComplete }) {
  return (
    <Card sx={{ mb: 3, bgcolor: "white", boxShadow: 2, border: "1px solid #e2e8f0" }}>
      <CardContent>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: isComplete ? "#10b981" : "#3b82f6" }}>
                {isComplete ? (
                  <CheckCircle sx={{ fontSize: 28, color: "white" }} />
                ) : (
                  <Business sx={{ fontSize: 28, color: "white" }} />
                )}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#1e293b">
                  RecruitExe AI
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {isComplete ? "Interview Completed Successfully" : "AI-Powered Interview Platform"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            {isComplete ? (
              <Chip
                label="COMPLETED"
                color="success"
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  px: 2,
                  py: 1,
                }}
              />
            ) : (
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="h6" fontWeight="bold" color="#1e293b">
                  {formatTime(timeElapsed)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Interview Duration
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
