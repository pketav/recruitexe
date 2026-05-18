"use client"
import { usePlanStatus } from "../hooks/usePlanStatus"
import { Alert, AlertTitle, Typography, Button } from "@mui/material"
import { Warning as WarningIcon, Info as InfoIcon } from "@mui/icons-material"

const PlanUsageAlert = () => {
  const { planDetails, usage, isPlanExpired } = usePlanStatus()

  if (!usage || !planDetails) return null

  const getUsagePercentage = (usageString) => {
    const match = usageString.match(/(\d+(?:\.\d+)?)%/)
    return match ? Number.parseFloat(match[1]) : 0
  }

  const jobPostPercentage = getUsagePercentage(usage.jobPostUsagePercentage)
  const userPercentage = getUsagePercentage(usage.userUsagePercentage)
  const analyzerPercentage = getUsagePercentage(usage.analyzerUsagePercentage)

  const highUsageThreshold = 80
  const warningUsageThreshold = 90

  const getHighestUsage = () => {
    const usages = [
      { name: "Job Posts", percentage: jobPostPercentage, usage: usage.jobPostUsage },
      { name: "Users", percentage: userPercentage, usage: usage.userUsage },
      { name: "Analyzer", percentage: analyzerPercentage, usage: usage.analyzerUsage },
    ]
    return usages.reduce((max, current) => (current.percentage > max.percentage ? current : max))
  }

  const highestUsage = getHighestUsage()

  if (isPlanExpired) return null

  if (highestUsage.percentage >= warningUsageThreshold) {
    return (
      <Alert
        severity="warning"
        icon={<WarningIcon />}
        sx={{ mb: 2, borderRadius: 2 }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => (window.location.href = "mailto:admin@yourcompany.com?subject=Plan Upgrade Request")}
          >
            Contact Admin
          </Button>
        }
      >
        <AlertTitle>High Usage Warning</AlertTitle>
        <Typography variant="body2">
          Your {highestUsage.name} usage is at {highestUsage.percentage.toFixed(1)}% ({highestUsage.usage}). Consider
          upgrading your plan to avoid service interruption.
        </Typography>
      </Alert>
    )
  }

  if (highestUsage.percentage >= highUsageThreshold) {
    return (
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2, borderRadius: 2 }}>
        <AlertTitle>Usage Notice</AlertTitle>
        <Typography variant="body2">
          Your {highestUsage.name} usage is at {highestUsage.percentage.toFixed(1)}% ({highestUsage.usage}). You may
          want to monitor your usage or consider upgrading your plan.
        </Typography>
      </Alert>
    )
  }

  return null
}

export default PlanUsageAlert
