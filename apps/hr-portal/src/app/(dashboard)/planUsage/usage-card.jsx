"use client"

import { Card, CardContent, Typography, Box, LinearProgress, Chip, Avatar } from "@mui/material"
import { Psychology as PsychologyIcon } from "@mui/icons-material"

const UsageCard = ({ title, icon, usage, percentage, color, description, addOnCredits }) => {
  const [current, total] = usage.split("/")
  const percentageValue = Number.parseFloat(percentage.replace("%", ""))

  const getProgressColor = (percent) => {
    if (percent < 50) return "success"
    if (percent < 80) return "warning"
    return "error"
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  return (
    <Card sx={{ height: "100%", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: `linear-gradient(135deg, ${color}15, ${color}25)`,
              color: color,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ color: "#1e293b", mb: 0.5, fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              {description}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Usage
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
              {current} of {total}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percentageValue}
            color={getProgressColor(percentageValue)}
            sx={{
              mb: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#f1f5f9",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              {percentage} used
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              {total - current} remaining
            </Typography>
          </Box>
        </Box>

        {addOnCredits && addOnCredits > 0 && (
          <Card
            sx={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
              color: "white",
              p: 2,
              borderRadius: "12px",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <PsychologyIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Add-on Credits
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              +{formatNumber(addOnCredits)} Credits
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Extra AI analysis credits
            </Typography>
          </Card>
        )}

        <Chip
          label={`${percentage} utilized`}
          size="small"
          sx={{
            background: `${color}15`,
            color: color,
            fontWeight: 600,
            border: `1px solid ${color}25`,
          }}
        />
      </CardContent>
    </Card>
  )
}

export default UsageCard
