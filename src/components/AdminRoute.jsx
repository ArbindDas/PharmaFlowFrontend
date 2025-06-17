


import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // 1. Still loading user info (add `loading` in context)
  if (loading) {
    return <div>Loading...</div>;
  }

  // 2. Not authenticated at all
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Authenticated but not an admin
  if (!user.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/login" replace />;
  }

  // 4. Authenticated and has ADMIN role
  return children;
};

export default AdminRoute;
