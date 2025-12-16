

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [validation, setValidation] = useState({
    fullname: '',
    email: '',
    password: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [focused, setFocused] = useState({
    fullname: false,
    email: false,
    password: false
  });

  const validateFullname = (value) => {
    const regex = /^[a-zA-Z\s]{4,30}$/;
    return regex.test(value) ? '' : 'Full name must be 4-30 characters and contain only letters and spaces.';
  };

  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com"
  ];

  const validateEmail = (value) => {
    if (!value) return "Email address is required.";

    const regex =
      /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9]+([._%+-][A-Za-z0-9]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

    if (!regex.test(value)) return "Enter a valid email address.";

    const domain = value.split("@")[1].toLowerCase();

    if (!allowedDomains.includes(domain)) {
      return "Please use a valid email provider (gmail, yahoo, outlook, etc.)";
    }

    return "";
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;
    return regex.test(value)
      ? ''
      : 'Password must be at least 8+ characters, include uppercase, lowercase, number, and special character (@$!%*#?&^_-).';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullnameError = validateFullname(fullname); 
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (fullnameError || emailError || passwordError) {
      setValidation({ fullname: fullnameError, email: emailError, password: passwordError });
      return;
    }

    setError('');
    const result = await register(fullname, email, password); 
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  // If useTheme is not working, fallback to checking document class
  const isDark = isDarkMode || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  // Helper function to get input base classes
  const getInputClasses = (fieldName) => {
    const hasError = validation[fieldName];
    
    let baseClasses = "peer w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ";
    
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
    
    let baseClasses = "absolute left-3 px-1 text-xs font-medium transition-all duration-200 ease-in-out pointer-events-none ";
    baseClasses += "peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 ";
    baseClasses += "peer-placeholder-shown:top-3 peer-placeholder-shown:left-3 ";
    baseClasses += "peer-focus:-top-2 peer-focus:text-xs ";
    
    if (isDark) {
      baseClasses += "peer-focus:text-indigo-300 ";
    } else {
      baseClasses += "peer-focus:text-indigo-600 ";
    }
    
    if (isFocused || hasValue) {
      baseClasses += "-top-2 ";
      if (isDark) {
        baseClasses += "bg-gray-800 text-indigo-300";
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
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark 
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-black" 
          : "bg-gradient-to-b from-blue-50 via-white to-gray-100"
    }`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-2xl shadow-xl border transition-all duration-300 ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-100"
      }`}>
        <div className="text-center">
          <h2 className={`mt-6 text-3xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
          }`}>
            Create your account
          </h2>
          <p className={`mt-2 text-sm ${
              isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            Or{' '}
            <button
              onClick={() => navigate('/login')}
              className={`font-medium focus:outline-none ${
                  isDark 
                    ? "text-indigo-400 hover:text-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800" 
                    : "text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
              }`}
            >
              sign in to your existing account
            </button>
          </p>
        </div>

        {error && (
          <div className={`rounded-lg p-4 border ${
              isDark 
                ? "bg-red-900/30 border-red-800 text-red-200" 
                : "bg-red-50 border-red-200 text-red-800"
          }`}>
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium">
                  {error}
                </h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                value={fullname}
                onFocus={() => setFocused(prev => ({ ...prev, fullname: true }))}
                onBlur={() => setFocused(prev => ({ ...prev, fullname: false }))}
                onChange={(e) => {
                  setFullname(e.target.value);
                  setValidation((v) => ({
                    ...v,
                    fullname: validateFullname(e.target.value)
                  }));
                }}
                className={getInputClasses('fullname')}
                placeholder=" "
              />
              <label 
                htmlFor="fullname" 
                className={getLabelClasses('fullname', fullname)}
              >
                Full Name
              </label>
              {validation.fullname && (
                <p className={`mt-1 text-xs flex items-center gap-1 ${
                    isDark ? "text-red-300" : "text-red-600"
                }`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {validation.fullname}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onFocus={() => setFocused(prev => ({ ...prev, email: true }))}
                onBlur={() => setFocused(prev => ({ ...prev, email: false }))}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidation((v) => ({
                    ...v,
                    email: validateEmail(e.target.value)
                  }));
                }}
                className={getInputClasses('email')}
                placeholder=" "
              />
              <label 
                htmlFor="email" 
                className={getLabelClasses('email', email)}
              >
                Email address
              </label>
              {validation.email && (
                <p className={`mt-1 text-xs flex items-center gap-1 ${
                    isDark ? "text-red-300" : "text-red-600"
                }`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {validation.email}
                </p>
              )}
            </div>

            {/* Password with Eye Toggle */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onFocus={() => setFocused(prev => ({ ...prev, password: true }))}
                onBlur={() => setFocused(prev => ({ ...prev, password: false }))}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidation((v) => ({
                    ...v,
                    password: validatePassword(e.target.value)
                  }));
                }}
                className={getInputClasses('password')}
                placeholder=" "
              />
              <label 
                htmlFor="password" 
                className={getLabelClasses('password', password)}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-3 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${isDark 
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700 focus:ring-indigo-500 focus:ring-offset-gray-800" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-indigo-500 focus:ring-offset-white"
                  }`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {validation.password && (
                <p className={`mt-1 text-xs flex items-center gap-1 ${
                    isDark ? "text-red-300" : "text-red-600"
                }`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {validation.password}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white 
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isDark 
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500 focus:ring-offset-gray-800" 
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:ring-indigo-500 focus:ring-offset-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={!fullname || !email || !password || validation.fullname || validation.email || validation.password}
            >
              Register
            </button>
          </div>

          {/* Password requirements hint */}
          <div className={`text-xs rounded-lg p-3 ${isDark ? "bg-gray-700/50 text-gray-300" : "bg-gray-50 text-gray-600"}`}>
            <p className="font-medium mb-1">Password must contain:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li className={password.length >= 9 ? (isDark ? "text-green-400" : "text-green-600") : ""}>
                At least 8+ characters
              </li>
              <li className={/[A-Z]/.test(password) ? (isDark ? "text-green-400" : "text-green-600") : ""}>
                One uppercase letter (A-Z)
              </li>
              <li className={/[a-z]/.test(password) ? (isDark ? "text-green-400" : "text-green-600") : ""}>
                One lowercase letter (a-z)
              </li>
              <li className={/\d/.test(password) ? (isDark ? "text-green-400" : "text-green-600") : ""}>
                One number (0-9)
              </li>
              <li className={/[@$!%*#?&^_-]/.test(password) ? (isDark ? "text-green-400" : "text-green-600") : ""}>
                One special character (@$!%*#?&^_-)
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;