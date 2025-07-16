import React, { useState } from 'react';

const Wishlist = () => {
  // Mock wishlist items - replace with real data from your API
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      productId: 'P1001',
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://via.placeholder.com/80',
      inStock: true
    },
    {
      id: 2,
      productId: 'P1002',
      name: 'Smart Watch',
      price: 199.99,
      image: 'https://via.placeholder.com/80',
      inStock: false
    },
    {
      id: 3,
      productId: 'P1003',
      name: 'Bluetooth Speaker',
      price: 59.99,
      image: 'https://via.placeholder.com/80',
      inStock: true
    }
  ]);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const moveAllToCart = () => {
    // Implement your "Move all to cart" logic here
    alert('Moving all available items to cart');
    const inStockItems = wishlist.filter(item => item.inStock);
    setWishlist(wishlist.filter(item => !item.inStock));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Wishlist</h2>
        {wishlist.some(item => item.inStock) && (
          <button 
            onClick={moveAllToCart}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Move All Available to Cart
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="divide-y">
          {wishlist.map(item => (
            <div key={item.id} className="py-4 flex flex-col md:flex-row">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-lg font-semibold text-gray-800 my-1">${item.price.toFixed(2)}</p>
                <p className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 mt-4 md:mt-0">
                {item.inStock && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                    Add to Cart
                  </button>
                )}
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;