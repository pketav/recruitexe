"use client"

import { useMemo, useCallback, useState, useRef } from "react"
import { AdvancedMarker } from "@vis.gl/react-google-maps"
import { useSupercluster } from "../hooks/useSupercluster"
import EmployeeMarker from "./markers/EmployeeMarker"
import CustomerMarker from "./markers/CustomerMarker"
import BranchMarker from "./markers/BranchMarker"
import Tooltip from "@mui/material/Tooltip"
import Zoom from "@mui/material/Zoom"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

// Custom cluster marker component
const ClusterMarker = ({ count, position, onClick, type }) => {
  // Calculate size based on point count
  const size = Math.min(60, Math.max(40, 30 + count / 2))
  const fontSize = Math.min(20, Math.max(14, 12 + count / 10))
  const [hover, setHover] = useState(false)
  const markerRef = useRef(null)

  // Determine color based on marker type
  let bgColor
  let shadowColor

  switch (type) {
    case "employee":
      bgColor = "#4f46e5" // Indigo for employees
      shadowColor = "rgba(79, 70, 229, 0.35)"
      break
    case "customer":
      bgColor = "#0ea5e9" // Sky blue for customers
      shadowColor = "rgba(14, 165, 233, 0.35)"
      break
    case "branch":
      bgColor = "#ca8a04" // Yellow for branches
      shadowColor = "rgba(202, 138, 4, 0.35)"
      break
    default:
      bgColor = "#1e40af" // Default blue
      shadowColor = "rgba(30, 64, 175, 0.35)"
  }

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
            <Typography variant="subtitle2">Location Group</Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              {count} items in this area
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
            onClick={onClick}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
          >
            <Box
              sx={{
                width: size,
                height: size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                backgroundColor: bgColor,
                borderRadius: "50%",
                border: "4px solid white",
                boxShadow: `0 0 0 4px ${shadowColor}, 0 4px 8px rgba(0, 0, 0, 0.3)`,
                fontWeight: "bold",
                fontSize: fontSize,
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                transform: hover ? "scale(1.1)" : "scale(1)",
                "&:hover": {
                  boxShadow: `0 0 0 4px ${shadowColor}, 0 6px 16px rgba(0, 0, 0, 0.4)`,
                },
                zIndex: 1,
              }}
            >
              {count}
            </Box>
          </AdvancedMarker>
        </Box>
      </Tooltip>
    </Box>
  )
}

