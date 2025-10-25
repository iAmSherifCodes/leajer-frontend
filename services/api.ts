import type { RetailerRequest } from "@/types"

// Mock API base URL - replace with your actual API endpoint
const API_BASE_URL = process.env.BASE_API_URL

export const authAPI = {
  signup: async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ id: string; name: string; email: string; role: string }> => {
    try {
      // Replace with actual API call:
      // const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name }),
      // });
      // if (!response.ok) throw new Error('Signup failed');
      // return response.json();

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: `user_${Date.now()}`,
            name,
            email,
            role: "salesperson",
          })
        }, 300)
      })
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    }
  },
}

// Retailer Requests API
export const requestsAPI = {
  // Get all requests
  getAll: async (): Promise<RetailerRequest[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/request`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    } catch (error) {
      console.error("Failed to fetch requests:", error)
      throw error
    }
  },

  // Get single request
  getById: async (id: string): Promise<RetailerRequest> => {
    try {
      const response = await fetch(`${API_BASE_URL}/request/${id}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
  });
      return response.json();
    } catch (error) {
      console.error("Failed to fetch request:", error)
      throw error
    }
  },

  // Create new request
  create: async (data: {
    retailerName: string;
    productName: string;
    description: string;
    uniqueId: string;
    attendedBy: string;
  }): Promise<RetailerRequest> => {
    try {
      const response = await fetch(`${API_BASE_URL}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Failed to create request:", error)
      throw error
    }
  },

  // Update request
  update: async (id: string, data: {
    status: string;
  }): Promise<RetailerRequest> => {
    try {
      const response = await fetch(`${API_BASE_URL}/request/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Failed to update request:", error)
      throw error
    }
  },

  // Delete request
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/request/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Failed to delete request:", error)
      throw error
    }
  },
}
