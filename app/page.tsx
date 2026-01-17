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
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🚗</span>
            </div>
            <span className="text-white font-bold text-xl">CarExpert</span>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/login"
              className="text-white hover:text-blue-300 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link 
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              🚀 Expert Car Diagnostics
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Car's
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"> Digital Mechanic</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Get instant, professional car diagnostics powered by advanced expert system technology. 
            Identify problems, understand solutions, and save money on repairs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link 
              href="/register"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Start Free Diagnosis
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
            <Link 
              href="/login"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-400 text-sm">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">30+</div>
              <div className="text-gray-400 text-sm">Car Symptoms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">8</div>
              <div className="text-gray-400 text-sm">Fault Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Our expert system uses advanced algorithms to analyze your car's symptoms and provide accurate diagnoses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Select Symptoms</h3>
              <p className="text-gray-300 leading-relaxed">
                Choose from our comprehensive list of car symptoms organized by category. The more accurate your selection, the better the diagnosis.
              </p>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Expert Analysis</h3>
              <p className="text-gray-300 leading-relaxed">
                Our expert system analyzes your symptoms using advanced rule-based algorithms to identify the most likely causes with confidence levels.
              </p>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Get Solutions</h3>
              <p className="text-gray-300 leading-relaxed">
                Receive detailed repair instructions, cost estimates, difficulty levels, and required tools for each identified problem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Why Choose CarExpert?
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Save time and money with our intelligent car diagnostic system that provides professional-grade analysis instantly.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Instant Diagnosis</h4>
                      <p className="text-gray-400">Get immediate results without waiting for mechanic appointments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Cost Estimates</h4>
                      <p className="text-gray-400">Know repair costs upfront to budget and avoid surprises</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Track History</h4>
                      <p className="text-gray-400">Maintain complete records of all your vehicle consultations</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <span className="text-white">Engine Overheating</span>
                      <span className="text-green-400 font-semibold">95% Match</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <span className="text-white">Coolant Leak Detected</span>
                      <span className="text-yellow-400 font-semibold">Est. $200</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <span className="text-white">Repair Difficulty</span>
                      <span className="text-blue-400 font-semibold">Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Diagnose Your Car?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of car owners who trust CarExpert for reliable, instant vehicle diagnostics.
          </p>
          <Link 
            href="/register"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Start Your Free Diagnosis Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🚗</span>
              </div>
              <span className="text-white font-bold">CarExpert</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 CarExpert. Advanced car diagnostic system.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}