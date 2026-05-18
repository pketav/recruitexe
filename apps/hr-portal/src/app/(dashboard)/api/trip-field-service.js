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
      // In production, you should fetch this from localStorage, not hard-code it
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjY2ODUwZjdkMzc0NDI1ZTkzNzExNDE4MCIsInJvbGVOYW1lIjpbImFkbWluIl0sImlhdCI6MTc0NzIyNTE5M30.DoKKTpbXwWHWHbGFpeYlsnRT29IJ0eAn7iwLwO6jimw"
      return token
    },
  
    /**
     * Get all fields
     * @returns {Promise<Array>} - Promise resolving to array of fields
     */
    async getAllFields() { 
      try {
        console.log("Fetching all fields...")
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
        console.log("All fields data:", data)
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
        console.log("Adding field with data:", fieldData)
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
        console.log("Add field response:", data)
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
        console.log("Updating field with data:", fieldData)
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
        console.log("Update field response:", data)
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
        console.log("Updating multiple fields with data:", fieldsData)
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
        console.log("Update multiple fields response:", data)
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
        console.log("Deleting field with ID:", fieldId)
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
        console.log("Delete field response:", data)
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