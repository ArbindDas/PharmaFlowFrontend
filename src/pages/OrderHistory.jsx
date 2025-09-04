import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Info,
  ExternalLink,
  CreditCard,
  MapPin,
  Calendar,
  Download,
  Printer,
  ThumbsUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const OrderHistory = () => {
  const { isAuthenticated, user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const receiptRef = useRef();

  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/orders" } });
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/orders/history",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load orders");
        if (err.message.includes("401")) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  // Order status styling
  const getStatusDetails = (status) => {
    const statusMap = {
      PENDING: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        icon: <Clock className="w-4 h-4" />,
        text: "Processing",
      },
      PLACED: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        icon: <Package className="w-4 h-4" />,
        text: "Placed",
      },


      COMPLETED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        icon: <CheckCircle className="w-4 h-4" />,
        text: "Completed",
      },

      DELIVERED: {
        color:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
        icon: <Package className="w-4 h-4" />,
        text: "Delivered",
      },

      APPROVED :{
          color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                  icon: <ThumbsUp className="w-4 h-4" />,
                  text: "Approved",
      },

      CANCELLED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        icon: <XCircle className="w-4 h-4" />,
        text: "Cancelled",
      },
      SHIPPED: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
        icon: <Truck className="w-4 h-4" />,
        text: "Shipped",
      },
    };


    return (
      statusMap[status?.toUpperCase()] || {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        icon: <AlertCircle className="w-4 h-4" />,
        text: "Unknown",
      }
    );
  };

  // Date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  // Order expansion handlers
  const handleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // PDF generation functions
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `,
  });

  const generatePDF = async () => {
    if (!receiptRef.current) return;

    try {
      // Create a clone of the receipt node to avoid any potential styling issues
      const receiptNode = receiptRef.current.cloneNode(true);
      receiptNode.style.visibility = "visible";
      receiptNode.style.position = "absolute";
      receiptNode.style.left = "-9999px";
      document.body.appendChild(receiptNode);

      // Additional html2canvas configuration options
      const canvas = await html2canvas(receiptNode, {
        scale: 2,
        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
        logging: true, // Enable logging to help debug
        useCORS: true, // Enable cross-origin images
        allowTaint: true, // Allow tainted canvas
        scrollX: 0,
        scrollY: 0,
        windowWidth: receiptNode.scrollWidth,
        windowHeight: receiptNode.scrollHeight,
      });

      // Remove the cloned node
      document.body.removeChild(receiptNode);

      // Verify the canvas has content
      if (!canvas) throw new Error("Canvas generation failed");

      // Convert to data URL with quality check
      const imgData = canvas.toDataURL("image/png", 1.0);
      if (!imgData || imgData.length < 100) {
        // Simple check for valid data
        throw new Error("Generated image data is incomplete");
      }

      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions to fit A4 page with margins
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // 10mm margin
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);

      // Save the PDF
      pdf.save(`receipt-${selectedOrder.orderId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Failed to generate PDF. Please try again or use the print option."
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`mt-4 text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Loading your orders...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
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
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className={`mt-6 px-6 py-2 rounded-lg font-medium ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
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
            className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>
          <motion.div whileHover={{ scale: 1.02 }}>
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
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Main render
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } pb-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full mr-4 ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            data-tooltip-id="back-tooltip"
            data-tooltip-content="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <Tooltip id="back-tooltip" />
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Orders
          </h1>
          <span
            className={`ml-4 px-3 py-1 rounded-full text-sm ${
              isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              isDarkMode={isDarkMode}
              isExpanded={expandedOrder === order.orderId}
              onExpand={handleExpandOrder}
              onViewDetails={handleViewOrderDetails}
              getStatusDetails={getStatusDetails}
              formatDate={formatDate}
              formatShortDate={formatShortDate}
              user={user}
            />
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        order={selectedOrder}
        user={user}
        isDarkMode={isDarkMode}
        getStatusDetails={getStatusDetails}
        formatDate={formatDate}
        receiptRef={receiptRef}
        onPrint={handlePrint}
        onDownloadPDF={generatePDF}
      />
    </div>
  );
};

// Order Card Component
const OrderCard = ({
  order,
  isDarkMode,
  isExpanded,
  onExpand,
  onViewDetails,
  getStatusDetails,
  formatDate,
  formatShortDate,
  user,
}) => {
  const status = getStatusDetails(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-200 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`p-6 cursor-pointer ${isExpanded ? "border-b" : ""} ${
          isDarkMode
            ? "border-gray-700 hover:bg-gray-700/50"
            : "border-gray-200 hover:bg-gray-50"
        }`}
        onClick={() => onExpand(order.orderId)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center space-x-4">
              <motion.span
                whileHover={{ scale: 1.03 }}
                className={`text-sm font-medium px-3 py-1 rounded-full ${status.color} flex items-center`}
                data-tooltip-id={`status-tooltip-${order.orderId}`}
                data-tooltip-content={order.status}
              >
                {status.icon}
                <span className="ml-1.5">{status.text}</span>
              </motion.span>
              <Tooltip id={`status-tooltip-${order.orderId}`} />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Order #{order.orderId}
              </span>
            </div>
            <h3
              className={`mt-2 text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {order.items?.length || 0} item
              {order.items?.length !== 1 ? "s" : ""}
            </h3>
            <div className="flex items-center mt-1 space-x-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formatShortDate(order.orderDate)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:block">
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
                {formatDate(order.orderDate)}
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
                ${order.totalPrice?.toFixed(2) || "0.00"}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <ChevronRight
                className={`w-5 h-5 transition-transform duration-200 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <OrderExpandedDetails
            order={order}
            isDarkMode={isDarkMode}
            onViewDetails={onViewDetails}
            user={user}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Order Expanded Details Component
const OrderExpandedDetails = ({ order, isDarkMode, onViewDetails, user }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.2 }}
    className={`${isDarkMode ? "bg-gray-700/30" : "bg-gray-50"}`}
  >
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h4
          className={`font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Order Details
        </h4>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewDetails(order)}
          className={`flex items-center text-sm px-3 py-1.5 rounded-md ${
            isDarkMode
              ? "bg-gray-600 hover:bg-gray-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          <Info className="w-4 h-4 mr-1" />
          View Details
        </motion.button>
      </div>

      <div className="space-y-4">
        {order.items?.length > 0 ? (
          order.items.map((item) => (
            <motion.div
              key={`${order.orderId}-${item.medicineId}`}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              } border ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
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
                      {item.medicineName || "Medicine"}
                    </h5>
                    <p
                      className={`font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${item.unitPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Quantity: {item.quantity || 0}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Subtotal: ${(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-white"
            } border ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
          >
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              No items found for this order
            </p>
          </div>
        )}
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
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                >
                  Subtotal
                </span>
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${order.totalPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
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
                  ${order.totalPrice?.toFixed(2)}
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
              } border ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
            >
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mt-0.5 mr-2 text-blue-500" />
                <div>
                  <p className={isDarkMode ? "text-white" : "text-gray-900"}>
                    {user?.full_name || "Your Name"}
                  </p>
                  <p
                    className={`mt-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <span>Email:</span> {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Order Modal Component
const OrderModal = ({
  isOpen,
  onClose,
  order,
  user,
  isDarkMode,
  getStatusDetails,
  formatDate,
  receiptRef,
  onPrint,
  onDownloadPDF,
}) => {
  if (!isOpen || !order) return null;

  const status = getStatusDetails(order.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Order #{order.orderId}
                  </h2>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${status.color} flex items-center`}
                    >
                      {status.icon}
                      <span className="ml-1.5">{status.text}</span>
                    </span>
                    <span
                      className={`ml-3 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {formatDate(order.orderDate)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Items Ordered
                  </h3>
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div
                        key={item.medicineId}
                        className={`p-4 rounded-lg ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
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
                              <h4
                                className={`font-medium ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {item.medicineName}
                              </h4>
                              <p
                                className={`font-medium ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                ${item.unitPrice?.toFixed(2)}
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
                              {(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Payment Information
                    </h3>
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      } border ${
                        isDarkMode ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
                        <span
                          className={
                            isDarkMode ? "text-white" : "text-gray-900"
                          }
                        >
                          Credit Card ending in •••• 4242
                        </span>
                      </div>
                      <div className="mt-4">
                        <h4
                          className={`font-medium mb-2 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Order Summary
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }
                            >
                              Subtotal
                            </span>
                            <span
                              className={
                                isDarkMode ? "text-white" : "text-gray-900"
                              }
                            >
                              ${order.totalPrice?.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }
                            >
                              Shipping
                            </span>
                            <span
                              className={
                                isDarkMode ? "text-white" : "text-gray-900"
                              }
                            >
                              $0.00
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
                              ${order.totalPrice?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Shipping Information
                    </h3>
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      } border ${
                        isDarkMode ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 mt-0.5 mr-2 text-blue-500" />
                        <div>
                          <p
                            className={
                              isDarkMode ? "text-white" : "text-gray-900"
                            }
                          >
                            {user?.fullName || "Your Name"}
                          </p>
                          <p
                            className={`mt-1 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {user?.email || "user@example.com"}
                          </p>
                          <p
                            className={`mt-2 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Boudha Marg, Apt 4B
                          </p>
                          <p
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            Kathmandu
                          </p>
                          <p
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            Nepal
                          </p>
                          <p
                            className={`mt-2 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Phone: +977 1 5123456
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden receipt for printing */}
              <div className="hidden">
                <div
                  ref={receiptRef}
                  className={`receipt-container p-6 ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  style={{ width: "210mm", minHeight: "297mm" }}
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                      Pharmacy Receipt
                    </h1>
                    <p className="text-sm opacity-75">
                      Thank you for your purchase!
                    </p>
                  </div>

                  <div className="flex justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Order Details
                      </h2>
                      <p className="text-sm">Order #: {order.orderId}</p>
                      <p className="text-sm">
                        Date: {formatDate(order.orderDate)}
                      </p>
                      <div className="flex items-center mt-2">
                        <span
                          className={`text-sm font-medium px-2 py-0.5 rounded-full ${status.color} flex items-center`}
                        >
                          {status.icon}
                          <span className="ml-1">{status.text}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <h2 className="text-xl font-semibold mb-2">Customer</h2>
                      <p className="text-sm">
                        {user?.full_name || "Customer Name"}
                      </p>
                      <p className="text-sm">
                        {user?.email || "customer@example.com"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      Items
                    </h2>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2">Item</th>
                          <th className="text-right pb-2">Price</th>
                          <th className="text-right pb-2">Qty</th>
                          <th className="text-right pb-2">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items?.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3">{item.medicineName}</td>
                            <td className="text-right">
                              ${item.unitPrice?.toFixed(2)}
                            </td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      Summary
                    </h2>
                    <div className="flex justify-end">
                      <div className="w-64">
                        <div className="flex justify-between mb-2">
                          <span>Subtotal:</span>
                          <span>${order.totalPrice?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Shipping:</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total:</span>
                          <span>${order.totalPrice?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      Payment
                    </h2>
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      <span>Credit Card ending in •••• 4242</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      Shipping Address
                    </h2>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mt-0.5 mr-2" />
                      <div>
                        <p>{user?.full_name || "Customer Name"}</p>
                        <p>Boudha Marg, Apt 4B</p>
                        <p>Kathmandu</p>
                        <p>Nepal</p>
                        <p className="mt-2">Phone: +977 1 5123456</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm opacity-75 mt-12">
                    <p>Thank you for shopping with us!</p>
                    <p className="mt-1">
                      For any questions, please contact support@pharmacy.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDownloadPDF}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                    isDarkMode
                      ? "bg-gray-600 hover:bg-gray-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onPrint}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderHistory;
