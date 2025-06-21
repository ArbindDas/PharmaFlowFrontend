

import { useState } from 'react';

const AddMemberModal = ({ isOpen, onClose, onAddMember }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [touchedFields, setTouchedFields] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'fullname':
        return value.trim() === '' ? 'Full name is required' : '';
      case 'email':
        if (value.trim() === '') return 'Email is required';
        return !validateEmail(value) ? 'Invalid email address' : '';
      case 'password':
        if (value === '') return '';
        return !validatePassword(value) ? 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    setFocusedField('');
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setFocusedField(name);
  };

  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouchedFields({ fullName: true, email: true, password: true });
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type = 'success') => {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };



const handleSubmit = async () => {
  if (!validateAllFields()) return;
  
  setIsSubmitting(true);
  try {
    // Pass the form data as individual parameters
    await onAddMember({
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password
    });
    showToast('Member added successfully!');
    setFormData({ fullname: '', email: '', password: '' });
    setErrors({});
    setTouchedFields({});
    onClose();
  } catch (error) {
    showToast(error.message || 'Failed to add member', 'error');
  } finally {
    setIsSubmitting(false);
  }
};

  const getFieldStatus = (fieldName) => {
    if (errors[fieldName] && touchedFields[fieldName]) return 'error';
    if (formData[fieldName] && !errors[fieldName] && touchedFields[fieldName]) return 'success';
    return 'default';
  };

  const getInputClasses = (fieldName) => {
    const status = getFieldStatus(fieldName);
    const isFocused = focusedField === fieldName;
    
    let classes = 'w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none placeholder-gray-400 ';
    
    if (status === 'error') {
      classes += 'border-red-300 bg-red-50 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100';
    } else if (status === 'success') {
      classes += 'border-green-300 bg-green-50 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100';
    } else {
      classes += 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100';
    }
    
    if (isFocused) {
      classes += ' transform scale-[1.02]';
    }
    
    return classes;
  };

  const getLabelClasses = (fieldName) => {
    const status = getFieldStatus(fieldName);
    const isFocused = focusedField === fieldName;
    
    let classes = 'block text-sm font-semibold mb-2 transition-colors duration-200 ';
    
    if (status === 'error') {
      classes += 'text-red-600';
    } else if (status === 'success') {
      classes += 'text-green-600';
    } else if (isFocused) {
      classes += 'text-blue-600';
    } else {
      classes += 'text-gray-700';
    }
    
    return classes;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Add New Member</h2>
              <p className="text-blue-100 text-sm mt-1">Medicare System Registration</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-blue-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="p-6">
          <div className="space-y-6">
            {/* Full Name Field */}
            <div className="relative">
              <label className={getLabelClasses('fullname')}>
                Full Name *
              </label>
              <div className="relative">
                <input
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Enter full name"
                  className={getInputClasses('fullname')}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldStatus('fullname') === 'success' && (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {getFieldStatus('fullname') === 'error' && (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
              {errors.fullname && touchedFields.fullname && (
                <div className="flex items-center mt-2 text-red-600 text-sm animate-pulse">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.fullname}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className={getLabelClasses('email')}>
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Enter email address"
                  className={getInputClasses('email')}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldStatus('email') === 'success' && (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {getFieldStatus('email') === 'error' && (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
              {errors.email && touchedFields.email && (
                <div className="flex items-center mt-2 text-red-600 text-sm animate-pulse">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className={getLabelClasses('password')}>
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Enter secure password"
                  className={getInputClasses('password')}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldStatus('password') === 'success' && (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {getFieldStatus('password') === 'error' && (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
              {errors.password && touchedFields.password && (
                <div className="flex items-start mt-2 text-red-600 text-sm animate-pulse">
                  <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="leading-tight">{errors.password}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : (
                  'Add Member'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;