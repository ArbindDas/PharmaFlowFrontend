

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../api/auth";
import OAuthButton from "../../components/OAuthButton";
import { Eye, EyeOff, User } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
   const { isDarkMode } = useTheme();

  const [focused, setFocused] = useState({
    email: false,
    password: false,
  });

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;

  const validateEmail = (value) => {
    // More comprehensive email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!value) {
      return 'Email address is required.';
    } else if (!regex.test(value)) {
      return 'Enter a valid email address with a single @ symbol and domain.';
    } else {
      // Split into local part and domain
      const parts = value.split('@');
      const domain = parts[1];
      const domainParts = domain.split('.');
      const tld = domainParts[domainParts.length - 1];
      
      // List of common valid TLDs
      const commonTlds = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'io', 'co', 
                         'ai', 'uk', 'us', 'ca', 'au', 'de', 'fr', 'jp', 'in'];
      
      // Check for valid TLD length (2-6 characters) but prioritize common TLDs
      if (tld.length < 2 || tld.length > 6) {
        return 'The domain extension should be between 2-6 characters.';
      }
      
      // Additional check: if TLD is longer than 3 characters, it should be a known long TLD
      const longButValidTlds = ['info', 'museum', 'travel', 'aero', 'asia', 'jobs', 'mobi', 'name', 'pro'];
      
      if (tld.length > 3 && !longButValidTlds.includes(tld) && !commonTlds.includes(tld)) {
        return 'Please check the domain extension in your email address.';
      }
      
      // Check for consecutive dots in domain
      if (domain.includes('..')) {
        return 'Domain name cannot contain consecutive dots.';
      }
      
      // Check for valid characters in domain
      const domainRegex = /^[a-zA-Z0-9.-]+$/;
      if (!domainRegex.test(domain)) {
        return 'Domain contains invalid characters.';
      }
      
      return '';
    }
  };

  useEffect(() => {
    // Check if all fields are valid whenever they change
    const isValid =
      formData.email && !errors.email && formData.password && !errors.password;
    setIsFormValid(isValid);
  }, [formData, errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (!PASSWORD_REGEX.test(value)) {
          error =
            "Password must be 8+ chars with 1 uppercase, 1 lowercase, 1 number, and 1 special character";
        }
        break;
      default:
        break;
    }
     

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate all fields before submission
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        console.log("Login successful, navigating to dashboard");
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      } else {
        setApiError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setApiError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }

    
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode 
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" 
            : "bg-gray-50"
    }`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${
            isDarkMode ? "text-white" : "text-gray-900"
        }`}>
          Sign in to your account
        </h2>
        <p className={`mt-2 text-center text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          Or{" "}
          <Link
            to="/register"
            className={`font-medium ${
                isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"
            }`}
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`py-8 px-4 shadow sm:rounded-lg sm:px-10 ${
            isDarkMode ? "bg-gray-700" : "bg-white"
        }`}>
          {apiError && (
            <div className={`mb-4 rounded-md p-4 ${
                isDarkMode ? "bg-red-900" : "bg-red-50"
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                      isDarkMode ? "text-red-200" : "text-red-800"
                  }`}>
                    {apiError}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onFocus={() => setFocused((prev) => ({ ...prev, email: true }))}
                onBlur={() => setFocused((prev) => ({ ...prev, email: false }))}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 pt-6 border ${
                    isDarkMode 
                        ? "bg-gray-600 border-gray-500 text-white focus:ring-indigo-400 focus:border-indigo-400" 
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                } rounded-md shadow-sm sm:text-sm`}
              />
              <label
                htmlFor="email"
                className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
                  focused.email || formData.email
                    ? `top-1 text-xs ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`
                    : `top-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`
                }`}
              >
                Email address
              </label>
              {errors.email && (
                <p className={`mt-1 text-sm ${
                    isDarkMode ? "text-red-300" : "text-red-600"
                }`}>{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onFocus={() =>
                  setFocused((prev) => ({ ...prev, password: true }))
                }
                onBlur={() => {
                  setFocused((prev) => ({ ...prev, password: false }));
                  validateField("password", formData.password);
                }}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 pt-6 border ${
                    isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white focus:ring-indigo-400 focus:border-indigo-400"
                        : errors.password 
                            ? "border-red-300" 
                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                } rounded-md shadow-sm sm:text-sm`}
              />
              <label
                htmlFor="password"
                className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
                  focused.password || formData.password
                    ? `top-1 text-xs ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`
                    : `top-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-3 ${
                    isDarkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-400 hover:text-gray-600"
                } focus:outline-none`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className={`mt-1 text-sm ${
                    isDarkMode ? "text-red-300" : "text-red-600"
                }`}>{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 ${
                      isDarkMode ? "text-indigo-400 focus:ring-indigo-400 border-gray-500" 
                               : "text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  } rounded`}
                />
                <label
                  htmlFor="remember-me"
                  className={`ml-2 block text-sm ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className={`font-medium ${
                      isDarkMode ? "text-indigo-400 hover:text-indigo-300" 
                               : "text-indigo-600 hover:text-indigo-500"
                  }`}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !isFormValid
                    ? isDarkMode ? "bg-indigo-700" : "bg-indigo-300"
                    : isDarkMode ? "bg-indigo-600 hover:bg-indigo-500" : "bg-indigo-600 hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isDarkMode ? "focus:ring-indigo-400" : "focus:ring-indigo-500"
                } ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
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
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <OAuthButton
                  provider="Google"
                  iconSrc="https://www.svgrepo.com/show/475656/google-color.svg"
                  darkMode={isDarkMode}
                />
                <OAuthButton
                  provider="GitHub"
                  iconSrc="https://www.svgrepo.com/show/512317/github-142.svg"
                  darkMode={isDarkMode}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
