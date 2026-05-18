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
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material"
import { Close as CloseIcon, Psychology as PsychologyIcon, ShoppingCart as ShoppingCartIcon } from "@mui/icons-material"
import { useState, useEffect } from "react"

const AICreditsModal = ({ open, onClose, aiPlans, onPurchase, loading }) => {
  const [selectedFixedPlan, setSelectedFixedPlan] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

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

  // Filter plans to only include fixed-price plans as per the new requirement
  const fixedPricePlans = aiPlans.filter((plan) => plan.NumberofCredit && plan.PriceofCredit)

  useEffect(() => {
    // Automatically select the first plan if none is selected and plans are loaded
    if (!selectedFixedPlan && fixedPricePlans.length > 0 && !loading) {
      setSelectedFixedPlan(fixedPricePlans[0])
    }
  }, [fixedPricePlans, selectedFixedPlan, loading])

  const handlePlanSelect = (plan) => {
    setSelectedFixedPlan(plan)
  }

  const handlePurchaseClick = () => {
    if (!selectedFixedPlan || loading) {
      return // Prevent purchase if no plan is selected or still loading
    }
    setShowConfirmation(true)
  }

  const handleConfirmPayment = async () => {
    setPaymentLoading(true)
    try {
      await onPurchase(selectedFixedPlan._id, selectedFixedPlan.NumberofCredit, selectedFixedPlan.PriceofCredit)
    } catch (error) {
      console.error("Payment initiation failed:", error)
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleCloseConfirmation = () => {
    if (!paymentLoading) {
      setShowConfirmation(false)
    }
  }

  const handleCloseModal = () => {
    if (!paymentLoading) {
      setShowConfirmation(false)
      onClose()
      setSelectedFixedPlan(null) // Reset selected plan
    }
  }

  return (
    <>
      <Dialog
        open={open && !showConfirmation}
        onClose={handleCloseModal}
        maxWidth="md" // Adjusted to match image's width
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            maxHeight: "90vh", // Ensure it doesn't take full height on smaller screens
          },
        }}
      >
        <DialogTitle sx={{ p: 3, pb: 1, position: "relative" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#212121", mb: 0.5 }}>
              Purchase AI Credits
            </Typography>
            <Typography variant="body2" sx={{ color: "#616161" }}>
              Choose a credit package
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              color: "#9e9e9e",
              position: "absolute",
              right: 16,
              top: 16,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 300,
              }}
            >
              <CircularProgress size={40} sx={{ mb: 2, color: "#673AB7" }} />
              <Typography variant="body2" sx={{ color: "#616161" }}>
                Loading pricing information...
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#212121", mb: 2 }}>
                Recommended Packages
              </Typography>
              <Grid container spacing={2}>
                {fixedPricePlans.map((plan) => (
                  <Grid item xs={12} sm={6} md={4} key={plan._id}>
                    <Card
                      onClick={() => handlePlanSelect(plan)}
                      sx={{
                        borderRadius: "12px",
                        border: `2px solid ${selectedFixedPlan?._id === plan._id ? "#673AB7" : "#e0e0e0"}`,
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          transform: "translateY(-2px)",
                        },
                        background: selectedFixedPlan?._id === plan._id ? "#F5F3FF" : "#ffffff", // Lighter purple tint for selected
                        boxShadow: selectedFixedPlan?._id === plan._id ? "0 2px 8px rgba(103, 58, 183, 0.2)" : "none",
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: "center" }}>
                        <PsychologyIcon sx={{ fontSize: 48, color: "#673AB7", mb: 1.5 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#212121", mb: 0.5 }}>
                          {plan.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#616161", mb: 2, minHeight: "40px" }}>
                          {plan.description}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "#673AB7", mb: 1 }}>
                          {formatPrice(plan.PriceofCredit)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#616161" }}>
                          for {formatNumber(plan.NumberofCredit)} Credits
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, borderTop: "1px solid #eeeeee", justifyContent: "flex-end" }}>
          <Button
            onClick={handleCloseModal}
            sx={{
              color: "#616161",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePurchaseClick}
            disabled={!selectedFixedPlan || loading}
            startIcon={<ShoppingCartIcon />}
            sx={{
              background: "linear-gradient(135deg, #673AB7, #9C27B0)", // Deep Purple to Purple
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                background: "linear-gradient(135deg, #5E35B1, #8E24AA)",
                boxShadow: "0px 6px 10px rgba(0,0,0,0.15)",
              },
            }}
          >
            Purchase
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Confirmation Dialog (retained for functionality, can be styled further if needed) */}
      <Dialog
        open={showConfirmation}
        onClose={handleCloseConfirmation}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={paymentLoading}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ p: 3, pb: 1, textAlign: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #673AB7, #9C27B0)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 32, color: "white" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#212121", mb: 0.5 }}>
            Confirm Purchase
          </Typography>
          <Typography variant="body2" sx={{ color: "#616161" }}>
            You're about to purchase AI credits
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Card
            sx={{
              background: "#f5f5f5",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              mb: 3,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="body2" sx={{ color: "#424242", fontWeight: 600 }}>
                  Order Summary
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PsychologyIcon sx={{ fontSize: 20, color: "#673AB7" }} />
                  <Typography variant="body1" sx={{ color: "#212121", fontWeight: 500 }}>
                    {selectedFixedPlan?.name || "AI Credits"}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: "#212121", fontWeight: 700 }}>
                  {formatNumber(selectedFixedPlan?.NumberofCredit || 0)} Credits
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pt: 2,
                  borderTop: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body1" sx={{ color: "#212121", fontWeight: 600 }}>
                  Total Amount
                </Typography>
                <Typography variant="h5" sx={{ color: "#673AB7", fontWeight: 700 }}>
                  {formatPrice(selectedFixedPlan?.PriceofCredit || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Typography variant="body2" sx={{ color: "#616161", textAlign: "center" }}>
            You will be redirected to a secure payment gateway to complete your transaction.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, borderTop: "1px solid #eeeeee", justifyContent: "flex-end" }}>
          <Button
            onClick={handleCloseConfirmation}
            disabled={paymentLoading}
            sx={{
              color: "#616161",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmPayment}
            disabled={paymentLoading}
            startIcon={paymentLoading ? <CircularProgress size={16} color="inherit" /> : <ShoppingCartIcon />}
            sx={{
              background: "linear-gradient(135deg, #673AB7, #9C27B0)",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                background: "linear-gradient(135deg, #5E35B1, #8E24AA)",
                boxShadow: "0px 6px 10px rgba(0,0,0,0.15)",
              },
            }}
          >
            {paymentLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AICreditsModal
