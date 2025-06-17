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


const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`, {
      headers: {          
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete user ", error.response?.data || error.message);
    throw error;
  }
};



// const updateuser = async (userData) => {
//   try {
//     const response = await axiosInstance.put(`/update`, userData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating user:", error);
//     if (error.response && error.response.data) {
//       throw new Error(error.response.data.message || "Failed to update user");
//     } else {
//       throw new Error("Network error or server is unreachable");
//     }
//   }
// };

const updateuser = async (userData) => {
  try {
    const token = await getToken(); // Implement secure token retrieval
    const response = await axiosInstance.put(`/update`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Please authenticate');
        case 403:
          throw new Error('Not authorized to update this user');
        case 404:
          throw new Error('User not found');
        default:
          throw new Error(error.response.data.message || 'Update failed');
      }
    } else {
      throw new Error('Network error - please try again later');
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
