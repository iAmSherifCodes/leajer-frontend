import type { RetailerRequest } from "@/types"

// API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('leajer_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': token })
  }
}

// Retailer Requests API
export const requestsAPI = {
  // Get all requests
  getAll: async (): Promise<RetailerRequest[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/request`, {
        method: 'GET',
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error("Failed to delete request:", error)
      throw error
    }
  },
}
