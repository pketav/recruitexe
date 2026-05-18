"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import {
  Container,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material"
import { ExitToApp, VideocamOff, Schedule, Warning, Psychology, CheckCircle, Error, ContactSupport, VolumeUp, VolumeOff, Refresh } from "@mui/icons-material"

// Components (assuming these are also converted to JSX or are simple enough)
import LoadingScreen from "./components/LoadingScreen"
import ErrorScreen from "./components/ErrorScreen"
import InterviewHeader from "./components/InterviewHeader"
import ScheduleStatus from "./components/ScheduleStatus"
import LateInterviewAlert from "./components/LateInterviewAlert"
import InterviewStepper from "./components/InterviewStepper"
import VideoPanel from "./components/VideoPanel"
import ChatInterface from "./components/ChatInterface"
import InputControls from "./components/InputControls"
import CompletionScreen from "./components/CompletionScreen"
import PermissionDialog from "./components/PermissionDialog"

// Hooks
import { useInterview } from "@core/hooks/useInterview"
import { useSpeechRecognition } from "@core/hooks/useSpeechRecognition"
import { useVideoRecording } from "@core/hooks/useVideoRecording"

// Utils
import { getTimeStatus } from "@core/utils/timeUtils"
import { useApi } from "@core/hooks/useApi"

