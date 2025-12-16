

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Save,
  Loader2,
  Heart,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Select from "react-select";
import { useAuth } from '../context/AuthContext';

const UserEditModal = ({ user, onClose, onUpdate, isOpen, onSave }) => {
  const { updateUserProfile, adminUpdateUserProfile, user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    roles: [],
    authProvider: null,
  });

  // Dark mode variables
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    roles: ""
  });
  
  const [touchedFields, setTouchedFields] = useState({
    fullName: false,
    email: false,
    password: false,
    roles: false
  });

  const [availableRoles, setAvailableRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Check dark mode on mount and when theme changes
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Update formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        password: "", // Keep password empty for security
        roles: user.roles || ['USER'],
        authProvider: user.authProvider || 'LOCAL',
      });
      
      // Reset validation states
      setValidationErrors({
        fullName: "",
        email: "",
        password: "",
        roles: ""
      });
      setTouchedFields({
        fullName: false,
        email: false,
        password: false,
        roles: false
      });
    }
  }, [user]);

  // Enhanced real-time validation functions
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Full name must be at least 2 characters';
        } else if (value.trim().length > 100) {
          error = 'Full name must be less than 100 characters';
        } else if (/^\d+$/.test(value.trim())) {
          error = 'Full name cannot be only numbers';
        } else if (!/^[a-zA-Z\s\-']+$/.test(value.trim())) {
          error = 'Full name can only contain letters, spaces, hyphens and apostrophes';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = 'Invalid email format (example: user@domain.com)';
        } else if (value.length > 254) {
          error = 'Email is too long (max 254 characters)';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email cannot contain spaces';
        } else if (/\.co$/.test(value.toLowerCase())) {
          error = 'Email domain appears incomplete (missing top-level domain)';
        } else if (/\.@|@\.|\.{2,}/.test(value)) {
          error = 'Email contains invalid characters';
        }
        break;
        
      case 'password':
        // Only validate password if it's provided (can be empty)
        if (value && value.length > 0) {
          if (value.length < 9) { // Changed from 6 to 8
            error = 'Password must be at least 8+ characters';
          } else if (!/(?=.*[A-Z])/.test(value)) {
            error = 'Password must contain at least one uppercase letter';
          } else if (!/(?=.*[a-z])/.test(value)) {
            error = 'Password must contain at least one lowercase letter';
          } else if (!/(?=.*\d)/.test(value)) {
            error = 'Password must contain at least one number';
          } else if (!/(?=.*[@$!%*?&])/.test(value)) {
            error = 'Password must contain at least one special character (@$!%*?&)';
          } else if (value.length > 128) {
            error = 'Password is too long (max 128 characters)';
          } else if (/\s/.test(value)) {
            error = 'Password cannot contain spaces';
          }
        }
        break;
        
      case 'roles':
        if (!value || value.length === 0) {
          error = 'At least one role is required';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  // Enhanced validation that triggers on every change for immediate feedback
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear API errors for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    
    // Validate IMMEDIATELY on every change (real-time feedback)
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Mark field as touched when user starts typing
    if (!touchedFields[name] && value.trim().length > 0) {
      setTouchedFields(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    // Mark field as touched on blur
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Re-validate on blur to catch edge cases
    const error = validateField(name, formData[name]);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleRoleChange = (selectedRoles) => {
    const roles = selectedRoles.map(item => item.value);
    setFormData((prev) => ({
      ...prev,
      roles: roles,
    }));
    
    // Validate roles immediately
    const error = validateField('roles', roles);
    setValidationErrors(prev => ({
      ...prev,
      roles: error
    }));
    
    // Mark as touched
    setTouchedFields(prev => ({
      ...prev,
      roles: true
    }));
  };

  const handleRoleBlur = () => {
    setTouchedFields(prev => ({
      ...prev,
      roles: true
    }));
    
    const error = validateField('roles', formData.roles);
    setValidationErrors(prev => ({
      ...prev,
      roles: error
    }));
  };

  // Password strength calculator - UPDATED for 8 characters
  const calculatePasswordStrength = (password) => {
    if (!password || password.length === 0) return { strength: 0, color: 'bg-gray-200 dark:bg-gray-600', label: '' };
    
    let strength = 0;
    // Give 20% for length requirement (8+ chars)
    if (password.length >= 8) strength += 20;
    // Give 20% each for: uppercase, lowercase, number, special char
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[@$!%*?&]/.test(password)) strength += 20;
    
    let color = 'bg-red-500';
    let label = 'Weak';
    
    if (strength >= 80) {
      color = 'bg-green-500';
      label = 'Strong';
    } else if (strength >= 60) {
      color = 'bg-yellow-500';
      label = 'Medium';
    } else if (strength >= 40) {
      color = 'bg-orange-500';
      label = 'Fair';
    }
    
    return { strength, color, label };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);
    setErrors({});
    
    // Mark all fields as touched
    setTouchedFields({
      fullName: true,
      email: true,
      password: true,
      roles: true
    });
    
    // Validate all fields
    const newValidationErrors = {
      fullName: validateField('fullName', formData.fullName),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      roles: validateField('roles', formData.roles)
    };
    
    setValidationErrors(newValidationErrors);
    
    // Check if any validation errors exist
    const hasValidationErrors = Object.values(newValidationErrors).some(error => error);
    
    if (hasValidationErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        id: user?.id,
        ...(formData.password === "" && { password: undefined }),
      };

      const isAdminUpdatingOtherUser = currentUser?.roles?.some(role => 
        role === 'ADMIN' || role === 'ROLE_ADMIN'
      );
      
      if (isAdminUpdatingOtherUser) {
        await adminUpdateUserProfile(dataToSend);
      } else {
        await updateUserProfile(dataToSend);
      }

      onUpdate?.(dataToSend);
      onClose();
    } catch (error) {
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        Object.entries(error.response.data.errors).forEach(([field, message]) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        setApiError(error.message || "Update failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid for submit button
  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.roles.length > 0 &&
      !validationErrors.fullName &&
      !validationErrors.email &&
      !validationErrors.roles &&
      // Password can be empty, but if provided must be valid
      (!formData.password || !validationErrors.password)
    );
  };

  if (!isOpen) return null;

  // Calculate password strength
  const passwordStrength = calculatePasswordStrength(formData.password);

  // Dark mode styles
  const backdropClass = isDarkMode 
    ? "bg-black/60 backdrop-blur-[2px]" 
    : "bg-blue-500/10 backdrop-blur-[2px]";
    
  const modalClass = isDarkMode
    ? "bg-gray-800 border-gray-700 shadow-gray-900/50"
    : "bg-white border-gray-100 shadow-blue-100/50";
    
  const headerClass = isDarkMode
    ? "border-gray-700"
    : "border-gray-100";
    
  const titleClass = isDarkMode
    ? "text-white"
    : "text-gray-900";
    
  const subtitleClass = isDarkMode
    ? "text-gray-400"
    : "text-gray-500";
    
  const iconBgClass = isDarkMode
    ? "bg-blue-900/30"
    : "bg-gradient-to-br from-blue-50 to-blue-100";
    
  const closeButtonClass = isDarkMode
    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50";
    
  // FIXED: Simplified input classes to prevent conflicts
  const getInputClasses = (fieldName) => {
    const hasError = validationErrors[fieldName] && (touchedFields[fieldName] || formData[fieldName]?.length > 0);
    const isValid = !validationErrors[fieldName] && formData[fieldName]?.length > 0;
    
    let baseClasses = "peer w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ";
    
    if (hasError) {
      baseClasses += isDarkMode 
        ? "border-red-500 focus:ring-red-500/50 " 
        : "border-red-500 focus:ring-red-500/50 ";
    } else if (isValid) {
      baseClasses += isDarkMode 
        ? "border-green-500 focus:ring-green-500/20 " 
        : "border-green-500 focus:ring-green-500/20 ";
    } else {
      baseClasses += isDarkMode 
        ? "border-gray-600 focus:ring-blue-400/50 " 
        : "border-gray-200 focus:ring-blue-500/50 ";
    }
    
    baseClasses += isDarkMode 
      ? "bg-gray-700 text-white placeholder-gray-400 hover:border-blue-400" 
      : "bg-white text-gray-900 placeholder-transparent hover:border-blue-300";
    
    return baseClasses;
  };
    
  const labelClass = isDarkMode
    ? "bg-gray-800 text-gray-300"
    : "bg-white text-gray-500";
    
  const errorBgClass = isDarkMode
    ? "bg-red-900/20 border-red-800"
    : "bg-red-50/80 border-red-200";
    
  const cancelButtonClass = isDarkMode
    ? "text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500"
    : "text-gray-700 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Backdrop with theme-aware tint */}
      <div
        className={`absolute inset-0 ${backdropClass} transition-opacity duration-300`}
        onClick={(e) => {
          if (!isSubmitting && e.target === e.currentTarget) {
            onClose && onClose();
          }
        }}
      />

      {/* Modern card-style modal with theme support */}
      <div className={`relative w-full max-w-md rounded-xl shadow-xl border transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95 ${modalClass}`}>
        {/* Floating header with gradient accent */}
        <div className={`relative px-6 py-5 border-b ${headerClass}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 ${iconBgClass} rounded-lg shadow-inner`}>
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className={`text-xl font-semibold tracking-tight ${titleClass}`}>
                {formData.fullName || "No name available"}
              </h2>
              <p className={`text-sm font-medium ${subtitleClass}`}>Update user information</p>
            </div>
          </div>
          <button
            onClick={() => !isSubmitting && onClose && onClose()}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 hover:rotate-90 ${closeButtonClass}`}
            disabled={isSubmitting}
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with subtle padding adjustments */}
        <div className="px-6 py-5">
          {apiError && (
            <div className={`mb-4 p-3 rounded-lg backdrop-blur-sm ${errorBgClass}`}>
              <div className="flex items-center gap-2 animate-pulse">
                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                <span className="text-red-700 dark:text-red-300 text-sm font-medium">{apiError}</span>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name - Enhanced with immediate validation */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('fullName')}
                  placeholder=" "
                  autoComplete="current-fullName"
                />
                <label className={`absolute left-4 -top-2.5 px-1 text-xs font-medium transition-all duration-200 
                  peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                  peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 ${labelClass}`}>
                  Full Name *
                </label>
                <div className="absolute right-4 top-4">
                  {formData.fullName && (touchedFields.fullName || formData.fullName.length > 0) && (
                    validationErrors.fullName ? (
                      <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 animate-pulse" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                    )
                  )}
                </div>
              </div>
              {validationErrors.fullName && (touchedFields.fullName || formData.fullName.length > 0) && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            {/* Email - Enhanced validation */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('email')}
                  placeholder=" "
                  autoComplete="current-email"
                />
                <label className={`absolute left-4 -top-2.5 px-1 text-xs font-medium transition-all duration-200 
                  peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                  peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 ${labelClass}`}>
                  Email Address *
                </label>
                <div className="absolute right-4 top-4">
                  {formData.email && (touchedFields.email || formData.email.length > 0) && (
                    validationErrors.email ? (
                      <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 animate-pulse" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                    )
                  )}
                </div>
              </div>
              {validationErrors.email && (touchedFields.email || formData.email.length > 0) && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.email}
                </p>
              )}
              {!validationErrors.email && formData.email && formData.email.includes('@') && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Valid email format
                </p>
              )}
            </div>

            {/* Password - Enhanced with strength meter */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('password')}
                  placeholder=" "
                  autoComplete="current-password"
                />
                <label className={`absolute left-4 -top-2.5 px-1 text-xs font-medium transition-all duration-200 
                  peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                  peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 ${labelClass}`}>
                  Password (leave blank to keep current)
                </label>
                <div className="absolute right-4 top-4">
                  {formData.password && (touchedFields.password || formData.password.length > 0) && (
                    validationErrors.password ? (
                      <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 animate-pulse" />
                    ) : formData.password.length >= 8 ? (
                      <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                    ) : null
                  )}
                </div>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Password strength: <span className={`font-medium ${
                        passwordStrength.label === 'Strong' ? 'text-green-600 dark:text-green-400' :
                        passwordStrength.label === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        passwordStrength.label === 'Fair' ? 'text-orange-600 dark:text-orange-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </span>
                    {formData.password && !validationErrors.password && formData.password.length >= 8 && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        ✓ Secure
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Password requirements - UPDATED for 8 characters */}
              {formData.password && (
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formData.password.length >= 9 ? '✓' : '○'} At least 8+ characters
                  </div>
                  <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {/[A-Z]/.test(formData.password) ? '✓' : '○'} Uppercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${/[a-z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {/[a-z]/.test(formData.password) ? '✓' : '○'} Lowercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {/[0-9]/.test(formData.password) ? '✓' : '○'} Number
                  </div>
                  <div className={`flex items-center gap-1 ${/[@$!%*?&]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {/[@$!%*?&]/.test(formData.password) ? '✓' : '○'} Special character
                  </div>
                  <div className={`flex items-center gap-1 ${!/\s/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {!/\s/.test(formData.password) ? '✓' : '○'} No spaces
                  </div>
                </div>
              )}
              
              {validationErrors.password && formData.password && (touchedFields.password || formData.password.length > 0) && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Roles - Enhanced select with validation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                  User Roles *
                </label>
                {formData.roles.length > 0 && (touchedFields.roles || formData.roles.length > 0) && (
                  validationErrors.roles ? (
                    <AlertCircle className="w-3 h-3 text-red-500 dark:text-red-400 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-3 h-3 text-green-500 dark:text-green-400" />
                  )
                )}
              </div>
              <div className="relative" onBlur={handleRoleBlur}>
                <Select
                  isMulti
                  options={availableRoles.map((role) => ({
                    value: role,
                    label: role,
                  }))}
                  value={formData.roles.map((role) => ({
                    value: role,
                    label: role,
                  }))}
                  onChange={handleRoleChange}
                  onBlur={handleRoleBlur}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: validationErrors.roles && (touchedFields.roles || formData.roles.length > 0)
                        ? '#ef4444' 
                        : !validationErrors.roles && formData.roles.length > 0
                        ? '#10b981'
                        : isDarkMode 
                          ? '#4b5563' 
                          : '#e5e7eb',
                      backgroundColor: isDarkMode ? '#374151' : '#fff',
                      minHeight: '48px',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: validationErrors.roles && (touchedFields.roles || formData.roles.length > 0)
                          ? '#ef4444' 
                          : '#93c5fd'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? '#374151' : '#fff',
                      borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused 
                        ? (isDarkMode ? '#4b5563' : '#f3f4f6') 
                        : (isDarkMode ? '#374151' : '#fff'),
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#4b5563' : '#f3f4f6',
                      }
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? '#1e40af' : '#e0f2fe',
                      borderRadius: '6px'
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: isDarkMode ? '#fff' : '#0369a1',
                      fontWeight: '500'
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: isDarkMode ? '#fff' : '#0369a1',
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#1e3a8a' : '#bae6fd',
                      }
                    }),
                    input: (base) => ({
                      ...base,
                      color: isDarkMode ? '#fff' : '#000',
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: isDarkMode ? '#fff' : '#000',
                    }),
                  }}
                />
              </div>
              {validationErrors.roles && (touchedFields.roles || formData.roles.length > 0) && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.roles}
                </p>
              )}
            </div>

            {/* Footer buttons with glass effect */}
            <div className="pt-6 pb-2">
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => !isSubmitting && onClose && onClose()}
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow ${cancelButtonClass}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-500 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 ${
                    !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update User
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -top-3 -right-3 w-20 h-20 bg-blue-200 dark:bg-blue-800/20 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>
    </div>
  );
};

export default UserEditModal;