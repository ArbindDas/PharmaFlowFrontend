import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';
// import Loader from '../components/Loader';
// import OrderCard from '../components/OrderCard';
// import Loader from './Loader'; // Make sure to import your Loader component
import LoadingSpinner from '../components/LoadingSpinner';


export default function OrderHistory() {
  const { isDarkMode } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [logout, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-red-50'} text-center`}>
        <p className={isDarkMode ? 'text-red-400' : 'text-red-600'}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={`mt-2 px-4 py-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Your Orders
      </h1>
      
      {orders.length === 0 ? (
        <div className={`p-8 text-center rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            You haven't placed any orders yet.
          </p>
          <Link 
            to="/medicine" 
            className={`inline-block mt-4 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link 
              to={`/dashboard/orders/${order.id}`} 
              key={order.id}
              className={`block p-4 rounded-lg transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Order #{order.id}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(order.status, isDarkMode)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function
function getStatusColor(status, isDarkMode) {
  const base = isDarkMode ? 'dark:' : '';
  switch (status) {
    case 'PENDING': return `${base}bg-yellow-900/20 ${base}text-yellow-400`;
    case 'COMPLETED': return `${base}bg-green-900/20 ${base}text-green-400`;
    case 'CANCELLED': return `${base}bg-red-900/20 ${base}text-red-400`;
    case 'SHIPPED': return `${base}bg-blue-900/20 ${base}text-blue-400`;
    default: return `${base}bg-gray-900/20 ${base}text-gray-400`;
  }
}