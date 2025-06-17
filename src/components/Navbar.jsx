import { Link } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

  const {user} = useAuth();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg
                className="h-8 w-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-indigo-600">
                MediCare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/medicines"
              className="text-indigo-600 border-b-2 border-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Medicines
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Contact
            </Link>

            {user?.isAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-sm font-medium text-blue-600"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
