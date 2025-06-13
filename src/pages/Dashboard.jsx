import React, { useEffect, useState  , useRef} from "react";
import { useAuth } from "../context/AuthContext";


const Dashboard = () => {
  const { user, fetchUserDetails, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchUserDetails) {
      fetchUserDetails()
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  

  if (loading) return <div>Loading your dashboard...</div>;

  if (!user) return <div>Please log in to see your dashboard.</div>;

  return (
    <div>
      <h1>Welcome, {user.fullName || user.email}!</h1>
      <p>Email: {user.email}</p>
      <p>password: {user.roles}</p>

      {/* other user details */}

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
