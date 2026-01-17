import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">🚗</span>
            </div>
            <span className="text-white font-bold text-lg sm:text-xl">CarExpert</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              href="/login"
              className="text-white hover:text-blue-300 transition-colors font-medium text-sm sm:text-base"
            >
              Sign In
            </Link>
            <Link 
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <span className="inline-block bg-blue-500/20 text-blue-300 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
              🚀 Expert Car Diagnostics
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Your Car's
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"> Digital Mechanic</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Get instant, professional car diagnostics powered by advanced expert system technology. 
            Identify problems, understand solutions, and save money on repairs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
            <Link 
              href="/register"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Start Free Diagnosis
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
            <Link 
              href="/login"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-xl"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-16 px-4">
            <div className="text-center p-3 sm:p-0">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">95%</div>
              <div className="text-gray-400 text-xs sm:text-sm">Accuracy Rate</div>
            </div>
            <div className="text-center p-3 sm:p-0">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">30+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Car Symptoms</div>
            </div>
            <div className="text-center p-3 sm:p-0">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">8</div>
              <div className="text-gray-400 text-xs sm:text-sm">Fault Categories</div>
            </div>
            <div className="text-center p-3 sm:p-0">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">24/7</div>
              <div className="text-gray-400 text-xs sm:text-sm">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-12 sm:py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Our expert system uses advanced algorithms to analyze your car's symptoms and provide accurate diagnoses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="group bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto sm:mx-0">
                <span className="text-xl sm:text-2xl">🔍</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 text-center sm:text-left">Select Symptoms</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base text-center sm:text-left">
                Choose from our comprehensive list of car symptoms organized by category. The more accurate your selection, the better the diagnosis.
              </p>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto sm:mx-0">
                <span className="text-xl sm:text-2xl">🧠</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 text-center sm:text-left">Expert Analysis</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base text-center sm:text-left">
                Our expert system analyzes your symptoms using advanced rule-based algorithms to identify the most likely causes with confidence levels.
              </p>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto sm:mx-0">
                <span className="text-xl sm:text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 text-center sm:text-left">Get Solutions</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base text-center sm:text-left">
                Receive detailed repair instructions, cost estimates, difficulty levels, and required tools for each identified problem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 text-center lg:text-left">
                  Why Choose CarExpert?
                </h2>
                <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 text-center lg:text-left">
                  Save time and money with our intelligent car diagnostic system that provides professional-grade analysis instantly.
                </p>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                      <span className="text-white text-xs sm:text-sm">✓</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Instant Diagnosis</h4>
                      <p className="text-gray-400 text-sm sm:text-base">Get immediate results without waiting for mechanic appointments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                      <span className="text-white text-xs sm:text-sm">✓</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Cost Estimates</h4>
                      <p className="text-gray-400 text-sm sm:text-base">Know repair costs upfront to budget and avoid surprises</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                      <span className="text-white text-xs sm:text-sm">✓</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Track History</h4>
                      <p className="text-gray-400 text-sm sm:text-base">Maintain complete records of all your vehicle consultations</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative order-1 lg:order-2">
                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/20">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white/10 rounded-xl">
                      <span className="text-white text-sm sm:text-base">Engine Overheating</span>
                      <span className="text-green-400 font-semibold text-sm sm:text-base">95% Match</span>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white/10 rounded-xl">
                      <span className="text-white text-sm sm:text-base">Coolant Leak Detected</span>
                      <span className="text-yellow-400 font-semibold text-sm sm:text-base">Est. $200</span>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white/10 rounded-xl">
                      <span className="text-white text-sm sm:text-base">Repair Difficulty</span>
                      <span className="text-blue-400 font-semibold text-sm sm:text-base">Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-12 sm:py-20 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Diagnose Your Car?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of car owners who trust CarExpert for reliable, instant vehicle diagnostics.
          </p>
          <Link 
            href="/register"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Start Your Free Diagnosis Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 sm:py-12 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">🚗</span>
              </div>
              <span className="text-white font-bold text-sm sm:text-base">CarExpert</span>
            </div>
            <div className="text-gray-400 text-xs sm:text-sm text-center">
              © 2024 CarExpert. Advanced car diagnostic system.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}