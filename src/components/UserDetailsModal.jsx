


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
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-8  border border-gray-200/50 hover:shadow-blue-500/20 hover:shadow-3xl transition-all duration-500"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        {/* Enhanced Header with Mobile Optimization */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-transparent to-indigo-400/30 animate-pulse" />
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl shadow-2xl border border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-300 hover:shadow-white/20 hover:shadow-lg">
                {getInitials(user.fullName)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-1 text-shadow-lg truncate">
                  {user.fullName}
                </h2>
                <p className="text-blue-100 opacity-90 text-sm sm:text-base lg:text-lg hidden sm:block">
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
              className="p-2 sm:p-3 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all duration-300 group hover:rotate-90 hover:scale-110 hover:shadow-lg hover:shadow-white/20"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:drop-shadow-lg transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Enhanced Content with Mobile Optimization */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)] bg-gradient-to-b from-gray-50/50 to-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

            {/* Enhanced Basic Information Card */}
            <div className="space-y-4 sm:space-y-6 group">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2 sm:space-x-3 border-b-2 border-gradient-to-r from-blue-500 to-indigo-500 pb-2 sm:pb-3 hover:text-blue-700 transition-colors duration-300">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 drop-shadow-sm" />
                <span>Personal Information</span>
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl sm:rounded-2xl border border-gray-200/50 hover:border-blue-300/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mt-0.5 sm:mt-1 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Member ID
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl font-mono font-bold text-gray-900 mt-1 group-hover:text-blue-900 transition-colors duration-300 break-all">
                      {user.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-xl sm:rounded-2xl border border-gray-200/50 hover:border-green-300/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mt-0.5 sm:mt-1 group-hover:text-green-600 group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Email Address
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mt-1 group-hover:text-green-900 transition-colors duration-300 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-xl sm:rounded-2xl border border-gray-200/50 hover:border-purple-300/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mt-0.5 sm:mt-1 group-hover:text-purple-600 group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Phone Number
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mt-1 group-hover:text-purple-900 transition-colors duration-300">
                      {user.phone || "(555) 123-4567"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Account Information Card */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2 sm:space-x-3 border-b-2 border-gradient-to-r from-indigo-500 to-purple-500 pb-2 sm:pb-3 hover:text-indigo-700 transition-colors duration-300">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 drop-shadow-sm" />
                <span>Account Timeline</span>
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl sm:rounded-2xl border border-gray-200/50 hover:border-indigo-300/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 mt-0.5 sm:mt-1 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Member Since
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mt-1 group-hover:text-indigo-900 transition-colors duration-300">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-xl sm:rounded-2xl border border-gray-200/50 hover:border-orange-300/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mt-0.5 sm:mt-1 group-hover:text-orange-600 group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Last Updated
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mt-1 group-hover:text-orange-900 transition-colors duration-300">
                      {formatDate(user.updatedAt || user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 bg-gradient-to-r from-gray-50 to-teal-50/30 rounded-xl sm:rounded-2xl border border-gray-200/50 hover:border-teal-300/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 mt-0.5 sm:mt-1 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Account Roles
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mt-1 group-hover:text-teal-900 transition-colors duration-300">
                      {user.roles || "Standard Member"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Medicare Information - Full Width */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2 sm:space-x-3 border-b-2 border-gradient-to-r from-blue-500 to-green-500 pb-2 sm:pb-3 hover:text-blue-700 transition-colors duration-300">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 drop-shadow-sm animate-pulse" />
                <span>Medicare Coverage Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl sm:rounded-3xl border-2 border-blue-200/50 hover:border-blue-400/50 shadow-lg hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer relative overflow-hidden">
                  <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-blue-300/20 to-transparent rounded-full group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative">
                    <p className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wider mb-2">
                      Plan Type
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                      Medicare Advantage
                    </p>
                    <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 mt-2 sm:mt-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  </div>
                </div>

                <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-green-50 via-green-100 to-emerald-200 rounded-2xl sm:rounded-3xl border-2 border-green-200/50 hover:border-green-400/50 shadow-lg hover:shadow-green-500/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer relative overflow-hidden">
                  <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-green-300/20 to-transparent rounded-full group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative">
                    <p className="text-xs sm:text-sm font-bold text-green-700 uppercase tracking-wider mb-2">
                      Coverage Status
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900 group-hover:text-green-800 transition-colors duration-300">
                      Full Coverage
                    </p>
                    <Activity className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 mt-2 sm:mt-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  </div>
                </div>

                <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-purple-50 via-purple-100 to-violet-200 rounded-2xl sm:rounded-3xl border-2 border-purple-200/50 hover:border-purple-400/50 shadow-lg hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer relative overflow-hidden sm:col-span-2 lg:col-span-1">
                  <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-purple-300/20 to-transparent rounded-full group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative">
                    <p className="text-xs sm:text-sm font-bold text-purple-700 uppercase tracking-wider mb-2">
                      Enrollment Date
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 group-hover:text-purple-800 transition-colors duration-300">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <Calendar className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 mt-2 sm:mt-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Additional Notes */}
            <div className="lg:col-span-2">
              <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-gray-50 via-slate-50 to-gray-100 rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 hover:border-gray-300/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span>Coverage Notes & Benefits</span>
                </h4>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base group-hover:text-gray-800 transition-colors duration-300">
                  ✅ Comprehensive Medicare Advantage coverage with full access to preventive care, specialist visits, and emergency services. Wellness programs and health screenings are included at no additional cost. 24/7 telehealth support available.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer with Mobile Optimization */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gradient-to-r from-gray-100 to-slate-100 border-t-2 border-gray-200/50 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-gray-700 hover:text-gray-900 font-medium rounded-xl sm:rounded-2xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5"
          >
            Close
          </button>
          <button className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-800 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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