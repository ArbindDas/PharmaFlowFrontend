

import React from 'react';

const DashboardDefaultContent = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800">Recent Orders</h3>
          <p className="text-2xl font-bold mt-2">5</p>
          <p className="text-sm text-blue-600">View all orders</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-800">Wishlist Items</h3>
          <p className="text-2xl font-bold mt-2">12</p>
          <p className="text-sm text-green-600">View wishlist</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-800">Saved Addresses</h3>
          <p className="text-2xl font-bold mt-2">2</p>
          <p className="text-sm text-purple-600">Manage addresses</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardDefaultContent;