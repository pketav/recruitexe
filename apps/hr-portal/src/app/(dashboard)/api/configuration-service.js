const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
// const LOCAL_URL = 'http://localhost:4000';

// Helper function to get headers with auth token
const getHeaders = () => {
  const token = window.localStorage.getItem("authToken")
  return {
    "Content-Type": "application/json",
    Authorization: token,
  }
}

class ConfigurationService {
  async toggleConfiguration(configData) {
    console.log("configData",configData)
    try {
      const response = await fetch(`${baseUrl}/v1/api/expenseRole/fromWhere`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          fromWhere:configData.fromWhere,
                  id:configData.id,
                  approverLevel:configData.approverLevel,
                  remitterLevel:configData.remitterLevel
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error toggling configuration:", error)
      throw error
    }
  }

  async getConfigList() {
    try {
      const response = await fetch(`${baseUrl}/v1/api/expenseRole/configList`, {
        method: "GET",
        headers: getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching config list:", error)
      throw error
    }
  }
}

export default new ConfigurationService()
