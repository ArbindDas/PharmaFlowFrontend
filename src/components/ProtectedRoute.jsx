
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get token from any storage location
  const getToken = () => {
    // Check if user data exists to determine auth type
    const userData = localStorage.getItem('user');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // If user object has authProvider info, use appropriate token
        if (user.authProvider === 'GOOGLE') {
          return localStorage.getItem('accessToken');
        } else {
          return user.token || localStorage.getItem('token');
        }
      } catch (e) {
        return null;
      }
    }
    
    // Check OAuth token
    const oauthToken = localStorage.getItem('accessToken');
    if (oauthToken) return oauthToken;
    
    // Check regular login token
    const standaloneToken = localStorage.getItem('token');
    if (standaloneToken) return standaloneToken;
    
    return null;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Set the authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Verify token is still valid
        const response = await axios.get('http://localhost:8080/api/user/me');
        
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Clear all possible token storage locations
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        // Clear all possible token storage locations
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;