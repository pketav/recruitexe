/**
 * Service file for handling field API calls
 */

const getLocalStorage = () => {
    if (typeof window !== "undefined") {
      return window.localStorage
    }
    return null
  }
  
  const FieldService = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  
    getToken() {
      const localStorage = getLocalStorage()
      return localStorage?.getItem("authToken") || ""
    },
  
    /**
     * Get all fields
     * @returns {Promise<Array>} - Promise resolving to array of fields
     */
    async getAllFields() { 
      try {
        const token = this.getToken()
  
        const response = await fetch(`${this.baseUrl}/v1/api/field/all?type=trips`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
  
        const data = await response.json()
        return data.items || []
      } catch (error) {
        console.error("Error fetching all fields:", error)
        throw error
      }
    },
  
    /**
     * Add a new field
     * @param {Object} fieldData - The field data to add
     * @returns {Promise<Object>} - Promise resolving to the added field
     */
    async addField(fieldData) {
      try {
        const token = this.getToken()
  
        const response = await fetch(`${this.baseUrl}/v1/api/field/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(fieldData),
        })
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
  
        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error adding field:", error)
        throw error
      }
    },
  
    /**
     * Update a field
     * @param {Object} fieldData - The field data to update
     * @returns {Promise<Object>} - Promise resolving to the updated field
     */
    async updateField(fieldData) {
      try {
        const token = this.getToken()
  
        const response = await fetch(`${this.baseUrl}/v1/api/field/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(fieldData),
        })
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
  
        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error updating field:", error)
        throw error
      }
    },
  
    /**
     * Update multiple fields at once
     * @param {Array} fieldsData - Array of field data to update
     * @returns {Promise<Object>} - Promise resolving to the response
     */
    async updateMultipleFields(fieldsData) {
      try {
        const token = this.getToken()
  
        const response = await fetch(`${this.baseUrl}/v1/api/field/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ fields: fieldsData }),
        })
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
  
        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error updating multiple fields:", error)
        throw error
      }
    },
  
    /**
     * Delete a field
     * @param {string|number} fieldId - The ID of the field to delete
     * @returns {Promise<Object>} - Promise resolving to the response
     */
    async deleteField(fieldId) {
      try {
        const token = this.getToken()
  
        const response = await fetch(`${this.baseUrl}/v1/api/field/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ id: fieldId }),
        })
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
  
        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error deleting field:", error)
        throw error
      }
    },
  }
  
  // Export functions
  export const getAllFields = FieldService.getAllFields.bind(FieldService)
  export const addField = FieldService.addField.bind(FieldService)
  export const updateField = FieldService.updateField.bind(FieldService)
  export const updateMultipleFields = FieldService.updateMultipleFields.bind(FieldService)
  export const deleteField = FieldService.deleteField.bind(FieldService)
