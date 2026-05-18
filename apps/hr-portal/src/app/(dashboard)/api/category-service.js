/**
 * Service file for handling expense category API calls
 */

const getLocalStorage = () => {
    if (typeof window !== "undefined") {
      return window.localStorage
    }
    return null
  }
  
  const CategoryService = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  
    getToken() {
    const localStorage = getLocalStorage();
    if (localStorage) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found in localStorage");
        return null;
      }
      return token;
    }
    console.error("localStorage is not available");
    return null;
  },

    async fetchAllCategories() {
      try {
        console.log("Fetching all categories...")
        const token = this.getToken()
  
        const response = await fetch(`${this.baseUrl}/v1/api/expenseCategory/all`, {
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
        console.log("All categories data:", data)
        return data.items || []
      } catch (error) {
        console.error("Error fetching all categories:", error)
        throw error
      }
    },
  
    async fetchCategoryDropdown() {
      try {
        console.log("Fetching category dropdown...")
        const token = this.getToken()
  
        const response = await fetch(`${this.baseUrl}/v1/api/expenseCategory/categoryDropdown`, {
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
        console.log("Category dropdown data:", data)
        return data.items || []
      } catch (error) {
        console.error("Error fetching category dropdown:", error)
        throw error
      }
    },
  
    async fetchExpenseTypes() {
      try {
        console.log("Fetching expense types...")
        const token = this.getToken()
  
        const response = await fetch(`${this.baseUrl}/v1/api/expenseType/all`, {
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
        console.log("Expense types data:", data)
        return data.items || []
      } catch (error) {
        console.error("Error fetching expense types:", error)
        throw error
      }
    },
  
    async addCategory(categoryData) {
      try {
        // Convert isSubCategory boolean to string "true" or "false"
        const formattedData = {
          ...categoryData,
          isSubCategory: categoryData.isSubCategory ? "true" : "false",
        }
  
        console.log("Adding category with data:", formattedData)
        const token = this.getToken()
  
        const response = await fetch(`${this.baseUrl}/v1/api/expenseCategory/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(formattedData),
        })
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
  
        const data = await response.json()
        console.log("Add category response:", data)
        return data
      } catch (error) {
        console.error("Error adding category:", error)
        throw error
      }
    },
  }
  
  // Export functions
  export const fetchCategoryDropdown = CategoryService.fetchCategoryDropdown.bind(CategoryService)
  export const fetchExpenseTypes = CategoryService.fetchExpenseTypes.bind(CategoryService)
  export const addCategory = CategoryService.addCategory.bind(CategoryService)
  export const fetchAllCategories = CategoryService.fetchAllCategories.bind(CategoryService)
  