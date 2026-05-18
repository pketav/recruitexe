"use client"

import { Box, Typography, Card, CardContent, Button, Avatar, Alert } from "@mui/material"
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Home as HomeIcon,
  Psychology as PsychologyIcon,
  Star as StarIcon,
} from "@mui/icons-material"

const PaymentSuccess = ({ onGoHome, paymentDetails }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  // Detect transaction type based on paymentDetails
  const isAICreditsTransaction = paymentDetails?.credits && paymentDetails.credits > 0
  const isPlanTransaction = !isAICreditsTransaction

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <Card sx={{ p: 4, textAlign: "center", width: "100%", maxWidth: 600 }}>
        {paymentDetails?.success ? (
          <>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: "linear-gradient(135deg, #10b981, #34d399)",
                mx: "auto",
                mb: 3,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" sx={{ color: "#1e293b", mb: 2, fontWeight: 700 }}>
              Payment Successful!
            </Typography>

            {/* Conditional success message based on transaction type */}
            {isAICreditsTransaction ? (
              <>
                <Typography variant="body1" sx={{ color: "#64748b", mb: 4 }}>
                  Your AI credits have been successfully added to your account.
                </Typography>

                <Card
                  sx={{
                    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
                    color: "white",
                    mb: 4,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 2 }}>
                      <PsychologyIcon sx={{ fontSize: 24 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        AI Credits Added
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      +{formatNumber(paymentDetails.credits || 0)} Credits
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Ready to use for AI resume analysis
                    </Typography>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ color: "#64748b", mb: 4 }}>
                  Your plan has been successfully upgraded. You now have access to enhanced features.
                </Typography>

                <Card
                  sx={{
                    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                    color: "white",
                    mb: 4,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 2 }}>
                      <StarIcon sx={{ fontSize: 24 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Plan Upgraded Successfully
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      New Plan Active
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Enhanced features are now available
                    </Typography>
                  </CardContent>
                </Card>
              </>
            )}

            <Card sx={{ mb: 4, background: "#f8fafc" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: "#1e293b", mb: 2, fontWeight: 600 }}>
                  Transaction Details
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Transaction ID:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>
                      {paymentDetails.transactionId}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Amount Paid:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>
                      {formatPrice(paymentDetails.amount)}
                    </Typography>
                  </Box>

                  {/* Show credits only for AI credits transactions */}
                  {isAICreditsTransaction && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Credits Purchased:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>
                        {formatNumber(paymentDetails.credits)} Credits
                      </Typography>
                    </Box>
                  )}

                  {/* Show plan details for plan transactions */}
                  {isPlanTransaction && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Transaction Type:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>
                        Plan Upgrade
                      </Typography>
                    </Box>
                  )}

                  {paymentDetails.respDate && paymentDetails.respTime && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Date & Time:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>
                        {paymentDetails.respDate} at {paymentDetails.respTime}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={onGoHome}
              sx={{
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: "linear-gradient(135deg, #ef4444, #f87171)",
                mx: "auto",
                mb: 3,
              }}
            >
              <ErrorIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" sx={{ color: "#ef4444", mb: 2, fontWeight: 700 }}>
              Payment Failed
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", mb: 4 }}>
              We couldn't process your payment. Please try again or contact support.
            </Typography>

            <Alert severity="error" sx={{ mb: 4, borderRadius: "12px" }}>
              <Typography variant="body2">
                If you were charged, please contact our support team with transaction ID:{" "}
                {paymentDetails?.transactionId}
              </Typography>
            </Alert>

            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={onGoHome}
              sx={{
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Continue
            </Button>
          </>
        )}
      </Card>
    </Box>
  )
}

export default PaymentSuccess
