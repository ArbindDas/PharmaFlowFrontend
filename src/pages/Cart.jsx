

import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Calendar, Package, User, LogIn, AlertCircle, X, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      alert('Please login to place your order');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      clearCart();
      navigate('/orders');
    }, 2000);
  };

  const handleRemoveItem = (id) => {
    setShowDeleteConfirm(null);
    removeFromCart(id);
  };

  const handleClearCart = () => {
    setShowClearConfirm(false);
    clearCart();
  };

  const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return { color: 'text-red-600 bg-red-50 border-red-200', text: `Expires in ${diffDays} days`, urgent: true };
    } else if (diffDays < 90) {
      return { color: 'text-orange-600 bg-orange-50 border-orange-200', text: `Expires in ${diffDays} days`, urgent: false };
    } else {
      return { color: 'text-green-600 bg-green-50 border-green-200', text: `Expires ${date.toLocaleDateString()}`, urgent: false };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl transform animate-bounce">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600">Thank you for your purchase</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl transform animate-scale-up max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Item?</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to remove this item from your cart?</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleRemoveItem(showDeleteConfirm)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl transform animate-scale-up max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Cart?</h3>
              <p className="text-gray-600 mb-6">This will remove all items from your cart. This action cannot be undone.</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClearCart}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Cart</h1>
                <p className="text-gray-600 text-lg">Review your items before checkout</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-sm text-gray-500 block">Total Items</span>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  {totalItems}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500 block">Total Value</span>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  ${totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added any items yet</p>
            <Link
              to="/medicine"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => {
                const expiryInfo = formatExpiryDate(item.expiryDate);
                const isHovered = hoveredItem === item.id;
                
                return (
                  <div 
                    key={item.id} 
                    className={`bg-white rounded-3xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${isHovered ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Enhanced Product Image */}
                      <div className="flex-shrink-0 relative group">
                        <div className="w-40 h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-200" />
                        </div>
                      </div>

                      {/* Enhanced Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                            {item.name}
                          </h3>
                          <button 
                            onClick={() => setShowDeleteConfirm(item.id)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 group"
                          >
                            <Trash2 className="w-6 h-6 group-hover:animate-bounce" />
                          </button>
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed text-lg">{item.description}</p>

                        {/* Enhanced Product Info Tags */}
                        <div className="flex flex-wrap gap-3 mb-6">
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:shadow-lg transition-all duration-200">
                            <span className="text-xl font-bold">${item.price}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200 hover:shadow-lg transition-all duration-200">
                            <Package className="w-4 h-4" />
                            <span>Stock: {item.stock}</span>
                          </div>
                          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border hover:shadow-lg transition-all duration-200 ${expiryInfo.color}`}>
                            <Calendar className="w-4 h-4" />
                            <span>{expiryInfo.text}</span>
                            {expiryInfo.urgent && <AlertCircle className="w-4 h-4 animate-pulse" />}
                          </div>
                        </div>

                        {/* Enhanced Quantity Controls */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-semibold text-gray-700">Quantity:</span>
                            <div className="flex items-center space-x-2 bg-white rounded-xl p-2 shadow-md">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              <span className="w-12 text-center font-bold text-xl">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">${item.price} × {item.quantity}</p>
                            <p className="text-2xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl p-8 text-white sticky top-6 hover:shadow-3xl transition-all duration-300">
                <h3 className="text-2xl font-bold mb-8 text-center">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors duration-200">
                      <span className="text-gray-300">{item.name} × {item.quantity}</span>
                      <span className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-6 mb-8">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span className="text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 transform hover:shadow-lg"
                  >
                    Clear Cart
                  </button>
                  
                  <button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
                  >
                    {isAuthenticated ? (
                      <>
                        <User className="w-6 h-6" />
                        <span>Place Order</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <LogIn className="w-6 h-6" />
                        <span>Login to Place Order</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-up {
          0% {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        
        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Cart;