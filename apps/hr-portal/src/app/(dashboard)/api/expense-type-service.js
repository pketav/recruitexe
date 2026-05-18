

const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage
  }
  return null
}

const ExpenseTypeService = {
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



async fetchAllExpenseTypes() {
  try {
    const token = this.getToken();

    const response = await fetch(`${this.baseUrl}/v1/api/expenseType/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const items = data.items || [];
    const formattedData = items.map(item => ({
      id: item._id,
      name: item.name,
      description: item.description,
      isActive: item.isActive,
      approver: item.approverLevels || [],
      remitter: item.remitterLevels || [],
      categoriesIds: item.categoriesIds || [],
      createdAt:item.createdAt.slice(0, 10),
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching all expense types:", error);
    throw error;
  }
},

  async fetchCategoryDropdown() {
    try {
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

      const items = data.items || []

      const formattedData = items.map(item => ({
        id: item._id,
        name: item.name,
      }))

      return formattedData
    } catch (error) {
      console.error("Error fetching category dropdown:", error)
      throw error
    }
  },


  async addExpenseType(expenseTypeData) {
  try {
    const token = this.getToken()

    if (!expenseTypeData.categoriesIds || !Array.isArray(expenseTypeData.categoriesIds) || expenseTypeData.categoriesIds.length === 0) {
      throw new Error("At least one category must be selected")
    }

    const apiData = {
      name: expenseTypeData.name?.trim() || "",
      description: expenseTypeData.description?.trim() || "",
      categoriesIds: expenseTypeData.categoriesIds,
      approverLevels: expenseTypeData.approverLevels || [],
      remitterLevels: expenseTypeData.remitterLevels || [],
      isActive: true 
    }


    const response = await fetch(`${this.baseUrl}/v1/api/expenseType/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(apiData),
    })

    const data = await response.json()

    if (!response.ok || !data.status) {
      throw new Error(data.message || `API error: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("Error adding expense type:", error)
    throw error
  }
},

async updateExpenseType(expenseTypeData) {
  try {
    const token = this.getToken()

    const expenseTypeId = expenseTypeData.id || expenseTypeData._id
    if (!expenseTypeId) {
      throw new Error("Expense Type ID is missing")
    }
    if (!expenseTypeData.categoriesIds || !Array.isArray(expenseTypeData.categoriesIds) || expenseTypeData.categoriesIds.length === 0) {
      throw new Error("At least one category must be selected")
    }

    const apiData = {
      id: expenseTypeId,
      name: expenseTypeData.name?.trim() || "",
      description: expenseTypeData.description?.trim() || "",
      categoriesIds: expenseTypeData.categoriesIds,
      approverLevels: expenseTypeData.approverLevels || [],
      remitterLevels: expenseTypeData.remitterLevels || []
    }


    const response = await fetch(`${this.baseUrl}/v1/api/expenseType/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(apiData),
    })

    const data = await response.json()

    if (!response.ok || !data.status) {
      throw new Error(data.message || `API error: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("Error updating expense type:", error)
    throw error
  }
},

  async deleteExpenseType(expenseTypeId) {
    try {
      const token = this.getToken()

      const response = await fetch(`${this.baseUrl}/v1/api/expenseType/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ _id: expenseTypeId }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error deleting expense type:", error)
      throw error
    }
  },
}

// Export functions
export const fetchAllExpenseTypes = ExpenseTypeService.fetchAllExpenseTypes.bind(ExpenseTypeService)
export const fetchCategoryDropdown = ExpenseTypeService.fetchCategoryDropdown.bind(ExpenseTypeService)
export const addExpenseType = ExpenseTypeService.addExpenseType.bind(ExpenseTypeService)
export const updateExpenseType = ExpenseTypeService.updateExpenseType.bind(ExpenseTypeService)
export const deleteExpenseType = ExpenseTypeService.deleteExpenseType.bind(ExpenseTypeService)