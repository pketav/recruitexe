const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
};

const ExpenseService = {
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


  async getAllExpenses() {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.baseUrl}/v1/api/expense/all`, {
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
      const items = data.items.FieldData || [];
      const cardData = data.items.expenseStatusCounts || [];
      const formattedData = items.map((item) => ({
        id: item._id,
        categoryData: item.categoryData?.name || "N/A",
        price: item.price || 0,
        expenseBillname: item.expenseBillname || "N/A",
        image: item.image || "",
        fromWhere: item.fromWhere || "",
        expenseTypeData: item.expenseTypeData?.name || "N/A",
        approverLevels: item.approverLevels || {},
        remitterLevels: item.remitterLevels || {},
        approverLevel: item.approverLevel || {},
        remitterLevel: item.remitterLevel || {},
      }));

      return {
        formattedData,
        cardData,
      };
    } catch (error) {
      console.error("Error fetching all expenses:", error);
      throw error;
    }
  },

  async getAllExpensesById() {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.baseUrl}/v1/api/expense/allExpenseById`, {
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
      return data ;
    } catch (error) {
      console.error(`Error fetching expenses by ID ${id}:`, error);
      throw error;
    }
  },

  async addExpenses(expenses) {
    try {
      const token = this.getToken();
      const expensesData = expenses.map((expense) => ({
        expenseType: expense.expenseType,
        price: Number(expense.price),
        image: expense.image ? URL.createObjectURL(expense.image) : "",
      }));

      const response = await fetch(`${this.baseUrl}/v1/api/expense/add`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expensesData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expenses");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding expenses:", error);
      throw error;
    }
  },

  async updateExpense(expense) {
    try {
      const token = this.getToken();
      const expenseId = expense.id || expense._id;
      if (!expenseId) throw new Error("Expense ID is missing");

      const formData = new FormData();
      formData.append("id", expenseId);
      formData.append("expenseType", expense.expenseType);
      formData.append("price", expense.price);
      formData.append("expenseBillname", expense.expenseBillname);

      if (expense.image) {
        formData.append("image", expense.image);
      }

      const response = await fetch(`${this.baseUrl}/v1/api/expense/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  },
};

export const getAllExpenses = ExpenseService.getAllExpenses.bind(ExpenseService);
export const getAllExpensesById = ExpenseService.getAllExpensesById.bind(ExpenseService);
export const addExpenses = ExpenseService.addExpenses.bind(ExpenseService);
export const updateExpense = ExpenseService.updateExpense.bind(ExpenseService);

export default ExpenseService;