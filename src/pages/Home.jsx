
import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  UserCheck, 
  Clock, 
  Shield, 
  Phone, 
  Star, 
  ChevronRight, 
  X, 
  Heart, 
  Award,
  MapPin,
  CheckCircle,
  Package
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Fixed import

const Home = () => {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showConsultationPopup, setShowConsultationPopup] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const { isDarkMode } = useTheme(); // Fixed syntax

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Page loading sequence
    const loadingTimer = setTimeout(() => {
      setShowLoader(false);
      setPageLoaded(true);
    }, 1500);
    
    // Show welcome popup after page loads
    const welcomeTimer = setTimeout(() => setShowWelcomePopup(true), 2500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(loadingTimer);
      clearTimeout(welcomeTimer);
    };
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Amazing service! Got my prescription delivered within 2 hours. The pharmacist even called to explain the dosage.",
      rating: 5,
      location: "New York"
    },
    {
      name: "Michael Chen",
      text: "Best pharmacy app I've used. The consultation feature saved me a trip to the doctor.",
      rating: 5,
      location: "California"
    },
    {
      name: "Emma Rodriguez",
      text: "Reliable, fast, and professional. They always have what I need in stock.",
      rating: 5,
      location: "Texas"
    }
  ];

  // Loading Screen Component with Dark Mode
  const LoadingScreen = () => (
    <div className={`fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center z-50 transition-all duration-700 ${showLoader ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-white border-opacity-30 rounded-full animate-spin">
            <div className="w-6 h-6 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">MediCare Pharmacy</h2>
        <p className="text-white text-opacity-90 text-lg">Loading your health companion...</p>
        <div className="mt-6 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );

  const WelcomePopup = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-all duration-500 ${showWelcomePopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-3xl p-10 max-w-lg mx-4 transform transition-all duration-700 ${showWelcomePopup ? 'scale-100 translate-y-0 rotate-0' : 'scale-75 translate-y-8 rotate-3'}`}>
        <button 
          onClick={() => setShowWelcomePopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:rotate-90"
        >
          <X size={24} />
        </button>
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Heart className="text-white" size={36} />
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Welcome to MediCare! 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
            Your health is our priority. Discover premium medicines, expert consultations, and lightning-fast delivery.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={16} />
                <span>Licensed Pharmacists</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={16} />
                <span>24/7 Support</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  setShowWelcomePopup(false);
                  document.getElementById('medicines-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Explore Now
              </button>
              <button 
                onClick={() => {
                  setShowWelcomePopup(false);
                  setShowConsultationPopup(true);
                }}
                className="flex-1 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 py-3 px-6 rounded-full font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Get Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ConsultationPopup = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${showConsultationPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg mx-4 transform transition-all duration-300 ${showConsultationPopup ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <button 
          onClick={() => setShowConsultationPopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="text-white" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free Consultation</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Connect with our licensed pharmacists for personalized health advice.</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Clock className="text-indigo-600 dark:text-indigo-400 mb-2" size={24} />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">24/7 Available</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Shield className="text-indigo-600 dark:text-indigo-400 mb-2" size={24} />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Confidential</p>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105">
            Start Consultation
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Loading Screen */}
      <LoadingScreen />
      
      {/* Main Content */}
      <div className={`transition-all duration-1000 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Floating Action Button */}
        <button 
          onClick={() => setShowConsultationPopup(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40"
        >
          <Phone size={24} />
        </button>

        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-100"
            style={{ width: `${Math.min((scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className={`text-center py-16 relative overflow-hidden transition-all duration-1000 delay-300 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-30 rounded-3xl transform -rotate-1"></div>
            <div className="relative z-10">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-pulse">
                Welcome to MediCare Pharmacy
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Your trusted partner for quality medicines and healthcare products. 
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold"> Experience healthcare reimagined.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/medicine"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  Browse Medicines
                  <ChevronRight size={20} />
                </a>
                <button 
                  onClick={() => setShowConsultationPopup(true)}
                  className="border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Free Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 my-16 transition-all duration-1000 delay-500 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {[
              { number: "50K+", label: "Happy Customers", icon: Heart },
              { number: "1000+", label: "Medicines Available", icon: Package },
              { number: "24/7", label: "Customer Support", icon: Clock },
              { number: "99%", label: "Satisfaction Rate", icon: Award }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <stat.icon className="text-indigo-600 dark:text-indigo-400 mx-auto mb-3" size={32} />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div id="medicines-section" className={`grid grid-cols-1 md:grid-cols-3 gap-8 my-16 transition-all duration-1000 delay-700 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {[
              {
                icon: Package,
                title: "Wide Selection",
                description: "Over 1000+ medicines and healthcare products in stock with guaranteed authenticity",
                color: "from-blue-500 to-indigo-600"
              },
              {
                icon: Truck,
                title: "Lightning Fast Delivery",
                description: "Same-day delivery available for urgent orders. Free delivery on orders above $50",
                color: "from-green-500 to-teal-600"
              },
              {
                icon: UserCheck,
                title: "Expert Consultation",
                description: "Consult with our licensed pharmacists 24/7 for personalized healthcare advice",
                color: "from-purple-500 to-pink-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105">
                <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 mt-4 group-hover:translate-x-2 transition-transform duration-300">
                  <span className="font-semibold">Learn More</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className={`my-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 transition-all duration-1000 delay-900 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">What Our Customers Say</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transform transition-all duration-500">
                <div className="flex items-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonials[currentTestimonial].name}</p>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mr-1" />
                      <span>{testimonials[currentTestimonial].location}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className={`my-16 text-center transition-all duration-1000 delay-1000 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Why Choose MediCare?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "FDA Approved", desc: "All medicines are FDA certified" },
                { icon: CheckCircle, title: "Quality Assured", desc: "100% authentic products" },
                { icon: Clock, title: "24/7 Support", desc: "Round the clock assistance" },
                { icon: Award, title: "Licensed Pharmacists", desc: "Expert medical guidance" }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  <item.icon className="text-indigo-600 dark:text-indigo-400 mb-3" size={32} />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className={`my-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden transition-all duration-1000 delay-1100 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="absolute inset-0 bg-white opacity-10 transform rotate-12 scale-150"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Experience Better Healthcare?</h2>
              <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers who trust MediCare for their health needs.</p>
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      <WelcomePopup />
      <ConsultationPopup />
    </div>
  );
};

export default Home;