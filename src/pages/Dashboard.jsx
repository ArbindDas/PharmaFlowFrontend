
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, fetchUserDetails, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchUserDetails) {
      fetchUserDetails()
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (!loading && user?.roles?.includes("ROLE_ADMIN")) {
      navigate("/admin");
    }
  }, [loading, user, navigate]);

  if (loading) return <div>Loading your dashboard...</div>;

  if (!user) return <div>Please log in to see your dashboard.</div>;

  const hasUserRole = user.roles?.includes("ROLE_USER");

  if (!hasUserRole) {
    return <div>Access Denied: You do not have permission to view this page.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.fullName || user.email}!</h1>
      <p>Email: {user.email}</p>
      <p>Roles: {user.roles?.join(", ")}</p>

      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;



