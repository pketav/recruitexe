"use client"

import { useEffect, useRef, useState } from "react"
import { Box, Typography, CircularProgress, Modal, Paper, Avatar, Chip, Divider } from "@mui/material"
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Place as PlaceIcon,
  Close as CloseIcon,
} from "@mui/icons-material"

export default function MapComponent({
  candidates,
  groupedCandidates,
  loading,
  formatDate,
  selectedCandidate,
  onCandidateSelect,
}) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [isMapReady, setIsMapReady] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalCandidates, setModalCandidates] = useState([])

  // India center coordinates
  const indiaCenter = [20.5937, 78.9629]

  // Create location marker icon
  const createLocationMarker = (candidateCount, L, isSelected = false) => {
    const size = candidateCount > 1 ? 50 : 40
    const selectedSize = isSelected ? size + 10 : size

    return L.divIcon({
      html: `
        <div class="marker-container" style="
          position: relative;
          width: ${selectedSize}px;
          height: ${selectedSize}px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <!-- Outer glow for selection (only show when selected, no animation on hover) -->
          ${
            isSelected
              ? `<div class="selection-glow" style="
                position: absolute;
                width: ${selectedSize + 20}px;
                height: ${selectedSize + 20}px;
                border-radius: 50%;
                background: rgba(236, 72, 153, 0.3);
                animation: gentle-pulse 3s ease-in-out infinite;
              "></div>`
              : ""
          }
          
          <!-- Main marker -->
          <div class="main-marker" style="
            position: relative;
            width: ${selectedSize}px;
            height: ${selectedSize}px;
            background: ${
              isSelected
                ? "linear-gradient(135deg, #ec4899, #f472b6)"
                : candidateCount > 5
                  ? "linear-gradient(135deg, #ef4444, #f97316)"
                  : candidateCount > 1
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "linear-gradient(135deg, #10b981, #34d399)"
            };
            border: 4px solid white;
            border-radius: 50%;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            z-index: ${isSelected ? "1000" : "100"};
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            
            ${
              candidateCount > 1
                ? `<div class="count-badge" style="
                  position: absolute;
                  top: -8px;
                  right: -8px;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #ef4444, #f97316);
                  color: white;
                  font-size: 12px;
                  font-weight: bold;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 2px solid white;
                  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
                ">${candidateCount}</div>`
                : ""
            }
          </div>
        </div>
      `,
      className: "location-marker",
      iconSize: [selectedSize + 20, selectedSize + 20],
      iconAnchor: [(selectedSize + 20) / 2, (selectedSize + 20) / 2],
      popupAnchor: [0, -(selectedSize + 20) / 2],
    })
  }

  // Initialize map
  useEffect(() => {
    let L
    let map

    const initializeMap = async () => {
      try {
        L = (await import("leaflet")).default

        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        await import("leaflet/dist/leaflet.css")

        if (mapRef.current && !mapInstanceRef.current) {
          map = L.map(mapRef.current, {
            zoomControl: true,
            attributionControl: false,
            minZoom: 4,
            maxZoom: 12,
          }).setView(indiaCenter, 5)

          const indiaBounds = L.latLngBounds([6.4627, 68.1097], [35.5137, 97.3953])
          map.setMaxBounds(indiaBounds)

          // Modern map tiles
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 19,
          }).addTo(map)

          mapInstanceRef.current = map
          setIsMapReady(true)
        }
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    initializeMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      setIsMapReady(false)
    }
  }, [])

  // Update markers when candidates change
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return

    const L = window.L || require("leaflet")

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // Add new markers
    Object.entries(groupedCandidates).forEach(([locationKey, locationCandidates]) => {
      const firstCandidate = locationCandidates[0]
      const isSelected = selectedCandidate && locationCandidates.some((c) => c.name === selectedCandidate.name)

      const marker = L.marker([firstCandidate.latitude, firstCandidate.longitude], {
        icon: createLocationMarker(locationCandidates.length, L, isSelected),
      })

      // Hover tooltip
      const tooltipContent = `
        <div style="
          font-family: 'Inter', sans-serif; 
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          color: #1e293b;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 250px;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(99, 102, 241, 0.1);
          ">
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: linear-gradient(135deg, #6366f1, #ec4899);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
            ">
              📍
            </div>
            <div>
              <div style="font-weight: 600; font-size: 14px; color: #1e293b;">
                ${locationCandidates.length} Candidate${locationCandidates.length > 1 ? "s" : ""}
              </div>
              <div style="color: #64748b; font-size: 11px;">
                📍 ${firstCandidate.branchNames.join(", ")} • ${firstCandidate.pincode}
              </div>
            </div>
          </div>
          
          <div style="color: #6366f1; font-size: 11px; font-weight: 600; text-align: center;">
            Click to view detailed information
          </div>
        </div>
      `

      marker.bindTooltip(tooltipContent, {
        permanent: false,
        direction: "top",
        offset: [0, -15],
        className: "modern-tooltip",
      })

      // Click to show detailed modal
      marker.on("click", () => {
        setModalCandidates(locationCandidates)
        setModalOpen(true)
        onCandidateSelect(locationCandidates[0])
      })

      marker.addTo(mapInstanceRef.current)
      markersRef.current.push(marker)
    })
  }, [candidates, groupedCandidates, isMapReady, selectedCandidate, onCandidateSelect])

  const handleCloseModal = () => {
    setModalOpen(false)
    setModalCandidates([])
  }

  return (
    <Box sx={{ height: "100%", position: "relative", borderRadius: 2, overflow: "hidden" }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />

      {/* Loading Overlay */}
      {(loading || !isMapReady) && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress
              size={80}
              thickness={4}
              sx={{
                color: "#6366f1",
                mb: 3,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
            <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 600, mb: 1 }}>
              {loading ? "Loading Candidates..." : "Initializing Map..."}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Preparing your talent discovery experience
            </Typography>
          </Box>
        </Box>
      )}

      {/* Candidate Details Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          sx={{
            maxWidth: "500px",
            width: "100%",
            maxHeight: "85vh",
            overflow: "auto",
            borderRadius: "16px",
            background: "white",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              cursor: "pointer",
              p: 1,
              borderRadius: "50%",
              background: "rgba(0, 0, 0, 0.05)",
              "&:hover": { background: "rgba(0, 0, 0, 0.1)" },
              zIndex: 10,
            }}
            onClick={handleCloseModal}
          >
            <CloseIcon sx={{ fontSize: 20, color: "#64748b" }} />
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 4 }}>
            {/* Multiple Candidates Header */}
            {modalCandidates.length > 1 && (
              <Box sx={{ mb: 3, textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  {modalCandidates.length} Candidates Found
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  at this location
                </Typography>
              </Box>
            )}

            {modalCandidates.map((candidate, index) => (
              <Box key={index}>
                {/* Candidate Number Badge for Multiple Candidates */}
                {modalCandidates.length > 1 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#6366f1",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#6366f1" }}>
                      Candidate {index + 1}
                    </Typography>
                  </Box>
                )}

                {/* Single Candidate Header (when only one candidate) */}
                {modalCandidates.length === 1 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
                      Candidate Details
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                      <LocationIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        {candidate.branchNames.join(", ")} • Pincode: {candidate.pincode}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Candidate Card */}
                <Box
                  sx={{
                    background: modalCandidates.length > 1 ? "#f8fafc" : "transparent",
                    borderRadius: modalCandidates.length > 1 ? "12px" : "0",
                    border: modalCandidates.length > 1 ? "1px solid #e2e8f0" : "none",
                    p: modalCandidates.length > 1 ? 3 : 0,
                    mb: index < modalCandidates.length - 1 ? 4 : 0,
                  }}
                >
                  {/* Candidate Info */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          background: candidate.resumeShortlisted === "active" ? "#10b981" : "#6366f1",
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                      >
                        {candidate.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", mb: 1 }}>
                          {candidate.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                          {candidate.position}
                        </Typography>

                        {/* Status Chips */}
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          <Chip
                            label={candidate.AI_Screeing_Status}
                            size="small"
                            sx={{
                              background: candidate.AI_Screeing_Status === "Completed" ? "#10b981" : "#f59e0b",
                              color: "white",
                              fontWeight: 500,
                              fontSize: "11px",
                            }}
                          />
                          <Chip
                            label={candidate.resumeShortlisted === "active" ? "Shortlisted" : "Not Shortlisted"}
                            size="small"
                            sx={{
                              background: candidate.resumeShortlisted === "active" ? "#10b981" : "#ef4444",
                              color: "white",
                              fontWeight: 500,
                              fontSize: "11px",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Contact & Date Grid */}
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, mb: 4 }}>
                    <Box
                      sx={{
                        background: "white",
                        borderRadius: "8px",
                        p: 2,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <PhoneIcon sx={{ color: "#6366f1", fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>
                          Contact Number
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        {candidate.mobileNumber}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        background: "white",
                        borderRadius: "8px",
                        p: 2,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <CalendarIcon sx={{ color: "#6366f1", fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>
                          Applied On
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        {formatDate(candidate.appliedAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Location Details */}
                  <Box
                    sx={{
                      background: "white",
                      borderRadius: "8px",
                      p: 3,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <PlaceIcon sx={{ color: "#6366f1", fontSize: 16 }} />
                      <Typography variant="body2" sx={{ color: "#6366f1", fontWeight: 600 }}>
                        Location Details
                      </Typography>
                    </Box>

                    <Box sx={{ display: "grid", gap: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, display: "block" }}>
                          Applied For Branch
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                          {candidate.branchNames.join(", ")}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, display: "block" }}>
                          Candidate's Location
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                          {candidate.district}, {candidate.state}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, display: "block" }}>
                          Pincode
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                          {candidate.pincode}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Divider between candidates (except for the last one) */}
                {index < modalCandidates.length - 1 && <Divider sx={{ my: 4, borderColor: "#e2e8f0" }} />}
              </Box>
            ))}
          </Box>
        </Paper>
      </Modal>

      {/* Custom Styles */}
      <style jsx global>{`
        /* Gentle pulse animation only for selected markers */
        @keyframes gentle-pulse {
          0% { 
            transform: scale(1); 
            opacity: 0.7; 
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.9; 
          }
          100% { 
            transform: scale(1); 
            opacity: 0.7; 
          }
        }

        /* Hover effects for markers - no conflicting animations */
        .location-marker:hover .main-marker {
          transform: scale(1.1) !important;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3) !important;
        }

        /* Ensure no animation conflicts */
        .location-marker .main-marker {
          animation: none !important;
        }

        /* Only selected markers get the pulse animation on the glow */
        .selection-glow {
          pointer-events: none;
        }

        /* Tooltip styles */
        .modern-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        /* Map control styles */
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(10px) !important;
          color: #6366f1 !important;
          border: none !important;
          font-weight: bold !important;
          transition: all 0.3s ease !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #6366f1 !important;
          color: white !important;
        }

        /* Prevent any unwanted animations or transitions */
        .marker-container * {
          animation-fill-mode: forwards;
        }
      `}</style>
    </Box>
  )
}
