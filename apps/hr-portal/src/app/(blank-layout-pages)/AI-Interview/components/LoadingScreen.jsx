import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material"

export default function LoadingScreen({ title, subtitle }) {
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
          <CircularProgress size={64} sx={{ mb: 2, color: "#3b82f6" }} />
          <Typography variant="h5" gutterBottom color="text.primary">
            {title}
          </Typography>
          <Typography color="text.secondary">{subtitle}</Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
