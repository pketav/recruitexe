"use client"

import { Card, CardContent, Typography, Box, Button, Avatar, IconButton } from "@mui/material"
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  ChangeCircle as ChangeCircleIcon,
  Schedule as ScheduleIcon,
  CurrencyRupee as CurrencyRupeeIcon,
} from "@mui/icons-material"

const PlanDetailsCard = ({ planDetails, onUpgrade, onRefresh, loading }) => {
  const formatDuration = (days) => {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    if (months > 0 && remainingDays > 0) {
      return `${months} month${months > 1 ? "s" : ""} ${remainingDays} day${remainingDays > 1 ? "s" : ""}`
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`
    } else {
      return `${days} day${days > 1 ? "s" : ""}`
    }
  }

  return (
    <Card sx={{ background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)", color: "white", height: "100%" }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            >
              <StarIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ color: "white", mb: 0.5, fontWeight: 600 }}>
                {planDetails.planName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: "#34d399" }} />
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                  {planDetails.isActive ? "Active Plan" : "Inactive Plan"}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={onRefresh}
            disabled={loading}
            sx={{
              color: "white",
              background: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <RefreshIcon
              sx={{
                animation: loading ? "spin 1s linear infinite" : "none",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
          </IconButton>
        </Box>

        <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 3, lineHeight: 1.6 }}>
          {planDetails.planDescription}
        </Typography>

        <Box sx={{ display: "flex", gap: 4, mb: 3, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CurrencyRupeeIcon sx={{ fontSize: 20, color: "#34d399" }} />
            <Box>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)", display: "block" }}>
                Plan Price
              </Typography>
              <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                {planDetails.planPrice}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ScheduleIcon sx={{ fontSize: 20, color: "#34d399" }} />
            <Box>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)", display: "block" }}>
                Duration
              </Typography>
              <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                {formatDuration(planDetails.planDurationInDays)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<ChangeCircleIcon />}
          onClick={onUpgrade}
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
          Change Plan
        </Button>
      </CardContent>
    </Card>
  )
}

export default PlanDetailsCard
