"use client"
import { useState, useEffect, useRef } from "react"
import SpeechRecognition, { useSpeechRecognition as useReactSpeechRecognition } from "react-speech-recognition"

export const useSpeechRecognition = () => {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    resetTranscript,
  } = useReactSpeechRecognition()

  const [recognitionError, setRecognitionError] = useState("")

  // Custom error handling for more specific messages
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setRecognitionError("Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.")
    } else if (!isMicrophoneAvailable) {
      setRecognitionError("Microphone not available. Please check your microphone connection.")
    } else {
      setRecognitionError("")
    }

    // Listen for global SpeechRecognition errors if needed, though useReactSpeechRecognition handles many
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognitionInstance = SpeechRecognition.getRecognition();
      if (recognitionInstance) {
        recognitionInstance.onerror = (event) => {
          console.error("🚫 Speech recognition error (global):", event.error);
          const errorMessages = {
            "not-allowed": "Microphone access denied. Please allow microphone access and try again.",
            "no-speech": "No speech detected. Please speak clearly into your microphone.",
            "audio-capture": "No microphone found. Please check your microphone connection.",
            network: "Network error occurred. Please check your internet connection.",
            aborted: "Speech recognition was stopped.",
            "bad-grammar": "Speech recognition grammar error.",
            "language-not-supported": "Language not supported for speech recognition.",
          };
          const errorMessage = errorMessages[event.error] || `Recognition error: ${event.error}`;
          setRecognitionError(errorMessage);
        };
      }
    }

    return () => {
      // Clean up global error handler if set
      const recognitionInstance = SpeechRecognition.getRecognition();
      if (recognitionInstance) {
        recognitionInstance.onerror = null;
      }
    };
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);


  const startContinuousRecognition = (options = {}) => {
    // Stop any existing recognition first to ensure a clean start
    SpeechRecognition.stopListening();
    // Start with continuous mode
    SpeechRecognition.startListening({ continuous: true, ...options });
  };

  const stopContinuousRecognition = () => {
    SpeechRecognition.stopListening();
  };

  // getCompleteTranscript is now just the current transcript
  const getCompleteTranscript = () => {
    return transcript;
  };

  // resetRecognition now just resets transcript and restarts listening
  const resetRecognition = () => {
    resetTranscript();
    // Re-start listening if it was active before reset
    if (listening) {
      startContinuousRecognition();
    }
  };

  return {
    isRecording: listening, // Map to original isRecording
    transcript,
    finalTranscript: transcript, // Simplified, as package gives combined
    interimTranscript: "", // Simplified, as package gives combined
    recognitionSupported: browserSupportsSpeechRecognition,
    recognitionError,
    startContinuousRecognition,
    stopContinuousRecognition,
    resetTranscripts: resetTranscript, // Map to original resetTranscripts
    getCompleteTranscript,
    resetRecognition,
  }
}