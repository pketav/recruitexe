"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
} from "@mui/icons-material"
import { useApi } from "@core/hooks/useApi"
import UsageCard from "./usage-card"
import PaymentHistoryModal from "./payment-history-modal"
import PlanDetailsCard from "./plan-details-card"
import AICreditsCard from "./ai-credits-card"
import PlanComparisonModal from "./plan-comparison-modal"
import AICreditsModal from "./ai-credits-modal"
import PaymentSuccess from "./payment-success"
import TransactionProcessingDialog from "./transaction-processing-dialog"
import { InvoiceGenerator } from "./invoice-generator"
import InvoicePreviewModal from "./invoice-preview-modal"

// Modern theme
const modernTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
      light: "#3b82f6",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: "1.875rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #f1f5f9",
        },
      },
    },
  },
})

// Loading Component
const LoadingComponent = () => (
  <ThemeProvider theme={modernTheme}>
    <CssBaseline />
    <Box sx={{ p: 4, background: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ color: "#2563eb", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
              Loading plan usage data...
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Please wait while we fetch your plan details
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  </ThemeProvider>
)

// Error Component
const ErrorComponent = ({ error, onRetry }) => (
  <ThemeProvider theme={modernTheme}>
    <CssBaseline />
    <Box sx={{ p: 4, background: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <Box sx={{ textAlign: "center", maxWidth: 500 }}>
            <Typography variant="h6" sx={{ color: "#ef4444", mb: 2 }}>
              Error Loading Data
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={onRetry}
              sx={{
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Try Again
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  </ThemeProvider>
)

export default function PlanUsageDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [aiCreditsModalOpen, setAiCreditsModalOpen] = useState(false)
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false)
  const [availablePlans, setAvailablePlans] = useState([])
  const [aiPlans, setAiPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(false)
  const [aiPlansLoading, setAiPlansLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [aiCredits, setAiCredits] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" })
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const [transactionProcessing, setTransactionProcessing] = useState(false)
  const [pendingTransaction, setPendingTransaction] = useState(null)
  const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false)
  const [selectedInvoicePayment, setSelectedInvoicePayment] = useState(null)

  // Enhanced refs to prevent duplicate calls
  const verificationInProgress = useRef(false)
  const hasProcessedPayment = useRef(false)
  const dataLoadInProgress = useRef(false)
  const initialLoadComplete = useRef(false)
  const mountedRef = useRef(true)
  const lastProcessedParams = useRef("")

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchString = searchParams.toString()

  const { callApi, loading } = useApi()

  // Memoized load data function to prevent unnecessary re-renders
  const loadData = useCallback(
    async (force = false) => {
      // Check if component is still mounted
      if (!mountedRef.current) return
      // Prevent duplicate calls unless forced
      if (dataLoadInProgress.current && !force) {
        return
      }
      try {
        dataLoadInProgress.current = true
        setError(null)
        const result = await callApi({
          endpoint: "/v1/api/Auth/plancreditremaining",
          method: "GET",
          disableSnackbar: true,
        })
        if (!mountedRef.current) return
        if (result.success && result.data && result.data.items) {
          setData(result.data.items)
          if (result.data.items.usage && result.data.items.usage.addNumberOfAnalizers) {
            setAiCredits(result.data.items.usage.addNumberOfAnalizers)
          }
          initialLoadComplete.current = true
        } else {
          setError(result.message || "Failed to fetch plan usage data")
        }
      } catch (err) {
        if (!mountedRef.current) return
        setError("An unexpected error occurred while fetching data")
        console.error("Error fetching plan usage:", err)
      } finally {
        dataLoadInProgress.current = false
      }
    },
    [callApi],
  )

  // Load available plans with memoization
  const loadAvailablePlans = useCallback(async () => {
    if (!mountedRef.current) return
    try {
      setPlansLoading(true)
      const result = await callApi({
        endpoint: "/v1/api/masterPlan/getAllPlans",
        method: "GET",
        disableSnackbar: true,
      })
      if (!mountedRef.current) return
      if (result.success && result.data && result.data.items) {
        setAvailablePlans(result.data.items)
      } else {
        console.error("Failed to fetch plans:", result.message)
      }
    } catch (err) {
      console.error("Error fetching available plans:", err)
    } finally {
      if (mountedRef.current) {
        setPlansLoading(false)
      }
    }
  }, [callApi])

  // Load AI plans with memoization
  const loadAiPlans = useCallback(async () => {
    if (!mountedRef.current) return
    try {
      setAiPlansLoading(true)
      const result = await callApi({
        endpoint: "/v1/api/masterPlan/aiPlans",
        method: "GET",
        disableSnackbar: true,
      })
      if (!mountedRef.current) return
      if (result.success && result.data && result.data.items) {
        setAiPlans(result.data.items)
      } else {
        console.error("Failed to fetch AI plans:", result.message)
      }
    } catch (err) {
      console.error("Error fetching AI plans:", err)
    } finally {
      if (mountedRef.current) {
        setAiPlansLoading(false)
      }
    }
  }, [callApi])

  // Load payment history with proper error handling
  const loadPaymentHistory = useCallback(
    async (planType) => {
      if (!mountedRef.current) return { items: [] }
      try {
        setHistoryLoading(true)
        const response = await callApi({
          endpoint: `/v1/api/service/icici/payment-history?planType=${planType}`,
          method: "GET",
          disableSnackbar: true,
        })
        if (!mountedRef.current) return { items: [] }
        const result = response.data
        if (result.status && result.items) {
          return result
        } else {
          throw new Error(result.message || "Failed to fetch payment history")
        }
      } catch (err) {
        console.error("Error fetching payment history:", err)
        if (mountedRef.current) {
          setSnackbar({
            open: true,
            message: "Failed to load payment history",
            severity: "error",
          })
        }
        return { items: [] }
      } finally {
        if (mountedRef.current) {
          setHistoryLoading(false)
        }
      }
    },
    [callApi],
  )

  const handleDownloadInvoice = async (paymentData) => {
    try {
      const success = await InvoiceGenerator.downloadInvoice(paymentData, callApi)
      if (success) {
        setSnackbar({
          open: true,
          message: "Invoice downloaded successfully!",
          severity: "success",
        })
      } else {
        setSnackbar({
          open: true,
          message: "Failed to download invoice. Please try again.",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Error downloading invoice:", error)
      setSnackbar({
        open: true,
        message: "Failed to download invoice. Please try again.",
        severity: "error",
      })
    }
  }

  const handlePreviewInvoice = (paymentData) => {
    setSelectedInvoicePayment(paymentData)
    setInvoicePreviewOpen(true)
  }

  const handlePreviewPDF = async (paymentData) => {
    try {
      const success = await InvoiceGenerator.previewInvoice(paymentData, callApi)
      if (!success) {
        setSnackbar({
          open: true,
          message: "Failed to preview invoice. Please try again.",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Error previewing invoice:", error)
      setSnackbar({
        open: true,
        message: "Failed to preview invoice. Please try again.",
        severity: "error",
      })
    }
  }

  // Enhanced payment verification with better duplicate prevention
  const verifyPayment = useCallback(
    async (paymentResponse) => {
      if (verificationInProgress.current || hasProcessedPayment.current || !mountedRef.current) {
        return
      }
      try {
        verificationInProgress.current = true
        setVerifyingPayment(true)
        setTransactionProcessing(false)
        const encodedPaymentResponse = encodeURIComponent(JSON.stringify(paymentResponse))
        const result = await callApi({
          endpoint: `/v1/api/service/icici/checkResponse?paymentResponse=${encodedPaymentResponse}`,
          method: "POST",
          disableSnackbar: true,
        })
        if (!mountedRef.current) return
        if (result.data.status && result.data.items && result.data.items.data && result.data.items.data.status) {
          const verificationData = result.data.items.data
          const storedTransaction = pendingTransaction || JSON.parse(localStorage.getItem("pendingTransaction") || "{}")
          let numberOfCredits = 0
          let transactionType = "plan"
          if (storedTransaction.numberOfCredits) {
            numberOfCredits = Number.parseInt(storedTransaction.numberOfCredits)
            transactionType = "credits"
          } else if (verificationData.data.numberOfCredits) {
            numberOfCredits = Number.parseInt(verificationData.data.numberOfCredits)
            transactionType = "credits"
          } else {
            const urlParams = new URLSearchParams(window.location.search)
            const creditsParam = urlParams.get("credits") || urlParams.get("numberOfCredits")
            if (creditsParam) {
              numberOfCredits = Number.parseInt(creditsParam)
              transactionType = "credits"
            }
          }
          const isPaymentSuccessful = verificationData.data.ResponseCode === "00"
          setPaymentDetails({
            success: isPaymentSuccessful,
            transactionId: verificationData.data.TxnRefNo || verificationData.data.RetRefNo || "N/A",
            amount: verificationData.data.Amount || "0",
            credits: numberOfCredits,
            transactionType: transactionType,
            message: verificationData.data.Message || "Transaction Successful",
            orderInfo: verificationData.data.OrderInfo || "",
            respDate: verificationData.data.RespDate || "",
            respTime: verificationData.data.RespTime || "",
          })
          setShowPaymentSuccess(true)
          hasProcessedPayment.current = true
          setPendingTransaction(null)
          localStorage.removeItem("pendingTransaction")
          if (isPaymentSuccessful) {
            // Delay reload to prevent race conditions
            setTimeout(() => {
              if (mountedRef.current) {
                loadData(true)
              }
            }, 2000)
          }
        } else {
          const storedTransaction = pendingTransaction || JSON.parse(localStorage.getItem("pendingTransaction") || "{}")
          const numberOfCredits = Number.parseInt(storedTransaction.numberOfCredits) || 0
          const transactionType = storedTransaction.type || (numberOfCredits > 0 ? "credits" : "plan")
          setPaymentDetails({
            success: false,
            transactionId: "VERIFICATION_FAILED",
            credits: numberOfCredits,
            transactionType: transactionType,
            message: result.message || "Payment verification failed",
          })
          setShowPaymentSuccess(true)
          hasProcessedPayment.current = true
          setPendingTransaction(null)
          localStorage.removeItem("pendingTransaction")
        }
      } catch (err) {
        console.error("Error verifying payment:", err)
        if (!mountedRef.current) return
        const storedTransaction = pendingTransaction || JSON.parse(localStorage.getItem("pendingTransaction") || "{}")
        const numberOfCredits = Number.parseInt(storedTransaction.numberOfCredits) || 0
        const transactionType = storedTransaction.type || (numberOfCredits > 0 ? "credits" : "plan")
        setPaymentDetails({
          success: false,
          transactionId: "ERROR",
          credits: numberOfCredits,
          transactionType: transactionType,
          message: "Payment verification error",
        })
        setShowPaymentSuccess(true)
        hasProcessedPayment.current = true
        setPendingTransaction(null)
        localStorage.removeItem("pendingTransaction")
      } finally {
        if (mountedRef.current) {
          setVerifyingPayment(false)
        }
        verificationInProgress.current = false
      }
    },
    [callApi, pendingTransaction, loadData],
  )

  // Initiate payment
  const initiatePayment = async (planId, numberOfCredits, amount) => {
    try {
      setTransactionProcessing(true)
      const transactionData = {
        planId,
        numberOfCredits: Number.parseInt(numberOfCredits),
        amount: Number.parseFloat(amount),
        timestamp: Date.now(),
      }
      setPendingTransaction(transactionData)
      localStorage.setItem("pendingTransaction", JSON.stringify(transactionData))
      const returnUrl = `${window.location.origin}${pathname}`
      const payload = {
        aiCreditPlanId: planId,
        numberOfCredits: Number.parseInt(numberOfCredits),
        Amount: Number.parseFloat(amount),
        returnURL: returnUrl,
      }
      const result = await callApi({
        endpoint: "/v1/api/service/icici/paymentInitiate",
        method: "POST",
        data: payload,
      })
      if (result.data.items && result.data.items.status) {
        const paymentData = result.data.items
        if (paymentData.paymentUrl) {
          setTimeout(() => {
            setTransactionProcessing(false)
            window.location.href = paymentData.paymentUrl
          }, 1000)
          return result
        } else {
          throw new Error("Payment URL not found in response")
        }
      } else {
        throw new Error(result.message || "Failed to initiate payment")
      }
    } catch (err) {
      console.error("Error initiating payment:", err)
      setTransactionProcessing(false)
      setPendingTransaction(null)
      localStorage.removeItem("pendingTransaction")
      setSnackbar({
        open: true,
        message: err.message || "Payment initiation failed. Please try again.",
        severity: "error",
      })
      throw err
    }
  }

  // Plan payment initiation
  const initiatePlanPayment = async (planId, amount) => {
    try {
      setTransactionProcessing(true)
      const transactionData = {
        planId,
        amount: Number.parseFloat(amount),
        timestamp: Date.now(),
        type: "plan",
      }
      setPendingTransaction(transactionData)
      localStorage.setItem("pendingTransaction", JSON.stringify(transactionData))
      const returnUrl = `${window.location.origin}${pathname}`
      const payload = {
        planId: planId,
        Amount: Number.parseFloat(amount),
        returnURL: returnUrl,
      }
      const result = await callApi({
        endpoint: "/v1/api/service/icici/paymentInitiate",
        method: "POST",
        data: payload,
      })
      if (result.data.items && result.data.items.status) {
        const paymentData = result.data.items
        if (paymentData.paymentUrl) {
          setTimeout(() => {
            setTransactionProcessing(false)
            window.location.href = paymentData.paymentUrl
          }, 1000)
          return result
        } else {
          throw new Error("Payment URL not found in response")
        }
      } else {
        throw new Error(result.message || "Failed to initiate plan payment")
      }
    } catch (err) {
      console.error("Error initiating plan payment:", err)
      setTransactionProcessing(false)
      setPendingTransaction(null)
      localStorage.removeItem("pendingTransaction")
      setSnackbar({
        open: true,
        message: err.message || "Plan payment initiation failed. Please try again.",
        severity: "error",
      })
      throw err
    }
  }

  const handleSelectPlan = (plan) => {
    setUpgradeModalOpen(false)
  }

  const handlePurchasePlan = async (planId, amount) => {
    try {
      await initiatePlanPayment(planId, amount)
    } catch (error) {
      console.error("Plan purchase failed:", error)
    }
  }

  // FIXED: Enhanced useEffect with proper dependency management and duplicate prevention
  useEffect(() => {
    const handleInitialLoad = async () => {
      // Create a unique identifier for current params
      const currentParamsId = searchString + Date.now()

      // Prevent processing if already processed these same params
      if (lastProcessedParams.current === searchString && hasProcessedPayment.current) {
        return
      }
      // Prevent re-processing if component is unmounted
      if (!mountedRef.current) return
      // Update last processed params
      lastProcessedParams.current = searchString
      // Flags for URL-based payment verification
      const paymentResponseParam = searchParams.get("paymentResponse")
      const statusParam = searchParams.get("status")
      const encDataParam = searchParams.get("EncData")
      const terminalIdParam = searchParams.get("TerminalId")
      const merchantIdParam = searchParams.get("MerchantId")
      const bankIdParam = searchParams.get("BankId")
      try {
        // ✅ Handle ICICI payment response verification
        if (paymentResponseParam && !hasProcessedPayment.current) {
          const paymentResponse = JSON.parse(decodeURIComponent(paymentResponseParam))
          await verifyPayment(paymentResponse)
          return
        }
        if (encDataParam && terminalIdParam && merchantIdParam && bankIdParam && !hasProcessedPayment.current) {
          const paymentResponse = {
            EncData: encDataParam,
            TerminalId: terminalIdParam,
            MerchantId: merchantIdParam,
            BankId: bankIdParam,
          }
          await verifyPayment(paymentResponse)
          return
        }
        // ✅ Handle fallback for success status
        if ((statusParam === "success" || statusParam === "completed") && !hasProcessedPayment.current) {
          const storedTransaction = JSON.parse(localStorage.getItem("pendingTransaction") || "{}")
          setPaymentDetails({
            success: true,
            transactionId: searchParams.get("transactionId") || "SUCCESS",
            amount: searchParams.get("amount") || storedTransaction.amount || "0",
            credits: searchParams.get("credits") || storedTransaction.numberOfCredits || "0",
          })
          setShowPaymentSuccess(true)
          hasProcessedPayment.current = true
          localStorage.removeItem("pendingTransaction")
          return
        }
        // ✅ Load dashboard data if not already loaded and no payment processing
        if (!initialLoadComplete.current && !hasProcessedPayment.current && !verificationInProgress.current) {
          await loadData()
          initialLoadComplete.current = true
        }
      } catch (err) {
        console.error("Error in handleInitialLoad:", err)
      }
    }
    // Add a small delay to prevent rapid successive calls
    const timeoutId = setTimeout(handleInitialLoad, 100)

    return () => clearTimeout(timeoutId)
  }, [searchString, searchParams, verifyPayment, loadData])

  // Cleanup effect
  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      verificationInProgress.current = false
      hasProcessedPayment.current = false
      dataLoadInProgress.current = false
      lastProcessedParams.current = ""
    }
  }, [])

  // Event handlers
  const handleRefresh = useCallback(() => {
    loadData(true) // Force refresh
  }, [loadData])

  const handleUpgrade = useCallback(() => {
    setUpgradeModalOpen(true)
    loadAvailablePlans()
  }, [loadAvailablePlans])

  const handleBuyCredits = useCallback(() => {
    setAiCreditsModalOpen(true)
    loadAiPlans()
  }, [loadAiPlans])

  const handleViewHistory = useCallback(() => {
    setPaymentHistoryOpen(true)
  }, [])

  const handlePurchaseCredits = async (planId, numberOfCredits, amount) => {
    try {
      await initiatePayment(planId, numberOfCredits, amount)
    } catch (error) {
      console.error("Purchase failed:", error)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleGoHome = () => {
    hasProcessedPayment.current = false
    verificationInProgress.current = false
    dataLoadInProgress.current = false
    lastProcessedParams.current = ""
    router.replace(pathname)
    setShowPaymentSuccess(false)
    setPaymentDetails(null)
    loadData(true)
  }

  // Show transaction processing dialog
  if (transactionProcessing) {
    return (
      <ThemeProvider theme={modernTheme}>
        <CssBaseline />
        <Box sx={{ p: 4, background: "#f8fafc", minHeight: "100vh" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <TransactionProcessingDialog
              open={transactionProcessing}
              onClose={() => {}}
              message="Initiating secure payment gateway..."
            />
          </Box>
        </Box>
      </ThemeProvider>
    )
  }

  // Show payment verification loading
  if (verifyingPayment) {
    return (
      <ThemeProvider theme={modernTheme}>
        <CssBaseline />
        <Box sx={{ p: 4, background: "#f8fafc", minHeight: "100vh" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress size={60} sx={{ color: "#2563eb", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
                  Verifying Payment...
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  Please wait while we confirm your transaction
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    )
  }

  // Show payment success overlay if needed
  if (showPaymentSuccess) {
    return (
      <ThemeProvider theme={modernTheme}>
        <CssBaseline />
        <Box sx={{ p: 4, background: "#f8fafc", minHeight: "100vh" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <PaymentSuccess onGoHome={handleGoHome} paymentDetails={paymentDetails} />
          </Box>
        </Box>
      </ThemeProvider>
    )
  }

  if (loading && !data) {
    return <LoadingComponent />
  }

  if (error) {
    return <ErrorComponent error={error} onRetry={handleRefresh} />
  }

  if (!data) {
    return null
  }

  const usageData = [
    {
      title: "Job Posts",
      icon: <WorkIcon />,
      usage: data.usage.jobPostUsage,
      percentage: data.usage.jobPostUsagePercentage,
      color: "#2563eb",
      description: "Active job postings created",
    },
    {
      title: "Users",
      icon: <PeopleIcon />,
      usage: data.usage.userUsage,
      percentage: data.usage.userUsagePercentage,
      color: "#10b981",
      description: "Team members added",
    },
    {
      title: "AI Analyzer",
      icon: <AnalyticsIcon />,
      usage: data.usage.analyzerUsage,
      percentage: data.usage.analyzerUsagePercentage,
      color: "#f59e0b",
      description: "Resume analysis performed",
      addOnCredits: data.usage.addNumberOfAnalizers,
    },
  ]

  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, background: "#f8fafc", minHeight: "100vh" }}>
        <Box sx={{ maxWidth: 1400, mx: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ color: "#1e293b", mb: 1 }}>
                  Plan & Usage Overview
                </Typography>
                <Typography variant="body1" sx={{ color: "#64748b" }}>
                  Monitor your current plan details and resource utilization
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  onClick={handleViewHistory}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Payment History
                </Button>
                <IconButton
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    background: "#ffffff",
                    border: "1px solid #f1f5f9",
                    "&:hover": {
                      background: "#f8fafc",
                    },
                  }}
                >
                  <RefreshIcon
                    sx={{
                      animation: loading ? "spin 1s linear infinite" : "none",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Box>
          {/* Plan Details Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={8}>
              <PlanDetailsCard
                planDetails={data.planDetails}
                onUpgrade={handleUpgrade}
                onRefresh={handleRefresh}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <AICreditsCard aiCredits={aiCredits} onBuyCredits={handleBuyCredits} loading={loading} />
            </Grid>
          </Grid>
          {/* Usage Statistics */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: "#1e293b", mb: 3, fontWeight: 600 }}>
              Resource Usage Statistics
            </Typography>
            <Grid container spacing={3}>
              {usageData.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <UsageCard {...item} />
                </Grid>
              ))}
            </Grid>
          </Box>
          {/* Modals */}
          <PaymentHistoryModal
            open={paymentHistoryOpen}
            onClose={() => setPaymentHistoryOpen(false)}
            onLoadHistory={loadPaymentHistory}
            onDownloadInvoice={handleDownloadInvoice}
            loading={historyLoading}
          />
          <PlanComparisonModal
            open={upgradeModalOpen}
            onClose={() => setUpgradeModalOpen(false)}
            plans={availablePlans}
            currentPlan={data?.planDetails}
            onSelectPlan={handleSelectPlan}
            onPurchasePlan={handlePurchasePlan}
            loading={plansLoading}
          />
          <AICreditsModal
            open={aiCreditsModalOpen}
            onClose={() => setAiCreditsModalOpen(false)}
            aiPlans={aiPlans}
            onPurchase={handlePurchaseCredits}
            loading={aiPlansLoading}
          />
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
          <InvoicePreviewModal
            open={invoicePreviewOpen}
            onClose={() => setInvoicePreviewOpen(false)}
            paymentData={selectedInvoicePayment}
            onDownload={handleDownloadInvoice}
            onPreview={handlePreviewPDF}
          />
        </Box>
      </Box>
    </ThemeProvider>
  )
}
