"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AdvancedMarker } from "@vis.gl/react-google-maps"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import Badge from "@mui/material/Badge"
import Zoom from "@mui/material/Zoom"

const EmployeeMarker = ({ position, employeeData, onClick, isTracking = false }) => {
  const markerRef = useRef(null)
  const [hover, setHover] = useState(false)

  // Notify parent about marker click
  const handleClick = useCallback(() => {
    if (onClick && markerRef.current) {
      onClick(markerRef.current, employeeData)
    }
  }, [onClick, employeeData])

  // Create a bouncing effect for tracked employees
  useEffect(() => {
    if (isTracking && markerRef.current) {
      const marker = markerRef.current
      let bounceTimer

      const startBounce = () => {
        if (marker.content) {
          marker.content.classList.add("employee-marker-bounce")
          bounceTimer = setTimeout(() => {
            marker.content.classList.remove("employee-marker-bounce")
            setTimeout(startBounce, 5000) // Restart bounce after 5 seconds
          }, 1000) // Bounce for 1 second
        }
      }

      startBounce()

      return () => {
        if (bounceTimer) clearTimeout(bounceTimer)
        if (marker.content) {
          marker.content.classList.remove("employee-marker-bounce")
        }
      }
    }
  }, [isTracking])

  // Get employee name and designation from properties
  const name = employeeData.name || employeeData.employeName || "Unknown Employee"
  const designation = employeeData.designation || employeeData.currentDesignation || ""
  const avatar = employeeData.avatar || employeeData.employeePhoto || ""

  return (
    <Box
      ref={markerRef}
      sx={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <Tooltip
        title={
          <Box sx={{ p: 0.5 }}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              {designation}
            </Typography>
          </Box>
        }
        arrow
        placement="top"
        TransitionComponent={Zoom}
        open={hover}
      >
        <Box sx={{ display: "inline-block" }}>
          <AdvancedMarker
            position={position}
            onClick={handleClick}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: isTracking ? "#16a34a" : "transparent",
                  boxShadow: isTracking ? "0 0 0 2px white" : "none",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "white",
                  borderRadius: "50%",
                  border: "3px solid #4f46e5",
                  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  transform: hover ? "scale(1.1)" : "scale(1)",
                  "&:hover": {
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                  },
                  ...(isTracking && {
                    border: "3px solid #16a34a",
                    boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.3), 0 3px 10px rgba(0, 0, 0, 0.2)",
                  }),
                }}
              >
                {avatar ? (
                  <Avatar
                    src={avatar}
                    alt={name}
                    sx={{
                      width: 36,
                      height: 36,
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: "#4f46e5",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </Avatar>
                )}
              </Box>
            </Badge>
          </AdvancedMarker>
        </Box>
      </Tooltip>
    </Box>
  )
}

export default EmployeeMarker
