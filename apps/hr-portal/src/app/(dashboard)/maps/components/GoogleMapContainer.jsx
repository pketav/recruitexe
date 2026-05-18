"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useTheme } from "@mui/material/styles"
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps"
// Import API service functions instead of static data
import {
  getEmployeeData,
  getBranchData,
  convertEmployeesToGeoJson,
  convertBranchesToGeoJson,
  isValidBranchForMap,
} from "../services/api"
// Still importing this for now as we haven't replaced it yet
import { customersGeoJson } from "../data/customersData"
import { useTracking } from "../hooks/useTracking"
import AdvancedMarkerClusterer from "./AdvancedMarkerClusterer"
import InfoWindow from "./InfoWindow"
import FilterPanel from "./FilterPanel"
import Sidebar from "./Sidebar"
import { format } from "date-fns"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import SvgIcon from "@mui/material/SvgIcon"
import CircularProgress from "@mui/material/CircularProgress"
import Fade from "@mui/material/Fade"
import socket from "../utils/socket"
import { CustomPolyline } from "./CustomPolyline"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"

// Declare google variable
let google

// Loading state component
const MapLoadingState = () => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.8)",
        zIndex: 9999,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress size={60} thickness={4} />
        <Box sx={{ mt: 2, typography: "h6", fontWeight: "medium", color: theme.palette.text.primary }}>
          Loading Map...
        </Box>
      </Box>
    </Box>
  )
}

// Error state component
const MapErrorState = ({ message, onRetry }) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.8)",
        zIndex: 9999,
      }}
    >
      <Box sx={{ textAlign: "center", maxWidth: "80%" }}>
        <SvgIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }}>
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
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </SvgIcon>
        <Box sx={{ typography: "h6", fontWeight: "medium", color: theme.palette.text.primary, mb: 2 }}>
          Error Loading Map Data
        </Box>
        <Box sx={{ typography: "body1", color: theme.palette.text.secondary, mb: 3 }}>
          {message || "There was a problem loading the map data. Please try again."}
        </Box>
        <IconButton
          onClick={onRetry}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          <SvgIcon>
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
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
          </SvgIcon>
        </IconButton>
      </Box>
    </Box>
  )
}

