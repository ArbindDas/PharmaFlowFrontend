
import React, { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Calendar,
  Package,
  User,
  LogIn,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Heart,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/animations.css";
import { useFirebaseCart } from "../context/FirebaseCartContext";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51Ry1Q2PzuRUZBXUT8j8IyEsGZGr5fnaqLswgtBAe1ieDbUWiukJTSXOao1NrfTioubBssdFWWLiYGii0WrKYXhbw00U6LBslkq");

// Stripe Payment Form Component
const StripePaymentForm = ({ totalPrice, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const handleSubmit = async (event) => {
  event.preventDefault();
  
  if (!stripe || !elements) {
    return;
  }

  // Convert to paise and validate minimum amount
  const amountInPaise = Math.round(totalPrice * 100);
  if (amountInPaise < 50) { // 50 paise = ₹0.50
    setErrorMessage("Minimum payment amount is ₹0.50");
    onError("Minimum payment amount is ₹0.50");
    return;
  }

  setProcessing(true);
  setErrorMessage("");

  try {
    // Create payment intent on your server
    const response = await fetch("http://localhost:8080/api/payment/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ amount: amountInPaise }),
    });

    // Check if response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if clientSecret exists in response
    if (!data.clientSecret) {
      throw new Error("No client secret received from server");
    }

    // Confirm the payment with Stripe
    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setErrorMessage(result.error.message);
      onError(result.error.message);
    } else {
      // Payment succeeded
      onSuccess(result.paymentIntent);
    }
  } catch (error) {
    console.error("Payment error:", error);
    const message = error.message || "Payment failed. Please try again.";
    setErrorMessage(message);
    onError(message);
  } finally {
    setProcessing(false);
  }
};
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 rounded-xl bg-gray-700">
        <h4 className="text-lg font-semibold mb-4 text-white">Card Details</h4>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-gray-600">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#ffffff",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                    backgroundColor: "#4b5563",
                  },
                },
              }}
            />
          </div>
        </div>
        {errorMessage && (
          <div className="text-red-400 text-sm mt-2">{errorMessage}</div>
        )}
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 sm:space-x-3 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Processing..." : `Pay Rs${totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
};

