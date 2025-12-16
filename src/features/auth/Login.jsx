


import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../api/auth";
import OAuthButton from "../../components/OAuthButton";
import { Eye, EyeOff, User } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { unifiedLogin } from "../../api/unifiedAuth";

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
    if (!value) return "Email address is required.";

    const emailRegex =
      /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9]+([._%+-][A-Za-z0-9]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+com$/;

    if (!emailRegex.test(value)) {
      return "Enter a valid .com email address.";
    }

    const [local, domain] = value.toLowerCase().split("@");

    if (local.includes("..") || domain.includes("..")) {
      return "Email cannot contain consecutive dots.";
    }

    if (/^[._%+-]|[._%+-]$/.test(local)) {
      return "Local part cannot start or end with special characters.";
    }

    const domainParts = domain.split(".");

    for (const part of domainParts) {
      if (!/^[a-z0-9-]+$/.test(part)) {
        return "Domain contains invalid characters.";
      }
      if (/^-|-$/.test(part)) {
        return "Domain parts cannot start or end with hyphens.";
      }
      if (!/[a-z]/.test(part)) {
        return "Each domain part must contain at least one letter.";
      }
    }

    return "";
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

    // Use the unified login
    setIsLoading(true);

    try {
      const result = await unifiedLogin(formData.email, formData.password);
      
      if (result.success) {
        console.log('✅ Unified login successful!');
        console.log('✅ Token:', result.token);
        console.log('✅ Roles:', result.roles);
        
        // Navigate after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setApiError(result.message);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setApiError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback theme detection if context fails
  const isDark = isDarkMode || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  // Helper function to get input base classes
  const getInputClasses = (fieldName) => {
    const hasError = errors[fieldName];
    
    let baseClasses = "peer w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ";
    
    if (hasError) {
      baseClasses += "border-red-500 focus:ring-red-500/50 ";
    } else {
      baseClasses += isDark 
        ? "border-gray-600 focus:ring-indigo-500/50 " 
        : "border-gray-300 focus:ring-indigo-500/50 ";
    }
    
    baseClasses += isDark 
      ? "bg-gray-700 text-white placeholder-gray-400 hover:border-gray-500" 
      : "bg-white text-gray-900 placeholder-gray-400 hover:border-gray-400";
    
    return baseClasses;
  };

  // Helper function to get label classes
  const getLabelClasses = (fieldName, hasValue) => {
    const isFocused = focused[fieldName];
    
    let baseClasses = "absolute left-4 px-1 text-xs font-medium transition-all duration-200 ease-in-out pointer-events-none ";
    baseClasses += "peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 ";
    baseClasses += "peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 ";
    baseClasses += "peer-focus:-top-2 peer-focus:text-xs ";
    
    if (isDark) {
      baseClasses += "peer-focus:text-indigo-300 ";
    } else {
      baseClasses += "peer-focus:text-indigo-600 ";
    }
    
    if (isFocused || hasValue) {
      baseClasses += "-top-2 ";
      if (isDark) {
        baseClasses += "bg-gray-800/90 text-indigo-300";
      } else {
        baseClasses += "bg-white text-indigo-600";
      }
    } else {
      baseClasses += "top-3 ";
      if (isDark) {
        baseClasses += "bg-transparent text-gray-400";
      } else {
        baseClasses += "bg-transparent text-gray-500";
      }
    }
    
    return baseClasses;
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark 
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" 
            : "bg-gradient-to-b from-blue-50 via-white to-gray-50"
    }`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`mt-6 text-center text-3xl font-bold tracking-tight ${
            isDark ? "text-white" : "text-gray-900"
        }`}>
          Sign in to your account
        </h2>
        <p className={`mt-2 text-center text-sm ${
            isDark ? "text-gray-300" : "text-gray-600"
        }`}>
          Or{" "}
          <Link
            to="/register"
            className={`font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-1 ${
                isDark 
                  ? "text-indigo-400 hover:text-indigo-300 focus:ring-indigo-500 focus:ring-offset-gray-900" 
                  : "text-indigo-600 hover:text-indigo-500 focus:ring-indigo-500 focus:ring-offset-white"
            } transition-colors duration-200`}
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border transition-all duration-300 ${
            isDark 
              ? "bg-gray-800/90 border-gray-700 backdrop-blur-sm" 
              : "bg-white/90 border-gray-200 backdrop-blur-sm"
        }`}>
          {apiError && (
            <div className={`mb-6 rounded-xl p-4 border ${
                isDark 
                  ? "bg-red-900/30 border-red-800/50 text-red-200" 
                  : "bg-red-50 border-red-200 text-red-800"
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className={`h-5 w-5 ${isDark ? "text-red-400" : "text-red-600"}`}
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
                  <h3 className={`text-sm font-medium`}>
                    {apiError}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onFocus={() => setFocused((prev) => ({ ...prev, email: true }))}
                onBlur={() => setFocused((prev) => ({ ...prev, email: false }))}
                onChange={handleChange}
                className={getInputClasses('email')}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={getLabelClasses('email', formData.email)}
              >
                Email address
              </label>
              {errors.email && (
                <p className={`mt-2 text-xs flex items-center gap-1 ${
                    isDark ? "text-red-300" : "text-red-600"
                }`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onFocus={() => setFocused((prev) => ({ ...prev, password: true }))}
                onBlur={() => {
                  setFocused((prev) => ({ ...prev, password: false }));
                  validateField("password", formData.password);
                }}
                onChange={handleChange}
                className={getInputClasses('password')}
                placeholder=" "
              />
              <label
                htmlFor="password"
                className={getLabelClasses('password', formData.password)}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-3 p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200
                  ${isDark 
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700 focus:ring-indigo-500 focus:ring-offset-gray-800" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-indigo-500 focus:ring-offset-white"
                  }`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className={`mt-2 text-xs flex items-center gap-1 ${
                    isDark ? "text-red-300" : "text-red-600"
                }`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 rounded transition-colors duration-200 ${
                      isDark 
                          ? "bg-gray-700 border-gray-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800" 
                          : "border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
                  }`}
                />
                <label
                  htmlFor="remember-me"
                  className={`ml-2 block text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className={`font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-1 ${
                      isDark 
                        ? "text-indigo-400 hover:text-indigo-300 focus:ring-indigo-500 focus:ring-offset-gray-800" 
                        : "text-indigo-600 hover:text-indigo-500 focus:ring-indigo-500 focus:ring-offset-white"
                  } transition-colors duration-200`}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white 
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${!isFormValid || isLoading
                    ? isDark 
                        ? "bg-indigo-900/50 cursor-not-allowed" 
                        : "bg-indigo-300 cursor-not-allowed"
                    : isDark 
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 active:from-indigo-800 active:to-purple-800" 
                        : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white active:from-indigo-800 active:to-blue-800"
                  } ${isLoading ? "opacity-90 cursor-wait" : ""}`}
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
              
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-3 rounded-full ${
                      isDark 
                        ? 'bg-gray-800 text-gray-400 border border-gray-700' 
                        : 'bg-white text-gray-500 border border-gray-200'
                    }`}>
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <OAuthButton
                    provider="Google"
                    iconSrc="https://www.svgrepo.com/show/475656/google-color.svg"
                    darkMode={isDark}
                  />
                  <OAuthButton
                    provider="GitHub"
                    iconSrc="https://www.svgrepo.com/show/512317/github-142.svg"
                    darkMode={isDark}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;