// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [token, setToken] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');
//   const [isTokenValid, setIsTokenValid] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);

//   useEffect(() => {
//     const tokenFromUrl = searchParams.get('token');
//     if (tokenFromUrl) {
//       setToken(tokenFromUrl);
//       validateToken(tokenFromUrl);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     checkPasswordStrength(newPassword);
//   }, [newPassword]);

//   const checkPasswordStrength = (password) => {
//     let strength = 0;
//     if (password.length >= 8) strength += 1;
//     if (/[A-Z]/.test(password)) strength += 1;
//     if (/[0-9]/.test(password)) strength += 1;
//     if (/[^A-Za-z0-9]/.test(password)) strength += 1;
//     setPasswordStrength(strength);
//   };


//   const validateToken = async (token) => {
//   try {
//     console.log('Validating token:', token);
//     const response = await axios.get(`http://localhost:8080/api/reset/reset-password?token=${token}`, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       withCredentials: true
//     });
//     console.log('Token validation response:', response.data);
    
//     if (response.data.type === 'success') {
//       setIsTokenValid(true);
//       setMessage('Token verified successfully. You can now create a new password.');
//       setMessageType('success');
//     }
//   } catch (error) {
//     console.error('Token validation error:', error);
//     console.error('Error response:', error.response?.data);
//     console.error('Error status:', error.response?.status);
    
//     setIsTokenValid(false);
//     setMessage('This reset link is invalid or has expired. Please request a new one.');
//     setMessageType('error');
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (newPassword !== confirmPassword) {
//       setMessage('Passwords do not match');
//       setMessageType('error');
//       return;
//     }

//     if (passwordStrength < 2) {
//       setMessage('Please choose a stronger password');
//       setMessageType('error');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post('http://localhost:8080/api/reset/reset-password', {
//         token: token,
//         newPassword: newPassword
//       });

//       if (response.data.type === 'success') {
//         setMessage('Password reset successfully! Redirecting to login...');
//         setMessageType('success');
        
//         setTimeout(() => {
//           navigate('/login');
//         }, 2000);
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Error resetting password. Please try again.');
//       setMessageType('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getPasswordStrengthColor = () => {
//     switch (passwordStrength) {
//       case 0: return 'bg-gray-200';
//       case 1: return 'bg-red-500';
//       case 2: return 'bg-yellow-500';
//       case 3: return 'bg-blue-500';
//       case 4: return 'bg-green-500';
//       default: return 'bg-gray-200';
//     }
//   };

//   const getPasswordStrengthText = () => {
//     switch (passwordStrength) {
//       case 0: return 'Very Weak';
//       case 1: return 'Weak';
//       case 2: return 'Fair';
//       case 3: return 'Good';
//       case 4: return 'Strong';
//       default: return '';
//     }
//   };

//   if (!token) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center">
//             <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
//             <p className="text-gray-600 mb-6">No reset token found. Please check your email for the correct link.</p>
//             <button
//               onClick={() => navigate('/forgot-password')}
//               className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
//             >
//               Request New Reset Link
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//           <button
//             onClick={() => navigate('/login')}
//             className="flex items-center text-white hover:text-indigo-200 transition duration-200 mb-4"
//           >
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             Back to Login
//           </button>
//           <h1 className="text-2xl font-bold text-white">Reset Password</h1>
//           <p className="text-indigo-200 mt-1">Create a new password for your account</p>
//         </div>

//         <div className="p-6">
//           {/* Message Alert */}
//           {message && (
//             <div className={`flex items-center p-4 rounded-lg mb-6 ${
//               messageType === 'success' 
//                 ? 'bg-green-50 border border-green-200 text-green-800' 
//                 : 'bg-red-50 border border-red-200 text-red-800'
//             }`}>
//               {messageType === 'success' ? (
//                 <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
//               ) : (
//                 <XCircle className="h-5 w-5 mr-3 flex-shrink-0" />
//               )}
//               <span className="text-sm">{message}</span>
//             </div>
//           )}

//           {isTokenValid ? (
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* New Password */}
//               <div>
//                 <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showNewPassword ? "text" : "password"}
//                     id="newPassword"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     required
//                     minLength="6"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
//                     placeholder="Enter your new password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowNewPassword(!showNewPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-200"
//                   >
//                     {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                   </button>
//                 </div>
                
//                 {/* Password Strength Meter */}
//                 {newPassword && (
//                   <div className="mt-3">
//                     <div className="flex justify-between text-xs text-gray-600 mb-1">
//                       <span>Password strength</span>
//                       <span className={`font-medium ${
//                         passwordStrength === 4 ? 'text-green-600' :
//                         passwordStrength === 3 ? 'text-blue-600' :
//                         passwordStrength === 2 ? 'text-yellow-600' :
//                         passwordStrength === 1 ? 'text-red-600' : 'text-gray-600'
//                       }`}>
//                         {getPasswordStrengthText()}
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
//                         style={{ width: `${(passwordStrength / 4) * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     id="confirmPassword"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                     minLength="6"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
//                     placeholder="Confirm your new password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-200"
//                   >
//                     {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                   </button>
//                 </div>
                
