
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  CreditCard,
  Calendar,
  Shield,
  UserCircle,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const ProfileInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { fetchUserDetails } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserDetails();
        if (isMounted) {
          setUser(userData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load user profile");
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadUserData();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ProfileCard = ({ children, index, className = "" }) => (
    <div
      className={`rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className} ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"
      }`}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      {children}
    </div>
  );

  const InfoItem = ({
    icon: Icon,
    label,
    value,
    gradient = "from-blue-100 to-indigo-100",
  }) => (
    <div
      className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border backdrop-blur-sm ${
        isDarkMode
          ? "bg-gray-700 border-gray-600"
          : `bg-gradient-to-r ${gradient} border-white/50`
      }`}
    >
      <div className={`flex items-center gap-3 mb-2 ${
        isDarkMode ? "text-gray-300" : "text-gray-600"
      }`}>
        <div className={`p-2 rounded-full shadow-sm ${
          isDarkMode ? "bg-gray-600" : "bg-white/80"
        }`}>
          <Icon className={`w-4 h-4 ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`} />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <p className={`font-semibold ml-11 text-lg ${
        isDarkMode ? "text-white" : "text-gray-800"
      }`}>{value}</p>
    </div>
  );

  const SectionHeader = ({
    icon: Icon,
    title,
    subtitle,
    gradient = "from-blue-500 to-indigo-600",
  }) => (
    <div className="flex items-center gap-4 mb-6">
      <div
        className={`p-4 rounded-full shadow-lg ${
          isDarkMode
            ? "bg-gradient-to-r from-blue-600 to-indigo-700"
            : `bg-gradient-to-r ${gradient}`
        }`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className={`font-bold text-lg ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}>{title}</h3>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{subtitle}</p>
      </div>
    </div>
  );

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserDetails();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to refresh user profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            Loading profile information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}>
        <div className={`rounded-lg p-6 max-w-md mx-4 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-red-50 border border-red-200"
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-full ${
              isDarkMode ? "bg-gray-700" : "bg-red-100"
            }`}>
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>Profile Error</h2>
          </div>
          <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}>
        <div className="text-center">
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            No user data available
          </p>
          <button
            onClick={handleRefresh}
            className={`mt-4 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Refresh Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Hero Section */}
      <div className={`py-12 ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800"
          : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
      } text-white`}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-6">
            <div className={`p-6 rounded-full animate-pulse-gentle ${
              isDarkMode ? "bg-gray-700/50" : "bg-white/20"
            }`}>
              <UserCircle className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.full_name || "User"}!
              </h1>
              <p className={isDarkMode ? "text-gray-300" : "text-blue-100"}>
                Manage your personal details and account information
              </p>
              <div className="flex items-center gap-2 mt-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">Account verified and active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${
              isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleRefresh}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border shadow-sm ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700 text-blue-400 border-gray-700"
                : "bg-white hover:bg-gray-50 text-blue-600 border-blue-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Profile
          </button>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* User Identification Section */}
          <ProfileCard index={0} className={isDarkMode ? "bg-gray-800" : ""}>
            <SectionHeader
              icon={CreditCard}
              title="User Identification"
              subtitle="Your unique account details"
              gradient={isDarkMode ? "from-emerald-600 to-teal-700" : "from-emerald-500 to-teal-600"}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InfoItem
                icon={CreditCard}
                label="User ID"
                value={user?.id || "Not available"}
                gradient={isDarkMode ? "from-gray-700 to-gray-800" : "from-emerald-100 to-teal-100"}
              />
              <InfoItem
                icon={Shield}
                label="Auth Provider"
                value={user?.auth_provider || "Not specified"}
                gradient={isDarkMode ? "from-gray-700 to-gray-800" : "from-emerald-100 to-teal-100"}
              />
            </div>
          </ProfileCard>

          {/* Account Information Section */}
          <ProfileCard index={1} className={isDarkMode ? "bg-gray-800" : ""}>
            <SectionHeader
              icon={Calendar}
              title="Account Information"
              subtitle="When your account was created"
              gradient={isDarkMode ? "from-purple-600 to-pink-700" : "from-purple-500 to-pink-600"}
            />
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <InfoItem
                icon={Clock}
                label="Account Created"
                value={formatDate(user?.created_at)}
                gradient={isDarkMode ? "from-gray-700 to-gray-800" : "from-purple-100 to-pink-100"}
              />
            </div>
          </ProfileCard>

          {/* Personal Details Section */}
          <ProfileCard index={2} className={isDarkMode ? "bg-gray-800" : ""}>
            <SectionHeader
              icon={User}
              title="Personal Details"
              subtitle="Your name and contact information"
              gradient={isDarkMode ? "from-orange-600 to-red-700" : "from-orange-500 to-red-600"}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InfoItem
                icon={User}
                label="Full Name"
                value={user?.full_name || "Not provided"}
                gradient={isDarkMode ? "from-gray-700 to-gray-800" : "from-orange-100 to-red-100"}
              />
              <InfoItem
                icon={Mail}
                label="Email Address"
                value={user?.email || "Not provided"}
                gradient={isDarkMode ? "from-gray-700 to-gray-800" : "from-orange-100 to-red-100"}
              />
            </div>
          </ProfileCard>

          {/* Account Status Footer */}
          <div className={`rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md sm:shadow-lg ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "border border-white/50"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 sm:p-3 rounded-full ${
                  isDarkMode ? "bg-gray-700" : "bg-green-100"
                }`}>
                  <CheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`} />
                </div>
                <div>
                  <p className={`font-semibold text-sm sm:text-base ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}>
                    Account Status
                  </p>
                  <p className={`text-xs sm:text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Your account is active and verified
                  </p>
                </div>
              </div>
              <div className="sm:text-right">
                <div className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                  isDarkMode
                    ? "bg-green-800/50 text-green-400"
                    : "bg-green-500 text-white"
                }`}>
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;