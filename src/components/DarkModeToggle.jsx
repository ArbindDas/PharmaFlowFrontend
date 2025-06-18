import React from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = ({ isDarkMode, toggleDarkMode, className = '' }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex items-center justify-center w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${className}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Background track */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      
      {/* Toggle circle */}
      <div className={`relative z-10 flex items-center justify-center w-5 h-5 bg-white dark:bg-gray-800 rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${
        isDarkMode ? 'translate-x-3' : '-translate-x-3'
      }`}>
        {/* Icons */}
        <Sun 
          className={`w-3 h-3 text-yellow-500 transition-all duration-200 ${
            isDarkMode ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`} 
        />
        <Moon 
          className={`absolute w-3 h-3 text-blue-400 transition-all duration-200 ${
            isDarkMode ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`} 
        />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isDarkMode 
          ? 'shadow-lg shadow-blue-500/25' 
          : 'shadow-sm shadow-gray-200'
      }`}></div>
    </button>
  );
};

export default DarkModeToggle;