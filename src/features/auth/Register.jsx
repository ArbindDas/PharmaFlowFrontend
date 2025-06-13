
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

  const [focused, setFocused] = useState({
    fullname: false,
    email: false,
    password: false
  });

  const validateFullname = (value) => {
    const regex = /^[a-zA-Z\s]{4,30}$/;
    return regex.test(value) ? '' : 'Full name must be 4-30 characters and contain only letters and spaces.';
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(value) ? '' : 'Enter a valid email address.';
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;
    return regex.test(value)
      ? ''
      : 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character (@$!%*#?&^_-).';
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

  const handleSignInClick = () => {
    alert('Navigate to login page (Demo)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              sign in to your existing account
            </button>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
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
                className="mt-1 block w-full px-3 py-2 pt-6 border rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <label 
                htmlFor="fullname" 
                className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
                  focused.fullname || fullname ? 'top-1 text-xs text-indigo-600' : 'top-3 text-sm text-gray-500'
                }`}
              >
                Full Name
              </label>
              {validation.fullname && (
                <p className="mt-1 text-sm text-red-600">{validation.fullname}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
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
                className="mt-1 block w-full px-3 py-2 pt-6 border rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <label 
                htmlFor="email" 
                className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
                  focused.email || email ? 'top-1 text-xs text-indigo-600' : 'top-3 text-sm text-gray-500'
                }`}
              >
                Email address
              </label>
              {validation.email && (
                <p className="mt-1 text-sm text-red-600">{validation.email}</p>
              )}
            </div>

            {/* Password with Eye Toggle */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
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
                className="mt-1 block w-full px-3 py-2 pt-6 pr-10 border rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <label 
                htmlFor="password" 
                className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
                  focused.password || password ? 'top-1 text-xs text-indigo-600' : 'top-3 text-sm text-gray-500'
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {validation.password && (
                <p className="mt-1 text-sm text-red-600">{validation.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;