//                 {/* Password Match Indicator */}
//                 {confirmPassword && (
//                   <div className="mt-2 flex items-center">
//                     {newPassword === confirmPassword ? (
//                       <>
//                         <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                         <span className="text-xs text-green-600">Passwords match</span>
//                       </>
//                     ) : (
//                       <>
//                         <XCircle className="h-4 w-4 text-red-500 mr-2" />
//                         <span className="text-xs text-red-600">Passwords don't match</span>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading || passwordStrength < 2 || newPassword !== confirmPassword}
//                 className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-medium flex items-center justify-center"
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Resetting Password...
//                   </>
//                 ) : (
//                   'Reset Password'
//                 )}
//               </button>
//             </form>
//           ) : (
//             /* Invalid Token State */
//             <div className="text-center py-6">
//               <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Invalid Reset Link</h3>
//               <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
//               <button
//                 onClick={() => navigate('/forgot-password')}
//                 className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
//               >
//                 Request New Reset Link
//               </button>
//             </div>
//           )}

//           {/* Password Requirements */}
//           {isTokenValid && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//               <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h4>
//               <ul className="text-xs text-gray-600 space-y-1">
//                 <li className="flex items-center">
//                   <CheckCircle className={`h-3 w-3 mr-2 ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
//                   At least 8 characters
//                 </li>
//                 <li className="flex items-center">
//                   <CheckCircle className={`h-3 w-3 mr-2 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
//                   One uppercase letter
//                 </li>
//                 <li className="flex items-center">
//                   <CheckCircle className={`h-3 w-3 mr-2 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
//                   One number
//                 </li>
//                 <li className="flex items-center">
//                   <CheckCircle className={`h-3 w-3 mr-2 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
//                   One special character
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Adjust path as needed

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      validateToken(tokenFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    checkPasswordStrength(newPassword);
  }, [newPassword]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const validateToken = async (token) => {
    try {
      console.log('Validating token:', token);
      const response = await axios.get(`http://localhost:8080/api/reset/reset-password?token=${token}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      console.log('Token validation response:', response.data);
      
      if (response.data.type === 'success') {
        setIsTokenValid(true);
        setMessage('Token verified successfully. You can now create a new password.');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      setIsTokenValid(false);
      setMessage('This reset link is invalid or has expired. Please request a new one.');
      setMessageType('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    if (passwordStrength < 2) {
      setMessage('Please choose a stronger password');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/reset/reset-password', {
        token: token,
        newPassword: newPassword
      });

      if (response.data.type === 'success') {
        setMessage('Password reset successfully! Redirecting to login...');
        setMessageType('success');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resetting password. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  if (!token) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full rounded-2xl shadow-xl p-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div className="text-center">
            <XCircle className={`mx-auto h-16 w-16 mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Invalid Reset Link</h2>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No reset token found. Please check your email for the correct link.</p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center p-4`}>
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 p-3 rounded-full transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
            : 'bg-white hover:bg-gray-100 text-gray-700 shadow-lg'
        }`}
      >
        {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>

      <div className={`max-w-md w-full rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center text-white hover:text-indigo-200 transition duration-200 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </button>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-indigo-200 mt-1">Create a new password for your account</p>
        </div>

        <div className="p-6">
          {/* Message Alert */}
          {message && (
            <div className={`flex items-center p-4 rounded-lg mb-6 ${
              messageType === 'success' 
                ? isDarkMode 
                  ? 'bg-green-900 border border-green-700 text-green-200' 
                  : 'bg-green-50 border border-green-200 text-green-800'
                : isDarkMode 
                  ? 'bg-red-900 border border-red-700 text-red-200' 
                  : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {isTokenValid ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="6"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition duration-200 ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {newPassword && (
                  <div className="mt-3">
                    <div className={`flex justify-between text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span>Password strength</span>
                      <span className={`font-medium ${
                        passwordStrength === 4 ? 'text-green-500' :
                        passwordStrength === 3 ? 'text-blue-500' :
                        passwordStrength === 2 ? 'text-yellow-500' :
                        passwordStrength === 1 ? 'text-red-500' : 
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition duration-200 ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="mt-2 flex items-center">
                    {newPassword === confirmPassword ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        <span className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || passwordStrength < 2 || newPassword !== confirmPassword}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-200 font-medium flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          ) : (
            /* Invalid Token State */
            <div className="text-center py-6">
              <XCircle className={`mx-auto h-16 w-16 mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Invalid Reset Link</h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>This password reset link is invalid or has expired.</p>
              <button
                onClick={() => navigate('/forgot-password')}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
              >
                Request New Reset Link
              </button>
            </div>
          )}

          {/* Password Requirements */}
          {isTokenValid && (
            <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Password Requirements:</h4>
              <ul className={`text-xs space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className="flex items-center">
                  <CheckCircle className={`h-3 w-3 mr-2 ${
                    newPassword.length >= 8 
                      ? 'text-green-500' 
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-3 w-3 mr-2 ${
                    /[A-Z]/.test(newPassword)
                      ? 'text-green-500' 
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-3 w-3 mr-2 ${
                    /[0-9]/.test(newPassword)
                      ? 'text-green-500' 
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  One number
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-3 w-3 mr-2 ${
                    /[^A-Za-z0-9]/.test(newPassword)
                      ? 'text-green-500' 
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  One special character
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;