import type { RetailerRequest } from "@/types"

// Mock API base URL - replace with your actual API endpoint
const API_BASE_URL = process.env.BASE_API_URL

// Mock data storage for demonstration
// let mockRequests: RetailerRequest[] = [
//   {
//     id: "1",
//     retailerName: "ABC Retail Store",
//     productName: "Premium Widgets",
//     description: "High-quality widgets for retail",
//     uniqueId: "WID-001",
//     status: "requested",
//     attendedBy: {
//       id: "user_1",
//       name: "John Salesperson",
//       role: "salesperson",
//     },
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "2",
//     retailerName: "XYZ Mart",
//     productName: "Standard Gadgets",
//     description: "Standard gadgets for wholesale",
//     uniqueId: "GAD-002",
//     status: "Returned",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
// ]

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
      // Replace with actual API call:
      const response = await fetch(`${API_BASE_URL}/request`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();

      // Mock implementation
      // return new Promise((resolve) => {
      //   setTimeout(() => resolve(mockRequests), 300)
      // })
    } catch (error) {
      console.error("Failed to fetch requests:", error)
      throw error
    }
  },

  // Get single request
  getById: async (id: string): Promise<RetailerRequest> => {
    try {
      // Replace with actual API call:
      const response = await fetch(`${API_BASE_URL}/request/${id}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
  });
      return response.json();

      // const request = mockRequests.find((r) => r.id === id)
      // if (!request) throw new Error("Request not found")
      // return request
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
      // Replace with actual API call:
      const response = await fetch(`${API_BASE_URL}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();

      // const newRequest: RetailerRequest = {
      //   ...data,
      //   id: `req_${Date.now()}`,
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString(),
      // }
      // mockRequests.push(newRequest)
      // return newRequest
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
      // Replace with actual API call:
      const response = await fetch(`${API_BASE_URL}/request/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();

      // const index = mockRequests.findIndex((r) => r.id === id)
      // if (index === -1) throw new Error("Request not found")

      // mockRequests[index] = {
      //   ...mockRequests[index],
      //   ...data,
      //   updatedAt: new Date().toISOString(),
      // }
      // return mockRequests[index]
    } catch (error) {
      console.error("Failed to update request:", error)
      throw error
    }
  },

  // Delete request
  delete: async (id: string): Promise<void> => {
    try {
      // Replace with actual API call:
      const response = await fetch(`${API_BASE_URL}/request/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      // mockRequests = mockRequests.filter((r) => r.id !== id)
    } catch (error) {
      console.error("Failed to delete request:", error)
      throw error
    }
  },
}
