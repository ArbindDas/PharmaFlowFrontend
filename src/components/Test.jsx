import React, { useState } from 'react';

const Test = () => {
  const [showLaptopOnly, setShowLaptopOnly] = useState(false);
  
  const Products = [
    { id: 1, name: "Laptop", Address: "Warehouse A", icon: "💻", color: "bg-blue-500" },
    { id: 2, name: "Smartphone", Address: "Warehouse B", icon: "📱", color: "bg-red-500" },
    { id: 3, name: "Headphones", Address: "Warehouse C", icon: "🎧", color: "bg-purple-500" },
    { id: 4, name: "Keyboard", Address: "Warehouse A", icon: "⌨️", color: "bg-green-500" },
    { id: 5, name: "Monitor", Address: "Warehouse D", icon: "🖥️", color: "bg-orange-500" },
  ];

  const filteredProducts = showLaptopOnly 
    ? Products.filter(product => product.name === "Laptop")
    : Products;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Product Warehouse
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your inventory with style
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
            <button
              onClick={() => setShowLaptopOnly(false)}
              className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                !showLaptopOnly
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setShowLaptopOnly(true)}
              className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                showLaptopOnly
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Laptop Only
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            {showLaptopOnly ? "Laptop Location" : "All Products"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Product Icon */}
                <div className={`w-16 h-16 ${product.color} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300`}>
                  {product.icon}
                </div>
                
                {/* Product Details */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {product.name}
                  </h3>
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full">
                    <span className="text-sm text-gray-200">
                      📍 {product.Address}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Summary */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            Warehouse Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["Warehouse A", "Warehouse B", "Warehouse C", "Warehouse D"].map((warehouse) => {
              const warehouseProducts = Products.filter(p => p.Address === warehouse);
              return (
                <div key={warehouse} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {warehouseProducts.length}
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    {warehouse}
                  </div>
                  <div className="text-xs text-gray-400">
                    {warehouseProducts.map(p => p.name).join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {Products.length}
              </div>
              <div className="text-gray-300">
                Total Products
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                4
              </div>
              <div className="text-gray-300">
                Warehouses
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {Products.filter(p => p.Address === "Warehouse A").length}
              </div>
              <div className="text-gray-300">
                Items in Warehouse A
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;