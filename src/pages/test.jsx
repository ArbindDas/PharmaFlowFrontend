import React, { useState } from 'react';
import { Plus, Eye, Edit, Settings, Search, Filter, X, Check, Shield, Heart, Users, TrendingUp, Star, ChevronDown, Sparkles } from 'lucide-react';

// Animated Card Component
const AnimatedCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

// Action Button Component
const ActionButton = ({ icon: Icon, variant = "primary", tooltip }) => {
  const baseClasses = "p-2 rounded-lg transition-all duration-200 hover:scale-110";
  const variantClasses = variant === "primary" 
    ? "bg-sky-100 text-sky-600 hover:bg-sky-200" 
    : "bg-gray-100 text-gray-600 hover:bg-gray-200";
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses}`}
      title={tooltip}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

// Plan Badge Component
const PlanBadge = ({ type, color }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${color} shadow-sm`}>
      {type}
    </span>
  );
};

// Benefit Item Component
const BenefitItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <Icon className="w-4 h-4 text-teal-500 flex-shrink-0" />
    <span>{text}</span>
  </div>
);

// Filter Chip Component
const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      active 
        ? 'bg-sky-500 text-white shadow-md' 
        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
    }`}
  >
    {label}
  </button>
);

// Compare Bar Component
const CompareBar = ({ selectedPlans, onClear }) => {
  if (selectedPlans.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-sky-200 shadow-2xl z-50 p-4 animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-900">
            {selectedPlans.length} plan{selectedPlans.length > 1 ? 's' : ''} selected
          </span>
          <button 
            onClick={onClear}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
          Compare Plans
        </button>
      </div>
    </div>
  );
};

const ProductsPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showFilters, setShowFilters] = useState(false);

  const plans = [
    {
      name: "Medicare Advantage",
      members: 1247,
      premium: "$0",
      type: "Part C",
      color: "bg-gradient-to-br from-sky-50 to-blue-50",
      badgeColor: "bg-blue-100 text-blue-700",
      iconColor: "from-blue-500 to-blue-600",
      satisfaction: 94,
      deductible: "$500",
      ageEligibility: "65+",
      benefits: ["Hospital Coverage", "Doctor Visits", "Preventive Care", "Prescription Drugs"],
      category: "advantage"
    },
    {
      name: "Medicare Supplement",
      members: 834,
      premium: "$156",
      type: "Medigap",
      color: "bg-gradient-to-br from-emerald-50 to-teal-50",
      badgeColor: "bg-emerald-100 text-emerald-700",
      iconColor: "from-green-500 to-green-600",
      satisfaction: 89,
      deductible: "$226",
      ageEligibility: "65+",
      benefits: ["Medicare Gaps", "Foreign Travel", "Out-of-Pocket Costs", "Coinsurance"],
      category: "supplement"
    },
    {
      name: "Medicare Part D",
      members: 2103,
      premium: "$32",
      type: "Prescription",
      color: "bg-gradient-to-br from-purple-50 to-pink-50",
      badgeColor: "bg-purple-100 text-purple-700",
      iconColor: "from-purple-500 to-purple-600",
      satisfaction: 92,
      deductible: "$505",
      ageEligibility: "65+",
      benefits: ["Brand Drugs", "Generic Drugs", "Pharmacy Network", "Mail Order"],
      category: "prescription"
    },
  ];

  const togglePlanSelection = (planName) => {
    setSelectedPlans(prev => 
      prev.includes(planName) 
        ? prev.filter(p => p !== planName)
        : [...prev, planName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-white py-16 px-6 rounded-b-3xl shadow-xl mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-12 h-12" />
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Medicare Plans</h1>
          <p className="text-xl text-sky-50 max-w-2xl">
            Comprehensive healthcare coverage designed to protect you and your loved ones. Compare plans, find the perfect match, and enroll with confidence.
          </p>
          <div className="mt-8 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>4,184+ Active Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span>4.8/5 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Trusted Healthcare Partner</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Medicare plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2 font-medium"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 font-semibold">
              <Plus className="w-4 h-4" />
              <span>Add Plan</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Plan Type</label>
                <div className="flex flex-wrap gap-2">
                  <FilterChip label="All Plans" active={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
                  <FilterChip label="Advantage" active={activeFilter === "advantage"} onClick={() => setActiveFilter("advantage")} />
                  <FilterChip label="Supplement" active={activeFilter === "supplement"} onClick={() => setActiveFilter("supplement")} />
                  <FilterChip label="Prescription" active={activeFilter === "prescription"} onClick={() => setActiveFilter("prescription")} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Monthly Premium: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: "Total Members", value: "4,184", color: "from-blue-500 to-blue-600" },
            { icon: TrendingUp, label: "Avg Satisfaction", value: "92%", color: "from-green-500 to-green-600" },
            { icon: Shield, label: "Active Plans", value: "3", color: "from-purple-500 to-purple-600" },
            { icon: Heart, label: "Coverage Rate", value: "98%", color: "from-pink-500 to-pink-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <AnimatedCard
              key={i}
              className={`p-8 group cursor-pointer overflow-hidden relative border-2 ${
                selectedPlans.includes(plan.name) ? 'border-sky-500 shadow-xl' : 'border-transparent'
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => togglePlanSelection(plan.name)}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    selectedPlans.includes(plan.name)
                      ? 'bg-sky-500 border-sky-500'
                      : 'border-gray-300 hover:border-sky-400'
                  }`}
                >
                  {selectedPlans.includes(plan.name) && <Check className="w-4 h-4 text-white" />}
                </button>
              </div>

              {/* Background Gradient */}
              <div className={`absolute inset-0 ${plan.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-14 h-14 bg-gradient-to-br ${plan.iconColor} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors duration-200">
                    {plan.name}
                  </h4>
                  <PlanBadge type={plan.type} color={plan.badgeColor} />
                </div>

                {/* Key Metrics */}
                <div className="space-y-4 mb-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Monthly Premium</span>
                      <span className="text-2xl font-bold text-emerald-600">{plan.premium}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Deductible</span>
                      <span className="font-semibold text-gray-900">{plan.deductible}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Active Members</span>
                    <span className="text-lg font-bold text-gray-900">
                      {plan.members.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Age Eligibility</span>
                    <span className="text-lg font-bold text-gray-900">{plan.ageEligibility}</span>
                  </div>

                  {/* Satisfaction Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Member Satisfaction</span>
                      <span className="font-bold text-gray-900">{plan.satisfaction}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 bg-gradient-to-r ${plan.iconColor} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                        style={{ width: `${plan.satisfaction}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <Check className="w-4 h-4 mr-2 text-teal-500" />
                    Coverage Benefits
                  </h5>
                  <div className="space-y-2 bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    {plan.benefits.map((benefit, idx) => (
                      <BenefitItem key={idx} icon={Check} text={benefit} />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    View Details
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 px-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg font-medium hover:bg-white hover:shadow-md transition-all duration-200 text-sm">
                      Compare
                    </button>
                    <button className="py-2 px-4 bg-white/80 backdrop-blur-sm text-sky-600 rounded-lg font-medium hover:bg-white hover:shadow-md transition-all duration-200 text-sm">
                      Enroll Now
                    </button>
                  </div>
                </div>

                {/* Hover Action Icons */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ActionButton icon={Eye} variant="secondary" tooltip="View Details" />
                  <ActionButton icon={Edit} variant="primary" tooltip="Edit Plan" />
                  <ActionButton icon={Settings} variant="secondary" tooltip="Plan Settings" />
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-2xl p-8 text-white text-center shadow-xl">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 mr-3" />
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold mb-2">Trusted by Over 1 Million Users</h3>
          <p className="text-sky-50 text-lg">
            Join thousands of satisfied members who trust us with their healthcare coverage
          </p>
        </div>
      </div>

      {/* Compare Bar */}
      <CompareBar 
        selectedPlans={selectedPlans} 
        onClear={() => setSelectedPlans([])} 
      />

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductsPanel;