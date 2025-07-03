// PublicMedicines.jsx
import { useState, useEffect } from 'react';
import { Eye, Star, ShoppingCart, Info, X, Clock, Zap, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PublicMedicines = ({ medicines }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [medicinesPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkMode } = useTheme();



const filteredMedicines = (medicines || []).filter(medicine => {
            const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;

});

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Calculate pagination
  const indexOfLastMedicine = currentPage * medicinesPerPage;
  const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage;
  const currentMedicines = filteredMedicines.slice(indexOfFirstMedicine, indexOfLastMedicine);
  const totalPages = Math.ceil(filteredMedicines.length / medicinesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMedicine(null), 300);
  };

const categories = [...new Set(medicines?.map(m => m.category) || [])];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Our Medicine Catalog
          </h1>
          <p className="text-xl opacity-90 animate-fade-in-delay">
            Browse our collection of quality healthcare products
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search medicines..."
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Showing {currentMedicines.length} of {filteredMedicines.length} medicines
          </p>
        </div>

        {/* No Results Message */}
        {filteredMedicines.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-xl mb-2">No medicines found</p>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Medicine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentMedicines.map((medicine, index) => (
            <div
              key={medicine.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => openModal(medicine)}
            >
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={medicine.imageUrl || 'https://via.placeholder.com/300'}
                  alt={medicine.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {medicine.stock > 10 && (
                    <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      <Zap className="w-3 h-3" />
                      Available
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {medicine.category || 'General'}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {medicine.name}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {medicine.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    Rs {medicine.price.toFixed(2)}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    medicine.stock > 50
                      ? "bg-green-100 text-green-800"
                      : medicine.stock > 10
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {medicine.stock > 0 ? `${medicine.stock} in stock` : "Out of stock"}
                  </span>
                </div>

                <button
                  className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(medicine);
                  }}
                >
                  <Info className="w-4 h-4 inline mr-2" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredMedicines.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-blue-50'
                } transition-colors duration-200`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 ${
                    currentPage === number
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-50'
                  } transition-colors duration-200`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-blue-50'
                } transition-colors duration-200`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="relative">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">{selectedMedicine.name}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Image and Basic Info */}
                  <div>
                    <div className="bg-gray-100 rounded-xl p-4 mb-6">
                      <img
                        src={selectedMedicine.imageUrl || 'https://via.placeholder.com/300'}
                        alt={selectedMedicine.name}
                        className="w-full h-64 object-contain rounded-lg"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700">Price</span>
                        <p className="text-2xl font-bold text-blue-600">Rs {selectedMedicine.price}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700">Stock</span>
                        <p className="text-lg font-semibold text-green-600">{selectedMedicine.stock} available</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700">Dosage</span>
                        <p className="font-semibold">{selectedMedicine.dosage || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700">Status</span>
                        <p className={`font-semibold ${
                          selectedMedicine.status === 'ACTIVE' ? 'text-green-600' :
                          selectedMedicine.status === 'INACTIVE' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {selectedMedicine.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Detailed Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed">{selectedMedicine.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Expiry Date</h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedMedicine.expiryDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-4 mt-8 pt-6 border-t">
                  <button 
                    onClick={closeModal}
                    className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMedicines;