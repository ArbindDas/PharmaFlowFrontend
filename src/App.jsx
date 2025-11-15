import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import NotFound from "./pages/NotFound";
import LoginPage from "./features/auth/Login.jsx";
import RegisterPage from "./features/auth/Register";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import ForgotPassword from "./components/ForgotPassword.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import PublicMedicines from "./components/PublicMedicines.jsx";
import OpenAIPage from "./pages/openAIPage.jsx";
// import Test from "./components/Test.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { App as AntApp } from "antd";
import Cart from "./pages/Cart.jsx";
import DashboardDefaultContent from "./components/DashboardDefaultContent.jsx";
import ProfileInfo from "./pages/ ProfileInfo.jsx";
import UserAddresses from "./pages/UserAddresses.jsx";
// import UserOrders from "./pages/UserOrders.jsx";
import Wishlist from "./pages/ Wishlist.jsx";
import { FirebaseCartProvider } from "./context/FirebaseCartContext.jsx";
import Orders from "./pages/Orders.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import { PlaceOrder } from "./pages/PlaceOrder.jsx";
import { OrderDetail } from "./pages/OrderDetail.jsx";
import OAuthSuccessHandler from "./components/OAuthSuccessHandler";

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === "/dashboard";

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medicine" element={<PublicMedicines />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/openAI" element={<OpenAIPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/test" element={<Test />} /> */}
          // ✅ CORRECT - Use JSX component syntax
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/oauth-success" element={<OAuthSuccessHandler />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardDefaultContent />} />
            <Route path="profile" element={<ProfileInfo />} />

            {/* Order-related routes */}
            <Route path="orders">
              <Route index element={<OrderHistory />} />
              <Route path="new" element={<PlaceOrder />} />
              <Route path=":orderId" element={<OrderDetail />} />
            </Route>
          </Route>
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AntApp>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <AppContent />
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </AntApp>
  );
}

export default App;

{
  /* Order-related routes */
}
{
  /* <Route path="orders">
              <Route index element={<OrderHistory />} /> // GET
              /dashboard/orders
              <Route path="new" element={<PlaceOrder />} /> // POST
              /dashboard/orders/new
              <Route path=":orderId" element={<OrderDetail />} /> // GET
              /dashboard/orders/123
            </Route> */
}
