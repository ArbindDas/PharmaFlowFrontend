import axios from "axios";
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


const login = async (email, password) => {
  try {
    const response = await axiosInstance.post("/signin", {
      email,
      password,
    });

    if (response.data?.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    } else {
      console.warn("Login successful but no token received");
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Login failed. Please try again.";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("Network error - no response from server");
    } else {
      throw new Error("Error setting up login request");
    }
  }
};



const logout = () => {
  localStorage.removeItem("user");
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
    const response = await axiosInstance.post("/forgot-password", 
      { email },  // Proper object format
      {
        headers: {
          'Content-Type': 'application/json'
        }
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
  forgotPassword
};

export default authService;
