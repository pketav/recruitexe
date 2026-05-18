"use client"

import { useState, useCallback } from "react"
import axios from "axios"
import { useSnackbarContext } from "../../app/(dashboard)/components/SnackbarContext"

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const { showMessage } = useSnackbarContext()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const callApi = useCallback(
    async ({ endpoint, method = "GET", data = null, successMessage, errorMessage, disableSnackbar = false }) => {
      setLoading(true)
      try {
        const token = localStorage.getItem("authToken") // ← ✅ moved inside
        const response = await axios({
          method,
          url: `${baseUrl}${endpoint}`,
          data,
          headers: {
            Authorization: `${token}`,
          },
        })

        const msg = successMessage ? successMessage : response.data.message
        const subCode = response.data.subCode || "success"

        if (!disableSnackbar) showMessage(msg, subCode)

        return {
          success: true,
          message: msg,
          data: response.data,
          subCode: subCode,
        }
      } catch (error) {
        const msg = errorMessage || error?.response?.data?.message || "An error occurred"
        const subCode = error?.response?.data?.subCode || "error"

        if (!disableSnackbar) showMessage(msg, subCode)

        return {
          success: false,
          message: msg,
          error,
          subCode: subCode,
        }
      } finally {
        setLoading(false)
      }
    },
    [showMessage, baseUrl], // ✅ removed token
  )

  return { callApi, loading }
}
