

import axios from "/node_modules/.vite/deps/axios.js?v=9e72e6e5";
const API_URL = "http://localhost:8080/api/auth";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});





const getToken = () => {
  // First, check if we have user data to determine the current auth type
  const userData = localStorage.getItem('user');
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      
      // Use the appropriate token based on the current user's auth provider
      if (user.authProvider === 'GOOGLE') {
        const oauthToken = localStorage.getItem('accessToken');
        // Clear any regular token to avoid conflicts
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
        }
        return oauthToken;
      } else {
        const regularToken = user.token || localStorage.getItem('token');
        // Clear any OAuth tokens to avoid conflicts
        if (localStorage.getItem('accessToken')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        return regularToken;
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }
  
  // If no user data, check for any token but clean up conflicts
  const oauthToken = localStorage.getItem('accessToken');
  const regularToken = localStorage.getItem('token');
  
  // If both tokens exist, we have a conflict - clear both
  if (oauthToken && regularToken) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
  
  // Return whichever token exists (or null if neither)
  return oauthToken || regularToken;
};

const register = async (fullname, email, password) => {
  try {
    const response = await axiosInstance.post("/signup", {
      fullname,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else if (error.request) {
      throw new Error("Network error - no response from server");
    } else {
      throw new Error("Error setting up registration request");
    }
  }
};

const getAllUsers = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found - please login again');
    }
    
    const response = await axiosInstance.get("/get-all-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch users:",
      error?.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to load user list. Please try again later.");
  }
};

const deleteUser = async (userId, ROLE_ADMIN = false) => {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const endpoint = ROLE_ADMIN
      ? `${API_URL}/admin/users/${(userId)}`
      : `${API_URL}/users/${(userId)}`;

    console.log('Making DELETE request to:', endpoint);

    const response = await axios.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      let message = "Server error occurred";
      
      if (status === 403) {
        message = "You don't have permission to delete users";
      } else if (status === 404) {
        message = "User not found";
      } else if (error.response.data) {
        message = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || message;
      }

      console.error(`HTTP ${status}: ${message}`);
      throw new Error(message);
    } else if (error.request) {
      console.error("Network error or no response from server");
      throw new Error("Network error - please check your internet connection or try again later.");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("Unexpected error - " + error.message);
    }
  }
};

const updateuser = async (userData, ROLE_ADMIN = false) => {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const endpoint = ROLE_ADMIN
      ? `${API_URL}/admin/users/${userData.id}`
      : `${API_URL}/users/${userData.id}`;

    const response = await axios.put(endpoint, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Server error occurred";
      console.error(`HTTP ${status}: ${message}`);
      throw new Error(message);
    } else if (error.request) {
      console.error("Network error or no response from server");
      throw new Error("Network error - please check your internet connection or try again later.");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("Unexpected error - " + error.message);
    }
  }
};



const login = async (email, password) => {
  try {
    const response = await axiosInstance.post("/signin", {
      email,
      password,
    });

    if (!response.data?.token) {
      console.warn("Login successful but no token received");
      throw new Error("Authentication error - no token received");
    }

    // Store user data for regular login - ensure consistent format
    const userData = {
      ...response.data,
      token: response.data.token // Ensure token is in the user object
    };
    
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", response.data.token); // Also store separately for compatibility
    
    return userData;
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    let errorMessage = "Login failed. Please try again.";
    
    if (error.response) {
      errorMessage = error.response.data?.message ||
                   error.response.data?.error ||
                   errorMessage;
    } else if (error.request) {
      errorMessage = "Network error - no response from server";
    }
    
    throw new Error(errorMessage);
  }
};


const logout = () => {
  // Clear all storage items
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Remove axios header
  delete axios.defaults.headers.common['Authorization'];
  
  // Reset state
  setUser(null);
  setIsAuthenticated(false);
  
  // Redirect to login page
  window.location.href = '/login';
};



const getCurrentUser = () => {
  // First try to get from regular login
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && typeof user === "object" && user.token) {
        return user;
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
    }
  }
  
  // Then try OAuth flow - we may need to fetch user data from server
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    // For OAuth users, return a minimal user object
    return { token: accessToken, isOAuth: true };
  }
  
  return null;
};

const getUserProfile = async () => {
  const token = getToken();
  
  if (!token) {
    throw new Error("User is not authenticated");
  }

  // Optional: Check if the token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  if (isTokenExpired(token)) {
    logout();
    throw new Error("Token has expired");
  }

  try {
    const response = await axiosInstance.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      logout();
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(error.response?.data?.message || "Failed to fetch user profile");
  }
};

const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(
      "/forgot-password",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to send reset link. Please try again."
    );
  }
};

// Add this function for OAuth token handling
const setOAuthTokens = (accessToken, refreshToken = null) => {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

const authService = {
  register,
  login,
  getUserProfile,
  logout,
  forgotPassword,
  getAllUsers,
  deleteUser,
  updateuser,
  getCurrentUser,
  getToken,
  setOAuthTokens // Add this new function
};

export default authService;