
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, Outlet, NavLink } from "react-router-dom";

// const Dashboard = () => {
//   const { user, fetchUserDetails, logout } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (fetchUserDetails) {
//       fetchUserDetails()
//         .catch(console.error)
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!loading && user?.roles?.includes("ROLE_ADMIN")) {
//       navigate("/admin");
//     }
//   }, [loading, user, navigate]);

//   if (loading) return <div className="flex justify-center items-center h-screen">Loading your dashboard...</div>;

//   if (!user) return <div className="flex justify-center items-center h-screen">Please log in to see your dashboard.</div>;

//   const hasUserRole = user.roles?.includes("ROLE_USER");

//   if (!hasUserRole) {
//     return <div className="flex justify-center items-center h-screen">Access Denied: You do not have permission to view this page.</div>;
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Mobile sidebar backdrop */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         ></div>
//       )}
      
//       {/* Sidebar */}
//       <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out lg:relative`}>
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-semibold">User Dashboard</h2>
//           <p className="text-sm text-gray-600">{user.email}</p>
//         </div>
        
//         <nav className="mt-4">
//           <NavLink 
//             to="profile"
//             className={({isActive}) => `flex items-center px-4 py-3 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
//             onClick={() => setSidebarOpen(false)}
//           >
//             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//             </svg>
//             Profile Information
//           </NavLink>
          
//           <NavLink 
//             to="orders"
//             className={({isActive}) => `flex items-center px-4 py-3 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
//             onClick={() => setSidebarOpen(false)}
//           >
//             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
//             </svg>
//             My Orders
//           </NavLink>
          
//           <NavLink 
//             to="addresses"
//             className={({isActive}) => `flex items-center px-4 py-3 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
//             onClick={() => setSidebarOpen(false)}
//           >
//             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//             </svg>
//             Address Book
//           </NavLink>
          
//           <NavLink 
//             to="wishlist"
//             className={({isActive}) => `flex items-center px-4 py-3 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
//             onClick={() => setSidebarOpen(false)}
//           >
//             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
//             </svg>
//             Wishlist
//           </NavLink>
          
//           <button
//             onClick={logout}
//             className="flex items-center w-full px-4 py-3 text-left text-gray-600 hover:bg-gray-50 mt-4"
//           >
//             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
//             </svg>
//             Logout
//           </button>
//         </nav>
//       </div>
      
//       {/* Main Content */}
//       <div className="flex-1 p-8 overflow-y-auto">
//         {/* Mobile header with hamburger button */}
//         <div className="lg:hidden flex items-center justify-between mb-6">
//           <button 
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
//             </svg>
//           </button>
//           <h1 className="text-xl font-bold ml-4">Dashboard</h1>
//         </div>
        
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold hidden lg:block">Welcome back, {user.fullName || user.email.split('@')[0]}!</h1>
//           <div className="text-sm text-gray-500">Last login: {new Date().toLocaleString()}</div>
//         </div>
        
//         {/* Nested routes will render here */}
//         <Outlet />
        
//         {/* Default content when no nested route is active */}
//         {!window.location.pathname.includes('/dashboard/') && (
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h3 className="font-medium text-blue-800">Recent Orders</h3>
//                 <p className="text-2xl font-bold mt-2">5</p>
//                 <p className="text-sm text-blue-600">View all orders</p>
//               </div>
//               <div className="bg-green-50 p-4 rounded-lg">
//                 <h3 className="font-medium text-green-800">Wishlist Items</h3>
//                 <p className="text-2xl font-bold mt-2">12</p>
//                 <p className="text-sm text-green-600">View wishlist</p>
//               </div>
//               <div className="bg-purple-50 p-4 rounded-lg">
//                 <h3 className="font-medium text-purple-800">Saved Addresses</h3>
//                 <p className="text-2xl font-bold mt-2">2</p>
//                 <p className="text-sm text-purple-600">Manage addresses</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Outlet, NavLink } from "react-router-dom";

const Dashboard = () => {
  const { user, fetchUserDetails, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading your dashboard...</div>;

  if (!user) return <div className="flex justify-center items-center h-screen">Please log in to see your dashboard.</div>;

  const hasUserRole = user.roles?.includes("ROLE_USER");

  if (!hasUserRole) {
    return <div className="flex justify-center items-center h-screen">Access Denied: You do not have permission to view this page.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out lg:relative`}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">User Dashboard</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        
        <nav className="mt-4">
          <NavLink 
            to="profile"
            className={({isActive}) => `flex items-center px-4 py-3 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Profile Information
          </NavLink>
          
          <NavLink 
            to="orders"
            className={({isActive}) => `flex items-center px-4 py-3 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            My Orders
          </NavLink>
          
          <NavLink 
            to="addresses"
            className={({isActive}) => `flex items-center px-4 py-3 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Address Book
          </NavLink>
          
          <NavLink 
            to="wishlist"
            className={({isActive}) => `flex items-center px-4 py-3 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            Wishlist
          </NavLink>
          
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-left text-gray-600 hover:bg-gray-50 mt-4"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Mobile header with hamburger button */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 className="text-xl font-bold ml-4">Dashboard</h1>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold hidden lg:block">Welcome back, {user.fullName || user.email.split('@')[0]}!</h1>
          <div className="text-sm text-gray-500">Last login: {new Date().toLocaleString()}</div>
        </div>
        
        {/* Nested routes will render here */}
        <Outlet />
        
        {/* Default content when no nested route is active */}
        {!window.location.pathname.includes('/dashboard/') && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800">Recent Orders</h3>
                <p className="text-2xl font-bold mt-2">5</p>
                <p className="text-sm text-blue-600">
                  <NavLink to="orders">View all orders</NavLink>
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800">Wishlist Items</h3>
                <p className="text-2xl font-bold mt-2">12</p>
                <p className="text-sm text-green-600">
                  <NavLink to="wishlist">View wishlist</NavLink>
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800">Saved Addresses</h3>
                <p className="text-2xl font-bold mt-2">2</p>
                <p className="text-sm text-purple-600">
                  <NavLink to="addresses">Manage addresses</NavLink>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;