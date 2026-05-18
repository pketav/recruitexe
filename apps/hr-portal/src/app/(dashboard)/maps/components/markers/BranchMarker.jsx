"use client"

import { useCallback, useRef, useState } from "react"
import { AdvancedMarker } from "@vis.gl/react-google-maps"
import Box from "@mui/material/Box"
import SvgIcon from "@mui/material/SvgIcon"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import Zoom from "@mui/material/Zoom"
import Chip from "@mui/material/Chip"

const BranchMarker = ({ position, branchData, onClick }) => {
  const markerRef = useRef(null)
  const [hover, setHover] = useState(false)

  // Notify parent about marker click
  const handleClick = useCallback(() => {
    if (onClick && markerRef.current) {
      onClick(markerRef.current, branchData)
    }
  }, [onClick, branchData])

  // Get branch data from properties
  const name = branchData.name || "Unknown Branch"
  const manager = branchData.manager || "Not specified"
  const employeeCount = branchData.employeeCount || 0
  const address = branchData.address || ""

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
              Manager: {manager}
            </Typography>
            {address && (
              <Typography variant="caption" sx={{ display: "block" }}>
                {address}
              </Typography>
            )}
            <Chip
              label={`${employeeCount} Employees`}
              size="small"
              sx={{
                mt: 0.5,
                height: 20,
                bgcolor: "rgba(202, 138, 4, 0.2)",
                color: "#ca8a04",
                fontSize: "0.625rem",
                "& .MuiChip-label": { px: 1 },
              }}
            />
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
                width: 46,
                height: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: 2,
                border: "3px solid #ca8a04",
                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                transform: hover ? "scale(1.1)" : "scale(1)",
                "&:hover": {
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.4)",
                },
              }}
            >
              <SvgIcon sx={{ color: "#ca8a04", fontSize: 26 }}>
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
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </SvgIcon>
            </Box>
          </AdvancedMarker>
        </Box>
      </Tooltip>
    </Box>
  )
}

export default BranchMarker
