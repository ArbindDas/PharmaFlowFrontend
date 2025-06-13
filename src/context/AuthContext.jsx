import React, { createContext, useState, useEffect } from "react";
import authService from "../api/auth"; // your API helper

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
