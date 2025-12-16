

import React, { useEffect } from "react";
import {
  X,
  Mail,
  Calendar,
  User,
  Hash,
  Shield,
  Phone,
  Edit3,
  FileText,
  Menu,
  Search,
  Heart,
  Activity,
} from "lucide-react";

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Check for dark mode
  const isDarkMode = document.documentElement.classList.contains('dark');

  if (!isOpen || !user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div
        className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-8 border ${isDarkMode ? 'border-gray-700 hover:shadow-blue-900/20' : 'border-gray-200/50 hover:shadow-blue-500/20'} hover:shadow-3xl transition-all duration-500`}
        style={{
          background: isDarkMode 
            ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        {/* Enhanced Header with Mobile Optimization - Dark mode support */}
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700'} px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-white relative overflow-hidden`}>
          {/* Animated background elements */}
          <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-blue-700/30 via-transparent to-indigo-700/30' : 'from-blue-400/30 via-transparent to-indigo-400/30'} animate-pulse`} />
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 ${isDarkMode ? 'bg-white/10 backdrop-blur-lg' : 'bg-white/20 backdrop-blur-lg'} rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl shadow-2xl ${isDarkMode ? 'border border-white/20' : 'border border-white/30'} hover:${isDarkMode ? 'bg-white/20' : 'bg-white/30'} hover:scale-110 transition-all duration-300 hover:shadow-white/20 hover:shadow-lg`}>
                {getInitials(user.fullName)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-1 text-shadow-lg truncate">
                  {user.fullName}
                </h2>
                <p className={`${isDarkMode ? 'text-blue-200 opacity-90' : 'text-blue-100 opacity-90'} text-sm sm:text-base lg:text-lg hidden sm:block`}>
                  Medicare Member Profile
                </p>
                <div className="flex items-center space-x-2 mt-1 sm:mt-2">
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-green-300" />
                  <span className="text-green-200 text-xs sm:text-sm font-medium">
                    Active Coverage
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 sm:p-3 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/20'} rounded-xl sm:rounded-2xl transition-all duration-300 group hover:rotate-90 hover:scale-110 hover:shadow-lg hover:shadow-white/20`}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:drop-shadow-lg transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Enhanced Content with Mobile Optimization - Dark mode support */}
        <div className={`p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)] ${isDarkMode ? 'bg-gradient-to-b from-gray-900/50 to-gray-800' : 'bg-gradient-to-b from-gray-50/50 to-white'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

            {/* Enhanced Basic Information Card - Dark mode support */}
            <div className="space-y-4 sm:space-y-6 group">
              <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center space-x-2 sm:space-x-3 border-b-2 ${isDarkMode ? 'border-blue-700' : 'border-gradient-to-r from-blue-500 to-indigo-500'} pb-2 sm:pb-3 ${isDarkMode ? 'hover:text-blue-300' : 'hover:text-blue-700'} transition-colors duration-300`}>
                <User className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} drop-shadow-sm`} />
                <span>Personal Information</span>
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-blue-900/30' : 'bg-gradient-to-r from-gray-50 to-blue-50/30'} rounded-xl sm:rounded-2xl border ${isDarkMode ? 'border-gray-700 hover:border-blue-600/50' : 'border-gray-200/50 hover:border-blue-300/50'} hover:shadow-lg ${isDarkMode ? 'hover:shadow-blue-900/20' : 'hover:shadow-blue-500/10'} transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}>
                  <Hash className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mt-0.5 sm:mt-1 group-hover:${isDarkMode ? 'text-blue-300' : 'text-blue-600'} group-hover:scale-110 transition-all duration-300 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wide`}>
                      Member ID
                    </p>
                    <p className={`text-base sm:text-lg lg:text-xl font-mono font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mt-1 group-hover:${isDarkMode ? 'text-blue-200' : 'text-blue-900'} transition-colors duration-300 break-all`}>
                      {user.id}
                    </p>
                  </div>
                </div>

                <div className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-green-900/30' : 'bg-gradient-to-r from-gray-50 to-green-50/30'} rounded-xl sm:rounded-2xl border ${isDarkMode ? 'border-gray-700 hover:border-green-600/50' : 'border-gray-200/50 hover:border-green-300/50'} hover:shadow-lg ${isDarkMode ? 'hover:shadow-green-900/20' : 'hover:shadow-green-500/10'} transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}>
                  <Mail className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-green-400' : 'text-green-500'} mt-0.5 sm:mt-1 group-hover:${isDarkMode ? 'text-green-300' : 'text-green-600'} group-hover:scale-110 transition-all duration-300 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wide`}>
                      Email Address
                    </p>
                    <p className={`text-sm sm:text-base lg:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mt-1 group-hover:${isDarkMode ? 'text-green-200' : 'text-green-900'} transition-colors duration-300 break-all`}>
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Account Information Card - Dark mode support */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center space-x-2 sm:space-x-3 border-b-2 ${isDarkMode ? 'border-indigo-700' : 'border-gradient-to-r from-indigo-500 to-purple-500'} pb-2 sm:pb-3 ${isDarkMode ? 'hover:text-indigo-300' : 'hover:text-indigo-700'} transition-colors duration-300`}>
                <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} drop-shadow-sm`} />
                <span>Account Timeline</span>
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-indigo-900/30' : 'bg-gradient-to-r from-gray-50 to-indigo-50/30'} rounded-xl sm:rounded-2xl border ${isDarkMode ? 'border-gray-700 hover:border-indigo-600/50' : 'border-gray-200/50 hover:border-indigo-300/50'} hover:shadow-lg ${isDarkMode ? 'hover:shadow-indigo-900/20' : 'hover:shadow-indigo-500/10'} transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}>
                  <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} mt-0.5 sm:mt-1 group-hover:${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} group-hover:scale-110 transition-all duration-300 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wide`}>
                      Member Since
                    </p>
                    <p className={`text-sm sm:text-base lg:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mt-1 group-hover:${isDarkMode ? 'text-indigo-200' : 'text-indigo-900'} transition-colors duration-300`}>
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-orange-900/30' : 'bg-gradient-to-r from-gray-50 to-orange-50/30'} rounded-xl sm:rounded-2xl border ${isDarkMode ? 'border-gray-700 hover:border-orange-600/50' : 'border-gray-200/50 hover:border-orange-300/50'} hover:shadow-lg ${isDarkMode ? 'hover:shadow-orange-900/20' : 'hover:shadow-orange-500/10'} transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}>
                  <FileText className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'} mt-0.5 sm:mt-1 group-hover:${isDarkMode ? 'text-orange-300' : 'text-orange-600'} group-hover:scale-110 transition-all duration-300 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wide`}>
                      Last Updated
                    </p>
                    <p className={`text-sm sm:text-base lg:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mt-1 group-hover:${isDarkMode ? 'text-orange-200' : 'text-orange-900'} transition-colors duration-300`}>
                      {formatDate(user.updatedAt || user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-teal-900/30' : 'bg-gradient-to-r from-gray-50 to-teal-50/30'} rounded-xl sm:rounded-2xl border ${isDarkMode ? 'border-gray-700 hover:border-teal-600/50' : 'border-gray-200/50 hover:border-teal-300/50'} hover:shadow-lg ${isDarkMode ? 'hover:shadow-teal-900/20' : 'hover:shadow-teal-500/10'} transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}>
                  <Shield className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-teal-400' : 'text-teal-500'} mt-0.5 sm:mt-1 group-hover:${isDarkMode ? 'text-teal-300' : 'text-teal-600'} group-hover:scale-110 transition-all duration-300 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wide`}>
                      Account Roles
                    </p>
                    <p className={`text-sm sm:text-base lg:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mt-1 group-hover:${isDarkMode ? 'text-teal-200' : 'text-teal-900'} transition-colors duration-300`}>
                      {user.roles || "Standard Member"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Medicare Information - Full Width - Dark mode support */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center space-x-2 sm:space-x-3 border-b-2 ${isDarkMode ? 'border-blue-700' : 'border-gradient-to-r from-blue-500 to-green-500'} pb-2 sm:pb-3 ${isDarkMode ? 'hover:text-blue-300' : 'hover:text-blue-700'} transition-colors duration-300`}>
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 drop-shadow-sm animate-pulse" />
                <span>Medicare Coverage Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className={`p-4 sm:p-5 lg:p-6 ${isDarkMode ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700' : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'} rounded-2xl sm:rounded-3xl border-2 ${isDarkMode ? 'border-blue-700/50 hover:border-blue-500/50' : 'border-blue-200/50 hover:border-blue-400/50'} shadow-lg ${isDarkMode ? 'hover:shadow-blue-900/20' : 'hover:shadow-blue-500/20'} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer relative overflow-hidden`}>
                  <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial ${isDarkMode ? 'from-blue-600/20' : 'from-blue-300/20'} to-transparent rounded-full group-hover:scale-150 transition-transform duration-700`} />
                  <div className="relative">
                    <p className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-700'} uppercase tracking-wider mb-2`}>
                      Plan Type
                    </p>
                    <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-blue-100' : 'text-blue-900'} group-hover:${isDarkMode ? 'text-blue-50' : 'text-blue-800'} transition-colors duration-300`}>
                      Medicare Advantage
                    </p>
                    <Shield className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'} mt-2 sm:mt-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`} />
                  </div>
                </div>

                <div className={`p-4 sm:p-5 lg:p-6 ${isDarkMode ? 'bg-gradient-to-br from-green-900 via-green-800 to-emerald-700' : 'bg-gradient-to-br from-green-50 via-green-100 to-emerald-200'} rounded-2xl sm:rounded-3xl border-2 ${isDarkMode ? 'border-green-700/50 hover:border-green-500/50' : 'border-green-200/50 hover:border-green-400/50'} shadow-lg ${isDarkMode ? 'hover:shadow-green-900/20' : 'hover:shadow-green-500/20'} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer relative overflow-hidden`}>
                  <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial ${isDarkMode ? 'from-green-600/20' : 'from-green-300/20'} to-transparent rounded-full group-hover:scale-150 transition-transform duration-700`} />
                  <div className="relative">
                    <p className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-green-200' : 'text-green-700'} uppercase tracking-wider mb-2`}>
                      Coverage Status
                    </p>
                    <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-green-100' : 'text-green-900'} group-hover:${isDarkMode ? 'text-green-50' : 'text-green-800'} transition-colors duration-300`}>
                      Full Coverage
                    </p>
                    <Activity className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${isDarkMode ? 'text-green-300' : 'text-green-600'} mt-2 sm:mt-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`} />
                  </div>
                </div>

                <div className={`p-4 sm:p-5 lg:p-6 ${isDarkMode ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-violet-700' : 'bg-gradient-to-br from-purple-50 via-purple-100 to-violet-200'} rounded-2xl sm:rounded-3xl border-2 ${isDarkMode ? 'border-purple-700/50 hover:border-purple-500/50' : 'border-purple-200/50 hover:border-purple-400/50'} shadow-lg ${isDarkMode ? 'hover:shadow-purple-900/20' : 'hover:shadow-purple-500/20'} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer relative overflow-hidden sm:col-span-2 lg:col-span-1`}>
                  <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial ${isDarkMode ? 'from-purple-600/20' : 'from-purple-300/20'} to-transparent rounded-full group-hover:scale-150 transition-transform duration-700`} />
                  <div className="relative">
                    <p className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-purple-200' : 'text-purple-700'} uppercase tracking-wider mb-2`}>
                      Enrollment Date
                    </p>
                    <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-purple-100' : 'text-purple-900'} group-hover:${isDarkMode ? 'text-purple-50' : 'text-purple-800'} transition-colors duration-300`}>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <Calendar className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'} mt-2 sm:mt-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Additional Notes - Dark mode support */}
            <div className="lg:col-span-2">
              <div className={`p-4 sm:p-5 lg:p-6 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900' : 'bg-gradient-to-r from-gray-50 via-slate-50 to-gray-100'} rounded-2xl sm:rounded-3xl border-2 ${isDarkMode ? 'border-gray-700/50 hover:border-gray-600/50' : 'border-gray-200/50 hover:border-gray-300/50'} shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group`}>
                <h4 className={`font-bold text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-3 sm:mb-4 flex items-center space-x-2`}>
                  <FileText className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span>Coverage Notes & Benefits</span>
                </h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-base group-hover:${isDarkMode ? 'text-gray-200' : 'text-gray-800'} transition-colors duration-300`}>
                  ✅ Comprehensive Medicare Advantage coverage with full access to preventive care, specialist visits, and emergency services. Wellness programs and health screenings are included at no additional cost. 24/7 telehealth support available.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer with Mobile Optimization - Dark mode support */}
        <div className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-slate-900' : 'bg-gradient-to-r from-gray-100 to-slate-100'} border-t-2 ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4`}>
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'} font-medium rounded-xl sm:rounded-2xl border-2 ${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'} transition-all duration-300 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} hover:shadow-lg hover:-translate-y-0.5`}
          >
            Close
          </button>
          <button className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 ${isDarkMode ? 'bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-900' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700'} text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${isDarkMode ? 'hover:shadow-blue-900/30 hover:from-blue-900 hover:to-indigo-900' : 'hover:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-800'} relative overflow-hidden group`}>
            <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <span className="relative flex items-center justify-center space-x-2">
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Edit Member</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;