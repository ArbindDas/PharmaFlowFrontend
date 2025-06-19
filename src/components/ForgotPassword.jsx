

import React, { useState, useEffect } from "react";
import authService from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [focused, setFocused] = useState({ email: false });
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Email validation regex
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Validate email in real-time
  useEffect(() => {
    if (email && !EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response);
      setEmail("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gray-50"
    }`}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Reset your password
          </h2>
          <p className={`mt-2 text-center text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        {/* Error message display */}
        {error && (
          <div className={`border px-4 py-3 rounded relative ${
            isDarkMode 
              ? "bg-red-900 border-red-700 text-red-200" 
              : "bg-red-100 border-red-400 text-red-700"
          }`}>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Success message display */}
        {message && (
          <div className={`border px-4 py-3 rounded relative ${
            isDarkMode 
              ? "bg-green-900 border-green-700 text-green-200" 
              : "bg-green-100 border-green-400 text-green-700"
          }`}>
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 ${
                  isDarkMode 
                    ? "bg-gray-600 text-white border-gray-500 focus:ring-indigo-400 focus:border-indigo-400" 
                    : `border ${emailError ? "border-red-500" : "border-gray-300"} focus:ring-indigo-500 focus:border-indigo-500`
                } placeholder-gray-500 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused((prev) => ({ ...prev, email: true }))}
                onBlur={() => setFocused((prev) => ({ ...prev, email: false }))}
              />
              <label
                htmlFor="email"
                className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none z-10 ${
                  focused.email || email
                    ? `-top-2 text-xs px-1 ${
                        isDarkMode 
                          ? "text-indigo-300 bg-gray-700" 
                          : "text-indigo-600 bg-white"
                      }`
                    : `top-3 text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`
                }`}
              >
                Email address
              </label>
              {emailError && (
                <p className={`mt-1 text-sm ${
                  isDarkMode ? "text-red-300" : "text-red-600"
                }`}>
                  {emailError}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !!emailError || !email}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading || !!emailError || !email
                  ? isDarkMode ? "bg-indigo-700" : "bg-indigo-400"
                  : isDarkMode ? "bg-indigo-600 hover:bg-indigo-500" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDarkMode ? "focus:ring-indigo-400" : "focus:ring-indigo-500"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate("/login")}
            className={`text-sm font-medium ${
              isDarkMode 
                ? "text-indigo-400 hover:text-indigo-300" 
                : "text-indigo-600 hover:text-indigo-500"
            }`}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;