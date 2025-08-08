
import React from 'react';
import Image from 'next/image';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={'/assets/images/hero-section.jpg'}
            alt="Flamingo Hero Background"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Flamingo Logo/Text - Repeating as in your design */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">FLAMINGO</h1>
         
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Welcome to Flamingo: Your One-Stop Destination
            </h2>
            
            <div className="bg-white bg-opacity-80 p-6 md:p-8 rounded-lg max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-gray-800 mb-4">
                Discover Flamingo, a unified brand featuring four distinct branches:
              </p>
              <p className="text-lg md:text-xl text-gray-800 font-semibold mb-2">
                Flamingo French Fries, Flamingo Enterprises, Flamingo Internet, and Flourish Real Estates.
              </p>
              <p className="text-lg md:text-xl text-gray-800">
                Each branch is dedicated to providing exceptional products and services tailored to your everyday needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Explore Our Unique Offerings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Food & Snacks */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Food & Snacks</h3>
                <p className="text-gray-600 mb-4">
                  Delicious meals and snacks for every craving. Savor our diverse menu featuring fries, showarma, and more for a delightful experience.
                </p>
                <div className="flex space-x-3">
                  <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors">
                    Order
                  </button>
                  <button className="border border-pink-600 text-pink-600 px-4 py-2 rounded hover:bg-pink-50 transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>

            {/* Household section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Quality Goods for Your Home</h3>
                <p className="text-gray-600 mb-4">
                  Everything you need for a comfortable living space.
                </p>
                <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors">
                  Shop
                </button>
              </div>
            </div>

            {/* Home Goods */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3"> Real Estates</h3>
                <p className="text-gray-600 mb-4">
                  Explore our estates and lodges of your choice.
                </p>
                <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors">
                  Explore
                </button>
              </div>
            </div>

            {/* Internet Services */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Fast and Reliable Internet Services</h3>
                <p className="text-gray-600 mb-4">
                  Stay connected with our affordable internet plans.
                </p>
                <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">FLAMINGO</h2>
              <p className="text-gray-400 mt-2">One-Stop Destination for all your needs</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-pink-400">About Us</a>
              <a href="#" className="hover:text-pink-400">Contact</a>
              <a href="#" className="hover:text-pink-400">Privacy Policy</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Flamingo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;