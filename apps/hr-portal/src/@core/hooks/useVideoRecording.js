"use client"
import { useState, useRef, useEffect } from "react"
import { useReactMediaRecorder } from "react-media-recorder"
import { useApi } from "@core/hooks/useApi"

export const useVideoRecording = () => {
  const { callApi } = useApi()
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoUploadProgress, setVideoUploadProgress] = useState(0)
  const videoRef = useRef(null)

  // Promise resolver for when recording stops and blob is ready
  const stopRecordingPromiseRef = useRef(null);

  const VIDEO_CONFIG = {
    video: {
      width: { ideal: 640, max: 1280 },
      height: { ideal: 480, max: 720 },
      frameRate: { ideal: 15, max: 24 },
      facingMode: "user",
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 22050,
      channelCount: 1,
    },
  }

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
    error: mediaRecorderError,
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    constraints: VIDEO_CONFIG,
    onStop: (blobUrl, blob) => {
      compressVideoBlob(blob).then(compressedBlob => {
        setRecordedBlob(compressedBlob);
        if (stopRecordingPromiseRef.current) {
          stopRecordingPromiseRef.current.resolve(compressedBlob);
          stopRecordingPromiseRef.current = null;
        }
      }).catch(err => {
        console.error("Error during compression after stop:", err);
        setRecordedBlob(blob); // Fallback to original if compression fails
        if (stopRecordingPromiseRef.current) {
          stopRecordingPromiseRef.current.reject(err);
          stopRecordingPromiseRef.current = null;
        }
      });
    },
    onError: (error) => {
      console.error("MediaRecorder error from useReactMediaRecorder:", error);
      if (stopRecordingPromiseRef.current) {
        stopRecordingPromiseRef.current.reject(error);
        stopRecordingPromiseRef.current = null;
      }
    }
  })

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream
    }
  }, [previewStream])

  // Infer camera and microphone permissions from status and stream availability
  const cameraPermission = status !== 'failed' && status !== 'denied' && previewStream && previewStream.getVideoTracks().length > 0;
  const microphonePermission = status !== 'failed' && status !== 'denied' && previewStream && previewStream.getAudioTracks().length > 0;

  // Video compression function (kept from original)
  const compressVideoBlob = async (blob) => {
    try {
      // If the video is already small enough, return as-is
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (blob.size <= maxSize) {
        return blob
      }

      // Create a video element to process the blob
      const video = document.createElement("video")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          // Set canvas dimensions (reduced for compression)
          canvas.width = Math.min(video.videoWidth, 640)
          canvas.height = Math.min(video.videoHeight, 480)

          const stream = canvas.captureStream(15) // 15 FPS
          const compressedRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm;codecs=vp8",
            videoBitsPerSecond: 150000, // Further reduced bitrate
          })

          const compressedChunks = []
          compressedRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              compressedChunks.push(event.data)
            }
          }

          compressedRecorder.onstop = () => {
            const compressedBlob = new Blob(compressedChunks, { type: "video/webm" })
            resolve(compressedBlob)
          }

          compressedRecorder.start()

          // Draw video frames to canvas
          const drawFrame = () => {
            if (!video.paused && !video.ended) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
              requestAnimationFrame(drawFrame)
            }
          }
          video.play()
          video.onended = () => {
            compressedRecorder.stop()
          }
          drawFrame()
        }
        video.src = URL.createObjectURL(blob)
      })
    } catch (error) {
      console.error("❌ Error compressing video:", error)
      return blob // Return original if compression fails
    }
  }

  const uploadRecordedVideo = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    try {
      setUploadingVideo(true)
      setVideoUploadProgress(0)
      const result = await callApi({
        endpoint: "/v1/api/upload/uploadSingle",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setVideoUploadProgress(progress)
        },
      })
      if (result.success && result.data?.url) {
        return result.data.url
      } else {
        console.error("❌ Video upload failed:", result)
        return null
      }
    } catch (error) {
      console.error("❌ Error uploading video:", error)
      return null
    } finally {
      setUploadingVideo(false)
      setVideoUploadProgress(0)
    }
  }

  // Wrapper for stopRecording that returns a promise
  const stopVideoRecordingAndGetBlob = () => {
    return new Promise((resolve, reject) => {
      stopRecordingPromiseRef.current = { resolve, reject };
      stopRecording(); // This will trigger onStop callback which resolves/rejects the promise
    });
  };

  return {
    isVideoRecording: status === 'recording',
    recordedBlob,
    uploadingVideo,
    videoUploadProgress,
    videoStream: previewStream,
    cameraPermission,
    microphonePermission,
    videoRef,
    requestPermissions: startRecording,
    startVideoRecording: startRecording,
    stopVideoRecording: stopVideoRecordingAndGetBlob, // Use the new wrapper
    uploadRecordedVideo,
    status,
    error: mediaRecorderError,
  }
}