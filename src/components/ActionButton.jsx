import React from 'react';

const ActionButton = ({ icon: Icon, variant = 'secondary', tooltip, onClick }) => {
  const variants = {
    primary: 'bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700',
    danger: 'bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700'
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md group relative ${variants[variant]}`}
      title={tooltip}
    >
      <Icon className="w-4 h-4" />
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </button>
  );
};

export default ActionButton;