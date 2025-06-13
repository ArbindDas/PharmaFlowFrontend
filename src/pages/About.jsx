import { useState, useEffect } from 'react';
import { Heart, Users, Clock, Award, Shield, Truck } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Patient-Centered Care",
      description: "Your health and wellbeing are at the heart of everything we do"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Team",
      description: "Licensed pharmacists and healthcare professionals ready to help"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Fast Service",
      description: "Quick prescription filling and efficient delivery services"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Assured",
      description: "High-quality pharmaceutical products from trusted suppliers"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "19+ Years Experience",
      description: "Serving the community with excellence since 2005"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Competitive Pricing",
      description: "Affordable healthcare solutions without compromising quality"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "19+", label: "Years of Service" },
    { number: "24/7", label: "Support Available" },
    { number: "99.8%", label: "Customer Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
        <div className={`max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
              About MediCare
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your trusted healthcare partner, dedicated to providing exceptional pharmaceutical care 
              and wellness solutions for over two decades.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/70 backdrop-blur-sm border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center transform transition-all duration-700 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{transitionDelay: `${index * 200}ms`}}
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className={`mb-20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-green-500 rounded-full mr-6"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Story</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Since our founding in 2005, MediCare Pharmacy has been more than just a pharmacy – 
                    we've been a cornerstone of community health and wellness. What started as a small 
                    neighborhood pharmacy has grown into a trusted healthcare destination.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our team of licensed pharmacists and healthcare professionals brings decades of 
                    combined experience, ensuring every customer receives personalized attention and 
                    expert guidance for their unique health journey.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We believe healthcare should be accessible, affordable, and delivered with compassion. 
                    That's why we've built our reputation on exceptional customer service, competitive 
                    pricing, and a genuine commitment to your wellbeing.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl blur-xl opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl p-8 text-white">
                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                    <p className="text-blue-100 leading-relaxed">
                      To enhance the health and quality of life in our community by providing 
                      exceptional pharmaceutical care, personalized service, and innovative 
                      healthcare solutions that exceed expectations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose MediCare?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the difference that personalized pharmaceutical care can make in your health journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 
                           hover:shadow-2xl hover:border-blue-200 transition-all duration-300 cursor-pointer
                           hover:-translate-y-2 ${activeFeature === index ? 'ring-2 ring-blue-500 shadow-2xl' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
                style={{transitionDelay: `${index * 100}ms`}}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                                bg-gradient-to-br from-blue-500 to-green-500 text-white
                                group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`mt-20 text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Better Healthcare?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust MediCare for their pharmaceutical needs
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg 
                               hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 
                               shadow-lg hover:shadow-xl">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;