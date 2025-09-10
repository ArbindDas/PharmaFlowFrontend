// src/components/OAuthButton.jsx
import React from 'react';

const OAuthButton = ({ provider, iconSrc, darkMode }) => {
  const handleOAuthLogin = () => {
    // Redirect to the Spring Boot OAuth2 authorization endpoint
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider.toLowerCase()}`;
  };

  return (
    <button
      type="button" // Important: type="button" to prevent form submission
      onClick={handleOAuthLogin}
      className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${
        darkMode 
          ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600" 
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        darkMode ? "focus:ring-gray-500" : "focus:ring-indigo-500"
      }`}
    >
      <img className="h-5 w-5 mr-2" src={iconSrc} alt={`${provider} icon`} />
      Continue with {provider}
    </button>
  );
};

export default OAuthButton;