export default function AIInterviewPage() {
  const searchParams = useSearchParams()
  const { callApi } = useApi()

  // Client-side check
  const [isClient, setIsClient] = useState(false)
  const [interviewId, setInterviewId] = useState(null)

  // Hooks
  const interview = useInterview(interviewId)
  const speechRecognition = useSpeechRecognition()
  const videoRecording = useVideoRecording() // videoRef is managed internally by useVideoRecording

  // Additional states
  const [inputTab, setInputTab] = useState(0)
  const [textInput, setTextInput] = useState("")
  const [scheduleValidation, setScheduleValidation] = useState({
    isValid: false,
    message: "",
    canStart: false,
    timeUntilStart: 0,
    scheduledTime: null,
  })
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [isCompletingInterview, setIsCompletingInterview] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false)

  // Refs
  const messagesEndRef = useRef(null)
  const speechSynthesis = useRef(null)
  const scheduleTimerRef = useRef(null)
  const completionTimeoutRef = useRef(null)

  // Client-side initialization
  useEffect(() => {
    setIsClient(true)
    if (searchParams) {
      setInterviewId(searchParams.get("InterviewId"))
    }
  }, [searchParams])

  // Schedule validation
  useEffect(() => {
    if (!isClient || !interview.interviewData?.scheduleDate || interview.interviewData?.isComplete) {
      return
    }
    const validateSchedule = () => {
      const status = getTimeStatus(interview.interviewData.scheduleDate)
      setScheduleValidation(status)
    }
    validateSchedule()
    scheduleTimerRef.current = setInterval(validateSchedule, 60000)
    return () => {
      if (scheduleTimerRef.current) {
        clearInterval(scheduleTimerRef.current)
      }
    }
  }, [isClient, interview.interviewData])

  // Initialize speech synthesis
  useEffect(() => {
    if (!isClient) return
    speechSynthesis.current = window.speechSynthesis
  }, [isClient])

  // Speech synthesis functions
  const getFemaleVoice = () => {
    if (!isClient || !speechSynthesis.current) return null
    // Wait for voices to load
    let voices = speechSynthesis.current.getVoices()
    // If no voices loaded yet, try to trigger loading
    if (voices.length === 0) {
      speechSynthesis.current.getVoices()
      voices = speechSynthesis.current.getVoices()
    }
    const preferredVoices = [
      "Microsoft Zira Desktop - English (United States)",
      "Google UK English Female",
      "Microsoft Hazel Desktop - English (Great Britain)",
      "Samantha",
      "Victoria",
      "Karen",
      "Susan",
      "Allison",
    ]
    for (const preferredName of preferredVoices) {
      const voice = voices.find((v) => v.name.includes(preferredName))
      if (voice) {
        return voice
      }
    }
    const femaleVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("woman") ||
        voice.name.toLowerCase().includes("zira") ||
        voice.name.toLowerCase().includes("hazel") ||
        voice.name.toLowerCase().includes("samantha"),
    )
    if (femaleVoice) {
      return femaleVoice
    }
    const englishVoice = voices.find((v) => v.lang.includes("en"))
    if (englishVoice) {
      return englishVoice
    }
    return voices[0]
  }

  const speakText = (text) => {
    if (!isClient || !speechSynthesis.current) {
      return
    }
    // Cancel any ongoing speech
    speechSynthesis.current.cancel()
    // Wait a bit before starting new speech
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      const femaleVoice = getFemaleVoice()
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }
      utterance.rate = 0.85
      utterance.pitch = 1.1
      utterance.volume = 0.9
      utterance.onstart = () => {
        setIsSpeaking(true)
      }
      utterance.onend = () => {
        setIsSpeaking(false)
      }
      utterance.onerror = (error) => {
        console.error("🚫 Speech synthesis error:", error)
        setIsSpeaking(false)
      }
      speechSynthesis.current.speak(utterance)
    }, 200)
  }

  const stopSpeaking = () => {
    if (!isClient || !speechSynthesis.current) return
    speechSynthesis.current.cancel()
    setIsSpeaking(false)
  }

  // Interview functions
  const handleSetupPermissions = async () => {
    // Trigger video recording start to request permissions
    videoRecording.startVideoRecording()
    // We rely on the videoRef showing the stream to indicate permissions are granted.
    // The PermissionDialog will close when currentStep changes.
    setTimeout(() => {
      if (videoRecording.videoStream) {
        interview.setCurrentStep(2)
      }
    }, 1000); // Give a second for permissions to be requested/granted
  }

  const handleStartInterview = async () => {
    // Check if video stream is available (implies permissions granted)
    if (!videoRecording.videoStream) {
      console.error("Cannot start interview: Camera/Mic permissions not granted or stream not available.")
      return
    }
    if (!scheduleValidation.canStart) {
      return
    }
    // Ensure recording is started if not already
    if (!videoRecording.isVideoRecording) {
      videoRecording.startVideoRecording()
    }
    // Get the initial AI response and speak it
    const initialResponse = await interview.startInterview()
    if (initialResponse) {
      setTimeout(() => {
        speakText(initialResponse)
      }, 1000)
    }
  }

  const handleCompleteInterview = async () => {
    // Prevent double-clicking
    if (isCompletingInterview) return
    setShowCompleteDialog(false)
    setIsCompletingInterview(true)

    // Clear any existing timeout
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current)
    }

    let videoBlob = null;
    try {
      // Stop video recording and wait for the blob to be ready
      if (videoRecording.isVideoRecording) { // Only stop if currently recording
        videoBlob = await videoRecording.stopVideoRecording(); // This now returns the compressed blob
      } else if (videoRecording.recordedBlob) { // If already stopped but blob exists
        videoBlob = videoRecording.recordedBlob;
      }

      let videoUrl = "";
      if (videoBlob) {
        const videoFile = new File([videoBlob], `interview-${interviewId}-${Date.now()}.webm`, {
          type: videoBlob.type,
        })
        videoUrl = await videoRecording.uploadRecordedVideo(videoFile) || "";
      } else {
        console.warn("No video blob available to upload after stopping recording or if not recording.");
      }
      
      // Complete interview with video URL
      const result = await callApi({
        endpoint: `/v1/api/interview/completeInterviewManually?interviewId=${interviewId}&videoUrl=${videoUrl}`,
        method: "POST",
        disableSnackbar: true,
      })
      if (result.success) {
        interview.setIsInterviewComplete(true)
        interview.setCurrentStep(3)
      }
    } catch (error) {
      console.error("❌ Error completing interview:", error)
    } finally {
      setIsCompletingInterview(false)
    }
  }

  // Enhanced speech recognition handlers
  const handleSpeakStart = useCallback(
    (e) => {
      e.preventDefault()
      if (
        !isClient ||
        !interview.interviewStarted ||
        interview.isInterviewComplete ||
        isSpeaking ||
        interview.loading ||
        !speechRecognition.recognitionSupported ||
        isProcessingAnswer ||
        inputTab !== 0
      ) {
        return
      }
      // Reset all transcripts
      speechRecognition.resetTranscripts()
      setIsProcessingAnswer(false)
      // Start recognition with delay to ensure clean start
      setTimeout(() => {
        speechRecognition.startContinuousRecognition()
      }, 100)
    },
    [
      isClient,
      interview.interviewStarted,
      interview.isInterviewComplete,
      isSpeaking,
      interview.loading,
      speechRecognition.recognitionSupported,
      isProcessingAnswer,
      inputTab,
      speechRecognition,
    ],
  )

  const handleSpeakEnd = useCallback(
    (e) => {
      e.preventDefault()
      if (!speechRecognition.isRecording) return
      // Stop recognition and process the complete answer
      speechRecognition.stopContinuousRecognition()
      // Wait for final transcript to be processed
      setTimeout(() => {
        const completeTranscript = speechRecognition.getCompleteTranscript()
        if (completeTranscript && completeTranscript.length > 3) {
          handleSendMessage(completeTranscript)
        }
      }, 1000)
    },
    [speechRecognition.isRecording, speechRecognition.getCompleteTranscript, speechRecognition],
  )

  const handleSendMessage = async (messageText) => {
    if (!messageText || interview.loading || isProcessingAnswer) {
      return
    }
    setIsProcessingAnswer(true)
    speechRecognition.resetTranscripts()
    try {
      // Get the AI response directly from sendMessage
      const aiResponse = await interview.sendMessage(messageText)
      // Speak the AI response immediately if we got one
      if (aiResponse) {
        setTimeout(() => {
          speakText(aiResponse)
        }, 500)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsProcessingAnswer(false)
    }
  }

  const handleSendTextMessage = () => {
    const message = textInput.trim()
    if (message && !isProcessingAnswer && !interview.loading) {
      setTextInput("")
      handleSendMessage(message)
    }
  }

  const handleManualSend = () => {
    if (inputTab === 0) {
      const textToSend = speechRecognition.getCompleteTranscript()
      if (textToSend && !isProcessingAnswer) {
        handleSendMessage(textToSend)
      }
    } else {
      handleSendTextMessage()
    }
  }

  // Show loading screen while client-side initialization is happening
  if (!isClient) {
    return (
      <LoadingScreen
        title="Initializing RecruitExe AI"
        subtitle="Please wait while we set up your interview environment..."
      />
    )
  }

  if (!interviewId) {
    return (
      <ErrorScreen
        title="Invalid Interview Link"
        message="Please check your interview link and try again, or contact support."
      />
    )
  }

  if (interview.loadingInterviewData) {
    return (
      <LoadingScreen
        title="Loading Interview Details"
        subtitle="Please wait while we fetch your interview information..."
      />
    )
  }

  if (interview.interviewDataError) {
    return (
      <ErrorScreen
        title="Error Loading Interview"
        message={interview.interviewDataError}
        showRetry={true}
        onRetry={() => window.location.reload()}
      />
    )
  }

  if (!interview.interviewData) {
    return (
      <ErrorScreen
        title="Interview Not Found"
        message="The requested interview could not be found. Please contact support."
      />
    )
  }

  // If interview is complete, show completion screen
  if (interview.interviewData.isComplete) {
    return <CompletionScreen interviewData={interview.interviewData} messages={interview.messages} />
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Permission Dialog */}
      <PermissionDialog open={interview.currentStep === 1} onRequestPermissions={handleSetupPermissions} />
      {/* Manual Complete Interview Dialog */}
      <Dialog
        open={showCompleteDialog}
        onClose={() => !isCompletingInterview && setShowCompleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", pt: 3, bgcolor: "white" }}>
          <ExitToApp color="warning" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Complete Interview Early?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 2, bgcolor: "white" }}>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Are you sure you want to complete the interview now? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your responses will be saved and the interview will be marked as complete.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, bgcolor: "white", gap: 2 }}>
          <Button variant="outlined" onClick={() => setShowCompleteDialog(false)} disabled={isCompletingInterview}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleCompleteInterview}
            disabled={isCompletingInterview}
            startIcon={isCompletingInterview ? <CircularProgress size={20} /> : <ExitToApp />}
          >
            {isCompletingInterview ? "Completing..." : "Complete Interview"}
          </Button>
        </DialogActions>
      </Dialog>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <InterviewHeader timeElapsed={interview.timeElapsed} isComplete={false} />
        {/* Schedule Status */}
        {interview.interviewData.scheduleDate && !interview.interviewData.isComplete && (
          <ScheduleStatus scheduleValidation={scheduleValidation} />
        )}
        {/* Late Interview Alert */}
        {!interview.interviewData.isComplete && <LateInterviewAlert scheduleValidation={scheduleValidation} />}
        {/* Progress Stepper */}
        <InterviewStepper currentStep={interview.currentStep} />
        <Grid container spacing={3}>
          {/* Left Panel - Video */}
          <Grid item xs={12} md={4}>
            <VideoPanel
              videoRef={videoRecording.videoRef}
              cameraPermission={videoRecording.cameraPermission}
              currentStep={interview.currentStep}
              scheduleValidation={scheduleValidation}
              interviewStarted={interview.interviewStarted}
              isInterviewComplete={interview.isInterviewComplete}
              recognitionSupported={speechRecognition.recognitionSupported}
              recognitionError={speechRecognition.recognitionError}
              loading={interview.loading}
              isVideoRecording={videoRecording.isVideoRecording}
              uploadingVideo={videoRecording.uploadingVideo}
              videoUploadProgress={videoRecording.videoUploadProgress}
              isCompletingInterview={isCompletingInterview}
              isSpeaking={isSpeaking}
              isProcessingAnswer={isProcessingAnswer}
              isRecording={speechRecognition.isRecording}
              inputTab={inputTab}
              timeElapsed={interview.timeElapsed}
              durationMinutes={interview.interviewData.durationMinutes || 30}
              onSetupPermissions={handleSetupPermissions}
              onStartInterview={handleStartInterview}
              onCompleteInterview={() => setShowCompleteDialog(true)}
              onStopSpeaking={stopSpeaking}
              onResetRecognition={speechRecognition.resetRecognition}
            />
          </Grid>
          {/* Right Panel - Chat Interface */}
          <Grid item xs={12} md={8}>
            <ChatInterface
              messages={interview.messages}
              loading={interview.loading}
              isProcessingAnswer={isProcessingAnswer}
              currentStep={interview.currentStep}
              durationMinutes={interview.interviewData.durationMinutes || 30}
              messagesEndRef={messagesEndRef}
            />
            {/* Input Controls */}
            <InputControls
              interviewStarted={interview.interviewStarted}
              isInterviewComplete={interview.isInterviewComplete}
              inputTab={inputTab}
              setInputTab={setInputTab}
              isProcessingAnswer={isProcessingAnswer}
              isSpeaking={isSpeaking}
              recognitionSupported={speechRecognition.recognitionSupported}
              recognitionError={speechRecognition.recognitionError}
              transcript={speechRecognition.transcript}
              isRecording={speechRecognition.isRecording}
              textInput={textInput}
              setTextInput={setTextInput}
              loading={interview.loading}
              onSpeakStart={handleSpeakStart}
              onSpeakEnd={handleSpeakEnd}
              onSendTextMessage={handleSendTextMessage}
              onManualSend={handleManualSend}
              onResetRecognition={speechRecognition.resetRecognition}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}