"use client"
import { usePlanStatus } from "../hooks/usePlanStatus"
import { Card, CardContent, CardHeader, Typography, Chip, LinearProgress, Box, Divider } from "@mui/material"
import { Warning as WarningIcon, CheckCircle as CheckCircleIcon, Schedule as ScheduleIcon } from "@mui/icons-material"

const PlanStatusIndicator = () => {
  const { planDetails, usage, isLoading, isPlanExpired } = usePlanStatus()

  if (isLoading || !planDetails) {
    return null
  }

  const getUsagePercentage = (usageString) => {
    const percentage = usageString.split("/")[0]
    return Number.parseFloat(percentage.replace("%", ""))
  }

  return (
    <Card sx={{ maxWidth: 400, width: "100%" }}>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">Plan Status</Typography>
            <Chip
              icon={isPlanExpired ? <WarningIcon /> : <CheckCircleIcon />}
              label={isPlanExpired ? "Expired" : "Active"}
              color={isPlanExpired ? "error" : "success"}
              size="small"
            />
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "semibold", color: "text.primary", mb: 0.5 }}>
            {planDetails.planName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {planDetails.planDescription}
          </Typography>
        </Box>

        {usage && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Job Posts</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {usage.jobPostUsage}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getUsagePercentage(usage.jobPostUsagePercentage)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Users</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {usage.userUsage}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getUsagePercentage(usage.userUsagePercentage)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Analyzer</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {usage.analyzerUsage}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getUsagePercentage(usage.analyzerUsagePercentage)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ScheduleIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Duration: {planDetails.planDurationInDays} days
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PlanStatusIndicator
