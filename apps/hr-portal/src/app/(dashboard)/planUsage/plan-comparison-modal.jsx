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
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material"
import { Close as CloseIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material"
import { useState } from "react"
import PlanPaymentConfirmationModal from "./plan-payment-confirmation-modal"

const PlanComparisonModal = ({ open, onClose, plans, currentPlan, onSelectPlan, onPurchasePlan, loading }) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
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

  const isCurrentPlan = (plan) => {
    return currentPlan && plan.planName === currentPlan.planName
  }

  const isPremiumPlan = (plan) => {
    return plan.planName.toLowerCase().includes("pro")
  }

  const handlePlanSelect = (plan) => {
    if (isCurrentPlan(plan)) {
      return
    }

    setSelectedPlan(plan)
    setConfirmationOpen(true)
  }

  const handleConfirmPurchase = async () => {
    if (selectedPlan && onPurchasePlan) {
      try {
        await onPurchasePlan(selectedPlan._id || selectedPlan.id, selectedPlan.planPrice)
        setConfirmationOpen(false)
        onClose()
      } catch (error) {
        console.error("Plan purchase failed:", error)
      }
    }
  }

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false)
    setSelectedPlan(null)
  }

  return (
    <>
      <Dialog
        open={open && !confirmationOpen}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            maxHeight: "90vh",
            background: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
                Choose Your Plan
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Select the perfect plan that fits your business needs
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: "#64748b",
                position: "absolute",
                right: 16,
                top: 16,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 1 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Loading available plans...
                </Typography>
              </Box>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ justifyContent: "center" }}>
              {plans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan.id || plan._id}>
                  <Card
                    sx={{
                      height: "100%",
                      position: "relative",
                      border: isPremiumPlan(plan) ? "2px solid #10b981" : "1px solid #e2e8f0",
                      borderRadius: "20px",
                      background: "#ffffff",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    {isPremiumPlan(plan) && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -1,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "#10b981",
                          color: "white",
                          px: 3,
                          py: 0.5,
                          borderRadius: "0 0 12px 12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          zIndex: 1,
                        }}
                      >
                        Recommended
                      </Box>
                    )}

                    {isCurrentPlan(plan) && (
                      <Chip
                        label="Current Plan"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          background: "#2563eb",
                          color: "white",
                          fontWeight: 600,
                          zIndex: 1,
                        }}
                      />
                    )}

                    <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                      <Box sx={{ mb: 3, textAlign: "left" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#1e293b",
                            mb: 1.5,
                            mt: isPremiumPlan(plan) ? 1.5 : 0,
                            fontSize: "1.1rem",
                          }}
                        >
                          {plan.planName}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mb: 1.5 }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: "#1e293b",
                              fontSize: "1.8rem",
                            }}
                          >
                            {formatPrice(plan.planPrice)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.8rem" }}>
                            /{formatDuration(plan.planDurationInDays)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748b",
                            lineHeight: 1.4,
                            fontSize: "0.85rem",
                          }}
                        >
                          {plan.planDescription}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1, mb: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: "#10b981" }} />
                            <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500, fontSize: "0.8rem" }}>
                              {formatNumber(plan.NumberOfJobPosts)} Job Posts
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: "#10b981" }} />
                            <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500, fontSize: "0.8rem" }}>
                              {formatNumber(plan.NumberOfUsers)} Team Members
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: "#10b981" }} />
                            <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500, fontSize: "0.8rem" }}>
                              {formatNumber(plan.NumberofAnalizers)} AI Analysis Credits
                            </Typography>
                          </Box>

                          {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: "#10b981" }} />
                            <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500, fontSize: "0.8rem" }}>
                              {formatNumber(plan.planCreditLimit)} Monthly Credits
                            </Typography>
                          </Box> */}

                          {isPremiumPlan(plan) && (
                            <>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <CheckCircleIcon sx={{ fontSize: 16, color: "#10b981" }} />
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#374151", fontWeight: 500, fontSize: "0.8rem" }}
                                >
                                  Priority Support
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <CheckCircleIcon sx={{ fontSize: 16, color: "#10b981" }} />
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#374151", fontWeight: 500, fontSize: "0.8rem" }}
                                >
                                  Advanced Analytics
                                </Typography>
                              </Box>
                            </>
                          )}
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        disabled={isCurrentPlan(plan)}
                        onClick={() => handlePlanSelect(plan)}
                        sx={{
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 600,
                          py: 1.2,
                          fontSize: "0.85rem",
                          background: isCurrentPlan(plan) ? "#e2e8f0" : isPremiumPlan(plan) ? "#10b981" : "#ffffff",
                          color: isCurrentPlan(plan) ? "#64748b" : isPremiumPlan(plan) ? "#ffffff" : "#1e293b",
                          border: isCurrentPlan(plan)
                            ? "1px solid #e2e8f0"
                            : isPremiumPlan(plan)
                              ? "none"
                              : "1px solid #e2e8f0",
                          "&:hover": {
                            background: isCurrentPlan(plan) ? "#e2e8f0" : isPremiumPlan(plan) ? "#059669" : "#f8fafc",
                            transform: isCurrentPlan(plan) ? "none" : "translateY(-1px)",
                          },
                          "&:disabled": {
                            background: "#e2e8f0",
                            color: "#64748b",
                          },
                        }}
                      >
                        {isCurrentPlan(plan)
                          ? "Current Plan"
                          : isPremiumPlan(plan)
                            ? `Upgrade to ${plan.planName}`
                            : `Select ${plan.planName}`}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, justifyContent: "center" }}>
          <Typography variant="caption" sx={{ color: "#64748b", textAlign: "center", fontSize: "0.75rem" }}>
            All plans include 24/7 customer support and can be cancelled anytime
          </Typography>
        </DialogActions>
      </Dialog>

      {/* Plan Payment Confirmation Modal */}
      <PlanPaymentConfirmationModal
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
        planData={selectedPlan}
        onConfirmPurchase={handleConfirmPurchase}
      />
    </>
  )
}

export default PlanComparisonModal
