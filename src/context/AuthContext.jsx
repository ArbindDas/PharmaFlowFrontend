import React, { createContext, useState, useEffect } from "react";
import authService from "../api/auth"; // your API helper


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


    const deleteUserById = async (userId, isAdmin = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await deleteUser(userId, isAdmin);

      // If the deleted user is the currently logged-in user
      if (user && user.id === userId) {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setError(err.message);
      console.error("deleteUserById error:", err);
      throw err; // Re-throw to allow component-level handling
    } finally {
      setIsLoading(false);
    }
  };

 


const updateUserProfile = async (userData) => {
  try {
    setError(null);
    setIsUpdating(true);
    
    // Ensure fresh API call returns new data
    const response = await authService.updateuser(userData, false);
    
    // Create completely new user object
    const updatedUser = { 
      ...response,
      // Ensure all critical fields are included
      id: response.id || userData.id,
      fullName: response.fullName || userData.fullName,
      email: response.email || userData.email,
      roles: response.roles || userData.roles
    };
    
    // Update context state
    setUser(prev => ({ ...prev, ...updatedUser }));
    
    // Return fresh object
    return { ...updatedUser };
  } catch (error) {
    setError(error);
    throw error;
  } finally {
    setIsUpdating(false);
  }
};

  // New wrapper function for admin updates
  const adminUpdateUserProfile = async (userData) => {
    try {
      setError(null);
      const updatedUser = await authService.updateuser(userData, true); // Admin update
      return updatedUser; // Typically don't setUser for admin actions
    } catch (error) {
      setError(error);
      throw error;
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
        updateUserProfile,
        adminUpdateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