const AdvancedMarkerClusterer = ({
  points,
  clusteringEnabled = true,
  onMarkerClick,
  filters = { employees: true, customers: true, branches: true },
  trackedEmployeeId = null,
}) => {
  // Initialize clustering with the Supercluster algorithm
  const { clusters, getLeaves } = useSupercluster(points, {
    radius: 75,
    maxZoom: 15,
    minZoom: 3,
    map: (props) => {
      // Add type information to clusters
      return {
        type: props.type,
      }
    },
  })

  // Function to determine dominant type in a cluster
  const getClusterType = useCallback((cluster, getLeaves) => {
    if (!cluster.properties.cluster) {
      // For individual markers, use their own type
      return cluster.properties.type
    }

    // For clusters, determine the dominant type from leaves
    const leaves = getLeaves(cluster.properties.cluster_id, Number.POSITIVE_INFINITY)
    const typeCounts = {}

    leaves.forEach((leaf) => {
      const type = leaf.properties.type
      typeCounts[type] = (typeCounts[type] || 0) + 1
    })

    // Find the type with the highest count
    let dominantType = "mixed"
    let maxCount = 0

    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count
        dominantType = type
      }
    })

    return dominantType
  }, [])

  // Memoized filtered clusters
  const filteredClusters = useMemo(() => {
    if (!clusteringEnabled) return []

    return clusters.filter((cluster) => {
      // Always show clusters
      if (cluster.properties.cluster) return true

      // Filter individual points by type
      const type = cluster.properties.type
      if (type === "employee" && !filters.employees) return false
      if (type === "customer" && !filters.customers) return false
      if (type === "branch" && !filters.branches) return false

      return true
    })
  }, [clusters, clusteringEnabled, filters])

  // Memoized individual markers when clustering is disabled
  const individualMarkers = useMemo(() => {
    if (clusteringEnabled) return null

    const features = points?.features || []
    return features
      .filter((feature) => {
        const type = feature.properties.type
        if (type === "employee" && !filters.employees) return false
        if (type === "customer" && !filters.customers) return false
        if (type === "branch" && !filters.branches) return false
        return true
      })
      .map((feature) => {
        const [lng, lat] = feature.geometry.coordinates
        const position = { lat, lng }
        const props = feature.properties

        switch (props.type) {
          case "employee":
            return (
              <EmployeeMarker
                key={props.id}
                position={position}
                employeeData={props}
                onClick={(marker) => onMarkerClick(position, props)}
                isTracking={props.id === trackedEmployeeId}
              />
            )
          case "customer":
            return (
              <CustomerMarker
                key={props.id}
                position={position}
                customerData={props}
                onClick={(marker) => onMarkerClick(position, props)}
              />
            )
          case "branch":
            return (
              <BranchMarker
                key={props.id}
                position={position}
                branchData={props}
                onClick={(marker) => onMarkerClick(position, props)}
              />
            )
          default:
            return null
        }
      })
  }, [clusteringEnabled, points, filters, onMarkerClick, trackedEmployeeId])

  // Handle cluster click
  const handleClusterClick = useCallback(
    (clusterId) => {
      const leaves = getLeaves(clusterId, Number.POSITIVE_INFINITY)

      // For small clusters, show info window with all points
      if (leaves.length <= 10) {
        onMarkerClick(null, {
          clusterPoints: leaves.map((leaf) => ({
            ...leaf.properties,
            position: {
              lat: leaf.geometry.coordinates[1],
              lng: leaf.geometry.coordinates[0],
            },
          })),
        })
      }
      // For larger clusters, we want the map to zoom in towards the cluster
      else if (window.google && window.google.maps) {
        const map = window.google.maps
        const bounds = new map.LatLngBounds()

        leaves.forEach((leaf) => {
          const [lng, lat] = leaf.geometry.coordinates
          bounds.extend({ lat, lng })
        })

        // Use the map instance from the parent component to zoom
        if (map.event && map.event.trigger) {
          map.event.trigger("bounds_changed", bounds)
        }
      }
    },
    [getLeaves, onMarkerClick],
  )

  // Render clustered markers
  const renderClusters = useCallback(() => {
    return filteredClusters.map((cluster) => {
      const [lng, lat] = cluster.geometry.coordinates
      const position = { lat, lng }

      // If this is a cluster
      if (cluster.properties.cluster) {
        return (
          <ClusterMarker
            key={`cluster-${cluster.id}`}
            position={position}
            count={cluster.properties.point_count}
            onClick={() => handleClusterClick(cluster.properties.cluster_id)}
            type={getClusterType(cluster, getLeaves)}
          />
        )
      }

      // Individual markers
      const props = cluster.properties

      switch (props.type) {
        case "employee":
          return (
            <EmployeeMarker
              key={props.id}
              position={position}
              employeeData={props}
              onClick={(marker) => onMarkerClick(position, props)}
              isTracking={props.id === trackedEmployeeId}
            />
          )
        case "customer":
          return (
            <CustomerMarker
              key={props.id}
              position={position}
              customerData={props}
              onClick={(marker) => onMarkerClick(position, props)}
            />
          )
        case "branch":
          return (
            <BranchMarker
              key={props.id}
              position={position}
              branchData={props}
              onClick={(marker) => onMarkerClick(position, props)}
            />
          )
        default:
          return null
      }
    })
  }, [filteredClusters, handleClusterClick, onMarkerClick, trackedEmployeeId, getClusterType, getLeaves])

  return <>{clusteringEnabled ? renderClusters() : individualMarkers}</>
}

export default AdvancedMarkerClusterer
