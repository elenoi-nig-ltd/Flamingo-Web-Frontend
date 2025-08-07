// components/Header.tsx
import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';

const Header = () => {
  // Define dropdown items for each category
  const menuItems = {
    home: [],
    foodDrinks: [
      { name: "French Fries", href: "#" },
      { name: "Showarma", href: "#" },
      { name: "Burgers", href: "#" },
      { name: "Beverages", href: "#" }
    ],
    homeItems: [
      { name: "Furniture", href: "#" },
      { name: "Kitchenware", href: "#" },
      { name: "Decor", href: "#" },
      { name: "Bedding", href: "#" }
    ],
    internet: [
      { name: "Home Internet", href: "#" },
      { name: "Mobile Plans", href: "#" },
      { name: "Business Solutions", href: "#" }
    ],
    realEstates: [
      { name: "Residential", href: "#" },
      { name: "Commercial", href: "#" },
      { name: "Vacation Homes", href: "#" }
    ],
    signupPlanning: [
      { name: "Events", href: "#" },
      { name: "Consultation", href: "#" },
      { name: "Packages", href: "#" }
    ]
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        
         <div className="flex items-center">
          <Image 
            src={'/assets/icons/logo.jpg'}
            alt="Flamingo Logo"
            width={160} // Adjust based on your logo dimensions
            height={60}
            className="h-12 w-auto" // Maintain aspect ratio
          />
        </div>
        <nav className="hidden md:flex space-x-6">
          {/* Home Link */}
          <div className="group relative">
            <a href="#" className="flex items-center text-gray-700 hover:text-pink-600">
              Home
              <FaChevronDown className="ml-1 text-xs opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Food & Drinks Link with Dropdown */}
          <div className="group relative">
            <a href="#" className="flex items-center text-gray-700 hover:text-pink-600">
              Food & Drinks
              <FaChevronDown className="ml-1 text-xs opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {menuItems.foodDrinks.map((item, index) => (
                <a key={index} href={item.href} 
                   className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Home Items Link with Dropdown */}
          <div className="group relative">
            <a href="#" className="flex items-center text-gray-700 hover:text-pink-600">
              Home Items
              <FaChevronDown className="ml-1 text-xs opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {menuItems.homeItems.map((item, index) => (
                <a key={index} href={item.href} 
                   className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Internet Link with Dropdown */}
          <div className="group relative">
            <a href="#" className="flex items-center text-gray-700 hover:text-pink-600">
              Internet
              <FaChevronDown className="ml-1 text-xs opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {menuItems.internet.map((item, index) => (
                <a key={index} href={item.href} 
                   className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Real Estates Link with Dropdown */}
          <div className="group relative">
            <a href="#" className="flex items-center text-gray-700 hover:text-pink-600">
              Real Estates
              <FaChevronDown className="ml-1 text-xs opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {menuItems.realEstates.map((item, index) => (
                <a key={index} href={item.href} 
                   className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Signup Planning Link with Dropdown */}
          <div className="group relative">
            <a href="#" className="flex items-center text-gray-700 hover:text-pink-600">
              Signup Planning
              <FaChevronDown className="ml-1 text-xs opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {menuItems.signupPlanning.map((item, index) => (
                <a key={index} href={item.href} 
                   className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </nav>
        <button className="md:hidden text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;