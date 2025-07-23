import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import "../styles/animations.css";

function Orders() {
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Page is visible (tab is active)");
        // Perform actions when page becomes visible
      } else {
        console.log("Page is hidden (tab is inactive)");
        // Perform actions when page becomes hidden
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/orders" } });
      return;
    }
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:8080/api/orders", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          redirect: "manual", // Prevent automatic redirects
        });

        // Handle 3xx redirects manually
        if (response.status >= 300 && response.status < 400) {
          navigate("/login");
          return;
        }

        // First read the response as text
        const responseText = await response.text();

        // Try to parse as JSON
        try {
          const data = responseText ? JSON.parse(responseText) : [];
          if (!response.ok) {
            throw new Error(
              data.message || `HTTP error! status: ${response.status}`
            );
          }
          setOrders(data);
          setError(null);
        } catch (jsonError) {
          // If parsing fails, check if it's HTML
          if (
            responseText.startsWith("<!DOCTYPE html>") ||
            responseText.startsWith("<html")
          ) {
            console.error(
              "Received HTML instead of JSON:",
              responseText.substring(0, 100)
            );
            navigate("/login");
          } else {
            console.error("Invalid JSON:", responseText);
            throw new Error("Server returned malformed JSON");
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load orders");

        // Handle specific error cases
        if (
          err.message.includes("401") ||
          err.message.includes("Unauthorized") ||
          err.message.includes("token")
        ) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const getStatusDetails = (status) => {
    switch (status) {
      case "PENDING":
        return {
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
          icon: <Clock className="w-4 h-4" />,
          text: "Processing",
        };
      case "COMPLETED":
        return {
          color:
            "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
          icon: <CheckCircle className="w-4 h-4" />,
          text: "Completed",
        };
      case "CANCELLED":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
          icon: <XCircle className="w-4 h-4" />,
          text: "Cancelled",
        };
      case "SHIPPED":
        return {
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
          icon: <Truck className="w-4 h-4" />,
          text: "Shipped",
        };
      default:
        return {
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
          icon: <AlertCircle className="w-4 h-4" />,
          text: "Unknown",
        };
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p
            className={`mt-4 text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`p-8 rounded-xl text-center max-w-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <h2
            className={`text-xl font-bold mt-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Error Loading Orders
          </h2>
          <p
            className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`mt-6 px-6 py-2 rounded-lg font-medium ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } pb-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full mr-4 ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <div
            className={`rounded-xl p-8 text-center ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow`}
          >
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Package className="w-12 h-12 text-blue-500 dark:text-blue-400" />
            </div>
            <h3
              className={`text-xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No Orders Yet
            </h3>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Link
              to="/medicine"
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Browse Medicines
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`rounded-xl overflow-hidden shadow transition-all duration-200 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div
                  className={`p-6 cursor-pointer ${
                    expandedOrder === order.id ? "border-b" : ""
                  } ${
                    isDarkMode
                      ? "border-gray-700 hover:bg-gray-700/50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id
                    )
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center space-x-4">
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                            getStatusDetails(order.status).color
                          } flex items-center`}
                        >
                          {getStatusDetails(order.status).icon}
                          <span className="ml-1.5">
                            {getStatusDetails(order.status).text}
                          </span>
                        </span>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Order #{order.id}
                        </span>
                      </div>
                      <h3
                        className={`mt-2 text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {order.orderItemsList.length} item
                        {order.orderItemsList.length !== 1 ? "s" : ""}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Order Date
                        </p>
                        <p
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Total
                        </p>
                        <p
                          className={`font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedOrder === order.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div
                    className={`p-6 ${
                      isDarkMode ? "bg-gray-700/30" : "bg-gray-50"
                    }`}
                  >
                    <h4
                      className={`font-medium mb-4 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Order Details
                    </h4>
                    <div className="space-y-4">
                      {order.orderItemsList.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg ${
                            isDarkMode ? "bg-gray-700" : "bg-white"
                          } border ${
                            isDarkMode ? "border-gray-600" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start">
                            <div
                              className={`w-16 h-16 rounded-md ${
                                isDarkMode ? "bg-gray-600" : "bg-gray-100"
                              } flex items-center justify-center flex-shrink-0`}
                            >
                              <Package className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <h5
                                  className={`font-medium ${
                                    isDarkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {item.medicine?.name || "Medicine"}
                                </h5>
                                <p
                                  className={`font-medium ${
                                    isDarkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  ${item.unitPrice.toFixed(2)}
                                </p>
                              </div>
                              <p
                                className={`text-sm mt-1 ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Quantity: {item.quantity}
                              </p>
                              <p
                                className={`text-sm mt-1 ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Subtotal: $
                                {(
                                  item.unitPrice * parseInt(item.quantity)
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`mt-6 pt-6 border-t ${
                        isDarkMode ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5
                            className={`font-medium mb-3 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Order Summary
                          </h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span
                                className={`${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Subtotal
                              </span>
                              <span
                                className={`font-medium ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                ${(order.totalPrice * 0.9).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span
                                className={`${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Shipping
                              </span>
                              <span
                                className={`font-medium ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                $0.00
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span
                                className={`${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Discount
                              </span>
                              <span
                                className={`font-medium text-green-600 dark:text-green-400`}
                              >
                                -${(order.totalPrice * 0.1).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-dashed border-gray-300 dark:border-gray-600">
                              <span
                                className={`font-medium ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                Total
                              </span>
                              <span
                                className={`font-bold ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                ${order.totalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5
                            className={`font-medium mb-3 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Shipping Information
                          </h5>
                          <div
                            className={`p-4 rounded-lg ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-50"
                            } border ${
                              isDarkMode ? "border-gray-600" : "border-gray-200"
                            }`}
                          >
                            <p
                              className={`${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {order.user?.name || "Your Name"}
                            </p>
                            <p
                              className={`mt-1 ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {order.user?.address ||
                                "123 Main St, City, Country"}
                            </p>
                            <p
                              className={`mt-1 ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {order.user?.phone || "+1 (555) 123-4567"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;

