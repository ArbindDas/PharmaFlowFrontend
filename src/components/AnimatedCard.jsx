import React from 'react';

const AnimatedCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedCard;