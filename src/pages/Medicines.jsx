
import { useState, useEffect } from 'react';
import { X, ShoppingCart, Info, Star, Clock, Shield, Zap } from 'lucide-react';
import paracetamol from "../assets/images/Paracetamol.jpg";
import ibuprofen from "../assets/images/Ibuprofen.jpg";
import amoxicillin from "../assets/images/Amoxicillin.jpg";
import loratadine from "../assets/images/Loratadine.jpg";
import omeprazole from "../assets/images/Omeprazole.jpg";
import vitaminC from "../assets/images/Vitamin C.jpg";
import aspirin from "../assets/images/Aspirin.jpg";
import cetirizine from "../assets/images/Cetirizine.jpg";
import simvastatin from "../assets/images/Simvastatin.jpg";
import metformin from "../assets/images/Metformin.jpg";
import diphenhydramine from "../assets/images/Diphenhydramine.jpg";
import lansoprazole from "../assets/images/Lansoprazole.jpg";
import vitaminD from "../assets/images/Vitamin D.jpg";
import multivitamin from "../assets/images/Multivitamin.jpg";
import gabapentin from "../assets/images/Gabapentin.jpg";
import tramadol from "../assets/images/Tramadol.jpg";
import ciprofloxacin from "../assets/images/Ciprofloxacin.jpg";
import azithromycin from "../assets/images/Azithromycin.jpg";
import fluoxetine from "../assets/images/Fluoxetine.jpg";
import atorvastatin from "../assets/images/Atorvastatin.jpg";

