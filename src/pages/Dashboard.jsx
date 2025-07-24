
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut,
  Menu,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

const Dashboard = () => {
  const { user, fetchUserDetails, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { 
    if (fetchUserDetails) {
      fetchUserDetails()
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && user?.roles?.includes("ROLE_ADMIN")) {
      navigate("/admin");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}>
        <div className={`p-6 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-md`}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex justify-center items-center h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}>
        <div className={`p-6 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-md text-center`}>
          <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Please log in to see your dashboard.
          </p>
          <button
            onClick={() => navigate("/login")}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const hasUserRole = user.roles?.includes("ROLE_USER");

  if (!hasUserRole) {
    return (
      <div className={`flex justify-center items-center h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}>
        <div className={`p-6 rounded-lg ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        } shadow-md text-center border`}>
          <h2 className={`text-xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Access Denied
          </h2>
          <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            You do not have permission to view this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${
      isDarkMode ? "bg-gray-900" : "bg-gray-100"
    }`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 shadow-md transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition duration-200 ease-in-out lg:relative ${
        isDarkMode ? "bg-gray-800 border-r border-gray-700" : "bg-white"
      }`}>
        <div className={`p-4 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <h2 className={`text-xl font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            User Dashboard
          </h2>
          <p className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            {user.email}
          </p>
        </div>
        
        <nav className="mt-4">
          <NavLink 
            to="profile"
            className={({isActive}) => `flex items-center px-4 py-3 ${
              isActive 
                ? isDarkMode 
                  ? "bg-gray-700 text-blue-400 border-r-4 border-blue-500" 
                  : "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : isDarkMode 
                  ? "text-gray-300 hover:bg-gray-700" 
                  : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <User className="w-5 h-5 mr-3" />
            Profile Information
          </NavLink>
          
          <NavLink 
            to="orders"
            className={({isActive}) => `flex items-center px-4 py-3 ${
              isActive 
                ? isDarkMode 
                  ? "bg-gray-700 text-blue-400 border-r-4 border-blue-500" 
                  : "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : isDarkMode 
                  ? "text-gray-300 hover:bg-gray-700" 
                  : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <Package className="w-5 h-5 mr-3" />
            My Orders
          </NavLink>
          
          <NavLink 
            to="addresses"
            className={({isActive}) => `flex items-center px-4 py-3 ${
              isActive 
                ? isDarkMode 
                  ? "bg-gray-700 text-blue-400 border-r-4 border-blue-500" 
                  : "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : isDarkMode 
                  ? "text-gray-300 hover:bg-gray-700" 
                  : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <MapPin className="w-5 h-5 mr-3" />
            Address Book
          </NavLink>
          
          <NavLink 
            to="wishlist"
            className={({isActive}) => `flex items-center px-4 py-3 ${
              isActive 
                ? isDarkMode 
                  ? "bg-gray-700 text-blue-400 border-r-4 border-blue-500" 
                  : "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : isDarkMode 
                  ? "text-gray-300 hover:bg-gray-700" 
                  : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <Heart className="w-5 h-5 mr-3" />
            Wishlist
          </NavLink>
          
          <button
            onClick={logout}
            className={`flex items-center w-full px-4 py-3 text-left mt-4 ${
              isDarkMode 
                ? "text-gray-300 hover:bg-gray-700" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 p-8 overflow-y-auto ${
        isDarkMode ? "bg-gray-900" : ""
      }`}>
        {/* Mobile header with hamburger button */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-md ${
              isDarkMode 
                ? "text-gray-300 hover:bg-gray-700" 
                : "text-gray-700 hover:bg-gray-100"
            } focus:outline-none`}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className={`text-xl font-bold ml-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Dashboard
          </h1>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold hidden lg:block ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Welcome back, {user.fullName || user.email.split('@')[0]}!
          </h1>
          <div className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            Last login: {new Date().toLocaleString()}
          </div>
        </div>


            {!window.location.pathname.includes('/dashboard/') && (
  <div className={`rounded-lg shadow-lg p-6 transition-all duration-200 ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"}`}>
    <div className="flex items-center justify-between mb-6">
      <h2 className={`text-2xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        Dashboard Overview
      </h2>
      <div className="relative group">
        <button className={`p-1 rounded-full ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <div className={`absolute z-10 right-0 w-64 p-3 mt-2 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${isDarkMode ? "bg-gray-700 border border-gray-600" : "bg-white border border-gray-200"}`}>
          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Your account summary and quick stats</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Recent Orders Card */}
      <div className={`p-5 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${isDarkMode ? "bg-gray-700 border border-gray-600 hover:border-blue-400" : "bg-blue-50 hover:border-blue-300"} border border-transparent`}>
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}>
            Recent Orders
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? "bg-blue-900/50 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
            +2
          </span>
        </div>
        <p className={`text-3xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          5
        </p>
        <div className="mt-4">
          <NavLink 
            to="orders" 
            className={`inline-flex items-center text-sm font-medium group ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
          >
            View all orders
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </NavLink>
        </div>
      </div>

      {/* Wishlist Items Card */}
      <div className={`p-5 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${isDarkMode ? "bg-gray-700 border border-gray-600 hover:border-green-400" : "bg-green-50 hover:border-green-300"} border border-transparent`}>
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${isDarkMode ? "text-green-300" : "text-green-800"}`}>
            Wishlist Items
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? "bg-green-900/50 text-green-200" : "bg-green-100 text-green-800"}`}>
            New
          </span>
        </div>
        <p className={`text-3xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          12
        </p>
        <div className="mt-4">
          <NavLink 
            to="wishlist" 
            className={`inline-flex items-center text-sm font-medium group ${isDarkMode ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-800"}`}
          >
            View wishlist
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </NavLink>
        </div>
      </div>

      {/* Saved Addresses Card */}
      <div className={`p-5 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${isDarkMode ? "bg-gray-700 border border-gray-600 hover:border-purple-400" : "bg-purple-50 hover:border-purple-300"} border border-transparent`}>
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${isDarkMode ? "text-purple-300" : "text-purple-800"}`}>
            Saved Addresses
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? "bg-purple-900/50 text-purple-200" : "bg-purple-100 text-purple-800"}`}>
            Primary
          </span>
        </div>
        <p className={`text-3xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          2
        </p>
        <div className="mt-4">
          <NavLink 
            to="addresses" 
            className={`inline-flex items-center text-sm font-medium group ${isDarkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-800"}`}
          >
            Manage addresses
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </NavLink>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className={`text-sm font-medium mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        Quick Actions
      </h3>
      <div className="flex flex-wrap gap-3">
        <NavLink
          to="/dashboard/orders/new"
          className={`px-4 py-2 rounded-md font-medium transition-colors ${isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          Place New Order
        </NavLink>
        <NavLink
          to="/dashboard/settings"
          className={`px-4 py-2 rounded-md font-medium transition-colors border ${isDarkMode ? "border-gray-600 hover:bg-gray-700 text-white" : "border-gray-300 hover:bg-gray-100 text-gray-700"}`}
        >
          Account Settings
        </NavLink>
      </div>
    </div>
  </div>
)}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;