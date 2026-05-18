const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
};

const ApproverScreen = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,

  getToken() {
    const localStorage = getLocalStorage();
    if (!localStorage) return null;
    const token = localStorage.getItem("authToken");
    return token ? token : null;
  },

  async getApproverScreen() {
    try {
      let token = this.getToken();
      if (!token) throw new Error("Token not found");
      const response = await fetch(`${this.baseUrl}/v1/api/expenseSubmission`, {
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
      return data.items.submissions || []; // Updated to access items.submissions
    } catch (error) {
      console.error("Error fetching approver screen:", error);
      throw error; // Ensure error is thrown to be handled by caller
    }
  },

  async addApproverScreen(submissionId, payload) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      if (!submissionId) {
        throw new Error("Missing required field: submissionId");
      }


      const response = await fetch(`${this.baseUrl}/v1/api/expenseSubmission/status/${submissionId}`, {
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
        throw new Error(errorData.message || "Failed to update approval status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating approval status:", error);
      throw error;
    }
  },
};

export const getApproverScreen = ApproverScreen.getApproverScreen.bind(ApproverScreen);
export const addApproverScreen = ApproverScreen.addApproverScreen.bind(ApproverScreen);