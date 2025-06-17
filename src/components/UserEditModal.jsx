
import React, { useState, useEffect } from 'react';
import { X, User, Mail, Save, Loader2, Heart } from 'lucide-react';

// Mock Modal component - replace with your actual Modal
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const UserEditModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(user || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [apiError, setApiError] = useState(null); // Add this state


  useEffect(() => {
    setFormData(user || {});
  }, [user]);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation for touched fields
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null); // Reset API error on new submission

    // Validate all fields
    const newErrors = {};
    ['fullName', 'email'].forEach(field => {
      const error = validateField(field, formData[field] || '');
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    setTouchedFields({ fullName: true, email: true });
    
    if (Object.keys(newErrors).some(key => newErrors[key])) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose(); // Only close on success
    } catch (error) {
      console.error("Save failed:", error);
      setApiError(error); // Display the error to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md transform transition-all duration-500 ease-out scale-100 opacity-100 shadow-2xl border border-slate-200/50 overflow-hidden">
        
        {/* Medical-themed header with subtle healthcare colors */}
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 px-6 py-8 border-b border-slate-100">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Edit Member</h2>
                <p className="text-slate-500 text-sm font-medium">Update patient information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:rotate-90 transition-all duration-200" />
            </button>
          </div>
        </div>

        {/* Form section */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
            
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <User className="w-4 h-4 mr-2 text-slate-400" />
                Full Name
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border-2 rounded-2xl py-4 px-4 text-slate-700 bg-slate-50/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:bg-white hover:border-slate-300 ${
                    errors.fullName && touchedFields.fullName
                      ? 'border-red-300 focus:border-red-400 bg-red-50/30'
                      : 'border-slate-200 focus:border-blue-400 focus:bg-white'
                  }`}
                  placeholder="Enter full name"
                  autoFocus
                />
                {errors.fullName && touchedFields.fullName && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              {errors.fullName && touchedFields.fullName && (
                <p className="text-red-500 text-xs mt-1 ml-1 animate-in slide-in-from-top-1 duration-200">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Mail className="w-4 h-4 mr-2 text-slate-400" />
                Email Address
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border-2 rounded-2xl py-4 px-4 text-slate-700 bg-slate-50/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:bg-white hover:border-slate-300 ${
                    errors.email && touchedFields.email
                      ? 'border-red-300 focus:border-red-400 bg-red-50/30'
                      : 'border-slate-200 focus:border-blue-400 focus:bg-white'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && touchedFields.email && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              {errors.email && touchedFields.email && (
                <p className="text-red-500 text-xs mt-1 ml-1 animate-in slide-in-from-top-1 duration-200">
                  {errors.email}
                </p>
              )}
            </div>
                      </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 border-2 border-slate-200 rounded-2xl text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-500/20 transition-all duration-200 hover:shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transform disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Loading progress bar */}
        {isSubmitting && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 animate-pulse"></div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserEditModal;