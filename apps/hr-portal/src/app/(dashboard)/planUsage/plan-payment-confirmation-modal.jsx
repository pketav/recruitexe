"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material"
import {
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material"
import { useState } from "react"

const PlanPaymentConfirmationModal = ({ open, onClose, planData, onConfirmPurchase }) => {
  const [paymentLoading, setPaymentLoading] = useState(false)

  if (!planData) return null

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatDuration = (days) => {
    const months = Math.floor(days / 30)
    if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`
    } else {
      return `${days} day${days > 1 ? "s" : ""}`
    }
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  const handleConfirmPayment = async () => {
    setPaymentLoading(true)
    try {
      await onConfirmPurchase()
    } catch (error) {
      console.error("Payment confirmation failed:", error)
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleCloseModal = () => {
    if (!paymentLoading) {
      onClose()
    }
  }

  const subtotal = planData.planPrice
  const gstRate = 18
  const gstAmount = (subtotal * gstRate) / (100 + gstRate)
  const baseAmount = subtotal - gstAmount

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={paymentLoading}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          background: "#ffffff",
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1, textAlign: "center" }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <PaymentIcon sx={{ fontSize: 32, color: "white" }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
          Confirm Plan Upgrade
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          You're about to upgrade to {planData.planName}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        {/* Plan Details Card */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
            color: "white",
            borderRadius: "16px",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <StarIcon sx={{ fontSize: 24, color: "white" }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
                {planData.planName}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 2, lineHeight: 1.6 }}>
              {planData.planDescription}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)", display: "block" }}>
                  Plan Duration
                </Typography>
                <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                  {formatDuration(planData.planDurationInDays)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)", display: "block" }}>
                  Plan Price
                </Typography>
                <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                  {formatPrice(planData.planPrice)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card sx={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: "#1e293b", mb: 2, fontWeight: 600 }}>
              Plan Features
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: "#10b981" }} />
                <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
                  {formatNumber(planData.NumberOfJobPosts)} Job Posts
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: "#10b981" }} />
                <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
                  {formatNumber(planData.NumberOfUsers)} Team Members
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: "#10b981" }} />
                <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
                  {formatNumber(planData.NumberofAnalizers)} AI Resume Analysis
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: "#10b981" }} />
                <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
                  {formatNumber(planData.planCreditLimit)} Monthly Credits
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                Payment Summary
              </Typography>
              <Chip
                label="Secure Payment"
                size="small"
                icon={<SecurityIcon sx={{ fontSize: 14 }} />}
                sx={{
                  background: "#10b981",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Subtotal:
              </Typography>
              <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                {formatPrice(baseAmount)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                GST (18%):
              </Typography>
              <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                {formatPrice(gstAmount)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 2,
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 600 }}>
                Total Amount
              </Typography>
              <Typography variant="h5" sx={{ color: "#2563eb", fontWeight: 700 }}>
                {formatPrice(subtotal)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ borderRadius: "12px", mb: 2 }}>
          <Typography variant="body2">
            You will be redirected to a secure payment gateway to complete your plan upgrade.
          </Typography>
        </Alert>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <SecurityIcon sx={{ fontSize: 16, color: "#10b981" }} />
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Your payment is secured with bank-grade encryption
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleCloseModal}
          disabled={paymentLoading}
          sx={{
            color: "#64748b",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmPayment}
          disabled={paymentLoading}
          startIcon={paymentLoading ? <CircularProgress size={16} /> : <PaymentIcon />}
          sx={{
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          {paymentLoading ? "Processing..." : "Proceed to Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PlanPaymentConfirmationModal
