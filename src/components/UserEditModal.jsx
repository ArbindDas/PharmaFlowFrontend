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
} from "lucide-react";
import Select from "react-select";
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const UserEditModal = ({ user, onClose, onUpdate, isOpen, onSave }) => {

  const { updateUserProfile, adminUpdateUserProfile, user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    password: "",
    roles: user?.roles || [],
    authProvider: user?.authProvider || null,
  });

  // Add this useEffect to update formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        password: "", // Keep password empty for security
        roles: user.roles || ['USER'],
        authProvider: user.authProvider || 'LOCAL',
      });
    }
  }, [user]); // Runs whenever user prop changes

  // Debugging - log current values
  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  const [availableRoles, setAvailableRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (!isOpen) return; // Only fetch if modal is open

    fetch("http://localhost:8080/api/auth/roles", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("API request failed");
        return res.json();
      })
      .then((data) => setAvailableRoles(data))
      .catch((err) => {
        console.error("Failed to fetch roles:", err);
        setAvailableRoles(["ADMIN", "USER"]);
      });
  }, [isOpen]); // Add isOpen to dependencies

  // 2. Then handle the conditional return
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRoleChange = (selectedRoles) => {
    setFormData((prev) => ({
      ...prev,
      roles: selectedRoles,
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);
    setErrors({});



    try {
      const dataToSend = {
        ...formData,
        id: user?.id, // The user being edited (from props)
        ...(formData.password === "" && { password: undefined }),
      };

      // Check if current user is admin AND editing a different user
      const isAdminUpdatingOtherUser =   currentUser?.roles?.some(role => 
      role === 'ADMIN' || role === 'ROLE_ADMIN'
      )
      
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
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    {/* Backdrop with subtle blue tint */}
    <div
      className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px] transition-opacity duration-300"
      onClick={(e) => {
        if (!isSubmitting && e.target === e.currentTarget) {
          onClose && onClose();
        }
      }}
    />

    {/* Modern card-style modal with subtle shadow and border */}
    <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl shadow-blue-100/50 border border-gray-100 transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
      {/* Floating header with gradient accent */}
      <div className="relative px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-inner">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              {formData.fullName || "No name available"}
            </h2>
            <p className="text-sm text-gray-500 font-medium">Update user information</p>
          </div>
        </div>
        <button
          onClick={() => !isSubmitting && onClose && onClose()}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:rotate-90"
          disabled={isSubmitting}
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content with subtle padding adjustments */}
      <div className="px-6 py-5">
        {apiError && (
          <div className="mb-4 p-3 bg-red-50/80 border border-red-200 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 animate-pulse">
              <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
              <span className="text-red-700 text-sm font-medium">{apiError}</span>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name - Enhanced with floating label effect */}
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`peer w-full px-4 py-3 border rounded-lg transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent 
                hover:border-blue-300 text-gray-900 placeholder-transparent
                ${errors.fullName ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
              placeholder=" "
              autoComplete="current-fullName"
            />
            <label className="absolute left-4 -top-2.5 px-1 bg-white text-xs font-medium text-gray-500 transition-all duration-200 
              peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
              peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600">
              Full Name
            </label>
            <User className="absolute right-4 top-4 w-4 h-4 text-gray-400 peer-focus:text-blue-500" />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-fade-in">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email - Similar floating label */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`peer w-full px-4 py-3 border rounded-lg transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent 
                hover:border-blue-300 text-gray-900 placeholder-transparent
                ${errors.email ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
              placeholder=" "
              autoComplete="current-email"
            />
            <label className="absolute left-4 -top-2.5 px-1 bg-white text-xs font-medium text-gray-500 transition-all duration-200 
              peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
              peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600">
              Email Address
            </label>
            <Mail className="absolute right-4 top-4 w-4 h-4 text-gray-400 peer-focus:text-blue-500" />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-fade-in">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password - With strength meter */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`peer w-full px-4 py-3 border rounded-lg transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent 
                hover:border-blue-300 text-gray-900 placeholder-transparent
                ${errors.password ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
              placeholder=""
              autoComplete="current-password"
            />
            <label className="absolute left-4 -top-2.5 px-1 bg-white text-xs font-medium text-gray-500 transition-all duration-200 
              peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
              peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600">
              Password (leave blank to keep current)
            </label>
            <Lock className="absolute right-4 top-4 w-4 h-4 text-gray-400 peer-focus:text-blue-500" />
            {formData.password && (
              <div className="h-1 mt-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${formData.password.length > 10 ? 'bg-green-500 w-full' : formData.password.length > 5 ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}`}></div>
              </div>
            )}
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-fade-in">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Roles - Enhanced select */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              User Roles
            </label>
            <div className="relative">
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
                onChange={(selected) =>
                  handleRoleChange(selected.map((item) => item.value))
                }
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: errors.roles ? '#fca5a5' : '#e5e7eb',
                    backgroundColor: errors.roles ? '#fef2f2' : '#fff',
                    minHeight: '48px',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: errors.roles ? '#fca5a5' : '#93c5fd'
                    }
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#e0f2fe',
                    borderRadius: '6px'
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#0369a1',
                    fontWeight: '500'
                  })
                }}
              />
              <Shield className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            </div>
            {errors.roles && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-fade-in">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {errors.roles}
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
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-500 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
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
      <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      <div className="absolute -top-3 -right-3 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
    </div>
  </div>
);
};

export default UserEditModal;

