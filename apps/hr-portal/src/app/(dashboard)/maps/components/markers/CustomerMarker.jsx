"use client"

import { useCallback, useRef, useState } from "react"
import { AdvancedMarker } from "@vis.gl/react-google-maps"
import Box from "@mui/material/Box"
import SvgIcon from "@mui/material/SvgIcon"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import Zoom from "@mui/material/Zoom"

const CustomerMarker = ({ position, customerData, onClick }) => {
  const markerRef = useRef(null)
  const [hover, setHover] = useState(false)

  // Notify parent about marker click
  const handleClick = useCallback(() => {
    if (onClick && markerRef.current) {
      onClick(markerRef.current, customerData)
    }
  }, [onClick, customerData])

  // Get color based on customer type
  const getTypeColor = (type) => {
    if (!type) return "#6b7280" // Default gray

    switch (type.toLowerCase()) {
      case "corporate":
        return "#0ea5e9" // Sky blue
      case "sme":
        return "#8b5cf6" // Purple
      case "retail":
        return "#f97316" // Orange
      case "startup":
        return "#10b981" // Emerald
      case "healthcare":
        return "#ef4444" // Red
      case "education":
        return "#f59e0b" // Amber
      case "food & beverage":
        return "#ec4899" // Pink
      default:
        return "#6b7280" // Gray
    }
  }

  // Get customer data from properties
  const name = customerData.name || "Unknown Customer"
  const businessType = customerData.businessType || customerData.type || "Corporate"
  const contactPerson = customerData.contactPerson || "Not specified"

  const color = getTypeColor(businessType)

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
              {businessType}
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              Contact: {contactPerson}
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
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: "50%",
                border: `2px solid ${color}`,
                boxShadow: `0 3px 10px rgba(0, 0, 0, 0.2)`,
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                transform: hover ? "scale(1.1)" : "scale(1)",
                "&:hover": {
                  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.3)`,
                },
              }}
            >
              <SvgIcon sx={{ color: color, fontSize: 22 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </SvgIcon>
            </Box>
          </AdvancedMarker>
        </Box>
      </Tooltip>
    </Box>
  )
}

export default CustomerMarker
