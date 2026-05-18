"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Container,
  Card,
  CardContent,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import { useSearchParams } from "next/navigation"
import { useApi } from "@core/hooks/useApi"

// Helper functions for safe data handling
const safeObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value
  return {}
}
const safeArray = (value) => {
  if (Array.isArray(value)) return value
  return []
}

// Helper function to determine input type and properties based on key name
const getFieldProps = (key) => {
  const lowerKey = key.toLowerCase()
  let type = "text"
  const inputProps = {}
  let maxLength = undefined

  if (lowerKey.includes("pan")) {
    inputProps.style = { textTransform: "uppercase" }
    maxLength = 10 // Standard PAN length
  } else if (
    lowerKey.includes("number") ||
    lowerKey.includes("code") ||
    lowerKey.includes("pincode") ||
    lowerKey.includes("amount") ||
    lowerKey.includes("age")
  ) {
    type = "number"
    inputProps.pattern = "[0-9]*" // For numeric keyboard on mobile
  }

  return { type, inputProps, maxLength }
}

export default function CandidateVerificationPage() {
  const searchParams = useSearchParams()
  const reportId = searchParams.get("reportId")?.replace(/"/g, "")
  const candidateId = searchParams.get("candidateId")?.replace(/"/g, "")

  const { callApi, loading: apiGlobalLoading } = useApi()

  const [reportDetails, setReportDetails] = useState(null)
  const [loadingReport, setLoadingReport] = useState(true)
  const [reportError, setReportError] = useState(null)

  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false) // New state for consent checkbox

  useEffect(() => {
    if (!reportId || !candidateId) {
      setReportError("Report ID and Candidate ID are required in the URL.")
      setLoadingReport(false)
      return
    }

    const fetchReportDetails = async () => {
      setLoadingReport(true)
      setReportError(null)
      try {
        const result = await callApi({
          endpoint: `/v1/api/verifyDocs/GetCategoryReportById/${reportId}`,
          method: "GET",
          disableSnackbar: true,
        })

        if (result.success && result.data?.items) {
          setReportDetails(result.data.items)
          const initialFormData = {}
          safeArray(result.data.items.categoryWithPayload).forEach((category) => {
            Object.keys(safeObject(category.payload)).forEach((key) => {
              // Only initialize form data for actual input fields, not consent
              if (key !== "consent") {
                initialFormData[key] = ""
              }
            })
          })
          setFormData(initialFormData)
        } else {
          setReportError(result.message || "Failed to fetch report details.")
        }
      } catch (error) {
        console.error("Error fetching report details:", error)
        setReportError("Error fetching report details. Please try again.")
      } finally {
        setLoadingReport(false)
      }
    }

    fetchReportDetails()
  }, [reportId, candidateId, callApi])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let processedValue = value

    // Convert PAN input to uppercase
    if (name.toLowerCase().includes("pan")) {
      processedValue = value.toUpperCase()
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }))
    setFormErrors((prev) => ({ ...prev, [name]: "" })) // Clear error on change
  }

  const handleConsentChange = (e) => {
    setConsentChecked(e.target.checked)
    setFormErrors((prev) => ({ ...prev, consent: "" })) // Clear error on change
  }

  const validateForm = () => {
    const errors = {}
    safeArray(reportDetails?.categoryWithPayload).forEach((category) => {
      Object.keys(safeObject(category.payload)).forEach((key) => {
        // Skip consent field as it's validated separately
        if (key === "consent") {
          return
        }

        const value = formData[key]
        const lowerKey = key.toLowerCase()

        // Basic required field validation
        if (!value) {
          errors[key] = `${key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} is required.`
        } else {
          // Specific validations
          if (lowerKey.includes("pan")) {
            // PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
            if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
              errors[key] = "Invalid PAN format (e.g., ABCDE1234F)."
            }
          } else if (
            lowerKey.includes("number") ||
            lowerKey.includes("code") ||
            lowerKey.includes("pincode") ||
            lowerKey.includes("amount") ||
            lowerKey.includes("age")
          ) {
            // Check if it's a valid number (digits only)
            if (isNaN(Number(value)) || !/^\d+$/.test(value)) {
              errors[key] = `${key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} must be a valid number.`
            }
            // Example: Specific length validation for phone number
            if (lowerKey.includes("phone_number") && value.length !== 10) {
              errors[key] = "Phone number must be 10 digits."
            }
          }
        }
      })
    })

    // Validate consent checkbox
    if (!consentChecked) {
      errors.consent = "You must consent to the verification of this information."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    const submissionPayload = {
      candidateId: candidateId,
      payload: {
        ...formData,
      },
    }

    // The 'consent' field is now handled by the separate checkbox and its validation.
    // It should not be part of the payload sent to the API.
    // The previous code already removed it, so no change needed here.

    try {
      const result = await callApi({
        endpoint: `/v1/api/verifyDocs/generateReportByType`,
        method: "POST",
        data: submissionPayload,
        successMessage: "Report generated successfully!",
        errorMessage: "Failed to generate report.",
      })
      if (result.success) {
        setIsSubmittedSuccessfully(true) // Set success state to true
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingReport) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading verification form...
        </Typography>
      </Container>
    )
  }

  if (reportError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{reportError}</Alert>
      </Container>
    )
  }

  if (!reportDetails || safeArray(reportDetails.categoryWithPayload).length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">No verification categories found for this report.</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ borderRadius: 3, p: 4 }}>
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}
          >
            Candidate Verification
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Please provide the required details for "{reportDetails.reportName}"
          </Typography>

          {/* {isSubmittedSuccessfully ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              Verification report submitted successfully! You cannot submit this form again.
            </Alert>
          ) : null} */}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {safeArray(reportDetails.categoryWithPayload).map((category, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ mb: 3, p: 3, border: "1px solid #e0e0e0", borderRadius: 2, bgcolor: "grey.50" }}>
                    <Typography variant="h6" sx={{ fontWeight: "medium", mb: 2, color: "text.primary" }}>
                      {category.type === "verifypanServices"
                        ? "PAN Verification"
                        : category.type === "bankVerification"
                          ? "Bank Account Verification"
                          : category.type}
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.keys(safeObject(category.payload)).map((key) => {
                        // Skip rendering the consent field here
                        if (key === "consent") {
                          return null
                        }
                        const { type, inputProps, maxLength } = getFieldProps(key)
                        return (
                          <Grid item xs={12} sm={6} key={key}>
                            <TextField
                              fullWidth
                              label={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              name={key}
                              value={formData[key] || ""}
                              onChange={handleInputChange}
                              required
                              error={!!formErrors[key]}
                              helperText={formErrors[key]}
                              type={type}
                              inputProps={{ ...inputProps, maxLength: maxLength }}
                              disabled={isSubmittedSuccessfully}
                              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            />
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Single Consent Checkbox at the bottom */}
            <Box sx={{ mt: 4, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentChecked}
                    onChange={handleConsentChange}
                    color="primary"
                    disabled={isSubmittedSuccessfully}
                  />
                }
                label="I consent to the verification of this information."
              />
              {formErrors.consent && (
                <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                  {formErrors.consent}
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting || isSubmittedSuccessfully}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : "Submit Verification"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}
