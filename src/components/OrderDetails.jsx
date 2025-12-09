import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ClipboardList,
  CreditCard,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Home,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
  Download,
  Filter,
  Search,
  ArrowUpDown,
} from "lucide-react";

import { Banknote } from "lucide-react";


const OrderDetails = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:8080/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching orders:", err);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      CONFIRMED: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      SHIPPED: { color: "bg-purple-100 text-purple-800", icon: Truck },
      DELIVERED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle },
    };
    
    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", icon: Clock };
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getPaymentBadge = (paymentMethod, paymentStatus) => {
    const isCOD = paymentMethod === "cod";
    const isPaid = paymentStatus === "completed";
    
    if (isCOD) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <Banknote className="w-3 h-3 mr-1" />
          COD - Pending
        </span>
      );
    } else {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          <CreditCard className="w-3 h-3 mr-1" />
          {isPaid ? "Card - Paid" : "Card - Failed"}
        </span>
      );
    }
  };

  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filter !== "all" && order.status !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id?.toString().includes(searchLower) ||
        order.userName?.toLowerCase().includes(searchLower) ||
        order.paymentMethod?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.paymentDetails?.status === "completed" || order.paymentMethod === "cod") {
      return sum + (order.totalPrice || 0);
    }
    return sum;
  }, 0);

  const codOrders = orders.filter(order => order.paymentMethod === "cod").length;
  const cardOrders = orders.filter(order => order.paymentMethod === "credit_card").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 shadow">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Orders</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders & Payments</h1>
              <p className="text-gray-600">Manage all customer orders and payments</p>
            </div>
            <button
              onClick={fetchOrders}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">Rs{totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <ClipboardList className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">COD Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{codOrders}</p>
                </div>
                <Cash className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Card Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{cardOrders}</p>
                </div>
                <CreditCard className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl p-6 shadow border mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-gray-900">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium">{order.userName || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-bold text-gray-900">Rs{order.totalPrice?.toFixed(2) || "0.00"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentBadge(order.paymentMethod, order.paymentDetails?.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailsModal(true);
                        }}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500">No orders found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  Order Details - #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Name:</span> {selectedOrder.userName || "N/A"}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedOrder.users?.email || "N/A"}</p>
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Method:</span> 
                      <span className="ml-2 font-medium">
                        {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Credit/Debit Card"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${selectedOrder.paymentDetails?.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {selectedOrder.paymentDetails?.status || "pending"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-bold">Rs{selectedOrder.totalPrice?.toFixed(2)}</span>
                    </p>
                    {selectedOrder.paymentDetails?.transactionId && (
                      <p className="break-all">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="ml-2 font-mono text-sm">{selectedOrder.paymentDetails.transactionId}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Items
                </h4>
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Medicine</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Unit Price</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.orderItemsList?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <p className="font-medium text-gray-900">{item.medicine?.name || "Unknown"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-900">{item.quantity}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-900">Rs{item.unitPrice?.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-900">
                              Rs{((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-right font-semibold">Total:</td>
                        <td className="px-6 py-4 font-bold text-lg text-gray-900">
                          Rs{selectedOrder.totalPrice?.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;