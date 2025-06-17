import React, { createContext, useState, useEffect } from "react";
import authService from "../api/auth"; // your API helper
import { tr } from "framer-motion/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getUserProfile();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // console.error("Auth error:", err.message);
        setUser(null);
        setIsAuthenticated(false);
        // Handle errors or ignore if user not logged in

        // console.error(err);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Optional: fetch user details from backend (refresh profile)
  const fetchUserDetails = async () => {
    try {
      const userDetails = await authService.getUserProfile();
      setUser(userDetails);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Fetch user details error:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false); // ✅ important!
    }
  };

  // Delete user by id
  const deleteUserById = async (userId) => {
    try {
      setIsLoading(true);
      await authService.deleteUser(userId);

      // If the deleted user is the currently logged-in user
      if (user && user.id === userId) {
        setUser(null);
        setIsAuthenticated(false);
      }

      setError(null);
    } catch (err) {
      setError(err.message || "Failed to delete user");
      console.error("deleteUserById error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData) => {
  try {
    setIsLoading(true);
    setError(null);

    const updatedUser = await authService.updateuser(userData);

    setUser(updatedUser);
    setIsAuthenticated(true);
    return updatedUser;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 
                       err.message || 
                       "Failed to update user due to network issues";
    setError(errorMessage);
    console.error("updateUser error:", err);
    throw errorMessage; // Throw a string instead of the error object
  } finally {
    setIsLoading(false);
  }
};

  const getAllUsersFrom = async () => {
    try {
      const allUsers = await authService.getAllUsers();
      setUser(allUsers);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("fetch user details error : ", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      // console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.error || error.message || "Login failed",
      };
    }
  };

  const register = async (fullname, email, password) => {
    try {
      await authService.register(fullname, email, password);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        fetchUserDetails,
        getAllUsersFrom,
        deleteUserById,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
