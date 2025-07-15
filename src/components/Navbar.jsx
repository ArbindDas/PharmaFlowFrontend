// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext";
// import { Moon, Sun } from "lucide-react";
// import { Badge } from 'antd';  // Add this import
// import { ShoppingCartOutlined } from '@ant-design/icons';  // Make sure this is imported
// import { useCart } from "../context/CartContext"; // Add this import
// const Navbar = () => {
//   const { user } = useAuth();
//   const { isDarkMode, toggleDarkMode } = useTheme();
//   const { cart } = useCart();  // Destructure cart from useCart()

//   return (
//     <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex-shrink-0 flex items-center">
//               <svg
//                 className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
//                 />
//               </svg>
//               <span className="ml-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
//                 MediCare
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link
//               to="/"
//               className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               Home
//             </Link>
//             {/* <Link
//               to="/medicines"
//               className="text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Medicines */}
//             {/* </Link> */}
//             <Link
//               to="/about"
//               className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               About
//             </Link>
//             <Link
//               to="/contact"
//               className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               Contact
//             </Link>


//             <Link
//             to="/test"
//             className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               Test
//             </Link>

//             <Link
//               to="/medicine"
//               className="px-4 py-2 text-blue-600 hover:text-blue-800"
//             >
//               Browse Medicines
//             </Link>

//             <Link 
//               to="/cart" 
//               className="p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
//             >
//               <Badge count={cart.length} showZero>
//                 <ShoppingCartOutlined style={{ fontSize: '20px' }} />
//               </Badge>
//             </Link>

//             {user?.isAdmin && (
//               <Link
//                 to="/admin/dashboard"
//                 className="text-sm font-medium text-blue-600 dark:text-blue-400"
//               >
//                 Admin Dashboard
//               </Link>

              
//             )}
//           </div>

//           {/* Right side - Dark Mode Toggle and Auth Links */}
//           <div className="flex items-center space-x-4">
//             {/* Dark Mode Toggle */}
//             {/* Dark Mode Toggle */}
//             <button
//               onClick={toggleDarkMode}
//               className="p-2 rounded-full focus:outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
//               aria-label={
//                 isDarkMode ? "Switch to light mode" : "Switch to dark mode"
//               }
//             >
//               {isDarkMode ? (
//                 <Sun className="w-5 h-5" />
//               ) : (
//                 <Moon className="w-5 h-5" />
//               )}
//             </button>
//             {/* Auth Buttons */}
//             <Link
//               to="/login"
//               className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               Sign In
//             </Link>
//             <Link
//               to="/register"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               Register
//             </Link>

//             <Link
//               to="/openAI"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               AI
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg
                className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
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
              <span className="ml-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
                MediCare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Contact
            </Link>
            <Link
              to="/test"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Test
            </Link>
            <Link
              to="/medicine"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Browse Medicines
            </Link>
            <Link 
              to="/cart" 
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Badge count={cart.length} showZero>
                <ShoppingCartOutlined style={{ fontSize: '20px' }} />
              </Badge>
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-sm font-medium text-blue-600 dark:text-blue-400"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right side - Dark Mode Toggle and Auth Links */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full focus:outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            
            {/* Auth Buttons - Hidden on mobile */}
            <div className="hidden md:flex space-x-2">
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Register
              </Link>
              <Link
                to="/openAI"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                AI
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition duration-300"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <Link
            to="/test"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            Test
          </Link>
          <Link
            to="/medicine"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            Browse Medicines
          </Link>
          <Link
            to="/cart"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            <div className="flex items-center">
              <span className="mr-2">Cart</span>
              <Badge count={cart.length} showZero>
                <ShoppingCartOutlined style={{ fontSize: '20px' }} />
              </Badge>
            </div>
          </Link>
          {user?.isAdmin && (
            <Link
              to="/admin/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleMenu}
            >
              Admin Dashboard
            </Link>
          )}
          <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/login"
              className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md"
              onClick={toggleMenu}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block w-full mt-2 px-4 py-2 text-left text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              onClick={toggleMenu}
            >
              Register
            </Link>
            <Link
              to="/openAI"
              className="block w-full mt-2 px-4 py-2 text-left text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              onClick={toggleMenu}
            >
              AI
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;