"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material"
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Psychology as PsychologyIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
} from "@mui/icons-material"
import { useState, useEffect } from "react"
import PaymentHistoryCard from "./payment-history-card"

const PaymentHistoryModal = ({ open, onClose, onLoadHistory, onDownloadInvoice, loading }) => {
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentHistory, setPaymentHistory] = useState([])
  const [filteredHistory, setFilteredHistory] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    if (open) {
      loadPaymentHistory()
    }
  }, [open, tabValue])

  useEffect(() => {
    filterPayments()
  }, [paymentHistory, searchTerm, tabValue])

  const loadPaymentHistory = async () => {
    try {
      const planType = tabValue === 0 ? "AIPlan" : "Plan"
      const result = await onLoadHistory(planType)
      if (result && result.items) {
        setPaymentHistory(result.items)
      }
    } catch (error) {
      console.error("Error loading payment history:", error)
    }
  }

  const filterPayments = () => {
    let filtered = paymentHistory

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (payment.planId?.planName || payment.aiCreditPlanId?.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredHistory(filtered)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setSearchTerm("")
  }

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment)
    setDetailsOpen(true)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusStats = () => {
    const stats = {
      total: filteredHistory.length,
      success: filteredHistory.filter((p) => p.paymentStatus === "success").length,
      pending: filteredHistory.filter((p) => p.paymentStatus === "pending" || p.paymentStatus === "Initiated").length,
      failed: filteredHistory.filter((p) => p.paymentStatus === "failed" || p.paymentStatus === "error").length,
    }
    return stats
  }

  const stats = getStatusStats()

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
                Payment History
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                View all your payment transactions and plan purchases
              </Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: "#64748b" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2, borderBottom: "1px solid #f1f5f9" }}>
              <Tab
                icon={<PsychologyIcon />}
                label="AI Credits"
                iconPosition="start"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
              <Tab
                icon={<StarIcon />}
                label="Plan Subscriptions"
                iconPosition="start"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
            </Tabs>

            <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
              <TextField
                placeholder="Search by Order ID, Transaction ID, or Plan name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={3}>
                <Card sx={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#10b981" }}>
                      {stats.success}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#059669" }}>
                      Success
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ background: "#fffbeb", border: "1px solid #fed7aa" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#f59e0b" }}>
                      {stats.pending}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#d97706" }}>
                      Pending
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#ef4444" }}>
                      {stats.failed}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#dc2626" }}>
                      Failed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Loading payment history...
                </Typography>
              </Box>
            </Box>
          ) : filteredHistory.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: "12px" }}>
              No payment history found for {tabValue === 0 ? "AI Credits" : "Plan Subscriptions"}.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {filteredHistory.map((payment) => (
                <Grid item xs={12} md={6} key={payment._id}>
                  <PaymentHistoryCard
                    payment={payment}
                    onViewDetails={handleViewDetails}
                    onDownloadInvoice={onDownloadInvoice}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={onClose}
            sx={{
              color: "#64748b",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px" },
        }}
      >
        <DialogTitle sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Payment Details
            </Typography>
            <IconButton onClick={() => setDetailsOpen(false)} sx={{ color: "#64748b" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 1 }}>
          {selectedPayment && (
            <Box>
              <Card sx={{ mb: 3, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    {selectedPayment.paymentStatus === "success" ? (
                      <CheckCircleIcon sx={{ color: "#10b981" }} />
                    ) : selectedPayment.paymentStatus === "pending" || selectedPayment.paymentStatus === "Initiated" ? (
                      <ScheduleIcon sx={{ color: "#f59e0b" }} />
                    ) : (
                      <ErrorIcon sx={{ color: "#ef4444" }} />
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      {selectedPayment.planType === "Plan"
                        ? selectedPayment.planId?.planName || "Plan Subscription"
                        : selectedPayment.aiCreditPlanId?.name || "AI Credits"}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    {selectedPayment.planType === "Plan"
                      ? selectedPayment.planId?.planDescription || "Plan subscription payment"
                      : selectedPayment.aiCreditPlanId?.description || "AI credits purchase"}
                  </Typography>
                </CardContent>
              </Card>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {formatPrice(selectedPayment.Amount)}
                  </Typography>
                </Grid>
                {selectedPayment.planType === "AIPlan" && selectedPayment.numberOfCredits > 0 && (
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                      Credits
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      {selectedPayment.numberOfCredits}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Order ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "#1e293b" }}>
                    {selectedPayment.orderId}
                  </Typography>
                </Grid>
                {selectedPayment.transactionId && (
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                      Transaction ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#1e293b" }}>
                      {selectedPayment.transactionId}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Payment Method
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "#1e293b" }}>
                    {selectedPayment.paymentMethod}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedPayment.paymentStatus}
                    size="small"
                    sx={{
                      background:
                        selectedPayment.paymentStatus === "success"
                          ? "#10b981"
                          : selectedPayment.paymentStatus === "pending" || selectedPayment.paymentStatus === "Initiated"
                            ? "#f59e0b"
                            : "#ef4444",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Created Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "#1e293b" }}>
                    {formatDate(selectedPayment.createdAt)}
                  </Typography>
                </Grid>
                {selectedPayment.paymentDate && (
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                      Payment Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#1e293b" }}>
                      {formatDate(selectedPayment.paymentDate)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => onDownloadInvoice(selectedPayment)}
            disabled={selectedPayment?.paymentStatus !== "success"}
            startIcon={<DownloadIcon />}
            sx={{
              color: "#10b981",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Download Invoice
          </Button>
          <Button
            onClick={() => setDetailsOpen(false)}
            sx={{
              color: "#64748b",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PaymentHistoryModal
