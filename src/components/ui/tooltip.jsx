import React, { useState, createContext, useContext } from "react";

// Context for Tooltip
const TooltipContext = createContext();

export function TooltipProvider({ children }) {
  const [visible, setVisible] = useState(false);
  return (
    <TooltipContext.Provider value={{ visible, setVisible }}>
      {children}
    </TooltipContext.Provider>
  );
}

export function Tooltip({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function TooltipTrigger({ children }) {
  const { setVisible } = useContext(TooltipContext);
  return React.cloneElement(children, {
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
  });
}

export function TooltipContent({ children }) {
  const { visible } = useContext(TooltipContext);
  return (
    visible && (
      <div className="absolute z-50 mt-2 p-2 bg-gray-800 text-white text-sm rounded shadow-lg">
        {children}
      </div>
    )
  );
}
