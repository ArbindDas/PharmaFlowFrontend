import React, { useState } from 'react';

const UserAddresses = () => {
  // Mock addresses - replace with real data from your API
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      isDefault: true,
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      name: 'John Doe',
      street: '456 Second Ave',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      country: 'USA',
      isDefault: false,
      phone: '+1 (555) 987-6543'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    phone: '',
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const updatedAddresses = [...addresses];
    
    if (newAddress.isDefault) {
      updatedAddresses.forEach(addr => addr.isDefault = false);
    }
    
    updatedAddresses.push({
      ...newAddress,
      id: Date.now() // Temporary ID
    });
    
    setAddresses(updatedAddresses);
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
      phone: '',
      isDefault: false
    });
    setShowAddForm(false);
  };

  const setAsDefault = (id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updatedAddresses);
  };

  const deleteAddress = (id) => {
    if (addresses.length <= 1) {
      alert('You must have at least one address');
      return;
    }
    
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Address
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Add New Address</h3>
          <form onSubmit={handleAddAddress}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newAddress.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  name="zip"
                  value={newAddress.zip}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Country</label>
                <select
                  name="country"
                  value={newAddress.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                  <option value="UK">United Kingdom</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleInputChange}
                  id="defaultAddress"
                  className="mr-2"
                />
                <label htmlFor="defaultAddress">Set as default address</label>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-gray-500">You haven't saved any addresses yet.</p>
        ) : (
          addresses.map(address => (
            <div key={address.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{address.name}</h3>
                  <p className="text-gray-600">{address.street}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                  <p className="text-gray-600 mt-2">Phone: {address.phone}</p>
                </div>
                {address.isDefault && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Default
                  </span>
                )}
              </div>
              <div className="flex space-x-3 mt-4">
                {!address.isDefault && (
                  <button
                    onClick={() => setAsDefault(address.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => deleteAddress(address.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserAddresses;