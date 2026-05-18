"use client"
import { Card, CardContent, Typography, Box, Button, Avatar } from "@mui/material"
import { Psychology as PsychologyIcon, CheckCircle as CheckCircleIcon, Add as AddIcon } from "@mui/icons-material"

const AICreditsCard = ({ aiCredits, onBuyCredits, loading }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num)
  }
  return (
    <Card sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)", color: "white", height: "100%" }}>
      <CardContent sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
          >
            <PsychologyIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: "white", mb: 0.5, fontWeight: 600 }}>
              AI Add-on Credits
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: "#34d399" }} />
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                Extra Analysis Credits
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 3, lineHeight: 1.6, flex: 1 }}>
          Purchase additional AI credits to extend your analysis capabilities beyond your plan limits.
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PsychologyIcon sx={{ fontSize: 20, color: "#34d399" }} />
            <Box>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)", display: "block" }}>
                Current Add-on Credits
              </Typography>
              <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                {formatNumber(aiCredits || 0)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onBuyCredits}
          disabled={loading}
          sx={{
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            fontWeight: 600,
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          Buy More AI Credits
        </Button>
      </CardContent>
    </Card>
  )
}
export default AICreditsCard
