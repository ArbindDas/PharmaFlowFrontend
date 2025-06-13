import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, User, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Our Pharmacy",
      details: "123 Health Street, Medical City, MC 12345",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: "(123) 456-7890",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "info@medicare.com",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: "Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-5PM",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.length < 10) {
          error = 'Message must be at least 10 characters';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate the field in real-time
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    let formIsValid = true;
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) formIsValid = false;
    });
    
    setErrors(newErrors);
    
    if (formIsValid) {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Reset form after success animation
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
        <div className={`max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about your medications or need personalized healthcare advice? 
              Our friendly team is here to help you every step of the way.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Contact Info Cards */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 
                           hover:shadow-2xl hover:border-blue-200 transition-all duration-300 cursor-pointer
                           hover:-translate-y-2`}
                style={{transitionDelay: `${index * 150}ms`}}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4
                                bg-gradient-to-r ${info.color} text-white
                                group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {info.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {info.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '400ms'}}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="flex items-center mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-green-500 rounded-full mr-4"></div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Send Us a Message</h2>
                    <p className="text-gray-600 mt-1">We'll get back to you within 24 hours</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} 
                                   rounded-xl focus:outline-none focus:ring-2 transition-all duration-300
                                   bg-white/50 backdrop-blur-sm hover:bg-white/80`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} 
                                   rounded-xl focus:outline-none focus:ring-2 transition-all duration-300
                                   bg-white/50 backdrop-blur-sm hover:bg-white/80`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Your Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} 
                                   rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none
                                   bg-white/50 backdrop-blur-sm hover:bg-white/80`}
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 
                               transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300
                               ${isSubmitted 
                                 ? 'bg-green-500 text-white' 
                                 : isSubmitting 
                                   ? 'bg-gray-400 text-white cursor-not-allowed'
                                   : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl'
                               }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {isSubmitted ? (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          <span>Message Sent Successfully!</span>
                        </>
                      ) : isSubmitting ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Why Contact Us Section */}
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '600ms'}}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-full">
              <div className="p-8 md:p-10">
                <div className="flex items-center mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-4"></div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Contact Us?</h2>
                    <p className="text-gray-600 mt-1">Here's how we can help you</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">💊</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Medication Questions</h3>
                      <p className="text-gray-600 text-sm">Get expert advice about your prescriptions, dosages, and potential interactions.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-2xl bg-green-50/50 border border-green-100">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🚚</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Delivery Services</h3>
                      <p className="text-gray-600 text-sm">Learn about our fast and reliable prescription delivery options.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">💰</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Insurance & Pricing</h3>
                      <p className="text-gray-600 text-sm">Questions about insurance coverage, pricing, or payment options? We're here to help.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🏥</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Health Consultations</h3>
                      <p className="text-gray-600 text-sm">Schedule a consultation with our licensed pharmacists for personalized health advice.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl text-white">
                  <h3 className="text-xl font-bold mb-2">Quick Response Guarantee</h3>
                  <p className="text-blue-100">We respond to all inquiries within 24 hours during business days. For urgent medication questions, please call us directly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;