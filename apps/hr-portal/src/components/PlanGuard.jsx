"use client"
import { usePlanStatus } from "../@core/hooks/usePlanStatus"
import PlanExpiredScreen from "./PlanExpiredScreen"
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material"

const PlanGuard = ({ children }) => {
  const { planDetails, isLoading, error, isPlanExpired, refetch } = usePlanStatus()

  // Show loading state
  // if (isLoading) {
  //   return (
  //     <Box
  //       sx={{
  //         minHeight: "100vh",
  //         bgcolor: "#fafafa",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <Card sx={{ maxWidth: 400, width: "100%" }}>
  //         <CardContent
  //           sx={{
  //             display: "flex",
  //             flexDirection: "column",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             py: 6,
  //           }}
  //         >
  //           <CircularProgress size={32} sx={{ color: "primary.main", mb: 2 }} />
  //           <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
  //             Checking your plan status...
  //           </Typography>
  //         </CardContent>
  //       </Card>
  //     </Box>
  //   )
  // }

  // Show error state (but allow access - you might want to handle this differently)
  if (error) {
    console.error("Plan status error:", error)
    // You might want to show an error screen or allow access with a warning
    // For now, we'll allow access but log the error
  }

  // Show expired screen if plan is expired
  if (isPlanExpired) {
    return <PlanExpiredScreen planName={planDetails?.planName} onRetry={refetch} isRetrying={isLoading} />
  }

  // Plan is active, render children
  return <>{children}</>
}

export default PlanGuard
