
import axios from "axios";

// Create an API client instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Add request interceptor to include auth token in requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock responses for development without backend
const useMockResponses = !import.meta.env.VITE_API_URL && import.meta.env.DEV;

// Store mock data for persistence across requests
const mockDb = {
  users: [
    {
      id: "test123",
      email: "test@example.com",
      password: "password123",
      userType: "patient",
      name: "Test User",
      phone: "+1234567890",
      dateOfBirth: "1990-01-01",
      gender: "female",
      address: "123 Test Street, Test City",
      emergencyContact: "+10987654321",
      bloodType: "A+",
      medicalConditions: ["Asthma"],
      allergies: ["Pollen"],
      profileComplete: true,
      profileImage: "https://i.pravatar.cc/300?u=test@example.com"
    },
    {
      id: "nurse123",
      email: "nurse@example.com",
      password: "password123",
      userType: "nurse",
      name: "Nurse Test",
      phone: "+1234567891",
      address: "456 Nurse Street, Test City",
      profileComplete: true,
      profileImage: "https://i.pravatar.cc/300?u=nurse@example.com"
    }
  ]
};

// Add response interceptor for error handling and mock responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we're using mock responses and there's no response, mock it
    if (useMockResponses && !error.response) {
      console.log("Using mock response for:", error.config.url, error.config.method);
      return handleMockResponse(error.config);
    }

    // Handle common errors (401, 403, etc.)
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/patient/login";
    }
    
    // Log detailed error information for debugging
    console.error("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      endpoint: error.config?.url,
      method: error.config?.method,
    });
    
    return Promise.reject(error);
  }
);

// Helper function to handle mock responses
async function handleMockResponse(config) {
  // Wait a bit to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const url = config.url;
  const method = config.method.toUpperCase();
  
  // Auth endpoints
  if (url.includes("/auth/login") && method === "POST") {
    const body = JSON.parse(config.data);
    const user = mockDb.users.find(u => u.email === body.email && u.password === body.password);
    
    if (user) {
      return {
        data: {
          token: "mock_token_" + Date.now(),
          user: { ...user, password: undefined },
          userType: user.userType
        }
      };
    } else {
      return Promise.reject({
        response: {
          status: 401,
          data: { message: "Invalid credentials" }
        }
      });
    }
  }
  
  if (url.includes("/auth/register") && method === "POST") {
    const body = JSON.parse(config.data);
    
    // Check if user already exists
    if (mockDb.users.some(u => u.email === body.email)) {
      return Promise.reject({
        response: {
          status: 409,
          data: { message: "User with this email already exists" }
        }
      });
    }
    
    // Create new user with required fields and the new name and phone fields
    const newUser = {
      id: "user_" + Date.now(),
      email: body.email,
      password: body.password, // In a real app, this would be hashed
      userType: body.userType,
      name: body.name || "", // Use provided name or empty string
      phone: body.phone || "", // Use provided phone or empty string
      address: "",
      profileComplete: false,
      profileImage: `https://i.pravatar.cc/300?u=${body.email}` // Default avatar
    };
    
    mockDb.users.push(newUser);
    
    return {
      data: {
        token: "mock_token_" + Date.now(),
        user: { ...newUser, password: undefined },
        userType: newUser.userType
      }
    };
  }
  
  // User profile endpoints
  if (url.includes("/user/profile") && method === "GET") {
    const token = config.headers.Authorization?.split(" ")[1];
    if (!token) {
      return Promise.reject({
        response: {
          status: 401,
          data: { message: "Unauthorized" }
        }
      });
    }
    
    // In a real app, we would decode the token to get the user
    // For mock, we'll just return the first user of the needed type
    const userType = localStorage.getItem("user_type");
    const user = mockDb.users.find(u => u.userType === userType);
    
    if (user) {
      return {
        data: { ...user, password: undefined }
      };
    } else {
      return Promise.reject({
        response: {
          status: 404,
          data: { message: "User not found" }
        }
      });
    }
  }
  
  if (url.includes("/user/profile") && method === "POST") {
    const token = config.headers.Authorization?.split(" ")[1];
    const body = JSON.parse(config.data);
    
    if (!token) {
      return Promise.reject({
        response: {
          status: 401,
          data: { message: "Unauthorized" }
        }
      });
    }
    
    // In a real app, we would update the user profile in DB
    // For mock, we'll update our mockDb
    const userType = localStorage.getItem("user_type");
    const userIndex = mockDb.users.findIndex(u => u.userType === userType);
    
    if (userIndex !== -1) {
      mockDb.users[userIndex] = {
        ...mockDb.users[userIndex],
        ...body
      };
      
      return {
        data: { ...mockDb.users[userIndex], password: undefined }
      };
    } else {
      return Promise.reject({
        response: {
          status: 404,
          data: { message: "User not found" }
        }
      });
    }
  }
  
  if (url.includes("/user/complete-profile") && method === "PUT") {
    const token = config.headers.Authorization?.split(" ")[1];
    const body = JSON.parse(config.data);
    
    if (!token) {
      return Promise.reject({
        response: {
          status: 401,
          data: { message: "Unauthorized" }
        }
      });
    }
    
    // Find the user and update profile
    const userType = localStorage.getItem("user_type");
    const userIndex = mockDb.users.findIndex(u => u.userType === userType);
    
    if (userIndex !== -1) {
      mockDb.users[userIndex] = {
        ...mockDb.users[userIndex],
        ...body,
        profileComplete: true
      };
      
      return {
        data: { ...mockDb.users[userIndex], password: undefined }
      };
    } else {
      return Promise.reject({
        response: {
          status: 404,
          data: { message: "User not found" }
        }
      });
    }
  }
  
  if (url.includes("/user/upload-profile-image") && method === "POST") {
    // Mock image upload
    return {
      data: {
        imageUrl: "https://i.pravatar.cc/300?u=" + Date.now()
      }
    };
  }
  
  // Default fallback for unhandled endpoints
  return Promise.reject({
    response: {
      status: 501,
      data: { message: "Endpoint not implemented in mock backend" }
    }
  });
}

// Helper function to get a mock user for testing
export const getMockTestUser = () => {
  if (useMockResponses) {
    return {
      email: "test@example.com",
      password: "password123"
    };
  }
  return null;
};

export default apiClient;
