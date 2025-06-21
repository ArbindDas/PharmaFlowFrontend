import axios from "axios";
import { header } from "framer-motion/client";
const API_URL = "http://localhost:8080/api/auth";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

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
    // Get the stored user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    
    if (!userData?.token) {
      throw new Error('No authentication token found - please login again');
    }
    
    const response = await axiosInstance.get("/get-all-users", {
      headers: {
        Authorization: `Bearer ${userData.token}`,
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

    console.log('Making DELETE request to:', endpoint); // Debug log

    const response = await axios.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
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
      // Request was made but no response received
      console.error("Network error or no response from server");
      throw new Error("Network error - please check your internet connection or try again later.");
    } else {
      // Something else caused the error
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
      // Server responded with a status other than 2xx
      const status = error.response.status;
      const message = error.response.data?.message || "Server error occurred";
      console.error(`HTTP ${status}: ${message}`);
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error or no response from server");
      throw new Error("Network error - please check your internet connection or try again later.");
    } else {
      // Something else caused the error
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

    // Store user data
    localStorage.setItem("user", JSON.stringify(response.data));
    
    // Optionally store token separately for easier access
    localStorage.setItem("token", response.data.token);
    
    return response.data;
  } catch (error) {
    // Clear invalid auth data on error
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
  localStorage.removeItem("user");
   localStorage.removeItem("token");
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");

  // If no user is found in localStorage
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);

    // Optional: Validate expected fields (e.g., token)
    if (!user || typeof user !== "object" || !user.token) {
      console.warn("Invalid user object format in localStorage.");
      return null;
    }

    return user;
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    return null;
  }
};

const getUserProfile = async () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) throw new Error("User is not authenticated");

  const user = JSON.parse(userStr);
  if (!user?.token) throw new Error("User is not authenticated");

  const token = user.token;

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
    localStorage.removeItem("user");
    throw new Error("Token has expired");
  }

  const response = await axiosInstance.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(
      "/forgot-password",
      { email }, // Proper object format
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

const authService = {
  register,
  login,
  getUserProfile,
  logout,
  forgotPassword,
  getAllUsers,
  deleteUser,
  updateuser
};

export default authService;
export const getToken = () => {
  return localStorage.getItem("token") || null;
};
