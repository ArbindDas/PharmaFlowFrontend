

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useFirebaseCart } from "../context/FirebaseCartContext";

export function PlaceOrder() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);

  const {
    cart, // This is your cart items array from Firebase
    clearCart, // Function to clear cart
    totalItems, // Total number of items
    totalPrice, // Total price of all items
  } = useFirebaseCart();

  const handleSubmit = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }), // Using cart from Firebase context
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const newOrder = await response.json();
      await clearCart(); // Make sure to await if clearCart is async
      setShowConfirmation(true);

      setTimeout(() => {
        setShowConfirmation(false);
        navigate(`/dashboard/orders/${newOrder.id}`);
      }, 3000);
    } catch (error) {
      console.error("Order placement error:", error);
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-300 scale-100">
            <div className="text-green-500 dark:text-green-400 text-5xl mb-4 flex justify-center">
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">
              Order Placed Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
              Your order has been received and is being processed.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Review Your Order
      </h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Order Summary
        </h3>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Your cart is empty
            </p>
            <Link
              to="/medicine"
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Browse Medicines
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null; // prevents infinite loop if placeholder also fails
                        e.target.src = "/placeholder.jpg"; // path to your placeholder image
                      }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Shipping
                </span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4">
                <span className="text-gray-800 dark:text-gray-200">Total</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-center">
        <Link
          to="/cart"
          className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Cart
        </Link>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || cart.length === 0}
          className={`inline-flex items-center px-6 py-3 rounded-md font-medium text-white transition duration-300 ${
            isSubmitting || cart.length === 0
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Place Order
            </>
          )}
        </button>
      </div>
    </div>
  );
}
