import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myimage from "../assets/myimage.png";
import { APP_FEATURES } from "../utils/data";
import Login from './Auth/Login'; // Import your Login component
import SignUp from './Auth/SignUp'; // Import your SignUp component

// Create a modal wrapper for the auth components
const AuthModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-auto">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentAuthPage, setCurrentAuthPage] = useState("login");

  const handleCTA = () => {
    setShowAuthModal(true);
    setCurrentAuthPage("login");
  };

  const closeModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <div className="w-full min-h-screen bg-[#FFFCEF]">
        <div className="w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-4 sm:left-10 lg:left-20" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-4 pt-4 sm:pt-6 pb-[100px] sm:pb-[150px] lg:pb-[200px] relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-8 sm:mb-12 lg:mb-16">
            <div className="text-lg sm:text-xl text-black font-bold">
              Interview Prep AI
            </div>
            <button 
              className="bg-gradient-to-r from-[#FFFCEF] to-[#e99a4b] text-xs sm:text-sm font-semibold text-white px-4 sm:px-6 lg:px-7 py-2 sm:py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
              onClick={() => {
                setShowAuthModal(true);
                setCurrentAuthPage("login");
              }}
            >
              <span className="hidden sm:inline">Login / Sign Up</span>
              <span className="sm:hidden">Login</span>
            </button>
          </header>

          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="flex items-center gap-2 text-xs sm:text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  AI Powered
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-black font-medium mb-4 sm:mb-6 leading-tight">
                Ace Interviews with <br className="hidden sm:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9324] to-[#FCD760] font-semibold">
                  AI-Powered
                </span> {" "}
                Learning
              </h1>

              <p className="text-sm sm:text-base lg:text-[17px] text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery - your ultimate interview toolkit is here.
              </p>

              <button
                className="bg-black text-xs sm:text-sm font-semibold text-white px-6 sm:px-7 py-2 sm:py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer mb-6 sm:mb-8"
                onClick={handleCTA}
              >
                Get Started 
              </button>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2 flex justify-center mt-6 lg:mt-0">
              <div className="relative">
                <img 
                  src={myimage} 
                  alt="Interview Prep AI Dashboard" 
                  className="w-full max-w-xs sm:max-w-sm lg:max-w-lg rounded-2xl shadow-2xl border border-gray-200"
                />
                <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 bg-gradient-to-r from-[#FF9324] to-[#FCD760] rounded-full blur-xl opacity-60"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <section className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Features That Make You Shine
              </h2>
              <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
                Discover powerful tools designed to elevate your interview preparation and boost your confidence
              </p>

              <div className="space-y-12">
                {/* First 3 cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {APP_FEATURES.slice(0, 3).map((feature) => (
                    <div 
                      key={feature.id} 
                      className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-[#FF9324] to-[#FCD760] rounded-lg mb-6 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{feature.id}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Remaining cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {APP_FEATURES.slice(3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-[#FF9324] to-[#FCD760] rounded-lg mb-6 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{feature.id}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300 text-sm">
              Made with ❤️ by <span className="text-amber-400 font-semibold">Gugulethu Mngomezulu</span> - Happy Coding!
            </p>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={closeModal}>
        {currentAuthPage === "login" ? (
          <Login setCurrentPage={setCurrentAuthPage} />
        ) : (
          <SignUp setCurrentPage={setCurrentAuthPage} />
        )}
      </AuthModal>
    </>
  );
}

export default LandingPage;