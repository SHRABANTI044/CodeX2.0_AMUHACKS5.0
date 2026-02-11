import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
          Boost Your Grades with Our Academic Recovery Dashboard
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-8 rounded-full"></div>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Get back on track with personalized study plans and real-time progress tracking.
        </p>
        <Link
          to="/input"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-block"
        >
          Get Started
        </Link>
      </div>

      {/* Feature Section */}
      <div className="w-full max-w-7xl mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 border border-gray-100 text-center transform hover:-translate-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 hover:text-blue-700 mb-4 transition-colors duration-300">Personalized Study Plans</h3>
            <p className="text-gray-600 leading-relaxed">
              Create a customized academic recovery strategy based on your backlog subjects and learning pace.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300 border border-gray-100 text-center transform hover:-translate-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 hover:text-indigo-700 mb-4 transition-colors duration-300">Real-Time Progress Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor your completion percentage and adjust your study schedule dynamically.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 border border-gray-100 text-center transform hover:-translate-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 hover:text-purple-700 mb-4 transition-colors duration-300">Smart Time Management</h3>
            <p className="text-gray-600 leading-relaxed">
              Plan your available study hours efficiently and recover faster without stress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
