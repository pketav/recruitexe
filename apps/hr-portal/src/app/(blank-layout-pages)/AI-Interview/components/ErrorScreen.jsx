"use client"
import { Box, Card, CardContent, Typography, Button } from "@mui/material"
import { Warning } from "@mui/icons-material"

export default function ErrorScreen({ title, message, showRetry = false, onRetry }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", textAlign: "center", boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Warning color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.primary">
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: showRetry ? 3 : 0 }}>
            {message}
          </Typography>
          {showRetry && (
            <Button
              variant="contained"
              onClick={onRetry}
              sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}
            >
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
