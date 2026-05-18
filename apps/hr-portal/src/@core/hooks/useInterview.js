"use client"
import { useState, useEffect, useRef } from "react"
import { useApi } from "./useApi"

export const useInterview = (interviewId) => {
  const { callApi, loading } = useApi()

  // Core states
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState([])
  const [isInterviewComplete, setIsInterviewComplete] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  // Interview data states
  const [interviewData, setInterviewData] = useState(null)
  const [loadingInterviewData, setLoadingInterviewData] = useState(true)
  const [interviewDataError, setInterviewDataError] = useState("")

  // Timer ref
  const timerRef = useRef(null)

  // Fetch interview data
  useEffect(() => {
    if (!interviewId) return

    const fetchInterviewData = async () => {
      try {
        setLoadingInterviewData(true)
        setInterviewDataError("")

        const result = await callApi({
          endpoint: `/v1/api/interview/getInterviewHistory?interviewId=${interviewId}`,
          method: "GET",
          disableSnackbar: true,
        })

        if (result.success && result.data?.items) {
          const data = result.data.items

          setInterviewData({
            scheduleDate: data.scheduleDate,
            durationMinutes: data.durationMinutes,
            isComplete: data.isComplete,
            language: data.language,
            candidateId: data.candidateId,
            jobId: data.jobId,
            history: data.history || [],
            summary: data.summary,
            aiDecision: data.aiDecision,
          })

          // If interview is already complete, load existing messages
          if (data.isComplete) {
            setIsInterviewComplete(true)
            setCurrentStep(3)

            const existingMessages = data.history
              .filter((item) => item.role === "user" || (item.role === "model" && item.content?.question))
              .map((item, index) => ({
                id: item._id || Date.now() + index,
                type: item.role === "user" ? "user" : "ai",
                content: item.role === "model" ? item.content.question : item.content,
                timestamp: new Date().toLocaleTimeString(),
                inputMethod: item.role === "user" ? "voice" : undefined,
              }))

            setMessages(existingMessages)
          }
        } else {
          setInterviewDataError("Failed to fetch interview details. Please contact support.")
        }
      } catch (error) {
        console.error("❌ Error fetching interview data:", error)
        setInterviewDataError("Failed to fetch interview details. Please contact support.")
      } finally {
        setLoadingInterviewData(false)
      }
    }

    fetchInterviewData()
  }, [interviewId])

  // Timer effect
  useEffect(() => {
    if (interviewStarted && !isInterviewComplete) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [interviewStarted, isInterviewComplete])

  const sendMessage = async (messageText) => {
    if (!messageText || loading) {
      return null
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString(),
      inputMethod: "voice",
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      const result = await callApi({
        endpoint: "/v1/api/interview/interviewTurnHandler",
        method: "POST",
        data: {
          interviewId: interviewId,
          userMessage: messageText,
        },
        disableSnackbar: true,
      })

      if (result.success && result.data?.items?.response) {
        const aiResponse = result.data.items.response.question

        const aiMessage = {
          id: Date.now() + 1,
          type: "ai",
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString(),
        }

        setMessages((prev) => [...prev, aiMessage])

        // Return the AI response text so it can be spoken immediately
        return aiResponse
      } else {
        console.error("❌ Invalid response from API:", result)
        return null
      }
    } catch (error) {
      console.error("❌ Error sending message:", error)

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "I apologize, but I'm having trouble processing your response. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
      }

      setMessages((prev) => [...prev, errorMessage])
      return errorMessage.content
    }
  }

  const startInterview = async () => {
    setInterviewStarted(true)
    setCurrentStep(2)

    try {
      const result = await callApi({
        endpoint: "/v1/api/interview/interviewTurnHandler",
        method: "POST",
        data: {
          interviewId: interviewId,
          userMessage: "Hello, I'm ready to start the interview.",
        },
        disableSnackbar: true,
      })

      if (result.success && result.data?.items?.response) {
        const aiResponse = result.data.items.response.question

        setMessages([
          {
            id: Date.now(),
            type: "ai",
            content: aiResponse,
            timestamp: new Date().toLocaleTimeString(),
          },
        ])

        // Return the AI response so it can be spoken
        return aiResponse
      }
    } catch (error) {
      console.error("❌ Error starting interview:", error)
      return null
    }
  }

  return {
    // States
    currentStep,
    setCurrentStep,
    messages,
    setMessages,
    isInterviewComplete,
    setIsInterviewComplete,
    interviewStarted,
    setInterviewStarted,
    timeElapsed,
    interviewData,
    loadingInterviewData,
    interviewDataError,
    loading,

    // Functions
    sendMessage,
    startInterview,
  }
}
