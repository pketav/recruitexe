import axios from "axios"

// Base URL for API requests - replace with your actual base URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://your-api-base-url"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or wherever you store it
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (token) {
      config.headers.token = token
    }

    return config
  },
  (error) => Promise.reject(error),
)

/**
 * Fetch employee data from the API
 * @param {Object} filter - Optional filter parameters
 * @returns {Promise<Array>} Array of employee objects
 */
export const getEmployeeData = async (filter = {}) => {
  try {
    const response = await apiClient.get("/v1/api/Auth/employee/all", { params: filter })
    return response.data.items || []
  } catch (error) {
    console.error("Error fetching employees:", error)
    return [] // Return empty array instead of throwing to prevent app crashes
  }
}

/**
 * Fetch branch data from the API
 * @param {Object} filter - Optional filter parameters
 * @returns {Promise<Array>} Array of branch objects
 */
export const getBranchData = async (filter = {}) => {
  try {
    const response = await apiClient.get("/v1/api/branch/all", { params: filter }) // Adjust endpoint as needed
    console.log("Branch API response:", response.data)

    // Ensure we're returning an array even if the API response structure is unexpected
    if (response.data && Array.isArray(response.data)) {
      return response.data
    } else if (response.data && Array.isArray(response.data.items)) {
      return response.data.items
    } else if (response.data && typeof response.data.items === "object") {
      // If it's an object but not an array, check for common response patterns
      const possibleArrays = ["items", "branches", "data", "results"]
      for (const key of possibleArrays) {
        if (Array.isArray(response.data.items[key])) {
          return response.data.items[key]
        }
      }
      // If we can't find an array in the response, convert the object to an array if possible
      if (Object.keys(response.data).length > 0) {
        console.warn("Unexpected API response format, attempting to convert object to array")
        return [response.data]
      }
    }

    // If we can't extract an array from the response, return an empty array
    console.warn("Unexpected API response format, returning empty array")
    return []
  } catch (error) {
    console.error("Error fetching branches:", error)
    return [] // Return empty array instead of throwing to prevent app crashes
  }
}

/**
 * Extract coordinates from various location formats
 * @param {Object} item - Object containing location data
 * @returns {Object|null} Object with lat and lng properties or null if invalid
 */
const extractCoordinates = (item) => {
  // Case 1: GeoJSON format with location.type = "Point" and location.coordinates = [lng, lat]
  if (
    item.location &&
    item.location.type === "Point" &&
    Array.isArray(item.location.coordinates) &&
    item.location.coordinates.length === 2
  ) {
    const [lng, lat] = item.location.coordinates
    return { lat, lng }
  }

  // Case 2: Standard format with currentLocation.lat and currentLocation.long
  if (
    item.currentLocation &&
    typeof item.currentLocation === "object" &&
    typeof item.currentLocation.lat !== "undefined" &&
    typeof item.currentLocation.long !== "undefined"
  ) {
    return {
      lat: item.currentLocation.lat,
      lng: item.currentLocation.long,
    }
  }

  // Case 3: Alternative format with location.lat and location.long
  if (
    item.location &&
    typeof item.location === "object" &&
    typeof item.location.lat !== "undefined" &&
    (typeof item.location.long !== "undefined" || typeof item.location.lng !== "undefined")
  ) {
    return {
      lat: item.location.lat,
      lng: item.location.long || item.location.lng,
    }
  }

  // Case 4: Alternative format with latitude and longitude properties
  if (
    item.location &&
    typeof item.location === "object" &&
    typeof item.location.latitude !== "undefined" &&
    typeof item.location.longitude !== "undefined"
  ) {
    return {
      lat: item.location.latitude,
      lng: item.location.longitude,
    }
  }

  // Case 5: Direct lat/lng properties
  if (typeof item.lat !== "undefined" && (typeof item.lng !== "undefined" || typeof item.long !== "undefined")) {
    return {
      lat: item.lat,
      lng: item.lng || item.long,
    }
  }

  // Case 6: Direct latitude/longitude properties
  if (typeof item.latitude !== "undefined" && typeof item.longitude !== "undefined") {
    return {
      lat: item.latitude,
      lng: item.longitude,
    }
  }

  // No valid coordinates found
  return null
}

/**
 * Convert employee data to GeoJSON format for map display
 * @param {Array} employees - Array of employee objects
 * @returns {Object} GeoJSON object
 */
export const convertEmployeesToGeoJson = (employees) => {
  // Validate input
  if (!employees || !Array.isArray(employees)) {
    console.warn("No employee data provided for GeoJSON conversion")
    return { type: "FeatureCollection", features: [] }
  }

  try {
    const features = employees
      .filter((employee) => {
        // Skip null or undefined employees
        if (!employee || typeof employee !== "object") return false

        // Check if employee has valid location data in any format
        const coordinates = extractCoordinates(employee)
        return coordinates !== null
      })
      .map((employee) => {
        // Extract coordinates from any supported format
        const coordinates = extractCoordinates(employee)

        // Skip invalid coordinates
        if (!coordinates) {
          console.warn(`Could not extract coordinates for employee ${employee._id || employee.id || "unknown"}`)
          return null
        }

        // Ensure coordinates are numbers
        const latitude = typeof coordinates.lat === "string" ? Number.parseFloat(coordinates.lat) : coordinates.lat
        const longitude = typeof coordinates.lng === "string" ? Number.parseFloat(coordinates.lng) : coordinates.lng

        // Skip invalid coordinates
        if (isNaN(latitude) || isNaN(longitude)) {
          console.warn(`Invalid coordinates for employee ${employee._id || employee.id || "unknown"}`)
          return null
        }

        // Log successful coordinate extraction for debugging
        console.log(`Extracted coordinates for employee ${employee._id || employee.id || "unknown"}:`, {
          lat: latitude,
          lng: longitude,
        })

        return {
          type: "Feature",
          properties: {
            id: employee._id || employee.id || `emp-${Math.random().toString(36).substr(2, 9)}`,
            name: employee.employeName || employee.name || "Unknown Employee",
            designation: employee.currentDesignation || employee.designation || "",
            status: employee.status || "active",
            avatar: employee.employeePhoto || employee.avatar || employee.profileImage || "",
            email: employee.email || "",
            phone: employee.phone || "",
            department: employee.department || "",
            role: employee.role || "",
            type: "employee",
          },
          geometry: {
            type: "Point",
            coordinates: [longitude, latitude], // GeoJSON uses [longitude, latitude] order
          },
        }
      })
      .filter(Boolean) // Remove null entries

    console.log(`Converted ${features.length} employees to GeoJSON features`)

    return {
      type: "FeatureCollection",
      features,
    }
  } catch (error) {
    console.error("Error converting employees to GeoJSON:", error)
    return {
      type: "FeatureCollection",
      features: [],
    }
  }
}

/**
 * Convert branch data to GeoJSON format for map display
 * @param {Array} branches - Array of branch objects
 * @returns {Object} GeoJSON object
 */
export const convertBranchesToGeoJson = (branches) => {
  // Validate input
  if (!branches || !Array.isArray(branches)) {
    console.warn("Invalid branch data for GeoJSON conversion:", branches)
    return { type: "FeatureCollection", features: [] }
  }

  try {
    const features = branches
      .filter((branch) => {
        // Filter out null or undefined branches
        if (!branch || typeof branch !== "object") {
          console.warn("Invalid branch entry:", branch)
          return false
        }
        return true
      })
      .map((branch) => {
        // Extract coordinates from any supported format
        const coordinates = extractCoordinates(branch)

        // Skip invalid coordinates
        if (!coordinates) {
          console.warn(`Could not extract coordinates for branch ${branch._id || branch.id || "unknown"}`)
          return null
        }

        // Ensure coordinates are numbers
        const latitude = typeof coordinates.lat === "string" ? Number.parseFloat(coordinates.lat) : coordinates.lat
        const longitude = typeof coordinates.lng === "string" ? Number.parseFloat(coordinates.lng) : coordinates.lng

        // Skip invalid coordinates
        if (isNaN(latitude) || isNaN(longitude)) {
          console.warn(`Invalid coordinates for branch ${branch._id || branch.id || "unknown"}`)
          return null
        }

        // Log successful coordinate extraction for debugging
        console.log(`Extracted coordinates for branch ${branch._id || branch.id || "unknown"}:`, {
          lat: latitude,
          lng: longitude,
        })

        // Create GeoJSON feature with fallbacks for all properties
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [longitude, latitude], // GeoJSON uses [longitude, latitude]
          },
          properties: {
            id: branch.id || branch._id || `branch-${Math.random().toString(36).substring(2, 9)}`,
            name: branch.name || "Unknown Branch",
            address: branch.address || "",
            phone: branch.phone || "",
            email: branch.email || "",
            manager: branch.manager || "",
            employeeCount: branch.employeeCount || 0,
            type: "branch",
          },
        }
      })
      .filter(Boolean) // Remove null entries

    console.log(`Converted ${features.length} branches to GeoJSON features`)

    return {
      type: "FeatureCollection",
      features,
    }
  } catch (error) {
    console.error("Error converting branches to GeoJSON:", error)
    return {
      type: "FeatureCollection",
      features: [],
    }
  }
}

/**
 * Validates branch data to ensure it has required properties for map display
 * @param {Object} branch - Branch object to validate
 * @returns {boolean} Whether the branch is valid for map display
 */
export const isValidBranchForMap = (branch) => {
  if (!branch || typeof branch !== "object") return false

  // Use the extractCoordinates function to check if valid coordinates can be extracted
  const coordinates = extractCoordinates(branch)
  return coordinates !== null
}

export default apiClient
