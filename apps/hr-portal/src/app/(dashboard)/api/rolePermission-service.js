const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Helper function to get headers with auth token
const getHeaders = () => {
  const token = window.localStorage.getItem("authToken")
  return {
    "Content-Type": "application/json",
    Authorization: token,
  }
}

const API_BASE_URL = `${baseUrl}/v1/api`

// Role and Permission Service
export const rolePermissionService = {
  // Add/Update role and permission
  addRolePermission: async (roleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenseRole/update`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(roleData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error adding role permission:", error)
      throw new Error(error.message || "Failed to add role permission")
    }
  },

  // Get all expense types
  getAllExpenseTypes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenseType/all`, {
        method: "GET",
        headers: getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching expense types:", error)
      throw new Error(error.message || "Failed to fetch expense types")
    }
  },

  // Get all role assignments - returning raw data without transformation
  getAllRoleAssignments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenseRole/all`, {
        method: "GET",
        headers: getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Return raw data without transformation
      return data
    } catch (error) {
      console.error("Error fetching role assignments:", error)
      throw new Error(error.message || "Failed to fetch role assignments")
    }
  },

  // Get all employees (if you have an endpoint for this)
  getAllEmployees: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenseRole/employeeList`, {
        method: "GET",
        headers: getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching employees:", error)
      // Return empty array if API fails
      return []
    }
  },

  // Get all departments (if you have an endpoint for this)
  getAllDepartments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenseRole/departmentList`, {
        method: "GET",
        headers: getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching departments:", error)
      // Return empty array if API fails
      return []
    }
  },
}

export default rolePermissionService
