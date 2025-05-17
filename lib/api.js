// API client for interacting with the backend
const API_URL = "http://localhost:5000/api";

// Generic fetch function with error handling
async function fetchAPI(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("token"); // Get token from localStorage
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token if present
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Members API
export const membersAPI = {
  getAll: () => fetchAPI("/members"),
  getById: (id) => fetchAPI(`/members/${id}`),
  create: (data) => fetchAPI("/members", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/members/${id}`, { method: "DELETE" }),
};

// Classes API
export const classesAPI = {
  getAll: () => fetchAPI("/classes"),
  getById: (id) => fetchAPI(`/classes/${id}`),
  create: (data) => fetchAPI("/classes", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/classes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/classes/${id}`, { method: "DELETE" }),
};

// Trainers API
export const trainersAPI = {
  getAll: () => fetchAPI("/trainers"),
  getById: (id) => fetchAPI(`/trainers/${id}`),
  create: (data) => fetchAPI("/trainers", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/trainers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/trainers/${id}`, { method: "DELETE" }),
};

// Messages API
export const messagesAPI = {
  getAll: () => fetchAPI("/messages"),
  getByCategory: (category) => fetchAPI(`/messages/category/${category}`),
  getById: (id) => fetchAPI(`/messages/${id}`),
  create: (data) => fetchAPI("/messages", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/messages/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/messages/${id}`, { method: "DELETE" }),
};

// Settings API
export const settingsAPI = {
  getAll: () => fetchAPI("/settings"),
  update: (data) => fetchAPI("/settings", { method: "PUT", body: JSON.stringify(data) }),
};

// Analytics API
export const analyticsAPI = {
  getAll: () => fetchAPI("/analytics"),
  getByCategory: (category) => fetchAPI(`/analytics/${category}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => fetchAPI("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (userData) => fetchAPI("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  getCurrentUser: () => fetchAPI("/auth/me"),
};

// Export all APIs
export default {
  members: membersAPI,
  classes: classesAPI,
  trainers: trainersAPI,
  messages: messagesAPI,
  settings: settingsAPI,
  analytics: analyticsAPI,
  auth: authAPI,
};