const Medicines = () => {
  // Complete medicine data with your actual images
  const medicines = [
    {
      id: 1,
      name: "Paracetamol",
      description: "For relief of mild to moderate pain and fever",
      detailedDescription: "Paracetamol is a widely used over-the-counter pain reliever and fever reducer. It works by blocking the production of prostaglandins in the brain that cause pain and fever. Safe for most people when used as directed.",
      price: 30,
      stock: 100,
      image: paracetamol,
      category: "Pain Relief",
      dosage: "500mg tablets",
      manufacturer: "PharmaCorp",
      expiryDate: "2026-12-31",
      sideEffects: ["Nausea", "Stomach upset", "Allergic reactions (rare)"],
      contraindications: ["Liver disease", "Alcohol dependency"],
      rating: 4.5,
      reviews: 1250,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 2,
      name: "Ibuprofen",
      description: "Anti-inflammatory drug used for pain and fever",
      detailedDescription: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) that reduces inflammation, pain, and fever. It works by blocking enzymes that produce prostaglandins, which cause inflammation and pain.",
      price: 49,
      stock: 75,
      image: ibuprofen,
      category: "Pain Relief",
      dosage: "200mg tablets",
      manufacturer: "MediPharm",
      expiryDate: "2026-10-15",
      sideEffects: ["Stomach irritation", "Headache", "Dizziness"],
      contraindications: ["Stomach ulcers", "Heart disease", "Kidney problems"],
      rating: 4.3,
      reviews: 890,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 3,
      name: "Amoxicillin",
      description: "Antibiotic used to treat bacterial infections",
      detailedDescription: "Amoxicillin is a penicillin-type antibiotic that fights bacteria in the body. It's used to treat various bacterial infections including respiratory tract infections, urinary tract infections, and skin infections.",
      price: 129,
      stock: 50,
      image: amoxicillin,
      category: "Antibiotics",
      dosage: "250mg capsules",
      manufacturer: "AntibioTech",
      expiryDate: "2025-08-20",
      sideEffects: ["Diarrhea", "Nausea", "Skin rash"],
      contraindications: ["Penicillin allergy", "Mononucleosis"],
      rating: 4.7,
      reviews: 650,
      fastDelivery: false,
      prescriptionRequired: true
    },
    {
      id: 4,
      name: "Loratadine",
      description: "Antihistamine for allergy relief",
      detailedDescription: "Loratadine is a second-generation antihistamine that provides 24-hour relief from allergy symptoms. It doesn't cause drowsiness like older antihistamines and is effective for seasonal allergies.",
      price: 89,
      stock: 120,
      image: loratadine,
      category: "Allergy",
      dosage: "10mg tablets",
      manufacturer: "AllergyFree",
      expiryDate: "2026-05-12",
      sideEffects: ["Dry mouth", "Fatigue", "Headache"],
      contraindications: ["Liver disease", "Kidney disease"],
      rating: 4.4,
      reviews: 1100,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 5,
      name: "Omeprazole",
      description: "Used to treat acid reflux and heartburn",
      detailedDescription: "Omeprazole is a proton pump inhibitor that reduces the amount of acid produced in the stomach. It's used to treat gastroesophageal reflux disease (GERD), ulcers, and other conditions involving excess stomach acid.",
      price: 99,
      stock: 80,
      image: omeprazole,
      category: "Digestive Health",
      dosage: "20mg capsules",
      manufacturer: "GastroHeal",
      expiryDate: "2026-03-28",
      sideEffects: ["Headache", "Diarrhea", "Abdominal pain"],
      contraindications: ["Liver disease", "Osteoporosis risk"],
      rating: 4.6,
      reviews: 780,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 6,
      name: "Vitamin C",
      description: "Immune system support and antioxidant",
      detailedDescription: "Vitamin C is an essential nutrient that supports immune function, collagen synthesis, and acts as a powerful antioxidant. It helps protect cells from damage and supports wound healing.",
      price: 60,
      stock: 200,
      image: vitaminC,
      category: "Vitamins",
      dosage: "1000mg tablets",
      manufacturer: "VitaBoost",
      expiryDate: "2027-01-15",
      sideEffects: ["Stomach upset", "Diarrhea (high doses)"],
      contraindications: ["Kidney stones history", "Iron overload disorders"],
      rating: 4.2,
      reviews: 2100,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 7,
      name: "Aspirin",
      description: "Pain reliever also used for heart attack prevention",
      detailedDescription: "Aspirin is a nonsteroidal anti-inflammatory drug (NSAID) that reduces pain, fever, and inflammation. It's also commonly used in low doses for cardiovascular protection.",
      price: 45,
      stock: 150,
      image: aspirin,
      category: "Pain Relief",
      dosage: "325mg tablets",
      manufacturer: "CardioMed",
      expiryDate: "2026-09-20",
      sideEffects: ["Stomach irritation", "Bleeding risk", "Tinnitus"],
      contraindications: ["Bleeding disorders", "Stomach ulcers", "Children under 16"],
      rating: 4.1,
      reviews: 950,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 8,
      name: "Cetirizine",
      description: "Antihistamine for allergy symptoms and hives",
      detailedDescription: "Cetirizine is a second-generation antihistamine that provides effective relief from allergic rhinitis, chronic urticaria, and other allergic conditions with minimal sedation.",
      price: 65,
      stock: 90,
      image: cetirizine,
      category: "Allergy",
      dosage: "10mg tablets",
      manufacturer: "AllerStop",
      expiryDate: "2026-11-15",
      sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
      contraindications: ["Severe kidney disease", "Galactose intolerance"],
      rating: 4.4,
      reviews: 720,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 9,
      name: "Simvastatin",
      description: "Lowers cholesterol and reduces risk of heart disease",
      detailedDescription: "Simvastatin is a statin medication that helps lower cholesterol levels and reduce the risk of heart disease and stroke. It works by inhibiting HMG-CoA reductase enzyme.",
      price: 120,
      stock: 60,
      image: simvastatin,
      category: "Cardiovascular",
      dosage: "20mg tablets",
      manufacturer: "HeartCare",
      expiryDate: "2025-12-10",
      sideEffects: ["Muscle pain", "Headache", "Digestive issues"],
      contraindications: ["Liver disease", "Pregnancy", "Muscle disorders"],
      rating: 4.3,
      reviews: 580,
      fastDelivery: false,
      prescriptionRequired: true
    },
    {
      id: 10,
      name: "Metformin",
      description: "First-line medication for type 2 diabetes",
      detailedDescription: "Metformin is the most commonly prescribed medication for type 2 diabetes. It works by reducing glucose production in the liver and improving insulin sensitivity.",
      price: 85,
      stock: 70,
      image: metformin,
      category: "Diabetes",
      dosage: "500mg tablets",
      manufacturer: "DiabetesCare",
      expiryDate: "2026-04-25",
      sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
      contraindications: ["Kidney disease", "Heart failure", "Liver disease"],
      rating: 4.5,
      reviews: 1320,
      fastDelivery: true,
      prescriptionRequired: true
    },
    {
      id: 11,
      name: "Diphenhydramine",
      description: "Antihistamine used for allergies and as a sleep aid",
      detailedDescription: "Diphenhydramine is a first-generation antihistamine that provides relief from allergic reactions and is also used as a sleep aid due to its sedating properties.",
      price: 55,
      stock: 110,
      image: diphenhydramine,
      category: "Allergy",
      dosage: "25mg capsules",
      manufacturer: "SleepWell",
      expiryDate: "2026-07-30",
      sideEffects: ["Drowsiness", "Dry mouth", "Blurred vision"],
      contraindications: ["Glaucoma", "Enlarged prostate", "Asthma"],
      rating: 4.0,
      reviews: 840,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 12,
      name: "Lansoprazole",
      description: "Proton pump inhibitor for acid-related stomach issues",
      detailedDescription: "Lansoprazole is a proton pump inhibitor that reduces stomach acid production. It's used to treat gastroesophageal reflux disease, peptic ulcers, and Zollinger-Ellison syndrome.",
      price: 110,
      stock: 65,
      image: lansoprazole,
      category: "Digestive Health",
      dosage: "30mg capsules",
      manufacturer: "GastroRelief",
      expiryDate: "2026-02-18",
      sideEffects: ["Headache", "Nausea", "Diarrhea"],
      contraindications: ["Liver disease", "Osteoporosis risk", "Vitamin B12 deficiency"],
      rating: 4.4,
      reviews: 690,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 13,
      name: "Vitamin D",
      description: "Essential for bone health and immune function",
      detailedDescription: "Vitamin D is crucial for calcium absorption, bone health, immune function, and muscle strength. It's particularly important for people with limited sun exposure.",
      price: 70,
      stock: 180,
      image: vitaminD,
      category: "Vitamins",
      dosage: "1000 IU tablets",
      manufacturer: "BoneStrong",
      expiryDate: "2027-06-12",
      sideEffects: ["Nausea", "Vomiting", "Kidney stones (high doses)"],
      contraindications: ["Hypercalcemia", "Kidney stones", "Sarcoidosis"],
      rating: 4.3,
      reviews: 1890,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 14,
      name: "Multivitamin",
      description: "Comprehensive daily nutritional supplement",
      detailedDescription: "A complete multivitamin and mineral supplement designed to fill nutritional gaps in your diet and support overall health and wellness.",
      price: 150,
      stock: 95,
      image: multivitamin,
      category: "Vitamins",
      dosage: "Daily tablets",
      manufacturer: "NutriComplete",
      expiryDate: "2027-03-08",
      sideEffects: ["Stomach upset", "Constipation", "Metallic taste"],
      contraindications: ["Iron overload", "Hypervitaminosis", "Kidney disease"],
      rating: 4.2,
      reviews: 2450,
      fastDelivery: true,
      prescriptionRequired: false
    },
    {
      id: 15,
      name: "Gabapentin",
      description: "Used for nerve pain and certain seizure disorders",
      detailedDescription: "Gabapentin is an anticonvulsant medication used to treat neuropathic pain, restless leg syndrome, and as an adjunct therapy for partial seizures.",
      price: 135,
      stock: 40,
      image: gabapentin,
      category: "Neurological",
      dosage: "300mg capsules",
      manufacturer: "NeuroMed",
      expiryDate: "2025-11-22",
      sideEffects: ["Dizziness", "Fatigue", "Weight gain"],
      contraindications: ["Kidney disease", "Depression history", "Respiratory issues"],
      rating: 4.1,
      reviews: 420,
      fastDelivery: false,
      prescriptionRequired: true
    },
    {
      id: 16,
      name: "Tramadol",
      description: "Opioid-like pain reliever for moderate to severe pain",
      detailedDescription: "Tramadol is a centrally acting analgesic used for moderate to severe pain. It works by binding to opioid receptors and inhibiting neurotransmitter reuptake.",
      price: 180,
      stock: 30,
      image: tramadol,
      category: "Pain Relief",
      dosage: "50mg tablets",
      manufacturer: "PainRelief Pro",
      expiryDate: "2025-09-14",
      sideEffects: ["Nausea", "Dizziness", "Constipation"],
      contraindications: ["Respiratory depression", "Seizure disorders", "MAO inhibitor use"],
      rating: 4.0,
      reviews: 310,
      fastDelivery: false,
      prescriptionRequired: true
    },
    {
      id: 17,
      name: "Ciprofloxacin",
      description: "Broad-spectrum antibiotic for bacterial infections",
      detailedDescription: "Ciprofloxacin is a fluoroquinolone antibiotic effective against a wide range of bacterial infections including urinary tract, respiratory, and skin infections.",
      price: 155,
      stock: 45,
      image: ciprofloxacin,
      category: "Antibiotics",
      dosage: "500mg tablets",
      manufacturer: "BacteriaFree",
      expiryDate: "2025-10-07",
      sideEffects: ["Nausea", "Diarrhea", "Tendon pain"],
      contraindications: ["Tendon disorders", "Myasthenia gravis", "Children under 18"],
      rating: 4.2,
      reviews: 380,
      fastDelivery: false,
      prescriptionRequired: true
    },
    {
      id: 18,
      name: "Azithromycin",
      description: "Macrolide antibiotic for bacterial infections",
      detailedDescription: "Azithromycin is a macrolide antibiotic commonly used to treat respiratory tract infections, skin infections, and sexually transmitted diseases.",
      price: 165,
      stock: 55,
      image: azithromycin,
      category: "Antibiotics",
      dosage: "250mg tablets",
      manufacturer: "InfectionFree",
      expiryDate: "2025-12-03",
      sideEffects: ["Nausea", "Diarrhea", "Abdominal pain"],
      contraindications: ["Liver disease", "Heart rhythm disorders", "Myasthenia gravis"],
      rating: 4.4,
      reviews: 520,
      fastDelivery: false,
      prescriptionRequired: true
    },
    {
      id: 19,
      name: "Fluoxetine",
      description: "SSRI antidepressant for depression and anxiety",
      detailedDescription: "Fluoxetine is a selective serotonin reuptake inhibitor (SSRI) used to treat depression, anxiety disorders, obsessive-compulsive disorder, and bulimia nervosa.",
      price: 125,
      stock: 35,
      image: fluoxetine,
      category: "Mental Health",
      dosage: "20mg capsules",
      manufacturer: "MindWell",
      expiryDate: "2026-01-16",
      sideEffects: ["Nausea", "Insomnia", "Sexual dysfunction"],
      contraindications: ["MAO inhibitor use", "Bipolar disorder", "Seizure disorders"],
      rating: 4.1,
      reviews: 680,
      fastDelivery: false,
      prescriptionRequired: true
    },
    {
      id: 20,
      name: "Atorvastatin",
      description: "Lowers cholesterol and prevents cardiovascular events",
      detailedDescription: "Atorvastatin is a high-intensity statin that effectively lowers LDL cholesterol and reduces the risk of heart attack, stroke, and other cardiovascular events.",
      price: 140,
      stock: 50,
      image: atorvastatin,
      category: "Cardiovascular",
      dosage: "40mg tablets",
      manufacturer: "HeartGuard",
      expiryDate: "2026-08-09",
      sideEffects: ["Muscle pain", "Liver enzyme elevation", "Digestive issues"],
      contraindications: ["Active liver disease", "Pregnancy", "Muscle disorders"],
      rating: 4.3,
      reviews: 920,
      fastDelivery: false,
      prescriptionRequired: true
    }
  ];

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [medicinesPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter medicines
  const filteredMedicines = medicines.filter(medicine => {
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

  const categories = ["Pain Relief", "Antibiotics", "Allergy", "Digestive Health", "Vitamins", "Cardiovascular", "Diabetes", "Neurological", "Mental Health"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Premium Medicines
          </h1>
          <p className="text-xl opacity-90 animate-fade-in-delay">
            Your trusted source for quality healthcare products
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
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {medicine.fastDelivery && (
                    <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      <Zap className="w-3 h-3" />
                      Fast Delivery
                    </span>
                  )}
                  {medicine.prescriptionRequired && (
                    <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      <Shield className="w-3 h-3" />
                      Prescription
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {medicine.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {medicine.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{medicine.rating}</span>
                  </div>
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

                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Add to Cart
                  </button>
                  <button
                    className="bg-gray-100 text-gray-600 py-2 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(medicine);
                    }}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
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
                        src={selectedMedicine.image}
                        alt={selectedMedicine.name}
                        className="w-full h-64 object-cover rounded-lg"
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
                        <span className="font-semibold text-gray-700">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{selectedMedicine.rating}</span>
                          <span className="text-gray-500">({selectedMedicine.reviews} reviews)</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700">Dosage</span>
                        <p className="font-semibold">{selectedMedicine.dosage}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Detailed Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed">{selectedMedicine.detailedDescription}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Manufacturer</h3>
                      <p className="text-gray-600">{selectedMedicine.manufacturer}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Expiry Date</h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedMedicine.expiryDate}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Side Effects</h3>
                      <ul className="text-gray-600 space-y-1">
                        {selectedMedicine.sideEffects.map((effect, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Contraindications</h3>
                      <ul className="text-gray-600 space-y-1">
                        {selectedMedicine.contraindications.map((contra, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                            {contra}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-4 mt-8 pt-6 border-t">
                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-semibold">
                    <ShoppingCart className="w-5 h-5 inline mr-2" />
                    Add to Cart - Rs {selectedMedicine.price}
                  </button>
                  <button 
                    onClick={closeModal}
                    className="bg-gray-100 text-gray-600 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Medicines;