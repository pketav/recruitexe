import { Card, CardContent, Box, Typography, Chip } from "@mui/material"
import { AccessTime } from "@mui/icons-material"
import { formatTimeUntilStart } from "@core/utils/timeUtils"

export default function ScheduleStatus({ scheduleValidation }) {
  if (!scheduleValidation.message) return null

  return (
    <Card sx={{ mb: 3, bgcolor: "white", boxShadow: 2, border: "1px solid #e2e8f0" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AccessTime
            color={
              scheduleValidation.isLate && !scheduleValidation.canStart
                ? "error"
                : scheduleValidation.canStart
                  ? "success"
                  : scheduleValidation.timeUntilStart > 0
                    ? "warning"
                    : "error"
            }
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="#1e293b">
              Interview Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {scheduleValidation.message}
            </Typography>
            {scheduleValidation.timeUntilStart > 0 && (
              <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                Time until start: {formatTimeUntilStart(scheduleValidation.timeUntilStart)}
              </Typography>
            )}
            {scheduleValidation.isLate && scheduleValidation.canStart && (
              <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                ⚠️ You are {scheduleValidation.minutesLate} minutes late, but still within the 15-minute buffer
              </Typography>
            )}
            {scheduleValidation.isLate && !scheduleValidation.canStart && (
              <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                ❌ You are {scheduleValidation.minutesLate} minutes late (beyond 15-minute buffer)
              </Typography>
            )}
            {scheduleValidation.isEarly && (
              <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                ⏰ You are {scheduleValidation.timeUntilStart} minutes early. Please wait until the scheduled time.
              </Typography>
            )}
            <Typography variant="caption" color="success.main" sx={{ mt: 1, display: "block" }}>
              ✓ Schedule verified from server
            </Typography>
          </Box>
          <Chip
            label={
              scheduleValidation.isLate && !scheduleValidation.canStart
                ? "Time Passed"
                : scheduleValidation.canStart
                  ? "Ready to Start"
                  : "Please Wait"
            }
            color={
              scheduleValidation.isLate && !scheduleValidation.canStart
                ? "error"
                : scheduleValidation.canStart
                  ? "success"
                  : "warning"
            }
          />
        </Box>
      </CardContent>
    </Card>
  )
}
