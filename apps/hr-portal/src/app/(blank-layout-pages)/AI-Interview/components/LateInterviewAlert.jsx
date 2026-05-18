"use client"
import { Card, CardContent, Alert, Box, Typography, Button } from "@mui/material"
import { Error, ContactSupport, Refresh } from "@mui/icons-material"

export default function LateInterviewAlert({ scheduleValidation }) {
  if (!scheduleValidation.isLate || scheduleValidation.canStart) return null

  return (
    <Card sx={{ mb: 3, bgcolor: "#fef2f2", boxShadow: 2, border: "2px solid #fca5a5" }}>
      <CardContent>
        <Alert
          severity="error"
          sx={{
            bgcolor: "transparent",
            border: "none",
            "& .MuiAlert-icon": { color: "#dc2626" },
          }}
          icon={<Error sx={{ fontSize: 32 }} />}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="#dc2626" gutterBottom>
                Interview Time Has Passed
              </Typography>
              <Typography variant="body1" color="#7f1d1d" sx={{ mb: 2 }}>
                You are {scheduleValidation.minutesLate} minutes late for your scheduled interview. The 15-minute buffer
                time has expired.
              </Typography>
              <Typography variant="body2" color="#7f1d1d" sx={{ mb: 3 }}>
                Please contact your HR representative or administrator to reschedule your interview.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<ContactSupport />}
                  sx={{
                    bgcolor: "#dc2626",
                    "&:hover": { bgcolor: "#b91c1c" },
                    color: "white",
                  }}
                  onClick={() => {
                    window.location.href = "mailto:hr@company.com?subject=Interview Reschedule Request"
                  }}
                >
                  Contact HR
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  sx={{
                    borderColor: "#dc2626",
                    color: "#dc2626",
                    "&:hover": { borderColor: "#b91c1c", bgcolor: "#fef2f2" },
                  }}
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </Box>
            </Box>
          </Box>
        </Alert>
      </CardContent>
    </Card>
  )
}