// Main Google Map container component
const GoogleMapContainer = () => {
  // Get API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // State for map controls and data
  const [mapInstance, setMapInstance] = useState(null)
  const [filters, setFilters] = useState({ employees: true, customers: true, branches: true })
  const [employeesData, setEmployeesData] = useState([])
  const [employeesGeoJson, setEmployeesGeoJson] = useState({ type: "FeatureCollection", features: [] })
  const [branchesData, setBranchesData] = useState([])
  const [branchesGeoJson, setBranchesGeoJson] = useState({ type: "FeatureCollection", features: [] })

  const [clusteringEnabled, setClusteringEnabled] = useState(false) // Disable clustering by default
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [infoWindowPosition, setInfoWindowPosition] = useState(null)
  const [showTimeline, setShowTimeline] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [mapStyle, setMapStyle] = useState("8f065e2dc73e4456") // Light mode map ID
  const [isLoading, setIsLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)
  const [liveUserLocations, setLiveUserLocations] = useState({})
  const [shouldClearPath, setShouldClearPath] = useState(false)
  const [error, setError] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")

  // Create refs for functions to break circular dependencies
  const flyToLocationRef = useRef(null)

  const {
    selectedEmployee,
    selectedDate,
    trackingData,
    liveTrackingActive,
    toggleLiveTracking,
    viewHistory,
    setSelectedDate,
  } = useTracking()

  // Helper function to show notifications - define early
  const showNotification = useCallback((message, severity = "info") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }, [])

  // Define extractCoordinatesFromItem early - it's used by multiple functions
  const extractCoordinatesFromItem = useCallback((item) => {
    // Case 1: GeoJSON format
    if (item.location && item.location.type === "Point" && Array.isArray(item.location.coordinates)) {
      const [lng, lat] = item.location.coordinates
      return { lat, lng }
    }

    // Case 2: Standard format
    if (item.currentLocation && item.currentLocation.lat && item.currentLocation.long) {
      return {
        lat: Number.parseFloat(item.currentLocation.lat),
        lng: Number.parseFloat(item.currentLocation.long),
      }
    }

    // Case 3: Location with lat/lng
    if (item.location && item.location.lat && (item.location.lng || item.location.long)) {
      return {
        lat: Number.parseFloat(item.location.lat),
        lng: Number.parseFloat(item.location.lng || item.location.long),
      }
    }

    return null
  }, [])

  // Function to animate flying to a location - define early and store in ref
  const flyToLocation = useCallback(
    (location) => {
      if (!mapInstance || !location) return

      // Validate location
      if (typeof location.lat === "undefined" || typeof location.lng === "undefined") {
        console.warn("Invalid location for flyTo:", location)
        showNotification("Cannot navigate to invalid location", "error")
        return
      }

      // Get current position and zoom
      const currentCenter = mapInstance.getCenter()
      const currentZoom = mapInstance.getZoom()
      const targetZoom = 16

      // Use the map's built-in animation for smoother experience
      if (window.google && window.google.maps) {
        // Create a smooth animation using the Google Maps API
        mapInstance.panTo(location)
        mapInstance.setZoom(targetZoom)
      } else {
        // Fallback to our custom animation if Google Maps API isn't fully loaded
        // Define the number of frames for the animation
        const frames = 30
        let frame = 0

        // Calculate distance to travel
        const latDiff = location.lat - currentCenter.lat()
        const lngDiff = location.lng - currentCenter.lng()
        const zoomDiff = targetZoom - currentZoom

        // Create animation
        const animate = () => {
          frame++

          // Calculate progress (easeInOutCubic)
          let t = frame / frames
          t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

          // Calculate new position and zoom
          const newLat = currentCenter.lat() + latDiff * t
          const newLng = currentCenter.lng() + lngDiff * t
          const newZoom = currentZoom + zoomDiff * t

          // Update map
          mapInstance.setCenter({ lat: newLat, lng: newLng })
          mapInstance.setZoom(newZoom)

          // Continue animation if not done
          if (frame < frames) {
            requestAnimationFrame(animate)
          }
        }

        // Start animation
        animate()
      }
    },
    [mapInstance, showNotification],
  )

  // Store the function in a ref to avoid circular dependencies
  useEffect(() => {
    flyToLocationRef.current = flyToLocation
  }, [flyToLocation])

  // Connect to socket.io for real-time updates
  useEffect(() => {

    // Connect to the socket
    if (!socket.connected) {
      try {
        socket.connect()
      } catch (error) {
        console.error("Error connecting to socket:", error)
        showNotification("Failed to connect to real-time tracking service", "warning")
      }
    }

    // Handler for receiving location updates
    const handleLocationUpdate = (data) => {
      try {
        // Extract userId from the data
        const userId = data.userId.split("_")[0]


        // Update live location data
        setLiveUserLocations((prev) => ({
          ...prev,
          [userId]: {
            lat: data.location.coordinates[1],
            lng: data.location.coordinates[0],
            timestamp: data.timestamp || new Date().toISOString(),
          },
        }))

        // If the employee is currently being tracked, add this position to the tracking data
        if (selectedEmployee === userId) {
          // Your tracking logic here - integrate with your useTracking hook
        }
      } catch (error) {
        console.error("Error processing location update:", error)
      }
    }

    // Listen for location updates
    socket.on("receive_location", handleLocationUpdate)

    // Initial fetch of all live locations
    socket.emit("get_all_locations")

    // Cleanup function
    return () => {
      socket.off("receive_location", handleLocationUpdate)
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [selectedEmployee, showNotification])

  // Function to clear the current path
  const clearCurrentPath = () => {
    setShouldClearPath(true)
    setTimeout(() => {
      setShouldClearPath(false)
    }, 100)
  }

  // Function to retry data loading
  const handleRetry = () => {
    setError(null)
    setDataLoading(true)
    fetchEmployees()
    fetchBranches()
  }

  // Fetch employee data from API
  const fetchEmployees = async () => {
    try {
      setDataLoading(true)
      // Use filter state to pass to API if needed
      const filter = {}
      const data = await getEmployeeData(filter)

      // Debug employee location data

      if (data && Array.isArray(data) && data.length > 0) {
        // Log the first employee's location structure
        const firstEmployee = data[0]

        // Check for GeoJSON format
        if (firstEmployee.location && firstEmployee.location.type === "Point") {
        }

        // Check for standard format
        if (firstEmployee.currentLocation) {
        }
      }

      setEmployeesData(data)

      // Convert to GeoJSON format for map display
      const geoJson = convertEmployeesToGeoJson(data)

      // Debug the first GeoJSON feature if available
      if (geoJson.features.length > 0) {
      }

      setEmployeesGeoJson(geoJson)
    } catch (error) {
      console.error("Error fetching employee data:", error)
      showNotification("Failed to load employee data", "error")
      setEmployeesData([])
      setEmployeesGeoJson({ type: "FeatureCollection", features: [] })
    } finally {
      setDataLoading(false)
    }
  }

  // Fetch branch data from API
  const fetchBranches = async () => {
    try {
      setDataLoading(true)
      const data = await getBranchData()

      if (!data) {
        console.warn("No branch data received")
        setBranchesData([])
        setBranchesGeoJson({ type: "FeatureCollection", features: [] })
        return
      }

      // Log the branch data for debugging

      if (Array.isArray(data)) {

        // Check if any branches have valid location data
        const validBranches = data.filter(isValidBranchForMap)

        setBranchesData(data)

        // Convert to GeoJSON format for map display
        const geoJson = convertBranchesToGeoJson(data)
        setBranchesGeoJson(geoJson)

        if (geoJson.features.length === 0 && data.length > 0) {
          showNotification("No valid branch locations found for map display", "warning")
        }
      } else {
        console.warn("Branch data is not an array:", data)
        showNotification("Received invalid branch data format", "warning")
        setBranchesData([])
        setBranchesGeoJson({ type: "FeatureCollection", features: [] })
      }
    } catch (error) {
      console.error("Error fetching branch data:", error)
      showNotification("Failed to load branch data", "error")
      setBranchesData([])
      setBranchesGeoJson({ type: "FeatureCollection", features: [] })
    } finally {
      setDataLoading(false)
    }
  }

  // Set up data fetching
  useEffect(() => {
    fetchEmployees()

    // Set up interval for periodic refresh if needed
    const employeeRefreshInterval = setInterval(() => {
      fetchEmployees()
    }, 60000) // Refresh every minute

    return () => clearInterval(employeeRefreshInterval)
  }, [])

  useEffect(() => {
    fetchBranches()

    // Set up interval for periodic refresh if needed
    const branchRefreshInterval = setInterval(() => {
      fetchBranches()
    }, 60000) // Refresh every minute

    return () => clearInterval(branchRefreshInterval)
  }, [])

  // Create a component to access the map instance
  const MapInstanceGetter = () => {
    const map = useMap()

    useEffect(() => {
      if (map) {
        setMapInstance(map)
        // Set google variable for other components to use
        if (window.google) {
          google = window.google
        }

        // Handle window resize to properly resize the map
        const handleResize = () => {
          if (map && typeof google !== "undefined") {
            google.maps.event.trigger(map, "resize")
          }
        }

        window.addEventListener("resize", handleResize)

        // Clean up event listener
        return () => {
          window.removeEventListener("resize", handleResize)
        }
      }
    }, [map])

    // Handle sidebar toggling - resize map when sidebar visibility changes
    useEffect(() => {
      if (map && typeof google !== "undefined") {
        // Use timeout to ensure the DOM has updated
        setTimeout(() => {
          google.maps.event.trigger(map, "resize")
        }, 300)
      }
    }, [map, sidebarVisible])

    return null
  }

  // Define handleMarkerClick outside of useCallback
  const handleMarkerClick = (marker, data) => {
    if (data) {
      setSelectedMarker(data)

      // Get position from either marker or data
      if (marker) {
        const position = marker
        setInfoWindowPosition({ lat: position.lat, lng: position.lng })
      } else if (data.position) {
        setInfoWindowPosition(data.position)
      } else if (data.clusterPoints && data.clusterPoints.length > 0) {
        // For clusters, use the position of the first point
        setInfoWindowPosition(data.clusterPoints[0].position)
      }
    }
  }

  // Define handleInfoWindowClose outside of useCallback
  const handleInfoWindowClose = () => {
    setSelectedMarker(null)
    setInfoWindowPosition(null)
  }

  // Define handleTrackLive outside of useCallback
  const handleTrackLive = async (employeeId) => {
    try {
      const isActive = await toggleLiveTracking(employeeId)
      if (isActive) {
        setShowTimeline(true)
        // Close the info window
        handleInfoWindowClose()
      }
    } catch (error) {
      console.error("Error toggling live tracking:", error)
      showNotification("Failed to start live tracking", "error")
    }
  }

  // Define handleViewHistory outside of useCallback
  const handleViewHistory = async (employeeId) => {
    try {
      // Get today's date in the required format
      const today = format(new Date(), "yyyy-MM-dd")
      await viewHistory(employeeId, today)
      setShowTimeline(true)
      // Close the info window
      handleInfoWindowClose()
    } catch (error) {
      console.error("Error viewing history:", error)
      showNotification("Failed to load location history", "error")
    }
  }

  // Define handleTimelineClose outside of useCallback
  const handleTimelineClose = () => {
    setShowTimeline(false)
  }

  // Define handleSidebarItemClick using the ref to avoid circular dependencies
  const handleSidebarItemClick = useCallback(
    (type, item) => {
      if (!mapInstance || !item || !flyToLocationRef.current) return

      let position
      let data

      try {
        switch (type) {
          case "employee":
            // Try to extract coordinates using our utility function
            const employeeCoords = extractCoordinatesFromItem(item)
            if (!employeeCoords) {
              showNotification("Employee has no valid location data", "warning")
              return
            }
            position = employeeCoords
            data = {
              ...item,
              type: "employee",
            }
            break
          case "customer":
            if (
              !item.location ||
              typeof item.location.lat === "undefined" ||
              typeof item.location.lng === "undefined"
            ) {
              showNotification("Customer has no valid location data", "warning")
              return
            }
            position = item.location
            data = {
              ...item,
              type: "customer",
            }
            break
          case "branch":
            // Try to extract coordinates using our utility function
            const branchCoords = extractCoordinatesFromItem(item)
            if (!branchCoords) {
              showNotification("Branch has no valid location data", "warning")
              return
            }
            position = branchCoords
            data = {
              ...item,
              type: "branch",
            }
            break
          default:
            return
        }

        // Validate position
        if (isNaN(position.lat) || isNaN(position.lng)) {
          showNotification("Invalid location coordinates", "warning")
          return
        }

        // Use the ref to access the flyToLocation function
        flyToLocationRef.current(position)

        // Show info window after animation completes
        setTimeout(() => {
          setSelectedMarker(data)
          setInfoWindowPosition(position)
        }, 1000)
      } catch (error) {
        console.error("Error handling sidebar item click:", error)
        showNotification("Failed to navigate to location", "error")
      }
    },
    [mapInstance, extractCoordinatesFromItem, showNotification],
  )

  // Define handleTrackEmployee using the ref to avoid circular dependencies
  const handleTrackEmployee = useCallback(
    async (employeeId) => {
      try {
        // Find the employee data
        const employee = employeesData.find((emp) => emp.id === employeeId || emp._id === employeeId)
        if (!employee || !mapInstance || !flyToLocationRef.current) {
          showNotification("Employee not found or map not ready", "warning")
          return
        }

        // Extract coordinates
        const location = extractCoordinatesFromItem(employee)
        if (!location) {
          showNotification("Employee has no valid location data", "warning")
          return
        }

        // Validate coordinates
        if (isNaN(location.lat) || isNaN(location.lng)) {
          showNotification("Invalid employee location coordinates", "warning")
          return
        }

        // Use the ref to access the flyToLocation function
        flyToLocationRef.current(location)

        // Start tracking after map animation completes
        setTimeout(async () => {
          const isActive = await toggleLiveTracking(employeeId)
          if (isActive) {
            setShowTimeline(true)
          }
        }, 1000)
      } catch (error) {
        console.error("Error tracking employee:", error)
        showNotification("Failed to start employee tracking", "error")
      }
    },
    [employeesData, mapInstance, extractCoordinatesFromItem, toggleLiveTracking, showNotification],
  )

  // Define handleViewEmployeeHistory using the ref to avoid circular dependencies
  const handleViewEmployeeHistory = useCallback(
    async (employeeId) => {
      try {
        // Find the employee data
        const employee = employeesData.find((emp) => emp.id === employeeId || emp._id === employeeId)
        if (!employee || !mapInstance || !flyToLocationRef.current) {
          showNotification("Employee not found or map not ready", "warning")
          return
        }

        // Extract coordinates
        const location = extractCoordinatesFromItem(employee)
        if (!location) {
          showNotification("Employee has no valid location data", "warning")
          return
        }

        // Validate coordinates
        if (isNaN(location.lat) || isNaN(location.lng)) {
          showNotification("Invalid employee location coordinates", "warning")
          return
        }

        // Use the ref to access the flyToLocation function
        flyToLocationRef.current(location)

        // View history after map animation completes
        setTimeout(async () => {
          // Get today's date in the required format
          const today = format(new Date(), "yyyy-MM-dd")
          await viewHistory(employeeId, today)
          setShowTimeline(true)
        }, 1000)
      } catch (error) {
        console.error("Error viewing employee history:", error)
        showNotification("Failed to load employee history", "error")
      }
    },
    [employeesData, mapInstance, extractCoordinatesFromItem, viewHistory, showNotification],
  )

  // Track history path of the employee
  const HistoryPath = ({ trackingData }) => {
    const map = useMap()

    useEffect(() => {
      if (!map || !trackingData || trackingData.length < 2) return

      try {
        // Create a path from the tracking data
        const path = trackingData.map((point) => ({
          lat: point.location.lat,
          lng: point.location.lng,
        }))

        // Create a polyline for the path
        const polyline = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: "#4f46e5",
          strokeOpacity: 1.0,
          strokeWeight: 3,
          icons: [
            {
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#4f46e5",
                fillOpacity: 1,
                scale: 3,
                strokeColor: "#ffffff",
                strokeWeight: 1,
              },
              repeat: "40px",
            },
          ],
        })

        // Add the polyline to the map
        polyline.setMap(map)

        // Fit bounds to include all points
        const bounds = new google.maps.LatLngBounds()
        path.forEach((point) => bounds.extend(point))
        map.fitBounds(bounds, { padding: 50 })

        return () => {
          // Clean up
          polyline.setMap(null)
        }
      } catch (error) {
        console.error("Error rendering history path:", error)
      }
    }, [map, trackingData])

    return null
  }

  // Render the employee's current position if tracking
  const renderTrackedPosition = () => {
    if (!trackingData || trackingData.length === 0) return null

    try {
      // Get the latest position from tracking data
      const latest = trackingData[trackingData.length - 1]
      const position = { lat: latest.location.lat, lng: latest.location.lng }

      // If live data is available for this employee, use that instead (more current)
      if (liveUserLocations[selectedEmployee]) {
        position.lat = liveUserLocations[selectedEmployee].lat
        position.lng = liveUserLocations[selectedEmployee].lng
      }

      // Find the employee data from GeoJSON
      const employeeFeature = employeesGeoJson.features.find((feature) => feature.properties.id === selectedEmployee)

      if (!employeeFeature) return null

      const employeeData = employeeFeature.properties

      return (
        <AdvancedMarker position={position}>
          <div className="tracked-position">
            <div className="tracked-avatar">
              {employeeData.avatar ? (
                <div className="avatar-img" style={{ backgroundImage: `url(${employeeData.avatar})` }} />
              ) : (
                <div className="avatar-default">
                  {employeeData.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
              )}
            </div>
            <style jsx>{`
              .tracked-position {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              }
    
              .tracked-position:before {
                content: '';
                position: absolute;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background-color: rgba(79, 70, 229, 0.2);
                animation: pulse 2s infinite;
              }
    
              .tracked-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 3px solid #4f46e5;
                overflow: hidden;
                z-index: 1;
              }
    
              .avatar-img {
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
              }
    
              .avatar-default {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #4f46e5;
                color: white;
                font-weight: bold;
                font-size: 14px;
              }
    
              @keyframes pulse {
                0% {
                  transform: scale(1);
                  opacity: 0.8;
                }
                70% {
                  transform: scale(2);
                  opacity: 0;
                }
                100% {
                  transform: scale(1);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        </AdvancedMarker>
      )
    } catch (error) {
      console.error("Error rendering tracked position:", error)
      return null
    }
  }

  // If there's a critical error, show error state
  if (error) {
    return (
      <div className="google-map-container">
        <MapErrorState message={error} onRetry={handleRetry} />
      </div>
    )
  }

  const [allPoints, setAllPoints] = useState({ type: "FeatureCollection", features: [] })

  useEffect(() => {
    const features = []

    if (filters.employees && employeesGeoJson?.features) {
      features.push(...employeesGeoJson.features)
    }

    if (filters.branches && branchesGeoJson?.features) {
      features.push(...branchesGeoJson.features)
    }

    if (filters.customers && customersGeoJson?.features) {
      features.push(...customersGeoJson.features)
    }

    setAllPoints({
      type: "FeatureCollection",
      features,
    })
  }, [filters, employeesGeoJson, branchesGeoJson, customersGeoJson])

  // Function to fit map to all markers
  const fitMapToMarkers = useCallback(() => {
    if (!mapInstance || !allPoints || !allPoints.features || allPoints.features.length === 0) return

    try {
      const bounds = new window.google.maps.LatLngBounds()

      // Add all points to bounds
      allPoints.features.forEach((feature) => {
        if (feature.geometry && feature.geometry.coordinates) {
          const [lng, lat] = feature.geometry.coordinates
          bounds.extend({ lat, lng })
        }
      })

      // Fit map to bounds with padding
      mapInstance.fitBounds(bounds, { padding: 50 })

      // If we only have one point, zoom in more
      if (allPoints.features.length === 1) {
        setTimeout(() => {
          mapInstance.setZoom(14)
        }, 100)
      }
    } catch (error) {
      console.error("Error fitting map to markers:", error)
    }
  }, [mapInstance, allPoints])

  // Fit map to markers when they change
  useEffect(() => {
    if (mapInstance && allPoints && allPoints.features && allPoints.features.length > 0) {
      fitMapToMarkers()
    }
  }, [mapInstance, allPoints, fitMapToMarkers])

  return (
    <div className="google-map-container">
      <APIProvider apiKey={apiKey} onLoad={() => setIsLoading(false)}>
        <div
          className="map-content"
          style={{ marginLeft: sidebarVisible ? "320px" : "0", width: sidebarVisible ? "calc(100% - 320px)" : "100%" }}
        >
          <Map
            defaultCenter={{ lat: 28.6139, lng: 77.209 }} // Default center - Delhi
            defaultZoom={12}
            mapId={mapStyle} // Light mode map ID
            gestureHandling="cooperative" // More user-friendly gesture handling
            disableDefaultUI={false}
            className="google-map"
            options={{
              styles: [], // Custom map styles if needed
              fullscreenControl: false, // Disable fullscreen control
              streetViewControl: false, // Disable street view
              mapTypeControl: false, // Enable map type control for satellite view
              mapTypeControlOptions: {
                style: 2, // HORIZONTAL_BAR
                position: 3, // TOP_RIGHT
              },
              zoomControl: false, // Enable zoom controls
              zoomControlOptions: {
                position: 9, // LEFT_CENTER for better placement
              },
              clickableIcons: false, // Disable Google POI clicks
              rotateControl: true, // Enable rotate control
              scaleControl: true, // Show scale
              scrollwheel: true, // Enable scroll to zoom
              maxZoom: 20, // Maximum zoom level
              minZoom: 3, // Minimum zoom level
            }}
          >
            {/* Map Instance Getter */}
            <MapInstanceGetter />

            {/* Advanced Marker Clusterer */}
            <AdvancedMarkerClusterer
              points={allPoints}
              clusteringEnabled={clusteringEnabled}
              onMarkerClick={handleMarkerClick}
              filters={filters}
              trackedEmployeeId={selectedEmployee}
            />

            {/* Info Window */}
            {selectedMarker && infoWindowPosition && (
              <InfoWindow
                data={selectedMarker}
                position={infoWindowPosition}
                onClose={handleInfoWindowClose}
                onTrackLive={handleTrackLive}
                onViewHistory={handleViewHistory}
              />
            )}

            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              clusteringEnabled={clusteringEnabled}
              onClusteringToggle={() => setClusteringEnabled(!clusteringEnabled)}
              mapInstance={mapInstance}
            />

            {/* Toggle Sidebar Button */}
            <Box
              sx={{
                position: "absolute",
                top: "10px",
                left: sidebarVisible ? "-40px" : "10px",
                zIndex: 101,
                transition: "left 0.3s ease",
              }}
            >
              <IconButton
                onClick={() => setSidebarVisible(!sidebarVisible)}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  boxShadow: 2,
                  transition: "background-color 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#675cd8 !important",
                  },
                }}
                size="small"
              >
                <SvgIcon>
                  {sidebarVisible ? (
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
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  ) : (
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
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </SvgIcon>
              </IconButton>
            </Box>

            {/* Fit Map Button */}
            <Box
              sx={{
                position: "absolute",
                top: "60px",
                right: "10px",
                zIndex: 101,
              }}
            >
              <IconButton
                onClick={fitMapToMarkers}
                title="Fit map to all markers"
                sx={{
                  backgroundColor: "white",
                  color: "primary.main",
                  boxShadow: 2,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
                size="small"
              >
                <SvgIcon fontSize="small">
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
                    <path d="M15 3h6v6" />
                    <path d="M9 21H3v-6" />
                    <path d="M21 3l-7 7" />
                    <path d="M3 21l7-7" />
                  </svg>
                </SvgIcon>
              </IconButton>
            </Box>

            {/* Tracking Path */}
            {showTimeline && trackingData && trackingData.length > 0 && <HistoryPath trackingData={trackingData} />}

            {/* Current position marker when tracking */}
            {showTimeline && trackingData && trackingData.length > 0 && renderTrackedPosition()}
          </Map>
        </div>

        {/* Loading State */}
        <Fade in={isLoading || dataLoading} timeout={300} unmountOnExit>
          <div>
            <MapLoadingState />
          </div>
        </Fade>

        {/* Sidebar */}
        {sidebarVisible && (
          <Sidebar
            onItemClick={handleSidebarItemClick}
            onTrackEmployee={handleTrackEmployee}
            onViewEmployeeHistory={handleViewEmployeeHistory}
            employeesData={employeesData}
            branchesData={branchesData}
          />
        )}
      </APIProvider>

      {/* Tracking Path */}
      {showTimeline && trackingData && trackingData.length > 0 && (
        <CustomPolyline
          coordinates={trackingData.map((point) => ({
            lat: point.location.lat,
            lng: point.location.lng,
            timestamp: point.timestamp, // Include timestamp for info windows
          }))}
          clearPath={shouldClearPath}
          pathColor="#4f46e5"
          strokeWeight={3}
        />
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <style jsx>{`
        .google-map-container {
          position: relative;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
        }

        .map-content {
          flex: 1;
          transition: margin-left 0.3s ease;
          position: relative;
        }

        .google-map {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}

export default GoogleMapContainer
