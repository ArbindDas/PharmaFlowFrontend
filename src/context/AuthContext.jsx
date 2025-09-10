

import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../api/auth"; // your API helper
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Set up axios interceptors and check initial auth state
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Set the authorization header for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      // Only fetch user if we have a token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching user profile with token:", token);
        const currentUser = await authService.getUserProfile();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth error:", err.message);
        // If token is invalid, clear it
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete axios.defaults.headers.common['Authorization'];
        }
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Set axios header for future requests
      const token = localStorage.getItem('accessToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return {
        success: false,
        message: error.response?.data?.error || error.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // const logout = () => {
  //   authService.logout();
  //   setUser(null);
  //   setIsAuthenticated(false);
  //   setError(null);
  //   // Remove axios header
  //   delete axios.defaults.headers.common['Authorization'];
  // };

  const logout = () => {
  // Determine auth type first
  const userData = localStorage.getItem('user');
  let isOAuth = false;
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      isOAuth = user.authProvider === 'GOOGLE';
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  
  // Clear all storage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  if (isOAuth) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // You might also want to call your backend to revoke the OAuth token
  }
  
  // Redirect to login
  window.location.href = '/login';
};

  const fetchUserDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching user profile...");
      const userDetails = await authService.getUserProfile();
      console.log("User profile response:", userDetails);
      setUser(userDetails);
      setIsAuthenticated(true);
      return userDetails;
    } catch (error) {
      console.error("Fetch user details error:", error);
      setError(error.message);
      // If unauthorized, clear tokens
      if (error.response?.status === 401) {
        logout();
      }
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const deleteUserById = async (userId, isAdmin = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.deleteUser(userId, isAdmin);

      // If the deleted user is the currently logged-in user
      if (user && user.id === userId) {
        setUser(null);
        setIsAuthenticated(false);
        logout();
      }
    } catch (err) {
      setError(err.message);
      console.error("deleteUserById error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      setError(null);
      setIsUpdating(true);
      
      const response = await authService.updateUser(userData, false);
      
      const updatedUser = { 
        ...response,
        id: response.id || userData.id,
        fullName: response.fullName || userData.fullName,
        email: response.email || userData.email,
        roles: response.roles || userData.roles
      };
      
      setUser(prev => ({ ...prev, ...updatedUser }));
      
      return { ...updatedUser };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const adminUpdateUserProfile = async (userData) => {
    try {
      setError(null);
      setIsUpdating(true);
      const updatedUser = await authService.updateUser(userData, true);
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allUsers = await authService.getAllUsers();
      return allUsers;
    } catch (error) {
      setError(error.message);
      console.error("Get all users error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullname, email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.register(fullname, email, password);
      return { success: true };
    } catch (error) {
      setError(error.message);
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message ||
                error.message ||
                "Registration failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const tokens = await authService.refreshToken(refreshToken);
      localStorage.setItem('accessToken', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      
      return tokens;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      throw error;
    }
  };

  // const handleOAuthLogin = async (accessToken, refreshToken = null) => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);
      
  //     // Store tokens
  //     localStorage.setItem('accessToken', accessToken);
  //     if (refreshToken) {
  //       localStorage.setItem('refreshToken', refreshToken);
  //     }
      
  //     // Set axios header
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
  //     // Fetch user details
  //     const userDetails = await authService.getUserProfile();
  //     setUser(userDetails);
  //     setIsAuthenticated(true);
      
  //     return userDetails;
  //   } catch (error) {
  //     setError(error.message);
  //     console.error("OAuth login error:", error);
  //     logout();
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleOAuthLogin = async (accessToken, refreshToken = null) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Set axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Fetch user details
      const userDetails = await authService.getUserProfile();
      
      // ADD THIS: Store user data with authProvider information
      localStorage.setItem('user', JSON.stringify({
        ...userDetails,
        authProvider: 'GOOGLE' // Make sure this matches what your backend returns
      }));
      
      setUser(userDetails);
      setIsAuthenticated(true);
      
      return userDetails;
    } catch (error) {
      setError(error.message);
      console.error("OAuth login error:", error);
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isUpdating,
        error,
        login,
        register,
        logout,
        fetchUserDetails,
        getAllUsers,
        deleteUserById,
        updateUserProfile,
        adminUpdateUserProfile,
        refreshToken,
        handleOAuthLogin,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};