const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
};

const Remiter = {
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

  async getRemiter() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await fetch(`${this.baseUrl}/v1/api/expense/remitterDashbord`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Error fetching remitter data:", error);
      throw error;
    }
  },

async addRemiter(expenseId, level, { status, remarks }) {
  try {
    const token = this.getToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    if (!expenseId || !level || !status || !remarks) {
      throw new Error("Missing required fields: expenseId, level, status, or remarks");
    }

    const payload = {
      expenseId: expenseId,
      [level]: {
        status: status,
        remarks: remarks,
      },
    };
    const response = await fetch(`${this.baseUrl}/v1/api/expense/approve`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);
      throw new Error(errorData.message || "Failed to submit remitter approval");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting remitter approval:", error);
    throw error;
  }
}
};

export const getRemiter = Remiter.getRemiter.bind(Remiter);
export const addRemiter = Remiter.addRemiter.bind(Remiter);