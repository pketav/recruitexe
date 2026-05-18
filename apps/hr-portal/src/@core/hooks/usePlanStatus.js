"use client"

import { useState, useEffect } from "react"
import { useApi } from "./useApi"
import { useAuth } from "../../context/AuthContext"

export const usePlanStatus = () => {
  const [planDetails, setPlanDetails] = useState(null)
  const [usage, setUsage] = useState(null)
  const [error, setError] = useState(null)

  const { callApi, loading: isLoading } = useApi()
  const { token } = useAuth()  // ✅ Now tied to login/logout

  const fetchPlanStatus = async () => {
    try {
      setError(null)

      const result = await callApi({
        endpoint: "/v1/api/Auth/plancreditremaining",
        method: "GET",
        disableSnackbar: true,
      })

      if (result.success && result.data.status && result.data.items) {
        setPlanDetails(result.data.items.planDetails)
        setUsage(result.data.items.usage)
      } else {
        throw new Error(result.message || "Failed to fetch plan status")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Plan status fetch error:", err)
    }
  }

  // ✅ Refetch whenever token becomes available (after login or reload)
  useEffect(() => {
    if (token) {
      fetchPlanStatus()
    }
  }, [token])

  const isPlanExpired = planDetails ? !planDetails.isActive : false

  return {
    planDetails,
    usage,
    isLoading,
    error,
    isPlanExpired,
    refetch: fetchPlanStatus,
  }
}
