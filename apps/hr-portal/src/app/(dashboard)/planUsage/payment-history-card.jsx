"use client"

import { Card, CardContent, Typography, Box, Chip, Avatar, IconButton, Tooltip } from "@mui/material"
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Receipt as ReceiptIcon,
  Psychology as PsychologyIcon,
  Star as StarIcon,
  Download as DownloadIcon,
} from "@mui/icons-material"

const PaymentHistoryCard = ({ payment, onViewDetails, onDownloadInvoice }) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "#10b981"
      case "pending":
      case "initiated":
        return "#f59e0b"
      case "failed":
      case "error":
        return "#ef4444"
      default:
        return "#64748b"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return <CheckCircleIcon sx={{ fontSize: 16 }} />
      case "pending":
      case "initiated":
        return <ScheduleIcon sx={{ fontSize: 16 }} />
      case "failed":
      case "error":
        return <ErrorIcon sx={{ fontSize: 16 }} />
      default:
        return <ScheduleIcon sx={{ fontSize: 16 }} />
    }
  }

  const isPlanType = payment.planType === "Plan"
  const isAIPlan = payment.planType === "AIPlan"

  return (
    <Card
      sx={{
        borderRadius: "12px",
        border: "1px solid #f1f5f9",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: isPlanType
                  ? "linear-gradient(135deg, #2563eb, #3b82f6)"
                  : "linear-gradient(135deg, #8b5cf6, #a855f7)",
                color: "white",
              }}
            >
              {isPlanType ? <StarIcon sx={{ fontSize: 20 }} /> : <PsychologyIcon sx={{ fontSize: 20 }} />}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                {isPlanType
                  ? payment.planId?.planName || "Plan Subscription"
                  : payment.aiCreditPlanId?.name || "AI Credits"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Order ID: {payment.orderId}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={getStatusIcon(payment.paymentStatus)}
            label={payment.paymentStatus}
            size="small"
            sx={{
              background: `${getStatusColor(payment.paymentStatus)}15`,
              color: getStatusColor(payment.paymentStatus),
              fontWeight: 600,
              border: `1px solid ${getStatusColor(payment.paymentStatus)}25`,
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
              {formatPrice(payment.Amount)}
            </Typography>
            {isAIPlan && payment.numberOfCredits > 0 && (
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {formatNumber(payment.numberOfCredits)} Credits
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
              {payment.paymentDate ? "Paid on" : "Created on"}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: "#1e293b" }}>
              {formatDate(payment.paymentDate || payment.createdAt)}
            </Typography>
          </Box>
        </Box>

        {payment.transactionId && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Transaction ID: {payment.transactionId}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Download Invoice">
                <IconButton
                  size="small"
                  onClick={() => onDownloadInvoice(payment)}
                  sx={{ color: "#10b981" }}
                  disabled={payment.paymentStatus !== "success"}
                >
                  <DownloadIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Details">
                <IconButton size="small" onClick={() => onViewDetails(payment)} sx={{ color: "#64748b" }}>
                  <ReceiptIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default PaymentHistoryCard
