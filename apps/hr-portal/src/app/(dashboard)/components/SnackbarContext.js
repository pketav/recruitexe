"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { Snackbar, Alert } from "@mui/material"

const SnackbarContext = createContext()

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState("success")

  // Function to determine severity based on subCode
  const getSeverityFromSubCode = (subCode) => {
    switch (subCode) {
      case "success":
      case "200":
      case "201":
        return "success"
      case "error":
      case "400":
      case "401":
      case "403":
      case "404":
      case "500":
        return "error"
      case "warning":
      case "warn":
        return "warning"
      case "info":
      case "information":
        return "info"
      default:
        // If subCode is a number, determine severity based on HTTP status codes
        const code = Number.parseInt(subCode)
        if (code >= 200 && code < 300) return "success"
        if (code >= 400 && code < 500) return "warning"
        if (code >= 500) return "error"
        return "info"
    }
  }

  const showMessage = useCallback((message, subCode = "success") => {
    const determinedSeverity = getSeverityFromSubCode(subCode)
    setMessage(message)
    setSeverity(determinedSeverity)
    setOpen(true)
  }, [])

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = { showMessage }

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{
            width: "100%"
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error("useSnackbarContext must be used within a SnackbarProvider")
  }
  return context
}
