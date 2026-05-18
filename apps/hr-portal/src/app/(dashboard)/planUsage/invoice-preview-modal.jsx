"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
} from "@mui/material"
import { Close as CloseIcon, Download as DownloadIcon, Visibility as VisibilityIcon } from "@mui/icons-material"

const InvoicePreviewModal = ({ open, onClose, paymentData, onDownload, onPreview }) => {
  if (!paymentData) return null

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const invoiceNumber = `INV-${paymentData.orderId}`
  const invoiceDate = paymentData.paymentDate ? formatDate(paymentData.paymentDate) : formatDate(paymentData.createdAt)

  const isPlanType = paymentData.planType === "Plan"
  const description = isPlanType ? `${paymentData.planId?.planName || "Plan Subscription"}` : `AI Credits Purchase`

  const quantity = isPlanType ? "1" : (paymentData.numberOfCredits || 0).toString()
  const subtotal = paymentData.Amount
  const gstRate = 18
  const gstAmount = (subtotal * gstRate) / (100 + gstRate)
  const baseAmount = subtotal - gstAmount

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
              Invoice Preview
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              {invoiceNumber} • {invoiceDate}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#64748b" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Card sx={{ border: "1px solid #e2e8f0", borderRadius: "12px" }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
                  INVOICE
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#2563eb", mb: 2 }}>
                  Your Company Name
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                  123 Business Street
                  <br />
                  City, State 12345
                  <br />
                  Phone: +91 98765 43210
                  <br />
                  Email: billing@yourcompany.com
                  <br />
                  GST: GST123456789
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                  Invoice Number
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}>
                  {invoiceNumber}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                  Invoice Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#1e293b", mb: 2 }}>
                  {invoiceDate}
                </Typography>
                <Chip
                  label={paymentData.paymentStatus.toUpperCase()}
                  size="small"
                  sx={{
                    background: paymentData.paymentStatus === "success" ? "#10b981" : "#f59e0b",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Bill To */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}>
                Bill To:
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                Customer Name
                <br />
                Customer Address
                <br />
                City, State, PIN
              </Typography>
            </Box>

            {/* Items Table */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={2} sx={{ mb: 2, p: 2, background: "#f8fafc", borderRadius: "8px" }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    Description
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", textAlign: "center" }}>
                    Qty
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", textAlign: "center" }}>
                    Rate
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", textAlign: "right" }}>
                    Amount
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                    {description}
                  </Typography>
                  {!isPlanType && (
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      {paymentData.numberOfCredits} AI Analysis Credits
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" sx={{ color: "#1e293b", textAlign: "center" }}>
                    {quantity}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" sx={{ color: "#1e293b", textAlign: "center" }}>
                    {isPlanType
                      ? formatPrice(paymentData.Amount)
                      : formatPrice(paymentData.Amount / (paymentData.numberOfCredits || 1))}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" sx={{ color: "#1e293b", textAlign: "right", fontWeight: 600 }}>
                    {formatPrice(paymentData.Amount)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Totals */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
              <Box sx={{ minWidth: 250 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Subtotal:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                    {formatPrice(baseAmount)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    GST (18%):
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                    {formatPrice(gstAmount)}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 700 }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#2563eb", fontWeight: 700 }}>
                    {formatPrice(subtotal)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Payment Info */}
            <Card sx={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}>
                  Payment Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                      Payment Method
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                      {paymentData.paymentMethod || "Online Payment"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                      Transaction ID
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                      {paymentData.transactionId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                      Order ID
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                      {paymentData.orderId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                      Payment Date
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                      {invoiceDate}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
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
        <Button
          onClick={async () => {
            try {
              await onPreview(paymentData)
            } catch (error) {
              console.error("Error previewing invoice:", error)
            }
          }}
          startIcon={<VisibilityIcon />}
          sx={{
            color: "#2563eb",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Preview PDF
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            try {
              await onDownload(paymentData)
            } catch (error) {
              console.error("Error downloading invoice:", error)
            }
          }}
          startIcon={<DownloadIcon />}
          sx={{
            background: "linear-gradient(135deg, #10b981, #34d399)",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Download Invoice
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InvoicePreviewModal