function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useFirebaseCart();
  
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentError, setPaymentError] = useState("");


  const handlePlaceOrder = async (paymentIntentId = null) => {
  if (!isAuthenticated) {
    alert("Please login to place your order");
    navigate("/login", { state: { from: "/cart" } });
    return;
  }

  try {
    // Get the token using the same method as ProtectedRoute
    const getToken = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.authProvider === 'GOOGLE') {
            return localStorage.getItem('accessToken');
          } else {
            return user.token || localStorage.getItem('token');
          }
        } catch (e) {
          return null;
        }
      }
      return localStorage.getItem('accessToken') || localStorage.getItem('token');
    };

    const token = getToken();
    
    if (!token) {
      alert("Authentication token missing. Please login again.");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    const orderData = {
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      paymentIntentId: paymentIntentId,
      orderItems: cart.map((item) => ({
        medicineId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    const response = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    // Handle response more efficiently
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(responseText || "Unknown error occurred");
    }

    if (!response.ok) {
      throw new Error(data.message || data || "Failed to place order");
    }

    console.log("Order created successfully:", data);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      clearCart();
      navigate("/dashboard/orders");
    }, 2000);
  } catch (error) {
    console.error("Order placement error:", error);
    alert(error.message || "Failed to place order. Please try again.");
  }
};
  const handleStripePaymentSuccess = (paymentIntent) => {
    console.log("Payment succeeded:", paymentIntent);
    handlePlaceOrder(paymentIntent.id);
  };

  const handleStripePaymentError = (error) => {
    console.error("Stripe payment error:", error);
    setPaymentError(error);
    alert(`Payment error: ${error}`);
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
      return {
        color:
          "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400",
        text: `Expires in ${diffDays} days`,
        urgent: true,
      };
    } else if (diffDays < 90) {
      return {
        color:
          "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400",
        text: `Expires in ${diffDays} days`,
        urgent: false,
      };
    } else {
      return {
        color:
          "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400",
        text: `Expires ${date.toLocaleDateString()}`,
        urgent: false,
      };
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      } relative`}
    >
      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div
            className={`p-8 rounded-3xl shadow-2xl transform animate-bounce ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3
                className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Order Placed Successfully!
              </h3>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                Thank you for your purchase
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div
            className={`p-8 rounded-3xl shadow-2xl transform animate-scale-up max-w-md w-full mx-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Remove Item?
              </h3>
              <p
                className={isDarkMode ? "text-gray-300" : "text-gray-600 mb-6"}
              >
                Are you sure you want to remove this item from your cart?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
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
          <div
            className={`p-8 rounded-3xl shadow-2xl transform animate-scale-up max-w-md w-full mx-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-500 dark:text-orange-400" />
              </div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Clear Cart?
              </h3>
              <p
                className={
                  isDarkMode ? "text-gray-300 mb-6" : "text-gray-600 mb-6"
                }
              >
                This will remove all items from your cart. This action cannot be
                undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
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

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Enhanced Header */}
        <div
          className={`rounded-3xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 border transition-all duration-300 transform hover:-translate-y-1 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 hover:shadow-2xl"
              : "bg-white border-gray-100 hover:shadow-2xl"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div>
                <h1
                  className={`text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Your Cart
                </h1>
                <p
                  className={
                    isDarkMode
                      ? "text-gray-300 text-sm sm:text-lg"
                      : "text-gray-600 text-sm sm:text-lg"
                  }
                >
                  Review your items before checkout
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-normal">
              <div className="text-center sm:text-right">
                <span
                  className={`text-xs sm:text-sm block ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Items
                </span>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-lg shadow-lg">
                  {totalItems}
                </div>
              </div>
              <div className="text-center sm:text-right">
                <span
                  className={`text-xs sm:text-sm block ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Value
                </span>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-lg shadow-lg">
                  Rs{totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div
            className={`rounded-3xl shadow-xl p-8 sm:p-16 text-center border hover:shadow-2xl transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 animate-pulse">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3
              className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Your cart is empty
            </h3>
            <p
              className={`mb-6 sm:mb-8 text-sm sm:text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Looks like you haven't added any items yet
            </p>
            <Link
              to="/medicine"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 sm:px-10 sm:py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Enhanced Cart Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cart.map((item) => {
                const expiryInfo = formatExpiryDate(item.expiryDate);
                const isHovered = hoveredItem === item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl shadow-lg p-6 sm:p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                      isHovered ? "ring-2 ring-blue-500 ring-opacity-50" : ""
                    } ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-100"
                    }`}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                      {/* Enhanced Product Image */}
                      <div className="flex-shrink-0 relative group mx-auto md:mx-0">
                        <div
                          className={`w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-2 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600"
                              : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                          }`}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div
                          className={`absolute -top-2 -right-2 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            isDarkMode ? "bg-gray-700" : "bg-white"
                          }`}
                        >
                          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-200" />
                        </div>
                      </div>

                      {/* Enhanced Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                          <h3
                            className={`text-xl sm:text-2xl font-bold hover:text-blue-600 transition-colors duration-200 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <button
                            onClick={() => setShowDeleteConfirm(item.id)}
                            className={`p-2 sm:p-3 rounded-xl transition-all duration-200 hover:scale-110 group ${
                              isDarkMode
                                ? "text-red-400 hover:bg-gray-700"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" />
                          </button>
                        </div>

                        <p
                          className={`mb-4 sm:mb-6 leading-relaxed text-sm sm:text-lg ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {item.description}
                        </p>

                        {/* Enhanced Product Info Tags */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                          <div
                            className={`flex items-center space-x-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border hover:shadow-lg transition-all duration-200 ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-blue-400"
                                : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700"
                            }`}
                          >
                            <span className="text-sm sm:text-xl font-bold">
                              Rs{item.price}
                            </span>
                          </div>
                          <div
                            className={`flex items-center space-x-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border hover:shadow-lg transition-all duration-200 ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-green-400"
                                : "bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700"
                            }`}
                          >
                            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Stock: {item.stock}</span>
                          </div>
                          <div
                            className={`flex items-center space-x-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border hover:shadow-lg transition-all duration-200 ${expiryInfo.color}`}
                          >
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{expiryInfo.text}</span>
                            {expiryInfo.urgent && (
                              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                            )}
                          </div>
                        </div>

                        {/* Enhanced Quantity Controls */}
                        <div
                          className={`flex items-center justify-between rounded-2xl p-3 sm:p-4 ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            <span
                              className={`text-sm sm:text-lg font-semibold ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              Quantity:
                            </span>
                            <div
                              className={`flex items-center space-x-1 sm:space-x-2 rounded-xl p-1 sm:p-2 shadow-md ${
                                isDarkMode ? "bg-gray-600" : "bg-white"
                              }`}
                            >
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 ${
                                  isDarkMode
                                    ? "hover:bg-gray-500"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <span
                                className={`w-8 sm:w-12 text-center font-bold text-sm sm:text-xl ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                                  isDarkMode
                                    ? "hover:bg-gray-500"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-xs sm:text-sm mb-1 ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Rs{item.price} × {item.quantity}
                            </p>
                            <p
                              className={`text-lg sm:text-2xl font-bold ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Rs{(item.price * item.quantity).toFixed(2)}
                            </p>
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
              <div
                className={`rounded-3xl shadow-2xl p-6 sm:p-8 sticky top-6 hover:shadow-3xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
                }`}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">
                  Order Summary
                </h3>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className={`flex justify-between items-center p-2 sm:p-3 rounded-xl hover:shadow-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      <span
                        className={`text-xs sm:text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-300"
                        }`}
                      >
                        {item.name} × {item.quantity}
                      </span>
                      <span
                        className={`font-semibold text-sm sm:text-base ${
                          isDarkMode ? "text-white" : "text-white"
                        }`}
                      >
                        Rs{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className={`border-t pt-4 sm:pt-6 mb-6 sm:mb-8 ${
                    isDarkMode ? "border-gray-700" : "border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
                    <span className={isDarkMode ? "text-white" : "text-white"}>
                      Total
                    </span>
                    <span className="text-2xl sm:text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Rs{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-lg font-semibold mb-4">Payment Method</h4>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        paymentMethod === "cod"
                          ? "bg-blue-500 text-white"
                          : isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <span className="w-5 h-5 mr-3 inline-block">Rs</span>
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <div
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        paymentMethod === "credit_card"
                          ? "bg-blue-500 text-white"
                          : isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("credit_card")}
                    >
                      <CreditCard className="w-5 h-5 mr-3" />
                      <span>Credit/Debit Card</span>
                    </div>
                  </div>
                </div>

                {/* Stripe Payment Form */}
                {paymentMethod === "credit_card" && (
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm 
                      totalPrice={totalPrice} 
                      onSuccess={handleStripePaymentSuccess}
                      onError={handleStripePaymentError}
                    />
                  </Elements>
                )}

                {paymentMethod === "cod" && (
                  <div className="space-y-3 sm:space-y-4">
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className={`w-full py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 transform hover:shadow-lg ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
                    >
                      Clear Cart
                    </button>

                    <button
                      onClick={() => handlePlaceOrder()}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 sm:space-x-3 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl text-sm sm:text-base"
                    >
                      {isAuthenticated ? (
                        <>
                          <User className="w-5 h-5 sm:w-6 sm:h-6" />
                          <span>Place Order</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
                          <span>Login to Place Order</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;